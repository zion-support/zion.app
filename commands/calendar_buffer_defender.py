#!/usr/bin/env python3
"""
Calendar Buffer Defender — Zion

Detects back-to-back calendar events with insufficient gaps and drafts
polite reschedule/ buffer-creation emails to preserve focus time.

Usage:
  python3 calendar_buffer_defender.py check --days 7   — Scan next N days
  python3 calendar_buffer_defender.py today           — Check today's schedule
"""

import sys, os, datetime, re
from pathlib import Path

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import calendar_list_events
from llm_client import chat

MIN_BUFFER_MINUTES = 15  # preferred gap between meetings

def parse_event_start(endpoint: dict) -> datetime.datetime:
    """Parse start datetime from Calendar API event."""
    start = endpoint.get('start', {})
    dt_str = start.get('dateTime') or start.get('date')
    if not dt_str:
        raise ValueError("Event missing start")
    # Handle both date and dateTime
    if 'T' in dt_str:
        return datetime.datetime.fromisoformat(dt_str.replace('Z', '+00:00'))
    else:
        return datetime.datetime.combine(datetime.date.fromisoformat(dt_str), datetime.time.min)

def parse_event_end(endpoint: dict) -> datetime.datetime:
    end = endpoint.get('end', {})
    dt_str = end.get('dateTime') or end.get('date')
    if not dt_str:
        # Default 1h if missing
        return parse_event_start(endpoint) + datetime.timedelta(hours=1)
    if 'T' in dt_str:
        return datetime.datetime.fromisoformat(dt_str.replace('Z', '+00:00'))
    else:
        return datetime.datetime.combine(datetime.date.fromisoformat(dt_str), datetime.time.max)

def get_events(days_ahead: int = 7):
    """Fetch events from primary calendar."""
    now = datetime.datetime.utcnow()
    time_min = now.isoformat() + 'Z'
    time_max = (now + datetime.timedelta(days=days_ahead)).isoformat() + 'Z'
    events = calendar_list_events(timeMin=time_min, timeMax=time_max, maxResults=100)
    return events

def find_back_to_back(events):
    """Return list of (current_event, next_event, gap_minutes) where gap < MIN_BUFFER."""
    sorted_events = sorted(events, key=lambda e: parse_event_start(e))
    conflicts = []
    for i in range(len(sorted_events) - 1):
        e1 = sorted_events[i]
        e2 = sorted_events[i + 1]
        end1 = parse_event_end(e1)
        start2 = parse_event_start(e2)
        gap = (start2 - end1).total_seconds() / 60
        if 0 <= gap < MIN_BUFFER_MINUTES:
            conflicts.append((e1, e2, int(gap)))
    return conflicts

def generate_reschedule_email(event: dict, next_event: dict, gap: int) -> str:
    """Draft a polite email suggesting a buffer."""
    title1 = event.get('summary', '(untitled)')
    title2 = next_event.get('summary', '(untitled)')
    start1 = parse_event_start(event).strftime('%H:%M')
    end1 = parse_event_end(event).strftime('%H:%M')
    start2 = parse_event_start(next_event).strftime('%H:%M')

    prompt = (
        "You are Kleber Garcia Alcatrão, managing a busy schedule.\n"
        f"Two meetings are back-to-back with only a {gap}-minute gap:\n"
        f"  1. '{title1}' ({start1}–{end1})\n"
        f"  2. '{title2}' ({start2})\n\n"
        "Write a short, polite email to the organizer of the second meeting "
        "(or to both organizers if it's a recurring meeting) that:\n"
        "- Acknowledges their meeting\n"
        "- Explains you need a brief buffer between calls\n"
        "- Proposes moving the second meeting 15–30 minutes later OR the first earlier\n"
        "- Offers to find another time if needed\n"
        "Return ONLY the email body (no subject; sign as 'Kleber')."
    )
    resp = chat([{"role": "user", "content": prompt}], provider="auto")
    return resp['content'].strip()

