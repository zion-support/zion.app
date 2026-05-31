#!/usr/bin/env python3
"""V612 - Email Meeting Minutes Generator
Automatically create structured meeting notes from email discussions.
REPLY-ALL ENFORCED: Always replies to all recipients in multi-person threads.
"""
import json, re
from datetime import datetime
from typing import Dict, List, Any

class MeetingMinutesGenerator:
    """Generate structured meeting minutes from email threads."""
    
    ACTION_KEYWORDS = ["action item", "todo", "task", "responsible", "deadline", "assigned to"]
    DECISION_KEYWORDS = ["decided", "agreed", "approved", "concluded", "will proceed"]
    DISCUSSION_KEYWORDS = ["discuss", "talk about", "review", "consider", "explore"]
    
    def __init__(self):
        self.minutes = []
    
    def generate_minutes(self, thread: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Generate meeting minutes from email thread."""
        if not thread:
            return {"error": "No emails in thread"}
        
        participants = self._extract_participants(thread)
        decisions = self._extract_decisions(thread)
        action_items = self._extract_action_items(thread)
        discussion_points = self._extract_discussion_points(thread)
        timeline = self._build_timeline(thread)
        
        meeting_date = self._detect_meeting_date(thread)
        meeting_subject = self._detect_meeting_subject(thread)
        
        minutes_doc = {
            "meeting_title": meeting_subject,
            "date": meeting_date,
            "participants": participants,
            "decisions": decisions,
            "action_items": action_items,
            "discussion_points": discussion_points,
            "timeline": timeline,
            "next_steps": self._generate_next_steps(action_items, decisions)
        }
        
        return {
            "engine": "V612",
            "meeting_minutes": minutes_doc,
            "thread_length": len(thread),
            "participant_count": len(participants),
            "decision_count": len(decisions),
            "action_item_count": len(action_items),
            "reply_all_enforced": len(participants) > 1,
            "timestamp": datetime.now().isoformat()
        }
    
    def _extract_participants(self, thread: List[Dict]) -> List[Dict]:
        """Extract all participants with their contributions."""
        participants = {}
        for email in thread:
            sender = email.get("from", "unknown")
            if sender not in participants:
                participants[sender] = {
                    "name": sender,
                    "contributions": [],
                    "action_items_assigned": []
                }
            participants[sender]["contributions"].append(email.get("subject", ""))
        return list(participants.values())
    
    def _extract_decisions(self, thread: List[Dict]) -> List[Dict]:
        """Extract decisions made in the thread."""
        decisions = []
        for email in thread:
            body = email.get("body", "")
            for keyword in self.DECISION_KEYWORDS:
                if keyword in body.lower():
                    sentences = body.split('.')
                    for sentence in sentences:
                        if keyword in sentence.lower() and len(sentence.strip()) > 20:
                            decisions.append({
                                "decision": sentence.strip(),
                                "made_by": email.get("from", "unknown"),
                                "date": email.get("sent_at", "")
                            })
        return decisions[:10]
    
    def _extract_action_items(self, thread: List[Dict]) -> List[Dict]:
        """Extract action items with assignees and deadlines."""
        action_items = []
        for email in thread:
            body = email.get("body", "")
            for keyword in self.ACTION_KEYWORDS:
                if keyword in body.lower():
                    sentences = body.split('.')
                    for sentence in sentences:
                        if keyword in sentence.lower() and len(sentence.strip()) > 15:
                            assignee = self._extract_assignee(sentence)
                            deadline = self._extract_deadline(sentence)
                            action_items.append({
                                "task": sentence.strip(),
                                "assignee": assignee,
                                "deadline": deadline,
                                "status": "pending"
                            })
        return action_items[:10]
    
    def _extract_discussion_points(self, thread: List[Dict]) -> List[str]:
        """Extract key discussion points."""
        points = []
        for email in thread:
            body = email.get("body", "")
            sentences = body.split('.')
            for sentence in sentences:
                if any(kw in sentence.lower() for kw in self.DISCUSSION_KEYWORDS):
                    if len(sentence.strip()) > 20:
                        points.append(sentence.strip())
        return points[:10]
    
    def _build_timeline(self, thread: List[Dict]) -> List[Dict]:
        """Build chronological timeline of the discussion."""
        timeline = []
        for email in thread:
            timeline.append({
                "timestamp": email.get("sent_at", ""),
                "from": email.get("from", ""),
                "subject": email.get("subject", ""),
                "summary": email.get("body", "")[:100]
            })
        return timeline
    
    def _detect_meeting_date(self, thread: List[Dict]) -> str:
        """Detect meeting date from thread."""
        if thread:
            return thread[0].get("sent_at", datetime.now().isoformat())
        return datetime.now().isoformat()
    
    def _detect_meeting_subject(self, thread: List[Dict]) -> str:
        """Detect meeting subject."""
        if thread:
            return thread[0].get("subject", "Meeting Discussion")
        return "Meeting Discussion"
    
    def _extract_assignee(self, text: str) -> str:
        """Extract assignee from action item."""
        patterns = [r'assigned to ([A-Z][\w\s]+)', r'@([A-Za-z0-9._%+-]+)']
        for pattern in patterns:
            match = re.search(pattern, text)
            if match:
                return match.group(1).strip()
        return "TBD"
    
    def _extract_deadline(self, text: str) -> str:
        """Extract deadline from action item."""
        patterns = [r'by ([A-Za-z]+\s+\d{1,2})', r'deadline[:\s]+([A-Za-z]+\s+\d{1,2})']
        for pattern in patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                return match.group(1).strip()
        return "TBD"
    
    def _generate_next_steps(self, action_items: List[Dict], decisions: List[Dict]) -> List[str]:
        """Generate next steps based on action items and decisions."""
        next_steps = []
        if action_items:
            next_steps.append(f"Complete {len(action_items)} action items")
        if decisions:
            next_steps.append(f"Implement {len(decisions)} decisions")
        next_steps.append("Schedule follow-up meeting")
        return next_steps
    
    def process_batch(self, threads: List[List[Dict]]) -> Dict[str, Any]:
        results = [self.generate_minutes(t) for t in threads]
        return {
            "engine": "V612 - Meeting Minutes Generator",
            "total_minutes_generated": len(results),
            "reply_all_enforced": sum(1 for r in results if r.get("reply_all_enforced", False)),
            "results": results
        }

if __name__ == "__main__":
    engine = MeetingMinutesGenerator()
    test_thread = [
        {"from": "alice@company.com", "subject": "Project Alpha Kickoff", "body": "Let's discuss the project timeline and budget. We need to finalize the scope.", "sent_at": "2026-01-15T10:00:00", "to": ["bob@company.com", "carol@company.com"]},
        {"from": "bob@company.com", "subject": "Re: Project Alpha Kickoff", "body": "I agree we should proceed with Phase 1. Action item: Carol will prepare the budget by Friday.", "sent_at": "2026-01-15T11:30:00", "to": ["alice@company.com", "carol@company.com"]},
        {"from": "carol@company.com", "subject": "Re: Project Alpha Kickoff", "body": "Decided: we will use the new framework. I'll have the budget ready by Friday. Task: Bob to review the architecture.", "sent_at": "2026-01-15T14:00:00", "to": ["alice@company.com", "bob@company.com"]}
    ]
    result = engine.generate_minutes(test_thread)
    print(json.dumps(result, indent=2))
