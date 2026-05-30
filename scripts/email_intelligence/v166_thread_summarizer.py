#!/usr/bin/env python3
"""
V166 - Email Thread Summarizer Pro
Condenses long email threads into key points and decisions, extracts action items with owners
and deadlines, generates thread digests for new participants, and creates searchable conversation archives.
"""

import json
import re
from datetime import datetime
from typing import Dict, List, Optional, Tuple
from collections import defaultdict

class ThreadSummarizerPro:
    def __init__(self):
        self.thread_store = defaultdict(list)
        self.action_item_patterns = [
            r'(?:please|kindly)\s+(.+?)(?:\.|$)',
            r'(?:need to|must|should|will)\s+(.+?)(?:\.|$)',
            r'(?:action|task|todo)[:\s]*(.+?)(?:\.|$)',
            r'(?:deadline|due|by)[:\s]*(.+?)(?:\.|$)',
            r'@(\w+)\s+(?:please|can you|could you)\s+(.+?)(?:\.|$)'
        ]
        self.decision_patterns = [
            r'(?:decided|agreed|approved|confirmed)[:\s]*(.+?)(?:\.|$)',
            r'(?:we will|we should|we are going to)\s+(.+?)(?:\.|$)',
            r'(?:final decision|conclusion|resolution)[:\s]*(.+?)(?:\.|$)'
        ]
    
    def add_email_to_thread(self, thread_id: str, email: Dict):
        """Add an email to a conversation thread."""
        self.thread_store[thread_id].append({
            'timestamp': email.get('date', datetime.now().isoformat()),
            'from': email.get('from', 'unknown'),
            'to': email.get('to', []),
            'cc': email.get('cc', []),
            'subject': email.get('subject', ''),
            'body': email.get('body', ''),
            'attachments': email.get('attachments', [])
        })
        
        # Keep threads manageable
        self.thread_store[thread_id] = self.thread_store[thread_id][-100:]
    
    def summarize_thread(self, thread_id: str) -> Dict:
        """Generate comprehensive summary of an email thread."""
        if thread_id not in self.thread_store:
            return {'error': 'Thread not found'}
        
        emails = self.thread_store[thread_id]
        
        if not emails:
            return {'error': 'Empty thread'}
        
        # Extract participants
        participants = self._extract_participants(emails)
        
        # Extract timeline
        timeline = self._build_timeline(emails)
        
        # Extract key topics
        topics = self._extract_topics(emails)
        
        # Extract decisions
        decisions = self._extract_decisions(emails)
        
        # Extract action items
        action_items = self._extract_action_items(emails)
        
        # Extract key points
        key_points = self._extract_key_points(emails)
        
        # Generate executive summary
        executive_summary = self._generate_executive_summary(
            participants, topics, decisions, action_items, timeline
        )
        
        # Detect open items
        open_items = self._detect_open_items(action_items, emails)
        
        return {
            'thread_id': thread_id,
            'total_emails': len(emails),
            'date_range': {
                'start': emails[0]['timestamp'],
                'end': emails[-1]['timestamp']
            },
            'participants': participants,
            'executive_summary': executive_summary,
            'key_topics': topics[:10],
            'decisions_made': decisions,
            'action_items': action_items,
            'open_items': open_items,
            'timeline': timeline[:20],
            'key_points': key_points[:15],
            'reply_all_recommended': len(participants) > 2
        }
    
    def _extract_participants(self, emails: List[Dict]) -> List[Dict]:
        """Extract all unique participants from the thread."""
        participant_map = defaultdict(lambda: {'email_count': 0, 'first_seen': None, 'last_seen': None})
        
        for email in emails:
            sender = email['from']
            participant_map[sender]['email_count'] += 1
            
            if not participant_map[sender]['first_seen']:
                participant_map[sender]['first_seen'] = email['timestamp']
            participant_map[sender]['last_seen'] = email['timestamp']
        
        participants = []
        for email, data in participant_map.items():
            participants.append({
                'email': email,
                'contribution_count': data['email_count'],
                'first_seen': data['first_seen'],
                'last_seen': data['last_seen'],
                'role': self._infer_role(data['email_count'], len(emails))
            })
        
        participants.sort(key=lambda x: x['contribution_count'], reverse=True)
        return participants
    
    def _infer_role(self, email_count: int, total_emails: int) -> str:
        """Infer participant role based on contribution."""
        ratio = email_count / total_emails
        if ratio > 0.4:
            return 'primary_contributor'
        elif ratio > 0.2:
            return 'active_participant'
        elif ratio > 0.05:
            return 'occasional_contributor'
        else:
            return 'observer'
    
    def _build_timeline(self, emails: List[Dict]) -> List[Dict]:
        """Build chronological timeline of the conversation."""
        timeline = []
        for email in emails:
            timeline.append({
                'timestamp': email['timestamp'],
                'from': email['from'],
                'subject': email.get('subject', '')[:80],
                'preview': email.get('body', '')[:150]
            })
        return timeline
    
    def _extract_topics(self, emails: List[Dict]) -> List[Dict]:
        """Extract key topics from thread."""
        all_text = ' '.join(email.get('body', '') + ' ' + email.get('subject', '') for email in emails).lower()
        
        # Extract frequent meaningful words
        words = re.findall(r'\b[a-z]{4,}\b', all_text)
        stop_words = {'this', 'that', 'with', 'from', 'have', 'been', 'will', 'would', 'could', 'should',
                      'about', 'which', 'their', 'there', 'they', 'what', 'when', 'where', 'more', 'some',
                      'than', 'them', 'very', 'just', 'also', 'like', 'each', 'make', 'most', 'many'}
        
        word_counts = defaultdict(int)
        for word in words:
            if word not in stop_words:
                word_counts[word] += 1
        
        topics = []
        for word, count in sorted(word_counts.items(), key=lambda x: x[1], reverse=True)[:20]:
            topics.append({'topic': word, 'mentions': count})
        
        return topics
    
    def _extract_decisions(self, emails: List[Dict]) -> List[Dict]:
        """Extract decisions made in the thread."""
        decisions = []
        
        for email in emails:
            body = email.get('body', '')
            
            for pattern in self.decision_patterns:
                matches = re.findall(pattern, body, re.IGNORECASE)
                for match in matches:
                    if len(match.strip()) > 10:
                        decisions.append({
                            'decision': match.strip()[:200],
                            'made_by': email['from'],
                            'timestamp': email['timestamp'],
                            'confidence': 0.8
                        })
        
        return decisions[:20]
    
    def _extract_action_items(self, emails: List[Dict]) -> List[Dict]:
        """Extract action items with owners and deadlines."""
        action_items = []
        
        for email in emails:
            body = email.get('body', '')
            
            for pattern in self.action_item_patterns:
                matches = re.findall(pattern, body, re.IGNORECASE)
                for match in matches:
                    if isinstance(match, tuple):
                        # Handle @mention pattern
                        owner = match[0] if match[0] else 'unassigned'
                        task = match[1] if len(match) > 1 else ''
                    else:
                        owner = 'unassigned'
                        task = match
                    
                    if len(task.strip()) > 10:
                        # Try to extract deadline
                        deadline = self._extract_deadline(body, email['timestamp'])
                        
                        action_items.append({
                            'task': task.strip()[:200],
                            'owner': owner,
                            'assigned_by': email['from'],
                            'timestamp': email['timestamp'],
                            'deadline': deadline,
                            'status': 'pending'
                        })
        
        return action_items[:30]
    
    def _extract_deadline(self, text: str, email_timestamp: str) -> Optional[str]:
        """Extract deadline from text."""
        # Simple date patterns
        date_patterns = [
            r'\b(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})\b',
            r'\b((?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\w*\s+\d{1,2})\b',
            r'\b(today|tomorrow|next\s+week|end\s+of\s+week|eow)\b'
        ]
        
        for pattern in date_patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                return match.group(1)
        
        return None
    
    def _extract_key_points(self, emails: List[Dict]) -> List[Dict]:
        """Extract key discussion points."""
        key_points = []
        
        for email in emails:
            body = email.get('body', '')
            sentences = re.split(r'[.!?]+', body)
            
            for sentence in sentences:
                sentence = sentence.strip()
                if len(sentence) > 30 and len(sentence) < 300:
                    # Check if sentence is substantive
                    important_keywords = ['important', 'critical', 'key', 'main', 'essential',
                                         'proposal', 'suggest', 'recommend', 'issue', 'problem',
                                         'solution', 'agree', 'disagree', 'concern', 'question']
                    
                    if any(kw in sentence.lower() for kw in important_keywords):
                        key_points.append({
                            'point': sentence[:250],
                            'from': email['from'],
                            'timestamp': email['timestamp']
                        })
        
        return key_points
    
    def _generate_executive_summary(self, participants: List, topics: List, decisions: List,
                                     action_items: List, timeline: List) -> str:
        """Generate executive summary of the thread."""
        parts = []
        
        parts.append(f"Thread with {len(participants)} participants over {len(timeline)} messages.")
        
        if decisions:
            parts.append(f"{len(decisions)} key decisions made.")
        
        if action_items:
            pending = sum(1 for a in action_items if a['status'] == 'pending')
            parts.append(f"{len(action_items)} action items ({pending} pending).")
        
        if topics:
            top_topics = [t['topic'] for t in topics[:5]]
            parts.append(f"Main topics: {', '.join(top_topics)}.")
        
        return ' '.join(parts)
    
    def _detect_open_items(self, action_items: List, emails: List) -> List[Dict]:
        """Detect action items that are still open."""
        open_items = []
        
        # Check for unresolved questions
        for email in emails[-10:]:  # Last 10 emails
            body = email.get('body', '')
            questions = re.findall(r'([^.?]+\?)', body)
            
            for question in questions:
                if len(question.strip()) > 15:
                    open_items.append({
                        'type': 'unanswered_question',
                        'content': question.strip()[:200],
                        'asked_by': email['from'],
                        'timestamp': email['timestamp']
                    })
        
        # Add pending action items
        for item in action_items:
            if item['status'] == 'pending':
                open_items.append({
                    'type': 'pending_action',
                    'content': item['task'],
                    'owner': item['owner'],
                    'deadline': item.get('deadline')
                })
        
        return open_items[:20]
    
    def generate_digest_for_newcomer(self, thread_id: str, newcomer_email: str) -> Dict:
        """Generate a digest for someone joining the thread mid-conversation."""
        summary = self.summarize_thread(thread_id)
        
        if 'error' in summary:
            return summary
        
        # Create newcomer-friendly digest
        digest = {
            'welcome_message': f"Welcome to this conversation thread with {len(summary['participants'])} participants.",
            'key_context': summary['executive_summary'],
            'current_status': {
                'open_questions': [item for item in summary['open_items'] if item['type'] == 'unanswered_question'],
                'pending_actions': [item for item in summary['open_items'] if item['type'] == 'pending_action']
            },
            'recent_activity': summary['timeline'][-5:],
            'key_decisions': summary['decisions_made'][:5],
            'reply_all_note': 'Reply-all is recommended to keep all participants informed.' if summary['reply_all_recommended'] else 'Direct reply may be appropriate.'
        }
        
        return digest
    
    def get_thread_stats(self) -> Dict:
        """Get overall thread statistics."""
        total_threads = len(self.thread_store)
        total_emails = sum(len(emails) for emails in self.thread_store.values())
        
        thread_lengths = [len(emails) for emails in self.thread_store.values()]
        
        return {
            'total_threads': total_threads,
            'total_emails': total_emails,
            'avg_thread_length': round(total_emails / max(total_threads, 1), 1),
            'longest_thread': max(thread_lengths) if thread_lengths else 0,
            'shortest_thread': min(thread_lengths) if thread_lengths else 0
        }

# Usage Example
if __name__ == "__main__":
    summarizer = ThreadSummarizerPro()
    
    # Add emails to a thread
    summarizer.add_email_to_thread('project_alpha', {
        'from': 'alice@company.com',
        'date': '2024-01-15T10:00:00',
        'subject': 'Project Alpha Kickoff',
        'body': 'Hi team, let\'s discuss the kickoff for Project Alpha. We need to decide on the timeline and assign tasks.'
    })
    
    summarizer.add_email_to_thread('project_alpha', {
        'from': 'bob@company.com',
        'date': '2024-01-15T11:00:00',
        'subject': 'Re: Project Alpha Kickoff',
        'body': 'I suggest we aim for Q2 launch. @alice please prepare the project plan by next Friday.'
    })
    
    # Generate summary
    result = summarizer.summarize_thread('project_alpha')
    print(json.dumps(result, indent=2))
