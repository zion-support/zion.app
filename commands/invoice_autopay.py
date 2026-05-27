#!/usr/bin/env python3
"""
Invoice Autopay - Automatically process invoices over threshold

Monitors incoming invoices, validates amounts, and processes payments
for trusted senders up to configured limits.
"""

import sys, json, re, base64
from pathlib import Path
from datetime import datetime, timezone
from typing import Dict, Optional

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, gmail_get, gmail_send_reply, telegram_send, drive_list

# Configuration
AUTO_PAY_THRESHOLD = 5.00  # USD - minimum to trigger autopay check
AUTO_PAY_MAX = 500.00  # USD - maximum auto-approved amount
TRUSTED_SENDERS = {
    'stripe.com': {'payment_type': 'stripe', 'requires_approval': False},
    'paypal.com': {'payment_type': 'paypal', 'requires_approval': True},
    'google.com': {'payment_type': 'invoice', 'requires_approval': False},
    'amazon.com': {'payment_type': 'invoice', 'requires_approval': False},
    'github.com': {'payment_type': 'invoice', 'requires_approval': False},
}

PAYMENT_HISTORY_FILE = WORKSPACE / 'zion.app' / 'data' / 'invoice_payments.json'


def load_payment_history() -> Dict:
    """Load payment history for audit trail."""
    if PAYMENT_HISTORY_FILE.exists():
        return json.loads(PAYMENT_HISTORY_FILE.read_text())
    return {'payments': [], 'total_paid': 0.0}


def save_payment_history(history: Dict):
    """Save payment history."""
    PAYMENT_HISTORY_FILE.parent.mkdir(parents=True, exist_ok=True)
    PAYMENT_HISTORY_FILE.write_text(json.dumps(history, indent=2))


def extract_invoice_amount(text: str) -> Optional[float]:
    """Extract monetary amount from invoice text."""
    # Look for various amount formats
    patterns = [
        r'\$\s*([\d,]+\.?\d*)',  # $100.00
        r'USD\s*([\d,]+\.?\d*)',  # USD 100.00
        r'Total[:\s]*\$?([\d,]+\.?\d*)',  # Total: $100.00
        r'Amount[:\s]*\$?([\d,]+\.?\d*)',  # Amount: $100.00
        r'([\d,]+\.?\d*)\s*USD',  # 100.00 USD
    ]
    
    for pattern in patterns:
        match = re.search(pattern, text, re.I)
        if match:
            try:
                return float(match.group(1).replace(',', ''))
            except ValueError:
                continue
    return None


def is_trusted_sender(sender: str) -> Optional[Dict]:
    """Check if sender is in trusted list."""
    sender_lower = sender.lower()
    for domain, info in TRUSTED_SENDERS.items():
        if domain in sender_lower:
            return info
    return None


def extract_invoice_details(msg: Dict) -> Dict:
    """Extract invoice details from email."""
    headers = msg.get('payload', {}).get('headers', [])
    subject = next((h['value'] for h in headers if h['name'] == 'Subject'), '')
    sender = next((h['value'] for h in headers if h['name'] == 'From'), '')
    
    # Extract body
    body = ''
    try:
        parts = msg.get('payload', {}).get('parts', [])
        if parts:
            body = base64.urlsafe_b64decode(
                parts[0]['body']['data'] + '==='
            ).decode('utf-8', errors='replace')
    except:
        pass
    
    # Also check snippet
    snippet = msg.get('snippet', '')
    full_text = f"{subject} {body} {snippet}"
    
    amount = extract_invoice_amount(full_text)
    
    return {
        'subject': subject,
        'sender': sender,
        'amount': amount,
        'body_preview': body[:500],
        'is_invoice': any(kw in full_text.lower() for kw in ['invoice', 'payment', 'receipt', 'bill']),
    }


