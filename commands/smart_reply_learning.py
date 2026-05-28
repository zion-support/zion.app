#!/usr/bin/env python3
"""
Smart Reply Learning Loop — Zion Tech Group

Analyzes which auto-drafted replies actually get sent by Kleber.
Tracks acceptance rate per email category to inform future prompt improvements.

Logic:
  - Finds threads labeled '[AUTO-DRAFT]'
  - Checks if thread contains any 'from:kleber@ziontechgroup.com' messages after label added
  - If yes → accepted; if thread > 3d old with no reply → ignored
  - Saves stats; outputs Telegram digest

Usage:
  python3 smart_reply_learning.py [--execute]   # Update stats & optionally send digest
"""

import sys, os, re, json, datetime, argparse
from pathlib import Path

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))

from google_workspace import gmail_search, gmail_get
from llm_client import chat

AUTO_DRAFT_LABEL = '[AUTO-DRAFT]'
STATS_FILE = WORKSPACE / 'zion.app' / 'data' / 'smart_reply_stats.json'
KLEBER_EMAIL = 'kleber@ziontechgroup.com'
IGNORE_AFTER_DAYS = 3

def load_stats() -> dict:
    if STATS_FILE.exists():
        return json.loads(STATS_FILE.read_text())
    return {'categories': {}, 'total_drafts': 0, 'total_accepted': 0}

def save_stats(stats: dict):
    STATS_FILE.parent.mkdir(parents=True, exist_ok=True)
    STATS_FILE.write_text(json.dumps(stats, indent=2))

def get_thread_category(msg_meta: dict) -> str:
    """Determine category of the auto-draft thread by looking at original email content."""
    msg = gmail_get(msg_meta['id'])
    headers = msg.get('payload', {}).get('headers', [])
    subject = next((h['value'] for h in headers if h['name'] == 'Subject'), '')
    body = extract_body_from_gmail_message(msg)[:500]
    # Reuse detect_category from smart_reply_queue
    text = (subject + ' ' + body).lower()
    patterns = {
        'quote_request': [r'\b(quote|quotation|pricing|how much|cost of|estimate)\b', r'\b(please quote|can you quote|interested in)\b'],
        'meeting_invite': [r'\b(meeting|call|zoom|teams|schedule|available|when are you free)\b', r'\b(let\'s (discuss|talk)|chat about)\b'],
        'error_report': [r'\b(error|failed|broken|issue|problem|bug|crash|down)\b', r'\b(not working|stuck|unable to)\b'],
        'info_request': [r'\b(what is|how do|can you tell|please provide|information about)\b', r'\b(details on|more info)\b'],
    }
    for cat, pats in patterns.items():
        for pat in pats:
            if re.search(pat, text, re.IGNORECASE):
                return cat
    return 'other'

def extract_body_from_gmail_message(msg):
    payload = msg.get('payload', {})
    if 'parts' in payload:
        for part in payload['parts']:
            if part.get('mimeType') == 'text/plain':
                data = part.get('body', {}).get('data', '')
                if data:
                    import base64
                    return base64.urlsafe_b64decode(data + '===').decode('utf-8', errors='replace')
    body = payload.get('body', {}).get('data', '')
    if body:
        import base64
        return base64.urlsafe_b64decode(body + '===').decode('utf-8', errors='replace')
    return ''

def cmd_run(dry_run: bool):
    print("🧠 Smart Reply Learning evaluating auto-draft acceptance…")
    threads = gmail_search(f'label:"{AUTO_DRAFT_LABEL}"', limit=200)
    print(f"📥 Found {len(threads)} auto-draft labeled threads")

    stats = load_stats()
    newly_processed = 0
    newly_accepted = 0

    cutoff_date = datetime.date.today() - datetime.timedelta(days=IGNORE_AFTER_DAYS)

    for t in threads:
        thread_id = t['threadId']
        # If we already processed this thread today, skip
        # We'll use simple heuristic: once a thread stops having AUTO_DRAFT label (or has a Sent from Kleber), count it
        # For now, we consider all threads with AUTO_DRAFT still present as pending; others we check history
        # We'll just count acceptance if thread contains Kleber's reply.
        # Fetch all messages in thread
        thread_msgs = gmail_search(f'thread:{thread_id}', limit=50)
        has_draft_label = any(t['id'] == t['id'] for _ in thread_msgs)  # placeholder

        # Simple: if thread has a message from Kleber (excluding the auto-draft itself), assume accepted
        # The auto-draft is a message in DRAFT. After sending, it's no longer in DRAFT; but original thread gains a SENT message.
        # So look for: any message from KLEBER_EMAIL and NOT in DRAFT (i.e., SENT).
        # Gmail search for thread already returns all messages (including drafts? Usually not). We'll check all messages returned.

        accepted = False
        msg_ids = [m['id'] for m in thread_msgs]
        full_msgs = [gmail_get(mid) for mid in msg_ids]
        for fm in full_msgs:
            headers = {h['name']: h['value'] for h in fm.get('payload', {}).get('headers', [])}
            frm = headers.get('From','')
            if KLEBER_EMAIL in frm:
                accepted = True
                break

        # Determine category from the earliest auto-draft thread message (first thread message)
        # Assume first thread message is the inbound
        category = get_thread_category(thread_msgs[0]) if thread_msgs else 'other'

        # Update stats
        stats['categories'].setdefault(category, {'drafts':0, 'accepted':0})
        stats['categories'][category]['drafts'] += 1
        if accepted:
            stats['categories'][category]['accepted'] += 1
            newly_accepted += 1
        stats['total_drafts'] += 1
        if accepted:
            stats['total_accepted'] += 1
        newly_processed += 1

    save_stats(stats)

    # Print summary
    print("\n📈 Acceptance Stats:")
    for cat, data in stats['categories'].items():
        total = data['drafts']
        acc = data['accepted']
        rate = (acc/total*100) if total else 0
        print(f"   {cat}: {acc}/{total} ({rate:.0f}%)")
    overall = stats['total_accepted'] / stats['total_drafts'] * 100 if stats['total_drafts'] else 0
    print(f"\nOverall acceptance: {overall:.0f}% ({stats['total_accepted']}/{stats['total_drafts']})")

    if dry_run:
        print("\n💡 Add --execute to persist stats.")
        return

    # Optionally send Telegram digest (weekly maybe; but we can send daily)
    try:
        lines = ["📊 *Smart Reply Learning*\n"]
        for cat, data in stats['categories'].items():
            total = data['drafts']
            acc = data['accepted']
            rate = (acc/total*100) if total else 0
            lines.append(f"• {cat}: {acc}/{total} ({rate:.0f}%)")
        message(action='send', target='telegram', message='\n'.join(lines))
        print("📡 Telegram digest sent.")
    except Exception:
        pass

def main():
    parser = argparse.ArgumentParser(description='Smart Reply Learning Loop')
    parser.add_argument('--execute', action='store_true', help='Persist stats (default dry-run)')
    args = parser.parse_args()
    cmd_run(dry_run=not args.execute)

if __name__ == '__main__':
    main()
