#!/usr/bin/env python3
"""
V133 AI Email Sentiment Evolution Tracker
==========================================

Production-quality sentiment evolution tracking for email communications.
Tracks relationship health across contacts, detects deterioration early,
suggests repair actions, generates reports, and enforces reply-all policies
for relationship-critical communications.

Features:
    - Multi-granularity sentiment tracking (daily/weekly/monthly)
    - Early deterioration detection with configurable thresholds
    - Relationship repair action suggestions (apology templates, check-ins, value-adds)
    - Comprehensive health reports (per contact, per team, per segment)
    - Sentiment velocity tracking (rate of change over time)
    - Churn risk correlation analysis
    - Reply-all enforcement for relationship-critical emails

Author: V133 AI Systems
Version: 1.0.0
"""

from __future__ import annotations

import math
import statistics
import uuid
from collections import defaultdict
from dataclasses import dataclass, field
from datetime import datetime, timedelta
from enum import Enum, auto
from typing import Any, Dict, List, Optional, Set, Tuple


# ---------------------------------------------------------------------------
# Enums
# ---------------------------------------------------------------------------

class SentimentLevel(Enum):
    """Discrete sentiment classification levels."""
    VERY_NEGATIVE = auto()
    NEGATIVE = auto()
    NEUTRAL = auto()
    POSITIVE = auto()
    VERY_POSITIVE = auto()

    @classmethod
    def from_score(cls, score: float) -> "SentimentLevel":
        """Convert a continuous sentiment score [-1, 1] to a discrete level."""
        if score <= -0.6:
            return cls.VERY_NEGATIVE
        elif score <= -0.2:
            return cls.NEGATIVE
        elif score <= 0.2:
            return cls.NEUTRAL
        elif score <= 0.6:
            return cls.POSITIVE
        else:
            return cls.VERY_POSITIVE


class RelationshipStatus(Enum):
    """Overall health status of a contact relationship."""
    CRITICAL = auto()
    DETERIORATING = auto()
    AT_RISK = auto()
    STABLE = auto()
    THRIVING = auto()

    @classmethod
    def from_metrics(cls, avg_sentiment: float, velocity: float) -> "RelationshipStatus":
        """Derive status from average sentiment and velocity."""
        if avg_sentiment < -0.4 or velocity < -0.15:
            return cls.CRITICAL
        elif avg_sentiment < -0.1 or velocity < -0.08:
            return cls.DETERIORATING
        elif avg_sentiment < 0.1 or velocity < -0.03:
            return cls.AT_RISK
        elif avg_sentiment < 0.4:
            return cls.STABLE
        else:
            return cls.THRIVING


class RepairActionType(Enum):
    """Types of relationship repair actions the system can suggest."""
    APOLOGY_TEMPLATE = auto()
    CHECK_IN_REMINDER = auto()
    VALUE_ADD_OFFER = auto()
    ESCALATION_NOTICE = auto()
    MEETING_REQUEST = auto()
    PERSONAL_TOUCH = auto()


class CommunicationPriority(Enum):
    """Priority levels for email communications."""
    LOW = auto()
    NORMAL = auto()
    HIGH = auto()
    RELATIONSHIP_CRITICAL = auto()


class ChurnRiskLevel(Enum):
    """Churn risk classification."""
    VERY_LOW = auto()
    LOW = auto()
    MODERATE = auto()
    HIGH = auto()
    VERY_HIGH = auto()

    @classmethod
    def from_correlation(cls, score: float) -> "ChurnRiskLevel":
        """Classify churn risk from correlation score [0, 1]."""
        if score >= 0.8:
            return cls.VERY_HIGH
        elif score >= 0.6:
            return cls.HIGH
        elif score >= 0.4:
            return cls.MODERATE
        elif score >= 0.2:
            return cls.LOW
        else:
            return cls.VERY_LOW


class TimeGranularity(Enum):
    """Time aggregation granularity for trend analysis."""
    DAILY = auto()
    WEEKLY = auto()
    MONTHLY = auto()


# ---------------------------------------------------------------------------
# Dataclasses
# ---------------------------------------------------------------------------

@dataclass
class SentimentRecord:
    """A single sentiment measurement for an email interaction."""
    record_id: str
    contact_id: str
    timestamp: datetime
    sentiment_score: float  # [-1, 1]
    confidence: float  # [0, 1]
    email_subject: str
    is_reply_all: bool = False
    communication_priority: CommunicationPriority = CommunicationPriority.NORMAL

    def __post_init__(self) -> None:
        if not (-1.0 <= self.sentiment_score <= 1.0):
            raise ValueError(f"Sentiment score must be in [-1, 1], got {self.sentiment_score}")
        if not (0.0 <= self.confidence <= 1.0):
            raise ValueError(f"Confidence must be in [0, 1], got {self.confidence}")

    @property
    def level(self) -> SentimentLevel:
        return SentimentLevel.from_score(self.sentiment_score)


@dataclass
class ContactProfile:
    """Profile for a tracked contact."""
    contact_id: str
    name: str
    email: str
    team: str
    segment: str
    relationship_start: datetime
    tags: Set[str] = field(default_factory=set)
    metadata: Dict[str, Any] = field(default_factory=dict)


@dataclass
class RepairAction:
    """A suggested repair action for a deteriorating relationship."""
    action_id: str
    contact_id: str
    action_type: RepairActionType
    priority: int  # 1-5, 1 being highest
    description: str
    template_text: Optional[str] = None
    suggested_deadline: Optional[datetime] = None
    context: str = ""

    def __str__(self) -> str:
        return f"[{self.action_type.name}] P{self.priority}: {self.description}"


@dataclass
class ThresholdAlert:
    """Alert triggered when sentiment crosses a deterioration threshold."""
    alert_id: str
    contact_id: str
    timestamp: datetime
    alert_type: str
    current_value: float
    threshold_value: float
    message: str
    severity: int  # 1-5

    def __str__(self) -> str:
        return f"[SEV-{self.severity}] {self.alert_type}: {self.message}"


@dataclass
class SentimentVelocity:
    """Rate of change of sentiment over time."""
    contact_id: str
    window_days: int
    velocity: float  # score change per day
    acceleration: float  # velocity change per day
    trend_direction: str  # "improving", "stable", "declining"
    data_points: int

    @property
    def is_declining(self) -> bool:
        return self.velocity < -0.02

    @property
    def is_rapidly_declining(self) -> bool:
        return self.velocity < -0.08


@dataclass
class RelationshipHealthReport:
    """Comprehensive health report for a contact or group."""
    report_id: str
    scope: str  # "contact", "team", "segment"
    scope_value: str
    generated_at: datetime
    average_sentiment: float
    sentiment_velocity: float
    status: RelationshipStatus
    churn_risk: ChurnRiskLevel
    total_interactions: int
    period_days: int
    highlights: List[str] = field(default_factory=list)
    recommendations: List[str] = field(default_factory=list)
    reply_all_violations: int = 0


@dataclass
class ReplyAllPolicy:
    """Policy for reply-all enforcement on relationship-critical emails."""
    contact_id: str
    required_cc: List[str]
    enforce_on_keywords: List[str]
    enforce_on_priority: Set[CommunicationPriority]
    last_violation: Optional[datetime] = None
    violation_count: int = 0


# ---------------------------------------------------------------------------
# Core Engine
# ---------------------------------------------------------------------------

