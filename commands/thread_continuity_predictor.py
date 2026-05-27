#!/usr/bin/env python3
"""
V25 Wave 5 — Thread Continuity Intelligence

Integrates thread_merger.py logic into the V25 pipeline so that:
  • Split threads on the same topic (same sender domain + similar subject)
    are detected before reply-all decision.
  • All participants from the split cluster are added to CC list.
  • Participants mentioned in thread body but missing from CC are surfaced.

Public API
  predict_thread_participants(thread_id: str, sender: str,
                              subject: str, dry_run=True) -> dict

Returns:
  {
    'original_thread_id':   str,
    'merged_participants':  list[str],   # sender + all CCs from cluster
    'all_participants':     list[str],   # original + secondary thread participants
    'detected_splits':      list[str],   # thread_ids that were merged
    'missing_from_cc':      list[str],   # mentioned in body but not in CC
    'new_cc_candidates':    list[str],   # safe CC additions
    'confidence':           float,       # 0.0–1.0
  }

When enrolled (enrolled=True) performs real Gmail API lookups.
In dry-run mode works off stub data + in-memory history.
"""

import json, re, time
from datetime import datetime, timezone, timedelta
from pathlib import Path
from collections import defaultdict

WORKSPACE = Path(__file__).resolve().parent.parent.parent
DATA      = WORKSPACE / 'data'
TC_STORE  = DATA / 'thread_continuity_v25.json'
TC_LOG    = DATA / 'thread_continuity_log.jsonl'
LOOKBACK_DAYS = 30
SIMILARITY_THRESHOLD = 0.8  # Jaccard word-overlap on cleaned subject

sys_path_flag = False
if str(WORKSPACE / 'commands') not in __import__('sys').path:
    import sys
    sys.path.insert(0, str(WORKSPACE / 'commands'))
    sys_path_flag = True

try:
    from google_workspace import gmail_search, gmail_get, gmail_batch_modify, gmail_get_or_create_label_id
    HAS_GMAIL = True
except Exception:
    HAS_GMAIL = False
    def gmail_search(query, limit=20):                    return []
    def gmail_get(message_id):                                  return {}
    def gmail_batch_modify(payload, addLabelIds=None, removeLabelIds=None): None
    def gmail_get_or_create_label_id(name):               return f'label-{name}'


# ── Logging ──────────────────────────────────────────────────

def _log(event: dict):
    try:
        with open(TC_LOG, 'a') as f:
            f.write(json.dumps({
                **event,
                'ts': datetime.now(timezone.utc).isoformat()
            }, ensure_ascii=False) + '\n')
    except Exception:
        pass


# ── Persistence ──────────────────────────────────────────────

def load_store() -> dict:
    if TC_STORE.exists():
        try:
            return json.loads(TC_STORE.read_text())
        except Exception:
            pass
    return {
        'known_splits': {},   # thread_id -> {cluster_id, primary_thread_id}
        'cluster_map':  {},   # cluster_id -> list[thread_id]
        'secondary_thread_participants': {},  # thread_id -> [emails]
        'last_run': None,
        'stats': {'splits_detected': 0, 'cc_additions': 0, 'dry_run_evals': 0},
    }

def save_store(store: dict):
    try:
        TC_STORE.write_text(json.dumps(store, indent=2))
    except Exception:
        pass


# ── Helpers ──────────────────────────────────────────────────

def clean_subject(s: str) -> str:
    """Strip Re:/Fwd: and lower-case."""
    return re.sub(r'^(re|fwd?):\s*', '', s.lower()).strip()

def extract_sender_domain(sender: str) -> str:
    m = re.search(r'@([\w.-]+)', sender)
    return m.group(1).lower() if m else 'unknown'

def extract_participants_from_message(msg: dict) -> list[str]:
    """Get all email addresses from a Gmail message."""
    rv = {'from_email': m.get('from') for m in [msg] if 'from' in m}
    headers = msg.get('payload', {}).get('headers', [])
    emails = set()
    for h in headers:
        n = h.get('name', '').lower()
        v = h.get('value', '')
        if n in ('from', 'to', 'cc'):
            # Split multi-address headers
            for addr in re.findall(r'<([^>]+)>', v):
                emails.add(addr)
            for bare in re.findall(r'[\w.+-]+@[\w.-]+', v):
                emails.add(bare)
    return sorted(e for e in emails if '@' in e)


# ── Cluster Detection (from thread_merger.py core) ───────────

