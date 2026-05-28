#!/usr/bin/env python3
"""
Reply Effectiveness Tracker - Learn from Response Patterns

Tracks:
- Which reply templates get responses
- Response time by template
- Success rate by category
- Sends improvement insights

Usage:
  python3 reply_tracker.py --analyze
  python3 reply_tracker.py --report
"""

import sys, json
from pathlib import Path
from datetime import datetime, timedelta
from collections import defaultdict

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, gmail_get

TRACKER_DB = WORKSPACE / 'zion.app' / 'data' / 'reply_tracking.json'

def load_tracking():
    if TRACKER_DB.exists():
        return json.loads(TRACKER_DB.read_text())
    return {'templates': {}, 'conversations': {}}

def save_tracking(data):
    TRACKER_DB.parent.mkdir(parents=True, exist_ok=True)
    TRACKER_DB.write_text(json.dumps(data, indent=2))

def analyze_template_effectiveness():
    """Analyze which reply templates are most effective"""
    data = load_tracking()
    
    # Get replied-to emails with V14-Done label
    messages = gmail_search('label:V14-Done', limit=100)
    
    stats = defaultdict(lambda: {'sent': 0, 'replies': 0, 'avg_response_hours': []})
    
    for msg in messages:
        msg_id = msg['id']
        full = gmail_get(msg_id)
        headers = {h['name']: h['value'] for h in full.get('payload', {}).get('headers', [])}
        
        subject = headers.get('Subject', '')
        snippet = full.get('snippet', '')
        
        # Determine category
        text = f"{subject} {snippet}".lower()
        
        if any(k in text for k in ['airbnb', 'booking', 'reserva']):
            category = 'booking'
        elif any(k in text for k in ['urgent', 'urgente']):
            category = 'urgent'
        elif any(k in text for k in ['quote', 'proposal', 'orçamento']):
            category = 'sales'
        else:
            category = 'general'
        
        # Check for replies (look for In-Reply-To header)
        has_reply = any(h['name'] == 'In-Reply-To' for h in full.get('payload', {}).get('headers', []))
        
        stats[category]['sent'] += 1
        if has_reply:
            stats[category]['replies'] += 1
    
    return dict(stats)

def generate_report():
    """Generate effectiveness report"""
    stats = analyze_template_effectiveness()
    
    print("📊 Reply Effectiveness Report")
    print("=" * 40)
    
    for category, data in stats.items():
        rate = (data['replies'] / data['sent'] * 100) if data['sent'] > 0 else 0
        print(f"\n{category.upper()}")
        print(f"  Sent: {data['sent']}")
        print(f"  Replies: {data['replies']}")
        print(f"  Response Rate: {rate:.1f}%")
    
    # Recommendations
    print("\n💡 Recommendations:")
    best = max(stats.items(), key=lambda x: x[1]['replies']/max(x[1]['sent'], 1) if x[1]['sent'] > 0 else 0)
    print(f"  Best performing: {best[0]} ({best[1]['replies']} replies)")

def main():
    if '--report' in sys.argv:
        generate_report()
    elif '--analyze' in sys.argv:
        stats = analyze_template_effectiveness()
        print(json.dumps(stats, indent=2))
    else:
        print("Usage: python3 reply_tracker.py --report | --analyze")

if __name__ == '__main__':
    main()