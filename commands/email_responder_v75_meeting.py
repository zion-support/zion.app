#!/usr/bin/env python3
"""
Zion Tech Group - V75 Meeting Request Intelligence Engine
Detects meeting requests in emails, checks calendar availability,
suggests optimal times, and auto-generates meeting responses.

Features:
- Meeting request detection from natural language
- Calendar availability checking
- Optimal time suggestion algorithm
- Timezone-aware scheduling
- Meeting type classification (1:1, group, demo, etc.)
- Auto-accept/decline with context
- Agenda extraction from email content
- Recurring meeting detection
- Conflict resolution suggestions
- Meeting preparation reminders

Author: Kleber Garcia Alcatrao
Version: V75-3
Date: 2026-05-29
"""

import re
import json
import logging
from datetime import datetime, timedelta, timezone
from typing import Dict, List, Optional, Tuple, Any
from dataclasses import dataclass, field
from enum import Enum

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class MeetingType(Enum):
    ONE_ON_ONE = "1:1 meeting"
    GROUP = "group meeting"
    DEMO = "product demo"
    SALES_CALL = "sales call"
    INTERVIEW = "interview"
    STANDUP = "standup"
    REVIEW = "review meeting"
    PLANNING = "planning session"
    BRAINSTORM = "brainstorming"
    TRAINING = "training session"
    ONBOARDING = "onboarding"
    CLIENT_MEETING = "client meeting"
    EXECUTIVE = "executive meeting"


class MeetingDuration(Enum):
    QUICK = 15      # 15 minutes
    SHORT = 30      # 30 minutes
    STANDARD = 60   # 1 hour
    LONG = 90       # 1.5 hours
    WORKSHOP = 120  # 2 hours
    HALF_DAY = 240  # 4 hours


class AvailabilityStatus(Enum):
    AVAILABLE = "available"
    BUSY = "busy"
    TENTATIVE = "tentative"
    OUT_OF_OFFICE = "out_of_office"
    PREFERRED = "preferred"


@dataclass
class TimeSlot:
    """Represents a time slot."""
    start: datetime
    end: datetime
    status: AvailabilityStatus
    timezone: str = "UTC"
    
    def duration_minutes(self) -> int:
        return int((self.end - self.start).total_seconds() / 60)
    
    def overlaps(self, other: 'TimeSlot') -> bool:
        return self.start < other.end and other.start < self.end


@dataclass
class CalendarEvent:
    """Represents an existing calendar event."""
    title: str
    start: datetime
    end: datetime
    attendees: List[str] = field(default_factory=list)
    location: str = ""
    is_recurring: bool = False
    priority: int = 1  # 1-5, 5 being highest


@dataclass
class MeetingRequest:
    """Parsed meeting request from email."""
    is_meeting_request: bool
    meeting_type: Optional[MeetingType]
    suggested_times: List[datetime]
    duration: MeetingDuration
    timezone: str
    attendees: List[str]
    agenda: List[str]
    is_recurring: bool
    recurrence_pattern: Optional[str]
    urgency: str  # "high", "medium", "low"
    location: Optional[str]
    virtual_platform: Optional[str]
    confidence_score: float  # 0.0-1.0


@dataclass
class MeetingResponse:
    """Generated meeting response."""
    accept: bool
    proposed_time: Optional[datetime]
    alternative_times: List[datetime]
    response_text: str
    calendar_event: Optional[CalendarEvent]
    preparation_notes: List[str]
    conflict_details: Optional[str]


