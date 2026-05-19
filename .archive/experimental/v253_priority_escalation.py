#!/usr/bin/env python3
"""
V253 - Priority Escalation
Smart urgency detection and response tiering
"""

import sys
from pathlib import Path
from datetime import datetime, timedelta

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, gmail_get, gmail_send_reply, gmail_batch_modify, gmail_get_or_create_label_id

LABEL = 'V253-Priority-Escalation'

class PriorityEscalation:
    def __init__(self):
        self.sig = "Kleber Garcia Alcatrão\nZion Tech Group"
    
    def analyze_urgency(self, subject, snippet):
        scores = {
            'urgente': 4, 'urgency': 4, 'urgent': 4,
            'reserva': 3, 'booking': 3, 'reserve': 3,
            'consulta': 2, 'question': 2, 'inquiry': 2,
            'preço': 2, 'price': 2, 'valor': 2,
            'disponível': 2, 'available': 2
        }
        text = f"{subject} {snippet}".lower()
        return sum(scores.get(w, 0) for w in scores.keys() if w in text)
    
    def priority_response(self, name, dates, subject, snippet):
        score = self.analyze_urgency(subject, snippet)
        date_str = ', '.join(dates)
        
        if score >= 4:
            priority = "🚨 URGENTE - RESPOSTA IMEDIATA"
            response_type = "Responderei em até 30 minutos."
        elif score >= 2:
            priority = "⚡ ALTA PRIORIDADE"
            response_type = "Confirmo disponibilidade hoje."
        else:
            priority = "📅 NORMAL"
            response_type = "Retornarei em até 2 horas."
        
        return f"""Olá {name}!

{priority}

{response_type}

Datas disponíveis: {date_str}

Mansão na Riviera - 5 suítes, piscina aquecida

WhatsApp: +55 11 99999-9999

{self.sig}"""

def get_dates():
    today = datetime.now()
    return [d.strftime('%d/%m') for d in [today + timedelta(days=x) for x in range(1, 8)] if d.weekday() < 5][:3]

def cmd_run(dry_run=False, limit=5):
    print(" V253 Priority Escalation")
    msgs = gmail_search('is:unread from:airbnb.com', limit=limit)
    for msg in msgs:
        try:
            full = gmail_get(msg['id'])
            headers = {h['name']: h['value'] for h in full.get('payload', {}).get('headers', [])}
            sender = headers.get('From', '')
            name = sender.split('<')[0].strip().strip('"') if '<' in sender else sender
            urgency = PriorityEscalation().analyze_urgency(headers.get('Subject', ''), full.get('snippet', ''))
            response = PriorityEscalation().priority_response(name, get_dates(), headers.get('Subject', ''), full.get('snippet', ''))
            print(f" {name[:20]} | Priority:{urgency}")
            if not dry_run:
                gmail_send_reply(msg['id'], response)
        except Exception as e:
            print(f"Error: {e}")
    print(" V253: Escalation active")

if __name__ == '__main__':
    import argparse
    p = argparse.ArgumentParser()
    p.add_argument('--execute', action='store_true')
    p.add_argument('--limit', type=int, default=5)
    args = p.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)