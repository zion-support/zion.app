#!/usr/bin/env python3
"""
Divine Wisdom Extractor — Zion

Extracts wisdom from communications.

Usage:
  python3 divine_wisdom_extractor.py [--execute] [--limit N]

Options:
  --execute   Extract wisdom
  --limit N   Max emails (default 30)
"""

import sys, json, argparse
from pathlib import Path

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search

DEFAULT_LIMIT = 30

def cmd_run(dry_run: bool, limit: int):
    print(f"📿 Divine Wisdom Extractor for {limit} emails...")
    msgs = gmail_search('is:unread newer_than:7d', limit=limit)
    
    wisdom = []
    for msg in msgs[:limit]:
        snippet = msg.get('snippet', '')
        
        # Extract wisdom patterns
        if 'learned' in snippet.lower() or 'important' in snippet.lower():
            wisdom.append(f"   💡 {snippet[:50]}...")
    
    print(f"   Found {len(wisdom)} wisdom nuggets")
    for w in wisdom[:5]:
        print(w)

def main():
    parser = argparse.ArgumentParser(description='Divine Wisdom Extractor')
    parser.add_argument('--execute', action='store_true')
    parser.add_argument('--limit', type=int, default=DEFAULT_LIMIT)
    args = parser.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)

if __name__ == '__main__':
    main()