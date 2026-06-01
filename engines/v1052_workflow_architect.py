#!/usr/bin/env python3
"""V1052: Email Workflow Automation Architect
Automatically creates multi-step workflows from email conversations.
Triggers actions across apps with conditional logic.
MANDATORY: Reply-all enforcement for multi-recipient emails.
"""

import re
import json
from datetime import datetime
from collections import defaultdict

class WorkflowArchitect:
    def __init__(self):
        self.workflow_templates = {
            'onboarding': {
                'trigger': ['new client', 'welcome', 'onboarding', 'kickoff'],
                'steps': ['Send welcome email', 'Create CRM record', 'Schedule kickoff call', 'Send onboarding docs']
            },
            'support_ticket': {
                'trigger': ['help', 'issue', 'problem', 'bug', 'support'],
                'steps': ['Create ticket', 'Assign to team', 'Send acknowledgment', 'Set SLA timer']
            },
            'sales_followup': {
                'trigger': ['interested', 'follow up', 'next steps', 'proposal'],
                'steps': ['Update CRM stage', 'Schedule follow-up', 'Send materials', 'Notify sales team']
            },
            'invoice': {
                'trigger': ['invoice', 'payment', 'billing', 'charge'],
                'steps': ['Generate invoice', 'Send to client', 'Update accounting', 'Set payment reminder']
            }
        }
        
        self.conditional_logic = {
            'if_urgent': {'condition': 'urgent|asap|immediately', 'action': 'escalate_priority'},
            'if_vip': {'condition': 'ceo|cto|vp|director', 'action': 'fast_track'},
            'if_price_mentioned': {'condition': r'\$\d+', 'action': 'tag_revenue'},
            'if_attachment': {'condition': 'attached|attachment', 'action': 'scan_attachment'}
        }
    
    def parse_email_for_workflow(self, email_data):
        """Parse email and generate workflow automation."""
        sender = email_data.get('sender', 'unknown')
        recipients = email_data.get('recipients', [])
        subject = email_data.get('subject', '')
        body = email_data.get('body', '')
        
        # REPLY-ALL ENFORCEMENT
        reply_all = len(recipients) > 1
        
        # Detect workflow type
        workflow_type = self._detect_workflow_type(subject, body)
        
        # Extract entities
        entities = self._extract_entities(body)
        
        # Generate workflow steps
        workflow = self._generate_workflow(workflow_type, entities, body)
        
        # Apply conditional logic
        conditionals = self._apply_conditional_logic(body, workflow)
        
        # Integration mapping
        integrations = self._map_integrations(workflow)
        
        return {
            'email_id': email_data.get('id'),
            'reply_all_required': reply_all,
            'workflow_type': workflow_type,
            'workflow_name': f"{workflow_type.replace('_', ' ').title()} Workflow",
            'steps': workflow['steps'],
            'conditional_triggers': conditionals,
            'integrations': integrations,
            'estimated_time_saved': f"{len(workflow['steps']) * 5} minutes",
            'automation_score': self._calculate_automation_score(workflow, conditionals),
            'native_integrations': ['Zapier', 'Make.com', 'Slack', 'HubSpot', 'Salesforce', 'Jira'],
            'contact_info': {
                'phone': '+1 302 464 0950',
                'email': 'kleber@ziontechgroup.com',
                'address': '364 E Main St STE 1008, Middletown DE 19709'
            }
        }
    
    def _detect_workflow_type(self, subject, body):
        """Detect which workflow type this email should trigger."""
        text = (subject + ' ' + body).lower()
        
        for workflow_type, config in self.workflow_templates.items():
            for trigger in config['trigger']:
                if trigger in text:
                    return workflow_type
        
        return 'custom'
    
    def _extract_entities(self, body):
        """Extract entities from email body."""
        entities = {
            'names': [],
            'companies': [],
            'dates': [],
            'amounts': [],
            'emails': [],
            'phones': []
        }
        
        # Names
        name_pattern = r'\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\b'
        entities['names'] = re.findall(name_pattern, body)[:5]
        
        # Companies
        company_pattern = r'\b([A-Z][A-Za-z\s]+(?:Inc|Corp|LLC|Ltd|Group))\b'
        entities['companies'] = re.findall(company_pattern, body)[:3]
        
        # Dates
        date_pattern = r'\b(\d{1,2}[/-]\d{1,2}(?:[/-]\d{2,4})?|next\s+(?:monday|tuesday|wednesday|thursday|friday))\b'
        entities['dates'] = re.findall(date_pattern, body, re.IGNORECASE)[:3]
        
        # Amounts
        amount_pattern = r'\$\s*([\d,]+(?:\.\d{2})?)'
        entities['amounts'] = re.findall(amount_pattern, body)[:3]
        
        # Emails
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        entities['emails'] = re.findall(email_pattern, body)[:5]
        
        # Phones
        phone_pattern = r'\b\d{3}[-.]?\d{3}[-.]?\d{4}\b'
        entities['phones'] = re.findall(phone_pattern, body)[:3]
        
        return entities
    
    def _generate_workflow(self, workflow_type, entities, body):
        """Generate workflow steps based on type and entities."""
        if workflow_type in self.workflow_templates:
            base_steps = self.workflow_templates[workflow_type]['steps']
        else:
            base_steps = ['Analyze email content', 'Extract key information', 'Route to appropriate team', 'Send acknowledgment']
        
        # Customize steps based on entities
        steps = []
        for step in base_steps:
            customized_step = step
            if entities['names']:
                customized_step += f" for {entities['names'][0]}"
            steps.append(customized_step)
        
        # Add entity-specific steps
        if entities['amounts']:
            steps.append(f"Log revenue: ${entities['amounts'][0]}")
        if entities['dates']:
            steps.append(f"Set reminder for {entities['dates'][0]}")
        if entities['emails']:
            steps.append(f"Add contact: {entities['emails'][0]}")
        
        return {
            'type': workflow_type,
            'steps': steps,
            'total_steps': len(steps)
        }
    
    def _apply_conditional_logic(self, body, workflow):
        """Apply conditional logic to workflow."""
        text = body.lower()
        conditionals = []
        
        for condition_name, config in self.conditional_logic.items():
            pattern = config['condition']
            if re.search(pattern, text, re.IGNORECASE):
                conditionals.append({
                    'condition': condition_name,
                    'action': config['action'],
                    'triggered': True
                })
        
        return conditionals
    
    def _map_integrations(self, workflow):
        """Map workflow steps to integrations."""
        integrations = []
        
        integration_keywords = {
            'CRM': ['client', 'customer', 'contact', 'lead'],
            'Email': ['send', 'email', 'notify'],
            'Calendar': ['schedule', 'meeting', 'call', 'appointment'],
            'Project Management': ['task', 'project', 'assign'],
            'Accounting': ['invoice', 'payment', 'billing']
        }
        
        for step in workflow['steps']:
            for integration, keywords in integration_keywords.items():
                if any(kw in step.lower() for kw in keywords):
                    integrations.append({
                        'step': step,
                        'integration': integration,
                        'action': f"Create {integration.lower()} record"
                    })
                    break
        
        return integrations
    
    def _calculate_automation_score(self, workflow, conditionals):
        """Calculate how much of the workflow can be automated."""
        base_score = 70  # Base automation capability
        
        # More steps = more automation potential
        step_bonus = min(20, workflow['total_steps'] * 2)
        
        # Conditionals add complexity but also automation value
        conditional_bonus = min(10, len(conditionals) * 3)
        
        return min(100, base_score + step_bonus + conditional_bonus)


