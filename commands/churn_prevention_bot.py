#!/usr/bin/env python3
"""
Churn Prevention Bot - Proactively identify and reach out to at-risk relationships

Analyzes email patterns, response rates, and engagement to predict churn risk
and trigger retention actions.
"""

import sys, json
from pathlib import Path
from datetime import datetime, timezone, timedelta
from typing import Dict, List

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, gmail_get, telegram_send

CHURN_RISK_THRESHOLD = 0.7  # 70% risk score triggers action
CHURN_DATA_FILE = WORKSPACE / 'zion.app' / 'data' / 'churn_tracking.json'


def load_churn_data() -> Dict:
    """Load churn tracking data."""
    if CHURN_DATA_FILE.exists():
        return json.loads(CHURN_DATA_FILE.read_text())
    return {'contacts': {}, 'predictions': []}


def save_churn_data(data: Dict):
    """Save churn data."""
    CHURN_DATA_FILE.parent.mkdir(parents=True, exist_ok=True)
    CHURN_DATA_FILE.write_text(json.dumps(data, indent=2))


def calculate_churn_risk(sender: str, last_contact: str, response_count: int, 
                         email_count: int, sentiment: str) -> float:
    """Calculate churn risk score (0-1)."""
    score = 0.0
    
    # Time since last contact (weight: 0.4)
    try:
        last_dt = datetime.fromisoformat(last_contact.replace('Z', '+00:00'))
        days_since = (datetime.now(timezone.utc) - last_dt).days
        if days_since > 90:
            score += 0.4
        elif days_since > 60:
            score += 0.3
        elif days_since > 30:
            score += 0.2
        elif days_since > 14:
            score += 0.1
    except:
        pass
    
    # Low response rate (weight: 0.3)
    if email_count > 0:
        response_rate = response_count / email_count
        if response_rate < 0.1:
            score += 0.3
        elif response_rate < 0.25:
            score += 0.2
        elif response_rate < 0.5:
            score += 0.1
    
    # Negative sentiment (weight: 0.2)
    if sentiment == 'negative':
        score += 0.2
    elif sentiment == 'neutral':
        score += 0.1
    
    # No responses at all (weight: 0.1)
    if response_count == 0 and email_count > 3:
        score += 0.1
    
    return min(1.0, score)


def analyze_contact(sender: str) -> Dict:
    """Analyze a contact's interaction history."""
    # Search for emails from this sender
    emails = gmail_search(f'from:{sender}', limit=50)
    
    if not emails:
        return {'sender': sender, 'email_count': 0, 'response_count': 0, 'risk_score': 0}
    
    # Get last contact time and response patterns
    last_contact = None
    sentiments = []
    
    for email in emails[:20]:
        msg = gmail_get(email['id'])
        received = msg.get('internalDate', '')
        
        if received:
            if not last_contact or received > last_contact:
                last_contact = received
        
        # Simple sentiment from snippet
        snippet = msg.get('snippet', '').lower()
        if any(w in snippet for w in ['urgent', 'problem', 'issue', 'concern', 'cancel']):
            sentiments.append('negative')
        elif any(w in snippet for w in ['thanks', 'great', 'excellent', 'appreciate']):
            sentiments.append('positive')
        else:
            sentiments.append('neutral')
    
    # Simplified - assume we respond to 20% of emails
    response_count = max(0, len(emails) - int(len(emails) * 0.8))
    
    # Determine dominant sentiment
    sentiment_counts = {'positive': 0, 'neutral': 0, 'negative': 0}
    for s in sentiments:
        sentiment_counts[s] = sentiment_counts.get(s, 0) + 1
    dominant_sentiment = max(sentiment_counts, key=sentiment_counts.get)
    
    risk_score = calculate_churn_risk(
        sender, last_contact or '', response_count, len(emails), dominant_sentiment
    )
    
    return {
        'sender': sender,
        'email_count': len(emails),
        'response_count': response_count,
        'risk_score': risk_score,
        'sentiment': dominant_sentiment,
        'last_contact': last_contact,
    }


def generate_retention_message(contact: Dict) -> str:
    """Generate a retention outreach message."""
    templates = [
        "Hi {name}, I noticed we haven't connected in a while. How are things going with {topic}? Would love to catch up on any new projects.",
        "Hey {name}, checking in! It's been a bit since we last spoke. Any updates on your end? Happy to help with anything.",
        "Hello {name}, hope you're doing well! Want to make sure you have everything you need from our side. Let me know!",
    ]
    
    # Extract name from email
    name = contact['sender'].split('@')[0].split('<')[-1].strip()
    
    # Extract likely topic from sender domain
    topics = {
        'airbnb': 'your Airbnb setup',
        'stripe': 'payment processing',
        'github': 'development work',
        'google': 'Google Cloud services',
    }
    topic = topics.get(contact['sender'].split('@')[-1].split('.')[0], 'your projects')
    
    import random
    return templates[random.randint(0, len(templates)-1)].format(name=name, topic=topic)


def main(execute=True, limit=30):
    """Main execution."""
    print("🔄 Churn Prevention Bot - Analyzing relationships...")
    
    churn_data = load_churn_data()
    results = []
    
    # Get recent contacts from sent emails
    recent_emails = gmail_search('in:inbox is:sent', limit=100)
    senders = set()
    
    for email in recent_emails[:limit]:
        msg = gmail_get(email['id'])
        headers = msg.get('payload', {}).get('headers', [])
        to_header = next((h['value'] for h in headers if h['name'] == 'To'), '')
        # Extract email addresses
        import re
        for addr in re.findall(r'[\w\.-]+@[\w\.-]+\.\w+', to_header):
            senders.add(addr)
    
    print(f"📧 Analyzing {len(senders)} contacts...")
    
    high_risk = []
    for sender in list(senders)[:30]:
        analysis = analyze_contact(sender)
        
        if analysis['risk_score'] >= CHURN_RISK_THRESHOLD:
            high_risk.append(analysis)
            results.append({
                'sender': sender,
                'risk_score': analysis['risk_score'],
                'action': 'retention'
            })
            
            if execute:
                telegram_send(f"🔴 Churn Risk {analysis['risk_score']*100:.0f}%: {sender[:30]}")
    
    churn_data['predictions'] = results
    save_churn_data(churn_data)
    
    print(f"\n📊 Churn Analysis Results:")
    print(f"  🔴 High Risk: {len(high_risk)}")
    print(f"  ✅ Analyzed: {min(len(senders), 30)}")
    
    if high_risk:
        print(f"\n⚠️ High Risk Contacts:")
        for contact in high_risk[:5]:
            print(f"  {contact['sender'][:25]} - {contact['risk_score']*100:.0f}% risk")
    
    return results


if __name__ == '__main__':
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument('--execute', action='store_true')
    parser.add_argument('--limit', type=int, default=30)
    args = parser.parse_args()
    main(execute=args.execute, limit=args.limit)