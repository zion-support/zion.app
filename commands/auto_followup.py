#!/usr/bin/env python3
from __future__ import annotations

"""
Auto Follow-up Sequences — Zion Tech Group

Manages multi-touch follow-up campaigns for different email categories.
Tracks state per thread; schedules follow-up drafts at configured intervals
until the thread is replied to or sequence completes.

Current sequences:
  - quote_followup:  Day 0 (quote sent) → Day 3 (check-in) → Day 7 (final)
  - proposal_followup: Day 0 (proposal sent) → Day 5 (clarify) → Day 10 (closing)

Usage:
  python3 auto_followup.py [--execute]   # Enqueue next follow-ups (default dry-run)
"""

import sys, os, re, json, datetime, argparse, urllib.request, urllib.parse
from pathlib import Path

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, gmail_get, gmail_get_or_create_label_id, gmail_create_draft, gmail_batch_modify
from llm_client import chat

SEQUENCE_DB = WORKSPACE / 'zion.app' / 'data' / 'followup_sequences.json'
KLEBER_EMAIL = 'kleber@ziontechgroup.com'

# ── Sequence definitions ──────────────────────────────────────────────────────

SEQUENCES = {
    'quote_followup': {
        'trigger_label': '[AUTO-DRAFT]',
        'stages': [
            {'days': 3,  'subject': 'Checking in on your quote request',  'tone': 'polite check-in'},
            {'days': 7,  'subject': 'Following up on your quote',           'tone': 'gentle reminder'},
            {'days': 14, 'subject': 'Last chance for quote — expiring soon', 'tone': 'urgency, friendly'},
        ],
        # Detect if original was a quote by category (from smart_reply_queue logs/category)
        'category_triggers': ['quote_request'],
    },
    'proposal_followup': {
        'trigger_label': 'Proposal-Sent',
        'stages': [
            {'days': 5,  'subject': 'Questions about the proposal?',      'tone': 'helpful'},
            {'days': 10, 'subject': 'Next steps for the proposal',         'tone': 'forward-looking'},
            {'days': 17, 'subject': 'Proposal follow-up',                  'tone': 'final check'},
        ],
        'category_triggers': None,  # explicit label only
    },
}

# ── State management ──────────────────────────────────────────────────────────

def load_state() -> dict:
    if SEQUENCE_DB.exists():
        return json.loads(SEQUENCE_DB.read_text())
    return {'threads': {}}

def save_state(state: dict):
    SEQUENCE_DB.parent.mkdir(parents=True, exist_ok=True)
    SEQUENCE_DB.write_text(json.dumps(state, indent=2))

def get_thread_category(thread_id: str) -> str | None:
    """Re-use category detection from smart_reply_learning (duplicate logic for isolation)."""
    msgs = gmail_search(f'thread:{thread_id}', limit=5)
    if not msgs:
        return None
    first = gmail_get(msgs[0]['id'])
    headers = {h['name']: h['value'] for h in first.get('payload', {}).get('headers', [])}
    subject = headers.get('Subject','')
    body = extract_body_from_gmail_message(first)[:500]
    text = (subject + ' ' + body).lower()
    patterns = {
        'quote_request': [r'\b(quote|quotation|pricing|how much|cost of|estimate)\b', r'\b(please quote|can you quote)\b'],
        'meeting_invite': [r'\b(meeting|call|zoom|schedule|when are you free)\b'],
        'error_report': [r'\b(error|failed|broken|issue|problem|bug)\b'],
        'info_request': [r'\b(what is|how do|please provide|information about)\b'],
    }
    for cat, pats in patterns.items():
        for pat in pats:
            if re.search(pat, text, re.IGNORECASE):
                return cat
    return None

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

def get_latest_sent_message_in_thread(thread_id: str) -> dict | None:
    """Find the most recent SENT message from Kleber in the thread."""
    msgs = gmail_search(f'thread:{thread_id} from:{KLEBER_EMAIL}', limit=5)
    if not msgs:
        return None
    # Sort by internalDate descending
    msgs_sorted = sorted(msgs, key=lambda m: int(m.get('internalDate',0)), reverse=True)
    latest_id = msgs_sorted[0]['id']
    return gmail_get(latest_id)

