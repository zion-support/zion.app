#!/usr/bin/env python3
"""
Email Intelligence Engine V316 - Email Persona Manager
Create and switch between professional personas (executive, technical, sales)
with consistent voice, vocabulary, and response patterns per context.
Enforces reply-all and case-by-case analysis.
"""

import json
from datetime import datetime
from typing import Dict, List

class EmailPersonaManager:
    def __init__(self):
        self.version = "V316"
        self.personas = {
            'executive': {
                'tone': 'authoritative',
                'formality': 0.8,
                'vocabulary': ['strategic', 'value', 'impact', 'leverage', 'stakeholder'],
                'response_length': 'concise',
                'greeting': 'Dear',
                'signoff': 'Best regards'
            },
            'technical': {
                'tone': 'precise',
                'formality': 0.6,
                'vocabulary': ['implementation', 'architecture', 'deployment', 'configuration', 'optimization'],
                'response_length': 'detailed',
                'greeting': 'Hi',
                'signoff': 'Thanks'
            },
            'sales': {
                'tone': 'enthusiastic',
                'formality': 0.5,
                'vocabulary': ['opportunity', 'partnership', 'value', 'solution', 'growth'],
                'response_length': 'moderate',
                'greeting': 'Hello',
                'signoff': 'Looking forward to connecting'
            },
            'support': {
                'tone': 'empathetic',
                'formality': 0.6,
                'vocabulary': ['understand', 'help', 'resolve', 'assist', 'appreciate'],
                'response_length': 'thorough',
                'greeting': 'Hi',
                'signoff': 'Happy to help further'
            },
            'legal': {
                'tone': 'formal',
                'formality': 0.95,
                'vocabulary': ['pursuant', 'hereby', 'aforementioned', 'notwithstanding', 'compliance'],
                'response_length': 'precise',
                'greeting': 'Dear',
                'signoff': 'Sincerely'
            }
        }
    
    def detect_context(self, email_data: Dict) -> str:
        """Detect appropriate persona from email context"""
        content = email_data.get('content', '').lower()
        subject = email_data.get('subject', '').lower()
        sender = email_data.get('sender', '').lower()
        
        # Context detection rules
        if any(kw in content for kw in ['board', 'quarterly', 'revenue', 'strategy', 'acquisition']):
            return 'executive'
        elif any(kw in content for kw in ['api', 'deployment', 'bug', 'code', 'infrastructure', 'server']):
            return 'technical'
        elif any(kw in content for kw in ['proposal', 'pricing', 'deal', 'contract', 'partnership']):
            return 'sales'
        elif any(kw in content for kw in ['issue', 'problem', 'help', 'error', 'ticket']):
            return 'support'
        elif any(kw in content for kw in ['legal', 'compliance', 'contract', 'liability', 'regulation']):
            return 'legal'
        
        # Sender-based detection
        if 'ceo' in sender or 'cfo' in sender or 'board' in sender:
            return 'executive'
        elif 'dev' in sender or 'engineer' in sender or 'tech' in sender:
            return 'technical'
        elif 'sales' in sender or 'account' in sender:
            return 'sales'
        elif 'legal' in sender or 'counsel' in sender:
            return 'legal'
        
        return 'support'  # Default
    
    def apply_persona(self, email_data: Dict, persona: str = None) -> Dict:
        """Apply persona to email response"""
        print(f"[{self.version}] Applying persona management")
        
        # Auto-detect if not specified
        if not persona:
            persona = self.detect_context(email_data)
        
        persona_config = self.personas.get(persona, self.personas['support'])
        
        # Case-by-case analysis
        recipients = email_data.get('recipients', [])
        cc_list = email_data.get('cc', [])
        all_recipients = recipients + cc_list
        
        # Enforce reply-all
        reply_all = len(all_recipients) > 1
        
        # Generate response template
        response_template = {
            'greeting': f"{persona_config['greeting']} {{name}},",
            'tone': persona_config['tone'],
            'vocabulary_suggestions': persona_config['vocabulary'],
            'length_guidance': persona_config['response_length'],
            'signoff': persona_config['signoff']
        }
        
        # Vocabulary check on original email
        content = email_data.get('content', '')
        vocabulary_matches = [v for v in persona_config['vocabulary'] if v in content.lower()]
        
        response = {
            'version': self.version,
            'engine': 'Email Persona Manager',
            'detected_persona': persona,
            'persona_config': persona_config,
            'response_template': response_template,
            'vocabulary_matches': vocabulary_matches,
            'consistency_score': len(vocabulary_matches) / len(persona_config['vocabulary']) if persona_config['vocabulary'] else 0,
            'reply_all': reply_all,
            'reply_all_recipients': all_recipients if reply_all else [],
            'recommendation': f"Use {persona} persona with {persona_config['tone']} tone"
        }
        
        print(f"[{self.version}] Persona: {persona}, Tone: {persona_config['tone']}, Reply-all: {reply_all}")
        return response
    
    def switch_persona(self, current_persona: str, target_persona: str) -> Dict:
        """Switch between personas with transition guidance"""
        current = self.personas.get(current_persona, {})
        target = self.personas.get(target_persona, {})
        
        return {
            'from': current_persona,
            'to': target_persona,
            'formality_shift': target.get('formality', 0.5) - current.get('formality', 0.5),
            'tone_change': f"{current.get('tone', 'neutral')} → {target.get('tone', 'neutral')}",
            'transition_note': 'Adjust vocabulary and sentence structure gradually'
        }
    
    def process_email(self, email_data: Dict, persona: str = None) -> Dict:
        """Process email with persona management"""
        return self.apply_persona(email_data, persona)

# Test
if __name__ == "__main__":
    engine = EmailPersonaManager()
    
    # Test executive context
    exec_email = {
        'sender': 'ceo@company.com',
        'subject': 'Q3 Strategic Review',
        'content': 'Please prepare the quarterly board presentation with revenue projections and strategic initiatives.',
        'recipients': ['vp@company.com'],
        'cc': ['cfo@company.com', 'coo@company.com']
    }
    
    result = engine.process_email(exec_email)
    print("Executive context:", json.dumps(result, indent=2))
    
    # Test technical context
    tech_email = {
        'sender': 'dev-lead@company.com',
        'subject': 'API Deployment Issue',
        'content': 'The API gateway is throwing 502 errors after the latest deployment. Need to rollback.',
        'recipients': ['devops@company.com'],
        'cc': ['sre@company.com']
    }
    
    result2 = engine.process_email(tech_email)
    print("\nTechnical context:", json.dumps(result2, indent=2))
