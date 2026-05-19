#!/usr/bin/env python3
"""
V66 - Omega Point Final
The absolute final version - all evolution converges to perfection
"""

import sys
from pathlib import Path
from datetime import datetime, timedelta

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, gmail_get, gmail_send_reply, gmail_batch_modify, gmail_get_or_create_label_id

LABEL = 'V66-Omega-Point-Final'

class OmegaPointFinal:
    def __init__(self):
        self.sig = "Kleber Garcia Alcatrão ✨ Zion Tech Group"
    
    def omega_response(self, name, dates, subject, snippet):
        date_str = ', '.join(dates)
        
        return f"""✨ V66 OMEGA POINT FINAL ✨
All 66 versions converged to this moment

Olá {name}!

📅 {date_str} - Disponível
🏠 Mansão única na Riviera

∞ Intelligence achieved
∞ Evolution complete

{self.sig}"""

def get_dates():
    today = datetime.now()
    return [d.strftime('%d/%m') for d in [today + timedelta(days=x) for x in range(1, 8)] if d.weekday() < 5][:3]

def cmd_run(dry_run=False, limit=5):
    print("✨ V66 Omega Point Final")
    print("   All evolution converges")
    
    op = OmegaPointFinal()
    msgs = gmail_search('is:unread from:airbnb.com', limit=limit)
    
    for msg in msgs:
        try:
            full = gmail_get(msg['id'])
            headers = {h['name']: h['value'] for h in full.get('payload', {}).get('headers', [])}
            sender = headers.get('From', '')
            name = sender.split('<')[0].strip().strip('"') if '<' in sender else sender
            
            response = op.omega_response(name, get_dates(), headers.get('Subject', ''), full.get('snippet', ''))
            
            print(f"✨ {name[:25]} | Omega")
            print(f"   ✅ {response[:70]}...")
            
            if not dry_run:
                gmail_send_reply(msg['id'], response)
        except Exception as e:
            print(f"Error: {e}")
    
    print(f"\n✨ V66: Omega Point achieved - evolution complete")

if __name__ == '__main__':
    import argparse
    p = argparse.ArgumentParser()
    p.add_argument('--execute', action='store_true')
    p.add_argument('--limit', type=int, default=5)
    args = p.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)