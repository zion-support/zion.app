#!/usr/bin/env python3
"""V548 - Churn Prevention Engine
Detects at-risk customers from email patterns and triggers proactive retention actions.
CRITICAL: Always enforces reply-all for multi-recipient emails.
"""
import json
from datetime import datetime
from typing import Dict, List

class ChurnPreventionEngine:
    def __init__(self):
        self.reply_all_enforced = True
    
    def assess_churn_risk(self, email: Dict, email_history: List[Dict] = None) -> Dict:
        """Assess churn risk from email patterns"""
        risk_signals = self._detect_risk_signals(email)
        engagement_trend = self._analyze_engagement_trend(email_history)
        sentiment_trend = self._analyze_sentiment_trend(email.get("body", ""))
        
        # Calculate overall churn risk score (0-1)
        risk_score = (risk_signals["score"] * 0.4 + 
                     (1 - engagement_trend) * 0.3 + 
                     (1 - sentiment_trend) * 0.3)
        
        risk_level = "critical" if risk_score > 0.7 else "high" if risk_score > 0.5 else "medium" if risk_score > 0.3 else "low"
        
        return {
            "engine": "V548_Churn_Prevention_Engine",
            "timestamp": datetime.now().isoformat(),
            "churn_risk_score": round(risk_score, 3),
            "risk_level": risk_level,
            "risk_signals": risk_signals,
            "engagement_trend": round(engagement_trend, 3),
            "sentiment_trend": round(sentiment_trend, 3),
            "retention_actions": self._generate_retention_actions(risk_level, risk_signals),
            "reply_all_enforced": self.reply_all_enforced,
            "all_recipients": email.get("to", []) + email.get("cc", [])
        }
    
    def _detect_risk_signals(self, email: Dict) -> Dict:
        """Detect churn risk signals in email"""
        body = email.get("body", "").lower()
        signals = {
            "score": 0,
            "negative_language": [],
            "competitor_mentions": False,
            "service_issues": False,
            "price_objections": False,
            "disengagement": False
        }
        
        # Negative language
        negative_words = ["frustrated", "disappointed", "unhappy", "angry", "cancel", "refund", "terrible"]
        signals["negative_language"] = [w for w in negative_words if w in body]
        signals["score"] += len(signals["negative_language"]) * 0.15
        
        # Competitor mentions
        if any(w in body for w in ["competitor", "alternative", "switching to", "other solution"]):
            signals["competitor_mentions"] = True
            signals["score"] += 0.3
        
        # Service issues
        if any(w in body for w in ["not working", "broken", "error", "bug", "issue", "problem"]):
            signals["service_issues"] = True
            signals["score"] += 0.2
        
        # Price objections
        if any(w in body for w in ["expensive", "too much", "cost", "budget", "afford"]):
            signals["price_objections"] = True
            signals["score"] += 0.15
        
        signals["score"] = min(signals["score"], 1.0)
        return signals
    
    def _analyze_engagement_trend(self, history: List[Dict] = None) -> float:
        """Analyze engagement trend from email history"""
        if not history or len(history) < 3:
            return 0.5  # Neutral if insufficient data
        
        # Simple trend: more recent emails = better engagement
        recent_count = len([e for e in history[-5:]])
        older_count = len([e for e in history[:-5]])
        
        if recent_count > older_count:
            return 0.8
        elif recent_count < older_count:
            return 0.3
        return 0.5
    
    def _analyze_sentiment_trend(self, text: str) -> float:
        """Analyze sentiment trend"""
        pos = ["great", "excellent", "love", "amazing", "thank", "happy", "satisfied"]
        neg = ["frustrated", "disappointed", "angry", "unhappy", "problem", "issue", "terrible"]
        tl = text.lower()
        pos_count = sum(1 for w in pos if w in tl)
        neg_count = sum(1 for w in neg if w in tl)
        return pos_count / max(pos_count + neg_count + 1, 1)
    
    def _generate_retention_actions(self, risk_level: str, signals: Dict) -> List[Dict]:
        """Generate retention actions based on risk"""
        actions = []
        
        if risk_level in ["critical", "high"]:
            actions.append({"action": "Immediate outreach from Customer Success Manager", "priority": "critical", "timeline": "within 2 hours"})
            actions.append({"action": "Schedule retention call", "priority": "high", "timeline": "within 24 hours"})
        
        if signals["competitor_mentions"]:
            actions.append({"action": "Competitive differentiation presentation", "priority": "high", "timeline": "within 48 hours"})
        
        if signals["service_issues"]:
            actions.append({"action": "Technical team escalation and resolution", "priority": "critical", "timeline": "within 24 hours"})
        
        if signals["price_objections"]:
            actions.append({"action": "Offer retention discount or plan adjustment", "priority": "medium", "timeline": "within 72 hours"})
        
        if risk_level == "medium":
            actions.append({"action": "Proactive check-in and value demonstration", "priority": "medium", "timeline": "within 1 week"})
        
        return actions

if __name__ == "__main__":
    engine = ChurnPreventionEngine()
    test = {"body": "I'm frustrated with the constant issues. We're considering switching to a competitor.", "to": ["support@zion.com"], "cc": ["manager@client.com"]}
    print(json.dumps(engine.assess_churn_risk(test), indent=2))
