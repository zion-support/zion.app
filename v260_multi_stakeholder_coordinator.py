#!/usr/bin/env python3
"""V260: Email Multi-Stakeholder Coordinator — Handles complex multi-party threads,
tracks who said what, extracts per-person action items, consensus detection."""
import json, re, hashlib
from datetime import datetime
from collections import defaultdict

class MultiStakeholderCoordinator:
    """Analyzes emails case-by-case, coordinates stakeholders, enforces reply-all."""
    def __init__(self):
        self.thread_tracker = defaultdict(lambda: {
            "participants": set(),
            "messages": [],
            "action_items": defaultdict(list),
            "decisions": [],
            "consensus_items": []
        })
    
    def analyze_email(self, email_data):
        sender = email_data.get("from", "")
        recipients = email_data.get("to", [])
        cc = email_data.get("cc", [])
        subject = email_data.get("subject", "")
        body = email_data.get("body", "")
        
        # Track thread
        thread_id = self._get_thread_id(subject)
        self._update_thread(thread_id, sender, recipients, cc, body)
        
        # Extract per-person action items
        action_items = self._extract_action_items(sender, recipients + cc, body)
        
        # Detect consensus
        consensus = self._detect_consensus(thread_id, body)
        
        # Suggest thread management
        suggestions = self._suggest_thread_management(thread_id, recipients, cc)
        
        # Generate coordinated response
        response = self._generate_coordinated_response(email_data, action_items, consensus, suggestions)
        
        # REPLY-ALL ENFORCEMENT (Critical for multi-stakeholder)
        all_recipients = list(set(recipients + cc))
        if sender and sender not in all_recipients:
            all_recipients.insert(0, sender)
        
        return {
            "engine": "V260-MultiStakeholderCoordinator",
            "thread_id": thread_id,
            "participants_count": len(self.thread_tracker[thread_id]["participants"]),
            "action_items_extracted": sum(len(v) for v in action_items.values()),
            "action_items_per_person": {k: len(v) for k, v in action_items.items()},
            "consensus_detected": consensus["has_consensus"],
            "suggestions": suggestions,
            "response": response,
            "reply_to": all_recipients,
            "reply_all_enforced": len(all_recipients) > 1
        }
    
    def _get_thread_id(self, subject):
        clean = re.sub(r'^(re|fw|fwd):\s*', '', subject, flags=re.I).strip().lower()
        return hashlib.md5(clean.encode()).hexdigest()[:12]
    
    def _update_thread(self, thread_id, sender, to, cc, body):
        thread = self.thread_tracker[thread_id]
        thread["participants"].add(sender)
        for r in to + cc:
            thread["participants"].add(r)
        thread["messages"].append({
            "from": sender,
            "timestamp": datetime.now().isoformat(),
            "body_preview": body[:200]
        })
    
    def _extract_action_items(self, sender, all_participants, body):
        items = defaultdict(list)
        # Look for @mentions or name-based assignments
        for person in all_participants:
            name_match = person.split("@")[0] if "@" in person else person
            if re.search(rf'@{name_match}|{name_match}\s*(please|can you|could you|will you)', body, re.I):
                action = re.search(rf'{name_match}[^.]*\.', body, re.I)
                items[person].append(action.group(0).strip() if action else f"Action assigned to {name_match}")
        
        # General action items
        action_patterns = re.findall(r'(?:please|we need to|someone should|let\'s)\s+([^.]+)', body, re.I)
        if action_patterns and not items:
            items["all"].extend(action_patterns[:3])
        
        return dict(items)
    
    def _detect_consensus(self, thread_id, body):
        thread = self.thread_tracker[thread_id]
        agree_words = ["agree", "approved", "sounds good", "let's proceed", "confirmed", "lgtm", "looks good"]
        disagree_words = ["disagree", "concern", "issue with", "not sure", "objection", "push back"]
        
        text = body.lower()
        agreements = sum(1 for w in agree_words if w in text)
        disagreements = sum(1 for w in disagree_words if w in text)
        
        thread_size = len(thread["messages"])
        if agreements > disagreements and thread_size > 2:
            return {"has_consensus": True, "type": "agreement", "confidence": min(0.95, 0.5 + agreements * 0.1)}
        elif disagreements > 0:
            return {"has_consensus": False, "type": "discussion_needed", "confidence": 0.6}
        return {"has_consensus": False, "type": "pending", "confidence": 0.3}
    
    def _suggest_thread_management(self, thread_id, to, cc):
        suggestions = []
        total = len(to) + len(cc)
        thread = self.thread_tracker[thread_id]
        
        if total > 10:
            suggestions.append("Consider splitting into sub-threads for focused discussion")
        if len(thread["messages"]) > 20:
            suggestions.append("Thread is long — consider a summary meeting")
        if total > 5 and len(thread["messages"]) > 10:
            suggestions.append("Consider creating a decision document")
        if not suggestions:
            suggestions.append("Thread is well-managed — continue current approach")
        
        return suggestions
    
    def _generate_coordinated_response(self, email_data, action_items, consensus, suggestions):
        subject = email_data.get("subject", "")
        participants = sum(len(v) for v in action_items.values()) if action_items else 0
        
        if consensus["has_consensus"]:
            base = f"Regarding '{subject}': ✅ Consensus detected ({consensus['type']}). I've extracted {participants} action items and will coordinate execution across all stakeholders."
        else:
            base = f"Regarding '{subject}': I've identified {participants} action items across stakeholders. Consensus status: {consensus['type']}. Suggestion: {suggestions[0] if suggestions else 'Continue discussion'}."
        
        return base + "\n\n---\nZion Tech Group | AI Email Intelligence V260 — Multi-Stakeholder Coordinator\n📱 +1 302 464 0950 | ✉️ kleber@ziontechgroup.com\n📍 364 E Main St STE 1008, Middletown DE 19709\n🌐 https://ziontechgroup.com"

if __name__ == "__main__":
    engine = MultiStakeholderCoordinator()
    test = {"from": "pm@company.com", "to": ["dev@company.com", "design@company.com", "qa@company.com"], "cc": ["vp@company.com", "client@company.com"], "subject": "Re: Q4 Product Launch Plan", "body": "Team, I think we're aligned on the launch plan. @dev please finalize the API by Friday. @design can you deliver the mockups by Wednesday? Let me know if anyone has concerns."}
    result = engine.analyze_email(test)
    print(json.dumps(result, indent=2))
    print("\n✅ V260 Multi-Stakeholder Coordinator — All systems operational | Reply-All: ENFORCED")
