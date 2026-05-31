#!/usr/bin/env python3
"""
V677 - Email Communication Pattern Optimizer
Detects communication patterns and suggests optimizations for team efficiency,
including response times, communication channels, and information flow.

Key Features:
- Response time analysis and optimization
- Communication channel effectiveness
- Information flow mapping
- Bottleneck detection
- Communication frequency optimization
- Cross-team collaboration patterns
"""

import json
import re
from datetime import datetime, timedelta
from collections import defaultdict, Counter
from typing import Dict, List, Optional, Tuple
import statistics

class EmailCommunicationPatternOptimizer:
    def __init__(self):
        self.communication_logs = defaultdict(list)
        self.response_times = defaultdict(list)
        self.channel_usage = defaultdict(lambda: defaultdict(int))
        self.team_interactions = defaultdict(lambda: defaultdict(int))
    
    def analyze_communication_pattern(self, email: Dict, thread_emails: List[Dict] = None) -> Dict:
        """
        Analyze communication patterns from email
        
        Args:
            email: Email dictionary
            thread_emails: List of emails in the same thread (optional)
        
        Returns:
            Dict with communication pattern analysis
        """
        sender = email.get('from', '')
        recipients = email.get('to', []) + email.get('cc', [])
        timestamp = email.get('timestamp', datetime.now().isoformat())
        
        # Calculate response time if part of thread
        response_time = None
        if thread_emails:
            response_time = self._calculate_response_time(email, thread_emails)
        
        # Detect communication channel
        channel = self._detect_channel(email)
        
        # Detect communication type
        comm_type = self._classify_communication_type(email)
        
        # Analyze information density
        info_density = self._calculate_information_density(email)
        
        # Detect bottlenecks
        bottleneck_score = self._detect_bottlenecks(email, thread_emails)
        
        # Analyze team interactions
        team_pattern = self._analyze_team_pattern(sender, recipients)
        
        # Calculate efficiency score
        efficiency_score = self._calculate_efficiency_score(
            response_time=response_time,
            info_density=info_density,
            bottleneck_score=bottleneck_score
        )
        
        # Generate optimization suggestions
        suggestions = self._generate_optimizations(
            response_time=response_time,
            info_density=info_density,
            bottleneck_score=bottleneck_score,
            comm_type=comm_type,
            recipient_count=len(recipients)
        )
        
        result = {
            'email_id': email.get('id', ''),
            'sender': sender,
            'recipient_count': len(recipients),
            'channel': channel,
            'communication_type': comm_type,
            'response_time_hours': response_time,
            'information_density': info_density,
            'bottleneck_score': bottleneck_score,
            'efficiency_score': efficiency_score,
            'team_pattern': team_pattern,
            'optimization_suggestions': suggestions,
            'reply_all_required': len(recipients) > 1
        }
        
        return result
    
    def _calculate_response_time(self, email: Dict, thread_emails: List[Dict]) -> Optional[float]:
        """Calculate response time in hours"""
        if not thread_emails:
            return None
        
        current_time = datetime.fromisoformat(email.get('timestamp', datetime.now().isoformat()))
        
        # Find previous email in thread
        for prev_email in reversed(thread_emails):
            if prev_email.get('id') != email.get('id'):
                prev_time = datetime.fromisoformat(prev_email.get('timestamp', datetime.now().isoformat()))
                delta = current_time - prev_time
                return delta.total_seconds() / 3600  # Convert to hours
        
        return None
    
    def _detect_channel(self, email: Dict) -> str:
        """Detect communication channel"""
        text = (email.get('body', '') + ' ' + email.get('subject', '')).lower()
        
        if any(kw in text for kw in ['urgent', 'asap', 'emergency', 'critical']):
            return 'urgent'
        elif any(kw in text for kw in ['meeting', 'call', 'discuss']):
            return 'meeting_request'
        elif any(kw in text for kw in ['fyi', 'update', 'information']):
            return 'informational'
        elif any(kw in text for kw in ['question', '?', 'clarification']):
            return 'question'
        elif any(kw in text for kw in ['decision', 'approve', 'vote']):
            return 'decision'
        else:
            return 'general'
    
    def _classify_communication_type(self, email: Dict) -> str:
        """Classify communication type"""
        text = (email.get('body', '') + ' ' + email.get('subject', '')).lower()
        
        if any(kw in text for kw in ['report', 'analysis', 'summary', 'review']):
            return 'report'
        elif any(kw in text for kw in ['request', 'please', 'could you', 'need']):
            return 'request'
        elif any(kw in text for kw in ['update', 'status', 'progress']):
            return 'update'
        elif any(kw in text for kw in ['feedback', 'review', 'comments']):
            return 'feedback'
        elif any(kw in text for kw in ['announcement', 'notice', 'policy']):
            return 'announcement'
        else:
            return 'discussion'
    
    def _calculate_information_density(self, email: Dict) -> float:
        """Calculate information density (useful content / total content)"""
        body = email.get('body', '')
        
        # Remove greetings and signatures
        lines = body.split('\n')
        useful_lines = []
        
        skip_patterns = [
            r'^(hi|hello|hey|dear|thanks|regards|best|sincerely)',
            r'^(sent from|from my)',
            r'^--',  # Signature separator
            r'^>',   # Quoted text
        ]
        
        for line in lines:
            line_stripped = line.strip().lower()
            if not line_stripped:
                continue
            if not any(re.match(pattern, line_stripped, re.IGNORECASE) for pattern in skip_patterns):
                useful_lines.append(line)
        
        if not lines:
            return 0.0
        
        useful_content = len(useful_lines)
        total_content = len([l for l in lines if l.strip()])
        
        return (useful_content / total_content * 100) if total_content > 0 else 0.0
    
    def _detect_bottlenecks(self, email: Dict, thread_emails: List[Dict]) -> float:
        """Detect communication bottlenecks (0-100)"""
        score = 0.0
        
        # Long response times
        if thread_emails:
            response_time = self._calculate_response_time(email, thread_emails)
            if response_time:
                if response_time > 48:  # More than 2 days
                    score += 40
                elif response_time > 24:  # More than 1 day
                    score += 25
                elif response_time > 8:  # More than 8 hours
                    score += 15
        
        # Too many recipients
        recipient_count = len(email.get('to', []) + email.get('cc', []))
        if recipient_count > 15:
            score += 30
        elif recipient_count > 10:
            score += 20
        elif recipient_count > 7:
            score += 10
        
        # Long email thread
        if thread_emails and len(thread_emails) > 10:
            score += 20
        elif thread_emails and len(thread_emails) > 5:
            score += 10
        
        # Low information density
        info_density = self._calculate_information_density(email)
        if info_density < 50:
            score += 15
        
        return min(100, score)
    
    def _analyze_team_pattern(self, sender: str, recipients: List[str]) -> Dict:
        """Analyze team communication patterns"""
        # Extract domains
        sender_domain = sender.split('@')[-1] if '@' in sender else 'internal'
        recipient_domains = [r.split('@')[-1] if '@' in r else 'internal' for r in recipients]
        
        # Determine if cross-team
        unique_domains = set([sender_domain] + recipient_domains)
        is_cross_team = len(unique_domains) > 1
        
        # Determine hierarchy
        is_hierarchical = any(kw in sender.lower() for kw in ['manager', 'director', 'vp', 'executive'])
        
        return {
            'is_cross_team': is_cross_team,
            'is_hierarchical': is_hierarchical,
            'team_size': len(recipients),
            'unique_domains': len(unique_domains)
        }
    
    def _calculate_efficiency_score(self, response_time: Optional[float], 
                                   info_density: float, bottleneck_score: float) -> float:
        """Calculate communication efficiency score (0-100)"""
        score = 100.0
        
        # Penalize slow response times
        if response_time:
            if response_time > 48:
                score -= 40
            elif response_time > 24:
                score -= 25
            elif response_time > 8:
                score -= 15
        
        # Reward high information density
        if info_density > 80:
            score += 10
        elif info_density > 60:
            score += 5
        elif info_density < 40:
            score -= 15
        
        # Penalize bottlenecks
        score -= bottleneck_score * 0.5
        
        return max(0, min(100, score))
    
    def _generate_optimizations(self, response_time: Optional[float], info_density: float,
                               bottleneck_score: float, comm_type: str, 
                               recipient_count: int) -> List[str]:
        """Generate optimization suggestions"""
        suggestions = []
        
        if response_time and response_time > 24:
            suggestions.append(f"Response time is {response_time:.1f}h - consider using urgent channel or follow-up")
        
        if info_density < 50:
            suggestions.append("Low information density - remove greetings, signatures, and redundant content")
        
        if bottleneck_score > 70:
            suggestions.append("High bottleneck detected - consider breaking into smaller groups or using async communication")
        
        if recipient_count > 10:
            suggestions.append(f"Large recipient list ({recipient_count}) - consider using distribution lists or targeted communication")
        
        if comm_type == 'announcement' and recipient_count > 20:
            suggestions.append("Consider using company-wide channels instead of email for announcements")
        
        if not suggestions:
            suggestions.append("Communication pattern is efficient - maintain current approach")
        
        return suggestions
    
    def generate_pattern_report(self, email_analyses: List[Dict]) -> Dict:
        """Generate comprehensive communication pattern report"""
        if not email_analyses:
            return {'message': 'No communication data available'}
        
        total_emails = len(email_analyses)
        
        # Average metrics
        avg_efficiency = sum(e['efficiency_score'] for e in email_analyses) / total_emails
        response_times = [e['response_time_hours'] for e in email_analyses if e['response_time_hours']]
        avg_response_time = statistics.mean(response_times) if response_times else None
        avg_info_density = sum(e['information_density'] for e in email_analyses) / total_emails
        
        # Channel distribution
        channel_dist = Counter(e['channel'] for e in email_analyses)
        
        # Communication type distribution
        type_dist = Counter(e['communication_type'] for e in email_analyses)
        
        # Bottleneck analysis
        high_bottleneck = sum(1 for e in email_analyses if e['bottleneck_score'] > 70)
        
        # Team patterns
        cross_team = sum(1 for e in email_analyses if e['team_pattern']['is_cross_team'])
        
        return {
            'total_emails_analyzed': total_emails,
            'avg_efficiency_score': round(avg_efficiency, 1),
            'avg_response_time_hours': round(avg_response_time, 1) if avg_response_time else None,
            'avg_information_density': round(avg_info_density, 1),
            'channel_distribution': dict(channel_dist),
            'communication_type_distribution': dict(type_dist),
            'high_bottleneck_emails': high_bottleneck,
            'bottleneck_rate': round(high_bottleneck / total_emails * 100, 1),
            'cross_team_communications': cross_team,
            'cross_team_rate': round(cross_team / total_emails * 100, 1),
            'optimization_priority': 'high' if avg_efficiency < 50 else 'medium' if avg_efficiency < 70 else 'low',
            'top_optimizations': self._get_top_optimizations(email_analyses),
            'timestamp': datetime.now().isoformat()
        }
    
    def _get_top_optimizations(self, email_analyses: List[Dict]) -> List[str]:
        """Get top 3 optimization suggestions"""
        all_suggestions = []
        for email in email_analyses:
            all_suggestions.extend(email['optimization_suggestions'])
        
        suggestion_counts = Counter(all_suggestions)
        sorted_suggestions = suggestion_counts.most_common(3)
        
        return [s[0] for s in sorted_suggestions]


