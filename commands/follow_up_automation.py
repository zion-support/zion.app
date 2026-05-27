#!/usr/bin/env python3
"""
Follow-Up Automation System
Tracks replied emails and sends reminders if no response within 48h
"""

import json
from pathlib import Path
from datetime import datetime, timedelta

WORKSPACE = Path('/root/.openclaw/workspace')
FOLLOWUP_FILE = WORKSPACE / 'zion.app' / 'data' / 'follow_up_queue.json'

def load_followup_queue():
    if FOLLOWUP_FILE.exists():
        return json.loads(FOLLOWUP_FILE.read_text())
    return []

def save_followup_queue(queue):
    FOLLOWUP_FILE.parent.mkdir(parents=True, exist_ok=True)
    FOLLOWUP_FILE.write_text(json.dumps(queue, indent=2))

def add_to_followup(msg_id, sender, subject, replied_at, due_hours=48):
    """Add replied email to follow-up queue"""
    queue = load_followup_queue()
    due_at = (datetime.fromisoformat(replied_at) + timedelta(hours=due_hours)).isoformat()
    
    entry = {
        'msg_id': msg_id,
        'sender': sender,
        'subject': subject,
        'replied_at': replied_at,
        'due_at': due_at,
        'status': 'pending'
    }
    
    queue.append(entry)
    save_followup_queue(queue)
    return entry

def check_followups():
    """Check which follow-ups are due"""
    queue = load_followup_queue()
    now = datetime.now().isoformat()
    due = [e for e in queue if e['status'] == 'pending' and e['due_at'] <= now]
    return due

def mark_completed(msg_id):
    """Mark follow-up as completed"""
    queue = load_followup_queue()
    for entry in queue:
        if entry['msg_id'] == msg_id:
            entry['status'] = 'completed'
    save_followup_queue(queue)

def generate_followup_message(original_subject):
    """Generate follow-up message"""
    return f"""Prezado(a),

Apenas verificando se recebeu minha resposta anterior. 
Fico no aguardo para confirmar os detalhes.

Atenciosamente,
Kleber Garcia Alcatrão
Zion Tech Group"""

if __name__ == '__main__':
    due = check_followups()
    print(f"📧 {len(due)} follow-ups due")
    for f in due[:5]:
        print(f"  - {f['sender'][:30]}: {f['subject'][:40]}")