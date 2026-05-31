#!/usr/bin/env python3
"""V611 - Email Sentiment Responder
Auto-generate empathetic responses based on sender emotion and tone.
REPLY-ALL ENFORCED: Always replies to all recipients in multi-person threads.
"""
import json, re
from datetime import datetime
from typing import Dict, List, Any

class SentimentResponder:
    """Generate empathetic responses based on email sentiment."""
    
    SENTIMENT_MAP = {
        "positive": ["enthusiastic", "grateful", "excited", "happy", "satisfied"],
        "negative": ["frustrated", "angry", "disappointed", "concerned", "worried"],
        "neutral": ["informative", "professional", "standard", "factual"],
        "urgent": ["emergency", "critical", "urgent", "asap", "immediately"]
    }
    
    RESPONSE_TEMPLATES = {
        "positive": [
            "Thank you for your wonderful message! I'm thrilled to hear {context}.",
            "Your enthusiasm is contagious! I appreciate you sharing {context}.",
            "That's fantastic news! I'm excited about {context}."
        ],
        "negative": [
            "I understand your concerns about {context}, and I want to help resolve this.",
            "I apologize for the frustration regarding {context}. Let me address this immediately.",
            "Thank you for bringing {context} to my attention. I take this seriously."
        ],
        "neutral": [
            "Thank you for the update on {context}.",
            "I've received your message regarding {context}.",
            "Noted. I'll review {context} and get back to you."
        ],
        "urgent": [
            "I understand the urgency of {context} and am prioritizing this immediately.",
            "This is critical. I'm taking immediate action on {context}.",
            "Acknowledged. I'm addressing {context} right now."
        ]
    }
    
    def __init__(self):
        self.responses = []
    
    def analyze_and_respond(self, email: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze email sentiment and generate empathetic response."""
        body = email.get("body", "")
        subject = email.get("subject", "")
        
        sentiment = self._detect_sentiment(body + " " + subject)
        emotion = self._detect_emotion(body)
        context = self._extract_context(body)
        
        response_text = self._generate_response(sentiment, emotion, context)
        
        tone_adjustments = self._suggest_tone_adjustments(sentiment, emotion)
        follow_up_actions = self._suggest_follow_ups(sentiment, emotion)
        
        return {
            "engine": "V611",
            "detected_sentiment": sentiment,
            "detected_emotion": emotion,
            "extracted_context": context,
            "generated_response": response_text,
            "tone_adjustments": tone_adjustments,
            "follow_up_actions": follow_up_actions,
            "empathy_score": self._calculate_empathy_score(sentiment, emotion),
            "reply_all_enforced": len(email.get("to", []) + email.get("cc", [])) > 1,
            "timestamp": datetime.now().isoformat()
        }
    
    def _detect_sentiment(self, text: str) -> str:
        """Detect overall sentiment."""
        text_lower = text.lower()
        if any(w in text_lower for w in ["urgent", "emergency", "critical", "asap"]):
            return "urgent"
        if any(w in text_lower for w in ["thank", "great", "excellent", "amazing", "love"]):
            return "positive"
        if any(w in text_lower for w in ["frustrated", "angry", "disappointed", "problem", "issue"]):
            return "negative"
        return "neutral"
    
    def _detect_emotion(self, text: str) -> str:
        """Detect specific emotion."""
        emotion_keywords = {
            "grateful": ["thank", "appreciate", "grateful"],
            "excited": ["excited", "thrilled", "amazing", "can't wait"],
            "frustrated": ["frustrated", "annoyed", "tired of"],
            "worried": ["worried", "concerned", "anxious"],
            "confused": ["confused", "unclear", "don't understand"]
        }
        text_lower = text.lower()
        for emotion, keywords in emotion_keywords.items():
            if any(kw in text_lower for kw in keywords):
                return emotion
        return "neutral"
    
    def _extract_context(self, text: str) -> str:
        """Extract key context from email."""
        sentences = text.split('.')
        for sentence in sentences:
            if len(sentence.strip()) > 20:
                return sentence.strip()[:100]
        return "the matter at hand"
    
    def _generate_response(self, sentiment: str, emotion: str, context: str) -> str:
        """Generate empathetic response."""
        templates = self.RESPONSE_TEMPLATES.get(sentiment, self.RESPONSE_TEMPLATES["neutral"])
        template = templates[0]
        return template.format(context=context)
    
    def _suggest_tone_adjustments(self, sentiment: str, emotion: str) -> List[str]:
        """Suggest tone adjustments based on sentiment."""
        adjustments = []
        if sentiment == "negative":
            adjustments.append("Use empathetic language")
            adjustments.append("Acknowledge their feelings")
            adjustments.append("Offer concrete solutions")
        elif sentiment == "urgent":
            adjustments.append("Be direct and action-oriented")
            adjustments.append("Provide clear timelines")
        elif sentiment == "positive":
            adjustments.append("Match their enthusiasm")
            adjustments.append("Express gratitude")
        return adjustments
    
    def _suggest_follow_ups(self, sentiment: str, emotion: str) -> List[str]:
        """Suggest follow-up actions."""
        follow_ups = []
        if sentiment == "negative":
            follow_ups.append("Schedule follow-up call")
            follow_ups.append("Send resolution confirmation")
        elif sentiment == "urgent":
            follow_ups.append("Provide status update within 2 hours")
            follow_ups.append("Escalate if not resolved in 24h")
        elif sentiment == "positive":
            follow_ups.append("Send thank you note")
            follow_ups.append("Request testimonial")
        return follow_ups
    
    def _calculate_empathy_score(self, sentiment: str, emotion: str) -> float:
        """Calculate empathy score (0-100)."""
        base_score = 70
        if sentiment == "negative":
            base_score += 20
        if emotion in ["frustrated", "worried"]:
            base_score += 10
        return min(100, base_score)
    
    def process_batch(self, emails: List[Dict]) -> Dict[str, Any]:
        results = [self.analyze_and_respond(e) for e in emails]
        return {
            "engine": "V611 - Sentiment Responder",
            "total_processed": len(results),
            "reply_all_enforced": sum(1 for r in results if r["reply_all_enforced"]),
            "results": results
        }

if __name__ == "__main__":
    engine = SentimentResponder()
    test_emails = [
        {"subject": "Thank you for your help!", "body": "I really appreciate your assistance with the project. It was amazing!", "to": ["support@company.com", "manager@company.com"]},
        {"subject": "URGENT: System down", "body": "The system is down and we need immediate help. This is critical!", "to": ["support@company.com"]},
        {"subject": "Issue with service", "body": "I'm frustrated with the recurring problems. This needs to be fixed.", "to": ["support@company.com", "team@company.com"]}
    ]
    result = engine.process_batch(test_emails)
    print(json.dumps(result, indent=2))
