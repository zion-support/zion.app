#!/usr/bin/env python3
"""
V958: Email Accessibility Optimizer Engine
Analyzes emails for accessibility compliance (WCAG), readability, inclusive language,
screen-reader compatibility, and generates accessible response templates.
STRICT reply-all enforcement for all multi-recipient responses.
"""

import re
import hashlib
from datetime import datetime, timezone
from typing import Dict, List, Any


class EmailAccessibilityOptimizer:
    """Optimizes email accessibility and inclusive communication."""

    WCAG_CRITERIA = {
        "text_contrast": "1.4.3",
        "alt_text": "1.1.1",
        "heading_structure": "1.3.1",
        "link_text": "2.4.4",
        "language_identification": "3.1.1",
    }

    INCLUSIVE_TERMS = {
        "avoid": {
            "guys": "everyone/team/folks",
            "blacklist": "blocklist/denylist",
            "whitelist": "allowlist",
            "master": "primary/main",
            "slave": "secondary/replica",
            "sanity check": "confidence check/validation",
            "dummy": "placeholder/sample",
            "crazy": "unexpected/unusual",
            "insane": "remarkable/extraordinary",
            "blind spot": "oversight/gap",
            "grandfathered": "legacy/exempted",
        },
    }

    def __init__(self):
        self.audit_log: List[Dict] = []
        self.reply_all_audit: List[Dict] = []
        self.accessibility_scores: Dict[str, float] = {}

    def analyze_email_case_by_case(self, email: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze each email for accessibility and determine appropriate action."""
        analysis = {
            "engine": "V958",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "email_id": email.get("id", hashlib.md5(str(email).encode()).hexdigest()[:12]),
            "analysis_type": "accessibility_optimization",
        }

        to_recipients = email.get("to", [])
        cc_recipients = email.get("cc", [])
        all_recipients = to_recipients + cc_recipients
        is_multi_recipient = len(all_recipients) > 1

        body = email.get("body", "")
        subject = email.get("subject", "")

        # 1. Readability analysis
        readability = self._analyze_readability(body)
        analysis["readability"] = readability

        # 2. Inclusive language check
        inclusive = self._check_inclusive_language(body + " " + subject)
        analysis["inclusive_language"] = inclusive

        # 3. Structure analysis
        structure = self._analyze_structure(body, email)
        analysis["structure"] = structure

        # 4. Link accessibility
        links = self._check_link_accessibility(body)
        analysis["link_accessibility"] = links

        # 5. Attachment accessibility
        attachments = self._check_attachment_accessibility(email.get("attachments", []))
        analysis["attachment_accessibility"] = attachments

        # 6. Overall accessibility score
        scores = [
            readability.get("score", 50),
            inclusive.get("score", 100),
            structure.get("score", 50),
            links.get("score", 100),
        ]
        overall_score = round(sum(scores) / len(scores), 1)
        analysis["overall_accessibility_score"] = overall_score
        self.accessibility_scores[analysis["email_id"]] = overall_score

        # 7. Recommendations
        analysis["recommendations"] = self._generate_recommendations(
            readability, inclusive, structure, links, attachments
        )

        # 8. Determine action
        action = self._determine_action(overall_score, email)
        analysis["recommended_action"] = action

        # 9. REPLY-ALL ENFORCEMENT
        reply_all_check = self._enforce_reply_all(email, all_recipients, is_multi_recipient)
        analysis["reply_all_enforcement"] = reply_all_check

        # 10. Generate accessible response template
        analysis["accessible_template"] = self._generate_accessible_template(email, analysis)

        self.audit_log.append({
            "email_id": analysis["email_id"],
            "score": overall_score,
            "action": action,
            "reply_all": reply_all_check["enforced"],
            "timestamp": analysis["timestamp"],
        })

        return analysis

    def _analyze_readability(self, text: str) -> Dict:
        """Analyze text readability using Flesch-Kincaid approximation."""
        if not text.strip():
            return {"score": 100, "grade_level": 0, "reading_time_seconds": 0, "level": "N/A"}

        sentences = [s.strip() for s in re.split(r'[.!?]+', text) if s.strip()]
        words = text.split()
        syllables = sum(self._count_syllables(w) for w in words)

        word_count = max(len(words), 1)
        sentence_count = max(len(sentences), 1)

        # Flesch Reading Ease
        avg_sentence_length = word_count / sentence_count
        avg_syllables_per_word = syllables / word_count
        flesch = 206.835 - (1.015 * avg_sentence_length) - (84.6 * avg_syllables_per_word)
        flesch = max(0, min(100, flesch))

        # Grade level approximation
        grade_level = max(1, round(0.39 * avg_sentence_length + 11.8 * avg_syllables_per_word - 15.59))

        reading_time = round(word_count / 3.5)  # ~210 words/min = 3.5 words/sec

        level = "excellent" if flesch >= 70 else "good" if flesch >= 50 else "difficult" if flesch >= 30 else "very_difficult"

        return {
            "score": round(flesch, 1),
            "grade_level": grade_level,
            "reading_time_seconds": reading_time,
            "word_count": word_count,
            "sentence_count": sentence_count,
            "level": level,
            "recommendation": "Consider shorter sentences for better accessibility" if flesch < 50 else "Good readability",
        }

    def _count_syllables(self, word: str) -> int:
        """Approximate syllable count for a word."""
        word = word.lower().strip(".,!?;:'\"()[]{}")
        if len(word) <= 2:
            return 1
        vowels = "aeiouy"
        count = 0
        prev_vowel = False
        for char in word:
            is_vowel = char in vowels
            if is_vowel and not prev_vowel:
                count += 1
            prev_vowel = is_vowel
        if word.endswith("e"):
            count -= 1
        return max(1, count)

    def _check_inclusive_language(self, text: str) -> Dict:
        """Check for non-inclusive language and suggest alternatives."""
        text_lower = text.lower()
        issues = []

        for term, alternative in self.INCLUSIVE_TERMS["avoid"].items():
            if term in text_lower:
                issues.append({
                    "term": term,
                    "suggestion": alternative,
                    "severity": "medium",
                })

        score = max(0, 100 - (len(issues) * 15))
        return {
            "score": score,
            "issues_found": len(issues),
            "issues": issues,
            "is_inclusive": len(issues) == 0,
        }

    def _analyze_structure(self, body: str, email: Dict) -> Dict:
        """Analyze email structure for accessibility."""
        issues = []

        # Check for proper greeting
        has_greeting = bool(re.search(r'^(hi|hello|dear|hey|greetings)\b', body.strip().lower()))
        if not has_greeting:
            issues.append("Missing greeting — helps screen readers identify email start")

        # Check for signature
        has_signature = bool(re.search(r'(regards|thanks|best|sincerely|cheers)', body.lower()))
        if not has_signature:
            issues.append("Missing sign-off — provides clear email ending")

        # Check paragraph length
        paragraphs = [p for p in body.split('\n\n') if p.strip()]
        long_paragraphs = sum(1 for p in paragraphs if len(p.split()) > 75)
        if long_paragraphs > 0:
            issues.append(f"{long_paragraphs} long paragraph(s) — consider breaking up for readability")

        # Check for ALL CAPS (shouting)
        caps_words = re.findall(r'\b[A-Z]{4,}\b', body)
        caps_words = [w for w in caps_words if w not in ("HTTP", "HTTPS", "API", "URL", "HTML", "CSS", "XML", "JSON", "SMTP", "IMAP")]
        if caps_words:
            issues.append(f"ALL CAPS words detected: {caps_words[:3]} — can be confusing for screen readers")

        # Check for alt text in images
        has_images = bool(re.search(r'<img|!\[', body))
        has_alt = bool(re.search(r'alt=|!\[.+?\]', body))
        if has_images and not has_alt:
            issues.append("Images without alt text — critical accessibility issue")

        score = max(0, 100 - (len(issues) * 20))
        return {
            "score": score,
            "issues": issues,
            "has_greeting": has_greeting,
            "has_signature": has_signature,
            "paragraph_count": len(paragraphs),
        }

    def _check_link_accessibility(self, body: str) -> Dict:
        """Check if links have descriptive text."""
        links = re.findall(r'https?://[^\s<>\"]+', body)
        issues = []

        for link in links:
            # Check for bare URLs (not descriptive)
            if link in body and not re.search(rf'\[.+?\]\({re.escape(link)}\)', body):
                issues.append(f"Bare URL: {link[:50]}... — use descriptive link text")

        score = max(0, 100 - (len(issues) * 25)) if links else 100
        return {
            "score": score,
            "total_links": len(links),
            "issues": issues,
        }

    def _check_attachment_accessibility(self, attachments: List) -> Dict:
        """Check attachment accessibility."""
        issues = []
        for att in attachments:
            name = att if isinstance(att, str) else att.get("name", "")
            if name.endswith((".pdf", ".docx", ".pptx")):
                issues.append(f"{name} — ensure document has proper headings and alt text for images")
            elif name.endswith((".png", ".jpg", ".jpeg", ".gif")):
                issues.append(f"{name} — image attachments should include text description")

        return {
            "total_attachments": len(attachments),
            "issues": issues,
            "score": max(0, 100 - (len(issues) * 20)) if attachments else 100,
        }

    def _generate_recommendations(self, readability, inclusive, structure, links, attachments) -> List[Dict]:
        """Generate prioritized accessibility recommendations."""
        recommendations = []

        if readability.get("score", 100) < 50:
            recommendations.append({
                "priority": "HIGH",
                "category": "readability",
                "text": f"Readability score is {readability['score']}. Use shorter sentences and simpler words.",
            })

        if not inclusive.get("is_inclusive", True):
            for issue in inclusive.get("issues", []):
                recommendations.append({
                    "priority": "MEDIUM",
                    "category": "inclusive_language",
                    "text": f"Replace '{issue['term']}' with '{issue['suggestion']}'",
                })

        for issue in structure.get("issues", []):
            recommendations.append({
                "priority": "MEDIUM",
                "category": "structure",
                "text": issue,
            })

        return recommendations

    def _determine_action(self, score: float, email: Dict) -> str:
        """Determine action based on accessibility score."""
        body = email.get("body", "").lower()

        if score < 30:
            return "MAJOR_ACCESSIBILITY_REWRITE"
        elif score < 60:
            return "ACCESSIBILITY_IMPROVEMENTS_NEEDED"
        elif "urgent" in email.get("subject", "").lower():
            return "URGENT_WITH_ACCESSIBLE_FORMATTING"
        else:
            return "ACCESSIBLE_RESPONSE"

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
            result["reason"] = f"REPLY-ALL ENFORCED: {len(all_recipients)} recipients — accessible response to all."
            self.reply_all_audit.append({
                "email_id": email.get("id", "unknown"),
                "enforced": True,
                "timestamp": datetime.now(timezone.utc).isoformat(),
            })
        else:
            result["reason"] = "Single recipient — standard accessible reply."
        return result

    def _generate_accessible_template(self, email: Dict, analysis: Dict) -> Dict:
        """Generate an accessible response template."""
        all_recipients = email.get("to", []) + email.get("cc", [])
        return {
            "to": all_recipients,
            "reply_all": len(all_recipients) > 1,
            "template": {
                "greeting": "Hello [Name],",
                "body_style": "short_paragraphs",
                "max_sentence_length": 20,
                "include_alt_text": True,
                "use_descriptive_links": True,
                "sign_off": "Best regards,",
                "accessibility_score_target": 80,
            },
        }

    def get_stats(self) -> Dict:
        if not self.audit_log:
            return {"emails_analyzed": 0, "avg_score": 0, "reply_all_enforced": 0}
        return {
            "emails_analyzed": len(self.audit_log),
            "avg_score": round(sum(a["score"] for a in self.audit_log) / len(self.audit_log), 1),
            "reply_all_enforced": len(self.reply_all_audit),
        }


# === Test Suite ===
def test_v958():
    engine = EmailAccessibilityOptimizer()

    # Test 1: Multi-recipient email with accessibility issues
    email1 = {
        "id": "a11y-001",
        "from": "manager@corp.com",
        "to": ["team@ziontechgroup.com", "lead@ziontechgroup.com"],
        "cc": ["director@corp.com"],
        "subject": "URGENT: Review the master document ASAP",
        "body": "Hey guys, please do a sanity check on the attached document. The deadline is INSANE. Check https://example.com/doc123 for reference. The blacklist needs updating.",
        "attachments": ["report.pdf", "screenshot.png"],
    }

    result1 = engine.analyze_email_case_by_case(email1)
    assert result1["reply_all_enforcement"]["enforced"] is True
    assert result1["inclusive_language"]["issues_found"] > 0
    print(f"✅ Test 1 PASSED: {result1['inclusive_language']['issues_found']} inclusive language issues found, reply-all enforced")

    # Test 2: Clean accessible email
    email2 = {
        "id": "a11y-002",
        "from": "alice@example.com",
        "to": ["support@ziontechgroup.com"],
        "subject": "Question about accessibility features",
        "body": "Hello,\n\nI would like to learn about your accessibility features.\n\nThank you,\nAlice",
    }

    result2 = engine.analyze_email_case_by_case(email2)
    assert result2["reply_all_enforcement"]["enforced"] is False
    assert result2["overall_accessibility_score"] > 60
    print(f"✅ Test 2 PASSED: Score {result2['overall_accessibility_score']}/100 — good accessibility")

    # Test 3: Stats
    stats = engine.get_stats()
    assert stats["emails_analyzed"] == 2
    print(f"✅ Test 3 PASSED: {stats['emails_analyzed']} analyzed, avg score: {stats['avg_score']}")

    print("\n🎉 V958 ALL TESTS PASSED — Accessibility Optimizer Engine operational!")
    return True


if __name__ == "__main__":
    test_v958()
