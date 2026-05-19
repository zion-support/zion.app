#!/usr/bin/env python3
"""
V46 - Ultimate Consolidation Engine
Combines V31-V45 innovations into one super-intelligent responder
"""

import sys
from pathlib import Path
from datetime import datetime, timedelta

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, gmail_get, gmail_send_reply, gmail_batch_modify, gmail_get_or_create_label_id

LABEL = 'V46-Ultimate-Consolidation'

class UltimateEngine:
    def __init__(self):
        self.kleber_sig = "Kleber Garcia Alcatrão\nZion Tech Group (a Zion Holdings Company)"
        self.kleber_contact = "Mobile: +1 302 464 0950\nSkype: kleber.alcatrao"
    
    def detect_language(self, text):
        return 'pt' if any(w in text for w in ['reserva', 'obrigado', 'mansão']) else 'en'
    
    def detect_tone(self, text):
        if any(w in text for w in ['urgente', 'crítico']): return 'urgent'
        if any(w in text for w in ['parceria', 'cooperação']): return 'friendly'
        return 'professional'
    
    def detect_urgency(self, text):
        return any(w in text for w in ['urgente', 'agora', 'imediato'])
    
    def score_lead(self, text):
        score = 50
        if any(w in text for w in ['urgente', 'orçamento', 'valor']): score += 20
        if any(w in text for w in ['internacional', '.com']): score += 15
        return min(100, score)
    
    def detect_stage(self, text):
        if 'negociar' in text: return 'negotiation'
        if 'confirmar' in text: return 'closed_won'
        return 'lead'
    
    def generate_response(self, name, dates, features):
        date_str = ', '.join(dates)
        lang = features['language']
        urgent = features['urgency']
        score = features['lead_score']
        
        if urgent:
            return f"⚠️ URGENTE - {name}\n\nMansão disponível {date_str}. RESPOSTA PRIORITÁRIA.\n\n{self.kleber_sig}"
        
        if score >= 70:
            return f"{name}, LEAD QUENTE! {date_str} confirmados. DECIDA HOJE.\n\n{self.kleber_sig}"
        
        if lang == 'pt':
            return f"Olá {name}!\n\nMansão única na Riviera disponível: {date_str}.\n\n{self.kleber_sig}\n{self.kleber_contact}"
        else:
            return f"Hello {name}!\n\nRiviera mansion available: {date_str}.\n\n{self.kleber_contact}"

def get_available_dates():
    today = datetime.now()
    dates = []
    for i in range(1, 8):
        d = today + timedelta(days=i)
        if d.weekday() < 5:
            dates.append(d.strftime('%d/%m'))
        if len(dates) >= 3:
            break
    return dates

def cmd_run(dry_run=False, limit=5):
    print("🚀 V46 Ultimate Consolidation Engine")
    print("   Combines: V31-V45 innovations into ONE super-intelligent responder")
    
    engine = UltimateEngine()
    msgs = gmail_search('is:unread from:airbnb.com', limit=20)
    label_id = gmail_get_or_create_label_id(LABEL)
    
    stats = {'replied': 0}
    
    for msg in msgs[:limit]:
        try:
            full = gmail_get(msg['id'])
            headers = {h['name']: h['value'] for h in full.get('payload', {}).get('headers', [])}
            sender = headers.get('From', '')
            subject = headers.get('Subject', '')
            snippet = full.get('snippet', '')
            
            name_part = sender.split('<')[0].strip().strip('"') if '<' in sender else sender
            text = f"{subject} {snippet}".lower()
            
            features = {
                'language': engine.detect_language(text),
                'tone': engine.detect_tone(text),
                'urgency': engine.detect_urgency(text),
                'lead_score': engine.score_lead(text),
                'stage': engine.detect_stage(text)
            }
            
            dates = get_available_dates()
            response = engine.generate_response(name_part, dates, features)
            
            print(f"🚀 {name_part[:25]} | Score: {features['lead_score']} | Urgent: {features['urgency']}")
            print(f"   ✅ {response[:70]}...")
            
            if not dry_run:
                gmail_send_reply(msg['id'], response)
                gmail_batch_modify({'ids': [msg['id']]}, addLabelIds=[label_id])
            
            stats['replied'] += 1
                
        except Exception as e:
            print(f"Error: {e}")
            continue
    
    print(f"\n📊 Replied: {stats['replied']}")

if __name__ == '__main__':
    import argparse
    p = argparse.ArgumentParser()
    p.add_argument('--execute', action='store_true')
    p.add_argument('--limit', type=int, default=5)
    args = p.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)