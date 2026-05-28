#!/usr/bin/env python3
"""
Smart Reply Auto-Suggest — Zion Tech Group

Uses learned reply patterns (from smart_reply_learning) to generate
contextual reply suggestions for high-priority emails.
Delivers via Telegram with inline buttons for 1-click send.

Strategy:
  1. Load learned templates from smart_reply_learning DB
  2. Match incoming email by sender domain + label + keyword patterns
  3. Populate template with dynamic fields (sender name, subject context)
  4. Send Telegram message with 3 buttons: "Send Option 1", "Send Option 2", "Send Option 3"
  5. On button click: create Gmail draft (or send directly if configured)

Schedule: Every 30 minutes (already running with smart_reply_queue)

Usage: python3 smart_reply_auto_suggest.py [--execute] [--limit N]
"""

import sys, os, re, json, datetime, argparse, urllib.request
from pathlib import Path

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, gmail_create_draft_new, telegram_send

DB_FILE = WORKSPACE / 'zion.app' / 'data' / 'smart_reply_templates.json'
PENDING_FILE = WORKSPACE / 'zion.app' / 'data' / 'smart_reply_pending.json'

def load_templates():
    if DB_FILE.exists():
        data = json.loads(DB_FILE.read_text())
        return data.get('templates', [])
    return []

def load_pending():
    if PENDING_FILE.exists():
        return json.loads(PENDING_FILE.read_text())
    return {'pending': []}

def save_pending(pending):
    PENDING_FILE.parent.mkdir(parents=True, exist_ok=True)
    PENDING_FILE.write_text(json.dumps(pending, indent=2))

def match_template(email_context: dict, templates: list) -> list:
    """Find up to 3 matching templates based on sender domain, labels, keywords."""
    matches = []
    sender_dom = extract_domain(email_context.get('from',''))
    for t in templates:
        score = 0
        # Domain match
        if t.get('domain') and t['domain'] == sender_dom:
            score += 10
        # Label match
        email_labels = email_context.get('labelIds', [])
        for lbl in email_labels:
            if lbl in t.get('labels', []):
                score += 5
        # Keyword match
        subject = email_context.get('subject','').lower()
        snippet = email_context.get('snippet','').lower()
        for kw in t.get('keywords', []):
            if kw.lower() in subject or kw.lower() in snippet:
                score += 2
        if score > 0:
            matches.append((score, t))
    # Sort by score descending, take top 3
    matches.sort(key=lambda x: x[0], reverse=True)
    return [t for _, t in matches[:3]]

def extract_domain(email: str) -> str:
    # Parse "Name <email@domain.com>" or just "email@domain.com"
    m = re.search(r'@([\w\.-]+)', email)
    return m.group(1).lower() if m else ''

def fill_template(template: str, context: dict) -> str:
    """Replace placeholders like {sender_name}, {subject}, {date}."""
    sender = context.get('from','Valued Client')
    sender_name = sender.split('<')[0].strip() or 'there'
    subject = context.get('subject','')
    date = datetime.date.today().isoformat()
    return template.format(sender_name=sender_name, sender_email=sender, subject=subject, date=date)

def send_telegram_with_buttons(email_context: dict, options: list) -> bool:
    """Send Telegram message with inline buttons for each reply option."""
    subject = email_context.get('subject','(no subject)')[:60]
    sender = email_context.get('from','unknown')[:40]
    msg_id = email_context.get('id','')

    lines = [f"📬 Smart Reply — {subject}", f"From: {sender}", ""]
    for i, opt in enumerate(options, 1):
        preview = opt[:80]
        lines.append(f"{i}. {preview}")

    text = "\n".join(lines)

    # Build inline buttons
    buttons = []
    for i in range(len(options)):
        buttons.append({
            "text": f"Send Option {i+1}",
            "callback_data": f"reply_send:{msg_id}:{i}"  # will be handled by a separate listener
        })

    try:
        telegram_send(text, buttons=buttons)
        return True
    except Exception as e:
        print(f"   ❌ Telegram failed: {e}")
        return False

def cmd_run(dry_run=True, limit=10):
    templates = load_templates()
    if not templates:
        print("⚠️  No smart reply templates learned yet. Run smart_reply_learning.py --execute first.")
        return

    query = 'is:unread (label:Priority-4 OR label:Priority-5)'
    msgs = gmail_search(query, limit=limit)
    if not msgs:
        print("✅ No high-priority emails to suggest replies for.")
        return

    pending_db = load_pending()
    suggested = 0

    for msg in msgs:
        msg_id = msg.get('id')
        if msg_id in pending_db.get('pending', []):
            continue  # already suggested

        # Build email context
        headers = msg.get('payload', {}).get('headers', [])
        subject = next((h['value'] for h in headers if h['name']=='Subject'), '(no subject)')
        sender = next((h['value'] for h in headers if h['name']=='From'), 'unknown')
        labels = msg.get('labelIds', [])
        snippet = msg.get('snippet','')

        context = {
            'id': msg_id,
            'subject': subject,
            'from': sender,
            'labelIds': labels,
            'snippet': snippet
        }

        matching_templates = match_template(context, templates)
        if not matching_templates:
            continue

        # Prepare reply options
        options = []
        for t in matching_templates[:3]:
            filled = fill_template(t['template'], context)
            options.append(filled)

        if dry_run:
            print(f"   [DRY-RUN] Would suggest 3 replies for: {subject[:50]}")
            for i, opt in enumerate(options, 1):
                print(f"      Option {i}: {opt[:60]}…")
            pending_db['pending'].append(msg_id)
            suggested += 1
            continue

        # Send to Telegram with buttons
        if send_telegram_with_buttons(context, options):
            pending_db['pending'].append(msg_id)
            suggested += 1
            print(f"   ✅ Sent smart reply suggestions: {subject[:50]}")
        else:
            print(f"   ❌ Failed to send suggestions: {subject[:50]}")

    if not dry_run:
        pending_db['lastRun'] = datetime.datetime.utcnow().isoformat()
        save_pending(pending_db)

    print(f"\n✅ Generated suggestions for {suggested} emails.")
    if dry_run:
        print("💡 Add --execute to send Telegram suggestions with buttons.")

def main():
    p = argparse.ArgumentParser(description='Smart Reply Auto-Suggest')
    p.add_argument('--execute', action='store_true')
    p.add_argument('--limit', type=int, default=10)
    args = p.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)

if __name__ == '__main__':
    main()
