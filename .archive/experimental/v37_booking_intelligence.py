#!/usr/bin/env python3
"""
V37 - Price Negotiation & Booking Intelligence
Handles pricing, negotiations, and booking confirmations
"""

import sys
from pathlib import Path
from datetime import datetime, timedelta
import random

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, gmail_get, gmail_send_reply, gmail_batch_modify, gmail_get_or_create_label_id

LABEL = 'V37-Booking-Intelligence'

class PriceNegotiator:
    def __init__(self):
        self.base_rates = {
            'weekday': {'high': 1200, 'standard': 900, 'low': 700},
            'weekend': {'high': 1500, 'standard': 1100, 'low': 800}
        }
    
    def detect_booking_intent(self, subject, snippet):
        """Detect booking negotiation signals"""
        text = f"{subject} {snippet}".lower()
        signals = {
            'negotiation': any(w in text for w in ['desconto', 'desconta', 'discount', 'negociar', 'price']),
            'confirmation': any(w in text for w in ['confirmar', 'confirm', 'fechar', 'closing']),
            'inquiry': any(w in text for w in ['quanto', 'valor', 'price', 'how much'])
        }
        return signals
    
    def calculate_price(self, days, is_weekend=False, negotiation=False):
        """Calculate dynamic pricing"""
        base = self.base_rates['weekend' if is_weekend else 'weekday']['standard']
        if negotiation:
            base *= 0.85  # 15% discount for negotiation
        return base * len(days)
    
    def generate_booking_response(self, name, intent, dates):
        """Generate booking-aware response"""
        day_count = len(dates)
        is_weekend = any(datetime.strptime(d, '%d/%m').weekday() >= 5 for d in dates)
        price = self.calculate_price(dates, is_weekend, intent.get('negotiation', False))
        
        responses = {
            'negotiation': [
                f"Olá {name}!\n\nEntendo sua solicitação de desconto. Para {day_count} dias ({', '.join(dates)}), ofereço R$ {price:.0f} (15% de desconto).\n\nVamos fechar?",
                f"Prezado(a) {name},\n\nNegociação aceita! Valor especial: R$ {price:.0f} para {day_count} dias. Confirmamos disponibilidade."
            ],
            'confirmation': [
                f"Olá {name}!\n\nPerfeito! Confirmando sua reserva para {day_count} dias ({', '.join(dates)}).\n\nTotal: R$ {price:.0f}\n\nPor favor confirme.",
                f"Prezado(a) {name},\n\nReserva confirmada! {day_count} dias no total de R$ {price:.0f}. Estamos à disposição."
            ],
            'inquiry': [
                f"Olá {name}!\n\nPara {day_count} dias ({', '.join(dates)}) nossa taxa é R$ {price:.0f}.\n\nInclui limpeza e Wi-Fi premium.",
                f"Prezado(a) {name},\n\nValor para {day_count} dias: R$ {price:.0f}. Pacote completo com todas as comodidades."
            ]
        }
        
        for key in ['negotiation', 'confirmation', 'inquiry']:
            if intent.get(key):
                return random.choice(responses[key])
        return f"Olá {name},\n\nDisponível para {', '.join(dates)}. Valor: R$ {price:.0f}.\n\nKleber Garcia Alcatrão"

def get_available_dates():
    today = datetime.now()
    dates = []
    for i in range(1, 8):
        d = today + timedelta(days=i)
        if d.weekday() < 5:
            dates.append(d.strftime('%d/%m'))
        if len(dates) >= 4:
            break
    return dates

def cmd_run(dry_run=False, limit=5):
    print("💰 V37 Price Negotiation & Booking Intelligence")
    print("   Features: Dynamic Pricing + Negotiation + Booking Confirmation")
    
    negotiator = PriceNegotiator()
    msgs = gmail_search('is:unread from:airbnb.com', limit=20)
    label_id = gmail_get_or_create_label_id(LABEL)
    
    stats = {'replied': 0, 'negotiations': 0, 'confirmations': 0}
    
    for msg in msgs[:limit]:
        try:
            full = gmail_get(msg['id'])
            headers = {h['name']: h['value'] for h in full.get('payload', {}).get('headers', [])}
            sender = headers.get('From', '')
            subject = headers.get('Subject', '')
            snippet = full.get('snippet', '')
            
            name_part = sender.split('<')[0].strip().strip('"') if '<' in sender else sender
            
            # Detect intent
            intent = negotiator.detect_booking_intent(subject, snippet)
            if intent['negotiation']:
                stats['negotiations'] += 1
            if intent['confirmation']:
                stats['confirmations'] += 1
            
            dates = get_available_dates()
            response = negotiator.generate_booking_response(name_part, intent, dates)
            
            print(f"💰 {name_part[:25]} | Nego: {intent['negotiation']} | Conf: {intent['confirmation']}")
            print(f"   ✅ {response[:70]}...")
            
            if not dry_run:
                gmail_send_reply(msg['id'], response)
                gmail_batch_modify({'ids': [msg['id']]}, addLabelIds=[label_id])
            
            stats['replied'] += 1
                
        except Exception as e:
            print(f"Error: {e}")
            continue
    
    print(f"\n📊 Replied: {stats['replied']} | Negotiations: {stats['negotiations']} | Confirmations: {stats['confirmations']}")

if __name__ == '__main__':
    import argparse
    p = argparse.ArgumentParser()
    p.add_argument('--execute', action='store_true')
    p.add_argument('--limit', type=int, default=5)
    args = p.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)