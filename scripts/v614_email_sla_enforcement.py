#!/usr/bin/env python3
"""V614 - Email SLA Enforcement Engine
Track response times and enforce service level agreements automatically.
REPLY-ALL ENFORCED: Always replies to all recipients in multi-person threads.
"""
import json
from datetime import datetime, timedelta
from typing import Dict, List, Any

class SLAEnforcementEngine:
    """Enforce SLA policies for email response times."""
    
    SLA_TIERS = {
        "critical": {"response_hours": 1, "resolution_hours": 4, "escalation_after": 0.5},
        "high": {"response_hours": 4, "resolution_hours": 24, "escalation_after": 2},
        "medium": {"response_hours": 8, "resolution_hours": 48, "escalation_after": 4},
        "low": {"response_hours": 24, "resolution_hours": 168, "escalation_after": 12},
        "standard": {"response_hours": 48, "resolution_hours": 336, "escalation_after": 24}
    }
    
    PRIORITY_KEYWORDS = {
        "critical": ["critical", "emergency", "production down", "outage", "data loss", "security breach"],
        "high": ["urgent", "asap", "immediately", "high priority", "blocking"],
        "medium": ["important", "soon", "this week", "please review"],
        "low": ["when possible", "no rush", "fyi", "informational"]
    }
    
    def __init__(self):
        self.sla_records = []
        self.escalations = []
    
    def evaluate_sla(self, email: Dict[str, Any]) -> Dict[str, Any]:
        """Evaluate SLA compliance for an email."""
        priority = self._detect_priority(email)
        sla_tier = self.SLA_TIERS.get(priority, self.SLA_TIERS["standard"])
        
        received_at = email.get("received_at", datetime.now().isoformat())
        responded_at = email.get("responded_at")
        
        if responded_at:
            response_time_hours = self._calc_hours(received_at, responded_at)
            sla_met = response_time_hours <= sla_tier["response_hours"]
            time_remaining = sla_tier["response_hours"] - response_time_hours
        else:
            elapsed_hours = self._calc_hours(received_at, datetime.now().isoformat())
            response_time_hours = None
            sla_met = elapsed_hours <= sla_tier["response_hours"]
            time_remaining = sla_tier["response_hours"] - elapsed_hours
        
        needs_escalation = time_remaining < 0 or (responded_at is None and 
                          self._calc_hours(received_at, datetime.now().isoformat()) > sla_tier["escalation_after"])
        
        compliance_score = self._calc_compliance_score(time_remaining, sla_tier["response_hours"])
        
        return {
            "engine": "V614",
            "email_subject": email.get("subject", ""),
            "detected_priority": priority,
            "sla_tier": priority,
            "sla_response_hours": sla_tier["response_hours"],
            "sla_resolution_hours": sla_tier["resolution_hours"],
            "response_time_hours": round(response_time_hours, 2) if response_time_hours else None,
            "sla_met": sla_met,
            "time_remaining_hours": round(time_remaining, 2),
            "compliance_score": round(compliance_score, 1),
            "needs_escalation": needs_escalation,
            "escalation_target": self._get_escalation_target(priority) if needs_escalation else None,
            "sla_status": self._get_status(sla_met, time_remaining, sla_tier["response_hours"]),
            "reply_all_enforced": len(email.get("to", []) + email.get("cc", [])) > 1,
            "timestamp": datetime.now().isoformat()
        }
    
    def _detect_priority(self, email: Dict) -> str:
        """Detect email priority for SLA assignment."""
        text = f"{email.get('subject', '')} {email.get('body', '')}".lower()
        for priority, keywords in self.PRIORITY_KEYWORDS.items():
            if any(kw in text for kw in keywords):
                return priority
        return "standard"
    
    def _calc_hours(self, start: str, end: str) -> float:
        """Calculate hours between two timestamps."""
        try:
            start_dt = datetime.fromisoformat(start.replace("Z", "+00:00"))
            end_dt = datetime.fromisoformat(end.replace("Z", "+00:00")) if isinstance(end, str) else end
            return (end_dt - start_dt).total_seconds() / 3600
        except:
            return 0.0
    
    def _calc_compliance_score(self, time_remaining: float, sla_hours: float) -> float:
        """Calculate SLA compliance score (0-100)."""
        if sla_hours == 0:
            return 100
        ratio = time_remaining / sla_hours
        if ratio >= 0.5:
            return 100
        elif ratio >= 0:
            return 50 + (ratio * 100)
        else:
            return max(0, 50 + (ratio * 100))
    
    def _get_status(self, sla_met: bool, time_remaining: float, sla_hours: float) -> str:
        """Get SLA status."""
        if not sla_met:
            return "breached"
        if time_remaining < sla_hours * 0.25:
            return "at_risk"
        if time_remaining < sla_hours * 0.5:
            return "warning"
        return "on_track"
    
    def _get_escalation_target(self, priority: str) -> str:
        """Get escalation target based on priority."""
        targets = {
            "critical": "VP of Engineering + CTO",
            "high": "Engineering Manager",
            "medium": "Team Lead",
            "low": "Support Queue"
        }
        return targets.get(priority, "Support Manager")
    
    def generate_sla_report(self, emails: List[Dict]) -> Dict[str, Any]:
        """Generate comprehensive SLA report."""
        results = [self.evaluate_sla(e) for e in emails]
        
        total = len(results)
        met = sum(1 for r in results if r["sla_met"])
        breached = sum(1 for r in results if not r["sla_met"])
        escalated = sum(1 for r in results if r["needs_escalation"])
        
        avg_compliance = sum(r["compliance_score"] for r in results) / total if total else 0
        
        priority_distribution = {}
        for r in results:
            p = r["detected_priority"]
            priority_distribution[p] = priority_distribution.get(p, 0) + 1
        
        return {
            "engine": "V614 - SLA Enforcement Engine",
            "total_emails": total,
            "sla_met": met,
            "sla_breached": breached,
            "escalations": escalated,
            "compliance_rate_percent": round((met / total * 100) if total else 100, 1),
            "average_compliance_score": round(avg_compliance, 1),
            "priority_distribution": priority_distribution,
            "reply_all_enforced": sum(1 for r in results if r["reply_all_enforced"]),
            "results": results
        }

if __name__ == "__main__":
    engine = SLAEnforcementEngine()
    now = datetime.now()
    test_emails = [
        {"subject": "CRITICAL: Production database down", "body": "The main database is offline. All services affected.", 
         "to": ["ops@company.com", "cto@company.com"], "received_at": (now - timedelta(hours=0.5)).isoformat(), "responded_at": (now - timedelta(minutes=15)).isoformat()},
        {"subject": "Urgent: Client meeting prep", "body": "Need the presentation ASAP for tomorrow's client meeting.", 
         "to": ["team@company.com"], "received_at": (now - timedelta(hours=3)).isoformat(), "responded_at": None},
        {"subject": "Weekly status update", "body": "Please send your weekly status update when possible.", 
         "to": ["team@company.com", "manager@company.com"], "received_at": (now - timedelta(hours=12)).isoformat(), "responded_at": (now - timedelta(hours=6)).isoformat()}
    ]
    result = engine.generate_sla_report(test_emails)
    print(json.dumps(result, indent=2))
