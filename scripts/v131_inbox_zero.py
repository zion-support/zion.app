#!/usr/bin/env python3
"""
V131 AI Smart Unsubscribe & Inbox Zero Engine
==============================================
Production-quality inbox management system featuring:
  - Intelligent unsubscribe recommendations (engagement/frequency/value scoring)
  - Inbox decluttering engine (auto-categorize promotions/social/updates/primary)
  - Newsletter digest compilation (aggregate into single daily digest)
  - Automated archive rules (age-based, category-based, read-status)
  - Inbox zero coaching (daily tips & progress tracking)
  - Sender reputation scoring
  - Reply-all enforcement for actionable emails

Author: Hermes Agent
Version: 1.3.1
"""

from __future__ import annotations

import hashlib
import math
import statistics
from collections import defaultdict
from dataclasses import dataclass, field
from datetime import datetime, timedelta
from enum import Enum, auto
from typing import Any, Dict, List, Optional, Set, Tuple


# ---------------------------------------------------------------------------
# Enums
# ---------------------------------------------------------------------------

class EmailCategory(Enum):
    """Classification categories for incoming email."""
    PRIMARY = auto()
    PROMOTIONS = auto()
    SOCIAL = auto()
    UPDATES = auto()
    FORUMS = auto()
    SPAM = auto()


class EmailPriority(Enum):
    """Priority level assigned to email."""
    CRITICAL = auto()
    HIGH = auto()
    NORMAL = auto()
    LOW = auto()
    NEGLIGIBLE = auto()


class UnsubscribeScore(Enum):
    """Recommendation strength for unsubscribing."""
    STRONG_UNSUBSCRIBE = auto()
    RECOMMENDED_UNSUBSCRIBE = auto()
    NEUTRAL = auto()
    KEEP = auto()
    STRONG_KEEP = auto()


class ActionType(Enum):
    """Automated action types for email management."""
    ARCHIVE = auto()
    DELETE = auto()
    STAR = auto()
    LABEL = auto()
    REPLY_ALL_REMINDER = auto()
    DIGEST = auto()
    DO_NOTHING = auto()


class ArchiveRuleType(Enum):
    """Types of automated archive rules."""
    AGE_BASED = auto()
    CATEGORY_BASED = auto()
    READ_STATUS = auto()
    SENDER_BASED = auto()
    KEYWORD_BASED = auto()
    COMPOSITE = auto()


class CoachingTipCategory(Enum):
    """Categories for inbox zero coaching tips."""
    PRODUCTIVITY = auto()
    ORGANIZATION = auto()
    FOCUS = auto()
    WORKFLOW = auto()
    MINDSET = auto()


# ---------------------------------------------------------------------------
# Dataclasses
# ---------------------------------------------------------------------------

@dataclass
class SenderProfile:
    """Profile information for an email sender."""
    email: str
    display_name: str
    domain: str
    first_seen: datetime
    last_seen: datetime
    total_sent: int = 0
    total_opened: int = 0
    total_clicked: int = 0
    total_replied: int = 0
    total_marked_spam: int = 0
    unsubscribe_url: Optional[str] = None
    is_newsletter: bool = False
    is_verified: bool = False
    reputation_score: float = 50.0

    @property
    def open_rate(self) -> float:
        if self.total_sent == 0:
            return 0.0
        return self.total_opened / self.total_sent

    @property
    def click_rate(self) -> float:
        if self.total_sent == 0:
            return 0.0
        return self.total_clicked / self.total_sent

    @property
    def reply_rate(self) -> float:
        if self.total_sent == 0:
            return 0.0
        return self.total_replied / self.total_sent

    @property
    def frequency_per_week(self) -> float:
        days = (self.last_seen - self.first_seen).days
        if days == 0:
            return float(self.total_sent)
        weeks = max(days / 7.0, 1.0)
        return self.total_sent / weeks


@dataclass
class EmailMessage:
    """Represents a single email message."""
    message_id: str
    sender_email: str
    sender_name: str
    subject: str
    body_preview: str
    received_at: datetime
    category: EmailCategory = EmailCategory.PRIMARY
    priority: EmailPriority = EmailPriority.NORMAL
    is_read: bool = False
    is_starred: bool = False
    is_archived: bool = False
    is_deleted: bool = False
    has_attachments: bool = False
    labels: List[str] = field(default_factory=list)
    recipients: List[str] = field(default_factory=list)
    cc_recipients: List[str] = field(default_factory=list)
    reply_to: Optional[str] = None
    thread_id: Optional[str] = None
    action_required: bool = False
    action_deadline: Optional[datetime] = None
    unsubscribe_url: Optional[str] = None
    list_unsubscribe_header: Optional[str] = None

    @property
    def age_days(self) -> int:
        return (datetime.now() - self.received_at).days

    @property
    def is_newsletter(self) -> bool:
        newsletter_indicators = [
            "unsubscribe", "newsletter", "digest", "weekly",
            "monthly", "update from", "edition", "issue #"
        ]
        text = f"{self.subject} {self.body_preview}".lower()
        return any(ind in text for ind in newsletter_indicators)


@dataclass
class UnsubscribeRecommendation:
    """Recommendation for unsubscribing from a sender."""
    sender_email: str
    sender_name: str
    score: UnsubscribeScore
    numerical_score: float
    reasons: List[str]
    unsubscribe_url: Optional[str] = None
    estimated_time_saved_per_week: float = 0.0
    engagement_score: float = 0.0
    frequency_score: float = 0.0
    value_score: float = 0.0


@dataclass
class DigestEntry:
    """A single entry in a newsletter digest."""
    sender_name: str
    sender_email: str
    subject: str
    body_summary: str
    key_points: List[str]
    received_at: datetime
    original_message_id: str


@dataclass
class DailyDigest:
    """Compiled daily digest from multiple newsletters."""
    date: datetime
    entries: List[DigestEntry]
    total_newsletters: int
    estimated_read_time_minutes: float
    category: str = "Daily Digest"
    highlights: List[str] = field(default_factory=list)

    @property
    def summary(self) -> str:
        return (
            f"📬 Daily Digest — {self.date.strftime('%Y-%m-%d')}\n"
            f"   {self.total_newsletters} newsletters | "
            f"~{self.estimated_read_time_minutes:.0f} min read\n"
        )


@dataclass
class ArchiveRule:
    """An automated archiving rule."""
    rule_id: str
    name: str
    rule_type: ArchiveRuleType
    enabled: bool = True
    conditions: Dict[str, Any] = field(default_factory=dict)
    action: ActionType = ActionType.ARCHIVE
    priority: int = 0
    last_triggered: Optional[datetime] = None
    trigger_count: int = 0


@dataclass
class CoachingTip:
    """A coaching tip for inbox zero progress."""
    tip_id: str
    category: CoachingTipCategory
    title: str
    description: str
    impact_score: float
    applicable: bool = True


@dataclass
class InboxZeroProgress:
    """Tracking data for inbox zero progress."""
    date: datetime
    total_emails: int
    unread_count: int
    archived_today: int
    deleted_today: int
    replied_today: int
    unsubscribed_today: int
    categorized_today: int
    inbox_count: int
    goal_inbox_count: int = 0
    streak_days: int = 0

    @property
    def progress_percentage(self) -> float:
        if self.total_emails == 0:
            return 100.0
        processed = self.archived_today + self.deleted_today + self.categorized_today
        return min((processed / self.total_emails) * 100, 100.0)

    @property
    def achieved_inbox_zero(self) -> bool:
        return self.inbox_count <= self.goal_inbox_count


@dataclass
class SenderReputation:
    """Computed reputation score for a sender."""
    sender_email: str
    domain: str
    overall_score: float
    trust_score: float
    engagement_score: float
    frequency_score: float
    content_quality_score: float
    spam_signals: List[str] = field(default_factory=list)
    positive_signals: List[str] = field(default_factory=list)
    risk_level: str = "low"


# ---------------------------------------------------------------------------
# Core Engine Classes
# ---------------------------------------------------------------------------

