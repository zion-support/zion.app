#!/usr/bin/env python3
"""
Email Reply Suggester — Zion

Suggests appropriate reply templates based on email content and context.
Works alongside tone detection to provide context-aware responses.

Usage:
  python3 email_reply_suggester.py [--execute] [--limit N]

Options:
  --execute   Apply "Reply-Suggested" label
  --limit N   Max emails (default 30)
"""

import sys, json, argparse
from pathlib import Path

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, gmail_get, gmail_get_or_create_label_id, gmail_batch_modify
from llm_client import chat

DEFAULT_LIMIT = 30

TEMPLATES = {
    'meeting_request': "Thanks for reaching out. I'd like to schedule a meeting to discuss this further. What does your calendar look like for [DAY] around [TIME]?",
    'information_request': "Thanks for your email. Here's the information you requested: [DETAILS]. Please let me know if you need anything else.",
    'follow_up': "Following up on my previous email. Have you had a chance to review this? Happy to discuss any questions.",
    'introduction': "Great to connect! Thanks for reaching out. I look forward to exploring how we can work together.",
    'proposal': "Thank you for the proposal. I'll review this with my team and get back to you by [TIMEFRAME] with our feedback.",
    'confirmation': "Confirmation received. Looking forward to it. For your records, here are the details: [DETAILS]"
}

PROMPT = """Classify this email into ONE category: meeting_request, information_request, follow_up, introduction, proposal, confirmation, other.

Subject: {subject}
Body: {body}

Category:"""

def fetch_unread_emails(limit: int):
    query = 'is:unread newer_than:7d'
    return gmail_search(query, limit=limit)

def suggest_reply_type(subject: str, body: str) -> str:
    prompt = PROMPT.format(subject=subject, body=body[:800])
    try:
        resp = chat([{'role': 'user', 'content': prompt}], max_tokens=20)
        return resp['content'].strip().lower()
    except:
        return 'other'

def cmd_run(dry_run: bool, limit: int):
    print(f"🔍 Analyzing {limit} emails for reply suggestions...")
    msgs = fetch_unread_emails(limit)
    if not msgs:
        print("✅ No emails to analyze.")
        return

    suggestions = {}
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
        body = base64.urlsafe_b64decode(body_data).decode('utf-8', errors='ignore')
        
        reply_type = suggest_reply_type(subject, body)
        template = TEMPLATES.get(reply_type, "Thank you for your email. I'll review and respond shortly.")
        
        suggestions[reply_type] = suggestions.get(reply_type, 0) + 1
        print(f"   ✓ {subject[:40]}... → {reply_type}")
        
        if not dry_run:
            label_id = gmail_get_or_create_label_id('Reply-Suggested')
            gmail_batch_modify({'ids': [msg['id']]}, addLabelIds=[label_id])

    print(f"\n📊 Reply types: {suggestions}")

def main():
    parser = argparse.ArgumentParser(description='Email Reply Suggester')
    parser.add_argument('--execute', action='store_true')
    parser.add_argument('--limit', type=int, default=DEFAULT_LIMIT)
    args = parser.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)

if __name__ == '__main__':
    main()