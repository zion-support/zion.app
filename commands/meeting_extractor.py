#!/usr/bin/env python3
"""
Meeting Extractor — Zion

Scans emails for meeting requests and suggests calendar events.
Helps automate scheduling by detecting meeting proposals in emails.

Usage:
  python3 meeting_extractor.py [--execute] [--limit N] [--hours N]

Options:
  --execute   Actually create calendar events (default: dry-run)
  --limit N   Maximum number of emails to process (default 20)
  --hours N   Look back N hours for unread emails (default 24)
"""

import sys, os, re, json, datetime, argparse
from pathlib import Path

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, gmail_get, gmail_get_or_create_label_id, extract_body_from_gmail_message
from google_workspace import calendar_list_events, calendar_create_event, calendar_get_freebusy
from llm_client import chat

# ── Configuration ────────────────────────────────────────────────────────────

DEFAULT_LIMIT = 20
DEFAULT_HOURS = 24
MEETING_LABEL = 'Meeting-Extracted'

PROMPT = """You are an AI assistant that detects meeting requests in emails.

Analyze the following email and determine if it contains a meeting request or proposal.
If it does, extract the meeting details and suggest a calendar event.

Look for:
- Explicit meeting requests: "Can we meet...", "Let's schedule...", "How about meeting..."
- Date/time proposals: "Tomorrow at 2pm", "Next Thursday", "June 15th at 10:00"
- Duration mentions: "for 30 minutes", "one hour meeting"
- Location or platform: "in the office", "via Zoom", "at the conference room"
- Attendees: "with the team", "just you and me", "including John and Sarah"

If a meeting request is found, return a JSON object:
{{
  "is_meeting_request": true,
  "suggested_title": "Brief, descriptive title for the meeting",
  "suggested_description": "Optional description or agenda",
  "suggested_start_time": "ISO 8601 timestamp (e.g., 2026-05-15T14:00:00)",
  "suggested_end_time": "ISO 8601 timestamp (e.g., 2026-05-15T14:30:00)",
  "suggested_location": "Location or platform (e.g., 'Zoom', 'Conference Room B', or null)",
  "attendees_hint": "Hint about who should attend (e.g., 'sender and recipient', 'team')"
}}

If no meeting request is found, return exactly: "NO_MEETING_REQUEST"

Email:
---BEGIN---
Subject: {subject}
From: {from_addr}
Date: {date}
{body_preview}
---END---

Analysis:"""

def fetch_recent_unread(hours: int, limit: int):
    """Fetch unread emails from the last N hours."""
    query = f'newer_than:{hours}h is:unread'
    # Reduce noise from automated senders
    query += ' -from:(no-reply@* noreply@* @github.com @linkedin.com @facebook.com @twitter.com)'
    msgs = gmail_search(query, limit=limit)
    return msgs

def get_email_details(msg_id: str) -> dict:
    raw = gmail_get(msg_id)
    headers = raw.get('payload', {}).get('headers', [])
    subject = next((h['value'] for h in headers if h['name'] == 'Subject'), '(no subject)')
    from_header = next((h['value'] for h in headers if h['name'] == 'From'), '')
    from_match = re.search(r'<(.+?)>', from_header)
    from_addr = from_match.group(1) if from_match else from_header
    date_header = next((h['value'] for h in headers if h['name'] == 'Date'), '')
    body = extract_body_from_gmail_message(raw)
    preview = body[:1000]  # Reasonable preview for meeting detection
    return {'id': msg_id, 'subject': subject, 'from': from_addr, 'date': date_header, 'body_preview': preview}

def analyze_email_for_meeting(email: dict) -> dict:
    """Ask LLM to analyze email for meeting requests."""
    prompt = PROMPT.format(
        subject=email['subject'],
        from_addr=email['from'],
        date=email['date'],
        body_preview=email['body_preview']
    )
    try:
        resp = chat([{'role': 'user', 'content': prompt}], provider='auto')
        result = resp['content'].strip()
        
        # Check if LLM indicated no meeting request
        if result.upper() == 'NO_MEETING_REQUEST':
            return None
            
        # Try to parse as JSON
        try:
            meeting_data = json.loads(result)
            # Validate required fields
            if meeting_data.get('is_meeting_request') is True:
                # Ensure required time fields are present
                if 'suggested_start_time' in meeting_data and 'suggested_end_time' in meeting_data:
                    return meeting_data
        except json.JSONDecodeError:
            pass
            
        # If we get here, the response wasn't valid JSON or didn't indicate a meeting
        return None
    except Exception as e:
        print(f"   [LLM Error] {e}", file=sys.stderr)
        return None

def suggest_calendar_times(start_str: str, end_str: str) -> tuple:
    """Convert suggested times to datetime objects, making reasonable assumptions if needed."""
    try:
        start_dt = datetime.datetime.fromisoformat(start_str.replace('Z', '+00:00'))
        end_dt = datetime.datetime.fromisoformat(end_str.replace('Z', '+00:00'))
        # Make timezone naive for comparison (we'll work in UTC)
        start_dt = start_dt.replace(tzinfo=None)
        end_dt = end_dt.replace(tzinfo=None)
        return start_dt, end_dt
    except Exception:
        # Fallback: try to parse common formats
        # For simplicity, we'll return None to indicate failure
        return None, None

