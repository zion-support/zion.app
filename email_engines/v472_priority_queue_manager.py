#!/usr/bin/env python3
"""
V472 - Email Priority Queue Manager
AI-powered email prioritization that automatically sorts inbox by urgency, importance, and business value.
Features: Smart prioritization, urgency detection, business value scoring, queue management.
CRITICAL: Always enforces reply-all for multi-recipient emails.
"""

import json
import re
from datetime import datetime, timedelta
from typing import Dict, List, Any


class EmailPriorityQueueManager:
    """AI-powered email prioritization system."""
    
    def analyze_email(self, email: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze email and assign priority score."""
        body = email.get('body', '')
        subject = email.get('subject', '')
        sender = email.get('from', '')
        recipients = email.get('to', []) + email.get('cc', [])
        
        # Calculate priority factors
        urgency = self._detect_urgency(body, subject)
        importance = self._calculate_importance(email)
        business_value = self._assess_business_value(email)
        time_sensitivity = self._evaluate_time_sensitivity(body)
        
        # Calculate overall priority score (0-100)
        priority_score = self._calculate_priority_score(urgency, importance, business_value, time_sensitivity)
        
        # Assign priority level
        priority_level = self._assign_priority_level(priority_score)
        
        # Determine queue position
        queue_position = self._determine_queue_position(priority_score)
        
        # Generate action recommendations
        actions = self._recommend_actions(priority_level, urgency, importance)
        
        reply_all_required = len(recipients) > 1
        
        return {
            'engine': 'V472_EmailPriorityQueueManager',
            'priority_score': priority_score,
            'priority_level': priority_level,
            'queue_position': queue_position,
            'factors': {
                'urgency': urgency,
                'importance': importance,
                'business_value': business_value,
                'time_sensitivity': time_sensitivity
            },
            'recommended_actions': actions,
            'estimated_response_time': self._estimate_response_time(priority_level),
            'reply_all_required': reply_all_required,
            'reply_all_enforced': reply_all_required,
            'recipients': recipients,
            'timestamp': datetime.now().isoformat()
        }
    
    def _detect_urgency(self, body: str, subject: str) -> Dict:
        """Detect urgency level from email content."""
        text = (body + ' ' + subject).lower()
        
        urgent_keywords = ['urgent', 'asap', 'immediately', 'critical', 'emergency', 'deadline today', 'right now']
        urgent_count = sum(1 for kw in urgent_keywords if kw in text)
        
        if urgent_count >= 3:
            score = 100
            level = 'critical'
        elif urgent_count >= 2:
            score = 85
            level = 'high'
        elif urgent_count >= 1:
            score = 70
            level = 'elevated'
        else:
            score = 30
            level = 'normal'
        
        # Check for exclamation marks (urgency indicator)
        excl_count = text.count('!')
        if excl_count >= 3:
            score = min(100, score + 15)
        
        return {
            'score': score,
            'level': level,
            'indicators': urgent_count,
            'exclamation_marks': excl_count
        }
    
    def _calculate_importance(self, email: Dict) -> Dict:
        """Calculate importance based on sender and content."""
        sender = email.get('from', '').lower()
        body = email.get('body', '').lower()
        
        # VIP sender detection
        vip_domains = ['ceo', 'president', 'director', 'executive', 'board']
        is_vip = any(vip in sender for vip in vip_domains)
        
        # Important keywords
        important_keywords = ['contract', 'proposal', 'agreement', 'decision', 'approval', 'budget', 'revenue']
        important_count = sum(1 for kw in important_keywords if kw in body)
        
        if is_vip and important_count >= 2:
            score = 95
            level = 'critical'
        elif is_vip or important_count >= 2:
            score = 80
            level = 'high'
        elif important_count >= 1:
            score = 65
            level = 'medium'
        else:
            score = 40
            level = 'low'
        
        return {
            'score': score,
            'level': level,
            'vip_sender': is_vip,
            'important_keywords': important_count
        }
    
    def _assess_business_value(self, email: Dict) -> Dict:
        """Assess business value of email."""
        body = email.get('body', '').lower()
        subject = email.get('subject', '').lower()
        text = body + ' ' + subject
        
        # Revenue indicators
        revenue_keywords = ['purchase', 'order', 'sale', 'deal', 'contract', 'invoice', 'payment', 'quote', 'pricing']
        revenue_count = sum(1 for kw in revenue_keywords if kw in text)
        
        # Strategic indicators
        strategic_keywords = ['partnership', 'collaboration', 'strategic', 'opportunity', 'growth', 'expansion']
        strategic_count = sum(1 for kw in strategic_keywords if kw in text)
        
        # Support indicators
        support_keywords = ['help', 'issue', 'problem', 'bug', 'error', 'support', 'troubleshoot']
        support_count = sum(1 for kw in support_keywords if kw in text)
        
        if revenue_count >= 2:
            score = 90
            category = 'revenue'
        elif strategic_count >= 2:
            score = 85
            category = 'strategic'
        elif revenue_count >= 1 or strategic_count >= 1:
            score = 70
            category = 'business'
        elif support_count >= 1:
            score = 60
            category = 'support'
        else:
            score = 45
            category = 'general'
        
        return {
            'score': score,
            'category': category,
            'revenue_indicators': revenue_count,
            'strategic_indicators': strategic_count,
            'support_indicators': support_count
        }
    
    def _evaluate_time_sensitivity(self, body: str) -> Dict:
        """Evaluate time sensitivity of email."""
        body_lower = body.lower()
        
        # Time-related keywords
        time_keywords = ['today', 'tomorrow', 'this week', 'by eod', 'by cob', 'end of day', 'close of business']
        time_count = sum(1 for kw in time_keywords if kw in body_lower)
        
        # Deadline patterns
        deadline_patterns = [
            r'due (?:by|on) \w+',
            r'deadline[:\s]+\w+',
            r'need (?:it|this) by \w+'
        ]
        
        has_deadline = any(re.search(pattern, body_lower) for pattern in deadline_patterns)
        
        if time_count >= 2 or has_deadline:
            score = 90
            level = 'immediate'
        elif time_count >= 1:
            score = 75
            level = 'soon'
        else:
            score = 40
            level = 'flexible'
        
        return {
            'score': score,
            'level': level,
            'time_indicators': time_count,
            'has_deadline': has_deadline
        }
    
    def _calculate_priority_score(self, urgency: Dict, importance: Dict, business_value: Dict, time_sensitivity: Dict) -> int:
        """Calculate overall priority score (0-100)."""
        # Weighted average
        weights = {
            'urgency': 0.30,
            'importance': 0.25,
            'business_value': 0.25,
            'time_sensitivity': 0.20
        }
        
        score = (
            urgency['score'] * weights['urgency'] +
            importance['score'] * weights['importance'] +
            business_value['score'] * weights['business_value'] +
            time_sensitivity['score'] * weights['time_sensitivity']
        )
        
        return int(score)
    
    def _assign_priority_level(self, score: int) -> str:
        """Assign priority level based on score."""
        if score >= 85:
            return 'P1-Critical'
        elif score >= 70:
            return 'P2-High'
        elif score >= 55:
            return 'P3-Medium'
        elif score >= 40:
            return 'P4-Low'
        else:
            return 'P5-Informational'
    
    def _determine_queue_position(self, score: int) -> Dict:
        """Determine position in priority queue."""
        if score >= 85:
            position = 1
            category = 'immediate_attention'
        elif score >= 70:
            position = 2
            category = 'respond_today'
        elif score >= 55:
            position = 3
            category = 'respond_this_week'
        elif score >= 40:
            position = 4
            category = 'when_possible'
        else:
            position = 5
            category = 'review_later'
        
        return {
            'position': position,
            'category': category,
            'estimated_queue_time': f"{position * 15} minutes"
        }
    
    def _recommend_actions(self, priority_level: str, urgency: Dict, importance: Dict) -> List[str]:
        """Recommend actions based on priority."""
        actions = []
        
        if priority_level == 'P1-Critical':
            actions.append("🚨 RESPOND IMMEDIATELY - This requires urgent attention")
            actions.append("Consider escalating to manager if needed")
            actions.append("Block time in calendar to address this")
        elif priority_level == 'P2-High':
            actions.append("⚠️ HIGH PRIORITY - Respond within 2 hours")
            actions.append("Review carefully before responding")
        elif priority_level == 'P3-Medium':
            actions.append("📋 MEDIUM PRIORITY - Respond within 24 hours")
            actions.append("Can be addressed during regular work hours")
        elif priority_level == 'P4-Low':
            actions.append("📝 LOW PRIORITY - Respond within 48 hours")
            actions.append("Handle when higher priority items are complete")
        else:
            actions.append("ℹ️ INFORMATIONAL - Review when convenient")
            actions.append("May not require a response")
        
        actions.append("Always use reply-all for multi-recipient emails")
        
        return actions
    
    def _estimate_response_time(self, priority_level: str) -> str:
        """Estimate appropriate response time."""
        response_times = {
            'P1-Critical': '15-30 minutes',
            'P2-High': '1-2 hours',
            'P3-Medium': '4-8 hours',
            'P4-Low': '24-48 hours',
            'P5-Informational': 'When convenient (if needed)'
        }
        return response_times.get(priority_level, 'Unknown')


def main():
    """Test V472 engine."""
    engine = EmailPriorityQueueManager()
    
    test_emails = [
        {
            'from': 'ceo@client.com',
            'to': ['kleber@ziontechgroup.com', 'sales@ziontechgroup.com'],
            'subject': 'URGENT: Contract approval needed TODAY',
            'body': 'We need immediate approval on the contract. This is critical and must be completed by EOD today. Please respond ASAP!'
        },
        {
            'from': 'prospect@company.com',
            'to': ['sales@ziontechgroup.com', 'kleber@ziontechgroup.com'],
            'subject': 'Interested in your services',
            'body': 'We are interested in your AI services and would like to discuss pricing and partnership opportunities.'
        },
        {
            'from': 'newsletter@techblog.com',
            'to': ['kleber@ziontechgroup.com'],
            'subject': 'Weekly tech newsletter',
            'body': 'Here are the top tech stories this week...'
        }
    ]
    
    print("=== Email Priority Queue Manager ===\n")
    
    for i, email in enumerate(test_emails, 1):
        result = engine.analyze_email(email)
        print(f"\n📧 Email {i}: {email['subject'][:50]}...")
        print(f"   Priority Score: {result['priority_score']}/100")
        print(f"   Priority Level: {result['priority_level']}")
        print(f"   Queue Position: #{result['queue_position']['position']} ({result['queue_position']['category']})")
        print(f"   Response Time: {result['estimated_response_time']}")
        print(f"   Urgency: {result['factors']['urgency']['level']}")
        print(f"   Business Value: {result['factors']['business_value']['category']}")
        print(f"   Reply-all enforced: {result['reply_all_enforced']}")


if __name__ == '__main__':
    main()
