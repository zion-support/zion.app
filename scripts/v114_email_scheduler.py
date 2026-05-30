#!/usr/bin/env python3
"""
V114: AI Email Scheduler & Time Zone Optimizer
Predict perfect send times, batch scheduling, smart queuing, timezone-aware delivery.
"""
import json, hashlib, math
from datetime import datetime, timedelta, timezone
from dataclasses import dataclass, field
from typing import List, Dict, Optional, Tuple
from enum import Enum
from collections import defaultdict

class SendPriority(Enum):
    IMMEDIATE = "immediate"
    HIGH = "high"
    OPTIMAL = "optimal"
    BATCH = "batch"
    SNOOZE = "snooze"

class RecipientStatus(Enum):
    ACTIVE = "active"
    SLOW_RESPONDER = "slow_responder"
    TIMEZONE_DIFFERENT = "timezone_different"
    OUT_OF_OFFICE = "out_of_office"
    VIP = "vip"

@dataclass
class ScheduleResult:
    email_id: str
    recipient: str
    optimal_send_time: datetime
    predicted_open_rate: float
    predicted_response_rate: float
    timezone_offset_hours: int
    priority: SendPriority
    batch_group: Optional[str]
    reason: str
    reply_all_confirmed: bool

@dataclass
class RecipientProfile:
    email: str
    timezone: str
    preferred_hours: Tuple[int, int]  # (start, end) in their local time
    avg_response_time_hours: float
    open_rate: float
    response_rate: float
    status: RecipientStatus
    last_interaction: Optional[datetime] = None
    interaction_count: int = 0

