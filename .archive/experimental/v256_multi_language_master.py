#!/usr/bin/env python3
"""
V256 - Multi-Language Master
Seamless Portuguese/English switching
"""

import sys
from pathlib import Path
from datetime import datetime, timedelta

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, gmail_get, gmail_send_reply

LABEL = 'V256-Multi-Language-Master'

class MultiLanguageMaster:
    def __init__(self):
        self.sig = "Kleber Garcia Alcatrão\nZion Tech Group"
    
    def detect_language(self, text):
        pt_words = ['olá', 'mansão', 'reserva', 'data', 'preço', 'disponível', 'urgente']
        en_words = ['hello', 'mansion', 'booking', 'date', 'price', 'available', 'urgent']
        
        text_lower = text.lower()
        pt_count = sum(1 for w in pt_words if w in text_lower)
        en_count = sum(1 for w in en_words if w in text_lower)
        
        return 'pt' if pt_count >= en_count else 'en'
    
    def generate_response(self, name, dates, subject, snippet, lang):
        date_str = ', '.join(dates)
        
        if lang == 'en':
            return f"""Hello {name}!

Received your inquiry about the Mansion in Riviera.

Available dates: {date_str}

The property offers:
- 5 suites with AC
- Heated pool
- Beach access

WhatsApp: +55 11 99999-9999

{self.sig}"""
        else:
            return f"""Olá {name}!

Recebi sua consulta sobre a Mansão na Riviera.

Datas disponíveis: {date_str}

A propriedade oferece:
- 5 suítes com ar-condicionado
- Piscina aquecida
- Acesso à praia

WhatsApp: +55 11 99999-9999

{self.sig}"""

def get_dates():
    today = datetime.now()
    return [d.strftime('%d/%m') for d in [today + timedelta(days=x) for x in range(1, 8)] if d.weekday() < 5][:3]

def cmd_run(dry_run=False, limit=5):
    print(" V256 Multi-Language Master")
    msgs = gmail_search('is:unread from:airbnb.com', limit=limit)
    for msg in msgs:
        try:
            full = gmail_get(msg['id'])
            headers = {h['name']: h['value'] for h in full.get('payload', {}).get('headers', [])}
            sender = headers.get('From', '')
            name = sender.split('<')[0].strip().strip('"') if '<' in sender else sender
            lang = MultiLanguageMaster().detect_language(f"{headers.get('Subject', '')} {full.get('snippet', '')}")
            response = MultiLanguageMaster().generate_response(name, get_dates(), headers.get('Subject', ''), full.get('snippet', ''), lang)
            if not dry_run:
                gmail_send_reply(msg['id'], response)
            print(f" {name[:20]} | Lang:{lang}")
        except Exception as e:
            print(f"Error: {e}")
    print(" V256: Multilingual active")

if __name__ == '__main__':
    import argparse
    p = argparse.ArgumentParser()
    p.add_argument('--execute', action='store_true')
    p.add_argument('--limit', type=int, default=5)
    args = p.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)