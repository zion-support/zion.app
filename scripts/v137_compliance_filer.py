#!/usr/bin/env python3
"""
V137 AI Email Compliance Auto-Filer
====================================

Production-quality email compliance classification and retention management system.

Automatically classifies and files emails into regulatory-compliant retention categories:
  - FINRA: 7-year retention (financial industry)
  - HIPAA: 6-year retention (healthcare)
  - GDPR: Right-to-delete compliance
  - SOX: 7-year retention (corporate governance)
  - PCI-DSS: 1-year retention (payment card data)

Features:
  - Content-based auto-classification (financial terms, health info, cardholder data, PII)
  - Legal hold application preventing deletion of protected records
  - Compliance report generation per regulatory framework
  - Audit readiness with complete chain-of-custody tracking
  - Retention schedule enforcement with auto-purge of expired records
  - Cross-reference emails to cases/matters/projects
  - Reply-all enforcement for compliance-marked emails
"""

from __future__ import annotations

import hashlib
import json
import re
import uuid
from collections import defaultdict
from dataclasses import dataclass, field, asdict
from datetime import datetime, timedelta
from enum import Enum, auto
from typing import Optional, List, Dict, Set, Tuple, Any


# =============================================================================
# ENUMS
# =============================================================================

class ComplianceFramework(Enum):
    """Regulatory compliance frameworks supported."""
    FINRA = "FINRA"
    HIPAA = "HIPAA"
    GDPR = "GDPR"
    SOX = "SOX"
    PCI_DSS = "PCI-DSS"
    NONE = "NONE"


class RetentionPeriod(Enum):
    """Retention period categories mapped to frameworks."""
    ONE_YEAR = 1
    SIX_YEARS = 6
    SEVEN_YEARS = 7
    RIGHT_TO_DELETE = -1  # Special: GDPR deletion on request
    INDEFINITE = 0  # Legal hold overrides


class ClassificationConfidence(Enum):
    """Confidence levels for auto-classification."""
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"
    NONE = "NONE"


class EmailStatus(Enum):
    """Lifecycle status of a managed email."""
    ACTIVE = "ACTIVE"
    FILED = "FILED"
    UNDER_HOLD = "UNDER_HOLD"
    EXPIRED = "EXPIRED"
    PURGED = "PURGED"
    QUARANTINED = "QUARANTINED"


class HoldType(Enum):
    """Types of legal holds that can be applied."""
    LITIGATION = "LITIGATION"
    REGULATORY_INVESTIGATION = "REGULATORY_INVESTIGATION"
    INTERNAL_AUDIT = "INTERNAL_AUDIT"
    PRESERVATION_ORDER = "PRESERVATION_ORDER"


class ViolationSeverity(Enum):
    """Severity levels for compliance violations."""
    CRITICAL = "CRITICAL"
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"
    INFO = "INFO"


class ActionType(Enum):
    """Chain-of-custody action types."""
    RECEIVED = "RECEIVED"
    CLASSIFIED = "CLASSIFIED"
    FILED = "FILED"
    HOLD_APPLIED = "HOLD_APPLIED"
    HOLD_REMOVED = "HOLD_REMOVED"
    RETENTION_EXTENDED = "RETENTION_EXTENDED"
    PURGE_SCHEDULED = "PURGE_SCHEDULED"
    PURGED = "PURGED"
    ACCESSED = "ACCESSED"
    EXPORTED = "EXPORTED"
    QUARANTINED = "QUARANTINED"
    REPLY_ALL_ENFORCED = "REPLY_ALL_ENFORCED"
    CROSS_REFERENCED = "CROSS_REFERENCED"


# =============================================================================
# RETENTION CONFIGURATION
# =============================================================================

FRAMEWORK_RETENTION: Dict[ComplianceFramework, RetentionPeriod] = {
    ComplianceFramework.FINRA: RetentionPeriod.SEVEN_YEARS,
    ComplianceFramework.HIPAA: RetentionPeriod.SIX_YEARS,
    ComplianceFramework.GDPR: RetentionPeriod.RIGHT_TO_DELETE,
    ComplianceFramework.SOX: RetentionPeriod.SEVEN_YEARS,
    ComplianceFramework.PCI_DSS: RetentionPeriod.ONE_YEAR,
    ComplianceFramework.NONE: RetentionPeriod.ONE_YEAR,
}


# =============================================================================
# CONTENT CLASSIFICATION PATTERNS
# =============================================================================

CLASSIFICATION_PATTERNS: Dict[ComplianceFramework, List[str]] = {
    ComplianceFramework.FINRA: [
        r"\b(securities?\s+(exchange|trading|transaction))\b",
        r"\b(broker[-\s]?dealer|investment\s+advisor|registered\s+rep)\b",
        r"\b(FINRA|SEC\s+rule|series\s+[0-9]+)\b",
        r"\b(trade\s+confirmation|settlement\s+date|CUSIP|ISIN)\b",
        r"\b(portfolio\s+rebalanc|margin\s+call|short\s+sell)\b",
        r"\b(municipal\s+bond|treasury\s+bill|equity\s+offering)\b",
        r"\b(compliance\s+officer|supervisory\s+principal)\b",
        r"\b(AUM|assets?\s+under\s+management)\b",
    ],
    ComplianceFramework.HIPAA: [
        r"\b(patient\s+(record|data|information|history))\b",
        r"\b(PHI|protected\s+health\s+information)\b",
        r"\b(diagnosis|prescription|medical\s+record|treatment\s+plan)\b",
        r"\b(HIPAA|HITECH|covered\s+entity|business\s+associate)\b",
        r"\b(EHR|EMR|electronic\s+health\s+record)\b",
        r"\b(claim\s+denial|ICD[-\s]?10|CPT\s+code)\b",
        r"\b(health\s+plan|insurance\s+claim|benefits?\s+enrollment)\b",
        r"\b(lab\s+result|radiology\s+report|vital\s+signs)\b",
    ],
    ComplianceFramework.GDPR: [
        r"\b(data\s+subject|right\s+to\s+(erasure|access|portability))\b",
        r"\b(GDPR|data\s+protection\s+officer|DPO)\b",
        r"\b(personal\s+data|data\s+processing|consent\s+form)\b",
        r"\b(data\s+breach|privacy\s+impact\s+assessment)\b",
        r"\b(cross[-\s]?border\s+transfer|adequacy\s+decision)\b",
        r"\b(right\s+to\s+be\s+forgotten|data\s+minimization)\b",
        r"\b(legitimate\s+interest|lawful\s+basis)\b",
    ],
    ComplianceFramework.SOX: [
        r"\b(financial\s+statement|internal\s+control|audit\s+committee)\b",
        r"\b(SOX|Sarbanes[-\s]?Oxley|section\s+(302|404|906))\b",
        r"\b(material\s+weakness|significant\s+deficiency)\b",
        r"\b(revenue\s+recognition|earnings\s+management)\b",
        r"\b(CFO\s+certification|quarterly\s+filing|10[-\s]?[KQ])\b",
        r"\b(whistleblower|fraud\s+detection|embezzlement)\b",
        r"\b(external\s+auditor|independence\s+requirement)\b",
        r"\b(general\s+ledger|journal\s+entry|reconciliation)\b",
    ],
    ComplianceFramework.PCI_DSS: [
        r"\b(cardholder\s+data|card\s+number|credit\s+card)\b",
        r"\b(PCI[-\s]?DSS|payment\s+card\s+industry)\b",
        r"\b(CVV|CVC|card\s+verification|expiry\s+date)\b",
        r"\b(merchant\s+account|acquiring\s+bank|ISO)\b",
        r"\b(tokenization|encryption\s+key|HSM)\b",
        r"\b(PAN|primary\s+account\s+number)\b",
        r"\b(QSA|ASV\s+scan|ROC\s+report)\b",
        r"\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b",  # Card number pattern
    ],
}

PII_PATTERNS: List[str] = [
    r"\b\d{3}[-.]?\d{2}[-.]?\d{4}\b",  # SSN
    r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b",  # Email
    r"\b\d{3}[-.]?\d{3}[-.]?\d{4}\b",  # Phone
    r"\b\d{1,5}\s+[A-Za-z\s]+(?:St|Ave|Blvd|Dr|Rd|Ln|Ct)\b",  # Address
]

