#!/usr/bin/env python3
from __future__ import annotations

"""
Expense Receipt Parser — Zion Tech Group

Monitors a dedicated email (receipts@) for receipt PDFs. Extracts vendor,
amount, date via LLM, and logs to Google Sheets "Expenses" tab (create if missing).

Usage:
  python3 expense_parser.py --execute --limit 20
"""

import sys, os, re, json, datetime, argparse, urllib.request, urllib.parse, subprocess, base64
from pathlib import Path

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))

from google_workspace import gmail_search, gmail_get, gog_headers
from llm_client import chat

BATCH_SIZE = 20
EXPENSES_SHEET_ID = None  # Will look up by name "Expenses" in Drive
SHEET_NAME = 'Expenses'

def find_expenses_sheet():
    """Find Google Sheet named 'Expenses' via Drive API."""
    params = {
        'q': "name='Expenses' and mimeType='application/vnd.google-apps.spreadsheet' and trashed=false",
        'pageSize': 5, 'fields': 'files(id,name)'
    }
    url = 'https://www.googleapis.com/drive/v3/files?' + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers=gog_headers())
    resp = json.loads(urllib.request.urlopen(req).read())
    files = resp.get('files', [])
    if files:
        return files[0]['id']
    return None

def extract_pdf_text(pdf_bytes: bytes) -> str:
    try:
        proc = subprocess.run(['pdftotext', '-', '-'], input=pdf_bytes, capture_output=True, timeout=15)
        if proc.returncode == 0:
            return proc.stdout.decode('utf-8', errors='replace')
    except Exception:
        pass
    return ''

def is_receipt_email(msg: dict) -> bool:
    """Heuristic: sender contains 'receipt' or 'invoice', and has PDF attachment."""
    headers = {h['name']: h['value'] for h in msg.get('payload', {}).get('headers', [])}
    from_hdr = headers.get('From', '').lower()
    subject = headers.get('Subject', '').lower()
    if 'receipt' in from_hdr or 'invoice' in from_hdr or 'receipt' in subject or 'invoice' in subject:
        # Check attachment presence
        parts = msg.get('payload', {}).get('parts', [])
        for part in parts:
            if part.get('mimeType') == 'application/pdf' or (part.get('filename') and part['filename'].lower().endswith('.pdf')):
                return True
    return False

def parse_receipt_with_llm(text: str) -> dict:
    prompt = (
        "You are parsing an expense receipt. Extract the following fields as JSON:\n"
        "- vendor (string)\n"
        "- amount (number, currency in USD or original currency)\n"
        "- currency (e.g. USD, BRL, EUR)\n"
        "- date (YYYY-MM-DD)\n"
        "- category (e.g. Software, Travel, Supplies, Services)\n\n"
        f"Receipt text:\n{text[:2000]}\n\nReturn JSON only."
    )
    resp = chat([{"role": "user", "content": prompt}], provider="auto")
    try:
        content = resp['content'].strip()
        if content.startswith('```'):
            content = re.sub(r'^```[a-z]*\n?', '', content).strip()
            content = re.sub(r'\n?```$', '', content)
        data = json.loads(content)
        return data
    except Exception as e:
        print(f"   ⚠️  LLM parse failed: {e}")
        return {}

def append_to_google_sheet(sheet_id: str, values: list):
    """Append a row to the Expenses sheet."""
    import urllib.request
    url = f'https://sheets.googleapis.com/v4/spreadsheets/{sheet_id}/values/Expenses:append?valueInputOption=USER_ENTERED'
    payload = json.dumps({'values': [values]}).encode()
    headers = gog_headers()
    headers['Content-Type'] = 'application/json'
    req = urllib.request.Request(url, data=payload, headers=headers, method='POST')
    try:
        resp = json.loads(urllib.request.urlopen(req).read())
        return resp
    except urllib.error.HTTPError as e:
        err = e.read().decode()
        raise RuntimeError(f"Sheet API error {e.code}: {err}")

