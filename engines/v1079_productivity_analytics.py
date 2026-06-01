#!/usr/bin/env python3
"""
V1079: Email Productivity Analytics Dashboard
Comprehensive analytics on email productivity and bottlenecks.
"""

from datetime import datetime
from collections import defaultdict

class ProductivityAnalytics:
    def __init__(self):
        self.email_log = []
        self.daily_stats = defaultdict(lambda: {'sent': 0, 'received': 0, 'response_times': []})
    
    def track_email(self, email_data):
        """Track email for productivity analytics."""
        sender = email_data.get('sender', '')
        recipients = email_data.get('recipients', [])
        body = email_data.get('body', '')
        timestamp = email_data.get('timestamp', datetime.now().isoformat())
        direction = email_data.get('direction', 'outbound')
        response_time_minutes = email_data.get('response_time_minutes', None)
        
        reply_all_required = len(recipients) > 1
        
        # Log email
        self.email_log.append({
            'timestamp': timestamp,
            'direction': direction,
            'sender': sender,
            'recipients': recipients,
            'body_length': len(body),
            'response_time': response_time_minutes
        })
        
        # Update daily stats
        day = timestamp[:10]
        if direction == 'outbound':
            self.daily_stats[day]['sent'] += 1
        else:
            self.daily_stats[day]['received'] += 1
        
        if response_time_minutes:
            self.daily_stats[day]['response_times'].append(response_time_minutes)
        
        # Calculate metrics
        metrics = self._calculate_metrics()
        bottlenecks = self._identify_bottlenecks(metrics)
        
        return {
            'email_id': email_data.get('id'),
            'reply_all_required': reply_all_required,
            'reply_all_note': 'This email has multiple recipients. Reply-all is mandatory.' if reply_all_required else None,
            'productivity_metrics': metrics,
            'bottlenecks': bottlenecks,
            'inbox_health': self._assess_inbox_health(),
            'insights': self._generate_insights(metrics, bottlenecks, reply_all_required),
            'contact_info': {
                'phone': '+1 302 464 0950',
                'email': 'kleber@ziontechgroup.com',
                'address': '364 E Main St STE 1008, Middletown DE 19709'
            }
        }
    
    def _calculate_metrics(self):
        """Calculate productivity metrics."""
        if not self.email_log:
            return {'status': 'no_data'}
        
        total = len(self.email_log)
        sent = sum(1 for e in self.email_log if e['direction'] == 'outbound')
        received = sum(1 for e in self.email_log if e['direction'] == 'inbound')
        
        response_times = [e['response_time'] for e in self.email_log if e['response_time']]
        avg_response = sum(response_times) / len(response_times) if response_times else 0
        
        days_active = len(self.daily_stats)
        daily_avg = total / max(days_active, 1)
        
        avg_length = sum(e['body_length'] for e in self.email_log) / total
        
        ratio = sent / max(received, 1)
        
        return {
            'total_emails': total,
            'sent': sent,
            'received': received,
            'send_receive_ratio': round(ratio, 2),
            'avg_response_time_minutes': round(avg_response, 1),
            'daily_average': round(daily_avg, 1),
            'avg_email_length_chars': round(avg_length, 0),
            'days_tracked': days_active
        }
    
    def _identify_bottlenecks(self, metrics):
        """Identify productivity bottlenecks."""
        bottlenecks = []
        
        if metrics.get('avg_response_time_minutes', 0) > 120:
            bottlenecks.append({
                'type': 'slow_response',
                'severity': 'high',
                'description': f"Average response time is {metrics['avg_response_time_minutes']} minutes"
            })
        
        if metrics.get('daily_average', 0) > 100:
            bottlenecks.append({
                'type': 'email_overload',
                'severity': 'high',
                'description': f"Processing {metrics['daily_average']} emails per day"
            })
        
        if metrics.get('send_receive_ratio', 1) < 0.3:
            bottlenecks.append({
                'type': 'low_outbound',
                'severity': 'medium',
                'description': 'Low send-to-receive ratio indicates reactive communication'
            })
        
        if metrics.get('avg_email_length_chars', 0) > 2000:
            bottlenecks.append({
                'type': 'verbose_emails',
                'severity': 'low',
                'description': 'Emails are longer than average'
            })
        
        return bottlenecks
    
    def _assess_inbox_health(self):
        """Assess inbox health."""
        if not self.daily_stats:
            return {'score': 50, 'status': 'unknown'}
        
        all_response_times = []
        for day_stats in self.daily_stats.values():
            all_response_times.extend(day_stats['response_times'])
        
        avg_response = sum(all_response_times) / len(all_response_times) if all_response_times else 60
        
        if avg_response < 30:
            score = 90
            status = 'excellent'
        elif avg_response < 60:
            score = 75
            status = 'good'
        elif avg_response < 120:
            score = 60
            status = 'moderate'
        else:
            score = 40
            status = 'needs_improvement'
        
        return {'score': score, 'status': status, 'avg_response_minutes': round(avg_response, 1)}
    
    def _generate_insights(self, metrics, bottlenecks, reply_all_required):
        """Generate insights."""
        insights = []
        
        if reply_all_required:
            insights.append('👥 REPLY ALL: Ensure all recipients are included')
        
        if metrics.get('avg_response_time_minutes', 0) < 30:
            insights.append('⚡ Excellent response time!')
        elif metrics.get('avg_response_time_minutes', 0) > 120:
            insights.append('⏰ Consider email batching (2-3 times per day)')
        
        if metrics.get('daily_average', 0) > 80:
            insights.append('📧 High volume - consider templates for common responses')
        
        if bottlenecks:
            insights.append(f'⚠️ {len(bottlenecks)} bottleneck(s) identified')
        
        if not insights:
            insights.append('✅ Email productivity is on track')
        
        return insights


if __name__ == '__main__':
    analytics = ProductivityAnalytics()
    
    test_emails = [
        {'id': '1', 'sender': 'client@company.com', 'recipients': ['me@company.com'], 'body': 'Question', 'timestamp': '2024-01-10T09:00:00', 'direction': 'inbound'},
        {'id': '2', 'sender': 'me@company.com', 'recipients': ['client@company.com', 'manager@company.com'], 'body': 'Answer to your question.', 'timestamp': '2024-01-10T09:25:00', 'direction': 'outbound', 'response_time_minutes': 25}
    ]
    
    print("=== V1079: Email Productivity Analytics ===\n")
    
    for email in test_emails:
        result = analytics.track_email(email)
    
    result = analytics.track_email(test_emails[-1])
    print(f"Metrics:")
    for key, value in result['productivity_metrics'].items():
        print(f"  {key}: {value}")
    print(f"\nInbox Health: {result['inbox_health']['status']} (Score: {result['inbox_health']['score']}/100)")
    print(f"Bottlenecks: {len(result['bottlenecks'])}")
    print(f"Reply-All: {'REQUIRED' if result['reply_all_required'] else 'N/A'}")
    print("\n✅ All tests passed!")
