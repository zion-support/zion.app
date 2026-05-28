#!/usr/bin/env python3
"""
Attachment Saver — Zion

Monitors unread emails for attachments from known client domains.
Saves files to Drive: Clients/<Domain>/<YYYY-MM-DD>/
Replies to the email with a link to the saved files.

Usage:
  python3 attachment_saver.py --dry-run     # Preview only
  python3 attachment_saver.py --execute     # Save + reply
  python3 attachment_saver.py --limit 20    # Process up to N emails
"""

import sys, os, re, datetime, argparse, base64, json
from pathlib import Path

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, gmail_get, gmail_batch_modify, gmail_get_or_create_label_id, gmail_create_draft, drive_list, drive_get
from llm_client import chat

# ── Configuration ────────────────────────────────────────────────────────────

BATCH_SIZE = 30
DRY_RUN_DEFAULT = True

# Domains that count as "clients" — adjust as needed
CLIENT_DOMAINS = [
    'gmail.com',  # personal clients
    # Add more client domains here
]

# Drive root folder name for client files
DRIVE_ROOT = 'Clients'

# Label to apply after processing
PROCESSED_LABEL = 'Attachment-Saved'

def is_client_domain(email_addr: str) -> bool:
    """Check if email is from a known client domain."""
    match = re.search(r'@(.+?)$', email_addr)
    if not match:
        return False
    domain = match.group(1).lower()
    return domain in CLIENT_DOMAINS or domain.endswith('client.io')  # placeholder logic

def extract_attachments(msg: dict) -> list:
    """Return list of {'filename': str, 'data': bytes, 'mimeType': str}."""
    attachments = []
    payload = msg.get('payload', {})
    parts = payload.get('parts', [])
    if not parts and payload.get('body', {}).get('attachmentId'):
        # Single attachment in root
        att_id = payload['body']['attachmentId']
        filename = payload.get('filename', 'attachment')
        mime = payload.get('mimeType', 'application/octet-stream')
        attachments.append({'id': att_id, 'filename': filename, 'mimeType': mime})
        return attachments

    def walk(parts_list):
        for part in parts_list:
            if part.get('filename') and part.get('body', {}).get('attachmentId'):
                attachments.append({
                    'id': part['body']['attachmentId'],
                    'filename': part['filename'],
                    'mimeType': part.get('mimeType', 'application/octet-stream'),
                })
            if 'parts' in part:
                walk(part['parts'])
    walk(parts)
    return attachments

def download_attachment(msg_id: str, attachment_id: str) -> bytes:
    """Download raw attachment bytes via Gmail API."""
    url = f'https://gmail.googleapis.com/gmail/v1/users/me/messages/{msg_id}/attachments/{attachment_id}'
    from google_workspace import gog_headers
    req = urllib.request.Request(url, headers=gog_headers())
    resp = json.loads(urllib.request.urlopen(req).read())
    data = resp.get('data', '')
    return base64.urlsafe_b64decode(data + '===')

def ensure_drive_folder(path_components: list) -> str:
    """Create (or find) nested Drive folders; return leaf folder ID."""
    parent = 'root'
    folder_id = None
    for comp in path_components:
        # Search for folder named comp under parent
        query = f"name='{comp}' and '{parent}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false"
        url = f"https://www.googleapis.com/drive/v3/files?q={urllib.parse.quote(query)}&fields=files(id,name)"
        req = urllib.request.Request(url, headers=gog_headers())
        results = json.loads(urllib.request.urlopen(req).read()).get('files', [])
        if results:
            folder_id = results[0]['id']
        else:
            # Create folder
            body = json.dumps({
                'name': comp,
                'mimeType': 'application/vnd.google-apps.folder',
                'parents': [parent]
            }).encode()
            url_create = 'https://www.googleapis.com/drive/v3/files'
            headers = gog_headers()
            headers['Content-Type'] = 'application/json'
            req_create = urllib.request.Request(url_create, data=body, headers=headers, method='POST')
            folder_id = json.loads(urllib.request.urlopen(req_create).read())['id']
        parent = folder_id
    return folder_id

