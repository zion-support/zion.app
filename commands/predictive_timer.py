#!/usr/bin/env python3
"""
Predictive Timer V21 — extracted from intelligent_email_responder_v22.py
Suggests optimal send-time delay based on urgency + recipient profile.
"""

import json
from pathlib import Path
from datetime import datetime, timezone, timedelta

WORKSPACE = Path('/root/.openclaw/workspace')

class PredictiveTimerV21:
    def __init__(self):
        self.timing_file = WORKSPACE / 'zion.app' / 'data' / 'response_timing.json'

    def predict_optimal_time(self, recipient_profile=None, urgency='low'):
        """Return ISO timestamp for the best time to send a response."""
        recipient_profile = recipient_profile or {}
        tz = recipient_profile.get('timezone', -3)
        urgency_map = {'critical': 5, 'high': 30, 'medium': 60, 'low': 120}
        minute_map = {'critical': 5, 'high': 30, 'medium': 60, 'low': 120}
        delay = minute_map.get(urgency, 120)

        # During business hours send immediately unless high urgency
        now = datetime.now(timezone.utc)
        local_hour = (now.hour + tz + 24) % 24
        if urgency not in ('critical', 'high') and 9 <= local_hour <= 17:
            delay = max(delay, 5)  # still in business hours → 5 min

        elif urgency not in ('critical', 'high') and local_hour >= 20:
            delay = 480  # late night → next morning (8 h)

        send_at = now + timedelta(minutes=delay)
        return send_at.isoformat()

    def record_send(self, thread_id, sender, intent, response_time_sec):
        data = {}
        if self.timing_file.exists():
            try:
                data = json.loads(self.timing_file.read_text())
            except Exception:
                data = {}
        sender_key = f"{thread_id}:{sender}"
        if sender_key not in data:
            data[sender_key] = {'sends': [], 'avg_response_time': 0}
        data[sender_key]['sends'].append({
            'intent': intent,
            'response_time_sec': response_time_sec,
            'ts': datetime.now(timezone.utc).isoformat(),
        })
        sends = data[sender_key]['sends'][-50:]
        avg = sum(s['response_time_sec'] for s in sends) / max(len(sends), 1)
        data[sender_key]['avg_response_time'] = round(avg, 1)
        self.timing_file.write_text(json.dumps(data, indent=2))

    def get_avg_response_time(self, sender: str, default: float = 3600.0) -> float:
        if not self.timing_file.exists():
            return default
        try:
            data = json.loads(self.timing_file.read_text())
            key = next((k for k in data if sender in k), None)
            if key is not None:
                return data[key].get('avg_response_time', default)
            return default
        except Exception:
            return default
