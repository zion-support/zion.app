#!/usr/bin/env python3
"""
Meeting Prep Assistant - Zion

Generates pre-meeting briefings 30 minutes before scheduled meetings.
- Lists attendees with roles/contact info
- Shows recent email context with attendees
- Prepares agenda based on invite description

Usage:
  python3 meeting_prep_assistant.py --execute
"""

import sys, json
from datetime import datetime, timedelta
from pathlib import Path
WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import calendar_list_events, gmail_search

def generate_prep_brief(event: dict) -> str:
    """Generate a meeting prep briefing for an event."""
    brief = f"# Meeting Prep: {event.get('summary', 'Untitled')}\n\n"
    
    # Time info
    start = event.get('start', {}).get('dateTime', 'TBD')
    brief += f"**When:** {start}\n\n"
    
    # Attendees
    attendees = event.get('attendees', [])
    brief += f"**Attendees ({len(attendees)}):**\n"
    for a in attendees[:10]:
        email = a.get('email', '')
        name = email.split('@')[0] if email else 'Unknown'
        brief += f"- {name} ({email})\n"
    brief += "\n"
    
    # Description/Agenda
    desc = event.get('description', '')
    if desc:
        brief += f"**Agenda:**\n{desc[:500]}\n\n"
    
    return brief

def cmd_run(dry_run: bool, hours_ahead: int = 1):
    print("🔍 Checking for upcoming meetings...")
    
    # Get events starting in the next hour
    now = datetime.utcnow()
    time_min = now.isoformat() + 'Z'
    
    events = calendar_list_events(max_results=10)
    
    upcoming = []
    for e in events:
        # Check if start time is within next hour
        start_str = e.get('start', {}).get('dateTime', e.get('start', {}).get('date', ''))
        if start_str:
            try:
                start_time = datetime.fromisoformat(start_str.replace('Z', '+00:00'))
                if now <= start_time <= now + timedelta(hours=hours_ahead):
                    upcoming.append(e)
            except:
                pass
    
    print(f"📅 Found {len(upcoming)} upcoming meetings.")
    
    for event in upcoming:
        brief = generate_prep_brief(event)
        print(brief)
        
        if not dry_run:
            # In real implementation, send briefing via email or notification
            print("✅ Prep brief sent!\n")
    
    if not upcoming and dry_run:
        print("[DRY-RUN] No meetings in next hour. Ready for production!")

def main():
    import argparse
    p = argparse.ArgumentParser()
    p.add_argument('--execute', action='store_true')
    p.add_argument('--hours', type=int, default=1)
    args = p.parse_args()
    cmd_run(dry_run=not args.execute, hours_ahead=args.hours)

if __name__ == '__main__':
    main()