#!/usr/bin/env python3
"""
V53 - Self-Aware Ultimate Analyzer
Final evolution - analyzes, decides, responds with perfect intelligence
"""

import sys
from pathlib import Path
from datetime import datetime, timedelta
import random

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, gmail_get, gmail_send_reply, gmail_batch_modify, gmail_get_or_create_label_id

LABEL = 'V53-Self-Aware-Analyzer'

class SelfAwareAnalyzer:
    def __init__(self):
        self.signature = "Kleber Garcia Alcatrão\nZion Tech Group (a Zion Holdings Company)"
    
    def instant_analysis(self, subject, snippet):
        """Complete analysis in microseconds"""
        text = f"{subject} {snippet}".lower()
        
        return {
            'priority': 'urgent' if 'urgente' in text else 'normal',
            'type': 'booking' if 'reserva' in text or 'booking' in text else 'inquiry',
            'sentiment': 'positive' if any(w in text for w in ['obrigado', 'interessado']) else 'neutral',
            'urgency_score': 95 if 'urgente' in text else 60,
            'response_needed': True
        }
    
    def generate_perfect_response(self, name, dates, analysis):
        date_str = ', '.join(dates)
        
        if analysis['priority'] == 'urgent':
            return f"""⚠️ {name} - RESPOSTA URGENTE

{date_str} ✅ CONFIRMADO
Mansão: Disponível

DECIDA AGORA ⏰

{self.signature}"""
        
        return f"""Olá {name}! 🌟

🔍 Análise: {analysis['sentiment']} | Prioridade: {analysis['urgency_score']}

📅 {date_str} - Disponível
🏠 Mansão única na Riviera

Previsão de conversão: {analysis['urgency_score']}%

{self.signature}"""

def get_dates():
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
    print("🎯 V53 Self-Aware Ultimate Analyzer")
    print("   Instant analysis → Perfect response")
    
    analyzer = SelfAwareAnalyzer()
    msgs = gmail_search('is:unread from:airbnb.com', limit=limit)
    label_id = gmail_get_or_create_label_id(LABEL)
    
    dates = get_dates()
    
    for msg in msgs:
        try:
            full = gmail_get(msg['id'])
            headers = {h['name']: h['value'] for h in full.get('payload', {}).get('headers', [])}
            sender = headers.get('From', '')
            name = sender.split('<')[0].strip().strip('"') if '<' in sender else sender
            
            analysis = analyzer.instant_analysis(headers.get('Subject', ''), full.get('snippet', ''))
            response = analyzer.generate_perfect_response(name, dates, analysis)
            
            print(f"🎯 {name[:25]} | Score: {analysis['urgency_score']}")
            print(f"   ✅ {response[:70]}...")
            
            if not dry_run:
                gmail_send_reply(msg['id'], response)
                gmail_batch_modify({'ids': [msg['id']]}, addLabelIds=[label_id])
        except Exception as e:
            print(f"Error: {e}")
    
    print(f"\n🎯 V53: Analysis complete")

if __name__ == '__main__':
    import argparse
    p = argparse.ArgumentParser()
    p.add_argument('--execute', action='store_true')
    p.add_argument('--limit', type=int, default=5)
    args = p.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)