if __name__ == '__main__':
    architect = WorkflowArchitect()
    
    test_emails = [
        {
            'id': 'e001',
            'sender': 'newclient@acme.com',
            'recipients': ['sales@ziontechgroup.com', 'onboarding@ziontechgroup.com'],
            'subject': 'New Client Onboarding - ACME Corp',
            'body': """Hi team,

We're excited to get started! Please begin the onboarding process for our new client John Smith from ACME Corp.

We need to schedule a kickoff call for next Monday and send over the onboarding documents. The contract value is $50,000.

Contact: john.smith@acme.com | Phone: 555-123-4567

This is urgent - they want to start ASAP.

Thanks!""",
            'timestamp': '2026-05-30T10:00:00'
        }
    ]
    
    print("=== V1052: Email Workflow Automation Architect ===\n")
    
    for email in test_emails:
        result = architect.parse_email_for_workflow(email)
        print(f"Workflow: {result['workflow_name']}")
        print(f"Steps: {len(result['steps'])}")
        print(f"Automation Score: {result['automation_score']}/100")
        print(f"Time Saved: {result['estimated_time_saved']}")
        print(f"Reply-All: {'REQUIRED' if result['reply_all_required'] else 'N/A'}")
        
        print(f"\n📋 Workflow Steps:")
        for i, step in enumerate(result['steps'][:5], 1):
            print(f"  {i}. {step}")
        
        print(f"\n⚙️ Conditionals:")
        for cond in result['conditional_triggers'][:3]:
            print(f"  • {cond['condition']} → {cond['action']}")
        
        print(f"\n🔌 Integrations:")
        for integ in result['integrations'][:3]:
            print(f"  • {integ['step'][:50]} → {integ['integration']}")
        print()
