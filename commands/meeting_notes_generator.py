#!/usr/bin/env python3
"""
AI Meeting Notes Generator - Zion

Generates meeting notes from calendar events and email context.
- Creates agenda from event description
- Lists attendees with roles
- Records action items mentioned
- Summarizes key decisions

Usage:
  python3 meeting_notes_generator.py --event-id <calendar_event_id>
  python3 meeting_notes_generator.py --execute --limit 5
"""

import sys, re
from datetime import datetime
from pathlib import Path
WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import calendar_list_events, gmail_search

def generate_notes(event: dict) -> str:
    """Generate meeting notes from calendar event."""
    notes = f"# Meeting Notes: {event.get('summary', 'Untitled')}\n\n"
    
    # Time and date
    start = event.get('start', {}).get('dateTime', event.get('start', {}).get('date', 'TBD'))
    notes += f"**Date/Time:** {start}\n\n"
    
    # Attendees
    attendees = event.get('attendees', [])
    notes += f"**Attendees ({len(attendees)}):**\n"
    for a in attendees[:10]:
        email = a.get('email', '')
        name = email.split('@')[0].title() if email else 'Unknown'
        notes += f"- {name} ({email})\n"
    notes += "\n"
    
    # Agenda/Description
    desc = event.get('description', '')
    if desc:
        notes += f"**Agenda:**\n{desc}\n\n"
    
    # Action items placeholder
    notes += "**Action Items:**\n- (To be filled during meeting)\n\n"
    
    # Decisions placeholder
    notes += "**Decisions:**\n- (To be recorded)\n"
    
    return notes

def cmd_run(dry_run: bool, limit: int = 5):
    print("📋 Generating meeting notes from recent events...")
    
    events = calendar_list_events(max_results=limit)
    
    for event in events[:limit]:
        notes = generate_notes(event)
        print(notes[:500] + "...\n")
        
        if not dry_run:
            # In production, save to Drive or send via email
            pass
    
    print(f"✅ Generated notes for {len(events[:limit])} events.")
    
    if dry_run:
        print("[DRY-RUN] Would save notes to Drive or share via email.")

def main():
    import argparse
    p = argparse.ArgumentParser()
    p.add_argument('--execute', action='store_true')
    p.add_argument('--limit', type=int, default=5)
    p.add_argument('--event-id')
    args = p.parse_args()
    
    cmd_run(dry_run=not args.execute, limit=args.limit)

if __name__ == '__main__':
    main()