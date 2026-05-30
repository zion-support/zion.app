#!/usr/bin/env python3
"""V183 - AI Email Time Zone Coordinator
Detects recipient time zones, schedules sends optimally, coordinates across global teams,
and ensures reply-all timing respects all participants' business hours."""
import json, hashlib
from datetime import datetime, timedelta
from typing import Dict, List, Any
from collections import defaultdict

class TimezoneCoordinator:
    ZONES = {
        "EST": -5, "EDT": -4, "CST": -6, "CDT": -5, "MST": -7, "MDT": -6,
        "PST": -8, "PDT": -7, "GMT": 0, "BST": 1, "CET": 1, "CEST": 2,
        "IST": 5.5, "JST": 9, "KST": 9, "CST_CN": 8, "AEST": 10, "AEDT": 11,
        "BRT": -3, "ART": -3, "SAST": 2, "NZST": 12
    }
    DOMAIN_ZONES = {
        ".uk": "GMT", ".de": "CET", ".fr": "CET", ".es": "CET", ".it": "CET",
        ".jp": "JST", ".kr": "KST", ".cn": "CST_CN", ".in": "IST", ".br": "BRT",
        ".au": "AEST", ".nz": "NZST", ".za": "SAST", ".ar": "ART", ".mx": "CST"
    }

    def __init__(self):
        self.contact_zones = {}
        self.send_history = []

    def analyze_timezone_context(self, email: Dict[str, Any]) -> Dict[str, Any]:
        sender = email.get("from", "")
        recipients = [sender] + email.get("to", []) + email.get("cc", [])
        recipients = list(set(r for r in recipients if r))
        tz_map = {}
        for r in recipients:
            tz_map[r] = self._detect_timezone(r)
        now_utc = datetime.utcnow()
        local_times = {r: self._to_local(now_utc, tz) for r, tz in tz_map.items()}
        business_hours = {r: self._is_business_hours(lt) for r, lt in local_times.items()}
        overlap = self._find_business_overlap(tz_map)
        optimal_send = self._recommend_send_time(tz_map, now_utc)
        return {
            "coordination_id": hashlib.md5(f"{sender}{datetime.now().isoformat()}".encode()).hexdigest()[:12],
            "participants": len(recipients),
            "timezone_map": {r: {"timezone": tz, "local_time": local_times[r].strftime("%Y-%m-%d %H:%M"), "is_business_hours": business_hours[r]} for r, tz in tz_map.items()},
            "business_hours_overlap": overlap,
            "optimal_send_window": optimal_send,
            "scheduling_recommendation": self._generate_scheduling_rec(overlap, optimal_send),
            "reply_all_timing": self._reply_all_timing_check(business_hours, tz_map),
            "global_meeting_slots": self._suggest_meeting_slots(tz_map)
        }

    def _detect_timezone(self, email: str) -> str:
        if email in self.contact_zones:
            return self.contact_zones[email]
        domain = email.split("@")[-1].lower() if "@" in email else ""
        for suffix, tz in self.DOMAIN_ZONES.items():
            if domain.endswith(suffix):
                return tz
        if domain.endswith(".com") or domain.endswith(".org"):
            return "EST"
        return "GMT"

    def _to_local(self, utc_time: datetime, tz_code: str) -> datetime:
        offset = self.ZONES.get(tz_code, 0)
        return utc_time + timedelta(hours=offset)

    def _is_business_hours(self, local_time: datetime) -> bool:
        if local_time.weekday() >= 5:
            return False
        return 9 <= local_time.hour < 17

    def _find_business_overlap(self, tz_map: Dict[str, str]) -> Dict[str, Any]:
        now_utc = datetime.utcnow()
        zones = set(tz_map.values())
        offsets = sorted(set(self.ZONES.get(z, 0) for z in zones))
        if not offsets:
            return {"overlap_hours_utc": [], "overlap_duration_hours": 0}
        min_offset, max_offset = offsets[0], offsets[-1]
        earliest_start_utc = 9 - min_offset
        latest_end_utc = 17 - max_offset
        if earliest_start_utc >= latest_end_utc:
            return {"overlap_hours_utc": "No overlap", "overlap_duration_hours": 0, "note": "Consider async communication"}
        return {"overlap_hours_utc": f"{int(earliest_start_utc):02d}:00 - {int(latest_end_utc):02d}:00 UTC", "overlap_duration_hours": round(latest_end_utc - earliest_start_utc, 1)}

    def _recommend_send_time(self, tz_map: Dict[str, str], now_utc: datetime) -> Dict[str, Any]:
        best_hour_utc = None
        best_score = -1
        for hour in range(24):
            test_time = now_utc.replace(hour=hour, minute=0)
            score = sum(1 for r, tz in tz_map.items() if self._is_business_hours(self._to_local(test_time, tz)))
            if score > best_score:
                best_score = score
                best_hour_utc = hour
        return {"recommended_hour_utc": f"{best_hour_utc:02d}:00 UTC", "recipients_in_business_hours": best_score, "total_recipients": len(tz_map)}

    def _generate_scheduling_rec(self, overlap: Dict, optimal: Dict) -> str:
        if overlap.get("overlap_duration_hours", 0) > 4:
            return f"Good overlap — schedule during {overlap['overlap_hours_utc']}"
        elif overlap.get("overlap_duration_hours", 0) > 0:
            return f"Limited overlap — use {overlap['overlap_hours_utc']} wisely for critical communications"
        return "No business hours overlap — consider async communication or find compromise time"

    def _reply_all_timing_check(self, business_hours: Dict[str, bool], tz_map: Dict[str, str]) -> Dict[str, Any]:
        all_in_bh = all(business_hours.values())
        some_in_bh = any(business_hours.values())
        return {
            "all_in_business_hours": all_in_bh,
            "some_in_business_hours": some_in_bh,
            "recommendation": "Reply All now — all recipients available" if all_in_bh else "Reply All OK — at least some recipients are online" if some_in_bh else "Consider scheduling Reply All for better engagement"
        }

    def _suggest_meeting_slots(self, tz_map: Dict[str, str]) -> List[Dict[str, str]]:
        now_utc = datetime.utcnow()
        slots = []
        for hour in range(24):
            test_time = now_utc.replace(hour=hour, minute=0)
            available = [(r, self._to_local(test_time, tz).strftime("%H:%M")) for r, tz in tz_map.items() if self._is_business_hours(self._to_local(test_time, tz))]
            if len(available) == len(tz_map):
                slots.append({"utc_time": f"{hour:02d}:00 UTC", "local_times": {r: t for r, t in available}, "all_available": True})
        return slots[:3]

if __name__ == "__main__":
    coord = TimezoneCoordinator()
    result = coord.analyze_timezone_context({"from": "alice@ziontechgroup.com", "to": ["bob@company.co.uk", "tanaka@client.co.jp"], "cc": ["priya@partner.in"], "subject": "Global project sync"})
    print(json.dumps(result, indent=2))
