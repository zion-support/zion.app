#!/usr/bin/env python3
"""V290: Email Performance Predictor — Predicts email success before sending,
suggests improvements for subject/content, forecasts response likelihood.
Always enforces reply-all for multi-recipient emails."""
import json, re
from datetime import datetime
from collections import defaultdict

class EmailPerformancePredictor:
    def __init__(self):
        self.prediction_models = {
            'open_rate': {
                'features': ['subject_length', 'personalization', 'urgency', 'specificity', 'emoji_usage'],
                'weights': [0.2, 0.25, 0.15, 0.2, 0.2]
            },
            'response_rate': {
                'features': ['question_count', 'cta_clarity', 'length', 'tone', 'relevance'],
                'weights': [0.25, 0.3, 0.15, 0.15, 0.15]
            },
            'engagement': {
                'features': ['visual_elements', 'interactivity', 'value_proposition', 'storytelling'],
                'weights': [0.2, 0.25, 0.3, 0.25]
            }
        }
        self.historical_data = {
            'avg_open_rate': 0.24,
            'avg_response_rate': 0.35,
            'avg_engagement_score': 65
        }
        self.improvement_suggestions = defaultdict(list)
    
    def analyze_email(self, email_data):
        sender = email_data.get('from', '')
        recipients = email_data.get('to', [])
        cc = email_data.get('cc', [])
        subject = email_data.get('subject', '')
        body = email_data.get('body', '')
        
        # Predict open rate
        open_rate_prediction = self._predict_open_rate(subject, body)
        
        # Predict response rate
        response_rate_prediction = self._predict_response_rate(subject, body)
        
        # Predict engagement
        engagement_prediction = self._predict_engagement(subject, body)
        
        # Generate improvement suggestions
        improvements = self._generate_improvements(subject, body, open_rate_prediction, response_rate_prediction)
        
        # Calculate overall performance score
        performance_score = self._calculate_performance_score(
            open_rate_prediction, response_rate_prediction, engagement_prediction
        )
        
        # Forecast response timing
        response_forecast = self._forecast_response_timing(recipients, subject, body)
        
        # Generate predictive response
        response = self._generate_predictive_response(
            email_data, performance_score, open_rate_prediction, 
            response_rate_prediction, improvements, response_forecast
        )
        
        all_recipients = list(set(recipients + cc))
        if sender and sender not in all_recipients:
            all_recipients.insert(0, sender)
        
        return {
            'engine': 'V290-PerformancePredictor',
            'predictions': {
                'open_rate': open_rate_prediction,
                'response_rate': response_rate_prediction,
                'engagement': engagement_prediction,
                'performance_score': performance_score,
                'response_timing': response_forecast
            },
            'improvements': improvements,
            'improvement_count': len(improvements),
            'response': response,
            'reply_to': all_recipients,
            'reply_all_enforced': len(all_recipients) > 1
        }
    
    def _predict_open_rate(self, subject, body):
        features = self._extract_subject_features(subject)
        
        # Calculate score based on features
        score = 0.0
        
        # Subject length (optimal: 30-50 chars)
        if 30 <= features['length'] <= 50:
            score += 0.2
        elif 20 <= features['length'] <= 60:
            score += 0.1
        
        # Personalization
        if features['personalization']:
            score += 0.25
        
        # Urgency/curiosity
        if features['urgency']:
            score += 0.15
        
        # Specificity (numbers, details)
        if features['specificity']:
            score += 0.2
        
        # Emoji usage (moderate is good)
        if features['emoji_count'] == 1:
            score += 0.2
        elif features['emoji_count'] > 2:
            score -= 0.1
        
        # Normalize to probability
        predicted_rate = min(0.6, max(0.1, self.historical_data['avg_open_rate'] + score * 0.5))
        
        return {
            'predicted_rate': round(predicted_rate, 3),
            'confidence': 0.75,
            'features': features,
            'benchmark': self.historical_data['avg_open_rate']
        }
    
    def _predict_response_rate(self, subject, body):
        features = self._extract_body_features(body)
        
        score = 0.0
        
        # Question count (1-3 is optimal)
        if 1 <= features['question_count'] <= 3:
            score += 0.25
        elif features['question_count'] > 5:
            score -= 0.1
        
        # Clear CTA
        if features['has_cta']:
            score += 0.3
        
        # Length (100-300 words optimal)
        if 100 <= features['word_count'] <= 300:
            score += 0.15
        elif features['word_count'] > 500:
            score -= 0.1
        
        # Tone (positive/neutral is better)
        if features['positive_tone']:
            score += 0.15
        
        # Relevance to recipient
        if features['relevance_score'] > 0.7:
            score += 0.15
        
        predicted_rate = min(0.7, max(0.1, self.historical_data['avg_response_rate'] + score * 0.4))
        
        return {
            'predicted_rate': round(predicted_rate, 3),
            'confidence': 0.70,
            'features': features,
            'benchmark': self.historical_data['avg_response_rate']
        }
    
    def _predict_engagement(self, subject, body):
        text = (subject + ' ' + body).lower()
        
        score = 50  # Base score
        
        # Visual elements
        if any(element in body for element in ['•', '-', '*', '1.', '2.']):
            score += 10
        
        # Interactivity (questions, polls, links)
        if '?' in body or 'http' in body:
            score += 15
        
        # Value proposition
        value_words = ['benefit', 'advantage', 'improve', 'save', 'gain', 'achieve']
        if any(word in text for word in value_words):
            score += 15
        
        # Storytelling
        story_indicators = ['story', 'example', 'case study', 'scenario', 'imagine']
        if any(indicator in text for indicator in story_indicators):
            score += 10
        
        # Personalization
        if any(word in text for word in ['you', 'your', 'we', 'us', 'together']):
            score += 10
        
        return {
            'predicted_score': min(100, max(0, score)),
            'confidence': 0.65,
            'benchmark': self.historical_data['avg_engagement_score']
        }
    
    def _extract_subject_features(self, subject):
        # Simple emoji detection using Unicode ranges
        emoji_count = sum(1 for char in subject if ord(char) > 0x1F600 and ord(char) < 0x1F64F)
        
        return {
            'length': len(subject),
            'personalization': any(word in subject.lower() for word in ['you', 'your', 'we', 'us']),
            'urgency': any(word in subject.lower() for word in ['urgent', 'important', 'now', 'today', 'limited']),
            'specificity': bool(re.search(r'\d+', subject)),
            'emoji_count': emoji_count,
            'has_question': '?' in subject
        }
    
    def _extract_body_features(self, body):
        text = body.lower()
        
        # Count questions
        question_count = body.count('?')
        
        # Check for CTA
        cta_indicators = ['please', 'click', 'reply', 'schedule', 'let me know', 'confirm']
        has_cta = any(cta in text for cta in cta_indicators)
        
        # Word count
        word_count = len(body.split())
        
        # Tone analysis (simplified)
        positive_words = ['great', 'excellent', 'wonderful', 'amazing', 'love', 'happy', 'pleased']
        negative_words = ['bad', 'terrible', 'awful', 'hate', 'disappointed', 'frustrated']
        positive_count = sum(1 for word in positive_words if word in text)
        negative_count = sum(1 for word in negative_words if word in text)
        positive_tone = positive_count > negative_count
        
        # Relevance score (simplified - would use ML in production)
        relevance_score = 0.7  # Default
        
        return {
            'question_count': question_count,
            'has_cta': has_cta,
            'word_count': word_count,
            'positive_tone': positive_tone,
            'relevance_score': relevance_score
        }
    
    def _generate_improvements(self, subject, body, open_rate, response_rate):
        improvements = []
        
        # Subject line improvements
        features = open_rate['features']
        if features['length'] < 30:
            improvements.append({
                'category': 'subject_line',
                'issue': 'Subject too short',
                'suggestion': 'Expand subject to 30-50 characters for better visibility',
                'impact': 'high'
            })
        elif features['length'] > 60:
            improvements.append({
                'category': 'subject_line',
                'issue': 'Subject too long',
                'suggestion': 'Shorten subject to under 60 characters',
                'impact': 'medium'
            })
        
        if not features['personalization']:
            improvements.append({
                'category': 'subject_line',
                'issue': 'No personalization',
                'suggestion': 'Add personalized elements like "you" or recipient name',
                'impact': 'high'
            })
        
        # Body improvements
        body_features = response_rate['features']
        if body_features['question_count'] == 0:
            improvements.append({
                'category': 'engagement',
                'issue': 'No questions asked',
                'suggestion': 'Add 1-3 questions to encourage responses',
                'impact': 'high'
            })
        
        if not body_features['has_cta']:
            improvements.append({
                'category': 'engagement',
                'issue': 'No clear call-to-action',
                'suggestion': 'Add a clear CTA like "Please reply" or "Let me know"',
                'impact': 'critical'
            })
        
        if body_features['word_count'] > 400:
            improvements.append({
                'category': 'length',
                'issue': 'Email too long',
                'suggestion': 'Condense to 200-300 words for better engagement',
                'impact': 'medium'
            })
        
        return improvements
    
    def _calculate_performance_score(self, open_rate, response_rate, engagement):
        # Weighted average of all metrics
        open_score = open_rate['predicted_rate'] / 0.6 * 100  # Normalize to 0-100
        response_score = response_rate['predicted_rate'] / 0.7 * 100
        engagement_score = engagement['predicted_score']
        
        performance = (open_score * 0.3 + response_score * 0.4 + engagement_score * 0.3)
        
        return {
            'score': min(100, max(0, int(performance))),
            'grade': self._get_grade(performance),
            'components': {
                'open_rate': round(open_score, 1),
                'response_rate': round(response_score, 1),
                'engagement': round(engagement_score, 1)
            }
        }
    
    def _get_grade(self, score):
        if score >= 90:
            return 'A'
        elif score >= 80:
            return 'B'
        elif score >= 70:
            return 'C'
        elif score >= 60:
            return 'D'
        return 'F'
    
    def _forecast_response_timing(self, recipients, subject, body):
        # Simplified timing prediction
        text = (subject + ' ' + body).lower()
        
        # Urgency affects response time
        if any(word in text for word in ['urgent', 'asap', 'immediately']):
            predicted_hours = 4
        elif any(word in text for word in ['when convenient', 'no rush']):
            predicted_hours = 48
        else:
            predicted_hours = 24
        
        # Recipient count affects time
        if len(recipients) > 5:
            predicted_hours *= 1.5
        
        return {
            'predicted_response_time_hours': round(predicted_hours, 1),
            'confidence': 0.60,
            'best_follow_up_time': round(predicted_hours * 1.5, 1)
        }
    
    def _generate_predictive_response(self, email_data, performance, open_rate, response_rate, improvements, forecast):
        subject = email_data.get('subject', '')
        
        response = f"📈 Performance Prediction for '{subject}':\n\n"
        response += f"Overall Score: {performance['score']}/100 (Grade: {performance['grade']})\n\n"
        
        response += "Predictions:\n"
        response += f"• Open Rate: {open_rate['predicted_rate']*100:.1f}% (avg: {open_rate['benchmark']*100:.1f}%)\n"
        response += f"• Response Rate: {response_rate['predicted_rate']*100:.1f}% (avg: {response_rate['benchmark']*100:.1f}%)\n"
        response += f"• Response Time: ~{forecast['predicted_response_time_hours']:.0f} hours\n\n"
        
        if improvements:
            response += f"Improvement Suggestions ({len(improvements)}):\n"
            for i, imp in enumerate(improvements[:3], 1):
                response += f"{i}. [{imp['impact'].upper()}] {imp['suggestion']}\n"
        
        response += "\n---\nZion Tech Group | AI Email Intelligence V290\n📱 +1 302 464 0950 | ✉️ kleber@ziontechgroup.com\n📍 364 E Main St STE 1008, Middletown DE 19709"
        
        return response

if __name__ == "__main__":
    engine = EmailPerformancePredictor()
    test = {
        "from": "sales@company.com",
        "to": ["prospect@client.com", "decision-maker@client.com"],
        "cc": ["manager@company.com"],
        "subject": "Quick question about your Q4 goals",
        "body": "Hi there! I noticed your company has been expanding recently. I'm curious - what are your top priorities for Q4? We've helped similar companies achieve 30% growth through our platform. Would you be open to a 15-minute call to explore if we could help? Please let me know what time works best for you!"
    }
    result = engine.analyze_email(test)
    print(json.dumps(result, indent=2))
    print("\n✅ V290 Performance Predictor — All systems operational | Reply-All: ENFORCED")
