#!/usr/bin/env python3
"""
Email Intelligence Engine V325 - Email Auto-Responder Intelligence
Smart auto-responses with context awareness, vacation mode, out-of-office
scheduling, and intelligent delegation with human-like personalization.
Enforces reply-all and case-by-case analysis.
"""

import json
import re
from datetime import datetime, timedelta
from typing import Dict, List
from collections import defaultdict

class EmailAutoResponderIntelligence:
    def __init__(self):
        self.version = "V325"
        self.auto_response_rules = []
        self.delegation_map = defaultdict(str)
        
    def check_auto_response_triggers(self, email_data: Dict, context: Dict = None) -> Dict:
        """Check if auto-response should be triggered"""
        if not context:
            context = {}
        
        triggers = []
        
        # Vacation/OOO check
        if context.get('vacation_mode'):
            start = context.get('vacation_start')
            end = context.get('vacation_end')
            now = datetime.now().isoformat()
            
            if start and end and start <= now <= end:
                triggers.append({
                    'type': 'vacation',
                    'priority': 'high',
                    'message': self._generate_vacation_message(context)
                })
        
        # After-hours check
        current_hour = datetime.now().hour
        work_hours = context.get('work_hours', {'start': 9, 'end': 17})
        
        if current_hour < work_hours['start'] or current_hour >= work_hours['end']:
            triggers.append({
                'type': 'after_hours',
                'priority': 'medium',
                'message': self._generate_after_hours_message(work_hours)
            })
        
        # Weekend check
        if datetime.now().weekday() >= 5:  # Saturday or Sunday
            triggers.append({
                'type': 'weekend',
                'priority': 'medium',
                'message': self._generate_weekend_message()
            })
        
        # High-volume check
        recent_emails = context.get('recent_email_count', 0)
        if recent_emails > 50:  # High volume threshold
            triggers.append({
                'type': 'high_volume',
                'priority': 'low',
                'message': self._generate_high_volume_message(recent_emails)
            })
        
        # Urgent email bypass
        content = email_data.get('content', '').lower()
        subject = email_data.get('subject', '').lower()
        urgent_keywords = ['urgent', 'emergency', 'asap', 'immediately', 'critical']
        
        is_urgent = any(kw in content or kw in subject for kw in urgent_keywords)
        
        if is_urgent:
            triggers.append({
                'type': 'urgent_bypass',
                'priority': 'critical',
                'message': None,  # Don't auto-respond, escalate
                'escalate_to': context.get('urgent_delegate', 'manager@company.com')
            })
        
        return {
            'triggers': triggers,
            'should_auto_respond': len(triggers) > 0 and not is_urgent,
            'primary_trigger': triggers[0] if triggers else None,
            'is_urgent': is_urgent
        }
    
    def _generate_vacation_message(self, context: Dict) -> str:
        """Generate vacation auto-response"""
        return_date = context.get('vacation_end', 'soon')
        delegate = context.get('vacation_delegate', 'colleague@company.com')
        
        return f"""Thank you for your email.

I am currently out of the office and will return on {return_date}. During this time, I will have limited access to email.

For urgent matters, please contact {delegate}.

I will respond to your message as soon as possible upon my return.

Best regards"""
    
    def _generate_after_hours_message(self, work_hours: Dict) -> str:
        """Generate after-hours auto-response"""
        start_time = work_hours.get('start', 9)
        
        return f"""Thank you for your email.

I received your message outside of business hours. I will review and respond during my next working day, which begins at {start_time}:00 AM.

If this is urgent, please call our emergency line.

Best regards"""
    
    def _generate_weekend_message(self) -> str:
        """Generate weekend auto-response"""
        return """Thank you for your email.

I received your message over the weekend. I will review and respond on Monday morning.

If this is urgent, please contact our support team.

Best regards"""
    
    def _generate_high_volume_message(self, email_count: int) -> str:
        """Generate high-volume auto-response"""
        return f"""Thank you for your email.

I'm currently experiencing high email volume ({email_count}+ messages today). I will respond to your message as soon as possible, likely within 24 hours.

If this is urgent, please reply with "URGENT" in the subject line.

Thank you for your patience.

Best regards"""
    
    def personalize_auto_response(self, base_message: str, email_data: Dict) -> str:
        """Personalize auto-response with sender details"""
        sender_name = email_data.get('sender_name', 'there')
        if not sender_name or sender_name == 'unknown':
            sender_name = 'there'
        
        # Add personalized greeting
        personalized = f"Hello {sender_name},\n\n" + base_message
        
        # Add context-specific note
        subject = email_data.get('subject', '')
        if subject:
            personalized += f"\n\nRe: {subject}"
        
        return personalized
    
    def determine_delegation(self, email_data: Dict, context: Dict = None) -> Dict:
        """Determine if email should be delegated"""
        if not context:
            context = {}
        
        content = email_data.get('content', '').lower()
        subject = email_data.get('subject', '').lower()
        
        # Category-based delegation
        delegation_rules = {
            'sales': ['pricing', 'quote', 'proposal', 'contract'],
            'support': ['issue', 'problem', 'help', 'bug', 'error'],
            'billing': ['invoice', 'payment', 'billing', 'refund'],
            'technical': ['api', 'integration', 'technical', 'documentation']
        }
        
        delegated_to = None
        category = None
        
        for cat, keywords in delegation_rules.items():
            if any(kw in content or kw in subject for kw in keywords):
                category = cat
                delegated_to = context.get(f'{cat}_delegate', f'{cat}@company.com')
                break
        
        return {
            'should_delegate': delegated_to is not None,
            'delegated_to': delegated_to,
            'category': category,
            'reason': f"Matched {category} keywords" if category else "No delegation rule matched"
        }
    
    def generate_auto_response(self, email_data: Dict, context: Dict = None) -> Dict:
        """Generate intelligent auto-response"""
        print(f"[{self.version}] 🤖 Generating intelligent auto-response")
        
        # Check triggers
        trigger_check = self.check_auto_response_triggers(email_data, context)
        
        # Determine delegation
        delegation = self.determine_delegation(email_data, context)
        
        # Generate response
        auto_response = None
        if trigger_check['should_auto_respond'] and trigger_check['primary_trigger']:
            base_message = trigger_check['primary_trigger']['message']
            auto_response = self.personalize_auto_response(base_message, email_data)
        
        return {
            'version': self.version,
            'engine': 'Email Auto-Responder Intelligence',
            'trigger_check': trigger_check,
            'delegation': delegation,
            'auto_response': auto_response,
            'should_send_auto_response': trigger_check['should_auto_respond'],
            'should_delegate': delegation['should_delegate'],
            'recommendation': self._generate_recommendation(trigger_check, delegation)
        }
    
    def _generate_recommendation(self, trigger_check: Dict, delegation: Dict) -> str:
        """Generate recommendation"""
        if trigger_check['is_urgent']:
            return f"URGENT: Escalate to {trigger_check['triggers'][0].get('escalate_to', 'manager')}"
        elif trigger_check['should_auto_respond']:
            return f"Send auto-response: {trigger_check['primary_trigger']['type']}"
        elif delegation['should_delegate']:
            return f"Delegate to {delegation['delegated_to']} ({delegation['category']})"
        else:
            return "Process normally - no auto-response needed"
    
    def process_email(self, email_data: Dict, context: Dict = None) -> Dict:
        """Process email with auto-responder intelligence"""
        print(f"[{self.version}] Processing with auto-responder")
        
        # Case-by-case analysis
        recipients = email_data.get('recipients', [])
        cc_list = email_data.get('cc', [])
        all_recipients = recipients + cc_list
        
        # Enforce reply-all
        reply_all = len(all_recipients) > 1
        
        # Generate auto-response
        auto_response_result = self.generate_auto_response(email_data, context)
        
        response = {
            'version': self.version,
            'engine': 'Email Auto-Responder Intelligence',
            'auto_response_result': auto_response_result,
            'reply_all': reply_all,
            'reply_all_recipients': all_recipients if reply_all else [],
            'recommendation': auto_response_result['recommendation']
        }
        
        print(f"[{self.version}] Auto-respond: {auto_response_result['should_send_auto_response']}, Delegate: {auto_response_result['should_delegate']}, Reply-all: {reply_all}")
        return response

# Test
if __name__ == "__main__":
    engine = EmailAutoResponderIntelligence()
    
    # Test vacation mode
    context = {
        'vacation_mode': True,
        'vacation_start': '2026-05-25',
        'vacation_end': '2026-06-05',
        'vacation_delegate': 'colleague@company.com',
        'work_hours': {'start': 9, 'end': 17}
    }
    
    test_email = {
        'sender': 'client@company.com',
        'sender_name': 'John',
        'subject': 'Project Update',
        'content': 'Hi, just checking in on the project status.',
        'recipients': ['manager@company.com'],
        'cc': ['team@company.com']
    }
    
    result = engine.process_email(test_email, context)
    print(json.dumps(result, indent=2))
    
    # Test urgent email
    print("\n--- Urgent Email ---")
    urgent_email = {
        'sender': 'ceo@company.com',
        'sender_name': 'CEO',
        'subject': 'URGENT: Critical Issue',
        'content': 'We have an urgent issue that needs immediate attention.',
        'recipients': ['manager@company.com'],
        'cc': []
    }
    result2 = engine.process_email(urgent_email, context)
    print(json.dumps(result2, indent=2))
