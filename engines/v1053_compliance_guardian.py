#!/usr/bin/env python3
"""V1053: AI Email Compliance Guardian Pro
Industry-specific compliance checking (HIPAA, GDPR, SOX, PCI-DSS, FINRA).
Auto-redaction of sensitive data before sending.
MANDATORY: Reply-all enforcement for multi-recipient emails.
"""

import re
import json
import hashlib
from datetime import datetime

class ComplianceGuardian:
    def __init__(self):
        self.compliance_frameworks = {
            'HIPAA': {
                'sensitive_data': ['ssn', 'medical_record', 'diagnosis', 'treatment', 'prescription', 'health_insurance'],
                'patterns': {
                    'ssn': r'\b\d{3}-\d{2}-\d{4}\b',
                    'medical_id': r'\b[A-Z]\d{8,10}\b',
                    'dob': r'(?:DOB|birth)[:\s]+\d{1,2}[/-]\d{1,2}[/-]\d{2,4}'
                }
            },
            'GDPR': {
                'sensitive_data': ['personal_data', 'email', 'phone', 'address', 'ip_address', 'cookie_id'],
                'patterns': {
                    'eu_phone': r'\+\d{2,3}\s?\d{1,4}\s?\d{6,10}',
                    'eu_address': r'(?:street|road|avenue|strasse|rua|rue)\s+[\w\s\d,]+',
                    'ip': r'\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b'
                },
                'consent_required': True
            },
            'SOX': {
                'sensitive_data': ['financial_statement', 'revenue', 'profit', 'audit', 'internal_controls'],
                'patterns': {
                    'financial_figures': r'(?:revenue|profit|loss|assets|liabilities)[:\s]+\$[\d,.]+',
                    'quarterly': r'Q[1-4]\s+\d{4}'
                }
            },
            'PCI_DSS': {
                'sensitive_data': ['credit_card', 'cvv', 'cardholder_name', 'expiry_date'],
                'patterns': {
                    'credit_card': r'\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b',
                    'cvv': r'\b(?:CVV|CVC|security code)[:\s]+\d{3,4}\b',
                    'expiry': r'(?:exp|expiry)[:\s]+\d{2}[/-]\d{2,4}'
                }
            },
            'FINRA': {
                'sensitive_data': ['investment_advice', 'securities', 'portfolio', 'trading_recommendation'],
                'patterns': {
                    'guarantee': r'(?:guarantee|guaranteed|certain|sure thing|no risk)',
                    'performance_claim': r'(?:will return|guaranteed return|double your money)'
                },
                'disclaimers_required': True
            }
        }
        
        self.audit_log = []
    
    def check_compliance(self, email_data):
        """Check email against compliance frameworks."""
        sender = email_data.get('sender', 'unknown')
        recipients = email_data.get('recipients', [])
        subject = email_data.get('subject', '')
        body = email_data.get('body', '')
        industry = email_data.get('industry', 'general')
        
        # REPLY-ALL ENFORCEMENT
        reply_all = len(recipients) > 1
        
        # Determine applicable frameworks
        applicable = self._determine_frameworks(industry, sender, recipients)
        
        # Scan for violations
        violations = []
        for framework in applicable:
            framework_violations = self._scan_for_violations(framework, subject, body)
            violations.extend(framework_violations)
        
        # Generate redactions
        redactions = self._generate_redactions(body, violations)
        
        # Check disclaimers
        disclaimer_check = self._check_disclaimers(body, applicable)
        
        # Consent check (GDPR)
        consent_check = self._check_consent(email_data, applicable)
        
        # Generate audit trail
        audit_entry = self._create_audit_entry(email_data, violations, redactions)
        
        # Compliance score
        score = self._calculate_compliance_score(violations, disclaimer_check, consent_check)
        
        return {
            'email_id': email_data.get('id'),
            'reply_all_required': reply_all,
            'applicable_frameworks': applicable,
            'compliance_score': score,
            'status': 'PASS' if score >= 80 else 'WARNING' if score >= 60 else 'FAIL',
            'violations': violations,
            'suggested_redactions': redactions,
            'disclaimer_check': disclaimer_check,
            'consent_check': consent_check,
            'corrected_body': self._apply_redactions(body, redactions),
            'required_disclaimers': self._get_required_disclaimers(applicable),
            'audit_trail_id': audit_entry['id'],
            'contact_info': {
                'phone': '+1 302 464 0950',
                'email': 'kleber@ziontechgroup.com',
                'address': '364 E Main St STE 1008, Middletown DE 19709'
            }
        }
    
    def _determine_frameworks(self, industry, sender, recipients):
        """Determine which compliance frameworks apply."""
        frameworks = []
        
        industry_map = {
            'healthcare': ['HIPAA'],
            'finance': ['SOX', 'PCI_DSS', 'FINRA'],
            'banking': ['PCI_DSS', 'SOX'],
            'insurance': ['HIPAA', 'SOX'],
            'ecommerce': ['PCI_DSS', 'GDPR'],
            'saas': ['GDPR'],
            'general': ['GDPR']
        }
        
        frameworks = industry_map.get(industry.lower(), ['GDPR'])
        
        # Check for EU recipients
        for r in recipients:
            if any(domain in r for domain in ['.eu', '.uk', '.de', '.fr', '.it', '.es', '.nl']):
                if 'GDPR' not in frameworks:
                    frameworks.append('GDPR')
        
        return frameworks
    
    def _scan_for_violations(self, framework, subject, body):
        """Scan for compliance violations."""
        violations = []
        text = subject + ' ' + body
        config = self.compliance_frameworks.get(framework, {})
        
        for data_type, pattern in config.get('patterns', {}).items():
            matches = re.finditer(pattern, text, re.IGNORECASE)
            for match in matches:
                violations.append({
                    'framework': framework,
                    'type': data_type,
                    'match': match.group(0),
                    'position': match.start(),
                    'severity': 'CRITICAL' if data_type in ('ssn', 'credit_card', 'cvv') else 'HIGH',
                    'recommendation': f'Redact or encrypt {data_type.replace("_", " ")} before sending'
                })
        
        # Check for prohibited language
        if framework == 'FINRA':
            prohibited = ['guarantee', 'no risk', 'sure thing', 'double your money']
            for phrase in prohibited:
                if phrase in text.lower():
                    violations.append({
                        'framework': 'FINRA',
                        'type': 'prohibited_language',
                        'match': phrase,
                        'severity': 'HIGH',
                        'recommendation': 'Remove guarantee language. Add risk disclosures.'
                    })
        
        return violations
    
    def _generate_redactions(self, body, violations):
        """Generate redaction suggestions."""
        redactions = []
        
        for violation in violations:
            if violation['severity'] in ('CRITICAL', 'HIGH'):
                match = violation['match']
                if re.match(r'\d{3}-\d{2}-\d{4}', match):  # SSN
                    redactions.append({
                        'original': match,
                        'redacted': '***-**-' + match[-4:],
                        'type': 'SSN'
                    })
                elif re.match(r'\d{4}', match):  # Credit card
                    redactions.append({
                        'original': match,
                        'redacted': '****-****-****-' + match[-4:],
                        'type': 'Credit Card'
                    })
                else:
                    redactions.append({
                        'original': match,
                        'redacted': '[REDACTED]',
                        'type': violation['type']
                    })
        
        return redactions
    
    def _check_disclaimers(self, body, frameworks):
        """Check if required disclaimers are present."""
        checks = {}
        
        if 'FINRA' in frameworks:
            has_disclaimer = any(word in body.lower() for word in ['past performance', 'not guaranteed', 'risk'])
            checks['FINRA_disclaimer'] = 'present' if has_disclaimer else 'missing'
        
        if 'HIPAA' in frameworks:
            has_confidentiality = 'confidential' in body.lower() or 'privileged' in body.lower()
            checks['HIPAA_confidentiality'] = 'present' if has_confidentiality else 'missing'
        
        if 'GDPR' in frameworks:
            has_privacy = 'privacy' in body.lower() or 'data protection' in body.lower()
            checks['GDPR_privacy'] = 'present' if has_privacy else 'recommended'
        
        return checks
    
    def _check_consent(self, email_data, frameworks):
        """Check GDPR consent requirements."""
        if 'GDPR' not in frameworks:
            return {'required': False}
        
        return {
            'required': True,
            'status': 'assumed',
            'recommendation': 'Verify consent records exist for EU recipients'
        }
    
    def _create_audit_entry(self, email_data, violations, redactions):
        """Create tamper-proof audit entry."""
        entry = {
            'id': hashlib.sha256(
                f"{email_data.get('id')}{datetime.now().isoformat()}".encode()
            ).hexdigest()[:16],
            'timestamp': datetime.now().isoformat(),
            'email_id': email_data.get('id'),
            'violations_count': len(violations),
            'redactions_applied': len(redactions),
            'hash': hashlib.sha256(
                json.dumps({'violations': violations, 'redactions': redactions}).encode()
            ).hexdigest()
        }
        self.audit_log.append(entry)
        return entry
    
    def _calculate_compliance_score(self, violations, disclaimer_check, consent_check):
        """Calculate overall compliance score."""
        score = 100
        
        # Deduct for violations
        for v in violations:
            if v['severity'] == 'CRITICAL':
                score -= 30
            elif v['severity'] == 'HIGH':
                score -= 15
            else:
                score -= 5
        
        # Deduct for missing disclaimers
        for check, status in disclaimer_check.items():
            if status == 'missing':
                score -= 10
        
        return max(0, score)
    
    def _apply_redactions(self, body, redactions):
        """Apply redactions to email body."""
        corrected = body
        for r in redactions:
            corrected = corrected.replace(r['original'], r['redacted'])
        return corrected
    
    def _get_required_disclaimers(self, frameworks):
        """Get required disclaimers for frameworks."""
        disclaimers = []
        
        if 'FINRA' in frameworks:
            disclaimers.append("Past performance is not indicative of future results. Investments carry risk.")
        if 'HIPAA' in frameworks:
            disclaimers.append("This email contains confidential health information. Unauthorized disclosure is prohibited.")
        if 'GDPR' in frameworks:
            disclaimers.append("Your data is processed per our Privacy Policy. Contact us for data requests.")
        
        return disclaimers


