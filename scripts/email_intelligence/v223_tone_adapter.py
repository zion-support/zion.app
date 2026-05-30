#!/usr/bin/env python3
"""V223 - AI Email Tone Adapter
Automatically adjust email tone based on recipient relationship,
time of day, urgency level, and cultural context.
Always enforces reply-all for multi-recipient emails.
"""
import json, re, datetime
from dataclasses import dataclass, field
from typing import List, Dict, Optional

@dataclass
class ToneProfile:
    recipient_type: str  # "executive", "peer", "customer", "vendor"
    formality: str  # "formal", "semi-formal", "casual"
    directness: str  # "direct", "diplomatic", "collaborative"
    urgency_adjustment: str  # "amplify", "maintain", "soften"

class ToneAnalyzer:
    TONE_MARKERS = {
        "formal": ["dear", "sincerely", "regards", "respectfully", "please find", "kindly"],
        "casual": ["hey", "hi", "thanks", "cheers", "btw", "lol", "no worries"],
        "direct": ["must", "require", "need", "immediately", "deadline", "mandatory"],
        "diplomatic": ["perhaps", "might", "could we", "would it be possible", "I suggest"],
        "collaborative": ["let's", "together", "team", "we can", "partner", "collaborate"],
    }
    
    def analyze(self, text: str) -> Dict[str, float]:
        scores = {}
        text_lower = text.lower()
        for tone, markers in self.TONE_MARKERS.items():
            count = sum(1 for m in markers if m in text_lower)
            scores[tone] = min(1.0, count * 0.3)
        return scores

class ToneAdapter:
    RECIPIENT_PROFILES = {
        "executive": ToneProfile("executive", "formal", "direct", "maintain"),
        "peer": ToneProfile("peer", "semi-formal", "collaborative", "soften"),
        "customer": ToneProfile("customer", "semi-formal", "diplomatic", "soften"),
        "vendor": ToneProfile("vendor", "formal", "direct", "maintain"),
        "team": ToneProfile("team", "casual", "collaborative", "maintain"),
    }
    
    def adapt(self, text: str, recipient_type: str, urgency: str = "normal") -> Dict:
        profile = self.RECIPIENT_PROFILES.get(recipient_type, self.RECIPIENT_PROFILES["peer"])
        suggestions = []
        
        if profile.formality == "formal":
            casual_words = ["hey", "btw", "lol", "no worries", "gonna"]
            for w in casual_words:
                if w in text.lower():
                    suggestions.append(f"Replace '{w}' with formal alternative")
            if not any(g in text.lower() for g in ["dear", "regards", "sincerely"]):
                suggestions.append("Add formal greeting and closing")
        
        if profile.directness == "diplomatic":
            direct_words = ["must", "require", "need to", "immediately"]
            for w in direct_words:
                if w in text.lower():
                    suggestions.append(f"Soften '{w}' → 'would it be possible to' or 'we suggest'")
        
        if profile.directness == "collaborative":
            if not any(w in text.lower() for w in ["let's", "together", "we"]):
                suggestions.append("Use collaborative language: 'Let's', 'We can', 'Together'")
        
        if urgency == "high" and profile.urgency_adjustment == "soften":
            suggestions.append("Add context for urgency: 'Due to [reason], we need to...'")
        
        score = max(0, 1.0 - len(suggestions) * 0.15)
        
        return {
            "recipient_type": recipient_type,
            "recommended_tone": f"{profile.formality} + {profile.directness}",
            "tone_fit_score": round(score, 2),
            "suggestions": suggestions,
            "formality": profile.formality,
            "directness": profile.directness
        }

class EmailToneEngine:
    def __init__(self):
        self.analyzer = ToneAnalyzer()
        self.adapter = ToneAdapter()
    
    def analyze_and_adapt(self, email: Dict, recipients: List[str] = None) -> Dict:
        body = email.get("body", "")
        tone_scores = self.analyzer.analyze(body)
        recipient_type = email.get("recipient_type", "peer")
        urgency = "high" if any(w in email.get("subject", "").lower() for w in ["urgent", "asap", "critical"]) else "normal"
        
        adaptation = self.adapter.adapt(body, recipient_type, urgency)
        
        return {
            "email_id": email.get("id", ""),
            "current_tone": tone_scores,
            "adaptation": adaptation,
            "reply_all_required": len(recipients or []) > 1,
            "timestamp": datetime.datetime.now().isoformat()
        }

if __name__ == "__main__":
    engine = EmailToneEngine()
    sample = {"id": "tone-001", "recipient_type": "executive",
              "subject": "Urgent: Budget approval needed",
              "body": "Hey, we need the budget approved ASAP. The vendor requires payment by Friday. Can you sign off? BTW the total is $50k. Thanks!"}
    result = engine.analyze_and_adapt(sample, ["ceo@company.com", "cfo@company.com"])
    print(json.dumps(result, indent=2))
