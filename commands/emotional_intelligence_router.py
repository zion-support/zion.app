#!/usr/bin/env python3
"""
Emotional Intelligence Router — Zion

Routes emails based on emotional intelligence.

Usage:
  python3 emotional_intelligence_router.py [--execute] [--limit N]

Options:
  --execute   Route by EQ
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
    print(f"❤️ Emotional Intelligence Router for {limit} emails...")
    msgs = gmail_search('is:unread newer_than:24h', limit=limit)
    
    routes = {'empathetic': 0, 'assertive': 0, 'neutral': 0}
    
    for msg in msgs[:limit]:
        snippet = msg.get('snippet', '').lower()
        
        if any(w in snippet for w in ['frustrated', 'angry', 'upset']):
            route = 'empathetic'
        elif any(w in snippet for w in ['demand', 'must', 'required']):
            route = 'assertive'
        else:
            route = 'neutral'
        
        routes[route] += 1
        print(f"   {route}: {snippet[:30]}...")
        
        if not dry_run:
            label_id = gmail_get_or_create_label_id(f'EQ-{route}')
            gmail_batch_modify({'ids': [msg['id']]}, addLabelIds=[label_id])
    
    print(f"\n📊 Routes: {routes}")

def main():
    parser = argparse.ArgumentParser(description='Emotional Intelligence Router')
    parser.add_argument('--execute', action='store_true')
    parser.add_argument('--limit', type=int, default=DEFAULT_LIMIT)
    args = parser.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)

if __name__ == '__main__':
    main()