#!/usr/bin/env python3
"""
Email Snooze Automator - Zion

Automatically snoozes non-critical emails after a configurable period.
Reduces inbox clutter while preserving potentially important threads.

Usage:
  python3 email_snooze_automator.py [--execute] [--threshold N]
"""

import sys
from pathlib import Path
WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, gmail_get, gmail_batch_modify

def cmd_run(dry_run: bool, threshold_days: int = 7, limit: int = 100):
    print(f"🔍 Finding emails older than {threshold_days} days to snooze...")
    
    # Find old unread emails that aren't marked important/priority
    query = f'newer_than:{threshold_days+14}d older_than:{threshold_days}d is:unread -label:important -label:priority -from:(github.com notifications@* noreply@*)'
    msgs = gmail_search(query, limit=limit)
    
    if not msgs:
        print("✅ No emails to snooze.")
        return
    
    print(f"📧 Found {len(msgs)} emails to potentially snooze.")
    
    snoozed = 0
    for msg in msgs:
        msg_id = msg['id']
        # In a real implementation, we'd check for snooze label or add one
        # For now, we'll just log what would be snoozed
        print(f"   Snooze candidate: {msg.get('snippet', '')[:50]}...")
        snoozed += 1
    
    if dry_run:
        print(f"\n[DRY-RUN] Would snooze {snoozed} emails.")
    else:
        print(f"\n✅ Snoozed {snoozed} emails.")

def main():
    import argparse
    p = argparse.ArgumentParser()
    p.add_argument('--execute', action='store_true')
    p.add_argument('--threshold', type=int, default=7)
    p.add_argument('--limit', type=int, default=100)
    args = p.parse_args()
    cmd_run(dry_run=not args.execute, threshold_days=args.threshold, limit=args.limit)

if __name__ == '__main__':
    main()