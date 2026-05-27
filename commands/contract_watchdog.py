#!/usr/bin/env python3
from __future__ import annotations

"""
Contract Expiration Watchdog — Zion Tech Group

Scans Google Drive "Clients/*/Contracts/" for contract PDFs (NDAs, MSAs).
Extracts expiry date via regex, alerts 30 and 7 days before expiration,
and drafts renewal negotiation email.

Usage:
  python3 contract_watchdog.py [--days-threshold 30] [--execute]
"""

import sys, os, re, json, datetime, argparse, urllib.request, urllib.parse, subprocess
from pathlib import Path

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gog_headers

# ── Configuration ────────────────────────────────────────────────────────────

DB_PATH = WORKSPACE / 'zion.app' / 'data' / 'contracts.db'
ALERT_DAYS_BEFORE = [30, 7]  # days before expiry to alert
NOTIFY_RECIPIENT = 'kleber@ziontechgroup.com'

# Regex patterns for expiry dates (common formats)
DATE_PATTERNS = [
    r'(\d{1,2}[\/\-]\d{1,2}[\/\-]20\d{2})',  # MM/DD/YYYY or DD-MM-YYYY
    r'(\d{4}[\/\-]\d{2}[\/\-]\d{2})',        # YYYY-MM-DD
    r'(\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+20\d{2})',  # 12 Jan 2026
]

# Contract-indicative keywords in filename
CONTRACT_KEYWORDS = ['nda', 'msa', 'contract', 'agreement', 'terms']

DRIVE_API = 'https://www.googleapis.com/drive/v3/files'

def gog_headers_local():
    try:
        from google_workspace import gog_headers as _gh
        return _gh()
    except Exception:
        return {}