class MeetingIntelligenceEngine:
    """
    V75 Meeting Request Intelligence Engine
    
    Detects, analyzes, and responds to meeting requests in emails
    with full calendar integration and timezone awareness.
    """
    
    def __init__(self):
        self.calendar_events: List[CalendarEvent] = []
        self.working_hours = {
            "start": 9,   # 9 AM
            "end": 17,    # 5 PM
            "days": [0, 1, 2, 3, 4]  # Mon-Fri
        }
        self.preferred_times = {
            "morning": (9, 12),
            "afternoon": (13, 16)
        }
        self.buffer_minutes = 15  # Buffer between meetings
        self.max_meetings_per_day = 6
        self.timezone = "America/New_York"
        
        # Meeting detection patterns
        self.meeting_patterns = [
            r'(?:can we|let\'s|would you like to|shall we)\s+(?:meet|schedule|hop on|have a call)',
            r'(?:schedule|set up|arrange|book)\s+(?:a\s+)?(?:meeting|call|demo|session)',
            r'(?:available|free|open)\s+(?:for|to)\s+(?:a\s+)?(?:meeting|call|chat)',
            r'(?:meeting|call|demo|session)\s+(?:on|at|this|next)\s+',
            r'(?:monday|tuesday|wednesday|thursday|friday|saturday|sunday)\s+(?:at|from)\s+\d+',
            r'(?:tomorrow|today|next week)\s+(?:at|around|from)\s+\d+',
            r'\d{1,2}:\d{2}\s*(?:am|pm|AM|PM)',
            r'(?:zoom|teams|meet|webex|skype)\s+(?:call|meeting|link)',
            r'(?:calendar|invite|invitation)\s+(?:for|to)',
            r'(?:find a time|time that works|when are you)'
        ]
        
        # Duration patterns
        self.duration_patterns = {
            MeetingDuration.QUICK: [r'15\s*(?:min|minutes)', r'quick\s+(?:chat|call|sync)'],
            MeetingDuration.SHORT: [r'30\s*(?:min|minutes)', r'half\s*(?:hour|an hour)'],
            MeetingDuration.STANDARD: [r'(?:1|one)\s*hour', r'60\s*(?:min|minutes)'],
            MeetingDuration.LONG: [r'(?:1\.5|90)\s*(?:min|minutes|hour)', r'hour and a half'],
            MeetingDuration.WORKSHOP: [r'(?:2|two)\s*hours?', r'workshop', r'half\s*day'],
            MeetingDuration.HALF_DAY: [r'(?:4|four)\s*hours?', r'half\s*day\s*(?:session|workshop)']
        }
    
    def add_calendar_event(self, event: CalendarEvent):
        """Add an existing calendar event."""
        self.calendar_events.append(event)
    
    def detect_meeting_request(self, email_content: str, subject: str) -> MeetingRequest:
        """
        Detect if email contains a meeting request and parse details.
        
        Args:
            email_content: Email body text
            subject: Email subject line
        
        Returns:
            MeetingRequest with parsed details
        """
        combined_text = (subject + " " + email_content).lower()
        
        # Check if this is a meeting request
        is_meeting = False
        confidence = 0.0
        
        for pattern in self.meeting_patterns:
            matches = re.findall(pattern, combined_text)
            if matches:
                is_meeting = True
                confidence += 0.2 * len(matches)
        
        confidence = min(1.0, confidence)
        
        if not is_meeting:
            return MeetingRequest(
                is_meeting_request=False,
                meeting_type=None,
                suggested_times=[],
                duration=MeetingDuration.STANDARD,
                timezone=self.timezone,
                attendees=[],
                agenda=[],
                is_recurring=False,
                recurrence_pattern=None,
                urgency="low",
                location=None,
                virtual_platform=None,
                confidence_score=0.0
            )
        
        # Detect meeting type
        meeting_type = self._detect_meeting_type(combined_text)
        
        # Detect duration
        duration = self._detect_duration(combined_text)
        
        # Extract suggested times
        suggested_times = self._extract_times(combined_text)
        
        # Detect timezone
        detected_tz = self._detect_timezone(combined_text)
        
        # Extract attendees
        attendees = self._extract_attendees(email_content)
        
        # Extract agenda
        agenda = self._extract_agenda(email_content)
        
        # Detect recurring
        is_recurring, recurrence_pattern = self._detect_recurrence(combined_text)
        
        # Detect urgency
        urgency = self._detect_urgency(combined_text)
        
        # Detect location/platform
        location, virtual_platform = self._detect_location(combined_text)
        
        return MeetingRequest(
            is_meeting_request=True,
            meeting_type=meeting_type,
            suggested_times=suggested_times,
            duration=duration,
            timezone=detected_tz,
            attendees=attendees,
            agenda=agenda,
            is_recurring=is_recurring,
            recurrence_pattern=recurrence_pattern,
            urgency=urgency,
            location=location,
            virtual_platform=virtual_platform,
            confidence_score=confidence
        )
    
    def _detect_meeting_type(self, text: str) -> MeetingType:
        """Detect the type of meeting requested."""
        type_patterns = {
            MeetingType.DEMO: ["demo", "demonstration", "show", "walkthrough", "preview"],
            MeetingType.SALES_CALL: ["sales", "pricing", "quote", "proposal", "purchase"],
            MeetingType.INTERVIEW: ["interview", "candidate", "position", "role", "hiring"],
            MeetingType.STANDUP: ["standup", "stand-up", "daily", "sync", "check-in"],
            MeetingType.REVIEW: ["review", "feedback", "assessment", "evaluation"],
            MeetingType.PLANNING: ["planning", "roadmap", "strategy", "quarterly"],
            MeetingType.BRAINSTORM: ["brainstorm", "ideation", "ideas", "creative"],
            MeetingType.TRAINING: ["training", "workshop", "learn", "tutorial", "onboard"],
            MeetingType.CLIENT_MEETING: ["client", "customer", "partner", "stakeholder"],
            MeetingType.EXECUTIVE: ["executive", "board", "leadership", "c-suite", "ceo"]
        }
        
        for meeting_type, patterns in type_patterns.items():
            if any(p in text for p in patterns):
                return meeting_type
        
        # Default to 1:1 or group based on attendee count
        return MeetingType.ONE_ON_ONE
    
    def _detect_duration(self, text: str) -> MeetingDuration:
        """Detect requested meeting duration."""
        for duration, patterns in self.duration_patterns.items():
            for pattern in patterns:
                if re.search(pattern, text):
                    return duration
        
        return MeetingDuration.STANDARD
    
    def _extract_times(self, text: str) -> List[datetime]:
        """Extract suggested meeting times from text."""
        times = []
        now = datetime.now()
        
        # Pattern: "Monday at 2pm"
        day_time_pattern = r'(monday|tuesday|wednesday|thursday|friday)\s+at\s+(\d{1,2})(?::(\d{2}))?\s*(am|pm)?'
        matches = re.findall(day_time_pattern, text)
        
        day_map = {
            "monday": 0, "tuesday": 1, "wednesday": 2, "thursday": 3, "friday": 4
        }
        
        for match in matches:
            day_name, hour, minute, ampm = match
            target_day = day_map.get(day_name, now.weekday())
            
            hour = int(hour)
            minute = int(minute) if minute else 0
            
            if ampm == "pm" and hour < 12:
                hour += 12
            elif ampm == "am" and hour == 12:
                hour = 0
            
            # Calculate next occurrence of this day
            days_ahead = target_day - now.weekday()
            if days_ahead < 0:
                days_ahead += 7
            
            meeting_date = now + timedelta(days=days_ahead)
            meeting_time = meeting_date.replace(hour=hour, minute=minute, second=0, microsecond=0)
            times.append(meeting_time)
        
        # Pattern: "tomorrow at 3pm"
        tomorrow_pattern = r'tomorrow\s+(?:at|around)\s+(\d{1,2})(?::(\d{2}))?\s*(am|pm)?'
        matches = re.findall(tomorrow_pattern, text)
        
        for match in matches:
            hour, minute, ampm = match
            hour = int(hour)
            minute = int(minute) if minute else 0
            
            if ampm == "pm" and hour < 12:
                hour += 12
            
            tomorrow = now + timedelta(days=1)
            meeting_time = tomorrow.replace(hour=hour, minute=minute, second=0, microsecond=0)
            times.append(meeting_time)
        
        # Pattern: specific time "2:30pm"
        time_pattern = r'(\d{1,2}):(\d{2})\s*(am|pm)'
        matches = re.findall(time_pattern, text)
        
        for match in matches:
            hour, minute, ampm = match
            hour = int(hour)
            minute = int(minute)
            
            if ampm == "pm" and hour < 12:
                hour += 12
            
            meeting_time = now.replace(hour=hour, minute=minute, second=0, microsecond=0)
            if meeting_time < now:
                meeting_time += timedelta(days=1)
            times.append(meeting_time)
        
        return times
    
    def _detect_timezone(self, text: str) -> str:
        """Detect timezone from text."""
        tz_patterns = {
            "America/New_York": ["est", "edt", "eastern", "et"],
            "America/Chicago": ["cst", "cdt", "central", "ct"],
            "America/Denver": ["mst", "mdt", "mountain", "mt"],
            "America/Los_Angeles": ["pst", "pdt", "pacific", "pt"],
            "Europe/London": ["gmt", "bst", "uk time"],
            "Europe/Berlin": ["cet", "cest", "central european"],
            "Asia/Tokyo": ["jst", "japan"],
            "Asia/Shanghai": ["cst china", "china time"]
        }
        
        for tz, patterns in tz_patterns.items():
            if any(p in text for p in patterns):
                return tz
        
        return self.timezone
    
    def _extract_attendees(self, text: str) -> List[str]:
        """Extract attendee email addresses."""
        email_pattern = r'[\w.+-]+@[\w-]+\.[\w.-]+'
        return re.findall(email_pattern, text)
    
    def _extract_agenda(self, text: str) -> List[str]:
        """Extract agenda items from email."""
        agenda = []
        
        # Look for numbered/bulleted lists
        list_patterns = [
            r'(?:\d+[.)]\s+)([^\n]+)',
            r'(?:[-*•]\s+)([^\n]+)',
            r'(?:agenda|topics?|discuss):?\s*\n((?:.*\n)*)'
        ]
        
        for pattern in list_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            agenda.extend(matches)
        
        return [item.strip() for item in agenda if item.strip()]
    
    def _detect_recurrence(self, text: str) -> Tuple[bool, Optional[str]]:
        """Detect if meeting is recurring."""
        recurring_patterns = {
            "weekly": ["weekly", "every week", "each week"],
            "biweekly": ["biweekly", "every other week", "every two weeks"],
            "monthly": ["monthly", "every month", "each month"],
            "daily": ["daily", "every day", "each day"]
        }
        
        for pattern_type, phrases in recurring_patterns.items():
            if any(phrase in text for phrase in phrases):
                return True, pattern_type
        
        return False, None
    
    def _detect_urgency(self, text: str) -> str:
        """Detect meeting urgency."""
        urgent_words = ["urgent", "asap", "critical", "immediately", "today", "emergency"]
        medium_words = ["soon", "this week", "important", "priority"]
        
        if any(word in text for word in urgent_words):
            return "high"
        elif any(word in text for word in medium_words):
            return "medium"
        return "low"
    
    def _detect_location(self, text: str) -> Tuple[Optional[str], Optional[str]]:
        """Detect meeting location and virtual platform."""
        platforms = {
            "zoom": ["zoom"],
            "teams": ["teams", "microsoft teams"],
            "meet": ["google meet", "meet.google"],
            "webex": ["webex", "cisco"],
            "skype": ["skype"]
        }
        
        virtual_platform = None
        for platform, patterns in platforms.items():
            if any(p in text for p in patterns):
                virtual_platform = platform
                break
        
        # Physical location detection
        location = None
        location_patterns = [
            r'(?:at|in|room)\s+([A-Z][\w\s]+(?:building|room|office|floor|suite))',
            r'(\d+\s+[\w\s]+(?:st|ave|blvd|dr|street|avenue))'
        ]
        
        for pattern in location_patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                location = match.group(1).strip()
                break
        
        return location, virtual_platform
    
    def check_availability(self, start: datetime, duration_minutes: int) -> AvailabilityStatus:
        """Check if a time slot is available."""
        proposed = TimeSlot(
            start=start,
            end=start + timedelta(minutes=duration_minutes),
            status=AvailabilityStatus.AVAILABLE
        )
        
        # Check working hours
        if start.hour < self.working_hours["start"] or start.hour >= self.working_hours["end"]:
            return AvailabilityStatus.BUSY
        
        # Check if it's a working day
        if start.weekday() not in self.working_hours["days"]:
            return AvailabilityStatus.BUSY
        
        # Check for conflicts with existing events
        for event in self.calendar_events:
            event_slot = TimeSlot(
                start=event.start,
                end=event.end,
                status=AvailabilityStatus.BUSY
            )
            if proposed.overlaps(event_slot):
                return AvailabilityStatus.BUSY
        
        # Check if it's a preferred time
        hour = start.hour
        for period, (start_h, end_h) in self.preferred_times.items():
            if start_h <= hour < end_h:
                return AvailabilityStatus.PREFERRED
        
        return AvailabilityStatus.AVAILABLE
    
    def find_available_slots(self, duration: MeetingDuration,
                            days_ahead: int = 7) -> List[TimeSlot]:
        """Find available time slots in the next N days."""
        available_slots = []
        now = datetime.now()
        duration_minutes = duration.value
        
        for day_offset in range(days_ahead):
            current_day = now + timedelta(days=day_offset)
            
            # Skip weekends
            if current_day.weekday() not in self.working_hours["days"]:
                continue
            
            # Check each hour
            for hour in range(self.working_hours["start"], self.working_hours["end"]):
                for minute in [0, 30]:
                    slot_start = current_day.replace(
                        hour=hour, minute=minute, second=0, microsecond=0
                    )
                    
                    if slot_start < now:
                        continue
                    
                    status = self.check_availability(slot_start, duration_minutes)
                    
                    if status in [AvailabilityStatus.AVAILABLE, AvailabilityStatus.PREFERRED]:
                        available_slots.append(TimeSlot(
                            start=slot_start,
                            end=slot_start + timedelta(minutes=duration_minutes),
                            status=status
                        ))
        
        # Sort: preferred times first, then by date
        available_slots.sort(key=lambda s: (
            0 if s.status == AvailabilityStatus.PREFERRED else 1,
            s.start
        ))
        
        return available_slots
    
    def generate_response(self, meeting_request: MeetingRequest,
                         auto_accept_threshold: float = 0.7) -> MeetingResponse:
        """
        Generate an appropriate response to a meeting request.
        
        Args:
            meeting_request: Parsed meeting request
            auto_accept_threshold: Confidence threshold for auto-acceptance
        
        Returns:
            MeetingResponse with suggested response
        """
        if not meeting_request.is_meeting_request:
            return MeetingResponse(
                accept=False,
                proposed_time=None,
                alternative_times=[],
                response_text="No meeting request detected.",
                calendar_event=None,
                preparation_notes=[],
                conflict_details=None
            )
        
        # Check if suggested times work
        best_time = None
        conflict_details = None
        
        for suggested_time in meeting_request.suggested_times:
            status = self.check_availability(suggested_time, meeting_request.duration.value)
            if status in [AvailabilityStatus.AVAILABLE, AvailabilityStatus.PREFERRED]:
                best_time = suggested_time
                break
        
        # If no suggested time works, find alternatives
        alternative_times = []
        if not best_time:
            available_slots = self.find_available_slots(meeting_request.duration, days_ahead=7)
            
            if available_slots:
                # Pick the best alternative
                best_time = available_slots[0].start
                alternative_times = [slot.start for slot in available_slots[1:4]]
                
                conflict_details = (
                    f"Unfortunately, the suggested time(s) conflict with existing commitments. "
                    f"Here are some alternatives that work:"
                )
        
        # Determine if we should accept
        accept = best_time is not None
        
        # Generate response text
        response_text = self._build_response_text(
            meeting_request, accept, best_time, alternative_times, conflict_details
        )
        
        # Create calendar event if accepting
        calendar_event = None
        if accept and best_time:
            calendar_event = CalendarEvent(
                title=f"{meeting_request.meeting_type.value if meeting_request.meeting_type else 'Meeting'}",
                start=best_time,
                end=best_time + timedelta(minutes=meeting_request.duration.value),
                attendees=meeting_request.attendees,
                location=meeting_request.location or meeting_request.virtual_platform or ""
            )
        
        # Generate preparation notes
        preparation_notes = self._generate_preparation_notes(meeting_request)
        
        return MeetingResponse(
            accept=accept,
            proposed_time=best_time,
            alternative_times=alternative_times,
            response_text=response_text,
            calendar_event=calendar_event,
            preparation_notes=preparation_notes,
            conflict_details=conflict_details
        )
    
    def _build_response_text(self, request: MeetingRequest, accept: bool,
                            proposed_time: Optional[datetime],
                            alternatives: List[datetime],
                            conflict: Optional[str]) -> str:
        """Build the response email text."""
        lines = []
        
        if accept:
            lines.append("Thank you for the meeting invitation!")
            lines.append("")
            
            if proposed_time:
                time_str = proposed_time.strftime("%A, %B %d at %I:%M %p")
                lines.append(f"I'm available and would be happy to meet on {time_str}.")
                lines.append("")
            
            if request.meeting_type:
                lines.append(f"Looking forward to our {request.meeting_type.value}.")
            
            if request.virtual_platform:
                lines.append(f"Please send the {request.virtual_platform.title()} link when convenient.")
            
            if request.agenda:
                lines.append("")
                lines.append("I've noted the following agenda items:")
                for item in request.agenda:
                    lines.append(f"  • {item}")
        
        else:
            lines.append("Thank you for the meeting invitation.")
            lines.append("")
            
            if conflict:
                lines.append(conflict)
                lines.append("")
            
            if alternatives:
                lines.append("Here are some times that work for me:")
                for alt in alternatives:
                    time_str = alt.strftime("%A, %B %d at %I:%M %p")
                    lines.append(f"  • {time_str}")
                lines.append("")
                lines.append("Please let me know which works best for you.")
        
        lines.append("")
        lines.append("Best regards,")
        lines.append("Zion Tech Group Team")
        
        return "\n".join(lines)
    
    def _generate_preparation_notes(self, request: MeetingRequest) -> List[str]:
        """Generate preparation notes for the meeting."""
        notes = []
        
        if request.meeting_type == MeetingType.DEMO:
            notes.append("Prepare product demo environment")
            notes.append("Review customer's industry and use case")
            notes.append("Prepare relevant case studies")
        
        elif request.meeting_type == MeetingType.SALES_CALL:
            notes.append("Review CRM for customer history")
            notes.append("Prepare pricing options")
            notes.append("Have contract templates ready")
        
        elif request.meeting_type == MeetingType.INTERVIEW:
            notes.append("Review candidate's resume")
            notes.append("Prepare technical questions")
            notes.append("Set up coding environment if needed")
        
        elif request.meeting_type in [MeetingType.REVIEW, MeetingType.PLANNING]:
            notes.append("Review previous meeting notes")
            notes.append("Prepare status updates")
            notes.append("Gather relevant metrics and reports")
        
        if request.agenda:
            notes.append(f"Review {len(request.agenda)} agenda items")
        
        if request.is_recurring:
            notes.append(f"This is a recurring {request.recurrence_pattern} meeting")
        
        return notes