class SentimentEvolutionTracker:
    """
    Central engine for tracking email sentiment evolution across contacts.

    Provides real-time sentiment analysis, trend detection, deterioration alerts,
    repair suggestions, and relationship health reporting.
    """

    # Default thresholds
    DETERIORATION_THRESHOLD = -0.3
    CRITICAL_THRESHOLD = -0.5
    VELOCITY_ALERT_THRESHOLD = -0.1
    REPLY_ALL_CHECK_KEYWORDS = [
        "urgent", "critical", "escalation", "contract", "renewal",
        "partnership", "agreement", "complaint", "dispute", "final"
    ]

    def __init__(self) -> None:
        self._contacts: Dict[str, ContactProfile] = {}
        self._records: Dict[str, List[SentimentRecord]] = defaultdict(list)
        self._alerts: List[ThresholdAlert] = []
        self._repair_actions: Dict[str, List[RepairAction]] = defaultdict(list)
        self._reply_all_policies: Dict[str, ReplyAllPolicy] = {}
        self._reply_all_violations: List[Dict[str, Any]] = []
        self._churn_weights: Dict[str, float] = {
            "sentiment_decline": 0.20,
            "velocity_negative": 0.20,
            "absolute_negativity": 0.25,
            "response_time_increase": 0.10,
            "interaction_frequency_drop": 0.15,
            "reply_all_violations": 0.10,
        }

    # ------------------------------------------------------------------
    # Contact Management
    # ------------------------------------------------------------------

    def register_contact(self, profile: ContactProfile) -> None:
        """Register a new contact for sentiment tracking."""
        if profile.contact_id in self._contacts:
            raise ValueError(f"Contact {profile.contact_id} already registered")
        self._contacts[profile.contact_id] = profile

    def get_contact(self, contact_id: str) -> Optional[ContactProfile]:
        """Retrieve a contact profile."""
        return self._contacts.get(contact_id)

    def list_contacts(self, team: Optional[str] = None, segment: Optional[str] = None) -> List[ContactProfile]:
        """List contacts, optionally filtered by team or segment."""
        contacts = list(self._contacts.values())
        if team:
            contacts = [c for c in contacts if c.team == team]
        if segment:
            contacts = [c for c in contacts if c.segment == segment]
        return contacts

    # ------------------------------------------------------------------
    # Sentiment Recording
    # ------------------------------------------------------------------

    def record_sentiment(
        self,
        contact_id: str,
        sentiment_score: float,
        confidence: float,
        email_subject: str,
        timestamp: Optional[datetime] = None,
        is_reply_all: bool = False,
        communication_priority: CommunicationPriority = CommunicationPriority.NORMAL,
    ) -> SentimentRecord:
        """Record a new sentiment measurement for a contact."""
        if contact_id not in self._contacts:
            raise ValueError(f"Unknown contact: {contact_id}")

        record = SentimentRecord(
            record_id=str(uuid.uuid4()),
            contact_id=contact_id,
            timestamp=timestamp or datetime.now(),
            sentiment_score=sentiment_score,
            confidence=confidence,
            email_subject=email_subject,
            is_reply_all=is_reply_all,
            communication_priority=communication_priority,
        )

        self._records[contact_id].append(record)
        self._check_deterioration_thresholds(contact_id)
        self._enforce_reply_all_policy(record)

        return record

    def get_records(
        self,
        contact_id: str,
        start: Optional[datetime] = None,
        end: Optional[datetime] = None,
    ) -> List[SentimentRecord]:
        """Get sentiment records for a contact within an optional time range."""
        records = self._records.get(contact_id, [])
        if start:
            records = [r for r in records if r.timestamp >= start]
        if end:
            records = [r for r in records if r.timestamp <= end]
        return sorted(records, key=lambda r: r.timestamp)

    # ------------------------------------------------------------------
    # Trend Analysis (Daily / Weekly / Monthly)
    # ------------------------------------------------------------------

    def compute_trend(
        self,
        contact_id: str,
        granularity: TimeGranularity = TimeGranularity.DAILY,
        lookback_days: int = 90,
    ) -> Dict[str, float]:
        """
        Compute sentiment trend at the specified granularity.

        Returns a dict mapping period labels to average sentiment scores.
        """
        now = datetime.now()
        start = now - timedelta(days=lookback_days)
        records = self.get_records(contact_id, start=start)

        if not records:
            return {}

        buckets: Dict[str, List[float]] = defaultdict(list)

        for record in records:
            key = self._bucket_key(record.timestamp, granularity)
            buckets[key].append(record.sentiment_score)

        return {k: statistics.mean(v) for k, v in sorted(buckets.items())}

    def compute_team_trend(
        self,
        team: str,
        granularity: TimeGranularity = TimeGranularity.WEEKLY,
        lookback_days: int = 180,
    ) -> Dict[str, float]:
        """Compute aggregated sentiment trend for an entire team."""
        team_contacts = self.list_contacts(team=team)
        now = datetime.now()
        start = now - timedelta(days=lookback_days)

        buckets: Dict[str, List[float]] = defaultdict(list)

        for contact in team_contacts:
            records = self.get_records(contact.contact_id, start=start)
            for record in records:
                key = self._bucket_key(record.timestamp, granularity)
                buckets[key].append(record.sentiment_score)

        return {k: statistics.mean(v) for k, v in sorted(buckets.items())}

    def compute_segment_trend(
        self,
        segment: str,
        granularity: TimeGranularity = TimeGranularity.MONTHLY,
        lookback_days: int = 365,
    ) -> Dict[str, float]:
        """Compute aggregated sentiment trend for a market segment."""
        segment_contacts = self.list_contacts(segment=segment)
        now = datetime.now()
        start = now - timedelta(days=lookback_days)

        buckets: Dict[str, List[float]] = defaultdict(list)

        for contact in segment_contacts:
            records = self.get_records(contact.contact_id, start=start)
            for record in records:
                key = self._bucket_key(record.timestamp, granularity)
                buckets[key].append(record.sentiment_score)

        return {k: statistics.mean(v) for k, v in sorted(buckets.items())}

    # ------------------------------------------------------------------
    # Sentiment Velocity
    # ------------------------------------------------------------------

    def compute_velocity(
        self,
        contact_id: str,
        window_days: int = 30,
    ) -> SentimentVelocity:
        """
        Compute sentiment velocity (rate of change) for a contact.

        Velocity = average daily change in sentiment score.
        Acceleration = rate of change of velocity.
        """
        now = datetime.now()
        start = now - timedelta(days=window_days)
        records = self.get_records(contact_id, start=start)

        if len(records) < 2:
            return SentimentVelocity(
                contact_id=contact_id,
                window_days=window_days,
                velocity=0.0,
                acceleration=0.0,
                trend_direction="stable",
                data_points=len(records),
            )

        # Calculate daily deltas
        deltas: List[Tuple[float, float]] = []
        for i in range(1, len(records)):
            day_diff = (records[i].timestamp - records[i - 1].timestamp).total_seconds() / 86400
            if day_diff > 0:
                score_diff = records[i].sentiment_score - records[i - 1].sentiment_score
                deltas.append((day_diff, score_diff / day_diff))

        if not deltas:
            return SentimentVelocity(
                contact_id=contact_id,
                window_days=window_days,
                velocity=0.0,
                acceleration=0.0,
                trend_direction="stable",
                data_points=len(records),
            )

        velocity = statistics.mean([d[1] for d in deltas])

        # Compute acceleration (change in velocity)
        if len(deltas) >= 2:
            velocity_changes = [
                deltas[i][1] - deltas[i - 1][1]
                for i in range(1, len(deltas))
            ]
            acceleration = statistics.mean(velocity_changes)
        else:
            acceleration = 0.0

        if velocity > 0.02:
            direction = "improving"
        elif velocity < -0.02:
            direction = "declining"
        else:
            direction = "stable"

        return SentimentVelocity(
            contact_id=contact_id,
            window_days=window_days,
            velocity=round(velocity, 4),
            acceleration=round(acceleration, 4),
            trend_direction=direction,
            data_points=len(records),
        )

    # ------------------------------------------------------------------
    # Deterioration Detection & Alerts
    # ------------------------------------------------------------------

    def _check_deterioration_thresholds(self, contact_id: str) -> None:
        """Check if recent sentiment has crossed deterioration thresholds."""
        records = self._records.get(contact_id, [])
        if len(records) < 3:
            return

        recent = records[-3:]
        avg_recent = statistics.mean([r.sentiment_score for r in recent])
        latest = records[-1]

        # Check critical threshold
        if avg_recent <= self.CRITICAL_THRESHOLD:
            alert = ThresholdAlert(
                alert_id=str(uuid.uuid4()),
                contact_id=contact_id,
                timestamp=datetime.now(),
                alert_type="CRITICAL_SENTIMENT",
                current_value=avg_recent,
                threshold_value=self.CRITICAL_THRESHOLD,
                message=f"Contact {contact_id} avg sentiment ({avg_recent:.2f}) below critical threshold ({self.CRITICAL_THRESHOLD})",
                severity=1,
            )
            self._alerts.append(alert)
            self._suggest_repair_actions(contact_id, severity="critical")

        # Check deterioration threshold
        elif avg_recent <= self.DETERIORATION_THRESHOLD:
            alert = ThresholdAlert(
                alert_id=str(uuid.uuid4()),
                contact_id=contact_id,
                timestamp=datetime.now(),
                alert_type="DETERIORATION_WARNING",
                current_value=avg_recent,
                threshold_value=self.DETERIORATION_THRESHOLD,
                message=f"Contact {contact_id} avg sentiment ({avg_recent:.2f}) below deterioration threshold ({self.DETERIORATION_THRESHOLD})",
                severity=3,
            )
            self._alerts.append(alert)
            self._suggest_repair_actions(contact_id, severity="warning")

        # Check velocity-based deterioration
        if len(records) >= 5:
            last_5 = records[-5:]
            velocity_proxy = (last_5[-1].sentiment_score - last_5[0].sentiment_score) / 5
            if velocity_proxy < self.VELOCITY_ALERT_THRESHOLD:
                alert = ThresholdAlert(
                    alert_id=str(uuid.uuid4()),
                    contact_id=contact_id,
                    timestamp=datetime.now(),
                    alert_type="VELOCITY_DECLINE",
                    current_value=velocity_proxy,
                    threshold_value=self.VELOCITY_ALERT_THRESHOLD,
                    message=f"Contact {contact_id} sentiment declining rapidly (velocity: {velocity_proxy:.3f})",
                    severity=2,
                )
                self._alerts.append(alert)

    def get_alerts(
        self,
        contact_id: Optional[str] = None,
        min_severity: int = 5,
        since: Optional[datetime] = None,
    ) -> List[ThresholdAlert]:
        """Retrieve threshold alerts, optionally filtered."""
        alerts = self._alerts
        if contact_id:
            alerts = [a for a in alerts if a.contact_id == contact_id]
        if min_severity < 5:
            alerts = [a for a in alerts if a.severity <= min_severity]
        if since:
            alerts = [a for a in alerts if a.timestamp >= since]
        return sorted(alerts, key=lambda a: (a.severity, a.timestamp), reverse=False)

    def get_active_alerts(self) -> List[ThresholdAlert]:
        """Get all unresolved high-severity alerts (severity <= 2)."""
        return [a for a in self._alerts if a.severity <= 2]

    # ------------------------------------------------------------------
    # Repair Action Suggestions
    # ------------------------------------------------------------------

    # Apology template library
    APOLOGY_TEMPLATES = {
        "formal": (
            "Dear {name},\n\n"
            "I want to sincerely apologize for {issue}. I understand this has caused "
            "frustration, and I take full responsibility.\n\n"
            "To make this right, I'd like to {remediation}. "
            "I value our relationship and am committed to ensuring this doesn't happen again.\n\n"
            "Would you be available for a brief call this week to discuss?\n\n"
            "Best regards,\n{sender}"
        ),
        "warm": (
            "Hi {name},\n\n"
            "I've been thinking about our last interaction and I realize I dropped the ball on {issue}. "
            "That's on me, and I'm sorry.\n\n"
            "I'd love the chance to {remediation} and make things right. "
            "Your partnership means a lot to us.\n\n"
            "Can we grab coffee or hop on a quick call?\n\n"
            "Cheers,\n{sender}"
        ),
        "executive": (
            "{name},\n\n"
            "I wanted to personally reach out regarding {issue}. "
            "This falls short of the standards we hold ourselves to.\n\n"
            "I'm directing my team to {remediation} immediately. "
            "I'll personally oversee the resolution.\n\n"
            "Please don't hesitate to reach out directly if there's anything else.\n\n"
            "Regards,\n{sender}"
        ),
    }

    VALUE_ADD_OFFERS = [
        "Complimentary premium feature upgrade for 3 months",
        "Priority support channel access",
        "Exclusive invitation to upcoming product beta",
        "Custom training session for your team",
        "Extended trial period at no cost",
        "Dedicated account manager assignment",
        "Quarterly business review with executive sponsor",
    ]

    def _suggest_repair_actions(self, contact_id: str, severity: str) -> None:
        """Generate repair action suggestions based on severity."""
        contact = self._contacts.get(contact_id)
        if not contact:
            return

        actions: List[RepairAction] = []
        now = datetime.now()

        if severity == "critical":
            # Apology template
            actions.append(RepairAction(
                action_id=str(uuid.uuid4()),
                contact_id=contact_id,
                action_type=RepairActionType.APOLOGY_TEMPLATE,
                priority=1,
                description=f"Send formal apology to {contact.name} immediately",
                template_text=self.APOLOGY_TEMPLATES["formal"].format(
                    name=contact.name,
                    issue="[describe the issue]",
                    remediation="[propose specific fix]",
                    sender="[Your Name]",
                ),
                suggested_deadline=now + timedelta(hours=24),
                context="Critical sentiment decline detected",
            ))

            # Escalation notice
            actions.append(RepairAction(
                action_id=str(uuid.uuid4()),
                contact_id=contact_id,
                action_type=RepairActionType.ESCALATION_NOTICE,
                priority=1,
                description=f"Escalate {contact.name}'s account to management",
                suggested_deadline=now + timedelta(hours=4),
                context="Risk of relationship loss",
            ))

            # Meeting request
            actions.append(RepairAction(
                action_id=str(uuid.uuid4()),
                contact_id=contact_id,
                action_type=RepairActionType.MEETING_REQUEST,
                priority=2,
                description=f"Schedule in-person or video meeting with {contact.name}",
                template_text=(
                    f"Hi {contact.name},\n\n"
                    "I'd love to schedule some time to connect and ensure we're aligned "
                    "on your priorities. Would 30 minutes work sometime this week?\n\n"
                    "I want to make sure we're delivering the value you expect."
                ),
                suggested_deadline=now + timedelta(days=3),
                context="Critical: face-to-face reconnection needed",
            ))

            # Value-add offer
            actions.append(RepairAction(
                action_id=str(uuid.uuid4()),
                contact_id=contact_id,
                action_type=RepairActionType.VALUE_ADD_OFFER,
                priority=2,
                description=f"Offer value-add to {contact.name}",
                template_text=(
                    f"As a token of our appreciation, we'd like to offer: "
                    f"{self.VALUE_ADD_OFFERS[0]}"
                ),
                suggested_deadline=now + timedelta(days=5),
                context="Tangible gesture to rebuild goodwill",
            ))

        elif severity == "warning":
            # Check-in reminder
            actions.append(RepairAction(
                action_id=str(uuid.uuid4()),
                contact_id=contact_id,
                action_type=RepairActionType.CHECK_IN_REMINDER,
                priority=3,
                description=f"Send proactive check-in to {contact.name}",
                template_text=(
                    f"Hi {contact.name},\n\n"
                    "Just wanted to check in and see how things are going on your end. "
                    "Is there anything we can help with or improve?\n\n"
                    "We're here to support you."
                ),
                suggested_deadline=now + timedelta(days=2),
                context="Proactive relationship maintenance",
            ))

            # Personal touch
            actions.append(RepairAction(
                action_id=str(uuid.uuid4()),
                contact_id=contact_id,
                action_type=RepairActionType.PERSONAL_TOUCH,
                priority=3,
                description=f"Send personalized note to {contact.name} (reference shared interest/recent event)",
                suggested_deadline=now + timedelta(days=7),
                context="Strengthen personal connection",
            ))

            # Value-add
            actions.append(RepairAction(
                action_id=str(uuid.uuid4()),
                contact_id=contact_id,
                action_type=RepairActionType.VALUE_ADD_OFFER,
                priority=4,
                description=f"Share relevant resource or insight with {contact.name}",
                suggested_deadline=now + timedelta(days=5),
                context="Demonstrate ongoing value",
            ))

        self._repair_actions[contact_id].extend(actions)

    def get_repair_actions(self, contact_id: str) -> List[RepairAction]:
        """Get pending repair actions for a contact."""
        return sorted(self._repair_actions.get(contact_id, []), key=lambda a: a.priority)

    def get_all_pending_actions(self) -> Dict[str, List[RepairAction]]:
        """Get all pending repair actions across contacts."""
        return {
            cid: sorted(actions, key=lambda a: a.priority)
            for cid, actions in self._repair_actions.items()
            if actions
        }

    # ------------------------------------------------------------------
    # Churn Risk Correlation
    # ------------------------------------------------------------------

    def compute_churn_risk(self, contact_id: str) -> Tuple[ChurnRiskLevel, float, Dict[str, float]]:
        """
        Compute churn risk for a contact based on multiple correlated signals.

        Returns: (risk_level, risk_score [0-1], component_scores)
        """
        records = self._records.get(contact_id, [])
        components: Dict[str, float] = {}

        # 1. Sentiment decline component
        if len(records) >= 2:
            scores = [r.sentiment_score for r in records]
            recent_avg = statistics.mean(scores[-5:]) if len(scores) >= 5 else statistics.mean(scores[-2:])
            overall_avg = statistics.mean(scores)
            decline = max(0, (overall_avg - recent_avg) / 2.0)  # normalize to [0, 1]
            components["sentiment_decline"] = min(1.0, max(0.0, decline))
        else:
            components["sentiment_decline"] = 0.0

        # 2. Absolute negativity component (how negative is the overall sentiment)
        if records:
            recent_scores = [r.sentiment_score for r in records[-5:]]
            recent_avg = statistics.mean(recent_scores)
            # Map [-1, 0] to [1, 0] — fully negative = 1.0 churn risk from this factor
            components["absolute_negativity"] = min(1.0, max(0.0, -recent_avg))
        else:
            components["absolute_negativity"] = 0.0

        # 3. Velocity component
        velocity = self.compute_velocity(contact_id)
        components["velocity_negative"] = min(1.0, max(0.0, -velocity.velocity * 5))

        # 3. Response time proxy (interaction frequency decline)
        if len(records) >= 4:
            recent_gaps = []
            older_gaps = []
            for i in range(len(records) - 1):
                gap = (records[i + 1].timestamp - records[i].timestamp).total_seconds() / 86400
                if i >= len(records) // 2:
                    recent_gaps.append(gap)
                else:
                    older_gaps.append(gap)

            if older_gaps and recent_gaps:
                avg_recent_gap = statistics.mean(recent_gaps)
                avg_older_gap = statistics.mean(older_gaps)
                if avg_older_gap > 0:
                    gap_increase = (avg_recent_gap - avg_older_gap) / avg_older_gap
                    components["interaction_frequency_drop"] = min(1.0, max(0.0, gap_increase))
                else:
                    components["interaction_frequency_drop"] = 0.0
            else:
                components["interaction_frequency_drop"] = 0.0
        else:
            components["interaction_frequency_drop"] = 0.0

        # 4. Response time increase (simulated via confidence drop as proxy)
        if len(records) >= 3:
            recent_conf = statistics.mean([r.confidence for r in records[-3:]])
            older_conf = statistics.mean([r.confidence for r in records[:3]])
            conf_drop = max(0, older_conf - recent_conf)
            components["response_time_increase"] = min(1.0, conf_drop)
        else:
            components["response_time_increase"] = 0.0

        # 5. Reply-all violations
        violations = sum(
            1 for v in self._reply_all_violations
            if v.get("contact_id") == contact_id
        )
        components["reply_all_violations"] = min(1.0, violations / 5.0)

        # Weighted sum
        risk_score = sum(
            self._churn_weights.get(key, 0) * value
            for key, value in components.items()
        )
        risk_score = min(1.0, max(0.0, risk_score))

        risk_level = ChurnRiskLevel.from_correlation(risk_score)

        return risk_level, round(risk_score, 4), components

    # ------------------------------------------------------------------
    # Reply-All Enforcement
    # ------------------------------------------------------------------

    def set_reply_all_policy(self, policy: ReplyAllPolicy) -> None:
        """Set or update a reply-all enforcement policy for a contact."""
        self._reply_all_policies[policy.contact_id] = policy

    def _enforce_reply_all_policy(self, record: SentimentRecord) -> None:
        """Check if a sentiment record violates reply-all policy."""
        policy = self._reply_all_policies.get(record.contact_id)
        if not policy:
            # Auto-detect relationship-critical based on keywords/priority
            if record.communication_priority == CommunicationPriority.RELATIONSHIP_CRITICAL:
                if not record.is_reply_all:
                    self._log_reply_all_violation(record, "RELATIONSHIP_CRITICAL priority without reply-all")
            return

        # Check priority-based enforcement
        if record.communication_priority in policy.enforce_on_priority:
            if not record.is_reply_all:
                self._log_reply_all_violation(
                    record,
                    f"Priority {record.communication_priority.name} requires reply-all per policy"
                )
                return

        # Check keyword-based enforcement
        subject_lower = record.email_subject.lower()
        for keyword in policy.enforce_on_keywords:
            if keyword.lower() in subject_lower:
                if not record.is_reply_all:
                    self._log_reply_all_violation(
                        record,
                        f"Keyword '{keyword}' in subject requires reply-all per policy"
                    )
                    return

    def _log_reply_all_violation(self, record: SentimentRecord, reason: str) -> None:
        """Log a reply-all policy violation."""
        violation = {
            "violation_id": str(uuid.uuid4()),
            "contact_id": record.contact_id,
            "record_id": record.record_id,
            "timestamp": record.timestamp,
            "subject": record.email_subject,
            "reason": reason,
        }
        self._reply_all_violations.append(violation)

        # Update policy violation count
        policy = self._reply_all_policies.get(record.contact_id)
        if policy:
            policy.violation_count += 1
            policy.last_violation = record.timestamp

    def get_reply_all_violations(
        self,
        contact_id: Optional[str] = None,
    ) -> List[Dict[str, Any]]:
        """Get reply-all violations, optionally filtered by contact."""
        violations = self._reply_all_violations
        if contact_id:
            violations = [v for v in violations if v["contact_id"] == contact_id]
        return violations

    def check_reply_all_required(
        self,
        contact_id: str,
        subject: str,
        priority: CommunicationPriority,
    ) -> Tuple[bool, str]:
        """
        Pre-send check: determine if reply-all is required for this email.

        Returns: (required: bool, reason: str)
        """
        if priority == CommunicationPriority.RELATIONSHIP_CRITICAL:
            return True, "Relationship-critical priority always requires reply-all"

        policy = self._reply_all_policies.get(contact_id)
        if not policy:
            return False, ""

        if priority in policy.enforce_on_priority:
            return True, f"Priority {priority.name} requires reply-all per policy"

        for keyword in policy.enforce_on_keywords:
            if keyword.lower() in subject.lower():
                return True, f"Keyword '{keyword}' triggers reply-all requirement"

        return False, ""

    # ------------------------------------------------------------------
    # Health Reports
    # ------------------------------------------------------------------

    def generate_contact_report(
        self,
        contact_id: str,
        period_days: int = 90,
    ) -> RelationshipHealthReport:
        """Generate a comprehensive health report for a single contact."""
        contact = self._contacts.get(contact_id)
        if not contact:
            raise ValueError(f"Unknown contact: {contact_id}")

        now = datetime.now()
        start = now - timedelta(days=period_days)
        records = self.get_records(contact_id, start=start)

        avg_sentiment = statistics.mean([r.sentiment_score for r in records]) if records else 0.0
        velocity = self.compute_velocity(contact_id, window_days=min(period_days, 30))
        churn_level, churn_score, _ = self.compute_churn_risk(contact_id)

        status = RelationshipStatus.from_metrics(avg_sentiment, velocity.velocity)

        violations = len(self.get_reply_all_violations(contact_id))

        highlights = []
        recommendations = []

        if velocity.is_rapidly_declining:
            highlights.append("⚠️ Rapid sentiment decline detected")
            recommendations.append("Immediate outreach recommended")
        if churn_level in (ChurnRiskLevel.HIGH, ChurnRiskLevel.VERY_HIGH):
            highlights.append(f"🔴 High churn risk (score: {churn_score:.2f})")
            recommendations.append("Escalate to account management")
        if violations > 0:
            highlights.append(f"📋 {violations} reply-all policy violation(s)")
            recommendations.append("Review reply-all compliance training")
        if avg_sentiment > 0.5:
            highlights.append("✅ Strong positive sentiment")
            recommendations.append("Consider referral or case study request")
        if status == RelationshipStatus.THRIVING:
            highlights.append("🌟 Relationship is thriving")

        return RelationshipHealthReport(
            report_id=str(uuid.uuid4()),
            scope="contact",
            scope_value=contact.name,
            generated_at=now,
            average_sentiment=round(avg_sentiment, 3),
            sentiment_velocity=velocity.velocity,
            status=status,
            churn_risk=churn_level,
            total_interactions=len(records),
            period_days=period_days,
            highlights=highlights,
            recommendations=recommendations,
            reply_all_violations=violations,
        )

    def generate_team_report(
        self,
        team: str,
        period_days: int = 90,
    ) -> RelationshipHealthReport:
        """Generate an aggregated health report for a team."""
        team_contacts = self.list_contacts(team=team)
        if not team_contacts:
            raise ValueError(f"No contacts found for team: {team}")

        now = datetime.now()
        start = now - timedelta(days=period_days)

        all_sentiments: List[float] = []
        total_interactions = 0
        total_violations = 0
        contact_statuses: List[RelationshipStatus] = []

        for contact in team_contacts:
            records = self.get_records(contact.contact_id, start=start)
            if records:
                all_sentiments.extend([r.sentiment_score for r in records])
                total_interactions += len(records)
            total_violations += len(self.get_reply_all_violations(contact.contact_id))

            if records:
                avg = statistics.mean([r.sentiment_score for r in records])
                vel = self.compute_velocity(contact.contact_id, window_days=min(period_days, 30))
                contact_statuses.append(RelationshipStatus.from_metrics(avg, vel.velocity))

        avg_sentiment = statistics.mean(all_sentiments) if all_sentiments else 0.0
        velocities = [
            self.compute_velocity(c.contact_id, window_days=min(period_days, 30)).velocity
            for c in team_contacts
        ]
        avg_velocity = statistics.mean(velocities) if velocities else 0.0

        # Team status = worst individual status
        if contact_statuses:
            worst_status = min(contact_statuses, key=lambda s: s.value)
        else:
            worst_status = RelationshipStatus.STABLE

        churn_level = ChurnRiskLevel.from_correlation(max(0, -avg_sentiment))

        highlights = []
        recommendations = []

        critical_count = sum(1 for s in contact_statuses if s == RelationshipStatus.CRITICAL)
        if critical_count:
            highlights.append(f"🔴 {critical_count} contact(s) in CRITICAL status")
            recommendations.append("Immediate intervention needed for critical contacts")

        thriving_count = sum(1 for s in contact_statuses if s == RelationshipStatus.THRIVING)
        if thriving_count:
            highlights.append(f"🌟 {thriving_count} contact(s) thriving")

        if total_violations > 0:
            highlights.append(f"📋 {total_violations} total reply-all violations across team")

        return RelationshipHealthReport(
            report_id=str(uuid.uuid4()),
            scope="team",
            scope_value=team,
            generated_at=now,
            average_sentiment=round(avg_sentiment, 3),
            sentiment_velocity=round(avg_velocity, 4),
            status=worst_status,
            churn_risk=churn_level,
            total_interactions=total_interactions,
            period_days=period_days,
            highlights=highlights,
            recommendations=recommendations,
            reply_all_violations=total_violations,
        )

    def generate_segment_report(
        self,
        segment: str,
        period_days: int = 180,
    ) -> RelationshipHealthReport:
        """Generate an aggregated health report for a market segment."""
        segment_contacts = self.list_contacts(segment=segment)
        if not segment_contacts:
            raise ValueError(f"No contacts found for segment: {segment}")

        now = datetime.now()
        start = now - timedelta(days=period_days)

        all_sentiments: List[float] = []
        total_interactions = 0
        total_violations = 0

        for contact in segment_contacts:
            records = self.get_records(contact.contact_id, start=start)
            if records:
                all_sentiments.extend([r.sentiment_score for r in records])
                total_interactions += len(records)
            total_violations += len(self.get_reply_all_violations(contact.contact_id))

        avg_sentiment = statistics.mean(all_sentiments) if all_sentiments else 0.0
        churn_level = ChurnRiskLevel.from_correlation(max(0, -avg_sentiment))
        status = RelationshipStatus.from_metrics(avg_sentiment, 0.0)

        return RelationshipHealthReport(
            report_id=str(uuid.uuid4()),
            scope="segment",
            scope_value=segment,
            generated_at=now,
            average_sentiment=round(avg_sentiment, 3),
            sentiment_velocity=0.0,
            status=status,
            churn_risk=churn_level,
            total_interactions=total_interactions,
            period_days=period_days,
            highlights=[f"Segment '{segment}' with {len(segment_contacts)} contacts"],
            recommendations=["Review segment-wide engagement strategy"] if avg_sentiment < 0 else [],
            reply_all_violations=total_violations,
        )

    # ------------------------------------------------------------------
    # Utility
    # ------------------------------------------------------------------

    @staticmethod
    def _bucket_key(timestamp: datetime, granularity: TimeGranularity) -> str:
        """Generate a bucket key for time-based aggregation."""
        if granularity == TimeGranularity.DAILY:
            return timestamp.strftime("%Y-%m-%d")
        elif granularity == TimeGranularity.WEEKLY:
            # ISO week
            iso = timestamp.isocalendar()
            return f"{iso[0]}-W{iso[1]:02d}"
        elif granularity == TimeGranularity.MONTHLY:
            return timestamp.strftime("%Y-%m")
        return timestamp.strftime("%Y-%m-%d")


