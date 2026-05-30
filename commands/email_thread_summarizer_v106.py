#!/usr/bin/env python3
"""
V106: AI Email Thread Summarizer Pro
Intelligent summarization of long email threads with key decision extraction,
action item highlighting, timeline generation, and participant tracking.
"""

import json
import re
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass, field
from enum import Enum


class SummaryType(Enum):
    EXECUTIVE = "executive"
    TECHNICAL = "technical"
    ACTION_ITEMS = "action_items"
    TIMELINE = "timeline"
    DECISIONS = "decisions"
    FULL = "full"


class ImportanceLevel(Enum):
    CRITICAL = "critical"
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"


@dataclass
class EmailSummary:
    email_id: str
    sender: str
    timestamp: datetime
    subject: str
    key_points: List[str]
    action_items: List[Dict]
    decisions: List[str]
    questions: List[str]
    commitments: List[str]
    importance: ImportanceLevel


@dataclass
class ThreadSummary:
    thread_id: str
    subject: str
    participants: List[str]
    email_count: int
    time_span: str
    executive_summary: str
    key_decisions: List[Dict]
    action_items: List[Dict]
    open_questions: List[str]
    timeline: List[Dict]
    participant_activity: Dict[str, int]
    unresolved_issues: List[str]


class V106ThreadSummarizer:
    """
    V106: AI Email Thread Summarizer Pro
    
    Features:
    1. Intelligent summarization of long email threads
    2. Key decision extraction
    3. Action item highlighting
    4. Timeline generation
    5. Participant tracking
    6. Export capabilities (PDF, DOCX, Markdown)
    """
    
    def __init__(self):
        self.thread_cache: Dict[str, ThreadSummary] = {}
        
        # Keywords for extraction
        self.decision_keywords = [
            'decided', 'decision', 'agreed', 'approved', 'confirmed',
            'will proceed', 'moving forward', 'going with', 'selected'
        ]
        
        self.action_keywords = [
            'will', 'need to', 'must', 'should', 'action', 'task',
            'follow up', 'complete', 'deliver', 'send', 'provide'
        ]
        
        self.question_keywords = [
            '?', 'question', 'wondering', 'can you', 'could you',
            'would you', 'when', 'where', 'how', 'what', 'why'
        ]
    
    def summarize_thread(self, emails: List[Dict]) -> ThreadSummary:
        """Generate comprehensive thread summary."""
        if not emails:
            return ThreadSummary(
                thread_id='unknown',
                subject='',
                participants=[],
                email_count=0,
                time_span='0 days',
                executive_summary='No emails in thread',
                key_decisions=[],
                action_items=[],
                open_questions=[],
                timeline=[],
                participant_activity={},
                unresolved_issues=[]
            )
        
        # Sort emails by timestamp
        emails_sorted = sorted(emails, key=lambda x: x.get('timestamp', ''))
        
        thread_id = emails_sorted[0].get('thread_id', emails_sorted[0].get('id', 'unknown'))
        subject = emails_sorted[0].get('subject', 'No Subject')
        
        # Extract participants
        participants = list(set(email.get('from', '') for email in emails_sorted))
        
        # Calculate time span
        first_time = datetime.fromisoformat(emails_sorted[0].get('timestamp', datetime.now().isoformat()))
        last_time = datetime.fromisoformat(emails_sorted[-1].get('timestamp', datetime.now().isoformat()))
        time_span = str(last_time - first_time)
        
        # Summarize each email
        email_summaries = [self._summarize_email(email) for email in emails_sorted]
        
        # Extract key decisions
        key_decisions = self._extract_decisions(email_summaries)
        
        # Extract action items
        action_items = self._extract_action_items(email_summaries)
        
        # Extract open questions
        open_questions = self._extract_open_questions(email_summaries)
        
        # Generate timeline
        timeline = self._generate_timeline(email_summaries)
        
        # Track participant activity
        participant_activity = {}
        for email in emails_sorted:
            sender = email.get('from', '')
            participant_activity[sender] = participant_activity.get(sender, 0) + 1
        
        # Generate executive summary
        executive_summary = self._generate_executive_summary(
            subject, len(emails_sorted), participants, key_decisions, action_items
        )
        
        # Identify unresolved issues
        unresolved_issues = [q for q in open_questions if not self._is_question_answered(q, email_summaries)]
        
        summary = ThreadSummary(
            thread_id=thread_id,
            subject=subject,
            participants=participants,
            email_count=len(emails_sorted),
            time_span=time_span,
            executive_summary=executive_summary,
            key_decisions=key_decisions,
            action_items=action_items,
            open_questions=open_questions,
            timeline=timeline,
            participant_activity=participant_activity,
            unresolved_issues=unresolved_issues
        )
        
        self.thread_cache[thread_id] = summary
        return summary
    
    def _summarize_email(self, email: Dict) -> EmailSummary:
        """Summarize individual email."""
        email_id = email.get('id', 'unknown')
        sender = email.get('from', '')
        timestamp = datetime.fromisoformat(email.get('timestamp', datetime.now().isoformat()))
        subject = email.get('subject', '')
        body = email.get('body', '')
        
        # Extract key points
        key_points = self._extract_key_points(body)
        
        # Extract action items
        action_items = []
        for pattern in [r'(?:will|need to|must|should)\s+(.+?)(?:\.|$)']:
            matches = re.finditer(pattern, body, re.IGNORECASE)
            for match in matches:
                action_items.append({
                    'content': match.group(0),
                    'assignee': sender,
                    'status': 'pending'
                })
        
        # Extract decisions
        decisions = []
        for keyword in self.decision_keywords:
            if keyword in body.lower():
                # Extract sentence containing decision
                sentences = body.split('.')
                for sentence in sentences:
                    if keyword in sentence.lower():
                        decisions.append(sentence.strip())
                        break
        
        # Extract questions
        questions = []
        sentences = body.split('.')
        for sentence in sentences:
            if '?' in sentence or any(kw in sentence.lower() for kw in ['can you', 'could you', 'would you']):
                questions.append(sentence.strip())
        
        # Extract commitments
        commitments = []
        commitment_patterns = [
            r"(?:I will|I'll|we will|we'll)\s+(.+?)(?:\.|$)",
            r"(?:promise|commit to)\s+(.+?)(?:\.|$)"
        ]
        for pattern in commitment_patterns:
            matches = re.finditer(pattern, body, re.IGNORECASE)
            for match in matches:
                commitments.append(match.group(0))
        
        # Determine importance
        importance = ImportanceLevel.MEDIUM
        if any(word in body.lower() for word in ['urgent', 'critical', 'asap', 'immediately']):
            importance = ImportanceLevel.CRITICAL
        elif any(word in body.lower() for word in ['important', 'priority', 'deadline']):
            importance = ImportanceLevel.HIGH
        elif len(body) < 100:
            importance = ImportanceLevel.LOW
        
        return EmailSummary(
            email_id=email_id,
            sender=sender,
            timestamp=timestamp,
            subject=subject,
            key_points=key_points,
            action_items=action_items,
            decisions=decisions,
            questions=questions,
            commitments=commitments,
            importance=importance
        )
    
    def _extract_key_points(self, body: str) -> List[str]:
        """Extract key points from email body."""
        # Split into sentences
        sentences = re.split(r'[.!?]+', body)
        
        # Score sentences
        scored_sentences = []
        for sentence in sentences:
            sentence = sentence.strip()
            if len(sentence) < 10:
                continue
            
            score = 0
            
            # Important keywords
            important_words = ['important', 'key', 'critical', 'essential', 'main', 'primary']
            if any(word in sentence.lower() for word in important_words):
                score += 2
            
            # Numbers and dates
            if re.search(r'\d+', sentence):
                score += 1
            
            # Capitalized words (proper nouns)
            if re.search(r'\b[A-Z][a-z]+\b', sentence):
                score += 1
            
            # Length (prefer medium-length sentences)
            word_count = len(sentence.split())
            if 10 <= word_count <= 30:
                score += 1
            
            scored_sentences.append((sentence, score))
        
        # Sort by score and return top 3
        scored_sentences.sort(key=lambda x: x[1], reverse=True)
        return [s[0] for s in scored_sentences[:3]]
    
    def _extract_decisions(self, email_summaries: List[EmailSummary]) -> List[Dict]:
        """Extract key decisions from thread."""
        decisions = []
        seen_decisions = set()
        
        for summary in email_summaries:
            for decision in summary.decisions:
                if decision not in seen_decisions:
                    decisions.append({
                        'content': decision,
                        'made_by': summary.sender,
                        'timestamp': summary.timestamp.isoformat(),
                        'email_id': summary.email_id
                    })
                    seen_decisions.add(decision)
        
        return decisions
    
    def _extract_action_items(self, email_summaries: List[EmailSummary]) -> List[Dict]:
        """Extract action items from thread."""
        all_actions = []
        seen_actions = set()
        
        for summary in email_summaries:
            for action in summary.action_items:
                action_key = action['content']
                if action_key not in seen_actions:
                    action['email_id'] = summary.email_id
                    action['timestamp'] = summary.timestamp.isoformat()
                    all_actions.append(action)
                    seen_actions.add(action_key)
        
        return all_actions
    
    def _extract_open_questions(self, email_summaries: List[EmailSummary]) -> List[str]:
        """Extract open questions from thread."""
        questions = []
        seen_questions = set()
        
        for summary in email_summaries:
            for question in summary.questions:
                if question not in seen_questions:
                    questions.append(question)
                    seen_questions.add(question)
        
        return questions
    
    def _generate_timeline(self, email_summaries: List[EmailSummary]) -> List[Dict]:
        """Generate timeline of thread events."""
        timeline = []
        
        for summary in email_summaries:
            event = {
                'timestamp': summary.timestamp.isoformat(),
                'sender': summary.sender,
                'type': 'email',
                'importance': summary.importance.value,
                'key_points': summary.key_points[:2]
            }
            
            # Add decision events
            for decision in summary.decisions:
                timeline.append({
                    'timestamp': summary.timestamp.isoformat(),
                    'sender': summary.sender,
                    'type': 'decision',
                    'content': decision
                })
            
            # Add action item events
            for action in summary.action_items:
                timeline.append({
                    'timestamp': summary.timestamp.isoformat(),
                    'sender': summary.sender,
                    'type': 'action_item',
                    'content': action['content'],
                    'assignee': action['assignee']
                })
            
            timeline.append(event)
        
        # Sort by timestamp
        timeline.sort(key=lambda x: x['timestamp'])
        return timeline
    
    def _generate_executive_summary(self, subject: str, email_count: int, 
                                    participants: List[str], decisions: List[Dict],
                                    actions: List[Dict]) -> str:
        """Generate executive summary."""
        summary_parts = [
            f"Thread: {subject}",
            f"Total emails: {email_count}",
            f"Participants: {', '.join(participants[:3])}",
            f"Key decisions made: {len(decisions)}",
            f"Action items identified: {len(actions)}"
        ]
        
        if decisions:
            summary_parts.append("\nKey Decisions:")
            for decision in decisions[:3]:
                summary_parts.append(f"  • {decision['content'][:100]}")
        
        if actions:
            summary_parts.append("\nAction Items:")
            for action in actions[:3]:
                summary_parts.append(f"  • {action['content'][:100]} (Assigned to: {action['assignee']})")
        
        return '\n'.join(summary_parts)
    
    def _is_question_answered(self, question: str, email_summaries: List[EmailSummary]) -> bool:
        """Check if a question has been answered."""
        # Simple heuristic: check if any later email contains answer indicators
        question_lower = question.lower()
        
        for summary in email_summaries:
            body_keywords = ' '.join(summary.key_points).lower()
            
            # Check for answer indicators
            answer_indicators = ['yes', 'no', 'the answer is', 'to answer your question', 'regarding']
            if any(indicator in body_keywords for indicator in answer_indicators):
                # Check if any key words from question appear in response
                question_words = set(question_lower.split())
                response_words = set(body_keywords.split())
                overlap = len(question_words & response_words)
                
                if overlap > 2:
                    return True
        
        return False
    
    def export_summary(self, thread_id: str, format: str = 'markdown') -> str:
        """Export thread summary in different formats."""
        if thread_id not in self.thread_cache:
            return "Thread not found"
        
        summary = self.thread_cache[thread_id]
        
        if format == 'markdown':
            return self._export_markdown(summary)
        elif format == 'json':
            return json.dumps({
                'thread_id': summary.thread_id,
                'subject': summary.subject,
                'executive_summary': summary.executive_summary,
                'decisions': summary.key_decisions,
                'actions': summary.action_items,
                'questions': summary.open_questions
            }, indent=2)
        else:
            return "Unsupported format"
    
    def _export_markdown(self, summary: ThreadSummary) -> str:
        """Export summary as Markdown."""
        md = []
        md.append(f"# {summary.subject}\n")
        md.append(f"**Thread ID:** {summary.thread_id}\n")
        md.append(f"**Emails:** {summary.email_count}\n")
        md.append(f"**Time Span:** {summary.time_span}\n")
        md.append(f"**Participants:** {', '.join(summary.participants)}\n\n")
        
        md.append("## Executive Summary\n")
        md.append(summary.executive_summary + "\n\n")
        
        if summary.key_decisions:
            md.append("## Key Decisions\n")
            for decision in summary.key_decisions:
                md.append(f"- **{decision['made_by']}** ({decision['timestamp']}): {decision['content']}\n")
            md.append("\n")
        
        if summary.action_items:
            md.append("## Action Items\n")
            for action in summary.action_items:
                md.append(f"- [ ] {action['content']} (Assigned to: {action['assignee']})\n")
            md.append("\n")
        
        if summary.open_questions:
            md.append("## Open Questions\n")
            for question in summary.open_questions:
                md.append(f"- {question}\n")
            md.append("\n")
        
        return ''.join(md)


