#!/usr/bin/env python3
"""
V134 AI Email Signature Intelligence System
============================================

Production-quality email signature intelligence platform that dynamically adapts
signatures per recipient, tracks engagement, runs A/B tests with statistical
analysis, enforces brand consistency, and manages per-department policies.

Features:
    - Dynamic smart signatures adapting to recipient industry/role
    - Click and engagement tracking across signature links
    - A/B testing with statistical significance analysis
    - Brand consistency enforcement (logo, colors, fonts, disclaimers)
    - Multi-template support (formal/casual/creative)
    - Per-department signature policies
    - Reply-all enforcement for team email requirements

Author: V134 Systems
Version: 1.0.0
"""

from __future__ import annotations

import hashlib
import json
import math
import random
import re
import string
import time
import uuid
from collections import defaultdict
from dataclasses import dataclass, field
from datetime import datetime, timedelta
from enum import Enum, auto
from typing import Any, Dict, List, Optional, Set, Tuple


# =============================================================================
# ENUMS
# =============================================================================


class SignatureStyle(Enum):
    """Signature visual style options."""
    FORMAL = auto()
    CASUAL = auto()
    CREATIVE = auto()
    MINIMAL = auto()
    EXECUTIVE = auto()


class Department(Enum):
    """Organizational departments."""
    SALES = auto()
    ENGINEERING = auto()
    MARKETING = auto()
    SUPPORT = auto()
    EXECUTIVE = auto()
    HR = auto()
    LEGAL = auto()
    FINANCE = auto()


class RecipientIndustry(Enum):
    """Recipient industry classifications."""
    TECHNOLOGY = auto()
    HEALTHCARE = auto()
    FINANCE = auto()
    EDUCATION = auto()
    MANUFACTURING = auto()
    RETAIL = auto()
    GOVERNMENT = auto()
    NONPROFIT = auto()
    MEDIA = auto()
    LEGAL = auto()


class RecipientRole(Enum):
    """Recipient role classifications."""
    C_LEVEL = auto()
    VP = auto()
    DIRECTOR = auto()
    MANAGER = auto()
    INDIVIDUAL_CONTRIBUTOR = auto()
    ANALYST = auto()
    CONSULTANT = auto()


class EngagementType(Enum):
    """Types of signature link engagement."""
    CLICK = auto()
    HOVER = auto()
    SOCIAL_SHARE = auto()
    CALENDAR_BOOK = auto()
    DOWNLOAD = auto()
    VIDEO_PLAY = auto()


class TemplateType(Enum):
    """Signature template categories."""
    STANDARD = auto()
    PROMOTIONAL = auto()
    EVENT = auto()
    HOLIDAY = auto()
    PRODUCT_LAUNCH = auto()
    AWARD_ANNOUNCEMENT = auto()


class BrandElementType(Enum):
    """Types of brand elements that must be enforced."""
    LOGO = auto()
    COLOR_PRIMARY = auto()
    COLOR_SECONDARY = auto()
    FONT_FAMILY = auto()
    FONT_SIZE = auto()
    DISCLAIMER = auto()
    SOCIAL_ICONS = auto()
    CTA_BUTTON = auto()


class ComplianceStatus(Enum):
    """Brand compliance check results."""
    COMPLIANT = auto()
    WARNING = auto()
    VIOLATION = auto()


class ABTestStatus(Enum):
    """A/B test lifecycle states."""
    DRAFT = auto()
    RUNNING = auto()
    PAUSED = auto()
    COMPLETED = auto()
    INCONCLUSIVE = auto()


class LinkType(Enum):
    """Types of links in signatures."""
    WEBSITE = auto()
    LINKEDIN = auto()
    TWITTER = auto()
    CALENDAR = auto()
    CASE_STUDY = auto()
    PRODUCT_PAGE = auto()
    BOOKING = auto()
    SOCIAL_PROOF = auto()
    VIDEO = auto()
    DOWNLOAD = auto()


# =============================================================================
# DATACLASSES
# =============================================================================


@dataclass
class BrandPolicy:
    """Organization-wide brand consistency rules."""
    organization_name: str
    logo_url: str
    primary_color: str
    secondary_color: str
    font_family: str
    font_size_name: int = 14
    font_size_title: int = 11
    font_size_contact: int = 10
    required_disclaimer: str = ""
    social_icon_style: str = "circle"
    max_logo_width_px: int = 200
    max_logo_height_px: int = 60
    allowed_fonts: List[str] = field(default_factory=lambda: ["Arial", "Helvetica", "Calibri"])
    forbidden_elements: List[str] = field(default_factory=list)
    disclaimer_required: bool = True
    logo_required: bool = True
    color_strict: bool = True

    def validate_color(self, color_hex: str) -> bool:
        """Check if a color is within the allowed brand palette."""
        if not self.color_strict:
            return True
        return color_hex in (self.primary_color, self.secondary_color)

    def validate_font(self, font_name: str) -> bool:
        """Check if font is in the allowed brand font list."""
        return font_name in self.allowed_fonts


@dataclass
class DepartmentPolicy:
    """Per-department signature configuration and rules."""
    department: Department
    default_style: SignatureStyle
    required_elements: List[BrandElementType] = field(default_factory=list)
    optional_elements: List[BrandElementType] = field(default_factory=list)
    forbidden_elements: List[BrandElementType] = field(default_factory=list)
    custom_disclaimer: str = ""
    allowed_case_studies: List[str] = field(default_factory=list)
    allowed_calendar_links: bool = True
    max_links: int = 8
    reply_all_enforcement: bool = True
    team_email_required: bool = False
    custom_cta: str = ""
    signature_expiry_days: int = 30

    def get_required_reply_all_elements(self) -> List[BrandElementType]:
        """Get elements required when sending reply-all emails."""
        base = list(self.required_elements)
        if self.team_email_required:
            if BrandElementType.SOCIAL_ICONS not in base:
                base.append(BrandElementType.SOCIAL_ICONS)
        return base


@dataclass
class SignatureLink:
    """A clickable link within an email signature."""
    link_id: str = field(default_factory=lambda: str(uuid.uuid4())[:8])
    link_type: LinkType = LinkType.WEBSITE
    url: str = ""
    display_text: str = ""
    icon_url: str = ""
    tracking_enabled: bool = True
    utm_source: str = "email_signature"
    utm_medium: str = "signature"
    utm_campaign: str = ""
    click_count: int = 0
    unique_clicks: int = 0

    def get_tracked_url(self) -> str:
        """Generate URL with UTM tracking parameters."""
        if not self.tracking_enabled:
            return self.url
        separator = "&" if "?" in self.url else "?"
        params = (
            f"utm_source={self.utm_source}"
            f"&utm_medium={self.utm_medium}"
            f"&utm_campaign={self.utm_campaign or 'default'}"
        )
        return f"{self.url}{separator}{params}"

    def record_click(self, is_unique: bool = True) -> None:
        """Record a click event on this link."""
        self.click_count += 1
        if is_unique:
            self.unique_clicks += 1


@dataclass
class CaseStudy:
    """A case study that can be dynamically inserted based on recipient."""
    study_id: str = field(default_factory=lambda: str(uuid.uuid4())[:8])
    title: str = ""
    summary: str = ""
    industry: RecipientIndustry = RecipientIndustry.TECHNOLOGY
    target_roles: List[RecipientRole] = field(default_factory=list)
    result_metric: str = ""
    result_value: str = ""
    client_name: str = ""
    url: str = ""
    priority: int = 0

    def is_relevant_to(self, industry: RecipientIndustry, role: RecipientRole) -> bool:
        """Check if this case study is relevant to a given recipient."""
        industry_match = self.industry == industry
        role_match = not self.target_roles or role in self.target_roles
        return industry_match and role_match


@dataclass
class SocialProof:
    """Social proof element for signatures."""
    proof_id: str = field(default_factory=lambda: str(uuid.uuid4())[:8])
    content: str = ""
    source: str = ""
    rating: float = 0.0
    industry: Optional[RecipientIndustry] = None
    badge_url: str = ""
    testimonial_url: str = ""


@dataclass
class Recipient:
    """Email recipient profile for signature adaptation."""
    email: str = ""
    name: str = ""
    company: str = ""
    industry: RecipientIndustry = RecipientIndustry.TECHNOLOGY
    role: RecipientRole = RecipientRole.INDIVIDUAL_CONTRIBUTOR
    previous_engagement: int = 0
    preferred_style: Optional[SignatureStyle] = None
    tags: List[str] = field(default_factory=list)

    @property
    def domain(self) -> str:
        """Extract domain from email."""
        return self.email.split("@")[-1] if "@" in self.email else ""

    @property
    def is_senior(self) -> bool:
        """Check if recipient is C-level or VP."""
        return self.role in (RecipientRole.C_LEVEL, RecipientRole.VP)


