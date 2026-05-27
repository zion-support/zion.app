#!/usr/bin/env python3
"""
Email Bankruptcy Prevention — Zion

When unread email count exceeds a threshold, triggers an automated cleanup:
- Archives old newsletters/promotions
- Applies bulk labels to reduce inbox clutter
- Sends a summary of actions taken

Usage:
  python3 email_bankruptcy_prevention.py [--execute] [--threshold N] [--days OLD]

Options:
  --execute   Actually perform the cleanup (default: dry-run)
  --threshold N  Unread count threshold to trigger cleanup (default 1000)
  --days OLD   Archive emails older than N days (default 60)
"""

import sys, os, re, json, datetime, argparse
from pathlib import Path

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, gmail_batch_modify, gmail_get_or_create_label_id

# ── Configuration ────────────────────────────────────────────────────────────

DEFAULT_THRESHOLD = 1000
DEFAULT_DAYS = 60

# Labels to apply for common categories
NEWSLETTER_LABEL = 'Newsletter'
PROMOTION_LABEL = 'Promotion'
SOCIAL_LABEL = 'Social'
UPDATE_LABEL = 'Updates'
FORUM_LABEL = 'Forums'

def get_unread_count():
    """Get the number of unread emails in the INBOX."""
    # We can use gmail_search with 'is:unread' and count results
    # But gmail_search returns a list of message metadata; we can count them.
    # However, for large counts, this might be heavy. We'll use a small limit and estimate?
    # Alternatively, we can use the Gmail API via gog or the existing google_workspace helpers.
    # We don't have a direct unread count function. Let's use gmail_search with limit=1 and estimate?
    # Actually, we can get the count from the Gmail API labels endpoint for INBOX.
    # But we don't have a helper for that. Let's use gmail_search with a small limit and if we hit the limit, we know it's over.
    # For simplicity, we'll search for unread with a limit of threshold+1 and count.
    # If the count equals the limit, we know it's at least threshold.
    # We'll do a more accurate count by searching with no limit? That could be heavy.
    # We'll compromise: search for unread with limit=threshold+100 and if we get threshold+100, we return threshold+100 (as min).
    # This is acceptable for triggering bankruptcy prevention.
    msgs = gmail_search('is:unread', limit=DEFAULT_THRESHOLD+100)
    return len(msgs)

def get_old_unread_emails(days_old: int, limit: int = 1000):
    """Get unread emails older than N days."""
    # Gmail query: is:unread older_than:{days}d
    query = f'is:unread older_than:{days_old}d'
    # Exclude certain labels to avoid archiving important emails
    query += ' -label:Important -label:Starred -label:Auto-Archived -label:Priority-*'
    msgs = gmail_search(query, limit=limit)
    return msgs

def get_newsletter_promotion_emails(limit: int = 500):
    """Get emails likely to be newsletters or promotions."""
    # Common patterns: list-id, unsubscribe headers, or known senders
    # We'll use a simple query for now: look for common marketing words in subject
    # This is not perfect but a start.
    query = '(subject:(sale OR offer OR discount OR newsletter OR promotion OR deal OR coupon) OR has:unsubscribe) is:unread'
    query += ' -label:Important -label:Starred -label:Auto-Archived -label:Priority-*'
    msgs = gmail_search(query, limit=limit)
    return msgs

def apply_label_to_messages(msg_ids: list, label_name: str) -> int:
    """Apply a label to a list of message IDs. Returns number successfully labeled."""
    if not msg_ids:
        return 0
    label_id = gmail_get_or_create_label_id(label_name)
    success = 0
    # Process in batches of 100 (Gmail API limit)
    for i in range(0, len(msg_ids), 100):
        batch = msg_ids[i:i+100]
        if gmail_batch_modify({'ids': batch}, addLabelIds=[label_id]):
            success += len(batch)
        else:
            print(f"   [Warning] Failed to apply label to batch starting at {i}", file=sys.stderr)
    return success

