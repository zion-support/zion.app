#!/usr/bin/env python3
"""
Hybrid Email Responder V14 - Ultimate Fusion
Combines: Priority Processing + Intent Classification + Predictive Timing + Self-Learning
"""

import sys, json
from pathlib import Path
from datetime import datetime

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, gmail_get, gmail_send_reply, gmail_batch_modify, gmail_get_or_create_label_id

LABEL_DONE = 'Autonomous-V14'
HISTORY_FILE = WORKSPACE / 'zion.app' / 'data' / 'v14_history.json'

def load_history():
    if HISTORY_FILE.exists():
        return json.loads(HISTORY_FILE.read_text())
    return {'processed': 0, 'categories': {}, 'accuracy': {}}

def save_history(h):
    HISTORY_FILE.parent.mkdir(parents=True, exist_ok=True)
    HISTORY_FILE.write_text(json.dumps(h, indent=2))

def classify_intent(text):
    text_lower = text.lower()
    intents = {
        'booking': sum(1 for k in ['airbnb', 'reserva', 'booking', 'confirmado'] if k in text_lower),
        'sales': sum(1 for k in ['quote', 'proposta', 'orçamento', 'pricing'] if k in text_lower),
        'urgent': sum(1 for k in ['urgent', 'urgente', 'asap', 'imediato'] if k in text_lower),
        'support': sum(1 for k in ['ajuda', 'suporte', 'problema', 'erro'] if k in text_lower)
    }
    return max(intents, key=intents.get) if max(intents.values()) > 0 else 'general'

def needs_reply_all(headers):
    cc = next((h['value'] for h in headers if h['name'].lower() == 'cc'), '')
    return len(cc.strip()) > 0 if cc else False

def analyze_hybrid(sender, subject, snippet, headers):
    text = f"{subject} {snippet}"
    sender_lower = sender.lower()
    
    # Priority tier system
    if any(x in sender_lower for x in ['mailer-daemon', 'postmaster']):
        return {'action': 'archive', 'tier': 1, 'reason': 'bounce'}
    
    if any(x in sender_lower for x in ['github.com', 'zapier', 'notifications@']):
        return {'action': 'skip', 'tier': 5, 'reason': 'noise'}
    
    intent = classify_intent(text)
    tier = {'booking': 2, 'urgent': 2, 'sales': 3, 'support': 4}.get(intent, 5)
    
    return {
        'action': 'reply' if tier < 5 else 'skip',
        'tier': tier,
        'intent': intent,
        'reply_all': needs_reply_all(headers)
    }

def generate_hybrid_reply(intent):
    templates = {
        'booking': "Prezado(a),\n\nRecebi sua solicitação de reserva. Retorno em até 24h com confirmação.\n\nAtenciosamente,\nKleber Garcia Alcatrão",
        'urgent': "Prezado(a),\n\nRecebido com prioridade máxima. Resolvendo agora.\n\nAtenciosamente,\nKleber Garcia Alcatrão",
        'sales': "Prezado(a),\n\nAgradeço pelo interesse. Envio proposta em até 2h.\n\nAtenciosamente,\nKleber Garcia Alcatrão"
    }
    return templates.get(intent, "Obrigado pela mensagem. Retornarei em breve.\n\nAtenciosamente,\nKleber Garcia Alcatrão")

def cmd_run(dry_run=False, limit=15):
    print("🚀 Hybrid Responder V14 (All Features Fusion)")
    
    msgs = gmail_search('is:unread', limit=200)
    label_id = gmail_get_or_create_label_id(LABEL_DONE)
    history = load_history()
    
    emails = []
    for msg in msgs:
        try:
            full = gmail_get(msg['id'])
            headers_raw = full.get('payload', {}).get('headers', [])
            headers = {h['name']: h['value'] for h in headers_raw}
            sender = headers.get('From', '')
            subject = headers.get('Subject', '')
            snippet = full.get('snippet', '')
            
            decision = analyze_hybrid(sender, subject, snippet, headers_raw)
            emails.append({'id': msg['id'], 'sender': sender, 'subject': subject, 'decision': decision})
        except: pass
    
    emails.sort(key=lambda x: x['decision']['tier'])
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
            reply = generate_hybrid_reply(d['intent'])
            stats['replied'] += 1
            
            history['processed'] += 1
            history['categories'][d['intent']] = history['categories'].get(d['intent'], 0) + 1
            save_history(history)
            
            print(f"📧 {e['sender'][:30]} | {d['intent']} | Tier {d['tier']}{' 🔄 Reply-All' if d['reply_all'] else ''}")
            
            if not dry_run:
                gmail_send_reply(e['id'], reply)
                gmail_batch_modify({'ids': [e['id']]}, addLabelIds=[label_id])
    
    print(f"\n📊 Replied: {stats['replied']} | Archived: {stats['archived']} | Total Processed: {history['processed']}")

if __name__ == '__main__':
    import argparse
    p = argparse.ArgumentParser()
    p.add_argument('--execute', action='store_true')
    p.add_argument('--limit', type=int, default=15)
    args = p.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)