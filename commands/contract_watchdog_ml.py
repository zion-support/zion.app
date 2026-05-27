#!/usr/bin/env python3
"""
Contract Watchdog ML — Zion Tech Group

Enhances contract_watchdog with ML-based renewal probability scoring.
Uses LLM to analyze contract value, client history, engagement signals
and predict win probability (0-100%). Prioritizes high-probability vs at-risk.

Strategy:
  1. Load contracts expiring within 90 days
  2. For each, gather signals: contract value, payment history, support tickets, email engagement
  3. Construct prompt for LLM with context + ask for probability + rationale
  4. Update DB with score + risk level
  5. Send Telegram summary highlighting top priorities

Schedule: Daily at 06:00 (can replace or augment existing contract_watchdog)

Usage: python3 contract_watchdog_ml.py [--execute] [--limit N]
"""

import sys, os, re, json, datetime, argparse
from pathlib import Path

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, telegram_send
from llm_client import chat

DB_FILE = WORKSPACE / 'zion.app' / 'data' / 'renewals_ml.json'
PROMPT = """
You are an account strategist for Zion Tech Group.
Estimate the renewal probability for this contract based on the following signals.

Contract:
  Client: {client_name} ({client_domain})
  Value: ${value}
  Expiry: {expiry}
  Days remaining: {days_left}

Signals:
  - Email engagement (last 30d): {email_engagement}
  - Open support tickets: {open_tickets}
  - Payment delays (last 6mo): {payment_delays}
  - Previous renewals: {prev_renewals}

Return JSON:
{{"probability": 0-100, "risk": "Low|Medium|High", "recommendation": "one sentence", "rationale": "brief explanation"}}
"""

def load_db():
    if DB_FILE.exists():
        return json.loads(DB_FILE.read_text())
    return {'contracts': {}, 'lastRun': None}

def save_db(db):
    DB_FILE.parent.mkdir(parents=True, exist_ok=True)
    DB_FILE.write_text(json.dumps(db, indent=2))

def load_base_contracts():
    # Reuse from existing renewal_workflow contract loader
    # For simplicity, duplicate minimal logic
    try:
        from lib.llm_fallback_router import call_openai as llm_call
    except Exception:
        pass
    # We'll use the same logic as renewal_workflow to load contracts
    # but we don't want circular imports; just inline what we need
    contracts_db_path = WORKSPACE / 'zion.app' / 'data' / 'renewals.json'
    if contracts_db_path.exists():
        data = json.loads(contracts_db_path.read_text())
        return data.get('contracts', {})
    # Fallback: read from google_workspace or sheet if needed
    return {}

def get_email_engagement(domain: str) -> str:
    inbound = len(gmail_search(f'from:{domain} newer_than:30d', limit=50))
    outbound = len(gmail_search(f'to:{domain} newer_than:30d is:sent', limit=50))
    if outbound == 0:
        return "None (no outbound)"
    ratio = inbound / max(outbound, 1)
    if ratio > 1.5:
        return "High (they email us more)"
    elif ratio > 0.8:
        return "Medium"
    else:
        return "Low (we email more)"

def count_open_tickets(domain: str) -> int:
    return len(gmail_search(f'to:{domain} (label:Tech-Support OR label:Sales-Support) is:unread', limit=20))

def count_payment_delays(domain: str) -> int:
    inv_db_path = WORKSPACE / 'zion.app' / 'data' / 'invoice_chaser.json'
    if not inv_db_path.exists():
        return 0
    try:
        inv_db = json.loads(inv_db_path.read_text())
        delays = 0
        for key in inv_db.get('reminders_sent', {}).keys():
            parts = key.split('_')
            if len(parts) >= 2 and int(parts[1]) >= 14:
                delays += 1
        return delays
    except Exception:
        return 0

def get_prev_renewals_count(domain: str) -> int:
    ren_db_path = WORKSPACE / 'zion.app' / 'data' / 'renewals.json'
    if not ren_db_path.exists():
        return 0
    try:
        ren_db = json.loads(ren_db_path.read_text())
        count = 0
        for c in ren_db.get('contracts', {}).values():
            if c.get('client_domain','') == domain and c.get('status','') == 'renewed':
                count += 1
        return count
    except Exception:
        return 0

