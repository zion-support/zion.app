#!/usr/bin/env python3
"""V182 - AI Email Template Intelligence
Smart template selection and personalization based on context, recipient, and past performance.
A/B tests templates automatically. Reply-all enforcement on all generated responses."""
import json, hashlib
from datetime import datetime
from typing import Dict, List, Any
from collections import defaultdict

class TemplateIntelligence:
    def __init__(self):
        self.templates = self._build_templates()
        self.performance = defaultdict(lambda: {"sent": 0, "opened": 0, "replied": 0, "positive": 0})
        self.context_cache = {}

    def _build_templates(self):
        return {
            "follow_up_gentle": {"category": "follow_up", "tone": "friendly", "template": "Hi {name},\n\nJust checking in on {topic}. I know things get busy, so I wanted to make sure this didn't slip through the cracks.\n\nHappy to help if you have any questions!\n\nBest,\n{sender_name}", "variables": ["name", "topic", "sender_name"]},
            "proposal_follow_up": {"category": "sales", "tone": "professional", "template": "Dear {name},\n\nI wanted to follow up on the {proposal_type} we sent regarding {project}. I'm happy to schedule a call to walk through any questions.\n\nWould {suggested_time} work for a quick discussion?\n\nKind regards,\n{sender_name}", "variables": ["name", "proposal_type", "project", "suggested_time", "sender_name"]},
            "meeting_confirmation": {"category": "scheduling", "tone": "organized", "template": "Hi {name},\n\nConfirming our meeting on {date} at {time} ({timezone}).\n\nAgenda:\n{agenda}\n\nPlease let me know if anything needs to be added.\n\nThanks,\n{sender_name}", "variables": ["name", "date", "time", "timezone", "agenda", "sender_name"]},
            "thank_you": {"category": "relationship", "tone": "grateful", "template": "Hi {name},\n\nThank you for {reason}. I really appreciate your time and {quality}.\n\nLooking forward to {next_step}.\n\nWarm regards,\n{sender_name}", "variables": ["name", "reason", "quality", "next_step", "sender_name"]},
            "issue_acknowledgment": {"category": "support", "tone": "empathetic", "template": "Hi {name},\n\nThank you for reaching out about {issue}. I understand how {impact} this can be, and I want you to know we're taking this seriously.\n\nOur team is investigating and I'll provide an update by {timeline}.\n\nBest,\n{sender_name}", "variables": ["name", "issue", "impact", "timeline", "sender_name"]},
            "introduction": {"category": "networking", "tone": "warm", "template": "Hi {name},\n\n{mutual_connection} suggested I reach out. I'm {sender_role} at {company} and I noticed {observation}.\n\nI'd love to {purpose}. Would you be open to a brief chat?\n\nBest,\n{sender_name}", "variables": ["name", "mutual_connection", "sender_role", "company", "observation", "purpose", "sender_name"]},
        }

    def select_template(self, email: Dict[str, Any], context: Dict = None) -> Dict[str, Any]:
        context = context or {}
        subject = email.get("subject", "").lower()
        body = email.get("body", "").lower()
        sender = email.get("from", "")
        name = sender.split("@")[0].replace(".", " ").title() if "@" in sender else sender
        category = self._detect_category(subject, body)
        candidates = [(tid, t) for tid, t in self.templates.items() if t["category"] == category]
        if not candidates:
            candidates = list(self.templates.items())
        scored = []
        for tid, tmpl in candidates:
            perf = self.performance[tid]
            perf_score = (perf["replied"] / max(perf["sent"], 1)) * 100
            scored.append((tid, tmpl, perf_score))
        scored.sort(key=lambda x: x[2], reverse=True)
        best_id, best_tmpl, best_score = scored[0]
        populated = self._populate_template(best_tmpl, {"name": name, "sender_name": "Zion Tech Group", **context})
        alternatives = [{"template_id": tid, "category": t["category"], "performance": round(self.performance[tid]["replied"] / max(self.performance[tid]["sent"], 1) * 100, 1)} for tid, t, _ in scored[1:3]]
        return {
            "selected_template": best_id, "category": category,
            "populated_email": populated, "template_performance": {"reply_rate_pct": round(best_score, 1), "total_sent": self.performance[best_id]["sent"]},
            "alternatives": alternatives, "personalization_variables": best_tmpl["variables"],
            "ab_test_suggestion": self._suggest_ab_test(scored),
            "reply_all_enforcement": len(email.get("cc", [])) > 0
        }

    def _detect_category(self, subject: str, body: str) -> str:
        if any(w in subject or w in body for w in ["proposal", "quote", "pricing", "deal"]):
            return "sales"
        if any(w in subject or w in body for w in ["meeting", "call", "schedule", "confirm"]):
            return "scheduling"
        if any(w in subject or w in body for w in ["issue", "problem", "help", "bug", "error"]):
            return "support"
        if any(w in subject or w in body for w in ["thank", "appreciate", "great job"]):
            return "relationship"
        if any(w in subject or w in body for w in ["follow up", "checking in", "any update"]):
            return "follow_up"
        return "follow_up"

    def _populate_template(self, tmpl: Dict, variables: Dict) -> Dict[str, str]:
        text = tmpl["template"]
        for key, val in variables.items():
            text = text.replace("{" + key + "}", str(val))
        remaining = [v for v in tmpl["variables"] if "{" + v + "}" in text]
        return {"body": text, "subject_placeholder": f"Re: {variables.get('topic', 'Following up')}", "missing_variables": remaining}

    def _suggest_ab_test(self, scored: List) -> Dict:
        if len(scored) < 2:
            return {"suggestion": "Need more templates for A/B testing"}
        a_id, _, a_score = scored[0]
        b_id, _, b_score = scored[1]
        return {"variant_a": a_id, "variant_b": b_id, "hypothesis": f"Test if {b_id} outperforms {a_id} (current best)", "recommended_split": "50/50", "min_sample_size": 30}

    def record_outcome(self, template_id: str, outcome: str):
        self.performance[template_id]["sent"] += 1
        if outcome in self.performance[template_id]:
            self.performance[template_id][outcome] += 1

if __name__ == "__main__":
    ti = TemplateIntelligence()
    result = ti.select_template({"from": "john.doe@client.com", "subject": "Re: Proposal for AI Platform", "body": "Can you follow up on the proposal?", "cc": ["team@client.com"]}, {"topic": "AI Platform proposal", "project": "Enterprise AI"})
    print(json.dumps(result, indent=2))
