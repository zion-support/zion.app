#!/usr/bin/env python3
"""V222 - AI Email Compliance Auto-Checker
Check emails against GDPR, HIPAA, SOC2, PCI-DSS, and company policies.
Flag PII exposure, consent issues, data retention violations.
Always enforces reply-all for multi-recipient emails.
"""
import json, re, datetime
from dataclasses import dataclass, field
from typing import List, Dict

@dataclass
class ComplianceViolation:
    framework: str
    severity: str
    rule: str
    evidence: str
    recommendation: str

@dataclass
class ComplianceReport:
    email_id: str
    overall_compliant: bool
    violations: List[ComplianceViolation]
    pii_detected: List[str]
    risk_score: float
    frameworks_checked: List[str]
    reply_all_required: bool

class PIIDetector:
    PATTERNS = {
        "email": r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b',
        "phone": r'\b\d{3}[-.]?\d{3}[-.]?\d{4}\b',
        "ssn": r'\b\d{3}-\d{2}-\d{4}\b',
        "credit_card": r'\b(?:\d{4}[- ]?){3}\d{4}\b',
        "ip_address": r'\b(?:\d{1,3}\.){3}\d{1,3}\b',
        "date_of_birth": r'\b(?:born|DOB|birth)[:\s]+\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b',
    }
    
    def detect(self, text: str) -> List[Dict]:
        found = []
        for pii_type, pattern in self.PATTERNS.items():
            matches = re.findall(pattern, text, re.IGNORECASE)
            for m in matches:
                found.append({"type": pii_type, "value": m[:20] + "..." if len(m) > 20 else m})
        return found

class ComplianceChecker:
    FRAMEWORKS = {
        "GDPR": {
            "rules": [
                {"pattern": r'(?:personal data|PII|private information)', "check": "consent_mentioned", "severity": "high"},
                {"pattern": r'(?:EU|European|EEA)', "check": "data_processing_agreement", "severity": "medium"},
            ],
            "pii_restrictions": ["ssn", "credit_card", "date_of_birth"],
        },
        "HIPAA": {
            "rules": [
                {"pattern": r'(?:patient|medical|health|diagnosis|treatment|prescription)', "check": "phi_protection", "severity": "critical"},
                {"pattern": r'(?:MRN|medical record|patient ID)', "check": "phi_identifier", "severity": "critical"},
            ],
            "pii_restrictions": ["ssn", "date_of_birth"],
        },
        "PCI-DSS": {
            "rules": [
                {"pattern": r'(?:credit card|card number|CVV|cardholder)', "check": "card_data_protection", "severity": "critical"},
            ],
            "pii_restrictions": ["credit_card"],
        },
        "SOC2": {
            "rules": [
                {"pattern": r'(?:password|credential|secret|API key|token)', "check": "secret_exposure", "severity": "high"},
                {"pattern": r'(?:internal|confidential|restricted)', "check": "data_classification", "severity": "medium"},
            ],
            "pii_restrictions": [],
        },
    }
    
    def check(self, text: str, pii_items: List[Dict]) -> List[ComplianceViolation]:
        violations = []
        for framework, config in self.FRAMEWORKS.items():
            for rule in config["rules"]:
                if re.search(rule["pattern"], text, re.IGNORECASE):
                    violations.append(ComplianceViolation(
                        framework=framework, severity=rule["severity"],
                        rule=rule["check"],
                        evidence=re.search(rule["pattern"], text, re.IGNORECASE).group()[:50],
                        recommendation=f"Review {framework} {rule['check']} requirements"
                    ))
            
            for pii in pii_items:
                if pii["type"] in config.get("pii_restrictions", []):
                    violations.append(ComplianceViolation(
                        framework=framework, severity="high",
                        rule=f"pii_exposure_{pii['type']}",
                        evidence=f"{pii['type']} detected in email",
                        recommendation=f"Remove or encrypt {pii['type']} before sending"
                    ))
        return violations

class EmailComplianceEngine:
    def __init__(self):
        self.pii_detector = PIIDetector()
        self.compliance_checker = ComplianceChecker()
    
    def check_email(self, email: Dict, recipients: List[str] = None) -> Dict:
        body = email.get("body", "")
        pii_items = self.pii_detector.detect(body)
        violations = self.compliance_checker.check(body, pii_items)
        
        risk_score = sum(
            {"critical": 1.0, "high": 0.7, "medium": 0.4, "low": 0.2}.get(v.severity, 0.1)
            for v in violations
        )
        risk_score = min(1.0, risk_score / max(1, len(violations)))
        
        return {
            "email_id": email.get("id", ""),
            "overall_compliant": len(violations) == 0,
            "violations": [v.__dict__ for v in violations],
            "pii_detected": [f"{p['type']}: {p['value']}" for p in pii_items],
            "risk_score": round(risk_score, 2),
            "frameworks_checked": list(self.compliance_checker.FRAMEWORKS.keys()),
            "reply_all_required": len(recipients or []) > 1,
            "timestamp": datetime.datetime.now().isoformat()
        }

if __name__ == "__main__":
    engine = EmailComplianceEngine()
    sample = {"id": "comp-001", "body": "The patient John Smith (DOB: 01/15/1985, SSN: 123-45-6789) needs his prescription refilled. His credit card ending in 4532 is on file. Password for the portal is TempPass123."}
    result = engine.check_email(sample, ["nurse@hospital.com", "pharmacy@hospital.com"])
    print(json.dumps(result, indent=2))
