#!/usr/bin/env python3
"""
Revenue Prediction AI - Forecast monthly revenue from pipeline signals

Analyzes deal progression, email sentiment, and historical data to predict
revenue outcomes with confidence intervals.
"""

import sys, json
from pathlib import Path
from datetime import datetime, timezone
from typing import Dict, List

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, gmail_get, drive_list, telegram_send

REVENUE_LOG = WORKSPACE / 'zion.app' / 'data' / 'revenue_predictions.json'


def analyze_deal_emails() -> List[Dict]:
    """Analyze emails for deal signals."""
    deals = []
    
    queries = [
        'subject:"proposal"',
        'subject:"quote"',
        'subject:"contract"',
        'subject:"deal"',
        'subject:"offer"',
    ]
    
    seen = set()
    for query in queries:
        emails = gmail_search(query, limit=20)
        for email in emails:
            if email['id'] not in seen:
                msg = gmail_get(email['id'])
                headers = msg.get('payload', {}).get('headers', [])
                subject = next((h['value'] for h in headers if h['name'] == 'Subject'), '')
                snippet = msg.get('snippet', '').lower()
                
                # Extract deal value
                import re
                money_match = re.search(r'\$?([\d,]+\.?\d*)\s*(k|thousand|million)?', snippet)
                value = 0
                if money_match and money_match.group(1):
                    try:
                        val = float(money_match.group(1).replace(',', ''))
                        if money_match.group(2):
                            multiplier = {'k': 1000, 'thousand': 1000, 'million': 1000000}.get(
                                money_match.group(2).lower(), 1)
                            val *= multiplier
                        value = val
                    except (ValueError, TypeError):
                        value = 0
                
                # Determine stage
                stage = 'unknown'
                if any(w in subject.lower() for w in ['proposal', 'quote']):
                    stage = 'proposal'
                elif any(w in subject.lower() for w in ['contract', 'signed']):
                    stage = 'closed'
                elif any(w in subject.lower() for w in ['negotiation', 'review']):
                    stage = 'negotiation'
                
                # Sentiment analysis
                sentiment = 'neutral'
                if any(w in snippet for w in ['interested', 'yes', 'sounds good', 'proceed']):
                    sentiment = 'positive'
                elif any(w in snippet for w in ['concerned', 'worried', 'issue', 'problem']):
                    sentiment = 'negative'
                
                # Confidence based on stage and sentiment
                confidence = 0.5
                if stage == 'closed' or sentiment == 'positive':
                    confidence += 0.3
                if stage == 'proposal':
                    confidence += 0.1
                
                deals.append({
                    'subject': subject,
                    'value': value,
                    'stage': stage,
                    'sentiment': sentiment,
                    'confidence': min(0.95, confidence),
                })
                seen.add(email['id'])
    
    return deals


def analyze_drive_financials() -> Dict:
    """Analyze Drive for financial documents."""
    files = drive_list(limit=30)
    financial = {
        'invoices': [],
        'contracts': [],
        'revenue_docs': [],
    }
    
    for f in files:
        name_lower = f['name'].lower()
        if 'invoice' in name_lower:
            financial['invoices'].append(f)
        if 'contract' in name_lower:
            financial['contracts'].append(f)
        if any(kw in name_lower for kw in ['revenue', 'sales', 'income']):
            financial['revenue_docs'].append(f)
    
    return financial


def calculate_forecast(deals: List[Dict]) -> Dict:
    """Calculate revenue forecast."""
    total_deal_value = sum(d['value'] for d in deals)
    
    # Determine close probability by stage
    stage_probs = {
        'closed': 0.95,
        'negotiation': 0.6,
        'proposal': 0.3,
        'unknown': 0.1,
    }
    
    expected_value = 0
    for deal in deals:
        prob = stage_probs.get(deal['stage'], 0.1)
        if deal['sentiment'] == 'positive':
            prob += 0.2
        expected_value += deal['value'] * prob
    
    # Forecast ranges
    forecast = {
        'expected': round(expected_value, 2),
        'conservative': round(expected_value * 0.5, 2),
        'optimistic': round(expected_value * 1.5, 2),
        'deals_tracked': len(deals),
        'total_deal_value': round(total_deal_value, 2),
    }
    
    return forecast


def main(execute=True, limit=30):
    """Main execution."""
    print("💰 Revenue Prediction AI - Forecasting revenue...")
    
    deals = analyze_deal_emails()
    print(f"📊 Analyzed {len(deals)} deal-related emails")
    
    financial = analyze_drive_financials()
    print(f"📁 Found {len(financial['invoices'])} invoices, {len(financial['contracts'])} contracts")
    
    forecast = calculate_forecast(deals)
    
    # Load history
    if REVENUE_LOG.exists():
        history = json.loads(REVENUE_LOG.read_text())
    else:
        history = {'predictions': []}
    
    prediction_record = {
        'timestamp': datetime.now(timezone.utc).isoformat(),
        'forecast': forecast,
        'deals': deals,
        'documents': len(financial['invoices']) + len(financial['contracts']),
    }
    history['predictions'].append(prediction_record)
    REVENUE_LOG.parent.mkdir(parents=True, exist_ok=True)
    REVENUE_LOG.write_text(json.dumps(history, indent=2))
    
    print(f"\n📈 Revenue Forecast:")
    print(f"  💵 Expected: ${forecast['expected']:,.0f}")
    print(f"  📊 Conservative: ${forecast['conservative']:,.0f}")
    print(f"  🚀 Optimistic: ${forecast['optimistic']:,.0f}")
    print(f"  📁 Deals tracked: {forecast['deals_tracked']}")
    
    if execute:
        telegram_send(
            f"💰 Revenue Forecast: ${forecast['expected']:,.0f} expected\n"
            f"Deals: {forecast['deals_tracked']}"
        )
    
    return forecast


if __name__ == '__main__':
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument('--execute', action='store_true')
    parser.add_argument('--limit', type=int, default=30)
    args = parser.parse_args()
    main(execute=args.execute, limit=args.limit)