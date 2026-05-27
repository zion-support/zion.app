#!/usr/bin/env python3
from __future__ import annotations

"""
Smart Reply Draft Queue — Zion

Monitors unread emails and auto-drafts contextually appropriate replies
using LLM fallback chain. Drafts are created in Gmail with label
'[AUTO-DRAFT]' for Kleber to review and send with one click.

Usage:
  python3 smart_reply_queue.py --execute     # Draft replies (default dry-run)
  python3 smart_reply_queue.py --dry-run     # Preview only
  python3 smart_reply_queue.py --limit 20    # Max emails to scan
"""

import sys, os, re, argparse
from pathlib import Path

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, gmail_get, gmail_get_or_create_label_id, gmail_batch_modify, gmail_create_draft, extract_body_from_gmail_message
from llm_client import chat

# ── Configuration ────────────────────────────────────────────────────────────

BATCH_SIZE = 20
AUTO_DRAFT_LABEL = '[AUTO-DRAFT]'
PROCESSED_LABEL = 'Auto-Processed'

# Email patterns that benefit from auto-drafting
PATTERNS = {
    'quote_request': [
        r'\b(quote|quotation|pricing|how much|cost of|estimate)\b',
        r'\b(please quote|can you quote|interested in)\b',
    ],
    'meeting_invite': [
        r'\b(meeting|call|zoom|teams|schedule|available|when are you free)\b',
        r'\b(let\'s (discuss|talk)|chat about)\b',
    ],
    'error_report': [
        r'\b(error|failed|broken|issue|problem|bug|crash|down)\b',
        r'\b(not working|stuck|unable to)\b',
    ],
    'info_request': [
        r'\b(what is|how do|can you tell|please provide|information about)\b',
        r'\b(details on|more info)\b',
    ],
}

def detect_category(subject: str, body_preview: str) -> str:
    """Match email against pattern dict; return category key or None."""
    text = (subject + ' ' + body_preview).lower()
    for cat, patterns in PATTERNS.items():
        for pat in patterns:
            if re.search(pat, text, re.IGNORECASE):
                return cat
    return None

def looks_non_english(text: str) -> bool:
    """Heuristic: if >5% of characters are non-ASCII, treat as non-English."""
    if not text:
        return False
    ascii_count = sum(1 for c in text if ord(c) < 128)
    ratio = ascii_count / len(text)
    return ratio < 0.95

def translate_to_english(text: str) -> str:
    """Use LLM to translate any language to English."""
    prompt = (
        "Translate the following message to English. Preserve meaning and tone. "
        "Return only the translated text, no commentary.\n\n"
        f"---\n{text[:3000]}\n---"
    )
    resp = chat([{"role": "user", "content": prompt}], provider="auto")
    return resp['content'].strip()

def build_draft_prompt(category: str, email: dict) -> str:
    """Construct LLM prompt to draft a polite, context-aware reply."""
    templates = {
        'quote_request': (
            "You are drafting a polite, professional reply for Kleber Garcia Alcatrão (CEO, Zion Tech Group). "
            "The sender is requesting a quote or pricing information. "
            "Acknowledge their request, mention we'll review and respond with detailed pricing shortly, "
            "and ask for any missing specifics (company size, timeline, requirements) if needed.\n\n"
            "Keep it concise (2–3 sentences)."
        ),
        'meeting_invite': (
            "Draft a brief reply confirming receipt of a meeting invite request. "
            "State that Kleber will check his calendar and confirm shortly. "
            "If the proposed time is unclear, ask for alternatives."
        ),
        'error_report': (
            "Draft an acknowledgment for a reported error or system issue. "
            "Thank the sender for reporting, assure them the team is investigating, "
            "and ask for any additional details (screenshots, steps to reproduce) if helpful."
        ),
        'info_request': (
            "Draft a helpful response to an information request. "
            "Confirm receipt and say the relevant team will compile the requested details. "
            "If the request is vague, ask for clarification on scope."
        ),
    }
    base = templates.get(category, "Draft a polite, professional acknowledgment email.")
    prompt = f"""{base}

Email details:
Subject: {email['subject']}
From: {email['from']}
Body preview:
{email['body_preview'][:500]}

Draft reply (from Kleber Garcia Alcatrão, CEO, Zion Tech Group):"""
    return prompt

