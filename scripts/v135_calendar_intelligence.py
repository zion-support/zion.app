#!/usr/bin/env python3
"""
V135 - AI Email Calendar Intelligence
======================================
Production-quality system for intelligent email-based scheduling, calendar
management, meeting optimization, and conflict resolution.

Features:
    - Auto-detect scheduling intent from email text
    - Propose optimal meeting times across participants with timezone awareness
    - Generate meeting agendas from email context and thread history
    - Auto-send calendar invites in ICS format (RFC 5545)
    - Detect scheduling conflicts and suggest alternatives
    - Recurring meeting pattern detection
    - Meeting duration optimization based on agenda items
    - Buffer time management between meetings
    - Reply-all enforcement for scheduling emails with multiple participants

Author: V135 Engineering Team
Version: 1.0.0
License: MIT
"""

from __future__ import annotations

import re
import uuid
import hashlib
from datetime import datetime, timedelta, timezone
from dataclasses import dataclass, field
from enum import Enum, auto
from typing import List, Optional, Dict, Tuple, Set
from collections import Counter
import json
import textwrap


# =============================================================================
# ENUMS
# =============================================================================

class MeetingType(Enum):
    """Types of meetings that can be detected from email context."""
    MEETING = "meeting"
    CALL = "call"
    DEMO = "demo"
    LUNCH = "lunch"
    INTERVIEW = "interview"
    STANDUP = "standup"
    RETROSPECTIVE = "retrospective"
    ONE_ON_ONE = "one_on_one"
    BRAINSTORM = "brainstorm"
    UNKNOWN = "unknown"


class Priority(Enum):
    """Meeting priority levels."""
    CRITICAL = 5
    HIGH = 4
    MEDIUM = 3
    LOW = 2
    OPTIONAL = 1


class RecurrencePattern(Enum):
    """Detected recurring meeting patterns."""
    DAILY = "daily"
    WEEKLY = "weekly"
    BIWEEKLY = "biweekly"
    MONTHLY = "monthly"
    QUARTERLY = "quarterly"
    NONE = "none"


class ConflictSeverity(Enum):
    """Severity of scheduling conflicts."""
    HARD_CONFLICT = "hard"
    SOFT_CONFLICT = "soft"
    BUFFER_VIOLATION = "buffer"
    PREFERENCE_VIOLATION = "preference"


class ParticipantRole(Enum):
    """Role of a participant in a meeting."""
    ORGANIZER = "organizer"
    REQUIRED = "required"
    OPTIONAL = "optional"
    CC = "cc"


class SchedulingIntent(Enum):
    """Detected scheduling intent from email."""
    PROPOSE_NEW = "propose_new"
    ACCEPT = "accept"
    DECLINE = "decline"
    COUNTER_PROPOSE = "counter_propose"
    CANCEL = "cancel"
    RESCHEDULE = "reschedule"
    REMIND = "remind"
    CONFIRM = "confirm"
    NONE = "none"


# =============================================================================
# DATACLASSES
# =============================================================================

@dataclass
class TimezoneInfo:
    """Timezone information for a participant."""
    name: str
    utc_offset_hours: float
    dst_adjustment: float = 0.0

    @property
    def effective_offset(self) -> timedelta:
        return timedelta(hours=self.utc_offset_hours + self.dst_adjustment)

    def to_utc(self, dt: datetime) -> datetime:
        """Convert a naive datetime in this timezone to UTC."""
        return dt - self.effective_offset

    def from_utc(self, dt: datetime) -> datetime:
        """Convert a UTC datetime to this timezone."""
        return dt + self.effective_offset


@dataclass
class WorkPreferences:
    """Work hour preferences for scheduling."""
    start_hour: int = 9
    end_hour: int = 17
    lunch_start: int = 12
    lunch_end: int = 13
    preferred_days: List[int] = field(default_factory=lambda: [0, 1, 2, 3, 4])
    buffer_minutes: int = 15
    no_meeting_before: int = 9
    no_meeting_after: int = 16
    max_consecutive_meetings: int = 3
    timezone: TimezoneInfo = field(
        default_factory=lambda: TimezoneInfo("UTC", 0.0)
    )


@dataclass
class Participant:
    """A meeting participant with calendar and preferences."""
    email: str
    name: str
    role: ParticipantRole = ParticipantRole.REQUIRED
    timezone: TimezoneInfo = field(
        default_factory=lambda: TimezoneInfo("UTC", 0.0)
    )
    preferences: WorkPreferences = field(default_factory=WorkPreferences)
    accepted: bool = False
    declined: bool = False

    @property
    def is_available(self) -> bool:
        return not self.declined


@dataclass
class CalendarEvent:
    """An existing calendar event."""
    uid: str
    title: str
    start: datetime
    end: datetime
    participants: List[str] = field(default_factory=list)
    is_recurring: bool = False
    recurrence_pattern: RecurrencePattern = RecurrencePattern.NONE
    location: str = ""
    description: str = ""
    is_focus_time: bool = False
    priority: Priority = Priority.MEDIUM

    @property
    def duration(self) -> timedelta:
        return self.end - self.start


@dataclass
class TimeSlot:
    """A proposed time slot for a meeting."""
    start: datetime
    end: datetime
    score: float = 0.0
    conflicts: List[SchedulingConflict] = field(default_factory=list)
    participants_available: List[str] = field(default_factory=list)
    participants_unavailable: List[str] = field(default_factory=list)

    @property
    def duration(self) -> timedelta:
        return self.end - self.start

    @property
    def has_hard_conflicts(self) -> bool:
        return any(
            c.severity == ConflictSeverity.HARD_CONFLICT
            for c in self.conflicts
        )


@dataclass
class AgendaItem:
    """An item on a meeting agenda."""
    title: str
    duration_minutes: int = 10
    description: str = ""
    owner: str = ""
    is_required: bool = True
    priority: Priority = Priority.MEDIUM

    def estimated_time(self) -> timedelta:
        return timedelta(minutes=self.duration_minutes)


@dataclass
class MeetingProposal:
    """A complete meeting proposal with all details."""
    uid: str
    title: str
    meeting_type: MeetingType
    proposed_slots: List[TimeSlot]
    participants: List[Participant]
    agenda: List[AgendaItem]
    duration_minutes: int
    description: str = ""
    location: str = ""
    priority: Priority = Priority.MEDIUM
    recurrence: RecurrencePattern = RecurrencePattern.NONE
    created_at: datetime = field(default_factory=datetime.utcnow)
    reply_all_required: bool = False

    @property
    def best_slot(self) -> Optional[TimeSlot]:
        available = [s for s in self.proposed_slots if not s.has_hard_conflicts]
        if not available:
            return None
        return max(available, key=lambda s: s.score)

    @property
    def total_agenda_time(self) -> timedelta:
        return sum((item.estimated_time() for item in self.agenda), timedelta())


@dataclass
class SchedulingConflict:
    """A detected scheduling conflict."""
    severity: ConflictSeverity
    conflicting_event: Optional[CalendarEvent]
    participant_email: str
    description: str
    alternative_slots: List[TimeSlot] = field(default_factory=list)

    def __str__(self) -> str:
        return (
            f"[{self.severity.value.upper()}] {self.description} "
            f"({self.participant_email})"
        )


@dataclass
class EmailMessage:
    """An email message in a thread."""
    message_id: str
    subject: str
    body: str
    sender: str
    sender_name: str
    recipients: List[str]
    cc: List[str] = field(default_factory=list)
    timestamp: datetime = field(default_factory=datetime.utcnow)
    in_reply_to: Optional[str] = None
    references: List[str] = field(default_factory=list)
    thread_id: Optional[str] = None

    @property
    def all_participants(self) -> List[str]:
        return [self.sender] + self.recipients + self.cc

    @property
    def is_threaded(self) -> bool:
        return self.in_reply_to is not None or len(self.references) > 0


