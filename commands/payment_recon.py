#!/usr/bin/env python3
from __future__ import annotations

"""
Payment Reconciliation — Zion Tech Group (robust v2)

Scans inbox for "Payment received" / "Invoice paid" emails.
Matches them to open invoices (tracked via invoice_reminder state).
Marks invoices as paid in ledger; updates aging report.

Usage:
  python3 payment_recon.py [--execute] [--limit 10]
"""

import sys, os, re, json, datetime, argparse
from pathlib import Path

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, gmail_get
from llm_client import chat

INVOICE_DB = WORKSPACE / 'zion.app' / 'data' / 'invoice_tracker.json'
PAYMENT_LEDGER = WORKSPACE / 'zion.app' / 'data' / 'payments.json'
DEFAULT_LIMIT = 10

def load_invoice_tracker() -> dict:
    if INVOICE_DB.exists():
        return json.loads(INVOICE_DB.read_text())
    return {'invoices': []}

def save_invoice_tracker(tracker: dict):
    INVOICE_DB.parent.mkdir(parents=True, exist_ok=True)
    INVOICE_DB.write_text(json.dumps(tracker, indent=2))

def load_payments() -> dict:
    if PAYMENT_LEDGER.exists():
        return json.loads(PAYMENT_LEDGER.read_text())
    return {'payments': [], 'lastUpdate': None}

def save_payments(ledger: dict):
    PAYMENT_LEDGER.parent.mkdir(parents=True, exist_ok=True)
    PAYMENT_LEDGER.write_text(json.dumps(ledger, indent=2))

def find_payment_emails(days: int = 30, limit: int = DEFAULT_LIMIT) -> list:
    since = (datetime.date.today() - datetime.timedelta(days=days)).isoformat()
    query = f'after:{since} (subject:"payment received" OR subject:"invoice paid" OR subject:"receipt" OR body:"payment received")'
    msgs = gmail_search(query, limit=limit)
    return msgs

def extract_body_from_gmail_message(msg):
    payload = msg.get('payload', {})
    if 'parts' in payload:
        for part in payload['parts']:
            if part.get('mimeType') == 'text/plain':
                data = part.get('body', {}).get('data', '')
                if data:
                    import base64
                    return base64.urlsafe_b64decode(data + '===').decode('utf-8', errors='replace')
    body = payload.get('body', {}).get('data', '')
    if body:
        import base64
        return base64.urlsafe_b64decode(body + '===').decode('utf-8', errors='replace')
    return ''

def extract_payment_details(msg_text: str) -> dict:
    prompt = (
        "Extract payment details from this email. Return JSON with keys:\n"
        "amount (number), currency (3-letter code), invoice_number (string), vendor (string), paid_date (YYYY-MM-DD).\n"
        "If any field missing, set as null.\n\n"
        f"Email excerpt:\n{msg_text[:2000]}"
    )
    try:
        resp = chat([{"role":"user","content":prompt}], provider="auto")
        content = resp['content'].strip()
        if '```' in content:
            parts = content.split('```')
            for part in parts:
                if '{' in part:
                    content = part.strip()
                    break
        data = json.loads(content)
        return data
    except Exception as e:
        print(f"   ⚠️  Could not parse payment details: {e}")
        return {}

def match_invoice(invoice_num: str, tracker: dict) -> dict | None:
    for inv in tracker['invoices']:
        if inv.get('invoice_number', '').lower() == invoice_num.lower() and inv.get('status') != 'paid':
            return inv
    return None

def cmd_run(dry_run: bool, limit: int):
    print("💰 Payment Reconciliation scanning for paid invoices…")
    payment_emails = find_payment_emails(days=30, limit=limit)
    print(f"   Found {len(payment_emails)} payment-related emails (limit={limit})")

    tracker = load_invoice_tracker()
    ledger = load_payments()
    matched = 0
    new_payments = 0

    for pe in payment_emails:
        msg_id = pe['id']
        full = gmail_get(msg_id)
        headers = {h['name']: h['value'] for h in full.get('payload', {}).get('headers', [])}
        subject = headers.get('Subject','')
        body = extract_body_from_gmail_message(full)[:2000]

        if any(p['message_id'] == msg_id for p in ledger['payments']):
            continue

        details = extract_payment_details(subject + "\n" + body)
        if not details or not details.get('invoice_number'):
            continue

        invoice_num = details['invoice_number']
        match = match_invoice(invoice_num, tracker)
        if match:
            print(f"   ✅ Matched payment to invoice {invoice_num}")
            if dry_run:
                print(f"      [DRY-RUN] Would mark invoice {invoice_num} as paid")
                new_payments += 1
                continue

            match['status'] = 'paid'
            match['paid_date'] = details.get('paid_date', datetime.date.today().isoformat())
            matched += 1

            ledger['payments'].append({
                'message_id': msg_id,
                'invoice_number': invoice_num,
                'amount': details.get('amount'),
                'currency': details.get('currency'),
                'vendor': details.get('vendor'),
                'paid_date': details.get('paid_date'),
                'processed_date': datetime.date.today().isoformat(),
            })
            ledger['lastUpdate'] = datetime.datetime.utcnow().isoformat()
        else:
            print(f"   ⚠️  Payment for {invoice_num} not found in open invoices")

    if not dry_run:
        save_invoice_tracker(tracker)
        save_payments(ledger)

    print(f"\n✅ Matched {matched} payments to invoices.")
    if dry_run:
        print(f"   (dry-run: {new_payments} would be matched)")
        print("💡 Add --execute to update ledger.")

def main():
    parser = argparse.ArgumentParser(description='Payment Reconciliation')
    parser.add_argument('--execute', action='store_true', help='Apply matches (default dry-run)')
    parser.add_argument('--limit', type=int, default=DEFAULT_LIMIT, help='Max payment emails to scan')
    args = parser.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)

if __name__ == '__main__':
    main()
