#!/usr/bin/env python3
"""V615 - Email Tone Analyzer & Adapter
Analyze email tone and adapt responses based on recipient relationship and context.
REPLY-ALL ENFORCED: Always replies to all recipients in multi-person threads.
"""
import json, re
from datetime import datetime
from typing import Dict, List, Any

class ToneAnalyzerAdapter:
    """Analyze and adapt email tone based on context and relationship."""
    
    TONE_DIMENSIONS = {
        "formality": {"formal": ["dear", "sincerely", "regards", "respectfully"], "casual": ["hey", "hi", "cheers", "thanks"]},
        "directness": {"direct": ["please do", "send me", "I need", "require"], "indirect": ["could you", "would it be possible", "if you don't mind"]},
        "warmth": {"warm": ["wonderful", "great", "love", "appreciate", "happy"], "cool": ["noted", "acknowledged", "received"]},
        "confidence": {"confident": ["definitely", "certainly", "absolutely", "will"], "tentative": ["maybe", "perhaps", "might", "possibly"]}
    }
    
    RELATIONSHIP_CONTEXTS = {
        "executive": {"formality": "formal", "directness": "direct", "warmth": "warm", "confidence": "confident"},
        "client": {"formality": "formal", "directness": "indirect", "warmth": "warm", "confidence": "confident"},
        "peer": {"formality": "casual", "directness": "direct", "warmth": "warm", "confidence": "confident"},
        "subordinate": {"formality": "casual", "directness": "direct", "warmth": "warm", "confidence": "confident"},
        "vendor": {"formality": "formal", "directness": "direct", "warmth": "cool", "confidence": "confident"},
        "unknown": {"formality": "formal", "directness": "indirect", "warmth": "warm", "confidence": "tentative"}
    }
    
    def __init__(self):
        self.analyses = []
    
    def analyze_tone(self, email: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze the tone of an email."""
        body = email.get("body", "")
        subject = email.get("subject", "")
        text = body + " " + subject
        
        tone_profile = self._build_tone_profile(text)
        relationship = self._detect_relationship(email)
        ideal_tone = self.RELATIONSHIP_CONTEXTS.get(relationship, self.RELATIONSHIP_CONTEXTS["unknown"])
        
        mismatches = self._detect_mismatches(tone_profile, ideal_tone)
        suggestions = self._generate_suggestions(tone_profile, ideal_tone, mismatches)
        adapted_response = self._adapt_response(tone_profile, relationship)
        
        tone_score = self._calculate_tone_score(tone_profile, ideal_tone)
        
        return {
            "engine": "V615",
            "tone_profile": tone_profile,
            "detected_relationship": relationship,
            "ideal_tone": ideal_tone,
            "mismatches": mismatches,
            "tone_score": round(tone_score, 1),
            "suggestions": suggestions,
            "adapted_response_preview": adapted_response,
            "reply_all_enforced": len(email.get("to", []) + email.get("cc", [])) > 1,
            "timestamp": datetime.now().isoformat()
        }
    
    def _build_tone_profile(self, text: str) -> Dict[str, str]:
        """Build tone profile across all dimensions."""
        profile = {}
        text_lower = text.lower()
        
        for dimension, values in self.TONE_DIMENSIONS.items():
            scores = {}
            for value, keywords in values.items():
                scores[value] = sum(1 for kw in keywords if kw in text_lower)
            
            if scores:
                profile[dimension] = max(scores, key=scores.get)
            else:
                profile[dimension] = list(values.keys())[0]
        
        return profile
    
    def _detect_relationship(self, email: Dict) -> str:
        """Detect relationship type with sender."""
        sender = email.get("from", "").lower()
        body = email.get("body", "").lower()
        
        if any(title in sender for title in ["ceo", "cto", "cfo", "vp", "director"]):
            return "executive"
        if "client" in body or "customer" in body:
            return "client"
        if "vendor" in sender or "supplier" in sender:
            return "vendor"
        if any(word in body for word in ["team", "colleagues", "folks"]):
            return "peer"
        return "unknown"
    
    def _detect_mismatches(self, actual: Dict, ideal: Dict) -> List[str]:
        """Detect tone mismatches."""
        mismatches = []
        for dimension, actual_value in actual.items():
            ideal_value = ideal.get(dimension)
            if ideal_value and actual_value != ideal_value:
                mismatches.append(f"{dimension}: using '{actual_value}' but '{ideal_value}' is more appropriate")
        return mismatches
    
    def _generate_suggestions(self, actual: Dict, ideal: Dict, mismatches: List[str]) -> List[str]:
        """Generate tone improvement suggestions."""
        suggestions = []
        if not mismatches:
            suggestions.append("Tone is well-matched for this relationship")
            return suggestions
        
        for mismatch in mismatches:
            dim = mismatch.split(":")[0]
            suggestions.append(f"Consider adjusting {dim} to better match the relationship")
        
        if actual.get("warmth") == "cool":
            suggestions.append("Add more warmth to build rapport")
        if actual.get("formality") == "casual" and ideal.get("formality") == "formal":
            suggestions.append("Increase formality for this recipient")
        
        return suggestions
    
    def _adapt_response(self, tone_profile: Dict, relationship: str) -> str:
        """Generate adapted response preview."""
        templates = {
            "executive": "Dear [Name],\n\nThank you for your message regarding [topic]. I have reviewed the details and [action].\n\nBest regards,\n[Your Name]",
            "client": "Hello [Name],\n\nThank you for reaching out! I'd be happy to help with [topic]. [Response details].\n\nPlease let me know if you need anything else.\n\nWarm regards,\n[Your Name]",
            "peer": "Hey [Name],\n\nThanks for the heads up on [topic]. I'll take care of it and [action].\n\nCheers,\n[Your Name]",
            "subordinate": "Hi [Name],\n\nThanks for the update on [topic]. Great work! Let's [next step].\n\nBest,\n[Your Name]",
            "vendor": "Hello [Name],\n\nThank you for your message regarding [topic]. We have noted [details] and will [action].\n\nRegards,\n[Your Name]",
            "unknown": "Hello [Name],\n\nThank you for your email regarding [topic]. I've received your message and will [action].\n\nKind regards,\n[Your Name]"
        }
        return templates.get(relationship, templates["unknown"])
    
    def _calculate_tone_score(self, actual: Dict, ideal: Dict) -> float:
        """Calculate tone match score (0-100)."""
        matches = sum(1 for dim, val in actual.items() if ideal.get(dim) == val)
        total = len(actual)
        return (matches / total * 100) if total else 100
    
    def process_batch(self, emails: List[Dict]) -> Dict[str, Any]:
        results = [self.analyze_tone(e) for e in emails]
        avg_score = sum(r["tone_score"] for r in results) / len(results) if results else 0
        return {
            "engine": "V615 - Tone Analyzer & Adapter",
            "total_analyzed": len(results),
            "average_tone_score": round(avg_score, 1),
            "reply_all_enforced": sum(1 for r in results if r["reply_all_enforced"]),
            "results": results
        }

if __name__ == "__main__":
    engine = ToneAnalyzerAdapter()
    test_emails = [
        {"from": "ceo@company.com", "subject": "Q4 Strategy Review", "body": "Dear team, please review the attached Q4 strategy document and provide your feedback by Friday.", 
         "to": ["leadership@company.com", "managers@company.com"]},
        {"from": "buddy@company.com", "subject": "Lunch?", "body": "Hey! Wanna grab lunch today? There's a new place downtown.", 
         "to": ["me@company.com"]},
        {"from": "client@external.com", "subject": "Project Update Request", "body": "Hi, could you please provide an update on the project timeline? We need to plan our resources.", 
         "to": ["account@company.com", "pm@company.com"]}
    ]
    result = engine.process_batch(test_emails)
    print(json.dumps(result, indent=2))
