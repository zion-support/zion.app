#!/usr/bin/env python3
"""
Micro Response Generator — Zion

Generates ultra-quick response suggestions.

Usage:
  python3 micro_response_generator.py [--execute] [--limit N]

Options:
  --execute   Generate responses
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
    print(f"⚡ Generating micro-responses for {limit} emails...")
    msgs = gmail_search('is:unread newer_than:24h', limit=limit)
    
    for msg in msgs[:limit]:
        snippet = msg.get('snippet', '')[:40]
        
        # Quick response based on content
        if '?' in snippet:
            response = "Let me check and get back to you."
        elif 'thanks' in snippet.lower():
            response = "You're welcome!"
        elif 'meeting' in snippet.lower():
            response = "Let's find a time."
        else:
            response = "Understood. Will follow up."
        
        print(f"   💬 {snippet}... → {response}")

def main():
    parser = argparse.ArgumentParser(description='Micro Response Generator')
    parser.add_argument('--execute', action='store_true')
    parser.add_argument('--limit', type=int, default=DEFAULT_LIMIT)
    args = parser.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)

if __name__ == '__main__':
    main()