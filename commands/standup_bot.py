#!/usr/bin/env python3
"""
Daily Stand-up Bot — Zion Tech Group

Sends a Telegram message each morning (08:00) with:
  - Yesterday's completed tasks (calendar events marked done or that ended)
  - Today's upcoming meetings (next 24h)
  - Open high-priority emails (Priority-4/5, unread)
  - Active blockers (unreplied support threads >12h)

Usage:
  python3 standup_bot.py [--execute]   # Send Telegram (default dry-run)
"""

import sys, os, re, json, datetime, argparse
from pathlib import Path

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import calendar_list_events, gmail_search, gmail_get, telegram_send
from llm_client import chat

REPORT_DIR = WORKSPACE / 'zion.app' / 'reports' / 'standup'
REPORT_DIR.mkdir(parents=True, exist_ok=True)

def get_yesterday_completed(days_back: int = 1) -> list:
    """Find calendar events from yesterday that were marked as 'Done' or completed."""
    # We'll infer completion by events that ended yesterday and had 'Done' label or a completed task in our system
    # For now, look for events with 'Done' in title or description from yesterday
    target_day = (datetime.date.today() - datetime.timedelta(days=days_back))
    start = datetime.datetime.combine(target_day, datetime.time.min).isoformat() + 'Z'
    end = datetime.datetime.combine(target_day, datetime.time.max).isoformat() + 'Z'
    events = calendar_list_events(timeMin=start, timeMax=end, maxResults=20)
    completed = []
    for ev in events:
        summary = ev.get('summary','').lower()
        desc = ev.get('description','').lower()
        if 'done' in summary or 'completed' in summary or '✅' in summary:
            completed.append(ev.get('summary','Untitled'))
    return completed

def get_today_meetings() -> list:
    """Get calendar events starting in the next 24 hours."""
    now = datetime.datetime.utcnow().isoformat() + 'Z'
    future = (datetime.datetime.utcnow() + datetime.timedelta(hours=24)).isoformat() + 'Z'
    events = calendar_list_events(timeMin=now, timeMax=future, maxResults=15)
    meeting_lines = []
    for ev in events:
        start = ev.get('start',{}).get('dateTime','')[:16]
        summary = ev.get('summary','Untitled')
        meeting_lines.append(f"{start} — {summary}")
    return meeting_lines

def get_high_priority_emails(limit: int = 10) -> list:
    """Unread emails with Priority-4 or Priority-5 labels."""
    query = f'is:unread (label:Priority-4 OR label:Priority-5)'
    msgs = gmail_search(query, limit=limit)
    emails = []
    for m in msgs:
        headers = {h['name']: h['value'] for h in m.get('payload',{}).get('headers',[])}
        subject = headers.get('Subject','(no subject)')[:60]
        sender = headers.get('From','(unknown)')
        emails.append(f"{subject} — {sender}")
    return emails

def get_active_blockers() -> list:
    """Unreplied support threads older than 12h."""
    query = 'is:unread (label:Tech-Support OR label:Sales-Support)'
    threads = gmail_search(query, limit=20)
    blockers = []
    cutoff_ms = (datetime.datetime.utcnow().timestamp() - 12*3600) * 1000
    for t in threads:
        internalDate = int(t.get('internalDate', 0))
        if internalDate < cutoff_ms:
            snippet = t.get('snippet','')[:60]
            blockers.append(f"{snippet}… (unreplied >12h)")
    return blockers

def format_standup_message() -> str:
    sections = []

    # Yesterday
    completed = get_yesterday_completed()
    if completed:
        sections.append("✅ **Yesterday's Completed**")
        for c in completed[:5]:
            sections.append(f"  • {c}")
    else:
        sections.append("✅ **Yesterday's Completed** — None")

    # Today
    meetings = get_today_meetings()
    if meetings:
        sections.append("\n📅 **Today's Meetings**")
        for m in meetings[:8]:
            sections.append(f"  • {m}")
    else:
        sections.append("\n📅 **Today's Meetings** — None scheduled")

    # High-priority emails
    hps = get_high_priority_emails()
    if hps:
        sections.append("\n🚨 **High-Priority Emails** (unread)")
        for e in hps[:5]:
            sections.append(f"  • {e}")
    else:
        sections.append("\n🚨 **High-Priority Emails** — All clear")

    # Blockers
    blockers = get_active_blockers()
    if blockers:
        sections.append("\n⚠️ **Active Blockers** (unreplied support >12h)")
        for b in blockers[:5]:
            sections.append(f"  • {b}")
    else:
        sections.append("\n⚠️ **Active Blockers** — None")

    return "\n".join(sections)

def cmd_run(dry_run: bool):
    print("📋 Daily Stand-up Bot generating…")
    msg = format_standup_message()
    today = datetime.date.today().isoformat()
    report_path = REPORT_DIR / f"standup_{today}.md"
    report_path.write_text(msg)

    if dry_run:
        print("   [DRY-RUN] Would send Telegram:")
        print("---")
        print(msg)
        print("---")
        print("💡 Add --execute to send.")
        return

    try:
        telegram_send(msg)
        print("   📡 Telegram stand-up sent")
    except Exception as e:
        print(f"   ❌ Telegram failed: {e}")

    print(f"\n✅ Stand-up ready. Report: {report_path}")

def main():
    parser = argparse.ArgumentParser(description='Daily Stand-up Bot')
    parser.add_argument('--execute', action='store_true', help='Send Telegram (default dry-run)')
    parser.add_argument('--limit', type=int, default=10, help='Max priority emails to fetch')
    args = parser.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)

if __name__ == '__main__':
    main()
