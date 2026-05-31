#!/usr/bin/env python3
"""V463 - Email Forwarding Intelligence - Smart routing based on content."""
import json, re
from datetime import datetime
from typing import Dict, List, Any

class EmailForwardingIntelligence:
    EXPERTISE = {
        'technical': ['support@ziontechgroup.com', 'dev@ziontechgroup.com'],
        'sales': ['sales@ziontechgroup.com', 'kleber@ziontechgroup.com'],
        'billing': ['billing@ziontechgroup.com'],
        'legal': ['legal@ziontechgroup.com'],
        'hr': ['hr@ziontechgroup.com']
    }
    
    def analyze_email(self, email: Dict[str, Any]) -> Dict[str, Any]:
        body = email.get('body', '')
        recipients = email.get('to', []) + email.get('cc', [])
        topics = self._detect_topics(body + ' ' + email.get('subject', ''))
        targets = self._find_targets(topics)
        return {
            'engine': 'V463_EmailForwardingIntelligence',
            'topics': topics,
            'forward_targets': targets,
            'reply_all_required': len(recipients) > 1,
            'reply_all_enforced': len(recipients) > 1,
            'timestamp': datetime.now().isoformat()
        }
    
    def _detect_topics(self, text: str) -> List[str]:
        text = text.lower()
        topics = []
        if any(w in text for w in ['bug', 'error', 'technical']): topics.append('technical')
        if any(w in text for w in ['pricing', 'quote', 'sales']): topics.append('sales')
        if any(w in text for w in ['invoice', 'payment', 'billing']): topics.append('billing')
        return topics
    
    def _find_targets(self, topics: List[str]) -> List[str]:
        targets = []
        for topic in topics:
            if topic in self.EXPERTISE:
                targets.extend(self.EXPERTISE[topic])
        return list(set(targets))

def main():
    engine = EmailForwardingIntelligence()
    result = engine.analyze_email({
        'from': 'client@test.com',
        'to': ['info@ziontechgroup.com', 'kleber@ziontechgroup.com'],
        'subject': 'Technical bug and pricing question',
        'body': 'We have a bug in the API and need pricing info.'
    })
    print(json.dumps(result, indent=2))
    print(f"✅ Reply-all enforced: {result['reply_all_enforced']}")

if __name__ == '__main__':
    main()