class UnsubscribeRecommender:
    """
    Intelligent unsubscribe recommendation engine.
    Scores senders based on engagement, frequency, and perceived value.
    """

    ENGAGEMENT_WEIGHT = 0.40
    FREQUENCY_WEIGHT = 0.30
    VALUE_WEIGHT = 0.30

    HIGH_FREQUENCY_THRESHOLD = 5.0  # emails per week
    LOW_ENGAGEMENT_THRESHOLD = 0.10  # 10% open rate

    def __init__(self) -> None:
        self._profiles: Dict[str, SenderProfile] = {}
        self._recommendations: List[UnsubscribeRecommendation] = []

    def add_sender_profile(self, profile: SenderProfile) -> None:
        """Register or update a sender profile for analysis."""
        self._profiles[profile.email] = profile

    def calculate_engagement_score(self, profile: SenderProfile) -> float:
        """
        Score engagement from 0-100. Higher = more engaged.
        Factors: open rate, click rate, reply rate, spam marks.
        """
        open_component = profile.open_rate * 60
        click_component = profile.click_rate * 25
        reply_component = profile.reply_rate * 15
        spam_penalty = profile.total_marked_spam * 20

        raw = open_component + click_component + reply_component - spam_penalty
        return max(0.0, min(100.0, raw))

    def calculate_frequency_score(self, profile: SenderProfile) -> float:
        """
        Score frequency burden from 0-100. Higher = too frequent (bad).
        Penalizes senders who overwhelm the inbox.
        """
        freq = profile.frequency_per_week
        if freq <= 1.0:
            return 10.0
        elif freq <= 3.0:
            return 30.0 + (freq - 1.0) * 10
        elif freq <= 7.0:
            return 50.0 + (freq - 3.0) * 7.5
        elif freq <= 14.0:
            return 80.0 + (freq - 7.0) * 2.86
        else:
            return min(100.0, 100.0)

    def calculate_value_score(self, profile: SenderProfile) -> float:
        """
        Score perceived value from 0-100. Higher = more valuable.
        Based on engagement patterns, domain trust, and reply behavior.
        """
        score = 50.0

        # High engagement indicates value
        if profile.open_rate > 0.5:
            score += 20
        elif profile.open_rate > 0.3:
            score += 10
        elif profile.open_rate < 0.05:
            score -= 25

        # Replies indicate two-way value
        if profile.reply_rate > 0.1:
            score += 20
        elif profile.total_replied > 0:
            score += 10

        # Verified senders get bonus
        if profile.is_verified:
            score += 10

        # Spam marks destroy value
        if profile.total_marked_spam > 0:
            score -= profile.total_marked_spam * 15

        return max(0.0, min(100.0, score))

    def generate_recommendation(self, profile: SenderProfile) -> UnsubscribeRecommendation:
        """Generate an unsubscribe recommendation for a single sender."""
        engagement = self.calculate_engagement_score(profile)
        frequency = self.calculate_frequency_score(profile)
        value = self.calculate_value_score(profile)

        # Composite score: high = keep, low = unsubscribe
        composite = (
            engagement * self.ENGAGEMENT_WEIGHT +
            (100 - frequency) * self.FREQUENCY_WEIGHT +
            value * self.VALUE_WEIGHT
        )

        reasons: List[str] = []
        if profile.open_rate < self.LOW_ENGAGEMENT_THRESHOLD:
            reasons.append(f"Very low open rate ({profile.open_rate:.1%})")
        if profile.frequency_per_week > self.HIGH_FREQUENCY_THRESHOLD:
            reasons.append(
                f"High frequency ({profile.frequency_per_week:.1f} emails/week)"
            )
        if profile.total_marked_spam > 0:
            reasons.append(f"Marked as spam {profile.total_marked_spam} times")
        if profile.reply_rate == 0 and profile.total_sent > 20:
            reasons.append("Never replied or engaged meaningfully")
        if profile.open_rate == 0 and profile.total_sent > 10:
            reasons.append("Never opened any emails")
        if not reasons and composite > 60:
            reasons.append("Good engagement — keep subscribed")

        if composite >= 75:
            score_enum = UnsubscribeScore.STRONG_KEEP
        elif composite >= 55:
            score_enum = UnsubscribeScore.KEEP
        elif composite >= 40:
            score_enum = UnsubscribeScore.NEUTRAL
        elif composite >= 25:
            score_enum = UnsubscribeScore.RECOMMENDED_UNSUBSCRIBE
        else:
            score_enum = UnsubscribeScore.STRONG_UNSUBSCRIBE

        time_saved = max(0, profile.frequency_per_week * 0.5)

        rec = UnsubscribeRecommendation(
            sender_email=profile.email,
            sender_name=profile.display_name,
            score=score_enum,
            numerical_score=round(composite, 2),
            reasons=reasons,
            unsubscribe_url=profile.unsubscribe_url,
            estimated_time_saved_per_week=round(time_saved, 2),
            engagement_score=round(engagement, 2),
            frequency_score=round(frequency, 2),
            value_score=round(value, 2),
        )

        self._recommendations.append(rec)
        return rec

    def analyze_all(self) -> List[UnsubscribeRecommendation]:
        """Analyze all registered sender profiles and return ranked recommendations."""
        self._recommendations.clear()
        results = []
        for profile in self._profiles.values():
            rec = self.generate_recommendation(profile)
            results.append(rec)

        # Sort: lowest composite first (best unsubscribe candidates)
        results.sort(key=lambda r: r.numerical_score)
        return results

    def get_top_unsubscribe_candidates(self, limit: int = 10) -> List[UnsubscribeRecommendation]:
        """Return the top N candidates for unsubscribing."""
        all_recs = self.analyze_all()
        return [
            r for r in all_recs
            if r.score in (
                UnsubscribeScore.STRONG_UNSUBSCRIBE,
                UnsubscribeScore.RECOMMENDED_UNSUBSCRIBE,
            )
        ][:limit]


class InboxDeclutterEngine:
    """
    Auto-categorize emails into Primary/Promotions/Social/Updates.
    Uses keyword matching, sender patterns, and header analysis.
    """

    CATEGORY_KEYWORDS: Dict[EmailCategory, List[str]] = {
        EmailCategory.PROMOTIONS: [
            "sale", "discount", "offer", "deal", "coupon", "promo",
            "limited time", "buy now", "shop", "exclusive", "flash sale",
            "free shipping", "% off", "clearance", "black friday",
            "cyber monday", "holiday sale", "special offer",
        ],
        EmailCategory.SOCIAL: [
            "liked your", "commented on", "followed you", "mentioned you",
            "new friend", "connection request", "tagged you", "shared",
            "invited you", "birthday", "anniversary", "facebook",
            "twitter", "linkedin", "instagram", "tiktok",
        ],
        EmailCategory.UPDATES: [
            "your receipt", "order confirmation", "shipping", "tracking",
            "invoice", "statement", "account update", "password reset",
            "security alert", "login attempt", "terms of service",
            "privacy policy", "changelog", "release notes",
        ],
        EmailCategory.FORUMS: [
            "new reply", "thread update", "forum", "discussion",
            "someone replied", "new post in", "group update",
            "digest", "community",
        ],
        EmailCategory.SPAM: [
            "act now", "urgent!!!", "click here", "million dollars",
            "nigerian prince", "you won", "congratulations winner",
            "viagra", "enlargement", "wire transfer",
        ],
    }

    NEWSLETTER_DOMAINS: Set[str] = {
        "substack.com", "mailchimp.com", "sendgrid.net",
        "convertkit.com", "beehiiv.com", "ghost.io",
        "campaign-archive.com", "newsletter",
    }

    SOCIAL_DOMAINS: Set[str] = {
        "facebook.com", "twitter.com", "linkedin.com",
        "instagram.com", "tiktok.com", "snapchat.com",
        "pinterest.com", "reddit.com", "notifications",
    }

    def __init__(self) -> None:
        self._custom_rules: Dict[str, EmailCategory] = {}
        self._stats: Dict[EmailCategory, int] = defaultdict(int)

    def add_custom_rule(self, pattern: str, category: EmailCategory) -> None:
        """Add a custom classification rule (sender or keyword pattern)."""
        self._custom_rules[pattern.lower()] = category

    def _domain_match(self, email: str, domains: Set[str]) -> bool:
        """Check if email domain matches any in the set."""
        domain = email.split("@")[-1].lower() if "@" in email else ""
        return any(d in domain for d in domains)

    def _keyword_score(self, text: str, keywords: List[str]) -> float:
        """Score text against keyword list. Returns match ratio."""
        text_lower = text.lower()
        matches = sum(1 for kw in keywords if kw in text_lower)
        return matches / len(keywords) if keywords else 0.0

    def categorize(self, email: EmailMessage) -> EmailCategory:
        """
        Categorize a single email message.
        Uses multi-signal analysis: keywords, sender domain, headers.
        """
        # Check custom rules first
        sender_lower = email.sender_email.lower()
        for pattern, category in self._custom_rules.items():
            if pattern in sender_lower or pattern in email.subject.lower():
                self._stats[category] += 1
                email.category = category
                return category

        # Domain-based quick classification
        if self._domain_match(email.sender_email, self.SOCIAL_DOMAINS):
            email.category = EmailCategory.SOCIAL
            self._stats[EmailCategory.SOCIAL] += 1
            return EmailCategory.SOCIAL

        if self._domain_match(email.sender_email, self.NEWSLETTER_DOMAINS):
            email.category = EmailCategory.UPDATES
            self._stats[EmailCategory.UPDATES] += 1
            return EmailCategory.UPDATES

        # Keyword scoring across categories
        combined_text = f"{email.subject} {email.body_preview}"
        scores: Dict[EmailCategory, float] = {}

        for category, keywords in self.CATEGORY_KEYWORDS.items():
            score = self._keyword_score(combined_text, keywords)
            if score > 0:
                scores[category] = score

        # Newsletter detection
        if email.is_newsletter and EmailCategory.PROMOTIONS not in scores:
            scores[EmailCategory.UPDATES] = scores.get(EmailCategory.UPDATES, 0) + 0.1

        # Unsubscribe header is a strong promotions signal
        if email.list_unsubscribe_header or email.unsubscribe_url:
            scores[EmailCategory.PROMOTIONS] = (
                scores.get(EmailCategory.PROMOTIONS, 0) + 0.15
            )

        if not scores:
            email.category = EmailCategory.PRIMARY
            self._stats[EmailCategory.PRIMARY] += 1
            return EmailCategory.PRIMARY

        # Spam gets priority if detected
        if EmailCategory.SPAM in scores and scores[EmailCategory.SPAM] > 0.1:
            email.category = EmailCategory.SPAM
            email.priority = EmailPriority.NEGLIGIBLE
            self._stats[EmailCategory.SPAM] += 1
            return EmailCategory.SPAM

        # Pick highest scoring category
        best_category = max(scores, key=scores.get)  # type: ignore
        email.category = best_category
        self._stats[best_category] += 1
        return best_category

    def categorize_batch(self, emails: List[EmailMessage]) -> Dict[EmailCategory, List[EmailMessage]]:
        """Categorize a batch of emails and return grouped results."""
        grouped: Dict[EmailCategory, List[EmailMessage]] = defaultdict(list)
        for email in emails:
            category = self.categorize(email)
            grouped[category].append(email)
        return dict(grouped)

    def get_category_stats(self) -> Dict[EmailCategory, int]:
        """Return categorization statistics."""
        return dict(self._stats)


