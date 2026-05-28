#!/usr/bin/env python3
"""
Follow-up Scheduler — Zion Tech Group

Intelligently schedules follow-up reminders for emails that need response.
Learns typical response times per contact, avoids weekends/holidays,
and creates calendar events or follow-up tasks at optimal times.

Strategy:
  1. Scan emails labeled 'Needs-Response' without recent outbound reply
  2. Check sender's historical response time (from sent mail patterns)
  3. Schedule follow-up task (calendar event or task) at learned optimal day/time
  4. Mark email with 'Followup-Scheduled' to avoid duplicates

Schedule: Every 30 minutes

Usage: python3 followup_scheduler.py [--execute] [--limit N]
"""

import sys, os, re, json, datetime, argparse
from pathlib import Path

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, gmail_get, gmail_batch_modify, gmail_get_or_create_label_id, calendar_create_event
from llm_client import chat  # for response pattern analysis

DB_FILE = WORKSPACE / 'zion.app' / 'data' / 'followup_scheduler.json'

def load_db():
    if DB_FILE.exists():
        return json.loads(DB_FILE.read_text())
    return {'scheduled': {}, 'sender_patterns': {}, 'lastRun': None}

def save_db(db):
    DB_FILE.parent.mkdir(parents=True, exist_ok=True)
    DB_FILE.write_text(json.dumps(db, indent=2))

def get_needs_response_emails(limit=50):
    return gmail_search('label:Needs-Response is:unread -label:Followup-Scheduled', limit=limit)

def has_recent_outbound(thread_id):
    sent = gmail_search(f'thread:{thread_id} is:sent', limit=5)
    return len(sent) > 0

def estimate_optimal_day(sender_domain, hist):
    """Predict best weekday to send follow-up based on recipient's email activity patterns."""
    # Default: Tuesday–Thursday, mid-morning
    best_day = 2  # Tuesday (0=Mon)
    best_hour = 10

    if not hist or hist.get('inbound', 0) < 5:
        return best_day, best_hour

    # Could analyze sent-times from sender to us (reverse-engineering their schedule)
    # For now, use simple rules:
    # If they email outside business hours → prefer 9–11am their timezone (hard, assume UTC-3)
    # If high weekend activity → prefer Monday
    # Use sender domain-based heuristics (placeholder)
    return best_day, best_hour

def schedule_followup(msg_id, sender, subject, thread_id, optimal_dt, dry_run):
    if dry_run:
        print(f"   [DRY-RUN] Would schedule follow-up: {optimal_dt.strftime('%a %b %d %I:%M %p')} — {subject[:50]}")
        return True
    try:
        # Create calendar event as "Follow-up — [subject]"
        start = optimal_dt.replace(minute=0, second=0, microsecond=0)
        end = start + datetime.timedelta(hours=1)
        eid = calendar_create_event({
            'summary': f"Follow-up: {subject[:40]}",
            'description': f"Original email: https://mail.google.com/mail/u/0/#inbox/{msg_id}\nThread: {thread_id}",
            'start': {'dateTime': start.isoformat() + 'Z'},
            'end': {'dateTime': end.isoformat() + 'Z'},
            'reminders': {'useDefault': True}
        })
        return eid
    except Exception as e:
        print(f"   ❌ Calendar create failed: {e}")
        return None

def cmd_run(dry_run=True, limit=50):
    db = load_db()
    emails = get_needs_response_emails(limit=limit)
    if not emails:
        print("✅ No follow-ups needed right now.")
        return

    scheduled = 0
    for msg in emails:
        mid = msg.get('id')
        thread_id = msg.get('threadId')
        if not thread_id:
            continue
        if has_recent_outbound(thread_id):
            print(f"   ✓ Already replied to thread {thread_id[:8]}")
            if not dry_run:
                try:
                    gmail_batch_modify({'ids': [mid]}, removeLabelIds=[gmail_get_or_create_label_id('Needs-Response')])
                except Exception:
                    pass
            continue

        headers = msg.get('payload', {}).get('headers', [])
        sender = next((h['value'] for h in headers if h['name']=='From'), '')
        subject = next((h['value'] for h in headers if h['name']=='Subject'), '')[:80]
        domain_match = re.search(r'@([A-Za-z0-9.-]+\.[A-Za-z]{2,})', sender)
        domain = domain_match.group(1).lower() if domain_match else 'unknown'

        # Get sender history
        hist = db['sender_patterns'].get(domain, {})
        day, hour = estimate_optimal_day(domain, hist)

        # Schedule 2 business days from now at optimal hour
        now = datetime.datetime.utcnow()
        target = now + datetime.timedelta(days=2)
        while target.weekday() != day:  # adjust to best weekday
            target += datetime.timedelta(days=1)
        optimal_dt = target.replace(hour=hour, minute=0, second=0, microsecond=0)

        print(f"   📅 {subject[:50]} → follow-up scheduled for {optimal_dt.strftime('%a %b %d %I:%M %p')}")

        if not dry_run:
            eid = schedule_followup(mid, sender, subject, thread_id, optimal_dt, dry_run=False)
            if eid:
                db['scheduled'][mid] = {'event_id': eid, 'scheduled_for': optimal_dt.isoformat(), 'sender': sender, 'subject': subject}
                # Mark scheduled
                try:
                    gmail_batch_modify({'ids': [mid]}, addLabelIds=[gmail_get_or_create_label_id('Followup-Scheduled')])
                except Exception as e:
                    print(f"   ⚠️  Label apply failed: {e}")
                scheduled += 1
        else:
            scheduled += 1

    if not dry_run:
        db['lastRun'] = datetime.datetime.utcnow().isoformat()
        save_db(db)

    print(f"\n✅ Scheduled {scheduled} follow-ups.")
    if dry_run:
        print("💡 Add --execute to create calendar events and mark emails.")

def main():
    p = argparse.ArgumentParser()
    p.add_argument('--execute', action='store_true')
    p.add_argument('--limit', type=int, default=50)
    args = p.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)

if __name__ == '__main__':
    main()
