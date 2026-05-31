#!/usr/bin/env python3
"""V921: Email Compliance Guardian Pro - GDPR, HIPAA, PCI-DSS, SOX detection"""
import re
from datetime import datetime
from typing import Dict, List, Any

class ComplianceGuardianPro:
    def __init__(self):
        self.pii_patterns = {
            'email': r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b',
            'phone': r'\b\d{3}[-.]?\d{3}[-.]?\d{4}\b',
            'ssn': r'\b\d{3}-\d{2}-\d{4}\b',
            'credit_card': r'\b(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13})\b'
        }
        self.hipaa_keywords = ['patient', 'medical', 'diagnosis', 'treatment', 'health record', 'prescription']
        self.gdpr_keywords = ['personal data', 'consent', 'right to be forgotten', 'data subject', 'processor']
        self.sox_keywords = ['financial statement', 'audit', 'internal controls', 'material weakness']
        self.compliance_log = []
    
    def analyze_email(self, email_data: Dict[str, Any]) -> Dict[str, Any]:
        body = email_data.get('body', '')
        subject = email_data.get('subject', '')
        recipients = email_data.get('recipients', [])
        full_text = f"{subject} {body}"
        
        violations = []
        pii_found = self._detect_pii(full_text)
        hipaa_risks = self._check_hipaa(full_text)
        gdpr_risks = self._check_gdpr(full_text)
        sox_risks = self._check_sox(full_text)
        
        if pii_found: violations.extend(pii_found)
        if hipaa_risks: violations.extend(hipaa_risks)
        if gdpr_risks: violations.extend(gdpr_risks)
        if sox_risks: violations.extend(sox_risks)
        
        compliance_score = max(0, 100 - len(violations) * 15)
        redacted_text = self._redact_sensitive(full_text)
        
        self.compliance_log.append({
            'timestamp': datetime.now().isoformat(),
            'violations': len(violations),
            'score': compliance_score,
            'recipients': len(recipients)
        })
        
        response = self._generate_compliance_response(violations, compliance_score, redacted_text, recipients)
        
        return {
            'action': 'compliance_check',
            'compliance_score': compliance_score,
            'violations': violations,
            'redacted_text': redacted_text,
            'response': response,
            'reply_all_required': len(recipients) > 1,
            'safe_to_send': compliance_score >= 70
        }
    
    def _detect_pii(self, text: str) -> List[Dict[str, str]]:
        found = []
        for pii_type, pattern in self.pii_patterns.items():
            matches = re.findall(pattern, text)
            if matches:
                found.append({'type': pii_type, 'count': len(matches), 'severity': 'high' if pii_type in ['ssn', 'credit_card'] else 'medium'})
        return found
    
    def _check_hipaa(self, text: str) -> List[Dict[str, str]]:
        risks = []
        text_lower = text.lower()
        for kw in self.hipaa_keywords:
            if kw in text_lower:
                risks.append({'type': 'hipaa', 'keyword': kw, 'severity': 'high'})
        return risks[:3]
    
    def _check_gdpr(self, text: str) -> List[Dict[str, str]]:
        risks = []
        text_lower = text.lower()
        for kw in self.gdpr_keywords:
            if kw in text_lower:
                risks.append({'type': 'gdpr', 'keyword': kw, 'severity': 'medium'})
        return risks[:2]
    
    def _check_sox(self, text: str) -> List[Dict[str, str]]:
        risks = []
        text_lower = text.lower()
        for kw in self.sox_keywords:
            if kw in text_lower:
                risks.append({'type': 'sox', 'keyword': kw, 'severity': 'medium'})
        return risks[:2]
    
    def _redact_sensitive(self, text: str) -> str:
        redacted = text
        for pattern in self.pii_patterns.values():
            redacted = re.sub(pattern, '[REDACTED]', redacted)
        return redacted
    
    def _generate_compliance_response(self, violations, score, redacted, recipients):
        if score >= 70:
            text = f"✅ Compliance check passed (Score: {score}/100).\nSafe to send to {len(recipients)} recipients."
            if len(recipients) > 1:
                text += "\n\n⚠️ REPLY ALL enforced for transparency."
        else:
            text = f"⚠️ Compliance issues detected (Score: {score}/100).\n\nViolations found:\n"
            for v in violations[:5]:
                text += f"  - {v['type']}: {v.get('keyword', v.get('count', 'N/A'))} ({v['severity']})\n"
            text += f"\nRedacted version prepared. Manual review required before sending to {len(recipients)} recipients."
        return {'text': text, 'reply_all': len(recipients) > 1, 'requires_review': score < 70}

def main():
    guardian = ComplianceGuardianPro()
    tests = [
        {'subject': 'Patient records', 'body': 'Please send patient John Doe SSN 123-45-6789 medical records to dr@hospital.com', 'recipients': ['admin@ex.com', 'legal@ex.com']},
        {'subject': 'Payment info', 'body': 'Here is the credit card 4111111111111111 for the subscription renewal', 'recipients': ['billing@ex.com']},
        {'subject': 'Meeting notes', 'body': 'Great meeting today. Next steps are documented in the shared folder.', 'recipients': ['team@ex.com', 'manager@ex.com']}
    ]
    print("=" * 60)
    print("V921 Compliance Guardian Pro")
    print("=" * 60)
    for e in tests:
        r = guardian.analyze_email(e)
        print(f"\nSubject: {e['subject']}")
        print(f"  Score: {r['compliance_score']}/100, Violations: {len(r['violations'])}, Safe: {r['safe_to_send']}, Reply All: {r['reply_all_required']}")
    print("\nV921 Compliance Guardian Pro: OPERATIONAL")

if __name__ == '__main__':
    main()