class NewsletterDigestCompiler:
    """
    Aggregates multiple newsletters into a single daily digest email.
    Extracts key points, summarizes content, and estimates read time.
    """

    WORDS_PER_MINUTE = 250

    def __init__(self) -> None:
        self._newsletters: List[EmailMessage] = []
        self._digests: List[DailyDigest] = []

    def add_newsletter(self, email: EmailMessage) -> None:
        """Queue a newsletter for digest compilation."""
        self._newsletters.append(email)

    def _extract_key_points(self, email: EmailMessage) -> List[str]:
        """Extract key points from newsletter body preview."""
        sentences = email.body_preview.replace("\n", ". ").split(". ")
        key_points = []
        for sentence in sentences[:5]:
            sentence = sentence.strip()
            if len(sentence) > 20:
                key_points.append(sentence[:120] + ("..." if len(sentence) > 120 else ""))
        return key_points if key_points else [email.body_preview[:100]]

    def _summarize_body(self, email: EmailMessage) -> str:
        """Create a brief summary of the newsletter content."""
        preview = email.body_preview.strip()
        if len(preview) <= 200:
            return preview
        return preview[:197] + "..."

    def _estimate_read_time(self, entries: List[DigestEntry]) -> float:
        """Estimate total read time in minutes for all digest entries."""
        total_words = sum(
            len(entry.body_summary.split()) + len(entry.key_points) * 10
            for entry in entries
        )
        return max(1.0, total_words / self.WORDS_PER_MINUTE)

    def _extract_highlights(self, entries: List[DigestEntry]) -> List[str]:
        """Pull out the most interesting highlights across all newsletters."""
        highlights = []
        for entry in entries:
            if entry.key_points:
                highlights.append(f"[{entry.sender_name}] {entry.key_points[0]}")
        return highlights[:5]

    def compile_daily_digest(self, date: Optional[datetime] = None) -> DailyDigest:
        """
        Compile all queued newsletters into a single daily digest.
        Clears the queue after compilation.
        """
        digest_date = date or datetime.now()
        entries: List[DigestEntry] = []

        for newsletter in self._newsletters:
            entry = DigestEntry(
                sender_name=newsletter.sender_name,
                sender_email=newsletter.sender_email,
                subject=newsletter.subject,
                body_summary=self._summarize_body(newsletter),
                key_points=self._extract_key_points(newsletter),
                received_at=newsletter.received_at,
                original_message_id=newsletter.message_id,
            )
            entries.append(entry)

        read_time = self._estimate_read_time(entries)
        highlights = self._extract_highlights(entries)

        digest = DailyDigest(
            date=digest_date,
            entries=entries,
            total_newsletters=len(entries),
            estimated_read_time_minutes=round(read_time, 1),
            highlights=highlights,
        )

        self._digests.append(digest)
        self._newsletters.clear()
        return digest

    def get_digest_history(self) -> List[DailyDigest]:
        """Return all previously compiled digests."""
        return list(self._digests)


class ArchiveRuleEngine:
    """
    Automated archive rules engine.
    Supports age-based, category-based, read-status, and composite rules.
    """

    def __init__(self) -> None:
        self._rules: List[ArchiveRule] = []
        self._action_log: List[Tuple[datetime, str, ActionType, str]] = []

    def add_rule(self, rule: ArchiveRule) -> None:
        """Register a new archive rule."""
        self._rules.append(rule)
        self._rules.sort(key=lambda r: r.priority, reverse=True)

    def remove_rule(self, rule_id: str) -> bool:
        """Remove a rule by ID. Returns True if found and removed."""
        original_len = len(self._rules)
        self._rules = [r for r in self._rules if r.rule_id != rule_id]
        return len(self._rules) < original_len

    def _evaluate_age_rule(self, email: EmailMessage, rule: ArchiveRule) -> bool:
        """Evaluate an age-based archive rule."""
        max_age = rule.conditions.get("max_age_days", 30)
        return email.age_days >= max_age

    def _evaluate_category_rule(self, email: EmailMessage, rule: ArchiveRule) -> bool:
        """Evaluate a category-based archive rule."""
        target_categories = rule.conditions.get("categories", [])
        if isinstance(target_categories, list):
            target_enums = []
            for cat in target_categories:
                if isinstance(cat, EmailCategory):
                    target_enums.append(cat)
                elif isinstance(cat, str):
                    try:
                        target_enums.append(EmailCategory[cat.upper()])
                    except KeyError:
                        pass
            return email.category in target_enums
        return False

    def _evaluate_read_status_rule(self, email: EmailMessage, rule: ArchiveRule) -> bool:
        """Evaluate a read-status-based archive rule."""
        require_read = rule.conditions.get("require_read", True)
        min_age_days = rule.conditions.get("min_age_days", 1)
        if require_read and not email.is_read:
            return False
        if email.age_days < min_age_days:
            return False
        return True

    def _evaluate_sender_rule(self, email: EmailMessage, rule: ArchiveRule) -> bool:
        """Evaluate a sender-based archive rule."""
        senders = rule.conditions.get("senders", [])
        domains = rule.conditions.get("domains", [])
        sender_match = email.sender_email.lower() in [s.lower() for s in senders]
        domain_match = any(
            d.lower() in email.sender_email.lower() for d in domains
        )
        return sender_match or domain_match

    def _evaluate_keyword_rule(self, email: EmailMessage, rule: ArchiveRule) -> bool:
        """Evaluate a keyword-based archive rule."""
        keywords = rule.conditions.get("keywords", [])
        text = f"{email.subject} {email.body_preview}".lower()
        return any(kw.lower() in text for kw in keywords)

    def evaluate_rule(self, email: EmailMessage, rule: ArchiveRule) -> bool:
        """Evaluate a single rule against an email."""
        if not rule.enabled:
            return False

        evaluators = {
            ArchiveRuleType.AGE_BASED: self._evaluate_age_rule,
            ArchiveRuleType.CATEGORY_BASED: self._evaluate_category_rule,
            ArchiveRuleType.READ_STATUS: self._evaluate_read_status_rule,
            ArchiveRuleType.SENDER_BASED: self._evaluate_sender_rule,
            ArchiveRuleType.KEYWORD_BASED: self._evaluate_keyword_rule,
        }

        evaluator = evaluators.get(rule.rule_type)
        if evaluator:
            return evaluator(email, rule)

        if rule.rule_type == ArchiveRuleType.COMPOSITE:
            sub_rule_types = rule.conditions.get("sub_rules", [])
            return all(
                self.evaluate_rule(email, sub) for sub in sub_rule_types
                if isinstance(sub, ArchiveRule)
            )

        return False

    def process_email(self, email: EmailMessage) -> List[ActionType]:
        """Process an email against all rules and return triggered actions."""
        actions: List[ActionType] = []
        for rule in self._rules:
            if self.evaluate_rule(email, rule):
                actions.append(rule.action)
                rule.trigger_count += 1
                rule.last_triggered = datetime.now()
                self._action_log.append((
                    datetime.now(), rule.name, rule.action, email.message_id
                ))
        return actions

    def process_batch(self, emails: List[EmailMessage]) -> Dict[str, List[ActionType]]:
        """Process a batch of emails. Returns message_id -> actions mapping."""
        results: Dict[str, List[ActionType]] = {}
        for email in emails:
            actions = self.process_email(email)
            if actions:
                results[email.message_id] = actions
        return results

    def get_action_log(self) -> List[Tuple[datetime, str, ActionType, str]]:
        """Return the full action log."""
        return list(self._action_log)

    def get_rule_stats(self) -> List[Dict[str, Any]]:
        """Return statistics for each rule."""
        return [
            {
                "rule_id": r.rule_id,
                "name": r.name,
                "type": r.rule_type.name,
                "enabled": r.enabled,
                "trigger_count": r.trigger_count,
                "last_triggered": r.last_triggered,
            }
            for r in self._rules
        ]


