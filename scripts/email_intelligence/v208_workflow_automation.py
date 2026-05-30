#!/usr/bin/env python3
"""V208 - AI Email Workflow Automation Engine
Detects repetitive email patterns and automatically creates workflow rules,
smart templates, auto-responses, and routing logic.
Learns from email history to optimize future communications.
Always enforces reply-all for multi-recipient emails.
"""
import json, re, datetime, hashlib
from dataclasses import dataclass, field
from typing import List, Dict, Optional, Tuple
from collections import defaultdict, Counter
from enum import Enum

class WorkflowType(Enum):
    AUTO_RESPOND = "auto_respond"
    ROUTE = "route"
    TEMPLATE = "template"
    ESCALATE = "escalate"
    SCHEDULE = "schedule"
    DIGEST = "digest"
    FOLLOW_UP = "follow_up"
    CATEGORIZE = "categorize"
    DELEGATE = "delegate"
    ARCHIVE = "archive"

class TriggerCondition(Enum):
    KEYWORD_MATCH = "keyword_match"
    SENDER_DOMAIN = "sender_domain"
    TIME_BASED = "time_based"
    THREAD_LENGTH = "thread_length"
    ATTACHMENT_TYPE = "attachment_type"
    PRIORITY_LEVEL = "priority_level"
    NO_RESPONSE = "no_response"
    SENTIMENT_THRESHOLD = "sentiment_threshold"

@dataclass
class WorkflowRule:
    rule_id: str
    name: str
    workflow_type: WorkflowType
    trigger: TriggerCondition
    trigger_value: str
    action: Dict
    enabled: bool = True
    hit_count: int = 0
    last_triggered: str = ""
    created_at: str = ""
    confidence: float = 0.0
    reply_all_enforced: bool = True

@dataclass
class SmartTemplate:
    template_id: str
    name: str
    subject_pattern: str
    body_template: str
    variables: List[str]
    usage_count: int = 0
    avg_rating: float = 0.0
    category: str = ""

@dataclass
class PatternInsight:
    pattern_type: str
    frequency: int
    description: str
    suggested_rule: Optional[WorkflowRule]
    confidence: float

class EmailPatternDetector:
    """Detect recurring email patterns."""
    
    PATTERN_CATEGORIES = {
        "inquiry": ["how much", "pricing", "quote", "estimate", "cost"],
        "support": ["help", "issue", "problem", "bug", "error", "not working"],
        "follow_up": ["checking in", "following up", "any update", "status", "progress"],
        "meeting": ["schedule", "meeting", "call", "available", "calendar"],
        "approval": ["approve", "sign off", "authorize", "review and approve"],
        "invoice": ["invoice", "payment", "billing", "receipt", "po number"],
        "onboarding": ["welcome", "onboarding", "getting started", "setup", "access"],
        "complaint": ["dissatisfied", "unhappy", "refund", "cancel", "escalate"],
    }
    
    def detect_patterns(self, emails: List[Dict]) -> List[PatternInsight]:
        pattern_counts = Counter()
        pattern_examples = defaultdict(list)
        
        for email in emails:
            body = email.get("body", "").lower()
            subject = email.get("subject", "").lower()
            combined = f"{subject} {body}"
            
            for category, keywords in self.PATTERN_CATEGORIES.items():
                if any(kw in combined for kw in keywords):
                    pattern_counts[category] += 1
                    if len(pattern_examples[category]) < 3:
                        pattern_examples[category].append(email)
        
        insights = []
        for pattern, count in pattern_counts.most_common():
            if count >= 2:
                insight = PatternInsight(
                    pattern_type=pattern,
                    frequency=count,
                    description=f"Detected {count} '{pattern}' emails",
                    suggested_rule=self._create_rule_for_pattern(pattern, pattern_examples[pattern]),
                    confidence=min(1.0, count / 10.0)
                )
                insights.append(insight)
        
        return insights
    
    def _create_rule_for_pattern(self, pattern: str, examples: List[Dict]) -> WorkflowRule:
        rule_templates = {
            "inquiry": WorkflowRule(
                rule_id=f"auto-inquiry-{hashlib.md5(pattern.encode()).hexdigest()[:8]}",
                name="Auto-Respond to Pricing Inquiries",
                workflow_type=WorkflowType.AUTO_RESPOND,
                trigger=TriggerCondition.KEYWORD_MATCH,
                trigger_value="pricing|quote|estimate|cost|how much",
                action={"template": "pricing_response", "attach": "rate_card.pdf"},
                confidence=0.85
            ),
            "support": WorkflowRule(
                rule_id=f"route-support-{hashlib.md5(pattern.encode()).hexdigest()[:8]}",
                name="Route Support Tickets to Help Desk",
                workflow_type=WorkflowType.ROUTE,
                trigger=TriggerCondition.KEYWORD_MATCH,
                trigger_value="help|issue|problem|bug|error|not working",
                action={"route_to": "support@ziontechgroup.com", "priority": "medium"},
                confidence=0.9
            ),
            "follow_up": WorkflowRule(
                rule_id=f"track-followup-{hashlib.md5(pattern.encode()).hexdigest()[:8]}",
                name="Track Follow-Up Requests",
                workflow_type=WorkflowType.FOLLOW_UP,
                trigger=TriggerCondition.KEYWORD_MATCH,
                trigger_value="following up|checking in|any update|status",
                action={"escalate_if_no_response": "48h", "notify": "manager"},
                confidence=0.8
            ),
            "meeting": WorkflowRule(
                rule_id=f"auto-meeting-{hashlib.md5(pattern.encode()).hexdigest()[:8]}",
                name="Auto-Suggest Meeting Times",
                workflow_type=WorkflowType.SCHEDULE,
                trigger=TriggerCondition.KEYWORD_MATCH,
                trigger_value="schedule|meeting|call|available|calendar",
                action={"suggest_times": True, "check_calendar": True},
                confidence=0.85
            ),
            "complaint": WorkflowRule(
                rule_id=f"escalate-complaint-{hashlib.md5(pattern.encode()).hexdigest()[:8]}",
                name="Escalate Complaints Immediately",
                workflow_type=WorkflowType.ESCALATE,
                trigger=TriggerCondition.KEYWORD_MATCH,
                trigger_value="dissatisfied|unhappy|refund|cancel|escalate",
                action={"escalate_to": "manager", "priority": "high", "sla": "2h"},
                confidence=0.95
            ),
        }
        
        return rule_templates.get(pattern, WorkflowRule(
            rule_id=f"generic-{pattern}",
            name=f"Auto-handle {pattern} emails",
            workflow_type=WorkflowType.CATEGORIZE,
            trigger=TriggerCondition.KEYWORD_MATCH,
            trigger_value="|".join(self.PATTERN_CATEGORIES.get(pattern, [])),
            action={"categorize": pattern},
            confidence=0.7
        ))

