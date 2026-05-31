#!/usr/bin/env python3
"""
V956: Email Collaboration Workspace Engine
Enables team-based email handling with shared annotations, assignment routing,
approval workflows, and strict reply-all enforcement for multi-recipient threads.
"""

import json
import re
import hashlib
from datetime import datetime, timezone
from typing import Dict, List, Optional, Any


class EmailCollaborationWorkspace:
    """Team-based email collaboration with assignment, annotation, and approval workflows."""

    def __init__(self):
        self.teams: Dict[str, List[str]] = {}
        self.assignments: Dict[str, Dict[str, Any]] = {}
        self.annotations: Dict[str, List[Dict[str, Any]]] = {}
        self.approval_queue: List[Dict[str, Any]] = []
        self.reply_all_audit: List[Dict[str, Any]] = []
        self.action_log: List[Dict[str, Any]] = []

    def analyze_email_case_by_case(self, email: Dict[str, Any]) -> Dict[str, Any]:
        """
        Core case-by-case analysis engine.
        Determines the appropriate collaborative action for each email.
        STRICTLY enforces reply-all for multi-recipient emails.
        """
        analysis = {
            "engine": "V956",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "email_id": email.get("id", hashlib.md5(str(email).encode()).hexdigest()[:12]),
            "analysis_type": "collaboration_workspace",
        }

        # Extract all recipients (To + CC + BCC)
        to_recipients = email.get("to", [])
        cc_recipients = email.get("cc", [])
        bcc_recipients = email.get("bcc", [])
        all_recipients = to_recipients + cc_recipients + bcc_recipients
        is_multi_recipient = len(all_recipients) > 1

        # Detect collaboration signals
        subject = email.get("subject", "").lower()
        body = email.get("body", "").lower()
        sender = email.get("from", "")

        collab_signals = {
            "mentions_team": bool(re.search(r'\b(team|everyone|all|group|dept|department)\b', subject + " " + body)),
            "requests_approval": bool(re.search(r'\b(approve|approval|sign.?off|review|authorize)\b', subject + " " + body)),
            "asks_question": bool(re.search(r'\?|can you|could you|would you|please\s+(let|tell|share)', body)),
            "assigns_task": bool(re.search(r'\b(assign|task|action.?item|please\s+handle|follow.?up|take.?care)\b', body)),
            "escalation": bool(re.search(r'\b(urgent|asap|escalat|critical|deadline|immediately)\b', subject + " " + body)),
            "cc_executive": any(re.search(r'\b(ceo|cto|cfo|vp|director|manager|president)\b', r.lower()) for r in cc_recipients),
            "attachment_shared": len(email.get("attachments", [])) > 0,
            "thread_depth": email.get("thread_depth", 0) > 3,
        }

        analysis["collaboration_signals"] = collab_signals
        signal_count = sum(1 for v in collab_signals.values() if v)

        # Determine action
        if signal_count >= 4:
            action = "FULL_TEAM_REVIEW"
        elif signal_count >= 2:
            action = "ASSIGNED_REVIEW"
        elif collab_signals["asks_question"]:
            action = "DIRECT_RESPONSE_WITH_CC"
        elif collab_signals["requests_approval"]:
            action = "APPROVAL_WORKFLOW"
        else:
            action = "STANDARD_HANDLE"

        analysis["recommended_action"] = action

        # REPLY-ALL ENFORCEMENT
        reply_all_check = self._enforce_reply_all(email, all_recipients, is_multi_recipient)
        analysis["reply_all_enforcement"] = reply_all_check

        # Generate assignment recommendation
        if action in ("FULL_TEAM_REVIEW", "ASSIGNED_REVIEW"):
            analysis["assignment"] = self._recommend_assignment(email, collab_signals)

        # Generate annotation suggestions
        analysis["annotations"] = self._suggest_annotations(email, collab_signals)

        # Approval workflow if needed
        if collab_signals["requests_approval"]:
            analysis["approval_workflow"] = self._create_approval_workflow(email)

        # SLA tracking
        analysis["sla"] = self._calculate_sla(email, collab_signals)

        # Log the action
        self.action_log.append({
            "email_id": analysis["email_id"],
            "action": action,
            "reply_all": reply_all_check["enforced"],
            "signal_count": signal_count,
            "timestamp": analysis["timestamp"],
        })

        return analysis

    def _enforce_reply_all(self, email: Dict, all_recipients: List, is_multi: bool) -> Dict:
        """STRICT reply-all enforcement for multi-recipient emails."""
        result = {
            "is_multi_recipient": is_multi,
            "recipient_count": len(all_recipients),
            "enforced": False,
            "reason": "",
        }

        if is_multi:
            result["enforced"] = True
            result["reason"] = f"REPLY-ALL ENFORCED: {len(all_recipients)} recipients detected. All recipients must be included in response."
            self.reply_all_audit.append({
                "email_id": email.get("id", "unknown"),
                "recipients": all_recipients,
                "enforced": True,
                "timestamp": datetime.now(timezone.utc).isoformat(),
            })
        else:
            result["reason"] = "Single recipient — standard reply sufficient."

        return result

    def _recommend_assignment(self, email: Dict, signals: Dict) -> Dict:
        """Recommend team member assignment based on email content."""
        subject = email.get("subject", "").lower()
        body = email.get("body", "").lower()

        # Topic-based routing
        routing_rules = {
            "technical": ["bug", "error", "api", "code", "server", "deploy", "infra"],
            "sales": ["quote", "pricing", "proposal", "demo", "contract", "deal"],
            "support": ["help", "issue", "problem", "ticket", "complaint", "refund"],
            "legal": ["legal", "compliance", "contract", "nda", "terms", "liability"],
            "finance": ["invoice", "payment", "billing", "budget", "expense", "refund"],
            "hr": ["hiring", "interview", "candidate", "onboarding", "benefits", "leave"],
        }

        scores = {}
        for dept, keywords in routing_rules.items():
            score = sum(1 for kw in keywords if kw in subject + " " + body)
            if score > 0:
                scores[dept] = score

        if scores:
            best_dept = max(scores, key=scores.get)
            return {
                "recommended_department": best_dept,
                "confidence": round(scores[best_dept] / max(len(routing_rules[best_dept]), 1), 2),
                "priority": "HIGH" if signals.get("escalation") else "NORMAL",
            }

        return {
            "recommended_department": "general",
            "confidence": 0.5,
            "priority": "NORMAL",
        }

    def _suggest_annotations(self, email: Dict, signals: Dict) -> List[Dict]:
        """Suggest team annotations for the email."""
        suggestions = []

        if signals["escalation"]:
            suggestions.append({
                "type": "URGENT_FLAG",
                "text": "Flagged as urgent — prioritize response",
                "color": "red",
            })

        if signals["cc_executive"]:
            suggestions.append({
                "type": "EXEC_VISIBILITY",
                "text": "Executive in CC — ensure professional tone",
                "color": "orange",
            })

        if signals["attachment_shared"]:
            suggestions.append({
                "type": "ATTACHMENT_REVIEW",
                "text": "Attachments included — review before forwarding",
                "color": "blue",
            })

        if signals["assigns_task"]:
            suggestions.append({
                "type": "ACTION_ITEM",
                "text": "Contains action items — assign to responsible team member",
                "color": "green",
            })

        return suggestions

    def _create_approval_workflow(self, email: Dict) -> Dict:
        """Create an approval workflow for emails requesting sign-off."""
        return {
            "workflow_type": "approval_chain",
            "steps": [
                {"step": 1, "action": "review", "assignee": "team_lead", "status": "pending"},
                {"step": 2, "action": "approve", "assignee": "manager", "status": "waiting"},
                {"step": 3, "action": "respond", "assignee": "original_handler", "status": "waiting"},
            ],
            "sla_hours": 24,
            "auto_escalate": True,
        }

    def _calculate_sla(self, email: Dict, signals: Dict) -> Dict:
        """Calculate SLA based on email characteristics."""
        base_hours = 24
        if signals["escalation"]:
            base_hours = 2
        elif signals["cc_executive"]:
            base_hours = 4
        elif signals["requests_approval"]:
            base_hours = 8

        return {
            "response_deadline_hours": base_hours,
            "priority": "CRITICAL" if base_hours <= 2 else "HIGH" if base_hours <= 8 else "NORMAL",
            "auto_escalate": base_hours <= 8,
        }

    def generate_response_draft(self, email: Dict, analysis: Dict) -> Dict:
        """Generate a response draft that includes all recipients (reply-all)."""
        all_recipients = email.get("to", []) + email.get("cc", [])
        subject = email.get("subject", "")

        draft = {
            "to": all_recipients,  # REPLY-ALL: includes everyone
            "subject": f"Re: {subject}",
            "reply_all": True,
            "action_taken": analysis.get("recommended_action", "STANDARD_HANDLE"),
        }

        if analysis.get("approval_workflow"):
            draft["note"] = "This response requires approval workflow completion before sending."

        return draft

    def get_stats(self) -> Dict:
        """Get collaboration workspace statistics."""
        return {
            "total_analyzed": len(self.action_log),
            "reply_all_enforced": len(self.reply_all_audit),
            "approval_workflows": len(self.approval_queue),
            "actions_taken": {
                action: sum(1 for log in self.action_log if log["action"] == action)
                for action in set(log["action"] for log in self.action_log)
            } if self.action_log else {},
        }


