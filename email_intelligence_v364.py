#!/usr/bin/env python3
"""
V364: Email Productivity Analytics
Track time spent on email, identify productivity patterns, measure email-to-meeting conversion,
detect email overload, suggest inbox zero strategies, team productivity benchmarking.
"""
import re
import json
from datetime import datetime, timedelta
from typing import Dict, List
from collections import defaultdict

class ProductivityAnalytics:
    def __init__(self):
        self.meeting_patterns = [
            r'schedule a meeting', r'set up a call', r'meet (?:on|at)',
            r'calendar invite', r'zoom link', r'teams meeting', r'book time'
        ]
        self.action_patterns = [
            r'please (?:do|review|send|prepare)', r'can you', r'need (?:you to|this)',
            r'action item', r'to-do', r'deadline', r'by (?:tomorrow|friday|monday)'
        ]
        self.overload_indicators = [
            r'too many emails', r'overwhelmed', r'inbox zero', r'catching up',
            r'behind on emails', r'email fatigue'
        ]
    
    def calculate_email_metrics(self, emails: List[Dict]) -> Dict:
        """Calculate productivity metrics from email list"""
        if not emails:
            return {'error': 'No emails provided'}
        
        # Parse timestamps
        timestamps = []
        for email in emails:
            ts = email.get('timestamp')
            if ts:
                try:
                    timestamps.append(datetime.fromisoformat(ts.replace('Z', '+00:00')))
                except:
                    pass
        
        metrics = {
            'total_emails': len(emails),
            'avg_emails_per_day': 0,
            'peak_hours': [],
            'response_time_avg': None,
            'email_length_avg': 0
        }
        
        if timestamps:
            # Emails per day
            days = (max(timestamps) - min(timestamps)).days + 1
            metrics['avg_emails_per_day'] = round(len(emails) / max(days, 1), 1)
            
            # Peak hours
            hour_counts = defaultdict(int)
            for ts in timestamps:
                hour_counts[ts.hour] += 1
            peak_hours = sorted(hour_counts.items(), key=lambda x: x[1], reverse=True)[:3]
            metrics['peak_hours'] = [{'hour': h, 'count': c} for h, c in peak_hours]
        
        # Email length
        lengths = [len(email.get('body', '').split()) for email in emails]
        metrics['email_length_avg'] = round(sum(lengths) / len(lengths), 1) if lengths else 0
        
        return metrics
    
    def detect_meeting_conversions(self, emails: List[Dict]) -> Dict:
        """Track email-to-meeting conversion rate"""
        meeting_emails = []
        for email in emails:
            body = email.get('body', '').lower()
            if any(re.search(p, body) for p in self.meeting_patterns):
                meeting_emails.append({
                    'sender': email.get('sender'),
                    'timestamp': email.get('timestamp'),
                    'subject': email.get('subject')
                })
        
        conversion_rate = len(meeting_emails) / len(emails) if emails else 0
        
        return {
            'meeting_requests': len(meeting_emails),
            'conversion_rate': round(conversion_rate, 2),
            'meeting_emails': meeting_emails[:5]  # Top 5
        }
    
    def detect_action_items(self, emails: List[Dict]) -> Dict:
        """Identify action items and deadlines"""
        actions = []
        for email in emails:
            body = email.get('body', '').lower()
            for pattern in self.action_patterns:
                if re.search(pattern, body):
                    actions.append({
                        'email_id': email.get('id', ''),
                        'sender': email.get('sender'),
                        'pattern_matched': pattern,
                        'timestamp': email.get('timestamp')
                    })
                    break
        
        return {
            'total_actions': len(actions),
            'actions_per_email': round(len(actions) / len(emails), 2) if emails else 0,
            'actions': actions[:10]  # Top 10
        }
    
    def assess_overload(self, emails: List[Dict], metrics: Dict) -> Dict:
        """Detect email overload and suggest strategies"""
        overload_signals = []
        
        # Check for explicit overload mentions
        for email in emails:
            body = email.get('body', '').lower()
            if any(re.search(p, body) for p in self.overload_indicators):
                overload_signals.append('explicit_mention')
                break
        
        # Check volume
        if metrics.get('avg_emails_per_day', 0) > 50:
            overload_signals.append('high_volume')
        
        # Check after-hours activity
        peak_hours = metrics.get('peak_hours', [])
        if any(h['hour'] < 7 or h['hour'] > 19 for h in peak_hours):
            overload_signals.append('after_hours_activity')
        
        strategies = []
        if 'high_volume' in overload_signals:
            strategies.append('Implement email batching: process emails 3x daily instead of continuously')
            strategies.append('Use filters and rules to auto-categorize low-priority emails')
        if 'after_hours_activity' in overload_signals:
            strategies.append('Set email schedule boundaries: no emails after 7 PM')
            strategies.append('Use send-later feature to respect others time')
        if 'explicit_mention' in overload_signals:
            strategies.append('Consider inbox zero methodology: process every email to completion')
            strategies.append('Unsubscribe from non-essential newsletters')
        
        return {
            'overload_detected': len(overload_signals) > 0,
            'signals': list(set(overload_signals)),
            'recommended_strategies': strategies,
            'productivity_score': self._calculate_productivity_score(metrics, len(overload_signals))
        }
    
    def _calculate_productivity_score(self, metrics: Dict, overload_count: int) -> float:
        """Calculate overall productivity score (0-100)"""
        score = 100
        
        # Penalize high volume
        emails_per_day = metrics.get('avg_emails_per_day', 0)
        if emails_per_day > 100:
            score -= 30
        elif emails_per_day > 50:
            score -= 15
        
        # Penalize overload signals
        score -= overload_count * 10
        
        # Bonus for reasonable email length
        avg_length = metrics.get('email_length_avg', 0)
        if 50 <= avg_length <= 200:
            score += 10
        
        return max(0, min(100, score))
    
    def analyze_productivity(self, emails: List[Dict]) -> Dict:
        """Full productivity analysis"""
        metrics = self.calculate_email_metrics(emails)
        meetings = self.detect_meeting_conversions(emails)
        actions = self.detect_action_items(emails)
        overload = self.assess_overload(emails, metrics)
        
        recipients = emails[-1].get('recipients', []) if emails else []
        reply_all_required = len(recipients) > 1
        
        return {
            'engine': 'V364',
            'email_metrics': metrics,
            'meeting_conversions': meetings,
            'action_items': actions,
            'overload_assessment': overload,
            'reply_all_required': reply_all_required,
            'reply_all_enforced': reply_all_required,
            'timestamp': datetime.now().isoformat()
        }

if __name__ == '__main__':
    analytics = ProductivityAnalytics()
    sample_emails = [
        {'sender': 'boss@company.com', 'body': 'Please review the Q1 report by Friday. Can you schedule a meeting to discuss?', 'timestamp': '2024-01-15T09:00:00', 'recipients': ['employee@company.com']},
        {'sender': 'colleague@company.com', 'body': 'Too many emails today! Need to catch up on inbox zero.', 'timestamp': '2024-01-15T20:30:00', 'recipients': ['employee@company.com']},
        {'sender': 'client@example.com', 'body': 'Action item: send proposal. Deadline is Monday.', 'timestamp': '2024-01-15T14:00:00', 'recipients': ['employee@company.com']}
    ]
    
    result = analytics.analyze_productivity(sample_emails)
    print(json.dumps(result, indent=2))
