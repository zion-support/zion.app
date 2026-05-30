#!/usr/bin/env python3
"""
V195 - AI Email Decision Matrix Builder
Analyzes emails requiring decisions, extracts key factors, builds weighted decision matrices,
calculates expected value and risk, identifies decision fatigue, and tracks outcomes.
"""

import json
import re
from datetime import datetime
from typing import Dict, List, Any
from collections import defaultdict


class DecisionMatrixBuilder:
    """AI-powered decision matrix building for emails."""
    
    def __init__(self):
        self.decision_history = defaultdict(list)
        self.outcome_tracking = {}
    
    def build_decision_matrix(self, email: Dict[str, Any], context: Dict = None) -> Dict[str, Any]:
        """Build decision matrix from email requiring decision."""
        if not email:
            return {'error': 'No email provided'}
        
        context = context or {}
        body = email.get('body', '')
        subject = email.get('subject', '')
        
        # Check if decision is required
        decision_required = self._check_decision_required(body, subject)
        
        if not decision_required:
            return {
                'decision_required': False,
                'message': 'No decision appears to be required'
            }
        
        # Extract decision context
        decision_context = self._extract_decision_context(body, subject)
        
        # Identify options
        options = self._identify_options(body, context)
        
        # Extract decision factors
        factors = self._extract_decision_factors(body, context)
        
        # Build weighted matrix
        matrix = self._build_weighted_matrix(options, factors)
        
        # Calculate expected value
        expected_value = self._calculate_expected_value(matrix)
        
        # Assess risk
        risk_assessment = self._assess_risk(matrix, context)
        
        # Check for decision fatigue
        fatigue = self._check_decision_fatigue(email.get('from', ''))
        
        # Generate recommendation
        recommendation = self._generate_recommendation(matrix, expected_value, risk_assessment)
        
        # Track decision
        self._track_decision(email, matrix, recommendation)
        
        return {
            'analysis_id': f"decision_{datetime.now().strftime('%Y%m%d%H%M%S')}",
            'timestamp': datetime.now().isoformat(),
            'decision_required': True,
            'decision_context': decision_context,
            'options': options,
            'decision_factors': factors,
            'decision_matrix': matrix,
            'expected_value': expected_value,
            'risk_assessment': risk_assessment,
            'decision_fatigue': fatigue,
            'recommendation': recommendation,
            'reply_all_strategy': self._determine_reply_all_strategy(options, recommendation)
        }
    
    def _check_decision_required(self, body: str, subject: str) -> bool:
        """Check if email requires a decision."""
        decision_indicators = [
            'decide', 'decision', 'choose', 'choice', 'option', 'select',
            'approve', 'reject', 'accept', 'decline', 'which', 'should we',
            'your call', 'your decision', 'need your input', 'what do you think'
        ]
        
        content = f"{subject} {body}".lower()
        return any(indicator in content for indicator in decision_indicators)
    
    def _extract_decision_context(self, body: str, subject: str) -> Dict[str, Any]:
        """Extract decision context from email."""
        # Extract deadline
        deadline = self._extract_deadline(body)
        
        # Extract stakes
        stakes = self._extract_stakes(body)
        
        # Extract constraints
        constraints = self._extract_constraints(body)
        
        return {
            'subject': subject,
            'deadline': deadline,
            'stakes': stakes,
            'constraints': constraints,
            'urgency': self._assess_urgency(body, deadline)
        }
    
    def _extract_deadline(self, body: str) -> Dict[str, Any]:
        """Extract decision deadline."""
        deadline_patterns = [
            r'by (\w+day)',
            r'until (\w+day)',
            r'need.*?by (\d{1,2}/\d{1,2})',
            r'deadline.*?(\d{1,2}/\d{1,2})',
            r'asap',
            r'immediately'
        ]
        
        for pattern in deadline_patterns:
            match = re.search(pattern, body, re.IGNORECASE)
            if match:
                return {
                    'detected': True,
                    'value': match.group(1) if match.groups() else 'immediate',
                    'type': 'explicit' if match.groups() else 'implied'
                }
        
        return {'detected': False, 'value': None, 'type': 'none'}
    
    def _extract_stakes(self, body: str) -> Dict[str, Any]:
        """Extract decision stakes."""
        money_pattern = r'\$[\d,]+(?:\.\d{2})?'
        money_matches = re.findall(money_pattern, body)
        
        high_stakes_indicators = ['critical', 'major', 'significant', 'important', 'high-impact']
        has_high_stakes = any(ind in body.lower() for ind in high_stakes_indicators)
        
        return {
            'financial_impact': money_matches[:3] if money_matches else [],
            'high_stakes': has_high_stakes,
            'impact_level': 'high' if has_high_stakes or money_matches else 'medium'
        }
    
    def _extract_constraints(self, body: str) -> List[str]:
        """Extract decision constraints."""
        constraint_indicators = [
            'budget', 'limited', 'cannot', 'must', 'requirement', 'constraint',
            'restriction', 'limitation', 'only if', 'as long as'
        ]
        
        constraints = []
        for indicator in constraint_indicators:
            if indicator in body.lower():
                # Extract context around constraint
                pattern = rf'([^.]*{indicator}[^.]*)'
                matches = re.findall(pattern, body, re.IGNORECASE)
                constraints.extend([m.strip()[:100] for m in matches[:2]])
        
        return constraints[:5]
    
    def _assess_urgency(self, body: str, deadline: Dict) -> str:
        """Assess decision urgency."""
        urgency_indicators = ['urgent', 'asap', 'immediately', 'critical', 'time-sensitive']
        
        if any(ind in body.lower() for ind in urgency_indicators):
            return 'high'
        elif deadline.get('detected') and deadline.get('type') == 'implied':
            return 'high'
        elif deadline.get('detected'):
            return 'medium'
        else:
            return 'low'
    
    def _identify_options(self, body: str, context: Dict) -> List[Dict[str, Any]]:
        """Identify decision options."""
        options = []
        
        # Look for explicit options
        option_patterns = [
            r'option\s+(\w+):',
            r'(\w+)\s+or\s+(\w+)',
            r'we could\s+(\w+)',
            r'we might\s+(\w+)'
        ]
        
        for pattern in option_patterns:
            matches = re.findall(pattern, body, re.IGNORECASE)
            for match in matches:
                if isinstance(match, tuple):
                    options.extend([{'name': m, 'description': m, 'source': 'extracted'} for m in match if len(m) > 2])
                else:
                    options.append({'name': match, 'description': match, 'source': 'extracted'})
        
        # Add default options if none found
        if not options:
            options = [
                {'name': 'Accept', 'description': 'Accept the proposal as presented', 'source': 'default'},
                {'name': 'Reject', 'description': 'Decline the proposal', 'source': 'default'},
                {'name': 'Negotiate', 'description': 'Request modifications', 'source': 'default'},
                {'name': 'Defer', 'description': 'Delay decision for more information', 'source': 'default'}
            ]
        
        return options[:6]
    
    def _extract_decision_factors(self, body: str, context: Dict) -> List[Dict[str, Any]]:
        """Extract decision factors."""
        factors = []
        
        # Common decision factors
        factor_keywords = {
            'cost': ['cost', 'price', 'budget', 'expense', 'financial'],
            'time': ['time', 'timeline', 'schedule', 'duration', 'deadline'],
            'risk': ['risk', 'uncertainty', 'concern', 'problem', 'issue'],
            'quality': ['quality', 'standard', 'excellence', 'performance'],
            'impact': ['impact', 'effect', 'influence', 'outcome', 'result'],
            'feasibility': ['feasible', 'possible', 'realistic', 'achievable']
        }
        
        for factor_name, keywords in factor_keywords.items():
            if any(kw in body.lower() for kw in keywords):
                factors.append({
                    'name': factor_name,
                    'weight': 0.2,  # Default weight
                    'description': f'{factor_name.capitalize()} considerations'
                })
        
        # Ensure at least 3 factors
        if len(factors) < 3:
            default_factors = ['cost', 'time', 'risk', 'quality', 'impact']
            for factor in default_factors:
                if not any(f['name'] == factor for f in factors):
                    factors.append({
                        'name': factor,
                        'weight': 0.2,
                        'description': f'{factor.capitalize()} considerations'
                    })
                    if len(factors) >= 5:
                        break
        
        # Normalize weights
        total_weight = sum(f['weight'] for f in factors)
        for factor in factors:
            factor['weight'] = round(factor['weight'] / total_weight, 2)
        
        return factors[:5]
    
    def _build_weighted_matrix(self, options: List, factors: List) -> Dict[str, Any]:
        """Build weighted decision matrix."""
        matrix = {}
        
        for option in options:
            option_name = option['name']
            matrix[option_name] = {
                'scores': {},
                'weighted_score': 0
            }
            
            total_weighted = 0
            for factor in factors:
                # Simulate scoring (in real implementation, this would be user input or AI estimation)
                score = self._estimate_score(option_name, factor['name'])
                weighted = score * factor['weight']
                
                matrix[option_name]['scores'][factor['name']] = {
                    'score': score,
                    'weight': factor['weight'],
                    'weighted': round(weighted, 2)
                }
                
                total_weighted += weighted
            
            matrix[option_name]['weighted_score'] = round(total_weighted, 2)
        
        return matrix
    
    def _estimate_score(self, option_name: str, factor_name: str) -> float:
        """Estimate score for option-factor combination."""
        # Simulated scoring based on option and factor names
        # In real implementation, this would use AI or user input
        
        base_scores = {
            'accept': {'cost': 6, 'time': 8, 'risk': 7, 'quality': 8, 'impact': 8},
            'reject': {'cost': 9, 'time': 9, 'risk': 9, 'quality': 3, 'impact': 2},
            'negotiate': {'cost': 7, 'time': 5, 'risk': 6, 'quality': 7, 'impact': 7},
            'defer': {'cost': 8, 'time': 3, 'risk': 5, 'quality': 6, 'impact': 5}
        }
        
        option_lower = option_name.lower()
        factor_lower = factor_name.lower()
        
        for key in base_scores:
            if key in option_lower:
                return base_scores[key].get(factor_lower, 5)
        
        return 5  # Default neutral score
    
    def _calculate_expected_value(self, matrix: Dict) -> Dict[str, Any]:
        """Calculate expected value for each option."""
        ev_results = {}
        
        for option_name, data in matrix.items():
            weighted_score = data['weighted_score']
            
            # Convert to expected value (simplified)
            expected_value = weighted_score * 10  # Scale to 0-100
            
            ev_results[option_name] = {
                'expected_value': round(expected_value, 1),
                'confidence': 0.7  # Simulated confidence
            }
        
        # Find best option
        best_option = max(ev_results.items(), key=lambda x: x[1]['expected_value'])
        
        return {
            'option_values': ev_results,
            'best_option': best_option[0],
            'best_value': best_option[1]['expected_value']
        }
    
    def _assess_risk(self, matrix: Dict, context: Dict) -> Dict[str, Any]:
        """Assess risk for each option."""
        risk_assessment = {}
        
        for option_name, data in matrix.items():
            # Calculate risk based on variance in scores
            scores = [s['score'] for s in data['scores'].values()]
            
            if len(scores) > 1:
                import statistics
                variance = statistics.variance(scores)
            else:
                variance = 0
            
            risk_level = 'low' if variance < 2 else 'medium' if variance < 5 else 'high'
            
            risk_assessment[option_name] = {
                'risk_level': risk_level,
                'variance': round(variance, 2),
                'risk_factors': self._identify_risk_factors(option_name)
            }
        
        return risk_assessment
    
    def _identify_risk_factors(self, option_name: str) -> List[str]:
        """Identify risk factors for an option."""
        risk_factors = {
            'accept': ['Commitment lock-in', 'Opportunity cost'],
            'reject': ['Lost opportunity', 'Relationship impact'],
            'negotiate': ['Time cost', 'Potential deadlock'],
            'defer': ['Decision delay', 'Missed deadline']
        }
        
        for key in risk_factors:
            if key in option_name.lower():
                return risk_factors[key]
        
        return ['Unknown risks']
    
    def _check_decision_fatigue(self, sender: str) -> Dict[str, Any]:
        """Check for decision fatigue."""
        history = self.decision_history.get(sender, [])
        
        if len(history) < 5:
            return {'fatigue_level': 'unknown', 'score': 0}
        
        recent_decisions = history[-5:]
        decision_count = len(recent_decisions)
        
        fatigue_score = min(decision_count / 5 * 100, 100)
        
        if fatigue_score >= 80:
            return {
                'fatigue_level': 'high',
                'score': round(fatigue_score, 1),
                'recommendation': 'Consider delegating this decision or taking a break'
            }
        elif fatigue_score >= 50:
            return {
                'fatigue_level': 'medium',
                'score': round(fatigue_score, 1),
                'recommendation': 'Be aware of potential decision fatigue'
            }
        else:
            return {
                'fatigue_level': 'low',
                'score': round(fatigue_score, 1),
                'recommendation': 'Decision capacity is healthy'
            }
    
    def _generate_recommendation(self, matrix: Dict, expected_value: Dict, risk: Dict) -> Dict[str, Any]:
        """Generate decision recommendation."""
        best_option = expected_value['best_option']
        best_value = expected_value['best_value']
        risk_level = risk[best_option]['risk_level']
        
        if risk_level == 'high' and best_value < 70:
            confidence = 'low'
            action = 'Gather more information before deciding'
        elif risk_level == 'low' and best_value >= 70:
            confidence = 'high'
            action = f'Proceed with {best_option}'
        else:
            confidence = 'medium'
            action = f'Consider {best_option} but review risks'
        
        return {
            'recommended_option': best_option,
            'confidence': confidence,
            'expected_value': best_value,
            'risk_level': risk_level,
            'action': action,
            'alternative_options': [opt for opt in matrix.keys() if opt != best_option][:2]
        }
    
    def _track_decision(self, email: Dict, matrix: Dict, recommendation: Dict):
        """Track decision for outcome analysis."""
        sender = email.get('from', '')
        
        self.decision_history[sender].append({
            'timestamp': datetime.now().isoformat(),
            'subject': email.get('subject', ''),
            'recommended': recommendation['recommended_option'],
            'confidence': recommendation['confidence'],
            'outcome': None  # To be updated later
        })
    
    def _determine_reply_all_strategy(self, options: List, recommendation: Dict) -> Dict[str, Any]:
        """Determine reply-all strategy."""
        return {
            'reply_all_recommended': True,
            'reason': 'Decision affects multiple stakeholders - keep all informed',
            'include_matrix': True,
            'highlight_recommendation': True
        }


def build_decision_matrix(email: Dict[str, Any], context: Dict = None) -> Dict[str, Any]:
    """Main entry point for decision matrix building."""
    builder = DecisionMatrixBuilder()
    return builder.build_decision_matrix(email, context)


if __name__ == '__main__':
    test_email = {
        'from': 'manager@company.com',
        'subject': 'Decision needed: Vendor selection',
        'body': 'We need to decide between three vendors for the new software. Option A costs $50,000 with fast delivery. Option B is $40,000 but takes longer. Option C is $60,000 with premium support. We need to decide by Friday. This is a critical decision that will impact our Q2 timeline. What do you think we should choose?',
        'date': '2024-01-15T10:00:00'
    }
    
    result = build_decision_matrix(test_email)
    print(json.dumps(result, indent=2))
