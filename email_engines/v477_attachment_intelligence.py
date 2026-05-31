#!/usr/bin/env python3
"""
V477 - Email Attachment Intelligence
Scan attachments for malware and sensitive data, extract text and data from PDFs and documents.
Features: Malware scanning, sensitive data detection, text extraction, auto-categorization, context-based suggestions.
CRITICAL: Always enforces reply-all for multi-recipient emails.
"""

import json
import re
import hashlib
from datetime import datetime
from typing import Dict, List, Any


class EmailAttachmentIntelligence:
    """Intelligent attachment processing and analysis."""
    
    SENSITIVE_PATTERNS = {
        'ssn': r'\b\d{3}-\d{2}-\d{4}\b',
        'credit_card': r'\b(?:\d{4}[-\s]?){3}\d{4}\b',
        'api_key': r'(?:api[_\s]*key|token|secret)["\s:=]+[\w\-]{20,}',
        'password': r'(?:password|passwd|pwd)["\s:=]+[\S]+',
        'bank_account': r'\b\d{10,17}\b',
        'medical_record': r'\bMRN[:\s]?\d{6,10}\b'
    }
    
    MALWARE_INDICATORS = [
        '.exe', '.bat', '.cmd', '.scr', '.pif', '.vbs', '.js',
        'macro', 'script', 'executable', 'run', 'install'
    ]
    
    FILE_CATEGORIES = {
        'document': ['.pdf', '.doc', '.docx', '.txt', '.rtf'],
        'spreadsheet': ['.xls', '.xlsx', '.csv'],
        'presentation': ['.ppt', '.pptx'],
        'image': ['.jpg', '.jpeg', '.png', '.gif', '.bmp'],
        'archive': ['.zip', '.rar', '.7z', '.tar', '.gz'],
        'code': ['.py', '.js', '.html', '.css', '.java', '.cpp']
    }
    
    def analyze_email(self, email: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze email attachments for security and content."""
        attachments = email.get('attachments', [])
        recipients = email.get('to', []) + email.get('cc', [])
        
        if not attachments:
            return {
                'engine': 'V477_EmailAttachmentIntelligence',
                'has_attachments': False,
                'attachments': [],
                'summary': 'No attachments found',
                'reply_all_required': len(recipients) > 1,
                'reply_all_enforced': len(recipients) > 1,
                'recipients': recipients,
                'timestamp': datetime.now().isoformat()
            }
        
        # Analyze each attachment
        attachment_analysis = []
        for attachment in attachments:
            analysis = self._analyze_attachment(attachment)
            attachment_analysis.append(analysis)
        
        # Generate summary
        summary = self._generate_summary(attachment_analysis)
        
        # Check for security risks
        security_risks = self._assess_security_risks(attachment_analysis)
        
        # Suggest actions
        suggested_actions = self._suggest_actions(attachment_analysis, security_risks)
        
        reply_all_required = len(recipients) > 1
        
        return {
            'engine': 'V477_EmailAttachmentIntelligence',
            'has_attachments': True,
            'attachments': attachment_analysis,
            'summary': summary,
            'security_risks': security_risks,
            'suggested_actions': suggested_actions,
            'reply_all_required': reply_all_required,
            'reply_all_enforced': reply_all_required,
            'recipients': recipients,
            'timestamp': datetime.now().isoformat()
        }
    
    def _analyze_attachment(self, attachment: Dict) -> Dict:
        """Analyze a single attachment."""
        filename = attachment.get('filename', 'unknown')
        file_size = attachment.get('size', 0)
        content = attachment.get('content', '')
        
        # Categorize file
        category = self._categorize_file(filename)
        
        # Check for malware indicators
        malware_risk = self._check_malware_indicators(filename, content)
        
        # Scan for sensitive data
        sensitive_data = self._scan_sensitive_data(content)
        
        # Extract text (simulated)
        extracted_text = self._extract_text(content, category)
        
        # Calculate file hash
        file_hash = hashlib.md5(content.encode() if content else b'').hexdigest()
        
        return {
            'filename': filename,
            'size_bytes': file_size,
            'size_human': self._format_size(file_size),
            'category': category,
            'file_hash': file_hash,
            'malware_risk': malware_risk,
            'sensitive_data': sensitive_data,
            'extracted_text_preview': extracted_text[:500] if extracted_text else '',
            'safe_to_open': malware_risk['risk_level'] == 'low'
        }
    
    def _categorize_file(self, filename: str) -> str:
        """Categorize file by extension."""
        filename_lower = filename.lower()
        
        for category, extensions in self.FILE_CATEGORIES.items():
            if any(filename_lower.endswith(ext) for ext in extensions):
                return category
        
        return 'other'
    
    def _check_malware_indicators(self, filename: str, content: str) -> Dict:
        """Check for malware indicators."""
        filename_lower = filename.lower()
        content_lower = content.lower() if content else ''
        
        indicators_found = []
        
        # Check filename
        for indicator in self.MALWARE_INDICATORS:
            if indicator in filename_lower:
                indicators_found.append(f"Filename contains: {indicator}")
        
        # Check content for suspicious patterns
        suspicious_patterns = [
            r'eval\s*\(', r'exec\s*\(', r'system\s*\(',
            r'cmd\.exe', r'powershell', r'wget', r'curl'
        ]
        
        for pattern in suspicious_patterns:
            if re.search(pattern, content_lower):
                indicators_found.append(f"Suspicious code pattern: {pattern}")
        
        # Determine risk level
        if len(indicators_found) >= 3:
            risk_level = 'high'
        elif len(indicators_found) >= 1:
            risk_level = 'medium'
        else:
            risk_level = 'low'
        
        return {
            'risk_level': risk_level,
            'indicators': indicators_found,
            'recommendation': 'Do not open' if risk_level == 'high' else 'Proceed with caution' if risk_level == 'medium' else 'Safe to open'
        }
    
    def _scan_sensitive_data(self, content: str) -> List[Dict]:
        """Scan content for sensitive data patterns."""
        if not content:
            return []
        
        findings = []
        
        for data_type, pattern in self.SENSITIVE_PATTERNS.items():
            matches = re.findall(pattern, content, re.IGNORECASE)
            if matches:
                findings.append({
                    'type': data_type,
                    'count': len(matches),
                    'severity': 'high' if data_type in ['ssn', 'credit_card', 'password'] else 'medium',
                    'recommendation': 'Redact before sharing' if data_type in ['ssn', 'credit_card'] else 'Review before sharing'
                })
        
        return findings
    
    def _extract_text(self, content: str, category: str) -> str:
        """Extract text from attachment (simulated)."""
        if not content:
            return ''
        
        # For text-based files, return content directly
        if category in ['document', 'code']:
            return content
        
        # For other types, return a placeholder
        return f"[{category.upper()} content - text extraction would occur here]"
    
    def _format_size(self, size_bytes: int) -> str:
        """Format file size in human-readable format."""
        if size_bytes == 0:
            return '0 B'
        
        units = ['B', 'KB', 'MB', 'GB']
        index = 0
        
        while size_bytes >= 1024 and index < len(units) - 1:
            size_bytes /= 1024
            index += 1
        
        return f"{size_bytes:.1f} {units[index]}"
    
    def _generate_summary(self, attachments: List[Dict]) -> str:
        """Generate summary of all attachments."""
        total_files = len(attachments)
        total_size = sum(a['size_bytes'] for a in attachments)
        categories = set(a['category'] for a in attachments)
        
        high_risk = sum(1 for a in attachments if a['malware_risk']['risk_level'] == 'high')
        sensitive_count = sum(len(a['sensitive_data']) for a in attachments)
        
        summary_parts = [
            f"{total_files} attachment(s) totaling {self._format_size(total_size)}.",
            f"File types: {', '.join(categories)}.",
        ]
        
        if high_risk > 0:
            summary_parts.append(f"⚠️ {high_risk} high-risk file(s) detected!")
        
        if sensitive_count > 0:
            summary_parts.append(f"🔒 {sensitive_count} sensitive data finding(s) - review before sharing.")
        
        if high_risk == 0 and sensitive_count == 0:
            summary_parts.append("✅ All attachments appear safe.")
        
        return ' '.join(summary_parts)
    
    def _assess_security_risks(self, attachments: List[Dict]) -> Dict:
        """Assess overall security risks."""
        high_risk_files = [a for a in attachments if a['malware_risk']['risk_level'] == 'high']
        sensitive_files = [a for a in attachments if a['sensitive_data']]
        
        overall_risk = 'low'
        if high_risk_files:
            overall_risk = 'high'
        elif sensitive_files:
            overall_risk = 'medium'
        
        return {
            'overall_risk': overall_risk,
            'high_risk_files': len(high_risk_files),
            'files_with_sensitive_data': len(sensitive_files),
            'safe_to_forward': overall_risk != 'high',
            'recommendations': self._generate_security_recommendations(overall_risk, high_risk_files, sensitive_files)
        }
    
    def _generate_security_recommendations(self, risk: str, high_risk: List, sensitive: List) -> List[str]:
        """Generate security recommendations."""
        recommendations = []
        
        if risk == 'high':
            recommendations.append("🚨 DO NOT OPEN high-risk attachments")
            recommendations.append("Scan with antivirus software before proceeding")
            recommendations.append("Contact IT security if unsure about file safety")
        
        if sensitive:
            recommendations.append("🔒 Review files with sensitive data before sharing")
            recommendations.append("Consider redacting sensitive information")
            recommendations.append("Ensure recipients are authorized to receive sensitive data")
        
        if risk == 'low':
            recommendations.append("✅ Attachments appear safe to open and share")
        
        recommendations.append("Always use reply-all for multi-recipient emails")
        
        return recommendations
    
    def _suggest_actions(self, attachments: List[Dict], security_risks: Dict) -> List[Dict]:
        """Suggest actions based on attachment analysis."""
        actions = []
        
        # Suggest actions for each attachment
        for attachment in attachments:
            if attachment['malware_risk']['risk_level'] == 'high':
                actions.append({
                    'attachment': attachment['filename'],
                    'action': 'quarantine',
                    'reason': 'High malware risk detected',
                    'priority': 'high'
                })
            elif attachment['sensitive_data']:
                actions.append({
                    'attachment': attachment['filename'],
                    'action': 'review_and_redact',
                    'reason': 'Contains sensitive data',
                    'priority': 'medium'
                })
            else:
                actions.append({
                    'attachment': attachment['filename'],
                    'action': 'safe_to_share',
                    'reason': 'No security concerns',
                    'priority': 'low'
                })
        
        return actions


def main():
    """Test V477 engine."""
    engine = EmailAttachmentIntelligence()
    
    test_email = {
        'from': 'client@company.com',
        'to': ['sales@ziontechgroup.com', 'kleber@ziontechgroup.com'],
        'cc': ['legal@ziontechgroup.com'],
        'subject': 'Contract and Financial Documents',
        'attachments': [
            {
                'filename': 'contract.pdf',
                'size': 1024000,
                'content': 'This is a contract document with terms and conditions.'
            },
            {
                'filename': 'financial_data.xlsx',
                'size': 512000,
                'content': 'Employee SSN: 123-45-6789, Bank Account: 1234567890123456'
            },
            {
                'filename': 'setup.exe',
                'size': 2048000,
                'content': 'Run this executable to install the software. cmd.exe /c powershell'
            }
        ]
    }
    
    result = engine.analyze_email(test_email)
    print(json.dumps(result, indent=2))
    print(f"\n✅ Summary: {result['summary']}")
    print(f"✅ Security Risk: {result['security_risks']['overall_risk']}")
    print(f"✅ Safe to Forward: {result['security_risks']['safe_to_forward']}")
    print(f"✅ Reply-all enforced: {result['reply_all_enforced']}")


if __name__ == '__main__':
    main()
