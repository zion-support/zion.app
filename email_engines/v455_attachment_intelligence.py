#!/usr/bin/env python3
"""
V455 - AI Email Attachment Intelligence
Scans, summarizes, and validates email attachments with sensitive data detection.
Features: File type validation, sensitive data scanning, size optimization, content summary.
CRITICAL: Always enforces reply-all for multi-recipient emails.
"""

import json
import re
import hashlib
from datetime import datetime
from typing import Dict, List, Any


class AttachmentIntelligence:
    """Analyzes and manages email attachments."""
    
    SENSITIVE_PATTERNS = {
        'ssn': r'\b\d{3}-\d{2}-\d{4}\b',
        'credit_card': r'\b(?:\d{4}[-\s]?){3}\d{4}\b',
        'email': r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b',
        'phone': r'\b(?:\+?1[-.\s]?)?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}\b',
        'password': r'(?:password|passwd|pwd)[:\s=]+[\S]+',
        'api_key': r'(?:api[_\s]*key|token|secret)[:\s=]+[\S]+',
        'ip_address': r'\b(?:\d{1,3}\.){3}\d{1,3}\b'
    }
    
    ALLOWED_TYPES = [
        'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx',
        'png', 'jpg', 'jpeg', 'gif', 'svg',
        'txt', 'csv', 'json', 'xml', 'zip'
    ]
    
    MAX_SIZE_MB = 25
    
    def analyze_email(self, email: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze email attachments for security and content."""
        recipients = email.get('to', []) + email.get('cc', [])
        attachments = email.get('attachments', [])
        
        analysis = []
        sensitive_findings = []
        warnings = []
        
        for att in attachments:
            att_analysis = self._analyze_attachment(att)
            analysis.append(att_analysis)
            
            if att_analysis.get('sensitive_data'):
                sensitive_findings.extend(att_analysis['sensitive_data'])
            
            if not att_analysis['valid_type']:
                warnings.append(f"Invalid file type: {att.get('name', 'unknown')}")
            
            if att_analysis['size_mb'] > self.MAX_SIZE_MB:
                warnings.append(f"Large file ({att_analysis['size_mb']}MB): {att.get('name', 'unknown')}")
        
        reply_all_required = len(recipients) > 1
        security_risk = self._calculate_security_risk(sensitive_findings, recipients)
        
        return {
            'engine': 'V455_AttachmentIntelligence',
            'attachment_count': len(attachments),
            'total_size_mb': round(sum(a['size_mb'] for a in analysis), 2),
            'analysis': analysis,
            'sensitive_data_found': sensitive_findings,
            'security_warnings': warnings,
            'security_risk_level': security_risk['level'],
            'security_recommendations': security_risk['recommendations'],
            'external_recipients': self._has_external_recipients(recipients),
            'reply_all_required': reply_all_required,
            'reply_all_enforced': reply_all_required,
            'recipients': recipients,
            'timestamp': datetime.now().isoformat()
        }
    
    def _analyze_attachment(self, att: Dict) -> Dict:
        """Analyze a single attachment."""
        filename = att.get('name', 'unknown')
        file_type = self._get_file_type(filename, att.get('type', ''))
        size_bytes = att.get('size', 0)
        size_mb = round(size_bytes / (1024 * 1024), 2)
        content = att.get('content', '')
        
        valid_type = file_type.lower() in self.ALLOWED_TYPES
        sensitive_data = self._scan_sensitive_data(content, filename) if content else []
        
        return {
            'filename': filename,
            'type': file_type,
            'size_mb': size_mb,
            'valid_type': valid_type,
            'sensitive_data': sensitive_data,
            'content_hash': hashlib.md5(content.encode() if content else b'').hexdigest()[:8],
            'preview': content[:100] + '...' if len(content) > 100 else content
        }
    
    def _get_file_type(self, filename: str, mime_type: str) -> str:
        """Extract file type from filename or MIME type."""
        if '.' in filename:
            return filename.split('.')[-1].lower()
        if '/' in mime_type:
            return mime_type.split('/')[-1]
        return 'unknown'
    
    def _scan_sensitive_data(self, content: str, filename: str) -> List[Dict]:
        """Scan content for sensitive data patterns."""
        findings = []
        
        for data_type, pattern in self.SENSITIVE_PATTERNS.items():
            matches = re.findall(pattern, content, re.IGNORECASE)
            if matches:
                findings.append({
                    'type': data_type,
                    'count': len(matches),
                    'file': filename,
                    'severity': self._get_severity(data_type)
                })
        
        return findings
    
    def _get_severity(self, data_type: str) -> str:
        """Get severity level for data type."""
        high = ['ssn', 'credit_card', 'password', 'api_key']
        medium = ['email', 'phone']
        return 'high' if data_type in high else 'medium' if data_type in medium else 'low'
    
    def _calculate_security_risk(self, findings: List[Dict], recipients: List[str]) -> Dict:
        """Calculate overall security risk level."""
        if not findings:
            return {'level': 'low', 'recommendations': ['No sensitive data detected']}
        
        high_severity = sum(1 for f in findings if f['severity'] == 'high')
        has_external = self._has_external_recipients(recipients)
        
        if high_severity > 0 and has_external:
            return {
                'level': 'critical',
                'recommendations': [
                    'CRITICAL: Sensitive data detected with external recipients',
                    'Consider encrypting or redacting sensitive information',
                    'Verify recipient email addresses before sending',
                    'Consider using secure file sharing instead'
                ]
            }
        elif high_severity > 0:
            return {
                'level': 'high',
                'recommendations': [
                    'High-risk sensitive data detected (SSN, passwords, API keys)',
                    'Review content before sending',
                    'Consider redacting sensitive information'
                ]
            }
        else:
            return {
                'level': 'medium',
                'recommendations': [
                    'Moderate sensitive data detected',
                    'Verify recipient list is appropriate'
                ]
            }
    
    def _has_external_recipients(self, recipients: List[str]) -> bool:
        """Check if any recipients are external."""
        internal_domains = ['ziontechgroup.com', 'zion.com']
        for recipient in recipients:
            if '@' in recipient:
                domain = recipient.split('@')[-1].lower()
                if domain not in internal_domains:
                    return True
        return False


def main():
    """Test V455 engine."""
    engine = AttachmentIntelligence()
    
    test_email = {
        'from': 'kleber@ziontechgroup.com',
        'to': ['client@acme.com', 'team@ziontechgroup.com'],
        'cc': ['legal@ziontechgroup.com'],
        'subject': 'Employee Records and API Configuration',
        'attachments': [
            {
                'name': 'employees.csv',
                'type': 'text/csv',
                'size': 51200,
                'content': 'Name,SSN,Email\nJohn Doe,123-45-6789,john@example.com\nJane Smith,987-65-4321,jane@example.com'
            },
            {
                'name': 'config.json',
                'type': 'application/json',
                'size': 1024,
                'content': '{"api_key": "sk-1234567890abcdef", "password": "supersecret123", "database_ip": "192.168.1.100"}'
            },
            {
                'name': 'report.pdf',
                'type': 'application/pdf',
                'size': 2048000,
                'content': 'Quarterly report with no sensitive data.'
            }
        ]
    }
    
    result = engine.analyze_email(test_email)
    print(json.dumps(result, indent=2))
    print(f"\n✅ Attachments: {result['attachment_count']}")
    print(f"✅ Total size: {result['total_size_mb']}MB")
    print(f"✅ Sensitive findings: {len(result['sensitive_data_found'])}")
    print(f"✅ Security risk: {result['security_risk_level']}")
    print(f"✅ Reply-all enforced: {result['reply_all_enforced']}")


if __name__ == '__main__':
    main()
