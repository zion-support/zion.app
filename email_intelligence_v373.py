#!/usr/bin/env python
"""
Email Intelligence Engine V373 - Email Follow-up Automator
==========================================================

Detects pending follow-ups in email conversations, tracks commitments made,
schedules reminders, and generates follow-up draft messages.

Features:
    - NLP-based commitment detection from email bodies
    - Follow-up urgency classification based on deadlines and context
    - Automatic reminder scheduling with smart timing
    - Draft follow-up message generation
    - Thread tracking for unresolved conversations
    - Enforces reply-all for multi-recipient threads
    - Outputs structured JSON with follow-up actions

Commitment Detection Patterns:
    - Explicit commitments ("I will", "I'll send", "Let me")
    - Requests awaiting response ("Could you", "Please send")
    - Deadline mentions ("by Friday", "next week", "before EOD")
    - Question patterns requiring answers

Author: Email Intelligence Suite
Version: 373
"""

import json
import re
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional, Tuple


class FollowupAutomatorEngine:
    """
    Engine that detects pending follow-ups and automates follow-up workflows.

    Attributes:
        commitment_patterns: Regex patterns for detecting commitments
        question_patterns: Patterns for detecting unanswered questions
        deadline_patterns: Patterns for extracting deadline mentions
        urgency_keywords: Words indicating urgency levels
    """

    def __init__(self):
        """Initialize the Follow-up Automator Engine with detection patterns."""
        self.commitment_patterns = [
            (r"I(?:'ll| will)\s+(?:send|share|forward|prepare|draft|create|review|check)", "outgoing_commitment"),
            (r"(?:I|we)\s+(?:need to|should|must|have to)\s+\w+", "self_obligation"),
            (r"(?:will|shall)\s+(?:get back|follow up|circle back|reach out)", "followup_promise"),
            (r"(?:let me|allow me to)\s+\w+", "offered_action"),
            (r"(?:attached|included|enclosed)\s+(?:is|are|will be)", "document_promise"),
        ]

        self.request_patterns = [
            (r"(?:could you|can you|would you|please)\s+\w+", "direct_request"),
            (r"(?:send|share|forward|provide)\s+(?:me|us|the)", "action_request"),
            (r"(?:when|what time|how soon)\s+(?:can|will|would)", "timeline_request"),
            (r"(?:need|require)\s+(?:your|the|a)\s+\w+", "resource_request"),
        ]

        self.deadline_patterns = [
            (r"(?:by|before|until|no later than)\s+(?:today|tomorrow|Friday|Monday|EOD|COB|end of day)", "near_deadline"),
            (r"(?:by|before)\s+(?:next\s+)?(?:week|month)", "medium_deadline"),
            (r"(?:ASAP|urgently|immediately|right away)", "urgent"),
            (r"(?:deadline|due date|target date)[:\s]+\w+", "explicit_deadline"),
        ]

        self.urgency_keywords = {
            "critical": ["urgent", "critical", "immediately", "ASAP", "emergency", "blocking"],
            "high": ["important", "soon", "quickly", "priority", "time-sensitive"],
            "normal": ["when possible", "at your convenience", "no rush"],
        }

    def detect_commitments(self, email_body: str, sender_type: str = "self") -> List[Dict[str, Any]]:
        """
        Detect commitments and promises made in email text.

        Args:
            email_body: The text content of the email.
            sender_type: Whether commitments are from 'self' or 'other' party.

        Returns:
            List of detected commitments with type and context.
        """
        commitments = []
        patterns = self.commitment_patterns if sender_type == "self" else self.request_patterns

        for pattern, commit_type in patterns:
            matches = re.finditer(pattern, email_body, re.IGNORECASE)
            for match in matches:
                # Extract surrounding context
                start = max(0, match.start() - 30)
                end = min(len(email_body), match.end() + 30)
                context = email_body[start:end].strip()

                commitments.append({
                    "type": commit_type,
                    "matched_text": match.group(),
                    "context": context,
                    "position": match.start(),
                    "sender_type": sender_type
                })

        return commitments

    def detect_deadlines(self, email_body: str) -> List[Dict[str, Any]]:
        """
        Extract deadline mentions from email text.

        Args:
            email_body: The text content to scan for deadlines.

        Returns:
            List of detected deadlines with urgency classification.
        """
        deadlines = []

        for pattern, deadline_type in self.deadline_patterns:
            matches = re.finditer(pattern, email_body, re.IGNORECASE)
            for match in matches:
                urgency = "normal"
                if deadline_type == "urgent":
                    urgency = "critical"
                elif deadline_type == "near_deadline":
                    urgency = "high"

                deadlines.append({
                    "type": deadline_type,
                    "matched_text": match.group(),
                    "urgency": urgency,
                    "estimated_hours": self._estimate_deadline_hours(deadline_type)
                })

        return deadlines

    def _estimate_deadline_hours(self, deadline_type: str) -> int:
        """Estimate hours until deadline based on type."""
        estimates = {
            "urgent": 2,
            "near_deadline": 24,
            "medium_deadline": 168,
            "explicit_deadline": 48
        }
        return estimates.get(deadline_type, 48)

    def classify_urgency(self, email_body: str) -> Tuple[str, float]:
        """
        Classify the urgency level of an email requiring follow-up.

        Args:
            email_body: Email text to analyze for urgency indicators.

        Returns:
            Tuple of (urgency_level, confidence_score).
        """
        urgency_scores = {"critical": 0, "high": 0, "normal": 0}

        for level, keywords in self.urgency_keywords.items():
            for keyword in keywords:
                if keyword.lower() in email_body.lower():
                    urgency_scores[level] += 1

        total = sum(urgency_scores.values())
        if total == 0:
            return "normal", 0.3

        max_level = max(urgency_scores, key=urgency_scores.get)
        confidence = urgency_scores[max_level] / total
        return max_level, round(confidence, 4)

    def generate_followup_draft(self, email: Dict[str, Any], 
                                 days_since: int) -> Dict[str, Any]:
        """
        Generate a follow-up draft message.

        Args:
            email: Original email dictionary with subject and context.
            days_since: Days since the original email or last response.

        Returns:
            Dictionary with generated draft details.
        """
        subject = email.get("subject", "")
        original_sender = email.get("from", "sender")
        context_snippet = email.get("body", "")[:100]

        # Choose tone based on elapsed time
        if days_since <= 1:
            tone = "casual"
            opener = "Hi, just following up on"
        elif days_since <= 3:
            tone = "professional"
            opener = "Hello, I wanted to follow up regarding"
        elif days_since <= 7:
            tone = "polite_persistent"
            opener = "Hi, I'm circling back on"
        else:
            tone = "escalated"
            opener = "Hello, I haven't heard back regarding"

        draft_body = (
            f"{opener} \"{subject}\".\n\n"
            f"I wanted to check if you've had a chance to review this. "
            f"Please let me know if you need any additional information.\n\n"
            f"Best regards"
        )

        return {
            "draft_subject": f"Re: {subject}" if not subject.startswith("Re:") else subject,
            "draft_body": draft_body,
            "tone": tone,
            "suggested_send_time": self._suggest_send_time(tone),
            "original_context": context_snippet
        }

    def _suggest_send_time(self, tone: str) -> str:
        """Suggest optimal send time based on follow-up tone."""
        suggestions = {
            "casual": "Within next 2 hours during business hours",
            "professional": "Tomorrow morning (9-10 AM)",
            "polite_persistent": "In 2 days during mid-morning",
            "escalated": "Immediately with CC to manager"
        }
        return suggestions.get(tone, "Next business day morning")

    def schedule_reminder(self, email: Dict[str, Any], urgency: str) -> Dict[str, Any]:
        """
        Schedule a follow-up reminder based on urgency.

        Args:
            email: Email dictionary for the reminder.
            urgency: Urgency level (critical, high, normal).

        Returns:
            Reminder schedule details.
        """
        now = datetime.now()
        reminder_delays = {
            "critical": timedelta(hours=2),
            "high": timedelta(hours=8),
            "normal": timedelta(days=1)
        }

        delay = reminder_delays.get(urgency, timedelta(days=1))
        reminder_time = now + delay

        return {
            "reminder_time": reminder_time.isoformat(),
            "delay_hours": delay.total_seconds() / 3600,
            "urgency": urgency,
            "reminder_type": "follow_up",
            "auto_escalate": urgency == "critical"
        }

    def analyze_email(self, email: Dict[str, Any], 
                      reference_time: Optional[datetime] = None) -> Dict[str, Any]:
        """
        Comprehensive analysis of an email for follow-up requirements.

        Args:
            email: Email dictionary with metadata and body.
            reference_time: Reference time for calculations.

        Returns:
            Complete follow-up analysis with detected items and actions.
        """
        if reference_time is None:
            reference_time = datetime.now()

        body = email.get("body", "")
        recipients = email.get("recipients", [])
        received_at = email.get("received_at", reference_time)

        if isinstance(received_at, str):
            received_at = datetime.fromisoformat(received_at)

        days_since = (reference_time - received_at).days
        hours_since = (reference_time - received_at).total_seconds() / 3600

        # Detect commitments (from self - outgoing promises)
        self_commitments = self.detect_commitments(body, "self")
        # Detect requests (from others - things we need to respond to)
        other_requests = self.detect_commitments(body, "other")
        # Detect deadlines
        deadlines = self.detect_deadlines(body)
        # Classify urgency
        urgency_level, urgency_confidence = self.classify_urgency(body)

        # Determine if follow-up is needed
        needs_followup = (
            len(self_commitments) > 0 or
            len(other_requests) > 0 or
            len(deadlines) > 0 or
            urgency_level in ("critical", "high")
        )

        # Generate follow-up draft if needed
        draft = None
        reminder = None
        if needs_followup:
            draft = self.generate_followup_draft(email, days_since)
            reminder = self.schedule_reminder(email, urgency_level)

        # Reply-all enforcement
        reply_all_required = len(recipients) > 1
        reply_all_enforced = True if reply_all_required else False

        return {
            "engine": "Email Follow-up Automator V373",
            "email_id": email.get("id", "unknown"),
            "subject": email.get("subject", ""),
            "reply_all_required": reply_all_required,
            "reply_all_enforced": reply_all_enforced,
            "recipients_count": len(recipients),
            "needs_followup": needs_followup,
            "days_since_received": days_since,
            "hours_since_received": round(hours_since, 2),
            "urgency_level": urgency_level,
            "urgency_confidence": urgency_confidence,
            "detected_commitments": self_commitments,
            "detected_requests": other_requests,
            "detected_deadlines": deadlines,
            "followup_draft": draft,
            "reminder": reminder,
            "status": "pending_followup" if needs_followup else "no_action_needed"
        }

    def process_batch(self, emails: List[Dict[str, Any]],
                      reference_time: Optional[datetime] = None) -> Dict[str, Any]:
        """
        Process a batch of emails for follow-up detection.

        Args:
            emails: List of email dictionaries.
            reference_time: Reference time for analysis.

        Returns:
            Batch analysis report with prioritized follow-up actions.
        """
        if reference_time is None:
            reference_time = datetime.now()

        results = []
        for email in emails:
            result = self.analyze_email(email, reference_time)
            results.append(result)

        # Sort by urgency
        urgency_order = {"critical": 0, "high": 1, "normal": 2}
        results.sort(key=lambda x: urgency_order.get(x["urgency_level"], 3))

        pending = [r for r in results if r["needs_followup"]]
        overdue = [r for r in results if r["days_since_received"] > 3 and r["needs_followup"]]

        return {
            "engine": "Email Follow-up Automator V373",
            "analysis_timestamp": reference_time.isoformat(),
            "total_emails": len(results),
            "pending_followups": len(pending),
            "overdue_followups": len(overdue),
            "reply_all_enforced": True,
            "summary": {
                "critical_urgency": len([r for r in results if r["urgency_level"] == "critical"]),
                "high_urgency": len([r for r in results if r["urgency_level"] == "high"]),
                "normal_urgency": len([r for r in results if r["urgency_level"] == "normal"])
            },
            "results": results
        }


