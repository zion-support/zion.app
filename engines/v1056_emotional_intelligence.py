#!/usr/bin/env python3
"""V1056: AI Email Emotional Intelligence Engine
Detect emotional state of sender (frustration, excitement, confusion, urgency).
Adapt response tone to match emotional context.
De-escalate angry customers with empathy-first responses.
MANDATORY: Reply-all enforcement for multi-recipient emails.
"""

import re
import json
from datetime import datetime
from collections import defaultdict

class EmotionalIntelligenceEngine:
    def __init__(self):
        self.emotion_lexicon = {
            'frustration': {
                'keywords': ['frustrated', 'annoyed', 'fed up', 'irritated', 'unacceptable', 'ridiculous',
                           'again', 'still', 'always', 'never works', 'waste of time', 'pointless'],
                'intensity_words': ['extremely', 'very', 'so', 'incredibly', 'absolutely'],
                'punctuation_signals': ['!!!', '???', '...'],
                'escalation_triggers': ['manager', 'supervisor', 'complaint', 'legal', 'refund']
            },
            'anger': {
                'keywords': ['angry', 'furious', 'outraged', 'disgusted', 'appalled', 'horrified',
                           'terrible', 'worst', 'horrible', 'pathetic', 'useless', 'incompetent'],
                'intensity_words': ['extremely', 'very', 'so', 'absolutely', 'completely'],
                'punctuation_signals': ['!!!', '!?'],
                'escalation_triggers': ['sue', 'lawyer', 'attorney', 'report', 'BBB', 'review']
            },
            'excitement': {
                'keywords': ['excited', 'amazing', 'fantastic', 'wonderful', 'love', 'great',
                           'awesome', 'brilliant', 'excellent', 'perfect', 'thrilled', 'delighted'],
                'intensity_words': ['very', 'so', 'incredibly', 'absolutely', 'really'],
                'punctuation_signals': ['!!!', '!!'],
                'positive_signals': ['thank you', 'appreciate', 'grateful', 'impressed']
            },
            'confusion': {
                'keywords': ['confused', 'don\'t understand', 'unclear', 'not sure', 'what does',
                           'how do', 'where is', 'can\'t find', 'lost', 'complicated', 'complex'],
                'question_signals': ['?', 'how', 'what', 'where', 'when', 'why', 'which'],
                'help_seeking': ['help', 'assist', 'guide', 'explain', 'clarify', 'walk through']
            },
            'anxiety': {
                'keywords': ['worried', 'concerned', 'anxious', 'nervous', 'stressed', 'overwhelmed',
                           'deadline', 'urgent', 'running out', 'behind', 'late', 'pressure'],
                'time_pressure': ['asap', 'immediately', 'urgent', 'emergency', 'critical'],
                'uncertainty': ['not sure if', 'might not', 'could fail', 'what if']
            },
            'satisfaction': {
                'keywords': ['happy', 'satisfied', 'pleased', 'content', 'good', 'nice',
                           'works well', 'easy', 'smooth', 'helpful', 'efficient'],
                'loyalty_signals': ['will recommend', 'tell others', 'continue using', 'renew', 'upgrade'],
                'appreciation': ['thanks', 'thank you', 'appreciate', 'grateful']
            },
            'sadness': {
                'keywords': ['disappointed', 'sad', 'unfortunately', 'regret', 'sorry to say',
                           'not working out', 'cancel', 'leaving', 'switching', 'goodbye'],
                'loss_signals': ['lost', 'miss', 'gone', 'no longer', 'ended']
            },
            'urgency': {
                'keywords': ['urgent', 'asap', 'immediately', 'emergency', 'critical', 'right now',
                           'deadline', 'time-sensitive', 'cannot wait', 'must', 'need today'],
                'time_constraints': ['by end of day', 'tonight', 'this hour', 'within minutes'],
                'consequences': ['will lose', 'miss deadline', 'fail', 'problem', 'disaster']
            }
        }
        
        self.response_strategies = {
            'frustration': {
                'tone': 'empathetic_and_solution_focused',
                'opening': 'I understand your frustration and I apologize for the inconvenience.',
                'approach': 'Acknowledge → Apologize → Solve → Follow up',
                'avoid': ['defensive language', 'blame', 'excuses', 'minimizing concerns']
            },
            'anger': {
                'tone': 'calm_and_deescalating',
                'opening': 'I hear your concerns and I take this very seriously.',
                'approach': 'Listen → Validate → Take ownership → Escalate if needed',
                'avoid': ['arguing', 'contradicting', 'dismissing', 'rushing']
            },
            'excitement': {
                'tone': 'enthusiastic_and_supportive',
                'opening': 'That\'s wonderful news! I\'m thrilled to hear about your success.',
                'approach': 'Celebrate → Reinforce → Expand → Next steps',
                'avoid': ['being flat', 'ignoring enthusiasm', 'changing subject abruptly']
            },
            'confusion': {
                'tone': 'patient_and_clear',
                'opening': 'I\'d be happy to clarify this for you.',
                'approach': 'Simplify → Step-by-step → Visual aids → Confirm understanding',
                'avoid': ['jargon', 'assumptions', 'rushing', 'condescension']
            },
            'anxiety': {
                'tone': 'reassuring_and_supportive',
                'opening': 'I understand this is concerning. Let me help put your mind at ease.',
                'approach': 'Reassure → Provide certainty → Offer support → Set expectations',
                'avoid': ['dismissing worries', 'false promises', 'vague answers']
            },
            'satisfaction': {
                'tone': 'warm_and_appreciative',
                'opening': 'Thank you for your kind words! It\'s great to hear you\'re enjoying...',
                'approach': 'Thank → Reinforce → Ask for feedback → Suggest upgrades',
                'avoid': ['being transactional', 'missing upsell opportunity', 'being too sales-y']
            },
            'sadness': {
                'tone': 'empathetic_and_understanding',
                'opening': 'I\'m sorry to hear that. I understand this is disappointing.',
                'approach': 'Empathize → Understand why → Offer alternatives → Leave door open',
                'avoid': ['being pushy', 'ignoring feelings', 'immediate counter-offers']
            },
            'urgency': {
                'tone': 'efficient_and_action_oriented',
                'opening': 'I understand the urgency. Here\'s what I\'m doing right now...',
                'approach': 'Act fast → Provide status → Set expectations → Deliver',
                'avoid': ['delays', 'unnecessary details', 'slow responses']
            }
        }
    
    def analyze_email_emotions(self, email_data):
        """Analyze emotional state from email content."""
        sender = email_data.get('sender', 'unknown')
        recipients = email_data.get('recipients', [])
        subject = email_data.get('subject', '')
        body = email_data.get('body', '')
        
        # REPLY-ALL ENFORCEMENT
        reply_all = len(recipients) > 1
        
        text = (subject + ' ' + body).lower()
        
        # Detect emotions
        emotions = self._detect_emotions(text, body)
        
        # Determine primary emotion
        primary_emotion = self._get_primary_emotion(emotions)
        
        # Calculate emotional intensity
        intensity = self._calculate_intensity(emotions, body)
        
        # Get response strategy
        strategy = self.response_strategies.get(primary_emotion, self.response_strategies['satisfaction'])
        
        # Generate empathetic response
        response = self._generate_empathetic_response(primary_emotion, strategy, email_data)
        
        # Detect escalation risk
        escalation_risk = self._assess_escalation_risk(primary_emotion, intensity, body)
        
        return {
            'email_id': email_data.get('id'),
            'reply_all_required': reply_all,
            'detected_emotions': emotions,
            'primary_emotion': primary_emotion,
            'emotional_intensity': intensity,
            'response_strategy': strategy,
            'suggested_response': response,
            'escalation_risk': escalation_risk,
            'empathy_score': self._calculate_empathy_score(response),
            'de_escalation_tips': self._get_deescalation_tips(primary_emotion, intensity),
            'relationship_preservation': self._get_relationship_tips(primary_emotion, email_data),
            'contact_info': {
                'phone': '+1 302 464 0950',
                'email': 'kleber@ziontechgroup.com',
                'address': '364 E Main St STE 1008, Middletown DE 19709'
            }
        }
    
    def _detect_emotions(self, text, raw_body):
        """Detect all emotions present in the text."""
        emotions = {}
        
        for emotion, config in self.emotion_lexicon.items():
            score = 0
            matched_keywords = []
            
            # Check keywords
            for keyword in config.get('keywords', []):
                if keyword in text:
                    score += 1
                    matched_keywords.append(keyword)
            
            # Check intensity words (amplify score)
            intensity_multiplier = 1
            for word in config.get('intensity_words', []):
                if word in text:
                    intensity_multiplier += 0.5
            
            # Check punctuation signals
            for punct in config.get('punctuation_signals', []):
                if punct in raw_body:
                    score += 0.5
            
            if score > 0:
                emotions[emotion] = {
                    'score': round(score * intensity_multiplier, 2),
                    'keywords_found': matched_keywords,
                    'confidence': min(100, int(score * intensity_multiplier * 20))
                }
        
        return emotions
    
    def _get_primary_emotion(self, emotions):
        """Determine the dominant emotion."""
        if not emotions:
            return 'neutral'
        
        # Priority order for conflicts
        priority = ['anger', 'frustration', 'urgency', 'anxiety', 'sadness', 'confusion', 'excitement', 'satisfaction']
        
        # Sort by score
        sorted_emotions = sorted(emotions.items(), key=lambda x: x[1]['score'], reverse=True)
        
        # If scores are close, use priority
        if len(sorted_emotions) > 1 and sorted_emotions[0][1]['score'] - sorted_emotions[1][1]['score'] < 1:
            for emotion in priority:
                if emotion in emotions:
                    return emotion
        
        return sorted_emotions[0][0] if sorted_emotions else 'neutral'
    
    def _calculate_intensity(self, emotions, raw_body):
        """Calculate emotional intensity (0-100)."""
        if not emotions:
            return 0
        
        max_score = max(e['score'] for e in emotions.values())
        
        # Punctuation amplification
        exclamation_count = raw_body.count('!')
        question_count = raw_body.count('?')
        caps_words = len(re.findall(r'\b[A-Z]{3,}\b', raw_body))
        
        punctuation_boost = min(20, (exclamation_count * 2 + question_count + caps_words * 3))
        
        intensity = min(100, int(max_score * 15 + punctuation_boost))
        
        if intensity >= 80:
            return {'level': 'very_high', 'score': intensity, 'action': 'Immediate attention required'}
        elif intensity >= 60:
            return {'level': 'high', 'score': intensity, 'action': 'Priority response needed'}
        elif intensity >= 40:
            return {'level': 'moderate', 'score': intensity, 'action': 'Standard response'}
        else:
            return {'level': 'low', 'score': intensity, 'action': 'Normal handling'}
    
    def _generate_empathetic_response(self, emotion, strategy, email_data):
        """Generate an empathetic response template."""
        subject = email_data.get('subject', '')
        body = email_data.get('body', '')
        
        response = {
            'opening': strategy['opening'],
            'structure': strategy['approach'],
            'tone': strategy['tone'],
            'avoid': strategy['avoid'],
            'template': self._build_response_template(emotion, strategy, email_data)
        }
        
        return response
    
    def _build_response_template(self, emotion, strategy, email_data):
        """Build a response template based on emotion."""
        templates = {
            'frustration': """I completely understand your frustration with [issue]. You're absolutely right to expect better.

Here's what I'm doing to resolve this:
1. [Immediate action]
2. [Follow-up step]
3. [Prevention measure]

I'll personally follow up with you by [timeframe] to ensure this is fully resolved.

Is there anything else I can do to make this right?""",
            
            'anger': """I hear your concerns and I want you to know I take this very seriously.

I understand that [specific issue] has caused [impact]. That's not the experience we want for you.

Here's my commitment to you:
• [Immediate resolution step]
• [Compensation/goodwill gesture if applicable]
• [Long-term fix]

I'd like to schedule a call to discuss this further and ensure we make this right. What time works best for you?""",
            
            'excitement': """That's fantastic news! I'm so glad to hear [positive outcome].

Your success with [product/service] is exactly what we strive for. Here are some ways to build on this momentum:

• [Related feature/service suggestion]
• [Advanced tip or best practice]
• [Community or resource to join]

Keep up the great work! Let me know if there's anything else I can help with.""",
            
            'confusion': """I'd be happy to clarify this for you! Let me break it down step by step:

**Step 1:** [Clear instruction]
**Step 2:** [Clear instruction]
**Step 3:** [Clear instruction]

Here's a quick visual guide: [link to diagram/video if available]

Does this help? If you have any other questions, I'm here to help. Would a quick screen-share call be helpful?""",
            
            'anxiety': """I understand your concern about [issue], and I want to reassure you that we've got this covered.

Here's the current status:
✓ [What's done]
✓ [What's in progress]
→ [What's next with timeline]

I'm personally monitoring this and will send you updates every [timeframe] until it's resolved.

Is there anything specific I can do to help ease your concerns?""",
            
            'satisfaction': """Thank you so much for your kind words! It's wonderful to hear that [specific positive feedback].

Since you're enjoying [product/service], you might also like:
• [Related feature they haven't tried]
• [Upgrade or premium option]
• [Referral program]

We truly value your business. Is there anything else we can do to make your experience even better?"""
        }
        
        return templates.get(emotion, "Thank you for your email. I've reviewed your message and here's how I can help...")
    
    def _assess_escalation_risk(self, emotion, intensity, body):
        """Assess risk of escalation to management/legal."""
        risk_level = 'low'
        risk_factors = []
        
        text = body.lower()
        
        # High-risk indicators
        if emotion in ['anger', 'frustration'] and intensity['score'] >= 70:
            risk_level = 'high'
            risk_factors.append('High emotional intensity with negative emotion')
        
        if any(word in text for word in ['lawyer', 'attorney', 'sue', 'legal action', 'court']):
            risk_level = 'critical'
            risk_factors.append('Legal threat detected')
        
        if any(word in text for word in ['manager', 'supervisor', 'ceo', 'executive', 'complaint department']):
            risk_level = 'high' if risk_level != 'critical' else 'critical'
            risk_factors.append('Request for escalation')
        
        if any(word in text for word in ['review', 'social media', 'twitter', 'linkedin', 'public']):
            risk_level = 'high' if risk_level == 'low' else risk_level
            risk_factors.append('Public reputation risk')
        
        if any(word in text for word in ['cancel', 'refund', 'leave', 'switch', 'competitor']):
            risk_level = 'medium' if risk_level == 'low' else risk_level
            risk_factors.append('Churn risk detected')
        
        return {
            'level': risk_level,
            'factors': risk_factors,
            'recommended_action': 'Escalate to manager immediately' if risk_level == 'critical' else
                                'Proactive outreach with solution' if risk_level == 'high' else
                                'Monitor and respond empathetically' if risk_level == 'medium' else
                                'Standard response'
        }
    
    def _calculate_empathy_score(self, response):
        """Calculate empathy score of suggested response."""
        score = 70  # Base score for having a structured response
        
        # Check for empathy indicators
        empathy_words = ['understand', 'sorry', 'appreciate', 'hear', 'concern', 'frustration',
                        'apologize', 'take seriously', 'personally', 'commitment']
        
        template = response.get('template', '').lower()
        for word in empathy_words:
            if word in template:
                score += 3
        
        return min(100, score)
    
    def _get_deescalation_tips(self, emotion, intensity):
        """Get specific de-escalation tips."""
        tips = []
        
        if emotion in ['anger', 'frustration']:
            tips.append('🕐 Respond within 1 hour - speed shows you care')
            tips.append('📞 Offer a phone call - voice conveys empathy better than text')
            tips.append('🎁 Consider a goodwill gesture (discount, credit, upgrade)')
            tips.append('👤 Use their name frequently to personalize the interaction')
            tips.append('✅ Provide specific timelines, not vague promises')
        
        if intensity['score'] >= 70:
            tips.append('🚨 Consider involving a senior team member')
            tips.append('📝 Document all commitments made')
            tips.append('🔄 Follow up within 24 hours to confirm resolution')
        
        return tips if tips else ['Standard empathetic response protocol']
    
    def _get_relationship_tips(self, emotion, email_data):
        """Get tips for preserving the business relationship."""
        tips = []
        
        if emotion in ['anger', 'frustration', 'sadness']:
            tips.append('Send a personal follow-up after resolution')
            tips.append('Offer exclusive benefits to rebuild trust')
            tips.append('Schedule a relationship review call in 30 days')
        elif emotion == 'excitement':
            tips.append('Leverage positive momentum for case study request')
            tips.append('Ask for referral or testimonial')
            tips.append('Suggest expansion opportunities')
        elif emotion == 'satisfaction':
            tips.append('Request a review or testimonial')
            tips.append('Introduce loyalty program or upgrade path')
        
        return tips


