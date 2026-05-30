#!/usr/bin/env python3
"""V132 AI Email-to-Project Bridge.

Converts email threads into structured project plans with milestones,
deliverables, action items, ticket creation, progress tracking, Gantt
data generation, dependency detection, deadline extraction, and
reply-all enforcement for project updates.

Production-quality implementation with classes, dataclasses, enums,
type hints, and a __main__ demo with 4+ test scenarios.
"""

from __future__ import annotations

import re
import uuid
import json
import hashlib
from copy import deepcopy
from enum import Enum, auto
from dataclasses import dataclass, field, asdict
from datetime import datetime, timedelta, date
from typing import (
    Any,
    Dict,
    List,
    Optional,
    Set,
    Tuple,
)


# ---------------------------------------------------------------------------
# Enums
# ---------------------------------------------------------------------------

class Priority(Enum):
    CRITICAL = "critical"
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"


class TaskStatus(Enum):
    TODO = "todo"
    IN_PROGRESS = "in_progress"
    BLOCKED = "blocked"
    DONE = "done"
    CANCELLED = "cancelled"


class TicketPlatform(Enum):
    JIRA = "jira"
    ASANA = "asana"
    LINEAR = "linear"


class MilestoneType(Enum):
    PLANNING = "planning"
    DEVELOPMENT = "development"
    REVIEW = "review"
    DEPLOYMENT = "deployment"
    COMPLETION = "completion"


class DependencyType(Enum):
    BLOCKS = "blocks"
    BLOCKED_BY = "blocked_by"
    RELATES_TO = "relates_to"
    DUPLICATES = "duplicates"


# ---------------------------------------------------------------------------
# Data classes
# ---------------------------------------------------------------------------

@dataclass
class TeamMember:
    name: str
    email: str
    role: str = "contributor"
    capacity: float = 1.0  # 1.0 = full-time

    @property
    def id(self) -> str:
        return hashlib.md5(self.email.encode()).hexdigest()[:8]


@dataclass
class ActionItem:
    id: str = field(default_factory=lambda: uuid.uuid4().hex[:12])
    title: str = ""
    description: str = ""
    assignee: Optional[TeamMember] = None
    priority: Priority = Priority.MEDIUM
    status: TaskStatus = TaskStatus.TODO
    deadline: Optional[date] = None
    estimated_hours: float = 0.0
    tags: List[str] = field(default_factory=list)
    created_at: datetime = field(default_factory=datetime.now)
    completed_at: Optional[datetime] = None

    @property
    def is_overdue(self) -> bool:
        if self.deadline and self.status != TaskStatus.DONE:
            return date.today() > self.deadline
        return False

    @property
    def progress(self) -> float:
        if self.status == TaskStatus.DONE:
            return 100.0
        if self.status == TaskStatus.IN_PROGRESS:
            return 50.0
        if self.status == TaskStatus.BLOCKED:
            return 25.0
        return 0.0


@dataclass
class Dependency:
    source_task_id: str
    target_task_id: str
    dep_type: DependencyType = DependencyType.BLOCKS


@dataclass
class Deliverable:
    id: str = field(default_factory=lambda: uuid.uuid4().hex[:12])
    title: str = ""
    description: str = ""
    due_date: Optional[date] = None
    owner: Optional[TeamMember] = None
    acceptance_criteria: List[str] = field(default_factory=list)
    completed: bool = False


@dataclass
class Milestone:
    id: str = field(default_factory=lambda: uuid.uuid4().hex[:12])
    title: str = ""
    description: str = ""
    milestone_type: MilestoneType = MilestoneType.DEVELOPMENT
    target_date: Optional[date] = None
    deliverables: List[Deliverable] = field(default_factory=list)
    action_items: List[str] = field(default_factory=list)  # IDs
    status: TaskStatus = TaskStatus.TODO
    progress: float = 0.0


@dataclass
class Ticket:
    id: str = field(default_factory=lambda: lambda: f"TKT-{uuid.uuid4().hex[:6].upper()}")
    platform: TicketPlatform = TicketPlatform.JIRA
    title: str = ""
    description: str = ""
    status: str = "Open"
    assignee: Optional[str] = None
    priority: str = "Medium"
    labels: List[str] = field(default_factory=list)
    url: str = ""
    created_at: datetime = field(default_factory=datetime.now)

    def __post_init__(self):
        if callable(self.id):
            self.id = self.id()


@dataclass
class EmailMessage:
    id: str = field(default_factory=lambda: uuid.uuid4().hex[:12])
    subject: str = ""
    sender: TeamMember = field(default_factory=lambda: TeamMember("Unknown", "unknown@example.com"))
    recipients: List[TeamMember] = field(default_factory=list)
    cc: List[TeamMember] = field(default_factory=list)
    body: str = ""
    timestamp: datetime = field(default_factory=datetime.now)
    thread_id: str = ""
    in_reply_to: Optional[str] = None
    is_reply_all: bool = False


@dataclass
class GanttTask:
    id: str
    title: str
    start_date: date
    end_date: date
    progress: float
    dependencies: List[str] = field(default_factory=list)
    assignee: Optional[str] = None
    milestone: Optional[str] = None
    color: str = "#4A90D9"


@dataclass
class ProjectPlan:
    id: str = field(default_factory=lambda: uuid.uuid4().hex[:12])
    name: str = ""
    description: str = ""
    milestones: List[Milestone] = field(default_factory=list)
    action_items: List[ActionItem] = field(default_factory=list)
    dependencies: List[Dependency] = field(default_factory=list)
    team_members: List[TeamMember] = field(default_factory=list)
    tickets: List[Ticket] = field(default_factory=list)
    created_at: datetime = field(default_factory=datetime.now)
    start_date: Optional[date] = None
    end_date: Optional[date] = None

    @property
    def overall_progress(self) -> float:
        if not self.action_items:
            return 0.0
        return sum(ai.progress for ai in self.action_items) / len(self.action_items)


