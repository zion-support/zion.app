#!/usr/bin/env python3
"""
V104: AI Email Context Memory System
Persistent memory of all email conversations with cross-thread context linking,
relationship history tracking, commitment tracking, and automatic context injection.
"""

import json
import re
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple, Set
from dataclasses import dataclass, field
from enum import Enum
from collections import defaultdict


class ContextType(Enum):
    DECISION = "decision"
    COMMITMENT = "commitment"
    QUESTION = "question"
    ANSWER = "answer"
    PREFERENCE = "preference"
    FACT = "fact"
    CONCERN = "concern"
    AGREEMENT = "agreement"
    DEADLINE = "deadline"
    REFERENCE = "reference"


class RelationshipStage(Enum):
    PROSPECT = "prospect"
    ACTIVE = "active"
    ESTABLISHED = "established"
    LONG_TERM = "long_term"
    AT_RISK = "at_risk"
    DORMANT = "dormant"


@dataclass
class ContextEntry:
    entry_id: str
    email_id: str
    thread_id: str
    sender: str
    timestamp: datetime
    context_type: ContextType
    content: str
    entities: List[str] = field(default_factory=list)
    importance_score: float = 0.5
    expires_at: Optional[datetime] = None
    fulfilled: bool = False


@dataclass
class RelationshipContext:
    sender: str
    stage: RelationshipStage
    first_contact: datetime
    last_contact: datetime
    total_emails: int
    threads: List[str] = field(default_factory=list)
    commitments_made: List[Dict] = field(default_factory=list)
    commitments_received: List[Dict] = field(default_factory=list)
    preferences: Dict = field(default_factory=dict)
    key_facts: List[str] = field(default_factory=list)
    concerns_raised: List[str] = field(default_factory=list)
    decisions_made: List[Dict] = field(default_factory=list)


@dataclass
class ThreadContext:
    thread_id: str
    participants: List[str]
    subject: str
    start_time: datetime
    last_activity: datetime
    email_count: int
    context_entries: List[ContextEntry] = field(default_factory=list)
    unresolved_questions: List[str] = field(default_factory=list)
    pending_commitments: List[Dict] = field(default_factory=list)
    key_decisions: List[Dict] = field(default_factory=list)
    related_threads: List[str] = field(default_factory=list)


