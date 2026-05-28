#!/usr/bin/env python3
"""
Client Brief — Zion Tech Group

Pre-meeting intelligence pack for upcoming calendar events.
Aggregates:
  - Recent emails (last 30d) with client
  - Open support tickets
  - Invoice/payment status
  - Contract expiry reminders
  - Recent activity summary

Delivers as Telegram message + markdown report file.

Schedule: Daily at 04:30 (already in HEARTBEAT)

Usage: python3 client_brief.py [--execute] [--limit N]  # limit = max clients
"""

import sys, os, re, json, datetime, argparse
from pathlib import Path

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import calendar_list_events, gmail_search, telegram_send

REPORTS_DIR = WORKSPACE / 'zion.app' / 'reports' / 'client_briefs'
REPORTS_DIR.mkdir(parents=True, exist_ok=True)
DB_FILE = WORKSPACE / 'zion.app' / 'data' / 'client_brief.json'

def load_db():
    if DB_FILE.exists():
        return json.loads(DB_FILE.read_text())
    return {'last_brief': {}}

def save_db(db):
    DB_FILE.parent.mkdir(parents=True, exist_ok=True)
    DB_FILE.write_text(json.dumps(db, indent=2))

def extract_email_domain(sender: str) -> str:
    m = re.search(r'@([\w\.-]+)', sender)
    return m.group(1).lower() if m else ''

def get_upcoming_meetings(hours_ahead=24) -> list:
    now = datetime.datetime.utcnow().isoformat() + 'Z'
    future = (datetime.datetime.utcnow() + datetime.timedelta(hours=hours_ahead)).isoformat() + 'Z'
    events = calendar_list_events(timeMin=now, timeMax=future, maxResults=30)
    upcoming = []
    for ev in events:
        attendees = ev.get('attendees', [])
        if attendees:
            start_raw = ev.get('start','') or ''
            upcoming.append({
                'summary': ev.get('summary','(no title)')[:60],
                'start': str(start_raw)[:16],
                'attendees': [a.get('email','') for a in attendees]
            })
    return upcoming

def get_recent_emails_with_client(client_domain: str, days=30) -> list:
    query = f'from:{client_domain} newer_than:{days}d OR to:{client_domain} newer_than:{days}d'
    msgs = gmail_search(query, limit=20)
    emails = []
    for m in msgs:
        headers = m.get('payload', {}).get('headers', [])
        subject = next((h['value'] for h in headers if h['name']=='Subject'), '(no subject)')[:60]
        sender = next((h['value'] for h in headers if h['name']=='From'), 'unknown')
        emails.append(f"• {subject} — {sender}")
    return emails

def get_open_support_tickets(client_domain: str) -> list:
    query = f'to:{client_domain} (label:Tech-Support OR label:Sales-Support) is:unread'
    threads = gmail_search(query, limit=10)
    tickets = []
    for t in threads:
        snippet = t.get('snippet','')[:60]
        tickets.append(f"• {snip}… (unreplied)")
    return tickets

def get_invoice_summary(client_domain: str) -> str:
    # Check invoice_chaser DB if available
    inv_db_path = WORKSPACE / 'zion.app' / 'data' / 'invoice_chaser.json'
    if not inv_db_path.exists():
        return "(no invoice data available)"
    try:
        inv_db = json.loads(inv_db_path.read_text())
        today = datetime.date.today()
        unpaid = []
        # We don't have direct access to sheet; infer from reminder keys
        for key in inv_db.get('reminders_sent', {}).keys():
            # key format: invoiceId_days_overdue
            parts = key.split('_')
            if len(parts) >= 2:
                days = int(parts[1])
                if days >= 7:
                    unpaid.append(f"• Invoice {parts[0]} overdue {days}d")
        if unpaid:
            return "\n".join(unpaid[:5])
        return "✅ All invoices current"
    except Exception:
        return "(invoice data error)"

