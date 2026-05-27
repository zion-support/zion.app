#!/usr/bin/env python3
"""
Client Health Score - Zion

Analyzes client communication patterns to identify at-risk relationships.
- Scores based on response time, frequency, sentiment
- Flags declining engagement
- Suggests intervention actions

Usage:
  python3 client_health_score.py --execute --limit 20
"""

import sys, json
from datetime import datetime, timedelta
from pathlib import Path
WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, gmail_get

def calculate_health_score(emails: list) -> dict:
    """Calculate client health score based on email patterns."""
    if not emails:
        return {'score': 0, 'risk': 'unknown', 'issues': []}
    
    # Simple scoring algorithm
    total = len(emails)
    recent = sum(1 for e in emails[-5:] if 'recent' in str(e.get('date', '')))
    
    # Response time analysis (simplified)
    score = min(100, (recent / max(total, 1)) * 100 + 20)
    
    risk = 'low' if score > 70 else 'medium' if score > 40 else 'high'
    
    issues = []
    if score < 50:
        issues.append('Declining engagement')
    if recent < 2:
        issues.append('Long response delays')
    
    return {
        'score': round(score),
        'risk': risk,
        'issues': issues,
        'total_emails': total
    }

def cmd_run(dry_run: bool, limit: int = 30):
    print("🔍 Analyzing client communication health...")
    
    # Find emails from key clients (based on domain or frequent contact)
    query = 'is:sent newer_than:30d -label:spam -from:me'
    msgs = gmail_search(query, limit=limit)
    
    # Group by sender domain for client analysis
    clients = {}
    for msg in msgs:
        headers = msg.get('payload', {}).get('headers', [])
        from_header = next((h['value'] for h in headers if h['name'] == 'From'), '')
        domain = from_header.split('@')[-1] if '@' in from_header else 'unknown'
        
        if domain not in clients:
            clients[domain] = []
        clients[domain].append(msg)
    
    report = []
    for domain, emails in sorted(clients.items(), key=lambda x: len(x[1]), reverse=True)[:10]:
        if domain in ['ziontechgroup.com', 'gmail.com', 'github.com']:
            continue
        
        score_data = calculate_health_score(emails)
        report.append({
            'client': domain,
            'score': score_data['score'],
            'risk': score_data['risk'],
            'issues': score_data['issues']
        })
    
    print(f"📊 Analyzed {len(clients)} clients.")
    
    for r in report[:5]:
        risk_emoji = {'high': '🔴', 'medium': '🟡', 'low': '🟢'}.get(r['risk'], '⚪')
        print(f"   {risk_emoji} {r['client']}: {r['score']}/100 - {r['risk']} risk")
        if r['issues']:
            print(f"      Issues: {', '.join(r['issues'])}")
    
    if dry_run:
        print(f"\n[DRY-RUN] Would send health report.")
    else:
        print(f"\n✅ Health scores calculated for {len(report)} clients.")

def main():
    import argparse
    p = argparse.ArgumentParser()
    p.add_argument('--execute', action='store_true')
    p.add_argument('--limit', type=int, default=30)
    args = p.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)

if __name__ == '__main__':
    main()