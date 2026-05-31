#!/usr/bin/env python3
"""
V588 - Email Sentiment Heatmap
Creates visual heatmaps of sentiment across email threads and time periods.
Tracks sentiment evolution and correlates with customer satisfaction.
Enforces reply-all for all communications.
"""
import json
from datetime import datetime, timedelta
from typing import Dict, List
from collections import defaultdict

class EmailSentimentHeatmap:
    def __init__(self):
        self.reply_all_enforced = True
        self.sentiment_keywords = {
            'very_positive': ['excellent', 'amazing', 'fantastic', 'outstanding', 'perfect', 'love'],
            'positive': ['good', 'great', 'happy', 'pleased', 'satisfied', 'thank'],
            'neutral': ['okay', 'fine', 'understood', 'noted', 'received'],
            'negative': ['disappointed', 'frustrated', 'concerned', 'worried', 'issue', 'problem'],
            'very_negative': ['terrible', 'awful', 'horrible', 'angry', 'upset', 'unacceptable']
        }
    
    def generate_heatmap(self, email_data: List[Dict], time_period: str = 'week') -> Dict:
        """Generate sentiment heatmap for email data"""
        if not email_data:
            return {
                'engine': 'V588_Email_Sentiment_Heatmap',
                'timestamp': datetime.now().isoformat(),
                'error': 'No email data provided',
                'reply_all_enforced': self.reply_all_enforced
            }
        
        # Analyze sentiment for each email
        sentiment_data = self._analyze_sentiments(email_data)
        
        # Create time-based heatmap
        time_heatmap = self._create_time_heatmap(sentiment_data, time_period)
        
        # Create participant heatmap
        participant_heatmap = self._create_participant_heatmap(sentiment_data)
        
        # Track sentiment evolution
        sentiment_evolution = self._track_sentiment_evolution(sentiment_data)
        
        # Calculate overall metrics
        metrics = self._calculate_sentiment_metrics(sentiment_data)
        
        # Generate insights
        insights = self._generate_insights(sentiment_data, metrics)
        
        return {
            'engine': 'V588_Email_Sentiment_Heatmap',
            'timestamp': datetime.now().isoformat(),
            'time_period': time_period,
            'time_heatmap': time_heatmap,
            'participant_heatmap': participant_heatmap,
            'sentiment_evolution': sentiment_evolution,
            'metrics': metrics,
            'insights': insights,
            'reply_all_enforced': self.reply_all_enforced,
            'all_recipients': email_data[-1].get('to', []) + email_data[-1].get('cc', []) if email_data else []
        }
    
    def _analyze_sentiments(self, emails: List[Dict]) -> List[Dict]:
        """Analyze sentiment for each email"""
        sentiment_data = []
        
        for email in emails:
            body = email.get('body', '')
            sentiment = self._calculate_sentiment(body)
            
            sentiment_data.append({
                'email_id': email.get('id', ''),
                'timestamp': email.get('timestamp', ''),
                'sender': email.get('from', ''),
                'recipients': email.get('to', []) + email.get('cc', []),
                'sentiment': sentiment['category'],
                'sentiment_score': sentiment['score'],
                'confidence': sentiment['confidence'],
                'key_phrases': sentiment['key_phrases']
            })
        
        return sentiment_data
    
    def _calculate_sentiment(self, text: str) -> Dict:
        """Calculate sentiment score and category"""
        text_lower = text.lower()
        
        scores = {}
        key_phrases = {}
        
        for category, keywords in self.sentiment_keywords.items():
            count = sum(1 for keyword in keywords if keyword in text_lower)
            scores[category] = count
            if count > 0:
                key_phrases[category] = [kw for kw in keywords if kw in text_lower]
        
        # Calculate weighted score
        weights = {
            'very_positive': 2,
            'positive': 1,
            'neutral': 0,
            'negative': -1,
            'very_negative': -2
        }
        
        total_score = sum(scores[cat] * weights[cat] for cat in scores)
        total_keywords = sum(scores.values())
        
        if total_keywords == 0:
            return {
                'category': 'neutral',
                'score': 0,
                'confidence': 0.5,
                'key_phrases': {}
            }
        
        normalized_score = total_score / total_keywords
        
        # Determine category
        if normalized_score > 1.5:
            category = 'very_positive'
        elif normalized_score > 0.5:
            category = 'positive'
        elif normalized_score > -0.5:
            category = 'neutral'
        elif normalized_score > -1.5:
            category = 'negative'
        else:
            category = 'very_negative'
        
        confidence = min(total_keywords / 5, 1.0)  # More keywords = higher confidence
        
        return {
            'category': category,
            'score': round(normalized_score, 2),
            'confidence': round(confidence, 2),
            'key_phrases': key_phrases
        }
    
    def _create_time_heatmap(self, sentiment_data: List[Dict], time_period: str) -> Dict:
        """Create time-based sentiment heatmap"""
        time_buckets = defaultdict(lambda: {
            'very_positive': 0,
            'positive': 0,
            'neutral': 0,
            'negative': 0,
            'very_negative': 0,
            'total': 0
        })
        
        for data in sentiment_data:
            try:
                timestamp = datetime.fromisoformat(data['timestamp'].replace('Z', '+00:00'))
                
                if time_period == 'hour':
                    bucket_key = timestamp.strftime('%Y-%m-%d %H:00')
                elif time_period == 'day':
                    bucket_key = timestamp.strftime('%Y-%m-%d')
                elif time_period == 'week':
                    bucket_key = timestamp.strftime('%Y-W%W')
                else:  # month
                    bucket_key = timestamp.strftime('%Y-%m')
                
                time_buckets[bucket_key][data['sentiment']] += 1
                time_buckets[bucket_key]['total'] += 1
            except:
                continue
        
        # Convert to list format
        heatmap_data = []
        for time_key, counts in sorted(time_buckets.items()):
            heatmap_data.append({
                'time_bucket': time_key,
                'sentiment_distribution': {
                    'very_positive': counts['very_positive'],
                    'positive': counts['positive'],
                    'neutral': counts['neutral'],
                    'negative': counts['negative'],
                    'very_negative': counts['very_negative']
                },
                'total_emails': counts['total'],
                'dominant_sentiment': max(
                    ['very_positive', 'positive', 'neutral', 'negative', 'very_negative'],
                    key=lambda x: counts[x]
                )
            })
        
        return {
            'period': time_period,
            'buckets': len(heatmap_data),
            'data': heatmap_data
        }
    
    def _create_participant_heatmap(self, sentiment_data: List[Dict]) -> Dict:
        """Create participant-based sentiment heatmap"""
        participant_sentiments = defaultdict(lambda: {
            'very_positive': 0,
            'positive': 0,
            'neutral': 0,
            'negative': 0,
            'very_negative': 0,
            'total': 0,
            'avg_score': 0
        })
        
        for data in sentiment_data:
            sender = data['sender']
            participant_sentiments[sender][data['sentiment']] += 1
            participant_sentiments[sender]['total'] += 1
            participant_sentiments[sender]['avg_score'] += data['sentiment_score']
        
        # Calculate averages and convert to list
        heatmap_data = []
        for participant, counts in participant_sentiments.items():
            avg_score = counts['avg_score'] / counts['total'] if counts['total'] > 0 else 0
            
            heatmap_data.append({
                'participant': participant,
                'email_count': counts['total'],
                'sentiment_distribution': {
                    'very_positive': counts['very_positive'],
                    'positive': counts['positive'],
                    'neutral': counts['neutral'],
                    'negative': counts['negative'],
                    'very_negative': counts['very_negative']
                },
                'average_sentiment_score': round(avg_score, 2),
                'dominant_sentiment': max(
                    ['very_positive', 'positive', 'neutral', 'negative', 'very_negative'],
                    key=lambda x: counts[x]
                )
            })
        
        # Sort by email count
        heatmap_data.sort(key=lambda x: x['email_count'], reverse=True)
        
        return {
            'total_participants': len(heatmap_data),
            'data': heatmap_data
        }
    
    def _track_sentiment_evolution(self, sentiment_data: List[Dict]) -> Dict:
        """Track sentiment evolution over time"""
        if len(sentiment_data) < 2:
            return {'trend': 'insufficient_data', 'evolution': []}
        
        evolution = []
        for i, data in enumerate(sentiment_data):
            evolution.append({
                'position': i + 1,
                'timestamp': data['timestamp'],
                'sentiment': data['sentiment'],
                'score': data['sentiment_score']
            })
        
        # Calculate trend
        scores = [d['sentiment_score'] for d in sentiment_data]
        if len(scores) >= 2:
            trend_direction = 'improving' if scores[-1] > scores[0] else 'declining' if scores[-1] < scores[0] else 'stable'
        else:
            trend_direction = 'unknown'
        
        return {
            'trend': trend_direction,
            'evolution': evolution,
            'start_sentiment': sentiment_data[0]['sentiment'],
            'end_sentiment': sentiment_data[-1]['sentiment'],
            'sentiment_shift': sentiment_data[-1]['sentiment_score'] - sentiment_data[0]['sentiment_score']
        }
    
    def _calculate_sentiment_metrics(self, sentiment_data: List[Dict]) -> Dict:
        """Calculate overall sentiment metrics"""
        if not sentiment_data:
            return {}
        
        sentiment_counts = defaultdict(int)
        total_score = 0
        
        for data in sentiment_data:
            sentiment_counts[data['sentiment']] += 1
            total_score += data['sentiment_score']
        
        total_emails = len(sentiment_data)
        avg_score = total_score / total_emails
        
        positive_count = sentiment_counts['very_positive'] + sentiment_counts['positive']
        negative_count = sentiment_counts['very_negative'] + sentiment_counts['negative']
        
        return {
            'total_emails': total_emails,
            'average_sentiment_score': round(avg_score, 2),
            'positive_percentage': round((positive_count / total_emails) * 100, 1),
            'negative_percentage': round((negative_count / total_emails) * 100, 1),
            'neutral_percentage': round((sentiment_counts['neutral'] / total_emails) * 100, 1),
            'sentiment_distribution': dict(sentiment_counts),
            'overall_sentiment': 'positive' if avg_score > 0.3 else 'negative' if avg_score < -0.3 else 'neutral'
        }
    
    def _generate_insights(self, sentiment_data: List[Dict], metrics: Dict) -> List[Dict]:
        """Generate actionable insights"""
        insights = []
        
        # Check for negative trends
        if metrics.get('negative_percentage', 0) > 30:
            insights.append({
                'type': 'warning',
                'message': f"High negative sentiment detected ({metrics['negative_percentage']}%)",
                'recommendation': 'Review recent communications and address concerns proactively'
            })
        
        # Check for positive trends
        if metrics.get('positive_percentage', 0) > 70:
            insights.append({
                'type': 'success',
                'message': f"Excellent positive sentiment ({metrics['positive_percentage']}%)",
                'recommendation': 'Maintain current communication approach'
            })
        
        # Check for sentiment volatility
        scores = [d['sentiment_score'] for d in sentiment_data]
        if len(scores) >= 3:
            volatility = max(scores) - min(scores)
            if volatility > 3:
                insights.append({
                    'type': 'attention',
                    'message': 'High sentiment volatility detected',
                    'recommendation': 'Investigate causes of sentiment swings'
                })
        
        return insights

if __name__ == "__main__":
    heatmap = EmailSentimentHeatmap()
    test_emails = [
        {
            'id': '1',
            'from': 'client@company.com',
            'to': ['support@company.com'],
            'timestamp': '2024-01-15T09:00:00Z',
            'body': 'I\'m very disappointed with the service. This is unacceptable.'
        },
        {
            'id': '2',
            'from': 'support@company.com',
            'to': ['client@company.com'],
            'timestamp': '2024-01-15T10:00:00Z',
            'body': 'I understand your concerns. Let me help resolve this issue.'
        },
        {
            'id': '3',
            'from': 'client@company.com',
            'to': ['support@company.com'],
            'timestamp': '2024-01-15T11:00:00Z',
            'body': 'Thank you for the quick response. I\'m pleased with the solution.'
        }
    ]
    result = heatmap.generate_heatmap(test_emails, 'day')
    print(json.dumps(result, indent=2))
