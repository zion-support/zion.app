#!/usr/bin/env python3
"""
Unresponded Email Tracker — Zion

Finds email threads where Kleber hasn't replied for >48 hours.
Generates a daily report and optionally drafts polite follow-up messages.

Usage:
  python3 unresponded_tracker.py report --hours 48    # Print report
  python3 unresponded_tracker.py draft --limit 5     # Draft follow-ups for top N
"""

import sys, os, re, datetime, argparse
from pathlib import Path

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, gmail_thread_get, gmail_create_draft
from llm_client import chat

# ── Configuration ────────────────────────────────────────────────────────────

SEARCH_LIMIT = 100          # Max threads to scan
STALE_HOURS = 48            # Threshold for "unresponded"
REPORT_LIMIT = 20           # Max entries in report

def fetch_recent_threads(limit: int):
    """Get threads with unread messages or recent activity."""
    msgs = gmail_search('is:unread', limit=limit)
    thread_ids = list({m.get('threadId') for m in msgs if m.get('threadId')})
    return thread_ids

def get_thread_last_activity(thread_id: str) -> dict:
    """Return thread messages sorted by date; identify last incoming vs outgoing."""
    messages = gmail_thread_get(thread_id)
    if not messages:
        return None

    # Parse dates and direction
    parsed = []
    for m in messages:
        headers = {h['name']: h['value'] for h in m.get('payload', {}).get('headers', [])}
        date_str = headers.get('Date', '')
        from_hdr = headers.get('From', '')
        # Determine if sent by Kleber
        to_hdr = headers.get('To', '')
        # Simple heuristic: if From contains 'kleber' or to contains 'ziontechgroup.com'
        is_outgoing = ('kleber' in from_hdr.lower()) or ('ziontechgroup.com' in to_hdr.lower())

        # Parse date to datetime (basic)
        # Format example: "Wed, 13 May 2026 10:15:00 -0300"
        try:
            import email.utils
            dt = datetime.datetime.fromtimestamp(email.utils.mktime_tz(email.utils.parsedate_tz(date_str)))
        except Exception:
            dt = datetime.datetime.utcnow()

        parsed.append({'msg': m, 'date': dt, 'outgoing': is_outgoing})

    # Sort by date ascending
    parsed.sort(key=lambda x: x['date'])
    last = parsed[-1]
    # Find last incoming (not from Kleber)
    incoming = [p for p in parsed if not p['outgoing']]
    if not incoming:
        return None
    last_in = incoming[-1]

    return {
        'thread_id': thread_id,
        'subject': next((h['value'] for h in messages[0].get('payload', {}).get('headers', []) if h['name']=='Subject'), '(no subject)'),
        'last_incoming_date': last_in['date'],
        'last_outgoing_date': last['date'] if last['outgoing'] else None,
        'message_count': len(messages),
    }

def is_stale(thread_data: dict, threshold_hours: int) -> bool:
    """Check if >threshold_hours have passed since last incoming without reply."""
    last_in = thread_data['last_incoming_date']
    now = datetime.datetime.utcnow()
    age = (now - last_in).total_seconds() / 3600
    return age > threshold_hours

def generate_followup_draft(thread_data: dict) -> str:
    """Use LLM to draft a polite follow-up email for this thread."""
    prompt = (
        "You are Kleber Garcia Alcatrão, CEO of Zion Tech Group.\n"
        f"Thread subject: {thread_data['subject']}\n\n"
        "Write a short, professional follow-up email to move the conversation forward.\n"
        "Return ONLY the email body (no subject); sign as 'Kleber'."
    )
    resp = chat([{'role': 'user', 'content': prompt}], provider='auto')
    return resp['content'].strip()

def cmd_report(hours: int):
    """Print a report of stale threads > hours old."""
    print(f"📋 Unresponded Email Report (stale > {hours}h)")
    thread_ids = fetch_recent_threads(SEARCH_LIMIT)
    print(f"🔎 Scanning {len(thread_ids)} recent threads...")

    stale = []
    for tid in thread_ids:
        data = get_thread_last_activity(tid)
        if data and is_stale(data, hours):
            stale.append(data)

    stale.sort(key=lambda x: x['last_incoming_date'])

    print(f"\n⚠️  {len(stale)} thread(s) need attention:\n")
    for i, s in enumerate(stale[:REPORT_LIMIT], 1):
        age = (datetime.datetime.utcnow() - s['last_incoming_date']).total_seconds() / 3600
        print(f"{i}. *{s['subject']}* (last incoming: {age:.0f}h ago)")
        print(f"   Thread ID: {s['thread_id']}")
        print()

    if len(stale) > REPORT_LIMIT:
        print(f"... and {len(stale) - REPORT_LIMIT} more. Consider addressing these.")

def cmd_draft(dry_run: bool, limit: int):
    """Draft follow-up emails for the top `limit` stale threads."""
    print(f"✍️  Drafting follow-ups for up to {limit} stale threads...")
    thread_ids = fetch_recent_threads(SEARCH_LIMIT)
    stale = []
    for tid in thread_ids:
        data = get_thread_last_activity(tid)
        if data and is_stale(data, STALE_HOURS):
            stale.append(data)

    stale.sort(key=lambda x: x['last_incoming_date'])
    to_draft = stale[:limit]

    if dry_run:
        print(f"   [DRY-RUN] Would draft {len(to_draft)} follow-up emails:")
        for s in to_draft:
            print(f"      • {s['subject'][:50]}")
        print(f"\n💡 Dry-run complete. Re-run with --execute to create drafts.")
        return

    drafted = 0
    for s in to_draft:
        try:
            body = generate_followup_draft(s)
            first_msg = gmail_thread_get(s['thread_id'])[0]
            headers = {h['name']: h['value'] for h in first_msg.get('payload', {}).get('headers', [])}
            from_hdr = headers.get('From', '')
            from_match = re.search(r'<(.+?)>', from_hdr)
            to_addr = from_match.group(1) if from_match else from_hdr

            draft_id = gmail_create_draft(thread_id=s['thread_id'], subject=s['subject'], body=body, to_addr=to_addr)
            print(f"   ✅ Drafted for: {s['subject'][:50]}")
            drafted += 1
        except Exception as e:
            print(f"   ❌ Failed for '{s['subject'][:50]}': {e}")

    print(f"\n✅ Drafted {drafted} follow-up email(s). Review in Gmail Drafts.")

def main():
    parser = argparse.ArgumentParser(description='Unresponded Email Tracker')
    parser.add_argument('--execute', action='store_true', help='Create drafts (default: dry-run)')
    sub = parser.add_subparsers(dest='cmd')
    r = sub.add_parser('report', help='Show stale threads report')
    r.add_argument('--hours', type=int, default=STALE_HOURS, help='Hours threshold (default 48)')
    d = sub.add_parser('draft', help='Draft follow-ups for stale threads')
    d.add_argument('--limit', type=int, default=5, help='Max drafts to create')
    args = parser.parse_args()

    if args.cmd == 'report':
        cmd_report(args.hours)
    elif args.cmd == 'draft':
        cmd_draft(dry_run=not args.execute, limit=args.limit)
    else:
        parser.print_help()

if __name__ == '__main__':
    main()
