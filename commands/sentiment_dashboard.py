#!/usr/bin/env python3
"""
Client Sentiment Dashboard - Track client satisfaction in real-time

Analyzes email sentiment, response patterns, and engagement to provide
real-time client health scores.
"""

import sys, json
from pathlib import Path
from datetime import datetime, timezone
from typing import Dict, List

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, gmail_get, telegram_send

SENTIMENT_LOG = WORKSPACE / 'zion.app' / 'data' / 'client_sentiment.json'

# Sentiment keywords
POSITIVE_WORDS = ['great', 'excellent', 'love', 'thank', 'perfect', 'awesome', 'satisfied', 'happy', 'pleased', 'success']
NEGATIVE_WORDS = ['concerned', 'worried', 'issue', 'problem', 'frustrated', 'delayed', 'complaint', 'disappointed', 'angry', 'urgent']


def analyze_client_emails(limit=50) -> List[Dict]:
    """Analyze emails from clients."""
    clients = {}
    queries = ['from:client', 'from:customer', 'from:partner']
    
    for query in queries:
        emails = gmail_search(f'{query} newer_than:30d', limit=limit)
        for email in emails:
            msg = gmail_get(email['id'])
            headers = msg.get('payload', {}).get('headers', [])
            sender = next((h['value'] for h in headers if h['name'] == 'From'), '')
            subject = next((h['value'] for h in headers if h['name'] == 'Subject'), '')
            snippet = msg.get('snippet', '').lower()
            
            # Extract email address
            import re
            email_match = re.search(r'<([^>]+)>', sender)
            email_addr = email_match.group(1) if email_match else sender
            
            # Calculate sentiment
            pos_count = sum(1 for w in POSITIVE_WORDS if w in snippet)
            neg_count = sum(1 for w in NEGATIVE_WORDS if w in snippet)
            
            sentiment_score = 0.5
            if pos_count > neg_count:
                sentiment_score = 0.5 + min(0.5, (pos_count - neg_count) * 0.1)
            elif neg_count > pos_count:
                sentiment_score = 0.5 - min(0.5, (neg_count - pos_count) * 0.1)
            
            client = clients.setdefault(email_addr, {
                'email': email_addr,
                'name': sender.split('<')[0].strip(),
                'emails': [],
                'sentiment_scores': [],
            })
            client['emails'].append({'subject': subject, 'date': email.get('date', '')})
            client['sentiment_scores'].append(sentiment_score)
    
    return list(clients.values())


def calculate_health_score(client: Dict) -> Dict:
    """Calculate client health score."""
    scores = client['sentiment_scores']
    if not scores:
        return {'health': 0.5, 'trend': 'stable', 'risk': 'low'}
    
    avg_score = sum(scores) / len(scores)
    recent_scores = scores[-5:] if len(scores) > 5 else scores
    recent_avg = sum(recent_scores) / len(recent_scores)
    
    trend = 'stable'
    if recent_avg > avg_score + 0.1:
        trend = 'improving'
    elif recent_avg < avg_score - 0.1:
        trend = 'declining'
    
    risk = 'low'
    if avg_score < 0.3:
        risk = 'high'
    elif avg_score < 0.5:
        risk = 'medium'
    
    return {
        'health': round(avg_score, 2),
        'trend': trend,
        'risk': risk,
        'emails': len(client['emails']),
    }


def main(execute=True, limit=50):
    """Main execution."""
    print("😊 Client Sentiment Dashboard - Analyzing client satisfaction...")
    
    clients = analyze_client_emails(limit)
    print(f"👥 Analyzed {len(clients)} active clients")
    
    # Calculate health scores
    results = []
    for client in clients:
        health = calculate_health_score(client)
        client.update(health)
        results.append(client)
        
        status_emoji = {'improving': '📈', 'stable': '➡️', 'declining': '📉'}.get(health['trend'], '➡️')
        risk_emoji = {'low': '✅', 'medium': '⚠️', 'high': '🔴'}.get(health['risk'], '✅')
        
        print(f"  {client['name'][:30]:30s} {status_emoji} Health: {health['health']:.0%} {risk_emoji} {health['risk']}")
    
    # Sort by risk
    high_risk = [r for r in results if r.get('risk') == 'high']
    medium_risk = [r for r in results if r.get('risk') == 'medium']
    
    # Load history
    if SENTIMENT_LOG.exists():
        log = json.loads(SENTIMENT_LOG.read_text())
    else:
        log = {'clients': []}
    
    log['clients'] = results
    log['last_updated'] = datetime.now(timezone.utc).isoformat()
    SENTIMENT_LOG.parent.mkdir(parents=True, exist_ok=True)
    SENTIMENT_LOG.write_text(json.dumps(log, indent=2))
    
    # Alert on risks
    if execute:
        for client in high_risk:
            telegram_send(f"🔴 HIGH RISK: {client['name']} health={client['health']:.0%}")
        for client in medium_risk[:3]:
            telegram_send(f"⚠️ Medium risk: {client['name']} health={client['health']:.0%}")
    
    print(f"\n📊 Summary:")
    print(f"  ✅ Low risk: {len([r for r in results if r.get('risk') == 'low'])}")
    print(f"  ⚠️ Medium risk: {len(medium_risk)}")
    print(f"  🔴 High risk: {len(high_risk)}")
    
    return results


if __name__ == '__main__':
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument('--execute', action='store_true')
    parser.add_argument('--limit', type=int, default=50)
    args = parser.parse_args()
    main(execute=args.execute, limit=args.limit)