# ---------------------------------------------------------------------------
# Report Formatter
# ---------------------------------------------------------------------------

class ReportFormatter:
    """Formats relationship health reports for display."""

    @staticmethod
    def format_report(report: RelationshipHealthReport) -> str:
        """Format a health report as a readable string."""
        lines = [
            "=" * 60,
            f"  RELATIONSHIP HEALTH REPORT",
            f"  Scope: {report.scope.upper()} — {report.scope_value}",
            f"  Generated: {report.generated_at.strftime('%Y-%m-%d %H:%M')}",
            f"  Period: {report.period_days} days",
            "=" * 60,
            "",
            f"  Status:           {report.status.name}",
            f"  Avg Sentiment:    {report.average_sentiment:+.3f}",
            f"  Sentiment Velocity: {report.sentiment_velocity:+.4f}/day",
            f"  Churn Risk:       {report.churn_risk.name}",
            f"  Interactions:     {report.total_interactions}",
            f"  Reply-All Violations: {report.reply_all_violations}",
            "",
        ]

        if report.highlights:
            lines.append("  HIGHLIGHTS:")
            for h in report.highlights:
                lines.append(f"    • {h}")
            lines.append("")

        if report.recommendations:
            lines.append("  RECOMMENDATIONS:")
            for r in report.recommendations:
                lines.append(f"    → {r}")
            lines.append("")

        lines.append("=" * 60)
        return "\n".join(lines)

    @staticmethod
    def format_velocity(velocity: SentimentVelocity) -> str:
        """Format velocity data as readable string."""
        arrow = "↑" if velocity.trend_direction == "improving" else (
            "↓" if velocity.trend_direction == "declining" else "→"
        )
        return (
            f"Velocity: {velocity.velocity:+.4f}/day {arrow} | "
            f"Acceleration: {velocity.acceleration:+.4f} | "
            f"Direction: {velocity.trend_direction} | "
            f"Data Points: {velocity.data_points}"
        )

    @staticmethod
    def format_repair_actions(actions: List[RepairAction]) -> str:
        """Format repair actions as a readable list."""
        if not actions:
            return "  No pending repair actions."
        lines = ["  PENDING REPAIR ACTIONS:"]
        for action in actions:
            deadline_str = ""
            if action.suggested_deadline:
                deadline_str = f" [Due: {action.suggested_deadline.strftime('%Y-%m-%d')}]"
            lines.append(f"    P{action.priority} {action.action_type.name}: {action.description}{deadline_str}")
            if action.template_text:
                lines.append(f"       Template preview: {action.template_text[:80]}...")
        return "\n".join(lines)

    @staticmethod
    def format_trend(trend: Dict[str, float]) -> str:
        """Format a trend dictionary as an ASCII chart."""
        if not trend:
            return "  No trend data available."

        lines = ["  SENTIMENT TREND:"]
        max_width = 40

        for period, score in trend.items():
            bar_width = int(abs(score) * max_width)
            if score >= 0:
                bar = " " * 20 + "│" + "█" * bar_width
            else:
                padding = 20 - bar_width
                bar = " " * max(0, padding) + "█" * bar_width + "│"
            lines.append(f"    {period:12s} {score:+.3f} {bar}")

        return "\n".join(lines)


