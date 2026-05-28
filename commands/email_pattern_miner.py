#!/usr/bin/env python3
"""
Email Pattern Miner — Zion Tech Group

Analyzes sender domains to detect common email themes (Billing, Support, Partnership, Newsletter, etc.).
Uses keyword-based heuristics (no heavy ML) to categorize senders.
Outputs per-sender theme database used by auto_tagger.

Schedule: Daily at 23:00

Usage: python3 email_pattern_miner.py [--execute] [--limit 50]
"""

import sys, os, re, json, datetime, argparse, collections
from pathlib import Path

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search

DB_FILE = WORKSPACE / 'zion.app' / 'data' / 'email_patterns.json'
REPORTS_DIR = WORKSPACE / 'zion.app' / 'reports' / 'email_patterns'
REPORTS_DIR.mkdir(parents=True, exist_ok=True)

THEME_KEYWORDS = {
    'Billing':      ['invoice', 'payment', 'receipt', 'billing', 'charge', 'credit card', 'overdue', 'past due'],
    'Support':      ['support', 'help', 'issue', 'problem', 'error', 'broken', 'ticket', 'fix', 'bug'],
    'Partnership':  ['partnership', 'collaboration', 'alliance', 'joint', 'co-marketing'],
    'Newsletter':   ['newsletter', 'update', 'digest', 'weekly', 'monthly', 'unsubscribe'],
    'Marketing':    ['promotion', 'offer', 'discount', 'deal', 'sale', 'buy now'],
    'HR':           ['payroll', 'benefits', 'hr', 'holiday', 'vacation', 'time off'],
    'Legal':        ['legal', 'contract', 'agreement', 'terms', 'nda', 'sow'],
    'General':      []
}

def load_db():
    if DB_FILE.exists():
        return json.loads(DB_FILE.read_text())
    return {'domains': {}, 'lastRun': None}

def save_db(db):
    DB_FILE.parent.mkdir(parents=True, exist_ok=True)
    DB_FILE.write_text(json.dumps(db, indent=2))

def sender_domain(sender):
    m = re.search(r'@([A-Za-z0-9.-]+\.[A-Za-z]{2,})', sender)
    return m.group(1).lower() if m else 'unknown'

def fetch_emails_by_domain(domain, limit=50):
    query = f'from:@{domain} newer_than:30d'
    return gmail_search(query, limit=limit)

def classify_domain(domain, sample_emails):
    """Score keywords across subjects+snippets to pick best theme."""
    scores = collections.Counter()
    for msg in sample_emails:
        hdrs = msg.get('payload', {}).get('headers', [])
        subject = next((h['value'] for h in hdrs if h['name']=='Subject'), '')
        snippet = msg.get('snippet','')
        text = (subject + ' ' + snippet).lower()
        for theme, kws in THEME_KEYWORDS.items():
            for kw in kws:
                if kw in text:
                    scores[theme] += 1
    if not scores:
        return 'General'
    return scores.most_common(1)[0][0]

def cmd_run(dry_run=True, limit=50):
    db = load_db()
    # Scan recent unread (or all) emails for new domains
    emails = gmail_search('newer_than:30d', limit=500)  # sample across inbox
    domains_seen = collections.defaultdict(list)
    for msg in emails:
        hdrs = msg.get('payload', {}).get('headers', [])
        sender = next((h['value'] for h in hdrs if h['name']=='From'), '')
        dom = sender_domain(sender)
        domains_seen[dom].append(msg)

    new_classifications = 0
    for dom, msgs in domains_seen.items():
        if dom in db['domains']:
            continue
        theme = classify_domain(dom, msgs[:limit])
        db['domains'][dom] = {
            'theme': theme,
            'sample_count': len(msgs),
            'lastSeen': datetime.datetime.utcnow().isoformat(),
            'confidence': min(100, len(msgs)*10)  # crude proxy
        }
        new_classifications += 1
        print(f"   🏷️  {dom} → {theme} (n={len(msgs)})")

    if not dry_run and new_classifications:
        db['lastRun'] = datetime.datetime.utcnow().isoformat()
        save_db(db)

    # Generate report
    report_lines = [
        f"# Email Pattern Miner — {datetime.date.today().isoformat()}",
        f"New classifications: {new_classifications}",
        f"Total known domains: {len(db['domains'])}",
        "",
        "## Domain Themes",
    ]
    for dom, info in sorted(db['domains'].items(), key=lambda x: x[1]['lastSeen'], reverse=True)[:50]:
        report_lines.append(f"- {dom}: {info['theme']} (confidence {info.get('confidence',0)}%, last seen {info.get('lastSeen','')[:10]})")

    report = '\n'.join(report_lines)
    report_path = REPORTS_DIR / f"patterns_{datetime.date.today().isoformat()}.md"
    report_path.write_text(report)

    print(f"\n✅ Processed {len(emails)} emails across {len(domains_seen)} domains. New: {new_classifications}")
    if dry_run:
        print("💡 Add --execute to persist new classifications")
    else:
        print(f"✅ Report: {report_path}")

def main():
    p = argparse.ArgumentParser()
    p.add_argument('--execute', action='store_true')
    p.add_argument('--limit', type=int, default=50)
    args = p.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)

if __name__ == '__main__':
    main()
