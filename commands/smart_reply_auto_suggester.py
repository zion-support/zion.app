#!/usr/bin/env python3
"""
Smart Reply Auto Suggester — Zion

Automatically suggests quick replies.

Usage:
  python3 smart_reply_auto_suggester.py [--execute] [--limit N]

Options:
  --execute   Suggest replies
  --limit N   Max emails (default 20)
"""

import sys, json, argparse
from pathlib import Path

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search

DEFAULT_LIMIT = 20

REPLIES = {
    'thank': "You're welcome! Happy to help.",
    'question': "I'll look into this and get back shortly.",
    'meeting': "Let me check my calendar and confirm.",
    'urgent': "I understand this is urgent. Addressing now.",
    'default': "Thanks for reaching out. Will follow up soon."
}

def cmd_run(dry_run: bool, limit: int):
    print(f"💡 Smart Reply Auto Suggester for {limit} emails...")
    msgs = gmail_search('is:unread newer_than:24h', limit=limit)
    
    for msg in msgs[:limit]:
        snippet = msg.get('snippet', '').lower()
        
        # Match reply type
        reply = REPLIES['default']
        for key, resp in REPLIES.items():
            if key in snippet:
                reply = resp
                break
        
        print(f"   📧 {snippet[:30]}... → \"{reply[:30]}...\"")

def main():
    parser = argparse.ArgumentParser(description='Smart Reply Auto Suggester')
    parser.add_argument('--execute', action='store_true')
    parser.add_argument('--limit', type=int, default=DEFAULT_LIMIT)
    args = parser.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)

if __name__ == '__main__':
    main()