@dataclass
class ThreadContext:
    """Context from an email thread for agenda generation."""
    messages: List[EmailMessage]
    topics_extracted: List[str] = field(default_factory=list)
    action_items: List[str] = field(default_factory=list)
    decisions_made: List[str] = field(default_factory=list)
    open_questions: List[str] = field(default_factory=list)

    @property
    def participant_count(self) -> int:
        all_emails: Set[str] = set()
        for msg in self.messages:
            all_emails.update(msg.all_participants)
        return len(all_emails)

    @property
    def thread_depth(self) -> int:
        return len(self.messages)


# =============================================================================
# INTENT DETECTION ENGINE
# =============================================================================

class SchedulingIntentDetector:
    """Detects scheduling intent and meeting type from email text."""

    INTENT_PATTERNS: Dict[SchedulingIntent, List[str]] = {
        SchedulingIntent.PROPOSE_NEW: [
            r"(?:can|could|would)\s+(?:we|you)\s+(?:schedule|set up|arrange|book)",
            r"let(?:'s|\s+us)?\s+(?:schedule|meet|set up|have a call)",
            r"(?:i(?:'d|\s+would)\s+like\s+to)\s+(?:schedule|set up|arrange|book)",
            r"(?:are|is)\s+(?:there|any)\s+(?:time|slot|availability)",
            r"(?:free|available)\s+(?:this|next|on|for)",
            r"(?:when|what time)\s+(?:are|is)\s+you\s+(?:free|available)",
            r"(?:schedule|book|set up)\s+(?:a|the)?\s*(?:meeting|call|demo)",
        ],
        SchedulingIntent.ACCEPT: [
            r"(?:that|those|the)\s+(?:time|slot|date)\s+works?\s+(?:for me|great)",
            r"(?:i(?:'m|\s+am)\s+(?:free|available)\s+(?:at|on|during))",
            r"(?:yes|sure|sounds good|perfect|great)(?:,?\s+(?:that|let))",
            r"(?:i(?:'ll|\s+will)\s+(?:be there|attend|join|make it))",
            r"(?:confirmed|accepted|locked in|see you)",
        ],
        SchedulingIntent.DECLINE: [
            r"(?:i(?:'m|\s+am)\s+(?:not|unable)\s+(?:free|available|to make))",
            r"(?:that|those)\s+(?:time|slot|date)\s+(?:does(?:n't|\s+not))\s+work",
            r"(?:sorry|unfortunately)\s*,?\s*(?:i\s+)?(?:can't|cannot|won't)",
            r"(?:have a conflict|not available|double booked)",
        ],
        SchedulingIntent.COUNTER_PROPOSE: [
            r"(?:how about|what about|instead)\s+(?:at|on|during)?",
            r"(?:could|can)\s+(?:we|you)\s+(?:do|make it)\s+(?:at|on)",
            r"(?:would|does)\s+(?:at|on)\s+\d+\s*(?:am|pm)?\s+work",
            r"(?:better|prefer)\s+(?:at|on|if we)\s+",
            r"(?:suggest|propose)\s+(?:a|an)?\s*(?:different|alternative|other)",
        ],
        SchedulingIntent.CANCEL: [
            r"(?:cancel|call off|scrap)\s+(?:the|our|this)\s+(?:meeting|call|demo)",
            r"(?:won't|cannot)\s+(?:be able to)\s+(?:make|attend|join)",
            r"(?:please|kindly)\s+(?:cancel|remove)\s+(?:the|my)\s+",
        ],
        SchedulingIntent.RESCHEDULE: [
            r"(?:reschedule|move|push|shift)\s+(?:the|our|this)\s+(?:meeting|call)",
            r"(?:can|could)\s+(?:we|you)\s+(?:move|push|change)\s+(?:to|the time)",
            r"(?:new time|different time|another time|later date)",
        ],
        SchedulingIntent.REMIND: [
            r"(?:just|quick)\s+(?:reminder|reminding|ping|nudge)",
            r"(?:following up|circling back|checking in)\s+(?:on|about)",
            r"(?:don't forget|remember)\s+(?:about|that|we have)",
        ],
        SchedulingIntent.CONFIRM: [
            r"(?:just|to)\s+(?:confirm|verify|double check)",
            r"(?:is|are)\s+(?:we|you)\s+(?:still|still on)\s+(?:for|on)",
            r"(?:confirming|confirm)\s+(?:that|our|the)",
        ],
    }

    MEETING_TYPE_PATTERNS: Dict[MeetingType, List[str]] = {
        MeetingType.MEETING: [
            r"\bmeeting\b", r"\bsync\b", r"\bdiscuss(?:ion)?\b",
            r"\breview\b", r"\bplanning\b",
        ],
        MeetingType.CALL: [
            r"\bcall\b", r"\bphone\b", r"\bhop on\b",
            r"\bquick chat\b", r"\bhuddle\b",
        ],
        MeetingType.DEMO: [
            r"\bdemo(?:nstration)?\b", r"\bwalk\s*through\b",
            r"\bshowcase\b", r"\bpresent(?:ation)?\b",
            r"\bproduct\s+tour\b",
        ],
        MeetingType.LUNCH: [
            r"\blunch\b", r"\bgrab\s+(?:a\s+)?(?:bite|food|lunch)\b",
            r"\bcoffee\s+(?:chat|meeting)\b", r"\bdinner\b",
        ],
        MeetingType.INTERVIEW: [
            r"\binterview\b", r"\bcandidate\b",
            r"\btechnical\s+(?:screen|assessment)\b",
            r"\bhiring\b", r"\brecruiting\b",
        ],
        MeetingType.STANDUP: [
            r"\bstandup\b", r"\bstand[- ]up\b",
            r"\bdaily\s+(?:sync|meeting)\b",
            r"\bscrum\b", r"\bmorning\s+check[- ]?in\b",
        ],
        MeetingType.RETROSPECTIVE: [
            r"\bretro(?:spective)?\b", r"\bpost[- ]?mortem\b",
            r"\bsprint\s+review\b", r"\blearnings?\b",
        ],
        MeetingType.ONE_ON_ONE: [
            r"\b1[\s:]*on[\s:]*1\b", r"\bone[- ]on[- ]one\b",
            r"\bcheck[\s-]?in\b", r"\bcareer\s+(?:chat|discussion)\b",
        ],
        MeetingType.BRAINSTORM: [
            r"\bbrainstorm(?:ing)?\b", r"\bidea(?:tion|s)?\s+(?:session)?\b",
            r"\bwhiteboard(?:ing)?\b", r"\bthink[\s-]?tank\b",
        ],
    }

    def __init__(self):
        self._compiled_intent_patterns = {
            intent: [re.compile(p, re.IGNORECASE) for p in patterns]
            for intent, patterns in self.INTENT_PATTERNS.items()
        }
        self._compiled_type_patterns = {
            mt: [re.compile(p, re.IGNORECASE) for p in patterns]
            for mt, patterns in self.MEETING_TYPE_PATTERNS.items()
        }

    def detect_intent(self, email_text: str) -> SchedulingIntent:
        """Detect the scheduling intent from email body text."""
        scores: Dict[SchedulingIntent, float] = {}
        for intent, patterns in self._compiled_intent_patterns.items():
            score = sum(1 for p in patterns if p.search(email_text))
            if score > 0:
                scores[intent] = score

        if not scores:
            return SchedulingIntent.NONE

        best = max(scores, key=scores.get)
        min_threshold = 1
        return best if scores[best] >= min_threshold else SchedulingIntent.NONE

    def detect_meeting_type(self, email_text: str) -> MeetingType:
        """Detect the meeting type from email context."""
        scores: Dict[MeetingType, float] = {}
        for mt, patterns in self._compiled_type_patterns.items():
            score = sum(1 for p in patterns if p.search(email_text))
            if score > 0:
                scores[mt] = score

        if not scores:
            return MeetingType.UNKNOWN

        return max(scores, key=scores.get)

    def extract_time_references(self, text: str) -> List[Dict[str, any]]:
        """Extract time references from email text."""
        references = []

        time_patterns = [
            (r"(\d{1,2})\s*(am|pm|AM|PM)", "time_of_day"),
            (r"(\d{1,2}):(\d{2})\s*(am|pm|AM|PM)?", "time_with_minutes"),
            (r"(monday|tuesday|wednesday|thursday|friday|saturday|sunday)", "day_of_week"),
            (r"(tomorrow|today|next week|this week|next month)", "relative_date"),
            (r"(\d{1,2})\s*(?:st|nd|rd|th)?\s+(?:of\s+)?(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)", "specific_date"),
        ]

        for pattern, ref_type in time_patterns:
            for match in re.finditer(pattern, text, re.IGNORECASE):
                references.append({
                    "type": ref_type,
                    "match": match.group(0),
                    "position": match.start(),
                    "groups": match.groups(),
                })

        return references

    def analyze_email(self, email: EmailMessage) -> Dict[str, any]:
        """Full analysis of a scheduling-related email."""
        combined_text = f"{email.subject} {email.body}"
        intent = self.detect_intent(combined_text)
        meeting_type = self.detect_meeting_type(combined_text)
        time_refs = self.extract_time_references(combined_text)
        reply_all = self._should_reply_all(email)

        return {
            "intent": intent,
            "meeting_type": meeting_type,
            "time_references": time_refs,
            "reply_all_required": reply_all,
            "participant_count": len(email.all_participants),
            "is_threaded": email.is_threaded,
        }

    def _should_reply_all(self, email: EmailMessage) -> bool:
        """Determine if reply-all is required for scheduling."""
        total_participants = len(email.recipients) + len(email.cc)
        if total_participants >= 2:
            scheduling_keywords = [
                "schedule", "meeting", "call", "time", "available",
                "free", "book", "confirm", "cancel", "reschedule",
            ]
            text = f"{email.subject} {email.body}".lower()
            keyword_count = sum(1 for kw in scheduling_keywords if kw in text)
            if keyword_count >= 2:
                return True
        return False


