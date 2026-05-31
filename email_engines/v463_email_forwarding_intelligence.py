#!/usr/bin/env python3
"""
V463 - AI Email Forwarding Intelligence
Smart email forwarding based on content analysis, expertise matching, and workflow rules.
Features: Content-based routing, expertise detection, auto-forwarding, chain prevention.
CRITICAL: Always enforces reply-all for multi-recipient emails.
"""

import json
import re
from datetime import datetime
from typing import Dict, List, Any


class EmailForwardingIntelligence:
    """Intelligently routes emails to the right people."""
    
    EXPERTISE_MAP = {
        'technical': ['support@ziontechgroup.com', 'dev@ziontechgroup.com'],
        'sales': ['sales@ziontechgroup.com', 'kleber@ziontechgroup.com'],
        'billing': ['billing@ziontechgroup.com', 'finance@ziontechgroup.com'],
        'legal': ['legal@ziontechgroup.com', 'compliance@ziontechgroup.com'],
        'hr': ['hr@ziontechgroup.com', 'people@ziontechgroup.com'],
        'management': ['kleber@ziontechgroup.com', 'management@ziontechgroup.com']
    }
    
    def analyze_email(self, email: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze email and determine forwarding targets."""
        body = email.get('body', '')
        subject = email.get('subject', '')
        sender = email.get('from', '')
        recipients = email.get('to', []) + email.get('cc', [])
        
        text = subject + ' ' + body
        
        # Detect topic and expertise needed
        topics = self._detect_topics(text)
        forwarding_targets = self._find_targets(topics)
        
        # Check for forwarding chains
        chain_check = self._check_forwarding_chain(email)
        
        # Generate forwarding recommendation
        recommendation = self._generate_recommendation(forwarding_targets, topics, recipients)
        
        reply_all_required = len(recipients) > 1
        
        return {
            'engine': 'V463_EmailForwardingIntelligence',
            'detected_topics': topics,
            'forwarding_targets': forwarding_targets,
            'forwarding_chain_check': chain_check,
            'recommendation': recommendation,
            'auto_forward_enabled': True,
            'reply_all_required': reply_all_required,
            'reply_all_enforced': reply_all_required,
            'recipients': recipients,
            'timestamp': datetime.now().isoformat()
        }
    
    def _detect_topics(self, text: str) -> List[Dict]:
        """Detect topics in email."""
        text_lower = text.lower()
        topics = []
        
        topic_keywords = {
            'technical': ['bug', 'error', 'issue', 'crash', 'technical', 'development', 'code', 'api'],
            'sales': ['pricing', 'quote', 'proposal', 'purchase', 'buy', 'sales', 'demo'],
            'billing': ['invoice', 'payment', 'billing', 'charge', 'refund', 'subscription'],
            'legal': ['legal', 'compliance', 'contract', 'terms', 'privacy', 'gdpr'],
            'hr': ['hiring', 'job', 'resume', 'interview', 'employee', 'benefits'],
            'management': ['strategy', 'decision', 'escalation', 'executive', 'leadership']
        }
        
        for topic, keywords in topic_keywords.items():
            matches = sum(1 for kw in keywords if kw in text_lower)
            if matches > 0:
                topics.append({
                    'topic': topic,
                    'confidence': min(1.0, matches * 0.25),
                    'keywords_matched': [kw for kw in keywords if kw in text_lower]
                })
        
        return sorted(topics, key=lambda x: x['confidence'], reverse=True)
    
    def _find_targets(self, topics: List[Dict]) -> List[Dict]:
        """Find forwarding targets based on topics."""
        targets = []
        
        for topic_info in topics[:3]:
            topic = topic_info['topic']
            if topic in self.EXPERTISE_MAP:
                for email in self.EXPERTISE_MAP[topic]:
                    targets.append({
                        'email': email,
                        'expertise': topic,
                        'confidence': topic_info['confidence'],
                        'reason': f"Expertise in {topic}"
                    })
        
        return targets
    
    def _check_forwarding_chain(self, email: Dict) -> Dict:
        """Check for problematic forwarding chains."""
        headers = email.get('headers', {})
        forwarded_count = headers.get('x_forwarded_count', 0)
        
        return {
            'is_chain': forwarded_count > 2,
            'forward_count': forwarded_count,
            'recommendation': 'Break chain - respond directly' if forwarded_count > 2 else 'No chain detected'
        }
    
    def _generate_recommendation(self, targets: List[Dict], topics: List[Dict], current_recipients: List[str]) -> Dict:
        """Generate forwarding recommendation."""
        if not targets:
            return {
                'action': 'respond_directly',
                'reason': 'No specific expertise match found',
                'new_recipients': []
            }
        
        new_targets = [t['email'] for t in targets if t['email'] not in current_recipients]
        
        return {
            'action': 'forward_with_context' if new_targets else 'respond_directly',
            'forward_to': new_targets,
            'keep_in_loop': current_recipients,
            'reason': f"Forwarding to {len(new_targets)} expert(s) in {', '.join(t['topic'] for t in topics[:2])}",
            'include_original': True,
            'add_context_summary': True
        }


def main():
    """Test V463 engine."""
    engine = EmailForwardingIntelligence()
    
    test_email = {
        'from': 'client@acme.com',
        'to': ['info@ziontechgroup.com'],
        'cc': [],
        'subject': 'Pricing question and technical bug report',
        'body': 'Hi, I have two questions: 1) Can you send me pricing for your Enterprise plan? 2) We are experiencing a bug in the API that causes crashes when processing large datasets. Please help.',
        'headers': {'x_forwarded_count': 0}
    }
    
    result = engine.analyze_email(test_email)
    print(json.dumps(result, indent=2))
    print(f"\n✅ Topics detected: {len(result['detected_topics'])}")
    print(f"✅ Forwarding targets: {len(result['forwarding_targets'])}")
    print(f"✅ Reply-all enforced: {result['reply_all_enforced']}")


if __name__ == '__main__':
    main()
