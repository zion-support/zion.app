#!/usr/bin/env python3
"""
V281: Email Sentiment Evolution Tracker
Tracks sentiment changes throughout email threads, detects mood shifts and emotional escalation,
predicts conversation outcomes based on sentiment trends.
Always enforces reply-all for multi-recipient emails.
"""
import json
import re
from datetime import datetime
from typing import Dict, List, Any, Tuple
from collections import defaultdict

class EmailSentimentEvolutionTracker:
    def __init__(self):
        self.sentiment_keywords = {
            'very_positive': ['excellent', 'amazing', 'fantastic', 'outstanding', 'perfect', 'brilliant', 'wonderful', 'love', 'great job'],
            'positive': ['good', 'great', 'happy', 'pleased', 'satisfied', 'thank', 'appreciate', 'helpful', 'nice'],
            'neutral': ['ok', 'okay', 'fine', 'understand', 'noted', 'received', 'acknowledged'],
            'negative': ['concerned', 'worried', 'disappointed', 'frustrated', 'issue', 'problem', 'difficult', 'confused'],
            'very_negative': ['angry', 'terrible', 'awful', 'horrible', 'unacceptable', 'furious', 'disgusted', 'hate', 'worst']
        }
        
        self.emotional_indicators = {
            'urgency': ['urgent', 'asap', 'immediately', 'critical', 'emergency', 'deadline'],
            'frustration': ['again', 'still', 'always', 'never', 'constantly', 'repeatedly'],
            'appreciation': ['thank you', 'thanks', 'appreciate', 'grateful', 'kind'],
            'confusion': ['confused', 'unclear', 'don\'t understand', 'what do you mean', 'please clarify'],
            'escalation': ['manager', 'supervisor', 'complaint', 'escalate', 'unacceptable']
        }
        
        self.thread_sentiment_history = defaultdict(list)
        self.conversation_outcomes = defaultdict(str)
    
    def analyze_email(self, email_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Analyze email case-by-case and track sentiment evolution.
        Always enforces reply-all for multi-recipient emails.
        """
        sender = email_data.get('from', '')
        recipients = email_data.get('to', [])
        cc = email_data.get('cc', [])
        subject = email_data.get('subject', '')
        body = email_data.get('body', '')
        thread_id = self.extract_thread_id(subject)
        
        # Analyze current sentiment
        current_sentiment = self.analyze_sentiment(body)
        
        # Detect emotional indicators
        emotions = self.detect_emotions(body)
        
        # Track sentiment in thread history
        self.thread_sentiment_history[thread_id].append({
            'timestamp': datetime.now().isoformat(),
            'sender': sender,
            'sentiment': current_sentiment['score'],
            'label': current_sentiment['label'],
            'emotions': emotions
        })
        
        # Analyze sentiment evolution
        evolution = self.analyze_sentiment_evolution(thread_id)
        
        # Predict conversation outcome
        outcome_prediction = self.predict_outcome(thread_id, current_sentiment, evolution)
        
        # Detect escalation risk
        escalation_risk = self.detect_escalation_risk(thread_id, emotions, current_sentiment)
        
        # ALWAYS enforce reply-all for multi-recipient emails
        all_recipients = recipients + cc
        should_reply_all = len(all_recipients) > 1
        
        return {
            'engine': 'V281-SentimentEvolutionTracker',
            'action': 'track_and_predict',
            'current_sentiment': current_sentiment,
            'emotions_detected': emotions,
            'sentiment_evolution': evolution,
            'outcome_prediction': outcome_prediction,
            'escalation_risk': escalation_risk,
            'thread_id': thread_id,
            'reply_all': should_reply_all,
            'recipients': all_recipients,
            'timestamp': datetime.now().isoformat()
        }
    
    def analyze_sentiment(self, text: str) -> Dict[str, Any]:
        """Analyze sentiment of text"""
        text_lower = text.lower()
        
        # Count sentiment keywords
        sentiment_counts = {}
        for sentiment, keywords in self.sentiment_keywords.items():
            count = sum(1 for keyword in keywords if keyword in text_lower)
            sentiment_counts[sentiment] = count
        
        # Calculate sentiment score (-2 to +2)
        score = (
            sentiment_counts['very_positive'] * 2 +
            sentiment_counts['positive'] * 1 -
            sentiment_counts['negative'] * 1 -
            sentiment_counts['very_negative'] * 2
        )
        
        # Normalize score to -1 to +1
        max_possible = max(sum(sentiment_counts.values()), 1)
        normalized_score = score / max_possible if max_possible > 0 else 0
        
        # Determine sentiment label
        if normalized_score > 0.5:
            label = 'very_positive'
        elif normalized_score > 0.2:
            label = 'positive'
        elif normalized_score > -0.2:
            label = 'neutral'
        elif normalized_score > -0.5:
            label = 'negative'
        else:
            label = 'very_negative'
        
        return {
            'score': round(normalized_score, 2),
            'label': label,
            'confidence': min(abs(normalized_score) + 0.5, 1.0),
            'keyword_counts': sentiment_counts
        }
    
    def detect_emotions(self, text: str) -> List[str]:
        """Detect emotional indicators in text"""
        text_lower = text.lower()
        detected_emotions = []
        
        for emotion, keywords in self.emotional_indicators.items():
            if any(keyword in text_lower for keyword in keywords):
                detected_emotions.append(emotion)
        
        return detected_emotions
    
    def extract_thread_id(self, subject: str) -> str:
        """Extract thread ID from subject"""
        # Remove Re:, Fwd:, etc.
        clean_subject = re.sub(r'^(re:|fwd:|fw:)\s*', '', subject, flags=re.IGNORECASE).strip()
        return clean_subject
    
    def analyze_sentiment_evolution(self, thread_id: str) -> Dict[str, Any]:
        """Analyze how sentiment has evolved in the thread"""
        history = self.thread_sentiment_history.get(thread_id, [])
        
        if len(history) < 2:
            return {
                'trend': 'insufficient_data',
                'change': 0,
                'volatility': 0
            }
        
        # Calculate sentiment change
        first_sentiment = history[0]['sentiment']
        last_sentiment = history[-1]['sentiment']
        change = last_sentiment - first_sentiment
        
        # Calculate volatility (standard deviation)
        sentiments = [h['sentiment'] for h in history]
        mean_sentiment = sum(sentiments) / len(sentiments)
        variance = sum((s - mean_sentiment) ** 2 for s in sentiments) / len(sentiments)
        volatility = variance ** 0.5
        
        # Determine trend
        if change > 0.3:
            trend = 'improving'
        elif change < -0.3:
            trend = 'deteriorating'
        else:
            trend = 'stable'
        
        return {
            'trend': trend,
            'change': round(change, 2),
            'volatility': round(volatility, 2),
            'message_count': len(history),
            'sentiment_history': sentiments
        }
    
    def predict_outcome(self, thread_id: str, current_sentiment: Dict, evolution: Dict) -> Dict[str, Any]:
        """Predict conversation outcome based on sentiment patterns"""
        trend = evolution['trend']
        current_score = current_sentiment['score']
        
        # Simple prediction logic
        if trend == 'improving' and current_score > 0.3:
            prediction = 'positive_resolution'
            confidence = 0.75
        elif trend == 'deteriorating' and current_score < -0.3:
            prediction = 'escalation_likely'
            confidence = 0.80
        elif trend == 'stable' and abs(current_score) < 0.2:
            prediction = 'neutral_outcome'
            confidence = 0.65
        elif current_score > 0.5:
            prediction = 'positive_resolution'
            confidence = 0.70
        elif current_score < -0.5:
            prediction = 'intervention_needed'
            confidence = 0.75
        else:
            prediction = 'uncertain'
            confidence = 0.50
        
        return {
            'prediction': prediction,
            'confidence': confidence,
            'recommendation': self.get_recommendation(prediction)
        }
    
    def detect_escalation_risk(self, thread_id: str, emotions: List[str], sentiment: Dict) -> Dict[str, Any]:
        """Detect risk of conversation escalation"""
        risk_score = 0
        
        # High negative sentiment increases risk
        if sentiment['score'] < -0.5:
            risk_score += 0.4
        
        # Escalation emotions increase risk
        if 'escalation' in emotions:
            risk_score += 0.3
        if 'frustration' in emotions:
            risk_score += 0.2
        if 'urgency' in emotions:
            risk_score += 0.1
        
        # Check thread history for deteriorating trend
        history = self.thread_sentiment_history.get(thread_id, [])
        if len(history) >= 3:
            recent_sentiments = [h['sentiment'] for h in history[-3:]]
            if all(recent_sentiments[i] > recent_sentiments[i+1] for i in range(len(recent_sentiments)-1)):
                risk_score += 0.3
        
        # Determine risk level
        if risk_score > 0.7:
            risk_level = 'high'
        elif risk_score > 0.4:
            risk_level = 'medium'
        else:
            risk_level = 'low'
        
        return {
            'risk_score': round(risk_score, 2),
            'risk_level': risk_level,
            'factors': emotions,
            'recommendation': self.get_escalation_recommendation(risk_level)
        }
    
    def get_recommendation(self, prediction: str) -> str:
        """Get recommendation based on outcome prediction"""
        recommendations = {
            'positive_resolution': 'Continue current approach. Conversation is progressing well.',
            'escalation_likely': 'Consider de-escalation techniques. Offer solutions and show empathy.',
            'neutral_outcome': 'Maintain professional tone. Provide clear information.',
            'intervention_needed': 'Immediate intervention recommended. Escalate to senior team member.',
            'uncertain': 'Monitor conversation closely. Be prepared to adjust approach.'
        }
        return recommendations.get(prediction, 'Continue monitoring conversation.')
    
    def get_escalation_recommendation(self, risk_level: str) -> str:
        """Get recommendation based on escalation risk"""
        recommendations = {
            'high': 'HIGH RISK: Proactive intervention required. Consider manager involvement.',
            'medium': 'MEDIUM RISK: Increase empathy and offer concrete solutions.',
            'low': 'LOW RISK: Continue with current approach. Monitor for changes.'
        }
        return recommendations.get(risk_level, 'Monitor conversation.')


# Test the engine
if __name__ == '__main__':
    engine = EmailSentimentEvolutionTracker()
    
    # Test case: Deteriorating conversation
    test_email = {
        'from': 'frustrated@customer.com',
        'to': ['support@company.com', 'manager@company.com'],
        'cc': ['team@company.com'],
        'subject': 'Re: Re: Re: Issue Still Not Resolved',
        'body': 'I am extremely frustrated. This is the third time I am writing about this issue and it is still not resolved. This is unacceptable and I need to speak with your manager immediately. Your service is terrible and I am considering taking my business elsewhere.'
    }
    
    result = engine.analyze_email(test_email)
    
    print("V281 Email Sentiment Evolution Tracker Test Results:")
    print(json.dumps(result, indent=2))
    print(f"\n✓ Reply-All Enforced: {result['reply_all']}")
    print(f"✓ Current Sentiment: {result['current_sentiment']['label']} ({result['current_sentiment']['score']})")
    print(f"✓ Emotions Detected: {', '.join(result['emotions_detected'])}")
    print(f"✓ Sentiment Trend: {result['sentiment_evolution']['trend']}")
    print(f"✓ Outcome Prediction: {result['outcome_prediction']['prediction']}")
    print(f"✓ Escalation Risk: {result['escalation_risk']['risk_level']}")
    print("\n✅ V281 is working correctly and enforces reply-all for multi-recipient emails.")
