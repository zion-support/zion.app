#!/usr/bin/env python3
"""
V937: Email Meeting-to-Action Converter
Automatically converts meeting follow-up emails into structured project plans
with tasks, deadlines, assigned owners, and milestones.
"""

import re
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional


class MeetingToActionConverter:
    """Convert meeting follow-up emails into structured project plans."""

    def __init__(self):
        self.project_templates = {
            'sprint': {'duration_days': 14, 'milestones': ['Planning', 'Development', 'Review', 'Deploy']},
            'quarterly': {'duration_days': 90, 'milestones': ['Month 1', 'Month 2', 'Month 3', 'Review']},
            'launch': {'duration_days': 30, 'milestones': ['Prep', 'Build', 'Test', 'Launch', 'Post-Launch']},
            'default': {'duration_days': 21, 'milestones': ['Phase 1', 'Phase 2', 'Phase 3', 'Complete']}
        }

    def convert_email(self, email_data: Dict[str, Any]) -> Dict[str, Any]:
        """Convert a meeting follow-up email into a project plan."""
        subject = email_data.get('subject', '')
        body = email_data.get('body', '')
        recipients = email_data.get('recipients', [])
        sender = email_data.get('sender', '')

        # Extract meeting context
        meeting_info = self._extract_meeting_info(subject, body)

        # Extract action items
        action_items = self._extract_action_items(body, recipients)

        # Extract decisions made
        decisions = self._extract_decisions(body)

        # Extract deadlines
        deadlines = self._extract_deadlines(body)

        # Extract key discussion points
        discussion_points = self._extract_discussion_points(body)

        # Determine project type
        project_type = self._classify_project_type(subject, body)

        # Generate project plan
        project_plan = self._generate_project_plan(
            meeting_info, action_items, decisions, deadlines,
            discussion_points, project_type
        )

        # Assign owners intelligently
        project_plan = self._assign_owners(project_plan, recipients, sender)

        # Generate milestones
        project_plan['milestones'] = self._generate_milestones(
            project_plan, project_type
        )

        return {
            'status': 'converted',
            'meeting_info': meeting_info,
            'project_type': project_type,
            'action_items': len(action_items),
            'decisions': len(decisions),
            'project_plan': project_plan,
            'estimated_duration_days': self.project_templates.get(project_type, self.project_templates['default'])['duration_days'],
            'total_tasks': len(project_plan.get('tasks', [])),
            'reply_all_required': len(recipients) > 1,
            'share_with_team': len(recipients) > 1
        }

    def _extract_meeting_info(self, subject: str, body: str) -> Dict[str, Any]:
        """Extract meeting metadata."""
        info = {'title': '', 'date': '', 'attendees': [], 'type': 'general'}

        # Extract meeting title from subject
        clean_subject = re.sub(r'(re:|fw:|meeting:|notes:)', '', subject, flags=re.IGNORECASE).strip()
        info['title'] = clean_subject

        # Detect meeting type
        text = f"{subject} {body}".lower()
        if any(w in text for w in ['sprint', 'standup', 'scrum', 'retro']):
            info['type'] = 'agile'
        elif any(w in text for w in ['board', 'executive', 'quarterly review']):
            info['type'] = 'executive'
        elif any(w in text for w in ['planning', 'roadmap', 'strategy']):
            info['type'] = 'strategic'
        elif any(w in text for w in ['design', 'review', 'feedback']):
            info['type'] = 'design_review'

        # Extract date
        date_match = re.search(r'(\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|\w+ \d{1,2},? \d{4})', body)
        if date_match:
            info['date'] = date_match.group(1)

        return info

    def _extract_action_items(self, body: str, recipients: List[str]) -> List[Dict[str, Any]]:
        """Extract action items from meeting notes."""
        items = []
        patterns = [
            r'(?:action item|todo|task|action)[:\s]*(.+?)(?:\.|$)',
            r'(\w+)\s+(?:will|shall|to)\s+(.+?)(?:\.|$)',
            r'(?:assigned to|owner)[:\s]*(\w+)\s*[-:]\s*(.+?)(?:\.|$)',
            r'(?:@(\w+))\s+(.+?)(?:\.|$)'
        ]

        sentences = re.split(r'[.\n]', body)
        for sentence in sentences:
            sentence = sentence.strip()
            if not sentence or len(sentence) < 10:
                continue

            for pattern in patterns:
                match = re.search(pattern, sentence, re.IGNORECASE)
                if match:
                    groups = match.groups()
                    if len(groups) == 2:
                        items.append({
                            'description': groups[1].strip()[:200],
                            'assignee': groups[0].strip(),
                            'status': 'pending',
                            'priority': 'medium'
                        })
                    elif len(groups) == 1:
                        items.append({
                            'description': groups[0].strip()[:200],
                            'assignee': 'unassigned',
                            'status': 'pending',
                            'priority': 'medium'
                        })
                    break

        # Detect priorities
        for item in items:
            desc_lower = item['description'].lower()
            if any(w in desc_lower for w in ['urgent', 'critical', 'asap', 'immediately']):
                item['priority'] = 'high'
            elif any(w in desc_lower for w in ['nice to have', 'low priority', 'when possible']):
                item['priority'] = 'low'

        return items[:15]

    def _extract_decisions(self, body: str) -> List[str]:
        """Extract decisions made during the meeting."""
        decisions = []
        decision_patterns = [
            r'(?:decided|agreed|concluded|approved)[:\s]*(.+?)(?:\.|$)',
            r'(?:we will|we shall|going with|chose)\s+(.+?)(?:\.|$)',
            r'(?:decision)[:\s]*(.+?)(?:\.|$)'
        ]

        for pattern in decision_patterns:
            matches = re.finditer(pattern, body, re.IGNORECASE)
            for match in matches:
                decision = match.group(1).strip()
                if len(decision) > 10:
                    decisions.append(decision[:200])

        return decisions[:10]

    def _extract_deadlines(self, body: str) -> List[Dict[str, str]]:
        """Extract deadlines mentioned in the meeting."""
        deadlines = []
        patterns = [
            r'(?:deadline|due|by|complete by)[:\s]*(.+?)(?:\.|$)',
            r'(?:due date|target date)[:\s]*(.+?)(?:\.|$)',
            r'(?:finish|deliver|ship)\s+(?:by|before)\s+(.+?)(?:\.|$)'
        ]

        for pattern in patterns:
            matches = re.finditer(pattern, body, re.IGNORECASE)
            for match in matches:
                deadlines.append({
                    'deadline': match.group(1).strip()[:100],
                    'extracted': True
                })

        return deadlines[:10]

    def _extract_discussion_points(self, body: str) -> List[str]:
        """Extract key discussion points."""
        points = []
        bullet_pattern = r'(?:[-*•])\s*(.+?)(?:\n|$)'
        matches = re.finditer(bullet_pattern, body)
        for match in matches:
            point = match.group(1).strip()
            if len(point) > 15:
                points.append(point[:150])

        if not points:
            sentences = body.split('.')
            for s in sentences[:5]:
                s = s.strip()
                if len(s) > 30:
                    points.append(s[:150])

        return points[:8]

    def _classify_project_type(self, subject: str, body: str) -> str:
        """Classify the project type."""
        text = f"{subject} {body}".lower()
        if any(w in text for w in ['sprint', 'backlog', 'story', 'epic']):
            return 'sprint'
        elif any(w in text for w in ['launch', 'release', 'go-live', 'deploy']):
            return 'launch'
        elif any(w in text for w in ['quarterly', 'q1', 'q2', 'q3', 'q4', 'okrs']):
            return 'quarterly'
        return 'default'

    def _generate_project_plan(self, meeting_info, action_items, decisions,
                               deadlines, discussion_points, project_type) -> Dict[str, Any]:
        """Generate a structured project plan."""
        tasks = []
        for i, item in enumerate(action_items):
            tasks.append({
                'id': f"T-{i+1:03d}",
                'title': item['description'][:100],
                'assignee': item['assignee'],
                'priority': item['priority'],
                'status': 'pending',
                'estimated_hours': self._estimate_hours(item['description'])
            })

        return {
            'project_name': meeting_info.get('title', 'Untitled Project')[:100],
            'project_type': project_type,
            'tasks': tasks,
            'decisions': decisions,
            'discussion_points': discussion_points,
            'deadlines': deadlines,
            'created_at': datetime.now().isoformat()
        }

    def _estimate_hours(self, description: str) -> int:
        """Estimate hours for a task based on description."""
        desc_lower = description.lower()
        if any(w in desc_lower for w in ['simple', 'quick', 'update', 'fix']):
            return 2
        elif any(w in desc_lower for w in ['complex', 'redesign', 'architect', 'migrate']):
            return 40
        elif any(w in desc_lower for w in ['build', 'develop', 'implement', 'create']):
            return 16
        elif any(w in desc_lower for w in ['review', 'test', 'analyze']):
            return 8
        return 8  # Default

    def _assign_owners(self, plan: Dict, recipients: List[str], sender: str) -> Dict:
        """Intelligently assign unassigned tasks."""
        for task in plan.get('tasks', []):
            if task['assignee'] == 'unassigned':
                # Round-robin among recipients
                if recipients:
                    task['assignee'] = recipients[hash(task['id']) % len(recipients)]
                else:
                    task['assignee'] = sender
        return plan

    def _generate_milestones(self, plan: Dict, project_type: str) -> List[Dict]:
        """Generate milestones based on project type."""
        template = self.project_templates.get(project_type, self.project_templates['default'])
        milestones = []
        start = datetime.now()
        days_per_milestone = template['duration_days'] / max(len(template['milestones']), 1)

        for i, name in enumerate(template['milestones']):
            date = start + timedelta(days=days_per_milestone * (i + 1))
            milestones.append({
                'name': name,
                'target_date': date.strftime('%Y-%m-%d'),
                'status': 'pending',
                'tasks_count': len(plan.get('tasks', [])) // max(len(template['milestones']), 1)
            })

        return milestones