def fetch_unread_threads(limit: int = 50) -> list[dict]:
    """Return recent unread threads as {thread_id, subject, sender, domain}."""
    since = (datetime.utcnow() - timedelta(days=LOOKBACK_DAYS)).strftime('%Y/%m/%d')
    msgs  = gmail_search(f'after:{since} is:unread', limit=limit)
    seen_threads = {}
    for m in msgs:
        tid    = m.get('threadId')
        if not tid or tid in seen_threads:
            continue
        msg    = gmail_get(tid) if m.get('id') != tid else m
        hdrs   = {h['name']: h['value'] for h in
                  msg.get('payload', {}).get('headers', [])}
        seen_threads[tid] = {
            'thread_id': tid,
            'subject':   hdrs.get('Subject', '(no subject)'),
            'sender':    hdrs.get('From', ''),
            'domain':    extract_sender_domain(hdrs.get('From', '')),
        }
    return list(seen_threads.values())

def cluster_similar_subjects(threads: list[dict]) -> list[list[dict]]:
    """Group threads with same domain + subject Jaccard ≥ threshold."""
    clusters = []
    processed: set[str] = set()
    for t in threads:
        tid = t['thread_id']
        if tid in processed:
            continue
        cluster = [t]
        processed.add(tid)
        for other in threads:
            oid = other['thread_id']
            if oid in processed:
                continue
            if other['domain'] != t['domain']:
                continue
            s1 = set(clean_subject(t['subject']).split())
            s2 = set(clean_subject(other['subject']).split())
            if not s1 or not s2:
                continue
            overlap = len(s1 & s2) / min(len(s1), len(s2))
            if overlap >= SIMILARITY_THRESHOLD:
                cluster.append(other)
                processed.add(oid)
        if len(cluster) > 1:
            clusters.append(cluster)
    return clusters

def _choose_primary(cluster: list[dict]) -> str:
    """Primary = oldest by internal date (would be base thread)."""
    # We don't have dates here; return first for dry-run
    return cluster[0]['thread_id']

def _detect_missing_cc(thread_participants: list[str], body_snippet: str) -> list[str]:
    """Find participants mentioned in body but absent from CC list."""
    if not body_snippet:
        return []
    mentions = set(re.findall(r'[\w.+-]+@[\w.-]+', body_snippet))
    return sorted(em for em in mentions if em not in thread_participants)


# ── Main Public API ──────────────────────────────────────────

