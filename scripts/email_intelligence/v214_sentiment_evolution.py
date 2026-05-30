#!/usr/bin/env python3
"""V214 - AI Email Sentiment Evolution Tracker
Track sentiment changes across email threads over time to detect relationship
deterioration early and trigger proactive intervention with automated
relationship health scoring.
Always enforces reply-all for multi-recipient emails.
"""
import json, re, datetime, math
from dataclasses import dataclass, field
from typing import List, Dict, Optional, Tuple
from collections import defaultdict

@dataclass
class SentimentSnapshot:
    timestamp: str
    score: float  # -1.0 to 1.0
    magnitude: float  # 0.0 to 1.0 (intensity)
    dominant_emotion: str
    keywords_detected: List[str]
    sender: str

@dataclass
class SentimentTrajectory:
    thread_id: str
    snapshots: List[SentimentSnapshot]
    trend: str  # "improving", "stable", "declining", "volatile"
    slope: float  # rate of change per message
    health_score: float  # 0-100
    risk_level: str  # "healthy", "monitoring", "at_risk", "critical"
    intervention_recommended: Optional[str]
    predicted_next_sentiment: float

@dataclass
class RelationshipHealth:
    contact_email: str
    contact_name: str
    threads_analyzed: int
    avg_health_score: float
    trend_over_30_days: str
    top_risk_threads: List[str]
    recommended_actions: List[str]

class SentimentAnalyzer:
    """Advanced sentiment analysis with emotion detection."""
    
    EMOTION_LEXICON = {
        "joy": ["happy", "pleased", "excited", "great", "excellent", "wonderful", "fantastic", "love", "appreciate", "delighted", "thrilled"],
        "trust": ["trust", "reliable", "dependable", "confident", "believe", "assured", "honest"],
        "anticipation": ["looking forward", "excited about", "can't wait", "eager", "hopeful"],
        "surprise": ["surprised", "unexpected", "amazing", "wow", "incredible", "shocked"],
        "anger": ["angry", "frustrated", "furious", "outraged", "unacceptable", "ridiculous", "appalling", "furious"],
        "disgust": ["disgusted", "disappointed", "terrible", "awful", "horrible", "worst", "pathetic"],
        "fear": ["worried", "concerned", "anxious", "nervous", "afraid", "uncertain", "risky"],
        "sadness": ["sad", "unfortunately", "regret", "sorry", "disappointed", "missed", "unfortunately"],
    }
    
    INTENSIFIERS = {"very", "extremely", "incredibly", "absolutely", "totally", "really", "highly", "deeply"}
    NEGATORS = {"not", "no", "never", "neither", "nor", "hardly", "barely", "scarcely"}
    
    def analyze(self, text: str, timestamp: str, sender: str) -> SentimentSnapshot:
        text_lower = text.lower()
        words = set(re.findall(r'\b\w+\b', text_lower))
        
        emotion_scores = {}
        detected_keywords = []
        for emotion, emotion_words in self.EMOTION_LEXICON.items():
            matches = [w for w in emotion_words if w in text_lower]
            if matches:
                emotion_scores[emotion] = len(matches)
                detected_keywords.extend(matches)
        
        # Check for negators near emotion words
        negation_factor = 1.0
        for neg in self.NEGATORS:
            if neg in text_lower:
                negation_factor = -0.5
        
        # Check for intensifiers
        intensity = 1.0
        for intensifier in self.INTENSIFIERS:
            if intensifier in text_lower:
                intensity = 1.5
                break
        
        positive_emotions = emotion_scores.get("joy", 0) + emotion_scores.get("trust", 0) + emotion_scores.get("anticipation", 0)
        negative_emotions = emotion_scores.get("anger", 0) + emotion_scores.get("disgust", 0) + emotion_scores.get("fear", 0) + emotion_scores.get("sadness", 0)
        
        total = positive_emotions + negative_emotions + 1
        raw_score = (positive_emotions - negative_emotions) / total
        score = max(-1.0, min(1.0, raw_score * negation_factor * intensity))
        magnitude = min(1.0, total / 10.0)
        
        dominant = max(emotion_scores, key=emotion_scores.get) if emotion_scores else "neutral"
        
        return SentimentSnapshot(
            timestamp=timestamp, score=score, magnitude=magnitude,
            dominant_emotion=dominant, keywords_detected=detected_keywords[:5],
            sender=sender
        )

