#!/usr/bin/env python3
"""
Neural Pattern Learner — Zion

Learns patterns from email interactions for predictions.

Usage:
  python3 neural_pattern_learner.py [--execute] [--limit N]

Options:
  --execute   Learn patterns
  --limit N   Max emails (default 50)
"""

import sys, json, argparse, hashlib
from pathlib import Path

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search

DEFAULT_LIMIT = 50
PATTERNS_FILE = WORKSPACE / '.neural_patterns.json'

def cmd_run(dry_run: bool, limit: int):
    print(f"🧠 Neural Pattern Learner analyzing {limit} emails...")
    msgs = gmail_search('is:unread newer_than:7d', limit=limit)
    
    patterns = {}
    
    for msg in msgs[:limit]:
        headers = msg.get('payload', {}).get('headers', [])
        subject = next((h['value'] for h in headers if h['name'] == 'Subject'), '')
        from_header = next((h['value'] for h in headers if h['name'] == 'From'), '')
        
        # Extract patterns
        if 'github' in subject.lower() or 'action' in subject.lower():
            key = 'github_failure'
            patterns[key] = patterns.get(key, 0) + 1
        elif 'invoice' in subject.lower() or 'payment' in subject.lower():
            key = 'financial'
            patterns[key] = patterns.get(key, 0) + 1
        elif '?' in subject:
            key = 'question'
            patterns[key] = patterns.get(key, 0) + 1
    
    print(f"   📊 Patterns learned: {patterns}")
    
    if not dry_run and patterns:
        PATTERNS_FILE.write_text(json.dumps(patterns))
        print(f"   💾 Patterns saved to {PATTERNS_FILE}")

def main():
    parser = argparse.ArgumentParser(description='Neural Pattern Learner')
    parser.add_argument('--execute', action='store_true')
    parser.add_argument('--limit', type=int, default=DEFAULT_LIMIT)
    args = parser.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)

if __name__ == '__main__':
    main()