#!/usr/bin/env python3
"""
Auto-Newsletter Mover — Zion Tech Group

Detects mass-email newsletters and automated bulletins in the inbox.
Auto-archives them and applies the 'Newsletters' label to keep the inbox clean.

Detection heuristics:
  - Multiple recipients in To/CC/BCC (bulk send)
  - Presence of "unsubscribe" link/footer
  - Sender domains known for newsletters (mailchimp, sendgrid, beehiiv, etc.)
  - Subject patterns: "digest", "newsletter", "weekly update", "#123", etc.
  - List-Unsubscribe header present

Usage:
  python3 newsletter_cleaner.py --execute   # Move emails (default dry-run)
  python3 newsletter_cleaner.py --limit 50  # Max unread emails to scan
"""

import sys, os, re, argparse, datetime
from pathlib import Path

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))

from google_workspace import gmail_search, gmail_get, gmail_get_or_create_label_id, gmail_batch_modify

# ── Configuration ────────────────────────────────────────────────────────────

BATCH_SIZE = 50
NEWSLETTER_LABEL = 'Newsletters'
ARCHIVE_LABEL = 'Archived'  # using built-in category; also apply our label

# Sender domains commonly used for bulk/marketing emails
NEWSLETTER_DOMAINS = [
    'mailchimp.com', 'sendgrid.com', 'beehiiv.com', 'substack.com',
    'convertkit.com', ' Revue', 'buttondown.com', 'morningbrew.com',
    'theinformation.com', 'stytch.com', 'intercom.com', 'zapier.com',
    'github.com', 'notion.so',  # product updates
]

# Subject keywords suggesting newsletter/digest
NEWSLETTER_KEYWORDS = [
    'newsletter', 'digest', 'weekly', 'monthly', 'update', 'bulletin',
    'issue #', 'edition', 'wrap-up', 'roundup', 'best of', 'top stories',
    'subscribe', 'unsubscribe', 'preferences', 'manage subscription',
]

def get_headers(msg: dict) -> dict:
    return {h['name']: h['value'] for h in msg.get('payload', {}).get('headers', [])}

def count_recipients(headers: dict) -> int:
    """Count distinct email addresses in To, CC, BCC."""
    total = 0
    for hdr in ('To', 'Cc', 'Bcc'):
        val = headers.get(hdr, '')
        if val:
            # Rough count: split by comma, filter empty
            addrs = [a.strip() for a in val.split(',') if a.strip()]
            total += len(addrs)
    return total

def sender_domain(from_header: str) -> str:
    m = re.search(r'@([a-zA-Z0-9.\-]+)', from_header)
    return m.group(1).lower() if m else ''

def has_unsubscribe(text: str) -> bool:
    return bool(re.search(r'(unsubscribe|opt-?out|manage.?subscription|preferences)', text, re.IGNORECASE))

def looks_like_newsletter(msg: dict) -> tuple[bool, str]:
    """Heuristic detection; returns (is_newsletter, reason)."""
    headers = get_headers(msg)
    from_hdr = headers.get('From', '')
    subject = headers.get('Subject', '').lower()
    body = extract_body_from_message(msg)[:2000].lower()

    # 1) Multiple recipients (bulk)
    if count_recipients(headers) > 5:
        return True, 'multiple_recipients'

    # 2) List-Unsubscribe header
    if 'List-Unsubscribe' in headers:
        return True, 'list_unsubscribe_header'

    # 3) Sender domain match
    domain = sender_domain(from_hdr)
    for nd in NEWSLETTER_DOMAINS:
        if nd in from_hdr.lower() or nd in domain:
            return True, f'newsletter_domain_{nd}'

    # 4) Subject keywords
    for kw in NEWSLETTER_KEYWORDS:
        if kw in subject:
            return True, 'subject_keyword'

    # 5) Unsubscribe link in body
    if has_unsubscribe(body):
        return True, 'unsubscribe_link'

    return False, ''

def extract_body_from_message(msg: dict) -> str:
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

def cmd_run(dry_run: bool, limit: int):
    print("📰 Scanning for newsletters…")
    msgs = gmail_search('is:unread', limit=limit)
    print(f"📥 Fetched {len(msgs)} unread emails")

    newsletter_ids = []
    reasons = []

    for m in msgs:
        msg = gmail_get(m['id'])
        is_news, reason = looks_like_newsletter(msg)
        if is_news:
            headers = get_headers(msg)
            subject = headers.get('Subject', '(no subject)')
            print(f"   📌 {subject[:60]} — {reason}")
            newsletter_ids.append(m['id'])
            reasons.append(reason)

    if not newsletter_ids:
        print("✅ No newsletters found.")
        return

    if dry_run:
        print(f"\n💡 Add --execute to archive {len(newsletter_ids)} newsletter(s).")
        return

    # Apply labels + archive
    newsletter_lbl = gmail_get_or_create_label_id(NEWSLETTER_LABEL)
    # Archive: remove INBOX label
    gmail_batch_modify(
        {'ids': newsletter_ids},
        removeLabelIds=['INBOX'],
        addLabelIds=[newsletter_lbl]
    )
    print(f"✅ Archived {len(newsletter_ids)} newsletter(s) with label '{NEWSLETTER_LABEL}'.")

    # Optional: Telegram summary
    try:
        from collections import Counter
        freq = Counter(reasons)
        lines = [f"📰 *Newsletter Cleaner* — {len(newsletter_ids)} archived"]
        for reason, count in freq.most_common():
            lines.append(f"• {reason}: {count}")
        message(action='send', target='telegram', message='\n'.join(lines))
    except Exception:
        pass

def main():
    parser = argparse.ArgumentParser(description='Auto-Newsletter Mover')
    parser.add_argument('--execute', action='store_true', help='Archive emails (default: dry-run)')
    parser.add_argument('--limit', type=int, default=BATCH_SIZE, help='Max emails to scan')
    args = parser.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)

if __name__ == '__main__':
    main()
