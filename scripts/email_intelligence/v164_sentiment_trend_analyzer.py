#!/usr/bin/env python3
"""
V164 - Email Sentiment Trend Analyzer
Tracks sentiment evolution across conversations over time, identifies relationship health trends,
detects early warning signs of customer dissatisfaction, and generates proactive intervention recommendations.
"""

import json
from datetime import datetime, timedelta
from typing import Dict, List, Optional
import statistics

class SentimentTrendAnalyzer:
    def __init__(self):
        self.sentiment_history = {}
        self.relationship_scores = {}
        self.warning_thresholds = {
            'negative_trend': -0.3,
            'satisfaction_drop': -0.5,
            'response_delay': 48  # hours
        }
    
    def analyze_email_sentiment(self, email_content: str) -> Dict[str, float]:
        """Analyze sentiment of a single email."""
        positive_keywords = ['excellent', 'great', 'amazing', 'wonderful', 'perfect', 'happy', 'satisfied', 'appreciate', 'thank', 'love']
        negative_keywords = ['disappointed', 'frustrated', 'angry', 'terrible', 'awful', 'hate', 'worried', 'concerned', 'problem', 'issue']
        
        content_lower = email_content.lower()
        
        positive_score = sum(1 for keyword in positive_keywords if keyword in content_lower)
        negative_score = sum(1 for keyword in negative_keywords if keyword in content_lower)
        
        total = positive_score + negative_score
        if total == 0:
            return {'sentiment': 0.0, 'confidence': 0.0}
        
        sentiment = (positive_score - negative_score) / total
        confidence = min(total / 10, 1.0)  # Max confidence at 10+ keywords
        
        return {
            'sentiment': round(sentiment, 2),
            'confidence': round(confidence, 2),
            'positive_indicators': positive_score,
            'negative_indicators': negative_score
        }
    
    def track_conversation(self, contact_id: str, email_content: str, timestamp: datetime):
        """Track sentiment for a specific contact over time."""
        sentiment_data = self.analyze_email_sentiment(email_content)
        
        if contact_id not in self.sentiment_history:
            self.sentiment_history[contact_id] = []
        
        self.sentiment_history[contact_id].append({
            'timestamp': timestamp.isoformat(),
            'sentiment': sentiment_data['sentiment'],
            'confidence': sentiment_data['confidence'],
            'positive_indicators': sentiment_data['positive_indicators'],
            'negative_indicators': sentiment_data['negative_indicators']
        })
        
        # Keep only last 50 entries per contact
        self.sentiment_history[contact_id] = self.sentiment_history[contact_id][-50:]
    
    def analyze_trends(self, contact_id: str, days: int = 30) -> Dict[str, any]:
        """Analyze sentiment trends for a contact over specified days."""
        if contact_id not in self.sentiment_history:
            return {'error': 'No history for this contact'}
        
        history = self.sentiment_history[contact_id]
        cutoff_date = datetime.now() - timedelta(days=days)
        
        # Filter recent history
        recent = [h for h in history if datetime.fromisoformat(h['timestamp']) > cutoff_date]
        
        if len(recent) < 2:
            return {'error': 'Insufficient data for trend analysis'}
        
        sentiments = [h['sentiment'] for h in recent]
        
        # Calculate trend (simple linear regression)
        n = len(sentiments)
        x = list(range(n))
        x_mean = statistics.mean(x)
        y_mean = statistics.mean(sentiments)
        
        numerator = sum((x[i] - x_mean) * (sentiments[i] - y_mean) for i in range(n))
        denominator = sum((x[i] - x_mean) ** 2 for i in range(n))
        
        trend_slope = numerator / denominator if denominator != 0 else 0
        
        # Calculate volatility
        volatility = statistics.stdev(sentiments) if len(sentiments) > 1 else 0
        
        # Detect warnings
        warnings = []
        if trend_slope < self.warning_thresholds['negative_trend']:
            warnings.append('NEGATIVE_TREND_DETECTED')
        
        if len(sentiments) >= 3 and sentiments[-1] - sentiments[0] < self.warning_thresholds['satisfaction_drop']:
            warnings.append('SATISFACTION_DROP_DETECTED')
        
        # Calculate overall health score
        avg_sentiment = statistics.mean(sentiments)
        recent_sentiment = statistics.mean(sentiments[-5:]) if len(sentiments) >= 5 else avg_sentiment
        
        health_score = (avg_sentiment + recent_sentiment + trend_slope) / 3
        
        return {
            'contact_id': contact_id,
            'analysis_period_days': days,
            'total_emails': len(recent),
            'average_sentiment': round(avg_sentiment, 2),
            'recent_sentiment': round(recent_sentiment, 2),
            'trend_slope': round(trend_slope, 3),
            'volatility': round(volatility, 2),
            'health_score': round(health_score, 2),
            'warnings': warnings,
            'recommendations': self._generate_recommendations(health_score, trend_slope, warnings)
        }
    
    def _generate_recommendations(self, health_score: float, trend_slope: float, warnings: List[str]) -> List[str]:
        """Generate proactive recommendations based on sentiment analysis."""
        recommendations = []
        
        if health_score < -0.3:
            recommendations.append('URGENT: Schedule immediate outreach to address concerns')
            recommendations.append('Review recent interactions for service issues')
        
        if health_score < 0:
            recommendations.append('Consider proactive check-in call')
            recommendations.append('Offer additional support or resources')
        
        if trend_slope < -0.2:
            recommendations.append('Sentiment declining - investigate root cause')
            recommendations.append('Personalize next communication')
        
        if 'NEGATIVE_TREND_DETECTED' in warnings:
            recommendations.append('Escalate to account manager for review')
        
        if health_score > 0.5:
            recommendations.append('Strong relationship - consider upsell opportunities')
            recommendations.append('Request testimonial or referral')
        
        if not recommendations:
            recommendations.append('Maintain current engagement strategy')
        
        return recommendations
    
    def get_at_risk_contacts(self, threshold: float = -0.2) -> List[Dict]:
        """Identify contacts at risk based on sentiment trends."""
        at_risk = []
        
        for contact_id in self.sentiment_history:
            analysis = self.analyze_trends(contact_id, days=30)
            
            if 'error' in analysis:
                continue
            
            if analysis['health_score'] < threshold or len(analysis['warnings']) > 0:
                at_risk.append({
                    'contact_id': contact_id,
                    'health_score': analysis['health_score'],
                    'trend': analysis['trend_slope'],
                    'warnings': analysis['warnings'],
                    'last_interaction': self.sentiment_history[contact_id][-1]['timestamp']
                })
        
        # Sort by health score (worst first)
        at_risk.sort(key=lambda x: x['health_score'])
        return at_risk
    
    def generate_report(self, days: int = 30) -> Dict:
        """Generate comprehensive sentiment trend report."""
        all_contacts = list(self.sentiment_history.keys())
        analyses = []
        
        for contact_id in all_contacts:
            analysis = self.analyze_trends(contact_id, days)
            if 'error' not in analysis:
                analyses.append(analysis)
        
        if not analyses:
            return {'error': 'No data available'}
        
        # Aggregate statistics
        health_scores = [a['health_score'] for a in analyses]
        trend_slopes = [a['trend_slope'] for a in analyses]
        
        return {
            'report_period_days': days,
            'total_contacts': len(analyses),
            'average_health_score': round(statistics.mean(health_scores), 2),
            'average_trend': round(statistics.mean(trend_slopes), 3),
            'at_risk_count': sum(1 for h in health_scores if h < -0.2),
            'healthy_count': sum(1 for h in health_scores if h > 0.3),
            'at_risk_contacts': self.get_at_risk_contacts(),
            'top_performers': sorted(analyses, key=lambda x: x['health_score'], reverse=True)[:5]
        }

# Usage Example
if __name__ == "__main__":
    analyzer = SentimentTrendAnalyzer()
    
    # Simulate tracking
    analyzer.track_conversation('client_001', 'I am very happy with your excellent service!', datetime.now() - timedelta(days=10))
    analyzer.track_conversation('client_001', 'The service was great, thank you!', datetime.now() - timedelta(days=5))
    analyzer.track_conversation('client_001', 'I am concerned about the recent issues.', datetime.now() - timedelta(days=1))
    
    # Analyze trends
    result = analyzer.analyze_trends('client_001', days=30)
    print(json.dumps(result, indent=2))
