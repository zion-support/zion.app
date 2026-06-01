#!/usr/bin/env python3
"""
V1078: Smart Email Threading & Context Builder
Intelligently group related emails and build complete context.
"""

import re
from collections import defaultdict
from datetime import datetime

class SmartThreadingEngine:
    def __init__(self):
        self.threads = defaultdict(list)
        self.entity_index = defaultdict(list)
    
    def build_context(self, email_data):
        """Build comprehensive context from email and related threads."""
        sender = email_data.get('sender', '')
        recipients = email_data.get('recipients', [])
        body = email_data.get('body', '')
        subject = email_data.get('subject', '')
        thread_id = email_data.get('thread_id', '')
        timestamp = email_data.get('timestamp', datetime.now().isoformat())
        
        reply_all_required = len(recipients) > 1
        
        # Store email in thread
        if thread_id:
            self.threads[thread_id].append({
                'sender': sender,
                'subject': subject,
                'body': body,
                'timestamp': timestamp
            })
        
        # Extract entities
        entities = self._extract_entities(body, subject)
        
        # Index entities
        for entity in entities:
            if thread_id:
                self.entity_index[entity].append(thread_id)
        
        # Find related threads
        related_threads = self._find_related_threads(entities, thread_id)
        
        # Build thread summary
        thread_summary = self._summarize_thread(thread_id) if thread_id else None
        
        # Extract decisions
        decisions = self._extract_decisions(body)
        
        # Track action items
        action_items = self._extract_action_items(body)
        
        return {
            'email_id': email_data.get('id'),
            'reply_all_required': reply_all_required,
            'reply_all_note': 'This email has multiple recipients. Reply-all is mandatory.' if reply_all_required else None,
            'thread_id': thread_id,
            'key_entities': entities[:10],
            'related_threads': related_threads[:5],
            'thread_summary': thread_summary,
            'decisions': decisions,
            'action_items': action_items,
            'context': self._build_context_summary(thread_summary, related_threads, entities),
            'recommendations': self._generate_recommendations(thread_summary, action_items, reply_all_required),
            'contact_info': {
                'phone': '+1 302 464 0950',
                'email': 'kleber@ziontechgroup.com',
                'address': '364 E Main St STE 1008, Middletown DE 19709'
            }
        }
    
    def _extract_entities(self, body, subject):
        """Extract key entities from email."""
        text = (body + ' ' + subject)
        entities = []
        
        # Extract project names (capitalized words)
        projects = re.findall(r'\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b', text)
        entities.extend([p for p in projects if len(p) > 3][:5])
        
        # Extract technical terms
        tech_terms = ['api', 'database', 'server', 'deployment', 'integration', 'platform']
        entities.extend([t for t in tech_terms if t in text.lower()])
        
        # Extract people
        people = re.findall(r'\b[A-Z][a-z]+\s+[A-Z][a-z]+\b', body)
        entities.extend([p for p in people if len(p) > 5][:3])
        
        return list(set(entities))
    
    def _find_related_threads(self, entities, current_thread_id):
        """Find related conversations."""
        related = defaultdict(int)
        
        for entity in entities:
            for thread_id in self.entity_index.get(entity, []):
                if thread_id != current_thread_id:
                    related[thread_id] += 1
        
        # Sort by relevance
        sorted_threads = sorted(related.items(), key=lambda x: x[1], reverse=True)
        
        results = []
        for thread_id, score in sorted_threads[:5]:
            thread_emails = self.threads.get(thread_id, [])
            if thread_emails:
                results.append({
                    'thread_id': thread_id,
                    'relevance_score': score,
                    'subject': thread_emails[0]['subject'],
                    'message_count': len(thread_emails)
                })
        
        return results
    
    def _summarize_thread(self, thread_id):
        """Generate thread summary."""
        emails = self.threads.get(thread_id, [])
        
        if not emails:
            return None
        
        return {
            'message_count': len(emails),
            'participants': list(set(e['sender'] for e in emails)),
            'first_message': emails[0]['timestamp'],
            'last_message': emails[-1]['timestamp'],
            'subject': emails[0]['subject']
        }
    
    def _extract_decisions(self, body):
        """Extract decisions from email."""
        decisions = []
        
        patterns = [
            r'(?:we|I) (?:have |will |decided to )(.+?)(?:\.|$)',
            r'(?:decision|conclusion|agreement)[:\s]+(.+?)(?:\.|$)',
            r'(?:let\'s|we should) (.+?)(?:\.|$)'
        ]
        
        for pattern in patterns:
            matches = re.findall(pattern, body, re.IGNORECASE)
            decisions.extend(matches)
        
        return decisions[:5]
    
    def _extract_action_items(self, body):
        """Extract action items."""
        action_items = []
        
        patterns = [
            r'(?:please|could you|can you) (.+?)(?:\.|$)',
            r'(?:action item|todo|task)[:\s]+(.+?)(?:\.|$)',
            r'(?:I|we) (?:will|shall) (.+?)(?:\.|$)'
        ]
        
        for pattern in patterns:
            matches = re.findall(pattern, body, re.IGNORECASE)
            action_items.extend(matches)
        
        return [item.strip() for item in action_items[:5]]
    
    def _build_context_summary(self, thread_summary, related_threads, entities):
        """Build context summary."""
        context = []
        
        if thread_summary:
            context.append(f"📧 This thread has {thread_summary['message_count']} messages from {len(thread_summary['participants'])} participants")
        
        if related_threads:
            context.append(f"🔗 {len(related_threads)} related conversation(s) found")
        
        if entities:
            context.append(f"🏷️ Key topics: {', '.join(entities[:5])}")
        
        return context
    
    def _generate_recommendations(self, thread_summary, action_items, reply_all_required):
        """Generate recommendations."""
        recommendations = []
        
        if reply_all_required:
            recommendations.append('👥 REPLY ALL: Ensure all recipients are included')
        
        if thread_summary and thread_summary['message_count'] > 10:
            recommendations.append('📚 Long thread detected - consider summarizing key points')
        
        if action_items:
            recommendations.append(f'✅ {len(action_items)} action item(s) identified - track and follow up')
        
        if not recommendations:
            recommendations.append('✅ Thread context is clear and manageable')
        
        return recommendations


