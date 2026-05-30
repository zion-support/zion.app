#!/usr/bin/env python3
"""
V361: Email Sentiment Evolution Tracker
Track sentiment changes across email threads over time, detect relationship health trends,
predict churn risk from sentiment patterns, trigger proactive retention actions.
"""
import re
import json
from datetime import datetime
from typing import Dict, List, Tuple

class SentimentEvolutionTracker:
    def __init__(self):
        self.positive_patterns = [
            r'thank(?:s| you)', r'appreciate', r'excellent', r'great', r'wonderful',
            r'amazing', r'fantastic', r'love', r'impressed', r'pleased', r'satisfied',
            r'happy', r'delighted', r'perfect', r'outstanding', r'superb'
        ]
        self.negative_patterns = [
            r'disappointed', r'frustrated', r'angry', r'upset', r'unhappy',
            r'terrible', r'awful', r'horrible', r'worst', r'never', r'always',
            r'cancel', r'refund', r'complaint', r'issue', r'problem', r'concern'
        ]
        self.escalation_patterns = [
            r'manager', r'supervisor', r'executive', r'ceo', r'legal',
            r'lawyer', r'better business bureau', r'bbb', r'review', r'social media'
        ]
        
    def analyze_sentiment(self, text: str) -> Tuple[float, str]:
        """Calculate sentiment score and label"""
        text_lower = text.lower()
        positive_count = sum(1 for p in self.positive_patterns if re.search(p, text_lower))
        negative_count = sum(1 for p in self.negative_patterns if re.search(p, text_lower))
        
        total = positive_count + negative_count
        if total == 0:
            return 0.5, 'neutral'
        
        score = positive_count / total
        if score > 0.6:
            return score, 'positive'
        elif score < 0.4:
            return score, 'negative'
        else:
            return score, 'neutral'
    
    def detect_churn_risk(self, thread_sentiments: List[float]) -> Dict:
        """Predict churn risk from sentiment trajectory"""
        if len(thread_sentiments) < 3:
            return {'risk_level': 'insufficient_data', 'score': 0.0}
        
        recent = thread_sentiments[-3:]
        trend = sum(recent) / len(recent) - sum(thread_sentiments[:3]) / min(3, len(thread_sentiments[:3]))
        
        risk_score = 0.0
        if trend < -0.2:
            risk_score += 0.4
        if recent[-1] < 0.3:
            risk_score += 0.3
        if min(recent) < 0.2:
            risk_score += 0.3
        
        risk_level = 'high' if risk_score > 0.6 else 'medium' if risk_score > 0.3 else 'low'
        
        return {
            'risk_level': risk_level,
            'score': round(risk_score, 2),
            'trend': round(trend, 3),
            'recent_sentiments': [round(s, 2) for s in recent],
            'recommended_action': self._get_retention_action(risk_level)
        }
    
    def _get_retention_action(self, risk_level: str) -> str:
        actions = {
            'high': 'Immediate executive outreach with retention offer',
            'medium': 'Customer success manager follow-up within 24 hours',
            'low': 'Standard engagement monitoring'
        }
        return actions.get(risk_level, 'Continue monitoring')
    
    def track_thread_evolution(self, emails: List[Dict]) -> Dict:
        """Track sentiment evolution across email thread"""
        evolution = []
        for email in emails:
            score, label = self.analyze_sentiment(email.get('body', ''))
            evolution.append({
                'timestamp': email.get('timestamp'),
                'sender': email.get('sender'),
                'score': score,
                'label': label
            })
        
        sentiments = [e['score'] for e in evolution]
        churn_risk = self.detect_churn_risk(sentiments)
        
        # Reply-all enforcement
        recipients = emails[-1].get('recipients', []) if emails else []
        reply_all_required = len(recipients) > 1
        
        return {
            'engine': 'V361',
            'thread_evolution': evolution,
            'overall_trend': self._calculate_trend(sentiments),
            'relationship_health': self._assess_health(sentiments),
            'churn_risk': churn_risk,
            'reply_all_required': reply_all_required,
            'reply_all_enforced': reply_all_required,
            'timestamp': datetime.now().isoformat()
        }
    
    def _calculate_trend(self, sentiments: List[float]) -> str:
        if len(sentiments) < 2:
            return 'insufficient_data'
        change = sentiments[-1] - sentiments[0]
        if change > 0.15:
            return 'improving'
        elif change < -0.15:
            return 'deteriorating'
        return 'stable'
    
    def _assess_health(self, sentiments: List[float]) -> str:
        if not sentiments:
            return 'unknown'
        avg = sum(sentiments) / len(sentiments)
        if avg > 0.7:
            return 'excellent'
        elif avg > 0.5:
            return 'good'
        elif avg > 0.3:
            return 'at_risk'
        return 'critical'

if __name__ == '__main__':
    tracker = SentimentEvolutionTracker()
    sample_thread = [
        {'timestamp': '2024-01-01T10:00:00', 'sender': 'customer@example.com', 
         'body': 'Thank you for the excellent service, I am very pleased!', 'recipients': ['support@company.com']},
        {'timestamp': '2024-01-05T14:30:00', 'sender': 'customer@example.com',
         'body': 'I have a concern about the recent update, there seems to be an issue.', 'recipients': ['support@company.com']},
        {'timestamp': '2024-01-08T09:15:00', 'sender': 'customer@example.com',
         'body': 'This is frustrating. The problem is still not resolved and I am disappointed.', 'recipients': ['support@company.com']},
        {'timestamp': '2024-01-10T16:45:00', 'sender': 'customer@example.com',
         'body': 'I am very upset. This is terrible service. I want to speak to a manager or I will cancel.', 'recipients': ['support@company.com']}
    ]
    
    result = tracker.track_thread_evolution(sample_thread)
    print(json.dumps(result, indent=2))
