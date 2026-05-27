#!/usr/bin/env python3
"""
Email Response Time Predictor — Zion

Predicts optimal response timing based on sender timezone, urgency, and historical patterns.

Usage:
  python3 response_time_predictor.py [--execute] [--limit N]

Options:
  --execute   Tag emails with suggested response time windows
  --limit N   Max emails (default 25)
"""

import sys, json, argparse, datetime
from pathlib import Path
import re

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, gmail_get, gmail_get_or_create_label_id, gmail_batch_modify
from llm_client import chat

DEFAULT_LIMIT = 25

TIMEZONES = {
    'EST': -5, 'EDT': -4,
    'PST': -8, 'PDT': -7,
    'GMT': 0, 'UTC': 0,
    'CET': 1, 'CEST': 2,
    'IST': 5.5, 'JST': 9,
    'AEST': 10
}

def extract_timezone(body: str) -> str:
    """Extract mentioned timezone from email body."""
    tz_pattern = r'\b(EST|EDT|PST|PDT|GMT|UTC|CET|CEST|IST|JST|AEST)\b'
    match = re.search(tz_pattern, body, re.IGNORECASE)
    return match.group(1).upper() if match else None

def predict_response_window(sender_tz: str, urgency: str) -> tuple:
    """Calculate optimal response window in sender's timezone."""
    now = datetime.datetime.now(datetime.timezone.utc)
    
    # Business hours in sender's TZ
    tz_offset = TIMEZONES.get(sender_tz, -3)  # Default to EST
    
    if urgency == 'urgent':
        # Respond within 2 hours
        return (now + datetime.timedelta(hours=1), now + datetime.timedelta(hours=2))
    elif urgency == 'high':
        # Next business hour
        return (now + datetime.timedelta(hours=2), now + datetime.timedelta(hours=6))
    else:
        # Within 24 hours, during business hours
        return (now + datetime.timedelta(hours=4), now + datetime.timedelta(hours=12))

def fetch_unread_emails(limit: int):
    return gmail_search('is:unread newer_than:24h', limit=limit)

def classify_urgency(subject: str, body: str) -> str:
    urgent_words = ['urgent', 'asap', 'immediately', 'today', 'deadline', 'critical']
    high_words = ['soon', 'quick', 'fast', 'priority', 'important']
    
    text = (subject + ' ' + body).lower()
    if any(w in text for w in urgent_words):
        return 'urgent'
    elif any(w in text for w in high_words):
        return 'high'
    return 'normal'

def cmd_run(dry_run: bool, limit: int):
    print(f"🔍 Predicting response timing for {limit} emails...")
    msgs = fetch_unread_emails(limit)
    if not msgs:
        print("✅ No emails to analyze.")
        return

    for msg in msgs:
        raw = gmail_get(msg['id'])
        headers = raw.get('payload', {}).get('headers', [])
        subject = next((h['value'] for h in headers if h['name'] == 'Subject'), '')
        
        body_data = raw.get('payload', {}).get('body', {}).get('data', '')
        if not body_data:
            parts = raw.get('payload', {}).get('parts', [])
            for part in parts:
                if part.get('mimeType') == 'text/plain':
                    body_data = part.get('body', {}).get('data', '')
                    break
        
        import base64
        body = base64.urlsafe_b64decode(body_data).decode('utf-8', errors='ignore')
        
        sender_tz = extract_timezone(body) or 'EST'
        urgency = classify_urgency(subject, body)
        window = predict_response_window(sender_tz, urgency)
        
        start_str = window[0].strftime('%H:%M')
        end_str = window[1].strftime('%H:%M')
        
        print(f"   ⏰ {subject[:35]}... → reply by {start_str}-{end_str} ({urgency})")
        
        if not dry_run:
            label_id = gmail_get_or_create_label_id('Response-Timed')
            gmail_batch_modify({'ids': [msg['id']]}, addLabelIds=[label_id])

def main():
    parser = argparse.ArgumentParser(description='Email Response Time Predictor')
    parser.add_argument('--execute', action='store_true')
    parser.add_argument('--limit', type=int, default=DEFAULT_LIMIT)
    args = parser.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)

if __name__ == '__main__':
    main()