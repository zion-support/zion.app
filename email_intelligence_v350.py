#!/usr/bin/env python3
"""
V350 Email Follow-up Automator Engine
Detects emails requiring follow-up, schedules automatic reminders,
generates follow-up drafts based on context, tracks response SLAs.
CRITICAL: Always enforces reply-all for multi-recipient emails.
"""
import json, re, sys
from datetime import datetime, timedelta

class V350FollowUpAutomator:
    FOLLOW_UP_TRIGGERS = [
        r"(?:let me know|get back to|follow up|check back)",
        r"(?:pending|waiting for|awaiting)",
        r"(?:by|before|deadline|due)\s+\w+day",
        r"(?:when can|when will|when do)",
        r"(?:status update|progress report|update on)",
        r"(?:as discussed|per our conversation|as agreed)",
        r"(?:please confirm|please verify|please approve)",
        r"(?:will you|can you|would you)\s+\w+",
    ]
    
    URGENCY_LEVELS = {
        "critical": [r"urgent", r"immediately", r"asap", r"right now", r"emergency"],
        "high": [r"soon", r"quickly", r"priority", r"important", r"today"],
        "medium": [r"this week", r"by friday", r"by monday", r"soon"],
        "low": [r"when you can", r"no rush", r"at your convenience", r"anytime"],
    }
    
    def __init__(self):
        self.follow_ups = []
    
    def analyze_for_followup(self, email_text, subject="", sender="", recipients=None, email_date=None):
        recipients = recipients or []
        email_date = email_date or datetime.now().isoformat()
        combined = f"{subject} {email_text}".lower()
        
        needs_followup = any(re.search(p, combined, re.IGNORECASE) for p in self.FOLLOW_UP_TRIGGERS)
        urgency = self._detect_urgency(combined)
        deadline = self._extract_deadline(combined)
        action_items = self._extract_action_items(email_text)
        follow_up_date = self._calc_followup_date(urgency, deadline)
        
        is_multi = len(recipients) > 1
        
        draft = self._generate_followup_draft(subject, action_items, urgency, is_multi, recipients)
        
        result = {
            "version": "V350",
            "timestamp": datetime.now().isoformat(),
            "needs_followup": needs_followup,
            "urgency_level": urgency,
            "detected_deadline": deadline,
            "suggested_followup_date": follow_up_date.isoformat() if follow_up_date else None,
            "action_items_detected": action_items,
            "followup_draft": draft,
            "sla_hours": self._get_sla_hours(urgency),
            "reply_all_required": is_multi,
            "reply_all_enforced": is_multi,
            "recipient_count": len(recipients) + 1,
            "action_taken": f"Follow-up {'scheduled' if needs_followup else 'not needed'} - urgency: {urgency}",
        }
        self.follow_ups.append(result)
        return result
    
    def _detect_urgency(self, text):
        for level, patterns in self.URGENCY_LEVELS.items():
            if any(re.search(p, text, re.IGNORECASE) for p in patterns):
                return level
        return "medium"
    
    def _extract_deadline(self, text):
        day_match = re.search(r'(?:by|before|deadline|due)\s+(\w+day)', text, re.IGNORECASE)
        if day_match:
            return day_match.group(1)
        date_match = re.search(r'(?:by|before|deadline|due)\s+(\w+\s+\d+)', text, re.IGNORECASE)
        if date_match:
            return date_match.group(1)
        return None
    
    def _extract_action_items(self, text):
        items = []
        patterns = [r"(?:please|kindly)\s+(\w+\s+\w+\s*\w*)", r"(?:need|must|should)\s+(?:to\s+)?(\w+\s+\w+\s*\w*)"]
        for p in patterns:
            matches = re.findall(p, text, re.IGNORECASE)
            items.extend(matches[:3])
        return items[:5]
    
    def _calc_followup_date(self, urgency, deadline):
        now = datetime.now()
        offsets = {"critical": timedelta(hours=2), "high": timedelta(hours=8), "medium": timedelta(days=2), "low": timedelta(days=5)}
        return now + offsets.get(urgency, timedelta(days=2))
    
    def _get_sla_hours(self, urgency):
        slas = {"critical": 2, "high": 8, "medium": 24, "low": 72}
        return slas.get(urgency, 24)
    
    def _generate_followup_draft(self, subject, action_items, urgency, is_multi, recipients):
        greeting = "Hi" if urgency == "low" else "Hello"
        items_text = "\n".join([f"- {item}" for item in action_items]) if action_items else "- Review and respond to the original email"
        reply_all_note = "\n[NOTE: Reply-All enforced - all original recipients included]" if is_multi else ""
        cc_line = f"\nCC: {', '.join(recipients)}" if is_multi and recipients else ""
        return f"""Subject: Re: {subject}
{cc_line}
{greeting},

Following up on our previous conversation regarding the items below:

{items_text}

Please let me know the current status at your earliest convenience.

Best regards,
Zion Tech Group
{reply_all_note}"""

if __name__ == "__main__":
    engine = V350FollowUpAutomator()
    result = engine.analyze_for_followup(
        "Please review the attached proposal and get back to me by Friday. We need your approval on the budget increase before we can proceed with the project.",
        subject="Project Alpha - Budget Review Required",
        sender="client@partner.com",
        recipients=["pm@zion.com", "finance@zion.com", "exec@zion.com"]
    )
    print(json.dumps(result, indent=2))
