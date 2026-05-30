#!/usr/bin/env python3
"""V220 - AI Email Influence & Persuasion Analyzer
Detect persuasion techniques in emails (scarcity, authority, social proof,
reciprocity, liking, commitment), score influence effectiveness, and
suggest ethical persuasion strategies for sales and negotiations.
Always enforces reply-all for multi-recipient emails.
"""
import json, re, datetime
from dataclasses import dataclass, field
from typing import List, Dict, Optional

@dataclass
class PersuasionTechnique:
    technique: str  # Cialdini's 6 + extras
    detected: bool
    strength: float  # 0.0 to 1.0
    evidence: List[str]
    effectiveness_score: float
    ethical_flag: bool  # False if potentially manipulative

PERSUASION_FRAMEWORK = {
    "reciprocity": {
        "description": "Giving something to create obligation",
        "patterns": [
            r"(?:free|complimentary|at no cost|on the house|gift|bonus)",
            r"(?:we(?:'ve| have)?) (?:prepared|created|built|included) (?:something|this) (?:for|specially for) you",
            r"(?:as a (?:token|gesture|thank you))",
        ],
        "ethical": True,
    },
    "scarcity": {
        "description": "Limited availability creates urgency",
        "patterns": [
            r"(?:only|just) \d+ (?:spots|seats|licenses|slots) (?:left|remaining|available)",
            r"(?:limited|exclusive|final) (?:time|offer|opportunity|availability)",
            r"(?:expires|ends|closes) (?:today|tomorrow|this week|soon)",
            r"(?:while supplies last|first come|act now)",
        ],
        "ethical": False,  # Can be manipulative if false
    },
    "authority": {
        "description": "Establishing credibility and expertise",
        "patterns": [
            r"(?:industry-leading|award-winning|#1|top-rated|best-in-class)",
            r"(?:\d+ (?:years|clients|customers|companies|enterprises))",
            r"(?:certified|accredited|licensed|recognized)",
            r"(?:as (?:seen|featured|published) in|according to|research shows)",
        ],
        "ethical": True,
    },
    "social_proof": {
        "description": "Others are doing it, so should you",
        "patterns": [
            r"(?:\d+ (?:companies|clients|customers|users|businesses)) (?:trust|use|choose|rely on)",
            r"(?:join|like) (?:thousands of|other|your peers|industry leaders)",
            r"(?:rated|reviewed|recommended) (?:by|from) \d+",
            r"(?:case study|success story|testimonial)",
        ],
        "ethical": True,
    },
    "liking": {
        "description": "Building rapport and similarity",
        "patterns": [
            r"(?:i (?:noticed|saw|loved|enjoyed)) (?:your|that you)",
            r"(?:we (?:have|share) (?:a lot|so much) in common)",
            r"(?:great|impressive|amazing|fantastic) (?:work|achievement|progress|insight)",
            r"(?:fellow|alumni|same|similar)",
        ],
        "ethical": True,
    },
    "commitment_consistency": {
        "description": "Getting small yes to lead to bigger yes",
        "patterns": [
            r"(?:you (?:mentioned|said|agreed|confirmed)) (?:that|you)",
            r"(?:as you (?:know|understand|mentioned|agreed))",
            r"(?:building on|following up on|as discussed)",
            r"(?:next (?:logical|natural) step)",
        ],
        "ethical": True,
    },
    "urgency": {
        "description": "Creating time pressure",
        "patterns": [
            r"(?:asap|immediately|right away|without delay|urgently)",
            r"(?:time-sensitive|time-critical|cannot wait)",
            r"(?:before it(?:'s| is) too late|while you still can)",
        ],
        "ethical": False,
    },
    "framing": {
        "description": "Presenting information to influence perception",
        "patterns": [
            r"(?:save|saving|save up to) \$?\d+",
            r"(?:only \$?\d+ (?:per|a) (?:day|month|user))",
            r"(?:roi|return|investment) (?:of|is|at) \d+",
            r"(?:compared to|instead of|rather than) (?:paying|spending|losing)",
        ],
        "ethical": True,
    },
}

class PersuasionDetector:
    """Detect persuasion techniques in email content."""
    
    def detect(self, text: str) -> List[PersuasionTechnique]:
        techniques = []
        
        for technique_name, info in PERSUASION_FRAMEWORK.items():
            evidence = []
            for pattern in info["patterns"]:
                matches = re.findall(pattern, text, re.IGNORECASE)
                evidence.extend(matches)
            
            detected = len(evidence) > 0
            strength = min(1.0, len(evidence) * 0.3) if detected else 0.0
            effectiveness = strength * (0.8 if info["ethical"] else 0.6)
            
            techniques.append(PersuasionTechnique(
                technique=technique_name,
                detected=detected,
                strength=round(strength, 2),
                evidence=evidence[:3],
                effectiveness_score=round(effectiveness, 2),
                ethical_flag=info["ethical"]
            ))
        
        return techniques

