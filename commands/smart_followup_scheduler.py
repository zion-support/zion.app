#!/usr/bin/env python3
"""
Smart Follow-up Scheduler V23 — Schedules optimal follow-ups based on profiles
Tracks when to send follow-ups and learns best timing per sender.
"""

import json
from pathlib import Path
from datetime import datetime, timezone, timedelta

WORKSPACE = Path(__file__).resolve().parent.parent.parent

class SmartFollowUpSchedulerV23:
    """Learn optimal follow-up timing and schedule reminders."""

    # Default follow-up intervals by intent (in hours)
    DEFAULT_INTERVALS = {
        'booking': 24,
        'sales': 48,
        'support': 4,
        'urgent': 1,
        'cancellation': 2,
        'general': 72,
        'partnership': 48,
    }

    def __init__(self):
        self.followup_file = WORKSPACE / 'zion.app' / 'data' / 'followups_v23.json'
        self.timing_file = WORKSPACE / 'zion.app' / 'data' / 'followup_timing_v23.json'

    def _load_followups(self):
        try:
            return json.loads(self.followup_file.read_text())
        except Exception:
            return {'pending': [], 'completed': []}

    def _save_followups(self, data):
        self.followup_file.write_text(json.dumps(data, indent=2))

    def _load_timing(self):
        try:
            return json.loads(self.timing_file.read_text())
        except Exception:
            return {'per_intent': {}, 'per_sender': {}}

    def _save_timing(self, data):
        self.timing_file.write_text(json.dumps(data, indent=2))

    def schedule_followup(self, thread_id, sender, intent, urgency=3):
        """Schedule a follow-up based on intent and sender profile."""
        data = self._load_followups()
        now = datetime.now(timezone.utc)

        # Determine optimal delay
        base_hours = self.DEFAULT_INTERVALS.get(intent, 48)

        # Urgency reduces follow-up time
        urgency_multiplier = max(0.25, 1.0 - (urgency - 1) * 0.3)
        delay_hours = base_hours * urgency_multiplier

        # Check sender-specific timing learning
        timing_data = self._load_timing()
        sender_key = self._extract_sender_key(sender)
        if sender_key in timing_data.get('per_sender', {}):
            learned = timing_data['per_sender'][sender_key]
            if learned.get('optimal_hours'):
                delay_hours = learned['optimal_hours']

        scheduled_at = now + timedelta(hours=delay_hours)

        followup = {
            'thread_id': thread_id,
            'sender': sender,
            'intent': intent,
            'urgency': urgency,
            'delay_hours': round(delay_hours, 1),
            'scheduled_at': scheduled_at.isoformat(),
            'created_at': now.isoformat(),
            'status': 'pending',
        }

        data['pending'].append(followup)
        data['pending'].sort(key=lambda x: x['scheduled_at'])
        if len(data['pending']) > 50:
            data['pending'] = data['pending'][:50]

        self._save_followups(data)
        return followup

    def get_due_followups(self):
        """Get all follow-ups that are due now."""
        data = self._load_followups()
        now = datetime.now(timezone.utc)
        due = []
        remaining = []

        for f in data['pending']:
            try:
                scheduled = datetime.fromisoformat(f['scheduled_at'])
                if scheduled <= now:
                    due.append(f)
                else:
                    remaining.append(f)
            except Exception:
                continue

        data['pending'] = remaining
        self._save_followups(data)
        return due

    def mark_completed(self, thread_id, sender, outcome='positive'):
        """Mark a follow-up as completed and learn from timing."""
        data = self._load_followups()
        now = datetime.now(timezone.utc)

        for i, f in enumerate(data['pending']):
            if f['thread_id'] == thread_id:
                f['status'] = 'completed'
                f['completed_at'] = now.isoformat()
                f['outcome'] = outcome
                data['completed'].append(data['pending'].pop(i))
                if len(data['completed']) > 200:
                    data['completed'] = data['completed'][-200:]
                self._save_followups(data)

                # Learn timing
                self._learn_timing(sender, f.get('intent', 'general'),
                                  f.get('delay_hours', 48), outcome)
                return True

        return False

    def _learn_timing(self, sender, intent, actual_hours, outcome):
        """Learn from follow-up outcomes to optimize timing."""
        timing_data = self._load_timing()
        sender_key = self._extract_sender_key(sender)

        if sender_key not in timing_data['per_sender']:
            timing_data['per_sender'][sender_key] = {'attempts': 0, 'optimal_hours': None}

        stats = timing_data['per_sender'][sender_key]
        stats['attempts'] += 1

        # If positive outcome, this timing was good
        if outcome == 'positive':
            if stats['optimal_hours'] is None:
                stats['optimal_hours'] = actual_hours
            else:
                # Weighted moving average
                stats['optimal_hours'] = stats['optimal_hours'] * 0.7 + actual_hours * 0.3

        # Update intent-level statistics
        if intent not in timing_data['per_intent']:
            timing_data['per_intent'][intent] = {'attempts': 0, 'avg_hours': 0, 'positive_rate': 0}
        i_stats = timing_data['per_intent'][intent]
        total = i_stats['attempts'] + 1
        i_stats['avg_hours'] = (i_stats['avg_hours'] * i_stats['attempts'] + actual_hours) / total
        i_stats['attempts'] = total

        self._save_timing(timing_data)

    def _extract_sender_key(self, sender):
        import re
        m = re.search(r'<([^>]+)>', sender)
        email = m.group(1) if m else sender
        return email.split('@')[-1] if '@' in email else sender

    def get_pending_summary(self):
        """Get human-readable pending follow-ups summary."""
        data = self._load_followups()
        if not data['pending']:
            return "No pending follow-ups"

        lines = [f"📅 Pending follow-ups: {len(data['pending'])}"]
        for f in sorted(data['pending'], key=lambda x: x['scheduled_at'])[:5]:
            lines.append(f"  • [{f['intent']}] {f['sender'][:30]} → scheduled {f['scheduled_at'][:16]}")
        return '\n'.join(lines)