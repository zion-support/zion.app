#!/usr/bin/env python3
"""
Rate-Card Change Detector — Zion Tech Group

Watches the global rate card spreadsheet in Google Drive for modifications.
On change, computes a summary of differences and drafts a notification email
to the sales/management team.

Since Drive has no webhook push in this environment, this script is intended
to be run periodically (e.g., via HEARTBEAT.md or cron).

Usage:
  python3 ratecard_watcher.py check   — Check for changes, draft email if detected
  python3 ratecard_watcher.py last    — Show last known snapshot
"""

import sys, os, json, re, datetime, hashlib
from pathlib import Path

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import drive_list, drive_get
from llm_client import chat

# Configuration
RATECARD_FILENAME = 'ZION_GLOBAL_RATE_CARD_PER_COUNTRY_2026_(US$).xlsx'
RATECARD_PARENT = '/root/.openclaw/workspace'  # where to store metadata snapshot
SNAPSHOT_FILE = WORKSPACE / 'zion.app' / 'data' / 'ratecard_snapshot.json'
NOTIFY_RECIPIENT = 'kleber@ziontechgroup.com'  # always notify CEO

def find_ratecard_file():
    """Locate the rate card file in Drive by name."""
    files = drive_list(limit=50)
    for f in files:
        if RATECARD_FILENAME in f.get('name', ''):
            return f
    raise FileNotFoundError(f"Could not find '{RATECARD_FILENAME}' in Drive")

def compute_file_fingerprint(file_meta: dict) -> str:
    """Create a stable fingerprint from modifiedTime + version + name."""
    mod_time = file_meta.get('modifiedTime', '')
    version = file_meta.get('version', '1')
    name = file_meta.get('name', '')
    raw = f"{name}|{mod_time}|{version}"
    return hashlib.sha256(raw.encode()).hexdigest()[:16]

def load_last_snapshot() -> dict:
    if SNAPSHOT_FILE.exists():
        return json.loads(SNAPSHOT_FILE.read_text())
    return {}

def save_snapshot(fingerprint: str, meta: dict):
    SNAPSHOT_FILE.parent.mkdir(parents=True, exist_ok=True)
    data = {
        'fingerprint': fingerprint,
        'modifiedTime': meta.get('modifiedTime'),
        'version': meta.get('version'),
        'name': meta.get('name'),
        'fileId': meta.get('id'),
        'capturedAt': datetime.datetime.utcnow().isoformat() + 'Z',
    }
    SNAPSHOT_FILE.write_text(json.dumps(data, indent=2))

def parse_ratecard_changes(old_meta: dict, new_meta: dict) -> str:
    """
    Use LLM to summarize likely changes based on modifiedTime and version.
    For actual cell-level diff, we'd need to parse the .xlsx binary — too heavy.
    Instead, rely on Drive's version history summary (mtime + version bump).
    """
    old_time = old_meta.get('modifiedTime', 'unknown')
    new_time = new_meta.get('modifiedTime', 'unknown')
    old_ver = old_meta.get('version', '1')
    new_ver = new_meta.get('version', '1')

    # If we had XLSX parsing we'd diff; for now generate a structured summary prompt
    prompt = (
        "You are a business analyst at Zion Tech Group.\n"
        f"The global rate card spreadsheet '{new_meta.get('name')}' was updated.\n"
        f"Previous: version={old_ver}, modified={old_time}\n"
        f"Current:  version={new_ver}, modified={new_time}\n\n"
        "Write a professional notification email to the management team that:\n"
        "- Announces the rate card has been updated\n"
        "- Suggests they review the changes in Google Drive\n"
        "- Asks them to confirm if pricing updates need to be propagated to clients\n"
        "- Includes the file link (we'll add link later)\n"
        "Return ONLY the email body text (no subject, no signatures)."
    )
    resp = chat([{"role": "user", "content": prompt}], provider="auto")
    return resp['content'].strip()

