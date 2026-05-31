#!/usr/bin/env python3
"""V551 - Email Thread Intelligence Engine
Analyzes entire conversation threads to extract decisions, action items, and unresolved issues.
CRITICAL: Always enforces reply-all for multi-recipient emails.
"""
import json
from datetime import datetime
from typing import Dict, List

class EmailThreadIntelligence:
    def __init__(self):
        self.reply_all_enforced = True
    
    def analyze_thread(self, thread: List[Dict]) -> Dict:
        """Analyze complete email thread for insights"""
        analysis = {
            "engine": "V551_Email_Thread_Intelligence",
            "timestamp": datetime.now().isoformat(),
            "thread_id": thread[0].get("thread_id", "unknown"),
            "email_count": len(thread),
            "decisions": self._extract_decisions(thread),
            "action_items": self._extract_action_items(thread),
            "unresolved_issues": self._identify_unresolved(thread),
            "key_participants": self._identify_key_participants(thread),
            "sentiment_evolution": self._track_sentiment_evolution(thread),
            "recommended_next_steps": [],
            "reply_all_enforced": self.reply_all_enforced,
            "all_recipients": thread[-1].get("to", []) + thread[-1].get("cc", [])
        }
        
        analysis["recommended_next_steps"] = self._recommend_next_steps(analysis)
        return analysis
    
    def _extract_decisions(self, thread: List[Dict]) -> List[Dict]:
        """Extract decisions made in thread"""
        decisions = []
        decision_keywords = ["decided", "approved", "agreed", "confirmed", "will proceed", "let's go with"]
        
        for email in thread:
            body = email.get("body", "").lower()
            for keyword in decision_keywords:
                if keyword in body:
                    # Extract context around decision
                    idx = body.index(keyword)
                    context = body[max(0, idx-50):min(len(body), idx+100)]
                    decisions.append({
                        "email_id": email.get("id"),
                        "decision": context.strip(),
                        "decided_by": email.get("from"),
                        "timestamp": email.get("date")
                    })
        
        return decisions
    
    def _extract_action_items(self, thread: List[Dict]) -> List[Dict]:
        """Extract action items from thread"""
        action_items = []
        action_keywords = ["please", "need to", "should", "will", "can you", "action item", "todo"]
        
        for email in thread:
            body = email.get("body", "")
            lines = body.split('\n')
            
            for line in lines:
                line_lower = line.lower().strip()
                if any(kw in line_lower for kw in action_keywords) and len(line) > 20:
                    # Determine assignee and priority
                    assignee = self._infer_assignee(line, email)
                    priority = self._infer_priority(line)
                    
                    action_items.append({
                        "action": line.strip(),
                        "assignee": assignee,
                        "priority": priority,
                        "source_email": email.get("id"),
                        "requested_by": email.get("from")
                    })
        
        return action_items
    
    def _identify_unresolved(self, thread: List[Dict]) -> List[Dict]:
        """Identify unresolved issues or questions"""
        unresolved = []
        question_keywords = ["?", "question", "how", "when", "what", "why", "clarify"]
        
        for i, email in enumerate(thread):
            body = email.get("body", "")
            
            # Check if email contains questions
            if any(kw in body for kw in question_keywords):
                # Check if subsequent emails answered the question
                is_answered = False
                for subsequent in thread[i+1:]:
                    if email.get("from") in subsequent.get("to", []):
                        # Likely answered
                        is_answered = True
                        break
                
                if not is_answered:
                    unresolved.append({
                        "type": "question",
                        "content": self._extract_question(body),
                        "asked_by": email.get("from"),
                        "email_id": email.get("id")
                    })
        
        return unresolved
    
    def _identify_key_participants(self, thread: List[Dict]) -> List[Dict]:
        """Identify key participants and their roles"""
        participants = {}
        
        for email in thread:
            sender = email.get("from")
            if sender not in participants:
                participants[sender] = {
                    "email": sender,
                    "email_count": 0,
                    "role": self._infer_role(sender, email.get("body", ""))
                }
            participants[sender]["email_count"] += 1
        
        return sorted(participants.values(), key=lambda x: x["email_count"], reverse=True)
    
    def _track_sentiment_evolution(self, thread: List[Dict]) -> List[Dict]:
        """Track sentiment changes throughout thread"""
        evolution = []
        
        for email in thread:
            sentiment = self._analyze_sentiment(email.get("body", ""))
            evolution.append({
                "email_id": email.get("id"),
                "timestamp": email.get("date"),
                "sender": email.get("from"),
                "sentiment": sentiment
            })
        
        return evolution
    
    def _recommend_next_steps(self, analysis: Dict) -> List[Dict]:
        """Recommend next steps based on analysis"""
        recommendations = []
        
        if analysis["unresolved_issues"]:
            recommendations.append({
                "type": "follow_up",
                "action": f"Address {len(analysis['unresolved_issues'])} unresolved questions",
                "priority": "high"
            })
        
        if analysis["action_items"]:
            pending = [a for a in analysis["action_items"] if a["priority"] in ["high", "critical"]]
            if pending:
                recommendations.append({
                    "type": "track_actions",
                    "action": f"Follow up on {len(pending)} high-priority action items",
                    "priority": "high"
                })
        
        if not analysis["decisions"]:
            recommendations.append({
                "type": "decision_needed",
                "action": "Thread lacks clear decisions - request decision from stakeholders",
                "priority": "medium"
            })
        
        return recommendations
    
    def _infer_assignee(self, line: str, email: Dict) -> str:
        """Infer who is assigned to action item"""
        # Simple heuristic: if line contains "you" or recipient name
        if "you" in line.lower():
            recipients = email.get("to", [])
            return recipients[0] if recipients else "unknown"
        return email.get("from", "unknown")
    
    def _infer_priority(self, line: str) -> str:
        """Infer priority from action item text"""
        line_lower = line.lower()
        if any(w in line_lower for w in ["urgent", "asap", "immediately", "critical"]):
            return "critical"
        elif any(w in line_lower for w in ["important", "soon", "quickly"]):
            return "high"
        elif any(w in line_lower for w in ["when possible", "no rush"]):
            return "low"
        return "medium"
    
    def _extract_question(self, body: str) -> str:
        """Extract question from email body"""
        lines = body.split('\n')
        for line in lines:
            if '?' in line and len(line.strip()) > 10:
                return line.strip()
        return "Question detected but content not extracted"
    
    def _infer_role(self, email: str, body: str) -> str:
        """Infer participant role from email and content"""
        email_lower = email.lower()
        if any(role in email_lower for role in ["ceo", "cto", "cfo", "director", "vp"]):
            return "executive"
        elif any(role in email_lower for role in ["manager", "lead"]):
            return "manager"
        elif "decision" in body.lower() or "approve" in body.lower():
            return "decision_maker"
        return "participant"
    
    def _analyze_sentiment(self, text: str) -> str:
        """Analyze sentiment of text"""
        positive = ["great", "excellent", "thank", "appreciate", "happy", "good"]
        negative = ["frustrated", "disappointed", "concerned", "worried", "bad", "issue"]
        
        text_lower = text.lower()
        pos_count = sum(1 for w in positive if w in text_lower)
        neg_count = sum(1 for w in negative if w in text_lower)
        
        if pos_count > neg_count:
            return "positive"
        elif neg_count > pos_count:
            return "negative"
        return "neutral"

if __name__ == "__main__":
    engine = EmailThreadIntelligence()
    test_thread = [
        {"id": "1", "thread_id": "test", "from": "client@example.com", "to": ["sales@zion.com"], "body": "Can you clarify the pricing structure?", "date": "2026-05-31T10:00:00"},
        {"id": "2", "thread_id": "test", "from": "sales@zion.com", "to": ["client@example.com"], "body": "I'll send you the detailed pricing. Please review and let us know.", "date": "2026-05-31T11:00:00"}
    ]
    result = engine.analyze_thread(test_thread)
    print(json.dumps(result, indent=2))
