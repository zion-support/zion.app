#!/usr/bin/env python3
"""
V939: Email Data Privacy Scanner
Advanced scanning for data privacy violations beyond basic PII.
Detects trade secrets, confidential business information, insider trading risks,
and intellectual property leaks in email content.
"""

import re
from datetime import datetime
from typing import Dict, List, Any, Optional


class DataPrivacyScanner:
    """Advanced data privacy and confidentiality scanner for emails."""

    def __init__(self):
        self.privacy_categories = {
            'trade_secret': {
                'patterns': [
                    r'(?:proprietary|trade secret|confidential formula|secret recipe)',
                    r'(?:internal algorithm|proprietary method|unique process)',
                    r'(?:competitive advantage|secret sauce|core IP)'
                ],
                'risk': 'critical',
                'fine': 'Up to $5M (DTSA)'
            },
            'insider_trading': {
                'patterns': [
                    r'(?:merger|acquisition|takeover)\s+(?:before|prior to)\s+(?:announcement|public)',
                    r'(?:earnings|revenue)\s+(?:beat|miss|exceed)\s+(?:expectations?|forecast)',
                    r'(?:material\s+)?non[- ]?public\s+information',
                    r'(?:buy|sell|trade)\s+(?:stock|shares)\s+(?:before|prior)',
                    r'(?:going public|IPO)\s+(?:next|this)\s+(?:week|month)'
                ],
                'risk': 'critical',
                'fine': 'Up to $5M + imprisonment (SEC)'
            },
            'intellectual_property': {
                'patterns': [
                    r'(?:patent\s+pending|patent\s+application|patent\s+filed)',
                    r'(?:unpublished\s+)?(?:research|study|findings)',
                    r'(?:prototype|proof\s+of\s+concept|POC)\s+(?:for|of)',
                    r'(?:source\s+code|codebase|repository)\s+(?:access|attached|shared)'
                ],
                'risk': 'high',
                'fine': 'Varies by jurisdiction'
            },
            'financial_data': {
                'patterns': [
                    r'(?:unaudited|preliminary)\s+(?:financial|revenue|earnings)',
                    r'(?:budget|forecast|projection)\s+(?:for|FY|Q\d)',
                    r'(?:salary|compensation|bonus)\s+(?:details?|information|breakdown)',
                    r'(?:bank\s+account|routing\s+number|wire\s+transfer)\s+(?:details?|info)'
                ],
                'risk': 'high',
                'fine': 'Up to $1M (SOX/GLBA)'
            },
            'health_data': {
                'patterns': [
                    r'(?:patient|medical)\s+(?:record|history|diagnosis|treatment)',
                    r'(?:prescription|medication|dosage)',
                    r'(?:health\s+insurance|medical\s+claim|ICD|CPT)\s+(?:code|number)'
                ],
                'risk': 'critical',
                'fine': 'Up to $1.5M per violation (HIPAA)'
            },
            'legal_privilege': {
                'patterns': [
                    r'(?:attorney[- ]client|legal)\s+privilege',
                    r'(?:privileged\s+and\s+confidential)',
                    r'(?:work\s+product\s+doctrine)',
                    r'(?:prepared\s+in\s+anticipation\s+of\s+litigation)'
                ],
                'risk': 'high',
                'fine': 'Waiver of privilege'
            },
            'hr_confidential': {
                'patterns': [
                    r'(?:termination|firing|layoff|reduction\s+in\s+force)',
                    r'(?:performance\s+(?:improvement\s+)?plan|PIP)',
                    r'(?:disciplinary\s+action|written\s+warning)',
                    r'(?:salary\s+adjustment|raise|promotion)\s+(?:for|of)\s+\w+'
                ],
                'risk': 'medium',
                'fine': 'Employment law liability'
            },
            'customer_data': {
                'patterns': [
                    r'(?:customer|client)\s+(?:list|database|roster)',
                    r'(?:account\s+number|customer\s+ID)\s*[:#]?\s*\d{4,}',
                    r'(?:credit\s+card|payment)\s+(?:info|details?|number)'
                ],
                'risk': 'high',
                'fine': 'Up to 4% global revenue (GDPR)'
            }
        }

        self.scan_history = []

    def scan_email(self, email_data: Dict[str, Any]) -> Dict[str, Any]:
        """Scan email for data privacy violations."""
        subject = email_data.get('subject', '')
        body = email_data.get('body', '')
        attachments = email_data.get('attachments', [])
        recipients = email_data.get('recipients', [])
        cc_list = email_data.get('cc', [])
        bcc_list = email_data.get('bcc', [])

        text = f"{subject} {body}"
        all_recipients = recipients + cc_list + bcc_list

        # Scan for privacy violations
        violations = []
        for category, config in self.privacy_categories.items():
            category_violations = self._scan_category(text, category, config)
            violations.extend(category_violations)

        # Scan attachments for sensitive file types
        attachment_risks = self._scan_attachments(attachments)
        violations.extend(attachment_risks)

        # Check recipient appropriateness
        recipient_risks = self._check_recipients(all_recipients, violations, cc_list, bcc_list)
        violations.extend(recipient_risks)

        # Calculate overall risk score
        risk_score = self._calculate_risk_score(violations)

        # Determine if email should be blocked
        should_block = risk_score >= 80

        # Generate recommendations
        recommendations = self._generate_recommendations(violations, risk_score, all_recipients)

        # Redact sensitive content
        redacted_text = self._redact_sensitive(text)

        # Track scan
        self.scan_history.append({
            'timestamp': datetime.now().isoformat(),
            'violations': len(violations),
            'risk_score': risk_score,
            'blocked': should_block
        })

        return {
            'risk_score': risk_score,
            'risk_level': self._score_to_level(risk_score),
            'violations': violations,
            'violation_count': len(violations),
            'should_block': should_block,
            'recommendations': recommendations,
            'redacted_text': redacted_text,
            'recipient_count': len(all_recipients),
            'external_recipients': self._count_external(all_recipients),
            'reply_all_required': len(recipients) > 1,
            'safe_to_send': risk_score < 50
        }

    def _scan_category(self, text: str, category: str, config: Dict) -> List[Dict[str, Any]]:
        """Scan text for a specific privacy category."""
        violations = []
        for pattern in config['patterns']:
            matches = re.finditer(pattern, text, re.IGNORECASE)
            for match in matches:
                # Get surrounding context
                start = max(0, match.start() - 30)
                end = min(len(text), match.end() + 30)
                context = text[start:end].strip()

                violations.append({
                    'category': category,
                    'risk': config['risk'],
                    'matched_text': match.group(0),
                    'context': f"...{context}...",
                    'potential_fine': config['fine'],
                    'recommendation': self._category_recommendation(category)
                })
        return violations

    def _scan_attachments(self, attachments: List[Dict]) -> List[Dict[str, Any]]:
        """Scan attachments for sensitive file types."""
        risks = []
        sensitive_extensions = {
            '.key': 'Private key file',
            '.pem': 'Certificate/key file',
            '.p12': 'PKCS12 certificate',
            '.sql': 'Database dump',
            '.bak': 'Backup file',
            '.env': 'Environment variables',
            '.config': 'Configuration file'
        }

        for att in attachments:
            name = att.get('name', '').lower()
            for ext, desc in sensitive_extensions.items():
                if name.endswith(ext):
                    risks.append({
                        'category': 'sensitive_attachment',
                        'risk': 'high',
                        'matched_text': att.get('name', 'unknown'),
                        'context': f"Sensitive file type: {desc}",
                        'potential_fine': 'Data breach liability',
                        'recommendation': f"Remove {name} - {desc} should not be sent via email"
                    })
        return risks

    def _check_recipients(self, recipients: List[str], violations: List[Dict],
                          cc_list: List[str], bcc_list: List[str]) -> List[Dict[str, Any]]:
        """Check if recipients are appropriate for the content."""
        risks = []

        # Check for external recipients with sensitive content
        external = [r for r in recipients if self._is_external(r)]
        if external and violations:
            high_risk = [v for v in violations if v['risk'] in ['critical', 'high']]
            if high_risk:
                risks.append({
                    'category': 'external_sharing',
                    'risk': 'high',
                    'matched_text': f"{len(external)} external recipients",
                    'context': f"Sensitive content shared with: {', '.join(external[:3])}",
                    'potential_fine': 'Data breach notification required',
                    'recommendation': 'Remove external recipients or encrypt content'
                })

        # Check BCC usage with sensitive content
        if bcc_list and violations:
            risks.append({
                'category': 'bcc_sensitive',
                'risk': 'medium',
                'matched_text': f"{len(bcc_list)} BCC recipients",
                'context': 'BCC recipients can see sensitive content without others knowing',
                'potential_fine': 'Trust and compliance issue',
                'recommendation': 'Consider if BCC is appropriate for this sensitive content'
            })

        return risks

    def _is_external(self, email: str) -> bool:
        """Check if email is external (simple heuristic)."""
        domain = email.split('@')[-1].lower() if '@' in email else ''
        internal_domains = ['company.com', 'internal.com', 'corp.local']
        return domain not in internal_domains

    def _count_external(self, recipients: List[str]) -> int:
        """Count external recipients."""
        return sum(1 for r in recipients if self._is_external(r))

    def _calculate_risk_score(self, violations: List[Dict]) -> int:
        """Calculate overall risk score."""
        score = 0
        risk_weights = {'critical': 40, 'high': 25, 'medium': 15, 'low': 5}

        for v in violations:
            score += risk_weights.get(v['risk'], 5)

        return min(100, score)

    def _score_to_level(self, score: int) -> str:
        """Convert score to risk level."""
        if score >= 80:
            return 'CRITICAL - Block Recommended'
        elif score >= 60:
            return 'HIGH - Review Required'
        elif score >= 40:
            return 'MEDIUM - Caution Advised'
        elif score >= 20:
            return 'LOW - Minor Issues'
        return 'SAFE'

    def _category_recommendation(self, category: str) -> str:
        """Get recommendation for a category."""
        recommendations = {
            'trade_secret': 'Encrypt or use secure file sharing. Never send via plain email.',
            'insider_trading': 'STOP - Consult legal counsel before sending. Potential SEC violation.',
            'intellectual_property': 'Use NDA-protected channels. Mark as confidential.',
            'financial_data': 'Use encrypted email or secure portal. Restrict recipients.',
            'health_data': 'HIPAA violation risk. Use HIPAA-compliant messaging only.',
            'legal_privilege': 'Maintain privilege. Limit distribution to legal team only.',
            'hr_confidential': 'Restrict to HR and management. Use secure HR systems.',
            'customer_data': 'GDPR/CCPA risk. Anonymize or use secure data room.'
        }
        return recommendations.get(category, 'Review before sending')

    def _generate_recommendations(self, violations: List[Dict], score: int,
                                   recipients: List[str]) -> List[str]:
        """Generate actionable recommendations."""
        recs = []

        if score >= 80:
            recs.append("🚫 DO NOT SEND - Email contains critical privacy violations")
            recs.append("📞 Discuss sensitive matters via phone or in person")

        if score >= 50:
            recs.append("🔒 Consider encrypting this email before sending")
            recs.append("👥 Review recipient list - remove unnecessary parties")

        categories_found = set(v['category'] for v in violations)
        for cat in categories_found:
            recs.append(f"⚠️ {cat.replace('_', ' ').title()}: {self._category_recommendation(cat)}")

        if not recs:
            recs.append("✅ Email appears safe to send")

        return recs

    def _redact_sensitive(self, text: str) -> str:
        """Redact sensitive information from text."""
        redacted = text
        # Redact credit card numbers
        redacted = re.sub(r'\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b', '[CARD REDACTED]', redacted)
        # Redact SSNs
        redacted = re.sub(r'\b\d{3}-\d{2}-\d{4}\b', '[SSN REDACTED]', redacted)
        # Redact bank accounts
        redacted = re.sub(r'(?:account|routing)\s*(?:#|number|no)?\.?\s*:?\s*\d{6,}', '[ACCOUNT REDACTED]', redacted, flags=re.IGNORECASE)
        return redacted


