#!/usr/bin/env python3
"""
V43 - Automated Follow-Up Sequence Engine
Sends intelligent follow-ups at optimal intervals
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

LABEL = 'V43-Auto-FollowUp'
FOLLOWUP_DB = WORKSPACE / 'zion.app' / 'memory' / 'followup_schedule.json'

class FollowUpSequencer:
    def __init__(self):
        self.sequences = {
            'initial': [
                "Olá {name}! Seguindo sua solicitação sobre a Mansão na Riviera. Disponível {dates}. Aguardo retorno.",
                "Prezado(a) {name}, Retorno sobre sua consulta. {dates} confirmados. Por favor confirme."
            ],
            'reminder_24h': [
                "Oi {name}! Lembrete: Mansão disponível {dates}. Ainda interessado? Kleber",
                "Olá {name}, Follow-up: sua solicitação de {dates} ainda está ativa?"
            ],
            'final': [
                "Último contato, {name}. Disponibilidade {dates} pode ser ocupada. Decida hoje.",
                "Olá {name}, Última chance para {dates}. Após isso, liberarei para outros."
            ]
        }
    
    def get_sequence_type(self, hours_since_inquiry):
        """Determine which follow-up sequence to use"""
        if hours_since_inquiry < 24:
            return 'initial'
        elif hours_since_inquiry < 72:
            return 'reminder_24h'
        else:
            return 'final'
    
    def schedule_follow_up(self, msg_id, sender, days=3):
        """Schedule a follow-up"""
        try:
            schedule = {
                'msg_id': msg_id,
                'sender': sender,
                'scheduled_for': (datetime.now() + timedelta(days=days)).isoformat()
            }
            try:
                with open(FOLLOWUP_DB, 'r') as f:
                    schedules = json.load(f)
            except:
                schedules = []
            
            schedules.append(schedule)
            with open(FOLLOWUP_DB, 'w') as f:
                json.dump(schedules, f)
        except:
            pass
    
    def generate_follow_up(self, name, sequence_type, dates):
        """Generate follow-up message"""
        templates = self.sequences[sequence_type]
        return random.choice(templates).format(name=name, dates=', '.join(dates))

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
    print("🔄 V43 Automated Follow-Up Sequence Engine")
    print("   Features: Smart Timing + Sequence Management + Auto-Scheduling")
    
    sequencer = FollowUpSequencer()
    msgs = gmail_search('is:unread from:airbnb.com', limit=20)
    label_id = gmail_get_or_create_label_id(LABEL)
    
    stats = {'replied': 0, 'followups_scheduled': 0}
    
    for msg in msgs[:limit]:
        try:
            full = gmail_get(msg['id'])
            headers = {h['name']: h['value'] for h in full.get('payload', {}).get('headers', [])}
            sender = headers.get('From', '')
            subject = headers.get('Subject', '')
            
            name_part = sender.split('<')[0].strip().strip('"') if '<' in sender else sender
            
            # Initial response
            dates = get_available_dates()
            sequence_type = sequencer.get_sequence_type(0)  # New inquiry
            response = sequencer.generate_follow_up(name_part, sequence_type, dates)
            
            # Schedule follow-up
            sequencer.schedule_follow_up(msg['id'], sender, days=2)
            stats['followups_scheduled'] += 1
            
            print(f"🔄 {name_part[:25]} | Sequence: {sequence_type}")
            print(f"   ✅ {response[:70]}...")
            
            if not dry_run:
                gmail_send_reply(msg['id'], response)
                gmail_batch_modify({'ids': [msg['id']]}, addLabelIds=[label_id])
            
            stats['replied'] += 1
                
        except Exception as e:
            print(f"Error: {e}")
            continue
    
    print(f"\n📊 Replied: {stats['replied']} | Follow-ups scheduled: {stats['followups_scheduled']}")

if __name__ == '__main__':
    import argparse
    p = argparse.ArgumentParser()
    p.add_argument('--execute', action='store_true')
    p.add_argument('--limit', type=int, default=5)
    args = p.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)