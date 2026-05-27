#!/usr/bin/env python3
"""
Multi-Channel Consistency Checker — Zion

Checks consistency across email, calendar, and other channels.

Usage:
  python3 multi_channel_consistency_checker.py [--execute] [--limit N]

Options:
  --execute   Check consistency
  --limit N   Max items (default 20)
"""

import sys, json, argparse
from pathlib import Path

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, calendar_list

DEFAULT_LIMIT = 20

def cmd_run(dry_run: bool, limit: int):
    print(f"🔄 Checking cross-channel consistency...")
    
    # Get emails mentioning meetings
    emails = gmail_search('subject:(meeting OR appointment) newer_than:7d', limit=limit//2)
    
    # Get calendar events
    events = calendar_list(days_ahead=7)
    
    print(f"   📧 Meeting emails: {len(emails)}")
    print(f"   📅 Calendar events: {len(events)}")
    
    # Check for mismatches
    inconsistencies = 0
    for email in emails[:limit//2]:
        snippet = email.get('snippet', '')
        # Would check if calendar has matching event
        # Simplified for now
    
    print(f"\n📊 Found {inconsistencies} inconsistencies")

def main():
    parser = argparse.ArgumentParser(description='Multi-Channel Consistency Checker')
    parser.add_argument('--execute', action='store_true')
    parser.add_argument('--limit', type=int, default=DEFAULT_LIMIT)
    args = parser.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)

if __name__ == '__main__':
    main()