#!/usr/bin/env python3
from __future__ import annotations

"""
Contract Renewal Workflow — Zion Tech Group v2

Automates renewal process for contracts approaching expiry.
Checks contracts expiring in ≤60 days and sends timed check-ins:
  60d, 30d, 14d, 7d before expiry.
Tracks state in data/renewals.json to avoid duplicates.

Usage:
  python3 renewal_workflow.py [--execute]   # Create renewal email drafts (default dry-run)
"""

import sys, os, re, json, datetime, argparse, sqlite3, urllib.request
from pathlib import Path

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, gmail_create_draft_new, gmail_get_or_create_label_id, gog_headers, telegram_send
from llm_client import chat

RENEWAL_DB = WORKSPACE / 'zion.app' / 'data' / 'renewals.json'
CONTRACT_DB = WORKSPACE / 'zion.app' / 'data' / 'contracts.db'
KLEBER_EMAIL = 'kleber@ziontechgroup.com'

MILESTONES = [60, 30, 14, 7]  # days before expiry

def load_renewals() -> dict:
    if RENEWAL_DB.exists():
        return json.loads(RENEWAL_DB.read_text())
    return {'contracts': {}, 'lastRun': None}

def save_renewals(db: dict):
    RENEWAL_DB.parent.mkdir(parents=True, exist_ok=True)
    RENEWAL_DB.write_text(json.dumps(db, indent=2))

def load_contracts() -> list:
    """Read contracts DB and return active contracts expiring within 60 days."""
    if not CONTRACT_DB.exists():
        return []
    conn = sqlite3.connect(CONTRACT_DB)
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()
    # Select contracts with expiry_parsed within next 60 days
    today = datetime.date.today().isoformat()
    cur.execute("""
        SELECT * FROM contracts
        WHERE expiry_parsed IS NOT NULL
          AND days_until <= 60
          AND days_until >= -10
        ORDER BY days_until ASC
    """)
    rows = [dict(row) for row in cur.fetchall()]
    conn.close()
    return rows

def days_until_expiry(expiry_str: str) -> int:
    try:
        exp = datetime.datetime.strptime(expiry_str, '%Y-%m-%d').date()
        return (exp - datetime.date.today()).days
    except Exception:
        return 999

def guess_client_email(contract: dict) -> str | None:
    """Try to find client email from recent correspondence."""
    domain = contract.get('client_domain', '')
    if not domain:
        return None
    # Find latest email from this domain
    msgs = gmail_search(f'from:@{domain}', limit=5)
    if msgs:
        hdrs = {h['name']: h['value'] for h in msgs[0].get('payload',{}).get('headers',[])}
        from_hdr = hdrs.get('From','')
        if '@' in from_hdr:
            return from_hdr.split('<')[-1].split('>')[0].strip()
    return None

def generate_renewal_email(contract: dict, milestone_days: int) -> str:
    client_name = contract.get('client_domain','').replace('.',' ').title()
    company = contract.get('client_domain','').upper()
    expiry = contract.get('expiry_parsed','')
    prompt = (
        f"You are Kleber Garcia Alcatrão (CEO, Zion Tech Group). Write a renewal follow-up email.\n"
        f"Client: {client_name} ({company})\n"
        f"Contract expires: {expiry} ({milestone_days} days remaining)\n\n"
        "Tone: professional, warm, forward-looking. Include:\n"
        "- Check-in on current service satisfaction\n"
        "- Renewal proposal/next steps (quote, extension)\n"
        "- Call-to-action: reply with PO or schedule a call\n"
        "Keep under 150 words, no markdown."
    )
    try:
        resp = chat([{"role":"user","content":prompt}], provider="auto", temperature=0.7)
        return resp['content'].strip()
    except Exception as e:
        return f"Hi {client_name},\n\nOur contract is expiring soon ({expiry}). Would you like to renew? Let's discuss.\n\nBest,\nKleber"

def cmd_run(dry_run: bool, limit: int = 0):
    print("🔄 Contract Renewal Workflow scanning…")
    contracts = load_contracts()
    print(f"   Found {len(contracts)} contracts expiring within 60 days")

    db = load_renewals()
    sent = alerts = 0

    for con in contracts:
        if limit and sent >= limit:
            print(f"   ⏹️  Limit reached ({limit}); stopping.")
            break
        contract_id = str(con.get('id'))
        expiry = con.get('expiry_parsed')
        if not expiry:
            continue
        days_left = days_until_expiry(expiry)
        if days_left > 60 or days_left < 0:
            continue

        # Determine next milestone
        milestone = None
        for m in MILESTONES:
            if days_left <= m:
                milestone = m
                break
        if not milestone:
            continue

        rec = db['contracts'].get(contract_id, {'milestones_sent': [], 'client_email': None})
        if milestone in rec['milestones_sent']:
            continue  # already sent

        # Get or discover client email
        to_addr = rec.get('client_email') or guess_client_email(con)
        if not to_addr:
            print(f"   ⚠️  No client email for contract {contract_id} — skipping")
            continue

        subject = f"Renewal Check-in — {con.get('client_domain','')} ({milestone}d remaining)"
        body = generate_renewal_email(con, milestone)

        if dry_run:
            print(f"   [DRY-RUN] Would create draft → {to_addr}: {subject}")
            rec['milestones_sent'].append(milestone)
            rec['client_email'] = to_addr
            db['contracts'][contract_id] = rec
            sent += 1
            continue

        # Create draft (safe)
        try:
            draft_id = gmail_create_draft_new(subject=subject, body=body, to_addr=to_addr)
            print(f"   ✅ Draft created: {subject} → {to_addr}")
            rec['milestones_sent'].append(milestone)
            rec['client_email'] = to_addr
            db['contracts'][contract_id] = rec
            sent += 1
        except Exception as e:
            print(f"   ❌ Draft failed for {contract_id}: {e}")
            continue

        # If milestone ≤7d, send critical alert
        if milestone <= 7:
            try:
                telegram_send(f"🚨 Contract Renewal CRITICAL — {con.get('client_domain','')} expires in {days_left} days.\nDraft: {subject}\nClient: {to_addr}")
                alerts += 1
            except Exception:
                pass

    if not dry_run:
        db['lastRun'] = datetime.datetime.utcnow().isoformat()
        save_renewals(db)

    print(f"\n✅ Created {sent} renewal drafts. Alerts: {alerts}")
    if dry_run:
        print("💡 Add --execute to create drafts and send alerts.")

def main():
    parser = argparse.ArgumentParser(description='Contract Renewal Workflow')
    parser.add_argument('--execute', action='store_true', help='Create drafts (default dry-run)')
    parser.add_argument('--limit', type=int, default=0, help='Max contracts to process (0=all)')
    args = parser.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)

if __name__ == '__main__':
    main()
