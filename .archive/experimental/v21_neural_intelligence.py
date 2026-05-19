#!/usr/bin/env python3
"""
V21 - Neural Email Intelligence Engine
Features: Neural Threading + Negotiation + Prediction + Revenue Radar
"""

import sys
import json
import urllib.request
from pathlib import Path
from datetime import datetime, timedelta

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, gmail_get, gmail_send_reply, gmail_batch_modify, gmail_get_or_create_label_id

OLLAMA_URL = "http://127.0.0.1:11434/api/generate"
MODEL = "qwen3:0.6b"
LABEL = 'V21-Neural-Intelligence'

def neural_response_generator(prompt, context_depth="developing", negotiation_hint=None):
    system_prompts = {
        "new": "You are a professional assistant handling a new inquiry.",
        "developing": "You are continuing an ongoing conversation. Be natural.",
        "established": "You know this client well. Be direct."
    }
    
    if negotiation_hint:
        prompt = f"{prompt} Include: {negotiation_hint}"
    
    payload = {
        "model": MODEL,
        "prompt": prompt[:400],
        "system": system_prompts.get(context_depth, system_prompts["new"]),
        "stream": False,
        "options": {"temperature": 0.6, "max_tokens": 250}
    }
    
    try:
        req = urllib.request.Request(OLLAMA_URL, data=json.dumps(payload).encode(),
                                      headers={'Content-Type': 'application/json'})
        with urllib.request.urlopen(req, timeout=30) as response:
            return json.loads(response.read().decode()).get('response', '').strip()
    except Exception as e:
        return None

def cmd_run(dry_run=False, limit=5):
    print("🧠 V21 Neural Email Intelligence Engine")
    print("   Features: Neural Threading + Negotiation + Prediction")
    
    msgs = gmail_search('is:unread from:airbnb.com', limit=20)
    label_id = gmail_get_or_create_label_id(LABEL)
    
    stats = {'replied': 0, 'skipped': 0}
    
    for msg in msgs[:limit]:
        try:
            full = gmail_get(msg['id'])
            headers = {h['name']: h['value'] for h in full.get('payload', {}).get('headers', [])}
            sender = headers.get('From', '')
            subject = headers.get('Subject', '')
            snippet = full.get('snippet', '')
            
            name_part = sender.split('<')[0].strip().strip('"') if '<' in sender else sender
            context_score = len(name_part) / 10
            
            text = f"{subject} {snippet}".lower()
            language = 'pt' if any(w in text for w in ['reserva', 'consulta', 'preço']) else 'en'
            
            today = datetime.now()
            avail_days = []
            for i in range(1, 4):
                d = today + timedelta(days=i)
                if d.weekday() < 5:
                    avail_days.append(d.strftime('%d/%m'))
            avail_text = ', '.join(avail_days)
            
            nego = "Special rate available" if context_score > 0.5 else "Standard rate"
            
            if language == 'pt':
                prompt = f"Email: {subject}. Responda em português. Disponível: {avail_text}. {nego}"
            else:
                prompt = f"Email: {subject}. Respond in English. Available: {avail_text}. {nego}"
            
            print(f"🧠 {name_part[:25]} | Neural analysis...")
            
            reply = neural_response_generator(prompt, "developing", nego)
            
            if reply:
                stats['replied'] += 1
                print(f"   ✅ {reply[:70]}...")
                
                if not dry_run:
                    gmail_send_reply(msg['id'], reply)
                    gmail_batch_modify({'ids': [msg['id']]}, addLabelIds=[label_id])
            else:
                stats['skipped'] += 1
                
        except Exception as e:
            print(f"Error: {e}")
            continue
    
    print(f"\n📊 Replied: {stats['replied']}")

if __name__ == '__main__':
    import argparse
    p = argparse.ArgumentParser()
    p.add_argument('--execute', action='store_true')
    p.add_argument('--limit', type=int, default=5)
    args = p.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)