GDPR_DELETION_TRIGGERS: List[str] = [
    r"\b(please\s+delete|erase\s+my\s+data|right\s+to\s+erasure)\b",
    r"\b(remove\s+my\s+personal|withdraw\s+consent)\b",
    r"\b(data\s+deletion\s+request|forget\s+me)\b",
    r"\b(GDPR\s+article\s+17|right\s+to\s+be\s+forgotten)\b",
]


# =============================================================================
# DATACLASSES
# =============================================================================

@dataclass
class EmailAddress:
    """Represents an email address with display name."""
    address: str
    display_name: str = ""

    def __str__(self) -> str:
        if self.display_name:
            return f"{self.display_name} <{self.address}>"
        return self.address


@dataclass
class ChainOfCustodyEntry:
    """Single entry in the chain-of-custody log."""
    timestamp: datetime
    action: ActionType
    actor: str
    details: str
    evidence_hash: str = ""

    def to_dict(self) -> Dict[str, Any]:
        return {
            "timestamp": self.timestamp.isoformat(),
            "action": self.action.value,
            "actor": self.actor,
            "details": self.details,
            "evidence_hash": self.evidence_hash,
        }


@dataclass
class LegalHold:
    """Legal hold applied to an email or set of emails."""
    hold_id: str = field(default_factory=lambda: str(uuid.uuid4())[:8])
    hold_type: HoldType = HoldType.LITIGATION
    reason: str = ""
    applied_by: str = ""
    applied_at: datetime = field(default_factory=datetime.utcnow)
    expires_at: Optional[datetime] = None
    case_matter_ref: str = ""
    is_active: bool = True

    def to_dict(self) -> Dict[str, Any]:
        return {
            "hold_id": self.hold_id,
            "hold_type": self.hold_type.value,
            "reason": self.reason,
            "applied_by": self.applied_by,
            "applied_at": self.applied_at.isoformat(),
            "expires_at": self.expires_at.isoformat() if self.expires_at else None,
            "case_matter_ref": self.case_matter_ref,
            "is_active": self.is_active,
        }


@dataclass
class ComplianceViolation:
    """Record of a compliance violation detected."""
    violation_id: str = field(default_factory=lambda: str(uuid.uuid4())[:8])
    severity: ViolationSeverity = ViolationSeverity.MEDIUM
    framework: ComplianceFramework = ComplianceFramework.NONE
    description: str = ""
    detected_at: datetime = field(default_factory=datetime.utcnow)
    email_id: str = ""
    remediation_required: str = ""
    resolved: bool = False
    resolved_at: Optional[datetime] = None

    def to_dict(self) -> Dict[str, Any]:
        return {
            "violation_id": self.violation_id,
            "severity": self.severity.value,
            "framework": self.framework.value,
            "description": self.description,
            "detected_at": self.detected_at.isoformat(),
            "email_id": self.email_id,
            "remediation_required": self.remediation_required,
            "resolved": self.resolved,
            "resolved_at": self.resolved_at.isoformat() if self.resolved_at else None,
        }


@dataclass
class CrossReference:
    """Cross-reference linking an email to a case, matter, or project."""
    ref_id: str = field(default_factory=lambda: str(uuid.uuid4())[:8])
    ref_type: str = ""  # "case", "matter", "project"
    ref_number: str = ""
    description: str = ""
    linked_at: datetime = field(default_factory=datetime.utcnow)
    linked_by: str = ""

    def to_dict(self) -> Dict[str, Any]:
        return {
            "ref_id": self.ref_id,
            "ref_type": self.ref_type,
            "ref_number": self.ref_number,
            "description": self.description,
            "linked_at": self.linked_at.isoformat(),
            "linked_by": self.linked_by,
        }


@dataclass
class ManagedEmail:
    """An email record managed by the compliance system."""
    email_id: str = field(default_factory=lambda: str(uuid.uuid4())[:12])
    message_id: str = ""
    subject: str = ""
    sender: Optional[EmailAddress] = None
    recipients_to: List[EmailAddress] = field(default_factory=list)
    recipients_cc: List[EmailAddress] = field(default_factory=list)
    recipients_bcc: List[EmailAddress] = field(default_factory=list)
    date_received: datetime = field(default_factory=datetime.utcnow)
    body: str = ""
    attachments: List[str] = field(default_factory=list)
    headers: Dict[str, str] = field(default_factory=dict)

    # Compliance metadata
    classification: ComplianceFramework = ComplianceFramework.NONE
    confidence: ClassificationConfidence = ClassificationConfidence.NONE
    status: EmailStatus = EmailStatus.ACTIVE
    retention_period: RetentionPeriod = RetentionPeriod.ONE_YEAR
    retention_expiry: Optional[datetime] = None
    content_hash: str = ""

    # Compliance features
    legal_holds: List[LegalHold] = field(default_factory=list)
    violations: List[ComplianceViolation] = field(default_factory=list)
    cross_references: List[CrossReference] = field(default_factory=list)
    chain_of_custody: List[ChainOfCustodyEntry] = field(default_factory=list)

    # Reply-all enforcement
    required_recipients: Set[str] = field(default_factory=set)
    reply_all_compliant: bool = True

    # GDPR deletion request tracking
    gdpr_deletion_requested: bool = False
    gdpr_deletion_request_date: Optional[datetime] = None

    # Classification details
    detected_patterns: List[str] = field(default_factory=list)
    contains_pii: bool = False
    pii_types_found: List[str] = field(default_factory=list)

    def compute_content_hash(self) -> str:
        """Compute SHA-256 hash of email content for integrity verification."""
        content = f"{self.subject}|{self.body}|{self.sender}|{self.date_received.isoformat()}"
        self.content_hash = hashlib.sha256(content.encode()).hexdigest()
        return self.content_hash

    def is_under_hold(self) -> bool:
        """Check if this email has any active legal holds."""
        return any(h.is_active for h in self.legal_holds)

    def can_purge(self) -> bool:
        """Check if this email is eligible for purging."""
        if self.is_under_hold():
            return False
        if self.gdpr_deletion_requested:
            return True  # GDPR deletion takes priority
        if self.retention_expiry and datetime.utcnow() > self.retention_expiry:
            return True
        return False

    def to_dict(self) -> Dict[str, Any]:
        return {
            "email_id": self.email_id,
            "message_id": self.message_id,
            "subject": self.subject,
            "sender": str(self.sender) if self.sender else None,
            "recipients_to": [str(r) for r in self.recipients_to],
            "recipients_cc": [str(r) for r in self.recipients_cc],
            "date_received": self.date_received.isoformat(),
            "classification": self.classification.value,
            "confidence": self.confidence.value,
            "status": self.status.value,
            "retention_period": self.retention_period.name,
            "retention_expiry": self.retention_expiry.isoformat() if self.retention_expiry else None,
            "content_hash": self.content_hash,
            "legal_holds": [h.to_dict() for h in self.legal_holds],
            "violations": [v.to_dict() for v in self.violations],
            "cross_references": [cr.to_dict() for cr in self.cross_references],
            "chain_of_custody_count": len(self.chain_of_custody),
            "required_recipients": list(self.required_recipients),
            "reply_all_compliant": self.reply_all_compliant,
            "gdpr_deletion_requested": self.gdpr_deletion_requested,
            "contains_pii": self.contains_pii,
            "pii_types_found": self.pii_types_found,
        }


@dataclass
class ComplianceReport:
    """Compliance report for a specific framework."""
    framework: ComplianceFramework
    generated_at: datetime = field(default_factory=datetime.utcnow)
    total_emails: int = 0
    active_emails: int = 0
    held_emails: int = 0
    expired_emails: int = 0
    purged_emails: int = 0
    violations_count: int = 0
    unresolved_violations: int = 0
    deletion_requests: int = 0
    average_confidence: str = ""
    cross_references_count: int = 0
    retention_summary: Dict[str, int] = field(default_factory=dict)
    violations_detail: List[Dict[str, Any]] = field(default_factory=list)

    def to_dict(self) -> Dict[str, Any]:
        return {
            "framework": self.framework.value,
            "generated_at": self.generated_at.isoformat(),
            "total_emails": self.total_emails,
            "active_emails": self.active_emails,
            "held_emails": self.held_emails,
            "expired_emails": self.expired_emails,
            "purged_emails": self.purged_emails,
            "violations_count": self.violations_count,
            "unresolved_violations": self.unresolved_violations,
            "deletion_requests": self.deletion_requests,
            "average_confidence": self.average_confidence,
            "cross_references_count": self.cross_references_count,
            "retention_summary": self.retention_summary,
            "violations_detail": self.violations_detail,
        }


