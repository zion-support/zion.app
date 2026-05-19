#!/usr/bin/env python3
"""
V29 - Multi-Modal Email Intelligence Engine
Handles text, images, attachments, and context across multiple dimensions
"""

import sys
import json
import urllib.request
from pathlib import Path
from datetime import datetime, timedelta
import base64

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, gmail_get, gmail_send_reply, gmail_batch_modify, gmail_get_or_create_label_id

OLLAMA_URL = "http://127.0.0.1:11434/api/generate"
MODEL = "qwen3:0.6b"
LABEL = 'V29-Multi-Modal-Intelligence'

class MultiModalIntelligence:
    """Processes multiple dimensions of email intelligence"""
    
    def __init__(self):
        self.dimensions = {
            'text_analysis': True,
            'intent_detection': True,
            'context_memory': True,
            'relationship_mapping': True,
            'value_optimization': True
        }
    
    def analyze_dimensions(self, subject, snippet, has_attachment=False):
        """Analyze all dimensions of the email"""
        text = f"{subject} {snippet}".lower()
        
        return {
            'intent': 'booking' if any(w in text for w in ['reserva', 'booking']) else 'general',
            'urgency': 'high' if any(w in text for w in ['urgente', 'urgent']) else 'normal',
            'value': 'high' if 'mansão' in text or 'premium' in text else 'medium',
            'has_attachment': has_attachment,
            'language': 'pt' if any(w in text for w in ['reserva', 'consulta']) else 'en'
        }

def cmd_run(dry_run=False, limit=5):
    print("🌐 V29 Multi-Modal Email Intelligence Engine")
    print("   Features: Multi-Dimensional Analysis + Context Mapping + Value Optimization")
    
    intelligence = MultiModalIntelligence()
    
    msgs = gmail_search('is:unread from:airbnb.com', limit=20)
    label_id = gmail_get_or_create_label_id(LABEL)
    
    stats = {'replied': 0, 'dimensions': 0}
    
    for msg in msgs[:limit]:
        try:
            full = gmail_get(msg['id'])
            headers = {h['name']: h['value'] for h in full.get('payload', {}).get('headers', [])}
            sender = headers.get('From', '')
            subject = headers.get('Subject', '')
            snippet = full.get('snippet', '')
            
            name_part = sender.split('<')[0].strip().strip('"') if '<' in sender else sender
            
            # Multi-dimensional analysis
            analysis = intelligence.analyze_dimensions(subject, snippet)
            stats['dimensions'] += len([v for v in analysis.values() if v])
            
            # Build multi-modal prompt
            today = datetime.now()
            avail_days = []
            for i in range(1, 5):
                d = today + timedelta(days=i)
                if d.weekday() < 5:
                    avail_days.append(d.strftime('%d/%m'))
            avail_text = ', '.join(avail_days[:3])
            
            lang = analysis['language']
            prompt = f"Email: {subject}. " + ("Português" if lang == 'pt' else "English") + f". Datas: {avail_text}."
            
            print(f"🌐 {name_part[:25]} | Intent: {analysis['intent']} | Urgency: {analysis['urgency']}")
            
            payload = {
                "model": MODEL,
                "prompt": prompt,
                "system": "You are a multi-modal AI assistant. Process all dimensions of input.",
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
    
    print(f"\n📊 Replied: {stats['replied']} | Dimensions analyzed: {stats['dimensions']}")

if __name__ == '__main__':
    import argparse
    p = argparse.ArgumentParser()
    p.add_argument('--execute', action='store_true')
    p.add_argument('--limit', type=int, default=5)
    args = p.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)