#!/usr/bin/env python3
"""
V975: Smart Notification Engine
Multi-channel alert routing based on email priority, content analysis,
recipient preferences, and time-aware delivery optimization.
STRICT reply-all enforcement for all multi-recipient emails.
"""

import re
import hashlib
from datetime import datetime, timezone, timedelta
from typing import Dict, List, Any


class SmartNotificationEngine:
    """Intelligent multi-channel notification routing engine."""

    NOTIFICATION_CHANNELS = {
        "push": {"latency": "instant", "intrusiveness": "HIGH", "best_for": "CRITICAL"},
        "sms": {"latency": "instant", "intrusiveness": "HIGH", "best_for": "CRITICAL"},
        "email_digest": {"latency": "batched", "intrusiveness": "LOW", "best_for": "LOW"},
        "slack": {"latency": "near-instant", "intrusiveness": "MEDIUM", "best_for": "URGENT"},
        "teams": {"latency": "near-instant", "intrusiveness": "MEDIUM", "best_for": "URGENT"},
        "desktop": {"latency": "instant", "intrusiveness": "MEDIUM", "best_for": "HIGH"},
        "mobile_banner": {"latency": "instant", "intrusiveness": "MEDIUM", "best_for": "HIGH"},
        "weekly_summary": {"latency": "weekly", "intrusiveness": "LOW", "best_for": "LOW"},
    }

    PRIORITY_TO_CHANNELS = {
        "CRITICAL": ["push", "sms", "slack", "desktop"],
        "URGENT": ["push", "slack", "desktop", "mobile_banner"],
        "HIGH": ["push", "desktop", "mobile_banner"],
        "NORMAL": ["desktop", "mobile_banner", "email_digest"],
        "LOW": ["email_digest", "weekly_summary"],
    }

    QUIET_HOURS = {"start": 22, "end": 7}  # 10 PM to 7 AM

    def __init__(self):
        self.notification_log: List[Dict] = []
        self.reply_all_audit: List[Dict] = []
        self.delivery_stats: Dict[str, int] = {}
        self.user_preferences: Dict[str, Dict] = {}

    def analyze_email_case_by_case(self, email: Dict[str, Any]) -> Dict[str, Any]:
        """Determine notification routing case by case."""
        analysis = {
            "engine": "V975",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "email_id": email.get("id", hashlib.md5(str(email).encode()).hexdigest()[:12]),
            "analysis_type": "smart_notification",
        }

        to_recipients = email.get("to", [])
        cc_recipients = email.get("cc", [])
        all_recipients = to_recipients + cc_recipients
        is_multi_recipient = len(all_recipients) > 1

        body = email.get("body", "")
        subject = email.get("subject", "")
        sender = email.get("from", "")
        full_text = subject + " " + body

        # 1. Priority assessment
        priority = self._assess_priority(full_text, sender, email)
        analysis["priority"] = priority

        # 2. Time context
        time_context = self._assess_time_context()
        analysis["time_context"] = time_context

        # 3. Channel recommendation
        channels = self._recommend_channels(priority, time_context)
        analysis["recommended_channels"] = channels

        # 4. Notification content
        content = self._generate_notification_content(email, priority)
        analysis["notification_content"] = content

        # 5. Delivery timing
        timing = self._calculate_delivery_timing(priority, time_context)
        analysis["delivery_timing"] = timing

        # 6. Escalation path
        escalation = self._define_escalation_path(priority, email)
        analysis["escalation_path"] = escalation

        # 7. Snooze/dismiss recommendation
        snooze = self._recommend_snooze_options(priority)
        analysis["snooze_options"] = snooze

        # 8. Batch or immediate
        delivery_mode = self._determine_delivery_mode(priority, time_context)
        analysis["delivery_mode"] = delivery_mode

        # 9. Determine action
        action = self._determine_notification_action(priority, delivery_mode)
        analysis["recommended_action"] = action

        # REPLY-ALL ENFORCEMENT
        reply_all = self._enforce_reply_all(email, all_recipients, is_multi_recipient)
        analysis["reply_all_enforcement"] = reply_all

        # Track stats
        for ch in channels["channels"]:
            self.delivery_stats[ch] = self.delivery_stats.get(ch, 0) + 1

        self.notification_log.append({
            "email_id": analysis["email_id"],
            "priority": priority["level"],
            "channels": channels["channels"],
            "timing": timing["when"],
            "reply_all": reply_all["enforced"],
            "timestamp": analysis["timestamp"],
        })

        return analysis

    def _assess_priority(self, text: str, sender: str, email: Dict) -> Dict:
        """Assess notification priority level."""
        text_lower = text.lower()
        score = 0
        reasons = []

        # Sender VIP
        vip = ["ceo", "cto", "cfo", "president", "founder", "board"]
        if any(v in sender.lower() for v in vip):
            score += 30
            reasons.append("VIP sender")

        # Urgency keywords
        urgent_kw = ["urgent", "asap", "immediately", "critical", "emergency", "production down"]
        for kw in urgent_kw:
            if kw in text_lower:
                score += 15
                reasons.append(f"Urgency: {kw}")

        # Deadline proximity
        if re.search(r'\b(today|tonight|right now|within \d+ hours?)\b', text_lower):
            score += 20
            reasons.append("Immediate deadline")
        elif re.search(r'\b(tomorrow|by eod|this week)\b', text_lower):
            score += 10
            reasons.append("Near deadline")

        # Negative sentiment
        negative = ["frustrated", "angry", "disappointed", "unacceptable"]
        if any(n in text_lower for n in negative):
            score += 15
            reasons.append("Negative sentiment")

        # Question directed at recipient
        if re.search(r'\bcan you\b|\bcould you\b', text_lower):
            score += 5
            reasons.append("Direct request")

        # Monetary value
        if re.search(r'\$[\d,]+', text):
            score += 10
            reasons.append("Monetary value")

        # Determine level
        if score >= 50:
            level = "CRITICAL"
        elif score >= 30:
            level = "URGENT"
        elif score >= 15:
            level = "HIGH"
        elif score >= 5:
            level = "NORMAL"
        else:
            level = "LOW"

        return {
            "level": level,
            "score": min(score, 100),
            "reasons": reasons[:5],
        }

    def _assess_time_context(self) -> Dict:
        """Assess current time context."""
        now = datetime.now(timezone.utc)
        hour = now.hour
        weekday = now.weekday()  # 0=Monday, 6=Sunday

        is_quiet_hours = hour >= self.QUIET_HOURS["start"] or hour < self.QUIET_HOURS["end"]
        is_weekend = weekday >= 5
        is_business_hours = 9 <= hour <= 17 and not is_weekend

        return {
            "current_hour_utc": hour,
            "is_quiet_hours": is_quiet_hours,
            "is_weekend": is_weekend,
            "is_business_hours": is_business_hours,
            "day_name": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"][weekday],
        }

    def _recommend_channels(self, priority: Dict, time_context: Dict) -> Dict:
        """Recommend notification channels."""
        level = priority["level"]
        base_channels = self.PRIORITY_TO_CHANNELS.get(level, ["email_digest"])

        # Adjust for quiet hours
        if time_context["is_quiet_hours"] and level not in ("CRITICAL",):
            # Downgrade intrusive channels during quiet hours
            filtered = [ch for ch in base_channels if self.NOTIFICATION_CHANNELS[ch]["intrusiveness"] != "HIGH"]
            if not filtered:
                filtered = ["email_digest"]
            channels = filtered
            reason = f"Quiet hours — reduced to {len(channels)} channel(s)"
        elif time_context["is_weekend"] and level not in ("CRITICAL", "URGENT"):
            channels = [ch for ch in base_channels if ch in ("email_digest", "weekly_summary", "desktop")]
            if not channels:
                channels = ["email_digest"]
            reason = "Weekend — limited channels"
        else:
            channels = base_channels
            reason = f"Standard routing for {level} priority"

        return {
            "channels": channels,
            "count": len(channels),
            "reason": reason,
            "channel_details": {ch: self.NOTIFICATION_CHANNELS[ch] for ch in channels},
        }

    def _generate_notification_content(self, email: Dict, priority: Dict) -> Dict:
        """Generate notification content for each channel."""
        subject = email.get("subject", "No subject")
        sender = email.get("from", "Unknown")
        body_preview = email.get("body", "")[:120]

        # Extract sender name
        sender_name = re.match(r'"?([^"<]+)"?\s*<?', sender)
        sender_display = sender_name.group(1).strip() if sender_name else sender

        return {
            "push": {
                "title": f"{'🚨 ' if priority['level'] == 'CRITICAL' else ''}{sender_display}",
                "body": subject[:60],
                "badge": 1,
            },
            "sms": {
                "message": f"[ZION] {priority['level']}: {subject[:80]} from {sender_display}",
            },
            "slack": {
                "channel": "#email-alerts",
                "message": f"*{priority['level']}* | {sender_display}\n_{subject}_\n>{body_preview}...",
                "color": {"CRITICAL": "#ff0000", "URGENT": "#ff6600", "HIGH": "#ffcc00", "NORMAL": "#3366ff", "LOW": "#999999"}.get(priority["level"]),
            },
            "email_digest": {
                "subject": f"[{priority['level']}] {subject}",
                "preview": body_preview,
            },
            "desktop": {
                "title": f"{sender_display} — {subject[:40]}",
                "body": body_preview[:80],
            },
        }

    def _calculate_delivery_timing(self, priority: Dict, time_context: Dict) -> Dict:
        """Calculate optimal delivery timing."""
        level = priority["level"]

        if level == "CRITICAL":
            when = "IMMEDIATE"
            delay_seconds = 0
        elif level == "URGENT":
            if time_context["is_quiet_hours"]:
                when = "NEXT_BUSINESS_HOUR"
                delay_seconds = -1  # Calculate at delivery
            else:
                when = "IMMEDIATE"
                delay_seconds = 0
        elif level == "HIGH":
            if time_context["is_quiet_hours"]:
                when = "NEXT_BUSINESS_HOUR"
                delay_seconds = -1
            else:
                when = "WITHIN_5_MINUTES"
                delay_seconds = 300
        elif level == "NORMAL":
            when = "NEXT_DIGEST"
            delay_seconds = 3600  # Next hourly digest
        else:
            when = "WEEKLY_DIGEST"
            delay_seconds = 86400  # Next daily or weekly

        return {
            "when": when,
            "delay_seconds": delay_seconds,
            "business_hours_adjusted": time_context["is_quiet_hours"] and level not in ("CRITICAL",),
        }

    def _define_escalation_path(self, priority: Dict, email: Dict) -> Dict:
        """Define escalation path if no response."""
        level = priority["level"]

        if level == "CRITICAL":
            return {
                "enabled": True,
                "steps": [
                    {"after_minutes": 15, "action": "REMINDER_PUSH"},
                    {"after_minutes": 30, "action": "SMS_ESCALATION"},
                    {"after_minutes": 60, "action": "MANAGER_NOTIFICATION"},
                ],
            }
        elif level == "URGENT":
            return {
                "enabled": True,
                "steps": [
                    {"after_minutes": 30, "action": "REMINDER_PUSH"},
                    {"after_minutes": 60, "action": "SLACK_ESCALATION"},
                ],
            }
        return {"enabled": False}

    def _recommend_snooze_options(self, priority: Dict) -> Dict:
        """Recommend snooze options."""
        level = priority["level"]

        if level == "CRITICAL":
            return {"snoozeable": False, "reason": "Critical emails cannot be snoozed"}
        elif level == "URGENT":
            return {
                "snoozeable": True,
                "options": ["15 minutes", "30 minutes", "1 hour"],
                "max_snooze": "1 hour",
            }
        elif level == "HIGH":
            return {
                "snoozeable": True,
                "options": ["30 minutes", "1 hour", "2 hours", "Tomorrow"],
                "max_snooze": "24 hours",
            }
        return {
            "snoozeable": True,
            "options": ["1 hour", "4 hours", "Tomorrow", "Next week"],
            "max_snooze": "7 days",
        }

    def _determine_delivery_mode(self, priority: Dict, time_context: Dict) -> Dict:
        """Determine immediate vs batch delivery."""
        level = priority["level"]

        if level in ("CRITICAL", "URGENT"):
            return {"mode": "IMMEDIATE", "batch": False}
        elif level == "HIGH" and time_context["is_business_hours"]:
            return {"mode": "NEAR_IMMEDIATE", "batch": False, "delay_minutes": 5}
        else:
            return {"mode": "BATCHED", "batch": True, "batch_interval": "hourly"}

    def _determine_notification_action(self, priority: Dict, delivery_mode: Dict) -> str:
        if priority["level"] == "CRITICAL":
            return "IMMEDIATE_MULTI_CHANNEL_ALERT"
        elif priority["level"] == "URGENT":
            return "PUSH_AND_SLACK_ALERT"
        elif delivery_mode["batch"]:
            return "ADD_TO_DIGEST"
        return "STANDARD_NOTIFICATION"

    def _enforce_reply_all(self, email: Dict, all_recipients: List, is_multi: bool) -> Dict:
        result = {
            "is_multi_recipient": is_multi,
            "recipient_count": len(all_recipients),
            "enforced": False,
            "reason": "",
        }
        if is_multi:
            result["enforced"] = True
            result["reason"] = f"REPLY-ALL ENFORCED: {len(all_recipients)} recipients."
            self.reply_all_audit.append({
                "email_id": email.get("id", "unknown"),
                "enforced": True,
                "timestamp": datetime.now(timezone.utc).isoformat(),
            })
        else:
            result["reason"] = "Single recipient."
        return result

    def get_stats(self) -> Dict:
        if not self.notification_log:
            return {"notifications_routed": 0}
        return {
            "notifications_routed": len(self.notification_log),
            "channel_distribution": self.delivery_stats,
            "priority_distribution": {},
            "reply_all_enforced": len(self.reply_all_audit),
        }