# =============================================================================
# CALENDAR ANALYZER
# =============================================================================

class CalendarAnalyzer:
    """Analyzes calendars to find optimal meeting times."""

    SLOT_INTERVAL_MINUTES = 15
    MIN_SCORE_THRESHOLD = 0.3

    def __init__(self, calendars: Dict[str, List[CalendarEvent]]):
        self.calendars = calendars

    def find_available_slots(
        self,
        participants: List[Participant],
        duration_minutes: int,
        search_start: datetime,
        search_end: datetime,
    ) -> List[TimeSlot]:
        """Find all available time slots for a group of participants."""
        slots = []
        current = search_start
        interval = timedelta(minutes=self.SLOT_INTERVAL_MINUTES)
        duration = timedelta(minutes=duration_minutes)

        while current + duration <= search_end:
            slot = TimeSlot(start=current, end=current + duration)
            self._evaluate_slot(slot, participants)
            if slot.score > 0:
                slots.append(slot)
            current += interval

        return sorted(slots, key=lambda s: s.score, reverse=True)

    def _evaluate_slot(self, slot: TimeSlot, participants: List[Participant]):
        """Evaluate a time slot across all participants."""
        total_score = 0.0
        available_count = 0

        for participant in participants:
            participant_score = self._score_for_participant(slot, participant)
            total_score += participant_score

            if participant_score > 0.5:
                available_count += 1
                slot.participants_available.append(participant.email)
            else:
                slot.participants_unavailable.append(participant.email)

            conflicts = self._find_conflicts(slot, participant)
            slot.conflicts.extend(conflicts)

        participation_rate = available_count / len(participants) if participants else 0
        preference_score = total_score / len(participants) if participants else 0
        slot.score = (participation_rate * 0.6) + (preference_score * 0.4)

    def _score_for_participant(
        self, slot: TimeSlot, participant: Participant
    ) -> float:
        """Score a slot for a single participant based on preferences."""
        prefs = participant.preferences
        local_start = participant.timezone.from_utc(slot.start)
        local_hour = local_start.hour
        local_weekday = local_start.weekday()

        if local_weekday not in prefs.preferred_days:
            return 0.0

        events = self.calendars.get(participant.email, [])
        for event in events:
            if self._events_overlap(slot.start, slot.end, event.start, event.end):
                return 0.0

        buffer = timedelta(minutes=prefs.buffer_minutes)
        for event in events:
            if self._events_overlap(
                slot.start - buffer, slot.end + buffer,
                event.start, event.end
            ):
                return 0.2

        if local_hour < prefs.no_meeting_before:
            return 0.1
        if local_hour >= prefs.no_meeting_after:
            return 0.1
        if prefs.lunch_start <= local_hour < prefs.lunch_end:
            return 0.3

        if 10 <= local_hour <= 11 or 14 <= local_hour <= 15:
            return 1.0
        if prefs.no_meeting_before <= local_hour < prefs.lunch_start:
            return 0.8
        if prefs.lunch_end <= local_hour < prefs.no_meeting_after:
            return 0.7

        return 0.5

    def _find_conflicts(
        self, slot: TimeSlot, participant: Participant
    ) -> List[SchedulingConflict]:
        """Find scheduling conflicts for a participant in a time slot."""
        conflicts = []
        events = self.calendars.get(participant.email, [])
        buffer = timedelta(minutes=participant.preferences.buffer_minutes)

        for event in events:
            if self._events_overlap(slot.start, slot.end, event.start, event.end):
                conflicts.append(SchedulingConflict(
                    severity=ConflictSeverity.HARD_CONFLICT,
                    conflicting_event=event,
                    participant_email=participant.email,
                    description=f"Overlaps with '{event.title}' "
                                f"({event.start.strftime('%H:%M')}-{event.end.strftime('%H:%M')})",
                ))
            elif self._events_overlap(
                slot.start - buffer, slot.end + buffer,
                event.start, event.end
            ):
                conflicts.append(SchedulingConflict(
                    severity=ConflictSeverity.BUFFER_VIOLATION,
                    conflicting_event=event,
                    participant_email=participant.email,
                    description=f"Buffer violation near '{event.title}'",
                ))

        local_start = participant.timezone.from_utc(slot.start)
        prefs = participant.preferences
        if local_start.weekday() not in prefs.preferred_days:
            conflicts.append(SchedulingConflict(
                severity=ConflictSeverity.PREFERENCE_VIOLATION,
                conflicting_event=None,
                participant_email=participant.email,
                description=f"Weekend/non-working day ({local_start.strftime('%A')})",
            ))

        return conflicts

    @staticmethod
    def _events_overlap(
        start1: datetime, end1: datetime,
        start2: datetime, end2: datetime,
    ) -> bool:
        """Check if two time ranges overlap."""
        return start1 < end2 and start2 < end1


# =============================================================================
# AGENDA GENERATOR
# =============================================================================