def predict_thread_participants(thread_id: str,
                                sender:    str,
                                subject:   str,
                                dry_run:   bool = True) -> dict:
    """
    Return unified participant list + split detection for this thread.

    In dry-run: uses in-memory cluster map (no Gmail fetch).
    Live: fetches real unread threads and returns full split analysis.
    """
    t0 = time.monotonic()
    store = load_store()
    result: dict = {
        'original_thread_id':   thread_id,
        'merged_participants':  [sender] + re.findall(r'<([^>]+)>', sender) + [sender.split('<')[-1].strip('>')],
        'all_participants':     [sender],
        'detected_splits':      [],
        'missing_from_cc':      [],
        'new_cc_candidates':    [],
        'confidence':           0.5,
        'source':               'dry_run_stub',
    }

    # Extract sender email cleanly
    sender_email = re.findall(r'<([^>]+)>', sender)
    sender_email = sender_email[0] if sender_email else sender.strip()

    # base participants
    result['merged_participants'] = [sender_email]

    if dry_run:
        # In dry-run: check in-memory store for known splits
        primary_info = store.get('known_splits', {}).get(thread_id)
        if primary_info:
            primary_tid = primary_info['primary_thread_id']
            secondaries = [tid for tid, info in store.get('known_splits', {}).items()
                           if info['primary_thread_id'] == primary_tid
                           and tid != primary_tid]
            # Merge participants
            all_part = [sender_email]
            for tid in [primary_tid] + secondaries:
                all_part.extend(store.get('secondary_thread_participants', {}).get(tid, []))
            result['all_participants']      = sorted(set(all_part))
            result['merged_participants']   = result['all_participants']
            result['detected_splits']       = secondaries
            result['confidence']            = 0.85
            result['source']                = 'store_known_split'
            store['stats']['dry_run_evals'] += 1
            save_store(store)
            _log({'thread_id': thread_id, 'phase': 'dry_run', 'splits': secondaries,
                  'participants': len(result['all_participants']),
                  'elapsed_ms': round((time.monotonic() - t0) * 1000, 1)})
            return result

        # No stored split data — return minimal set
        store['stats']['dry_run_evals'] += 1
        save_store(store)
        _log({'thread_id': thread_id, 'phase': 'dry_run_no_split',
              'elapsed_ms': round((time.monotonic() - t0) * 1000, 1)})
        return result

    # ── Live path: fetch real threads, cluster, merge ───────
    if not HAS_GMAIL:
        return result

    recent_threads = fetch_unread_threads(limit=50)
    # Inject current thread into cluster analysis
    cluster_threads = [{'thread_id': thread_id, 'subject': subject,
                        'sender': sender, 'domain': extract_sender_domain(sender)}]
    for t in recent_threads:
        if t['thread_id'] != thread_id:
            cluster_threads.append(t)

    clusters = cluster_similar_subjects(cluster_threads)

    detected_splits = []
    all_participants = {sender_email: True}
    new_cc = []

    for cluster in clusters:
        primary = _choose_primary(cluster)
        # Collect participants
        for t in cluster:
            payload = gmail_get(t['thread_id'])
            if tid := payload.get('threadId', t['thread_id']):
                try:
                    # fetch recent messages in thread
                    thread_msgs = gmail_search(f'thread:{tid}', limit=10)
                    for tm in thread_msgs:
                        fm = gmail_get(tm['id'])
                        for addr in extract_participants_from_message(fm):
                            all_participants[addr] = True
                            if addr != sender_email and addr not in result['merged_participants']:
                                new_cc.append(addr)
                except Exception:
                    pass

        secondary = [t['thread_id'] for t in cluster if t['thread_id'] != primary]
        # Record in store
        if secondary:
            for tid in secondary:
                store.get('known_splits', {})[tid] = {
                    'primary_thread_id': primary,
                    'original': tid,
                }
                if tid in secondary:
                    store.get('secondary_thread_participants', {})[tid] = list(all_participants.keys())
                    store['stats']['splits_detected'] += 1
            detected_splits.extend(secondary)
        if primary == thread_id and secondary:
            store['stats']['cc_additions'] += len(new_cc)

    save_store(store)

    # Missing from CC: look at body + participant set
    # (narrow scan: check thread first message for any email addresses)
    missing_cc = []
    try:
        fm_first = gmail_get(thread_id)
        snippet  = fm_first.get('snippet', '') or ''
        body_emails = set(re.findall(r'[\w.+-]+@[\w.-]+', snippet))
        for em in body_emails:
            if em not in result['merged_participants'] and em != sender_email:
                missing_cc.append(em)
    except Exception:
        pass

    result.update({
        'merged_participants': [sender_email] + [a for a in sorted(all_participants.keys()) if a != sender_email],
        'all_participants':    sorted(all_participants.keys()),
        'detected_splits':     detected_splits,
        'missing_from_cc':     missing_cc,
        'new_cc_candidates':   sorted(set(new_cc)),
        'confidence':          0.85 if detected_splits else 0.6,
        'source':              'live_gmail',
    })

    elapsed = round((time.monotonic() - t0) * 1000, 1)
    _log({'thread_id': thread_id, 'phase': 'live_analysis',
          'splits': detected_splits, 'participants': len(all_participants),
          'missing_cc': missing_cc, 'new_cc': len(new_cc),
          'elapsed_ms': elapsed})
    save_store(store)
    return result


# ── CLI entry ────────────────────────────────────────────────
if __name__ == '__main__':
    import argparse
    ap = argparse.ArgumentParser(description='V25 Thread Continuity Intelligence')
    ap.add_argument('thread_id', help='Thread ID to analyse')
    ap.add_argument('--sender',    default='Kleber <kleber@ziontechgroup.com>')
    ap.add_argument('--subject',   default='(no subject)')
    ap.add_argument('--execute',   action='store_true', help='Real Gmail fetch (default dry-run)')
    args = ap.parse_args()

    res = predict_thread_participants(args.thread_id, args.sender, args.subject,
                                      dry_run=not args.execute)
    print(f"\nThread: {args.thread_id}")
    print(f"Source: {res['source']}  Confidence: {res['confidence']:.0%}")
    print(f"Participants ({len(res['all_participants'])}): {', '.join(res['all_participants'][:5])}…")
    if res['detected_splits']:
        print(f"\n🔗 Detected {len(res['detected_splits'])} split thread(s): {res['detected_splits']}")
    if res['new_cc_candidates']:
        print(f"\n📋 Suggested CC additions: {', '.join(res['new_cc_candidates'][:5])}")
    if res['missing_from_cc']:
        print(f"\n⚠️  Mentioned but not CC'd: {', '.join(res['missing_from_cc'][:5])}")
    print(f"\nFull result: {json.dumps(res, indent=2)[:800]}…")
