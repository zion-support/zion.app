#!/usr/bin/env python3
"""
Decision Timeline Estimator — Zion

Estimates when decisions need to be made based on deadlines and context.

Usage:
  python3 decision_timeline_estimator.py [--execute] [--limit N]

Options:
  --execute   Add timeline labels
  --limit N   Max emails (default 25)
"""

import sys, json, argparse, re, datetime
from pathlib import Path

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, gmail_get, gmail_get_or_create_label_id, gmail_batch_modify

DEFAULT_LIMIT = 25

def extract_deadline(body: str) -> tuple:
    """Extract deadline from email body."""
    # Look for date patterns
    date_patterns = [
        r'(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})',
        r'by (\w+ \d+)',
        r'before (\w+ \d+)',
        r'deadline[:\s]+(\w+ \d+)'
    ]
    
    for pattern in date_patterns:
        match = re.search(pattern, body, re.IGNORECASE)
        if match:
            return match.group(1)
    return None

def cmd_run(dry_run: bool, limit: int):
    print(f"🔍 Estimating decision timelines for {limit} emails...")
    msgs = gmail_search('is:unread newer_than:14d', limit=limit)
    if not msgs:
        print("✅ No decision emails found.")
        return

    for msg in msgs:
        raw = gmail_get(msg['id'])
        headers = raw.get('payload', {}).get('headers', [])
        subject = next((h['value'] for h in headers if h['name'] == 'Subject'), '')
        
        body_data = raw.get('payload', {}).get('body', {}).get('data', '')
        if not body_data:
            parts = raw.get('payload', {}).get('parts', [])
            for part in parts:
                if part.get('mimeType') == 'text/plain':
                    body_data = part.get('body', {}).get('data', '')
                    break
        
        import base64
        body = base64.urlsafe_b64decode(body_data).decode('utf-8', errors='ignore')[:800]
        
        deadline = extract_deadline(body)
        
        if deadline:
            print(f"   📅 {subject[:40]}... → deadline: {deadline}")
            if not dry_run:
                label_id = gmail_get_or_create_label_id('Has-Deadline')
                gmail_batch_modify({'ids': [msg['id']]}, addLabelIds=[label_id])
        else:
            print(f"   ✓ {subject[:40]}... → no clear deadline")

    print(f"\n📊 Timeline estimation complete.")

def main():
    parser = argparse.ArgumentParser(description='Decision Timeline Estimator')
    parser.add_argument('--execute', action='store_true')
    parser.add_argument('--limit', type=int, default=DEFAULT_LIMIT)
    args = parser.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)

if __name__ == '__main__':
    main()