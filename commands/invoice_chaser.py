#!/usr/bin/env python3
"""
Invoice Chaser — Zion Tech Group

Automated unpaid invoice reminders (7/14/30/60 days).
Google Sheets ledger → Gmail drafts → Telegram alerts for 60d+.

Usage: python3 invoice_chaser.py [--execute] [--limit N]
"""

import sys, os, re, json, datetime, argparse
from pathlib import Path

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_create_draft_new, telegram_send

DB_FILE = WORKSPACE / 'zion.app' / 'data' / 'invoice_chaser.json'
SHEET_NAME = 'Invoices'
MILESTONES = [7, 14, 30, 60]

TEMPLATES = {
    7: "Gentle reminder: invoice {invoice_id} (${amount}) was due on {due_date}. Please arrange payment.",
    14: "Second reminder: invoice {invoice_id} (${amount}) is 14 days past due. We kindly request payment.",
    30: "Third notice: invoice {invoice_id} (${amount}) is 30 days overdue. Immediate settlement required.",
    60: "FINAL NOTICE: invoice {invoice_id} (${amount}) is 60 days past due. Account escalated for collection."
}

def load_db():
    if DB_FILE.exists():
        return json.loads(DB_FILE.read_text())
    return {'reminders_sent': {}}

def save_db(db):
    DB_FILE.parent.mkdir(parents=True, exist_ok=True)
    DB_FILE.write_text(json.dumps(db, indent=2))

def get_sheet_data():
    try:
        import gspread
        from oauth2client.service_account import ServiceAccountCredentials
        scopes = ['https://www.googleapis.com/auth/spreadsheets']
        creds = ServiceAccountCredentials.from_json_keyfile_name(str(WORKSPACE / 'client_secret.json'), scopes)
        gc = gspread.authorize(creds)
        sh = gc.open('Zion Invoices')
        ws = sh.worksheet(SHEET_NAME)
        return ws.get_all_records()
    except Exception as e:
        print(f"   ⚠️  Sheet access failed: {e}")
        return []

def days_past_due(due_str):
    due = datetime.datetime.strptime(due_str, '%Y-%m-%d').date()
    return (datetime.date.today() - due).days

def cmd_run(dry_run=True, limit=0):
    db = load_db()
    rows = get_sheet_data()
    sent = alerts = 0

    for row in rows:
        if limit and sent >= limit:
            break
        if row.get('status', '').lower() != 'unpaid':
            continue
        days = days_past_due(row['due_date'])
        if days not in MILESTONES:
            continue
        key = f"{row['invoice_id']}_{days}"
        if key in db['reminders_sent']:
            continue

        body = TEMPLATES[days].format(
            invoice_id=row['invoice_id'],
            amount=row['amount'],
            due_date=row['due_date']
        )
        subject = f"Reminder: Invoice {row['invoice_id']} — {days}d overdue"

        if dry_run:
            print(f"   [DRY-RUN] Draft → {row['client_email']}: {subject}")
            sent += 1
            continue

        try:
            gmail_create_draft_new(subject=subject, body=body, to_addr=row['client_email'])
            sent += 1
            db['reminders_sent'][key] = {'ts': datetime.datetime.utcnow().isoformat()}
            print(f"   ✅ Draft: {subject}")
        except Exception as e:
            print(f"   ❌ Draft failed: {e}")
            continue

        if days >= 60:
            try:
                telegram_send(f"🚨 Invoice Overdue — {row['invoice_id']} ({row['client_email']})\nAmount: ${row['amount']}\nDays: {days}")
                alerts += 1
            except Exception:
                pass

    if not dry_run:
        db['lastRun'] = datetime.datetime.utcnow().isoformat()
        save_db(db)

    print(f"\n✅ {sent} reminder drafts. Alerts: {alerts}")
    if dry_run:
        print("💡 Add --execute to send reminders.")

def main():
    p = argparse.ArgumentParser()
    p.add_argument('--execute', action='store_true')
    p.add_argument('--limit', type=int, default=0, help='Max invoices to process (0=all)')
    args = p.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)

if __name__ == '__main__':
    main()