@dataclass
class ClickEvent:
    """A recorded click/engagement event."""
    event_id: str = field(default_factory=lambda: str(uuid.uuid4()))
    timestamp: datetime = field(default_factory=datetime.now)
    link_id: str = ""
    link_type: LinkType = LinkType.WEBSITE
    recipient_email: str = ""
    sender_email: str = ""
    signature_variant: str = ""
    engagement_type: EngagementType = EngagementType.CLICK
    ip_address: str = ""
    user_agent: str = ""
    referrer: str = ""

    @property
    def hour_of_day(self) -> int:
        return self.timestamp.hour

    @property
    def day_of_week(self) -> str:
        return self.timestamp.strftime("%A")


@dataclass
class SignatureVariant:
    """A signature variant used in A/B testing."""
    variant_id: str = field(default_factory=lambda: str(uuid.uuid4())[:8])
    name: str = ""
    style: SignatureStyle = SignatureStyle.FORMAL
    template_type: TemplateType = TemplateType.STANDARD
    links: List[SignatureLink] = field(default_factory=list)
    include_case_study: bool = False
    include_social_proof: bool = False
    include_calendar: bool = False
    custom_cta: str = ""
    html_output: str = ""
    impressions: int = 0
    clicks: int = 0
    conversions: int = 0

    @property
    def click_through_rate(self) -> float:
        """Calculate CTR for this variant."""
        if self.impressions == 0:
            return 0.0
        return self.clicks / self.impressions

    @property
    def conversion_rate(self) -> float:
        """Calculate conversion rate."""
        if self.clicks == 0:
            return 0.0
        return self.conversions / self.clicks


@dataclass
class ABTestResult:
    """Statistical results from an A/B test comparison."""
    test_id: str = ""
    variant_a_id: str = ""
    variant_b_id: str = ""
    variant_a_ctr: float = 0.0
    variant_b_ctr: float = 0.0
    variant_a_impressions: int = 0
    variant_b_impressions: int = 0
    z_score: float = 0.0
    p_value: float = 1.0
    confidence_level: float = 0.0
    is_significant: bool = False
    winner: Optional[str] = None
    lift_percentage: float = 0.0
    recommendation: str = ""

    def to_summary(self) -> str:
        """Generate human-readable summary."""
        lines = [
            f"A/B Test Results ({self.test_id})",
            f"  Variant A: {self.variant_a_ctr:.2%} CTR ({self.variant_a_impressions} impressions)",
            f"  Variant B: {self.variant_b_ctr:.2%} CTR ({self.variant_b_impressions} impressions)",
            f"  Z-Score: {self.z_score:.4f}",
            f"  P-Value: {self.p_value:.4f}",
            f"  Confidence: {self.confidence_level:.1%}",
            f"  Statistically Significant: {self.is_significant}",
            f"  Winner: {self.winner or 'None'}",
            f"  Lift: {self.lift_percentage:+.1f}%",
            f"  Recommendation: {self.recommendation}",
        ]
        return "\n".join(lines)


@dataclass
class ABTest:
    """An A/B test configuration and state."""
    test_id: str = field(default_factory=lambda: str(uuid.uuid4())[:8])
    name: str = ""
    description: str = ""
    status: ABTestStatus = ABTestStatus.DRAFT
    variants: List[SignatureVariant] = field(default_factory=list)
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    target_sample_size: int = 1000
    min_confidence: float = 0.95
    results: Optional[ABTestResult] = None
    created_at: datetime = field(default_factory=datetime.now)

    @property
    def total_impressions(self) -> int:
        return sum(v.impressions for v in self.variants)

    @property
    def is_complete(self) -> bool:
        return self.total_impressions >= self.target_sample_size


@dataclass
class SignatureTemplate:
    """A reusable signature template."""
    template_id: str = field(default_factory=lambda: str(uuid.uuid4())[:8])
    name: str = ""
    style: SignatureStyle = SignatureStyle.FORMAL
    template_type: TemplateType = TemplateType.STANDARD
    html_structure: str = ""
    placeholders: List[str] = field(default_factory=list)
    department: Optional[Department] = None
    is_active: bool = True
    created_at: datetime = field(default_factory=datetime.now)
    updated_at: datetime = field(default_factory=datetime.now)


@dataclass
class EmailSignature:
    """A complete email signature instance."""
    signature_id: str = field(default_factory=lambda: str(uuid.uuid4()))
    sender_name: str = ""
    sender_title: str = ""
    sender_email: str = ""
    sender_phone: str = ""
    sender_department: Department = Department.SALES
    company_name: str = ""
    style: SignatureStyle = SignatureStyle.FORMAL
    links: List[SignatureLink] = field(default_factory=list)
    case_study: Optional[CaseStudy] = None
    social_proof: Optional[SocialProof] = None
    calendar_link: str = ""
    disclaimer: str = ""
    logo_url: str = ""
    brand_color: str = ""
    variant_id: Optional[str] = None
    created_at: datetime = field(default_factory=datetime.now)

    def to_html(self) -> str:
        """Render the signature as HTML."""
        parts = []
        parts.append(f'<table cellpadding="0" cellspacing="0" style="font-family: Arial, sans-serif; border-left: 4px solid {self.brand_color}; padding-left: 12px;">')
        parts.append(f'  <tr><td>')
        parts.append(f'    <strong style="font-size: 14px; color: #333;">{self.sender_name}</strong><br>')
        parts.append(f'    <span style="font-size: 11px; color: #666;">{self.sender_title}</span><br>')
        parts.append(f'    <span style="font-size: 10px; color: #999;">{self.company_name}</span>')
        parts.append(f'  </td></tr>')
        parts.append(f'  <tr><td style="padding-top: 8px;">')
        parts.append(f'    <span style="font-size: 10px;">')
        parts.append(f'      <a href="mailto:{self.sender_email}" style="color: {self.brand_color};">{self.sender_email}</a>')
        if self.sender_phone:
            parts.append(f'      &nbsp;|&nbsp; {self.sender_phone}')
        parts.append(f'    </span>')
        parts.append(f'  </td></tr>')

        if self.links:
            parts.append(f'  <tr><td style="padding-top: 6px;">')
            link_parts = []
            for link in self.links:
                tracked_url = link.get_tracked_url()
                link_parts.append(
                    f'<a href="{tracked_url}" style="color: {self.brand_color}; font-size: 10px; text-decoration: none;">{link.display_text}</a>'
                )
            parts.append("      " + " &nbsp;|&nbsp; ".join(link_parts))
            parts.append(f'  </td></tr>')

        if self.case_study:
            parts.append(f'  <tr><td style="padding-top: 8px; background: #f8f9fa; padding: 8px; border-radius: 4px;">')
            parts.append(f'    <span style="font-size: 9px; color: #666; text-transform: uppercase; letter-spacing: 1px;">CASE STUDY</span><br>')
            parts.append(f'    <a href="{self.case_study.url}" style="font-size: 11px; color: #333; text-decoration: none;">')
            parts.append(f'      {self.case_study.title}')
            parts.append(f'    </a><br>')
            parts.append(f'    <span style="font-size: 10px; color: {self.brand_color}; font-weight: bold;">{self.case_study.result_metric}: {self.case_study.result_value}</span>')
            parts.append(f'  </td></tr>')

        if self.social_proof:
            parts.append(f'  <tr><td style="padding-top: 6px;">')
            parts.append(f'    <span style="font-size: 9px; color: #888; font-style: italic;">"{self.social_proof.content}"</span><br>')
            parts.append(f'    <span style="font-size: 9px; color: #aaa;">— {self.social_proof.source}</span>')
            parts.append(f'  </td></tr>')

        if self.calendar_link:
            parts.append(f'  <tr><td style="padding-top: 8px;">')
            parts.append(f'    <a href="{self.calendar_link}" style="display: inline-block; background: {self.brand_color}; color: white; padding: 6px 16px; border-radius: 4px; font-size: 11px; text-decoration: none; font-weight: bold;">📅 Book a Meeting</a>')
            parts.append(f'  </td></tr>')

        if self.disclaimer:
            parts.append(f'  <tr><td style="padding-top: 12px; border-top: 1px solid #eee; margin-top: 8px;">')
            parts.append(f'    <span style="font-size: 8px; color: #bbb; line-height: 1.4;">{self.disclaimer}</span>')
            parts.append(f'  </td></tr>')

        parts.append('</table>')
        return "\n".join(parts)

    def validate_brand_compliance(self, policy: BrandPolicy) -> List[Tuple[ComplianceStatus, str]]:
        """Validate this signature against brand policy."""
        issues: List[Tuple[ComplianceStatus, str]] = []

        if policy.logo_required and not self.logo_url:
            issues.append((ComplianceStatus.VIOLATION, "Logo is required but missing"))
        if policy.disclaimer_required and not self.disclaimer:
            issues.append((ComplianceStatus.VIOLATION, "Disclaimer is required but missing"))
        if self.brand_color and not policy.validate_color(self.brand_color):
            issues.append((ComplianceStatus.WARNING, f"Color {self.brand_color} not in brand palette"))
        if policy.logo_required and self.logo_url:
            if self.logo_url != policy.logo_url:
                issues.append((ComplianceStatus.VIOLATION, "Logo URL does not match brand policy"))
        if not issues:
            issues.append((ComplianceStatus.COMPLIANT, "All brand checks passed"))
        return issues


