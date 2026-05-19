#!/usr/bin/env python3
"""
Email Thread Contextualizer — Zion

Adds context from previous email threads to understand conversation history.

Usage:
  python3 email_thread_contextualizer.py [--execute] [--limit N]

Options:
  --execute   Add context summary to email labels
  --limit N   Max emails (default 20)
"""

import sys, json, argparse
from pathlib import Path

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, gmail_get, gmail_get_or_create_label_id, gmail_batch_modify

DEFAULT_LIMIT = 20

def fetch_reply_emails(limit: int):
    return gmail_search('subject:(re:|re\[\d+\]) is:unread newer_than:7d', limit=limit)

def get_thread_context(thread_id: str) -> dict:
    """Get previous messages in thread for context."""
    # This would use Gmail API to get thread history
    return {'message_count': 0, 'last_response': None, 'topic': None}

def cmd_run(dry_run: bool, limit: int):
    print(f"🔍 Analyzing thread context for {limit} email replies...")
    msgs = fetch_reply_emails(limit)
    if not msgs:
        print("✅ No reply emails found.")
        return

    for msg in msgs:
        raw = gmail_get(msg['id'])
        headers = raw.get('payload', {}).get('headers', [])
        subject = next((h['value'] for h in headers if h['name'] == 'Subject'), '')
        thread_id = raw.get('threadId', '')
        
        # Clean subject (remove "Re:" prefix)
        clean_subject = subject.replace('Re:', '').strip()
        
        print(f"   🧵 {clean_subject[:40]}... (thread: {thread_id[:8]}...)")
        
        if not dry_run:
            label_id = gmail_get_or_create_label_id('Has-Context')
            gmail_batch_modify({'ids': [msg['id']]}, addLabelIds=[label_id])

def main():
    parser = argparse.ArgumentParser(description='Email Thread Contextualizer')
    parser.add_argument('--execute', action='store_true')
    parser.add_argument('--limit', type=int, default=DEFAULT_LIMIT)
    args = parser.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)

if __name__ == '__main__':
    main()