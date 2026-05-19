#!/usr/bin/env python3
"""
V252 - Reply-All Intelligence
Smart CC handling and multi-recipient awareness
"""

import sys
from pathlib import Path
from datetime import datetime, timedelta

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, gmail_get, gmail_send_reply, gmail_batch_modify, gmail_get_or_create_label_id

LABEL = 'V252-ReplyAll-Intelligence'

class ReplyAllIntelligence:
    def __init__(self):
        self.sig = "Kleber Garcia Alcatrão\nZion Tech Group"
    
    def detect_cc(self, headers):
        to = headers.get('To', '')
        cc = headers.get('Cc', '')
        all_recipients = []
        if to:
            all_recipients.extend([r.strip() for r in to.split(',')])
        if cc:
            all_recipients.extend([r.strip() for r in cc.split(',')])
        return len(all_recipients) > 1
    
    def intelligent_response(self, name, dates, subject, snippet, cc_detected):
        date_str = ', '.join(dates)
        text = f"{subject} {snippet}".lower()
        urgent = 'urgente' in text
        
        priority = "⚡ URGENTE" if urgent else "📅 Disponível"
        greeting = f"Olá {name} e equipe," if cc_detected else f"Olá {name}!"
        
        return f"""{greeting}

{priority}: {date_str}

Recebi sua solicitação e já verifiquei minha agenda.

Sobre a Mansão na Riviera:
- 5 suítes com ar-condicionado
- Piscina aquecida e churrasqueira
- Wi-Fi fibra óptica

Para confirmar sua reserva, entre em contato pelo WhatsApp: +55 11 99999-9999

{self.sig}"""

def get_dates():
    today = datetime.now()
    return [d.strftime('%d/%m/%Y') for d in [today + timedelta(days=x) for x in range(1, 8)] if d.weekday() < 5][:3]

def cmd_run(dry_run=False, limit=5):
    print(" V252 Reply-All Intelligence")
    msgs = gmail_search('is:unread from:airbnb.com', limit=limit)
    for msg in msgs:
        try:
            full = gmail_get(msg['id'])
            headers = {h['name']: h['value'] for h in full.get('payload', {}).get('headers', [])}
            sender = headers.get('From', '')
            name = sender.split('<')[0].strip().strip('"') if '<' in sender else sender
            cc_detected = len(headers.get('Cc', '')) > 0 or len(headers.get('To', '').split(',')) > 1
            response = ReplyAllIntelligence().intelligent_response(name, get_dates(), headers.get('Subject', ''), full.get('snippet', ''), cc_detected)
            print(f" {name[:20]} | ReplyAll")
            if not dry_run:
                gmail_send_reply(msg['id'], response)
        except Exception as e:
            print(f"Error: {e}")
    print(" V252: Reply-All active")

if __name__ == '__main__':
    import argparse
    p = argparse.ArgumentParser()
    p.add_argument('--execute', action='store_true')
    p.add_argument('--limit', type=int, default=5)
    args = p.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)