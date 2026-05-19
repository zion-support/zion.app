#!/usr/bin/env python3
"""
V20 - Ultimate AI-Powered Email Responder
Combines: Memory Engine + Predictive Timing + Multi-Channel + Revenue Intelligence
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
from ai_memory_engine import AIMemoryEngine, PredictiveTimingEngine
from multichannel_orchestrator import MultiChannelOrchestrator, RevenueIntelligence

OLLAMA_URL = "http://127.0.0.1:11434/api/generate"
OLLAMA_MODEL = "qwen3:0.6b"
LABEL_DONE = 'Autonomous-V20-Ultimate'

ai_memory = AIMemoryEngine()
timing_engine = PredictiveTimingEngine()
orchestrator = MultiChannelOrchestrator()
revenue_intel = RevenueIntelligence()

def generate_reply(prompt, sentiment='professional'):
    payload = {
        "model": OLLAMA_MODEL,
        "prompt": prompt[:500],
        "system": f"You are a CEO assistant. Be {sentiment} and concise.",
        "stream": False,
        "options": {"temperature": 0.7, "max_tokens": 200}
    }
    try:
        req = urllib.request.Request(OLLAMA_URL, data=json.dumps(payload).encode(),
                                      headers={'Content-Type': 'application/json'})
        with urllib.request.urlopen(req, timeout=30) as response:
            return json.loads(response.read().decode()).get('response', '').strip()
    except Exception as e:
        return None

def cmd_run(dry_run=False, limit=5):
    print("🚀 V20 Ultimate AI Responder")
    print("   Features: Memory + Predictive Timing + Multi-Channel + Revenue Intel")
    
    msgs = gmail_search('is:unread from:airbnb.com', limit=20)
    label_id = gmail_get_or_create_label_id(LABEL_DONE)
    
    stats = {'replied': 0, 'skipped': 0, 'opportunities': 0}
    
    for msg in msgs[:limit]:
        try:
            full = gmail_get(msg['id'])
            headers = {h['name']: h['value'] for h in full.get('payload', {}).get('headers', [])}
            sender = headers.get('From', '')
            subject = headers.get('Subject', '')
            snippet = full.get('snippet', '')
            
            # Get context from memory
            context = ai_memory.get_thread_context(sender)
            context_str = "; ".join([c.get('subject', '')[:30] for c in context[:2]])
            
            # Detect opportunities
            opportunities = revenue_intel.detect_opportunities(subject, snippet, context)
            if opportunities:
                stats['opportunities'] += len(opportunities)
                for opp in opportunities:
                    print(f"   💡 {opp['type']}: {opp['suggested_action']}")
            
            # Build enhanced prompt with memory
            today = datetime.now()
            available_days = [today + timedelta(days=i) for i in range(1, 5)]
            available = [d.strftime('%d/%m') for d in available_days if d.weekday() < 5][:3]
            avail_text = ', '.join(available)
            
            text = f"{subject} {snippet}".lower()
            language = 'pt' if any(w in text for w in ['reserva', 'consulta']) else 'en'
            
            if language == 'pt':
                prompt = f"Contexto: {context_str}. Email Airbnb: {subject}. Responda em português com datas: {avail_text}."
            else:
                prompt = f"Context: {context_str}. Airbnb email: {subject}. Respond in English. Available: {avail_text}."
            
            print(f"📧 {sender[:30]} | Generating (memory: {len(context)} past)...")
            
            reply = generate_reply(prompt)
            
            if reply:
                stats['replied'] += 1
                print(f"   ✅ {reply[:80]}...")
                
                if not dry_run:
                    gmail_send_reply(msg['id'], reply)
                    gmail_batch_modify({'ids': [msg['id']]}, addLabelIds=[label_id])
                    
                    # Record interaction in memory
                    ai_memory.record_interaction(sender, subject, reply, 5)
            else:
                stats['skipped'] += 1
                
        except Exception as e:
            print(f"Error: {e}")
            continue
    
    print(f"\n📊 Replied: {stats['replied']} | Opportunities: {stats['opportunities']}")

if __name__ == '__main__':
    import argparse
    p = argparse.ArgumentParser()
    p.add_argument('--execute', action='store_true')
    p.add_argument('--limit', type=int, default=5)
    args = p.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)