# ---------------------------------------------------------------------------
# Test Scenarios
# ---------------------------------------------------------------------------

def run_test_scenario_1() -> None:
    """
    Scenario 1: Healthy relationship with gradual deterioration detection.
    Tests: sentiment recording, trend analysis, deterioration alerts.
    """
    print("\n" + "=" * 70)
    print("  TEST SCENARIO 1: Gradual Deterioration Detection")
    print("=" * 70)

    tracker = SentimentEvolutionTracker()
    now = datetime.now()

    # Register a contact
    contact = ContactProfile(
        contact_id="C001",
        name="Sarah Chen",
        email="sarah.chen@acmecorp.com",
        team="Enterprise",
        segment="Technology",
        relationship_start=now - timedelta(days=365),
        tags={"vip", "long-term"},
    )
    tracker.register_contact(contact)

    # Simulate a gradual deterioration over 30 days
    sentiment_trajectory = [
        0.8, 0.75, 0.7, 0.65, 0.5, 0.4, 0.3, 0.2, 0.1, 0.0,
        -0.1, -0.15, -0.2, -0.25, -0.3, -0.35, -0.4, -0.45,
        -0.5, -0.55
    ]

    subjects = [
        "Q3 Partnership Review", "Follow-up on deliverables", "Checking in",
        "Project update", "Feedback on latest release", "Concerns about timeline",
        "Escalation: SLA breach", "Urgent: Response needed", "Disappointed with service",
        "Final warning on contract terms", "Contract renewal concerns", "Service quality issues",
        "Unresolved tickets", "Request for management call", "Critical system outage",
        "Last chance for resolution", "Evaluating alternatives", "Formal complaint",
        "Termination notice pending", "Account review request"
    ]

    for i, (score, subject) in enumerate(zip(sentiment_trajectory, subjects)):
        timestamp = now - timedelta(days=len(sentiment_trajectory) - i)
        tracker.record_sentiment(
            contact_id="C001",
            sentiment_score=score,
            confidence=0.85 + (i * 0.005),
            email_subject=subject,
            timestamp=timestamp,
        )

    # Analyze
    daily_trend = tracker.compute_trend("C001", TimeGranularity.DAILY, lookback_days=30)
    velocity = tracker.compute_velocity("C001", window_days=30)
    alerts = tracker.get_alerts("C001")
    repair_actions = tracker.get_repair_actions("C001")

    print(f"\n  Contact: {contact.name}")
    print(f"  Total records: {len(tracker.get_records('C001'))}")
    print(f"  {ReportFormatter.format_velocity(velocity)}")
    print(f"  Alerts triggered: {len(alerts)}")

    for alert in alerts[:3]:
        print(f"    {alert}")

    print(f"\n  {ReportFormatter.format_repair_actions(repair_actions)}")
    print(f"\n  {ReportFormatter.format_trend(dict(list(daily_trend.items())[-7:]))}")

    # Assertions
    assert len(tracker.get_records("C001")) == 20, "Should have 20 records"
    assert velocity.is_declining, "Velocity should be declining"
    assert len(alerts) > 0, "Should have triggered alerts"
    assert len(repair_actions) > 0, "Should have repair actions"
    print("\n  ✅ Scenario 1 PASSED")


