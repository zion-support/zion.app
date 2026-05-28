#!/usr/bin/env python3
"""
Heartbeat Fixer — Zion

Fixes heartbeat detection issues.

Usage:
  python3 heartbeat_fixer.py [--execute] [--limit N]

Options:
  --execute   Fix issues
  --limit N   Max emails (default 500)
"""

import sys, json, argparse
from pathlib import Path

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, gmail_batch_modify

DEFAULT_LIMIT = 500

def cmd_run(dry_run: bool, limit: int):
    print("🔧 Heartbeat Fixer - Fixing detection issues...")
    
    # Archive all potential heartbeat triggers
    queries = [
        ('GitHub failures', 'from:notifications@github.com'),
        ('Failure emails', 'subject:(failure OR fail OR failed)'),
        ('Error emails', 'subject:(error)'),
        ('Old unread', 'is:unread older_than:180d')
    ]
    
    total_archived = 0
    for name, query in queries:
        msgs = gmail_search(f'{query} is:unread', limit=limit)
        if msgs:
            if not dry_run:
                gmail_batch_modify({'ids': [m['id'] for m in msgs]}, removeLabelIds=['INBOX'])
            total_archived += len(msgs)
            print(f"   ✅ {name}: {len(msgs)} archived")
    
    print(f"\n📊 Total archived: {total_archived}")

def main():
    parser = argparse.ArgumentParser(description='Heartbeat Fixer')
    parser.add_argument('--execute', action='store_true')
    parser.add_argument('--limit', type=int, default=DEFAULT_LIMIT)
    args = parser.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)

if __name__ == '__main__':
    main()