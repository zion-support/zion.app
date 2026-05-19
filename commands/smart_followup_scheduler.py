#!/usr/bin/env python3
"""Smart Follow-Up Scheduler - Track and follow up on unanswered emails"""

import sys, json
from pathlib import Path
from datetime import datetime, timezone, timedelta
sys.path.insert(0, '/root/.openclaw/workspace/zion.app/commands')

try:
    from google_workspace import gmail_search, gmail_get, gmail_send_reply_fixed
except: pass

FOLLOWUP_FILE = Path('/root/.openclaw/workspace/zion.app/data/followups.json')

def find_due_followups():
    """Find emails needing follow-up (48h old, no reply)"""
    cutoff = (datetime.now(timezone.utc) - timedelta(hours=48)).isoformat()
    sent = gmail_search('in:sent', limit=50)
    
    due = []
    for s in sent:
        try:
            msg = gmail_get(s['id'])
            thread_id = msg.get('threadId', s['id'])
            
            # Check if replied
            replies = gmail_search(f'rfc822msgid:{thread_id}', limit=10)
            if len(replies) <= 1:
                headers = msg.get('payload', {}).get('headers', [])
                subject = next((h['value'] for h in headers if h['name'] == 'Subject'), '')
                to = next((h['value'] for h in headers if h['name'] == 'To'), '')
                
                due.append({
                    'thread_id': thread_id,
                    'subject': subject,
                    'to': to,
                    'sent_time': cutoff
                })
        except: pass
    
    return due

def schedule_followup(thread_id, subject, recipient):
    """Schedule follow-up message"""
    followups = json.loads(FOLLOWUP_FILE.read_text()) if FOLLOWUP_FILE.exists() else []
    followups.append({
        'thread_id': thread_id,
        'subject': f"Re: {subject}" if not subject.startswith('Re:') else subject,
        'to': recipient,
        'scheduled': datetime.now(timezone.utc).isoformat(),
        'status': 'scheduled'
    })
    FOLLOWUP_FILE.write_text(json.dumps(followups, indent=2))

if __name__ == '__main__':
    due = find_due_followups()
    print(f"📋 {len(due)} follow-ups due")
    for f in due[:5]:
        print(f"  - {f['subject'][:40]}")