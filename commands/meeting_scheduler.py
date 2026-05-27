#!/usr/bin/env python3
"""
Smart Meeting Scheduler — Zion Tech Group

LLM analyzes an email thread to:
  - Detect meeting request intent
  - Extract attendees (emails)
  - Infer meeting duration (default 30m)
  - Suggest 3 optimal time slots (next 72h)
  - Generate draft calendar event with agenda

Usage:
  python3 meeting_scheduler.py --thread-id <threadId> [--execute]
  python3 meeting_scheduler.py --emailto "client@acme.com" --subject "..." --body "..."  # manual
"""

import sys, os, re, json, datetime, argparse
from pathlib import Path

WORKSPACE = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(WORKSPACE / 'commands'))
sys.path.insert(0, str(WORKSPACE))

from google_workspace import gmail_get, gmail_create_draft_new, telegram_send
from llm_client import chat

CALENDAR_DB = WORKSPACE / 'data' / 'meeting_scheduler.json'
KLEBER_EMAIL = 'kleber@ziontechgroup.com'

def load_calendar_db() -> dict:
    if CALENDAR_DB.exists():
        return json.loads(CALENDAR_DB.read_text())
    return {'proposals': [], 'lastRun': None}

def save_calendar_db(db: dict):
    CALENDAR_DB.parent.mkdir(parents=True, exist_ok=True)
    CALENDAR_DB.write_text(json.dumps(db, indent=2))

def get_thread_context(thread_id: str) -> dict:
    thread = gmail_get(thread_id=thread_id)
    messages = thread.get('messages', [])
    attendees = set()
    subject = ''
    body_snippets = []
    for msg in messages:
        headers = {h['name']: h['value'] for h in msg.get('payload',{}).get('headers',[])}
        from_hdr = headers.get('From','')
        m = re.search(r'<(.+?)>', from_hdr)
        if m:
            attendees.add(m.group(1).lower())
        elif '@' in from_hdr:
            attendees.add(from_hdr.strip().lower())
        if not subject:
            subject = headers.get('Subject','')
        snippet = msg.get('snippet','')
        body_snippets.append(snippet)
    return {'threadId': thread_id, 'subject': subject, 'attendees': list(attendees), 'body': '\n---\n'.join(body_snippets)}

def detect_meeting_intent(context: dict) -> bool:
    keywords = ['meeting', 'call', 'zoom', 'teams', 'schedule', 'available', 'time slot', 'calendly', 'when are you free']
    text = (context['subject'] + ' ' + context['body']).lower()
    return any(k in text for k in keywords)

def propose_times(context: dict) -> list:
    now = datetime.datetime.now(datetime.timezone.utc)
    prompt = (
        f"Based on this email thread, suggest 3 meeting time slots in the next 72 hours.\n"
        f"Current UTC time: {now.isoformat()}\n"
        f"Subject: {context['subject']}\n"
        f"Attendees: {', '.join(context['attendees'])}\n"
        f"Thread body:\n{context['body'][:1000]}\n\n"
        "Return JSON:\n"
        '{"slots": [{"start": "2026-05-15T14:00:00Z", "end": "2026-05-15T14:30:00Z", "reason": "Early EU friendly"}, ...]}\n'
        "Rules:\n"
        "- Times must be UTC (suffix Z)\n"
        "- Duration 30 minutes unless clearly longer requested\n"
        "- Business hours 09:00-18:00 UTC preferred\n"
        "- Provide exactly 3 distinct options"
    )
    try:
        resp = chat([{"role": "user", "content": prompt}], provider="auto", temperature=0.5)
        content = resp['content']
        match = re.search(r'\{[\s\S]*\}', content)
        if match:
            data = json.loads(match.group())
            return data.get('slots', [])
    except Exception as e:
        print(f"   ⚠️ LLM slot generation failed: {e}")
    return []

def create_meeting_draft(context: dict, slots: list) -> str:
    subject = f"Re: {context['subject']}" if not context['subject'].startswith('Re:') else context['subject']
    desc = "Proposed meeting times (UTC):\n"
    for i, s in enumerate(slots, 1):
        desc += f"{i}. {s['start']} — {s['end']}  ({s.get('reason','')})\n"
    desc += f"\nAttendees: {', '.join(context['attendees'])}\n"
    desc += f"\n--- Original thread ---\n{context['body'][:500]}"
    draft_id = gmail_create_draft_new(subject=f"📅 Meeting Proposal: {subject}", body=desc, to_addr=KLEBER_EMAIL)
    return draft_id

def cmd_run(dry_run: bool, thread_id: str = None, emailto: str = None, subject: str = None, body: str = None):
    print("📅 Smart Meeting Scheduler scanning…")
    if thread_id:
        context = get_thread_context(thread_id)
    elif emailto and subject and body:
        context = {'threadId': 'manual', 'subject': subject, 'attendees': [emailto], 'body': body}
    else:
        print("❌ Must provide either --thread-id or --emailto/--subject/--body")
        sys.exit(1)
    print(f"   Subject: {context['subject']}")
    print(f"   Attendees: {', '.join(context['attendees'])}")
    if not detect_meeting_intent(context):
        print("   ℹ️  No meeting intent detected — skipping")
        if dry_run:
            return
    slots = propose_times(context)
    if not slots:
        print("   ⚠️  No slots proposed")
        return
    print(f"   Proposed {len(slots)} time slots")
    if dry_run:
        print("   [DRY-RUN] Would create calendar draft:")
        for i, s in enumerate(slots, 1):
            print(f"     {i}. {s['start']} → {s['end']}")
        print("\n💡 Add --execute to create draft.")
        return
    draft_id = create_meeting_draft(context, slots)
    print(f"   ✅ Draft created: {draft_id}")
    try:
        telegram_send(f"📅 Meeting Proposal: {context['subject'][:50]}\nDraft: {draft_id}")
    except Exception as e:
        print(f"   ⚠️  Telegram skip: {e}")
    db = load_calendar_db()
    db['proposals'].append({'threadId': context['threadId'], 'subject': context['subject'], 'slots': slots, 'draftId': draft_id, 'timestamp': datetime.datetime.utcnow().isoformat()})
    db['lastRun'] = datetime.datetime.utcnow().isoformat()
    save_calendar_db(db)

def main():
    parser = argparse.ArgumentParser(description='Smart Meeting Scheduler')
    parser.add_argument('--thread-id', help='Gmail threadId to analyze')
    parser.add_argument('--emailto', help='Manual recipient email')
    parser.add_argument('--subject', help='Manual subject')
    parser.add_argument('--body', help='Manual body snippet')
    parser.add_argument('--execute', action='store_true', help='Create drafts (default dry-run)')
    args = parser.parse_args()
    cmd_run(dry_run=not args.execute, thread_id=args.thread_id, emailto=args.emailto, subject=args.subject, body=args.body)

if __name__ == '__main__':
    main()
