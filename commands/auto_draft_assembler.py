#!/usr/bin/env python3
"""
Smart Draft Assembler — Zion

Assembles email drafts based on conversation context.

Usage:
  python3 auto_draft_assembler.py [--execute] [--limit N]

Options:
  --execute   Create drafts
  --limit N   Max emails (default 20)
"""

import sys, json, argparse
from pathlib import Path

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, gmail_get, gmail_create_draft

DEFAULT_LIMIT = 20

def cmd_run(dry_run: bool, limit: int):
    print(f"📝 Assembling drafts for {limit} emails...")
    msgs = gmail_search('is:unread newer_than:12h', limit=limit)
    
    for msg in msgs[:limit]:
        headers = msg.get('payload', {}).get('headers', [])
        subject = next((h['value'] for h in headers if h['name'] == 'Subject'), '')
        
        # Create quick draft
        draft_body = f"Hi,\n\nFollowing up on {subject}.\n\nBest regards,\nKleber"
        
        print(f"   📧 Draft for: {subject[:35]}...")
        
        if not dry_run:
            gmail_create_draft(message_id=msg['id'], body=draft_body)

def main():
    parser = argparse.ArgumentParser(description='Auto Draft Assembler')
    parser.add_argument('--execute', action='store_true')
    parser.add_argument('--limit', type=int, default=DEFAULT_LIMIT)
    args = parser.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)

if __name__ == '__main__':
    main()