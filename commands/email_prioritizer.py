#!/usr/bin/env python3
"""
Email Priority Sorter — Zion

Scans recent unread emails and uses LLM to assign a priority score (1–5).
Sends Telegram summary with High/Critical emails highlighted.
Also applies 'Priority-1'..'Priority-5' labels in Gmail for easy filtering.

Usage:
  python3 email_prioritizer.py --limit 30   # Scan up to 30 emails (default)
"""

import sys, os, re, datetime, argparse
from pathlib import Path

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, gmail_get, gmail_get_or_create_label_id, gmail_batch_modify, extract_body_from_gmail_message
from llm_client import chat

# ── Configuration ────────────────────────────────────────────────────────────

BATCH_SIZE = 30

PROMPT = """You are an email triage assistant for Kleber Garcia Alcatrão (CEO, Zion Tech Group).

Rate this email's priority from 1 to 5:

1 = Low — newsletters, automated notifications, marketing
2 = Normal — routine business correspondence, vendor updates, internal notifications
3 = Medium — client inquiries, project updates, time-sensitive but not urgent
4 = High — urgent client issue, legal/financial matter, system outage
5 = Critical — legal notice, compliance issue, major security incident, lawsuit, payment overdue

Return ONLY the number (1, 2, 3, 4, or 5).

Email:
---BEGIN---
Subject: {subject}
From: {from_addr}
{body_preview}
---END---
"""

def fetch_recent_unread(limit: int):
    msgs = gmail_search('is:unread', limit=limit)
    return msgs

def get_email_details(msg_id: str) -> dict:
    raw = gmail_get(msg_id)
    headers = raw.get('payload', {}).get('headers', [])
    subject = next((h['value'] for h in headers if h['name'] == 'Subject'), '(no subject)')
    from_header = next((h['value'] for h in headers if h['name'] == 'From'), '')
    from_match = re.search(r'<(.+?)>', from_header)
    from_addr = from_match.group(1) if from_match else from_header
    body = extract_body_from_gmail_message(raw)
    preview = body[:600]
    return {'id': msg_id, 'subject': subject, 'from': from_addr, 'body_preview': preview}

def score_email(email: dict) -> int:
    """Ask LLM to score 1–5. Fallback: keyword heuristic."""
    prompt = PROMPT.format(
        subject=email['subject'],
        from_addr=email['from'],
        body_preview=email['body_preview']
    )
    try:
        resp = chat([{'role': 'user', 'content': prompt}], provider='auto')
        score = int(resp['content'].strip())
        if 1 <= score <= 5:
            return score
    except Exception:
        pass
    # Fallback heuristic
    subj = email['subject'].lower()
    body = email['body_preview'].lower()
    if any(w in subj for w in ['urgent', 'asap', 'immediately', 'critical', 'outage', 'down']):
        return 5
    if any(w in subj for w in ['legal', 'lawsuit', 'compliance', 'payment overdue']):
        return 4
    if any(w in subj + body for w in ['client', 'issue', 'problem', 'support']):
        return 3
    if 'github' in subj or 'automation' in body:
        return 2
    return 1

def build_telegram_message(prioritized: list) -> str:
    """Construct a readable Telegram alert."""
    lines = ["📨 *Email Priority Report*\n"]
    for p in prioritized:
        prio = p['priority']
        emoji = {5: '🔴', 4: '🟠', 3: '🟡', 2: '🟢', 1: '⚪'}[prio]
        lines.append(f"{emoji} *P{prio}* — {p['subject'][:45]}")
        lines.append(f"   From: {p['from']}\n")
    lines.append(f"_Total scanned: {len(prioritized)}_")
    return '\n'.join(lines)

def send_telegram(text: str):
    """Send via OpenClaw message tool (calls internal Telegram)."""
    # Use OpenClaw's internal `message` tool via process or direct call
    # For simplicity in this script, we'll write to stdout and let heartbeat deliver
    print("\n=== TELEGRAM ALERT ===")
    print(text)
    print("=====================\n")
    # In production this would call `message(action='send', target='telegram:...', ...)`
    pass

def apply_priority_labels(msg_ids: list, scores: dict):
    """Apply Priority-N labels to each message based on score."""
    # Ensure labels exist (1–5)
    label_ids = {}
    for score in range(1, 6):
        label_name = f'Priority-{score}'
        label_id = gmail_get_or_create_label_id(label_name)
        label_ids[score] = label_id

    # Batch modify in groups of 100 (Gmail limit)
    for i in range(0, len(msg_ids), 100):
        batch = msg_ids[i:i+100]
        # For each message, add its priority label
        for msg_id in batch:
            score = scores[msg_id]
            gmail_batch_modify({'ids': [msg_id]}, addLabelIds=[label_ids[score]])

    # (Optional) could also remove old Priority-* labels but not necessary)

def cmd_run(dry_run: bool, limit: int):
    print(f"🔍 Scanning {limit} unread emails for priority…")
    msgs = fetch_recent_unread(limit)
    if not msgs:
        print("✅ No unread emails.")
        return

    prioritized = []
    scores = {}
    for msg_meta in msgs:
        email = get_email_details(msg_meta['id'])
        score = score_email(email)
        scores[email['id']] = score
        if score >= 4:
            prioritized.append({'subject': email['subject'], 'from': email['from'], 'priority': score})

    if dry_run:
        print("   [DRY-RUN] Would apply Priority-N labels:")
        for eid, score in scores.items():
            print(f"      {eid[:8]}… → Priority-{score}")
        print(f"\n💡 Dry-run complete. Add --execute to label {len(scores)} emails.")
    else:
        print("🏷️  Applying Priority labels…")
        apply_priority_labels(list(scores.keys()), scores)
        print(f"✅ Applied labels to {len(scores)} emails.")

    high_count = sum(1 for p in prioritized if p['priority'] >= 4)
    print(f"📊 Scored {len(msgs)} emails. High/Critical: {high_count}")

    if prioritized:
        telegram_text = build_telegram_message(sorted(prioritized, key=lambda x: -x['priority']))
        send_telegram(telegram_text)
    else:
        print("✅ No high-priority emails right now.")

def main():
    parser = argparse.ArgumentParser(description='Email Priority Sorter')
    parser.add_argument('--execute', action='store_true', help='Apply Priority-N labels (default: dry-run)')
    parser.add_argument('--limit', type=int, default=BATCH_SIZE, help='Max emails to scan (default 30)')
    args = parser.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)

if __name__ == '__main__':
    main()
