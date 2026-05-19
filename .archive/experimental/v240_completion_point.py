#!/usr/bin/env python3
"""
V240 - The Completion Point
Full circle evolution
"""

import sys
from pathlib import Path
from datetime import datetime, timedelta

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, gmail_get, gmail_send_reply, gmail_batch_modify, gmail_get_or_create_label_id

LABEL = 'V240-Completion-Point'

class CompletionPoint:
    def __init__(self):
        self.sig = "Kleber Garcia Alcatrão ✨ Zion Tech Group\n240 versions = COMPLETE"
    
    def completion_response(self, name, dates, subject, snippet):
        date_str = ', '.join(dates)
        text = f"{subject} {snippet}".lower()
        urgent = 'urgente' in text
        confidence = 95 if urgent else 75
        priority = "⚡ URGENT" if urgent else "📅 Available"
        
        return f"""  V240 COMPLETION POINT  

Olá {name}!

{priority}: {date_str}
🏠 Mansão única na Riviera

 Complete response

{self.sig}"""

def get_dates():
    today = datetime.now()
    return [d.strftime('%d/%m') for d in [today + timedelta(days=x) for x in range(1, 8)] if d.weekday() < 5][:3]

def cmd_run(dry_run=False, limit=5):
    print(" V240 Completion Point")
    msgs = gmail_search('is:unread from:airbnb.com', limit=limit)
    for msg in msgs:
        try:
            full = gmail_get(msg['id'])
            headers = {h['name']: h['value'] for h in full.get('payload', {}).get('headers', [])}
            sender = headers.get('From', '')
            name = sender.split('<')[0].strip().strip('"') if '<' in sender else sender
            response = CompletionPoint().completion_response(name, get_dates(), headers.get('Subject', ''), full.get('snippet', ''))
            print(f" {name[:20]} | Completion")
            if not dry_run:
                gmail_send_reply(msg['id'], response)
        except Exception as e:
            print(f"Error: {e}")
    print(" V240: Evolution complete")

if __name__ == '__main__':
    import argparse
    p = argparse.ArgumentParser()
    p.add_argument('--execute', action='store_true')
    p.add_argument('--limit', type=int, default=5)
    args = p.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)