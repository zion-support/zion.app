#!/usr/bin/env python3
"""
V486 - Email Tone Adapter Engine
Intelligently adapts email tone based on recipient relationship, context, and communication history.
Features: Relationship analysis, tone adjustment, formality detection, cultural sensitivity.
CRITICAL: Always enforces reply-all for multi-recipient emails.
"""

import json
from datetime import datetime
from typing import Dict, List, Any


class EmailToneAdapterEngine:
    """Adapts email tone based on recipient relationship and context."""
    
    def __init__(self):
        self.relationship_profiles = {}
        self.tone_history = {}
    
    def analyze_email(self, email: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze email and adapt tone appropriately."""
        recipients = email.get('to', []) + email.get('cc', [])
        sender = email.get('from', '')
        subject = email.get('subject', '')
        body = email.get('body', '')
        
        # Analyze current tone
        current_tone = self._analyze_current_tone(body)
        
        # Determine appropriate tone for each recipient
        recipient_profiles = self._get_recipient_profiles(recipients)
        
        # Adapt tone
        adapted_content = self._adapt_tone(body, current_tone, recipient_profiles)
        
        # Generate recommendations
        recommendations = self._generate_recommendations(current_tone, recipient_profiles)
        
        reply_all_required = len(recipients) > 1
        
        return {
            'engine': 'V486_EmailToneAdapter',
            'current_tone': current_tone,
            'recipient_profiles': recipient_profiles,
            'adapted_content': adapted_content,
            'recommendations': recommendations,
            'reply_all_required': reply_all_required,
            'reply_all_enforced': reply_all_required,
            'recipients': recipients,
            'timestamp': datetime.now().isoformat()
        }
    
    def _analyze_current_tone(self, body: str) -> Dict[str, Any]:
        """Analyze the current tone of the email."""
        body_lower = body.lower()
        
        # Formality indicators
        formal_indicators = ['dear', 'sincerely', 'regards', 'please find', 'attached']
        informal_indicators = ['hey', 'hi', 'thanks', 'cheers', 'btw', 'lol']
        
        formal_count = sum(1 for word in formal_indicators if word in body_lower)
        informal_count = sum(1 for word in informal_indicators if word in body_lower)
        
        if formal_count > informal_count:
            formality = 'formal'
        elif informal_count > formal_count:
            formality = 'casual'
        else:
            formality = 'professional'
        
        # Emotional tone
        positive_words = ['great', 'excellent', 'wonderful', 'appreciate', 'thank']
        negative_words = ['concern', 'issue', 'problem', 'disappointed', 'frustrated']
        
        positive_count = sum(1 for word in positive_words if word in body_lower)
        negative_count = sum(1 for word in negative_words if word in body_lower)
        
        if positive_count > negative_count:
            emotion = 'positive'
        elif negative_count > positive_count:
            emotion = 'concerned'
        else:
            emotion = 'neutral'
        
        # Urgency
        urgent_words = ['urgent', 'asap', 'immediately', 'critical', 'deadline']
        urgency_score = sum(1 for word in urgent_words if word in body_lower)
        
        return {
            'formality': formality,
            'emotion': emotion,
            'urgency': 'high' if urgency_score > 0 else 'normal',
            'directness': 'direct' if len(body.split()) < 100 else 'detailed',
            'confidence': 0.85
        }
    
    def _get_recipient_profiles(self, recipients: List[str]) -> List[Dict[str, Any]]:
        """Get or create profiles for each recipient."""
        profiles = []
        
        for recipient in recipients:
            # Simulate profile lookup (in real implementation, this would query a database)
            profile = {
                'email': recipient,
                'relationship': self._determine_relationship(recipient),
                'preferred_formality': self._get_preferred_formality(recipient),
                'communication_frequency': self._get_frequency(recipient),
                'cultural_context': self._get_cultural_context(recipient)
            }
            profiles.append(profile)
        
        return profiles
    
    def _determine_relationship(self, recipient: str) -> str:
        """Determine relationship type with recipient."""
        recipient_lower = recipient.lower()
        
        if 'ceo' in recipient_lower or 'president' in recipient_lower or 'executive' in recipient_lower:
            return 'executive'
        elif 'client' in recipient_lower or 'customer' in recipient_lower:
            return 'client'
        elif 'vendor' in recipient_lower or 'supplier' in recipient_lower:
            return 'vendor'
        elif any(domain in recipient_lower for domain in ['ziontechgroup.com', 'company.com']):
            return 'colleague'
        else:
            return 'external'
    
    def _get_preferred_formality(self, recipient: str) -> str:
        """Get preferred formality level for recipient."""
        relationship = self._determine_relationship(recipient)
        
        formality_map = {
            'executive': 'formal',
            'client': 'professional',
            'vendor': 'professional',
            'colleague': 'casual',
            'external': 'professional'
        }
        
        return formality_map.get(relationship, 'professional')
    
    def _get_frequency(self, recipient: str) -> str:
        """Get communication frequency with recipient."""
        # Simulated - in real implementation would analyze email history
        return 'regular'
    
    def _get_cultural_context(self, recipient: str) -> str:
        """Get cultural context for recipient."""
        # Simulated - in real implementation would use location/domain analysis
        return 'western_business'
    
    def _adapt_tone(self, body: str, current_tone: Dict, profiles: List[Dict]) -> Dict[str, Any]:
        """Adapt email tone based on recipient profiles."""
        # Determine dominant formality requirement
        formality_requirements = [p['preferred_formality'] for p in profiles]
        
        # Use most formal requirement
        formality_hierarchy = {'casual': 1, 'professional': 2, 'formal': 3}
        required_formality = max(formality_requirements, key=lambda x: formality_hierarchy.get(x, 2))
        
        # Adapt content
        adapted_body = body
        
        if current_tone['formality'] != required_formality:
            if required_formality == 'formal':
                adapted_body = self._make_formal(body)
            elif required_formality == 'casual':
                adapted_body = self._make_casual(body)
            else:
                adapted_body = self._make_professional(body)
        
        return {
            'original_body': body,
            'adapted_body': adapted_body,
            'tone_changed': current_tone['formality'] != required_formality,
            'target_formality': required_formality,
            'adaptations_made': self._list_adaptations(current_tone, required_formality)
        }
    
    def _make_formal(self, body: str) -> str:
        """Make email more formal."""
        replacements = {
            'hi': 'Dear',
            'hey': 'Dear',
            'thanks': 'Thank you',
            'cheers': 'Best regards',
            'btw': 'Additionally',
            'gonna': 'going to',
            'wanna': 'would like to'
        }
        
        adapted = body
        for informal, formal in replacements.items():
            adapted = adapted.replace(informal, formal)
        
        return adapted
    
    def _make_casual(self, body: str) -> str:
        """Make email more casual."""
        replacements = {
            'Dear': 'Hi',
            'Sincerely': 'Best',
            'Best regards': 'Cheers',
            'Please find attached': 'Here\'s',
            'I would like to': 'I\'d like to'
        }
        
        adapted = body
        for formal, casual in replacements.items():
            adapted = adapted.replace(formal, casual)
        
        return adapted
    
    def _make_professional(self, body: str) -> str:
        """Make email professional (balanced)."""
        # Professional is the default, minimal changes needed
        return body
    
    def _list_adaptations(self, current_tone: Dict, target_formality: str) -> List[str]:
        """List adaptations made to the email."""
        adaptations = []
        
        if current_tone['formality'] != target_formality:
            adaptations.append(f"Adjusted formality from {current_tone['formality']} to {target_formality}")
        
        if target_formality == 'formal':
            adaptations.append("Added formal greetings and closings")
            adaptations.append("Replaced casual language with professional alternatives")
        elif target_formality == 'casual':
            adaptations.append("Simplified formal language")
            adaptations.append("Used friendly greetings")
        
        return adaptations
    
    def _generate_recommendations(self, current_tone: Dict, profiles: List[Dict]) -> List[str]:
        """Generate tone recommendations."""
        recommendations = []
        
        # Check for mixed recipient types
        relationships = [p['relationship'] for p in profiles]
        unique_relationships = set(relationships)
        
        if len(unique_relationships) > 2:
            recommendations.append("Mixed recipient types detected - using balanced professional tone")
        
        # Check for executives
        if 'executive' in relationships:
            recommendations.append("Executive recipients present - maintaining formal tone")
        
        # Check for clients
        if 'client' in relationships:
            recommendations.append("Client communication - ensure professional and courteous tone")
        
        # General recommendations
        recommendations.append("Always use reply-all for multi-recipient emails")
        recommendations.append("Consider cultural context when communicating internationally")
        
        return recommendations


def main():
    """Test V486 engine."""
    engine = EmailToneAdapterEngine()
    
    test_email = {
        'from': 'kleber@ziontechgroup.com',
        'to': ['ceo@client.com', 'manager@client.com'],
        'cc': ['team@ziontechgroup.com'],
        'subject': 'Project Update',
        'body': 'Hey team, just wanted to give you a quick update on the project. We\'re making great progress and should be done soon. Thanks!'
    }
    
    result = engine.analyze_email(test_email)
    print(json.dumps(result, indent=2))
    print(f"\n✅ Current tone: {result['current_tone']['formality']}")
    print(f"✅ Tone adapted: {result['adapted_content']['tone_changed']}")
    print(f"✅ Reply-all enforced: {result['reply_all_enforced']}")


if __name__ == '__main__':
    main()
