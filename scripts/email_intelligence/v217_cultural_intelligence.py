#!/usr/bin/env python3
"""V217 - AI Email Cultural Intelligence Engine
Deep cultural context analysis beyond translation. Detect cultural
misunderstandings, suggest culturally appropriate phrasing, adapt
communication styles, and prevent cross-cultural miscommunication.
Always enforces reply-all for multi-recipient emails.
"""
import json, re, datetime
from dataclasses import dataclass, field
from typing import List, Dict, Optional, Tuple

@dataclass
class CulturalProfile:
    region: str
    communication_style: str  # "direct", "indirect", "hierarchical"
    formality_level: str  # "formal", "semi-formal", "casual"
    time_orientation: str  # "monochronic", "polychronic"
    decision_style: str  # "individual", "consensus"
    relationship_importance: str  # "high", "medium", "low"
    greeting_customs: List[str]
    taboos: List[str]
    preferred_address: str

CULTURAL_PROFILES = {
    "japan": CulturalProfile("Japan", "indirect", "formal", "monochronic", "consensus", "high",
        ["Bow reference in writing", "Honorific titles (san/sama)", "Seasonal greetings"],
        ["Direct refusal", "Confrontation", "Informal address"],
        "Title + Family name + san/sama"),
    "germany": CulturalProfile("Germany", "direct", "formal", "monochronic", "individual", "medium",
        ["Herr/Frau + title", "Punctuality emphasis", "Detailed technical content"],
        ["Small talk excess", "Vague commitments", "Informality too early"],
        "Herr/Frau + Title + Last name"),
    "usa": CulturalProfile("USA", "direct", "semi-formal", "monochronic", "individual", "low",
        ["First name basis", "Enthusiasm", "Action-oriented"],
        ["Over-formality", "Indirect communication", "Lengthy preambles"],
        "First name"),
    "brazil": CulturalProfile("Brazil", "indirect", "semi-formal", "polychronic", "consensus", "high",
        ["Warm greetings", "Relationship building", "Flexible timelines"],
        ["Rushing to business", "Cold tone", "Strict deadlines without context"],
        "First name with warmth"),
    "india": CulturalProfile("India", "indirect", "formal", "polychronic", "hierarchical", "high",
        ["Respectful titles (Sir/Madam)", "Relationship emphasis", "Detailed explanations"],
        ["Flat refusals", "Overly casual tone", "Ignoring hierarchy"],
        "Mr./Ms. + Last name or Sir/Madam"),
    "uk": CulturalProfile("UK", "indirect", "semi-formal", "monochronic", "individual", "medium",
        ["Understatement", "Politeness markers", "Dry humor"],
        ["Over-enthusiasm", "Bluntness", "Over-formality"],
        "First name (after initial formality)"),
    "china": CulturalProfile("China", "indirect", "formal", "polychronic", "consensus", "high",
        ["Guanxi building", "Respectful address", "Face-saving language"],
        ["Direct criticism", "Public disagreement", "Rushing relationships"],
        "Title + Family name"),
    "france": CulturalProfile("France", "direct", "formal", "monochronic", "individual", "medium",
        ["Intellectual discourse", "Formal greeting", "Quality emphasis"],
        ["Overly casual approach", "Ignoring protocol", "American-style enthusiasm"],
        "Monsieur/Madame + Last name"),
    "saudi_arabia": CulturalProfile("Saudi Arabia", "indirect", "formal", "polychronic", "hierarchical", "high",
        ["Religious greetings", "Relationship building", "Patience emphasis"],
        ["Rushing decisions", "Left-hand references", "Direct disagreement"],
        "Title + Full name"),
    "south_korea": CulturalProfile("South Korea", "indirect", "formal", "monochronic", "hierarchical", "high",
        ["Honorific language", "Respect for seniority", "Group harmony"],
        ["Informal address", "Public disagreement", "Individual spotlight"],
        "Title + Family name + nim"),
}

