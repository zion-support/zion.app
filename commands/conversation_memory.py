#!/usr/bin/env python3
"""
Conversation Memory & Follow-Up Manager
Tracks all email interactions and automates follow-ups
"""

import json
from pathlib import Path
from datetime import datetime, timedelta
from collections import defaultdict

WORKSPACE = Path('/root/.openclaw/workspace')
MEMORY_FILE = WORKSPACE / 'zion.app' / 'data' / 'conversation_memory.json'
FOLLOWUP_FILE = WORKSPACE / 'zion.app' / 'data' / 'follow_ups.json'

def load_memory():
    if MEMORY_FILE.exists():
        return json.loads(MEMORY_FILE.read_text())
    return {'threads': {}, 'senders': {}}

def save_memory(memory):
    MEMORY_FILE.parent.mkdir(parents=True, exist_ok=True)
    MEMORY_FILE.write_text(json.dumps(memory, indent=2))

def add_conversation(msg_id, sender, subject, category, action_taken):
    """Add conversation to memory"""
    memory = load_memory()
    sender_key = sender.split('@')[-1] if '@' in sender else sender
    
    # Thread tracking
    if msg_id not in memory['threads']:
        memory['threads'][msg_id] = {
            'sender': sender,
            'subject': subject,
            'category': category,
            'actions': [],
            'first_seen': datetime.now().isoformat()
        }
    
    memory['threads'][msg_id]['actions'].append({
        'action': action_taken,
        'timestamp': datetime.now().isoformat()
    })
    
    # Sender profile
    if sender_key not in memory['senders']:
        memory['senders'][sender_key] = {
            'total_emails': 0,
            'categories': defaultdict(int),
            'last_interaction': None,
            'preferred_style': 'formal',
            'language': 'pt'
        }
    
    memory['senders'][sender_key]['total_emails'] += 1
    memory['senders'][sender_key]['categories'][category] += 1
    memory['senders'][sender_key]['last_interaction'] = datetime.now().isoformat()
    
    save_memory(memory)

def get_sender_profile(sender):
    """Get sender communication style"""
    memory = load_memory()
    sender_key = sender.split('@')[-1] if '@' in sender else sender
    return memory['senders'].get(sender_key, {})

def schedule_followup(msg_id, hours=48):
    """Schedule a follow-up"""
    followups = []
    if FOLLOWUP_FILE.exists():
        followups = json.loads(FOLLOWUP_FILE.read_text())
    
    followups.append({
        'msg_id': msg_id,
        'due_at': (datetime.now() + timedelta(hours=hours)).isoformat(),
        'created_at': datetime.now().isoformat(),
        'status': 'pending'
    })
    
    FOLLOWUP_FILE.parent.mkdir(parents=True, exist_ok=True)
    FOLLOWUP_FILE.write_text(json.dumps(followups, indent=2))

def check_due_followups():
    """Get follow-ups that are due"""
    followups = []
    if FOLLOWUP_FILE.exists():
        followups = json.loads(FOLLOWUP_FILE.read_text())
    
    now = datetime.now().isoformat()
    return [f for f in followups if f['status'] == 'pending' and f['due_at'] <= now]

def suggest_response_strategy(sender, subject, snippet):
    """Suggest response approach based on history"""
    profile = get_sender_profile(sender)
    
    strategy = {
        'tone': 'formal',  # default
        'language': 'pt',   # default
        'template': 'default',
        'followup_hours': 48
    }
    
    if profile:
        # Use learned preferences
        strategy['tone'] = profile.get('preferred_style', 'formal')
        strategy['language'] = profile.get('language', 'pt')
        
        # Adjust follow-up timing
        if profile.get('total_emails', 0) > 5:
            strategy['followup_hours'] = 24  # More engaged senders
    
    return strategy

if __name__ == '__main__':
    print(f"📧 Memory entries: {len(load_memory().get('threads', {}))}")
    print(f"📊 Sender profiles: {len(load_memory().get('senders', {}))}")
    due = check_due_followups()
    print(f"⏰ Follow-ups due: {len(due)}")