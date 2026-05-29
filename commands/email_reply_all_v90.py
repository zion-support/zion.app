#!/usr/bin/env python3
"""
V90: Smart Reply-All Intelligence
Advanced recipient management: when to include/exclude recipients,
BCC optimization, thread pruning, and reply-all safety checks.
"""

import re
import json
from datetime import datetime
from typing import Dict, List, Optional, Set, Tuple
from dataclasses import dataclass, field
from enum import Enum


class RecipientRole(Enum):
    PRIMARY = "primary"          # Main recipient, must be included
    CC_RELEVANT = "cc_relevant"  # Should stay in CC
    CC_OPTIONAL = "cc_optional"  # Can be removed from CC
    BCC = "bcc"                  # Should be BCC'd
    EXCLUDE = "exclude"          # Should be removed
    ESCALATION = "escalation"    # Add for escalation


class ReplyMode(Enum):
    REPLY_ALL = "reply_all"
    REPLY_SENDER = "reply_sender"
    REPLY_CUSTOM = "reply_custom"
    FORWARD = "forward"


@dataclass
class RecipientAnalysis:
    email: str
    name: Optional[str]
    role: RecipientRole
    reason: str
    domain: str
    is_internal: bool
    relationship_score: float  # 0-1, how important this person is
    last_interaction: Optional[datetime] = None
    interaction_count: int = 0


@dataclass
class ReplyAllDecision:
    original_to: List[str]
    original_cc: List[str]
    reply_to: List[str]
    reply_cc: List[str]
    reply_bcc: List[str]
    removed: List[Tuple[str, str]]  # (email, reason)
    added: List[Tuple[str, str]]    # (email, reason)
    mode: ReplyMode
    safety_warnings: List[str]
    confidence: float


