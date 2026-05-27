#!/usr/bin/env python3
"""
HubSpot Deal Watcher — Zion Tech Group

Monitors HubSpot CRM deal pipeline for stage changes and sends Telegram alerts.
Supports deal creation, stage updates, and closed-won/lost events.

Schedule: Every 30 minutes

Usage: python3 hubspot_deal_watcher.py [--execute] [--limit 20]
"""

import sys, os, re, json, datetime, argparse, urllib.request, urllib.parse
from pathlib import Path

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_create_draft_new, telegram_send

DB_FILE = WORKSPACE / 'zion.app' / 'data' / 'hubspot_deals.json'
API_KEY = os.getenv('HUBSPOT_API_KEY')
BASE_URL = 'https://api.hubapi.com'

def load_db():
    if DB_FILE.exists():
        return json.loads(DB_FILE.read_text())
    return {'seen_deals': {}, 'lastRun': None}

def save_db(db):
    DB_FILE.parent.mkdir(parents=True, exist_ok=True)
    DB_FILE.write_text(json.dumps(db, indent=2))

def fetch_recent_deals(limit=20):
    if not API_KEY:
        raise RuntimeError('HUBSPOT_API_KEY not set in .env')
    # Fetch deals created/updated recently (last 24h)
    since = (datetime.datetime.utcnow() - datetime.timedelta(hours=24)).strftime('%Y-%m-%dT%H:%M:%S.%fZ')
    url = (f"{BASE_URL}/crm/v3/objects/deals?"
           f"limit={limit}&properties=dealname,dealstage,amount,createdate,hs_lastmodifieddate")
    req = urllib.request.Request(url, headers={'Authorization': f'Bearer {API_KEY}'})
    try:
        with urllib.request.urlopen(req, timeout=15) as r:
            data = json.loads(r.read())
        return data.get('results', [])
    except Exception as e:
        print(f"   ❌ HubSpot fetch failed: {e}")
        return []

def track_stage_change(deal, db):
    did = deal.get('id')
    props = deal.get('properties', {})
    stage = props.get('dealstage', 'unknown')
    name = props.get('dealname', 'Unknown Deal')
    amount = props.get('amount', '0')
    modified = props.get('hs_lastmodifieddate', '')
    key = f"{stage}:{name}"
    # Notify on stage changes or new deals in Negotiation/Closed Won
    if stage in ['negotiation', 'closedwon', 'closedlost']:
        if key not in db.get('stage_alerts', {}):
            return True, f"Deal '{name}' moved to {stage} (${amount})"
    return False, ''

def cmd_run(dry_run=True, limit=20):
    db = load_db()
    db.setdefault('stage_alerts', {})
    deals = fetch_recent_deals(limit=limit)
    if not deals:
        print("✅ No recent HubSpot deal changes.")
        return

    alerts = []
    for deal in deals:
        do_alert, msg = track_stage_change(deal, db)
        if do_alert:
            alerts.append(msg)
            key = f"{deal['properties']['dealstage']}:{deal['properties']['dealname']}"
            db['stage_alerts'][key] = datetime.datetime.utcnow().isoformat()

    if not alerts:
        print(f"✅ Reviewed {len(deals)} deals — no new stage changes of interest.")
        return

    print(f"   🔔 {len(alerts)} deal alerts:")
    for a in alerts:
        print(f"      • {a}")

    if not dry_run:
        db['lastRun'] = datetime.datetime.utcnow().isoformat()
        save_db(db)
        # Send Telegram summary
        telegram_send(f"💼 HubSpot Deal Update:\n" + "\n".join(f"• {a}" for a in alerts))
        print("   ✅ Alerts sent to Telegram")
    else:
        print("💡 Add --execute to send Telegram alerts")

def main():
    p = argparse.ArgumentParser()
    p.add_argument('--execute', action='store_true')
    p.add_argument('--limit', type=int, default=20)
    args = p.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)

if __name__ == '__main__':
    main()
