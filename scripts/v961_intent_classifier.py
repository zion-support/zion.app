#!/usr/bin/env python3
"""
V961: Email Intent Classifier Engine
Classifies emails into 15+ intent categories with confidence scores,
auto-routing recommendations, and case-by-case action determination.
STRICT reply-all enforcement for all multi-recipient emails.
"""

import re
import hashlib
from datetime import datetime, timezone
from typing import Dict, List, Any


class EmailIntentClassifier:
    """Classifies email intent across 15+ categories with confidence scoring."""

    INTENT_CATEGORIES = {
        "purchase_intent": {
            "keywords": ["buy", "purchase", "order", "subscribe", "pricing", "quote", "cost", "plan", "upgrade", "downgrade"],
            "weight": 1.5,
            "action": "ROUTE_TO_SALES",
            "priority": "HIGH",
        },
        "support_request": {
            "keywords": ["help", "issue", "problem", "error", "bug", "not working", "broken", "fix", "troubleshoot", "ticket"],
            "weight": 1.3,
            "action": "ROUTE_TO_SUPPORT",
            "priority": "HIGH",
        },
        "complaint": {
            "keywords": ["unhappy", "dissatisfied", "terrible", "worst", "awful", "unacceptable", "disappointed", "frustrated", "angry"],
            "weight": 1.8,
            "action": "ESCALATE_TO_MANAGER",
            "priority": "CRITICAL",
        },
        "cancellation": {
            "keywords": ["cancel", "unsubscribe", "terminate", "close account", "stop", "end subscription", "refund", "leave"],
            "weight": 2.0,
            "action": "RETENTION_WORKFLOW",
            "priority": "CRITICAL",
        },
        "inquiry": {
            "keywords": ["question", "wondering", "curious", "information", "tell me", "explain", "how does", "what is", "learn more"],
            "weight": 1.0,
            "action": "STANDARD_RESPONSE",
            "priority": "NORMAL",
        },
        "negotiation": {
            "keywords": ["discount", "negotiate", "better price", "deal", "offer", "counter", "budget", "afford", "match"],
            "weight": 1.6,
            "action": "ROUTE_TO_SALES_LEAD",
            "priority": "HIGH",
        },
        "referral": {
            "keywords": ["recommend", "refer", "friend", "colleague", "introduce", "referral", "partner"],
            "weight": 1.4,
            "action": "REFERRAL_PROGRAM",
            "priority": "MEDIUM",
        },
        "feedback": {
            "keywords": ["feedback", "suggestion", "improve", "feature request", "enhancement", "would be nice", "wish"],
            "weight": 1.0,
            "action": "ROUTE_TO_PRODUCT",
            "priority": "NORMAL",
        },
        "partnership": {
            "keywords": ["partner", "collaborate", "alliance", "joint venture", "reseller", "affiliate", "white label", "integrate"],
            "weight": 1.5,
            "action": "ROUTE_TO_BUSINESS_DEV",
            "priority": "HIGH",
        },
        "legal_compliance": {
            "keywords": ["legal", "lawyer", "attorney", "compliance", "regulation", "gdpr", "hipaa", "lawsuit", "litigation", "subpoena"],
            "weight": 2.0,
            "action": "ROUTE_TO_LEGAL",
            "priority": "CRITICAL",
        },
        "billing_dispute": {
            "keywords": ["overcharged", "wrong amount", "billing error", "invoice", "dispute", "charge", "payment", "receipt", "refund"],
            "weight": 1.7,
            "action": "ROUTE_TO_FINANCE",
            "priority": "HIGH",
        },
        "onboarding": {
            "keywords": ["getting started", "setup", "configure", "onboard", "first time", "tutorial", "guide", "how to"],
            "weight": 1.2,
            "action": "ONBOARDING_SEQUENCE",
            "priority": "MEDIUM",
        },
        "upsell_opportunity": {
            "keywords": ["more features", "enterprise", "premium", "advanced", "scale", "grow", "expand", "additional"],
            "weight": 1.5,
            "action": "UPSELL_WORKFLOW",
            "priority": "MEDIUM",
        },
        "urgent_request": {
            "keywords": ["urgent", "asap", "emergency", "immediately", "deadline", "critical", "time sensitive", "rush"],
            "weight": 2.0,
            "action": "FAST_TRACK_RESPONSE",
            "priority": "CRITICAL",
        },
        "recruitment": {
            "keywords": ["hiring", "job", "career", "position", "apply", "resume", "candidate", "interview", "opportunity"],
            "weight": 1.1,
            "action": "ROUTE_TO_HR",
            "priority": "NORMAL",
        },
        "spam": {
            "keywords": ["viagra", "lottery", "prince", "inheritance", "click here", "act now", "limited time", "free money", "winner"],
            "weight": 0.5,
            "action": "FLAG_AND_QUARANTINE",
            "priority": "LOW",
        },
    }

    # Sentiment modifiers that adjust intent confidence
    SENTIMENT_POSITIVE = ["great", "love", "excellent", "amazing", "fantastic", "wonderful", "perfect", "thank"]
    SENTIMENT_NEGATIVE = ["bad", "hate", "terrible", "awful", "horrible", "worst", "disgusted", "frustrated"]

    def __init__(self):
        self.classification_log: List[Dict] = []
        self.reply_all_audit: List[Dict] = []
        self.intent_stats: Dict[str, int] = {}

    def analyze_email_case_by_case(self, email: Dict[str, Any]) -> Dict[str, Any]:
        """Classify intent for each email and determine appropriate action."""
        analysis = {
            "engine": "V961",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "email_id": email.get("id", hashlib.md5(str(email).encode()).hexdigest()[:12]),
            "analysis_type": "intent_classification",
        }

        to_recipients = email.get("to", [])
        cc_recipients = email.get("cc", [])
        all_recipients = to_recipients + cc_recipients
        is_multi_recipient = len(all_recipients) > 1

        body = email.get("body", "").lower()
        subject = email.get("subject", "").lower()
        full_text = subject + " " + body
        words = set(re.findall(r'\b\w+\b', full_text))

        # 1. Score each intent category
        intent_scores = {}
        for intent, config in self.INTENT_CATEGORIES.items():
            keyword_matches = [kw for kw in config["keywords"] if kw in full_text]
            match_count = len(keyword_matches)
            if match_count > 0:
                # Weighted score: matches * weight * coverage
                coverage = match_count / len(config["keywords"])
                raw_score = match_count * config["weight"] * (1 + coverage)
                intent_scores[intent] = {
                    "score": round(raw_score, 2),
                    "matched_keywords": keyword_matches,
                    "weight": config["weight"],
                    "action": config["action"],
                    "priority": config["priority"],
                }

        # 2. Sort by score to get primary and secondary intents
        sorted_intents = sorted(intent_scores.items(), key=lambda x: x[1]["score"], reverse=True)

        primary_intent = sorted_intents[0] if sorted_intents else ("inquiry", {
            "score": 0.5, "matched_keywords": [], "weight": 1.0,
            "action": "STANDARD_RESPONSE", "priority": "NORMAL"
        })

        secondary_intents = sorted_intents[1:3] if len(sorted_intents) > 1 else []

        analysis["primary_intent"] = {
            "category": primary_intent[0],
            "confidence": min(round(primary_intent[1]["score"] / max(sum(s["score"] for _, s in sorted_intents), 1), 2), 0.99),
            "matched_keywords": primary_intent[1]["matched_keywords"],
            "action": primary_intent[1]["action"],
            "priority": primary_intent[1]["priority"],
        }

        analysis["secondary_intents"] = [
            {
                "category": name,
                "score": data["score"],
                "action": data["action"],
            }
            for name, data in secondary_intents
        ]

        analysis["all_detected_intents"] = len(intent_scores)

        # 3. Sentiment analysis (simple)
        sentiment = self._analyze_sentiment(words)
        analysis["sentiment"] = sentiment

        # 4. Adjust confidence based on sentiment
        if sentiment["polarity"] == "negative" and primary_intent[1]["priority"] != "CRITICAL":
            analysis["primary_intent"]["priority"] = "HIGH"  # Negative sentiment elevates priority

        # 5. Urgency detection
        urgency = self._detect_urgency(full_text)
        analysis["urgency"] = urgency
        if urgency["is_urgent"]:
            analysis["primary_intent"]["priority"] = "CRITICAL"

        # 6. Determine final action
        final_action = self._determine_final_action(analysis)
        analysis["recommended_action"] = final_action

        # 7. SLA recommendation
        analysis["sla_recommendation"] = self._recommend_sla(analysis["primary_intent"]["priority"])

        # 8. REPLY-ALL ENFORCEMENT
        reply_all_check = self._enforce_reply_all(email, all_recipients, is_multi_recipient)
        analysis["reply_all_enforcement"] = reply_all_check

        # 9. Response template suggestion
        analysis["response_template"] = self._suggest_response_template(
            primary_intent[0], sentiment["polarity"], urgency["is_urgent"]
        )

        # Log
        self.classification_log.append({
            "email_id": analysis["email_id"],
            "primary_intent": primary_intent[0],
            "confidence": analysis["primary_intent"]["confidence"],
            "priority": analysis["primary_intent"]["priority"],
            "reply_all": reply_all_check["enforced"],
            "timestamp": analysis["timestamp"],
        })

        # Track stats
        self.intent_stats[primary_intent[0]] = self.intent_stats.get(primary_intent[0], 0) + 1

        return analysis

    def _analyze_sentiment(self, words: set) -> Dict:
        """Simple sentiment analysis."""
        pos_count = sum(1 for w in words if w in self.SENTIMENT_POSITIVE)
        neg_count = sum(1 for w in words if w in self.SENTIMENT_NEGATIVE)

        if pos_count > neg_count:
            polarity = "positive"
            score = min(round(pos_count / max(len(words), 1) * 10, 2), 1.0)
        elif neg_count > pos_count:
            polarity = "negative"
            score = -min(round(neg_count / max(len(words), 1) * 10, 2), 1.0)
        else:
            polarity = "neutral"
            score = 0.0

        return {"polarity": polarity, "score": score, "positive_indicators": pos_count, "negative_indicators": neg_count}

    def _detect_urgency(self, text: str) -> Dict:
        """Detect urgency signals in text."""
        urgent_patterns = [
            r'\b(urgent|asap|emergency|immediately|critical)\b',
            r'!{2,}',  # Multiple exclamation marks
            r'\b(today|tonight|right now|by eod|end of day)\b',
            r'\b(deadline|time.?sensitive|time.?critical)\b',
        ]

        signals = []
        for pattern in urgent_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            if matches:
                signals.extend(matches)

        return {
            "is_urgent": len(signals) >= 2,
            "urgency_score": min(len(signals), 5),
            "signals": signals[:5],
        }

    def _determine_final_action(self, analysis: Dict) -> str:
        """Determine the final action based on all analysis factors."""
        intent_action = analysis["primary_intent"]["action"]
        priority = analysis["primary_intent"]["priority"]
        sentiment = analysis["sentiment"]["polarity"]

        # Override for critical situations
        if priority == "CRITICAL" and sentiment == "negative":
            return "IMMEDIATE_MANAGER_ESCALATION"
        elif analysis.get("urgency", {}).get("is_urgent"):
            return "FAST_TRACK_" + intent_action
        elif analysis["all_detected_intents"] >= 3:
            return "COMPLEX_MULTI_INTENT_ROUTING"
        else:
            return intent_action

    def _recommend_sla(self, priority: str) -> Dict:
        """Recommend SLA based on priority."""
        sla_map = {
            "CRITICAL": {"response_minutes": 30, "resolution_hours": 4},
            "HIGH": {"response_minutes": 60, "resolution_hours": 8},
            "MEDIUM": {"response_hours": 4, "resolution_hours": 24},
            "NORMAL": {"response_hours": 8, "resolution_hours": 48},
            "LOW": {"response_hours": 24, "resolution_hours": 72},
        }
        return sla_map.get(priority, sla_map["NORMAL"])

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
            result["reason"] = "Single recipient — standard reply."
        return result

    def _suggest_response_template(self, intent: str, sentiment: str, is_urgent: bool) -> Dict:
        """Suggest a response template based on intent and sentiment."""
        templates = {
            "purchase_intent": {"tone": "enthusiastic", "include": ["pricing", "demo offer", "timeline"]},
            "support_request": {"tone": "empathetic", "include": ["acknowledgment", "steps to resolve", "ETA"]},
            "complaint": {"tone": "apologetic", "include": ["acknowledgment", "apology", "resolution plan", "compensation"]},
            "cancellation": {"tone": "understanding", "include": ["retention offer", "alternatives", "feedback request"]},
            "negotiation": {"tone": "professional", "include": ["value proposition", "flexibility", "next steps"]},
        }

        base = templates.get(intent, {"tone": "professional", "include": ["acknowledgment", "next steps"]})
        if sentiment == "negative":
            base["tone"] = "empathetic"
            base["include"].insert(0, "empathy statement")
        if is_urgent:
            base["tone"] = "urgent_acknowledgment"
            base["include"].insert(0, "urgency acknowledgment")

        return base

    def get_stats(self) -> Dict:
        if not self.classification_log:
            return {"emails_classified": 0}
        return {
            "emails_classified": len(self.classification_log),
            "intent_distribution": self.intent_stats,
            "reply_all_enforced": len(self.reply_all_audit),
            "avg_confidence": round(
                sum(c["confidence"] for c in self.classification_log) / len(self.classification_log), 2
            ),
        }


