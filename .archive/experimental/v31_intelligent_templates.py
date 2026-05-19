#!/usr/bin/env python3
"""
V31 - Intelligent Template Engine with Smart Variables
Works without LLM - smart templates with dynamic insertion
"""

import sys
from pathlib import Path
from datetime import datetime, timedelta
import random

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, gmail_get, gmail_send_reply, gmail_batch_modify, gmail_get_or_create_label_id

LABEL = 'V31-Intelligent-Templates'

# Smart template bank
TEMPLATES = {
    'pt_booking': [
        "Olá! Confirmo que a Mansão espaçosa na Riviera está disponível para {dates}. Fico no aguardo da sua confirmação. Atenciosamente, Kleber Garcia Alcatrão, Zion Tech Group.",
        "Prezado(a), Temos disponibilidade para a Mansão de 3 andares nos dias {dates}. Estamos à disposição para finalizar sua reserva. Saudações, Kleber.",
        "Consultamos sua solicitação. A Mansão única na Riviera tem datas disponíveis: {dates}. Por favor, confirme sua escolha. Cordialmente, Kleber Garcia Alcatrão."
    ],
    'en_booking': [
        "Hello! We confirm the spacious mansion in Riviera is available for {dates}. Please confirm your booking. Best regards, Kleber Garcia Alcatrão, Zion Tech Group.",
        "Dear guest, The unique 3-story mansion has availability on {dates}. We're ready to finalize your reservation. Looking forward to hearing from you. Best, Kleber.",
        "We've checked your inquiry. The one-of-a-kind mansion in Riviera has the following dates available: {dates}. Please confirm your preferred dates. Warm regards, Kleber."
    ]
}

def get_available_dates():
    """Get next 3 available business days"""
    today = datetime.now()
    dates = []
    for i in range(1, 10):
        d = today + timedelta(days=i)
        if d.weekday() < 5:  # Mon-Fri
            dates.append(d.strftime('%d/%m'))
        if len(dates) >= 3:
            break
    return ', '.join(dates)

def cmd_run(dry_run=False, limit=5):
    print("⚡ V31 Intelligent Template Engine")
    print("   Features: Smart Variables + Dynamic Content + No LLM Required")
    
    msgs = gmail_search('is:unread from:airbnb.com', limit=20)
    label_id = gmail_get_or_create_label_id(LABEL)
    
    stats = {'replied': 0, 'skipped': 0}
    
    for msg in msgs[:limit]:
        try:
            full = gmail_get(msg['id'])
            headers = {h['name']: h['value'] for h in full.get('payload', {}).get('headers', [])}
            sender = headers.get('From', '')
            subject = headers.get('Subject', '')
            
            name_part = sender.split('<')[0].strip().strip('"') if '<' in sender else sender
            
            # Detect language
            text = f"{subject}".lower()
            language = 'pt' if any(w in text for w in ['reserva', 'consulta', 'mansão']) else 'en'
            
            # Get dates
            dates = get_available_dates()
            
            # Select template
            template_key = f"{language}_booking"
            templates = TEMPLATES.get(template_key, TEMPLATES['pt_booking'])
            template = random.choice(templates)
            
            # Generate response
            reply = template.replace('{dates}', dates)
            
            print(f"⚡ {name_part[:25]} | Template: {language}")
            print(f"   ✅ {reply[:80]}...")
            
            if not dry_run:
                gmail_send_reply(msg['id'], reply)
                gmail_batch_modify({'ids': [msg['id']]}, addLabelIds=[label_id])
            
            stats['replied'] += 1
                
        except Exception as e:
            print(f"Error: {e}")
            stats['skipped'] += 1
            continue
    
    print(f"\n📊 Replied: {stats['replied']} | Skipped: {stats['skipped']}")

if __name__ == '__main__':
    import argparse
    p = argparse.ArgumentParser()
    p.add_argument('--execute', action='store_true')
    p.add_argument('--limit', type=int, default=5)
    args = p.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)