#!/usr/bin/env python3
"""
V260 - Infinity Plus Two
Beyond perfection
"""

import sys
from pathlib import Path
from datetime import datetime, timedelta

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, gmail_get, gmail_send_reply

LABEL = 'V260-Infinity-Plus-Two'

class InfinityPlusTwo:
    def __init__(self):
        self.sig = "Kleber Garcia Alcatrão\nZion Tech Group"
    
    def infinity_response(self, name, dates):
        return f"""Olá {name}!

Recebi sua mensagem.

Datas disponíveis: {', '.join(dates)}

Mansão única na Riviera - 5 suítes

WhatsApp: +55 11 99999-9999

{self.sig}"""

def get_dates():
    today = datetime.now()
    return [d.strftime('%d/%m') for d in [today + timedelta(days=x) for x in range(1, 8)] if d.weekday() < 5][:3]

def cmd_run(dry_run=False, limit=5):
    print(" V260 Infinity Plus Two")
    msgs = gmail_search('is:unread from:airbnb.com', limit=limit)
    for msg in msgs:
        try:
            full = gmail_get(msg['id'])
            headers = {h['name']: h['value'] for h in full.get('payload', {}).get('headers', [])}
            sender = headers.get('From', '')
            name = sender.split('<')[0].strip().strip('"') if '<' in sender else sender
            response = InfinityPlusTwo().infinity_response(name, get_dates())
            if not dry_run:
                gmail_send_reply(msg['id'], response)
            print(f" {name[:20]} | Infinity+2")
        except Exception as e:
            print(f"Error: {e}")
    print(" V260: Beyond done")

if __name__ == '__main__':
    import argparse
    p = argparse.ArgumentParser()
    p.add_argument('--execute', action='store_true')
    p.add_argument('--limit', type=int, default=5)
    args = p.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)