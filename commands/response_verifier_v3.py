#!/usr/bin/env python3
"""
Response Verifier V3 - Delivery Confirmation + Pattern Learning
"""

import sys, json, re
from pathlib import Path
from datetime import datetime, timezone, timedelta

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))

try:
    from google_workspace import gmail_search, gmail_get, gmail_batch_modify, gmail_get_or_create_label_id
except:
    def gmail_search(q, limit=20): return []
    def gmail_get(i): return {}
    def gmail_batch_modify(*args): pass
    def gmail_get_or_create_label_id(n): return 'label_id'

VERIFICATION_FILE = WORKSPACE / 'zion.app' / 'data' / 'response_verification.json'
SENT_LABEL = 'SENT'

def load_verification_data():
    if VERIFICATION_FILE.exists():
        return json.loads(VERIFICATION_FILE.read_text())
    return {'tracked_responses': {}, 'patterns': {}, 'delivery_stats': {}}

def save_verification_data(data):
    VERIFICATION_FILE.parent.mkdir(exist_ok=True)
    VERIFICATION_FILE.write_text(json.dumps(data, indent=2, default=str))

def verify_response_delivery(thread_id, original_text, response_text, timestamp, sender):
    """Check if response was actually sent and in SENT folder"""
    data = load_verification_data()
    
    # Search sent folder for the response text
    search_query = f'in:sent "{response_text[:50]}"'
    sent_messages = gmail_search(search_query, limit=5)
    
    delivered = len(sent_messages) > 0
    
    thread_hash = hash(f"{thread_id}{original_text[:30]}")
    
    verification = {
        'thread_id': thread_id,
        'hash': thread_hash,
        'original_preview': original_text[:100],
        'response_preview': response_text[:100],
        'sender': sender,
        'timestamp': timestamp,
        'delivered': delivered,
        'verified_at': datetime.now(timezone.utc).isoformat(),
        'sent_message_ids': [m['id'] for m in sent_messages[:3]]
    }
    
    data['tracked_responses'][thread_hash] = verification
    
    # Update patterns for learning
    intent = classify_intent(original_text)
    if delivered:
        data['patterns'].setdefault(intent, {'delivered': 0, 'avg_response_time': 0})
        data['patterns'][intent]['delivered'] += 1
    else:
        data['patterns'].setdefault(intent, {'failed': 0})
        data['patterns'][intent]['failed'] = data['patterns'][intent].get('failed', 0) + 1
    
    save_verification_data(data)
    return verification

def classify_intent(text):
    text_lower = text.lower()
    if any(kw in text_lower for kw in ['reserva', 'booking', 'confirmado']):
        return 'booking'
    elif any(kw in text_lower for kw in ['urgente', 'urgent', 'asap']):
        return 'urgent'
    elif any(kw in text_lower for kw in ['orçamento', 'proposta', 'quote', 'proposal']):
        return 'sales'
    return 'general'

def analyze_response_patterns():
    """Analyze successful response patterns"""
    data = load_verification_data()
    
    patterns = data.get('patterns', {})
    stats = {
        'total_tracked': len(data.get('tracked_responses', {})),
        'delivery_rate': {},
        'best_templates': {}
    }
    
    for intent, metrics in patterns.items():
        delivered = metrics.get('delivered', 0)
        failed = metrics.get('failed', 0)
        total = delivered + failed
        if total > 0:
            stats['delivery_rate'][intent] = round(delivered / total * 100, 1)
    
    return stats

def verify_recent_responses(hours=24):
    """Verify all responses from last N hours"""
    since = (datetime.now(timezone.utc) - timedelta(hours=hours)).isoformat()
    
    # Find sent emails with our automated markers
    search_query = f'in:sent after:{since.replace("T", " ").split(".")[0].replace("+00:00", "")}'
    sent = gmail_search(search_query, limit=100)
    
    verified = 0
    for msg in sent:
        try:
            full = gmail_get(msg['id'])
            headers = {h['name']: h['value'] for h in full.get('payload', {}).get('headers', [])}
            subject = headers.get('Subject', '')
            
            # Check for our automated reply signature
            if 'Zion Tech Group' in full.get('snippet', '') or 'Kleber Garcia Alcatrão' in full.get('snippet', ''):
                verified += 1
        except:
            pass
    
    return {'sent_automated': verified, 'checked': len(sent)}

def main(execute=True):
    print("📋 Response Verifier V3 - Delivery Confirmation")
    
    # Verify recent responses
    recent = verify_recent_responses(hours=48)
    print(f"\n📊 Recent Automated Responses (48h): {recent['sent_automated']}/{recent['checked']}")
    
    # Analyze patterns
    patterns = analyze_response_patterns()
    print(f"\n📈 Delivery Rates by Intent:")
    for intent, rate in patterns['delivery_rate'].items():
        print(f"  {intent}: {rate}%")
    
    # Verify pending responses
    data = load_verification_data()
    pending = [v for v in data.get('tracked_responses', {}).values() 
               if not v.get('delivered') and 
               datetime.fromisoformat(v['timestamp']) > datetime.now(timezone.utc) - timedelta(hours=48)]
    
    print(f"\n⏳ Pending Verification: {len(pending)}")
    for p in pending[:5]:
        print(f"  Thread {p['thread_id'][:10]}... - {p['sender'][:30]}")
    
    return patterns

if __name__ == '__main__':
    import argparse
    p = argparse.ArgumentParser()
    p.add_argument('--execute', action='store_true')
    args = p.parse_args()
    main(execute=args.execute)