class V104ContextMemorySystem:
    """
    V104: AI Email Context Memory System
    
    Features:
    1. Persistent memory of all email conversations
    2. Cross-thread context linking
    3. Relationship history tracking
    4. Commitment and promise tracking
    5. Automatic context injection into responses
    6. Unresolved question tracking
    7. Preference and fact extraction
    """
    
    def __init__(self):
        self.context_entries: Dict[str, ContextEntry] = {}
        self.relationships: Dict[str, RelationshipContext] = {}
        self.threads: Dict[str, ThreadContext] = {}
        self.email_index: Dict[str, Dict] = {}
        
        # Patterns for context extraction
        self.commitment_patterns = [
            r"(?:I will|I'll|we will|we'll|I promise|I commit to)\s+(.+?)(?:\.|$)",
            r"(?:will send|will provide|will deliver|will schedule)\s+(.+?)(?:\.|$)",
            r"(?:let me|I'll)\s+(?:check|verify|confirm|get back to you)\s+(?:on|about)?\s*(.+?)(?:\.|$)",
        ]
        
        self.question_patterns = [
            r"(.+?\?)",
            r"(?:can you|could you|would you|will you)\s+(.+?)\?",
            r"(?:what|when|where|who|why|how)\s+(.+?)\?",
        ]
        
        self.preference_patterns = [
            r"(?:I prefer|I like|I want|I need)\s+(.+?)(?:\.|$)",
            r"(?:my preference is|I'd rather)\s+(.+?)(?:\.|$)",
        ]
        
        self.deadline_patterns = [
            r"(?:by|before|due|deadline)\s+(.+?)(?:\.|$)",
            r"(?:need|need this|need it)\s+(?:by|before)\s+(.+?)(?:\.|$)",
        ]
    
    def process_email(self, email_data: Dict) -> Dict:
        """Process email and extract/store context."""
        email_id = email_data.get('id', 'unknown')
        thread_id = email_data.get('thread_id', email_id)
        sender = email_data.get('from', 'unknown')
        body = email_data.get('body', '')
        subject = email_data.get('subject', '')
        timestamp = datetime.fromisoformat(email_data.get('timestamp', datetime.now().isoformat()))
        
        # Store email in index
        self.email_index[email_id] = email_data
        
        # Get or create thread context
        if thread_id not in self.threads:
            self.threads[thread_id] = ThreadContext(
                thread_id=thread_id,
                participants=[sender],
                subject=subject,
                start_time=timestamp,
                last_activity=timestamp,
                email_count=0
            )
        
        thread = self.threads[thread_id]
        thread.email_count += 1
        thread.last_activity = timestamp
        
        if sender not in thread.participants:
            thread.participants.append(sender)
        
        # Get or create relationship context
        if sender not in self.relationships:
            self.relationships[sender] = RelationshipContext(
                sender=sender,
                stage=RelationshipStage.PROSPECT,
                first_contact=timestamp,
                last_contact=timestamp,
                total_emails=0
            )
        
        relationship = self.relationships[sender]
        relationship.total_emails += 1
        relationship.last_contact = timestamp
        
        if thread_id not in relationship.threads:
            relationship.threads.append(thread_id)
        
        # Update relationship stage
        self._update_relationship_stage(relationship)
        
        # Extract context entries
        context_entries = self._extract_context(email_id, thread_id, sender, body, timestamp)
        
        # Store context entries
        for entry in context_entries:
            self.context_entries[entry.entry_id] = entry
            thread.context_entries.append(entry)
            
            # Update relationship based on context type
            self._update_relationship_from_context(relationship, entry)
        
        # Find related threads
        related = self._find_related_threads(thread_id, sender, body)
        thread.related_threads = related
        
        # Generate context summary for response
        context_summary = self._generate_context_summary(sender, thread_id)
        
        return {
            'email_id': email_id,
            'thread_id': thread_id,
            'context_entries_extracted': len(context_entries),
            'relationship_stage': relationship.stage.value,
            'thread_email_count': thread.email_count,
            'related_threads': len(related),
            'context_summary': context_summary
        }
    
    def _extract_context(self, email_id: str, thread_id: str, sender: str, 
                        body: str, timestamp: datetime) -> List[ContextEntry]:
        """Extract context entries from email body."""
        entries = []
        
        # Extract commitments
        for pattern in self.commitment_patterns:
            matches = re.finditer(pattern, body, re.IGNORECASE)
            for match in matches:
                entry_id = f"commit_{email_id}_{len(entries)}"
                entries.append(ContextEntry(
                    entry_id=entry_id,
                    email_id=email_id,
                    thread_id=thread_id,
                    sender=sender,
                    timestamp=timestamp,
                    context_type=ContextType.COMMITMENT,
                    content=match.group(0),
                    importance_score=0.8
                ))
        
        # Extract questions
        for pattern in self.question_patterns:
            matches = re.finditer(pattern, body, re.IGNORECASE)
            for match in matches:
                entry_id = f"question_{email_id}_{len(entries)}"
                entries.append(ContextEntry(
                    entry_id=entry_id,
                    email_id=email_id,
                    thread_id=thread_id,
                    sender=sender,
                    timestamp=timestamp,
                    context_type=ContextType.QUESTION,
                    content=match.group(0),
                    importance_score=0.7
                ))
        
        # Extract preferences
        for pattern in self.preference_patterns:
            matches = re.finditer(pattern, body, re.IGNORECASE)
            for match in matches:
                entry_id = f"pref_{email_id}_{len(entries)}"
                entries.append(ContextEntry(
                    entry_id=entry_id,
                    email_id=email_id,
                    thread_id=thread_id,
                    sender=sender,
                    timestamp=timestamp,
                    context_type=ContextType.PREFERENCE,
                    content=match.group(0),
                    importance_score=0.6
                ))
        
        # Extract deadlines
        for pattern in self.deadline_patterns:
            matches = re.finditer(pattern, body, re.IGNORECASE)
            for match in matches:
                entry_id = f"deadline_{email_id}_{len(entries)}"
                entries.append(ContextEntry(
                    entry_id=entry_id,
                    email_id=email_id,
                    thread_id=thread_id,
                    sender=sender,
                    timestamp=timestamp,
                    context_type=ContextType.DEADLINE,
                    content=match.group(0),
                    importance_score=0.9
                ))
        
        return entries
    
    def _update_relationship_stage(self, relationship: RelationshipContext):
        """Update relationship stage based on activity."""
        days_since_first = (datetime.now() - relationship.first_contact).days
        days_since_last = (datetime.now() - relationship.last_contact).days
        
        if days_since_last > 90:
            relationship.stage = RelationshipStage.DORMANT
        elif relationship.total_emails > 50:
            relationship.stage = RelationshipStage.LONG_TERM
        elif relationship.total_emails > 20:
            relationship.stage = RelationshipStage.ESTABLISHED
        elif relationship.total_emails > 5:
            relationship.stage = RelationshipStage.ACTIVE
        else:
            relationship.stage = RelationshipStage.PROSPECT
    
    def _update_relationship_from_context(self, relationship: RelationshipContext, entry: ContextEntry):
        """Update relationship based on context entry."""
        if entry.context_type == ContextType.COMMITMENT:
            commitment = {
                'content': entry.content,
                'timestamp': entry.timestamp.isoformat(),
                'email_id': entry.email_id,
                'fulfilled': False
            }
            relationship.commitments_made.append(commitment)
        
        elif entry.context_type == ContextType.PREFERENCE:
            relationship.preferences[entry.content] = entry.timestamp.isoformat()
        
        elif entry.context_type == ContextType.CONCERN:
            relationship.concerns_raised.append({
                'content': entry.content,
                'timestamp': entry.timestamp.isoformat()
            })
        
        elif entry.context_type == ContextType.DECISION:
            relationship.decisions_made.append({
                'content': entry.content,
                'timestamp': entry.timestamp.isoformat()
            })
    
    def _find_related_threads(self, current_thread_id: str, sender: str, body: str) -> List[str]:
        """Find related threads based on sender and content similarity."""
        related = []
        
        # Get all threads for this sender
        if sender in self.relationships:
            sender_threads = self.relationships[sender].threads
            
            for thread_id in sender_threads:
                if thread_id != current_thread_id and thread_id in self.threads:
                    thread = self.threads[thread_id]
                    
                    # Check for subject similarity
                    current_subject = self.threads[current_thread_id].subject.lower()
                    thread_subject = thread.subject.lower()
                    
                    # Simple word overlap
                    current_words = set(current_subject.split())
                    thread_words = set(thread_subject.split())
                    overlap = len(current_words & thread_words)
                    
                    if overlap > 2:
                        related.append(thread_id)
        
        return related[:5]  # Limit to 5 related threads
    
    def _generate_context_summary(self, sender: str, thread_id: str) -> Dict:
        """Generate context summary for response."""
        summary = {
            'relationship_stage': 'unknown',
            'total_interactions': 0,
            'recent_commitments': [],
            'unresolved_questions': [],
            'preferences': [],
            'related_threads': []
        }
        
        if sender in self.relationships:
            rel = self.relationships[sender]
            summary['relationship_stage'] = rel.stage.value
            summary['total_interactions'] = rel.total_emails
            summary['preferences'] = list(rel.preferences.keys())[:5]
            
            # Recent commitments
            recent_commitments = [c for c in rel.commitments_made if not c.get('fulfilled', False)]
            summary['recent_commitments'] = [c['content'] for c in recent_commitments[-3:]]
        
        if thread_id in self.threads:
            thread = self.threads[thread_id]
            summary['unresolved_questions'] = thread.unresolved_questions[-3:]
            summary['related_threads'] = thread.related_threads
        
        return summary
    
    def get_relationship_profile(self, sender: str) -> Optional[Dict]:
        """Get comprehensive relationship profile."""
        if sender not in self.relationships:
            return None
        
        rel = self.relationships[sender]
        
        return {
            'sender': sender,
            'stage': rel.stage.value,
            'first_contact': rel.first_contact.isoformat(),
            'last_contact': rel.last_contact.isoformat(),
            'total_emails': rel.total_emails,
            'total_threads': len(rel.threads),
            'commitments_made': len(rel.commitments_made),
            'commitments_fulfilled': sum(1 for c in rel.commitments_made if c.get('fulfilled', False)),
            'preferences': rel.preferences,
            'concerns': [c['content'] for c in rel.concerns_raised],
            'decisions': [d['content'] for d in rel.decisions_made]
        }
    
    def get_thread_summary(self, thread_id: str) -> Optional[Dict]:
        """Get thread summary with context."""
        if thread_id not in self.threads:
            return None
        
        thread = self.threads[thread_id]
        
        return {
            'thread_id': thread_id,
            'subject': thread.subject,
            'participants': thread.participants,
            'email_count': thread.email_count,
            'start_time': thread.start_time.isoformat(),
            'last_activity': thread.last_activity.isoformat(),
            'context_entries': len(thread.context_entries),
            'unresolved_questions': thread.unresolved_questions,
            'pending_commitments': thread.pending_commitments,
            'key_decisions': thread.key_decisions,
            'related_threads': thread.related_threads
        }
    
    def get_memory_stats(self) -> Dict:
        """Get memory system statistics."""
        context_by_type = {}
        for entry in self.context_entries.values():
            ctx_type = entry.context_type.value
            context_by_type[ctx_type] = context_by_type.get(ctx_type, 0) + 1
        
        relationship_stages = {}
        for rel in self.relationships.values():
            stage = rel.stage.value
            relationship_stages[stage] = relationship_stages.get(stage, 0) + 1
        
        return {
            'total_context_entries': len(self.context_entries),
            'context_by_type': context_by_type,
            'total_relationships': len(self.relationships),
            'relationship_stages': relationship_stages,
            'total_threads': len(self.threads),
            'total_emails_indexed': len(self.email_index)
        }


