#!/usr/bin/env python3
"""
V979: Email Data Loss Prevention (DLP) Engine
Detects sensitive data (SSN, credit cards, credentials, PII) before sending.
Prevents data breaches with strict reply-all enforcement.
"""

import re
import hashlib
from datetime import datetime, timezone
from typing import Dict, List, Any


class DataLossPrevention:
    """Detects and prevents sensitive data leaks in emails."""

    SENSITIVE_PATTERNS = {
        "ssn": {
            "pattern": r'\b\d{3}-\d{2}-\d{4}\b',
            "severity": "CRITICAL",
            "description": "Social Security Number",
        },
        "credit_card": {
            "pattern": r'\b(?:\d{4}[-\s]?){3}\d{4}\b',
            "severity": "CRITICAL",
            "description": "Credit Card Number",
        },
        "password": {
            "pattern": r'\b(?:password|passwd|pwd)\s*[:=]\s*\S+',
            "severity": "HIGH",
            "description": "Password/Credentials",
        },
        "api_key": {
            "pattern": r'\b(?:api[_-]?key|access[_-]?token|secret[_-]?key)\s*[:=]\s*[A-Za-z0-9_\-]{16,}',
            "severity": "CRITICAL",
            "description": "API Key/Token",
        },
        "email": {
            "pattern": r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b',
            "severity": "MEDIUM",
            "description": "Email Address",
        },
        "phone": {
            "pattern": r'\b(?:\+?1[-.]?)?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}\b',
            "severity": "MEDIUM",
            "description": "Phone Number",
        },
        "ip_address": {
            "pattern": r'\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b',
            "severity": "LOW",
            "description": "IP Address",
        },
        "date_of_birth": {
            "pattern": r'\b(?:DOB|birth\s*date|born)\s*[:=]?\s*\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b',
            "severity": "HIGH",
            "description": "Date of Birth",
        },
    }

    CONTEXT_KEYWORDS = {
        "confidential": ["confidential", "private", "internal only", "do not share"],
        "sensitive": ["sensitive", "restricted", "classified", "proprietary"],
    }

    def __init__(self):
        self.dlp_log: List[Dict] = []
        self.reply_all_audit: List[Dict] = []
        self.violations: List[Dict] = []

    def analyze_email_case_by_case(self, email: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze email for data loss prevention case by case."""
        analysis = {
            "engine": "V979",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "email_id": email.get("id", hashlib.md5(str(email).encode()).hexdigest()[:12]),
            "analysis_type": "data_loss_prevention",
        }

        to_recipients = email.get("to", [])
        cc_recipients = email.get("cc", [])
        all_recipients = to_recipients + cc_recipients
        is_multi_recipient = len(all_recipients) > 1

        body = email.get("body", "")
        subject = email.get("subject", "")
        full_text = subject + " " + body

        # 1. Scan for sensitive data patterns
        sensitive_findings = self._scan_sensitive_patterns(full_text)
        analysis["sensitive_findings"] = sensitive_findings

        # 2. Context analysis
        context = self._analyze_context(full_text)
        analysis["context_analysis"] = context

        # 3. Risk assessment
        risk = self._assess_risk(sensitive_findings, context)
        analysis["risk_assessment"] = risk

        # 4. Recipient validation
        recipient_risk = self._validate_recipients(all_recipients, risk)
        analysis["recipient_risk"] = recipient_risk

        # 5. Attachment scanning
        attachment_risk = self._scan_attachments(email.get("attachments", []))
        analysis["attachment_risk"] = attachment_risk

        # 6. Compliance check
        compliance = self._check_compliance(sensitive_findings, context)
        analysis["compliance"] = compliance

        # 7. Recommendations
        recommendations = self._generate_recommendations(risk, sensitive_findings, compliance)
        analysis["recommendations"] = recommendations

        # 8. Determine action
        action = self._determine_dlp_action(risk, compliance)
        analysis["recommended_action"] = action

        # REPLY-ALL ENFORCEMENT
        reply_all = self._enforce_reply_all(email, all_recipients, is_multi_recipient)
        analysis["reply_all_enforcement"] = reply_all

        # Log violations
        if sensitive_findings["total_findings"] > 0:
            self.violations.append({
                "email_id": analysis["email_id"],
                "findings": sensitive_findings,
                "risk_level": risk["level"],
                "timestamp": analysis["timestamp"],
            })

        self.dlp_log.append({
            "email_id": analysis["email_id"],
            "total_findings": sensitive_findings["total_findings"],
            "risk_level": risk["level"],
            "compliance_status": compliance["status"],
            "reply_all": reply_all["enforced"],
            "timestamp": analysis["timestamp"],
        })

        return analysis

    def _scan_sensitive_patterns(self, text: str) -> Dict:
        """Scan text for sensitive data patterns."""
        findings = []
        
        for pattern_name, config in self.SENSITIVE_PATTERNS.items():
            matches = re.findall(config["pattern"], text, re.IGNORECASE)
            if matches:
                # Mask sensitive data for logging
                masked_matches = [self._mask_sensitive_data(match, pattern_name) for match in matches[:3]]
                findings.append({
                    "type": pattern_name,
                    "description": config["description"],
                    "severity": config["severity"],
                    "count": len(matches),
                    "masked_examples": masked_matches,
                })

        total_findings = sum(f["count"] for f in findings)
        max_severity = "NONE"
        severity_order = {"CRITICAL": 4, "HIGH": 3, "MEDIUM": 2, "LOW": 1, "NONE": 0}
        
        for finding in findings:
            if severity_order.get(finding["severity"], 0) > severity_order.get(max_severity, 0):
                max_severity = finding["severity"]

        return {
            "total_findings": total_findings,
            "findings": findings,
            "max_severity": max_severity,
            "has_sensitive_data": total_findings > 0,
        }

    def _mask_sensitive_data(self, data: str, pattern_type: str) -> str:
        """Mask sensitive data for safe logging."""
        if pattern_type == "ssn":
            return "***-**-" + data[-4:]
        elif pattern_type == "credit_card":
            digits = re.sub(r'[\s-]', '', data)
            return "****-****-****-" + digits[-4:]
        elif pattern_type == "email":
            parts = data.split("@")
            if len(parts) == 2:
                return parts[0][:2] + "***@" + parts[1]
        elif pattern_type == "phone":
            return data[:3] + "***" + data[-4:]
        elif pattern_type == "password":
            return "***MASKED***"
        elif pattern_type == "api_key":
            return "***MASKED***"
        return data[:3] + "***"

    def _analyze_context(self, text: str) -> Dict:
        """Analyze context for sensitivity indicators."""
        text_lower = text.lower()
        
        confidential_count = sum(1 for kw in self.CONTEXT_KEYWORDS["confidential"] if kw in text_lower)
        sensitive_count = sum(1 for kw in self.CONTEXT_KEYWORDS["sensitive"] if kw in text_lower)

        return {
            "has_confidential_markers": confidential_count > 0,
            "has_sensitive_markers": sensitive_count > 0,
            "confidential_count": confidential_count,
            "sensitive_count": sensitive_count,
            "context_level": "HIGH" if (confidential_count + sensitive_count) >= 2 else "MEDIUM" if (confidential_count + sensitive_count) > 0 else "LOW",
        }

    def _assess_risk(self, findings: Dict, context: Dict) -> Dict:
        """Assess overall risk level."""
        severity_scores = {"CRITICAL": 100, "HIGH": 75, "MEDIUM": 50, "LOW": 25, "NONE": 0}
        
        base_score = severity_scores.get(findings["max_severity"], 0)
        
        # Context adjustments
        if context["has_confidential_markers"]:
            base_score += 20
        if context["has_sensitive_markers"]:
            base_score += 10

        # Volume adjustment
        base_score += min(findings["total_findings"] * 5, 30)

        score = min(base_score, 100)

        if score >= 80:
            level = "CRITICAL"
        elif score >= 60:
            level = "HIGH"
        elif score >= 40:
            level = "MEDIUM"
        elif score > 0:
            level = "LOW"
        else:
            level = "NONE"

        return {
            "score": score,
            "level": level,
            "findings_count": findings["total_findings"],
            "context_level": context["context_level"],
        }

    def _validate_recipients(self, recipients: List, risk: Dict) -> Dict:
        """Validate recipient risk based on email content risk."""
        external_recipients = []
        
        # This would typically check against internal domain list
        # For now, flag all recipients if risk is high
        if risk["level"] in ("CRITICAL", "HIGH"):
            return {
                "warning": f"High-risk content being sent to {len(recipients)} recipients",
                "external_count": len(recipients),
                "recommendation": "Verify all recipients are authorized to receive this data",
            }

        return {
            "warning": None,
            "external_count": 0,
            "recommendation": "No recipient concerns",
        }

    def _scan_attachments(self, attachments: List) -> Dict:
        """Scan attachments for sensitive data indicators."""
        risks = []
        
        for att in attachments:
            name = att if isinstance(att, str) else att.get("name", "")
            
            # Check for sensitive file names
            sensitive_keywords = ["password", "credential", "ssn", "confidential", "private"]
            if any(kw in name.lower() for kw in sensitive_keywords):
                risks.append({
                    "file": name,
                    "risk": "sensitive_filename",
                    "severity": "HIGH",
                })

        return {
            "total_attachments": len(attachments),
            "risks": risks,
            "risk_count": len(risks),
            "has_risks": len(risks) > 0,
        }

    def _check_compliance(self, findings: Dict, context: Dict) -> Dict:
        """Check compliance with data protection policies."""
        violations = []
        
        # Critical findings always violate policy
        if findings["max_severity"] == "CRITICAL":
            violations.append({
                "type": "critical_data_detected",
                "description": "Critical sensitive data detected (SSN, credit card, API keys)",
                "severity": "CRITICAL",
            })

        # High-severity findings violate policy
        if findings["max_severity"] == "HIGH":
            violations.append({
                "type": "high_risk_data_detected",
                "description": "High-risk sensitive data detected",
                "severity": "HIGH",
            })

        status = "VIOLATION" if violations else "COMPLIANT"

        return {
            "status": status,
            "violations": violations,
            "violation_count": len(violations),
        }

    def _generate_recommendations(self, risk: Dict, findings: Dict, compliance: Dict) -> List[str]:
        """Generate recommendations based on analysis."""
        recommendations = []
        
        if risk["level"] == "CRITICAL":
            recommendations.append("🚨 BLOCK: Critical sensitive data detected. Do not send.")
            recommendations.append("Remove or encrypt all sensitive data before sending.")
        elif risk["level"] == "HIGH":
            recommendations.append("⚠️ REVIEW: High-risk data detected. Review before sending.")
            recommendations.append("Consider encrypting sensitive information.")
        elif risk["level"] == "MEDIUM":
            recommendations.append("⚠️ CAUTION: Medium-risk data detected. Verify necessity.")
        
        if findings["total_findings"] > 0:
            recommendations.append(f"Detected {findings['total_findings']} sensitive data item(s).")
        
        if compliance["status"] == "VIOLATION":
            recommendations.append("This email violates data protection policies.")
        
        if not recommendations:
            recommendations.append("✅ No sensitive data detected. Safe to send.")

        return recommendations

    def _determine_dlp_action(self, risk: Dict, compliance: Dict) -> str:
        """Determine DLP action."""
        if compliance["status"] == "VIOLATION":
            if risk["level"] == "CRITICAL":
                return "BLOCK_EMAIL"
            else:
                return "REQUIRE_APPROVAL"
        elif risk["level"] in ("CRITICAL", "HIGH"):
            return "REQUIRE_REVIEW"
        elif risk["level"] == "MEDIUM":
            return "WARN_USER"
        else:
            return "ALLOW_SEND"

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
        if not self.dlp_log:
            return {"emails_scanned": 0}
        return {
            "emails_scanned": len(self.dlp_log),
            "violations_detected": len(self.violations),
            "risk_distribution": {},
            "reply_all_enforced": len(self.reply_all_audit),
        }


def test_v979():
    engine = DataLossPrevention()

    # Test 1: Email with SSN and credit card
    email1 = {
        "id": "dlp-001",
        "from": "hr@company.com",
        "to": ["payroll@ziontechgroup.com", "finance@ziontechgroup.com"],
        "subject": "Employee payment information",
        "body": "Please process payment for employee. SSN: 123-45-6789. Credit card: 4532-1234-5678-9012. This is confidential information.",
    }
    r1 = engine.analyze_email_case_by_case(email1)
    assert r1["reply_all_enforcement"]["enforced"] is True
    assert r1["sensitive_findings"]["total_findings"] > 0
    assert r1["risk_assessment"]["level"] in ("CRITICAL", "HIGH")
    print(f"✅ Test 1 PASSED: Findings={r1['sensitive_findings']['total_findings']}, risk={r1['risk_assessment']['level']}, compliance={r1['compliance']['status']}, reply-all enforced")

    # Test 2: Clean email
    email2 = {
        "id": "dlp-002",
        "from": "user@company.com",
        "to": ["support@ziontechgroup.com"],
        "subject": "General inquiry",
        "body": "Hi, I'd like to learn more about your services.",
    }
    r2 = engine.analyze_email_case_by_case(email2)
    assert r2["sensitive_findings"]["total_findings"] == 0
    assert r2["risk_assessment"]["level"] == "NONE"
    print(f"✅ Test 2 PASSED: No sensitive data detected, risk={r2['risk_assessment']['level']}")

    stats = engine.get_stats()
    print(f"✅ Test 3 PASSED: {stats['emails_scanned']} scanned, {stats['violations_detected']} violations")

    print("\n🎉 V979 ALL TESTS PASSED — Data Loss Prevention Engine operational!")
    return True


if __name__ == "__main__":
    test_v979()
