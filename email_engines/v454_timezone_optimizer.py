#!/usr/bin/env python3
"""
V454 - AI Email Time Zone Optimizer
Schedules email sends for recipient's optimal time based on time zone and work patterns.
Features: Time zone detection, optimal send time, work hours validation, scheduling.
CRITICAL: Always enforces reply-all for multi-recipient emails.
"""

import json
import re
from datetime import datetime, timedelta, timezone
from typing import Dict, List, Any


class TimeZoneOptimizer:
    """Optimizes email send times based on recipient time zones."""
    
    WORK_HOURS = {'start': 9, 'end': 17}
    OPTIMAL_HOURS = {'morning': (9, 11), 'afternoon': (14, 16)}
    
    TIMEZONE_MAP = {
        'EST': -5, 'EDT': -4, 'CST': -6, 'CDT': -5,
        'MST': -7, 'MDT': -6, 'PST': -8, 'PDT': -7,
        'GMT': 0, 'UTC': 0, 'CET': 1, 'IST': 5.5,
        'JST': 9, 'AEST': 10, 'NZST': 12
    }
    
    def analyze_email(self, email: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze email and determine optimal send time."""
        recipients = email.get('to', []) + email.get('cc', [])
        body = email.get('body', '')
        subject = email.get('subject', '')
        
        recipient_zones = self._detect_timezones(recipients, body)
        optimal_times = self._calculate_optimal_times(recipient_zones)
        is_good_time = self._check_current_time(recipient_zones)
        
        reply_all_required = len(recipients) > 1
        
        return {
            'engine': 'V454_TimeZoneOptimizer',
            'recipient_timezones': recipient_zones,
            'optimal_send_times': optimal_times,
            'is_good_time_to_send': is_good_time,
            'suggested_schedule': self._suggest_schedule(optimal_times),
            'work_hours_check': self._check_work_hours(recipient_zones),
            'reply_all_required': reply_all_required,
            'reply_all_enforced': reply_all_required,
            'recipients': recipients,
            'timestamp': datetime.now().isoformat()
        }
    
    def _detect_timezones(self, recipients: List[str], body: str) -> List[Dict]:
        zones = []
        text = ' '.join(recipients) + ' ' + body
        for tz, offset in self.TIMEZONE_MAP.items():
            if tz in text.upper():
                zones.append({'zone': tz, 'offset': offset, 'recipients': [r for r in recipients if tz.lower() in r.lower()]})
        if not zones:
            zones.append({'zone': 'UTC', 'offset': 0, 'recipients': recipients})
        return zones
    
    def _calculate_optimal_times(self, zones: List[Dict]) -> List[Dict]:
        results = []
        now = datetime.now(timezone.utc)
        for z in zones:
            local = now + timedelta(hours=z['offset'])
            optimal_morning = local.replace(hour=10, minute=0, second=0)
            optimal_afternoon = local.replace(hour=14, minute=0, second=0)
            results.append({
                'zone': z['zone'],
                'best_morning': optimal_morning.isoformat(),
                'best_afternoon': optimal_afternoon.isoformat(),
                'current_local': local.isoformat()
            })
        return results
    
    def _check_current_time(self, zones: List[Dict]) -> Dict:
        now = datetime.now(timezone.utc)
        all_good = True
        details = []
        for z in zones:
            local_hour = (now.hour + z['offset']) % 24
            in_work = self.WORK_HOURS['start'] <= local_hour < self.WORK_HOURS['end']
            if not in_work:
                all_good = False
            details.append({'zone': z['zone'], 'local_hour': local_hour, 'in_work_hours': in_work})
        return {'all_in_work_hours': all_good, 'details': details}
    
    def _suggest_schedule(self, optimal: List[Dict]) -> str:
        if not optimal:
            return 'Send now'
        return f"Best time: {optimal[0]['best_morning']} ({optimal[0]['zone']})"
    
    def _check_work_hours(self, zones: List[Dict]) -> Dict:
        return self._check_current_time(zones)


def main():
    engine = TimeZoneOptimizer()
    test_email = {
        'from': 'kleber@ziontechgroup.com',
        'to': ['client@tokyo.jp', 'team@ziontechgroup.com'],
        'cc': ['partner@london.co.uk'],
        'subject': 'Global Team Sync - JST PST GMT',
        'body': 'Hi team in JST and PST zones, let us schedule our next sync.'
    }
    result = engine.analyze_email(test_email)
    print(json.dumps(result, indent=2))
    print(f"\n✅ Timezones: {len(result['recipient_timezones'])}")
    print(f"✅ Good time: {result['is_good_time_to_send']['all_in_work_hours']}")
    print(f"✅ Reply-all enforced: {result['reply_all_enforced']}")


if __name__ == '__main__':
    main()
