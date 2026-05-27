#!/usr/bin/env python3
"""
Priority Predictor — Zion Tech Group

Predicts urgency and optimal response time for incoming emails.
Uses signals: sender history, thread activity, content sentiment, time sent,
and client value to assign priority (P1-P4) and suggested response SLA.

Output: Adds 'Priority-1'..'Priority-4' labels, surfaces P1 in Telegram.

Schedule: Every 30 minutes (paired with auto_tagger_v2)

Usage: python3 priority_predictor.py [--execute] [--limit N]
"""

import sys, os, re, json, datetime, argparse
from pathlib import Path

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, gmail_get, gmail_batch_modify, gmail_get_or_create_label_id, telegram_send
from llm_client import chat, extract_json_from_text

DB_FILE = WORKSPACE / 'zion.app' / 'data' / 'priority_predictor.json'

PRIORITY_LABELS = ['Priority-1', 'Priority-2', 'Priority-3', 'Priority-4']

def load_db():
    if DB_FILE.exists():
        return json.loads(DB_FILE.read_text())
    return {'scored': [], 'sender_stats': {}, 'lastRun': None}

def save_db(db):
    DB_FILE.parent.mkdir(parents=True, exist_ok=True)
    DB_FILE.write_text(json.dumps(db, indent=2))

def fetch_recent_unread(limit=50):
    return gmail_search('is:unread -label:Priority-1 -label:Priority-2 -label:Priority-3 -label:Priority-4', limit=limit)

def sender_history(domain):
    # Get past 30 days of sent/received counts
    inbound = len(gmail_search(f'from:{domain} newer_than:30d', limit=100))
    outbound = len(gmail_search(f'to:{domain} newer_than:30d is:sent', limit=100))
    return {'inbound': inbound, 'outbound': outbound, 'ratio': inbound/max(outbound,1)}

def extract_signal(msg):
    headers = msg.get('payload', {}).get('headers', [])
    sender = next((h['value'] for h in headers if h['name']=='From'), '')
    domain_match = re.search(r'@([A-Za-z0-9.-]+\.[A-Za-z]{2,})', sender)
    domain = domain_match.group(1).lower() if domain_match else 'unknown'
    subject = next((h['value'] for h in headers if h['name']=='Subject'), '')
    snippet = msg.get('snippet','')
    date_hdr = next((h['value'] for h in headers if h['name']=='Date'), '')
    # Parse hour
    hour = datetime.datetime.now().hour
    try:
        import email.utils
        parsed = email.utils.parsedate_tz(date_hdr)
        if parsed:
            hour = (parsed[3] + (parsed[4]/60.0)) % 24
    except Exception:
        pass
    return {'sender': sender, 'domain': domain, 'subject': subject, 'snippet': snippet[:300], 'hour': round(hour,1)}

def score_email(sig, hist):
    """Rule-based + LLM enhancer to compute priority score (1-100)."""
    score = 0
    reasons = []

    # Base score from time sent
    if sig['hour'] >= 22 or sig['hour'] < 7:
        score += 20
        reasons.append('off-hours')
    elif sig['hour'] >= 8 and sig['hour'] <= 17:
        score += 0
    else:
        score += 5

    # Sender history
    if hist['inbound'] == 0:
        score += 15
        reasons.append('new-contact')
    elif hist['ratio'] > 2:
        score += 10
        reasons.append('high-inbound-ratio')
    elif hist['outbound'] > 10:
        score += -5
        reasons.append('active-outbound')

    # Subject keywords
    subj_lower = sig['subject'].lower()
    if any(w in subj_lower for w in ['urgent','asap','immediately','emergency']):
        score += 30
        reasons.append('urgent-keyword')
    if any(w in subj_lower for w in ['question','help','issue','broken','error']):
        score += 10
        reasons.append('support-indicator')

    # Snippet sentiment quick check
    if 'not working' in sig['snippet'].lower() or 'failed' in sig['snippet'].lower():
        score += 10
        reasons.append('negative-indicator')

    # LLM refinement for edge cases
    if 30 <= score <= 60:
        prompt = f"""
Rate email urgency 1-100 (higher = more urgent).

From: {sig['sender']}
Subject: {sig['subject']}
Snippet: {sig['snippet'][:300]}

Current signals: {', '.join(reasons)}
Return JSON: {{"urgency": 1-100, "rationale": "short"}}
"""
        try:
            resp = chat([{'role':'user','content':prompt}], provider="auto", temperature=0.3)
            content = resp.get('content', '')
            llm = extract_json_from_text(content)
            llm_score = llm.get('urgency', 50)
            # Blend: 0.6 rule + 0.4 LLM
            score = int(0.6 * score + 0.4 * llm_score)
        except Exception:
            pass

    return min(score, 100)

def priority_from_score(score):
    if score >= 75:
        return 'Priority-1'
    elif score >= 50:
        return 'Priority-2'
    elif score >= 25:
        return 'Priority-3'
    else:
        return 'Priority-4'

def cmd_run(dry_run=True, limit=50):
    db = load_db()
    emails = fetch_recent_unread(limit=limit)
    if not emails:
        print("✅ No unscored emails found.")
        return

    p1_count = 0
    for msg in emails:
        mid = msg.get('id')
        if mid in db.get('scored', []):
            continue
        sig = extract_signal(msg)
        hist = sender_history(sig['domain'])
        score = score_email(sig, hist)
        prio = priority_from_score(score)

        print(f"   📊 {sig['subject'][:45]} → {prio} (score={score})")

        if not dry_run:
            label_id = gmail_get_or_create_label_id(prio)
            gmail_batch_modify({'ids': [mid]}, addLabelIds=[label_id])
            db['scored'].append(mid)
            if prio == 'Priority-1':
                p1_count += 1
                # Telegram alert
                try:
                    telegram_send(f"🚨 P1 Email:\n{sig['subject'][:100]}\nFrom: {sig['sender']}")
                except Exception:
                    pass
        else:
            if prio == 'Priority-1':
                p1_count += 1

    if not dry_run:
        db['lastRun'] = datetime.datetime.utcnow().isoformat()
        save_db(db)

    print(f"\n✅ Scored {len(emails)} emails. P1: {p1_count}")
    if dry_run:
        print("💡 Add --execute to apply priority labels and alerts.")

def main():
    p = argparse.ArgumentParser()
    p.add_argument('--execute', action='store_true')
    p.add_argument('--limit', type=int, default=50)
    args = p.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)

if __name__ == '__main__':
    main()