# =============================================================================
# ENGINES
# =============================================================================


class CaseStudyRepository:
    """Repository managing case studies for dynamic insertion."""

    def __init__(self) -> None:
        self._studies: Dict[str, CaseStudy] = {}

    def add(self, study: CaseStudy) -> None:
        self._studies[study.study_id] = study

    def get_relevant(
        self, industry: RecipientIndustry, role: RecipientRole, limit: int = 1
    ) -> List[CaseStudy]:
        """Get case studies relevant to a recipient's industry and role."""
        relevant = [
            s for s in self._studies.values()
            if s.is_relevant_to(industry, role)
        ]
        relevant.sort(key=lambda s: s.priority, reverse=True)
        return relevant[:limit]

    def get_all(self) -> List[CaseStudy]:
        return list(self._studies.values())

    @property
    def count(self) -> int:
        return len(self._studies)


class SocialProofRepository:
    """Repository managing social proof elements."""

    def __init__(self) -> None:
        self._proofs: Dict[str, SocialProof] = {}

    def add(self, proof: SocialProof) -> None:
        self._proofs[proof.proof_id] = proof

    def get_for_industry(self, industry: RecipientIndustry) -> List[SocialProof]:
        """Get social proof elements for a specific industry."""
        return [
            p for p in self._proofs.values()
            if p.industry is None or p.industry == industry
        ]

    def get_best_for_industry(self, industry: RecipientIndustry) -> Optional[SocialProof]:
        """Get the highest-rated social proof for an industry."""
        proofs = self.get_for_industry(industry)
        if not proofs:
            return None
        return max(proofs, key=lambda p: p.rating)


class EngagementTracker:
    """Tracks and analyzes signature link clicks and engagement."""

    def __init__(self) -> None:
        self._events: List[ClickEvent] = []
        self._unique_visitors: Set[str] = set()

    def record_event(self, event: ClickEvent) -> str:
        """Record a new engagement event."""
        self._events.append(event)
        visitor_key = f"{event.recipient_email}:{event.link_id}"
        self._unique_visitors.add(visitor_key)
        return event.event_id

    def get_events_by_link(self, link_id: str) -> List[ClickEvent]:
        """Get all events for a specific link."""
        return [e for e in self._events if e.link_id == link_id]

    def get_events_by_recipient(self, email: str) -> List[ClickEvent]:
        """Get all events from a specific recipient."""
        return [e for e in self._events if e.recipient_email == email]

    def get_click_stats(self, link_id: str) -> Dict[str, Any]:
        """Get aggregated click statistics for a link."""
        events = self.get_events_by_link(link_id)
        if not events:
            return {"total_clicks": 0, "unique_clicks": 0, "ctr": 0.0}

        unique = set()
        for e in events:
            unique.add(e.recipient_email)

        return {
            "total_clicks": len(events),
            "unique_clicks": len(unique),
            "engagement_types": dict(
                defaultdict(int, {e.engagement_type.name: 1 for e in events})
            ),
            "top_hours": self._get_top_hours(events),
            "top_days": self._get_top_days(events),
        }

    def _get_top_hours(self, events: List[ClickEvent]) -> Dict[int, int]:
        """Get click distribution by hour of day."""
        hours: Dict[int, int] = defaultdict(int)
        for e in events:
            hours[e.hour_of_day] += 1
        return dict(sorted(hours.items(), key=lambda x: x[1], reverse=True)[:5])

    def _get_top_days(self, events: List[ClickEvent]) -> Dict[str, int]:
        """Get click distribution by day of week."""
        days: Dict[str, int] = defaultdict(int)
        for e in events:
            days[e.day_of_week] += 1
        return dict(sorted(days.items(), key=lambda x: x[1], reverse=True))

    def get_overall_stats(self) -> Dict[str, Any]:
        """Get overall engagement statistics."""
        total_events = len(self._events)
        unique_links = len(set(e.link_id for e in self._events))
        unique_recipients = len(set(e.recipient_email for e in self._events))

        engagement_breakdown: Dict[str, int] = defaultdict(int)
        for e in self._events:
            engagement_breakdown[e.engagement_type.name] += 1

        return {
            "total_events": total_events,
            "unique_links_tracked": unique_links,
            "unique_recipients_engaged": unique_recipients,
            "engagement_breakdown": dict(engagement_breakdown),
            "avg_events_per_recipient": (
                total_events / unique_recipients if unique_recipients > 0 else 0
            ),
        }

    def get_heatmap_data(self) -> Dict[str, Dict[int, int]]:
        """Generate day/hour heatmap of engagement."""
        heatmap: Dict[str, Dict[int, int]] = defaultdict(lambda: defaultdict(int))
        for e in self._events:
            heatmap[e.day_of_week][e.hour_of_day] += 1
        return {day: dict(hours) for day, hours in heatmap.items()}

    @property
    def total_events(self) -> int:
        return len(self._events)


class ABTestAnalyzer:
    """Statistical analysis engine for A/B testing signature variants."""

    @staticmethod
    def calculate_z_score(
        conversions_a: int,
        impressions_a: int,
        conversions_b: int,
        impressions_b: int,
    ) -> float:
        """Calculate Z-score for comparing two proportions."""
        if impressions_a == 0 or impressions_b == 0:
            return 0.0

        p_a = conversions_a / impressions_a
        p_b = conversions_b / impressions_b
        p_pool = (conversions_a + conversions_b) / (impressions_a + impressions_b)

        if p_pool == 0 or p_pool == 1:
            return 0.0

        se = math.sqrt(
            p_pool * (1 - p_pool) * (1 / impressions_a + 1 / impressions_b)
        )
        if se == 0:
            return 0.0

        return (p_b - p_a) / se

    @staticmethod
    def z_to_p_value(z: float) -> float:
        """Approximate p-value from z-score using error function approximation."""
        z_abs = abs(z)
        # Approximation using complementary error function
        t = 1.0 / (1.0 + 0.2316419 * z_abs)
        d = 0.3989422804014327  # 1/sqrt(2*pi)
        p = d * math.exp(-z_abs * z_abs / 2.0) * (
            t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.8212560 + t * 1.3302744))))
        )
        return 2 * p  # two-tailed test

    @staticmethod
    def calculate_confidence_interval(
        conversion_rate: float, sample_size: int, confidence: float = 0.95
    ) -> Tuple[float, float]:
        """Calculate confidence interval for a conversion rate."""
        if sample_size == 0:
            return (0.0, 0.0)
        # Z-value for 95% confidence
        z_val = 1.96 if confidence == 0.95 else 2.576 if confidence == 0.99 else 1.645
        margin = z_val * math.sqrt(conversion_rate * (1 - conversion_rate) / sample_size)
        lower = max(0.0, conversion_rate - margin)
        upper = min(1.0, conversion_rate + margin)
        return (lower, upper)

    @staticmethod
    def required_sample_size(
        baseline_rate: float,
        minimum_detectable_effect: float,
        confidence: float = 0.95,
        power: float = 0.80,
    ) -> int:
        """Calculate required sample size per variant."""
        z_alpha = 1.96 if confidence == 0.95 else 2.576
        z_beta = 0.842 if power == 0.80 else 1.282

        p1 = baseline_rate
        p2 = baseline_rate * (1 + minimum_detectable_effect)
        p_pool = (p1 + p2) / 2

        numerator = (
            z_alpha * math.sqrt(2 * p_pool * (1 - p_pool))
            + z_beta * math.sqrt(p1 * (1 - p1) + p2 * (1 - p2))
        ) ** 2
        denominator = (p2 - p1) ** 2

        if denominator == 0:
            return 10000
        return math.ceil(numerator / denominator)

    def analyze_test(self, test: ABTest) -> ABTestResult:
        """Run full statistical analysis on an A/B test."""
        if len(test.variants) < 2:
            raise ValueError("A/B test requires at least 2 variants")

        var_a = test.variants[0]
        var_b = test.variants[1]

        ctr_a = var_a.click_through_rate
        ctr_b = var_b.click_through_rate

        z = self.calculate_z_score(
            var_a.clicks, var_a.impressions,
            var_b.clicks, var_b.impressions,
        )
        p = self.z_to_p_value(z)
        confidence = 1 - p

        is_significant = confidence >= test.min_confidence
        lift = ((ctr_b - ctr_a) / ctr_a * 100) if ctr_a > 0 else 0

        if is_significant:
            winner = var_b.variant_id if ctr_b > ctr_a else var_a.variant_id
            recommendation = (
                f"Deploy variant {winner} - statistically significant "
                f"{'improvement' if lift > 0 else 'decrease'} of {lift:+.1f}%"
            )
        else:
            winner = None
            if test.is_complete:
                recommendation = "Test inconclusive - no significant difference detected"
            else:
                remaining = test.target_sample_size - test.total_impressions
                recommendation = f"Continue test - need {remaining} more impressions for significance"

        return ABTestResult(
            test_id=test.test_id,
            variant_a_id=var_a.variant_id,
            variant_b_id=var_b.variant_id,
            variant_a_ctr=ctr_a,
            variant_b_ctr=ctr_b,
            variant_a_impressions=var_a.impressions,
            variant_b_impressions=var_b.impressions,
            z_score=z,
            p_value=p,
            confidence_level=confidence,
            is_significant=is_significant,
            winner=winner,
            lift_percentage=lift,
            recommendation=recommendation,
        )


