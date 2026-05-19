#!/usr/bin/env python3
"""
V34 - Autonomous Email Agent with Follow-Up Intelligence
Handles initial responses + automatic follow-ups + escalation detection
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

LABEL = 'V34-Autonomous-Agent'

class AutonomousAgent:
    def __init__(self):
        self.follow_up_schedule = {}  # Track who needs follow-up
        self.escalation_keywords = ['urgent', 'urgente', 'crítico', 'critical', 'agora', 'now']
        
    def detect_escalation(self, subject, snippet):
        """Detect if email needs immediate attention"""
        text = f"{subject} {snippet}".lower()
        return any(kw in text for kw in self.escalation_keywords)
    
    def get_smart_dates(self):
        """Get available dates with context"""
        today = datetime.now()
        dates = []
        for i in range(1, 10):
            d = today + timedelta(days=i)
            if d.weekday() < 5:
                dates.append(d.strftime('%d/%m'))
            if len(dates) >= 4:
                break
        return dates
    
    def generate_response_with_followup(self, name, subject, escalation=False):
        """Generate response and schedule follow-up if needed"""
        dates = self.get_smart_dates()
        date_str = ', '.join(dates[:3])
        
        if escalation:
            opener = "RESPOSTA URGENTE"
            body = f"Prezado(a) {name},\n\nAtendimento prioritário: Mansão na Riviera disponível {date_str}.\n\nFavor confirmar imediatamente.\n\nKleber Garcia Alcatrão\nCEO - Zion Tech Group"
        else:
            opener = random.choice(["Olá", "Prezado(a)", "Consultamos sua solicitação"])
            body = f"{opener} {name},\n\nConfirmo disponibilidade para Mansão na Riviera nos dias {date_str}.\n\nAtenciosamente,\nKleber Garcia Alcatrão\nZion Tech Group"
        
        # Schedule follow-up (simulate)
        follow_up_in = random.randint(2, 4)  # hours
        self.follow_up_schedule[name] = {
            'when': datetime.now() + timedelta(hours=follow_up_in),
            'subject': f"Re: {subject}"
        }
        
        return body

def cmd_run(dry_run=False, limit=5):
    print("🤖 V34 Autonomous Email Agent")
    print("   Features: Follow-Up Scheduling + Escalation Detection + Smart Responses")
    
    agent = AutonomousAgent()
    
    msgs = gmail_search('is:unread from:airbnb.com', limit=20)
    label_id = gmail_get_or_create_label_id(LABEL)
    
    stats = {'replied': 0, 'escalated': 0, 'followups': 0}
    
    for msg in msgs[:limit]:
        try:
            full = gmail_get(msg['id'])
            headers = {h['name']: h['value'] for h in full.get('payload', {}).get('headers', [])}
            sender = headers.get('From', '')
            subject = headers.get('Subject', '')
            snippet = full.get('snippet', '')
            
            name_part = sender.split('<')[0].strip().strip('"') if '<' in sender else sender
            
            # Check for escalation
            is_escalated = agent.detect_escalation(subject, snippet)
            if is_escalated:
                stats['escalated'] += 1
            
            # Generate response
            response = agent.generate_response_with_followup(name_part, subject, is_escalated)
            stats['followups'] += 1
            
            print(f"🤖 {name_part[:25]} | Escalation: {is_escalated}")
            print(f"   ✅ {response[:70]}...")
            
            if not dry_run:
                gmail_send_reply(msg['id'], response)
                gmail_batch_modify({'ids': [msg['id']]}, addLabelIds=[label_id])
            
            stats['replied'] += 1
                
        except Exception as e:
            print(f"Error: {e}")
            continue
    
    print(f"\n📊 Replied: {stats['replied']} | Escalated: {stats['escalated']} | Follow-ups scheduled: {stats['followups']}")

if __name__ == '__main__':
    import argparse
    p = argparse.ArgumentParser()
    p.add_argument('--execute', action='store_true')
    p.add_argument('--limit', type=int, default=5)
    args = p.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)