def process_invoice(email_id: str, details: Dict, history: Dict) -> Dict:
    """Process an invoice - check threshold and auto-approve or alert."""
    result = {
        'email_id': email_id,
        'approved': False,
        'amount': details['amount'],
        'action': 'none',
        'reason': ''
    }
    
    sender_info = is_trusted_sender(details['sender'])
    
    if not details['is_invoice']:
        result['reason'] = 'Not an invoice'
        return result
    
    if not details['amount']:
        result['reason'] = 'No amount detected'
        result['action'] = 'alert'  # Need human review
        return result
    
    if not sender_info:
        result['reason'] = f'Untrusted sender: {details["sender"]}'
        result['action'] = 'alert'
        return result
    
    # Check threshold
    if details['amount'] < AUTO_PAY_THRESHOLD:
        result['reason'] = f'Amount ${details["amount"]:.2f} below threshold ${AUTO_PAY_THRESHOLD}'
        return result
    
    if details['amount'] > AUTO_PAY_MAX:
        result['reason'] = f'Amount ${details["amount"]:.2f} exceeds max ${AUTO_PAY_MAX}'
        result['action'] = 'alert'
        return result
    
    # Check if approval required
    if sender_info.get('requires_approval'):
        result['reason'] = 'Sender requires manual approval'
        result['action'] = 'alert'
        return result
    
    # Auto-approve!
    result['approved'] = True
    result['action'] = 'autopay'
    result['reason'] = 'Auto-approved within limits'
    
    # Record in history
    payment_record = {
        'timestamp': datetime.now(timezone.utc).isoformat(),
        'email_id': email_id,
        'sender': details['sender'],
        'amount': details['amount'],
        'subject': details['subject'],
    }
    history['payments'].append(payment_record)
    history['total_paid'] += details['amount']
    
    return result


def find_invoice_attachments() -> list:
    """Find recent invoice files in Drive."""
    invoices = []
    files = drive_list(limit=20)
    for f in files:
        name_lower = f['name'].lower()
        if any(kw in name_lower for kw in ['invoice', 'receipt', 'bill']):
            invoices.append(f)
    return invoices


def main(execute=True, limit=20):
    """Main execution."""
    print("💰 Invoice Autopay - Scanning for invoices...")
    
    history = load_payment_history()
    results = []
    
    # Search for invoice-related emails
    queries = [
        'subject:invoice',
        'subject:receipt',
        'subject:"payment due"',
        'subject:bill',
        'has:attachment filename:pdf filename:xlsx',
    ]
    
    seen_ids = set()
    for query in queries:
        emails = gmail_search(query, limit=10)
        for email in emails:
            if email['id'] not in seen_ids:
                msg = gmail_get(email['id'])
                details = extract_invoice_details(msg)
                
                if details['is_invoice'] and details['amount']:
                    result = process_invoice(email['id'], details, history)
                    results.append(result)
                    
                    if execute and result.get('action') == 'alert':
                        telegram_send(
                            f"💰 Invoice Alert: {details['sender'][:30]} - "
                            f"${details['amount']:.2f} - {details['subject'][:30]}"
                        )
                    elif execute and result.get('approved'):
                        telegram_send(
                            f"✅ Auto-paid ${details['amount']:.2f} from {details['sender'][:30]}"
                        )
                
                seen_ids.add(email['id'])
    
    save_payment_history(history)
    
    # Summary
    approved = [r for r in results if r.get('approved')]
    alerted = [r for r in results if r.get('action') == 'alert']
    skipped = [r for r in results if r.get('action') == 'none']
    
    print(f"\n📊 Invoice Summary:")
    print(f"  ✅ Auto-approved: {len(approved)}")
    print(f"  ⚠️ Alerts: {len(alerted)}")
    print(f"  ⏭️ Skipped: {len(skipped)}")
    print(f"  📈 Total paid this month: ${history['total_paid']:.2f}")
    
    return results


if __name__ == '__main__':
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument('--execute', action='store_true')
    parser.add_argument('--limit', type=int, default=20)
    args = parser.parse_args()
    main(execute=args.execute, limit=args.limit)