class EmailSchedulerOptimizer:
    """V114: Predict perfect send times and optimize delivery schedules."""
    
    TIMEZONE_OFFSETS = {
        "EST": -5, "CST": -6, "MST": -7, "PST": -8,
        "GMT": 0, "CET": 1, "IST": 5.5, "JST": 9,
        "AEST": 10, "NZST": 12, "BRT": -3, "ART": -3,
    }
    
    DOMAIN_TIMEZONE_HINTS = {
        ".jp": "JST", ".uk": "GMT", ".de": "CET", ".fr": "CET",
        ".br": "BRT", ".in": "IST", ".au": "AEST", ".nz": "NZST",
        ".ar": "ART", ".mx": "CST", ".ca": "EST",
    }
    
    def __init__(self):
        self.recipient_profiles: Dict[str, RecipientProfile] = {}
        self.scheduled_queue: List[Dict] = []
        self.send_history: List[Dict] = []
        self.batch_groups: Dict[str, List] = defaultdict(list)
    
    def schedule_email(self, email: Dict, recipients: List[str], cc_list: List[str] = None) -> List[ScheduleResult]:
        """Schedule email for optimal delivery to all recipients."""
        cc_list = cc_list or []
        all_recipients = recipients + cc_list
        results = []
        
        for recipient in all_recipients:
            profile = self._get_or_create_profile(recipient)
            now = datetime.now(timezone.utc)
            
            # Calculate optimal send time
            optimal_time, reason = self._calculate_optimal_time(profile, now, email)
            
            # Predict engagement
            open_rate = self._predict_open_rate(profile, optimal_time)
            response_rate = self._predict_response_rate(profile, email, optimal_time)
            
            # Determine priority
            priority = self._determine_priority(email, profile, optimal_time, now)
            
            # Batch grouping
            batch_group = self._assign_batch_group(profile, email)
            
            # Reply-all confirmation
            reply_all = len(all_recipients) > 1
            
            email_id = hashlib.md5(f"{email.get('subject', '')}{recipient}{now.isoformat()}".encode()).hexdigest()[:12]
            
            result = ScheduleResult(
                email_id=email_id,
                recipient=recipient,
                optimal_send_time=optimal_time,
                predicted_open_rate=open_rate,
                predicted_response_rate=response_rate,
                timezone_offset_hours=int(self.TIMEZONE_OFFSETS.get(profile.timezone, 0)),
                priority=priority,
                batch_group=batch_group,
                reason=reason,
                reply_all_confirmed=reply_all
            )
            results.append(result)
            
            # Add to queue
            self.scheduled_queue.append({
                "email_id": email_id,
                "recipient": recipient,
                "send_time": optimal_time.isoformat(),
                "priority": priority.value,
                "subject": email.get("subject", ""),
                "reply_all": reply_all
            })
        
        return results
    
    def _get_or_create_profile(self, recipient: str) -> RecipientProfile:
        if recipient in self.recipient_profiles:
            return self.recipient_profiles[recipient]
        
        # Infer timezone from domain
        tz = "EST"  # default
        domain = recipient.split("@")[-1].lower() if "@" in recipient else ""
        for hint, tz_val in self.DOMAIN_TIMEZONE_HINTS.items():
            if domain.endswith(hint):
                tz = tz_val
                break
        
        profile = RecipientProfile(
            email=recipient,
            timezone=tz,
            preferred_hours=(9, 17),
            avg_response_time_hours=4.0,
            open_rate=0.65,
            response_rate=0.35,
            status=RecipientStatus.ACTIVE,
            interaction_count=0
        )
        self.recipient_profiles[recipient] = profile
        return profile
    
    def _calculate_optimal_time(self, profile: RecipientProfile, now: datetime, email: Dict) -> Tuple[datetime, str]:
        tz_offset = self.TIMEZONE_OFFSETS.get(profile.timezone, 0)
        recipient_now = now + timedelta(hours=tz_offset)
        
        start_hour, end_hour = profile.preferred_hours
        local_hour = recipient_now.hour
        
        # Check for urgent emails
        body = email.get("body", "").lower()
        subject = email.get("subject", "").lower()
        is_urgent = any(w in body + " " + subject for w in ["urgent", "asap", "critical", "emergency"])
        
        if is_urgent:
            return now, "URGENT: Sending immediately regardless of timezone"
        
        # If within preferred hours, send now
        if start_hour <= local_hour < end_hour:
            # Optimize for mid-morning (10-11am) which has highest open rates
            if 10 <= local_hour <= 11:
                return now, f"Peak engagement window ({local_hour}:00 local time)"
            return now, f"Within preferred hours ({start_hour}-{end_hour} {profile.timezone})"
        
        # Calculate next optimal window
        if local_hour < start_hour:
            wait_hours = start_hour - local_hour
        else:
            wait_hours = (24 - local_hour) + start_hour
        
        optimal = now + timedelta(hours=wait_hours)
        return optimal, f"Scheduled for {start_hour}:00 {profile.timezone} (next business window)"
    
    def _predict_open_rate(self, profile: RecipientProfile, send_time: datetime) -> float:
        tz_offset = self.TIMEZONE_OFFSETS.get(profile.timezone, 0)
        local_hour = (send_time.hour + tz_offset) % 24
        
        # Open rate by hour of day (peaks at 10-11am)
        hour_factors = {
            6: 0.3, 7: 0.45, 8: 0.6, 9: 0.75, 10: 0.92, 11: 0.88,
            12: 0.7, 13: 0.72, 14: 0.8, 15: 0.75, 16: 0.65, 17: 0.5,
            18: 0.35, 19: 0.25, 20: 0.2, 21: 0.15, 22: 0.1,
        }
        factor = hour_factors.get(local_hour, 0.15)
        return round(min(0.98, profile.open_rate * factor / 0.65), 2)
    
    def _predict_response_rate(self, profile: RecipientProfile, email: Dict, send_time: datetime) -> float:
        base = profile.response_rate
        # Tuesday-Thursday have highest response rates
        day = send_time.weekday()
        day_factor = {0: 0.9, 1: 1.1, 2: 1.15, 3: 1.1, 4: 0.95, 5: 0.6, 6: 0.4}.get(day, 0.8)
        return round(min(0.95, base * day_factor), 2)
    
    def _determine_priority(self, email: Dict, profile: RecipientProfile, optimal: datetime, now: datetime) -> SendPriority:
        body = (email.get("body", "") + " " + email.get("subject", "")).lower()
        if any(w in body for w in ["urgent", "asap", "critical", "emergency"]):
            return SendPriority.IMMEDIATE
        if profile.status == RecipientStatus.VIP:
            return SendPriority.HIGH
        
        delay = (optimal - now).total_seconds() / 3600
        if delay <= 0:
            return SendPriority.OPTIMAL
        if delay <= 4:
            return SendPriority.HIGH
        if delay <= 24:
            return SendPriority.BATCH
        return SendPriority.SNOOZE
    
    def _assign_batch_group(self, profile: RecipientProfile, email: Dict) -> Optional[str]:
        return f"batch_{profile.timezone}_{profile.preferred_hours[0]}am"
    
    def learn_from_delivery(self, email_id: str, opened: bool, responded: bool, response_time_hours: float = None):
        """Learn from delivery outcomes to improve future scheduling."""
        for entry in self.scheduled_queue:
            if entry["email_id"] == email_id:
                recipient = entry["recipient"]
                if recipient in self.recipient_profiles:
                    p = self.recipient_profiles[recipient]
                    p.interaction_count += 1
                    # Update open rate with exponential moving average
                    p.open_rate = p.open_rate * 0.8 + (1.0 if opened else 0.0) * 0.2
                    p.response_rate = p.response_rate * 0.8 + (1.0 if responded else 0.0) * 0.2
                    if response_time_hours:
                        p.avg_response_time_hours = p.avg_response_time_hours * 0.7 + response_time_hours * 0.3
                break
    
    def get_queue_status(self) -> Dict:
        now = datetime.now(timezone.utc)
        pending = [q for q in self.scheduled_queue if datetime.fromisoformat(q["send_time"]) > now]
        ready = [q for q in self.scheduled_queue if datetime.fromisoformat(q["send_time"]) <= now]
        return {
            "total_scheduled": len(self.scheduled_queue),
            "pending": len(pending),
            "ready_to_send": len(ready),
            "batch_groups": dict(self.batch_groups),
            "recipient_profiles": len(self.recipient_profiles),
            "engine_version": "V114"
        }

