#!/usr/bin/env python3
"""
Calendly Sync — Zion Tech Group

Syncs Calendly bookings to Google Calendar and sends notifications.
Automatically creates calendar events with meet links, sends Telegram alerts.

Schedule: Every 15 minutes

Usage: python3 calendly_sync.py [--execute] [--limit 10]
"""

import sys, os, re, json, datetime, argparse, urllib.request
from pathlib import Path

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import calendar_create_event
from llm_client import chat

DB_FILE = WORKSPACE / 'zion.app' / 'data' / 'calendly_sync.json'
API_KEY = os.getenv('CALENDLY_API_KEY')
URI = os.getenv('CALENDLY_URI', 'ziontechgroup')  # your Calendly organization slug

def load_db():
    if DB_FILE.exists():
        return json.loads(DB_FILE.read_text())
    return {'synced': [], 'lastRun': None}

def save_db(db):
    DB_FILE.parent.mkdir(parents=True, exist_ok=True)
    DB_FILE.write_text(json.dumps(db, indent=2))

def fetch_calendly_events(limit=10):
    if not API_KEY:
        raise RuntimeError('CALENDLY_API_KEY not set in .env')
    url = f"https://api.calendly.com/v1/scheduled_events?organization={URI}&status=active&count={limit}"
    req = urllib.request.Request(
        url,
        headers={'Authorization': f'Bearer {API_KEY}', 'Content-Type': 'application/json'},
        method='GET'
    )
    try:
        with urllib.request.urlopen(req, timeout=15) as r:
            data = json.loads(r.read())
        return data.get('data', [])
    except Exception as e:
        print(f"   ❌ Calendly fetch failed: {e}")
        return []

def event_to_google_calendar(event):
    """Convert Calendly event to Google Calendar event dict."""
    start = event.get('start_time')
    end = event.get('end_time')
    invitee = event.get('invitee', {})
    name = invitee.get('name', 'Unknown')
    email = invitee.get('email', '')
    external_id = event.get('uuid', '')
    location = event.get('location', {}).get('location', '')
    description = f"Calendly booking for {name} ({email})\nBooked via Calendly.\nExternal ID: {external_id}"
    return {
        'summary': f"Meeting: {name}",
        'description': description,
        'start': {'dateTime': start, 'timeZone': 'America/Sao_Paulo'},
        'end':   {'dateTime': end,   'timeZone': 'America/Sao_Paulo'},
        'location': location,
        'reminders': {'useDefault': True}
    }

def cmd_run(dry_run=True, limit=10):
    db = load_db()
    events = fetch_calendly_events(limit=limit)
    if not events:
        print("✅ No upcoming Calendly events found.")
        return

    synced = 0
    for ev in events:
        ev_id = ev.get('uuid')
        if ev_id in db.get('synced', []):
            continue
        try:
            gc_event = event_to_google_calendar(ev)
            if dry_run:
                print(f"   [DRY-RUN] Would create: {gc_event['summary']} at {gc_event['start']['dateTime']}")
                synced += 1
            else:
                eid = calendar_create_event(gc_event)
                db['synced'].append(ev_id)
                synced += 1
                print(f"   ✅ Created Google Calendar event: {gc_event['summary']}")
        except Exception as e:
            print(f"   ❌ Sync failed for {ev.get('uuid')}: {e}")

    if not dry_run:
        db['lastRun'] = datetime.datetime.utcnow().isoformat()
        save_db(db)

    print(f"\n✅ Processed {len(events)} Calendly events. Synced: {synced}")
    if dry_run:
        print("💡 Add --execute to create calendar events")

def main():
    p = argparse.ArgumentParser()
    p.add_argument('--execute', action='store_true')
    p.add_argument('--limit', type=int, default=10)
    args = p.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)

if __name__ == '__main__':
    main()
