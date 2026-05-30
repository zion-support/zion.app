#!/usr/bin/env python3
"""
V162 - AI Email Smart Scheduling Assistant
Intelligent meeting scheduling with timezone optimization, attendee
availability detection, auto-generated agendas, and conflict resolution.
"""

import json
import re
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional, Tuple
from collections import defaultdict


class SmartSchedulingAssistant:
    """AI-powered intelligent meeting scheduling assistant."""

    def __init__(self):
        self.timezone_db = self._build_timezone_db()
        self.meeting_types = self._build_meeting_types()
        self.scheduling_history = []
        self.attendee_preferences = defaultdict(dict)
        self.conflict_patterns = []

    def _build_timezone_db(self) -> Dict[str, Dict]:
        """Build timezone database."""
        return {
            'EST': {'offset': -5, 'cities': ['New York', 'Miami', 'Boston', 'Atlanta']},
            'CST': {'offset': -6, 'cities': ['Chicago', 'Dallas', 'Houston', 'Mexico City']},
            'MST': {'offset': -7, 'cities': ['Denver', 'Phoenix', 'Salt Lake City']},
            'PST': {'offset': -8, 'cities': ['Los Angeles', 'San Francisco', 'Seattle', 'Vancouver']},
            'GMT': {'offset': 0, 'cities': ['London', 'Dublin', 'Lisbon']},
            'CET': {'offset': 1, 'cities': ['Paris', 'Berlin', 'Rome', 'Madrid', 'Amsterdam']},
            'IST': {'offset': 5.5, 'cities': ['Mumbai', 'Delhi', 'Bangalore']},
            'JST': {'offset': 9, 'cities': ['Tokyo', 'Osaka']},
            'AEST': {'offset': 10, 'cities': ['Sydney', 'Melbourne', 'Brisbane']},
            'BRT': {'offset': -3, 'cities': ['São Paulo', 'Rio de Janeiro', 'Brasília']}
        }

    def _build_meeting_types(self) -> Dict[str, Dict]:
        """Build meeting type configurations."""
        return {
            'quick_sync': {'duration': 15, 'description': 'Quick status update', 'buffer': 5},
            'standup': {'duration': 15, 'description': 'Daily standup', 'buffer': 0},
            'one_on_one': {'duration': 30, 'description': '1:1 meeting', 'buffer': 10},
            'team_meeting': {'duration': 60, 'description': 'Team meeting', 'buffer': 15},
            'client_call': {'duration': 60, 'description': 'Client meeting', 'buffer': 15},
            'workshop': {'duration': 120, 'description': 'Workshop/training', 'buffer': 30},
            'strategy_session': {'duration': 90, 'description': 'Strategy meeting', 'buffer': 15},
            'interview': {'duration': 45, 'description': 'Interview', 'buffer': 15},
            'demo': {'duration': 45, 'description': 'Product demo', 'buffer': 15},
            'board_meeting': {'duration': 120, 'description': 'Board/executive meeting', 'buffer': 30}
        }

    def analyze_scheduling_request(self, email: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze email for scheduling intent and generate proposals."""
        content = f"{email.get('subject', '')} {email.get('body', '')}"
        sender = email.get('from', '')

        # Detect scheduling intent
        intent = self._detect_scheduling_intent(content)
        if not intent['is_scheduling']:
            return {'is_scheduling': False, 'message': 'No scheduling intent detected'}

        # Extract attendees
        attendees = self._extract_attendees(email)

        # Detect meeting type
        meeting_type = self._detect_meeting_type(content)

        # Extract time preferences
        time_preferences = self._extract_time_preferences(content)

        # Detect timezone information
        timezones = self._detect_timezones(email, attendees)

        # Generate optimal time slots
        proposed_slots = self._generate_time_slots(
            attendees, meeting_type, time_preferences, timezones
        )

        # Generate agenda
        agenda = self._generate_agenda(email, meeting_type, attendees)

        # Check for conflicts
        conflicts = self._detect_conflicts(proposed_slots, attendees)

        # Build scheduling response
        response = {
            'scheduling_id': f"sched_{datetime.now().strftime('%Y%m%d%H%M%S')}",
            'timestamp': datetime.now().isoformat(),
            'is_scheduling': True,
            'meeting_type': meeting_type,
            'meeting_config': self.meeting_types.get(meeting_type['type'], {}),
            'attendees': attendees,
            'timezones': timezones,
            'time_preferences': time_preferences,
            'proposed_slots': proposed_slots[:5],
            'agenda': agenda,
            'conflicts': conflicts,
            'calendar_invite': self._generate_ics_template(proposed_slots, attendees, agenda, email),
            'reply_all_for_scheduling': True,
            'follow_up_reminder': self._schedule_follow_up(proposed_slots)
        }

        self.scheduling_history.append(response)
        return response

    def _detect_scheduling_intent(self, content: str) -> Dict[str, Any]:
        """Detect if email contains scheduling intent."""
        scheduling_phrases = [
            'schedule a meeting', 'set up a call', 'book a time', 'find a time',
            'are you available', 'when works for you', 'let\'s meet', 'calendar invite',
            'meeting request', 'appointment', 'can we talk', 'quick call',
            'discuss over a call', 'hop on a call', 'grab some time',
            'meeting tomorrow', 'meeting next week', 'free this week'
        ]

        content_lower = content.lower()
        detected = [p for p in scheduling_phrases if p in content_lower]

        return {
            'is_scheduling': len(detected) > 0,
            'confidence': min(len(detected) * 0.3, 1.0),
            'phrases_detected': detected
        }

    def _extract_attendees(self, email: Dict[str, Any]) -> List[Dict[str, str]]:
        """Extract meeting attendees from email."""
        attendees = []

        # Primary sender
        sender = email.get('from', '')
        if sender:
            attendees.append({
                'email': sender,
                'role': 'organizer',
                'name': self._extract_name(sender)
            })

        # CC recipients
        for cc in email.get('cc', []):
            attendees.append({
                'email': cc,
                'role': 'participant',
                'name': self._extract_name(cc)
            })

        # Extract mentioned names from body
        body = email.get('body', '')
        name_patterns = re.findall(r'\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\b', body)
        for name in name_patterns[:5]:
            if not any(a['name'] == name for a in attendees):
                attendees.append({
                    'email': 'unknown',
                    'role': 'mentioned',
                    'name': name
                })

        return attendees

    def _extract_name(self, email: str) -> str:
        """Extract name from email address."""
        if '<' in email and '>' in email:
            return email.split('<')[0].strip()
        local = email.split('@')[0] if '@' in email else email
        return local.replace('.', ' ').replace('_', ' ').replace('-', ' ').title()

    def _detect_meeting_type(self, content: str) -> Dict[str, str]:
        """Detect meeting type from content."""
        content_lower = content.lower()

        type_indicators = {
            'quick_sync': ['quick sync', 'quick catch', 'brief update', '5 minute'],
            'standup': ['standup', 'stand-up', 'daily check'],
            'one_on_one': ['1:1', 'one on one', 'one-on-one', 'just us two'],
            'team_meeting': ['team meeting', 'all hands', 'team sync', 'weekly meeting'],
            'client_call': ['client', 'customer', 'prospect', 'demo call'],
            'workshop': ['workshop', 'training', 'hands-on', 'session'],
            'strategy_session': ['strategy', 'planning', 'roadmap', 'quarterly'],
            'interview': ['interview', 'candidate', 'hiring'],
            'demo': ['demo', 'demonstration', 'walkthrough', 'product tour'],
            'board_meeting': ['board', 'executive', 'leadership', 'steering']
        }

        for mtype, indicators in type_indicators.items():
            if any(ind in content_lower for ind in indicators):
                config = self.meeting_types.get(mtype, {})
                return {
                    'type': mtype,
                    'duration_minutes': config.get('duration', 60),
                    'description': config.get('description', 'Meeting'),
                    'confidence': 0.8
                }

        # Default
        return {
            'type': 'team_meeting',
            'duration_minutes': 60,
            'description': 'Meeting',
            'confidence': 0.5
        }

    def _extract_time_preferences(self, content: str) -> Dict[str, Any]:
        """Extract time preferences from content."""
        preferences = {
            'dates': [],
            'times': [],
            'days': [],
            'urgency': 'normal'
        }

        # Date patterns
        date_patterns = [
            r'\b(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})\b',
            r'\b((?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\w*\s+\d{1,2})\b',
            r'\b(today|tomorrow|next\s+\w+day|this\s+\w+day)\b'
        ]
        for pattern in date_patterns:
            matches = re.findall(pattern, content, re.IGNORECASE)
            preferences['dates'].extend(matches)

        # Time patterns
        time_patterns = [
            r'\b(\d{1,2}:\d{2}\s*(?:am|pm))\b',
            r'\b(\d{1,2}\s*(?:am|pm))\b',
            r'\b(morning|afternoon|evening)\b'
        ]
        for pattern in time_patterns:
            matches = re.findall(pattern, content, re.IGNORECASE)
            preferences['times'].extend(matches)

        # Day patterns
        days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
        for day in days:
            if day in content.lower():
                preferences['days'].append(day)

        # Urgency
        if any(w in content.lower() for w in ['asap', 'urgent', 'immediately', 'today']):
            preferences['urgency'] = 'high'
        elif any(w in content.lower() for w in ['this week', 'soon']):
            preferences['urgency'] = 'medium'

        return preferences

    def _detect_timezones(self, email: Dict, attendees: List[Dict]) -> Dict[str, Any]:
        """Detect timezones for attendees."""
        content = f"{email.get('subject', '')} {email.get('body', '')}"
        detected_tzs = {}

        # Check for explicit timezone mentions
        for tz_code, tz_info in self.timezone_db.items():
            if tz_code in content.upper():
                detected_tzs[tz_code] = tz_info

        # Infer from email domains
        for attendee in attendees:
            email_addr = attendee.get('email', '')
            domain = email_addr.split('@')[-1].lower() if '@' in email_addr else ''

            domain_tz_map = {
                '.uk': 'GMT', '.de': 'CET', '.fr': 'CET', '.es': 'CET',
                '.jp': 'JST', '.cn': 'CST', '.in': 'IST',
                '.br': 'BRT', '.au': 'AEST'
            }

            for suffix, tz in domain_tz_map.items():
                if suffix in domain:
                    detected_tzs[tz] = self.timezone_db[tz]
                    break

        if not detected_tzs:
            detected_tzs['EST'] = self.timezone_db['EST']

        return detected_tzs

    def _generate_time_slots(self, attendees: List, meeting_type: Dict,
                             preferences: Dict, timezones: Dict) -> List[Dict[str, Any]]:
        """Generate optimal meeting time slots."""
        now = datetime.now()
        duration = meeting_type.get('duration_minutes', 60)
        slots = []

        # Determine best hours based on timezones
        tz_offsets = [tz['offset'] for tz in timezones.values()]
        if tz_offsets:
            min_offset = min(tz_offsets)
            max_offset = max(tz_offsets)
            # Find overlap window (9am-5pm for all timezones)
            earliest_start = 9 - min_offset  # Convert to UTC
            latest_end = 17 - max_offset
            overlap_start = max(earliest_start, 8)
            overlap_end = min(latest_end, 18)
        else:
            overlap_start, overlap_end = 9, 17

        # Generate slots for next 5 business days
        for day_offset in range(7):
            date = now + timedelta(days=day_offset)
            if date.weekday() >= 5:  # Skip weekends
                continue

            # Generate hourly slots during overlap
            for hour in range(int(overlap_start), int(overlap_end)):
                slot_start = date.replace(hour=hour, minute=0, second=0, microsecond=0)
                slot_end = slot_start + timedelta(minutes=duration)

                if slot_start <= now:
                    continue

                # Score the slot
                score = self._score_time_slot(slot_start, preferences, timezones)

                slots.append({
                    'start': slot_start.isoformat(),
                    'end': slot_end.isoformat(),
                    'start_display': slot_start.strftime('%A, %B %d at %I:%M %p'),
                    'duration_minutes': duration,
                    'score': round(score, 2),
                    'timezone_converted': self._convert_to_all_timezones(slot_start, timezones),
                    'is_preferred': self._is_preferred_time(slot_start, preferences)
                })

        # Sort by score
        slots.sort(key=lambda x: x['score'], reverse=True)
        return slots

    def _score_time_slot(self, slot: datetime, preferences: Dict, timezones: Dict) -> float:
        """Score a time slot (0-100)."""
        score = 50  # Baseline

        # Preferred hours (10-11am, 2-4pm are best)
        hour = slot.hour
        if hour in [10, 11]:
            score += 15
        elif hour in [14, 15, 16]:
            score += 10
        elif hour in [9, 12, 13]:
            score += 5

        # Day preference
        day_name = slot.strftime('%A').lower()
        if day_name in preferences.get('days', []):
            score += 15

        # Mid-week bonus
        if slot.weekday() in [1, 2, 3]:  # Tue-Thu
            score += 10

        # Avoid Monday morning and Friday afternoon
        if slot.weekday() == 0 and hour < 10:
            score -= 15
        if slot.weekday() == 4 and hour >= 15:
            score -= 10

        # Time preference match
        for time_str in preferences.get('times', []):
            if 'morning' in time_str.lower() and 9 <= hour <= 12:
                score += 10
            elif 'afternoon' in time_str.lower() and 13 <= hour <= 17:
                score += 10

        return max(0, min(100, score))

    def _is_preferred_time(self, slot: datetime, preferences: Dict) -> bool:
        """Check if slot matches stated preferences."""
        day_name = slot.strftime('%A').lower()
        if day_name in preferences.get('days', []):
            return True
        for time_str in preferences.get('times', []):
            if 'morning' in time_str.lower() and 9 <= slot.hour <= 12:
                return True
            if 'afternoon' in time_str.lower() and 13 <= slot.hour <= 17:
                return True
        return False

    def _convert_to_all_timezones(self, dt: datetime, timezones: Dict) -> Dict[str, str]:
        """Convert time to all relevant timezones."""
        conversions = {}
        for tz_code, tz_info in timezones.items():
            offset = tz_info['offset']
            converted = dt + timedelta(hours=offset)
            conversions[tz_code] = converted.strftime('%I:%M %p')
        return conversions

    def _generate_agenda(self, email: Dict, meeting_type: Dict, attendees: List) -> Dict[str, Any]:
        """Generate meeting agenda from email context."""
        subject = email.get('subject', '')
        body = email.get('body', '')

        # Extract agenda items
        items = []
        bullet_patterns = [r'[-•*]\s*(.+)', r'\d+[.)]\s*(.+)', r'(?:discuss|review|cover)\s+(.+?)(?:\.|$)']
        for pattern in bullet_patterns:
            matches = re.findall(pattern, body, re.IGNORECASE)
            items.extend([m.strip() for m in matches if len(m.strip()) > 5])

        if not items:
            # Generate default agenda based on meeting type
            default_agendas = {
                'quick_sync': ['Status updates', 'Blockers', 'Next steps'],
                'one_on_one': ['Check-in', 'Progress review', 'Feedback', 'Career development'],
                'team_meeting': ['Wins & updates', 'Challenges', 'Priorities', 'Action items'],
                'client_call': ['Project status', 'Feedback', 'Next milestones', 'Q&A'],
                'strategy_session': ['Goals review', 'Market analysis', 'Initiatives', 'Resource planning'],
                'demo': ['Introduction', 'Key features', 'Use cases', 'Q&A', 'Next steps']
            }
            items = default_agendas.get(meeting_type['type'], ['Introduction', 'Discussion', 'Action items'])

        duration = meeting_type.get('duration_minutes', 60)
        time_per_item = max(5, duration // max(len(items), 1))

        return {
            'title': subject or f"{meeting_type.get('description', 'Meeting')}",
            'items': [{'topic': item, 'time_minutes': time_per_item} for item in items[:8]],
            'total_duration': duration,
            'attendees': [a.get('name', 'Unknown') for a in attendees]
        }

    def _detect_conflicts(self, slots: List[Dict], attendees: List) -> List[Dict[str, Any]]:
        """Detect potential scheduling conflicts."""
        conflicts = []

        # Check for timezone spread > 8 hours
        if slots and slots[0].get('timezone_converted'):
            tz_times = slots[0]['timezone_converted']
            if len(tz_times) > 1:
                conflicts.append({
                    'type': 'timezone_spread',
                    'severity': 'warning',
                    'message': 'Large timezone spread - some attendees may need to meet outside business hours',
                    'affected_timezones': list(tz_times.keys())
                })

        # Check for too many attendees
        if len(attendees) > 8:
            conflicts.append({
                'type': 'large_group',
                'severity': 'info',
                'message': f'{len(attendees)} attendees - consider if all are necessary',
                'attendee_count': len(attendees)
            })

        return conflicts

    def _generate_ics_template(self, slots: List[Dict], attendees: List,
                                agenda: Dict, email: Dict) -> Dict[str, str]:
        """Generate ICS calendar invite template."""
        if not slots:
            return {}

        best_slot = slots[0]
        attendee_emails = [a.get('email', '') for a in attendees if '@' in a.get('email', '')]

        ics_content = f"""BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Zion Tech Group//Meeting Scheduler//EN
BEGIN:VEVENT
DTSTART:{best_slot['start'].replace('-','').replace(':','')[:15]}00Z
DTEND:{best_slot['end'].replace('-','').replace(':','')[:15]}00Z
SUMMARY:{agenda['title']}
DESCRIPTION:{chr(10).join(f"- {item['topic']}" for item in agenda['items'])}
ATTENDEES:{','.join(attendee_emails)}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR"""

        return {
            'ics_content': ics_content,
            'filename': f"meeting_{datetime.now().strftime('%Y%m%d')}.ics",
            'best_slot': best_slot['start_display']
        }

    def _schedule_follow_up(self, slots: List[Dict]) -> Dict[str, Any]:
        """Schedule follow-up reminder."""
        if not slots:
            return {}

        return {
            'reminder_type': 'scheduling_confirmation',
            'trigger': '24_hours_before',
            'message': 'Reminder: Meeting scheduled for tomorrow. Please confirm attendance.',
            'auto_send': True
        }


def process_scheduling_request(email_data: Dict[str, Any]) -> Dict[str, Any]:
    """Main entry point for scheduling analysis."""
    assistant = SmartSchedulingAssistant()
    return assistant.analyze_scheduling_request(email_data)


if __name__ == '__main__':
    test_email = {
        'from': 'manager@company.com',
        'subject': 'Strategy session next week',
        'body': 'Hi team, let\'s schedule a strategy session next Tuesday or Wednesday afternoon. '
                'We need to discuss Q2 roadmap, resource planning, and the new partnership opportunity. '
                'Please let me know your availability. CC: sarah@company.com, john@company.com',
        'cc': ['sarah@company.com', 'john@company.com'],
        'date': '2024-01-15T10:00:00'
    }
    result = process_scheduling_request(test_email)
    print(json.dumps(result, indent=2))
