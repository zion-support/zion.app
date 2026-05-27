#!/usr/bin/env python3
"""
Predictive Churn — Zion Tech Group

Scores client health (1-10) based on signals:
  - Email engagement (last 30d: replies sent/received ratio)
  - Support tickets (open >48h, negative sentiment keywords)
  - Payment delays (invoices overdue >14 days)
  - Contract renewal proximity (<90 days)
  - Product usage logs (if available)

Categorizes: Healthy (1-3), At-Risk (4-6), Critical (7-10)
Sends Telegram summary + updates client record.

Schedule: Weekly on Monday 09:00

Usage: python3 predictive_churn.py [--execute] [--limit N]
"""

import sys, os, re, json, datetime, argparse
from pathlib import Path

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, telegram_send

DB_FILE = WORKSPACE / 'zion.app' / 'data' / 'churn_scores.json'
SCORES_FILE = WORKSPACE / 'zion.app' / 'data' / 'client_health.json'

def load_db():
    if DB_FILE.exists():
        return json.loads(DB_FILE.read_text())
    return {'scores': {}, 'lastRun': None}

def save_db(db):
    DB_FILE.parent.mkdir(parents=True, exist_ok=True)
    DB_FILE.write_text(json.dumps(db, indent=2))

def get_client_domains() -> list:
    """Extract unique sender domains from last 90 days."""
    # Simplified: parse from recent emails
    domains = set()
    msgs = gmail_search('newer_than:90d', limit=200)
    for m in msgs:
        headers = m.get('payload', {}).get('headers', [])
        frm = next((h['value'] for h in headers if h['name']=='From'), '')
        mdom = re.search(r'@([\w\.-]+)', frm)
        if mdom:
            domains.add(mdom.group(1))
    return sorted(domains)

def email_engagement_score(domain) -> int:
    """Score 1=very engaged, 10=ghosted."""
    # Count inbound/outbound over last 30d
    query_in = f'from:{domain} newer_than:30d'
    query_out = f'to:{domain} newer_than:30d is:sent'
    in_count = len(gmail_search(query_in, limit=50))
    out_count = len(gmail_search(query_out, limit=50))
    if in_count == 0:
        return 10  # no inbound
    ratio = out_count / max(in_count, 1)
    if ratio > 0.5:
        return 1
    elif ratio > 0.3:
        return 3
    elif ratio > 0.1:
        return 5
    else:
        return 7

def support_ticket_score(domain) -> int:
    """Score based on open support threads age."""
    query = f'to:{domain} (label:Tech-Support OR label:Sales-Support) is:unread'
    threads = gmail_search(query, limit=20)
    max_age = 0
    for t in threads:
        tid = t.get('threadId')
        # Approximate age by internalDate
        ims = int(t.get('internalDate',0))
        age_h = (datetime.datetime.utcnow().timestamp()*1000 - ims) / (1000*60*60)
        if age_h > max_age:
            max_age = age_h
    if max_age > 72:
        return 10
    elif max_age > 48:
        return 7
    elif max_age > 24:
        return 5
    else:
        return 2

def payment_delay_score(domain) -> int:
    """Varies based on overdue invoices (reads from invoice_chaser DB if available)."""
    # Check if invoice DB exists
    inv_db_path = WORKSPACE / 'zion.app' / 'data' / 'invoice_chaser.json'
    if not inv_db_path.exists():
        return 5  # neutral
    try:
        inv_db = json.loads(inv_db_path.read_text())
        today = datetime.date.today()
        overdue_days = []
        for key, rec in inv_db.get('reminders_sent', {}).items():
            # key is invoiceId_days; days indicates overdue at time of reminder
            parts = key.split('_')
            if len(parts) >= 2:
                days = int(parts[1])
                overdue_days.append(days)
        if not overdue_days:
            return 1
        max_overdue = max(overdue_days)
        if max_overdue >= 60:
            return 10
        elif max_overdue >= 30:
            return 7
        elif max_overdue >= 14:
            return 5
        else:
            return 3
    except Exception:
        return 5

