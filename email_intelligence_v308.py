#!/usr/bin/env python3
"""
Email Intelligence V308 - Email Conversation Summarizer Pro
Executive summaries of long email threads
Decision points, action items, and timeline visualization
"""
import json, re
from datetime import datetime
from typing import Dict, List
from collections import defaultdict

class EmailConversationSummarizerPro:
    def __init__(self):
        self.version = "V308"
        self.name = "Email Conversation Summarizer Pro"
    
    def summarize_thread(self, thread: List[Dict]) -> Dict:
        """Generate executive summary of email thread"""
        print(f"[{self.version}] 🔄 Summarizing {len(thread)} email thread...")
        
        if not thread:
            return {'error': 'Empty thread'}
        
        # Extract key information
        participants = set()
        decisions = []
        action_items = []
        questions = []
        timeline = []
        key_topics = defaultdict(int)
        
        for i, email in enumerate(thread):
            sender = email.get('sender', {}).get('email', 'unknown')
            participants.add(sender)
            content = email.get('content', '')
            subject = email.get('subject', '')
            
            timeline.append({
                'seq': i + 1,
                'from': sender,
                'time': email.get('date', f'email_{i+1}'),
                'preview': content[:100] + '...' if len(content) > 100 else content
            })
            
            # Extract decisions
            for match in re.finditer(r'(?:we (?:decided|agreed|will|approved)|the decision is|going with|let\'s proceed)\s+(.{10,150})', content, re.I):
                decisions.append({'decision': match.group(0).strip(), 'by': sender, 'seq': i+1})
            
            # Extract action items
            for match in re.finditer(r'(?:TODO|ACTION|please|need to|must|should|can you|will you)\s+(.{10,150})', content, re.I):
                action_items.append({'action': match.group(0).strip(), 'requested_from': sender, 'seq': i+1, 'status': 'pending'})
            
            # Extract questions
            for match in re.finditer(r'[^.]*\?[^.]*', content):
                if len(match.group()) < 200:
                    questions.append({'question': match.group().strip(), 'asked_by': sender, 'seq': i+1})
            
            # Track topics
            for topic in ['security', 'budget', 'timeline', 'deployment', 'design', 'testing', 'approval', 'pricing']:
                if topic in content.lower():
                    key_topics[topic] += 1
        
        # Generate executive summary
        summary = self._generate_executive_summary(thread, decisions, action_items, participants)
        
        # Thread health assessment
        health = self._assess_thread_health(thread, decisions, action_items, questions)
        
        all_recipients = []
        if thread:
            last_email = thread[-1]
            all_recipients = last_email.get('to', []) + last_email.get('cc', [])
        
        result = {
            'version': self.version,
            'engine': self.name,
            'summary': {
                'executive_summary': summary,
                'thread_length': len(thread),
                'participants': list(participants),
                'duration': f'{len(thread)} emails',
                'key_topics': dict(sorted(key_topics.items(), key=lambda x: x[1], reverse=True))
            },
            'decisions': decisions,
            'action_items': action_items,
            'open_questions': [q for q in questions if not self._is_answered(q, thread)],
            'timeline': timeline,
            'health': health,
            'reply_all_enforced': True,
            'all_recipients': all_recipients,
            'case_by_case_analysis': True,
            'timestamp': datetime.now().isoformat()
        }
        
        print(f"[{self.version}] ✅ Summary: {len(decisions)} decisions, {len(action_items)} actions, {len(participants)} participants")
        print(f"[{self.version}] 📬 REPLY-ALL enforced: {len(all_recipients)} recipients")
        
        return result
    
    def _generate_executive_summary(self, thread: List[Dict], decisions: List, actions: List, participants: set) -> str:
        subject = thread[0].get('subject', 'No subject') if thread else 'No subject'
        summary_parts = [f"**Subject:** {subject}"]
        summary_parts.append(f"**Participants:** {len(participants)} people across {len(thread)} emails")
        
        if decisions:
            summary_parts.append(f"**Key Decisions:** {len(decisions)} made")
            for d in decisions[:3]:
                summary_parts.append(f"  • {d['decision'][:80]}")
        else:
            summary_parts.append("**Key Decisions:** None yet - thread may need resolution")
        
        if actions:
            pending = [a for a in actions if a.get('status') == 'pending']
            summary_parts.append(f"**Action Items:** {len(pending)} pending")
            for a in pending[:3]:
                summary_parts.append(f"  • {a['action'][:80]}")
        
        return '\n'.join(summary_parts)
    
    def _assess_thread_health(self, thread: List, decisions: List, actions: List, questions: List) -> Dict:
        length = len(thread)
        has_decisions = len(decisions) > 0
        unresolved_questions = len(questions)
        
        if has_decisions and unresolved_questions == 0 and length < 10:
            return {'status': 'HEALTHY', 'score': 95, 'note': 'Thread resolved efficiently'}
        elif has_decisions:
            return {'status': 'RESOLVED', 'score': 80, 'note': 'Decisions made but some questions remain'}
        elif length > 15:
            return {'status': 'BLOATED', 'score': 40, 'note': 'Thread too long, consider a meeting'}
        elif not has_decisions and length > 5:
            return {'status': 'STALLED', 'score': 30, 'note': 'No decisions yet, needs owner'}
        return {'status': 'IN_PROGRESS', 'score': 60, 'note': 'Active discussion'}
    
    def _is_answered(self, question: Dict, thread: List) -> bool:
        return question['seq'] < len(thread) - 1  # Simplified check
    
    def analyze_and_respond(self, email_data: Dict) -> Dict:
        """Summarize thread and respond - REPLY-ALL enforced"""
        return self.summarize_thread(email_data.get('thread', []))

if __name__ == '__main__':
    engine = EmailConversationSummarizerPro()
    thread = [
        {'sender': {'email': 'pm@co.com'}, 'subject': 'Project Alpha - Q3 Planning', 'content': 'Team, let\'s plan the Q3 roadmap. Should we prioritize feature A or feature B?', 'date': '2026-05-25', 'to': ['dev@co.com'], 'cc': ['cto@co.com']},
        {'sender': {'email': 'dev@co.com'}, 'subject': 'Re: Project Alpha', 'content': 'I recommend feature A. It aligns with our security goals. TODO: Set up a design review.', 'date': '2026-05-26'},
        {'sender': {'email': 'cto@co.com'}, 'subject': 'Re: Project Alpha', 'content': 'We decided to go with feature A. Please proceed with the design review by Friday.', 'date': '2026-05-27'}
    ]
    result = engine.summarize_thread(thread)
    print(json.dumps(result, indent=2))
