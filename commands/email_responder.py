#!/usr/bin/env python3
"""
Email Responder — Zion Tech Group (V29)
Analyzes high-priority unread emails with case analysis and generates 3 draft reply options via LLM.
Sends Telegram message with clickable draft links (opens Gmail).
Includes case analysis (sentiment, urgency, intent) and reply-all suggestion.
"""

import sys, os, re, json, datetime, argparse, base64
from pathlib import Path

# Set up paths relative to this file's location
BASE_DIR = Path(__file__).resolve().parent.parent.parent  # /Users/klebergarciaalcatrao/.openclaw/workspace
ZION_APP = BASE_DIR / 'zion.app'
sys.path.insert(0, str(ZION_APP / 'commands'))
sys.path.insert(0, str(ZION_APP / 'lib'))

# Import google_workspace and adjust its paths to use BASE_DIR (since we are on macOS, not in the sandbox)
import google_workspace
google_workspace.WORKSPACE = BASE_DIR
google_workspace.TOKENS_FILE = google_workspace.WORKSPACE / 'gog_tokens.json'

from google_workspace import gmail_search, gmail_get, gmail_create_draft_new, telegram_send
from llm_client import chat
from case_analyzer import analyze_email  # Our new case analyzer

DB_FILE = ZION_APP / 'data' / 'email_responder.json'
PROMPT = """You are Kleber Garcia Alcatrão, CEO of Zion Tech Group.
Write 3 short, professional, friendly reply options for this email.
Keep each under 60 words. Tone: direct, helpful, slightly informal.
Include appropriate greeting/closing.

Email details:
  From: {sender}
  Subject: {subject}
  Body snippet: {snippet}

Analysis:
  Sentiment: {sentiment}
  Urgency: {urgency}
  Intent: {intent}

{reply_all_note}

Return as JSON array: [{"option": 1, "text": "..."}, ...]
"""

def load_db():
    if DB_FILE.exists():
        return json.loads(DB_FILE.read_text())
    return {'suggested': []}

def save_db(db):
    DB_FILE.parent.mkdir(parents=True, exist_ok=True)
    DB_FILE.write_text(json.dumps(db, indent=2))

def generate_reply_options(sender: str, subject: str, snippet: str, sentiment: str, urgency: str, intent: str, reply_all_suggested: bool) -> list:
    reply_all_note = "Consider replying-all to the original recipients." if reply_all_suggested else ""
    prompt = PROMPT.format(sender=sender, subject=subject, snippet=snippet[:300], sentiment=sentiment, urgency=urgency, intent=intent, reply_all_note=reply_all_note)
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
        # Fallback: split by numbered lines
        lines = [l.strip() for l in content.split('\\n') if l.strip().startswith(('1.','2.','3.','Option'))]
        if len(lines) >= 3:
            return [re.sub(r'^(1[.)]|2[.)]|3[.)]|Option \\d:?)\\s*', '', l) for l in lines[:3]]
    except Exception as e:
        print(f"   ⚠️  LLM failed: {e}")
    # Hardcoded fallbacks
    return [
        "Thanks for reaching out. I'll review and get back to you shortly.",
        "Appreciate you contacting us. We'll respond within 24 hours.",
        "Hi — received your message. We're on it and will follow up soon."
    ]

def cmd_run(dry_run=True, limit=10):
    # Check if token file exists; if not, we can only do dry_run (or we could try to create a dummy token for testing?)
    # For safety, if token file doesn't exist, we force dry_run and warn.
    if not google_workspace.TOKENS_FILE.exists():
        print(f"⚠️  Token file not found at {google_workspace.TOKENS_FILE}. Forcing dry-run mode.")
        dry_run = True

    db = load_db()
    query = 'is:unread (label:Priority-4 OR label:Priority-5)'
    msgs = gmail_search(query, limit=limit) if not dry_run else []
    if not dry_run and not msgs:
        print("✅ No high-priority emails to respond to.")
        return

    suggestions = 0
    for msg in msgs:
        msg_id = msg.get('id')
        if msg_id in db.get('suggested', []):
            continue

        # Get full email to extract headers (To, CC) and better body if possible
        full_email = None
        try:
            full_email = gmail_get(msg_id)
        except Exception as e:
            print(f"   ⚠️  Could not fetch full email for {msg_id}: {e}")
            full_email = {}

        headers = full_email.get('payload', {}).get('headers', []) if full_email else []
        subject = next((h['value'] for h in headers if h['name']=='Subject'), '(no subject)')[:80]
        sender = next((h['value'] for h in headers if h['name']=='From'), 'unknown')
        # Try to get a better body than snippet; fallback to snippet
        body = ''
        if full_email:
            # Attempt to extract body from payload (simplified)
            payload = full_email.get('payload', {})
            if 'body' in payload and 'data' in payload['body']:
                body = base64.urlsafe_b64decode(payload['body']['data']).decode('utf-8', errors='ignore')
            elif 'parts' in payload:
                # Multipart: look for text/plain
                for part in payload['parts']:
                    if part.get('mimeType') == 'text/plain':
                        data = part.get('body', {}).get('data')
                        if data:
                            body = base64.urlsafe_b64decode(data).decode('utf-8', errors='ignore')
                            break
        if not body:
            body = full_email.get('snippet', '') if full_email else ''
        snippet = body[:200]  # Use body for snippet if available, else fallback to original snippet

        # Extract To and CC headers for display
        to_header = next((h['value'] for h in headers if h['name']=='To'), '')
        cc_header = next((h['value'] for h in headers if h['name']=='CC'), '')

        print(f"   💡 Generating replies for: {subject[:50]}")
        # Analyze the email
        email_dict = {
            'subject': subject,
            'body': body,  # Use full body if available, else snippet
        }
        analysis = analyze_email(email_dict)
        sentiment = analysis['sentiment']
        urgency = analysis['urgency']
        intent = analysis['intent']
        reply_all_suggested = analysis['reply_all_suggested']

        options = generate_reply_options(sender, subject, snippet, sentiment, urgency, intent, reply_all_suggested)

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
                    body=reply_text + "\\n\\n— Kleber Garcia Alcatrão\\nCEO, Zion Tech Group",
                    to_addr=sender  # We still only reply to the sender; the user can adjust recipients in the draft
                )
                # Gmail draft URL pattern
                draft_url = f"https://mail.google.com/mail/u/0/#drafts?compose={draft_id}"
                draft_links.append((i, draft_url, reply_text[:80]))
            except Exception as e:
                print(f"   ❌ Draft {i} failed: {e}")

        # Send Telegram summary
        lines = [f"📬 Reply suggestions for: {subject}"]
        lines.append(f"From: {sender}")
        lines.append(f"Original To: {to_header}")
        lines.append(f"Original CC: {cc_header}")
        lines.append("")
        lines.append(f"Analysis: Sentiment={sentiment}, Urgency={urgency}, Intent={intent}")
        if reply_all_suggested:
            lines.append("💡 Suggested: Reply-all (see original To/CC above)")
        lines.append("")
        for i, url, preview in draft_links:
            lines.append(f"{i}. {preview}…")
            lines.append(f"   {url}")
        try:
            telegram_send("\\n".join(lines))
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
        print("💡 Add --execute to create drafts and send Telegram summary (if token file exists).")

def main():
    p = argparse.ArgumentParser(description='Email Responder — LLM reply suggestions with case analysis')
    p.add_argument('--execute', action='store_true')
    p.add_argument('--limit', type=int, default=10)
    args = p.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)

if __name__ == '__main__':
    main()