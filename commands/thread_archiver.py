#!/usr/bin/env python3
"""
Auto-Archive Old Threads — Zion Tech Group v2

Archives Gmail threads older than 90 days with no recent activity.
Excludes threads with preservation labels (Keep, Onboarding, Important, Escalation-*, Finance, Legal, Contract, Invoice).

Usage:
  python3 thread_archiver.py [--execute] [--limit 50]   # Archive (default dry-run)
"""

import sys, os, re, json, datetime, argparse, urllib.request
from pathlib import Path

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, gmail_get_or_create_label_id, gog_headers

EXCLUDE_LABELS = [
    'Keep', 'Onboarding', 'Important',
    'Escalation-Level1', 'Escalation-Critical',
    'Finance', 'Legal', 'Contract', 'Invoice'
]
ARCHIVE_DAYS = 90
DEFAULT_LIMIT = 50
LOG_PATH = WORKSPACE / 'zion.app' / 'reports' / 'archiver.log'

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

def should_skip(thread_labels: list) -> bool:
    for excl in EXCLUDE_LABELS:
        if excl in thread_labels:
            return True
    return False

def get_old_inbox_threads(limit: int = DEFAULT_LIMIT) -> list:
    query = 'label:INBOX older_than:90d'
    threads = gmail_search(query, limit=limit)
    return threads

def modify_thread(thread_id: str, remove_label_ids: list = None, add_label_ids: list = None):
    """Call Gmail API users.threads.modify to change labels."""
    url = f'https://gmail.googleapis.com/gmail/v1/users/me/threads/{thread_id}/modify'
    body_data = {}
    if remove_label_ids:
        body_data['removeLabelIds'] = remove_label_ids
    if add_label_ids:
        body_data['addLabelIds'] = add_label_ids
    body = json.dumps(body_data).encode()
    headers = gog_headers()
    headers['Content-Type'] = 'application/json'
    req = urllib.request.Request(url, data=body, headers=headers, method='POST')
    try:
        urllib.request.urlopen(req, timeout=30).read()
        return True
    except Exception as e:
        print(f"   ❌ Modify error for {thread_id}: {e}")
        return False

def cmd_run(dry_run: bool, limit: int):
    print("🗄️  Auto-Archive scanning old inbox threads…")
    candidates = get_old_inbox_threads(limit=limit)
    print(f"   Found {len(candidates)} threads older than {ARCHIVE_DAYS} days (limit={limit})")

    to_archive = []
    skipped = 0
    for t in candidates:
        thread_id = t['threadId']
        labels = t.get('labelIds', [])
        if should_skip(labels):
            skipped += 1
            continue
        to_archive.append(thread_id)

    print(f"   → Will archive {len(to_archive)} threads (excluded {skipped})")

    if dry_run:
        for tid in to_archive[:5]:
            tinfo = gmail_search(f'thread:{tid}', limit=1)
            if tinfo:
                snippet = tinfo[0].get('snippet','')[:60]
                print(f"      [DRY-RUN] Would archive: {snippet}… ({tid[:8]})")
        print(f"   [DRY-RUN] Total {len(to_archive)} threads would be archived")
        print("💡 Add --execute to perform archive (removes INBOX label).")
        return

    # Process sequentially (no bulk endpoint for threads)
    success = 0
    for tid in to_archive:
        if modify_thread(tid, remove_label_ids=['INBOX']):
            success += 1
        else:
            print(f"   ⚠️  Failed to archive {tid[:8]}")

    # Log
    LOG_PATH.parent.mkdir(parents=True, exist_ok=True)
    with LOG_PATH.open('a', encoding='utf-8') as f:
        f.write(f"{datetime.datetime.utcnow().isoformat()} Archived {success}/{len(to_archive)} threads (skipped {skipped})\n")
    print(f"   📝 Logged to {LOG_PATH}")
    print(f"\n✅ Archived {success} threads (failed {len(to_archive)-success}).")

def main():
    parser = argparse.ArgumentParser(description='Auto-Archive Old Threads')
    parser.add_argument('--execute', action='store_true', help='Perform archive (default dry-run)')
    parser.add_argument('--limit', type=int, default=DEFAULT_LIMIT, help='Max threads to consider')
    args = parser.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)

if __name__ == '__main__':
    main()
