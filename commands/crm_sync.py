#!/usr/bin/env python3
"""
CRM Sync — Zion Tech Group

Auto-create HubSpot contacts from new email senders (last 24h).
Keeps pipeline fresh without manual entry.

Strategy:
  - Parse 'From' header → name + email
  - Dedupe against local DB + HubSpot search
  - POST new contacts with {email, firstname, lastname, company}
  - Optional Gmail label 'CRM-Synced'

Schedule: Every 6 hours

Usage: python3 crm_sync.py [--execute] [--limit N]
"""

import sys, os, re, json, datetime, argparse, urllib.request
from pathlib import Path
from email.utils import parseaddr

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, gmail_batch_modify, gmail_get_or_create_label_id

HUBSPOT_API_KEY = os.getenv('HUBSPOT_API_KEY')
HUBSPOT_URL = "https://api.hubapi.com/crm/v3/objects/contacts"
DB_FILE = WORKSPACE / 'zion.app' / 'data' / 'crm_sync.json'
SYNC_LABEL = 'CRM-Synced'

def load_db():
    if DB_FILE.exists():
        return json.loads(DB_FILE.read_text())
    return {'synced': []}

def save_db(db):
    DB_FILE.parent.mkdir(parents=True, exist_ok=True)
    DB_FILE.write_text(json.dumps(db, indent=2))

def hubspot_exists(email):
    if not HUBSPOT_API_KEY:
        return True  # be safe if no key
    query = f"email={urllib.parse.quote(email)}&limit=1"
    url = f"{HUBSPOT_URL}/search?{query}"
    req = urllib.request.Request(url, headers={'Authorization': f'Bearer {HUBSPOT_API_KEY}'})
    try:
        with urllib.request.urlopen(req, timeout=8) as r:
            data = json.loads(r.read())
            return data.get('total', 0) > 0
    except Exception as e:
        print(f"   ⚠️  HubSpot check failed: {e}")
        return True

def create_contact(email, name):
    if not HUBSPOT_API_KEY:
        print("   ⚠️  HUBSPOT_API_KEY not set — skipping create")
        return False
    props = {"email": email}
    if name:
        parts = name.split()
        props["firstname"] = parts[0]
        props["lastname"] = " ".join(parts[1:]) if len(parts) > 1 else ""
    payload = json.dumps({"properties": props}).encode()
    req = urllib.request.Request(
        HUBSPOT_URL,
        data=payload,
        method='POST',
        headers={
            'Authorization': f'Bearer {HUBSPOT_API_KEY}',
            'Content-Type': 'application/json'
        }
    )
    try:
        with urllib.request.urlopen(req, timeout=10) as r:
            return r.status in (200, 201)
    except Exception as e:
        print(f"   ❌ HubSpot create error: {e}")
        return False

def cmd_run(dry_run=True, limit=50):
    db = load_db()
    msgs = gmail_search('newer_than:1d', limit=limit * 3)
    seen = set()
    synced = skipped_existing = skipped_dup = 0

    for msg in msgs:
        sender = msg.get('from', '')
        name, email = parseaddr(sender)
        if not email or email in seen or email in db['synced']:
            skipped_dup += 1
            continue
        seen.add(email)

        if dry_run:
            print(f"   [DRY-RUN] Would create HubSpot contact: {name} <{email}>")
            synced += 1
            continue

        if hubspot_exists(email):
            skipped_existing += 1
            continue

        if create_contact(email, name):
            db['synced'].append(email)
            synced += 1
            print(f"   ✅ Created: {name} <{email}>")
        else:
            print(f"   ❌ Failed: {email}")

    if not dry_run:
        db['lastRun'] = datetime.datetime.utcnow().isoformat()
        save_db(db)

    print(f"\n✅ Synced {synced}. Skipped existing: {skipped_existing}, duplicates: {skipped_dup}.")
    if dry_run:
        print("💡 Add --execute to create contacts.")

def main():
    p = argparse.ArgumentParser()
    p.add_argument('--execute', action='store_true')
    p.add_argument('--limit', type=int, default=50)
    args = p.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)

if __name__ == '__main__':
    main()
