#!/usr/bin/env python3
"""V554 - Email Security Sentinel
Advanced phishing detection with behavioral analysis and zero-trust verification.
CRITICAL: Always enforces reply-all for multi-recipient emails.
"""
import json
import re
from datetime import datetime
from typing import Dict, List

class EmailSecuritySentinel:
    def __init__(self):
        self.reply_all_enforced = True
        self.phishing_patterns = [
            r'urgent.*action.*required',
            r'verify.*account',
            r'suspended.*account',
            r'unusual.*activity',
            r'click.*here.*immediately',
            r'confirm.*identity',
            r'update.*payment.*information'
        ]
    
    def security_scan(self, email: Dict) -> Dict:
        """Comprehensive security scan of email"""
        scan = {
            "engine": "V554_Email_Security_Sentinel",
            "timestamp": datetime.now().isoformat(),
            "threat_level": self._assess_threat_level(email),
            "phishing_indicators": self._detect_phishing(email),
            "suspicious_elements": self._detect_suspicious_elements(email),
            "sender_verification": self._verify_sender(email),
            "zero_trust_checks": self._perform_zero_trust_checks(email),
            "recommendations": [],
            "reply_all_enforced": self.reply_all_enforced,
            "all_recipients": email.get("to", []) + email.get("cc", [])
        }
        
        scan["recommendations"] = self._generate_security_recommendations(scan)
        return scan
    
    def _assess_threat_level(self, email: Dict) -> str:
        """Assess overall threat level"""
        phishing_score = len(self._detect_phishing(email))
        suspicious_score = len(self._detect_suspicious_elements(email))
        sender_score = 0 if self._verify_sender(email)["verified"] else 2
        
        total_score = phishing_score + suspicious_score + sender_score
        
        if total_score >= 5:
            return "critical"
        elif total_score >= 3:
            return "high"
        elif total_score >= 1:
            return "medium"
        return "low"
    
    def _detect_phishing(self, email: Dict) -> List[Dict]:
        """Detect phishing indicators"""
        indicators = []
        body = email.get("body", "").lower()
        subject = email.get("subject", "").lower()
        full_text = f"{subject} {body}"
        
        # Check phishing patterns
        for pattern in self.phishing_patterns:
            if re.search(pattern, full_text, re.IGNORECASE):
                indicators.append({
                    "type": "phishing_pattern",
                    "pattern": pattern,
                    "severity": "high"
                })
        
        # Urgency tactics
        urgency_words = ["immediately", "urgent", "asap", "right now", "within 24 hours", "account will be closed"]
        for word in urgency_words:
            if word in full_text:
                indicators.append({
                    "type": "urgency_tactic",
                    "word": word,
                    "severity": "medium"
                })
        
        # Threat language
        threat_words = ["suspended", "terminated", "locked", "unauthorized", "breach"]
        for word in threat_words:
            if word in full_text:
                indicators.append({
                    "type": "threat_language",
                    "word": word,
                    "severity": "high"
                })
        
        return indicators
    
    def _detect_suspicious_elements(self, email: Dict) -> List[Dict]:
        """Detect suspicious elements in email"""
        suspicious = []
        body = email.get("body", "")
        
        # Suspicious URLs
        url_pattern = r'https?://[^\s<>"{}|\\^`\[\]]+'
        urls = re.findall(url_pattern, body)
        for url in urls:
            if self._is_suspicious_url(url):
                suspicious.append({
                    "type": "suspicious_url",
                    "url": url,
                    "severity": "critical"
                })
        
        # Suspicious attachments
        attachments = email.get("attachments", [])
        for att in attachments:
            if self._is_suspicious_attachment(att):
                suspicious.append({
                    "type": "suspicious_attachment",
                    "filename": att.get("filename"),
                    "severity": "high"
                })
        
        # Spoofing indicators
        if self._detect_spoofing(email):
            suspicious.append({
                "type": "spoofing_indicator",
                "severity": "critical"
            })
        
        return suspicious
    
    def _is_suspicious_url(self, url: str) -> bool:
        """Check if URL is suspicious"""
        suspicious_patterns = [
            r'bit\.ly',
            r'tinyurl',
            r'[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+',  # IP addresses
            r'[a-z0-9]{20,}\.',  # Long random strings
            r'@.*@'  # Multiple @ symbols
        ]
        
        for pattern in suspicious_patterns:
            if re.search(pattern, url, re.IGNORECASE):
                return True
        
        return False
    
    def _is_suspicious_attachment(self, attachment: Dict) -> bool:
        """Check if attachment is suspicious"""
        filename = attachment.get("filename", "").lower()
        
        suspicious_extensions = [".exe", ".bat", ".cmd", ".scr", ".pif", ".vbs", ".js", ".jar"]
        if any(filename.endswith(ext) for ext in suspicious_extensions):
            return True
        
        # Double extensions
        if filename.count('.') > 1:
            return True
        
        return False
    
    def _detect_spoofing(self, email: Dict) -> bool:
        """Detect email spoofing"""
        from_addr = email.get("from", "")
        reply_to = email.get("reply_to", "")
        
        # Check if reply-to differs from from
        if reply_to and reply_to != from_addr:
            return True
        
        # Check for lookalike domains
        if self._is_lookalike_domain(from_addr):
            return True
        
        return False
    
    def _is_lookalike_domain(self, email: str) -> bool:
        """Check for lookalike domains"""
        # Simple check for common lookalike patterns
        domain = email.split('@')[-1] if '@' in email else ""
        
        lookalike_patterns = [
            "paypa1", "g00gle", "amaz0n", "micros0ft",
            "faceb00k", "app1e", "netf1ix"
        ]
        
        return any(pattern in domain.lower() for pattern in lookalike_patterns)
    
    def _verify_sender(self, email: Dict) -> Dict:
        """Verify sender authenticity"""
        from_addr = email.get("from", "")
        
        verification = {
            "verified": False,
            "domain_match": False,
            "known_sender": False,
            "reputation": "unknown"
        }
        
        # Check if domain matches known patterns
        if "@ziontechgroup.com" in from_addr:
            verification["domain_match"] = True
            verification["known_sender"] = True
            verification["verified"] = True
            verification["reputation"] = "trusted"
        elif any(domain in from_addr for domain in ["@gmail.com", "@yahoo.com", "@outlook.com"]):
            verification["reputation"] = "personal"
        
        return verification
    
    def _perform_zero_trust_checks(self, email: Dict) -> Dict:
        """Perform zero-trust verification checks"""
        checks = {
            "sender_authenticated": False,
            "content_verified": False,
            "links_safe": False,
            "attachments_safe": False,
            "behavior_normal": False
        }
        
        # Sender authentication
        sender_check = self._verify_sender(email)
        checks["sender_authenticated"] = sender_check["verified"]
        
        # Content verification
        checks["content_verified"] = len(self._detect_phishing(email)) == 0
        
        # Link safety
        urls = re.findall(r'https?://[^\s<>"{}|\\^`\[\]]+', email.get("body", ""))
        checks["links_safe"] = all(not self._is_suspicious_url(url) for url in urls)
        
        # Attachment safety
        attachments = email.get("attachments", [])
        checks["attachments_safe"] = all(not self._is_suspicious_attachment(att) for att in attachments)
        
        # Behavioral analysis
        checks["behavior_normal"] = self._is_behavior_normal(email)
        
        return checks
    
    def _is_behavior_normal(self, email: Dict) -> bool:
        """Check if email behavior is normal"""
        body = email.get("body", "").lower()
        
        # Abnormal patterns
        abnormal_patterns = [
            "send gift card",
            "wire transfer",
            "bitcoin",
            "cryptocurrency",
            "western union"
        ]
        
        return not any(pattern in body for pattern in abnormal_patterns)
    
    def _generate_security_recommendations(self, scan: Dict) -> List[Dict]:
        """Generate security recommendations"""
        recommendations = []
        
        if scan["threat_level"] == "critical":
            recommendations.append({
                "type": "block",
                "message": "CRITICAL: Block this email immediately - high threat level detected",
                "priority": "critical"
            })
            recommendations.append({
                "type": "report",
                "message": "Report to security team for investigation",
                "priority": "critical"
            })
        elif scan["threat_level"] == "high":
            recommendations.append({
                "type": "quarantine",
                "message": "Quarantine email for manual review",
                "priority": "high"
            })
        
        if scan["phishing_indicators"]:
            recommendations.append({
                "type": "educate",
                "message": "Educate user about phishing tactics detected",
                "priority": "medium"
            })
        
        if scan["suspicious_elements"]:
            recommendations.append({
                "type": "verify",
                "message": "Verify sender through alternate channel before taking action",
                "priority": "high"
            })
        
        if not scan["zero_trust_checks"]["sender_authenticated"]:
            recommendations.append({
                "type": "authenticate",
                "message": "Sender not authenticated - treat with caution",
                "priority": "high"
            })
        
        return recommendations

if __name__ == "__main__":
    engine = EmailSecuritySentinel()
    test = {
        "from": "security@bank-secure.com",
        "to": ["user@company.com"],
        "subject": "URGENT: Verify your account immediately",
        "body": "Your account has been suspended due to unusual activity. Click here to verify: http://bit.ly/verify-now",
        "attachments": []
    }
    result = engine.security_scan(test)
    print(json.dumps(result, indent=2))
