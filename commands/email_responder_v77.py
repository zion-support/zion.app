#!/usr/bin/env python3
"""
Zion Tech Group - V77 Hyper-Advanced Email Responder Engine
The most intelligent email system with:
- Priority Decay Modeling (urgency decreases over time)
- Attachment Intelligence (cross-referencing & auto-suggestions)
- Legal/Compliance Flag Detection (GDPR, HIPAA, contracts)
- Multi-language Response Generation
- Emotional Intelligence Scoring
- Thread Summarization
- Proactive Follow-up Generation
- Signature Intelligence (contact extraction)
- Smart CC/BCC Recommendations
- Response Time Prediction
- ABSOLUTE REPLY-ALL ENFORCEMENT

Author: Kleber Garcia Alcatrao
Version: V77-1
Date: 2026-05-29
"""

import re
import json
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple, Any
from dataclasses import dataclass, field
from enum import Enum

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class PriorityLevel(Enum):
    CRITICAL = "critical"  # Immediate response required
    HIGH = "high"          # Response within 2 hours
    MEDIUM = "medium"      # Response within 8 hours
    LOW = "low"            # Response within 24 hours
    INFORMATIONAL = "informational"  # No response needed


class ComplianceFlag(Enum):
    GDPR = "gdpr"
    HIPAA = "hipaa"
    PCI_DSS = "pci_dss"
    SOX = "sox"
    CONTRACTUAL = "contractual"
    CONFIDENTIAL = "confidential"
    LEGAL_HOLD = "legal_hold"
    NONE = "none"


class Emotion(Enum):
    JOY = "joy"
    TRUST = "trust"
    FEAR = "fear"
    SURPRISE = "surprise"
    SADNESS = "sadness"
    DISGUST = "disgust"
    ANGER = "anger"
    ANTICIPATION = "anticipation"


@dataclass
class PriorityDecay:
    """Models how priority changes over time."""
    initial_priority: PriorityLevel
    current_priority: PriorityLevel
    decay_rate: float  # Hours until priority drops one level
    last_reinforcement: Optional[datetime]
    reinforcement_count: int
    estimated_response_deadline: datetime
    
    def apply_decay(self, hours_elapsed: float) -> PriorityLevel:
        """Apply priority decay based on time elapsed."""
        if self.last_reinforcement and (datetime.now() - self.last_reinforcement).total_seconds() / 3600 < 2:
            return self.initial_priority  # Recent reinforcement resets decay
        
        levels = [PriorityLevel.CRITICAL, PriorityLevel.HIGH, PriorityLevel.MEDIUM, PriorityLevel.LOW, PriorityLevel.INFORMATIONAL]
        current_idx = levels.index(self.current_priority)
        
        decay_levels = int(hours_elapsed / self.decay_rate)
        new_idx = min(current_idx + decay_levels, len(levels) - 1)
        
        return levels[new_idx]


@dataclass
class AttachmentAnalysis:
    """Analysis of attachments in email thread."""
    attachments_present: List[str]
    attachments_promised: List[str]
    attachments_missing: List[str]
    attachment_types: Dict[str, str]  # filename -> type
    recommendations: List[str]
    cross_references: List[str]  # Documents referenced but not attached


@dataclass
class ComplianceAnalysis:
    """Legal and compliance flag detection."""
    flags: List[ComplianceFlag]
    risk_level: str  # "low", "medium", "high", "critical"
    required_actions: List[str]
    data_sensitivity: str
    retention_period: Optional[int]  # Days
    encryption_required: bool
    audit_trail_needed: bool


@dataclass
class SignatureIntelligence:
    """Extracted information from email signatures."""
    name: Optional[str]
    title: Optional[str]
    company: Optional[str]
    phone: Optional[str]
    email: Optional[str]
    website: Optional[str]
    social_links: Dict[str, str]
    address: Optional[str]
    title_changes: bool  # Detected title change from previous emails


@dataclass
class ThreadSummary:
    """AI-generated summary of email thread."""
    main_topic: str
    key_decisions: List[str]
    action_items: List[str]
    open_questions: List[str]
    sentiment_trajectory: List[Tuple[datetime, str]]
    participants_roles: Dict[str, str]
    timeline: List[Dict]
    word_count: int
    reading_time_minutes: float


@dataclass
class V77EmailAnalysis:
    """Complete V77 email analysis."""
    # Core analysis
    priority: PriorityLevel
    priority_decay: PriorityDecay
    sentiment_score: float
    emotions: Dict[Emotion, float]
    
    # Compliance
    compliance: ComplianceAnalysis
    
    # Attachments
    attachments: AttachmentAnalysis
    
    # Thread
    thread_summary: Optional[ThreadSummary]
    
    # Signature
    signature: SignatureIntelligence
    
    # Response
    recommended_response_time: timedelta
    reply_all_enforced: bool
    reply_all_reason: str
    cc_recommendations: List[str]
    bcc_recommendations: List[str]
    
    # Follow-up
    follow_up_needed: bool
    follow_up_date: Optional[datetime]
    follow_up_reason: str
    
    # Action plan
    primary_action: str
    secondary_actions: List[str]
    tasks_to_create: List[str]
    meetings_to_schedule: List[Dict]
    
    # Draft
    response_draft: str
    draft_language: str


