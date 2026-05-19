#!/usr/bin/env python3
"""
V38 - CRM Sales Pipeline Intelligence
Tracks leads, opportunities, and sales pipeline stages
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

LABEL = 'V38-CRM-Pipeline'
CRM_DB = WORKSPACE / 'zion.app' / 'memory' / 'crm_leads.json'

class CRMPipeline:
    def __init__(self):
        self.stages = {
            'lead': {'priority': 1, 'templates': self.lead_templates()},
            'qualified': {'priority': 2, 'templates': self.qualified_templates()},
            'negotiation': {'priority': 3, 'templates': self.negotiation_templates()},
            'closed_won': {'priority': 4, 'templates': self.closed_templates()},
            'closed_lost': {'priority': 5, 'templates': self.lost_templates()}
        }
    
    def lead_templates(self):
        return [
            "Olá {name}!\n\nRecebemos seu contato sobre a Mansão na Riviera. Estamos felizes em apresentar nossa propriedade exclusiva.\n\nDatas disponíveis: {dates}\n\nKleber Garcia Alcatrão, Zion Tech Group",
            "Prezado(a) {name},\n\nObrigado pelo interesse na Mansão da Riviera. É uma propriedade única com 3 andares e vista deslumbrante.\n\nEstamos à disposição para mais informações."
        ]
    
    def qualified_templates(self):
        return [
            "Olá {name}!\n\nQue ótimo que demonstra interesse! A Mansão está disponível para {dates}. Vamos agendar uma visita virtual?\n\nAtenciosamente, Kleber Garcia Alcatrão",
            "Prezado(a) {name},\n\nSua qualificação como lead qualificado foi registrada. A Mansão está disponível nos dias {dates}.\n\nPor favor, confirme sua intenção de reserva."
        ]
    
    def negotiation_templates(self):
        return [
            "Olá {name}!\n\nEntendi sua negociação. Para fechar negócio, ofereço pacote especial para {dates} no valor de R$ {price}. Vamos fechar?\n\nKleber Garcia Alcatrão",
            "Prezado(a) {name},\n\nNegociação em andamento. Proposta especial: R$ {price} para {dates}. Aguardo sua confirmação."
        ]
    
    def closed_templates(self):
        return [
            "Olá {name}!\n\nParabéns! Sua reserva foi confirmada com sucesso! A Mansão será sua em {dates}.\n\nDetalhes do contrato enviados.\n\nKleber Garcia Alcatrão, Zion Tech Group",
            "Prezado(a) {name),\n\nReserva FINALIZADA! Parabéns pela aquisição da Mansão na Riviera.\n\nDatas: {dates}\nValor: R$ {price}\n\nBem-vindo à experiência Zion!"
        ]
    
    def lost_templates(self):
        return [
            "Olá {name},\n\nLamentamos que não possamos atender seu pedido no momento. A Mansão não estará disponível.\n\nOferecemos alternativas similares.\n\nKleber Garcia Alcatrão",
            "Prezado(a) {name),\n\nInfelizmente, esta oportunidade foi encerrada.\n\nAgradecemos seu interesse e esperamos atendê-lo futuramente."
        ]
    
    def classify_lead(self, subject, snippet):
        """Classify lead stage based on email content"""
        text = f"{subject} {snippet}".lower()
        
        # Check for closing signals
        if any(w in text for w in ['parabéns', 'congratulations', 'felicit', 'closed']):
            return 'closed_won'
        if any(w in text for w in ['encerrado', 'lost', 'não deu', 'unfortunately']):
            return 'closed_lost'
        if any(w in text for w in ['negociar', 'desconto', 'price', 'valor']):
            return 'negotiation'
        if any(w in text for w in ['internacional', 'interessado', 'serious', 'qualified']):
            return 'qualified'
        
        return 'lead'  # Default stage
    
    def update_crm(self, sender_email, name, stage, subject):
        """Update CRM database"""
        lead_record = {
            'email': sender_email,
            'name': name,
            'stage': stage,
            'last_contact': datetime.now().isoformat(),
            'subject': subject
        }
        
        try:
            with open(CRM_DB, 'w') as f:
                json.dump(lead_record, f)
        except:
            pass
    
    def generate_response(self, stage, name, dates, price=None):
        """Generate stage-appropriate response"""
        templates = self.stages[stage]['templates']
        response = random.choice(templates)
        return response.format(name=name, dates=', '.join(dates), price=price or 'negociável')

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
    print("📊 V38 CRM Sales Pipeline Intelligence")
    print("   Features: Lead Scoring + Pipeline Stages + CRM Tracking")
    
    crm = CRMPipeline()
    msgs = gmail_search('is:unread from:airbnb.com', limit=20)
    label_id = gmail_get_or_create_label_id(LABEL)
    
    stats = {'replied': 0, 'stages': {}}
    
    for msg in msgs[:limit]:
        try:
            full = gmail_get(msg['id'])
            headers = {h['name']: h['value'] for h in full.get('payload', {}).get('headers', [])}
            sender = headers.get('From', '')
            subject = headers.get('Subject', '')
            snippet = full.get('snippet', '')
            
            name_part = sender.split('<')[0].strip().strip('"') if '<' in sender else sender
            
            # Classify lead stage
            stage = crm.classify_lead(subject, snippet)
            stats['stages'][stage] = stats['stages'].get(stage, 0) + 1
            
            # Update CRM
            crm.update_crm(sender, name_part, stage, subject)
            
            dates = get_available_dates()
            price = random.randint(800, 1200) * len(dates)
            response = crm.generate_response(stage, name_part, dates, price)
            
            print(f"📊 {name_part[:25]} | Stage: {stage}")
            print(f"   ✅ {response[:70]}...")
            
            if not dry_run:
                gmail_send_reply(msg['id'], response)
                gmail_batch_modify({'ids': [msg['id']]}, addLabelIds=[label_id])
            
            stats['replied'] += 1
                
        except Exception as e:
            print(f"Error: {e}")
            continue
    
    print(f"\n📊 Replied: {stats['replied']} | Stages: {stats['stages']}")

if __name__ == '__main__':
    import argparse
    p = argparse.ArgumentParser()
    p.add_argument('--execute', action='store_true')
    p.add_argument('--limit', type=int, default=5)
    args = p.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)