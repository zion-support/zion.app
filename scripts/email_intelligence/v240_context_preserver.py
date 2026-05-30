#!/usr/bin/env python3
"""V240: Email Thread Context Preserver
Maintain context across long email chains with smart quoting and context windows.
CRITICAL: Enforces reply-all for multi-recipient emails.
"""
import json, re, datetime
from typing import Dict, List

class ThreadContextPreserver:
    MAX_CONTEXT_MESSAGES = 10
    MAX_QUOTE_LINES = 20
    
    def extract_context_window(self, messages: List[Dict], current_message_idx: int) -> Dict:
        start = max(0, current_message_idx - self.MAX_CONTEXT_MESSAGES)
        window = messages[start:current_message_idx + 1]
        
        context_summary = []
        participants = set()
        decisions = []
        action_items = []
        
        for msg in window:
            sender = msg.get("from", "")
            participants.add(sender)
            body = msg.get("body", "")
            
            for m in re.findall(r"(?:we(?:'ve| have)?) (?:decided|agreed)\s+(.{10,150}?)(?:\.|$)", body, re.IGNORECASE):
                decisions.append({"decision": m.strip(), "by": sender})
            
            for m in re.findall(r"(?:please|todo|action)\s+(.{10,150}?)(?:\.|$)", body, re.IGNORECASE):
                action_items.append({"task": m.strip(), "assigned": sender})
        
        return {
            "context_messages": len(window),
            "total_in_thread": len(messages),
            "participants": list(participants),
            "decisions": decisions[:5],
            "action_items": action_items[:5],
            "context_summary": f"Thread with {len(window)} recent messages, {len(participants)} participants"
        }
    
    def generate_smart_quote(self, previous_message: Dict, max_lines: int = None) -> str:
        max_lines = max_lines or self.MAX_QUOTE_LINES
        body = previous_message.get("body", "")
        sender = previous_message.get("from", "")
        timestamp = previous_message.get("timestamp", "")
        
        lines = body.split("\n")
        relevant_lines = []
        for line in lines:
            line = line.strip()
            if line and not line.startswith(">") and len(line) > 20:
                relevant_lines.append(line)
            if len(relevant_lines) >= max_lines:
                break
        
        quote = f"On {timestamp[:10]}, {sender} wrote:\n"
        for line in relevant_lines:
            quote += f"> {line}\n"
        
        return quote
    
    def process_thread(self, thread_id: str, messages: List[Dict],
                       recipients: List[str] = None) -> Dict:
        if not messages:
            return {"error": "No messages in thread"}
        
        current_idx = len(messages) - 1
        context = self.extract_context_window(messages, current_idx)
        
        previous_msg = messages[current_idx] if current_idx >= 0 else {}
        smart_quote = self.generate_smart_quote(previous_msg) if previous_msg else ""
        
        return {
            "thread_id": thread_id,
            "context": context,
            "smart_quote": smart_quote,
            "reply_all_required": len(recipients or []) > 1,
            "all_recipients": list(context["participants"]),
            "timestamp": datetime.datetime.now().isoformat()
        }

if __name__ == "__main__":
    preserver = ThreadContextPreserver()
    messages = [
        {"from": "pm@co.com", "timestamp": "2026-05-20T09:00:00", "body": "Let's discuss the new product launch timeline. We need to finalize by Friday."},
        {"from": "dev@co.com", "timestamp": "2026-05-20T10:00:00", "body": "We've decided to use the microservices approach. Please prepare the deployment plan."},
        {"from": "pm@co.com", "timestamp": "2026-05-20T11:00:00", "body": "Great. Todo: send the timeline by EOD. Also please review the budget proposal."},
        {"from": "ceo@co.com", "timestamp": "2026-05-20T14:00:00", "body": "I agree with the approach. Let's move forward with the launch on July 15."},
    ]
    print(json.dumps(preserver.process_thread("thread-001", messages, ["pm@co.com", "dev@co.com", "ceo@co.com"]), indent=2))
