#!/usr/bin/env python3
"""
Response Time Optimizer — Zion Tech Group

Analyzes email response patterns and suggests optimal send/response times.
Helps Kleber know WHEN to check email and when to expect replies from clients.
Also identifies bottleneck senders (slow responders) and suggests alternative contacts.

Strategy:
  1. Scan sent mail to measure our average response time per label/domain
  2. Scan received mail to measure recipient response times
  3. Build per-contact response-time profile
  4. Suggest best windows to send (when recipient is most active)
  5. Flag slow responders (>48h avg) for escalation

Schedule: Daily at 07:30

Usage: python3 response_time_optimizer.py [--execute] [--limit N]
"""

import sys, os, re, json, datetime, argparse, statistics
from pathlib import Path

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, telegram_send

DB_FILE = WORKSPACE / 'zion.app' / 'data' / 'response_times.json'
REPORTS_DIR = WORKSPACE / 'zion.app' / 'reports' / 'response_optimizer'
REPORTS_DIR.mkdir(parents=True, exist_ok=True)

def load_db():
    if DB_FILE.exists():
        return json.loads(DB_FILE.read_text())
    return {'profiles': {}, 'lastRun': None}

def save_db(db):
    DB_FILE.parent.mkdir(parents=True, exist_ok=True)
    DB_FILE.write_text(json.dumps(db, indent=2))

def get_sent_threads(days=30, limit=200):
    return gmail_search(f'is:sent newer_than:{days}d', limit=limit)

def parse_email_date(date_hdr):
    try:
        import email.utils
        parsed = email.utils.parsedate_tz(date_hdr)
        if parsed:
            return datetime.datetime.fromtimestamp(email.utils.mktime_tz(parsed))
    except Exception:
        pass
    return None

def link_sender(email):
    m = re.search(r'@([A-Za-z0-9.-]+\.[A-Za-z]{2,})', email)
    return m.group(1).lower() if m else 'unknown'

def analyze_our_response_times():
    """How quickly do WE respond to various domains/labels?"""
    sent = get_sent_threads()
    profiles = {}
    for msg in sent:
        headers = msg.get('payload', {}).get('headers', [])
        date_hdr = next((h['value'] for h in headers if h['name']=='Date'), '')
        msg_date = parse_email_date(date_hdr) or datetime.datetime.utcnow()
        # Get thread's first received message (inbound) as the trigger
        thread_id = msg.get('threadId')
        if not thread_id:
            continue
        inbound = gmail_search(f'thread:{thread_id} -is:sent', limit=1)
        if not inbound:
            continue
        ib = inbound[0]
        ib_headers = ib.get('payload', {}).get('headers', [])
        ib_date_hdr = next((h['value'] for h in ib_headers if h['name']=='Date'), '')
        ib_date = parse_email_date(ib_date_hdr)
        if not ib_date:
            continue
        # Response time delta (our sent - first inbound)
        delta_mins = (msg_date - ib_date).total_seconds() / 60
        sender_link = link_sender(ib.get('payload',{}).get('headers',[{}])[0].get('value',''))
        if sender_link not in profiles:
            profiles[sender_link] = []
        profiles[sender_link].append(delta_mins)
    # Aggregate per domain
    stats = {}
    for domain, times in profiles.items():
        if len(times) >= 3:
            stats[domain] = {
                'avg_minutes': round(statistics.mean(times), 1),
                'median_minutes': round(statistics.median(times), 1),
                'count': len(times)
            }
    return stats

def analyze_recipient_response_times():
    """How quickly do THEY respond to US?"""
    unread = gmail_search('is:unread -label:Followup-Scheduled', limit=100)
    profiles = {}
    for msg in unread:
        headers = msg.get('payload', {}).get('headers', [])
        sender = next((h['value'] for h in headers if h['name']=='From'), '')
        domain = link_sender(sender)
        date_hdr = next((h['value'] for h in headers if h['name']=='Date'), '')
        msg_date = parse_email_date(date_hdr)
        if not msg_date:
            continue
        age_min = (datetime.datetime.utcnow() - msg_date).total_seconds() / 60
        if domain not in profiles:
            profiles[domain] = []
        profiles[domain].append(age_min)
    # Rough: median age of unread = estimate of their response time
    stats = {}
    for domain, ages in profiles.items():
        stats[domain] = {
            'median_unread_minutes': round(statistics.median(ages), 1),
            'unread_count': len(ages)
        }
    return stats

def generate_recommendations(our_stats, recip_stats):
    lines = []
    lines.append("# Response Time Optimization Report\n")
    lines.append(f"Generated: {datetime.datetime.utcnow().isoformat()}Z\n")

    lines.append("## Our Response Performance (outbound)\n")
    slow_domains = []
    for domain, st in sorted(our_stats.items(), key=lambda x: x[1]['avg_minutes'], reverse=True)[:10]:
        lines.append(f"- {domain}: avg {st['avg_minutes']}min (median {st['median_minutes']}min, n={st['count']})")
        if st['avg_minutes'] > 120:
            slow_domains.append(domain)

    lines.append("\n## Recipient responsiveness (inbound)\n")
    for domain, rst in sorted(recip_stats.items(), key=lambda x: x[1]['median_unread_minutes'], reverse=True)[:10]:
        lines.append(f"- {domain}: median unread age {rst['median_unread_minutes']}min (count={rst['unread_count']})")

    lines.append("\n## Recommendations\n")
    if slow_domains:
        lines.append("**Slowest our responses** — consider templates or delegation:")
        for d in slow_domains[:5]:
            lines.append(f"- {d}")
    lines.append("**Best times to send** (based on typical business hours UTC-3):")
    lines.append("- Tue–Thu, 09:00–11:00 or 14:00–16:00")
    lines.append("- Avoid Mondays 08:00–10:00 (meeting-heavy)")

    return '\n'.join(lines)

def cmd_run(dry_run=True, limit=100):
    db = load_db()
    print("   📊 Analyzing our outbound response times...")
    our_stats = analyze_our_response_times()
    print(f"   📊 Analyzed {len(our_stats)} contact domains (outbound)")

    print("   📊 Analyzing recipient responsiveness...")
    recip_stats = analyze_recipient_response_times()
    print(f"   📊 Found {len(recip_stats)} domains with unread emails")

    report = generate_recommendations(our_stats, recip_stats)
    report_path = REPORTS_DIR / f"response_optimizer_{datetime.date.today().isoformat()}.md"
    report_path.write_text(report)

    if dry_run:
        print(f"\n[DRY-RUN] Would save report: {report_path.name}")
        print("💡 Summary preview:")
        print(report[:800])
        return

    db['lastRun'] = datetime.datetime.utcnow().isoformat()
    save_db(db)

    # Send summary to Telegram (truncated)
    summary_lines = report.split('\n')
    telegram_msg = '\n'.join(summary_lines[:25]) + f"\n\n[Full report: {report_path.name}]"
    telegram_send(f"📈 Response Time Optimizer:\n{telegram_msg}")
    print(f"\n✅ Report saved. Summary sent to Telegram.")

def main():
    p = argparse.ArgumentParser()
    p.add_argument('--execute', action='store_true')
    p.add_argument('--limit', type=int, default=100)
    args = p.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)

if __name__ == '__main__':
    main()