def main():
    scanner = DataPrivacyScanner()

    test_emails = [
        {
            'subject': 'Confidential: Q4 Merger Details',
            'body': 'Team, the merger with TechCorp is happening next week. Stock price should beat expectations significantly. Buy shares before the announcement. The proprietary algorithm we developed gives us competitive advantage. Patient records show 15% improvement. Account number: 1234567890.',
            'recipients': ['team@company.com', 'investor@external.com'],
            'cc': ['legal@company.com'],
            'bcc': [],
            'attachments': [{'name': 'financials.sql', 'size_mb': 5}]
        },
        {
            'subject': 'Weekly update',
            'body': 'Hi team, here is the weekly status update. All projects on track. Next meeting Tuesday at 10am.',
            'recipients': ['team@company.com'],
            'cc': [],
            'bcc': [],
            'attachments': []
        }
    ]

    print("=" * 60)
    print("V939: Data Privacy Scanner - Test Results")
    print("=" * 60)

    for email in test_emails:
        result = scanner.scan_email(email)
        print(f"\nSubject: {email['subject'][:50]}")
        print(f"Risk Score: {result['risk_score']}/100 ({result['risk_level']})")
        print(f"Violations: {result['violation_count']}")
        print(f"Safe to Send: {result['safe_to_send']}")
        print(f"Should Block: {result['should_block']}")
        print(f"External Recipients: {result['external_recipients']}")
        print(f"Reply All: {result['reply_all_required']}")
        print("Recommendations:")
        for r in result['recommendations'][:4]:
            print(f"  {r}")
        if result['violations']:
            print("Top Violations:")
            for v in result['violations'][:3]:
                print(f"  [{v['risk'].upper()}] {v['category']}: {v['matched_text'][:40]}")

    print(f"\n✅ V939 Data Privacy Scanner: OPERATIONAL")


if __name__ == '__main__':
    main()