class SmartTemplateGenerator:
    """Generate smart email templates based on patterns."""
    
    def generate_templates(self, patterns: List[PatternInsight]) -> List[SmartTemplate]:
        templates = []
        
        template_defs = {
            "inquiry": {
                "name": "Pricing Inquiry Response",
                "subject": "Re: {{original_subject}} - Pricing Information",
                "body": "Dear {{sender_name}},\n\nThank you for your interest in {{product_interest}}.\n\n"
                       "I\'m pleased to share our pricing options:\n\n"
                       "• Basic: {{basic_price}}\n• Pro: {{pro_price}}\n• Enterprise: {{enterprise_price}}\n\n"
                       "I\'d love to schedule a quick call to discuss which option best fits your needs.\n"
                       "Are you available {{suggested_times}}?\n\n"
                       "Best regards,\n{{agent_name}}\nZion Tech Group\n+1 302 464 0950",
                "variables": ["sender_name", "product_interest", "basic_price",
                            "pro_price", "enterprise_price", "suggested_times", "agent_name"],
                "category": "sales"
            },
            "support": {
                "name": "Support Ticket Acknowledgment",
                "subject": "Re: {{original_subject}} - Ticket #{{ticket_id}}",
                "body": "Dear {{sender_name}},\n\nThank you for reaching out. We\'ve created "
                       "support ticket #{{ticket_id}} for your issue.\n\n"
                       "**Issue Summary:** {{issue_summary}}\n"
                       "**Priority:** {{priority}}\n"
                       "**Expected Response:** {{response_time}}\n\n"
                       "Our team is reviewing your case and will respond within {{sla_hours}} hours.\n\n"
                       "Best regards,\nZion Tech Group Support\n+1 302 464 0950",
                "variables": ["sender_name", "ticket_id", "issue_summary",
                            "priority", "response_time", "sla_hours"],
                "category": "support"
            },
            "follow_up": {
                "name": "Status Update Response",
                "subject": "Re: {{original_subject}} - Status Update",
                "body": "Dear {{sender_name}},\n\nThank you for following up. "
                       "Here\'s the latest update:\n\n"
                       "**Current Status:** {{status}}\n"
                       "**Progress:** {{progress_percentage}}%\n"
                       "**Next Milestone:** {{next_milestone}}\n"
                       "**Expected Completion:** {{completion_date}}\n\n"
                       "Please don\'t hesitate to reach out if you need anything else.\n\n"
                       "Best regards,\n{{agent_name}}",
                "variables": ["sender_name", "status", "progress_percentage",
                            "next_milestone", "completion_date", "agent_name"],
                "category": "project_management"
            },
            "onboarding": {
                "name": "Welcome & Onboarding Guide",
                "subject": "Welcome to Zion Tech Group - Getting Started Guide",
                "body": "Welcome {{sender_name}}! 🎉\n\n"
                       "We\'re excited to have you on board. Here\'s your getting started guide:\n\n"
                       "**Step 1:** {{step_1}}\n"
                       "**Step 2:** {{step_2}}\n"
                       "**Step 3:** {{step_3}}\n\n"
                       "**Your dedicated contact:** {{account_manager}}\n"
                       "**Support:** support@ziontechgroup.com | +1 302 464 0950\n\n"
                       "Let\'s schedule your kickoff call: {{calendar_link}}\n\n"
                       "Best regards,\nThe Zion Tech Group Team",
                "variables": ["sender_name", "step_1", "step_2", "step_3",
                            "account_manager", "calendar_link"],
                "category": "onboarding"
            },
        }
        
        for pattern in patterns:
            if pattern.pattern_type in template_defs:
                defn = template_defs[pattern.pattern_type]
                templates.append(SmartTemplate(
                    template_id=f"tmpl-{pattern.pattern_type}-{hashlib.md5(pattern.pattern_type.encode()).hexdigest()[:6]}",
                    name=defn["name"],
                    subject_pattern=defn["subject"],
                    body_template=defn["body"],
                    variables=defn["variables"],
                    category=defn["category"]
                ))
        
        return templates