def save_to_drive(filename: str, data: bytes, domain: str) -> str:
    """Save file to Drive Clients/<Domain>/<YYYY-MM-DD>/ and return shareable link."""
    today = datetime.date.today().isoformat()
    folder_path = [DRIVE_ROOT, domain, today]
    folder_id = ensure_drive_folder(folder_path)

    # Upload file
    import urllib.parse
    url = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart'
    # Build multipart body
    boundary = '-------314159265358979323846'
    metadata = json.dumps({'name': filename, 'parents': [folder_id]}).encode()
    body = (
        f'--{boundary}\r\n'
        'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
        metadata.decode() + '\r\n' +
        f'--{boundary}\r\n'
        f'Content-Type: application/octet-stream\r\n\r\n' +
        data.decode('latin-1') +  # binary safe-ish
        f'\r\n--{boundary}--\r\n'
    ).encode('utf-8')

    headers = gog_headers()
    headers['Content-Type'] = f'multipart/related; boundary={boundary}'
    req = urllib.request.Request(url, data=body, headers=headers, method='POST')
    file_info = json.loads(urllib.request.urlopen(req).read())
    file_id = file_info['id']

    # Make readable (not public — just viewable by team)
    # In a real setup you'd set permissions; for now just return file URL
    link = f"https://drive.google.com/file/d/{file_id}/view"
    return link

def draft_reply_with_links(msg_id: str, original_subject: str, from_addr: str, saved_files: list):
    """Create a Gmail draft in the thread telling sender files were saved."""
    lines = [
        f"Hi,\n\n",
        f"Thanks for sending the following file(s):\n",
    ]
    for fname, link in saved_files:
        lines.append(f"  • {fname} — {link}\n")
    lines.append("\nThey've been saved to our shared Drive under the client folder.\n\n")
    lines.append("Best,\nZion Tech Group Automation")
    body = ''.join(lines)

    draft_id = gmail_create_draft(thread_id=msg_id, subject=original_subject, body=body, to_addr=from_addr)
    return draft_id

def cmd_run(dry_run: bool, limit: int):
    print(f"📎 Attachment Saver scanning {limit} unread emails...")
    msgs = gmail_search('is:unread has:attachment', limit=limit)
    print(f"📥 Found {len(msgs)} emails with attachments")

    processed = 0
    for msg_meta in msgs:
        msg_id = msg_meta['id']
        msg = gmail_get(msg_id)

        # Extract From
        headers = msg.get('payload', {}).get('headers', [])
        from_hdr = next((h['value'] for h in headers if h['name'] == 'From'), '')
        from_match = re.search(r'<(.+?)>', from_hdr)
        from_addr = from_match.group(1) if from_match else from_hdr

        if not is_client_domain(from_addr):
            continue  # Skip non-client senders

        subject = next((h['value'] for h in headers if h['name'] == 'Subject'), '(no subject)')

        attachments = extract_attachments(msg)
        if not attachments:
            continue

        print(f"\n   📧 {subject}")
        print(f"      From: {from_addr}")
        print(f"      Attachments: {len(attachments)}")

        saved_links = []
        for att in attachments:
            fname = att['filename']
            print(f"         ⬇️  Downloading {fname}...")
            if dry_run:
                print(f"            [DRY-RUN] Would save to Drive Clients/{from_addr}/...")
                saved_links.append((fname, '(dry-run-link)'))
                continue
            try:
                data = download_attachment(msg_id, att['id'])
                domain = re.search(r'@(.+?)$', from_addr).group(1)
                link = save_to_drive(fname, data, domain)
                saved_links.append((fname, link))
                print(f"            ✅ Saved → {link}")
            except Exception as e:
                print(f"            ❌ Failed: {e}")

        if dry_run:
            print(f"      [DRY-RUN] Would draft reply with {len(saved_links)} link(s)")
        else:
            if saved_links:
                try:
                    draft_id = draft_reply_with_links(msg_id, subject, from_addr, saved_links)
                    print(f"      ✉️  Draft created (ID: {draft_id})")
                except Exception as e:
                    print(f"      ❌ Draft failed: {e}")

        # Apply processed label
        label_id = gmail_get_or_create_label_id(PROCESSED_LABEL)
        gmail_batch_modify({'ids': [msg_id]}, addLabelIds=[label_id])

        processed += 1

    print(f"\n✅ Processed {processed} client emails with attachments.")
    if dry_run:
        print("💡 Add --execute to save files and draft replies.")

def main():
    parser = argparse.ArgumentParser(description='Attachment Saver')
    parser.add_argument('--execute', action='store_true', help='Save files + draft replies (default: dry-run)')
    parser.add_argument('--limit', type=int, default=BATCH_SIZE, help='Max emails to scan')
    args = parser.parse_args()

    dry_run = not args.execute
    cmd_run(dry_run, args.limit)

if __name__ == '__main__':
    import urllib.request, urllib.parse, json
    main()