# ---------------------------------------------------------------------------
# Core Classes
# ---------------------------------------------------------------------------

class DeadlineExtractor:
    """Extracts deadlines and dates from natural language email text."""

    RELATIVE_PATTERNS = {
        r"by (?:next )?(monday|tuesday|wednesday|thursday|friday|saturday|sunday)": "weekday",
        r"in (\d+) days?": "days_offset",
        r"in (\d+) weeks?": "weeks_offset",
        r"by (?:the )?end of (?:this |the )?(week|month|quarter|year)": "end_of",
        r"(?:due|deadline|by|before|no later than)\s+(\d{1,2}[/-]\d{1,2}(?:[/-]\d{2,4})?)": "explicit_date",
        r"(?:due|deadline|by|before)\s+(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\s+(\d{1,2})": "month_day",
        r"(?:asap|urgently|immediately|right away)": "asap",
        r"by (?:tomorrow|tmrw|tmr)": "tomorrow",
        r"by eod": "eod",
        r"by eow": "end_of_week",
    }

    PRIORITY_KEYWORDS = {
        Priority.CRITICAL: ["critical", "urgent", "asap", "emergency", "immediately", "blocker", "p0"],
        Priority.HIGH: ["high priority", "important", "soon", "p1", "high"],
        Priority.MEDIUM: ["medium", "normal", "standard", "p2"],
        Priority.LOW: ["low priority", "when possible", "low", "nice to have", "p3"],
    }

    WEEKDAY_MAP = {
        "monday": 0, "tuesday": 1, "wednesday": 2, "thursday": 3,
        "friday": 4, "saturday": 5, "sunday": 6,
    }

    MONTH_MAP = {
        "jan": 1, "january": 1, "feb": 2, "february": 2, "mar": 3, "march": 3,
        "apr": 4, "april": 4, "may": 5, "jun": 6, "june": 6,
        "jul": 7, "july": 7, "aug": 8, "august": 8, "sep": 9, "september": 9,
        "oct": 10, "october": 10, "nov": 11, "november": 11, "dec": 12, "december": 12,
    }

    def extract_deadline(self, text: str, reference_date: Optional[date] = None) -> Optional[date]:
        """Extract deadline from natural language text."""
        ref = reference_date or date.today()
        text_lower = text.lower()

        # Check ASAP/urgent -> today or tomorrow
        if re.search(r"(?:asap|urgently|immediately|right away)", text_lower):
            return ref

        # Tomorrow
        if re.search(r"(?:tomorrow|tmrw|tmr)", text_lower):
            return ref + timedelta(days=1)

        # EOD -> today
        if re.search(r"by eod", text_lower):
            return ref

        # End of week
        if re.search(r"by eow", text_lower):
            days_until_friday = (4 - ref.weekday()) % 7
            if days_until_friday == 0 and ref.weekday() > 4:
                days_until_friday = 7
            return ref + timedelta(days=days_until_friday)

        # "in N days"
        m = re.search(r"in (\d+) days?", text_lower)
        if m:
            return ref + timedelta(days=int(m.group(1)))

        # "in N weeks"
        m = re.search(r"in (\d+) weeks?", text_lower)
        if m:
            return ref + timedelta(weeks=int(m.group(1)))

        # "by next Monday/Tuesday/etc"
        m = re.search(r"by (?:next )?(monday|tuesday|wednesday|thursday|friday|saturday|sunday)", text_lower)
        if m:
            target_day = self.WEEKDAY_MAP[m.group(1)]
            current_day = ref.weekday()
            days_ahead = (target_day - current_day) % 7
            if days_ahead == 0:
                days_ahead = 7
            if "next" in text_lower[text_lower.find("by"):text_lower.find(m.group(1)) + len(m.group(1))]:
                days_ahead += 7
            return ref + timedelta(days=days_ahead)

        # "end of week/month/quarter"
        m = re.search(r"end of (?:this |the )?(week|month|quarter|year)", text_lower)
        if m:
            period = m.group(1)
            if period == "week":
                days_until_friday = (4 - ref.weekday()) % 7 or 7
                return ref + timedelta(days=days_until_friday)
            elif period == "month":
                if ref.month == 12:
                    return date(ref.year + 1, 1, 1) - timedelta(days=1)
                return date(ref.year, ref.month + 1, 1) - timedelta(days=1)
            elif period == "quarter":
                quarter_end_month = ((ref.month - 1) // 3 + 1) * 3
                if ref.month == quarter_end_month:
                    quarter_end_month += 3
                if quarter_end_month > 12:
                    return date(ref.year + 1, 1, 1) - timedelta(days=1)
                return date(ref.year, quarter_end_month + 1, 1) - timedelta(days=1)
            elif period == "year":
                return date(ref.year, 12, 31)

        # Explicit date "12/15" or "12/15/2026"
        m = re.search(r"(\d{1,2})[/-](\d{1,2})(?:[/-](\d{2,4}))?", text_lower)
        if m:
            month, day = int(m.group(1)), int(m.group(2))
            year = int(m.group(3)) if m.group(3) else ref.year
            if year < 100:
                year += 2000
            try:
                return date(year, month, day)
            except ValueError:
                pass

        # "Month Day" pattern
        m = re.search(
            r"(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|"
            r"jul(?:y)?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|"
            r"dec(?:ember)?)\s+(\d{1,2})",
            text_lower,
        )
        if m:
            month = self.MONTH_MAP.get(m.group(1))
            day = int(m.group(2))
            if month:
                year = ref.year
                try:
                    d = date(year, month, day)
                    if d < ref:
                        d = date(year + 1, month, day)
                    return d
                except ValueError:
                    pass

        return None

    def extract_priority(self, text: str) -> Priority:
        """Extract priority from email text."""
        text_lower = text.lower()
        for priority, keywords in self.PRIORITY_KEYWORDS.items():
            for kw in keywords:
                if kw in text_lower:
                    return priority
        return Priority.MEDIUM


class ActionItemExtractor:
    """Extracts action items from email body text."""

    ACTION_PATTERNS = [
        r"(?:@(\w+[\w.]*)\s+)?(?:please|could you|can you|need you to|I need)\s+(.+?)(?:\.|$)",
        r"(?:action item[s]?|todo|to-do|task[s]?)\s*[:\-]\s*(.+?)(?:\.|$)",
        r"(?:\[\s*\]|\-\s*\[\s*\])\s*(.+?)(?:\.|$)",
        r"(?:\d+\.\s*)(.+?)(?:\.|$)",
    ]

    ASSIGNMENT_PATTERNS = [
        r"@(\w+[\w.]*)\s+(?:will|should|needs to|please|can)\s+(.+?)(?:\.|$)",
        r"(\w+[\w.]*)\s+(?:will|should|needs to)\s+(.+?)(?:\.|$)",
        r"(?:assign(?:ed)? to|owner[:\s]+)(\w+[\w.]*)",
    ]

    def extract_actions(self, email: EmailMessage) -> List[ActionItem]:
        """Extract action items from an email message."""
        items: List[ActionItem] = []
        extractor = DeadlineExtractor()
        lines = email.body.split("\n")

        # Detect bullet-pointed action items
        for line in lines:
            line_stripped = line.strip()
            if not line_stripped:
                continue

            # Check for checklist/bullet patterns
            action_match = re.match(r"^(?:\[\s*\]|\-\s*\[\s*\]|\*\s*|\-\s*|\d+\.\s*)(.+)", line_stripped)
            if action_match:
                action_text = action_match.group(1).strip()
                # Filter out items that are too short (likely not real action items)
                if len(action_text.split()) < 3:
                    continue
                assignee = self._detect_assignee(action_text, email)
                deadline = extractor.extract_deadline(action_text)
                priority = extractor.extract_priority(action_text)
                items.append(ActionItem(
                    title=action_text,
                    assignee=assignee,
                    deadline=deadline,
                    priority=priority,
                ))
                continue

            # Check assignment patterns
            for pattern in self.ASSIGNMENT_PATTERNS:
                m = re.search(pattern, line_stripped, re.IGNORECASE)
                if m:
                    assignee_name = m.group(1)
                    action_text = m.group(2) if m.lastindex >= 2 else line_stripped
                    assignee = self._find_member(assignee_name, email)
                    deadline = extractor.extract_deadline(action_text)
                    priority = extractor.extract_priority(action_text)
                    items.append(ActionItem(
                        title=action_text,
                        assignee=assignee,
                        deadline=deadline,
                        priority=priority,
                    ))
                    break

            # Check "please/could you" patterns
            for pattern in self.ACTION_PATTERNS[:2]:
                m = re.search(pattern, line_stripped, re.IGNORECASE)
                if m:
                    if m.lastindex == 2:
                        assignee_name = m.group(1)
                        action_text = m.group(2)
                        assignee = self._find_member(assignee_name, email)
                    else:
                        action_text = m.group(1)
                        assignee = self._detect_assignee(action_text, email)
                    # Filter out very short items
                    if len(action_text.strip().split()) < 3:
                        break
                    deadline = extractor.extract_deadline(action_text)
                    priority = extractor.extract_priority(action_text)
                    items.append(ActionItem(
                        title=action_text,
                        assignee=assignee,
                        deadline=deadline,
                        priority=priority,
                    ))
                    break

        return items

    def _detect_assignee(self, text: str, email: EmailMessage) -> Optional[TeamMember]:
        """Try to detect assignee from text context."""
        for member in email.recipients + email.cc:
            if member.name.lower() in text.lower():
                return member
        # Check for @mentions
        m = re.search(r"@(\w+)", text)
        if m:
            return self._find_member(m.group(1), email)
        return None

    def _find_member(self, name: Optional[str], email: EmailMessage) -> Optional[TeamMember]:
        """Find a team member by name in the email recipients."""
        if not name:
            return None
        all_members = [email.sender] + email.recipients + email.cc
        name_lower = name.lower()
        for member in all_members:
            if member.name.lower() == name_lower or member.email.startswith(name_lower):
                return member
        return None


class DependencyDetector:
    """Detects dependencies between tasks from email content."""

    DEPENDENCY_KEYWORDS = {
        DependencyType.BLOCKS: [
            "blocks", "must complete before", "prerequisite", "before we can",
            "needed before", "required before", "depends on completion of",
        ],
        DependencyType.BLOCKED_BY: [
            "blocked by", "waiting on", "waiting for", "depends on",
            "after", "once", "when .* is done", "pending",
        ],
        DependencyType.RELATES_TO: [
            "related to", "associated with", "connected to", "ties into",
            "in parallel with", "alongside",
        ],
        DependencyType.DUPLICATES: [
            "duplicates", "same as", "duplicate of", "merges with",
        ],
    }

    def detect_dependencies(self, items: List[ActionItem], context: str = "") -> List[Dependency]:
        """Detect dependencies between action items."""
        deps: List[Dependency] = []
        text_lower = context.lower()

        for i, item_a in enumerate(items):
            for j, item_b in enumerate(items):
                if i == j:
                    continue
                dep_type = self._check_dependency(item_a, item_b, text_lower)
                if dep_type:
                    deps.append(Dependency(
                        source_task_id=item_a.id,
                        target_task_id=item_b.id,
                        dep_type=dep_type,
                    ))

        return deps

    def _check_dependency(
        self, source: ActionItem, target: ActionItem, context: str
    ) -> Optional[DependencyType]:
        """Check if source depends on or blocks target."""
        source_title = source.title.lower()
        target_title = target.title.lower()

        # Check if source mentions needing target done first
        for dep_type, keywords in self.DEPENDENCY_KEYWORDS.items():
            for kw in keywords:
                if kw in source_title or kw in context:
                    # Simple heuristic: if deadline of target is before source
                    if source.deadline and target.deadline:
                        if target.deadline < source.deadline:
                            if dep_type == DependencyType.BLOCKS:
                                return DependencyType.BLOCKED_BY
                            return DependencyType.BLOCKED_BY
                        elif source.deadline < target.deadline:
                            return DependencyType.BLOCKS

        # Sequential ordering by deadline
        if source.deadline and target.deadline:
            if target.deadline < source.deadline:
                return DependencyType.BLOCKED_BY

        return None


class TicketManager:
    """Simulates ticket creation across Jira, Asana, and Linear."""

    PLATFORM_PREFIXES = {
        TicketPlatform.JIRA: "PROJ",
        TicketPlatform.ASANA: "AS",
        TicketPlatform.LINEAR: "LIN",
    }

    def __init__(self, platform: TicketPlatform = TicketPlatform.JIRA):
        self.platform = platform
        self._counter = 0
        self.tickets: List[Ticket] = []

    def create_ticket(self, item: ActionItem, project_key: str = "PROJ") -> Ticket:
        """Create a ticket from an action item."""
        self._counter += 1
        prefix = self.PLATFORM_PREFIXES.get(self.platform, "TKT")
        ticket_id = f"{project_key}-{self._counter}"

        ticket = Ticket(
            id=ticket_id,
            platform=self.platform,
            title=item.title,
            description=item.description or item.title,
            status="Open",
            assignee=item.assignee.name if item.assignee else None,
            priority=item.priority.value.capitalize(),
            labels=item.tags,
            url=f"https://{self.platform.value}.example.com/issue/{ticket_id}",
        )
        self.tickets.append(ticket)
        return ticket

    def create_tickets_bulk(
        self, items: List[ActionItem], project_key: str = "PROJ"
    ) -> List[Ticket]:
        """Create tickets for multiple action items."""
        return [self.create_ticket(item, project_key) for item in items]

    def update_ticket_status(self, ticket_id: str, status: str) -> Optional[Ticket]:
        """Update a ticket's status."""
        for ticket in self.tickets:
            if ticket.id == ticket_id:
                ticket.status = status
                return ticket
        return None

    def get_board_summary(self) -> Dict[str, Any]:
        """Get a summary of the ticket board."""
        by_status: Dict[str, int] = {}
        by_priority: Dict[str, int] = {}
        for t in self.tickets:
            by_status[t.status] = by_status.get(t.status, 0) + 1
            by_priority[t.priority] = by_priority.get(t.priority, 0) + 1
        return {
            "platform": self.platform.value,
            "total_tickets": len(self.tickets),
            "by_status": by_status,
            "by_priority": by_priority,
            "tickets": [asdict(t) for t in self.tickets],
        }


class ReplyAllEnforcer:
    """Enforces reply-all behavior for project-related emails."""

    PROJECT_INDICATORS = [
        "project", "milestone", "deliverable", "deadline", "sprint",
        "blocker", "status update", "progress", "timeline", "launch",
        "release", "deployment", "launch date", "kickoff",
    ]

    def is_project_email(self, email: EmailMessage) -> bool:
        """Determine if an email is project-related."""
        text = f"{email.subject} {email.body}".lower()
        return any(indicator in text for indicator in self.PROJECT_INDICATORS)

    def check_reply_all_compliance(self, email: EmailMessage) -> Dict[str, Any]:
        """Check if a reply-all was properly used for project emails."""
        is_project = self.is_project_email(email)
        if not is_project:
            return {"is_project_email": False, "compliant": True, "warnings": []}

        warnings: List[str] = []
        original_recipients = set()
        for r in email.recipients:
            original_recipients.add(r.email)
        for r in email.cc:
            original_recipients.add(r.email)
        original_recipients.add(email.sender.email)

        if email.in_reply_to and not email.is_reply_all:
            warnings.append(
                "This appears to be a project update but was NOT sent as Reply-All. "
                "All stakeholders should be included."
            )

        # Check if key stakeholders are missing
        if len(email.recipients) < 2 and is_project:
            warnings.append(
                "Project updates should include all team members. "
                f"Only {len(email.recipients)} recipient(s) included."
            )

        return {
            "is_project_email": True,
            "compliant": len(warnings) == 0,
            "warnings": warnings,
            "recipients_count": len(email.recipients),
            "cc_count": len(email.cc),
        }


class GanttGenerator:
    """Generates Gantt chart data from project plans."""

    COLORS = [
        "#4A90D9", "#7B68EE", "#50C878", "#FFB347",
        "#FF6B6B", "#A0D468", "#48C9B0", "#F7DC6F",
    ]

    def generate_gantt_data(self, plan: ProjectPlan) -> List[Dict[str, Any]]:
        """Generate Gantt chart compatible data from a project plan."""
        gantt_tasks: List[GanttTask] = []
        color_idx = 0

        # Build dependency map
        dep_map: Dict[str, List[str]] = {}
        for dep in plan.dependencies:
            if dep.source_task_id not in dep_map:
                dep_map[dep.source_task_id] = []
            dep_map[dep.source_task_id].append(dep.target_task_id)

        # Find milestone for each action item
        item_milestone_map: Dict[str, str] = {}
        for milestone in plan.milestones:
            for ai_id in milestone.action_items:
                item_milestone_map[ai_id] = milestone.title

        for item in plan.action_items:
            start = item.created_at.date() if isinstance(item.created_at, datetime) else date.today()
            if item.deadline:
                end = item.deadline
            else:
                # Default: 5 working days
                end = start + timedelta(days=7)

            milestone_name = item_milestone_map.get(item.id)

            gantt_task = GanttTask(
                id=item.id,
                title=item.title,
                start_date=start,
                end_date=end,
                progress=item.progress,
                dependencies=dep_map.get(item.id, []),
                assignee=item.assignee.name if item.assignee else None,
                milestone=milestone_name,
                color=self.COLORS[color_idx % len(self.COLORS)],
            )
            gantt_tasks.append(gantt_task)
            color_idx += 1

        # Add milestones as diamond markers
        for milestone in plan.milestones:
            if milestone.target_date:
                gantt_tasks.append(GanttTask(
                    id=milestone.id,
                    title=f"🔷 {milestone.title}",
                    start_date=milestone.target_date,
                    end_date=milestone.target_date,
                    progress=milestone.progress,
                    milestone=milestone.title,
                    color="#FFD700",
                ))

        return [self._gantt_to_dict(gt) for gt in gantt_tasks]

    def _gantt_to_dict(self, gt: GanttTask) -> Dict[str, Any]:
        return {
            "id": gt.id,
            "title": gt.title,
            "start_date": gt.start_date.isoformat(),
            "end_date": gt.end_date.isoformat(),
            "duration_days": (gt.end_date - gt.start_date).days + 1,
            "progress": gt.progress,
            "dependencies": gt.dependencies,
            "assignee": gt.assignee,
            "milestone": gt.milestone,
            "color": gt.color,
        }

    def to_mermaid_syntax(self, plan: ProjectPlan) -> str:
        """Generate Mermaid Gantt chart syntax."""
        lines = ["gantt", f"    title {plan.name}", "    dateFormat  YYYY-MM-DD"]

        for milestone in plan.milestones:
            lines.append(f"    section {milestone.title}")
            for ai_id in milestone.action_items:
                item = next((a for a in plan.action_items if a.id == ai_id), None)
                if item:
                    start = item.created_at.date() if isinstance(item.created_at, datetime) else date.today()
                    end = item.deadline or (start + timedelta(days=7))
                    status = "done," if item.status == TaskStatus.DONE else ""
                    active = "active," if item.status == TaskStatus.IN_PROGRESS else ""
                    lines.append(f"    {item.title} :{status}{active} {item.id}, {start}, {end}")

        return "\n".join(lines)


class ProgressTracker:
    """Tracks project progress from email updates."""

    STATUS_PATTERNS = {
        TaskStatus.DONE: [
            r"(?:completed?|finished?|done|delivered|shipped|merged|deployed|released)",
            r"(?:100%\s*(?:done|complete))",
        ],
        TaskStatus.IN_PROGRESS: [
            r"(?:working on|in progress|currently|started|begin|ongoing|wip)",
            r"(?:\d{1,2}%\s*(?:done|complete))",
        ],
        TaskStatus.BLOCKED: [
            r"(?:blocked|waiting|stuck|issue|problem|cannot proceed|delayed)",
        ],
        TaskStatus.CANCELLED: [
            r"(?:cancelled|canceled|dropped|deprioritized|won'?t do|no longer needed)",
        ],
    }

    def extract_progress_from_email(
        self, email: EmailMessage, items: List[ActionItem]
    ) -> List[Tuple[ActionItem, TaskStatus, str]]:
        """Match email content to action items and detect status updates."""
        updates: List[Tuple[ActionItem, TaskStatus, str]] = []
        body_lower = email.body.lower()

        for item in items:
            item_title_lower = item.title.lower()
            # Check if this email references this action item
            if self._email_references_item(body_lower, item_title_lower):
                new_status = self._detect_status(body_lower)
                if new_status and new_status != item.status:
                    updates.append((item, new_status, email.body))

        return updates

    def _email_references_item(self, body_lower: str, item_title_lower: str) -> bool:
        """Check if email body references an action item."""
        # Direct title match
        if item_title_lower in body_lower:
            return True
        # Keyword overlap (at least 50% of significant words)
        item_words = set(w for w in item_title_lower.split() if len(w) > 3)
        if not item_words:
            return False
        body_words = set(body_lower.split())
        overlap = item_words & body_words
        return len(overlap) / len(item_words) >= 0.5

    def _detect_status(self, text: str) -> Optional[TaskStatus]:
        """Detect task status from text."""
        for status, patterns in self.STATUS_PATTERNS.items():
            for pattern in patterns:
                if re.search(pattern, text):
                    return status
        return None


class EmailToProjectBridge:
    """Main bridge class that orchestrates email-to-project conversion."""

    def __init__(self, platform: TicketPlatform = TicketPlatform.JIRA):
        self.deadline_extractor = DeadlineExtractor()
        self.action_extractor = ActionItemExtractor()
        self.dependency_detector = DependencyDetector()
        self.ticket_manager = TicketManager(platform)
        self.reply_all_enforcer = ReplyAllEnforcer()
        self.gantt_generator = GanttGenerator()
        self.progress_tracker = ProgressTracker()
        self.plans: Dict[str, ProjectPlan] = {}
        self.email_threads: Dict[str, List[EmailMessage]] = {}

    def process_email(self, email: EmailMessage) -> Dict[str, Any]:
        """Process a single email and extract project information."""
        # Thread management
        thread_id = email.thread_id or email.id
        if thread_id not in self.email_threads:
            self.email_threads[thread_id] = []
        self.email_threads[thread_id].append(email)

        result: Dict[str, Any] = {
            "email_id": email.id,
            "thread_id": thread_id,
            "reply_all_check": self.reply_all_enforcer.check_reply_all_compliance(email),
        }

        # Check if this is a new project or update
        if self._is_project_kickoff(email):
            plan = self._create_project_from_email(email)
            self.plans[plan.id] = plan
            result["action"] = "project_created"
            result["plan_id"] = plan.id
            result["milestones"] = len(plan.milestones)
            result["action_items"] = len(plan.action_items)
            result["tickets"] = [t.id for t in plan.tickets]
        else:
            # Try to update existing project
            plan = self._find_related_plan(email)
            if plan:
                updates = self.progress_tracker.extract_progress_from_email(
                    email, plan.action_items
                )
                for item, new_status, _ in updates:
                    item.status = new_status
                    if new_status == TaskStatus.DONE:
                        item.completed_at = datetime.now()
                result["action"] = "project_updated"
                result["plan_id"] = plan.id
                result["status_updates"] = [
                    {"item": u[0].title, "new_status": u[1].value} for u in updates
                ]
            else:
                result["action"] = "no_project_match"

        return result

    def get_plan(self, plan_id: str) -> Optional[ProjectPlan]:
        """Retrieve a project plan by ID."""
        return self.plans.get(plan_id)

    def get_gantt_chart(self, plan_id: str) -> List[Dict[str, Any]]:
        """Get Gantt chart data for a project plan."""
        plan = self.plans.get(plan_id)
        if not plan:
            return []
        return self.gantt_generator.generate_gantt_data(plan)

    def get_mermaid_gantt(self, plan_id: str) -> str:
        """Get Mermaid Gantt chart syntax for a project plan."""
        plan = self.plans.get(plan_id)
        if not plan:
            return ""
        return self.gantt_generator.to_mermaid_syntax(plan)

    def get_project_summary(self, plan_id: str) -> Dict[str, Any]:
        """Get comprehensive project summary."""
        plan = self.plans.get(plan_id)
        if not plan:
            return {}

        return {
            "plan_id": plan.id,
            "name": plan.name,
            "overall_progress": round(plan.overall_progress, 1),
            "milestones": [
                {"title": m.title, "type": m.milestone_type.value, "status": m.status.value,
                 "progress": m.progress, "target_date": m.target_date.isoformat() if m.target_date else None}
                for m in plan.milestones
            ],
            "action_items": [
                {"title": ai.title, "assignee": ai.assignee.name if ai.assignee else "Unassigned",
                 "status": ai.status.value, "priority": ai.priority.value,
                 "deadline": ai.deadline.isoformat() if ai.deadline else None,
                 "is_overdue": ai.is_overdue}
                for ai in plan.action_items
            ],
            "dependencies": [
                {"source": d.source_task_id, "target": d.target_task_id, "type": d.dep_type.value}
                for d in plan.dependencies
            ],
            "team": [{"name": m.name, "role": m.role, "email": m.email} for m in plan.team_members],
            "tickets": self.ticket_manager.get_board_summary(),
            "start_date": plan.start_date.isoformat() if plan.start_date else None,
            "end_date": plan.end_date.isoformat() if plan.end_date else None,
        }

    def _is_project_kickoff(self, email: EmailMessage) -> bool:
        """Determine if email is a project kickoff."""
        # If it's a reply (has in_reply_to), it's more likely an update
        if email.in_reply_to:
            return False
        text = f"{email.subject} {email.body}".lower()
        kickoff_indicators = [
            "project kickoff", "new project", "project plan", "let's kick off",
            "kickoff", "project charter", "project scope", "initiative",
            "launch project", "start project", "project proposal",
            "let's start", "let's kick",
        ]
        return any(ind in text for ind in kickoff_indicators)

    def _create_project_from_email(self, email: EmailMessage) -> ProjectPlan:
        """Create a project plan from a kickoff email."""
        plan = ProjectPlan(
            name=email.subject.replace("[Project]", "").replace("[PROJ]", "").strip(),
            description=email.body[:500],
            team_members=[email.sender] + email.recipients + email.cc,
        )

        # Extract action items
        action_items = self.action_extractor.extract_actions(email)
        plan.action_items = action_items

        # Create milestones from structure
        plan.milestones = self._infer_milestones(action_items, email)

        # Detect dependencies
        plan.dependencies = self.dependency_detector.detect_dependencies(
            action_items, email.body
        )

        # Create tickets
        tickets = self.ticket_manager.create_tickets_bulk(action_items)
        plan.tickets = tickets

        # Set dates
        if action_items:
            deadlines = [ai.deadline for ai in action_items if ai.deadline]
            if deadlines:
                plan.start_date = min(deadlines)
                plan.end_date = max(deadlines)

        return plan

    def _infer_milestones(
        self, items: List[ActionItem], email: EmailMessage
    ) -> List[Milestone]:
        """Infer milestones from action items and email structure."""
        milestones: List[Milestone] = []

        if not items:
            return milestones

        # Group items by deadline proximity
        groups: Dict[str, List[ActionItem]] = {}
        for item in items:
            if item.deadline:
                # Group by week
                week_key = item.deadline.strftime("%Y-W%W")
                if week_key not in groups:
                    groups[week_key] = []
                groups[week_key].append(item)
            else:
                if "unscheduled" not in groups:
                    groups["unscheduled"] = []
                groups["unscheduled"].append(item)

        # Create milestones from groups
        milestone_types = list(MilestoneType)
        for idx, (period, group_items) in enumerate(sorted(groups.items())):
            mtype = milestone_types[idx % len(milestone_types)]
            deadlines = [i.deadline for i in group_items if i.deadline]
            target = max(deadlines) if deadlines else None

            milestone = Milestone(
                title=f"{mtype.value.title()} - {period}",
                milestone_type=mtype,
                target_date=target,
                action_items=[i.id for i in group_items],
            )
            milestones.append(milestone)

        return milestones

    def _find_related_plan(self, email: EmailMessage) -> Optional[ProjectPlan]:
        """Find an existing plan related to this email."""
        subject_lower = email.subject.lower().replace("re:", "").replace("fwd:", "").strip()
        for plan in self.plans.values():
            plan_name_lower = plan.name.lower()
            # Direct name match in subject
            if plan_name_lower in subject_lower or subject_lower in plan_name_lower:
                return plan
            # Check for significant word overlap between subject and plan name
            plan_words = set(w for w in plan_name_lower.split() if len(w) > 3)
            subject_words = set(w for w in subject_lower.split() if len(w) > 3)
            if plan_words and subject_words:
                overlap = plan_words & subject_words
                if len(overlap) / max(len(plan_words), len(subject_words)) >= 0.5:
                    return plan
        # Check thread association - if thread_id matches any existing email thread
        if email.thread_id and email.thread_id in self.email_threads:
            # Find the first email in this thread and see if it created a plan
            first_email = self.email_threads[email.thread_id][0]
            for plan in self.plans.values():
                if plan.name.lower() in first_email.subject.lower():
                    return plan
        return None


# ---------------------------------------------------------------------------
# Test Scenarios / Demo
# ---------------------------------------------------------------------------

def _make_team() -> List[TeamMember]:
    return [
        TeamMember("Alice Chen", "alice@company.com", "project_manager"),
        TeamMember("Bob Smith", "bob@company.com", "backend_dev"),
        TeamMember("Carol Davis", "carol@company.com", "frontend_dev"),
        TeamMember("Dave Wilson", "dave@company.com", "qa_engineer"),
        TeamMember("Eve Johnson", "eve@company.com", "devops"),
    ]


def test_scenario_1_project_kickoff():
    """Scenario 1: Full project kickoff email with action items and deadlines."""
    print("=" * 70)
    print("SCENARIO 1: Project Kickoff Email → Full Project Plan")
    print("=" * 70)

    team = _make_team()
    bridge = EmailToProjectBridge(TicketPlatform.JIRA)

    kickoff_email = EmailMessage(
        subject="[Project] Website Redesign Launch",
        sender=team[0],
        recipients=team[1:],
        cc=[],
        thread_id="thread-001",
        body="""Hi team,

Let's kick off the Website Redesign project. Here's the plan:

Action items:
- @bob Set up the new API endpoints by next Friday
- @carol Design the new landing page mockups - due in 5 days
- @dave Write integration test suite before June 20
- @eve Configure CI/CD pipeline - deadline June 15

Critical: The API setup blocks all frontend work. Please prioritize.

Project kickoff meeting is scheduled for Monday.

Thanks,
Alice""",
    )

    result = bridge.process_email(kickoff_email)
    print(f"\nResult: {result['action']}")
    print(f"Plan ID: {result.get('plan_id', 'N/A')}")
    print(f"Milestones: {result.get('milestones', 0)}")
    print(f"Action Items: {result.get('action_items', 0)}")
    print(f"Tickets Created: {result.get('tickets', [])}")

    if result.get("plan_id"):
        summary = bridge.get_project_summary(result["plan_id"])
        print(f"\nProject: {summary['name']}")
        print(f"Overall Progress: {summary['overall_progress']}%")
        print(f"\nAction Items:")
        for ai in summary["action_items"]:
            print(f"  [{ai['priority']}] {ai['title']}")
            print(f"    Assignee: {ai['assignee']} | Status: {ai['status']} | "
                  f"Deadline: {ai['deadline']} | Overdue: {ai['is_overdue']}")

        print(f"\nDependencies:")
        for dep in summary["dependencies"]:
            print(f"  {dep['source']} --{dep['type']}--> {dep['target']}")

    # Reply-all check
    print(f"\nReply-All Check: {result['reply_all_check']}")
    print()


def test_scenario_2_progress_update():
    """Scenario 2: Progress update email that updates task statuses."""
    print("=" * 70)
    print("SCENARIO 2: Progress Update Email → Status Tracking")
    print("=" * 70)

    team = _make_team()
    bridge = EmailToProjectBridge(TicketPlatform.LINEAR)

    # First create the project
    kickoff = EmailMessage(
        subject="Project: API Migration Initiative",
        sender=team[0],
        recipients=team[1:4],
        thread_id="thread-002",
        body="""Project kickoff for API Migration.

Tasks:
- @bob Migrate auth service to v3 - deadline June 30
- @carol Update frontend API calls - due by end of month
- @dave Run regression tests after migration is done
""",
    )
    bridge.process_email(kickoff)

    # Now send a progress update
    update_email = EmailMessage(
        subject="Re: Project: API Migration Initiative",
        sender=team[1],  # Bob
        recipients=[team[0]],  # Only replying to Alice (not reply-all!)
        thread_id="thread-002",
        in_reply_to=kickoff.id,
        is_reply_all=False,
        body="""Hi Alice,

Quick update on the auth service migration:
- Migrate auth service to v3 is now completed and deployed.
- All endpoints are working, merged to main.

Carol's frontend API calls work is still in progress.
Dave is blocked waiting for the migration to finish.

Thanks,
Bob""",
    )

    result = bridge.process_email(update_email)
    print(f"\nResult: {result['action']}")
    if result.get("status_updates"):
        print("Status Updates Detected:")
        for update in result["status_updates"]:
            print(f"  '{update['item']}' → {update['new_status']}")

    # Reply-all enforcement
    print(f"\nReply-All Compliance Check:")
    ra_check = result["reply_all_check"]
    print(f"  Is project email: {ra_check['is_project_email']}")
    print(f"  Compliant: {ra_check['compliant']}")
    for w in ra_check.get("warnings", []):
        print(f"  ⚠️  WARNING: {w}")
    print()


def test_scenario_3_deadline_extraction():
    """Scenario 3: Various deadline formats in emails."""
    print("=" * 70)
    print("SCENARIO 3: Deadline Extraction from Natural Language")
    print("=" * 70)

    extractor = DeadlineExtractor()
    today = date.today()

    test_cases = [
        ("Please finish this by next Monday", "Next Monday"),
        ("Due in 3 days", "In 3 days"),
        ("Deadline is June 15", "June 15"),
        ("Need this ASAP", "ASAP"),
        ("Complete by end of week", "End of week"),
        ("Should be done in 2 weeks", "In 2 weeks"),
        ("Target date 12/25/2026", "Explicit date"),
        ("By EOD today", "EOD"),
        ("Finish by tomorrow", "Tomorrow"),
        ("Due January 15", "January 15"),
        ("End of month deadline", "End of month"),
    ]

    print(f"\nReference date: {today}\n")
    for text, description in test_cases:
        deadline = extractor.extract_deadline(text, today)
        priority = extractor.extract_priority(text)
        delta = (deadline - today).days if deadline else None
        print(f"  [{description:15s}] \"{text}\"")
        print(f"    → Deadline: {deadline} ({delta}d) | Priority: {priority.value}")
    print()


def test_scenario_4_gantt_and_dependencies():
    """Scenario 4: Gantt chart generation with dependency visualization."""
    print("=" * 70)
    print("SCENARIO 4: Gantt Chart Data & Dependency Detection")
    print("=" * 70)

    team = _make_team()
    bridge = EmailToProjectBridge(TicketPlatform.ASANA)

    project_email = EmailMessage(
        subject="[Project] Mobile App v2 Launch",
        sender=team[0],
        recipients=team[1:],
        thread_id="thread-004",
        body="""Let's start the Mobile App v2 project!

Action items:
- @bob Design system architecture - deadline in 5 days
- @carol Build UI components - due in 10 days
- @dave Write automated tests - due in 12 days
- @eve Set up staging environment - deadline in 3 days
- @bob Implement core features - due in 14 days
- @carol Integrate with backend - deadline in 18 days

Note: Design system architecture is a prerequisite for UI components.
Setting up staging is needed before automated tests.
""",
    )

    result = bridge.process_email(project_email)
    plan_id = result.get("plan_id")

    if plan_id:
        # Gantt data
        gantt = bridge.get_gantt_chart(plan_id)
        print(f"\nGantt Chart Tasks ({len(gantt)} tasks):")
        for task in gantt:
            dep_str = f" (depends: {', '.join(task['dependencies'])})" if task['dependencies'] else ""
            ms_str = f" [Milestone: {task['milestone']}]" if task['milestone'] else ""
            print(f"  {task['title']}")
            print(f"    {task['start_date']} → {task['end_date']} "
                  f"({task['duration_days']}d) | Progress: {task['progress']}%"
                  f"{dep_str}{ms_str}")

        # Mermaid output
        mermaid = bridge.get_mermaid_gantt(plan_id)
        print(f"\nMermaid Gantt Chart:")
        print(mermaid)

        # Ticket board summary
        summary = bridge.ticket_manager.get_board_summary()
        print(f"\nTicket Board ({summary['platform']}):")
        print(f"  Total: {summary['total_tickets']}")
        print(f"  By Status: {summary['by_status']}")
        print(f"  By Priority: {summary['by_priority']}")

    print()


def test_scenario_5_multi_thread_tracking():
    """Scenario 5: Multiple email threads updating same project."""
    print("=" * 70)
    print("SCENARIO 5: Multi-Thread Project Tracking")
    print("=" * 70)

    team = _make_team()
    bridge = EmailToProjectBridge(TicketPlatform.LINEAR)

    # Kickoff
    email1 = EmailMessage(
        subject="New Project: Security Audit 2026",
        sender=team[0],
        recipients=team[1:],
        thread_id="thread-005",
        body="""Project kickoff for Security Audit.

Tasks:
- @bob Review authentication module - due in 7 days
- @carol Audit frontend XSS vulnerabilities - deadline in 10 days
- @dave Penetration testing on API endpoints - due in 14 days
- @eve Review infrastructure security configs - deadline in 5 days
""",
    )
    r1 = bridge.process_email(email1)
    plan_id = r1.get("plan_id")

    # Week 1 update from Eve
    email2 = EmailMessage(
        subject="Re: New Project: Security Audit 2026",
        sender=team[4],  # Eve
        recipients=[team[0], team[1], team[2], team[3]],
        thread_id="thread-005",
        in_reply_to=email1.id,
        is_reply_all=True,
        body="""Infrastructure security configs review is completed.
All findings documented in the shared drive.

Also, Bob's authentication module review is in progress, about 60% done.""",
    )
    r2 = bridge.process_email(email2)

    # Week 2 update with blocker
    email3 = EmailMessage(
        subject="Re: New Project: Security Audit 2026 - BLOCKED",
        sender=team[2],  # Carol
        recipients=[team[0], team[1], team[2], team[3], team[4]],
        thread_id="thread-005",
        in_reply_to=email2.id,
        is_reply_all=True,
        body="""The XSS vulnerability audit is blocked by a dependency on the
updated CSP headers that Eve needs to deploy first.

Dave's penetration testing is still ongoing. We need the auth review
finished before we can complete API testing.""",
    )
    r3 = bridge.process_email(email3)

    print(f"\nProject created: {r1.get('action')}")
    print(f"Week 1 update: {r2.get('action')}")
    if r2.get("status_updates"):
        for u in r2["status_updates"]:
            print(f"  → {u['item']}: {u['new_status']}")
    print(f"Week 2 update: {r3.get('action')}")
    if r3.get("status_updates"):
        for u in r3["status_updates"]:
            print(f"  → {u['item']}: {u['new_status']}")

    if plan_id:
        summary = bridge.get_project_summary(plan_id)
        print(f"\nFinal Project Status: {summary['name']}")
        print(f"Overall Progress: {summary['overall_progress']}%")
        print(f"\nTask Statuses:")
        for ai in summary["action_items"]:
            status_icon = "✅" if ai["status"] == "done" else "🔶" if ai["status"] == "in_progress" else "🚫" if ai["status"] == "blocked" else "⬜"
            print(f"  {status_icon} [{ai['status']:12s}] {ai['title']} ({ai['assignee']})")
    print()


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    """Run all test scenarios demonstrating the V132 AI Email-to-Project Bridge."""
    print("\n" + "█" * 70)
    print("  V132 AI EMAIL-TO-PROJECT BRIDGE — Production Demo")
    print("  Converting email threads into structured project plans")
    print("█" * 70 + "\n")

    test_scenario_1_project_kickoff()
    test_scenario_2_progress_update()
    test_scenario_3_deadline_extraction()
    test_scenario_4_gantt_and_dependencies()
    test_scenario_5_multi_thread_tracking()

    print("=" * 70)
    print("All scenarios completed successfully.")
    print("=" * 70)


if __name__ == "__main__":
    main()
