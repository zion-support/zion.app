#!/usr/bin/env python3
"""
Client Journey Mapper — Zion Tech Group

Aggregates all interactions per client domain: first contact, last contact,
contract dates, invoices, payments, support tickets. Generates engagement score
and flags at-risk clients.

Schedule: Daily at 23:30

Usage: python3 client_journey_mapper.py [--execute] [--limit 20]
"""

import sys, os, re, json, datetime, argparse
from pathlib import Path

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search

DB_FILE = WORKSPACE / 'zion.app' / 'data' / 'client_journey.json'
REPORTS_DIR = WORKSPACE / 'zion.app' / 'reports' / 'client_journey'
REPORTS_DIR.mkdir(parents=True, exist_ok=True)

def load_db():
    if DB_FILE.exists():
        return json.loads(DB_FILE.read_text())
    return {'clients': {}, 'lastRun': None}

def save_db(db):
    DB_FILE.parent.mkdir(parents=True, exist_ok=True)
    DB_FILE.write_text(json.dumps(db, indent=2))

def sender_domain(sender):
    m = re.search(r'@([A-Za-z0-9.-]+\.[A-Za-z]{2,})', sender)
    return m.group(1).lower() if m else 'unknown'

def get_first_last_contact(domain):
    """Find the earliest and latest inbound email from this domain."""
    emails = gmail_search(f'from:@{domain} newer_than:2y', limit=1000)  # up to 2 years
    if not emails:
        return None, None
    dates = []
    for msg in emails:
        hdrs = msg.get('payload', {}).get('headers', [])
        date_hdr = next((h['value'] for h in hdrs if h['name']=='Date'), '')
        try:
            import email.utils
            parsed = email.utils.parsedate_tz(date_hdr)
            if parsed:
                dates.append(datetime.datetime.fromtimestamp(email.utils.mktime_tz(parsed)))
        except Exception:
            pass
    if not dates:
        return None, None
    return min(dates), max(dates)

def load_json_db(path, default=None):
    if Path(path).exists():
        return json.loads(Path(path).read_text())
    return default or {}

def calculate_engagement_score(client, email_stats):
    """Heuristic engagement score (0-100)."""
    score = 0
    # Recency: last email within 30 days = +30, 60d = +20, 90d = +10
    last = client.get('last_contact')
    if last:
        try:
            last_dt = datetime.datetime.fromisoformat(last.rstrip('Z'))
            days_ago = (datetime.datetime.utcnow() - last_dt).days
            if days_ago <= 30:
                score += 30
            elif days_ago <= 60:
                score += 20
            elif days_ago <= 90:
                score += 10
        except Exception:
            pass
    # Frequency: total threads
    threads = email_stats.get('total_threads',0)
    score += min(threads * 2, 30)  # cap 30
    # Contract active?
    if client.get('has_active_contract'):
        score += 20
    # Payment timeliness
    if client.get('payment_rating') == 'on-time':
        score += 20
    elif client.get('payment_rating') == 'late':
        score -= 10
    # Support tickets (negative if many open)
    open_tickets = client.get('open_tickets',0)
    if open_tickets > 5:
        score -= 15
    elif open_tickets > 0:
        score -= 5
    return max(0, min(100, score))

def cmd_run(dry_run=True, limit=20):
    db = load_db()
    # Discover client domains from email
    # Use a broad query to sample domains
    sample = gmail_search('newer_than:1y', limit=500)
    domains = set()
    for msg in sample:
        hdrs = msg.get('payload', {}).get('headers', [])
        sender = next((h['value'] for h in hdrs if h['name']=='From'), '')
        dom = sender_domain(sender)
        if dom != 'unknown' and dom.endswith('com'):  # quick filter
            domains.add(dom)

    clients_updated = 0
    for dom in list(domains)[:limit]:
        first, last = get_first_last_contact(dom)
        if not last:
            continue
        # Try to load auxiliary data
        contracts_db = load_json_db(WORKSPACE / 'zion.app' / 'data' / 'contracts.json', {'contracts': []})
        payments_db = load_json_db(WORKSPACE / 'zion.app' / 'data' / 'payments.json', {'payments': []})
        tickets_db = load_json_db(WORKSPACE / 'zion.app' / 'data' / 'support_tickets.json', {'tickets': []})

        # Find matching contract by client name/domain
        has_active = any(dom in c.get('client','').lower() and c.get('status')=='active' for c in contracts_db.get('contracts',[]))
        # Payment rating: simple check for late payments
        payment_rating = 'on-time'
        for p in payments_db.get('payments',[]):
            if dom in p.get('client','').lower() and p.get('status') == 'late':
                payment_rating = 'late'
                break
        # Open tickets
        open_tickets = sum(1 for t in tickets_db.get('tickets',[]) if dom in t.get('client','').lower() and t.get('status')=='open')

        client_entry = {
            'domain': dom,
            'first_contact': first.isoformat() if first else None,
            'last_contact': last.isoformat() if last else None,
            'has_active_contract': has_active,
            'payment_rating': payment_rating,
            'open_tickets': open_tickets,
        }
        db['clients'][dom] = client_entry
        clients_updated += 1

    if not dry_run:
        db['lastRun'] = datetime.datetime.utcnow().isoformat()
        save_db(db)

    # Generate risk list
    at_risk = []
    for dom, info in db['clients'].items():
        score = calculate_engagement_score(info, {})
        if score < 40:
            at_risk.append((dom, score))

    # Report
    report_lines = [
        f"# Client Journey Report — {datetime.date.today().isoformat()}",
        f"Clients analyzed: {clients_updated}",
        f"At-risk clients (score < 40): {len(at_risk)}",
        "",
    ]
    if at_risk:
        report_lines.append("## 🚨 At-Risk Clients")
        for dom, score in sorted(at_risk, key=lambda x: x[1]):
            report_lines.append(f"- {dom}: engagement {score}/100")
    report_lines.append("")
    report_lines.append("## All Clients (top 20 by last contact)")
    sorted_clients = sorted(db['clients'].items(), key=lambda x: x[1].get('last_contact',''), reverse=True)[:20]
    for dom, info in sorted_clients:
        report_lines.append(f"- {dom}: last={info.get('last_contact','')[:10]}, active_contract={info.get('has_active_contract')}, open_tickets={info.get('open_tickets')}")

    report = '\n'.join(report_lines)
    report_path = REPORTS_DIR / f"journey_{datetime.date.today().isoformat()}.md"
    report_path.write_text(report)

    print(f"✅ Processed {clients_updated} client domains. At-risk: {len(at_risk)}")
    if dry_run:
        print("💡 Add --execute to persist")
    else:
        print(f"✅ Report saved: {report_path}")
        try:
            if at_risk:
                telegram_send(f"⚠️ Client Risk: {len(at_risk)} at-risk clients identified. See {report_path.name}")
        except Exception:
            pass

def main():
    p = argparse.ArgumentParser()
    p.add_argument('--execute', action='store_true')
    p.add_argument('--limit', type=int, default=20)
    args = p.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)

if __name__ == '__main__':
    main()
