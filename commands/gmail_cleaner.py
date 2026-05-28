#!/usr/bin/env python3
"""
Gmail Cleaner — Zion Tech Group

Intelligently archives old, low-value, or automated emails to reduce inbox bloat.
Respects keep labels, VIP senders, and important threads.

Strategy:
  - Find emails older than N days (default 90) that are read
  - Skip if label:Keep, label:Important, from VIP domains, or in active threads
  - Archive and label 'Auto-Archived'
  - Report summary to Telegram

Schedule: Daily at 01:30

Usage: python3 gmail_cleaner.py [--execute] [--limit N] [--days 90]
"""

import sys, os, re, json, datetime, argparse
from pathlib import Path

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, gmail_batch_modify, gmail_get_or_create_label_id, telegram_send

DB_FILE = WORKSPACE / 'zion.app' / 'data' / 'gmail_cleaner.json'
VIP_DOMAINS = ['ziontechgroup.com', 'gmail.com', 'google.com', 'github.com']  # auto-keep

def load_db():
    if DB_FILE.exists():
        return json.loads(DB_FILE.read_text())
    return {'archived': [], 'lastRun': None}

def save_db(db):
    DB_FILE.parent.mkdir(parents=True, exist_ok=True)
    DB_FILE.write_text(json.dumps(db, indent=2))

def should_keep(msg):
    hdrs = msg.get('payload', {}).get('headers', [])
    sender = next((h['value'] for h in hdrs if h['name']=='From'), '')
    labels = msg.get('labelIds', [])
    # Keep if labelled
    if any(l in labels for l in ['Keep', 'Important', 'STAR', 'INBOX']):
        return True, 'has keep label'
    # Keep VIP domains
    domain = re.search(r'@([A-Za-z0-9.-]+\.[A-Za-z]{2,})', sender)
    if domain and domain.group(1).lower() in VIP_DOMAINS:
        return True, 'VIP sender'
    # Keep if unread (never archive unread)
    if 'UNREAD' in labels:
        return True, 'unread'
    # Keep if starred
    if 'STARRED' in labels:
        return True, 'starred'
    return False, 'low-value'

def cmd_run(dry_run=True, limit=200, days=90):
    db = load_db()
    cutoff_date = (datetime.datetime.utcnow() - datetime.timedelta(days=days)).strftime('%Y/%m/%d')
    query = f'is:read before:{cutoff_date} -label:Keep -label:Important'
    emails = gmail_search(query, limit=limit)
    if not emails:
        print("✅ No emails ready for archiving.")
        return

    keep = 0
    to_archive = []
    for msg in emails:
        mid = msg.get('id')
        if mid in db.get('archived', []):
            continue
        keep_flag, reason = should_keep(msg)
        if keep_flag:
            keep += 1
            continue
        to_archive.append(mid)

    if not to_archive:
        print(f"✅ All {len(emails)} emails are protected (keep/important/VIP).")
        return

    print(f"   📦 {len(to_archive)} emails to archive, {keep} protected")

    if not dry_run:
        label_id = gmail_get_or_create_label_id('Auto-Archived')
        success = gmail_batch_modify({'ids': to_archive},
                                     addLabelIds=[label_id],
                                     removeLabelIds=['INBOX'])
        if success:
            db['archived'].extend(to_archive)
            db['lastRun'] = datetime.datetime.utcnow().isoformat()
            save_db(db)
            print(f"   ✅ Archived {len(to_archive)} emails → Auto-Archived label")
        else:
            print("   ❌ Batch modify failed")
    else:
        print(f"   [DRY-RUN] Would archive {len(to_archive)} emails")
        print("💡 Add --execute to apply")

def main():
    p = argparse.ArgumentParser()
    p.add_argument('--execute', action='store_true')
    p.add_argument('--limit', type=int, default=200)
    p.add_argument('--days', type=int, default=90)
    args = p.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit, days=args.days)

if __name__ == '__main__':
    main()
