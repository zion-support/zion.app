#!/usr/bin/env python3
"""
Email Responder — Zion Tech Group

Analyzes high-priority unread emails and generates 3 draft reply options via LLM.
Sends Telegram message with clickable draft links (opens Gmail).

Strategy:
  1. Fetch Priority-4/5 unread emails (limit default 10)
  2. For each, construct context: sender, subject, snippet/body
  3. Ask LLM: "Write 3 short, professional reply options in Kleber's voice"
  4. Save each as Gmail draft; collect draft URLs
  5. Send Telegram summary with subject + 3 option previews + draft links

Schedule: On-demand triggered by high-priority email arrival (via email_prioritizer)

Usage: python3 email_responder.py [--execute] [--limit N]
"""

import sys, os, re, json, datetime, argparse
from pathlib import Path

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, gmail_create_draft_new, telegram_send
from llm_client import chat

DB_FILE = WORKSPACE / 'zion.app' / 'data' / 'email_responder.json'
PROMPT = """
You are Kleber Garcia Alcatrão, CEO of Zion Tech Group.
Write 3 short, professional, friendly reply options for this email.
Keep each under 60 words. Tone: direct, helpful, slightly informal.
Include appropriate greeting/closing.

Email details:
  From: {sender}
  Subject: {subject}
  Body snippet: {snippet}

Return as JSON array: [{{"option": 1, "text": "..."}}, ...]
"""

def load_db():
    if DB_FILE.exists():
        return json.loads(DB_FILE.read_text())
    return {'suggested': []}

def save_db(db):
    DB_FILE.parent.mkdir(parents=True, exist_ok=True)
    DB_FILE.write_text(json.dumps(db, indent=2))

def generate_reply_options(sender: str, subject: str, snippet: str) -> list:
    prompt = PROMPT.format(sender=sender, subject=subject, snippet=snippet[:300])
    try:
        resp = chat([{"role":"user","content":prompt}], provider="auto", temperature=0.8)
        content = resp.get('content','')
        # Try to parse JSON array
        try:
            import json as j
            options = j.loads(content)
            if isinstance(options, list) and len(options) >= 3:
                return [opt.get('text','') for opt in options[:3]]
        except Exception:
            pass
        # Fallback: split bynumbered lines
        lines = [l.strip() for l in content.split('\n') if l.strip().startswith(('1.','2.','3.','Option'))]
        if len(lines) >= 3:
            return [re.sub(r'^(1[.)]|2[.)]|3[.)]|Option \d:?)\s*', '', l) for l in lines[:3]]
    except Exception as e:
        print(f"   ⚠️  LLM failed: {e}")
    # Hardcoded fallbacks
    return [
        "Thanks for reaching out. I'll review and get back to you shortly.",
        "Appreciate you contacting us. We'll respond within 24 hours.",
        "Hi — received your message. We're on it and will follow up soon."
    ]

def cmd_run(dry_run=True, limit=10):
    db = load_db()
    query = 'is:unread (label:Priority-4 OR label:Priority-5)'
    msgs = gmail_search(query, limit=limit)
    if not msgs:
        print("✅ No high-priority emails to respond to.")
        return

    suggestions = 0
    for msg in msgs:
        msg_id = msg.get('id')
        if msg_id in db.get('suggested', []):
            continue

        headers = msg.get('payload', {}).get('headers', [])
        subject = next((h['value'] for h in headers if h['name']=='Subject'), '(no subject)')[:80]
        sender = next((h['value'] for h in headers if h['name']=='From'), 'unknown')
        snippet = msg.get('snippet', '')[:200]

        print(f"   💡 Generating replies for: {subject[:50]}")
        options = generate_reply_options(sender, subject, snippet)

        if dry_run:
            print(f"      [DRY-RUN] Would create 3 drafts for {sender}")
            for i, opt in enumerate(options, 1):
                print(f"         Option {i}: {opt[:60]}…")
            db['suggested'].append(msg_id)
            suggestions += 1
            continue

        # Save drafts and collect URLs
        draft_links = []
        for i, reply_text in enumerate(options, 1):
            draft_subject = f"Re: {subject}"
            try:
                draft_id = gmail_create_draft_new(
                    subject=draft_subject,
                    body=reply_text + "\n\n— Kleber Garcia Alcatrão\nCEO, Zion Tech Group",
                    to_addr=sender
                )
                # Gmail draft URL pattern
                draft_url = f"https://mail.google.com/mail/u/0/#drafts?compose={draft_id}"
                draft_links.append((i, draft_url, reply_text[:80]))
            except Exception as e:
                print(f"   ❌ Draft {i} failed: {e}")

        # Send Telegram summary
        lines = [f"📬 Reply suggestions for: {subject}"]
        lines.append(f"From: {sender}")
        lines.append("")
        for i, url, preview in draft_links:
            lines.append(f"{i}. {preview}…")
            lines.append(f"   {url}")
        try:
            telegram_send("\n".join(lines))
            print(f"   ✅ Sent {len(draft_links)} options to Telegram")
        except Exception as e:
            print(f"   ❌ Telegram failed: {e}")

        db['suggested'].append(msg_id)
        suggestions += 1

    if not dry_run:
        db['lastRun'] = datetime.datetime.utcnow().isoformat()
        save_db(db)

    print(f"\n✅ Generated reply suggestions for {suggestions} emails.")
    if dry_run:
        print("💡 Add --execute to create drafts and send Telegram summary.")

def main():
    p = argparse.ArgumentParser(description='Email Responder — LLM reply suggestions')
    p.add_argument('--execute', action='store_true')
    p.add_argument('--limit', type=int, default=10)
    args = p.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)

if __name__ == '__main__':
    main()
