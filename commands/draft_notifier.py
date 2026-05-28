#!/usr/bin/env python3
"""
Auto-Draft Notifier — Zion

Scans Gmail for threads labeled '[AUTO-DRAFT]' (drafts created by automation).
Sends Telegram notification listing new drafts, then removes the label to avoid
repeated alerts (or marks as read).

Usage:
  python3 draft_notifier.py [--execute]   # Default dry-run; --execute sends Telegram
"""

import sys, os, re, argparse
from pathlib import Path

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))

from google_workspace import gmail_search, gmail_get, gmail_batch_modify, gmail_get_or_create_label_id
from llm_client import chat  # not needed but included for consistency

AUTO_DRAFT_LABEL = '[AUTO-DRAFT]'
PROCESSED_LABEL = 'Auto-Draft-Notified'

def fetch_auto_drafts():
    """Get messages with the [AUTO-DRAFT] label."""
    return gmail_search(f'label:"{AUTO_DRAFT_LABEL}"', limit=20)

def format_draft_summary(msg):
    """Extract subject and draft preview from message."""
    headers = msg.get('payload', {}).get('headers', [])
    subject = next((h['value'] for h in headers if h['name'] == 'Subject'), '(no subject)')
    # Clean Re: prefix
    if subject.lower().startswith('re: '):
        subject = subject[4:]
    # Extract thread ID to build draft link? Not directly available.
    # We'll show subject only; Kleber can find drafts in Gmail Drafts label.
    return subject

def cmd_run(dry_run: bool):
    print("🔎 Checking for new auto-draft emails…")
    msgs = fetch_auto_drafts()
    if not msgs:
        print("✅ No auto-drafts pending notification.")
        return

    print(f"📬 Found {len(msgs)} auto-draft(s):")
    subjects = []
    for m in msgs:
        msg = gmail_get(m['id'])
        subj = format_draft_summary(msg)
        subjects.append(subj)
        print(f"   • {subj}")

    if dry_run:
        print(f"\n💡 Add --execute to send Telegram notifications for {len(subjects)} drafts.")
        return

    # Build Telegram message
    lines = ["🤖 *Auto-Draft Ready for Review*\n"]
    for subj in subjects:
        lines.append(f"• {subj}")
    lines.append("\nCheck Gmail Drafts folder to edit & send.")
    telegram_text = '\n'.join(lines)

    try:
        # Send via OpenClaw message tool
        message(action='send', target='telegram', message=telegram_text)
        print("📡 Telegram notification sent.")
    except Exception as e:
        print(f"❌ Telegram send failed: {e}")

    # Mark as notified: add processed label, optionally remove AUTO_DRAFT label
    # We'll keep AUTO_DRAFT to preserve context, but add processed label
    processed_lbl = gmail_get_or_create_label_id(PROCESSED_LABEL)
    auto_draft_lbl = gmail_get_or_create_label_id(AUTO_DRAFT_LABEL)
    gmail_batch_modify({'ids': [m['id'] for m in msgs]}, addLabelIds=[processed_lbl])
    print("✅ Messages labeled as notified.")

def main():
    parser = argparse.ArgumentParser(description='Auto-Draft Notifier')
    parser.add_argument('--execute', action='store_true', help='Send Telegram alerts (default: dry-run)')
    args = parser.parse_args()
    cmd_run(dry_run=not args.execute)

if __name__ == '__main__':
    main()
