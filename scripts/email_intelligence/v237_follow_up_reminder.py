#!/usr/bin/env python3
"""
V237: Email Follow-up Reminder Engine
Tracks pending responses and sends intelligent reminders based on urgency and context.
CRITICAL: Enforces reply-all for multi-recipient emails.
"""

import json
from datetime import datetime, timedelta
from typing import Dict, List, Optional

class EmailFollowUpReminder:
    def __init__(self):
        self.reminder_rules = {
            'urgent': {'hours': 2, 'escalate_after': 4},
            'high': {'hours': 8, 'escalate_after': 24},
            'medium': {'hours': 24, 'escalate_after': 72},
            'low': {'hours': 72, 'escalate_after': 168}
        }
        self.pending_responses = {}
    
    def detect_urgency(self, email_data: Dict) -> str:
        """Detect email urgency from content"""
        subject = email_data.get('subject', '').lower()
        body = email_data.get('body', '').lower()
        combined = f"{subject} {body}"
        
        if any(kw in combined for kw in ['urgent', 'asap', 'emergency', 'critical', 'immediately']):
            return 'urgent'
        elif any(kw in combined for kw in ['important', 'soon', 'quickly', 'priority']):
            return 'high'
        elif any(kw in combined for kw in ['when possible', 'no rush', 'low priority']):
            return 'low'
        return 'medium'
    
    def requires_response(self, email_data: Dict) -> bool:
        """Determine if email requires a response"""
        body = email_data.get('body', '').lower()
        subject = email_data.get('subject', '').lower()
        
        # Questions typically require responses
        question_indicators = ['?', 'can you', 'could you', 'would you', 'please let me know',
                             'what do you think', 'when can', 'how should']
        
        # Action requests
        action_indicators = ['please review', 'please confirm', 'please approve', 'need your input',
                           'awaiting your', 'waiting for your']
        
        combined = f"{subject} {body}"
        return any(ind in combined for ind in question_indicators + action_indicators)
    
    def track_sent_email(self, email_id: str, email_data: Dict):
        """Track a sent email that expects a response"""
        if not self.requires_response(email_data):
            return
        
        urgency = self.detect_urgency(email_data)
        rules = self.reminder_rules[urgency]
        
        self.pending_responses[email_id] = {
            'email_data': email_data,
            'sent_at': datetime.now(),
            'urgency': urgency,
            'reminder_at': datetime.now() + timedelta(hours=rules['hours']),
            'escalate_at': datetime.now() + timedelta(hours=rules['escalate_after']),
            'reminded': False,
            'escalated': False
        }
    
    def check_pending_responses(self) -> List[Dict]:
        """Check for emails needing reminders"""
        now = datetime.now()
        reminders = []
        
        for email_id, tracking in self.pending_responses.items():
            if tracking['reminded']:
                continue
            
            if now >= tracking['reminder_at']:
                reminders.append({
                    'email_id': email_id,
                    'type': 'reminder',
                    'urgency': tracking['urgency'],
                    'hours_waiting': (now - tracking['sent_at']).total_seconds() / 3600,
                    'email_data': tracking['email_data']
                })
                tracking['reminded'] = True
            
            if now >= tracking['escalate_at'] and not tracking['escalated']:
                reminders.append({
                    'email_id': email_id,
                    'type': 'escalation',
                    'urgency': tracking['urgency'],
                    'hours_waiting': (now - tracking['sent_at']).total_seconds() / 3600,
                    'email_data': tracking['email_data']
                })
                tracking['escalated'] = True
        
        return reminders
    
    def generate_follow_up_email(self, original_email: Dict, reminder_type: str) -> Dict:
        """Generate a follow-up email with reply-all enforcement"""
        to_list = original_email.get('to', [])
        cc_list = original_email.get('cc', [])
        all_recipients = to_list + cc_list
        
        # CRITICAL: Enforce reply-all for multi-recipient emails
        reply_all = len(all_recipients) > 1
        
        if reminder_type == 'reminder':
            subject = f"Following up: {original_email.get('subject', '')}"
            body = f"""Hi,

I wanted to follow up on my previous email regarding: {original_email.get('subject', '')}

I understand you're busy, but I'd appreciate your response when you have a moment.

Best regards"""
        else:  # escalation
            subject = f"URGENT Follow-up: {original_email.get('subject', '')}"
            body = f"""Hi,

I'm following up urgently on my previous email regarding: {original_email.get('subject', '')}

This requires your immediate attention. Please respond as soon as possible.

Best regards"""
        
        return {
            'subject': subject,
            'body': body,
            'to': to_list,
            'cc': cc_list if reply_all else [],
            'reply_all_enforced': reply_all,
            'recipient_count': len(all_recipients)
        }
    
    def process_incoming_response(self, email_id: str):
        """Mark email as responded when reply received"""
        if email_id in self.pending_responses:
            del self.pending_responses[email_id]

if __name__ == '__main__':
    # Test cases
    reminder = EmailFollowUpReminder()
    
    test_emails = [
        {
            'id': 'email_001',
            'subject': 'Can you review the proposal?',
            'body': 'Please review the attached proposal and let me know your thoughts ASAP',
            'from': 'me@company.com',
            'to': ['client@external.com', 'manager@company.com'],
            'cc': []
        },
        {
            'id': 'email_002',
            'subject': 'Meeting notes from today',
            'body': 'Here are the notes from our meeting. Please confirm if I missed anything',
            'from': 'me@company.com',
            'to': ['team@company.com'],
            'cc': ['manager@company.com', 'stakeholder@company.com']
        }
    ]
    
    print("V237: Email Follow-up Reminder Test Results")
    print("=" * 60)
    
    for email in test_emails:
        requires_resp = reminder.requires_response(email)
        urgency = reminder.detect_urgency(email)
        
        print(f"\nEmail: {email['subject']}")
        print(f"  Requires Response: {requires_resp}")
        print(f"  Urgency: {urgency}")
        
        if requires_resp:
            reminder.track_sent_email(email['id'], email)
            follow_up = reminder.generate_follow_up_email(email, 'reminder')
            print(f"  Follow-up Subject: {follow_up['subject']}")
            print(f"  Reply-All Enforced: {follow_up['reply_all_enforced']}")
            print(f"  Recipients: {follow_up['recipient_count']}")
    
    print("\n" + "=" * 60)
    print("Pending responses tracked:", len(reminder.pending_responses))
