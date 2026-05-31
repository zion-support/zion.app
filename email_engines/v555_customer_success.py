#!/usr/bin/env python3
"""V555 - Customer Success Predictor
Predicts customer success likelihood from email patterns and engagement metrics.
CRITICAL: Always enforces reply-all for multi-recipient emails.
"""
import json
from datetime import datetime
from typing import Dict, List

class CustomerSuccessPredictor:
    def __init__(self):
        self.reply_all_enforced = True
    
    def predict_success(self, email: Dict, customer_history: List[Dict] = None) -> Dict:
        """Predict customer success likelihood"""
        prediction = {
            "engine": "V555_Customer_Success_Predictor",
            "timestamp": datetime.now().isoformat(),
            "success_score": self._calculate_success_score(email, customer_history),
            "engagement_indicators": self._analyze_engagement(email),
            "success_factors": self._identify_success_factors(email),
            "risk_factors": self._identify_risk_factors(email),
            "success_probability": 0.0,
            "recommended_actions": [],
            "reply_all_enforced": self.reply_all_enforced,
            "all_recipients": email.get("to", []) + email.get("cc", [])
        }
        
        prediction["success_probability"] = self._calculate_probability(prediction["success_score"])
        prediction["recommended_actions"] = self._generate_success_actions(prediction)
        
        return prediction
    
    def _calculate_success_score(self, email: Dict, history: List[Dict] = None) -> float:
        """Calculate overall success score (0-100)"""
        score = 50.0  # Base score
        
        # Positive indicators
        engagement = self._analyze_engagement(email)
        if engagement["response_quality"] == "high":
            score += 15
        if engagement["proactive_communication"]:
            score += 10
        if engagement["detailed_questions"]:
            score += 10
        
        # Success factors
        factors = self._identify_success_factors(email)
        score += len(factors) * 5
        
        # Risk factors (subtract)
        risks = self._identify_risk_factors(email)
        score -= len(risks) * 8
        
        # Historical data
        if history:
            if self._has_positive_history(history):
                score += 10
            if self._has_usage_growth(history):
                score += 10
        
        return max(0, min(100, score))
    
    def _analyze_engagement(self, email: Dict) -> Dict:
        """Analyze customer engagement patterns"""
        body = email.get("body", "")
        
        engagement = {
            "response_quality": "medium",
            "proactive_communication": False,
            "detailed_questions": False,
            "feature_exploration": False,
            "collaboration_signals": False
        }
        
        # Response quality
        if len(body) > 300:
            engagement["response_quality"] = "high"
        elif len(body) < 50:
            engagement["response_quality"] = "low"
        
        # Proactive communication
        proactive_phrases = ["i was thinking", "what if we", "could we also", "i have an idea"]
        if any(phrase in body.lower() for phrase in proactive_phrases):
            engagement["proactive_communication"] = True
        
        # Detailed questions
        if body.count('?') > 2:
            engagement["detailed_questions"] = True
        
        # Feature exploration
        if any(word in body.lower() for word in ["feature", "capability", "how does", "can it"]):
            engagement["feature_exploration"] = True
        
        # Collaboration signals
        if email.get("cc") or "team" in body.lower():
            engagement["collaboration_signals"] = True
        
        return engagement
    
    def _identify_success_factors(self, email: Dict) -> List[Dict]:
        """Identify factors that contribute to success"""
        factors = []
        body = email.get("body", "").lower()
        
        # Strategic alignment
        if any(word in body for word in ["strategy", "goals", "objectives", "roadmap"]):
            factors.append({
                "factor": "Strategic Alignment",
                "impact": "high",
                "description": "Customer thinking strategically about implementation"
            })
        
        # Executive involvement
        recipients = email.get("to", []) + email.get("cc", [])
        if any(any(role in r.lower() for role in ["ceo", "cto", "director", "vp"]) for r in recipients):
            factors.append({
                "factor": "Executive Sponsorship",
                "impact": "high",
                "description": "Executive-level engagement and support"
            })
        
        # Technical depth
        if any(word in body for word in ["api", "integration", "technical", "architecture"]):
            factors.append({
                "factor": "Technical Engagement",
                "impact": "medium",
                "description": "Deep technical evaluation and planning"
            })
        
        # Timeline commitment
        if any(word in body for word in ["timeline", "deadline", "launch date", "go-live"]):
            factors.append({
                "factor": "Timeline Commitment",
                "impact": "high",
                "description": "Clear timeline and commitment to implementation"
            })
        
        # Budget discussion
        if any(word in body for word in ["budget", "investment", "cost", "pricing"]):
            factors.append({
                "factor": "Budget Alignment",
                "impact": "medium",
                "description": "Active budget discussion and planning"
            })
        
        return factors
    
    def _identify_risk_factors(self, email: Dict) -> List[Dict]:
        """Identify risk factors that could impact success"""
        risks = []
        body = email.get("body", "").lower()
        
        # Low engagement
        if len(body) < 50:
            risks.append({
                "factor": "Low Engagement",
                "impact": "high",
                "description": "Minimal engagement in communications"
            })
        
        # Unclear requirements
        if any(word in body for word in ["not sure", "maybe", "possibly", "we'll see"]):
            risks.append({
                "factor": "Unclear Requirements",
                "impact": "medium",
                "description": "Unclear or undefined requirements"
            })
        
        # Competitor consideration
        if any(word in body for word in ["competitor", "alternative", "other option", "comparing"]):
            risks.append({
                "factor": "Competitor Consideration",
                "impact": "medium",
                "description": "Actively considering competitors"
            })
        
        # Budget concerns
        if any(word in body for word in ["expensive", "too much", "can't afford", "budget constraints"]):
            risks.append({
                "factor": "Budget Concerns",
                "impact": "high",
                "description": "Expressed concerns about cost"
            })
        
        # Timeline delays
        if any(word in body for word in ["delayed", "postponed", "on hold", "not ready"]):
            risks.append({
                "factor": "Timeline Delays",
                "impact": "high",
                "description": "Implementation timeline delays or uncertainty"
            })
        
        return risks
    
    def _calculate_probability(self, score: float) -> float:
        """Calculate success probability from score"""
        # Sigmoid-like transformation
        return round(1 / (1 + (2.718 ** (-(score - 50) / 10))), 3)
    
    def _has_positive_history(self, history: List[Dict]) -> bool:
        """Check if customer has positive history"""
        if not history:
            return False
        
        # Simple heuristic: positive if recent interactions are positive
        recent = history[-5:]
        positive_count = sum(1 for h in recent if self._is_positive_interaction(h))
        return positive_count >= 3
    
    def _has_usage_growth(self, history: List[Dict]) -> bool:
        """Check if there's usage growth"""
        if not history or len(history) < 2:
            return False
        
        # Simple check: increasing engagement over time
        early_engagement = sum(1 for h in history[:len(history)//2] if self._is_engaged(h))
        late_engagement = sum(1 for h in history[len(history)//2:] if self._is_engaged(h))
        
        return late_engagement > early_engagement
    
    def _is_positive_interaction(self, interaction: Dict) -> bool:
        """Check if interaction is positive"""
        body = interaction.get("body", "").lower()
        positive_words = ["great", "excellent", "thank", "appreciate", "happy", "satisfied"]
        return any(word in body for word in positive_words)
    
    def _is_engaged(self, interaction: Dict) -> bool:
        """Check if interaction shows engagement"""
        body = interaction.get("body", "")
        return len(body) > 100 or "?" in body
    
    def _generate_success_actions(self, prediction: Dict) -> List[Dict]:
        """Generate recommended actions for customer success"""
        actions = []
        
        if prediction["success_score"] >= 75:
            actions.append({
                "type": "accelerate",
                "action": "Accelerate implementation - high success probability",
                "priority": "high",
                "owner": "Customer Success Manager"
            })
            actions.append({
                "type": "expand",
                "action": "Identify expansion opportunities",
                "priority": "medium",
                "owner": "Account Executive"
            })
        elif prediction["success_score"] >= 50:
            actions.append({
                "type": "support",
                "action": "Provide additional support and resources",
                "priority": "medium",
                "owner": "Customer Success Manager"
            })
        else:
            actions.append({
                "type": "intervene",
                "action": "Immediate intervention - low success probability",
                "priority": "critical",
                "owner": "Customer Success Manager"
            })
            actions.append({
                "type": "executive_engagement",
                "action": "Engage executive sponsor to address concerns",
                "priority": "high",
                "owner": "Account Executive"
            })
        
        # Address specific risk factors
        for risk in prediction["risk_factors"]:
            if risk["impact"] == "high":
                actions.append({
                    "type": "mitigate_risk",
                    "action": f"Address {risk['factor']}: {risk['description']}",
                    "priority": "high",
                    "owner": "Customer Success Manager"
                })
        
        return actions

if __name__ == "__main__":
    engine = CustomerSuccessPredictor()
    test = {
        "body": "We're excited about implementing your solution. Our CEO will join the call to discuss the roadmap and timeline.",
        "to": ["success@zion.com"],
        "cc": ["ceo@client.com", "cto@client.com"]
    }
    result = engine.predict_success(test)
    print(json.dumps(result, indent=2))