class InboxZeroCoach:
    """
    Daily coaching tips and progress tracking for achieving inbox zero.
    Provides personalized recommendations based on inbox patterns.
    """

    TIPS_DATABASE: List[CoachingTip] = [
        CoachingTip(
            tip_id="TIP001",
            category=CoachingTipCategory.PRODUCTIVITY,
            title="Two-Minute Rule",
            description=(
                "If an email takes less than 2 minutes to handle, do it now. "
                "Don't let it linger in your inbox."
            ),
            impact_score=8.5,
        ),
        CoachingTip(
            tip_id="TIP002",
            category=CoachingTipCategory.ORGANIZATION,
            title="Batch Process Email",
            description=(
                "Check email at set times (e.g., 9am, 1pm, 5pm) instead of "
                "constantly. Reduces context switching by 40%."
            ),
            impact_score=9.0,
        ),
        CoachingTip(
            tip_id="TIP003",
            category=CoachingTipCategory.FOCUS,
            title="Unsubscribe Ruthlessly",
            description=(
                "Every newsletter you don't read costs ~30 seconds of attention. "
                "Unsubscribe from anything you haven't opened in 2 weeks."
            ),
            impact_score=9.5,
        ),
        CoachingTip(
            tip_id="TIP004",
            category=CoachingTipCategory.WORKFLOW,
            title="Archive Aggressively",
            description=(
                "Archive everything you've dealt with. Archive ≠ delete — "
                "you can always search and find it later."
            ),
            impact_score=8.0,
        ),
        CoachingTip(
            tip_id="TIP005",
            category=CoachingTipCategory.MINDSET,
            title="Inbox Zero is a Mindset",
            description=(
                "Inbox zero doesn't mean empty — it means everything is processed. "
                "Each email should be: done, delegated, deferred, or dropped."
            ),
            impact_score=9.0,
        ),
        CoachingTip(
            tip_id="TIP006",
            category=CoachingTipCategory.PRODUCTIVITY,
            title="Use Templates for Common Replies",
            description=(
                "If you write the same reply more than 3 times, create a template. "
                "Saves an average of 4 minutes per response."
            ),
            impact_score=7.5,
        ),
        CoachingTip(
            tip_id="TIP007",
            category=CoachingTipCategory.ORGANIZATION,
            title="One-Touch Principle",
            description=(
                "Touch each email only once. Read it, act on it, and move it out. "
                "Never read an email and leave it for later without a plan."
            ),
            impact_score=8.5,
        ),
        CoachingTip(
            tip_id="TIP008",
            category=CoachingTipCategory.FOCUS,
            title="Disable Email Notifications",
            description=(
                "Turn off desktop and phone notifications. Each interruption "
                "costs ~23 minutes of refocus time."
            ),
            impact_score=9.0,
        ),
    ]

    def __init__(self) -> None:
        self._progress_history: List[InboxZeroProgress] = []
        self._current_streak: int = 0
        self._used_tip_ids: Set[str] = set()

    def record_progress(self, progress: InboxZeroProgress) -> None:
        """Record a daily progress snapshot."""
        if progress.achieved_inbox_zero:
            self._current_streak += 1
        else:
            self._current_streak = 0
        progress.streak_days = self._current_streak
        self._progress_history.append(progress)

    def get_recommended_tips(self, progress: Optional[InboxZeroProgress] = None) -> List[CoachingTip]:
        """
        Return personalized tips based on current inbox state.
        Prioritizes unused tips with high impact scores.
        """
        available = [t for t in self.TIPS_DATABASE if t.tip_id not in self._used_tip_ids]
        if not available:
            self._used_tip_ids.clear()
            available = list(self.TIPS_DATABASE)

        # Sort by impact score
        available.sort(key=lambda t: t.impact_score, reverse=True)

        # If progress provided, prioritize relevant tips
        if progress:
            if progress.unread_count > 50:
                available = self._prioritize_category(
                    available, CoachingTipCategory.FOCUS
                )
            if progress.inbox_count > 100:
                available = self._prioritize_category(
                    available, CoachingTipCategory.ORGANIZATION
                )

        selected = available[:3]
        for tip in selected:
            self._used_tip_ids.add(tip.tip_id)
        return selected

    def _prioritize_category(
        self, tips: List[CoachingTip], category: CoachingTipCategory
    ) -> List[CoachingTip]:
        """Move tips of a specific category to the front."""
        matching = [t for t in tips if t.category == category]
        others = [t for t in tips if t.category != category]
        return matching + others

    def get_progress_history(self) -> List[InboxZeroProgress]:
        """Return full progress tracking history."""
        return list(self._progress_history)

    def get_streak_info(self) -> Dict[str, Any]:
        """Return current streak and best streak information."""
        best = max(
            (p.streak_days for p in self._progress_history), default=0
        )
        return {
            "current_streak": self._current_streak,
            "best_streak": best,
            "total_days_tracked": len(self._progress_history),
            "days_at_inbox_zero": sum(
                1 for p in self._progress_history if p.achieved_inbox_zero
            ),
        }

    def generate_daily_report(self, progress: InboxZeroProgress) -> str:
        """Generate a formatted daily coaching report."""
        tips = self.get_recommended_tips(progress)
        streak_info = self.get_streak_info()

        report_lines = [
            "=" * 60,
            "📊 INBOX ZERO DAILY REPORT",
            "=" * 60,
            f"📅 Date: {progress.date.strftime('%Y-%m-%d')}",
            f"📬 Inbox Count: {progress.inbox_count}",
            f"📖 Unread: {progress.unread_count}",
            f"📦 Archived Today: {progress.archived_today}",
            f"🗑️  Deleted Today: {progress.deleted_today}",
            f"↩️  Replied Today: {progress.replied_today}",
            f"🔕 Unsubscribed Today: {progress.unsubscribed_today}",
            f"🏷️  Categorized Today: {progress.categorized_today}",
            f"📈 Progress: {progress.progress_percentage:.1f}%",
            f"🔥 Streak: {streak_info['current_streak']} days",
            "",
            "💡 TODAY'S TIPS:",
            "-" * 40,
        ]

        for i, tip in enumerate(tips, 1):
            report_lines.append(f"  {i}. [{tip.category.name}] {tip.title}")
            report_lines.append(f"     {tip.description}")
            report_lines.append(f"     Impact: {'⭐' * int(tip.impact_score / 2)}")
            report_lines.append("")

        if progress.achieved_inbox_zero:
            report_lines.append("🎉 CONGRATULATIONS! You achieved Inbox Zero today!")
        else:
            remaining = progress.inbox_count - progress.goal_inbox_count
            report_lines.append(
                f"🎯 {remaining} more emails to process for Inbox Zero. You've got this!"
            )

        report_lines.append("=" * 60)
        return "\n".join(report_lines)


class SenderReputationScorer:
    """
    Compute reputation scores for email senders.
    Evaluates trust, engagement, frequency, and content quality signals.
    """

    TRUSTED_DOMAINS: Set[str] = {
        "google.com", "microsoft.com", "github.com", "amazon.com",
        "apple.com", "linkedin.com", "stripe.com", "slack.com",
        "notion.so", "figma.com", "atlassian.com",
    }

    SUSPICIOUS_TLDS: Set[str] = {
        ".xyz", ".top", ".click", ".loan", ".work",
        ".gq", ".ml", ".cf", ".tk", ".buzz",
    }

    SPAM_KEYWORDS: Set[str] = {
        "urgent", "act now", "limited time", "guaranteed",
        "risk-free", "no obligation", "winner", "congratulations",
        "free money", "cash prize", "million",
    }

    def __init__(self) -> None:
        self._reputations: Dict[str, SenderReputation] = {}

    def _calculate_trust_score(self, profile: SenderProfile) -> Tuple[float, List[str], List[str]]:
        """Calculate trust score (0-100) with signal lists."""
        score = 50.0
        positive: List[str] = []
        negative: List[str] = []

        # Domain trust
        if profile.domain in self.TRUSTED_DOMAINS:
            score += 25
            positive.append(f"Trusted domain: {profile.domain}")
        if any(tld in profile.domain for tld in self.SUSPICIOUS_TLDS):
            score -= 30
            negative.append(f"Suspicious TLD: {profile.domain}")

        # Verification
        if profile.is_verified:
            score += 15
            positive.append("Sender is verified")
        else:
            negative.append("Sender not verified")

        # Spam marks
        if profile.total_marked_spam > 0:
            penalty = min(40, profile.total_marked_spam * 10)
            score -= penalty
            negative.append(f"Marked as spam {profile.total_marked_spam} times")

        # Longevity
        days_known = (profile.last_seen - profile.first_seen).days
        if days_known > 365:
            score += 10
            positive.append(f"Known sender for {days_known} days")
        elif days_known < 7:
            score -= 10
            negative.append("Very new sender")

        return max(0.0, min(100.0, score)), positive, negative

    def _calculate_engagement_score(self, profile: SenderProfile) -> float:
        """Calculate engagement quality score (0-100)."""
        if profile.total_sent == 0:
            return 50.0

        open_score = min(profile.open_rate * 100, 50)
        click_score = min(profile.click_rate * 200, 25)
        reply_score = min(profile.reply_rate * 300, 25)

        return open_score + click_score + reply_score

    def _calculate_frequency_score(self, profile: SenderProfile) -> float:
        """Score based on sending frequency (0-100, higher = better/more reasonable)."""
        freq = profile.frequency_per_week
        if freq <= 2:
            return 95.0
        elif freq <= 5:
            return 75.0
        elif freq <= 10:
            return 50.0
        elif freq <= 20:
            return 25.0
        else:
            return 10.0

    def _calculate_content_quality(self, profile: SenderProfile, sample_subjects: Optional[List[str]] = None) -> float:
        """Estimate content quality score (0-100)."""
        score = 70.0

        if sample_subjects:
            spam_count = sum(
                1 for subj in sample_subjects
                if any(kw in subj.lower() for kw in self.SPAM_KEYWORDS)
            )
            if spam_count > 0:
                score -= spam_count * 15

        # High engagement implies good content
        if profile.open_rate > 0.4:
            score += 15
        if profile.click_rate > 0.1:
            score += 10

        return max(0.0, min(100.0, score))

    def score_sender(
        self, profile: SenderProfile, sample_subjects: Optional[List[str]] = None
    ) -> SenderReputation:
        """Compute full reputation score for a sender."""
        trust, positive_signals, spam_signals = self._calculate_trust_score(profile)
        engagement = self._calculate_engagement_score(profile)
        frequency = self._calculate_frequency_score(profile)
        content_quality = self._calculate_content_quality(profile, sample_subjects)

        # Weighted overall score
        overall = (
            trust * 0.30 +
            engagement * 0.25 +
            frequency * 0.20 +
            content_quality * 0.25
        )

        # Determine risk level
        if overall >= 70:
            risk_level = "low"
        elif overall >= 45:
            risk_level = "medium"
        elif overall >= 25:
            risk_level = "high"
        else:
            risk_level = "critical"

        reputation = SenderReputation(
            sender_email=profile.email,
            domain=profile.domain,
            overall_score=round(overall, 2),
            trust_score=round(trust, 2),
            engagement_score=round(engagement, 2),
            frequency_score=round(frequency, 2),
            content_quality_score=round(content_quality, 2),
            spam_signals=spam_signals,
            positive_signals=positive_signals,
            risk_level=risk_level,
        )

        self._reputations[profile.email] = reputation
        profile.reputation_score = overall
        return reputation

    def get_all_reputations(self) -> Dict[str, SenderReputation]:
        """Return all computed sender reputations."""
        return dict(self._reputations)

    def get_high_risk_senders(self) -> List[SenderReputation]:
        """Return senders with high or critical risk."""
        return [
            r for r in self._reputations.values()
            if r.risk_level in ("high", "critical")
        ]


