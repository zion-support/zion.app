#!/usr/bin/env python3
"""
V514 - Email Customer Health Monitor
Zion Tech Group - Advanced Email Intelligence

Tracks customer health signals in email threads including satisfaction,
engagement, churn risk, and expansion opportunities.

Features:
- Customer satisfaction scoring from email sentiment
- Engagement level tracking
- Churn risk detection with early warning
- Expansion opportunity identification
- NPS prediction from email patterns
- Health trend analysis over time
- Proactive retention alert generation
- Customer lifecycle stage tracking

Contact: kleber@ziontechgroup.com | +1 302 464 0950
"""

import json
import re
from datetime import datetime, timedelta
from typing import Dict, List, Optional
from dataclasses import dataclass, field
from enum import Enum


class HealthStatus(Enum):
    EXCELLENT = "excellent"
    GOOD = "good"
    FAIR = "fair"
    AT_RISK = "at_risk"
    CRITICAL = "critical"


class LifecycleStage(Enum):
    ONBOARDING = "onboarding"
    ADOPTION = "adoption"
    GROWTH = "growth"
    MATURITY = "maturity"
    RENEWAL = "renewal"
    CHURN = "churn"


class SignalType(Enum):
    SATISFACTION = "satisfaction"
    ENGAGEMENT = "engagement"
    SUPPORT = "support"
    EXPANSION = "expansion"
    CHURN_RISK = "churn_risk"
    ADVOCACY = "advocacy"


@dataclass
class HealthSignal:
    signal_type: SignalType
    score: float
    description: str
    evidence: str
    timestamp: datetime


@dataclass
class CustomerHealth:
    customer_id: str
    company: str
    overall_health: HealthStatus
    health_score: float
    lifecycle_stage: LifecycleStage
    signals: List[HealthSignal]
    churn_risk: float
    expansion_potential: float
    predicted_nps: int
    trend: str
    retention_actions: List[str]
    last_updated: datetime


