#!/usr/bin/env python3
"""
Integrated Auto-Responder V9 - Multi-Action with Smart Decisions
Each email gets a unique action plan based on content analysis
"""

import sys, json, re
from pathlib import Path
from datetime import datetime, timedelta

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, gmail_get, gmail_send_reply, gmail_batch_modify, gmail_get_or_create_label_id

MEMORY_FILE = WORKSPACE / 'zion.app' / 'data' / 'v9_memory.json'
LABEL_DONE = 'Autonomous-Replied-V9'

def load_json(path):
    if path.exists():
        return json.loads(path.read_text())
    return {'interactions': 0, 'senders': {}, 'decisions': []}

def save_json(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, indent=2))

def analyze_and_decide(sender, subject, snippet):
    """Full analysis → decision → action plan"""
    text = f"{subject} {snippet} {sender}".lower()
    
    # Decision matrix
    if any(x in sender.lower() for x in ['mailer-daemon', 'postmaster']):
        return {'action': 'archive', 'reason': 'bounce', 'priority': 1}
    
    if any(x in sender.lower() for x in ['github.com', 'zapier', 'notifications@']):
        return {'action': 'skip', 'reason': 'noise', 'priority': 10}
    
    if any(x in text for x in ['airbnb', 'reserva', 'booking', 'confirmado']):
        return {'action': 'reply', 'category': 'booking', 'priority': 2}
    
    if any(x in text for x in ['urgent', 'urgente', 'asap']):
        return {'action': 'reply', 'category': 'urgent', 'priority': 3}
    
    if any(x in text for x in ['quote', 'pricing', 'proposta', 'orçamento']):
        return {'action': 'reply', 'category': 'sales', 'priority': 4}
    
    return {'action': 'skip', 'reason': 'other', 'priority': 20}

def needs_reply_all(headers):
    cc = next((h['value'] for h in headers if h['name'].lower() == 'cc'), '')
    return len(cc.strip()) > 0 if cc else False

def generate_personalized_reply(category, subject, sender_history=None):
    """Generate context-aware reply"""
    dates = re.findall(r'\d{1,2}[-/]\d{1,2}', subject)
    date_ref = f" para o período mencionado ({dates[0]})" if dates else ""
    
    replies = {
        'booking': f"Prezado(a),\n\nRecebi sua solicitação de reserva{date_ref}. Estou verificando disponibilidade e retorno em até 24h com confirmação.\n\nAtenciosamente,\nKleber Garcia Alcatrão\nZion Tech Group",
        'urgent': "Prezado(a),\n\nRecebi sua mensagem urgente. Já estou analisando e retorno em breve.\n\nAtenciosamente,\nKleber Garcia Alcatrão\nZion Tech Group",
        'sales': "Prezado(a),\n\nAgradeço pelo interesse. Estou preparando uma proposta detalhada e retorno em até 2h.\n\nAtenciosamente,\nKleber Garcia Alcatrão\nZion Tech Group"
    }
    return replies.get(category, "Obrigado pela mensagem. Retornarei em breve.\n\nAtenciosamente,\nKleber Garcia Alcatrão")

def cmd_run(dry_run=False, limit=15):
    print("🤖 Integrated Auto-Responder V9 (Smart Decisions)")
    
    msgs = gmail_search('is:unread', limit=200)
    label_id = gmail_get_or_create_label_id(LABEL_DONE)
    memory = load_json(MEMORY_FILE)
    
    emails = []
    for msg in msgs:
        try:
            full = gmail_get(msg['id'])
            headers_raw = full.get('payload', {}).get('headers', [])
            headers = {h['name']: h['value'] for h in headers_raw}
            sender = headers.get('From', '')
            subject = headers.get('Subject', '')
            snippet = full.get('snippet', '')
            
            decision = analyze_and_decide(sender, subject, snippet)
            decision['reply_all'] = needs_reply_all(headers_raw)
            decision['email_id'] = msg['id']
            decision['sender'] = sender
            decision['subject'] = subject
            emails.append(decision)
        except: pass
    
    emails.sort(key=lambda x: x['priority'])
    stats = {'replied': 0, 'archived': 0, 'skipped': 0}
    
    for e in emails[:limit]:
        if e['action'] == 'skip':
            stats['skipped'] += 1
            continue
            
        if e['action'] == 'archive':
            stats['archived'] += 1
            print(f"📧 {e['sender'][:30]} | 🗑️ Archived")
            if not dry_run:
                gmail_batch_modify({'ids': [e['email_id']]}, removeLabelIds=['INBOX'])
            continue
            
        if e['action'] == 'reply':
            reply = generate_personalized_reply(e['category'], e['subject'])
            stats['replied'] += 1
            
            print(f"📧 {e['sender'][:30]} | {e['category']}{' 🔄 Reply-All' if e['reply_all'] else ''}")
            
            if not dry_run:
                gmail_send_reply(e['email_id'], reply)
                gmail_batch_modify({'ids': [e['email_id']]}, addLabelIds=[label_id])
                memory['interactions'] += 1
                print(f"   ✅ Replied ({len(reply)} chars)")
    
    save_json(MEMORY_FILE, memory)
    print(f"\n📊 Replied: {stats['replied']} | Archived: {stats['archived']} | Skipped: {stats['skipped']}")

if __name__ == '__main__':
    import argparse
    p = argparse.ArgumentParser()
    p.add_argument('--execute', action='store_true')
    p.add_argument('--limit', type=int, default=15)
    args = p.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)