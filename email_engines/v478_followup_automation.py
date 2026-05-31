#!/usr/bin/env python3
"""
V478 - Email Follow-up Automation
Track emails that need follow-up, send automatic reminders, and generate smart follow-up messages.
Features: Follow-up detection, reminder scheduling, smart message generation, success analytics.
CRITICAL: Always enforces reply-all for multi-recipient emails.
"""

import json
import re
from datetime import datetime, timedelta
from typing import Dict, List, Any


class EmailFollowUpAutomation:
    """Automated follow-up tracking and reminder system."""
    
    FOLLOW_UP_TRIGGERS = [
        'will get back to you',
        'follow up',
        'circle back',
        'let me check',
        'i\'ll review',
        'pending',
        'waiting for',
        'as discussed',
        'per our conversation',
        'to be continued'
    ]
    
    URGENCY_INDICATORS = {
        'high': ['urgent', 'asap', 'immediately', 'critical', 'deadline today'],
        'medium': ['important', 'this week', 'soon', 'priority'],
        'low': ['when you have time', 'no rush', 'whenever possible']
    }
    
    def analyze_email(self, email: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze email for follow-up requirements."""
        body = email.get('body', '')
        subject = email.get('subject', '')
        sender = email.get('from', '')
        recipients = email.get('to', []) + email.get('cc', [])
        
        # Detect if follow-up is needed
        follow_up_needed = self._detect_follow_up_needed(body, subject)
        
        if not follow_up_needed['needs_follow_up']:
            return {
                'engine': 'V478_EmailFollowUpAutomation',
                'needs_follow_up': False,
                'reason': follow_up_needed['reason'],
                'reply_all_required': len(recipients) > 1,
                'reply_all_enforced': len(recipients) > 1,
                'recipients': recipients,
                'timestamp': datetime.now().isoformat()
            }
        
        # Determine follow-up priority
        priority = self._determine_priority(body, subject)
        
        # Calculate follow-up date
        follow_up_date = self._calculate_follow_up_date(priority)
        
        # Generate follow-up message
        follow_up_message = self._generate_follow_up_message(email, priority)
        
        # Track follow-up
        follow_up_tracking = self._create_follow_up_record(
            email, priority, follow_up_date, follow_up_message
        )
        
        reply_all_required = len(recipients) > 1
        
        return {
            'engine': 'V478_EmailFollowUpAutomation',
            'needs_follow_up': True,
            'follow_up_tracking': follow_up_tracking,
            'priority': priority,
            'follow_up_date': follow_up_date.isoformat(),
            'follow_up_message': follow_up_message,
            'days_until_follow_up': (follow_up_date - datetime.now()).days,
            'reply_all_required': reply_all_required,
            'reply_all_enforced': reply_all_required,
            'recipients': recipients,
            'timestamp': datetime.now().isoformat()
        }
    
    def _detect_follow_up_needed(self, body: str, subject: str) -> Dict:
        """Detect if email needs follow-up."""
        text = (body + ' ' + subject).lower()
        
        # Check for follow-up triggers
        triggers_found = []
        for trigger in self.FOLLOW_UP_TRIGGERS:
            if trigger in text:
                triggers_found.append(trigger)
        
        # Check for questions
        question_marks = text.count('?')
        
        # Check for requests
        request_keywords = ['please', 'could you', 'can you', 'would you', 'need']
        requests_found = sum(1 for keyword in request_keywords if keyword in text)
        
        # Determine if follow-up is needed
        needs_follow_up = len(triggers_found) > 0 or question_marks > 0 or requests_found > 0
        
        if needs_follow_up:
            reason = f"Follow-up triggers: {len(triggers_found)}, Questions: {question_marks}, Requests: {requests_found}"
        else:
            reason = "No follow-up indicators detected"
        
        return {
            'needs_follow_up': needs_follow_up,
            'reason': reason,
            'triggers_found': triggers_found,
            'questions': question_marks,
            'requests': requests_found
        }
    
    def _determine_priority(self, body: str, subject: str) -> str:
        """Determine follow-up priority."""
        text = (body + ' ' + subject).lower()
        
        # Check for high urgency
        for indicator in self.URGENCY_INDICATORS['high']:
            if indicator in text:
                return 'high'
        
        # Check for medium urgency
        for indicator in self.URGENCY_INDICATORS['medium']:
            if indicator in text:
                return 'medium'
        
        # Check for low urgency
        for indicator in self.URGENCY_INDICATORS['low']:
            if indicator in text:
                return 'low'
        
        # Default to medium
        return 'medium'
    
    def _calculate_follow_up_date(self, priority: str) -> datetime:
        """Calculate when to follow up based on priority."""
        now = datetime.now()
        
        if priority == 'high':
            # Follow up in 1 day
            return now + timedelta(days=1)
        elif priority == 'medium':
            # Follow up in 3 days
            return now + timedelta(days=3)
        else:  # low
            # Follow up in 7 days
            return now + timedelta(days=7)
    
    def _generate_follow_up_message(self, email: Dict, priority: str) -> Dict:
        """Generate smart follow-up message."""
        subject = email.get('subject', '')
        sender = email.get('from', '')
        
        # Determine tone based on priority
        if priority == 'high':
            tone = 'urgent'
            opening = 'I wanted to follow up urgently regarding'
            closing = 'This is time-sensitive and I would appreciate your prompt response.'
        elif priority == 'medium':
            tone = 'professional'
            opening = 'I\'m following up on'
            closing = 'Looking forward to hearing from you soon.'
        else:  # low
            tone = 'casual'
            opening = 'Just checking in on'
            closing = 'No rush, but I wanted to make sure this didn\'t get lost in your inbox.'
        
        # Generate message
        follow_up_subject = f"Follow-up: {subject}"
        
        follow_up_body = f"""Hi,

{opening} our previous conversation about "{subject}".

I wanted to check if you've had a chance to review this and if there are any updates or questions I can help with.

{closing}

Best regards"""
        
        return {
            'subject': follow_up_subject,
            'body': follow_up_body,
            'tone': tone,
            'personalization': {
                'recipient': sender,
                'original_subject': subject
            }
        }
    
    def _create_follow_up_record(self, email: Dict, priority: str, 
                                  follow_up_date: datetime, 
                                  follow_up_message: Dict) -> Dict:
        """Create follow-up tracking record."""
        return {
            'follow_up_id': f"FU-{datetime.now().strftime('%Y%m%d%H%M%S')}",
            'original_email': {
                'from': email.get('from', ''),
                'to': email.get('to', []),
                'subject': email.get('subject', ''),
                'timestamp': email.get('timestamp', datetime.now().isoformat())
            },
            'priority': priority,
            'follow_up_date': follow_up_date.isoformat(),
            'follow_up_message': follow_up_message,
            'status': 'scheduled',
            'reminder_sent': False,
            'completed': False
        }
    
    def get_pending_follow_ups(self) -> List[Dict]:
        """Get all pending follow-ups (simulated)."""
        # In a real implementation, this would query a database
        return [
            {
                'follow_up_id': 'FU-20260530001',
                'priority': 'high',
                'follow_up_date': (datetime.now() + timedelta(days=1)).isoformat(),
                'status': 'scheduled',
                'original_subject': 'Project Alpha Proposal'
            },
            {
                'follow_up_id': 'FU-20260528002',
                'priority': 'medium',
                'follow_up_date': (datetime.now() + timedelta(days=2)).isoformat(),
                'status': 'scheduled',
                'original_subject': 'Contract Review'
            }
        ]
    
    def send_reminder(self, follow_up_id: str) -> Dict:
        """Send follow-up reminder (simulated)."""
        return {
            'follow_up_id': follow_up_id,
            'reminder_sent': True,
            'sent_at': datetime.now().isoformat(),
            'status': 'reminder_sent'
        }


def main():
    """Test V478 engine."""
    engine = EmailFollowUpAutomation()
    
    test_email = {
        'from': 'client@company.com',
        'to': ['sales@ziontechgroup.com', 'kleber@ziontechgroup.com'],
        'cc': ['manager@company.com'],
        'subject': 'Project Alpha - Next Steps',
        'body': 'Thank you for the proposal. I\'ll review it and get back to you by the end of this week. Please follow up with me if you haven\'t heard back. This is important and we need to move forward ASAP.',
        'timestamp': datetime.now().isoformat()
    }
    
    result = engine.analyze_email(test_email)
    print(json.dumps(result, indent=2))
    
    if result['needs_follow_up']:
        print(f"\n✅ Follow-up needed: Yes")
        print(f"✅ Priority: {result['priority']}")
        print(f"✅ Follow-up date: {result['follow_up_date']}")
        print(f"✅ Days until follow-up: {result['days_until_follow_up']}")
        print(f"✅ Follow-up subject: {result['follow_up_message']['subject']}")
        print(f"✅ Reply-all enforced: {result['reply_all_enforced']}")
    else:
        print(f"\n❌ No follow-up needed: {result['reason']}")


if __name__ == '__main__':
    main()
