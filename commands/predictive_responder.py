#!/usr/bin/env python3
"""
Predictive Responder — Zion

Generates suggested reply drafts for unread emails using LLM.
Helps speed up email response by providing ready-to-review drafts.

Usage:
  python3 predictive_responder.py [--execute] [--limit N] [--hours N]

Options:
  --execute   Actually create draft drafts in Gmail (default: dry-run)
  --limit N   Maximum number of emails to process (default 20)
  --hours N   Look back N hours for unread emails (default 24)
"""

import sys, os, re, json, datetime, argparse
from pathlib import Path

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, gmail_get, gmail_create_draft, gmail_get_or_create_label_id, gmail_batch_modify, extract_body_from_gmail_message
from llm_client import chat

# ── Configuration ────────────────────────────────────────────────────────────

DEFAULT_LIMIT = 20
DEFAULT_HOURS = 24

PROMPT = """You are an AI assistant helping Kleber Garcia Alcatrão (CEO, Zion Tech Group) draft email replies.

Generate a concise, professional reply draft for the following email. The reply should:
- Address the sender's questions or requests
- Match the sender's tone (formal/informal)
- Be ready to review and send (no placeholders like [Your Name])
- Include a polite closing and signature if appropriate (but do not include "Kleber Garcia Alcatrão" unless the email is formal)
- Be concise (aim for 3-5 sentences unless the email requires a longer response)

If the email is automated, spam, or does not require a reply, return exactly: "NO_REPLY_NEEDED"

Email:
---BEGIN---
Subject: {subject}
From: {from_addr}
Date: {date}
{body_preview}
---END---

Reply draft:"""

def fetch_recent_unread(hours: int, limit: int):
    """Fetch unread emails from the last N hours."""
    # Gmail query: newer_than:{hours}h is:unread
    query = f'newer_than:{hours}h is:unread'
    # Exclude common automated senders to reduce noise
    query += ' -from:(no-reply@* noreply@* @github.com @linkedin.com @facebook.com @twitter.com)'
    msgs = gmail_search(query, limit=limit)
    return msgs

def get_email_details(msg_id: str) -> dict:
    raw = gmail_get(msg_id)
    headers = raw.get('payload', {}).get('headers', [])
    subject = next((h['value'] for h in headers if h['name'] == 'Subject'), '(no subject)')
    from_header = next((h['value'] for h in headers if h['name'] == 'From'), '')
    # Extract email address from "Name <email>" format
    from_match = re.search(r'<(.+?)>', from_header)
    from_addr = from_match.group(1) if from_match else from_header
    date_header = next((h['value'] for h in headers if h['name'] == 'Date'), '')
    body = extract_body_from_gmail_message(raw)
    preview = body[:1200]  # Increased preview for better context
    return {'id': msg_id, 'subject': subject, 'from': from_addr, 'date': date_header, 'body_preview': preview}

def generate_reply_suggestion(email: dict) -> str:
    """Ask LLM to generate a reply draft or indicate no reply needed."""
    prompt = PROMPT.format(
        subject=email['subject'],
        from_addr=email['from'],
        date=email['date'],
        body_preview=email['body_preview']
    )
    try:
        resp = chat([{'role': 'user', 'content': prompt}], provider='auto')
        reply = resp['content'].strip()
        # Check if the LLM indicated no reply needed
        if reply.upper() == 'NO_REPLY_NEEDED' or reply.upper() == 'NO REPLY':
            return None
        return reply
    except Exception as e:
        print(f"   [LLM Error] {e}", file=sys.stderr)
        return None

def create_gmail_draft(msg_id: str, reply_body: str) -> bool:
    """Create a Gmail draft reply to the given message."""
    try:
        # Get the original email to extract thread ID and references
        original = gmail_get(msg_id)
        # Create draft
        draft_id = gmail_create_draft(
            message_id=msg_id,  # Reply to this message
            body=reply_body
        )
        return bool(draft_id)
    except Exception as e:
        print(f"   [Draft Error] {e}", file=sys.stderr)
        return False

def apply_label(msg_id: str, label_name: str) -> bool:
    """Apply a label to the email to track that we've generated a suggestion."""
    try:
        label_id = gmail_get_or_create_label_id(label_name)
        gmail_batch_modify({'ids': [msg_id]}, addLabelIds=[label_id])
        return True
    except Exception as e:
        print(f"   [Label Error] {e}", file=sys.stderr)
        return False

def cmd_run(dry_run: bool, limit: int, hours: int):
    print(f"🔍 Scanning for unread emails from the last {hours} hours (limit {limit})...")
    msgs = fetch_recent_unread(hours, limit)
    if not msgs:
        print("✅ No unread emails found in the specified time window.")
        return

    print(f"📧 Found {len(msgs)} unread emails to process.")
    drafted = 0
    skipped = 0
    errors = 0

    for msg_meta in msgs:
        email = get_email_details(msg_meta['id'])
        print(f"\n📨 Processing: {email['subject'][:50]}... from {email['from']}")
        reply = generate_reply_suggestion(email)
        if reply is None:
            print("   → Skipped: No reply needed (per LLM)")
            skipped += 1
            continue

        print(f"   💡 Suggested reply ({len(reply)} chars):")
        print(f"   {reply[:200]}{'...' if len(reply) > 200 else ''}")

        if dry_run:
            print("   [DRY-RUN] Would create Gmail draft.")
            drafted += 1  # Count as would-be drafted
        else:
            if create_gmail_draft(email['id'], reply):
                print("   ✅ Draft created in Gmail.")
                # Optional: apply a label to track
                apply_label(email['id'], 'Predictive-Reply')
                drafted += 1
            else:
                print("   ❌ Failed to create draft.")
                errors += 1

    print(f"\n📊 Summary: {drafted} drafts {'would be ' if dry_run else ''}created, {skipped} skipped, {errors} errors.")
    if dry_run:
        print("💡 Add --execute to create actual drafts in Gmail.")

def main():
    parser = argparse.ArgumentParser(description='Predictive Responder for Zion Tech Group')
    parser.add_argument('--execute', action='store_true', help='Create actual drafts in Gmail (default: dry-run)')
    parser.add_argument('--limit', type=int, default=DEFAULT_LIMIT, help=f'Max emails to process (default {DEFAULT_LIMIT})')
    parser.add_argument('--hours', type=int, default=DEFAULT_HOURS, help=f'Look back N hours for unread emails (default {DEFAULT_HOURS})')
    args = parser.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit, hours=args.hours)

if __name__ == '__main__':
    main()