#!/usr/bin/env python3
"""
Smart Auto-Responder V7 - Context-Aware with Multi-Action
"""

import sys, json
from pathlib import Path
WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, gmail_get, gmail_send_reply, gmail_batch_modify, gmail_get_or_create_label_id

LABEL_PROCESSED = 'Autonomous-Replied-V7'
LABEL_ARCHIVED = 'Autonomous/Archived'

def needs_reply_all(headers):
    cc = next((h['value'] for h in headers if h['name'].lower() == 'cc'), '')
    return len(cc.strip()) > 0 if cc else False

def analyze_email(sender, subject, snippet):
    text = f"{subject} {snippet} {sender}".lower()
    sender_lower = sender.lower()
    
    if any(x in sender_lower for x in ['mailer-daemon', 'postmaster']):
        return {"action": "archive", "category": "bounce", "priority": 1}
    
    if any(x in sender_lower for x in ['github.com', 'notifications@github.com', 'zapier']):
        return {"action": "skip", "category": "noise", "priority": 10}
    
    if any(x in text for x in ['airbnb', 'reserva', 'booking', 'confirmation']):
        return {"action": "reply", "category": "booking", "priority": 2}
    
    if any(x in text for x in ['urgent', 'urgente', 'asap']):
        return {"action": "reply", "category": "urgent", "priority": 3}
    
    return {"action": "skip", "category": "other", "priority": 20}

def generate_smart_reply(category, subject):
    # Extract dates from subject if possible
    import re
    dates = re.findall(r'\d{1,2}[-/]\d{1,2}', subject)
    
    if category == 'booking':
        reply = "Prezado(a),\n\nRecebi sua solicitação de reserva"
        if dates:
            reply += f" para o período mencionado"
        reply += ". Estou analisando e retorno em breve com confirmação.\n\nAtenciosamente,\nKleber Garcia Alcatrão\nZion Tech Group"
        return reply
    
    return "Obrigado pela sua mensagem. Retornarei em breve.\n\nAtenciosamente,\nKleber Garcia Alcatrão"

def cmd_run(dry_run=False, limit=10):
    print("🤖 Smart Auto-Responder V7 (Context-Aware)")
    
    msgs = gmail_search('is:unread', limit=200)
    label_id = gmail_get_or_create_label_id(LABEL_PROCESSED)
    archived_label = gmail_get_or_create_label_id(LABEL_ARCHIVED)
    
    stats = {'replied': 0, 'archived': 0, 'skipped': 0, 'reply_all': 0}
    emails = []
    
    for msg in msgs:
        try:
            full = gmail_get(msg['id'])
            headers_raw = full.get('payload', {}).get('headers', [])
            headers = {h['name']: h['value'] for h in headers_raw}
            sender, subject, snippet = headers.get('From', ''), headers.get('Subject', ''), full.get('snippet', '')
            analysis = analyze_email(sender, subject, snippet)
            reply_all = needs_reply_all(headers_raw)
            emails.append({'id': msg['id'], 'sender': sender, 'subject': subject, 
                        'analysis': analysis, 'reply_all': reply_all})
        except: pass
    
    emails.sort(key=lambda x: x['analysis']['priority'])
    print(f"\n📧 Processing {min(len(emails), limit)} emails...")
    
    for e in emails[:limit]:
        a = e['analysis']
        
        if a['action'] == 'skip':
            stats['skipped'] += 1
            continue
            
        if a['action'] == 'archive':
            stats['archived'] += 1
            if not dry_run:
                gmail_batch_modify({'ids': [e['id']]}, removeLabelIds=['INBOX'], addLabelIds=[archived_label])
            print(f"📧 {e['sender'][:30]} | {a['category']} ✅ Archived")
            continue
            
        if a['action'] == 'reply':
            reply = generate_smart_reply(a['category'], e['subject'])
            stats['replied'] += 1
            if e['reply_all']: stats['reply_all'] += 1
            
            print(f"📧 {e['sender'][:30]} | {a['category']}{' 🔄 Reply-All' if e['reply_all'] else ''}")
            if not dry_run:
                gmail_send_reply(e['id'], reply)
                gmail_batch_modify({'ids': [e['id']]}, addLabelIds=[label_id])
                print(f"   ✅ Replied ({len(reply)} chars)")
    
    print(f"\n📊 Replied: {stats['replied']} | Reply-All: {stats['reply_all']} | Archived: {stats['archived']}")

if __name__ == '__main__':
    import argparse
    p = argparse.ArgumentParser()
    p.add_argument('--execute', action='store_true')
    p.add_argument('--limit', type=int, default=10)
    args = p.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)