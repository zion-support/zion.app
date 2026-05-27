#!/usr/bin/env python3
"""
Autonomous Auto-Responder - Zion

Sends email replies automatically WITHOUT human review.
- Reads high-priority unread emails
- Generates context-appropriate replies via LLM
- SENDS REPLY IMMEDIATELY (no draft waiting)
- Logs sent replies for tracking

Usage:
  python3 autonomous_responder.py --execute --limit 10
"""

import sys, os, json
from datetime import datetime
from pathlib import Path
WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, gmail_send_reply, telegram_send

REPLY_PROMPT = """
You are Kleber Garcia Alcatrão, CEO of Zion Tech Group.
Write a short, professional, helpful reply (under 60 words).
Tone: direct, friendly, slightly informal.
Sign as "Kleber Garcia Alcatrão, Zion Tech Group"

Email:
  From: {sender}
  Subject: {subject}
  Snippet: {snippet}

Reply:
"""

def cmd_run(dry_run: bool, limit: int = 10):
    print("🚀 Autonomous Auto-Responder - Sending replies automatically")
    
    # Get high priority unread emails
    query = 'label:inbox is:unread priority:4 priority:5'
    msgs = gmail_search(query, limit=limit)
    
    if not msgs:
        # Fallback: any unread email
        query = 'label:inbox is:unread'
        msgs = gmail_search(query, limit=limit)
    
    print(f"📧 Found {len(msgs)} emails to respond to")
    
    sent_count = 0
    for msg in msgs:
        msg_id = msg['id']
        headers = msg.get('payload', {}).get('headers', [])
        sender = next((h['value'] for h in headers if h['name'] == 'From'), '')
        subject = next((h['value'] for h in headers if h['name'] == 'Subject'), '')
        snippet = msg.get('snippet', '')
        
        # Generate reply
        prompt = REPLY_PROMPT.format(sender=sender, subject=subject, snippet=snippet)
        
        try:
            from llm_client import chat
            resp = chat([{"role":"user","content":prompt}], provider="auto", temperature=0.7)
            reply_text = resp.get('content', '').strip()
            
            # Clean up reply
            if 'Reply:' in reply_text:
                reply_text = reply_text.split('Reply:')[-1].strip()
            
            if dry_run:
                print(f"\nWould send to {sender[:30]}:")
                print(f"   {reply_text[:80]}...")
            else:
                # SEND THE EMAIL IMMEDIATELY
                result = gmail_send_reply(msg_id, reply_text)
                print(f"\n✅ Sent reply to {sender[:30]}")
                sent_count += 1
                
        except Exception as e:
            print(f"   ⚠️ Error: {e}")
    
    if dry_run:
        print(f"\n[DRY-RUN] Would send {len(msgs)} replies.")
    else:
        print(f"\n🎉 Sent {sent_count} autonomous replies!")
        telegram_send(f"📧 Autonomous Responder: Sent {sent_count} emails")

def main():
    import argparse
    p = argparse.ArgumentParser()
    p.add_argument('--execute', action='store_true')
    p.add_argument('--limit', type=int, default=10)
    args = p.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)

if __name__ == '__main__':
    main()