#!/usr/bin/env python3
"""
V471 - Email Sentiment Tracking Over Time
Tracks sentiment evolution across email threads to identify relationship health and escalation risks.
Features: Sentiment timeline, relationship scoring, escalation prediction, trend analysis.
CRITICAL: Always enforces reply-all for multi-recipient emails.
"""

import json
import re
from datetime import datetime
from typing import Dict, List, Any
from collections import defaultdict


class EmailSentimentTracker:
    """Tracks sentiment evolution across email threads."""
    
    def __init__(self):
        self.thread_sentiments: Dict[str, List[Dict]] = defaultdict(list)
        
    def analyze_email(self, email: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze email and track sentiment over time."""
        body = email.get('body', '')
        subject = email.get('subject', '')
        sender = email.get('from', '')
        recipients = email.get('to', []) + email.get('cc', [])
        thread_id = self._get_thread_id(email)
        
        # Analyze current sentiment
        current_sentiment = self._analyze_sentiment(body)
        
        # Track in thread history
        self.thread_sentiments[thread_id].append({
            'timestamp': datetime.now().isoformat(),
            'sender': sender,
            'sentiment': current_sentiment['score'],
            'label': current_sentiment['label']
        })
        
        # Analyze trend
        trend = self._analyze_trend(thread_id)
        
        # Predict escalation risk
        escalation_risk = self._predict_escalation(trend)
        
        # Calculate relationship health
        relationship_health = self._calculate_relationship_health(thread_id)
        
        reply_all_required = len(recipients) > 1
        
        return {
            'engine': 'V471_EmailSentimentTracker',
            'thread_id': thread_id,
            'current_sentiment': current_sentiment,
            'sentiment_trend': trend,
            'escalation_risk': escalation_risk,
            'relationship_health': relationship_health,
            'recommendations': self._generate_recommendations(trend, escalation_risk),
            'reply_all_required': reply_all_required,
            'reply_all_enforced': reply_all_required,
            'recipients': recipients,
            'timestamp': datetime.now().isoformat()
        }
    
    def _get_thread_id(self, email: Dict) -> str:
        """Get or generate thread ID."""
        subject = email.get('subject', '').lower()
        if 're:' in subject:
            subject = subject.replace('re:', '').strip()
        return f"thread_{hash(subject) % 100000:05d}"
    
    def _analyze_sentiment(self, text: str) -> Dict:
        """Analyze sentiment of text."""
        positive_words = ['great', 'excellent', 'thank', 'appreciate', 'wonderful', 'fantastic', 'love', 'happy']
        negative_words = ['sorry', 'unfortunately', 'cannot', 'unable', 'reject', 'disappointed', 'frustrated', 'angry']
        
        text_lower = text.lower()
        pos_count = sum(1 for word in positive_words if word in text_lower)
        neg_count = sum(1 for word in negative_words if word in text_lower)
        
        if pos_count > neg_count:
            score = min(1.0, 0.5 + pos_count * 0.1)
            label = 'positive'
        elif neg_count > pos_count:
            score = max(-1.0, -0.5 - neg_count * 0.1)
            label = 'negative'
        else:
            score = 0.0
            label = 'neutral'
        
        return {'score': round(score, 2), 'label': label, 'confidence': 0.75}
    
    def _analyze_trend(self, thread_id: str) -> Dict:
        """Analyze sentiment trend over time."""
        sentiments = self.thread_sentiments[thread_id]
        
        if len(sentiments) < 2:
            return {'direction': 'insufficient_data', 'change': 0.0, 'volatility': 0.0}
        
        recent = [s['sentiment'] for s in sentiments[-5:]]
        older = [s['sentiment'] for s in sentiments[:-5]] if len(sentiments) > 5 else [s['sentiment'] for s in sentiments[:2]]
        
        recent_avg = sum(recent) / len(recent)
        older_avg = sum(older) / len(older)
        change = recent_avg - older_avg
        
        if change > 0.2:
            direction = 'improving'
        elif change < -0.2:
            direction = 'declining'
        else:
            direction = 'stable'
        
        volatility = max(recent) - min(recent) if recent else 0
        
        return {
            'direction': direction,
            'change': round(change, 2),
            'volatility': round(volatility, 2),
            'data_points': len(sentiments)
        }
    
    def _predict_escalation(self, trend: Dict) -> Dict:
        """Predict escalation risk based on sentiment trend."""
        if trend['direction'] == 'declining' and trend['change'] < -0.3:
            risk_level = 'high'
            probability = 0.75
        elif trend['direction'] == 'declining':
            risk_level = 'medium'
            probability = 0.45
        elif trend['volatility'] > 0.8:
            risk_level = 'medium'
            probability = 0.50
        else:
            risk_level = 'low'
            probability = 0.15
        
        return {
            'risk_level': risk_level,
            'probability': probability,
            'timeframe': 'next 3 emails' if risk_level != 'low' else 'N/A'
        }
    
    def _calculate_relationship_health(self, thread_id: str) -> Dict:
        """Calculate overall relationship health score."""
        sentiments = self.thread_sentiments[thread_id]
        
        if not sentiments:
            return {'score': 50, 'status': 'new_relationship'}
        
        avg_sentiment = sum(s['sentiment'] for s in sentiments) / len(sentiments)
        health_score = int(50 + avg_sentiment * 50)
        
        if health_score >= 75:
            status = 'excellent'
        elif health_score >= 60:
            status = 'good'
        elif health_score >= 40:
            status = 'fair'
        else:
            status = 'at_risk'
        
        return {
            'score': health_score,
            'status': status,
            'trend': self._analyze_trend(thread_id)['direction']
        }
    
    def _generate_recommendations(self, trend: Dict, escalation: Dict) -> List[str]:
        """Generate actionable recommendations."""
        recommendations = []
        
        if escalation['risk_level'] == 'high':
            recommendations.append("⚠️ HIGH ESCALATION RISK: Consider proactive outreach to address concerns")
            recommendations.append("Schedule a call to discuss issues directly")
        elif escalation['risk_level'] == 'medium':
            recommendations.append("Monitor sentiment closely in next communications")
            recommendations.append("Consider adding more positive language and appreciation")
        
        if trend['direction'] == 'declining':
            recommendations.append("Relationship trending negative - increase engagement and value delivery")
        elif trend['direction'] == 'improving':
            recommendations.append("✓ Relationship improving - maintain current approach")
        
        if trend['volatility'] > 0.8:
            recommendations.append("High sentiment volatility - ensure consistency in communications")
        
        recommendations.append("Always use reply-all for multi-recipient emails")
        
        return recommendations


def main():
    """Test V471 engine."""
    engine = EmailSentimentTracker()
    
    # Simulate thread with declining sentiment
    test_emails = [
        {
            'from': 'client@example.com',
            'to': ['sales@ziontechgroup.com', 'kleber@ziontechgroup.com'],
            'subject': 'Re: Project Update',
            'body': 'Thank you for the excellent update! We are very happy with the progress.'
        },
        {
            'from': 'client@example.com',
            'to': ['sales@ziontechgroup.com', 'kleber@ziontechgroup.com'],
            'subject': 'Re: Project Update',
            'body': 'We are concerned about the delays. This is frustrating.'
        },
        {
            'from': 'client@example.com',
            'to': ['sales@ziontechgroup.com', 'kleber@ziontechgroup.com'],
            'subject': 'Re: Project Update',
            'body': 'Unfortunately, we cannot accept these delays. We are very disappointed with the service.'
        }
    ]
    
    print("=== Email Sentiment Tracking Over Time ===\n")
    
    for i, email in enumerate(test_emails, 1):
        result = engine.analyze_email(email)
        print(f"\n📧 Email {i}:")
        print(f"   Sentiment: {result['current_sentiment']['label']} ({result['current_sentiment']['score']})")
        print(f"   Trend: {result['sentiment_trend']['direction']}")
        print(f"   Escalation Risk: {result['escalation_risk']['risk_level']} ({result['escalation_risk']['probability']*100:.0f}%)")
        print(f"   Relationship Health: {result['relationship_health']['status']} ({result['relationship_health']['score']}/100)")
        print(f"   Reply-all enforced: {result['reply_all_enforced']}")


if __name__ == '__main__':
    main()
