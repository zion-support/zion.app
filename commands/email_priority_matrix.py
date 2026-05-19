#!/usr/bin/env python3
"""
Email Priority Matrix — Zion

Ranks emails by priority using a matrix of urgency, importance, and sender relationship.

Usage:
  python3 email_priority_matrix.py [--execute] [--limit N]

Options:
  --execute   Apply priority labels (P1-P4)
  --limit N   Max emails (default 35)
"""

import sys, json, argparse
from pathlib import Path

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, gmail_get, gmail_get_or_create_label_id, gmail_batch_modify
from llm_client import chat

DEFAULT_LIMIT = 35

PROMPT = """Rate this email's priority from 1-4 (1=highest):

Consider:
- Urgency: time-sensitive? deadline?
- Importance: business impact?
- Sender: known contact? VIP? new?

Subject: {subject}
From: {sender}
Body: {body}

Priority (1-4):"""

def fetch_unread_emails(limit: int):
    return gmail_search('is:unread newer_than:48h', limit=limit)

def score_priority(subject: str, sender: str, body: str) -> int:
    prompt = PROMPT.format(subject=subject, sender=sender, body=body[:800])
    try:
        resp = chat([{'role': 'user', 'content': prompt}], max_tokens=5)
        score = int(resp['content'].strip())
        return max(1, min(4, score))
    except:
        return 3  # Default medium priority

def cmd_run(dry_run: bool, limit: int):
    print(f"🔍 Scoring priority for {limit} emails...")
    msgs = fetch_unread_emails(limit)
    if not msgs:
        print("✅ No emails to score.")
        return

    priority_counts = {1: 0, 2: 0, 3: 0, 4: 0}
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
        
        priority = score_priority(subject, sender, body)
        priority_counts[priority] += 1
        
        priority_label = f'Priority-P{priority}'
        emoji = '🔴' if priority == 1 else '🟠' if priority == 2 else '🟡' if priority == 3 else '⚪'
        print(f"   {emoji} P{priority} {subject[:35]}... from {sender[:20]}")
        
        if not dry_run:
            label_id = gmail_get_or_create_label_id(priority_label)
            gmail_batch_modify({'ids': [msg['id']]}, addLabelIds=[label_id])

    print(f"\n📊 Priority distribution: P1={priority_counts[1]}, P2={priority_counts[2]}, P3={priority_counts[3]}, P4={priority_counts[4]}")

def main():
    parser = argparse.ArgumentParser(description='Email Priority Matrix')
    parser.add_argument('--execute', action='store_true')
    parser.add_argument('--limit', type=int, default=DEFAULT_LIMIT)
    args = parser.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)

if __name__ == '__main__':
    main()