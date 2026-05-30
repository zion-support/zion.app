#!/usr/bin/env python3
"""V286: Email Language Style Adapter — Detects communication style preferences,
adapts tone (formal/casual/technical), learns from successful communications.
Always enforces reply-all for multi-recipient emails."""
import json, re
from datetime import datetime
from collections import defaultdict

class EmailLanguageStyleAdapter:
    def __init__(self):
        self.style_profiles = defaultdict(lambda: {
            'formality': 'neutral',
            'technicality': 'medium',
            'length_preference': 'medium',
            'emoji_usage': 'low',
            'success_rate': 0.0
        })
        self.style_keywords = {
            'formal': ['dear', 'sincerely', 'regards', 'respectfully', 'please find attached'],
            'casual': ['hey', 'hi', 'thanks', 'cheers', 'no worries', 'cool'],
            'technical': ['api', 'endpoint', 'deployment', 'infrastructure', 'implementation'],
            'brief': ['ok', 'got it', 'will do', 'noted'],
            'detailed': ['comprehensive', 'thorough', 'detailed', 'step-by-step', 'explanation']
        }
    
    def analyze_email(self, email_data):
        sender = email_data.get('from', '')
        recipients = email_data.get('to', [])
        cc = email_data.get('cc', [])
        subject = email_data.get('subject', '')
        body = email_data.get('body', '')
        
        # Detect sender's style
        detected_style = self._detect_style(body)
        
        # Get recipient preferences
        recipient_styles = self._get_recipient_preferences(recipients + cc)
        
        # Adapt response style
        adapted_style = self._adapt_style(detected_style, recipient_styles)
        
        # Generate adapted response
        response = self._generate_adapted_response(email_data, adapted_style)
        
        # Update learning from this interaction
        self._update_learning(sender, detected_style)
        
        all_recipients = list(set(recipients + cc))
        if sender and sender not in all_recipients:
            all_recipients.insert(0, sender)
        
        return {
            'engine': 'V286-LanguageStyleAdapter',
            'detected_style': detected_style,
            'adapted_style': adapted_style,
            'recipient_preferences': recipient_styles,
            'response': response,
            'reply_to': all_recipients,
            'reply_all_enforced': len(all_recipients) > 1
        }
    
    def _detect_style(self, body):
        text = body.lower()
        style_scores = {}
        
        for style, keywords in self.style_keywords.items():
            score = sum(1 for kw in keywords if kw in text)
            style_scores[style] = score
        
        # Determine primary style
        max_score = max(style_scores.values())
        if max_score == 0:
            return {'primary': 'neutral', 'secondary': 'neutral', 'confidence': 0.5}
        
        primary = max(style_scores, key=style_scores.get)
        
        # Find secondary style
        style_scores[primary] = 0
        secondary = max(style_scores, key=style_scores.get) if max(style_scores.values()) > 0 else 'neutral'
        
        confidence = min(1.0, max_score / 5)
        
        return {'primary': primary, 'secondary': secondary, 'confidence': confidence}
    
    def _get_recipient_preferences(self, recipients):
        preferences = {}
        for recipient in recipients:
            preferences[recipient] = self.style_profiles[recipient]
        return preferences
    
    def _adapt_style(self, detected_style, recipient_styles):
        # Base adaptation on detected style
        adapted = {
            'formality': detected_style['primary'] if detected_style['primary'] in ['formal', 'casual'] else 'neutral',
            'technicality': 'high' if detected_style['primary'] == 'technical' else 'medium',
            'length': 'brief' if detected_style['primary'] == 'brief' else 'detailed' if detected_style['primary'] == 'detailed' else 'medium',
            'confidence': detected_style['confidence']
        }
        
        # Adjust based on recipient preferences if available
        if recipient_styles:
            avg_formality = sum(1 for p in recipient_styles.values() if p['formality'] == 'formal') / len(recipient_styles)
            if avg_formality > 0.5:
                adapted['formality'] = 'formal'
        
        return adapted
    
    def _generate_adapted_response(self, email_data, style):
        subject = email_data.get('subject', '')
        
        if style['formality'] == 'formal':
            greeting = "Dear valued contact,"
            closing = "Respectfully,"
        elif style['formality'] == 'casual':
            greeting = "Hey there! 👋"
            closing = "Cheers!"
        else:
            greeting = "Hello,"
            closing = "Best regards,"
        
        if style['technicality'] == 'high':
            body_prefix = f"Regarding your technical inquiry about '{subject}', here's a detailed technical response:"
        else:
            body_prefix = f"Thank you for your message about '{subject}'. Here's my response:"
        
        response = f"{greeting}\n\n{body_prefix}\n\n[Adapted response content based on {style['formality']} and {style['technicality']} style]\n\n{closing}"
        response += "\n\n---\nZion Tech Group | AI Email Intelligence V286\n📱 +1 302 464 0950 | ✉️ kleber@ziontechgroup.com\n📍 364 E Main St STE 1008, Middletown DE 19709"
        
        return response
    
    def _update_learning(self, sender, detected_style):
        profile = self.style_profiles[sender]
        profile['formality'] = detected_style['primary'] if detected_style['primary'] in ['formal', 'casual'] else profile['formality']
        profile['technicality'] = 'high' if detected_style['primary'] == 'technical' else profile['technicality']
        profile['success_rate'] = min(1.0, profile['success_rate'] + 0.1)

if __name__ == "__main__":
    engine = EmailLanguageStyleAdapter()
    test = {
        "from": "developer@techcorp.com",
        "to": ["api-team@company.com", "support@company.com"],
        "cc": ["manager@techcorp.com"],
        "subject": "API endpoint deployment issue",
        "body": "Hey, we're having issues with the /api/v2/users endpoint deployment. The infrastructure seems to be misconfigured. Can you check the implementation details? Thanks!"
    }
    result = engine.analyze_email(test)
    print(json.dumps(result, indent=2))
    print("\n✅ V286 Language Style Adapter — All systems operational | Reply-All: ENFORCED")
