#!/usr/bin/env python3
"""
Response Time Estimator — Zion

Estimates optimal response times for emails.

Usage:
  python3 response_time_estimator.py [--execute] [--limit N]

Options:
  --execute   Estimate times
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
    print(f"⏱️ Estimating response times for {limit} emails...")
    msgs = gmail_search('is:unread newer_than:24h', limit=limit)
    
    for i, msg in enumerate(msgs[:limit]):
        snippet = msg.get('snippet', '')[:35]
        
        # Time estimation based on urgency keywords
        text = snippet.lower()
        if any(w in text for w in ['urgent', 'asap', 'critical']):
            time = "1 hour"
        elif any(w in text for w in ['soon', 'today']):
            time = "4 hours"
        else:
            time = "24 hours"
        
        print(f"   {i+1}. {time} - {snippet}")
    
    print(f"\n📊 Response time estimation complete")

def main():
    parser = argparse.ArgumentParser(description='Response Time Estimator')
    parser.add_argument('--execute', action='store_true')
    parser.add_argument('--limit', type=int, default=DEFAULT_LIMIT)
    args = parser.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)

if __name__ == '__main__':
    main()