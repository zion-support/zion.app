#!/usr/bin/env python3
"""V626 - Email Sentiment Evolution Tracker
Track sentiment changes across conversation history and detect relationship deterioration.
REPLY-ALL ENFORCED: Always replies to all recipients in multi-person threads.
"""
import json
from datetime import datetime, timedelta
from typing import Dict, List, Any

class SentimentEvolutionTracker:
    """Track sentiment evolution over time."""
    
    def __init__(self):
        self.sentiment_history = {}
        self.relationship_scores = {}
    
    def track_sentiment(self, email: Dict[str, Any]) -> Dict[str, Any]:
        """Track sentiment for a contact over time."""
        sender = email.get("from", "unknown")
        sentiment = self._analyze_sentiment(email)
        timestamp = email.get("sent_at", datetime.now().isoformat())
        
        # Initialize tracking
        if sender not in self.sentiment_history:
            self.sentiment_history[sender] = []
        
        # Add sentiment entry
        entry = {
            "timestamp": timestamp,
            "sentiment": sentiment,
            "subject": email.get("subject", ""),
            "confidence": self._calculate_confidence(email)
        }
        self.sentiment_history[sender].append(entry)
        
        # Calculate trend
        trend = self._calculate_trend(sender)
        relationship_health = self._assess_relationship_health(sender)
        intervention_needed = self._check_intervention(trend, relationship_health)
        
        return {
            "engine": "V626",
            "contact": sender,
            "current_sentiment": sentiment,
            "sentiment_trend": trend,
            "relationship_health": relationship_health,
            "intervention_needed": intervention_needed,
            "total_interactions": len(self.sentiment_history[sender]),
            "suggested_actions": self._generate_actions(trend, relationship_health),
            "reply_all_enforced": len(email.get("to", []) + email.get("cc", [])) > 1,
            "timestamp": datetime.now().isoformat()
        }
    
    def _analyze_sentiment(self, email: Dict) -> str:
        """Analyze email sentiment."""
        text = f"{email.get('subject', '')} {email.get('body', '')}".lower()
        
        positive_words = ["great", "excellent", "happy", "thanks", "love", "appreciate", "wonderful"]
        negative_words = ["frustrated", "angry", "disappointed", "problem", "issue", "concern", "worried"]
        urgent_words = ["urgent", "asap", "critical", "emergency"]
        
        positive_count = sum(1 for word in positive_words if word in text)
        negative_count = sum(1 for word in negative_words if word in text)
        urgent_count = sum(1 for word in urgent_words if word in text)
        
        if urgent_count > 0:
            return "urgent"
        elif positive_count > negative_count:
            return "positive"
        elif negative_count > positive_count:
            return "negative"
        return "neutral"
    
    def _calculate_confidence(self, email: Dict) -> float:
        """Calculate sentiment analysis confidence."""
        body_length = len(email.get("body", ""))
        if body_length > 500:
            return 95.0
        elif body_length > 200:
            return 85.0
        return 70.0
    
    def _calculate_trend(self, sender: str) -> Dict[str, Any]:
        """Calculate sentiment trend."""
        history = self.sentiment_history[sender]
        
        if len(history) < 2:
            return {"direction": "insufficient_data", "change": 0}
        
        # Get last 5 interactions
        recent = history[-5:] if len(history) >= 5 else history
        
        # Calculate sentiment scores
        sentiment_scores = {"positive": 1, "neutral": 0, "negative": -1, "urgent": -0.5}
        scores = [sentiment_scores.get(entry["sentiment"], 0) for entry in recent]
        
        if len(scores) >= 2:
            change = scores[-1] - scores[0]
            if change > 0.5:
                direction = "improving"
            elif change < -0.5:
                direction = "deteriorating"
            else:
                direction = "stable"
            
            return {
                "direction": direction,
                "change": round(change, 2),
                "recent_interactions": len(recent)
            }
        
        return {"direction": "insufficient_data", "change": 0}
    
    def _assess_relationship_health(self, sender: str) -> Dict[str, Any]:
        """Assess overall relationship health."""
        history = self.sentiment_history[sender]
        
        if not history:
            return {"score": 50, "status": "unknown"}
        
        sentiment_scores = {"positive": 100, "neutral": 70, "negative": 30, "urgent": 50}
        scores = [sentiment_scores.get(entry["sentiment"], 50) for entry in history]
        
        avg_score = sum(scores) / len(scores)
        
        if avg_score >= 80:
            status = "excellent"
        elif avg_score >= 60:
            status = "good"
        elif avg_score >= 40:
            status = "fair"
        else:
            status = "poor"
        
        return {
            "score": round(avg_score, 1),
            "status": status,
            "total_interactions": len(history)
        }
    
    def _check_intervention(self, trend: Dict, health: Dict) -> bool:
        """Check if intervention is needed."""
        if trend["direction"] == "deteriorating":
            return True
        if health["score"] < 40:
            return True
        return False
    
    def _generate_actions(self, trend: Dict, health: Dict) -> List[str]:
        """Generate suggested actions."""
        actions = []
        
        if trend["direction"] == "deteriorating":
            actions.append("Schedule a check-in call to address concerns")
            actions.append("Review recent interactions for issues")
        
        if health["score"] < 50:
            actions.append("Send appreciation message")
            actions.append("Offer additional support or resources")
        
        if trend["direction"] == "improving":
            actions.append("Acknowledge positive progress")
            actions.append("Explore expansion opportunities")
        
        if not actions:
            actions.append("Maintain current communication patterns")
        
        return actions[:3]
    
    def process_batch(self, emails: List[Dict]) -> Dict[str, Any]:
        results = [self.track_sentiment(e) for e in emails]
        
        unique_contacts = len(set(r["contact"] for r in results))
        interventions_needed = sum(1 for r in results if r["intervention_needed"])
        
        return {
            "engine": "V626 - Sentiment Evolution Tracker",
            "total_tracked": len(results),
            "unique_contacts": unique_contacts,
            "interventions_needed": interventions_needed,
            "reply_all_enforced": sum(1 for r in results if r["reply_all_enforced"]),
            "results": results
        }

if __name__ == "__main__":
    engine = SentimentEvolutionTracker()
    test_emails = [
        {"from": "alice@company.com", "subject": "Great progress!", "body": "I love the work you've done. Excellent results!",
         "to": ["team@company.com"], "sent_at": "2026-01-10T10:00:00"},
        {"from": "alice@company.com", "subject": "Issue with delivery", "body": "I'm frustrated with the delays. This is concerning.",
         "to": ["team@company.com", "manager@company.com"], "sent_at": "2026-01-15T14:00:00"}
    ]
    result = engine.process_batch(test_emails)
    print(json.dumps(result, indent=2))
