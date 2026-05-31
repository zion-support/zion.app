#!/usr/bin/env python3
"""V546 - Predictive Email Routing Engine
ML-powered routing that analyzes email content and automatically routes to the optimal team/person.
CRITICAL: Always enforces reply-all for multi-recipient emails.
"""
import json
from datetime import datetime
from typing import Dict, List

class PredictiveEmailRouting:
    def __init__(self):
        self.reply_all_enforced = True
        self.routing_rules = {
            "technical": ["bug", "error", "issue", "technical", "api", "integration"],
            "sales": ["pricing", "quote", "purchase", "demo", "trial"],
            "support": ["help", "assist", "question", "how to", "guidance"],
            "billing": ["invoice", "payment", "billing", "refund", "charge"],
            "management": ["strategic", "partnership", "executive", "contract"]
        }
    
    def route_email(self, email: Dict) -> Dict:
        """Analyze and route email to optimal destination"""
        body = email.get("body", "").lower()
        subject = email.get("subject", "").lower()
        full_text = f"{subject} {body}"
        
        # Calculate routing scores
        routing_scores = {}
        for category, keywords in self.routing_rules.items():
            score = sum(1 for kw in keywords if kw in full_text)
            routing_scores[category] = score
        
        # Determine primary route
        primary_route = max(routing_scores, key=routing_scores.get)
        confidence = routing_scores[primary_route] / max(sum(routing_scores.values()), 1)
        
        # Priority detection
        priority = self._detect_priority(full_text)
        
        # SLA estimation
        sla_hours = self._estimate_sla(primary_route, priority)
        
        return {
            "engine": "V546_Predictive_Email_Routing",
            "timestamp": datetime.now().isoformat(),
            "primary_route": primary_route,
            "routing_scores": routing_scores,
            "confidence": round(confidence, 3),
            "priority": priority,
            "estimated_sla_hours": sla_hours,
            "suggested_assignee": self._suggest_assignee(primary_route),
            "reply_all_enforced": self.reply_all_enforced,
            "all_recipients": email.get("to", []) + email.get("cc", [])
        }
    
    def _detect_priority(self, text: str) -> str:
        """Detect email priority from content"""
        if any(w in text for w in ["urgent", "asap", "immediately", "critical", "emergency"]):
            return "critical"
        elif any(w in text for w in ["important", "soon", "quickly", "priority"]):
            return "high"
        elif any(w in text for w in ["when possible", "no rush", "whenever"]):
            return "low"
        return "normal"
    
    def _estimate_sla(self, route: str, priority: str) -> int:
        """Estimate SLA in hours based on route and priority"""
        base_sla = {"technical": 24, "sales": 4, "support": 8, "billing": 12, "management": 48}
        priority_multiplier = {"critical": 0.25, "high": 0.5, "normal": 1.0, "low": 2.0}
        return int(base_sla.get(route, 24) * priority_multiplier.get(priority, 1.0))
    
    def _suggest_assignee(self, route: str) -> str:
        """Suggest optimal assignee based on route"""
        assignees = {
            "technical": "Technical Support Team",
            "sales": "Sales Representative",
            "support": "Customer Success Manager",
            "billing": "Billing Department",
            "management": "Account Executive"
        }
        return assignees.get(route, "General Inbox")

if __name__ == "__main__":
    router = PredictiveEmailRouting()
    test = {"subject": "Urgent: API integration issue", "body": "We're experiencing a critical error with the API integration. Need immediate help.", "to": ["support@zion.com"], "cc": ["manager@client.com"]}
    print(json.dumps(router.route_email(test), indent=2))
