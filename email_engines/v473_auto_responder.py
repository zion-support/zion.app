#!/usr/bin/env python3
"""
V473 - Email Auto-Responder Intelligence
Smart out-of-office and auto-reply system with context-aware responses and intelligent routing.
Features: Smart auto-replies, context detection, escalation routing, vacation mode, business hours.
CRITICAL: Always enforces reply-all for multi-recipient emails.
"""

import json
import re
from datetime import datetime, time
from typing import Dict, List, Any


class EmailAutoResponderIntelligence:
    """Intelligent auto-responder system."""
    
    def __init__(self):
        self.business_hours = {'start': time(9, 0), 'end': time(17, 0)}
        self.vacation_mode = False
        self.emergency_contacts = ['manager@ziontechgroup.com', 'support@ziontechgroup.com']
        
    def analyze_email(self, email: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze email and determine appropriate auto-response."""
        body = email.get('body', '')
        subject = email.get('subject', '')
        sender = email.get('from', '')
        recipients = email.get('to', []) + email.get('cc', [])
        
        # Check if auto-response is needed
        auto_response_needed = self._should_auto_respond(email)
        
        if not auto_response_needed['respond']:
            return {
                'engine': 'V473_EmailAutoResponderIntelligence',
                'auto_response_needed': False,
                'reason': auto_response_needed['reason'],
                'reply_all_required': len(recipients) > 1,
                'reply_all_enforced': len(recipients) > 1,
                'recipients': recipients,
                'timestamp': datetime.now().isoformat()
            }
        
        # Detect email context
        context = self._detect_context(body, subject)
        
        # Generate appropriate auto-response
        auto_response = self._generate_auto_response(context, sender, email)
        
        # Determine if escalation is needed
        escalation = self._check_escalation_needed(context, body)
        
        reply_all_required = len(recipients) > 1
        
        return {
            'engine': 'V473_EmailAutoResponderIntelligence',
            'auto_response_needed': True,
            'context': context,
            'auto_response': auto_response,
            'escalation': escalation,
            'business_hours_check': self._check_business_hours(),
            'reply_all_required': reply_all_required,
            'reply_all_enforced': reply_all_required,
            'recipients': recipients,
            'timestamp': datetime.now().isoformat()
        }
    
    def _should_auto_respond(self, email: Dict) -> Dict:
        """Determine if auto-response is needed."""
        # Check business hours
        now = datetime.now().time()
        if not (self.business_hours['start'] <= now <= self.business_hours['end']):
            return {'respond': True, 'reason': 'outside_business_hours'}
        
        # Check vacation mode
        if self.vacation_mode:
            return {'respond': True, 'reason': 'vacation_mode'}
        
        # Check if it's a weekend
        if datetime.now().weekday() >= 5:  # Saturday = 5, Sunday = 6
            return {'respond': True, 'reason': 'weekend'}
        
        return {'respond': False, 'reason': 'during_business_hours'}
    
    def _detect_context(self, body: str, subject: str) -> Dict:
        """Detect email context for appropriate response."""
        text = (body + ' ' + subject).lower()
        
        contexts = {
            'urgent': ['urgent', 'asap', 'emergency', 'critical'],
            'sales': ['pricing', 'quote', 'proposal', 'purchase', 'buy'],
            'support': ['help', 'issue', 'problem', 'bug', 'error'],
            'general': ['hello', 'hi', 'question', 'information']
        }
        
        detected = 'general'
        for ctx, keywords in contexts.items():
            if any(kw in text for kw in keywords):
                detected = ctx
                break
        
        return {
            'type': detected,
            'confidence': 0.85,
            'keywords_matched': [kw for kw in contexts.get(detected, []) if kw in text]
        }
    
    def _generate_auto_response(self, context: Dict, sender: str, email: Dict) -> Dict:
        """Generate context-aware auto-response."""
        responses = {
            'urgent': {
                'subject': 'Re: [URGENT] Your message has been received',
                'body': f"""Dear Sender,

Thank you for your urgent message. We have received it and our team has been notified.

For immediate assistance, please contact our emergency support:
📞 +1 302 464 0950
✉️ support@ziontechgroup.com

We will respond within 30 minutes during business hours.

Best regards,
Zion Tech Group Team

📍 364 E Main St STE 1008, Middletown DE 19709
🌐 https://ziontechgroup.com""",
                'priority': 'high'
            },
            'sales': {
                'subject': 'Re: Thank you for your interest in Zion Tech Group',
                'body': f"""Dear Sender,

Thank you for your interest in our services! We have received your inquiry and our sales team will contact you within 2 business hours.

In the meantime, you can:
🌐 Visit our website: https://ziontechgroup.com
📞 Call us: +1 302 464 0950
✉️ Email: sales@ziontechgroup.com

We look forward to helping you!

Best regards,
Zion Tech Group Sales Team

📍 364 E Main St STE 1008, Middletown DE 19709""",
                'priority': 'medium'
            },
            'support': {
                'subject': 'Re: Support ticket created - We\'re here to help',
                'body': f"""Dear Sender,

Thank you for contacting our support team. We have received your request and created a support ticket.

What happens next:
✓ Our support team will review your request
✓ You'll receive a response within 4 business hours
✓ For urgent issues, call: +1 302 464 0950

Thank you for your patience!

Best regards,
Zion Tech Group Support Team

📞 +1 302 464 0950
✉️ support@ziontechgroup.com
📍 364 E Main St STE 1008, Middletown DE 19709""",
                'priority': 'medium'
            },
            'general': {
                'subject': 'Re: Thank you for your message',
                'body': f"""Dear Sender,

Thank you for your message. We have received it and will respond within 1 business day.

For immediate assistance:
📞 Call: +1 302 464 0950
✉️ Email: kleber@ziontechgroup.com
🌐 Website: https://ziontechgroup.com

Best regards,
Zion Tech Group

📍 364 E Main St STE 1008, Middletown DE 19709""",
                'priority': 'low'
            }
        }
        
        return responses.get(context['type'], responses['general'])
    
    def _check_escalation_needed(self, context: Dict, body: str) -> Dict:
        """Check if email needs escalation."""
        body_lower = body.lower()
        
        escalation_triggers = ['complaint', 'legal', 'lawsuit', 'refund', 'cancel', 'terminate']
        needs_escalation = any(trigger in body_lower for trigger in escalation_triggers)
        
        if needs_escalation or context['type'] == 'urgent':
            return {
                'escalate': True,
                'contacts': self.emergency_contacts,
                'reason': 'urgent_or_complaint',
                'priority': 'high'
            }
        
        return {
            'escalate': False,
            'reason': 'standard_inquiry'
        }
    
    def _check_business_hours(self) -> Dict:
        """Check current business hours status."""
        now = datetime.now()
        current_time = now.time()
        
        is_business_hours = self.business_hours['start'] <= current_time <= self.business_hours['end']
        is_weekday = now.weekday() < 5
        
        return {
            'is_business_hours': is_business_hours and is_weekday,
            'current_time': current_time.strftime('%H:%M'),
            'business_hours': f"{self.business_hours['start'].strftime('%H:%M')} - {self.business_hours['end'].strftime('%H:%M')}",
            'is_weekend': now.weekday() >= 5
        }


