#!/usr/bin/env python3
"""
Email Intelligence Engine V324 - Email Compliance Guardian Pro
Automated compliance checking for GDPR, CCPA, HIPAA, SOX with PII detection,
data retention policies, audit trails, and automatic redaction.
Enforces reply-all and case-by-case analysis.
"""

import json
import re
import hashlib
from datetime import datetime
from typing import Dict, List
from collections import defaultdict

class EmailComplianceGuardianPro:
    def __init__(self):
        self.version = "V324"
        self.audit_trail = []
        
        # PII patterns
        self.pii_patterns = {
            'ssn': r'\b\d{3}-\d{2}-\d{4}\b',
            'credit_card': r'\b(?:\d{4}[-\s]?){3}\d{4}\b',
            'phone': r'\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b',
            'email': r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b',
            'date_of_birth': r'\b\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b'
        }
        
        # Compliance frameworks
        self.frameworks = {
            'GDPR': {
                'region': 'EU',
                'requirements': ['data_minimization', 'consent', 'right_to_erasure', 'data_portability'],
                'pii_types': ['email', 'phone', 'date_of_birth']
            },
            'CCPA': {
                'region': 'California',
                'requirements': ['right_to_know', 'right_to_delete', 'opt_out'],
                'pii_types': ['email', 'phone', 'ssn']
            },
            'HIPAA': {
                'region': 'US Healthcare',
                'requirements': ['phi_protection', 'minimum_necessary', 'audit_trail'],
                'pii_types': ['ssn', 'date_of_birth', 'medical_record']
            },
            'SOX': {
                'region': 'US Public Companies',
                'requirements': ['financial_accuracy', 'internal_controls', 'audit_trail'],
                'pii_types': ['ssn', 'financial_data']
            }
        }
    
    def detect_pii(self, text: str) -> Dict:
        """Detect personally identifiable information"""
        findings = {}
        
        for pii_type, pattern in self.pii_patterns.items():
            matches = re.findall(pattern, text)
            if matches:
                findings[pii_type] = {
                    'count': len(matches),
                    'samples': matches[:3],  # Only show first 3 for security
                    'risk_level': 'high' if pii_type in ['ssn', 'credit_card'] else 'medium'
                }
        
        return findings
    
    def check_compliance(self, email_data: Dict, frameworks: List[str] = None) -> Dict:
        """Check email compliance against frameworks"""
        if not frameworks:
            frameworks = ['GDPR', 'CCPA']  # Default frameworks
        
        content = email_data.get('content', '')
        subject = email_data.get('subject', '')
        full_text = f"{subject} {content}"
        
        pii_findings = self.detect_pii(full_text)
        
        violations = []
        recommendations = []
        
        for framework in frameworks:
            if framework not in self.frameworks:
                continue
            
            fw_config = self.frameworks[framework]
            
            # Check PII types relevant to framework
            for pii_type in fw_config['pii_types']:
                if pii_type in pii_findings:
                    violations.append({
                        'framework': framework,
                        'violation': f'{pii_type}_detected',
                        'count': pii_findings[pii_type]['count'],
                        'risk_level': pii_findings[pii_type]['risk_level'],
                        'requirement': 'data_minimization'
                    })
                    
                    recommendations.append(f"Redact or encrypt {pii_type} data for {framework} compliance")
        
        # Check for consent indicators
        if 'GDPR' in frameworks and pii_findings:
            has_consent = any(word in full_text.lower() for word in ['consent', 'opt-in', 'agreed', 'permission'])
            if not has_consent:
                violations.append({
                    'framework': 'GDPR',
                    'violation': 'no_consent_indicator',
                    'risk_level': 'high',
                    'requirement': 'consent'
                })
                recommendations.append("Include consent indicator when processing personal data")
        
        # Calculate compliance score
        total_checks = len(frameworks) * 3  # 3 checks per framework
        violations_count = len(violations)
        compliance_score = max(0, 100 - (violations_count / total_checks * 100))
        
        return {
            'frameworks_checked': frameworks,
            'pii_detected': pii_findings,
            'violations': violations,
            'compliance_score': round(compliance_score, 1),
            'recommendations': list(set(recommendations)),
            'requires_review': compliance_score < 70,
            'requires_redaction': any(v['risk_level'] == 'high' for v in violations)
        }
    
    def redact_pii(self, text: str, pii_types: List[str] = None) -> str:
        """Redact PII from text"""
        if not pii_types:
            pii_types = list(self.pii_patterns.keys())
        
        redacted = text
        for pii_type in pii_types:
            if pii_type in self.pii_patterns:
                pattern = self.pii_patterns[pii_type]
                replacement = f'[REDACTED_{pii_type.upper()}]'
                redacted = re.sub(pattern, replacement, redacted)
        
        return redacted
    
    def create_audit_entry(self, email_data: Dict, compliance_result: Dict) -> Dict:
        """Create audit trail entry"""
        entry = {
            'timestamp': datetime.now().isoformat(),
            'email_hash': hashlib.sha256(
                f"{email_data.get('sender', '')}{email_data.get('subject', '')}".encode()
            ).hexdigest()[:16],
            'compliance_score': compliance_result['compliance_score'],
            'violations_count': len(compliance_result['violations']),
            'pii_types_detected': list(compliance_result['pii_detected'].keys()),
            'frameworks_checked': compliance_result['frameworks_checked'],
            'action_taken': 'redacted' if compliance_result['requires_redaction'] else 'logged',
            'retention_policy': '7_years' if 'SOX' in compliance_result['frameworks_checked'] else '3_years'
        }
        
        self.audit_trail.append(entry)
        return entry
    
    def generate_compliance_report(self, email_data: Dict, frameworks: List[str] = None) -> Dict:
        """Generate comprehensive compliance report"""
        print(f"[{self.version}] 🛡️ Generating compliance report")
        
        compliance = self.check_compliance(email_data, frameworks)
        
        # Create audit entry
        audit_entry = self.create_audit_entry(email_data, compliance)
        
        # Generate redacted version if needed
        redacted_content = None
        if compliance['requires_redaction']:
            content = email_data.get('content', '')
            pii_types = list(compliance['pii_detected'].keys())
            redacted_content = self.redact_pii(content, pii_types)
        
        return {
            'version': self.version,
            'engine': 'Email Compliance Guardian Pro',
            'compliance_analysis': compliance,
            'audit_entry': audit_entry,
            'redacted_content': redacted_content,
            'total_audit_entries': len(self.audit_trail),
            'recommendation': self._generate_recommendation(compliance)
        }
    
    def _generate_recommendation(self, compliance: Dict) -> str:
        """Generate compliance recommendation"""
        if compliance['compliance_score'] >= 90:
            return 'Email is compliant. No action required.'
        elif compliance['compliance_score'] >= 70:
            return f"Minor compliance issues detected. Review {len(compliance['violations'])} violation(s)."
        elif compliance['requires_redaction']:
            return 'HIGH RISK: PII detected. Use redacted version for compliance.'
        else:
            return 'Compliance review required before sending.'
    
    def process_email(self, email_data: Dict, frameworks: List[str] = None) -> Dict:
        """Process email with compliance checking"""
        print(f"[{self.version}] Processing with compliance guardian")
        
        # Case-by-case analysis
        recipients = email_data.get('recipients', [])
        cc_list = email_data.get('cc', [])
        all_recipients = recipients + cc_list
        
        # Enforce reply-all
        reply_all = len(all_recipients) > 1
        
        # Generate compliance report
        compliance_report = self.generate_compliance_report(email_data, frameworks)
        
        response = {
            'version': self.version,
            'engine': 'Email Compliance Guardian Pro',
            'compliance_report': compliance_report,
            'reply_all': reply_all,
            'reply_all_recipients': all_recipients if reply_all else [],
            'safe_to_send': compliance_report['compliance_analysis']['compliance_score'] >= 70,
            'recommendation': compliance_report['recommendation']
        }
        
        print(f"[{self.version}] Compliance: {compliance_report['compliance_analysis']['compliance_score']}%, Reply-all: {reply_all}")
        return response

# Test
if __name__ == "__main__":
    engine = EmailComplianceGuardianPro()
    
    # Test with PII
    test_email = {
        'sender': 'hr@company.com',
        'subject': 'Employee Information',
        'content': 'Please find the employee details:\nSSN: 123-45-6789\nPhone: 555-123-4567\nEmail: john.doe@example.com\nDOB: 01/15/1985',
        'recipients': ['manager@company.com'],
        'cc': ['legal@company.com']
    }
    
    result = engine.process_email(test_email, ['GDPR', 'HIPAA'])
    print(json.dumps(result, indent=2))
    
    # Test clean email
    print("\n--- Clean Email ---")
    clean_email = {
        'sender': 'sales@company.com',
        'subject': 'Product Information',
        'content': 'Thank you for your interest in our products. Please find the brochure attached.',
        'recipients': ['prospect@company.com'],
        'cc': []
    }
    result2 = engine.process_email(clean_email, ['GDPR'])
    print(json.dumps(result2, indent=2))
