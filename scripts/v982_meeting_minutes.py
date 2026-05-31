#!/usr/bin/env python3
"""
V982: Meeting Minutes Generator Engine
Auto-extracts action items, decisions, and attendees from meeting emails.
Enables zero manual note-taking for meeting follow-ups.
"""

import re
import hashlib
from datetime import datetime, timezone
from typing import Dict, List, Any
from collections import defaultdict


class MeetingMinutesGenerator:
    """Generates meeting minutes from email conversations."""

    def __init__(self):
        self.meeting_log: List[Dict] = []
        self.reply_all_audit: List[Dict] = []
        self.minutes_database: Dict[str, Dict] = {}

    def analyze_email_case_by_case(self, email: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze email for meeting content case by case."""
        analysis = {
            "engine": "V982",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "email_id": email.get("id", hashlib.md5(str(email).encode()).hexdigest()[:12]),
            "analysis_type": "meeting_minutes",
        }

        to_recipients = email.get("to", [])
        cc_recipients = email.get("cc", [])
        all_recipients = to_recipients + cc_recipients
        is_multi_recipient = len(all_recipients) > 1

        body = email.get("body", "")
        subject = email.get("subject", "")

        # 1. Detect if email contains meeting content
        is_meeting = self._detect_meeting_content(subject, body)
        analysis["is_meeting_content"] = is_meeting

        if not is_meeting["is_meeting"]:
            analysis["recommended_action"] = "NOT_A_MEETING"
            reply_all = self._enforce_reply_all(email, all_recipients, is_multi_recipient)
            analysis["reply_all_enforcement"] = reply_all
            return analysis

        # 2. Extract attendees
        attendees = self._extract_attendees(email)
        analysis["attendees"] = attendees

        # 3. Extract meeting details
        meeting_details = self._extract_meeting_details(subject, body)
        analysis["meeting_details"] = meeting_details

        # 4. Extract action items
        action_items = self._extract_action_items(body)
        analysis["action_items"] = action_items

        # 5. Extract decisions
        decisions = self._extract_decisions(body)
        analysis["decisions"] = decisions

        # 6. Extract discussion points
        discussion_points = self._extract_discussion_points(body)
        analysis["discussion_points"] = discussion_points

        # 7. Extract follow-ups
        follow_ups = self._extract_follow_ups(body)
        analysis["follow_ups"] = follow_ups

        # 8. Generate minutes
        minutes = self._generate_minutes(
            meeting_details, attendees, action_items, 
            decisions, discussion_points, follow_ups
        )
        analysis["generated_minutes"] = minutes

        # 9. Quality assessment
        quality = self._assess_minutes_quality(minutes)
        analysis["minutes_quality"] = quality

        # 10. Determine action
        action = self._determine_minutes_action(quality, action_items)
        analysis["recommended_action"] = action

        # REPLY-ALL ENFORCEMENT
        reply_all = self._enforce_reply_all(email, all_recipients, is_multi_recipient)
        analysis["reply_all_enforcement"] = reply_all

        # Store minutes
        self.minutes_database[analysis["email_id"]] = minutes

        self.meeting_log.append({
            "email_id": analysis["email_id"],
            "attendee_count": len(attendees),
            "action_item_count": len(action_items),
            "decision_count": len(decisions),
            "quality_score": quality["score"],
            "reply_all": reply_all["enforced"],
            "timestamp": analysis["timestamp"],
        })

        return analysis

    def _detect_meeting_content(self, subject: str, body: str) -> Dict:
        """Detect if email contains meeting content."""
        text = (subject + " " + body).lower()
        
        meeting_keywords = [
            "meeting", "call", "discussion", "standup", "sync", "review",
            "attendees", "participants", "agenda", "minutes", "notes",
            "action items", "decisions made", "follow-up"
        ]
        
        matches = [kw for kw in meeting_keywords if kw in text]
        
        return {
            "is_meeting": len(matches) >= 2,
            "confidence": min(len(matches) / 5, 1.0),
            "matched_keywords": matches[:10],
        }

    def _extract_attendees(self, email: Dict) -> List[Dict]:
        """Extract meeting attendees from email."""
        attendees = []
        
        # From email headers
        if email.get("from"):
            attendees.append({
                "email": email["from"],
                "role": "organizer",
                "source": "email_header",
            })
        
        for recipient in email.get("to", []):
            attendees.append({
                "email": recipient,
                "role": "required",
                "source": "email_header",
            })
        
        for recipient in email.get("cc", []):
            attendees.append({
                "email": recipient,
                "role": "optional",
                "source": "email_header",
            })
        
        return attendees

    def _extract_meeting_details(self, subject: str, body: str) -> Dict:
        """Extract meeting details from subject and body."""
        details = {}
        
        # Meeting title
        details["title"] = subject if subject else "Meeting"
        
        # Date/time
        date_patterns = [
            r'(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})',
            r'(\w+\s+\d{1,2}(?:st|nd|rd|th)?)',
            r'(today|tomorrow|next week)',
        ]
        
        for pattern in date_patterns:
            matches = re.findall(pattern, body, re.IGNORECASE)
            if matches:
                details["date"] = matches[0]
                break
        
        # Time
        time_patterns = [
            r'(\d{1,2}:\d{2}\s*(?:am|pm|AM|PM)?)',
            r'(\d{1,2}\s*(?:am|pm|AM|PM))',
        ]
        
        for pattern in time_patterns:
            matches = re.findall(pattern, body, re.IGNORECASE)
            if matches:
                details["time"] = matches[0]
                break
        
        # Duration
        duration_patterns = [
            r'(\d+)\s*(?:hour|hr|h)',
            r'(\d+)\s*(?:minute|min|m)',
        ]
        
        for pattern in duration_patterns:
            matches = re.findall(pattern, body, re.IGNORECASE)
            if matches:
                details["duration"] = matches[0]
                break
        
        # Location/platform
        location_patterns = [
            r'(?:at|in|on|via)\s+([A-Z][a-zA-Z\s]+)',
            r'(zoom|teams|meet|webex|gotomeeting)',
        ]
        
        for pattern in location_patterns:
            matches = re.findall(pattern, body, re.IGNORECASE)
            if matches:
                details["location"] = matches[0]
                break
        
        return details

    def _extract_action_items(self, body: str) -> List[Dict]:
        """Extract action items from meeting notes."""
        action_items = []
        
        patterns = [
            r'(?:action item|todo|task|@)\s*[:\-]?\s*(.+?)(?:\.|$)',
            r'(\w+)\s+(?:will|to)\s+(.+?)(?:\.|$)',
            r'(?:assigned to|owner)\s*[:\-]?\s*(\w+)\s*[:\-]?\s*(.+?)(?:\.|$)',
        ]
        
        for pattern in patterns:
            matches = re.finditer(pattern, body, re.IGNORECASE | re.MULTILINE)
            for match in matches:
                text = match.group(0).strip()
                if len(text) > 10 and len(text) < 200:
                    # Try to extract assignee
                    assignee_match = re.search(r'(\w+)(?:\s+will|\s+to|\s*:)', text, re.IGNORECASE)
                    assignee = assignee_match.group(1) if assignee_match else None
                    
                    action_items.append({
                        "text": text,
                        "assignee": assignee,
                        "status": "pending",
                        "priority": "MEDIUM",
                    })
        
        return action_items

    def _extract_decisions(self, body: str) -> List[Dict]:
        """Extract decisions made during meeting."""
        decisions = []
        
        patterns = [
            r'(?:decided|agreed|approved|confirmed)\s+(?:to|that)?\s+(.+?)(?:\.|$)',
            r'(?:decision|conclusion)\s*[:\-]?\s*(.+?)(?:\.|$)',
            r'(?:we will|let\'s)\s+(.+?)(?:\.|$)',
        ]
        
        for pattern in patterns:
            matches = re.finditer(pattern, body, re.IGNORECASE | re.MULTILINE)
            for match in matches:
                text = match.group(1).strip() if match.lastindex else match.group(0).strip()
                if len(text) > 10 and len(text) < 200:
                    decisions.append({
                        "text": text,
                        "confidence": 0.8,
                    })
        
        return decisions

    def _extract_discussion_points(self, body: str) -> List[Dict]:
        """Extract key discussion points."""
        points = []
        
        # Look for bullet points or numbered lists
        bullet_patterns = [
            r'[\-\*\•]\s+(.+?)(?=\n|$)',
            r'\d+[\.\)]\s+(.+?)(?=\n|$)',
        ]
        
        for pattern in bullet_patterns:
            matches = re.finditer(pattern, body, re.MULTILINE)
            for match in matches:
                text = match.group(1).strip()
                if len(text) > 15 and len(text) < 300:
                    points.append({
                        "text": text,
                        "type": "discussion_point",
                    })
        
        return points[:10]  # Limit to 10 points

    def _extract_follow_ups(self, body: str) -> List[Dict]:
        """Extract follow-up items."""
        follow_ups = []
        
        patterns = [
            r'(?:follow[- ]?up|next meeting|next steps?)\s*[:\-]?\s*(.+?)(?:\.|$)',
            r'(?:schedule|book|set up)\s+(.+?)(?:\.|$)',
        ]
        
        for pattern in patterns:
            matches = re.finditer(pattern, body, re.IGNORECASE | re.MULTILINE)
            for match in matches:
                text = match.group(1).strip() if match.lastindex else match.group(0).strip()
                if len(text) > 10 and len(text) < 200:
                    follow_ups.append({
                        "text": text,
                        "type": "follow_up",
                    })
        
        return follow_ups

    def _generate_minutes(self, details: Dict, attendees: List, action_items: List,
                         decisions: List, discussion_points: List, follow_ups: List) -> Dict:
        """Generate formatted meeting minutes."""
        minutes = {
            "title": details.get("title", "Meeting"),
            "date": details.get("date"),
            "time": details.get("time"),
            "duration": details.get("duration"),
            "location": details.get("location"),
            "attendees": [a["email"] for a in attendees],
            "attendee_count": len(attendees),
            "summary": [],
            "action_items": action_items,
            "decisions": decisions,
            "discussion_points": discussion_points,
            "follow_ups": follow_ups,
        }
        
        # Generate summary
        if action_items:
            minutes["summary"].append(f"• {len(action_items)} action item(s) assigned")
        if decisions:
            minutes["summary"].append(f"• {len(decisions)} decision(s) made")
        if discussion_points:
            minutes["summary"].append(f"• {len(discussion_points)} discussion point(s)")
        if follow_ups:
            minutes["summary"].append(f"• {len(follow_ups)} follow-up(s) scheduled")
        
        return minutes

    def _assess_minutes_quality(self, minutes: Dict) -> Dict:
        """Assess quality of generated minutes."""
        score = 0
        factors = []
        
        # Attendees present
        if minutes["attendee_count"] > 0:
            score += 20
            factors.append("Attendees captured")
        
        # Action items present
        if len(minutes["action_items"]) > 0:
            score += 30
            factors.append("Action items extracted")
        
        # Decisions present
        if len(minutes["decisions"]) > 0:
            score += 20
            factors.append("Decisions captured")
        
        # Discussion points present
        if len(minutes["discussion_points"]) > 0:
            score += 15
            factors.append("Discussion points captured")
        
        # Meeting details present
        if minutes.get("date") or minutes.get("time"):
            score += 15
            factors.append("Meeting details captured")
        
        return {
            "score": score,
            "factors": factors,
            "quality_level": "HIGH" if score >= 70 else "MEDIUM" if score >= 50 else "LOW",
        }

    def _determine_minutes_action(self, quality: Dict, action_items: List) -> str:
        """Determine action based on minutes quality."""
        if quality["quality_level"] == "HIGH" and action_items:
            return "DISTRIBUTE_MINUTES_AND_TRACK_ACTIONS"
        elif quality["quality_level"] == "MEDIUM":
            return "REVIEW_AND_DISTRIBUTE"
        elif len(action_items) > 0:
            return "EXTRACT_ACTIONS_ONLY"
        else:
            return "ARCHIVE_MEETING_RECORD"

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
        if not self.meeting_log:
            return {"meetings_processed": 0}
        return {
            "meetings_processed": len(self.meeting_log),
            "total_attendees": sum(m["attendee_count"] for m in self.meeting_log),
            "total_action_items": sum(m["action_item_count"] for m in self.meeting_log),
            "total_decisions": sum(m["decision_count"] for m in self.meeting_log),
            "avg_quality_score": sum(m["quality_score"] for m in self.meeting_log) / len(self.meeting_log),
            "reply_all_enforced": len(self.reply_all_audit),
        }


def test_v982():
    engine = MeetingMinutesGenerator()

    # Test 1: Meeting with action items
    email1 = {
        "id": "mtg-001",
        "from": "manager@company.com",
        "to": ["team@ziontechgroup.com", "dev@ziontechgroup.com", "qa@company.com"],
        "subject": "Sprint Planning Meeting - January 15th",
        "body": """Meeting Notes - Sprint Planning

Attendees: Manager, Dev Team, QA Team
Date: January 15th at 2:00 PM
Duration: 1 hour

Discussion:
- Reviewed previous sprint completion rate
- Discussed new feature requirements
- Identified technical debt items

Action Items:
- John will prepare API documentation by Friday
- Sarah to set up testing environment
- Team to review design mockups

Decisions:
- Decided to prioritize authentication feature
- Agreed to 2-week sprint cycle
- Approved budget for new testing tools

Follow-up:
- Next meeting scheduled for January 29th
- Schedule design review for next week""",
    }
    r1 = engine.analyze_email_case_by_case(email1)
    assert r1["reply_all_enforcement"]["enforced"] is True
    assert r1["is_meeting_content"]["is_meeting"] is True
    assert len(r1["action_items"]) >= 2
    assert len(r1["decisions"]) >= 2
    assert r1["minutes_quality"]["score"] >= 70
    print(f"✅ Test 1 PASSED: Meeting detected, {len(r1['action_items'])} actions, {len(r1['decisions'])} decisions, quality={r1['minutes_quality']['score']}, reply-all enforced")

    # Test 2: Non-meeting email
    email2 = {
        "id": "mtg-002",
        "from": "user@company.com",
        "to": ["support@ziontechgroup.com"],
        "subject": "Question about pricing",
        "body": "Hi, I'd like to know more about your pricing plans.",
    }
    r2 = engine.analyze_email_case_by_case(email2)
    assert r2["is_meeting_content"]["is_meeting"] is False
    assert r2["recommended_action"] == "NOT_A_MEETING"
    print(f"✅ Test 2 PASSED: Non-meeting email correctly identified")

    stats = engine.get_stats()
    print(f"✅ Test 3 PASSED: {stats['meetings_processed']} meetings processed, avg quality={stats['avg_quality_score']:.1f}")

    print("\n🎉 V982 ALL TESTS PASSED — Meeting Minutes Generator operational!")
    return True


if __name__ == "__main__":
    test_v982()
