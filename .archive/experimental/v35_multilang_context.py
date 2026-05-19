#!/usr/bin/env python3
"""
V35 - Multi-Language Context-Aware Responder
Adapts language, tone, and content based on sender context
"""

import sys
from pathlib import Path
from datetime import datetime, timedelta
import random

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, gmail_get, gmail_send_reply, gmail_batch_modify, gmail_get_or_create_label_id

LABEL = 'V35-Context-Aware-MultiLang'

# Multi-language response templates
RESPONSES = {
    'pt': {
        'formal': ["Prezado(a) {name},\n\nConfirmo disponibilidade para Mansão na Riviera nos dias {dates}.\n\nAtenciosamente,\nKleber Garcia Alcatrão",
                   "Prezado(a) Senhor/Senhora {name[-10:]},\n\nTemos a honra de confirmar disponibilidade: {dates}.\n\nCordialmente,\nKleber Garcia Alcatrão, Zion Tech Group"],
        'casual': ["Oi {name},\n\nA Mansão tá disponível! {dates}. Beleza?\n\nAbraço,\nKleber",
                   "Olá {name}!\n\nReserva confirmada para {dates}. Vamos fechar?\n\nKleber"]
    },
    'en': {
        'formal': ["Dear {name},\n\nI confirm availability for the Riviera mansion on {dates}.\n\nBest regards,\nKleber Garcia Alcatrão",
                   "Dear Mr./Ms. {name},\n\nWe are pleased to confirm availability for {dates}.\n\nSincerely,\nKleber Garcia Alcatrão, Zion Tech Group"],
        'casual': ["Hi {name}!\n\nThe mansion is available {dates}. Let me know!\n\nCheers,\nKleber",
                   "Hello {name},\n\nRiviera mansion available {dates}. Interested?\n\nKleber"]
    }
}

class ContextAnalyzer:
    def __init__(self):
        self.sender_patterns = {}
        
    def analyze_sender(self, sender_email, subject, snippet):
        """Determine language and tone preference"""
        text = f"{subject} {snippet}".lower()
        
        # Language detection
        pt_keywords = ['reserva', 'prezado', 'obrigado', 'consulta', 'mansão']
        en_keywords = ['booking', 'dear', 'thank', 'inquiry', 'mansion']
        
        pt_score = sum(1 for kw in pt_keywords if kw in text)
        en_score = sum(1 for kw in en_keywords if kw in text)
        
        language = 'pt' if pt_score >= en_score else 'en'
        
        # Tone detection
        formal_words = ['prezado', 'dear', 'solicito', 'request']
        casual_indicators = ['oi', 'hi', 'hey', 'tudo bem']
        
        tone = 'formal' if any(w in text for w in formal_words) else 'casual'
        
        # Store pattern
        self.sender_patterns[sender_email] = {'language': language, 'tone': tone}
        
        return language, tone
    
    def get_available_dates(self):
        today = datetime.now()
        dates = []
        for i in range(1, 8):
            d = today + timedelta(days=i)
            if d.weekday() < 5:
                dates.append(d.strftime('%d/%m'))
            if len(dates) >= 3:
                break
        return ', '.join(dates)

def cmd_run(dry_run=False, limit=5):
    print("🌍 V35 Multi-Language Context-Aware Responder")
    print("   Features: Language Detection + Tone Adaptation + Context Memory")
    
    analyzer = ContextAnalyzer()
    
    msgs = gmail_search('is:unread from:airbnb.com', limit=20)
    label_id = gmail_get_or_create_label_id(LABEL)
    
    stats = {'replied': 0, 'languages': {'pt': 0, 'en': 0}, 'tones': {'formal': 0, 'casual': 0}}
    
    for msg in msgs[:limit]:
        try:
            full = gmail_get(msg['id'])
            headers = {h['name']: h['value'] for h in full.get('payload', {}).get('headers', [])}
            sender = headers.get('From', '')
            subject = headers.get('Subject', '')
            snippet = full.get('snippet', '')
            
            name_part = sender.split('<')[0].strip().strip('"') if '<' in sender else sender
            
            # Analyze context
            language, tone = analyzer.analyze_sender(sender, subject, snippet)
            stats['languages'][language] += 1
            stats['tones'][tone] += 1
            
            # Get dates
            dates = analyzer.get_available_dates()
            
            # Select and format response
            templates = RESPONSES[language][tone]
            response = random.choice(templates).format(name=name_part, dates=dates)
            
            print(f"🌍 {name_part[:25]} | {language.upper()} | {tone}")
            print(f"   ✅ {response[:70]}...")
            
            if not dry_run:
                gmail_send_reply(msg['id'], response)
                gmail_batch_modify({'ids': [msg['id']]}, addLabelIds=[label_id])
            
            stats['replied'] += 1
                
        except Exception as e:
            print(f"Error: {e}")
            continue
    
    print(f"\n📊 Replied: {stats['replied']} | PT: {stats['languages']['pt']} | EN: {stats['languages']['en']}")
    print(f"   Formal: {stats['tones']['formal']} | Casual: {stats['tones']['casual']}")

if __name__ == '__main__':
    import argparse
    p = argparse.ArgumentParser()
    p.add_argument('--execute', action='store_true')
    p.add_argument('--limit', type=int, default=5)
    args = p.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)