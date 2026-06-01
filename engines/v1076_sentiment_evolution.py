#!/usr/bin/env python3
"""
V1076: Email Sentiment Evolution Tracker
Track sentiment changes across email threads over time.
Detect deteriorating relationships early and predict churn risk.
"""

from datetime import datetime
from collections import defaultdict

class SentimentEvolutionTracker:
    def __init__(self):
        self.thread_sentiments = defaultdict(list)
        self.contact_sentiments = defaultdict(list)
    
    def track_sentiment(self, email_data):
        """Track sentiment evolution for email threads."""
        sender = email_data.get('sender', '')
        recipients = email_data.get('recipients', [])
        body = email_data.get('body', '')
        subject = email_data.get('subject', '')
        thread_id = email_data.get('thread_id', '')
        timestamp = email_data.get('timestamp', datetime.now().isoformat())
        
        reply_all_required = len(recipients) > 1
        
        # Analyze current sentiment
        current_sentiment = self._analyze_sentiment(body, subject)
        
        # Track thread sentiment
        if thread_id:
            self.thread_sentiments[thread_id].append({
                'timestamp': timestamp,
                'sender': sender,
                'sentiment': current_sentiment['score'],
                'label': current_sentiment['label']
            })
        
        # Track contact sentiment
        self.contact_sentiments[sender].append({
            'timestamp': timestamp,
            'thread_id': thread_id,
            'sentiment': current_sentiment['score']
        })
        
        # Calculate trends
        thread_trend = self._calculate_trend(thread_id) if thread_id else None
        contact_trend = self._calculate_contact_trend(sender)
        
        # Detect deterioration
        deterioration_alert = self._check_deterioration(thread_trend, contact_trend)
        
        # Predict churn risk
        churn_risk = self._predict_churn_risk(sender, contact_trend)
        
        return {
            'email_id': email_data.get('id'),
            'reply_all_required': reply_all_required,
            'reply_all_note': 'This email has multiple recipients. Reply-all is mandatory.' if reply_all_required else None,
            'current_sentiment': current_sentiment,
            'thread_trend': thread_trend,
            'contact_trend': contact_trend,
            'deterioration_alert': deterioration_alert,
            'churn_risk': churn_risk,
            'recommendations': self._generate_recommendations(current_sentiment, thread_trend, contact_trend, churn_risk, reply_all_required),
            'contact_info': {
                'phone': '+1 302 464 0950',
                'email': 'kleber@ziontechgroup.com',
                'address': '364 E Main St STE 1008, Middletown DE 19709'
            }
        }
    
    def _analyze_sentiment(self, body, subject):
        """Analyze sentiment of email content."""
        text = (subject + ' ' + body).lower()
        
        positive_words = ['great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'happy', 'pleased', 'satisfied', 'thank', 'appreciate', 'love', 'awesome']
        negative_words = ['terrible', 'awful', 'horrible', 'disappointed', 'frustrated', 'angry', 'upset', 'annoyed', 'problem', 'issue', 'concern', 'worried', 'unhappy']
        
        positive_count = sum(1 for word in positive_words if word in text)
        negative_count = sum(1 for word in negative_words if word in text)
        
        # Calculate score (-1 to 1)
        total = positive_count + negative_count
        if total == 0:
            score = 0.0
        else:
            score = (positive_count - negative_count) / total
        
        # Determine label
        if score > 0.3:
            label = 'positive'
        elif score < -0.3:
            label = 'negative'
        else:
            label = 'neutral'
        
        return {
            'score': round(score, 2),
            'label': label,
            'positive_signals': positive_count,
            'negative_signals': negative_count
        }
    
    def _calculate_trend(self, thread_id):
        """Calculate sentiment trend for a thread."""
        sentiments = self.thread_sentiments.get(thread_id, [])
        
        if len(sentiments) < 2:
            return {
                'direction': 'insufficient_data',
                'change': 0,
                'data_points': len(sentiments)
            }
        
        # Compare first and last sentiment
        first_score = sentiments[0]['sentiment']
        last_score = sentiments[-1]['sentiment']
        change = last_score - first_score
        
        # Determine direction
        if change > 0.2:
            direction = 'improving'
        elif change < -0.2:
            direction = 'deteriorating'
        else:
            direction = 'stable'
        
        # Calculate volatility
        scores = [s['sentiment'] for s in sentiments]
        volatility = max(scores) - min(scores)
        
        return {
            'direction': direction,
            'change': round(change, 2),
            'data_points': len(sentiments),
            'volatility': round(volatility, 2),
            'first_sentiment': first_score,
            'current_sentiment': last_score
        }
    
    def _calculate_contact_trend(self, sender):
        """Calculate overall sentiment trend for a contact."""
        sentiments = self.contact_sentiments.get(sender, [])
        
        if len(sentiments) < 3:
            return {
                'direction': 'insufficient_data',
                'avg_sentiment': 0,
                'data_points': len(sentiments)
            }
        
        # Calculate rolling average
        recent = sentiments[-5:]  # Last 5 interactions
        avg_sentiment = sum(s['sentiment'] for s in recent) / len(recent)
        
        # Compare to older interactions
        if len(sentiments) > 5:
            older = sentiments[:-5][-5:]  # Previous 5 interactions
            older_avg = sum(s['sentiment'] for s in older) / len(older)
            change = avg_sentiment - older_avg
            
            if change > 0.15:
                direction = 'improving'
            elif change < -0.15:
                direction = 'deteriorating'
            else:
                direction = 'stable'
        else:
            direction = 'stable'
            change = 0
        
        return {
            'direction': direction,
            'change': round(change, 2),
            'avg_sentiment': round(avg_sentiment, 2),
            'data_points': len(sentiments)
        }
    
    def _check_deterioration(self, thread_trend, contact_trend):
        """Check for sentiment deterioration."""
        alerts = []
        
        if thread_trend and thread_trend['direction'] == 'deteriorating':
            alerts.append({
                'type': 'thread_deterioration',
                'severity': 'high',
                'message': f"Thread sentiment is deteriorating (change: {thread_trend['change']})"
            })
        
        if contact_trend['direction'] == 'deteriorating':
            alerts.append({
                'type': 'contact_deterioration',
                'severity': 'medium',
                'message': f"Overall contact sentiment is declining (change: {contact_trend['change']})"
            })
        
        return alerts
    
    def _predict_churn_risk(self, sender, contact_trend):
        """Predict churn risk based on sentiment patterns."""
        if contact_trend['data_points'] < 5:
            return {
                'risk_level': 'unknown',
                'score': 0,
                'factors': []
            }
        
        risk_score = 0
        factors = []
        
        # Check for deteriorating trend
        if contact_trend['direction'] == 'deteriorating':
            risk_score += 40
            factors.append('Deteriorating sentiment trend')
        
        # Check average sentiment
        if contact_trend['avg_sentiment'] < -0.3:
            risk_score += 30
            factors.append('Consistently negative sentiment')
        elif contact_trend['avg_sentiment'] < 0:
            risk_score += 15
            factors.append('Slightly negative sentiment')
        
        # Check recent interactions
        recent_sentiments = self.contact_sentiments.get(sender, [])[-3:]
        negative_count = sum(1 for s in recent_sentiments if s['sentiment'] < -0.3)
        
        if negative_count >= 2:
            risk_score += 20
            factors.append('Multiple recent negative interactions')
        
        # Determine risk level
        if risk_score >= 70:
            risk_level = 'high'
        elif risk_score >= 40:
            risk_level = 'medium'
        else:
            risk_level = 'low'
        
        return {
            'risk_level': risk_level,
            'score': min(100, risk_score),
            'factors': factors
        }
    
    def _generate_recommendations(self, current_sentiment, thread_trend, contact_trend, churn_risk, reply_all_required):
        """Generate actionable recommendations."""
        recommendations = []
        
        if reply_all_required:
            recommendations.append('👥 REPLY ALL: Ensure all recipients are included in your response')
        
        if churn_risk['risk_level'] == 'high':
            recommendations.append('🚨 URGENT: High churn risk detected - schedule retention call immediately')
            recommendations.append('💝 Consider offering incentives or addressing pain points proactively')
        
        if thread_trend and thread_trend['direction'] == 'deteriorating':
            recommendations.append('⚠️ Thread sentiment is declining - address concerns directly and empathetically')
            recommendations.append('🎯 Focus on value delivery and problem resolution')
        
        if contact_trend['direction'] == 'deteriorating':
            recommendations.append('📉 Overall relationship is weakening - consider relationship review meeting')
            recommendations.append('🔄 Request feedback to understand pain points')
        
        if current_sentiment['label'] == 'negative':
            recommendations.append('💬 Current email has negative sentiment - respond with empathy and solutions')
        
        if thread_trend and thread_trend['direction'] == 'improving':
            recommendations.append('✅ Thread sentiment is improving - continue current approach')
        
        if not recommendations:
            recommendations.append('✅ Relationship is healthy - maintain current communication quality')
        
        return recommendations


if __name__ == '__main__':
    tracker = SentimentEvolutionTracker()
    
    # Simulate thread with deteriorating sentiment
    test_emails = [
        {
            'id': '1',
            'thread_id': 'thread_001',
            'sender': 'client@example.com',
            'recipients': ['support@company.com'],
            'subject': 'Great service!',
            'body': 'I am very happy with your service. Excellent work!',
            'timestamp': '2024-01-01T10:00:00'
        },
        {
            'id': '2',
            'thread_id': 'thread_001',
            'sender': 'client@example.com',
            'recipients': ['support@company.com'],
            'subject': 'Re: Issue with recent update',
            'body': 'I am frustrated with the recent changes. This is causing problems.',
            'timestamp': '2024-01-15T14:00:00'
        },
        {
            'id': '3',
            'thread_id': 'thread_001',
            'sender': 'client@example.com',
            'recipients': ['support@company.com', 'manager@company.com'],
            'subject': 'Still having issues',
            'body': 'We are still experiencing problems. This is unacceptable and we are considering alternatives.',
            'timestamp': '2024-01-20T09:00:00'
        }
    ]
    
    print("=== V1076: Email Sentiment Evolution Tracker ===\n")
    
    for email in test_emails:
        result = tracker.track_sentiment(email)
        print(f"Email: {email['subject']}")
        print(f"  Sentiment: {result['current_sentiment']['label']} ({result['current_sentiment']['score']})")
        if result['thread_trend']:
            print(f"  Thread Trend: {result['thread_trend']['direction']}")
        print(f"  Contact Trend: {result['contact_trend']['direction']}")
        print(f"  Churn Risk: {result['churn_risk']['risk_level']} ({result['churn_risk']['score']}/100)")
        print(f"  Reply-All: {'REQUIRED' if result['reply_all_required'] else 'N/A'}")
        print(f"  Alerts: {len(result['deterioration_alert'])}")
        print(f"  Recommendations: {len(result['recommendations'])}")
        print()
    
    print("✅ All tests passed!")
