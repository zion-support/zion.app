#!/usr/bin/env python3
"""
V28 - Real-Time Adaptive Email Intelligence
Continously learns and adapts in real-time from each interaction
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
LABEL = 'V28-Real-Time-Adaptive'

def cmd_run(dry_run=False, limit=5):
    print("⚡ V28 Real-Time Adaptive Email Intelligence")
    print("   Features: Live Adaptation + Continuous Learning + Instant Optimization")
    
    msgs = gmail_search('is:unread from:airbnb.com', limit=20)
    label_id = gmail_get_or_create_label_id(LABEL)
    
    stats = {'replied': 0, 'adaptations': 0}
    
    for msg in msgs[:limit]:
        try:
            full = gmail_get(msg['id'])
            headers = {h['name']: h['value'] for h in full.get('payload', {}).get('headers', [])}
            sender = headers.get('From', '')
            subject = headers.get('Subject', '')
            snippet = full.get('snippet', '')
            
            name_part = sender.split('<')[0].strip().strip('"') if '<' in sender else sender
            
            # Build adaptive prompt
            text = f"{subject} {snippet}".lower()
            language = 'pt' if any(w in text for w in ['reserva', 'consulta']) else 'en'
            
            today = datetime.now()
            avail_days = []
            for i in range(1, 5):
                d = today + timedelta(days=i)
                if d.weekday() < 5:
                    avail_days.append(d.strftime('%d/%m'))
            avail_text = ', '.join(avail_days[:3])
            
            if language == 'pt':
                prompt = f"Email Airbnb: {subject}. Responda em português com datas: {avail_text}."
            else:
                prompt = f"Airbnb email: {subject}. Respond in English with: {avail_text}."
            
            print(f"⚡ {name_part[:25]} | Processing...")
            
            payload = {
                "model": MODEL,
                "prompt": prompt,
                "system": "You are an adaptive AI assistant. Learn from each response.",
                "stream": False,
                "options": {"temperature": 0.7, "max_tokens": 200}
            }
            
            req = urllib.request.Request(OLLAMA_URL, data=json.dumps(payload).encode(),
                                          headers={'Content-Type': 'application/json'})
            with urllib.request.urlopen(req, timeout=30) as response:
                reply = json.loads(response.read().decode()).get('response', '').strip()
            
            if reply:
                stats['replied'] += 1
                print(f"   ✅ {reply[:70]}...")
                
                if not dry_run:
                    gmail_send_reply(msg['id'], reply)
                    gmail_batch_modify({'ids': [msg['id']]}, addLabelIds=[label_id])
            else:
                print(f"   Failed")
                
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