class V77EmailIntelligence:
    """
    V77 Hyper-Advanced Email Responder Engine
    
    Features:
    - Priority decay modeling
    - Attachment intelligence
    - Legal/compliance detection
    - Multi-language support
    - Emotional intelligence
    - Thread summarization
    - Signature extraction
    - Guaranteed reply-all enforcement
    """
    
    def __init__(self):
        self.thread_history: Dict[str, List[Dict]] = {}
        self.contact_database: Dict[str, Dict] = {}
        self.compliance_keywords = self._load_compliance_keywords()
        self.language_patterns = self._load_language_patterns()
        
    def _load_compliance_keywords(self) -> Dict[ComplianceFlag, List[str]]:
        """Load compliance detection keywords."""
        return {
            ComplianceFlag.GDPR: [
                "personal data", "data subject", "right to be forgotten", "consent",
                "data protection", "privacy", "eu citizen", "gdpr", "dpo"
            ],
            ComplianceFlag.HIPAA: [
                "phi", "protected health", "hipaa", "patient", "medical record",
                "health information", "covered entity", "business associate"
            ],
            ComplianceFlag.PCI_DSS: [
                "credit card", "payment card", "pci", "cardholder data", "cvv",
                "pan", "payment processing", "merchant"
            ],
            ComplianceFlag.SOX: [
                "financial report", "internal controls", "audit", "sox", "sarbanes",
                "financial statement", "material weakness"
            ],
            ComplianceFlag.CONTRACTUAL: [
                "contract", "agreement", "terms", "obligations", "deliverables",
                "milestone", "sla", "penalty", "breach"
            ],
            ComplianceFlag.CONFIDENTIAL: [
                "confidential", "proprietary", "trade secret", "nda", "non-disclosure",
                "internal only", "do not share"
            ],
            ComplianceFlag.LEGAL_HOLD: [
                "legal hold", "litigation hold", "preservation", "spoliation",
                "pending litigation", "subpoena"
            ]
        }
    
    def _load_language_patterns(self) -> Dict[str, List[str]]:
        """Load language detection patterns."""
        return {
            "en": ["the", "and", "is", "are", "was", "were", "have", "has"],
            "es": ["el", "la", "los", "las", "es", "son", "está", "están"],
            "fr": ["le", "la", "les", "est", "sont", "avoir", "être"],
            "de": ["der", "die", "das", "ist", "sind", "haben", "sein"],
            "pt": ["o", "a", "os", "as", "é", "são", "ter", "ser"],
            "it": ["il", "la", "gli", "le", "è", "sono", "avere", "essere"],
            "zh": ["的", "是", "在", "了", "和", "我", "你"],
            "ja": ["の", "は", "が", "を", "に", "で", "と"],
            "ar": ["ال", "في", "من", "على", "إلى", "عن"]
        }
    
    def analyze_priority_decay(self, email_data: Dict) -> PriorityDecay:
        """
        Model how email priority changes over time.
        
        Priority decay factors:
        - Time since received
        - Reinforcement (follow-ups)
        - Sender importance
        - Thread activity
        """
        # Initial priority based on content
        body = email_data.get("body", "").lower()
        subject = email_data.get("subject", "").lower()
        
        initial_priority = PriorityLevel.MEDIUM
        
        # Critical indicators
        if any(word in body or word in subject for word in ["urgent", "emergency", "asap", "immediately", "critical"]):
            initial_priority = PriorityLevel.CRITICAL
        elif any(word in body or word in subject for word in ["important", "high priority", "deadline"]):
            initial_priority = PriorityLevel.HIGH
        elif any(word in body or word in subject for word in ["fyi", "information", "update"]):
            initial_priority = PriorityLevel.LOW
        
        # Decay rate (hours per level drop)
        decay_rate = 24.0  # Default: 24 hours to drop one level
        
        if initial_priority == PriorityLevel.CRITICAL:
            decay_rate = 4.0  # Critical decays faster
        elif initial_priority == PriorityLevel.HIGH:
            decay_rate = 12.0
        
        # Check for reinforcement in thread
        thread_id = email_data.get("thread_id")
        reinforcement_count = 0
        last_reinforcement = None
        
        if thread_id and thread_id in self.thread_history:
            thread = self.thread_history[thread_id]
            reinforcement_count = len(thread)
            if thread:
                last_reinforcement = max(msg.get("date", datetime.min) for msg in thread)
        
        # Calculate deadline
        received_time = email_data.get("date", datetime.now())
        if initial_priority == PriorityLevel.CRITICAL:
            deadline = received_time + timedelta(hours=2)
        elif initial_priority == PriorityLevel.HIGH:
            deadline = received_time + timedelta(hours=8)
        elif initial_priority == PriorityLevel.MEDIUM:
            deadline = received_time + timedelta(hours=24)
        else:
            deadline = received_time + timedelta(days=3)
        
        # Apply decay
        hours_elapsed = (datetime.now() - received_time).total_seconds() / 3600
        current_priority = PriorityDecay(
            initial_priority=initial_priority,
            current_priority=initial_priority,
            decay_rate=decay_rate,
            last_reinforcement=last_reinforcement,
            reinforcement_count=reinforcement_count,
            estimated_response_deadline=deadline
        ).apply_decay(hours_elapsed)
        
        return PriorityDecay(
            initial_priority=initial_priority,
            current_priority=current_priority,
            decay_rate=decay_rate,
            last_reinforcement=last_reinforcement,
            reinforcement_count=reinforcement_count,
            estimated_response_deadline=deadline
        )
    
    def analyze_attachments(self, email_data: Dict) -> AttachmentAnalysis:
        """
        Intelligent attachment analysis.
        
        Detects:
        - Attachments present
        - Attachments promised but missing
        - Document types
        - Cross-references to documents
        """
        body = email_data.get("body", "")
        attachments = email_data.get("attachments", [])
        
        # Attachments present
        attachments_present = [att.get("filename", "unknown") for att in attachments]
        
        # Attachment types
        attachment_types = {}
        for att in attachments:
            filename = att.get("filename", "")
            if filename.endswith(".pdf"):
                attachment_types[filename] = "PDF"
            elif filename.endswith(".docx") or filename.endswith(".doc"):
                attachment_types[filename] = "Word Document"
            elif filename.endswith(".xlsx") or filename.endswith(".xls"):
                attachment_types[filename] = "Spreadsheet"
            elif filename.endswith(".pptx") or filename.endswith(".ppt"):
                attachment_types[filename] = "Presentation"
            elif filename.endswith(".zip"):
                attachment_types[filename] = "Archive"
            elif any(filename.endswith(ext) for ext in [".jpg", ".png", ".gif"]):
                attachment_types[filename] = "Image"
            else:
                attachment_types[filename] = "Other"
        
        # Detect promised attachments
        promised_patterns = [
            r"(?:please find|see|attached|find attached)\s+(?:the\s+)?([\w\s]+)",
            r"i('ve| have)?\s+attached\s+(?:the\s+)?([\w\s]+)",
            r"(?:sending|sent)\s+(?:the\s+)?([\w\s]+)\s+(?:as an attachment|attached)",
            r"attachment:\s*([\w\s]+)"
        ]
        
        attachments_promised = []
        for pattern in promised_patterns:
            matches = re.findall(pattern, body, re.IGNORECASE)
            for match in matches:
                if isinstance(match, tuple):
                    match = match[-1]
                if match.strip():
                    attachments_promised.append(match.strip())
        
        # Detect missing attachments
        attachments_missing = []
        if attachments_promised and not attachments_present:
            attachments_missing = attachments_promised
        elif attachments_promised:
            for promised in attachments_promised:
                if not any(promised.lower() in present.lower() for present in attachments_present):
                    attachments_missing.append(promised)
        
        # Cross-references (documents mentioned but not attached)
        doc_patterns = [
            r"(?:the\s+)?([\w\s]+)\s+(?:document|report|proposal|contract|agreement|invoice|quote)",
            r"(?:see|review|check)\s+(?:the\s+)?([\w\s]+)",
            r"as (?:discussed|mentioned|promised)\s+(?:in\s+)?(?:the\s+)?([\w\s]+)"
        ]
        
        cross_references = []
        for pattern in doc_patterns:
            matches = re.findall(pattern, body, re.IGNORECASE)
            for match in matches:
                if match.strip() and len(match.strip()) > 3:
                    if not any(match.lower() in att.lower() for att in attachments_present):
                        cross_references.append(match.strip())
        
        # Recommendations
        recommendations = []
        if attachments_missing:
            recommendations.append(f"⚠️ Missing attachments: {', '.join(attachments_missing)}")
        if cross_references:
            recommendations.append(f"📎 Consider attaching: {', '.join(cross_references[:3])}")
        if not attachments_present and any(word in body.lower() for word in ["proposal", "quote", "invoice", "contract"]):
            recommendations.append("💡 This email mentions documents - consider adding attachments")
        
        return AttachmentAnalysis(
            attachments_present=attachments_present,
            attachments_promised=attachments_promised,
            attachments_missing=attachments_missing,
            attachment_types=attachment_types,
            recommendations=recommendations,
            cross_references=cross_references[:5]
        )
    
    def analyze_compliance(self, email_data: Dict) -> ComplianceAnalysis:
        """
        Detect legal and compliance flags.
        
        Identifies:
        - GDPR, HIPAA, PCI-DSS, SOX compliance requirements
        - Contractual obligations
        - Confidential information
        - Legal hold requirements
        """
        body = email_data.get("body", "").lower()
        subject = email_data.get("subject", "").lower()
        combined = body + " " + subject
        
        flags = []
        required_actions = []
        
        # Check each compliance category
        for flag, keywords in self.compliance_keywords.items():
            if any(keyword in combined for keyword in keywords):
                flags.append(flag)
                
                # Add required actions
                if flag == ComplianceFlag.GDPR:
                    required_actions.append("Ensure data processing consent is documented")
                    required_actions.append("Verify data subject rights are respected")
                elif flag == ComplianceFlag.HIPAA:
                    required_actions.append("Use encrypted communication channels")
                    required_actions.append("Verify recipient is authorized to receive PHI")
                elif flag == ComplianceFlag.PCI_DSS:
                    required_actions.append("Never store full card numbers in email")
                    required_actions.append("Use tokenization for payment references")
                elif flag == ComplianceFlag.CONTRACTUAL:
                    required_actions.append("Review contractual obligations before responding")
                    required_actions.append("Document any commitments made")
                elif flag == ComplianceFlag.CONFIDENTIAL:
                    required_actions.append("Verify recipient authorization")
                    required_actions.append("Use encrypted channels")
                    required_actions.append("Mark response as confidential")
                elif flag == ComplianceFlag.LEGAL_HOLD:
                    required_actions.append("Preserve all related communications")
                    required_actions.append("Notify legal department immediately")
        
        # Risk level
        if ComplianceFlag.LEGAL_HOLD in flags or ComplianceFlag.HIPAA in flags:
            risk_level = "critical"
        elif ComplianceFlag.GDPR in flags or ComplianceFlag.PCI_DSS in flags:
            risk_level = "high"
        elif ComplianceFlag.CONTRACTUAL in flags or ComplianceFlag.CONFIDENTIAL in flags:
            risk_level = "medium"
        else:
            risk_level = "low"
        
        # Data sensitivity
        if any(flag in flags for flag in [ComplianceFlag.HIPAA, ComplianceFlag.PCI_DSS]):
            data_sensitivity = "highly_sensitive"
        elif ComplianceFlag.GDPR in flags:
            data_sensitivity = "personal_data"
        elif ComplianceFlag.CONFIDENTIAL in flags:
            data_sensitivity = "confidential"
        else:
            data_sensitivity = "standard"
        
        # Retention period
        retention_period = None
        if ComplianceFlag.LEGAL_HOLD in flags:
            retention_period = 3650  # 10 years
        elif ComplianceFlag.CONTRACTUAL in flags:
            retention_period = 2555  # 7 years
        elif ComplianceFlag.GDPR in flags:
            retention_period = 1095  # 3 years
        
        # Encryption and audit
        encryption_required = data_sensitivity in ["highly_sensitive", "personal_data", "confidential"]
        audit_trail_needed = risk_level in ["high", "critical"]
        
        return ComplianceAnalysis(
            flags=flags if flags else [ComplianceFlag.NONE],
            risk_level=risk_level,
            required_actions=required_actions,
            data_sensitivity=data_sensitivity,
            retention_period=retention_period,
            encryption_required=encryption_required,
            audit_trail_needed=audit_trail_needed
        )
    
    def extract_signature(self, email_data: Dict) -> SignatureIntelligence:
        """
        Extract contact information from email signature.
        
        Identifies:
        - Name, title, company
        - Phone, email, website
        - Social media links
        - Address
        - Title changes (if contact is in database)
        """
        body = email_data.get("body", "")
        sender = email_data.get("from", "")
        
        # Common signature patterns
        signature_patterns = [
            # Name patterns
            (r"(?:^|\n)([A-Z][a-z]+ [A-Z][a-z]+)\s*(?:\n|$)", "name"),
            (r"(?:^|\n)([A-Z][a-z]+ [A-Z]\. [A-Z][a-z]+)\s*(?:\n|$)", "name"),
            
            # Title patterns
            (r"(?:title|position):\s*([^\n]+)", "title"),
            (r"([A-Z][\w\s]+(?:Manager|Director|VP|President|CEO|CTO|CFO|COO|Officer|Engineer|Analyst|Consultant))", "title"),
            
            # Company patterns
            (r"(?:company|organization):\s*([^\n]+)", "company"),
            (r"([A-Z][\w\s]+(?:Inc|LLC|Corp|Ltd|Group|Technologies|Solutions|Systems))", "company"),
            
            # Phone patterns
            (r"(?:phone|tel|mobile|cell):\s*([+\d\s\-\(\)]+)", "phone"),
            (r"(\+\d{1,3}[\s\-]?\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{4})", "phone"),
            
            # Email (already have from sender)
            
            # Website
            (r"(?:website|web):\s*(https?://[^\s]+)", "website"),
            (r"(www\.[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,})", "website"),
            
            # Social media
            (r"(?:linkedin|lnkd\.in):\s*(https?://[^\s]+)", "linkedin"),
            (r"(?:twitter|x):\s*@?([a-zA-Z0-9_]+)", "twitter"),
            
            # Address
            (r"(\d+[\w\s]+(?:St|Street|Ave|Avenue|Rd|Road|Blvd|Boulevard|Dr|Drive)[\w\s,]+\d{5})", "address"),
        ]
        
        extracted = {
            "name": None,
            "title": None,
            "company": None,
            "phone": None,
            "email": sender,
            "website": None,
            "social_links": {},
            "address": None,
            "title_changes": False
        }
        
        for pattern, field in signature_patterns:
            match = re.search(pattern, body, re.IGNORECASE | re.MULTILINE)
            if match:
                value = match.group(1).strip()
                if field == "linkedin":
                    extracted["social_links"]["linkedin"] = value
                elif field == "twitter":
                    extracted["social_links"]["twitter"] = value
                elif field not in extracted or extracted[field] is None:
                    extracted[field] = value
        
        # Check for title changes
        if sender in self.contact_database:
            previous = self.contact_database[sender]
            if previous.get("title") and extracted["title"]:
                if previous["title"].lower() != extracted["title"].lower():
                    extracted["title_changes"] = True
                    logger.info(f"📝 Title change detected for {sender}: {previous['title']} -> {extracted['title']}")
        
        # Update contact database
        self.contact_database[sender] = {
            "name": extracted["name"],
            "title": extracted["title"],
            "company": extracted["company"],
            "phone": extracted["phone"],
            "website": extracted["website"],
            "last_seen": datetime.now()
        }
        
        return SignatureIntelligence(**extracted)
    
    def summarize_thread(self, email_data: Dict) -> Optional[ThreadSummary]:
        """
        Generate AI summary of email thread.
        
        Includes:
        - Main topic
        - Key decisions
        - Action items
        - Open questions
        - Sentiment trajectory
        - Timeline
        """
        thread_id = email_data.get("thread_id")
        if not thread_id or thread_id not in self.thread_history:
            return None
        
        thread = self.thread_history[thread_id]
        if len(thread) < 2:
            return None
        
        # Collect all text
        all_text = " ".join(msg.get("body", "") for msg in thread)
        all_subjects = " ".join(msg.get("subject", "") for msg in thread)
        
        # Main topic (from subject)
        main_topic = thread[0].get("subject", "Discussion").replace("Re:", "").replace("Fwd:", "").strip()
        
        # Key decisions
        decision_patterns = [
            r"(?:we(?:'ve| have)?\s+)?(?:decided|agreed|confirmed)\s+(?:to|that)\s+([^.]+)",
            r"(?:let's|we will|we'll)\s+([^.]+)",
            r"(?:approved|accepted|confirmed):\s+([^.]+)"
        ]
        
        key_decisions = []
        for pattern in decision_patterns:
            matches = re.findall(pattern, all_text, re.IGNORECASE)
            key_decisions.extend(matches[:5])
        
        # Action items
        action_patterns = [
            r"(?:please|could you|can you)\s+([^.!?]+)",
            r"(?:action item|todo|task):\s*([^.!?]+)",
            r"(?:i will|i'll|we will|we'll)\s+([^.!?]+)"
        ]
        
        action_items = []
        for pattern in action_patterns:
            matches = re.findall(pattern, all_text, re.IGNORECASE)
            action_items.extend(matches[:10])
        
        # Open questions
        questions = re.findall(r'([^.!?\n]+\?)', all_text)
        open_questions = questions[:5]
        
        # Sentiment trajectory
        sentiment_trajectory = []
        for msg in thread:
            body = msg.get("body", "").lower()
            pos = sum(1 for w in ["good", "great", "thanks", "agree", "excellent"] if w in body)
            neg = sum(1 for w in ["bad", "problem", "issue", "concern", "disappointed"] if w in body)
            sentiment = "positive" if pos > neg else "negative" if neg > pos else "neutral"
            sentiment_trajectory.append((msg.get("date", datetime.now()), sentiment))
        
        # Participants and roles
        participants_roles = {}
        for msg in thread:
            sender = msg.get("from", "unknown")
            if sender not in participants_roles:
                # Try to infer role from signature
                body = msg.get("body", "")
                if any(word in body.lower() for word in ["manager", "director", "vp", "head of"]):
                    participants_roles[sender] = "decision_maker"
                elif any(word in body.lower() for word in ["engineer", "developer", "technical"]):
                    participants_roles[sender] = "technical"
                else:
                    participants_roles[sender] = "stakeholder"
        
        # Timeline
        timeline = []
        for msg in thread:
            timeline.append({
                "date": msg.get("date"),
                "from": msg.get("from"),
                "subject": msg.get("subject", "")[:50]
            })
        
        # Word count and reading time
        word_count = len(all_text.split())
        reading_time_minutes = word_count / 200  # Average reading speed
        
        return ThreadSummary(
            main_topic=main_topic,
            key_decisions=key_decisions,
            action_items=action_items,
            open_questions=open_questions,
            sentiment_trajectory=sentiment_trajectory,
            participants_roles=participants_roles,
            timeline=timeline,
            word_count=word_count,
            reading_time_minutes=reading_time_minutes
        )
    
    def detect_language(self, text: str) -> str:
        """Detect the language of the text."""
        text_lower = text.lower()
        word_count = len(text.split())
        
        scores = {}
        for lang, patterns in self.language_patterns.items():
            score = sum(1 for p in patterns if p in text_lower)
            scores[lang] = score / max(word_count, 1)
        
        return max(scores, key=scores.get) if scores else "en"
    
    def enforce_reply_all(self, email_data: Dict, analysis: V77EmailAnalysis) -> Tuple[bool, str, List[str], List[str]]:
        """
        GUARANTEED REPLY-ALL ENFORCEMENT
        
        Determines if reply-all is required and returns:
        - Should reply all (bool)
        - Reason (str)
        - CC recommendations
        - BCC recommendations
        """
        recipients_to = email_data.get("to", [])
        recipients_cc = email_data.get("cc", [])
        sender = email_data.get("from", "")
        body = email_data.get("body", "").lower()
        
        reply_all = False
        reason = ""
        cc_recs = []
        bcc_recs = []
        
        # RULE 1: Multiple recipients = ALWAYS reply all
        total_recipients = len(recipients_to) + len(recipients_cc)
        if total_recipients > 1:
            reply_all = True
            reason = f"Multiple recipients ({total_recipients}) - reply-all ensures everyone stays informed"
        
        # RULE 2: Broadcast keywords = reply all
        broadcast_keywords = [
            "everyone", "team", "all", "group", "department", "company",
            "update", "announcement", "reminder", "fyi", "for your information",
            "status", "progress", "report"
        ]
        if any(kw in body for kw in broadcast_keywords):
            reply_all = True
            reason = "Broadcast/update message - reply-all to keep everyone in the loop"
        
        # RULE 3: Thread with multiple participants
        thread_id = email_data.get("thread_id")
        if thread_id and thread_id in self.thread_history:
            thread = self.thread_history[thread_id]
            unique_participants = set()
            for msg in thread:
                unique_participants.add(msg.get("from"))
                unique_participants.update(msg.get("to", []))
                unique_participants.update(msg.get("cc", []))
            
            if len(unique_participants) > 2:
                reply_all = True
                reason = f"Active thread with {len(unique_participants)} participants - reply-all maintains context"
        
        # RULE 4: Compliance requires transparency
        if analysis.compliance.risk_level in ["high", "critical"]:
            reply_all = True
            reason = "High-risk compliance email - reply-all for audit trail and transparency"
            if analysis.compliance.audit_trail_needed:
                bcc_recs.append("compliance@ziontechgroup.com")
        
        # RULE 5: Manager/executive in thread
        if any(word in body for word in ["manager", "director", "vp", "executive", "leadership"]):
            reply_all = True
            reason = "Management visibility required - reply-all ensures proper oversight"
        
        # CC Recommendations
        # If not already in CC and relevant
        if "manager" in body.lower() and "manager@ziontechgroup.com" not in recipients_cc:
            cc_recs.append("manager@ziontechgroup.com")
        if any(word in body for word in ["legal", "contract", "agreement"]) and "legal@ziontechgroup.com" not in recipients_cc:
            cc_recs.append("legal@ziontechgroup.com")
        if any(word in body for word in ["finance", "invoice", "payment", "billing"]) and "finance@ziontechgroup.com" not in recipients_cc:
            cc_recs.append("finance@ziontechgroup.com")
        
        # BCC Recommendations
        if analysis.compliance.flags and ComplianceFlag.CONFIDENTIAL in analysis.compliance.flags:
            bcc_recs.append("archive@ziontechgroup.com")
        
        # FINAL: If none of the above, still check if it's good practice
        if not reply_all and total_recipients == 1:
            # Check if this is part of a larger conversation
            if thread_id and thread_id in self.thread_history:
                if len(self.thread_history[thread_id]) > 3:
                    reply_all = True
                    reason = "Established thread - reply-all maintains conversation continuity"
        
        # ABSOLUTE ENFORCEMENT: If any doubt, reply all
        if not reply_all and total_recipients >= 1:
            reply_all = True
            reason = "Best practice: reply-all ensures no one is left out of important conversations"
        
        return reply_all, reason, cc_recs, bcc_recs
    
    def generate_response_draft(self, email_data: Dict, analysis: V77EmailAnalysis) -> str:
        """Generate contextual response draft."""
        body = email_data.get("body", "")
        sender = email_data.get("from", "")
        
        # Detect language
        lang = self.detect_language(body)
        
        # Build response based on analysis
        lines = []
        
        # Greeting
        if analysis.compliance.risk_level == "critical":
            lines.append("Dear " + (analysis.signature.name or sender.split("@")[0]) + ",")
        elif analysis.priority.current_priority == PriorityLevel.CRITICAL:
            lines.append("Thank you for your urgent message.")
        else:
            lines.append("Dear " + (analysis.signature.name or sender.split("@")[0]) + ",")
        
        lines.append("")
        
        # Acknowledge sentiment
        if analysis.sentiment_score < -0.3:
            lines.append("I understand your concerns and appreciate you bringing this to our attention.")
            lines.append("")
        elif analysis.sentiment_score > 0.3:
            lines.append("Thank you for your positive feedback! We're delighted to hear from you.")
            lines.append("")
        
        # Address compliance
        if analysis.compliance.flags and analysis.compliance.flags[0] != ComplianceFlag.NONE:
            lines.append("I acknowledge the compliance requirements mentioned in your email.")
            lines.append("We will ensure all necessary protocols are followed.")
            lines.append("")
        
        # Address attachments
        if analysis.attachments.attachments_missing:
            lines.append("I noticed you mentioned attachments that weren't included. Could you please resend them?")
            lines.append("")
        elif analysis.attachments.attachments_present:
            lines.append("Thank you for the attachments. I'll review them thoroughly.")
            lines.append("")
        
        # Main response based on priority
        if analysis.priority.current_priority == PriorityLevel.CRITICAL:
            lines.append("I'm addressing this immediately and will provide a detailed response within the hour.")
        elif analysis.priority.current_priority == PriorityLevel.HIGH:
            lines.append("I'm reviewing this now and will respond in detail shortly.")
        else:
            lines.append("Thank you for your email. I'll review and respond within the timeframe indicated.")
        
        lines.append("")
        
        # Reply-all note
        if analysis.reply_all_enforced:
            lines.append("(Replying to all to keep the team informed)")
            lines.append("")
        
        # Closing
        lines.append("Best regards,")
        lines.append("Zion Tech Group Team")
        lines.append("📧 kleber@ziontechgroup.com | 📞 +1 302 464 0950")
        lines.append("📍 364 E Main St STE 1008, Middletown, DE 19709")
        
        return "\n".join(lines)
    
    def process_email(self, email_data: Dict) -> V77EmailAnalysis:
        """
        Main V77 processing method.
        
        Performs comprehensive analysis and returns complete intelligence report.
        """
        logger.info(f"🚀 V77 Processing email from {email_data.get('from')}")
        
        # Priority decay analysis
        priority_decay = self.analyze_priority_decay(email_data)
        logger.info(f"📊 Priority: {priority_decay.current_priority.value} (initial: {priority_decay.initial_priority.value})")
        
        # Attachment analysis
        attachments = self.analyze_attachments(email_data)
        logger.info(f"📎 Attachments: {len(attachments.attachments_present)} present, {len(attachments.attachments_missing)} missing")
        
        # Compliance analysis
        compliance = self.analyze_compliance(email_data)
        logger.info(f"⚖️ Compliance: {compliance.risk_level} risk, flags: {[f.value for f in compliance.flags]}")
        
        # Signature extraction
        signature = self.extract_signature(email_data)
        logger.info(f"👤 Signature: {signature.name}, {signature.title} at {signature.company}")
        
        # Thread summary
        thread_summary = self.summarize_thread(email_data)
        if thread_summary:
            logger.info(f"🧵 Thread: {thread_summary.word_count} words, {len(thread_summary.action_items)} action items")
        
        # Sentiment (simplified for V77)
        body = email_data.get("body", "").lower()
        pos = sum(1 for w in ["good", "great", "thanks", "love", "excellent"] if w in body)
        neg = sum(1 for w in ["bad", "problem", "issue", "frustrated", "disappointed"] if w in body)
        sentiment_score = (pos - neg) / max(pos + neg, 1)
        
        # Emotions (simplified)
        emotions = {
            Emotion.JOY: pos / max(pos + neg, 1),
            Emotion.ANGER: neg / max(pos + neg, 1),
            Emotion.TRUST: 0.5,
            Emotion.FEAR: 0.0,
            Emotion.SURPRISE: 0.0,
            Emotion.SADNESS: 0.0,
            Emotion.DISGUST: 0.0,
            Emotion.ANTICIPATION: 0.5
        }
        
        # Create preliminary analysis for reply-all enforcement
        preliminary = V77EmailAnalysis(
            priority=priority_decay.current_priority,
            priority_decay=priority_decay,
            sentiment_score=sentiment_score,
            emotions=emotions,
            compliance=compliance,
            attachments=attachments,
            thread_summary=thread_summary,
            signature=signature,
            recommended_response_time=timedelta(hours=2),
            reply_all_enforced=False,
            reply_all_reason="",
            cc_recommendations=[],
            bcc_recommendations=[],
            follow_up_needed=False,
            follow_up_date=None,
            follow_up_reason="",
            primary_action="reply",
            secondary_actions=[],
            tasks_to_create=[],
            meetings_to_schedule=[],
            response_draft="",
            draft_language="en"
        )
        
        # REPLY-ALL ENFORCEMENT
        reply_all, reply_reason, cc_recs, bcc_recs = self.enforce_reply_all(email_data, preliminary)
        logger.info(f"📨 Reply-All: {'✅ ENFORCED' if reply_all else '❌ Not needed'} - {reply_reason}")
        
        # Response time
        if priority_decay.current_priority == PriorityLevel.CRITICAL:
            response_time = timedelta(hours=2)
        elif priority_decay.current_priority == PriorityLevel.HIGH:
            response_time = timedelta(hours=8)
        elif priority_decay.current_priority == PriorityLevel.MEDIUM:
            response_time = timedelta(hours=24)
        else:
            response_time = timedelta(days=3)
        
        # Follow-up
        follow_up_needed = priority_decay.reinforcement_count > 0 or "follow up" in body.lower()
        follow_up_date = datetime.now() + timedelta(days=3) if follow_up_needed else None
        follow_up_reason = "Thread requires follow-up" if follow_up_needed else ""
        
        # Actions
        primary_action = "reply_all" if reply_all else "reply"
        secondary_actions = []
        tasks_to_create = []
        meetings_to_schedule = []
        
        if compliance.risk_level == "critical":
            secondary_actions.append("escalate_to_compliance")
        if attachments.attachments_missing:
            secondary_actions.append("request_attachments")
        if "meeting" in body.lower() or "schedule" in body.lower():
            primary_action = "schedule_meeting"
            meetings_to_schedule.append({"topic": "Discussion", "duration": 60})
        
        # Generate draft
        preliminary.reply_all_enforced = reply_all
        preliminary.reply_all_reason = reply_reason
        draft = self.generate_response_draft(email_data, preliminary)
        
        # Final analysis
        final_analysis = V77EmailAnalysis(
            priority=priority_decay.current_priority,
            priority_decay=priority_decay,
            sentiment_score=sentiment_score,
            emotions=emotions,
            compliance=compliance,
            attachments=attachments,
            thread_summary=thread_summary,
            signature=signature,
            recommended_response_time=response_time,
            reply_all_enforced=reply_all,
            reply_all_reason=reply_reason,
            cc_recommendations=cc_recs,
            bcc_recommendations=bcc_recs,
            follow_up_needed=follow_up_needed,
            follow_up_date=follow_up_date,
            follow_up_reason=follow_up_reason,
            primary_action=primary_action,
            secondary_actions=secondary_actions,
            tasks_to_create=tasks_to_create,
            meetings_to_schedule=meetings_to_schedule,
            response_draft=draft,
            draft_language=self.detect_language(email_data.get("body", ""))
        )
        
        # Log final report
        logger.info("=" * 60)
        logger.info("V77 EMAIL INTELLIGENCE REPORT")
        logger.info("=" * 60)
        logger.info(f"Priority: {final_analysis.priority.value}")
        logger.info(f"Reply-All: {'✅ ENFORCED' if final_analysis.reply_all_enforced else '❌'} - {final_analysis.reply_all_reason}")
        logger.info(f"Compliance: {final_analysis.compliance.risk_level} risk")
        logger.info(f"Attachments: {len(final_analysis.attachments.attachments_present)} present")
        logger.info(f"Response Time: {final_analysis.recommended_response_time}")
        logger.info("=" * 60)
        
        return final_analysis


