#!/usr/bin/env python3
"""
Email Intent Extractor — Zion

Extracts the core intent/purpose from emails to help prioritize and route responses.

Usage:
  python3 email_intent_extractor.py [--execute] [--limit N]

Options:
  --execute   Store extracted intents in email metadata
  --limit N   Max emails to process (default 30)
"""

import sys, json, argparse, re
from pathlib import Path

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, gmail_get, gmail_get_or_create_label_id, gmail_batch_modify
from llm_client import chat

DEFAULT_LIMIT = 30

PROMPT = """Extract the core intent from this email in 5 words or less. Focus on the primary action or question.

Subject: {subject}
Body: {body}

Intent:"""

def fetch_unread_emails(limit: int):
    return gmail_search('is:unread newer_than:48h', limit=limit)

def extract_intent(subject: str, body: str) -> str:
    prompt = PROMPT.format(subject=subject, body=body[:800])
    try:
        resp = chat([{'role': 'user', 'content': prompt}], max_tokens=30)
        intent = resp['content'].strip()
        # Clean and limit to ~20 chars
        intent = re.sub(r'[^a-zA-Z0-9\s]', '', intent)[:20]
        return intent if intent else 'general inquiry'
    except:
        return 'unclear'

def cmd_run(dry_run: bool, limit: int):
    print(f"🔍 Extracting intents from {limit} emails...")
    msgs = fetch_unread_emails(limit)
    if not msgs:
        print("✅ No emails to process.")
        return

    intents = {}
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
        
        intent = extract_intent(subject, body)
        intents[intent] = intents.get(intent, 0) + 1
        
        print(f"   ✓ {subject[:35]}... → intent: {intent}")
        
        if not dry_run:
            label_name = f'Intent-{intent.replace(" ", "_")}'
            label_id = gmail_get_or_create_label_id(label_name)
            gmail_batch_modify({'ids': [msg['id']]}, addLabelIds=[label_id])

    print(f"\n📊 Top intents: {dict(sorted(intents.items(), key=lambda x: -x[1])[:10])}")

def main():
    parser = argparse.ArgumentParser(description='Email Intent Extractor')
    parser.add_argument('--execute', action='store_true')
    parser.add_argument('--limit', type=int, default=DEFAULT_LIMIT)
    args = parser.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)

if __name__ == '__main__':
    main()