class ReplyAllEnforcer:
    """
    Enforces reply-all discipline for actionable emails.
    Detects emails requiring responses and ensures proper reply handling.
    """

    ACTION_INDICATORS: List[str] = [
        "please review", "can you", "could you", "action required",
        "by eod", "by friday", "deadline", "asap", "urgent",
        "need your input", "waiting for", "follow up", "please confirm",
        "let me know", "what do you think", "your thoughts",
        "please approve", "sign off", "pending your",
    ]

    QUESTION_PATTERNS: List[str] = [
        "can you", "could you", "would you", "do you",
        "are you", "is there", "have you", "will you",
        "when can", "how about", "what time",
    ]

    def __init__(self) -> None:
        self._pending_replies: Dict[str, EmailMessage] = {}
        self._reminders_sent: Dict[str, datetime] = {}

    def is_actionable(self, email: EmailMessage) -> bool:
        """Determine if an email requires a reply or action."""
        if email.is_archived or email.is_deleted:
            return False

        text = f"{email.subject} {email.body_preview}".lower()

        # Check action indicators
        for indicator in self.ACTION_INDICATORS:
            if indicator in text:
                return True

        # Check for questions directed at recipient
        for pattern in self.QUESTION_PATTERNS:
            if pattern in text and "?" in text:
                return True

        # Multiple recipients with action language suggests reply-all
        if len(email.recipients) > 2:
            for indicator in self.ACTION_INDICATORS[:5]:
                if indicator in text:
                    return True

        return False

    def check_reply_all_needed(self, email: EmailMessage) -> bool:
        """
        Check if reply-all (vs reply) is appropriate.
        Returns True if reply-all should be used.
        """
        total_recipients = len(email.recipients) + len(email.cc_recipients)
        if total_recipients <= 2:
            return False

        # If the email has explicit action items for the group
        text = f"{email.subject} {email.body_preview}".lower()
        group_action_indicators = [
            "all", "team", "everyone", "folks", "group",
            "please all", "cc'd", "looping in",
        ]
        return any(ind in text for ind in group_action_indicators)

    def register_pending_reply(self, email: EmailMessage) -> None:
        """Register an email as needing a reply."""
        email.action_required = True
        self._pending_replies[email.message_id] = email

    def mark_replied(self, message_id: str) -> bool:
        """Mark a pending email as replied. Returns True if it was pending."""
        if message_id in self._pending_replies:
            del self._pending_replies[message_id]
            if message_id in self._reminders_sent:
                del self._reminders_sent[message_id]
            return True
        return False

    def get_pending_replies(self) -> List[EmailMessage]:
        """Return all emails pending a reply."""
        return list(self._pending_replies.values())

    def generate_reminders(self, max_age_hours: int = 24) -> List[Dict[str, Any]]:
        """Generate reply reminders for overdue actionable emails."""
        reminders = []
        cutoff = datetime.now() - timedelta(hours=max_age_hours)

        for msg_id, email in self._pending_replies.items():
            if email.received_at < cutoff:
                reply_all = self.check_reply_all_needed(email)
                reminder = {
                    "message_id": msg_id,
                    "sender": email.sender_name,
                    "sender_email": email.sender_email,
                    "subject": email.subject,
                    "received_at": email.received_at,
                    "hours_overdue": round(
                        (datetime.now() - email.received_at).total_seconds() / 3600, 1
                    ),
                    "reply_all_recommended": reply_all,
                    "recipient_count": len(email.recipients) + len(email.cc_recipients),
                    "action_type": "reply-all" if reply_all else "reply",
                }
                reminders.append(reminder)
                self._reminders_sent[msg_id] = datetime.now()

        reminders.sort(key=lambda r: r["hours_overdue"], reverse=True)
        return reminders

    def process_inbox(self, emails: List[EmailMessage]) -> Dict[str, Any]:
        """
        Scan inbox for actionable emails and enforce reply discipline.
        Returns summary of findings.
        """
        actionable = []
        non_actionable = []
        reply_all_needed = []

        for email in emails:
            if self.is_actionable(email):
                actionable.append(email)
                self.register_pending_reply(email)
                if self.check_reply_all_needed(email):
                    reply_all_needed.append(email)
            else:
                non_actionable.append(email)

        reminders = self.generate_reminders()

        return {
            "total_scanned": len(emails),
            "actionable_count": len(actionable),
            "non_actionable_count": len(non_actionable),
            "reply_all_recommended": len(reply_all_needed),
            "pending_reminders": len(reminders),
            "actionable_emails": actionable,
            "reminders": reminders,
        }


# ---------------------------------------------------------------------------
# V131 Unified Inbox Zero System
# ---------------------------------------------------------------------------

class V131InboxZeroSystem:
    """
    Unified V131 Inbox Zero management system.
    Orchestrates all engines for comprehensive inbox management.
    """

    def __init__(self) -> None:
        self.unsub_recommender = UnsubscribeRecommender()
        self.declutter_engine = InboxDeclutterEngine()
        self.digest_compiler = NewsletterDigestCompiler()
        self.archive_engine = ArchiveRuleEngine()
        self.coach = InboxZeroCoach()
        self.reputation_scorer = SenderReputationScorer()
        self.reply_enforcer = ReplyAllEnforcer()
        self._emails: List[EmailMessage] = []

    def ingest_emails(self, emails: List[EmailMessage]) -> None:
        """Ingest a batch of emails into the system."""
        self._emails.extend(emails)

    def run_full_analysis(self) -> Dict[str, Any]:
        """
        Run complete inbox analysis and return comprehensive report.
        """
        # 1. Categorize all emails
        categorized = self.declutter_engine.categorize_batch(self._emails)

        # 2. Identify newsletters for digest
        newsletters = [e for e in self._emails if e.is_newsletter]
        for nl in newsletters:
            self.digest_compiler.add_newsletter(nl)

        # 3. Process archive rules
        archive_results = self.archive_engine.process_batch(self._emails)

        # 4. Check for actionable emails
        reply_results = self.reply_enforcer.process_inbox(self._emails)

        # 5. Build progress snapshot
        progress = InboxZeroProgress(
            date=datetime.now(),
            total_emails=len(self._emails),
            unread_count=sum(1 for e in self._emails if not e.is_read),
            archived_today=len(archive_results),
            deleted_today=0,
            replied_today=0,
            unsubscribed_today=0,
            categorized_today=len(self._emails),
            inbox_count=sum(1 for e in self._emails if not e.is_archived),
        )
        self.coach.record_progress(progress)

        return {
            "total_emails": len(self._emails),
            "categories": {k.name: len(v) for k, v in categorized.items()},
            "newsletters_queued": len(newsletters),
            "archive_actions": len(archive_results),
            "actionable_emails": reply_results["actionable_count"],
            "reply_all_needed": reply_results["reply_all_recommended"],
            "progress_percentage": progress.progress_percentage,
            "inbox_zero_achieved": progress.achieved_inbox_zero,
        }

    def generate_daily_digest(self) -> Optional[DailyDigest]:
        """Compile and return the daily newsletter digest."""
        return self.digest_compiler.compile_daily_digest()

    def get_unsubscribe_report(self) -> List[UnsubscribeRecommendation]:
        """Return all unsubscribe recommendations sorted by priority."""
        return self.unsub_recommender.analyze_all()

    def get_coaching_report(self) -> str:
        """Generate and return the daily coaching report."""
        if self._progress_latest():
            return self.coach.generate_daily_report(self._progress_latest())
        return "No progress data available yet."

    def _progress_latest(self) -> Optional[InboxZeroProgress]:
        history = self.coach.get_progress_history()
        return history[-1] if history else None


# ---------------------------------------------------------------------------
# Test Scenarios
# ---------------------------------------------------------------------------

