#!/usr/bin/env python3
"""
V236: Email Auto-Categorizer Engine
Intelligently categorizes emails into folders based on content, sender, and context.
CRITICAL: Enforces reply-all for multi-recipient emails.
"""

import re
from typing import Dict, List, Tuple

class EmailAutoCategorizer:
    def __init__(self):
        self.categories = {
            'urgent': {
                'keywords': ['urgent', 'asap', 'emergency', 'critical', 'immediately'],
                'priority': 1
            },
            'clients': {
                'keywords': ['client', 'customer', 'project', 'deliverable', 'milestone'],
                'priority': 2
            },
            'sales': {
                'keywords': ['quote', 'proposal', 'pricing', 'contract', 'deal'],
                'priority': 3
            },
            'support': {
                'keywords': ['help', 'issue', 'problem', 'ticket', 'support'],
                'priority': 4
            },
            'finance': {
                'keywords': ['invoice', 'payment', 'billing', 'expense', 'receipt'],
                'priority': 5
            },
            'hr': {
                'keywords': ['hiring', 'interview', 'candidate', 'employee', 'benefits'],
                'priority': 6
            },
            'marketing': {
                'keywords': ['campaign', 'newsletter', 'promotion', 'social media'],
                'priority': 7
            },
            'internal': {
                'keywords': ['meeting', 'update', 'announcement', 'team'],
                'priority': 8
            }
        }
    
    def categorize_email(self, email_data: Dict) -> Tuple[str, float, List[str]]:
        """
        Categorize email and return (category, confidence, matched_keywords)
        """
        subject = email_data.get('subject', '').lower()
        body = email_data.get('body', '').lower()
        sender = email_data.get('from', '').lower()
        
        combined_text = f"{subject} {body} {sender}"
        
        scores = {}
        matched_keywords = {}
        
        for category, config in self.categories.items():
            keywords = config['keywords']
            matches = [kw for kw in keywords if kw in combined_text]
            
            if matches:
                # Score based on number of matches and priority
                score = len(matches) * (10 - config['priority'])
                scores[category] = score
                matched_keywords[category] = matches
        
        if not scores:
            return 'inbox', 0.5, []
        
        # Get highest scoring category
        best_category = max(scores, key=scores.get)
        confidence = min(scores[best_category] / 20.0, 1.0)  # Normalize to 0-1
        
        return best_category, confidence, matched_keywords.get(best_category, [])
    
    def enforce_reply_all(self, email_data: Dict) -> Dict:
        """
        CRITICAL: Ensure reply-all for multi-recipient emails
        """
        to_list = email_data.get('to', [])
        cc_list = email_data.get('cc', [])
        
        # If multiple recipients, enforce reply-all
        if len(to_list) + len(cc_list) > 1:
            return {
                'reply_mode': 'reply_all',
                'recipients': to_list + cc_list,
                'enforced': True,
                'reason': f'Multi-recipient email ({len(to_list) + len(cc_list)} recipients)'
            }
        
        return {
            'reply_mode': 'reply',
            'recipients': to_list,
            'enforced': False,
            'reason': 'Single recipient'
        }
    
    def process_email(self, email_data: Dict) -> Dict:
        """
        Process email: categorize and determine reply mode
        """
        category, confidence, keywords = self.categorize_email(email_data)
        reply_config = self.enforce_reply_all(email_data)
        
        return {
            'category': category,
            'confidence': round(confidence, 2),
            'matched_keywords': keywords,
            'reply_config': reply_config,
            'action': f"Move to '{category}' folder",
            'priority': self.categories.get(category, {}).get('priority', 9)
        }

if __name__ == '__main__':
    # Test cases
    categorizer = EmailAutoCategorizer()
    
    test_emails = [
        {
            'subject': 'Urgent: Client deliverable due tomorrow',
            'body': 'We need to finalize the client project deliverables ASAP',
            'from': 'manager@company.com',
            'to': ['team@company.com'],
            'cc': ['client@external.com']
        },
        {
            'subject': 'Invoice #1234 for May services',
            'body': 'Please find attached invoice for May 2026',
            'from': 'billing@vendor.com',
            'to': ['finance@company.com']
        },
        {
            'subject': 'Team meeting tomorrow at 2pm',
            'body': 'Weekly team sync to discuss project updates',
            'from': 'lead@company.com',
            'to': ['team@company.com', 'manager@company.com'],
            'cc': []
        }
    ]
    
    print("V236: Email Auto-Categorizer Test Results")
    print("=" * 60)
    
    for i, email in enumerate(test_emails, 1):
        result = categorizer.process_email(email)
        print(f"\nTest {i}:")
        print(f"  Subject: {email['subject']}")
        print(f"  Category: {result['category']} (confidence: {result['confidence']})")
        print(f"  Keywords: {result['matched_keywords']}")
        print(f"  Reply Mode: {result['reply_config']['reply_mode']}")
        print(f"  Enforced: {result['reply_config']['enforced']}")
        print(f"  Action: {result['action']}")
