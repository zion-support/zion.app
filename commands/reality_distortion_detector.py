#!/usr/bin/env python3
"""
Reality Distortion Detector — Zion

Detects inconsistencies and distortion in communications.

Usage:
  python3 reality_distortion_detector.py [--execute] [--limit N]

Options:
  --execute   Detect distortions
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
    print(f"🔮 Reality Distortion Detector for {limit} emails...")
    msgs = gmail_search('is:unread newer_than:7d', limit=limit)
    
    distortions = 0
    for msg in msgs[:limit]:
        snippet = msg.get('snippet', '').lower()
        
        # Detect distortion patterns
        if 'wasn\'t supposed to' in snippet or 'should have' in snippet or 'misunderstanding' in snippet:
            distortions += 1
            print(f"   🌀 Distortion detected: {snippet[:40]}...")
    
    print(f"\n📊 Total distortions: {distortions}")

def main():
    parser = argparse.ArgumentParser(description='Reality Distortion Detector')
    parser.add_argument('--execute', action='store_true')
    parser.add_argument('--limit', type=int, default=DEFAULT_LIMIT)
    args = parser.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)

if __name__ == '__main__':
    main()