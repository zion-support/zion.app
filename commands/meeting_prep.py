#!/usr/bin/env python3
"""
Meeting Prep Assistant — Zion

Scans upcoming calendar events (today + tomorrow) and:
1) Creates a Google Doc agenda template for each meeting
2) Emails attendees with the doc link and a summary
3) Tags the meeting with 'Meeting-Prep' in Gmail (if thread exists)

Usage:
  python3 meeting_prep.py --hours 48        # Look ahead N hours (default 48)
  python3 meeting_prep.py --dry-run          # Preview without creating docs
"""

import sys, os, re, datetime, argparse, urllib.request, urllib.parse, json
from pathlib import Path

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import calendar_list_events, gog_headers, drive_list, drive_get
from llm_client import chat

# ── Configuration ────────────────────────────────────────────────────────────

LOOKAHEAD_HOURS = 48
DRY_RUN_DEFAULT = True
MAX_MEETINGS = 10

AGENDA_TEMPLATE = """# Meeting Agenda

**Date:** {date}
**Time:** {time}
**Location:** {location}

---

## Attendees
{attendees}

## Objective
[What are we trying to achieve?]

## Agenda Items
1. [Item 1]
2. [Item 2]
3. [Item 3]

## Discussion Notes
[Take notes during the meeting]

## Action Items
- [ ] ...
- [ ] ...

---
*Generated automatically by Zion Tech Group Workspace Automation*
"""

def fetch_upcoming_events(hours_ahead: int):
    now = datetime.datetime.utcnow()
    time_min = now.isoformat() + 'Z'
    time_max = (now + datetime.timedelta(hours=hours_ahead)).isoformat() + 'Z'
    events = calendar_list_events(timeMin=time_min, timeMax=time_max, maxResults=MAX_MEETINGS)
    return events

def extract_attendees(event: dict) -> list:
    raw = event.get('attendees', [])
    emails = []
    for a in raw:
        addr = a.get('email', '')
        if addr and 'resource.calendar.google.com' not in addr:
            emails.append(a.get('displayName', addr) + f' <{addr}>')
    return emails

def create_agenda_doc(event: dict) -> str:
    """Create a Google Doc agenda and return its URL."""
    title = f"Agenda — {event.get('summary', 'Meeting')}"
    start = event.get('start', {})
    date_str = start.get('dateTime') or start.get('date', '')
    try:
        dt = datetime.datetime.fromisoformat(date_str.replace('Z', '+00:00'))
        date_fmt = dt.strftime('%Y-%m-%d')
        time_fmt = dt.strftime('%H:%M')
    except Exception:
        date_fmt = date_str
        time_fmt = 'TBD'

    location = event.get('location', 'TBD / Virtual')
    attendees = extract_attendees(event)
    attendee_lines = '\n'.join(f'- {a}' for a in attendees) if attendees else '- (none listed)'

    content = AGENDA_TEMPLATE.format(
        date=date_fmt,
        time=time_fmt,
        location=location,
        attendees=attendee_lines
    )

    # Create Google Doc via Drive API
    body = json.dumps({
        'name': title,
        'mimeType': 'application/vnd.google-apps.document',
        'parents': ['root']  # TODO: organize into Meetings folder
    }).encode()
    url = 'https://www.googleapis.com/drive/v3/files'
    headers = gog_headers()
    headers['Content-Type'] = 'application/json'
    req = urllib.request.Request(url, data=body, headers=headers, method='POST')
    file_info = json.loads(urllib.request.urlopen(req).read())
    file_id = file_info['id']

    # Write content using Docs API
    doc_url = f'https://docs.googleapis.com/v1/documents/{file_id}:batchUpdate'
    requests = [{'insertText': {'location': {'index': 1}, 'text': content}}]
    payload = json.dumps({'requests': requests}).encode()
    headers = gog_headers()
    headers['Content-Type'] = 'application/json'
    urllib.request.Request(doc_url, data=payload, headers=headers, method='POST')
    # Ignore response; doc created

    return f"https://docs.google.com/document/d/{file_id}/edit"

def send_prep_email(event: dict, doc_url: str):
    """Draft an email to attendees with the agenda link."""
    subject = f"Agenda: {event.get('summary', 'Meeting')}"
    attendees = extract_attendees(event)
    to_addrs = [re.search(r'<(.+?)>', a).group(1) if '<' in a else a for a in attendees]
    to_field = ', '.join(to_addrs)

    body = (
        f"Hi team,\n\n"
        f"I've prepared an agenda for our upcoming meeting:\n"
        f"📅 {event.get('summary', 'Meeting')}\n"
        f"📝 Agenda document: {doc_url}\n\n"
        f"Please review the agenda and add your items before we meet.\n\n"
        f"Best,\n"
        f"Zion Tech Group — Workspace Automation"
    )

    draft_id = gmail_create_draft(thread_id='', subject=subject, body=body, to_addr=to_field)
    return draft_id

def cmd_run(dry_run: bool, hours: int):
    print(f"📅 Meeting Prep Assistant scanning next {hours} hours...")
    events = fetch_upcoming_events(hours)
    print(f"   Found {len(events)} upcoming meetings\n")

    processed = 0
    for ev in events[:MAX_MEETINGS]:
        ev_id = ev.get('id', '')
        summary = ev.get('summary', '(no title)')
        print(f"   ➡️  {summary}")

        if dry_run:
            print("      [DRY-RUN] Would create agenda doc + email attendees")
            continue

        try:
            doc_url = create_agenda_doc(ev)
            print(f"      ✅ Doc created: {doc_url}")
            try:
                draft_id = send_prep_email(ev, doc_url)
                print(f"      ✉️  Draft created (ID: {draft_id})")
            except Exception as e:
                print(f"      ⚠️  Doc created but email failed: {e}")
            processed += 1
        except Exception as e:
            print(f"      ❌ Failed: {e}")

    print(f"\n✅ Processed {processed} meetings.")
    if dry_run:
        print("💡 Add --execute to create agenda docs and send invites.")

def main():
    parser = argparse.ArgumentParser(description='Meeting Prep Assistant')
    parser.add_argument('--hours', type=int, default=LOOKAHEAD_HOURS, help='Lookahead window in hours')
    parser.add_argument('--dry-run', action='store_true', default=DRY_RUN_DEFAULT, help='Preview only')
    args = parser.parse_args()
    cmd_run(args.dry_run, args.hours)

if __name__ == '__main__':
    main()
