#!/usr/bin/env python3
"""
Decision Matrix Analyzer — Zion

Analyzes emails to identify decisions that need to be made.

Usage:
  python3 decision_matrix_analyzer.py [--execute] [--limit N]

Options:
  --execute   Label decision-required emails
  --limit N   Max emails (default 25)
"""

import sys, json, argparse
from pathlib import Path

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, gmail_get, gmail_get_or_create_label_id, gmail_batch_modify

DEFAULT_LIMIT = 25

DECISION_KEYWORDS = [
    'decide', 'decision', 'approve', 'choose', 'select', 'confirm',
    'do you want', 'should we', 'what do you think', 'your call',
    'need your input', 'feedback needed'
]

def needs_decision(subject: str, body: str) -> tuple:
    """Check if email requires a decision."""
    text = (subject + ' ' + body[:500]).lower()
    
    for kw in DECISION_KEYWORDS:
        if kw in text:
            return True, kw
    
    return False, None

def cmd_run(dry_run: bool, limit: int):
    print(f"🔍 Finding emails requiring decisions...")
    msgs = gmail_search('is:unread newer_than:7d', limit=limit)
    if not msgs:
        print("✅ No decision emails found.")
        return

    decisions = []
    for msg in msgs:
        raw = gmail_get(msg['id'])
        headers = raw.get('payload', {}).get('headers', [])
        subject = next((h['value'] for h in headers if h['name'] == 'Subject'), '')
        sender = next((h['value'] for h in headers if h['name'] == 'From'), '')
        
        body_data = raw.get('payload', {}).get('body', {}).get('data', '')
        if not body_data:
            parts = raw.get('payload', {}).get('parts', [])
            for part in parts:
                if part.get('mimeType') == 'text/plain':
                    body_data = part.get('body', {}).get('data', '')
                    break
        
        import base64
        body = base64.urlsafe_b64decode(body_data).decode('utf-8', errors='ignore')
        
        needs_dec, keyword = needs_decision(subject, body)
        if needs_dec:
            decisions.append((subject, sender, keyword))
            print(f"   ⚖️ {subject[:40]}... (trigger: '{keyword}') from {sender[:20]}")
            
            if not dry_run:
                label_id = gmail_get_or_create_label_id('Needs-Decision')
                gmail_batch_modify({'ids': [msg['id']]}, addLabelIds=[label_id])

    print(f"\n📊 Found {len(decisions)} emails requiring decisions.")

def main():
    parser = argparse.ArgumentParser(description='Decision Matrix Analyzer')
    parser.add_argument('--execute', action='store_true')
    parser.add_argument('--limit', type=int, default=DEFAULT_LIMIT)
    args = parser.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)

if __name__ == '__main__':
    main()