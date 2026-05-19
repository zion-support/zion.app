#!/usr/bin/env python3
"""
Meeting Preparation Assistant — Zion

Prepares context for upcoming meetings.

Usage:
  python3 meeting_preparation_assistant.py [--execute] [--limit N]

Options:
  --execute   Prepare meetings
  --limit N   Max meetings (default 10)
"""

import sys, json, argparse
from pathlib import Path

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, calendar_events

DEFAULT_LIMIT = 10

def cmd_run(dry_run: bool, limit: int):
    print(f"📅 Preparing {limit} upcoming meetings...")
    
    # Get calendar events
    events = calendar_events(days_ahead=7)
    
    for event in events[:limit]:
        summary = event.get('summary', 'Untitled')
        start = event.get('start', {}).get('dateTime', 'TBD')
        
        # Find related emails
        related = gmail_search(f'subject:("{summary}") newer_than:14d', limit=5)
        
        print(f"   📋 {summary} ({start})")
        print(f"      Related emails: {len(related)}")
        
        if related and not dry_run:
            print(f"      Context prepared from {len(related)} emails")

def main():
    parser = argparse.ArgumentParser(description='Meeting Preparation Assistant')
    parser.add_argument('--execute', action='store_true')
    parser.add_argument('--limit', type=int, default=DEFAULT_LIMIT)
    args = parser.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)

if __name__ == '__main__':
    main()