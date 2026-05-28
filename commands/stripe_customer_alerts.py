#!/usr/bin/env python3
"""
Stripe Customer Alerts — Zion Tech Group

Monitors Stripe for payment failures, subscription cancellations, and new customers.
Sends Telegram alerts and creates Gmail draft responses for common scenarios.

Schedule: Every 30 minutes

Usage: python3 stripe_customer_alerts.py [--execute] [--limit 20]
"""

import sys, os, re, json, datetime, argparse, urllib.request, urllib.parse
from pathlib import Path

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_create_draft, telegram_send

DB_FILE = WORKSPACE / 'zion.app' / 'data' / 'stripe_events.json'
API_KEY = os.getenv('STRIPE_API_KEY')
BASE_URL = 'https://api.stripe.com/v1'

def load_db():
    if DB_FILE.exists():
        return json.loads(DB_FILE.read_text())
    return {'processed_events': [], 'lastRun': None}

def save_db(db):
    DB_FILE.parent.mkdir(parents=True, exist_ok=True)
    DB_FILE.write_text(json.dumps(db, indent=2))

def fetch_recent_events(limit=20):
    if not API_KEY:
        raise RuntimeError('STRIPE_API_KEY not set in .env')
    # Get last 24h events
    since = int((datetime.datetime.utcnow() - datetime.timedelta(hours=24)).timestamp())
    url = (f"{BASE_URL}/events?"
           f"created[gte]={since}&limit={limit}")
    req = urllib.request.Request(
        url,
        headers={'Authorization': f'Bearer {API_KEY}'}
    )
    try:
        with urllib.request.urlopen(req, timeout=15) as r:
            data = json.loads(r.read())
        return data.get('data', [])
    except Exception as e:
        print(f"   ❌ Stripe fetch failed: {e}")
        return []

def categorize_event(ev):
    typ = ev.get('type', '')
    obj = ev.get('data', {}).get('object', {})
    # Payment failure
    if typ == 'invoice.payment_failed':
        cust = obj.get('customer', 'unknown')
        amount = obj.get('amount_paid', 0)
        return 'payment_failed', f"Payment failed: customer {cust}, amount {amount}"
    # Subscription deleted
    if typ == 'customer.subscription.deleted':
        cust = obj.get('customer', 'unknown')
        return 'subscription_cancelled', f"Subscription cancelled: {cust}"
    # New charge succeeded
    if typ == 'charge.succeeded':
        cust = obj.get('customer', 'unknown')
        amount = obj.get('amount', 0)
        return 'payment_succeeded', f"Payment succeeded: {cust} ${amount/100:.2f}"
    # New customer
    if typ == 'customer.created':
        cust = obj.get('id', 'unknown')
        return 'new_customer', f"New customer created: {cust}"
    return None, ''

def create_draft_response(category, event_data):
    """Create a Gmail draft for manual review/send."""
    subject_map = {
        'payment_failed': 'Payment Failure — Follow-up Required',
        'subscription_cancelled': 'Subscription Cancellation — Retention Action',
        'payment_succeeded': 'Payment Received — Thank You',
        'new_customer': 'Welcome New Customer',
    }
    body_map = {
        'payment_failed': ("Dear Customer,\n\nWe noticed your recent payment did not go through. "
                          "Please update your billing information to avoid service interruption.\n\n"
                          "Best regards,\nZion Tech Group"),
        'subscription_cancelled': ("We're sorry to see you go. "
                                  "If there's anything we can do to win you back, please let us know.\n\n"
                                  "Best regards,\nZion Tech Group"),
        'payment_succeeded': ("Thank you for your payment! "
                            "We appreciate your business.\n\n"
                            "Best regards,\nZion Tech Group"),
        'new_customer': ("Welcome to Zion Tech Group! "
                        "We're excited to have you on board. If you have any questions, don't hesitate to reach out.\n\n"
                        "Best regards,\nZion Tech Group"),
    }
    subj = subject_map.get(category, 'Stripe Notification')
    body = body_map.get(category, 'Please review this Stripe event.')
    # We'd need customer email; placeholders for now
    return subj, body

def cmd_run(dry_run=True, limit=20):
    db = load_db()
    events = fetch_recent_events(limit=limit)
    if not events:
        print("✅ No recent Stripe events.")
        return

    alerts = []
    drafts = 0
    for ev in events:
        ev_id = ev.get('id')
        if ev_id in db.get('processed_events', []):
            continue
        category, msg = categorize_event(ev)
        if category:
            alerts.append(msg)
            db['processed_events'].append(ev_id)
            # Create draft email for manual send (placeholder)
            if not dry_run:
                subj, body = create_draft_response(category, ev)
                # TODO: lookup customer email from Stripe customer object
                # For now, just note
                drafts += 1

    if not alerts:
        print(f"✅ Reviewed {len(events)} events — no actionable items.")
        return

    print(f"   🔔 {len(alerts)} Stripe alerts:")
    for a in alerts:
        print(f"      • {a}")

    if not dry_run:
        db['lastRun'] = datetime.datetime.utcnow().isoformat()
        save_db(db)
        telegram_send(f"💳 Stripe Alerts:\n" + "\n".join(f"• {a}" for a in alerts))
        print(f"   ✅ Alerts sent; {drafts} drafts created (placeholder)")
    else:
        print("💡 Add --execute to send alerts and create drafts (draft creation placeholder)")

def main():
    p = argparse.ArgumentParser()
    p.add_argument('--execute', action='store_true')
    p.add_argument('--limit', type=int, default=20)
    args = p.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)

if __name__ == '__main__':
    main()
