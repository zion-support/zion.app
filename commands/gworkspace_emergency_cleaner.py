#!/usr/bin/env python3
"""
GWorkspace Emergency Cleaner — Zion

Emergency tool to clean up massive email backlogs.

Usage:
  python3 gworkspace_emergency_cleaner.py [--execute] [--type TYPE]

Options:
  --execute   Actually perform cleanup
  --type    Type: all, github, newsletters, old
"""

import sys, json, argparse
from pathlib import Path

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, gmail_batch_modify

DEFAULT_LIMIT = 2000

def cmd_run(dry_run: bool, clean_type: str):
    print(f"🚨 Emergency cleanup: {clean_type}")
    
    queries = {
        'github': 'from:notifications@github.com',
        'newsletters': 'subject:(unsubscribe OR digest OR newsletter)',
        'old': 'older_than:60d',
        'all': ''
    }
    
    query = queries.get(clean_type, queries['all'])
    
    if query:
        msgs = gmail_search(query, limit=DEFAULT_LIMIT)
        print(f"Found {len(msgs)} emails to archive")
        
        if not dry_run and msgs:
            gmail_batch_modify({'ids': [m['id'] for m in msgs]}, removeLabelIds=['INBOX'])
            print(f"✅ Archived {len(msgs)} emails")
    
    print(f"\n📊 Emergency cleanup complete.")

def main():
    parser = argparse.ArgumentParser(description='GWorkspace Emergency Cleaner')
    parser.add_argument('--execute', action='store_true')
    parser.add_argument('--type', default='all', help='Cleanup type')
    args = parser.parse_args()
    cmd_run(dry_run=not args.execute, clean_type=args.type)

if __name__ == '__main__':
    main()