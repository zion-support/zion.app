#!/usr/bin/env python3
"""
Expense Categorization ML — Zion Tech Group

Classifies parsed expense emails into categories:
  - Software / SaaS
  - Travel / Flights / Hotels
  - Office / Utilities / Rent
  - Marketing / Ads / Events
  - Professional Services / Contractors
  - Hardware / Equipment
  - Misc

Reads emails labeled 'Expense' or parsed by expense_parser.
Uses LLM to classify; caches results to avoid re-processing.

Usage:
  python3 expense_categorizer.py [--execute]   # Default dry-run
"""

import sys, os, re, json, datetime, argparse, urllib.request
from pathlib import Path

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, gmail_get, gmail_batch_modify, gmail_get_or_create_label_id
from llm_client import chat

CATEGORY_DB = WORKSPACE / 'zion.app' / 'data' / 'expense_categories.json'
CATEGORIES = ['Software', 'Travel', 'Office', 'Marketing', 'Services', 'Hardware', 'Misc']
CATEGORY_LABEL_PREFIX = 'Expense-'

def load_category_db() -> dict:
    if CATEGORY_DB.exists():
        return json.loads(CATEGORY_DB.read_text())
    return {'classified': {}, 'lastRun': None}

def save_category_db(db: dict):
    CATEGORY_DB.parent.mkdir(parents=True, exist_ok=True)
    CATEGORY_DB.write_text(json.dumps(db, indent=2))

def fetch_unclassified_expenses(limit: int = 30) -> list:
    """Find unread expense emails without a category label."""
    # Get messages labeled Expense but not any Expense-* category
    msgs = gmail_search('label:Expense is:unread', limit=limit)
    unclassified = []
    for m in msgs:
        lbl_ids = m.get('labelIds', [])
        has_category = any(lbl.startswith(CATEGORY_LABEL_PREFIX) for lbl in lbl_ids)
        if not has_category:
            unclassified.append(m)
    return unclassified

def extract_expense_details(msg) -> dict:
    """Pull vendor, amount, date from email (from Gmail payload)."""
    headers = {h['name']: h['value'] for h in msg.get('payload',{}).get('headers',[])}
    subject = headers.get('Subject','')
    snippet = msg.get('snippet','')
    # Try to find amount in subject/snippet
    amount_match = re.search(r'\$?([\d,]+\.\d{2})', subject + ' ' + snippet)
    amount = amount_match.group(1) if amount_match else None
    # Vendor from sender
    from_hdr = headers.get('From','')
    vendor = re.search(r'<(.+?)>', from_hdr)
    if vendor:
        vendor = vendor.group(1).split('@')[-1].split('.')[0].title()
    else:
        vendor = from_hdr[:30]
    return {'vendor': vendor, 'amount': amount, 'subject': subject[:80]}

def classify_expense(expense: dict) -> str:
    """Use LLM to classify expense into one of CATEGORIES."""
    vendor = expense.get('vendor','Unknown')
    subject = expense.get('subject','')
    prompt = (
        f"Classify this business expense into ONE of: {', '.join(CATEGORIES)}.\n"
        f"Vendor: {vendor}\n"
        f"Subject: {subject}\n\n"
        "Rules:\n"
        "- Software/SaaS → 'Software'\n"
        "- Flights, hotels, rides, travel → 'Travel'\n"
        "- Rent, utilities, office supplies → 'Office'\n"
        "- Ads, marketing tools, events → 'Marketing'\n"
        "- Contractors, consultants, legal → 'Services'\n"
        "- Computers, equipment, hardware → 'Hardware'\n"
        "- Anything else → 'Misc'\n"
        "Respond with only the category name."
    )
    try:
        resp = chat([{"role":"user","content":prompt}], provider="auto", temperature=0.3)
        cat = resp['content'].strip()
        if cat not in CATEGORIES:
            return 'Misc'
        return cat
    except Exception:
        return 'Misc'

def apply_category_label(msg_id: str, category: str):
    """Apply Expense-{Category} label to the message."""
    lbl_name = f"{CATEGORY_LABEL_PREFIX}{category}"
    lbl_id = gmail_get_or_create_label_id(lbl_name)
    gmail_batch_modify({'ids': [msg_id]}, addLabelIds=[lbl_id])

def cmd_run(dry_run: bool, limit: int = 30):
    print("📂 Expense Categorization scanning…")
    msgs = fetch_unclassified_expenses(limit=limit)
    print(f"   Found {len(msgs)} unclassified expense emails")

    db = load_category_db()
    categorized = 0

    for msg in msgs:
        msg_id = msg['id']
        if msg_id in db['classified']:
            continue  # already processed

        expense = extract_expense_details(msg)
        category = classify_expense(expense)

        if dry_run:
            print(f"   [DRY-RUN] Classify {expense['vendor']} → {category}")
            db['classified'][msg_id] = {'category': category, 'vendor': expense['vendor']}
            categorized += 1
            continue

        # Apply label and record
        try:
            apply_category_label(msg_id, category)
            db['classified'][msg_id] = {'category': category, 'vendor': expense['vendor'], 'timestamp': datetime.datetime.utcnow().isoformat()}
            categorized += 1
            print(f"   ✅ Labeled {expense['vendor']} as {category}")
        except Exception as e:
            print(f"   ❌ Label failed for {msg_id}: {e}")

    if not dry_run:
        db['lastRun'] = datetime.datetime.utcnow().isoformat()
        save_category_db(db)

    print(f"\n✅ Categorized {categorized} expenses.")
    if dry_run:
        print("💡 Add --execute to apply labels.")

def main():
    parser = argparse.ArgumentParser(description='Expense Categorization')
    parser.add_argument('--execute', action='store_true', help='Apply labels (default dry-run)')
    parser.add_argument('--limit', type=int, default=30, help='Max messages to process')
    args = parser.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)

if __name__ == '__main__':
    main()
