#!/usr/bin/env python3
"""
V985: Email Campaign Optimizer Engine
Analyzes campaign emails for engagement, timing, and conversion signals.
Enables higher campaign ROI through data-driven optimization.
"""

import re
import hashlib
from datetime import datetime, timezone
from typing import Dict, List, Any
from collections import defaultdict


class EmailCampaignOptimizer:
    """Optimizes email campaigns through intelligent analysis."""

    def __init__(self):
        self.campaign_log: List[Dict] = []
        self.reply_all_audit: List[Dict] = []
        self.campaign_database: Dict[str, Dict] = {}

    def analyze_email_case_by_case(self, email: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze email for campaign optimization case by case."""
        analysis = {
            "engine": "V985",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "email_id": email.get("id", hashlib.md5(str(email).encode()).hexdigest()[:12]),
            "analysis_type": "campaign_optimization",
        }

        to_recipients = email.get("to", [])
        cc_recipients = email.get("cc", [])
        all_recipients = to_recipients + cc_recipients
        is_multi_recipient = len(all_recipients) > 1

        body = email.get("body", "")
        subject = email.get("subject", "")
        sender = email.get("from", "")

        # 1. Detect campaign email
        is_campaign = self._detect_campaign_email(subject, body, sender)
        analysis["is_campaign_email"] = is_campaign

        if not is_campaign["is_campaign"]:
            analysis["recommended_action"] = "NOT_A_CAMPAIGN"
            reply_all = self._enforce_reply_all(email, all_recipients, is_multi_recipient)
            analysis["reply_all_enforcement"] = reply_all
            return analysis

        # 2. Subject line analysis
        subject_analysis = self._analyze_subject_line(subject)
        analysis["subject_analysis"] = subject_analysis

        # 3. Content engagement analysis
        engagement_analysis = self._analyze_engagement(body)
        analysis["engagement_analysis"] = engagement_analysis

        # 4. CTA analysis
        cta_analysis = self._analyze_ctas(body)
        analysis["cta_analysis"] = cta_analysis

        # 5. Timing optimization
        timing_analysis = self._analyze_timing(email)
        analysis["timing_analysis"] = timing_analysis

        # 6. Personalization analysis
        personalization_analysis = self._analyze_personalization(body, email)
        analysis["personalization_analysis"] = personalization_analysis

        # 7. A/B test recommendations
        ab_recommendations = self._generate_ab_test_recommendations(
            subject_analysis, engagement_analysis, cta_analysis
        )
        analysis["ab_test_recommendations"] = ab_recommendations

        # 8. Campaign score
        campaign_score = self._calculate_campaign_score(
            subject_analysis, engagement_analysis, cta_analysis,
            timing_analysis, personalization_analysis
        )
        analysis["campaign_score"] = campaign_score

        # 9. Optimization recommendations
        optimization = self._generate_optimization_recommendations(
            subject_analysis, engagement_analysis, cta_analysis,
            timing_analysis, personalization_analysis
        )
        analysis["optimization_recommendations"] = optimization

        # 10. Determine action
        action = self._determine_campaign_action(campaign_score, optimization)
        analysis["recommended_action"] = action

        # REPLY-ALL ENFORCEMENT
        reply_all = self._enforce_reply_all(email, all_recipients, is_multi_recipient)
        analysis["reply_all_enforcement"] = reply_all

        self.campaign_log.append({
            "email_id": analysis["email_id"],
            "campaign_score": campaign_score["score"],
            "subject_score": subject_analysis["score"],
            "engagement_score": engagement_analysis["score"],
            "cta_count": len(cta_analysis["ctas"]),
            "reply_all": reply_all["enforced"],
            "timestamp": analysis["timestamp"],
        })

        return analysis

    def _detect_campaign_email(self, subject: str, body: str, sender: str) -> Dict:
        """Detect if email is a campaign/marketing email."""
        signals = []
        
        # Sender patterns
        campaign_senders = ["noreply", "newsletter", "marketing", "offers", "promotions"]
        if any(s in sender.lower() for s in campaign_senders):
            signals.append("campaign_sender")
        
        # Subject patterns
        campaign_subject_patterns = [
            r'(?:special|exclusive|limited)\s+(?:offer|deal)',
            r'(?:save|discount)\s+\d+\s*%',
            r'(?:new|latest)\s+(?:product|feature|update)',
            r'(?:don\'t miss|last chance|hurry)',
        ]
        
        for pattern in campaign_subject_patterns:
            if re.search(pattern, subject, re.IGNORECASE):
                signals.append("campaign_subject")
                break
        
        # Body patterns
        campaign_body_patterns = [
            r'(?:unsubscribe|opt[- ]?out)',
            r'(?:click here|shop now|learn more|buy now)',
            r'(?:exclusive|members? only|subscribers?)',
        ]
        
        for pattern in campaign_body_patterns:
            if re.search(pattern, body, re.IGNORECASE):
                signals.append("campaign_body")
                break
        
        return {
            "is_campaign": len(signals) >= 2,
            "confidence": min(len(signals) / 3, 1.0),
            "signals": signals,
        }

    def _analyze_subject_line(self, subject: str) -> Dict:
        """Analyze subject line effectiveness."""
        analysis = {
            "length": len(subject),
            "word_count": len(subject.split()),
            "score": 50,
            "factors": [],
        }
        
        # Length optimization (30-50 chars is optimal)
        if 30 <= len(subject) <= 50:
            analysis["score"] += 20
            analysis["factors"].append("Optimal length")
        elif len(subject) > 60:
            analysis["score"] -= 10
            analysis["factors"].append("Too long")
        
        # Personalization tokens
        if re.search(r'\{[^}]+\}|\[.*?\]|%.*?%', subject):
            analysis["score"] += 15
            analysis["factors"].append("Personalization tokens")
        
        # Urgency/scarcity
        urgency_words = ["limited", "today", "now", "hurry", "last chance", "expires"]
        if any(word in subject.lower() for word in urgency_words):
            analysis["score"] += 10
            analysis["factors"].append("Urgency/scarcity")
        
        # Numbers
        if re.search(r'\d+', subject):
            analysis["score"] += 10
            analysis["factors"].append("Numbers present")
        
        # Questions
        if "?" in subject:
            analysis["score"] += 5
            analysis["factors"].append("Question format")
        
        # Emoji
        if re.search(r'[\U0001F600-\U0001F64F\U0001F300-\U0001F5FF]', subject):
            analysis["score"] += 5
            analysis["factors"].append("Emoji present")
        
        # Spam triggers
        spam_words = ["free", "guarantee", "winner", "congratulations"]
        if any(word in subject.lower() for word in spam_words):
            analysis["score"] -= 15
            analysis["factors"].append("Spam trigger words")
        
        analysis["score"] = max(0, min(100, analysis["score"]))
        
        return analysis

    def _analyze_engagement(self, body: str) -> Dict:
        """Analyze content engagement potential."""
        analysis = {
            "word_count": len(body.split()),
            "score": 50,
            "factors": [],
        }
        
        # Length (200-500 words optimal for campaigns)
        if 200 <= analysis["word_count"] <= 500:
            analysis["score"] += 20
            analysis["factors"].append("Optimal length")
        elif analysis["word_count"] > 800:
            analysis["score"] -= 15
            analysis["factors"].append("Too long")
        
        # Storytelling elements
        story_patterns = [
            r'(?:imagine|picture this|let me tell)',
            r'(?:once upon|story|journey)',
        ]
        
        if any(re.search(p, body, re.IGNORECASE) for p in story_patterns):
            analysis["score"] += 15
            analysis["factors"].append("Storytelling elements")
        
        # Social proof
        social_proof_patterns = [
            r'(?:\d+\s*(?:customers?|users?|clients?))',
            r'(?:testimonials?|reviews?|ratings?)',
            r'(?:trusted by|recommended by)',
        ]
        
        if any(re.search(p, body, re.IGNORECASE) for p in social_proof_patterns):
            analysis["score"] += 15
            analysis["factors"].append("Social proof")
        
        # Emotional triggers
        emotional_words = ["exciting", "amazing", "transform", "discover", "unlock"]
        if any(word in body.lower() for word in emotional_words):
            analysis["score"] += 10
            analysis["factors"].append("Emotional triggers")
        
        # Questions for engagement
        question_count = body.count("?")
        if question_count >= 2:
            analysis["score"] += 10
            analysis["factors"].append("Engagement questions")
        
        analysis["score"] = max(0, min(100, analysis["score"]))
        
        return analysis

    def _analyze_ctas(self, body: str) -> Dict:
        """Analyze call-to-action elements."""
        cta_patterns = [
            (r'(?:click here|click below|tap here)', "generic"),
            (r'(?:shop now|buy now|purchase)', "purchase"),
            (r'(?:learn more|read more|discover)', "informational"),
            (r'(?:sign up|register|join)', "signup"),
            (r'(?:download|get|grab)', "download"),
            (r'(?:schedule|book|reserve)', "booking"),
            (r'(?:start|begin|try)', "trial"),
        ]
        
        ctas = []
        for pattern, cta_type in cta_patterns:
            matches = re.finditer(pattern, body, re.IGNORECASE)
            for match in matches:
                ctas.append({
                    "text": match.group(0),
                    "type": cta_type,
                    "position": match.start(),
                })
        
        # Score based on CTA quality
        score = 30  # Base score
        factors = []
        
        if len(ctas) >= 1:
            score += 30
            factors.append(f"{len(ctas)} CTA(s) found")
        
        if any(c["type"] != "generic" for c in ctas):
            score += 20
            factors.append("Specific CTAs")
        
        # Check for CTA placement (early in email is better)
        if ctas and ctas[0]["position"] < len(body) * 0.3:
            score += 15
            factors.append("Early CTA placement")
        
        score = max(0, min(100, score))
        
        return {
            "ctas": ctas,
            "count": len(ctas),
            "score": score,
            "factors": factors,
        }

    def _analyze_timing(self, email: Dict) -> Dict:
        """Analyze email timing for optimization."""
        timestamp = email.get("timestamp", "")
        
        try:
            dt = datetime.fromisoformat(timestamp.replace("Z", "+00:00"))
            hour = dt.hour
            weekday = dt.weekday()
        except:
            dt = datetime.now(timezone.utc)
            hour = dt.hour
            weekday = dt.weekday()
        
        analysis = {
            "hour": hour,
            "weekday": weekday,
            "day_name": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"][weekday],
            "score": 50,
            "factors": [],
        }
        
        # Optimal send times (Tuesday-Thursday, 9-11 AM or 1-3 PM)
        if 1 <= weekday <= 3:  # Tue-Thu
            analysis["score"] += 20
            analysis["factors"].append("Optimal day")
        
        if 9 <= hour <= 11 or 13 <= hour <= 15:
            analysis["score"] += 20
            analysis["factors"].append("Optimal time")
        
        # Avoid weekends
        if weekday >= 5:
            analysis["score"] -= 15
            analysis["factors"].append("Weekend send")
        
        # Avoid very early/late
        if hour < 7 or hour > 20:
            analysis["score"] -= 10
            analysis["factors"].append("Off-hours send")
        
        analysis["score"] = max(0, min(100, analysis["score"]))
        
        return analysis

    def _analyze_personalization(self, body: str, email: Dict) -> Dict:
        """Analyze personalization level."""
        analysis = {
            "score": 30,
            "factors": [],
        }
        
        # Name personalization
        if re.search(r'\{[^}]*name[^}]*\}|\[.*?name.*?\]', body, re.IGNORECASE):
            analysis["score"] += 25
            analysis["factors"].append("Name personalization")
        
        # Dynamic content
        if re.search(r'\{[^}]+\}|\[.*?\]', body):
            analysis["score"] += 20
            analysis["factors"].append("Dynamic content tokens")
        
        # Segmentation indicators
        segment_words = ["based on", "because you", "since you", "your interest"]
        if any(word in body.lower() for word in segment_words):
            analysis["score"] += 15
            analysis["factors"].append("Segmentation")
        
        # Behavioral triggers
        behavior_words = ["recently viewed", "abandoned", "last purchase", "birthday"]
        if any(word in body.lower() for word in behavior_words):
            analysis["score"] += 15
            analysis["factors"].append("Behavioral trigger")
        
        analysis["score"] = max(0, min(100, analysis["score"]))
        
        return analysis

    def _generate_ab_test_recommendations(self, subject: Dict, engagement: Dict, 
                                          cta: Dict) -> List[Dict]:
        """Generate A/B test recommendations."""
        recommendations = []
        
        if subject["score"] < 70:
            recommendations.append({
                "element": "subject_line",
                "test": "Test shorter vs longer subject",
                "priority": "HIGH",
            })
        
        if cta["count"] < 2:
            recommendations.append({
                "element": "cta",
                "test": "Test CTA placement and wording",
                "priority": "MEDIUM",
            })
        
        if engagement["score"] < 60:
            recommendations.append({
                "element": "content",
                "test": "Test storytelling vs direct approach",
                "priority": "MEDIUM",
            })
        
        return recommendations

    def _calculate_campaign_score(self, subject: Dict, engagement: Dict, 
                                   cta: Dict, timing: Dict, 
                                   personalization: Dict) -> Dict:
        """Calculate overall campaign score."""
        weights = {
            "subject": 0.25,
            "engagement": 0.25,
            "cta": 0.20,
            "timing": 0.15,
            "personalization": 0.15,
        }
        
        weighted_score = (
            subject["score"] * weights["subject"] +
            engagement["score"] * weights["engagement"] +
            cta["score"] * weights["cta"] +
            timing["score"] * weights["timing"] +
            personalization["score"] * weights["personalization"]
        )
        
        if weighted_score >= 85:
            level = "EXCELLENT"
        elif weighted_score >= 70:
            level = "GOOD"
        elif weighted_score >= 55:
            level = "FAIR"
        else:
            level = "NEEDS_IMPROVEMENT"
        
        return {
            "score": round(weighted_score, 1),
            "level": level,
            "breakdown": {
                "subject": subject["score"],
                "engagement": engagement["score"],
                "cta": cta["score"],
                "timing": timing["score"],
                "personalization": personalization["score"],
            },
        }

    def _generate_optimization_recommendations(self, subject: Dict, engagement: Dict,
                                                cta: Dict, timing: Dict,
                                                personalization: Dict) -> List[Dict]:
        """Generate optimization recommendations."""
        recommendations = []
        
        if subject["score"] < 70:
            recommendations.append({
                "area": "Subject Line",
                "issue": "Subject line could be more engaging",
                "recommendation": "Add urgency, numbers, or personalization",
                "priority": "HIGH",
            })
        
        if engagement["score"] < 60:
            recommendations.append({
                "area": "Content Engagement",
                "issue": "Content lacks engagement elements",
                "recommendation": "Add storytelling, social proof, or emotional triggers",
                "priority": "HIGH",
            })
        
        if cta["count"] == 0:
            recommendations.append({
                "area": "Call-to-Action",
                "issue": "No CTAs detected",
                "recommendation": "Add clear, specific CTAs",
                "priority": "CRITICAL",
            })
        elif cta["score"] < 60:
            recommendations.append({
                "area": "Call-to-Action",
                "issue": "CTAs could be more effective",
                "recommendation": "Use action-oriented, specific CTA text",
                "priority": "MEDIUM",
            })
        
        if timing["score"] < 60:
            recommendations.append({
                "area": "Timing",
                "issue": "Suboptimal send time",
                "recommendation": "Send Tuesday-Thursday, 9-11 AM or 1-3 PM",
                "priority": "MEDIUM",
            })
        
        if personalization["score"] < 50:
            recommendations.append({
                "area": "Personalization",
                "issue": "Low personalization",
                "recommendation": "Add name tokens and behavioral triggers",
                "priority": "MEDIUM",
            })
        
        return recommendations

    def _determine_campaign_action(self, campaign_score: Dict, optimization: List[Dict]) -> str:
        """Determine campaign action."""
        if campaign_score["level"] == "EXCELLENT":
            return "LAUNCH_CAMPAIGN"
        elif campaign_score["level"] == "GOOD" and len(optimization) <= 2:
            return "MINOR_OPTIMIZATION_THEN_LAUNCH"
        elif len(optimization) > 3:
            return "MAJOR_REVISION_REQUIRED"
        else:
            return "OPTIMIZE_AND_TEST"

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
        if not self.campaign_log:
            return {"campaigns_analyzed": 0}
        return {
            "campaigns_analyzed": len(self.campaign_log),
            "avg_campaign_score": sum(c["campaign_score"] for c in self.campaign_log) / len(self.campaign_log),
            "avg_subject_score": sum(c["subject_score"] for c in self.campaign_log) / len(self.campaign_log),
            "avg_engagement_score": sum(c["engagement_score"] for c in self.campaign_log) / len(self.campaign_log),
            "total_ctas_detected": sum(c["cta_count"] for c in self.campaign_log),
            "reply_all_enforced": len(self.reply_all_audit),
        }


def test_v985():
    engine = EmailCampaignOptimizer()

    # Test 1: Marketing campaign email
    email1 = {
        "id": "camp-001",
        "from": "marketing@company.com",
        "to": ["subscriber1@example.com", "subscriber2@example.com", "subscriber3@example.com"],
        "subject": "🎉 Limited Time: Save 50% on All Products - Today Only!",
        "body": "Hi {name},\n\nImagine transforming your business with our powerful tools. Over 10,000 customers trust us. Based on your recent interest, we have an exclusive offer.\n\nShop now and save 50%! Click here to browse products.\n\nDon't miss this limited-time offer!\n\nUnsubscribe: click here",
        "timestamp": "2024-01-16T10:00:00Z",
    }
    r1 = engine.analyze_email_case_by_case(email1)
    assert r1["reply_all_enforcement"]["enforced"] is True
    assert r1["is_campaign_email"]["is_campaign"] is True
    assert r1["campaign_score"]["score"] >= 60
    assert len(r1["cta_analysis"]["ctas"]) >= 1
    print(f"✅ Test 1 PASSED: Campaign detected, score={r1['campaign_score']['score']}, CTAs={len(r1['cta_analysis']['ctas'])}, reply-all enforced")

    # Test 2: Non-campaign email
    email2 = {
        "id": "camp-002",
        "from": "user@company.com",
        "to": ["support@ziontechgroup.com"],
        "subject": "Question about my account",
        "body": "Hi, I have a question about my account settings.",
    }
    r2 = engine.analyze_email_case_by_case(email2)
    assert r2["is_campaign_email"]["is_campaign"] is False
    assert r2["recommended_action"] == "NOT_A_CAMPAIGN"
    print(f"✅ Test 2 PASSED: Non-campaign email correctly identified")

    stats = engine.get_stats()
    print(f"✅ Test 3 PASSED: {stats['campaigns_analyzed']} campaigns analyzed, avg score={stats['avg_campaign_score']:.1f}")

    print("\n🎉 V985 ALL TESTS PASSED — Email Campaign Optimizer operational!")
    return True


if __name__ == "__main__":
    test_v985()
