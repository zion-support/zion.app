#!/usr/bin/env python3
"""
Enhanced Auto-Responder V8 - Full Integration with Memory & Follow-Up
"""

import sys, json, re
from pathlib import Path
from datetime import datetime, timedelta

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, gmail_get, gmail_send_reply, gmail_batch_modify, gmail_get_or_create_label_id

# Files
MEMORY_FILE = WORKSPACE / 'zion.app' / 'data' / 'conversation_memory.json'
FOLLOWUP_FILE = WORKSPACE / 'zion.app' / 'data' / 'follow_ups.json'
LABEL_PROCESSED = 'Autonomous-Replied-V8'

def load_json(path):
    if path.exists():
        return json.loads(path.read_text())
    return {}

def save_json(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, indent=2))

def update_sender_memory(sender, category):
    memory = load_json(MEMORY_FILE)
    domain = sender.split('@')[-1] if '@' in sender else sender
    
    if 'senders' not in memory:
        memory['senders'] = {}
    
    if domain not in memory['senders']:
        memory['senders'][domain] = {'count': 0, 'categories': {}, 'last': None}
    
    memory['senders'][domain]['count'] += 1
    memory['senders'][domain]['categories'][category] = memory['senders'][domain]['categories'].get(category, 0) + 1
    memory['senders'][domain]['last'] = datetime.now().isoformat()
    
    save_json(MEMORY_FILE, memory)

def schedule_followup(msg_id, hours=48):
    followups = load_json(FOLLOWUP_FILE)
    followups.append({
        'msg_id': msg_id,
        'due': (datetime.now() + timedelta(hours=hours)).isoformat(),
        'status': 'pending'
    })
    save_json(FOLLOWUP_FILE, followups)

def needs_reply_all(headers):
    cc = next((h['value'] for h in headers if h['name'].lower() == 'cc'), '')
    return len(cc.strip()) > 0 if cc else False

def analyze_email(sender, subject, snippet):
    text = f"{subject} {snippet} {sender}".lower()
    sender_lower = sender.lower()
    
    if any(x in sender_lower for x in ['mailer-daemon', 'postmaster']):
        return {"action": "archive", "category": "bounce", "priority": 1}
    
    if any(x in sender_lower for x in ['github.com', 'zapier']):
        return {"action": "skip", "category": "noise", "priority": 10}
    
    if any(x in text for x in ['airbnb', 'reserva', 'booking']):
        return {"action": "reply", "category": "booking", "priority": 2}
    
    if any(x in text for x in ['urgent', 'urgente']):
        return {"action": "reply", "category": "urgent", "priority": 3}
    
    return {"action": "skip", "category": "other", "priority": 20}

def generate_reply(category, subject):
    dates = re.findall(r'\d{1,2}[-/]\d{1,2}', subject)
    date_str = f" para {dates[0]}" if dates else ""
    
    if category == 'booking':
        return f"Prezado(a),\n\nObrigado pela sua reserva{date_str}. Estou analisando e retorno em breve.\n\nAtenciosamente,\nKleber Garcia Alcatrão\nZion Tech Group"
    
    return "Obrigado pela mensagem. Retornarei em breve.\n\nAtenciosamente,\nKleber Garcia Alcatrão"

def cmd_run(dry_run=False, limit=10):
    print("🤖 Enhanced Auto-Responder V8 (Memory + Follow-Up)")
    
    msgs = gmail_search('is:unread', limit=200)
    label_id = gmail_get_or_create_label_id(LABEL_PROCESSED)
    
    emails = []
    for msg in msgs:
        try:
            full = gmail_get(msg['id'])
            headers_raw = full.get('payload', {}).get('headers', [])
            headers = {h['name']: h['value'] for h in headers_raw}
            sender = headers.get('From', '')
            subject = headers.get('Subject', '')
            snippet = full.get('snippet', '')
            analysis = analyze_email(sender, subject, snippet)
            reply_all = needs_reply_all(headers_raw)
            emails.append({'id': msg['id'], 'sender': sender, 'subject': subject, 
                          'analysis': analysis, 'reply_all': reply_all})
        except: pass
    
    emails.sort(key=lambda x: x['analysis']['priority'])
    print(f"\n📧 Processing {min(len(emails), limit)} emails...")
    
    stats = {'replied': 0, 'archived': 0, 'skipped': 0}
    
    for e in emails[:limit]:
        a = e['analysis']
        
        if a['action'] == 'skip':
            stats['skipped'] += 1
            continue
            
        if a['action'] == 'archive':
            stats['archived'] += 1
            print(f"📧 {e['sender'][:30]} | {a['category']} ✅ Archived")
            if not dry_run:
                gmail_batch_modify({'ids': [e['id']]}, removeLabelIds=['INBOX'])
            continue
            
        if a['action'] == 'reply':
            reply = generate_reply(a['category'], e['subject'])
            stats['replied'] += 1
            
            # Update memory
            update_sender_memory(e['sender'], a['category'])
            # Schedule follow-up
            schedule_followup(e['id'], 48)
            
            print(f"📧 {e['sender'][:30]} | {a['category']}{' 🔄 Reply-All' if e['reply_all'] else ''}")
            if not dry_run:
                gmail_send_reply(e['id'], reply)
                gmail_batch_modify({'ids': [e['id']]}, addLabelIds=[label_id])
                print(f"   ✅ Replied + Follow-up scheduled")
    
    print(f"\n📊 Replied: {stats['replied']} | Archived: {stats['archived']} | Skipped: {stats['skipped']}")

if __name__ == '__main__':
    import argparse
    p = argparse.ArgumentParser()
    p.add_argument('--execute', action='store_true')
    p.add_argument('--limit', type=int, default=10)
    args = p.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)