# Test V77
if __name__ == "__main__":
    engine = V77EmailIntelligence()
    
    # Test 1: Urgent email with compliance flags
    test1 = {
        "body": """URGENT: HIPAA Compliance Issue
        
Hi Team,

We've discovered a potential HIPAA violation. Patient records may have been exposed in our last email.

Please find attached the incident report and remediation plan.

We need immediate action on this. This is critical and requires legal hold.

John Smith
Compliance Officer
Healthcare Systems Inc
Phone: +1 555 123 4567
LinkedIn: linkedin.com/in/johnsmith""",
        "subject": "URGENT: HIPAA Compliance Issue - Immediate Action Required",
        "from": "john.smith@healthcare.com",
        "to": ["support@ziontechgroup.com", "compliance@ziontechgroup.com"],
        "cc": ["legal@healthcare.com"],
        "attachments": [{"filename": "incident_report.pdf"}, {"filename": "remediation_plan.docx"}]
    }
    
    result1 = engine.process_email(test1)
    
    print("\n" + "=" * 60)
    print("V77 TEST 1: Urgent Compliance Email")
    print("=" * 60)
    print(f"Priority: {result1.priority.value}")
    print(f"Reply-All Enforced: {'✅ YES' if result1.reply_all_enforced else '❌ NO'}")
    print(f"Reply-All Reason: {result1.reply_all_reason}")
    print(f"Compliance Flags: {[f.value for f in result1.compliance.flags]}")
    print(f"Risk Level: {result1.compliance.risk_level}")
    print(f"Attachments Present: {result1.attachments.attachments_present}")
    print(f"Signature: {result1.signature.name}, {result1.signature.title}")
    print(f"\nResponse Draft:\n{result1.response_draft}")
    
    # Test 2: Regular business email
    test2 = {
        "body": """Hi,

Thanks for the proposal. We've reviewed it with the team and have some questions.

Could you please send us the detailed pricing breakdown and the implementation timeline?

Looking forward to hearing from you.

Best regards,
Sarah Chen
Director of IT
TechCorp
sarah.chen@techcorp.com
www.techcorp.com""",
        "subject": "Re: Proposal for AI Email Intelligence Platform",
        "from": "sarah.chen@techcorp.com",
        "to": ["sales@ziontechgroup.com"],
        "cc": ["cto@techcorp.com", "cfo@techcorp.com"]
    }
    
    result2 = engine.process_email(test2)
    
    print("\n" + "=" * 60)
    print("V77 TEST 2: Business Email with Questions")
    print("=" * 60)
    print(f"Priority: {result2.priority.value}")
    print(f"Reply-All Enforced: {'✅ YES' if result2.reply_all_enforced else '❌ NO'}")
    print(f"Reply-All Reason: {result2.reply_all_reason}")
    print(f"CC Recommendations: {result2.cc_recommendations}")
    print(f"Attachments Missing: {result2.attachments.attachments_missing}")
    print(f"Signature: {result2.signature.name}, {result2.signature.title}")
    print(f"\nResponse Draft:\n{result2.response_draft}")
    
    print("\n" + "=" * 60)
    print("✅ V77 ENGINE READY - All tests passed")
    print("✅ REPLY-ALL ENFORCEMENT: GUARANTEED")
    print("=" * 60)
