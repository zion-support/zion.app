#!/usr/bin/env python3
"""
V138 AI Email-to-Content Repurposer
====================================
Production-quality tool for transforming email conversations into multiple
content formats: blog posts, social media, FAQs, case studies, training
materials, and newsletter segments.

Features:
    - SEO-optimized blog post generation
    - Multi-platform social media formatting (LinkedIn, Twitter/X, Instagram)
    - FAQ extraction with question-answer pairing
    - Case study generation (problem-solution-result)
    - Training material creation (step-by-step guides)
    - Newsletter segment formatting
    - Brand voice consistency checking
    - Content quality scoring (readability, engagement, SEO)
    - PII redaction before publishing
    - Multi-format export (Markdown, HTML, JSON)
    - Reply-all enforcement for content approval workflows

Author: V138 Systems
Version: 1.38.0
License: MIT
"""

from __future__ import annotations

import json
import re
import hashlib
import html
import textwrap
from dataclasses import dataclass, field, asdict
from datetime import datetime, timezone
from enum import Enum, auto
from typing import List, Optional, Dict, Any, Tuple, Set
from collections import Counter
import statistics


# =============================================================================
# ENUMS
# =============================================================================

class ContentType(Enum):
    """Types of content that can be generated from emails."""
    BLOG_POST = "blog_post"
    LINKEDIN_POST = "linkedin_post"
    TWITTER_THREAD = "twitter_thread"
    INSTAGRAM_CAPTION = "instagram_caption"
    FAQ_ENTRY = "faq_entry"
    CASE_STUDY = "case_study"
    TRAINING_MATERIAL = "training_material"
    NEWSLETTER_SEGMENT = "newsletter_segment"


class ExportFormat(Enum):
    """Supported export formats."""
    MARKDOWN = "markdown"
    HTML = "html"
    JSON = "json"


class ApprovalStatus(Enum):
    """Approval workflow states."""
    DRAFT = "draft"
    PENDING_REVIEW = "pending_review"
    APPROVED = "approved"
    REJECTED = "rejected"
    PUBLISHED = "published"


class PIICategory(Enum):
    """Categories of personally identifiable information."""
    EMAIL = "email"
    PHONE = "phone"
    SSN = "ssn"
    CREDIT_CARD = "credit_card"
    IP_ADDRESS = "ip_address"
    STREET_ADDRESS = "street_address"
    FULL_NAME = "full_name"
    DATE_OF_BIRTH = "date_of_birth"
    BANK_ACCOUNT = "bank_account"
    PASSPORT = "passport"


class VoiceTone(Enum):
    """Brand voice tone categories."""
    PROFESSIONAL = "professional"
    CASUAL = "casual"
    FORMAL = "formal"
    FRIENDLY = "friendly"
    AUTHORITATIVE = "authoritative"
    EMPATHETIC = "empathetic"
    HUMOROUS = "humorous"
    TECHNICAL = "technical"


class QualityMetric(Enum):
    """Content quality scoring dimensions."""
    READABILITY = "readability"
    ENGAGEMENT = "engagement"
    SEO_SCORE = "seo_score"
    BRAND_CONSISTENCY = "brand_consistency"
    ORIGINALITY = "originality"
    COMPLETENESS = "completeness"


# =============================================================================
# DATACLASSES
# =============================================================================

@dataclass
class EmailMessage:
    """Represents a single email message in a conversation thread."""
    sender: str
    sender_email: str
    recipients: List[str]
    subject: str
    body: str
    timestamp: datetime
    cc_list: List[str] = field(default_factory=list)
    bcc_list: List[str] = field(default_factory=list)
    attachments: List[str] = field(default_factory=list)
    reply_to: Optional[str] = None
    message_id: str = field(default="")

    def __post_init__(self):
        if not self.message_id:
            raw = f"{self.sender_email}{self.timestamp.isoformat()}{self.subject}"
            self.message_id = hashlib.sha256(raw.encode()).hexdigest()[:16]


@dataclass
class EmailThread:
    """Represents a complete email conversation thread."""
    messages: List[EmailMessage]
    thread_id: str = field(default="")
    labels: List[str] = field(default_factory=list)
    priority: str = "normal"

    def __post_init__(self):
        if not self.thread_id:
            raw = "".join(m.message_id for m in self.messages)
            self.thread_id = hashlib.sha256(raw.encode()).hexdigest()[:12]

    @property
    def full_conversation(self) -> str:
        """Get the full conversation text."""
        parts = []
        for msg in sorted(self.messages, key=lambda m: m.timestamp):
            parts.append(f"From: {msg.sender}\n{msg.body}")
        return "\n\n---\n\n".join(parts)

    @property
    def participants(self) -> Set[str]:
        """Get all unique participants."""
        names = set()
        for msg in self.messages:
            names.add(msg.sender)
        return names

    @property
    def word_count(self) -> int:
        """Total word count across all messages."""
        return sum(len(msg.body.split()) for msg in self.messages)


@dataclass
class BrandVoiceProfile:
    """Defines brand voice characteristics for consistency checking."""
    brand_name: str
    preferred_tones: List[VoiceTone]
    banned_words: List[str] = field(default_factory=list)
    preferred_words: List[str] = field(default_factory=list)
    max_sentence_length: int = 25
    preferred_reading_level: int = 8  # Grade level
    personality_traits: List[str] = field(default_factory=list)
    sample_phrases: List[str] = field(default_factory=list)
    avoid_jargon: bool = True
    use_emojis: bool = False
    formality_level: float = 0.6  # 0.0 = very casual, 1.0 = very formal


@dataclass
class PIIRedactionConfig:
    """Configuration for PII redaction."""
    enabled: bool = True
    categories_to_redact: List[PIICategory] = field(
        default_factory=lambda: list(PIICategory)
    )
    replacement_text: str = "[REDACTED]"
    log_redactions: bool = True
    custom_patterns: List[Tuple[str, str]] = field(default_factory=list)


@dataclass
class QualityScore:
    """Content quality assessment results."""
    readability: float = 0.0
    engagement: float = 0.0
    seo_score: float = 0.0
    brand_consistency: float = 0.0
    originality: float = 0.0
    completeness: float = 0.0

    @property
    def overall(self) -> float:
        """Calculate weighted overall score."""
        weights = {
            'readability': 0.20,
            'engagement': 0.20,
            'seo_score': 0.20,
            'brand_consistency': 0.15,
            'originality': 0.10,
            'completeness': 0.15,
        }
        score = (
            self.readability * weights['readability'] +
            self.engagement * weights['engagement'] +
            self.seo_score * weights['seo_score'] +
            self.brand_consistency * weights['brand_consistency'] +
            self.originality * weights['originality'] +
            self.completeness * weights['completeness']
        )
        return round(score, 2)

    def to_dict(self) -> Dict[str, float]:
        return {
            "readability": self.readability,
            "engagement": self.engagement,
            "seo_score": self.seo_score,
            "brand_consistency": self.brand_consistency,
            "originality": self.originality,
            "completeness": self.completeness,
            "overall": self.overall,
        }


@dataclass
class SEOConfig:
    """SEO optimization configuration."""
    target_keywords: List[str] = field(default_factory=list)
    meta_description_length: int = 155
    title_length: int = 60
    keyword_density_target: float = 0.025  # 2.5%
    include_internal_links: bool = True
    include_alt_text: bool = True
    header_structure: bool = True
    min_word_count: int = 300


@dataclass
class ContentPiece:
    """Represents a generated content piece."""
    content_type: ContentType
    title: str
    body: str
    metadata: Dict[str, Any] = field(default_factory=dict)
    quality_score: Optional[QualityScore] = None
    approval_status: ApprovalStatus = ApprovalStatus.DRAFT
    created_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))
    pii_redacted: bool = False
    brand_checked: bool = False
    seo_metadata: Dict[str, str] = field(default_factory=dict)
    hashtags: List[str] = field(default_factory=list)
    word_count: int = 0

    def __post_init__(self):
        if not self.word_count:
            self.word_count = len(self.body.split())


@dataclass
class ApprovalWorkflow:
    """Content approval workflow configuration."""
    require_reply_all: bool = True
    required_approvers: List[str] = field(default_factory=list)
    min_approvals: int = 1
    auto_approve_threshold: float = 85.0  # Auto-approve if quality score >= this
    rejection_requires_reason: bool = True
    notification_emails: List[str] = field(default_factory=list)
    escalation_timeout_hours: int = 48


@dataclass
class PIIRedactionResult:
    """Result of PII redaction operation."""
    original_text: str
    redacted_text: str
    findings: List[Tuple[PIICategory, str, int]] = field(default_factory=list)
    total_redactions: int = 0

    @property
    def is_clean(self) -> bool:
        return self.total_redactions == 0


@dataclass
class ContentRepurposerConfig:
    """Master configuration for the content repurposer."""
    brand_voice: BrandVoiceProfile
    seo_config: SEOConfig = field(default_factory=SEOConfig)
    pii_config: PIIRedactionConfig = field(default_factory=PIIRedactionConfig)
    approval_workflow: ApprovalWorkflow = field(default_factory=ApprovalWorkflow)
    default_export_format: ExportFormat = ExportFormat.MARKDOWN
    output_directory: str = "./output"
    max_content_length: int = 50000
    enable_quality_scoring: bool = True
    enable_pii_redaction: bool = True
    enable_brand_check: bool = True


# =============================================================================
# PII REDACTOR
# =============================================================================

class PIIRedactor:
    """Detects and redacts personally identifiable information from text."""

    PATTERNS = {
        PIICategory.EMAIL: r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b',
        PIICategory.PHONE: r'\b(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b',
        PIICategory.SSN: r'\b\d{3}[-.\s]?\d{2}[-.\s]?\d{4}\b',
        PIICategory.CREDIT_CARD: r'\b(?:\d{4}[-.\s]?){3}\d{4}\b',
        PIICategory.IP_ADDRESS: r'\b(?:\d{1,3}\.){3}\d{1,3}\b',
        PIICategory.STREET_ADDRESS: r'\b\d{1,5}\s+(?:[A-Z][a-z]+\s*){1,4}(?:St|Street|Ave|Avenue|Blvd|Boulevard|Dr|Drive|Ln|Lane|Rd|Road|Ct|Court|Way|Pl|Place)\.?\b',
        PIICategory.DATE_OF_BIRTH: r'\b(?:DOB|Date of Birth|Born)[:\s]+\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b',
        PIICategory.BANK_ACCOUNT: r'\b(?:Account|Acct|A/C)[:\s]*\d{8,17}\b',
        PIICategory.PASSPORT: r'\b[A-Z]{1,2}\d{6,9}\b',
    }

    def __init__(self, config: PIIRedactionConfig):
        self.config = config
        self._compiled_patterns = {}
        for category, pattern in self.PATTERNS.items():
            if category in config.categories_to_redact:
                self._compiled_patterns[category] = re.compile(pattern, re.IGNORECASE)
        for name, pattern in config.custom_patterns:
            cat = PIICategory.FULL_NAME  # default for custom
            self._compiled_patterns[cat] = re.compile(pattern)

    def redact(self, text: str) -> PIIRedactionResult:
        """Redact PII from text and return result with findings."""
        redacted = text
        findings: List[Tuple[PIICategory, str, int]] = []

        for category, pattern in self._compiled_patterns.items():
            for match in pattern.finditer(redacted):
                findings.append((category, match.group(), match.start()))

            redacted = pattern.sub(self.config.replacement_text, redacted)

        return PIIRedactionResult(
            original_text=text,
            redacted_text=redacted,
            findings=findings,
            total_redactions=len(findings),
        )

    def scan_only(self, text: str) -> List[Tuple[PIICategory, str, int]]:
        """Scan for PII without redacting."""
        findings = []
        for category, pattern in self._compiled_patterns.items():
            for match in pattern.finditer(text):
                findings.append((category, match.group(), match.start()))
        return findings


# =============================================================================
# BRAND VOICE CHECKER
# =============================================================================

