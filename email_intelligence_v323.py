#!/usr/bin/env python3
"""
Email Intelligence Engine V323 - Email Analytics Dashboard Pro
Real-time email performance metrics with response time tracking, engagement
scoring, team productivity analytics, and predictive insights for optimization.
Enforces reply-all and case-by-case analysis.
"""

import json
from datetime import datetime, timedelta
from typing import Dict, List
from collections import defaultdict
import statistics

class EmailAnalyticsDashboardPro:
    def __init__(self):
        self.version = "V323"
        self.metrics_cache = {}
        
    def calculate_response_metrics(self, emails: List[Dict]) -> Dict:
        """Calculate response time metrics"""
        response_times = []
        
        for email in emails:
            if 'response_time_minutes' in email and email['response_time_minutes'] is not None:
                response_times.append(email['response_time_minutes'])
        
        if not response_times:
            return {
                'avg_minutes': 0,
                'median_minutes': 0,
                'p90_minutes': 0,
                'p95_minutes': 0,
                'within_1hr_pct': 0,
                'within_4hr_pct': 0,
                'within_24hr_pct': 0,
                'total_measured': 0
            }
        
        sorted_times = sorted(response_times)
        p90_idx = int(len(sorted_times) * 0.9)
        p95_idx = int(len(sorted_times) * 0.95)
        
        return {
            'avg_minutes': round(statistics.mean(response_times), 1),
            'median_minutes': round(statistics.median(response_times), 1),
            'p90_minutes': round(sorted_times[p90_idx], 1) if p90_idx < len(sorted_times) else 0,
            'p95_minutes': round(sorted_times[p95_idx], 1) if p95_idx < len(sorted_times) else 0,
            'within_1hr_pct': round(sum(1 for t in response_times if t <= 60) / len(response_times) * 100, 1),
            'within_4hr_pct': round(sum(1 for t in response_times if t <= 240) / len(response_times) * 100, 1),
            'within_24hr_pct': round(sum(1 for t in response_times if t <= 1440) / len(response_times) * 100, 1),
            'total_measured': len(response_times)
        }
    
    def calculate_engagement_scores(self, emails: List[Dict]) -> Dict:
        """Calculate engagement scores per category"""
        categories = defaultdict(list)
        
        for email in emails:
            category = email.get('category', 'general')
            engagement = email.get('engagement_score', 50)
            categories[category].append(engagement)
        
        scores = {}
        for category, scores_list in categories.items():
            scores[category] = {
                'avg_score': round(statistics.mean(scores_list), 1),
                'total_emails': len(scores_list),
                'high_engagement_pct': round(sum(1 for s in scores_list if s >= 70) / len(scores_list) * 100, 1)
            }
        
        return scores
    
    def calculate_team_productivity(self, emails: List[Dict]) -> Dict:
        """Calculate team productivity metrics"""
        team_stats = defaultdict(lambda: {
            'emails_handled': 0,
            'total_response_time': 0,
            'positive_sentiment': 0
        })
        
        for email in emails:
            handler = email.get('assigned_to', 'unassigned')
            team_stats[handler]['emails_handled'] += 1
            
            if email.get('response_time_minutes'):
                team_stats[handler]['total_response_time'] += email['response_time_minutes']
            
            if email.get('sentiment', '').startswith('positive'):
                team_stats[handler]['positive_sentiment'] += 1
        
        productivity = {}
        for handler, stats in team_stats.items():
            avg_response = stats['total_response_time'] / stats['emails_handled'] if stats['emails_handled'] > 0 else 0
            satisfaction = (stats['positive_sentiment'] / stats['emails_handled'] * 100) if stats['emails_handled'] > 0 else 0
            
            # Productivity score (0-100)
            # Higher is better: fast response + high satisfaction + high volume
            volume_score = min(40, stats['emails_handled'] * 2)
            speed_score = max(0, 40 - avg_response / 60)  # Penalty for slow responses
            satisfaction_score = satisfaction * 0.2
            
            productivity_score = volume_score + speed_score + satisfaction_score
            
            productivity[handler] = {
                'emails_handled': stats['emails_handled'],
                'avg_response_minutes': round(avg_response, 1),
                'satisfaction_pct': round(satisfaction, 1),
                'productivity_score': round(min(100, productivity_score), 1)
            }
        
        return productivity
    
    def generate_insights(self, metrics: Dict, productivity: Dict) -> List[Dict]:
        """Generate actionable insights"""
        insights = []
        
        # Response time insights
        if metrics.get('avg_minutes', 0) > 240:
            insights.append({
                'type': 'warning',
                'category': 'response_time',
                'message': f"Average response time is {metrics['avg_minutes']} minutes. Consider implementing auto-acknowledgment.",
                'impact': 'high',
                'action': 'Implement auto-responder for immediate acknowledgment'
            })
        
        if metrics.get('within_1hr_pct', 100) < 50:
            insights.append({
                'type': 'alert',
                'category': 'response_time',
                'message': f"Only {metrics['within_1hr_pct']}% of emails are responded to within 1 hour.",
                'impact': 'high',
                'action': 'Review team capacity and prioritize urgent emails'
            })
        
        # Team insights
        low_performers = [name for name, stats in productivity.items() if stats['productivity_score'] < 50]
        if low_performers:
            insights.append({
                'type': 'info',
                'category': 'team',
                'message': f"{len(low_performers)} team members have productivity scores below 50.",
                'impact': 'medium',
                'action': 'Provide additional training or redistribute workload'
            })
        
        high_performers = [name for name, stats in productivity.items() if stats['productivity_score'] >= 80]
        if high_performers:
            insights.append({
                'type': 'success',
                'category': 'team',
                'message': f"{len(high_performers)} team members are top performers (score >= 80).",
                'impact': 'positive',
                'action': 'Recognize and reward high performers'
            })
        
        return insights
    
    def generate_dashboard(self, emails: List[Dict]) -> Dict:
        """Generate complete analytics dashboard"""
        print(f"[{self.version}] 📊 Generating analytics dashboard for {len(emails)} emails")
        
        response_metrics = self.calculate_response_metrics(emails)
        engagement_scores = self.calculate_engagement_scores(emails)
        team_productivity = self.calculate_team_productivity(emails)
        insights = self.generate_insights(response_metrics, team_productivity)
        
        # Overall health score
        avg_response = response_metrics.get('avg_minutes', 0)
        within_1hr = response_metrics.get('within_1hr_pct', 0)
        avg_productivity = statistics.mean([p['productivity_score'] for p in team_productivity.values()]) if team_productivity else 0
        
        health_score = (
            max(0, 40 - avg_response / 30) +  # Response time (max 40)
            within_1hr * 0.3 +                  # Speed (max 30)
            avg_productivity * 0.3              # Team productivity (max 30)
        )
        
        return {
            'version': self.version,
            'engine': 'Email Analytics Dashboard Pro',
            'dashboard': {
                'response_metrics': response_metrics,
                'engagement_scores': engagement_scores,
                'team_productivity': team_productivity,
                'insights': insights,
                'overall_health_score': round(min(100, health_score), 1),
                'total_emails_analyzed': len(emails),
                'generated_at': datetime.now().isoformat()
            },
            'recommendations': [insight['action'] for insight in insights[:3]]
        }
    
    def process_email(self, email_data: Dict, history: List[Dict] = None) -> Dict:
        """Process email with analytics context"""
        print(f"[{self.version}] Processing with analytics context")
        
        # Case-by-case analysis
        recipients = email_data.get('recipients', [])
        cc_list = email_data.get('cc', [])
        all_recipients = recipients + cc_list
        
        # Enforce reply-all
        reply_all = len(all_recipients) > 1
        
        # Generate dashboard if history provided
        dashboard = None
        if history:
            dashboard = self.generate_dashboard(history)
        
        response = {
            'version': self.version,
            'engine': 'Email Analytics Dashboard Pro',
            'dashboard': dashboard,
            'reply_all': reply_all,
            'reply_all_recipients': all_recipients if reply_all else [],
            'recommendation': 'Respond promptly to maintain team metrics' if dashboard else 'Standard response'
        }
        
        print(f"[{self.version}] Dashboard generated: {bool(dashboard)}, Reply-all: {reply_all}")
        return response

# Test
if __name__ == "__main__":
    engine = EmailAnalyticsDashboardPro()
    
    # Test with sample history
    history = [
        {'assigned_to': 'alice', 'response_time_minutes': 45, 'sentiment': 'positive', 'category': 'support', 'engagement_score': 80},
        {'assigned_to': 'alice', 'response_time_minutes': 30, 'sentiment': 'positive', 'category': 'support', 'engagement_score': 85},
        {'assigned_to': 'bob', 'response_time_minutes': 120, 'sentiment': 'neutral', 'category': 'sales', 'engagement_score': 60},
        {'assigned_to': 'bob', 'response_time_minutes': 180, 'sentiment': 'negative', 'category': 'sales', 'engagement_score': 40},
        {'assigned_to': 'carol', 'response_time_minutes': 20, 'sentiment': 'positive', 'category': 'support', 'engagement_score': 90},
    ]
    
    result = engine.process_email({}, history)
    print(json.dumps(result, indent=2))
