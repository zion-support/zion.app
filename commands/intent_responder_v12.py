#!/usr/bin/env python3
"""
Intent-Based Email Responder V12
Uses semantic classification for smarter email categorization
"""

import sys
from pathlib import Path
from datetime import datetime

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, gmail_get, gmail_send_reply, gmail_batch_modify, gmail_get_or_create_label_id

LABEL_DONE = 'Autonomous-V12'

# Intent classification keywords
INTENT_KEYWORDS = {
    'booking': ['airbnb', 'reserva', 'booking', 'reserve', 'disponível', 'disponibilidade', 'confirmado'],
    'sales': ['quote', 'proposta', 'orçamento', 'pricing', 'preço', 'valor', 'comercial'],
    'support': ['ajuda', 'suporte', 'problema', 'erro', 'bug', 'support', 'help'],
    'urgent': ['urgente', 'urgent', 'asap', 'imediato', 'crítico', 'critical'],
    'partnership': ['parceria', 'partnership', 'collaboration', 'colaboração'],
    'complaint': ['reclamação', 'complaint', 'queixa', 'problema', 'insatisfeito']
}

def classify_intent(text):
    """Classify email intent based on content analysis"""
    text_lower = text.lower()
    scores = {}
    
    for intent, keywords in INTENT_KEYWORDS.items():
        scores[intent] = sum(1 for kw in keywords if kw in text_lower)
    
    if not scores or max(scores.values()) == 0:
        return 'general', 0
    
    best_intent = max(scores, key=scores.get)
    confidence = scores[best_intent]
    return best_intent, confidence

def needs_reply_all(headers):
    cc = next((h['value'] for h in headers if h['name'].lower() == 'cc'), '')
    return len(cc.strip()) > 0 if cc else False

def analyze_email_v12(sender, subject, snippet):
    text = f"{subject} {snippet} {sender}"
    intent, confidence = classify_intent(text)
    
    sender_lower = sender.lower()
    
    if any(x in sender_lower for x in ['mailer-daemon', 'postmaster']):
        return {'action': 'archive', 'intent': 'bounce', 'confidence': 100, 'priority': 1}
    
    if any(x in sender_lower for x in ['github.com', 'zapier', 'notifications@']):
        return {'action': 'skip', 'intent': 'noise', 'confidence': 100, 'priority': 10}
    
    if intent == 'booking':
        return {'action': 'reply', 'intent': intent, 'confidence': confidence, 'priority': 2}
    
    if intent == 'sales':
        return {'action': 'reply', 'intent': intent, 'confidence': confidence, 'priority': 3}
    
    if intent == 'urgent':
        return {'action': 'reply', 'intent': intent, 'confidence': confidence, 'priority': 4}
    
    return {'action': 'skip', 'intent': 'general', 'confidence': 0, 'priority': 20}

def get_intent_reply(intent, confidence):
    """Generate reply based on detected intent"""
    replies = {
        'booking': "Prezado(a),\n\nRecebi sua solicitação de reserva. Verificarei disponibilidade e retorno em até 24h.\n\nAtenciosamente,\nKleber Garcia Alcatrão\nZion Tech Group",
        'sales': "Prezado(a),\n\nAgradeço pelo interesse comercial. Preparo uma proposta detalhada e envio em até 2h.\n\nAtenciosamente,\nKleber Garcia Alcatrão\nZion Tech Group",
        'support': "Prezado(a),\n\nRecebemos sua solicitação de suporte. Já estamos analisando e retorno em breve.\n\nAtenciosamente,\nKleber Garcia Alcatrão\nZion Tech Group",
        'urgent': "Prezado(a),\n\nRecebido com prioridade máxima. Estou trabalhando na solução agora.\n\nAtenciosamente,\nKleber Garcia Alcatrão\nZion Tech Group"
    }
    return replies.get(intent, "Obrigado pela mensagem. Retornarei em breve.\n\nAtenciosamente,\nKleber Garcia Alcatrão")

def cmd_run(dry_run=False, limit=10):
    print("🤖 Intent-Based Responder V12 (Semantic Classification)")
    
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
            
            decision = analyze_email_v12(sender, subject, snippet)
            decision['reply_all'] = needs_reply_all(headers_raw)
            emails.append({'id': msg['id'], 'sender': sender, 'subject': subject, 'decision': decision})
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
            print(f"📧 {e['sender'][:30]} | 🗑️ bounce")
            if not dry_run:
                gmail_batch_modify({'ids': [e['id']]}, removeLabelIds=['INBOX'])
            continue
            
        if d['action'] == 'reply':
            reply = get_intent_reply(d['intent'], d['confidence'])
            stats['replied'] += 1
            
            print(f"📧 {e['sender'][:30]} | {d['intent']} ({d['confidence']}% confidence){' 🔄 Reply-All' if d['reply_all'] else ''}")
            
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