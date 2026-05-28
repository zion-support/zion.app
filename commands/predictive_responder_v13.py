#!/usr/bin/env python3
"""
Predictive Email Responder V13
Analyzes conversation context to predict optimal next action
"""

import sys, json
from pathlib import Path
from datetime import datetime, timedelta

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, gmail_get, gmail_send_reply, gmail_batch_modify, gmail_get_or_create_label_id

LABEL_DONE = 'Autonomous-V13'
PREDICTION_FILE = WORKSPACE / 'zion.app' / 'data' / 'predictions.json'

def load_predictions():
    if PREDICTION_FILE.exists():
        return json.loads(PREDICTION_FILE.read_text())
    return {'accuracy': {}, 'patterns': {}}

def save_predictions(data):
    PREDICTION_FILE.parent.mkdir(parents=True, exist_ok=True)
    PREDICTION_FILE.write_text(json.dumps(data, indent=2))

def needs_reply_all(headers):
    cc = next((h['value'] for h in headers if h['name'].lower() == 'cc'), '')
    return len(cc.strip()) > 0 if cc else False

def predict_optimal_action(sender, subject, snippet, headers):
    """Predict the best action based on email features"""
    text = f"{subject} {snippet}".lower()
    sender_lower = sender.lower()
    
    # Feature extraction
    features = {
        'has_airbnb': 'airbnb' in text,
        'has_booking': any(x in text for x in ['reserva', 'booking', 'confirmation']),
        'has_urgent': any(x in text for x in ['urgent', 'urgente', 'asap']),
        'has_cc': needs_reply_all(headers),
        'hour': datetime.now().hour,
        'day': datetime.now().weekday()
    }
    
    # Decision logic based on features
    if any(x in sender_lower for x in ['mailer-daemon', 'postmaster']):
        return {'action': 'archive', 'reason': 'bounce', 'confidence': 0.99}
    
    if any(x in sender_lower for x in ['github.com', 'zapier']):
        return {'action': 'skip', 'reason': 'noise', 'confidence': 0.95}
    
    if features['has_airbnb'] or features['has_booking']:
        response_time = 30 if 9 <= features['hour'] <= 17 else 120  # Faster during biz hours
        return {
            'action': 'reply',
            'category': 'booking',
            'response_time_min': response_time,
            'confidence': 0.92,
            'reason': 'business_booking'
        }
    
    if features['has_urgent']:
        return {
            'action': 'reply',
            'category': 'urgent',
            'response_time_min': 5,
            'confidence': 0.85,
            'reason': 'time_sensitive'
        }
    
    return {'action': 'skip', 'confidence': 0.7}

def generate_predictive_reply(category, response_time):
    """Generate reply optimized for predicted response time"""
    urgency = "em seguida" if response_time <= 5 else "em breve"
    
    replies = {
        'booking': f"Prezado(a),\n\nRecebi sua solicitação. Retorno {urgency} com confirmação.\n\nAtenciosamente,\nKleber Garcia Alcatrão",
        'urgent': "Prezado(a),\n\nRecebido com prioridade máxima. Trabalhando agora.\n\nAtenciosamente,\nKleber Garcia Alcatrão"
    }
    return replies.get(category, "Obrigado pela mensagem. Retornarei.\n\nAtenciosamente,\nKleber Garcia Alcatrão")

def cmd_run(dry_run=False, limit=10):
    print("🔮 Predictive Responder V13 (AI-Powered Action Selection)")
    
    msgs = gmail_search('is:unread', limit=200)
    label_id = gmail_get_or_create_label_id(LABEL_DONE)
    predictions = load_predictions()
    
    emails = []
    for msg in msgs:
        try:
            full = gmail_get(msg['id'])
            headers_raw = full.get('payload', {}).get('headers', [])
            headers = {h['name']: h['value'] for h in headers_raw}
            sender = headers.get('From', '')
            subject = headers.get('Subject', '')
            snippet = full.get('snippet', '')
            
            decision = predict_optimal_action(sender, subject, snippet, headers_raw)
            decision['reply_all'] = needs_reply_all(headers_raw)
            emails.append({'id': msg['id'], 'sender': sender, 'subject': subject, 'decision': decision})
        except: pass
    
    emails.sort(key=lambda x: x['decision'].get('confidence', 0), reverse=True)
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
            reply = generate_predictive_reply(d.get('category', 'booking'), d.get('response_time_min', 60))
            stats['replied'] += 1
            
            # Track prediction accuracy
            predictions['accuracy'][d.get('category', 'general')] = predictions['accuracy'].get(d.get('category', 'general'), 0) + 1
            save_predictions(predictions)
            
            print(f"📧 {e['sender'][:30]} | {d.get('category', 'reply')} ({d['confidence']*100:.0f}% conf) | ⏱️ {d.get('response_time_min', 60)}min")
            
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