def run_test_scenario_2() -> None:
    """
    Scenario 2: Multi-contact team analysis with churn risk correlation.
    Tests: team reports, churn risk, segment analysis.
    """
    print("\n" + "=" * 70)
    print("  TEST SCENARIO 2: Team & Churn Risk Analysis")
    print("=" * 70)

    tracker = SentimentEvolutionTracker()
    now = datetime.now()

    # Register multiple contacts on the same team
    contacts = [
        ContactProfile("T001", "Alice Wang", "alice@bigco.com", "Engineering", "Enterprise", now - timedelta(days=200)),
        ContactProfile("T002", "Bob Martinez", "bob@bigco.com", "Engineering", "Enterprise", now - timedelta(days=150)),
        ContactProfile("T003", "Carol Smith", "carol@bigco.com", "Engineering", "Enterprise", now - timedelta(days=300)),
        ContactProfile("T004", "Dave Johnson", "dave@smallco.com", "Sales", "SMB", now - timedelta(days=90)),
        ContactProfile("T005", "Eve Brown", "eve@smallco.com", "Sales", "SMB", now - timedelta(days=60)),
    ]

    for c in contacts:
        tracker.register_contact(c)

    # Engineering team: mixed sentiments
    engineering_scores = {
        "T001": [0.6, 0.5, 0.4, 0.3, 0.2],  # declining
        "T002": [0.3, 0.4, 0.5, 0.6, 0.7],  # improving
        "T003": [0.8, 0.7, 0.6, 0.5, 0.3, 0.1, -0.1, -0.3, -0.5, -0.6, -0.7, -0.8, -0.85, -0.9, -0.95],  # critically declining
    }

    for cid, scores in engineering_scores.items():
        for i, score in enumerate(scores):
            tracker.record_sentiment(
                contact_id=cid,
                sentiment_score=score,
                confidence=0.8,
                email_subject=f"Weekly sync #{i+1}",
                timestamp=now - timedelta(days=len(scores) * 2 - i * 2),
            )

    # Sales team: generally stable
    for cid in ["T004", "T005"]:
        for i in range(5):
            tracker.record_sentiment(
                contact_id=cid,
                sentiment_score=0.5 + (i * 0.05),
                confidence=0.9,
                email_subject=f"Sales check-in #{i+1}",
                timestamp=now - timedelta(days=15 - i * 3),
            )

    # Generate reports
    team_report = tracker.generate_team_report("Engineering", period_days=30)
    segment_report = tracker.generate_segment_report("Enterprise", period_days=30)

    print(f"\n  {ReportFormatter.format_report(team_report)}")
    print(f"\n  {ReportFormatter.format_report(segment_report)}")

    # Churn risk per contact
    print("\n  CHURN RISK ANALYSIS:")
    for c in contacts[:3]:
        level, score, components = tracker.compute_churn_risk(c.contact_id)
        print(f"    {c.name}: {level.name} (score: {score:.3f})")
        for comp, val in components.items():
            print(f"      {comp}: {val:.3f}")

    # Assertions
    assert team_report.total_interactions >= 20, f"Engineering should have 20+ interactions, got {team_report.total_interactions}"
    assert team_report.scope == "team"
    assert segment_report.scope == "segment"
    t003_level, t003_score, _ = tracker.compute_churn_risk("T003")
    assert t003_score > 0.3, \
        f"T003 should have elevated churn risk score, got {t003_level.name} (score: {t003_score})"
    print("\n  ✅ Scenario 2 PASSED")


