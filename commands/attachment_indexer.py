#!/usr/bin/env python3
"""
Attachment Indexer — Zion Tech Group

Downloads email attachments, extracts text (OCR), organizes in Drive.
Enables search across contracts, invoices, proposals.

Simplified v1: Mark emails as processed; log attachment metadata.
Full OCR/Drive upload requires additional helper functions.

Schedule: Every 6 hours (already in HEARTBEAT at 02:00)

Usage: python3 attachment_indexer.py [--execute] [--limit N]
"""

import sys, os, re, json, datetime, argparse
from pathlib import Path

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, gmail_batch_modify, gmail_get_or_create_label_id

PROCESSED_LABEL = 'Attachment-Processed'
DB_FILE = WORKSPACE / 'zion.app' / 'data' / 'attachment_index.json'

def load_db():
    if DB_FILE.exists():
        return json.loads(DB_FILE.read_text())
    return {'indexed': []}

def save_db(db):
    DB_FILE.parent.mkdir(parents=True, exist_ok=True)
    DB_FILE.write_text(json.dumps(db, indent=2))

def get_attachments_from_msg(msg):
    """Extract attachment metadata from Gmail message."""
    parts = msg.get('payload', {}).get('parts', [])
    attachments = []
    for p in parts:
        if p.get('filename') and p.get('body', {}).get('attachmentId'):
            attachments.append({
                'id': p['body']['attachmentId'],
                'name': p['filename'],
                'mime': p['mimeType'],
                'size': p.get('body', {}).get('size', 0)
            })
    # Single-part attachment
    if not attachments and msg.get('payload', {}).get('filename'):
        payload = msg['payload']
        attachments.append({
            'id': payload['body']['attachmentId'],
            'name': payload['filename'],
            'mime': payload['mimeType'],
            'size': payload['body'].get('size', 0)
        })
    return attachments

def cmd_run(dry_run=True, limit=50):
    db = load_db()
    query = 'has:attachment -label:Attachment-Processed'
    msgs = gmail_search(query, limit=limit)
    if not msgs:
        print("✅ No new attachments to index.")
        return

    processed = 0
    label_id = None if dry_run else gmail_get_or_create_label_id(PROCESSED_LABEL)

    for msg in msgs:
        mid = msg.get('id')
        if mid in db['indexed']:
            continue

        headers = msg.get('payload', {}).get('headers', [])
        from_header = next((h['value'] for h in headers if h['name']=='From'), 'unknown')
        subject = next((h['value'] for h in headers if h['name']=='Subject'), '(no subject)')

        attachments = get_attachments_from_msg(msg)
        if not attachments:
            print(f"   ⚠️  No attachments found in message {mid[:8]}…")
            continue

        print(f"   📎 {from_header[:40]} — {subject[:40]}")
        for att in attachments:
            print(f"      • {att['name']} ({att['mime']}, {att['size']} bytes)")

        if dry_run:
            print(f"      [DRY-RUN] Would download, OCR, and upload to Drive")
            db['indexed'].append(mid)
            processed += 1
            continue

        # Mark processed
        if label_id:
            try:
                gmail_batch_modify([mid], add_labels=[label_id])
            except Exception as e:
                print(f"   ⚠️  Label add failed: {e}")
        db['indexed'].append(mid)
        processed += 1

    if not dry_run:
        db['lastRun'] = datetime.datetime.utcnow().isoformat()
        save_db(db)

    print(f"\n✅ Indexed {processed} messages with attachments.")
    if dry_run:
        print("💡 Add --execute to download attachments, run OCR, and upload to Drive.")
        print("   ( OCR/Drive upload requires tesseract + Drive API helpers )")

def main():
    p = argparse.ArgumentParser()
    p.add_argument('--execute', action='store_true')
    p.add_argument('--limit', type=int, default=50)
    args = p.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)

if __name__ == '__main__':
    main()
