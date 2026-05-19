#!/usr/bin/env python3
"""
Timezone Priority Escalator — Zion

Escalates email priorities based on sender timezone and after-hours timing.

Usage:
  python3 timezone_priority_escalator.py [--execute] [--limit N]

Options:
  --execute   Apply escalation labels
  --limit N   Max emails (default 30)
"""

import sys, json, argparse, datetime
from pathlib import Path
import re

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, gmail_get, gmail_get_or_create_label_id, gmail_batch_modify

DEFAULT_LIMIT = 30

TIMEZONE_PATTERNS = [
    (r'\b(\d{1,2})\s*(am|pm)\s*(est|edt|pst|pdt|gmt|utc)\b', 'en'),
    (r'\b(\d{1,2})[h:](\d{2})?\s*(est|edt|pst|pdt|gmt|utc)?\b', 'en'),
]

def extract_sender_timezone(sender: str, body: str) -> str:
    """Extract timezone info from sender email or body."""
    # Check for timezone mentions in body first
    tz_match = re.search(r'\b(est|edt|pst|pdt|gmt|utc|cet|cest|ist|jst|aest)\b', body, re.IGNORECASE)
    if tz_match:
        return tz_match.group(1).upper()
    
    # Default based on sender domain (simple heuristic)
    if '.au' in sender or 'sydney' in sender.lower():
        return 'AEST'
    elif '.jp' in sender or 'tokyo' in sender.lower():
        return 'JST'
    elif '.de' in sender or '.fr' in sender or '.nl' in sender:
        return 'CET'
    elif '.in' in sender or 'india' in sender.lower():
        return 'IST'
    
    return 'EST'  # Default

def should_escalate(sender_tz: str, received_time: datetime.datetime) -> bool:
    """Check if email should be escalated based on time mismatch."""
    tz_offsets = {
        'EST': -5, 'EDT': -4, 'PST': -8, 'PDT': -7,
        'GMT': 0, 'UTC': 0, 'CET': 1, 'CEST': 2,
        'IST': 5.5, 'JST': 9, 'AEST': 10
    }
    
    offset = tz_offsets.get(sender_tz, -5)
    # Convert to sender's local time
    sender_hour = (received_time.hour + offset) % 24
    
    # If sender's business hours (9-17), it's normal timing
    # If outside, check if it's urgent
    return sender_hour < 9 or sender_hour > 17

def cmd_run(dry_run: bool, limit: int):
    print(f"🔍 Checking timezone escalation for {limit} emails...")
    msgs = gmail_search('is:unread newer_than:48h', limit=limit)
    if not msgs:
        print("✅ No emails to process.")
        return

    escalated = 0
    for msg in msgs:
        raw = gmail_get(msg['id'])
        headers = raw.get('payload', {}).get('headers', [])
        subject = next((h['value'] for h in headers if h['name'] == 'Subject'), '')
        sender = next((h['value'] for h in headers if h['name'] == 'From'), '')
        
        body_data = raw.get('payload', {}).get('body', {}).get('data', '')
        if not body_data:
            parts = raw.get('payload', {}).get('parts', [])
            for part in parts:
                if part.get('mimeType') == 'text/plain':
                    body_data = part.get('body', {}).get('data', '')
                    break
        
        import base64, email.utils
        body = base64.urlsafe_b64decode(body_data).decode('utf-8', errors='ignore')
        
        sender_tz = extract_sender_timezone(sender, body)
        received = datetime.datetime.now()  # Simplified
        
        # Check for urgency keywords
        urgent = any(w in subject.lower() for w in ['urgent', 'asap', 'critical', 'deadline'])
        
        if urgent or should_escalate(sender_tz, received):
            print(f"   ⚡ Escalate: {subject[:40]}... (tz: {sender_tz})")
            escalated += 1
            if not dry_run:
                label_id = gmail_get_or_create_label_id('Escalated-Timezone')
                gmail_batch_modify({'ids': [msg['id']]}, addLabelIds=[label_id])
        else:
            print(f"   ✓ Normal: {subject[:40]}... (tz: {sender_tz})")

    print(f"\n📊 Escalated {escalated} emails based on timezone.")

def main():
    parser = argparse.ArgumentParser(description='Timezone Priority Escalator')
    parser.add_argument('--execute', action='store_true')
    parser.add_argument('--limit', type=int, default=DEFAULT_LIMIT)
    args = parser.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)

if __name__ == '__main__':
    main()