def draft_email(to_addr: str, subject: str, body: str):
    import urllib.request, base64, json
    raw = f"Subject: {subject}\r\nTo: {to_addr}\r\n\r\n{body}"
    encoded = base64.urlsafe_b64encode(raw.encode()).decode().rstrip('=')
    url = 'https://gmail.googleapis.com/gmail/v1/users/me/drafts'
    payload = json.dumps({'message': {'raw': encoded}}).encode()
    from google_workspace import gog_headers
    req = urllib.request.Request(url, data=payload, headers=gog_headers(), method='POST')
    resp = json.loads(urllib.request.urlopen(req).read())
    return resp.get('id')

def cmd_today():
    events = get_events(days_ahead=0)
    print(f"📅 Today's schedule: {len(events)} events")
    conflicts = find_back_to_back(events)
    if not conflicts:
        print("✅ No back-to-back conflicts today.")
        return
    print(f"⚠️  Found {len(conflicts)} back-to-back conflict(s):")
    for e1, e2, gap in conflicts:
        t1 = e1.get('summary', '(no title)')
        t2 = e2.get('summary', '(no title)')
        s1 = parse_event_start(e1).strftime('%H:%M')
        s2 = parse_event_end(e2).strftime('%H:%M')
        print(f"   • {t1} [{s1}–{s2}] + {t2} (gap={gap}min)")

    # Draft email for first conflict
    e1, e2, gap = conflicts[0]
    attendees = e2.get('attendees', [])
    to_addr = next((a['email'] for a in attendees if a.get('self') is False), 'kleber@ziontechgroup.com')
    print(f"\n✉️  Drafting buffer request to {to_addr}...")
    body = generate_reschedule_email(e1, e2, gap)
    subject = f"Buffer request: {e2.get('summary','Meeting')} schedule adjustment"
    draft_id = draft_email(to_addr, subject, body)
    print(f"✅ Draft created (ID: {draft_id}). Review in Gmail Drafts.")

def cmd_check(days: int):
    events = get_events(days_ahead=days)
    print(f"📅 Next {days} days: {len(events)} events")
    conflicts = find_back_to_back(events)
    if not conflicts:
        print("✅ No back-to-back conflicts.")
        return
    print(f"⚠️  {len(conflicts)} conflict(s) detected:")
    for e1, e2, gap in conflicts:
        t1 = e1.get('summary', '(no title)')
        t2 = e2.get('summary', '(no title)')
        s1 = parse_event_start(e1).strftime('%m-%d %H:%M')
        s2 = parse_event_end(e2).strftime('%H:%M')
        print(f"   [{s1}] {t1} → [{s2}] {t2}  (gap={gap}min)")
    # Auto-draft first conflict
    e1, e2, gap = conflicts[0]
    attendees = e2.get('attendees', [])
    to_addr = next((a['email'] for a in attendees if a.get('self') is False), 'kleber@ziontechgroup.com')
    print(f"\n✉️  Drafting email to {to_addr} for the first conflict...")
    body = generate_reschedule_email(e1, e2, gap)
    subject = f"Schedule buffer request: {e2.get('summary','Meeting')}"
    draft_id = draft_email(to_addr, subject, body)
    print(f"✅ Draft created (ID: {draft_id})")

def main():
    import argparse
    p = argparse.ArgumentParser(description='Calendar Buffer Defender')
    sub = p.add_subparsers(dest='cmd')
    sub.add_parser('today', help='Check today for back-to-back conflicts')
    check_p = sub.add_parser('check', help='Check upcoming days')
    check_p.add_argument('--days', type=int, default=7, help='Days to scan (default 7)')
    args = p.parse_args()

    if args.cmd == 'today':
        cmd_today()
    elif args.cmd == 'check':
        cmd_check(args.days)
    else:
        p.print_help()

if __name__ == '__main__':
    main()