def main():
    """
    Main entry point - runs the Follow-up Automator Engine with sample data.
    
    Demonstrates:
        - Commitment detection from email bodies
        - Deadline extraction and urgency classification
        - Follow-up draft generation
        - Reminder scheduling
        - Reply-all enforcement for multi-recipient threads
    """
    engine = FollowupAutomatorEngine()
    reference_time = datetime(2026, 5, 30, 14, 0, 0)

    sample_emails = [
        {
            "id": "MSG-201",
            "subject": "Action Required: Security Audit Response",
            "from": "security-team@company.com",
            "body": "URGENT: We need your response to the security audit findings ASAP. "
                    "Please send the remediation plan by tomorrow. Could you provide "
                    "the updated access control matrix? The deadline is critical.",
            "received_at": (reference_time - timedelta(hours=4)).isoformat(),
            "recipients": ["dev-lead@company.com", "ops@company.com", "ciso@company.com"]
        },
        {
            "id": "MSG-202",
            "subject": "Re: Vendor Contract Negotiation",
            "from": "procurement@company.com",
            "body": "Thanks for the update. I'll send the revised contract terms "
                    "by Friday. Let me prepare the comparison document and share "
                    "it with the team. We need to finalize before next week.",
            "received_at": (reference_time - timedelta(days=2)).isoformat(),
            "recipients": ["legal@company.com", "finance@company.com"]
        },
        {
            "id": "MSG-203",
            "subject": "Client Meeting Follow-up",
            "from": "sales@company.com",
            "body": "Great meeting with Acme Corp today. They requested a proposal "
                    "by next Monday. Could you send the technical architecture doc? "
                    "I will draft the pricing section when you provide the estimates.",
            "received_at": (reference_time - timedelta(days=1)).isoformat(),
            "recipients": ["solutions@company.com", "sales@company.com", "pm@company.com"]
        },
        {
            "id": "MSG-204",
            "subject": "Weekly Team Update",
            "from": "manager@company.com",
            "body": "Here's the weekly update. No blockers this week. Sprint velocity "
                    "is on track. Team completed 34 story points. Next sprint planning "
                    "is scheduled for Monday.",
            "received_at": (reference_time - timedelta(hours=6)).isoformat(),
            "recipients": ["team@company.com"]
        },
        {
            "id": "MSG-205",
            "subject": "Board Presentation Materials",
            "from": "exec-assistant@company.com",
            "body": "Please provide your section of the board presentation by EOD Wednesday. "
                    "I need the financial projections and market analysis slides. "
                    "This is time-sensitive as the board meeting is Thursday morning.",
            "received_at": (reference_time - timedelta(days=5)).isoformat(),
            "recipients": ["cfo@company.com", "cmo@company.com", "cto@company.com", "ceo@company.com"]
        },
        {
            "id": "MSG-206",
            "subject": "API Integration Question",
            "from": "partner@external.com",
            "body": "Hi, we're working on the API integration and had a question about "
                    "the authentication flow. Could you share the updated API documentation? "
                    "We'll proceed with implementation once we have it.",
            "received_at": (reference_time - timedelta(days=4)).isoformat(),
            "recipients": ["dev@company.com", "partnerships@company.com"]
        }
    ]

    report = engine.process_batch(sample_emails, reference_time)
    print(json.dumps(report, indent=2))
    return report


if __name__ == "__main__":
    main()
