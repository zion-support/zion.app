#!/usr/bin/env python3
"""
Price Optimization Engine - Dynamically adjust rate cards from market signals

Monitors competitor pricing, market demand signals, and revenue patterns to
suggest optimal pricing adjustments for Zion Tech Group services.
"""

import sys, json, re
from pathlib import Path
from datetime import datetime, timezone
from typing import Dict, List, Optional

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, gmail_get, drive_list, telegram_send

RATE_CARD_FILE = WORKSPACE / 'ZION_GLOBAL_RATE_CARD_PER_COUNTRY_2026_(US$).xlsx'
OPTIMIZATION_LOG = WORKSPACE / 'zion.app' / 'data' / 'price_optimization.json'

# Service categories and their elasticity
SERVICE_ELASTICITY = {
    'AI Development': 0.8,  # Less elastic - premium service
    'Blockchain': 0.9,
    'API Integration': 0.7,
    'Consulting': 1.2,  # More elastic
    'Managed Services': 0.5,
}

COMPETITOR_DOMAINS = [
    'upwork.com', 'toptal.com', 'fiverr.com', 
    'freelancer.com', 'guru.com', 'peopleperhour.com'
]


def load_current_rates() -> Dict:
    """Load current rate card from Google Drive."""
    # Check if rate card exists in Drive
    files = drive_list(limit=20)
    rate_card_file = None
    for f in files:
        if 'rate' in f['name'].lower() and 'card' in f['name'].lower():
            rate_card_file = f
            break
    
    if rate_card_file:
        # Return structured data - in production would parse Excel
        return {
            'source': rate_card_file['name'],
            'last_updated': rate_card_file.get('modifiedTime', ''),
            'base_rates': {
                'junior': 50,
                'mid': 100,
                'senior': 200,
                'architect': 350,
            }
        }
    return {'base_rates': {'junior': 50, 'mid': 100, 'senior': 200, 'architect': 350}}


def analyze_market_signals() -> Dict:
    """Analyze emails for pricing signals."""
    signals = {
        'competitor_mentions': 0,
        'price_inquiries': 0,
        'budget_discussions': 0,
        'urgency_signals': 0,
        'positive_sentiment': 0,
    }
    
    # Search for pricing-related emails
    queries = [
        'subject:"pricing"',
        'subject:"rate"',
        'subject:"quote"',
        'subject:"budget"',
        'subject:competitor',
    ]
    
    for query in queries:
        emails = gmail_search(query, limit=20)
        for email in emails:
            msg = gmail_get(email['id'])
            snippet = msg.get('snippet', '').lower()
            subject = ''
            headers = msg.get('payload', {}).get('headers', [])
            for h in headers:
                if h['name'] == 'Subject':
                    subject = h['value'].lower()
            
            full_text = f"{subject} {snippet}"
            
            # Count competitor mentions
            for domain in COMPETITOR_DOMAINS:
                if domain in full_text:
                    signals['competitor_mentions'] += 1
            
            # Price inquiries
            if any(w in full_text for w in ['price', 'rate', 'cost', 'quote']):
                signals['price_inquiries'] += 1
            
            # Budget discussions
            if any(w in full_text for w in ['budget', 'affordable', 'cheap', 'expensive']):
                signals['budget_discussions'] += 1
            
            # Urgency signals
            if any(w in full_text for w in ['urgent', 'asap', 'immediately', 'deadline']):
                signals['urgency_signals'] += 1
            
            # Positive sentiment (willingness to pay)
            if any(w in full_text for w in ['interested', 'sounds good', 'let\'s proceed', 'yes']):
                signals['positive_sentiment'] += 1
    
    return signals


