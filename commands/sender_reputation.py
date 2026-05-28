#!/usr/bin/env python3
"""
Sender Reputation Classifier — Zion Tech Group

Applies sender-based reputation labels to unread emails:
  - Sender-Client      → known client domains (from Drive Clients/)
  - Sender-Vendor      → known vendor/newsletter domains
  - Sender-Internal    → ziontechgroup.com, kleber@ziontechgroup.com
  - Sender-Unknown     → fallback

Labels help email_prioritizer and smart_reply_queue adjust tone/priority.

Usage:
  python3 sender_reputation.py --execute    # Label unread emails (default dry-run)
  python3 sender_reputation.py --limit 50   # Max to process
"""

import sys, os, re, argparse, datetime, urllib.request, urllib.parse, json
from pathlib import Path

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))

from google_workspace import gmail_search, gmail_get, gmail_get_or_create_label_id, gmail_batch_modify, gog_headers

# ── Configuration ────────────────────────────────────────────────────────────

BATCH_SIZE = 50
INTERNAL_DOMAINS = ['ziontechgroup.com', 'kleber@ziontechgroup.com']

def sender_domain(from_header: str) -> str:
    m = re.search(r'@([a-zA-Z0-9.\-]+)', from_header)
    return m.group(1).lower() if m else ''

def classify_sender_domain(domain: str, client_domains: list) -> str:
    """Return label suffix: 'Client', 'Vendor', 'Internal', or 'Unknown'."""
    if not domain:
        return 'Unknown'
    if domain in INTERNAL_DOMAINS or domain.endswith('ziontechgroup.com'):
        return 'Internal'
    if domain in client_domains:
        return 'Client'
    # Known newsletter/marketing domains
    VENDOR_KEYWORDS = ['mailchimp', 'sendgrid', 'beehiiv', 'substack', 'convertkit',
                      'buttondown', 'morningbrew', 'github', 'notion', 'stytch',
                      'intercom', 'zapier', 'revue']
    for kw in VENDOR_KEYWORDS:
        if kw in domain:
            return 'Vendor'
    return 'Unknown'

def fetch_client_domains() -> list:
    """Query Drive for folders under 'Clients/' to get client domains."""
    DRIVE_API = 'https://www.googleapis.com/drive/v3/files'
    params = {
        'q': "name='Clients' and mimeType='application/vnd.google-apps.folder' and trashed=false",
        'pageSize': 5,
        'fields': 'files(id,name)'
    }
    url = DRIVE_API + '?' + urllib.parse.urlencode(params)
    from google_workspace import gog_headers
    req = urllib.request.Request(url, headers=gog_headers())
    try:
        resp = json.loads(urllib.request.urlopen(req).read())
        files = resp.get('files', [])
        if not files:
            return []
        clients_parent = files[0]['id']

        # List immediate subfolders (client domains)
        params2 = {
            'q': f"'{clients_parent}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false",
            'pageSize': 200,
            'fields': 'files(name)'
        }
        url2 = DRIVE_API + '?' + urllib.parse.urlencode(params2)
        req2 = urllib.request.Request(url2, headers=gog_headers())
        resp2 = json.loads(urllib.request.urlopen(req2).read())
        domains = [f['name'].lower() for f in resp2.get('files', [])]
        return domains
    except Exception:
        return []

def cmd_run(dry_run: bool, limit: int):
    print("🏷️  Sender Reputation classifier running…")

    # Load known client domains from Drive
    client_domains = fetch_client_domains()
    print(f"   Known client domains: {len(client_domains)}")

    msgs = gmail_search('is:unread', limit=limit)
    print(f"📥 Fetched {len(msgs)} unread emails")

    classifications = {'Client': 0, 'Vendor': 0, 'Internal': 0, 'Unknown': 0}
    to_label = []  # list of (msg_id, label_name)

    for m in msgs:
        msg = gmail_get(m['id'])
        headers = {h['name']: h['value'] for h in msg.get('payload', {}).get('headers', [])}
        from_hdr = headers.get('From', '')
        domain = sender_domain(from_hdr)

        category = classify_sender_domain(domain, client_domains)
        classifications[category] += 1

        label_name = f"Sender-{category}"
        to_label.append((m['id'], label_name))

    # Print summary
    print("\nClassification:")
    for cat, cnt in classifications.items():
        print(f"   {cat}: {cnt}")

    if dry_run:
        print(f"\n💡 Add --execute to apply {len(to_label)} sender reputation labels.")
        return

    # Apply labels in batch
    for msg_id, label_name in to_label:
        lbl_id = gmail_get_or_create_label_id(label_name)
        gmail_batch_modify({'ids': [msg_id]}, addLabelIds=[lbl_id])

    print(f"\n✅ Applied sender reputation labels to {len(to_label)} emails.")

    # Telegram summary
    try:
        lines = ["🏷️ *Sender Reputation Update*\n"]
        for cat, cnt in classifications.items():
            lines.append(f"• {cat}: {cnt}")
        message(action='send', target='telegram', message='\n'.join(lines))
    except Exception:
        pass

def main():
    parser = argparse.ArgumentParser(description='Sender Reputation Classifier')
    parser.add_argument('--execute', action='store_true', help='Apply labels (default: dry-run)')
    parser.add_argument('--limit', type=int, default=BATCH_SIZE, help='Max emails to scan')
    args = parser.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)

if __name__ == '__main__':
    main()
