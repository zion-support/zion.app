#!/usr/bin/env python3
"""
V481 - Email Sentiment Evolution Tracker
Track how sentiment changes over time in email conversations to identify relationship trends.
Features: Sentiment timeline, trend analysis, relationship health scoring, early warning system.
CRITICAL: Always enforces reply-all for multi-recipient emails.
"""

import json
import re
from datetime import datetime, timedelta
from typing import Dict, List, Any
from statistics import mean


class EmailSentimentEvolutionTracker:
    """Track sentiment evolution across email conversations."""
    
    SENTIMENT_INDICATORS = {
        'very_positive': ['excellent', 'amazing', 'fantastic', 'wonderful', 'perfect', 'outstanding'],
        'positive': ['good', 'great', 'happy', 'pleased', 'satisfied', 'appreciate', 'thank'],
        'neutral': ['okay', 'fine', 'understood', 'noted', 'received'],
        'negative': ['concerned', 'disappointed', 'frustrated', 'problem', 'issue', 'delay'],
        'very_negative': ['unacceptable', 'terrible', 'awful', 'angry', 'furious', 'disaster']
    }
    
    def analyze_email(self, email: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze email and track sentiment evolution."""
        body = email.get('body', '')
        subject = email.get('subject', '')
        sender = email.get('from', '')
        recipients = email.get('to', []) + email.get('cc', [])
        conversation_history = email.get('conversation_history', [])
        
        # Analyze current sentiment
        current_sentiment = self._analyze_sentiment(body, subject)
        
        # Build sentiment timeline
        sentiment_timeline = self._build_sentiment_timeline(conversation_history, current_sentiment)
        
        # Calculate trend
        trend = self._calculate_trend(sentiment_timeline)
        
        # Assess relationship health
        relationship_health = self._assess_relationship_health(sentiment_timeline, trend)
        
        # Generate early warnings
        warnings = self._generate_early_warnings(trend, relationship_health)
        
        # Provide recommendations
        recommendations = self._generate_recommendations(trend, relationship_health, warnings)
        
        reply_all_required = len(recipients) > 1
        
        return {
            'engine': 'V481_EmailSentimentEvolutionTracker',
            'current_sentiment': current_sentiment,
            'sentiment_timeline': sentiment_timeline,
            'trend_analysis': trend,
            'relationship_health': relationship_health,
            'early_warnings': warnings,
            'recommendations': recommendations,
            'reply_all_required': reply_all_required,
            'reply_all_enforced': reply_all_required,
            'recipients': recipients,
            'timestamp': datetime.now().isoformat()
        }
    
    def _analyze_sentiment(self, body: str, subject: str) -> Dict:
        """Analyze sentiment of current email."""
        text = (body + ' ' + subject).lower()
        
        scores = {
            'very_positive': 0,
            'positive': 0,
            'neutral': 0,
            'negative': 0,
            'very_negative': 0
        }
        
        # Count indicators
        for sentiment, indicators in self.SENTIMENT_INDICATORS.items():
            for indicator in indicators:
                if indicator in text:
                    scores[sentiment] += 1
        
        # Calculate overall sentiment score (-2 to +2)
        total_indicators = sum(scores.values())
        if total_indicators == 0:
            sentiment_score = 0
            sentiment_label = 'neutral'
        else:
            weighted_score = (
                scores['very_positive'] * 2 +
                scores['positive'] * 1 -
                scores['negative'] * 1 -
                scores['very_negative'] * 2
            )
            sentiment_score = weighted_score / total_indicators
            
            # Determine label
            if sentiment_score > 1.0:
                sentiment_label = 'very_positive'
            elif sentiment_score > 0.3:
                sentiment_label = 'positive'
            elif sentiment_score > -0.3:
                sentiment_label = 'neutral'
            elif sentiment_score > -1.0:
                sentiment_label = 'negative'
            else:
                sentiment_label = 'very_negative'
        
        return {
            'score': round(sentiment_score, 2),
            'label': sentiment_label,
            'indicators_found': scores,
            'confidence': min(1.0, total_indicators / 5)
        }
    
    def _build_sentiment_timeline(self, history: List[Dict], current: Dict) -> List[Dict]:
        """Build sentiment timeline from conversation history."""
        timeline = []
        
        # Add historical sentiments
        for email in history[-10:]:  # Last 10 emails
            sentiment = self._analyze_sentiment(
                email.get('body', ''),
                email.get('subject', '')
            )
            timeline.append({
                'timestamp': email.get('timestamp', ''),
                'sentiment': sentiment,
                'sender': email.get('from', '')
            })
        
        # Add current email
        timeline.append({
            'timestamp': datetime.now().isoformat(),
            'sentiment': current,
            'sender': 'current'
        })
        
        return timeline
    
    def _calculate_trend(self, timeline: List[Dict]) -> Dict:
        """Calculate sentiment trend."""
        if len(timeline) < 2:
            return {
                'direction': 'insufficient_data',
                'change': 0,
                'volatility': 0
            }
        
        scores = [entry['sentiment']['score'] for entry in timeline]
        
        # Calculate trend direction
        recent_avg = mean(scores[-3:]) if len(scores) >= 3 else mean(scores)
        older_avg = mean(scores[:3]) if len(scores) >= 3 else scores[0]
        
        change = recent_avg - older_avg
        
        if change > 0.3:
            direction = 'improving'
        elif change < -0.3:
            direction = 'declining'
        else:
            direction = 'stable'
        
        # Calculate volatility
        if len(scores) > 1:
            volatility = max(scores) - min(scores)
        else:
            volatility = 0
        
        return {
            'direction': direction,
            'change': round(change, 2),
            'volatility': round(volatility, 2),
            'data_points': len(scores),
            'recent_sentiment': scores[-1],
            'average_sentiment': round(mean(scores), 2)
        }
    
    def _assess_relationship_health(self, timeline: List[Dict], trend: Dict) -> Dict:
        """Assess overall relationship health."""
        if not timeline:
            return {
                'score': 50,
                'status': 'new_relationship',
                'risk_level': 'unknown'
            }
        
        scores = [entry['sentiment']['score'] for entry in timeline]
        avg_score = mean(scores)
        
        # Convert to 0-100 scale
        health_score = int((avg_score + 2) * 25)  # -2 to +2 -> 0 to 100
        health_score = max(0, min(100, health_score))
        
        # Determine status
        if health_score >= 80:
            status = 'excellent'
            risk_level = 'low'
        elif health_score >= 60:
            status = 'good'
            risk_level = 'low'
        elif health_score >= 40:
            status = 'fair'
            risk_level = 'medium'
        elif health_score >= 20:
            status = 'poor'
            risk_level = 'high'
        else:
            status = 'critical'
            risk_level = 'critical'
        
        # Adjust based on trend
        if trend['direction'] == 'declining':
            risk_level = 'high' if risk_level in ['medium', 'high'] else risk_level
        
        return {
            'score': health_score,
            'status': status,
            'risk_level': risk_level,
            'trend': trend['direction'],
            'recommendation': self._get_health_recommendation(status, trend)
        }
    
    def _get_health_recommendation(self, status: str, trend: Dict) -> str:
        """Get recommendation based on relationship health."""
        if status == 'excellent' and trend['direction'] == 'improving':
            return 'Maintain current communication style'
        elif status == 'good':
            return 'Continue building positive rapport'
        elif status == 'fair':
            return 'Focus on addressing concerns and building trust'
        elif status == 'poor':
            return 'Urgent: Schedule call to address issues'
        elif status == 'critical':
            return 'Critical: Immediate intervention required - escalate to management'
        else:
            return 'Monitor closely and respond promptly'
    
    def _generate_early_warnings(self, trend: Dict, health: Dict) -> List[Dict]:
        """Generate early warning signals."""
        warnings = []
        
        # Warning for declining trend
        if trend['direction'] == 'declining' and trend['change'] < -0.5:
            warnings.append({
                'type': 'declining_sentiment',
                'severity': 'high',
                'message': f'Sentiment declining by {abs(trend["change"])} points',
                'action': 'Schedule proactive outreach'
            })
        
        # Warning for high volatility
        if trend['volatility'] > 1.5:
            warnings.append({
                'type': 'high_volatility',
                'severity': 'medium',
                'message': 'Sentiment highly volatile',
                'action': 'Stabilize communication approach'
            })
        
        # Warning for poor health
        if health['score'] < 40:
            warnings.append({
                'type': 'poor_relationship_health',
                'severity': 'high',
                'message': f'Relationship health at {health["score"]}%',
                'action': 'Immediate intervention required'
            })
        
        # Warning for negative recent sentiment
        if trend.get('recent_sentiment', 0) < -0.5:
            warnings.append({
                'type': 'negative_recent_interaction',
                'severity': 'medium',
                'message': 'Recent interaction was negative',
                'action': 'Follow up with positive engagement'
            })
        
        return warnings
    
    def _generate_recommendations(self, trend: Dict, health: Dict, warnings: List[Dict]) -> List[str]:
        """Generate actionable recommendations."""
        recommendations = []
        
        # Based on trend
        if trend['direction'] == 'improving':
            recommendations.append('✅ Sentiment improving - maintain current approach')
        elif trend['direction'] == 'declining':
            recommendations.append('⚠️ Sentiment declining - increase engagement and address concerns')
        
        # Based on health
        if health['score'] >= 70:
            recommendations.append('Strong relationship - leverage for upsell opportunities')
        elif health['score'] < 50:
            recommendations.append('Relationship needs attention - schedule check-in call')
        
        # Based on warnings
        for warning in warnings:
            if warning['severity'] == 'high':
                recommendations.append(f'🚨 {warning["action"]}')
        
        # General recommendations
        recommendations.append('Track sentiment trends weekly')
        recommendations.append('Always use reply-all for multi-recipient emails')
        
        return recommendations


def main():
    """Test V481 engine."""
    engine = EmailSentimentEvolutionTracker()
    
    # Simulate conversation history
    conversation_history = [
        {
            'from': 'client@company.com',
            'subject': 'Project Kickoff',
            'body': 'Excited to start this project! Looking forward to working with your team.',
            'timestamp': '2026-05-01T10:00:00'
        },
        {
            'from': 'client@company.com',
            'subject': 'Re: Project Update',
            'body': 'Good progress so far. Happy with the results.',
            'timestamp': '2026-05-10T14:00:00'
        },
        {
            'from': 'client@company.com',
            'subject': 'Re: Project Delay',
            'body': 'Concerned about the delay. This is frustrating.',
            'timestamp': '2026-05-20T09:00:00'
        },
        {
            'from': 'client@company.com',
            'subject': 'Re: Urgent Issue',
            'body': 'This is unacceptable. We need immediate resolution.',
            'timestamp': '2026-05-28T16:00:00'
        }
    ]
    
    current_email = {
        'from': 'client@company.com',
        'to': ['account-manager@ziontechgroup.com', 'kleber@ziontechgroup.com'],
        'cc': ['management@company.com'],
        'subject': 'Re: Resolution Update',
        'body': 'Thank you for the quick resolution. We appreciate your responsiveness and are pleased with the outcome.',
        'conversation_history': conversation_history
    }
    
    result = engine.analyze_email(current_email)
    print(json.dumps(result, indent=2))
    print(f"\n✅ Current Sentiment: {result['current_sentiment']['label']} ({result['current_sentiment']['score']})")
    print(f"✅ Trend: {result['trend_analysis']['direction']}")
    print(f"✅ Relationship Health: {result['relationship_health']['status']} ({result['relationship_health']['score']}%)")
    print(f"✅ Warnings: {len(result['early_warnings'])}")
    print(f"✅ Reply-all enforced: {result['reply_all_enforced']}")


if __name__ == '__main__':
    main()