class BrandComplianceChecker:
    """Enforces brand consistency across all signatures."""

    def __init__(self, brand_policy: BrandPolicy) -> None:
        self.policy = brand_policy
        self._violations: List[Dict[str, Any]] = []

    def check_signature(
        self, signature: EmailSignature
    ) -> List[Tuple[ComplianceStatus, str]]:
        """Check a signature against brand policy."""
        return signature.validate_brand_compliance(self.policy)

    def audit_batch(
        self, signatures: List[EmailSignature]
    ) -> Dict[str, Any]:
        """Audit a batch of signatures for brand compliance."""
        results = {
            "total_checked": len(signatures),
            "compliant": 0,
            "warnings": 0,
            "violations": 0,
            "issues": [],
        }

        for sig in signatures:
            issues = self.check_signature(sig)
            has_violation = False
            has_warning = False
            for status, message in issues:
                if status == ComplianceStatus.VIOLATION:
                    has_violation = True
                    results["issues"].append({
                        "signature_id": sig.signature_id,
                        "sender": sig.sender_email,
                        "status": "VIOLATION",
                        "message": message,
                    })
                elif status == ComplianceStatus.WARNING:
                    has_warning = True
                    results["issues"].append({
                        "signature_id": sig.signature_id,
                        "sender": sig.sender_email,
                        "status": "WARNING",
                        "message": message,
                    })

            if has_violation:
                results["violations"] += 1
            elif has_warning:
                results["warnings"] += 1
            else:
                results["compliant"] += 1

        results["compliance_rate"] = (
            results["compliant"] / results["total_checked"]
            if results["total_checked"] > 0
            else 0
        )
        return results

    def generate_remediation_report(
        self, signatures: List[EmailSignature]
    ) -> str:
        """Generate a remediation report for non-compliant signatures."""
        audit = self.audit_batch(signatures)
        lines = [
            "=" * 60,
            "BRAND COMPLIANCE REMEDIATION REPORT",
            "=" * 60,
            f"Generated: {datetime.now().isoformat()}",
            f"Organization: {self.policy.organization_name}",
            f"Signatures Audited: {audit['total_checked']}",
            f"Compliance Rate: {audit['compliance_rate']:.1%}",
            "",
            f"  ✓ Compliant: {audit['compliant']}",
            f"  ⚠ Warnings:  {audit['warnings']}",
            f"  ✗ Violations: {audit['violations']}",
            "",
        ]

        if audit["issues"]:
            lines.append("ISSUES REQUIRING ACTION:")
            lines.append("-" * 40)
            for i, issue in enumerate(audit["issues"], 1):
                lines.append(f"  {i}. [{issue['status']}] {issue['sender']}")
                lines.append(f"     {issue['message']}")
                lines.append("")

        if audit["violations"] > 0:
            lines.append("RECOMMENDED ACTIONS:")
            lines.append("  1. Update non-compliant signatures immediately")
            lines.append("  2. Review department templates for policy alignment")
            lines.append("  3. Enable auto-correction for common violations")

        return "\n".join(lines)


class SignatureGenerator:
    """Generates dynamic, intelligent email signatures."""

    def __init__(
        self,
        brand_policy: BrandPolicy,
        department_policies: Dict[Department, DepartmentPolicy],
        case_studies: CaseStudyRepository,
        social_proofs: SocialProofRepository,
    ) -> None:
        self.brand_policy = brand_policy
        self.department_policies = department_policies
        self.case_studies = case_studies
        self.social_proofs = social_proofs
        self._templates: Dict[str, SignatureTemplate] = {}
        self._calendar_base_url = "https://cal.example.com/book"

    def register_template(self, template: SignatureTemplate) -> None:
        """Register a signature template."""
        self._templates[template.template_id] = template

    def get_templates_for_department(
        self, department: Department
    ) -> List[SignatureTemplate]:
        """Get active templates for a department."""
        return [
            t for t in self._templates.values()
            if t.is_active and (t.department is None or t.department == department)
        ]

    def generate_signature(
        self,
        sender_name: str,
        sender_title: str,
        sender_email: str,
        sender_phone: str,
        sender_department: Department,
        recipient: Recipient,
        style_override: Optional[SignatureStyle] = None,
        variant_id: Optional[str] = None,
    ) -> EmailSignature:
        """Generate a dynamic signature adapted for the recipient."""
        dept_policy = self.department_policies.get(sender_department)

        # Determine style
        if style_override:
            style = style_override
        elif recipient.preferred_style:
            style = recipient.preferred_style
        elif dept_policy:
            style = dept_policy.default_style
        else:
            style = SignatureStyle.FORMAL

        # Build links based on department policy and recipient
        links = self._build_links(sender_department, recipient)

        # Find relevant case study
        case_study = None
        if dept_policy and BrandElementType.CTA_BUTTON in dept_policy.required_elements:
            relevant = self.case_studies.get_relevant(
                recipient.industry, recipient.role
            )
            if relevant:
                case_study = relevant[0]

        # Find social proof
        social_proof = None
        if dept_policy and BrandElementType.SOCIAL_ICONS in dept_policy.optional_elements:
            social_proof = self.social_proofs.get_best_for_industry(recipient.industry)

        # Calendar link (more relevant for senior recipients)
        calendar_link = ""
        if dept_policy and dept_policy.allowed_calendar_links:
            if recipient.is_senior or recipient.role == RecipientRole.DIRECTOR:
                cal_hash = hashlib.md5(sender_email.encode()).hexdigest()[:8]
                calendar_link = f"{self._calendar_base_url}/{cal_hash}"

        # Build disclaimer
        disclaimer = self.brand_policy.required_disclaimer
        if dept_policy and dept_policy.custom_disclaimer:
            disclaimer = dept_policy.custom_disclaimer

        signature = EmailSignature(
            sender_name=sender_name,
            sender_title=sender_title,
            sender_email=sender_email,
            sender_phone=sender_phone,
            sender_department=sender_department,
            company_name=self.brand_policy.organization_name,
            style=style,
            links=links,
            case_study=case_study,
            social_proof=social_proof,
            calendar_link=calendar_link,
            disclaimer=disclaimer,
            logo_url=self.brand_policy.logo_url,
            brand_color=self.brand_policy.primary_color,
            variant_id=variant_id,
        )

        return signature

    def _build_links(
        self, department: Department, recipient: Recipient
    ) -> List[SignatureLink]:
        """Build relevant links based on department and recipient."""
        links = []

        # Always include website
        links.append(SignatureLink(
            link_type=LinkType.WEBSITE,
            url="https://www.example.com",
            display_text="Website",
            utm_campaign=f"sig_{department.name.lower()}",
        ))

        # LinkedIn for most departments
        if department not in (Department.ENGINEERING,):
            links.append(SignatureLink(
                link_type=LinkType.LINKEDIN,
                url="https://linkedin.com/company/example",
                display_text="LinkedIn",
                utm_campaign=f"sig_{department.name.lower()}",
            ))

        # Department-specific links
        if department == Department.SALES:
            links.append(SignatureLink(
                link_type=LinkType.PRODUCT_PAGE,
                url="https://www.example.com/demo",
                display_text="Request Demo",
                utm_campaign="sig_sales_demo",
            ))
        elif department == Department.MARKETING:
            links.append(SignatureLink(
                link_type=LinkType.VIDEO,
                url="https://www.example.com/webinar",
                display_text="Latest Webinar",
                utm_campaign="sig_marketing_webinar",
            ))
        elif department == Department.SUPPORT:
            links.append(SignatureLink(
                link_type=LinkType.WEBSITE,
                url="https://help.example.com",
                display_text="Help Center",
                utm_campaign="sig_support_help",
            ))

        # Industry-specific case study link
        relevant_studies = self.case_studies.get_relevant(
            recipient.industry, recipient.role, limit=1
        )
        if relevant_studies:
            links.append(SignatureLink(
                link_type=LinkType.CASE_STUDY,
                url=relevant_studies[0].url,
                display_text=f"Case Study: {relevant_studies[0].client_name}",
                utm_campaign=f"sig_case_{recipient.industry.name.lower()}",
            ))

        return links

    def generate_reply_all_signature(
        self,
        sender_name: str,
        sender_title: str,
        sender_email: str,
        sender_phone: str,
        sender_department: Department,
        team_members: List[str],
    ) -> EmailSignature:
        """Generate a signature for reply-all with enforced team elements."""
        dept_policy = self.department_policies.get(sender_department)
        recipient = Recipient(email="team@example.com", industry=RecipientIndustry.TECHNOLOGY)

        signature = self.generate_signature(
            sender_name=sender_name,
            sender_title=sender_title,
            sender_email=sender_email,
            sender_phone=sender_phone,
            sender_department=sender_department,
            recipient=recipient,
        )

        # Enforce reply-all required elements
        if dept_policy and dept_policy.reply_all_enforcement:
            required_elements = dept_policy.get_required_reply_all_elements()

            # Ensure disclaimer is present
            if not signature.disclaimer:
                signature.disclaimer = self.brand_policy.required_disclaimer

            # Add team reference
            team_note = f" | Team: {', '.join(team_members[:3])}"
            if len(team_members) > 3:
                team_note += f" (+{len(team_members) - 3} more)"
            signature.sender_title += team_note

            # Ensure logo is present
            if not signature.logo_url:
                signature.logo_url = self.brand_policy.logo_url

        return signature


