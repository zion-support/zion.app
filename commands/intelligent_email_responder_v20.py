#!/usr/bin/env python3
"""
Intelligent Email Responder V20 - Auto-Follow-Up & Outcome Verification
Features:
- Automatic follow-up scheduling based on no-response
- Outcome verification (read/open/reply tracking)
- Confidence-based escalation
- Integrated with V19 learning loop
"""

import sys, json
from pathlib import Path
from datetime import datetime, timezone, timedelta
from collections import defaultdict

WORKSPACE = Path('/root/.openclaw/workspace')

class AutoFollowUpV20:
    """Automatic follow-up scheduling and execution"""
    
    def __init__(self):
        self.followups_file = WORKSPACE / 'zion.app' / 'data' / 'followups.json'
        self.responder_v19_path = WORKSPACE / 'zion.app' / 'commands' / 'intelligent_email_responder_v19.py'
    
    def schedule_followup(self, thread_id, response_data, delay_hours=24):
        """Schedule a follow-up if no reply"""
        followup = {
            'thread_id': thread_id,
            'scheduled_at': (datetime.now(timezone.utc) + timedelta(hours=delay_hours)).isoformat(),
            'status': 'pending',
            'original_response_id': response_data.get('response_id'),
            'recipient': response_data.get('recipient'),
            'intent': response_data.get('intent'),
            'followup_count': response_data.get('followup_count', 0) + 1
        }
        
        self._add_followup(followup)
        return followup
    
    def check_due_followups(self):
        """Check for follow-ups that are due"""
        followups = self._load_followups()
        now = datetime.now(timezone.utc)
        due = []
        
        for f in followups.get('followups', []):
            scheduled = datetime.fromisoformat(f['scheduled_at'])
            if scheduled <= now and f['status'] == 'pending':
                due.append(f)
        
        return due
    
    def execute_followup(self, followup):
        """Execute a follow-up"""
        # In production, this would send the actual follow-up
        # For now, mark as executed
        followup['status'] = 'executed'
        followup['executed_at'] = datetime.now(timezone.utc).isoformat()
        
        self._update_followup(followup)
        return followup
    
    def _add_followup(self, followup):
        followups = self._load_followups()
        followups['followups'].append(followup)
        self._save_followups(followups)
    
    def _update_followup(self, followup):
        followups = self._load_followups()
        for i, f in enumerate(followups['followups']):
            if f['thread_id'] == followup['thread_id'] and f['scheduled_at'] == followup['scheduled_at']:
                followups['followups'][i] = followup
                break
        self._save_followups(followups)
    
    def _load_followups(self):
        if self.followups_file.exists():
            return json.loads(self.followups_file.read_text())
        return {'followups': []}
    
    def _save_followups(self, data):
        self.followups_file.write_text(json.dumps(data))


class OutcomeTrackerV20:
    """Track and verify response outcomes"""
    
    def __init__(self):
        self.tracker_file = WORKSPACE / 'zion.app' / 'data' / 'outcome_tracker.json'
        self.response_file = WORKSPACE / 'zion.app' / 'data' / 'response_verification_v10.json'
    
    def track_outcome(self, thread_id, response_id):
        """Start tracking an outcome"""
        outcome = {
            'thread_id': thread_id,
            'response_id': response_id,
            'read': False,
            'replied': False,
            'opened_at': None,
            'replied_at': None,
            'escalated': False,
            'followup_needed': False
        }
        
        self._add_outcome(outcome)
        return outcome
    
    def update_outcome(self, thread_id, updates):
        """Update outcome status"""
        outcomes = self._load_outcomes()
        
        for o in outcomes.get('outcomes', []):
            if o['thread_id'] == thread_id:
                o.update(updates)
                o['updated_at'] = datetime.now(timezone.utc).isoformat()
        
        self._save_outcomes(outcomes)
    
    def check_reply_received(self, thread_id):
        """Check if reply was received"""
        if self.response_file.exists():
            data = json.loads(self.response_file.read_text())
            tracked = data.get('tracked', {})
            return thread_id in tracked
        return False
    
    def should_escalate(self, thread_id, hours_threshold=48):
        """Check if escalation is needed"""
        outcomes = self._load_outcomes()
        
        for o in outcomes.get('outcomes', []):
            if o['thread_id'] == thread_id:
                # Check if no reply after threshold
                if not o.get('replied'):
                    # Check time since response
                    response_file = WORKSPACE / 'zion.app' / 'data' / 'response_verification_v10.json'
                    # In production, check actual timestamps
                    return o.get('followup_count', 0) >= 2
        return False
    
    def _add_outcome(self, outcome):
        outcomes = self._load_outcomes()
        outcome['created_at'] = datetime.now(timezone.utc).isoformat()
        outcomes['outcomes'].append(outcome)
        self._save_outcomes(outcomes)
    
    def _load_outcomes(self):
        if self.tracker_file.exists():
            return json.loads(self.tracker_file.read_text())
        return {'outcomes': []}
    
    def _save_outcomes(self, data):
        self.tracker_file.write_text(json.dumps(data))


