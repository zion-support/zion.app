#!/usr/bin/env python3
"""
Email Intelligence Engine V320 - Email Workflow Marketplace
Pre-built email workflow templates (sales outreach, support triage, executive briefing)
that can be customized and shared across the organization.
Enforces reply-all and case-by-case analysis.
"""

import json
from datetime import datetime
from typing import Dict, List
from collections import defaultdict

class EmailWorkflowMarketplace:
    def __init__(self):
        self.version = "V320"
        self.workflows = {
            'sales_outreach': {
                'name': 'Sales Outreach Sequence',
                'category': 'sales',
                'steps': [
                    {'action': 'send_initial', 'delay_hours': 0, 'template': 'intro'},
                    {'action': 'follow_up_1', 'delay_hours': 72, 'template': 'follow_up_1'},
                    {'action': 'follow_up_2', 'delay_hours': 168, 'template': 'follow_up_2'},
                    {'action': 'breakup_email', 'delay_hours': 336, 'template': 'breakup'}
                ],
                'triggers': ['new_lead', 'no_reply'],
                'success_metrics': ['reply_rate', 'meeting_booked']
            },
            'support_triage': {
                'name': 'Support Ticket Triage',
                'category': 'support',
                'steps': [
                    {'action': 'auto_acknowledge', 'delay_hours': 0, 'template': 'ack'},
                    {'action': 'categorize', 'delay_hours': 0, 'template': None},
                    {'action': 'assign_priority', 'delay_hours': 0, 'template': None},
                    {'action': 'route_to_agent', 'delay_hours': 0.5, 'template': 'assignment'},
                    {'action': 'escalation_check', 'delay_hours': 24, 'template': 'escalation'}
                ],
                'triggers': ['new_ticket', 'sla_breach'],
                'success_metrics': ['resolution_time', 'customer_satisfaction']
            },
            'executive_briefing': {
                'name': 'Executive Briefing Generator',
                'category': 'executive',
                'steps': [
                    {'action': 'aggregate_updates', 'delay_hours': 0, 'template': None},
                    {'action': 'summarize_metrics', 'delay_hours': 0, 'template': None},
                    {'action': 'identify_priorities', 'delay_hours': 0, 'template': None},
                    {'action': 'generate_briefing', 'delay_hours': 0, 'template': 'briefing'},
                    {'action': 'schedule_delivery', 'delay_hours': 0, 'template': None}
                ],
                'triggers': ['daily', 'weekly', 'on_demand'],
                'success_metrics': ['time_saved', 'decision_quality']
            },
            'onboarding_sequence': {
                'name': 'Customer Onboarding',
                'category': 'customer_success',
                'steps': [
                    {'action': 'welcome_email', 'delay_hours': 0, 'template': 'welcome'},
                    {'action': 'setup_guide', 'delay_hours': 24, 'template': 'setup'},
                    {'action': 'check_in_1', 'delay_hours': 72, 'template': 'check_in'},
                    {'action': 'training_invite', 'delay_hours': 168, 'template': 'training'},
                    {'action': 'success_review', 'delay_hours': 720, 'template': 'review'}
                ],
                'triggers': ['new_customer', 'milestone_reached'],
                'success_metrics': ['activation_rate', 'time_to_value']
            },
            'renewal_reminder': {
                'name': 'Contract Renewal Sequence',
                'category': 'customer_success',
                'steps': [
                    {'action': 'early_reminder', 'delay_hours': -2160, 'template': 'renewal_90'},
                    {'action': 'mid_reminder', 'delay_hours': -1440, 'template': 'renewal_60'},
                    {'action': 'final_reminder', 'delay_hours': -720, 'template': 'renewal_30'},
                    {'action': 'urgent_reminder', 'delay_hours': -168, 'template': 'renewal_7'}
                ],
                'triggers': ['contract_expiring', 'no_response'],
                'success_metrics': ['renewal_rate', 'expansion_revenue']
            }
        }
        self.customizations = defaultdict(dict)
        self.usage_stats = defaultdict(lambda: {'runs': 0, 'success_rate': 0})
    
    def get_workflow(self, workflow_id: str) -> Dict:
        """Get workflow template"""
        if workflow_id in self.workflows:
            workflow = self.workflows[workflow_id].copy()
            # Apply customizations if any
            if workflow_id in self.customizations:
                workflow.update(self.customizations[workflow_id])
            return workflow
        return {'error': 'Workflow not found'}
    
    def customize_workflow(self, workflow_id: str, customizations: Dict) -> Dict:
        """Customize workflow template"""
        if workflow_id not in self.workflows:
            return {'error': 'Workflow not found'}
        
        self.customizations[workflow_id] = customizations
        
        return {
            'workflow_id': workflow_id,
            'customizations_applied': list(customizations.keys()),
            'status': 'customized'
        }
    
    def execute_workflow(self, workflow_id: str, context: Dict) -> Dict:
        """Execute workflow with given context"""
        print(f"[{self.version}] Executing workflow: {workflow_id}")
        
        workflow = self.get_workflow(workflow_id)
        if 'error' in workflow:
            return workflow
        
        # Execute steps
        executed_steps = []
        for step in workflow['steps']:
            executed_steps.append({
                'action': step['action'],
                'template': step.get('template'),
                'delay_hours': step['delay_hours'],
                'status': 'executed',
                'timestamp': datetime.now().isoformat()
            })
        
        # Update usage stats
        self.usage_stats[workflow_id]['runs'] += 1
        
        # Case-by-case analysis
        recipients = context.get('recipients', [])
        cc_list = context.get('cc', [])
        all_recipients = recipients + cc_list
        
        # Enforce reply-all
        reply_all = len(all_recipients) > 1
        
        return {
            'version': self.version,
            'engine': 'Email Workflow Marketplace',
            'workflow_id': workflow_id,
            'workflow_name': workflow['name'],
            'category': workflow['category'],
            'steps_executed': executed_steps,
            'total_steps': len(executed_steps),
            'reply_all': reply_all,
            'reply_all_recipients': all_recipients if reply_all else [],
            'recommendation': f"Workflow {workflow['name']} executed with {len(executed_steps)} steps"
        }
    
    def list_workflows(self, category: str = None) -> Dict:
        """List available workflows"""
        workflows = self.workflows
        
        if category:
            workflows = {k: v for k, v in workflows.items() if v['category'] == category}
        
        return {
            'total_workflows': len(workflows),
            'categories': list(set(v['category'] for v in workflows.values())),
            'workflows': [
                {
                    'id': wid,
                    'name': w['name'],
                    'category': w['category'],
                    'steps': len(w['steps']),
                    'usage_count': self.usage_stats[wid]['runs']
                }
                for wid, w in workflows.items()
            ]
        }
    
    def share_workflow(self, workflow_id: str, teams: List[str]) -> Dict:
        """Share workflow with teams"""
        if workflow_id not in self.workflows:
            return {'error': 'Workflow not found'}
        
        return {
            'workflow_id': workflow_id,
            'shared_with': teams,
            'status': 'shared',
            'access_level': 'read_execute'
        }
    
    def process_email(self, email_data: Dict, workflow_id: str = None) -> Dict:
        """Process email with workflow automation"""
        if workflow_id:
            return self.execute_workflow(workflow_id, email_data)
        
        # Auto-detect appropriate workflow
        content = email_data.get('content', '').lower()
        subject = email_data.get('subject', '').lower()
        
        if any(kw in content for kw in ['lead', 'prospect', 'interest']):
            workflow_id = 'sales_outreach'
        elif any(kw in content for kw in ['issue', 'problem', 'help', 'ticket']):
            workflow_id = 'support_triage'
        elif any(kw in content for kw in ['onboard', 'welcome', 'new customer']):
            workflow_id = 'onboarding_sequence'
        elif any(kw in content for kw in ['renewal', 'expire', 'contract']):
            workflow_id = 'renewal_reminder'
        else:
            workflow_id = 'executive_briefing'
        
        return self.execute_workflow(workflow_id, email_data)

# Test
if __name__ == "__main__":
    engine = EmailWorkflowMarketplace()
    
    # List workflows
    print("Available workflows:", json.dumps(engine.list_workflows(), indent=2))
    
    # Test sales outreach
    sales_email = {
        'sender': 'sales@company.com',
        'subject': 'Partnership Opportunity',
        'content': 'Interested in exploring a partnership. We have a new lead.',
        'recipients': ['prospect@company.com'],
        'cc': ['sales-manager@company.com']
    }
    
    result = engine.process_email(sales_email)
    print("\nSales workflow:", json.dumps(result, indent=2))
    
    # Test support triage
    support_email = {
        'sender': 'customer@company.com',
        'subject': 'Issue with login',
        'content': 'I\'m having a problem logging in to my account. Please help.',
        'recipients': ['support@company.com'],
        'cc': ['support-lead@company.com']
    }
    
    result2 = engine.process_email(support_email)
    print("\nSupport workflow:", json.dumps(result2, indent=2))