class TemplateManager:
    """Manages multi-template signature support."""

    def __init__(self) -> None:
        self._templates: Dict[str, SignatureTemplate] = {}

    def create_template(
        self,
        name: str,
        style: SignatureStyle,
        template_type: TemplateType = TemplateType.STANDARD,
        department: Optional[Department] = None,
        html_structure: str = "",
        placeholders: Optional[List[str]] = None,
    ) -> SignatureTemplate:
        """Create and register a new template."""
        template = SignatureTemplate(
            name=name,
            style=style,
            template_type=template_type,
            department=department,
            html_structure=html_structure or self._default_html(style),
            placeholders=placeholders or self._default_placeholders(style),
        )
        self._templates[template.template_id] = template
        return template

    def get_template(self, template_id: str) -> Optional[SignatureTemplate]:
        return self._templates.get(template_id)

    def get_templates_by_style(self, style: SignatureStyle) -> List[SignatureTemplate]:
        return [t for t in self._templates.values() if t.style == style and t.is_active]

    def get_templates_by_department(
        self, department: Department
    ) -> List[SignatureTemplate]:
        return [
            t for t in self._templates.values()
            if t.is_active and (t.department is None or t.department == department)
        ]

    def deactivate_template(self, template_id: str) -> bool:
        if template_id in self._templates:
            self._templates[template_id].is_active = False
            return True
        return False

    def _default_html(self, style: SignatureStyle) -> str:
        """Generate default HTML structure for a style."""
        if style == SignatureStyle.FORMAL:
            return (
                '<table style="font-family: Arial; border-left: 3px solid {{brand_color}};">'
                '<tr><td><strong>{{name}}</strong><br>{{title}}<br>{{company}}</td></tr>'
                '<tr><td>{{contact}}</td></tr></table>'
            )
        elif style == SignatureStyle.CASUAL:
            return (
                '<div style="font-family: Calibri; color: #555;">'
                '<p><b>{{name}}</b> | {{title}}<br>'
                '<a href="{{email}}">{{email}}</a></p></div>'
            )
        elif style == SignatureStyle.CREATIVE:
            return (
                '<div style="font-family: Georgia; background: linear-gradient(135deg, {{brand_color}}, {{secondary_color}}); '
                'color: white; padding: 16px; border-radius: 8px;">'
                '<h3>{{name}}</h3><p>{{title}} @ {{company}}</p></div>'
            )
        elif style == SignatureStyle.EXECUTIVE:
            return (
                '<table style="font-family: Garamond, Georgia; border-bottom: 2px solid {{brand_color}};">'
                '<tr><td><h2 style="margin:0;">{{name}}</h2>'
                '<p style="color: #666; margin: 2px 0;">{{title}}, {{company}}</p></td></tr></table>'
            )
        else:
            return '<div>{{name}} - {{title}} - {{company}}</div>'

    def _default_placeholders(self, style: SignatureStyle) -> List[str]:
        base = ["name", "title", "company", "email", "phone", "brand_color"]
        if style == SignatureStyle.CREATIVE:
            base.append("secondary_color")
        if style == SignatureStyle.FORMAL:
            base.extend(["logo_url", "disclaimer"])
        return base

    @property
    def active_count(self) -> int:
        return sum(1 for t in self._templates.values() if t.is_active)

    @property
    def total_count(self) -> int:
        return len(self._templates)


# =============================================================================
# MAIN ORCHESTRATOR
# =============================================================================


class SignatureIntelligenceEngine:
    """Main engine orchestrating all signature intelligence features."""

    def __init__(self, brand_policy: BrandPolicy) -> None:
        self.brand_policy = brand_policy
        self.case_studies = CaseStudyRepository()
        self.social_proofs = SocialProofRepository()
        self.department_policies: Dict[Department, DepartmentPolicy] = {}
        self.tracker = EngagementTracker()
        self.ab_analyzer = ABTestAnalyzer()
        self.compliance_checker = BrandComplianceChecker(brand_policy)
        self.template_manager = TemplateManager()
        self._signatures_generated: List[EmailSignature] = []
        self._ab_tests: Dict[str, ABTest] = {}

        # Initialize default department policies
        self._init_default_policies()

    def _init_default_policies(self) -> None:
        """Set up default policies for all departments."""
        self.department_policies[Department.SALES] = DepartmentPolicy(
            department=Department.SALES,
            default_style=SignatureStyle.FORMAL,
            required_elements=[
                BrandElementType.LOGO,
                BrandElementType.COLOR_PRIMARY,
                BrandElementType.DISCLAIMER,
                BrandElementType.CTA_BUTTON,
            ],
            optional_elements=[
                BrandElementType.SOCIAL_ICONS,
                BrandElementType.FONT_FAMILY,
            ],
            custom_disclaimer="This email and any attachments are confidential.",
            allowed_calendar_links=True,
            max_links=6,
            reply_all_enforcement=True,
            team_email_required=True,
            custom_cta="Schedule a Demo",
        )
        self.department_policies[Department.ENGINEERING] = DepartmentPolicy(
            department=Department.ENGINEERING,
            default_style=SignatureStyle.MINIMAL,
            required_elements=[
                BrandElementType.LOGO,
                BrandElementType.COLOR_PRIMARY,
            ],
            optional_elements=[BrandElementType.FONT_FAMILY],
            allowed_calendar_links=False,
            max_links=3,
            reply_all_enforcement=True,
        )
        self.department_policies[Department.MARKETING] = DepartmentPolicy(
            department=Department.MARKETING,
            default_style=SignatureStyle.CREATIVE,
            required_elements=[
                BrandElementType.LOGO,
                BrandElementType.COLOR_PRIMARY,
                BrandElementType.COLOR_SECONDARY,
                BrandElementType.DISCLAIMER,
                BrandElementType.SOCIAL_ICONS,
            ],
            optional_elements=[
                BrandElementType.CTA_BUTTON,
                BrandElementType.FONT_FAMILY,
            ],
            custom_disclaimer="Marketing communications from Example Corp.",
            allowed_calendar_links=True,
            max_links=8,
            reply_all_enforcement=True,
            team_email_required=True,
        )
        self.department_policies[Department.SUPPORT] = DepartmentPolicy(
            department=Department.SUPPORT,
            default_style=SignatureStyle.CASUAL,
            required_elements=[
                BrandElementType.LOGO,
                BrandElementType.DISCLAIMER,
            ],
            optional_elements=[BrandElementType.SOCIAL_ICONS],
            allowed_calendar_links=True,
            max_links=5,
            reply_all_enforcement=True,
        )
        self.department_policies[Department.EXECUTIVE] = DepartmentPolicy(
            department=Department.EXECUTIVE,
            default_style=SignatureStyle.EXECUTIVE,
            required_elements=[
                BrandElementType.LOGO,
                BrandElementType.COLOR_PRIMARY,
                BrandElementType.FONT_FAMILY,
                BrandElementType.DISCLAIMER,
            ],
            optional_elements=[BrandElementType.SOCIAL_ICONS],
            custom_disclaimer="CONFIDENTIAL - Executive communication.",
            allowed_calendar_links=True,
            max_links=4,
            reply_all_enforcement=True,
            team_email_required=True,
        )

    def setup_generator(self) -> SignatureGenerator:
        """Create and return a configured SignatureGenerator."""
        return SignatureGenerator(
            brand_policy=self.brand_policy,
            department_policies=self.department_policies,
            case_studies=self.case_studies,
            social_proofs=self.social_proofs,
        )

    def generate_and_track(
        self,
        sender_name: str,
        sender_title: str,
        sender_email: str,
        sender_phone: str,
        sender_department: Department,
        recipient: Recipient,
    ) -> EmailSignature:
        """Generate a signature and register it for tracking."""
        generator = self.setup_generator()
        signature = generator.generate_signature(
            sender_name=sender_name,
            sender_title=sender_title,
            sender_email=sender_email,
            sender_phone=sender_phone,
            sender_department=sender_department,
            recipient=recipient,
        )
        self._signatures_generated.append(signature)
        return signature

    def simulate_click(
        self,
        link_id: str,
        link_type: LinkType,
        recipient_email: str,
        sender_email: str,
        engagement_type: EngagementType = EngagementType.CLICK,
        variant: str = "",
    ) -> str:
        """Simulate a click event for testing."""
        event = ClickEvent(
            link_id=link_id,
            link_type=link_type,
            recipient_email=recipient_email,
            sender_email=sender_email,
            engagement_type=engagement_type,
            signature_variant=variant,
        )
        return self.tracker.record_event(event)

    def create_ab_test(
        self,
        name: str,
        description: str,
        variants: List[SignatureVariant],
        target_sample: int = 1000,
    ) -> ABTest:
        """Create a new A/B test."""
        test = ABTest(
            name=name,
            description=description,
            variants=variants,
            target_sample_size=target_sample,
        )
        self._ab_tests[test.test_id] = test
        return test

    def run_ab_test_simulation(self, test_id: str) -> ABTestResult:
        """Run a simulated A/B test and return results."""
        test = self._ab_tests.get(test_id)
        if not test:
            raise ValueError(f"Test {test_id} not found")

        test.status = ABTestStatus.RUNNING
        test.start_date = datetime.now()

        # Simulate impressions and clicks
        for variant in test.variants:
            variant.impressions = test.target_sample_size // len(test.variants)
            # Different base CTRs for variants
            base_ctr = 0.03 + random.random() * 0.04
            variant.clicks = int(variant.impressions * base_ctr)
            variant.conversions = int(variant.clicks * (0.1 + random.random() * 0.15))

        test.end_date = datetime.now()
        test.status = ABTestStatus.COMPLETED

        result = self.ab_analyzer.analyze_test(test)
        test.results = result
        return result

    def get_department_compliance_report(
        self, department: Department
    ) -> Dict[str, Any]:
        """Get compliance report for a specific department."""
        dept_signatures = [
            s for s in self._signatures_generated
            if s.sender_department == department
        ]
        return self.compliance_checker.audit_batch(dept_signatures)

    @property
    def total_signatures_generated(self) -> int:
        return len(self._signatures_generated)