def run_test_scenario_3() -> None:
    """
    Scenario 3: Reply-all enforcement for relationship-critical communications.
    Tests: policy setup, violation detection, pre-send checks.
    """
    print("\n" + "=" * 70)
    print("  TEST SCENARIO 3: Reply-All Enforcement")
    print("=" * 70)

    tracker = SentimentEvolutionTracker()
    now = datetime.now()

    contact = ContactProfile(
        contact_id="R001",
        name="Michael Torres",
        email="mtorres@megabank.com",
        team="Finance",
        segment="Financial Services",
        relationship_start=now - timedelta(days=500),
    )
    tracker.register_contact(contact)

    # Set up reply-all policy
    policy = ReplyAllPolicy(
        contact_id="R001",
        required_cc=["manager@ourcompany.com", "legal@ourcompany.com"],
        enforce_on_keywords=["contract", "renewal", "dispute", "complaint", "urgent"],
        enforce_on_priority={CommunicationPriority.RELATIONSHIP_CRITICAL, CommunicationPriority.HIGH},
    )
    tracker.set_reply_all_policy(policy)

    # Test pre-send checks
    print("\n  PRE-SEND CHECKS:")
    checks = [
        ("Contract renewal discussion", CommunicationPriority.NORMAL),
        ("Weekly status update", CommunicationPriority.NORMAL),
        ("URGENT: System outage impact", CommunicationPriority.HIGH),
        ("Meeting notes from Tuesday", CommunicationPriority.LOW),
        ("Dispute resolution proposal", CommunicationPriority.RELATIONSHIP_CRITICAL),
    ]

    for subject, priority in checks:
        required, reason = tracker.check_reply_all_required("R001", subject, priority)
        status = "🔴 REPLY-ALL REQUIRED" if required else "✅ OK (no reply-all needed)"
        print(f"    '{subject}' [{priority.name}]: {status}")
        if reason:
            print(f"      Reason: {reason}")

    # Record emails that violate policy
    print("\n  RECORDING EMAILS (some violating policy):")

    # This should trigger violation (keyword "contract" without reply-all)
    tracker.record_sentiment(
        contact_id="R001",
        sentiment_score=0.2,
        confidence=0.9,
        email_subject="Contract amendment proposal",
        timestamp=now - timedelta(days=5),
        is_reply_all=False,
        communication_priority=CommunicationPriority.NORMAL,
    )
    print("    ✉️ 'Contract amendment proposal' sent WITHOUT reply-all → VIOLATION")

    # This should be fine
    tracker.record_sentiment(
        contact_id="R001",
        sentiment_score=0.4,
        confidence=0.85,
        email_subject="Product demo follow-up",
        timestamp=now - timedelta(days=4),
        is_reply_all=False,
        communication_priority=CommunicationPriority.NORMAL,
    )
    print("    ✉️ 'Product demo follow-up' sent without reply-all → OK")

    # This should trigger violation (HIGH priority without reply-all)
    tracker.record_sentiment(
        contact_id="R001",
        sentiment_score=-0.1,
        confidence=0.9,
        email_subject="Q4 planning discussion",
        timestamp=now - timedelta(days=3),
        is_reply_all=False,
        communication_priority=CommunicationPriority.HIGH,
    )
    print("    ✉️ 'Q4 planning discussion' (HIGH priority) without reply-all → VIOLATION")

    # This should be fine (correctly uses reply-all)
    tracker.record_sentiment(
        contact_id="R001",
        sentiment_score=0.6,
        confidence=0.95,
        email_subject="Renewal terms agreed",
        timestamp=now - timedelta(days=2),
        is_reply_all=True,
        communication_priority=CommunicationPriority.RELATIONSHIP_CRITICAL,
    )
    print("    ✉️ 'Renewal terms agreed' (CRITICAL) WITH reply-all → OK")

    # Check violations
    violations = tracker.get_reply_all_violations("R001")
    print(f"\n  Total violations: {len(violations)}")
    for v in violations:
        print(f"    ⚠️ {v['subject']}: {v['reason']}")

    # Generate contact report showing violations
    report = tracker.generate_contact_report("R001", period_days=30)
    print(f"\n  {ReportFormatter.format_report(report)}")

    # Assertions
    assert len(violations) == 2, f"Should have 2 violations, got {len(violations)}"
    assert report.reply_all_violations == 2
    required, _ = tracker.check_reply_all_required("R001", "Contract discussion", CommunicationPriority.NORMAL)
    assert required, "Contract keyword should trigger reply-all requirement"
    print("\n  ✅ Scenario 3 PASSED")