class BrandVoiceChecker:
    """Validates content against brand voice guidelines."""

    def __init__(self, profile: BrandVoiceProfile):
        self.profile = profile

    def check(self, text: str) -> Dict[str, Any]:
        """Run brand voice consistency checks on content."""
        results = {
            "score": 0.0,
            "issues": [],
            "suggestions": [],
            "banned_words_found": [],
            "tone_matches": [],
            "formality_score": 0.0,
        }

        issues = []
        suggestions = []

        # Check for banned words
        lower_text = text.lower()
        banned_found = [w for w in self.profile.banned_words if w.lower() in lower_text]
        results["banned_words_found"] = banned_found
        if banned_found:
            issues.append(f"Banned words detected: {', '.join(banned_found)}")

        # Check sentence length
        sentences = self._split_sentences(text)
        long_sentences = [s for s in sentences if len(s.split()) > self.profile.max_sentence_length]
        if long_sentences:
            issues.append(
                f"{len(long_sentences)} sentences exceed max length "
                f"({self.profile.max_sentence_length} words)"
            )
            suggestions.append("Break long sentences into shorter, punchier ones.")

        # Check preferred words usage
        preferred_found = [w for w in self.profile.preferred_words if w.lower() in lower_text]
        if self.profile.preferred_words and not preferred_found:
            suggestions.append(
                f"Consider using brand-preferred terms: "
                f"{', '.join(self.profile.preferred_words[:5])}"
            )

        # Check emoji usage
        has_emojis = bool(re.search(r'[\U0001F600-\U0001F64F\U0001F300-\U0001F5FF]', text))
        if not self.profile.use_emojis and has_emojis:
            issues.append("Emojis detected but brand guidelines discourage their use.")
        elif self.profile.use_emojis and not has_emojis:
            suggestions.append("Consider adding emojis for brand alignment.")

        # Formality analysis
        formality = self._analyze_formality(text)
        results["formality_score"] = round(formality, 2)
        formality_diff = abs(formality - self.profile.formality_level)
        if formality_diff > 0.3:
            direction = "more formal" if formality < self.profile.formality_level else "more casual"
            suggestions.append(f"Content should be {direction} to match brand voice.")

        # Jargon check
        if self.profile.avoid_jargon:
            jargon_indicators = self._detect_jargon(text)
            if jargon_indicators:
                issues.append(f"Potential jargon detected: {', '.join(jargon_indicators[:5])}")
                suggestions.append("Replace technical jargon with simpler alternatives.")

        # Calculate overall score
        score = 100.0
        score -= len(banned_found) * 15
        score -= len(long_sentences) * 3
        score -= formality_diff * 20
        score -= len(jargon_indicators if self.profile.avoid_jargon else []) * 5
        score = max(0.0, min(100.0, score))

        results["score"] = round(score, 1)
        results["issues"] = issues
        results["suggestions"] = suggestions
        results["tone_matches"] = self._assess_tone_matches(text)

        return results

    def _split_sentences(self, text: str) -> List[str]:
        """Split text into sentences."""
        sentences = re.split(r'[.!?]+', text)
        return [s.strip() for s in sentences if s.strip()]

    def _analyze_formality(self, text: str) -> float:
        """Analyze text formality on 0.0-1.0 scale."""
        informal_indicators = [
            r'\bgonna\b', r'\bwanna\b', r'\bgotta\b', r'\bkinda\b',
            r'\bsorta\b', r'\blol\b', r'\bomg\b', r'\bbtw\b',
            r'!', r'\.\.\.', r'\byou guys\b', r'\bstuff\b',
            r'\bthings\b', r'\bcool\b', r'\bawesome\b',
        ]
        formal_indicators = [
            r'\btherefore\b', r'\bconsequently\b', r'\bfurthermore\b',
            r'\bnevertheless\b', r'\bhereby\b', r'\bpursuant\b',
            r'\baforementioned\b', r'\bshall\b', r'\bwhereas\b',
            r'\bin accordance\b', r'\bnotwithstanding\b',
        ]

        lower = text.lower()
        informal_count = sum(
            1 for p in informal_indicators if re.search(p, lower)
        )
        formal_count = sum(
            1 for p in formal_indicators if re.search(p, lower)
        )

        total = informal_count + formal_count
        if total == 0:
            return 0.5  # neutral

        return formal_count / total

    def _detect_jargon(self, text: str) -> List[str]:
        """Detect potential jargon terms."""
        jargon_patterns = [
            r'\bsynergy\b', r'\bleverage\b', r'\bparadigm\b',
            r'\bbandwidth\b', r'\bpivot\b', r'\bdisrupt(?:ion|ive)\b',
            r'\becosystem\b', r'\bholistic\b', r'\bactionable\b',
            r'\bscalable\b', r'\bblockchain\b', r'\bAI-powered\b',
            r'\bmission-critical\b', r'\bdeep dive\b', r'\bcircle back\b',
            r'\bmove the needle\b', r'\bboil the ocean\b',
        ]
        lower = text.lower()
        found = []
        for pattern in jargon_patterns:
            matches = re.findall(pattern, lower, re.IGNORECASE)
            found.extend(matches)
        return list(set(found))

    def _assess_tone_matches(self, text: str) -> List[str]:
        """Assess which voice tones the content matches."""
        tone_markers = {
            VoiceTone.PROFESSIONAL: [r'\bexpertise\b', r'\bsolution\b', r'\bstrategy\b'],
            VoiceTone.CASUAL: [r'\bhey\b', r'\bcool\b', r'\bstuff\b'],
            VoiceTone.FORMAL: [r'\bhereby\b', r'\bpursuant\b', r'\bshall\b'],
            VoiceTone.FRIENDLY: [r'\bwelcome\b', r'\bhappy\b', r'\bgreat\b'],
            VoiceTone.AUTHORITATIVE: [r'\bproven\b', r'\bleading\b', r'\bessential\b'],
            VoiceTone.EMPATHETIC: [r'\bunderstand\b', r'\bcare\b', r'\bsupport\b'],
            VoiceTone.HUMOROUS: [r'\bfunny\b', r'\bjoke\b', r'lol', r'haha'],
            VoiceTone.TECHNICAL: [r'\bimplement\b', r'\bconfigure\b', r'\bdeploy\b'],
        }
        matches = []
        lower = text.lower()
        for tone, patterns in tone_markers.items():
            if any(re.search(p, lower) for p in patterns):
                matches.append(tone.value)
        return matches


# =============================================================================
# QUALITY SCORER
# =============================================================================

class ContentQualityScorer:
    """Evaluates content quality across multiple dimensions."""

    COMMON_WORDS = {
        'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i',
        'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
        'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she',
        'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their',
        'what', 'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go',
        'me', 'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know',
        'take', 'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them',
        'see', 'other', 'than', 'then', 'now', 'look', 'only', 'come', 'its',
        'over', 'think', 'also', 'back', 'after', 'use', 'two', 'how', 'our',
        'work', 'first', 'well', 'way', 'even', 'new', 'want', 'because', 'any',
        'these', 'give', 'day', 'most', 'us', 'is', 'are', 'was', 'were', 'been',
    }

    def __init__(self, brand_checker: Optional[BrandVoiceChecker] = None):
        self.brand_checker = brand_checker

    def score(self, content: ContentPiece, seo_config: Optional[SEOConfig] = None) -> QualityScore:
        """Calculate comprehensive quality score for content."""
        qs = QualityScore(
            readability=self._score_readability(content.body),
            engagement=self._score_engagement(content),
            seo_score=self._score_seo(content, seo_config or SEOConfig()),
            brand_consistency=self._score_brand_consistency(content.body),
            originality=self._score_originality(content.body),
            completeness=self._score_completeness(content),
        )
        return qs

    def _score_readability(self, text: str) -> float:
        """Score readability using simplified Flesch-Kincaid approach."""
        sentences = re.split(r'[.!?]+', text)
        sentences = [s.strip() for s in sentences if s.strip()]
        words = text.split()

        if not sentences or not words:
            return 0.0

        avg_sentence_length = len(words) / len(sentences)
        syllable_count = sum(self._count_syllables(w) for w in words)
        avg_syllables = syllable_count / len(words) if words else 0

        # Simplified Flesch Reading Ease
        fre = 206.835 - (1.015 * avg_sentence_length) - (84.6 * avg_syllables)
        fre = max(0, min(100, fre))

        # Normalize to 0-100
        return round(fre, 1)

    def _count_syllables(self, word: str) -> int:
        """Estimate syllable count for a word."""
        word = word.lower().strip('.,!?;:')
        if len(word) <= 3:
            return 1

        vowels = 'aeiouy'
        count = 0
        prev_vowel = False

        for char in word:
            is_vowel = char in vowels
            if is_vowel and not prev_vowel:
                count += 1
            prev_vowel = is_vowel

        if word.endswith('e'):
            count -= 1
        if count == 0:
            count = 1

        return count

    def _score_engagement(self, content: ContentPiece) -> float:
        """Score content engagement potential."""
        text = content.body
        score = 50.0  # base score

        # Question marks indicate engagement hooks
        questions = text.count('?')
        score += min(questions * 3, 15)

        # Exclamation for energy (but not too many)
        exclamations = text.count('!')
        score += min(exclamations * 2, 10)

        # Lists and structure
        if re.search(r'^\s*[-*]\s', text, re.MULTILINE):
            score += 8
        if re.search(r'^\s*\d+[.)]\s', text, re.MULTILINE):
            score += 8

        # Direct address (you/your)
        you_count = len(re.findall(r'\byou\b|\byour\b', text, re.IGNORECASE))
        score += min(you_count * 1.5, 12)

        # Story elements
        story_words = ['story', 'journey', 'experience', 'discovered', 'learned', 'realized']
        story_count = sum(1 for w in story_words if w in text.lower())
        score += story_count * 2

        # Call to action
        cta_patterns = [r'\blearn more\b', r'\btry\b', r'\bstart\b', r'\bjoin\b', r'\bdiscover\b']
        cta_count = sum(1 for p in cta_patterns if re.search(p, text, re.IGNORECASE))
        score += cta_count * 3

        return round(min(100.0, max(0.0, score)), 1)

    def _score_seo(self, content: ContentPiece, seo_config: SEOConfig) -> float:
        """Score SEO optimization quality."""
        score = 0.0
        text = content.body
        lower = text.lower()
        words = text.split()
        word_count = len(words)

        # Title quality
        if content.title:
            score += 15
            if len(content.title) <= seo_config.title_length:
                score += 5
            if any(kw.lower() in content.title.lower() for kw in seo_config.target_keywords):
                score += 10

        # Word count sufficiency
        if word_count >= seo_config.min_word_count:
            score += 15
        elif word_count >= seo_config.min_word_count * 0.5:
            score += 8

        # Keyword usage
        if seo_config.target_keywords:
            keyword_hits = sum(
                lower.count(kw.lower()) for kw in seo_config.target_keywords
            )
            density = keyword_hits / word_count if word_count else 0
            if 0.01 <= density <= 0.04:
                score += 20
            elif density > 0:
                score += 10

        # Header structure (in markdown)
        if re.search(r'^#{1,6}\s', text, re.MULTILINE):
            score += 10

        # Meta description
        if content.seo_metadata.get('meta_description'):
            desc = content.seo_metadata['meta_description']
            score += 10
            if len(desc) <= seo_config.meta_description_length:
                score += 5

        # Internal links
        if seo_config.include_internal_links and ('[' in text and '](' in text):
            score += 5

        # Alt text indicators
        if seo_config.include_alt_text and '![' in text:
            score += 5

        return round(min(100.0, score), 1)

    def _score_brand_consistency(self, text: str) -> float:
        """Score brand voice consistency."""
        if not self.brand_checker:
            return 75.0  # neutral if no brand profile

        result = self.brand_checker.check(text)
        return result["score"]

    def _score_originality(self, text: str) -> float:
        """Estimate content originality."""
        words = [w.lower() for w in text.split()]
        if not words:
            return 0.0

        # Type-token ratio (vocabulary diversity)
        unique_words = set(words)
        ttr = len(unique_words) / len(words)

        # Penalize repetitive phrasing
        bigrams = [f"{words[i]} {words[i+1]}" for i in range(len(words)-1)]
        bigram_counts = Counter(bigrams)
        repeated_bigrams = sum(1 for c in bigram_counts.values() if c > 2)
        repetition_penalty = min(repeated_bigrams * 2, 20)

        # Rare word usage bonus
        rare_words = sum(1 for w in unique_words if w not in self.COMMON_WORDS and len(w) > 3)
        rare_bonus = min(rare_words * 0.5, 20)

        score = (ttr * 60) + rare_bonus - repetition_penalty + 20
        return round(min(100.0, max(0.0, score)), 1)

    def _score_completeness(self, content: ContentPiece) -> float:
        """Score content completeness based on type requirements."""
        score = 50.0
        text = content.body
        ctype = content.content_type

        if ctype == ContentType.BLOG_POST:
            if re.search(r'^#\s', text, re.MULTILINE):
                score += 10
            if re.search(r'^##\s', text, re.MULTILINE):
                score += 10
            if content.word_count >= 500:
                score += 15
            if content.seo_metadata.get('meta_description'):
                score += 10
            if content.seo_metadata.get('slug'):
                score += 5

        elif ctype in (ContentType.LINKEDIN_POST, ContentType.TWITTER_THREAD):
            if content.hashtags:
                score += 15
            if content.word_count >= 50:
                score += 15
            if '?' in text:
                score += 10
            if re.search(r'(🔥|💡|🚀|✨|📈)', text):
                score += 5

        elif ctype == ContentType.FAQ_ENTRY:
            if '?' in text:
                score += 20
            if 'A:' in text or 'Answer:' in text or '→' in text:
                score += 20
            if content.word_count >= 100:
                score += 10

        elif ctype == ContentType.CASE_STUDY:
            for section in ['problem', 'solution', 'result', 'challenge']:
                if section in text.lower():
                    score += 10

        elif ctype == ContentType.TRAINING_MATERIAL:
            if re.search(r'\bstep\s*\d', text, re.IGNORECASE):
                score += 20
            if re.search(r'^\s*\d+[.)]\s', text, re.MULTILINE):
                score += 15
            if 'objective' in text.lower() or 'goal' in text.lower():
                score += 10

        elif ctype == ContentType.NEWSLETTER_SEGMENT:
            if content.title:
                score += 15
            if re.search(r'(read more|learn more|click here)', text, re.IGNORECASE):
                score += 15
            if content.word_count >= 100:
                score += 15

        return round(min(100.0, max(0.0, score)), 1)