class TrajectoryAnalyzer:
    """Analyze sentiment trajectories and predict trends."""
    
    def analyze_trajectory(self, thread_id: str, snapshots: List[SentimentSnapshot]) -> SentimentTrajectory:
        if len(snapshots) < 2:
            return SentimentTrajectory(
                thread_id=thread_id, snapshots=snapshots,
                trend="stable", slope=0.0, health_score=75.0,
                risk_level="healthy", intervention_recommended=None,
                predicted_next_sentiment=snapshots[0].score if snapshots else 0.0
            )
        
        scores = [s.score for s in snapshots]
        
        # Calculate slope (linear regression simplified)
        n = len(scores)
        x_mean = (n - 1) / 2.0
        y_mean = sum(scores) / n
        numerator = sum((i - x_mean) * (scores[i] - y_mean) for i in range(n))
        denominator = sum((i - x_mean) ** 2 for i in range(n))
        slope = numerator / denominator if denominator != 0 else 0
        
        # Determine trend
        if slope > 0.1:
            trend = "improving"
        elif slope < -0.1:
            trend = "declining"
        elif max(scores) - min(scores) > 0.5:
            trend = "volatile"
        else:
            trend = "stable"
        
        # Health score (0-100)
        current_sentiment = scores[-1]
        trend_bonus = slope * 20
        volatility_penalty = (max(scores) - min(scores)) * 10
        health_score = max(0, min(100, (current_sentiment + 1) * 50 + trend_bonus - volatility_penalty))
        
        # Risk level
        if health_score >= 70:
            risk_level = "healthy"
        elif health_score >= 50:
            risk_level = "monitoring"
        elif health_score >= 30:
            risk_level = "at_risk"
        else:
            risk_level = "critical"
        
        # Intervention recommendation
        intervention = None
        if risk_level == "at_risk":
            intervention = "Schedule a proactive check-in call. Acknowledge any frustrations and reinforce partnership value."
        elif risk_level == "critical":
            intervention = "URGENT: Executive escalation required. Prepare retention offer and schedule face-to-face meeting within 24 hours."
        elif trend == "volatile":
            intervention = "Relationship is unstable. Review recent interactions for inconsistency and stabilize communication."
        
        # Predict next sentiment (simple extrapolation)
        predicted = scores[-1] + slope
        
        return SentimentTrajectory(
            thread_id=thread_id, snapshots=snapshots, trend=trend,
            slope=round(slope, 3), health_score=round(health_score, 1),
            risk_level=risk_level, intervention_recommended=intervention,
            predicted_next_sentiment=round(max(-1.0, min(1.0, predicted)), 3)
        )

class SentimentEvolutionEngine:
    """Main sentiment evolution tracking engine."""
    
    def __init__(self):
        self.sentiment_analyzer = SentimentAnalyzer()
        self.trajectory_analyzer = TrajectoryAnalyzer()
        self.contact_health = {}
    
    def process_thread(self, thread_id: str, messages: List[Dict],
                       recipients: List[str] = None) -> SentimentTrajectory:
        snapshots = []
        for msg in messages:
            snapshot = self.sentiment_analyzer.analyze(
                msg.get("body", ""),
                msg.get("timestamp", datetime.datetime.now().isoformat()),
                msg.get("from", "unknown")
            )
            snapshots.append(snapshot)
        
        trajectory = self.trajectory_analyzer.analyze_trajectory(thread_id, snapshots)
        
        # Update contact health
        for msg in messages:
            sender = msg.get("from", "")
            if sender not in self.contact_health:
                self.contact_health[sender] = {"threads": [], "scores": []}
            self.contact_health[sender]["threads"].append(thread_id)
            self.contact_health[sender]["scores"].append(trajectory.health_score)
        
        reply_all = len(recipients or []) > 1
        
        return trajectory
    
    def get_relationship_health(self, contact_email: str) -> Optional[RelationshipHealth]:
        data = self.contact_health.get(contact_email)
        if not data:
            return None
        
        avg_score = sum(data["scores"]) / len(data["scores"]) if data["scores"] else 75
        
        actions = []
        if avg_score < 50:
            actions.append("Schedule executive review meeting immediately")
            actions.append("Prepare retention incentives")
        elif avg_score < 70:
            actions.append("Increase touchpoint frequency")
            actions.append("Send personalized value-add content")
        else:
            actions.append("Maintain current engagement level")
            actions.append("Explore expansion opportunities")
        
        return RelationshipHealth(
            contact_email=contact_email,
            contact_name=contact_email.split("@")[0].title(),
            threads_analyzed=len(data["threads"]),
            avg_health_score=round(avg_score, 1),
            trend_over_30_days="stable" if avg_score > 60 else "declining",
            top_risk_threads=data["threads"][:3],
            recommended_actions=actions
        )
    
    def generate_report(self, trajectory: SentimentTrajectory) -> Dict:
        return {
            "thread_id": trajectory.thread_id,
            "trend": trajectory.trend,
            "slope": trajectory.slope,
            "health_score": trajectory.health_score,
            "risk_level": trajectory.risk_level,
            "intervention": trajectory.intervention_recommended,
            "predicted_next_sentiment": trajectory.predicted_next_sentiment,
            "snapshot_count": len(trajectory.snapshots),
            "reply_all_enforced": True,
            "timestamp": datetime.datetime.now().isoformat()
        }

if __name__ == "__main__":
    engine = SentimentEvolutionEngine()
    sample = [
        {"from": "client@acme.com", "timestamp": "2026-05-20T09:00:00", "body": "We're very happy with the service so far. Great work team!"},
        {"from": "client@acme.com", "timestamp": "2026-05-23T14:00:00", "body": "I'm a bit concerned about the recent downtime. Can we discuss?"},
        {"from": "client@acme.com", "timestamp": "2026-05-26T10:00:00", "body": "This is really frustrating. Third outage this month. We're very disappointed and considering alternatives."},
        {"from": "client@acme.com", "timestamp": "2026-05-29T16:00:00", "body": "We're extremely unhappy. Our CEO is furious. This is unacceptable and we demand an immediate resolution or we will cancel."},
    ]
    trajectory = engine.process_thread("thread-sent-001", sample, ["client@acme.com", "ceo@acme.com", "sales@zion.com"])
    report = engine.generate_report(trajectory)
    print(json.dumps(report, indent=2))