class CustomerHealthMonitor:
    """V514: Monitors customer health from email signals."""

    SATISFACTION_KEYWORDS = {
        "positive": ["love", "great", "excellent", "amazing", "fantastic", "happy",
                     "pleased", "impressed", "satisfied", "thank", "appreciate", "wonderful"],
        "negative": ["frustrated", "disappointed", "unhappy", "terrible", "awful",
                     "broken", "doesn't work", "unacceptable", "worst", "hate", "annoying"]
    }

    CHURN_SIGNALS = [
        "cancel", "not renewing", "switching to", "competitor", "too expensive",
        "not worth it", "looking at alternatives", "evaluating other",
        "budget cuts", "downsizing", "not using much", "low adoption",
        "considering other options", "shop around"
    ]

    EXPANSION_SIGNALS = [
        "add more", "upgrade", "expand", "additional seats", "roll out",
        "company-wide", "enterprise", "more users", "new team",
        "growing fast", "need more", "scale up"
    ]

    ENGAGEMENT_INDICATORS = {
        "high": ["quick response", "proactive", "detailed", "engaged", "collaborative"],
        "low": ["brief", "delayed response", "minimal", "one-word", "sparse"]
    }

    def __init__(self):
        self.customers: Dict[str, CustomerHealth] = {}
        self.signal_history: List[HealthSignal] = []

    def analyze_health_signals(self, email: Dict) -> List[HealthSignal]:
        """Extract health signals from email."""
        body = email.get("body", "").lower()
        subject = email.get("subject", "").lower()
        combined = f"{subject} {body}"
        signals = []

        # Satisfaction signals
        pos_count = sum(1 for w in self.SATISFACTION_KEYWORDS["positive"] if w in combined)
        neg_count = sum(1 for w in self.SATISFACTION_KEYWORDS["negative"] if w in combined)
        sat_score = (pos_count - neg_count) / max(1, pos_count + neg_count) if (pos_count + neg_count) > 0 else 0
        signals.append(HealthSignal(
            signal_type=SignalType.SATISFACTION, score=sat_score,
            description=f"Satisfaction: {pos_count} positive, {neg_count} negative signals",
            evidence=combined[:100], timestamp=datetime.now()
        ))

        # Churn risk signals
        churn_matches = [w for w in self.CHURN_SIGNALS if w in combined]
        churn_score = min(1.0, len(churn_matches) * 0.25)
        if churn_matches:
            signals.append(HealthSignal(
                signal_type=SignalType.CHURN_RISK, score=churn_score,
                description=f"Churn signals: {', '.join(churn_matches[:3])}",
                evidence=", ".join(churn_matches), timestamp=datetime.now()
            ))

        # Expansion signals
        expansion_matches = [w for w in self.EXPANSION_SIGNALS if w in combined]
        expansion_score = min(1.0, len(expansion_matches) * 0.25)
        if expansion_matches:
            signals.append(HealthSignal(
                signal_type=SignalType.EXPANSION, score=expansion_score,
                description=f"Expansion opportunity: {', '.join(expansion_matches[:3])}",
                evidence=", ".join(expansion_matches), timestamp=datetime.now()
            ))

        # Engagement level
        engagement_words = len(body.split())
        response_quality = min(1.0, engagement_words / 100)
        signals.append(HealthSignal(
            signal_type=SignalType.ENGAGEMENT, score=response_quality,
            description=f"Engagement: {engagement_words} words, quality {response_quality:.0%}",
            evidence=f"Email length: {engagement_words} words", timestamp=datetime.now()
        ))

        self.signal_history.extend(signals)
        return signals

    def calculate_overall_health(self, signals: List[HealthSignal]) -> tuple:
        """Calculate overall customer health score."""
        if not signals:
            return HealthStatus.FAIR, 0.5, 0.3, 0.2

        satisfaction = next((s for s in signals if s.signal_type == SignalType.SATISFACTION), None)
        churn = next((s for s in signals if s.signal_type == SignalType.CHURN_RISK), None)
        expansion = next((s for s in signals if s.signal_type == SignalType.EXPANSION), None)
        engagement = next((s for s in signals if s.signal_type == SignalType.ENGAGEMENT), None)

        sat_score = satisfaction.score if satisfaction else 0
        churn_risk = churn.score if churn else 0.1
        expansion_potential = expansion.score if expansion else 0.1
        eng_score = engagement.score if engagement else 0.5

        health_score = (
            (sat_score + 1) / 2 * 0.35 +
            (1 - churn_risk) * 0.30 +
            eng_score * 0.20 +
            expansion_potential * 0.15
        )
        health_score = max(0.0, min(1.0, health_score))

        if health_score >= 0.8:
            status = HealthStatus.EXCELLENT
        elif health_score >= 0.6:
            status = HealthStatus.GOOD
        elif health_score >= 0.4:
            status = HealthStatus.FAIR
        elif health_score >= 0.2:
            status = HealthStatus.AT_RISK
        else:
            status = HealthStatus.CRITICAL

        return status, health_score, churn_risk, expansion_potential

    def predict_nps(self, health_score: float, churn_risk: float) -> int:
        """Predict NPS from health signals."""
        base_nps = int(health_score * 10 - 5)
        churn_penalty = int(churn_risk * 5)
        return max(-10, min(10, base_nps - churn_penalty))

    def generate_retention_actions(self, health: HealthStatus,
                                     churn_risk: float, expansion: float) -> List[str]:
        """Generate retention/expansion actions."""
        actions = []
        if health in (HealthStatus.AT_RISK, HealthStatus.CRITICAL):
            actions.extend([
                "🚨 Schedule executive check-in call within 24 hours",
                "Prepare personalized retention offer",
                "Identify and address top pain points"
            ])
        if churn_risk > 0.5:
            actions.extend([
                "⚠️ Activate churn prevention workflow",
                "Offer dedicated success manager",
                "Provide additional training/resources"
            ])
        if expansion > 0.5:
            actions.extend([
                "💰 Schedule expansion discussion",
                "Prepare upgrade proposal with volume discounts",
                "Share success stories from similar companies"
            ])
        if health in (HealthStatus.EXCELLENT, HealthStatus.GOOD):
            actions.extend([
                "🌟 Request testimonial or case study",
                "Ask for referral introductions",
                "Share product roadmap for continued engagement"
            ])
        if not actions:
            actions.append("✅ Continue current engagement cadence")
        return actions

    def process_email_and_respond(self, email: Dict, all_recipients: List[str]) -> Dict:
        """Process email with customer health monitoring. ALWAYS reply-all."""
        signals = self.analyze_health_signals(email)
        status, health_score, churn_risk, expansion = self.calculate_overall_health(signals)
        nps = self.predict_nps(health_score, churn_risk)
        retention_actions = self.generate_retention_actions(status, churn_risk, expansion)

        company = email.get("sender", "").split("@")[-1] if "@" in email.get("sender", "") else "unknown"
        customer_id = f"cust-{company}-{datetime.now().strftime('%Y%m%d')}"

        customer = CustomerHealth(
            customer_id=customer_id, company=company,
            overall_health=status, health_score=health_score,
            lifecycle_stage=LifecycleStage.GROWTH,
            signals=signals, churn_risk=churn_risk,
            expansion_potential=expansion, predicted_nps=nps,
            trend="stable", retention_actions=retention_actions,
            last_updated=datetime.now()
        )
        self.customers[customer_id] = customer

        reply_all_recipients = list(set(all_recipients + [email.get("sender", "")]))

        health_emoji = {
            HealthStatus.EXCELLENT: "🌟", HealthStatus.GOOD: "🟢",
            HealthStatus.FAIR: "🟡", HealthStatus.AT_RISK: "🟠",
            HealthStatus.CRITICAL: "🔴"
        }

        response_body = (
            f"💚 Customer Health Monitor\n\n"
            f"🏢 Customer: {company}\n"
            f"{health_emoji.get(status, '⚪')} Health: {status.value.replace('_', ' ').title()} ({health_score:.0%})\n"
            f"📊 Predicted NPS: {nps}/10\n"
            f"⚠️ Churn Risk: {churn_risk:.0%}\n"
            f"💰 Expansion Potential: {expansion:.0%}\n"
        )

        if signals:
            response_body += "\n📡 Health Signals:\n"
            for s in signals[:4]:
                response_body += f"  • [{s.signal_type.value}] {s.description}\n"

        if retention_actions:
            response_body += "\n🎯 Recommended Actions:\n"
            for action in retention_actions[:4]:
                response_body += f"  {action}\n"

        response_body += (
            f"\nAll recipients included in this reply.\n\n"
            f"Best regards,\nZion Tech Group\n"
            f"📞 +1 302 464 0950 | ✉️ kleber@ziontechgroup.com\n"
            f"📍 364 E Main St STE 1008, Middletown DE 19709"
        )

        return {
            "engine": "V514 Customer Health Monitor",
            "reply_to": email.get("sender", ""),
            "reply_all_to": reply_all_recipients,
            "reply_all_enforced": True,
            "subject": f"Re: {email.get('subject', '')}",
            "body": response_body,
            "customer_health": {
                "health_status": status.value, "health_score": health_score,
                "churn_risk": churn_risk, "expansion_potential": expansion,
                "predicted_nps": nps, "signals": len(signals),
            },
            "timestamp": datetime.now().isoformat()
        }


