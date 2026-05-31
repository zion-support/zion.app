#!/usr/bin/env python3
"""
V676 - Email Meeting Effectiveness Analyzer
Analyzes meeting-related emails to calculate ROI, identify time wasters,
and suggest improvements for meeting culture optimization.

Key Features:
- Meeting ROI calculation (time cost vs outcomes)
- Time waster detection (recurring meetings, unclear agendas)
- Action item completion tracking
- Meeting frequency optimization
- Participant effectiveness scoring
- Alternative communication suggestions
"""

import json
import re
from datetime import datetime, timedelta
from collections import defaultdict
from typing import Dict, List, Optional, Tuple

class EmailMeetingEffectivenessAnalyzer:
    def __init__(self):
        self.meetings = defaultdict(list)
        self.action_items = defaultdict(list)
        self.participant_scores = defaultdict(lambda: defaultdict(float))
        self.avg_hourly_rate = 75  # Default hourly rate for ROI calculation
    
    def analyze_meeting_email(self, email: Dict) -> Dict:
        """
        Analyze a meeting-related email for effectiveness metrics
        
        Args:
            email: Email dictionary with subject, body, from, to, timestamp, etc.
        
        Returns:
            Dict with meeting effectiveness analysis
        """
        text = email.get('body', '') + ' ' + email.get('subject', '')
        
        # Detect meeting type
        meeting_type = self._classify_meeting_type(text)
        
        # Extract meeting duration if mentioned
        duration_minutes = self._extract_duration(text)
        
        # Extract participants
        participants = email.get('to', []) + [email.get('from', '')]
        participants = [p for p in participants if p]  # Remove empty strings
        
        # Detect action items
        action_items = self._extract_action_items(text)
        
        # Detect agenda presence
        has_agenda = self._detect_agenda(text)
        
        # Detect clear objectives
        has_objectives = self._detect_objectives(text)
        
        # Calculate effectiveness score
        effectiveness_score = self._calculate_effectiveness_score(
            has_agenda=has_agenda,
            has_objectives=has_objectives,
            has_action_items=len(action_items) > 0,
            participant_count=len(participants)
        )
        
        # Calculate time cost
        time_cost = self._calculate_time_cost(duration_minutes, len(participants))
        
        # Detect time waster indicators
        time_waster_score = self._detect_time_wasters(text, len(participants), duration_minutes)
        
        # Generate improvement suggestions
        suggestions = self._generate_suggestions(
            has_agenda=has_agenda,
            has_objectives=has_objectives,
            participant_count=len(participants),
            duration_minutes=duration_minutes,
            time_waster_score=time_waster_score
        )
        
        # Suggest alternatives
        alternatives = self._suggest_alternatives(meeting_type, participant_count=len(participants))
        
        result = {
            'email_id': email.get('id', ''),
            'meeting_type': meeting_type,
            'duration_minutes': duration_minutes,
            'participant_count': len(participants),
            'participants': participants,
            'action_items': action_items,
            'action_item_count': len(action_items),
            'has_agenda': has_agenda,
            'has_objectives': has_objectives,
            'effectiveness_score': effectiveness_score,
            'time_cost_usd': time_cost,
            'time_waster_score': time_waster_score,
            'improvement_suggestions': suggestions,
            'alternative_formats': alternatives,
            'roi_potential': 'high' if effectiveness_score > 70 else 'medium' if effectiveness_score > 40 else 'low',
            'reply_all_required': len(participants) > 1
        }
        
        return result
    
    def _classify_meeting_type(self, text: str) -> str:
        """Classify the type of meeting based on text content"""
        text_lower = text.lower()
        
        if any(kw in text_lower for kw in ['standup', 'daily', 'check-in', 'sync']):
            return 'standup'
        elif any(kw in text_lower for kw in ['planning', 'roadmap', 'strategy', 'quarterly']):
            return 'planning'
        elif any(kw in text_lower for kw in ['review', 'retrospective', 'feedback']):
            return 'review'
        elif any(kw in text_lower for kw in ['brainstorm', 'ideation', 'workshop']):
            return 'brainstorm'
        elif any(kw in text_lower for kw in ['decision', 'vote', 'approval']):
            return 'decision'
        elif any(kw in text_lower for kw in ['1:1', 'one-on-one', 'individual']):
            return 'one_on_one'
        elif any(kw in text_lower for kw in ['training', 'onboarding', 'learning']):
            return 'training'
        else:
            return 'general'
    
    def _extract_duration(self, text: str) -> Optional[int]:
        """Extract meeting duration in minutes from text"""
        patterns = [
            r'(\d+)\s*(?:minute|min)s?',
            r'(\d+)\s*(?:hour|hr)s?',
            r'(\d+):(\d+)',  # Time format like 1:30
        ]
        
        for pattern in patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            if matches:
                if ':' in pattern:  # Time format
                    hours, minutes = matches[0]
                    return int(hours) * 60 + int(minutes)
                elif 'hour' in pattern or 'hr' in pattern:
                    return int(matches[0][0]) * 60
                else:
                    return int(matches[0][0])
        
        return None
    
    def _extract_action_items(self, text: str) -> List[str]:
        """Extract action items from meeting text"""
        action_items = []
        
        # Patterns for action items
        patterns = [
            r'(?:action item|task|to-do|todo)[:\s]+([^\n]+)',
            r'(?:\[ \]|☐|•)\s+([^\n]+)',
            r'(?:responsible|owner|assigned to)[:\s]+([^\n]+)',
        ]
        
        for pattern in patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            action_items.extend(matches)
        
        return [item.strip() for item in action_items if len(item.strip()) > 5]
    
    def _detect_agenda(self, text: str) -> bool:
        """Detect if meeting has a clear agenda"""
        text_lower = text.lower()
        agenda_keywords = ['agenda', 'topics', 'discussion points', 'agenda items', 'we will discuss']
        return any(keyword in text_lower for keyword in agenda_keywords)
    
    def _detect_objectives(self, text: str) -> bool:
        """Detect if meeting has clear objectives"""
        text_lower = text.lower()
        objective_keywords = ['objective', 'goal', 'purpose', 'outcome', 'deliverable', 'decision needed']
        return any(keyword in text_lower for keyword in objective_keywords)
    
    def _calculate_effectiveness_score(self, has_agenda: bool, has_objectives: bool, 
                                       has_action_items: bool, participant_count: int) -> float:
        """Calculate meeting effectiveness score (0-100)"""
        score = 0.0
        
        # Agenda presence (25 points)
        if has_agenda:
            score += 25
        
        # Objectives presence (25 points)
        if has_objectives:
            score += 25
        
        # Action items (20 points)
        if has_action_items:
            score += 20
        
        # Optimal participant count (15 points)
        if 3 <= participant_count <= 8:
            score += 15
        elif 2 <= participant_count <= 10:
            score += 10
        elif participant_count > 10:
            score += 5
        
        # Base score for having a meeting (15 points)
        score += 15
        
        return min(100, score)
    
    def _calculate_time_cost(self, duration_minutes: Optional[int], participant_count: int) -> float:
        """Calculate time cost in USD"""
        if not duration_minutes:
            duration_minutes = 60  # Default 1 hour
        
        hours = duration_minutes / 60
        return hours * participant_count * self.avg_hourly_rate
    
    def _detect_time_wasters(self, text: str, participant_count: int, 
                            duration_minutes: Optional[int]) -> float:
        """Detect time waster indicators (0-100, higher = more wasteful)"""
        score = 0.0
        text_lower = text.lower()
        
        # Too many participants (>10 people)
        if participant_count > 10:
            score += 30
        elif participant_count > 8:
            score += 15
        
        # No clear agenda
        if not self._detect_agenda(text):
            score += 25
        
        # No clear objectives
        if not self._detect_objectives(text):
            score += 25
        
        # Meeting could be an email
        email_keywords = ['fyi', 'update', 'information', 'announcement', 'just wanted to let you know']
        if any(kw in text_lower for kw in email_keywords):
            score += 20
        
        # Recurring meeting without clear purpose
        recurring_keywords = ['weekly', 'monthly', 'recurring', 'regular']
        if any(kw in text_lower for kw in recurring_keywords):
            if not self._detect_objectives(text):
                score += 15
        
        return min(100, score)
    
    def _generate_suggestions(self, has_agenda: bool, has_objectives: bool,
                             participant_count: int, duration_minutes: Optional[int],
                             time_waster_score: float) -> List[str]:
        """Generate improvement suggestions"""
        suggestions = []
        
        if not has_agenda:
            suggestions.append("Add a clear agenda with topics and time allocations")
        
        if not has_objectives:
            suggestions.append("Define specific objectives and desired outcomes")
        
        if participant_count > 8:
            suggestions.append(f"Reduce participants from {participant_count} to essential stakeholders only (aim for 5-7 people)")
        
        if duration_minutes and duration_minutes > 60:
            suggestions.append(f"Consider reducing duration from {duration_minutes} minutes to 45-60 minutes")
        
        if time_waster_score > 70:
            suggestions.append("This meeting may be better as an email or async update")
        
        if not suggestions:
            suggestions.append("Meeting structure looks good - focus on execution and follow-through")
        
        return suggestions
    
    def _suggest_alternatives(self, meeting_type: str, participant_count: int) -> List[str]:
        """Suggest alternative communication formats"""
        alternatives = []
        
        if meeting_type == 'standup' and participant_count > 5:
            alternatives.append("Async standup via Slack/email")
        
        if meeting_type == 'general':
            alternatives.extend([
                "Email update with clear action items",
                "Shared document with comments",
                "Recorded video update"
            ])
        
        if participant_count > 10:
            alternatives.extend([
                "Break into smaller working groups",
                "Town hall format with Q&A",
                "Pre-recorded presentation + live Q&A"
            ])
        
        return alternatives
    
    def generate_report(self, email_analyses: List[Dict]) -> Dict:
        """Generate comprehensive meeting effectiveness report"""
        if not email_analyses:
            return {'message': 'No meeting data available'}
        
        total_meetings = len(email_analyses)
        avg_effectiveness = sum(m['effectiveness_score'] for m in email_analyses) / total_meetings
        avg_time_waster = sum(m['time_waster_score'] for m in email_analyses) / total_meetings
        total_time_cost = sum(m['time_cost_usd'] for m in email_analyses)
        
        # Meeting type distribution
        type_distribution = defaultdict(int)
        for meeting in email_analyses:
            type_distribution[meeting['meeting_type']] += 1
        
        # High waster meetings
        high_waster_count = sum(1 for m in email_analyses if m['time_waster_score'] > 70)
        
        # Meetings with action items
        meetings_with_actions = sum(1 for m in email_analyses if m['action_item_count'] > 0)
        
        return {
            'total_meetings_analyzed': total_meetings,
            'avg_effectiveness_score': round(avg_effectiveness, 1),
            'avg_time_waster_score': round(avg_time_waster, 1),
            'total_time_cost_usd': round(total_time_cost, 2),
            'meeting_type_distribution': dict(type_distribution),
            'high_waster_meetings': high_waster_count,
            'meetings_with_action_items': meetings_with_actions,
            'action_item_rate': round(meetings_with_actions / total_meetings * 100, 1),
            'optimization_potential': 'high' if avg_time_waster > 60 else 'medium' if avg_time_waster > 30 else 'low',
            'top_improvements': self._get_top_improvements(email_analyses),
            'timestamp': datetime.now().isoformat()
        }
    
    def _get_top_improvements(self, email_analyses: List[Dict]) -> List[str]:
        """Get top 3 improvement suggestions across all meetings"""
        all_suggestions = []
        for meeting in email_analyses:
            all_suggestions.extend(meeting['improvement_suggestions'])
        
        # Count frequency
        suggestion_counts = defaultdict(int)
        for suggestion in all_suggestions:
            suggestion_counts[suggestion] += 1
        
        # Return top 3
        sorted_suggestions = sorted(suggestion_counts.items(), key=lambda x: x[1], reverse=True)
        return [s[0] for s in sorted_suggestions[:3]]


