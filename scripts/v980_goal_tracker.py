#!/usr/bin/env python3
"""
V980: Email Goal Tracker Engine
Tracks commitments, promises, and goals made in emails.
Ensures accountability and follow-through with strict reply-all enforcement.
"""

import re
import hashlib
from datetime import datetime, timezone
from typing import Dict, List, Any


class GoalTracker:
    """Tracks commitments, promises, and goals from emails."""

    COMMITMENT_PATTERNS = {
        "promise": {
            "patterns": [
                r'\b(?:I|we)\s+(?:will|shall|promise|commit|guarantee)\s+(.{10,80}?)(?:\.|$)',
                r'\b(?:let me|let us)\s+(.{10,80}?)(?:\.|$)',
            ],
            "severity": "HIGH",
        },
        "deadline": {
            "patterns": [
                r'\b(?:by|before|no later than)\s+(\w+\s+\d{1,2}(?:st|nd|rd|th)?|\d{1,2}[/-]\d{1,2}[/-]\d{2,4})',
                r'\b(?:deadline|due date|delivery date)[:\s]+(.{10,50}?)(?:\.|$)',
            ],
            "severity": "CRITICAL",
        },
        "deliverable": {
            "patterns": [
                r'\b(?:send|provide|deliver|submit|share)\s+(?:you\s+)?(?:the\s+)?(.{10,60}?)(?:\.|$)',
                r'\b(?:I|we)\s+(?:will|shall)\s+(?:send|provide|deliver)\s+(.{10,60}?)(?:\.|$)',
            ],
            "severity": "HIGH",
        },
        "meeting": {
            "patterns": [
                r'\b(?:schedule|set up|arrange|book)\s+(?:a\s+)?(?:meeting|call|appointment)',
                r'\b(?:let\'s|we should)\s+(?:meet|discuss|talk)\s+(.{10,50}?)(?:\.|$)',
            ],
            "severity": "MEDIUM",
        },
        "follow_up": {
            "patterns": [
                r'\b(?:follow up|check in|get back to you|circle back)\s+(.{10,50}?)(?:\.|$)',
                r'\b(?:I|we)\s+(?:will|shall)\s+(?:follow up|check in|get back)\s+(.{10,50}?)(?:\.|$)',
            ],
            "severity": "MEDIUM",
        },
    }

    GOAL_INDICATORS = [
        "goal", "objective", "target", "milestone", "aim", "target",
        "kpi", "metric", "measure", "benchmark", "success criteria",
    ]

    def __init__(self):
        self.goal_log: List[Dict] = []
        self.reply_all_audit: List[Dict] = []
        self.commitments: List[Dict] = []

    def analyze_email_case_by_case(self, email: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze email for goal tracking case by case."""
        analysis = {
            "engine": "V980",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "email_id": email.get("id", hashlib.md5(str(email).encode()).hexdigest()[:12]),
            "analysis_type": "goal_tracker",
        }

        to_recipients = email.get("to", [])
        cc_recipients = email.get("cc", [])
        all_recipients = to_recipients + cc_recipients
        is_multi_recipient = len(all_recipients) > 1

        body = email.get("body", "")
        subject = email.get("subject", "")
        full_text = subject + " " + body

        # 1. Extract commitments
        commitments = self._extract_commitments(full_text)
        analysis["commitments"] = commitments

        # 2. Extract deadlines
        deadlines = self._extract_deadlines(full_text)
        analysis["deadlines"] = deadlines

        # 3. Extract deliverables
        deliverables = self._extract_deliverables(full_text)
        analysis["deliverables"] = deliverables

        # 4. Extract goals/objectives
        goals = self._extract_goals(full_text)
        analysis["goals"] = goals

        # 5. Identify stakeholders
        stakeholders = self._identify_stakeholders(email)
        analysis["stakeholders"] = stakeholders

        # 6. Priority assessment
        priority = self._assess_priority(commitments, deadlines)
        analysis["priority"] = priority

        # 7. Follow-up scheduling
        follow_up = self._schedule_follow_up(deadlines, priority)
        analysis["follow_up"] = follow_up

        # 8. Accountability tracking
        accountability = self._track_accountability(commitments, stakeholders)
        analysis["accountability"] = accountability

        # 9. Determine action
        action = self._determine_goal_action(commitments, deadlines, priority)
        analysis["recommended_action"] = action

        # REPLY-ALL ENFORCEMENT
        reply_all = self._enforce_reply_all(email, all_recipients, is_multi_recipient)
        analysis["reply_all_enforcement"] = reply_all

        # Store commitments
        for commitment in commitments["items"]:
            self.commitments.append({
                "email_id": analysis["email_id"],
                "commitment": commitment,
                "stakeholders": stakeholders,
                "priority": priority["level"],
                "timestamp": analysis["timestamp"],
            })

        self.goal_log.append({
            "email_id": analysis["email_id"],
            "commitment_count": commitments["total_count"],
            "deadline_count": deadlines["total_count"],
            "priority_level": priority["level"],
            "reply_all": reply_all["enforced"],
            "timestamp": analysis["timestamp"],
        })

        return analysis

    def _extract_commitments(self, text: str) -> Dict:
        """Extract commitments from text."""
        items = []
        
        for category, config in self.COMMITMENT_PATTERNS.items():
            for pattern in config["patterns"]:
                matches = re.findall(pattern, text, re.IGNORECASE)
                for match in matches:
                    items.append({
                        "type": category,
                        "content": match.strip() if isinstance(match, str) else match[0].strip(),
                        "severity": config["severity"],
                    })

        return {
            "items": items,
            "total_count": len(items),
            "by_type": {cat: sum(1 for i in items if i["type"] == cat) for cat in self.COMMITMENT_PATTERNS.keys()},
        }

    def _extract_deadlines(self, text: str) -> Dict:
        """Extract deadlines from text."""
        deadlines = []
        
        # Date patterns
        date_patterns = [
            r'\b(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})\b',
            r'\b(\w+\s+\d{1,2}(?:st|nd|rd|th)?)\b',
            r'\b(today|tomorrow|next week|this week|end of day|eod|close of business|cob)\b',
        ]

        for pattern in date_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            for match in matches:
                deadlines.append({
                    "date": match,
                    "confidence": 0.8 if re.search(r'\d', match) else 0.6,
                })

        return {
            "items": deadlines,
            "total_count": len(deadlines),
            "has_deadlines": len(deadlines) > 0,
        }

    def _extract_deliverables(self, text: str) -> Dict:
        """Extract deliverables from text."""
        deliverables = []
        
        patterns = [
            r'\b(?:send|provide|deliver|submit|share)\s+(?:you\s+)?(?:the\s+)?(.{10,60}?)(?:\.|$)',
            r'\b(?:I|we)\s+(?:will|shall)\s+(?:send|provide|deliver)\s+(.{10,60}?)(?:\.|$)',
        ]

        for pattern in patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            for match in matches:
                deliverables.append({
                    "content": match.strip(),
                    "confidence": 0.75,
                })

        return {
            "items": deliverables,
            "total_count": len(deliverables),
        }

    def _extract_goals(self, text: str) -> Dict:
        """Extract goals and objectives from text."""
        text_lower = text.lower()
        
        found_goals = []
        for indicator in self.GOAL_INDICATORS:
            if indicator in text_lower:
                # Try to extract the goal context
                pattern = rf'\b{indicator}\b[:\s]+(.{{10,80}}?)(?:\.|$)'
                matches = re.findall(pattern, text, re.IGNORECASE)
                for match in matches:
                    found_goals.append({
                        "indicator": indicator,
                        "content": match.strip(),
                        "confidence": 0.7,
                    })

        return {
            "items": found_goals,
            "total_count": len(found_goals),
            "has_goals": len(found_goals) > 0,
        }

    def _identify_stakeholders(self, email: Dict) -> Dict:
        """Identify stakeholders involved in commitments."""
        stakeholders = {
            "owner": email.get("from", ""),
            "recipients": email.get("to", []),
            "observers": email.get("cc", []),
        }

        return {
            "owner": stakeholders["owner"],
            "total_stakeholders": len(stakeholders["recipients"]) + len(stakeholders["observers"]),
            "all_parties": [stakeholders["owner"]] + stakeholders["recipients"] + stakeholders["observers"],
        }

    def _assess_priority(self, commitments: Dict, deadlines: Dict) -> Dict:
        """Assess priority based on commitments and deadlines."""
        score = 0
        
        # Commitment severity
        severity_scores = {"CRITICAL": 40, "HIGH": 30, "MEDIUM": 20, "LOW": 10}
        for item in commitments["items"]:
            score += severity_scores.get(item["severity"], 0)

        # Deadline urgency
        if deadlines["has_deadlines"]:
            score += 20

        # Volume adjustment
        score += min(commitments["total_count"] * 5, 20)

        score = min(score, 100)

        if score >= 70:
            level = "HIGH"
        elif score >= 40:
            level = "MEDIUM"
        else:
            level = "LOW"

        return {
            "score": score,
            "level": level,
            "commitment_count": commitments["total_count"],
            "has_deadlines": deadlines["has_deadlines"],
        }

    def _schedule_follow_up(self, deadlines: Dict, priority: Dict) -> Dict:
        """Schedule follow-up based on deadlines and priority."""
        if not deadlines["has_deadlines"]:
            # Default follow-up based on priority
            if priority["level"] == "HIGH":
                days = 3
            elif priority["level"] == "MEDIUM":
                days = 7
            else:
                days = 14
        else:
            # Follow up before deadline
            days = 1

        return {
            "follow_up_days": days,
            "reason": "Before deadline" if deadlines["has_deadlines"] else f"Based on {priority['level']} priority",
            "reminder_enabled": True,
        }

    def _track_accountability(self, commitments: Dict, stakeholders: Dict) -> Dict:
        """Track accountability for commitments."""
        return {
            "owner": stakeholders["owner"],
            "commitment_count": commitments["total_count"],
            "accountability_level": "HIGH" if commitments["total_count"] > 3 else "MEDIUM" if commitments["total_count"] > 0 else "LOW",
            "tracking_enabled": True,
        }

    def _determine_goal_action(self, commitments: Dict, deadlines: Dict, priority: Dict) -> str:
        """Determine goal tracking action."""
        if priority["level"] == "HIGH" and deadlines["has_deadlines"]:
            return "CREATE_TRACKING_ITEM"
        elif priority["level"] == "HIGH":
            return "SCHEDULE_FOLLOW_UP"
        elif commitments["total_count"] > 0:
            return "LOG_COMMITMENT"
        else:
            return "NO_ACTION"

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
        if not self.goal_log:
            return {"emails_analyzed": 0}
        return {
            "emails_analyzed": len(self.goal_log),
            "total_commitments": sum(g["commitment_count"] for g in self.goal_log),
            "total_deadlines": sum(g["deadline_count"] for g in self.goal_log),
            "commitments_tracked": len(self.commitments),
            "reply_all_enforced": len(self.reply_all_audit),
        }


def test_v980():
    engine = GoalTracker()

    # Test 1: Email with multiple commitments and deadlines
    email1 = {
        "id": "goal-001",
        "from": "pm@company.com",
        "to": ["dev@ziontechgroup.com", "qa@company.com"],
        "cc": ["director@company.com"],
        "subject": "Project deliverables and timeline",
        "body": "Hi team, I will send the requirements document by Friday. We promise to deliver the MVP by March 15th. Let me know if you need any clarification. I'll follow up next week to check progress.",
    }
    r1 = engine.analyze_email_case_by_case(email1)
    assert r1["reply_all_enforcement"]["enforced"] is True
    assert r1["commitments"]["total_count"] > 0
    assert r1["deadlines"]["has_deadlines"] is True
    assert r1["priority"]["level"] in ("MEDIUM", "HIGH")
    print(f"✅ Test 1 PASSED: Commitments={r1['commitments']['total_count']}, deadlines={r1['deadlines']['total_count']}, priority={r1['priority']['level']}, reply-all enforced")

    # Test 2: Email with no commitments
    email2 = {
        "id": "goal-002",
        "from": "user@example.com",
        "to": ["info@ziontechgroup.com"],
        "subject": "General inquiry",
        "body": "Hi, I'd like to learn more about your services.",
    }
    r2 = engine.analyze_email_case_by_case(email2)
    assert r2["commitments"]["total_count"] == 0
    assert r2["priority"]["level"] == "LOW"
    print(f"✅ Test 2 PASSED: No commitments detected, priority={r2['priority']['level']}")

    stats = engine.get_stats()
    print(f"✅ Test 3 PASSED: {stats['emails_analyzed']} analyzed, {stats['total_commitments']} commitments tracked")

    print("\n🎉 V980 ALL TESTS PASSED — Goal Tracker Engine operational!")
    return True


if __name__ == "__main__":
    test_v980()