def _make_email(
    msg_id: str,
    sender: str,
    sender_name: str,
    subject: str,
    body: str,
    days_ago: int = 0,
    is_read: bool = False,
    recipients: Optional[List[str]] = None,
    cc: Optional[List[str]] = None,
    unsub_url: Optional[str] = None,
) -> EmailMessage:
    """Helper to create test email messages."""
    return EmailMessage(
        message_id=msg_id,
        sender_email=sender,
        sender_name=sender_name,
        subject=subject,
        body_preview=body,
        received_at=datetime.now() - timedelta(days=days_ago),
        is_read=is_read,
        recipients=recipients or ["user@example.com"],
        cc_recipients=cc or [],
        unsubscribe_url=unsub_url,
    )


def _make_profile(
    email: str,
    name: str,
    domain: str,
    sent: int,
    opened: int,
    clicked: int = 0,
    replied: int = 0,
    spam: int = 0,
    days_old: int = 365,
    unsub_url: Optional[str] = None,
    verified: bool = False,
) -> SenderProfile:
    """Helper to create test sender profiles."""
    return SenderProfile(
        email=email,
        display_name=name,
        domain=domain,
        first_seen=datetime.now() - timedelta(days=days_old),
        last_seen=datetime.now(),
        total_sent=sent,
        total_opened=opened,
        total_clicked=clicked,
        total_replied=replied,
        total_marked_spam=spam,
        unsubscribe_url=unsub_url,
        is_verified=verified,
    )


def test_scenario_1_unsubscribe_recommendations() -> None:
    """
    SCENARIO 1: Unsubscribe Recommendations
    Tests scoring for various sender engagement patterns.
    """
    print("\n" + "=" * 70)
    print("TEST SCENARIO 1: Unsubscribe Recommendations")
    print("=" * 70)

    recommender = UnsubscribeRecommender()

    profiles = [
        # Ghost sender — never opened
        _make_profile(
            "spam-daily@sketchy-deals.xyz", "Daily Deals",
            "sketchy-deals.xyz", sent=150, opened=0, spam=3,
            unsub_url="https://sketchy-deals.xyz/unsub",
        ),
        # High-frequency, low engagement
        _make_profile(
            "newsletter@marketing-spam.com", "Marketing Weekly",
            "marketing-spam.com", sent=200, opened=10, clicked=1,
            unsub_url="https://marketing-spam.com/opt-out",
        ),
        # Moderate engagement newsletter
        _make_profile(
            "digest@technews.io", "Tech News Daily",
            "technews.io", sent=100, opened=45, clicked=12, replied=2,
            unsub_url="https://technews.io/unsubscribe",
        ),
        # High value, trusted sender
        _make_profile(
            "updates@github.com", "GitHub",
            "github.com", sent=50, opened=40, clicked=20, replied=5,
            verified=True,
        ),
        # Medium engagement
        _make_profile(
            "team@notion.so", "Notion Team",
            "notion.so", sent=30, opened=18, clicked=5, replied=1,
            verified=True, unsub_url="https://notion.so/unsub",
        ),
    ]

    for profile in profiles:
        recommender.add_sender_profile(profile)

    results = recommender.analyze_all()

    print(f"\nAnalyzed {len(results)} senders:\n")
    for rec in results:
        print(f"  📧 {rec.sender_name} ({rec.sender_email})")
        print(f"     Score: {rec.numerical_score}/100 | Recommendation: {rec.score.name}")
        print(f"     Engagement: {rec.engagement_score} | "
              f"Frequency: {rec.frequency_score} | Value: {rec.value_score}")
        print(f"     Reasons: {'; '.join(rec.reasons)}")
        if rec.estimated_time_saved_per_week > 0:
            print(f"     ⏱️  Time saved if unsubscribed: {rec.estimated_time_saved_per_week}h/week")
        print()

    top_candidates = recommender.get_top_unsubscribe_candidates(3)
    print(f"🔕 Top {len(top_candidates)} unsubscribe candidates:")
    for i, rec in enumerate(top_candidates, 1):
        print(f"   {i}. {rec.sender_name} (score: {rec.numerical_score})")

    assert len(results) == 5, "Should have 5 recommendations"
    assert results[0].numerical_score <= results[-1].numerical_score, "Should be sorted ascending"
    print("\n✅ Scenario 1 PASSED")


def test_scenario_2_inbox_declutter() -> None:
    """
    SCENARIO 2: Inbox Declutter Engine
    Tests auto-categorization of diverse email types.
    """
    print("\n" + "=" * 70)
    print("TEST SCENARIO 2: Inbox Declutter Engine")
    print("=" * 70)

    engine = InboxDeclutterEngine()

    emails = [
        _make_email(
            "E001", "sales@megastore.com", "MegaStore",
            "🔥 FLASH SALE: 70% OFF Everything!",
            "Huge discounts today only. Buy now and save big. Limited time offer!",
            unsub_url="https://megastore.com/unsub",
        ),
        _make_email(
            "E002", "notifications@facebook.com", "Facebook",
            "John liked your photo",
            "John Smith liked your recent photo upload.",
        ),
        _make_email(
            "E003", "noreply@amazon.com", "Amazon",
            "Your order has shipped - tracking #12345",
            "Your order #9876 has shipped. Tracking number: 1Z999AA10123456784.",
        ),
        _make_email(
            "E004", "ceo@company.com", "Sarah Johnson",
            "Q4 Planning Meeting Tomorrow",
            "Hi team, please review the attached Q4 planning document before tomorrow's meeting.",
            recipients=["user@company.com", "team@company.com"],
        ),
        _make_email(
            "E005", "newsletter@substack.com", "The Pragmatic Engineer",
            "Weekly Digest: AI in Software Engineering",
            "This week's edition covers how AI tools are transforming software development...",
            unsub_url="https://substack.com/unsub",
        ),
        _make_email(
            "E006", "winner@prizes-free.click", "Prize Central",
            "URGENT!!! You WON $1,000,000 - Click here to claim!",
            "Congratulations winner! Act now to claim your million dollars cash prize!",
        ),
        _make_email(
            "E007", "noreply@reddit.com", "Reddit",
            "New reply in r/programming discussion",
            "Someone replied to your comment in the thread about Rust vs Go.",
        ),
    ]

    grouped = engine.categorize_batch(emails)

    print(f"\nCategorized {len(emails)} emails:\n")
    for category, msgs in sorted(grouped.items(), key=lambda x: x[0].name):
        print(f"  📁 {category.name} ({len(msgs)} emails)")
        for msg in msgs:
            print(f"     - [{msg.sender_name}] {msg.subject[:60]}")
        print()

    stats = engine.get_category_stats()
    print(f"Category stats: {dict((k.name, v) for k, v in stats.items())}")

    assert len(emails) == sum(len(v) for v in grouped.values()), "All emails categorized"
    assert EmailCategory.PROMOTIONS in grouped or EmailCategory.SPAM in grouped
    print("\n✅ Scenario 2 PASSED")


def test_scenario_3_newsletter_digest() -> None:
    """
    SCENARIO 3: Newsletter Digest Compilation
    Tests aggregation of multiple newsletters into a single digest.
    """
    print("\n" + "=" * 70)
    print("TEST SCENARIO 3: Newsletter Digest Compilation")
    print("=" * 70)

    compiler = NewsletterDigestCompiler()

    newsletters = [
        _make_email(
            "NL001", "digest@morningbrew.com", "Morning Brew",
            "Morning Brew - May 29 Edition",
            "Markets rally on positive economic data. Tech stocks lead gains with AI sector "
            "surging 3.2%. Federal Reserve signals potential rate pause in upcoming meeting. "
            "New startup raises $500M for quantum computing research.",
        ),
        _make_email(
            "NL002", "team@hackernewsletter.com", "Hacker Newsletter",
            "Hacker Newsletter #650: Best of HN this week",
            "Top stories: Why Rust is the future of systems programming. A deep dive into "
            "WebAssembly performance. The psychology of code review. Open source project "
            "of the week: a blazing fast database written in Zig.",
        ),
        _make_email(
            "NL003", "updates@substack.com", "The Pragmatic Engineer",
            "AI Tools for Software Engineers in 2026",
            "This week we explore how AI coding assistants have evolved. Copilot X now "
            "understands entire codebases. New tools for automated testing. The impact "
            "on developer productivity: studies show 35% faster shipping.",
        ),
        _make_email(
            "NL004", "newsletter@bytes.dev", "Bytes.dev",
            "Bytes: The JavaScript Newsletter #290",
            "React Server Components finally stable. New CSS features shipping in all "
            "browsers. TypeScript 6.0 announced with pattern matching. Deno 3.0 released "
            "with native npm support. Vite 7 benchmark results.",
        ),
    ]

    for nl in newsletters:
        compiler.add_newsletter(nl)

    digest = compiler.compile_daily_digest()

    print(f"\n{digest.summary}")
    print(f"📰 Entries: {digest.total_newsletters}")
    print(f"⏱️  Estimated read time: {digest.estimated_read_time_minutes} minutes")
    print()

    for entry in digest.entries:
        print(f"  📧 {entry.sender_name}: {entry.subject}")
        print(f"     Summary: {entry.body_summary[:80]}...")
        if entry.key_points:
            print(f"     Key Points:")
            for kp in entry.key_points[:3]:
                print(f"       • {kp}")
        print()

    if digest.highlights:
        print("✨ Top Highlights:")
        for hl in digest.highlights:
            print(f"   → {hl}")

    assert digest.total_newsletters == 4, "Should have 4 newsletter entries"
    assert digest.estimated_read_time_minutes > 0, "Read time should be positive"
    assert len(digest.entries) == 4, "Should have 4 entries"
    print("\n✅ Scenario 3 PASSED")