class RegionDetector:
    """Detect recipient cultural region from email signals."""
    
    REGION_SIGNALS = {
        "japan": [".jp", "co.jp", "san", "sama", "desu", "yoroshiku"],
        "germany": [".de", "gmbh", "ag", "herr", "frau"],
        "usa": [".com", ".us", "llc", "inc", "corp"],
        "brazil": [".br", "ltda", "obrigado", "obrigada"],
        "india": [".in", ".co.in", "pvt ltd", "sir", "madam"],
        "uk": [".co.uk", ".uk", "ltd", "plc", "cheers"],
        "china": [".cn", ".com.cn", "ltd", "laoban"],
        "france": [".fr", "sarl", "sas", "monsieur", "madame"],
        "saudi_arabia": [".sa", "est.", "trading", "inshallah"],
        "south_korea": [".kr", "co.kr", "ssi", "nim"],
    }
    
    def detect(self, email: Dict) -> Tuple[str, float]:
        from_addr = email.get("from", "").lower()
        body = email.get("body", "").lower()
        
        scores = {}
        for region, signals in self.REGION_SIGNALS.items():
            score = sum(1 for s in signals if s in from_addr or s in body)
            if score > 0:
                scores[region] = score
        
        if scores:
            best = max(scores, key=scores.get)
            return best, scores[best] / len(self.REGION_SIGNALS[best])
        return "usa", 0.3  # Default

class CulturalAnalyzer:
    """Analyze email content for cultural appropriateness."""
    
    def analyze(self, text: str, target_region: str) -> Dict:
        profile = CULTURAL_PROFILES.get(target_region)
        if not profile:
            return {"issues": [], "suggestions": [], "cultural_fit_score": 0.7}
        
        issues = []
        suggestions = []
        
        text_lower = text.lower()
        
        # Check for taboos
        for taboo in profile.taboos:
            taboo_lower = taboo.lower()
            if any(word in text_lower for word in taboo_lower.split()):
                issues.append(f"Potential cultural issue: may conflict with '{taboo}' in {profile.region}")
        
        # Check formality level
        casual_markers = ["hey", "hi there", "what's up", "btw", "lol"]
        casual_count = sum(1 for m in casual_markers if m in text_lower)
        
        if profile.formality_level == "formal" and casual_count > 0:
            issues.append(f"Too casual for {profile.region} - use formal address")
            suggestions.append(f"Use '{profile.preferred_address}' format")
        
        if profile.communication_style == "indirect" and "no" in text_lower.split()[:20]:
            issues.append(f"Direct refusal may be offensive in {profile.region}")
            suggestions.append("Use indirect phrasing: 'We'll explore alternatives' instead of 'No'")
        
        if profile.relationship_importance == "high" and len(text.split()) < 50:
            suggestions.append(f"Add relationship-building content for {profile.region}")
        
        if profile.time_orientation == "polychronic" and "deadline" in text_lower:
            suggestions.append(f"Soften deadline language for {profile.region} - use 'target' instead")
        
        # Calculate fit score
        fit_score = max(0, 1.0 - len(issues) * 0.2 - len(suggestions) * 0.05)
        
        return {
            "issues": issues,
            "suggestions": suggestions,
            "cultural_fit_score": round(fit_score, 2),
            "region_profile": {
                "communication_style": profile.communication_style,
                "formality_level": profile.formality_level,
                "greeting_customs": profile.greeting_customs,
                "preferred_address": profile.preferred_address
            }
        }

class CulturalIntelligenceEngine:
    """Main cultural intelligence engine."""
    
    def __init__(self):
        self.region_detector = RegionDetector()
        self.cultural_analyzer = CulturalAnalyzer()
    
    def analyze_email(self, email: Dict, recipients: List[str] = None) -> Dict:
        region, confidence = self.region_detector.detect(email)
        cultural_analysis = self.cultural_analyzer.analyze(email.get("body", ""), region)
        
        reply_all = len(recipients or []) > 1
        
        return {
            "detected_region": region,
            "detection_confidence": round(confidence, 2),
            "cultural_fit_score": cultural_analysis["cultural_fit_score"],
            "issues": cultural_analysis["issues"],
            "suggestions": cultural_analysis["suggestions"],
            "region_profile": cultural_analysis["region_profile"],
            "reply_all_required": reply_all,
            "timestamp": datetime.datetime.now().isoformat()
        }

if __name__ == "__main__":
    engine = CulturalIntelligenceEngine()
    sample = {
        "id": "cult-001", "from": "tanaka@company.co.jp",
        "subject": "Partnership discussion",
        "body": "Hey, we need to finalize this deal by Friday. No way we can extend the deadline. BTW, the price is too high - can you drop it 20%? Let me know ASAP."
    }
    result = engine.analyze_email(sample, ["tanaka@company.co.jp", "sales@zion.com"])
    print(json.dumps(result, indent=2))
