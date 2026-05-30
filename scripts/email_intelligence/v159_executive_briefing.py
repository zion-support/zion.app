#!/usr/bin/env python3
"""
V159 - AI Email Executive Briefing Generator
Auto-generates daily/weekly executive summaries from email activity
with key metrics, action items, strategic insights, and trends.
"""

import json
import re
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
from collections import defaultdict, Counter
import statistics


class ExecutiveBriefingGenerator:
    """AI-powered executive briefing from email intelligence."""

    def __init__(self):
        self.priority_keywords = {
            'strategic': ['strategy', 'partnership', 'acquisition', 'merger', 'board', 'investor', 'quarterly'],
            'revenue': ['revenue', 'deal', 'contract', 'sale', 'pipeline', 'quota', 'forecast'],
            'operational': ['deployment', 'launch', 'milestone', 'delivery', 'release', 'sprint'],
            'risk': ['risk', 'issue', 'concern', 'problem', 'escalation', 'urgent', 'critical'],
            'people': ['hiring', 'onboarding', 'resignation', 'promotion', 'team', 'performance']
        }
        self.sentiment_words = {
            'positive': ['great', 'excellent', 'success', 'achieved', 'won', 'approved', 'delighted', 'thrilled'],
            'negative': ['problem', 'delay', 'lost', 'failed', 'concerned', 'disappointed', 'risk', 'overdue'],
            'neutral': ['update', 'information', 'scheduled', 'planned', 'noted', 'acknowledged']
        }

    def generate_briefing(self, emails: List[Dict[str, Any]], period: str = 'daily') -> Dict[str, Any]:
        """Generate comprehensive executive briefing from emails."""
        if not emails:
            return {'error': 'No emails to analyze'}

        # Email volume & trends
        volume_stats = self._analyze_volume(emails, period)

        # Priority distribution
        priority_dist = self._analyze_priorities(emails)

        # Key topics & themes
        topics = self._extract_topics(emails)

        # Action items requiring attention
        action_items = self._extract_executive_actions(emails)

        # Sentiment overview
        sentiment = self._analyze_sentiment(emails)

        # Key contacts & relationships
        key_contacts = self._identify_key_contacts(emails)

        # Revenue signals
        revenue_signals = self._detect_revenue_signals(emails)

        # Risk alerts
        risk_alerts = self._detect_risks(emails)

        # Time allocation
        time_allocation = self._analyze_time_allocation(emails, topics)

        # Strategic insights
        insights = self._generate_strategic_insights(emails, topics, sentiment, revenue_signals)

        # Build briefing document
        briefing = {
            'briefing_id': f"exec_{datetime.now().strftime('%Y%m%d%H%M%S')}",
            'generated_at': datetime.now().isoformat(),
            'period': period,
            'period_range': self._get_period_range(period),
            'executive_summary': self._build_executive_summary(
                volume_stats, priority_dist, sentiment, revenue_signals, risk_alerts
            ),
            'volume_analytics': volume_stats,
            'priority_distribution': priority_dist,
            'top_topics': topics[:10],
            'action_items': action_items,
            'sentiment_overview': sentiment,
            'key_contacts': key_contacts[:10],
            'revenue_signals': revenue_signals,
            'risk_alerts': risk_alerts,
            'time_allocation': time_allocation,
            'strategic_insights': insights,
            'recommended_actions': self._recommend_executive_actions(action_items, risk_alerts, revenue_signals),
            'reply_all_compliance': True,
            'briefing_sections': [
                'executive_summary', 'volume_analytics', 'priority_distribution',
                'top_topics', 'action_items', 'sentiment', 'key_contacts',
                'revenue_signals', 'risk_alerts', 'strategic_insights'
            ]
        }

        return briefing

    def _get_period_range(self, period: str) -> Dict[str, str]:
        now = datetime.now()
        if period == 'daily':
            return {'start': (now - timedelta(days=1)).isoformat(), 'end': now.isoformat()}
        elif period == 'weekly':
            return {'start': (now - timedelta(weeks=1)).isoformat(), 'end': now.isoformat()}
        elif period == 'monthly':
            return {'start': (now - timedelta(days=30)).isoformat(), 'end': now.isoformat()}
        return {'start': now.isoformat(), 'end': now.isoformat()}

    def _analyze_volume(self, emails: List[Dict], period: str) -> Dict[str, Any]:
        """Analyze email volume and trends."""
        total = len(emails)
        by_hour = defaultdict(int)
        by_day = defaultdict(int)

        for email in emails:
            try:
                dt = datetime.fromisoformat(email.get('date', datetime.now().isoformat()))
                by_hour[dt.hour] += 1
                by_day[dt.strftime('%A')] += 1
            except:
                pass

        avg_per_day = total / max(1, len(by_day))
        peak_hour = max(by_hour, key=by_hour.get) if by_hour else 9
        peak_day = max(by_day, key=by_day.get) if by_day else 'Monday'

        return {
            'total_emails': total,
            'avg_per_day': round(avg_per_day, 1),
            'peak_hour': f"{peak_hour}:00",
            'peak_day': peak_day,
            'by_day': dict(by_day),
            'inbound': sum(1 for e in emails if e.get('direction', 'inbound') == 'inbound'),
            'outbound': sum(1 for e in emails if e.get('direction', 'inbound') == 'outbound')
        }

    def _analyze_priorities(self, emails: List[Dict]) -> Dict[str, int]:
        """Analyze priority distribution."""
        dist = {'critical': 0, 'high': 0, 'medium': 0, 'low': 0}
        for email in emails:
            p = email.get('priority', 'medium')
            if p in dist:
                dist[p] += 1
            else:
                dist['medium'] += 1
        return dist

    def _extract_topics(self, emails: List[Dict]) -> List[Dict[str, Any]]:
        """Extract key topics from emails."""
        word_counts = Counter()
        for email in emails:
            content = f"{email.get('subject', '')} {email.get('body', '')}".lower()
            words = re.findall(r'\b[a-z]{4,}\b', content)
            # Filter common words
            stop_words = {'this', 'that', 'with', 'from', 'have', 'been', 'will', 'would',
                          'could', 'should', 'about', 'which', 'their', 'there', 'they',
                          'what', 'when', 'where', 'more', 'some', 'than', 'them', 'very',
                          'just', 'also', 'like', 'each', 'make', 'most', 'many', 'much',
                          'over', 'such', 'only', 'other', 'into', 'after', 'before'}
            filtered = [w for w in words if w not in stop_words]
            word_counts.update(filtered)

        topics = []
        for word, count in word_counts.most_common(20):
            category = 'general'
            for cat, keywords in self.priority_keywords.items():
                if word in keywords:
                    category = cat
                    break
            topics.append({'topic': word, 'mentions': count, 'category': category})

        return topics

    def _extract_executive_actions(self, emails: List[Dict]) -> List[Dict[str, Any]]:
        """Extract action items requiring executive attention."""
        actions = []
        action_patterns = [
            r'(?:please|kindly)\s+(.+?)(?:\.|$)',
            r'(?:need|need to|must|should)\s+(.+?)(?:\.|$)',
            r'(?:action(?:\s+item)?[:|-])\s*(.+?)(?:\.|$)',
            r'(?:deadline|due)[:\s]*(.+?)(?:\.|$)'
        ]

        for email in emails:
            body = email.get('body', '')
            subject = email.get('subject', '')

            for pattern in action_patterns:
                matches = re.findall(pattern, body, re.IGNORECASE)
                for match in matches:
                    if len(match.strip()) > 10:
                        actions.append({
                            'action': match.strip()[:200],
                            'source': subject[:100],
                            'from': email.get('from', ''),
                            'priority': email.get('priority', 'medium'),
                            'detected_at': email.get('date', datetime.now().isoformat())
                        })

        # Sort by priority
        priority_order = {'critical': 0, 'high': 1, 'medium': 2, 'low': 3}
        actions.sort(key=lambda x: priority_order.get(x['priority'], 2))
        return actions[:20]

    def _analyze_sentiment(self, emails: List[Dict]) -> Dict[str, Any]:
        """Analyze overall email sentiment."""
        scores = {'positive': 0, 'negative': 0, 'neutral': 0}

        for email in emails:
            content = f"{email.get('subject', '')} {email.get('body', '')}".lower()
            pos = sum(1 for w in self.sentiment_words['positive'] if w in content)
            neg = sum(1 for w in self.sentiment_words['negative'] if w in content)

            if pos > neg:
                scores['positive'] += 1
            elif neg > pos:
                scores['negative'] += 1
            else:
                scores['neutral'] += 1

        total = sum(scores.values())
        return {
            'positive': scores['positive'],
            'negative': scores['negative'],
            'neutral': scores['neutral'],
            'positive_pct': round(scores['positive'] / max(total, 1) * 100, 1),
            'negative_pct': round(scores['negative'] / max(total, 1) * 100, 1),
            'overall_mood': 'positive' if scores['positive'] > scores['negative'] else
                           'concerning' if scores['negative'] > scores['positive'] else 'neutral'
        }

    def _identify_key_contacts(self, emails: List[Dict]) -> List[Dict[str, Any]]:
        """Identify key contacts by interaction frequency."""
        contact_counts = Counter()
        contact_priorities = defaultdict(list)

        for email in emails:
            sender = email.get('from', '')
            if sender:
                contact_counts[sender] += 1
                contact_priorities[sender].append(email.get('priority', 'medium'))

        key_contacts = []
        for contact, count in contact_counts.most_common(10):
            priorities = contact_priorities[contact]
            high_priority_pct = sum(1 for p in priorities if p in ['critical', 'high']) / len(priorities) * 100
            key_contacts.append({
                'contact': contact,
                'interaction_count': count,
                'high_priority_pct': round(high_priority_pct, 1),
                'relationship_strength': min(count * 10, 100)
            })

        return key_contacts

    def _detect_revenue_signals(self, emails: List[Dict]) -> List[Dict[str, Any]]:
        """Detect revenue-related signals."""
        signals = []
        for email in emails:
            content = f"{email.get('subject', '')} {email.get('body', '')}".lower()
            money = re.findall(r'\$[\d,]+(?:\.\d{2})?', content)
            if money or any(w in content for w in ['contract', 'deal', 'sale', 'purchase', 'revenue']):
                values = []
                for m in money:
                    try:
                        values.append(float(m.replace('$', '').replace(',', '')))
                    except:
                        pass
                signals.append({
                    'subject': email.get('subject', '')[:100],
                    'from': email.get('from', ''),
                    'values_detected': values,
                    'total_value': sum(values),
                    'signal_strength': 'strong' if values else 'moderate'
                })

        signals.sort(key=lambda x: x['total_value'], reverse=True)
        return signals[:10]

    def _detect_risks(self, emails: List[Dict]) -> List[Dict[str, Any]]:
        """Detect risk signals requiring attention."""
        risks = []
        risk_words = ['urgent', 'critical', 'escalation', 'breach', 'lawsuit', 'complaint',
                      'overdue', 'delayed', 'failed', 'lost', 'cancel', 'terminate']

        for email in emails:
            content = f"{email.get('subject', '')} {email.get('body', '')}".lower()
            detected = [w for w in risk_words if w in content]
            if detected:
                risks.append({
                    'subject': email.get('subject', '')[:100],
                    'from': email.get('from', ''),
                    'risk_keywords': detected,
                    'severity': 'high' if len(detected) >= 3 else 'medium' if len(detected) >= 2 else 'low',
                    'date': email.get('date', '')
                })

        risks.sort(key=lambda x: {'high': 0, 'medium': 1, 'low': 2}.get(x['severity'], 3))
        return risks[:10]

    def _analyze_time_allocation(self, emails: List[Dict], topics: List[Dict]) -> Dict[str, float]:
        """Analyze how time is being allocated across topics."""
        allocation = defaultdict(int)
        for email in emails:
            content = f"{email.get('subject', '')} {email.get('body', '')}".lower()
            for topic_info in topics[:10]:
                if topic_info['topic'] in content:
                    allocation[topic_info['category']] += 1
                    break

        total = sum(allocation.values()) or 1
        return {k: round(v / total * 100, 1) for k, v in allocation.items()}

    def _build_executive_summary(self, volume, priority, sentiment, revenue, risks) -> str:
        """Build executive summary text."""
        parts = []
        parts.append(f"Processed {volume['total_emails']} emails ({volume['avg_per_day']}/day average).")

        if priority.get('critical', 0) > 0:
            parts.append(f"⚠️ {priority['critical']} critical items require immediate attention.")

        parts.append(f"Overall sentiment: {sentiment['overall_mood']} ({sentiment['positive_pct']}% positive).")

        if revenue:
            total_rev = sum(r['total_value'] for r in revenue)
            if total_rev > 0:
                parts.append(f"💰 Revenue signals detected: ${total_rev:,.0f} in pipeline.")

        if risks:
            high_risks = sum(1 for r in risks if r['severity'] == 'high')
            if high_risks > 0:
                parts.append(f"🚨 {high_risks} high-severity risk alerts flagged.")

        return ' '.join(parts)

    def _generate_strategic_insights(self, emails, topics, sentiment, revenue) -> List[str]:
        """Generate strategic insights."""
        insights = []

        if sentiment['negative_pct'] > 30:
            insights.append("Negative sentiment trending above 30%. Review customer communication quality.")

        if any(t['category'] == 'risk' and t['mentions'] > 5 for t in topics):
            insights.append("Risk-related topics are highly mentioned. Proactive risk mitigation recommended.")

        if revenue and sum(r['total_value'] for r in revenue) > 100000:
            insights.append("Significant revenue opportunities in pipeline. Prioritize deal acceleration.")

        if len(emails) > 100:
            insights.append("High email volume detected. Consider delegation or automation opportunities.")

        return insights

    def _recommend_executive_actions(self, actions, risks, revenue) -> List[Dict[str, Any]]:
        """Recommend executive actions."""
        recommendations = []

        critical_actions = [a for a in actions if a['priority'] in ['critical', 'high']]
        if critical_actions:
            recommendations.append({
                'priority': 'immediate',
                'action': f"Review {len(critical_actions)} high-priority action items",
                'details': [a['action'][:100] for a in critical_actions[:5]]
            })

        high_risks = [r for r in risks if r['severity'] == 'high']
        if high_risks:
            recommendations.append({
                'priority': 'immediate',
                'action': f"Address {len(high_risks)} high-severity risks",
                'details': [r['subject'] for r in high_risks[:5]]
            })

        if revenue:
            top_deals = sorted(revenue, key=lambda x: x['total_value'], reverse=True)[:3]
            if top_deals and top_deals[0]['total_value'] > 0:
                recommendations.append({
                    'priority': 'high',
                    'action': 'Focus on top revenue opportunities',
                    'details': [f"{d['subject']}: ${d['total_value']:,.0f}" for d in top_deals]
                })

        return recommendations


def process_executive_briefing(emails: List[Dict[str, Any]], period: str = 'daily') -> Dict[str, Any]:
    """Main entry point for executive briefing generation."""
    generator = ExecutiveBriefingGenerator()
    return generator.generate_briefing(emails, period)


if __name__ == '__main__':
    test_emails = [
        {'from': 'client@company.com', 'subject': 'New contract proposal - $250,000', 'body': 'Please review the contract proposal for $250,000. We need your approval by Friday. This is urgent and critical for our Q4 revenue.', 'date': '2024-01-15T10:00:00', 'priority': 'high'},
        {'from': 'team@zion.com', 'subject': 'Sprint review update', 'body': 'Great progress this sprint! We achieved all milestones and the deployment was successful.', 'date': '2024-01-15T14:00:00', 'priority': 'low'},
        {'from': 'legal@client.com', 'subject': 'URGENT: Compliance concern', 'body': 'We have identified a potential compliance issue that requires immediate attention. This is critical and overdue.', 'date': '2024-01-16T09:00:00', 'priority': 'critical'}
    ]
    result = process_executive_briefing(test_emails, 'daily')
    print(json.dumps(result, indent=2))
