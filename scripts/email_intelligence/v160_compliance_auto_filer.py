#!/usr/bin/env python3
"""
V160 - AI Email Compliance Auto-Filer Pro
Automatically classifies and files emails into regulatory retention buckets
(FINRA, HIPAA, GDPR, SOX, PCI-DSS) with legal hold management.
"""

import json
import re
import hashlib
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
from collections import defaultdict
from enum import Enum


class RegulatoryFramework(Enum):
    FINRA = "finra"
    HIPAA = "hipaa"
    GDPR = "gdpr"
    SOX = "sox"
    PCI_DSS = "pci_dss"
    CCPA = "ccpa"
    FERPA = "ferpa"
    GLBA = "glba"


class ComplianceAutoFilerPro:
    """AI-powered compliance auto-classification and filing system."""

    def __init__(self):
        self.retention_policies = self._build_retention_policies()
        self.classification_rules = self._build_classification_rules()
        self.legal_holds = defaultdict(list)
        self.filing_log = []
        self.audit_trail = []

    def _build_retention_policies(self) -> Dict[str, Dict]:
        """Build retention policies per framework."""
        return {
            'finra': {'retention_years': 6, 'description': 'Financial Industry Regulatory Authority', 'categories': ['trades', 'communications', 'complaints']},
            'hipaa': {'retention_years': 6, 'description': 'Health Insurance Portability & Accountability', 'categories': ['phi', 'treatment', 'billing']},
            'gdpr': {'retention_years': 0, 'description': 'General Data Protection Regulation (right to erasure)', 'categories': ['personal_data', 'consent', 'processing']},
            'sox': {'retention_years': 7, 'description': 'Sarbanes-Oxley Act', 'categories': ['financial', 'audit', 'internal_controls']},
            'pci_dss': {'retention_years': 1, 'description': 'Payment Card Industry Data Security Standard', 'categories': ['cardholder_data', 'transactions']},
            'ccpa': {'retention_years': 0, 'description': 'California Consumer Privacy Act', 'categories': ['consumer_data', 'opt_out']},
            'ferpa': {'retention_years': 5, 'description': 'Family Educational Rights & Privacy Act', 'categories': ['education_records']},
            'glba': {'retention_years': 5, 'description': 'Gramm-Leach-Bliley Act', 'categories': ['financial_privacy']}
        }

    def _build_classification_rules(self) -> Dict[str, Dict]:
        """Build classification rules per framework."""
        return {
            'finra': {
                'keywords': ['trade', 'securities', 'broker', 'investment', 'portfolio', 'stock', 'bond', 'mutual fund', '401k', 'IRA', 'commission'],
                'patterns': [r'\b[A-Z]{1,5}\b.*(?:buy|sell|trade)', r'(?:CUSIP|ISIN)[:\s]*\w+'],
                'senders': ['@finra.org', '@sec.gov', '@broker']
            },
            'hipaa': {
                'keywords': ['patient', 'diagnosis', 'treatment', 'prescription', 'medical record', 'PHI', 'health plan', 'provider', 'ICD-10', 'CPT', 'HIPAA'],
                'patterns': [r'\b\d{3}-\d{2}-\d{4}\b', r'\b[A-Z]\d{2,4}\.\d{0,2}\b'],
                'senders': ['@hospital', '@clinic', '@health', '@medical']
            },
            'gdpr': {
                'keywords': ['personal data', 'consent', 'data subject', 'right to erasure', 'data processor', 'DPO', 'privacy policy', 'opt-out', 'unsubscribe'],
                'patterns': [r'\b(?:EU|EEA)\b.*(?:citizen|resident)', r'(?:GDPR|Article\s+\d+)'],
                'senders': ['@ico.org.uk', '@dpa', '@privacy']
            },
            'sox': {
                'keywords': ['audit', 'financial statement', 'internal controls', 'quarterly report', '10-K', '10-Q', 'revenue recognition', 'material weakness'],
                'patterns': [r'(?:10-[KQ]|8-K|S-1)', r'(?:SOX|Section\s+302|Section\s+404)'],
                'senders': ['@audit', '@accounting', '@finance']
            },
            'pci_dss': {
                'keywords': ['credit card', 'cardholder', 'PAN', 'CVV', 'CVC', 'payment', 'merchant', 'acquiring', 'PIN', 'tokenization'],
                'patterns': [r'\b(?:\d{4}[-\s]?){3}\d{4}\b', r'\b\d{3,4}\b.*(?:CVV|CVC|security code)'],
                'senders': ['@payment', '@stripe', '@paypal', '@merchant']
            }
        }

    def classify_and_file(self, email: Dict[str, Any]) -> Dict[str, Any]:
        """Classify email and file into appropriate retention bucket."""
        content = f"{email.get('subject', '')} {email.get('body', '')}"
        sender = email.get('from', '')

        # Multi-framework classification
        classifications = self._classify_multi_framework(content, sender)

        # Determine primary classification
        primary = self._determine_primary_classification(classifications)

        # Check for legal holds
        legal_hold_status = self._check_legal_holds(email, classifications)

        # Calculate retention period
        retention = self._calculate_retention(primary, email)

        # Generate filing record
        filing_record = {
            'filing_id': hashlib.md5(f"{sender}{email.get('subject', '')}{datetime.now().isoformat()}".encode()).hexdigest()[:12],
            'timestamp': datetime.now().isoformat(),
            'email_from': sender,
            'email_subject': email.get('subject', '')[:100],
            'classifications': classifications,
            'primary_framework': primary.get('framework', 'none'),
            'primary_category': primary.get('category', 'general'),
            'confidence_score': primary.get('confidence', 0),
            'retention_period': retention,
            'legal_hold': legal_hold_status,
            'storage_location': self._determine_storage_location(primary),
            'encryption_required': self._requires_encryption(primary),
            'access_restrictions': self._determine_access_restrictions(primary),
            'reply_all_compliance_check': True,
            'compliance_flags': self._generate_compliance_flags(classifications)
        }

        # Log filing
        self._log_filing(filing_record)

        return filing_record

    def _classify_multi_framework(self, content: str, sender: str) -> List[Dict[str, Any]]:
        """Classify across all frameworks."""
        classifications = []
        content_lower = content.lower()

        for framework, rules in self.classification_rules.items():
            score = 0
            matched_keywords = []
            matched_patterns = []

            # Keyword matching
            for keyword in rules['keywords']:
                if keyword.lower() in content_lower:
                    score += 10
                    matched_keywords.append(keyword)

            # Pattern matching
            for pattern in rules.get('patterns', []):
                if re.search(pattern, content, re.IGNORECASE):
                    score += 20
                    matched_patterns.append(pattern)

            # Sender matching
            for sender_pattern in rules.get('senders', []):
                if sender_pattern in sender.lower():
                    score += 15

            if score > 0:
                # Determine category
                category = self._determine_category(framework, matched_keywords)
                confidence = min(score / 50, 1.0)

                classifications.append({
                    'framework': framework,
                    'category': category,
                    'confidence': round(confidence, 2),
                    'score': score,
                    'matched_keywords': matched_keywords,
                    'matched_patterns': matched_patterns
                })

        # Sort by confidence
        classifications.sort(key=lambda x: x['confidence'], reverse=True)
        return classifications

    def _determine_category(self, framework: str, keywords: List[str]) -> str:
        """Determine specific category within framework."""
        categories = self.retention_policies.get(framework, {}).get('categories', ['general'])
        keyword_lower = ' '.join(keywords).lower()

        for cat in categories:
            if cat.replace('_', ' ') in keyword_lower:
                return cat

        return categories[0] if categories else 'general'

    def _determine_primary_classification(self, classifications: List[Dict]) -> Dict[str, Any]:
        """Determine primary classification."""
        if not classifications:
            return {'framework': 'none', 'category': 'general', 'confidence': 0}

        # Priority: higher confidence wins, then framework priority
        framework_priority = ['hipaa', 'pci_dss', 'finra', 'gdpr', 'sox', 'ccpa', 'ferpa', 'glba']

        top = classifications[0]
        for cls in classifications[1:]:
            if cls['confidence'] > top['confidence']:
                top = cls
            elif cls['confidence'] == top['confidence']:
                if framework_priority.index(cls['framework']) < framework_priority.index(top['framework']):
                    top = cls

        return top

    def _check_legal_holds(self, email: Dict, classifications: List[Dict]) -> Dict[str, Any]:
        """Check if email is subject to legal holds."""
        sender = email.get('from', '')
        subject = email.get('subject', '').lower()

        active_holds = []
        for hold_id, hold_info in self.legal_holds.items():
            # Check if sender or subject matches hold criteria
            if any(sender.lower() in s.lower() for s in hold_info.get('senders', [])):
                active_holds.append(hold_id)
            if any(kw in subject for kw in hold_info.get('keywords', [])):
                active_holds.append(hold_id)

        return {
            'is_on_hold': len(active_holds) > 0,
            'hold_ids': active_holds,
            'retention_override': True if active_holds else False
        }

    def _calculate_retention(self, classification: Dict, email: Dict) -> Dict[str, Any]:
        """Calculate retention period."""
        framework = classification.get('framework', 'none')
        policy = self.retention_policies.get(framework, {})

        if framework == 'none':
            years = 3  # Default
        elif framework in ['gdpr', 'ccpa']:
            years = 0  # Right to erasure
        else:
            years = policy.get('retention_years', 3)

        email_date = email.get('date', datetime.now().isoformat())
        try:
            base_date = datetime.fromisoformat(email_date)
        except:
            base_date = datetime.now()

        if years == 0:
            expiry = None  # Subject to erasure requests
        else:
            expiry = base_date + timedelta(days=years * 365)

        return {
            'retention_years': years,
            'retention_days': years * 365 if years > 0 else None,
            'expiry_date': expiry.isoformat() if expiry else 'subject_to_erasure',
            'framework': framework,
            'policy': policy.get('description', 'Standard retention')
        }

    def _determine_storage_location(self, classification: Dict) -> str:
        """Determine storage location based on classification."""
        framework = classification.get('framework', 'none')
        locations = {
            'hipaa': 'encrypted_hipaa_vault',
            'pci_dss': 'pci_compliant_vault',
            'finra': 'finra_archive',
            'gdpr': 'eu_data_center',
            'sox': 'sox_compliant_storage',
            'none': 'standard_archive'
        }
        return locations.get(framework, 'standard_archive')

    def _requires_encryption(self, classification: Dict) -> bool:
        """Check if encryption is required."""
        return classification.get('framework') in ['hipaa', 'pci_dss', 'gdpr', 'finra', 'glba']

    def _determine_access_restrictions(self, classification: Dict) -> List[str]:
        """Determine access restrictions."""
        framework = classification.get('framework', 'none')
        restrictions = {
            'hipaa': ['healthcare_staff', 'compliance_officer'],
            'pci_dss': ['payment_team', 'security_team'],
            'finra': ['compliance_team', 'legal_team'],
            'gdpr': ['dpo', 'data_team'],
            'sox': ['audit_team', 'finance_team'],
            'none': ['all_staff']
        }
        return restrictions.get(framework, ['all_staff'])

    def _generate_compliance_flags(self, classifications: List[Dict]) -> List[str]:
        """Generate compliance flags for auditing."""
        flags = []
        for cls in classifications:
            if cls['confidence'] > 0.7:
                flags.append(f"{cls['framework']}_high_confidence")
            elif cls['confidence'] > 0.4:
                flags.append(f"{cls['framework']}_medium_confidence")
        return flags

    def _log_filing(self, record: Dict):
        """Log filing for audit trail."""
        self.filing_log.append(record)
        self.audit_trail.append({
            'action': 'file_email',
            'filing_id': record['filing_id'],
            'framework': record['primary_framework'],
            'timestamp': record['timestamp']
        })

    def place_legal_hold(self, hold_id: str, criteria: Dict[str, Any]) -> Dict[str, Any]:
        """Place a legal hold on matching emails."""
        self.legal_holds[hold_id] = {
            'created_at': datetime.now().isoformat(),
            'criteria': criteria,
            'senders': criteria.get('senders', []),
            'keywords': criteria.get('keywords', []),
            'reason': criteria.get('reason', 'Legal hold'),
            'status': 'active'
        }
        return {'hold_id': hold_id, 'status': 'active'}

    def release_legal_hold(self, hold_id: str) -> Dict[str, Any]:
        """Release a legal hold."""
        if hold_id in self.legal_holds:
            self.legal_holds[hold_id]['status'] = 'released'
            self.legal_holds[hold_id]['released_at'] = datetime.now().isoformat()
            return {'hold_id': hold_id, 'status': 'released'}
        return {'error': 'Hold not found'}

    def get_compliance_report(self) -> Dict[str, Any]:
        """Generate compliance report."""
        framework_counts = defaultdict(int)
        for record in self.filing_log:
            framework_counts[record['primary_framework']] += 1

        return {
            'total_filed': len(self.filing_log),
            'by_framework': dict(framework_counts),
            'active_holds': sum(1 for h in self.legal_holds.values() if h['status'] == 'active'),
            'encryption_required': sum(1 for r in self.filing_log if r['encryption_required']),
            'recent_filings': self.filing_log[-10:]
        }


def process_compliance_filing(email_data: Dict[str, Any]) -> Dict[str, Any]:
    """Main entry point for compliance auto-filing."""
    filer = ComplianceAutoFilerPro()
    return filer.classify_and_file(email_data)


if __name__ == '__main__':
    test_email = {
        'from': 'patient@hospital.org',
        'subject': 'Medical Record Request - HIPAA',
        'body': 'I need a copy of my medical records including diagnosis and treatment history. My patient ID is P123456. Please process under HIPAA guidelines.',
        'date': '2024-01-15T10:00:00'
    }
    result = process_compliance_filing(test_email)
    print(json.dumps(result, indent=2))
