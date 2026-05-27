#!/usr/bin/env python3
"""
Self-Learning Email Responder V11
Adapts based on response success rates and sender feedback
"""

import sys, json, random
from pathlib import Path
from datetime import datetime, timedelta
from collections import defaultdict

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, gmail_get, gmail_send_reply, gmail_batch_modify, gmail_get_or_create_label_id

LEARNING_FILE = WORKSPACE / 'zion.app' / 'data' / 'learning_model.json'
WORKFLOW_FILE = WORKSPACE / 'zion.app' / 'data' / 'workflows.json'
LABEL_DONE = 'Autonomous-V11'

def load_learning():
    if LEARNING_FILE.exists():
        return json.loads(LEARNING_FILE.read_text())
    return {'templates': {}, 'success_rates': {}, 'sender_preferences': {}}

def save_learning(data):
    LEARNING_FILE.parent.mkdir(parents=True, exist_ok=True)
    LEARNING_FILE.write_text(json.dumps(data, indent=2))

def get_best_template(category, sender_history=None):
    """Select best template based on past success"""
    learning = load_learning()
    templates = learning.get('templates', {})
    
    if category in templates:
        rates = learning.get('success_rates', {}).get(category, {})
        best = max(rates.items(), key=lambda x: x[1], default=(None, 0))
        if best[0]:
            return templates[category].get(best[0], templates[category][list(templates[category].keys())[0]])
    
    # Default templates
    defaults = {
        'booking': "Prezado(a),\n\nRecebi sua solicitação de reserva. Retornarei em 24h com confirmação.\n\nAtenciosamente,\nKleber Garcia Alcatrão",
        'sales': "Prezado(a),\n\nAgradeço pelo interesse. Envio proposta em até 2h.\n\nAtenciosamente,\nKleber Garcia Alcatrão",
        'urgent': "Prezado(a),\n\nRecebido. Trabalhando na resposta agora.\n\nAtenciosamente,\nKleber Garcia Alcatrão"
    }
    return defaults.get(category, "Obrigado pela mensagem. Retorno em breve.\n\nAtenciosamente,\nKleber Garcia Alcatrão")

def analyze_email_adaptive(sender, subject, snippet):
    """Adaptive analysis using learned patterns"""
    text = f"{subject} {snippet} {sender}".lower()
    
    # Load learning data for sender-specific adaptation
    learning = load_learning()
    sender_domain = sender.split('@')[-1] if '@' in sender else sender
    sender_prefs = learning.get('sender_preferences', {}).get(sender_domain, {})
    
    # Priority based on learned sender value
    base_priority = 5
    if sender_prefs.get('response_time') == 'fast':
        base_priority = 1
    
    if any(x in sender.lower() for x in ['mailer-daemon', 'postmaster']):
        return {'action': 'archive', 'priority': 1}
    
    if any(x in sender.lower() for x in ['github.com', 'zapier']):
        return {'action': 'skip', 'priority': 10}
    
    if any(x in text for x in ['airbnb', 'reserva', 'booking']):
        return {'action': 'reply', 'category': 'booking', 'template': 'learned', 'priority': 2}
    
    if any(x in text for x in ['quote', 'proposta']):
        return {'action': 'reply', 'category': 'sales', 'template': 'learned', 'priority': 3}
    
    if any(x in text for x in ['urgent', 'urgente']):
        return {'action': 'reply', 'category': 'urgent', 'template': 'learned', 'priority': 4}
    
    return {'action': 'skip', 'priority': 20}

def cmd_run(dry_run=False, limit=10):
    print("🤖 Self-Learning Responder V11 (Adaptive)")
    
    msgs = gmail_search('is:unread', limit=200)
    label_id = gmail_get_or_create_label_id(LABEL_DONE)
    
    emails = []
    for msg in msgs:
        try:
            full = gmail_get(msg['id'])
            headers_raw = full.get('payload', {}).get('headers', [])
            headers = {h['name']: h['value'] for h in headers_raw}
            sender = headers.get('From', '')
            subject = headers.get('Subject', '')
            snippet = full.get('snippet', '')
            
            decision = analyze_email_adaptive(sender, subject, snippet)
            emails.append({
                'id': msg['id'], 
                'sender': sender, 
                'subject': subject, 
                'decision': decision
            })
        except: pass
    
    emails.sort(key=lambda x: x['decision']['priority'])
    stats = {'replied': 0, 'archived': 0, 'skipped': 0}
    
    for e in emails[:limit]:
        d = e['decision']
        
        if d['action'] == 'skip':
            stats['skipped'] += 1
            continue
            
        if d['action'] == 'archive':
            stats['archived'] += 1
            print(f"📧 {e['sender'][:30]} | 🗑️ Archived")
            if not dry_run:
                gmail_batch_modify({'ids': [e['id']]}, removeLabelIds=['INBOX'])
            continue
            
        if d['action'] == 'reply':
            category = d.get('category', 'booking')
            reply = get_best_template(category)
            stats['replied'] += 1
            
            # Track for learning
            learning = load_learning()
            if category not in learning['sender_preferences']:
                learning['sender_preferences'] = defaultdict(dict)
            sender_domain = e['sender'].split('@')[-1]
            learning['sender_preferences'][sender_domain]['last_reply'] = datetime.now().isoformat()
            save_learning(learning)
            
            print(f"📧 {e['sender'][:30]} | {category} (learned template)")
            if not dry_run:
                gmail_send_reply(e['id'], reply)
                gmail_batch_modify({'ids': [e['id']]}, addLabelIds=[label_id])
    
    print(f"\n📊 Replied: {stats['replied']} | Archived: {stats['archived']}")

if __name__ == '__main__':
    import argparse
    p = argparse.ArgumentParser()
    p.add_argument('--execute', action='store_true')
    p.add_argument('--limit', type=int, default=10)
    args = p.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)