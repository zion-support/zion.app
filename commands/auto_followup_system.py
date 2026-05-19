#!/usr/bin/env python3
"""Auto-Follow-Up System - Track and follow up on sent emails"""

import sys, json
from pathlib import Path
from datetime import datetime, timezone, timedelta
sys.path.insert(0, '/root/.openclaw/workspace/zion.app/commands')

try:
    from google_workspace import gmail_search, gmail_get, telegram_send
except:
    def gmail_search(q, limit=20): return []
    def gmail_get(i): return {}
    def telegram_send(t): print(f"[TG] {t}")

FOLLOWUP_LOG = Path('/root/.openclaw/workspace/zion.app/data/auto_followups.json')

def find_followups(hours=48):
    """Find emails needing follow-up"""
    since = (datetime.now(timezone.utc) - timedelta(hours=hours)).isoformat()
    sent = gmail_search('in:sent', limit=50)
    
    followups = []
    for s in sent:
        try:
            msg = gmail_get(s['id'])
            headers = msg.get('payload', {}).get('headers', [])
            subject = next((h['value'] for h in headers if h['name'] == 'Subject'), '')
            snippet = msg.get('snippet', '')
            
            # Look for unanswered (no reply in thread)
            thread_id = msg.get('threadId', '')
            replies = gmail_search(f'rfc822msgid:{thread_id}', limit=10)
            
            if len(replies) <= 1:  # Only the sent email
                followups.append({
                    'id': s['id'],
                    'subject': subject[:50],
                    'snippet': snippet[:50],
                    'days_since': hours // 24
                })
        except: pass
    
    return followups[:10]

def main(execute=True):
    print("🔄 Auto-Follow-Up System - Checking for pending follow-ups...")
    followups = find_followups()
    
    if execute:
        telegram_send(f"🔄 {len(followups)} emails need follow-up")
    
    return followups

if __name__ == '__main__':
    main(execute=True)