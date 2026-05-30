#!/usr/bin/env python3
"""
Email Intelligence Engine V321 - Email Sentiment Evolution Tracker
Track sentiment shifts across email threads over time, detect relationship
health trends, predict churn risk, and suggest intervention timing.
Enforces reply-all and case-by-case analysis.
"""

import json
import re
from datetime import datetime
from typing import Dict, List
from collections import defaultdict

class EmailSentimentEvolutionTracker:
    def __init__(self):
        self.version = "V321"
        self.sentiment_history = defaultdict(list)
        self.relationship_scores = defaultdict(lambda: {'score': 75, 'trend': 'stable'})
        
        self.sentiment_lexicon = {
            'very_positive': ['thrilled', 'excellent', 'amazing', 'fantastic', 'outstanding', 'love', 'appreciate', 'grateful'],
            'positive': ['good', 'great', 'happy', 'pleased', 'satisfied', 'thanks', 'helpful', 'wonderful'],
            'neutral': ['ok', 'okay', 'fine', 'noted', 'received', 'understood', 'thanks'],
            'negative': ['disappointed', 'frustrated', 'concerned', 'worried', 'issue', 'problem', 'difficult'],
            'very_negative': ['angry', 'terrible', 'horrible', 'unacceptable', 'furious', 'disgusted', 'worst']
        }
    
    def analyze_sentiment(self, text: str) -> Dict:
        """Analyze sentiment of email text"""
        text_lower = text.lower()
        
        scores = {
            'very_positive': 0,
            'positive': 0,
            'neutral': 0,
            'negative': 0,
            'very_negative': 0
        }
        
        for category, words in self.sentiment_lexicon.items():
            for word in words:
                if word in text_lower:
                    scores[category] += 1
        
        # Calculate weighted score (-100 to +100)
        weighted = (
            scores['very_positive'] * 40 +
            scores['positive'] * 20 +
            scores['neutral'] * 0 -
            scores['negative'] * 25 -
            scores['very_negative'] * 50
        )
        
        # Normalize to -100 to 100
        total_words = sum(scores.values())
        if total_words > 0:
            normalized_score = weighted / total_words
        else:
            normalized_score = 0  # Neutral
        
        # Determine sentiment category
        if normalized_score >= 30:
            category = 'very_positive'
        elif normalized_score >= 10:
            category = 'positive'
        elif normalized_score >= -10:
            category = 'neutral'
        elif normalized_score >= -30:
            category = 'negative'
        else:
            category = 'very_negative'
        
        return {
            'score': round(normalized_score, 2),
            'category': category,
            'breakdown': scores,
            'confidence': min(95, total_words * 15 + 50)
        }
    
    def track_thread_sentiment(self, thread: List[Dict]) -> Dict:
        """Track sentiment evolution across an email thread"""
        print(f"[{self.version}] 🎨 Tracking sentiment evolution across {len(thread)} emails")
        
        evolution = []
        participants = set()
        
        for i, email in enumerate(thread):
            sender = email.get('sender', 'unknown')
            content = email.get('content', '')
            participants.add(sender)
            
            sentiment = self.analyze_sentiment(content)
            
            evolution.append({
                'sequence': i + 1,
                'sender': sender,
                'timestamp': email.get('timestamp', datetime.now().isoformat()),
                'sentiment_score': sentiment['score'],
                'sentiment_category': sentiment['category'],
                'confidence': sentiment['confidence']
            })
            
            # Store in history
            self.sentiment_history[sender].append(sentiment['score'])
        
        # Calculate trend
        if len(evolution) >= 2:
            first_score = evolution[0]['sentiment_score']
            last_score = evolution[-1]['sentiment_score']
            trend_delta = last_score - first_score
            
            if trend_delta > 15:
                trend = 'improving'
            elif trend_delta < -15:
                trend = 'declining'
            else:
                trend = 'stable'
        else:
            trend = 'insufficient_data'
            trend_delta = 0
        
        # Relationship health score (0-100)
        avg_sentiment = sum(e['sentiment_score'] for e in evolution) / len(evolution) if evolution else 0
        health_score = max(0, min(100, 50 + avg_sentiment))
        
        # Churn risk prediction
        churn_risk = self._predict_churn_risk(evolution, trend_delta)
        
        return {
            'version': self.version,
            'engine': 'Email Sentiment Evolution Tracker',
            'thread_length': len(thread),
            'participants': list(participants),
            'sentiment_evolution': evolution,
            'trend': trend,
            'trend_delta': round(trend_delta, 2),
            'average_sentiment': round(avg_sentiment, 2),
            'relationship_health': round(health_score, 1),
            'churn_risk': churn_risk,
            'intervention_needed': health_score < 40 or trend == 'declining',
            'recommendation': self._generate_recommendation(health_score, trend, churn_risk)
        }
    
    def _predict_churn_risk(self, evolution: List[Dict], trend_delta: float) -> Dict:
        """Predict customer churn risk"""
        if not evolution:
            return {'level': 'unknown', 'probability': 0}
        
        recent_sentiments = [e['sentiment_score'] for e in evolution[-3:]]
        avg_recent = sum(recent_sentiments) / len(recent_sentiments) if recent_sentiments else 0
        
        # Risk factors
        risk_score = 0
        
        if avg_recent < -20:
            risk_score += 40
        elif avg_recent < 0:
            risk_score += 20
        
        if trend_delta < -20:
            risk_score += 30
        elif trend_delta < -10:
            risk_score += 15
        
        # Check for escalation signals
        for e in evolution[-3:]:
            if e['sentiment_category'] == 'very_negative':
                risk_score += 25
                break
        
        risk_score = min(100, risk_score)
        
        if risk_score >= 70:
            level = 'critical'
        elif risk_score >= 50:
            level = 'high'
        elif risk_score >= 30:
            level = 'medium'
        elif risk_score >= 15:
            level = 'low'
        else:
            level = 'minimal'
        
        return {
            'level': level,
            'probability': risk_score,
            'primary_factor': 'declining_sentiment' if trend_delta < -10 else 'negative_recent' if avg_recent < 0 else 'stable'
        }
    
    def _generate_recommendation(self, health_score: float, trend: str, churn_risk: Dict) -> str:
        """Generate intervention recommendation"""
        if health_score < 30 or churn_risk['level'] == 'critical':
            return 'URGENT: Schedule executive call within 24h to address concerns'
        elif health_score < 50 or churn_risk['level'] == 'high':
            return 'Schedule proactive check-in call this week with success manager'
        elif trend == 'declining':
            return 'Send personalized value-add content and schedule follow-up'
        elif health_score >= 80:
            return 'Strong relationship - consider expansion/upsell opportunity'
        else:
            return 'Maintain regular communication cadence'
    
    def process_email(self, email_data: Dict, thread: List[Dict] = None) -> Dict:
        """Process email with sentiment evolution tracking"""
        print(f"[{self.version}] Analyzing sentiment evolution")
        
        # Case-by-case analysis
        recipients = email_data.get('recipients', [])
        cc_list = email_data.get('cc', [])
        all_recipients = recipients + cc_list
        
        # Enforce reply-all
        reply_all = len(all_recipients) > 1
        
        # Analyze current email sentiment
        content = email_data.get('content', '')
        current_sentiment = self.analyze_sentiment(content)
        
        # Track thread if available
        thread_analysis = None
        if thread:
            thread_analysis = self.track_thread_sentiment(thread)
        
        response = {
            'version': self.version,
            'engine': 'Email Sentiment Evolution Tracker',
            'current_sentiment': current_sentiment,
            'thread_analysis': thread_analysis,
            'reply_all': reply_all,
            'reply_all_recipients': all_recipients if reply_all else [],
            'recommendation': self._generate_recommendation(
                thread_analysis['relationship_health'] if thread_analysis else 50,
                thread_analysis['trend'] if thread_analysis else 'stable',
                thread_analysis['churn_risk'] if thread_analysis else {'level': 'unknown'}
            )
        }
        
        print(f"[{self.version}] Sentiment: {current_sentiment['category']} ({current_sentiment['score']}), Reply-all: {reply_all}")
        return response

# Test
if __name__ == "__main__":
    engine = EmailSentimentEvolutionTracker()
    
    # Test thread with evolving sentiment
    thread = [
        {'sender': 'client@company.com', 'content': 'Hi, excited to start working with you!', 'timestamp': '2026-05-01'},
        {'sender': 'client@company.com', 'content': 'The project is going well, thanks for the help.', 'timestamp': '2026-05-10'},
        {'sender': 'client@company.com', 'content': 'I\'m concerned about the delays we\'re seeing.', 'timestamp': '2026-05-20'},
        {'sender': 'client@company.com', 'content': 'This is frustrating. We need to discuss the issues.', 'timestamp': '2026-05-28'},
    ]
    
    result = engine.track_thread_sentiment(thread)
    print(json.dumps(result, indent=2))
    
    # Test single email
    print("\n--- Single Email ---")
    single = {
        'sender': 'client@company.com',
        'content': 'Thank you for the excellent work on the project! We are thrilled with the results.',
        'recipients': ['team@company.com'],
        'cc': ['manager@company.com']
    }
    result2 = engine.process_email(single)
    print(json.dumps(result2, indent=2))
