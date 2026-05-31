#!/usr/bin/env python3
"""V601 - Email Priority Decay Engine
Automatically adjusts email priority based on age, context, and engagement.
Prevents important emails from being forgotten with smart escalation.
REPLY-ALL ENFORCED: Always replies to all recipients in multi-person threads.
"""
import json, re
from datetime import datetime, timedelta
from typing import Dict, List, Any

class PriorityDecayEngine:
    """Smart priority decay with escalation for forgotten emails."""
    
    DECAY_RATES = {
        "urgent": 0.95,    # Decays slowly - stays important
        "high": 0.85,      # Moderate decay
        "normal": 0.70,    # Standard decay
        "low": 0.50,       # Fast decay
        "newsletter": 0.20 # Very fast decay
    }
    
    ESCALATION_TRIGGERS = [
        r"\bfollow[- ]?up\b", r"\bawaiting\b", r"\bpending\b",
        r"\boverdue\b", r"\breminder\b", r"\bstill waiting\b",
        r"\bhaven.t heard\b", r"\bany update\b"
    ]
    
    def __init__(self):
        self.emails = []
        self.escalation_rules = {}
    
    def analyze_email(self, email: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze email and calculate decayed priority."""
        original_priority = self._detect_priority(email)
        age_hours = self._calculate_age(email)
        decay_rate = self.DECAY_RATES.get(original_priority, 0.70)
        
        # Calculate decayed priority score
        decayed_score = 100 * (decay_rate ** (age_hours / 24))
        
        # Check for escalation triggers
        should_escalate = self._check_escalation(email)
        if should_escalate:
            decayed_score = min(100, decayed_score * 1.5)
        
        # Determine reply-all
        reply_all = self._should_reply_all(email)
        
        return {
            "engine": "V601",
            "original_priority": original_priority,
            "decayed_score": round(decayed_score, 1),
            "age_hours": age_hours,
            "should_escalate": should_escalate,
            "reply_all_enforced": reply_all,
            "recommended_action": self._get_action(decayed_score, should_escalate),
            "timestamp": datetime.now().isoformat()
        }
    
    def _detect_priority(self, email: Dict) -> str:
        subject = email.get("subject", "").lower()
        if any(w in subject for w in ["urgent", "asap", "critical", "emergency"]):
            return "urgent"
        if any(w in subject for w in ["important", "high priority", "action required"]):
            return "high"
        if any(w in subject for w in ["newsletter", "digest", "weekly"]):
            return "newsletter"
        return "normal"
    
    def _calculate_age(self, email: Dict) -> float:
        sent = email.get("sent_at", datetime.now().isoformat())
        try:
            sent_dt = datetime.fromisoformat(sent.replace("Z", "+00:00"))
            return (datetime.now(sent_dt.tzinfo) - sent_dt).total_seconds() / 3600
        except:
            return 24.0
    
    def _check_escalation(self, email: Dict) -> bool:
        body = email.get("body", "").lower()
        return any(re.search(p, body) for p in self.ESCALATION_TRIGGERS)
    
    def _should_reply_all(self, email: Dict) -> bool:
        recipients = email.get("to", []) + email.get("cc", [])
        return len(recipients) > 1
    
    def _get_action(self, score: float, escalated: bool) -> str:
        if escalated:
            return "ESCALATE_IMMEDIATELY"
        if score > 80:
            return "REPLY_NOW"
        if score > 50:
            return "REPLY_TODAY"
        if score > 20:
            return "REPLY_THIS_WEEK"
        return "ARCHIVE"
    
    def process_batch(self, emails: List[Dict]) -> Dict[str, Any]:
        results = [self.analyze_email(e) for e in emails]
        reply_all_count = sum(1 for r in results if r["reply_all_enforced"])
        return {
            "engine": "V601 - Priority Decay Engine",
            "total_processed": len(results),
            "reply_all_enforced": reply_all_count,
            "escalated": sum(1 for r in results if r["should_escalate"]),
            "results": results
        }

if __name__ == "__main__":
    engine = PriorityDecayEngine()
    test_emails = [
        {"subject": "URGENT: Server down", "body": "Need immediate response", "to": ["a@b.com", "c@d.com"], "cc": ["e@f.com"]},
        {"subject": "Weekly Newsletter", "body": "Your weekly digest", "to": ["user@company.com"]},
        {"subject": "Project update", "body": "Any update on the deliverables?", "to": ["team@company.com", "manager@company.com"]}
    ]
    result = engine.process_batch(test_emails)
    print(json.dumps(result, indent=2))