# =============================================================================
# CONTENT GENERATORS
# =============================================================================

class BlogPostGenerator:
    """Generate SEO-optimized blog posts from email threads."""

    def generate(
        self,
        thread: EmailThread,
        seo_config: SEOConfig,
        brand_voice: BrandVoiceProfile,
    ) -> ContentPiece:
        """Generate a blog post from an email conversation."""
        keywords = seo_config.target_keywords
        topic = self._extract_topic(thread)
        key_points = self._extract_key_points(thread)

        # Build blog post structure
        title = self._generate_title(topic, keywords)
        meta_desc = self._generate_meta_description(topic, key_points, seo_config)
        slug = self._generate_slug(title)

        body_parts = []
        body_parts.append(f"# {title}\n")
        body_parts.append(f"*{meta_desc}*\n")
        body_parts.append("---\n")

        # Introduction
        body_parts.append("## Introduction\n")
        intro = self._generate_intro(thread, topic)
        body_parts.append(f"{intro}\n")

        # Main sections from key points
        for i, point in enumerate(key_points, 1):
            heading = self._point_to_heading(point)
            body_parts.append(f"## {heading}\n")
            section = self._expand_point(point, thread, keywords)
            body_parts.append(f"{section}\n")

        # Conclusion
        body_parts.append("## Key Takeaways\n")
        takeaways = self._generate_takeaways(key_points)
        for ta in takeaways:
            body_parts.append(f"- {ta}")
        body_parts.append("")

        # CTA
        body_parts.append("## What's Next?\n")
        body_parts.append(
            f"If you found this helpful, consider sharing your own experiences. "
            f"What strategies have worked for you when dealing with {topic.lower()}? "
            f"Let us know in the comments below.\n"
        )

        full_body = "\n".join(body_parts)

        return ContentPiece(
            content_type=ContentType.BLOG_POST,
            title=title,
            body=full_body,
            seo_metadata={
                "meta_description": meta_desc,
                "slug": slug,
                "keywords": ", ".join(keywords),
                "canonical_url": f"/blog/{slug}",
            },
            metadata={
                "source_thread_id": thread.thread_id,
                "participants": list(thread.participants),
                "generated_at": datetime.now(timezone.utc).isoformat(),
            },
        )

    def _extract_topic(self, thread: EmailThread) -> str:
        """Extract the main topic from the thread."""
        subjects = [m.subject for m in thread.messages]
        # Use the most common subject as base topic
        if subjects:
            subject = max(set(subjects), key=subjects.count)
            # Clean up subject line
            topic = re.sub(r'^(Re|Fw|Fwd):\s*', '', subject, flags=re.IGNORECASE)
            return topic.strip()
        return "Industry Insights"

    def _extract_key_points(self, thread: EmailThread) -> List[str]:
        """Extract key discussion points from the thread."""
        points = []
        for msg in sorted(thread.messages, key=lambda m: m.timestamp):
            # Extract paragraphs as potential key points
            paragraphs = [p.strip() for p in msg.body.split('\n\n') if len(p.strip()) > 20]
            for para in paragraphs:
                # Filter out greetings, signatures
                if not self._is_greeting_or_signature(para):
                    # Take first sentence as the key point summary
                    first_sentence = re.split(r'[.!?]', para)[0].strip()
                    if len(first_sentence) > 10:
                        points.append(first_sentence)

        # Deduplicate and limit
        seen = set()
        unique_points = []
        for p in points:
            if p.lower() not in seen and len(unique_points) < 8:
                seen.add(p.lower())
                unique_points.append(p)

        return unique_points if unique_points else ["Key insights from our discussion"]

    def _is_greeting_or_signature(self, text: str) -> bool:
        """Check if text is a greeting or email signature."""
        greetings = [
            r'^hi\b', r'^hello\b', r'^hey\b', r'^dear\b',
            r'^good morning\b', r'^good afternoon\b',
            r'^best regards\b', r'^thanks\b', r'^thank you\b',
            r'^sincerely\b', r'^cheers\b', r'^regards\b',
            r'^sent from\b', r'^--\s*$'
        ]
        lower = text.lower().strip()
        return any(re.match(p, lower) for p in greetings)

    def _generate_title(self, topic: str, keywords: List[str]) -> str:
        """Generate an SEO-optimized title."""
        prefixes = [
            "The Complete Guide to",
            "Understanding",
            "How to Master",
            "A Deep Dive into",
            "Essential Strategies for",
        ]
        # Pick prefix based on topic hash for consistency
        idx = hash(topic) % len(prefixes)
        title = f"{prefixes[idx]} {topic}"

        # Add keyword if not present
        if keywords and not any(kw.lower() in title.lower() for kw in keywords):
            title = f"{title}: {keywords[0].title()} Best Practices"

        return title[:60] if len(title) > 60 else title

    def _generate_meta_description(self, topic: str, key_points: List[str], seo_config: SEOConfig) -> str:
        """Generate meta description."""
        desc = f"Discover key insights about {topic.lower()}. "
        if key_points:
            desc += f"Learn about {key_points[0].lower()}"
            if len(key_points) > 1:
                desc += f", {key_points[1].lower()}"
            desc += ", and more."

        return desc[:seo_config.meta_description_length]

    def _generate_slug(self, title: str) -> str:
        """Generate URL slug from title."""
        slug = title.lower()
        slug = re.sub(r'[^a-z0-9\s-]', '', slug)
        slug = re.sub(r'[\s]+', '-', slug.strip())
        slug = re.sub(r'-+', '-', slug)
        return slug[:80]

    def _generate_intro(self, thread: EmailThread, topic: str) -> str:
        """Generate blog post introduction."""
        participant_count = len(thread.participants)
        return (
            f"In today's rapidly evolving landscape, {topic.lower()} has become "
            f"a critical topic for professionals across industries. Drawing from "
            f"real-world discussions among {participant_count} experts, this article "
            f"explores the key challenges, solutions, and best practices that can "
            f"help you stay ahead of the curve.\n"
        )

    def _point_to_heading(self, point: str) -> str:
        """Convert a key point into a section heading."""
        # Take first 8 words as heading
        words = point.split()[:8]
        heading = " ".join(words)
        if heading[-1] in '.,!?;:':
            heading = heading[:-1]
        return heading.title()

    def _expand_point(self, point: str, thread: EmailThread, keywords: List[str]) -> str:
        """Expand a key point into a full section."""
        # Find relevant message content
        relevant_content = []
        for msg in thread.messages:
            if any(word.lower() in msg.body.lower() for word in point.split()[:5]):
                relevant_content.append(msg.body)

        context = "\n".join(relevant_content[:2]) if relevant_content else point

        section = (
            f"{point}.\n\n"
            f"This insight emerged from extensive discussion and real-world experience. "
            f"The consensus among participants highlights the importance of taking a "
            f"structured approach to this challenge.\n\n"
        )

        if keywords:
            section += (
                f"When considering {keywords[0].lower()}, it's essential to evaluate "
                f"both short-term impact and long-term sustainability.\n"
            )

        return section

    def _generate_takeaways(self, key_points: List[str]) -> List[str]:
        """Generate key takeaways."""
        takeaways = []
        for point in key_points[:5]:
            takeaway = f"{point} — this is a fundamental consideration."
            takeaways.append(takeaway)
        return takeaways if takeaways else ["Review the full discussion for detailed insights."]


class SocialMediaGenerator:
    """Generate social media content from email threads."""

    def generate_linkedin(
        self,
        thread: EmailThread,
        brand_voice: BrandVoiceProfile,
    ) -> ContentPiece:
        """Generate a LinkedIn post."""
        topic = self._extract_topic(thread)
        key_insight = self._extract_top_insight(thread)
        hashtags = self._generate_hashtags(topic, platform="linkedin")

        body_parts = []

        # Hook
        body_parts.append(f"🔥 Here's what {len(thread.participants)} professionals ")
        body_parts.append(f"discovered about {topic.lower()}:\n")

        # Story
        body_parts.append(f"{key_insight}\n")
        body_parts.append("After deep discussion, three things became clear:\n")

        points = self._extract_bullet_points(thread, max_points=3)
        for i, point in enumerate(points, 1):
            emoji = ["💡", "🎯", "📈"][i-1] if i <= 3 else "•"
            body_parts.append(f"{emoji} {point}")

        body_parts.append("")
        body_parts.append(f"The takeaway? {self._generate_takeaway(topic)}\n")
        body_parts.append("What's your experience? Drop your thoughts below 👇\n")
        body_parts.append(" ".join(f"#{tag}" for tag in hashtags))

        full_body = "\n".join(body_parts)

        return ContentPiece(
            content_type=ContentType.LINKEDIN_POST,
            title=f"LinkedIn: {topic}",
            body=full_body,
            hashtags=hashtags,
            metadata={"platform": "linkedin", "source_thread_id": thread.thread_id},
        )

    def generate_twitter_thread(
        self,
        thread: EmailThread,
        brand_voice: BrandVoiceProfile,
    ) -> ContentPiece:
        """Generate a Twitter/X thread."""
        topic = self._extract_topic(thread)
        points = self._extract_bullet_points(thread, max_points=5)
        hashtags = self._generate_hashtags(topic, platform="twitter")

        tweets = []

        # Tweet 1: Hook
        hook = f"🧵 A thread on {topic}:\n\nI had an eye-opening discussion with {len(thread.participants)} experts, and here's what we uncovered:"
        tweets.append(hook)

        # Content tweets
        for i, point in enumerate(points, 2):
            tweet = f"{i}/ {point}"
            if len(tweet) > 280:
                tweet = tweet[:277] + "..."
            tweets.append(tweet)

        # Final tweet: CTA
        final = f"{len(tweets)+1}/ Key takeaway: {self._generate_takeaway(topic)}\n\n{' '.join(f'#{tag}' for tag in hashtags[:3])}\n\n♻️ RT if this resonates!\n💬 Reply with your thoughts!"
        tweets.append(final)

        full_body = "\n\n---\n\n".join(tweets)

        return ContentPiece(
            content_type=ContentType.TWITTER_THREAD,
            title=f"Twitter Thread: {topic}",
            body=full_body,
            hashtags=hashtags,
            metadata={
                "platform": "twitter",
                "tweet_count": len(tweets),
                "source_thread_id": thread.thread_id,
            },
        )

    def generate_instagram(
        self,
        thread: EmailThread,
        brand_voice: BrandVoiceProfile,
    ) -> ContentPiece:
        """Generate an Instagram caption."""
        topic = self._extract_topic(thread)
        key_insight = self._extract_top_insight(thread)
        hashtags = self._generate_hashtags(topic, platform="instagram")

        body_parts = []
        body_parts.append(f"✨ {topic.upper()} ✨\n")
        body_parts.append(f"{key_insight}\n")
        body_parts.append("Here's what you need to know:\n")

        points = self._extract_bullet_points(thread, max_points=3)
        for point in points:
            body_parts.append(f"→ {point}")

        body_parts.append(f"\n💭 What do you think? Share below!\n")
        body_parts.append(f"{'.'*30}\n")

        # Hashtag block (Instagram allows up to 30)
        ig_hashtags = hashtags[:20]
        body_parts.append(" ".join(f"#{tag}" for tag in ig_hashtags))

        full_body = "\n".join(body_parts)

        return ContentPiece(
            content_type=ContentType.INSTAGRAM_CAPTION,
            title=f"Instagram: {topic}",
            body=full_body,
            hashtags=hashtags,
            metadata={
                "platform": "instagram",
                "source_thread_id": thread.thread_id,
                "suggested_image_text": topic,
            },
        )

    def _extract_topic(self, thread: EmailThread) -> str:
        """Extract topic from thread."""
        if thread.messages:
            subject = thread.messages[0].subject
            return re.sub(r'^(Re|Fw|Fwd):\s*', '', subject, flags=re.IGNORECASE).strip()
        return "Industry Topic"

    def _extract_top_insight(self, thread: EmailThread) -> str:
        """Extract the most impactful insight."""
        all_text = thread.full_conversation
        sentences = re.split(r'[.!?]+', all_text)
        sentences = [s.strip() for s in sentences if len(s.strip()) > 20 and len(s.strip()) < 200]

        if sentences:
            # Pick the most substantive sentence
            best = max(sentences, key=lambda s: len(s.split()))
            return best[:200]
        return "Important insights from our team discussion."

    def _extract_bullet_points(self, thread: EmailThread, max_points: int = 5) -> List[str]:
        """Extract bullet-point worthy insights."""
        points = []
        for msg in thread.messages:
            paragraphs = [p.strip() for p in msg.body.split('\n\n') if 20 < len(p.strip()) < 150]
            for p in paragraphs:
                first_sent = re.split(r'[.!?]', p)[0].strip()
                if len(first_sent) > 15 and first_sent.lower() not in [x.lower() for x in points]:
                    points.append(first_sent)

        return points[:max_points] if points else ["Key insight from our discussion."]

    def _generate_hashtags(self, topic: str, platform: str) -> List[str]:
        """Generate platform-appropriate hashtags."""
        base_tags = []
        # Clean topic for hashtags
        words = re.findall(r'\w+', topic)
        if words:
            base_tags.append("".join(words).lower())
            if len(words) > 1:
                base_tags.append(words[0].lower())

        platform_tags = {
            "linkedin": ["leadership", "innovation", "strategy", "business", "growth", "professional"],
            "twitter": ["thread", "insights", "tech", "business", "tips"],
            "instagram": ["instagood", "entrepreneur", "motivation", "success", "mindset",
                          "business", "growth", "learning", "knowledge", "tips"],
        }

        tags = base_tags + platform_tags.get(platform, [])
        return list(dict.fromkeys(tags))[:25]  # Deduplicate

    def _generate_takeaway(self, topic: str) -> str:
        """Generate a takeaway statement."""
        return (
            f"When it comes to {topic.lower()}, the key is to stay informed, "
            f"collaborate openly, and adapt quickly to new developments."
        )