def is_time_slot_free(start_dt: datetime.datetime, end_dt: datetime.datetime) -> bool:
    """Check if the suggested time slot is free on the primary calendar."""
    try:
        # Format for freebusy query
        time_min = start_dt.isoformat() + 'Z'
        time_max = end_dt.isoformat() + 'Z'
        
        freebusy = calendar_get_freebusy(time_min, time_max)
        # Check if primary calendar is free during this period
        primary_info = freebusy.get('primary', {})
        busy_periods = primary_info.get('busy', [])
        
        # If no busy periods, the time is free
        return len(busy_periods) == 0
    except Exception as e:
        print(f"   [Freebusy Error] {e}", file=sys.stderr)
        # If we can't check, assume it's not free to avoid double-booking
        return False

def create_calendar_event_from_suggestion(email: dict, meeting_data: dict) -> bool:
    """Create a calendar event based on the meeting suggestion."""
    try:
        # Parse the suggested times
        start_dt, end_dt = suggest_calendar_times(
            meeting_data['suggested_start_time'],
            meeting_data['suggested_end_time']
        )
        
        if start_dt is None or end_dt is None:
            print("   → Failed to parse suggested times")
            return False
            
        # Check if time slot is free
        if not is_time_slot_free(start_dt, end_dt):
            print("   → Time slot appears to be busy")
            # We could suggest alternative times, but for now we'll skip
            return False
            
        # Build the event object
        event_body = {
            'summary': meeting_data.get('suggested_title', 'Meeting'),
            'description': meeting_data.get('suggested_description', ''),
            'start': {
                'dateTime': start_dt.isoformat(),
                'timeZone': 'America/Sao_Paulo'  # Match the system timezone
            },
            'end': {
                'dateTime': end_dt.isoformat(),
                'timeZone': 'America/Sao_Paulo'
            }
        }
        
        # Add location if provided
        location = meeting_data.get('suggested_location')
        if location and location.lower() not in ['null', 'none', '']:
            event_body['location'] = location
            
        # Create the event
        event_id = calendar_create_event(event_body)
        if event_id:
            print(f"   ✅ Calendar event created (ID: {event_id})")
            return True
        else:
            print("   ❌ Failed to create calendar event")
            return False
            
    except Exception as e:
        print(f"   [Event Creation Error] {e}", file=sys.stderr)
        return False

def apply_meeting_label(msg_id: str) -> bool:
    """Apply the Meeting-Extracted label to the email."""
    try:
        label_id = gmail_get_or_create_label_id(MEETING_LABEL)
        gmail_batch_modify({'ids': [msg_id]}, addLabelIds=[label_id])
        return True
    except Exception as e:
        print(f"   [Label Error] {e}", file=sys.stderr)
        return False

def cmd_run(dry_run: bool, limit: int, hours: int):
    print(f"🔍 Scanning for meeting requests in unread emails from last {hours} hours (limit {limit})...")
    msgs = fetch_recent_unread(hours, limit)
    if not msgs:
        print("✅ No unread emails found in the specified time window.")
        return

    print(f"📧 Found {len(msgs)} unread emails to process.")
    meetings_found = 0
    events_created = 0
    skipped = 0
    errors = 0

    for msg_meta in msgs:
        email = get_email_details(msg_meta['id'])
        print(f"\n📨 Processing: {email['subject'][:50]}... from {email['from']}")
        meeting_data = analyze_email_for_meeting(email)
        if meeting_data is None:
            print("   → No meeting request detected")
            skipped += 1
            continue

        print(f"   📅 Meeting request detected!")
        print(f"      Title: {meeting_data.get('suggested_title', 'N/A')}")
        print(f"      Time: {meeting_data.get('suggested_start_time', 'N/A')} to {meeting_data.get('suggested_end_time', 'N/A')}")
        print(f"      Location: {meeting_data.get('suggested_location', 'N/A')}")

        if dry_run:
            print("   [DRY-RUN] Would create calendar event and apply label.")
            meetings_found += 1
            events_created += 1  # Count as would-be created
        else:
            if create_calendar_event_from_suggestion(email, meeting_data):
                print("   ✅ Calendar event created.")
                if apply_meeting_label(email['id']):
                    print("   🏷️  Meeting-Extracted label applied.")
                meetings_found += 1
                events_created += 1
            else:
                print("   ❌ Failed to create calendar event.")
                errors += 1

    print(f"\n📊 Summary: {meetings_found} meeting requests found, {events_created} calendar events {'would be ' if dry_run else ''}created, {skipped} skipped, {errors} errors.")
    if dry_run:
        print("💡 Add --execute to create actual calendar events.")

def main():
    parser = argparse.ArgumentParser(description='Meeting Extractor for Zion Tech Group')
    parser.add_argument('--execute', action='store_true', help='Create actual calendar events (default: dry-run)')
    parser.add_argument('--limit', type=int, default=DEFAULT_LIMIT, help=f'Max emails to process (default {DEFAULT_LIMIT})')
    parser.add_argument('--hours', type=int, default=DEFAULT_HOURS, help=f'Look back N hours for unread emails (default {DEFAULT_HOURS})')
    args = parser.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit, hours=args.hours)

if __name__ == '__main__':
    main()