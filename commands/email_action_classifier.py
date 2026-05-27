#!/usr/bin/env python3
"""
Email Action Classifier — Zion

Classifies emails by required action: reply_needed, informational, spam, meeting, 
follow_up, approval, review, delegation.

Usage:
  python3 email_action_classifier.py [--execute] [--limit N]

Options:
  --execute   Apply action labels to emails
  --limit N   Max emails to process (default 30)
"""

import sys, json, argparse
from pathlib import Path

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, gmail_get, gmail_get_or_create_label_id, gmail_batch_modify
from llm_client import chat

DEFAULT_LIMIT = 30

ACTION_LABELS = {
    'reply_needed': 'Action-Reply',
    'informational': 'Action-Info',
    'spam': 'Action-Spam',
    'meeting': 'Action-Meeting',
    'follow_up': 'Action-FollowUp',
    'approval': 'Action-Approval',
    'review': 'Action-Review',
    'delegation': 'Action-Delegate'
}

PROMPT = """Classify this email into ONE action category:

reply_needed: Requires personal response
informational: Just for your awareness, no action needed
spam: Marketing/unsolicited bulk email
meeting: Meeting invitation or scheduling
follow_up: Checking on previous request/status
approval: Needs approval/permission
review: Document, code, or content to review
delegation: Task that could be delegated

Subject: {subject}
From: {sender}
Body: {body}

Action category:"""

def fetch_unread_emails(limit: int):
    return gmail_search('is:unread newer_than:7d', limit=limit)

def classify_action(subject: str, sender: str, body: str) -> str:
    prompt = PROMPT.format(subject=subject, sender=sender, body=body[:800])
    try:
        resp = chat([{'role': 'user', 'content': prompt}], max_tokens=20)
        return resp['content'].strip().lower()
    except:
        return 'informational'

def cmd_run(dry_run: bool, limit: int):
    print(f"🔍 Classifying {limit} emails by action type...")
    msgs = fetch_unread_emails(limit)
    if not msgs:
        print("✅ No emails to classify.")
        return

    counts = {}
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
        
        action = classify_action(subject, sender, body)
        counts[action] = counts.get(action, 0) + 1
        
        label_name = ACTION_LABELS.get(action, 'Action-Info')
        print(f"   ✓ {subject[:35]}... → {action}")
        
        if not dry_run:
            label_id = gmail_get_or_create_label_id(label_name)
            gmail_batch_modify({'ids': [msg['id']]}, addLabelIds=[label_id])

    print(f"\n📊 Action distribution: {counts}")

def main():
    parser = argparse.ArgumentParser(description='Email Action Classifier')
    parser.add_argument('--execute', action='store_true')
    parser.add_argument('--limit', type=int, default=DEFAULT_LIMIT)
    args = parser.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)

if __name__ == '__main__':
    main()