def test_v677():
    """Test V677 Email Communication Pattern Optimizer"""
    optimizer = EmailCommunicationPatternOptimizer()
    
    # Test 1: Efficient communication
    email1 = {
        'id': 'e001',
        'from': 'manager@company.com',
        'to': ['team@company.com'],
        'subject': 'Q3 Budget Approval Needed',
        'body': '''Team,
        
        Please review and approve the Q3 budget proposal by Friday.
        
        Key points:
        - Total budget: $500K
        - Marketing: $200K
        - Engineering: $250K
        - Operations: $50K
        
        Reply with your approval or concerns.
        
        Thanks,
        Manager''',
        'timestamp': '2026-05-30T09:00:00'
    }
    
    # Test 2: Inefficient communication
    email2 = {
        'id': 'e002',
        'from': 'employee@company.com',
        'to': ['all@company.com', 'team1@company.com', 'team2@company.com',
               'team3@company.com', 'team4@company.com', 'team5@company.com',
               'team6@company.com', 'team7@company.com', 'team8@company.com',
               'team9@company.com', 'team10@company.com', 'team11@company.com'],
        'subject': 'Question about project',
        'body': '''Hi everyone,
        
        Hope you're all doing well!
        
        I just wanted to reach out and ask a quick question about the project we've been working on. I'm not sure if this is the right place to ask, but I thought I'd try.
        
        Anyway, the question is: what's the deadline for the next milestone?
        
        Thanks so much!
        
        Best regards,
        Employee
        
        Sent from my iPhone''',
        'timestamp': '2026-05-30T10:00:00'
    }
    
    # Test 3: Cross-team communication
    email3 = {
        'id': 'e003',
        'from': 'engineering@company.com',
        'to': ['marketing@partner.com', 'sales@partner.com'],
        'cc': ['management@company.com'],
        'subject': 'API Integration Update',
        'body': '''Partners,
        
        The API integration is now complete and ready for testing.
        
        Documentation: https://docs.company.com/api
        Test environment: https://test.company.com
        
        Please test by next week and provide feedback.
        
        Engineering Team''',
        'timestamp': '2026-05-30T11:00:00'
    }
    
    # Analyze all emails
    results = []
    for email in [email1, email2, email3]:
        result = optimizer.analyze_communication_pattern(email)
        results.append(result)
        
        print(f"\n{'='*50}")
        print(f"Email: {email['subject'][:40]}...")
        print(f"Channel: {result['channel']}")
        print(f"Type: {result['communication_type']}")
        print(f"Efficiency Score: {result['efficiency_score']}/100")
        print(f"Info Density: {result['information_density']:.1f}%")
        print(f"Bottleneck Score: {result['bottleneck_score']}/100")
        print(f"Team Pattern: {result['team_pattern']}")
        print(f"Suggestions: {result['optimization_suggestions']}")
    
    # Generate report
    report = optimizer.generate_pattern_report(results)
    print(f"\n{'='*50}")
    print(f"✅ V677 Communication Pattern Optimizer Test Complete")
    print(f"Total Emails: {report['total_emails_analyzed']}")
    print(f"Avg Efficiency: {report['avg_efficiency_score']}/100")
    print(f"Avg Info Density: {report['avg_information_density']:.1f}%")
    print(f"High Bottleneck: {report['high_bottleneck_emails']}")
    print(f"Cross-Team Rate: {report['cross_team_rate']:.1f}%")
    print(f"Optimization Priority: {report['optimization_priority']}")
    
    return report


if __name__ == '__main__':
    test_v677()
