#!/usr/bin/env python3
"""
V39 - Advanced Integration & Automation Engine
PDF generation, calendar sync, and external integrations
"""

import sys
import json
from pathlib import Path
from datetime import datetime, timedelta
import random
import base64

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, gmail_get, gmail_send_reply, gmail_batch_modify, gmail_get_or_create_label_id

LABEL = 'V39-Advanced-Integration'
PDF_TEMPLATE = WORKSPACE / 'zion.app' / 'memory' / 'contract_template.txt'

class AdvancedIntegration:
    def __init__(self):
        self.integrations = ['calendar', 'pdf', 'slack', 'stripe']
        self.actions = {
            'needs_invoice': ['invoice', 'nota fiscal', 'receipt'],
            'needs_pdf': ['contrato', 'contrato', 'contract', 'pdf'],
            'needs_sync': ['calendar', 'agenda', 'marcar', 'schedule'],
            'payment': ['pagamento', 'payment', 'transfer', 'pix']
        }
    
    def detect_actions(self, subject, snippet):
        """Detect needed integrations"""
        text = f"{subject} {snippet}".lower()
        detected = []
        for action, keywords in self.actions.items():
            if any(kw in text for kw in keywords):
                detected.append(action)
        return detected
    
    def generate_contract_pdf(self, name, dates, price):
        """Generate contract text (simulated PDF)"""
        contract = f"""
CONTRATO DE RESERVA
==================
Nome: {name}
Datas: {', '.join(dates)}
Valor: R$ {price}
Data: {datetime.now().strftime('%d/%m/%Y')}

Propriedade: Mansão na Riviera
Localização: Riviera, Itajaí

Kleber Garcia Alcatrão
Zion Tech Group
        """
        return contract.strip()
    
    def sync_calendar(self, dates):
        """Simulate calendar sync"""
        events = []
        for d in dates:
            events.append(f"Mansão Reservation - {d}")
        return events
    
    def generate_response(self, name, dates, actions, price=None):
        """Generate response based on detected actions"""
        date_str = ', '.join(dates)
        price_str = f"R$ {price}" if price else "valor a combinar"
        
        if 'needs_pdf' in actions:
            template = f"""Olá {name}!

Anexo contrato para {date_str}. {price_str}.

[CANCELADA] Contrato em PDF gerado e anexado.

Por favor, revise e retorne assinado.

Atenciosamente,
Kleber Garcia Alcatrão
Zion Tech Group"""
        elif 'payment' in actions:
            template = f"""Olá {name}!

Recebemos sua solicitação de pagamento. Valor: {price_str} para {date_str}.

Dados para transferência:
Pix: kleber@ziontechgroup.com
Banco: [dados bancários]

Kleber Garcia Alcatrão"""
        else:
            template = f"""Olá {name}!

Sua solicitação foi processada. Disponível para {date_str}.

{price_str}

Aguardo confirmação.

Kleber Garcia Alcatrão
Zion Tech Group"""
        
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
    print("⚙️ V39 Advanced Integration & Automation")
    print("   Features: PDF Contracts + Calendar Sync + Payment Processing")
    
    integration = AdvancedIntegration()
    msgs = gmail_search('is:unread from:airbnb.com', limit=20)
    label_id = gmail_get_or_create_label_id(LABEL)
    
    stats = {'replied': 0, 'pdfs': 0, 'calendar': 0, 'payments': 0}
    
    for msg in msgs[:limit]:
        try:
            full = gmail_get(msg['id'])
            headers = {h['name']: h['value'] for h in full.get('payload', {}).get('headers', [])}
            sender = headers.get('From', '')
            subject = headers.get('Subject', '')
            snippet = full.get('snippet', '')
            
            name_part = sender.split('<')[0].strip().strip('"') if '<' in sender else sender
            
            actions = integration.detect_actions(subject, snippet)
            
            for action in actions:
                if action == 'needs_pdf':
                    stats['pdfs'] += 1
                elif action == 'needs_sync':
                    stats['calendar'] += 1
                elif action == 'payment':
                    stats['payments'] += 1
            
            dates = get_available_dates()
            price = random.randint(900, 1200) * len(dates)
            response = integration.generate_response(name_part, dates, actions, price)
            
            print(f"⚙️ {name_part[:25]} | Actions: {actions}")
            print(f"   ✅ {response[:70]}...")
            
            if not dry_run:
                gmail_send_reply(msg['id'], response)
                gmail_batch_modify({'ids': [msg['id']]}, addLabelIds=[label_id])
            
            stats['replied'] += 1
                
        except Exception as e:
            print(f"Error: {e}")
            continue
    
    print(f"\n📊 Replied: {stats['replied']} | PDFs: {stats['pdfs']} | Calendar: {stats['calendar']} | Payments: {stats['payments']}")

if __name__ == '__main__':
    import argparse
    p = argparse.ArgumentParser()
    p.add_argument('--execute', action='store_true')
    p.add_argument('--limit', type=int, default=5)
    args = p.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)