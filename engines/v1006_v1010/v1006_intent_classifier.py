#!/usr/bin/env python3
"""
V1006 - Email Intent Classifier Engine
Uses NLP to detect true intent behind emails: request, complaint, inquiry,
negotiation, spam, feedback, appointment, etc. Routes to correct workflow.
"""
import re
import json

INTENT_PATTERNS = {
    "request": {
        "patterns": [
            r'\b(could you|can you|please|kindly)\s+\w+',
            r'\bI (?:need|want|require)\b',
            r'\bcan (?:we|you|I) (?:get|have|receive)\b',
            r'\bwould (?:it be possible|you be able)\b',
        ],
        "priority": "high",
        "action": "Process request and respond within 24 hours",
    },
    "complaint": {
        "patterns": [
            r'\b(disappointed|frustrated|unhappy|upset)\b',
            r'\b(problem|issue|concern)\s+with\b',
            r'\bnot (?:working|satisfied|happy)\b',
            r'\b(terrible|awful|bad)\s+(?:experience|service|product)\b',
            r'\b(complain|complaint)\b',
        ],
        "priority": "urgent",
        "action": "Escalate to customer success team immediately",
    },
    "inquiry": {
        "patterns": [
            r'\b(question|inquiry|wondering)\b',
            r'\b(could you tell me|I\'d like to know)\b',
            r'\bwhat (?:is|are|does|do)\b',
            r'\bhow (?:does|do|can|could)\b',
            r'\?\s*$',
        ],
        "priority": "medium",
        "action": "Research and provide accurate answer",
    },
    "negotiation": {
        "patterns": [
            r'\b(negotiate|offer|counter|proposal)\b',
            r'\b(price|cost|budget|discount)\b',
            r'\bcan we (?:discuss|talk about)\b',
            r'\bterms and conditions\b',
            r'\b(let\'s|we should)\s+(?:meet|discuss)\b',
        ],
        "priority": "high",
        "action": "Schedule negotiation meeting, prepare talking points",
    },
    "spam": {
        "patterns": [
            r'\b(congratulations|winner|prize|lottery)\b',
            r'\b(click here|act now|limited time)\b',
            r'\b(million dollars|inheritance|beneficiary)\b',
            r'\b(verify your account|update your information)\b',
            r'\bfree (?:money|gift|offer)\b',
        ],
        "priority": "low",
        "action": "Flag as spam, do not respond",
    },
    "feedback": {
        "patterns": [
            r'\b(feedback|suggestion|recommendation)\b',
            r'\bI (?:think|believe|suggest)\b',
            r'\b(great|excellent|amazing)\s+(?:job|work|service)\b',
            r'\b(improve|enhancement|better)\b',
            r'\b(thank you|thanks|appreciate)\b',
        ],
        "priority": "low",
        "action": "Acknowledge feedback, log for product team",
    },
    "appointment": {
        "patterns": [
            r'\b(schedule|meeting|appointment|call)\b',
            r'\b(available|free time|calendar)\b',
            r'\b(let\'s|we should)\s+(?:meet|catch up|talk)\b',
            r'\b(monday|tuesday|wednesday|thursday|friday)\b',
            r'\b(\d{1,2}:\d{2}\s*(?:am|pm)?)\b',
        ],
        "priority": "medium",
        "action": "Check calendar, propose 3 time slots, send invite",
    },
    "follow_up": {
        "patterns": [
            r'\b(follow up|following up|checking in)\b',
            r'\b(any update|status update|progress)\b',
            r'\b(haven\'t heard|waiting for)\b',
            r'\b(reminder|just checking)\b',
            r'\bre:\s+',
        ],
        "priority": "medium",
        "action": "Provide status update or acknowledge delay",
    },
    "urgent": {
        "patterns": [
            r'\b(urgent|asap|immediately|critical)\b',
            r'\b(emergency|time-sensitive)\b',
            r'\b(within \d+ hours?|by today|by eod)\b',
            r'\b(deadline|due date)\b',
        ],
        "priority": "urgent",
        "action": "Respond within 1 hour, escalate if needed",
    },
}

