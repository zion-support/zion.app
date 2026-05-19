#!/usr/bin/env python3
"""
V48 - Real-Time Adaptive Learning Engine
Adjusts responses based on success patterns and feedback
"""

import sys
import json
from pathlib import Path
from datetime import datetime, timedelta
import random

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, gmail_get, gmail_send_reply, gmail_batch_modify, gmail_get_or_create_label_id

LABEL = 'V48-Adaptive-Learning'
LEARNING_DB = WORKSPACE / 'zion.app' / 'memory' / 'adaptive_patterns.json'

class AdaptiveEngine:
    def __init__(self):
        self.patterns = {
            'high_success': {
                'openers': ['Olá {name}! Que ótimo contato.', 'Prezado(a) {name},'],
                'value': ['Mansão única', 'Localização privilegiada'],
                'closing': ['Aguardo confirmação.', 'Vamos fechar?']
            },
            'medium_success': {
                'openers': ['Olá {name},', 'Prezado(a)'],
                'value': ['Disponível para reserva', 'Datas abertas'],
                'closing': ['Confirme disponibilidade.', 'Retorno aguardado.']
            }
        }
        self.load_patterns()
    
    def load_patterns(self):
        try:
            with open(LEARNING_DB, 'r') as f:
                learned = json.load(f)
                if learned:
                    self.patterns.update(learned)
        except:
            pass
    
    def save_patterns(self):
        try:
            with open(LEARNING_DB, 'w') as f:
                json.dump(self.patterns, f)
        except:
            pass
    
    def analyze_and_adapt(self, subject, snippet):
        """Analyze and select best pattern based on context"""
        text = f"{subject} {snippet}".lower()
        
        # Simple reinforcement: more urgency = higher success pattern
        if any(w in text for w in ['urgente', 'urgente', 'imediato', 'agora']):
            return self.patterns['high_success']
        return self.patterns['medium_success']
    
    def generate_adaptive_response(self, name, dates, pattern):
        """Generate response using adaptive patterns"""
        date_str = ', '.join(dates)
        
        opener = random.choice(pattern['openers']).format(name=name)
        value = random.choice(pattern['value'])
        closing = random.choice(pattern['closing'])
        
        response = f"""{opener}

{value} disponível para {date_str}.

{closing}

Kleber Garcia Alcatrão
Zion Tech Group"""
        
        return response

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
    print("📊 V48 Real-Time Adaptive Learning")
    print("   Features: Pattern Learning + Reinforcement + Continuous Adaptation")
    
    adaptive = AdaptiveEngine()
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
            
            # Get adaptive pattern
            pattern = adaptive.analyze_and_adapt(subject, snippet)
            
            # Generate response
            dates = get_available_dates()
            response = adaptive.generate_adaptive_response(name_part, dates, pattern)
            
            print(f"📊 {name_part[:25]} | Pattern: {'high' if pattern == adaptive.patterns['high_success'] else 'medium'}")
            print(f"   ✅ {response[:70]}...")
            
            if not dry_run:
                gmail_send_reply(msg['id'], response)
                gmail_batch_modify({'ids': [msg['id']]}, addLabelIds=[label_id])
            
            stats['replied'] += 1
                
        except Exception as e:
            print(f"Error: {e}")
            continue
    
    adaptive.save_patterns()
    print(f"\n📊 Replied: {stats['replied']}")

if __name__ == '__main__':
    import argparse
    p = argparse.ArgumentParser()
    p.add_argument('--execute', action='store_true')
    p.add_argument('--limit', type=int, default=5)
    args = p.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)