def run_test_scenario_4() -> None:
    """
    Scenario 4: Full lifecycle - from healthy to critical with recovery attempt.
    Tests: velocity tracking, repair action lifecycle, comprehensive reporting.
    """
    print("\n" + "=" * 70)
    print("  TEST SCENARIO 4: Full Lifecycle with Recovery Attempt")
    print("=" * 70)

    tracker = SentimentEvolutionTracker()
    now = datetime.now()

    contact = ContactProfile(
        contact_id="L001",
        name="Jennifer Park",
        email="jpark@innovatech.io",
        team="Product",
        segment="Technology",
        relationship_start=now - timedelta(days=400),
        tags={"champion", "strategic"},
    )
    tracker.register_contact(contact)

    # Phase 1: Healthy relationship (days -60 to -40)
    print("\n  Phase 1: HEALTHY RELATIONSHIP (days -60 to -40)")
    for i in range(10):
        tracker.record_sentiment(
            contact_id="L001",
            sentiment_score=0.7 + (i * 0.01),
            confidence=0.9,
            email_subject=f"Collaboration update #{i+1}",
            timestamp=now - timedelta(days=60 - i * 2),
        )

    v1 = tracker.compute_velocity("L001", window_days=30)
    print(f"    {ReportFormatter.format_velocity(v1)}")

    # Phase 2: Deterioration (days -40 to -20) - project issues
    print("\n  Phase 2: DETERIORATION (days -40 to -20)")
    decline_scores = [0.5, 0.3, 0.1, -0.1, -0.2, -0.3, -0.35, -0.4, -0.45, -0.5]
    decline_subjects = [
        "Timeline concerns", "Missed deadline impact", "Quality issues found",
        "Escalation: Bug in production", "Customer complaints rising",
        "Need immediate action", "Second escalation this week",
        "Considering alternatives", "Management review pending", "Formal notice of dissatisfaction"
    ]

    for i, (score, subject) in enumerate(zip(decline_scores, decline_subjects)):
        tracker.record_sentiment(
            contact_id="L001",
            sentiment_score=score,
            confidence=0.85,
            email_subject=subject,
            timestamp=now - timedelta(days=40 - i * 2),
        )

    v2 = tracker.compute_velocity("L001", window_days=30)
    print(f"    {ReportFormatter.format_velocity(v2)}")

    # Check alerts generated
    alerts = tracker.get_alerts("L001")
    print(f"    Alerts: {len(alerts)}")
    for alert in alerts[:3]:
        print(f"      {alert}")

    # Check repair actions
    actions = tracker.get_repair_actions("L001")
    print(f"\n    {ReportFormatter.format_repair_actions(actions)}")

    # Phase 3: Recovery attempt (days -20 to now)
    print("\n  Phase 3: RECOVERY ATTEMPT (days -20 to now)")
    recovery_scores = [-0.5, -0.4, -0.3, -0.2, -0.1, 0.0, 0.1, 0.15, 0.2, 0.25]
    recovery_subjects = [
        "Acknowledging concerns", "Action plan shared", "First fix deployed",
        "Progress update", "Additional improvements", "Weekly check-in",
        "Positive feedback received", "Team alignment meeting", "Roadmap preview shared",
        "Partnership reaffirmed"
    ]

    for i, (score, subject) in enumerate(zip(recovery_scores, recovery_subjects)):
        tracker.record_sentiment(
            contact_id="L001",
            sentiment_score=score,
            confidence=0.8 + (i * 0.01),
            email_subject=subject,
            timestamp=now - timedelta(days=20 - i * 2),
        )

    v3 = tracker.compute_velocity("L001", window_days=30)
    print(f"    {ReportFormatter.format_velocity(v3)}")

    # Final comprehensive report
    report = tracker.generate_contact_report("L001", period_days=90)
    print(f"\n  {ReportFormatter.format_report(report)}")

    # Churn risk
    churn_level, churn_score, components = tracker.compute_churn_risk("L001")
    print(f"  CHURN RISK: {churn_level.name} (score: {churn_score:.3f})")
    for comp, val in components.items():
        bar = "█" * int(val * 20)
        print(f"    {comp:35s} {val:.3f} {bar}")

    # Monthly trend
    monthly = tracker.compute_trend("L001", TimeGranularity.MONTHLY, lookback_days=90)
    print(f"\n  {ReportFormatter.format_trend(monthly)}")

    # Assertions
    assert v1.trend_direction in ("improving", "stable"), "Phase 1 should be stable/improving"
    assert v2.is_declining, "Phase 2 should be declining"
    assert v3.trend_direction == "improving", "Phase 3 should show improvement"
    assert len(tracker.get_records("L001")) == 30, "Should have 30 total records"
    assert report.total_interactions == 30
    print("\n  ✅ Scenario 4 PASSED")