def score_contract(contract: dict) -> dict:
    client_domain = contract.get('client_domain','')
    client_name = contract.get('client_name','')
    value = contract.get('value', 0)
    expiry = contract.get('expiry_parsed','')
    days_left = contract.get('days_until_expiry', 0)

    # Gather signals
    email_engagement = get_email_engagement(client_domain)
    open_tickets = count_open_tickets(client_domain)
    payment_delays = count_payment_delays(client_domain)
    prev_renewals = get_prev_renewals_count(client_domain)

    # Build prompt
    prompt = PROMPT.format(
        client_name=client_name or client_domain,
        client_domain=client_domain,
        value=value,
        expiry=expiry,
        days_left=days_left,
        email_engagement=email_engagement,
        open_tickets=open_tickets,
        payment_delays=payment_delays,
        prev_renewals=prev_renewals
    )

    try:
        resp = chat([{"role":"user","content":prompt}], provider="auto", temperature=0.3)
        content = resp.get('content','')
        # Extract JSON
        try:
            import json as j
            result = j.loads(content)
            return {
                'probability': result.get('probability', 50),
                'risk': result.get('risk','Medium'),
                'recommendation': result.get('recommendation',''),
                'rationale': result.get('rationale',''),
                'signals': {
                    'email_engagement': email_engagement,
                    'open_tickets': open_tickets,
                    'payment_delays': payment_delays,
                    'prev_renewals': prev_renewals
                }
            }
        except Exception:
            # Fallback: rule-based heuristic
            prob = max(0, min(100, 100 - days_left*1.5 - open_tickets*10 - payment_delays*5))
            risk = 'High' if prob < 50 else ('Medium' if prob < 75 else 'Low')
            return {'probability': int(prob), 'risk': risk, 'recommendation': 'Review client signals', 'rationale': ' heuristic fallback'}
    except Exception as e:
        print(f"   ⚠️  LLM scoring failed: {e}")
        return {'probability': 50, 'risk': 'Medium', 'recommendation': 'LLM unavailable', 'rationale': 'fallback default'}

def cmd_run(dry_run=True, limit=0):
    base_contracts = load_base_contracts()
    if not base_contracts:
        print("⚠️  No base contracts found (renewals.json). Run renewal_workflow first.")
        return

    db = load_db()
    scored = 0
    high_risk = []
    med_risk = []

    # Filter to expiring within 90 days
    contracts_to_score = []
    for cid, con in base_contracts.items():
        days = con.get('days_until_expiry', 0)
        if 0 <= days <= 90:
            contracts_to_score.append((cid, con))
    contracts_to_score.sort(key=lambda x: x[1].get('days_until_expiry', 999))

    if limit:
        contracts_to_score = contracts_to_score[:limit]

    for cid, con in contracts_to_score:
        domain = con.get('client_domain','')
        print(f"   Scoring: {domain} (expires in {con.get('days_until_expiry', '?')}d)")

        score_info = score_contract(con)
        db['contracts'][cid] = {
            **con,
            'ml_score': score_info,
            'scored_at': datetime.datetime.utcnow().isoformat()
        }
        scored += 1

        if score_info['risk'] == 'High':
            high_risk.append(f"🚨 {domain}: {score_info['probability']}% — {score_info['recommendation']}")
        elif score_info['risk'] == 'Medium':
            med_risk.append(f"🟡 {domain}: {score_info['probability']}% — {score_info['recommendation']}")

        if dry_run:
            print(f"      [DRY-RUN] Score: {score_info['probability']}% [{score_info['risk']}]")

    if dry_run:
        print(f"\n📊 Would score {scored} contracts.")
        if high_risk:
            print(f"🚨 High risk ({len(high_risk)}):")
            for h in high_risk[:5]:
                print(f"   {h}")
        return

    # Persist
    db['lastRun'] = datetime.datetime.utcnow().isoformat()
    save_db(db)

    # Send Telegram summary
    lines = [f"📊 Contract Renewal ML Scoring — {scored} contracts", ""]
    lines.append(f"🔴 High Risk: {len(high_risk)}")
    lines.append(f"🟡 Medium Risk: {len(med_risk)}")
    if high_risk:
        lines.append("\n🚨 Immediate attention needed:")
        for h in high_risk[:10]:
            lines.append(f"  {h}")
    telegram_send("\n".join(lines))
    print(f"\n✅ Scored {scored} contracts. Alerts sent.")

def main():
    p = argparse.ArgumentParser(description='Contract Watchdog ML — Renewal Probability')
    p.add_argument('--execute', action='store_true')
    p.add_argument('--limit', type=int, default=0, help='Max contracts to score (0=all)')
    args = p.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)

if __name__ == '__main__':
    main()