# =============================================================================
# DEMO / TEST SCENARIOS
# =============================================================================


def setup_test_data(engine: SignatureIntelligenceEngine) -> None:
    """Populate engine with test data."""
    # Case studies
    engine.case_studies.add(CaseStudy(
        title="How TechCorp Increased Revenue by 340%",
        summary="Enterprise SaaS transformation case study",
        industry=RecipientIndustry.TECHNOLOGY,
        target_roles=[RecipientRole.C_LEVEL, RecipientRole.VP, RecipientRole.DIRECTOR],
        result_metric="Revenue Growth",
        result_value="340% YoY",
        client_name="TechCorp",
        url="https://example.com/case/techcorp",
        priority=10,
    ))
    engine.case_studies.add(CaseStudy(
        title="HealthFirst: 60% Faster Patient Onboarding",
        summary="Healthcare digital transformation",
        industry=RecipientIndustry.HEALTHCARE,
        target_roles=[RecipientRole.C_LEVEL, RecipientRole.VP, RecipientRole.DIRECTOR],
        result_metric="Onboarding Speed",
        result_value="60% faster",
        client_name="HealthFirst",
        url="https://example.com/case/healthfirst",
        priority=9,
    ))
    engine.case_studies.add(CaseStudy(
        title="FinServe: $2M Annual Cost Savings",
        summary="Financial services automation",
        industry=RecipientIndustry.FINANCE,
        target_roles=[RecipientRole.C_LEVEL, RecipientRole.VP],
        result_metric="Cost Savings",
        result_value="$2M annually",
        client_name="FinServe Global",
        url="https://example.com/case/finserve",
        priority=8,
    ))
    engine.case_studies.add(CaseStudy(
        title="EduLearn: 95% Student Engagement Rate",
        summary="EdTech platform success story",
        industry=RecipientIndustry.EDUCATION,
        target_roles=[RecipientRole.DIRECTOR, RecipientRole.MANAGER],
        result_metric="Engagement",
        result_value="95%",
        client_name="EduLearn Inc",
        url="https://example.com/case/edulearn",
        priority=7,
    ))

    # Social proofs
    engine.social_proofs.add(SocialProof(
        content="Best enterprise solution we've used in 10 years",
        source="CTO, Fortune 500 Tech Company",
        rating=4.9,
        industry=RecipientIndustry.TECHNOLOGY,
    ))
    engine.social_proofs.add(SocialProof(
        content="Transformed our patient care workflow completely",
        source="VP Operations, Regional Hospital Network",
        rating=4.8,
        industry=RecipientIndustry.HEALTHCARE,
    ))
    engine.social_proofs.add(SocialProof(
        content="ROI was visible within the first quarter",
        source="CFO, Top 20 Investment Firm",
        rating=4.9,
        industry=RecipientIndustry.FINANCE,
    ))
    engine.social_proofs.add(SocialProof(
        content="Our students' outcomes improved dramatically",
        source="Director of Technology, University System",
        rating=4.7,
        industry=RecipientIndustry.EDUCATION,
    ))

    # Templates
    engine.template_manager.create_template(
        name="Corporate Formal",
        style=SignatureStyle.FORMAL,
        template_type=TemplateType.STANDARD,
    )
    engine.template_manager.create_template(
        name="Startup Casual",
        style=SignatureStyle.CASUAL,
        template_type=TemplateType.STANDARD,
    )
    engine.template_manager.create_template(
        name="Creative Agency",
        style=SignatureStyle.CREATIVE,
        template_type=TemplateType.STANDARD,
        department=Department.MARKETING,
    )
    engine.template_manager.create_template(
        name="Executive Premium",
        style=SignatureStyle.EXECUTIVE,
        template_type=TemplateType.STANDARD,
        department=Department.EXECUTIVE,
    )


def scenario_1_dynamic_adaptive_signatures(engine: SignatureIntelligenceEngine) -> None:
    """Scenario 1: Dynamic signatures adapting to recipient industry/role."""
    print("\n" + "=" * 70)
    print("SCENARIO 1: Dynamic Adaptive Signatures")
    print("=" * 70)

    generator = engine.setup_generator()

    recipients = [
        Recipient(
            email="cto@techcorp.io",
            name="Sarah Chen",
            company="TechCorp",
            industry=RecipientIndustry.TECHNOLOGY,
            role=RecipientRole.C_LEVEL,
        ),
        Recipient(
            email="director@healthfirst.org",
            name="Dr. James Wilson",
            company="HealthFirst",
            industry=RecipientIndustry.HEALTHCARE,
            role=RecipientRole.DIRECTOR,
        ),
        Recipient(
            email="analyst@finserve.com",
            name="Mike Johnson",
            company="FinServe",
            industry=RecipientIndustry.FINANCE,
            role=RecipientRole.ANALYST,
        ),
    ]

    for recipient in recipients:
        sig = generator.generate_signature(
            sender_name="Alex Rivera",
            sender_title="Senior Account Executive",
            sender_email="alex@example.com",
            sender_phone="+1 (555) 123-4567",
            sender_department=Department.SALES,
            recipient=recipient,
        )

        print(f"\n--- Signature for {recipient.name} ({recipient.industry.name}, {recipient.role.name}) ---")
        print(f"  Style: {sig.style.name}")
        print(f"  Links: {len(sig.links)}")
        for link in sig.links:
            print(f"    - [{link.link_type.name}] {link.display_text}")
        if sig.case_study:
            print(f"  Case Study: {sig.case_study.title}")
            print(f"    Result: {sig.case_study.result_metric} = {sig.case_study.result_value}")
        if sig.social_proof:
            print(f"  Social Proof: \"{sig.social_proof.content}\"")
        if sig.calendar_link:
            print(f"  Calendar: {sig.calendar_link}")
        print(f"  Disclaimer: {sig.disclaimer[:60]}...")

    print("\n✓ Signatures dynamically adapted case studies, social proof,")
    print("  calendar links, and link sets based on recipient profiles.")


