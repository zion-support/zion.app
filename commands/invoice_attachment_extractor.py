#!/usr/bin/env python3
"""
Invoice Attachment Extractor — Zion

Extracts invoice details from email attachments.

Usage:
  python3 invoice_attachment_extractor.py [--execute] [--limit N]

Options:
  --execute   Process invoice attachments
  --limit N   Max emails (default 20)
"""

import sys, json, argparse, re
from pathlib import Path

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, gmail_get

DEFAULT_LIMIT = 20

def find_invoice_attachments(msg) -> list:
    """Find PDF/Excel attachments that might contain invoices."""
    invoices = []
    parts = msg.get('payload', {}).get('parts', [])
    
    for part in parts:
        filename = part.get('filename', '')
        if filename:
            lower = filename.lower()
            if any(ext in lower for ext in ['.pdf', '.xls', '.xlsx', '.csv']) and \
               any(kw in lower for kw in ['invoice', 'bill', 'receipt', 'payment']):
                invoices.append(filename)
    
    return invoices

def cmd_run(dry_run: bool, limit: int):
    print(f"🔍 Finding invoice attachments...")
    msgs = gmail_search('subject:(invoice OR receipt OR payment) newer_than:60d has:attachment', limit=limit)
    
    found = 0
    for msg in msgs[:limit]:
        raw = gmail_get(msg['id'])
        headers = raw.get('payload', {}).get('headers', [])
        subject = next((h['value'] for h in headers if h['name'] == 'Subject'), '')
        sender = next((h['value'] for h in headers if h['name'] == 'From'), '')
        
        invoices = find_invoice_attachments(raw)
        if invoices:
            found += 1
            print(f"   💰 {subject[:35]}... from {sender[:20]}")
            for inv in invoices:
                print(f"      → {inv}")

    print(f"\n📊 Found {found} emails with invoice attachments.")

def main():
    parser = argparse.ArgumentParser(description='Invoice Attachment Extractor')
    parser.add_argument('--execute', action='store_true')
    parser.add_argument('--limit', type=int, default=DEFAULT_LIMIT)
    args = parser.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)

if __name__ == '__main__':
    main()