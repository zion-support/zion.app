#!/usr/bin/env python3
"""
V108: AI Email Response Time Optimizer
Analyzes email patterns to determine optimal response times, learns when
recipients are most likely to read and respond, schedules emails for maximum
engagement, and provides performance analytics.
"""

import json
import re
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass, field
from enum import Enum
from collections import defaultdict


class TimeSlot(Enum):
    EARLY_MORNING = "early_morning"  # 6-9 AM
    MORNING = "morning"  # 9-12 PM
    AFTERNOON = "afternoon"  # 12-5 PM
    EVENING = "evening"  # 5-9 PM
    NIGHT = "night"  # 9 PM-6 AM


class EngagementLevel(Enum):
    VERY_HIGH = "very_high"
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"
    VERY_LOW = "very_low"


@dataclass
class ResponsePattern:
    sender: str
    time_slot: TimeSlot
    day_of_week: int  # 0=Monday, 6=Sunday
    avg_response_time_hours: float
    open_rate: float
    reply_rate: float
    sample_size: int
    last_updated: datetime


@dataclass
class OptimalSendTime:
    recipient: str
    recommended_time: datetime
    time_slot: TimeSlot
    confidence_score: float
    expected_response_time_hours: float
    expected_open_rate: float
    reasoning: List[str]


@dataclass
class ABTestResult:
    test_id: str
    variant_a_time: datetime
    variant_b_time: datetime
    variant_a_open_rate: float
    variant_b_open_rate: float
    variant_a_reply_rate: float
    variant_b_reply_rate: float
    winner: str  # "A" or "B"
    improvement_percentage: float


