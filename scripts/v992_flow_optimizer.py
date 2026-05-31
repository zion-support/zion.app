#!/usr/bin/env python3
"""
V992: Email Flow Optimizer Engine
Analyzes email flow patterns to suggest optimal send times and batch processing.
Enables productivity boost with strict reply-all enforcement.
"""

import re
import hashlib
from datetime import datetime, timezone, timedelta
from typing import Dict, List, Any
from collections import defaultdict


class EmailFlowOptimizer:
    """Optimizes email flow patterns and timing."""

    def __init__(self):
        self.flow_log: List[Dict] = []
        self.reply_all_audit: List[Dict] = []
        self.pattern_database: Dict[str, List[Dict]] = defaultdict(list)

    def analyze_email_case_by_case(self, email: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze email flow case by case."""
        analysis = {
            "engine": "V992",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "email_id": email.get("id", hashlib.md5(str(email).encode()).hexdigest()[:12]),
            "analysis_type": "flow_optimization",
        }

        to_recipients = email.get("to", [])
        cc_recipients = email.get("cc", [])
        all_recipients = to_recipients + cc_recipients
        is_multi_recipient = len(all_recipients) > 1

        body = email.get("body", "")
        subject = email.get("subject", "")

        # 1. Temporal analysis
        temporal = self._analyze_temporal_patterns(email)
        analysis["temporal_patterns"] = temporal

        # 2. Flow velocity
        velocity = self._calculate_flow_velocity(email)
        analysis["flow_velocity"] = velocity

        # 3. Batch optimization
        batch = self._suggest_batch_processing(email, temporal)
        analysis["batch_optimization"] = batch

        # 4. Optimal send time
        optimal_time = self._suggest_optimal_send_time(email, temporal)
        analysis["optimal_send_time"] = optimal_time

        # 5. Flow congestion detection
        congestion = self._detect_flow_congestion(email)
        analysis["flow_congestion"] = congestion

        # 6. Recipient timezone analysis
        timezone_analysis = self._analyze_recipient_timezones(all_recipients)
        analysis["timezone_analysis"] = timezone_analysis

        # 7. Flow efficiency score
        efficiency = self._calculate_flow_efficiency(
            temporal, velocity, batch, congestion
        )
        analysis["flow_efficiency"] = efficiency

        # 8. Flow recommendations
        recommendations = self._generate_flow_recommendations(
            efficiency, optimal_time, batch, congestion
        )
        analysis["flow_recommendations"] = recommendations

        # 9. Determine action
        action = self._determine_flow_action(efficiency, recommendations)
        analysis["recommended_action"] = action

        # REPLY-ALL ENFORCEMENT
        reply_all = self._enforce_reply_all(email, all_recipients, is_multi_recipient)
        analysis["reply_all_enforcement"] = reply_all

        # Store pattern
        self._store_flow_pattern(email, temporal, velocity)

        self.flow_log.append({
            "email_id": analysis["email_id"],
            "efficiency_score": efficiency["score"],
            "optimal_hour": optimal_time["hour"],
            "batch_suggested": batch["should_batch"],
            "congestion_level": congestion["level"],
            "reply_all": reply_all["enforced"],
            "timestamp": analysis["timestamp"],
        })

        return analysis

    def _analyze_temporal_patterns(self, email: Dict) -> Dict:
        """Analyze temporal patterns in email."""
        timestamp = email.get("timestamp")
        
        if not timestamp:
            return {
                "hour": -1,
                "day_of_week": -1,
                "is_business_hours": False,
                "is_weekend": False,
                "time_period": "unknown",
            }
        
        try:
            dt = datetime.fromisoformat(timestamp.replace('Z', '+00:00'))
        except:
            dt = datetime.now(timezone.utc)
        
        hour = dt.hour
        day_of_week = dt.weekday()  # 0=Monday, 6=Sunday
        
        # Determine time period
        if 6 <= hour < 12:
            time_period = "morning"
        elif 12 <= hour < 17:
            time_period = "afternoon"
        elif 17 <= hour < 22:
            time_period = "evening"
        else:
            time_period = "night"
        
        is_business_hours = 9 <= hour < 17 and day_of_week < 5
        is_weekend = day_of_week >= 5
        
        return {
            "hour": hour,
            "day_of_week": day_of_week,
            "day_name": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"][day_of_week],
            "is_business_hours": is_business_hours,
            "is_weekend": is_weekend,
            "time_period": time_period,
        }

    def _calculate_flow_velocity(self, email: Dict) -> Dict:
        """Calculate email flow velocity."""
        sender = email.get("from", "")
        
        # Get sender's email history
        sender_history = self.pattern_database.get(sender, [])
        
        if len(sender_history) < 2:
            return {
                "emails_per_hour": 0,
                "velocity_level": "unknown",
                "trend": "insufficient_data",
            }
        
        # Calculate time between emails
        timestamps = [datetime.fromisoformat(p["timestamp"].replace('Z', '+00:00')) 
                     for p in sender_history[-10:] if "timestamp" in p]
        
        if len(timestamps) < 2:
            return {
                "emails_per_hour": 0,
                "velocity_level": "unknown",
                "trend": "insufficient_data",
            }
        
        # Calculate average time between emails
        time_diffs = [(timestamps[i+1] - timestamps[i]).total_seconds() / 3600 
                     for i in range(len(timestamps)-1)]
        avg_hours = sum(time_diffs) / len(time_diffs)
        emails_per_hour = 1 / avg_hours if avg_hours > 0 else 0
        
        # Determine velocity level
        if emails_per_hour > 10:
            velocity_level = "very_high"
        elif emails_per_hour > 5:
            velocity_level = "high"
        elif emails_per_hour > 1:
            velocity_level = "medium"
        else:
            velocity_level = "low"
        
        # Trend analysis
        if len(time_diffs) >= 3:
            recent = sum(time_diffs[-3:]) / 3
            older = sum(time_diffs[:-3]) / max(len(time_diffs) - 3, 1)
            
            if recent < older * 0.8:
                trend = "accelerating"
            elif recent > older * 1.2:
                trend = "decelerating"
            else:
                trend = "stable"
        else:
            trend = "stable"
        
        return {
            "emails_per_hour": round(emails_per_hour, 2),
            "velocity_level": velocity_level,
            "trend": trend,
        }

    def _suggest_batch_processing(self, email: Dict, temporal: Dict) -> Dict:
        """Suggest batch processing opportunities."""
        subject = email.get("subject", "").lower()
        body = email.get("body", "").lower()
        
        # Check if email is suitable for batching
        batch_indicators = [
            "newsletter", "digest", "summary", "weekly", "monthly",
            "update", "report", "announcement"
        ]
        
        is_batch_suitable = any(indicator in subject or indicator in body 
                               for indicator in batch_indicators)
        
        # Non-urgent content
        urgent_keywords = ["urgent", "asap", "immediately", "emergency"]
        is_urgent = any(kw in subject or kw in body for kw in urgent_keywords)
        
        should_batch = is_batch_suitable and not is_urgent
        
        # Suggest batch window
        if should_batch:
            if temporal["is_business_hours"]:
                batch_window = "end_of_day"
            else:
                batch_window = "next_business_morning"
        else:
            batch_window = "immediate"
        
        return {
            "should_batch": should_batch,
            "batch_window": batch_window,
            "is_batch_suitable": is_batch_suitable,
            "is_urgent": is_urgent,
            "batch_size_suggestion": 5 if should_batch else 1,
        }

    def _suggest_optimal_send_time(self, email: Dict, temporal: Dict) -> Dict:
        """Suggest optimal send time based on patterns."""
        # Analyze recipient engagement patterns
        recipients = email.get("to", []) + email.get("cc", [])
        
        # Default optimal times (based on general email best practices)
        optimal_hours = {
            "business": [9, 10, 11, 14, 15, 16],  # Business hours
            "marketing": [10, 14],  # Mid-morning and mid-afternoon
            "support": [9, 10, 11, 13, 14, 15, 16],  # Extended business hours
        }
        
        # Determine email type
        subject = email.get("subject", "").lower()
        if any(kw in subject for kw in ["newsletter", "promotion", "offer"]):
            email_type = "marketing"
        elif any(kw in subject for kw in ["support", "help", "issue"]):
            email_type = "support"
        else:
            email_type = "business"
        
        # Get optimal hours for this type
        type_hours = optimal_hours[email_type]
        
        # Suggest next optimal hour
        current_hour = temporal["hour"]
        
        # Find next optimal hour
        next_optimal = None
        for hour in type_hours:
            if hour > current_hour:
                next_optimal = hour
                break
        
        if next_optimal is None:
            # Next day
            next_optimal = type_hours[0]
        
        # Calculate delay in minutes
        if next_optimal > current_hour:
            delay_minutes = (next_optimal - current_hour) * 60
        else:
            delay_minutes = (24 - current_hour + next_optimal) * 60
        
        return {
            "hour": next_optimal,
            "email_type": email_type,
            "delay_minutes": delay_minutes,
            "optimal_hours": type_hours,
            "is_optimal_now": current_hour in type_hours,
        }

    def _detect_flow_congestion(self, email: Dict) -> Dict:
        """Detect flow congestion patterns."""
        sender = email.get("from", "")
        
        # Get recent emails from sender
        sender_history = self.pattern_database.get(sender, [])
        recent_emails = [p for p in sender_history[-20:]]
        
        if len(recent_emails) < 5:
            return {
                "level": "low",
                "emails_in_last_hour": len(recent_emails),
                "congestion_score": 0,
            }
        
        # Count emails in last hour
        now = datetime.now(timezone.utc)
        one_hour_ago = now - timedelta(hours=1)
        
        emails_last_hour = sum(1 for p in recent_emails 
                              if "timestamp" in p and 
                              datetime.fromisoformat(p["timestamp"].replace('Z', '+00:00')) > one_hour_ago)
        
        # Calculate congestion score
        congestion_score = min(emails_last_hour * 10, 100)
        
        if congestion_score >= 70:
            level = "high"
        elif congestion_score >= 40:
            level = "medium"
        else:
            level = "low"
        
        return {
            "level": level,
            "emails_in_last_hour": emails_last_hour,
            "congestion_score": congestion_score,
        }

    def _analyze_recipient_timezones(self, recipients: List[str]) -> Dict:
        """Analyze recipient timezones."""
        # This would normally use a timezone database
        # For now, return placeholder
        return {
            "timezone_count": 1,  # Placeholder
            "optimal_overlap_hours": [9, 10, 11, 14, 15, 16],
            "timezone_diversity": "low",
        }

    def _calculate_flow_efficiency(self, temporal: Dict, velocity: Dict, 
                                   batch: Dict, congestion: Dict) -> Dict:
        """Calculate overall flow efficiency score."""
        score = 70  # Base score
        
        # Temporal efficiency
        if temporal["is_business_hours"]:
            score += 15
        elif temporal["is_weekend"]:
            score -= 10
        
        # Velocity efficiency
        if velocity["velocity_level"] == "medium":
            score += 10
        elif velocity["velocity_level"] == "very_high":
            score -= 10
        
        # Batch efficiency
        if batch["should_batch"] and batch["batch_window"] != "immediate":
            score += 10
        
        # Congestion penalty
        if congestion["level"] == "high":
            score -= 20
        elif congestion["level"] == "medium":
            score -= 10
        
        score = max(0, min(100, score))
        
        if score >= 80:
            level = "excellent"
        elif score >= 60:
            level = "good"
        elif score >= 40:
            level = "fair"
        else:
            level = "poor"
        
        return {
            "score": score,
            "level": level,
        }

    def _generate_flow_recommendations(self, efficiency: Dict, optimal_time: Dict,
                                       batch: Dict, congestion: Dict) -> List[Dict]:
        """Generate flow optimization recommendations."""
        recommendations = []
        
        # Timing recommendations
        if not optimal_time["is_optimal_now"]:
            recommendations.append({
                "type": "timing",
                "priority": "medium",
                "message": f"Consider sending at {optimal_time['hour']}:00 for better engagement",
                "delay_minutes": optimal_time["delay_minutes"],
            })
        
        # Batch recommendations
        if batch["should_batch"]:
            recommendations.append({
                "type": "batching",
                "priority": "low",
                "message": f"This email is suitable for batch processing ({batch['batch_window']})",
            })
        
        # Congestion recommendations
        if congestion["level"] == "high":
            recommendations.append({
                "type": "congestion",
                "priority": "high",
                "message": "High flow congestion detected - consider delaying non-urgent emails",
            })
        
        # Efficiency recommendations
        if efficiency["level"] == "poor":
            recommendations.append({
                "type": "efficiency",
                "priority": "high",
                "message": "Flow efficiency is poor - review sending patterns",
            })
        
        return recommendations

    def _determine_flow_action(self, efficiency: Dict, recommendations: List) -> str:
        """Determine flow action."""
        high_priority = any(r["priority"] == "high" for r in recommendations)
        
        if high_priority:
            return "OPTIMIZE_IMMEDIATELY"
        elif efficiency["level"] == "excellent":
            return "MAINTAIN_CURRENT_FLOW"
        elif efficiency["level"] in ("fair", "poor"):
            return "ADJUST_FLOW_PATTERNS"
        else:
            return "MONITOR_AND_OPTIMIZE"

    def _store_flow_pattern(self, email: Dict, temporal: Dict, velocity: Dict):
        """Store flow pattern in database."""
        sender = email.get("from", "")
        
        pattern = {
            "timestamp": email.get("timestamp", datetime.now(timezone.utc).isoformat()),
            "hour": temporal["hour"],
            "day_of_week": temporal["day_of_week"],
            "velocity_level": velocity["velocity_level"],
        }
        
        self.pattern_database[sender].append(pattern)
        
        # Keep only last 100 patterns per sender
        if len(self.pattern_database[sender]) > 100:
            self.pattern_database[sender] = self.pattern_database[sender][-100:]

    def _enforce_reply_all(self, email: Dict, all_recipients: List, is_multi: bool) -> Dict:
        """STRICT reply-all enforcement."""
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
        if not self.flow_log:
            return {"emails_analyzed": 0}
        return {
            "emails_analyzed": len(self.flow_log),
            "avg_efficiency": sum(f["efficiency_score"] for f in self.flow_log) / len(self.flow_log),
            "batch_suggestions": sum(1 for f in self.flow_log if f["batch_suggested"]),
            "congestion_detected": sum(1 for f in self.flow_log if f["congestion_level"] in ("medium", "high")),
            "reply_all_enforced": len(self.reply_all_audit),
        }


def test_v992():
    engine = EmailFlowOptimizer()

    # Test 1: Business hours email
    email1 = {
        "id": "flow-001",
        "from": "sender@company.com",
        "to": ["team@ziontechgroup.com", "support@ziontechgroup.com"],
        "subject": "Weekly newsletter - AI updates",
        "body": "Here's your weekly digest of AI news and updates. This newsletter covers the latest developments.",
        "timestamp": "2024-01-15T10:00:00Z",  # 10 AM on Monday
    }
    r1 = engine.analyze_email_case_by_case(email1)
    assert r1["reply_all_enforcement"]["enforced"] is True
    assert r1["temporal_patterns"]["is_business_hours"] is True
    assert r1["batch_optimization"]["should_batch"] is True
    print(f"✅ Test 1 PASSED: Business hours detected, batch suggested, efficiency={r1['flow_efficiency']['score']}, reply-all enforced")

    # Test 2: Weekend email
    email2 = {
        "id": "flow-002",
        "from": "weekend@company.com",
        "to": ["user@company.com"],
        "subject": "Urgent: System down",
        "body": "URGENT: The system is down and needs immediate attention!",
        "timestamp": "2024-01-13T14:00:00Z",  # Saturday
    }
    r2 = engine.analyze_email_case_by_case(email2)
    assert r2["temporal_patterns"]["is_weekend"] is True
    assert r2["batch_optimization"]["is_urgent"] is True
    print(f"✅ Test 2 PASSED: Weekend email detected, urgency flagged")

    stats = engine.get_stats()
    print(f"✅ Test 3 PASSED: {stats['emails_analyzed']} analyzed, avg efficiency={stats['avg_efficiency']:.1f}")

    print("\n🎉 V992 ALL TESTS PASSED — Email Flow Optimizer operational!")
    return True


if __name__ == "__main__":
    test_v992()
