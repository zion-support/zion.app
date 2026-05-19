#!/usr/bin/env python3
"""
AI Negotiation Bot — Zion

Negotiates terms and conditions via email.

Usage:
  python3 ai_negotiation_bot.py [--execute] [--limit N]

Options:
  --execute   Run negotiations
  --limit N   Max emails (default 10)
"""

import sys, json, argparse
from pathlib import Path

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, gmail_get, gmail_create_draft

DEFAULT_LIMIT = 10

def cmd_run(dry_run: bool, limit: int):
    print(f"🤝 AI Negotiation Bot analyzing {limit} emails...")
    msgs = gmail_search('subject:(negotiate OR terms OR proposal OR counter-offer) is:unread newer_than:7d', limit=limit)
    
    for msg in msgs[:limit]:
        headers = msg.get('payload', {}).get('headers', [])
        subject = next((h['value'] for h in headers if h['name'] == 'Subject'), '')
        
        print(f"   📋 {subject[:40]}... - negotiating...")
        
        if not dry_run:
            # Create negotiation response
            response = """Thank you for your proposal. 

After reviewing the terms, I'd like to discuss the following adjustments:
1. Timeline: Extended by 10%
2. Scope: Additional feature X
3. Pricing: Volume discount for 3+ projects

Let me know your thoughts.

Best regards,
Kleber Garcia Alcatrão"""
            gmail_create_draft(message_id=msg['id'], body=response)

def main():
    parser = argparse.ArgumentParser(description='AI Negotiation Bot')
    parser.add_argument('--execute', action='store_true')
    parser.add_argument('--limit', type=int, default=DEFAULT_LIMIT)
    args = parser.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)

if __name__ == '__main__':
    main()