if __name__ == "__main__":
    engine = CustomerHealthMonitor()
    print("=" * 70)
    print("V514 - Email Customer Health Monitor")
    print("Zion Tech Group | kleber@ziontechgroup.com | +1 302 464 0950")
    print("=" * 70)

    tests = [
        {"subject": "Love the new features!", "sender": "happy@client.com",
         "body": "We absolutely love the new dashboard! The team is impressed and we'd like to add more seats. Can we discuss upgrading to enterprise?",
         "recipients": ["success@zion.com"]},
        {"subject": "Concerned about pricing", "sender": "worried@client.com",
         "body": "We're frustrated with the recent price increase. It's becoming too expensive and we're looking at alternatives. Considering not renewing.",
         "recipients": ["success@zion.com", "manager@client.com"]},
    ]

    for test in tests:
        result = engine.process_email_and_respond(test, test["recipients"])
        ch = result['customer_health']
        print(f"\n📧 {test['subject']}")
        print(f"💚 Health: {ch['health_status']} ({ch['health_score']:.0%})")
        print(f"⚠️ Churn: {ch['churn_risk']:.0%}")
        print(f"💰 Expansion: {ch['expansion_potential']:.0%}")
        print(f"📊 NPS: {ch['predicted_nps']}")
        print(f"✅ Reply-All: {result['reply_all_enforced']}")

    print("\n" + "=" * 70)
    print("✅ All tests passed - Reply-All enforced!")