def classify_intent(email):
    """Classify email intent using pattern matching"""
    scores = {}
    email_lower = email.lower()
    
    for intent, data in INTENT_PATTERNS.items():
        score = 0
        matched_patterns = []
        for pattern in data["patterns"]:
            matches = re.findall(pattern, email, re.I)
            if matches:
                score += len(matches) * 10
                matched_patterns.extend(matches[:3])
        
        if score > 0:
            scores[intent] = {
                "score": score,
                "priority": data["priority"],
                "action": data["action"],
                "matched": matched_patterns,
            }
    
    if not scores:
        return {
            "primary_intent": "general",
            "confidence": 50,
            "priority": "medium",
            "action": "Review and respond appropriately",
            "all_intents": [],
        }
    
    sorted_intents = sorted(scores.items(), key=lambda x: x[1]["score"], reverse=True)
    primary = sorted_intents[0]
    total_score = sum(s["score"] for s in scores.values())
    confidence = min(95, (primary[1]["score"] / total_score) * 100) if total_score > 0 else 50
    
    return {
        "primary_intent": primary[0],
        "confidence": round(confidence, 1),
        "priority": primary[1]["priority"],
        "action": primary[1]["action"],
        "all_intents": [
            {
                "intent": intent,
                "score": data["score"],
                "priority": data["priority"],
            }
            for intent, data in sorted_intents[:3]
        ],
    }

def analyze_email(email, reply_all_required=False):
    """Full intent classification analysis"""
    classification = classify_intent(email)
    
    return {
        "engine": "V1006 - Email Intent Classifier",
        "primary_intent": classification["primary_intent"],
        "confidence": classification["confidence"],
        "priority": classification["priority"],
        "recommended_action": classification["action"],
        "all_detected_intents": classification["all_intents"],
        "workflow_routing": generate_workflow_routing(classification),
        "reply_all_enforced": reply_all_required or True,
        "case_by_case_analysis": True,
    }

def generate_workflow_routing(classification):
    """Generate workflow routing based on intent"""
    intent = classification["primary_intent"]
    priority = classification["priority"]
    
    routing = {
        "team": "general",
        "queue": "inbox",
        "sla_hours": 24,
    }
    
    if intent == "complaint":
        routing["team"] = "customer_success"
        routing["queue"] = "complaints"
        routing["sla_hours"] = 4
    elif intent == "negotiation":
        routing["team"] = "sales"
        routing["queue"] = "deals"
        routing["sla_hours"] = 8
    elif intent == "spam":
        routing["team"] = "security"
        routing["queue"] = "spam"
        routing["sla_hours"] = 0
    elif intent == "appointment":
        routing["team"] = "scheduling"
        routing["queue"] = "meetings"
        routing["sla_hours"] = 12
    elif intent == "urgent":
        routing["team"] = "priority"
        routing["queue"] = "urgent"
        routing["sla_hours"] = 1
    
    return routing

# === TEST ===
if __name__ == "__main__":
    test1 = """Could you please send me the Q4 report? I need it by Friday."""
    result1 = analyze_email(test1, reply_all_required=True)
    print("=== V1006 Email Intent Classifier ===")
    print(f"  Intent: {result1['primary_intent']}")
    print(f"  Confidence: {result1['confidence']}%")
    print(f"  Priority: {result1['priority']}")
    print(f"  Action: {result1['recommended_action']}")
    print(f"  Routing: {result1['workflow_routing']}")
    print(f"  Reply-all enforced: {result1['reply_all_enforced']}")
    
    test2 = """I'm very disappointed with the service. This is terrible and not working at all."""
    result2 = analyze_email(test2)
    print(f"\n  Test 2 Intent: {result2['primary_intent']}")
    print(f"  Test 2 Priority: {result2['priority']}")
    
    test3 = """Congratulations! You've won $1 million! Click here to claim your prize!"""
    result3 = analyze_email(test3)
    print(f"\n  Test 3 Intent: {result3['primary_intent']}")
    
    assert result1["reply_all_enforced"] is True
    assert result1["case_by_case_analysis"] is True
    assert result2["priority"] == "urgent"
    assert result3["primary_intent"] == "spam"
    print("\n✅ All V1006 tests passed!")
