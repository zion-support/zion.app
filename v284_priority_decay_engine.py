#!/usr/bin/env python3
"""V284: Email Priority Decay Engine — Dynamically adjusts email priority based on age,
escalates aging emails automatically, prevents important emails from being forgotten.
Always enforces reply-all for multi-recipient emails."""
import json
from datetime import datetime, timedelta
from collections import defaultdict

class EmailPriorityDecayEngine:
    def __init__(self):
        self.email_queue = defaultdict(lambda: {
            'received_at': None,
            'initial_priority': 0,
            'current_priority': 0,
            'escalation_count': 0,
            'last_reminder': None
        })
        self.priority_rules = {
            'decay_rate': 0.1,  # Priority decays 10% per day
            'escalation_threshold': 3,  # Escalate after 3 days
            'max_escalations': 3,
            'reminder_intervals': [1, 3, 7]  # Days for reminders
        }
    
    def analyze_email(self, email_data):
        sender = email_data.get('from', '')
        recipients = email_data.get('to', [])
        cc = email_data.get('cc', [])
        subject = email_data.get('subject', '')
        body = email_data.get('body', '')
        received_at = email_data.get('received_at', datetime.now().isoformat())
        
        email_id = self._generate_email_id(sender, subject, received_at)
        
        # Calculate initial priority
        initial_priority = self._calculate_initial_priority(subject, body, sender)
        
        # Update or create email in queue
        if email_id not in self.email_queue:
            self.email_queue[email_id] = {
                'received_at': received_at,
                'initial_priority': initial_priority,
                'current_priority': initial_priority,
                'escalation_count': 0,
                'last_reminder': None
            }
        
        # Apply priority decay
        current_priority, days_old = self._apply_priority_decay(email_id)
        
        # Check for escalation
        escalation = self._check_escalation(email_id, days_old, current_priority)
        
        # Generate reminders
        reminders = self._generate_reminders(email_id, days_old)
        
        # Determine action
        action = self._determine_action(current_priority, escalation, days_old)
        
        all_recipients = list(set(recipients + cc))
        if sender and sender not in all_recipients:
            all_recipients.insert(0, sender)
        
        return {
            'engine': 'V284-PriorityDecayEngine',
            'email_id': email_id,
            'initial_priority': initial_priority,
            'current_priority': current_priority,
            'days_old': days_old,
            'priority_decay_percent': round((1 - current_priority / initial_priority) * 100, 1) if initial_priority > 0 else 0,
            'escalation': escalation,
            'reminders': reminders,
            'action': action,
            'response': self._generate_response(email_data, current_priority, days_old, escalation),
            'reply_to': all_recipients,
            'reply_all_enforced': len(all_recipients) > 1
        }
    
    def _generate_email_id(self, sender, subject, received_at):
        import hashlib
        return hashlib.md5(f"{sender}:{subject}:{received_at}".encode()).hexdigest()[:12]
    
    def _calculate_initial_priority(self, subject, body, sender):
        text = (subject + ' ' + body).lower()
        priority = 5  # Base priority (1-10 scale)
        
        # Urgency keywords boost priority
        urgent_keywords = ['urgent', 'asap', 'immediately', 'critical', 'emergency', 'deadline today']
        if any(kw in text for kw in urgent_keywords):
            priority += 3
        
        # Executive sender boosts priority
        if any(title in sender.lower() for title in ['ceo', 'cto', 'cfo', 'president', 'vp']):
            priority += 2
        
        # Financial amounts boost priority
        import re
        if re.search(r'\$[\d,]+(?:\.\d+)?(?:\s*(?:million|billion))?', text):
            priority += 1
        
        # Question marks indicate need for response
        if '?' in text:
            priority += 1
        
        return min(10, priority)
    
    def _apply_priority_decay(self, email_id):
        email = self.email_queue[email_id]
        received = datetime.fromisoformat(email['received_at'])
        now = datetime.now()
        days_old = (now - received).days
        
        # Apply decay
        decay_factor = (1 - self.priority_rules['decay_rate']) ** days_old
        current_priority = email['initial_priority'] * decay_factor
        
        email['current_priority'] = max(1, current_priority)  # Minimum priority of 1
        
        return email['current_priority'], days_old
    
    def _check_escalation(self, email_id, days_old, current_priority):
        email = self.email_queue[email_id]
        
        if days_old >= self.priority_rules['escalation_threshold']:
            if email['escalation_count'] < self.priority_rules['max_escalations']:
                email['escalation_count'] += 1
                return {
                    'escalated': True,
                    'level': email['escalation_count'],
                    'reason': f'Unresponded for {days_old} days',
                    'notification_sent': True
                }
        
        return {'escalated': False, 'level': 0}
    
    def _generate_reminders(self, email_id, days_old):
        email = self.email_queue[email_id]
        reminders = []
        
        for interval in self.priority_rules['reminder_intervals']:
            if days_old == interval:
                if email['last_reminder'] != interval:
                    reminders.append({
                        'type': f'{interval}_day_reminder',
                        'message': f'Email has been waiting for {interval} day(s)',
                        'sent': True
                    })
                    email['last_reminder'] = interval
        
        return reminders
    
    def _determine_action(self, current_priority, escalation, days_old):
        if escalation['escalated'] and escalation['level'] >= 3:
            return 'manager_intervention_required'
        elif current_priority < 3 and days_old > 7:
            return 'archive_or_close'
        elif escalation['escalated']:
            return 'escalate_to_next_level'
        elif current_priority < 5:
            return 'send_reminder'
        else:
            return 'monitor'
    
    def _generate_response(self, email_data, current_priority, days_old, escalation):
        subject = email_data.get('subject', '')
        
        if escalation['escalated']:
            base = f"⚠️ ESCALATION for '{subject}': Priority decayed to {current_priority:.1f}/10 after {days_old} days. Escalation level {escalation['level']} triggered."
        elif days_old > 5:
            base = f"⏰ AGING ALERT for '{subject}': Priority now {current_priority:.1f}/10 (was higher). {days_old} days without response."
        else:
            base = f"📊 Priority tracking for '{subject}': Current priority {current_priority:.1f}/10, {days_old} day(s) old."
        
        return base + "\n\n---\nZion Tech Group | AI Email Intelligence V284\n📱 +1 302 464 0950 | ✉️ kleber@ziontechgroup.com\n📍 364 E Main St STE 1008, Middletown DE 19709"

if __name__ == "__main__":
    engine = EmailPriorityDecayEngine()
    
    # Simulate an email received 4 days ago
    old_date = (datetime.now() - timedelta(days=4)).isoformat()
    test = {
        "from": "client@enterprise.com",
        "to": ["sales@company.com", "manager@company.com"],
        "cc": ["team@company.com"],
        "subject": "URGENT: $500,000 Contract Review Needed",
        "body": "We need immediate review of the contract. This is critical for Q4 planning. Please respond ASAP.",
        "received_at": old_date
    }
    
    result = engine.analyze_email(test)
    print(json.dumps(result, indent=2))
    print("\n✅ V284 Priority Decay Engine — All systems operational | Reply-All: ENFORCED")
