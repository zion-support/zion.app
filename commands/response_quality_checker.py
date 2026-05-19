#!/usr/bin/env python3
"""Response Quality Checker - Verify replies meet standards"""

import sys, json
from pathlib import Path
sys.path.insert(0, '/root/.openclaw/workspace/zion.app/commands')

try:
    from google_workspace import gmail_search, gmail_get, telegram_send
except:
    def gmail_search(q, limit=20): return []
    def gmail_get(i): return {}
    def telegram_send(t): print(f"[TG] {t}")

QUALITY_LOG = Path('/root/.openclaw/workspace/zion.app/data/response_quality.json')

def check_response_quality():
    """Analyze recently sent replies for quality"""
    sent = gmail_search('in:sent is:unread', limit=20)  # Recent replies
    results = []
    
    for s in sent:
        try:
            msg = gmail_get(s['id'])
            snippet = msg.get('snippet', '')
            
            # Quality checks
            checks = {
                'has_greeting': any(w in snippet.lower() for w in ['dear', 'prezado', 'hi', 'hello']),
                'has_name': 'kleber' in snippet.lower(),
                'has_signature': any(w in snippet for w in ['regards', 'atenciosamente', 'best']),
                'proper_length': len(snippet) > 50
            }
            score = sum(checks.values()) / 4
            results.append({'id': s['id'], 'score': score, 'checks': checks})
        except: pass
    
    return results

def main(execute=True):
    print("🔍 Response Quality Checker - Analyzing...")
    results = check_response_quality()
    avg_score = sum(r['score'] for r in results) / max(len(results), 1)
    
    if execute:
        telegram_send(f"🔍 Quality: {avg_score:.0%} avg score on {len(results)} replies")
    
    return results

if __name__ == '__main__':
    main(execute=True)