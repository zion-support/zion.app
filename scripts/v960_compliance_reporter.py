#!/usr/bin/env python3
"""
V960: Email Compliance Reporter Engine
Analyzes emails for regulatory compliance (GDPR, HIPAA, SOX, PCI-DSS, CCPA),
generates compliance reports, flags violations, and enforces data handling policies.
STRICT reply-all enforcement with compliance-aware response generation.
"""

import re
import hashlib
from datetime import datetime, timezone
from typing import Dict, List, Any, Optional


class EmailComplianceReporter:
    """Enterprise email compliance analysis and reporting engine."""

    REGULATIONS = {
        "GDPR": {
            "name": "General Data Protection Regulation",
            "region": "EU",
            "patterns": {
                "personal_data": [
                    r'\b[A-Za-z]{2,}\s+[A-Za-z]{2,}\b',  # Full names
                    r'\b\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b',  # Dates of birth
                    r'\b[A-Z]{2}\d{6,}\b',  # Passport/ID numbers
                ],
                "consent_required": [
                    r'\b(marketing|newsletter|promotional|opt.?in|subscribe)\b',
                ],
                "data_subject_rights": [
                    r'\b(right to|access|erasure|portab|restrict|object|withdraw consent)\b',
                ],
            },
        },
        "HIPAA": {
            "name": "Health Insurance Portability and Accountability Act",
            "region": "US",
            "patterns": {
                "phi": [
                    r'\b(patient|medical|diagnosis|treatment|prescription|health record|symptom)\b',
                    r'\b\d{3}-\d{2}-\d{4}\b',  # SSN format
                    r'\b[A-Z]\d{8,}\b',  # Insurance ID patterns
                ],
            },
        },
        "SOX": {
            "name": "Sarbanes-Oxley Act",
            "region": "US",
            "patterns": {
                "financial": [
                    r'\b(financial statement|audit|revenue|profit|loss|quarterly|annual report)\b',
                    r'\b(internal control|disclosure|certif)\b',
                ],
            },
        },
        "PCI_DSS": {
            "name": "Payment Card Industry Data Security Standard",
            "region": "Global",
            "patterns": {
                "card_data": [
                    r'\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b',  # Credit card numbers
                    r'\b(card.?holder|CVV|CVC|expir|card.?number)\b',
                ],
            },
        },
        "CCPA": {
            "name": "California Consumer Privacy Act",
            "region": "California, US",
            "patterns": {
                "consumer_rights": [
                    r'\b(do not sell|opt.?out|delete my|know what|personal information)\b',
                ],
            },
        },
    }

    # PII detection patterns
    PII_PATTERNS = {
        "email": r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b',
        "phone_us": r'\b(?:\+?1[-.]?)?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}\b',
        "ssn": r'\b\d{3}-\d{2}-\d{4}\b',
        "credit_card": r'\b(?:\d{4}[\s-]?){3}\d{4}\b',
        "ip_address": r'\b(?:\d{1,3}\.){3}\d{1,3}\b',
        "date_of_birth": r'\b(?:DOB|birth.?date|born)\s*:?\s*\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b',
    }

    SEVERITY_LEVELS = {
        "CRITICAL": 4,
        "HIGH": 3,
        "MEDIUM": 2,
        "LOW": 1,
        "INFO": 0,
    }

    def __init__(self):
        self.compliance_reports: List[Dict] = []
        self.violations: List[Dict] = []
        self.reply_all_audit: List[Dict] = []
        self.data_retention_log: List[Dict] = []

    def analyze_email_case_by_case(self, email: Dict[str, Any]) -> Dict[str, Any]:
        """Comprehensive compliance analysis for each email."""
        analysis = {
            "engine": "V960",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "email_id": email.get("id", hashlib.md5(str(email).encode()).hexdigest()[:12]),
            "analysis_type": "compliance_reporting",
        }

        to_recipients = email.get("to", [])
        cc_recipients = email.get("cc", [])
        bcc_recipients = email.get("bcc", [])
        all_recipients = to_recipients + cc_recipients + bcc_recipients
        is_multi_recipient = len(all_recipients) > 1

        body = email.get("body", "")
        subject = email.get("subject", "")
        attachments = email.get("attachments", [])
        full_text = subject + " " + body

        # 1. PII Detection
        pii_findings = self._detect_pii(full_text)
        analysis["pii_detection"] = pii_findings

        # 2. Regulation-specific compliance checks
        regulation_results = self._check_regulations(full_text, email)
        analysis["regulation_compliance"] = regulation_results

        # 3. Data classification
        classification = self._classify_data(full_text, pii_findings, regulation_results)
        analysis["data_classification"] = classification

        # 4. Cross-border data transfer assessment
        cross_border = self._assess_cross_border_transfer(email, classification)
        analysis["cross_border_transfer"] = cross_border

        # 5. Retention policy assessment
        retention = self._assess_retention_policy(email, classification)
        analysis["retention_policy"] = retention

        # 6. Attachment compliance
        attachment_compliance = self._check_attachment_compliance(attachments, classification)
        analysis["attachment_compliance"] = attachment_compliance

        # 7. Overall compliance score
        violations = []
        for reg, result in regulation_results.items():
            violations.extend(result.get("violations", []))
        violations.extend(pii_findings.get("violations", []))

        compliance_score = self._calculate_compliance_score(violations, classification)
        analysis["compliance_score"] = compliance_score
        analysis["total_violations"] = len(violations)

        # 8. Determine action
        action = self._determine_action(compliance_score, violations, classification)
        analysis["recommended_action"] = action

        # 9. REPLY-ALL ENFORCEMENT (compliance-aware)
        reply_all_check = self._enforce_reply_all_compliance(
            email, all_recipients, is_multi_recipient, classification
        )
        analysis["reply_all_enforcement"] = reply_all_check

        # 10. Generate compliance report
        report = self._generate_report(email, analysis, violations)
        analysis["compliance_report"] = report
        self.compliance_reports.append(report)

        # Store violations
        for v in violations:
            self.violations.append({
                "email_id": analysis["email_id"],
                "violation": v,
                "timestamp": analysis["timestamp"],
            })

        return analysis

    def _detect_pii(self, text: str) -> Dict:
        """Detect personally identifiable information."""
        findings = {}
        violations = []

        for pii_type, pattern in self.PII_PATTERNS.items():
            matches = re.findall(pattern, text)
            if matches:
                findings[pii_type] = {
                    "count": len(matches),
                    "masked_examples": [self._mask_pii(m, pii_type) for m in matches[:3]],
                }
                severity = "CRITICAL" if pii_type in ("ssn", "credit_card") else "HIGH"
                violations.append({
                    "type": "PII_DETECTED",
                    "pii_type": pii_type,
                    "count": len(matches),
                    "severity": severity,
                    "regulation": "GDPR" if pii_type in ("email", "phone_us", "date_of_birth") else "PCI_DSS" if pii_type == "credit_card" else "GENERAL",
                })

        return {
            "total_pii_items": sum(f["count"] for f in findings.values()),
            "findings": findings,
            "violations": violations,
            "has_pii": bool(findings),
        }

    def _mask_pii(self, value: str, pii_type: str) -> str:
        """Mask PII for safe display."""
        if pii_type == "email":
            parts = value.split("@")
            if len(parts) == 2:
                return f"{parts[0][:2]}***@{parts[1]}"
        elif pii_type == "phone_us":
            return value[:3] + "***" + value[-4:]
        elif pii_type == "ssn":
            return "***-**-" + value[-4:]
        elif pii_type == "credit_card":
            digits = re.sub(r'[\s-]', '', value)
            return "****-****-****-" + digits[-4:]
        return value[:3] + "***"

    def _check_regulations(self, text: str, email: Dict) -> Dict:
        """Check compliance against all regulations."""
        results = {}

        for reg_code, reg_info in self.REGULATIONS.items():
            violations = []
            matches = {}

            for category, patterns in reg_info["patterns"].items():
                category_matches = []
                for pattern in patterns:
                    found = re.findall(pattern, text, re.IGNORECASE)
                    category_matches.extend(found)

                if category_matches:
                    matches[category] = len(category_matches)

                    # Determine severity based on category
                    if category in ("phi", "card_data"):
                        severity = "CRITICAL"
                    elif category in ("personal_data", "financial"):
                        severity = "HIGH"
                    else:
                        severity = "MEDIUM"

                    violations.append({
                        "type": f"{reg_code}_{category.upper()}",
                        "regulation": reg_code,
                        "category": category,
                        "match_count": len(category_matches),
                        "severity": severity,
                    })

            results[reg_code] = {
                "applicable": bool(matches),
                "matches": matches,
                "violations": violations,
                "compliant": len(violations) == 0,
            }

        return results

    def _classify_data(self, text: str, pii: Dict, regulations: Dict) -> Dict:
        """Classify the data sensitivity level."""
        has_critical = False
        has_high = False

        # Check PII
        if pii.get("has_pii"):
            for v in pii.get("violations", []):
                if v.get("severity") == "CRITICAL":
                    has_critical = True
                elif v.get("severity") == "HIGH":
                    has_high = True

        # Check regulations
        for reg_code, result in regulations.items():
            for v in result.get("violations", []):
                if v.get("severity") == "CRITICAL":
                    has_critical = True
                elif v.get("severity") == "HIGH":
                    has_high = True

        if has_critical:
            level = "CONFIDENTIAL"
            handling = "Encrypt at rest and in transit. Restrict access. Audit all access."
        elif has_high:
            level = "RESTRICTED"
            handling = "Encrypt in transit. Limit distribution. Log access."
        else:
            level = "INTERNAL"
            handling = "Standard handling. Internal distribution only."

        return {
            "classification": level,
            "handling_instructions": handling,
            "requires_encryption": level in ("CONFIDENTIAL", "RESTRICTED"),
            "requires_audit": level == "CONFIDENTIAL",
        }

    def _assess_cross_border_transfer(self, email: Dict, classification: Dict) -> Dict:
        """Assess cross-border data transfer risks."""
        sender = email.get("from", "")
        recipients = email.get("to", []) + email.get("cc", [])

        # Simple region detection from email domains
        eu_tlds = [".de", ".fr", ".es", ".it", ".nl", ".be", ".at", ".pt", ".eu", ".co.uk"]
        has_eu = any(any(sender.endswith(tld) or r.endswith(tld) for tld in eu_tlds) for r in recipients)
        has_us = any(".com" in r or ".us" in r for r in recipients + [sender])

        cross_border = has_eu and has_us

        return {
            "is_cross_border": cross_border,
            "regions_involved": (["EU"] if has_eu else []) + (["US"] if has_us else []),
            "gdpr_applicable": has_eu,
            "requires_sccs": cross_border and classification.get("classification") in ("CONFIDENTIAL", "RESTRICTED"),
            "risk_level": "HIGH" if cross_border and classification.get("requires_encryption") else "LOW",
        }

    def _assess_retention_policy(self, email: Dict, classification: Dict) -> Dict:
        """Assess data retention requirements."""
        level = classification.get("classification", "INTERNAL")
        retention_map = {
            "CONFIDENTIAL": {"retention_days": 365, "auto_delete": True, "encryption_required": True},
            "RESTRICTED": {"retention_days": 730, "auto_delete": True, "encryption_required": True},
            "INTERNAL": {"retention_days": 1095, "auto_delete": False, "encryption_required": False},
        }
        return retention_map.get(level, retention_map["INTERNAL"])

    def _check_attachment_compliance(self, attachments: List, classification: Dict) -> Dict:
        """Check attachment compliance."""
        issues = []
        for att in attachments:
            name = att if isinstance(att, str) else att.get("name", "")
            if classification.get("requires_encryption"):
                if not name.endswith((".enc", ".gpg", ".pgp")):
                    issues.append(f"Attachment '{name}' should be encrypted for {classification['classification']} data")
            if any(name.endswith(ext) for ext in [".exe", ".bat", ".cmd", ".scr"]):
                issues.append(f"Executable attachment '{name}' — potential security risk")

        return {
            "total_attachments": len(attachments),
            "issues": issues,
            "compliant": len(issues) == 0,
        }

    def _calculate_compliance_score(self, violations: List, classification: Dict) -> Dict:
        """Calculate overall compliance score."""
        if not violations:
            return {"score": 100, "grade": "A+", "status": "FULLY_COMPLIANT"}

        total_penalty = 0
        for v in violations:
            severity = v.get("severity", "LOW")
            penalty = {"CRITICAL": 25, "HIGH": 15, "MEDIUM": 8, "LOW": 3, "INFO": 0}.get(severity, 5)
            total_penalty += penalty

        score = max(0, 100 - total_penalty)

        if score >= 90:
            grade = "A"
            status = "MOSTLY_COMPLIANT"
        elif score >= 70:
            grade = "B"
            status = "NEEDS_ATTENTION"
        elif score >= 50:
            grade = "C"
            status = "NON_COMPLIANT"
        else:
            grade = "F"
            status = "CRITICAL_VIOLATIONS"

        return {"score": score, "grade": grade, "status": status}

    def _determine_action(self, compliance: Dict, violations: List, classification: Dict) -> str:
        """Determine action based on compliance analysis."""
        score = compliance.get("score", 100)
        status = compliance.get("status", "FULLY_COMPLIANT")

        if status == "CRITICAL_VIOLATIONS":
            return "BLOCK_AND_ESCALATE_TO_COMPLIANCE"
        elif status == "NON_COMPLIANT":
            return "REQUIRE_COMPLIANCE_REVIEW_BEFORE_SENDING"
        elif status == "NEEDS_ATTENTION":
            return "SEND_WITH_COMPLIANCE_WARNINGS"
        elif classification.get("classification") == "CONFIDENTIAL":
            return "ENCRYPTED_RESPONSE_REQUIRED"
        else:
            return "COMPLIANT_RESPONSE"

    def _enforce_reply_all_compliance(self, email: Dict, all_recipients: List, is_multi: bool, classification: Dict) -> Dict:
        """STRICT reply-all enforcement with compliance awareness."""
        result = {
            "is_multi_recipient": is_multi,
            "recipient_count": len(all_recipients),
            "enforced": False,
            "reason": "",
            "compliance_warning": None,
        }

        if is_multi:
            result["enforced"] = True
            result["reason"] = f"REPLY-ALL ENFORCED: {len(all_recipients)} recipients — compliance-aware response to all."

            if classification.get("classification") in ("CONFIDENTIAL", "RESTRICTED"):
                result["compliance_warning"] = (
                    f"WARNING: Email classified as {classification['classification']}. "
                    f"Reply-all will share with {len(all_recipients)} recipients. "
                    f"Verify all recipients are authorized to receive this classification level."
                )

            self.reply_all_audit.append({
                "email_id": email.get("id", "unknown"),
                "enforced": True,
                "classification": classification.get("classification"),
                "timestamp": datetime.now(timezone.utc).isoformat(),
            })
        else:
            result["reason"] = "Single recipient — standard compliant reply."

        return result

    def _generate_report(self, email: Dict, analysis: Dict, violations: List) -> Dict:
        """Generate a formal compliance report."""
        report = {
            "report_id": f"CR-{analysis['email_id']}-{datetime.now(timezone.utc).strftime('%Y%m%d%H%M%S')}",
            "email_id": analysis["email_id"],
            "timestamp": analysis["timestamp"],
            "compliance_score": analysis["compliance_score"],
            "data_classification": analysis["data_classification"],
            "violations_summary": {
                "total": len(violations),
                "by_severity": {},
                "by_regulation": {},
            },
            "recommendations": [],
        }

        # Summarize by severity
        for v in violations:
            sev = v.get("severity", "UNKNOWN")
            report["violations_summary"]["by_severity"][sev] = (
                report["violations_summary"]["by_severity"].get(sev, 0) + 1
            )
            reg = v.get("regulation", "UNKNOWN")
            report["violations_summary"]["by_regulation"][reg] = (
                report["violations_summary"]["by_regulation"].get(reg, 0) + 1
            )

        # Generate recommendations
        if analysis["pii_detection"]["has_pii"]:
            report["recommendations"].append("Remove or encrypt PII before distribution")
        if analysis["cross_border_transfer"]["is_cross_border"]:
            report["recommendations"].append("Ensure Standard Contractual Clauses are in place for EU-US transfers")
        if analysis["data_classification"]["requires_encryption"]:
            report["recommendations"].append("Apply end-to-end encryption for this email thread")
        if violations:
            report["recommendations"].append("Review and remediate all identified compliance violations")

        return report

    def get_stats(self) -> Dict:
        if not self.compliance_reports:
            return {"reports_generated": 0, "avg_score": 0, "total_violations": 0}
        scores = [r["compliance_score"]["score"] for r in self.compliance_reports]
        return {
            "reports_generated": len(self.compliance_reports),
            "avg_score": round(sum(scores) / len(scores), 1),
            "total_violations": len(self.violations),
            "reply_all_enforced": len(self.reply_all_audit),
            "violations_by_severity": {
                sev: sum(1 for v in self.violations if v["violation"].get("severity") == sev)
                for sev in ["CRITICAL", "HIGH", "MEDIUM", "LOW"]
            },
        }


