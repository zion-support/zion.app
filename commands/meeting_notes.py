#!/usr/bin/env python3
"""
Auto-Meeting Notes Generator — Zion Tech Group

After calendar events conclude, finds related email threads, extracts discussion,
and generates structured meeting minutes saved to Google Drive.

Usage:
  python3 meeting_notes.py [--execute] [--lookback-hours 1]  # Process events ending in last N hours
"""

import sys, os, re, json, datetime, argparse, urllib.request, urllib.parse
from pathlib import Path

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))

from google_workspace import gmail_search, gmail_get
from llm_client import chat

LOOKBACK_HOURS = 1
NOTES_FOLDER = 'Meeting Notes'

def now_utc():
    return datetime.datetime.utcnow()

def fetch_recent_events(hours: int = 1):
    """List calendar events that ended within the last `hours` hours."""
    from google_workspace import calendar_list_events
    end = now_utc()
    start = end - datetime.timedelta(hours=hours+24)  # look back wider, filter locally
    time_min = start.isoformat() + 'Z'
    time_max = end.isoformat() + 'Z'
    events = calendar_list_events(timeMin=time_min, timeMax=time_max, maxResults=50)
    # Filter: event must have ended before now - lookback
    cutoff = end - datetime.timedelta(hours=hours)
    recent = []
    for ev in events:
        end_str = ev.get('end', {}).get('dateTime') or ev.get('end', {}).get('date')
        if not end_str:
            continue
        try:
            end_dt = datetime.datetime.fromisoformat(end_str.replace('Z','+00:00'))
            if end_dt < cutoff:
                recent.append(ev)
        except Exception:
            continue
    return recent

def find_related_emails(event_summary: str, event_start: str) -> list:
    """Search inbox for threads with matching subject around event time."""
    # Get a window around event start
    start_dt = datetime.datetime.fromisoformat(event_start.replace('Z','+00:00'))
    window_start = (start_dt - datetime.timedelta(days=2)).strftime('%Y/%m/%d')
    window_end = (start_dt + datetime.timedelta(days=1)).strftime('%Y/%m/%d')
    # Gmail query: subject:"<summary>" newer:window_start older:window_end
    # But Gmail doesn't support newer/older date formats easily; use after/before
    query = f'subject:"{event_summary}" after:{window_start} before:{window_end}'
    msgs = gmail_search(query, limit=20)
    threads = {}
    for m in msgs:
        thread_id = m.get('threadId')
        if thread_id and thread_id not in threads:
            threads[thread_id] = m['id']
    return list(threads.values())

def extract_thread_content(message_ids: list) -> str:
    threads_text = []
    for msg_id in message_ids:
        msg = gmail_get(msg_id)
        headers = msg.get('payload', {}).get('headers', [])
        hdr = {h['name']: h['value'] for h in headers}
        sender = hdr.get('From','')
        subject = hdr.get('Subject','')
        body = extract_body_from_gmail_message(msg)[:500]
        threads_text.append(f"From: {sender}\nSubject: {subject}\n{body}")
    return "\n\n---\n\n".join(threads_text)

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

def generate_meeting_notes(event: dict, email_digest: str) -> str:
    summary = event.get('summary', 'Untitled')
    start = event.get('start', {}).get('dateTime','')
    end = event.get('end', {}).get('dateTime','')
    prompt = (
        f"You are a meeting assistant. Generate structured minutes for the event '{summary}'.\n"
        f"Start: {start}\nEnd: {end}\n\n"
        "Include sections:\n- Objective\n- Attendees (list from email From fields)\n- Discussion points (bullet list)\n- Decisions made\n- Action items (who + what)\n- Next steps\n\n"
        "Use the following email excerpts as the discussion record:\n\n"
        f"{email_digest}\n\n"
        "Output in Markdown format."
    )
    resp = chat([{"role": "user", "content": prompt}], provider="auto")
    return resp['content'].strip()

def save_notes_to_drive(notes_md: str, event_name: str, event_date: str) -> str:
    """Create .md file in reports/meeting-notes/ with date prefix."""
    safe_name = re.sub(r'[^a-zA-Z0-9_-]', '_', event_name)[:50]
    date_str = event_date[:10]
    filename = f"{date_str}_{safe_name}.md"
    folder = WORKSPACE / 'zion.app' / 'reports' / 'meeting_notes'
    folder.mkdir(parents=True, exist_ok=True)
    path = folder / filename
    path.write_text(notes_md)
    print(f"   📝 Notes saved to {path}")
    return str(path)

def cmd_run(dry_run: bool, lookback: int):
    print("📅 Auto-Meeting Notes scanning past events…")
    events = fetch_recent_events(hours=lookback)
    print(f"   Found {len(events)} recent events")

    processed = 0
    for ev in events:
        ev_id = ev.get('id')
        summary = ev.get('summary', 'Untitled')
        start_str = ev.get('start', {}).get('dateTime') or ev.get('start', {}).get('date','')
        end_str = ev.get('end', {}).get('dateTime') or ev.get('end', {}).get('date','')

        print(f"\n   📆 {summary}")
        # Find related emails
        msg_ids = find_related_emails(summary, start_str)
        if not msg_ids:
            print("      No related emails found; skipping.")
            continue
        print(f"      📧 Found {len(msg_ids)} related emails")

        digest = extract_thread_content(msg_ids)
        notes = generate_meeting_notes(ev, digest)

        if dry_run:
            print(f"      [DRY-RUN] Would save notes: {notes[:100]}…")
            processed += 1
            continue

        saved_path = save_notes_to_drive(notes, summary, end_str or start_str)
        # Optional: Telegram notification
        try:
            short = notes.split('\n')[0][:100]
            message(action='send', target='telegram',
                    message=f"📝 Meeting notes generated for: {summary}\n{short}…")
        except Exception:
            pass
        processed += 1

    print(f"\n✅ Processed {processed} events.")
    if dry_run:
        print("💡 Add --execute to write notes files.")

def main():
    parser = argparse.ArgumentParser(description='Auto-Meeting Notes Generator')
    parser.add_argument('--execute', action='store_true', help='Save notes (default dry-run)')
    parser.add_argument('--lookback-hours', type=int, default=LOOKBACK_HOURS, help='Hours back to consider finished events')
    args = parser.parse_args()
    cmd_run(dry_run=not args.execute, lookback=args.lookback_hours)

if __name__ == '__main__':
    main()
