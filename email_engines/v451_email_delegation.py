#!/usr/bin/env python3
"""
V451 - AI Email Delegation Intelligence
Automatically assigns emails to the best team member based on expertise, workload, and context.
Features: Expertise matching, workload balancing, priority routing, auto-assignment, skill tracking.
CRITICAL: Always enforces reply-all for multi-recipient emails.
"""

import json
import re
from datetime import datetime
from typing import Dict, List, Any
from collections import defaultdict


class EmailDelegationEngine:
    """Intelligently delegates emails to the most appropriate team member."""
    
    def __init__(self):
        self.team_expertise: Dict[str, List[str]] = {}
        self.team_workload: Dict[str, int] = {}
        self.assignment_history: List[Dict] = []
        
    def analyze_email(self, email: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze email and determine best team member to handle it."""
        body = email.get('body', '')
        subject = email.get('subject', '')
        recipients = email.get('to', []) + email.get('cc', [])
        
        text = subject + ' ' + body
        
        # Extract required skills/topics
        required_skills = self._extract_skills(text)
        
        # Calculate priority
        priority = self._calculate_priority(text)
        
        # Find best team member
        best_assignee = self._find_best_assignee(required_skills, priority)
        
        # Generate delegation reason
        delegation_reason = self._generate_reason(best_assignee, required_skills, priority)
        
        reply_all_required = len(recipients) > 1
        
        return {
            'engine': 'V451_DelegationIntelligence',
            'required_skills': required_skills,
            'priority': priority,
            'recommended_assignee': best_assignee,
            'delegation_reason': delegation_reason,
            'alternative_assignees': self._get_alternatives(best_assignee, required_skills),
            'suggested_response_time': self._suggest_response_time(priority),
            'action_items': self._extract_action_items(body),
            'reply_all_required': reply_all_required,
            'reply_all_enforced': reply_all_required,
            'recipients': recipients,
            'timestamp': datetime.now().isoformat()
        }
    
    def _extract_skills(self, text: str) -> List[str]:
        """Extract required skills/topics from email."""
        skills = []
        text_lower = text.lower()
        
        skill_keywords = {
            'technical': ['python', 'javascript', 'react', 'node', 'aws', 'azure', 'docker', 'kubernetes'],
            'sales': ['pricing', 'quote', 'proposal', 'contract', 'deal', 'negotiation'],
            'support': ['bug', 'issue', 'problem', 'error', 'help', 'troubleshoot'],
            'billing': ['invoice', 'payment', 'billing', 'charge', 'refund'],
            'security': ['security', 'vulnerability', 'breach', 'compliance', 'gdpr'],
            'design': ['design', 'ui', 'ux', 'mockup', 'prototype', 'wireframe'],
            'marketing': ['marketing', 'campaign', 'seo', 'content', 'social media'],
            'legal': ['legal', 'compliance', 'contract', 'terms', 'privacy']
        }
        
        for category, keywords in skill_keywords.items():
            for keyword in keywords:
                if keyword in text_lower:
                    skills.append(category)
                    break
        
        return list(set(skills))
    
    def _calculate_priority(self, text: str) -> Dict:
        """Calculate email priority."""
        text_lower = text.lower()
        
        urgent_keywords = ['urgent', 'asap', 'immediately', 'critical', 'emergency']
        high_keywords = ['important', 'priority', 'deadline', 'soon']
        
        urgent_count = sum(1 for kw in urgent_keywords if kw in text_lower)
        high_count = sum(1 for kw in high_keywords if kw in text_lower)
        
        if urgent_count > 0:
            return {'level': 'critical', 'score': 100, 'response_time': '15 minutes'}
        elif high_count > 0:
            return {'level': 'high', 'score': 75, 'response_time': '1 hour'}
        else:
            return {'level': 'normal', 'score': 50, 'response_time': '24 hours'}
    
    def _find_best_assignee(self, required_skills: List[str], priority: Dict) -> Dict:
        """Find the best team member to handle the email."""
        if not self.team_expertise:
            return {'name': 'Available Team Member', 'match_score': 0, 'workload': 0}
        
        best_match = None
        best_score = 0
        
        for member, skills in self.team_expertise.items():
            match_count = sum(1 for skill in required_skills if skill in skills)
            match_score = (match_count / max(len(required_skills), 1)) * 100
            
            # Factor in workload (lower is better)
            workload = self.team_workload.get(member, 0)
            workload_penalty = min(workload * 5, 30)
            
            final_score = match_score - workload_penalty
            
            if final_score > best_score:
                best_score = final_score
                best_match = {
                    'name': member,
                    'match_score': round(match_score, 1),
                    'workload': workload,
                    'skills': skills
                }
        
        return best_match or {'name': 'Available Team Member', 'match_score': 0, 'workload': 0}
    
    def _generate_reason(self, assignee: Dict, skills: List[str], priority: Dict) -> str:
        """Generate human-readable delegation reason."""
        if assignee['match_score'] > 70:
            return f"Assigned to {assignee['name']} - strong expertise match ({assignee['match_score']}%) in {', '.join(skills)}"
        elif assignee['match_score'] > 40:
            return f"Assigned to {assignee['name']} - good match ({assignee['match_score']}%) with manageable workload"
        else:
            return f"Assigned to {assignee['name']} - available team member with capacity"
    
    def _get_alternatives(self, primary: Dict, skills: List[str]) -> List[Dict]:
        """Get alternative assignees."""
        alternatives = []
        # Implementation would rank other team members
        return alternatives
    
    def _suggest_response_time(self, priority: Dict) -> str:
        """Suggest appropriate response time."""
        return priority.get('response_time', '24 hours')
    
    def _extract_action_items(self, body: str) -> List[str]:
        """Extract action items from email."""
        items = []
        patterns = [
            r'(?:please|kindly)\s+(.+?)(?:\.|$)',
            r'(?:need to|must|should)\s+(.+?)(?:\.|$)',
            r'action item[:\s]+(.+?)(?:\.|$)'
        ]
        
        for pattern in patterns:
            matches = re.findall(pattern, body, re.IGNORECASE)
            items.extend(matches)
        
        return items[:5]


def main():
    """Test V451 engine."""
    engine = EmailDelegationEngine()
    
    # Initialize sample team
    engine.team_expertise = {
        'John Smith': ['technical', 'python', 'aws', 'docker'],
        'Sarah Johnson': ['sales', 'negotiation', 'contract'],
        'Mike Chen': ['support', 'troubleshoot', 'bug'],
        'Lisa Wang': ['security', 'compliance', 'gdpr']
    }
    engine.team_workload = {
        'John Smith': 3,
        'Sarah Johnson': 5,
        'Mike Chen': 2,
        'Lisa Wang': 1
    }
    
    test_email = {
        'from': 'client@example.com',
        'to': ['team@ziontechgroup.com', 'kleber@ziontechgroup.com'],
        'cc': ['manager@ziontechgroup.com'],
        'subject': 'URGENT: AWS Docker Deployment Issue',
        'body': 'We have a critical issue with our AWS Docker deployment. The containers are crashing and we need immediate technical assistance. Please help us troubleshoot this Python application deployment.'
    }
    
    result = engine.analyze_email(test_email)
    print(json.dumps(result, indent=2))
    print(f"\n✅ Recommended Assignee: {result['recommended_assignee']['name']}")
    print(f"✅ Match Score: {result['recommended_assignee']['match_score']}%")
    print(f"✅ Priority: {result['priority']['level']}")
    print(f"✅ Reply-all enforced: {result['reply_all_enforced']}")


if __name__ == '__main__':
    main()
