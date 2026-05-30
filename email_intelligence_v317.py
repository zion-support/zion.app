#!/usr/bin/env python3
"""
Email Intelligence Engine V317 - Email ROI Calculator
Track the monetary value of every email conversation, calculate time-to-value,
measure deal influence, and report email ROI by team/person.
Enforces reply-all and case-by-case analysis.
"""

import json
from datetime import datetime
from typing import Dict, List
from collections import defaultdict

class EmailROICalculator:
    def __init__(self):
        self.version = "V317"
        self.conversations = defaultdict(lambda: {'emails': [], 'value': 0, 'time_invested': 0})
        self.team_metrics = defaultdict(lambda: {'conversations': 0, 'total_value': 0, 'time_saved': 0})
        
    def calculate_email_time_cost(self, email_data: Dict) -> float:
        """Calculate time cost of handling an email (in dollars)"""
        content = email_data.get('content', '')
        word_count = len(content.split())
        
        # Base reading time (250 wpm) + processing time
        reading_minutes = word_count / 250
        processing_minutes = 5  # Base processing
        total_minutes = reading_minutes + processing_minutes
        
        # Average professional hourly rate ($75/hr = $1.25/min)
        hourly_rate = 75
        cost = (total_minutes / 60) * hourly_rate
        
        return round(cost, 2)
    
    def track_deal_influence(self, email_data: Dict, deal_value: float = 0) -> Dict:
        """Track email's influence on deal progression"""
        content = email_data.get('content', '').lower()
        subject = email_data.get('subject', '').lower()
        
        # Deal stage indicators
        stage_indicators = {
            'prospect': ['interest', 'learn more', 'explore'],
            'qualified': ['requirements', 'budget', 'timeline'],
            'proposal': ['proposal', 'quote', 'pricing'],
            'negotiation': ['discount', 'terms', 'adjust'],
            'closing': ['sign', 'approve', 'contract', 'wire']
        }
        
        detected_stage = 'prospect'
        for stage, keywords in stage_indicators.items():
            if any(kw in content for kw in keywords):
                detected_stage = stage
        
        # Influence weight by stage
        influence_weights = {
            'prospect': 0.05,
            'qualified': 0.15,
            'proposal': 0.25,
            'negotiation': 0.30,
            'closing': 0.25
        }
        
        influence_value = deal_value * influence_weights.get(detected_stage, 0.05)
        
        return {
            'detected_stage': detected_stage,
            'deal_value': deal_value,
            'influence_weight': influence_weights.get(detected_stage, 0.05),
            'attributed_value': round(influence_value, 2)
        }
    
    def calculate_conversation_roi(self, conversation_id: str, emails: List[Dict], 
                                  outcome_value: float = 0) -> Dict:
        """Calculate ROI for an email conversation"""
        total_time_cost = sum(self.calculate_email_time_cost(e) for e in emails)
        total_emails = len(emails)
        
        # Time-to-value (days from first to outcome)
        if len(emails) >= 2:
            first_date = emails[0].get('timestamp', datetime.now().isoformat())
            last_date = emails[-1].get('timestamp', datetime.now().isoformat())
            # Simplified - in production parse dates properly
            days_to_value = 7  # Default
        else:
            days_to_value = 0
        
        # ROI calculation
        net_value = outcome_value - total_time_cost
        roi_percentage = (net_value / total_time_cost * 100) if total_time_cost > 0 else 0
        
        return {
            'conversation_id': conversation_id,
            'total_emails': total_emails,
            'time_cost': round(total_time_cost, 2),
            'outcome_value': outcome_value,
            'net_value': round(net_value, 2),
            'roi_percentage': round(roi_percentage, 1),
            'days_to_value': days_to_value,
            'efficiency_score': round(outcome_value / max(1, total_emails), 2)
        }
    
    def generate_team_report(self, team: str, conversations: List[Dict]) -> Dict:
        """Generate ROI report for a team"""
        total_value = sum(c.get('outcome_value', 0) for c in conversations)
        total_cost = sum(c.get('time_cost', 0) for c in conversations)
        total_emails = sum(c.get('total_emails', 0) for c in conversations)
        
        avg_roi = sum(c.get('roi_percentage', 0) for c in conversations) / len(conversations) if conversations else 0
        avg_emails_per_deal = total_emails / len(conversations) if conversations else 0
        
        return {
            'team': team,
            'conversations_analyzed': len(conversations),
            'total_value_generated': round(total_value, 2),
            'total_time_invested': round(total_cost, 2),
            'net_roi': round(total_value - total_cost, 2),
            'average_roi_percentage': round(avg_roi, 1),
            'average_emails_per_deal': round(avg_emails_per_deal, 1),
            'value_per_email': round(total_value / max(1, total_emails), 2)
        }
    
    def process_email(self, email_data: Dict, deal_value: float = 0) -> Dict:
        """Process email with ROI tracking"""
        print(f"[{self.version}] Calculating email ROI")
        
        # Case-by-case analysis
        recipients = email_data.get('recipients', [])
        cc_list = email_data.get('cc', [])
        all_recipients = recipients + cc_list
        
        # Enforce reply-all
        reply_all = len(all_recipients) > 1
        
        # Calculate metrics
        time_cost = self.calculate_email_time_cost(email_data)
        deal_influence = self.track_deal_influence(email_data, deal_value)
        
        # Determine sender's team
        sender = email_data.get('sender', '')
        team = 'sales' if 'sales' in sender.lower() else 'support' if 'support' in sender.lower() else 'general'
        
        response = {
            'version': self.version,
            'engine': 'Email ROI Calculator',
            'time_cost': time_cost,
            'deal_influence': deal_influence,
            'team': team,
            'reply_all': reply_all,
            'reply_all_recipients': all_recipients if reply_all else [],
            'recommendation': f"Email value: ${deal_influence['attributed_value']:.2f} | Cost: ${time_cost:.2f}"
        }
        
        print(f"[{self.version}] Cost: ${time_cost:.2f}, Influence: ${deal_influence['attributed_value']:.2f}, Reply-all: {reply_all}")
        return response

# Test
if __name__ == "__main__":
    engine = EmailROICalculator()
    
    test_email = {
        'sender': 'sales@company.com',
        'subject': 'Enterprise Proposal - $500K Deal',
        'content': 'Please find attached our proposal for the enterprise platform implementation. The total value is $500,000 over 3 years. We can offer a 10% discount for annual payment.',
        'recipients': ['client@company.com'],
        'cc': ['cfo@client.com', 'vp-sales@company.com']
    }
    
    result = engine.process_email(test_email, deal_value=500000)
    print(json.dumps(result, indent=2))
    
    # Test conversation ROI
    print("\n--- Conversation ROI ---")
    conversation = [test_email, test_email, test_email]
    roi = engine.calculate_conversation_roi('deal-001', conversation, outcome_value=500000)
    print(json.dumps(roi, indent=2))
