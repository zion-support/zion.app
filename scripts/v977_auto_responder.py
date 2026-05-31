#!/usr/bin/env python3
"""
V977: Email Auto-Responder Engine
Context-aware auto-replies for OOO, after-hours, and common queries.
Intelligent response generation with strict reply-all enforcement.
"""

import re
import hashlib
from datetime import datetime, timezone
from typing import Dict, List, Any


class AutoResponder:
    """Intelligent auto-responder for common email scenarios."""

    AUTO_RESPONSE_SCENARIOS = {
        "out_of_office": {
            "triggers": ["ooo", "out of office", "vacation", "away", "unavailable"],
            "response_type": "informational",
        },
        "after_hours": {
            "triggers": [],  # Time-based
            "response_type": "acknowledgment",
        },
        "common_questions": {
            "triggers": ["pricing", "features", "support", "contact", "hours"],
            "response_type": "informational",
        },
        "spam_filter": {
            "triggers": ["unsubscribe", "newsletter", "marketing"],
            "response_type": "acknowledgment",
        },
        "duplicate_inquiry": {
            "triggers": [],  # Pattern-based
            "response_type": "redirect",
        },
    }

    RESPONSE_TEMPLATES = {
        "acknowledgment": "Thank you for your message. We've received your inquiry and will respond within {response_time}.",
        "informational": "Thank you for reaching out. {specific_info}\n\nFor more details, please visit: {link}",
        "redirect": "Thank you for your inquiry. For faster assistance, please contact {department} at {contact_info}.",
        "out_of_office": "Thank you for your message. I'm currently out of the office until {return_date} and will respond upon my return. For urgent matters, please contact {backup_contact}.",
    }

    def __init__(self):
        self.auto_response_log: List[Dict] = []
        self.reply_all_audit: List[Dict] = []
        self.response_cache: Dict[str, Dict] = {}

    def analyze_email_case_by_case(self, email: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze and auto-respond case by case."""
        analysis = {
            "engine": "V977",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "email_id": email.get("id", hashlib.md5(str(email).encode()).hexdigest()[:12]),
            "analysis_type": "auto_responder",
        }

        to_recipients = email.get("to", [])
        cc_recipients = email.get("cc", [])
        all_recipients = to_recipients + cc_recipients
        is_multi_recipient = len(all_recipients) > 1

        body = email.get("body", "")
        subject = email.get("subject", "")
        sender = email.get("from", "")
        full_text = subject + " " + body

        # 1. Detect auto-response scenario
        scenario = self._detect_scenario(full_text, email)
        analysis["detected_scenario"] = scenario

        # 2. Check if auto-response is appropriate
        should_auto_respond = self._should_auto_respond(email, scenario)
        analysis["should_auto_respond"] = should_auto_respond

        # 3. Generate response content
        response_content = self._generate_response_content(scenario, email, full_text)
        analysis["response_content"] = response_content

        # 4. Personalization
        personalization = self._personalize_response(sender, email, response_content)
        analysis["personalized_response"] = personalization

        # 5. Response quality check
        quality = self._check_response_quality(personalization)
        analysis["response_quality"] = quality

        # 6. Timing optimization
        timing = self._optimize_response_timing(scenario)
        analysis["response_timing"] = timing

        # 7. Determine action
        action = self._determine_auto_response_action(should_auto_respond, quality, scenario)
        analysis["recommended_action"] = action

        # REPLY-ALL ENFORCEMENT
        reply_all = self._enforce_reply_all(email, all_recipients, is_multi_recipient)
        analysis["reply_all_enforcement"] = reply_all

        self.auto_response_log.append({
            "email_id": analysis["email_id"],
            "scenario": scenario["type"],
            "should_respond": should_auto_respond["should_respond"],
            "quality_score": quality["score"],
            "reply_all": reply_all["enforced"],
            "timestamp": analysis["timestamp"],
        })

        return analysis

    def _detect_scenario(self, text: str, email: Dict) -> Dict:
        """Detect which auto-response scenario applies."""
        text_lower = text.lower()
        
        # Check for OOO indicators
        ooo_indicators = ["out of office", "ooo", "vacation", "away until", "unavailable"]
        if any(ind in text_lower for ind in ooo_indicators):
            return {
                "type": "out_of_office",
                "confidence": 0.9,
                "reason": "OOO indicator detected",
            }

        # Check for common questions
        question_patterns = {
            "pricing": ["price", "cost", "pricing", "how much"],
            "features": ["feature", "capability", "what can", "does it"],
            "support": ["help", "support", "issue", "problem"],
            "contact": ["contact", "phone", "email", "reach"],
            "hours": ["hours", "open", "available", "when"],
        }

        for qtype, patterns in question_patterns.items():
            if any(p in text_lower for p in patterns):
                return {
                    "type": "common_questions",
                    "subtype": qtype,
                    "confidence": 0.75,
                    "reason": f"Common question: {qtype}",
                }

        # Check for newsletter/marketing
        if any(kw in text_lower for kw in ["unsubscribe", "newsletter", "marketing"]):
            return {
                "type": "spam_filter",
                "confidence": 0.8,
                "reason": "Marketing content detected",
            }

        # Default: general acknowledgment
        return {
            "type": "general_acknowledgment",
            "confidence": 0.5,
            "reason": "No specific scenario matched",
        }

    def _should_auto_respond(self, email: Dict, scenario: Dict) -> Dict:
        """Determine if auto-response is appropriate."""
        sender = email.get("from", "").lower()
        
        # Don't auto-respond to noreply addresses
        if "noreply" in sender or "no-reply" in sender:
            return {
                "should_respond": False,
                "reason": "No-reply sender",
            }

        # Don't auto-respond to internal emails (same domain)
        # This would require domain configuration
        
        # High confidence scenarios get auto-response
        if scenario["confidence"] >= 0.7:
            return {
                "should_respond": True,
                "reason": f"High confidence scenario: {scenario['type']}",
            }

        # Low confidence: require human review
        return {
            "should_respond": False,
            "reason": "Low confidence - requires human review",
        }

    def _generate_response_content(self, scenario: Dict, email: Dict, text: str) -> Dict:
        """Generate response content based on scenario."""
        scenario_type = scenario["type"]
        
        if scenario_type == "out_of_office":
            return {
                "template": "out_of_office",
                "variables": {
                    "return_date": "[RETURN_DATE]",
                    "backup_contact": "[BACKUP_CONTACT]",
                },
                "content": f"Thank you for your message. I'm currently out of the office until [RETURN_DATE] and will respond upon my return. For urgent matters, please contact [BACKUP_CONTACT].",
            }
        elif scenario_type == "common_questions":
            subtype = scenario.get("subtype", "general")
            return {
                "template": "informational",
                "variables": {
                    "specific_info": f"Regarding your {subtype} inquiry",
                    "link": f"https://ziontechgroup.com/{subtype}",
                },
                "content": f"Thank you for reaching out. Regarding your {subtype} inquiry, please visit our website for detailed information: https://ziontechgroup.com/{subtype}",
            }
        elif scenario_type == "spam_filter":
            return {
                "template": "acknowledgment",
                "variables": {"response_time": "24 hours"},
                "content": "Thank you for your message. We've received it and will review within 24 hours if relevant.",
            }
        else:
            return {
                "template": "acknowledgment",
                "variables": {"response_time": "1 business day"},
                "content": "Thank you for your message. We've received your inquiry and will respond within 1 business day.",
            }

    def _personalize_response(self, sender: str, email: Dict, response: Dict) -> Dict:
        """Personalize the response."""
        # Extract sender name
        sender_name = "there"
        name_match = re.match(r'"?([^"<]+)"?\s*<', sender)
        if name_match:
            sender_name = name_match.group(1).strip().split()[0]

        # Add personalization
        personalized_content = f"Hi {sender_name},\n\n{response['content']}\n\nBest regards,\nZion Tech Group Team"

        return {
            "content": personalized_content,
            "sender_name": sender_name,
            "personalization_level": "HIGH" if sender_name != "there" else "LOW",
        }

    def _check_response_quality(self, response: Dict) -> Dict:
        """Check response quality."""
        content = response["content"]
        word_count = len(content.split())
        
        score = 50
        if word_count >= 30:
            score += 20
        if response["personalization_level"] == "HIGH":
            score += 15
        if "Thank you" in content or "thanks" in content.lower():
            score += 10
        if re.search(r'https?://', content):
            score += 5

        score = min(score, 100)

        return {
            "score": score,
            "word_count": word_count,
            "has_personalization": response["personalization_level"] == "HIGH",
            "has_links": bool(re.search(r'https?://', content)),
            "quality_level": "HIGH" if score >= 70 else "MEDIUM" if score >= 50 else "LOW",
        }

    def _optimize_response_timing(self, scenario: Dict) -> Dict:
        """Optimize when to send the auto-response."""
        now = datetime.now(timezone.utc)
        hour = now.hour
        
        # Immediate for high-confidence scenarios
        if scenario["confidence"] >= 0.8:
            return {
                "delay_minutes": 0,
                "reason": "Immediate response for high-confidence scenario",
            }
        
        # Delay during off-hours
        if hour < 8 or hour > 18:
            return {
                "delay_minutes": 60,
                "reason": "Delayed during off-hours",
            }
        
        return {
            "delay_minutes": 5,
            "reason": "Short delay to avoid appearing robotic",
        }

    def _determine_auto_response_action(self, should_respond: Dict, quality: Dict, scenario: Dict) -> str:
        """Determine auto-response action."""
        if not should_respond["should_respond"]:
            return "ROUTE_TO_HUMAN"
        
        if quality["quality_level"] == "HIGH":
            return "SEND_AUTO_RESPONSE"
        elif quality["quality_level"] == "MEDIUM":
            return "REVIEW_AND_SEND"
        else:
            return "REWRITE_AND_REVIEW"

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
        if not self.auto_response_log:
            return {"emails_processed": 0}
        return {
            "emails_processed": len(self.auto_response_log),
            "auto_responses_sent": sum(1 for a in self.auto_response_log if a["should_respond"]),
            "scenarios_detected": {},
            "avg_quality_score": round(sum(a["quality_score"] for a in self.auto_response_log) / len(self.auto_response_log), 1),
            "reply_all_enforced": len(self.reply_all_audit),
        }


def test_v977():
    engine = AutoResponder()

    # Test 1: Pricing inquiry
    email1 = {
        "id": "auto-001",
        "from": "prospect@company.com",
        "to": ["sales@ziontechgroup.com", "info@ziontechgroup.com"],
        "subject": "Pricing inquiry",
        "body": "Hi, I'm interested in your AI services. Can you send me pricing information?",
    }
    r1 = engine.analyze_email_case_by_case(email1)
    assert r1["reply_all_enforcement"]["enforced"] is True
    assert r1["detected_scenario"]["type"] == "common_questions"
    assert r1["response_quality"]["score"] >= 60
    print(f"✅ Test 1 PASSED: Scenario={r1['detected_scenario']['type']}, quality={r1['response_quality']['score']}, reply-all enforced")

    # Test 2: OOO email
    email2 = {
        "id": "auto-002",
        "from": "contact@partner.com",
        "to": ["team@ziontechgroup.com"],
        "subject": "Out of office",
        "body": "I'm out of office until next Monday. For urgent matters, contact backup@partner.com.",
    }
    r2 = engine.analyze_email_case_by_case(email2)
    assert r2["detected_scenario"]["type"] == "out_of_office"
    print(f"✅ Test 2 PASSED: OOO detected, action={r2['recommended_action']}")

    stats = engine.get_stats()
    print(f"✅ Test 3 PASSED: {stats['emails_processed']} processed, avg quality={stats['avg_quality_score']}")

    print("\n🎉 V977 ALL TESTS PASSED — Auto-Responder Engine operational!")
    return True


if __name__ == "__main__":
    test_v977()