if __name__ == "__main__":
    scheduler = EmailSchedulerOptimizer()
    
    test_emails = [
        {"subject": "Urgent: Production issue needs immediate attention", "body": "We have a critical production issue. Need your input ASAP.", "recipients": ["dev@company.jp", "ops@company.uk"], "cc": ["manager@company.com"]},
        {"subject": "Weekly team update", "body": "Here is our weekly progress report and upcoming priorities.", "recipients": ["team@startup.br", "lead@startup.com"], "cc": ["vp@startup.com", "cto@startup.de"]},
        {"subject": "Partnership proposal", "body": "We would love to discuss a potential partnership opportunity.", "recipients": ["biz@enterprise.in"], "cc": ["partnerships@enterprise.com"]},
    ]
    
    print("=" * 60)
    print("V114: AI Email Scheduler & Time Zone Optimizer")
    print("=" * 60)
    
    for i, email in enumerate(test_emails, 1):
        results = scheduler.schedule_email(email, email["recipients"], email.get("cc", []))
        print(f"\n--- Email #{i}: {email['subject']} ---")
        for r in results:
            print(f"  Recipient: {r.recipient}")
            print(f"    Send Time: {r.optimal_send_time.strftime('%Y-%m-%d %H:%M UTC')}")
            print(f"    Timezone: UTC{r.timezone_offset_hours:+d}")
            print(f"    Priority: {r.priority.value}")
            print(f"    Predicted Open Rate: {r.predicted_open_rate:.0%}")
            print(f"    Predicted Response: {r.predicted_response_rate:.0%}")
            print(f"    Reply-All: {r.reply_all_confirmed}")
            print(f"    Reason: {r.reason}")
    
    # Simulate learning
    scheduler.learn_from_delivery("test123", opened=True, responded=True, response_time_hours=2.5)
    
    print(f"\n--- Queue Status ---")
    status = scheduler.get_queue_status()
    for k, v in status.items():
        print(f"  {k}: {v}")
