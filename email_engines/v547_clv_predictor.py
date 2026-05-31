#!/usr/bin/env python3
"""V547 - Customer Lifetime Value Predictor
Calculates CLV from email engagement patterns and predicts future revenue potential.
CRITICAL: Always enforces reply-all for multi-recipient emails.
"""
import json
from datetime import datetime
from typing import Dict, List

class CustomerLifetimeValuePredictor:
    def __init__(self):
        self.reply_all_enforced = True
    
    def predict_clv(self, email: Dict, customer_history: List[Dict] = None) -> Dict:
        """Predict customer lifetime value from email engagement"""
        engagement_score = self._calculate_engagement(email)
        sentiment_score = self._analyze_sentiment(email.get("body", ""))
        purchase_intent = self._detect_purchase_intent(email.get("body", ""))
        
        # Base CLV calculation
        base_clv = 5000  # Average customer value
        engagement_multiplier = 1 + (engagement_score * 0.5)
        sentiment_multiplier = 1 + (sentiment_score * 0.3)
        intent_multiplier = 1 + (purchase_intent * 0.4)
        
        predicted_clv = base_clv * engagement_multiplier * sentiment_multiplier * intent_multiplier
        
        # Customer segment
        segment = self._classify_segment(predicted_clv, engagement_score)
        
        # Retention risk
        retention_risk = self._assess_retention_risk(email, engagement_score)
        
        return {
            "engine": "V547_Customer_Lifetime_Value_Predictor",
            "timestamp": datetime.now().isoformat(),
            "predicted_clv": round(predicted_clv, 2),
            "engagement_score": round(engagement_score, 3),
            "sentiment_score": round(sentiment_score, 3),
            "purchase_intent": round(purchase_intent, 3),
            "customer_segment": segment,
            "retention_risk": retention_risk,
            "recommended_actions": self._recommend_actions(segment, retention_risk),
            "reply_all_enforced": self.reply_all_enforced,
            "all_recipients": email.get("to", []) + email.get("cc", [])
        }
    
    def _calculate_engagement(self, email: Dict) -> float:
        """Calculate engagement score (0-1)"""
        score = 0.3
        body = email.get("body", "").lower()
        if len(body) > 200: score += 0.2
        if email.get("attachments"): score += 0.1
        if any(w in body for w in ["question", "interested", "learn more", "details"]): score += 0.2
        if email.get("cc"): score += 0.1
        return min(score, 1.0)
    
    def _analyze_sentiment(self, text: str) -> float:
        """Analyze sentiment (-1 to 1)"""
        pos = ["great", "excellent", "love", "amazing", "thank", "appreciate"]
        neg = ["frustrated", "disappointed", "angry", "unhappy", "problem", "issue"]
        tl = text.lower()
        pos_count = sum(1 for w in pos if w in tl)
        neg_count = sum(1 for w in neg if w in tl)
        return (pos_count - neg_count) / max(pos_count + neg_count + 1, 1)
    
    def _detect_purchase_intent(self, text: str) -> float:
        """Detect purchase intent (0-1)"""
        tl = text.lower()
        high_intent = ["ready to buy", "purchase", "sign up", "subscribe", "order"]
        medium_intent = ["interested", "considering", "evaluating", "quote"]
        low_intent = ["maybe", "exploring", "research"]
        
        if any(w in tl for w in high_intent): return 0.9
        if any(w in tl for w in medium_intent): return 0.6
        if any(w in tl for w in low_intent): return 0.3
        return 0.2
    
    def _classify_segment(self, clv: float, engagement: float) -> str:
        """Classify customer segment"""
        if clv > 15000 and engagement > 0.7: return "vip"
        if clv > 10000: return "premium"
        if clv > 5000: return "standard"
        return "basic"
    
    def _assess_retention_risk(self, email: Dict, engagement: float) -> str:
        """Assess retention risk"""
        body = email.get("body", "").lower()
        if any(w in body for w in ["cancel", "leave", "switch", "competitor"]): return "high"
        if engagement < 0.3: return "medium"
        return "low"
    
    def _recommend_actions(self, segment: str, risk: str) -> List[Dict]:
        """Generate recommended actions"""
        actions = []
        if segment == "vip":
            actions.append({"action": "Dedicated account manager", "priority": "high"})
            actions.append({"action": "Exclusive early access to features", "priority": "medium"})
        if risk == "high":
            actions.append({"action": "Immediate outreach from success team", "priority": "critical"})
            actions.append({"action": "Offer retention incentive", "priority": "high"})
        if segment in ["premium", "vip"]:
            actions.append({"action": "Upsell opportunity identification", "priority": "medium"})
        return actions

if __name__ == "__main__":
    predictor = CustomerLifetimeValuePredictor()
    test = {"body": "We're very interested in upgrading to the premium plan. Can you provide more details?", "to": ["sales@zion.com"], "cc": ["ceo@client.com"]}
    print(json.dumps(predictor.predict_clv(test), indent=2))
