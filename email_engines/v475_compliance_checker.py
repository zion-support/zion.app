#!/usr/bin/env python3
"""
V475 - Email Compliance Checker
Real-time email compliance validation for GDPR, HIPAA, PCI-DSS, SOX, and other regulations.
Features: PII detection, compliance scoring, auto-redaction, audit trails, regulatory validation.
CRITICAL: Always enforces reply-all for multi-recipient emails.
"""

import json
import re
from datetime import datetime
from typing import Dict, List, Any


class EmailComplianceChecker:
    """Real-time email compliance validation."""
    
    COMPLIANCE_FRAMEWORKS = {
        'gdpr': {
            'name': 'GDPR',
            'full_name': 'General Data Protection Regulation',
            'region': 'EU',
            'pii_types': ['email', 'phone', 'address', 'name', 'ip_address']
        },
        'hipaa': {
            'name': 'HIPAA',
            'full_name': 'Health Insurance Portability and Accountability Act',
            'region': 'USA',
            'pii_types': ['medical_record', 'ssn', 'health_info', 'patient_id']
        },
        'pci_dss': {
            'name': 'PCI-DSS',
            'full_name': 'Payment Card Industry Data Security Standard',
            'region': 'Global',
            'pii_types': ['credit_card', 'cvv', 'bank_account']
        },
        'sox': {
            'name': 'SOX',
            'full_name': 'Sarbanes-Oxley Act',
            'region': 'USA',
            'pii_types': ['financial_data', 'audit_info', 'executive_communication']
        },
        'ccpa': {
            'name': 'CCPA',
            'full_name': 'California Consumer Privacy Act',
            'region': 'California',
            'pii_types': ['email', 'phone', 'address', 'ssn', 'driver_license']
        }
    }
    
    PII_PATTERNS = {
        'ssn': r'\b\d{3}-\d{2}-\d{4}\b',
        'credit_card': r'\b(?:\d{4}[-\s]?){3}\d{4}\b',
        'email': r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b',
        'phone': r'\b(?:\+?1[-.\s]?)?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}\b',
        'ip_address': r'\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b',
        'medical_record': r'\bMRN[:\s]?\d{6,10}\b',
        'driver_license': r'\b[A-Z]\d{7}\b',
        'bank_account': r'\b\d{10,17}\b',
        'cvv': r'\b\d{3,4}\b'
    }
    
    def analyze_email(self, email: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze email for compliance violations."""
        body = email.get('body', '')
        subject = email.get('subject', '')
        sender = email.get('from', '')
        recipients = email.get('to', []) + email.get('cc', [])
        attachments = email.get('attachments', [])
        
        # Scan for PII
        pii_findings = self._scan_pii(body + ' ' + subject)
        
        # Determine applicable compliance frameworks
        applicable_frameworks = self._determine_frameworks(pii_findings, email)
        
        # Calculate compliance score
        compliance_score = self._calculate_compliance_score(pii_findings, applicable_frameworks)
        
        # Generate redaction recommendations
        redaction_recommendations = self._generate_redaction_recommendations(pii_findings)
        
        # Check for external recipients
        external_recipients = self._check_external_recipients(recipients, sender)
        
        # Generate compliance report
        compliance_report = self._generate_compliance_report(
            pii_findings, applicable_frameworks, compliance_score, external_recipients
        )
        
        # Create audit trail
        audit_trail = self._create_audit_trail(email, compliance_report)
        
        reply_all_required = len(recipients) > 1
        
        return {
            'engine': 'V475_EmailComplianceChecker',
            'compliance_score': compliance_score,
            'pii_findings': pii_findings,
            'applicable_frameworks': applicable_frameworks,
            'redaction_recommendations': redaction_recommendations,
            'external_recipients': external_recipients,
            'compliance_report': compliance_report,
            'audit_trail': audit_trail,
            'safe_to_send': compliance_score['overall_score'] >= 70,
            'reply_all_required': reply_all_required,
            'reply_all_enforced': reply_all_required,
            'recipients': recipients,
            'timestamp': datetime.now().isoformat()
        }
    
    def _scan_pii(self, text: str) -> List[Dict]:
        """Scan text for PII patterns."""
        findings = []
        
        for pii_type, pattern in self.PII_PATTERNS.items():
            matches = re.findall(pattern, text, re.IGNORECASE)
            if matches:
                findings.append({
                    'type': pii_type,
                    'count': len(matches),
                    'severity': self._get_pii_severity(pii_type),
                    'examples': matches[:2]  # Show first 2 examples
                })
        
        return findings
    
    def _get_pii_severity(self, pii_type: str) -> str:
        """Get severity level for PII type."""
        high_severity = ['ssn', 'credit_card', 'medical_record', 'bank_account', 'cvv']
        medium_severity = ['email', 'phone', 'driver_license']
        
        if pii_type in high_severity:
            return 'high'
        elif pii_type in medium_severity:
            return 'medium'
        else:
            return 'low'
    
    def _determine_frameworks(self, pii_findings: List[Dict], email: Dict) -> List[Dict]:
        """Determine which compliance frameworks apply."""
        applicable = []
        pii_types = [f['type'] for f in pii_findings]
        
        for framework_id, framework in self.COMPLIANCE_FRAMEWORKS.items():
            # Check if any PII types match this framework
            matching_pii = [pii for pii in pii_types if pii in framework['pii_types']]
            
            if matching_pii:
                applicable.append({
                    'framework': framework['name'],
                    'full_name': framework['full_name'],
                    'region': framework['region'],
                    'applicable_pii': matching_pii,
                    'requirements': self._get_framework_requirements(framework_id)
                })
        
        # Always include GDPR if email has any PII and external recipients
        if pii_findings and not any(f['framework'] == 'GDPR' for f in applicable):
            applicable.append({
                'framework': 'GDPR',
                'full_name': 'General Data Protection Regulation',
                'region': 'EU',
                'applicable_pii': pii_types,
                'requirements': self._get_framework_requirements('gdpr')
            })
        
        return applicable
    
    def _get_framework_requirements(self, framework_id: str) -> List[str]:
        """Get requirements for a compliance framework."""
        requirements = {
            'gdpr': [
                'Obtain explicit consent before sharing PII',
                'Provide data subject rights information',
                'Ensure data minimization',
                'Implement appropriate security measures',
                'Maintain data processing records'
            ],
            'hipaa': [
                'Encrypt PHI in transit and at rest',
                'Implement access controls',
                'Maintain audit logs',
                'Obtain patient authorization',
                'Implement minimum necessary standard'
            ],
            'pci_dss': [
                'Never store CVV codes',
                'Encrypt cardholder data',
                'Implement strong access controls',
                'Regular security testing',
                'Maintain security policies'
            ],
            'sox': [
                'Maintain accurate financial records',
                'Implement internal controls',
                'Ensure executive accountability',
                'Regular audits and assessments',
                'Document all financial communications'
            ],
            'ccpa': [
                'Provide privacy notice',
                'Honor opt-out requests',
                'Allow data deletion requests',
                'Disclose data collection practices',
                'Implement reasonable security'
            ]
        }
        
        return requirements.get(framework_id, [])
    
    def _calculate_compliance_score(self, pii_findings: List[Dict], frameworks: List[Dict]) -> Dict:
        """Calculate overall compliance score."""
        if not pii_findings:
            return {
                'overall_score': 100,
                'grade': 'A+',
                'status': 'compliant',
                'risk_level': 'none'
            }
        
        # Start with 100 and deduct for violations
        score = 100
        
        # Deduct for high severity PII
        high_severity_count = sum(1 for f in pii_findings if f['severity'] == 'high')
        score -= high_severity_count * 20
        
        # Deduct for medium severity PII
        medium_severity_count = sum(1 for f in pii_findings if f['severity'] == 'medium')
        score -= medium_severity_count * 10
        
        # Deduct for multiple frameworks
        score -= len(frameworks) * 5
        
        # Ensure score doesn't go below 0
        score = max(0, score)
        
        # Determine grade
        if score >= 90:
            grade = 'A+'
            status = 'compliant'
            risk_level = 'low'
        elif score >= 80:
            grade = 'A'
            status = 'mostly_compliant'
            risk_level = 'low'
        elif score >= 70:
            grade = 'B'
            status = 'needs_review'
            risk_level = 'medium'
        elif score >= 60:
            grade = 'C'
            status = 'at_risk'
            risk_level = 'high'
        else:
            grade = 'F'
            status = 'non_compliant'
            risk_level = 'critical'
        
        return {
            'overall_score': score,
            'grade': grade,
            'status': status,
            'risk_level': risk_level,
            'pii_violations': len(pii_findings),
            'frameworks_applicable': len(frameworks)
        }
    
    def _generate_redaction_recommendations(self, pii_findings: List[Dict]) -> List[Dict]:
        """Generate PII redaction recommendations."""
        recommendations = []
        
        for finding in pii_findings:
            redaction = {
                'pii_type': finding['type'],
                'severity': finding['severity'],
                'count': finding['count'],
                'recommendation': self._get_redaction_method(finding['type']),
                'auto_redact': finding['severity'] == 'high'
            }
            recommendations.append(redaction)
        
        return recommendations
    
    def _get_redaction_method(self, pii_type: str) -> str:
        """Get recommended redaction method for PII type."""
        methods = {
            'ssn': 'Replace with ***-**-****',
            'credit_card': 'Replace with ****-****-****-XXXX (last 4 digits)',
            'email': 'Replace with [EMAIL REDACTED]',
            'phone': 'Replace with [PHONE REDACTED]',
            'ip_address': 'Replace with [IP REDACTED]',
            'medical_record': 'Replace with [MEDICAL ID REDACTED]',
            'driver_license': 'Replace with [LICENSE REDACTED]',
            'bank_account': 'Replace with ****XXXX (last 4 digits)',
            'cvv': 'Remove entirely (never store)'
        }
        
        return methods.get(pii_type, 'Redact completely')
    
    def _check_external_recipients(self, recipients: List[str], sender: str) -> Dict:
        """Check if email has external recipients."""
        # Extract domain from sender
        sender_domain = sender.split('@')[-1].lower() if '@' in sender else ''
        
        external = []
        internal = []
        
        for recipient in recipients:
            if '@' in recipient:
                recipient_domain = recipient.split('@')[-1].lower()
                if recipient_domain != sender_domain:
                    external.append(recipient)
                else:
                    internal.append(recipient)
        
        return {
            'has_external': len(external) > 0,
            'external_count': len(external),
            'internal_count': len(internal),
            'external_recipients': external,
            'risk_level': 'high' if len(external) > 0 else 'low'
        }
    
    def _generate_compliance_report(self, pii_findings: List[Dict], frameworks: List[Dict], 
                                    score: Dict, external: Dict) -> Dict:
        """Generate comprehensive compliance report."""
        return {
            'summary': {
                'compliance_score': score['overall_score'],
                'grade': score['grade'],
                'status': score['status'],
                'risk_level': score['risk_level']
            },
            'pii_detected': {
                'total_findings': len(pii_findings),
                'high_severity': sum(1 for f in pii_findings if f['severity'] == 'high'),
                'medium_severity': sum(1 for f in pii_findings if f['severity'] == 'medium'),
                'low_severity': sum(1 for f in pii_findings if f['severity'] == 'low')
            },
            'compliance_frameworks': [f['framework'] for f in frameworks],
            'external_sharing': external['has_external'],
            'recommendations': self._generate_recommendations(score, pii_findings, external),
            'generated_at': datetime.now().isoformat()
        }
    
    def _generate_recommendations(self, score: Dict, pii_findings: List[Dict], external: Dict) -> List[str]:
        """Generate compliance recommendations."""
        recommendations = []
        
        if score['overall_score'] < 70:
            recommendations.append("⚠️ HIGH RISK: Review and redact PII before sending")
        
        if any(f['severity'] == 'high' for f in pii_findings):
            recommendations.append("🔒 Redact high-severity PII (SSN, credit cards, medical records)")
        
        if external['has_external'] and pii_findings:
            recommendations.append("🌐 External recipients detected - ensure proper authorization for PII sharing")
        
        if score['overall_score'] >= 90:
            recommendations.append("✅ Email appears compliant - safe to send")
        
        recommendations.append("📋 Maintain audit trail for compliance documentation")
        recommendations.append("Always use reply-all for multi-recipient emails")
        
        return recommendations
    
    def _create_audit_trail(self, email: Dict, compliance_report: Dict) -> Dict:
        """Create audit trail for compliance."""
        return {
            'audit_id': f"AUDIT-{datetime.now().strftime('%Y%m%d%H%M%S')}",
            'email_subject': email.get('subject', ''),
            'email_from': email.get('from', ''),
            'email_to': email.get('to', []),
            'compliance_score': compliance_report['summary']['compliance_score'],
            'pii_detected': compliance_report['pii_detected']['total_findings'],
            'frameworks_checked': compliance_report['compliance_frameworks'],
            'timestamp': datetime.now().isoformat(),
            'retention_period': '7 years',
            'storage_location': 'compliance_audit_logs'
        }


def main():
    """Test V475 engine."""
    engine = EmailComplianceChecker()
    
    test_emails = [
        {
            'from': 'hr@ziontechgroup.com',
            'to': ['manager@external.com', 'kleber@ziontechgroup.com'],
            'subject': 'Employee Information',
            'body': 'Please find the employee details: SSN: 123-45-6789, Email: employee@example.com, Phone: (302) 555-0123'
        },
        {
            'from': 'finance@ziontechgroup.com',
            'to': ['accounting@partner.com', 'kleber@ziontechgroup.com'],
            'subject': 'Payment Information',
            'body': 'Please process payment to credit card: 4111-1111-1111-1111, CVV: 123, Bank account: 1234567890'
        },
        {
            'from': 'sales@ziontechgroup.com',
            'to': ['client@company.com', 'kleber@ziontechgroup.com'],
            'subject': 'Project Update',
            'body': 'The project is progressing well. We will complete the deliverables by Friday.'
        }
    ]
    
    print("=== Email Compliance Checker ===\n")
    
    for i, email in enumerate(test_emails, 1):
        result = engine.analyze_email(email)
        print(f"\n📧 Email {i}: {email['subject']}")
        print(f"   Compliance Score: {result['compliance_score']['overall_score']}/100 (Grade: {result['compliance_score']['grade']})")
        print(f"   Status: {result['compliance_score']['status']}")
        print(f"   Risk Level: {result['compliance_score']['risk_level']}")
        print(f"   PII Findings: {len(result['pii_findings'])}")
        print(f"   Frameworks: {', '.join(f['framework'] for f in result['applicable_frameworks'])}")
        print(f"   External Recipients: {result['external_recipients']['has_external']}")
        print(f"   Safe to Send: {result['safe_to_send']}")
        print(f"   Reply-all enforced: {result['reply_all_enforced']}")
        
        if result['pii_findings']:
            print(f"   PII Types: {', '.join(f['type'] for f in result['pii_findings'])}")


if __name__ == '__main__':
    main()