class FAQGenerator:
    """Generate FAQ entries from email conversations."""

    def generate(self, thread: EmailThread) -> ContentPiece:
        """Generate FAQ entries from an email thread."""
        qa_pairs = self._extract_qa_pairs(thread)

        body_parts = []
        body_parts.append("# Frequently Asked Questions\n")
        body_parts.append(f"*Generated from: {thread.messages[0].subject if thread.messages else 'Discussion'}*\n")
        body_parts.append("---\n")

        for i, (question, answer) in enumerate(qa_pairs, 1):
            body_parts.append(f"## Q{i}: {question}\n")
            body_parts.append(f"**A:** {answer}\n")

        if not qa_pairs:
            body_parts.append("## Q1: What was discussed?\n")
            body_parts.append(f"**A:** {thread.full_conversation[:500]}\n")

        full_body = "\n".join(body_parts)

        return ContentPiece(
            content_type=ContentType.FAQ_ENTRY,
            title="FAQ: Key Questions and Answers",
            body=full_body,
            metadata={
                "qa_count": len(qa_pairs) or 1,
                "source_thread_id": thread.thread_id,
            },
        )

    def _extract_qa_pairs(self, thread: EmailThread) -> List[Tuple[str, str]]:
        """Extract question-answer pairs from the conversation."""
        pairs = []

        for i, msg in enumerate(sorted(thread.messages, key=lambda m: m.timestamp)):
            # Look for questions in the message
            questions = self._find_questions(msg.body)
            if questions and i + 1 < len(thread.messages):
                # Next message likely contains the answer
                next_msg = thread.messages[i + 1]
                for question in questions:
                    answer = self._extract_answer(next_msg.body)
                    if answer:
                        pairs.append((question, answer))

        # Also look for explicit Q&A patterns
        full_text = thread.full_conversation
        explicit_pairs = re.findall(
            r'(?:Q|Question)[:\s]+(.*?)\n+(?:A|Answer)[:\s]+(.*?)(?=\n(?:Q|Question)|$)',
            full_text, re.DOTALL | re.IGNORECASE
        )
        for q, a in explicit_pairs:
            pairs.append((q.strip(), a.strip()))

        return pairs

    def _find_questions(self, text: str) -> List[str]:
        """Find questions in text."""
        # Explicit questions (ending with ?)
        sentences = re.split(r'(?<=[.!?])\s+', text)
        questions = [s.strip().rstrip('?') for s in sentences if s.strip().endswith('?')]

        # Also look for implicit questions
        implicit_patterns = [
            r'(?:how|what|why|when|where|who|which)\b.*',
        ]
        for pattern in implicit_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            for match in matches:
                clean = match.strip().rstrip('.?!')
                if len(clean) > 10 and clean not in questions:
                    questions.append(clean)

        return questions[:5]  # Limit

    def _extract_answer(self, text: str) -> str:
        """Extract an answer from a message body."""
        # Skip greetings
        paragraphs = [p.strip() for p in text.split('\n\n') if len(p.strip()) > 15]
        # Filter out greetings/signatures
        content_paras = []
        for p in paragraphs:
            lower = p.lower()
            if not lower.startswith(('hi ', 'hello', 'hey', 'thanks', 'regards', 'best', 'cheers')):
                content_paras.append(p)

        if content_paras:
            return content_paras[0][:500]
        return text[:500].strip()


class CaseStudyGenerator:
    """Generate case studies from email conversations."""

    def generate(self, thread: EmailThread, seo_config: SEOConfig) -> ContentPiece:
        """Generate a case study with problem-solution-result structure."""
        topic = thread.messages[0].subject if thread.messages else "Project Discussion"
        topic = re.sub(r'^(Re|Fw|Fwd):\s*', '', topic, flags=re.IGNORECASE)

        problem = self._identify_problem(thread)
        solution = self._identify_solution(thread)
        results = self._identify_results(thread)
        participants = thread.participants

        body_parts = []
        body_parts.append(f"# Case Study: {topic}\n")
        body_parts.append(f"*{len(participants)} stakeholders | {len(thread.messages)} exchanges*\n")
        body_parts.append("---\n")

        # Executive Summary
        body_parts.append("## Executive Summary\n")
        body_parts.append(
            f"This case study examines how our team addressed the challenge of "
            f"{problem.lower()}. Through collaborative discussion and expert input "
            f"from {len(participants)} team members, we developed a comprehensive "
            f"solution that delivered measurable results.\n"
        )

        # The Challenge
        body_parts.append("## The Challenge\n")
        body_parts.append(f"{problem}\n")
        body_parts.append(
            "The situation required immediate attention due to its potential "
            "impact on project timelines, stakeholder satisfaction, and overall "
            "organizational goals.\n"
        )

        # The Solution
        body_parts.append("## The Solution\n")
        body_parts.append(f"{solution}\n")
        body_parts.append(
            "The approach involved multiple phases of implementation, "
            "stakeholder alignment, and iterative refinement based on feedback.\n"
        )

        # The Results
        body_parts.append("## The Results\n")
        body_parts.append(f"{results}\n")
        body_parts.append(
            "Key outcomes included improved efficiency, better stakeholder "
            "alignment, and a repeatable framework for future challenges.\n"
        )

        # Lessons Learned
        body_parts.append("## Lessons Learned\n")
        body_parts.append("- Early stakeholder engagement is critical for alignment")
        body_parts.append("- Iterative approaches reduce risk and improve outcomes")
        body_parts.append("- Clear communication channels accelerate resolution")
        body_parts.append("- Documentation ensures knowledge transfer\n")

        # Conclusion
        body_parts.append("## Conclusion\n")
        body_parts.append(
            f"This case demonstrates the value of collaborative problem-solving "
            f"and structured communication in achieving successful outcomes for "
            f"{topic.lower()}.\n"
        )

        full_body = "\n".join(body_parts)

        slug = re.sub(r'[^a-z0-9\s-]', '', topic.lower())
        slug = re.sub(r'[\s]+', '-', slug.strip())

        return ContentPiece(
            content_type=ContentType.CASE_STUDY,
            title=f"Case Study: {topic}",
            body=full_body,
            seo_metadata={
                "slug": f"case-study-{slug[:40]}",
                "meta_description": f"Case study: How we solved {problem[:80].lower()}",
            },
            metadata={"source_thread_id": thread.thread_id, "participants": list(participants)},
        )

    def _identify_problem(self, thread: EmailThread) -> str:
        """Identify the core problem from early messages."""
        early_msgs = sorted(thread.messages, key=lambda m: m.timestamp)[:2]
        problem_text = "\n".join(m.body for m in early_msgs)

        # Look for problem indicators
        problem_indicators = [
            r'(?:issue|problem|challenge|concern|blocker|difficulty)[:\s]+(.*?)[.\n]',
            r'(?:we need|we must|urgent|critical|asap)[:\s]*(.*?)[.\n]',
        ]
        for pattern in problem_indicators:
            match = re.search(pattern, problem_text, re.IGNORECASE)
            if match:
                return match.group(1).strip().capitalize()

        # Fallback: use first substantive paragraph
        for msg in early_msgs:
            paras = [p.strip() for p in msg.body.split('\n\n') if len(p.strip()) > 20]
            for p in paras:
                if not p.lower().startswith(('hi', 'hello', 'hey', 'dear')):
                    return p[:300]

        return "A significant operational challenge requiring cross-team collaboration"

    def _identify_solution(self, thread: EmailThread) -> str:
        """Identify the solution from middle messages."""
        mid_msgs = sorted(thread.messages, key=lambda m: m.timestamp)
        if len(mid_msgs) > 2:
            mid_msgs = mid_msgs[1:-1]

        solution_text = "\n".join(m.body for m in mid_msgs)

        # Look for solution indicators
        solution_indicators = [
            r'(?:suggest|propose|recommend|solution|approach|plan)[:\s]+(.*?)[.\n]',
            r'(?:we (?:should|could|can)|let\'s|here\'s what)[:\s]*(.*?)[.\n]',
        ]
        for pattern in solution_indicators:
            match = re.search(pattern, solution_text, re.IGNORECASE)
            if match:
                return match.group(1).strip().capitalize()

        if mid_msgs:
            return mid_msgs[0].body[:300].strip()
        return "A multi-faceted approach involving process improvements and team collaboration"

    def _identify_results(self, thread: EmailThread) -> str:
        """Identify results from later messages."""
        later_msgs = sorted(thread.messages, key=lambda m: m.timestamp)[-2:]
        results_text = "\n".join(m.body for m in later_msgs)

        # Look for result indicators
        result_indicators = [
            r'(?:result|outcome|achieved|completed|resolved|done|success)[:\s]+(.*?)[.\n]',
            r'(?:improved|increased|reduced|saved|delivered)[:\s]*(.*?)[.\n]',
        ]
        for pattern in result_indicators:
            match = re.search(pattern, results_text, re.IGNORECASE)
            if match:
                return match.group(1).strip().capitalize()

        return "The implementation yielded positive outcomes with measurable improvements across key metrics"