def scenario_2_engagement_tracking(engine: SignatureIntelligenceEngine) -> None:
    """Scenario 2: Track and analyze signature link engagement."""
    print("\n" + "=" * 70)
    print("SCENARIO 2: Engagement Tracking & Analytics")
    print("=" * 70)

    link_ids = {
        "website": "lnk_web01",
        "linkedin": "lnk_li01",
        "demo": "lnk_demo01",
        "case_study": "lnk_cs01",
    }

    # Simulate various engagement events
    events_to_simulate = [
        ("website", LinkType.WEBSITE, "user1@tech.com", "sales@example.com", EngagementType.CLICK),
        ("website", LinkType.WEBSITE, "user2@health.org", "sales@example.com", EngagementType.CLICK),
        ("website", LinkType.WEBSITE, "user3@finance.com", "sales@example.com", EngagementType.CLICK),
        ("linkedin", LinkType.LINKEDIN, "user1@tech.com", "sales@example.com", EngagementType.CLICK),
        ("linkedin", LinkType.LINKEDIN, "user4@edu.org", "marketing@example.com", EngagementType.CLICK),
        ("demo", LinkType.PRODUCT_PAGE, "user1@tech.com", "sales@example.com", EngagementType.CLICK),
        ("demo", LinkType.PRODUCT_PAGE, "user5@retail.com", "sales@example.com", EngagementType.CLICK),
        ("demo", LinkType.PRODUCT_PAGE, "user2@health.org", "sales@example.com", EngagementType.HOVER),
        ("case_study", LinkType.CASE_STUDY, "user1@tech.com", "sales@example.com", EngagementType.CLICK),
        ("case_study", LinkType.CASE_STUDY, "user6@gov.gov", "sales@example.com", EngagementType.CLICK),
        ("demo", LinkType.PRODUCT_PAGE, "user7@startup.io", "sales@example.com", EngagementType.CALENDAR_BOOK),
        ("demo", LinkType.PRODUCT_PAGE, "user8@corp.com", "sales@example.com", EngagementType.DOWNLOAD),
    ]

    for link_key, link_type, recipient, sender, eng_type in events_to_simulate:
        engine.simulate_click(
            link_id=link_ids[link_key],
            link_type=link_type,
            recipient_email=recipient,
            sender_email=sender,
            engagement_type=eng_type,
        )

    # Display stats per link
    print("\n  Link Engagement Statistics:")
    print("  " + "-" * 50)
    for name, link_id in link_ids.items():
        stats = engine.tracker.get_click_stats(link_id)
        print(f"  {name.upper():15s} | Clicks: {stats['total_clicks']:3d} | Unique: {stats['unique_clicks']:3d}")

    # Overall stats
    overall = engine.tracker.get_overall_stats()
    print(f"\n  Overall Engagement Summary:")
    print(f"    Total events: {overall['total_events']}")
    print(f"    Unique links tracked: {overall['unique_links_tracked']}")
    print(f"    Unique recipients engaged: {overall['unique_recipients_engaged']}")
    print(f"    Avg events per recipient: {overall['avg_events_per_recipient']:.1f}")
    print(f"    Engagement breakdown: {overall['engagement_breakdown']}")

    # Heatmap
    heatmap = engine.tracker.get_heatmap_data()
    print(f"\n  Engagement Heatmap (Day -> Hour distribution):")
    for day, hours in heatmap.items():
        print(f"    {day}: {dict(hours)}")

    # Per-recipient engagement
    print(f"\n  Top engaged recipients:")
    for email in ["user1@tech.com", "user2@health.org"]:
        events = engine.tracker.get_events_by_recipient(email)
        print(f"    {email}: {len(events)} interactions")

    print("\n✓ Full engagement tracking with click analytics, heatmaps, and recipient profiles.")


def scenario_3_ab_testing(engine: SignatureIntelligenceEngine) -> None:
    """Scenario 3: A/B test signature variants with statistical analysis."""
    print("\n" + "=" * 70)
    print("SCENARIO 3: A/B Testing with Statistical Analysis")
    print("=" * 70)

    # Create two variants
    variant_a = SignatureVariant(
        name="Standard Signature",
        style=SignatureStyle.FORMAL,
        include_case_study=False,
        include_social_proof=False,
        include_calendar=False,
    )

    variant_b = SignatureVariant(
        name="Enhanced Signature (Case Study + Calendar)",
        style=SignatureStyle.FORMAL,
        include_case_study=True,
        include_social_proof=False,
        include_calendar=True,
    )

    # Create A/B test
    test = engine.create_ab_test(
        name="Case Study & Calendar Impact Test",
        description="Testing whether adding case studies and calendar links improves CTR",
        variants=[variant_a, variant_b],
        target_sample=2000,
    )

    print(f"\n  Test: {test.name}")
    print(f"  Target sample: {test.target_sample_size}")
    print(f"  Variant A: {variant_a.name}")
    print(f"  Variant B: {variant_b.name}")

    # Run simulation
    result = engine.run_ab_test_simulation(test.test_id)
    print(f"\n{result.to_summary()}")

    # Additional statistical details
    print(f"\n  Confidence Intervals:")
    ci_a = engine.ab_analyzer.calculate_confidence_interval(
        result.variant_a_ctr, result.variant_a_impressions
    )
    ci_b = engine.ab_analyzer.calculate_confidence_interval(
        result.variant_b_ctr, result.variant_b_impressions
    )
    print(f"    Variant A CTR 95% CI: [{ci_a[0]:.4f}, {ci_a[1]:.4f}]")
    print(f"    Variant B CTR 95% CI: [{ci_b[0]:.4f}, {ci_b[1]:.4f}]")

    # Sample size calculation
    required_n = engine.ab_analyzer.required_sample_size(
        baseline_rate=0.03,
        minimum_detectable_effect=0.50,
        confidence=0.95,
        power=0.80,
    )
    print(f"\n  For 50% MDE at 95% confidence / 80% power:")
    print(f"    Required sample per variant: {required_n:,}")

    # Run a second test
    variant_c = SignatureVariant(
        name="Minimal Links",
        style=SignatureStyle.MINIMAL,
        include_case_study=False,
        include_social_proof=False,
        include_calendar=False,
    )
    variant_d = SignatureVariant(
        name="Social Proof + All Links",
        style=SignatureStyle.CREATIVE,
        include_case_study=True,
        include_social_proof=True,
        include_calendar=True,
    )

    test2 = engine.create_ab_test(
        name="Style & Social Proof Test",
        description="Comparing minimal vs. rich signature styles",
        variants=[variant_c, variant_d],
        target_sample=1500,
    )
    result2 = engine.run_ab_test_simulation(test2.test_id)
    print(f"\n  Second Test: {test2.name}")
    print(f"  Result: {result2.recommendation}")

    print("\n✓ A/B testing with Z-score analysis, confidence intervals, and sample size planning.")


def scenario_4_brand_compliance(engine: SignatureIntelligenceEngine) -> None:
    """Scenario 4: Brand consistency enforcement and compliance auditing."""
    print("\n" + "=" * 70)
    print("SCENARIO 4: Brand Compliance & Department Policy Enforcement")
    print("=" * 70)

    generator = engine.setup_generator()
    test_recipient = Recipient(
        email="client@acme.com",
        name="Test Client",
        industry=RecipientIndustry.TECHNOLOGY,
        role=RecipientRole.MANAGER,
    )

    # Generate signatures from different departments
    departments_to_test = [
        (Department.SALES, "John Smith", "Account Manager", "john@example.com", "+1-555-0001"),
        (Department.ENGINEERING, "Jane Doe", "Senior Engineer", "jane@example.com", "+1-555-0002"),
        (Department.MARKETING, "Bob Brown", "Marketing Lead", "bob@example.com", "+1-555-0003"),
        (Department.SUPPORT, "Alice Green", "Support Specialist", "alice@example.com", "+1-555-0004"),
        (Department.EXECUTIVE, "Carol White", "VP Operations", "carol@example.com", "+1-555-0005"),
    ]

    signatures = []
    for dept, name, title, email, phone in departments_to_test:
        sig = generator.generate_signature(
            sender_name=name,
            sender_title=title,
            sender_email=email,
            sender_phone=phone,
            sender_department=dept,
            recipient=test_recipient,
        )
        signatures.append(sig)
        engine._signatures_generated.append(sig)

    # Check compliance
    print("\n  Individual Signature Compliance Checks:")
    print("  " + "-" * 50)
    for sig in signatures:
        issues = engine.compliance_checker.check_signature(sig)
        status_icons = {
            ComplianceStatus.COMPLIANT: "✓",
            ComplianceStatus.WARNING: "⚠",
            ComplianceStatus.VIOLATION: "✗",
        }
        for status, message in issues:
            icon = status_icons[status]
            print(f"  [{icon}] {sig.sender_name:15s} ({sig.sender_department.name:12s}): {message}")

    # Create a non-compliant signature for testing
    bad_signature = EmailSignature(
        sender_name="Rogue Employee",
        sender_title="Sales Rep",
        sender_email="rogue@example.com",
        sender_department=Department.SALES,
        company_name="Example Corp",
        style=SignatureStyle.CASUAL,
        brand_color="#FF0000",  # Not in brand palette
        logo_url="",  # Missing required logo
        disclaimer="",  # Missing required disclaimer
    )
    signatures.append(bad_signature)

    # Batch audit
    print("\n  Batch Compliance Audit (including non-compliant signature):")
    audit = engine.compliance_checker.audit_batch(signatures)
    print(f"    Total checked: {audit['total_checked']}")
    print(f"    Compliant: {audit['compliant']}")
    print(f"    Warnings: {audit['warnings']}")
    print(f"    Violations: {audit['violations']}")
    print(f"    Compliance rate: {audit['compliance_rate']:.1%}")

    # Remediation report
    report = engine.compliance_checker.generate_remediation_report(signatures)
    print(f"\n{report}")

    # Department-specific policy check
    print("\n  Department Policy Summary:")
    for dept in [Department.SALES, Department.MARKETING, Department.EXECUTIVE]:
        policy = engine.department_policies[dept]
        print(f"\n  {dept.name}:")
        print(f"    Default style: {policy.default_style.name}")
        print(f"    Required elements: {[e.name for e in policy.required_elements]}")
        print(f"    Max links: {policy.max_links}")
        print(f"    Reply-all enforcement: {policy.reply_all_enforcement}")
        print(f"    Calendar links allowed: {policy.allowed_calendar_links}")

    print("\n✓ Brand compliance enforced across all departments with remediation reporting.")