def test_v676():
    """Test V676 Email Meeting Effectiveness Analyzer"""
    analyzer = EmailMeetingEffectivenessAnalyzer()
    
    # Test 1: Well-structured meeting
    email1 = {
        'id': 'e001',
        'from': 'manager@company.com',
        'to': ['team@company.com', 'stakeholder@company.com'],
        'subject': 'Q3 Planning Meeting - Tomorrow 2pm',
        'body': '''Team,
        
        Tomorrow's Q3 planning meeting:
        
        Agenda:
        1. Review Q2 results (15 min)
        2. Discuss Q3 priorities (30 min)
        3. Resource allocation (15 min)
        
        Objective: Finalize Q3 roadmap and assign owners
        
        Duration: 60 minutes
        
        Action items will be assigned during the meeting.
        
        Please come prepared with your team's priorities.''',
        'timestamp': '2026-05-30T09:00:00'
    }
    
    # Test 2: Poorly structured meeting
    email2 = {
        'id': 'e002',
        'from': 'manager@company.com',
        'to': ['team1@company.com', 'team2@company.com', 'team3@company.com', 
               'team4@company.com', 'team5@company.com', 'team6@company.com',
               'team7@company.com', 'team8@company.com', 'team9@company.com',
               'team10@company.com', 'team11@company.com', 'team12@company.com'],
        'subject': 'Weekly Sync',
        'body': '''Hi everyone,
        
        Let's have our weekly sync tomorrow at 10am. We'll discuss ongoing projects and updates.
        
        See you there!''',
        'timestamp': '2026-05-30T10:00:00'
    }
    
    # Test 3: Meeting that could be an email
    email3 = {
        'id': 'e003',
        'from': 'manager@company.com',
        'to': ['team@company.com'],
        'subject': 'FYI - Office Policy Update',
        'body': '''Team,
        
        Just wanted to let you know about the new office policy regarding remote work.
        
        Starting next month, we're moving to a hybrid model with 3 days in office.
        
        Let me know if you have questions.''',
        'timestamp': '2026-05-30T11:00:00'
    }
    
    # Analyze all emails
    results = []
    for email in [email1, email2, email3]:
        result = analyzer.analyze_meeting_email(email)
        results.append(result)
        
        print(f"\n{'='*50}")
        print(f"Email: {email['subject'][:40]}...")
        print(f"Meeting Type: {result['meeting_type']}")
        print(f"Effectiveness Score: {result['effectiveness_score']}/100")
        print(f"Time Waster Score: {result['time_waster_score']}/100")
        print(f"Time Cost: ${result['time_cost_usd']:.2f}")
        print(f"Has Agenda: {result['has_agenda']}")
        print(f"Has Objectives: {result['has_objectives']}")
        print(f"Action Items: {result['action_item_count']}")
        print(f"Suggestions: {result['improvement_suggestions']}")
    
    # Generate report
    report = analyzer.generate_report(results)
    print(f"\n{'='*50}")
    print(f"✅ V676 Meeting Effectiveness Analyzer Test Complete")
    print(f"Total Meetings: {report['total_meetings_analyzed']}")
    print(f"Avg Effectiveness: {report['avg_effectiveness_score']}/100")
    print(f"Avg Time Waster: {report['avg_time_waster_score']}/100")
    print(f"Total Time Cost: ${report['total_time_cost_usd']:.2f}")
    print(f"High Waster Meetings: {report['high_waster_meetings']}")
    print(f"Optimization Potential: {report['optimization_potential']}")
    
    return report


if __name__ == '__main__':
    test_v676()