def extract_pdf_attachment(msg: dict) -> bytes | None:
    """Find first PDF attachment and return bytes."""
    parts = msg.get('payload', {}).get('parts', [])
    for part in parts:
        if part.get('mimeType') == 'application/pdf':
            attach_id = part.get('body', {}).get('attachmentId')
            if attach_id:
                # Download attachment via Gmail API
                import urllib.request
                url = f'https://gmail.googleapis.com/gmail/v1/users/me/messages/{msg["id"]}/attachments/{attach_id}'
                req = urllib.request.Request(url, headers=gog_headers())
                resp = json.loads(urllib.request.urlopen(req).read())
                data = resp.get('data', '')
                return base64.urlsafe_b64decode(data + '===')

        # Nested parts (multipart)
        if 'parts' in part:
            sub = part['parts']
            for sp in sub:
                if sp.get('mimeType') == 'application/pdf':
                    attach_id = sp.get('body', {}).get('attachmentId')
                    if attach_id:
                        url = f'https://gmail.googleapis.com/gmail/v1/users/me/messages/{msg["id"]}/attachments/{attach_id}'
                        req = urllib.request.Request(url, headers=gog_headers())
                        resp = json.loads(urllib.request.urlopen(req).read())
                        data = resp.get('data', '')
                        return base64.urlsafe_b64decode(data + '===')
    return None

def cmd_run(dry_run: bool, limit: int):
    print("🧾 Expense Parser scanning for receipt emails…")
    # We search broadly; is:unread with receipts IN FROM could be noisy. Let's do: has:attachment subject:receipt
    msgs = gmail_search('has:attachment (subject:receipt OR subject:invoice OR from:receipt)', limit=limit)
    print(f"📥 Fetched {len(msgs)} candidate emails")

    sheet_id = find_expenses_sheet()
    if not sheet_id:
        print("⚠️  No 'Expenses' Google Sheet found. Create one named 'Expenses' with headers: Date,Vendor,Amount,Currency,Category,Attachment Link")
        # We'll still process but won't write to sheet
    else:
        print(f"   📊 Expenses sheet ID: {sheet_id}")

    processed = 0
    for m in msgs:
        msg = gmail_get(m['id'])
        if not is_receipt_email(msg):
            continue

        headers = {h['name']: h['value'] for h in msg.get('payload', {}).get('headers', [])}
        subject = headers.get('Subject', '')
        from_hdr = headers.get('From', '')

        # Extract PDF
        pdf_bytes = extract_pdf_attachment(msg)
        if not pdf_bytes:
            print(f"   ⚠️  No PDF found in {subject[:40]}")
            continue

        text = extract_pdf_text(pdf_bytes)
        if not text.strip():
            print(f"   ⚠️  PDF text empty in {subject[:40]}")
            continue

        parsed = parse_receipt_with_llm(text)
        if not parsed:
            print(f"   ❌ Could not parse receipt: {subject[:40]}")
            continue

        vendor = parsed.get('vendor', 'Unknown')
        amount = parsed.get('amount', '0')
        currency = parsed.get('currency', 'USD')
        date = parsed.get('date', datetime.date.today().isoformat())
        category = parsed.get('category', 'Misc')

        print(f"   💰 {vendor} — {amount} {currency} on {date}")

        if dry_run:
            processed += 1
            continue

        # Append to sheet
        if sheet_id:
            row = [date, vendor, str(amount), currency, category, f"https://mail.google.com/mail/u/0/#inbox/{m['id']}"]
            try:
                append_to_google_sheet(sheet_id, row)
                print(f"      ✅ Logged to Expenses sheet")
            except Exception as e:
                print(f"      ❌ Sheet append failed: {e}")

        # Label as processed
        try:
            lbl_id = gmail_get_or_create_label_id('Receipt-Processed')
            gmail_batch_modify({'ids': [m['id']]}, addLabelIds=[lbl_id])
        except Exception:
            pass
        processed += 1

    print(f"\n✅ Processed {processed} receipts.")
    if dry_run:
        print("💡 Add --execute to log to Google Sheets.")

def main():
    parser = argparse.ArgumentParser(description='Expense Receipt Parser')
    parser.add_argument('--execute', action='store_true', help='Write to Sheets (default dry-run)')
    parser.add_argument('--limit', type=int, default=BATCH_SIZE)
    args = parser.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)

if __name__ == '__main__':
    main()
