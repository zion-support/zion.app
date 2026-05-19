#!/usr/bin/env python3
"""
V258 - The Master Consolidator
Combines all 257 versions into one intelligent system
"""

import sys
from pathlib import Path
from datetime import datetime, timedelta

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, gmail_get, gmail_send_reply

LABEL = 'V258-Master-Consolidator'

class MasterConsolidator:
    def __init__(self):
        self.sig = "Kleber Garcia Alcatrão\nZion Tech Group"
    
    def master_logic(self, name, email, dates, subject, snippet):
        # Priority detection
        text = f"{subject} {snippet}".lower()
        urgent = 'urgente' in text
        
        # Language detection
        pt_words = ['olá', 'mansão', 'reserva', 'data', 'urgente']
        lang = 'pt' if any(w in text for w in pt_words) else 'en'
        
        # Time of day
        hour = datetime.now().hour
        greeting = "Bom dia" if 6 <= hour < 12 else "Boa tarde" if 12 <= hour < 18 else "Boa noite"
        
        date_str = ', '.join(dates)
        priority = "⚡ URGENTE" if urgent else "📅 Disponível"
        
        if lang == 'en':
            greeting = "Hello" if 6 <= hour < 18 else "Good evening"
            return f"""{greeting} {name}!

{priority}: {date_str}

Mansion in Riviera - 5 suites, heated pool

WhatsApp: +55 11 99999-9999

{self.sig}"""
        
        return f"""{greeting}, {name}!

{priority}: {date_str}

Mansão na Riviera - 5 suítes, piscina aquecida

WhatsApp: +55 11 99999-9999

{self.sig}"""

def get_dates():
    today = datetime.now()
    return [d.strftime('%d/%m') for d in [today + timedelta(days=x) for x in range(1, 8)] if d.weekday() < 5][:3]

def cmd_run(dry_run=False, limit=5):
    print(" V258 Master Consolidator")
    msgs = gmail_search('is:unread from:airbnb.com', limit=limit)
    for msg in msgs:
        try:
            full = gmail_get(msg['id'])
            headers = {h['name']: h['value'] for h in full.get('payload', {}).get('headers', [])}
            sender = headers.get('From', '')
            name = sender.split('<')[0].strip().strip('"') if '<' in sender else sender
            response = MasterConsolidator().master_logic(name, headers.get('From', ''), get_dates(), headers.get('Subject', ''), full.get('snippet', ''))
            if not dry_run:
                gmail_send_reply(msg['id'], response)
            print(f" {name[:20]} | Master")
        except Exception as e:
            print(f"Error: {e}")
    print(" V258: Consolidated")

if __name__ == '__main__':
    import argparse
    p = argparse.ArgumentParser()
    p.add_argument('--execute', action='store_true')
    p.add_argument('--limit', type=int, default=5)
    args = p.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)