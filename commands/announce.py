#!/usr/bin/env python3
from __future__ import annotations

"""
Internal Announcement Broadcaster — Zion Tech Group

One-click broadcast draft creator for announcements to client-facing labels.
Examples: price changes, maintenance notices, new feature launches.

Creates a draft email for each domain in `Client-*` labels, or you can target a specific label.

Usage:
  python3 announce.py --subject "Price Increase Notice" --body "body text" [--label "Client-*"] [--execute]
"""

import sys, os, re, json, datetime, argparse, urllib.request
from pathlib import Path

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_get_or_create_label_id, gmail_create_draft_new, gog_headers
from llm_client import chat

ANNOUNCE_DB = WORKSPACE / 'zion.app' / 'data' / 'announcements.json'
KLEBER_EMAIL = 'kleber@ziontechgroup.com'

def get_client_labels() -> list:
    """Return list of label names that start with 'Client-' or similar."""
    import urllib.request
    token = json.loads(open(str(WORKSPACE / 'gog_tokens.json')).read())['access_token']
    req = urllib.request.Request('https://gmail.googleapis.com/gmail/v1/users/me/labels', headers={'Authorization': f'Bearer {token}'})
    resp = json.loads(urllib.request.urlopen(req).read())
    client_labels = []
    for lbl in resp.get('labels', []):
        name = lbl.get('name','')
        if name.startswith('Client-') or name.startswith('Client ') or name.startswith('Zion-Client-'):
            client_labels.append({'id': lbl['id'], 'name': name})
    return client_labels

def extract_domain_from_label(label_name: str) -> str | None:
    """Client-Acme → acme.com (best-effort)."""
    clean = label_name.replace('Client-','').replace('Client ','').replace('Zion-Client-','').lower()
    if clean:
        return f"{clean}.com"
    return None

def cmd_run(dry_run: bool, subject: str, body: str, label_filter: str = None):
    print("📢 Announcement Broadcaster preparing…")
    labels = get_client_labels()
    print(f"   Found {len(labels)} client labels")

    targets = []
    for lbl in labels:
        if label_filter and label_filter not in lbl['name']:
            continue
        domain = extract_domain_from_label(lbl['name'])
        if domain:
            targets.append({'label': lbl['name'], 'domain': domain})

    if dry_run:
        print(f"\n   [DRY-RUN] Would create {len(targets)} announcement drafts:")
        print(f"   Subject: {subject}")
        for t in targets[:5]:
            print(f"     • {t['domain']} ({t['label']})")
        if len(targets) > 5:
            print(f"       …and {len(targets)-5} more")
        print("\n💡 Add --execute to create drafts.")
        return

    db = {}
    created = 0
    for t in targets:
        to_addr = f"info@{t['domain']}"  # generic; will be adjusted manually
        try:
            draft_id = gmail_create_draft_new(subject=subject, body=body, to_addr=to_addr)
            print(f"   ✅ Draft for {t['domain']} → {to_addr}")
            created += 1
        except Exception as e:
            print(f"   ❌ Failed for {t['domain']}: {e}")

    print(f"\n✅ Created {created} announcement drafts.")
    print("💡 Review Gmail Drafts to edit & send to correct contacts.")

def main():
    parser = argparse.ArgumentParser(description='Announce Broadcaster')
    parser.add_argument('--subject', required=True, help='Email subject')
    parser.add_argument('--body', required=True, help='Email body (plain text)')
    parser.add_argument('--label', default=None, help='Label filter (e.g. "Client-*")')
    parser.add_argument('--execute', action='store_true', help='Create drafts (default dry-run)')
    args = parser.parse_args()
    cmd_run(dry_run=not args.execute, subject=args.subject, body=args.body, label_filter=args.label)

if __name__ == '__main__':
    main()