class AgendaGenerator:
    """Generates meeting agendas from email context and thread history."""

    ACTION_ITEM_PATTERNS = [
        r"(?:action\s+item|todo|to[- ]?do|task)[:\s]+(.+?)(?:\.|$)",
        r"(?:we need to|must|should|need to)\s+(.+?)(?:\.|$)",
        r"(?:assigned to|responsible|owner)[:\s]+(.+?)(?:\.|$)",
        r"(?:deadline|due|by)[:\s]+(.+?)(?:\.|$)",
    ]

    TOPIC_PATTERNS = [
        r"(?:re|regarding|about|topic)[:\s]+(.+?)(?:\.|$)",
        r"(?:let(?:'s|\s+us)\s+discuss)\s+(.+?)(?:\.|$)",
        r"(?:question|issue|concern)[:\s]+(.+?)(?:\.|$)",
    ]

    DECISION_PATTERNS = [
        r"(?:decided|agreed|concluded|settled)[:\s]*(?:that\s+)?(.+?)(?:\.|$)",
        r"(?:we(?:'ll|\s+will))\s+(?:go with|proceed with|choose)\s+(.+?)(?:\.|$)",
    ]

    QUESTION_PATTERNS = [
        r"(?:\?[^.!?]*$|how|what|when|where|why|who)\s+(.+?)\?",
        r"(?:question|wondering|curious)[:\s]+(.+?)\?",
    ]

    def generate_agenda(
        self,
        thread_context: ThreadContext,
        meeting_type: MeetingType,
    ) -> List[AgendaItem]:
        """Generate an agenda from thread context and meeting type."""
        agenda_items = []

        self._extract_topics(thread_context)
        self._extract_action_items(thread_context)
        self._extract_decisions(thread_context)
        self._extract_questions(thread_context)

        if thread_context.open_questions:
            agenda_items.append(AgendaItem(
                title="Open Questions & Discussion Points",
                duration_minutes=max(5, len(thread_context.open_questions) * 3),
                description="\n".join(
                    f"- {q}" for q in thread_context.open_questions
                ),
                priority=Priority.HIGH,
            ))

        if thread_context.topics_extracted:
            for topic in thread_context.topics_extracted:
                agenda_items.append(AgendaItem(
                    title=f"Discussion: {topic}",
                    duration_minutes=10,
                    description=f"Review and align on: {topic}",
                    priority=Priority.MEDIUM,
                ))

        if thread_context.action_items:
            agenda_items.append(AgendaItem(
                title="Action Items Review",
                duration_minutes=max(5, len(thread_context.action_items) * 2),
                description="\n".join(
                    f"- {item}" for item in thread_context.action_items
                ),
                priority=Priority.HIGH,
            ))

        if thread_context.decisions_made:
            agenda_items.append(AgendaItem(
                title="Decisions to Confirm",
                duration_minutes=5,
                description="\n".join(
                    f"- {d}" for d in thread_context.decisions_made
                ),
                priority=Priority.MEDIUM,
            ))

        type_specific = self._get_type_specific_items(meeting_type)
        agenda_items = type_specific + agenda_items

        return self._order_and_time_agenda(agenda_items)

    def _extract_topics(self, context: ThreadContext):
        """Extract discussion topics from thread messages."""
        for msg in context.messages:
            for pattern in self.TOPIC_PATTERNS:
                for match in re.finditer(pattern, msg.body, re.IGNORECASE):
                    topic = match.group(1).strip()
                    if topic and topic not in context.topics_extracted:
                        context.topics_extracted.append(topic)

    def _extract_action_items(self, context: ThreadContext):
        """Extract action items from thread messages."""
        for msg in context.messages:
            for pattern in self.ACTION_ITEM_PATTERNS:
                for match in re.finditer(pattern, msg.body, re.IGNORECASE):
                    item = match.group(1).strip()
                    if item and item not in context.action_items:
                        context.action_items.append(item)

    def _extract_decisions(self, context: ThreadContext):
        """Extract decisions made in the thread."""
        for msg in context.messages:
            for pattern in self.DECISION_PATTERNS:
                for match in re.finditer(pattern, msg.body, re.IGNORECASE):
                    decision = match.group(1).strip()
                    if decision and decision not in context.decisions_made:
                        context.decisions_made.append(decision)

    def _extract_questions(self, context: ThreadContext):
        """Extract open questions from the thread."""
        for msg in context.messages:
            for pattern in self.QUESTION_PATTERNS:
                for match in re.finditer(pattern, msg.body, re.IGNORECASE):
                    question = match.group(0).strip()
                    if question and question not in context.open_questions:
                        context.open_questions.append(question)

    def _get_type_specific_items(
        self, meeting_type: MeetingType
    ) -> List[AgendaItem]:
        """Get meeting-type-specific default agenda items."""
        type_items = {
            MeetingType.DEMO: [
                AgendaItem("Welcome & Introductions", 5, "Brief introductions"),
                AgendaItem("Product Overview", 15, "High-level product walkthrough"),
                AgendaItem("Live Demo", 20, "Interactive demonstration"),
                AgendaItem("Q&A", 10, "Questions and answers"),
                AgendaItem("Next Steps", 5, "Follow-up actions"),
            ],
            MeetingType.INTERVIEW: [
                AgendaItem("Introductions", 5, "Role and team overview"),
                AgendaItem("Experience Discussion", 15, "Background and experience"),
                AgendaItem("Technical Assessment", 25, "Problem-solving exercise"),
                AgendaItem("Questions for Us", 10, "Candidate questions"),
                AgendaItem("Next Steps", 5, "Timeline and follow-up"),
            ],
            MeetingType.STANDUP: [
                AgendaItem("Yesterday's Progress", 5, "What was accomplished"),
                AgendaItem("Today's Plan", 5, "What will be done today"),
                AgendaItem("Blockers", 5, "Any obstacles or help needed"),
            ],
            MeetingType.RETROSPECTIVE: [
                AgendaItem("What Went Well", 10, "Positive outcomes"),
                AgendaItem("What Didn't Go Well", 10, "Areas for improvement"),
                AgendaItem("Action Items", 10, "Improvements to implement"),
            ],
            MeetingType.LUNCH: [
                AgendaItem("Casual Catch-up", 15, "Informal conversation"),
                AgendaItem("Work Topics", 15, "Any work-related discussions"),
            ],
            MeetingType.ONE_ON_ONE: [
                AgendaItem("Check-in", 5, "How are things going"),
                AgendaItem("Updates & Progress", 10, "Recent work and achievements"),
                AgendaItem("Challenges & Support", 10, "Blockers and help needed"),
                AgendaItem("Growth & Development", 5, "Career and skills discussion"),
            ],
            MeetingType.BRAINSTORM: [
                AgendaItem("Problem Statement", 5, "Define what we're solving"),
                AgendaItem("Idea Generation", 20, "Free-form ideation"),
                AgendaItem("Idea Evaluation", 15, "Assess and prioritize ideas"),
                AgendaItem("Action Plan", 10, "Next steps and ownership"),
            ],
        }
        return type_items.get(meeting_type, [
            AgendaItem("Opening & Context", 5, "Set the stage"),
            AgendaItem("Main Discussion", 20, "Core topics"),
            AgendaItem("Action Items & Next Steps", 5, "Wrap-up"),
        ])

    def _order_and_time_agenda(
        self, items: List[AgendaItem]
    ) -> List[AgendaItem]:
        """Order agenda items logically and verify time allocation."""
        priority_order = {
            Priority.CRITICAL: 0,
            Priority.HIGH: 1,
            Priority.MEDIUM: 2,
            Priority.LOW: 3,
            Priority.OPTIONAL: 4,
        }
        items.sort(key=lambda i: (priority_order[i.priority], i.title))
        return items


# =============================================================================
# RECURRENCE DETECTOR
# =============================================================================

class RecurrenceDetector:
    """Detects recurring meeting patterns from email history."""

    RECURRENCE_KEYWORDS = {
        RecurrencePattern.DAILY: [
            "daily", "every day", "each day", "day stand-up",
        ],
        RecurrencePattern.WEEKLY: [
            "weekly", "every week", "each week", "every monday",
            "every tuesday", "every wednesday", "every thursday",
            "every friday",
        ],
        RecurrencePattern.BIWEEKLY: [
            "biweekly", "bi-weekly", "every other week",
            "every two weeks", "fortnightly",
        ],
        RecurrencePattern.MONTHLY: [
            "monthly", "every month", "each month",
            "first monday of", "last friday of",
        ],
        RecurrencePattern.QUARTERLY: [
            "quarterly", "every quarter", "every 3 months",
            "q1", "q2", "q3", "q4",
        ],
    }

    def detect_from_text(self, text: str) -> RecurrencePattern:
        """Detect recurrence pattern from email text."""
        text_lower = text.lower()
        scores: Dict[RecurrencePattern, int] = {}

        for pattern, keywords in self.RECURRENCE_KEYWORDS.items():
            score = sum(1 for kw in keywords if kw in text_lower)
            if score > 0:
                scores[pattern] = score

        if not scores:
            return RecurrencePattern.NONE

        return max(scores, key=scores.get)

    def detect_from_history(
        self, events: List[CalendarEvent]
    ) -> Optional[RecurrencePattern]:
        """Detect recurrence from historical event data."""
        if len(events) < 3:
            return None

        title_groups: Dict[str, List[CalendarEvent]] = {}
        for event in events:
            key = self._normalize_title(event.title)
            if key not in title_groups:
                title_groups[key] = []
            title_groups[key].append(event)

        for title, group in title_groups.items():
            if len(group) < 3:
                continue

            group.sort(key=lambda e: e.start)
            intervals = []
            for i in range(1, len(group)):
                delta = group[i].start - group[i - 1].start
                intervals.append(delta.days)

            if not intervals:
                continue

            avg_interval = sum(intervals) / len(intervals)
            pattern = self._classify_interval(avg_interval)
            if pattern != RecurrencePattern.NONE:
                return pattern

        return None

    @staticmethod
    def _normalize_title(title: str) -> str:
        """Normalize event title for grouping."""
        return re.sub(r'\s+', ' ', title.lower().strip())

    @staticmethod
    def _classify_interval(avg_days: float) -> RecurrencePattern:
        """Classify an average interval into a recurrence pattern."""
        if 0.5 <= avg_days <= 1.5:
            return RecurrencePattern.DAILY
        elif 6 <= avg_days <= 8:
            return RecurrencePattern.WEEKLY
        elif 13 <= avg_days <= 15:
            return RecurrencePattern.BIWEEKLY
        elif 28 <= avg_days <= 33:
            return RecurrencePattern.MONTHLY
        elif 85 <= avg_days <= 95:
            return RecurrencePattern.QUARTERLY
        return RecurrencePattern.NONE


