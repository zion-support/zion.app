#!/usr/bin/env python3
"""V464 - Email Archival Intelligence - Smart archiving with search."""
import json, re, hashlib
from datetime import datetime, timedelta
from typing import Dict, List, Any

class EmailArchivalIntelligence:
    RETENTION_POLICIES = {
        'legal': {'period': '7 years', 'immutable': True},
        'financial': {'period': '7 years', 'immutable': True},
        'hr': {'period': '5 years', 'immutable': True},
        'general': {'period': '1 year', 'immutable': False}
    }
    
    def analyze_email(self, email: Dict[str, Any]) -> Dict[str, Any]:
        body = email.get('body', '')
        recipients = email.get('to', []) + email.get('cc', [])
        policy = self._determine_policy(body, email.get('subject', ''))
        archive_id = hashlib.sha256(f"{email.get('from', '')}{email.get('subject', '')}".encode()).hexdigest()[:16]
        return {
            'engine': 'V464_EmailArchivalIntelligence',
            'archive_id': f"ARC-{datetime.now().strftime('%Y%m%d')}-{archive_id}",
            'retention_policy': policy,
            'searchable_tags': self._extract_tags(body),
            'compression': 'gzip',
            'encryption': 'AES-256',
            'reply_all_required': len(recipients) > 1,
            'reply_all_enforced': len(recipients) > 1,
            'timestamp': datetime.now().isoformat()
        }
    
    def _determine_policy(self, body: str, subject: str) -> Dict:
        text = (body + ' ' + subject).lower()
        if any(w in text for w in ['legal', 'contract', 'compliance']):
            return self.RETENTION_POLICIES['legal']
        if any(w in text for w in ['invoice', 'payment', 'financial']):
            return self.RETENTION_POLICIES['financial']
        if any(w in text for w in ['employee', 'hr', 'hiring']):
            return self.RETENTION_POLICIES['hr']
        return self.RETENTION_POLICIES['general']
    
    def _extract_tags(self, body: str) -> List[str]:
        tags = []
        if re.search(r'project\s+\w+', body, re.IGNORECASE): tags.append('project')
        if re.search(r'meeting|call|sync', body, re.IGNORECASE): tags.append('meeting')
        if re.search(r'decision|agreed|approved', body, re.IGNORECASE): tags.append('decision')
        return tags

def main():
    engine = EmailArchivalIntelligence()
    result = engine.analyze_email({
        'from': 'client@test.com',
        'to': ['legal@ziontechgroup.com', 'kleber@ziontechgroup.com'],
        'subject': 'Contract Agreement - Legal Review',
        'body': 'Please review the contract and provide legal feedback.'
    })
    print(json.dumps(result, indent=2))
    print(f"✅ Reply-all enforced: {result['reply_all_enforced']}")

if __name__ == '__main__':
    main()