@dataclass
class ReplyAllEnforcementResult:
    """Result of reply-all compliance check."""
    email_id: str
    compliant: bool
    missing_recipients: List[str] = field(default_factory=list)
    extra_recipients: List[str] = field(default_factory=list)
    action_taken: str = ""

    def to_dict(self) -> Dict[str, Any]:
        return {
            "email_id": self.email_id,
            "compliant": self.compliant,
            "missing_recipients": self.missing_recipients,
            "extra_recipients": self.extra_recipients,
            "action_taken": self.action_taken,
        }


# =============================================================================
# MAIN COMPLIANCE ENGINE
# =============================================================================

class ComplianceAutoFiler:
    """
    V137 AI Email Compliance Auto-Filer Engine.

    Manages email classification, retention, legal holds, and compliance
    reporting across multiple regulatory frameworks.
    """

    def __init__(self, organization: str = "Default Org", admin: str = "system"):
        self.organization = organization
        self.admin = admin
        self.emails: Dict[str, ManagedEmail] = {}
        self.holds: Dict[str, LegalHold] = {}
        self.violations: List[ComplianceViolation] = []
        self.case_registry: Dict[str, List[str]] = defaultdict(list)  # case_ref -> email_ids
        self._gdpr_deletion_queue: List[str] = []
        self._purge_log: List[Dict[str, Any]] = []
        self._stats = {
            "emails_processed": 0,
            "classifications_made": 0,
            "holds_applied": 0,
            "holds_removed": 0,
            "emails_purged": 0,
            "violations_detected": 0,
            "reply_all_checks": 0,
        }

    # =========================================================================
    # EMAIL INGESTION AND CLASSIFICATION
    # =========================================================================

    def ingest_email(
        self,
        subject: str,
        sender: EmailAddress,
        recipients_to: List[EmailAddress],
        body: str,
        recipients_cc: Optional[List[EmailAddress]] = None,
        recipients_bcc: Optional[List[EmailAddress]] = None,
        attachments: Optional[List[str]] = None,
        date_received: Optional[datetime] = None,
        message_id: Optional[str] = None,
        headers: Optional[Dict[str, str]] = None,
    ) -> ManagedEmail:
        """Ingest a new email into the compliance management system."""
        email = ManagedEmail(
            message_id=message_id or f"<{uuid.uuid4()}@{self.organization}>",
            subject=subject,
            sender=sender,
            recipients_to=recipients_to,
            recipients_cc=recipients_cc or [],
            recipients_bcc=recipients_bcc or [],
            date_received=date_received or datetime.utcnow(),
            body=body,
            attachments=attachments or [],
            headers=headers or {},
        )

        # Compute content hash for integrity
        email.compute_content_hash()

        # Log receipt
        self._log_custody(email, ActionType.RECEIVED, f"Email ingested from {sender}")

        # Auto-classify
        self._classify_email(email)

        # Check for PII
        self._detect_pii(email)

        # Check for GDPR deletion requests
        self._check_gdpr_deletion_request(email)

        # Set retention schedule
        self._set_retention_schedule(email)

        # Store email
        self.emails[email.email_id] = email
        email.status = EmailStatus.FILED

        self._log_custody(email, ActionType.CLASSIFIED,
                          f"Classified as {email.classification.value} "
                          f"(confidence: {email.confidence.value})")
        self._log_custody(email, ActionType.FILED,
                          f"Filed under {email.retention_period.name} retention")

        self._stats["emails_processed"] += 1
        self._stats["classifications_made"] += 1

        return email

    def _classify_email(self, email: ManagedEmail) -> None:
        """Automatically classify email based on content analysis."""
        content = f"{email.subject} {email.body}".lower()
        scores: Dict[ComplianceFramework, int] = defaultdict(int)
        detected: List[str] = []

        for framework, patterns in CLASSIFICATION_PATTERNS.items():
            if framework == ComplianceFramework.NONE:
                continue
            for pattern in patterns:
                matches = re.findall(pattern, content, re.IGNORECASE)
                if matches:
                    scores[framework] += len(matches)
                    detected.append(f"{framework.value}: {pattern}")

        if not scores:
            email.classification = ComplianceFramework.NONE
            email.confidence = ClassificationConfidence.NONE
            return

        # Determine primary classification (highest score)
        primary = max(scores, key=scores.get)
        max_score = scores[primary]

        # Multi-framework detection: if multiple frameworks score > 0, flag it
        active_frameworks = [fw for fw, score in scores.items() if score > 0]
        if len(active_frameworks) > 1:
            # Use the strictest retention period
            retention_days = {
                fw: FRAMEWORK_RETENTION[fw].value * 365
                for fw in active_frameworks
                if FRAMEWORK_RETENTION[fw].value > 0
            }
            if retention_days:
                primary = max(
                    retention_days,
                    key=lambda fw: retention_days[fw]
                )
                max_score = scores[primary]

        email.classification = primary
        email.detected_patterns = detected

        # Set confidence based on match count
        if max_score >= 3:
            email.confidence = ClassificationConfidence.HIGH
        elif max_score >= 2:
            email.confidence = ClassificationConfidence.MEDIUM
        else:
            email.confidence = ClassificationConfidence.LOW

    def _detect_pii(self, email: ManagedEmail) -> None:
        """Detect personally identifiable information in email content."""
        content = f"{email.subject} {email.body}"
        pii_found = []

        pii_labels = {
            r"\b\d{3}[-.]?\d{2}[-.]?\d{4}\b": "SSN",
            r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b": "EMAIL",
            r"\b\d{3}[-.]?\d{3}[-.]?\d{4}\b": "PHONE",
            r"\b\d{1,5}\s+[A-Za-z\s]+(?:St|Ave|Blvd|Dr|Rd|Ln|Ct)\b": "ADDRESS",
        }

        for pattern, label in pii_labels.items():
            if re.search(pattern, content):
                pii_found.append(label)

        if pii_found:
            email.contains_pii = True
            email.pii_types_found = list(set(pii_found))

    def _check_gdpr_deletion_request(self, email: ManagedEmail) -> None:
        """Check if the email contains a GDPR data deletion request."""
        content = f"{email.subject} {email.body}".lower()
        for pattern in GDPR_DELETION_TRIGGERS:
            if re.search(pattern, content, re.IGNORECASE):
                email.gdpr_deletion_requested = True
                email.gdpr_deletion_request_date = datetime.utcnow()
                self._gdpr_deletion_queue.append(email.email_id)
                self._add_violation(
                    email,
                    ViolationSeverity.HIGH,
                    ComplianceFramework.GDPR,
                    "GDPR deletion request detected - requires action within 30 days",
                    "Process deletion request within regulatory timeframe",
                )
                break

    def _set_retention_schedule(self, email: ManagedEmail) -> None:
        """Set the retention schedule based on classification."""
        retention = FRAMEWORK_RETENTION.get(email.classification, RetentionPeriod.ONE_YEAR)
        email.retention_period = retention

        if retention.value > 0:
            years = retention.value
            email.retention_expiry = email.date_received + timedelta(days=years * 365)
            self._log_custody(
                email,
                ActionType.RETENTION_EXTENDED,
                f"Retention set: {years} years (expires {email.retention_expiry.isoformat()})",
            )
        elif retention == RetentionPeriod.RIGHT_TO_DELETE:
            email.retention_expiry = None
            self._log_custody(
                email,
                ActionType.RETENTION_EXTENDED,
                "GDPR: Subject to right-to-delete - no fixed retention",
            )

    # =========================================================================
    # LEGAL HOLDS
    # =========================================================================

    def apply_legal_hold(
        self,
        email_id: str,
        hold_type: HoldType,
        reason: str,
        case_matter_ref: str = "",
        expires_days: Optional[int] = None,
        applied_by: Optional[str] = None,
    ) -> LegalHold:
        """Apply a legal hold to an email preventing deletion."""
        if email_id not in self.emails:
            raise ValueError(f"Email {email_id} not found")

        email = self.emails[email_id]
        hold = LegalHold(
            hold_type=hold_type,
            reason=reason,
            applied_by=applied_by or self.admin,
            case_matter_ref=case_matter_ref,
            expires_at=(
                datetime.utcnow() + timedelta(days=expires_days)
                if expires_days else None
            ),
        )

        email.legal_holds.append(hold)
        email.status = EmailStatus.UNDER_HOLD
        self.holds[hold.hold_id] = hold

        self._log_custody(
            email,
            ActionType.HOLD_APPLIED,
            f"Legal hold {hold.hold_id} ({hold_type.value}): {reason}",
        )

        self._stats["holds_applied"] += 1

        # Cross-reference to case/matter if provided
        if case_matter_ref:
            self.cross_reference_email(email_id, "matter", case_matter_ref,
                                       f"Legal hold: {reason}", applied_by or self.admin)

        return hold

    def remove_legal_hold(self, email_id: str, hold_id: str) -> bool:
        """Remove a legal hold from an email."""
        if email_id not in self.emails:
            raise ValueError(f"Email {email_id} not found")

        email = self.emails[email_id]
        for hold in email.legal_holds:
            if hold.hold_id == hold_id and hold.is_active:
                hold.is_active = False
                self._log_custody(
                    email,
                    ActionType.HOLD_REMOVED,
                    f"Legal hold {hold_id} removed",
                )
                self._stats["holds_removed"] += 1

                # Check if any active holds remain
                if not email.is_under_hold():
                    email.status = EmailStatus.FILED

                return True

        return False

    def apply_bulk_hold(
        self,
        email_ids: List[str],
        hold_type: HoldType,
        reason: str,
        case_matter_ref: str = "",
    ) -> List[LegalHold]:
        """Apply the same legal hold to multiple emails."""
        holds = []
        for eid in email_ids:
            try:
                hold = self.apply_legal_hold(
                    eid, hold_type, reason, case_matter_ref
                )
                holds.append(hold)
            except ValueError:
                continue
        return holds

    # =========================================================================
    # CROSS-REFERENCING
    # =========================================================================

    def cross_reference_email(
        self,
        email_id: str,
        ref_type: str,
        ref_number: str,
        description: str = "",
        linked_by: Optional[str] = None,
    ) -> CrossReference:
        """Cross-reference an email to a case, matter, or project."""
        if email_id not in self.emails:
            raise ValueError(f"Email {email_id} not found")

        email = self.emails[email_id]
        xref = CrossReference(
            ref_type=ref_type,
            ref_number=ref_number,
            description=description,
            linked_by=linked_by or self.admin,
        )

        email.cross_references.append(xref)
        self.case_registry[ref_number].append(email_id)

        self._log_custody(
            email,
            ActionType.CROSS_REFERENCED,
            f"Linked to {ref_type} {ref_number}: {description}",
        )

        return xref

    def get_emails_for_case(self, ref_number: str) -> List[ManagedEmail]:
        """Get all emails cross-referenced to a specific case/matter."""
        email_ids = self.case_registry.get(ref_number, [])
        return [self.emails[eid] for eid in email_ids if eid in self.emails]

    # =========================================================================
    # REPLY-ALL ENFORCEMENT
    # =========================================================================

    def set_required_recipients(self, email_id: str, recipients: Set[str]) -> None:
        """Set the required recipient list for reply-all enforcement."""
        if email_id not in self.emails:
            raise ValueError(f"Email {email_id} not found")
        self.emails[email_id].required_recipients = recipients

    def check_reply_all_compliance(
        self,
        original_email_id: str,
        reply_to: List[EmailAddress],
        reply_cc: Optional[List[EmailAddress]] = None,
    ) -> ReplyAllEnforcementResult:
        """
        Check if a reply includes all required recipients.
        Enforces that compliance-marked emails include all necessary parties.
        """
        if original_email_id not in self.emails:
            raise ValueError(f"Email {original_email_id} not found")

        email = self.emails[original_email_id]
        self._stats["reply_all_checks"] += 1

        result = ReplyAllEnforcementResult(email_id=original_email_id, compliant=True)

        if not email.required_recipients:
            # No enforcement required if no recipients specified
            result.action_taken = "No required recipients configured"
            return result

        # Collect all reply recipients
        reply_addrs = {r.address.lower() for r in reply_to}
        if reply_cc:
            reply_addrs.update(r.address.lower() for r in reply_cc)

        # Check for missing required recipients
        required_lower = {r.lower() for r in email.required_recipients}
        missing = required_lower - reply_addrs
        extra = reply_addrs - required_lower

        if missing:
            result.compliant = False
            result.missing_recipients = list(missing)
            email.reply_all_compliant = False

            self._add_violation(
                email,
                ViolationSeverity.HIGH,
                email.classification,
                f"Reply-all violation: missing required recipients: {', '.join(missing)}",
                "Ensure all required recipients are included in compliance replies",
            )

            self._log_custody(
                email,
                ActionType.REPLY_ALL_ENFORCED,
                f"NON-COMPLIANT: Missing {len(missing)} required recipients",
            )
            result.action_taken = "VIOLATION LOGGED - reply missing required recipients"
        else:
            result.action_taken = "COMPLIANT - all required recipients included"
            self._log_custody(
                email,
                ActionType.REPLY_ALL_ENFORCED,
                "COMPLIANT: All required recipients present",
            )

        if extra:
            result.extra_recipients = list(extra)

        return result

    # =========================================================================
    # RETENTION ENFORCEMENT AND PURGE
    # =========================================================================

    def enforce_retention(self) -> List[str]:
        """
        Enforce retention schedules: mark expired emails and purge eligible ones.
        Returns list of purged email IDs.
        """
        purged = []
        now = datetime.utcnow()

        for email_id, email in self.emails.items():
            # Mark expired
            if (
                email.retention_expiry
                and now > email.retention_expiry
                and email.status == EmailStatus.FILED
            ):
                email.status = EmailStatus.EXPIRED
                self._log_custody(
                    email,
                    ActionType.PURGE_SCHEDULED,
                    f"Retention expired ({email.retention_expiry.isoformat()})",
                )

        # Purge eligible expired emails (not under hold)
        for email_id, email in list(self.emails.items()):
            if email.status == EmailStatus.EXPIRED and email.can_purge():
                self._purge_email(email_id, "Retention period expired")
                purged.append(email_id)

        return purged

    def process_gdpr_deletions(self) -> List[str]:
        """Process GDPR deletion requests - delete emails not under hold."""
        deleted = []
        for email_id in list(self._gdpr_deletion_queue):
            if email_id in self.emails:
                email = self.emails[email_id]
                if not email.is_under_hold():
                    self._purge_email(email_id, "GDPR right-to-erasure request")
                    deleted.append(email_id)
                    self._gdpr_deletion_queue.remove(email_id)
                else:
                    # Cannot delete while under hold - flag for later
                    self._log_custody(
                        email,
                        ActionType.QUARANTINED,
                        "GDPR deletion deferred: email under legal hold",
                    )
        return deleted

    def _purge_email(self, email_id: str, reason: str) -> None:
        """Purge an email record (mark as purged, clear content)."""
        if email_id not in self.emails:
            return

        email = self.emails[email_id]
        if email.is_under_hold():
            raise ValueError(f"Cannot purge email {email_id}: under legal hold")

        # Log the purge details
        purge_record = {
            "email_id": email_id,
            "original_subject": email.subject,
            "original_hash": email.content_hash,
            "purged_at": datetime.utcnow().isoformat(),
            "reason": reason,
            "classification": email.classification.value,
        }
        self._purge_log.append(purge_record)

        # Clear sensitive content but maintain metadata for audit
        email.body = "[PURGED]"
        email.subject = f"[PURGED] {email.subject[:20]}"
        email.status = EmailStatus.PURGED
        email.attachments = []

        self._log_custody(email, ActionType.PURGED, f"Purged: {reason}")
        self._stats["emails_purged"] += 1

    # =========================================================================
    # COMPLIANCE REPORTING
    # =========================================================================

    def generate_compliance_report(
        self, framework: ComplianceFramework
    ) -> ComplianceReport:
        """Generate a compliance report for a specific regulatory framework."""
        report = ComplianceReport(framework=framework)
        confidence_values = []

        framework_emails = [
            e for e in self.emails.values()
            if e.classification == framework
        ]

        report.total_emails = len(framework_emails)

        for email in framework_emails:
            if email.status == EmailStatus.ACTIVE:
                report.active_emails += 1
            elif email.status == EmailStatus.UNDER_HOLD:
                report.held_emails += 1
            elif email.status == EmailStatus.EXPIRED:
                report.expired_emails += 1
            elif email.status == EmailStatus.PURGED:
                report.purged_emails += 1

            if email.is_under_hold():
                report.held_emails += 1

            if email.gdpr_deletion_requested:
                report.deletion_requests += 1

            report.violations_count += len(email.violations)
            report.unresolved_violations += sum(
                1 for v in email.violations if not v.resolved
            )
            report.cross_references_count += len(email.cross_references)

            if email.confidence != ClassificationConfidence.NONE:
                conf_map = {
                    ClassificationConfidence.HIGH: 3,
                    ClassificationConfidence.MEDIUM: 2,
                    ClassificationConfidence.LOW: 1,
                }
                confidence_values.append(conf_map[email.confidence])

            # Retention summary
            ret_key = email.retention_period.name
            report.retention_summary[ret_key] = (
                report.retention_summary.get(ret_key, 0) + 1
            )

            # Collect violation details
            for v in email.violations:
                report.violations_detail.append(v.to_dict())

        if confidence_values:
            avg = sum(confidence_values) / len(confidence_values)
            if avg >= 2.5:
                report.average_confidence = "HIGH"
            elif avg >= 1.5:
                report.average_confidence = "MEDIUM"
            else:
                report.average_confidence = "LOW"

        return report

    def generate_audit_readiness_report(self) -> Dict[str, Any]:
        """
        Generate comprehensive audit readiness report with chain-of-custody
        verification across all managed emails.
        """
        report = {
            "organization": self.organization,
            "generated_at": datetime.utcnow().isoformat(),
            "total_managed_emails": len(self.emails),
            "active_legal_holds": sum(
                1 for e in self.emails.values() if e.is_under_hold()
            ),
            "total_purged": self._stats["emails_purged"],
            "frameworks_covered": {},
            "chain_of_custody_integrity": True,
            "integrity_issues": [],
            "stats": self._stats.copy(),
        }

        # Per-framework summary
        for fw in ComplianceFramework:
            if fw == ComplianceFramework.NONE:
                continue
            count = sum(
                1 for e in self.emails.values() if e.classification == fw
            )
            report["frameworks_covered"][fw.value] = count

        # Verify chain of custody integrity
        for email_id, email in self.emails.items():
            if not email.chain_of_custody:
                report["integrity_issues"].append(
                    f"Email {email_id}: No chain-of-custody entries"
                )
                report["chain_of_custody_integrity"] = False
                continue

            # Verify first entry is RECEIVED
            if email.chain_of_custody[0].action != ActionType.RECEIVED:
                report["integrity_issues"].append(
                    f"Email {email_id}: Chain does not start with RECEIVED"
                )
                report["chain_of_custody_integrity"] = False

            # Verify content hash exists
            if not email.content_hash:
                report["integrity_issues"].append(
                    f"Email {email_id}: Missing content hash"
                )
                report["chain_of_custody_integrity"] = False

        report["total_integrity_issues"] = len(report["integrity_issues"])
        return report

    def export_chain_of_custody(self, email_id: str) -> List[Dict[str, Any]]:
        """Export the complete chain-of-custody log for an email."""
        if email_id not in self.emails:
            raise ValueError(f"Email {email_id} not found")

        email = self.emails[email_id]
        self._log_custody(email, ActionType.ACCESSED, "Chain-of-custody exported")

        return [entry.to_dict() for entry in email.chain_of_custody]

    # =========================================================================
    # VIOLATION MANAGEMENT
    # =========================================================================

    def _add_violation(
        self,
        email: ManagedEmail,
        severity: ViolationSeverity,
        framework: ComplianceFramework,
        description: str,
        remediation: str,
    ) -> None:
        """Add a compliance violation record."""
        violation = ComplianceViolation(
            severity=severity,
            framework=framework,
            description=description,
            email_id=email.email_id,
            remediation_required=remediation,
        )
        email.violations.append(violation)
        self.violations.append(violation)
        self._stats["violations_detected"] += 1

    def resolve_violation(self, violation_id: str) -> bool:
        """Mark a violation as resolved."""
        for v in self.violations:
            if v.violation_id == violation_id:
                v.resolved = True
                v.resolved_at = datetime.utcnow()
                return True
        return False

    def get_unresolved_violations(self) -> List[ComplianceViolation]:
        """Get all unresolved violations."""
        return [v for v in self.violations if not v.resolved]

    # =========================================================================
    # UTILITY METHODS
    # =========================================================================

    def _log_custody(
        self, email: ManagedEmail, action: ActionType, details: str
    ) -> None:
        """Add a chain-of-custody entry to an email."""
        entry = ChainOfCustodyEntry(
            timestamp=datetime.utcnow(),
            action=action,
            actor=self.admin,
            details=details,
            evidence_hash=email.content_hash,
        )
        email.chain_of_custody.append(entry)

    def get_email(self, email_id: str) -> Optional[ManagedEmail]:
        """Retrieve a managed email by ID."""
        return self.emails.get(email_id)

    def search_emails(
        self,
        framework: Optional[ComplianceFramework] = None,
        status: Optional[EmailStatus] = None,
        subject_contains: Optional[str] = None,
        sender_address: Optional[str] = None,
        has_legal_hold: Optional[bool] = None,
    ) -> List[ManagedEmail]:
        """Search managed emails by various criteria."""
        results = list(self.emails.values())

        if framework is not None:
            results = [e for e in results if e.classification == framework]
        if status is not None:
            results = [e for e in results if e.status == status]
        if subject_contains is not None:
            results = [
                e for e in results
                if subject_contains.lower() in e.subject.lower()
            ]
        if sender_address is not None:
            results = [
                e for e in results
                if e.sender and sender_address.lower() in e.sender.address.lower()
            ]
        if has_legal_hold is not None:
            results = [
                e for e in results if e.is_under_hold() == has_legal_hold
            ]

        return results

    def get_stats(self) -> Dict[str, Any]:
        """Get operational statistics."""
        stats = self._stats.copy()
        stats["total_emails"] = len(self.emails)
        stats["emails_under_hold"] = sum(
            1 for e in self.emails.values() if e.is_under_hold()
        )
        stats["emails_with_pii"] = sum(
            1 for e in self.emails.values() if e.contains_pii
        )
        stats["gdpr_deletion_pending"] = len(self._gdpr_deletion_queue)
        stats["purge_log_entries"] = len(self._purge_log)
        return stats

    def export_all_as_json(self) -> str:
        """Export all managed data as JSON."""
        data = {
            "organization": self.organization,
            "exported_at": datetime.utcnow().isoformat(),
            "emails": {eid: e.to_dict() for eid, e in self.emails.items()},
            "stats": self.get_stats(),
        }
        return json.dumps(data, indent=2, default=str)


