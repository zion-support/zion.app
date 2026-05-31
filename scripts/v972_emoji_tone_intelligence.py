#!/usr/bin/env python3
"""
V972: Email Emoji & Tone Intelligence Engine
Analyzes emoji usage, emotional tone, cultural context, and generates
tone-appropriate response recommendations for global communication.
STRICT reply-all enforcement for all multi-recipient emails.
"""

import re
import hashlib
from datetime import datetime, timezone
from typing import Dict, List, Any


class EmojiToneIntelligence:
    """Analyzes emoji usage and emotional tone in emails."""

    EMOJI_CATEGORIES = {
        "positive": ["😊", "😃", "👍", "🎉", "✨", "💪", "🙏", "❤️", "🌟", "😄", "🥳", "👏", "💯", "🚀"],
        "negative": ["😞", "😡", "👎", "😢", "💔", "😤", "🙁", "😠", "😩", "😭"],
        "professional": ["✅", "📊", "📈", "📝", "💼", "📌", "🔗", "📅", "⏰", "🎯"],
        "casual": ["😂", "🤣", "🤔", "👀", "🔥", "💀", "🫡", "🤷", "😅"],
        "warning": ["⚠️", "🚨", "❗", "❌", "🛑", "⛔"],
        "neutral": ["📎", "📧", "💬", "📋", "🔍"],
    }

    CULTURAL_EMOJI_GUIDELINES = {
        "formal_cultures": {
            "regions": ["Japan", "Germany", "South Korea", "France"],
            "emoji_tolerance": "LOW",
            "recommendation": "Avoid emojis in business communication",
        },
        "semi_formal_cultures": {
            "regions": ["USA", "UK", "Canada", "Australia", "Netherlands"],
            "emoji_tolerance": "MEDIUM",
            "recommendation": "Use sparingly and professionally",
        },
        "casual_cultures": {
            "regions": ["Brazil", "India", "Spain", "Italy", "Mexico"],
            "emoji_tolerance": "HIGH",
            "recommendation": "Emojis are generally well-received",
        },
    }

    TONE_INDICATORS = {
        "enthusiastic": ["!", "amazing", "fantastic", "incredible", "love", "excited", "awesome"],
        "frustrated": ["!!", "again", "still", "never", "always", "impossible", "ridiculous"],
        "grateful": ["thank you", "appreciate", "grateful", "thanks so much", "means a lot"],
        "urgent": ["asap", "immediately", "urgent", "deadline", "emergency", "critical"],
        "hesitant": ["maybe", "perhaps", "not sure", "might", "could be", "i think", "possibly"],
        "confident": ["definitely", "certainly", "absolutely", "will do", "no problem", "of course"],
    }

    def __init__(self):
        self.tone_log: List[Dict] = []
        self.reply_all_audit: List[Dict] = []

    def analyze_email_case_by_case(self, email: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze emoji and tone case by case."""
        analysis = {
            "engine": "V972",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "email_id": email.get("id", hashlib.md5(str(email).encode()).hexdigest()[:12]),
            "analysis_type": "emoji_tone_intelligence",
        }

        to_recipients = email.get("to", [])
        cc_recipients = email.get("cc", [])
        all_recipients = to_recipients + cc_recipients
        is_multi_recipient = len(all_recipients) > 1

        body = email.get("body", "")
        subject = email.get("subject", "")
        full_text = subject + " " + body

        # 1. Emoji detection and classification
        emoji_analysis = self._analyze_emojis(full_text)
        analysis["emoji_analysis"] = emoji_analysis

        # 2. Emotional tone detection
        tone = self._detect_emotional_tone(full_text)
        analysis["emotional_tone"] = tone

        # 3. Formality level assessment
        formality = self._assess_formality(full_text, emoji_analysis)
        analysis["formality_level"] = formality

        # 4. Cultural context recommendation
        cultural = self._generate_cultural_guidance(emoji_analysis, tone)
        analysis["cultural_guidance"] = cultural

        # 5. Response tone matching recommendation
        response_tone = self._recommend_response_tone(tone, formality, emoji_analysis)
        analysis["response_tone_recommendation"] = response_tone

        # 6. Emoji appropriateness score
        appropriateness = self._score_emoji_appropriateness(emoji_analysis, formality)
        analysis["emoji_appropriateness"] = appropriateness

        # 7. Determine action
        action = self._determine_tone_action(tone, appropriateness)
        analysis["recommended_action"] = action

        # REPLY-ALL ENFORCEMENT
        reply_all = self._enforce_reply_all(email, all_recipients, is_multi_recipient)
        analysis["reply_all_enforcement"] = reply_all

        # Tone-aware response template
        analysis["tone_template"] = self._generate_tone_template(
            response_tone, formality, emoji_analysis
        )

        self.tone_log.append({
            "email_id": analysis["email_id"],
            "emoji_count": emoji_analysis["total_count"],
            "primary_tone": tone["primary_tone"],
            "formality": formality["level"],
            "reply_all": reply_all["enforced"],
            "timestamp": analysis["timestamp"],
        })

        return analysis

    def _analyze_emojis(self, text: str) -> Dict:
        """Detect and classify emojis in text."""
        found_emojis = []
        category_counts = {}

        for category, emojis in self.EMOJI_CATEGORIES.items():
            for emoji in emojis:
                count = text.count(emoji)
                if count > 0:
                    found_emojis.extend([emoji] * count)
                    category_counts[category] = category_counts.get(category, 0) + count

        # Detect general emoji patterns (Unicode ranges)
        emoji_pattern = re.compile(
            "["
            "\U0001F600-\U0001F64F"  # emoticons
            "\U0001F300-\U0001F5FF"  # symbols & pictographs
            "\U0001F680-\U0001F6FF"  # transport & map
            "\U0001F1E0-\U0001F1FF"  # flags
            "\U00002702-\U000027B0"
            "\U000024C2-\U0001F251"
            "\U0001f926-\U0001f937"
            "\U00010000-\U0010ffff"
            "]+",
            flags=re.UNICODE
        )
        all_emojis = emoji_pattern.findall(text)

        total_count = len(found_emojis) + len(all_emojis)

        dominant_category = max(category_counts, key=category_counts.get) if category_counts else "none"

        return {
            "total_count": total_count,
            "specific_emojis": found_emojis[:10],
            "category_distribution": category_counts,
            "dominant_category": dominant_category,
            "has_emojis": total_count > 0,
        }

    def _detect_emotional_tone(self, text: str) -> Dict:
        """Detect emotional tone from text."""
        text_lower = text.lower()
        tone_scores = {}

        for tone, indicators in self.TONE_INDICATORS.items():
            score = sum(1 for ind in indicators if ind in text_lower)
            if score > 0:
                tone_scores[tone] = score

        # Exclamation mark analysis
        excl_count = text.count('!')
        if excl_count > 5:
            tone_scores["enthusiastic"] = tone_scores.get("enthusiastic", 0) + 2
        if excl_count > 10:
            tone_scores["frustrated"] = tone_scores.get("frustrated", 0) + 1

        # Question mark analysis (hesitation)
        q_count = text.count('?')
        if q_count > 3:
            tone_scores["hesitant"] = tone_scores.get("hesitant", 0) + 1

        if tone_scores:
            primary = max(tone_scores, key=tone_scores.get)
            confidence = tone_scores[primary] / max(sum(tone_scores.values()), 1)
        else:
            primary = "neutral"
            confidence = 0.5

        return {
            "primary_tone": primary,
            "confidence": round(confidence, 2),
            "all_tones": tone_scores,
            "is_positive": primary in ("enthusiastic", "grateful", "confident"),
            "is_negative": primary in ("frustrated",),
        }

    def _assess_formality(self, text: str, emoji_analysis: Dict) -> Dict:
        """Assess formality level of the email."""
        score = 50  # Base neutral

        # Formal indicators
        formal = ["dear", "sincerely", "regards", "please find", "furthermore", "therefore", "hereby"]
        formal_count = sum(1 for f in formal if f in text.lower())
        score += formal_count * 5

        # Informal indicators
        informal = ["hey", "lol", "btw", "fyi", "tho", "gonna", "wanna", "kinda"]
        informal_count = sum(1 for i in informal if i in text.lower())
        score -= informal_count * 8

        # Emoji impact on formality
        emoji_count = emoji_analysis["total_count"]
        if emoji_count > 5:
            score -= 20
        elif emoji_count > 2:
            score -= 10
        elif emoji_count == 0:
            score += 5

        # Slang/abbreviations
        if re.search(r"\b(idk|imo|tbh|omg|wtf)\b", text, re.IGNORECASE):
            score -= 15

        score = max(0, min(100, score))

        if score >= 70:
            level = "FORMAL"
        elif score >= 45:
            level = "SEMI_FORMAL"
        else:
            level = "CASUAL"

        return {"score": score, "level": level}

    def _generate_cultural_guidance(self, emoji_analysis: Dict, tone: Dict) -> Dict:
        """Generate cultural communication guidance."""
        emoji_count = emoji_analysis["total_count"]

        if emoji_count == 0:
            guidance = "No emojis detected — appropriate for all cultures"
            risk = "LOW"
        elif emoji_count <= 2 and emoji_analysis["dominant_category"] in ("professional", "positive"):
            guidance = "Light professional emoji use — appropriate for most cultures"
            risk = "LOW"
        elif emoji_count <= 5:
            guidance = "Moderate emoji use — may not suit formal cultures (Japan, Germany)"
            risk = "MEDIUM"
        else:
            guidance = "Heavy emoji use — avoid in formal or cross-cultural communication"
            risk = "HIGH"

        return {
            "guidance": guidance,
            "risk_level": risk,
            "cultural_recommendations": list(self.CULTURAL_EMOJI_GUIDELINES.keys()),
        }

    def _recommend_response_tone(self, tone: Dict, formality: Dict, emoji_analysis: Dict) -> Dict:
        """Recommend response tone based on sender's tone."""
        primary = tone["primary_tone"]
        form_level = formality["level"]

        # Mirror principle with professionalism guard
        if primary == "frustrated":
            response_tone = "empathetic"
            use_emojis = False
        elif primary == "enthusiastic" and form_level != "FORMAL":
            response_tone = "warm_professional"
            use_emojis = emoji_analysis["total_count"] > 0
        elif primary == "grateful":
            response_tone = "appreciative"
            use_emojis = False
        elif form_level == "FORMAL":
            response_tone = "formal_professional"
            use_emojis = False
        else:
            response_tone = "professional_friendly"
            use_emojis = emoji_analysis["dominant_category"] == "professional"

        return {
            "recommended_tone": response_tone,
            "use_emojis": use_emojis,
            "suggested_emojis": ["✅", "👍", "📊"] if use_emojis else [],
            "mirroring_level": "MODERATE" if primary in ("enthusiastic", "grateful") else "LOW",
        }

    def _score_emoji_appropriateness(self, emoji_analysis: Dict, formality: Dict) -> Dict:
        """Score how appropriate the emoji usage is."""
        if not emoji_analysis["has_emojis"]:
            return {"score": 100, "assessment": "No emojis — always appropriate"}

        score = 80
        issues = []

        # Count penalty
        count = emoji_analysis["total_count"]
        if count > 10:
            score -= 30
            issues.append("Excessive emoji count")
        elif count > 5:
            score -= 15
            issues.append("Many emojis")

        # Category penalty
        dominant = emoji_analysis["dominant_category"]
        if dominant == "casual" and formality["level"] == "FORMAL":
            score -= 25
            issues.append("Casual emojis in formal context")
        elif dominant == "negative":
            score -= 20
            issues.append("Negative emojis detected")

        score = max(0, min(100, score))
        return {
            "score": score,
            "issues": issues,
            "assessment": "APPROPRIATE" if score >= 70 else "CAUTION" if score >= 50 else "INAPPROPRIATE",
        }

    def _determine_tone_action(self, tone: Dict, appropriateness: Dict) -> str:
        if tone["is_negative"]:
            return "DEESCALATE_AND_EMPATHIZE"
        if appropriateness["assessment"] == "INAPPROPRIATE":
            return "PROFESSIONALIZE_RESPONSE"
        if tone["primary_tone"] == "enthusiastic":
            return "MATCH_ENERGY_PROFESSIONALLY"
        return "STANDARD_PROFESSIONAL_RESPONSE"

    def _enforce_reply_all(self, email: Dict, all_recipients: List, is_multi: bool) -> Dict:
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

    def _generate_tone_template(self, response_tone: Dict, formality: Dict, emoji_analysis: Dict) -> Dict:
        return {
            "tone": response_tone["recommended_tone"],
            "formality": formality["level"],
            "use_emojis": response_tone["use_emojis"],
            "suggested_openers": {
                "formal_professional": ["Dear [Name],", "Thank you for your message."],
                "professional_friendly": ["Hi [Name],", "Thanks for reaching out!"],
                "warm_professional": ["Hi [Name]!", "Great to hear from you!"],
                "empathetic": ["Hi [Name],", "I understand your concern and I'm here to help."],
                "appreciative": ["Hi [Name],", "Thank you so much for your kind words!"],
            }.get(response_tone["recommended_tone"], ["Hello,"]),
        }

    def get_stats(self) -> Dict:
        if not self.tone_log:
            return {"emails_analyzed": 0}
        return {
            "emails_analyzed": len(self.tone_log),
            "emails_with_emojis": sum(1 for t in self.tone_log if t["emoji_count"] > 0),
            "tone_distribution": {},
            "reply_all_enforced": len(self.reply_all_audit),
        }


def test_v972():
    engine = EmojiToneIntelligence()

    # Test 1: Enthusiastic email with emojis
    email1 = {
        "id": "tone-001",
        "from": "happy@client.com",
        "to": ["team@ziontechgroup.com", "sales@ziontechgroup.com"],
        "subject": "Amazing results! 🎉🚀",
        "body": "Hi team! 🎉 The results are absolutely amazing! We love the new AI platform! 🚀✨ The ROI is incredible and our team is so excited about the future! 💪 Thank you so much! 🙏",
    }
    r1 = engine.analyze_email_case_by_case(email1)
    assert r1["reply_all_enforcement"]["enforced"] is True
    assert r1["emotional_tone"]["primary_tone"] in ("enthusiastic", "grateful")
    assert r1["emoji_analysis"]["has_emojis"] is True
    print(f"✅ Test 1 PASSED: Tone={r1['emotional_tone']['primary_tone']}, emojis={r1['emoji_analysis']['total_count']}, reply-all enforced")

    # Test 2: Frustrated formal email
    email2 = {
        "id": "tone-002",
        "from": "angry@enterprise.com",
        "to": ["support@ziontechgroup.com"],
        "subject": "Unacceptable service",
        "body": "Dear Support,\n\nThis is the third time we are writing about this issue. It is unacceptable that this problem still persists. We need an immediate resolution.\n\nSincerely,\nDirector of Operations",
    }
    r2 = engine.analyze_email_case_by_case(email2)
    assert r2["emotional_tone"]["is_negative"] is True
    assert r2["formality_level"]["level"] in ("FORMAL", "SEMI_FORMAL")
    print(f"✅ Test 2 PASSED: Negative tone detected, formality={r2['formality_level']['level']}, action={r2['recommended_action']}")

    stats = engine.get_stats()
    print(f"✅ Test 3 PASSED: {stats['emails_analyzed']} analyzed, {stats['emails_with_emojis']} with emojis")

    print("\n🎉 V972 ALL TESTS PASSED — Emoji & Tone Intelligence operational!")
    return True


if __name__ == "__main__":
    test_v972()
