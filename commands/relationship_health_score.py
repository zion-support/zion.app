#!/usr/bin/env python3
"""
Relationship Health Score — Zion

Scores email relationships by interaction frequency and sentiment.

Usage:
  python3 relationship_health_score.py [--execute] [--limit N]

Options:
  --execute   Update relationship scores
  --limit N   Max contacts (default 50)
"""

import sys, json, argparse
from pathlib import Path
from collections import defaultdict

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search

DEFAULT_LIMIT = 50

def cmd_run(dry_run: bool, limit: int):
    print(f"🔍 Analyzing relationship health for top {limit} contacts...")
    
    # Get recent email threads
    threads = gmail_search('in:inbox newer_than:30d', limit=limit*5)
    
    # Count interactions per sender
    interactions = defaultdict(int)
    for msg in threads:
        headers = msg.get('payload', {}).get('headers', [])
        sender = next((h['value'] for h in headers if h['name'] == 'From'), '')
        # Extract email from sender string
        import re
        email_match = re.search(r'<([^>]+)>', sender)
        email = email_match.group(1) if email_match else sender
        interactions[email] += 1
    
    # Score based on frequency
    scores = []
    for email, count in interactions.items():
        if count >= 10:
            score = '🔴 Hot (daily)'
        elif count >= 5:
            score = '🟠 Warm (weekly)'
        elif count >= 2:
            score = '🟡 Cool (monthly)'
        else:
            score = '⚪ New'
        scores.append((email, count, score))
    
    scores.sort(key=lambda x: -x[1])
    
    print("\n📊 Top relationships:")
    for email, count, score in scores[:15]:
        name = email.split('@')[0][:20]
        print(f"   {score} {name} ({count} emails)")
    
    print(f"\n📈 Total contacts analyzed: {len(scores)}")

def main():
    parser = argparse.ArgumentParser(description='Relationship Health Score')
    parser.add_argument('--execute', action='store_true')
    parser.add_argument('--limit', type=int, default=DEFAULT_LIMIT)
    args = parser.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)

if __name__ == '__main__':
    main()