# =============================================================================
# TEST SCENARIOS
# =============================================================================

def test_scenario_finra_compliance() -> Dict[str, Any]:
    """
    Test Scenario 1: FINRA Compliance
    - Ingest financial trading emails
    - Verify 7-year retention classification
    - Apply litigation hold
    - Generate FINRA compliance report
    """
    print("\n" + "=" * 70)
    print("TEST SCENARIO 1: FINRA Compliance - Financial Trading Emails")
    print("=" * 70)

    filer = ComplianceAutoFiler(organization="Acme Securities Inc.", admin="compliance_officer")

    # Ingest a FINRA-classifiable email
    email1 = filer.ingest_email(
        subject="Trade Confirmation - CUSIP 123456789",
        sender=EmailAddress("trader@acmesecurities.com", "John Trader"),
        recipients_to=[EmailAddress("client@example.com", "Jane Client")],
        body=(
            "Dear Jane,\n\n"
            "This is your trade confirmation for the purchase of 500 shares "
            "of XYZ Corp (CUSIP: 123456789) at $45.67 per share.\n\n"
            "Settlement date: T+2\n"
            "Broker-dealer reference: BD-2026-0451\n\n"
            "Your portfolio rebalancing is now complete. AUM has increased to $2.4M.\n\n"
            "Best regards,\nJohn Trader\nRegistered Rep, Series 7"
        ),
        recipients_cc=[EmailAddress("supervisor@acmesecurities.com", "Mike Supervisor")],
    )

    # Ingest a second FINRA email
    email2 = filer.ingest_email(
        subject="Margin Call Notice - Account #44556",
        sender=EmailAddress("risk@acmesecurities.com", "Risk Management"),
        recipients_to=[EmailAddress("client@example.com", "Jane Client")],
        body=(
            "IMPORTANT: Margin Call Notification\n\n"
            "Your account has fallen below maintenance requirements.\n"
            "Securities exchange rules require immediate action.\n\n"
            "Please contact your investment advisor immediately.\n"
            "FINRA Rule 4210 applies."
        ),
    )

    # Verify classification
    assert email1.classification == ComplianceFramework.FINRA, \
        f"Expected FINRA, got {email1.classification}"
    assert email1.confidence in (ClassificationConfidence.HIGH, ClassificationConfidence.MEDIUM), \
        f"Expected HIGH/MEDIUM confidence, got {email1.confidence}"
    assert email1.retention_period == RetentionPeriod.SEVEN_YEARS, \
        f"Expected 7-year retention, got {email1.retention_period}"

    # Apply legal hold for litigation
    hold = filer.apply_legal_hold(
        email1.email_id,
        HoldType.LITIGATION,
        "SEC investigation #2026-INV-442",
        case_matter_ref="CASE-2026-0442",
    )
    assert email1.is_under_hold(), "Email should be under legal hold"
    assert email1.status == EmailStatus.UNDER_HOLD

    # Verify hold prevents purge
    assert not email1.can_purge(), "Email under hold should not be purgeable"

    # Cross-reference
    filer.cross_reference_email(
        email2.email_id, "case", "CASE-2026-0442",
        "Related margin call during investigation period"
    )

    # Generate compliance report
    report = filer.generate_compliance_report(ComplianceFramework.FINRA)
    assert report.total_emails == 2
    assert report.held_emails >= 1

    print(f"  [PASS] Email 1 classified as FINRA (confidence: {email1.confidence.value})")
    print(f"  [PASS] 7-year retention period set")
    print(f"  [PASS] Legal hold applied: {hold.hold_id}")
    print(f"  [PASS] Email 2 classified as FINRA (confidence: {email2.confidence.value})")
    print(f"  [PASS] Cross-reference linked to CASE-2026-0442")
    print(f"  [PASS] FINRA report: {report.total_emails} emails, {report.held_emails} held")
    print(f"  [PASS] Chain-of-custody entries: {len(email1.chain_of_custody)}")

    # Verify chain of custody
    custody = filer.export_chain_of_custody(email1.email_id)
    assert len(custody) > 0
    assert custody[0]["action"] == "RECEIVED"

    return {"status": "PASS", "emails": 2, "framework": "FINRA", "report": report.to_dict()}


