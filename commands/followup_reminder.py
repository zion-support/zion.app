#!/usr/bin/env python3
"""
Follow-up Reminder Bot — Zion

Scans unread emails for phrases indicating a response is needed.
Creates calendar reminders N days out and tags emails with 'Follow-Up' label.

Usage:
  python3 followup_reminder.py --dry-run         # Preview actions (default)
  python3 followup_reminder.py --execute         # Create events + labels
  python3 followup_reminder.py --days 3          # Reminder horizon (default 3)
"""

import sys, os, re, datetime, argparse
from pathlib import Path

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, gmail_get, gmail_get_or_create_label_id, gmail_batch_modify, extract_body_from_gmail_message
from llm_client import chat

# ── Configuration ────────────────────────────────────────────────────────────

BATCH_SIZE = 50
DRY_RUN_DEFAULT = True
DEFAULT_DAYS = 3

# Keywords/phrases that suggest a response is expected
NEED_RESPONSE_PATTERNS = [
    r'\b(let me know|please confirm|awaiting your|when can you|schedule a call|are you available)\b',
    r'\b(please get back|looking forward|next steps|follow up|following up)\b',
    r'\b(can you|could you|would you|please (send|share|provide|reply))\b',
    r'\b(RSVP|please respond|kindly respond)\b',
    r'\b(when are you free|when works|find a time)\b',
]

# Senders to ignore (internal/automated)
IGNORE_SENDERS = [
    'noreply@github.com',
    'notifications@github.com',
    'no-reply@google.com',
]

def fetch_unread_emails(limit: int):
    msgs = gmail_search('is:unread', limit=limit)
    return msgs

def get_email_details(msg_id: str) -> dict:
    raw = gmail_get(msg_id)
    headers = raw.get('payload', {}).get('headers', [])
    subject = next((h['value'] for h in headers if h['name'] == 'Subject'), '(no subject)')
    from_header = next((h['value'] for h in headers if h['name'] == 'From'), '(unknown sender)')
    from_match = re.search(r'<(.+?)>', from_header)
    from_addr = from_match.group(1) if from_match else from_header
    body = extract_body_from_gmail_message(raw)
    return {
        'id': msg_id,
        'subject': subject,
        'from': from_addr,
        'body': body[:1000],
        'thread_id': raw.get('threadId', ''),
    }

def needs_response(email: dict) -> bool:
    if any(email['from'].lower().endswith(s) for s in IGNORE_SENDERS):
        return False
    text = (email['subject'] + ' ' + email['body']).lower()
    for pattern in NEED_RESPONSE_PATTERNS:
        if re.search(pattern, text, re.IGNORECASE):
            return True
    prompt = (
        "Does this email require a response from the recipient? Answer ONLY 'yes' or 'no'.\n\n"
        f"Subject: {email['subject']}\nFrom: {email['from']}\n"
        f"Body: {email['body'][:500]}\n\nRequires response?"
    )
    try:
        resp = chat([{'role': 'user', 'content': prompt}], provider='auto')
        return 'yes' in resp['content'].strip().lower()
    except Exception:
        return False

def create_reminder_event(email: dict, days_ahead: int = DEFAULT_DAYS) -> str:
    title = f"Follow-up: {email['subject'][:50]}"
    when = datetime.datetime.utcnow() + datetime.timedelta(days=days_ahead)
    start = when.strftime('%Y-%m-%dT10:00:00')
    end = when.strftime('%Y-%m-%dT10:30:00')
    event_body = {
        'summary': title,
        'description': f"Email from: {email['from']}\nSubject: {email['subject']}\n\nFollow up needed.",
        'start': {'dateTime': start, 'timeZone': 'America/Sao_Paulo'},
        'end':   {'dateTime': end,   'timeZone': 'America/Sao_Paulo'},
        'reminders': {'useDefault': True},
    }
    import urllib.request, json
    url = 'https://www.googleapis.com/calendar/v3/calendars/primary/events'
    from google_workspace import gog_headers
    headers = gog_headers()
    headers['Content-Type'] = 'application/json'
    req = urllib.request.Request(url, data=json.dumps(event_body).encode(), headers=headers, method='POST')
    resp = json.loads(urllib.request.urlopen(req).read())
    return resp.get('id')

def cmd_run(dry_run: bool, limit: int, days: int):
    print(f"🔍 Follow-up Reminder scanning {limit} unread emails...")
    msgs = fetch_unread_emails(limit)
    print(f"📥 Fetched {len(msgs)} emails")

    needs_followup = []
    for msg in msgs:
        email = get_email_details(msg['id'])
        if needs_response(email):
            needs_followup.append(email)
            print(f"   ⚠️  Needs response: {email['subject'][:60]}")

    if not needs_followup:
        print("✅ No follow-ups needed.")
        return

    print(f"\n📝 Found {len(needs_followup)} email(s) requiring follow-up.")
    label_id = gmail_get_or_create_label_id('Follow-Up')
    event_ids = []

    for email in needs_followup:
        if dry_run:
            print(f"   [DRY-RUN] Would label + create reminder for: {email['subject'][:50]}")
        else:
            gmail_batch_modify({'ids': [email['id']]}, addLabelIds=[label_id])
            try:
                ev_id = create_reminder_event(email, days_ahead=days)
                event_ids.append(ev_id)
                print(f"   ✅ Labeled + reminder created (event {ev_id[:8]}…)")
            except Exception as e:
                print(f"   ❌ Failed to create event: {e}")

    if dry_run:
        print(f"\n💡 Dry-run complete. Add --execute to label and create {len(needs_followup)} reminder(s).")
    else:
        print(f"\n✅ Created {len(event_ids)} calendar reminders.")

def main():
    parser = argparse.ArgumentParser(description='Follow-up Reminder Bot')
    parser.add_argument('--execute', action='store_true', help='Apply labels and create events (default: dry-run)')
    parser.add_argument('--limit', type=int, default=BATCH_SIZE, help='Max emails to scan')
    parser.add_argument('--days', type=int, default=DEFAULT_DAYS, help='Days ahead for reminder')
    args = parser.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit, days=args.days)

if __name__ == '__main__':
    main()
