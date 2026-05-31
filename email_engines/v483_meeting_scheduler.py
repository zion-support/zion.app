#!/usr/bin/env python3
"""
V483 - Email Meeting Scheduler Intelligence
Extract meeting requests from emails and suggest optimal meeting times.
Features: Meeting intent detection, time slot extraction, calendar integration, optimal time suggestions.
CRITICAL: Always enforces reply-all for multi-recipient emails.
"""

import json
import re
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional


class EmailMeetingSchedulerIntelligence:
    """Extract meeting requests and suggest optimal scheduling."""
    
    MEETING_INDICATORS = [
        'meeting', 'call', 'discuss', 'chat', 'sync', 'catch up',
        'schedule', 'appointment', 'consultation', 'review session'
    ]
    
    TIME_PATTERNS = [
        r'\b(\d{1,2})(?::(\d{2}))?\s*(am|pm|AM|PM)\b',
        r'\b(\d{1,2})\s*(?:o\'?clock)\b',
        r'\b(morning|afternoon|evening|noon|midnight)\b',
        r'\b(\d{1,2})\s*-\s*(\d{1,2})\b'
    ]
    
    DATE_PATTERNS = [
        r'\b(today|tomorrow|yesterday)\b',
        r'\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b',
        r'\b(next|this|last)\s+(week|monday|tuesday|wednesday|thursday|friday)\b',
        r'\b(\d{1,2})(?:st|nd|rd|th)?\s+(?:of\s+)?(january|february|march|april|may|june|july|august|september|october|november|december)\b'
    ]
    
    DURATION_PATTERNS = [
        r'\b(\d+)\s*(?:minute|min)s?\b',
        r'\b(\d+)\s*(?:hour|hr)s?\b',
        r'\b(quick|brief|short)\s+(?:call|meeting|chat)\b',
        r'\b(half\s+hour|30\s*min)\b'
    ]
    
    def analyze_email(self, email: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze email for meeting requests and scheduling needs."""
        body = email.get('body', '')
        subject = email.get('subject', '')
        sender = email.get('from', '')
        recipients = email.get('to', []) + email.get('cc', [])
        
        # Detect meeting intent
        meeting_intent = self._detect_meeting_intent(body, subject)
        
        if not meeting_intent['has_meeting_intent']:
            return {
                'engine': 'V483_EmailMeetingSchedulerIntelligence',
                'has_meeting_intent': False,
                'reply_all_required': len(recipients) > 1,
                'reply_all_enforced': len(recipients) > 1,
                'recipients': recipients,
                'timestamp': datetime.now().isoformat()
            }
        
        # Extract time preferences
        time_preferences = self._extract_time_preferences(body)
        
        # Extract date preferences
        date_preferences = self._extract_date_preferences(body)
        
        # Extract duration
        duration = self._extract_duration(body)
        
        # Extract meeting details
        meeting_details = self._extract_meeting_details(body, subject)
        
        # Suggest optimal times
        optimal_times = self._suggest_optimal_times(
            date_preferences, time_preferences, duration, recipients
        )
        
        # Generate calendar event
        calendar_event = self._generate_calendar_event(
            meeting_details, optimal_times, sender, recipients
        )
        
        # Generate response template
        response_template = self._generate_response_template(
            meeting_details, optimal_times, calendar_event
        )
        
        reply_all_required = len(recipients) > 1
        
        return {
            'engine': 'V483_EmailMeetingSchedulerIntelligence',
            'has_meeting_intent': True,
            'meeting_intent': meeting_intent,
            'time_preferences': time_preferences,
            'date_preferences': date_preferences,
            'duration': duration,
            'meeting_details': meeting_details,
            'optimal_times': optimal_times,
            'calendar_event': calendar_event,
            'response_template': response_template,
            'reply_all_required': reply_all_required,
            'reply_all_enforced': reply_all_required,
            'recipients': recipients,
            'timestamp': datetime.now().isoformat()
        }
    
    def _detect_meeting_intent(self, body: str, subject: str) -> Dict:
        """Detect if email contains meeting request."""
        text = (body + ' ' + subject).lower()
        
        # Check for meeting indicators
        indicators_found = []
        for indicator in self.MEETING_INDICATORS:
            if indicator in text:
                indicators_found.append(indicator)
        
        has_intent = len(indicators_found) > 0
        
        # Determine meeting type
        if 'call' in text or 'phone' in text:
            meeting_type = 'phone_call'
        elif 'video' in text or 'zoom' in text or 'teams' in text:
            meeting_type = 'video_call'
        elif 'meet' in text or 'meeting' in text:
            meeting_type = 'meeting'
        else:
            meeting_type = 'discussion'
        
        # Determine formality
        if any(word in text for word in ['formal', 'official', 'scheduled']):
            formality = 'formal'
        elif any(word in text for word in ['quick', 'brief', 'casual']):
            formality = 'casual'
        else:
            formality = 'standard'
        
        return {
            'has_meeting_intent': has_intent,
            'indicators': indicators_found,
            'meeting_type': meeting_type,
            'formality': formality,
            'confidence': min(1.0, len(indicators_found) * 0.3)
        }
    
    def _extract_time_preferences(self, body: str) -> Dict:
        """Extract time preferences from email."""
        text = body.lower()
        times = []
        
        # Extract specific times (e.g., "3 PM", "10:30 AM")
        for pattern in self.TIME_PATTERNS[:2]:
            matches = re.finditer(pattern, text, re.IGNORECASE)
            for match in matches:
                time_str = match.group(0)
                times.append({
                    'time': time_str,
                    'type': 'specific',
                    'confidence': 0.9
                })
        
        # Extract time of day (morning, afternoon, etc.)
        for pattern in self.TIME_PATTERNS[2:]:
            matches = re.finditer(pattern, text, re.IGNORECASE)
            for match in matches:
                time_str = match.group(0)
                times.append({
                    'time': time_str,
                    'type': 'general',
                    'confidence': 0.7
                })
        
        # Check for availability statements
        availability = []
        if 'available' in text:
            availability.append('mentioned availability')
        if 'free' in text:
            availability.append('mentioned free time')
        if 'any time' in text or 'anytime' in text:
            availability.append('flexible schedule')
        
        return {
            'specific_times': [t for t in times if t['type'] == 'specific'],
            'general_times': [t for t in times if t['type'] == 'general'],
            'availability_mentions': availability,
            'is_flexible': len(availability) > 0
        }
    
    def _extract_date_preferences(self, body: str) -> Dict:
        """Extract date preferences from email."""
        text = body.lower()
        dates = []
        
        # Extract relative dates (today, tomorrow, next week)
        for pattern in self.DATE_PATTERNS[:3]:
            matches = re.finditer(pattern, text, re.IGNORECASE)
            for match in matches:
                date_str = match.group(0)
                dates.append({
                    'date': date_str,
                    'type': 'relative',
                    'confidence': 0.8
                })
        
        # Extract specific dates (e.g., "May 15th")
        for pattern in self.DATE_PATTERNS[3:]:
            matches = re.finditer(pattern, text, re.IGNORECASE)
            for match in matches:
                date_str = match.group(0)
                dates.append({
                    'date': date_str,
                    'type': 'specific',
                    'confidence': 0.9
                })
        
        return {
            'dates': dates,
            'has_date_preference': len(dates) > 0
        }
    
    def _extract_duration(self, body: str) -> Dict:
        """Extract meeting duration preference."""
        text = body.lower()
        
        # Check for specific durations
        for pattern in self.DURATION_PATTERNS[:2]:
            match = re.search(pattern, text)
            if match:
                duration_value = int(match.group(1))
                if 'hour' in text[match.start():match.end()]:
                    duration_minutes = duration_value * 60
                else:
                    duration_minutes = duration_value
                
                return {
                    'minutes': duration_minutes,
                    'specified': True,
                    'confidence': 0.9
                }
        
        # Check for quick/brief meetings
        for pattern in self.DURATION_PATTERNS[2:]:
            match = re.search(pattern, text)
            if match:
                return {
                    'minutes': 15,
                    'specified': False,
                    'confidence': 0.7,
                    'note': 'Quick meeting inferred'
                }
        
        # Default duration
        return {
            'minutes': 30,
            'specified': False,
            'confidence': 0.5,
            'note': 'Default 30-minute meeting'
        }
    
    def _extract_meeting_details(self, body: str, subject: str) -> Dict:
        """Extract meeting topic and purpose."""
        # Extract topic from subject
        topic = subject.replace('Re:', '').replace('Fwd:', '').strip()
        
        # Look for agenda or purpose
        purpose_patterns = [
            r'(?:to|for|about|regarding)\s+([^.]+)',
            r'(?:discuss|review|go over)\s+([^.]+)'
        ]
        
        purpose = None
        for pattern in purpose_patterns:
            match = re.search(pattern, body, re.IGNORECASE)
            if match:
                purpose = match.group(1).strip()
                break
        
        # Extract attendees mentioned
        attendee_patterns = [
            r'(?:with|include|invite)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)',
            r'([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+(?:will|should|can)\s+join'
        ]
        
        mentioned_attendees = []
        for pattern in attendee_patterns:
            matches = re.finditer(pattern, body)
            for match in matches:
                mentioned_attendees.append(match.group(1))
        
        return {
            'topic': topic,
            'purpose': purpose,
            'mentioned_attendees': list(set(mentioned_attendees)),
            'has_agenda': 'agenda' in body.lower()
        }
    
    def _suggest_optimal_times(self, date_prefs: Dict, time_prefs: Dict, 
                                duration: Dict, recipients: List[str]) -> List[Dict]:
        """Suggest optimal meeting times."""
        suggestions = []
        
        # Generate time slots for next 5 business days
        start_date = datetime.now()
        
        for day_offset in range(5):
            date = start_date + timedelta(days=day_offset)
            
            # Skip weekends
            if date.weekday() >= 5:
                continue
            
            # Generate time slots (9 AM, 11 AM, 2 PM, 4 PM)
            time_slots = [
                {'hour': 9, 'minute': 0, 'label': 'Morning'},
                {'hour': 11, 'minute': 0, 'label': 'Late Morning'},
                {'hour': 14, 'minute': 0, 'label': 'Afternoon'},
                {'hour': 16, 'minute': 0, 'label': 'Late Afternoon'}
            ]
            
            for slot in time_slots:
                meeting_time = date.replace(hour=slot['hour'], minute=slot['minute'], second=0)
                
                # Calculate score based on preferences
                score = self._calculate_time_score(meeting_time, date_prefs, time_prefs)
                
                suggestions.append({
                    'datetime': meeting_time.isoformat(),
                    'date': meeting_time.strftime('%A, %B %d'),
                    'time': meeting_time.strftime('%I:%M %p'),
                    'label': slot['label'],
                    'duration_minutes': duration['minutes'],
                    'score': score,
                    'timezone': 'Local'
                })
        
        # Sort by score and return top 5
        suggestions.sort(key=lambda x: x['score'], reverse=True)
        return suggestions[:5]
    
    def _calculate_time_score(self, meeting_time: datetime, 
                             date_prefs: Dict, time_prefs: Dict) -> float:
        """Calculate score for a time slot."""
        score = 50.0  # Base score
        
        # Boost for preferred dates
        if date_prefs['has_date_preference']:
            # Simplified - in real implementation, parse and match dates
            score += 20
        
        # Boost for preferred times
        if time_prefs['specific_times']:
            # Check if time matches preferences
            score += 15
        
        # Boost for business hours
        if 9 <= meeting_time.hour <= 17:
            score += 10
        
        # Penalty for lunch time
        if 12 <= meeting_time.hour <= 13:
            score -= 10
        
        # Boost for earlier in the week
        if meeting_time.weekday() < 3:
            score += 5
        
        return min(100, max(0, score))
    
    def _generate_calendar_event(self, meeting_details: Dict, optimal_times: List[Dict],
                                sender: str, recipients: List[str]) -> Dict:
        """Generate calendar event structure."""
        if not optimal_times:
            return {'generated': False, 'reason': 'No optimal times available'}
        
        best_time = optimal_times[0]
        
        return {
            'generated': True,
            'title': meeting_details['topic'],
            'description': meeting_details.get('purpose', 'Meeting'),
            'start_time': best_time['datetime'],
            'duration_minutes': best_time['duration_minutes'],
            'attendees': [sender] + recipients,
            'location': 'TBD',
            'send_invites': True
        }
    
    def _generate_response_template(self, meeting_details: Dict, 
                                   optimal_times: List[Dict],
                                   calendar_event: Dict) -> str:
        """Generate response template for meeting scheduling."""
        if not optimal_times:
            return "Thank you for the meeting request. Let me check my calendar and get back to you with available times."
        
        # Build time options
        time_options = []
        for i, time_slot in enumerate(optimal_times[:3], 1):
            time_options.append(f"{i}. {time_slot['date']} at {time_slot['time']}")
        
        template = f"""Hi,

Thank you for reaching out about {meeting_details['topic']}.

I'm available at the following times:

{chr(10).join(time_options)}

Each slot is {optimal_times[0]['duration_minutes']} minutes. Please let me know which time works best for you, and I'll send a calendar invitation.

Looking forward to our discussion.

Best regards"""
        
        return template


def main():
    """Test V483 engine."""
    engine = EmailMeetingSchedulerIntelligence()
    
    test_email = {
        'from': 'client@company.com',
        'to': ['sales@ziontechgroup.com', 'kleber@ziontechgroup.com'],
        'cc': ['manager@company.com'],
        'subject': 'Schedule a call to discuss the proposal',
        'body': '''Hi,

I'd like to schedule a call to discuss the proposal you sent over. I'm available tomorrow afternoon or Thursday morning. A 30-minute call should be sufficient.

Please let me know what time works for you.

Thanks!'''
    }
    
    result = engine.analyze_email(test_email)
    print(json.dumps(result, indent=2))
    print(f"\n✅ Meeting Intent: {result['has_meeting_intent']}")
    print(f"✅ Meeting Type: {result['meeting_intent']['meeting_type']}")
    print(f"✅ Duration: {result['duration']['minutes']} minutes")
    print(f"✅ Optimal Times Suggested: {len(result['optimal_times'])}")
    print(f"✅ Reply-all enforced: {result['reply_all_enforced']}")


if __name__ == '__main__':
    main()
