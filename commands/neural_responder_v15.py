#!/usr/bin/env python3
"""
Neural-Inspired Email Responder V15
Uses attention-weighted analysis for smarter email processing
"""

import sys, json
from pathlib import Path
from datetime import datetime
from collections import Counter

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, gmail_get, gmail_send_reply, gmail_batch_modify, gmail_get_or_create_label_id

LABEL_DONE = 'Autonomous-V15'
ATTENTION_FILE = WORKSPACE / 'zion.app' / 'data' / 'attention_weights.json'

# Attention weights for different features (learned importance)
DEFAULT_WEIGHTS = {
    'sender_bounce': 0.95,
    'sender_github': 0.90,
    'keyword_airbnb': 0.85,
    'keyword_reserva': 0.80,
    'keyword_urgent': 0.88,
    'keyword_quote': 0.75,
    'cc_present': 0.70,
    'time_business_hours': 0.65,
    'language_pt': 0.60
}

def load_attention_weights():
    if ATTENTION_FILE.exists():
        return json.loads(ATTENTION_FILE.read_text())
    return DEFAULT_WEIGHTS

def save_attention_weights(weights):
    ATTENTION_FILE.parent.mkdir(parents=True, exist_ok=True)
    ATTENTION_FILE.write_text(json.dumps(weights, indent=2))

def calculate_attention_score(email_data, headers_raw):
    """Calculate attention-weighted score for decision making"""
    weights = load_attention_weights()
    score = 0
    
    sender = email_data.get('sender', '').lower()
    subject = email_data.get('subject', '').lower()
    snippet = email_data.get('snippet', '').lower()
    text = f"{subject} {snippet}"
    
    # Sender-based attention
    if any(x in sender for x in ['mailer-daemon', 'postmaster']):
        score += weights['sender_bounce'] * 100
    if any(x in sender for x in ['github.com', 'zapier']):
        score += weights['sender_github'] * 100
    
    # Keyword attention
    keywords_found = Counter({
        'airbnb': text.count('airbnb'),
        'reserva': text.count('reserva'),
        'urgent': text.count('urgent') + text.count('urgente'),
        'quote': text.count('quote') + text.count('proposta')
    })
    
    for keyword, count in keywords_found.items():
        if count > 0 and keyword in weights:
            score += weights.get(f'keyword_{keyword}', 0.5) * count * 10
    
    # Presence features
    headers = {h['name']: h['value'] for h in headers_raw}
    cc = headers.get('Cc', '')
    if cc:
        score += weights['cc_present'] * 20
    
    # Language detection
    pt_indicators = ['prezado', 'obrigado', 'agradeço', 'favor']
    if any(x in text for x in pt_indicators):
        score += weights['language_pt'] * 15
    
    return score

def needs_reply_all(headers):
    cc = next((h['value'] for h in headers if h['name'].lower() == 'cc'), '')
    return len(cc.strip()) > 0 if cc else False

def neural_decide(email_data, headers_raw):
    """Neurally-inspired decision making using attention scores"""
    score = calculate_attention_score(email_data, headers_raw)
    sender = email_data.get('sender', '').lower()
    
    # Decision thresholds based on attention scores
    if score >= 90:
        return {'action': 'archive', 'confidence': 0.99, 'score': score}
    
    if score >= 50:
        intent = 'booking' if 'airbnb' in email_data.get('subject','').lower() or 'reserva' in email_data.get('snippet','').lower() else 'urgent'
        return {'action': 'reply', 'intent': intent, 'confidence': min(0.95, score/100), 'score': score}
    
    if score >= 30:
        return {'action': 'reply', 'intent': 'sales', 'confidence': 0.70, 'score': score}
    
    return {'action': 'skip', 'confidence': 0.50, 'score': score}

def generate_neural_reply(intent):
    templates = {
        'booking': "Prezado(a),\n\nRecebi sua solicitação. Processo e retorno em até 24h.\n\nAtenciosamente,\nKleber Garcia Alcatrão",
        'urgent': "Prezado(a),\n\nRecebido com prioridade. Trabalhando agora.\n\nAtenciosamente,\nKleber Garcia Alcatrão",
        'sales': "Prezado(a),\n\nAgradeço pelo interesse. Preparo proposta em breve.\n\nAtenciosamente,\nKleber Garcia Alcatrão"
    }
    return templates.get(intent, "Obrigado pela mensagem. Retornarei.\n\nAtenciosamente,\nKleber Garcia Alcatrão")

def cmd_run(dry_run=False, limit=15):
    print("🧠 Neural-Inspired Responder V15 (Attention-Weighted)")
    
    msgs = gmail_search('is:unread', limit=200)
    label_id = gmail_get_or_create_label_id(LABEL_DONE)
    
    emails = []
    for msg in msgs:
        try:
            full = gmail_get(msg['id'])
            headers_raw = full.get('payload', {}).get('headers', [])
            headers = {h['name']: h['value'] for h in headers_raw}
            
            email_data = {
                'id': msg['id'],
                'sender': headers.get('From', ''),
                'subject': headers.get('Subject', ''),
                'snippet': full.get('snippet', '')
            }
            
            decision = neural_decide(email_data, headers_raw)
            decision['reply_all'] = needs_reply_all(headers_raw)
            emails.append({'id': msg['id'], 'sender': email_data['sender'], 'subject': email_data['subject'], 'decision': decision})
        except: pass
    
    emails.sort(key=lambda x: x['decision']['score'], reverse=True)
    stats = {'replied': 0, 'archived': 0, 'skipped': 0}
    
    for e in emails[:limit]:
        d = e['decision']
        
        if d['action'] == 'skip':
            stats['skipped'] += 1
            continue
            
        if d['action'] == 'archive':
            stats['archived'] += 1
            print(f"📧 {e['sender'][:30]} | 🗑️ score:{d['score']:.0f}")
            if not dry_run:
                gmail_batch_modify({'ids': [e['id']]}, removeLabelIds=['INBOX'])
            continue
            
        if d['action'] == 'reply':
            reply = generate_neural_reply(d.get('intent', 'booking'))
            stats['replied'] += 1
            
            print(f"📧 {e['sender'][:30]} | {d.get('intent', 'reply')} | score:{d['score']:.0f} ({d['confidence']*100:.0f}%){' 🔄 Reply-All' if d['reply_all'] else ''}")
            
            if not dry_run:
                gmail_send_reply(e['id'], reply)
                gmail_batch_modify({'ids': [e['id']]}, addLabelIds=[label_id])
    
    print(f"\n📊 Replied: {stats['replied']} | Archived: {stats['archived']}")

if __name__ == '__main__':
    import argparse
    p = argparse.ArgumentParser()
    p.add_argument('--execute', action='store_true')
    p.add_argument('--limit', type=int, default=15)
    args = p.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)