class InfluenceScorer:
    """Score overall influence effectiveness of an email."""
    
    def score(self, techniques: List[PersuasionTechnique]) -> Dict:
        detected = [t for t in techniques if t.detected]
        
        if not detected:
            return {"overall_score": 0.3, "rating": "neutral", "diversity": 0}
        
        # Weighted score
        total_effectiveness = sum(t.effectiveness_score for t in detected)
        avg_effectiveness = total_effectiveness / len(detected)
        
        # Diversity bonus (using multiple techniques)
        diversity_bonus = min(0.2, len(detected) * 0.05)
        
        # Ethical bonus
        ethical_count = sum(1 for t in detected if t.ethical_flag)
        ethical_ratio = ethical_count / len(detected) if detected else 0
        ethical_bonus = ethical_ratio * 0.1
        
        overall = min(1.0, avg_effectiveness + diversity_bonus + ethical_bonus)
        
        ratings = [(0.8, "highly persuasive"), (0.6, "persuasive"), (0.4, "moderately persuasive"),
                   (0.2, "mildly persuasive"), (0.0, "neutral")]
        rating = next(r for threshold, r in ratings if overall >= threshold)
        
        return {
            "overall_score": round(overall, 2),
            "rating": rating,
            "diversity": len(detected),
            "ethical_ratio": round(ethical_ratio, 2),
            "techniques_used": [t.technique for t in detected]
        }

class PersuasionAdvisor:
    """Suggest ethical persuasion strategies."""
    
    def advise(self, techniques: List[PersuasionTechnique], context: str = "sales") -> List[str]:
        suggestions = []
        detected = [t for t in techniques if t.detected]
        undetected = [t for t in techniques if not t.detected]
        
        # Suggest missing ethical techniques
        for t in undetected:
            if t.ethical_flag:
                info = PERSUASION_FRAMEWORK[t.technique]
                suggestions.append(f"Consider adding {t.technique}: {info['description']}")
        
        # Flag unethical techniques
        for t in detected:
            if not t.ethical_flag:
                suggestions.append(f"⚠️ '{t.technique}' detected - ensure claims are truthful to maintain trust")
        
        # Context-specific advice
        if context == "sales":
            suggestions.append("Lead with social proof (customer success stories)")
            suggestions.append("Frame pricing as investment with ROI comparison")
        elif context == "negotiation":
            suggestions.append("Use commitment/consistency by referencing their previous agreements")
            suggestions.append("Establish authority with relevant expertise and credentials")
        
        return suggestions[:8]

class InfluencePersuasionEngine:
    """Main influence and persuasion analysis engine."""
    
    def __init__(self):
        self.detector = PersuasionDetector()
        self.scorer = InfluenceScorer()
        self.advisor = PersuasionAdvisor()
    
    def analyze_email(self, email: Dict, recipients: List[str] = None) -> Dict:
        body = email.get("body", "")
        techniques = self.detector.detect(body)
        influence_score = self.scorer.score(techniques)
        suggestions = self.advisor.advise(techniques)
        
        reply_all = len(recipients or []) > 1
        
        return {
            "email_id": email.get("id", ""),
            "persuasion_techniques": [
                {"technique": t.technique, "detected": t.detected,
                 "strength": t.strength, "evidence": t.evidence,
                 "effectiveness": t.effectiveness_score, "ethical": t.ethical_flag}
                for t in techniques if t.detected
            ],
            "influence_score": influence_score,
            "suggestions": suggestions,
            "reply_all_required": reply_all,
            "timestamp": datetime.datetime.now().isoformat()
        }

if __name__ == "__main__":
    engine = InfluencePersuasionEngine()
    sample = {
        "id": "persuade-001",
        "body": "I noticed your impressive Q2 results - fantastic growth! As an industry-leading platform trusted by 500+ enterprises including Fortune 500 companies, we've prepared a complimentary analysis for you. Only 3 spots remain this quarter. Our clients see an average ROI of 340%, saving $200K annually compared to their previous solution. As you mentioned in our last call, improving efficiency is your top priority - this is the natural next step."
    }
    result = engine.analyze_email(sample, ["prospect@acme.com", "sales@zion.com"])
    print(json.dumps(result, indent=2))