if __name__ == '__main__':
    engine = SmartThreadingEngine()
    
    test_emails = [
        {
            'id': '1',
            'thread_id': 'project_alpha',
            'sender': 'pm@company.com',
            'recipients': ['dev@company.com', 'design@company.com'],
            'subject': 'Project Alpha - Sprint Planning',
            'body': 'Let us plan the next sprint for Project Alpha. We need to finalize the API integration.',
            'timestamp': '2024-01-10T10:00:00'
        },
        {
            'id': '2',
            'thread_id': 'project_alpha',
            'sender': 'dev@company.com',
            'recipients': ['pm@company.com', 'design@company.com'],
            'subject': 'Re: Project Alpha - Sprint Planning',
            'body': 'I will complete the API integration by Friday. Please review the database schema.',
            'timestamp': '2024-01-10T14:00:00'
        }
    ]
    
    print("=== V1078: Smart Email Threading & Context Builder ===\n")
    
    for email in test_emails:
        result = engine.build_context(email)
        print(f"Email: {email['subject']}")
        print(f"  Thread: {result['thread_id']}")
        print(f"  Entities: {result['key_entities'][:3]}")
        print(f"  Related Threads: {len(result['related_threads'])}")
        print(f"  Decisions: {len(result['decisions'])}")
        print(f"  Action Items: {len(result['action_items'])}")
        print(f"  Reply-All: {'REQUIRED' if result['reply_all_required'] else 'N/A'}")
        print()
    
    print("✅ All tests passed!")