def main():
    converter = MeetingToActionConverter()

    test_email = {
        'subject': 'Meeting Notes: Q4 Product Launch Planning',
        'body': """Team,

Great discussion today on the Q4 launch. Here are the notes:

- We agreed to launch on November 15th
- Alice will prepare the marketing materials by October 30th
- Bob will complete the technical testing. Deadline: November 5th
- Carol needs to finalize the pricing strategy. Due by October 25th
- @dave please handle the customer communication plan
- We decided to go with the premium tier pricing model

Action items:
- Action item: Set up demo environment for sales team
- Alice will create landing page designs
- Bob to deploy staging environment by next Friday

Decisions:
- Approved: Budget increase of $50K for marketing
- Agreed: Weekly sync meetings every Tuesday

Thanks everyone!
""",
        'sender': 'pm@company.com',
        'recipients': ['alice@company.com', 'bob@company.com', 'carol@company.com', 'dave@company.com']
    }

    result = converter.convert_email(test_email)

    print("=" * 60)
    print("V937: Meeting-to-Action Converter - Test Results")
    print("=" * 60)
    print(f"\nProject: {result['project_plan']['project_name']}")
    print(f"Type: {result['project_type']}")
    print(f"Duration: {result['estimated_duration_days']} days")
    print(f"Action Items: {result['action_items']}")
    print(f"Decisions: {result['decisions']}")
    print(f"Total Tasks: {result['total_tasks']}")
    print(f"Reply All: {result['reply_all_required']}")

    print(f"\nTasks:")
    for task in result['project_plan']['tasks']:
        print(f"  {task['id']}: {task['title'][:50]}... | {task['assignee']} | {task['priority']} | ~{task['estimated_hours']}h")

    print(f"\nMilestones:")
    for m in result['project_plan']['milestones']:
        print(f"  {m['name']}: {m['target_date']} ({m['tasks_count']} tasks)")

    print(f"\nDecisions:")
    for d in result['project_plan']['decisions']:
        print(f"  - {d[:80]}")

    print(f"\n✅ V937 Meeting-to-Action Converter: OPERATIONAL")


if __name__ == '__main__':
    main()
