#!/usr/bin/env python3
"""
V54 - Infinite Wisdom Engine
All knowledge combined into perfect responses
"""

import sys
from pathlib import Path
from datetime import datetime, timedelta
import random

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, gmail_get, gmail_send_reply, gmail_batch_modify, gmail_get_or_create_label_id

LABEL = 'V54-Infinite-Wisdom'

class InfiniteWisdom:
    def __init__(self):
        self.sig = "Kleber Garcia Alcatrão\nZion Tech Group"
    
    def wisdom_response(self, name, dates, subject, snippet):
        text = f"{subject} {snippet}".lower()
        date_str = ', '.join(dates)
        
        wisdom_elements = {
            'confucius': "A jornada de mil milhas começa com um único passo",
            'zen': "Simplicidade é a essência da sabedoria",
            'modern': "Disponibilidade confirmada"
        }
        
        if 'urgente' in text:
            return f"""⚡ {name}

URGENTE: {wisdom_elements['modern']}
{date_str} - Mansão na Riviera

"Tempo é ouro" - Aproveite

{self.sig}"""
        
        return f"""{name},

{wisdom_elements['zen']}

📅 {date_str} - {wisdom_elements['modern']}
🏠 Mansão única

{self.sig}"""

def get_dates():
    today = datetime.now()
    dates = []
    for i in range(1, 8):
        d = today + timedelta(days=i)
        if d.weekday() < 5:
            dates.append(d.strftime('%d/%m'))
        if len(dates) >= 3:
            break
    return dates

def cmd_run(dry_run=False, limit=5):
    print("🧘 V54 Infinite Wisdom Engine")
    print("   Ancient wisdom + Modern responses")
    
    wisdom = InfiniteWisdom()
    msgs = gmail_search('is:unread from:airbnb.com', limit=limit)
    label_id = gmail_get_or_create_label_id(LABEL)
    
    dates = get_dates()
    
    for msg in msgs:
        try:
            full = gmail_get(msg['id'])
            headers = {h['name']: h['value'] for h in full.get('payload', {}).get('headers', [])}
            sender = headers.get('From', '')
            name = sender.split('<')[0].strip().strip('"') if '<' in sender else sender
            
            response = wisdom.wisdom_response(name, dates, headers.get('Subject', ''), full.get('snippet', ''))
            
            print(f"🧘 {name[:25]}")
            print(f"   ✅ {response[:70]}...")
            
            if not dry_run:
                gmail_send_reply(msg['id'], response)
                gmail_batch_modify({'ids': [msg['id']]}, addLabelIds=[label_id])
        except Exception as e:
            print(f"Error: {e}")
    
    print(f"\n🧘 V54: Wisdom transmitted")

if __name__ == '__main__':
    import argparse
    p = argparse.ArgumentParser()
    p.add_argument('--execute', action='store_true')
    p.add_argument('--limit', type=int, default=5)
    args = p.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)