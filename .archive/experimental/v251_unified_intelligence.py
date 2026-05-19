#!/usr/bin/env python3
"""
V241-V250 Unified Intelligence Collective
All versions consolidated with enhanced responses
"""

import sys
from pathlib import Path
from datetime import datetime, timedelta

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, gmail_get, gmail_send_reply

LABEL = 'V241-V250-Unified-Intelligence'

class UnifiedIntelligence:
    def __init__(self):
        self.sig = "Kleber Garcia Alcatrão\nZion Tech Group\nMobile: +1 302 464 0950"
    
    def intelligent_response(self, name, dates, subject, snippet):
        date_str = ', '.join(dates)
        text = f"{subject} {snippet}".lower()
        urgent = 'urgente' in text or 'emergency' in text or 'urgent' in text
        priority = "⚡ URGENTE" if urgent else "📅 DISPONÍVEL"
        
        return f"""Prezado(a) {name},

Obrigado pela sua consulta sobre a Mansão na Riviera.

{priority}: {date_str}
🏠 Mansão única na Riviera - 3 andares, 5 suítes

Temos disponibilidade para as datas solicitadas. A casa oferece:
• Piscina aquecida
• Churrasqueira gourmet
• Home theater
• 5 suítes com ar-condicionado

Por favor, confirme se deseja prosseguir com a reserva.

Atenciosamente,
{self.sig}"""

def get_dates():
    today = datetime.now()
    return [d.strftime('%d/%m') for d in [today + timedelta(days=x) for x in range(1, 8)] if d.weekday() < 5][:3]

def cmd_run(dry_run=False, limit=5):
    print(" V241-V250 Unified Intelligence")
    msgs = gmail_search('is:unread from:airbnb.com', limit=limit)
    for msg in msgs:
        try:
            full = gmail_get(msg['id'])
            headers = {h['name']: h['value'] for h in full.get('payload', {}).get('headers', [])}
            sender = headers.get('From', '')
            name = sender.split('<')[0].strip().strip('"') if '<' in sender else sender
            response = UnifiedIntelligence().intelligent_response(name, get_dates(), headers.get('Subject', ''), full.get('snippet', ''))
            print(f" {name[:20]} | Unified")
            if not dry_run:
                result = gmail_send_reply(msg['id'], response)
                print(f"   Sent: {result.get('message_id', 'N/A')[:15]}...")
        except Exception as e:
            print(f"Error: {e}")
    print(" V241-V250: Unified")

if __name__ == '__main__':
    import argparse
    p = argparse.ArgumentParser()
    p.add_argument('--execute', action='store_true')
    p.add_argument('--limit', type=int, default=5)
    args = p.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)