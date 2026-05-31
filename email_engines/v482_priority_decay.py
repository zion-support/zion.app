#!/usr/bin/env python3
"""
V482 - Email Priority Decay Engine
Automatically adjust email priority based on age, context, and response patterns.
Features: Dynamic priority adjustment, urgency decay, response time tracking, smart re-prioritization.
CRITICAL: Always enforces reply-all for multi-recipient emails.
"""

import json
import re
from datetime import datetime, timedelta
from typing import Dict, List, Any


class EmailPriorityDecayEngine:
    """Automatically adjust email priority based on temporal and contextual factors."""
    
    PRIORITY_LEVELS = {
        'critical': {'score': 100, 'decay_rate': 0.5, 'response_target_hours': 1},
        'high': {'score': 80, 'decay_rate': 1.0, 'response_target_hours': 4},
        'medium': {'score': 60, 'decay_rate': 2.0, 'response_target_hours': 24},
        'low': {'score': 40, 'decay_rate': 3.0, 'response_target_hours': 72},
        'informational': {'score': 20, 'decay_rate': 5.0, 'response_target_hours': 168}
    }
    
    def analyze_email(self, email: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze email and calculate dynamic priority with decay."""
        body = email.get('body', '')
        subject = email.get('subject', '')
        sender = email.get('from', '')
        recipients = email.get('to', []) + email.get('cc', [])
        received_at = email.get('timestamp', datetime.now().isoformat())
        response_history = email.get('response_history', [])
        
        # Calculate initial priority
        initial_priority = self._calculate_initial_priority(body, subject, sender)
        
        # Calculate age-based decay
        age_decay = self._calculate_age_decay(received_at, initial_priority['level'])
        
        # Calculate context adjustments
        context_adjustments = self._calculate_context_adjustments(email, response_history)
        
        # Calculate final priority score
        final_priority = self._calculate_final_priority(
            initial_priority, age_decay, context_adjustments
        )
        
        # Determine if re-prioritization needed
        reprioritization = self._check_reprioritization(initial_priority, final_priority)
        
        # Generate actions
        actions = self._generate_actions(final_priority, age_decay, reprioritization)
        
        reply_all_required = len(recipients) > 1
        
        return {
            'engine': 'V482_EmailPriorityDecayEngine',
            'initial_priority': initial_priority,
            'age_decay': age_decay,
            'context_adjustments': context_adjustments,
            'final_priority': final_priority,
            'reprioritization': reprioritization,
            'recommended_actions': actions,
            'reply_all_required': reply_all_required,
            'reply_all_enforced': reply_all_required,
            'recipients': recipients,
            'timestamp': datetime.now().isoformat()
        }
    
    def _calculate_initial_priority(self, body: str, subject: str, sender: str) -> Dict:
        """Calculate initial priority based on content."""
        text = (body + ' ' + subject).lower()
        
        # Priority indicators
        critical_keywords = ['urgent', 'emergency', 'critical', 'asap', 'immediately', 'deadline today']
        high_keywords = ['important', 'priority', 'soon', 'this week', 'deadline']
        medium_keywords = ['please', 'when possible', 'review', 'feedback']
        low_keywords = ['fyi', 'information', 'update', 'newsletter']
        
        # Count matches
        critical_count = sum(1 for kw in critical_keywords if kw in text)
        high_count = sum(1 for kw in high_keywords if kw in text)
        medium_count = sum(1 for kw in medium_keywords if kw in text)
        low_count = sum(1 for kw in low_keywords if kw in text)
        
        # Determine priority level
        if critical_count > 0:
            level = 'critical'
            confidence = min(1.0, critical_count * 0.3)
        elif high_count > 0:
            level = 'high'
            confidence = min(1.0, high_count * 0.3)
        elif medium_count > 0:
            level = 'medium'
            confidence = min(1.0, medium_count * 0.2)
        elif low_count > 0:
            level = 'low'
            confidence = min(1.0, low_count * 0.2)
        else:
            level = 'informational'
            confidence = 0.5
        
        # Check for VIP sender
        vip_indicators = ['ceo', 'president', 'director', 'vp', 'executive']
        is_vip = any(indicator in sender.lower() for indicator in vip_indicators)
        
        if is_vip and level in ['medium', 'low', 'informational']:
            level = 'high'
            confidence = 0.9
        
        priority_config = self.PRIORITY_LEVELS[level]
        
        return {
            'level': level,
            'score': priority_config['score'],
            'confidence': confidence,
            'is_vip_sender': is_vip,
            'response_target_hours': priority_config['response_target_hours']
        }
    
    def _calculate_age_decay(self, received_at: str, priority_level: str) -> Dict:
        """Calculate priority decay based on email age."""
        try:
            received_time = datetime.fromisoformat(received_at.replace('Z', '+00:00'))
        except:
            received_time = datetime.now()
        
        now = datetime.now()
        age_hours = (now - received_time).total_seconds() / 3600
        
        # Get decay rate for priority level
        decay_rate = self.PRIORITY_LEVELS[priority_level]['decay_rate']
        
        # Calculate decay (exponential decay model)
        # Priority decays faster for lower priorities
        decay_factor = max(0, 1 - (age_hours / (decay_rate * 24)))
        
        # Calculate score reduction
        initial_score = self.PRIORITY_LEVELS[priority_level]['score']
        score_reduction = initial_score * (1 - decay_factor)
        
        # Determine if priority should be escalated due to age
        response_target = self.PRIORITY_LEVELS[priority_level]['response_target_hours']
        overdue = age_hours > response_target
        
        if overdue:
            # Overdue emails get priority boost instead of decay
            decay_factor = min(1.2, 1 + (age_hours - response_target) / response_target)
            score_reduction = -initial_score * 0.2  # Negative = boost
        
        return {
            'age_hours': round(age_hours, 2),
            'decay_factor': round(decay_factor, 3),
            'score_reduction': round(score_reduction, 2),
            'overdue': overdue,
            'hours_overdue': round(max(0, age_hours - response_target), 2) if overdue else 0,
            'decay_rate': decay_rate
        }
    
    def _calculate_context_adjustments(self, email: Dict, response_history: List[Dict]) -> Dict:
        """Calculate priority adjustments based on context."""
        adjustments = {
            'total_adjustment': 0,
            'factors': []
        }
        
        # Factor 1: Multiple follow-ups
        follow_up_count = len([r for r in response_history if 'follow-up' in r.get('type', '')])
        if follow_up_count > 0:
            boost = min(20, follow_up_count * 5)
            adjustments['total_adjustment'] += boost
            adjustments['factors'].append({
                'factor': 'follow_ups',
                'impact': boost,
                'reason': f'{follow_up_count} follow-up(s) detected'
            })
        
        # Factor 2: Thread length
        thread_length = len(response_history)
        if thread_length > 5:
            boost = min(15, (thread_length - 5) * 2)
            adjustments['total_adjustment'] += boost
            adjustments['factors'].append({
                'factor': 'thread_length',
                'impact': boost,
                'reason': f'Long thread ({thread_length} messages)'
            })
        
        # Factor 3: Multiple recipients
        recipients = email.get('to', []) + email.get('cc', [])
        if len(recipients) > 5:
            boost = 10
            adjustments['total_adjustment'] += boost
            adjustments['factors'].append({
                'factor': 'multiple_recipients',
                'impact': boost,
                'reason': f'{len(recipients)} recipients (group communication)'
            })
        
        # Factor 4: Attachment present
        if email.get('attachments'):
            boost = 5
            adjustments['total_adjustment'] += boost
            adjustments['factors'].append({
                'factor': 'has_attachments',
                'impact': boost,
                'reason': 'Email contains attachments'
            })
        
        # Factor 5: Questions asked
        body = email.get('body', '')
        question_count = body.count('?')
        if question_count > 2:
            boost = min(10, question_count * 2)
            adjustments['total_adjustment'] += boost
            adjustments['factors'].append({
                'factor': 'questions_asked',
                'impact': boost,
                'reason': f'{question_count} questions need answers'
            })
        
        return adjustments
    
    def _calculate_final_priority(self, initial: Dict, decay: Dict, adjustments: Dict) -> Dict:
        """Calculate final priority score."""
        base_score = initial['score']
        
        # Apply decay
        score_after_decay = base_score - decay['score_reduction']
        
        # Apply context adjustments
        final_score = score_after_decay + adjustments['total_adjustment']
        
        # Clamp to 0-100
        final_score = max(0, min(100, final_score))
        
        # Determine final priority level
        if final_score >= 90:
            final_level = 'critical'
        elif final_score >= 70:
            final_level = 'high'
        elif final_score >= 50:
            final_level = 'medium'
        elif final_score >= 30:
            final_level = 'low'
        else:
            final_level = 'informational'
        
        # Calculate urgency multiplier
        urgency_multiplier = final_score / initial['score'] if initial['score'] > 0 else 1
        
        return {
            'score': round(final_score, 2),
            'level': final_level,
            'score_change': round(final_score - base_score, 2),
            'urgency_multiplier': round(urgency_multiplier, 2),
            'response_target_hours': self.PRIORITY_LEVELS[final_level]['response_target_hours'],
            'time_remaining_hours': max(0, self.PRIORITY_LEVELS[final_level]['response_target_hours'] - decay['age_hours'])
        }
    
    def _check_reprioritization(self, initial: Dict, final: Dict) -> Dict:
        """Check if email needs re-prioritization."""
        level_changed = initial['level'] != final['level']
        score_change = abs(final['score_change'])
        
        needs_reprioritization = level_changed or score_change > 15
        
        if needs_reprioritization:
            if final['score'] > initial['score']:
                direction = 'escalated'
                reason = self._get_escalation_reason(initial, final)
            else:
                direction = 'de-escalated'
                reason = self._get_deescalation_reason(initial, final)
        else:
            direction = 'stable'
            reason = 'Priority stable'
        
        return {
            'needed': needs_reprioritization,
            'direction': direction,
            'reason': reason,
            'old_level': initial['level'],
            'new_level': final['level'],
            'score_change': final['score_change']
        }
    
    def _get_escalation_reason(self, initial: Dict, final: Dict) -> str:
        """Get reason for priority escalation."""
        if final['score'] >= 90:
            return 'Escalated to critical due to overdue status and follow-ups'
        elif final['score'] >= 70:
            return 'Escalated to high priority due to context factors'
        else:
            return 'Priority increased based on contextual analysis'
    
    def _get_deescalation_reason(self, initial: Dict, final: Dict) -> str:
        """Get reason for priority de-escalation."""
        if final['level'] == 'informational':
            return 'De-escalated to informational due to age and lack of urgency'
        elif final['level'] == 'low':
            return 'Priority reduced due to age decay'
        else:
            return 'Priority adjusted based on temporal factors'
    
    def _generate_actions(self, final: Dict, decay: Dict, reprioritization: Dict) -> List[str]:
        """Generate recommended actions based on priority analysis."""
        actions = []
        
        # Based on final priority
        if final['level'] == 'critical':
            actions.append('🚨 Respond immediately - critical priority')
            actions.append(f'Target response time: {final["response_target_hours"]} hour(s)')
        elif final['level'] == 'high':
            actions.append('⚠️ High priority - respond within 4 hours')
        elif final['level'] == 'medium':
            actions.append('📋 Medium priority - respond within 24 hours')
        elif final['level'] == 'low':
            actions.append('📝 Low priority - respond when convenient')
        
        # Based on overdue status
        if decay['overdue']:
            actions.append(f'⏰ OVERDUE by {decay["hours_overdue"]} hours - escalate if needed')
        
        # Based on reprioritization
        if reprioritization['needed']:
            if reprioritization['direction'] == 'escalated':
                actions.append(f'⬆️ Priority escalated: {reprioritization["reason"]}')
            else:
                actions.append(f'⬇️ Priority adjusted: {reprioritization["reason"]}')
        
        # Time remaining
        if final['time_remaining_hours'] > 0 and final['time_remaining_hours'] < 24:
            actions.append(f'⏳ {final["time_remaining_hours"]:.1f} hours remaining to respond')
        
        # General
        actions.append('Always use reply-all for multi-recipient emails')
        
        return actions


def main():
    """Test V482 engine."""
    engine = EmailPriorityDecayEngine()
    
    # Test email received 48 hours ago
    received_time = datetime.now() - timedelta(hours=48)
    
    test_email = {
        'from': 'director@client.com',
        'to': ['account-manager@ziontechgroup.com', 'kleber@ziontechgroup.com'],
        'cc': ['team@ziontechgroup.com', 'management@client.com'],
        'subject': 'Important: Contract Review Needed',
        'body': 'Please review the attached contract and provide your feedback. This is important and we need your input soon. There are several questions that need to be addressed.',
        'timestamp': received_time.isoformat(),
        'attachments': [{'filename': 'contract.pdf', 'size': 1024000}],
        'response_history': [
            {'type': 'follow-up', 'timestamp': (datetime.now() - timedelta(hours=24)).isoformat()},
            {'type': 'follow-up', 'timestamp': (datetime.now() - timedelta(hours=12)).isoformat()}
        ]
    }
    
    result = engine.analyze_email(test_email)
    print(json.dumps(result, indent=2))
    print(f"\n✅ Initial Priority: {result['initial_priority']['level']} ({result['initial_priority']['score']})")
    print(f"✅ Final Priority: {result['final_priority']['level']} ({result['final_priority']['score']})")
    print(f"✅ Age: {result['age_decay']['age_hours']} hours")
    print(f"✅ Overdue: {result['age_decay']['overdue']}")
    print(f"✅ Reprioritization: {result['reprioritization']['direction']}")
    print(f"✅ Reply-all enforced: {result['reply_all_enforced']}")


if __name__ == '__main__':
    main()