def test_scenario_hipaa_gdpr() -> Dict[str, Any]:
    """
    Test Scenario 2: HIPAA + GDPR Combined
    - Ingest healthcare email with patient data
    - Detect PII (SSN, phone)
    - Process GDPR deletion request
    - Verify HIPAA 6-year retention
    """
    print("\n" + "=" * 70)
    print("TEST SCENARIO 2: HIPAA + GDPR - Healthcare Data with Deletion Request")
    print("=" * 70)

    filer = ComplianceAutoFiler(organization="City Hospital Network", admin="privacy_officer")

    # Ingest HIPAA email with PII
    email1 = filer.ingest_email(
        subject="Patient Record Update - Lab Results",
        sender=EmailAddress("dr.smith@cityhospital.org", "Dr. Smith"),
        recipients_to=[EmailAddress("nurse.jones@cityhospital.org", "Nurse Jones")],
        body=(
            "Patient Record Update\n\n"
            "Patient ID: P-2026-4421\n"
            "Diagnosis: Type 2 Diabetes - HbA1c at 7.2\n"
            "Prescription: Metformin 500mg BID\n\n"
            "Lab results from EHR show improvement.\n"
            "Updated ICD-10 code: E11.65\n\n"
            "Please update the treatment plan in the electronic health record.\n"
            "Contact patient at 555-123-4567 for follow-up.\n\n"
            "PHI Notice: This contains protected health information."
        ),
    )

    # Ingest GDPR deletion request
    email2 = filer.ingest_email(
        subject="Data Deletion Request - Please erase my data",
        sender=EmailAddress("patient@email.com", "Former Patient"),
        recipients_to=[EmailAddress("privacy@cityhospital.org", "Privacy Office")],
        body=(
            "Dear Privacy Officer,\n\n"
            "Under GDPR Article 17, I exercise my right to erasure.\n"
            "Please delete all my personal data from your systems.\n"
            "I withdraw consent for all data processing.\n\n"
            "Please confirm within 30 days.\n\n"
            "Regards,\nFormer Patient"
        ),
    )

    # Verify HIPAA classification
    assert email1.classification == ComplianceFramework.HIPAA, \
        f"Expected HIPAA, got {email1.classification}"
    assert email1.retention_period == RetentionPeriod.SIX_YEARS, \
        f"Expected 6-year retention, got {email1.retention_period}"

    # Verify PII detection
    assert email1.contains_pii, "Should detect PII in healthcare email"
    assert "PHONE" in email1.pii_types_found, "Should detect phone number"

    # Verify GDPR deletion request
    assert email2.gdpr_deletion_requested, "Should detect GDPR deletion request"
    assert email2.classification == ComplianceFramework.GDPR

    # Verify deletion request creates a violation/action item
    gdpr_violations = [v for v in email2.violations if v.framework == ComplianceFramework.GDPR]
    assert len(gdpr_violations) > 0, "Should have GDPR action item"

    # Process GDPR deletions (should delete email2 since not under hold)
    deleted = filer.process_gdpr_deletions()
    assert email2.email_id in deleted, "GDPR email should be processed for deletion"
    assert email2.status == EmailStatus.PURGED

    # Verify HIPAA email cannot be deleted while under hold
    hold = filer.apply_legal_hold(
        email1.email_id,
        HoldType.REGULATORY_INVESTIGATION,
        "HHS audit of patient records",
    )
    assert not email1.can_purge(), "HIPAA email under hold cannot be purged"

    print(f"  [PASS] HIPAA email classified correctly (confidence: {email1.confidence.value})")
    print(f"  [PASS] 6-year retention period set")
    print(f"  [PASS] PII detected: {email1.pii_types_found}")
    print(f"  [PASS] GDPR deletion request detected")
    print(f"  [PASS] GDPR email purged: {deleted}")
    print(f"  [PASS] HIPAA email protected by legal hold")
    print(f"  [PASS] GDPR violation tracked: {len(gdpr_violations)} action items")

    return {"status": "PASS", "emails": 2, "frameworks": ["HIPAA", "GDPR"],
            "pii_detected": email1.pii_types_found, "gdpr_deleted": len(deleted)}


