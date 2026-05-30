#!/usr/bin/env python3
"""V282: Email Compliance Guardian Pro — Real-time compliance checking (GDPR, HIPAA, SOX, CCPA),
auto-detects sensitive data, suggests redaction, generates audit trails.
Always enforces reply-all for multi-recipient emails."""
import json, re
from datetime import datetime
from collections import defaultdict

class EmailComplianceGuardianPro:
    def __init__(self):
        self.compliance_rules = {
            'GDPR': {'pii_patterns': [r'\b[A-Z]{2}\d{6,}\b', r'passport', r'national id'], 'consent_required': True},
            'HIPAA': {'phi_patterns': [r'diagnosis', r'prescription', r'patient', r'medical record'], 'encryption_required': True},
            'SOX': {'financial_patterns': [r'revenue', r'earnings', r'financial statement', r'audit'], 'retention_days': 2555},
            'CCPA': {'consumer_patterns': [r'consumer data', r'personal information', r'opt.out'], 'deletion_rights': True},
            'PCI-DSS': {'card_patterns': [r'\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b', r'cvv', r'card number'], 'prohibited': True}
        }
        self.audit_log = []
    
    def analyze_email(self, email_data):
        sender = email_data.get('from', '')
        recipients = email_data.get('to', [])
        cc = email_data.get('cc', [])
        subject = email_data.get('subject', '')
        body = email_data.get('body', '')
        
        violations = self._check_compliance(subject, body)
        sensitive_data = self._detect_sensitive_data(body)
        redaction_suggestions = self._suggest_redactions(sensitive_data)
        compliance_score = self._calculate_compliance_score(violations)
        
        self.audit_log.append({
            'sender': sender, 'timestamp': datetime.now().isoformat(),
            'violations': len(violations), 'score': compliance_score
        })
        
        all_recipients = list(set(recipients + cc))
        if sender and sender not in all_recipients:
            all_recipients.insert(0, sender)
        
        return {
            'engine': 'V282-ComplianceGuardianPro',
            'compliance_score': compliance_score,
            'violations': violations,
            'sensitive_data_found': len(sensitive_data),
            'redaction_suggestions': redaction_suggestions,
            'audit_trail_generated': True,
            'response': self._generate_response(email_data, compliance_score, violations),
            'reply_to': all_recipients,
            'reply_all_enforced': len(all_recipients) > 1
        }
    
    def _check_compliance(self, subject, body):
        text = (subject + ' ' + body).lower()
        violations = []
        for framework, rules in self.compliance_rules.items():
            for rule_type, patterns in rules.items():
                if isinstance(patterns, list):
                    for p in patterns:
                        if re.search(p, text, re.I):
                            violations.append({'framework': framework, 'rule': rule_type, 'pattern': p})
        return violations
    
    def _detect_sensitive_data(self, body):
        data = []
        ssn = re.findall(r'\b\d{3}-\d{2}-\d{4}\b', body)
        if ssn: data.extend([{'type': 'SSN', 'value': s} for s in ssn])
        cards = re.findall(r'\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b', body)
        if cards: data.extend([{'type': 'CreditCard', 'value': c} for c in cards])
        emails = re.findall(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z]{2,}\b', body)
        if emails: data.extend([{'type': 'Email', 'value': e} for e in emails])
        return data
    
    def _suggest_redactions(self, sensitive_data):
        return [{'original': d['value'], 'redacted': f"[{d['type']} REDACTED]"} for d in sensitive_data]
    
    def _calculate_compliance_score(self, violations):
        base = 100
        for v in violations:
            base -= {'PCI-DSS': 25, 'HIPAA': 20, 'GDPR': 15, 'SOX': 10, 'CCPA': 10}.get(v['framework'], 5)
        return max(0, base)
    
    def _generate_response(self, email_data, score, violations):
        subject = email_data.get('subject', '')
        if score >= 90:
            base = f"✅ Compliance Check PASSED for '{subject}'. Score: {score}/100. No violations detected."
        elif score >= 70:
            base = f"⚠️ Compliance WARNING for '{subject}'. Score: {score}/100. {len(violations)} minor issue(s) found."
        else:
            base = f"🚨 Compliance ALERT for '{subject}'. Score: {score}/100. {len(violations)} violation(s) require immediate attention."
        return base + "\n\n---\nZion Tech Group | AI Email Intelligence V282\n📱 +1 302 464 0950 | ✉️ kleber@ziontechgroup.com\n📍 364 E Main St STE 1008, Middletown DE 19709"

if __name__ == "__main__":
    engine = EmailComplianceGuardianPro()
    test = {"from": "doctor@hospital.com", "to": ["admin@hospital.com", "legal@hospital.com"], "cc": ["compliance@hospital.com"], "subject": "Patient medical record update", "body": "Patient John Doe, SSN 123-45-6789, diagnosis: diabetes. Credit card 4111-1111-1111-1111 for billing. Please update medical record."}
    result = engine.analyze_email(test)
    print(json.dumps(result, indent=2))
    print("\n✅ V282 Compliance Guardian Pro — All systems operational | Reply-All: ENFORCED")
