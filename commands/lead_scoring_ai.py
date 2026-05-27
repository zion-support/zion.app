#!/usr/bin/env python3
"""
Lead Scoring AI - Intelligently rank incoming emails by conversion probability

Analyzes email content, sender domain reputation, timing, and historical data
to score leads from 0-100 for priority routing.
"""

import sys, json, re
from pathlib import Path
from datetime import datetime, timezone
from typing import Dict, List, Optional

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, gmail_get, telegram_send

# Lead score weights
WEIGHT_DOMAIN = 0.25
WEIGHT_CONTENT = 0.30
WEIGHT_TIMING = 0.15
WEIGHT_HISTORY = 0.20
WEIGHT_ACTION = 0.10

# High-value domains (0-100 points)
DOMAIN_SCORES = {
    # Enterprise domains
    'microsoft.com': 95, 'google.com': 95, 'amazon.com': 90, 'apple.com': 90,
    'stripe.com': 85, 'shopify.com': 80, 'salesforce.com': 85,
    # Investment/Banking
    'goldman.com': 90, 'morganstanley.com': 85, 'blackstone.com': 85,
    # Real estate/Airbnb
    'airbnb.com': 75, 'vrbo.com': 70, 'zillow.com': 75,
    # Marketing/Partnerships
    'hubspot.com': 70, 'mailchimp.com': 65, 'sendgrid.net': 60,
    # Generic business
    'gmail.com': 30, 'outlook.com': 30, 'yahoo.com': 20,
}

# Trigger keywords that boost score
HIGH_VALUE_KEYWORDS = [
    'partnership', 'quote', 'pricing', 'proposal', 'demo', 'interested',
    'investment', 'funding', 'acquisition', 'collaboration', 'enterprise',
    'contract', 'retainer', 'subscription', 'api access', 'white label',
]

MEDIUM_VALUE_KEYWORDS = [
    'question', 'help', 'support', 'inquiry', 'information', 'details',
    'timeline', 'budget', 'cost', 'availability', 'schedule', 'call',
    'meeting', 'discussion', 'chat', 'talk',
]

NEGATIVE_KEYWORDS = [
    'unsubscribe', 'spam', 'remove', 'complaint', 'refund', 'cancel',
    'urgent', 'asap', 'emergency'  # Often spam/bulk
]


def load_lead_history() -> Dict:
    """Load historical lead data for pattern learning."""
    f = WORKSPACE / 'zion.app' / 'data' / 'lead_history.json'
    if f.exists():
        return json.loads(f.read_text())
    return {'leads': {}, 'scores': {}}


def save_lead_history(data: Dict):
    """Save lead history."""
    f = WORKSPACE / 'zion.app' / 'data' / 'lead_history.json'
    f.parent.mkdir(parents=True, exist_ok=True)
    f.write_text(json.dumps(data, indent=2))


def get_domain_score(sender_email: str) -> int:
    """Score based on sender domain."""
    domain = sender_email.split('@')[-1].lower() if '@' in sender_email else ''
    return DOMAIN_SCORES.get(domain, 25)  # Default low score for unknown domains


def get_content_score(subject: str, snippet: str) -> int:
    """Score based on email content analysis."""
    text = f"{subject} {snippet}".lower()
    score = 30  # Base score
    
    # Boost for high-value keywords
    for kw in HIGH_VALUE_KEYWORDS:
        if kw in text:
            score += 15
    
    # Boost for medium-value keywords
    for kw in MEDIUM_VALUE_KEYWORDS:
        if kw in text:
            score += 8
    
    # Penalty for negative keywords
    for kw in NEGATIVE_KEYWORDS:
        if kw in text:
            score -= 10
    
    return max(0, min(100, score))


def get_timing_score(timestamp: str) -> int:
    """Score based on when email was received (business hours boost)."""
    try:
        # Parse Gmail timestamp format
        ts = datetime.fromisoformat(timestamp.replace('Z', '+00:00'))
        hour = ts.hour
        
        # US business hours boost
        if 9 <= hour <= 17:
            return 20
        elif 7 <= hour <= 9 or 17 <= hour <= 19:
            return 15
        else:
            return 10
    except:
        return 10