def archive_messages(msg_ids: list) -> int:
    """Archive messages by removing INBOX label and applying Auto-Archived label."""
    if not msg_ids:
        return 0
    # Remove INBOX, add Auto-Archived
    inbox_label_id = gmail_get_or_create_label_id('INBOX')  # This is actually the system label ID? We'll use the name.
    # Actually, to remove INBOX we need to remove the label 'INBOX'
    # We'll get the label ID for INBOX (though it's a system label, we can still use the name)
    # But the gmail_batch_modify expects label IDs. We'll need to get the ID for INBOX.
    # Let's get it.
    inbox_label_id = gmail_get_or_create_label_id('INBOX')
    auto_archive_id = gmail_get_or_create_label_id('Auto-Archived')
    success = 0
    for i in range(0, len(msg_ids), 100):
        batch = msg_ids[i:i+100]
        if gmail_batch_modify({'ids': batch}, removeLabelIds=[inbox_label_id], addLabelIds=[auto_archive_id]):
            success += len(batch)
        else:
            print(f"   [Warning] Failed to archive batch starting at {i}", file=sys.stderr)
    return success

def send_telegram_summary(summary_text: str):
    """Send a summary via Telegram using OpenClaw's internal tool."""
    # For now, we'll just print; in production, this would call the message tool.
    print("=== TELEGRAM SUMMARY ===")
    print(summary_text)
    print("======================")

def cmd_run(dry_run: bool, threshold: int, days_old: int):
    print(f"🔍 Checking unread count (threshold: {threshold})...")
    unread_count = get_unread_count()
    print(f"📧 Current unread count: {unread_count}")
    
    if unread_count < threshold:
        print(f"✅ Unread count below threshold. No action needed.")
        return

    print(f"⚠️  Unread count exceeds threshold ({threshold}). Triggering bankruptcy prevention...")

    # Step 1: Archive old unread emails (older than days_old)
    print(f"\n📦 Step 1: Archiving unread emails older than {days_old} days...")
    old_emails = get_old_unread_emails(days_old, limit=2000)  # Limit to avoid overload
    print(f"   Found {len(old_emails)} old unread emails to archive.")
    if old_emails and not dry_run:
        archived = archive_messages([msg['id'] for msg in old_emails])
        print(f"   ✅ Archived {archived} emails.")
    elif old_emails and dry_run:
        print(f"   [DRY-RUN] Would archive {len(old_emails)} emails.")

    # Step 2: Apply labels to newsletters/promotions
    print(f"\n🏷️  Step 2: Applying labels to newsletter/promotion emails...")
    news_promos = get_newsletter_promotion_emails(limit=2000)
    print(f"   Found {len(news_promos)} potential newsletter/promotion emails.")
    if news_promos and not dry_run:
        # Apply Newsletter label
        newsletter_count = apply_label_to_messages([msg['id'] for msg in news_promos], NEWSLETTER_LABEL)
        print(f"   ✅ Applied '{NEWSLETTER_LABEL}' label to {newsletter_count} emails.")
        # Apply Promotion label (could overlap, that's fine)
        promotion_count = apply_label_to_messages([msg['id'] for msg in news_promos], PROMOTION_LABEL)
        print(f"   ✅ Applied '{PROMOTION_LABEL}' label to {promotion_count} emails.")
    elif news_promos and dry_run:
        print(f"   [DRY-RUN] Would apply labels to {len(news_promos)} emails.")

    # Step 3: Send summary
    summary = f"""
🚨 Email Bankruptcy Prevention Triggered
📅 {datetime.datetime.utcnow().strftime('%Y-%m-%d %H:%M UTC')}
📧 Unread count: {unread_count} (threshold: {threshold})
📦 Archived old emails: {len(old_emails) if 'old_emails' in locals() else 0}
🏷️  Labeled newsletters/promos: {len(news_promos) if 'news_promos' in locals() else 0}
    """.strip()
    
    print("\n📋 Summary:")
    print(summary)
    
    if not dry_run:
        send_telegram_summary(summary)
    else:
        print("💡 Dry-run only. Add --execute to perform actions.")

def main():
    parser = argparse.ArgumentParser(description='Email Bankruptcy Prevention for Zion Tech Group')
    parser.add_argument('--execute', action='store_true', help='Perform actual cleanup (default: dry-run)')
    parser.add_argument('--threshold', type=int, default=DEFAULT_THRESHOLD, help=f'Unread count threshold to trigger cleanup (default {DEFAULT_THRESHOLD})')
    parser.add_argument('--days', type=int, default=DEFAULT_DAYS, help=f'Archive emails older than N days (default {DEFAULT_DAYS})')
    args = parser.parse_args()
    cmd_run(dry_run=not args.execute, threshold=args.threshold, days_old=args.days)

if __name__ == '__main__':
    main()