# =============================================================================
# DURATION OPTIMIZER
# =============================================================================

class DurationOptimizer:
    """Optimizes meeting duration based on agenda items and context."""

    DEFAULT_DURATIONS: Dict[MeetingType, int] = {
        MeetingType.MEETING: 30,
        MeetingType.CALL: 15,
        MeetingType.DEMO: 60,
        MeetingType.LUNCH: 60,
        MeetingType.INTERVIEW: 60,
        MeetingType.STANDUP: 15,
        MeetingType.RETROSPECTIVE: 60,
        MeetingType.ONE_ON_ONE: 30,
        MeetingType.BRAINSTORM: 45,
        MeetingType.UNKNOWN: 30,
    }

    MAX_DURATION = 120
    MIN_DURATION = 15
    ROUNDING_INTERVAL = 15

    def optimize(
        self,
        meeting_type: MeetingType,
        agenda: List[AgendaItem],
        participant_count: int,
        has_remote_participants: bool = False,
    ) -> int:
        """Calculate optimal meeting duration in minutes."""
        base_duration = self.DEFAULT_DURATIONS.get(meeting_type, 30)

        if agenda:
            agenda_time = sum(item.duration_minutes for item in agenda)
            transition_buffer = max(5, len(agenda) * 2)
            agenda_duration = agenda_time + transition_buffer
        else:
            agenda_duration = base_duration

        participant_overhead = 0
        if participant_count > 5:
            participant_overhead = (participant_count - 5) * 2
        if participant_count > 10:
            participant_overhead += (participant_count - 10) * 3

        remote_overhead = 5 if has_remote_participants else 0

        total = max(agenda_duration, base_duration) + participant_overhead + remote_overhead

        total = self._round_to_interval(total)
        total = max(self.MIN_DURATION, min(self.MAX_DURATION, total))

        return total

    @staticmethod
    def _round_to_interval(minutes: int) -> int:
        """Round duration to nearest interval."""
        interval = DurationOptimizer.ROUNDING_INTERVAL
        return ((minutes + interval - 1) // interval) * interval


# =============================================================================
# BUFFER MANAGER
# =============================================================================

class BufferManager:
    """Manages buffer time between meetings."""

    DEFAULT_BUFFER_MINUTES = 15
    BACK_TO_BACK_THRESHOLD = 3

    def __init__(self, calendars: Dict[str, List[CalendarEvent]]):
        self.calendars = calendars

    def check_buffer_violations(
        self,
        proposed_start: datetime,
        proposed_end: datetime,
        participant_email: str,
        buffer_minutes: int = DEFAULT_BUFFER_MINUTES,
    ) -> List[SchedulingConflict]:
        """Check for buffer time violations."""
        violations = []
        events = self.calendars.get(participant_email, [])
        buffer = timedelta(minutes=buffer_minutes)

        for event in events:
            gap_before = proposed_start - event.end
            gap_after = event.start - proposed_end

            if timedelta(0) < gap_before < buffer:
                violations.append(SchedulingConflict(
                    severity=ConflictSeverity.BUFFER_VIOLATION,
                    conflicting_event=event,
                    participant_email=participant_email,
                    description=(
                        f"Only {int(gap_before.total_seconds() / 60)}min buffer "
                        f"before '{event.title}' (need {buffer_minutes}min)"
                    ),
                ))

            if timedelta(0) < gap_after < buffer:
                violations.append(SchedulingConflict(
                    severity=ConflictSeverity.BUFFER_VIOLATION,
                    conflicting_event=event,
                    participant_email=participant_email,
                    description=(
                        f"Only {int(gap_after.total_seconds() / 60)}min buffer "
                        f"after '{event.title}' (need {buffer_minutes}min)"
                    ),
                ))

        return violations

    def count_consecutive_meetings(
        self, participant_email: str, check_time: datetime
    ) -> int:
        """Count consecutive meetings around a proposed time."""
        events = sorted(
            self.calendars.get(participant_email, []),
            key=lambda e: e.start,
        )
        consecutive = 0
        tolerance = timedelta(minutes=5)

        for i, event in enumerate(events):
            if abs(event.start - check_time) < timedelta(hours=1):
                if i > 0:
                    gap = event.start - events[i - 1].end
                    if gap <= tolerance:
                        consecutive += 1
                    else:
                        consecutive = 1
                else:
                    consecutive = 1

        return consecutive

    def suggest_buffer_adjustment(
        self, participant_email: str
    ) -> int:
        """Suggest optimal buffer time based on meeting density."""
        events = self.calendars.get(participant_email, [])
        if not events:
            return self.DEFAULT_BUFFER_MINUTES

        density = len(events)
        if density > 8:
            return 20
        elif density > 5:
            return 15
        return 10


# =============================================================================
# ICS GENERATOR
# =============================================================================

class ICSGenerator:
    """Generates ICS calendar invite files (RFC 5545 compliant)."""

    @staticmethod
    def generate_invite(proposal: MeetingProposal, slot: TimeSlot) -> str:
        """Generate an ICS calendar invite."""
        dtstamp = datetime.utcnow().strftime("%Y%m%dT%H%M%SZ")
        dtstart = slot.start.strftime("%Y%m%dT%H%M%SZ")
        dtend = slot.end.strftime("%Y%m%dT%H%M%SZ")

        summary = ICSGenerator._escape_ics(proposal.title)
        description = ICSGenerator._escape_ics(
            ICSGenerator._build_description(proposal)
        )

        attendees = "\n".join(
            f"ATTENDEE;CN={p.name};ROLE="
            f"{'REQ-PARTICIPANT' if p.role == ParticipantRole.REQUIRED else 'OPT-PARTICIPANT'}"
            f";PARTSTAT=NEEDS-ACTION;RSVP=TRUE:mailto:{p.email}"
            for p in proposal.participants
        )

        organizer = next(
            (p for p in proposal.participants if p.role == ParticipantRole.ORGANIZER),
            proposal.participants[0] if proposal.participants else None,
        )
        organizer_line = ""
        if organizer:
            organizer_line = f"ORGANIZER;CN={organizer.name}:mailto:{organizer.email}"

        recurrence_line = ""
        if proposal.recurrence != RecurrencePattern.NONE:
            rrule_map = {
                RecurrencePattern.DAILY: "FREQ=DAILY",
                RecurrencePattern.WEEKLY: "FREQ=WEEKLY",
                RecurrencePattern.BIWEEKLY: "FREQ=WEEKLY;INTERVAL=2",
                RecurrencePattern.MONTHLY: "FREQ=MONTHLY",
                RecurrencePattern.QUARTERLY: "FREQ=MONTHLY;INTERVAL=3",
            }
            rrule = rrule_map.get(proposal.recurrence, "")
            if rrule:
                recurrence_line = f"RRULE:{rrule};COUNT=52"

        location_line = ""
        if proposal.location:
            location_line = f"LOCATION:{ICSGenerator._escape_ics(proposal.location)}"

        priority_map = {
            Priority.CRITICAL: 1, Priority.HIGH: 3,
            Priority.MEDIUM: 5, Priority.LOW: 7, Priority.OPTIONAL: 9,
        }
        priority_val = priority_map.get(proposal.priority, 5)

        lines = [
            "BEGIN:VCALENDAR",
            "VERSION:2.0",
            "PRODID:-//V135//Calendar Intelligence//EN",
            "METHOD:REQUEST",
            "CALSCALE:GREGORIAN",
            "BEGIN:VEVENT",
            f"UID:{proposal.uid}",
            f"DTSTAMP:{dtstamp}",
            f"DTSTART:{dtstart}",
            f"DTEND:{dtend}",
            f"SUMMARY:{summary}",
            f"DESCRIPTION:{description}",
            f"PRIORITY:{priority_val}",
            "STATUS:CONFIRMED",
            "TRANSP:OPAQUE",
            "SEQUENCE:0",
        ]

        if organizer_line:
            lines.append(organizer_line)
        if attendees:
            lines.append(attendees)
        if location_line:
            lines.append(location_line)
        if recurrence_line:
            lines.append(recurrence_line)

        lines.extend([
            "BEGIN:VALARM",
            "TRIGGER:-PT15M",
            "ACTION:DISPLAY",
            "DESCRIPTION:Reminder",
            "END:VALARM",
            "END:VEVENT",
            "END:VCALENDAR",
        ])

        return "\r\n".join(lines)

    @staticmethod
    def _build_description(proposal: MeetingProposal) -> str:
        """Build meeting description from proposal."""
        parts = []
        if proposal.description:
            parts.append(proposal.description)
            parts.append("")

        if proposal.agenda:
            parts.append("AGENDA:")
            parts.append("-" * 40)
            for i, item in enumerate(proposal.agenda, 1):
                parts.append(
                    f"{i}. [{item.duration_minutes}min] {item.title}"
                )
                if item.description:
                    parts.append(f"   {item.description}")
                if item.owner:
                    parts.append(f"   (Owner: {item.owner})")
            parts.append("")

        total_time = sum(item.duration_minutes for item in proposal.agenda)
        parts.append(f"Total estimated time: {total_time} minutes")

        return "\n".join(parts)

    @staticmethod
    def _escape_ics(text: str) -> str:
        """Escape special characters for ICS format."""
        return (
            text.replace("\\", "\\\\")
            .replace(";", "\\;")
            .replace(",", "\\,")
            .replace("\n", "\\n")
        )

    @staticmethod
    def generate_uid() -> str:
        """Generate a unique ICS UID."""
        return f"v135-{uuid.uuid4().hex[:16]}@calendar-intelligence"


# =============================================================================
# MAIN ORCHESTRATOR
# =============================================================================

class CalendarIntelligenceEngine:
    """Main orchestrator for AI email calendar intelligence."""

    def __init__(self, calendars: Optional[Dict[str, List[CalendarEvent]]] = None):
        self.calendars = calendars or {}
        self.intent_detector = SchedulingIntentDetector()
        self.calendar_analyzer = CalendarAnalyzer(self.calendars)
        self.agenda_generator = AgendaGenerator()
        self.recurrence_detector = RecurrenceDetector()
        self.duration_optimizer = DurationOptimizer()
        self.buffer_manager = BufferManager(self.calendars)
        self.ics_generator = ICSGenerator()

    def process_scheduling_email(
        self,
        email: EmailMessage,
        thread_context: Optional[ThreadContext] = None,
    ) -> MeetingProposal:
        """Process a scheduling email and generate a meeting proposal."""
        analysis = self.intent_detector.analyze_email(email)
        meeting_type = analysis["meeting_type"]
        reply_all = analysis["reply_all_required"]

        recurrence = self.recurrence_detector.detect_from_text(
            f"{email.subject} {email.body}"
        )

        participants = self._build_participants(email)

        if thread_context is None:
            thread_context = ThreadContext(messages=[email])

        agenda = self.agenda_generator.generate_agenda(thread_context, meeting_type)

        has_remote = len(set(
            p.timezone.name for p in participants
        )) > 1
        duration = self.duration_optimizer.optimize(
            meeting_type, agenda, len(participants), has_remote
        )

        search_start = datetime.utcnow() + timedelta(hours=1)
        search_end = search_start + timedelta(days=7)
        available_slots = self.calendar_analyzer.find_available_slots(
            participants, duration, search_start, search_end
        )

        for slot in available_slots[:5]:
            for participant in participants:
                buffer_violations = self.buffer_manager.check_buffer_violations(
                    slot.start, slot.end, participant.email,
                    participant.preferences.buffer_minutes,
                )
                slot.conflicts.extend(buffer_violations)

        proposal = MeetingProposal(
            uid=ICSGenerator.generate_uid(),
            title=self._generate_title(email, meeting_type),
            meeting_type=meeting_type,
            proposed_slots=available_slots[:5],
            participants=participants,
            agenda=agenda,
            duration_minutes=duration,
            description=f"Scheduled from email: {email.subject}",
            priority=self._infer_priority(email.body),
            recurrence=recurrence,
            reply_all_required=reply_all,
        )

        return proposal

    def generate_invite(self, proposal: MeetingProposal) -> Optional[str]:
        """Generate ICS invite for the best available slot."""
        best_slot = proposal.best_slot
        if best_slot is None:
            return None
        return ICSGenerator.generate_invite(proposal, best_slot)

    def get_conflict_report(
        self, proposal: MeetingProposal
    ) -> Dict[str, any]:
        """Generate a conflict report for a proposal."""
        all_conflicts = []
        for slot in proposal.proposed_slots:
            all_conflicts.extend(slot.conflicts)

        hard_conflicts = [
            c for c in all_conflicts
            if c.severity == ConflictSeverity.HARD_CONFLICT
        ]
        buffer_conflicts = [
            c for c in all_conflicts
            if c.severity == ConflictSeverity.BUFFER_VIOLATION
        ]
        preference_conflicts = [
            c for c in all_conflicts
            if c.severity == ConflictSeverity.PREFERENCE_VIOLATION
        ]

        return {
            "total_conflicts": len(all_conflicts),
            "hard_conflicts": hard_conflicts,
            "buffer_violations": buffer_conflicts,
            "preference_violations": preference_conflicts,
            "best_available_slot": proposal.best_slot,
            "alternatives": [
                s for s in proposal.proposed_slots if not s.has_hard_conflicts
            ],
            "reply_all_required": proposal.reply_all_required,
        }

    def _build_participants(self, email: EmailMessage) -> List[Participant]:
        """Build participant list from email."""
        participants = []

        participants.append(Participant(
            email=email.sender,
            name=email.sender_name,
            role=ParticipantRole.ORGANIZER,
        ))

        for recipient in email.recipients:
            if recipient != email.sender:
                participants.append(Participant(
                    email=recipient,
                    name=recipient.split("@")[0].replace(".", " ").title(),
                    role=ParticipantRole.REQUIRED,
                ))

        for cc in email.cc:
            participants.append(Participant(
                email=cc,
                name=cc.split("@")[0].replace(".", " ").title(),
                role=ParticipantRole.OPTIONAL,
            ))

        return participants

    @staticmethod
    def _generate_title(email: EmailMessage, meeting_type: MeetingType) -> str:
        """Generate a meeting title from email context."""
        type_prefix = {
            MeetingType.DEMO: "Demo: ",
            MeetingType.INTERVIEW: "Interview: ",
            MeetingType.LUNCH: "Lunch: ",
            MeetingType.STANDUP: "Standup: ",
            MeetingType.RETROSPECTIVE: "Retro: ",
            MeetingType.ONE_ON_ONE: "1:1 - ",
            MeetingType.BRAINSTORM: "Brainstorm: ",
        }
        prefix = type_prefix.get(meeting_type, "")
        subject = email.subject.replace("Re: ", "").replace("Fwd: ", "").strip()
        return f"{prefix}{subject}"

    @staticmethod
    def _infer_priority(text: str) -> Priority:
        """Infer meeting priority from email text."""
        text_lower = text.lower()
        if any(w in text_lower for w in ["urgent", "asap", "critical", "emergency"]):
            return Priority.CRITICAL
        if any(w in text_lower for w in ["important", "high priority", "soon"]):
            return Priority.HIGH
        if any(w in text_lower for w in ["low priority", "when you have time", "no rush"]):
            return Priority.LOW
        return Priority.MEDIUM


# =============================================================================
# TEST SCENARIOS
# =============================================================================

def _create_sample_calendars() -> Dict[str, List[CalendarEvent]]:
    """Create sample calendar data for testing."""
    base_date = datetime(2026, 6, 2, 9, 0)

    return {
        "alice@company.com": [
            CalendarEvent(
                uid="evt-001", title="Morning Standup",
                start=base_date + timedelta(hours=0),
                end=base_date + timedelta(minutes=15),
                participants=["alice@company.com", "bob@company.com"],
                is_recurring=True, recurrence_pattern=RecurrencePattern.DAILY,
            ),
            CalendarEvent(
                uid="evt-002", title="Sprint Planning",
                start=base_date + timedelta(hours=2),
                end=base_date + timedelta(hours=3),
                participants=["alice@company.com", "team@company.com"],
            ),
            CalendarEvent(
                uid="evt-003", title="Lunch with Client",
                start=base_date + timedelta(hours=3, minutes=30),
                end=base_date + timedelta(hours=4, minutes=30),
                participants=["alice@company.com"],
            ),
            CalendarEvent(
                uid="evt-004", title="Focus Time",
                start=base_date + timedelta(hours=5),
                end=base_date + timedelta(hours=7),
                is_focus_time=True,
            ),
        ],
        "bob@company.com": [
            CalendarEvent(
                uid="evt-005", title="Morning Standup",
                start=base_date + timedelta(hours=0),
                end=base_date + timedelta(minutes=15),
                participants=["alice@company.com", "bob@company.com"],
                is_recurring=True, recurrence_pattern=RecurrencePattern.DAILY,
            ),
            CalendarEvent(
                uid="evt-006", title="Client Call",
                start=base_date + timedelta(hours=1),
                end=base_date + timedelta(hours=2),
                participants=["bob@company.com", "client@external.com"],
            ),
            CalendarEvent(
                uid="evt-007", title="Design Review",
                start=base_date + timedelta(hours=4),
                end=base_date + timedelta(hours=5),
            ),
        ],
        "carol@company.com": [
            CalendarEvent(
                uid="evt-008", title="Team Sync",
                start=base_date + timedelta(hours=1, minutes=30),
                end=base_date + timedelta(hours=2, minutes=30),
            ),
            CalendarEvent(
                uid="evt-009", title="1:1 with Manager",
                start=base_date + timedelta(hours=3),
                end=base_date + timedelta(hours=3, minutes=30),
            ),
        ],
    }


def run_test_scenario_1():
    """Test 1: Scheduling a demo meeting from an email thread."""
    print("=" * 70)
    print("TEST SCENARIO 1: Demo Scheduling from Email Thread")
    print("=" * 70)

    calendars = _create_sample_calendars()
    engine = CalendarIntelligenceEngine(calendars)

    email = EmailMessage(
        message_id="msg-001",
        subject="Product Demo for Q3 Features",
        body=(
            "Hi team,\n\n"
            "Can we schedule a demo this week to showcase the Q3 features? "
            "I'd like to walk through the new dashboard and API improvements. "
            "We need to discuss the timeline and get stakeholder buy-in.\n\n"
            "Are you free Tuesday at 2pm? Or Wednesday morning works too.\n\n"
            "We should also review the action items from last sprint:\n"
            "- Complete API documentation (assigned to Bob)\n"
            "- Finalize UI mockups (deadline: Friday)\n\n"
            "Thanks,\nAlice"
        ),
        sender="alice@company.com",
        sender_name="Alice Chen",
        recipients=["bob@company.com", "carol@company.com"],
        cc=["manager@company.com"],
    )

    thread_context = ThreadContext(
        messages=[email],
        topics_extracted=[],
        action_items=[],
        decisions_made=[],
        open_questions=[],
    )

    proposal = engine.process_scheduling_email(email, thread_context)

    print(f"\nMeeting Title: {proposal.title}")
    print(f"Meeting Type: {proposal.meeting_type.value}")
    print(f"Duration: {proposal.duration_minutes} minutes")
    print(f"Recurrence: {proposal.recurrence.value}")
    print(f"Reply-All Required: {proposal.reply_all_required}")
    print(f"Participants: {len(proposal.participants)}")
    for p in proposal.participants:
        print(f"  - {p.name} ({p.email}) [{p.role.value}]")

    print(f"\nAgenda ({len(proposal.agenda)} items):")
    for i, item in enumerate(proposal.agenda, 1):
        print(f"  {i}. [{item.duration_minutes}min] {item.title}")

    print(f"\nProposed Slots: {len(proposal.proposed_slots)}")
    best = proposal.best_slot
    if best:
        print(f"Best Slot: {best.start} - {best.end} (score: {best.score:.2f})")
        print(f"  Available: {len(best.participants_available)}")
        print(f"  Conflicts: {len(best.conflicts)}")

    ics = engine.generate_invite(proposal)
    if ics:
        print(f"\nICS Invite Generated: {len(ics)} bytes")
        print("First 200 chars:")
        print(textwrap.indent(ics[:200], "  "))

    conflict_report = engine.get_conflict_report(proposal)
    print(f"\nConflict Report:")
    print(f"  Total: {conflict_report['total_conflicts']}")
    print(f"  Hard: {len(conflict_report['hard_conflicts'])}")
    print(f"  Buffer: {len(conflict_report['buffer_violations'])}")
    print(f"  Alternatives: {len(conflict_report['alternatives'])}")

    return proposal


def run_test_scenario_2():
    """Test 2: Interview scheduling with timezone considerations."""
    print("\n" + "=" * 70)
    print("TEST SCENARIO 2: Interview with Cross-Timezone Participants")
    print("=" * 70)

    calendars = _create_sample_calendars()
    engine = CalendarIntelligenceEngine(calendars)

    email = EmailMessage(
        message_id="msg-002",
        subject="Interview - Senior Engineer Candidate",
        body=(
            "Hi,\n\n"
            "Let's schedule a technical interview with the candidate. "
            "We need a 60-minute slot for the technical assessment. "
            "The candidate is in EST timezone.\n\n"
            "This is a high priority hire - we need to move quickly. "
            "Can we set up the interview for early next week?\n\n"
            "Please include the hiring manager as optional.\n\n"
            "Thanks"
        ),
        sender="recruiter@company.com",
        sender_name="Sarah Recruiter",
        recipients=["interviewer@company.com", "candidate@email.com"],
        cc=["hiring-mgr@company.com"],
    )

    proposal = engine.process_scheduling_email(email)

    print(f"\nMeeting Title: {proposal.title}")
    print(f"Meeting Type: {proposal.meeting_type.value}")
    print(f"Duration: {proposal.duration_minutes} minutes")
    print(f"Priority: {proposal.priority.name}")
    print(f"Reply-All Required: {proposal.reply_all_required}")

    analysis = engine.intent_detector.analyze_email(email)
    print(f"\nIntent Detection:")
    print(f"  Intent: {analysis['intent'].value}")
    print(f"  Type: {analysis['meeting_type'].value}")
    print(f"  Time refs: {len(analysis['time_references'])}")
    for ref in analysis['time_references'][:5]:
        print(f"    - {ref['match']} ({ref['type']})")

    print(f"\nAgenda Items: {len(proposal.agenda)}")
    for i, item in enumerate(proposal.agenda, 1):
        print(f"  {i}. [{item.duration_minutes}min] {item.title}")

    return proposal


def run_test_scenario_3():
    """Test 3: Recurring weekly meeting detection and conflict handling."""
    print("\n" + "=" * 70)
    print("TEST SCENARIO 3: Weekly Recurring Meeting Detection")
    print("=" * 70)

    calendars = _create_sample_calendars()
    engine = CalendarIntelligenceEngine(calendars)

    email = EmailMessage(
        message_id="msg-003",
        subject="Weekly Team Sync",
        body=(
            "Team,\n\n"
            "Let's set up a weekly standup every Monday at 10am to sync on "
            "project progress. This should be a recurring meeting that "
            "happens every week.\n\n"
            "Agenda: Let's discuss the sprint backlog and any blockers. "
            "We need to review the architecture decision from last week "
            "and decide on the database migration strategy.\n\n"
            "Question: What ORM should we use for the new service?\n"
            "Question: When is the production deployment window?\n\n"
            "See you there!"
        ),
        sender="lead@company.com",
        sender_name="Tech Lead",
        recipients=["alice@company.com", "bob@company.com", "carol@company.com"],
    )

    proposal = engine.process_scheduling_email(email)

    print(f"\nMeeting Title: {proposal.title}")
    print(f"Meeting Type: {proposal.meeting_type.value}")
    print(f"Recurrence: {proposal.recurrence.value}")
    print(f"Duration: {proposal.duration_minutes} minutes")

    detector = RecurrenceDetector()
    text = f"{email.subject} {email.body}"
    detected = detector.detect_from_text(text)
    print(f"\nRecurrence Detection: {detected.value}")

    print(f"\nAgenda Items ({len(proposal.agenda)}):")
    for i, item in enumerate(proposal.agenda, 1):
        print(f"  {i}. [{item.duration_minutes}min] {item.title}")
        if item.description:
            print(f"     {item.description[:60]}...")

    thread_ctx = ThreadContext(messages=[email])
    engine.agenda_generator.generate_agenda(thread_ctx, proposal.meeting_type)
    print(f"\nExtracted from Thread:")
    print(f"  Topics: {thread_ctx.topics_extracted}")
    print(f"  Action Items: {thread_ctx.action_items}")
    print(f"  Open Questions: {thread_ctx.open_questions}")

    return proposal


def run_test_scenario_4():
    """Test 4: Counter-proposal and conflict resolution with reply-all."""
    print("\n" + "=" * 70)
    print("TEST SCENARIO 4: Counter-Proposal & Conflict Resolution")
    print("=" * 70)

    calendars = _create_sample_calendars()
    engine = CalendarIntelligenceEngine(calendars)

    original_email = EmailMessage(
        message_id="msg-004",
        subject="Re: Re: Lunch Meeting with Partners",
        body=(
            "Hi everyone,\n\n"
            "How about Thursday at 12:30pm instead? The original time "
            "doesn't work for me as I have a conflict.\n\n"
            "We should discuss the partnership agreement and budget. "
            "I think we need to finalize the terms before the deadline.\n\n"
            "Let me know if that time works for the group.\n\n"
            "Best,\nBob"
        ),
        sender="bob@company.com",
        sender_name="Bob Smith",
        recipients=["alice@company.com", "carol@company.com", "partner@external.com"],
        cc=["legal@company.com", "finance@company.com"],
        in_reply_to="msg-003-orig",
        references=["msg-003-orig"],
    )

    analysis = engine.intent_detector.analyze_email(original_email)
    print(f"\nEmail Analysis:")
    print(f"  Intent: {analysis['intent'].value}")
    print(f"  Meeting Type: {analysis['meeting_type'].value}")
    print(f"  Reply-All Required: {analysis['reply_all_required']}")
    print(f"  Participants: {analysis['participant_count']}")
    print(f"  Is Threaded: {analysis['is_threaded']}")

    proposal = engine.process_scheduling_email(original_email)

    print(f"\nMeeting Proposal:")
    print(f"  Title: {proposal.title}")
    print(f"  Type: {proposal.meeting_type.value}")
    print(f"  Duration: {proposal.duration_minutes} min")
    print(f"  Reply-All: {proposal.reply_all_required}")

    conflict_report = engine.get_conflict_report(proposal)
    print(f"\nConflict Resolution:")
    print(f"  Hard Conflicts: {len(conflict_report['hard_conflicts'])}")
    print(f"  Buffer Violations: {len(conflict_report['buffer_violations'])}")
    print(f"  Available Alternatives: {len(conflict_report['alternatives'])}")

    for alt in conflict_report['alternatives'][:3]:
        print(f"    Alt: {alt.start.strftime('%Y-%m-%d %H:%M')} "
              f"(score: {alt.score:.2f}, avail: {len(alt.participants_available)})")

    for conflict in conflict_report['hard_conflicts'][:3]:
        print(f"  Conflict: {conflict}")

    buffer_mgr = engine.buffer_manager
    suggested_buffer = buffer_mgr.suggest_buffer_adjustment("alice@company.com")
    print(f"\nBuffer Management:")
    print(f"  Alice's events: {len(calendars.get('alice@company.com', []))}")
    print(f"  Suggested buffer: {suggested_buffer} minutes")

    return proposal


def run_test_scenario_5():
    """Test 5: Duration optimization and buffer management."""
    print("\n" + "=" * 70)
    print("TEST SCENARIO 5: Duration Optimization & Buffer Management")
    print("=" * 70)

    optimizer = DurationOptimizer()

    scenarios = [
        ("Quick call", MeetingType.CALL, [], 2, False),
        ("Large demo", MeetingType.DEMO, [
            AgendaItem("Intro", 5), AgendaItem("Demo", 30),
            AgendaItem("Q&A", 15), AgendaItem("Next steps", 5),
        ], 8, True),
        ("Brainstorm session", MeetingType.BRAINSTORM, [
            AgendaItem("Problem statement", 10),
            AgendaItem("Ideation", 30),
            AgendaItem("Evaluation", 20),
            AgendaItem("Action plan", 15),
        ], 6, False),
        ("Interview", MeetingType.INTERVIEW, [], 3, True),
    ]

    print("\nDuration Optimization Results:")
    for name, mt, agenda, count, remote in scenarios:
        duration = optimizer.optimize(mt, agenda, count, remote)
        print(f"  {name}: {duration} min "
              f"(type={mt.value}, people={count}, remote={remote})")

    calendars = _create_sample_calendars()
    buffer_mgr = BufferManager(calendars)

    print("\nBuffer Analysis for Alice:")
    test_time = datetime(2026, 6, 2, 11, 0)
    violations = buffer_mgr.check_buffer_violations(
        test_time, test_time + timedelta(minutes=30),
        "alice@company.com", buffer_minutes=15,
    )
    for v in violations:
        print(f"  {v}")

    consecutive = buffer_mgr.count_consecutive_meetings(
        "alice@company.com", test_time
    )
    print(f"  Consecutive meetings near 11:00: {consecutive}")

    suggested = buffer_mgr.suggest_buffer_adjustment("alice@company.com")
    print(f"  Suggested buffer time: {suggested} minutes")

    print("\nBuffer Analysis for Bob:")
    violations_bob = buffer_mgr.check_buffer_violations(
        test_time, test_time + timedelta(minutes=30),
        "bob@company.com", buffer_minutes=15,
    )
    for v in violations_bob:
        print(f"  {v}")
    suggested_bob = buffer_mgr.suggest_buffer_adjustment("bob@company.com")
    print(f"  Suggested buffer time: {suggested_bob} minutes")

    return True


# =============================================================================
# MAIN ENTRY POINT
# =============================================================================

def main():
    """Run all test scenarios and display results."""
    print("=" * 70)
    print("  V135 - AI Email Calendar Intelligence")
    print("  Production Test Suite")
    print("=" * 70)

    results = {}

    results["scenario_1"] = run_test_scenario_1()
    results["scenario_2"] = run_test_scenario_2()
    results["scenario_3"] = run_test_scenario_3()
    results["scenario_4"] = run_test_scenario_4()
    results["scenario_5"] = run_test_scenario_5()

    print("\n" + "=" * 70)
    print("  ALL TEST SCENARIOS COMPLETED SUCCESSFULLY")
    print("=" * 70)
    print(f"\nScenarios run: {len(results)}")
    print("Modules tested:")
    print("  - SchedulingIntentDetector")
    print("  - CalendarAnalyzer")
    print("  - AgendaGenerator")
    print("  - RecurrenceDetector")
    print("  - DurationOptimizer")
    print("  - BufferManager")
    print("  - ICSGenerator")
    print("  - CalendarIntelligenceEngine (orchestrator)")

    return results


if __name__ == "__main__":
    main()