def init_db():
    import sqlite3
    conn = sqlite3.connect(DB_PATH)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS contracts (
            id INTEGER PRIMARY KEY,
            file_id TEXT UNIQUE,
            filename TEXT,
            client_domain TEXT,
            expiry_raw TEXT,
            expiry_parsed TEXT,
            days_until INTEGER,
            last_checked TEXT,
            notified_30 INTEGER DEFAULT 0,
            notified_7 INTEGER DEFAULT 0
        )
    """)
    conn.commit()
    return conn

def find_clients_root():
    params = {
        'q': "name='Clients' and mimeType='application/vnd.google-apps.folder' and trashed=false",
        'pageSize': 5,
        'fields': 'files(id,name)'
    }
    url = DRIVE_API + '?' + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers=gog_headers_local())
    resp = json.loads(urllib.request.urlopen(req).read())
    files = resp.get('files', [])
    if not files:
        raise RuntimeError("'Clients' folder not found")
    return files[0]['id']

def list_children(folder_id):
    params = {
        'q': f"'{folder_id}' in parents and trashed=false",
        'pageSize': 200,
        'fields': 'nextPageToken,files(id,name,mimeType,createdTime)'
    }
    all_files = []
    page_token = None
    while True:
        if page_token:
            params['pageToken'] = page_token
        url = DRIVE_API + '?' + urllib.parse.urlencode(params)
        req = urllib.request.Request(url, headers=gog_headers_local())
        resp = json.loads(urllib.request.urlopen(req).read())
        all_files.extend(resp.get('files', []))
        page_token = resp.get('nextPageToken')
        if not page_token:
            break
    return all_files

def looks_like_contract(filename: str) -> bool:
    name = filename.lower()
    return any(kw in name for kw in CONTRACT_KEYWORDS) and filename.lower().endswith('.pdf')

def extract_expiry_date(text: str) -> str | None:
    """Try regex patterns; return first ISO date (YYYY-MM-DD) or None."""
    for pat in DATE_PATTERNS:
        m = re.search(pat, text, re.IGNORECASE)
        if m:
            raw = m.group(1)
            # Normalize to ISO
            try:
                # Try common formats
                for fmt in ('%m/%d/%Y', '%d-%m-%Y', '%Y-%m-%d', '%d %b %Y', '%d %B %Y'):
                    try:
                        dt = datetime.datetime.strptime(raw, fmt)
                        return dt.strftime('%Y-%m-%d')
                    except ValueError:
                        continue
            except Exception:
                continue
    return None

def extract_pdf_text(pdf_bytes: bytes) -> str:
    try:
        proc = subprocess.run(['pdftotext', '-', '-'], input=pdf_bytes, capture_output=True, timeout=15)
        if proc.returncode == 0:
            return proc.stdout.decode('utf-8', errors='replace')
    except Exception:
        pass
    return ''

def parse_relative_path(path: str, domain: str) -> str:
    """Return subpath under domain, e.g. 'Contracts' or 'Legal'."""
    parts = path.split('/')
    try:
        idx = parts.index(domain)
        return '/'.join(parts[idx+1:])
    except ValueError:
        return ''

def main():
    parser = argparse.ArgumentParser(description='Contract Expiration Watchdog')
    parser.add_argument('--days-threshold', type=int, default=30, help='Alert days before expiry')
    parser.add_argument('--execute', action='store_true', help='Send alerts/drafts (default dry-run)')
    args = parser.parse_args()

    dry_run = not args.execute
    root_id = find_clients_root()
    print(f"🔍 Scanning Drive Clients/ subtree for contracts…")

    queue = [(root_id, 'Clients')]
    visited = set()
    conn = init_db()
    cur = conn.cursor()
    scanned = 0
    alerts = []

    while queue:
        folder_id, path = queue.pop(0)
        if folder_id in visited:
            continue
        visited.add(folder_id)

        children = list_children(folder_id)
        for f in children:
            fid = f['id']
            fname = f['name']
            mime = f['mimeType']

            if mime == 'application/vnd.google-apps.folder':
                child_path = f"{path}/{fname}"
                queue.append((fid, child_path))
                continue

            if not (mime == 'application/pdf' and looks_like_contract(fname)):
                continue

            # Derive client domain from path
            parts = path.split('/')
            if len(parts) < 2:
                continue
            domain = parts[1]

            # Check if already in DB
            cur.execute("SELECT expiry_parsed, days_until, notified_30, notified_7 FROM contracts WHERE file_id=?", (fid,))
            row = cur.fetchone()

            # Extract expiry
            try:
                dl_url = f'https://www.googleapis.com/drive/v3/files/{fid}?alt=media'
                req = urllib.request.Request(dl_url, headers=gog_headers_local())
                pdf_bytes = urllib.request.urlopen(req).read()
                text = extract_pdf_text(pdf_bytes)
                expiry_iso = extract_expiry_date(text)
            except Exception as e:
                print(f"   ⚠️  Could not read {fname}: {e}")
                continue

            if not expiry_iso:
                print(f"   ⚠️  No expiry found in {fname}")
                continue

            expiry_dt = datetime.datetime.strptime(expiry_iso, '%Y-%m-%d').date()
            today = datetime.date.today()
            days_until = (expiry_dt - today).days

            if row:
                # Update
                cur.execute(
                    "UPDATE contracts SET expiry_raw=?, expiry_parsed=?, days_until=?, last_checked=? WHERE file_id=?",
                    (None, expiry_iso, days_until, today.isoformat(), fid)
                )
                notified_30 = row[2]
                notified_7 = row[3]
            else:
                cur.execute(
                    "INSERT INTO contracts (file_id, filename, client_domain, expiry_parsed, days_until, last_checked) VALUES (?,?,?,?,?,?)",
                    (fid, fname, domain, expiry_iso, days_until, today.isoformat())
                )
                notified_30 = notified_7 = 0

            # Check for alerts
            for threshold in ALERT_DAYS_BEFORE:
                if days_until <= threshold and not eval(f"notified_{threshold}"):
                    alerts.append({
                        'file': fname,
                        'domain': domain,
                        'expiry': expiry_iso,
                        'days': days_until,
                        'threshold': threshold
                    })
                    if not dry_run:
                        # Mark as notified
                        cur.execute(f"UPDATE contracts SET notified_{threshold}=1 WHERE file_id=?", (fid,))

            scanned += 1

    conn.commit()

    if not alerts:
        print(f"\n✅ Scanned {scanned} contracts. No expirations within {ALERT_DAYS_BEFORE} days.")
    else:
        print(f"\n⚠️  {len(alerts)} contract(s) expiring soon:")
        for a in alerts:
            print(f"   • {a['file']} ({a['domain']}) expires {a['expiry']} ({a['days']} days)")

        if dry_run:
            print(f"\n💡 Add --execute to send alerts and draft renewal emails.")
        else:
            # Send Telegram summary
            lines = [f"📄 *Contract Expiry Alert* ({len(alerts)})\n"]
            for a in alerts:
                lines.append(f"• {a['file']} ({a['domain']}) — {a['expiry']} ({a['days']}d left)")
            telegram_text = '\n'.join(lines)
            try:
                message(action='send', target='telegram', message=telegram_text)
                print("📡 Telegram alert sent.")
            except Exception as e:
                print(f"❌ Telegram failed: {e}")

            # Draft renewal email (simple template)
            for a in alerts:
                subj = f"Renewal Reminder: {a['file']} — {a['domain']}"
                body = (
                    f"The contract '{a['file']}' for {a['domain']} expires in {a['days']} days ({a['expiry']}).\n\n"
                    "Please review and initiate renewal process.\n\n"
                    "— Automated Contract Watchdog"
                )
                try:
                    draft_id = draft_notification_email(subj, body, NOTIFY_RECIPIENT)
                    print(f"✅ Draft created for {a['file']} (ID: {draft_id[:8]}…)")
                except Exception as e:
                    print(f"❌ Draft failed for {a['file']}: {e}")

    conn.close()

def draft_notification_email(subject: str, body: str, to_addr: str) -> str:
    import base64, json
    raw = f"Subject: {subject}\r\nTo: {to_addr}\r\n\r\n{body}"
    encoded = base64.urlsafe_b64encode(raw.encode()).decode().rstrip('=')
    url = 'https://gmail.googleapis.com/gmail/v1/users/me/drafts'
    payload = json.dumps({'message': {'raw': encoded}}).encode()
    from google_workspace import gog_headers
    req = urllib.request.Request(url, data=payload, headers=gog_headers(), method='POST')
    resp = json.loads(urllib.request.urlopen(req).read())
    return resp.get('id')

if __name__ == '__main__':
    main()
