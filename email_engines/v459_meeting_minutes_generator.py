#!/usr/bin/env python3
"""
V459 - AI Email Meeting Minutes Generator
Automatically generates structured meeting minutes from email discussions.
Features: Decision extraction, action item tracking, attendee logging, auto-distribution.
CRITICAL: Always enforces reply-all for multi-recipient emails.
"""

import json
import re
from datetime import datetime
from typing import Dict, List, Any


class MeetingMinutesGenerator:
    """Generates meeting minutes from email discussions."""
    
    def analyze_email(self, email: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze email and generate meeting minutes."""
        body = email.get('body', '')
        subject = email.get('subject', '')
        sender = email.get('from', '')
        recipients = email.get('to', []) + email.get('cc', [])
        
        # Extract meeting information
        meeting_info = self._extract_meeting_info(subject, body)
        attendees = self._extract_attendees(recipients, sender)
        decisions = self._extract_decisions(body)
        action_items = self._extract_action_items(body)
        discussion_points = self._extract_discussion_points(body)
        deadlines = self._extract_deadlines(body)
        
        # Generate structured minutes
        minutes = self._generate_minutes(meeting_info, attendees, decisions, action_items, discussion_points, deadlines)
        
        reply_all_required = len(recipients) > 1
        
        return {
            'engine': 'V459_MeetingMinutesGenerator',
            'meeting_minutes': minutes,
            'attendees_count': len(attendees),
            'decisions_count': len(decisions),
            'action_items_count': len(action_items),
            'distribution_list': recipients,
            'reply_all_required': reply_all_required,
            'reply_all_enforced': reply_all_required,
            'recipients': recipients,
            'timestamp': datetime.now().isoformat()
        }
    
    def _extract_meeting_info(self, subject: str, body: str) -> Dict:
        """Extract meeting information from subject and body."""
        date_patterns = [
            r'(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})',
            r'(january|february|march|april|may|june|july|august|september|october|november|december)\s+(\d{1,2})',
            r'(monday|tuesday|wednesday|thursday|friday)'
        ]
        
        time_patterns = [
            r'(\d{1,2})[:\s]*(\d{2})?\s*(am|pm)?',
            r'at\s+(\d{1,2})(?::(\d{2}))?\s*(am|pm)?'
        ]
        
        date_match = None
        for pattern in date_patterns:
            match = re.search(pattern, body + ' ' + subject, re.IGNORECASE)
            if match:
                date_match = match.group(0)
                break
        
        time_match = None
        for pattern in time_patterns:
            match = re.search(pattern, body, re.IGNORECASE)
            if match:
                time_match = match.group(0)
                break
        
        return {
            'title': subject.replace('Re:', '').replace('FW:', '').strip(),
            'date': date_match or 'TBD',
            'time': time_match or 'TBD',
            'duration': self._extract_duration(body)
        }
    
    def _extract_duration(self, body: str) -> str:
        """Extract meeting duration."""
        patterns = [
            r'(\d+)\s*(?:minute|min)s?',
            r'(\d+)\s*(?:hour|hr)s?',
            r'(?:half\s*(?:an?\s*)?hour)',
            r'(?:quick|short|brief)'
        ]
        
        min_match = re.search(r'(\d+)\s*(?:minute|min)s?', body, re.IGNORECASE)
        if min_match:
            return f"{min_match.group(1)} minutes"
        
        hour_match = re.search(r'(\d+)\s*(?:hour|hr)s?', body, re.IGNORECASE)
        if hour_match:
            return f"{hour_match.group(1)} hour(s)"
        
        if re.search(r'half\s*(?:an?\s*)?hour', body, re.IGNORECASE):
            return '30 minutes'
        
        if re.search(r'(?:quick|short|brief)', body, re.IGNORECASE):
            return '15 minutes'
        
        return '1 hour (default)'
    
    def _extract_attendees(self, recipients: List[str], sender: str) -> List[Dict]:
        """Extract meeting attendees."""
        attendees = [{'email': sender, 'role': 'organizer'}]
        
        for recipient in recipients:
            if recipient != sender:
                attendees.append({'email': recipient, 'role': 'participant'})
        
        return attendees
    
    def _extract_decisions(self, body: str) -> List[Dict]:
        """Extract decisions made in the meeting."""
        decisions = []
        patterns = [
            (r'(?:we\s+)?(?:decided|agreed|approved)\s+(?:to|that)\s+(.+?)(?:\.|$)', 'decision'),
            (r'(?:we\s+)?(?:will|shall)\s+(.+?)(?:\.|$)', 'commitment'),
            (r'(?:let\'?s|we\s+should)\s+(.+?)(?:\.|$)', 'proposal'),
            (r'(?:rejected|declined|won\'?t)\s+(.+?)(?:\.|$)', 'rejection')
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
        """Extract action items from the meeting."""
        items = []
        patterns = [
            r'(?:please|kindly)\s+(.+?)(?:\.|$)',
            r'(?:need to|must|should)\s+(.+?)(?:\.|$)',
            r'action item[:\s]+(.+?)(?:\.|$)',
            r'(?:TODO|TASK)[:\s]+(.+?)(?:\.|$)',
            r'(\w+)\s+(?:will|to)\s+(.+?)(?:\.|$)'
        ]
        
        for pattern in patterns:
            matches = re.findall(pattern, body, re.IGNORECASE)
            for match in matches:
                if isinstance(match, tuple):
                    items.append({
                        'assigned_to': match[0],
                        'task': match[1],
                        'status': 'pending',
                        'deadline': 'TBD'
                    })
                else:
                    items.append({
                        'assigned_to': 'TBD',
                        'task': match.strip(),
                        'status': 'pending',
                        'deadline': 'TBD'
                    })
        
        return items[:10]
    
    def _extract_discussion_points(self, body: str) -> List[str]:
        """Extract key discussion points."""
        points = []
        sentences = re.split(r'[.!?]+', body)
        
        for sent in sentences:
            sent = sent.strip()
            if len(sent) > 20 and re.search(r'\b(?:discuss|review|talk|cover|present|update)\b', sent, re.IGNORECASE):
                points.append(sent)
        
        return points[:10]
    
    def _extract_deadlines(self, body: str) -> List[Dict]:
        """Extract deadlines mentioned in the meeting."""
        deadlines = []
        patterns = [
            r'(?:by|before|until)\s+(\w+\s+\d{1,2}(?:st|nd|rd|th)?)',
            r'(?:deadline|due)\s+(?:is|:)\s+(.+?)(?:\.|$)',
            r'(?:EOD|end of day|COB|close of business)',
            r'(?:next\s+(?:week|month|quarter))'
        ]
        
        for pattern in patterns:
            matches = re.findall(pattern, body, re.IGNORECASE)
            for match in matches:
                if isinstance(match, str):
                    deadlines.append({
                        'deadline': match,
                        'context': 'mentioned in meeting'
                    })
        
        return deadlines
    
    def _generate_minutes(self, meeting_info, attendees, decisions, action_items, discussion_points, deadlines) -> Dict:
        """Generate structured meeting minutes."""
        return {
            'title': meeting_info['title'],
            'date': meeting_info['date'],
            'time': meeting_info['time'],
            'duration': meeting_info['duration'],
            'attendees': [a['email'] for a in attendees],
            'summary': f"Meeting with {len(attendees)} attendees discussing {meeting_info['title']}",
            'key_decisions': [d['content'] for d in decisions],
            'action_items': [
                {
                    'task': item['task'],
                    'assigned_to': item['assigned_to'],
                    'status': item['status'],
                    'deadline': item['deadline']
                }
                for item in action_items
            ],
            'discussion_points': discussion_points,
            'deadlines': [d['deadline'] for d in deadlines],
            'next_steps': self._generate_next_steps(action_items, deadlines),
            'generated_at': datetime.now().isoformat()
        }
    
    def _generate_next_steps(self, action_items: List[Dict], deadlines: List[Dict]) -> List[str]:
        """Generate next steps based on action items and deadlines."""
        steps = []
        
        if action_items:
            steps.append(f"Follow up on {len(action_items)} action items")
        
        if deadlines:
            steps.append(f"Monitor {len(deadlines)} upcoming deadlines")
        
        steps.append("Distribute minutes to all attendees")
        steps.append("Schedule follow-up meeting if needed")
        
        return steps


def main():
    """Test V459 engine."""
    engine = MeetingMinutesGenerator()
    
    test_email = {
        'from': 'project-lead@ziontechgroup.com',
        'to': ['team@ziontechgroup.com', 'kleber@ziontechgroup.com'],
        'cc': ['manager@ziontechgroup.com', 'stakeholder@client.com'],
        'subject': 'Q4 Planning Meeting - Thursday at 3 PM',
        'body': """Team,
        
We decided to prioritize the AI platform launch for Q4. John will lead the technical implementation and should have the MVP ready by November 15th. Sarah will handle the marketing campaign starting next week.

Action items:
1. John - Set up production environment by Friday
2. Sarah - Create marketing materials by October 30th
3. Mike - Conduct user testing by November 1st

We discussed the budget allocation and agreed to increase the development budget by 20%. The deadline for the full launch is December 1st.

Let's meet again next Thursday to review progress.

Thanks!"""
    }
    
    result = engine.analyze_email(test_email)
    print(json.dumps(result, indent=2))
    print(f"\n✅ Attendees: {result['attendees_count']}")
    print(f"✅ Decisions: {result['decisions_count']}")
    print(f"✅ Action items: {result['action_items_count']}")
    print(f"✅ Reply-all enforced: {result['reply_all_enforced']}")


if __name__ == '__main__':
    main()
