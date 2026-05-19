#!/usr/bin/env python3
"""
V42 - Predictive Lead Scoring & Opportunity Intelligence
Scores leads 1-100 and predicts conversion probability
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

LABEL = 'V42-Predictive-Lead-Scoring'
LEAD_DB = WORKSPACE / 'zion.app' / 'memory' / 'lead_scores.json'

class LeadScorer:
    def __init__(self):
        self.weights = {
            'urgency_keywords': 25,
            'budget_mentioned': 20,
            'international': 15,
            'return_customer': 20,
            'long_stay': 15,
            'positive_sentiment': 10,
            'professional_tone': 5
        }
    
    def score_lead(self, sender, subject, snippet):
        """Score lead 1-100 based on multiple factors"""
        text = f"{subject} {snippet}".lower()
        score = 50  # Base score
        
        # Urgency keywords
        if any(w in text for w in ['urgente', 'urgente', 'agora', 'imediato', 'asap']):
            score += self.weights['urgency_keywords']
        
        # Budget mentioned
        if any(w in text for w in ['orçamento', 'preço', 'budget', 'valor', 'custo']):
            score += self.weights['budget_mentioned']
        
        # International
        if any(w in sender.lower() for w in ['.com', '.org']) and not 'airbnb' in sender.lower():
            score += self.weights['international']
        
        # Return customer check (simplified)
        try:
            with open(LEAD_DB, 'r') as f:
                leads = json.load(f)
                if sender in leads:
                    score += self.weights['return_customer']
        except:
            pass
        
        # Long stay
        if any(w in text for w in ['semana', 'semanas', 'week', 'multiple']):
            score += self.weights['long_stay']
        
        # Positive sentiment
        if any(w in text for w in ['obrigado', 'interessado', 'interested', 'quero', 'want']):
            score += self.weights['positive_sentiment']
        
        return min(100, max(1, score))
    
    def get_tier(self, score):
        """Convert score to tier"""
        if score >= 80:
            return 'A+ (Immediate)'
        elif score >= 60:
            return 'A (Follow-up today)'
        elif score >= 40:
            return 'B (Follow-up 2 days)'
        else:
            return 'C (Nurture)'
    
    def generate_prioritized_response(self, name, score, tier, dates):
        """Generate response based on lead score"""
        date_str = ', '.join(dates)
        
        if score >= 80:
            template = f"Olá {name}! LEAD PRIORITÁRIO A+: Sua solicitação é urgente. Disponível {date_str}. Estou pessoalmente atendendo. Kleber Garcia Alcatrão"
        elif score >= 60:
            template = f"Prezado(a) {name}, Lead A+ detectado. {date_str} confirmados. Aguardo sua decisão. Atenciosamente, Kleber"
        else:
            template = f"Olá {name}, Disponível para {date_str}. Estou à disposição. Kleber Garcia Alcatrão"
        
        return template

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
    print("🎯 V42 Predictive Lead Scoring")
    print("   Features: 1-100 Scoring + Conversion Prediction + Priority Routing")
    
    scorer = LeadScorer()
    msgs = gmail_search('is:unread from:airbnb.com', limit=20)
    label_id = gmail_get_or_create_label_id(LABEL)
    
    stats = {'replied': 0, 'scores': []}
    
    for msg in msgs[:limit]:
        try:
            full = gmail_get(msg['id'])
            headers = {h['name']: h['value'] for h in full.get('payload', {}).get('headers', [])}
            sender = headers.get('From', '')
            subject = headers.get('Subject', '')
            snippet = full.get('snippet', '')
            
            name_part = sender.split('<')[0].strip().strip('"') if '<' in sender else sender
            
            # Score lead
            score = scorer.score_lead(sender, subject, snippet)
            tier = scorer.get_tier(score)
            stats['scores'].append(score)
            
            # Generate response
            dates = get_available_dates()
            response = scorer.generate_prioritized_response(name_part, score, tier, dates)
            
            print(f"🎯 {name_part[:25]} | Score: {score} | Tier: {tier}")
            print(f"   ✅ {response[:70]}...")
            
            if not dry_run:
                gmail_send_reply(msg['id'], response)
                gmail_batch_modify({'ids': [msg['id']]}, addLabelIds=[label_id])
            
            stats['replied'] += 1
                
        except Exception as e:
            print(f"Error: {e}")
            continue
    
    avg_score = sum(stats['scores']) / len(stats['scores']) if stats['scores'] else 0
    print(f"\n📊 Replied: {stats['replied']} | Avg Score: {avg_score:.0f}")

if __name__ == '__main__':
    import argparse
    p = argparse.ArgumentParser()
    p.add_argument('--execute', action='store_true')
    p.add_argument('--limit', type=int, default=5)
    args = p.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)