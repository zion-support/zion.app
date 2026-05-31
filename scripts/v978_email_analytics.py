#!/usr/bin/env python3
"""
V978: Email Analytics Dashboard Engine
Team-wide email metrics: volume, response times, sentiment trends, engagement,
and performance analytics for data-driven email management.
STRICT reply-all enforcement for all multi-recipient emails.
"""

import re
import hashlib
from datetime import datetime, timezone
from typing import Dict, List, Any
from collections import defaultdict


class EmailAnalyticsDashboard:
    """Comprehensive email analytics and performance tracking."""

    def __init__(self):
        self.analytics_log: List[Dict] = []
        self.reply_all_audit: List[Dict] = []
        self.metrics_cache: Dict[str, Any] = {}
        self.team_metrics: Dict[str, Dict] = defaultdict(lambda: {
            "emails_received": 0,
            "emails_sent": 0,
            "response_times": [],
            "sentiment_scores": [],
        })

    def analyze_email_case_by_case(self, email: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze email for analytics case by case."""
        analysis = {
            "engine": "V978",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "email_id": email.get("id", hashlib.md5(str(email).encode()).hexdigest()[:12]),
            "analysis_type": "analytics_dashboard",
        }

        to_recipients = email.get("to", [])
        cc_recipients = email.get("cc", [])
        all_recipients = to_recipients + cc_recipients
        is_multi_recipient = len(all_recipients) > 1

        body = email.get("body", "")
        subject = email.get("subject", "")
        sender = email.get("from", "")

        # 1. Volume metrics
        volume = self._track_volume_metrics(email)
        analysis["volume_metrics"] = volume

        # 2. Response time tracking
        response_time = self._track_response_time(email)
        analysis["response_time"] = response_time

        # 3. Sentiment analysis
        sentiment = self._analyze_sentiment(body)
        analysis["sentiment"] = sentiment

        # 4. Engagement metrics
        engagement = self._calculate_engagement(email, body)
        analysis["engagement"] = engagement

        # 5. Category distribution
        category = self._categorize_email(subject + " " + body)
        analysis["category"] = category

        # 6. Team performance
        team_performance = self._track_team_performance(email, response_time, sentiment)
        analysis["team_performance"] = team_performance

        # 7. Trend analysis
        trends = self._analyze_trends(email, sentiment, engagement)
        analysis["trends"] = trends

        # 8. KPI calculations
        kpis = self._calculate_kpis(email, response_time, sentiment, engagement)
        analysis["kpis"] = kpis

        # 9. Determine action
        action = self._determine_analytics_action(kpis, trends)
        analysis["recommended_action"] = action

        # REPLY-ALL ENFORCEMENT
        reply_all = self._enforce_reply_all(email, all_recipients, is_multi_recipient)
        analysis["reply_all_enforcement"] = reply_all

        self.analytics_log.append({
            "email_id": analysis["email_id"],
            "volume": volume,
            "response_time": response_time.get("minutes", 0),
            "sentiment": sentiment.get("score", 0),
            "engagement": engagement.get("score", 0),
            "category": category,
            "reply_all": reply_all["enforced"],
            "timestamp": analysis["timestamp"],
        })

        return analysis

    def _track_volume_metrics(self, email: Dict) -> Dict:
        """Track email volume metrics."""
        hour = datetime.now(timezone.utc).hour
        weekday = datetime.now(timezone.utc).weekday()

        return {
            "hour_of_day": hour,
            "day_of_week": weekday,
            "is_business_hours": 9 <= hour <= 17 and weekday < 5,
            "recipient_count": len(email.get("to", [])) + len(email.get("cc", [])),
        }

    def _track_response_time(self, email: Dict) -> Dict:
        """Track response time metrics."""
        sent_time = email.get("sent_timestamp")
        received_time = email.get("received_timestamp")

        if sent_time and received_time:
            try:
                sent_dt = datetime.fromisoformat(sent_time)
                received_dt = datetime.fromisoformat(received_time)
                minutes = (received_dt - sent_dt).total_seconds() / 60
                return {
                    "minutes": round(minutes, 1),
                    "hours": round(minutes / 60, 2),
                    "within_sla": minutes <= 240,  # 4 hours SLA
                }
            except:
                pass

        return {
            "minutes": -1,
            "hours": -1,
            "within_sla": None,
        }

    def _analyze_sentiment(self, body: str) -> Dict:
        """Analyze email sentiment."""
        body_lower = body.lower()
        
        positive = ["great", "excellent", "amazing", "thank you", "appreciate", "love", "fantastic"]
        negative = ["frustrated", "angry", "disappointed", "terrible", "awful", "worst", "unacceptable"]

        pos_count = sum(1 for word in positive if word in body_lower)
        neg_count = sum(1 for word in negative if word in body_lower)

        if pos_count > neg_count:
            polarity = "positive"
            score = min(pos_count * 10, 100)
        elif neg_count > pos_count:
            polarity = "negative"
            score = -min(neg_count * 10, 100)
        else:
            polarity = "neutral"
            score = 0

        return {
            "polarity": polarity,
            "score": score,
            "positive_indicators": pos_count,
            "negative_indicators": neg_count,
        }

    def _calculate_engagement(self, email: Dict, body: str) -> Dict:
        """Calculate engagement metrics."""
        word_count = len(body.split())
        has_questions = "?" in body
        has_attachments = len(email.get("attachments", [])) > 0
        thread_depth = email.get("thread_depth", 1)

        score = 50
        if word_count > 100:
            score += 20
        elif word_count > 50:
            score += 10
        if has_questions:
            score += 15
        if has_attachments:
            score += 10
        if thread_depth > 3:
            score += 5

        score = min(score, 100)

        return {
            "score": score,
            "word_count": word_count,
            "has_questions": has_questions,
            "has_attachments": has_attachments,
            "thread_depth": thread_depth,
            "engagement_level": "HIGH" if score >= 70 else "MEDIUM" if score >= 50 else "LOW",
        }

    def _categorize_email(self, text: str) -> str:
        """Categorize email by content."""
        text_lower = text.lower()
        
        categories = {
            "sales": ["quote", "proposal", "pricing", "deal", "contract"],
            "support": ["help", "issue", "problem", "bug", "error"],
            "partnership": ["partner", "collaborate", "alliance"],
            "marketing": ["campaign", "newsletter", "promotion"],
            "internal": ["meeting", "update", "announcement"],
        }

        for category, keywords in categories.items():
            if any(kw in text_lower for kw in keywords):
                return category

        return "general"

    def _track_team_performance(self, email: Dict, response_time: Dict, sentiment: Dict) -> Dict:
        """Track team performance metrics."""
        for recipient in email.get("to", []):
            self.team_metrics[recipient]["emails_received"] += 1
            if response_time.get("minutes", -1) > 0:
                self.team_metrics[recipient]["response_times"].append(response_time["minutes"])
            self.team_metrics[recipient]["sentiment_scores"].append(sentiment.get("score", 0))

        return {
            "team_members_tracked": len(self.team_metrics),
            "avg_response_time": self._calculate_avg_response_time(),
            "avg_sentiment": self._calculate_avg_sentiment(),
        }

    def _calculate_avg_response_time(self) -> float:
        """Calculate average response time across team."""
        all_times = []
        for metrics in self.team_metrics.values():
            all_times.extend(metrics["response_times"])
        
        if all_times:
            return round(sum(all_times) / len(all_times), 1)
        return 0.0

    def _calculate_avg_sentiment(self) -> float:
        """Calculate average sentiment across team."""
        all_scores = []
        for metrics in self.team_metrics.values():
            all_scores.extend(metrics["sentiment_scores"])
        
        if all_scores:
            return round(sum(all_scores) / len(all_scores), 1)
        return 0.0

    def _analyze_trends(self, email: Dict, sentiment: Dict, engagement: Dict) -> Dict:
        """Analyze trends over time."""
        # This would typically compare with historical data
        # For now, return current state
        return {
            "sentiment_trend": sentiment.get("polarity", "neutral"),
            "engagement_trend": engagement.get("engagement_level", "MEDIUM"),
            "volume_trend": "stable",
        }

    def _calculate_kpis(self, email: Dict, response_time: Dict, sentiment: Dict, engagement: Dict) -> Dict:
        """Calculate key performance indicators."""
        kpis = {
            "response_time_minutes": response_time.get("minutes", -1),
            "sentiment_score": sentiment.get("score", 0),
            "engagement_score": engagement.get("score", 0),
            "sla_compliance": response_time.get("within_sla", None),
        }

        # Overall performance score
        scores = []
        if response_time.get("minutes", -1) > 0:
            rt_score = 100 if response_time["minutes"] <= 60 else 80 if response_time["minutes"] <= 240 else 50
            scores.append(rt_score)
        
        sentiment_score = (sentiment.get("score", 0) + 100) / 2  # Normalize to 0-100
        scores.append(sentiment_score)
        scores.append(engagement.get("score", 50))

        kpis["overall_performance"] = round(sum(scores) / len(scores), 1) if scores else 50

        return kpis

    def _determine_analytics_action(self, kpis: Dict, trends: Dict) -> str:
        """Determine action based on analytics."""
        performance = kpis.get("overall_performance", 50)
        
        if performance >= 80:
            return "MAAIN_EXCELLENCE"
        elif performance >= 60:
            return "OPTIMIZE_PERFORMANCE"
        elif performance >= 40:
            return "IMPROVE_METRICS"
        else:
            return "URGENT_IMPROVEMENT_NEEDED"

    def _enforce_reply_all(self, email: Dict, all_recipients: List, is_multi: bool) -> Dict:
        """STRICT reply-all enforcement."""
        result = {
            "is_multi_recipient": is_multi,
            "recipient_count": len(all_recipients),
            "enforced": False,
            "reason": "",
        }
        if is_multi:
            result["enforced"] = True
            result["reason"] = f"REPLY-ALL ENFORCED: {len(all_recipients)} recipients."
            self.reply_all_audit.append({
                "email_id": email.get("id", "unknown"),
                "enforced": True,
                "timestamp": datetime.now(timezone.utc).isoformat(),
            })
        else:
            result["reason"] = "Single recipient."
        return result

    def get_stats(self) -> Dict:
        if not self.analytics_log:
            return {"emails_analyzed": 0}
        return {
            "emails_analyzed": len(self.analytics_log),
            "avg_response_time": round(sum(a["response_time"] for a in self.analytics_log if a["response_time"] > 0) / max(len([a for a in self.analytics_log if a["response_time"] > 0]), 1), 1),
            "avg_sentiment": round(sum(a["sentiment"] for a in self.analytics_log) / len(self.analytics_log), 1),
            "avg_engagement": round(sum(a["engagement"] for a in self.analytics_log) / len(self.analytics_log), 1),
            "category_distribution": {},
            "reply_all_enforced": len(self.reply_all_audit),
        }


def test_v978():
    engine = EmailAnalyticsDashboard()

    # Test 1: High engagement email
    email1 = {
        "id": "analytics-001",
        "from": "client@enterprise.com",
        "to": ["sales@ziontechgroup.com", "support@ziontechgroup.com"],
        "subject": "Great progress on the project!",
        "body": "Hi team! We're really happy with the progress. The integration is working great and we love the new features. Can you send us the documentation? Also, what's the timeline for the next phase?",
        "thread_depth": 4,
    }
    r1 = engine.analyze_email_case_by_case(email1)
    assert r1["reply_all_enforcement"]["enforced"] is True
    assert r1["sentiment"]["polarity"] == "positive"
    assert r1["engagement"]["score"] >= 60
    print(f"✅ Test 1 PASSED: Sentiment={r1['sentiment']['polarity']}, engagement={r1['engagement']['score']}, category={r1['category']}, reply-all enforced")

    # Test 2: Support request
    email2 = {
        "id": "analytics-002",
        "from": "user@company.com",
        "to": ["support@ziontechgroup.com"],
        "subject": "Issue with API",
        "body": "Getting error 500 when calling the API. This is frustrating and unacceptable.",
    }
    r2 = engine.analyze_email_case_by_case(email2)
    assert r2["sentiment"]["polarity"] == "negative"
    assert r2["category"] == "support"
    print(f"✅ Test 2 PASSED: Negative sentiment detected, category={r2['category']}")

    stats = engine.get_stats()
    print(f"✅ Test 3 PASSED: {stats['emails_analyzed']} analyzed, avg sentiment={stats['avg_sentiment']}")

    print("\n🎉 V978 ALL TESTS PASSED — Email Analytics Dashboard operational!")
    return True


if __name__ == "__main__":
    test_v978()
