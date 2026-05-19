#!/usr/bin/env python3
"""Response Verification Loop - Ensures replies were sent correctly"""

import sys, json
from pathlib import Path
from datetime import datetime, timezone, timedelta
sys.path.insert(0, '/root/.openclaw/workspace/zion.app/commands')

try:
    from google_workspace import gmail_search, gmail_get
except: pass

VERIFICATION_LOG = Path('/root/.openclaw/workspace/zion.app/data/response_verification.json')

def verify_response(thread_id, expected_recipients):
    """Check if reply exists in sent folder"""
    sent = gmail_search(f'is:sent rfc822msgid:{thread_id}', limit=5)
    
    if sent:
        msg = gmail_get(sent[0]['id'])
        headers = msg.get('payload', {}).get('headers', [])
        to = next((h['value'] for h in headers if h['name'] == 'To'), '')
        
        verified = expected_recipients.split(',') == to.split(',')
        
        record = {
            'thread_id': thread_id,
            'verified': verified,
            'expected': expected_recipients,
            'actual': to,
            'timestamp': datetime.now(timezone.utc).isoformat()
        }
        
        logs = json.loads(VERIFICATION_LOG.read_text()) if VERIFICATION_LOG.exists() else []
        logs.append(record)
        VERIFICATION_LOG.write_text(json.dumps(logs[-100:], indent=2))
        
        return verified
    return False

if __name__ == '__main__':
    print("✅ Response Verifier ready")