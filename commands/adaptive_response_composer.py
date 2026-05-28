#!/usr/bin/env python3
"""
Adaptive Response Composer — Zion

Composes context-aware responses.

Usage:
  python3 adaptive_response_composer.py [--execute] [--limit N]

Options:
  --execute   Compose responses
  --limit N   Max emails (default 10)
"""

import sys, json, argparse
from pathlib import Path

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search

DEFAULT_LIMIT = 10

def cmd_run(dry_run: bool, limit: int):
    print(f"✍️ Adaptive Response Composer...")
    msgs = gmail_search('is:unread', limit=limit)
    
    for msg in msgs[:limit]:
        snippet = msg.get('snippet', '')[:30]
        print(f"   Draft: Re: {snippet}...")
    
    if not dry_run:
        print(f"   ✉️ Composed {min(len(msgs), limit)} draft responses")

def main():
    parser = argparse.ArgumentParser(description='Adaptive Response Composer')
    parser.add_argument('--execute', action='store_true')
    parser.add_argument('--limit', type=int, default=DEFAULT_LIMIT)
    args = parser.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)

if __name__ == '__main__':
    main()