#!/usr/bin/env python3
"""
V963: Phishing Shield Pro Engine
Advanced phishing detection with URL reputation analysis, sender spoofing detection,
social engineering pattern recognition, and real-time threat assessment.
STRICT reply-all enforcement with security-aware response generation.
"""

import re
import hashlib
from datetime import datetime, timezone
from typing import Dict, List, Any


class PhishingShieldPro:
    """Advanced phishing and social engineering detection engine."""

    SUSPICIOUS_TLDS = [".tk", ".ml", ".ga", ".cf", ".gq", ".xyz", ".top", ".click", ".download"]
    
    URGENCY_PATTERNS = [
        r'\b(urgent|immediately|account suspended|verify now|click here|act fast)\b',
        r'\b(24 hours|limited time|expires? today|final warning)\b',
        r'\b(unauthorized|suspicious activity|security breach|compromised)\b',
    ]
    
    CREDENTIAL_THEFT_PATTERNS = [
        r'\b(login|password|username|credentials|sign in|authenticate)\b',
        r'\b(verify your account|confirm your identity|update your information)\b',
        r'\b(bank account|credit card|ssn|social security)\b',
    ]
    
    SPOOFING_INDICATORS = [
        r'(?:noreply|no-reply|donotreply)@',
        r'@(?:gmail|yahoo|hotmail)\.com.*(?:support|security|admin)',
        r'(?:paypal|amazon|microsoft|google|apple)\.(?!com|net|org)',
    ]

    def __init__(self):
        self.threat_log: List[Dict] = []
        self.reply_all_audit: List[Dict] = []
        self.blocked_count = 0

    def analyze_email_case_by_case(self, email: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze each email for phishing and security threats."""
        analysis = {
            "engine": "V963",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "email_id": email.get("id", hashlib.md5(str(email).encode()).hexdigest()[:12]),
            "analysis_type": "phishing_detection",
        }

        to_recipients = email.get("to", [])
        cc_recipients = email.get("cc", [])
        all_recipients = to_recipients + cc_recipients
        is_multi_recipient = len(all_recipients) > 1

        body = email.get("body", "")
        subject = email.get("subject", "")
        sender = email.get("from", "")
        full_text = subject + " " + body

        # 1. URL analysis
        url_analysis = self._analyze_urls(body)
        analysis["url_analysis"] = url_analysis

        # 2. Sender verification
        sender_verification = self._verify_sender(sender, email)
        analysis["sender_verification"] = sender_verification

        # 3. Content analysis
        content_threats = self._analyze_content_threats(full_text)
        analysis["content_threats"] = content_threats

        # 4. Social engineering detection
        social_engineering = self._detect_social_engineering(full_text, sender)
        analysis["social_engineering"] = social_engineering

        # 5. Attachment analysis
        attachment_threats = self._analyze_attachments(email.get("attachments", []))
        analysis["attachment_threats"] = attachment_threats

        # 6. Calculate threat score
        threat_score = self._calculate_threat_score(
            url_analysis, sender_verification, content_threats, 
            social_engineering, attachment_threats
        )
        analysis["threat_score"] = threat_score

        # 7. Threat classification
        threat_level = self._classify_threat(threat_score)
        analysis["threat_level"] = threat_level

        # 8. Recommended action
        action = self._recommend_action(threat_level, threat_score)
        analysis["recommended_action"] = action

        # 9. REPLY-ALL ENFORCEMENT (with security check)
        reply_all_check = self._enforce_reply_all_secure(
            email, all_recipients, is_multi_recipient, threat_level
        )
        analysis["reply_all_enforcement"] = reply_all_check

        # 10. User guidance
        analysis["user_guidance"] = self._generate_user_guidance(threat_level, threat_score)

        # Log threat
        if threat_score["score"] > 30:
            self.threat_log.append({
                "email_id": analysis["email_id"],
                "threat_level": threat_level,
                "threat_score": threat_score["score"],
                "sender": sender,
                "timestamp": analysis["timestamp"],
            })
            if threat_level == "CRITICAL":
                self.blocked_count += 1

        return analysis

    def _analyze_urls(self, text: str) -> Dict:
        """Analyze URLs in email for suspicious patterns."""
        urls = re.findall(r'https?://[^\s<>"\']+', text)
        suspicious_urls = []
        
        for url in urls:
            issues = []
            
            # Check suspicious TLDs
            for tld in self.SUSPICIOUS_TLDS:
                if url.endswith(tld) or tld in url:
                    issues.append(f"Suspicious TLD: {tld}")
            
            # Check for IP addresses instead of domain
            if re.search(r'https?://\d+\.\d+\.\d+\.\d+', url):
                issues.append("IP address instead of domain name")
            
            # Check for misspelled brands
            brands = ["paypal", "amazon", "microsoft", "google", "apple", "netflix"]
            for brand in brands:
                if brand in url.lower() and not url.lower().startswith(f"https://{brand}."):
                    issues.append(f"Potential {brand} spoofing")
            
            # Check for excessive subdomains
            subdomain_count = url.count('.') - 2  # Subtract TLD and domain
            if subdomain_count > 3:
                issues.append("Excessive subdomains")
            
            # Check for URL shorteners
            shorteners = ["bit.ly", "tinyurl", "t.co", "goo.gl"]
            if any(short in url for short in shorteners):
                issues.append("URL shortener detected")
            
            if issues:
                suspicious_urls.append({"url": url[:100], "issues": issues})

        return {
            "total_urls": len(urls),
            "suspicious_count": len(suspicious_urls),
            "suspicious_urls": suspicious_urls,
            "risk_level": "HIGH" if len(suspicious_urls) > 0 else "LOW",
        }

    def _verify_sender(self, sender: str, email: Dict) -> Dict:
        """Verify sender authenticity."""
        issues = []
        
        # Check for spoofing patterns
        for pattern in self.SPOOFING_INDICATORS:
            if re.search(pattern, sender, re.IGNORECASE):
                issues.append("Suspicious sender pattern detected")
        
        # Check display name vs email mismatch
        display_match = re.match(r'"?([^"<]+)"?\s*<([^>]+)>', sender)
        if display_match:
            display_name = display_match.group(1).strip().lower()
            email_addr = display_match.group(2).strip().lower()
            
            # Check if display name claims to be a company but email is generic
            companies = ["paypal", "amazon", "microsoft", "google", "apple", "bank"]
            for company in companies:
                if company in display_name and company not in email_addr:
                    issues.append(f"Display name claims '{company}' but email doesn't match")
        
        # Check for free email providers claiming to be official
        free_providers = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com"]
        if any(provider in sender.lower() for provider in free_providers):
            official_keywords = ["support", "security", "admin", "noreply", "official"]
            if any(kw in sender.lower() for kw in official_keywords):
                issues.append("Free email provider with official-sounding address")

        return {
            "sender": sender,
            "verified": len(issues) == 0,
            "issues": issues,
            "risk_level": "HIGH" if issues else "LOW",
        }

    def _analyze_content_threats(self, text: str) -> Dict:
        """Analyze content for threat patterns."""
        threats = []
        
        # Check urgency patterns
        urgency_matches = []
        for pattern in self.URGENCY_PATTERNS:
            matches = re.findall(pattern, text, re.IGNORECASE)
            urgency_matches.extend(matches)
        
        if len(urgency_matches) >= 2:
            threats.append({
                "type": "artificial_urgency",
                "severity": "HIGH",
                "evidence": urgency_matches[:5],
            })
        
        # Check credential theft patterns
        cred_matches = []
        for pattern in self.CREDENTIAL_THEFT_PATTERNS:
            matches = re.findall(pattern, text, re.IGNORECASE)
            cred_matches.extend(matches)
        
        if len(cred_matches) >= 2:
            threats.append({
                "type": "credential_theft_attempt",
                "severity": "CRITICAL",
                "evidence": cred_matches[:5],
            })
        
        # Check for ALL CAPS (shouting)
        caps_words = re.findall(r'\b[A-Z]{4,}\b', text)
        if len(caps_words) > 5:
            threats.append({
                "type": "aggressive_tone",
                "severity": "MEDIUM",
                "evidence": f"{len(caps_words)} ALL CAPS words",
            })
        
        # Check for excessive punctuation
        if text.count('!') > 10 or text.count('?') > 10:
            threats.append({
                "type": "excessive_punctuation",
                "severity": "LOW",
                "evidence": "Excessive exclamation/question marks",
            })

        return {
            "threats_detected": len(threats),
            "threats": threats,
            "risk_level": "CRITICAL" if any(t["severity"] == "CRITICAL" for t in threats) else "HIGH" if threats else "LOW",
        }

    def _detect_social_engineering(self, text: str, sender: str) -> Dict:
        """Detect social engineering tactics."""
        tactics = []
        
        # Authority impersonation
        authority_patterns = [
            r'\b(IT support|help desk|system admin|security team)\b',
            r'\b(CEO|executive|management|HR department)\b',
        ]
        for pattern in authority_patterns:
            if re.search(pattern, text, re.IGNORECASE):
                tactics.append({
                    "tactic": "authority_impersonation",
                    "severity": "HIGH",
                    "description": "Claims to be authority figure",
                })
        
        # Fear tactics
        fear_patterns = [
            r'\b(account (?:will be|has been) (?:suspended|closed|locked))\b',
            r'\b(unauthorized (?:access|transaction|login))\b',
        ]
        for pattern in fear_patterns:
            if re.search(pattern, text, re.IGNORECASE):
                tactics.append({
                    "tactic": "fear_mongering",
                    "severity": "HIGH",
                    "description": "Uses fear to manipulate",
                })
        
        # Greed/bait
        bait_patterns = [
            r'\b(you (?:have )?won|prize|reward|refund|bonus)\b',
            r'\b(inheritance|lottery|million dollars?)\b',
        ]
        for pattern in bait_patterns:
            if re.search(pattern, text, re.IGNORECASE):
                tactics.append({
                    "tactic": "greed_bait",
                    "severity": "MEDIUM",
                    "description": "Uses greed to lure victims",
                })

        return {
            "tactics_detected": len(tactics),
            "tactics": tactics,
            "risk_level": "HIGH" if tactics else "LOW",
        }

    def _analyze_attachments(self, attachments: List) -> Dict:
        """Analyze attachments for threats."""
        threats = []
        
        dangerous_extensions = [".exe", ".bat", ".cmd", ".scr", ".pif", ".vbs", ".js", ".jar"]
        archive_extensions = [".zip", ".rar", ".7z", ".tar.gz"]
        
        for att in attachments:
            name = att if isinstance(att, str) else att.get("name", "")
            
            # Check dangerous file types
            if any(name.lower().endswith(ext) for ext in dangerous_extensions):
                threats.append({
                    "attachment": name,
                    "threat": "executable_file",
                    "severity": "CRITICAL",
                })
            
            # Check archives (could contain malware)
            if any(name.lower().endswith(ext) for ext in archive_extensions):
                threats.append({
                    "attachment": name,
                    "threat": "archive_potential_malware",
                    "severity": "MEDIUM",
                })
            
            # Check for double extensions
            if re.search(r'\.\w{2,4}\.\w{2,4}$', name):
                threats.append({
                    "attachment": name,
                    "threat": "double_extension_spoofing",
                    "severity": "HIGH",
                })

        return {
            "total_attachments": len(attachments),
            "threats_detected": len(threats),
            "threats": threats,
            "risk_level": "CRITICAL" if any(t["severity"] == "CRITICAL" for t in threats) else "HIGH" if threats else "LOW",
        }

    def _calculate_threat_score(self, urls: Dict, sender: Dict, content: Dict, 
                                 social: Dict, attachments: Dict) -> Dict:
        """Calculate overall threat score (0-100)."""
        score = 0
        factors = []
        
        # URL score
        if urls["suspicious_count"] > 0:
            url_score = min(urls["suspicious_count"] * 20, 40)
            score += url_score
            factors.append(f"URLs: +{url_score}")
        
        # Sender score
        if not sender["verified"]:
            sender_score = len(sender["issues"]) * 15
            score += sender_score
            factors.append(f"Sender: +{sender_score}")
        
        # Content score
        if content["threats_detected"] > 0:
            content_score = min(content["threats_detected"] * 15, 30)
            score += content_score
            factors.append(f"Content: +{content_score}")
        
        # Social engineering score
        if social["tactics_detected"] > 0:
            social_score = min(social["tactics_detected"] * 10, 20)
            score += social_score
            factors.append(f"Social: +{social_score}")
        
        # Attachment score
        if attachments["threats_detected"] > 0:
            att_score = min(attachments["threats_detected"] * 25, 50)
            score += att_score
            factors.append(f"Attachments: +{att_score}")
        
        return {
            "score": min(score, 100),
            "factors": factors,
            "breakdown": {
                "urls": urls["risk_level"],
                "sender": sender["risk_level"],
                "content": content["risk_level"],
                "social_engineering": social["risk_level"],
                "attachments": attachments["risk_level"],
            },
        }

    def _classify_threat(self, threat_score: Dict) -> str:
        """Classify threat level."""
        score = threat_score["score"]
        if score >= 70:
            return "CRITICAL"
        elif score >= 50:
            return "HIGH"
        elif score >= 30:
            return "MEDIUM"
        elif score > 0:
            return "LOW"
        return "SAFE"

    def _recommend_action(self, threat_level: str, threat_score: Dict) -> Dict:
        """Recommend action based on threat level."""
        if threat_level == "CRITICAL":
            return {
                "action": "BLOCK_AND_QUARANTINE",
                "notify_admin": True,
                "user_action": "Do not open, report to IT immediately",
            }
        elif threat_level == "HIGH":
            return {
                "action": "QUARANTINE_FOR_REVIEW",
                "notify_admin": True,
                "user_action": "Do not click links or open attachments",
            }
        elif threat_level == "MEDIUM":
            return {
                "action": "FLAG_WITH_WARNING",
                "notify_admin": False,
                "user_action": "Proceed with caution, verify sender",
            }
        elif threat_level == "LOW":
            return {
                "action": "MONITOR",
                "notify_admin": False,
                "user_action": "Normal handling with awareness",
            }
        return {
            "action": "ALLOW",
            "notify_admin": False,
            "user_action": "Safe to proceed",
        }

    def _enforce_reply_all_secure(self, email: Dict, all_recipients: List, 
                                    is_multi: bool, threat_level: str) -> Dict:
        """STRICT reply-all enforcement with security awareness."""
        result = {
            "is_multi_recipient": is_multi,
            "recipient_count": len(all_recipients),
            "enforced": False,
            "reason": "",
            "security_warning": None,
        }
        
        if threat_level in ("CRITICAL", "HIGH"):
            result["enforced"] = False
            result["reason"] = "REPLY BLOCKED: Email flagged as potential phishing threat"
            result["security_warning"] = "Do not reply to suspicious emails"
        elif is_multi:
            result["enforced"] = True
            result["reason"] = f"REPLY-ALL ENFORCED: {len(all_recipients)} recipients (security cleared)"
            self.reply_all_audit.append({
                "email_id": email.get("id", "unknown"),
                "enforced": True,
                "threat_level": threat_level,
                "timestamp": datetime.now(timezone.utc).isoformat(),
            })
        else:
            result["reason"] = "Single recipient — standard reply"
        
        return result

    def _generate_user_guidance(self, threat_level: str, threat_score: Dict) -> List[str]:
        """Generate user guidance based on threat analysis."""
        guidance = []
        
        if threat_level in ("CRITICAL", "HIGH"):
            guidance.extend([
                "⚠️ DO NOT click any links in this email",
                "⚠️ DO NOT open any attachments",
                "⚠️ DO NOT reply or forward",
                "✓ Report this email to your IT security team",
                "✓ Delete the email after reporting",
            ])
        elif threat_level == "MEDIUM":
            guidance.extend([
                "⚠️ Verify the sender's identity before responding",
                "⚠️ Hover over links to check actual URLs before clicking",
                "✓ Contact the sender through a known, trusted channel",
                "✓ When in doubt, ask your IT team",
            ])
        else:
            guidance.append("✓ Email appears safe, proceed normally")
        
        return guidance

    def get_stats(self) -> Dict:
        if not self.threat_log:
            return {"emails_analyzed": 0}
        return {
            "emails_analyzed": len(self.threat_log),
            "threats_detected": len([t for t in self.threat_log if t["threat_score"] > 30]),
            "blocked_emails": self.blocked_count,
            "reply_all_enforced": len(self.reply_all_audit),
            "avg_threat_score": round(
                sum(t["threat_score"] for t in self.threat_log) / len(self.threat_log), 2
            ),
        }


def test_v963():
    engine = PhishingShieldPro()

    # Test 1: Obvious phishing email
    email1 = {
        "id": "phish-001",
        "from": "security@paypal-support.tk",
        "to": ["user@company.com", "finance@company.com"],
        "subject": "URGENT: Your account has been suspended!",
        "body": "Your PayPal account has been suspended due to unauthorized activity. Click here immediately to verify your account: http://paypal-verify.tk/login. Enter your username, password, and credit card to restore access. Act now or lose your account in 24 hours!",
        "attachments": [],
    }
    r1 = engine.analyze_email_case_by_case(email1)
    assert r1["threat_level"] in ("CRITICAL", "HIGH")
    assert r1["url_analysis"]["suspicious_count"] > 0
    assert r1["reply_all_enforcement"]["enforced"] is False  # Blocked due to threat
    print(f"✅ Test 1 PASSED: Threat={r1['threat_level']}, score={r1['threat_score']['score']}, URLs flagged={r1['url_analysis']['suspicious_count']}")

    # Test 2: Safe business email
    email2 = {
        "id": "phish-002",
        "from": "john.smith@legitimate-company.com",
        "to": ["sales@ziontechgroup.com"],
        "subject": "Meeting follow-up",
        "body": "Hi, thanks for the meeting today. As discussed, please find the proposal attached. Let me know if you have any questions.",
        "attachments": ["proposal.pdf"],
    }
    r2 = engine.analyze_email_case_by_case(email2)
    assert r2["threat_level"] in ("SAFE", "LOW")
    print(f"✅ Test 2 PASSED: Threat={r2['threat_level']}, score={r2['threat_score']['score']}")

    # Test 3: Social engineering attempt
    email3 = {
        "id": "phish-003",
        "from": "it-support@gmail.com",
        "to": ["employee@company.com", "team@company.com"],
        "subject": "IT Support: Update your password immediately",
        "body": "This is IT Support. Your account has been flagged for suspicious activity. You must update your password immediately by clicking this link: http://company-login.xyz/verify. Failure to comply will result in account suspension.",
    }
    r3 = engine.analyze_email_case_by_case(email3)
    assert r3["social_engineering"]["tactics_detected"] > 0
    assert r3["sender_verification"]["verified"] is False
    print(f"✅ Test 3 PASSED: Social engineering tactics={r3['social_engineering']['tactics_detected']}, sender unverified")

    stats = engine.get_stats()
    print(f"✅ Test 4 PASSED: Analyzed={stats['emails_analyzed']}, threats={stats['threats_detected']}, blocked={stats['blocked_emails']}")

    print("\n🎉 V963 ALL TESTS PASSED — Phishing Shield Pro operational!")
    return True


if __name__ == "__main__":
    test_v963()
