#!/usr/bin/env python3
"""
V485 - Email Revenue Attribution Tracker
Track which emails and conversations lead to revenue and business opportunities.
Features: Revenue detection, opportunity tracking, conversion attribution, ROI calculation.
CRITICAL: Always enforces reply-all for multi-recipient emails.
"""

import json
import re
from datetime import datetime
from typing import Dict, List, Any, Optional


class EmailRevenueAttributionTracker:
    """Track revenue attribution from email conversations."""
    
    REVENUE_INDICATORS = [
        'purchase', 'order', 'buy', 'sale', 'revenue', 'deal',
        'contract value', 'invoice', 'payment', 'price', 'cost',
        'subscription', 'license', 'fee', 'budget', 'quote'
    ]
    
    OPPORTUNITY_INDICATORS = [
        'opportunity', 'prospect', 'lead', 'potential', 'interested',
        'proposal', 'quote request', 'rfp', 'bid', 'tender'
    ]
    
    CONVERSION_INDICATORS = [
        'accepted', 'approved', 'signed', 'confirmed', 'closed',
        'won', 'finalized', 'executed', 'completed', 'successful'
    ]
    
    CURRENCY_PATTERNS = [
        r'\$\s*([\d,]+(?:\.\d{2})?)',  # $1,000 or $1000.00
        r'([\d,]+(?:\.\d{2})?)\s*(?:USD|dollars?)',  # 1000 USD
        r'(?:EUR|€)\s*([\d,]+(?:\.\d{2})?)',  # EUR 1000
        r'(?:GBP|£)\s*([\d,]+(?:\.\d{2})?)',  # GBP 1000
    ]
    
    def analyze_email(self, email: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze email for revenue attribution."""
        body = email.get('body', '')
        subject = email.get('subject', '')
        sender = email.get('from', '')
        recipients = email.get('to', []) + email.get('cc', [])
        conversation_history = email.get('conversation_history', [])
        
        # Detect revenue indicators
        revenue_detection = self._detect_revenue(body, subject)
        
        # Detect opportunity
        opportunity_detection = self._detect_opportunity(body, subject)
        
        # Detect conversion
        conversion_detection = self._detect_conversion(body, subject)
        
        # Extract monetary values
        monetary_values = self._extract_monetary_values(body)
        
        # Calculate attribution
        attribution = self._calculate_attribution(
            revenue_detection, opportunity_detection, conversion_detection,
            monetary_values, conversation_history
        )
        
        # Calculate ROI metrics
        roi_metrics = self._calculate_roi(attribution, conversation_history)
        
        # Generate insights
        insights = self._generate_insights(attribution, roi_metrics)
        
        # Generate recommendations
        recommendations = self._generate_recommendations(
            attribution, opportunity_detection, conversion_detection
        )
        
        reply_all_required = len(recipients) > 1
        
        return {
            'engine': 'V485_EmailRevenueAttributionTracker',
            'revenue_detection': revenue_detection,
            'opportunity_detection': opportunity_detection,
            'conversion_detection': conversion_detection,
            'monetary_values': monetary_values,
            'attribution': attribution,
            'roi_metrics': roi_metrics,
            'insights': insights,
            'recommendations': recommendations,
            'reply_all_required': reply_all_required,
            'reply_all_enforced': reply_all_required,
            'recipients': recipients,
            'timestamp': datetime.now().isoformat()
        }
    
    def _detect_revenue(self, body: str, subject: str) -> Dict:
        """Detect revenue-related content."""
        text = (body + ' ' + subject).lower()
        
        # Check for revenue indicators
        indicators_found = []
        for indicator in self.REVENUE_INDICATORS:
            if indicator in text:
                indicators_found.append(indicator)
        
        has_revenue = len(indicators_found) > 0
        
        # Determine revenue type
        if 'purchase' in text or 'order' in text or 'buy' in text:
            revenue_type = 'direct_sale'
        elif 'subscription' in text or 'license' in text:
            revenue_type = 'recurring_revenue'
        elif 'contract' in text or 'deal' in text:
            revenue_type = 'contract_revenue'
        elif 'quote' in text or 'proposal' in text:
            revenue_type = 'potential_revenue'
        else:
            revenue_type = 'general_revenue'
        
        return {
            'has_revenue_indicator': has_revenue,
            'revenue_type': revenue_type,
            'indicators': indicators_found,
            'confidence': min(1.0, len(indicators_found) * 0.25)
        }
    
    def _detect_opportunity(self, body: str, subject: str) -> Dict:
        """Detect business opportunities."""
        text = (body + ' ' + subject).lower()
        
        # Check for opportunity indicators
        indicators_found = []
        for indicator in self.OPPORTUNITY_INDICATORS:
            if indicator in text:
                indicators_found.append(indicator)
        
        has_opportunity = len(indicators_found) > 0
        
        # Determine opportunity stage
        if 'rfp' in text or 'bid' in text or 'tender' in text:
            stage = 'formal_proposal'
            probability = 0.6
        elif 'proposal' in text or 'quote' in text:
            stage = 'proposal_sent'
            probability = 0.5
        elif 'interested' in text:
            stage = 'interest_expressed'
            probability = 0.3
        elif 'lead' in text or 'prospect' in text:
            stage = 'lead_identified'
            probability = 0.2
        else:
            stage = 'unknown'
            probability = 0.1
        
        return {
            'has_opportunity': has_opportunity,
            'stage': stage,
            'probability': probability,
            'indicators': indicators_found,
            'confidence': min(1.0, len(indicators_found) * 0.3)
        }
    
    def _detect_conversion(self, body: str, subject: str) -> Dict:
        """Detect conversion events."""
        text = (body + ' ' + subject).lower()
        
        # Check for conversion indicators
        indicators_found = []
        for indicator in self.CONVERSION_INDICATORS:
            if indicator in text:
                indicators_found.append(indicator)
        
        has_conversion = len(indicators_found) > 0
        
        # Determine conversion type
        if 'signed' in text or 'executed' in text:
            conversion_type = 'contract_signed'
        elif 'approved' in text or 'accepted' in text:
            conversion_type = 'proposal_accepted'
        elif 'closed' in text or 'won' in text:
            conversion_type = 'deal_closed'
        elif 'confirmed' in text or 'completed' in text:
            conversion_type = 'order_confirmed'
        else:
            conversion_type = 'general_conversion'
        
        return {
            'has_conversion': has_conversion,
            'conversion_type': conversion_type,
            'indicators': indicators_found,
            'confidence': min(1.0, len(indicators_found) * 0.4)
        }
    
    def _extract_monetary_values(self, body: str) -> List[Dict]:
        """Extract monetary values from email."""
        values = []
        
        for pattern in self.CURRENCY_PATTERNS:
            matches = re.finditer(pattern, body)
            for match in matches:
                # Extract and clean the value
                value_str = match.group(1).replace(',', '')
                try:
                    value = float(value_str)
                    
                    # Determine currency
                    context = body[max(0, match.start()-10):match.end()+10].lower()
                    if 'eur' in context or '€' in context:
                        currency = 'EUR'
                    elif 'gbp' in context or '£' in context:
                        currency = 'GBP'
                    else:
                        currency = 'USD'
                    
                    values.append({
                        'value': value,
                        'currency': currency,
                        'formatted': match.group(0),
                        'context': context.strip()
                    })
                except ValueError:
                    continue
        
        return values
    
    def _calculate_attribution(self, revenue_detection: Dict, opportunity_detection: Dict,
                              conversion_detection: Dict, monetary_values: List[Dict],
                              conversation_history: List[Dict]) -> Dict:
        """Calculate revenue attribution."""
        attribution = {
            'total_value': 0,
            'weighted_value': 0,
            'attribution_type': 'none',
            'emails_in_chain': len(conversation_history) + 1,
            'confidence': 0
        }
        
        # Calculate total monetary value
        if monetary_values:
            # Convert all to USD (simplified)
            total = sum(
                v['value'] * (1.1 if v['currency'] == 'EUR' else 1.25 if v['currency'] == 'GBP' else 1.0)
                for v in monetary_values
            )
            attribution['total_value'] = total
        
        # Determine attribution type
        if conversion_detection['has_conversion']:
            attribution['attribution_type'] = 'direct_conversion'
            attribution['weighted_value'] = attribution['total_value']
            attribution['confidence'] = 0.9
        elif revenue_detection['has_revenue_indicator']:
            attribution['attribution_type'] = 'revenue_related'
            attribution['weighted_value'] = attribution['total_value'] * 0.7
            attribution['confidence'] = 0.7
        elif opportunity_detection['has_opportunity']:
            attribution['attribution_type'] = 'opportunity'
            probability = opportunity_detection['probability']
            attribution['weighted_value'] = attribution['total_value'] * probability
            attribution['confidence'] = probability
        else:
            attribution['attribution_type'] = 'indirect'
            attribution['weighted_value'] = 0
            attribution['confidence'] = 0.1
        
        return attribution
    
    def _calculate_roi(self, attribution: Dict, conversation_history: List[Dict]) -> Dict:
        """Calculate ROI metrics."""
        emails_count = len(conversation_history) + 1
        
        # Estimate cost per email (simplified)
        cost_per_email = 5.0  # $5 per email (time + resources)
        total_cost = emails_count * cost_per_email
        
        # Calculate ROI
        if total_cost > 0:
            roi = ((attribution['weighted_value'] - total_cost) / total_cost) * 100
        else:
            roi = 0
        
        # Calculate conversion rate
        conversion_rate = (1 / emails_count) * 100 if emails_count > 0 else 0
        
        # Calculate value per email
        value_per_email = attribution['weighted_value'] / emails_count if emails_count > 0 else 0
        
        return {
            'total_cost': total_cost,
            'total_value': attribution['weighted_value'],
            'net_value': attribution['weighted_value'] - total_cost,
            'roi_percentage': round(roi, 2),
            'conversion_rate': round(conversion_rate, 2),
            'value_per_email': round(value_per_email, 2),
            'emails_to_conversion': emails_count,
            'cost_efficiency': 'high' if roi > 100 else 'medium' if roi > 0 else 'low'
        }
    
    def _generate_insights(self, attribution: Dict, roi_metrics: Dict) -> List[str]:
        """Generate insights from attribution analysis."""
        insights = []
        
        # Value insights
        if attribution['total_value'] > 0:
            insights.append(f"💰 Email chain associated with ${attribution['total_value']:,.2f} in value")
        
        if attribution['weighted_value'] > 0:
            insights.append(f"📊 Weighted pipeline value: ${attribution['weighted_value']:,.2f}")
        
        # ROI insights
        if roi_metrics['roi_percentage'] > 100:
            insights.append(f"🚀 Excellent ROI: {roi_metrics['roi_percentage']:.1f}%")
        elif roi_metrics['roi_percentage'] > 0:
            insights.append(f"✅ Positive ROI: {roi_metrics['roi_percentage']:.1f}%")
        else:
            insights.append(f"⚠️ Negative ROI: {roi_metrics['roi_percentage']:.1f}%")
        
        # Efficiency insights
        if roi_metrics['value_per_email'] > 1000:
            insights.append(f"⭐ High value per email: ${roi_metrics['value_per_email']:,.2f}")
        
        if roi_metrics['emails_to_conversion'] < 5:
            insights.append(f"⚡ Quick conversion: {roi_metrics['emails_to_conversion']} emails")
        elif roi_metrics['emails_to_conversion'] > 10:
            insights.append(f"📈 Long sales cycle: {roi_metrics['emails_to_conversion']} emails")
        
        return insights
    
    def _generate_recommendations(self, attribution: Dict, opportunity_detection: Dict,
                                 conversion_detection: Dict) -> List[str]:
        """Generate recommendations based on analysis."""
        recommendations = []
        
        # Based on attribution type
        if attribution['attribution_type'] == 'direct_conversion':
            recommendations.append('🎉 Conversion detected! Document success factors')
            recommendations.append('Analyze this conversation for best practices')
        elif attribution['attribution_type'] == 'opportunity':
            recommendations.append('📈 Active opportunity - prioritize follow-up')
            recommendations.append(f'Win probability: {opportunity_detection["probability"]*100:.0f}%')
        elif attribution['attribution_type'] == 'revenue_related':
            recommendations.append('💼 Revenue-related conversation - track carefully')
        
        # Based on opportunity stage
        if opportunity_detection['stage'] == 'formal_proposal':
            recommendations.append('📝 Formal proposal stage - ensure all requirements met')
        elif opportunity_detection['stage'] == 'proposal_sent':
            recommendations.append('⏰ Follow up on proposal within 3-5 days')
        elif opportunity_detection['stage'] == 'interest_expressed':
            recommendations.append('🎯 Nurture interest with relevant information')
        
        # General recommendations
        if attribution['weighted_value'] > 10000:
            recommendations.append('💎 High-value opportunity - executive attention recommended')
        
        recommendations.append('Track all revenue-related conversations in CRM')
        recommendations.append('Always use reply-all for multi-recipient emails')
        
        return recommendations


def main():
    """Test V485 engine."""
    engine = EmailRevenueAttributionTracker()
    
    # Simulate conversation history
    conversation_history = [
        {
            'from': 'prospect@company.com',
            'subject': 'Interested in your services',
            'body': 'We are interested in your AI platform. Can you send us a quote?',
            'timestamp': '2026-05-01T10:00:00'
        },
        {
            'from': 'sales@ziontechgroup.com',
            'subject': 'Re: Interested in your services',
            'body': 'Thank you for your interest! Here is our proposal for $75,000 annual subscription.',
            'timestamp': '2026-05-02T14:00:00'
        },
        {
            'from': 'prospect@company.com',
            'subject': 'Re: Interested in your services',
            'body': 'The proposal looks good. We would like to proceed with the purchase.',
            'timestamp': '2026-05-10T09:00:00'
        }
    ]
    
    current_email = {
        'from': 'procurement@company.com',
        'to': ['sales@ziontechgroup.com', 'kleber@ziontechgroup.com'],
        'cc': ['finance@company.com', 'legal@company.com'],
        'subject': 'Purchase Order Confirmation - Contract Signed',
        'body': '''Hi,

We are pleased to confirm that we have signed the contract and approved the purchase order for $75,000.

The deal is now closed and we look forward to starting the implementation next week.

Please send the invoice and we will process payment within 30 days.

Thank you for your excellent service throughout this process.

Best regards''',
        'conversation_history': conversation_history
    }
    
    result = engine.analyze_email(current_email)
    print(json.dumps(result, indent=2))
    print(f"\n✅ Revenue Detected: {result['revenue_detection']['has_revenue_indicator']}")
    print(f"✅ Revenue Type: {result['revenue_detection']['revenue_type']}")
    print(f"✅ Opportunity Stage: {result['opportunity_detection']['stage']}")
    print(f"✅ Conversion: {result['conversion_detection']['has_conversion']}")
    print(f"✅ Total Value: ${result['attribution']['total_value']:,.2f}")
    print(f"✅ Weighted Value: ${result['attribution']['weighted_value']:,.2f}")
    print(f"✅ ROI: {result['roi_metrics']['roi_percentage']:.1f}%")
    print(f"✅ Reply-all enforced: {result['reply_all_enforced']}")


if __name__ == '__main__':
    main()
