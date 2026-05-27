#!/usr/bin/env python3
"""
Stakeholder Influence Mapper — Zion

Maps influence relationships from email patterns.

Usage:
  python3 stakeholder_influence_mapper.py [--execute] [--limit N]

Options:
  --execute   Map stakeholders
  --limit N   Max emails (default 50)
"""

import sys, json, argparse, re
from pathlib import Path

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search

DEFAULT_LIMIT = 50

def cmd_run(dry_run: bool, limit: int):
    print(f"🕸️ Mapping stakeholder influence from {limit} emails...")
    msgs = gmail_search('is:unread newer_than:30d', limit=limit)
    
    influencers = {}
    
    for msg in msgs[:limit]:
        headers = msg.get('payload', {}).get('headers', [])
        from_header = next((h['value'] for h in headers if h['name'] == 'From'), '')
        
        # Extract email
        match = re.search(r'<([^>]+)>', from_header)
        email = match.group(1) if match else from_header
        
        # Track frequency
        influencers[email] = influencers.get(email, 0) + 1
    
    print(f"\n📊 Top influencers:")
    for email, count in sorted(influencers.items(), key=lambda x: -x[1])[:5]:
        print(f"   {email}: {count} interactions")

def main():
    parser = argparse.ArgumentParser(description='Stakeholder Influence Mapper')
    parser.add_argument('--execute', action='store_true')
    parser.add_argument('--limit', type=int, default=DEFAULT_LIMIT)
    args = parser.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)

if __name__ == '__main__':
    main()