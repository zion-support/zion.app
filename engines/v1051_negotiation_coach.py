#!/usr/bin/env python3
"""V1051: AI Email Negotiation Coach
Real-time coaching during business negotiations.
Analyzes counterpart's language patterns and leverage points.
Suggests optimal counter-offers and timing strategies.
MANDATORY: Reply-all enforcement for multi-recipient emails.
"""

import re
import json
from datetime import datetime
from collections import defaultdict

class NegotiationCoach:
    def __init__(self):
        self.negotiation_history = []
        self.leverage_indicators = {
            'strong_buyer': ['budget approved', 'ready to sign', 'decision made', 'urgent need', 'no alternatives'],
            'weak_buyer': ['shopping around', 'comparing options', 'need approval', 'budget constraints', 'timeline flexible'],
            'strong_seller': ['limited availability', 'high demand', 'exclusive offer', 'time-limited', 'premium quality'],
            'weak_seller': ['flexible pricing', 'available anytime', 'willing to negotiate', 'customizable', 'volume discounts']
        }
        
        self.urgency_signals = {
            'high': ['immediately', 'urgent', 'asap', 'deadline', 'time-sensitive', 'cannot wait'],
            'medium': ['soon', 'this week', 'quickly', 'priority', 'important'],
            'low': ['when ready', 'no rush', 'flexible timeline', 'eventually', 'sometime']
        }
        
        self.objection_patterns = {
            'price': ['too expensive', 'over budget', 'cost too high', 'pricey', 'afford'],
            'timing': ['not right time', 'later', 'delay', 'postpone', 'wait'],
            'authority': ['need approval', 'check with', 'not my decision', 'higher up'],
            'need': ['don\'t need', 'not necessary', 'already have', 'satisfied with current'],
            'trust': ['not sure', 'concerned', 'worried', 'risk', 'unproven']
        }
        
        self.closing_signals = {
            'positive': ['sounds good', 'interested', 'next steps', 'contract', 'agreement', 'proceed', 'move forward'],
            'hesitant': ['maybe', 'possibly', 'might', 'consider', 'think about'],
            'negative': ['not interested', 'pass', 'decline', 'no thanks', 'won\'t work']
        }
    
    def analyze_negotiation_email(self, email_data):
        """Analyze negotiation email and provide coaching."""
        sender = email_data.get('sender', 'unknown')
        recipients = email_data.get('recipients', [])
        subject = email_data.get('subject', '')
        body = email_data.get('body', '')
        thread_history = email_data.get('thread_history', [])
        
        # REPLY-ALL ENFORCEMENT
        reply_all = len(recipients) > 1
        
        # Analyze leverage position
        leverage = self._analyze_leverage(body, sender)
        
        # Detect urgency
        urgency = self._detect_urgency(body)
        
        # Identify objections
        objections = self._identify_objections(body)
        
        # Detect closing signals
        closing_signals = self._detect_closing_signals(body)
        
        # Analyze negotiation stage
        stage = self._determine_negotiation_stage(thread_history, body)
        
        # Generate coaching recommendations
        coaching = self._generate_coaching(leverage, urgency, objections, closing_signals, stage)
        
        # Suggest counter-offers
        counter_offers = self._suggest_counter_offers(body, leverage, stage)
        
        # Timing recommendations
        timing = self._recommend_timing(urgency, stage, closing_signals)
        
        return {
            'email_id': email_data.get('id'),
            'reply_all_required': reply_all,
            'negotiation_stage': stage,
            'leverage_position': leverage,
            'urgency_level': urgency,
            'objections_detected': objections,
            'closing_signals': closing_signals,
            'coaching_recommendations': coaching,
            'suggested_counter_offers': counter_offers,
            'timing_recommendation': timing,
            'response_strategy': self._generate_response_strategy(stage, leverage, closing_signals),
            'risk_assessment': self._assess_risks(objections, leverage, closing_signals),
            'contact_info': {
                'phone': '+1 302 464 0950',
                'email': 'kleber@ziontechgroup.com',
                'address': '364 E Main St STE 1008, Middletown DE 19709'
            }
        }
    
    def _analyze_leverage(self, body, sender):
        """Analyze who has leverage in the negotiation."""
        text = body.lower()
        
        buyer_signals = {'strong': 0, 'weak': 0}
        seller_signals = {'strong': 0, 'weak': 0}
        
        for phrase in self.leverage_indicators['strong_buyer']:
            if phrase in text:
                buyer_signals['strong'] += 1
        for phrase in self.leverage_indicators['weak_buyer']:
            if phrase in text:
                buyer_signals['weak'] += 1
        for phrase in self.leverage_indicators['strong_seller']:
            if phrase in text:
                seller_signals['strong'] += 1
        for phrase in self.leverage_indicators['weak_seller']:
            if phrase in text:
                seller_signals['weak'] += 1
        
        buyer_score = buyer_signals['strong'] - buyer_signals['weak']
        seller_score = seller_signals['strong'] - seller_signals['weak']
        
        if buyer_score > seller_score:
            return {
                'position': 'buyer_advantage',
                'score': buyer_score,
                'recommendation': 'Buyer has leverage. Hold firm on price, emphasize value.'
            }
        elif seller_score > buyer_score:
            return {
                'position': 'seller_advantage',
                'score': seller_score,
                'recommendation': 'Seller has leverage. Can push for better terms.'
            }
        else:
            return {
                'position': 'balanced',
                'score': 0,
                'recommendation': 'Balanced negotiation. Focus on win-win outcomes.'
            }
    
    def _detect_urgency(self, body):
        """Detect urgency level in the email."""
        text = body.lower()
        
        urgency_counts = {'high': 0, 'medium': 0, 'low': 0}
        
        for level, phrases in self.urgency_signals.items():
            for phrase in phrases:
                if phrase in text:
                    urgency_counts[level] += 1
        
        if urgency_counts['high'] > 0:
            return {'level': 'high', 'score': urgency_counts['high'], 'action': 'Respond immediately'}
        elif urgency_counts['medium'] > 0:
            return {'level': 'medium', 'score': urgency_counts['medium'], 'action': 'Respond within 24 hours'}
        else:
            return {'level': 'low', 'score': urgency_counts['low'], 'action': 'Respond within 48 hours'}
    
    def _identify_objections(self, body):
        """Identify objections raised in the email."""
        text = body.lower()
        objections = []
        
        for objection_type, patterns in self.objection_patterns.items():
            for pattern in patterns:
                if pattern in text:
                    objections.append({
                        'type': objection_type,
                        'phrase': pattern,
                        'severity': 'high' if objection_type in ['price', 'trust'] else 'medium'
                    })
                    break
        
        return objections
    
    def _detect_closing_signals(self, body):
        """Detect signals that indicate readiness to close."""
        text = body.lower()
        signals = {'positive': 0, 'hesitant': 0, 'negative': 0}
        
        for signal_type, phrases in self.closing_signals.items():
            for phrase in phrases:
                if phrase in text:
                    signals[signal_type] += 1
        
        if signals['positive'] > signals['hesitant'] + signals['negative']:
            return {'type': 'ready_to_close', 'confidence': min(100, signals['positive'] * 20)}
        elif signals['negative'] > signals['positive']:
            return {'type': 'not_ready', 'confidence': min(100, signals['negative'] * 20)}
        else:
            return {'type': 'needs_nurturing', 'confidence': 50}
    
    def _determine_negotiation_stage(self, thread_history, body):
        """Determine current stage of negotiation."""
        email_count = len(thread_history) if thread_history else 1
        
        if email_count == 1:
            return 'initial_contact'
        elif email_count <= 3:
            return 'discovery'
        elif email_count <= 6:
            return 'proposal'
        elif email_count <= 10:
            return 'negotiation'
        else:
            return 'closing'
    
    def _generate_coaching(self, leverage, urgency, objections, closing_signals, stage):
        """Generate coaching recommendations."""
        coaching = []
        
        # Stage-based coaching
        stage_coaching = {
            'initial_contact': 'Focus on building rapport and understanding needs. Don\'t discuss pricing yet.',
            'discovery': 'Ask probing questions. Identify pain points and decision criteria.',
            'proposal': 'Present value proposition clearly. Highlight ROI and differentiation.',
            'negotiation': 'Address objections directly. Use leverage wisely. Aim for win-win.',
            'closing': 'Create urgency. Summarize benefits. Ask for commitment.'
        }
        coaching.append(stage_coaching.get(stage, 'Continue building relationship.'))
        
        # Leverage-based coaching
        if leverage['position'] == 'buyer_advantage':
            coaching.append('💪 You have leverage. Hold firm on price. Emphasize unique value.')
        elif leverage['position'] == 'seller_advantage':
            coaching.append('⚠️ Counterpart has leverage. Be flexible but protect margins.')
        
        # Objection handling
        if objections:
            for obj in objections[:2]:
                if obj['type'] == 'price':
                    coaching.append('💰 Address price objection: Focus on ROI, offer payment terms, or bundle value.')
                elif obj['type'] == 'timing':
                    coaching.append('⏰ Address timing: Show urgency, offer implementation timeline, or phase rollout.')
                elif obj['type'] == 'authority':
                    coaching.append('👥 Address authority: Offer to present to decision-makers, provide materials.')
        
        # Closing signals
        if closing_signals['type'] == 'ready_to_close':
            coaching.append('🎯 Prospect is ready! Ask for commitment. Propose next steps.')
        elif closing_signals['type'] == 'needs_nurturing':
            coaching.append('🌱 Prospect needs more nurturing. Provide case studies, testimonials, or demo.')
        
        return coaching
    
    def _suggest_counter_offers(self, body, leverage, stage):
        """Suggest counter-offers based on negotiation context."""
        text = body.lower()
        offers = []
        
        # Extract price mentions
        price_matches = re.findall(r'\$\s*([\d,]+)', text)
        
        if price_matches and stage in ['proposal', 'negotiation', 'closing']:
            for price in price_matches[:2]:
                price_val = int(price.replace(',', ''))
                
                if leverage['position'] == 'seller_advantage':
                    # Counter higher
                    offers.append({
                        'type': 'counter_higher',
                        'amount': f"${int(price_val * 1.1):,}",
                        'rationale': 'You have leverage. Test their ceiling.'
                    })
                elif leverage['position'] == 'buyer_advantage':
                    # Hold or counter slightly lower
                    offers.append({
                        'type': 'hold_firm',
                        'amount': f"${price_val:,}",
                        'rationale': 'Hold firm. You have leverage.'
                    })
                else:
                    # Meet in middle
                    offers.append({
                        'type': 'compromise',
                        'amount': f"${int(price_val * 0.95):,}",
                        'rationale': 'Balanced negotiation. Small concession shows goodwill.'
                    })
        
        # Alternative offers
        if stage == 'negotiation':
            offers.append({
                'type': 'value_add',
                'description': 'Add value instead of discounting (training, support, extended warranty)',
                'rationale': 'Protects margins while addressing concerns.'
            })
        
        return offers
    
    def _recommend_timing(self, urgency, stage, closing_signals):
        """Recommend optimal timing for response."""
        if urgency['level'] == 'high':
            return {
                'response_time': 'within 1 hour',
                'rationale': 'High urgency detected. Quick response shows commitment.'
            }
        elif closing_signals['type'] == 'ready_to_close':
            return {
                'response_time': 'within 4 hours',
                'rationale': 'Prospect ready to close. Strike while iron is hot.'
            }
        elif stage == 'negotiation':
            return {
                'response_time': 'within 24 hours',
                'rationale': 'Allow time for consideration but maintain momentum.'
            }
        else:
            return {
                'response_time': 'within 48 hours',
                'rationale': 'Standard response time. No urgency detected.'
            }
    
    def _generate_response_strategy(self, stage, leverage, closing_signals):
        """Generate overall response strategy."""
        strategies = []
        
        if stage == 'closing' and closing_signals['type'] == 'ready_to_close':
            strategies.append('🎯 Direct close: "Shall we proceed with the agreement?"')
            strategies.append('📝 Send contract for signature')
        elif stage == 'negotiation' and leverage['position'] == 'buyer_advantage':
            strategies.append('💪 Hold firm on terms. Emphasize value.')
            strategies.append('🎁 Offer small concession (implementation support, training)')
        elif stage == 'discovery':
            strategies.append('❓ Ask clarifying questions')
            strategies.append('📊 Request decision criteria')
        else:
            strategies.append('📧 Maintain relationship momentum')
            strategies.append('🎯 Move to next stage in sales process')
        
        return strategies
    
    def _assess_risks(self, objections, leverage, closing_signals):
        """Assess risks in the negotiation."""
        risks = []
        
        if closing_signals['type'] == 'not_ready':
            risks.append({
                'type': 'deal_stall',
                'severity': 'high',
                'mitigation': 'Re-engage with new value proposition or incentive'
            })
        
        if any(obj['type'] == 'price' and obj['severity'] == 'high' for obj in objections):
            risks.append({
                'type': 'price_competition',
                'severity': 'medium',
                'mitigation': 'Differentiate on value, not price. Offer flexible terms.'
            })
        
        if leverage['position'] == 'seller_advantage' and leverage['score'] > 2:
            risks.append({
                'type': 'lost_deal',
                'severity': 'high',
                'mitigation': 'Counterpart may walk away. Consider strategic concession.'
            })
        
        return risks