class V90ReplyAllIntelligence:
    """
    V90: Smart Reply-All Intelligence
    
    Features:
    1. Intelligent recipient classification
    2. Reply-all safety checks (prevent embarrassing mistakes)
    3. Thread pruning (remove people who don't need to stay)
    4. BCC optimization (privacy protection)
    5. Escalation auto-addition
    6. Domain-based routing rules
    7. Interaction history tracking
    """
    
    INTERNAL_DOMAINS = ['ziontechgroup.com', 'zion.com']
    
    # Patterns that suggest reply-sender only
    REPLY_SENDER_PATTERNS = [
        r'please reply to me (?:directly|only|privately)',
        r'off[- ]?list',
        r'please don.?t reply all',
        r'reply (?:only )?to me',
        r'confidential',
        r'private',
        r'personal',
    ]
    
    # Patterns that suggest keeping everyone
    REPLY_ALL_PATTERNS = [
        r'team',
        r'everyone',
        r'all',
        r'loop in',
        r'keep (?:everyone|all) (?:in the loop|updated)',
        r'cc(?:.d)? (?:everyone|all)',
        r'please (?:all|everyone) (?:review|note|be aware)',
    ]
    
    # Sensitive content warnings
    SENSITIVE_PATTERNS = [
        r'salary', r'compensation', r'bonus',
        r'termination', r'fired', r'let go',
        r'confidential', r'secret', r'nda',
        r'password', r'credentials', r'api key',
        r'ssn', r'social security',
        r'credit card', r'bank account',
    ]
    
    def __init__(self):
        self.interaction_history: Dict[str, Dict] = {}
        self.domain_rules: Dict[str, Dict] = {}
        self.escalation_contacts: List[str] = ['kleber@ziontechgroup.com']
        self.reply_all_stats = {
            'total_decisions': 0,
            'reply_all_count': 0,
            'reply_sender_count': 0,
            'safety_warnings_triggered': 0,
            'recipients_removed': 0,
            'recipients_added': 0,
        }
    
    def analyze_recipients(self, email_data: Dict) -> ReplyAllDecision:
        """
        Analyze all recipients and determine optimal reply strategy.
        Always starts with REPLY ALL and prunes intelligently.
        """
        sender = email_data.get('from', '')
        to_list = email_data.get('to', [])
        cc_list = email_data.get('cc', [])
        bcc_list = email_data.get('bcc', [])
        subject = email_data.get('subject', '')
        body = email_data.get('body', '')
        
        # Analyze each recipient
        all_recipients = []
        for email in to_list:
            all_recipients.append(self._analyze_single_recipient(email, 'to', sender, body))
        for email in cc_list:
            all_recipients.append(self._analyze_single_recipient(email, 'cc', sender, body))
        
        # Determine reply mode
        mode = self._determine_reply_mode(sender, subject, body, all_recipients)
        
        # Build reply lists
        reply_to = []
        reply_cc = []
        reply_bcc = []
        removed = []
        added = []
        safety_warnings = []
        
        # ALWAYS include the original sender
        reply_to.append(sender)
        
        # ALWAYS include internal team members (reply-all enforcement)
        for r in all_recipients:
            if r.role == RecipientRole.EXCLUDE:
                removed.append((r.email, r.reason))
                continue
            
            if r.email == sender:
                continue  # Already in reply_to
            
            if r.role == RecipientRole.PRIMARY:
                if r.email not in reply_to:
                    reply_to.append(r.email)
            elif r.role == RecipientRole.CC_RELEVANT:
                if r.email not in reply_cc:
                    reply_cc.append(r.email)
            elif r.role == RecipientRole.CC_OPTIONAL:
                # Include by default (reply-all), but mark for potential pruning
                if r.email not in reply_cc:
                    reply_cc.append(r.email)
            elif r.role == RecipientRole.BCC:
                if r.email not in reply_bcc:
                    reply_bcc.append(r.email)
            elif r.role == RecipientRole.ESCALATION:
                if r.email not in reply_cc:
                    reply_cc.append(r.email)
                    added.append((r.email, 'Escalation contact added'))
        
        # Safety checks
        safety_warnings = self._run_safety_checks(body, reply_to + reply_cc, sender)
        
        # Add escalation contacts for urgent/sensitive emails
        if self._needs_escalation(subject, body):
            for esc in self.escalation_contacts:
                if esc not in reply_cc and esc not in reply_to:
                    reply_cc.append(esc)
                    added.append((esc, 'Auto-escalation for sensitive content'))
        
        # Calculate confidence
        confidence = self._calculate_confidence(all_recipients, safety_warnings)
        
        # Update stats
        self.reply_all_stats['total_decisions'] += 1
        if mode == ReplyMode.REPLY_ALL:
            self.reply_all_stats['reply_all_count'] += 1
        else:
            self.reply_all_stats['reply_sender_count'] += 1
        self.reply_all_stats['safety_warnings_triggered'] += len(safety_warnings)
        self.reply_all_stats['recipients_removed'] += len(removed)
        self.reply_all_stats['recipients_added'] += len(added)
        
        decision = ReplyAllDecision(
            original_to=to_list,
            original_cc=cc_list,
            reply_to=reply_to,
            reply_cc=reply_cc,
            reply_bcc=reply_bcc,
            removed=removed,
            added=added,
            mode=mode,
            safety_warnings=safety_warnings,
            confidence=confidence,
        )
        
        # Update interaction history
        self._update_interaction_history(sender, to_list + cc_list)
        
        return decision
    
    def _analyze_single_recipient(self, email: str, original_field: str, sender: str, body: str) -> RecipientAnalysis:
        """Analyze a single recipient's role."""
        name = self._extract_name(email)
        domain = self._extract_domain(email)
        is_internal = domain in self.INTERNAL_DOMAINS
        
        # Default role based on original field
        if original_field == 'to':
            role = RecipientRole.PRIMARY
        else:
            role = RecipientRole.CC_RELEVANT
        
        reason = f"Original {original_field} recipient"
        
        # Check for explicit exclusion requests
        if self._should_exclude(email, body):
            role = RecipientRole.EXCLUDE
            reason = "Explicitly requested removal or no-reply address"
        
        # Check for no-reply addresses
        if self._is_no_reply(email):
            role = RecipientRole.EXCLUDE
            reason = "No-reply/automated address"
        
        # Check for mailing lists
        if self._is_mailing_list(email):
            role = RecipientRole.BCC
            reason = "Mailing list - moved to BCC for privacy"
        
        # Internal team always stays
        if is_internal and email != sender:
            role = RecipientRole.CC_RELEVANT
            reason = "Internal team member - always included"
        
        # Check interaction history
        history = self.interaction_history.get(email, {})
        interaction_count = history.get('count', 0)
        last_interaction = history.get('last', None)
        relationship_score = min(interaction_count / 10.0, 1.0)
        
        return RecipientAnalysis(
            email=email,
            name=name,
            role=role,
            reason=reason,
            domain=domain,
            is_internal=is_internal,
            relationship_score=relationship_score,
            last_interaction=last_interaction,
            interaction_count=interaction_count,
        )
    
    def _determine_reply_mode(self, sender: str, subject: str, body: str, recipients: List[RecipientAnalysis]) -> ReplyMode:
        """Determine whether to reply-all or reply-sender."""
        text = (subject + ' ' + body).lower()
        
        # Check for explicit reply-sender requests
        for pattern in self.REPLY_SENDER_PATTERNS:
            if re.search(pattern, text, re.IGNORECASE):
                return ReplyMode.REPLY_SENDER
        
        # Check for explicit reply-all requests
        for pattern in self.REPLY_ALL_PATTERNS:
            if re.search(pattern, text, re.IGNORECASE):
                return ReplyMode.REPLY_ALL
        
        # Default: REPLY ALL (user's critical requirement)
        # Only switch to reply-sender if explicitly requested
        return ReplyMode.REPLY_ALL
    
    def _should_exclude(self, email: str, body: str) -> bool:
        """Check if recipient should be excluded."""
        # No-reply addresses
        if self._is_no_reply(email):
            return True
        
        # Check if email explicitly asks to be removed
        if email.lower() in body.lower() and 'remove' in body.lower():
            return True
        
        return False
    
    def _is_no_reply(self, email: str) -> bool:
        """Check if email is a no-reply address."""
        no_reply_patterns = ['no-reply', 'noreply', 'donotreply', 'do-not-reply', 'automated', 'notifications@', 'notify@']
        email_lower = email.lower()
        return any(p in email_lower for p in no_reply_patterns)
    
    def _is_mailing_list(self, email: str) -> bool:
        """Check if email is a mailing list."""
        list_patterns = ['-list@', '-group@', '-team@', '-all@', 'distribution', 'mailing-list']
        email_lower = email.lower()
        return any(p in email_lower for p in list_patterns)
    
    def _run_safety_checks(self, body: str, recipients: List[str], sender: str) -> List[str]:
        """Run safety checks before sending."""
        warnings = []
        
        # Check for sensitive content with external recipients
        has_sensitive = any(re.search(p, body, re.IGNORECASE) for p in self.SENSITIVE_PATTERNS)
        external_recipients = [r for r in recipients if not any(d in r for d in self.INTERNAL_DOMAINS)]
        
        if has_sensitive and external_recipients:
            warnings.append("⚠️ Sensitive content detected with external recipients. Review before sending.")
        
        # Check for large recipient count
        if len(recipients) > 20:
            warnings.append(f"⚠️ Large recipient count ({len(recipients)}). Consider using BCC for privacy.")
        
        # Check for mixed internal/external
        internal_count = sum(1 for r in recipients if any(d in r for d in self.INTERNAL_DOMAINS))
        external_count = len(recipients) - internal_count
        
        if internal_count > 0 and external_count > 0 and has_sensitive:
            warnings.append("⚠️ Mixed internal/external recipients with sensitive content.")
        
        # Check for attachments mentioned but not included
        if re.search(r'attach(?:ed|ment)', body, re.IGNORECASE) and 'attach' not in body.lower():
            warnings.append("⚠️ Email mentions attachments - verify they are included.")
        
        return warnings
    
    def _needs_escalation(self, subject: str, body: str) -> bool:
        """Check if email needs escalation."""
        text = (subject + ' ' + body).lower()
        escalation_keywords = ['legal', 'lawsuit', 'compliance', 'breach', 'security incident', 'data leak', 'gdpr', 'hipaa']
        return any(kw in text for kw in escalation_keywords)
    
    def _calculate_confidence(self, recipients: List[RecipientAnalysis], warnings: List[str]) -> float:
        """Calculate confidence in reply-all decision."""
        confidence = 0.8
        
        # More interaction history = higher confidence
        avg_interactions = sum(r.interaction_count for r in recipients) / max(len(recipients), 1)
        if avg_interactions > 5:
            confidence += 0.1
        
        # Safety warnings reduce confidence
        confidence -= len(warnings) * 0.1
        
        # Internal-only = higher confidence
        if all(r.is_internal for r in recipients):
            confidence += 0.05
        
        return max(0.3, min(confidence, 0.95))
    
    def _extract_name(self, email: str) -> Optional[str]:
        """Extract name from email address."""
        if '<' in email and '>' in email:
            return email.split('<')[0].strip()
        local = email.split('@')[0]
        return local.replace('.', ' ').replace('_', ' ').title()
    
    def _extract_domain(self, email: str) -> str:
        """Extract domain from email."""
        clean = re.sub(r'<|>', '', email)
        if '@' in clean:
            return clean.split('@')[1].strip()
        return ''
    
    def _update_interaction_history(self, sender: str, recipients: List[str]):
        """Update interaction history for all participants."""
        now = datetime.now()
        
        for email in [sender] + recipients:
            if email not in self.interaction_history:
                self.interaction_history[email] = {'count': 0, 'last': None}
            
            self.interaction_history[email]['count'] += 1
            self.interaction_history[email]['last'] = now
    
    def validate_reply_all(self, decision: ReplyAllDecision) -> Dict:
        """Validate the reply-all decision and return enforcement report."""
        report = {
            'valid': True,
            'reply_all_enforced': decision.mode == ReplyMode.REPLY_ALL,
            'recipients_included': len(decision.reply_to) + len(decision.reply_cc),
            'recipients_removed': len(decision.removed),
            'recipients_added': len(decision.added),
            'safety_warnings': len(decision.safety_warnings),
            'confidence': decision.confidence,
            'details': {
                'to': decision.reply_to,
                'cc': decision.reply_cc,
                'bcc': decision.reply_bcc,
                'removed': [{'email': e, 'reason': r} for e, r in decision.removed],
                'added': [{'email': e, 'reason': r} for e, r in decision.added],
                'warnings': decision.safety_warnings,
            }
        }
        
        # Check if any internal team members were accidentally removed
        internal_removed = [e for e, r in decision.removed if any(d in e for d in self.INTERNAL_DOMAINS)]
        if internal_removed:
            report['valid'] = False
            report['warning'] = f"Internal team members removed: {internal_removed}. Re-adding them."
            decision.reply_cc.extend(internal_removed)
        
        return report
    
    def get_stats(self) -> Dict:
        """Get reply-all intelligence statistics."""
        stats = self.reply_all_stats.copy()
        stats['unique_contacts'] = len(self.interaction_history)
        stats['reply_all_rate'] = stats['reply_all_count'] / max(stats['total_decisions'], 1) * 100
        return stats


