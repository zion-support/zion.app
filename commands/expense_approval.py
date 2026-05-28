#!/usr/bin/env python3
"""
Expense Approval — Zion Tech Group

Routes categorized expenses (from expense_categorizer) to approvers.
Creates approval request emails, tracks responses, escalates stale approvals.

Strategy:
  1. Query Gmail for expense emails labeled with category but not yet approved
  2. Look up approver mapping (category → approver email)
  3. Send approval request email draft to approver with expense summary
  4. Track pending approvals in DB
  5. Escalate to CFO (Kleber) if pending >5 days

Schedule: Daily at 11:00

Usage: python3 expense_approval.py [--execute] [--limit N]
"""

import sys, os, re, json, datetime, argparse
from pathlib import Path

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, gmail_create_draft_new, telegram_send

DB_FILE = WORKSPACE / 'zion.app' / 'data' / 'expense_approval.json'
# Category → Approver mapping (could be externalized)
APPROVERS = {
    'Software/SaaS': 'it-approval@ziontechgroup.com',
    'Travel': 'finance@ziontechgroup.com',
    'Office/Utilities': 'admin@ziontechgroup.com',
    'Marketing': 'marketing@ziontechgroup.com',
    'Professional Services': 'procurement@ziontechgroup.com',
    'Hardware': 'it-approval@ziontechgroup.com',
    'Misc': 'finance@ziontechgroup.com',
}
ESCALATE_DAYS = 5
ESCALATE_TO = 'kleber@ziontechgroup.com'

def load_db():
    if DB_FILE.exists():
        return json.loads(DB_FILE.read_text())
    return {'pending': {}, 'escalated': []}

def save_db(db):
    DB_FILE.parent.mkdir(parents=True, exist_ok=True)
    DB_FILE.write_text(json.dumps(db, indent=2))

def find_pending_expenses(limit=50) -> list:
    """Find expense emails labeled with category but not yet approved."""
    # Assume expense_categorizer adds category labels like 'Category-Software'
    query = 'label:Expense (label:Category-Software OR label:Category-Travel OR label:Category-Office OR label:Category-Marketing OR label:Category-Professional OR label:Category-Hardware OR label:Category-Misc) -label:Approval-Requested'
    msgs = gmail_search(query, limit=limit)
    expenses = []
    for m in msgs:
        msg_id = m.get('id')
        labels = m.get('labelIds', [])
        category = None
        for lbl in labels:
            if lbl.startswith('Category-'):
                category = lbl.replace('Category-','').replace('-','/').title()
                break
        if not category:
            continue
        headers = m.get('payload', {}).get('headers', [])
        subject = next((h['value'] for h in headers if h['name']=='Subject'), '(no subject)')
        sender = next((h['value'] for h in headers if h['name']=='From'), 'unknown')
        snippet = m.get('snippet','')[:100]
        expenses.append({
            'id': msg_id,
            'category': category,
            'subject': subject,
            'sender': sender,
            'snippet': snippet
        })
    return expenses

def get_approver_email(category: str) -> str:
    return APPROVERS.get(category, 'finance@ziontechgroup.com')

def days_pending(dt_str: str) -> int:
    try:
        pending_since = datetime.datetime.fromisoformat(dt_str).date()
        return (datetime.date.today() - pending_since).days
    except Exception:
        return 0

def cmd_run(dry_run=True, limit=50):
    db = load_db()
    expenses = find_pending_expenses(limit=limit)
    if not expenses:
        print("✅ No pending expenses awaiting approval.")
        return

    routed = 0
    escalated = 0

    for exp in expenses:
        msg_id = exp['id']
        if msg_id in db.get('pending', {}):
            # Already pending — check escalation
            pending_info = db['pending'][msg_id]
            days = days_pending(pending_info['pending_since'])
            if days >= ESCALATE_DAYS and msg_id not in db.get('escalated', []):
                if dry_run:
                    print(f"   [DRY-RUN] Would escalate {exp['subject'][:40]} (pending {days}d)")
                    continue
                # Escalate to Kleber
                approver = get_approver_email(exp['category'])
                esc_body = f"""Expense approval overdue {days} days:

  Category: {exp['category']}
  Subject: {exp['subject']}
  From: {exp['sender']}
  Snippet: {exp['snippet']}

Original approver: {approver}

Please review and approve/reject."""
                try:
                    gmail_create_draft_new(
                        subject=f"ESCALATED Approval Needed — {exp['subject'][:40]}",
                        body=esc_body,
                        to_addr=ESCALATE_TO
                    )
                    db['escalated'].append(msg_id)
                    escalated += 1
                    print(f"   🚨 Escalated to CFO: {exp['subject'][:40]}")
                    try:
                        telegram_send(f"🚨 Expense Approval Escalation — {exp['category']}\n{exp['subject'][:50]}\nPending {days}d → CFO")
                    except Exception:
                        pass
                except Exception as e:
                    print(f"   ❌ Escalation failed: {e}")
            continue  # already in pending DB

        # New pending expense — route to approver
        approver = get_approver_email(exp['category'])
        body = f"""Dear Approver,

Please review and approve the following expense:

  Category: {exp['category']}
  Subject: {exp['subject']}
  Sender: {exp['sender']}
  Snippet: {exp['snippet']}

You can approve by replying to this email or marking as 'Approved' in the system.

Thanks,
Zion Automation"""
        if dry_run:
            print(f"   [DRY-RUN] Route → {approver}: {exp['subject'][:40]}")
            routed += 1
            continue

        try:
            draft_id = gmail_create_draft_new(
                subject=f"Approval Request — {exp['subject'][:40]}",
                body=body,
                to_addr=approver
            )
            db['pending'][msg_id] = {
                'category': exp['category'],
                'approver': approver,
                'pending_since': datetime.datetime.utcnow().isoformat()
            }
            routed += 1
            print(f"   ✅ Routed to {approver}: {exp['subject'][:40]}")
            # Add label to avoid re-routing
            try:
                label_id = gmail_get_or_create_label_id('Approval-Requested')
                gmail_batch_modify([msg_id], add_labels=[label_id])
            except Exception:
                pass
        except Exception as e:
            print(f"   ❌ Routing failed: {e}")

    if not dry_run:
        db['lastRun'] = datetime.datetime.utcnow().isoformat()
        save_db(db)

    print(f"\n✅ Routed {routed} expenses to approvers. Escalated {escalated} to CFO.")
    if dry_run:
        print("💡 Add --execute to send approval drafts and track pending.")

def main():
    p = argparse.ArgumentParser(description='Expense Approval Workflow')
    p.add_argument('--execute', action='store_true')
    p.add_argument('--limit', type=int, default=50)
    args = p.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)

if __name__ == '__main__':
    main()