def categorize_and_score(email: dict) -> tuple[str | None, int]:
    """Return (category, urgency 1–5). Category None = skip."""
    cat = detect_category(email['subject'], email['body_preview'])
    if not cat:
        return None, 0

    # Simple urgency heuristic based on keywords
    subj = email['subject'].lower()
    body = email['body_preview'].lower()
    if any(w in subj for w in ['urgent', 'asap', 'immediately', 'critical', 'outage']):
        urgency = 5
    elif any(w in subj for w in ['legal', 'compliance', 'payment overdue', 'lawsuit']):
        urgency = 4
    elif cat == 'error_report':
        urgency = 3 if 'production' in body or 'live' in body else 2
    elif cat == 'quote_request':
        urgency = 3 if 'large' in body or 'enterprise' in body else 2
    elif cat == 'meeting_invite':
        urgency = 2
    else:
        urgency = 1
    return cat, urgency

def create_draft_reply(msg_id: str, original_subject: str, from_addr: str, draft_body: str) -> str:
    """Create Gmail draft in the same thread."""
    subject = f"Re: {original_subject}"
    return gmail_create_draft(thread_id=msg_id, subject=subject, body=draft_body, to_addr=from_addr)

def cmd_run(dry_run: bool, limit: int):
    print(f"🤖 Smart Reply Queue scanning {limit} unread emails…")
    msgs = gmail_search('is:unread', limit=limit)
    print(f"📥 Fetched {len(msgs)} emails")

    processed = 0
    drafted = 0
    for msg_meta in msgs:
        msg_id = msg_meta['id']
        msg = gmail_get(msg_id)
        headers = msg.get('payload', {}).get('headers', [])
        subject = next((h['value'] for h in headers if h['name'] == 'Subject'), '(no subject)')
        from_header = next((h['value'] for h in headers if h['name'] == 'From'), '')
        from_match = re.search(r'<(.+?)>', from_header)
        from_addr = from_match.group(1) if from_match else from_header
        body = extract_body_from_gmail_message(msg)
        preview = body[:800]

        email = {'id': msg_id, 'subject': subject, 'from': from_addr, 'body_preview': preview}

        # If email appears non-English, translate body preview for understanding
        if looks_non_english(preview):
            try:
                translated = translate_to_english(preview)
                # Use translated text for category detection and drafting
                email['body_preview'] = translated
                email['_original_language'] = 'foreign'
            except Exception as e:
                print(f"      ⚠️  Translation failed: {e}")

        cat, urgency = categorize_and_score(email)
        if not cat:
            # Skip emails we don't recognize
            continue

        print(f"\n   📧 {subject[:60]}")
        print(f"      Category: {cat}  Urgency: {urgency}")

        if dry_run:
            print(f"      [DRY-RUN] Would generate draft reply via LLM")
            drafted += 1
        else:
            # Generate draft using LLM
            prompt = build_draft_prompt(cat, email)
            try:
                resp = chat([{'role': 'user', 'content': prompt}], provider='auto')
                draft_text = resp['content'].strip()
                draft_id = create_draft_reply(msg_id, subject, from_addr, draft_text)
                print(f"      ✅ Draft created (ID: {draft_id[:8]}…)")
                drafted += 1
            except Exception as e:
                print(f"      ❌ Draft failed: {e}")

        # Label as processed (so we don't re-draft)
        label_id = gmail_get_or_create_label_id(PROCESSED_LABEL)
        gmail_batch_modify({'ids': [msg_id]}, addLabelIds=[label_id])

        processed += 1

    print(f"\n✅ Processed {processed} auto-draftable emails.")
    if dry_run:
        print(f"💡 Add --execute to create {drafted} draft(s).")
    else:
        print(f"✉️  Created {drafted} draft(s) for review in Gmail.")

def main():
    parser = argparse.ArgumentParser(description='Smart Reply Draft Queue')
    parser.add_argument('--execute', action='store_true', help='Create drafts (default: dry-run)')
    parser.add_argument('--limit', type=int, default=BATCH_SIZE, help='Max emails to scan')
    args = parser.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)

if __name__ == '__main__':
    main()