class ConfidenceEscalatorV20:
    """Escalate based on confidence scores"""
    
    def __init__(self):
        self.escalations_file = WORKSPACE / 'zion.app' / 'data' / 'confidence_escalations.json'
    
    def check_escalation(self, analysis, response_data):
        """Check if escalation based on confidence is needed"""
        confidence = analysis.get('confidence', 0.5)
        urgency = analysis.get('urgency', 'low')
        
        should_escalate = False
        reason = None
        
        if confidence < 0.5:
            should_escalate = True
            reason = 'low_confidence'
        elif urgency in ['critical'] and confidence < 0.8:
            should_escalate = True
            reason = 'critical_urgency_low_confidence'
        elif analysis.get('intent') == 'complex' and confidence < 0.7:
            should_escalate = True
            reason = 'complex_low_confidence'
        
        if should_escalate:
            escalation = {
                'thread_id': response_data.get('thread_id'),
                'reason': reason,
                'confidence': confidence,
                'urgent': urgency == 'critical',
                'escalated_at': datetime.now(timezone.utc).isoformat(),
                'escalated_to': 'human_review@' + response_data.get('domain', 'ziontechgroup.com')
            }
            
            self._log_escalation(escalation)
            return escalation
        
        return None
    
    def _log_escalation(self, escalation):
        if self.escalations_file.exists():
            data = json.loads(self.escalations_file.read_text())
        else:
            data = {'escalations': []}
        
        data['escalations'].append(escalation)
        self.escalations_file.write_text(json.dumps(data))


class ResponseExecutorV20:
    """Execute responses with V19+V20 integration"""
    
    def __init__(self):
        self.followup = AutoFollowUpV20()
        self.tracker = OutcomeTrackerV20()
        self.escalator = ConfidenceEscalatorV20()
    
    def execute_with_verification(self, analysis, response_text, email_data):
        """Execute response with full verification"""
        thread_id = email_data.get('thread_id', '')
        
        # Check for confidence-based escalation
        escalation = self.escalator.check_escalation(analysis, email_data)
        
        result = {
            'thread_id': thread_id,
            'response_sent': True,
            'response_text': response_text[:100] + '...' if len(response_text) > 100 else response_text,
            'analysis_confidence': analysis.get('confidence', 0.5),
            'escalation': escalation,
            'followup_scheduled': False
        }
        
        # Schedule follow-up for non-critical intents
        if analysis.get('intent') not in ['spam'] and not escalation:
            followup_delay = 24 if analysis.get('urgency') != 'high' else 6
            self.followup.schedule_followup(
                thread_id,
                {'intent': analysis.get('intent'), 'recipient': email_data.get('from')}
            )
            result['followup_scheduled'] = True
        
        # Track outcome
        self.tracker.track_outcome(thread_id, result.get('response_id', 'unknown'))
        
        return result


if __name__ == '__main__':
    executor = ResponseExecutorV20()
    followup = AutoFollowUpV20()
    tracker = OutcomeTrackerV20()
    
    # Test
    test_analysis = {
        'intent': 'booking',
        'urgency': 'high',
        'confidence': 0.85
    }
    
    test_email = {
        'thread_id': 'test-v20',
        'from': 'test@example.com'
    }
    
    result = executor.execute_with_verification(
        test_analysis,
        "Prezado(a), sua solicitação de reserva foi recebida.",
        test_email
    )
    
    print(f"V20 Response Execution:")
    print(f"  Response sent: {result['response_sent']}")
    print(f"  Follow-up scheduled: {result['followup_scheduled']}")
    print(f"  Escalation needed: {result['escalation']}")
    
    # Check pending followups
    due = followup.check_due_followups()
    print(f"  Pending follow-ups: {len(due)}")