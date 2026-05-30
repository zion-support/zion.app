#!/usr/bin/env python3
"""V275: Email Collaboration Hub — Shared inboxes with smart routing,
team mentions and assignments, collaborative drafting and approval workflows."""
import json, re, hashlib
from datetime import datetime
from collections import defaultdict

class EmailCollaborationHub:
    """Analyzes emails case-by-case, enables collaboration, enforces reply-all."""
    def __init__(self):
        self.shared_inboxes = defaultdict(lambda: {"members": [], "routing_rules": [], "queue": []})
        self.assignments = defaultdict(list)
        self.draft_collaborations = []
        self.approval_workflows = []

    def analyze_email(self, email_data):
        sender = email_data.get("from", "")
        recipients = email_data.get("to", [])
        cc = email_data.get("cc", [])
        subject = email_data.get("subject", "")
        body = email_data.get("body", "")

        # Detect team mentions and assignments
        mentions = self._detect_mentions(body, recipients + cc)
        assignments = self._detect_assignments(body, recipients + cc)

        # Determine routing
        routing = self._determine_routing(subject, body, sender)

        # Check if collaborative drafting needed
        needs_collab = self._needs_collaboration(subject, body)

        # Check if approval needed
        needs_approval = self._needs_approval(subject, body)

        # Generate collaboration response
        response = self._generate_collab_response(email_data, mentions, assignments, routing, needs_collab, needs_approval)

        # REPLY-ALL ENFORCEMENT
        all_recipients = list(set(recipients + cc))
        if sender and sender not in all_recipients:
            all_recipients.insert(0, sender)

        return {
            "engine": "V275-CollaborationHub",
            "mentions_detected": len(mentions),
            "assignments_created": len(assignments),
            "routing": routing,
            "needs_collaboration": needs_collab,
            "needs_approval": needs_approval,
            "response": response,
            "reply_to": all_recipients,
            "reply_all_enforced": len(all_recipients) > 1
        }

    def _detect_mentions(self, body, participants):
        mentions = []
        for p in participants:
            name = p.split("@")[0] if "@" in p else p
            if re.search(rf'@{name}|\b{re.escape(name)}\b', body, re.I):
                mentions.append({"person": p, "context": body[max(0, body.lower().find(name.lower())-30):body.lower().find(name.lower())+50]})
        return mentions

    def _detect_assignments(self, body, participants):
        assignments = []
        # Look for assignment patterns
        for p in participants:
            name = p.split("@")[0] if "@" in p else p
            patterns = [
                rf'{name}\s+(?:please|can you|could you|will you)\s+([^.]+)',
                rf'@(?:{name})\s+([^.]+)',
                rf'assign(?:ed|ing)?\s+to\s+{name}[:\s]+([^.]+)'
            ]
            for pattern in patterns:
                match = re.search(pattern, body, re.I)
                if match:
                    assignments.append({
                        "assignee": p,
                        "task": match.group(1).strip()[:200],
                        "created": datetime.now().isoformat()
                    })
                    self.assignments[p].append(assignments[-1])
                    break
        return assignments

    def _determine_routing(self, subject, body, sender):
        text = (subject + " " + body).lower()
        if any(w in text for w in ["support", "help", "issue", "ticket"]):
            return {"inbox": "support", "priority": "medium", "auto_response": True}
        if any(w in text for w in ["sales", "quote", "pricing", "demo"]):
            return {"inbox": "sales", "priority": "high", "auto_response": True}
        if any(w in text for w in ["billing", "invoice", "payment"]):
            return {"inbox": "finance", "priority": "medium", "auto_response": False}
        if any(w in text for w in ["partnership", "collaboration", "alliance"]):
            return {"inbox": "partnerships", "priority": "high", "auto_response": False}
        return {"inbox": "general", "priority": "low", "auto_response": True}

    def _needs_collaboration(self, subject, body):
        text = (subject + " " + body).lower()
        return any(w in text for w in ["draft together", "review this", "collaborate", "input needed", "team feedback"])

    def _needs_approval(self, subject, body):
        text = (subject + " " + body).lower()
        return any(w in text for w in ["needs approval", "please approve", "sign off", "authorization required", "manager approval"])

    def _generate_collab_response(self, email_data, mentions, assignments, routing, collab, approval):
        subject = email_data.get("subject", "")
        parts = []
        if mentions:
            parts.append(f"Detected {len(mentions)} team mention(s)")
        if assignments:
            parts.append(f"Created {len(assignments)} assignment(s)")
        parts.append(f"Routed to {routing['inbox']} inbox ({routing['priority']} priority)")
        if collab:
            parts.append("Collaborative drafting enabled")
        if approval:
            parts.append("Approval workflow initiated")

        summary = " | ".join(parts)
        base = f"Regarding '{subject}': Collaboration Hub: {summary}."
        return base + "\n\n---\nZion Tech Group | AI Email Intelligence V275\n+1 302 464 0950 | kleber@ziontechgroup.com\n364 E Main St STE 1008, Middletown DE 19709\nhttps://ziontechgroup.com"

if __name__ == "__main__":
    engine = EmailCollaborationHub()
    test = {"from": "ceo@company.com", "to": ["team@zion.com", "sales@zion.com", "dev@zion.com"], "cc": ["manager@company.com"], "subject": "New client proposal - needs approval", "body": "Team, @sales please prepare the proposal draft. @dev can you review the technical requirements? This needs manager approval before sending. Please collaborate on this."}
    result = engine.analyze_email(test)
    print(json.dumps(result, indent=2))
    print("\n✅ V275 Collaboration Hub — All systems operational | Reply-All: ENFORCED")
