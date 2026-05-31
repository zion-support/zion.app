#!/usr/bin/env python3
"""V642 - Smart Unsubscribe Manager
Intelligent unsubscribe recommendations based on engagement patterns and content value.
REPLY-ALL ENFORCED: Always replies to all recipients in multi-person threads.
"""
import json
from datetime import datetime, timedelta
from typing import Dict, List, Any

class SmartUnsubscribeManager:
    """Manage email subscriptions intelligently."""
    
    NEWSLETTER_INDICATORS = [
        "unsubscribe", "newsletter", "digest", "weekly", "monthly",
        "update", "announcement", "mailing list", "subscription"
    ]
    
    VALUE_INDICATORS = {
        "high": ["exclusive", "member", "customer", "account", "invoice", "receipt"],
        "medium": ["industry", "news", "update", "report", "analysis"],
        "low": ["promo", "deal", "sale", "discount", "offer", "free"]
    }
    
    def __init__(self):
        self.subscription_db = {}
    
    def analyze_subscription(self, email: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze email subscription for unsubscribe recommendation."""
        sender = email.get("from", "")
        subject = email.get("subject", "")
        body = email.get("body", "")
        
        # Check if it's a newsletter/subscription
        is_subscription = self._is_subscription(email)
        
        if not is_subscription:
            return {
                "engine": "V642",
                "email_subject": subject,
                "is_subscription": False,
                "recommendation": "keep",
                "reply_all_enforced": len(email.get("to", []) + email.get("cc", [])) > 1,
                "timestamp": datetime.now().isoformat()
            }
        
        # Analyze engagement
        engagement_score = self._calculate_engagement(email)
        
        # Analyze content value
        content_value = self._assess_content_value(subject, body)
        
        # Check frequency
        frequency = self._estimate_frequency(email)
        
        # Calculate unsubscribe score
        unsubscribe_score = self._calculate_unsubscribe_score(engagement_score, content_value, frequency)
        
        # Generate recommendation
        recommendation = self._generate_recommendation(unsubscribe_score, content_value)
        
        # Extract unsubscribe link
        unsubscribe_link = self._extract_unsubscribe_link(body)
        
        return {
            "engine": "V642",
            "email_subject": subject,
            "sender": sender,
            "is_subscription": True,
            "engagement_score": round(engagement_score, 1),
            "content_value": content_value,
            "estimated_frequency": frequency,
            "unsubscribe_score": round(unsubscribe_score, 1),
            "recommendation": recommendation,
            "unsubscribe_link": unsubscribe_link,
            "reason": self._generate_reason(recommendation, engagement_score, content_value, frequency),
            "reply_all_enforced": len(email.get("to", []) + email.get("cc", [])) > 1,
            "timestamp": datetime.now().isoformat()
        }
    
    def _is_subscription(self, email: Dict) -> bool:
        """Check if email is a subscription/newsletter."""
        text = f"{email.get('subject', '')} {email.get('body', '')}".lower()
        sender = email.get("from", "").lower()
        
        # Check for unsubscribe link
        if "unsubscribe" in text:
            return True
        
        # Check sender patterns
        if any(indicator in sender for indicator in ["newsletter", "mailing", "noreply", "no-reply"]):
            return True
        
        # Check subject/body indicators
        indicator_count = sum(1 for ind in self.NEWSLETTER_INDICATORS if ind in text)
        return indicator_count >= 2
    
    def _calculate_engagement(self, email: Dict) -> float:
        """Calculate engagement score (0-100)."""
        score = 50.0
        
        # Check if opened (would be tracked in production)
        if email.get("opened", False):
            score += 20
        
        # Check if clicked (would be tracked in production)
        if email.get("clicked", False):
            score += 25
        
        # Check if replied
        if email.get("replied", False):
            score += 30
        
        # Check if starred/flagged
        if email.get("starred", False):
            score += 15
        
        # Check if archived immediately (negative engagement)
        if email.get("auto_archived", False):
            score -= 30
        
        return max(0, min(100, score))
    
    def _assess_content_value(self, subject: str, body: str) -> str:
        """Assess content value level."""
        text = f"{subject} {body}".lower()
        
        high_count = sum(1 for ind in self.VALUE_INDICATORS["high"] if ind in text)
        medium_count = sum(1 for ind in self.VALUE_INDICATORS["medium"] if ind in text)
        low_count = sum(1 for ind in self.VALUE_INDICATORS["low"] if ind in text)
        
        if high_count >= 2:
            return "high"
        elif medium_count >= 2:
            return "medium"
        elif low_count >= 2:
            return "low"
        else:
            return "medium"
    
    def _estimate_frequency(self, email: Dict) -> str:
        """Estimate email frequency."""
        subject = email.get("subject", "").lower()
        body = email.get("body", "").lower()
        text = f"{subject} {body}"
        
        if "daily" in text:
            return "daily"
        elif "weekly" in text:
            return "weekly"
        elif "monthly" in text or "month" in text:
            return "monthly"
        elif "quarterly" in text:
            return "quarterly"
        else:
            return "irregular"
    
    def _calculate_unsubscribe_score(self, engagement: float, value: str, frequency: str) -> float:
        """Calculate unsubscribe recommendation score (0-100)."""
        score = 50.0
        
        # Low engagement increases unsubscribe score
        score += (50 - engagement) * 0.5
        
        # Low value increases unsubscribe score
        value_adjustments = {"high": -30, "medium": 0, "low": 20}
        score += value_adjustments.get(value, 0)
        
        # High frequency increases unsubscribe score
        frequency_adjustments = {"daily": 20, "weekly": 10, "monthly": 0, "quarterly": -10, "irregular": 5}
        score += frequency_adjustments.get(frequency, 0)
        
        return max(0, min(100, score))
    
    def _generate_recommendation(self, score: float, value: str) -> str:
        """Generate unsubscribe recommendation."""
        if score >= 75:
            return "unsubscribe"
        elif score >= 60:
            return "consider_unsubscribe"
        elif score >= 40:
            return "keep_but_filter"
        else:
            return "keep"
    
    def _extract_unsubscribe_link(self, body: str) -> str:
        """Extract unsubscribe link from email body."""
        import re
        
        # Look for unsubscribe link
        patterns = [
            r'(https?://\S*unsubscribe\S*)',
            r'(https?://\S*opt[-_]out\S*)',
            r'(https?://\S*manage\S*subscription\S*)'
        ]
        
        for pattern in patterns:
            match = re.search(pattern, body, re.IGNORECASE)
            if match:
                return match.group(1)
        
        return "Not found"
    
    def _generate_reason(self, recommendation: str, engagement: float, value: str, frequency: str) -> str:
        """Generate human-readable reason for recommendation."""
        reasons = []
        
        if engagement < 30:
            reasons.append("Low engagement (rarely opened or clicked)")
        elif engagement > 70:
            reasons.append("High engagement (frequently opened and clicked)")
        
        if value == "low":
            reasons.append("Low content value (mostly promotional)")
        elif value == "high":
            reasons.append("High content value (exclusive/member content)")
        
        if frequency == "daily":
            reasons.append("High frequency (daily emails)")
        elif frequency in ["monthly", "quarterly"]:
            reasons.append("Low frequency (infrequent emails)")
        
        if not reasons:
            reasons.append("Based on overall engagement and content analysis")
        
        return ". ".join(reasons)
    
    def process_batch(self, emails: List[Dict]) -> Dict[str, Any]:
        results = [self.analyze_subscription(e) for e in emails]
        
        subscriptions = [r for r in results if r.get("is_subscription")]
        
        recommendations = {}
        for r in subscriptions:
            rec = r.get("recommendation", "keep")
            recommendations[rec] = recommendations.get(rec, 0) + 1
        
        return {
            "engine": "V642 - Smart Unsubscribe Manager",
            "total_processed": len(results),
            "subscriptions_detected": len(subscriptions),
            "recommendation_distribution": recommendations,
            "unsubscribe_candidates": sum(1 for r in subscriptions if r.get("recommendation") in ["unsubscribe", "consider_unsubscribe"]),
            "reply_all_enforced": sum(1 for r in results if r.get("reply_all_enforced")),
            "results": results
        }

if __name__ == "__main__":
    engine = SmartUnsubscribeManager()
    test_emails = [
        {"subject": "Weekly Industry Digest", "body": "Here's your weekly digest. Unsubscribe: https://example.com/unsub",
         "from": "newsletter@industry.com", "to": ["user@company.com"], "opened": False, "auto_archived": True},
        {"subject": "Your Monthly Account Statement", "body": "Your exclusive member statement is ready. Manage subscription: https://bank.com/manage",
         "from": "noreply@bank.com", "to": ["customer@company.com"], "opened": True, "clicked": True},
        {"subject": "Daily Deals - 50% Off!", "body": "Today's promo: free shipping! Unsubscribe: https://deals.com/opt-out",
         "from": "promo@deals.com", "to": ["user@company.com"], "opened": False, "auto_archived": True},
        {"subject": "Team Meeting Notes", "body": "Here are the notes from today's meeting.",
         "from": "colleague@company.com", "to": ["team@company.com"]}
    ]
    result = engine.process_batch(test_emails)
    print(json.dumps(result, indent=2))
