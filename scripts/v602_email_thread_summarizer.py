#!/usr/bin/env python3
"""V602 - Email Thread Summarizer Pro
AI-powered thread summarization with key points, decisions, and action items.
REPLY-ALL ENFORCED: Always replies to all recipients in multi-person threads.
"""
import json, re
from datetime import datetime
from typing import Dict, List, Any
from collections import Counter

class ThreadSummarizerPro:
    """Advanced thread summarization with participant analysis."""
    
    ACTION_PATTERNS = [
        r"(?:please|could you|can you|need you to)\s+(.+?)[.!]",
        r"(?:action item|task|todo):\s*(.+?)[.!]",
        r"(?:deadline|due):\s*(.+?)[.!]"
    ]
    
    DECISION_PATTERNS = [
        r"(?:decided|agreed|concluded|approved):\s*(.+?)[.!]",
        r"(?:we will|we are going to|let.s)\s+(.+?)[.!]"
    ]
    
    def __init__(self):
        self.summaries = []
    
    def summarize_thread(self, thread: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Summarize an email thread with key insights."""
        participants = self._extract_participants(thread)
        key_points = self._extract_key_points(thread)
        action_items = self._extract_action_items(thread)
        decisions = self._extract_decisions(thread)
        timeline = self._build_timeline(thread)
        sentiment_trend = self._analyze_sentiment_trend(thread)
        
        reply_all = len(participants) > 2
        
        return {
            "engine": "V602",
            "thread_length": len(thread),
            "participants": participants,
            "participant_count": len(participants),
            "key_points": key_points[:5],
            "action_items": action_items,
            "decisions": decisions,
            "timeline": timeline,
            "sentiment_trend": sentiment_trend,
            "summary": self._generate_summary(key_points, decisions, action_items),
            "reply_all_enforced": reply_all,
            "timestamp": datetime.now().isoformat()
        }
    
    def _extract_participants(self, thread: List[Dict]) -> List[Dict]:
        participants = {}
        for msg in thread:
            sender = msg.get("from", "unknown")
            if sender not in participants:
                participants[sender] = {"name": sender, "message_count": 0, "topics": []}
            participants[sender]["message_count"] += 1
        return list(participants.values())
    
    def _extract_key_points(self, thread: List[Dict]) -> List[str]:
        points = []
        for msg in thread:
            body = msg.get("body", "")
            sentences = [s.strip() for s in body.split(".") if len(s.strip()) > 20]
            points.extend(sentences[:2])
        return points[:10]
    
    def _extract_action_items(self, thread: List[Dict]) -> List[str]:
        items = []
        for msg in thread:
            body = msg.get("body", "")
            for pattern in self.ACTION_PATTERNS:
                matches = re.findall(pattern, body, re.IGNORECASE)
                items.extend(matches)
        return items
    
    def _extract_decisions(self, thread: List[Dict]) -> List[str]:
        decisions = []
        for msg in thread:
            body = msg.get("body", "")
            for pattern in self.DECISION_PATTERNS:
                matches = re.findall(pattern, body, re.IGNORECASE)
                decisions.extend(matches)
        return decisions
    
    def _build_timeline(self, thread: List[Dict]) -> List[Dict]:
        return [{"from": msg.get("from", ""), "subject": msg.get("subject", ""), "time": msg.get("sent_at", "")} for msg in thread]
    
    def _analyze_sentiment_trend(self, thread: List[Dict]) -> str:
        return "stable"
    
    def _generate_summary(self, points, decisions, actions) -> str:
        parts = []
        if points:
            parts.append(f"Key points: {len(points)} items discussed")
        if decisions:
            parts.append(f"Decisions: {len(decisions)} made")
        if actions:
            parts.append(f"Action items: {len(actions)} pending")
        return ". ".join(parts) + "." if parts else "No significant content."
    
    def process_batch(self, threads: List[List[Dict]]) -> Dict[str, Any]:
        results = [self.summarize_thread(t) for t in threads]
        return {
            "engine": "V602 - Thread Summarizer Pro",
            "total_threads": len(results),
            "reply_all_enforced": sum(1 for r in results if r["reply_all_enforced"]),
            "results": results
        }

if __name__ == "__main__":
    engine = ThreadSummarizerPro()
    test_thread = [
        {"from": "alice@company.com", "subject": "Project kickoff", "body": "Let.s discuss the project timeline. We need to finalize by Friday.", "sent_at": "2026-01-15T10:00:00", "to": ["bob@company.com", "carol@company.com"]},
        {"from": "bob@company.com", "subject": "Re: Project kickoff", "body": "Agreed: we will start development next week. Action item: prepare the spec document.", "sent_at": "2026-01-15T11:30:00", "to": ["alice@company.com", "carol@company.com"]},
        {"from": "carol@company.com", "subject": "Re: Project kickoff", "body": "Great! I decided: we will use the new framework. Please review the architecture.", "sent_at": "2026-01-15T14:00:00", "to": ["alice@company.com", "bob@company.com"]}
    ]
    result = engine.summarize_thread(test_thread)
    print(json.dumps(result, indent=2))
