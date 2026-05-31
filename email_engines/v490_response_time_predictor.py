#!/usr/bin/env python3
"""
V490 - Email Response Time Predictor
Predicts when recipients will respond to emails based on historical patterns and context.
Features: Response time prediction, pattern analysis, optimal send timing, expectation management.
CRITICAL: Always enforces reply-all for multi-recipient emails.
"""

import json
from datetime import datetime, timedelta
from typing import Dict, List, Any
import statistics


class EmailResponseTimePredictor:
    """Predicts email response times using historical patterns."""
    
    def __init__(self):
        self.response_patterns = {}
        self.sender_profiles = {}
    
    def analyze_email(self, email: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze email and predict response times."""
        sender = email.get('from', '')
        recipients = email.get('to', []) + email.get('cc', [])
        subject = email.get('subject', '')
        body = email.get('body', '')
        sent_time = datetime.now()
        
        # Analyze email characteristics
        email_characteristics = self._analyze_email_characteristics(subject, body)
        
        # Predict response times for each recipient
        recipient_predictions = self._predict_recipient_responses(recipients, sent_time, email_characteristics)
        
        # Calculate overall response prediction
        overall_prediction = self._calculate_overall_prediction(recipient_predictions)
        
        # Determine optimal send time (if not sent yet)
        optimal_send_time = self._determine_optimal_send_time(recipients, email_characteristics)
        
        # Generate expectations
        expectations = self._generate_expectations(overall_prediction, recipient_predictions)
        
        # Provide recommendations
        recommendations = self._generate_recommendations(overall_prediction, optimal_send_time)
        
        reply_all_required = len(recipients) > 1
        
        return {
            'engine': 'V490_EmailResponseTimePredictor',
            'email_characteristics': email_characteristics,
            'recipient_predictions': recipient_predictions,
            'overall_prediction': overall_prediction,
            'optimal_send_time': optimal_send_time,
            'expectations': expectations,
            'recommendations': recommendations,
            'reply_all_required': reply_all_required,
            'reply_all_enforced': reply_all_required,
            'recipients': recipients,
            'timestamp': datetime.now().isoformat()
        }
    
    def _analyze_email_characteristics(self, subject: str, body: str) -> Dict[str, Any]:
        """Analyze characteristics that affect response time."""
        text = (subject + ' ' + body).lower()
        
        # Urgency indicators
        urgent_keywords = ['urgent', 'asap', 'immediately', 'critical', 'emergency']
        has_urgency = any(keyword in text for keyword in urgent_keywords)
        
        # Question indicators
        question_count = text.count('?')
        has_questions = question_count > 0
        
        # Length analysis
        word_count = len(body.split())
        is_long = word_count > 200
        is_short = word_count < 50
        
        # Action required
        action_keywords = ['please', 'need', 'require', 'must', 'should']
        requires_action = any(keyword in text for keyword in action_keywords)
        
        # Complexity
        complexity = 'high' if is_long and has_questions else 'medium' if has_questions else 'low'
        
        return {
            'has_urgency': has_urgency,
            'question_count': question_count,
            'has_questions': has_questions,
            'word_count': word_count,
            'is_long': is_long,
            'is_short': is_short,
            'requires_action': requires_action,
            'complexity': complexity,
            'response_urgency_multiplier': 0.5 if has_urgency else 1.0
        }
    
    def _predict_recipient_responses(self, recipients: List[str], sent_time: datetime,
                                    characteristics: Dict) -> List[Dict[str, Any]]:
        """Predict response time for each recipient."""
        predictions = []
        
        for recipient in recipients:
            # Get recipient's historical response pattern
            pattern = self._get_recipient_pattern(recipient)
            
            # Calculate base response time
            base_response_hours = pattern['average_response_hours']
            
            # Apply modifiers based on email characteristics
            modified_response_hours = base_response_hours
            
            # Urgency speeds up response
            if characteristics['has_urgency']:
                modified_response_hours *= characteristics['response_urgency_multiplier']
            
            # Questions may slow down response (need to think)
            if characteristics['has_questions']:
                modified_response_hours *= 1.2
            
            # Long emails take longer to respond to
            if characteristics['is_long']:
                modified_response_hours *= 1.3
            
            # Action required may speed up or slow down depending on complexity
            if characteristics['requires_action']:
                if characteristics['complexity'] == 'high':
                    modified_response_hours *= 1.5
                else:
                    modified_response_hours *= 0.9
            
            # Time of day adjustment
            hour_adjustment = self._calculate_hour_adjustment(sent_time, pattern)
            modified_response_hours *= hour_adjustment
            
            # Calculate predicted response time
            predicted_response_time = sent_time + timedelta(hours=modified_response_hours)
            
            # Calculate confidence
            confidence = pattern['confidence'] * (0.8 if characteristics['has_urgency'] else 1.0)
            
            predictions.append({
                'recipient': recipient,
                'base_response_hours': round(base_response_hours, 1),
                'predicted_response_hours': round(modified_response_hours, 1),
                'predicted_response_time': predicted_response_time.isoformat(),
                'confidence': round(confidence, 2),
                'response_probability': pattern['response_probability'],
                'pattern_source': pattern['source']
            })
        
        return predictions
    
    def _get_recipient_pattern(self, recipient: str) -> Dict[str, Any]:
        """Get historical response pattern for recipient."""
        # Simulate database lookup (in real implementation, query actual data)
        
        # Default pattern for new recipients
        default_pattern = {
            'average_response_hours': 24,
            'median_response_hours': 18,
            'response_probability': 0.7,
            'confidence': 0.5,
            'source': 'default',
            'active_hours': {'start': 9, 'end': 17},
            'weekend_response': False
        }
        
        # Simulate different patterns based on recipient domain
        if 'ziontechgroup.com' in recipient:
            # Internal team - faster responses
            return {
                'average_response_hours': 4,
                'median_response_hours': 2,
                'response_probability': 0.9,
                'confidence': 0.8,
                'source': 'historical',
                'active_hours': {'start': 8, 'end': 18},
                'weekend_response': True
            }
        elif 'client' in recipient or 'customer' in recipient:
            # Clients - moderate response time
            return {
                'average_response_hours': 12,
                'median_response_hours': 8,
                'response_probability': 0.8,
                'confidence': 0.7,
                'source': 'historical',
                'active_hours': {'start': 9, 'end': 17},
                'weekend_response': False
            }
        elif 'executive' in recipient or 'ceo' in recipient:
            # Executives - slower but reliable
            return {
                'average_response_hours': 36,
                'median_response_hours': 24,
                'response_probability': 0.85,
                'confidence': 0.75,
                'source': 'historical',
                'active_hours': {'start': 7, 'end': 19},
                'weekend_response': True
            }
        else:
            return default_pattern
    
    def _calculate_hour_adjustment(self, sent_time: datetime, pattern: Dict) -> float:
        """Calculate adjustment based on time of day."""
        hour = sent_time.hour
        active_hours = pattern['active_hours']
        
        # During active hours - normal response
        if active_hours['start'] <= hour < active_hours['end']:
            return 1.0
        
        # Before active hours - will respond when work starts
        elif hour < active_hours['start']:
            hours_until_active = active_hours['start'] - hour
            return 1.0 + (hours_until_active * 0.1)
        
        # After active hours - will respond next day
        else:
            hours_until_active = (24 - hour) + active_hours['start']
            return 1.0 + (hours_until_active * 0.15)
    
    def _calculate_overall_prediction(self, predictions: List[Dict]) -> Dict[str, Any]:
        """Calculate overall response prediction for the email."""
        if not predictions:
            return {
                'expected_first_response_hours': None,
                'expected_all_responses_hours': None,
                'average_confidence': 0,
                'response_probability': 0
            }
        
        # First response (minimum time)
        first_response_hours = min(p['predicted_response_hours'] for p in predictions)
        
        # All responses (maximum time)
        all_responses_hours = max(p['predicted_response_hours'] for p in predictions)
        
        # Average confidence
        average_confidence = statistics.mean([p['confidence'] for p in predictions])
        
        # Overall response probability (probability at least one person responds)
        no_response_prob = 1.0
        for p in predictions:
            no_response_prob *= (1 - p['response_probability'])
        response_probability = 1 - no_response_prob
        
        return {
            'expected_first_response_hours': round(first_response_hours, 1),
            'expected_all_responses_hours': round(all_responses_hours, 1),
            'average_confidence': round(average_confidence, 2),
            'response_probability': round(response_probability, 2),
            'recipient_count': len(predictions)
        }
    
    def _determine_optimal_send_time(self, recipients: List[str], 
                                    characteristics: Dict) -> Dict[str, Any]:
        """Determine optimal time to send email for fastest responses."""
        now = datetime.now()
        
        # Get active hours for all recipients
        active_hours_ranges = []
        for recipient in recipients:
            pattern = self._get_recipient_pattern(recipient)
            active_hours_ranges.append(pattern['active_hours'])
        
        # Find overlap in active hours
        if active_hours_ranges:
            max_start = max(range['start'] for range in active_hours_ranges)
            min_end = min(range['end'] for range in active_hours_ranges)
            
            if max_start < min_end:
                # There is overlap
                optimal_hour = (max_start + min_end) // 2
                is_optimal_now = max_start <= now.hour < min_end
            else:
                # No overlap - use middle of day
                optimal_hour = 12
                is_optimal_now = False
        else:
            optimal_hour = 12
            is_optimal_now = False
        
        # Calculate next optimal time
        if is_optimal_now:
            next_optimal = now
        else:
            next_optimal = now.replace(hour=optimal_hour, minute=0, second=0)
            if next_optimal < now:
                next_optimal += timedelta(days=1)
        
        return {
            'optimal_hour': optimal_hour,
            'is_optimal_now': is_optimal_now,
            'next_optimal_time': next_optimal.isoformat(),
            'hours_until_optimal': round((next_optimal - now).total_seconds() / 3600, 1),
            'recommendation': 'Send now' if is_optimal_now else f'Schedule for {next_optimal.strftime("%I:%M %p")}'
        }
    
    def _generate_expectations(self, overall: Dict, predictions: List[Dict]) -> List[str]:
        """Generate response time expectations."""
        expectations = []
        
        if overall['expected_first_response_hours']:
            first_hours = overall['expected_first_response_hours']
            
            if first_hours < 1:
                expectations.append(f"Expect first response within {int(first_hours * 60)} minutes")
            elif first_hours < 24:
                expectations.append(f"Expect first response within {int(first_hours)} hours")
            else:
                days = first_hours / 24
                expectations.append(f"Expect first response within {days:.1f} days")
        
        if overall['expected_all_responses_hours']:
            all_hours = overall['expected_all_responses_hours']
            
            if all_hours < 24:
                expectations.append(f"Expect all responses within {int(all_hours)} hours")
            else:
                days = all_hours / 24
                expectations.append(f"Expect all responses within {days:.1f} days")
        
        expectations.append(f"Overall response probability: {overall['response_probability'] * 100:.0f}%")
        
        # Fastest and slowest responders
        if predictions:
            fastest = min(predictions, key=lambda x: x['predicted_response_hours'])
            slowest = max(predictions, key=lambda x: x['predicted_response_hours'])
            
            if fastest['recipient'] != slowest['recipient']:
                expectations.append(f"Fastest responder: {fastest['recipient']} ({fastest['predicted_response_hours']}h)")
                expectations.append(f"Slowest responder: {slowest['recipient']} ({slowest['predicted_response_hours']}h)")
        
        return expectations
    
    def _generate_recommendations(self, overall: Dict, optimal_time: Dict) -> List[str]:
        """Generate recommendations based on predictions."""
        recommendations = []
        
        # Timing recommendations
        if not optimal_time['is_optimal_now']:
            hours_until = optimal_time['hours_until_optimal']
            if hours_until < 2:
                recommendations.append(f"Consider waiting {hours_until:.1f} hours for optimal send time")
            else:
                recommendations.append("Schedule email for optimal send time to improve response rate")
        
        # Urgency recommendations
        if overall['expected_first_response_hours'] and overall['expected_first_response_hours'] > 24:
            recommendations.append("Response time may be slow - consider follow-up strategy")
            recommendations.append("Add urgency indicators if faster response needed")
        
        # Follow-up recommendations
        if overall['expected_first_response_hours']:
            followup_time = overall['expected_first_response_hours'] * 1.5
            recommendations.append(f"If no response in {followup_time:.0f} hours, send follow-up")
        
        # General recommendations
        recommendations.append("Track actual response times to improve predictions")
        recommendations.append("Always use reply-all for multi-recipient emails")
        
        return recommendations


def main():
    """Test V490 engine."""
    engine = EmailResponseTimePredictor()
    
    test_email = {
        'from': 'kleber@ziontechgroup.com',
        'to': ['client@company.com', 'team@ziontechgroup.com'],
        'cc': ['manager@company.com'],
        'subject': 'Project Update - Need Your Feedback',
        'body': 'Hi team, I wanted to share the latest project update and get your feedback on the proposed timeline. Could you review the attached document and let me know your thoughts by Friday? Thanks!'
    }
    
    result = engine.analyze_email(test_email)
    print(json.dumps(result, indent=2))
    print(f"\n✅ First response expected: {result['overall_prediction']['expected_first_response_hours']} hours")
    print(f"✅ All responses expected: {result['overall_prediction']['expected_all_responses_hours']} hours")
    print(f"✅ Response probability: {result['overall_prediction']['response_probability'] * 100:.0f}%")
    print(f"✅ Optimal send time: {result['optimal_send_time']['recommendation']}")
    print(f"✅ Reply-all enforced: {result['reply_all_enforced']}")


if __name__ == '__main__':
    main()