def test_scenario_4_archive_rules() -> None:
    """
    SCENARIO 4: Automated Archive Rules
    Tests age-based, category-based, and read-status archive rules.
    """
    print("\n" + "=" * 70)
    print("TEST SCENARIO 4: Automated Archive Rules")
    print("=" * 70)

    engine = ArchiveRuleEngine()

    # Rule 1: Archive read promotions older than 7 days
    engine.add_rule(ArchiveRule(
        rule_id="R001",
        name="Archive old read promotions",
        rule_type=ArchiveRuleType.CATEGORY_BASED,
        conditions={"categories": [EmailCategory.PROMOTIONS]},
        action=ActionType.ARCHIVE,
        priority=10,
    ))

    # Rule 2: Archive any read email older than 30 days
    engine.add_rule(ArchiveRule(
        rule_id="R002",
        name="Archive old read emails",
        rule_type=ArchiveRuleType.READ_STATUS,
        conditions={"require_read": True, "min_age_days": 30},
        action=ActionType.ARCHIVE,
        priority=5,
    ))

    # Rule 3: Auto-archive emails from specific sender
    engine.add_rule(ArchiveRule(
        rule_id="R003",
        name="Archive Jira notifications",
        rule_type=ArchiveRuleType.SENDER_BASED,
        conditions={"domains": ["jira.atlassian.com"]},
        action=ActionType.ARCHIVE,
        priority=8,
    ))

    # Rule 4: Delete old spam
    engine.add_rule(ArchiveRule(
        rule_id="R004",
        name="Delete old spam",
        rule_type=ArchiveRuleType.CATEGORY_BASED,
        conditions={"categories": [EmailCategory.SPAM]},
        action=ActionType.DELETE,
        priority=15,
    ))

    # Rule 5: Star emails with "invoice" keyword
    engine.add_rule(ArchiveRule(
        rule_id="R005",
        name="Star invoices",
        rule_type=ArchiveRuleType.KEYWORD_BASED,
        conditions={"keywords": ["invoice", "receipt"]},
        action=ActionType.STAR,
        priority=20,
    ))

    test_emails = [
        _make_email(
            "AR001", "sales@store.com", "Store",
            "Your weekly deals!", "Check out this week's promotions and discounts.",
            days_ago=14, is_read=True,
        ),
        _make_email(
            "AR002", "jira.atlassian.com", "Jira",
            "PROJ-1234 was updated", "Status changed from In Progress to Done.",
            days_ago=3, is_read=True,
        ),
        _make_email(
            "AR003", "billing@service.com", "Billing",
            "Invoice #9876 - Payment Received",
            "Your invoice for $299.00 has been paid. Receipt attached.",
            days_ago=45, is_read=True,
        ),
        _make_email(
            "AR004", "scam@winner.click", "Prize Central",
            "URGENT!!! You won a million dollars!",
            "Act now! Click here to claim your free money prize!",
            days_ago=10, is_read=False,
        ),
        _make_email(
            "AR005", "boss@company.com", "Manager",
            "Project deadline update",
            "Please review the new timeline. Action required by Friday.",
            days_ago=2, is_read=False,
        ),
    ]

    # Set categories for test emails
    test_emails[0].category = EmailCategory.PROMOTIONS
    test_emails[3].category = EmailCategory.SPAM

    results = engine.process_batch(test_emails)

    print(f"\nProcessed {len(test_emails)} emails with {len(engine._rules)} rules:\n")
    for email in test_emails:
        actions = results.get(email.message_id, [])
        action_str = ", ".join(a.name for a in actions) if actions else "No action"
        print(f"  📧 [{email.sender_name}] {email.subject[:50]}")
        print(f"     → Actions: {action_str}")
        print()

    stats = engine.get_rule_stats()
    print("Rule Statistics:")
    for s in stats:
        print(f"  • {s['name']}: triggered {s['trigger_count']} times")

    assert len(results) > 0, "Some emails should trigger actions"
    assert "AR003" in results, "Invoice email should be starred"
    print("\n✅ Scenario 4 PASSED")


def test_scenario_5_reply_all_enforcement() -> None:
    """
    SCENARIO 5: Reply-All Enforcement
    Tests detection of actionable emails and reply-all recommendations.
    """
    print("\n" + "=" * 70)
    print("TEST SCENARIO 5: Reply-All Enforcement")
    print("=" * 70)

    enforcer = ReplyAllEnforcer()

    emails = [
        _make_email(
            "RA001", "manager@company.com", "Project Manager",
            "Action Required: Q4 Budget Review",
            "Team, please review the attached budget proposal. Can you provide your "
            "feedback by EOD Friday? Need your input on the engineering allocations.",
            recipients=["user@company.com", "finance@company.com", "vp@company.com"],
            cc=["ceo@company.com"],
        ),
        _make_email(
            "RA002", "hr@company.com", "HR Department",
            "Updated Holiday Schedule 2026",
            "Please find attached the updated holiday schedule for 2026. "
            "No action needed, for your information only.",
            recipients=["all@company.com"],
        ),
        _make_email(
            "RA003", "client@external.com", "John Client",
            "Re: Project Deliverable Questions",
            "Could you clarify the timeline for the API integration? "
            "When can we expect the first milestone? What do you think about the approach?",
            recipients=["user@company.com", "team@company.com"],
        ),
        _make_email(
            "RA004", "newsletter@tech.io", "Tech Weekly",
            "This Week in Tech: AI Advances",
            "Top stories this week in artificial intelligence and machine learning.",
        ),
        _make_email(
            "RA005", "lead@company.com", "Team Lead",
            "URGENT: Production Incident - All Hands",
            "Folks, we have a critical production issue. All team members please "
            "join the war room. Looping in everyone from on-call. Please all respond "
            "with your availability ASAP.",
            recipients=["eng@company.com", "ops@company.com", "sre@company.com"],
            cc=["vp@company.com", "cto@company.com"],
        ),
    ]

    results = enforcer.process_inbox(emails)

    print(f"\nScanned {results['total_scanned']} emails:\n")
    print(f"  ✅ Actionable: {results['actionable_count']}")
    print(f"  ℹ️  Non-actionable: {results['non_actionable_count']}")
    print(f"  👥 Reply-All Recommended: {results['reply_all_recommended']}")
    print()

    print("Actionable Emails:")
    for email in results["actionable_emails"]:
        reply_all = enforcer.check_reply_all_needed(email)
        print(f"  📧 [{email.sender_name}] {email.subject[:55]}")
        print(f"     → Reply Type: {'REPLY-ALL ⚠️' if reply_all else 'Reply'}")
        print()

    pending = enforcer.get_pending_replies()
    print(f"📋 Pending Replies: {len(pending)}")

    assert results["actionable_count"] >= 2, "Should detect at least 2 actionable emails"
    assert results["reply_all_recommended"] >= 1, "Should recommend at least 1 reply-all"
    print("\n✅ Scenario 5 PASSED")


def test_scenario_6_sender_reputation() -> None:
    """
    SCENARIO 6: Sender Reputation Scoring
    Tests reputation calculation for diverse sender types.
    """
    print("\n" + "=" * 70)
    print("TEST SCENARIO 6: Sender Reputation Scoring")
    print("=" * 70)

    scorer = SenderReputationScorer()

    profiles = [
        _make_profile(
            "security@github.com", "GitHub Security",
            "github.com", sent=10, opened=10, clicked=5,
            replied=1, verified=True, days_old=1000,
        ),
        _make_profile(
            "noreply@legit-bank.com", "First National Bank",
            "legit-bank.com", sent=24, opened=20, clicked=3,
            verified=True, days_old=730,
        ),
        _make_profile(
            "promo@deals4u.xyz", "Hot Deals 4U",
            "deals4u.xyz", sent=300, opened=5, clicked=0,
            spam=5, days_old=30,
        ),
        _make_profile(
            "ceo@startup-new.io", "Startup CEO",
            "startup-new.io", sent=3, opened=2, clicked=1,
            days_old=14,
        ),
    ]

    reputations = []
    for profile in profiles:
        rep = scorer.score_sender(profile)
        reputations.append(rep)

    print(f"\nScored {len(reputations)} senders:\n")
    for rep in reputations:
        risk_emoji = {"low": "🟢", "medium": "🟡", "high": "🟠", "critical": "🔴"}
        print(f"  {risk_emoji.get(rep.risk_level, '⚪')} {rep.sender_email}")
        print(f"     Overall: {rep.overall_score}/100 | Risk: {rep.risk_level.upper()}")
        print(f"     Trust: {rep.trust_score} | Engagement: {rep.engagement_score} | "
              f"Frequency: {rep.frequency_score} | Quality: {rep.content_quality_score}")
        if rep.positive_signals:
            print(f"     ✅ Positive: {'; '.join(rep.positive_signals)}")
        if rep.spam_signals:
            print(f"     ⚠️  Signals: {'; '.join(rep.spam_signals)}")
        print()

    high_risk = scorer.get_high_risk_senders()
    print(f"🚨 High/Critical Risk Senders: {len(high_risk)}")
    for r in high_risk:
        print(f"   → {r.sender_email} (score: {r.overall_score}, risk: {r.risk_level})")

    assert len(reputations) == 4, "Should have 4 reputations"
    assert reputations[0].overall_score > reputations[2].overall_score, \
        "GitHub should score higher than spam sender"
    print("\n✅ Scenario 6 PASSED")


