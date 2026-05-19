#!/usr/bin/env python3
"""Client Portal Alerts - Monitor client portal for important updates"""

import sys, json
from pathlib import Path
from datetime import datetime, timezone

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE/'zion.app'/ 'commands'))

try:
    from google_workspace import gmail_search, gmail_get, telegram_send
except:
    def gmail_search(q, limit=20): return []
    def gmail_get(i): return {}
    def telegram_send(t): print(f"[TG] {t}")

ALERT_LOG = WORKSPACE / 'zion.app' / 'data' / 'client_alerts.json'

def check_client_portal_emails(limit=20):
    alerts = []
    emails = gmail_search('from:portal@ziontechgroup.com OR subject:"client portal"', limit=limit)
    for e in emails:
        try:
            msg = gmail_get(e['id'])
            alerts.append({'subject': msg.get('snippet', '')[:100], 'found': True})
        except: pass
    return alerts[:5]

def main(execute=True, limit=20):
    print("📊 Client Portal Alerts - Checking for updates...")
    alerts = check_client_portal_emails(limit)
    if ALERT_LOG.exists(): log = json.loads(ALERT_LOG.read_text())
    else: log = {'alerts': []}
    log['alerts'] = alerts
    ALERT_LOG.write_text(json.dumps(log, indent=2))
    if execute: telegram_send(f"📊 Client Portal: {len(alerts)} alerts")
    return alerts

if __name__ == '__main__':
    import argparse
    p = argparse.ArgumentParser()
    p.add_argument('--execute', action='store_true')
    args = p.parse_args()
    main(execute=args.execute)
