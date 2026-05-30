#!/usr/bin/env python3
"""
V197 - AI Email Knowledge Distiller
Extracts key knowledge from email threads (decisions, facts, commitments),
builds searchable knowledge base, identifies knowledge gaps, creates executive summaries,
and links related emails across different threads.
"""

import json
import re
from datetime import datetime
from typing import Dict, List, Any
from collections import defaultdict
import hashlib


class KnowledgeDistiller:
    """AI-powered knowledge extraction from email threads."""
    
    def __init__(self):
        self.knowledge_base = defaultdict(list)
        self.email_links = defaultdict(list)
        self.knowledge_gaps = []
    
    def distill_knowledge(self, email: Dict[str, Any], thread_context: Dict = None) -> Dict[str, Any]:
        """Extract and distill knowledge from email."""
        if not email:
            return {'error': 'No email provided'}
        
        thread_context = thread_context or {}
        body = email.get('body', '')
        subject = email.get('subject', '')
        sender = email.get('from', '')
        
        # Extract key knowledge elements
        decisions = self._extract_decisions(body)
        facts = self._extract_facts(body)
        commitments = self._extract_commitments(body)
        action_items = self._extract_action_items(body)
        questions = self._extract_questions(body)
        
        # Build knowledge entry
        knowledge_entry = self._build_knowledge_entry(
            email, decisions, facts, commitments, action_items, questions
        )
        
        # Store in knowledge base
        self._store_knowledge(knowledge_entry)
        
        # Identify knowledge gaps
        gaps = self._identify_knowledge_gaps(knowledge_entry, thread_context)
        
        # Create executive summary
        summary = self._create_executive_summary(knowledge_entry)
        
        # Link related emails
        related = self._find_related_emails(knowledge_entry)
        
        # Generate search metadata
        metadata = self._generate_search_metadata(knowledge_entry)
        
        return {
            'analysis_id': f"knowledge_{datetime.now().strftime('%Y%m%d%H%M%S')}",
            'timestamp': datetime.now().isoformat(),
            'knowledge_entry': knowledge_entry,
            'decisions': decisions,
            'facts': facts,
            'commitments': commitments,
            'action_items': action_items,
            'questions': questions,
            'knowledge_gaps': gaps,
            'executive_summary': summary,
            'related_emails': related,
            'search_metadata': metadata,
            'reply_all_strategy': self._determine_reply_all_strategy(knowledge_entry)
        }
    
    def _extract_decisions(self, body: str) -> List[Dict[str, Any]]:
        """Extract decisions from email body."""
        decisions = []
        
        decision_patterns = [
            r'(?:we\'ve decided|decision:|we will|we\'re going to)\s+([^.]+)',
            r'(?:approved|agreed|confirmed)[:\s]+([^.]+)',
            r'(?:the plan is|we\'ll proceed with)\s+([^.]+)'
        ]
        
        for pattern in decision_patterns:
            matches = re.finditer(pattern, body, re.IGNORECASE)
            for match in matches:
                decision_text = match.group(1).strip()
                if len(decision_text) > 10:
                    decisions.append({
                        'text': decision_text[:300],
                        'confidence': 0.9,
                        'type': 'explicit'
                    })
        
        # Look for implicit decisions
        implicit_patterns = [
            r'(?:let\'s|we should)\s+([^.]+)',
            r'(?:I think we should|my recommendation is)\s+([^.]+)'
        ]
        
        for pattern in implicit_patterns:
            matches = re.finditer(pattern, body, re.IGNORECASE)
            for match in matches:
                decision_text = match.group(1).strip()
                if len(decision_text) > 10:
                    decisions.append({
                        'text': decision_text[:300],
                        'confidence': 0.6,
                        'type': 'implicit'
                    })
        
        return decisions[:10]
    
    def _extract_facts(self, body: str) -> List[Dict[str, Any]]:
        """Extract factual statements from email body."""
        facts = []
        
        # Look for specific data points
        fact_patterns = [
            # Dates and deadlines
            (r'(?:deadline|due date|delivery date)[:\s]+([^.]+)', 'deadline'),
            # Numbers and metrics
            (r'(?:\d+(?:\.\d+)?%|\$\d+(?:,\d{3})*(?:\.\d{2})?)\s+([^.]+)', 'metric'),
            # Specific information
            (r'(?:the|this|that)\s+(\w+\s+\w+\s+\w+[^.]+)', 'information')
        ]
        
        for pattern, fact_type in fact_patterns:
            matches = re.finditer(pattern, body, re.IGNORECASE)
            for match in matches:
                fact_text = match.group(0).strip()
                if len(fact_text) > 10 and len(fact_text) < 300:
                    facts.append({
                        'text': fact_text,
                        'type': fact_type,
                        'confidence': 0.8
                    })
        
        # Look for statements of fact
        fact_indicators = ['is', 'are', 'was', 'were', 'has been', 'will be']
        sentences = re.split(r'[.!?]+', body)
        
        for sentence in sentences:
            sentence = sentence.strip()
            if any(indicator in sentence.lower() for indicator in fact_indicators):
                if len(sentence) > 20 and len(sentence) < 300:
                    # Avoid questions and uncertain statements
                    if '?' not in sentence and not any(word in sentence.lower() for word in ['maybe', 'perhaps', 'might', 'could']):
                        facts.append({
                            'text': sentence,
                            'type': 'statement',
                            'confidence': 0.7
                        })
        
        return facts[:15]
    
    def _extract_commitments(self, body: str) -> List[Dict[str, Any]]:
        """Extract commitments and promises."""
        commitments = []
        
        commitment_patterns = [
            r'(?:I will|I\'ll|we will|we\'ll)\s+([^.]+)',
            r'(?:I promise|I commit to|we commit to)\s+([^.]+)',
            r'(?:expect|expecting)\s+([^.]+)',
            r'(?:responsible for|ownership of)\s+([^.]+)'
        ]
        
        for pattern in commitment_patterns:
            matches = re.finditer(pattern, body, re.IGNORECASE)
            for match in matches:
                commitment_text = match.group(1).strip()
                if len(commitment_text) > 10:
                    commitments.append({
                        'text': commitment_text[:300],
                        'confidence': 0.9,
                        'type': 'explicit'
                    })
        
        # Look for deadline commitments
        deadline_patterns = [
            r'(?:by|before|no later than)\s+(\w+day|\d{1,2}/\d{1,2})[^.]*',
            r'(?:will|shall)\s+([^.]+by\s+\w+day[^.]*)'
        ]
        
        for pattern in deadline_patterns:
            matches = re.finditer(pattern, body, re.IGNORECASE)
            for match in matches:
                commitment_text = match.group(0).strip()
                if len(commitment_text) > 10:
                    commitments.append({
                        'text': commitment_text[:300],
                        'confidence': 0.85,
                        'type': 'deadline',
                        'deadline': self._extract_deadline_date(commitment_text)
                    })
        
        return commitments[:10]
    
    def _extract_deadline_date(self, text: str) -> str:
        """Extract deadline date from text."""
        date_patterns = [
            r'(\w+day)',
            r'(\d{1,2}/\d{1,2})',
            r'(\d{1,2}-\d{1,2})'
        ]
        
        for pattern in date_patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                return match.group(1)
        
        return 'unspecified'
    
    def _extract_action_items(self, body: str) -> List[Dict[str, Any]]:
        """Extract action items and tasks."""
        action_items = []
        
        action_patterns = [
            r'(?:action item|task|todo|to-do)[:\s]+([^.]+)',
            r'(?:please|kindly)\s+([^.]+)',
            r'(?:need to|must|should)\s+([^.]+)',
            r'(?:@(\w+))\s+([^.]+)'
        ]
        
        for pattern in action_patterns:
            matches = re.finditer(pattern, body, re.IGNORECASE)
            for match in matches:
                groups = match.groups()
                if len(groups) == 2:
                    # @mention pattern
                    assignee = groups[0]
                    task = groups[1].strip()
                else:
                    assignee = 'unassigned'
                    task = groups[0].strip()
                
                if len(task) > 10:
                    action_items.append({
                        'task': task[:300],
                        'assignee': assignee,
                        'confidence': 0.85,
                        'status': 'pending'
                    })
        
        # Look for questions that imply action
        question_pattern = r'(?:can you|could you|would you)\s+([^.]+\?)'
        matches = re.finditer(question_pattern, body, re.IGNORECASE)
        for match in matches:
            task = match.group(1).strip().rstrip('?')
            if len(task) > 10:
                action_items.append({
                    'task': task[:300],
                    'assignee': 'requested',
                    'confidence': 0.75,
                    'status': 'pending'
                })
        
        return action_items[:15]
    
    def _extract_questions(self, body: str) -> List[Dict[str, Any]]:
        """Extract questions from email body."""
        questions = []
        
        # Direct questions
        question_pattern = r'([^.!?]+\?)'
        matches = re.finditer(question_pattern, body)
        
        for match in matches:
            question_text = match.group(1).strip()
            if len(question_text) > 10 and len(question_text) < 300:
                questions.append({
                    'text': question_text,
                    'confidence': 0.9,
                    'answered': False
                })
        
        return questions[:10]
    
    def _build_knowledge_entry(self, email: Dict, decisions: List, facts: List, 
                               commitments: List, action_items: List, questions: List) -> Dict[str, Any]:
        """Build comprehensive knowledge entry."""
        email_id = hashlib.md5(f"{email.get('from', '')}{email.get('subject', '')}{email.get('date', '')}".encode()).hexdigest()[:12]
        
        return {
            'entry_id': email_id,
            'timestamp': datetime.now().isoformat(),
            'email_date': email.get('date', ''),
            'sender': email.get('from', ''),
            'subject': email.get('subject', ''),
            'recipients': email.get('to', []) + email.get('cc', []),
            'decisions': decisions,
            'facts': facts,
            'commitments': commitments,
            'action_items': action_items,
            'questions': questions,
            'knowledge_density': self._calculate_knowledge_density(
                decisions, facts, commitments, action_items, questions
            ),
            'key_topics': self._extract_key_topics(email.get('subject', ''), email.get('body', ''))
        }
    
    def _calculate_knowledge_density(self, decisions: List, facts: List, 
                                     commitments: List, action_items: List, questions: List) -> Dict[str, Any]:
        """Calculate knowledge density score."""
        total_items = len(decisions) + len(facts) + len(commitments) + len(action_items) + len(questions)
        
        weights = {
            'decisions': len(decisions) * 3,
            'facts': len(facts) * 1,
            'commitments': len(commitments) * 2,
            'action_items': len(action_items) * 2,
            'questions': len(questions) * 1
        }
        
        weighted_score = sum(weights.values())
        
        if weighted_score >= 20:
            density = 'high'
        elif weighted_score >= 10:
            density = 'medium'
        else:
            density = 'low'
        
        return {
            'total_items': total_items,
            'weighted_score': weighted_score,
            'density_level': density,
            'breakdown': weights
        }
    
    def _extract_key_topics(self, subject: str, body: str) -> List[str]:
        """Extract key topics from email."""
        content = f"{subject} {body}".lower()
        
        # Remove common words
        stop_words = {'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 
                     'of', 'with', 'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been', 
                     'has', 'have', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 
                     'should', 'may', 'might', 'must', 'shall', 'can', 'this', 'that', 'these',
                     'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'what', 'which',
                     'who', 'when', 'where', 'why', 'how', 'all', 'each', 'every', 'both',
                     'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only',
                     'own', 'same', 'so', 'than', 'too', 'very', 'just', 'because', 'as', 'until'}
        
        words = re.findall(r'\b[a-z]{4,}\b', content)
        filtered_words = [w for w in words if w not in stop_words]
        
        # Count frequency
        word_freq = defaultdict(int)
        for word in filtered_words:
            word_freq[word] += 1
        
        # Get top topics
        sorted_topics = sorted(word_freq.items(), key=lambda x: x[1], reverse=True)
        
        return [topic for topic, count in sorted_topics[:10] if count >= 2]
    
    def _store_knowledge(self, entry: Dict):
        """Store knowledge entry in knowledge base."""
        sender = entry['sender']
        self.knowledge_base[sender].append(entry)
        
        # Keep only last 50 entries per sender
        if len(self.knowledge_base[sender]) > 50:
            self.knowledge_base[sender] = self.knowledge_base[sender][-50:]
    
    def _identify_knowledge_gaps(self, entry: Dict, thread_context: Dict) -> List[Dict[str, Any]]:
        """Identify knowledge gaps in the email."""
        gaps = []
        
        # Check for unanswered questions
        unanswered = [q for q in entry['questions'] if not q.get('answered')]
        if unanswered:
            gaps.append({
                'type': 'unanswered_questions',
                'count': len(unanswered),
                'severity': 'medium',
                'details': unanswered[:3]
            })
        
        # Check for missing information
        if not entry['decisions'] and any(word in entry['subject'].lower() for word in ['decision', 'decide', 'choose']):
            gaps.append({
                'type': 'missing_decision',
                'severity': 'high',
                'details': 'Email discusses decision but no decision recorded'
            })
        
        if not entry['action_items'] and any(word in entry['subject'].lower() for word in ['action', 'task', 'todo']):
            gaps.append({
                'type': 'missing_action_items',
                'severity': 'medium',
                'details': 'Email mentions actions but no specific items recorded'
            })
        
        # Check for vague commitments
        vague_commitments = [c for c in entry['commitments'] if 'deadline' not in c and 'by' not in c['text'].lower()]
        if vague_commitments:
            gaps.append({
                'type': 'vague_commitments',
                'count': len(vague_commitments),
                'severity': 'low',
                'details': 'Commitments without specific deadlines'
            })
        
        return gaps
    
    def _create_executive_summary(self, entry: Dict) -> Dict[str, Any]:
        """Create executive summary of knowledge entry."""
        summary_parts = []
        
        # Key decisions
        if entry['decisions']:
            decision_summary = f"{len(entry['decisions'])} decision(s) made"
            summary_parts.append(decision_summary)
        
        # Key commitments
        if entry['commitments']:
            commitment_summary = f"{len(entry['commitments'])} commitment(s) recorded"
            summary_parts.append(commitment_summary)
        
        # Action items
        if entry['action_items']:
            action_summary = f"{len(entry['action_items'])} action item(s) identified"
            summary_parts.append(action_summary)
        
        # Knowledge density
        density = entry['knowledge_density']
        summary_parts.append(f"Knowledge density: {density['density_level']}")
        
        # Key topics
        if entry['key_topics']:
            topics_str = ', '.join(entry['key_topics'][:3])
            summary_parts.append(f"Key topics: {topics_str}")
        
        # Generate one-line summary
        if entry['decisions']:
            one_line = f"Decision: {entry['decisions'][0]['text'][:100]}"
        elif entry['commitments']:
            one_line = f"Commitment: {entry['commitments'][0]['text'][:100]}"
        elif entry['action_items']:
            one_line = f"Action: {entry['action_items'][0]['task'][:100]}"
        else:
            one_line = f"Information: {entry['facts'][0]['text'][:100] if entry['facts'] else 'General update'}"
        
        return {
            'one_line_summary': one_line,
            'key_points': summary_parts,
            'total_items_extracted': density['total_items'],
            'knowledge_value': 'high' if density['weighted_score'] >= 15 else 'medium' if density['weighted_score'] >= 8 else 'low'
        }
    
    def _find_related_emails(self, entry: Dict) -> List[Dict[str, Any]]:
        """Find related emails based on topics and participants."""
        related = []
        
        sender = entry['sender']
        topics = entry['key_topics']
        
        # Search knowledge base for related entries
        for other_sender, entries in self.knowledge_base.items():
            for other_entry in entries[-10:]:  # Check last 10 entries
                if other_entry['entry_id'] == entry['entry_id']:
                    continue
                
                # Check topic overlap
                other_topics = other_entry['key_topics']
                overlap = set(topics) & set(other_topics)
                
                if len(overlap) >= 2:
                    related.append({
                        'entry_id': other_entry['entry_id'],
                        'subject': other_entry['subject'],
                        'date': other_entry['email_date'],
                        'sender': other_sender,
                        'topic_overlap': list(overlap),
                        'relevance_score': len(overlap) / max(len(topics), 1)
                    })
        
        # Sort by relevance
        related.sort(key=lambda x: x['relevance_score'], reverse=True)
        
        return related[:5]
    
    def _generate_search_metadata(self, entry: Dict) -> Dict[str, Any]:
        """Generate metadata for search functionality."""
        # Create searchable text
        searchable_text = ' '.join([
            entry['subject'],
            ' '.join([d['text'] for d in entry['decisions']]),
            ' '.join([f['text'] for f in entry['facts']]),
            ' '.join([c['text'] for c in entry['commitments']]),
            ' '.join([a['task'] for a in entry['action_items']]),
            ' '.join(entry['key_topics'])
        ])
        
        # Generate tags
        tags = entry['key_topics'] + [
            entry['knowledge_density']['density_level'],
            'email',
            'knowledge'
        ]
        
        if entry['decisions']:
            tags.append('decision')
        if entry['commitments']:
            tags.append('commitment')
        if entry['action_items']:
            tags.append('action')
        
        return {
            'searchable_text': searchable_text[:1000],
            'tags': list(set(tags))[:15],
            'participants': [entry['sender']] + entry['recipients'][:10],
            'date_range': {
                'start': entry['email_date'],
                'end': entry['timestamp']
            }
        }
    
    def _determine_reply_all_strategy(self, entry: Dict) -> Dict[str, Any]:
        """Determine reply-all strategy."""
        has_multiple_stakeholders = len(entry['recipients']) > 1
        has_decisions = len(entry['decisions']) > 0
        has_commitments = len(entry['commitments']) > 0
        
        return {
            'reply_all_recommended': has_multiple_stakeholders and (has_decisions or has_commitments),
            'reason': 'Decisions and commitments affect multiple stakeholders - keep all informed' if (has_decisions or has_commitments) else 'Informational update',
            'include_knowledge_summary': True,
            'highlight_action_items': len(entry['action_items']) > 0
        }


