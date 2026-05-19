#!/usr/bin/env python3
"""
V30 - Ultimate Optimized Email Intelligence
Lightweight, fast, memory-efficient responder
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
LABEL = 'V30-Ultimate-Optimized'

def cmd_run(dry_run=False, limit=5):
    print("🚀 V30 Ultimate Optimized Email Responder")
    print("   Features: Memory-efficient + Fast + Reliable")
    
    msgs = gmail_search('is:unread from:airbnb.com', limit=20)
    label_id = gmail_get_or_create_label_id(LABEL)
    
    stats = {'replied': 0, 'skipped': 0}
    
    for msg in msgs[:limit]:
        try:
            full = gmail_get(msg['id'])
            headers = {h['name']: h['value'] for h in full.get('payload', {}).get('headers', [])}
            sender = headers.get('From', '')
            subject = headers.get('Subject', '')
            
            name_part = sender.split('<')[0].strip().strip('"') if '<' in sender else sender
            
            # Simple, effective prompt
            today = datetime.now()
            avail_days = []
            for i in range(1, 4):
                d = today + timedelta(days=i)
                if d.weekday() < 5:
                    avail_days.append(d.strftime('%d/%m'))
            avail_text = ', '.join(avail_days)
            
            text = f"{subject}".lower()
            lang = 'pt' if any(w in text for w in ['reserva', 'consulta']) else 'en'
            
            prompt = f"Airbnb email about {subject}. Available: {avail_text}. Respond {'em português' if lang == 'pt' else 'in English'}."
            
            print(f"🚀 {name_part[:25]} | Generating...")
            
            payload = {
                "model": MODEL,
                "prompt": prompt,
                "system": "Professional assistant. Be concise and helpful.",
                "stream": False,
                "options": {"temperature": 0.6, "max_tokens": 150}
            }
            
            req = urllib.request.Request(OLLAMA_URL, data=json.dumps(payload).encode(),
                                          headers={'Content-Type': 'application/json'})
            with urllib.request.urlopen(req, timeout=45) as response:
                reply = json.loads(response.read().decode()).get('response', '').strip()
            
            if reply:
                stats['replied'] += 1
                print(f"   ✅ {reply[:70]}...")
                
                if not dry_run:
                    gmail_send_reply(msg['id'], reply)
                    gmail_batch_modify({'ids': [msg['id']]}, addLabelIds=[label_id])
            else:
                stats['skipped'] += 1
                print(f"   Failed")
                
        except Exception as e:
            print(f"Error: {e}")
            stats['skipped'] += 1
            continue
    
    print(f"\n📊 Replied: {stats['replied']} | Skipped: {stats['skipped']}")

if __name__ == '__main__':
    import argparse
    p = argparse.ArgumentParser()
    p.add_argument('--execute', action='store_true')
    p.add_argument('--limit', type=int, default=5)
    args = p.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)