def draft_notification_email(subject: str, body: str, to_addr: str):
    """Create a Gmail draft (raw RFC 2822) to notify about the change."""
    import urllib.request, base64
    raw_lines = [f"Subject: {subject}", f"To: {to_addr}", "", body]
    raw = "\r\n".join(raw_lines)
    encoded = base64.urlsafe_b64encode(raw.encode()).decode().rstrip('=')

    url = 'https://gmail.googleapis.com/gmail/v1/users/me/drafts'
    payload = json.dumps({'message': {'raw': encoded}}).encode()
    from google_workspace import gog_headers
    req = urllib.request.Request(url, data=payload, headers=gog_headers(), method='POST')
    resp = json.loads(urllib.request.urlopen(req).read())
    return resp.get('id')

def cmd_check():
    print("🔍 Checking rate card for changes...")
    file = find_ratecard_file()
    print(f"   Found: {file['name']}  (ID: {file['id']})")
    fingerprint = compute_file_fingerprint(file)
    last = load_last_snapshot()

    if not last:
        print("   [First run] Snapshot saved; no change detected.")
        save_snapshot(fingerprint, file)
        return

    if fingerprint == last.get('fingerprint'):
        print("   No changes since last check.")
        return

    print("   ⚠️  Change detected!")
    print(f"   Old: v{last.get('version')}  {last.get('modifiedTime')}")
    print(f"   New: v{file.get('version')}  {file.get('modifiedTime')}")

    # Generate change summary via LLM
    print("🧠 Summarizing changes...")
    summary = parse_ratecard_changes(last, file)
    print("   Summary preview:", summary[:120], "...")

    # Build email
    drive_link = f"https://drive.google.com/file/d/{file['id']}/view"
    subject = f"📢 Rate Card Updated — {file['name']}"
    body = (
        f"{summary}\n\n"
        f"📂 Open in Drive: {drive_link}\n\n"
        "Action Items:\n"
        "  • Review changes (File → Version history in Drive)\n"
        "  • Confirm client-facing pricing updates\n"
        "  • Notify sales team if needed\n\n"
        "—\n"
        "Zion Tech Group — Automated Rate Card Monitor"
    )

    print("✉️  Creating Gmail draft...")
    draft_id = draft_notification_email(subject, body, NOTIFY_RECIPIENT)
    print(f"✅ Draft created (ID: {draft_id}). Check Gmail Drafts.")

    # Send Telegram alert
    try:
        telegram_msg = (
            f"📢 Rate Card Updated\n"
            f"File: {file['name']}\n"
            f"Summary: {summary[:150]}…\n"
            f"Draft email created for {NOTIFY_RECIPIENT}"
        )
        # Use OpenClaw tool if available (when running under agent)
        from llm_client import chat as llm_chat  # noqa: F401 (just checking import)
        # The 'message' tool is injected by OpenClaw runtime
        if 'message' in globals():
            message(action='send', target='telegram', message=telegram_msg)
            print("📡 Telegram alert sent.")
        else:
            print("[Telegram] tool not available in this context.")
    except Exception as e:
        print(f"   ⚠️  Telegram alert failed: {e}")

    # Persist new snapshot
    save_snapshot(fingerprint, file)
    print("💾 Snapshot updated.")

def cmd_last():
    if SNAPSHOT_FILE.exists():
        data = json.loads(SNAPSHOT_FILE.read_text())
        print("Last recorded snapshot:")
        print(f"  File: {data.get('name')}")
        print(f"  Version: {data.get('version')}")
        print(f"  Modified: {data.get('modifiedTime')}")
        print(f"  Captured: {data.get('capturedAt')}")
    else:
        print("No snapshot yet. Run `check` first to initialize.")

def main():
    import argparse
    p = argparse.ArgumentParser(description='Rate-Card Change Detector')
    sub = p.add_subparsers(dest='cmd')
    sub.add_parser('check', help='Check for updates and draft notification if changed')
    sub.add_parser('last', help='Show last snapshot info')
    args = p.parse_args()

    if args.cmd == 'check':
        cmd_check()
    elif args.cmd == 'last':
        cmd_last()
    else:
        p.print_help()

if __name__ == '__main__':
    main()