class WorkflowAutomationEngine:
    """Main workflow automation engine."""
    
    def __init__(self):
        self.pattern_detector = EmailPatternDetector()
        self.template_generator = SmartTemplateGenerator()
        self.rules = []
        self.templates = []
        self.email_history = []
    
    def learn_from_history(self, emails: List[Dict]) -> Dict:
        self.email_history.extend(emails)
        patterns = self.pattern_detector.detect_patterns(emails)
        templates = self.template_generator.generate_templates(patterns)
        
        new_rules = [p.suggested_rule for p in patterns if p.suggested_rule]
        self.rules.extend(new_rules)
        self.templates.extend(templates)
        
        return {
            "emails_analyzed": len(emails),
            "patterns_detected": len(patterns),
            "rules_created": len(new_rules),
            "templates_generated": len(templates),
            "patterns": [{"type": p.pattern_type, "frequency": p.frequency,
                         "confidence": round(p.confidence, 2)} for p in patterns]
        }
    
    def process_email(self, email: Dict, recipients: List[str] = None) -> Dict:
        matched_rules = []
        body = email.get("body", "").lower()
        subject = email.get("subject", "").lower()
        combined = f"{subject} {body}"
        
        for rule in self.rules:
            if not rule.enabled:
                continue
            if rule.trigger == TriggerCondition.KEYWORD_MATCH:
                keywords = rule.trigger_value.split("|")
                if any(kw in combined for kw in keywords):
                    rule.hit_count += 1
                    rule.last_triggered = datetime.datetime.now().isoformat()
                    matched_rules.append(rule)
        
        reply_all = len(recipients or []) > 1
        
        return {
            "email_id": email.get("id", "unknown"),
            "matched_rules": [
                {"rule_id": r.rule_id, "name": r.name,
                 "type": r.workflow_type.value, "action": r.action}
                for r in matched_rules
            ],
            "reply_all_required": reply_all,
            "suggested_template": self._find_template(matched_rules),
            "timestamp": datetime.datetime.now().isoformat()
        }
    
    def _find_template(self, matched_rules: List[WorkflowRule]) -> Optional[str]:
        for rule in matched_rules:
            if rule.workflow_type == WorkflowType.AUTO_RESPOND:
                for tmpl in self.templates:
                    if tmpl.category in rule.name.lower():
                        return tmpl.template_id
        return None
    
    def generate_automation_report(self, learning: Dict) -> Dict:
        return {
            "automation_summary": learning,
            "active_rules": [
                {"rule_id": r.rule_id, "name": r.name,
                 "type": r.workflow_type.value, "enabled": r.enabled,
                 "hit_count": r.hit_count}
                for r in self.rules
            ],
            "available_templates": [
                {"template_id": t.template_id, "name": t.name,
                 "category": t.category, "variables": t.variables}
                for t in self.templates
            ],
            "reply_all_enforced": True,
            "timestamp": datetime.datetime.now().isoformat()
        }

if __name__ == "__main__":
    engine = WorkflowAutomationEngine()
    
    sample_emails = [
        {"id": "e1", "subject": "Pricing inquiry", "from": "lead@company.com",
         "body": "How much does your AI platform cost? Can you send a quote?"},
        {"id": "e2", "subject": "Help with integration", "from": "dev@startup.io",
         "body": "I\'m having an issue with the API integration. Getting 401 errors."},
        {"id": "e3", "subject": "Following up on proposal", "from": "pm@enterprise.com",
         "body": "Checking in on the proposal status. Any update?"},
        {"id": "e4", "subject": "Schedule a call", "from": "exec@bigcorp.com",
         "body": "Can we schedule a meeting to discuss the enterprise plan?"},
        {"id": "e5", "subject": "Pricing question", "from": "prospect@new.biz",
         "body": "What are your pricing tiers? Need a quote for 50 users."},
    ]
    
    learning = engine.learn_from_history(sample_emails)
    result = engine.process_email(sample_emails[0], ["lead@company.com", "sales@zion.com"])
    report = engine.generate_automation_report(learning)
    print(json.dumps(report, indent=2))
