#!/usr/bin/env python3
"""
Meeting Action Tracker - Extract tasks and action items from meeting emails

Automatically identifies action items, assigns owners, and creates follow-up reminders.
"""

import sys, json, re
from pathlib import Path
from datetime import datetime, timezone, timedelta
from typing import Dict, List, Optional

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, gmail_get, gmail_send_reply, telegram_send, calendar_list

# Action item patterns
ACTION_PATTERNS = [
    r'(?:action|task|todo|to-do)?\s*(?:items?)?[:\-]?\s*(.+?)(?:\n|$)',
    r'(?:assign(?:ed)?|responsible)\s*[:]?\s*(\w+)',
    r'(?:due|deadline|by)\s*[:]?\s*(\w+\s+\d+|\d{4}-\d{2}-\d{2})',
    r'@\w+',  # Mentions
]

# Action verbs that indicate tasks
ACTION_VERBS = [
    'review', 'prepare', 'send', 'create', 'update', 'schedule', 'follow up',
    'follow-up', 'research', 'draft', 'analyze', 'investigate', 'coordinate',
    'reach out', 'contact', 'call', 'setup', 'set up', 'implement', 'test'
]

# Priority keywords
PRIORITY_HIGH = ['urgent', 'asap', 'critical', 'immediately', 'today']
PRIORITY_MEDIUM = ['soon', 'this week', 'by friday', 'by monday']
PRIORITY_LOW = ['when possible', 'eventually', 'later']


def extract_tasks_from_text(text: str) -> List[Dict]:
    """Extract action items from meeting text."""
    tasks = []
    lines = text.split('\n')
    
    for line in lines:
        line_lower = line.lower().strip()
        
        # Check for action verbs
        for verb in ACTION_VERBS:
            if verb in line_lower:
                # Determine priority
                priority = 'medium'
                for word in PRIORITY_HIGH:
                    if word in line_lower:
                        priority = 'high'
                        break
                for word in PRIORITY_MEDIUM:
                    if word in line_lower:
                        priority = 'medium'
                        break
                
                # Extract potential owner from @mentions or "for [name]"
                owner = None
                mention = re.search(r'@(\w+)', line)
                if mention:
                    owner = mention.group(1)
                else:
                    for_match = re.search(r'(?:for|to)\s+(\w+)', line, re.I)
                    if for_match:
                        owner = for_match.group(1)
                
                # Extract due date
                due_date = None
                date_match = re.search(r'(?:by|due)\s+(\w+\s+\d+|\next\s+\w+|\d{4}-\d{2}-\d{2})', line, re.I)
                if date_match:
                    due_date = date_match.group(1)
                
                tasks.append({
                    'description': line.strip()[:200],
                    'priority': priority,
                    'owner': owner,
                    'due_date': due_date,
                    'source': 'email'
                })
                break
    
    return tasks


def extract_tasks_from_calendar() -> List[Dict]:
    """Extract action items from upcoming calendar events."""
    tasks = []
    events = calendar_list(days_ahead=7, limit=10)
    
    for event in events:
        desc = event.get('description', '') or ''
        summary = event.get('summary', '')
        
        # Look for prep tasks
        tasks.extend(extract_tasks_from_text(f"Prepare for meeting: {summary}. {desc}"))
    
    return tasks


def check_recent_meeting_emails(limit=20) -> List[Dict]:
    """Find recent meeting-related emails."""
    results = []
    
    # Search for meeting keywords
    queries = [
        'subject:meeting',
        'subject:"action items"',
        'subject:"follow up"',
        'subject:"next steps"',
        'subject:"action required"',
    ]
    
    seen_ids = set()
    for query in queries:
        emails = gmail_search(query, limit=10)
        for email in emails:
            if email['id'] not in seen_ids:
                msg = gmail_get(email['id'])
                headers = msg.get('payload', {}).get('headers', [])
                subject = next((h['value'] for h in headers if h['name'] == 'Subject'), '')
                sender = next((h['value'] for h in headers if h['name'] == 'From'), '')
                
                # Extract body
                body = ''
                try:
                    parts = msg.get('payload', {}).get('parts', [])
                    if parts:
                        import base64
                        body = base64.urlsafe_b64decode(
                            parts[0]['body']['data'] + '==='
                        ).decode('utf-8', errors='replace')[:2000]
                except:
                    pass
                
                results.append({
                    'email_id': email['id'],
                    'sender': sender,
                    'subject': subject,
                    'body': body
                })
                seen_ids.add(email['id'])
    
    return results


def generate_followup(tasks: List[Dict]) -> str:
    """Generate a follow-up email with action items."""
    if not tasks:
        return ""
    
    body = "Hi team,\n\nHere are the action items from our recent meeting:\n\n"
    
    for i, task in enumerate(tasks[:10], 1):
        priority_emoji = {'high': '🔴', 'medium': '🟡', 'low': '🟢'}.get(task['priority'], '⚪')
        body += f"{i}. {priority_emoji} {task['description']}"
        if task['owner']:
            body += f" (@{task['owner']})"
        if task['due_date']:
            body += f" - Due: {task['due_date']}"
        body += "\n"
    
    body += "\nPlease confirm your assignments.\n\nThanks!"
    return body


def main(execute=True, limit=20):
    """Main execution."""
    print("📋 Meeting Action Tracker - Extracting tasks...")
    
    all_tasks = []
    
    # Extract from recent meeting emails
    meeting_emails = check_recent_meeting_emails(limit)
    print(f"📧 Found {len(meeting_emails)} meeting-related emails")
    
    for email in meeting_emails[:limit]:
        tasks = extract_tasks_from_text(email['body'])
        for task in tasks:
            task['source_email'] = email['subject']
            task['source_sender'] = email['sender']
        all_tasks.extend(tasks)
    
    # Extract from calendar
    calendar_tasks = extract_tasks_from_calendar()
    all_tasks.extend(calendar_tasks)
    
    # Remove duplicates
    unique_tasks = []
    seen = set()
    for task in all_tasks:
        key = task['description'][:50]
        if key not in seen:
            seen.add(key)
            unique_tasks.append(task)
    
    print(f"\n📊 Extracted {len(unique_tasks)} action items:")
    for task in unique_tasks[:5]:
        owner = f" (@{task['owner']})" if task.get('owner') else ""
        print(f"  [{task['priority'].upper()}] {task['description'][:40]}...{owner}")
    
    if execute and unique_tasks:
        # Send summary
        summary = generate_followup(unique_tasks[:10])
        if summary:
            telegram_send(f"📋 Meeting Action Tracker: {len(unique_tasks)} tasks extracted")
    
    return unique_tasks


if __name__ == '__main__':
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument('--execute', action='store_true')
    parser.add_argument('--limit', type=int, default=20)
    args = parser.parse_args()
    main(execute=args.execute, limit=args.limit)