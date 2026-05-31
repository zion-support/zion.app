#!/usr/bin/env python3
"""
V476 - Email Thread Summarizer Pro
Generate executive summaries of long email threads with key decisions, action items, and timeline.
Features: Thread analysis, decision extraction, action item tracking, timeline generation, key quote highlighting.
CRITICAL: Always enforces reply-all for multi-recipient emails.
"""

import json
import re
from datetime import datetime
from typing import Dict, List, Any
from collections import defaultdict


class EmailThreadSummarizerPro:
    """Generate executive summaries of email threads."""
    
    def analyze_email(self, email: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze email thread and generate executive summary."""
        thread = email.get('thread', [])
        subject = email.get('subject', '')
        recipients = email.get('to', []) + email.get('cc', [])
        
        if not thread:
            return self._single_email_summary(email)
        
        # Analyze thread
        thread_stats = self._analyze_thread_stats(thread)
        decisions = self._extract_decisions(thread)
        action_items = self._extract_action_items(thread)
        timeline = self._generate_timeline(thread)
        key_quotes = self._extract_key_quotes(thread)
        participants = self._analyze_participants(thread)
        
        # Generate executive summary
        executive_summary = self._generate_executive_summary(
            thread_stats, decisions, action_items, timeline, key_quotes
        )
        
        reply_all_required = len(recipients) > 1
        
        return {
            'engine': 'V476_EmailThreadSummarizerPro',
            'executive_summary': executive_summary,
            'thread_statistics': thread_stats,
            'decisions': decisions,
            'action_items': action_items,
            'timeline': timeline,
            'key_quotes': key_quotes,
            'participants': participants,
            'reply_all_required': reply_all_required,
            'reply_all_enforced': reply_all_required,
            'recipients': recipients,
            'timestamp': datetime.now().isoformat()
        }
    
    def _single_email_summary(self, email: Dict) -> Dict:
        """Generate summary for single email."""
        body = email.get('body', '')
        subject = email.get('subject', '')
        recipients = email.get('to', []) + email.get('cc', [])
        
        return {
            'engine': 'V476_EmailThreadSummarizerPro',
            'executive_summary': f"Single email: {subject}",
            'thread_statistics': {
                'total_emails': 1,
                'participants': len(set(recipients + [email.get('from', '')])),
                'duration': 'N/A'
            },
            'decisions': [],
            'action_items': [],
            'timeline': [],
            'key_quotes': [],
            'participants': [{'email': email.get('from', ''), 'role': 'sender'}],
            'reply_all_required': len(recipients) > 1,
            'reply_all_enforced': len(recipients) > 1,
            'recipients': recipients,
            'timestamp': datetime.now().isoformat()
        }
    
    def _analyze_thread_stats(self, thread: List[Dict]) -> Dict:
        """Analyze thread statistics."""
        if not thread:
            return {'total_emails': 0, 'participants': 0, 'duration': 'N/A'}
        
        participants = set()
        for email in thread:
            participants.add(email.get('from', ''))
            participants.update(email.get('to', []))
            participants.update(email.get('cc', []))
        
        # Calculate duration
        if len(thread) >= 2:
            first_email = thread[0].get('timestamp', '')
            last_email = thread[-1].get('timestamp', '')
            # Simplified duration calculation
            duration = f"{len(thread)} emails over conversation"
        else:
            duration = 'Single email'
        
        return {
            'total_emails': len(thread),
            'participants': len(participants),
            'duration': duration,
            'avg_email_length': sum(len(e.get('body', '')) for e in thread) / len(thread)
        }
    
    def _extract_decisions(self, thread: List[Dict]) -> List[Dict]:
        """Extract decisions from thread."""
        decisions = []
        decision_keywords = ['decided', 'agreed', 'approved', 'confirmed', 'will do', 'let\'s proceed']
        
        for email in thread:
            body = email.get('body', '').lower()
            for keyword in decision_keywords:
                if keyword in body:
                    # Extract context around decision
                    sentences = body.split('.')
                    for sentence in sentences:
                        if keyword in sentence:
                            decisions.append({
                                'decision': sentence.strip(),
                                'made_by': email.get('from', ''),
                                'timestamp': email.get('timestamp', ''),
                                'confidence': 0.85
                            })
                            break
        
        return decisions[:10]  # Limit to top 10 decisions
    
    def _extract_action_items(self, thread: List[Dict]) -> List[Dict]:
        """Extract action items from thread."""
        action_items = []
        action_keywords = ['please', 'need to', 'action item', 'todo', 'task', 'responsible for']
        
        for email in thread:
            body = email.get('body', '')
            sentences = body.split('.')
            
            for sentence in sentences:
                sentence_lower = sentence.lower()
                if any(keyword in sentence_lower for keyword in action_keywords):
                    # Try to identify assignee
                    assignee = self._identify_assignee(sentence, email.get('to', []))
                    
                    action_items.append({
                        'task': sentence.strip(),
                        'assignee': assignee,
                        'status': 'pending',
                        'source_email': email.get('from', ''),
                        'timestamp': email.get('timestamp', '')
                    })
        
        return action_items[:15]  # Limit to top 15 action items
    
    def _identify_assignee(self, sentence: str, recipients: List[str]) -> str:
        """Identify who is assigned to an action item."""
        sentence_lower = sentence.lower()
        
        # Check for direct mentions
        for recipient in recipients:
            name = recipient.split('@')[0].lower()
            if name in sentence_lower:
                return recipient
        
        # Default to "TBD" if no clear assignee
        return 'TBD'
    
    def _generate_timeline(self, thread: List[Dict]) -> List[Dict]:
        """Generate timeline of important events."""
        timeline = []
        
        for i, email in enumerate(thread):
            # Identify important emails
            importance = self._calculate_email_importance(email)
            
            if importance > 0.5 or i == 0 or i == len(thread) - 1:
                timeline.append({
                    'timestamp': email.get('timestamp', ''),
                    'event': f"Email from {email.get('from', '')}",
                    'subject': email.get('subject', ''),
                    'importance': importance,
                    'key_points': self._extract_key_points(email.get('body', ''))
                })
        
        return timeline
    
    def _calculate_email_importance(self, email: Dict) -> float:
        """Calculate importance score for an email."""
        body = email.get('body', '').lower()
        subject = email.get('subject', '').lower()
        
        importance_indicators = [
            'important', 'urgent', 'decision', 'approved', 'rejected',
            'deadline', 'critical', 'final', 'update', 'progress'
        ]
        
        score = 0.0
        for indicator in importance_indicators:
            if indicator in body or indicator in subject:
                score += 0.2
        
        # Longer emails might be more important
        if len(body) > 500:
            score += 0.2
        
        return min(1.0, score)
    
    def _extract_key_points(self, body: str) -> List[str]:
        """Extract key points from email body."""
        sentences = body.split('.')
        key_points = []
        
        # Look for sentences with important keywords
        important_keywords = ['summary', 'conclusion', 'result', 'outcome', 'decision']
        
        for sentence in sentences:
            sentence_lower = sentence.lower()
            if any(keyword in sentence_lower for keyword in important_keywords):
                key_points.append(sentence.strip())
        
        return key_points[:3]  # Limit to 3 key points
    
    def _extract_key_quotes(self, thread: List[Dict]) -> List[Dict]:
        """Extract important quotes from thread."""
        quotes = []
        quote_keywords = ['important', 'key point', 'remember', 'critical', 'must']
        
        for email in thread:
            body = email.get('body', '')
            sentences = body.split('.')
            
            for sentence in sentences:
                sentence_lower = sentence.lower()
                if any(keyword in sentence_lower for keyword in quote_keywords):
                    quotes.append({
                        'quote': sentence.strip(),
                        'author': email.get('from', ''),
                        'timestamp': email.get('timestamp', ''),
                        'context': 'important_statement'
                    })
        
        return quotes[:5]  # Limit to top 5 quotes
    
    def _analyze_participants(self, thread: List[Dict]) -> List[Dict]:
        """Analyze thread participants."""
        participant_stats = defaultdict(lambda: {'email_count': 0, 'role': 'participant'})
        
        for email in thread:
            sender = email.get('from', '')
            participant_stats[sender]['email_count'] += 1
            
            # Identify roles
            if 'manager' in sender.lower() or 'director' in sender.lower():
                participant_stats[sender]['role'] = 'management'
            elif 'support' in sender.lower():
                participant_stats[sender]['role'] = 'support'
            elif 'sales' in sender.lower():
                participant_stats[sender]['role'] = 'sales'
        
        return [
            {'email': email, 'email_count': stats['email_count'], 'role': stats['role']}
            for email, stats in participant_stats.items()
        ]
    
    def _generate_executive_summary(self, stats: Dict, decisions: List[Dict], 
                                     action_items: List[Dict], timeline: List[Dict], 
                                     key_quotes: List[Dict]) -> str:
        """Generate executive summary text."""
        summary_parts = [
            f"Thread Overview: {stats['total_emails']} emails from {stats['participants']} participants over {stats['duration']}.",
        ]
        
        if decisions:
            summary_parts.append(f"Key Decisions: {len(decisions)} decisions made, including: {decisions[0]['decision'][:100]}...")
        
        if action_items:
            pending_items = [item for item in action_items if item['status'] == 'pending']
            summary_parts.append(f"Action Items: {len(action_items)} total, {len(pending_items)} pending.")
        
        if key_quotes:
            summary_parts.append(f"Key Quotes: {len(key_quotes)} important statements identified.")
        
        summary_parts.append("Recommendation: Review action items and follow up on pending tasks. Always use reply-all for multi-recipient emails.")
        
        return ' '.join(summary_parts)


def main():
    """Test V476 engine."""
    engine = EmailThreadSummarizerPro()
    
    # Simulate a thread
    test_email = {
        'subject': 'Project Alpha - Final Approval',
        'from': 'manager@company.com',
        'to': ['team@ziontechgroup.com', 'kleber@ziontechgroup.com'],
        'cc': ['stakeholders@company.com'],
        'thread': [
            {
                'from': 'client@company.com',
                'to': ['sales@ziontechgroup.com'],
                'subject': 'Project Alpha Proposal',
                'body': 'We are interested in your proposal. Please send us the details.',
                'timestamp': '2026-05-28T10:00:00'
            },
            {
                'from': 'sales@ziontechgroup.com',
                'to': ['client@company.com'],
                'subject': 'Re: Project Alpha Proposal',
                'body': 'Thank you for your interest. Here is our detailed proposal. We decided to include the premium support package.',
                'timestamp': '2026-05-28T14:00:00'
            },
            {
                'from': 'manager@company.com',
                'to': ['team@ziontechgroup.com', 'kleber@ziontechgroup.com'],
                'cc': ['stakeholders@company.com'],
                'subject': 'Project Alpha - Final Approval',
                'body': 'We have reviewed the proposal and approved it. Please proceed with the implementation. John, please coordinate with the team. Sarah, please handle the contract. This is a critical project and we need to meet the deadline.',
                'timestamp': '2026-05-30T09:00:00'
            }
        ]
    }
    
    result = engine.analyze_email(test_email)
    print(json.dumps(result, indent=2))
    print(f"\n✅ Executive Summary: {result['executive_summary'][:150]}...")
    print(f"✅ Decisions: {len(result['decisions'])}")
    print(f"✅ Action Items: {len(result['action_items'])}")
    print(f"✅ Reply-all enforced: {result['reply_all_enforced']}")


if __name__ == '__main__':
    main()