def main():
    """Test V473 engine."""
    engine = EmailAutoResponderIntelligence()
    
    test_emails = [
        {
            'from': 'customer@company.com',
            'to': ['support@ziontechgroup.com', 'kleber@ziontechgroup.com'],
            'subject': 'URGENT: System is down!',
            'body': 'Our system is down and we need immediate help. This is an emergency!'
        },
        {
            'from': 'prospect@startup.com',
            'to': ['sales@ziontechgroup.com', 'kleber@ziontechgroup.com'],
            'subject': 'Interested in your AI services',
            'body': 'We would like to get a quote for your AI platform services.'
        },
        {
            'from': 'user@example.com',
            'to': ['info@ziontechgroup.com'],
            'subject': 'Question about your services',
            'body': 'Hello, I have a question about your email intelligence services.'
        }
    ]
    
    print("=== Email Auto-Responder Intelligence ===\n")
    
    for i, email in enumerate(test_emails, 1):
        result = engine.analyze_email(email)
        print(f"\n📧 Email {i}: {email['subject']}")
        print(f"   Auto-response needed: {result['auto_response_needed']}")
        
        if result['auto_response_needed']:
            print(f"   Context: {result['context']['type']}")
            print(f"   Response priority: {result['auto_response']['priority']}")
            print(f"   Escalation needed: {result['escalation']['escalate']}")
            print(f"   Business hours: {result['business_hours_check']['is_business_hours']}")
        
        print(f"   Reply-all enforced: {result['reply_all_enforced']}")


if __name__ == '__main__':
    main()