if __name__ == "__main__":
    engine = V90ReplyAllIntelligence()
    
    # Test scenarios
    test_cases = [
        {
            'name': 'Team email with external client',
            'data': {
                'from': 'client@company.com',
                'to': ['kleber@ziontechgroup.com', 'dev@ziontechgroup.com'],
                'cc': ['manager@company.com', 'team-lead@company.com'],
                'subject': 'Project update needed',
                'body': 'Hi team, could you please provide an update on the project status? Thanks!',
            }
        },
        {
            'name': 'Sensitive financial email',
            'data': {
                'from': 'cfo@ziontechgroup.com',
                'to': ['kleber@ziontechgroup.com'],
                'cc': ['ceo@ziontechgroup.com', 'accountant@external.com'],
                'subject': 'Q4 salary adjustments',
                'body': 'Please review the attached salary adjustments for Q4. Confidential - do not share externally.',
            }
        },
        {
            'name': 'Spam with no-reply',
            'data': {
                'from': 'noreply@marketing.com',
                'to': ['kleber@ziontechgroup.com'],
                'cc': ['sales-all@marketing.com'],
                'subject': 'Special offer just for you!',
                'body': 'Click here to claim your prize! Reply to this email to unsubscribe.',
            }
        },
    ]
    
    for case in test_cases:
        print(f"\n{'='*60}")
        print(f"Scenario: {case['name']}")
        decision = engine.analyze_recipients(case['data'])
        validation = engine.validate_reply_all(decision)
        
        print(f"Reply Mode: {decision.mode.value}")
        print(f"Reply To: {decision.reply_to}")
        print(f"Reply CC: {decision.reply_cc}")
        print(f"Reply BCC: {decision.reply_bcc}")
        print(f"Removed: {decision.removed}")
        print(f"Added: {decision.added}")
        print(f"Warnings: {decision.safety_warnings}")
        print(f"Confidence: {decision.confidence:.2f}")
        print(f"Valid: {validation['valid']}")
    
    print(f"\n{'='*60}")
    print("Stats:", json.dumps(engine.get_stats(), indent=2))