class V108ResponseTimeOptimizer:
    """
    V108: AI Email Response Time Optimizer
    
    Features:
    1. Analyzes email patterns to determine optimal response times
    2. Learns when recipients are most likely to read and respond
    3. Schedules emails for maximum engagement
    4. A/B testing send times
    5. Performance analytics
    """
    
    def __init__(self):
        self.response_patterns: Dict[str, List[ResponsePattern]] = defaultdict(list)
        self.email_history: List[Dict] = []
        self.ab_tests: Dict[str, ABTestResult] = {}
        
        # Initialize with sample data
        self._initialize_sample_patterns()
    
    def _initialize_sample_patterns(self):
        """Initialize sample response patterns."""
        sample_recipients = [
            'client@company.com',
            'partner@business.com',
            'team@organization.com'
        ]
        
        for recipient in sample_recipients:
            # Morning pattern
            self.response_patterns[recipient].append(ResponsePattern(
                sender=recipient,
                time_slot=TimeSlot.MORNING,
                day_of_week=1,  # Tuesday
                avg_response_time_hours=2.5,
                open_rate=0.85,
                reply_rate=0.45,
                sample_size=25,
                last_updated=datetime.now()
            ))
            
            # Afternoon pattern
            self.response_patterns[recipient].append(ResponsePattern(
                sender=recipient,
                time_slot=TimeSlot.AFTERNOON,
                day_of_week=2,  # Wednesday
                avg_response_time_hours=4.0,
                open_rate=0.70,
                reply_rate=0.35,
                sample_size=20,
                last_updated=datetime.now()
            ))
    
    def analyze_recipient_pattern(self, recipient: str) -> Dict:
        """Analyze response patterns for a recipient."""
        if recipient not in self.response_patterns:
            return {
                'recipient': recipient,
                'patterns_analyzed': 0,
                'best_time_slot': 'unknown',
                'best_day': 'unknown',
                'avg_response_time': 'unknown',
                'confidence': 0.0
            }
        
        patterns = self.response_patterns[recipient]
        
        # Find best time slot
        best_pattern = max(patterns, key=lambda p: p.open_rate * p.reply_rate)
        
        # Calculate average response time
        avg_response = sum(p.avg_response_time_hours for p in patterns) / len(patterns)
        
        # Calculate confidence based on sample size
        total_samples = sum(p.sample_size for p in patterns)
        confidence = min(1.0, total_samples / 50)  # Max confidence at 50 samples
        
        day_names = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        
        return {
            'recipient': recipient,
            'patterns_analyzed': len(patterns),
            'best_time_slot': best_pattern.time_slot.value,
            'best_day': day_names[best_pattern.day_of_week],
            'avg_response_time_hours': round(avg_response, 1),
            'open_rate': round(best_pattern.open_rate, 2),
            'reply_rate': round(best_pattern.reply_rate, 2),
            'confidence': round(confidence, 2)
        }
    
    def suggest_optimal_send_time(self, recipient: str, urgency: str = 'normal') -> OptimalSendTime:
        """Suggest optimal time to send email to recipient."""
        now = datetime.now()
        
        if recipient not in self.response_patterns:
            # Default to business hours
            if now.hour < 9:
                recommended = now.replace(hour=9, minute=0, second=0)
            elif now.hour > 17:
                recommended = (now + timedelta(days=1)).replace(hour=9, minute=0, second=0)
            else:
                recommended = now + timedelta(hours=1)
            
            return OptimalSendTime(
                recipient=recipient,
                recommended_time=recommended,
                time_slot=TimeSlot.MORNING,
                confidence_score=0.3,
                expected_response_time_hours=24.0,
                expected_open_rate=0.5,
                reasoning=['No historical data available - defaulting to business hours']
            )
        
        patterns = self.response_patterns[recipient]
        
        # Find best pattern
        best_pattern = max(patterns, key=lambda p: p.open_rate * p.reply_rate)
        
        # Calculate recommended time
        if best_pattern.time_slot == TimeSlot.MORNING:
            target_hour = 10
        elif best_pattern.time_slot == TimeSlot.AFTERNOON:
            target_hour = 14
        elif best_pattern.time_slot == TimeSlot.EARLY_MORNING:
            target_hour = 8
        elif best_pattern.time_slot == TimeSlot.EVENING:
            target_hour = 18
        else:
            target_hour = 10
        
        # Calculate days until best day
        days_ahead = best_pattern.day_of_week - now.weekday()
        if days_ahead < 0:
            days_ahead += 7
        elif days_ahead == 0 and now.hour >= target_hour:
            days_ahead = 7
        
        recommended_time = (now + timedelta(days=days_ahead)).replace(
            hour=target_hour,
            minute=0,
            second=0
        )
        
        # Adjust for urgency
        if urgency == 'high':
            recommended_time = now + timedelta(hours=1)
            reasoning = ['High urgency - sending immediately']
        elif urgency == 'low':
            reasoning = [
                f'Best time slot: {best_pattern.time_slot.value}',
                f'Best day: {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"][best_pattern.day_of_week]}',
                f'Expected open rate: {best_pattern.open_rate:.0%}',
                f'Expected reply rate: {best_pattern.reply_rate:.0%}'
            ]
        else:
            reasoning = [
                f'Optimal time slot: {best_pattern.time_slot.value}',
                f'Based on {sum(p.sample_size for p in patterns)} historical emails',
                f'Expected response time: {best_pattern.avg_response_time_hours:.1f} hours'
            ]
        
        # Calculate confidence
        total_samples = sum(p.sample_size for p in patterns)
        confidence = min(1.0, total_samples / 50)
        
        return OptimalSendTime(
            recipient=recipient,
            recommended_time=recommended_time,
            time_slot=best_pattern.time_slot,
            confidence_score=confidence,
            expected_response_time_hours=best_pattern.avg_response_time_hours,
            expected_open_rate=best_pattern.open_rate,
            reasoning=reasoning
        )
    
    def track_email_engagement(self, email_data: Dict):
        """Track email engagement metrics."""
        recipient = email_data.get('to', '')
        sent_time = datetime.fromisoformat(email_data.get('sent_time', datetime.now().isoformat()))
        opened_time = email_data.get('opened_time')
        replied_time = email_data.get('replied_time')
        
        # Calculate time slot
        hour = sent_time.hour
        if 6 <= hour < 9:
            time_slot = TimeSlot.EARLY_MORNING
        elif 9 <= hour < 12:
            time_slot = TimeSlot.MORNING
        elif 12 <= hour < 17:
            time_slot = TimeSlot.AFTERNOON
        elif 17 <= hour < 21:
            time_slot = TimeSlot.EVENING
        else:
            time_slot = TimeSlot.NIGHT
        
        # Calculate metrics
        opened = opened_time is not None
        replied = replied_time is not None
        
        response_time = None
        if replied and replied_time:
            replied_dt = datetime.fromisoformat(replied_time)
            response_time = (replied_dt - sent_time).total_seconds() / 3600
        
        # Store in history
        self.email_history.append({
            'recipient': recipient,
            'sent_time': sent_time.isoformat(),
            'time_slot': time_slot.value,
            'day_of_week': sent_time.weekday(),
            'opened': opened,
            'replied': replied,
            'response_time_hours': response_time
        })
        
        # Update patterns
        self._update_pattern(recipient, time_slot, sent_time.weekday(), opened, replied, response_time)
    
    def _update_pattern(self, recipient: str, time_slot: TimeSlot, day_of_week: int,
                       opened: bool, replied: bool, response_time: Optional[float]):
        """Update response pattern with new data."""
        # Find existing pattern or create new one
        existing = None
        for pattern in self.response_patterns[recipient]:
            if pattern.time_slot == time_slot and pattern.day_of_week == day_of_week:
                existing = pattern
                break
        
        if existing:
            # Update existing pattern
            existing.sample_size += 1
            existing.open_rate = (existing.open_rate * (existing.sample_size - 1) + (1 if opened else 0)) / existing.sample_size
            existing.reply_rate = (existing.reply_rate * (existing.sample_size - 1) + (1 if replied else 0)) / existing.sample_size
            if response_time is not None:
                existing.avg_response_time_hours = (existing.avg_response_time_hours * (existing.sample_size - 1) + response_time) / existing.sample_size
            existing.last_updated = datetime.now()
        else:
            # Create new pattern
            self.response_patterns[recipient].append(ResponsePattern(
                sender=recipient,
                time_slot=time_slot,
                day_of_week=day_of_week,
                avg_response_time_hours=response_time if response_time else 24.0,
                open_rate=1.0 if opened else 0.0,
                reply_rate=1.0 if replied else 0.0,
                sample_size=1,
                last_updated=datetime.now()
            ))
    
    def run_ab_test(self, recipient: str, variant_a_time: datetime, 
                   variant_b_time: datetime) -> str:
        """Set up A/B test for send times."""
        test_id = f"ab_test_{recipient}_{datetime.now().timestamp()}"
        
        # Create placeholder result
        self.ab_tests[test_id] = ABTestResult(
            test_id=test_id,
            variant_a_time=variant_a_time,
            variant_b_time=variant_b_time,
            variant_a_open_rate=0.0,
            variant_b_open_rate=0.0,
            variant_a_reply_rate=0.0,
            variant_b_reply_rate=0.0,
            winner='pending',
            improvement_percentage=0.0
        )
        
        return test_id
    
    def complete_ab_test(self, test_id: str, variant_a_results: Dict, variant_b_results: Dict):
        """Complete A/B test with results."""
        if test_id not in self.ab_tests:
            return
        
        test = self.ab_tests[test_id]
        
        test.variant_a_open_rate = variant_a_results.get('open_rate', 0.0)
        test.variant_b_open_rate = variant_b_results.get('open_rate', 0.0)
        test.variant_a_reply_rate = variant_a_results.get('reply_rate', 0.0)
        test.variant_b_reply_rate = variant_b_results.get('reply_rate', 0.0)
        
        # Determine winner
        score_a = test.variant_a_open_rate * 0.5 + test.variant_a_reply_rate * 0.5
        score_b = test.variant_b_open_rate * 0.5 + test.variant_b_reply_rate * 0.5
        
        if score_a > score_b:
            test.winner = 'A'
            test.improvement_percentage = ((score_a - score_b) / score_b * 100) if score_b > 0 else 0
        else:
            test.winner = 'B'
            test.improvement_percentage = ((score_b - score_a) / score_a * 100) if score_a > 0 else 0
    
    def get_performance_analytics(self, recipient: Optional[str] = None) -> Dict:
        """Get performance analytics."""
        if recipient:
            emails = [e for e in self.email_history if e['recipient'] == recipient]
        else:
            emails = self.email_history
        
        if not emails:
            return {
                'total_emails': 0,
                'avg_open_rate': 0.0,
                'avg_reply_rate': 0.0,
                'avg_response_time_hours': 0.0,
                'best_time_slot': 'unknown'
            }
        
        # Calculate metrics
        total = len(emails)
        opened = sum(1 for e in emails if e['opened'])
        replied = sum(1 for e in emails if e['replied'])
        response_times = [e['response_time_hours'] for e in emails if e['response_time_hours'] is not None]
        
        # Find best time slot
        time_slot_stats = defaultdict(lambda: {'opened': 0, 'replied': 0, 'total': 0})
        for email in emails:
            slot = email['time_slot']
            time_slot_stats[slot]['total'] += 1
            if email['opened']:
                time_slot_stats[slot]['opened'] += 1
            if email['replied']:
                time_slot_stats[slot]['replied'] += 1
        
        best_slot = max(time_slot_stats.items(), 
                       key=lambda x: (x[1]['opened'] / x[1]['total'] * 0.5 + x[1]['replied'] / x[1]['total'] * 0.5) if x[1]['total'] > 0 else 0)
        
        return {
            'total_emails': total,
            'avg_open_rate': opened / total if total > 0 else 0.0,
            'avg_reply_rate': replied / total if total > 0 else 0.0,
            'avg_response_time_hours': sum(response_times) / len(response_times) if response_times else 0.0,
            'best_time_slot': best_slot[0],
            'best_slot_open_rate': best_slot[1]['opened'] / best_slot[1]['total'] if best_slot[1]['total'] > 0 else 0.0,
            'best_slot_reply_rate': best_slot[1]['replied'] / best_slot[1]['total'] if best_slot[1]['total'] > 0 else 0.0
        }
    
    def generate_optimization_report(self, recipient: str) -> Dict:
        """Generate comprehensive optimization report."""
        pattern_analysis = self.analyze_recipient_pattern(recipient)
        optimal_time = self.suggest_optimal_send_time(recipient)
        analytics = self.get_performance_analytics(recipient)
        
        return {
            'recipient': recipient,
            'pattern_analysis': pattern_analysis,
            'optimal_send_time': {
                'recommended_time': optimal_time.recommended_time.isoformat(),
                'time_slot': optimal_time.time_slot.value,
                'confidence': optimal_time.confidence_score,
                'expected_response_time': optimal_time.expected_response_time_hours,
                'reasoning': optimal_time.reasoning
            },
            'performance_analytics': analytics,
            'recommendations': self._generate_recommendations(pattern_analysis, analytics)
        }
    
    def _generate_recommendations(self, pattern: Dict, analytics: Dict) -> List[str]:
        """Generate optimization recommendations."""
        recommendations = []
        
        if pattern['confidence'] < 0.5:
            recommendations.append('Collect more data to improve prediction accuracy')
        
        if analytics['avg_open_rate'] < 0.6:
            recommendations.append('Consider testing different subject lines to improve open rates')
        
        if analytics['avg_reply_rate'] < 0.3:
            recommendations.append('Review email content to improve engagement and reply rates')
        
        if pattern['best_time_slot'] != 'unknown':
            recommendations.append(f"Schedule emails during {pattern['best_time_slot']} for best results")
        
        return recommendations