if __name__ == '__main__':
    engine = EmotionalIntelligenceEngine()
    
    test_emails = [
        {
            'id': 'e001',
            'sender': 'angry_customer@company.com',
            'recipients': ['support@ziontechgroup.com', 'manager@ziontechgroup.com'],
            'subject': 'URGENT: Service still not working!!! This is UNACCEPTABLE!!!',
            'body': """I am EXTREMELY frustrated!!! This is the THIRD time I'm writing about this issue and it's STILL not fixed!!!

Your service is terrible and I'm wasting so much time. I want to speak to your manager IMMEDIATELY or I will leave a terrible review and switch to your competitor.

Fix this NOW or I want a full refund!!!"""
        },
        {
            'id': 'e002',
            'sender': 'happy_client@startup.io',
            'recipients': ['success@ziontechgroup.com'],
            'subject': 'Amazing results! Love the new AI features!!!',
            'body': """Hi team!

I just wanted to say how thrilled I am with the new AI features! The automation saved us 20 hours this week alone. This is absolutely fantastic!

We're so impressed that we want to upgrade to the Enterprise plan. Can you send me the pricing details?

Thank you for building such an awesome product!"""
        },
        {
            'id': 'e003',
            'sender': 'confused_user@business.com',
            'recipients': ['support@ziontechgroup.com', 'training@ziontechgroup.com'],
            'subject': 'Help - I don\'t understand how to set up the integration',
            'body': """Hi,

I'm really confused about how to set up the API integration. The documentation is not clear and I can't find where to get my API key.

How do I:
- Find my API credentials?
- Configure the webhook URL?
- Test the connection?

Can someone please walk me through this step by step? I'm not very technical.

Thanks for your help."""
        }
    ]
    
    print("=== V1056: AI Email Emotional Intelligence Engine ===\n")
    
    for email in test_emails:
        result = engine.analyze_email_emotions(email)
        print(f"Email: {email['subject'][:60]}...")
        print(f"  Primary Emotion: {result['primary_emotion'].upper()}")
        print(f"  Intensity: {result['emotional_intensity']['level']} ({result['emotional_intensity']['score']}/100)")
        print(f"  Reply-All: {'REQUIRED' if result['reply_all_required'] else 'N/A'}")
        print(f"  Escalation Risk: {result['escalation_risk']['level'].upper()}")
        print(f"  Empathy Score: {result['empathy_score']}/100")
        
        if result['detected_emotions']:
            print(f"  Emotions detected: {', '.join(result['detected_emotions'].keys())}")
        
        print(f"  Strategy: {result['response_strategy']['approach']}")
        
        for tip in result['de_escalation_tips'][:2]:
            print(f"  💡 {tip}")
        print()
