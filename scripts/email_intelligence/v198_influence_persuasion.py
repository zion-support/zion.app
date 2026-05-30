#!/usr/bin/env python3
"""
V198 - AI Email Influence & Persuasion Analyzer
Analyzes persuasion techniques in incoming emails (reciprocity, scarcity, authority, etc.),
scores influence attempts, identifies manipulation, suggests counter-persuasion strategies,
helps craft more persuasive outbound emails ethically, and tracks persuasion effectiveness.
"""

import json
import re
from datetime import datetime
from typing import Dict, List, Any
from collections import defaultdict


class InfluencePersuasionAnalyzer:
    """AI-powered influence and persuasion analysis for emails."""
    
    def __init__(self):
        self.persuasion_techniques = self._build_persuasion_techniques()
        self.manipulation_indicators = self._build_manipulation_indicators()
        self.ethical_guidelines = self._build_ethical_guidelines()
        self.persuasion_history = defaultdict(list)
    
    def _build_persuasion_techniques(self) -> Dict[str, Dict]:
        """Build Cialdini's 6 principles + additional techniques."""
        return {
            'reciprocity': {
                'description': 'Giving something to create obligation to return favor',
                'indicators': [
                    r'(?:free|complimentary|gift|bonus)\s+',
                    r'(?:I\'ve (?:given|provided|sent) you|as a (?:gift|favor|token))',
                    r'(?:special (?:offer|deal|discount) (?:just|only) for you)',
                    r'(?:in return|reciprocate|return the favor)'
                ],
                'weight': 0.8,
                'ethical': True
            },
            'scarcity': {
                'description': 'Highlighting limited availability or time',
                'indicators': [
                    r'(?:limited (?:time|offer|quantity|spots|availability))',
                    r'(?:only \d+ (?:left|remaining|spots|available))',
                    r'(?:expires? (?:today|soon|in \d+)|ends? (?:today|tonight|soon))',
                    r'(?:last chance|final opportunity|don\'t miss out)',
                    r'(?:while supplies last|until gone|first come)',
                    r'(?:exclusive|rare|unique|one-of-a-kind)'
                ],
                'weight': 0.9,
                'ethical': True
            },
            'authority': {
                'description': 'Leveraging credentials, expertise, or position',
                'indicators': [
                    r'(?:as (?:a|an) (?:expert|specialist|professional|authority))',
                    r'(?:with \d+ years? (?:of )?experience)',
                    r'(?:(?:Dr|Professor|CEO|President|Director)\.? \w+)',
                    r'(?:studies? (?:show|indicate|prove|demonstrate))',
                    r'(?:research (?:shows|indicates|confirms))',
                    r'(?:according to (?:experts?|research|data))'
                ],
                'weight': 0.7,
                'ethical': True
            },
            'social_proof': {
                'description': 'Showing that others are doing it',
                'indicators': [
                    r'(?:\d+(?:,\d+)* (?:customers?|clients?|users?|people|companies))',
                    r'(?:most popular|best-?selling|top-?rated|highest-?rated)',
                    r'(?:everyone (?:is|loves?|uses?|chooses?))',
                    r'(?:join (?:the|thousands?|millions?))',
                    r'(?:trusted by|used by|loved by)',
                    r'(?:testimonials?|reviews?|ratings?)'
                ],
                'weight': 0.8,
                'ethical': True
            },
            'liking': {
                'description': 'Building rapport and similarity',
                'indicators': [
                    r'(?:like you|similar to you|just like|same as you)',
                    r'(?:I (?:understand|relate to|feel your)|we\'re (?:alike|similar))',
                    r'(?:fellow|peer|colleague|friend)',
                    r'(?:complement|flatter|praise|admire)',
                    r'(?:I (?:love|appreciate|enjoy) (?:your|that))'
                ],
                'weight': 0.6,
                'ethical': True
            },
            'commitment': {
                'description': 'Getting small commitments that lead to larger ones',
                'indicators': [
                    r'(?:just (?:answer|confirm|click|sign|agree))',
                    r'(?:small (?:step|commitment|favor|request))',
                    r'(?:quick (?:question|survey|form|signup))',
                    r'(?:you (?:already|previously) (?:agreed|said|mentioned))',
                    r'(?:as you (?:know|mentioned|stated|agreed))'
                ],
                'weight': 0.7,
                'ethical': True
            },
            'urgency': {
                'description': 'Creating time pressure to act quickly',
                'indicators': [
                    r'(?:act now|do it now|respond now|reply now)',
                    r'(?:immediately|right away|asap|urgently)',
                    r'(?:time-?sensitive|time-?critical|urgent)',
                    r'(?:don\'t (?:wait|delay|hesitate))',
                    r'(?:this (?:won\'t|will not) last)'
                ],
                'weight': 0.85,
                'ethical': True
            },
            'fear': {
                'description': 'Highlighting negative consequences of not acting',
                'indicators': [
                    r'(?:you\'ll (?:miss|lose|regret|fail))',
                    r'(?:without this|if you don\'t|unless you)',
                    r'(?:risk|danger|threat|problem|issue)',
                    r'(?:consequences?|repercussions?|penalties?)',
                    r'(?:fall behind|left behind|miss out)'
                ],
                'weight': 0.9,
                'ethical': False
            }
        }
    
    def _build_manipulation_indicators(self) -> Dict[str, Dict]:
        """Build indicators of manipulative tactics."""
        return {
            'false_urgency': {
                'description': 'Creating artificial time pressure',
                'indicators': [
                    r'(?:only|just) (?:today|now|for you)',
                    r'(?:expires?|ends?) (?:in \d+ (?:minutes?|hours?))',
                    r'(?:limited (?:time|offer)).*(?:extended|still available)'
                ],
                'severity': 'high'
            },
            'guilt_tripping': {
                'description': 'Making recipient feel guilty for not complying',
                'indicators': [
                    r'(?:if you (?:really|truly) cared|if you (?:love|care about))',
                    r'(?:I (?:thought|expected|hoped) you would)',
                    r'(?:disappoint(ed|ing)|let (?:me|us) down)',
                    r'(?:after (?:all|everything) (?:I\'ve|we\'ve) done)'
                ],
                'severity': 'high'
            },
            'false_scarcity': {
                'description': 'Claiming limited availability when not true',
                'indicators': [
                    r'(?:only \d+ left).*(?:restocked|more available)',
                    r'(?:limited (?:quantity|spots)).*(?:always available|plenty)'
                ],
                'severity': 'high'
            },
            'emotional_manipulation': {
                'description': 'Exploiting emotions to bypass rational thinking',
                'indicators': [
                    r'(?:you (?:owe|should)|it\'s (?:only|just) fair)',
                    r'(?:everyone (?:else|otherwise) is)',
                    r'(?:don\'t you (?:want|care|love))',
                    r'(?:what (?:will|would) (?:people|others|they) think)'
                ],
                'severity': 'medium'
            },
            'deceptive_authority': {
                'description': 'False claims of expertise or credentials',
                'indicators': [
                    r'(?:expert|specialist|authority).*(?:no (?:experience|background))',
                    r'(?:certified|licensed|accredited).*(?:not (?:really|actually))'
                ],
                'severity': 'high'
            },
            'pressure_tactics': {
                'description': 'Aggressive pressure to decide immediately',
                'indicators': [
                    r'(?:decide now|commit now|sign now)',
                    r'(?:no (?:time|opportunity) to (?:think|consider|review))',
                    r'(?:take it or leave it|now or never)'
                ],
                'severity': 'medium'
            }
        }
    
    def _build_ethical_guidelines(self) -> List[str]:
        """Build ethical persuasion guidelines."""
        return [
            'Always be truthful about scarcity, deadlines, and availability',
            'Use social proof that is genuine and verifiable',
            'Respect the recipient\'s right to say no',
            'Avoid high-pressure tactics that prevent thoughtful decision-making',
            'Ensure claims of authority and expertise are accurate',
            'Use reciprocity genuinely - give value without strings attached',
            'Never use fear, guilt, or shame to manipulate decisions',
            'Allow adequate time for consideration and questions',
            'Be transparent about your intentions and motivations',
            'Respect boundaries and unsubscribe requests immediately'
        ]
    
    def analyze_influence(self, email: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze persuasion and influence techniques in email."""
        if not email:
            return {'error': 'No email provided'}
        
        body = email.get('body', '')
        subject = email.get('subject', '')
        sender = email.get('from', '')
        
        # Detect persuasion techniques
        persuasion_analysis = self._detect_persuasion_techniques(body, subject)
        
        # Detect manipulation
        manipulation_analysis = self._detect_manipulation(body, subject)
        
        # Calculate overall influence score
        influence_score = self._calculate_influence_score(persuasion_analysis, manipulation_analysis)
        
        # Assess ethical compliance
        ethical_assessment = self._assess_ethical_compliance(persuasion_analysis, manipulation_analysis)
        
        # Generate counter-persuasion strategies
        counter_strategies = self._generate_counter_strategies(persuasion_analysis, manipulation_analysis)
        
        # Suggest ethical persuasion improvements
        ethical_suggestions = self._suggest_ethical_improvements(persuasion_analysis)
        
        # Track persuasion patterns
        self._track_persuasion_pattern(sender, persuasion_analysis, manipulation_analysis)
        
        # Generate response strategy
        response_strategy = self._generate_response_strategy(influence_score, manipulation_analysis)
        
        return {
            'analysis_id': f"influence_{datetime.now().strftime('%Y%m%d%H%M%S')}",
            'timestamp': datetime.now().isoformat(),
            'persuasion_techniques': persuasion_analysis,
            'manipulation_detected': manipulation_analysis,
            'influence_score': influence_score,
            'ethical_assessment': ethical_assessment,
            'counter_strategies': counter_strategies,
            'ethical_suggestions': ethical_suggestions,
            'response_strategy': response_strategy,
            'reply_all_strategy': self._determine_reply_all_strategy(influence_score, manipulation_analysis)
        }
    
    def _detect_persuasion_techniques(self, body: str, subject: str) -> Dict[str, Any]:
        """Detect persuasion techniques in email."""
        content = f"{subject} {body}".lower()
        detected = []
        
        for technique_name, technique_data in self.persuasion_techniques.items():
            matches = []
            for pattern in technique_data['indicators']:
                pattern_matches = re.finditer(pattern, content, re.IGNORECASE)
                matches.extend([m.group(0) for m in pattern_matches])
            
            if matches:
                detected.append({
                    'technique': technique_name,
                    'description': technique_data['description'],
                    'matches': matches[:5],  # Limit to first 5 matches
                    'count': len(matches),
                    'weight': technique_data['weight'],
                    'ethical': technique_data['ethical'],
                    'strength': 'strong' if len(matches) >= 3 else 'moderate' if len(matches) >= 2 else 'weak'
                })
        
        # Sort by strength and weight
        detected.sort(key=lambda x: (x['count'], x['weight']), reverse=True)
        
        return {
            'techniques_detected': detected,
            'total_techniques': len(detected),
            'primary_technique': detected[0]['technique'] if detected else None,
            'persuasion_density': self._calculate_persuasion_density(detected, content)
        }
    
    def _calculate_persuasion_density(self, detected: List, content: str) -> Dict[str, Any]:
        """Calculate persuasion density (persuasion attempts per 100 words)."""
        word_count = len(content.split())
        total_attempts = sum(d['count'] for d in detected)
        
        density = (total_attempts / max(word_count, 1)) * 100
        
        if density >= 5:
            level = 'very_high'
        elif density >= 3:
            level = 'high'
        elif density >= 1:
            level = 'moderate'
        else:
            level = 'low'
        
        return {
            'density': round(density, 2),
            'level': level,
            'attempts_per_100_words': round(density, 2),
            'total_attempts': total_attempts,
            'word_count': word_count
        }
    
    def _detect_manipulation(self, body: str, subject: str) -> Dict[str, Any]:
        """Detect manipulative tactics."""
        content = f"{subject} {body}".lower()
        detected = []
        
        for tactic_name, tactic_data in self.manipulation_indicators.items():
            matches = []
            for pattern in tactic_data['indicators']:
                pattern_matches = re.finditer(pattern, content, re.IGNORECASE)
                matches.extend([m.group(0) for m in pattern_matches])
            
            if matches:
                detected.append({
                    'tactic': tactic_name,
                    'description': tactic_data['description'],
                    'matches': matches[:3],
                    'count': len(matches),
                    'severity': tactic_data['severity']
                })
        
        # Calculate manipulation score
        severity_weights = {'high': 3, 'medium': 2, 'low': 1}
        manipulation_score = sum(
            severity_weights.get(d['severity'], 1) * d['count'] 
            for d in detected
        )
        
        if manipulation_score >= 10:
            level = 'severe'
        elif manipulation_score >= 5:
            level = 'high'
        elif manipulation_score >= 2:
            level = 'moderate'
        else:
            level = 'low'
        
        return {
            'tactics_detected': detected,
            'total_tactics': len(detected),
            'manipulation_score': manipulation_score,
            'severity_level': level,
            'is_manipulative': manipulation_score >= 5
        }
    
    def _calculate_influence_score(self, persuasion: Dict, manipulation: Dict) -> Dict[str, Any]:
        """Calculate overall influence score (0-100)."""
        # Base score from persuasion techniques
        persuasion_score = 0
        for technique in persuasion['techniques_detected']:
            strength_multiplier = {'strong': 3, 'moderate': 2, 'weak': 1}
            persuasion_score += technique['weight'] * 20 * strength_multiplier.get(technique['strength'], 1)
        
        # Normalize to 0-50 range
        persuasion_score = min(50, persuasion_score / 2)
        
        # Deduct for manipulation
        manipulation_penalty = min(30, manipulation['manipulation_score'] * 3)
        
        # Add bonus for ethical persuasion
        ethical_bonus = 10 if all(t['ethical'] for t in persuasion['techniques_detected']) else 0
        
        # Final score
        final_score = max(0, min(100, persuasion_score - manipulation_penalty + ethical_bonus))
        
        if final_score >= 80:
            grade = 'A'
            description = 'Highly persuasive and ethical'
        elif final_score >= 60:
            grade = 'B'
            description = 'Moderately persuasive'
        elif final_score >= 40:
            grade = 'C'
            description = 'Some persuasion attempts'
        elif final_score >= 20:
            grade = 'D'
            description = 'Weak persuasion or manipulative'
        else:
            grade = 'F'
            description = 'Ineffective or highly manipulative'
        
        return {
            'score': round(final_score, 1),
            'grade': grade,
            'description': description,
            'persuasion_component': round(persuasion_score, 1),
            'manipulation_penalty': round(manipulation_penalty, 1),
            'ethical_bonus': ethical_bonus
        }
    
    def _assess_ethical_compliance(self, persuasion: Dict, manipulation: Dict) -> Dict[str, Any]:
        """Assess ethical compliance of persuasion attempts."""
        issues = []
        
        # Check for unethical techniques
        unethical_techniques = [t for t in persuasion['techniques_detected'] if not t['ethical']]
        if unethical_techniques:
            issues.append({
                'type': 'unethical_techniques',
                'severity': 'high',
                'details': f"Using unethical techniques: {', '.join([t['technique'] for t in unethical_techniques])}"
            })
        
        # Check for manipulation
        if manipulation['is_manipulative']:
            issues.append({
                'type': 'manipulation',
                'severity': manipulation['severity_level'],
                'details': f"Manipulative tactics detected: {manipulation['total_tactics']} tactic(s)"
            })
        
        # Check for excessive pressure
        high_pressure = [t for t in persuasion['techniques_detected'] if t['technique'] in ['urgency', 'scarcity'] and t['strength'] == 'strong']
        if len(high_pressure) >= 2:
            issues.append({
                'type': 'excessive_pressure',
                'severity': 'medium',
                'details': 'Multiple strong pressure tactics may prevent thoughtful decision-making'
            })
        
        # Calculate compliance score
        if not issues:
            compliance_score = 100
            status = 'fully_compliant'
        elif any(i['severity'] == 'high' for i in issues):
            compliance_score = 30
            status = 'non_compliant'
        elif any(i['severity'] == 'medium' for i in issues):
            compliance_score = 60
            status = 'partially_compliant'
        else:
            compliance_score = 80
            status = 'mostly_compliant'
        
        return {
            'compliance_score': compliance_score,
            'status': status,
            'issues': issues,
            'guidelines': self.ethical_guidelines[:5] if issues else []
        }
    
    def _generate_counter_strategies(self, persuasion: Dict, manipulation: Dict) -> List[Dict[str, Any]]:
        """Generate counter-persuasion strategies."""
        strategies = []
        
        # Counter strategies for each technique
        technique_counters = {
            'scarcity': {
                'strategy': 'Verify scarcity claims independently',
                'action': 'Check if the offer/product is truly limited or if this is a common marketing tactic'
            },
            'urgency': {
                'strategy': 'Take time to evaluate',
                'action': 'Legitimate opportunities allow reasonable time for consideration. Don\'t let artificial urgency rush your decision'
            },
            'social_proof': {
                'strategy': 'Evaluate relevance of social proof',
                'action': 'Consider if the "others" mentioned are similar to you and if their situation applies to yours'
            },
            'authority': {
                'strategy': 'Verify credentials independently',
                'action': 'Check if the claimed expertise is relevant and verifiable through independent sources'
            },
            'reciprocity': {
                'strategy': 'Separate gift from obligation',
                'action': 'Accept genuine gifts without feeling obligated. Evaluate the request on its own merits'
            },
            'fear': {
                'strategy': 'Assess realistic consequences',
                'action': 'Evaluate the actual likelihood and severity of the feared outcome without emotional influence'
            }
        }
        
        for technique in persuasion['techniques_detected']:
            if technique['technique'] in technique_counters:
                counter = technique_counters[technique['technique']]
                strategies.append({
                    'technique': technique['technique'],
                    'strategy': counter['strategy'],
                    'action': counter['action'],
                    'priority': 'high' if technique['strength'] == 'strong' else 'medium'
                })
        
        # Add manipulation counter-strategies
        if manipulation['is_manipulative']:
            strategies.append({
                'technique': 'manipulation',
                'strategy': 'Recognize and reject manipulation',
                'action': 'Acknowledge the manipulative tactics and make your decision based on facts, not emotional pressure',
                'priority': 'high'
            })
        
        return strategies[:5]
    
    def _suggest_ethical_improvements(self, persuasion: Dict) -> List[Dict[str, Any]]:
        """Suggest ethical improvements for outbound emails."""
        suggestions = []
        
        # If using unethical techniques
        unethical = [t for t in persuasion['techniques_detected'] if not t['ethical']]
        if unethical:
            suggestions.append({
                'type': 'remove_unethical',
                'suggestion': f"Remove unethical techniques: {', '.join([t['technique'] for t in unethical])}",
                'alternative': 'Use ethical alternatives like genuine social proof, real scarcity, and honest authority'
            })
        
        # If persuasion density is too high
        if persuasion['persuasion_density']['level'] in ['high', 'very_high']:
            suggestions.append({
                'type': 'reduce_density',
                'suggestion': 'Reduce persuasion density - too many attempts can feel pushy',
                'alternative': 'Focus on 1-2 strong, ethical persuasion techniques instead of many weak ones'
            })
        
        # If using too much pressure
        pressure_techniques = [t for t in persuasion['techniques_detected'] if t['technique'] in ['urgency', 'scarcity', 'fear']]
        if len(pressure_techniques) >= 2:
            suggestions.append({
                'type': 'reduce_pressure',
                'suggestion': 'Reduce pressure tactics - allow time for thoughtful decision-making',
                'alternative': 'Use genuine urgency only when real, and balance with value-focused messaging'
            })
        
        # General ethical suggestions
        suggestions.extend([
            {
                'type': 'add_value',
                'suggestion': 'Lead with genuine value before asking for anything',
                'alternative': 'Provide useful information, insights, or resources upfront'
            },
            {
                'type': 'be_transparent',
                'suggestion': 'Be transparent about intentions and motivations',
                'alternative': 'Clearly state what you\'re asking for and why'
            }
        ])
        
        return suggestions[:5]
    
    def _track_persuasion_pattern(self, sender: str, persuasion: Dict, manipulation: Dict):
        """Track persuasion patterns over time."""
        self.persuasion_history[sender].append({
            'timestamp': datetime.now().isoformat(),
            'influence_score': self._calculate_influence_score(persuasion, manipulation)['score'],
            'manipulation_detected': manipulation['is_manipulative'],
            'primary_technique': persuasion['primary_technique']
        })
        
        # Keep only last 20 entries
        if len(self.persuasion_history[sender]) > 20:
            self.persuasion_history[sender] = self.persuasion_history[sender][-20:]
    
    def _generate_response_strategy(self, influence_score: Dict, manipulation: Dict) -> Dict[str, Any]:
        """Generate response strategy based on influence analysis."""
        score = influence_score['score']
        is_manipulative = manipulation['is_manipulative']
        
        if is_manipulative:
            return {
                'strategy': 'cautious_skepticism',
                'tone': 'professional and firm',
                'approach': 'Acknowledge the request but take time to evaluate independently. Don\'t commit under pressure.',
                'timeline': 'Delay response by 24-48 hours to evaluate without pressure',
                'key_points': [
                    'Thank them for the information',
                    'State you need time to evaluate',
                    'Ask for written details to review',
                    'Avoid making immediate commitments'
                ]
            }
        elif score >= 70:
            return {
                'strategy': 'thoughtful_consideration',
                'tone': 'professional and engaged',
                'approach': 'The request is well-presented. Evaluate on merits and respond thoughtfully.',
                'timeline': 'Respond within 24 hours after consideration',
                'key_points': [
                    'Acknowledge the well-crafted request',
                    'Ask clarifying questions if needed',
                    'Evaluate based on your actual needs',
                    'Respond with clear decision or next steps'
                ]
            }
        else:
            return {
                'strategy': 'standard_evaluation',
                'tone': 'professional',
                'approach': 'Evaluate the request on its own merits without influence from persuasion tactics.',
                'timeline': 'Respond within normal timeframe',
                'key_points': [
                    'Focus on the substance of the request',
                    'Ignore persuasion attempts',
                    'Make decision based on your needs and values',
                    'Respond clearly and professionally'
                ]
            }
    
    def _determine_reply_all_strategy(self, influence_score: Dict, manipulation: Dict) -> Dict[str, Any]:
        """Determine reply-all strategy."""
        is_manipulative = manipulation['is_manipulative']
        
        if is_manipulative:
            return {
                'reply_all_recommended': False,
                'reason': 'Respond privately first to address manipulative tactics without public confrontation',
                'alternative': 'Reply to sender only, then forward to others if appropriate'
            }
        else:
            return {
                'reply_all_recommended': True,
                'reason': 'Standard response - keep stakeholders informed',
                'include_analysis': False
            }


def analyze_email_influence(email: Dict[str, Any]) -> Dict[str, Any]:
    """Main entry point for influence and persuasion analysis."""
    analyzer = InfluencePersuasionAnalyzer()
    return analyzer.analyze_influence(email)


if __name__ == '__main__':
    test_email = {
        'from': 'sales@vendor.com',
        'subject': 'LAST CHANCE: Exclusive offer expires today!',
        'body': '''Dear Valued Customer,

This is your FINAL OPPORTUNITY to take advantage of our exclusive offer - but only if you ACT NOW!

As a respected industry leader with 20 years of experience, I can tell you that over 10,000 satisfied customers have already transformed their businesses with our solution. Don't be left behind!

Here's what you'll get:
- FREE bonus package (worth $5,000)
- Limited-time 50% discount (only 3 spots left!)
- Exclusive access available to just a select few

TIME IS RUNNING OUT! This offer expires TONIGHT at midnight. After that, the price doubles and these bonuses disappear forever.

Don't miss out like the hundreds who hesitated and now regret their decision. You'll kick yourself if you don't take action immediately.

Click here to claim your spot before it's too late!

Remember: This is a once-in-a-lifetime opportunity. Don't let fear hold you back. Successful people take action NOW!

P.S. I've already reserved a spot just for you as a special favor. Don't let me down!

Best regards,
John Smith
CEO & Founder''',
        'date': '2024-01-15T16:00:00'
    }
    
    result = analyze_email_influence(test_email)
    print(json.dumps(result, indent=2))