class TrainingMaterialGenerator:
    """Generate step-by-step training materials from email conversations."""

    def generate(self, thread: EmailThread) -> ContentPiece:
        """Generate training material with step-by-step structure."""
        topic = thread.messages[0].subject if thread.messages else "Process Guide"
        topic = re.sub(r'^(Re|Fw|Fwd):\s*', '', topic, flags=re.IGNORECASE)

        steps = self._extract_steps(thread)
        prerequisites = self._identify_prerequisites(thread)

        body_parts = []
        body_parts.append(f"# Training Guide: {topic}\n")
        body_parts.append("---\n")

        # Learning objectives
        body_parts.append("## Learning Objectives\n")
        body_parts.append(f"By the end of this guide, you will be able to:")
        body_parts.append(f"- Understand the fundamentals of {topic.lower()}")
        body_parts.append(f"- Apply best practices in real-world scenarios")
        body_parts.append(f"- Troubleshoot common issues independently")
        body_parts.append(f"- Collaborate effectively with team members\n")

        # Prerequisites
        if prerequisites:
            body_parts.append("## Prerequisites\n")
            for prereq in prerequisites:
                body_parts.append(f"- {prereq}")
            body_parts.append("")

        # Steps
        body_parts.append("## Step-by-Step Guide\n")
        for i, (step_title, step_detail) in enumerate(steps, 1):
            body_parts.append(f"### Step {i}: {step_title}\n")
            body_parts.append(f"{step_detail}\n")

        # Tips
        body_parts.append("## Pro Tips\n")
        body_parts.append("- 💡 Document your progress at each step")
        body_parts.append("- 🔄 Review and iterate on your approach")
        body_parts.append("- 🤝 Share learnings with your team")
        body_parts.append("- 📚 Refer back to this guide as needed\n")

        # Assessment
        body_parts.append("## Self-Assessment\n")
        body_parts.append("After completing this guide, verify your understanding:")
        body_parts.append(f"1. Can you explain the key concepts of {topic.lower()}?")
        body_parts.append("2. Have you successfully completed all steps?")
        body_parts.append("3. Can you identify areas for improvement?")
        body_parts.append("4. Are you able to help others with this process?\n")

        # Resources
        body_parts.append("## Additional Resources\n")
        body_parts.append("- Internal documentation wiki")
        body_parts.append("- Team Slack channel for questions")
        body_parts.append("- Monthly review sessions")

        full_body = "\n".join(body_parts)

        return ContentPiece(
            content_type=ContentType.TRAINING_MATERIAL,
            title=f"Training Guide: {topic}",
            body=full_body,
            metadata={
                "step_count": len(steps),
                "source_thread_id": thread.thread_id,
                "estimated_time": f"{len(steps) * 10} minutes",
            },
        )

    def _extract_steps(self, thread: EmailThread) -> List[Tuple[str, str]]:
        """Extract procedural steps from the conversation."""
        steps = []
        sorted_msgs = sorted(thread.messages, key=lambda m: m.timestamp)

        for msg in sorted_msgs:
            # Look for procedural language
            paragraphs = [p.strip() for p in msg.body.split('\n\n') if len(p.strip()) > 15]
            for para in paragraphs:
                lower = para.lower()
                if any(indicator in lower for indicator in [
                    'first', 'next', 'then', 'after that', 'finally',
                    'step', 'process', 'make sure', 'ensure', 'verify',
                    'check', 'update', 'configure', 'set up', 'install'
                ]):
                    title = re.split(r'[.!?]', para)[0][:50].strip()
                    detail = para[:300]
                    if title not in [s[0] for s in steps]:
                        steps.append((title, detail))

        # If no steps found, generate generic ones
        if not steps:
            steps = [
                ("Understand the Context", "Review the background and objectives discussed in the team conversation."),
                ("Gather Requirements", "Identify all necessary inputs, tools, and resources needed."),
                ("Plan Your Approach", "Create a structured plan based on team recommendations."),
                ("Execute the Process", "Follow the established procedures step by step."),
                ("Verify and Validate", "Check your work against expected outcomes and quality standards."),
                ("Document and Share", "Record your findings and share with the team for feedback."),
            ]

        return steps[:10]  # Limit to 10 steps

    def _identify_prerequisites(self, thread: EmailThread) -> List[str]:
        """Identify prerequisites from the conversation."""
        prereqs = []
        full_text = thread.full_conversation.lower()

        prereq_indicators = [
            r'(?:before|prerequisite|require|needed|must have)[:\s]+(.*?)[.\n]',
            r'(?:access to|permission for|familiarity with)[:\s]*(.*?)[.\n]',
        ]
        for pattern in prereq_indicators:
            matches = re.findall(pattern, full_text)
            for match in matches:
                prereq = match.strip()[:100]
                if prereq and prereq not in prereqs:
                    prereqs.append(prereq)

        return prereqs[:5]


class NewsletterGenerator:
    """Generate newsletter segments from email conversations."""

    def generate(self, thread: EmailThread, brand_voice: BrandVoiceProfile) -> ContentPiece:
        """Generate a newsletter segment."""
        topic = thread.messages[0].subject if thread.messages else "Team Update"
        topic = re.sub(r'^(Re|Fw|Fwd):\s*', '', topic, flags=re.IGNORECASE)

        highlights = self._extract_highlights(thread)
        key_quote = self._find_quotable(thread)

        body_parts = []
        body_parts.append(f"## 📬 {topic}\n")
        body_parts.append(f"*This week's insights from our {brand_voice.brand_name} team*\n")
        body_parts.append("---\n")

        # Main highlight
        if highlights:
            body_parts.append("### Highlights\n")
            for highlight in highlights:
                body_parts.append(f"• {highlight}")
            body_parts.append("")

        # Quote
        if key_quote:
            body_parts.append("### 💬 Quote of the Week\n")
            body_parts.append(f"> \"{key_quote}\"\n")

        # Key stats/metrics
        body_parts.append("### By the Numbers\n")
        body_parts.append(f"- **{len(thread.messages)}** messages exchanged")
        body_parts.append(f"- **{len(thread.participants)}** team members contributed")
        body_parts.append(f"- **{thread.word_count}** words of collective insight")
        body_parts.append(f"- **{len(highlights)}** key takeaways identified\n")

        # CTA
        body_parts.append("### What's Next?\n")
        body_parts.append(
            f"Stay tuned for our next update as we continue to explore "
            f"{topic.lower()}. Have something to share? Reply to this "
            f"newsletter and let us know!\n"
        )
        body_parts.append("[Read More →](#)\n")

        full_body = "\n".join(body_parts)

        return ContentPiece(
            content_type=ContentType.NEWSLETTER_SEGMENT,
            title=f"Newsletter: {topic}",
            body=full_body,
            metadata={
                "source_thread_id": thread.thread_id,
                "segment_type": "team_update",
            },
        )

    def _extract_highlights(self, thread: EmailThread) -> List[str]:
        """Extract newsletter-worthy highlights."""
        highlights = []
        for msg in thread.messages:
            sentences = re.split(r'[.!?]+', msg.body)
            for sent in sentences:
                sent = sent.strip()
                if 20 < len(sent) < 150 and any(word in sent.lower() for word in [
                    'important', 'key', 'critical', 'breakthrough', 'achieved',
                    'improved', 'launched', 'completed', 'decided', 'agreed'
                ]):
                    if sent not in highlights:
                        highlights.append(sent)

        return highlights[:5] if highlights else [
            "Team collaborated on key strategic decisions",
            "Multiple perspectives were shared and evaluated",
            "Action items were identified for follow-up",
        ]

    def _find_quotable(self, thread: EmailThread) -> Optional[str]:
        """Find a quotable statement from the thread."""
        all_sentences = []
        for msg in thread.messages:
            sentences = re.split(r'[.!?]+', msg.body)
            for sent in sentences:
                sent = sent.strip()
                if 30 < len(sent) < 200:
                    all_sentences.append(sent)

        if all_sentences:
            # Pick the most "quotable" - longer, more substantive
            best = max(all_sentences, key=lambda s: len(s.split()))
            return best
        return None


# =============================================================================
# CONTENT EXPORTER
# =============================================================================

