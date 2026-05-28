#!/usr/bin/env python3
"""
Emotional Intelligence Detector — Zion

Detects emotions in emails and flags those requiring empathetic responses.
Identifies stress, frustration, excitement, disappointment, etc.

Usage:
  python3 emotional_intelligence_detector.py [--execute] [--limit N]

Options:
  --execute   Apply "Emotion-Flagged" label to relevant emails
  --limit N   Max emails to process (default 30)
"""

import sys, json, argparse
from pathlib import Path

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, gmail_get, gmail_get_or_create_label_id, gmail_batch_modify
from llm_client import chat

DEFAULT_LIMIT = 30

PROMPT = """Analyze the emotional tone of this email. Return ONE word: frustrated, stressed, disappointed, excited, happy, concerned, neutral, angry, confused, or satisfied.

Also indicate if urgent empathetic response needed: YES or NO.

Format: emotion:urgency

Email Subject: {subject}
Body: {body}

Analysis:"""

def fetch_recent_emails(limit: int):
    query = 'is:unread newer_than:48h'
    return gmail_search(query, limit=limit)

def analyze_emotion(subject: str, body: str) -> tuple:
    prompt = PROMPT.format(subject=subject, body=body[:1000])
    try:
        resp = chat([{'role': 'user', 'content': prompt}], max_tokens=20)
        result = resp['content'].strip().lower()
        parts = result.split(':')
        emotion = parts[0].strip()
        urgency = 'yes' in parts[1] if len(parts) > 1 else False
        return emotion, urgency
    except Exception as e:
        print(f"   [LLM Error] {e}", file=sys.stderr)
        return 'neutral', False

def cmd_run(dry_run: bool, limit: int):
    print(f"🔍 Scanning {limit} emails for emotional intelligence signals...")
    msgs = fetch_recent_emails(limit)
    if not msgs:
        print("✅ No emails to analyze.")
        return

    flagged = 0
    for msg in msgs:
        raw = gmail_get(msg['id'])
        headers = raw.get('payload', {}).get('headers', [])
        subject = next((h['value'] for h in headers if h['name'] == 'Subject'), '')
        
        # Extract body
        body_data = raw.get('payload', {}).get('body', {}).get('data', '')
        if not body_data:
            parts = raw.get('payload', {}).get('parts', [])
            for part in parts:
                if part.get('mimeType') == 'text/plain':
                    body_data = part.get('body', {}).get('data', '')
                    break
        
        import base64
        body = base64.urlsafe_b64decode(body_data).decode('utf-8', errors='ignore')[:800]
        
        emotion, urgency = analyze_emotion(subject, body)
        
        if urgency:
            print(f"   ⚠️ {subject[:40]}... [emotion: {emotion}, needs empathy]")
            flagged += 1
            if not dry_run:
                label_id = gmail_get_or_create_label_id('Emotion-Flagged')
                gmail_batch_modify({'ids': [msg['id']]}, addLabelIds=[label_id])
        else:
            print(f"   ✓ {subject[:40]}... [emotion: {emotion}]")

    print(f"\n📊 Flagged {flagged} emails requiring empathetic response.")

def main():
    parser = argparse.ArgumentParser(description='Emotional Intelligence Detector')
    parser.add_argument('--execute', action='store_true')
    parser.add_argument('--limit', type=int, default=DEFAULT_LIMIT)
    args = parser.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)

if __name__ == '__main__':
    main()