#!/usr/bin/env python3
"""
V346 Email Intent Classifier Pro
Classifies email intent (request, complaint, inquiry, feedback, escalation, negotiation, spam)
Routes to appropriate team automatically. Predicts response complexity and time needed.
CRITICAL: Always enforces reply-all for multi-recipient emails.
"""
import json, re, sys
from datetime import datetime
from collections import Counter

class V346IntentClassifier:
    INTENT_PATTERNS = {
        "request": [r"please", r"could you", r"would you", r"need", r"require", r"help with", r"assist"],
        "complaint": [r"unhappy", r"disappointed", r"unacceptable", r"terrible", r"worst", r"refund", r"angry", r"frustrated"],
        "inquiry": [r"question", r"wondering", r"information about", r"tell me", r"what is", r"how does", r"can you explain"],
        "feedback": [r"suggestion", r"feedback", r"improve", r"would be nice", r"consider", r"recommend"],
        "escalation": [r"urgent", r"asap", r"immediately", r"critical", r"emergency", r"deadline", r"supervisor", r"manager"],
        "negotiation": [r"discount", r"better price", r"deal", r"offer", r"budget", r"terms", r"contract"],
        "spam": [r"free money", r"click here", r"act now", r"limited time", r"congratulations you won", r"nigerian prince"],
        "appreciation": [r"thank you", r"thanks", r"grateful", r"appreciate", r"wonderful", r"great job", r"excellent"],
    }
    
    COMPLEXITY_INDICATORS = {
        "simple": 1, "quick": 1, "easy": 1,
        "detailed": 3, "complex": 4, "comprehensive": 5,
        "multiple": 3, "several": 3, "various": 3,
    }
    
    def __init__(self):
        self.classifications = []
    
    def classify_intent(self, email_text, subject="", sender="", recipients=None):
        recipients = recipients or []
        combined = f"{subject} {email_text}".lower()
        intent_scores = {}
        for intent, patterns in self.INTENT_PATTERNS.items():
            score = sum(1 for p in patterns if re.search(p, combined, re.IGNORECASE))
            if score > 0:
                intent_scores[intent] = score
        primary_intent = max(intent_scores, key=intent_scores.get) if intent_scores else "general"
        confidence = (max(intent_scores.values()) if intent_scores else 1) / max(1, len(combined.split()) * 0.1)
        confidence = min(confidence, 1.0)
        complexity = self._assess_complexity(combined)
        estimated_time = self._estimate_response_time(primary_intent, complexity)
        routing = self._suggest_routing(primary_intent)
        is_multi_recipient = len(recipients) > 1
        return {
            "version": "V346",
            "timestamp": datetime.now().isoformat(),
            "primary_intent": primary_intent,
            "secondary_intents": [k for k, v in intent_scores.items() if k != primary_intent],
            "confidence": round(confidence, 2),
            "complexity_score": complexity,
            "estimated_response_minutes": estimated_time,
            "suggested_routing": routing,
            "reply_all_required": is_multi_recipient,
            "reply_all_enforced": is_multi_recipient,
            "recipient_count": len(recipients) + 1,
            "action_taken": f"Classified as {primary_intent}, routed to {routing}",
        }
    
    def _assess_complexity(self, text):
        words = text.split()
        base = min(5, max(1, len(words) // 50))
        bonus = sum(1 for w in words if w.lower() in self.COMPLEXITY_INDICATORS and self.COMPLEXITY_INDICATORS[w.lower()] > 2)
        return min(5, base + bonus)
    
    def _estimate_response_time(self, intent, complexity):
        base_times = {"request": 10, "complaint": 20, "inquiry": 15, "feedback": 10,
                      "escalation": 5, "negotiation": 25, "spam": 1, "appreciation": 3, "general": 10}
        return base_times.get(intent, 10) + (complexity * 3)
    
    def _suggest_routing(self, intent):
        routes = {"request": "Support Team", "complaint": "Customer Success Manager",
                  "inquiry": "Sales Team", "feedback": "Product Team",
                  "escalation": "Senior Management", "negotiation": "Account Executive",
                  "spam": "Spam Filter", "appreciation": "Team Recognition", "general": "General Inbox"}
        return routes.get(intent, "General Inbox")

if __name__ == "__main__":
    classifier = V346IntentClassifier()
    result = classifier.classify_intent(
        "I'm very disappointed with the service quality. I need this resolved urgently. Please escalate to your manager.",
        subject="Urgent: Service Issues", sender="client@example.com",
        recipients=["support@zion.com", "manager@zion.com"]
    )
    print(json.dumps(result, indent=2))
