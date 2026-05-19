#!/usr/bin/env python3
"""
Action Item Extractor — Zion

Extracts action items, tasks, and to-dos from emails.

Usage:
  python3 action_item_extractor.py [--execute] [--limit N]

Options:
  --execute   Create tasks in Google Tasks or label emails
  --limit N   Max emails (default 25)
"""

import sys, json, argparse, re
from pathlib import Path

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, gmail_get, gmail_get_or_create_label_id, gmail_batch_modify
from llm_client import chat

DEFAULT_LIMIT = 25

PROMPT = """Extract action items from this email. Return each on a new line starting with "- ". If none, return "NO_ACTION_ITEMS".

Format:
- WHO needs to do WHAT by WHEN
- Example: - John to send the report by Friday

Email Subject: {subject}
Body: {body}

Action Items:"""

def fetch_unread_emails(limit: int):
    return gmail_search('is:unread newer_than:7d', limit=limit)

def extract_action_items(subject: str, body: str) -> list:
    prompt = PROMPT.format(subject=subject, body=body[:1000])
    try:
        resp = chat([{'role': 'user', 'content': prompt}], max_tokens=200)
        content = resp['content'].strip()
        if content.upper() == 'NO_ACTION_ITEMS':
            return []
        items = [line.strip('- ').strip() for line in content.split('\n') if line.strip().startswith('-')]
        return items
    except:
        return []

def cmd_run(dry_run: bool, limit: int):
    print(f"🔍 Extracting action items from {limit} emails...")
    msgs = fetch_unread_emails(limit)
    if not msgs:
        print("✅ No emails to process.")
        return

    total_items = 0
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
        
        items = extract_action_items(subject, body)
        
        if items:
            print(f"\n📋 {subject[:40]}... ({len(items)} action items)")
            for item in items:
                print(f"   - {item}")
                total_items += 1
            
            if not dry_run:
                label_id = gmail_get_or_create_label_id('Has-Action-Items')
                gmail_batch_modify({'ids': [msg['id']]}, addLabelIds=[label_id])
        else:
            print(f"   ✓ {subject[:40]}... (no action items)")

    print(f"\n📊 Total action items extracted: {total_items}")

def main():
    parser = argparse.ArgumentParser(description='Action Item Extractor')
    parser.add_argument('--execute', action='store_true')
    parser.add_argument('--limit', type=int, default=DEFAULT_LIMIT)
    args = parser.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)

if __name__ == '__main__':
    main()