class ContentExporter:
    """Export content pieces in multiple formats."""

    def export(self, content: ContentPiece, format: ExportFormat) -> str:
        """Export content in the specified format."""
        exporters = {
            ExportFormat.MARKDOWN: self._export_markdown,
            ExportFormat.HTML: self._export_html,
            ExportFormat.JSON: self._export_json,
        }
        return exporters[format](content)

    def _export_markdown(self, content: ContentPiece) -> str:
        """Export as Markdown."""
        parts = []
        parts.append(f"---")
        parts.append(f"type: {content.content_type.value}")
        parts.append(f"title: \"{content.title}\"")
        parts.append(f"status: {content.approval_status.value}")
        parts.append(f"created: {content.created_at.isoformat()}")
        parts.append(f"word_count: {content.word_count}")
        if content.quality_score:
            parts.append(f"quality_score: {content.quality_score.overall}")
        if content.hashtags:
            parts.append(f"hashtags: [{', '.join(content.hashtags)}]")
        if content.seo_metadata:
            for key, val in content.seo_metadata.items():
                parts.append(f"seo_{key}: \"{val}\"")
        parts.append(f"---\n")
        parts.append(content.body)
        return "\n".join(parts)

    def _export_html(self, content: ContentPiece) -> str:
        """Export as HTML."""
        escaped_title = html.escape(content.title)
        # Basic markdown to HTML conversion
        body_html = self._markdown_to_html(content.body)

        quality_html = ""
        if content.quality_score:
            quality_html = f"""
        <div class="quality-score">
            <h3>Quality Score: {content.quality_score.overall}/100</h3>
            <ul>
                <li>Readability: {content.quality_score.readability}</li>
                <li>Engagement: {content.quality_score.engagement}</li>
                <li>SEO: {content.quality_score.seo_score}</li>
                <li>Brand Consistency: {content.quality_score.brand_consistency}</li>
            </ul>
        </div>"""

        seo_html = ""
        if content.seo_metadata:
            meta_tags = []
            if 'meta_description' in content.seo_metadata:
                meta_tags.append(
                    f'    <meta name="description" content="{html.escape(content.seo_metadata["meta_description"])}">'
                )
            if 'keywords' in content.seo_metadata:
                meta_tags.append(
                    f'    <meta name="keywords" content="{html.escape(content.seo_metadata["keywords"])}">'
                )
            seo_html = "\n".join(meta_tags)

        return f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{escaped_title}</title>
{seo_html}
    <style>
        body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 800px; margin: 0 auto; padding: 2rem; line-height: 1.6; }}
        .metadata {{ background: #f5f5f5; padding: 1rem; border-radius: 8px; margin-bottom: 2rem; }}
        .quality-score {{ background: #e8f5e9; padding: 1rem; border-radius: 8px; margin-top: 2rem; }}
        h1 {{ color: #333; }}
        h2 {{ color: #555; border-bottom: 1px solid #eee; padding-bottom: 0.5rem; }}
        blockquote {{ border-left: 4px solid #007bff; margin-left: 0; padding-left: 1rem; color: #666; }}
        code {{ background: #f0f0f0; padding: 0.2rem 0.4rem; border-radius: 3px; }}
        .tags {{ display: flex; gap: 0.5rem; flex-wrap: wrap; }}
        .tag {{ background: #007bff; color: white; padding: 0.2rem 0.6rem; border-radius: 12px; font-size: 0.8rem; }}
    </style>
</head>
<body>
    <div class="metadata">
        <p><strong>Type:</strong> {content.content_type.value} | <strong>Status:</strong> {content.approval_status.value}</p>
        <p><strong>Created:</strong> {content.created_at.isoformat()} | <strong>Words:</strong> {content.word_count}</p>
        {"" if not content.hashtags else '<div class="tags">' + "".join(f'<span class="tag">#{html.escape(t)}</span>' for t in content.hashtags) + '</div>'}
    </div>
    {body_html}
    {quality_html}
</body>
</html>"""

    def _markdown_to_html(self, md: str) -> str:
        """Basic markdown to HTML conversion."""
        lines = md.split('\n')
        html_lines = []

        for line in lines:
            stripped = line.strip()

            # Headers
            if stripped.startswith('# '):
                html_lines.append(f"    <h1>{html.escape(stripped[2:])}</h1>")
            elif stripped.startswith('## '):
                html_lines.append(f"    <h2>{html.escape(stripped[3:])}</h2>")
            elif stripped.startswith('### '):
                html_lines.append(f"    <h3>{html.escape(stripped[4:])}</h3>")
            elif stripped.startswith('> '):
                html_lines.append(f"    <blockquote>{html.escape(stripped[2:])}</blockquote>")
            elif stripped.startswith('- ') or stripped.startswith('• '):
                html_lines.append(f"    <li>{self._inline_format(stripped[2:])}</li>")
            elif stripped == '---':
                html_lines.append("    <hr>")
            elif stripped.startswith('*') and stripped.endswith('*') and not stripped.startswith('**'):
                html_lines.append(f"    <p><em>{html.escape(stripped.strip('*'))}</em></p>")
            elif stripped.startswith('**') and stripped.endswith('**'):
                html_lines.append(f"    <p><strong>{html.escape(stripped.strip('*'))}</strong></p>")
            elif stripped == '':
                html_lines.append("")
            else:
                html_lines.append(f"    <p>{self._inline_format(stripped)}</p>")

        return "\n".join(html_lines)

    def _inline_format(self, text: str) -> str:
        """Handle inline markdown formatting."""
        escaped = html.escape(text)
        # Bold
        escaped = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', escaped)
        # Italic
        escaped = re.sub(r'\*(.+?)\*', r'<em>\1</em>', escaped)
        # Links
        escaped = re.sub(r'\[(.+?)\]\((.+?)\)', r'<a href="\2">\1</a>', escaped)
        return escaped

    def _export_json(self, content: ContentPiece) -> str:
        """Export as JSON."""
        data = {
            "content_type": content.content_type.value,
            "title": content.title,
            "body": content.body,
            "metadata": content.metadata,
            "approval_status": content.approval_status.value,
            "created_at": content.created_at.isoformat(),
            "pii_redacted": content.pii_redacted,
            "brand_checked": content.brand_checked,
            "word_count": content.word_count,
            "hashtags": content.hashtags,
            "seo_metadata": content.seo_metadata,
        }
        if content.quality_score:
            data["quality_score"] = content.quality_score.to_dict()

        return json.dumps(data, indent=2, ensure_ascii=False)


# =============================================================================
# APPROVAL WORKFLOW MANAGER
# =============================================================================

class ApprovalWorkflowManager:
    """Manages content approval workflows with reply-all enforcement."""

    def __init__(self, config: ApprovalWorkflow):
        self.config = config
        self._approval_history: List[Dict[str, Any]] = []

    def submit_for_review(
        self,
        content: ContentPiece,
        submitter_email: str,
        thread_participants: List[str],
    ) -> Dict[str, Any]:
        """Submit content for review with reply-all enforcement."""
        result = {
            "status": "submitted",
            "content_id": content.title,
            "submitter": submitter_email,
            "required_approvals": self.config.min_approvals,
            "reply_all_required": self.config.require_reply_all,
            "notifications_sent": [],
            "issues": [],
        }

        # Reply-all enforcement: ensure all participants are notified
        if self.config.require_reply_all:
            all_recipients = set(thread_participants)
            all_recipients.update(self.config.notification_emails)
            all_recipients.discard(submitter_email)

            if not all_recipients:
                result["issues"].append(
                    "REPLY-ALL ENFORCEMENT: No other participants to notify. "
                    "Content approval requires at least one additional reviewer."
                )
                result["status"] = "blocked"
            else:
                result["notifications_sent"] = list(all_recipients)
                result["reply_all_message"] = self._generate_reply_all_message(
                    content, submitter_email, all_recipients
                )

        # Auto-approve check
        if content.quality_score and content.quality_score.overall >= self.config.auto_approve_threshold:
            result["auto_approved"] = True
            result["reason"] = f"Quality score ({content.quality_score.overall}) exceeds threshold ({self.config.auto_approve_threshold})"
            content.approval_status = ApprovalStatus.APPROVED
        else:
            content.approval_status = ApprovalStatus.PENDING_REVIEW
            result["auto_approved"] = False

        self._approval_history.append({
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "action": "submit",
            "content_title": content.title,
            "submitter": submitter_email,
            "result": result["status"],
        })

        return result

    def approve(
        self,
        content: ContentPiece,
        approver_email: str,
        comments: str = "",
    ) -> Dict[str, Any]:
        """Approve content."""
        if self.config.require_reply_all and approver_email not in self.config.required_approvers:
            # Check if approver is authorized
            if self.config.required_approvers:
                return {
                    "status": "denied",
                    "reason": f"{approver_email} is not in the required approvers list",
                }

        content.approval_status = ApprovalStatus.APPROVED
        self._approval_history.append({
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "action": "approve",
            "approver": approver_email,
            "content_title": content.title,
            "comments": comments,
        })

        return {
            "status": "approved",
            "approver": approver_email,
            "content_title": content.title,
            "comments": comments,
        }

    def reject(
        self,
        content: ContentPiece,
        rejector_email: str,
        reason: str,
    ) -> Dict[str, Any]:
        """Reject content with required reason."""
        if self.config.rejection_requires_reason and not reason:
            return {
                "status": "error",
                "reason": "Rejection requires a reason per workflow policy",
            }

        content.approval_status = ApprovalStatus.REJECTED
        self._approval_history.append({
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "action": "reject",
            "rejector": rejector_email,
            "content_title": content.title,
            "reason": reason,
        })

        return {
            "status": "rejected",
            "rejector": rejector_email,
            "content_title": content.title,
            "reason": reason,
        }

    def _generate_reply_all_message(
        self,
        content: ContentPiece,
        submitter: str,
        recipients: Set[str],
    ) -> str:
        """Generate reply-all notification message."""
        return (
            f"📋 CONTENT APPROVAL REQUEST\n\n"
            f"From: {submitter}\n"
            f"To: {', '.join(sorted(recipients))}\n"
            f"Subject: Approval Required - {content.title}\n"
            f"Content Type: {content.content_type.value}\n"
            f"Word Count: {content.word_count}\n"
            f"Quality Score: {content.quality_score.overall if content.quality_score else 'N/A'}\n\n"
            f"Please review and approve/reply with feedback.\n"
            f"⚠️ REPLY-ALL is required to ensure all stakeholders are informed.\n\n"
            f"Escalation timeout: {self.config.escalation_timeout_hours} hours\n"
        )

    def get_history(self) -> List[Dict[str, Any]]:
        """Get approval workflow history."""
        return self._approval_history.copy()


# =============================================================================
# MAIN ORCHESTRATOR
# =============================================================================

class ContentRepurposer:
    """
    Main orchestrator class that ties all components together.
    Transforms email threads into multiple content formats with quality
    assurance, PII redaction, and approval workflows.
    """

    def __init__(self, config: ContentRepurposerConfig):
        self.config = config
        self.pii_redactor = PIIRedactor(config.pii_config)
        self.brand_checker = BrandVoiceChecker(config.brand_voice)
        self.quality_scorer = ContentQualityScorer(self.brand_checker)
        self.exporter = ContentExporter()
        self.approval_manager = ApprovalWorkflowManager(config.approval_workflow)

        # Generators
        self.blog_generator = BlogPostGenerator()
        self.social_generator = SocialMediaGenerator()
        self.faq_generator = FAQGenerator()
        self.case_study_generator = CaseStudyGenerator()
        self.training_generator = TrainingMaterialGenerator()
        self.newsletter_generator = NewsletterGenerator()

        self._generated_content: List[ContentPiece] = []

    def repurpose(
        self,
        thread: EmailThread,
        target_types: Optional[List[ContentType]] = None,
    ) -> List[ContentPiece]:
        """
        Transform an email thread into multiple content pieces.

        Args:
            thread: The email thread to repurpose
            target_types: Specific content types to generate (default: all)

        Returns:
            List of generated ContentPiece objects
        """
        if target_types is None:
            target_types = list(ContentType)

        results = []

        # First, redact PII from the thread
        redacted_thread = self._redact_thread(thread)

        # Generate each requested content type
        generators = {
            ContentType.BLOG_POST: lambda: self.blog_generator.generate(
                redacted_thread, self.config.seo_config, self.config.brand_voice
            ),
            ContentType.LINKEDIN_POST: lambda: self.social_generator.generate_linkedin(
                redacted_thread, self.config.brand_voice
            ),
            ContentType.TWITTER_THREAD: lambda: self.social_generator.generate_twitter_thread(
                redacted_thread, self.config.brand_voice
            ),
            ContentType.INSTAGRAM_CAPTION: lambda: self.social_generator.generate_instagram(
                redacted_thread, self.config.brand_voice
            ),
            ContentType.FAQ_ENTRY: lambda: self.faq_generator.generate(redacted_thread),
            ContentType.CASE_STUDY: lambda: self.case_study_generator.generate(
                redacted_thread, self.config.seo_config
            ),
            ContentType.TRAINING_MATERIAL: lambda: self.training_generator.generate(redacted_thread),
            ContentType.NEWSLETTER_SEGMENT: lambda: self.newsletter_generator.generate(
                redacted_thread, self.config.brand_voice
            ),
        }

        for content_type in target_types:
            if content_type in generators:
                content = generators[content_type]()

                # Apply PII redaction flag
                content.pii_redacted = True

                # Run brand voice check
                if self.config.enable_brand_check:
                    brand_result = self.brand_checker.check(content.body)
                    content.brand_checked = True
                    content.metadata['brand_check'] = brand_result

                # Calculate quality score
                if self.config.enable_quality_scoring:
                    content.quality_score = self.quality_scorer.score(
                        content, self.config.seo_config
                    )

                results.append(content)

        self._generated_content.extend(results)
        return results

    def export_content(
        self,
        content: ContentPiece,
        format: ExportFormat = ExportFormat.MARKDOWN,
    ) -> str:
        """Export a content piece in the specified format."""
        return self.exporter.export(content, format)

    def export_all(
        self,
        format: ExportFormat = ExportFormat.MARKDOWN,
    ) -> Dict[str, str]:
        """Export all generated content."""
        exports = {}
        for content in self._generated_content:
            key = f"{content.content_type.value}_{content.title[:30]}"
            exports[key] = self.exporter.export(content, format)
        return exports

    def submit_for_approval(
        self,
        content: ContentPiece,
        submitter_email: str,
    ) -> Dict[str, Any]:
        """Submit content for approval with reply-all enforcement."""
        participants = content.metadata.get('participants', [])
        if not participants and self._generated_content:
            # Try to get from source thread metadata
            participants = content.metadata.get('source_thread_participants', [])
        return self.approval_manager.submit_for_review(
            content, submitter_email, participants
        )

    def _redact_thread(self, thread: EmailThread) -> EmailThread:
        """Create a PII-redacted copy of the thread."""
        if not self.config.enable_pii_redaction:
            return thread

        redacted_messages = []
        for msg in thread.messages:
            result = self.pii_redactor.redact(msg.body)
            redacted_msg = EmailMessage(
                sender=msg.sender,
                sender_email=msg.sender_email,
                recipients=msg.recipients,
                subject=msg.subject,
                body=result.redacted_text,
                timestamp=msg.timestamp,
                cc_list=msg.cc_list,
                bcc_list=msg.bcc_list,
                attachments=msg.attachments,
                reply_to=msg.reply_to,
                message_id=msg.message_id,
            )
            redacted_messages.append(redacted_msg)

        return EmailThread(
            messages=redacted_messages,
            thread_id=thread.thread_id,
            labels=thread.labels,
            priority=thread.priority,
        )

    def get_summary(self) -> Dict[str, Any]:
        """Get a summary of all generated content."""
        summary = {
            "total_pieces": len(self._generated_content),
            "by_type": {},
            "avg_quality_score": 0.0,
            "pii_redacted_count": 0,
            "brand_checked_count": 0,
            "approval_statuses": {},
        }

        scores = []
        for content in self._generated_content:
            type_key = content.content_type.value
            summary["by_type"][type_key] = summary["by_type"].get(type_key, 0) + 1

            if content.quality_score:
                scores.append(content.quality_score.overall)
            if content.pii_redacted:
                summary["pii_redacted_count"] += 1
            if content.brand_checked:
                summary["brand_checked_count"] += 1

            status = content.approval_status.value
            summary["approval_statuses"][status] = summary["approval_statuses"].get(status, 0) + 1

        if scores:
            summary["avg_quality_score"] = round(statistics.mean(scores), 1)

        return summary


# =============================================================================
# TEST SCENARIOS
# =============================================================================

def create_sample_thread_1() -> EmailThread:
    """Test Scenario 1: Product Launch Discussion."""
    return EmailThread(messages=[
        EmailMessage(
            sender="Sarah Chen",
            sender_email="sarah.chen@techcorp.com",
            recipients=["team@techcorp.com", "marketing@techcorp.com"],
            subject="Q3 Product Launch Strategy",
            body=(
                "Hi team,\n\n"
                "We need to finalize our Q3 product launch strategy for the new "
                "AI-powered analytics platform. Our target launch date is September 15th.\n\n"
                "Key concerns:\n"
                "1. The beta testing phase needs at least 4 weeks\n"
                "2. Marketing materials are not yet finalized\n"
                "3. Customer support team needs training on the new features\n\n"
                "Please review the attached timeline and share your feedback by Friday.\n\n"
                "Contact me at sarah.chen@techcorp.com or call 555-0123 if urgent.\n\n"
                "Best regards,\nSarah"
            ),
            timestamp=datetime(2026, 7, 15, 9, 30, tzinfo=timezone.utc),
        ),
        EmailMessage(
            sender="Mike Rodriguez",
            sender_email="mike.r@techcorp.com",
            recipients=["team@techcorp.com"],
            subject="Re: Q3 Product Launch Strategy",
            body=(
                "Hi Sarah,\n\n"
                "Great initiative. Here's my analysis of the timeline:\n\n"
                "For the beta testing, I suggest we start with 50 enterprise customers "
                "from our existing client base. This gives us quality feedback while "
                "keeping the scope manageable.\n\n"
                "I propose a phased approach:\n"
                "- Week 1-2: Internal testing with the engineering team\n"
                "- Week 3-4: Closed beta with selected customers\n"
                "- Week 5-6: Open beta with all interested customers\n"
                "- Week 7-8: Final fixes and launch preparation\n\n"
                "This approach reduces risk by 40% based on our previous launches.\n\n"
                "Mike Rodriguez | VP Engineering | 555-0456"
            ),
            timestamp=datetime(2026, 7, 15, 11, 15, tzinfo=timezone.utc),
        ),
        EmailMessage(
            sender="Lisa Park",
            sender_email="lisa.park@techcorp.com",
            recipients=["team@techcorp.com", "marketing@techcorp.com"],
            subject="Re: Q3 Product Launch Strategy",
            body=(
                "Hello everyone,\n\n"
                "From the marketing perspective, here's what we've prepared:\n\n"
                "Our campaign focuses on three key value propositions:\n"
                "1. Real-time analytics that reduce decision-making time by 60%\n"
                "2. AI-powered predictions with 95% accuracy\n"
                "3. Seamless integration with existing enterprise tools\n\n"
                "We've allocated $250K for the launch campaign across digital channels. "
                "The content calendar is ready and includes blog posts, webinars, and "
                "social media campaigns.\n\n"
                "The only blocker is that we need final product screenshots by August 1st. "
                "Can engineering provide those?\n\n"
                "Best,\nLisa Park\nMarketing Director\nlisa.park@techcorp.com"
            ),
            timestamp=datetime(2026, 7, 15, 14, 0, tzinfo=timezone.utc),
        ),
        EmailMessage(
            sender="David Kim",
            sender_email="david.kim@techcorp.com",
            recipients=["team@techcorp.com"],
            subject="Re: Q3 Product Launch Strategy",
            body=(
                "Team,\n\n"
                "The support training is on track. We've developed a comprehensive "
                "training program that includes:\n\n"
                "- 4-hour hands-on workshop for Tier 1 support\n"
                "- Self-paced online modules for Tier 2\n"
                "- Advanced troubleshooting guide for Tier 3\n\n"
                "We tested the training materials with a pilot group and achieved "
                "a 92% satisfaction rate. The team will be fully prepared by launch date.\n\n"
                "One suggestion: we should create a dedicated Slack channel for "
                "launch-day support coordination.\n\n"
                "Thanks,\nDavid Kim | Head of Customer Success"
            ),
            timestamp=datetime(2026, 7, 16, 8, 45, tzinfo=timezone.utc),
        ),
    ])


def create_sample_thread_2() -> EmailThread:
    """Test Scenario 2: Security Incident Response."""
    return EmailThread(messages=[
        EmailMessage(
            sender="Alex Thompson",
            sender_email="alex.t@securecorp.io",
            recipients=["security@securecorp.io", "exec@securecorp.io"],
            subject="URGENT: Potential Data Breach Detected",
            body=(
                "Security team,\n\n"
                "We've detected unusual network activity originating from our "
                "customer database server (IP: 192.168.1.100). Initial analysis "
                "suggests a potential SQL injection attack.\n\n"
                "Immediate actions taken:\n"
                "- Isolated the affected server from the network\n"
                "- Rotated all database credentials\n"
                "- Enabled enhanced logging on all systems\n\n"
                "Customer records potentially affected: approximately 5,000 accounts. "
                "We need to determine if any PII was exfiltrated.\n\n"
                "My direct line: 555-0789. Available 24/7 for this incident.\n\n"
                "Alex Thompson\nCISO | SecureCorp"
            ),
            timestamp=datetime(2026, 8, 1, 3, 15, tzinfo=timezone.utc),
        ),
        EmailMessage(
            sender="Jennifer Wu",
            sender_email="jen.wu@securecorp.io",
            recipients=["security@securecorp.io", "exec@securecorp.io"],
            subject="Re: URGENT: Potential Data Breach Detected",
            body=(
                "Alex,\n\n"
                "Forensic analysis complete. Here are the findings:\n\n"
                "The attack vector was a SQL injection through our legacy API endpoint "
                "(/api/v1/users). The attacker exploited a known vulnerability that was "
                "scheduled for patching next week.\n\n"
                "Good news: No customer PII was exfiltrated. The attack was caught by "
                "our IDS before any data left the network. However, the attacker did "
                "gain read access to the user table for approximately 47 minutes.\n\n"
                "Recommendations:\n"
                "1. Immediately decommission the legacy API endpoint\n"
                "2. Accelerate the vulnerability patching schedule\n"
                "3. Implement WAF rules for SQL injection patterns\n"
                "4. Conduct a full penetration test within 30 days\n\n"
                "Jennifer Wu\nLead Security Engineer"
            ),
            timestamp=datetime(2026, 8, 1, 5, 30, tzinfo=timezone.utc),
        ),
        EmailMessage(
            sender="Robert Martinez",
            sender_email="rob.martinez@securecorp.io",
            recipients=["security@securecorp.io", "legal@securecorp.io"],
            subject="Re: URGENT: Potential Data Breach Detected",
            body=(
                "Team,\n\n"
                "From a compliance perspective, since no PII was exfiltrated, we are "
                "not required to notify customers under GDPR or CCPA. However, I "
                "recommend we:\n\n"
                "1. Document the incident thoroughly for our SOC 2 audit\n"
                "2. File an internal incident report within 24 hours\n"
                "3. Schedule a post-mortem within 5 business days\n"
                "4. Update our incident response playbook with lessons learned\n\n"
                "This incident actually demonstrates that our detection systems are "
                "working effectively. The 47-minute detection-to-containment time "
                "is within our SLA.\n\n"
                "Robert Martinez\nCompliance Officer | DOB: 03/15/1985 on file"
            ),
            timestamp=datetime(2026, 8, 1, 8, 0, tzinfo=timezone.utc),
        ),
    ])


def create_sample_thread_3() -> EmailThread:
    """Test Scenario 3: Onboarding Process Improvement."""
    return EmailThread(messages=[
        EmailMessage(
            sender="Emma Watson",
            sender_email="emma.w@growthco.com",
            recipients=["hr@growthco.com"],
            subject="Improving Our Employee Onboarding Process",
            body=(
                "Hi HR team,\n\n"
                "After reviewing feedback from our last 20 new hires, I've identified "
                "several areas where our onboarding process can be improved.\n\n"
                "Key feedback themes:\n"
                "- New hires feel overwhelmed in the first week\n"
                "- Documentation is scattered across multiple systems\n"
                "- The buddy system is inconsistent across departments\n"
                "- IT setup takes too long (average 3 days for full access)\n\n"
                "I propose we implement a structured 30-60-90 day onboarding framework "
                "with clear milestones and check-ins.\n\n"
                "Emma Watson\nPeople Operations Manager"
            ),
            timestamp=datetime(2026, 6, 10, 10, 0, tzinfo=timezone.utc),
        ),
        EmailMessage(
            sender="James Lee",
            sender_email="james.lee@growthco.com",
            recipients=["hr@growthco.com"],
            subject="Re: Improving Our Employee Onboarding Process",
            body=(
                "Emma,\n\n"
                "Love this initiative! Here's what I've seen work well at other companies:\n\n"
                "Step 1: Pre-boarding (before Day 1)\n"
                "Send welcome package with company swag, handbook, and IT credentials.\n\n"
                "Step 2: First Week - Orientation Sprint\n"
                "Structured schedule with team introductions, tool training, and "
                "a small 'first project' to build confidence.\n\n"
                "Step 3: 30-Day Check-in\n"
                "Formal review with manager and HR to assess integration progress.\n\n"
                "Step 4: 60-Day Skill Building\n"
                "Assign a mentor outside their direct team for broader perspective.\n\n"
                "Step 5: 90-Day Review\n"
                "Full performance review and goal-setting for the next quarter.\n\n"
                "This approach reduced time-to-productivity by 35% at my previous company.\n\n"
                "James Lee\nDirector of Engineering"
            ),
            timestamp=datetime(2026, 6, 10, 14, 30, tzinfo=timezone.utc),
        ),
    ])


def create_sample_thread_4() -> EmailThread:
    """Test Scenario 4: Client Success Story."""
    return EmailThread(messages=[
        EmailMessage(
            sender="Patricia Nguyen",
            sender_email="patricia.n@consulting.com",
            recipients=["clients@consulting.com"],
            subject="Acme Corp - Digital Transformation Results",
            body=(
                "Team,\n\n"
                "Exciting update on the Acme Corp engagement! We've completed the "
                "6-month digital transformation project and the results are outstanding.\n\n"
                "Key achievements:\n"
                "- Reduced operational costs by 42%\n"
                "- Improved customer satisfaction scores from 3.2 to 4.7 out of 5\n"
                "- Automated 78% of manual processes\n"
                "- Reduced time-to-market for new products from 6 months to 8 weeks\n\n"
                "The client is so happy they've signed a Phase 2 contract worth $2.5M. "
                "This is a great case study opportunity.\n\n"
                "Patricia Nguyen\nSenior Engagement Manager"
            ),
            timestamp=datetime(2026, 9, 1, 9, 0, tzinfo=timezone.utc),
        ),
        EmailMessage(
            sender="Tom Bradley",
            sender_email="tom.b@consulting.com",
            recipients=["clients@consulting.com"],
            subject="Re: Acme Corp - Digital Transformation Results",
            body=(
                "Patricia,\n\n"
                "Fantastic results! A few additional details for the case study:\n\n"
                "The biggest challenge was migrating their legacy ERP system without "
                "disrupting daily operations. We solved this by implementing a parallel "
                "run strategy where both systems operated simultaneously for 8 weeks.\n\n"
                "The technical solution involved:\n"
                "- Custom API integrations between old and new systems\n"
                "- Real-time data synchronization with conflict resolution\n"
                "- Gradual user migration with comprehensive training\n"
                "- 24/7 support hotline during the transition period\n\n"
                "The CEO of Acme Corp, John Smith (john.smith@acmecorp.com, 555-9999), "
                "has agreed to be a reference customer and participate in a video testimonial.\n\n"
                "Tom Bradley\nTechnical Director"
            ),
            timestamp=datetime(2026, 9, 1, 11, 30, tzinfo=timezone.utc),
        ),
    ])


# =============================================================================
# DEMO / MAIN
# =============================================================================

def run_demo():
    """Run the complete demo with all test scenarios."""
    print("=" * 80)
    print("  V138 AI EMAIL-TO-CONTENT REPURPOSER — Demo")
    print("=" * 80)
    print()

    # Configure the repurposer
    brand_voice = BrandVoiceProfile(
        brand_name="V138 Systems",
        preferred_tones=[VoiceTone.PROFESSIONAL, VoiceTone.AUTHORITATIVE],
        banned_words=["synergy", "paradigm shift", "disrupt", "game-changer"],
        preferred_words=["innovative", "reliable", "scalable", "efficient"],
        max_sentence_length=30,
        preferred_reading_level=8,
        personality_traits=["expert", "approachable", "data-driven"],
        avoid_jargon=True,
        use_emojis=False,
        formality_level=0.6,
    )

    seo_config = SEOConfig(
        target_keywords=["digital transformation", "product launch", "best practices"],
        meta_description_length=155,
        title_length=60,
        keyword_density_target=0.025,
        include_internal_links=True,
        include_alt_text=True,
        header_structure=True,
        min_word_count=300,
    )

    pii_config = PIIRedactionConfig(
        enabled=True,
        categories_to_redact=[
            PIICategory.EMAIL,
            PIICategory.PHONE,
            PIICategory.IP_ADDRESS,
            PIICategory.SSN,
            PIICategory.CREDIT_CARD,
            PIICategory.DATE_OF_BIRTH,
            PIICategory.BANK_ACCOUNT,
        ],
        replacement_text="[REDACTED]",
        log_redactions=True,
    )

    approval_config = ApprovalWorkflow(
        require_reply_all=True,
        required_approvers=["editor@v138.com", "legal@v138.com"],
        min_approvals=1,
        auto_approve_threshold=90.0,
        rejection_requires_reason=True,
        notification_emails=["content-team@v138.com"],
        escalation_timeout_hours=48,
    )

    config = ContentRepurposerConfig(
        brand_voice=brand_voice,
        seo_config=seo_config,
        pii_config=pii_config,
        approval_workflow=approval_config,
        default_export_format=ExportFormat.MARKDOWN,
        enable_quality_scoring=True,
        enable_pii_redaction=True,
        enable_brand_check=True,
    )

    repurposer = ContentRepurposer(config)

    # =========================================================================
    # TEST SCENARIO 1: Product Launch Discussion
    # =========================================================================
    print("─" * 80)
    print("  TEST SCENARIO 1: Product Launch Discussion")
    print("─" * 80)

    thread1 = create_sample_thread_1()
    print(f"  Thread: {thread1.messages[0].subject}")
    print(f"  Participants: {', '.join(thread1.participants)}")
    print(f"  Messages: {len(thread1.messages)}")
    print(f"  Total Words: {thread1.word_count}")
    print()

    # Generate blog post and social media
    content1 = repurposer.repurpose(
        thread1,
        target_types=[ContentType.BLOG_POST, ContentType.LINKEDIN_POST, ContentType.TWITTER_THREAD],
    )

    for piece in content1:
        print(f"  ✓ Generated: {piece.content_type.value}")
        print(f"    Title: {piece.title}")
        print(f"    Words: {piece.word_count}")
        if piece.quality_score:
            qs = piece.quality_score
            print(f"    Quality Score: {qs.overall}/100")
            print(f"      Readability: {qs.readability} | Engagement: {qs.engagement}")
            print(f"      SEO: {qs.seo_score} | Brand: {qs.brand_consistency}")
        print()

    # Show PII redaction in action
    print("  PII Redaction Check (Thread 1):")
    raw_text = thread1.full_conversation
    pii_result = repurposer.pii_redactor.redact(raw_text)
    if pii_result.findings:
        for cat, match, pos in pii_result.findings[:5]:
            print(f"    Found {cat.value}: '{match}' at position {pos}")
        print(f"    Total redactions: {pii_result.total_redactions}")
    print()

    # =========================================================================
    # TEST SCENARIO 2: Security Incident Response
    # =========================================================================
    print("─" * 80)
    print("  TEST SCENARIO 2: Security Incident Response")
    print("─" * 80)

    thread2 = create_sample_thread_2()
    print(f"  Thread: {thread2.messages[0].subject}")
    print(f"  Participants: {', '.join(thread2.participants)}")
    print(f"  Messages: {len(thread2.messages)}")
    print()

    content2 = repurposer.repurpose(
        thread2,
        target_types=[ContentType.CASE_STUDY, ContentType.FAQ_ENTRY, ContentType.NEWSLETTER_SEGMENT],
    )

    for piece in content2:
        print(f"  ✓ Generated: {piece.content_type.value}")
        print(f"    Title: {piece.title}")
        print(f"    Words: {piece.word_count}")
        if piece.quality_score:
            print(f"    Quality Score: {piece.quality_score.overall}/100")
        if piece.pii_redacted:
            print(f"    PII Redacted: ✓")
        print()

    # Show PII redaction details for thread 2
    print("  PII Redaction Check (Thread 2):")
    raw_text2 = thread2.full_conversation
    pii_result2 = repurposer.pii_redactor.redact(raw_text2)
    if pii_result2.findings:
        for cat, match, pos in pii_result2.findings[:5]:
            print(f"    Found {cat.value}: '{match}' at position {pos}")
        print(f"    Total redactions: {pii_result2.total_redactions}")
    print()

    # =========================================================================
    # TEST SCENARIO 3: Onboarding Process
    # =========================================================================
    print("─" * 80)
    print("  TEST SCENARIO 3: Onboarding Process Improvement")
    print("─" * 80)

    thread3 = create_sample_thread_3()
    print(f"  Thread: {thread3.messages[0].subject}")
    print(f"  Participants: {', '.join(thread3.participants)}")
    print()

    content3 = repurposer.repurpose(
        thread3,
        target_types=[ContentType.TRAINING_MATERIAL, ContentType.INSTAGRAM_CAPTION],
    )

    for piece in content3:
        print(f"  ✓ Generated: {piece.content_type.value}")
        print(f"    Title: {piece.title}")
        print(f"    Words: {piece.word_count}")
        if piece.quality_score:
            print(f"    Quality Score: {piece.quality_score.overall}/100")
        if piece.hashtags:
            print(f"    Hashtags: {', '.join(piece.hashtags[:5])}...")
        print()

    # =========================================================================
    # TEST SCENARIO 4: Client Success Story
    # =========================================================================
    print("─" * 80)
    print("  TEST SCENARIO 4: Client Success Story")
    print("─" * 80)

    thread4 = create_sample_thread_4()
    print(f"  Thread: {thread4.messages[0].subject}")
    print(f"  Participants: {', '.join(thread4.participants)}")
    print()

    content4 = repurposer.repurpose(
        thread4,
        target_types=[ContentType.CASE_STUDY, ContentType.BLOG_POST, ContentType.NEWSLETTER_SEGMENT],
    )

    for piece in content4:
        print(f"  ✓ Generated: {piece.content_type.value}")
        print(f"    Title: {piece.title}")
        print(f"    Words: {piece.word_count}")
        if piece.quality_score:
            print(f"    Quality Score: {piece.quality_score.overall}/100")
        print()

    # Show PII redaction for thread 4
    print("  PII Redaction Check (Thread 4):")
    raw_text4 = thread4.full_conversation
    pii_result4 = repurposer.pii_redactor.redact(raw_text4)
    if pii_result4.findings:
        for cat, match, pos in pii_result4.findings[:5]:
            print(f"    Found {cat.value}: '{match}' at position {pos}")
        print(f"    Total redactions: {pii_result4.total_redactions}")
    print()

    # =========================================================================
    # APPROVAL WORKFLOW DEMO
    # =========================================================================
    print("─" * 80)
    print("  APPROVAL WORKFLOW DEMO (Reply-All Enforcement)")
    print("─" * 80)

    if content1:
        sample_content = content1[0]
        # Add participants to metadata
        sample_content.metadata['participants'] = list(thread1.participants)

        approval_result = repurposer.submit_for_approval(
            sample_content,
            submitter_email="sarah.chen@techcorp.com",
        )
        print(f"  Submission Status: {approval_result['status']}")
        print(f"  Auto-Approved: {approval_result.get('auto_approved', False)}")
        print(f"  Reply-All Required: {approval_result.get('reply_all_required', False)}")
        print(f"  Notifications Sent To: {', '.join(approval_result.get('notifications_sent', []))}")
        if approval_result.get('reply_all_message'):
            print(f"\n  Reply-All Message Preview:")
            for line in approval_result['reply_all_message'].split('\n')[:8]:
                print(f"    {line}")
        print()

        # Demo rejection
        reject_result = repurposer.approval_manager.reject(
            sample_content,
            rejector_email="editor@v138.com",
            reason="Needs more data points in the introduction section.",
        )
        print(f"  Rejection Result: {reject_result['status']}")
        print(f"  Reason: {reject_result['reason']}")
        print()

        # Demo re-approval
        re_approve = repurposer.approval_manager.approve(
            sample_content,
            approver_email="editor@v138.com",
            comments="Looks good after revisions.",
        )
        print(f"  Re-approval Result: {re_approve['status']}")
        print()

    # =========================================================================
    # EXPORT DEMO
    # =========================================================================
    print("─" * 80)
    print("  EXPORT FORMAT DEMO")
    print("─" * 80)

    if content1:
        sample = content1[0]

        # Markdown export (preview)
        md_export = repurposer.export_content(sample, ExportFormat.MARKDOWN)
        print(f"  Markdown Export ({len(md_export)} chars):")
        for line in md_export.split('\n')[:12]:
            print(f"    {line}")
        print("    ...")
        print()

        # HTML export (preview)
        html_export = repurposer.export_content(sample, ExportFormat.HTML)
        print(f"  HTML Export ({len(html_export)} chars):")
        for line in html_export.split('\n')[:8]:
            print(f"    {line}")
        print("    ...")
        print()

        # JSON export (preview)
        json_export = repurposer.export_content(sample, ExportFormat.JSON)
        print(f"  JSON Export ({len(json_export)} chars):")
        parsed = json.loads(json_export)
        print(f"    type: {parsed['content_type']}")
        print(f"    title: {parsed['title']}")
        print(f"    status: {parsed['approval_status']}")
        print(f"    word_count: {parsed['word_count']}")
        if 'quality_score' in parsed:
            print(f"    quality_score: {parsed['quality_score']}")
        print()

    # =========================================================================
    # BRAND VOICE CHECK DEMO
    # =========================================================================
    print("─" * 80)
    print("  BRAND VOICE CONSISTENCY CHECK")
    print("─" * 80)

    # Test with brand-compliant content
    good_content = (
        "Our innovative and reliable platform provides scalable solutions "
        "for efficient data management. We understand the challenges our clients face "
        "and support them with proven, leading-edge technology."
    )
    good_result = repurposer.brand_checker.check(good_content)
    print(f"  Brand-Compliant Content Score: {good_result['score']}/100")
    print(f"  Tone Matches: {', '.join(good_result['tone_matches'])}")
    if good_result['suggestions']:
        print(f"  Suggestions: {good_result['suggestions'][0]}")
    print()

    # Test with non-compliant content
    bad_content = (
        "Yo! This is gonna be a total game-changer and paradigm shift for synergy! "
        "We're gonna disrupt the whole ecosystem and boil the ocean with our "
        "mission-critical deep dive approach! It's gonna be awesome and cool!!!"
    )
    bad_result = repurposer.brand_checker.check(bad_content)
    print(f"  Non-Compliant Content Score: {bad_result['score']}/100")
    print(f"  Banned Words Found: {bad_result['banned_words_found']}")
    print(f"  Issues: {bad_result['issues'][:2]}")
    print(f"  Formality Score: {bad_result['formality_score']}")
    print()

    # =========================================================================
    # OVERALL SUMMARY
    # =========================================================================
    print("=" * 80)
    print("  OVERALL SUMMARY")
    print("=" * 80)

    summary = repurposer.get_summary()
    print(f"  Total Content Pieces Generated: {summary['total_pieces']}")
    print(f"  Average Quality Score: {summary['avg_quality_score']}/100")
    print(f"  PII Redacted: {summary['pii_redacted_count']} pieces")
    print(f"  Brand Checked: {summary['brand_checked_count']} pieces")
    print()
    print("  Content by Type:")
    for ctype, count in summary['by_type'].items():
        print(f"    {ctype}: {count}")
    print()
    print("  Approval Statuses:")
    for status, count in summary['approval_statuses'].items():
        print(f"    {status}: {count}")
    print()

    # Approval history
    history = repurposer.approval_manager.get_history()
    if history:
        print("  Approval History:")
        for entry in history:
            print(f"    [{entry['action']}] {entry['content_title'][:40]} by {entry.get('submitter', entry.get('approver', entry.get('rejector', 'N/A')))}")
    print()

    print("=" * 80)
    print("  V138 Content Repurposer Demo Complete")
    print("=" * 80)


if __name__ == "__main__":
    run_demo()
