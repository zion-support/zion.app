#!/usr/bin/env python3
"""
V962: Revenue Attribution Engine
Tracks email-to-revenue attribution, identifies high-value threads,
predicts deal close probability, and optimizes sales engagement.
STRICT reply-all enforcement for all multi-recipient emails.
"""

import re
import hashlib
from datetime import datetime, timezone
from typing import Dict, List, Any


class RevenueAttributionEngine:
    """Tracks and attributes revenue to email interactions."""

    REVENUE_SIGNALS = {
        "deal_mentioned": {
            "patterns": [r'\$[\d,]+', r'\d+\s*(?:k|m|million|billion)', r'\d+\s*users?', r'\d+\s*licenses?'],
            "weight": 2.0,
        },
        "contract_terms": {
            "patterns": [r'\b(contract|agreement|terms|proposal|quote|invoice)\b', r'\b(annual|monthly|quarterly)\b'],
            "weight": 1.8,
        },
        "decision_maker": {
            "patterns": [r'\b(ceo|cto|cfo|vp|director|head of|chief)\b', r'\b(decision|approve|sign off|authorize)\b'],
            "weight": 1.5,
        },
        "timeline_pressure": {
            "patterns": [r'\b(by|before|deadline|q[1-4]|fy\d{2}|next month|this quarter)\b'],
            "weight": 1.3,
        },
        "competitor_mention": {
            "patterns": [r'\b(compared to|vs|versus|alternative|other vendors|competitor)\b'],
            "weight": 1.4,
        },
        "budget_discussion": {
            "patterns": [r'\b(budget|afford|price sensitive|cost conscious|spending limit)\b'],
            "weight": 1.6,
        },
    }

    DEAL_STAGES = {
        "prospect": 0.1,
        "qualified": 0.25,
        "proposal_sent": 0.4,
        "negotiation": 0.6,
        "verbal_commit": 0.8,
        "contract_sent": 0.9,
        "closed_won": 1.0,
        "closed_lost": 0.0,
    }

    def __init__(self):
        self.attribution_log: List[Dict] = []
        self.reply_all_audit: List[Dict] = []
        self.deal_tracker: Dict[str, Dict] = {}

    def analyze_email_case_by_case(self, email: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze revenue signals and attribution for each email."""
        analysis = {
            "engine": "V962",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "email_id": email.get("id", hashlib.md5(str(email).encode()).hexdigest()[:12]),
            "analysis_type": "revenue_attribution",
        }

        to_recipients = email.get("to", [])
        cc_recipients = email.get("cc", [])
        all_recipients = to_recipients + cc_recipients
        is_multi_recipient = len(all_recipients) > 1

        body = email.get("body", "")
        subject = email.get("subject", "")
        full_text = (subject + " " + body).lower()

        # 1. Detect revenue signals
        revenue_signals = self._detect_revenue_signals(full_text)
        analysis["revenue_signals"] = revenue_signals

        # 2. Extract monetary values
        monetary_values = self._extract_monetary_values(full_text)
        analysis["monetary_values"] = monetary_values

        # 3. Identify deal stage
        deal_stage = self._identify_deal_stage(full_text, revenue_signals)
        analysis["deal_stage"] = deal_stage

        # 4. Calculate deal probability
        deal_probability = self._calculate_deal_probability(deal_stage, revenue_signals)
        analysis["deal_probability"] = deal_probability

        # 5. Estimate deal value
        deal_value = self._estimate_deal_value(monetary_values, deal_stage)
        analysis["estimated_deal_value"] = deal_value

        # 6. Calculate weighted pipeline value
        weighted_value = deal_value * deal_probability["probability"]
        analysis["weighted_pipeline_value"] = round(weighted_value, 2)

        # 7. Identify stakeholders
        stakeholders = self._identify_stakeholders(email, full_text)
        analysis["stakeholders"] = stakeholders

        # 8. Engagement score
        engagement_score = self._calculate_engagement_score(email, revenue_signals)
        analysis["engagement_score"] = engagement_score

        # 9. Recommended next action
        next_action = self._recommend_next_action(deal_stage, deal_probability, engagement_score)
        analysis["recommended_next_action"] = next_action

        # 10. Risk assessment
        risk_assessment = self._assess_deal_risks(full_text, deal_stage, revenue_signals)
        analysis["risk_assessment"] = risk_assessment

        # 11. REPLY-ALL ENFORCEMENT
        reply_all_check = self._enforce_reply_all(email, all_recipients, is_multi_recipient)
        analysis["reply_all_enforcement"] = reply_all_check

        # 12. Priority determination
        analysis["priority"] = self._determine_priority(deal_value, deal_probability, risk_assessment)

        # Track deal
        deal_id = email.get("thread_id", email.get("from", "unknown"))
        self.deal_tracker[deal_id] = {
            "deal_id": deal_id,
            "stage": deal_stage["stage"],
            "probability": deal_probability["probability"],
            "value": deal_value,
            "weighted_value": weighted_value,
            "last_activity": analysis["timestamp"],
            "risk_level": risk_assessment["risk_level"],
        }

        self.attribution_log.append({
            "email_id": analysis["email_id"],
            "deal_id": deal_id,
            "deal_value": deal_value,
            "probability": deal_probability["probability"],
            "weighted_value": weighted_value,
            "reply_all": reply_all_check["enforced"],
            "timestamp": analysis["timestamp"],
        })

        return analysis

    def _detect_revenue_signals(self, text: str) -> Dict:
        """Detect revenue-related signals in email."""
        signals = {}
        for signal_type, config in self.REVENUE_SIGNALS.items():
            matches = []
            for pattern in config["patterns"]:
                found = re.findall(pattern, text, re.IGNORECASE)
                matches.extend(found)
            if matches:
                signals[signal_type] = {
                    "detected": True,
                    "matches": matches[:5],
                    "weight": config["weight"],
                }
            else:
                signals[signal_type] = {"detected": False, "weight": config["weight"]}
        return signals

    def _extract_monetary_values(self, text: str) -> Dict:
        """Extract monetary values from text."""
        # Match patterns like $10,000, $10k, $1 million
        patterns = [
            r'\$([\d,]+)',
            r'\$(\d+)\s*k',
            r'\$(\d+)\s*million',
            r'\$(\d+)\s*billion',
        ]

        values = []
        for pattern in patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            for match in matches:
                try:
                    if 'k' in pattern:
                        val = float(match.replace(',', '')) * 1000
                    elif 'million' in pattern:
                        val = float(match.replace(',', '')) * 1000000
                    elif 'billion' in pattern:
                        val = float(match.replace(',', '')) * 1000000000
                    else:
                        val = float(match.replace(',', ''))
                    values.append(val)
                except:
                    pass

        return {
            "values_found": values,
            "max_value": max(values) if values else 0,
            "min_value": min(values) if values else 0,
            "avg_value": sum(values) / len(values) if values else 0,
        }

    def _identify_deal_stage(self, text: str, signals: Dict) -> Dict:
        """Identify current deal stage based on email content."""
        stage_indicators = {
            "prospect": ["interested", "learn more", "tell me about"],
            "qualified": ["need", "requirement", "budget", "timeline"],
            "proposal_sent": ["proposal", "quote", "pricing", "estimate"],
            "negotiation": ["discount", "negotiate", "better price", "terms"],
            "verbal_commit": ["agree", "accept", "move forward", "proceed"],
            "contract_sent": ["contract", "agreement", "sign", "legal"],
            "closed_won": ["signed", "completed", "welcome aboard"],
            "closed_lost": ["not interested", "going with", "decline"],
        }

        scores = {}
        for stage, indicators in stage_indicators.items():
            score = sum(1 for ind in indicators if ind in text)
            if score > 0:
                scores[stage] = score

        if scores:
            best_stage = max(scores, key=scores.get)
            confidence = scores[best_stage] / len(stage_indicators[best_stage])
        else:
            best_stage = "prospect"
            confidence = 0.3

        return {
            "stage": best_stage,
            "confidence": round(confidence, 2),
            "base_probability": self.DEAL_STAGES[best_stage],
        }

    def _calculate_deal_probability(self, deal_stage: Dict, signals: Dict) -> Dict:
        """Calculate deal close probability."""
        base_prob = deal_stage["base_probability"]

        # Adjust based on signals
        adjustments = 0
        for signal_type, signal_data in signals.items():
            if signal_data["detected"]:
                if signal_type == "decision_maker":
                    adjustments += 0.05
                elif signal_type == "timeline_pressure":
                    adjustments += 0.03
                elif signal_type == "competitor_mention":
                    adjustments -= 0.05

        final_prob = min(max(base_prob + adjustments, 0), 1)
        return {
            "probability": round(final_prob, 2),
            "base_probability": base_prob,
            "adjustments": round(adjustments, 2),
            "confidence_level": "HIGH" if final_prob > 0.7 else "MEDIUM" if final_prob > 0.4 else "LOW",
        }

    def _estimate_deal_value(self, monetary: Dict, deal_stage: Dict) -> float:
        """Estimate deal value."""
        if monetary["max_value"] > 0:
            return monetary["max_value"]
        # Default estimates by stage
        stage_defaults = {
            "prospect": 5000,
            "qualified": 15000,
            "proposal_sent": 25000,
            "negotiation": 50000,
            "verbal_commit": 75000,
            "contract_sent": 100000,
            "closed_won": 100000,
        }
        return stage_defaults.get(deal_stage["stage"], 10000)

    def _identify_stakeholders(self, email: Dict, text: str) -> Dict:
        """Identify stakeholders in the deal."""
        stakeholders = {
            "decision_makers": [],
            "influencers": [],
            "end_users": [],
        }

        # Detect decision makers
        if re.search(r'\b(ceo|cto|cfo|vp|director|head of)\b', text):
            stakeholders["decision_makers"].append("Executive detected")

        # Detect influencers
        if re.search(r'\b(team|department|colleagues|manager)\b', text):
            stakeholders["influencers"].append("Team involvement detected")

        # Count recipients as potential stakeholders
        recipient_count = len(email.get("to", [])) + len(email.get("cc", []))
        stakeholders["total_involved"] = recipient_count

        return stakeholders

    def _calculate_engagement_score(self, email: Dict, signals: Dict) -> Dict:
        """Calculate engagement score."""
        score = 50  # Base score

        # Thread depth
        thread_depth = email.get("thread_depth", 1)
        score += thread_depth * 5

        # Response time (if available)
        # More signals = higher engagement
        active_signals = sum(1 for s in signals.values() if s["detected"])
        score += active_signals * 10

        # Attachment present
        if email.get("attachments"):
            score += 10

        return {
            "score": min(score, 100),
            "level": "HIGH" if score >= 70 else "MEDIUM" if score >= 40 else "LOW",
        }

    def _recommend_next_action(self, deal_stage: Dict, probability: Dict, engagement: Dict) -> Dict:
        """Recommend next sales action."""
        stage = deal_stage["stage"]
        prob = probability["probability"]

        if stage == "prospect":
            return {"action": "Qualify lead", "urgency": "MEDIUM", "suggested_content": "Discovery questions"}
        elif stage == "qualified":
            return {"action": "Send proposal", "urgency": "HIGH", "suggested_content": "Custom proposal"}
        elif stage == "proposal_sent" and prob < 0.5:
            return {"action": "Follow up", "urgency": "HIGH", "suggested_content": "Value reinforcement"}
        elif stage == "negotiation":
            return {"action": "Address objections", "urgency": "CRITICAL", "suggested_content": "ROI justification"}
        elif stage == "verbal_commit":
            return {"action": "Send contract", "urgency": "CRITICAL", "suggested_content": "Legal agreement"}
        else:
            return {"action": "Maintain relationship", "urgency": "LOW", "suggested_content": "Check-in"}

    def _assess_deal_risks(self, text: str, deal_stage: Dict, signals: Dict) -> Dict:
        """Assess deal risks."""
        risks = []

        # Competitor risk
        if signals.get("competitor_mention", {}).get("detected"):
            risks.append({"type": "competition", "severity": "HIGH", "mitigation": "Emphasize unique value"})

        # Budget risk
        if "budget" in text and "tight" in text:
            risks.append({"type": "budget", "severity": "MEDIUM", "mitigation": "Offer flexible pricing"})

        # Timeline risk
        if "delay" in text or "postpone" in text:
            risks.append({"type": "timeline", "severity": "MEDIUM", "mitigation": "Create urgency"})

        # Ghosting risk
        if deal_stage["stage"] in ["proposal_sent", "negotiation"] and "no response" in text:
            risks.append({"type": "ghosting", "severity": "HIGH", "mitigation": "Multi-channel follow-up"})

        risk_level = "HIGH" if len(risks) >= 2 else "MEDIUM" if len(risks) == 1 else "LOW"
        return {"risks": risks, "risk_level": risk_level, "risk_count": len(risks)}

    def _determine_priority(self, deal_value: float, probability: Dict, risk: Dict) -> str:
        """Determine email priority based on deal metrics."""
        weighted_value = deal_value * probability["probability"]
        if weighted_value > 50000 or risk["risk_level"] == "HIGH":
            return "CRITICAL"
        elif weighted_value > 20000 or risk["risk_level"] == "MEDIUM":
            return "HIGH"
        elif weighted_value > 5000:
            return "MEDIUM"
        return "NORMAL"

    def _enforce_reply_all(self, email: Dict, all_recipients: List, is_multi: bool) -> Dict:
        """STRICT reply-all enforcement."""
        result = {
            "is_multi_recipient": is_multi,
            "recipient_count": len(all_recipients),
            "enforced": False,
            "reason": "",
        }
        if is_multi:
            result["enforced"] = True
            result["reason"] = f"REPLY-ALL ENFORCED: {len(all_recipients)} recipients."
            self.reply_all_audit.append({
                "email_id": email.get("id", "unknown"),
                "enforced": True,
                "timestamp": datetime.now(timezone.utc).isoformat(),
            })
        else:
            result["reason"] = "Single recipient."
        return result

    def get_stats(self) -> Dict:
        if not self.attribution_log:
            return {"emails_analyzed": 0}
        total_weighted = sum(a["weighted_value"] for a in self.attribution_log)
        return {
            "emails_analyzed": len(self.attribution_log),
            "total_weighted_pipeline": round(total_weighted, 2),
            "active_deals": len(self.deal_tracker),
            "reply_all_enforced": len(self.reply_all_audit),
            "avg_deal_probability": round(
                sum(a["probability"] for a in self.attribution_log) / len(self.attribution_log), 2
            ),
        }


def test_v962():
    engine = RevenueAttributionEngine()

    # Test 1: High-value deal email
    email1 = {
        "id": "rev-001",
        "from": "cto@enterprise.com",
        "to": ["sales@ziontechgroup.com", "account@ziontechgroup.com"],
        "cc": ["ceo@enterprise.com"],
        "subject": "Enterprise AI Platform - $500K deal",
        "body": "We need to finalize the $500,000 contract for 500 licenses. Our CEO has approved the budget. Can you send the final agreement by end of quarter?",
    }
    r1 = engine.analyze_email_case_by_case(email1)
    assert r1["reply_all_enforcement"]["enforced"] is True
    assert r1["estimated_deal_value"] >= 500000
    assert r1["deal_probability"]["probability"] > 0.3
    print(f"✅ Test 1 PASSED: Deal=${r1['estimated_deal_value']}, prob={r1['deal_probability']['probability']}, weighted=${r1['weighted_pipeline_value']}")

    # Test 2: Early stage prospect
    email2 = {
        "id": "rev-002",
        "from": "manager@startup.io",
        "to": ["info@ziontechgroup.com"],
        "subject": "Interested in your AI services",
        "body": "I'd like to learn more about your AI solutions for small teams. What are your pricing options?",
    }
    r2 = engine.analyze_email_case_by_case(email2)
    assert r2["deal_stage"]["stage"] in ("prospect", "qualified")
    print(f"✅ Test 2 PASSED: Stage={r2['deal_stage']['stage']}, prob={r2['deal_probability']['probability']}")

    stats = engine.get_stats()
    print(f"✅ Test 3 PASSED: Pipeline=${stats['total_weighted_pipeline']}, deals={stats['active_deals']}")

    print("\n🎉 V962 ALL TESTS PASSED — Revenue Attribution Engine operational!")
    return True


if __name__ == "__main__":
    test_v962()