def run_test_scenario_5() -> None:
    """
    Scenario 5: Edge cases and error handling.
    Tests: validation, empty states, boundary conditions.
    """
    print("\n" + "=" * 70)
    print("  TEST SCENARIO 5: Edge Cases & Error Handling")
    print("=" * 70)

    tracker = SentimentEvolutionTracker()
    now = datetime.now()

    # Test: Register duplicate contact
    contact = ContactProfile("E001", "Test User", "test@test.com", "Test", "Test", now)
    tracker.register_contact(contact)
    try:
        tracker.register_contact(contact)
        assert False, "Should have raised ValueError"
    except ValueError as e:
        print(f"  ✅ Duplicate registration blocked: {e}")

    # Test: Invalid sentiment score
    try:
        SentimentRecord(
            record_id="x", contact_id="E001", timestamp=now,
            sentiment_score=2.0, confidence=0.5, email_subject="test"
        )
        assert False, "Should have raised ValueError"
    except ValueError as e:
        print(f"  ✅ Invalid score blocked: {e}")

    # Test: Invalid confidence
    try:
        SentimentRecord(
            record_id="x", contact_id="E001", timestamp=now,
            sentiment_score=0.5, confidence=-0.1, email_subject="test"
        )
        assert False, "Should have raised ValueError"
    except ValueError as e:
        print(f"  ✅ Invalid confidence blocked: {e}")

    # Test: Recording for unknown contact
    try:
        tracker.record_sentiment("UNKNOWN", 0.5, 0.9, "test")
        assert False, "Should have raised ValueError"
    except ValueError as e:
        print(f"  ✅ Unknown contact blocked: {e}")

    # Test: Empty trend computation
    empty_trend = tracker.compute_trend("E001", TimeGranularity.DAILY)
    assert empty_trend == {}, "Empty contact should return empty trend"
    print(f"  ✅ Empty trend returns empty dict")

    # Test: Velocity with insufficient data
    tracker.record_sentiment("E001", 0.5, 0.9, "single email", timestamp=now)
    velocity = tracker.compute_velocity("E001", window_days=30)
    assert velocity.velocity == 0.0, "Single record velocity should be 0"
    assert velocity.data_points == 1
    print(f"  ✅ Single-record velocity: {velocity.velocity}")

    # Test: SentimentLevel classification boundaries
    assert SentimentLevel.from_score(-1.0) == SentimentLevel.VERY_NEGATIVE
    assert SentimentLevel.from_score(-0.6) == SentimentLevel.VERY_NEGATIVE
    assert SentimentLevel.from_score(-0.5) == SentimentLevel.NEGATIVE
    assert SentimentLevel.from_score(0.0) == SentimentLevel.NEUTRAL
    assert SentimentLevel.from_score(0.5) == SentimentLevel.POSITIVE
    assert SentimentLevel.from_score(0.7) == SentimentLevel.VERY_POSITIVE
    print(f"  ✅ SentimentLevel boundaries correct")

    # Test: RelationshipStatus derivation
    assert RelationshipStatus.from_metrics(-0.5, -0.2) == RelationshipStatus.CRITICAL
    assert RelationshipStatus.from_metrics(-0.2, -0.1) == RelationshipStatus.DETERIORATING
    assert RelationshipStatus.from_metrics(0.0, -0.05) == RelationshipStatus.AT_RISK
    assert RelationshipStatus.from_metrics(0.3, 0.0) == RelationshipStatus.STABLE
    assert RelationshipStatus.from_metrics(0.6, 0.1) == RelationshipStatus.THRIVING
    print(f"  ✅ RelationshipStatus derivation correct")

    # Test: ChurnRiskLevel boundaries
    assert ChurnRiskLevel.from_correlation(0.0) == ChurnRiskLevel.VERY_LOW
    assert ChurnRiskLevel.from_correlation(0.3) == ChurnRiskLevel.LOW
    assert ChurnRiskLevel.from_correlation(0.5) == ChurnRiskLevel.MODERATE
    assert ChurnRiskLevel.from_correlation(0.7) == ChurnRiskLevel.HIGH
    assert ChurnRiskLevel.from_correlation(0.9) == ChurnRiskLevel.VERY_HIGH
    print(f"  ✅ ChurnRiskLevel boundaries correct")

    # Test: Report generation for unknown contact
    try:
        tracker.generate_contact_report("NONEXISTENT")
        assert False, "Should have raised ValueError"
    except ValueError as e:
        print(f"  ✅ Unknown report blocked: {e}")

    # Test: Team report for empty team
    try:
        tracker.generate_team_report("NonexistentTeam")
        assert False, "Should have raised ValueError"
    except ValueError as e:
        print(f"  ✅ Empty team report blocked: {e}")

    # Test: List contacts with filters
    c2 = ContactProfile("E002", "User 2", "u2@test.com", "Sales", "SMB", now)
    c3 = ContactProfile("E003", "User 3", "u3@test.com", "Test", "SMB", now)
    tracker.register_contact(c2)
    tracker.register_contact(c3)

    all_contacts = tracker.list_contacts()
    sales_contacts = tracker.list_contacts(team="Sales")
    smb_contacts = tracker.list_contacts(segment="SMB")

    assert len(all_contacts) == 3
    assert len(sales_contacts) == 1
    assert len(smb_contacts) == 2
    print(f"  ✅ Contact filtering correct (all={len(all_contacts)}, sales={len(sales_contacts)}, smb={len(smb_contacts)})")

    print("\n  ✅ Scenario 5 PASSED")


# ---------------------------------------------------------------------------
# Main Entry Point
# ---------------------------------------------------------------------------

def main() -> None:
    """Run the V133 AI Email Sentiment Evolution Tracker demo."""
    print("╔══════════════════════════════════════════════════════════════╗")
    print("║    V133 AI Email Sentiment Evolution Tracker v1.0.0         ║")
    print("║    Production Sentiment Analysis & Relationship Management  ║")
    print("╚══════════════════════════════════════════════════════════════╝")

    run_test_scenario_1()
    run_test_scenario_2()
    run_test_scenario_3()
    run_test_scenario_4()
    run_test_scenario_5()

    print("\n" + "=" * 70)
    print("  ALL TEST SCENARIOS PASSED ✅")
    print("=" * 70)
    print("\n  Summary:")
    print("    • Scenario 1: Gradual deterioration detection with alerts")
    print("    • Scenario 2: Multi-contact team analysis & churn risk")
    print("    • Scenario 3: Reply-all enforcement for critical comms")
    print("    • Scenario 4: Full lifecycle (healthy → critical → recovery)")
    print("    • Scenario 5: Edge cases, validation, error handling")
    print()


if __name__ == "__main__":
    main()
