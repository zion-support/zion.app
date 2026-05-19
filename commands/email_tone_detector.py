#!/usr/bin/env python3
"""
Email Tone Detector — Zion

Detects the emotional tone of emails.

Usage:
  python3 email_tone_detector.py [--execute] [--limit N]

Options:
  --execute   Detect tones
  --limit N   Max emails (default 30)
"""

import sys, json, argparse
from pathlib import Path

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, gmail_get_or_create_label_id, gmail_batch_modify

DEFAULT_LIMIT = 30

TONE_KEYWORDS = {
    'formal': ['dear', 'regards', 'sincerely', 'thank you for'],
    'casual': ['hey', 'hi there', 'thanks', 'cheers'],
    'urgent': ['urgent', 'asap', 'immediately', 'today'],
    'friendly': ['great', 'wonderful', 'excited', 'looking forward'],
    'professional': ['please review', 'feedback requested', 'per our discussion']
}

def cmd_run(dry_run: bool, limit: int):
    print(f"🎭 Detecting tone in {limit} emails...")
    msgs = gmail_search('is:unread newer_than:24h', limit=limit)
    
    tones = {}
    for msg in msgs[:limit]:
        headers = msg.get('payload', {}).get('headers', [])
        subject = next((h['value'] for h in headers if h['name'] == 'Subject'), '')
        
        text = subject.lower()
        detected = 'neutral'
        max_matches = 0
        
        for tone, keywords in TONE_KEYWORDS.items():
            matches = sum(1 for kw in keywords if kw in text)
            if matches > max_matches:
                max_matches = matches
                detected = tone
        
        tones[detected] = tones.get(detected, 0) + 1
        
        if not dry_run:
            label_id = gmail_get_or_create_label_id(f'Tone-{detected}')
            gmail_batch_modify({'ids': [msg['id']]}, addLabelIds=[label_id])
    
    print(f"\n📊 Tones detected: {tones}")

def main():
    parser = argparse.ArgumentParser(description='Email Tone Detector')
    parser.add_argument('--execute', action='store_true')
    parser.add_argument('--limit', type=int, default=DEFAULT_LIMIT)
    args = parser.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)

if __name__ == '__main__':
    main()