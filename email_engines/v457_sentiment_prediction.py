#!/usr/bin/env python3
"""
V457 - AI Email Sentiment Prediction Engine
Predicts recipient reactions before sending and suggests tone adjustments.
Features: Sentiment analysis, reaction prediction, tone adjustment, emoji suggestions.
CRITICAL: Always enforces reply-all for multi-recipient emails.
"""

import json
import re
from datetime import datetime
from typing import Dict, List, Any


class SentimentPredictionEngine:
    """Predicts how recipients will react to your email."""
    
    POSITIVE_INDICATORS = [
        'great', 'excellent', 'thank', 'appreciate', 'wonderful',
        'fantastic', 'love', 'happy', 'pleased', 'congratulations'
    ]
    
    NEGATIVE_INDICATORS = [
        'sorry', 'unfortunately', 'cannot', 'unable', 'reject',
        'disappointed', 'frustrated', 'angry', 'upset', 'problem'
    ]
    
    NEUTRAL_INDICATORS = [
        'regarding', 'following up', 'information', 'update', 'status'
    ]
    
    EMOTION_MAP = {
        'joy': ['great', 'excellent', 'wonderful', 'fantastic', 'happy'],
        'trust': ['reliable', 'dependable', 'consistent', 'proven'],
        'anticipation': ['excited', 'looking forward', 'eager', 'can\'t wait'],
        'surprise': ['amazing', 'incredible', 'unexpected', 'wow'],
        'sadness': ['sorry', 'regret', 'unfortunately', 'miss'],
        'anger': ['frustrated', 'annoyed', 'unacceptable', 'ridiculous']
    }
    
    def analyze_email(self, email: Dict[str, Any]) -> Dict[str, Any]:
        """Predict recipient sentiment response to the email."""
        body = email.get('body', '')
        subject = email.get('subject', '')
        recipients = email.get('to', []) + email.get('cc', [])
        
        text = subject + ' ' + body
        
        sentiment = self._analyze_sentiment(text)
        emotions = self._detect_emotions(text)
        prediction = self._predict_reaction(sentiment, emotions, recipients)
        suggestions = self._generate_suggestions(sentiment, prediction)
        
        reply_all_required = len(recipients) > 1
        
        return {
            'engine': 'V457_SentimentPrediction',
            'sentiment_analysis': sentiment,
            'emotions_detected': emotions,
            'predicted_reaction': prediction,
            'tone_suggestions': suggestions,
            'confidence_score': self._calculate_confidence(text),
            'reply_all_required': reply_all_required,
            'reply_all_enforced': reply_all_required,
            'recipients': recipients,
            'timestamp': datetime.now().isoformat()
        }
    
    def _analyze_sentiment(self, text: str) -> Dict:
        """Analyze overall sentiment of the email."""
        text_lower = text.lower()
        
        pos_count = sum(1 for w in self.POSITIVE_INDICATORS if w in text_lower)
        neg_count = sum(1 for w in self.NEGATIVE_INDICATORS if w in text_lower)
        neutral_count = sum(1 for w in self.NEUTRAL_INDICATORS if w in text_lower)
        
        total = pos_count + neg_count + neutral_count
        
        if total == 0:
            return {'label': 'neutral', 'score': 0.0, 'breakdown': {}}
        
        pos_ratio = pos_count / total
        neg_ratio = neg_count / total
        
        if pos_ratio > neg_ratio + 0.2:
            label = 'positive'
            score = pos_ratio
        elif neg_ratio > pos_ratio + 0.2:
            label = 'negative'
            score = -neg_ratio
        else:
            label = 'neutral'
            score = 0.0
        
        return {
            'label': label,
            'score': round(score, 2),
            'breakdown': {
                'positive': pos_count,
                'negative': neg_count,
                'neutral': neutral_count
            }
        }
    
    def _detect_emotions(self, text: str) -> List[Dict]:
        """Detect emotional undertones in the email."""
        text_lower = text.lower()
        emotions = []
        
        for emotion, keywords in self.EMOTION_MAP.items():
            count = sum(1 for kw in keywords if kw in text_lower)
            if count > 0:
                emotions.append({
                    'emotion': emotion,
                    'intensity': min(1.0, count * 0.3),
                    'keywords_found': [kw for kw in keywords if kw in text_lower]
                })
        
        return emotions
    
    def _predict_reaction(self, sentiment: Dict, emotions: List[Dict], recipients: List[str]) -> Dict:
        """Predict how recipients will react."""
        if sentiment['label'] == 'positive':
            reaction = 'positive'
            likely_responses = ['appreciative', 'engaged', 'responsive']
            risk = 'low'
        elif sentiment['label'] == 'negative':
            reaction = 'defensive'
            likely_responses = ['concerned', 'questioning', 'escalating']
            risk = 'high'
        else:
            reaction = 'neutral'
            likely_responses = ['acknowledging', 'informational', 'brief']
            risk = 'low'
        
        return {
            'predicted_reaction': reaction,
            'likely_responses': likely_responses,
            'engagement_risk': risk,
            'recommended_followup': self._suggest_followup(reaction)
        }
    
    def _suggest_followup(self, reaction: str) -> str:
        """Suggest follow-up action."""
        followups = {
            'positive': 'Consider scheduling a follow-up meeting to build momentum',
            'defensive': 'Follow up within 24 hours to address concerns proactively',
            'neutral': 'Send a brief check-in after 48 hours if no response'
        }
        return followups.get(reaction, 'Monitor for response')
    
    def _generate_suggestions(self, sentiment: Dict, prediction: Dict) -> List[str]:
        """Generate tone adjustment suggestions."""
        suggestions = []
        
        if sentiment['label'] == 'negative' and prediction['predicted_reaction'] == 'defensive':
            suggestions.append("Consider softening the tone to reduce defensiveness")
            suggestions.append("Add empathetic language before delivering bad news")
            suggestions.append("Offer solutions alongside problems")
        
        if sentiment['label'] == 'positive':
            suggestions.append("Great positive tone! Consider adding a clear call to action")
        
        if not suggestions:
            suggestions.append("Tone is appropriate for the context")
        
        suggestions.append("Always use reply-all for multi-recipient emails")
        
        return suggestions
    
    def _calculate_confidence(self, text: str) -> float:
        """Calculate prediction confidence score."""
        word_count = len(re.findall(r'\b\w+\b', text))
        
        if word_count < 10:
            return 0.4
        elif word_count < 50:
            return 0.7
        else:
            return 0.9


def main():
    """Test V457 engine."""
    engine = SentimentPredictionEngine()
    
    test_email = {
        'from': 'kleber@ziontechgroup.com',
        'to': ['client@acme.com', 'team@ziontechgroup.com'],
        'cc': ['manager@acme.com'],
        'subject': 'Re: Project Update - Great Progress!',
        'body': 'Thank you for the excellent update! We are thrilled with the progress your team has made. The quality of work has been wonderful and we appreciate your dedication. Looking forward to our next milestone!'
    }
    
    result = engine.analyze_email(test_email)
    print(json.dumps(result, indent=2))
    print(f"\n✅ Sentiment: {result['sentiment_analysis']['label']} ({result['sentiment_analysis']['score']})")
    print(f"✅ Predicted reaction: {result['predicted_reaction']['predicted_reaction']}")
    print(f"✅ Confidence: {result['confidence_score']}")
    print(f"✅ Reply-all enforced: {result['reply_all_enforced']}")


if __name__ == '__main__':
    main()
