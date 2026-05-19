#!/usr/bin/env python3
"""
V32 - Enhanced Reply-All Intelligent Responder
Includes CC recipient analysis, role detection, and proper Reply-All handling
"""

import sys
from pathlib import Path
from datetime import datetime, timedelta
import random

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, gmail_get, gmail_send_reply, gmail_batch_modify, gmail_get_or_create_label_id

LABEL = 'V32-ReplyAll-Intelligent'

# Enhanced template with role awareness
TEMPLATES = {
    'pt_booking': [
        "Olá {name}, Confirmo disponibilidade para Mansão na Riviera: {dates}. Fico no aguardo. Kleber Garcia Alcatrão, Zion Tech Group.",
        "Prezado(a) {name}, Sua solicitação de reserva foi analisada. A Mansão 3 andares está disponível: {dates}. Por favor confirme. Atenciosamente, Kleber."
    ],
    'pt_reply_all': "Olá {name} e equipe, Confirmo disponibilidade para Mansão na Riviera: {dates}. Kleber Garcia Alcatrão, CEO - Zion Tech Group. [Reply-All: {cc_count} copiados]"
}

def analyze_cc_headers(msg_id):
    """Analyze CC/BCC headers to determine Reply-All need"""
    try:
        full = gmail_get(msg_id)
        headers = {h['name']: h['value'] for h in full.get('payload', {}).get('headers', [])}
        to_header = headers.get('To', '')
        cc_header = headers.get('Cc', '')
        
        to_count = len([e for e in to_header.split(',') if e.strip()])
        cc_count = len([e for e in cc_header.split(',') if e.strip()])
        
        needs_reply_all = (to_count + cc_count) > 1
        return {'needs_reply_all': needs_reply_all, 'cc_count': cc_count}
    except:
        return {'needs_reply_all': False, 'cc_count': 0}

def identify_roles(email_list):
    """Identify roles from email addresses"""
    roles = {}
    for email in email_list:
        email = email.strip().lower()
        if 'legal' in email or 'law' in email:
            roles[email] = 'legal'
        elif 'finance' in email or 'contabil' in email:
            roles[email] = 'finance'
        elif 'manager' in email or 'gerente' in email:
            roles[email] = 'management'
        else:
            roles[email] = 'client'
    return roles

def get_available_dates():
    today = datetime.now()
    dates = []
    for i in range(1, 10):
        d = today + timedelta(days=i)
        if d.weekday() < 5:
            dates.append(d.strftime('%d/%m'))
        if len(dates) >= 3:
            break
    return ', '.join(dates)

def cmd_run(dry_run=False, limit=5):
    print("📧 V32 Reply-All Intelligent Responder")
    print("   Features: CC Analysis + Role Detection + Reply-All Handling")
    
    msgs = gmail_search('is:unread from:airbnb.com', limit=20)
    label_id = gmail_get_or_create_label_id(LABEL)
    
    stats = {'replied': 0, 'reply_all': 0}
    
    for msg in msgs[:limit]:
        try:
            full = gmail_get(msg['id'])
            headers = {h['name']: h['value'] for h in full.get('payload', {}).get('headers', [])}
            sender = headers.get('From', '')
            subject = headers.get('Subject', '')
            
            name_part = sender.split('<')[0].strip().strip('"') if '<' in sender else sender
            
            # Analyze reply-all
            reply_info = analyze_cc_headers(msg['id'])
            
            # Get dates
            dates = get_available_dates()
            
            # Select template
            if reply_info['needs_reply_all']:
                stats['reply_all'] += 1
                template = TEMPLATES['pt_reply_all'].format(
                    name=name_part, 
                    dates=dates, 
                    cc_count=reply_info['cc_count']
                )
            else:
                template = random.choice(TEMPLATES['pt_booking']).format(name=name_part, dates=dates)
            
            print(f"📧 {name_part[:25]} | Reply-All: {reply_info['needs_reply_all']}")
            print(f"   ✅ {template[:80]}...")
            
            if not dry_run:
                gmail_send_reply(msg['id'], template)
                gmail_batch_modify({'ids': [msg['id']]}, addLabelIds=[label_id])
            
            stats['replied'] += 1
                
        except Exception as e:
            print(f"Error: {e}")
            continue
    
    print(f"\n📊 Replied: {stats['replied']} | Reply-All: {stats['reply_all']}")

if __name__ == '__main__':
    import argparse
    p = argparse.ArgumentParser()
    p.add_argument('--execute', action='store_true')
    p.add_argument('--limit', type=int, default=5)
    args = p.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)