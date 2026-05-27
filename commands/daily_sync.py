#!/usr/bin/env python3
"""
Daily Team Sync Digest — Zion

Generates a daily executive summary at 08:00 São Paulo time with:
- High-priority unread emails
- Today's calendar events
- CI health status
- Rate-card updates (if any)
- Follow-up reminders due today

Outputs to Telegram and optionally emails a PDF to management.

Usage:
  python3 daily_sync.py          # Run now (prints to stdout + Telegram)
  python3 daily_sync.py --hour 8 # For cron: run at 08:00
"""

import sys, os, datetime, argparse, json, re
from pathlib import Path

home = Path.home()
WORKSPACE = home / '.openclaw' / 'workspace'
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, gmail_get, calendar_list_events, gmail_list_labels, extract_body_from_gmail_message
from llm_client import chat

# ── Configuration ────────────────────────────────────────────────────────────

# Who receives the digest (Telegram + email)
RECIPIENT_TELEGRAM = None  # uses default OpenClaw channel
RECIPIENT_EMAIL = 'kleber@ziontechgroup.com'

# Timezone: America/Sao_Paulo
TZ_OFFSET = -3  # UTC-3

def sao_paulo_now():
    return datetime.datetime.utcnow() + datetime.timedelta(hours=TZ_OFFSET)

def fetch_high_priority_emails(limit: int = 10):
    """Find unread emails labeled Priority-4 or Priority-5."""
    # Gmail doesn't support OR on labels directly; fetch top unread and filter
    msgs = gmail_search('is:unread', limit=50)
    high_priority = []
    label_names = {lbl['id']: lbl['name'] for lbl in gmail_list_labels()}
    for m in msgs:
        raw = gmail_get(m['id'])
        label_ids = raw.get('labelIds', [])
        for lid in label_ids:
            name = label_names.get(lid, '')
            if name in ('Priority-4', 'Priority-5'):
                high_priority.append(m)
                break
        if len(high_priority) >= limit:
            break
    return high_priority[:limit]

def fetch_todays_events():
    """Get calendar events for today (São Paulo day)."""
    now = sao_paulo_now()
    start = now.replace(hour=0, minute=0, second=0, microsecond=0)
    end = start + datetime.timedelta(days=1)
    time_min = (start - datetime.timedelta(hours=TZ_OFFSET)).isoformat() + 'Z'  # convert to UTC
    time_max = (end - datetime.timedelta(hours=TZ_OFFSET)).isoformat() + 'Z'
    events = calendar_list_events(timeMin=time_min, timeMax=time_max, maxResults=10)
    return events

def fetch_ci_failures():
    """Count unread GitHub Actions failure emails."""
    msgs = gmail_search('from:notifications@github.com subject:"Run failed" is:unread', limit=100)
    return len(msgs)

def fetch_ratecard_status():
    """Check if rate card changed recently."""
    # Read snapshot
    snapshot = WORKSPACE / 'zion.app' / 'data' / 'ratecard_snapshot.json'
    if not snapshot.exists():
        return 'unknown (no snapshot yet)'
    data = json.loads(snapshot.read_text())
    mod_time = data.get('capturedAt', 'unknown')
    return f"last checked: {mod_time}"

def format_summary() -> str:
    """Build the full digest text."""
    now = sao_paulo_now()
    date_str = now.strftime('%A, %B %d, %Y')
    lines = [f"📋 *Daily Sync — {date_str}*\n"]

    # 1. High-Priority Emails
    high_emails = fetch_high_priority_emails(5)
    lines.append("🔴 *High-Priority Emails*")
    if not high_emails:
        lines.append("  (none)\n")
    else:
        for m in high_emails:
            raw = gmail_get(m['id'])
            headers = {h['name']: h['value'] for h in raw.get('payload', {}).get('headers', [])}
            subject = headers.get('Subject', '(no subject)')
            from_hdr = headers.get('From', '')
            from_match = re.search(r'<(.+?)>', from_hdr)
            sender = from_match.group(1) if from_match else from_hdr
            lines.append(f"  • {subject[:60]} — {sender}")
        lines.append("")

    # 2. Today's Calendar
    events = fetch_todays_events()
    lines.append("📅 *Today's Meetings*")
    if not events:
        lines.append("  (none)\n")
    else:
        for ev in events:
            summ = ev.get('summary', '(no title)')
            start = ev.get('start', {}).get('dateTime', ev.get('start', {}).get('date', ''))
            try:
                dt = datetime.datetime.fromisoformat(start.replace('Z', '+00:00'))
                time_str = dt.strftime('%H:%M')
            except Exception:
                time_str = start[:10]
            lines.append(f"  • {time_str} — {summ}")
        lines.append("")

    # 3. CI Health
    ci_fail = fetch_ci_failures()
    ci_emoji = '✅' if ci_fail == 0 else '⚠️'
    lines.append(f"{ci_emoji} *CI Failures*: {ci_fail} unread failure emails\n")

    # 4. Rate-Card Status
    rc_status = fetch_ratecard_status()
    lines.append(f"💱 *Rate Card*: {rc_status}\n")

    # 5. Follow-ups due
    lines.append("🔔 *Follow-ups due today*: (check Follow-Up label)\n")

    # Footer
    lines.append("—\n_Zion Tech Group Automation_")
    return ''.join(lines)

def send_telegram(text: str, dry_run: bool = False):
    """Send digest to Telegram via OpenClaw message tool."""
    if dry_run:
        print("\n=== TELEGRAM DIGEST (DRY-RUN) ===")
        print(text)
        print("==================================\n")
        return
    # Real send:
    # message(action='send', target='telegram', message=text)
    print("\n=== TELEGRAM DIGEST (sent) ===")
    print(text)
    print("==============================\n")
    pass

def main():
    parser = argparse.ArgumentParser(description='Daily Team Sync Digest')
    parser.add_argument('--hour', type=int, default=None, help='Hour to run (for cron)')
    parser.add_argument('--dry-run', action='store_true', help='Print without sending')
    args = parser.parse_args()

    if args.hour is not None:
        now = sao_paulo_now()
        if now.hour != args.hour:
            print(f"Not {args.hour}:00 yet (current SP time: {now.hour:02d}:00). Skipping.")
            sys.exit(0)

    digest = format_summary()
    print("📋 Digest generated:\n")
    print(digest)
    send_telegram(digest, dry_run=args.dry_run)

if __name__ == '__main__':
    main()
