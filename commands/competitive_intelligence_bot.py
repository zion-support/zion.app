#!/usr/bin/env python3
"""
Competitive Intelligence Bot - Monitor competitor moves and market changes

Tracks competitor announcements, pricing changes, and market trends
to keep Zion Tech Group informed.
"""

import sys, json
from pathlib import Path
from datetime import datetime, timezone
from typing import Dict, List

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, gmail_get, telegram_send

INTEL_LOG = WORKSPACE / 'zion.app' / 'data' / 'competitive_intel.json'

# Known competitors to track
COMPETITORS = {
    'AWS': ['aws.amazon.com', 'amazon web services'],
    'Google Cloud': ['cloud.google.com', 'gcp'],
    'Microsoft Azure': ['azure.microsoft.com', 'azure'],
    'Vercel': ['vercel.com'],
    'Netlify': ['netlify.com'],
    'Heroku': ['heroku.com'],
    'DigitalOcean': ['digitalocean.com']
}


def analyze_competitor_emails(limit=30) -> List[Dict]:
    """Analyze emails for competitor mentions."""
    intel = []
    queries = [
        'subject:"market update"',
        'subject:"competitor"',
        'subject:"pricing change"',
        'from:newsletter@',
        'from:news@',
    ]
    
    for query in queries:
        emails = gmail_search(query, limit=10)
        for email in emails:
            msg = gmail_get(email['id'])
            headers = msg.get('payload', {}).get('headers', [])
            subject = next((h['value'] for h in headers if h['name'] == 'Subject'), '')
            snippet = msg.get('snippet', '').lower()
            
            # Check for competitor mentions
            for name, keywords in COMPETITORS.items():
                for kw in keywords:
                    if kw in snippet or kw in subject.lower():
                        intel.append({
                            'competitor': name,
                            'subject': subject,
                            'insight': snippet[:200],
                            'timestamp': datetime.now(timezone.utc).isoformat(),
                        })
                        break
    
    return intel


def analyze_pricing_signals(limit=30) -> List[Dict]:
    """Look for pricing-related market signals."""
    signals = []
    queries = [
        'subject:"price update"',
        'subject:"new pricing"',
        'subject:"rate increase"',
        'subject:"cost reduction"',
    ]
    
    for query in queries:
        emails = gmail_search(query, limit=10)
        for email in emails:
            msg = gmail_get(email['id'])
            headers = msg.get('payload', {}).get('headers', [])
            subject = next((h['value'] for h in headers if h['name'] == 'Subject'), '')
            snippet = msg.get('snippet', '')
            
            import re
            # Look for percentage changes
            changes = re.findall(r'(\d+%)\s*(increase|decrease|reduction)', snippet, re.I)
            if changes:
                signals.append({
                    'type': 'pricing_change',
                    'subject': subject,
                    'change': changes[0] if changes else None,
                    'timestamp': datetime.now(timezone.utc).isoformat(),
                })
    
    return signals


def generate_intel_report(intel: List[Dict], signals: List[Dict]) -> str:
    """Generate intelligence report."""
    report = "# Competitive Intelligence Report\n\n"
    
    if intel:
        report += "## Competitor Mentions\n"
        seen = set()
        for item in intel:
            key = item['competitor']
            if key not in seen:
                report += f"- **{item['competitor']}**: {item['subject'][:50]}\n"
                seen.add(key)
    
    if signals:
        report += "\n## Pricing Signals\n"
        for s in signals[:5]:
            report += f"- {s['subject'][:60]}\n"
    
    return report


def main(execute=True, limit=30):
    """Main execution."""
    print("🕵️ Competitive Intelligence Bot - Scanning market signals...")
    
    intel = analyze_competitor_emails(limit)
    signals = analyze_pricing_signals(limit)
    
    print(f"📊 Found {len(intel)} competitor mentions, {len(signals)} pricing signals")
    
    # Update log
    if INTEL_LOG.exists():
        log = json.loads(INTEL_LOG.read_text())
    else:
        log = {'intel': []}
    
    log['intel'].extend(intel)
    log['signals'] = signals
    log['last_updated'] = datetime.now(timezone.utc).isoformat()
    INTEL_LOG.parent.mkdir(parents=True, exist_ok=True)
    INTEL_LOG.write_text(json.dumps(log, indent=2))
    
    if execute:
        report = generate_intel_report(intel, signals)
        telegram_send(f"🕵️ Competitive Intel: {len(intel)} mentions, {len(signals)} price signals")
    
    return intel + signals


if __name__ == '__main__':
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument('--execute', action='store_true')
    parser.add_argument('--limit', type=int, default=30)
    args = parser.parse_args()
    main(execute=args.execute, limit=args.limit)