def get_history_score(sender_email: str, history: Dict) -> int:
    """Score based on historical interaction with this sender."""
    domain = sender_email.split('@')[-1].lower()
    lead = history.get('leads', {}).get(domain, {})
    
    # Previous successful conversions boost score
    if lead.get('converted', False):
        return 30
    elif lead.get('replied', False):
        return 20
    elif lead.get('opened', False):
        return 10
    
    return 5


def get_action_score(headers: List[Dict]) -> int:
    """Score based on required action (reply-all indicates importance)."""
    cc = next((h['value'] for h in headers if h['name'].lower() == 'cc'), '')
    reply_to = next((h['value'] for h in headers if h['name'].lower() == 'reply-to'), '')
    
    score = 15  # Base
    if cc:
        score += 10  # Reply-all needed = more importance
    return min(25, score)


def calculate_lead_score(sender: str, subject: str, snippet: str, 
                         timestamp: str, headers: List[Dict], history: Dict) -> Dict:
    """Calculate comprehensive lead score."""
    domain_score = get_domain_score(sender)
    content_score = get_content_score(subject, snippet)
    timing_score = get_timing_score(timestamp)
    history_score = get_history_score(sender, history)
    action_score = get_action_score(headers)
    
    # Weighted average
    final = (
        domain_score * WEIGHT_DOMAIN +
        content_score * WEIGHT_CONTENT +
        timing_score * WEIGHT_TIMING +
        history_score * WEIGHT_HISTORY +
        action_score * WEIGHT_ACTION
    )
    
    # Categorize
    if final >= 80:
        category = 'HOT'
    elif final >= 60:
        category = 'WARM'
    elif final >= 40:
        category = 'MEDIUM'
    else:
        category = 'COLD'
    
    return {
        'score': round(final, 1),
        'category': category,
        'breakdown': {
            'domain': domain_score,
            'content': content_score,
            'timing': timing_score,
            'history': history_score,
            'action': action_score
        }
    }


def update_lead_history(history: Dict, sender: str, action: str):
    """Update lead history with interaction."""
    domain = sender.split('@')[-1].lower()
    if 'leads' not in history:
        history['leads'] = {}
    if domain not in history['leads']:
        history['leads'][domain] = {}
    history['leads'][domain][action] = True
    history['leads'][domain]['last_seen'] = datetime.now(timezone.utc).isoformat()


def main(execute=True, limit=20):
    """Main execution."""
    print("🎯 Lead Scoring AI - Analyzing emails...")
    
    history = load_lead_history()
    results = []
    
    # Get unread emails
    emails = gmail_search('in:inbox is:unread -from:github.com -from:notifications@github.com', limit=limit)
    
    for email in emails[:limit]:
        msg = gmail_get(email['id'])
        
        headers = msg.get('payload', {}).get('headers', [])
        sender = next((h['value'] for h in headers if h['name'] == 'From'), '')
        subject = next((h['value'] for h in headers if h['name'] == 'Subject'), '')
        timestamp = msg.get('internalDate', '')
        
        # Simple snippet from payload
        snippet = ''
        try:
            parts = msg.get('payload', {}).get('parts', [])
            if parts:
                snippet = parts[0].get('body', {}).get('data', '')[:100]
        except:
            pass
        
        score_data = calculate_lead_score(sender, subject, snippet, timestamp, headers, history)
        
        results.append({
            'sender': sender,
            'subject': subject[:50],
            **score_data
        })
        
        if execute and score_data['score'] >= 70:
            # Notify high-value leads
            telegram_send(f"🔥 HOT LEAD ({score_data['score']}): {sender[:30]} - {subject[:30]}")
            update_lead_history(history, sender, 'hot_lead')
    
    save_lead_history(history)
    
    # Sort by score
    results.sort(key=lambda x: x['score'], reverse=True)
    
    print(f"\n📊 Lead Scores (top {len(results)}):")
    for r in results[:5]:
        print(f"  {r['category']} {r['score']}: {r['sender'][:25]} - {r['subject']}")
    
    return results


if __name__ == '__main__':
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument('--execute', action='store_true')
    parser.add_argument('--limit', type=int, default=20)
    args = parser.parse_args()
    main(execute=args.execute, limit=args.limit)