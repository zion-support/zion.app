#!/usr/bin/env python3
"""
V196 - AI Email Meeting Optimizer
Analyzes meeting requests, calculates meeting costs, suggests alternatives,
optimizes meeting length, and tracks meeting ROI.
"""

import json
import re
from datetime import datetime
from typing import Dict, List, Any
from collections import defaultdict


class MeetingOptimizer:
    """AI-powered meeting optimization for email requests."""
    
    def __init__(self):
        self.meeting_history = defaultdict(list)
        self.hourly_rates = self._build_hourly_rates()
    
    def _build_hourly_rates(self) -> Dict[str, float]:
        """Build default hourly rates by role."""
        return {
            'executive': 500,
            'director': 300,
            'manager': 200,
            'senior': 150,
            'mid-level': 100,
            'junior': 75,
            'default': 100
        }
    
    def analyze_meeting_request(self, email: Dict[str, Any], context: Dict = None) -> Dict[str, Any]:
        """Analyze meeting request and provide optimization."""
        if not email:
            return {'error': 'No email provided'}
        
        context = context or {}
        body = email.get('body', '')
        subject = email.get('subject', '')
        
        # Check if this is a meeting request
        is_meeting = self._check_meeting_request(body, subject)
        
        if not is_meeting:
            return {
                'is_meeting_request': False,
                'message': 'This does not appear to be a meeting request'
            }
        
        # Extract meeting details
        meeting_details = self._extract_meeting_details(body, subject, context)
        
        # Analyze attendees
        attendees = self._analyze_attendees(email, context)
        
        # Calculate meeting cost
        cost = self._calculate_meeting_cost(meeting_details, attendees)
        
        # Assess meeting necessity
        necessity = self._assess_meeting_necessity(body, meeting_details)
        
        # Suggest alternatives
        alternatives = self._suggest_alternatives(body, meeting_details, necessity)
        
        # Optimize meeting parameters
        optimization = self._optimize_meeting(meeting_details, attendees, cost)
        
        # Calculate ROI potential
        roi = self._calculate_roi_potential(body, meeting_details, cost)
        
        # Generate recommendation
        recommendation = self._generate_recommendation(necessity, cost, alternatives, optimization)
        
        # Track meeting
        self._track_meeting(email, meeting_details, cost)
        
        return {
            'analysis_id': f"meeting_{datetime.now().strftime('%Y%m%d%H%M%S')}",
            'timestamp': datetime.now().isoformat(),
            'is_meeting_request': True,
            'meeting_details': meeting_details,
            'attendees': attendees,
            'meeting_cost': cost,
            'necessity_assessment': necessity,
            'alternatives': alternatives,
            'optimization': optimization,
            'roi_potential': roi,
            'recommendation': recommendation,
            'reply_all_strategy': self._determine_reply_all_strategy(attendees, recommendation)
        }
    
    def _check_meeting_request(self, body: str, subject: str) -> bool:
        """Check if email is a meeting request."""
        meeting_indicators = [
            'meeting', 'call', 'discuss', 'schedule', 'calendar',
            'let\'s meet', 'can we talk', 'quick sync', 'standup',
            'zoom', 'teams', 'google meet', 'conference call'
        ]
        
        content = f"{subject} {body}".lower()
        return any(indicator in content for indicator in meeting_indicators)
    
    def _extract_meeting_details(self, body: str, subject: str, context: Dict) -> Dict[str, Any]:
        """Extract meeting details from email."""
        # Extract duration
        duration = self._extract_duration(body)
        
        # Extract purpose
        purpose = self._extract_purpose(body, subject)
        
        # Extract agenda
        agenda = self._extract_agenda(body)
        
        # Extract urgency
        urgency = self._extract_urgency(body)
        
        return {
            'subject': subject,
            'duration_minutes': duration,
            'purpose': purpose,
            'agenda': agenda,
            'urgency': urgency,
            'type': self._classify_meeting_type(purpose, agenda)
        }
    
    def _extract_duration(self, body: str) -> int:
        """Extract meeting duration."""
        duration_patterns = [
            r'(\d+)\s*(?:min|minute)',
            r'(\d+)\s*(?:hour|hr)',
            r'quick\s+(\d+)',
            r'(\d+)\s*-\s*\d+\s*min'
        ]
        
        for pattern in duration_patterns:
            match = re.search(pattern, body, re.IGNORECASE)
            if match:
                value = int(match.group(1))
                # Convert hours to minutes
                if 'hour' in body.lower() or 'hr' in body.lower():
                    return value * 60
                return value
        
        # Default durations based on keywords
        if 'quick' in body.lower() or 'brief' in body.lower():
            return 15
        elif 'standup' in body.lower() or 'sync' in body.lower():
            return 15
        elif 'review' in body.lower() or 'planning' in body.lower():
            return 60
        else:
            return 30  # Default
    
    def _extract_purpose(self, body: str, subject: str) -> str:
        """Extract meeting purpose."""
        purpose_indicators = [
            'to discuss', 'to review', 'to plan', 'to decide',
            'purpose:', 'objective:', 'goal:'
        ]
        
        content = f"{subject} {body}"
        
        for indicator in purpose_indicators:
            if indicator in content.lower():
                # Extract text after indicator
                pattern = rf'{indicator}\s*([^.]+)'
                match = re.search(pattern, content, re.IGNORECASE)
                if match:
                    return match.group(1).strip()[:200]
        
        # Fallback to subject
        return subject[:200]
    
    def _extract_agenda(self, body: str) -> List[str]:
        """Extract meeting agenda items."""
        agenda_patterns = [
            r'agenda[:\s]+([^.]+)',
            r'topics[:\s]+([^.]+)',
            r'we\'ll cover[:\s]+([^.]+)',
            r'discussion points[:\s]+([^.]+)'
        ]
        
        for pattern in agenda_patterns:
            match = re.search(pattern, body, re.IGNORECASE)
            if match:
                items = match.group(1)
                # Split by common delimiters
                agenda_items = re.split(r'[,;]|\d+\.', items)
                return [item.strip() for item in agenda_items if len(item.strip()) > 5][:5]
        
        return []
    
    def _extract_urgency(self, body: str) -> str:
        """Extract meeting urgency."""
        urgent_indicators = ['urgent', 'asap', 'immediately', 'critical', 'time-sensitive']
        medium_indicators = ['important', 'soon', 'this week']
        
        body_lower = body.lower()
        
        if any(ind in body_lower for ind in urgent_indicators):
            return 'high'
        elif any(ind in body_lower for ind in medium_indicators):
            return 'medium'
        else:
            return 'low'
    
    def _classify_meeting_type(self, purpose: str, agenda: List) -> str:
        """Classify meeting type."""
        content = f"{purpose} {' '.join(agenda)}".lower()
        
        if any(word in content for word in ['decision', 'decide', 'vote', 'approve']):
            return 'decision'
        elif any(word in content for word in ['brainstorm', 'ideate', 'creative']):
            return 'brainstorm'
        elif any(word in content for word in ['status', 'update', 'progress', 'standup']):
            return 'status'
        elif any(word in content for word in ['review', 'feedback', 'retrospective']):
            return 'review'
        elif any(word in content for word in ['planning', 'roadmap', 'strategy']):
            return 'planning'
        else:
            return 'general'
    
    def _analyze_attendees(self, email: Dict, context: Dict) -> Dict[str, Any]:
        """Analyze meeting attendees."""
        to_list = email.get('to', [])
        cc_list = email.get('cc', [])
        
        # Count attendees
        total_attendees = len(to_list) + len(cc_list)
        
        # Classify attendees (simplified - in real implementation would use role detection)
        attendee_roles = self._classify_attendee_roles(to_list + cc_list, context)
        
        return {
            'total_count': total_attendees,
            'required': to_list,
            'optional': cc_list,
            'roles': attendee_roles,
            'optimal_count': self._calculate_optimal_count(email.get('body', ''))
        }
    
    def _classify_attendee_roles(self, attendees: List, context: Dict) -> Dict[str, int]:
        """Classify attendee roles."""
        # Simplified classification
        roles = defaultdict(int)
        
        for attendee in attendees:
            # In real implementation, would detect role from email/domain
            roles['mid-level'] += 1
        
        return dict(roles)
    
    def _calculate_optimal_count(self, body: str) -> int:
        """Calculate optimal attendee count."""
        meeting_type_indicators = {
            'decision': 5,
            'brainstorm': 6,
            'status': 8,
            'review': 4,
            'planning': 6
        }
        
        body_lower = body.lower()
        
        for meeting_type, optimal in meeting_type_indicators.items():
            if meeting_type in body_lower:
                return optimal
        
        return 5  # Default optimal
    
    def _calculate_meeting_cost(self, meeting_details: Dict, attendees: Dict) -> Dict[str, Any]:
        """Calculate meeting cost."""
        duration_hours = meeting_details['duration_minutes'] / 60
        total_attendees = attendees['total_count']
        
        # Calculate cost based on roles
        total_cost = 0
        for role, count in attendees['roles'].items():
            rate = self.hourly_rates.get(role, self.hourly_rates['default'])
            total_cost += count * rate * duration_hours
        
        # Add overhead (15% for context switching, preparation, etc.)
        total_cost *= 1.15
        
        return {
            'total_cost': round(total_cost, 2),
            'cost_per_person': round(total_cost / max(total_attendees, 1), 2),
            'duration_hours': round(duration_hours, 2),
            'hourly_rate_avg': round(total_cost / max(duration_hours, 0.01) / max(total_attendees, 1), 2)
        }
    
    def _assess_meeting_necessity(self, body: str, meeting_details: Dict) -> Dict[str, Any]:
        """Assess if meeting is necessary."""
        # Indicators that meeting is necessary
        necessary_indicators = [
            'decision', 'decide', 'complex', 'sensitive', 'confidential',
            'brainstorm', 'creative', 'alignment', 'consensus'
        ]
        
        # Indicators that meeting might not be necessary
        unnecessary_indicators = [
            'quick update', 'just to inform', 'fyi', 'share information',
            'status update', 'routine'
        ]
        
        body_lower = body.lower()
        
        necessary_score = sum(1 for ind in necessary_indicators if ind in body_lower)
        unnecessary_score = sum(1 for ind in unnecessary_indicators if ind in body_lower)
        
        if necessary_score > unnecessary_score:
            necessity = 'high'
            score = 80
        elif unnecessary_score > necessary_score:
            necessity = 'low'
            score = 30
        else:
            necessity = 'medium'
            score = 50
        
        return {
            'necessity_level': necessity,
            'score': score,
            'reasoning': self._generate_necessity_reasoning(necessary_score, unnecessary_score, meeting_details)
        }
    
    def _generate_necessity_reasoning(self, necessary_score: int, unnecessary_score: int, details: Dict) -> str:
        """Generate reasoning for necessity assessment."""
        if necessary_score > 2:
            return "Meeting appears necessary for complex discussion or decision-making"
        elif unnecessary_score > 2:
            return "This could likely be handled via email or async communication"
        elif details['type'] in ['decision', 'brainstorm']:
            return f"{details['type'].capitalize()} meetings typically require synchronous discussion"
        else:
            return "Consider if the objective could be achieved through alternative methods"
    
    def _suggest_alternatives(self, body: str, meeting_details: Dict, necessity: Dict) -> List[Dict[str, Any]]:
        """Suggest meeting alternatives."""
        alternatives = []
        
        if necessity['necessity_level'] in ['low', 'medium']:
            alternatives.append({
                'type': 'email_thread',
                'description': 'Detailed email with clear action items',
                'time_saved': meeting_details['duration_minutes'],
                'cost_saved': 'High',
                'feasibility': 'high' if necessity['score'] < 50 else 'medium'
            })
            
            alternatives.append({
                'type': 'async_video',
                'description': 'Record a 3-5 minute video update',
                'time_saved': meeting_details['duration_minutes'] - 5,
                'cost_saved': 'Medium',
                'feasibility': 'high'
            })
            
            alternatives.append({
                'type': 'shared_document',
                'description': 'Collaborative document with comments',
                'time_saved': meeting_details['duration_minutes'],
                'cost_saved': 'High',
                'feasibility': 'high'
            })
        
        if meeting_details['duration_minutes'] > 30:
            alternatives.append({
                'type': 'shorter_meeting',
                'description': f"Reduce to {max(15, meeting_details['duration_minutes'] // 2)} minutes",
                'time_saved': meeting_details['duration_minutes'] // 2,
                'cost_saved': 'Medium',
                'feasibility': 'high'
            })
        
        return alternatives[:4]
    
    def _optimize_meeting(self, meeting_details: Dict, attendees: Dict, cost: Dict) -> Dict[str, Any]:
        """Optimize meeting parameters."""
        optimizations = []
        
        # Duration optimization
        if meeting_details['duration_minutes'] > 30:
            optimized_duration = max(15, meeting_details['duration_minutes'] // 2)
            savings = (meeting_details['duration_minutes'] - optimized_duration) / 60 * cost['hourly_rate_avg'] * attendees['total_count']
            optimizations.append({
                'parameter': 'duration',
                'current': meeting_details['duration_minutes'],
                'optimized': optimized_duration,
                'unit': 'minutes',
                'savings': round(savings, 2)
            })
        
        # Attendee optimization
        if attendees['total_count'] > attendees['optimal_count']:
            excess = attendees['total_count'] - attendees['optimal_count']
            savings = excess * cost['cost_per_person']
            optimizations.append({
                'parameter': 'attendees',
                'current': attendees['total_count'],
                'optimized': attendees['optimal_count'],
                'unit': 'people',
                'savings': round(savings, 2)
            })
        
        # Agenda optimization
        if not meeting_details['agenda']:
            optimizations.append({
                'parameter': 'agenda',
                'current': 'none',
                'optimized': 'Add 3-5 specific agenda items',
                'unit': 'items',
                'savings': 'Improved focus and efficiency'
            })
        
        total_savings = sum(opt['savings'] for opt in optimizations if isinstance(opt['savings'], (int, float)))
        
        return {
            'optimizations': optimizations,
            'total_potential_savings': round(total_savings, 2),
            'efficiency_gain': round((total_savings / max(cost['total_cost'], 1)) * 100, 1)
        }
    
    def _calculate_roi_potential(self, body: str, meeting_details: Dict, cost: Dict) -> Dict[str, Any]:
        """Calculate potential ROI of meeting."""
        # Estimate potential value based on meeting type and purpose
        value_multipliers = {
            'decision': 5.0,
            'planning': 3.0,
            'brainstorm': 2.5,
            'review': 2.0,
            'status': 1.0,
            'general': 1.5
        }
        
        multiplier = value_multipliers.get(meeting_details['type'], 1.0)
        
        # Adjust for urgency and importance
        if meeting_details['urgency'] == 'high':
            multiplier *= 1.5
        
        expected_value = cost['total_cost'] * multiplier
        roi = ((expected_value - cost['total_cost']) / cost['total_cost']) * 100
        
        return {
            'expected_value': round(expected_value, 2),
            'meeting_cost': cost['total_cost'],
            'roi_percentage': round(roi, 1),
            'roi_grade': 'A' if roi > 200 else 'B' if roi > 100 else 'C' if roi > 50 else 'D'
        }
    
    def _generate_recommendation(self, necessity: Dict, cost: Dict, alternatives: List, optimization: Dict) -> Dict[str, Any]:
        """Generate meeting recommendation."""
        if necessity['score'] < 40:
            action = 'suggest_alternative'
            message = 'This meeting may not be necessary. Consider alternatives.'
        elif optimization['efficiency_gain'] > 30:
            action = 'optimize'
            message = f'Meeting can be optimized to save ${optimization["total_potential_savings"]}'
        else:
            action = 'proceed'
            message = 'Meeting is justified and well-planned'
        
        return {
            'action': action,
            'message': message,
            'best_alternative': alternatives[0] if alternatives else None,
            'optimization_suggestions': optimization['optimizations'][:3],
            'cost_justified': necessity['score'] > 50 or optimization['efficiency_gain'] > 20
        }
    
    def _track_meeting(self, email: Dict, meeting_details: Dict, cost: Dict):
        """Track meeting for analytics."""
        sender = email.get('from', '')
        
        self.meeting_history[sender].append({
            'timestamp': datetime.now().isoformat(),
            'subject': email.get('subject', ''),
            'duration': meeting_details['duration_minutes'],
            'cost': cost['total_cost'],
            'type': meeting_details['type']
        })
    
    def _determine_reply_all_strategy(self, attendees: Dict, recommendation: Dict) -> Dict[str, Any]:
        """Determine reply-all strategy."""
        return {
            'reply_all_recommended': True,
            'reason': 'Keep all potential attendees informed about meeting optimization',
            'include_cost_analysis': recommendation['action'] == 'suggest_alternative',
            'include_alternatives': True
        }


def optimize_meeting_request(email: Dict[str, Any], context: Dict = None) -> Dict[str, Any]:
    """Main entry point for meeting optimization."""
    optimizer = MeetingOptimizer()
    return optimizer.analyze_meeting_request(email, context)


if __name__ == '__main__':
    test_email = {
        'from': 'project.manager@company.com',
        'to': ['dev1@company.com', 'dev2@company.com', 'designer@company.com', 'qa@company.com', 'stakeholder1@company.com'],
        'cc': ['manager@company.com', 'director@company.com'],
        'subject': 'Weekly status meeting - 1 hour',
        'body': 'Hi team, let\'s schedule our weekly status meeting for 1 hour to discuss project progress. We\'ll cover: current status, blockers, next steps. This is important for alignment. Please join the Zoom call at the scheduled time.',
        'date': '2024-01-15T10:00:00'
    }
    
    result = optimize_meeting_request(test_email)
    print(json.dumps(result, indent=2))