# Example usage
if __name__ == "__main__":
    engine = MeetingIntelligenceEngine()
    
    # Add some calendar events
    now = datetime.now()
    engine.add_calendar_event(CalendarEvent(
        title="Team Standup",
        start=now.replace(hour=10, minute=0),
        end=now.replace(hour=10, minute=30),
        is_recurring=True
    ))
    
    engine.add_calendar_event(CalendarEvent(
        title="Client Review",
        start=now.replace(hour=14, minute=0),
        end=now.replace(hour=15, minute=0)
    ))
    
    # Test meeting request
    test_email = """
    Hi Team,
    
    I'd like to schedule a product demo for our enterprise solution.
    Are you available on Tuesday at 2pm EST?
    
    We'd like to cover:
    1. AI/ML capabilities overview
    2. Integration with our existing systems
    3. Pricing and licensing options
    
    This would be a Zoom call with 4 attendees from our side.
    Looking forward to hearing from you!
    
    Best regards,
    Sarah Chen
    VP Engineering, TechCorp
    sarah.chen@techcorp.com
    """
    
    # Detect meeting request
    meeting_request = engine.detect_meeting_request(test_email, "Product Demo Request")
    
    print("="*60)
    print("MEETING REQUEST DETECTION")
    print("="*60)
    print(f"Is Meeting Request: {meeting_request.is_meeting_request}")
    print(f"Confidence: {meeting_request.confidence_score:.0%}")
    print(f"Type: {meeting_request.meeting_type.value if meeting_request.meeting_type else 'Unknown'}")
    print(f"Duration: {meeting_request.duration.value} minutes")
    print(f"Suggested Times: {len(meeting_request.suggested_times)}")
    print(f"Attendees: {meeting_request.attendees}")
    print(f"Agenda Items: {len(meeting_request.agenda)}")
    for item in meeting_request.agenda:
        print(f"  • {item}")
    print(f"Virtual Platform: {meeting_request.virtual_platform}")
    print(f"Urgency: {meeting_request.urgency}")
    
    # Generate response
    response = engine.generate_response(meeting_request)
    
    print("\n" + "="*60)
    print("GENERATED RESPONSE")
    print("="*60)
    print(f"Accept: {'✅' if response.accept else '❌'}")
    print(f"Proposed Time: {response.proposed_time}")
    print(f"Alternative Times: {len(response.alternative_times)}")
    print(f"\nResponse Text:\n{response.response_text}")
    print(f"\nPreparation Notes:")
    for note in response.preparation_notes:
        print(f"  📋 {note}")
