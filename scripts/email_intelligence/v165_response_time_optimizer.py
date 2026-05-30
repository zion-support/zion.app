#!/usr/bin/env python3
"""
V165 - AI Email Response Time Optimizer
Analyzes historical response patterns, predicts optimal response timing based on recipient behavior,
balances urgency with effectiveness, and provides real-time response time recommendations.
"""

import json
from datetime import datetime, timedelta
from typing import Dict, List, Optional
import statistics
from collections import defaultdict

class ResponseTimeOptimizer:
    def __init__(self):
        self.response_history = defaultdict(list)
        self.engagement_patterns = defaultdict(dict)
        self.urgency_levels = {
            'critical': {'max_hours': 1, 'weight': 10},
            'high': {'max_hours': 4, 'weight': 7},
            'medium': {'max_hours': 24, 'weight': 4},
            'low': {'max_hours': 72, 'weight': 1}
        }
    
    def track_response(self, contact_id: str, sent_time: datetime, response_time: datetime, 
                      engagement_metrics: Dict = None):
        """Track a response and its engagement metrics."""
        response_delay = (response_time - sent_time).total_seconds() / 3600  # hours
        
        self.response_history[contact_id].append({
            'sent_time': sent_time.isoformat(),
            'response_time': response_time.isoformat(),
            'response_delay_hours': round(response_delay, 2),
            'day_of_week': sent_time.weekday(),
            'hour_of_day': sent_time.hour,
            'engagement': engagement_metrics or {}
        })
        
        # Keep only last 100 entries
        self.response_history[contact_id] = self.response_history[contact_id][-100:]
    
    def analyze_optimal_timing(self, contact_id: str) -> Dict:
        """Analyze optimal response timing for a specific contact."""
        if contact_id not in self.response_history:
            return {'error': 'No response history available'}
        
        history = self.response_history[contact_id]
        
        # Analyze by hour of day
        hour_performance = defaultdict(list)
        for entry in history:
            hour = entry['hour_of_day']
            delay = entry['response_delay_hours']
            engagement = entry['engagement'].get('open_rate', 0.5)
            hour_performance[hour].append({'delay': delay, 'engagement': engagement})
        
        # Find best hours (fastest response + highest engagement)
        best_hours = []
        for hour, data in hour_performance.items():
            avg_delay = statistics.mean([d['delay'] for d in data])
            avg_engagement = statistics.mean([d['engagement'] for d in data])
            score = (1 / (avg_delay + 1)) * avg_engagement  # Balance speed and engagement
            best_hours.append({'hour': hour, 'score': round(score, 3), 'avg_delay': round(avg_delay, 2)})
        
        best_hours.sort(key=lambda x: x['score'], reverse=True)
        
        # Analyze by day of week
        day_performance = defaultdict(list)
        day_names = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        
        for entry in history:
            day = entry['day_of_week']
            delay = entry['response_delay_hours']
            day_performance[day].append(delay)
        
        best_days = []
        for day, delays in day_performance.items():
            avg_delay = statistics.mean(delays)
            best_days.append({'day': day_names[day], 'day_number': day, 'avg_delay': round(avg_delay, 2)})
        
        best_days.sort(key=lambda x: x['avg_delay'])
        
        # Calculate typical response time
        all_delays = [h['response_delay_hours'] for h in history]
        typical_response = statistics.mean(all_delays)
        median_response = statistics.median(all_delays)
        
        return {
            'contact_id': contact_id,
            'total_responses_analyzed': len(history),
            'typical_response_time_hours': round(typical_response, 2),
            'median_response_time_hours': round(median_response, 2),
            'best_hours': best_hours[:3],
            'best_days': best_days[:3],
            'recommendations': self._generate_timing_recommendations(best_hours, best_days, typical_response)
        }
    
    def _generate_timing_recommendations(self, best_hours: List, best_days: List, typical_response: float) -> List[str]:
        """Generate timing recommendations."""
        recommendations = []
        
        if best_hours:
            top_hour = best_hours[0]['hour']
            recommendations.append(f"Optimal response time: {top_hour}:00 - {top_hour+1}:00")
        
        if best_days:
            top_day = best_days[0]['day']
            recommendations.append(f"Best day to respond: {top_day}")
        
        if typical_response > 24:
            recommendations.append("Response time is slow - consider faster replies to improve engagement")
        elif typical_response < 4:
            recommendations.append("Excellent response time - maintain this pace")
        
        return recommendations
    
    def predict_optimal_response_time(self, contact_id: str, urgency: str = 'medium') -> Dict:
        """Predict the optimal time to respond based on contact patterns and urgency."""
        timing_analysis = self.analyze_optimal_timing(contact_id)
        
        if 'error' in timing_analysis:
            # Default recommendations
            return self._get_default_recommendations(urgency)
        
        urgency_config = self.urgency_levels.get(urgency, self.urgency_levels['medium'])
        
        now = datetime.now()
        current_hour = now.hour
        current_day = now.weekday()
        
        # Check if current time is optimal
        best_hours = [h['hour'] for h in timing_analysis.get('best_hours', [])]
        best_days = [d['day_number'] for d in timing_analysis.get('best_days', [])]
        
        is_optimal_time = current_hour in best_hours and current_day in best_days
        
        # Calculate recommended delay
        if urgency == 'critical':
            recommended_delay_hours = 0  # Respond immediately
            send_now = True
        elif is_optimal_time:
            recommended_delay_hours = 0
            send_now = True
        else:
            # Find next optimal time
            next_optimal_hour = None
            for hour in best_hours:
                if hour > current_hour:
                    next_optimal_hour = hour
                    break
            
            if next_optimal_hour and current_day in best_days:
                delay = next_optimal_hour - current_hour
                recommended_delay_hours = delay
                send_now = False
            else:
                # Wait for next best day
                recommended_delay_hours = min(urgency_config['max_hours'], 24)
                send_now = False
        
        return {
            'contact_id': contact_id,
            'urgency_level': urgency,
            'current_time': now.isoformat(),
            'is_optimal_time': is_optimal_time,
            'send_now': send_now,
            'recommended_delay_hours': round(recommended_delay_hours, 1),
            'max_acceptable_delay_hours': urgency_config['max_hours'],
            'reasoning': self._generate_reasoning(send_now, is_optimal_time, urgency),
            'expected_engagement_impact': self._estimate_engagement_impact(send_now, is_optimal_time)
        }
    
    def _get_default_recommendations(self, urgency: str) -> Dict:
        """Provide default recommendations when no history is available."""
        urgency_config = self.urgency_levels.get(urgency, self.urgency_levels['medium'])
        
        return {
            'contact_id': 'unknown',
            'urgency_level': urgency,
            'send_now': urgency in ['critical', 'high'],
            'recommended_delay_hours': 0 if urgency in ['critical', 'high'] else 4,
            'max_acceptable_delay_hours': urgency_config['max_hours'],
            'reasoning': f"Default recommendation for {urgency} urgency - no historical data available",
            'expected_engagement_impact': 'unknown'
        }
    
    def _generate_reasoning(self, send_now: bool, is_optimal: bool, urgency: str) -> str:
        """Generate human-readable reasoning for the recommendation."""
        if urgency == 'critical':
            return "Critical urgency requires immediate response regardless of timing patterns"
        
        if send_now and is_optimal:
            return "Current time matches optimal engagement window for this contact"
        elif send_now:
            return "Urgency level requires prompt response - delay not recommended"
        elif is_optimal:
            return "Timing is good but can wait for slightly better engagement window"
        else:
            return "Waiting for optimal engagement window will improve response effectiveness"
    
    def _estimate_engagement_impact(self, send_now: bool, is_optimal: bool) -> str:
        """Estimate engagement impact of timing decision."""
        if send_now and is_optimal:
            return "HIGH - Optimal timing expected"
        elif send_now:
            return "MEDIUM - Prompt but not optimal timing"
        else:
            return "HIGH - Waiting for optimal window"
    
    def optimize_batch_responses(self, emails: List[Dict]) -> List[Dict]:
        """Optimize response timing for a batch of emails."""
        optimized = []
        
        for email in emails:
            contact_id = email.get('contact_id', 'unknown')
            urgency = email.get('urgency', 'medium')
            
            recommendation = self.predict_optimal_response_time(contact_id, urgency)
            
            optimized.append({
                'email_id': email.get('id'),
                'contact_id': contact_id,
                'urgency': urgency,
                'recommendation': recommendation,
                'priority_score': self._calculate_priority(urgency, recommendation)
            })
        
        # Sort by priority (highest first)
        optimized.sort(key=lambda x: x['priority_score'], reverse=True)
        return optimized
    
    def _calculate_priority(self, urgency: str, recommendation: Dict) -> float:
        """Calculate priority score for batch optimization."""
        urgency_weight = self.urgency_levels.get(urgency, {}).get('weight', 1)
        
        if recommendation.get('send_now'):
            timing_score = 10
        else:
            delay = recommendation.get('recommended_delay_hours', 0)
            timing_score = max(0, 10 - delay)
        
        return urgency_weight * timing_score
    
    def generate_performance_report(self, contact_id: str = None) -> Dict:
        """Generate response time performance report."""
        if contact_id:
            contacts = [contact_id]
        else:
            contacts = list(self.response_history.keys())
        
        all_delays = []
        contact_stats = []
        
        for cid in contacts:
            if cid in self.response_history:
                delays = [h['response_delay_hours'] for h in self.response_history[cid]]
                all_delays.extend(delays)
                
                contact_stats.append({
                    'contact_id': cid,
                    'total_responses': len(delays),
                    'avg_delay': round(statistics.mean(delays), 2),
                    'min_delay': round(min(delays), 2),
                    'max_delay': round(max(delays), 2)
                })
        
        if not all_delays:
            return {'error': 'No response data available'}
        
        return {
            'total_contacts': len(contacts),
            'total_responses': len(all_delays),
            'overall_avg_delay_hours': round(statistics.mean(all_delays), 2),
            'overall_median_delay_hours': round(statistics.median(all_delays), 2),
            'fastest_response_hours': round(min(all_delays), 2),
            'slowest_response_hours': round(max(all_delays), 2),
            'contact_breakdown': sorted(contact_stats, key=lambda x: x['avg_delay'])[:10]
        }

# Usage Example
if __name__ == "__main__":
    optimizer = ResponseTimeOptimizer()
    
    # Track some responses
    optimizer.track_response('client_001', datetime.now() - timedelta(hours=48), 
                            datetime.now() - timedelta(hours=46),
                            {'open_rate': 0.8, 'reply_rate': 0.6})
    
    # Get optimal timing
    result = optimizer.predict_optimal_response_time('client_001', urgency='medium')
    print(json.dumps(result, indent=2))
