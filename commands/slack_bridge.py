#!/usr/bin/env python3
"""
Slack Bridge — Zion Tech Group

Forwards high-priority (Priority-4/5) unread emails to Slack #support.
Instant team visibility, faster response times.

Usage: python3 slack_bridge.py [--execute] [--limit N]
"""

import sys, os, re, json, datetime, argparse, urllib.request
from pathlib import Path

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, gmail_batch_modify, gmail_get_or_create_label_id

SLACK_WEBHOOK_URL = os.getenv('SLACK_WEBHOOK_URL')
BRIDGE_LABEL = 'Slack-Bridged'
DB_FILE = WORKSPACE / 'zion.app' / 'data' / 'slack_bridge.json'

def load_db():
    if DB_FILE.exists():
        return json.loads(DB_FILE.read_text())
    return {'bridged': []}

def save_db(db):
    DB_FILE.parent.mkdir(parents=True, exist_ok=True)
    DB_FILE.write_text(json.dumps(db, indent=2))

def format_slack(msg):
    color = "danger" if 'priority-5' in msg.get('labelIds', []) else "warning"
    # Extract subject/from from headers if needed
    headers = msg.get('payload', {}).get('headers', [])
    subject = next((h['value'] for h in headers if h['name']=='Subject'), '(no subject)')[:100]
    sender = next((h['value'] for h in headers if h['name']=='From'), 'unknown')
    snippet = msg.get('snippet', '')[:150]
    return {
        "attachments": [{
            "color": color,
            "title": subject,
            "title_link": f"https://mail.google.com/mail/u/0/#inbox/{msg.get('threadId','')}",
            "text": snippet,
            "fields": [
                {"title": "From", "value": sender, "short": True},
                {"title": "Priority", "value": "🔴 Critical" if 'priority-5' in msg.get('labelIds', []) else "🟠 High", "short": True}
            ],
            "footer": "Zion Automation",
            "ts": int(datetime.datetime.now().timestamp())
        }]
    }

def post_slack(payload):
    if not SLACK_WEBHOOK_URL:
        print("   ⚠️  SLACK_WEBHOOK_URL not set — skipping")
        return False
    try:
        req = urllib.request.Request(
            SLACK_WEBHOOK_URL,
            data=json.dumps(payload).encode(),
            headers={'Content-Type': 'application/json'}
        )
        with urllib.request.urlopen(req, timeout=8) as r:
            return r.status == 200
    except Exception as e:
        print(f"   ❌ Slack error: {e}")
        return False

def cmd_run(dry_run=True, limit=20):
    db = load_db()
    query = 'is:unread (label:Priority-4 OR label:Priority-5)'
    msgs = gmail_search(query, limit=limit)
    if not msgs:
        print("✅ No high-priority emails.")
        return

    label_id = None if dry_run else gmail_get_or_create_label_id(BRIDGE_LABEL)
    bridged = skipped = 0

    for msg in msgs:
        mid = msg.get('id')
        if mid in db['bridged']:
            skipped += 1
            continue
        if dry_run:
            print(f"   [DRY-RUN] Bridge → Slack: {msg.get('subject','')[:50]}")
            db['bridged'].append(mid)
            bridged += 1
            continue
        payload = format_slack(msg)
        if post_slack(payload):
            if label_id:
                try:
                    gmail_batch_modify([mid], add_labels=[label_id])
                except Exception as e:
                    print(f"   ⚠️  Label fail: {e}")
            db['bridged'].append(mid)
            bridged += 1
            print(f"   ✅ Bridged: {msg.get('snippet','')[:50]}")
        else:
            print(f"   ❌ Failed: {msg.get('snippet','')[:50]}")

    if not dry_run:
        db['lastRun'] = datetime.datetime.utcnow().isoformat()
        save_db(db)
    print(f"\n✅ Bridged {bridged}. Skipped {skipped}.")
    if dry_run:
        print("💡 Add --execute to post to Slack.")

def main():
    p = argparse.ArgumentParser()
    p.add_argument('--execute', action='store_true')
    p.add_argument('--limit', type=int, default=20)
    args = p.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)

if __name__ == '__main__':
    main()
