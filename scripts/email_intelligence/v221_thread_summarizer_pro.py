#!/usr/bin/env python3
"""V221 - AI Email Thread Summarizer Pro
Generate executive summaries of long email threads with key decisions,
action items, open questions, and sentiment overview.
Always enforces reply-all for multi-recipient emails.
"""
import json, re, datetime
from dataclasses import dataclass, field
from typing import List, Dict, Optional

@dataclass
class ThreadSummary:
    thread_id: str
    executive_summary: str
    key_decisions: List[str]
    action_items: List[Dict]
    open_questions: List[str]
    sentiment_overview: str
    participants: List[str]
    message_count: int
    date_range: str
    priority_level: str
    reply_all_required: bool

class ThreadSummarizer:
    def __init__(self):
        self.decision_patterns = [
            r"(?:we(?:'ve| have)?) (?:decided|agreed|chosen|approved)\s+(.{10,200}?)(?:\.|$)",
            r"(?:the decision|final call) (?:is|was)\s+(.{10,200}?)(?:\.|$)",
        ]
        self.action_patterns = [
            r"(?:please|kindly|can you|could you)\s+(.{10,200}?)(?:\.|$)",
            r"(?:action item|todo|task)[:\s]+(.{10,200}?)(?:\.|$)",
            r"(?:i'?ll|i will|we'?ll)\s+(.{10,200}?)(?:\.|$)",
        ]
        self.question_patterns = [
            r"([^?]*\?)",
            r"(?:what|when|where|how|why|who)\s+([^?]+\?)",
        ]
    
    def summarize(self, thread_id: str, messages: List[Dict],
                  recipients: List[str] = None) -> ThreadSummary:
        decisions, actions, questions = [], [], []
        participants = set()
        positive_count, negative_count = 0, 0
        
        positive_words = {"great", "excellent", "thanks", "appreciate", "agreed", "approved", "perfect"}
        negative_words = {"concern", "issue", "problem", "delayed", "disappointed", "urgent", "frustrated"}
        
        for msg in messages:
            body = msg.get("body", "")
            sender = msg.get("from", "")
            participants.add(sender)
            
            for p in self.decision_patterns:
                for m in re.findall(p, body, re.IGNORECASE):
                    decisions.append(m.strip()[:150])
            
            for p in self.action_patterns:
                for m in re.findall(p, body, re.IGNORECASE):
                    actions.append({"task": m.strip()[:150], "assignee": sender})
            
            for m in re.findall(r'[^.!?]*\?', body):
                if len(m.strip()) > 10:
                    questions.append(m.strip()[:150])
            
            body_lower = body.lower()
            positive_count += sum(1 for w in positive_words if w in body_lower)
            negative_count += sum(1 for w in negative_words if w in body_lower)
        
        total_sentiment = positive_count + negative_count + 1
        sentiment_ratio = (positive_count - negative_count) / total_sentiment
        if sentiment_ratio > 0.2: sentiment_overview = "Positive - collaborative and productive"
        elif sentiment_ratio < -0.2: sentiment_overview = "Concerning - frustration and issues detected"
        else: sentiment_overview = "Neutral - standard business communication"
        
        priority = "high" if any(w in " ".join(m.get("subject", "").lower() for m in messages) for w in ["urgent", "critical", "asap"]) else "normal"
        
        timestamps = [m.get("timestamp", "") for m in messages if m.get("timestamp")]
        date_range = f"{timestamps[0][:10]} to {timestamps[-1][:10]}" if timestamps else "Unknown"
        
        exec_summary = f"Thread with {len(messages)} messages across {len(participants)} participants. "
        exec_summary += f"{len(decisions)} decision(s) made, {len(actions)} action item(s), {len(questions)} open question(s). "
        exec_summary += f"Overall sentiment: {sentiment_overview.lower()}."
        
        return ThreadSummary(
            thread_id=thread_id, executive_summary=exec_summary,
            key_decisions=decisions[:5], action_items=actions[:10],
            open_questions=questions[:5], sentiment_overview=sentiment_overview,
            participants=list(participants), message_count=len(messages),
            date_range=date_range, priority_level=priority,
            reply_all_required=len(recipients or []) > 1
        )
    
    def generate_report(self, summary: ThreadSummary) -> Dict:
        return {
            "thread_id": summary.thread_id,
            "executive_summary": summary.executive_summary,
            "key_decisions": summary.key_decisions,
            "action_items": summary.action_items,
            "open_questions": summary.open_questions,
            "sentiment_overview": summary.sentiment_overview,
            "participants": summary.participants,
            "message_count": summary.message_count,
            "date_range": summary.date_range,
            "priority_level": summary.priority_level,
            "reply_all_enforced": summary.reply_all_required,
            "timestamp": datetime.datetime.now().isoformat()
        }

if __name__ == "__main__":
    summarizer = ThreadSummarizer()
    sample = [
        {"from": "pm@zion.com", "subject": "Project Alpha Kickoff", "timestamp": "2026-05-20T09:00:00",
         "body": "Great news! We've decided to proceed with the microservices architecture. Please prepare the technical design doc by Friday."},
        {"from": "dev@zion.com", "timestamp": "2026-05-21T14:00:00",
         "body": "Sounds great! I'll start on the API gateway design. What database should we use for the user service?"},
        {"from": "pm@zion.com", "timestamp": "2026-05-22T10:00:00",
         "body": "Let's go with PostgreSQL. I've approved the budget for AWS. Can you also set up the CI/CD pipeline?"},
    ]
    result = summarizer.summarize("thread-sum-001", sample, ["pm@zion.com", "dev@zion.com", "cto@zion.com"])
    print(json.dumps(summarizer.generate_report(result), indent=2))
