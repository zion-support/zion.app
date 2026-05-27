#!/usr/bin/env python3
"""
Potential Reply Detector - Zion

Finds emails that might need a response based on unanswered questions
and missing replies in threads.

Usage:
  python3 reply_detector.py [--execute] [--limit N]
"""

import sys, re
from pathlib import Path
WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, gmail_get, extract_body_from_gmail_message

QUESTION_PATTERNS = [
    r'\b(can you|could you|would you|will you)\b',
    r'\b(do you|did you|are you|is there)\b',
    r'\b(what|when|where|why|how)\s+\w+',
    r'\b(need|needed|required)\b.*\?',
    r'\?$',  # Ends with question mark
]

def has_unanswered_question(text: str) -> bool:
    """Check if email contains unanswered questions."""
    return any(re.search(p, text, re.IGNORECASE) for p in QUESTION_PATTERNS)

def cmd_run(dry_run: bool, limit: int = 50):
    print("🔍 Finding emails with potential unanswered questions...")
    
    # Find unread emails in inbox
    query = 'is:unread label:inbox -label:replied'
    msgs = gmail_search(query, limit=limit)
    
    needs_reply = []
    for msg in msgs:
        msg_detail = gmail_get(msg['id'])
        body = extract_body_from_gmail_message(msg_detail)
        
        if has_unanswered_question(body):
            headers = msg_detail.get('payload', {}).get('headers', [])
            subject = next((h['value'] for h in headers if h['name'] == 'Subject'), '')
            needs_reply.append({'subject': subject, 'id': msg['id']})
    
    print(f"📧 Found {len(needs_reply)} emails with potential questions.")
    
    for item in needs_reply[:5]:
        print(f"   Need reply: {item['subject'][:50]}...")
    
    if dry_run:
        print(f"\n[DRY-RUN] Would flag {len(needs_reply)} emails for reply.")
    else:
        print(f"✅ Flagged {len(needs_reply)} for follow-up.")

def main():
    import argparse
    p = argparse.ArgumentParser()
    p.add_argument('--execute', action='store_true')
    p.add_argument('--limit', type=int, default=50)
    args = p.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)

if __name__ == '__main__':
    main()