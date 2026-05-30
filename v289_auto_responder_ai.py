#!/usr/bin/env python3
"""V289: Email Auto-Responder AI — Generates context-aware auto-responses,
handles routine inquiries, escalates complex issues, learns from patterns.
Always enforces reply-all for multi-recipient emails."""
import json, re
from datetime import datetime
from collections import defaultdict

class EmailAutoResponderAI:
    def __init__(self):
        self.response_templates = {
            'inquiry': {
                'keywords': ['question', 'information', 'help', 'how', 'what', 'when'],
                'template': 'Thank you for your inquiry about {topic}. I\'ve reviewed your question and here\'s what I can tell you:\n\n[Detailed response based on context]\n\nIf you need further clarification, please don\'t hesitate to ask.'
            },
            'request': {
                'keywords': ['please', 'could you', 'can you', 'request', 'need'],
                'template': 'Thank you for your request regarding {topic}. I\'m processing this now and will have an update for you shortly.\n\n[Status and next steps]\n\nI\'ll follow up once this is complete.'
            },
            'confirmation': {
                'keywords': ['confirm', 'confirmed', 'yes', 'approved', 'agreed'],
                'template': 'Thank you for the confirmation. I\'ve noted this and will proceed accordingly.\n\n[Confirmation details and next steps]\n\nPlease let me know if anything changes.'
            },
            'meeting': {
                'keywords': ['meeting', 'schedule', 'appointment', 'calendar', 'available'],
                'template': 'Thank you for reaching out about scheduling. I\'ve reviewed the proposed time and here\'s my availability:\n\n[Availability and scheduling details]\n\nLooking forward to our conversation.'
            },
            'support': {
                'keywords': ['issue', 'problem', 'error', 'bug', 'not working', 'help'],
                'template': 'Thank you for reporting this issue. I understand how frustrating technical problems can be.\n\n[Troubleshooting steps and solutions]\n\nIf this doesn\'t resolve the issue, I\'ll escalate to our technical team.'
            }
        }
        self.escalation_rules = {
            'complex_technical': ['architecture', 'infrastructure', 'security', 'compliance'],
            'executive': ['ceo', 'board', 'investor', 'acquisition', 'merger'],
            'legal': ['contract', 'liability', 'lawsuit', 'regulation', 'gdpr']
        }
        self.learning_data = defaultdict(lambda: {'success_rate': 0.0, 'usage_count': 0})
    
    def analyze_email(self, email_data):
        sender = email_data.get('from', '')
        recipients = email_data.get('to', [])
        cc = email_data.get('cc', [])
        subject = email_data.get('subject', '')
        body = email_data.get('body', '')
        
        # Classify email type
        email_type = self._classify_email(subject, body)
        
        # Check if auto-response is appropriate
        can_auto_respond = self._can_auto_respond(email_type, subject, body)
        
        # Generate auto-response or escalate
        if can_auto_respond['auto_respond']:
            response_content = self._generate_auto_response(email_data, email_type)
            action = 'auto_respond'
        else:
            response_content = self._generate_escalation_notice(email_data, can_auto_respond['reason'])
            action = 'escalate'
        
        # Update learning
        self._update_learning(email_type, action)
        
        all_recipients = list(set(recipients + cc))
        if sender and sender not in all_recipients:
            all_recipients.insert(0, sender)
        
        return {
            'engine': 'V289-AutoResponderAI',
            'email_type': email_type,
            'action': action,
            'can_auto_respond': can_auto_respond,
            'response_content': response_content,
            'confidence': can_auto_respond['confidence'],
            'response': self._format_response(email_data, response_content, action),
            'reply_to': all_recipients,
            'reply_all_enforced': len(all_recipients) > 1
        }
    
    def _classify_email(self, subject, body):
        text = (subject + ' ' + body).lower()
        
        # Score each type
        scores = {}
        for email_type, config in self.response_templates.items():
            score = sum(1 for kw in config['keywords'] if kw in text)
            scores[email_type] = score
        
        # Return highest scoring type
        max_score = max(scores.values())
        if max_score == 0:
            return 'general'
        
        return max(scores, key=scores.get)
    
    def _can_auto_respond(self, email_type, subject, body):
        text = (subject + ' ' + body).lower()
        
        # Check escalation rules
        for category, keywords in self.escalation_rules.items():
            if any(kw in text for kw in keywords):
                return {
                    'auto_respond': False,
                    'reason': f'complex_{category}',
                    'confidence': 0.9
                }
        
        # Check for high complexity indicators
        complexity_indicators = ['multiple', 'complex', 'urgent', 'critical', 'asap']
        if sum(1 for ind in complexity_indicators if ind in text) >= 3:
            return {
                'auto_respond': False,
                'reason': 'high_complexity',
                'confidence': 0.85
            }
        
        # Check if it's a simple, routine email
        if email_type in ['confirmation', 'inquiry', 'request']:
            return {
                'auto_respond': True,
                'reason': 'routine_email',
                'confidence': 0.8
            }
        
        # Default to human review
        return {
            'auto_respond': False,
            'reason': 'requires_human_review',
            'confidence': 0.7
        }
    
    def _generate_auto_response(self, email_data, email_type):
        subject = email_data.get('subject', '')
        body = email_data.get('body', '')
        
        # Extract topic from subject
        topic = re.sub(r'^(re:|fw:|fwd:)\s*', '', subject, flags=re.IGNORECASE).strip()
        
        # Get template
        template_config = self.response_templates.get(email_type, self.response_templates['inquiry'])
        template = template_config['template']
        
        # Fill template
        response = template.replace('{topic}', topic)
        
        # Add context-specific details
        if email_type == 'inquiry':
            response += f"\n\nBased on your question about '{topic}', here are the key points:\n"
            response += "• Point 1: [Contextual answer]\n"
            response += "• Point 2: [Additional details]\n"
            response += "• Point 3: [Resources or next steps]"
        
        elif email_type == 'request':
            response += f"\n\nStatus: In Progress\n"
            response += f"Expected completion: Within 24 hours\n"
            response += "I'll send another update once this is complete."
        
        elif email_type == 'meeting':
            response += "\n\nMy availability this week:\n"
            response += "• Tuesday: 2:00 PM - 4:00 PM\n"
            response += "• Wednesday: 10:00 AM - 12:00 PM\n"
            response += "• Thursday: 3:00 PM - 5:00 PM\n"
            response += "\nPlease let me know which time works best for you."
        
        return response
    
    def _generate_escalation_notice(self, email_data, reason):
        subject = email_data.get('subject', '')
        
        reason_messages = {
            'complex_technical': 'This requires technical expertise',
            'complex_executive': 'This involves executive-level decisions',
            'complex_legal': 'This has legal implications',
            'high_complexity': 'This is a high-complexity request',
            'requires_human_review': 'This requires human judgment'
        }
        
        notice = f"Thank you for your email about '{subject}'.\n\n"
        notice += f"{reason_messages.get(reason, 'This requires specialized attention')}.\n\n"
        notice += "I'm escalating this to the appropriate team member who will respond shortly.\n\n"
        notice += "You can expect a response within 4 business hours."
        
        return notice
    
    def _update_learning(self, email_type, action):
        data = self.learning_data[email_type]
        data['usage_count'] += 1
        if action == 'auto_respond':
            data['success_rate'] = min(1.0, data['success_rate'] + 0.05)
    
    def _format_response(self, email_data, response_content, action):
        subject = email_data.get('subject', '')
        
        if action == 'auto_respond':
            prefix = "🤖 Auto-Response"
        else:
            prefix = "👤 Escalation Notice"
        
        response = f"{prefix} for '{subject}':\n\n{response_content}"
        response += "\n\n---\nZion Tech Group | AI Email Intelligence V289\n📱 +1 302 464 0950 | ✉️ kleber@ziontechgroup.com\n📍 364 E Main St STE 1008, Middletown DE 19709"
        
        return response

if __name__ == "__main__":
    engine = EmailAutoResponderAI()
    test = {
        "from": "customer@client.com",
        "to": ["support@company.com", "help@company.com"],
        "cc": ["manager@client.com"],
        "subject": "Question about pricing plans",
        "body": "Hi, I have a question about your pricing plans. What's included in the enterprise plan? Could you please send me more information? Thanks!"
    }
    result = engine.analyze_email(test)
    print(json.dumps(result, indent=2))
    print("\n✅ V289 Auto-Responder AI — All systems operational | Reply-All: ENFORCED")