# Test the implementation
if __name__ == "__main__":
    memory = V104ContextMemorySystem()
    
    # Test emails
    test_emails = [
        {
            'id': 'email_1',
            'thread_id': 'thread_abc',
            'from': 'client@example.com',
            'subject': 'Project Discussion',
            'timestamp': datetime.now().isoformat(),
            'body': '''Hi,
            
I prefer to use Python for this project. Can you send me the proposal by Friday?

I will review it over the weekend and get back to you on Monday.

What's the timeline for implementation?

Best regards,
Client'''
        },
        {
            'id': 'email_2',
            'thread_id': 'thread_abc',
            'from': 'client@example.com',
            'subject': 'Re: Project Discussion',
            'timestamp': (datetime.now() + timedelta(hours=2)).isoformat(),
            'body': '''Thanks for the quick response.
            
I'll provide the requirements document tomorrow. We need this completed by end of Q1.

Can you confirm the pricing structure?

Regards,
Client'''
        }
    ]
    
    print("V104: AI Email Context Memory System")
    print("=" * 60)
    
    for email in test_emails:
        result = memory.process_email(email)
        print(f"\nEmail: {email['id']}")
        print(f"  Context Entries: {result['context_entries_extracted']}")
        print(f"  Relationship Stage: {result['relationship_stage']}")
        print(f"  Thread Emails: {result['thread_email_count']}")
        print(f"  Related Threads: {result['related_threads']}")
    
    print("\n" + "=" * 60)
    print("Relationship Profile:")
    profile = memory.get_relationship_profile('client@example.com')
    if profile:
        print(json.dumps(profile, indent=2))
    
    print("\n" + "=" * 60)
    print("Thread Summary:")
    summary = memory.get_thread_summary('thread_abc')
    if summary:
        print(json.dumps(summary, indent=2))
    
    print("\n" + "=" * 60)
    print("Memory Stats:")
    stats = memory.get_memory_stats()
    print(json.dumps(stats, indent=2))
