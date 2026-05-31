#!/usr/bin/env python3
"""V922: Email Revenue Attribution Engine"""
import re
from datetime import datetime
from typing import Dict, List, Any

class RevenueAttribution:
    def __init__(self):
        self.revenue_keywords = ['deal', 'contract', 'sale', 'purchase', 'invoice', 'payment', 'quote', 'proposal', 'order']
        self.value_patterns = [r'\$\s*[\d,]+(?:\.\d{2})?', r'[\d,]+\s*(?:USD|EUR|GBP)', r'(?:value|worth|amount)\s*[:\s]*\$\s*[\d,]+']
        self.deal_stages = ['lead', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost']
        self.revenue_log = []

    def analyze_email(self, email_data: Dict[str, Any]) -> Dict[str, Any]:
        body = email_data.get('body', '')
        subject = email_data.get('subject', '')
        recipients = email_data.get('recipients', [])
        full_text = f"{subject} {body}".lower()
        is_revenue_related = any(kw in full_text for kw in self.revenue_keywords)
        if not is_revenue_related:
            return {'action': 'no_revenue', 'is_revenue_related': False}
        estimated_value = self._extract_value(body)
        deal_stage = self._detect_stage(full_text)
        priority_score = self._calculate_priority(estimated_value, deal_stage)
        self.revenue_log.append({'timestamp': datetime.now().isoformat(), 'value': estimated_value, 'stage': deal_stage, 'priority': priority_score})
        response = self._generate_revenue_response(estimated_value, deal_stage, priority_score, recipients)
        return {'action': 'track_revenue', 'is_revenue_related': True, 'estimated_value': estimated_value, 'deal_stage': deal_stage, 'priority_score': priority_score, 'response': response, 'reply_all_required': len(recipients) > 1}

    def _extract_value(self, text: str) -> float:
        for pattern in self.value_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            if matches:
                for match in matches:
                    nums = re.findall(r'[\d,]+(?:\.\d{2})?', match)
                    if nums:
                        return float(nums[0].replace(',', ''))
        return 0.0

    def _detect_stage(self, text: str) -> str:
        if 'closed' in text and ('won' in text or 'signed' in text): return 'closed_won'
        elif 'closed' in text and 'lost' in text: return 'closed_lost'
        elif 'negotiat' in text or 'terms' in text: return 'negotiation'
        elif 'proposal' in text or 'quote' in text: return 'proposal'
        elif 'qualif' in text or 'interested' in text: return 'qualified'
        return 'lead'

    def _calculate_priority(self, value: float, stage: str) -> float:
        weights = {'lead': 0.2, 'qualified': 0.4, 'proposal': 0.6, 'negotiation': 0.8, 'closed_won': 1.0, 'closed_lost': 0.0}
        weight = weights.get(stage, 0.5)
        value_score = min(value / 10000, 1.0)
        return round((weight * 0.6 + value_score * 0.4) * 100, 1)

    def _generate_revenue_response(self, value, stage, priority, recipients):
        text = f"Revenue Opportunity\n\nEstimated Value: ${value:,.2f}\nDeal Stage: {stage.replace('_', ' ').title()}\nPriority: {priority}/100\n\n"
        if priority >= 70: text += "HIGH PRIORITY - Immediate attention.\n"
        elif priority >= 40: text += "MEDIUM PRIORITY - Follow up within 24h.\n"
        else: text += "STANDARD - Add to pipeline.\n"
        if len(recipients) > 1: text += f"\nReply All enforced for {len(recipients)} stakeholders."
        return {'text': text, 'reply_all': len(recipients) > 1, 'crm_sync': True}

def main():
    engine = RevenueAttribution()
    tests = [
        {'subject': 'Contract signed', 'body': 'The $50,000 annual contract has been signed. Please send invoice.', 'recipients': ['sales@ex.com', 'finance@ex.com', 'legal@ex.com']},
        {'subject': 'Proposal request', 'body': 'We are interested in your enterprise plan. Can you send a quote?', 'recipients': ['sales@ex.com']},
        {'subject': 'Quick question', 'body': 'When is the next team meeting?', 'recipients': ['team@ex.com']}
    ]
    print("=" * 60)
    print("V922 Revenue Attribution Engine")
    print("=" * 60)
    for e in tests:
        r = engine.analyze_email(e)
        print(f"\nSubject: {e['subject']}")
        if r['is_revenue_related']:
            print(f"  Value: ${r['estimated_value']:,.2f}, Stage: {r['deal_stage']}, Priority: {r['priority_score']}/100, Reply All: {r['reply_all_required']}")
        else:
            print("  Not revenue-related")
    print("\nV922 Revenue Attribution: OPERATIONAL")

if __name__ == '__main__':
    main()
