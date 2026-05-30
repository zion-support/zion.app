#!/usr/bin/env python3
"""
V161 - AI Email Relationship Health Monitor
Tracks relationship strength with every contact, detects cooling relationships,
and suggests re-engagement strategies with health scoring.
"""

import json
import re
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
from collections import defaultdict
import statistics


class RelationshipHealthMonitor:
    """AI-powered relationship health tracking from email communications."""

    def __init__(self):
        self.contact_profiles = defaultdict(dict)
        self.interaction_history = defaultdict(list)
        self.health_scores = defaultdict(float)
        self.engagement_patterns = defaultdict(dict)
        self.relationship_stages = self._build_relationship_stages()

    def _build_relationship_stages(self) -> Dict[str, Dict]:
        """Build relationship stage definitions."""
        return {
            'prospect': {'score_range': (0, 20), 'description': 'Initial contact', 'next': 'acquaintance'},
            'acquaintance': {'score_range': (20, 40), 'description': 'Early interactions', 'next': 'active'},
            'active': {'score_range': (40, 70), 'description': 'Regular engagement', 'next': 'strong'},
            'strong': {'score_range': (70, 90), 'description': 'Established relationship', 'next': 'advocate'},
            'advocate': {'score_range': (90, 100), 'description': 'Champion/referrer', 'next': None},
            'cooling': {'score_range': (0, 30), 'description': 'Declining engagement', 'action': 're-engage'},
            'dormant': {'score_range': (0, 10), 'description': 'No recent contact', 'action': 'win-back'}
        }

    def analyze_relationships(self, emails: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Comprehensive relationship health analysis."""
        if not emails:
            return {'error': 'No emails to analyze'}

        # Build contact profiles
        for email in emails:
            self._update_contact_profile(email)

        # Calculate health scores
        health_scores = self._calculate_all_health_scores()

        # Detect relationship trends
        trends = self._detect_relationship_trends()

        # Identify at-risk relationships
        at_risk = self._identify_at_risk_relationships(health_scores)

        # Identify champions
        champions = self._identify_champions(health_scores)

        # Generate re-engagement recommendations
        re_engagement = self._generate_re_engagement_recommendations(at_risk)

        # Network analysis
        network = self._analyze_network(emails)

        return {
            'analysis_id': f"rel_{datetime.now().strftime('%Y%m%d%H%M%S')}",
            'timestamp': datetime.now().isoformat(),
            'total_contacts': len(self.contact_profiles),
            'health_scores': health_scores,
            'relationship_distribution': self._get_relationship_distribution(health_scores),
            'trends': trends,
            'at_risk_relationships': at_risk,
            'champions': champions,
            're_engagement_recommendations': re_engagement,
            'network_analysis': network,
            'reply_all_relationship_awareness': True
        }

    def _update_contact_profile(self, email: Dict[str, Any]):
        """Update contact profile from email."""
        sender = email.get('from', '')
        if not sender:
            return

        if sender not in self.contact_profiles:
            self.contact_profiles[sender] = {
                'first_contact': email.get('date', datetime.now().isoformat()),
                'total_emails': 0,
                'last_contact': None,
                'avg_response_time': None,
                'sentiment_history': [],
                'topics': [],
                'importance_signals': []
            }

        profile = self.contact_profiles[sender]
        profile['total_emails'] += 1
        profile['last_contact'] = email.get('date', datetime.now().isoformat())

        # Track sentiment
        content = f"{email.get('subject', '')} {email.get('body', '')}".lower()
        sentiment = self._quick_sentiment(content)
        profile['sentiment_history'].append(sentiment)

        # Track topics
        topics = self._extract_topics(content)
        profile['topics'].extend(topics)

        # Track importance signals
        if any(w in content for w in ['contract', 'deal', 'partnership', 'referral']):
            profile['importance_signals'].append('high_value')

        # Log interaction
        self.interaction_history[sender].append({
            'date': email.get('date', datetime.now().isoformat()),
            'direction': email.get('direction', 'inbound'),
            'sentiment': sentiment,
            'priority': email.get('priority', 'medium')
        })

    def _quick_sentiment(self, content: str) -> str:
        """Quick sentiment analysis."""
        positive = ['great', 'excellent', 'thank', 'appreciate', 'love', 'happy', 'success']
        negative = ['problem', 'issue', 'concerned', 'disappointed', 'frustrated', 'delay', 'unhappy']

        pos_count = sum(1 for w in positive if w in content)
        neg_count = sum(1 for w in negative if w in content)

        if pos_count > neg_count:
            return 'positive'
        elif neg_count > pos_count:
            return 'negative'
        return 'neutral'

    def _extract_topics(self, content: str) -> List[str]:
        """Extract topics from content."""
        words = re.findall(r'\b[a-z]{5,}\b', content.lower())
        stop_words = {'about', 'above', 'after', 'again', 'against', 'because', 'before',
                      'below', 'between', 'could', 'would', 'should', 'their', 'there',
                      'these', 'those', 'through', 'under', 'until', 'where', 'which',
                      'while', 'other', 'being', 'having', 'doing'}
        return [w for w in words if w not in stop_words][:10]

    def _calculate_all_health_scores(self) -> List[Dict[str, Any]]:
        """Calculate health scores for all contacts."""
        scores = []

        for contact, profile in self.contact_profiles.items():
            score = self._calculate_health_score(contact, profile)
            stage = self._determine_stage(score, profile)

            scores.append({
                'contact': contact,
                'health_score': round(score, 1),
                'stage': stage,
                'total_emails': profile['total_emails'],
                'last_contact': profile['last_contact'],
                'days_since_contact': self._days_since(profile['last_contact']),
                'avg_sentiment': self._avg_sentiment(profile['sentiment_history']),
                'importance_signals': len(profile['importance_signals'])
            })

        scores.sort(key=lambda x: x['health_score'], reverse=True)
        return scores

    def _calculate_health_score(self, contact: str, profile: Dict) -> float:
        """Calculate health score for a contact."""
        score = 0

        # Frequency score (max 30)
        total_emails = profile['total_emails']
        if total_emails >= 20:
            score += 30
        elif total_emails >= 10:
            score += 20
        elif total_emails >= 5:
            score += 15
        elif total_emails >= 2:
            score += 10
        else:
            score += 5

        # Recency score (max 25)
        days_since = self._days_since(profile['last_contact'])
        if days_since <= 7:
            score += 25
        elif days_since <= 14:
            score += 20
        elif days_since <= 30:
            score += 15
        elif days_since <= 60:
            score += 10
        elif days_since <= 90:
            score += 5

        # Sentiment score (max 25)
        sentiments = profile['sentiment_history']
        if sentiments:
            pos_count = sum(1 for s in sentiments if s == 'positive')
            neg_count = sum(1 for s in sentiments if s == 'negative')
            sentiment_ratio = (pos_count - neg_count) / len(sentiments)
            score += max(0, min(25, 12.5 + sentiment_ratio * 12.5))

        # Importance score (max 20)
        importance = len(profile['importance_signals'])
        score += min(20, importance * 5)

        return min(100, score)

    def _days_since(self, date_str: Optional[str]) -> int:
        """Calculate days since a date."""
        if not date_str:
            return 999
        try:
            date = datetime.fromisoformat(date_str)
            return (datetime.now() - date).days
        except:
            return 999

    def _avg_sentiment(self, sentiments: List[str]) -> str:
        """Calculate average sentiment."""
        if not sentiments:
            return 'neutral'
        pos = sum(1 for s in sentiments if s == 'positive')
        neg = sum(1 for s in sentiments if s == 'negative')
        if pos > neg:
            return 'positive'
        elif neg > pos:
            return 'negative'
        return 'neutral'

    def _determine_stage(self, score: float, profile: Dict) -> str:
        """Determine relationship stage."""
        days_since = self._days_since(profile['last_contact'])

        if days_since > 180 and score < 20:
            return 'dormant'
        elif days_since > 60 and score < 40:
            return 'cooling'
        elif score >= 90:
            return 'advocate'
        elif score >= 70:
            return 'strong'
        elif score >= 40:
            return 'active'
        elif score >= 20:
            return 'acquaintance'
        else:
            return 'prospect'

    def _detect_relationship_trends(self) -> List[Dict[str, Any]]:
        """Detect relationship trends."""
        trends = []

        for contact, history in self.interaction_history.items():
            if len(history) < 3:
                continue

            # Split into halves
            mid = len(history) // 2
            first_half = history[:mid]
            second_half = history[mid:]

            first_sentiment = sum(1 for h in first_half if h['sentiment'] == 'positive') / len(first_half)
            second_sentiment = sum(1 for h in second_half if h['sentiment'] == 'positive') / len(second_half)

            if second_sentiment < first_sentiment - 0.2:
                trends.append({
                    'contact': contact,
                    'trend': 'declining',
                    'sentiment_change': round(second_sentiment - first_sentiment, 2),
                    'action': 'Schedule personal check-in'
                })
            elif second_sentiment > first_sentiment + 0.2:
                trends.append({
                    'contact': contact,
                    'trend': 'improving',
                    'sentiment_change': round(second_sentiment - first_sentiment, 2),
                    'action': 'Leverage positive momentum'
                })

        return trends

    def _identify_at_risk_relationships(self, scores: List[Dict]) -> List[Dict[str, Any]]:
        """Identify relationships at risk."""
        at_risk = []
        for score_info in scores:
            if score_info['stage'] in ['cooling', 'dormant'] or score_info['health_score'] < 30:
                at_risk.append({
                    'contact': score_info['contact'],
                    'health_score': score_info['health_score'],
                    'stage': score_info['stage'],
                    'days_since_contact': score_info['days_since_contact'],
                    'risk_level': 'high' if score_info['health_score'] < 20 else 'medium',
                    'recommended_action': self._suggest_action(score_info)
                })
        return at_risk

    def _identify_champions(self, scores: List[Dict]) -> List[Dict[str, Any]]:
        """Identify champion relationships."""
        champions = []
        for score_info in scores:
            if score_info['stage'] in ['advocate', 'strong'] and score_info['health_score'] >= 80:
                champions.append({
                    'contact': score_info['contact'],
                    'health_score': score_info['health_score'],
                    'stage': score_info['stage'],
                    'total_emails': score_info['total_emails'],
                    'leverage_opportunity': self._suggest_leverage(score_info)
                })
        return champions

    def _suggest_action(self, score_info: Dict) -> str:
        """Suggest re-engagement action."""
        days = score_info['days_since_contact']
        stage = score_info['stage']

        if stage == 'dormant' or days > 120:
            return 'Send win-back email with personalized value proposition'
        elif stage == 'cooling' or days > 60:
            return 'Schedule personal call to understand concerns'
        elif score_info['avg_sentiment'] == 'negative':
            return 'Address unresolved issues with empathy and solutions'
        else:
            return 'Send check-in with relevant industry insights'

    def _suggest_leverage(self, score_info: Dict) -> str:
        """Suggest how to leverage champion relationship."""
        if score_info['importance_signals'] > 0:
            return 'Request referral or case study'
        elif score_info['total_emails'] > 15:
            return 'Invite to advisory board or beta program'
        else:
            return 'Ask for testimonial or introduction to decision-makers'

    def _generate_re_engagement_recommendations(self, at_risk: List[Dict]) -> List[Dict[str, Any]]:
        """Generate re-engagement recommendations."""
        recommendations = []
        for contact_info in at_risk[:10]:
            recommendations.append({
                'contact': contact_info['contact'],
                'priority': 'high' if contact_info['risk_level'] == 'high' else 'medium',
                'action': contact_info['recommended_action'],
                'timeline': 'within 48 hours' if contact_info['risk_level'] == 'high' else 'within 1 week',
                'template': self._suggest_template(contact_info)
            })
        return recommendations

    def _suggest_template(self, contact_info: Dict) -> str:
        """Suggest re-engagement email template."""
        if contact_info['stage'] == 'dormant':
            return "Hi [Name], it's been a while since we connected. I've been thinking about [shared interest] and wanted to share [relevant insight]. Would love to catch up."
        elif contact_info['stage'] == 'cooling':
            return "Hi [Name], I wanted to check in and make sure everything is going well. Is there anything I can help with or any concerns I should address?"
        else:
            return "Hi [Name], hope you're doing well. I came across [relevant content] and thought of you. Let me know if you'd like to chat."

    def _analyze_network(self, emails: List[Dict]) -> Dict[str, Any]:
        """Analyze email network patterns."""
        senders = [e.get('from', '') for e in emails if e.get('from')]
        unique_senders = set(senders)

        return {
            'total_unique_contacts': len(unique_senders),
            'top_domains': self._get_top_domains(senders),
            'network_density': round(len(unique_senders) / max(len(emails), 1), 2),
            'internal_vs_external': self._internal_external_ratio(senders)
        }

    def _get_top_domains(self, senders: List[str]) -> List[Dict[str, int]]:
        """Get top email domains."""
        domains = defaultdict(int)
        for sender in senders:
            if '@' in sender:
                domain = sender.split('@')[-1]
                domains[domain] += 1
        return [{'domain': d, 'count': c} for d, c in sorted(domains.items(), key=lambda x: x[1], reverse=True)[:5]]

    def _internal_external_ratio(self, senders: List[str]) -> Dict[str, int]:
        """Calculate internal vs external ratio."""
        internal = sum(1 for s in senders if 'zion' in s.lower())
        external = len(senders) - internal
        return {'internal': internal, 'external': external}

    def _get_relationship_distribution(self, scores: List[Dict]) -> Dict[str, int]:
        """Get distribution of relationship stages."""
        dist = defaultdict(int)
        for s in scores:
            dist[s['stage']] += 1
        return dict(dist)


def process_relationship_health(emails: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Main entry point for relationship health monitoring."""
    monitor = RelationshipHealthMonitor()
    return monitor.analyze_relationships(emails)


if __name__ == '__main__':
    test_emails = [
        {'from': 'client@company.com', 'subject': 'Great partnership!', 'body': 'Thank you for the excellent work. We really appreciate the partnership.', 'date': '2024-01-10T10:00:00'},
        {'from': 'client@company.com', 'subject': 'New project', 'body': 'We have a new project for you. Contract value $100,000.', 'date': '2024-01-15T14:00:00'},
        {'from': 'prospect@other.com', 'subject': 'Interested in services', 'body': 'We are interested in your services. Can you send a proposal?', 'date': '2024-01-20T09:00:00'}
    ]
    result = process_relationship_health(test_emails)
    print(json.dumps(result, indent=2))
