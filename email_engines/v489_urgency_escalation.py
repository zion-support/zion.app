#!/usr/bin/env python3
"""
V489 - Email Urgency Escalation Engine
Automatically detects and escalates urgent emails based on content analysis and business rules.
Features: Urgency detection, escalation rules, notification management, priority adjustment.
CRITICAL: Always enforces reply-all for multi-recipient emails.
"""

import json
from datetime import datetime
from typing import Dict, List, Any


class EmailUrgencyEscalationEngine:
    """Detects and escalates urgent emails automatically."""
    
    def __init__(self):
        self.escalation_rules = self._load_escalation_rules()
        self.escalation_history = {}
    
    def analyze_email(self, email: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze email for urgency and escalate if needed."""
        sender = email.get('from', '')
        recipients = email.get('to', []) + email.get('cc', [])
        subject = email.get('subject', '')
        body = email.get('body', '')
        
        # Detect urgency level
        urgency_analysis = self._detect_urgency(subject, body, sender)
        
        # Determine escalation needs
        escalation_decision = self._determine_escalation(urgency_analysis, recipients)
        
        # Generate escalation actions
        escalation_actions = self._generate_escalation_actions(escalation_decision, email)
        
        # Calculate response SLA
        response_sla = self._calculate_response_sla(urgency_analysis)
        
        # Generate notifications
        notifications = self._generate_notifications(escalation_decision, urgency_analysis)
        
        # Provide recommendations
        recommendations = self._generate_recommendations(urgency_analysis, escalation_decision)
        
        reply_all_required = len(recipients) > 1
        
        return {
            'engine': 'V489_EmailUrgencyEscalationEngine',
            'urgency_analysis': urgency_analysis,
            'escalation_decision': escalation_decision,
            'escalation_actions': escalation_actions,
            'response_sla': response_sla,
            'notifications': notifications,
            'recommendations': recommendations,
            'reply_all_required': reply_all_required,
            'reply_all_enforced': reply_all_required,
            'recipients': recipients,
            'timestamp': datetime.now().isoformat()
        }
    
    def _load_escalation_rules(self) -> Dict[str, Any]:
        """Load escalation rules configuration."""
        return {
            'critical': {
                'keywords': ['critical', 'emergency', 'urgent', 'asap', 'immediately', 'production down'],
                'response_time_minutes': 15,
                'escalate_to': ['manager', 'director', 'on-call'],
                'notification_channels': ['email', 'sms', 'slack']
            },
            'high': {
                'keywords': ['important', 'priority', 'deadline today', 'client issue'],
                'response_time_minutes': 60,
                'escalate_to': ['manager', 'team lead'],
                'notification_channels': ['email', 'slack']
            },
            'medium': {
                'keywords': ['please review', 'need feedback', 'follow up'],
                'response_time_minutes': 240,
                'escalate_to': ['team lead'],
                'notification_channels': ['email']
            },
            'low': {
                'keywords': ['fyi', 'when you have time', 'no rush'],
                'response_time_minutes': 1440,
                'escalate_to': [],
                'notification_channels': []
            }
        }
    
    def _detect_urgency(self, subject: str, body: str, sender: str) -> Dict[str, Any]:
        """Detect urgency level from email content."""
        text = (subject + ' ' + body).lower()
        
        # Score each urgency level
        urgency_scores = {}
        
        for level, rules in self.escalation_rules.items():
            score = 0
            matched_keywords = []
            
            for keyword in rules['keywords']:
                if keyword in text:
                    score += 1
                    matched_keywords.append(keyword)
            
            urgency_scores[level] = {
                'score': score,
                'matched_keywords': matched_keywords
            }
        
        # Determine highest urgency level
        highest_level = max(urgency_scores.items(), key=lambda x: x[1]['score'])
        
        # Check for sender-based urgency (VIP senders)
        sender_urgency_boost = self._check_sender_urgency(sender)
        
        # Determine final urgency level
        if highest_level[1]['score'] > 0:
            urgency_level = highest_level[0]
            confidence = min(1.0, highest_level[1]['score'] * 0.3)
        elif sender_urgency_boost:
            urgency_level = 'high'
            confidence = 0.7
        else:
            urgency_level = 'low'
            confidence = 0.8
        
        return {
            'urgency_level': urgency_level,
            'confidence': confidence,
            'matched_keywords': highest_level[1]['matched_keywords'],
            'sender_urgency_boost': sender_urgency_boost,
            'all_scores': urgency_scores
        }
    
    def _check_sender_urgency(self, sender: str) -> bool:
        """Check if sender warrants urgency boost."""
        sender_lower = sender.lower()
        
        vip_indicators = ['ceo', 'president', 'executive', 'director', 'vp']
        
        return any(indicator in sender_lower for indicator in vip_indicators)
    
    def _determine_escalation(self, urgency: Dict, recipients: List[str]) -> Dict[str, Any]:
        """Determine if and how to escalate."""
        urgency_level = urgency['urgency_level']
        rules = self.escalation_rules[urgency_level]
        
        # Determine if escalation is needed
        needs_escalation = urgency_level in ['critical', 'high'] and urgency['confidence'] > 0.6
        
        # Get escalation targets
        escalation_targets = rules['escalate_to'] if needs_escalation else []
        
        # Determine notification channels
        notification_channels = rules['notification_channels'] if needs_escalation else []
        
        return {
            'needs_escalation': needs_escalation,
            'urgency_level': urgency_level,
            'escalation_targets': escalation_targets,
            'notification_channels': notification_channels,
            'confidence': urgency['confidence'],
            'reason': self._generate_escalation_reason(urgency, needs_escalation)
        }
    
    def _generate_escalation_reason(self, urgency: Dict, needs_escalation: bool) -> str:
        """Generate human-readable escalation reason."""
        if not needs_escalation:
            return "No escalation needed - standard priority email"
        
        urgency_level = urgency['urgency_level']
        keywords = urgency['matched_keywords']
        
        if keywords:
            return f"Escalation triggered by urgency indicators: {', '.join(keywords[:3])}"
        elif urgency['sender_urgency_boost']:
            return f"Escalation triggered by VIP sender - treating as {urgency_level} priority"
        else:
            return f"Escalation triggered by {urgency_level} urgency classification"
    
    def _generate_escalation_actions(self, decision: Dict, email: Dict) -> List[Dict[str, Any]]:
        """Generate specific escalation actions."""
        actions = []
        
        if not decision['needs_escalation']:
            return actions
        
        # Add to escalation queue
        actions.append({
            'action': 'add_to_escalation_queue',
            'priority': decision['urgency_level'],
            'timestamp': datetime.now().isoformat(),
            'status': 'pending'
        })
        
        # Assign to escalation targets
        for target in decision['escalation_targets']:
            actions.append({
                'action': 'assign_to',
                'target': target,
                'priority': decision['urgency_level'],
                'status': 'pending'
            })
        
        # Send notifications
        for channel in decision['notification_channels']:
            actions.append({
                'action': 'send_notification',
                'channel': channel,
                'recipients': decision['escalation_targets'],
                'message': f"URGENT: {email.get('subject', 'Urgent email received')}",
                'status': 'pending'
            })
        
        # Set up monitoring
        actions.append({
            'action': 'setup_monitoring',
            'sla_minutes': self.escalation_rules[decision['urgency_level']]['response_time_minutes'],
            'alert_if_no_response': True,
            'status': 'pending'
        })
        
        return actions
    
    def _calculate_response_sla(self, urgency: Dict) -> Dict[str, Any]:
        """Calculate response SLA based on urgency."""
        urgency_level = urgency['urgency_level']
        rules = self.escalation_rules[urgency_level]
        
        response_minutes = rules['response_time_minutes']
        
        # Calculate SLA deadline
        sla_deadline = datetime.now() + timedelta(minutes=response_minutes)
        
        return {
            'urgency_level': urgency_level,
            'response_time_minutes': response_minutes,
            'response_time_hours': response_minutes / 60,
            'sla_deadline': sla_deadline.isoformat(),
            'time_remaining_minutes': response_minutes,
            'status': 'active'
        }
    
    def _generate_notifications(self, decision: Dict, urgency: Dict) -> List[Dict[str, Any]]:
        """Generate notification payloads."""
        notifications = []
        
        if not decision['needs_escalation']:
            return notifications
        
        for channel in decision['notification_channels']:
            if channel == 'email':
                notifications.append({
                    'channel': 'email',
                    'type': 'escalation_alert',
                    'subject': f"[{decision['urgency_level'].upper()}] Urgent Email Requires Attention",
                    'body': f"An email has been classified as {decision['urgency_level']} priority and requires immediate attention.\n\nReason: {decision['reason']}",
                    'recipients': decision['escalation_targets'],
                    'priority': 'high'
                })
            elif channel == 'sms':
                notifications.append({
                    'channel': 'sms',
                    'type': 'escalation_alert',
                    'message': f"URGENT: {decision['urgency_level'].upper()} priority email received. {decision['reason']}",
                    'recipients': decision['escalation_targets'],
                    'priority': 'critical'
                })
            elif channel == 'slack':
                notifications.append({
                    'channel': 'slack',
                    'type': 'escalation_alert',
                    'channel_name': '#urgent-escalations',
                    'message': f"🚨 *{decision['urgency_level'].upper()} PRIORITY* 🚨\n{decision['reason']}",
                    'recipients': decision['escalation_targets'],
                    'priority': 'high'
                })
        
        return notifications
    
    def _generate_recommendations(self, urgency: Dict, decision: Dict) -> List[str]:
        """Generate recommendations for handling the email."""
        recommendations = []
        
        urgency_level = urgency['urgency_level']
        
        if urgency_level == 'critical':
            recommendations.extend([
                "Respond within 15 minutes",
                "Acknowledge receipt immediately",
                "Escalate to management if resolution will take longer than 1 hour",
                "Document all actions taken"
            ])
        elif urgency_level == 'high':
            recommendations.extend([
                "Respond within 1 hour",
                "Prioritize over other tasks",
                "Provide status update if full resolution will take longer"
            ])
        elif urgency_level == 'medium':
            recommendations.extend([
                "Respond within 4 hours",
                "Add to priority task list",
                "Provide timeline for resolution"
            ])
        else:
            recommendations.extend([
                "Respond within 24 hours",
                "Handle during normal workflow"
            ])
        
        if decision['needs_escalation']:
            recommendations.append(f"Escalation triggered - notify {', '.join(decision['escalation_targets'])}")
        
        recommendations.append("Always use reply-all for multi-recipient emails")
        
        return recommendations


def main():
    """Test V489 engine."""
    engine = EmailUrgencyEscalationEngine()
    
    test_email = {
        'from': 'client@company.com',
        'to': ['support@ziontechgroup.com', 'kleber@ziontechgroup.com'],
        'cc': ['manager@company.com'],
        'subject': 'CRITICAL: Production system down - need immediate assistance',
        'body': 'Our production system is completely down and we are losing revenue. This is an emergency and we need immediate assistance. Please respond ASAP.'
    }
    
    result = engine.analyze_email(test_email)
    print(json.dumps(result, indent=2))
    print(f"\n✅ Urgency level: {result['urgency_analysis']['urgency_level']}")
    print(f"✅ Escalation needed: {result['escalation_decision']['needs_escalation']}")
    print(f"✅ Response SLA: {result['response_sla']['response_time_minutes']} minutes")
    print(f"✅ Escalation actions: {len(result['escalation_actions'])}")
    print(f"✅ Reply-all enforced: {result['reply_all_enforced']}")


if __name__ == '__main__':
    main()
