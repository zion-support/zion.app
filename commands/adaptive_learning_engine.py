#!/usr/bin/env python3
"""
Adaptive Learning Engine — Zion

Continuously learns from email patterns.

Usage:
  python3 adaptive_learning_engine.py [--execute] [--limit N]

Options:
  --execute   Learn patterns
  --limit N   Max samples (default 100)
"""

import sys, json, argparse, hashlib
from pathlib import Path

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search

DEFAULT_LIMIT = 100

def cmd_run(dry_run: bool, limit: int):
    print(f"🧠 Adaptive Learning Engine...")
    msgs = gmail_search('is:read newer_than:30d', limit=limit)
    
    patterns = {'senders': {}, 'subjects': {}}
    for msg in msgs[:limit]:
        sender = msg.get('payload', {}).get('headers', [{}])[0].get('value', '')[:20]
        patterns['senders'][sender] = patterns['senders'].get(sender, 0) + 1
    
    print(f"   Analyzed {len(msgs)} emails")
    print(f"   Unique senders: {len(patterns['senders'])}")

def main():
    parser = argparse.ArgumentParser(description='Adaptive Learning Engine')
    parser.add_argument('--execute', action='store_true')
    parser.add_argument('--limit', type=int, default=DEFAULT_LIMIT)
    args = parser.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)

if __name__ == '__main__':
    main()