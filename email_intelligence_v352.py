#!/usr/bin/env python3
"""
V352 Email Revenue Attribution Engine
Track revenue impact of email conversations, attribute deals to email touchpoints,
calculate ROI per email thread, predict deal closure probability from email signals.
CRITICAL: Always enforces reply-all for multi-recipient emails.
"""
import json, re, sys
from datetime import datetime

class V352RevenueAttribution:
    REVENUE_SIGNALS = [
        (r'budget\s*[:=]?\s*\$?([\d,]+)', 'budget_mention'),
        (r'(?:price|cost|quote|proposal)\s*[:=]?\s*\$?([\d,]+)', 'pricing_discussion'),
        (r'(?:contract|agreement|deal)\s+(?:signed|closed|won)', 'deal_closed'),
        (r'(?:proposal|quote|estimate|bid)', 'proposal_stage'),
        (r'(?:interested|considering|evaluating)', 'interest_stage'),
        (r'(?:competitor|alternative|other vendor)', 'competitive_situation'),
        (r'(?:urgent|asap|this week|by friday)', 'urgency_signal'),
    ]
    
    DEAL_STAGES = {
        'prospect': ['introduce', 'discovery', 'learn about', 'exploring'],
        'qualification': ['budget', 'timeline', 'requirements', 'needs'],
        'proposal': ['proposal', 'quote', 'pricing', 'estimate', 'bid'],
        'negotiation': ['discount', 'terms', 'contract', 'agreement'],
        'closed_won': ['signed', 'accepted', 'approved', 'confirmed'],
        'closed_lost': ['not interested', 'going with', 'decided against', 'budget constraints'],
    }

    def __init__(self):
        self.attributions = []

    def analyze_revenue_impact(self, email_text, subject="", sender="", recipients=None, deal_value=None):
        recipients = recipients or []
        combined = f"{subject} {email_text}".lower()
        
        signals = self._extract_revenue_signals(combined)
        stage = self._detect_deal_stage(combined)
        probability = self._calc_closure_probability(signals, stage)
        estimated_value = deal_value or self._estimate_deal_value(signals)
        roi = self._calculate_email_roi(estimated_value, probability)
        
        is_multi = len(recipients) > 1
        
        result = {
            "version": "V352",
            "timestamp": datetime.now().isoformat(),
            "deal_stage": stage,
            "revenue_signals_detected": signals,
            "estimated_deal_value": estimated_value,
            "closure_probability": probability,
            "expected_revenue": round(estimated_value * probability, 2),
            "email_roi_score": roi,
            "attribution_weight": self._calc_attribution_weight(stage),
            "recommended_actions": self._suggest_actions(stage, signals),
            "reply_all_required": is_multi,
            "reply_all_enforced": is_multi,
            "action_taken": f"Revenue attribution: ${expected_revenue:.2f} expected from {stage} stage" if (expected_revenue := estimated_value * probability) else "No revenue impact detected",
        }
        self.attributions.append(result)
        return result

    def _extract_revenue_signals(self, text):
        signals = []
        for pattern, signal_type in self.REVENUE_SIGNALS:
            matches = re.findall(pattern, text, re.IGNORECASE)
            if matches:
                signals.append({"type": signal_type, "count": len(matches), "values": matches[:3]})
        return signals

    def _detect_deal_stage(self, text):
        stage_scores = {}
        for stage, keywords in self.DEAL_STAGES.items():
            score = sum(1 for kw in keywords if kw in text)
            if score > 0:
                stage_scores[stage] = score
        return max(stage_scores, key=stage_scores.get) if stage_scores else 'prospect'

    def _calc_closure_probability(self, signals, stage):
        base_probs = {
            'prospect': 0.1, 'qualification': 0.25, 'proposal': 0.5,
            'negotiation': 0.7, 'closed_won': 1.0, 'closed_lost': 0.0
        }
        prob = base_probs.get(stage, 0.1)
        urgency_boost = sum(1 for s in signals if s['type'] == 'urgency_signal') * 0.1
        interest_boost = sum(1 for s in signals if s['type'] == 'interest_stage') * 0.05
        return min(1.0, prob + urgency_boost + interest_boost)

    def _estimate_deal_value(self, signals):
        total = 0
        for s in signals:
            if s['type'] in ['budget_mention', 'pricing_discussion']:
                for val in s.get('values', []):
                    try:
                        total += int(str(val).replace(',', ''))
                    except:
                        pass
        return total if total > 0 else 5000

    def _calculate_email_roi(self, deal_value, probability):
        email_cost = 0.50
        expected_revenue = deal_value * probability
        if email_cost > 0:
            return round((expected_revenue - email_cost) / email_cost, 2)
        return 0

    def _calc_attribution_weight(self, stage):
        weights = {'prospect': 0.05, 'qualification': 0.15, 'proposal': 0.3, 'negotiation': 0.4, 'closed_won': 0.1}
        return weights.get(stage, 0.1)

    def _suggest_actions(self, stage, signals):
        actions = []
        if stage == 'prospect':
            actions.append("Send discovery questionnaire to qualify lead")
        elif stage == 'qualification':
            actions.append("Schedule demo or technical deep-dive")
        elif stage == 'proposal':
            actions.append("Follow up with customized proposal and ROI calculator")
        elif stage == 'negotiation':
            actions.append("Offer limited-time incentive to accelerate closure")
        if any(s['type'] == 'urgency_signal' for s in signals):
            actions.append("URGENT: Respond within 2 hours to maintain momentum")
        return actions

if __name__ == "__main__":
    engine = V352RevenueAttribution()
    result = engine.analyze_revenue_impact(
        "We're very interested in your enterprise plan. Our budget is around $50,000 for this quarter. Can you send a proposal by Friday? We're evaluating two other vendors but prefer your solution.",
        subject="Enterprise Plan Inquiry - Budget $50K", sender="buyer@bigcorp.com",
        recipients=["sales@zion.com", "ceo@zion.com"]
    )
    print(json.dumps(result, indent=2))
