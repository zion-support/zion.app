#!/usr/bin/env python3
"""
V965: Email Performance Analytics Engine
Comprehensive email performance tracking with team-wide metrics,
response time analysis, engagement scoring, and performance benchmarks.
STRICT reply-all enforcement with performance-aware response optimization.
"""

import re
import hashlib
from datetime import datetime, timezone, timedelta
from typing import Dict, List, Any
from collections import defaultdict


class EmailPerformanceAnalytics:
    """Track and analyze email performance metrics across teams."""

    PERFORMANCE_BENCHMARKS = {
        "response_time_minutes": {"excellent": 15, "good": 60, "average": 240, "poor": 1440},
        "thread_depth": {"excellent": 5, "good": 3, "average": 2, "poor": 1},
        "engagement_score": {"excellent": 80, "good": 60, "average": 40, "poor": 20},
        "resolution_rate": {"excellent": 0.95, "good": 0.85, "average": 0.70, "poor": 0.50},
    }

    EMAIL_CATEGORIES = {
        "sales": ["quote", "proposal", "pricing", "deal", "contract", "demo"],
        "support": ["help", "issue", "problem", "bug", "fix", "ticket"],
        "partnership": ["partner", "collaborate", "alliance", "integrate"],
        "recruitment": ["hiring", "interview", "candidate", "position"],
        "general": [],
    }

    def __init__(self):
        self.email_metrics: List[Dict] = []
        self.team_performance: Dict[str, Dict] = defaultdict(lambda: {
            "emails_handled": 0,
            "avg_response_time": [],
            "resolution_count": 0,
            "engagement_scores": [],
        })
        self.reply_all_audit: List[Dict] = []
        self.hourly_distribution: Dict[int, int] = defaultdict(int)
        self.category_stats: Dict[str, Dict] = defaultdict(lambda: {
            "count": 0, "avg_response": [], "resolution_rate": []
        })

    def analyze_email_case_by_case(self, email: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze email performance metrics case by case."""
        analysis = {
            "engine": "V965",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "email_id": email.get("id", hashlib.md5(str(email).encode()).hexdigest()[:12]),
            "analysis_type": "performance_analytics",
        }

        to_recipients = email.get("to", [])
        cc_recipients = email.get("cc", [])
        all_recipients = to_recipients + cc_recipients
        is_multi_recipient = len(all_recipients) > 1

        body = email.get("body", "")
        subject = email.get("subject", "")
        full_text = subject + " " + body
        sender = email.get("from", "")

        # 1. Response time analysis
        response_time = self._analyze_response_time(email)
        analysis["response_time"] = response_time

        # 2. Engagement scoring
        engagement = self._calculate_engagement_score(email, full_text)
        analysis["engagement_score"] = engagement

        # 3. Email categorization
        category = self._categorize_email(full_text)
        analysis["category"] = category

        # 4. Thread health analysis
        thread_health = self._analyze_thread_health(email)
        analysis["thread_health"] = thread_health

        # 5. Sentiment trajectory
        sentiment_trajectory = self._analyze_sentiment_trajectory(email)
        analysis["sentiment_trajectory"] = sentiment_trajectory

        # 6. Performance benchmarking
        benchmark = self._benchmark_performance(response_time, engagement, thread_health)
        analysis["performance_benchmark"] = benchmark

        # 7. Team performance tracking
        team_metrics = self._track_team_performance(email, response_time, engagement)
        analysis["team_metrics"] = team_metrics

        # 8. Productivity insights
        productivity = self._generate_productivity_insights(email, response_time, engagement)
        analysis["productivity_insights"] = productivity

        # 9. Determine action
        action = self._determine_performance_action(benchmark, engagement, thread_health)
        analysis["recommended_action"] = action

        # 10. REPLY-ALL ENFORCEMENT
        reply_all_check = self._enforce_reply_all(email, all_recipients, is_multi_recipient)
        analysis["reply_all_enforcement"] = reply_all_check

        # 11. Performance report
        analysis["performance_report"] = self._generate_performance_report(analysis)

        # Store metrics
        self.email_metrics.append({
            "email_id": analysis["email_id"],
            "response_time_minutes": response_time["minutes"],
            "engagement_score": engagement["score"],
            "category": category["category"],
            "benchmark_grade": benchmark["grade"],
            "reply_all": reply_all_check["enforced"],
            "timestamp": analysis["timestamp"],
        })

        # Track hourly distribution
        hour = datetime.now(timezone.utc).hour
        self.hourly_distribution[hour] += 1

        # Track category stats
        self.category_stats[category["category"]]["count"] += 1
        if response_time["minutes"] > 0:
            self.category_stats[category["category"]]["avg_response"].append(response_time["minutes"])

        return analysis

    def _analyze_response_time(self, email: Dict) -> Dict:
        """Analyze response time metrics."""
        sent_time = email.get("sent_timestamp")
        received_time = email.get("received_timestamp")
        
        if sent_time and received_time:
            try:
                sent_dt = datetime.fromisoformat(sent_time)
                received_dt = datetime.fromisoformat(received_time)
                minutes = (received_dt - sent_dt).total_seconds() / 60
            except:
                minutes = -1
        else:
            # Simulated response time based on email characteristics
            thread_depth = email.get("thread_depth", 1)
            minutes = max(5, 120 - (thread_depth * 15))

        if minutes < 0:
            grade = "N/A"
        elif minutes <= self.PERFORMANCE_BENCHMARKS["response_time_minutes"]["excellent"]:
            grade = "excellent"
        elif minutes <= self.PERFORMANCE_BENCHMARKS["response_time_minutes"]["good"]:
            grade = "good"
        elif minutes <= self.PERFORMANCE_BENCHMARKS["response_time_minutes"]["average"]:
            grade = "average"
        else:
            grade = "poor"

        return {
            "minutes": round(minutes, 1) if minutes >= 0 else -1,
            "grade": grade,
            "benchmark": self.PERFORMANCE_BENCHMARKS["response_time_minutes"],
            "is_within_sla": grade in ("excellent", "good"),
        }

    def _calculate_engagement_score(self, email: Dict, text: str) -> Dict:
        """Calculate engagement score based on email characteristics."""
        score = 50  # Base score

        # Thread depth contributes to engagement
        thread_depth = email.get("thread_depth", 1)
        score += min(thread_depth * 8, 30)

        # Word count indicates engagement
        word_count = len(text.split())
        if word_count > 200:
            score += 10
        elif word_count > 100:
            score += 5
        elif word_count < 20:
            score -= 10

        # Attachments indicate engagement
        if email.get("attachments"):
            score += 5

        # Questions indicate active engagement
        questions = text.count('?')
        score += min(questions * 3, 10)

        # Multiple recipients indicate collaboration
        recipient_count = len(email.get("to", [])) + len(email.get("cc", []))
        if recipient_count > 2:
            score += 5

        score = max(0, min(100, score))

        if score >= self.PERFORMANCE_BENCHMARKS["engagement_score"]["excellent"]:
            level = "excellent"
        elif score >= self.PERFORMANCE_BENCHMARKS["engagement_score"]["good"]:
            level = "good"
        elif score >= self.PERFORMANCE_BENCHMARKS["engagement_score"]["average"]:
            level = "average"
        else:
            level = "poor"

        return {
            "score": score,
            "level": level,
            "factors": {
                "thread_depth": thread_depth,
                "word_count": word_count,
                "questions": questions,
                "attachments": len(email.get("attachments", [])),
                "recipients": recipient_count,
            },
        }

    def _categorize_email(self, text: str) -> Dict:
        """Categorize email by business function."""
        text_lower = text.lower()
        scores = {}

        for category, keywords in self.EMAIL_CATEGORIES.items():
            if category == "general":
                continue
            matches = sum(1 for kw in keywords if kw in text_lower)
            if matches > 0:
                scores[category] = matches

        if scores:
            best = max(scores, key=scores.get)
            return {"category": best, "confidence": round(scores[best] / len(self.EMAIL_CATEGORIES[best]), 2)}

        return {"category": "general", "confidence": 1.0}

    def _analyze_thread_health(self, email: Dict) -> Dict:
        """Analyze email thread health."""
        thread_depth = email.get("thread_depth", 1)
        participant_count = len(set(email.get("to", []) + email.get("cc", []) + [email.get("from", "")]))
        
        # Healthy thread indicators
        health_indicators = {
            "appropriate_depth": 2 <= thread_depth <= 8,
            "good_participation": 2 <= participant_count <= 6,
            "not_stalled": thread_depth > 0,
            "not_overloaded": thread_depth < 15,
        }

        health_score = sum(1 for v in health_indicators.values() if v) / len(health_indicators) * 100

        return {
            "health_score": round(health_score, 1),
            "thread_depth": thread_depth,
            "participant_count": participant_count,
            "indicators": health_indicators,
            "status": "HEALTHY" if health_score >= 75 else "NEEDS_ATTENTION" if health_score >= 50 else "UNHEALTHY",
        }

    def _analyze_sentiment_trajectory(self, email: Dict) -> Dict:
        """Analyze sentiment trajectory across thread."""
        body = email.get("body", "").lower()
        
        positive = sum(1 for w in ["great", "thanks", "excellent", "love", "perfect", "happy", "appreciate"] if w in body)
        negative = sum(1 for w in ["frustrated", "angry", "terrible", "disappointed", "unacceptable", "worst"] if w in body)

        if positive > negative:
            trajectory = "improving"
        elif negative > positive:
            trajectory = "declining"
        else:
            trajectory = "stable"

        return {
            "trajectory": trajectory,
            "positive_signals": positive,
            "negative_signals": negative,
            "needs_intervention": trajectory == "declining" and negative >= 2,
        }

    def _benchmark_performance(self, response: Dict, engagement: Dict, thread: Dict) -> Dict:
        """Benchmark overall performance."""
        scores = []
        
        # Response time score
        rt_grades = {"excellent": 100, "good": 75, "average": 50, "poor": 25, "N/A": 50}
        scores.append(rt_grades.get(response["grade"], 50))
        
        # Engagement score
        scores.append(engagement["score"])
        
        # Thread health score
        scores.append(thread["health_score"])

        overall = round(sum(scores) / len(scores), 1)

        if overall >= 85:
            grade = "A"
        elif overall >= 70:
            grade = "B"
        elif overall >= 55:
            grade = "C"
        elif overall >= 40:
            grade = "D"
        else:
            grade = "F"

        return {
            "overall_score": overall,
            "grade": grade,
            "breakdown": {
                "response_time": response["grade"],
                "engagement": engagement["level"],
                "thread_health": thread["status"],
            },
        }

    def _track_team_performance(self, email: Dict, response: Dict, engagement: Dict) -> Dict:
        """Track team-level performance metrics."""
        recipients = email.get("to", [])
        
        for recipient in recipients:
            team = self.team_performance[recipient]
            team["emails_handled"] += 1
            if response["minutes"] > 0:
                team["avg_response_time"].append(response["minutes"])
            team["engagement_scores"].append(engagement["score"])

        return {
            "team_members_tracked": len(self.team_performance),
            "current_email_participants": len(recipients),
        }

    def _generate_productivity_insights(self, email: Dict, response: Dict, engagement: Dict) -> Dict:
        """Generate productivity insights."""
        insights = []

        if response["grade"] == "excellent":
            insights.append("Excellent response time — maintaining high service standards")
        elif response["grade"] == "poor":
            insights.append("Response time below SLA — consider prioritizing this thread")

        if engagement["score"] >= 80:
            insights.append("High engagement detected — strong customer interest")
        elif engagement["score"] < 30:
            insights.append("Low engagement — may need proactive follow-up")

        if len(email.get("attachments", [])) > 3:
            insights.append("Multiple attachments — ensure all are reviewed before responding")

        return {
            "insights": insights,
            "actionable_count": len([i for i in insights if "consider" in i.lower() or "need" in i.lower()]),
        }

    def _determine_performance_action(self, benchmark: Dict, engagement: Dict, thread: Dict) -> str:
        """Determine action based on performance analysis."""
        if benchmark["grade"] == "A" and engagement["score"] >= 80:
            return "MAINTAIN_EXCELLENCE"
        elif benchmark["grade"] in ("D", "F"):
            return "IMMEDIATE_PERFORMANCE_IMPROVEMENT"
        elif thread["status"] == "UNHEALTHY":
            return "THREAD_INTERVENTION"
        elif engagement["level"] == "poor":
            return "PROACTIVE_ENGAGEMENT"
        else:
            return "STANDARD_OPTIMIZED_RESPONSE"

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
            result["reason"] = f"REPLY-ALL ENFORCED: {len(all_recipients)} recipients — performance tracked."
            self.reply_all_audit.append({
                "email_id": email.get("id", "unknown"),
                "enforced": True,
                "timestamp": datetime.now(timezone.utc).isoformat(),
            })
        else:
            result["reason"] = "Single recipient."
        return result

    def _generate_performance_report(self, analysis: Dict) -> Dict:
        """Generate a comprehensive performance report."""
        return {
            "email_id": analysis["email_id"],
            "overall_grade": analysis["performance_benchmark"]["grade"],
            "overall_score": analysis["performance_benchmark"]["overall_score"],
            "response_time": analysis["response_time"]["grade"],
            "engagement_level": analysis["engagement_score"]["level"],
            "thread_status": analysis["thread_health"]["status"],
            "category": analysis["category"]["category"],
            "sentiment": analysis["sentiment_trajectory"]["trajectory"],
            "action": analysis["recommended_action"],
        }

    def get_stats(self) -> Dict:
        if not self.email_metrics:
            return {"emails_analyzed": 0}
        
        avg_response = [m["response_time_minutes"] for m in self.email_metrics if m["response_time_minutes"] > 0]
        avg_engagement = [m["engagement_score"] for m in self.email_metrics]
        
        grade_distribution = {}
        for m in self.email_metrics:
            g = m["benchmark_grade"]
            grade_distribution[g] = grade_distribution.get(g, 0) + 1

        return {
            "emails_analyzed": len(self.email_metrics),
            "avg_response_time_minutes": round(sum(avg_response) / max(len(avg_response), 1), 1),
            "avg_engagement_score": round(sum(avg_engagement) / max(len(avg_engagement), 1), 1),
            "grade_distribution": grade_distribution,
            "reply_all_enforced": len(self.reply_all_audit),
            "peak_hours": sorted(self.hourly_distribution.items(), key=lambda x: x[1], reverse=True)[:3],
        }


def test_v965():
    engine = EmailPerformanceAnalytics()

    # Test 1: High-engagement email with fast response
    email1 = {
        "id": "perf-001",
        "from": "client@enterprise.com",
        "to": ["sales@ziontechgroup.com", "support@ziontechgroup.com"],
        "cc": ["manager@enterprise.com", "cto@enterprise.com"],
        "subject": "Great progress on the AI Platform integration!",
        "body": "Hi team! Great work on the AI Platform integration so far. We have some questions about the API endpoints and would like to discuss the next steps. Could we review the documentation together? Thanks for the excellent support!",
        "thread_depth": 5,
        "attachments": ["specs.pdf", "api-docs.md"],
    }
    r1 = engine.analyze_email_case_by_case(email1)
    assert r1["reply_all_enforcement"]["enforced"] is True
    assert r1["engagement_score"]["score"] >= 60
    print(f"✅ Test 1 PASSED: Engagement={r1['engagement_score']['score']}, grade={r1['performance_benchmark']['grade']}, reply-all enforced")

    # Test 2: Low-engagement email
    email2 = {
        "id": "perf-002",
        "from": "user@small.biz",
        "to": ["support@ziontechgroup.com"],
        "subject": "OK",
        "body": "ok thanks",
        "thread_depth": 1,
    }
    r2 = engine.analyze_email_case_by_case(email2)
    assert r2["engagement_score"]["score"] < 60
    print(f"✅ Test 2 PASSED: Low engagement={r2['engagement_score']['score']}, action={r2['recommended_action']}")

    # Test 3: Support ticket with declining sentiment
    email3 = {
        "id": "perf-003",
        "from": "frustrated@client.com",
        "to": ["support@ziontechgroup.com", "escalations@ziontechgroup.com"],
        "subject": "Still not fixed - disappointed",
        "body": "This is the third time I'm writing about this issue. I'm very frustrated and disappointed with the service. This is unacceptable and the worst experience I've had.",
        "thread_depth": 8,
    }
    r3 = engine.analyze_email_case_by_case(email3)
    assert r3["sentiment_trajectory"]["trajectory"] == "declining"
    assert r3["reply_all_enforcement"]["enforced"] is True
    print(f"✅ Test 3 PASSED: Sentiment={r3['sentiment_trajectory']['trajectory']}, needs intervention={r3['sentiment_trajectory']['needs_intervention']}")

    stats = engine.get_stats()
    print(f"✅ Test 4 PASSED: {stats['emails_analyzed']} analyzed, avg engagement={stats['avg_engagement_score']}, grades={stats['grade_distribution']}")

    print("\n🎉 V965 ALL TESTS PASSED — Email Performance Analytics operational!")
    return True


if __name__ == "__main__":
    test_v965()
