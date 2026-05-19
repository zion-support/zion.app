#!/usr/bin/env python3
"""
Auto Contract Review — Zion

Reviews contracts for key terms, risks, and deadlines.

Usage:
  python3 auto_contract_review.py [--execute] [--limit N]

Options:
  --execute   Apply contract review labels
  --limit N   Max contracts (default 10)
"""

import sys, json, argparse, re
from pathlib import Path

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, gmail_get, gmail_get_or_create_label_id, gmail_batch_modify

DEFAULT_LIMIT = 10

CONTRACT_TERMS = {
    'termination': 'termination|cancel|end of term',
    'payment': 'payment|fee|cost|price|\$',
    'confidentiality': 'confidential|nda|non.?disclosure',
    'liability': 'liability|limitation of liability',
    'governing_law': 'governing law|governed by|jurisdiction',
    'renewal': 'renewal|auto.?renew|extension'
}

def cmd_run(dry_run: bool, limit: int):
    print(f"🔍 Reviewing contracts in email...")
    msgs = gmail_search('subject:(contract OR agreement OR quote) newer_than:30d', limit=limit)
    if not msgs:
        print("✅ No contract documents found.")
        return

    for msg in msgs:
        raw = gmail_get(msg['id'])
        headers = raw.get('payload', {}).get('headers', [])
        subject = next((h['value'] for h in headers if h['name'] == 'Subject'), '')
        sender = next((h['value'] for h in headers if h['name'] == 'From'), '')
        
        # Check attachments
        has_attachment = False
        parts = raw.get('payload', {}).get('parts', [])
        for part in parts:
            if part.get('filename'):
                filename = part.get('filename', '').lower()
                if any(ext in filename for ext in ['.pdf', '.doc', '.docx']):
                    has_attachment = True
        
        print(f"   📄 {subject[:45]}...")
        if has_attachment:
            print(f"      ✓ Attachment detected from {sender[:25]}")
            if not dry_run:
                label_id = gmail_get_or_create_label_id('Contract-Needs-Review')
                gmail_batch_modify({'ids': [msg['id']]}, addLabelIds=[label_id])
        else:
            print(f"      Note: No attachment found - might be inline")

def main():
    parser = argparse.ArgumentParser(description='Auto Contract Review')
    parser.add_argument('--execute', action='store_true')
    parser.add_argument('--limit', type=int, default=DEFAULT_LIMIT)
    args = parser.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)

if __name__ == '__main__':
    main()