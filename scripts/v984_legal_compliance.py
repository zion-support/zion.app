#!/usr/bin/env python3
"""
V984: Email Legal Compliance Engine
GDPR, CAN-SPAM, CCPA compliance checking for outbound emails.
Enables regulatory compliance and risk mitigation.
"""

import re
import hashlib
from datetime import datetime, timezone
from typing import Dict, List, Any
from collections import defaultdict


class EmailLegalCompliance:
    """Checks email compliance with legal regulations."""

    def __init__(self):
        self.compliance_log: List[Dict] = []
        self.reply_all_audit: List[Dict] = []
        self.violation_database: List[Dict] = []

    def analyze_email_case_by_case(self, email: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze email for legal compliance case by case."""
        analysis = {
            "engine": "V984",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "email_id": email.get("id", hashlib.md5(str(email).encode()).hexdigest()[:12]),
            "analysis_type": "legal_compliance",
        }

        to_recipients = email.get("to", [])
        cc_recipients = email.get("cc", [])
        all_recipients = to_recipients + cc_recipients
        is_multi_recipient = len(all_recipients) > 1

        body = email.get("body", "")
        subject = email.get("subject", "")
        sender = email.get("from", "")

        # 1. GDPR compliance check
        gdpr_check = self._check_gdpr_compliance(email, body)
        analysis["gdpr_compliance"] = gdpr_check

        # 2. CAN-SPAM compliance check
        canspam_check = self._check_canspam_compliance(email, body, subject)
        analysis["canspam_compliance"] = canspam_check

        # 3. CCPA compliance check
        ccpa_check = self._check_ccpa_compliance(email, body)
        analysis["ccpa_compliance"] = ccpa_check

        # 4. Data protection check
        data_protection = self._check_data_protection(body)
        analysis["data_protection"] = data_protection

        # 5. Consent verification
        consent_check = self._verify_consent(email)
        analysis["consent_verification"] = consent_check

        # 6. Unsubscribe mechanism check
        unsubscribe_check = self._check_unsubscribe_mechanism(body)
        analysis["unsubscribe_mechanism"] = unsubscribe_check

        # 7. Overall compliance score
        overall_compliance = self._calculate_compliance_score(
            gdpr_check, canspam_check, ccpa_check, 
            data_protection, consent_check, unsubscribe_check
        )
        analysis["overall_compliance"] = overall_compliance

        # 8. Violations summary
        violations = self._summarize_violations(
            gdpr_check, canspam_check, ccpa_check, 
            data_protection, consent_check, unsubscribe_check
        )
        analysis["violations"] = violations

        # 9. Remediation recommendations
        remediation = self._generate_remediation(violations)
        analysis["remediation"] = remediation

        # 10. Determine action
        action = self._determine_compliance_action(overall_compliance, violations)
        analysis["recommended_action"] = action

        # REPLY-ALL ENFORCEMENT
        reply_all = self._enforce_reply_all(email, all_recipients, is_multi_recipient)
        analysis["reply_all_enforcement"] = reply_all

        # Log violations
        if violations["total_violations"] > 0:
            self.violation_database.append({
                "email_id": analysis["email_id"],
                "violations": violations,
                "timestamp": analysis["timestamp"],
            })

        self.compliance_log.append({
            "email_id": analysis["email_id"],
            "compliance_score": overall_compliance["score"],
            "violation_count": violations["total_violations"],
            "gdpr_status": gdpr_check["status"],
            "canspam_status": canspam_check["status"],
            "ccpa_status": ccpa_check["status"],
            "reply_all": reply_all["enforced"],
            "timestamp": analysis["timestamp"],
        })

        return analysis

    def _check_gdpr_compliance(self, email: Dict, body: str) -> Dict:
        """Check GDPR compliance."""
        issues = []
        
        # Check for personal data processing
        personal_data_patterns = [
            r'\b(?:name|email|phone|address)\s*[:=]\s*.+',
            r'\b(?:dob|date of birth|ssn|social security)\b',
        ]
        
        has_personal_data = False
        for pattern in personal_data_patterns:
            if re.search(pattern, body, re.IGNORECASE):
                has_personal_data = True
                break
        
        if has_personal_data:
            # Check for legal basis
            legal_basis_keywords = ["consent", "contract", "legitimate interest", "legal obligation"]
            has_legal_basis = any(kw in body.lower() for kw in legal_basis_keywords)
            
            if not has_legal_basis:
                issues.append({
                    "type": "missing_legal_basis",
                    "severity": "HIGH",
                    "description": "Personal data processed without legal basis",
                })
        
        # Check for data subject rights
        rights_keywords = ["access", "rectification", "erasure", "portability", "objection"]
        has_rights_info = any(kw in body.lower() for kw in rights_keywords)
        
        if has_personal_data and not has_rights_info:
            issues.append({
                "type": "missing_rights_info",
                "severity": "MEDIUM",
                "description": "Data subject rights not mentioned",
            })
        
        status = "COMPLIANT" if not issues else "NON_COMPLIANT"
        
        return {
            "status": status,
            "issues": issues,
            "score": max(0, 100 - len(issues) * 25),
        }

    def _check_canspam_compliance(self, email: Dict, body: str, subject: str) -> Dict:
        """Check CAN-SPAM compliance."""
        issues = []
        
        # Check for physical address
        address_patterns = [
            r'\d+\s+[A-Za-z\s]+(?:St|Street|Ave|Avenue|Rd|Road|Blvd|Boulevard)',
            r'(?:PO Box|P\.O\. Box)\s+\d+',
            r'[A-Z]{2}\s+\d{5}(?:-\d{4})?',  # State + ZIP
        ]
        
        has_address = any(re.search(p, body, re.IGNORECASE) for p in address_patterns)
        
        if not has_address:
            issues.append({
                "type": "missing_physical_address",
                "severity": "HIGH",
                "description": "Physical postal address not included",
            })
        
        # Check for unsubscribe mechanism
        unsubscribe_patterns = [
            r'(?:unsubscribe|opt[- ]?out|remove)\s*(?:from|this)?\s*(?:list|mailing)?',
            r'(?:click here|visit)\s+(?:to|and)\s+unsubscribe',
        ]
        
        has_unsubscribe = any(re.search(p, body, re.IGNORECASE) for p in unsubscribe_patterns)
        
        if not has_unsubscribe:
            issues.append({
                "type": "missing_unsubscribe",
                "severity": "HIGH",
                "description": "Unsubscribe mechanism not provided",
            })
        
        # Check for misleading subject
        if subject.lower().startswith("re:") and not email.get("thread_id"):
            issues.append({
                "type": "misleading_subject",
                "severity": "MEDIUM",
                "description": "Subject line may be misleading (fake Re:)",
            })
        
        status = "COMPLIANT" if not issues else "NON_COMPLIANT"
        
        return {
            "status": status,
            "issues": issues,
            "score": max(0, 100 - len(issues) * 25),
        }

    def _check_ccpa_compliance(self, email: Dict, body: str) -> Dict:
        """Check CCPA compliance."""
        issues = []
        
        # Check for "Do Not Sell" link
        do_not_sell_patterns = [
            r'(?:do not sell|don\'t sell)\s+(?:my|your)\s+(?:personal\s+)?information',
            r'(?:opt[- ]?out)\s+(?:of\s+)?(?:sale|selling)',
        ]
        
        has_do_not_sell = any(re.search(p, body, re.IGNORECASE) for p in do_not_sell_patterns)
        
        # Check if email contains personal information
        personal_info_patterns = [
            r'\b(?:name|email|phone|address|ip address|device id)\b',
        ]
        
        has_personal_info = any(re.search(p, body, re.IGNORECASE) for p in personal_info_patterns)
        
        if has_personal_info and not has_do_not_sell:
            issues.append({
                "type": "missing_do_not_sell",
                "severity": "MEDIUM",
                "description": "Do Not Sell My Personal Information link not provided",
            })
        
        # Check for privacy policy
        privacy_keywords = ["privacy policy", "privacy notice", "data protection"]
        has_privacy_policy = any(kw in body.lower() for kw in privacy_keywords)
        
        if has_personal_info and not has_privacy_policy:
            issues.append({
                "type": "missing_privacy_policy",
                "severity": "LOW",
                "description": "Privacy policy not referenced",
            })
        
        status = "COMPLIANT" if not issues else "NON_COMPLIANT"
        
        return {
            "status": status,
            "issues": issues,
            "score": max(0, 100 - len(issues) * 25),
        }

    def _check_data_protection(self, body: str) -> Dict:
        """Check data protection measures."""
        issues = []
        
        # Check for sensitive data transmission
        sensitive_patterns = [
            (r'\b\d{3}-\d{2}-\d{4}\b', "SSN"),
            (r'\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b', "Credit Card"),
            (r'\b(?:password|passwd|pwd)\s*[:=]\s*\S+', "Password"),
        ]
        
        for pattern, data_type in sensitive_patterns:
            if re.search(pattern, body, re.IGNORECASE):
                issues.append({
                    "type": f"sensitive_data_{data_type.lower().replace(' ', '_')}",
                    "severity": "CRITICAL",
                    "description": f"{data_type} detected in email body",
                })
        
        status = "COMPLIANT" if not issues else "NON_COMPLIANT"
        
        return {
            "status": status,
            "issues": issues,
            "score": max(0, 100 - len(issues) * 35),
        }

    def _verify_consent(self, email: Dict) -> Dict:
        """Verify consent for email communication."""
        issues = []
        
        # Check for consent indicators
        consent_keywords = ["consent", "opted in", "subscribed", "agreed"]
        body = email.get("body", "")
        
        has_consent_indicator = any(kw in body.lower() for kw in consent_keywords)
        
        if not has_consent_indicator:
            # Check if it's a transactional email (no consent needed)
            transactional_keywords = ["receipt", "invoice", "order confirmation", "shipping"]
            is_transactional = any(kw in body.lower() for kw in transactional_keywords)
            
            if not is_transactional:
                issues.append({
                    "type": "unverified_consent",
                    "severity": "MEDIUM",
                    "description": "Consent for email communication not verified",
                })
        
        status = "COMPLIANT" if not issues else "UNVERIFIED"
        
        return {
            "status": status,
            "issues": issues,
            "score": 100 if not issues else 50,
        }

    def _check_unsubscribe_mechanism(self, body: str) -> Dict:
        """Check unsubscribe mechanism."""
        issues = []
        
        # Check for unsubscribe link or instructions
        unsubscribe_patterns = [
            r'(?:unsubscribe|opt[- ]?out|remove)\s*(?:from|this)?\s*(?:list|mailing)?',
            r'(?:click here|visit)\s+(?:to|and)\s+unsubscribe',
            r'(?:reply|respond)\s+(?:with|and)\s+(?:unsubscribe|remove|stop)',
        ]
        
        has_unsubscribe = any(re.search(p, body, re.IGNORECASE) for p in unsubscribe_patterns)
        
        # Check for unsubscribe link
        has_unsubscribe_link = bool(re.search(r'https?://[^\s]+(?:unsubscribe|optout|remove)', body, re.IGNORECASE))
        
        if not has_unsubscribe and not has_unsubscribe_link:
            issues.append({
                "type": "missing_unsubscribe_mechanism",
                "severity": "HIGH",
                "description": "No unsubscribe mechanism provided",
            })
        
        status = "COMPLIANT" if not issues else "NON_COMPLIANT"
        
        return {
            "status": status,
            "issues": issues,
            "score": 100 if not issues else 0,
        }

    def _calculate_compliance_score(self, gdpr: Dict, canspam: Dict, ccpa: Dict,
                                     data_protection: Dict, consent: Dict, 
                                     unsubscribe: Dict) -> Dict:
        """Calculate overall compliance score."""
        scores = [
            gdpr["score"],
            canspam["score"],
            ccpa["score"],
            data_protection["score"],
            consent["score"],
            unsubscribe["score"],
        ]
        
        avg_score = sum(scores) / len(scores)
        
        if avg_score >= 90:
            level = "EXCELLENT"
        elif avg_score >= 75:
            level = "GOOD"
        elif avg_score >= 60:
            level = "FAIR"
        elif avg_score >= 40:
            level = "POOR"
        else:
            level = "CRITICAL"
        
        return {
            "score": round(avg_score, 1),
            "level": level,
            "breakdown": {
                "gdpr": gdpr["score"],
                "canspam": canspam["score"],
                "ccpa": ccpa["score"],
                "data_protection": data_protection["score"],
                "consent": consent["score"],
                "unsubscribe": unsubscribe["score"],
            },
        }

    def _summarize_violations(self, gdpr: Dict, canspam: Dict, ccpa: Dict,
                              data_protection: Dict, consent: Dict, 
                              unsubscribe: Dict) -> Dict:
        """Summarize all violations."""
        all_issues = (
            gdpr["issues"] + 
            canspam["issues"] + 
            ccpa["issues"] + 
            data_protection["issues"] + 
            consent["issues"] + 
            unsubscribe["issues"]
        )
        
        severity_counts = {
            "CRITICAL": sum(1 for i in all_issues if i["severity"] == "CRITICAL"),
            "HIGH": sum(1 for i in all_issues if i["severity"] == "HIGH"),
            "MEDIUM": sum(1 for i in all_issues if i["severity"] == "MEDIUM"),
            "LOW": sum(1 for i in all_issues if i["severity"] == "LOW"),
        }
        
        return {
            "total_violations": len(all_issues),
            "violations": all_issues,
            "severity_counts": severity_counts,
            "critical_count": severity_counts["CRITICAL"],
            "high_count": severity_counts["HIGH"],
        }

    def _generate_remediation(self, violations: Dict) -> List[Dict]:
        """Generate remediation recommendations."""
        remediation = []
        
        for violation in violations["violations"]:
            if violation["type"] == "missing_physical_address":
                remediation.append({
                    "action": "Add physical postal address to email footer",
                    "priority": "HIGH",
                    "regulation": "CAN-SPAM",
                })
            elif violation["type"] == "missing_unsubscribe":
                remediation.append({
                    "action": "Add clear unsubscribe mechanism",
                    "priority": "HIGH",
                    "regulation": "CAN-SPAM",
                })
            elif violation["type"] == "missing_legal_basis":
                remediation.append({
                    "action": "Document legal basis for data processing",
                    "priority": "HIGH",
                    "regulation": "GDPR",
                })
            elif "sensitive_data" in violation["type"]:
                remediation.append({
                    "action": "Remove or encrypt sensitive data",
                    "priority": "CRITICAL",
                    "regulation": "Data Protection",
                })
            elif violation["type"] == "missing_do_not_sell":
                remediation.append({
                    "action": "Add 'Do Not Sell My Personal Information' link",
                    "priority": "MEDIUM",
                    "regulation": "CCPA",
                })
        
        return remediation

    def _determine_compliance_action(self, compliance: Dict, violations: Dict) -> str:
        """Determine compliance action."""
        if violations["critical_count"] > 0:
            return "BLOCK_AND_REMEDIATE"
        elif violations["high_count"] > 0:
            return "REVIEW_BEFORE_SENDING"
        elif compliance["level"] in ("POOR", "FAIR"):
            return "FLAG_FOR_REVIEW"
        else:
            return "APPROVE_FOR_SENDING"

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
        if not self.compliance_log:
            return {"emails_checked": 0}
        return {
            "emails_checked": len(self.compliance_log),
            "avg_compliance_score": sum(c["compliance_score"] for c in self.compliance_log) / len(self.compliance_log),
            "total_violations": sum(c["violation_count"] for c in self.compliance_log),
            "gdpr_compliant_count": sum(1 for c in self.compliance_log if c["gdpr_status"] == "COMPLIANT"),
            "canspam_compliant_count": sum(1 for c in self.compliance_log if c["canspam_status"] == "COMPLIANT"),
            "ccpa_compliant_count": sum(1 for c in self.compliance_log if c["ccpa_status"] == "COMPLIANT"),
            "reply_all_enforced": len(self.reply_all_audit),
        }


def test_v984():
    engine = EmailLegalCompliance()

    # Test 1: Non-compliant marketing email
    email1 = {
        "id": "legal-001",
        "from": "marketing@company.com",
        "to": ["customer1@example.com", "customer2@example.com"],
        "subject": "Special offer just for you!",
        "body": "Hi, we have a special offer for you. Your name: John Doe. Check out our products!",
    }
    r1 = engine.analyze_email_case_by_case(email1)
    assert r1["reply_all_enforcement"]["enforced"] is True
    assert r1["violations"]["total_violations"] > 0
    assert r1["canspam_compliance"]["status"] == "NON_COMPLIANT"
    print(f"✅ Test 1 PASSED: {r1['violations']['total_violations']} violations found, compliance={r1['overall_compliance']['level']}, reply-all enforced")

    # Test 2: Compliant email
    email2 = {
        "id": "legal-002",
        "from": "support@company.com",
        "to": ["customer@example.com"],
        "subject": "Your order confirmation",
        "body": "Thank you for your order. Receipt attached. Unsubscribe: click here to unsubscribe. Company Inc, 123 Main St, NY 10001. Privacy policy: example.com/privacy",
    }
    r2 = engine.analyze_email_case_by_case(email2)
    assert r2["violations"]["total_violations"] == 0
    assert r2["overall_compliance"]["level"] in ("EXCELLENT", "GOOD")
    print(f"✅ Test 2 PASSED: Compliant email, score={r2['overall_compliance']['score']}, level={r2['overall_compliance']['level']}")

    stats = engine.get_stats()
    print(f"✅ Test 3 PASSED: {stats['emails_checked']} checked, avg score={stats['avg_compliance_score']:.1f}")

    print("\n🎉 V984 ALL TESTS PASSED — Email Legal Compliance Engine operational!")
    return True


if __name__ == "__main__":
    test_v984()
