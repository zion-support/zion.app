#!/usr/bin/env python3
"""Response Verifier - Check if email replies were sent successfully"""

import sys, json
from pathlib import Path
from datetime import datetime, timezone, timedelta

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE/'zion.app'/ 'commands'))

try:
    from google_workspace import gmail_search, gmail_get, telegram_send
except:
    def gmail_search(q, limit=20): return []
    def gmail_get(i): return {}
    def telegram_send(t): print(f"[TG] {t}")

VERIFY_LOG = WORKSPACE / 'zion.app' / 'data' / 'response_verification.json'

def verify_responses(hours=24):
    """Verify replies were sent by checking sent folder"""
    since = (datetime.now(timezone.utc) - timedelta(hours=hours)).isoformat()
    
    # Get sent emails from autonomous responder
    sent = gmail_search('in:sent from:kleber@ziontechgroup.com', limit=50)
    
    verified = []
    for s in sent:
        msg = gmail_get(s['id'])
        headers = msg.get('payload', {}).get('headers', [])
        subject = next((h['value'] for h in headers if h['name'] == 'Subject'), '')
        
        # Check for Re: prefix
        if subject.startswith('Re:'):
            verified.append({
                'thread_id': s['id'][:10],
                'subject': subject[:50],
                'status': 'verified'
            })
    
    return verified

def main(execute=True):
    print("🔍 Response Verifier - Checking sent emails...")
    verified = verify_responses()
    
    VERIFY_LOG.parent.mkdir(exist_ok=True)
    VERIFY_LOG.write_text(json.dumps({
        'verified': verified,
        'total_sent': len(verified),
        'timestamp': datetime.now(timezone.utc).isoformat()
    }, indent=2))
    
    if execute:
        telegram_send(f"🔍 Verified {len(verified)} successful replies")
    
    return verified

if __name__ == '__main__':
    import argparse
    p = argparse.ArgumentParser()
    p.add_argument('--execute', action='store_true')
    args = p.parse_args()
    main(execute=args.execute)