def test_scenario_sox_pci_dss() -> Dict[str, Any]:
    """
    Test Scenario 3: SOX + PCI-DSS
    - Ingest SOX financial audit email
    - Ingest PCI-DSS cardholder data email
    - Verify different retention periods
    - Test retention enforcement with auto-purge
    - Reply-all enforcement check
    """
    print("\n" + "=" * 70)
    print("TEST SCENARIO 3: SOX + PCI-DSS - Financial Audit & Cardholder Data")
    print("=" * 70)

    filer = ComplianceAutoFiler(organization="Global Corp Inc.", admin="cfo_office")

    # Ingest SOX email
    email_sox = filer.ingest_email(
        subject="Q4 Financial Statement - Internal Control Findings",
        sender=EmailAddress("auditor@globalcorp.com", "Internal Auditor"),
        recipients_to=[
            EmailAddress("cfo@globalcorp.com", "Chief Financial Officer"),
            EmailAddress("audit_committee@globalcorp.com", "Audit Committee"),
        ],
        body=(
            "Quarterly Financial Review - Q4 2026\n\n"
            "SOX Section 404 Internal Control Assessment:\n"
            "- Material weakness identified in revenue recognition process\n"
            "- Significant deficiency in journal entry approvals\n\n"
            "CFO certification required per Section 302.\n"
            "External auditor notified for 10-K filing review.\n\n"
            "General ledger reconciliation shows $2.3M discrepancy.\n"
            "Whistleblower report #WB-2026-12 under investigation.\n\n"
            "Action Required: Remediate before quarterly filing deadline."
        ),
    )

    # Ingest PCI-DSS email
    email_pci = filer.ingest_email(
        subject="PCI-DSS Compliance Alert - Cardholder Data Exposure",
        sender=EmailAddress("security@globalcorp.com", "Security Team"),
        recipients_to=[EmailAddress("compliance@globalcorp.com", "Compliance Officer")],
        body=(
            "URGENT: PCI-DSS Compliance Issue\n\n"
            "Cardholder data exposure detected in email system.\n"
            "Primary account number (PAN) found in unencrypted log.\n"
            "Card number: 4111 1111 1111 1111\n"
            "CVV: 123 | Expiry: 12/27\n\n"
            "Merchant account #M-44556 affected.\n"
            "QSA has been notified for ROC report update.\n\n"
            "Immediate tokenization required per PCI-DSS requirements.\n"
            "ASV scan scheduled for next week."
        ),
    )

    # Verify SOX classification and 7-year retention
    assert email_sox.classification == ComplianceFramework.SOX, \
        f"Expected SOX, got {email_sox.classification}"
    assert email_sox.retention_period == RetentionPeriod.SEVEN_YEARS

    # Verify PCI-DSS classification and 1-year retention
    assert email_pci.classification == ComplianceFramework.PCI_DSS, \
        f"Expected PCI-DSS, got {email_pci.classification}"
    assert email_pci.retention_period == RetentionPeriod.ONE_YEAR

    # Set required recipients for reply-all enforcement
    filer.set_required_recipients(email_sox.email_id, {
        "cfo@globalcorp.com",
        "audit_committee@globalcorp.com",
        "auditor@globalcorp.com",
    })

    # Test compliant reply (includes all required)
    compliant_result = filer.check_reply_all_compliance(
        email_sox.email_id,
        reply_to=[
            EmailAddress("cfo@globalcorp.com"),
            EmailAddress("auditor@globalcorp.com"),
        ],
        reply_cc=[EmailAddress("audit_committee@globalcorp.com")],
    )
    assert compliant_result.compliant, "Reply should be compliant"

    # Test non-compliant reply (missing audit committee)
    noncompliant_result = filer.check_reply_all_compliance(
        email_sox.email_id,
        reply_to=[EmailAddress("cfo@globalcorp.com")],
    )
    assert not noncompliant_result.compliant, "Reply should be non-compliant"
    assert "audit_committee@globalcorp.com" in noncompliant_result.missing_recipients
    assert "auditor@globalcorp.com" in noncompliant_result.missing_recipients

    # Test retention enforcement with simulated expired email
    email_old = filer.ingest_email(
        subject="Old PCI Transaction Log",
        sender=EmailAddress("system@globalcorp.com"),
        recipients_to=[EmailAddress("archive@globalcorp.com")],
        body="PCI-DSS transaction log from 2024. Cardholder data processed.",
        date_received=datetime.utcnow() - timedelta(days=400),
    )
    assert email_old.classification == ComplianceFramework.PCI_DSS

    # Enforce retention - old PCI email should be purged (1 year expired)
    purged = filer.enforce_retention()
    assert email_old.email_id in purged, "Expired PCI email should be purged"
    assert email_old.status == EmailStatus.PURGED

    print(f"  [PASS] SOX email classified (confidence: {email_sox.confidence.value})")
    print(f"  [PASS] SOX 7-year retention set")
    print(f"  [PASS] PCI-DSS email classified (confidence: {email_pci.confidence.value})")
    print(f"  [PASS] PCI-DSS 1-year retention set")
    print(f"  [PASS] Reply-all compliant check: PASS")
    print(f"  [PASS] Reply-all non-compliant check: MISSING {len(noncompliant_result.missing_recipients)} recipients")
    print(f"  [PASS] Retention enforcement purged {len(purged)} expired email(s)")
    print(f"  [PASS] PCI-DSS contains card pattern: {any('card' in p.lower() for p in email_pci.detected_patterns)}")

    return {
        "status": "PASS",
        "emails": 3,
        "frameworks": ["SOX", "PCI-DSS"],
        "reply_all_violations": 1,
        "purged_count": len(purged),
    }


