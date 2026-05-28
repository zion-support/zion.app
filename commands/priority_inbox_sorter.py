#!/usr/bin/env python3
"""
Priority Inbox Sorter — Zion

Intelligent inbox sorting by priority, sender importance, and action required.

Usage:
  python3 priority_inbox_sorter.py [--execute] [--limit N]

Options:
  --execute   Apply priority labels
  --limit N   Max emails (default 50)
"""

import sys, json, argparse
from pathlib import Path

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, gmail_get, gmail_get_or_create_label_id, gmail_batch_modify

DEFAULT_LIMIT = 50

VIP_SENDERS = ['client@ziontechgroup.com', 'partner', 'investor', 'ceo@', 'board@']
URGENT_KEYWORDS = ['urgent', 'asap', 'critical', 'deadline', 'emergency']

def score_email(subject: str, sender: str, body: str) -> tuple:
    """Return (priority, reason) tuple."""
    score = 0
    reasons = []
    
    # VIP sender bonus
    for vip in VIP_SENDERS:
        if vip.lower() in sender.lower():
            score += 50
            reasons.append('VIP sender')
    
    # Urgency keywords
    for kw in URGENT_KEYWORDS:
        if kw in subject.lower() or kw in body.lower():
            score += 30
            reasons.append(f'urgent keyword: {kw}')
    
    # Question marks indicate action needed
    if '?' in body:
        score += 10
        reasons.append('question detected')
    
    # Short emails often need quick response
    if len(body) < 200:
        score += 5
        reasons.append('short email')
    
    # Determine priority tier
    if score >= 50:
        priority = 'P1'
    elif score >= 30:
        priority = 'P2'
    elif score >= 15:
        priority = 'P3'
    else:
        priority = 'P4'
    
    return priority, reasons

def cmd_run(dry_run: bool, limit: int):
    print(f"🔍 Sorting {limit} emails by priority...")
    msgs = gmail_search('is:unread', limit=limit)
    if not msgs:
        print("✅ No emails to sort.")
        return

    counts = {'P1': 0, 'P2': 0, 'P3': 0, 'P4': 0}
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
        
        priority, reasons = score_email(subject, sender, body)
        counts[priority] += 1
        
        emoji = {'P1': '🔴', 'P2': '🟠', 'P3': '🟡', 'P4': '⚪'}[priority]
        print(f"   {emoji} {priority} {subject[:35]}... from {sender[:20]}")
        
        if not dry_run:
            label_id = gmail_get_or_create_label_id(f'Priority-{priority}')
            gmail_batch_modify({'ids': [msg['id']]}, addLabelIds=[label_id])

    print(f"\n📊 Distribution: P1={counts['P1']}, P2={counts['P2']}, P3={counts['P3']}, P4={counts['P4']}")

def main():
    parser = argparse.ArgumentParser(description='Priority Inbox Sorter')
    parser.add_argument('--execute', action='store_true')
    parser.add_argument('--limit', type=int, default=DEFAULT_LIMIT)
    args = parser.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)

if __name__ == '__main__':
    main()