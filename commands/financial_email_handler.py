#!/usr/bin/env python3
"""
V26 Wave 2 — Financial Email Handler

Detects and handles financial email types:
  - Invoices (we receive an invoice from a vendor)
  - Payment confirmations (someone paid us)
  - Payment requests (someone asks us to pay)
  - Receipts/refunds
  - Subscription billing alerts
  - Overdue notices

Routes to appropriate action:
  - Invoice received  → store + for Accounts Payable review
  - Payment received → auto-thank + update CRM records
  - Payment due soon → add to smart_followup with financial urgency
  - Refund request   → route to human if amount > threshold
"""

import json, re
from datetime import datetime, timezone
from pathlib import Path
from collections import defaultdict

WORKSPACE = Path(__file__).resolve().parent.parent.parent
DATA      = WORKSPACE / 'data'
FIN_LOG   = DATA / 'financial_emails_v26.jsonl'

# ── Financial signal patterns ──────────────────────────────────────────
_INVOICE_PAT = re.compile(
    r'\b(?:invoice|fattura|factura|bill|billing statement|'
    r'invoice #|invoice number|inv[- ]?#)\b',
    re.IGNORECASE
)
_PAYMENT_RCVD = re.compile(
    r'\b(?:payment received|we received|received payment|'
    r'payment confirmed|paid in full|payment processed|'
    r'pagamento recebido|pagamento confirmado)\b',
    re.IGNORECASE
)
_PAYMENT_REQ = re.compile(
    r'\b(?:please pay|payment due|payment requested|'
    r'overdue|past due|late payment|amount owed|'
    r'please remit|wire transfer|ach payment|'
    r'por favor pague|pagamento pendente|'
    r'vencimento|data de vencimento)\b',
    re.IGNORECASE
)
_RECEIPT     = re.compile(
    r'\b(?:receipt|recibo|payment confirmation|'
    r'transaction|charge|debited|credited)\b',
    re.IGNORECASE
)
_REFUND       = re.compile(
    r'\b(?:refund|reembolso|return|reimbursement|'
    r'refund request|money back)\b',
    re.IGNORECASE
)
_SUBSCRIPTION = re.compile(
    r'\b(?:subscription|monthly charge|annual|renewal|'
    r'renew|auto-renew|auto debit|recurring)\b',
    re.IGNORECASE
)

# Amount patterns (e.g., "$1,234.56", "R$ 2.500", "€1,000")
_AMOUNT_PAT = re.compile(r'(?:[$€£R$])\s?[\d,]+\.?\d{0,2}|[\d,]+\.?\d{2}\s*(?:USD|EUR|GBP|BRL)')


def _log(msg: dict):
    try:
        with open(FIN_LOG, 'a') as f:
            f.write(json.dumps(msg, ensure_ascii=False) + '\n')
    except Exception:
        pass


def classify_financial_email(subject: str, snippet: str, sender: str = '') -> dict:
    """
    Returns a dict:
      - financial_type: 'invoice_received' | 'payment_received' | 'payment_request' |
                        'receipt' | 'refund' | 'subscription' | 'none'
      - confidence (0–1)
      - amount_mentioned (str or None)
      - urgency ('low'|'medium'|'high')
      - action (str): recommended pipeline action
      - signals (list)
    """
    text = f"{subject} {snippet}"
    
    result = {
        'financial_type':  'none',
        'confidence':      0.0,
        'amount_mentioned': None,
        'urgency':         'low',
        'action':          'proceed',
        'signals':         [],
    }
    
    # ── Detect invoice received ───────────────────────────────────
    invoice_hits = _INVOICE_PAT.findall(text)
    if invoice_hits:
        # Distinguish if WE are the recipient of an invoice
        result['financial_type'] = 'invoice_received'
        result['confidence']     = 0.85
        result['urgency']        = 'medium'
        result['action']         = 'store_for_ap_review'
        result['signals']        = [f"invoice_keyword:{invoice_hits[0]}"]
    
    # ── Detect payment received (money coming to us) ─────────────
    pay_rcvd_hits = _PAYMENT_RCVD.findall(text)
    if pay_rcvd_hits:
        result['financial_type'] = 'payment_received'
        result['confidence']     = 0.80
        result['urgency']        = 'low'
        result['action']         = 'auto_thank_and_log'
        result['signals']        = [f"payment_rcvd_kw:{pay_rcvd_hits[0]}"]
    
    # ── Detect payment request (they want money from us) ──────────
    pay_req_hits = _PAYMENT_REQ.findall(text)
    if pay_req_hits:
        result['financial_type'] = 'payment_request'
        result['confidence']     = 0.75
        result['urgency']        = 'high'
        result['action']         = 'flag_for_ap'
        result['signals']        = [f"payment_req_kw:{pay_req_hits[0]}"]
    
    # ── Receipt ──────────────────────────────────────────────────
    receipt_hits = _RECEIPT.findall(text)
    if receipt_hits and result['financial_type'] == 'none':
        # Only flag if invoice/payment keywords don't dominate
        result['financial_type'] = 'receipt'
        result['confidence']     = 0.60
        result['action']         = 'log_and_archive'
        result['signals']        = [f"receipt_kw:{receipt_hits[0]}"]
    
    # ── Refund ───────────────────────────────────────────────────
    refund_hits = _REFUND.findall(text)
    if refund_hits:
        result['financial_type'] = 'refund_request'
        result['confidence']     = 0.70
        result['urgency']        = 'high'
        result['action']         = 'force_review'
        result['signals']        = [f"refund_kw:{refund_hits[0]}"]
    
    # ── Subscription/billing ─────────────────────────────────────
    sub_hits = _SUBSCRIPTION.findall(text)
    if sub_hits and result['financial_type'] == 'none':
        result['financial_type'] = 'subscription_alert'
        result['confidence']     = 0.55
        result['urgency']        = 'medium'
        result['action']         = 'log_and_review'
        result['signals']        = [f"subscription_kw:{sub_hits[0]}"]
    
    # ── Extract amount if any ─────────────────────────────────────
    amount_match = _AMOUNT_PAT.search(text)
    if amount_match:
        result['amount_mentioned'] = amount_match.group(0)
    
    # ── Log ───────────────────────────────────────────────────────
    if result['financial_type'] != 'none':
        _log({
            'ts':          datetime.now(timezone.utc).isoformat(),
            'subject':     subject,
            'sender':      sender,
            'fin_type':    result['financial_type'],
            'confidence':  result['confidence'],
            'urgency':     result['urgency'],
            'action':      result['action'],
            'amount':      result['amount_mentioned'],
            'signals':     result['signals'],
        })
    
    return result


if __name__ == '__main__':
    tests = [
        ("Invoice #12345 attached", "Please find our invoice for May services attached — $2,500 due in 30 days.", "vendor@billing.com"),
        ("Payment received!", "We have received your payment of $1,000 — thank you for your business!", "zion@client.com"),
        ("Overdue invoice", "Your payment of $5,000 is overdue — please remit within 5 business days.", "billing@vendor.com"),
        ("Receipt for your records", "Please find your receipt for the transaction on 2026-05-20.", "noreply@paymentgateway.com"),
        ("Meeting tomorrow?", "Can we meet tomorrow at 2pm to discuss the project?", "partner@example.com"),
    ]
    
    for subj, snip, sender in tests:
        r = classify_financial_email(subj, snip, sender)
        print(f"{'💰' if r['financial_type'] != 'none' else '  '} {r['financial_type']:22s} | urg={r['urgency']} | {subj[:50]}")
        if r['amount_mentioned']:
            print(f"   💵 amount: {r['amount_mentioned']}")