def distill_email_knowledge(email: Dict[str, Any], thread_context: Dict = None) -> Dict[str, Any]:
    """Main entry point for knowledge distillation."""
    distiller = KnowledgeDistiller()
    return distiller.distill_knowledge(email, thread_context)


if __name__ == '__main__':
    test_email = {
        'from': 'project.lead@company.com',
        'to': ['team@company.com'],
        'cc': ['stakeholder@company.com', 'manager@company.com'],
        'subject': 'Project Alpha - Key decisions and next steps',
        'body': '''Hi team,

Following our meeting, here are the key decisions and next steps:

**Decisions:**
We've decided to proceed with Option B for the database migration. The timeline is approved for Q2 delivery.

**Commitments:**
I will prepare the technical architecture document by Friday. @John will handle the security review before March 15th. We commit to delivering the MVP by April 30th.

**Action Items:**
- Task: Set up development environment
- @Sarah please coordinate with DevOps team
- Need to finalize budget approval from finance

**Key Facts:**
The budget is $150,000 for this phase. We have 8 developers assigned. The deadline is April 30th with no extensions possible.

**Questions:**
Can we get additional QA resources? What's the backup plan if we hit blockers?

Let me know if I missed anything.

Best regards,
Project Lead''',
        'date': '2024-01-15T14:00:00'
    }
    
    result = distill_email_knowledge(test_email)
    print(json.dumps(result, indent=2))