def contract_renewal_proximity_score(domain) -> int:
    """Closer to renewal = higher risk (0 if >180d, 10 if <30d)."""
    # Use renewal DB if available
    ren_db_path = WORKSPACE / 'zion.app' / 'data' / 'renewals.json'
    if not ren_db_path.exists():
        return 5
    try:
        ren_db = json.loads(ren_db_path.read_text())
        contracts = ren_db.get('contracts', {}).values()
        min_days = None
        for c in contracts:
            cdomain = c.get('client_domain','')
            if domain == cdomain:
                expiry = datetime.datetime.strptime(c['expiry_parsed'], '%Y-%m-%d').date()
                days = (expiry - datetime.date.today()).days
                if days > 0 and (min_days is None or days < min_days):
                    min_days = days
        if min_days is None:
            return 0
        if min_days <= 30:
            return 10
        elif min_days <= 60:
            return 8
        elif min_days <= 90:
            return 6
        elif min_days <= 180:
            return 3
        else:
            return 0
    except Exception:
        return 5

def calculate_health_score(domain) -> tuple:
    """Returns (score 1-10, breakdown dict)."""
    scores = {
        'email_engagement': email_engagement_score(domain),
        'support_tickets': support_ticket_score(domain),
        'payment_delays': payment_delay_score(domain),
        'renewal_proximity': contract_renewal_proximity_score(domain),
    }
    # Weighted average
    weights = {'email_engagement': 0.35, 'support_tickets': 0.25, 'payment_delays': 0.25, 'renewal_proximity': 0.15}
    weighted = sum(scores[k] * weights[k] for k in scores)
    final = int(round(weighted))
    final = max(1, min(10, final))
    return final, scores

def classify(score):
    if score <= 3:
        return 'Healthy'
    elif score <= 6:
        return 'At-Risk'
    else:
        return 'Critical'

def cmd_run(dry_run=True, limit=100):
    db = load_db()
    domains = get_client_domains()[:limit]
    if not domains:
        print("✅ No client domains found.")
        return

    updates = {}
    criticals = []
    for domain in domains:
        score, breakdown = calculate_health_score(domain)
        status = classify(score)
        updates[domain] = {'score': score, 'status': status, 'breakdown': breakdown, 'updated': datetime.date.today().isoformat()}
        if status == 'Critical':
            criticals.append(f"⚠️ {domain}: {score}/10 — {breakdown}")

    if dry_run:
        print(f"📊 Would score {len(updates)} clients (limit={limit}):")
        for d, info in updates.items():
            print(f"   {d}: {info['score']}/10 [{info['status']}]")
        if criticals:
            print(f"\n🚨 Critical clients ({len(criticals)}):")
            for c in criticals[:5]:
                print(f"   {c}")
        print("💡 Add --execute to persist and send Telegram alerts.")
        return

    # Persist
    db['scores'].update(updates)
    db['lastRun'] = datetime.datetime.utcnow().isoformat()
    save_db(db)

    # Send Telegram summary
    lines = [f"📊 Weekly Client Health — {len(updates)} scored", ""]
    healthy = [d for d,inf in updates.items() if inf['status']=='Healthy']
    atrisk = [d for d,inf in updates.items() if inf['status']=='At-Risk']
    crit = [d for d,inf in updates.items() if inf['status']=='Critical']
    lines.append(f"✅ Healthy: {len(healthy)}")
    lines.append(f"🟡 At-Risk: {len(atrisk)}")
    lines.append(f"🔴 Critical: {len(crit)}")
    if crit:
        lines.append("\n🚨 Critical clients:")
        for c in crit[:10]:
            lines.append(f"   - {c} (score {updates[c]['score']})")
    telegram_send("\n".join(lines))
    print(f"\n✅ Updated {len(updates)} scores. Alerts sent for {len(crit)} critical clients.")

def main():
    p = argparse.ArgumentParser(description='Predictive Churn — Client Health Scoring')
    p.add_argument('--execute', action='store_true')
    p.add_argument('--limit', type=int, default=100)
    args = p.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)

if __name__ == '__main__':
    main()