def generate_brief(client_name: str, domain: str, meeting: dict) -> str:
    lines = []
    lines.append(f"## 📋 Client Brief — {client_name} ({domain})")
    lines.append(f"**Meeting:** {meeting['summary']} at {meeting['start']}")
    lines.append("")

    # Recent emails
    lines.append("### 📨 Recent Emails (last 30d)")
    emails = get_recent_emails_with_client(domain)
    if emails:
        lines.extend(emails[:8])
    else:
        lines.append("• No recent email activity")
    lines.append("")

    # Support tickets
    lines.append("### 🚨 Open Support Tickets")
    tickets = get_open_support_tickets(domain)
    if tickets:
        lines.extend(tickets[:5])
    else:
        lines.append("• No open support issues")
    lines.append("")

    # Invoice summary
    lines.append("### 💰 Invoice Status")
    inv_summary = get_invoice_summary(domain)
    lines.append(inv_summary)
    lines.append("")

    # Contract expiry (check renewals DB)
    lines.append("### 📄 Contract Renewal")
    ren_db_path = WORKSPACE / 'zion.app' / 'data' / 'renewals.json'
    if ren_db_path.exists():
        try:
            ren_db = json.loads(ren_db_path.read_text())
            contracts = ren_db.get('contracts', {}).values()
            active = [c for c in contracts if c.get('client_domain','') == domain]
            if active:
                for c in active:
                    expiry = c.get('expiry_parsed','N/A')
                    lines.append(f"• Expires: {expiry}")
            else:
                lines.append("• No active contracts found")
        except Exception:
            lines.append("• Contract data unavailable")
    else:
        lines.append("• Contract DB not initialized")

    return '\n'.join(lines)

def cmd_run(dry_run=True, limit=10):
    db = load_db()
    upcoming = get_upcoming_meetings(hours_ahead=24)
    if not upcoming:
        print("✅ No upcoming meetings in next 24h.")
        return

    today_str = datetime.date.today().isoformat()
    generated = 0
    for meeting in upcoming[:limit]:
        # Derive client domains from attendee emails (exclude internal)
        external = [e for e in meeting['attendees'] if not e.endswith('@ziontechgroup.com') and not e.endswith('@gmail.com')]
        if not external:
            continue  # skip internal meetings

        # Pick primary external contact
        primary_email = external[0]
        domain = extract_email_domain(primary_email)
        if not domain:
            continue

        client_name = primary_email.split('@')[0].title()

        brief = generate_brief(client_name, domain, meeting)
        brief_path = REPORTS_DIR / f"brief_{domain}_{today_str}.md"
        brief_path.write_text(brief)

        # Send Telegram summary (truncated)
        summary_lines = brief.split('\n')[:25]  # first ~25 lines
        telegram_msg = '\n'.join(summary_lines) + f"\n…\nFull report: {brief_path}"
        if dry_run:
            print(f"   [DRY-RUN] Would send brief for {client_name} ({domain})")
            print(f"   Report path: {brief_path}")
        else:
            try:
                telegram_send(f"```\n{telegram_msg}\n```")
                print(f"   ✅ Brief sent: {client_name}")
            except Exception as e:
                print(f"   ❌ Telegram failed: {e}")

        db['last_brief'][domain] = {'date': today_str, 'meeting': meeting['summary']}
        generated += 1

    if not dry_run:
        db['lastRun'] = datetime.datetime.utcnow().isoformat()
        save_db(db)

    print(f"\n✅ Generated {generated} client briefs.")
    if dry_run:
        print("💡 Add --execute to send Telegram briefs.")

def main():
    p = argparse.ArgumentParser(description='Client Brief — Pre-meeting intelligence')
    p.add_argument('--execute', action='store_true')
    p.add_argument('--limit', type=int, default=10, help='Max meetings to Brief')
    args = p.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)

if __name__ == '__main__':
    main()
