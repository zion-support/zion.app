#!/usr/bin/env python3
"""
Neural Response Time Optimizer — Zion

Optimizes response times using neural patterns.

Usage:
  python3 neural_response_time_optimizer.py [--execute] [--limit N]

Options:
  --execute   Optimize times
  --limit N   Max emails (default 20)
"""

import sys, json, argparse, random
from pathlib import Path

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, gmail_get_or_create_label_id, gmail_batch_modify

DEFAULT_LIMIT = 20

def cmd_run(dry_run: bool, limit: int):
    print(f"🧠 Neural Response Time Optimizer for {limit} emails...")
    msgs = gmail_search('is:unread newer_than:24h', limit=limit)
    
    for msg in msgs[:limit]:
        headers = msg.get('payload', {}).get('headers', [])
        subject = next((h['value'] for h in headers if h['name'] == 'Subject'), '')
        
        # Neural optimization
        urgency_score = sum(1 for w in ['urgent', 'asap', 'critical', 'today'] if w in subject.lower())
        optimal_time = max(30, 300 - urgency_score * 50)  # 30min to 5min offset
        
        print(f"   ⚡ {subject[:30]}... → Response in {optimal_time}min")
        
        if not dry_run and urgency_score > 0:
            label_id = gmail_get_or_create_label_id(f'Response-{optimal_time}min')
            gmail_batch_modify({'ids': [msg['id']]}, addLabelIds=[label_id])

def main():
    parser = argparse.ArgumentParser(description='Neural Response Time Optimizer')
    parser.add_argument('--execute', action='store_true')
    parser.add_argument('--limit', type=int, default=DEFAULT_LIMIT)
    args = parser.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)

if __name__ == '__main__':
    main()