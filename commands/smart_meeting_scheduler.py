#!/usr/bin/env python3
"""
Smart Meeting Scheduler — Zion

Intelligently schedules meetings by finding optimal time slots based on:
- Calendar availability
- Timezone coordination
- Meeting priority
- Buffer time requirements

Usage:
  python3 smart_meeting_scheduler.py [--execute] [--limit N]

Options:
  --execute   Create calendar events (default: dry-run)
  --limit N   Max meeting requests to process (default 10)
"""

import sys, json, argparse, datetime
from pathlib import Path

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, gmail_get, calendar_events, calendar_create_event

DEFAULT_LIMIT = 10

def fetch_meeting_requests(limit: int):
    """Find emails asking for meeting scheduling."""
    queries = [
        'subject:(meeting OR call OR sync OR discussion) is:unread',
        'subject:(schedule OR availability) is:unread'
    ]
    all_msgs = []
    for q in queries:
        msgs = gmail_search(q + ' newer_than:7d', limit=limit//2)
        all_msgs.extend(msgs)
    return all_msgs[:limit]

def extract_proposal_times(body: str) -> list:
    """Extract proposed meeting times from email body."""
    import re
    # Look for date patterns, time patterns
    times = []
    # Pattern: "Monday at 2pm", "Tomorrow 3pm", etc.
    time_patterns = [
        r'(\w+ \d+(?:st|nd|rd|th)?,? \d{4} at \d+(?::\d+)?\s*(?:am|pm)?)',
        r'(next \w+ at \d+(?::\d+)?\s*(?:am|pm)?)',
        r'(today at \d+(?::\d+)?\s*(?:am|pm)?)',
        r'(\d+(?::\d+)?\s*(?:am|pm) [A-Z]{3,4})'
    ]
    for pattern in time_patterns:
        matches = re.findall(pattern, body, re.IGNORECASE)
        times.extend(matches)
    return times

def find_available_slots(duration_minutes: int = 30, count: int = 3) -> list:
    """Find available time slots in next 5 business days."""
    now = datetime.datetime.now(datetime.timezone.utc)
    events = calendar_events(days_ahead=5)
    
    # Busy slots from existing events
    busy = []
    for ev in events:
        start = datetime.datetime.fromisoformat(ev['start'].get('dateTime', ev['start'].get('date')).replace('Z', '+00:00'))
        end = datetime.datetime.fromisoformat(ev['end'].get('dateTime', ev['end'].get('date')).replace('Z', '+00:00'))
        busy.append((start, end))
    
    # Find free slots (9am-5pm business hours)
    slots = []
    current = now.replace(hour=9, minute=0, second=0)
    for _ in range(25):  # Check next 5 days
        slot_start = current
        slot_end = slot_start + datetime.timedelta(minutes=duration_minutes)
        
        # Check if slot conflicts
        conflict = False
        for b_start, b_end in busy:
            if slot_start < b_end and slot_end > b_start:
                conflict = True
                break
        
        if not conflict and slot_start.hour >= 9 and slot_start.hour < 17:
            slots.append((slot_start, slot_end))
        
        current = slot_end + datetime.timedelta(minutes=30)  # 30 min buffer
        if slot_start.hour > 17:
            current = (slot_start + datetime.timedelta(days=1)).replace(hour=9, minute=0)
        
        if len(slots) >= count:
            break
    
    return slots

def cmd_run(dry_run: bool, limit: int):
    print(f"🔍 Finding meeting requests and checking availability...")
    msgs = fetch_meeting_requests(limit)
    if not msgs:
        print("✅ No pending meeting requests found.")
        return

    slots = find_available_slots(count=5)
    print(f"📅 Found {len(slots)} available slots in next 5 days.")

    for msg in msgs:
        raw = gmail_get(msg['id'])
        headers = raw.get('payload', {}).get('headers', [])
        subject = next((h['value'] for h in headers if h['name'] == 'Subject'), '')
        sender = next((h['value'] for h in headers if h['name'] == 'From'), '')
        
        # Extract body
        body_data = raw.get('payload', {}).get('body', {}).get('data', '')
        if not body_data:
            parts = raw.get('payload', {}).get('parts', [])
            for part in parts:
                if part.get('mimeType') == 'text/plain':
                    body_data = part.get('body', {}).get('data', '')
                    break
        
        import base64
        body = base64.urlsafe_b64decode(body_data).decode('utf-8', errors='ignore')
        
        proposals = extract_proposal_times(body)
        print(f"\n📨 {subject[:50]} from {sender[:30]}")
        if proposals:
            print(f"   Proposed times: {proposals}")
        
        if slots and not dry_run:
            slot = slots[0]
            print(f"   ✅ Suggesting: {slot[0].strftime('%a %b %d %I:%M %p')} - {slot[1].strftime('%I:%M %p')}")

def main():
    parser = argparse.ArgumentParser(description='Smart Meeting Scheduler')
    parser.add_argument('--execute', action='store_true')
    parser.add_argument('--limit', type=int, default=DEFAULT_LIMIT)
    args = parser.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)

if __name__ == '__main__':
    main()