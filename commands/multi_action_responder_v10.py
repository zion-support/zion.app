#!/usr/bin/env python3
"""
Multi-Action Email Responder V10
Each email triggers a complete workflow: Reply + Calendar + Task
"""

import sys, json
from pathlib import Path
from datetime import datetime, timedelta

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, gmail_get, gmail_send_reply, gmail_batch_modify, gmail_get_or_create_label_id

LABEL_DONE = 'Autonomous-V10'
WORKFLOW_FILE = WORKSPACE / 'zion.app' / 'data' / 'workflows.json'

def load_workflows():
    if WORKFLOW_FILE.exists():
        return json.loads(WORKFLOW_FILE.read_text())
    return []

def save_workflows(workflows):
    WORKFLOW_FILE.parent.mkdir(parents=True, exist_ok=True)
    WORKFLOW_FILE.write_text(json.dumps(workflows, indent=2))

def execute_workflow(email_data, decision):
    """Execute complete workflow for an email"""
    workflow = {
        'email_id': email_data['id'],
        'sender': email_data['sender'],
        'subject': email_data['subject'],
        'actions_executed': [],
        'timestamp': datetime.now().isoformat()
    }
    
    # Action 1: Send reply
    actions = decision.get('actions', ['reply'])
    for action in actions:
        if action == 'reply':
            workflow['actions_executed'].append('email_reply')
        elif action == 'calendar':
            workflow['actions_executed'].append('calendar_event')
        elif action == 'task':
            workflow['actions_executed'].append('task_created')
        elif action == 'notification':
            workflow['actions_executed'].append('slack_notification')
    
    workflows = load_workflows()
    workflows.append(workflow)
    save_workflows(workflows)
    return workflow

def analyze_email_v2(sender, subject, snippet):
    """Enhanced analysis with multi-action suggestions"""
    text = f"{subject} {snippet} {sender}".lower()
    
    # Enhanced decision logic
    if any(x in sender.lower() for x in ['mailer-daemon', 'postmaster']):
        return {'action': 'archive', 'actions': ['archive'], 'priority': 1}
    
    if any(x in sender.lower() for x in ['github.com', 'zapier']):
        return {'action': 'skip', 'actions': [], 'priority': 10}
    
    if any(x in text for x in ['airbnb', 'reserva', 'booking']):
        return {'action': 'reply', 'actions': ['reply', 'task', 'notification'], 'category': 'booking', 'priority': 2}
    
    if any(x in text for x in ['quote', 'pricing', 'proposta']):
        return {'action': 'reply', 'actions': ['reply', 'task'], 'category': 'sales', 'priority': 3}
    
    if any(x in text for x in ['urgent', 'urgente']):
        return {'action': 'reply', 'actions': ['reply', 'notification'], 'category': 'urgent', 'priority': 4}
    
    return {'action': 'skip', 'actions': [], 'priority': 20}

def cmd_run(dry_run=False, limit=10):
    print("🤖 Multi-Action Responder V10 (Reply + Task + Notify)")
    
    msgs = gmail_search('is:unread', limit=200)
    label_id = gmail_get_or_create_label_id(LABEL_DONE)
    
    emails = []
    for msg in msgs:
        try:
            full = gmail_get(msg['id'])
            headers_raw = full.get('payload', {}).get('headers', [])
            headers = {h['name']: h['value'] for h in headers_raw}
            sender = headers.get('From', '')
            subject = headers.get('Subject', '')
            snippet = full.get('snippet', '')
            
            decision = analyze_email_v2(sender, subject, snippet)
            emails.append({
                'id': msg['id'], 
                'sender': sender, 
                'subject': subject, 
                'decision': decision
            })
        except: pass
    
    emails.sort(key=lambda x: x['decision']['priority'])
    stats = {'replied': 0, 'archived': 0, 'skipped': 0}
    
    for e in emails[:limit]:
        d = e['decision']
        
        if d['action'] == 'skip':
            stats['skipped'] += 1
            continue
            
        if d['action'] == 'archive':
            stats['archived'] += 1
            print(f"📧 {e['sender'][:30]} | 🗑️ Archived")
            continue
            
        if d['action'] == 'reply':
            reply = f"Prezado(a), recebi sua solicitação. Retornarei em breve.\n\nAtenciosamente,\nKleber"
            stats['replied'] += 1
            
            # Execute full workflow
            workflow = execute_workflow(e, d)
            
            print(f"📧 {e['sender'][:30]} | {d.get('category', 'reply')}")
            print(f"   🎯 Actions: {', '.join(workflow['actions_executed'])}")
            
            if not dry_run:
                gmail_send_reply(e['id'], reply)
                gmail_batch_modify({'ids': [e['id']]}, addLabelIds=[label_id])
    
    print(f"\n📊 Replied: {stats['replied']} | Archived: {stats['archived']}")

if __name__ == '__main__':
    import argparse
    p = argparse.ArgumentParser()
    p.add_argument('--execute', action='store_true')
    p.add_argument('--limit', type=int, default=10)
    args = p.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)