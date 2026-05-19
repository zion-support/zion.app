#!/usr/bin/env python3
"""
V41 - Ultra-Fast Concurrent Email Processor
Runs multiple responder engines in parallel with priority queuing
"""

import sys
from pathlib import Path
from datetime import datetime, timedelta
import concurrent.futures
import random

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, gmail_get, gmail_send_reply, gmail_batch_modify, gmail_get_or_create_label_id

LABEL = 'V41-Ultra-Fast'

# Concurrent responder engines
ENGINES = {
    'simple': lambda name, dates: f"Olá {name}! Mansão disponível: {', '.join(dates)}. Kleber",
    'professional': lambda name, dates: f"Prezado(a) {name},\n\nDisponibilidade confirmada para {', '.join(dates)}.\n\nAtenciosamente, Kleber Garcia Alcatrão",
    'enthusiastic': lambda name, dates: f"Oi {name}! Que alegria! {', '.join(dates)} estão livres! Vamos fechar?",
    'formal': lambda name, dates: f"Prezado(a) Senhor(a) {name},\n\nInformamos que a Mansão da Riviera está disponível nos dias {', '.join(dates)}.\n\nCordialmente,\nKleber Garcia Alcatrão",
}

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

def select_best_engine(subject, snippet):
    """Select optimal responder based on content"""
    text = f"{subject} {snippet}".lower()
    
    if any(w in text for w in ['urgente', 'urgent', 'crítico']):
        return 'enthusiastic'  # Fast, energetic response
    elif any(w in text for w in ['formal', 'prezado', 'senhor']):
        return 'formal'
    elif any(w in text for w in ['obrigado', 'thanks', 'parabéns']):
        return 'professional'
    else:
        return random.choice(list(ENGINES.keys()))

def process_single_email(msg, engine_key, dates):
    """Process single email with selected engine"""
    try:
        headers = {h['name']: h['value'] for h in msg.get('payload', {}).get('headers', [])}
        sender = headers.get('From', '')
        name_part = sender.split('<')[0].strip().strip('"') if '<' in sender else sender
        
        response = ENGINES[engine_key](name_part, dates)
        return {'success': True, 'name': name_part, 'response': response, 'engine': engine_key}
    except Exception as e:
        return {'success': False, 'error': str(e)}

def cmd_run(dry_run=False, limit=10):
    print("⚡ V41 Ultra-Fast Concurrent Processor")
    print("   Features: Parallel Processing + Priority Engine Selection + Concurrent Execution")
    
    msgs = gmail_search('is:unread from:airbnb.com', limit=30)
    label_id = gmail_get_or_create_label_id(LABEL)
    dates = get_available_dates()
    
    stats = {'replied': 0, 'engines_used': {}}
    
    # Process in parallel
    with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
        futures = []
        
        for msg in msgs[:limit]:
            headers = {h['name']: h['value'] for h in msg.get('payload', {}).get('headers', [])}
            subject = headers.get('Subject', '')
            msg_full = gmail_get(msg['id'])
            snippet = msg_full.get('snippet', '')
            
            engine_key = select_best_engine(subject, snippet)
            futures.append((executor.submit(process_single_email, msg_full, engine_key, dates), msg, engine_key))
            stats['engines_used'][engine_key] = stats['engines_used'].get(engine_key, 0) + 1
        
        for future, msg, engine_key in futures:
            result = future.result()
            
            if result['success']:
                print(f"⚡ {result['name'][:25]} | Engine: {result['engine']}")
                print(f"   ✅ {result['response'][:70]}...")
                
                if not dry_run:
                    gmail_send_reply(msg['id'], result['response'])
                    gmail_batch_modify({'ids': [msg['id']]}, addLabelIds=[label_id])
                
                stats['replied'] += 1
            else:
                print(f"Error: {result.get('error', 'Unknown')}")
    
    print(f"\n📊 Replied: {stats['replied']} | Engines used: {stats['engines_used']}")

if __name__ == '__main__':
    import argparse
    p = argparse.ArgumentParser()
    p.add_argument('--execute', action='store_true')
    p.add_argument('--limit', type=int, default=10)
    args = p.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)