def test_scenario_7_inbox_zero_coaching() -> None:
    """
    SCENARIO 7: Inbox Zero Coaching & Progress Tracking
    Tests daily tips, progress tracking, and streak management.
    """
    print("\n" + "=" * 70)
    print("TEST SCENARIO 7: Inbox Zero Coaching & Progress Tracking")
    print("=" * 70)

    coach = InboxZeroCoach()

    # Simulate a week of progress
    daily_data = [
        (150, 80, 30, 10, 5, 2, 40, 70),   # Day 1: rough start
        (140, 60, 45, 15, 8, 3, 50, 40),   # Day 2: improving
        (120, 40, 50, 20, 10, 5, 60, 15),  # Day 3: getting close
        (100, 20, 60, 25, 12, 4, 80, 0),   # Day 4: INBOX ZERO!
        (80, 10, 55, 15, 8, 2, 70, 0),     # Day 5: maintaining
        (60, 5, 40, 10, 5, 1, 55, 0),      # Day 6: streak continues
        (50, 3, 35, 8, 4, 1, 47, 0),       # Day 7: streak!
    ]

    for i, (total, unread, archived, deleted, replied, unsub, categorized, inbox) in enumerate(daily_data):
        progress = InboxZeroProgress(
            date=datetime.now() - timedelta(days=7 - i),
            total_emails=total,
            unread_count=unread,
            archived_today=archived,
            deleted_today=deleted,
            replied_today=replied,
            unsubscribed_today=unsub,
            categorized_today=categorized,
            inbox_count=inbox,
        )
        coach.record_progress(progress)

    # Get latest progress and generate report
    history = coach.get_progress_history()
    latest = history[-1]

    print(f"\n📊 Week Summary:")
    print(f"   Total days tracked: {len(history)}")
    print(f"   Latest inbox count: {latest.inbox_count}")

    streak_info = coach.get_streak_info()
    print(f"   Current streak: {streak_info['current_streak']} days 🔥")
    print(f"   Best streak: {streak_info['best_streak']} days")
    print(f"   Days at inbox zero: {streak_info['days_at_inbox_zero']}")

    report = coach.generate_daily_report(latest)
    print(f"\n{report}")

    assert len(history) == 7, "Should have 7 days of history"
    assert streak_info["days_at_inbox_zero"] >= 4, "Should have at least 4 inbox-zero days"
    print("\n✅ Scenario 7 PASSED")


def test_scenario_8_full_system_integration() -> None:
    """
    SCENARIO 8: Full V131 System Integration
    Tests the unified system processing a realistic inbox.
    """
    print("\n" + "=" * 70)
    print("TEST SCENARIO 8: Full V131 System Integration")
    print("=" * 70)

    system = V131InboxZeroSystem()

    # Set up sender profiles
    profiles = [
        _make_profile(
            "newsletter@morningbrew.com", "Morning Brew",
            "morningbrew.com", sent=52, opened=40, clicked=15,
            verified=True, unsub_url="https://morningbrew.com/unsub",
        ),
        _make_profile(
            "spam@deals4u.xyz", "Hot Deals",
            "deals4u.xyz", sent=200, opened=2, spam=4,
            unsub_url="https://deals4u.xyz/unsub",
        ),
    ]
    for p in profiles:
        system.unsub_recommender.add_sender_profile(p)
        system.reputation_scorer.score_sender(p)

    # Set up archive rules
    system.archive_engine.add_rule(ArchiveRule(
        rule_id="INT001",
        name="Archive read promotions",
        rule_type=ArchiveRuleType.CATEGORY_BASED,
        conditions={"categories": [EmailCategory.PROMOTIONS]},
        action=ActionType.ARCHIVE,
        priority=10,
    ))

    # Ingest realistic inbox
    inbox = [
        _make_email(
            "INT-E01", "boss@company.com", "VP Engineering",
            "Action Required: Sprint Planning Review",
            "Please review the sprint backlog and provide your estimates by EOD. "
            "Team, we need everyone's input on priority.",
            recipients=["eng@company.com", "pm@company.com"],
        ),
        _make_email(
            "INT-E02", "newsletter@morningbrew.com", "Morning Brew",
            "☕ Your daily brew - May 29, 2026",
            "Markets update: S&P 500 up 1.2%. AI stocks surge. New regulations "
            "proposed for tech sector. Weekly digest of top business news.",
            unsub_url="https://morningbrew.com/unsub",
        ),
        _make_email(
            "INT-E03", "sales@flashdeals.com", "Flash Deals",
            "🔥 80% OFF - Today Only! Sale Sale Sale!",
            "Limited time offer! Buy now and save big. Exclusive discount for you. "
            "Flash sale ends at midnight!",
            days_ago=5, is_read=True,
            unsub_url="https://flashdeals.com/unsub",
        ),
        _make_email(
            "INT-E04", "notifications@github.com", "GitHub",
            "[repo] PR #456: Fix memory leak in connection pool",
            "New pull request from colleague. Please review the changes to the "
            "connection pool handling. Could you approve this PR?",
        ),
        _make_email(
            "INT-E05", "spam@deals4u.xyz", "Hot Deals 4U",
            "URGENT!!! FREE iPhone - Click Now!!!",
            "You won a free iPhone! Act now! Limited time guaranteed offer. "
            "Click here to claim your million dollar prize!",
            days_ago=3,
        ),
        _make_email(
            "INT-E06", "digest@techweekly.io", "Tech Weekly Digest",
            "Weekly Digest: Top 10 Programming Articles",
            "This week's best articles on software engineering, system design, "
            "and career growth. Issue #142 of our weekly newsletter digest.",
            unsub_url="https://techweekly.io/unsub",
        ),
    ]

    system.ingest_emails(inbox)
    analysis = system.run_full_analysis()

    print(f"\n📊 Full System Analysis Results:")
    print(f"   Total Emails: {analysis['total_emails']}")
    print(f"   Categories: {analysis['categories']}")
    print(f"   Newsletters Queued: {analysis['newsletters_queued']}")
    print(f"   Archive Actions: {analysis['archive_actions']}")
    print(f"   Actionable Emails: {analysis['actionable_emails']}")
    print(f"   Reply-All Needed: {analysis['reply_all_needed']}")
    print(f"   Progress: {analysis['progress_percentage']:.1f}%")
    print(f"   Inbox Zero: {'✅' if analysis['inbox_zero_achieved'] else '❌'}")

    # Generate digest
    digest = system.generate_daily_digest()
    if digest:
        print(f"\n📬 Daily Digest Generated:")
        print(f"   {digest.total_newsletters} newsletters | "
              f"~{digest.estimated_read_time_minutes} min read")

    # Unsubscribe recommendations
    unsub_recs = system.get_unsubscribe_report()
    print(f"\n🔕 Unsubscribe Recommendations: {len(unsub_recs)}")
    for rec in unsub_recs:
        print(f"   • {rec.sender_name}: {rec.score.name} (score: {rec.numerical_score})")

    # Sender reputations
    reps = system.reputation_scorer.get_all_reputations()
    print(f"\n🛡️  Sender Reputations: {len(reps)}")
    for email, rep in reps.items():
        print(f"   • {email}: {rep.overall_score}/100 ({rep.risk_level} risk)")

    assert analysis["total_emails"] == 6, "Should process 6 emails"
    assert analysis["actionable_emails"] >= 1, "Should detect actionable emails"
    assert analysis["newsletters_queued"] >= 1, "Should detect newsletters"
    print("\n✅ Scenario 8 PASSED")


# ---------------------------------------------------------------------------
# Main Entry Point
# ---------------------------------------------------------------------------

def main() -> None:
    """Run all V131 Inbox Zero test scenarios."""
    print("╔" + "═" * 68 + "╗")
    print("║" + " V131 AI Smart Unsubscribe & Inbox Zero Engine ".center(68) + "║")
    print("║" + " Production Demo & Test Suite ".center(68) + "║")
    print("╚" + "═" * 68 + "╝")
    print(f"\nStarted at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"Python Version: {__import__('sys').version.split()[0]}")

    scenarios = [
        ("Unsubscribe Recommendations", test_scenario_1_unsubscribe_recommendations),
        ("Inbox Declutter Engine", test_scenario_2_inbox_declutter),
        ("Newsletter Digest Compilation", test_scenario_3_newsletter_digest),
        ("Automated Archive Rules", test_scenario_4_archive_rules),
        ("Reply-All Enforcement", test_scenario_5_reply_all_enforcement),
        ("Sender Reputation Scoring", test_scenario_6_sender_reputation),
        ("Inbox Zero Coaching", test_scenario_7_inbox_zero_coaching),
        ("Full System Integration", test_scenario_8_full_system_integration),
    ]

    passed = 0
    failed = 0
    errors: List[str] = []

    for name, test_func in scenarios:
        try:
            test_func()
            passed += 1
        except Exception as e:
            failed += 1
            errors.append(f"  ❌ {name}: {e}")
            import traceback
            traceback.print_exc()

    print("\n" + "=" * 70)
    print(" FINAL RESULTS ".center(70, "="))
    print("=" * 70)
    print(f"  ✅ Passed: {passed}/{len(scenarios)}")
    if failed:
        print(f"  ❌ Failed: {failed}/{len(scenarios)}")
        for err in errors:
            print(err)
    else:
        print("  🎉 All scenarios passed successfully!")
    print(f"\n  Completed at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 70)


if __name__ == "__main__":
    main()
