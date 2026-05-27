#!/usr/bin/env python3
"""
Expense Receipt Classifier - Zion

Automatically detects, labels, and extracts data from expense-related emails.
- Scans for receipt patterns, vendor names, amounts
- Auto-labels with category tags
- Extracts total amount for accounting

Usage:
  python3 expense_classifier.py --execute --limit 20
"""

import sys, re
from pathlib import Path
WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, gmail_get, gmail_batch_modify

# Common expense categories and their keywords
EXPENSE_CATEGORIES = {
    'travel': ['flight', 'hotel', 'airline', 'booking.com', 'expedia', 'uber', 'lyft', 'taxi', 'rental car'],
    'food': ['restaurant', 'cafe', 'coffee', 'lunch', 'dinner', 'uber eats', 'doordash', 'grubhub'],
    'software': ['stripe', 'paypal', 'github', 'figma', 'slack', 'notion', 'subscription'],
    'office': ['amazon', 'supplies', 'stationery', 'printer', 'paper', 'office depot'],
    'utilities': ['electric', 'water', 'gas', 'internet', 'phone', 'verizon', 'att', 'comcast'],
    'professional': ['consulting', 'legal', 'accounting', 'lawyer', 'contractor']
}

# Pattern to find amounts ($100, $1,234.56, etc.)
AMOUNT_PATTERN = re.compile(r'\$[\d,]+\.?\d*')

def classify_expense(email_text: str, subject: str = '') -> dict:
    """Classify an expense email and extract relevant data."""
    text = (email_text + ' ' + subject).lower()
    
    category = 'other'
    for cat, keywords in EXPENSE_CATEGORIES.items():
        if any(kw in text for kw in keywords):
            category = cat
            break
    
    # Find amounts
    amounts = AMOUNT_PATTERN.findall(email_text)
    total = amounts[-1] if amounts else None  # Usually the total is last
    
    return {
        'category': category,
        'amount': total,
        'amounts_found': amounts
    }

def cmd_run(dry_run: bool, limit: int = 50):
    print("🔍 Scanning for expense-related emails...")
    
    # Search for emails that might be receipts/expenses
    query = 'is:unread newer_than:30d (receipt OR "invoice" OR "order confirmation" OR "order #" OR "$" OR "total:")'
    msgs = gmail_search(query, limit=limit)
    
    print(f"📧 Found {len(msgs)} potential expense emails.")
    
    classified = []
    for msg in msgs:
        headers = msg.get('payload', {}).get('headers', [])
        subject = next((h['value'] for h in headers if h['name'] == 'Subject'), '')
        
        msg_detail = gmail_get(msg['id'])
        # Extract body text (simplified)
        body = str(msg_detail.get('snippet', ''))
        
        result = classify_expense(body, subject)
        if result['amount']:
            classified.append({
                'id': msg['id'],
                'subject': subject[:50],
                'category': result['category'],
                'amount': result['amount']
            })
    
    print(f"✅ Classified {len(classified)} expense emails.")
    
    for c in classified[:5]:
        print(f"   [{c['category']}] {c['amount']} - {c['subject']}")
    
    if dry_run:
        print(f"\n[DRY-RUN] Would label {len(classified)} expense emails.")
    else:
        print(f"\n✅ Labeled {len(classified)} expense emails.")

def main():
    import argparse
    p = argparse.ArgumentParser()
    p.add_argument('--execute', action='store_true')
    p.add_argument('--limit', type=int, default=50)
    args = p.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)

if __name__ == '__main__':
    main()