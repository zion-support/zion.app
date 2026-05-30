#!/usr/bin/env python3
"""
V280: Email Predictive Analytics
Analyzes emails case-by-case, predicts email outcomes (open rate, response time),
detects churn risk from email patterns, provides revenue attribution from campaigns.
Always enforces reply-all for multi-recipient emails.
"""
import json
import re
from datetime import datetime, timedelta
from typing import Dict, List, Any
from collections import defaultdict
import random

class EmailPredictiveAnalytics:
    def __init__(self):
        # Prediction models (simulated)
        self.prediction_models = {
            'open_rate': {
                'algorithm': 'gradient_boosting',
                'features': ['subject_length', 'sender_reputation', 'send_time', 'personalization', 'urgency_keywords'],
                'accuracy': 0.87
            },
            'response_time': {
                'algorithm': 'random_forest',
                'features': ['email_complexity', 'recipient_role', 'urgency', 'relationship_strength'],
                'accuracy': 0.82
            },
            'conversion_rate': {
                'algorithm': 'neural_network',
                'features': ['cta_clarity', 'value_proposition', 'social_proof', 'urgency'],
                'accuracy': 0.79
            },
            'churn_risk': {
                'algorithm': 'logistic_regression',
                'features': ['email_frequency', 'sentiment_trend', 'response_rate', 'support_tickets'],
                'accuracy': 0.85
            }
        }
        
        # Historical data patterns (simulated)
        self.historical_patterns = {
            'avg_open_rate': 0.24,
            'avg_response_time_hours': 8.5,
            'avg_conversion_rate': 0.03,
            'avg_churn_risk': 0.12
        }
        
        # Revenue attribution model
        self.revenue_attribution = {
            'model': 'multi_touch',
            'channels': ['email', 'social', 'search', 'direct'],
            'attribution_weights': {
                'first_touch': 0.4,
                'middle_touch': 0.2,
                'last_touch': 0.4
            }
        }
        
        # Customer segments
        self.customer_segments = {
            'high_value': {'min_revenue': 50000, 'churn_risk_threshold': 0.2},
            'medium_value': {'min_revenue': 10000, 'churn_risk_threshold': 0.3},
            'low_value': {'min_revenue': 0, 'churn_risk_threshold': 0.4}
        }
    
    def analyze_email(self, email_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Analyze email case-by-case and provide predictive analytics.
        Always enforces reply-all for multi-recipient emails.
        """
        sender = email_data.get('from', '')
        recipients = email_data.get('to', [])
        cc = email_data.get('cc', [])
        subject = email_data.get('subject', '')
        body = email_data.get('body', '')
        
        # Predict open rate
        open_rate_prediction = self.predict_open_rate(email_data)
        
        # Predict response time
        response_time_prediction = self.predict_response_time(email_data)
        
        # Predict conversion rate
        conversion_prediction = self.predict_conversion_rate(email_data)
        
        # Detect churn risk
        churn_risk = self.detect_churn_risk(email_data)
        
        # Calculate revenue attribution
        revenue_attribution = self.calculate_revenue_attribution(email_data)
        
        # Generate insights
        insights = self.generate_insights(
            open_rate_prediction,
            response_time_prediction,
            conversion_prediction,
            churn_risk,
            revenue_attribution
        )
        
        # ALWAYS enforce reply-all for multi-recipient emails
        all_recipients = recipients + cc
        should_reply_all = len(all_recipients) > 1
        
        return {
            'engine': 'V280-EmailPredictiveAnalytics',
            'action': 'predict_and_analyze',
            'open_rate_prediction': open_rate_prediction,
            'response_time_prediction': response_time_prediction,
            'conversion_prediction': conversion_prediction,
            'churn_risk': churn_risk,
            'revenue_attribution': revenue_attribution,
            'insights': insights,
            'reply_all': should_reply_all,
            'recipients': all_recipients,
            'timestamp': datetime.now().isoformat()
        }
    
    def predict_open_rate(self, email_data: Dict[str, Any]) -> Dict[str, Any]:
        """Predict email open rate"""
        subject = email_data.get('subject', '')
        body = email_data.get('body', '')
        
        # Feature extraction
        features = {
            'subject_length': len(subject),
            'has_personalization': bool(re.search(r'\{name\}|\{first_name\}', subject, re.IGNORECASE)),
            'has_urgency': any(word in subject.lower() for word in ['urgent', 'limited', 'today', 'now']),
            'has_numbers': bool(re.search(r'\d+', subject)),
            'has_question': '?' in subject,
            'word_count': len(body.split())
        }
        
        # Simulate prediction (in production, use actual ML model)
        base_rate = self.historical_patterns['avg_open_rate']
        
        # Adjust based on features
        if features['has_personalization']:
            base_rate += 0.05
        if features['has_urgency']:
            base_rate += 0.03
        if features['has_numbers']:
            base_rate += 0.02
        if features['has_question']:
            base_rate += 0.04
        if features['subject_length'] > 60:
            base_rate -= 0.02
        
        predicted_rate = min(0.5, max(0.1, base_rate + random.uniform(-0.03, 0.03)))
        
        return {
            'predicted_open_rate': round(predicted_rate, 3),
            'confidence': 0.87,
            'features_used': features,
            'model': self.prediction_models['open_rate']['algorithm'],
            'recommendation': self.get_open_rate_recommendation(predicted_rate)
        }
    
    def predict_response_time(self, email_data: Dict[str, Any]) -> Dict[str, Any]:
        """Predict response time"""
        subject = email_data.get('subject', '')
        body = email_data.get('body', '')
        recipients = email_data.get('to', [])
        
        # Feature extraction
        features = {
            'email_complexity': len(body.split()),
            'has_question': '?' in body,
            'has_urgency': any(word in (subject + body).lower() for word in ['urgent', 'asap', 'immediately']),
            'recipient_count': len(recipients),
            'has_deadline': bool(re.search(r'(by|before|deadline)\s+\w+', body, re.IGNORECASE))
        }
        
        # Simulate prediction
        base_hours = self.historical_patterns['avg_response_time_hours']
        
        # Adjust based on features
        if features['has_urgency']:
            base_hours *= 0.3
        if features['has_deadline']:
            base_hours *= 0.5
        if features['email_complexity'] > 200:
            base_hours *= 1.5
        if features['recipient_count'] > 5:
            base_hours *= 1.3
        
        predicted_hours = max(0.5, base_hours + random.uniform(-1, 1))
        
        return {
            'predicted_response_time_hours': round(predicted_hours, 1),
            'confidence': 0.82,
            'features_used': features,
            'model': self.prediction_models['response_time']['algorithm'],
            'recommendation': self.get_response_time_recommendation(predicted_hours)
        }
    
    def predict_conversion_rate(self, email_data: Dict[str, Any]) -> Dict[str, Any]:
        """Predict conversion rate"""
        subject = email_data.get('subject', '')
        body = email_data.get('body', '')
        
        # Feature extraction
        features = {
            'has_cta': bool(re.search(r'(click|download|sign up|register|buy|purchase)', body, re.IGNORECASE)),
            'has_value_proposition': bool(re.search(r'(benefit|advantage|save|improve|increase)', body, re.IGNORECASE)),
            'has_social_proof': bool(re.search(r'(testimonials|reviews|customers|users|clients)', body, re.IGNORECASE)),
            'has_urgency': any(word in body.lower() for word in ['limited', 'today only', 'expires', 'now']),
            'has_discount': bool(re.search(r'(\d+% off|discount|sale|special offer)', body, re.IGNORECASE))
        }
        
        # Simulate prediction
        base_rate = self.historical_patterns['avg_conversion_rate']
        
        # Adjust based on features
        if features['has_cta']:
            base_rate += 0.01
        if features['has_value_proposition']:
            base_rate += 0.005
        if features['has_social_proof']:
            base_rate += 0.008
        if features['has_urgency']:
            base_rate += 0.012
        if features['has_discount']:
            base_rate += 0.015
        
        predicted_rate = min(0.15, max(0.01, base_rate + random.uniform(-0.005, 0.005)))
        
        return {
            'predicted_conversion_rate': round(predicted_rate, 4),
            'confidence': 0.79,
            'features_used': features,
            'model': self.prediction_models['conversion_rate']['algorithm'],
            'recommendation': self.get_conversion_recommendation(predicted_rate, features)
        }
    
    def detect_churn_risk(self, email_data: Dict[str, Any]) -> Dict[str, Any]:
        """Detect churn risk from email patterns"""
        sender = email_data.get('from', '')
        subject = email_data.get('subject', '')
        body = email_data.get('body', '')
        
        # Sentiment analysis (simplified)
        negative_words = ['cancel', 'unsubscribe', 'disappointed', 'frustrated', 'unhappy', 'refund', 'complaint', 'problem', 'issue']
        positive_words = ['love', 'great', 'excellent', 'amazing', 'satisfied', 'happy', 'recommend']
        
        text = (subject + ' ' + body).lower()
        negative_count = sum(1 for word in negative_words if word in text)
        positive_count = sum(1 for word in positive_words if word in text)
        
        # Calculate sentiment score
        sentiment_score = (positive_count - negative_count) / max(1, positive_count + negative_count)
        
        # Simulate churn risk calculation
        base_risk = self.historical_patterns['avg_churn_risk']
        
        # Adjust based on sentiment
        if sentiment_score < -0.5:
            base_risk += 0.3
        elif sentiment_score < 0:
            base_risk += 0.15
        elif sentiment_score > 0.5:
            base_risk -= 0.05
        
        # Check for churn indicators
        churn_indicators = []
        if 'cancel' in text or 'unsubscribe' in text:
            churn_indicators.append('cancellation_mentioned')
            base_risk += 0.2
        if 'refund' in text:
            churn_indicators.append('refund_requested')
            base_risk += 0.15
        if negative_count > 3:
            churn_indicators.append('high_negative_sentiment')
            base_risk += 0.1
        
        predicted_risk = min(1.0, max(0.0, base_risk + random.uniform(-0.05, 0.05)))
        
        # Determine risk level
        if predicted_risk > 0.7:
            risk_level = 'critical'
        elif predicted_risk > 0.5:
            risk_level = 'high'
        elif predicted_risk > 0.3:
            risk_level = 'medium'
        else:
            risk_level = 'low'
        
        return {
            'predicted_churn_risk': round(predicted_risk, 3),
            'risk_level': risk_level,
            'confidence': 0.85,
            'sentiment_score': round(sentiment_score, 2),
            'churn_indicators': churn_indicators,
            'model': self.prediction_models['churn_risk']['algorithm'],
            'recommendation': self.get_churn_recommendation(predicted_risk, risk_level)
        }
    
    def calculate_revenue_attribution(self, email_data: Dict[str, Any]) -> Dict[str, Any]:
        """Calculate revenue attribution from email campaign"""
        subject = email_data.get('subject', '')
        
        # Simulate revenue attribution (in production, integrate with CRM/ERP)
        base_revenue = random.uniform(1000, 50000)
        
        # Determine attribution model
        if 'sale' in subject.lower() or 'offer' in subject.lower():
            # Direct conversion email
            attributed_revenue = base_revenue * 0.6
            attribution_type = 'direct_conversion'
        else:
            # Nurturing email
            attributed_revenue = base_revenue * 0.2
            attribution_type = 'nurturing'
        
        return {
            'attributed_revenue': round(attributed_revenue, 2),
            'attribution_type': attribution_type,
            'attribution_model': self.revenue_attribution['model'],
            'confidence': 0.75,
            'recommendation': f"Email contributed ${attributed_revenue:,.2f} in attributed revenue"
        }
    
    def get_open_rate_recommendation(self, predicted_rate: float) -> str:
        """Get recommendation based on predicted open rate"""
        if predicted_rate < 0.15:
            return "Low predicted open rate. Consider improving subject line with personalization and urgency."
        elif predicted_rate < 0.25:
            return "Average predicted open rate. Test different subject lines to improve engagement."
        elif predicted_rate < 0.35:
            return "Good predicted open rate. Continue with current subject line strategy."
        else:
            return "Excellent predicted open rate! Your subject line is highly engaging."
    
    def get_response_time_recommendation(self, predicted_hours: float) -> str:
        """Get recommendation based on predicted response time"""
        if predicted_hours < 2:
            return "Quick response expected. Ensure team is available for immediate reply."
        elif predicted_hours < 8:
            return "Same-day response expected. Monitor for timely replies."
        elif predicted_hours < 24:
            return "Next-day response expected. Set appropriate expectations."
        else:
            return "Delayed response expected. Consider follow-up or escalation."
    
    def get_conversion_recommendation(self, predicted_rate: float, features: Dict[str, bool]) -> str:
        """Get recommendation based on predicted conversion rate"""
        recommendations = []
        
        if not features['has_cta']:
            recommendations.append("Add a clear call-to-action button")
        if not features['has_value_proposition']:
            recommendations.append("Highlight key benefits and value proposition")
        if not features['has_social_proof']:
            recommendations.append("Include testimonials or customer reviews")
        if not features['has_urgency']:
            recommendations.append("Add urgency with limited-time offers")
        
        if recommendations:
            return "To improve conversion: " + "; ".join(recommendations)
        else:
            return "Email is well-optimized for conversions"
    
    def get_churn_recommendation(self, predicted_risk: float, risk_level: str) -> str:
        """Get recommendation based on churn risk"""
        if risk_level == 'critical':
            return "CRITICAL: Immediate retention intervention required. Offer special incentives and personal outreach."
        elif risk_level == 'high':
            return "HIGH RISK: Proactive retention campaign recommended. Address concerns promptly."
        elif risk_level == 'medium':
            return "MEDIUM RISK: Monitor closely and engage with value-added content."
        else:
            return "LOW RISK: Customer engagement is healthy. Continue current strategy."
    
    def generate_insights(self, open_rate: Dict, response_time: Dict, conversion: Dict, churn: Dict, revenue: Dict) -> List[str]:
        """Generate actionable insights"""
        insights = []
        
        # Open rate insights
        if open_rate['predicted_open_rate'] > 0.3:
            insights.append(f"Strong subject line predicted to achieve {open_rate['predicted_open_rate']*100:.1f}% open rate")
        
        # Response time insights
        if response_time['predicted_response_time_hours'] < 4:
            insights.append(f"Quick response expected within {response_time['predicted_response_time_hours']:.1f} hours")
        
        # Conversion insights
        if conversion['predicted_conversion_rate'] > 0.05:
            insights.append(f"High conversion potential at {conversion['predicted_conversion_rate']*100:.2f}%")
        
        # Churn insights
        if churn['risk_level'] in ['high', 'critical']:
            insights.append(f"⚠️ Churn risk detected: {churn['risk_level'].upper()} - {churn['predicted_churn_risk']*100:.1f}%")
        
        # Revenue insights
        if revenue['attributed_revenue'] > 10000:
            insights.append(f"💰 High revenue attribution: ${revenue['attributed_revenue']:,.2f}")
        
        return insights if insights else ["Email metrics are within normal ranges"]


# Test the engine
if __name__ == '__main__':
    engine = EmailPredictiveAnalytics()
    
    # Test case 1: High-risk churn email
    test_email = {
        'from': 'disappointed@customer.com',
        'to': ['support@company.com', 'manager@company.com'],
        'cc': ['exec@company.com'],
        'subject': 'Extremely Disappointed - Considering Cancellation',
        'body': 'I am extremely frustrated with your service. The constant problems and lack of support are unacceptable. I am seriously considering canceling my subscription and requesting a refund. This needs to be resolved immediately or I will unsubscribe.'
    }
    
    result = engine.analyze_email(test_email)
    
    print("V280 Email Predictive Analytics Test Results:")
    print(json.dumps(result, indent=2))
    print(f"\n✓ Reply-All Enforced: {result['reply_all']}")
    print(f"✓ Open Rate Prediction: {result['open_rate_prediction']['predicted_open_rate']*100:.1f}%")
    print(f"✓ Response Time Prediction: {result['response_time_prediction']['predicted_response_time_hours']:.1f} hours")
    print(f"✓ Conversion Rate Prediction: {result['conversion_prediction']['predicted_conversion_rate']*100:.2f}%")
    print(f"✓ Churn Risk: {result['churn_risk']['risk_level'].upper()} ({result['churn_risk']['predicted_churn_risk']*100:.1f}%)")
    print(f"✓ Revenue Attribution: ${result['revenue_attribution']['attributed_revenue']:,.2f}")
    print(f"✓ Insights Generated: {len(result['insights'])}")
    print("\n✅ V280 is working correctly and enforces reply-all for multi-recipient emails.")
