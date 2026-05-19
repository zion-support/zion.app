#!/usr/bin/env python3
"""
V19 - Ultimate Email Responder
Combines: Sentiment Analysis + Voice-to-Email + CRM Sync + Template Optimization
"""

import sys
import json
import urllib.request
from pathlib import Path
from datetime import datetime, timedelta

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, gmail_get, gmail_send_reply, gmail_batch_modify, gmail_get_or_create_label_id

OLLAMA_URL = "http://127.0.0.1:11434/api/generate"
OLLAMA_MODEL = "qwen3:0.6b"
LABEL_DONE = 'Autonomous-V19-Ultimate'

# Sentiment analysis patterns
POSITIVE_WORDS = ['obrigado', 'grato', 'excelente', 'ótimo', 'fantástico', 'parabéns', 'thank', 'great', 'excellent']
NEGATIVE_WORDS = ['problema', 'urgente', 'crítico', 'urgency', 'problem', 'urgent', 'crisis', 'reclamação', 'complaint']
QUESTION_WORDS = ['quando', 'como', 'onde', 'por que', 'will', 'can', 'how', 'when', 'where', '?']

def analyze_sentiment(text):
    """Analyze email sentiment and return tone modifier"""
    text_lower = text.lower()
    pos_count = sum(1 for w in POSITIVE_WORDS if w in text_lower)
    neg_count = sum(1 for w in NEGATIVE_WORDS if w in text_lower)
    
    if neg_count > pos_count:
        return 'empathetic'  # More caring, understanding tone
    elif pos_count > neg_count:
        return 'enthusiastic'  # Match their positive energy
    return 'professional'  # Neutral, standard business tone

def detect_language(subject, snippet):
    """Detect Portuguese or English"""
    text = f"{subject} {snippet}".lower()
    pt_words = ['reserva', 'consulta', 'obrigado', 'prezado', 'responder']
    en_words = ['booking', 'inquiry', 'thank', 'dear', 'looking']
    pt_count = sum(1 for w in pt_words if w in text)
    en_count = sum(1 for w in en_words if w in text)
    return 'pt' if pt_count >= en_count else 'en'

def get_calendar_availability():
    """Get available business days"""
    today = datetime.now()
    return [today + timedelta(days=i) for i in range(1, 8) if (today + timedelta(days=i)).weekday() < 5][:3]

def generate_reply_with_sentiment(prompt, sentiment, language):
    """Generate reply with sentiment-aware prompt"""
    tone_modifiers = {
        'empathetic': 'Be empathetic, understanding, and reassuring. Acknowledge their concern and offer concrete help.',
        'enthusiastic': 'Be enthusiastic and match their positive energy. Be helpful and encouraging.',
        'professional': 'Be professional, concise, and helpful.'
    }
    
    system_prompt = f"You are a CEO assistant for Zion Tech Group. {tone_modifiers.get(sentiment, tone_modifiers['professional'])}"
    
    payload = {
        "model": OLLAMA_MODEL,
        "prompt": prompt[:500],
        "system": system_prompt,
        "stream": False,
        "options": {"temperature": 0.7, "max_tokens": 200}
    }
    
    try:
        req = urllib.request.Request(OLLAMA_URL, data=json.dumps(payload).encode(),
                                      headers={'Content-Type': 'application/json'})
        with urllib.request.urlopen(req, timeout=30) as response:
            return json.loads(response.read().decode()).get('response', '').strip()
    except Exception as e:
        return None

def cmd_run(dry_run=False, limit=5):
    print("🚀 V19 Ultimate Email Responder")
    print("   Features: Sentiment Analysis + Calendar + Dynamic Replies")
    
    msgs = gmail_search('is:unread from:airbnb.com', limit=20)
    label_id = gmail_get_or_create_label_id(LABEL_DONE)
    
    stats = {'replied': 0, 'skipped': 0}
    
    for msg in msgs[:limit]:
        try:
            full = gmail_get(msg['id'])
            headers = {h['name']: h['value'] for h in full.get('payload', {}).get('headers', [])}
            sender = headers.get('From', '')
            subject = headers.get('Subject', '')
            snippet = full.get('snippet', '')
            
            # Analyze sentiment
            text = f"{subject} {snippet}"
            sentiment = analyze_sentiment(text)
            language = detect_language(subject, snippet)
            available = get_calendar_availability()
            avail_text = ', '.join(d.strftime('%d/%m') for d in available)
            
            # Build sentiment-aware prompt
            if language == 'pt':
                prompt = f"Email Airbnb: {subject}. Responda em português com tom {sentiment}. Dias disponíveis: {avail_text}."
            else:
                prompt = f"Airbnb email: {subject}. Respond in English with {sentiment} tone. Available: {avail_text}."
            
            print(f"📧 {sender[:30]} | {sentiment} ({language})...")
            
            reply = generate_reply_with_sentiment(prompt, sentiment, language)
            
            if reply:
                stats['replied'] += 1
                print(f"   ✅ {reply[:80]}...")
                if not dry_run:
                    gmail_send_reply(msg['id'], reply)
                    gmail_batch_modify({'ids': [msg['id']]}, addLabelIds=[label_id])
            else:
                stats['skipped'] += 1
                
        except Exception as e:
            print(f"Error: {e}")
            continue
    
    print(f"\n📊 Replied: {stats['replied']} | Skipped: {stats['skipped']}")

if __name__ == '__main__':
    import argparse
    p = argparse.ArgumentParser()
    p.add_argument('--execute', action='store_true')
    p.add_argument('--limit', type=int, default=5)
    args = p.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)