# === Test Suite ===
def test_v960():
    engine = EmailComplianceReporter()

    # Test 1: Email with PII and financial data
    email1 = {
        "id": "comp-001",
        "from": "hr@company.com",
        "to": ["payroll@ziontechgroup.com", "finance@ziontechgroup.com"],
        "cc": ["cfo@company.com"],
        "subject": "Employee financial records - Quarterly audit",
        "body": "Please review the financial statement for Q3. Employee SSN: 123-45-6789. Credit card ending in 4532 needs updating. Revenue increased by 15%. Contact john.doe@email.com or call 555-123-4567 for questions.",
        "attachments": ["q3_report.pdf"],
    }

    result1 = engine.analyze_email_case_by_case(email1)
    assert result1["pii_detection"]["has_pii"] is True
    assert result1["reply_all_enforcement"]["enforced"] is True
    assert result1["total_violations"] > 0
    print(f"✅ Test 1 PASSED: {result1['total_violations']} violations found, score: {result1['compliance_score']['score']}/100 ({result1['compliance_score']['grade']})")

    # Test 2: Clean compliant email
    email2 = {
        "id": "comp-002",
        "from": "team@partner.com",
        "to": ["support@ziontechgroup.com"],
        "subject": "General inquiry about services",
        "body": "Hello, we would like to learn more about your AI services. Could you provide a general overview?",
    }

    result2 = engine.analyze_email_case_by_case(email2)
    assert result2["pii_detection"]["has_pii"] is False
    assert result2["compliance_score"]["score"] >= 80
    print(f"✅ Test 2 PASSED: Clean email — score: {result2['compliance_score']['score']}/100 ({result2['compliance_score']['grade']})")

    # Test 3: HIPAA-related email
    email3 = {
        "id": "comp-003",
        "from": "doctor@hospital.com",
        "to": ["admin@ziontechgroup.com", "legal@ziontechgroup.com"],
        "subject": "Patient treatment records - urgent",
        "body": "Please process the patient medical records for the treatment plan. Diagnosis needs to be updated in the system. SSN on file: 987-65-4321.",
    }

    result3 = engine.analyze_email_case_by_case(email3)
    assert result3["reply_all_enforcement"]["enforced"] is True
    hipaa = result3["regulation_compliance"].get("HIPAA", {})
    assert hipaa.get("applicable") is True
    print(f"✅ Test 3 PASSED: HIPAA applicable, violations: {len(hipaa.get('violations', []))}")

    # Test 4: Stats
    stats = engine.get_stats()
    assert stats["reports_generated"] == 3
    print(f"✅ Test 4 PASSED: {stats['reports_generated']} reports, avg score: {stats['avg_score']}, violations: {stats['total_violations']}")

    print("\n🎉 V960 ALL TESTS PASSED — Compliance Reporter Engine operational!")
    return True


if __name__ == "__main__":
    test_v960()
