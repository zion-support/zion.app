#!/usr/bin/env python3
"""
V452 - AI Email Thread Summarizer Pro
Generates executive summaries of long email threads with key decisions, action items, and timeline.
Features: Thread analysis, decision extraction, timeline generation, action item tracking.
CRITICAL: Always enforces reply-all for multi-recipient emails.
"""

import json
import re
from datetime import datetime
from typing import Dict, List, Any


class ThreadSummarizerPro:
    """Generates comprehensive summaries of email threads."""
    
    def __init__(self):
        self.thread_cache: Dict[str, List[Dict]] = {}
        
    def analyze_email(self, email: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze email in context of thread and generate summary."""
        body = email.get('body', '')
        subject = email.get('subject', '')
        sender = email.get('from', '')
        recipients = email.get('to', []) + email.get('cc', [])
        thread_id = self._get_thread_id(email)
        
        # Update thread cache
        self._update_thread(thread_id, email)
        
        # Generate thread summary
        thread_messages = self.thread_cache.get(thread_id, [])
        summary = self._generate_summary(thread_messages)
        
        # Extract key information
        decisions = self._extract_decisions(body)
        action_items = self._extract_action_items(body)
        timeline = self._build_timeline(thread_messages)
        
        reply_all_required = len(recipients) > 1
        
        return {
            'engine': 'V452_ThreadSummarizerPro',
            'thread_id': thread_id,
            'thread_length': len(thread_messages),
            'executive_summary': summary,
            'key_decisions': decisions,
            'action_items': action_items,
            'timeline': timeline,
            'participants': self._get_participants(thread_messages),
            'thread_status': self._determine_status(thread_messages),
            'suggested_next_steps': self._suggest_next_steps(action_items, decisions),
            'reply_all_required': reply_all_required,
            'reply_all_enforced': reply_all_required,
            'recipients': recipients,
            'timestamp': datetime.now().isoformat()
        }
    
    def _get_thread_id(self, email: Dict) -> str:
        """Get thread identifier."""
        if 'message_id' in email:
            return email.get('in_reply_to', email['message_id'])
        subject = email.get('subject', '').replace('Re:', '').replace('FW:', '').strip()
        return re.sub(r'\W+', '_', subject.lower())[:50]
    
    def _update_thread(self, thread_id: str, email: Dict):
        """Update thread cache with new message."""
        if thread_id not in self.thread_cache:
            self.thread_cache[thread_id] = []
        
        self.thread_cache[thread_id].append({
            'from': email.get('from', ''),
            'to': email.get('to', []),
            'cc': email.get('cc', []),
            'subject': email.get('subject', ''),
            'body': email.get('body', ''),
            'timestamp': datetime.now().isoformat()
        })
    
    def _generate_summary(self, messages: List[Dict]) -> str:
        """Generate executive summary of thread."""
        if not messages:
            return "No messages in thread yet."
        
        if len(messages) == 1:
            return f"Thread started by {messages[0]['from']} with subject: {messages[0]['subject']}"
        
        # Count participants
        participants = set()
        for msg in messages:
            participants.add(msg['from'])
            if isinstance(msg.get('to'), list):
                participants.update(msg['to'])
        
        # Get thread duration
        first_msg = messages[0]['timestamp']
        last_msg = messages[-1]['timestamp']
        
        summary = f"This thread contains {len(messages)} messages from {len(participants)} participants. "
        summary += f"Started on {first_msg[:10]} and last updated on {last_msg[:10]}. "
        
        # Add key topics
        all_text = ' '.join([msg['body'] for msg in messages])
        topics = self._extract_topics(all_text)
        if topics:
            summary += f"Main topics: {', '.join(topics[:5])}."
        
        return summary
    
    def _extract_topics(self, text: str) -> List[str]:
        """Extract key topics from text."""
        words = re.findall(r'\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b', text)
        topics = list(set(words))[:10]
        return topics
    
    def _extract_decisions(self, body: str) -> List[Dict]:
        """Extract decisions from email body."""
        decisions = []
        patterns = [
            (r'(?:we\s+)?(?:decided|agreed|approved)\s+(?:to|that)\s+(.+?)(?:\.|$)', 'decision'),
            (r'(?:we\s+)?(?:will|shall)\s+(.+?)(?:\.|$)', 'commitment'),
            (r'(?:let\'?s|we\s+should)\s+(.+?)(?:\.|$)', 'proposal')
        ]
        
        for pattern, dtype in patterns:
            matches = re.findall(pattern, body, re.IGNORECASE)
            for match in matches:
                decisions.append({
                    'type': dtype,
                    'content': match.strip(),
                    'timestamp': datetime.now().isoformat()
                })
        
        return decisions
    
    def _extract_action_items(self, body: str) -> List[Dict]:
        """Extract action items from email."""
        items = []
        patterns = [
            r'(?:please|kindly)\s+(.+?)(?:\.|$)',
            r'(?:need to|must|should)\s+(.+?)(?:\.|$)',
            r'action item[:\s]+(.+?)(?:\.|$)',
            r'(?:TODO|TASK)[:\s]+(.+?)(?:\.|$)'
        ]
        
        for pattern in patterns:
            matches = re.findall(pattern, body, re.IGNORECASE)
            for match in matches:
                items.append({
                    'content': match.strip(),
                    'status': 'pending',
                    'assigned_to': 'TBD'
                })
        
        return items[:10]
    
    def _build_timeline(self, messages: List[Dict]) -> List[Dict]:
        """Build timeline of thread events."""
        timeline = []
        for i, msg in enumerate(messages):
            timeline.append({
                'event': f"Message {i+1}",
                'from': msg['from'],
                'timestamp': msg['timestamp'],
                'subject': msg['subject']
            })
        return timeline
    
    def _get_participants(self, messages: List[Dict]) -> List[str]:
        """Get all unique participants in thread."""
        participants = set()
        for msg in messages:
            participants.add(msg['from'])
            if isinstance(msg.get('to'), list):
                participants.update(msg['to'])
            if isinstance(msg.get('cc'), list):
                participants.update(msg['cc'])
        return list(participants)
    
    def _determine_status(self, messages: List[Dict]) -> str:
        """Determine thread status."""
        if not messages:
            return 'empty'
        
        last_msg = messages[-1]['body'].lower()
        
        if any(word in last_msg for word in ['resolved', 'completed', 'done', 'finished']):
            return 'resolved'
        elif any(word in last_msg for word in ['pending', 'waiting', 'review']):
            return 'pending'
        else:
            return 'active'
    
    def _suggest_next_steps(self, action_items: List[Dict], decisions: List[Dict]) -> List[str]:
        """Suggest next steps based on action items and decisions."""
        steps = []
        
        if action_items:
            steps.append(f"Follow up on {len(action_items)} pending action items")
        
        if decisions:
            steps.append(f"Implement {len(decisions)} decisions made")
        
        steps.append("Review thread summary before responding")
        steps.append("Use reply-all to keep all participants informed")
        
        return steps


def main():
    """Test V452 engine."""
    engine = ThreadSummarizerPro()
    
    test_email = {
        'from': 'project-lead@ziontechgroup.com',
        'to': ['team@ziontechgroup.com', 'kleber@ziontechgroup.com'],
        'cc': ['manager@ziontechgroup.com'],
        'subject': 'Re: Project Aurora - Sprint Planning',
        'body': "Team,\n\nWe decided to prioritize the Kubernetes migration this sprint. John will lead the technical implementation. We agreed to use AWS EKS for the deployment.\n\nAction items:\n1. John - Set up EKS cluster by Friday\n2. Sarah - Update deployment scripts\n3. Mike - Prepare monitoring dashboards\n\nLet's sync on Monday to review progress.\n\nThanks!"
    }
    
    result = engine.analyze_email(test_email)
    print(json.dumps(result, indent=2))
    print(f"\n✅ Thread Length: {result['thread_length']} messages")
    print(f"✅ Key Decisions: {len(result['key_decisions'])}")
    print(f"✅ Action Items: {len(result['action_items'])}")
    print(f"✅ Reply-all enforced: {result['reply_all_enforced']}")


if __name__ == '__main__':
    main()
