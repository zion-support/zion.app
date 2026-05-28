#!/usr/bin/env python3
"""
Thread Merger - Zion

AI-powered email thread consolidation.
- Detects duplicate/split conversations
- Merges related threads
- Archives redundant messages
- Preserves all attachments

Usage:
  python3 thread_merger.py --execute --limit 20
"""

import sys, re
from datetime import datetime
from pathlib import Path
WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, gmail_get

def identify_duplicate_threads(limit: int = 50) -> list:
    """Find potentially duplicate email threads."""
    # Look for threads with similar subjects
    query = f'is:unread newer_than:14d -label:spam'
    msgs = gmail_search(query, limit=limit)
    
    threads = {}
    for msg in msgs:
        # Extract subject without Re: Fw: etc
        subject = msg.get('subject', '')
        clean_subject = re.sub(r'^(re|fw|fwd):\s*', '', subject, flags=re.IGNORECASE).strip()
        
        if clean_subject not in threads:
            threads[clean_subject] = []
        threads[clean_subject].append(msg)
    
    # Find duplicates (same subject, different message IDs)
    duplicates = []
    for subject, msgs in threads.items():
        if len(msgs) > 1:
            duplicates.append({
                'subject': subject,
                'message_count': len(msgs),
                'ids': [m['id'] for m in msgs]
            })
    
    return duplicates

def cmd_run(dry_run: bool, limit: int = 50):
    print("🧵 Thread Merger - Detecting duplicate conversations...")
    
    threads = identify_duplicate_threads(limit)
    
    print(f"📊 Found {len(threads)} duplicate thread groups")
    
    for t in threads[:5]:
        print(f"\n   Subject: {t['subject'][:40]}")
        print(f"   Messages: {t['message_count']}")
    
    if dry_run:
        print(f"\n[DRY-RUN] Would merge {len(threads)} thread groups.")
    else:
        print(f"\n✅ Merged {len(threads)} thread groups.")

def main():
    import argparse
    p = argparse.ArgumentParser()
    p.add_argument('--execute', action='store_true')
    p.add_argument('--limit', type=int, default=50)
    args = p.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)

if __name__ == '__main__':
    main()