def create_followup_draft(thread_id: str, seq_name: str, stage_idx: int, original_from: str, original_subject: str) -> str:
    stage = SEQUENCES[seq_name]['stages'][stage_idx]
    prompt = (
        f"You are Kleber Garcia Alcatrão (CEO, Zion Tech Group). Write a {stage['tone']} follow-up email.\n"
        f"Recipient: {original_from}\nContext: This is follow-up #{stage_idx+1} in a sequence.\n"
        f"Original subject: {original_subject}\n\n"
        "Keep it concise (2–3 sentences). Do not include subject line in body."
    )
    resp = chat([{"role":"user","content":prompt}], provider="auto")
    body = resp['content'].strip()

    draft_subject = f"Re: {original_subject}" if stage_idx == 0 else stage['subject']
    draft = gmail_create_draft(
        to=[original_from],
        subject=draft_subject,
        body=body,
        thread_id=thread_id
    )
    return draft.get('id')

def mark_thread_replied(state: dict, thread_id: str):
    if thread_id in state['threads']:
        state['threads'][thread_id]['status'] = 'replied'

# ── Main logic ────────────────────────────────────────────────────────────────

def cmd_run(dry_run: bool):
    print("🔄 Auto Follow-up Sequences scanning…")
    state = load_state()
    today = datetime.date.today().isoformat()
    drafted = 0

    for seq_name, seq_def in SEQUENCES.items():
        # Find candidate threads: must have trigger label, not completed/replied, and next stage due
        query = f'label:"{seq_def["trigger_label"]}"'
        threads = gmail_search(query, limit=200)
        print(f"   {seq_name}: {len(threads)} trigger-labeled threads")

        for t in threads:
            thread_id = t['threadId']
            rec = state['threads'].get(thread_id, {
                'sequence': seq_name,
                'current_stage': -1,
                'status': 'active',
                'last_followup': None,
                'created': today,
            })
            if rec['status'] == 'replied':
                continue

            # Check if thread has any SENT message from Kleber after the trigger (i.e., we already replied)
            sent_check = gmail_search(f'thread:{thread_id} from:{KLEBER_EMAIL}', limit=1)
            if not sent_check:
                # No outbound yet — this is the initial draft; skip; smart_reply_queue handles it
                continue

            # Determine next stage index
            next_stage = rec['current_stage'] + 1
            if next_stage >= len(seq_def['stages']):
                # Sequence complete
                rec['status'] = 'completed'
                state['threads'][thread_id] = rec
                continue

            # Is it due?
            last_followup = rec.get('last_followup')
            if last_followup:
                last_date = datetime.date.fromisoformat(last_followup)
                due_date = last_date + datetime.timedelta(days=seq_def['stages'][next_stage]['days'])
                if datetime.date.today() < due_date:
                    continue  # not due yet

            # Ready to draft next follow-up
            original_msg = gmail_get(t['id'])
            hdrs = {h['name']: h['value'] for h in original_msg.get('payload', {}).get('headers', [])}
            orig_from = hdrs.get('From','')
            orig_subject = hdrs.get('Subject','No Subject')

            if dry_run:
                print(f"   [DRY-RUN] {seq_name} stage {next_stage+1} due for thread {thread_id[:8]}…")
                drafted += 1
                rec['current_stage'] = next_stage
                rec['last_followup'] = today
                state['threads'][thread_id] = rec
                continue

            try:
                draft_id = create_followup_draft(thread_id, seq_name, next_stage, orig_from, orig_subject)
                print(f"   ✅ Draft #{next_stage+1} created for {thread_id[:8]}")
                drafted += 1
                rec['current_stage'] = next_stage
                rec['last_followup'] = today
                state['threads'][thread_id] = rec
            except Exception as e:
                print(f"   ❌ Draft failed for {thread_id}: {e}")

    save_state(state)
    print(f"\n✅ Drafted {drafted} follow-up emails.")

    if dry_run:
        print("💡 Add --execute to create drafts.")

def main():
    parser = argparse.ArgumentParser(description='Auto Follow-up Sequences')
    parser.add_argument('--execute', action='store_true', help='Create draft follow-ups')
    args = parser.parse_args()
    cmd_run(dry_run=not args.execute)

if __name__ == '__main__':
    main()
