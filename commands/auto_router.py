#!/usr/bin/env python3
from __future__ import annotations

"""
Auto-Router — Zion Tech Group

Extended version of auto_labeler that also classifies emails by intent
and assigns to team routing labels: Routing-Sales, Routing-Support, Routing-Tech.

Uses LLM to analyze email content and suggest appropriate team.
Runs every 30 minutes alongside auto_labeler.

Usage:
  python3 auto_router.py [--execute] [--limit 30]
"""

import sys, os, re, json, datetime, argparse
from pathlib import Path

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, gmail_get, gmail_get_or_create_label_id, gmail_batch_modify
from llm_client import chat

BATCH_SIZE = 30
AUTO_ROUTE_LABEL = '[AUTO-ROUTE]'  # internal debug label
PROCESSED_LABEL = 'Auto-Processed'

# Routing categories and their labeling/notification logic
ROUTING_MAP = {
    'sales': {
        'label': 'Routing-Sales',
        'notify': False,  # could notify sales Telegram channel if configured
        'patterns': [r'\b(interested in buying|purchase|quote request|pricing|buy|acquire)\b', r'\b(proposal|contract| partnership)\b'],
    },
    'support': {
        'label': 'Routing-Support',
        'notify': True,
        'patterns': [r'\b(help|support|issue|problem|not working|broken|error|stuck|unable)\b', r'\b(how do I|can\'t|cannot)\b'],
    },
    'tech': {
        'label': 'Routing-Tech',
        'notify': True,
        'patterns': [r'\b(bug|crash|api|deployment|server|infrastructure|devops|ci/cd)\b', r'\b(technical|code|implementation)\b'],
    },
}

def detect_route_category(subject: str, body_preview: str) -> str | None:
    text = (subject + ' ' + body_preview).lower()
    for team, config in ROUTING_MAP.items():
        for pat in config['patterns']:
            if re.search(pat, text, re.IGNORECASE):
                return team
    return None

def cmd_run(dry_run: bool, limit: int):
    print("🎯 Auto-Router scanning inbox…")
    query = 'is:unread -label:[AUTO-ROUTE] -label:Auto-Processed'
    msgs = gmail_search(query, limit=limit)
    print(f"   Found {len(msgs)} candidate emails")

    routed = 0
    for msg in msgs:
        msg_id = msg['id']
        full = gmail_get(msg_id)
        headers = full.get('payload', {}).get('headers', [])
        subject = next((h['value'] for h in headers if h['name']=='Subject'), '')
        from_addr = next((h['value'] for h in headers if h['name']=='From'), '')
        body = extract_body_from_gmail_message(full)[:500]

        team = detect_route_category(subject, body)
        if not team:
            # Fallback to LLM classification
            prompt = (
                "Classify this email into one team: Sales, Support, Tech.\n"
                "Return only the team name. If ambiguous, return 'Support'.\n\n"
                f"Subject: {subject}\nFrom: {from_addr}\nBody: {body[:300]}"
            )
            try:
                resp = chat([{"role":"user","content":prompt}], provider="auto")
                guess = resp['content'].strip().lower()
                if guess in ['sales','support','tech']:
                    team = guess
            except Exception:
                team = None

        if not team:
            print(f"   ⚠️  Could not classify: {subject[:60]} — skipping")
            continue

        label_name = ROUTING_MAP[team]['label']
        label_id = gmail_get_or_create_label_id(label_name)

        if dry_run:
            print(f"   [DRY-RUN] Would label as '{label_name}': {subject[:60]}")
            routed += 1
            continue

        # Apply routing label + auto-route marker
        label_ids = [label_id]
        # Also ensure [AUTO-ROUTE] marker applied (internal)
        marker_id = gmail_get_or_create_label_id(AUTO_ROUTE_LABEL)
        label_ids.append(marker_id)
        # Optionally also apply Processed label if configured
        try:
            gmail_batch_modify([msg_id], addLabelIds=label_ids, removeLabelIds=[])
            routed += 1
            print(f"   ✅ Routed to {team}: {subject[:60]}")
        except Exception as e:
            print(f"   ❌ Failed to label {msg_id}: {e}")

    print(f"\n✅ Routed {routed} emails to teams.")

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

def main():
    parser = argparse.ArgumentParser(description='Auto-Router — team assignment')
    parser.add_argument('--execute', action='store_true', help='Apply labels (default dry-run)')
    parser.add_argument('--limit', type=int, default=BATCH_SIZE, help='Max emails to scan')
    args = parser.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)

if __name__ == '__main__':
    main()
