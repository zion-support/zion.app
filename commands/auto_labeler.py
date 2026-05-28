#!/usr/bin/env python3
"""
Auto-Labeler & Archiver — Zion Workspace Organizer

Intelligently labels incoming emails and archives low-priority ones
to keep the INBOX manageable without human intervention.

This script is the primary automation for email organization.
It uses the unified LLM client (with fallback chain) to categorize emails.

Usage:
  python3 auto_labeler.py --dry-run          # Show what would happen (default)
  python3 auto_labeler.py --execute          # Apply labels + archive
  python3 auto_labeler.py --limit 20         # Process up to N emails (default 50)
"""

import sys, os, re, json, datetime, argparse
from pathlib import Path

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, gmail_get, gmail_get_or_create_label_id, gmail_batch_modify, extract_body_from_gmail_message
from llm_client import chat

# ── Configuration ────────────────────────────────────────────────────────────

BATCH_SIZE = 50           # Emails per run
DRY_RUN_DEFAULT = True   # Safety default

LABEL_CATEGORIES = [
    'Client',
    'Vendor',
    'Newsletter',
    'CI-Failure',
    'Finance',
    'Personal',
    'Other'
]

ARCHIVE_LABELS = ['Newsletter']  # These get archived after labeling

PROMPT = """You are an email classification engine for Zion Tech Group.

Classify the given email into ONE category from this list:
{categories}

Return ONLY the category name (exact match).

Guidelines:
- Client: Business inquiries, project discussions, customer support
- Vendor: Supplier communications, service providers, invoices from vendors
- Newsletter: Marketing, industry news, automated bulletins
- CI-Failure: GitHub Actions failures, build errors, CI notifications
- Finance: Accounting, tax, banking, payroll, internal financial docs
- Personal: Private/personal emails not related to business
- Other: Everything else

Email:
---BEGIN---
Subject: {subject}
From: {from_addr}
{body_preview}
---END---
"""

def fetch_unread_emails(limit: int):
    """Get recent unread messages from INBOX."""
    msgs = gmail_search('is:unread', limit=limit)
    return msgs

def get_email_details(msg_id: str) -> dict:
    """Return subject, from, body preview for LLM."""
    raw = gmail_get(msg_id)
    headers = raw.get('payload', {}).get('headers', [])
    subject = next((h['value'] for h in headers if h['name'] == 'Subject'), '(no subject)')
    from_header = next((h['value'] for h in headers if h['name'] == 'From'), '(unknown sender)')
    # Parse email address from "Name <email@domain>"
    from_match = re.search(r'<(.+?)>', from_header)
    from_addr = from_match.group(1) if from_match else from_header

    body = extract_body_from_gmail_message(raw)
    preview = (body[:500] + '...') if len(body) > 500 else body

    return {
        'id': msg_id,
        'subject': subject,
        'from': from_addr,
        'body_preview': preview
    }

def classify_email(email: dict) -> str:
    """Use LLM to pick one category. Falls back to keyword heuristics if LLM fails."""
    prompt = PROMPT.format(
        categories=', '.join(LABEL_CATEGORIES),
        subject=email['subject'],
        from_addr=email['from'],
        body_preview=email['body_preview']
    )
    try:
        resp = chat([{'role': 'user', 'content': prompt}], provider='auto')
        category = resp['content'].strip()
        if category in LABEL_CATEGORIES:
            return category
    except Exception as e:
        print(f"   [LLM classification failed: {e}, using heuristics]")

    # Fallback keyword matching
    subj = email['subject'].lower()
    body = email['body_preview'].lower()
    if 'github' in subj or 'actions' in subj or 'ci/' in subj or 'build failed' in body or 'workflow' in subj:
        return 'CI-Failure'
    if 'newsletter' in subj or 'subscribe' in body or 'unsubscribe' in body:
        return 'Newsletter'
    if 'invoice' in subj or 'payment' in subj or 'receipt' in subj or 'billing' in subj:
        return 'Finance'
    if 'client' in subj or 'project' in subj or 'proposal' in subj or 'quote' in subj:
        return 'Client'
    if 'vendor' in subj or 'supplier' in body or 'purchase order' in body:
        return 'Vendor'
    if '@gmail.com' in email['from'] or '@outlook.com' in email['from'] or '@yahoo' in email['from']:
        return 'Personal'
    return 'Other'

def apply_labels(email_ids: list, label_ids: list, archive: bool = False):
    """Batch-apply labels to messages; optionally archive (remove INBOX)."""
    add_ids = label_ids[:]
    remove_ids = []
    if archive:
        remove_ids.append('INBOX')
    return gmail_batch_modify({'ids': email_ids}, addLabelIds=add_ids, removeLabelIds=remove_ids)

def cmd_run(dry_run: bool, limit: int):
    print(f"🤖 Auto-Labeler starting (dry-run={dry_run}, limit={limit})...")
    msgs = fetch_unread_emails(limit)
    print(f"📥 Fetched {len(msgs)} unread emails")

    if not msgs:
        print("✅ Nothing to label.")
        return

    # Stats tracking
    stats = {cat: 0 for cat in LABEL_CATEGORIES}
    to_archive = []

    for msg in msgs:
        msg_id = msg['id']
        email = get_email_details(msg_id)
        print(f"   ➡️  Classifying: {email['subject'][:60]}")

        category = classify_email(email)
        stats[category] += 1

        label_id = gmail_get_or_create_label_id(category)
        if dry_run:
            print(f"      [DRY-RUN] Would label as '{category}' (ID: {label_id})")
            if category in ARCHIVE_LABELS:
                print(f"      [DRY-RUN] Would archive (remove INBOX)")
        else:
            success = apply_labels([msg_id], [label_id], archive=(category in ARCHIVE_LABELS))
            if success:
                print(f"      ✅ Labeled as '{category}'" + (" + archived" if category in ARCHIVE_LABELS else ""))
            else:
                print(f"      ❌ Failed to label")

    # Summary
    print("\n📊 Classification summary:")
    for cat, cnt in stats.items():
        if cnt:
            print(f"   {cat}: {cnt}")

    if dry_run:
        print("\n💡 This was a dry-run. Add --execute to apply labels and archive.")
    else:
        print("\n✅ Labels applied successfully.")

def main():
    parser = argparse.ArgumentParser(description='Auto-Labeler & Archiver')
    parser.add_argument('--execute', action='store_true', help='Actually apply labels (default: dry-run)')
    parser.add_argument('--limit', type=int, default=BATCH_SIZE, help='Max emails to process')
    args = parser.parse_args()

    dry_run = not args.execute
    cmd_run(dry_run, args.limit)

if __name__ == '__main__':
    main()
