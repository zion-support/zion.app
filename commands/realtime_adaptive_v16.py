#!/usr/bin/env python3
"""
Real-Time Adaptive Responder V16
Learns instantly from each email interaction and adapts responses
"""

import sys, json
from pathlib import Path
from datetime import datetime

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, gmail_get, gmail_send_reply, gmail_batch_modify, gmail_get_or_create_label_id

LABEL_DONE = 'Autonomous-V16'
LEARNING_FILE = WORKSPACE / 'zion.app' / 'data' / 'realtime_learning.json'

def load_learning():
    if LEARNING_FILE.exists():
        return json.loads(LEARNING_FILE.read_text())
    return {'interactions': {}, 'patterns': {}, 'success_count': 0, 'total_count': 0}

def save_learning(data):
    LEARNING_FILE.parent.mkdir(parents=True, exist_ok=True)
    LEARNING_FILE.write_text(json.dumps(data, indent=2))

def needs_reply_all(headers):
    cc = next((h['value'] for h in headers if h['name'].lower() == 'cc'), '')
    return len(cc.strip()) > 0 if cc else False

def extract_features(sender, subject, snippet):
    text = f"{subject} {snippet}".lower()
    return {
        'sender_domain': sender.split('@')[-1] if '@' in sender else sender,
        'has_airbnb': 'airbnb' in text,
        'has_reserva': 'reserva' in text,
        'has_urgent': any(x in text for x in ['urgent', 'urgente', 'asap']),
        'has_quote': any(x in text for x in ['quote', 'proposta', 'orçamento']),
        'hour': datetime.now().hour,
        'is_business_hours': 9 <= datetime.now().hour <= 17
    }

def decide_with_learning(features, learning):
    domain = features['sender_domain']
    sender_history = learning['interactions'].get(domain, {})
    
    if features['has_airbnb'] or features['has_reserva']:
        return {'action': 'reply', 'category': 'booking', 'reason': 'airbnb_pattern'}
    if features['has_urgent']:
        return {'action': 'reply', 'category': 'urgent', 'reason': 'urgent_detected'}
    if features['has_quote']:
        return {'action': 'reply', 'category': 'sales', 'reason': 'sales_inquiry'}
    if domain in learning['interactions'] and sender_history.get('last_category'):
        return {'action': 'reply', 'category': sender_history['last_category'], 'reason': 'learned_pattern'}
    return {'action': 'skip', 'reason': 'no_match'}

def generate_reply(category):
    return {
        'booking': "Prezado(a),\n\nRecebi sua solicitação. Retorno em até 24h com confirmação.\n\nAtenciosamente,\nKleber Garcia Alcatrão",
        'urgent': "Prezado(a),\n\nRecebido com prioridade. Trabalhando agora.\n\nAtenciosamente,\nKleber Garcia Alcatrão",
        'sales': "Prezado(a),\n\nAgradeço pelo interesse. Envio proposta em até 2h.\n\nAtenciosamente,\nKleber Garcia Alcatrão"
    }.get(category, "Obrigado pela mensagem. Retornarei.\n\nAtenciosamente,\nKleber Garcia Alcatrão")

def cmd_run(dry_run=False, limit=15):
    print("⚡ Real-Time Adaptive Responder V16")
    msgs = gmail_search('is:unread', limit=200)
    label_id = gmail_get_or_create_label_id(LABEL_DONE)
    learning = load_learning()
    
    emails = []
    for msg in msgs:
        try:
            full = gmail_get(msg['id'])
            headers_raw = full.get('payload', {}).get('headers', [])
            headers = {h['name']: h['value'] for h in headers_raw}
            sender, subject, snippet = headers.get('From', ''), headers.get('Subject', ''), full.get('snippet', '')
            features = extract_features(sender, subject, snippet)
            decision = decide_with_learning(features, learning)
            decision['reply_all'] = needs_reply_all(headers_raw)
            emails.append({'id': msg['id'], 'sender': sender, 'subject': subject, 'decision': decision, 'features': features})
        except: pass
    
    priority = {'reply': 1, 'archive': 2, 'skip': 3}
    emails.sort(key=lambda x: priority.get(x['decision']['action'], 5))
    stats = {'replied': 0, 'archived': 0, 'skipped': 0}
    
    for e in emails[:limit]:
        d = e['decision']
        if d['action'] == 'skip':
            stats['skipped'] += 1
            continue
        if d['action'] == 'archive':
            stats['archived'] += 1
            print(f"📧 {e['sender'][:30]} | 🗑️ {d['reason']}")
            if not dry_run:
                gmail_batch_modify({'ids': [e['id']]}, removeLabelIds=['INBOX'])
            continue
        if d['action'] == 'reply':
            reply = generate_reply(d.get('category', 'booking'))
            stats['replied'] += 1
            print(f"📧 {e['sender'][:30]} | {d.get('category', 'reply')} | {d['reason']}{' 🔄 Reply-All' if d['reply_all'] else ''}")
            if not dry_run:
                gmail_send_reply(e['id'], reply)
                gmail_batch_modify({'ids': [e['id']]}, addLabelIds=[label_id])
                # Update learning
                domain = e['features']['sender_domain']
                learning['interactions'][domain] = learning['interactions'].get(domain, {})
                learning['interactions'][domain]['last_category'] = d.get('category', 'booking')
                learning['total_count'] += 1
                save_learning(learning)
    
    print(f"\n📊 Replied: {stats['replied']} | Archived: {stats['archived']} | Learned: {learning['total_count']}")

if __name__ == '__main__':
    import argparse
    p = argparse.ArgumentParser()
    p.add_argument('--execute', action='store_true')
    p.add_argument('--limit', type=int, default=15)
    args = p.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)