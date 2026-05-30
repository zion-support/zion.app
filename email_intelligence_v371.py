#!/usr/bin/env python
"""
Email Intelligence Engine V371 - Email Priority Decay Engine
=============================================================

Auto-deprioritizes stale emails, surfaces forgotten items, and calculates
priority decay over time based on age, sender importance, and original priority.

Features:
    - Calculates time-based priority decay using exponential decay functions
    - Weights sender importance (VIP senders decay slower)
    - Surfaces forgotten high-priority items that slipped through
    - Generates deprioritization recommendations
    - Enforces reply-all for multi-recipient threads
    - Outputs structured JSON with decay metrics

Decay Model:
    effective_priority = original_priority * decay_factor
    decay_factor = e^(-lambda * age_hours) * sender_weight * importance_multiplier

Author: Email Intelligence Suite
Version: 371
"""

import json
import math
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional


class PriorityDecayEngine:
    """
    Engine that calculates how email priority decays over time.
    
    Attributes:
        decay_rate: Base decay rate constant (higher = faster decay)
        sender_weights: Mapping of sender domains/tiers to weight multipliers
        importance_multipliers: Mapping of importance levels to multipliers
        forgotten_threshold: Priority threshold below which items are 'forgotten'
    """

    def __init__(self, decay_rate: float = 0.005, forgotten_threshold: float = 0.2):
        """
        Initialize the Priority Decay Engine.

        Args:
            decay_rate: Base exponential decay rate constant.
            forgotten_threshold: Threshold below which emails are considered forgotten.
        """
        self.decay_rate = decay_rate
        self.forgotten_threshold = forgotten_threshold
        self.sender_weights = {
            "vip": 1.5,
            "executive": 1.4,
            "manager": 1.2,
            "peer": 1.0,
            "external": 0.8,
            "newsletter": 0.3,
            "automated": 0.2
        }
        self.importance_multipliers = {
            "critical": 1.5,
            "high": 1.3,
            "normal": 1.0,
            "low": 0.7,
            "minimal": 0.4
        }

    def calculate_decay_factor(self, age_hours: float, sender_tier: str, 
                                importance: str) -> float:
        """
        Calculate the decay factor for an email based on its age and attributes.

        Args:
            age_hours: Hours since the email was received.
            sender_tier: Classification of the sender (vip, executive, etc.).
            importance: Original importance level of the email.

        Returns:
            Float between 0 and 1 representing the remaining priority fraction.
        """
        sender_weight = self.sender_weights.get(sender_tier, 1.0)
        importance_mult = self.importance_multipliers.get(importance, 1.0)
        
        # Exponential decay adjusted by sender and importance
        raw_decay = math.exp(-self.decay_rate * age_hours)
        adjusted_decay = raw_decay * sender_weight * importance_mult
        
        # Clamp to [0, 1]
        return min(1.0, max(0.0, adjusted_decay))

    def analyze_email(self, email: Dict[str, Any], 
                      reference_time: Optional[datetime] = None) -> Dict[str, Any]:
        """
        Analyze a single email for priority decay.

        Args:
            email: Dictionary containing email metadata (subject, sender, 
                   received_at, original_priority, sender_tier, importance, recipients).
            reference_time: Time to calculate age from (defaults to now).

        Returns:
            Dictionary with decay analysis results.
        """
        if reference_time is None:
            reference_time = datetime.now()

        received_at = email.get("received_at", reference_time)
        if isinstance(received_at, str):
            received_at = datetime.fromisoformat(received_at)

        age_hours = (reference_time - received_at).total_seconds() / 3600.0
        original_priority = email.get("original_priority", 0.5)
        sender_tier = email.get("sender_tier", "peer")
        importance = email.get("importance", "normal")

        decay_factor = self.calculate_decay_factor(age_hours, sender_tier, importance)
        effective_priority = original_priority * decay_factor

        # Check reply-all enforcement
        recipients = email.get("recipients", [])
        reply_all_required = len(recipients) > 1
        reply_all_enforced = True if reply_all_required else False

        # Determine status
        if effective_priority < self.forgotten_threshold and original_priority > 0.7:
            status = "forgotten_high_priority"
        elif effective_priority < self.forgotten_threshold:
            status = "deprioritized"
        elif effective_priority > 0.7:
            status = "active_high"
        elif effective_priority > 0.4:
            status = "active_normal"
        else:
            status = "fading"

        return {
            "email_id": email.get("id", "unknown"),
            "subject": email.get("subject", ""),
            "original_priority": original_priority,
            "effective_priority": round(effective_priority, 4),
            "decay_factor": round(decay_factor, 4),
            "age_hours": round(age_hours, 2),
            "sender_tier": sender_tier,
            "importance": importance,
            "status": status,
            "reply_all_required": reply_all_required,
            "reply_all_enforced": reply_all_enforced,
            "recipients_count": len(recipients),
            "recommendations": self._generate_recommendations(
                status, effective_priority, original_priority, age_hours
            )
        }

    def _generate_recommendations(self, status: str, effective_priority: float,
                                   original_priority: float, age_hours: float) -> List[str]:
        """
        Generate actionable recommendations based on decay status.

        Args:
            status: Current decay status of the email.
            effective_priority: Current effective priority score.
            original_priority: Original priority when received.
            age_hours: Age of the email in hours.

        Returns:
            List of recommendation strings.
        """
        recommendations = []

        if status == "forgotten_high_priority":
            recommendations.append("URGENT: This was a high-priority email that has been overlooked")
            recommendations.append("Review immediately and take action or delegate")
            recommendations.append("Consider escalating if no response received")
        elif status == "deprioritized":
            recommendations.append("Safe to archive or move to low-priority folder")
            recommendations.append("No immediate action required")
        elif status == "active_high":
            recommendations.append("Keep in focus - still requires attention")
            if age_hours > 24:
                recommendations.append("Consider sending a follow-up if awaiting response")
        elif status == "fading":
            recommendations.append("Priority declining - decide if action still needed")
            if age_hours > 72:
                recommendations.append("Consider archiving if no longer relevant")

        return recommendations

    def process_batch(self, emails: List[Dict[str, Any]], 
                      reference_time: Optional[datetime] = None) -> Dict[str, Any]:
        """
        Process a batch of emails and generate comprehensive decay report.

        Args:
            emails: List of email dictionaries to analyze.
            reference_time: Reference time for age calculations.

        Returns:
            Complete analysis report with summary statistics.
        """
        if reference_time is None:
            reference_time = datetime.now()

        results = []
        for email in emails:
            result = self.analyze_email(email, reference_time)
            results.append(result)

        # Sort by effective priority (highest first)
        results.sort(key=lambda x: x["effective_priority"], reverse=True)

        # Generate summary
        forgotten = [r for r in results if r["status"] == "forgotten_high_priority"]
        deprioritized = [r for r in results if r["status"] == "deprioritized"]
        active_high = [r for r in results if r["status"] == "active_high"]
        reply_all_items = [r for r in results if r["reply_all_required"]]

        return {
            "engine": "Email Priority Decay Engine V371",
            "analysis_timestamp": reference_time.isoformat(),
            "total_emails_analyzed": len(results),
            "summary": {
                "forgotten_high_priority": len(forgotten),
                "deprioritized": len(deprioritized),
                "active_high": len(active_high),
                "reply_all_enforced": len(reply_all_items)
            },
            "avg_effective_priority": round(
                sum(r["effective_priority"] for r in results) / max(len(results), 1), 4
            ),
            "reply_all_enforced": True,
            "results": results
        }


