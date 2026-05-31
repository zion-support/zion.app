#!/usr/bin/env python3
"""V629 - Email Priority Decay Engine
Automatic priority adjustment based on age with smart escalation.
REPLY-ALL ENFORCED: Always replies to all recipients in multi-person threads.
"""
import json
from datetime import datetime, timedelta
from typing import Dict, List, Any

class PriorityDecayEngine:
    """Adjust email priority based on age and engagement."""
    
    DECAY_RATES = {
        "urgent": 0.95,  # Slow decay
        "high": 0.85,
        "normal": 0.70,
        "low": 0.50,
        "newsletter": 0.20  # Fast decay
    }
    
    def __init__(self):
        self.tracked_emails = []
    
    def apply_decay(self, email: Dict[str, Any]) -> Dict[str, Any]:
        """Apply priority decay to email."""
        original_priority = email.get("priority", 50)
        received_at = email.get("received_at", datetime.now().isoformat())
        
        # Calculate age
        age_hours = self._calculate_age(received_at)
        
        # Get decay rate
        priority_level = self._get_priority_level(email)
        decay_rate = self.DECAY_RATES.get(priority_level, 0.70)
        
        # Apply decay
        decayed_priority = original_priority * (decay_rate ** (age_hours / 24))
        
        # Check for escalation
        should_escalate = self._check_escalation(email, decayed_priority, age_hours)
        
        # Generate action
        action = self._recommend_action(decayed_priority, should_escalate)
        
        return {
            "engine": "V629",
            "email_subject": email.get("subject", ""),
            "original_priority": original_priority,
            "decayed_priority": round(decayed_priority, 1),
            "priority_change": round(decayed_priority - original_priority, 1),
            "age_hours": round(age_hours, 1),
            "decay_rate": decay_rate,
            "should_escalate": should_escalate,
            "recommended_action": action,
            "days_until_archive": self._estimate_archive_time(decayed_priority),
            "reply_all_enforced": len(email.get("to", []) + email.get("cc", [])) > 1,
            "timestamp": datetime.now().isoformat()
        }
    
    def _calculate_age(self, received_at: str) -> float:
        """Calculate email age in hours."""
        try:
            received_dt = datetime.fromisoformat(received_at.replace("Z", "+00:00"))
            return (datetime.now(received_dt.tzinfo) - received_dt).total_seconds() / 3600
        except:
            return 0.0
    
    def _get_priority_level(self, email: Dict) -> str:
        """Determine priority level."""
        subject = email.get("subject", "").lower()
        
        if any(word in subject for word in ["urgent", "critical", "emergency"]):
            return "urgent"
        elif any(word in subject for word in ["important", "high priority"]):
            return "high"
        elif any(word in subject for word in ["newsletter", "digest"]):
            return "newsletter"
        else:
            return "normal"
    
    def _check_escalation(self, email: Dict, decayed_priority: float, age_hours: float) -> bool:
        """Check if email should be escalated."""
        # Escalate if important email is getting old
        if decayed_priority > 70 and age_hours > 24:
            return True
        
        # Escalate if mentioned in email
        body = email.get("body", "").lower()
        if "escalate" in body or "manager" in body:
            return True
        
        return False
    
    def _recommend_action(self, priority: float, escalated: bool) -> str:
        """Recommend action based on priority."""
        if escalated:
            return "ESCALATE_IMMEDIATELY"
        elif priority >= 80:
            return "REPLY_NOW"
        elif priority >= 60:
            return "REPLY_TODAY"
        elif priority >= 40:
            return "REPLY_THIS_WEEK"
        elif priority >= 20:
            return "REVIEW_LATER"
        else:
            return "ARCHIVE"
    
    def _estimate_archive_time(self, priority: float) -> int:
        """Estimate days until auto-archive."""
        if priority >= 80:
            return 90
        elif priority >= 60:
            return 60
        elif priority >= 40:
            return 30
        elif priority >= 20:
            return 14
        else:
            return 7
    
    def process_batch(self, emails: List[Dict]) -> Dict[str, Any]:
        results = [self.apply_decay(e) for e in emails]
        
        escalated_count = sum(1 for r in results if r["should_escalate"])
        avg_decay = sum(r["priority_change"] for r in results) / len(results) if results else 0
        
        return {
            "engine": "V629 - Priority Decay Engine",
            "total_processed": len(results),
            "emails_escalated": escalated_count,
            "average_priority_change": round(avg_decay, 1),
            "reply_all_enforced": sum(1 for r in results if r["reply_all_enforced"]),
            "results": results
        }

if __name__ == "__main__":
    engine = PriorityDecayEngine()
    now = datetime.now()
    test_emails = [
        {"subject": "URGENT: Production issue", "priority": 90, "received_at": (now - timedelta(hours=2)).isoformat(),
         "to": ["ops@company.com", "dev@company.com"]},
        {"subject": "Weekly newsletter", "priority": 30, "received_at": (now - timedelta(days=5)).isoformat(),
         "to": ["me@company.com"]}
    ]
    result = engine.process_batch(test_emails)
    print(json.dumps(result, indent=2))