def test_scenario_audit_readiness() -> Dict[str, Any]:
    """
    Test Scenario 4: Audit Readiness & Chain-of-Custody
    - Ingest multiple emails across frameworks
    - Apply various legal holds
    - Cross-reference to cases
    - Generate comprehensive audit report
    - Verify chain-of-custody integrity
    """
    print("\n" + "=" * 70)
    print("TEST SCENARIO 4: Audit Readiness - Chain-of-Custody Integrity")
    print("=" * 70)

    filer = ComplianceAutoFiler(organization="MultiCompliance Corp", admin="legal_dept")

    # Ingest diverse emails
    emails = []

    emails.append(filer.ingest_email(
        subject="Securities Trading Report - Monthly",
        sender=EmailAddress("trading@multicorp.com"),
        recipients_to=[EmailAddress("compliance@multicorp.com")],
        body="Monthly securities exchange trading report. "
             "Broker-dealer summary with CUSIP references. "
             "FINRA compliance review attached.",
    ))

    emails.append(filer.ingest_email(
        subject="Patient Data Transfer Notice",
        sender=EmailAddress("it@hospital.org"),
        recipients_to=[EmailAddress("admin@hospital.org")],
        body="EHR data transfer completed. Protected health information "
             "was encrypted per HIPAA requirements. Patient records "
             "for diagnosis codes E11.9 and I10 transferred securely.",
    ))

    emails.append(filer.ingest_email(
        subject="Annual SOX Audit - Section 404 Report",
        sender=EmailAddress("audit@multicorp.com"),
        recipients_to=[EmailAddress("cfo@multicorp.com")],
        body="SOX Section 404 internal control assessment complete. "
             "No material weakness found. Financial statement review "
             "passed. CFO certification obtained. Revenue recognition "
             "controls effective. General ledger reconciled.",
    ))

    emails.append(filer.ingest_email(
        subject="Payment Processing Update",
        sender=EmailAddress("payments@multicorp.com"),
        recipients_to=[EmailAddress("ops@multicorp.com")],
        body="PCI-DSS compliance update. Tokenization complete for all "
             "cardholder data. ASV scan passed. QSA approved our "
             "merchant account configuration.",
    ))

    emails.append(filer.ingest_email(
        subject="Regular team meeting notes",
        sender=EmailAddress("manager@multicorp.com"),
        recipients_to=[EmailAddress("team@multicorp.com")],
        body="Weekly team sync: discussed project timelines and "
             "resource allocation. No action items.",
    ))

    # Apply legal holds to specific emails
    filer.apply_legal_hold(
        emails[0].email_id,
        HoldType.LITIGATION,
        "Pending class action lawsuit",
        case_matter_ref="LIT-2026-001",
    )
    filer.apply_legal_hold(
        emails[2].email_id,
        HoldType.INTERNAL_AUDIT,
        "Internal fraud investigation",
        case_matter_ref="INV-2026-055",
    )

    # Cross-reference emails to cases
    filer.cross_reference_email(
        emails[1].email_id, "matter", "HIPAA-AUDIT-2026",
        "Annual HIPAA compliance review"
    )
    filer.cross_reference_email(
        emails[3].email_id, "project", "PCI-REMEDIATION-2026",
        "PCI-DSS remediation project"
    )

    # Generate audit readiness report
    audit_report = filer.generate_audit_readiness_report()
    assert audit_report["chain_of_custody_integrity"], \
        f"Chain-of-custody integrity failed: {audit_report['integrity_issues']}"
    assert audit_report["total_managed_emails"] == 5
    assert audit_report["active_legal_holds"] >= 2

    # Generate per-framework reports
    finra_report = filer.generate_compliance_report(ComplianceFramework.FINRA)
    sox_report = filer.generate_compliance_report(ComplianceFramework.SOX)

    # Verify cross-referencing
    case_emails = filer.get_emails_for_case("LIT-2026-001")
    assert len(case_emails) >= 1, "Should have emails linked to litigation case"

    # Verify hold removal workflow
    hold_id = emails[0].legal_holds[0].hold_id
    removed = filer.remove_legal_hold(emails[0].email_id, hold_id)
    assert removed, "Should successfully remove hold"
    assert not emails[0].is_under_hold(), "Email should no longer be under hold"

    # Get final stats
    stats = filer.get_stats()

    print(f"  [PASS] 5 emails ingested across multiple frameworks")
    print(f"  [PASS] Chain-of-custody integrity verified")
    print(f"  [PASS] Legal holds applied and removed correctly")
    print(f"  [PASS] Cross-references linked to cases/matters/projects")
    print(f"  [PASS] FINRA report: {finra_report.total_emails} emails")
    print(f"  [PASS] SOX report: {sox_report.total_emails} emails")
    print(f"  [PASS] Audit report integrity: {audit_report['chain_of_custody_integrity']}")
    print(f"  [PASS] Stats: {stats['total_emails']} total, "
          f"{stats['emails_under_hold']} under hold, "
          f"{stats['emails_with_pii']} with PII")

    return {
        "status": "PASS",
        "emails": 5,
        "audit_integrity": audit_report["chain_of_custody_integrity"],
        "stats": stats,
        "frameworks": {
            "FINRA": finra_report.total_emails,
            "SOX": sox_report.total_emails,
        },
    }


