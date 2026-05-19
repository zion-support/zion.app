#!/usr/bin/env python3
"""
Competitor Mention Tracker — Zion

Tracks when competitors are mentioned in client communications.

Usage:
  python3 competitor_mention_tracker.py [--execute] [--limit N]

Options:
  --execute   Track competitor mentions
  --limit N   Max emails (default 40)
"""

import sys, json, argparse
from pathlib import Path

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search

DEFAULT_LIMIT = 40

COMPETITORS = [
    'openai', 'anthropic', 'google ai', 'microsoft copilot', 'cohere', 
    'stability ai', 'midjourney', 'character ai', 'perplexity',
    'aws bedrock', 'azure ai', 'ibm watson', 'oracle ai'
]

def cmd_run(dry_run: bool, limit: int):
    print(f"🔍 Tracking competitor mentions in {limit} emails...")
    
    msgs = gmail_search('newer_than:30d', limit=limit)
    
    mentions = {}
    for msg in msgs[:limit]:
        snippet = msg.get('snippet', '').lower()
        subject = msg.get('subject', '').lower() if 'subject' in dir(msg) else ''
        text = snippet + ' ' + subject
        
        for comp in COMPETITORS:
            if comp in text:
                mentions[comp] = mentions.get(comp, 0) + 1
                print(f"   🕵️ {comp} mentioned in: {snippet[:50]}...")

    print(f"\n📊 Competitor mentions: {dict(sorted(mentions.items(), key=lambda x: -x[1]))}")

def main():
    parser = argparse.ArgumentParser(description='Competitor Mention Tracker')
    parser.add_argument('--execute', action='store_true')
    parser.add_argument('--limit', type=int, default=DEFAULT_LIMIT)
    args = parser.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)

if __name__ == '__main__':
    main()