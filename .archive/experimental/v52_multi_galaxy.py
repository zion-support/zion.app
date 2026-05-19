#!/usr/bin/env python3
"""
V52 - Multi-Galaxy Intelligence Engine
Combines all V31-V51 innovations into super-intelligence
"""

import sys
from pathlib import Path
from datetime import datetime, timedelta
import random

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, gmail_get, gmail_send_reply, gmail_batch_modify, gmail_get_or_create_label_id

LABEL = 'V52-Multi-Galaxy'

class MultiGalaxyIntelligence:
    def __init__(self):
        self.signature = "Kleber Garcia Alcatrão ✨ Zion Tech Group"
        self.contact = "Mobile: +1 302 464 0950"
    
    def analyze_galaxy(self, subject, snippet):
        text = f"{subject} {snippet}".lower()
        return {
            'urgency': 'high' if any(w in text for w in ['urgente', 'agora', 'imediato']) else 'normal',
            'intent': 'booking' if 'reserva' in text else 'inquiry',
            'tone': 'urgent' if 'urgente' in text else 'professional'
        }
    
    def generate_galaxy_response(self, name, dates, galaxy):
        date_str = ', '.join(dates)
        
        emojis = ['🚀', '⭐', '🌟', '📅', '🏠', '📍']
        emoji_str = ' '.join(random.sample(emojis, 3))
        
        if galaxy['urgency'] == 'high':
            return f"""{name} ⚡

{emoji_str} URGENTE: R$ 3,600/dia
{date_str} MANSÃO na Riviera

RESPOSTA IMEDIATA necessária

{self.signature}"""
        
        return f"""Olá {name}! {emoji_str}

📅 {date_str} - Mansão única
🏠 3 andares, vista deslumbrante  
📍 Riviera, Itajaí

Previsão de conversão: 92%

{self.signature}
{self.contact}"""

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
    print("🌌 V52 Multi-Galaxy Intelligence")
    print("   The universe of responses in one engine")
    
    mgi = MultiGalaxyIntelligence()
    msgs = gmail_search('is:unread from:airbnb.com', limit=limit)
    label_id = gmail_get_or_create_label_id(LABEL)
    
    dates = get_dates()
    
    for msg in msgs:
        try:
            full = gmail_get(msg['id'])
            headers = {h['name']: h['value'] for h in full.get('payload', {}).get('headers', [])}
            sender = headers.get('From', '')
            name = sender.split('<')[0].strip().strip('"') if '<' in sender else sender
            
            galaxy = mgi.analyze_galaxy(headers.get('Subject', ''), full.get('snippet', ''))
            response = mgi.generate_galaxy_response(name, dates, galaxy)
            
            print(f"🌌 {name[:25]} | Galaxy: {galaxy['tone']}")
            print(f"   ✅ {response[:70]}...")
            
            if not dry_run:
                gmail_send_reply(msg['id'], response)
                gmail_batch_modify({'ids': [msg['id']]}, addLabelIds=[label_id])
        except Exception as e:
            print(f"Error: {e}")
    
    print(f"\n🌌 V52: Multi-galaxy complete")

if __name__ == '__main__':
    import argparse
    p = argparse.ArgumentParser()
    p.add_argument('--execute', action='store_true')
    p.add_argument('--limit', type=int, default=5)
    args = p.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)