def test_scenario_bulk_operations() -> Dict[str, Any]:
    """
    Test Scenario 5: Bulk Operations and Edge Cases
    - Bulk hold application
    - Multi-framework email detection
    - Search and filter operations
    - Export and serialization
    """
    print("\n" + "=" * 70)
    print("TEST SCENARIO 5: Bulk Operations and Edge Cases")
    print("=" * 70)

    filer = ComplianceAutoFiler(organization="TestCorp", admin="admin")

    # Ingest emails with mixed content (multi-framework)
    email_multi = filer.ingest_email(
        subject="Financial Health Report with Patient Billing",
        sender=EmailAddress("billing@hospital.org"),
        recipients_to=[EmailAddress("cfo@hospital.org")],
        body=(
            "Combined financial and healthcare report:\n"
            "Revenue recognition for Q4 shows patient billing at $4.2M.\n"
            "SOX Section 404 controls reviewed.\n"
            "HIPAA compliance maintained for PHI in billing records.\n"
            "Internal control assessment complete.\n"
            "Patient diagnosis billing codes reviewed per ICD-10."
        ),
    )

    # Should detect multiple frameworks - picks strictest
    assert email_multi.classification in (
        ComplianceFramework.SOX, ComplianceFramework.HIPAA
    ), f"Expected SOX or HIPAA for mixed content, got {email_multi.classification}"

    # Bulk ingest for bulk hold test
    bulk_emails = []
    for i in range(5):
        e = filer.ingest_email(
            subject=f"Trading Report #{i+1}",
            sender=EmailAddress(f"trader{i}@testcorp.com"),
            recipients_to=[EmailAddress("compliance@testcorp.com")],
            body=f"Securities trade confirmation #{i+1}. "
                 f"Broker-dealer settlement for CUSIP {i}23456789.",
        )
        bulk_emails.append(e)

    # Apply bulk hold
    bulk_ids = [e.email_id for e in bulk_emails]
    holds = filer.apply_bulk_hold(
        bulk_ids,
        HoldType.PRESERVATION_ORDER,
        "Court order: preserve all trading communications",
        case_matter_ref="COURT-2026-789",
    )
    assert len(holds) == 5, f"Expected 5 holds, got {len(holds)}"

    # Verify all are under hold
    for e in bulk_emails:
        assert e.is_under_hold()

    # Test search functionality
    finra_emails = filer.search_emails(framework=ComplianceFramework.FINRA)
    held_emails = filer.search_emails(has_legal_hold=True)
    subject_search = filer.search_emails(subject_contains="Trading")

    assert len(finra_emails) >= 5, f"Expected at least 5 FINRA emails, got {len(finra_emails)}"
    assert len(held_emails) >= 5, f"Expected at least 5 held emails, got {len(held_emails)}"
    assert len(subject_search) >= 5

    # Test JSON export
    json_export = filer.export_all_as_json()
    parsed = json.loads(json_export)
    assert "emails" in parsed
    assert "stats" in parsed
    assert len(parsed["emails"]) == 6  # 1 multi + 5 bulk

    # Verify stats
    stats = filer.get_stats()
    assert stats["total_emails"] == 6
    assert stats["emails_under_hold"] >= 5
    assert stats["holds_applied"] >= 5

    print(f"  [PASS] Multi-framework email classified as {email_multi.classification.value}")
    print(f"  [PASS] Bulk hold applied to {len(holds)} emails")
    print(f"  [PASS] Search by framework: {len(finra_emails)} FINRA emails")
    print(f"  [PASS] Search by hold status: {len(held_emails)} held emails")
    print(f"  [PASS] Search by subject: {len(subject_search)} matches")
    print(f"  [PASS] JSON export: {len(parsed['emails'])} emails exported")
    print(f"  [PASS] Stats verified: {stats['total_emails']} total, "
          f"{stats['holds_applied']} holds applied")

    return {
        "status": "PASS",
        "emails": 6,
        "bulk_holds": len(holds),
        "search_results": {
            "FINRA": len(finra_emails),
            "held": len(held_emails),
            "subject_match": len(subject_search),
        },
    }


# =============================================================================
# MAIN ENTRY POINT
# =============================================================================

def run_all_tests() -> Dict[str, Any]:
    """Run all test scenarios and return aggregate results."""
    results = {}
    test_functions = [
        ("FINRA Compliance", test_scenario_finra_compliance),
        ("HIPAA + GDPR", test_scenario_hipaa_gdpr),
        ("SOX + PCI-DSS", test_scenario_sox_pci_dss),
        ("Audit Readiness", test_scenario_audit_readiness),
        ("Bulk Operations", test_scenario_bulk_operations),
    ]

    print("\n" + "#" * 70)
    print("# V137 AI Email Compliance Auto-Filer - Test Suite")
    print("#" * 70)

    all_passed = True
    for name, test_fn in test_functions:
        try:
            result = test_fn()
            results[name] = result
            if result.get("status") != "PASS":
                all_passed = False
        except AssertionError as e:
            results[name] = {"status": "FAIL", "error": str(e)}
            all_passed = False
            print(f"  [FAIL] {name}: {e}")
        except Exception as e:
            results[name] = {"status": "ERROR", "error": str(e)}
            all_passed = False
            print(f"  [ERROR] {name}: {e}")

    print("\n" + "#" * 70)
    print("# TEST SUMMARY")
    print("#" * 70)
    for name, result in results.items():
        status = result.get("status", "UNKNOWN")
        icon = "✓" if status == "PASS" else "✗"
        print(f"  {icon} {name}: {status}")

    print(f"\n{'=' * 70}")
    print(f"  Overall: {'ALL TESTS PASSED' if all_passed else 'SOME TESTS FAILED'}")
    print(f"  Tests run: {len(results)}")
    print(f"  Passed: {sum(1 for r in results.values() if r.get('status') == 'PASS')}")
    print(f"  Failed: {sum(1 for r in results.values() if r.get('status') != 'PASS')}")
    print(f"{'=' * 70}\n")

    return {"all_passed": all_passed, "results": results}


if __name__ == "__main__":
    import sys

    print("=" * 70)
    print("V137 AI Email Compliance Auto-Filer v1.0")
    print("Regulatory Frameworks: FINRA | HIPAA | GDPR | SOX | PCI-DSS")
    print("=" * 70)

    results = run_all_tests()

    sys.exit(0 if results["all_passed"] else 1)
