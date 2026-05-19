#!/usr/bin/env python3
"""
Response Style Matcher — Zion

Matches response style to sender's communication style.

Usage:
  python3 response_style_matcher.py [--execute] [--limit N]

Options:
  --execute   Match styles
  --limit N   Max emails (default 30)
"""

import sys, json, argparse
from pathlib import Path

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, gmail_get_or_create_label_id, gmail_batch_modify

DEFAULT_LIMIT = 30

def cmd_run(dry_run: bool, limit: int):
    print(f"🎭 Matching response styles for {limit} emails...")
    msgs = gmail_search('is:unread newer_than:24h', limit=limit)
    
    styles = {'formal': 0, 'casual': 0, 'direct': 0}
    
    for msg in msgs[:limit]:
        headers = msg.get('payload', {}).get('headers', [])
        subject = next((h['value'] for h in headers if h['name'] == 'Subject'), '')
        
        # Detect style
        text = subject.lower()
        if any(w in text for w in ['dear', 'regards', 'sincerely']):
            style = 'formal'
        elif any(w in text for w in ['hey', 'hi there', 'cheers']):
            style = 'casual'
        else:
            style = 'direct'
        
        styles[style] += 1
        print(f"   {style}: {subject[:30]}...")
        
        if not dry_run:
            label_id = gmail_get_or_create_label_id(f'Style-{style}')
            gmail_batch_modify({'ids': [msg['id']]}, addLabelIds=[label_id])
    
    print(f"\n📊 Style distribution: {styles}")

def main():
    parser = argparse.ArgumentParser(description='Response Style Matcher')
    parser.add_argument('--execute', action='store_true')
    parser.add_argument('--limit', type=int, default=DEFAULT_LIMIT)
    args = parser.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)

if __name__ == '__main__':
    main()