if __name__ == '__main__':
    guardian = ComplianceGuardian()
    
    test_email = {
        'id': 'e001',
        'sender': 'doctor@hospital.com',
        'recipients': ['patient@eu-email.de', 'billing@hospital.com'],
        'subject': 'Patient Record Update - SSN 123-45-6789',
        'body': """Dear Patient,

Your medical record has been updated. SSN: 123-45-6789.
Diagnosis: Type 2 Diabetes. Treatment: Metformin 500mg.
Insurance ID: H123456789. DOB: 03/15/1985.

Credit card on file: 4532-1234-5678-9012 (CVV: 123).

Please review and confirm.""",
        'industry': 'healthcare',
        'timestamp': '2026-05-30T10:00:00'
    }
    
    print("=== V1053: AI Email Compliance Guardian Pro ===\n")
    
    result = guardian.check_compliance(test_email)
    print(f"Status: {result['status']}")
    print(f"Score: {result['compliance_score']}/100")
    print(f"Frameworks: {result['applicable_frameworks']}")
    print(f"Reply-All: {'REQUIRED' if result['reply_all_required'] else 'N/A'}")
    
    print(f"\n🚨 Violations ({len(result['violations'])}):")
    for v in result['violations'][:5]:
        print(f"  [{v['severity']}] {v['framework']}: {v['type']} - '{v['match'][:30]}'")
    
    print(f"\n🔒 Redactions ({len(result['suggested_redactions'])}):")
    for r in result['suggested_redactions'][:3]:
        print(f"  {r['type']}: {r['original'][:20]} → {r['redacted']}")
    
    print(f"\n📝 Disclaimers:")
    for d in result['required_disclaimers']:
        print(f"  • {d[:80]}...")
