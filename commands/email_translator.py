#!/usr/bin/env python3
"""
Email Auto-Translator — Zion Tech Group

Detects non-English unread emails (simple heuristic: non-ASCII chars ratio).
Uses LLM to translate to English, then creates a draft reply containing
the translation for Kleber's reference. Applies 'Translated' label.

Usage:
  python3 email_translator.py --execute --limit 10
"""

import sys, os, re, json, datetime, argparse
from pathlib import Path

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))

from google_workspace import gmail_search, gmail_get, gmail_get_or_create_label_id, gmail_batch_modify
from llm_client import chat

BATCH_SIZE = 10
TRANSLATED_LABEL = 'Translated'
NON_ASCII_THRESHOLD = 0.05  # if >5% of characters are non-ASCII, assume foreign

def looks_non_english(text: str) -> bool:
    if not text:
        return False
    ascii_count = sum(1 for c in text if ord(c) < 128)
    ratio = ascii_count / len(text)
    return ratio < (1 - NON_ASCII_THRESHOLD)

def translate_to_english(text: str) -> str:
    prompt = (
        "Translate the following message to English. Preserve tone. "
        "Return only the translated text, no commentary.\n\n"
        f"---\n{text}\n---"
    )
    resp = chat([{"role": "user", "content": prompt}], provider="auto")
    return resp['content'].strip()

def cmd_run(dry_run: bool, limit: int):
    print("🌐 Scanning for non-English emails…")
    msgs = gmail_search('is:unread', limit=limit)
    print(f"📥 Fetched {len(msgs)} unread")

    to_translate = []
    for m in msgs:
        msg = gmail_get(m['id'])
        body = extract_body_from_gmail_message(msg)
        if looks_non_english(body):
            to_translate.append({'id': m['id'], 'msg': msg})

    print(f"🔠 Found {len(to_translate)} non-English email(s)")

    if dry_run:
        print("💡 Add --execute to generate translation drafts.")
        return

    processed = 0
    for item in to_translate:
        msg = item['msg']
        headers = msg.get('payload', {}).get('headers', [])
        subject = next((h['value'] for h in headers if h['name'] == 'Subject'), '(no subject)')
        from_hdr = next((h['value'] for h in headers if h['name'] == 'From'), '')
        body = extract_body_from_gmail_message(msg)

        try:
            translated = translate_to_english(body)
        except Exception as e:
            print(f"   ⚠️  Translation failed for {subject[:40]}: {e}")
            continue

        # Create a draft reply to self with translation
        import base64, json
        draft_subject = f"Translation: {subject}"
        draft_body = (
            f"Original From: {from_hdr}\n"
            f"Subject: {subject}\n\n"
            f"--- English Translation ---\n{translated}\n\n"
            "--- Original (first 500 chars) ---\n"
            f"{body[:500]}"
        )
        raw = f"Subject: {draft_subject}\r\nTo: kleber@ziontechgroup.com\r\n\r\n{draft_body}"
        encoded = base64.urlsafe_b64encode(raw.encode()).decode().rstrip('=')
        url = 'https://gmail.googleapis.com/gmail/v1/users/me/drafts'
        payload = json.dumps({'message': {'raw': encoded}}).encode()
        from google_workspace import gog_headers
        req = urllib.request.Request(url, data=payload, headers=gog_headers(), method='POST')
        resp = json.loads(urllib.request.urlopen(req).read())
        draft_id = resp.get('id')
        print(f"   ✅ Translation draft created: {subject[:40]}")

        # Label original as translated
        lbl_id = gmail_get_or_create_label_id(TRANSLATED_LABEL)
        gmail_batch_modify({'ids': [item['id']]}, addLabelIds=[lbl_id])
        processed += 1

    print(f"\n✅ Processed {processed} emails.")

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
    parser = argparse.ArgumentParser(description='Auto-Translate Non-English Emails')
    parser.add_argument('--execute', action='store_true', help='Create translation drafts (default dry-run)')
    parser.add_argument('--limit', type=int, default=BATCH_SIZE)
    args = parser.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)

if __name__ == '__main__':
    main()
