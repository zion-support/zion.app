#!/usr/bin/env python3
"""
V44 - Digital Twin Personality Engine
Mimics Kleber's exact communication style and patterns
"""

import sys
from pathlib import Path
from datetime import datetime, timedelta
import random

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, gmail_get, gmail_send_reply, gmail_batch_modify, gmail_get_or_create_label_id

LABEL = 'V44-Digital-Twin'

KLEBER_SIGNATURE = "Kleber Garcia Alcatrão\nZion Tech Group (a Zion Holdings Company)"
KLEBER_CONTACT = "Mobile: +1 302 464 0950\nSkype: kleber.alcatrao\nWebsite: https://www.ziontechgroup.com"
KLEBER_ADDRESS = "Address: 364 E Main St STE 1008, Middletown, DE"

KLEBER_STYLES = {
    'greetings': ["Olá!", "Prezado(a),", "Oi,", "Olá,", "Prezado(a) Senhor/Senhora,"],
    'tone': ["Estou à disposição.", "Fico no aguardo.", "Aguardo retorno.", "Conte comigo."],
    'value_props': [
        "Mansão única na Riviera",
        "Propriedade especial com 3 andares", 
        "Experiência exclusiva em Itajaí",
        "Localização privilegiada"
    ],
    'sign_offs': ["Atenciosamente,", "Cordialmente,", "Um forte abraço,", ""]
}

class DigitalTwin:
    def analyze_sender_context(self, subject, snippet):
        text = f"{subject} {snippet}".lower()
        if any(w in text for w in ['urgente', 'crítico', 'imediato']):
            return 'direct'
        elif any(w in text for w in ['cooperacao', 'parceria']):
            return 'friendly'
        else:
            return 'professional'
    
    def generate_kleber_response(self, name, dates, style):
        dates_str = ', '.join(dates)
        greeting = random.choice(KLEBER_STYLES['greetings'])
        tone = random.choice(KLEBER_STYLES['tone'])
        value_prop = random.choice(KLEBER_STYLES['value_props'])
        sign_off = random.choice(KLEBER_STYLES['sign_offs'])
        
        if style == 'direct':
            return f"{greeting} {name}\n\n{value_prop} disponível para {dates_str}.\n\n{tone}\n\n{sign_off}\n{KLEBER_SIGNATURE}"
        elif style == 'friendly':
            return f"{greeting} {name}\n\nQue alegria com seu contato! {value_prop} pode ser sua em {dates_str}.\n\n{tone}\n\n{sign_off}\n{KLEBER_SIGNATURE}"
        else:
            return f"{greeting} {name},\n\nInformamos que {value_prop} está disponível para os dias {dates_str}.\n\n{tone}\n\n{sign_off}\n{KLEBER_SIGNATURE}\n{KLEBER_CONTACT}\n{KLEBER_ADDRESS}"

def get_available_dates():
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
    print("🎭 V44 Digital Twin Personality Engine")
    print("   Features: Exact Style Mimicry + Signature Replication + Tone Matching")
    
    twin = DigitalTwin()
    msgs = gmail_search('is:unread from:airbnb.com', limit=20)
    label_id = gmail_get_or_create_label_id(LABEL)
    
    stats = {'replied': 0, 'styles': {}}
    
    for msg in msgs[:limit]:
        try:
            full = gmail_get(msg['id'])
            headers = {h['name']: h['value'] for h in full.get('payload', {}).get('headers', [])}
            sender = headers.get('From', '')
            subject = headers.get('Subject', '')
            snippet = full.get('snippet', '')
            
            name_part = sender.split('<')[0].strip().strip('"') if '<' in sender else sender
            
            style = twin.analyze_sender_context(subject, snippet)
            stats['styles'][style] = stats['styles'].get(style, 0) + 1
            
            dates = get_available_dates()
            response = twin.generate_kleber_response(name_part, dates, style)
            
            print(f"🎭 {name_part[:25]} | Style: {style}")
            print(f"   ✅ {response[:70]}...")
            
            if not dry_run:
                gmail_send_reply(msg['id'], response)
                gmail_batch_modify({'ids': [msg['id']]}, addLabelIds=[label_id])
            
            stats['replied'] += 1
                
        except Exception as e:
            print(f"Error: {e}")
            continue
    
    print(f"\n📊 Replied: {stats['replied']} | Styles used: {stats['styles']}")

if __name__ == '__main__':
    import argparse
    p = argparse.ArgumentParser()
    p.add_argument('--execute', action='store_true')
    p.add_argument('--limit', type=int, default=5)
    args = p.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)