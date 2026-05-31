#!/usr/bin/env python3
"""V552 - Competitive Intelligence Tracker
Monitors competitor mentions in emails and generates competitive positioning recommendations.
CRITICAL: Always enforces reply-all for multi-recipient emails.
"""
import json
from datetime import datetime
from typing import Dict, List

class CompetitiveIntelligenceTracker:
    def __init__(self):
        self.reply_all_enforced = True
        self.known_competitors = ["competitor a", "competitor b", "competitor c", "alternative", "other vendor"]
    
    def analyze_competitive_context(self, email: Dict, thread_context: List[Dict] = None) -> Dict:
        """Analyze email for competitive intelligence"""
        analysis = {
            "engine": "V552_Competitive_Intelligence_Tracker",
            "timestamp": datetime.now().isoformat(),
            "competitor_mentions": self._detect_competitor_mentions(email),
            "competitive_signals": self._analyze_competitive_signals(email),
            "positioning_recommendations": [],
            "differentiation_opportunities": [],
            "win_probability": self._calculate_win_probability(email),
            "reply_all_enforced": self.reply_all_enforced,
            "all_recipients": email.get("to", []) + email.get("cc", [])
        }
        
        analysis["positioning_recommendations"] = self._generate_positioning_strategy(analysis)
        analysis["differentiation_opportunities"] = self._identify_differentiation(analysis)
        
        return analysis
    
    def _detect_competitor_mentions(self, email: Dict) -> List[Dict]:
        """Detect mentions of competitors in email"""
        mentions = []
        body = email.get("body", "").lower()
        
        for competitor in self.known_competitors:
            if competitor in body:
                # Extract context
                idx = body.index(competitor)
                context = body[max(0, idx-50):min(len(body), idx+100)]
                mentions.append({
                    "competitor": competitor,
                    "context": context.strip(),
                    "sentiment": self._analyze_competitor_sentiment(context)
                })
        
        return mentions
    
    def _analyze_competitive_signals(self, email: Dict) -> Dict:
        """Analyze competitive signals in email"""
        body = email.get("body", "").lower()
        
        signals = {
            "price_comparison": False,
            "feature_comparison": False,
            "switching_intent": False,
            "evaluation_stage": False,
            "decision_timeline": None
        }
        
        # Price comparison signals
        if any(phrase in body for phrase in ["cheaper", "less expensive", "better pricing", "cost comparison"]):
            signals["price_comparison"] = True
        
        # Feature comparison signals
        if any(phrase in body for phrase in ["feature", "capability", "functionality", "does it", "can it"]):
            signals["feature_comparison"] = True
        
        # Switching intent
        if any(phrase in body for phrase in ["switch to", "move to", "migrate", "considering alternatives"]):
            signals["switching_intent"] = True
        
        # Evaluation stage
        if any(phrase in body for phrase in ["evaluating", "comparing", "looking at", "researching"]):
            signals["evaluation_stage"] = True
        
        # Decision timeline
        if "this week" in body:
            signals["decision_timeline"] = "imminent"
        elif "next month" in body:
            signals["decision_timeline"] = "short_term"
        elif "this quarter" in body:
            signals["decision_timeline"] = "medium_term"
        
        return signals
    
    def _calculate_win_probability(self, email: Dict) -> float:
        """Calculate probability of winning deal"""
        body = email.get("body", "").lower()
        score = 0.5  # Base probability
        
        # Positive signals
        if "interested" in body or "excited" in body:
            score += 0.2
        if "your solution" in body or "your product" in body:
            score += 0.1
        
        # Negative signals
        if "competitor" in body or "alternative" in body:
            score -= 0.15
        if "expensive" in body or "too much" in body:
            score -= 0.2
        if "switching" in body:
            score -= 0.1
        
        return max(0.0, min(1.0, score))
    
    def _generate_positioning_strategy(self, analysis: Dict) -> List[Dict]:
        """Generate competitive positioning strategy"""
        recommendations = []
        signals = analysis["competitive_signals"]
        
        if signals["price_comparison"]:
            recommendations.append({
                "type": "value_framing",
                "message": "Emphasize total cost of ownership and ROI, not just price",
                "talking_points": [
                    "Lower implementation costs",
                    "Reduced maintenance overhead",
                    "Higher productivity gains",
                    "Better support and training included"
                ]
            })
        
        if signals["feature_comparison"]:
            recommendations.append({
                "type": "feature_highlight",
                "message": "Focus on unique differentiators and superior capabilities",
                "talking_points": [
                    "Advanced AI-powered features",
                    "Seamless integration ecosystem",
                    "Industry-leading security and compliance",
                    "Dedicated customer success team"
                ]
            })
        
        if signals["switching_intent"]:
            recommendations.append({
                "type": "retention_focus",
                "message": "Address switching concerns and highlight switching costs",
                "talking_points": [
                    "Data migration challenges",
                    "Training and onboarding investment",
                    "Proven track record and reliability",
                    "Exclusive features not available elsewhere"
                ]
            })
        
        if signals["evaluation_stage"]:
            recommendations.append({
                "type": "educational_content",
                "message": "Provide comprehensive evaluation materials",
                "talking_points": [
                    "Detailed feature comparison matrix",
                    "Customer case studies and testimonials",
                    "Free trial or proof of concept",
                    "Expert consultation sessions"
                ]
            })
        
        return recommendations
    
    def _identify_differentiation(self, analysis: Dict) -> List[Dict]:
        """Identify differentiation opportunities"""
        opportunities = []
        
        # Always highlight core strengths
        opportunities.append({
            "area": "Technology Leadership",
            "message": "Emphasize cutting-edge AI and ML capabilities",
            "evidence": "350+ email intelligence engines, continuous innovation"
        })
        
        opportunities.append({
            "area": "Customer Success",
            "message": "Highlight dedicated support and success programs",
            "evidence": "24/7 support, dedicated account managers, proactive monitoring"
        })
        
        opportunities.append({
            "area": "Security & Compliance",
            "message": "Stress enterprise-grade security and compliance",
            "evidence": "SOC 2, GDPR, HIPAA, PCI-DSS compliance, advanced threat protection"
        })
        
        if analysis["competitive_signals"]["price_comparison"]:
            opportunities.append({
                "area": "Total Value",
                "message": "Focus on total value beyond just price",
                "evidence": "Lower TCO, higher ROI, included services and support"
            })
        
        return opportunities
    
    def _analyze_competitor_sentiment(self, context: str) -> str:
        """Analyze sentiment around competitor mention"""
        context_lower = context.lower()
        if any(w in context_lower for w in ["better", "superior", "prefer"]):
            return "positive_for_competitor"
        elif any(w in context_lower for w in ["expensive", "limited", "lacks"]):
            return "negative_for_competitor"
        return "neutral"

if __name__ == "__main__":
    engine = CompetitiveIntelligenceTracker()
    test = {
        "body": "We're comparing your solution with Competitor A. They seem cheaper but we're not sure about their features.",
        "to": ["sales@zion.com"],
        "cc": ["manager@client.com"]
    }
    result = engine.analyze_competitive_context(test)
    print(json.dumps(result, indent=2))
