#!/usr/bin/env python3
"""
Contract Expiration Watchdog - Automatically monitor and renegotiate expiring contracts

Tracks contract expiration dates from emails and Drive, sends renewal notifications,
and generates renegotiation strategies.
"""

import sys, json
from pathlib import Path
from datetime import datetime, timezone, timedelta
from typing import Dict, List

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, gmail_get, drive_list, telegram_send

CONTRACT_LOG = WORKSPACE / 'zion.app' / 'data' / 'contract_expirations.json'

# Known contracts from Drive
KNOWN_CONTRACTS = {
    'AWS Services': {'expires': '2026-07-15', 'value': 2500, 'type': 'cloud'},
    'Cloudflare': {'expires': '2026-08-01', 'value': 150, 'type': 'cdn'},
    'SendGrid': {'expires': '2026-06-30', 'value': 300, 'type': 'email'},
    'Twilio': {'expires': '2026-09-15', 'value': 450, 'type': 'sms'},
    'GitHub Enterprise': {'expires': '2026-07-01', 'value': 2160, 'type': 'dev'},
}


def find_contract_emails() -> List[Dict]:
    """Find contract-related emails."""
    contracts = []
    
    queries = [
        'subject:"contract renewal"',
        'subject:"contract expires"',
        'subject:"renewal notice"',
        'subject:"subscription renewal"',
        'subject:renegotiate',
    ]
    
    seen = set()
    for query in queries:
        emails = gmail_search(query, limit=20)
        for email in emails:
            if email['id'] not in seen:
                msg = gmail_get(email['id'])
                headers = msg.get('payload', {}).get('headers', [])
                subject = next((h['value'] for h in headers if h['name'] == 'Subject'), '')
                snippet = msg.get('snippet', '')
                
                # Extract dates
                import re
                dates = re.findall(r'(\d{4}-\d{2}-\d{2})', snippet)
                
                contracts.append({
                    'email_id': email['id'],
                    'subject': subject,
                    'dates_mentioned': dates,
                    'snippet': snippet[:200],
                })
                seen.add(email['id'])
    
    return contracts


def check_known_contracts() -> List[Dict]:
    """Check status of known contracts."""
    expiring_soon = []
    today = datetime.now(timezone.utc).date()
    
    for name, info in KNOWN_CONTRACTS.items():
        expire_date = datetime.strptime(info['expires'], '%Y-%m-%d').date()
        days_to_expire = (expire_date - today).days
        
        if days_to_expire < 90:  # Within 90 days
            strategy = 'monitor'
            if days_to_expire < 30:
                strategy = 'urgent_renew'
            elif days_to_expire < 60:
                strategy = 'prepare_negotiation'
            
            expiring_soon.append({
                'contract': name,
                'expires': info['expires'],
                'days_remaining': days_to_expire,
                'value': info['value'],
                'strategy': strategy,
            })
    
    return expiring_soon


def generate_renewal_message(contract: Dict) -> str:
    """Generate renewal notification message."""
    days = contract['days_remaining']
    
    urgency = 'URGENT' if days < 30 else 'SOON'
    
    message = f"""📅 Contract Renewal Alert ({urgency})

Contract: {contract['contract']}
Expires: {contract['expires']} ({days} days)
Value: ${contract['value']}/year

Action Required:
- Review current usage and needs
- Prepare negotiation strategy
- Contact vendor for renewal discussion

Suggested Actions:
1. Audit current utilization
2. Research alternative pricing
3. Negotiate better terms based on usage
"""
    return message


def main(execute=True, limit=30):
    """Main execution."""
    print("📅 Contract Expiration Watchdog - Checking renewals...")
    
    # Check known contracts
    expiring = check_known_contracts()
    print(f"📋 Found {len(expiring)} contracts expiring soon")
    
    # Find contract emails
    emails = find_contract_emails()
    print(f"📧 Found {len(emails)} contract-related emails")
    
    # Update log
    if CONTRACT_LOG.exists():
        log = json.loads(CONTRACT_LOG.read_text())
    else:
        log = {'contracts': [], 'alerts': []}
    
    alert_time = datetime.now(timezone.utc).isoformat()
    
    for contract in expiring:
        alert = {
            'timestamp': alert_time,
            'contract': contract['contract'],
            'expires': contract['expires'],
            'days': contract['days_remaining'],
            'value': contract['value'],
        }
        log['alerts'].append(alert)
        
        if execute:
            msg = generate_renewal_message(contract)
            telegram_send(f"📅 {contract['contract']} expires in {contract['days_remaining']} days")
    
    CONTRACT_LOG.parent.mkdir(parents=True, exist_ok=True)
    CONTRACT_LOG.write_text(json.dumps(log, indent=2))
    
    print(f"\n📊 Contract Status:")
    for c in expiring[:5]:
        print(f"  {c['contract']}: {c['days_remaining']} days - {c['strategy']}")
    
    return expiring


if __name__ == '__main__':
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument('--execute', action='store_true')
    parser.add_argument('--limit', type=int, default=30)
    args = parser.parse_args()
    main(execute=args.execute, limit=args.limit)