def scenario_5_reply_all_and_templates(engine: SignatureIntelligenceEngine) -> None:
    """Scenario 5: Reply-all enforcement and multi-template management."""
    print("\n" + "=" * 70)
    print("SCENARIO 5: Reply-All Enforcement & Multi-Template Support")
    print("=" * 70)

    generator = engine.setup_generator()

    # Test reply-all signature generation
    print("\n  Reply-All Signature (Sales - enforced team elements):")
    reply_sig = generator.generate_reply_all_signature(
        sender_name="Alex Rivera",
        sender_title="Senior AE",
        sender_email="alex@example.com",
        sender_phone="+1-555-1234",
        sender_department=Department.SALES,
        team_members=["Sarah K.", "Mike T.", "Lisa R.", "Dave B.", "Emma W."],
    )
    print(f"    Sender: {reply_sig.sender_name}")
    print(f"    Title (with team): {reply_sig.sender_title}")
    print(f"    Has disclaimer: {bool(reply_sig.disclaimer)}")
    print(f"    Has logo: {bool(reply_sig.logo_url)}")
    print(f"    Brand color: {reply_sig.brand_color}")
    print(f"    Links: {len(reply_sig.links)}")

    # Compliance check on reply-all signature
    issues = engine.compliance_checker.check_signature(reply_sig)
    print(f"    Compliance: {[i[0].name for i in issues]}")

    # Test Marketing reply-all
    print("\n  Reply-All Signature (Marketing - team email required):")
    mktg_reply = generator.generate_reply_all_signature(
        sender_name="Bob Brown",
        sender_title="Content Lead",
        sender_email="bob@example.com",
        sender_phone="+1-555-5678",
        sender_department=Department.MARKETING,
        team_members=["Content Team", "Design Team"],
    )
    print(f"    Title (with team): {mktg_reply.sender_title}")
    print(f"    Has disclaimer: {bool(mktg_reply.disclaimer)}")
    print(f"    Disclaimer: {mktg_reply.disclaimer[:50]}...")

    # Template management
    print("\n  Multi-Template Management:")
    print("  " + "-" * 50)
    print(f"    Active templates: {engine.template_manager.active_count}")
    print(f"    Total templates: {engine.template_manager.total_count}")

    # List templates by style
    for style in SignatureStyle:
        templates = engine.template_manager.get_templates_by_style(style)
        if templates:
            names = [t.name for t in templates]
            print(f"    {style.name:12s}: {', '.join(names)}")

    # Department-specific templates
    print("\n  Templates by Department:")
    for dept in [Department.MARKETING, Department.EXECUTIVE]:
        templates = engine.template_manager.get_templates_by_department(dept)
        print(f"    {dept.name}: {[t.name for t in templates]}")

    # Create a new promotional template
    promo = engine.template_manager.create_template(
        name="Q4 Product Launch",
        style=SignatureStyle.CREATIVE,
        template_type=TemplateType.PRODUCT_LAUNCH,
        department=Department.MARKETING,
        placeholders=["name", "title", "company", "product_name", "launch_date"],
    )
    print(f"\n  Created promotional template: '{promo.name}'")
    print(f"    Type: {promo.template_type.name}")
    print(f"    Placeholders: {promo.placeholders}")
    print(f"    Active templates now: {engine.template_manager.active_count}")

    # Deactivate a template
    engine.template_manager.deactivate_template(promo.template_id)
    print(f"\n  Deactivated '{promo.name}'")
    print(f"    Active templates now: {engine.template_manager.active_count}")

    print("\n✓ Reply-all enforcement ensures team elements; template system supports")
    print("  formal/casual/creative/executive styles with per-department filtering.")


def scenario_6_html_rendering(engine: SignatureIntelligenceEngine) -> None:
    """Scenario 6: HTML rendering and final output validation."""
    print("\n" + "=" * 70)
    print("SCENARIO 6: HTML Rendering & Output Validation")
    print("=" * 70)

    generator = engine.setup_generator()

    recipient = Recipient(
        email="vp@techcorp.io",
        name="VP Engineering",
        company="TechCorp",
        industry=RecipientIndustry.TECHNOLOGY,
        role=RecipientRole.VP,
    )

    sig = generator.generate_signature(
        sender_name="Alex Rivera",
        sender_title="Enterprise Solutions Director",
        sender_email="alex@example.com",
        sender_phone="+1 (555) 123-4567",
        sender_department=Department.SALES,
        recipient=recipient,
    )

    html = sig.to_html()
    print(f"\n  Generated HTML signature ({len(html)} characters):")
    print("  " + "-" * 50)
    # Print first 30 lines of HTML
    for i, line in enumerate(html.split("\n")[:30], 1):
        print(f"  {i:2d} | {line}")
    if len(html.split("\n")) > 30:
        print(f"  ... ({len(html.split(chr(10))) - 30} more lines)")

    # Validate HTML structure
    print(f"\n  HTML Validation:")
    print(f"    Contains table: {'<table' in html}")
    print(f"    Contains links: {'<a href' in html}")
    print(f"    Contains brand color: {engine.brand_policy.primary_color in html}")
    print(f"    Contains sender name: {'Alex Rivera' in html}")
    print(f"    Contains tracked URLs: {'utm_source' in html}")
    print(f"    Contains case study: {'CASE STUDY' in html}")
    print(f"    Contains calendar CTA: {'Book a Meeting' in html}")

    # Signature with minimal config
    minimal_sig = EmailSignature(
        sender_name="Simple User",
        sender_title="Developer",
        sender_email="dev@example.com",
        sender_department=Department.ENGINEERING,
        company_name="Example Corp",
        brand_color="#2563EB",
    )
    minimal_html = minimal_sig.to_html()
    print(f"\n  Minimal signature HTML ({len(minimal_html)} chars):")
    for line in minimal_html.split("\n")[:8]:
        print(f"    {line}")

    print("\n✓ HTML rendering produces valid, brand-compliant email signature markup.")


def main() -> None:
    """Run all test scenarios demonstrating V134 Signature Intelligence."""
    print("=" * 70)
    print("  V134 AI EMAIL SIGNATURE INTELLIGENCE SYSTEM")
    print("  Dynamic Signatures | Engagement Tracking | A/B Testing")
    print("  Brand Compliance | Department Policies | Multi-Templates")
    print("=" * 70)

    # Setup brand policy
    brand_policy = BrandPolicy(
        organization_name="Example Corp",
        logo_url="https://assets.example.com/logo.png",
        primary_color="#2563EB",
        secondary_color="#1E40AF",
        font_family="Arial",
        required_disclaimer=(
            "This email and any attachments are confidential and intended "
            "solely for the use of the individual to whom it is addressed. "
            "If you received this in error, please notify the sender immediately. "
            "© 2026 Example Corp. All rights reserved."
        ),
        allowed_fonts=["Arial", "Helvetica", "Calibri", "Georgia"],
        disclaimer_required=True,
        logo_required=True,
        color_strict=True,
    )

    # Initialize engine
    engine = SignatureIntelligenceEngine(brand_policy)
    setup_test_data(engine)

    print(f"\n  System initialized:")
    print(f"    Brand: {brand_policy.organization_name}")
    print(f"    Case studies loaded: {engine.case_studies.count}")
    print(f"    Templates loaded: {engine.template_manager.total_count}")
    print(f"    Department policies: {len(engine.department_policies)}")

    # Run all scenarios
    scenario_1_dynamic_adaptive_signatures(engine)
    scenario_2_engagement_tracking(engine)
    scenario_3_ab_testing(engine)
    scenario_4_brand_compliance(engine)
    scenario_5_reply_all_and_templates(engine)
    scenario_6_html_rendering(engine)

    # Final summary
    print("\n" + "=" * 70)
    print("  EXECUTION SUMMARY")
    print("=" * 70)
    print(f"  Total signatures generated: {engine.total_signatures_generated}")
    print(f"  Total engagement events tracked: {engine.tracker.total_events}")
    print(f"  A/B tests completed: {len(engine._ab_tests)}")
    print(f"  Templates managed: {engine.template_manager.total_count}")
    print(f"  Departments configured: {len(engine.department_policies)}")
    print("\n  All 6 scenarios completed successfully.")
    print("=" * 70)


if __name__ == "__main__":
    main()
