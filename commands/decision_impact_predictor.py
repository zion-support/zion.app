#!/usr/bin/env python3
"""
Decision Impact Predictor — Zion

Predicts impact of potential decisions.

Usage:
  python3 decision_impact_predictor.py [--execute] [--limit N]

Options:
  --execute   Predict impact
  --limit N   Max emails (default 20)
"""

import sys, json, argparse
from pathlib import Path

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search

DEFAULT_LIMIT = 20

def cmd_run(dry_run: bool, limit: int):
    print(f"🔮 Predicting decision impact for {limit} emails...")
    msgs = gmail_search('subject:(proposal OR decision OR approve OR budget) is:unread newer_than:7d', limit=limit)
    
    for msg in msgs[:limit]:
        headers = msg.get('payload', {}).get('headers', [])
        subject = next((h['value'] for h in headers if h['name'] == 'Subject'), '')
        
        # Impact prediction
        text = subject.lower()
        if 'budget' in text or '$' in text:
            impact = "High - Financial impact"
        elif 'team' in text or 'hire' in text:
            impact = "Medium - Team impact"
        else:
            impact = "Low - Operational impact"
        
        print(f"   {impact}: {subject[:35]}")

def main():
    parser = argparse.ArgumentParser(description='Decision Impact Predictor')
    parser.add_argument('--execute', action='store_true')
    parser.add_argument('--limit', type=int, default=DEFAULT_LIMIT)
    args = parser.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)

if __name__ == '__main__':
    main()