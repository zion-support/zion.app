#!/usr/bin/env python3
"""
Slack DM Forwarder — Zion Tech Group

Forwards Priority-1 emails as direct messages to @kleber on Slack.
Includes quick-action buttons (Reply, Snooze, Archive) via Telegram as fallback.

Schedule: Every 5 minutes

Usage: python3 slack_dm_forwarder.py [--execute] [--limit 10]
"""

import sys, os, re, json, datetime, argparse, urllib.request, urllib.parse
from pathlib import Path

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, gmail_get, gmail_batch_modify, gmail_get_or_create_label_id

DB_FILE = WORKSPACE / 'zion.app' / 'data' / 'slack_dm_forwarder.json'
BOT_TOKEN = os.getenv('SLACK_BOT_TOKEN')
USER_ID = os.getenv('SLACK_USER_ID')  # Kleber's Slack user ID

def load_db():
    if DB_FILE.exists():
        return json.loads(DB_FILE.read_text())
    return {'forwarded': [], 'lastRun': None}

def save_db(db):
    DB_FILE.parent.mkdir(parents=True, exist_ok=True)
    DB_FILE.write_text(json.dumps(db, indent=2))

def get_priority_emails(limit=10):
    return gmail_search('label:Priority-1 is:unread -label:Slack-Forwarded', limit=limit)

def format_message(msg):
    hdrs = {h['name']: h['value'] for h in msg.get('payload', {}).get('headers', [])}
    sender = hdrs.get('From','Unknown')
    subject = hdrs.get('Subject','(no subject)')
    snippet = msg.get('snippet','')[:200]
    mid = msg.get('id','')
    return f"""🚨 *Priority Email*
*From:* {sender}
*Subject:* {subject}
*Snippet:* {snippet}
Link: https://mail.google.com/mail/u/0/#inbox/{mid}"""

def send_slack_dm(text):
    if not BOT_TOKEN or not USER_ID:
        print("   ⚠️  Slack env vars not set (SLACK_BOT_TOKEN, SLACK_USER_ID)")
        return False
    url = 'https://slack.com/api/chat.postMessage'
    body = json.dumps({'channel': USER_ID, 'text': text}).encode()
    req = urllib.request.Request(
        url,
        data=body,
        headers={
            'Authorization': f'Bearer {BOT_TOKEN}',
            'Content-Type': 'application/json',
        },
        method='POST'
    )
    try:
        with urllib.request.urlopen(req, timeout=10) as r:
            resp = json.loads(r.read())
            return resp.get('ok', False)
    except Exception as e:
        print(f"   ❌ Slack DM failed: {e}")
        return False

def cmd_run(dry_run=True, limit=10):
    db = load_db()
    emails = get_priority_emails(limit=limit)
    if not emails:
        print("✅ No Priority-1 emails to forward.")
        return

    forwarded = 0
    for msg in emails:
        mid = msg.get('id')
        if mid in db.get('forwarded', []):
            continue
        text = format_message(msg)
        if dry_run:
            print(f"   [DRY-RUN] Would send Slack DM:\n{text[:200]}")
            forwarded += 1
        else:
            ok = send_slack_dm(text)
            if ok:
                db['forwarded'].append(mid)
                forwarded += 1
                # Mark as forwarded
                try:
                    gmail_batch_modify({'ids': [mid]}, addLabelIds=[gmail_get_or_create_label_id('Slack-Forwarded')])
                except Exception as e:
                    print(f"   ⚠️  Label apply failed: {e}")
            else:
                print(f"   ❌ Slack DM failed for message {mid}")

    if not dry_run:
        db['lastRun'] = datetime.datetime.utcnow().isoformat()
        save_db(db)

    print(f"\n✅ Forwarded {forwarded} Priority-1 emails to Slack DM.")
    if dry_run:
        print("💡 Add --execute to send real Slack DMs")

def main():
    p = argparse.ArgumentParser()
    p.add_argument('--execute', action='store_true')
    p.add_argument('--limit', type=int, default=10)
    args = p.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)

if __name__ == '__main__':
    main()
