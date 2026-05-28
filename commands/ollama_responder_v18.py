#!/usr/bin/env python3
"""
Ollama-Powered Email Responder V18 - Fast model
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
OLLAMA_MODEL = "qwen3:0.6b"  # Faster, smaller model
LABEL_DONE = 'Autonomous-Ollama-V18'

def generate_ollama_reply(prompt, system_prompt=None, max_retries=2):
    """Generate reply using local Ollama LLM"""
    payload = {
        "model": OLLAMA_MODEL,
        "prompt": prompt[:500],
        "system": system_prompt or "You are a professional assistant.",
        "stream": False,
        "options": {"temperature": 0.7, "max_tokens": 200}
    }
    
    data = json.dumps(payload).encode()
    req = urllib.request.Request(OLLAMA_URL, data=data,
                                  headers={'Content-Type': 'application/json'})
    
    try:
        with urllib.request.urlopen(req, timeout=30) as response:
            result = json.loads(response.read().decode())
            return result.get('response', '').strip()
    except Exception as e:
        print(f"   LLM error: {e}")
        return None

def cmd_run(dry_run=False, limit=3):
    print("🤖 Ollama-Powered Email Responder V18 (qwen3:0.6b)")
    
    msgs = gmail_search('is:unread from:airbnb.com', limit=20)
    label_id = gmail_get_or_create_label_id(LABEL_DONE)
    
    stats = {'replied': 0, 'skipped': 0}
    
    for msg in msgs[:limit]:
        try:
            full = gmail_get(msg['id'])
            headers = {h['name']: h['value'] for h in full.get('payload', {}).get('headers', [])}
            sender = headers.get('From', '')
            subject = headers.get('Subject', '')
            
            # Get calendar availability
            today = datetime.now()
            available = []
            for i in range(1, 8):
                d = today + timedelta(days=i)
                if d.weekday() < 5:
                    available.append(d.strftime('%d/%m'))
                if len(available) >= 3:
                    break
            avail_text = ', '.join(available)
            
            # Detect language
            text = f"{subject}".lower()
            pt_count = sum(1 for w in ['reserva', 'consulta', 'responder', 'airbnb'] if w in text)
            language = 'pt' if pt_count > 0 else 'en'
            
            # Build prompt
            if language == 'pt':
                prompt = f"Email Airbnb: {subject}. Responda em português mencionando disponibilidade: {avail_text}."
            else:
                prompt = f"Airbnb email: {subject}. Respond in English with available days: {avail_text}."
            
            print(f"📧 {sender[:30]} | Generating...")
            
            reply = generate_ollama_reply(prompt)
            
            if reply:
                stats['replied'] += 1
                print(f"   Reply: {reply[:80]}...")
                if not dry_run:
                    gmail_send_reply(msg['id'], reply)
                    gmail_batch_modify({'ids': [msg['id']]}, addLabelIds=[label_id])
            else:
                stats['skipped'] += 1
                print(f"   Failed")
                
        except Exception as e:
            print(f"Error: {e}")
            continue
    
    print(f"\n📊 Replied: {stats['replied']} | Skipped: {stats['skipped']}")

if __name__ == '__main__':
    import argparse
    p = argparse.ArgumentParser()
    p.add_argument('--execute', action='store_true')
    p.add_argument('--limit', type=int, default=3)
    args = p.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)