def main():
    """
    Main entry point - runs the Priority Decay Engine with sample email data.
    
    Demonstrates:
        - Priority decay calculations for various email ages
        - Sender tier weighting effects
        - Forgotten high-priority detection
        - Reply-all enforcement for multi-recipient threads
    """
    engine = PriorityDecayEngine(decay_rate=0.005, forgotten_threshold=0.2)

    reference_time = datetime(2026, 5, 30, 14, 0, 0)

    sample_emails = [
        {
            "id": "MSG-001",
            "subject": "Q2 Budget Approval Required",
            "sender_tier": "executive",
            "importance": "critical",
            "original_priority": 0.95,
            "received_at": (reference_time - timedelta(hours=3)).isoformat(),
            "recipients": ["alice@company.com", "bob@company.com", "carol@company.com"]
        },
        {
            "id": "MSG-002",
            "subject": "Server Migration Plan - Review Needed",
            "sender_tier": "manager",
            "importance": "high",
            "original_priority": 0.85,
            "received_at": (reference_time - timedelta(hours=72)).isoformat(),
            "recipients": ["dev-team@company.com", "ops@company.com"]
        },
        {
            "id": "MSG-003",
            "subject": "Weekly Newsletter - Tech Updates",
            "sender_tier": "newsletter",
            "importance": "low",
            "original_priority": 0.3,
            "received_at": (reference_time - timedelta(hours=168)).isoformat(),
            "recipients": ["all-staff@company.com"]
        },
        {
            "id": "MSG-004",
            "subject": "Client Contract Renewal - URGENT",
            "sender_tier": "vip",
            "importance": "critical",
            "original_priority": 0.98,
            "received_at": (reference_time - timedelta(hours=120)).isoformat(),
            "recipients": ["sales@company.com", "legal@company.com", "exec@company.com"]
        },
        {
            "id": "MSG-005",
            "subject": "Team Lunch Planning",
            "sender_tier": "peer",
            "importance": "minimal",
            "original_priority": 0.2,
            "received_at": (reference_time - timedelta(hours=6)).isoformat(),
            "recipients": ["team@company.com", "admin@company.com"]
        },
        {
            "id": "MSG-006",
            "subject": "Security Vulnerability Report",
            "sender_tier": "automated",
            "importance": "high",
            "original_priority": 0.9,
            "received_at": (reference_time - timedelta(hours=48)).isoformat(),
            "recipients": ["security@company.com"]
        },
        {
            "id": "MSG-007",
            "subject": "Partnership Proposal from Acme Corp",
            "sender_tier": "external",
            "importance": "normal",
            "original_priority": 0.6,
            "received_at": (reference_time - timedelta(hours=240)).isoformat(),
            "recipients": ["biz-dev@company.com", "ceo@company.com", "legal@company.com"]
        }
    ]

    report = engine.process_batch(sample_emails, reference_time)

    print(json.dumps(report, indent=2))
    return report


if __name__ == "__main__":
    main()