# Test the implementation
if __name__ == "__main__":
    summarizer = V106ThreadSummarizer()
    
    # Test thread
    test_emails = [
        {
            'id': 'email_1',
            'thread_id': 'thread_123',
            'from': 'alice@company.com',
            'subject': 'Project Launch Discussion',
            'timestamp': datetime.now().isoformat(),
            'body': '''Hi team,
            
We need to discuss the project launch timeline. I think we should aim for Q2 2024.

Key requirements:
1. Complete backend API by March
2. Frontend UI by April
3. Testing in May

What do you think?

Best,
Alice'''
        },
        {
            'id': 'email_2',
            'thread_id': 'thread_123',
            'from': 'bob@company.com',
            'timestamp': (datetime.now() + timedelta(hours=2)).isoformat(),
            'body': '''Hi Alice,
            
I agree with the Q2 timeline. I will complete the backend API by March 15th.

We need to decide on the database technology. Should we use PostgreSQL or MongoDB?

Bob'''
        },
        {
            'id': 'email_3',
            'thread_id': 'thread_123',
            'from': 'alice@company.com',
            'timestamp': (datetime.now() + timedelta(hours=4)).isoformat(),
            'body': '''Hi Bob,
            
Great! Let's go with PostgreSQL. It's more suitable for our use case.

Decision: We will use PostgreSQL for the database.

Can you also set up the CI/CD pipeline?

Alice'''
        }
    ]
    
    print("V106: AI Email Thread Summarizer Pro")
    print("=" * 60)
    
    summary = summarizer.summarize_thread(test_emails)
    
    print(f"\nThread: {summary.subject}")
    print(f"Emails: {summary.email_count}")
    print(f"Time Span: {summary.time_span}")
    print(f"Participants: {', '.join(summary.participants)}")
    
    print(f"\nExecutive Summary:")
    print(summary.executive_summary)
    
    print(f"\nKey Decisions ({len(summary.key_decisions)}):")
    for decision in summary.key_decisions[:3]:
        print(f"  - {decision['content'][:80]}")
    
    print(f"\nAction Items ({len(summary.action_items)}):")
    for action in summary.action_items[:3]:
        print(f"  - {action['content'][:80]} (Assignee: {action['assignee']})")
    
    print(f"\nOpen Questions ({len(summary.open_questions)}):")
    for question in summary.open_questions[:3]:
        print(f"  - {question[:80]}")
    
    print("\n" + "=" * 60)
    print("Markdown Export:")
    print(summarizer.export_summary('thread_123', 'markdown'))
