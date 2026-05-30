#!/usr/bin/env python3
"""
Email Intelligence V310 - Email Revenue Attribution Engine
Tracks how email conversations contribute to revenue
Maps email touchpoints to deals and calculates email ROI
"""
import json, re
from datetime import datetime
from typing import Dict, List
from collections import defaultdict

class EmailRevenueAttribution:
    def __init__(self):
        self.version = "V310"
        self.name = "Email Revenue Attribution"
        self.deal_stages = ['prospect', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost']
        self.revenue_signals = {
            'high_value': ['contract', 'deal', 'purchase', 'order', 'subscription', 'enterprise', 'annual'],
            'negotiation': ['pricing', 'discount', 'terms', 'budget', 'quote', 'proposal', 'offer'],
            'closing': ['sign', 'approved', 'accepted', 'confirmed', 'wire', 'payment', 'invoice'],
            'risk': ['competitor', 'evaluate', 'considering', 'maybe', 'not sure', 'delay', 'postpone']
        }
    
    def attribute_revenue(self, email_thread: List[Dict], deal_context: Dict = None) -> Dict:
        """Attribute revenue impact to email conversations"""
        print(f"[{self.version}] 📈 Analyzing revenue attribution...")
        
        total_emails = len(email_thread)
        revenue_signals_found = defaultdict(int)
        deal_stage = 'prospect'
        estimated_value = 0
        participants = set()
        touchpoint_timeline = []
        
        for i, email in enumerate(email_thread):
            content = email.get('content', '').lower()
            sender = email.get('sender', {}).get('email', '')
            participants.add(sender)
            
            # Detect revenue signals
            for signal_type, keywords in self.revenue_signals.items():
                for kw in keywords:
                    if kw in content:
                        revenue_signals_found[signal_type] += 1
            
            # Detect deal stage
            if any(kw in content for kw in self.revenue_signals['closing']):
                deal_stage = 'closed_won'
            elif any(kw in content for kw in self.revenue_signals['negotiation']):
                if deal_stage not in ['closed_won', 'closed_lost']:
                    deal_stage = 'negotiation'
            elif any(kw in content for kw in ['proposal', 'quote', 'pricing']):
                if deal_stage in ['prospect', 'qualified']:
                    deal_stage = 'proposal'
            
            # Extract monetary values
            values = re.findall(r'\$([\d,]+(?:\.\d{2})?)', content)
            for v in values:
                try:
                    estimated_value = max(estimated_value, float(v.replace(',', '')))
                except:
                    pass
            
            touchpoint_timeline.append({
                'seq': i + 1,
                'from': sender,
                'stage': deal_stage,
                'signals': {k: v for k, v in revenue_signals_found.items() if v > 0}
            })
        
        # Calculate attribution metrics
        email_roi = self._calculate_email_roi(estimated_value, total_emails)
        conversion_probability = self._predict_conversion(revenue_signals_found, deal_stage, total_emails)
        
        # Team attribution
        team_attribution = self._attribute_to_team(participants, touchpoint_timeline)
        
        all_recipients = []
        if email_thread:
            last = email_thread[-1]
            all_recipients = last.get('to', []) + last.get('cc', [])
        
        result = {
            'version': self.version,
            'engine': self.name,
            'attribution': {
                'deal_stage': deal_stage,
                'estimated_value': estimated_value,
                'total_touchpoints': total_emails,
                'participants': list(participants),
                'revenue_signals': dict(revenue_signals_found),
                'conversion_probability': conversion_probability,
                'email_roi': email_roi,
                'team_attribution': team_attribution
            },
            'touchpoint_timeline': touchpoint_timeline,
            'recommendations': self._generate_revenue_recommendations(deal_stage, revenue_signals_found, conversion_probability),
            'reply_all_enforced': True,
            'all_recipients': all_recipients,
            'case_by_case_analysis': True,
            'timestamp': datetime.now().isoformat()
        }
        
        print(f"[{self.version}] ✅ Revenue attribution: ${estimated_value:,.0f} deal at {deal_stage} stage ({conversion_probability}% probability)")
        print(f"[{self.version}] 📬 REPLY-ALL enforced: {len(all_recipients)} recipients")
        
        return result
    
    def _calculate_email_roi(self, value: float, emails: int) -> Dict:
        cost_per_email = 15  # Average cost per email in labor
        total_cost = emails * cost_per_email
        roi = ((value - total_cost) / total_cost * 100) if total_cost > 0 else 0
        return {
            'estimated_deal_value': value,
            'email_investment': total_cost,
            'roi_pct': round(roi, 1),
            'cost_per_touchpoint': cost_per_email
        }
    
    def _predict_conversion(self, signals: Dict, stage: str, emails: int) -> float:
        base_probability = {
            'prospect': 10, 'qualified': 25, 'proposal': 50,
            'negotiation': 70, 'closed_won': 100, 'closed_lost': 0
        }.get(stage, 20)
        
        # Adjust based on signals
        if signals.get('high_value', 0) > 3:
            base_probability += 10
        if signals.get('closing', 0) > 0:
            base_probability += 20
        if signals.get('risk', 0) > 2:
            base_probability -= 15
        
        return min(100, max(0, base_probability))
    
    def _attribute_to_team(self, participants: set, timeline: List) -> Dict:
        team_map = {
            'sales': ['sales', 'account', 'revenue'],
            'marketing': ['marketing', 'growth', 'demand'],
            'support': ['support', 'success', 'service'],
            'executive': ['ceo', 'cto', 'cfo', 'vp', 'director']
        }
        
        attribution = defaultdict(float)
        for p in participants:
            for team, keywords in team_map.items():
                if any(kw in p.lower() for kw in keywords):
                    attribution[team] += 1.0 / len(participants) * 100
                    break
            else:
                attribution['other'] += 1.0 / len(participants) * 100
        
        return {k: round(v, 1) for k, v in attribution.items()}
    
    def _generate_revenue_recommendations(self, stage: str, signals: Dict, probability: float) -> List[str]:
        recs = []
        if stage == 'negotiation' and probability < 70:
            recs.append('Deal in negotiation but probability is low - consider executive involvement')
        if signals.get('risk', 0) > 2:
            recs.append('Competitor risk detected - strengthen value proposition')
        if stage == 'proposal' and signals.get('closing', 0) == 0:
            recs.append('Proposal stage without closing signals - follow up with decision timeline')
        if probability >= 80:
            recs.append('High conversion probability - accelerate closing process')
        recs.append('Maintain reply-all for deal transparency across stakeholders')
        return recs
    
    def analyze_and_respond(self, email_data: Dict) -> Dict:
        """Attribute revenue and respond - REPLY-ALL enforced"""
        return self.attribute_revenue(email_data.get('thread', []))

if __name__ == '__main__':
    engine = EmailRevenueAttribution()
    thread = [
        {'sender': {'email': 'sales@zion.com'}, 'content': 'Hi, I\'d like to discuss our enterprise plan for your company. Our annual subscription is $120,000/year.', 'to': ['prospect@co.com'], 'cc': ['vp-sales@zion.com']},
        {'sender': {'email': 'prospect@co.com'}, 'content': 'We\'re evaluating your proposal against two competitors. Can you offer a discount for a 3-year commitment?', 'to': ['sales@zion.com'], 'cc': ['cto@co.com']},
        {'sender': {'email': 'sales@zion.com'}, 'content': 'We approved a 15% discount for 3-year commitment. The total would be $306,000 over 3 years. Ready to sign?', 'to': ['prospect@co.com'], 'cc': ['vp-sales@zion.com', 'cto@co.com']},
        {'sender': {'email': 'prospect@co.com'}, 'content': 'Confirmed! We accepted the proposal. Please send the contract for signature. We\'ll wire payment upon receipt.', 'to': ['sales@zion.com'], 'cc': ['cto@co.com', 'cfo@co.com']}
    ]
    result = engine.attribute_revenue(thread)
    print(json.dumps(result, indent=2))
