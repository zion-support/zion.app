#!/usr/bin/env python3
"""
Revenue Risk Predictor — Zion Tech Group

Analyzes payment failures, contract renewal proximity, and engagement decay.
"""

import sys, os, json, datetime, argparse
from pathlib import Path

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_create_draft_new, telegram_send

DB_FILE = WORKSPACE / 'zion.app' / 'data' / 'revenue_risk.json'
PAYMENTS_DB = WORKSPACE / 'zion.app' / 'data' / 'payment_reconciliation.json'
CONTRACTS_DB = WORKSPACE / 'zion.app' / 'data' / 'contracts.json'

def load_json(path, default=None):
    p = Path(path)
    if p.exists():
        return json.loads(p.read_text())
    return default or {}

def load_db():
    if DB_FILE.exists():
        return json.loads(DB_FILE.read_text())
    return {'clients': {}, 'lastRun': None}

def save_db(db):
    DB_FILE.parent.mkdir(parents=True, exist_ok=True)
    DB_FILE.write_text(json.dumps(db, indent=2))

def calculate_risk(client_name, payments, contracts, journey):
    score = 0; reasons = []
    failed = [p for p in payments.get('recon', []) if client_name.lower() in p.get('client','').lower() and p.get('status')=='failed']
    if len(failed) >= 3: score += 40; reasons.append(f"{len(failed)} payment failures")
    elif len(failed) >= 1: score += 20; reasons.append(f"{len(failed)} payment failure(s)")
    today = datetime.date.today()
    for c in contracts.get('contracts', []):
        if client_name.lower() in c.get('client','').lower() and c.get('status')=='active':
            end_str = c.get('end_date') or c.get('renewal_date')
            if end_str:
                try:
                    end = datetime.datetime.strptime(end_str[:10], '%Y-%m-%d').date()
                    days = (end - today).days
                    if days <= 30: score += 30; reasons.append(f"Contract expires in {days} days")
                    elif days <= 60: score += 15; reasons.append(f"Contract expiring soon ({days} days")
                except Exception: pass
    cj = journey.get('clients', {}).get(client_name.lower(), {})
    last = cj.get('last_contact')
    if last:
        try:
            last_dt = datetime.datetime.fromisoformat(last.rstrip('Z'))
            days_ago = (datetime.datetime.utcnow() - last_dt).days
            if days_ago > 90: score += 30; reasons.append(f"No contact for {days_ago} days")
            elif days_ago > 60: score += 15; reasons.append(f"Low engagement ({days_ago}d since last email)")
        except Exception: pass
    return min(100, score), reasons

def cmd_run(dry_run=True, limit=20):
    db = load_db()
    payments = load_json(PAYMENTS_DB, {'recon': []})
    contracts = load_json(CONTRACTS_DB, {'contracts': []})
    journey = load_json(WORKSPACE / 'zion.app' / 'data' / 'client_journey.json', {'clients': {}})
    client_names = set()
    for p in payments.get('recon', []): client_names.add(p.get('client','Unknown'))
    for c in contracts.get('contracts', []): client_names.add(c.get('client','Unknown'))
    risks = []
    for client in list(client_names)[:limit]:
        score, reasons = calculate_risk(client, payments, contracts, journey)
        if score >= 50:
            risks.append((client, score, reasons))
            db['clients'][client] = {'score': score, 'reasons': reasons, 'lastUpdated': datetime.datetime.utcnow().isoformat()}
    if not risks:
        print("✅ No high-risk clients detected (score ≥50).")
        return
    print(f"   🚨 {len(risks)} clients at revenue risk:")
    for client, score, reasons in risks: print(f"      • {client}: {score}/100 — {'; '.join(reasons)}")
    if dry_run:
        print("💡 Add --execute to send alerts and create task drafts")
        return
    lines = [f"📉 Revenue Risk — {len(risks)} at-risk:\n"]
    for client, score, _ in risks[:10]: lines.append(f"• {client}: {score}/100")
    try: telegram_send("\n".join(lines))
    except Exception as e: print(f"   ⚠️  Telegram failed: {e}")
    for client, score, reasons in risks[:5]:
        try:
            gmail_create_draft_new(to="kleber@ziontechgroup.com",
                subject=f"[ACTION] Revenue Risk: {client} ({score}/100)",
                body="Risk factors:\n" + "\n".join(f"- {r}" for r in reasons) + "\n\nPlease act urgently.\n— Zion Automation")
        except Exception as e: print(f"   ⚠️  Draft failed {client}: {e}")
    db['lastRun'] = datetime.datetime.utcnow().isoformat(); save_db(db)
    print(f"   ✅ Alerts sent; top 5 drafts created")

def main():
    p = argparse.ArgumentParser(); p.add_argument('--execute', action='store_true'); p.add_argument('--limit', type=int, default=20)
    args = p.parse_args(); cmd_run(dry_run=not args.execute, limit=args.limit)

if __name__ == '__main__': main()