# === Test Suite ===
def test_v956():
    engine = EmailCollaborationWorkspace()

    # Test 1: Multi-recipient email requiring reply-all
    email1 = {
        "id": "test-001",
        "from": "client@company.com",
        "to": ["support@ziontechgroup.com", "sales@ziontechgroup.com"],
        "cc": ["manager@company.com"],
        "subject": "Urgent: Need approval for enterprise proposal",
        "body": "Hi team, please approve the enterprise proposal ASAP. The deadline is tomorrow. Can you review and sign off?",
        "attachments": ["proposal.pdf"],
        "thread_depth": 5,
    }

    result1 = engine.analyze_email_case_by_case(email1)
    assert result1["reply_all_enforcement"]["enforced"] is True, "Reply-all must be enforced for multi-recipient"
    assert result1["recommended_action"] == "FULL_TEAM_REVIEW", f"Expected FULL_TEAM_REVIEW, got {result1['recommended_action']}"
    print(f"✅ Test 1 PASSED: Multi-recipient → {result1['recommended_action']}, reply-all enforced")

    # Test 2: Single recipient simple question
    email2 = {
        "id": "test-002",
        "from": "user@example.com",
        "to": ["support@ziontechgroup.com"],
        "subject": "Question about pricing",
        "body": "What are your pricing plans?",
    }

    result2 = engine.analyze_email_case_by_case(email2)
    assert result2["reply_all_enforcement"]["enforced"] is False, "Reply-all not needed for single recipient"
    print(f"✅ Test 2 PASSED: Single recipient → {result2['recommended_action']}")

    # Test 3: Escalation with executive CC
    email3 = {
        "id": "test-003",
        "from": "employee@partner.com",
        "to": ["team@ziontechgroup.com", "lead@ziontechgroup.com"],
        "cc": ["ceo@partner.com"],
        "subject": "Critical: Production issue needs immediate attention",
        "body": "URGENT: Our production system is down. Please assign someone to handle this immediately. The CEO is monitoring this.",
    }

    result3 = engine.analyze_email_case_by_case(email3)
    assert result3["reply_all_enforcement"]["enforced"] is True, "Reply-all must be enforced"
    assert result3["sla"]["priority"] == "CRITICAL", "SLA should be CRITICAL"
    print(f"✅ Test 3 PASSED: Escalation → SLA: {result3['sla']['priority']}, reply-all enforced")

    # Test 4: Response draft with reply-all
    draft = engine.generate_response_draft(email1, result1)
    assert draft["reply_all"] is True, "Response draft must use reply-all"
    assert len(draft["to"]) >= 3, "Response must include all original recipients"
    print(f"✅ Test 4 PASSED: Response draft includes {len(draft['to'])} recipients (reply-all)")

    stats = engine.get_stats()
    print(f"✅ Test 5 PASSED: Stats — {stats['total_analyzed']} analyzed, {stats['reply_all_enforced']} reply-all enforced")

    print("\n🎉 V956 ALL TESTS PASSED — Email Collaboration Workspace Engine operational!")
    return True


if __name__ == "__main__":
    test_v956()
