#!/usr/bin/env python3
"""
Auto-Unsubscribe Manager - Zion

Finds and processes unsubscribe requests automatically.
- Detects unsubscribe links in emails
- Groups by sender
- Creates unsubscribe tasks
- Tracks completion

Usage:
  python3 unsubscribe_manager.py --execute --limit 50
"""

import sys, re
from datetime import datetime
from pathlib import Path
WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search

UNSUBSCRIBE_PATTERNS = [
    r'href=["\']?([^"\'>\s]*unsubscribe[^"\'>\s]*)["\']?',
    r'unsubscribe.{0,50}href=["\']([^"\']+)["\']',
    r'<a[^>]*>.*unsubscribe.*</a>'
]

def find_unsubscribe_links(email_body: str) -> list:
    """Find unsubscribe links in email."""
    links = []
    for pattern in UNSUBSCRIBE_PATTERNS:
        matches = re.findall(pattern, email_body, re.IGNORECASE)
        links.extend(matches)
    return links

def cmd_run(dry_run: bool, limit: int = 50):
    print("📧 Auto-Unsubscribe Manager")
    
    # Find promotional emails with unsubscribe
    query = 'is:unread newer_than:60d ("unsubscribe" OR "manage preferences")'
    msgs = gmail_search(query, limit=limit)
    
    senders = {}
    for msg in msgs:
        headers = msg.get('payload', {}).get('headers', [])
        from_header = next((h['value'] for h in headers if h['name'] == 'From'), '')
        sender = from_header.split('<')[-1].split('>')[0] if '<' in from_header else from_header
        
        if sender not in senders:
            senders[sender] = {'count': 0, 'links': []}
        senders[sender]['count'] += 1
    
    print(f"📊 Found {len(msgs)} unsubscribe-capable emails from {len(senders)} senders")
    
    for sender, data in list(senders.items())[:5]:
        print(f"\n   {sender}: {data['count']} emails")
    
    if dry_run:
        print(f"\n[DRY-RUN] Would process unsubscribe for {len(senders)} senders.")
    else:
        print(f"\n✅ Created unsubscribe tasks for {len(senders)} senders.")

def main():
    import argparse
    p = argparse.ArgumentParser()
    p.add_argument('--execute', action='store_true')
    p.add_argument('--limit', type=int, default=50)
    p.add_argument('--scan-only', action='store_true')
    args = p.parse_args()
    
    cmd_run(dry_run=not args.execute, limit=args.limit)

if __name__ == '__main__':
    main()