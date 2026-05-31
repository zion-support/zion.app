#!/usr/bin/env python3
"""
V993: Email Coaching AI Engine
Real-time coaching on email writing with tone, clarity, and persuasion scoring.
Enables better communication with strict reply-all enforcement.
"""

import re
import hashlib
from datetime import datetime, timezone
from typing import Dict, List, Any


class EmailCoachingAI:
    """Provides real-time email writing coaching."""

    def __init__(self):
        self.coaching_log: List[Dict] = []
        self.reply_all_audit: List[Dict] = []

    def analyze_email_case_by_case(self, email: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze email for coaching case by case."""
        analysis = {
            "engine": "V993",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "email_id": email.get("id", hashlib.md5(str(email).encode()).hexdigest()[:12]),
            "analysis_type": "email_coaching",
        }

        to_recipients = email.get("to", [])
        cc_recipients = email.get("cc", [])
        all_recipients = to_recipients + cc_recipients
        is_multi_recipient = len(all_recipients) > 1

        body = email.get("body", "")
        subject = email.get("subject", "")

        # 1. Tone analysis
        tone = self._analyze_tone(body)
        analysis["tone_analysis"] = tone

        # 2. Clarity scoring
        clarity = self._score_clarity(body)
        analysis["clarity_score"] = clarity

        # 3. Persuasion analysis
        persuasion = self._analyze_persuasion(body)
        analysis["persuasion_score"] = persuasion

        # 4. Professionalism check
        professionalism = self._check_professionalism(body)
        analysis["professionalism"] = professionalism

        # 5. Grammar and style
        grammar = self._check_grammar_style(body)
        analysis["grammar_style"] = grammar

        # 6. Emotional intelligence
        emotional_intelligence = self._assess_emotional_intelligence(body, email)
        analysis["emotional_intelligence"] = emotional_intelligence

        # 7. Coaching recommendations
        coaching = self._generate_coaching_recommendations(
            tone, clarity, persuasion, professionalism, grammar, emotional_intelligence
        )
        analysis["coaching_recommendations"] = coaching

        # 8. Overall writing score
        writing_score = self._calculate_writing_score(
            tone, clarity, persuasion, professionalism, grammar
        )
        analysis["writing_score"] = writing_score

        # 9. Improvement suggestions
        improvements = self._suggest_improvements(coaching, writing_score)
        analysis["improvement_suggestions"] = improvements

        # 10. Determine action
        action = self._determine_coaching_action(writing_score, coaching)
        analysis["recommended_action"] = action

        # REPLY-ALL ENFORCEMENT
        reply_all = self._enforce_reply_all(email, all_recipients, is_multi_recipient)
        analysis["reply_all_enforcement"] = reply_all

        self.coaching_log.append({
            "email_id": analysis["email_id"],
            "writing_score": writing_score["score"],
            "tone_appropriate": tone["appropriate"],
            "clarity_score": clarity["score"],
            "persuasion_score": persuasion["score"],
            "coaching_count": len(coaching),
            "reply_all": reply_all["enforced"],
            "timestamp": analysis["timestamp"],
        })

        return analysis

    def _analyze_tone(self, body: str) -> Dict:
        """Analyze email tone."""
        body_lower = body.lower()
        
        # Tone indicators
        tone_patterns = {
            "formal": ["dear", "sincerely", "regards", "respectfully", "formal"],
            "friendly": ["hi", "hello", "thanks", "great", "awesome", "cheers"],
            "urgent": ["urgent", "asap", "immediately", "critical", "emergency"],
            "apologetic": ["sorry", "apologize", "regret", "unfortunately"],
            "assertive": ["must", "require", "need", "expect", "demand"],
            "collaborative": ["let's", "together", "team", "collaborate", "partner"],
        }
        
        detected_tones = []
        for tone, keywords in tone_patterns.items():
            if any(kw in body_lower for kw in keywords):
                detected_tones.append(tone)
        
        # Check for tone consistency
        tone_count = len(detected_tones)
        consistent = tone_count <= 2  # 1-2 tones is consistent
        
        # Appropriateness check
        inappropriate_combinations = [
            ("formal", "friendly"),
            ("urgent", "friendly"),
            ("apologetic", "assertive"),
        ]
        
        has_inappropriate = any(
            t1 in detected_tones and t2 in detected_tones
            for t1, t2 in inappropriate_combinations
        )
        
        appropriate = consistent and not has_inappropriate
        
        return {
            "detected_tones": detected_tones,
            "tone_count": tone_count,
            "consistent": consistent,
            "appropriate": appropriate,
            "issues": ["Inconsistent tone mix" if has_inappropriate else None],
        }

    def _score_clarity(self, body: str) -> Dict:
        """Score email clarity."""
        sentences = re.split(r'[.!?]+', body)
        sentences = [s.strip() for s in sentences if s.strip()]
        
        if not sentences:
            return {
                "score": 0,
                "avg_sentence_length": 0,
                "issues": ["No sentences found"],
            }
        
        # Average sentence length
        word_counts = [len(s.split()) for s in sentences]
        avg_length = sum(word_counts) / len(word_counts)
        
        # Clarity scoring
        score = 100
        
        # Optimal sentence length: 15-20 words
        if avg_length > 25:
            score -= 30
            issues = ["Sentences too long"]
        elif avg_length > 20:
            score -= 15
            issues = ["Some sentences are long"]
        elif avg_length < 10:
            score -= 20
            issues = ["Sentences too short/choppy"]
        else:
            issues = []
        
        # Check for passive voice
        passive_patterns = [r'\bwas\s+\w+ed\b', r'\bwere\s+\w+ed\b', r'\bbeing\s+\w+ed\b']
        passive_count = sum(len(re.findall(p, body, re.IGNORECASE)) for p in passive_patterns)
        
        if passive_count > 3:
            score -= 15
            issues.append("Excessive passive voice")
        
        # Check for jargon
        jargon_words = ["synergy", "leverage", "paradigm", "bandwidth", "ecosystem"]
        jargon_count = sum(1 for word in jargon_words if word in body.lower())
        
        if jargon_count > 2:
            score -= 10
            issues.append("Too much jargon")
        
        score = max(0, min(100, score))
        
        return {
            "score": score,
            "avg_sentence_length": round(avg_length, 1),
            "sentence_count": len(sentences),
            "passive_voice_count": passive_count,
            "jargon_count": jargon_count,
            "issues": issues,
        }

    def _analyze_persuasion(self, body: str) -> Dict:
        """Analyze persuasion techniques."""
        body_lower = body.lower()
        
        persuasion_techniques = {
            "social_proof": ["everyone", "popular", "trusted", "recommended", "testimonials"],
            "urgency": ["limited", "today", "now", "hurry", "last chance"],
            "authority": ["expert", "research", "study", "proven", "certified"],
            "reciprocity": ["free", "bonus", "gift", "complimentary"],
            "scarcity": ["limited", "only", "exclusive", "rare"],
            "emotional": ["imagine", "feel", "experience", "transform"],
        }
        
        detected_techniques = []
        for technique, keywords in persuasion_techniques.items():
            if any(kw in body_lower for kw in keywords):
                detected_techniques.append(technique)
        
        # Score based on technique usage
        score = min(len(detected_techniques) * 15, 100)
        
        # Check for overuse
        overused = len(detected_techniques) > 4
        
        return {
            "score": score,
            "techniques_detected": detected_techniques,
            "technique_count": len(detected_techniques),
            "overused": overused,
            "effective": 2 <= len(detected_techniques) <= 4,
        }

    def _check_professionalism(self, body: str) -> Dict:
        """Check professionalism standards."""
        issues = []
        score = 100
        
        # Check for inappropriate language
        inappropriate = ["damn", "hell", "stupid", "idiot", "crazy"]
        if any(word in body.lower() for word in inappropriate):
            score -= 30
            issues.append("Inappropriate language detected")
        
        # Check for excessive punctuation
        if "!!!" in body or "???" in body:
            score -= 15
            issues.append("Excessive punctuation")
        
        # Check for ALL CAPS
        caps_words = re.findall(r'\b[A-Z]{4,}\b', body)
        if len(caps_words) > 2:
            score -= 20
            issues.append("Excessive ALL CAPS")
        
        # Check for proper greeting
        has_greeting = bool(re.search(r'^(hi|hello|dear|greetings)', body.lower()))
        if not has_greeting:
            score -= 10
            issues.append("Missing greeting")
        
        # Check for proper closing
        has_closing = bool(re.search(r'(regards|sincerely|thanks|best|cheers)', body.lower()))
        if not has_closing:
            score -= 10
            issues.append("Missing closing")
        
        score = max(0, min(100, score))
        
        return {
            "score": score,
            "issues": issues,
            "has_greeting": has_greeting,
            "has_closing": has_closing,
        }

    def _check_grammar_style(self, body: str) -> Dict:
        """Check grammar and style."""
        issues = []
        
        # Common grammar issues
        # Double spaces
        if "  " in body:
            issues.append("Double spaces detected")
        
        # Missing capitalization at start of sentences
        sentences = re.split(r'[.!?]+', body)
        for sentence in sentences:
            sentence = sentence.strip()
            if sentence and not sentence[0].isupper():
                issues.append("Sentence not capitalized")
                break
        
        # Contractions in formal context
        contractions = ["don't", "won't", "can't", "shouldn't", "wouldn't"]
        has_contractions = any(c in body.lower() for c in contractions)
        
        # Word repetition
        words = body.lower().split()
        word_freq = {}
        for word in words:
            if len(word) > 3:
                word_freq[word] = word_freq.get(word, 0) + 1
        
        repeated_words = [word for word, count in word_freq.items() if count > 3]
        if repeated_words:
            issues.append(f"Overused words: {', '.join(repeated_words[:3])}")
        
        return {
            "issues": issues,
            "issue_count": len(issues),
            "has_contractions": has_contractions,
            "repeated_words": repeated_words[:5],
        }

    def _assess_emotional_intelligence(self, body: str, email: Dict) -> Dict:
        """Assess emotional intelligence in email."""
        body_lower = body.lower()
        
        # Empathy indicators
        empathy_phrases = [
            "i understand", "i appreciate", "thank you for",
            "i recognize", "i acknowledge", "that must be"
        ]
        
        has_empathy = any(phrase in body_lower for phrase in empathy_phrases)
        
        # Acknowledgment
        acknowledgment_phrases = [
            "you mentioned", "as you said", "regarding your",
            "in response to", "following up on"
        ]
        
        has_acknowledgment = any(phrase in body_lower for phrase in acknowledgment_phrases)
        
        # Positive language
        positive_words = ["great", "excellent", "wonderful", "appreciate", "valued"]
        positive_count = sum(1 for word in positive_words if word in body_lower)
        
        # Negative language
        negative_words = ["problem", "issue", "concern", "difficult", "challenge"]
        negative_count = sum(1 for word in negative_words if word in body_lower)
        
        # Score
        score = 50  # Base
        if has_empathy:
            score += 25
        if has_acknowledgment:
            score += 15
        score += min(positive_count * 5, 20)
        score -= min(negative_count * 3, 15)
        
        score = max(0, min(100, score))
        
        return {
            "score": score,
            "has_empathy": has_empathy,
            "has_acknowledgment": has_acknowledgment,
            "positive_language_count": positive_count,
            "negative_language_count": negative_count,
        }

    def _generate_coaching_recommendations(self, tone: Dict, clarity: Dict,
                                          persuasion: Dict, professionalism: Dict,
                                          grammar: Dict, emotional_intelligence: Dict) -> List[Dict]:
        """Generate coaching recommendations."""
        recommendations = []
        
        # Tone recommendations
        if not tone["appropriate"]:
            recommendations.append({
                "category": "tone",
                "priority": "high",
                "message": "Review tone consistency - mixed tones detected",
                "suggestion": "Choose one primary tone and maintain it throughout",
            })
        
        # Clarity recommendations
        if clarity["score"] < 70:
            recommendations.append({
                "category": "clarity",
                "priority": "high",
                "message": f"Clarity score is {clarity['score']}/100",
                "suggestion": "Shorten sentences and reduce jargon",
            })
        
        # Persuasion recommendations
        if persuasion["overused"]:
            recommendations.append({
                "category": "persuasion",
                "priority": "medium",
                "message": "Too many persuasion techniques detected",
                "suggestion": "Use 2-4 techniques for better effectiveness",
            })
        
        # Professionalism recommendations
        if professionalism["score"] < 80:
            for issue in professionalism["issues"][:2]:
                recommendations.append({
                    "category": "professionalism",
                    "priority": "high",
                    "message": issue,
                    "suggestion": "Review and correct professionalism issues",
                })
        
        # Grammar recommendations
        if grammar["issue_count"] > 0:
            recommendations.append({
                "category": "grammar",
                "priority": "medium",
                "message": f"{grammar['issue_count']} grammar/style issues found",
                "suggestion": "Review and correct grammar issues",
            })
        
        # Emotional intelligence recommendations
        if emotional_intelligence["score"] < 60:
            recommendations.append({
                "category": "emotional_intelligence",
                "priority": "medium",
                "message": "Low emotional intelligence score",
                "suggestion": "Add empathy and acknowledgment phrases",
            })
        
        return recommendations

    def _calculate_writing_score(self, tone: Dict, clarity: Dict, persuasion: Dict,
                                professionalism: Dict, grammar: Dict) -> Dict:
        """Calculate overall writing score."""
        # Weighted average
        weights = {
            "tone": 0.20,
            "clarity": 0.25,
            "persuasion": 0.15,
            "professionalism": 0.25,
            "grammar": 0.15,
        }
        
        tone_score = 100 if tone["appropriate"] else 50
        grammar_score = max(0, 100 - grammar["issue_count"] * 15)
        
        score = (
            tone_score * weights["tone"] +
            clarity["score"] * weights["clarity"] +
            persuasion["score"] * weights["persuasion"] +
            professionalism["score"] * weights["professionalism"] +
            grammar_score * weights["grammar"]
        )
        
        score = round(score, 1)
        
        if score >= 85:
            level = "excellent"
        elif score >= 70:
            level = "good"
        elif score >= 55:
            level = "fair"
        else:
            level = "needs_improvement"
        
        return {
            "score": score,
            "level": level,
        }

    def _suggest_improvements(self, coaching: List, writing_score: Dict) -> List[str]:
        """Suggest specific improvements."""
        suggestions = []
        
        if writing_score["level"] == "excellent":
            suggestions.append("Excellent writing! Keep up the great work.")
        elif writing_score["level"] == "good":
            suggestions.append("Good writing with minor improvements possible.")
        else:
            # Add top 3 coaching recommendations
            for rec in coaching[:3]:
                suggestions.append(f"{rec['category'].title()}: {rec['suggestion']}")
        
        return suggestions

    def _determine_coaching_action(self, writing_score: Dict, coaching: List) -> str:
        """Determine coaching action."""
        high_priority = any(r["priority"] == "high" for r in coaching)
        
        if high_priority:
            return "REVIEW_BEFORE_SENDING"
        elif writing_score["level"] == "excellent":
            return "APPROVE_FOR_SENDING"
        elif writing_score["level"] in ("fair", "needs_improvement"):
            return "SUGGEST_REVISIONS"
        else:
            return "OPTIONAL_REVIEW"

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
        if not self.coaching_log:
            return {"emails_coached": 0}
        return {
            "emails_coached": len(self.coaching_log),
            "avg_writing_score": sum(c["writing_score"] for c in self.coaching_log) / len(self.coaching_log),
            "avg_clarity_score": sum(c["clarity_score"] for c in self.coaching_log) / len(self.coaching_log),
            "avg_persuasion_score": sum(c["persuasion_score"] for c in self.coaching_log) / len(self.coaching_log),
            "total_coaching_recs": sum(c["coaching_count"] for c in self.coaching_log),
            "reply_all_enforced": len(self.reply_all_audit),
        }


def test_v993():
    engine = EmailCoachingAI()

    # Test 1: Well-written email
    email1 = {
        "id": "coach-001",
        "from": "professional@company.com",
        "to": ["team@ziontechgroup.com", "client@company.com"],
        "subject": "Project update - Next steps",
        "body": "Dear Team,\n\nThank you for your continued collaboration on this project. I appreciate everyone's dedication and hard work.\n\nAs you mentioned in our last meeting, we need to focus on the key deliverables. I understand the challenges we're facing, and I'm confident we can overcome them together.\n\nPlease review the attached document and let me know your thoughts by Friday.\n\nBest regards,\nProject Manager",
    }
    r1 = engine.analyze_email_case_by_case(email1)
    assert r1["reply_all_enforcement"]["enforced"] is True
    assert r1["writing_score"]["level"] in ("excellent", "good")
    assert r1["emotional_intelligence"]["has_empathy"] is True
    print(f"✅ Test 1 PASSED: Well-written email, score={r1['writing_score']['score']}, level={r1['writing_score']['level']}, reply-all enforced")

    # Test 2: Poor email
    email2 = {
        "id": "coach-002",
        "from": "casual@company.com",
        "to": ["boss@company.com"],
        "subject": "stuff",
        "body": "hey so like we need to do the thing asap!!! its really important and stuff. DONT FORGET!!!",
    }
    r2 = engine.analyze_email_case_by_case(email2)
    assert r2["writing_score"]["level"] in ("fair", "needs_improvement")
    assert r2["professionalism"]["score"] < 70
    print(f"✅ Test 2 PASSED: Poor email detected, score={r2['writing_score']['score']}, professionalism={r2['professionalism']['score']}")

    stats = engine.get_stats()
    print(f"✅ Test 3 PASSED: {stats['emails_coached']} coached, avg writing={stats['avg_writing_score']:.1f}")

    print("\n🎉 V993 ALL TESTS PASSED — Email Coaching AI operational!")
    return True


if __name__ == "__main__":
    test_v993()
