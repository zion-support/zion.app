#!/usr/bin/env python3
"""
V680 - Email Team Collaboration Scorer
Scores team collaboration effectiveness and suggests improvements based on
communication patterns, responsiveness, and teamwork indicators.

Key Features:
- Collaboration effectiveness scoring
- Team responsiveness analysis
- Cross-functional collaboration tracking
- Communication balance assessment
- Collaboration pattern identification
- Team improvement recommendations
"""

import json
import re
from datetime import datetime, timedelta
from collections import defaultdict, Counter
from typing import Dict, List, Optional, Tuple
import statistics

class EmailTeamCollaborationScorer:
    def __init__(self):
        self.team_interactions = defaultdict(list)
        self.response_times = defaultdict(list)
        self.collaboration_patterns = defaultdict(lambda: defaultdict(int))
        self.team_metrics = defaultdict(dict)
    
    def score_team_collaboration(self, email: Dict, thread_emails: List[Dict] = None) -> Dict:
        """
        Score team collaboration from email
        
        Args:
            email: Email dictionary
            thread_emails: List of emails in the same thread (optional)
        
        Returns:
            Dict with collaboration scoring
        """
        sender = email.get('from', '')
        recipients = email.get('to', []) + email.get('cc', [])
        text = email.get('body', '') + ' ' + email.get('subject', '')
        
        # Calculate responsiveness score
        responsiveness = self._calculate_responsiveness(email, thread_emails)
        
        # Calculate inclusivity score
        inclusivity = self._calculate_inclusivity(email, recipients)
        
        # Calculate communication balance
        balance = self._calculate_communication_balance(sender, recipients)
        
        # Detect collaboration indicators
        collaboration_indicators = self._detect_collaboration_indicators(text)
        
        # Calculate cross-functional collaboration
        cross_functional = self._calculate_cross_functional_collaboration(sender, recipients)
        
        # Detect teamwork patterns
        teamwork_patterns = self._detect_teamwork_patterns(text)
        
        # Calculate overall collaboration score
        collaboration_score = self._calculate_collaboration_score(
            responsiveness=responsiveness,
            inclusivity=inclusivity,
            balance=balance,
            collaboration_indicators=collaboration_indicators,
            cross_functional=cross_functional,
            teamwork_patterns=teamwork_patterns
        )
        
        # Generate improvement recommendations
        recommendations = self._generate_recommendations(
            responsiveness=responsiveness,
            inclusivity=inclusivity,
            balance=balance,
            collaboration_indicators=collaboration_indicators,
            cross_functional=cross_functional,
            teamwork_patterns=teamwork_patterns
        )
        
        # Determine collaboration level
        level = self._determine_collaboration_level(collaboration_score)
        
        result = {
            'email_id': email.get('id', ''),
            'sender': sender,
            'recipient_count': len(recipients),
            'collaboration_score': collaboration_score,
            'collaboration_level': level,
            'responsiveness_score': responsiveness['score'],
            'responsiveness_hours': responsiveness['avg_response_time'],
            'inclusivity_score': inclusivity['score'],
            'communication_balance_score': balance['score'],
            'collaboration_indicators': collaboration_indicators['indicators'],
            'collaboration_indicator_score': collaboration_indicators['score'],
            'cross_functional_score': cross_functional['score'],
            'teamwork_patterns': teamwork_patterns['patterns'],
            'teamwork_pattern_score': teamwork_patterns['score'],
            'improvement_recommendations': recommendations,
            'strengths': self._identify_strengths(collaboration_score, responsiveness, inclusivity, balance),
            'reply_all_required': len(recipients) > 1
        }
        
        return result
    
    def _calculate_responsiveness(self, email: Dict, thread_emails: List[Dict]) -> Dict:
        """Calculate team responsiveness score"""
        if not thread_emails:
            return {'score': 50, 'avg_response_time': None}
        
        response_times = []
        current_time = datetime.fromisoformat(email.get('timestamp', datetime.now().isoformat()))
        
        for prev_email in thread_emails:
            if prev_email.get('id') != email.get('id'):
                prev_time = datetime.fromisoformat(prev_email.get('timestamp', datetime.now().isoformat()))
                delta_hours = (current_time - prev_time).total_seconds() / 3600
                if 0 < delta_hours < 168:  # Within a week
                    response_times.append(delta_hours)
        
        if not response_times:
            return {'score': 50, 'avg_response_time': None}
        
        avg_response = statistics.mean(response_times)
        
        # Score based on response time
        if avg_response <= 2:  # Within 2 hours
            score = 100
        elif avg_response <= 8:  # Within 8 hours
            score = 85
        elif avg_response <= 24:  # Within 24 hours
            score = 70
        elif avg_response <= 48:  # Within 48 hours
            score = 50
        else:
            score = 30
        
        return {
            'score': score,
            'avg_response_time': round(avg_response, 1)
        }
    
    def _calculate_inclusivity(self, email: Dict, recipients: List[str]) -> Dict:
        """Calculate inclusivity score"""
        body = email.get('body', '')
        text_lower = body.lower()
        
        score = 50  # Base score
        
        # Check for inclusive language
        inclusive_phrases = [
            'what do you think', 'your thoughts', 'your input', 'your feedback',
            'let me know', 'please share', 'we should', 'let\'s', 'together',
            'team', 'everyone', 'all of us'
        ]
        
        inclusive_count = sum(1 for phrase in inclusive_phrases if phrase in text_lower)
        score += min(30, inclusive_count * 10)
        
        # Check for acknowledgment of others
        acknowledgment_phrases = [
            'thanks to', 'credit to', 'great work by', 'appreciate', 'recognize'
        ]
        
        acknowledgment_count = sum(1 for phrase in acknowledgment_phrases if phrase in text_lower)
        score += min(20, acknowledgment_count * 10)
        
        return {
            'score': min(100, score),
            'inclusive_language_count': inclusive_count,
            'acknowledgment_count': acknowledgment_count
        }
    
    def _calculate_communication_balance(self, sender: str, recipients: List[str]) -> Dict:
        """Calculate communication balance score"""
        # This would ideally track historical communication patterns
        # For now, we'll use a heuristic approach
        
        recipient_count = len(recipients)
        
        # Optimal team size for collaboration
        if 3 <= recipient_count <= 7:
            score = 90
        elif 2 <= recipient_count <= 10:
            score = 75
        elif recipient_count > 10:
            score = 50  # Too many people
        else:
            score = 60  # Too few people
        
        return {
            'score': score,
            'recipient_count': recipient_count
        }
    
    def _detect_collaboration_indicators(self, text: str) -> Dict:
        """Detect collaboration indicators in text"""
        text_lower = text.lower()
        indicators = []
        score = 0
        
        # Collaborative language
        collab_phrases = {
            'teamwork': ['we', 'our', 'together', 'collaborate', 'team effort'],
            'shared_goals': ['common goal', 'shared objective', 'aligned', 'on the same page'],
            'mutual_support': ['help each other', 'support', 'assist', 'back each other'],
            'open_communication': ['transparent', 'open', 'share', 'communicate'],
            'collective_ownership': ['we own', 'our responsibility', 'accountable together']
        }
        
        for category, phrases in collab_phrases.items():
            if any(phrase in text_lower for phrase in phrases):
                indicators.append(category)
                score += 20
        
        return {
            'indicators': indicators,
            'score': min(100, score)
        }
    
    def _calculate_cross_functional_collaboration(self, sender: str, recipients: List[str]) -> Dict:
        """Calculate cross-functional collaboration score"""
        # Extract domains/departments from email addresses
        sender_domain = sender.split('@')[-1] if '@' in sender else 'internal'
        recipient_domains = [r.split('@')[-1] if '@' in r else 'internal' for r in recipients]
        
        unique_domains = set([sender_domain] + recipient_domains)
        
        # Score based on diversity
        if len(unique_domains) >= 3:
            score = 95
        elif len(unique_domains) == 2:
            score = 75
        else:
            score = 50
        
        return {
            'score': score,
            'unique_departments': len(unique_domains)
        }
    
    def _detect_teamwork_patterns(self, text: str) -> Dict:
        """Detect positive teamwork patterns"""
        text_lower = text.lower()
        patterns = []
        score = 0
        
        # Positive teamwork patterns
        pattern_checks = {
            'knowledge_sharing': ['sharing', 'learned', 'discovered', 'found that'],
            'problem_solving': ['solution', 'figured out', 'resolved', 'fixed'],
            'celebration': ['celebrated', 'achieved', 'accomplished', 'success'],
            'learning': ['learned', 'insight', 'takeaway', 'lesson'],
            'support': ['helped', 'supported', 'assisted', 'backed up']
        }
        
        for pattern, keywords in pattern_checks.items():
            if any(kw in text_lower for kw in keywords):
                patterns.append(pattern)
                score += 20
        
        return {
            'patterns': patterns,
            'score': min(100, score)
        }
    
    def _calculate_collaboration_score(self, responsiveness: Dict, inclusivity: Dict,
                                      balance: Dict, collaboration_indicators: Dict,
                                      cross_functional: Dict, teamwork_patterns: Dict) -> float:
        """Calculate overall collaboration score"""
        scores = [
            responsiveness['score'],
            inclusivity['score'],
            balance['score'],
            collaboration_indicators['score'],
            cross_functional['score'],
            teamwork_patterns['score']
        ]
        
        # Weighted average
        weights = [0.20, 0.20, 0.15, 0.20, 0.10, 0.15]
        
        weighted_score = sum(score * weight for score, weight in zip(scores, weights))
        
        return min(100, weighted_score)
    
    def _generate_recommendations(self, responsiveness: Dict, inclusivity: Dict,
                                 balance: Dict, collaboration_indicators: Dict,
                                 cross_functional: Dict, teamwork_patterns: Dict) -> List[str]:
        """Generate improvement recommendations"""
        recommendations = []
        
        if responsiveness['score'] < 70:
            recommendations.append("Improve response times - aim for responses within 8 hours")
        
        if inclusivity['score'] < 70:
            recommendations.append("Use more inclusive language and actively seek team input")
        
        if balance['score'] < 70:
            recommendations.append("Optimize team size for better collaboration (aim for 3-7 people)")
        
        if collaboration_indicators['score'] < 60:
            recommendations.append("Emphasize collaborative language and shared ownership")
        
        if cross_functional['score'] < 70:
            recommendations.append("Increase cross-functional collaboration by involving diverse teams")
        
        if teamwork_patterns['score'] < 60:
            recommendations.append("Foster positive teamwork patterns like knowledge sharing and celebration")
        
        if not recommendations:
            recommendations.append("Excellent collaboration - maintain current practices")
        
        return recommendations
    
    def _determine_collaboration_level(self, score: float) -> str:
        """Determine collaboration level"""
        if score >= 85:
            return 'excellent'
        elif score >= 70:
            return 'good'
        elif score >= 50:
            return 'moderate'
        else:
            return 'needs_improvement'
    
    def _identify_strengths(self, collaboration_score: float, responsiveness: Dict,
                           inclusivity: Dict, balance: Dict) -> List[str]:
        """Identify collaboration strengths"""
        strengths = []
        
        if responsiveness['score'] >= 80:
            strengths.append("High responsiveness")
        
        if inclusivity['score'] >= 80:
            strengths.append("Inclusive communication")
        
        if balance['score'] >= 80:
            strengths.append("Well-balanced team communication")
        
        if collaboration_score >= 80:
            strengths.append("Strong overall collaboration")
        
        return strengths
    
    def generate_team_report(self, email_analyses: List[Dict]) -> Dict:
        """Generate comprehensive team collaboration report"""
        if not email_analyses:
            return {'message': 'No collaboration data available'}
        
        total_emails = len(email_analyses)
        
        # Average scores
        avg_collaboration = sum(e['collaboration_score'] for e in email_analyses) / total_emails
        avg_responsiveness = sum(e['responsiveness_score'] for e in email_analyses) / total_emails
        avg_inclusivity = sum(e['inclusivity_score'] for e in email_analyses) / total_emails
        
        # Collaboration level distribution
        level_dist = Counter(e['collaboration_level'] for e in email_analyses)
        
        # Common strengths
        all_strengths = []
        for email in email_analyses:
            all_strengths.extend(email['strengths'])
        
        common_strengths = Counter(all_strengths).most_common(3)
        
        # Common recommendations
        all_recommendations = []
        for email in email_analyses:
            all_recommendations.extend(email['improvement_recommendations'])
        
        common_recommendations = Counter(all_recommendations).most_common(3)
        
        return {
            'total_emails_analyzed': total_emails,
            'avg_collaboration_score': round(avg_collaboration, 1),
            'avg_responsiveness_score': round(avg_responsiveness, 1),
            'avg_inclusivity_score': round(avg_inclusivity, 1),
            'collaboration_level_distribution': dict(level_dist),
            'team_strengths': common_strengths,
            'improvement_areas': common_recommendations,
            'team_collaboration_health': 'excellent' if avg_collaboration >= 85 else 'good' if avg_collaboration >= 70 else 'moderate' if avg_collaboration >= 50 else 'needs_improvement',
            'timestamp': datetime.now().isoformat()
        }