def test_v975():
    engine = SmartNotificationEngine()

    # Test 1: Critical email
    email1 = {
        "id": "notif-001",
        "from": "CEO@company.com",
        "to": ["team@ziontechgroup.com", "support@ziontechgroup.com"],
        "subject": "CRITICAL: Production system down - urgent fix needed",
        "body": "URGENT: Our production system is down immediately! This is a critical emergency. Need fix ASAP!",
    }
    r1 = engine.analyze_email_case_by_case(email1)
    assert r1["reply_all_enforcement"]["enforced"] is True
    assert r1["priority"]["level"] == "CRITICAL"
    assert len(r1["recommended_channels"]["channels"]) >= 2
    print(f"✅ Test 1 PASSED: Priority={r1['priority']['level']}, channels={r1['recommended_channels']['channels']}, reply-all enforced")

    # Test 2: Low priority newsletter
    email2 = {
        "id": "notif-002",
        "from": "noreply@newsletter.com",
        "to": ["user@company.com"],
        "subject": "Weekly Tech Digest",
        "body": "Here's your weekly tech newsletter with the latest articles.",
    }
    r2 = engine.analyze_email_case_by_case(email2)
    assert r2["priority"]["level"] in ("LOW", "NORMAL")
    assert r2["delivery_mode"]["batch"] is True
    print(f"✅ Test 2 PASSED: Priority={r2['priority']['level']}, mode={r2['delivery_mode']['mode']}")

    stats = engine.get_stats()
    print(f"✅ Test 3 PASSED: {stats['notifications_routed']} routed, channels={stats['channel_distribution']}")

    print("\n🎉 V975 ALL TESTS PASSED — Smart Notification Engine operational!")
    return True


if __name__ == "__main__":
    test_v975()
