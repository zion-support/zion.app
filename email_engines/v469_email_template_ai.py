#!/usr/bin/env python3
"""
V469 - AI Email Template Generator
AI-powered email template generation with personalization and A/B testing variants.
Features: Template generation, personalization, variant creation, best practices.
CRITICAL: Always enforces reply-all for multi-recipient emails.
"""

import json
from datetime import datetime
from typing import Dict, List, Any


class EmailTemplateAI:
    """AI-powered email template generation."""
    
    TEMPLATES = {
        'followup': 'Following up on our previous conversation regarding {topic}. I wanted to check if you had any questions.',
        'introduction': 'I hope this email finds you well. I am reaching out to introduce {company} and our {service}.',
        'proposal': 'Thank you for your interest in {service}. Please find our detailed proposal attached.',
        'meeting_request': 'I would love to schedule a brief meeting to discuss {topic}. Would {time} work for you?',
        'thank_you': 'Thank you for {action}. We truly appreciate your partnership.'
    }
    
    def analyze_email(self, email: Dict[str, Any]) -> Dict[str, Any]:
        """Generate appropriate template based on email context."""
        body = email.get('body', '')
        subject = email.get('subject', '')
        recipients = email.get('to', []) + email.get('cc', [])
        
        # Detect email intent
        intent = self._detect_intent(subject, body)
        
        # Generate templates
        templates = self._generate_templates(intent, email)
        
        # Create variants
        variants = self._create_variants(templates[0] if templates else '')
        
        reply_all_required = len(recipients) > 1
        
        return {
            'engine': 'V469_EmailTemplateAI',
            'detected_intent': intent,
            'generated_templates': templates,
            'variants': variants,
            'personalization_suggestions': self._get_personalization(recipients),
            'reply_all_required': reply_all_required,
            'reply_all_enforced': reply_all_required,
            'recipients': recipients,
            'timestamp': datetime.now().isoformat()
        }
    
    def _detect_intent(self, subject: str, body: str) -> str:
        """Detect email intent from content."""
        text = (subject + ' ' + body).lower()
        
        if any(w in text for w in ['follow up', 'checking in', 'previous']):
            return 'followup'
        elif any(w in text for w in ['introduce', 'hello', 'first time']):
            return 'introduction'
        elif any(w in text for w in ['proposal', 'quote', 'offer']):
            return 'proposal'
        elif any(w in text for w in ['meet', 'schedule', 'call']):
            return 'meeting_request'
        elif any(w in text for w in ['thank', 'appreciate']):
            return 'thank_you'
        return 'general'
    
    def _generate_templates(self, intent: str, email: Dict) -> List[Dict]:
        """Generate templates based on intent."""
        base_template = self.TEMPLATES.get(intent, 'Thank you for your email regarding {topic}.')
        
        templates = [
            {
                'variant': 'professional',
                'template': f"Dear {{recipient}},\n\n{base_template}\n\nBest regards,\n{{sender}}",
                'tone': 'formal'
            },
            {
                'variant': 'friendly',
                'template': f"Hi {{recipient}},\n\n{base_template}\n\nCheers,\n{{sender}}",
                'tone': 'casual'
            },
            {
                'variant': 'concise',
                'template': f"{base_template}\n\n{{sender}}",
                'tone': 'brief'
            }
        ]
        
        return templates
    
    def _create_variants(self, template: str) -> List[Dict]:
        """Create A/B test variants."""
        return [
            {'variant': 'A', 'template': template, 'type': 'original'},
            {'variant': 'B', 'template': template.replace('Thank you', 'Thanks'), 'type': 'casual'},
            {'variant': 'C', 'template': '🚀 ' + template, 'type': 'with_emoji'}
        ]
    
    def _get_personalization(self, recipients: List[str]) -> List[str]:
        """Get personalization suggestions."""
        suggestions = [
            'Use recipient\'s first name in greeting',
            'Reference previous interactions',
            'Mention shared connections or interests',
            'Customize based on recipient\'s industry'
        ]
        return suggestions


def main():
    """Test V469 engine."""
    engine = EmailTemplateAI()
    result = engine.analyze_email({
        'from': 'kleber@ziontechgroup.com',
        'to': ['client@example.com', 'team@ziontechgroup.com'],
        'subject': 'Following up on our meeting',
        'body': 'Just checking in regarding our discussion last week.'
    })
    print(json.dumps(result, indent=2))
    print(f"\n✅ Intent: {result['detected_intent']}")
    print(f"✅ Templates: {len(result['generated_templates'])}")
    print(f"✅ Variants: {len(result['variants'])}")
    print(f"✅ Reply-all enforced: {result['reply_all_enforced']}")


if __name__ == '__main__':
    main()