def test_v961():
    engine = EmailIntentClassifier()

    # Test 1: Purchase intent with multi-recipient
    email1 = {
        "id": "int-001",
        "from": "buyer@company.com",
        "to": ["sales@ziontechgroup.com", "partnerships@ziontechgroup.com"],
        "cc": ["cto@company.com"],
        "subject": "Interested in purchasing AI Cloud Platform",
        "body": "Hi, we'd like to purchase your AI Cloud Platform for our team of 50. Can you send us a quote and pricing details? We're also interested in the enterprise plan.",
    }
    r1 = engine.analyze_email_case_by_case(email1)
    assert r1["reply_all_enforcement"]["enforced"] is True
    assert r1["primary_intent"]["category"] in ("purchase_intent", "upsell_opportunity")
    print(f"✅ Test 1 PASSED: Intent={r1['primary_intent']['category']}, confidence={r1['primary_intent']['confidence']}, reply-all enforced")

    # Test 2: Complaint
    email2 = {
        "id": "int-002",
        "from": "angry@customer.com",
        "to": ["support@ziontechgroup.com"],
        "subject": "Terrible service!!!",
        "body": "I'm extremely frustrated and dissatisfied with your service. It's terrible and the worst experience I've ever had. Fix this immediately or I want a refund!",
    }
    r2 = engine.analyze_email_case_by_case(email2)
    assert r2["primary_intent"]["priority"] == "CRITICAL"
    print(f"✅ Test 2 PASSED: Intent={r2['primary_intent']['category']}, priority={r2['primary_intent']['priority']}, sentiment={r2['sentiment']['polarity']}")

    # Test 3: Cancellation
    email3 = {
        "id": "int-003",
        "from": "user@startup.io",
        "to": ["billing@ziontechgroup.com", "support@ziontechgroup.com"],
        "subject": "Cancel my subscription",
        "body": "I'd like to cancel my subscription and get a refund. The service is not what I expected.",
    }
    r3 = engine.analyze_email_case_by_case(email3)
    assert r3["reply_all_enforcement"]["enforced"] is True
    assert r3["primary_intent"]["category"] == "cancellation"
    print(f"✅ Test 3 PASSED: Intent={r3['primary_intent']['category']}, action={r3['recommended_action']}")

    stats = engine.get_stats()
    print(f"✅ Test 4 PASSED: {stats['emails_classified']} classified, intents: {stats['intent_distribution']}")

    print("\n🎉 V961 ALL TESTS PASSED — Email Intent Classifier Engine operational!")
    return True


if __name__ == "__main__":
    test_v961()
