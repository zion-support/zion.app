#!/usr/bin/env python3
"""
V168 - AI Email Campaign Performance Analyzer
Tracks email marketing effectiveness, analyzes open rates and engagement patterns,
optimizes send times and subject lines, A/B tests campaigns automatically, and generates ROI reports.
"""

import json
import re
from datetime import datetime, timedelta
from typing import Dict, List, Optional
from collections import defaultdict
import statistics

class CampaignPerformanceAnalyzer:
    def __init__(self):
        self.campaigns = defaultdict(dict)
        self.email_events = defaultdict(list)
        self.ab_tests = defaultdict(dict)
        self.benchmarks = {
            'open_rate': {'excellent': 0.30, 'good': 0.20, 'average': 0.15, 'poor': 0.10},
            'click_rate': {'excellent': 0.10, 'good': 0.05, 'average': 0.03, 'poor': 0.01},
            'reply_rate': {'excellent': 0.08, 'good': 0.04, 'average': 0.02, 'poor': 0.01},
            'unsubscribe_rate': {'excellent': 0.001, 'good': 0.005, 'average': 0.01, 'poor': 0.02}
        }
    
    def track_campaign(self, campaign_id: str, email_data: Dict):
        """Track a campaign email send."""
        self.campaigns[campaign_id] = {
            'name': email_data.get('name', campaign_id),
            'subject': email_data.get('subject', ''),
            'sent_at': email_data.get('sent_at', datetime.now().isoformat()),
            'recipients': email_data.get('recipients', []),
            'total_sent': email_data.get('total_sent', 0),
            'segment': email_data.get('segment', 'all'),
            'variant': email_data.get('variant', 'A'),
            'ab_test_id': email_data.get('ab_test_id', None)
        }
    
    def track_event(self, campaign_id: str, event_type: str, recipient: str, 
                   timestamp: str = None, metadata: Dict = None):
        """Track email events (open, click, reply, bounce, unsubscribe)."""
        event = {
            'campaign_id': campaign_id,
            'event_type': event_type,
            'recipient': recipient,
            'timestamp': timestamp or datetime.now().isoformat(),
            'metadata': metadata or {}
        }
        self.email_events[campaign_id].append(event)
    
    def analyze_campaign(self, campaign_id: str) -> Dict:
        """Analyze campaign performance comprehensively."""
        if campaign_id not in self.campaigns:
            return {'error': 'Campaign not found'}
        
        campaign = self.campaigns[campaign_id]
        events = self.email_events.get(campaign_id, [])
        
        if not events:
            return {'error': 'No events tracked for this campaign'}
        
        total_sent = campaign.get('total_sent', len(campaign.get('recipients', [])))
        
        # Calculate metrics
        metrics = self._calculate_metrics(events, total_sent)
        
        # Benchmark comparison
        benchmark_results = self._compare_benchmarks(metrics)
        
        # Engagement patterns
        engagement_patterns = self._analyze_engagement_patterns(events)
        
        # Subject line analysis
        subject_analysis = self._analyze_subject_line(campaign.get('subject', ''))
        
        # Timing analysis
        timing_analysis = self._analyze_timing(events, campaign.get('sent_at'))
        
        # ROI estimation
        roi = self._estimate_roi(metrics, campaign)
        
        # Recommendations
        recommendations = self._generate_campaign_recommendations(metrics, benchmark_results, engagement_patterns)
        
        return {
            'campaign_id': campaign_id,
            'campaign_name': campaign.get('name'),
            'analysis_timestamp': datetime.now().isoformat(),
            'total_sent': total_sent,
            'metrics': metrics,
            'benchmark_comparison': benchmark_results,
            'engagement_patterns': engagement_patterns,
            'subject_line_analysis': subject_analysis,
            'timing_analysis': timing_analysis,
            'roi_estimation': roi,
            'recommendations': recommendations,
            'overall_grade': self._calculate_grade(benchmark_results)
        }
    
    def _calculate_metrics(self, events: List[Dict], total_sent: int) -> Dict:
        """Calculate key campaign metrics."""
        event_counts = defaultdict(int)
        unique_recipients = defaultdict(set)
        
        for event in events:
            event_type = event['event_type']
            recipient = event['recipient']
            
            event_counts[event_type] += 1
            unique_recipients[event_type].add(recipient)
        
        metrics = {
            'opens': len(unique_recipients.get('open', set())),
            'clicks': len(unique_recipients.get('click', set())),
            'replies': len(unique_recipients.get('reply', set())),
            'bounces': len(unique_recipients.get('bounce', set())),
            'unsubscribes': len(unique_recipients.get('unsubscribe', set())),
            'total_events': len(events)
        }
        
        # Calculate rates
        metrics['open_rate'] = round(metrics['opens'] / max(total_sent, 1), 4)
        metrics['click_rate'] = round(metrics['clicks'] / max(total_sent, 1), 4)
        metrics['reply_rate'] = round(metrics['replies'] / max(total_sent, 1), 4)
        metrics['bounce_rate'] = round(metrics['bounces'] / max(total_sent, 1), 4)
        metrics['unsubscribe_rate'] = round(metrics['unsubscribes'] / max(total_sent, 1), 4)
        
        # Click-to-open rate
        if metrics['opens'] > 0:
            metrics['click_to_open_rate'] = round(metrics['clicks'] / metrics['opens'], 4)
        else:
            metrics['click_to_open_rate'] = 0
        
        return metrics
    
    def _compare_benchmarks(self, metrics: Dict) -> Dict:
        """Compare metrics against industry benchmarks."""
        comparisons = {}
        
        for metric_name in ['open_rate', 'click_rate', 'reply_rate', 'unsubscribe_rate']:
            value = metrics.get(metric_name, 0)
            benchmark = self.benchmarks.get(metric_name, {})
            
            if value >= benchmark.get('excellent', 1):
                rating = 'excellent'
            elif value >= benchmark.get('good', 0.5):
                rating = 'good'
            elif value >= benchmark.get('average', 0.25):
                rating = 'average'
            else:
                rating = 'poor'
            
            # For unsubscribe rate, lower is better
            if metric_name == 'unsubscribe_rate':
                if value <= benchmark.get('excellent', 0):
                    rating = 'excellent'
                elif value <= benchmark.get('good', 0.01):
                    rating = 'good'
                elif value <= benchmark.get('average', 0.02):
                    rating = 'average'
                else:
                    rating = 'poor'
            
            comparisons[metric_name] = {
                'value': value,
                'rating': rating,
                'benchmark_excellent': benchmark.get('excellent'),
                'benchmark_average': benchmark.get('average')
            }
        
        return comparisons
    
    def _analyze_engagement_patterns(self, events: List[Dict]) -> Dict:
        """Analyze engagement patterns over time."""
        hourly_engagement = defaultdict(int)
        daily_engagement = defaultdict(int)
        
        for event in events:
            try:
                ts = datetime.fromisoformat(event['timestamp'])
                hourly_engagement[ts.hour] += 1
                daily_engagement[ts.strftime('%A')] += 1
            except:
                pass
        
        # Find peak engagement times
        peak_hour = max(hourly_engagement, key=hourly_engagement.get) if hourly_engagement else None
        peak_day = max(daily_engagement, key=daily_engagement.get) if daily_engagement else None
        
        return {
            'peak_engagement_hour': f"{peak_hour}:00" if peak_hour is not None else None,
            'peak_engagement_day': peak_day,
            'hourly_distribution': dict(hourly_engagement),
            'daily_distribution': dict(daily_engagement),
            'engagement_velocity': self._calculate_engagement_velocity(events)
        }
    
    def _calculate_engagement_velocity(self, events: List[Dict]) -> Dict:
        """Calculate how quickly recipients engage."""
        if len(events) < 2:
            return {'avg_time_to_open': None}
        
        # Group by recipient
        recipient_first_event = {}
        for event in sorted(events, key=lambda x: x['timestamp']):
            recipient = event['recipient']
            if recipient not in recipient_first_event:
                recipient_first_event[recipient] = event['timestamp']
        
        # Calculate average time to first engagement
        times = []
        for event in events:
            recipient = event['recipient']
            if recipient in recipient_first_event:
                try:
                    first = datetime.fromisoformat(recipient_first_event[recipient])
                    current = datetime.fromisoformat(event['timestamp'])
                    diff = (current - first).total_seconds() / 3600
                    times.append(diff)
                except:
                    pass
        
        return {
            'avg_time_to_engage_hours': round(statistics.mean(times), 2) if times else None,
            'median_time_to_engage_hours': round(statistics.median(times), 2) if times else None
        }
    
    def _analyze_subject_line(self, subject: str) -> Dict:
        """Analyze subject line effectiveness."""
        if not subject:
            return {'score': 0, 'feedback': ['No subject line']}
        
        score = 50  # Base score
        feedback = []
        
        # Length analysis
        length = len(subject)
        if 20 <= length <= 50:
            score += 15
            feedback.append("Optimal length (20-50 characters)")
        elif length > 70:
            score -= 10
            feedback.append("Subject line too long - may be truncated")
        elif length < 10:
            score -= 10
            feedback.append("Subject line too short - not descriptive enough")
        
        # Personalization
        if any(w in subject.lower() for w in ['you', 'your', '{name}', '{first_name}']):
            score += 10
            feedback.append("Personalization detected - good!")
        
        # Urgency/curiosity
        urgency_words = ['limited', 'urgent', 'today', 'now', 'exclusive', 'deadline']
        if any(w in subject.lower() for w in urgency_words):
            score += 5
            feedback.append("Urgency/curiosity element present")
        
        # Questions
        if '?' in subject:
            score += 5
            feedback.append("Question format - increases engagement")
        
        # Numbers
        if re.search(r'\d+', subject):
            score += 5
            feedback.append("Numbers in subject - increases open rates")
        
        # Spam triggers
        spam_words = ['free', 'guarantee', 'winner', 'act now', 'buy now', '!!!', '$$$']
        spam_count = sum(1 for w in spam_words if w in subject.lower())
        if spam_count > 0:
            score -= spam_count * 10
            feedback.append(f"Spam trigger words detected ({spam_count})")
        
        return {
            'subject': subject,
            'length': length,
            'score': min(max(score, 0), 100),
            'grade': 'A' if score >= 80 else 'B' if score >= 60 else 'C' if score >= 40 else 'D',
            'feedback': feedback
        }
    
    def _analyze_timing(self, events: List[Dict], sent_at: str) -> Dict:
        """Analyze send timing effectiveness."""
        if not sent_at:
            return {}
        
        try:
            sent_time = datetime.fromisoformat(sent_at)
        except:
            return {}
        
        # Best practices check
        hour = sent_time.hour
        day = sent_time.weekday()
        day_names = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        
        timing_score = 50
        notes = []
        
        # Day analysis
        if day in [1, 2, 3]:  # Tue-Thu
            timing_score += 15
            notes.append(f"Sent on {day_names[day]} - optimal day")
        elif day == 0:  # Monday
            timing_score += 5
            notes.append("Sent on Monday - good but inbox may be full")
        elif day >= 5:  # Weekend
            timing_score -= 15
            notes.append("Sent on weekend - lower engagement expected")
        
        # Hour analysis
        if 9 <= hour <= 11:
            timing_score += 15
            notes.append(f"Sent at {hour}:00 - optimal morning window")
        elif 13 <= hour <= 15:
            timing_score += 10
            notes.append(f"Sent at {hour}:00 - good afternoon window")
        elif hour < 6 or hour > 20:
            timing_score -= 20
            notes.append(f"Sent at {hour}:00 - very early/late, may hurt engagement")
        
        return {
            'sent_at': sent_at,
            'day_of_week': day_names[day],
            'hour': hour,
            'timing_score': min(max(timing_score, 0), 100),
            'notes': notes,
            'recommended_send_time': self._recommend_send_time()
        }
    
    def _recommend_send_time(self) -> str:
        """Recommend optimal send time."""
        return "Tuesday-Thursday, 10:00 AM - 11:00 AM recipient local time"
    
    def _estimate_roi(self, metrics: Dict, campaign: Dict) -> Dict:
        """Estimate campaign ROI."""
        total_sent = campaign.get('total_sent', 0)
        
        # Estimate costs (industry average)
        cost_per_email = 0.01  # $0.01 per email sent
        total_cost = total_sent * cost_per_email
        
        # Estimate revenue (based on engagement)
        avg_deal_value = 500  # Average deal value
        conversion_rate = metrics.get('reply_rate', 0) * 0.3  # 30% of replies convert
        
        estimated_revenue = metrics.get('replies', 0) * conversion_rate * avg_deal_value
        
        roi = ((estimated_revenue - total_cost) / max(total_cost, 1)) * 100
        
        return {
            'estimated_cost': round(total_cost, 2),
            'estimated_revenue': round(estimated_revenue, 2),
            'roi_percentage': round(roi, 1),
            'revenue_per_email': round(estimated_revenue / max(total_sent, 1), 4),
            'cost_per_reply': round(total_cost / max(metrics.get('replies', 1), 1), 2)
        }
    
    def _generate_campaign_recommendations(self, metrics: Dict, benchmarks: Dict, 
                                            engagement: Dict) -> List[Dict]:
        """Generate actionable recommendations."""
        recommendations = []
        
        # Open rate recommendations
        if benchmarks.get('open_rate', {}).get('rating') in ['poor', 'average']:
            recommendations.append({
                'area': 'subject_line',
                'priority': 'high',
                'recommendation': 'Improve subject line - A/B test shorter, more personal subjects',
                'expected_improvement': '15-25% increase in open rate'
            })
        
        # Click rate recommendations
        if benchmarks.get('click_rate', {}).get('rating') in ['poor', 'average']:
            recommendations.append({
                'area': 'content',
                'priority': 'high',
                'recommendation': 'Improve email content and CTA placement',
                'expected_improvement': '20-40% increase in click rate'
            })
        
        # Timing recommendations
        if engagement.get('peak_engagement_hour'):
            recommendations.append({
                'area': 'timing',
                'priority': 'medium',
                'recommendation': f"Send at {engagement['peak_engagement_hour']} for optimal engagement",
                'expected_improvement': '10-15% improvement in engagement'
            })
        
        # Reply rate recommendations
        if benchmarks.get('reply_rate', {}).get('rating') in ['poor', 'average']:
            recommendations.append({
                'area': 'personalization',
                'priority': 'high',
                'recommendation': 'Increase personalization and add clear call-to-action',
                'expected_improvement': '25-50% increase in reply rate'
            })
        
        if not recommendations:
            recommendations.append({
                'area': 'optimization',
                'priority': 'low',
                'recommendation': 'Campaign performing well - continue current strategy',
                'expected_improvement': 'Maintain current performance'
            })
        
        return recommendations
    
    def _calculate_grade(self, benchmarks: Dict) -> str:
        """Calculate overall campaign grade."""
        ratings = {'excellent': 4, 'good': 3, 'average': 2, 'poor': 1}
        scores = [ratings.get(v.get('rating', 'average'), 2) for v in benchmarks.values()]
        
        avg_score = statistics.mean(scores) if scores else 2
        
        if avg_score >= 3.5:
            return 'A'
        elif avg_score >= 2.5:
            return 'B'
        elif avg_score >= 1.5:
            return 'C'
        else:
            return 'D'
    
    def setup_ab_test(self, test_id: str, variants: List[Dict]) -> Dict:
        """Setup an A/B test."""
        self.ab_tests[test_id] = {
            'created_at': datetime.now().isoformat(),
            'variants': variants,
            'status': 'active'
        }
        
        for variant in variants:
            variant_id = f"{test_id}_{variant.get('name', 'A')}"
            self.track_campaign(variant_id, {
                'name': f"A/B Test: {test_id} - {variant.get('name', 'A')}",
                'subject': variant.get('subject', ''),
                'total_sent': variant.get('recipients', 0),
                'ab_test_id': test_id,
                'variant': variant.get('name', 'A')
            })
        
        return {
            'test_id': test_id,
            'status': 'active',
            'variants': len(variants)
        }
    
    def analyze_ab_test(self, test_id: str) -> Dict:
        """Analyze A/B test results."""
        if test_id not in self.ab_tests:
            return {'error': 'A/B test not found'}
        
        test = self.ab_tests[test_id]
        variant_results = []
        
        for variant in test.get('variants', []):
            variant_id = f"{test_id}_{variant.get('name', 'A')}"
            result = self.analyze_campaign(variant_id)
            
            if 'error' not in result:
                variant_results.append({
                    'variant': variant.get('name', 'A'),
                    'subject': variant.get('subject', ''),
                    'metrics': result.get('metrics', {}),
                    'grade': result.get('overall_grade', 'N/A')
                })
        
        # Determine winner
        if len(variant_results) >= 2:
            winner = max(variant_results, key=lambda x: x['metrics'].get('open_rate', 0))
            statistical_significance = self._calculate_significance(variant_results)
        else:
            winner = None
            statistical_significance = None
        
        return {
            'test_id': test_id,
            'variant_results': variant_results,
            'winner': winner,
            'statistical_significance': statistical_significance,
            'recommendation': f"Variant {winner['variant']} is winning with {winner['metrics'].get('open_rate', 0)*100:.1f}% open rate" if winner else 'Insufficient data'
        }
    
    def _calculate_significance(self, variants: List[Dict]) -> Dict:
        """Calculate statistical significance between variants."""
        if len(variants) < 2:
            return {'significant': False}
        
        rates = [v['metrics'].get('open_rate', 0) for v in variants]
        
        if max(rates) == 0:
            return {'significant': False, 'reason': 'No opens recorded'}
        
        # Simple significance check (real implementation would use chi-square or z-test)
        diff = abs(rates[0] - rates[1])
        avg_rate = statistics.mean(rates)
        
        relative_diff = diff / max(avg_rate, 0.01)
        
        return {
            'significant': relative_diff > 0.1,  # 10% relative difference
            'difference': round(diff, 4),
            'relative_difference': round(relative_diff * 100, 1),
            'confidence': 'high' if relative_diff > 0.2 else 'medium' if relative_diff > 0.1 else 'low'
        }

# Usage Example
if __name__ == "__main__":
    analyzer = CampaignPerformanceAnalyzer()
    
    # Track a campaign
    analyzer.track_campaign('spring_sale_2024', {
        'name': 'Spring Sale 2024',
        'subject': '🌸 Exclusive Spring Sale - 30% Off Everything!',
        'total_sent': 1000,
        'sent_at': '2024-03-15T10:00:00'
    })
    
    # Track events
    for i in range(250):
        analyzer.track_event('spring_sale_2024', 'open', f'user{i}@example.com')
    for i in range(50):
        analyzer.track_event('spring_sale_2024', 'click', f'user{i}@example.com')
    for i in range(30):
        analyzer.track_event('spring_sale_2024', 'reply', f'user{i}@example.com')
    
    # Analyze
    result = analyzer.analyze_campaign('spring_sale_2024')
    print(json.dumps(result, indent=2))