if __name__ == '__main__':
    coach = NegotiationCoach()
    
    test_emails = [
        {
            'id': 'e001',
            'sender': 'prospect@company.com',
            'recipients': ['sales@ziontechgroup.com', 'ceo@company.com'],
            'subject': 'Re: AI Platform Proposal - Price Concerns',
            'body': """Hi team,

We reviewed your proposal. The $250,000 price point is too expensive for our current budget. We're comparing with 3 other vendors who are offering similar solutions at $180,000.

We need to make a decision by next Friday as our board has approved the budget and we're ready to sign. However, we need approval from our CFO who is concerned about ROI.

Can you provide more case studies and possibly offer a discount? We're interested but need to justify the investment.

Thanks""",
            'timestamp': '2026-05-30T14:00:00'
        }
    ]
    
    print("=== V1051: AI Email Negotiation Coach ===\n")
    
    for email in test_emails:
        result = coach.analyze_negotiation_email(email)
        print(f"Negotiation Stage: {result['negotiation_stage']}")
        print(f"Leverage: {result['leverage_position']['position']} (score: {result['leverage_position']['score']})")
        print(f"Urgency: {result['urgency_level']['level']}")
        print(f"Closing Signals: {result['closing_signals']['type']}")
        print(f"Reply-All: {'REQUIRED' if result['reply_all_required'] else 'N/A'}")
        
        print(f"\n📚 Coaching:")
        for rec in result['coaching_recommendations'][:4]:
            print(f"  {rec}")
        
        print(f"\n💰 Counter-Offers:")
        for offer in result['suggested_counter_offers'][:2]:
            print(f"  {offer.get('type')}: {offer.get('amount', offer.get('description', 'N/A'))}")
        
        print(f"\n⏰ Timing: {result['timing_recommendation']['response_time']}")
        print()