# Test the implementation
if __name__ == "__main__":
    optimizer = V108ResponseTimeOptimizer()
    
    # Simulate some email history
    test_emails = [
        {
            'to': 'client@company.com',
            'sent_time': (datetime.now() - timedelta(days=5, hours=2)).isoformat(),
            'opened_time': (datetime.now() - timedelta(days=5, hours=1)).isoformat(),
            'replied_time': (datetime.now() - timedelta(days=5)).isoformat()
        },
        {
            'to': 'client@company.com',
            'sent_time': (datetime.now() - timedelta(days=3, hours=5)).isoformat(),
            'opened_time': (datetime.now() - timedelta(days=3, hours=3)).isoformat(),
            'replied_time': None
        },
        {
            'to': 'client@company.com',
            'sent_time': (datetime.now() - timedelta(days=1, hours=8)).isoformat(),
            'opened_time': (datetime.now() - timedelta(days=1, hours=7)).isoformat(),
            'replied_time': (datetime.now() - timedelta(days=1, hours=5)).isoformat()
        }
    ]
    
    print("V108: AI Email Response Time Optimizer")
    print("=" * 60)
    
    # Track engagement
    for email in test_emails:
        optimizer.track_email_engagement(email)
    
    # Analyze pattern
    recipient = 'client@company.com'
    pattern = optimizer.analyze_recipient_pattern(recipient)
    print(f"\nRecipient Pattern Analysis:")
    print(json.dumps(pattern, indent=2))
    
    # Suggest optimal time
    optimal = optimizer.suggest_optimal_send_time(recipient)
    print(f"\nOptimal Send Time:")
    print(f"  Recommended: {optimal.recommended_time}")
    print(f"  Time Slot: {optimal.time_slot.value}")
    print(f"  Confidence: {optimal.confidence_score:.2f}")
    print(f"  Expected Response: {optimal.expected_response_time_hours:.1f} hours")
    print(f"  Reasoning:")
    for reason in optimal.reasoning:
        print(f"    - {reason}")
    
    # Get analytics
    analytics = optimizer.get_performance_analytics(recipient)
    print(f"\nPerformance Analytics:")
    print(json.dumps(analytics, indent=2))
    
    # Generate report
    report = optimizer.generate_optimization_report(recipient)
    print(f"\n" + "=" * 60)
    print("Optimization Report:")
    print(json.dumps(report, indent=2))