def test_v680():
    """Test V680 Email Team Collaboration Scorer"""
    scorer = EmailTeamCollaborationScorer()
    
    # Test 1: Excellent collaboration
    email1 = {
        'id': 'e001',
        'from': 'teamlead@company.com',
        'to': ['dev1@company.com', 'dev2@company.com', 'designer@company.com', 'qa@company.com'],
        'subject': 'Great Progress on Project X!',
        'body': '''Team,
        
        I wanted to celebrate our amazing progress on Project X!
        
        Thanks to everyone's hard work, we've achieved our milestone ahead of schedule. The collaboration between development, design, and QA has been outstanding.
        
        What do you think about scheduling a team lunch to celebrate?
        
        Let's continue this great teamwork!
        
        Team Lead''',
        'timestamp': '2026-05-30T09:00:00'
    }
    
    # Test 2: Moderate collaboration
    email2 = {
        'id': 'e002',
        'from': 'manager@company.com',
        'to': ['team@company.com'],
        'subject': 'Project Update',
        'body': '''Team,
        
        Here's the latest project update:
        
        - Phase 1 is complete
        - Phase 2 starts next week
        - Please review the attached document
        
        Let me know if you have questions.
        
        Manager''',
        'timestamp': '2026-05-30T10:00:00'
    }
    
    # Test 3: Poor collaboration
    email3 = {
        'id': 'e003',
        'from': 'employee@company.com',
        'to': ['all@company.com'],
        'subject': 'FYI',
        'body': '''Attached is the report.''',
        'timestamp': '2026-05-30T11:00:00'
    }
    
    # Analyze all emails
    results = []
    for email in [email1, email2, email3]:
        result = scorer.score_team_collaboration(email)
        results.append(result)
        
        print(f"\n{'='*50}")
        print(f"Email: {email['subject'][:40]}...")
        print(f"Collaboration Score: {result['collaboration_score']}/100")
        print(f"Collaboration Level: {result['collaboration_level']}")
        print(f"Responsiveness: {result['responsiveness_score']}/100")
        print(f"Inclusivity: {result['inclusivity_score']}/100")
        print(f"Communication Balance: {result['communication_balance_score']}/100")
        print(f"Cross-Functional: {result['cross_functional_score']}/100")
        print(f"Strengths: {result['strengths']}")
        print(f"Recommendations: {result['improvement_recommendations']}")
    
    # Generate report
    report = scorer.generate_team_report(results)
    print(f"\n{'='*50}")
    print(f"✅ V680 Team Collaboration Scorer Test Complete")
    print(f"Total Emails: {report['total_emails_analyzed']}")
    print(f"Avg Collaboration Score: {report['avg_collaboration_score']}/100")
    print(f"Avg Responsiveness: {report['avg_responsiveness_score']}/100")
    print(f"Avg Inclusivity: {report['avg_inclusivity_score']}/100")
    print(f"Team Health: {report['team_collaboration_health']}")
    print(f"Top Strengths: {report['team_strengths']}")
    
    return report


if __name__ == '__main__':
    test_v680()
