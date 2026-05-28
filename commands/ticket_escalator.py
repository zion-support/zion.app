#!/usr/bin/env python3
"""
Support Ticket Escalation — Zion Tech Group

Monitors unread support emails (Tech-Support / Sales-Support).
Escalates based on thread age:
  - >24h   → Escalation-Level1 label + Telegram notify
  - >72h   → Escalation-Critical label + CEO alert
Archives escalated threads to Escalation-Archive.

Usage: python3 ticket_escalator.py [--execute] [--limit N]
"""

import sys, os, re, json, datetime, argparse
from pathlib import Path

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, gmail_batch_modify, gmail_get_or_create_label_id, telegram_send

ESC_LEVEL1 = 'Escalation-Level1'
ESC_CRITICAL = 'Escalation-Critical'
ESC_ARCHIVE = 'Escalation-Archive'
HOURS_LEVEL1 = 24
HOURS_CRITICAL = 72
DB_FILE = WORKSPACE / 'zion.app' / 'data' / 'ticket_escalations.json'
QUERY = 'is:unread (label:Tech-Support OR label:Sales-Support)'

def load_db():
    if DB_FILE.exists():
        return json.loads(DB_FILE.read_text())
    return {'escalated': []}

def save_db(db):
    DB_FILE.parent.mkdir(parents=True, exist_ok=True)
    DB_FILE.write_text(json.dumps(db, indent=2))

def get_thread_earliest_timestamp(thread_id):
    msgs = gmail_search(f'thread:{thread_id}', max_results=1)
    if msgs:
        return int(msgs[0].get('internalDate', 0))
    return 0

def cmd_run(dry_run=True, limit=30):
    print("🚨 Support Ticket Escalation scanning…")
    threads = gmail_search(QUERY, limit=limit)
    print(f"   Scanning {len(threads)} threads (limit={limit})")

    db = load_db()
    escalated_l1 = escalated_crit = 0
    skipped = 0

    for t in threads:
        thread_id = t.get('threadId')
        if thread_id in db['escalated']:
            skipped += 1
            continue

        earliest_ms = get_thread_earliest_timestamp(thread_id)
        if earliest_ms == 0:
            skipped += 1
            continue

        age_hours = (datetime.datetime.utcnow().timestamp() * 1000 - earliest_ms) / (1000*60*60)

        if age_hours >= HOURS_CRITICAL:
            need_labels = [ESC_LEVEL1, ESC_CRITICAL, ESC_ARCHIVE]
            level = 'CRITICAL'
        elif age_hours >= HOURS_LEVEL1:
            need_labels = [ESC_LEVEL1, ESC_ARCHIVE]
            level = 'Level1'
        else:
            continue

        subject = t.get('snippet', '')[:60]
        print(f"   ⚠️  Escalate {level}: {subject} ({age_hours:.0f}h)")

        if dry_run:
            if level == 'CRITICAL':
                escalated_crit += 1
            else:
                escalated_l1 += 1
            continue

        label_ids = [gmail_get_or_create_label_id(l) for l in need_labels]
        try:
            gmail_batch_modify([thread_id], addLabelIds=label_ids, removeLabelIds=[])
            if level == 'CRITICAL':
                escalated_crit += 1
                try:
                    telegram_send(f"🚨 CRITICAL Support Escalation — {subject}\nThread {thread_id[:8]}… unreplied {age_hours:.0f}h")
                except Exception:
                    pass
            else:
                escalated_l1 += 1
                try:
                    telegram_send(f"🚨 Support Escalation (Level1) — {subject}\nThread {thread_id[:8]}… {age_hours:.0f}h")
                except Exception:
                    pass
            db['escalated'].append(thread_id)
            print(f"   ✅ Applied {need_labels}")
        except Exception as e:
            print(f"   ❌ Label failed {thread_id}: {e}")

    if not dry_run:
        db['lastRun'] = datetime.datetime.utcnow().isoformat()
        save_db(db)

    print(f"\n✅ Escalated: {escalated_l1} Level1, {escalated_crit} Critical. Skipped {skipped}.")
    if dry_run:
        print("💡 Add --execute to apply labels and send alerts.")

def main():
    p = argparse.ArgumentParser()
    p.add_argument('--execute', action='store_true')
    p.add_argument('--limit', type=int, default=30)
    args = p.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)

if __name__ == '__main__':
    main()
