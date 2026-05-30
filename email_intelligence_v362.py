#!/usr/bin/env python3
"""
V362: Email Negotiation Intelligence
Detect negotiation signals, track concession patterns, suggest optimal counter-offers,
identify decision-makers, generate negotiation strategy briefings.
"""
import re
import json
from datetime import datetime
from typing import Dict, List

class NegotiationIntelligence:
    def __init__(self):
        self.negotiation_signals = [
            r'price', r'cost', r'budget', r'discount', r'offer', r'deal',
            r'negotiate', r'terms', r'contract', r'agreement', r'proposal',
            r'counter', r'compromise', r'flexible', r'room for discussion'
        ]
        self.leverage_patterns = [
            r'competitor', r'alternative', r'other (?:vendor|provider)',
            r'considering other options', r'better (?:price|offer|deal)',
            r'limited budget', r'need to justify', r'approval required'
        ]
        self.concession_patterns = [
            r'can (?:do|offer)', r'willing to', r'best (?:we|I) can',
            r'maximum', r'final offer', r'non-negotiable', r'firm'
        ]
        self.urgency_patterns = [
            r'deadline', r'time-sensitive', r'limited time', r'expiring',
            r'need (?:decision|answer) by', r'urgent', r'asap'
        ]
    
    def detect_negotiation_context(self, text: str) -> Dict:
        """Detect negotiation signals and context"""
        text_lower = text.lower()
        
        signals = {
            'negotiation_detected': any(re.search(p, text_lower) for p in self.negotiation_signals),
            'leverage_points': [p for p in self.leverage_patterns if re.search(p, text_lower)],
            'concessions': [p for p in self.concession_patterns if re.search(p, text_lower)],
            'urgency': any(re.search(p, text_lower) for p in self.urgency_patterns)
        }
        
        return signals
    
    def identify_decision_makers(self, emails: List[Dict]) -> List[Dict]:
        """Identify key decision-makers in thread"""
        decision_makers = {}
        authority_patterns = [
            r'approve', r'authorize', r'decide', r'final say',
            r'my decision', r'I (?:will|can) approve', r'sign off'
        ]
        
        for email in emails:
            sender = email.get('sender', '')
            body = email.get('body', '').lower()
            
            authority_score = sum(1 for p in authority_patterns if re.search(p, body))
            if authority_score > 0:
                decision_makers[sender] = {
                    'authority_score': authority_score,
                    'role': 'decision_maker' if authority_score > 2 else 'influencer'
                }
        
        return [{'email': k, **v} for k, v in sorted(
            decision_makers.items(), 
            key=lambda x: x[1]['authority_score'], 
            reverse=True
        )]
    
    def suggest_counter_offer(self, context: Dict, history: List[Dict]) -> Dict:
        """Suggest optimal counter-offer based on context"""
        suggestions = []
        
        if context.get('urgency'):
            suggestions.append('Leverage urgency: offer time-limited discount')
        
        if context.get('leverage_points'):
            suggestions.append('Address competitive concerns with value differentiation')
        
        if not context.get('concessions'):
            suggestions.append('Room for negotiation: consider 10-15% flexibility')
        else:
            suggestions.append('Near limit: hold firm or offer non-monetary value')
        
        return {
            'suggestions': suggestions,
            'confidence': 0.75 if context.get('negotiation_detected') else 0.4,
            'recommended_approach': 'collaborative' if len(history) > 3 else 'assertive'
        }
    
    def analyze_thread(self, emails: List[Dict]) -> Dict:
        """Full negotiation analysis"""
        all_text = ' '.join([e.get('body', '') for e in emails])
        context = self.detect_negotiation_context(all_text)
        decision_makers = self.identify_decision_makers(emails)
        counter_offer = self.suggest_counter_offer(context, emails)
        
        recipients = emails[-1].get('recipients', []) if emails else []
        reply_all_required = len(recipients) > 1
        
        return {
            'engine': 'V362',
            'negotiation_context': context,
            'decision_makers': decision_makers,
            'counter_offer_strategy': counter_offer,
            'thread_length': len(emails),
            'reply_all_required': reply_all_required,
            'reply_all_enforced': reply_all_required,
            'timestamp': datetime.now().isoformat()
        }

if __name__ == '__main__':
    analyzer = NegotiationIntelligence()
    sample_thread = [
        {'sender': 'prospect@company.com', 'body': 'We are considering other vendors with better pricing. Can you offer a discount?', 'recipients': ['sales@company.com', 'manager@company.com']},
        {'sender': 'sales@company.com', 'body': 'I can offer 10% off the first year. This is the best we can do.', 'recipients': ['prospect@company.com', 'manager@company.com']},
        {'sender': 'prospect@company.com', 'body': 'We need approval from our CEO by Friday. Can you improve the offer?', 'recipients': ['sales@company.com', 'manager@company.com']}
    ]
    
    result = analyzer.analyze_thread(sample_thread)
    print(json.dumps(result, indent=2))
