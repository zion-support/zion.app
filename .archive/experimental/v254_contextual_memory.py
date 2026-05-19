#!/usr/bin/env python3
"""
V254 - Contextual Memory
Remembers past interactions with guests
"""

import sys
from pathlib import Path
from datetime import datetime, timedelta
import json

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, gmail_get, gmail_send_reply

LABEL = 'V254-Contextual-Memory'

class ContextualMemory:
    def __init__(self):
        self.sig = "Kleber Garcia Alcatrão\nZion Tech Group"
        self.context_file = WORKSPACE / 'zion.app' / 'data' / 'guest_memory.json'
    
    def remember(self, guest_email, preferences):
        memory = {}
        if self.context_file.exists():
            memory = json.loads(self.context_file.read_text())
        memory[guest_email] = preferences
        self.context_file.parent.mkdir(exist_ok=True)
        self.context_file.write_text(json.dumps(memory))
    
    def recall(self, guest_email):
        if self.context_file.exists():
            memory = json.loads(self.context_file.read_text())
            return memory.get(guest_email, {})
        return {}
    
    def context_response(self, name, email, dates, subject, snippet, prev_interactions):
        date_str = ', '.join(dates)
        prev_note = ""
        if prev_interactions:
            prev_note = f"\n\nBom ver você novamente! Anoto suas preferências: {prev_interactions}"
        
        return f"""Olá {name}!

Recebi sua solicitação sobre a Mansão na Riviera.{prev_note}

Datas consultadas: {date_str}

A propriedade oferece:
- 5 suítes climatizadas
- Piscina aquecida
- Acesso à praia

WhatsApp para confirmação: +55 11 99999-9999

{self.sig}"""

def get_dates():
    today = datetime.now()
    return [d.strftime('%d/%m') for d in [today + timedelta(days=x) for x in range(1, 8)] if d.weekday() < 5][:3]

def cmd_run(dry_run=False, limit=5):
    print(" V254 Contextual Memory")
    cm = ContextualMemory()
    msgs = gmail_search('is:unread from:airbnb.com', limit=limit)
    for msg in msgs:
        try:
            full = gmail_get(msg['id'])
            headers = {h['name']: h['value'] for h in full.get('payload', {}).get('headers', [])}
            sender = headers.get('From', '')
            email = sender.split('<')[-1].split('>')[0] if '<' in sender else sender
            name = sender.split('<')[0].strip().strip('"') if '<' in sender else sender
            prev = cm.recall(email)
            response = cm.context_response(name, email, get_dates(), headers.get('Subject', ''), full.get('snippet', ''), prev)
            if not dry_run:
                cm.remember(email, {"last_contact": str(datetime.now()), "preferences": "Mansão Riviera"})
                gmail_send_reply(msg['id'], response)
            print(f" {name[:20]} | Remembered")
        except Exception as e:
            print(f"Error: {e}")
    print(" V254: Context captured")

if __name__ == '__main__':
    import argparse
    p = argparse.ArgumentParser()
    p.add_argument('--execute', action='store_true')
    p.add_argument('--limit', type=int, default=5)
    args = p.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)