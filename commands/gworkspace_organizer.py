#!/usr/bin/env python3
"""
Google Workspace Organizer — Zion
Automates email labeling, archiving, and Drive file organization.

Commands:
  label-emails [--limit N]    — Apply smart labels to unread emails
  archive-old [--days N]      — Archive emails older than N days
  cleanup-drive               — Report Drive organization recommendations
  status                      — Show workspace statistics
"""

import sys, json, datetime, argparse
from pathlib import Path
from collections import defaultdict

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))  # for llm_client

from google_workspace import (
    gmail_search, gmail_get, gmail_thread_get,
    gmail_batch_modify, gmail_list_labels, gmail_get_or_create_label_id,
    drive_list
)
from llm_client import chat

# ── Label categories ────────────────────────────────────────────────────────
LABEL_CATEGORIES = [
    'CI/Failure', 'Urgent', 'Client/Proposal', 'Internal',
    'Finance/Receipt', 'Finance/Invoice', 'Archive', 'Uncategorized'
]

# ── LLM label suggestion ─────────────────────────────────────────────────────
def suggest_label(subject: str, snippet: str) -> str:
    prompt = (
        f"Suggest ONE label from: {LABEL_CATEGORIES[:-1]}.\n"
        f"Subject: {subject}\nSnippet: {snippet[:200]}\n\n"
        "Return ONLY the label name (exact)."
    )
    try:
        resp = chat(messages=[{"role": "user", "content": prompt}])
        suggestion = resp.get('choices', [{}])[0].get('message', {}).get('content', '').strip()
        for cat in LABEL_CATEGORIES[:-1]:
            if cat.lower() == suggestion.lower():
                return cat
        # Partial match fallback
        for cat in LABEL_CATEGORIES[:-1]:
            if cat.lower() in suggestion.lower():
                return cat
    except Exception as e:
        print(f"   [LLM error: {e}]", file=sys.stderr)
    return 'Uncategorized'

# ── Command: label-emails ────────────────────────────────────────────────────
def cmd_label_emails(limit: int = 20):
    print(f"🏷️  Labeling up to {limit} unread emails...")
    msgs = gmail_search('label:INBOX is:unread', limit=limit * 2)
    print(f"   Found {len(msgs)} unread candidates")

    batches = defaultdict(list)   # label_name -> [msg_id,...]
    unlabeled = []

    for m in msgs[:limit]:
        try:
            msg = gmail_get(m['id'])
            hdrs = {h['name']: h['value'] for h in msg.get('payload', {}).get('headers', [])}
            subject = hdrs.get('Subject', '')[:100]
            snippet = msg.get('snippet', '')[:200]
            label = suggest_label(subject, snippet)
            batches[label].append(m['id'])
        except Exception as e:
            print(f"   [Error {m['id']}: {e}]", file=sys.stderr)
            unlabeled.append(m['id'])

    # Resolve label IDs and batch-apply
    label_id_map = {}
    for label_name in batches:
        if label_name == 'Uncategorized':
            continue
        lid = gmail_get_or_create_label_id(label_name)
        label_id_map[label_name] = lid

    for label_name, ids in batches.items():
        if label_name == 'Uncategorized':
            unlabeled.extend(ids)
            continue
        lid = label_id_map[label_name]
        print(f"   Applying '{label_name}' to {len(ids)} emails")
        # Batch in chunks of 100 (Gmail limit)
        for i in range(0, len(ids), 100):
            gmail_batch_modify({'ids': ids[i:i+100]}, addLabelIds=[lid])

    if unlabeled:
        print(f"   {len(unlabeled)} emails need manual review")
    print("✅ Labeling complete.\n")

# ── Command: archive-old ─────────────────────────────────────────────────────
def cmd_archive_old(days: int = 30):
    cutoff = (datetime.datetime.utcnow() - datetime.timedelta(days=days)).strftime('%Y/%m/%d')
    print(f"📦 Archiving INBOX emails before {cutoff}...")
    msgs = gmail_search(f'before:{cutoff} label:INBOX', limit=1000)
    if not msgs:
        print("   Nothing to archive.")
        return
    total = len(msgs)
    print(f"   Found {total} emails")
    ids = [m['id'] for m in msgs]
    for i in range(0, len(ids), 100):
        gmail_batch_modify({'ids': ids[i:i+100]}, removeLabelIds=['INBOX'])
    print(f"✅ Archived {total} emails.\n")

# ── Command: cleanup-drive ────────────────────────────────────────────────────
def cmd_cleanup_drive():
    print("📁 Analyzing Drive structure...")
    files = drive_list(limit=200)
    by_type = defaultdict(list)
    for f in files:
        if f['mimeType'] == 'application/vnd.google-apps.folder':
            continue
        name = f['name'].lower()
        if 'rate' in name or 'price' in name or 'pricing' in name:
            by_type['Rate Cards'].append(f)
        elif 'api' in name and 'key' in name:
            by_type['API Keys'].append(f)
        elif 'prompt' in name or 'ai' in name or 'ai-lab' in name:
            by_type['AI Prompts'].append(f)
        elif f['mimeType'].startswith('image/'):
            by_type['Images'].append(f)
        elif f['mimeType'].startswith('application/pdf'):
            by_type['PDFs'].append(f)
        else:
            by_type['Other'].append(f)

    for cat, flist in by_type.items():
        if len(flist) >= 2:
            print(f"   '{cat}': {len(flist)} files  → consider creating folder")
    print("   (Drive mutation not implemented yet — recommendations only)")
    print("✅ Drive analysis complete.\n")

# ── Command: status ──────────────────────────────────────────────────────────
def cmd_status():
    total = gmail_search('label:INBOX', limit=2000)
    unread = gmail_search('label:INBOX is:unread', limit=2000)
    drive = drive_list(limit=1000)
    print("📊 Google Workspace Status")
    print(f"   Gmail INBOX: {len(total)} messages, {len(unread)} unread")
    print(f"   Drive: {len(drive)} items")
    if len(unread) > 1000:
        print("   ⚠️  High unread — consider labeling/archiving")
    print()

# ── Main ──────────────────────────────────────────────────────────────────────
def main():
    parser = argparse.ArgumentParser(description='Google Workspace Organizer')
    sub = parser.add_subparsers(dest='cmd')
    sub.add_parser('label-emails', help='Smart-label unread emails')
    sub.add_parser('archive-old', help='Archive emails older than 30 days')
    sub.add_parser('cleanup-drive', help='Drive organization recommendations')
    sub.add_parser('status', help='Workspace statistics')
    parser.add_argument('--days', type=int, default=30)
    parser.add_argument('--limit', type=int, default=20)
    args = parser.parse_args()

    if args.cmd == 'label-emails':
        cmd_label_emails(limit=args.limit)
    elif args.cmd == 'archive-old':
        cmd_archive_old(days=args.days)
    elif args.cmd == 'cleanup-drive':
        cmd_cleanup_drive()
    elif args.cmd == 'status':
        cmd_status()
    else:
        parser.print_help()

if __name__ == '__main__':
    main()
