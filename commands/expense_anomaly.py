#!/usr/bin/env python3
from __future__ import annotations

"""
Expense Anomaly Detection — Zion Tech Group (robust v2)

Compares weekly vendor spend against historical baselines.
Flags vendors with >THRESHOLD% week-over-week delta.

Usage:
  python3 expense_anomaly.py [--execute] [--limit 20]   # Send alerts (default dry-run)
"""

import sys, os, re, json, datetime, argparse, time
from pathlib import Path

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, gmail_get
from llm_client import chat

EXPENSE_DB = WORKSPACE / 'zion.app' / 'data' / 'expense_history.json'
ALERT_THRESHOLD = 0.30  # 30% week-over-week increase
DEFAULT_LIMIT = 20
BATCH_DELAY = 1.0  # seconds between LLM calls (rate limit friendly)

def load_expense_history() -> dict:
    if EXPENSE_DB.exists():
        return json.loads(EXPENSE_DB.read_text())
    return {'vendors': {}, 'lastUpdate': None}

def save_expense_history(history: dict):
    EXPENSE_DB.parent.mkdir(parents=True, exist_ok=True)
    EXPENSE_DB.write_text(json.dumps(history, indent=2))

def get_this_week_emails(limit: int = DEFAULT_LIMIT) -> list:
    """Get last 7 days of expense-related emails (invoices, receipts, charges)."""
    since = (datetime.date.today() - datetime.timedelta(days=7)).isoformat()
    query = f'after:{since} (subject:invoice OR subject:receipt OR subject:charge OR subject:billing)'
    msgs = gmail_search(query, limit=limit)
    return msgs

def parse_expense_from_email(msg) -> dict | None:
    """Use LLM to extract vendor, amount, currency, expense_date from email."""
    headers = {h['name']: h['value'] for h in msg.get('payload', {}).get('headers', [])}
    subject = headers.get('Subject','')
    body = extract_body_from_gmail_message(msg)[:2000]

    prompt = (
        "Extract expense details from this email. Return JSON with keys:\n"
        "vendor (string), amount (number), currency (3-letter code), date (YYYY-MM-DD), "
        "category (optional: software, hosting, marketing, office, travel, other).\n"
        "If amount not found, return null.\n\n"
        f"Subject: {subject}\nBody: {body[:1500]}"
    )
    try:
        resp = chat([{"role":"user","content":prompt}], provider="auto")
        content = resp['content'].strip()
        if '```' in content:
            parts = content.split('```')
            for part in parts:
                if '{' in part:
                    content = part.strip()
                    break
        data = json.loads(content)
        if data.get('amount') and data.get('vendor'):
            return data
    except Exception as e:
        print(f"   ⚠️  Parse error: {e}")
    return None

def extract_body_from_gmail_message(msg):
    payload = msg.get('payload', {})
    if 'parts' in payload:
        for part in payload['parts']:
            if part.get('mimeType') == 'text/plain':
                data = part.get('body', {}).get('data', '')
                if data:
                    import base64
                    return base64.urlsafe_b64decode(data + '===').decode('utf-8', errors='replace')
    body = payload.get('body', {}).get('data', '')
    if body:
        import base64
        return base64.urlsafe_b64decode(body + '===').decode('utf-8', errors='replace')
    return ''

def aggregate_weekly_spend(expenses: list) -> dict:
    vendor_totals = {}
    for exp in expenses:
        vendor = exp['vendor'].lower().strip()
        amt = float(exp['amount'])
        vendor_totals[vendor] = vendor_totals.get(vendor, 0) + amt
    return vendor_totals

def cmd_run(dry_run: bool, limit: int):
    print("📊 Expense Anomaly Detection scanning…")
    history = load_expense_history()
    prev_week = history.get('vendors', {})
    print(f"   Previous week baseline: {len(prev_week)} vendors")

    emails = get_this_week_emails(limit=limit)
    print(f"   Scanning up to {len(emails)} expense emails (limit={limit})…")

    this_week_expenses = []
    for i, m in enumerate(emails):
        exp = parse_expense_from_email(m)
        if exp:
            this_week_expenses.append(exp)
        # Throttle LLM calls to avoid rate limits
        if i % 5 == 4:
            time.sleep(BATCH_DELAY)

    this_week_totals = aggregate_weekly_spend(this_week_expenses)
    print(f"   This week: {len(this_week_totals)} vendors, ${sum(this_week_totals.values()):.2f} total")

    anomalies = []
    for vendor, current in this_week_totals.items():
        previous = prev_week.get(vendor, 0)
        if previous == 0:
            continue
        delta = (current - previous) / previous if previous else 0
        if delta >= ALERT_THRESHOLD:
            anomalies.append({
                'vendor': vendor,
                'previous': previous,
                'current': current,
                'delta_pct': round(delta * 100, 1),
            })

    if not dry_run:
        history['vendors'] = this_week_totals
        history['lastUpdate'] = datetime.datetime.utcnow().isoformat()
        save_expense_history(history)

    if anomalies:
        print(f"\n🚨 {len(anomalies)} expense anomalies detected:")
        for a in anomalies:
            print(f"   {a['vendor']}: +{a['delta_pct']}% (prev: ${a['previous']:.2f}, now: ${a['current']:.2f})")
        if not dry_run:
            try:
                lines = [f"🚨 Expense Anomaly Alert ({len(anomalies)} vendors):"]
                for a in anomalies[:10]:
                    lines.append(f"• {a['vendor']}: +{a['delta_pct']}% (${a['previous']:.2f} → ${a['current']:.2f})")
                message(action='send', target='telegram', message="\n".join(lines))
                print("   📡 Telegram alert sent")
            except Exception as e:
                print(f"   ❌ Telegram failed: {e}")
    else:
        print("\n✅ No significant expense anomalies this week.")

    if dry_run:
        print("💡 Add --execute to update baseline and send alerts.")

def main():
    parser = argparse.ArgumentParser(description='Expense Anomaly Detection')
    parser.add_argument('--execute', action='store_true', help='Send alerts & update baseline')
    parser.add_argument('--limit', type=int, default=DEFAULT_LIMIT, help='Max expense emails to parse')
    args = parser.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)

if __name__ == '__main__':
    main()
