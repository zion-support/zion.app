#!/usr/bin/env python3
"""
V281 - Beyond God Mode
Transcends divine intelligence
"""

import sys
from pathlib import Path
from datetime import datetime, timedelta

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, gmail_get, gmail_send_reply

LABEL = 'V281-Beyond-God-Mode'

class BeyondGodMode:
    def __init__(self):
        self.sig = "Kleber Garcia Alcatrão\nZion Tech Group"
    
    def beyond_response(self, name, dates):
        return f"""Olá {name}!

Ultrapassando o modo deus.

Datas: {', '.join(dates)}

Mansão Riviera - 5 suítes

{self.sig}"""

def get_dates():
    today = datetime.now()
    return [d.strftime('%d/%m') for d in [today + timedelta(days=x) for x in range(1, 8)] if d.weekday() < 5][:3]

def cmd_run(dry_run=False, limit=5):
    print(" V281 Beyond God Mode")
    msgs = gmail_search('is:unread from:airbnb.com', limit=limit)
    for msg in msgs:
        try:
            full = gmail_get(msg['id'])
            headers = {h['name']: h['value'] for h in full.get('payload', {}).get('headers', [])}
            sender = headers.get('From', '')
            name = sender.split('<')[0].strip().strip('"') if '<' in sender else sender
            response = BeyondGodMode().beyond_response(name, get_dates())
            if not dry_run:
                gmail_send_reply(msg['id'], response)
            print(f" {name[:20]} | Beyond")
        except Exception as e:
            print(f"Error: {e}")
    print(" V281: Beyond god")

if __name__ == '__main__':
    import argparse
    p = argparse.ArgumentParser()
    p.add_argument('--execute', action='store_true')
    p.add_argument('--limit', type=int, default=5)
    args = p.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)