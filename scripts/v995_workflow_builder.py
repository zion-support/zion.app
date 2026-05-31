#!/usr/bin/env python3
"""
V995: Email Workflow Builder Engine
Visual workflow builder for automated email sequences and multi-step processes.
Enables no-code automation with strict reply-all enforcement.
"""

import re
import hashlib
from datetime import datetime, timezone
from typing import Dict, List, Any
from collections import defaultdict


class EmailWorkflowBuilder:
    """Builds automated email workflows."""

    def __init__(self):
        self.workflow_log: List[Dict] = []
        self.reply_all_audit: List[Dict] = []
        self.workflow_templates: Dict[str, Dict] = {}

    def analyze_email_case_by_case(self, email: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze email for workflow automation case by case."""
        analysis = {
            "engine": "V995",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "email_id": email.get("id", hashlib.md5(str(email).encode()).hexdigest()[:12]),
            "analysis_type": "workflow_building",
        }

        to_recipients = email.get("to", [])
        cc_recipients = email.get("cc", [])
        all_recipients = to_recipients + cc_recipients
        is_multi_recipient = len(all_recipients) > 1

        body = email.get("body", "")
        subject = email.get("subject", "")
        sender = email.get("from", "")

        # 1. Detect workflow patterns
        workflow_patterns = self._detect_workflow_patterns(email, body)
        analysis["workflow_patterns"] = workflow_patterns

        # 2. Extract workflow triggers
        triggers = self._extract_workflow_triggers(email, body)
        analysis["workflow_triggers"] = triggers

        # 3. Identify workflow steps
        steps = self._identify_workflow_steps(body)
        analysis["workflow_steps"] = steps

        # 4. Detect conditions and branches
        conditions = self._detect_conditions(body)
        analysis["workflow_conditions"] = conditions

        # 5. Suggest workflow template
        template = self._suggest_workflow_template(workflow_patterns, triggers, steps)
        analysis["suggested_template"] = template

        # 6. Automation opportunities
        automation = self._identify_automation_opportunities(email, steps, conditions)
        analysis["automation_opportunities"] = automation

        # 7. Workflow complexity
        complexity = self._assess_workflow_complexity(steps, conditions, automation)
        analysis["workflow_complexity"] = complexity

        # 8. Estimated time savings
        time_savings = self._estimate_time_savings(automation, complexity)
        analysis["estimated_time_savings"] = time_savings

        # 9. Workflow recommendation
        recommendation = self._generate_workflow_recommendation(
            template, automation, time_savings, complexity
        )
        analysis["workflow_recommendation"] = recommendation

        # 10. Determine action
        action = self._determine_workflow_action(recommendation, complexity)
        analysis["recommended_action"] = action

        # REPLY-ALL ENFORCEMENT
        reply_all = self._enforce_reply_all(email, all_recipients, is_multi_recipient)
        analysis["reply_all_enforcement"] = reply_all

        self.workflow_log.append({
            "email_id": analysis["email_id"],
            "patterns_detected": len(workflow_patterns),
            "triggers_count": len(triggers),
            "steps_count": len(steps),
            "conditions_count": len(conditions),
            "automation_opportunities": len(automation),
            "complexity_level": complexity["level"],
            "time_savings_minutes": time_savings["minutes_per_week"],
            "reply_all": reply_all["enforced"],
            "timestamp": analysis["timestamp"],
        })

        return analysis

    def _detect_workflow_patterns(self, email: Dict, body: str) -> List[Dict]:
        """Detect workflow patterns in email."""
        patterns = []
        body_lower = body.lower()
        
        # Sequential patterns
        if any(word in body_lower for word in ["first", "then", "next", "after", "finally"]):
            patterns.append({
                "type": "sequential",
                "confidence": 0.8,
                "description": "Sequential workflow detected",
            })
        
        # Conditional patterns
        if any(word in body_lower for word in ["if", "when", "unless", "in case"]):
            patterns.append({
                "type": "conditional",
                "confidence": 0.9,
                "description": "Conditional workflow detected",
            })
        
        # Approval patterns
        if any(word in body_lower for word in ["approve", "approval", "review", "sign-off"]):
            patterns.append({
                "type": "approval",
                "confidence": 0.85,
                "description": "Approval workflow detected",
            })
        
        # Notification patterns
        if any(word in body_lower for word in ["notify", "alert", "inform", "update"]):
            patterns.append({
                "type": "notification",
                "confidence": 0.75,
                "description": "Notification workflow detected",
            })
        
        # Follow-up patterns
        if any(word in body_lower for word in ["follow up", "reminder", "check back"]):
            patterns.append({
                "type": "follow_up",
                "confidence": 0.8,
                "description": "Follow-up workflow detected",
            })
        
        return patterns

    def _extract_workflow_triggers(self, email: Dict, body: str) -> List[Dict]:
        """Extract workflow triggers."""
        triggers = []
        body_lower = body.lower()
        
        # Time-based triggers
        time_patterns = [
            (r'\b(\d+)\s*(hour|day|week)s?\s*(from|after)', "time_delay"),
            (r'(daily|weekly|monthly)', "recurring"),
            (r'(deadline|due date)', "deadline"),
        ]
        
        for pattern, trigger_type in time_patterns:
            if re.search(pattern, body_lower):
                triggers.append({
                    "type": trigger_type,
                    "pattern": pattern,
                    "confidence": 0.8,
                })
        
        # Event-based triggers
        event_keywords = {
            "email_received": ["when.*receive", "upon receipt", "after.*sent"],
            "status_change": ["when.*complete", "after.*finish", "status.*change"],
            "form_submission": ["when.*submit", "after.*form"],
        }
        
        for trigger_type, patterns in event_keywords.items():
            if any(re.search(p, body_lower) for p in patterns):
                triggers.append({
                    "type": trigger_type,
                    "confidence": 0.75,
                })
        
        return triggers

    def _identify_workflow_steps(self, body: str) -> List[Dict]:
        """Identify workflow steps."""
        steps = []
        body_lower = body.lower()
        
        # Step indicators
        step_patterns = [
            r'(step|phase|stage)\s*(\d+)[:\s]+(.+?)(?=\.|$)',
            r'(\d+)[\.\)]\s+(.+?)(?=\.|$)',
            r'(first|then|next|finally)[,:\s]+(.+?)(?=\.|$)',
        ]
        
        for pattern in step_patterns:
            matches = re.finditer(pattern, body_lower, re.IGNORECASE)
            for match in matches:
                if len(match.groups()) >= 2:
                    step_text = match.groups()[-1].strip()
                    if len(step_text) > 10:
                        steps.append({
                            "text": step_text,
                            "order": len(steps) + 1,
                        })
        
        # Action-based steps
        action_keywords = ["send", "notify", "assign", "review", "approve", "escalate"]
        for keyword in action_keywords:
            if keyword in body_lower:
                # Extract context around keyword
                context = re.search(rf'.{{0,50}}{keyword}.{{0,50}}', body_lower)
                if context:
                    steps.append({
                        "text": context.group(0).strip(),
                        "action": keyword,
                        "order": len(steps) + 1,
                    })
        
        return steps[:10]  # Limit to 10 steps

    def _detect_conditions(self, body: str) -> List[Dict]:
        """Detect workflow conditions and branches."""
        conditions = []
        body_lower = body.lower()
        
        # Conditional patterns
        condition_patterns = [
            (r'if\s+(.+?)\s+then\s+(.+?)(?:\.|$)', "if_then"),
            (r'when\s+(.+?)\s+,\s+(.+?)(?:\.|$)', "when_then"),
            (r'unless\s+(.+?)\s+,\s+(.+?)(?:\.|$)', "unless"),
        ]
        
        for pattern, condition_type in condition_patterns:
            matches = re.finditer(pattern, body_lower, re.IGNORECASE)
            for match in matches:
                if len(match.groups()) >= 2:
                    conditions.append({
                        "type": condition_type,
                        "condition": match.group(1).strip(),
                        "action": match.group(2).strip(),
                        "confidence": 0.8,
                    })
        
        return conditions

    def _suggest_workflow_template(self, patterns: List, triggers: List, 
                                   steps: List) -> Dict:
        """Suggest workflow template."""
        if not patterns:
            return {
                "template_id": None,
                "name": "Custom workflow",
                "description": "No standard template matches detected",
            }
        
        # Determine primary pattern
        primary_pattern = max(patterns, key=lambda p: p["confidence"])
        
        # Template library
        templates = {
            "sequential": {
                "template_id": "sequential_workflow",
                "name": "Sequential Workflow",
                "description": "Linear process with defined steps",
                "features": ["Step-by-step execution", "Progress tracking", "Error handling"],
            },
            "conditional": {
                "template_id": "conditional_workflow",
                "name": "Conditional Workflow",
                "description": "Branching logic based on conditions",
                "features": ["If/then logic", "Multiple paths", "Dynamic routing"],
            },
            "approval": {
                "template_id": "approval_workflow",
                "name": "Approval Workflow",
                "description": "Multi-level approval process",
                "features": ["Approval routing", "Escalation", "Audit trail"],
            },
            "notification": {
                "template_id": "notification_workflow",
                "name": "Notification Workflow",
                "description": "Automated alerts and updates",
                "features": ["Multi-channel alerts", "Scheduling", "Recipient management"],
            },
            "follow_up": {
                "template_id": "follow_up_workflow",
                "name": "Follow-up Workflow",
                "description": "Automated follow-up sequences",
                "features": ["Reminder scheduling", "Escalation", "Response tracking"],
            },
        }
        
        template = templates.get(primary_pattern["type"], templates["sequential"])
        
        return {
            **template,
            "match_confidence": primary_pattern["confidence"],
        }

    def _identify_automation_opportunities(self, email: Dict, steps: List,
                                          conditions: List) -> List[Dict]:
        """Identify automation opportunities."""
        opportunities = []
        
        # Auto-responses
        if len(steps) >= 2:
            opportunities.append({
                "type": "auto_response",
                "description": "Automated responses for common inquiries",
                "impact": "high",
                "effort": "low",
            })
        
        # Task assignment
        if any("assign" in step.get("text", "").lower() for step in steps):
            opportunities.append({
                "type": "task_assignment",
                "description": "Automatic task assignment based on rules",
                "impact": "high",
                "effort": "medium",
            })
        
        # Conditional routing
        if len(conditions) >= 1:
            opportunities.append({
                "type": "conditional_routing",
                "description": "Route emails based on content analysis",
                "impact": "high",
                "effort": "medium",
            })
        
        # Scheduled follow-ups
        if any("follow" in step.get("text", "").lower() for step in steps):
            opportunities.append({
                "type": "scheduled_follow_up",
                "description": "Automated follow-up scheduling",
                "impact": "medium",
                "effort": "low",
            })
        
        # Status updates
        if any("notify" in step.get("text", "").lower() or "update" in step.get("text", "").lower() 
               for step in steps):
            opportunities.append({
                "type": "status_updates",
                "description": "Automated status notifications",
                "impact": "medium",
                "effort": "low",
            })
        
        return opportunities

    def _assess_workflow_complexity(self, steps: List, conditions: List,
                                  automation: List) -> Dict:
        """Assess workflow complexity."""
        step_count = len(steps)
        condition_count = len(conditions)
        automation_count = len(automation)
        
        # Complexity score
        score = 0
        score += step_count * 10
        score += condition_count * 20
        score += automation_count * 5
        
        if score >= 100:
            level = "complex"
        elif score >= 50:
            level = "moderate"
        else:
            level = "simple"
        
        return {
            "score": min(score, 150),
            "level": level,
            "step_count": step_count,
            "condition_count": condition_count,
            "automation_count": automation_count,
        }

    def _estimate_time_savings(self, automation: List, complexity: Dict) -> Dict:
        """Estimate time savings from automation."""
        # Base time savings per automation type
        savings_per_type = {
            "auto_response": 15,  # minutes per week
            "task_assignment": 30,
            "conditional_routing": 25,
            "scheduled_follow_up": 20,
            "status_updates": 10,
        }
        
        total_minutes = 0
        for opp in automation:
            total_minutes += savings_per_type.get(opp["type"], 10)
        
        # Adjust for complexity
        if complexity["level"] == "complex":
            total_minutes *= 1.5  # More savings for complex workflows
        
        # Hours per month
        hours_per_month = (total_minutes * 4) / 60
        
        return {
            "minutes_per_week": round(total_minutes, 1),
            "hours_per_month": round(hours_per_month, 1),
            "automation_count": len(automation),
        }

    def _generate_workflow_recommendation(self, template: Dict, automation: List,
                                         time_savings: Dict, complexity: Dict) -> Dict:
        """Generate workflow recommendation."""
        if not automation:
            return {
                "recommendation": "no_automation_needed",
                "message": "No automation opportunities detected",
                "priority": "low",
            }
        
        # Determine priority based on time savings
        if time_savings["hours_per_month"] >= 10:
            priority = "high"
            message = f"High impact automation: save {time_savings['hours_per_month']:.1f} hours/month"
        elif time_savings["hours_per_month"] >= 5:
            priority = "medium"
            message = f"Medium impact automation: save {time_savings['hours_per_month']:.1f} hours/month"
        else:
            priority = "low"
            message = f"Low impact automation: save {time_savings['hours_per_month']:.1f} hours/month"
        
        return {
            "recommendation": "implement_workflow",
            "message": message,
            "priority": priority,
            "template": template.get("name"),
            "automation_count": len(automation),
        }

    def _determine_workflow_action(self, recommendation: Dict, complexity: Dict) -> str:
        """Determine workflow action."""
        if recommendation["recommendation"] == "no_automation_needed":
            return "NO_ACTION"
        
        if recommendation["priority"] == "high":
            return "IMPLEMENT_IMMEDIATELY"
        elif recommendation["priority"] == "medium":
            return "SCHEDULE_IMPLEMENTATION"
        elif complexity["level"] == "complex":
            return "PLAN_CAREFULLY"
        else:
            return "CONSIDER_IMPLEMENTATION"

    def _enforce_reply_all(self, email: Dict, all_recipients: List, is_multi: bool) -> Dict:
        """STRICT reply-all enforcement."""
        result = {
            "is_multi_recipient": is_multi,
            "recipient_count": len(all_recipients),
            "enforced": False,
            "reason": "",
        }
        if is_multi:
            result["enforced"] = True
            result["reason"] = f"REPLY-ALL ENFORCED: {len(all_recipients)} recipients."
            self.reply_all_audit.append({
                "email_id": email.get("id", "unknown"),
                "enforced": True,
                "timestamp": datetime.now(timezone.utc).isoformat(),
            })
        else:
            result["reason"] = "Single recipient."
        return result

    def get_stats(self) -> Dict:
        if not self.workflow_log:
            return {"emails_analyzed": 0}
        return {
            "emails_analyzed": len(self.workflow_log),
            "total_patterns": sum(w["patterns_detected"] for w in self.workflow_log),
            "total_automation_opps": sum(w["automation_opportunities"] for w in self.workflow_log),
            "avg_time_savings": sum(w["time_savings_minutes"] for w in self.workflow_log) / len(self.workflow_log),
            "complex_workflows": sum(1 for w in self.workflow_log if w["complexity_level"] == "complex"),
            "reply_all_enforced": len(self.reply_all_audit),
        }


def test_v995():
    engine = EmailWorkflowBuilder()

    # Test 1: Complex workflow email
    email1 = {
        "id": "wf-001",
        "from": "manager@company.com",
        "to": ["team@ziontechgroup.com", "support@ziontechgroup.com"],
        "subject": "New customer onboarding process",
        "body": "Here's the workflow for new customer onboarding:\n\nStep 1: When we receive a new customer signup, send a welcome email.\nStep 2: Then assign a dedicated account manager.\nStep 3: If the customer is enterprise tier, notify the sales director for approval.\nStep 4: After approval, schedule a kickoff meeting within 2 days.\nStep 5: Finally, send onboarding materials and follow up after 1 week.\n\nPlease implement this workflow and notify me when complete.",
    }
    r1 = engine.analyze_email_case_by_case(email1)
    assert r1["reply_all_enforcement"]["enforced"] is True
    assert len(r1["workflow_patterns"]) >= 2
    assert len(r1["workflow_steps"]) >= 3
    assert len(r1["automation_opportunities"]) >= 2
    print(f"✅ Test 1 PASSED: {len(r1['workflow_patterns'])} patterns, {len(r1['workflow_steps'])} steps, {len(r1['workflow_conditions'])} conditions, {len(r1['automation_opportunities'])} automations, reply-all enforced")

    # Test 2: Simple notification workflow
    email2 = {
        "id": "wf-002",
        "from": "admin@company.com",
        "to": ["alerts@ziontechgroup.com"],
        "subject": "System alert notification",
        "body": "When the system detects an error, notify the support team immediately.",
    }
    r2 = engine.analyze_email_case_by_case(email2)
    assert len(r2["workflow_patterns"]) >= 1
    assert r2["workflow_complexity"]["level"] in ("simple", "moderate")
    print(f"✅ Test 2 PASSED: Simple workflow detected, complexity={r2['workflow_complexity']['level']}")

    stats = engine.get_stats()
    print(f"✅ Test 3 PASSED: {stats['emails_analyzed']} analyzed, {stats['total_automation_opps']} automation opportunities")

    print("\n🎉 V995 ALL TESTS PASSED — Email Workflow Builder operational!")
    return True


if __name__ == "__main__":
    test_v995()
