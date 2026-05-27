#!/usr/bin/env python3
"""
Crisis Detection System — Zion

Detects potential crises from email signals.

Usage:
  python3 crisis_detection_system.py [--execute] [--limit N]

Options:
  --execute   Detect crises
  --limit N   Max emails (default 30)
"""

import sys, json, argparse
from pathlib import Path

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, gmail_get_or_create_label_id, gmail_batch_modify

DEFAULT_LIMIT = 30

CRISIS_KEYWORDS = [
    'urgent', 'emergency', 'critical', 'down', 'outage', 'broken',
    'server down', 'not working', 'failed', 'cancelled', 'terminated',
    'lawsuit', 'legal issue', 'security breach'
]

def cmd_run(dry_run: bool, limit: int):
    print(f"🚨 Detecting crises in {limit} emails...")
    msgs = gmail_search('is:unread newer_than:24h', limit=limit)
    
    crises = 0
    for msg in msgs[:limit]:
        headers = msg.get('payload', {}).get('headers', [])
        subject = next((h['value'] for h in headers if h['name'] == 'Subject'), '')
        
        text = (subject + ' ' + msg.get('snippet', '')).lower()
        
        for kw in CRISIS_KEYWORDS:
            if kw in text:
                crises += 1
                print(f"   🔴 CRISIS: {subject[:40]}... ({kw})")
                
                if not dry_run:
                    label_id = gmail_get_or_create_label_id('CRISIS')
                    gmail_batch_modify({'ids': [msg['id']]}, addLabelIds=[label_id])
                break

    print(f"\n📊 Detected {crises} potential crises")

def main():
    parser = argparse.ArgumentParser(description='Crisis Detection System')
    parser.add_argument('--execute', action='store_true')
    parser.add_argument('--limit', type=int, default=DEFAULT_LIMIT)
    args = parser.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)

if __name__ == '__main__':
    main()