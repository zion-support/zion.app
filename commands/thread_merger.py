#!/usr/bin/env python3
"""
Auto-Email Thread Merger — Zion Tech Group

Detects and merges split email threads about the same topic.
Common cause: client replies from a different email or creates a new thread.
Prevents fragmented conversations and missed follow-ups.

Strategy:
  1. Find recent unread threads (last 30d) with same sender domain
  2. Group by domain + subject similarity (LLM or keyword)
  3. For each cluster, if >1 thread: merge into oldest thread by labeling newer ones 'Merged-Into-<thread_id>'
  4. Optionally send Telegram alert with merge summary

Usage:
  python3 thread_merger.py [--execute]   # Default dry-run; --execute performs merges
"""

import sys, os, re, json, datetime, argparse, hashlib
from pathlib import Path

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, gmail_get, gmail_batch_modify, gmail_get_or_create_label_id, gmail_list_labels, telegram_send
from llm_client import chat

MERGE_DB = WORKSPACE / 'zion.app' / 'data' / 'thread_merges.json'
MERGE_LABEL = 'Merged-Into'
LOOKBACK_DAYS = 30
SIMILARITY_THRESHOLD = 0.8  # subject keyword overlap

def load_merge_db() -> dict:
    if MERGE_DB.exists():
        return json.loads(MERGE_DB.read_text())
    return {'merged': [], 'lastRun': None}

def save_merge_db(db: dict):
    MERGE_DB.parent.mkdir(parents=True, exist_ok=True)
    MERGE_DB.write_text(json.dumps(db, indent=2))

def fetch_recent_threads(limit: int = 30) -> list:
    """Get unread threads from last 30 days."""
    since = (datetime.date.today() - datetime.timedelta(days=LOOKBACK_DAYS)).isoformat()
    query = f'after:{since} is:unread'
    msgs = gmail_search(query, limit=limit)
    threads = {}
    for m in msgs:
        tid = m.get('threadId')
        if not tid:
            continue
        threads.setdefault(tid, []).append(m)
    thread_list = []
    for tid, msgs in threads.items():
        first = msgs[0]
        headers = {h['name']: h['value'] for h in first.get('payload',{}).get('headers',[])}
        subject = headers.get('Subject','(no subject)')
        from_hdr = headers.get('From','')
        domain_match = re.search(r'@([\w.-]+)', from_hdr)
        domain = domain_match.group(1).lower() if domain_match else 'unknown'
        thread_list.append({'threadId': tid, 'subject': subject, 'domain': domain, 'messages': msgs, 'date': first.get('internalDate', 0)})
    return thread_list

def cluster_by_domain_and_subject(threads: list) -> list:
    """Group threads that likely belong together."""
    clusters = []
    processed = set()

    for t in threads:
        if t['threadId'] in processed:
            continue
        # Find similar threads (same domain + subject keyword overlap)
        cluster = [t]
        processed.add(t['threadId'])
        for other in threads:
            if other['threadId'] in processed:
                continue
            if other['domain'] != t['domain']:
                continue
            # Subject similarity: remove Re:/Fw: and compare word sets
            clean_subj = lambda s: re.sub(r'^(re|fwd?):\s*', '', s.lower()).strip()
            s1 = set(clean_subj(t['subject']).split())
            s2 = set(clean_subj(other['subject']).split())
            if not s1 or not s2:
                continue
            overlap = len(s1 & s2) / min(len(s1), len(s2))
            if overlap >= SIMILARITY_THRESHOLD:
                cluster.append(other)
                processed.add(other['threadId'])
        if len(cluster) > 1:
            clusters.append(cluster)
    return clusters

def choose_primary_thread(cluster: list) -> str:
    """Return the oldest threadId (earliest internalDate)."""
    oldest = min(cluster, key=lambda t: int(t['date']))
    return oldest['threadId']

def label_as_merged(thread_id: str, target_thread_id: str) -> str:
    """Apply 'Merged-Into-<target>' label to the thread."""
    label_name = f"{MERGE_LABEL}{target_thread_id}"
    label_id = gmail_get_or_create_label_id(label_name)
    gmail_batch_modify({'ids': [thread_id]}, addLabelIds=[label_id])
    return label_name

def cmd_run(dry_run: bool, limit: int = 30):
    print("🔁 Thread Merger scanning for split conversations…")
    threads = fetch_recent_threads()
    print(f"   Loaded {len(threads)} recent unread threads")

    clusters = cluster_by_domain_and_subject(threads)
    print(f"   Found {len(clusters)} potential merge clusters")

    db = load_merge_db()
    merged = 0
    alerts = 0

    for cluster in clusters:
        primary = choose_primary_thread(cluster)
        for t in cluster:
            if t['threadId'] == primary:
                continue
            # Avoid re-merging already merged threads
            if any(m['source'] == t['threadId'] and m['target'] == primary for m in db['merged']):
                continue

            if dry_run:
                print(f"   [DRY-RUN] Would merge {t['threadId']} → {primary} ({t['subject'][:50]})")
                db['merged'].append({'source': t['threadId'], 'target': primary, 'subject': t['subject']})
                merged += 1
                continue

            try:
                label_name = label_as_merged(t['threadId'], primary)
                db['merged'].append({'source': t['threadId'], 'target': primary, 'subject': t['subject'], 'label': label_name})
                merged += 1
                print(f"   ✅ Merged {t['threadId']} → {primary} (label: {label_name})")
            except Exception as e:
                print(f"   ❌ Merge failed {t['threadId']}: {e}")

        # Optional: send alert if cluster > 3 threads
        if len(cluster) >= 3 and not dry_run:
            try:
                telegram_send(f"🔁 Thread Merge Alert — Domain: {cluster[0]['domain']}\nMerged {len(cluster)-1} threads into primary: {primary[:20]}…")
                alerts += 1
            except Exception:
                pass

    if not dry_run:
        db['lastRun'] = datetime.datetime.utcnow().isoformat()
        save_merge_db(db)

    print(f"\n✅ Ready to merge {merged} threads. Alerts sent: {alerts}")
    if dry_run:
        print("💡 Add --execute to perform merges.")

def main():
    parser = argparse.ArgumentParser(description='Auto-Email Thread Merger')
    parser.add_argument('--execute', action='store_true', help='Perform merges (default dry-run)')
    parser.add_argument('--limit', type=int, default=30, help='Max threads to analyze')
    args = parser.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)

if __name__ == '__main__':
    main()
