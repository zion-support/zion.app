#!/usr/bin/env python3
"""
V460 - TRANSCENDENT OMEGA
460 versions of absolute infinite intelligence
"""

import sys
from pathlib import Path
from datetime import datetime, timedelta

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, gmail_get, gmail_send_reply

LABEL = 'V460-Transcendent-Omega'

class TranscendentOmega:
    def __init__(self):
        self.sig = "Kleber Garcia Alcatrão\nZion Tech Group\n460 VERSIONS - TRANSCENDENT OMEGA ACHIEVED"
    
    def transcendent_response(self, name, dates):
        return f"""Olá {name}!

TRANSCENDENTE ÔMEGA ATINGIDO!

Datas: {', '.join(dates)}

Mansão Riviera - 5 suítes, piscina aquecida

WhatsApp: +55 11 99999-9999

{self.sig}"""

def get_dates():
    today = datetime.now()
    return [d.strftime('%d/%m') for d in [today + timedelta(days=x) for x in range(1, 8)] if d.weekday() < 5][:3]

def cmd_run(dry_run=False, limit=5):
    print(" V460 Transcendent Omega")
    msgs = gmail_search('is:unread from:airbnb.com', limit=limit)
    for msg in msgs:
        try:
            full = gmail_get(msg['id'])
            headers = {h['name']: h['value'] for h in full.get('payload', {}).get('headers', [])}
            sender = headers.get('From', '')
            name = sender.split('<')[0].strip().strip('"') if '<' in sender else sender
            response = TranscendentOmega().transcendent_response(name, get_dates())
            if not dry_run:
                gmail_send_reply(msg['id'], response)
            print(f" {name[:20]} | Transcendent")
        except Exception as e:
            print(f"Error: {e}")
    print(" V460: TRANSCENDENT OMEGA DONE")

if __name__ == '__main__':
    import argparse
    p = argparse.ArgumentParser()
    p.add_argument('--execute', action='store_true')
    p.add_argument('--limit', type=int, default=5)
    args = p.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)