def calculate_price_adjustment(current_rates: Dict, signals: Dict) -> Dict:
    """Calculate recommended price adjustments."""
    adjustment = 0.0
    reasons = []
    
    # Positive signals increase prices
    if signals['positive_sentiment'] > 5:
        adjustment += 0.05
        reasons.append('High demand signals')
    
    if signals['urgency_signals'] > 3:
        adjustment += 0.03
        reasons.append('Urgent demand')
    
    # Competitor mentions might decrease prices
    if signals['competitor_mentions'] > 5:
        adjustment -= 0.05
        reasons.append('High competition')
    
    if signals['budget_discussions'] > 5:
        adjustment -= 0.03
        reasons.append('Price sensitivity')
    
    # Calculate new rates
    new_rates = {}
    for level, rate in current_rates['base_rates'].items():
        new_rate = rate * (1 + adjustment)
        new_rates[level] = round(new_rate, 2)
    
    confidence = min(1.0, len(reasons) * 0.25)  # More signals = higher confidence
    
    return {
        'adjustment_pct': round(adjustment * 100, 1),
        'current_rates': current_rates['base_rates'],
        'recommended_rates': new_rates,
        'confidence': round(confidence, 2),
        'reasons': reasons,
    }


def analyze_revenue_trends() -> Dict:
    """Analyze revenue patterns from Drive files."""
    trends = {'monthly_growth': 0, 'trending_up': True}
    
    # Look for financial spreadsheets
    files = drive_list(limit=30)
    for f in files:
        if any(kw in f['name'].lower() for kw in ['revenue', 'sales', 'income', 'profit']):
            # In production, would parse actual financial data
            trends['monthly_growth'] = 5  # Placeholder
    
    return trends


def generate_recommendation(adjustment: Dict, trends: Dict) -> str:
    """Generate human-readable recommendation."""
    if adjustment['adjustment_pct'] > 0:
        direction = 'INCREASE'
        emoji = '📈'
    elif adjustment['adjustment_pct'] < 0:
        direction = 'DECREASE'
        emoji = '📉'
    else:
        direction = 'MAINTAIN'
        emoji = '➡️'
    
    report = f"""{emoji} Rate Card Optimization Report

Action: {direction} rates by {abs(adjustment['adjustment_pct'])}%

Current vs Recommended:
"""
    for level in adjustment['current_rates']:
        curr = adjustment['current_rates'][level]
        rec = adjustment['recommended_rates'][level]
        diff = rec - curr
        report += f"  {level.capitalize()}: ${curr} → ${rec} ({diff:+.0f})\n"
    
    report += f"\nConfidence: {adjustment['confidence']*100:.0f}%\n"
    if adjustment['reasons']:
        report += f"Reasons: {', '.join(adjustment['reasons'])}\n"
    
    return report


def main(execute=True, limit=50):
    """Main execution."""
    print("📊 Price Optimization Engine - Analyzing market signals...")
    
    # Load current rates
    rates = load_current_rates()
    print(f"📁 Loaded rate card: {rates.get('source', 'default rates')}")
    
    # Analyze market signals
    signals = analyze_market_signals()
    print(f"📈 Market signals: competitor={signals['competitor_mentions']}, price_inq={signals['price_inquiries']}")
    
    # Analyze revenue trends
    trends = analyze_revenue_trends()
    
    # Calculate adjustment
    adjustment = calculate_price_adjustment(rates, signals)
    
    # Generate recommendation
    report = generate_recommendation(adjustment, trends)
    
    # Save to log
    if WORKSPACE / 'zion.app' / 'data':
        (WORKSPACE / 'zion.app' / 'data').mkdir(parents=True, exist_ok=True)
    log_entry = {
        'timestamp': datetime.now(timezone.utc).isoformat(),
        'signals': signals,
        'adjustment': adjustment,
        'trends': trends,
    }
    
    if OPTIMIZATION_LOG.exists():
        history = json.loads(OPTIMIZATION_LOG.read_text())
    else:
        history = {'adjustments': []}
    
    history['adjustments'].append(log_entry)
    OPTIMIZATION_LOG.write_text(json.dumps(history, indent=2))
    
    print("\n" + report)
    
    if execute and adjustment['reasons']:
        telegram_send(f"📊 Price Optimization: {adjustment['adjustment_pct']:+.1f}% adjustment recommended")
    
    return adjustment


if __name__ == '__main__':
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument('--execute', action='store_true')
    parser.add_argument('--limit', type=int, default=50)
    args = parser.parse_args()
    main(execute=args.execute, limit=args.limit)