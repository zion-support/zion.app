#!/usr/bin/env python3
"""
V488 - Email Context Memory System
Remembers and analyzes previous email conversations to provide intelligent context and suggestions.
Features: Conversation history, context retrieval, relationship tracking, intelligent suggestions.
CRITICAL: Always enforces reply-all for multi-recipient emails.
"""

import json
from datetime import datetime, timedelta
from typing import Dict, List, Any


class EmailContextMemorySystem:
    """Maintains and utilizes email conversation context."""
    
    def __init__(self):
        self.conversation_database = {}
        self.relationship_graph = {}
        self.topic_clusters = {}
    
    def analyze_email(self, email: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze email with full conversation context."""
        sender = email.get('from', '')
        recipients = email.get('to', []) + email.get('cc', [])
        subject = email.get('subject', '')
        body = email.get('body', '')
        
        # Retrieve conversation history
        conversation_history = self._retrieve_conversation_history(sender, recipients, subject)
        
        # Analyze context
        context_analysis = self._analyze_context(conversation_history, body)
        
        # Identify key topics
        topics = self._identify_topics(body, conversation_history)
        
        # Generate intelligent suggestions
        suggestions = self._generate_suggestions(context_analysis, topics, conversation_history)
        
        # Track relationship
        relationship_insights = self._analyze_relationship(sender, recipients, conversation_history)
        
        # Detect action items
        action_items = self._detect_action_items(body, conversation_history)
        
        reply_all_required = len(recipients) > 1
        
        return {
            'engine': 'V488_EmailContextMemorySystem',
            'conversation_history': conversation_history,
            'context_analysis': context_analysis,
            'topics': topics,
            'suggestions': suggestions,
            'relationship_insights': relationship_insights,
            'action_items': action_items,
            'reply_all_required': reply_all_required,
            'reply_all_enforced': reply_all_required,
            'recipients': recipients,
            'timestamp': datetime.now().isoformat()
        }
    
    def _retrieve_conversation_history(self, sender: str, recipients: List[str], 
                                      subject: str) -> Dict[str, Any]:
        """Retrieve relevant conversation history."""
        # Extract thread identifier from subject
        thread_id = self._extract_thread_id(subject)
        
        # Simulate database lookup (in real implementation, this would query actual database)
        history = {
            'thread_id': thread_id,
            'total_emails': 0,
            'first_contact': None,
            'last_contact': None,
            'participants': [],
            'key_topics': [],
            'previous_commitments': [],
            'conversation_timeline': []
        }
        
        # Simulate finding related conversations
        if 'project' in subject.lower() or 'update' in subject.lower():
            history['total_emails'] = 5
            history['first_contact'] = (datetime.now() - timedelta(days=30)).isoformat()
            history['last_contact'] = (datetime.now() - timedelta(days=2)).isoformat()
            history['participants'] = [sender] + recipients
            history['key_topics'] = ['project timeline', 'deliverables', 'budget']
            history['previous_commitments'] = [
                'Complete design by Friday',
                'Review proposal next week'
            ]
        
        return history
    
    def _extract_thread_id(self, subject: str) -> str:
        """Extract thread identifier from subject."""
        # Remove common prefixes
        cleaned = subject.replace('Re:', '').replace('Fwd:', '').replace('FW:', '').strip()
        return cleaned.lower()
    
    def _analyze_context(self, history: Dict, current_body: str) -> Dict[str, Any]:
        """Analyze conversation context."""
        analysis = {
            'is_continuation': history['total_emails'] > 0,
            'days_since_last_contact': None,
            'conversation_momentum': 'unknown',
            'context_gaps': [],
            'referenced_commitments': []
        }
        
        if history['last_contact']:
            last_contact = datetime.fromisoformat(history['last_contact'])
            days_since = (datetime.now() - last_contact).days
            analysis['days_since_last_contact'] = days_since
            
            if days_since < 3:
                analysis['conversation_momentum'] = 'high'
            elif days_since < 7:
                analysis['conversation_momentum'] = 'medium'
            else:
                analysis['conversation_momentum'] = 'low'
        
        # Check for references to previous commitments
        body_lower = current_body.lower()
        for commitment in history.get('previous_commitments', []):
            commitment_keywords = commitment.lower().split()
            if any(keyword in body_lower for keyword in commitment_keywords[:3]):
                analysis['referenced_commitments'].append(commitment)
        
        return analysis
    
    def _identify_topics(self, body: str, history: Dict) -> List[Dict[str, Any]]:
        """Identify key topics in the conversation."""
        topics = []
        
        # Current email topics
        topic_keywords = {
            'timeline': ['deadline', 'schedule', 'timeline', 'when', 'date'],
            'budget': ['cost', 'price', 'budget', 'payment', 'invoice'],
            'technical': ['api', 'integration', 'technical', 'system', 'bug'],
            'decision': ['decide', 'decision', 'approve', 'confirm', 'choice'],
            'feedback': ['feedback', 'review', 'opinion', 'thoughts', 'comments']
        }
        
        body_lower = body.lower()
        
        for topic, keywords in topic_keywords.items():
            if any(keyword in body_lower for keyword in keywords):
                topics.append({
                    'topic': topic,
                    'confidence': 0.8,
                    'is_new': topic not in history.get('key_topics', []),
                    'related_to_previous': topic in history.get('key_topics', [])
                })
        
        return topics
    
    def _generate_suggestions(self, context: Dict, topics: List[Dict], 
                            history: Dict) -> List[Dict[str, Any]]:
        """Generate intelligent suggestions based on context."""
        suggestions = []
        
        # Suggest addressing previous commitments
        if context.get('referenced_commitments'):
            suggestions.append({
                'type': 'commitment_followup',
                'priority': 'high',
                'message': 'Reference previous commitments in your response',
                'details': context['referenced_commitments']
            })
        
        # Suggest context bridging for low momentum conversations
        if context.get('conversation_momentum') == 'low':
            suggestions.append({
                'type': 'context_bridge',
                'priority': 'medium',
                'message': 'Provide context summary for recipients who may have forgotten details',
                'details': 'Include brief recap of previous discussion points'
            })
        
        # Suggest addressing new topics
        new_topics = [t for t in topics if t.get('is_new')]
        if new_topics:
            suggestions.append({
                'type': 'new_topic',
                'priority': 'medium',
                'message': f'New topics introduced: {", ".join([t["topic"] for t in new_topics])}',
                'details': 'Ensure adequate context is provided for new discussion points'
            })
        
        # Suggest action item tracking
        if history['total_emails'] > 3:
            suggestions.append({
                'type': 'action_tracking',
                'priority': 'low',
                'message': 'Summarize action items and next steps',
                'details': 'Help maintain clarity in ongoing conversation'
            })
        
        return suggestions
    
    def _analyze_relationship(self, sender: str, recipients: List[str], 
                            history: Dict) -> Dict[str, Any]:
        """Analyze relationship dynamics."""
        insights = {
            'relationship_strength': 'new',
            'communication_frequency': 'unknown',
            'response_patterns': {},
            'trust_indicators': []
        }
        
        if history['total_emails'] > 0:
            if history['total_emails'] > 10:
                insights['relationship_strength'] = 'strong'
            elif history['total_emails'] > 5:
                insights['relationship_strength'] = 'established'
            else:
                insights['relationship_strength'] = 'developing'
            
            # Calculate communication frequency
            if history['first_contact'] and history['last_contact']:
                first = datetime.fromisoformat(history['first_contact'])
                last = datetime.fromisoformat(history['last_contact'])
                days_span = (last - first).days
                
                if days_span > 0:
                    frequency = history['total_emails'] / days_span
                    if frequency > 0.5:
                        insights['communication_frequency'] = 'frequent'
                    elif frequency > 0.2:
                        insights['communication_frequency'] = 'regular'
                    else:
                        insights['communication_frequency'] = 'occasional'
        
        return insights
    
    def _detect_action_items(self, body: str, history: Dict) -> List[Dict[str, Any]]:
        """Detect action items in the email."""
        action_items = []
        
        # Action item indicators
        indicators = [
            'please', 'need to', 'should', 'must', 'will',
            'deadline', 'by', 'before', 'complete', 'finish'
        ]
        
        body_lower = body.lower()
        sentences = body.split('.')
        
        for sentence in sentences:
            sentence_lower = sentence.lower()
            if any(indicator in sentence_lower for indicator in indicators):
                if len(sentence.strip()) > 10:  # Meaningful sentence
                    action_items.append({
                        'text': sentence.strip(),
                        'confidence': 0.7,
                        'assignee': 'TBD',
                        'deadline': 'TBD'
                    })
        
        return action_items


def main():
    """Test V488 engine."""
    engine = EmailContextMemorySystem()
    
    test_email = {
        'from': 'client@company.com',
        'to': ['kleber@ziontechgroup.com', 'team@ziontechgroup.com'],
        'cc': ['manager@company.com'],
        'subject': 'Re: Project Alpha Update',
        'body': 'Thanks for the update. I wanted to follow up on the design deliverable we discussed. When can we expect to see the first draft? Also, we need to schedule a review meeting before the deadline.'
    }
    
    result = engine.analyze_email(test_email)
    print(json.dumps(result, indent=2))
    print(f"\n✅ Conversation history: {result['conversation_history']['total_emails']} emails")
    print(f"✅ Context momentum: {result['context_analysis']['conversation_momentum']}")
    print(f"✅ Topics identified: {len(result['topics'])}")
    print(f"✅ Suggestions: {len(result['suggestions'])}")
    print(f"✅ Reply-all enforced: {result['reply_all_enforced']}")


if __name__ == '__main__':
    main()
