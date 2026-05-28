#!/usr/bin/env python3
"""
Intelligent Email Responder V14 - Conversation Context + Follow-up Intelligence
Features:
- Full conversation thread analysis
- Follow-up detection and handling
- Multi-turn dialogue management
- Response timing optimization
"""

import sys, json
from pathlib import Path
from datetime import datetime, timezone, timedelta
from collections import defaultdict

WORKSPACE = Path('/root/.openclaw/workspace')

class ConversationIntelligenceV14:
    """Analyze full conversation threads"""
    
    def __init__(self):
        self.threads_file = WORKSPACE / 'zion.app' / 'data' / 'email_threads.json'
    
    def analyze_thread(self, thread_id, messages):
        """Analyze entire conversation thread"""
        return {
            'message_count': len(messages),
            'sender_count': len(set(m.get('from') for m in messages)),
            'last_response_side': self._determine_last_response(messages),
            'conversation_age_hours': self._calculate_age(messages),
            'needs_followup': self._needs_followup(messages),
            'outcome': self._detect_outcome(messages)
        }
    
    def _determine_last_response(self, messages):
        """Who sent the last message"""
        if messages:
            last = messages[-1]
            return 'us' if last.get('from_us', False) else 'them'
        return 'unknown'
    
    def _calculate_age(self, messages):
        """Age of conversation in hours"""
        if messages:
            dates = [datetime.fromisoformat(m.get('date', '')) for m in messages if m.get('date')]
            if dates:
                return (datetime.now(timezone.utc) - max(dates)).total_seconds() / 3600
        return 0
    
    def _needs_followup(self, messages):
        """Check if we need to follow up"""
        if len(messages) < 2:
            return False
        
        last = messages[-1]
        last_date = datetime.fromisoformat(last.get('date', datetime.now(timezone.utc).isoformat()))
        hours_since = (datetime.now(timezone.utc) - last_date.replace(tzinfo=timezone.utc)).total_seconds() / 3600
        
        # Follow up if we sent last message and it's been > 48 hours
        if last.get('from_us', False) and hours_since > 48:
            return True
        return False
    
    def _detect_outcome(self, messages):
        """Detect conversation outcome"""
        if not messages:
            return 'pending'
        
        # Check for booking confirmation keywords
        body_text = ' '.join(m.get('body', '') for m in messages).lower()
        
        if any(kw in body_text for kw in ['confirmado', 'reservado', 'agendado']):
            return 'converted'
        elif any(kw in body_text for kw in ['cancelado', 'desisti', 'não queremos']):
            return 'declined'
        elif len(messages) > 5 and 'them' in [self._determine_last_response([m]) for m in [messages[-1]]]:
            return 'ongoing'
        return 'pending'

class FollowUpEngineV14:
    """Smart follow-up system"""
    
    def __init__(self):
        self.followups_file = WORKSPACE / 'zion.app' / 'data' / 'follow_up_queue.json'
    
    def queue_follow_up(self, thread_id, delay_hours=24, priority='medium'):
        """Queue a follow-up"""
        if self.followups_file.exists():
            data = json.loads(self.followups_file.read_text())
        else:
            data = {'queue': []}
        
        data['queue'].append({
            'thread_id': thread_id,
            'scheduled_at': (datetime.now(timezone.utc) + timedelta(hours=delay_hours)).isoformat(),
            'priority': priority,
            'status': 'pending'
        })
        
        self.followups_file.write_text(json.dumps(data, indent=2))
        return True
    
    def get_due_followups(self):
        """Get follow-ups that are due"""
        if self.followups_file.exists():
            data = json.loads(self.followups_file.read_text())
            now = datetime.now(timezone.utc).isoformat()
            return [f for f in data.get('queue', []) 
                    if f['scheduled_at'] <= now and f['status'] == 'pending']
        return []

class MultiChannelCoordinatorV14:
    """Coordinate responses across channels"""
    
    def __init__(self):
        self.coordination_file = WORKSPACE / 'zion.app' / 'data' / 'channel_coordination.json'
    
    def log_response(self, thread_id, channel, response_text, intent):
        """Log response for coordination"""
        if self.coordination_file.exists():
            data = json.loads(self.coordination_file.read_text())
        else:
            data = {'responses': []}
        
        data['responses'].append({
            'thread_id': thread_id,
            'channel': channel,
            'response_text': response_text[:200],
            'intent': intent,
            'timestamp': datetime.now(timezone.utc).isoformat()
        })
        
        self.coordination_file.write_text(json.dumps(data, indent=2))
        return True
    
    def get_response_history(self, thread_id):
        """Get all responses for a thread"""
        if self.coordination_file.exists():
            data = json.loads(self.coordination_file.read_text())
            return [r for r in data.get('responses', []) if r['thread_id'] == thread_id]
        return []

if __name__ == '__main__':
    ci = ConversationIntelligenceV14()
    fu = FollowUpEngineV14()
    
    print("V14 Conversation Intelligence initialized")
    print(f"Pending follow-ups: {len(fu.get_due_followups())}")