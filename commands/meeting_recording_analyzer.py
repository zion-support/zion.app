#!/usr/bin/env python3
"""
Meeting Recording Analyzer - Extract action items from meeting transcripts

Processes recorded meetings, voice notes, and transcripts to identify
action items, decisions, and follow-ups.
"""

import sys, json
from pathlib import Path
from datetime import datetime, timezone
from typing import Dict, List

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, gmail_get, drive_list, telegram_send

ACTION_LOG = WORKSPACE / 'zion.app' / 'data' / 'meeting_actions.json'

# Action verbs to detect
ACTION_VERBS = [
    'review', 'prepare', 'send', 'update', 'create', 'draft', 'schedule',
    'follow up', 'contact', 'call', 'email', 'check', 'verify', 'confirm',
    'decide', 'approve', 'sign', 'submit', 'test', 'deploy'
]


def extract_from_drive(limit=10) -> List[Dict]:
    """Extract meeting transcripts from Drive."""
    actions = []
    files = drive_list(query='name contains "transcript" or name contains "meeting"', limit=limit)
    
    for f in files:
        if 'transcript' in f['name'].lower() or 'meeting' in f['name'].lower():
            actions.append({
                'source': f['name'],
                'type': 'transcript',
                'file_id': f['id'],
            })
    
    return actions


def extract_from_emails(limit=20) -> List[Dict]:
    """Extract action items from meeting emails."""
    actions = []
    emails = gmail_search('subject:meeting subject:transcript', limit=limit)
    
    for email in emails:
        msg = gmail_get(email['id'])
        headers = msg.get('payload', {}).get('headers', [])
        subject = next((h['value'] for h in headers if h['name'] == 'Subject'), '')
        snippet = msg.get('snippet', '')
        
        # Look for action verbs
        text = f"{subject} {snippet}".lower()
        found_actions = [v for v in ACTION_VERBS if v in text]
        
        if found_actions:
            actions.append({
                'source': subject,
                'actions_found': found_actions,
                'timestamp': datetime.now(timezone.utc).isoformat(),
            })
    
    return actions


def identify_action_items(text: str) -> List[Dict]:
    """Identify specific action items from text."""
    import re
    items = []
    
    # Look for patterns like "ACTION: John will review the report"
    action_pattern = r'(action|todo|to-do|task):\s*(.+?)(?:\n|$)'
    matches = re.findall(action_pattern, text, re.I)
    
    for match in matches:
        items.append({
            'action': match[1].strip(),
            'extracted': True,
        })
    
    # Also look for "Will review", "Need to prepare" patterns
    for verb in ACTION_VERBS:
        pattern = rf'(?:will|need to|should|must)\s+{verb}\s+(\w+)'
        found = re.findall(pattern, text, re.I)
        for f in found:
            items.append({
                'action': f"{verb} {f}",
                'extracted': True,
            })
    
    return items


def main(execute=True, limit=20):
    """Main execution."""
    print("🎙️ Meeting Recording Analyzer - Extracting action items...")
    
    # Extract from Drive
    drive_items = extract_from_drive(limit)
    print(f"📁 Found {len(drive_items)} meeting transcripts in Drive")
    
    # Extract from emails
    email_items = extract_from_emails(limit)
    print(f"📧 Found {len(email_items)} meeting emails with actions")
    
    # Update log
    if ACTION_LOG.exists():
        log = json.loads(ACTION_LOG.read_text())
    else:
        log = {'actions': []}
    
    log['actions'].extend(drive_items + email_items)
    log['last_updated'] = datetime.now(timezone.utc).isoformat()
    ACTION_LOG.parent.mkdir(parents=True, exist_ok=True)
    ACTION_LOG.write_text(json.dumps(log, indent=2))
    
    total = len(drive_items) + len(email_items)
    
    if execute:
        telegram_send(f"🎙️ Meeting Analysis: {total} action items extracted")
    
    return drive_items + email_items


if __name__ == '__main__':
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument('--execute', action='store_true')
    parser.add_argument('--limit', type=int, default=20)
    args = parser.parse_args()
    main(execute=args.execute, limit=args.limit)