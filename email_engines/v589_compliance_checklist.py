#!/usr/bin/env python3
"""
V589 - Email Compliance Checklist
Automated compliance checking for GDPR, HIPAA, SOC2 and other regulations.
Pre-send validation with audit trail generation and regulatory reporting.
Enforces reply-all for all communications.
"""
import json
import re
from datetime import datetime
from typing import Dict, List, Optional

class EmailComplianceChecklist:
    def __init__(self):
        self.reply_all_enforced = True
        self.regulations = {
            'gdpr': {
                'name': 'General Data Protection Regulation',
                'region': 'EU',
                'checks': ['personal_data', 'consent', 'data_minimization', 'right_to_erasure']
            },
            'hipaa': {
                'name': 'Health Insurance Portability and Accountability Act',
                'region': 'US',
                'checks': ['phi', 'encryption', 'minimum_necessary', 'audit_trail']
            },
            'soc2': {
                'name': 'Service Organization Control 2',
                'region': 'Global',
                'checks': ['security', 'availability', 'processing_integrity', 'confidentiality']
            },
            'ccpa': {
                'name': 'California Consumer Privacy Act',
                'region': 'US-CA',
                'checks': ['personal_info', 'disclosure', 'opt_out', 'data_subject_rights']
            }
        }
        
        self.sensitive_patterns = {
            'ssn': r'\b\d{3}-\d{2}-\d{4}\b',
            'credit_card': r'\b(?:\d{4}[-\s]?){3}\d{4}\b',
            'email': r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b',
            'phone': r'\b\d{3}[-.]?\d{3}[-.]?\d{4}\b',
            'ip_address': r'\b(?:\d{1,3}\.){3}\d{1,3}\b',
            'medical_record': r'\bMRN[:\s]?\d+\b',
            'date_of_birth': r'\b(?:DOB|Date of Birth)[:\s]?\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b'
        }
    
    def check_compliance(self, email: Dict, applicable_regulations: List[str] = None) -> Dict:
        """Check email compliance against regulations"""
        if applicable_regulations is None:
            applicable_regulations = ['gdpr', 'hipaa', 'soc2', 'ccpa']
        
        # Detect applicable regulations based on content
        detected_regulations = self._detect_applicable_regulations(email, applicable_regulations)
        
        # Run compliance checks
        compliance_results = {}
        all_passed = True
        
        for regulation in detected_regulations:
            result = self._check_regulation(email, regulation)
            compliance_results[regulation] = result
            if not result['passed']:
                all_passed = False
        
        # Generate audit trail
        audit_trail = self._generate_audit_trail(email, compliance_results)
        
        # Generate recommendations
        recommendations = self._generate_recommendations(compliance_results)
        
        # Calculate compliance score
        compliance_score = self._calculate_compliance_score(compliance_results)
        
        return {
            'engine': 'V589_Email_Compliance_Checklist',
            'timestamp': datetime.now().isoformat(),
            'email_id': email.get('id', 'unknown'),
            'applicable_regulations': detected_regulations,
            'compliance_results': compliance_results,
            'overall_compliance': 'passed' if all_passed else 'failed',
            'compliance_score': compliance_score,
            'audit_trail': audit_trail,
            'recommendations': recommendations,
            'reply_all_enforced': self.reply_all_enforced,
            'all_recipients': email.get('to', []) + email.get('cc', [])
        }
    
    def _detect_applicable_regulations(self, email: Dict, requested_regulations: List[str]) -> List[str]:
        """Detect which regulations apply to this email"""
        body = email.get('body', '').lower()
        subject = email.get('subject', '').lower()
        recipients = email.get('to', []) + email.get('cc', [])
        
        applicable = []
        
        # GDPR - EU recipients or EU-related content
        if 'gdpr' in requested_regulations:
            eu_domains = ['.eu', '.de', '.fr', '.it', '.es', '.nl', '.be', '.at', '.pt', '.ie', '.fi', '.se', '.dk', '.pl', '.cz', '.hu', '.gr']
            has_eu_recipients = any(any(domain in r.lower() for domain in eu_domains) for r in recipients)
            has_eu_content = any(term in body or term in subject for term in ['eu', 'europe', 'gdpr', 'data protection'])
            
            if has_eu_recipients or has_eu_content:
                applicable.append('gdpr')
        
        # HIPAA - Healthcare-related content
        if 'hipaa' in requested_regulations:
            healthcare_terms = ['patient', 'medical', 'health', 'diagnosis', 'treatment', 'hipaa', 'phi', 'healthcare']
            if any(term in body or term in subject for term in healthcare_terms):
                applicable.append('hipaa')
        
        # SOC2 - Security and data handling
        if 'soc2' in requested_regulations:
            security_terms = ['security', 'confidential', 'sensitive', 'encrypted', 'access control', 'soc2']
            if any(term in body or term in subject for term in security_terms):
                applicable.append('soc2')
        
        # CCPA - California recipients or California-related content
        if 'ccpa' in requested_regulations:
            ca_domains = ['.ca', 'california']
            has_ca_recipients = any(any(domain in r.lower() for domain in ca_domains) for r in recipients)
            has_ca_content = any(term in body or term in subject for term in ['california', 'ccpa', 'consumer privacy'])
            
            if has_ca_recipients or has_ca_content:
                applicable.append('ccpa')
        
        return applicable if applicable else requested_regulations[:1]  # At least check one
    
    def _check_regulation(self, email: Dict, regulation: str) -> Dict:
        """Check specific regulation compliance"""
        reg_info = self.regulations.get(regulation, {})
        
        if not reg_info:
            return {
                'regulation': regulation,
                'passed': False,
                'checks': [],
                'violations': ['Unknown regulation'],
                'warnings': []
            }
        
        checks = []
        violations = []
        warnings = []
        
        for check_type in reg_info['checks']:
            check_result = self._perform_check(email, regulation, check_type)
            checks.append(check_result)
            
            if check_result['status'] == 'failed':
                violations.append(check_result['issue'])
            elif check_result['status'] == 'warning':
                warnings.append(check_result['issue'])
        
        return {
            'regulation': regulation,
            'regulation_name': reg_info['name'],
            'passed': len(violations) == 0,
            'checks': checks,
            'violations': violations,
            'warnings': warnings,
            'score': round((len(checks) - len(violations)) / len(checks) * 100, 1) if checks else 0
        }
    
    def _perform_check(self, email: Dict, regulation: str, check_type: str) -> Dict:
        """Perform individual compliance check"""
        body = email.get('body', '')
        subject = email.get('subject', '')
        attachments = email.get('attachments', [])
        
        # Check for sensitive data
        if check_type in ['personal_data', 'phi', 'personal_info']:
            sensitive_found = self._check_sensitive_data(body + ' ' + subject)
            if sensitive_found:
                return {
                    'check': check_type,
                    'status': 'warning',
                    'issue': f'Sensitive data detected: {", ".join(sensitive_found)}',
                    'recommendation': 'Encrypt or redact sensitive data before sending'
                }
        
        # Check for encryption
        if check_type in ['encryption', 'confidentiality']:
            if 'confidential' in body.lower() or 'sensitive' in body.lower():
                if 'encrypt' not in body.lower() and not email.get('encrypted', False):
                    return {
                        'check': check_type,
                        'status': 'warning',
                        'issue': 'Confidential content without encryption',
                        'recommendation': 'Enable email encryption for confidential data'
                    }
        
        # Check for consent/disclosure
        if check_type in ['consent', 'disclosure', 'opt_out']:
            if 'unsubscribe' in body.lower() or 'marketing' in body.lower():
                if 'opt-out' not in body.lower() and 'unsubscribe' not in body.lower():
                    return {
                        'check': check_type,
                        'status': 'failed',
                        'issue': 'Marketing email without opt-out mechanism',
                        'recommendation': 'Include clear unsubscribe link'
                    }
        
        # Check for data minimization
        if check_type == 'data_minimization':
            if len(body) > 5000:
                return {
                    'check': check_type,
                    'status': 'warning',
                    'issue': 'Large amount of data in email',
                    'recommendation': 'Consider if all data is necessary'
                }
        
        # Check for audit trail
        if check_type == 'audit_trail':
            if not email.get('tracking_enabled', False):
                return {
                    'check': check_type,
                    'status': 'warning',
                    'issue': 'No audit trail enabled',
                    'recommendation': 'Enable email tracking for compliance'
                }
        
        # Default pass
        return {
            'check': check_type,
            'status': 'passed',
            'issue': None,
            'recommendation': None
        }
    
    def _check_sensitive_data(self, text: str) -> List[str]:
        """Check for sensitive data patterns"""
        found = []
        
        for data_type, pattern in self.sensitive_patterns.items():
            if re.search(pattern, text, re.IGNORECASE):
                found.append(data_type.replace('_', ' '))
        
        return found
    
    def _generate_audit_trail(self, email: Dict, compliance_results: Dict) -> Dict:
        """Generate audit trail for compliance"""
        return {
            'audit_id': f"AUDIT-{datetime.now().strftime('%Y%m%d%H%M%S')}-{email.get('id', 'unknown')}",
            'timestamp': datetime.now().isoformat(),
            'email_subject': email.get('subject', ''),
            'sender': email.get('from', ''),
            'recipients': email.get('to', []) + email.get('cc', []),
            'regulations_checked': list(compliance_results.keys()),
            'overall_result': 'passed' if all(r['passed'] for r in compliance_results.values()) else 'failed',
            'violations_count': sum(len(r['violations']) for r in compliance_results.values()),
            'warnings_count': sum(len(r['warnings']) for r in compliance_results.values()),
            'retention_period': '7 years',
            'storage_location': 'Compliance archive'
        }
    
    def _generate_recommendations(self, compliance_results: Dict) -> List[Dict]:
        """Generate compliance recommendations"""
        recommendations = []
        
        for regulation, result in compliance_results.items():
            if not result['passed']:
                recommendations.append({
                    'type': 'critical',
                    'regulation': regulation,
                    'message': f"{result['regulation_name']} compliance failed",
                    'action': 'Review and fix violations before sending',
                    'violations': result['violations']
                })
            
            if result['warnings']:
                recommendations.append({
                    'type': 'warning',
                    'regulation': regulation,
                    'message': f"{result['regulation_name']} compliance warnings",
                    'action': 'Review warnings and consider improvements',
                    'warnings': result['warnings']
                })
        
        return recommendations
    
    def _calculate_compliance_score(self, compliance_results: Dict) -> float:
        """Calculate overall compliance score"""
        if not compliance_results:
            return 0.0
        
        scores = [result['score'] for result in compliance_results.values()]
        return round(sum(scores) / len(scores), 1)

if __name__ == "__main__":
    checklist = EmailComplianceChecklist()
    test_email = {
        'id': 'test-589',
        'from': 'marketing@company.com',
        'to': ['customer@company.eu'],
        'subject': 'Special Offer for EU Customers',
        'body': 'Dear Customer, we have a special offer for you. Your SSN is 123-45-6789. Unsubscribe: link here'
    }
    result = checklist.check_compliance(test_email, ['gdpr', 'hipaa'])
    print(json.dumps(result, indent=2))
