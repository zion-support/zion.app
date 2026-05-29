#!/usr/bin/env python3
"""
V91: Response Quality Auto-Improvement Loop
Self-learning system that continuously improves email responses
through feedback analysis, A/B testing, and pattern recognition.
"""

import json
import hashlib
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple, Any
from dataclasses import dataclass, field
from enum import Enum
from collections import defaultdict
import re


class FeedbackType(Enum):
    POSITIVE = "positive"
    NEGATIVE = "negative"
    NEUTRAL = "neutral"
    CORRECTION = "correction"  # User manually corrected the response


class ResponseQuality(Enum):
    EXCELLENT = "excellent"  # 90-100%
    GOOD = "good"            # 75-89%
    ADEQUATE = "adequate"    # 60-74%
    POOR = "poor"            # 40-59%
    FAILED = "failed"        # < 40%


@dataclass
class ResponseRecord:
    response_id: str
    email_id: str
    category: str
    template_used: str
    response_text: str
    timestamp: datetime
    quality_score: float = 0.0
    feedback: Optional[FeedbackType] = None
    corrections: List[str] = field(default_factory=list)
    metrics: Dict = field(default_factory=dict)
    ab_test_variant: Optional[str] = None
    was_sent: bool = True


@dataclass
class ImprovementSuggestion:
    suggestion_id: str
    category: str
    issue: str
    current_pattern: str
    suggested_improvement: str
    confidence: float
    expected_impact: str
    timestamp: datetime = field(default_factory=datetime.now)


class V91AutoImprovementEngine:
    """
    V91: Response Quality Auto-Improvement Loop
    
    Features:
    1. Automatic response quality scoring
    2. Feedback collection and analysis
    3. Pattern recognition for common issues
    4. A/B testing of response variants
    5. Template evolution and optimization
    6. Correction learning (from manual edits)
    7. Continuous improvement suggestions
    """
    
    def __init__(self):
        self.responses: Dict[str, ResponseRecord] = {}
        self.templates: Dict[str, Dict] = self._initialize_templates()
        self.ab_tests: Dict[str, Dict] = {}
        self.improvement_log: List[ImprovementSuggestion] = []
        self.correction_patterns: Dict[str, List[str]] = defaultdict(list)
        self.quality_trends: Dict[str, List[float]] = defaultdict(list)
        
        # Metrics
        self.metrics = {
            'total_responses': 0,
            'avg_quality': 0.0,
            'improvement_rate': 0.0,
            'corrections_applied': 0,
            'ab_tests_run': 0,
            'templates_evolved': 0,
        }
    
    def _initialize_templates(self) -> Dict:
        """Initialize response templates with versions."""
        return {
            'sales_inquiry': {
                'v1': "Thank you for your interest! I'll provide a detailed proposal within 24 hours.",
                'v2': "Thank you for your interest in our services! I've reviewed your inquiry and will send a comprehensive proposal with pricing within 24 hours. Looking forward to working together!",
                'current': 'v2',
                'scores': {'v1': 0.0, 'v2': 0.0},
                'usage_count': {'v1': 0, 'v2': 0},
            },
            'support_request': {
                'v1': "Thanks for reaching out. We'll respond within 4 hours.",
                'v2': "Thank you for contacting support! I've logged your request (Ticket #{ticket_id}) and our technical team is investigating. You'll receive a detailed response within 4 business hours. For urgent matters, call +1 302 464 0950.",
                'current': 'v2',
                'scores': {'v1': 0.0, 'v2': 0.0},
                'usage_count': {'v1': 0, 'v2': 0},
            },
            'billing': {
                'v1': "Your billing inquiry has been received.",
                'v2': "Thank you for your billing inquiry. Our finance team has been notified and will respond within 1 business day with detailed information about your account. If urgent, contact billing@ziontechgroup.com.",
                'current': 'v2',
                'scores': {'v1': 0.0, 'v2': 0.0},
                'usage_count': {'v1': 0, 'v2': 0},
            },
            'partnership': {
                'v1': "Thanks for your partnership interest.",
                'v2': "Thank you for your partnership interest! I'm excited about potential collaboration. I'll schedule a call within 48 hours to discuss how we can create value together. Feel free to share any specific ideas at kleber@ziontechgroup.com.",
                'current': 'v2',
                'scores': {'v1': 0.0, 'v2': 0.0},
                'usage_count': {'v1': 0, 'v2': 0},
            },
            'general': {
                'v1': "Thank you for your email. I'll respond within 24 hours.",
                'v2': "Thank you for reaching out! I've received your message and will provide a comprehensive response within 24 hours. For urgent matters, call +1 302 464 0950 or email kleber@ziontechgroup.com.",
                'current': 'v2',
                'scores': {'v1': 0.0, 'v2': 0.0},
                'usage_count': {'v1': 0, 'v2': 0},
            },
        }
    
    def record_response(self, email_id: str, category: str, response_text: str, 
                       template_version: Optional[str] = None, ab_variant: Optional[str] = None) -> str:
        """Record a response for tracking and improvement."""
        response_id = hashlib.md5(f"{email_id}_{datetime.now().isoformat()}".encode()).hexdigest()[:12]
        
        record = ResponseRecord(
            response_id=response_id,
            email_id=email_id,
            category=category,
            template_used=template_version or 'custom',
            response_text=response_text,
            timestamp=datetime.now(),
            ab_test_variant=ab_variant,
        )
        
        # Auto-score the response
        record.quality_score = self._auto_score_response(record)
        
        self.responses[response_id] = record
        self.metrics['total_responses'] += 1
        
        # Update template usage
        if category in self.templates and template_version:
            self.templates[category]['usage_count'][template_version] = \
                self.templates[category]['usage_count'].get(template_version, 0) + 1
        
        # Update quality trends
        self.quality_trends[category].append(record.quality_score)
        
        return response_id
    
    def _auto_score_response(self, record: ResponseRecord) -> float:
        """Automatically score response quality."""
        score = 50.0  # Base score
        text = record.response_text.lower()
        
        # Length appropriateness (not too short, not too long)
        word_count = len(text.split())
        if 30 <= word_count <= 150:
            score += 15
        elif 20 <= word_count <= 200:
            score += 10
        elif word_count < 10:
            score -= 20
        
        # Personalization (mentions recipient name, references their message)
        if any(word in text for word in ['thank', 'appreciate', 'understand']):
            score += 5
        
        # Clear next steps
        if any(word in text for word in ['will', 'shall', 'next', 'follow up', 'respond']):
            score += 10
        
        # Contact information provided
        if any(word in text for word in ['email', 'call', 'phone', 'contact', '@']):
            score += 5
        
        # Professional tone
        if any(word in text for word in ['please', 'kindly', 'looking forward']):
            score += 5
        
        # Avoids generic phrases
        generic_phrases = ['we will get back to you', 'thank you for your email', 'as soon as possible']
        if not any(phrase in text for phrase in generic_phrases):
            score += 5
        
        # Time specificity
        if re.search(r'\d+ (?:hour|day|business day|week)', text):
            score += 5
        
        return min(score, 100.0)
    
    def record_feedback(self, response_id: str, feedback_type: FeedbackType, 
                       corrections: Optional[List[str]] = None):
        """Record feedback on a response."""
        if response_id not in self.responses:
            return
        
        record = self.responses[response_id]
        record.feedback = feedback_type
        
        if corrections:
            record.corrections = corrections
            self._learn_from_corrections(record)
        
        # Update template scores
        if record.category in self.templates:
            template = self.templates[record.category]
            version = record.template_used
            
            if version in template['scores']:
                # Bayesian update
                current_score = template['scores'][version]
                usage_count = template['usage_count'].get(version, 1)
                
                if feedback_type == FeedbackType.POSITIVE:
                    new_score = (current_score * usage_count + 100) / (usage_count + 1)
                elif feedback_type == FeedbackType.NEGATIVE:
                    new_score = (current_score * usage_count + 30) / (usage_count + 1)
                else:
                    new_score = (current_score * usage_count + 60) / (usage_count + 1)
                
                template['scores'][version] = new_score
    
    def _learn_from_corrections(self, record: ResponseRecord):
        """Learn patterns from manual corrections."""
        if not record.corrections:
            return
        
        self.metrics['corrections_applied'] += len(record.corrections)
        
        for correction in record.corrections:
            # Store correction pattern
            self.correction_patterns[record.category].append(correction)
            
            # Analyze what was wrong
            if 'too formal' in correction.lower():
                self._generate_improvement(
                    record.category,
                    "Response too formal",
                    "Use more conversational tone",
                    0.7
                )
            elif 'too long' in correction.lower():
                self._generate_improvement(
                    record.category,
                    "Response too verbose",
                    "Be more concise",
                    0.8
                )
            elif 'missing info' in correction.lower():
                self._generate_improvement(
                    record.category,
                    "Missing key information",
                    "Include specific details and next steps",
                    0.9
                )
    
    def _generate_improvement(self, category: str, issue: str, 
                            suggestion: str, confidence: float):
        """Generate an improvement suggestion."""
        suggestion_id = hashlib.md5(f"{category}_{issue}_{datetime.now().isoformat()}".encode()).hexdigest()[:8]
        
        improvement = ImprovementSuggestion(
            suggestion_id=suggestion_id,
            category=category,
            issue=issue,
            current_pattern="",
            suggested_improvement=suggestion,
            confidence=confidence,
            expected_impact="medium",
        )
        
        self.improvement_log.append(improvement)
    
    def get_best_template(self, category: str) -> Tuple[str, str]:
        """Get the best performing template for a category."""
        if category not in self.templates:
            category = 'general'
        
        template = self.templates[category]
        
        # Find best version by score
        best_version = template['current']
        best_score = 0
        
        for version, score in template['scores'].items():
            if score > best_score and template['usage_count'].get(version, 0) >= 3:
                best_score = score
                best_version = version
        
        return best_version, template[best_version]
    
    def run_ab_test(self, category: str, variant_a: str, variant_b: str) -> str:
        """Start an A/B test between two response variants."""
        test_id = hashlib.md5(f"{category}_{datetime.now().isoformat()}".encode()).hexdigest()[:8]
        
        self.ab_tests[test_id] = {
            'category': category,
            'variant_a': variant_a,
            'variant_b': variant_b,
            'results_a': [],
            'results_b': [],
            'started': datetime.now(),
            'status': 'running',
        }
        
        self.metrics['ab_tests_run'] += 1
        return test_id
    
    def record_ab_result(self, test_id: str, variant: str, quality_score: float):
        """Record an A/B test result."""
        if test_id not in self.ab_tests:
            return
        
        test = self.ab_tests[test_id]
        if variant == 'a':
            test['results_a'].append(quality_score)
        else:
            test['results_b'].append(quality_score)
        
        # Check if test has enough data
        if len(test['results_a']) >= 10 and len(test['results_b']) >= 10:
            self._evaluate_ab_test(test_id)
    
    def _evaluate_ab_test(self, test_id: str):
        """Evaluate A/B test results and pick winner."""
        test = self.ab_tests[test_id]
        
        avg_a = sum(test['results_a']) / len(test['results_a'])
        avg_b = sum(test['results_b']) / len(test['results_b'])
        
        winner = 'a' if avg_a > avg_b else 'b'
        improvement = abs(avg_a - avg_b)
        
        test['status'] = 'completed'
        test['winner'] = winner
        test['improvement'] = improvement
        
        # Apply winner as new template
        if improvement > 5:  # Significant improvement
            category = test['category']
            if category in self.templates:
                new_version = f"v{len(self.templates[category])}"
                winning_text = test[f'variant_{winner}']
                self.templates[category][new_version] = winning_text
                self.templates[category]['current'] = new_version
                self.metrics['templates_evolved'] += 1
    
    def get_improvement_report(self) -> Dict:
        """Generate comprehensive improvement report."""
        # Calculate average quality by category
        category_quality = {}
        for category, scores in self.quality_trends.items():
            if scores:
                category_quality[category] = {
                    'current': scores[-1],
                    'average': sum(scores) / len(scores),
                    'trend': 'improving' if len(scores) >= 3 and scores[-1] > scores[-3] else 'stable',
                    'count': len(scores),
                }
        
        # Top improvement suggestions
        top_suggestions = sorted(
            self.improvement_log,
            key=lambda s: s.confidence,
            reverse=True
        )[:10]
        
        return {
            'metrics': self.metrics,
            'category_quality': category_quality,
            'active_ab_tests': sum(1 for t in self.ab_tests.values() if t['status'] == 'running'),
            'completed_ab_tests': sum(1 for t in self.ab_tests.values() if t['status'] == 'completed'),
            'top_suggestions': [
                {
                    'category': s.category,
                    'issue': s.issue,
                    'suggestion': s.suggested_improvement,
                    'confidence': s.confidence,
                }
                for s in top_suggestions
            ],
            'correction_patterns': {
                cat: len(patterns) for cat, patterns in self.correction_patterns.items()
            },
            'template_versions': {
                cat: len([k for k in t.keys() if k.startswith('v')])
                for cat, t in self.templates.items()
            },
        }
    
    def evolve_templates(self):
        """Automatically evolve templates based on performance."""
        for category, template in self.templates.items():
            scores = template['scores']
            usage = template['usage_count']
            
            # Find underperforming templates
            for version, score in scores.items():
                if usage.get(version, 0) >= 5 and score < 60:
                    # Generate improved version
                    self._generate_improvement(
                        category,
                        f"Template {version} underperforming (score: {score:.1f})",
                        "Consider adding more specific details and personalization",
                        0.8
                    )
    
    def get_quality_trend(self, category: str, window: int = 10) -> Dict:
        """Get quality trend for a category."""
        if category not in self.quality_trends:
            return {'trend': 'no_data', 'values': []}
        
        values = self.quality_trends[category][-window:]
        
        if len(values) < 2:
            return {'trend': 'insufficient_data', 'values': values}
        
        # Simple trend calculation
        recent_avg = sum(values[-3:]) / 3 if len(values) >= 3 else values[-1]
        older_avg = sum(values[:3]) / 3 if len(values) >= 3 else values[0]
        
        if recent_avg > older_avg + 5:
            trend = 'improving'
        elif recent_avg < older_avg - 5:
            trend = 'declining'
        else:
            trend = 'stable'
        
        return {
            'trend': trend,
            'current': values[-1] if values else 0,
            'average': sum(values) / len(values),
            'values': values,
        }


if __name__ == "__main__":
    engine = V91AutoImprovementEngine()
    
    # Simulate responses and feedback
    categories = ['sales_inquiry', 'support_request', 'billing', 'partnership', 'general']
    
    for i in range(20):
        category = categories[i % len(categories)]
        version, template = engine.get_best_template(category)
        
        response_id = engine.record_response(
            email_id=f"email_{i}",
            category=category,
            response_text=template,
            template_version=version,
        )
        
        # Simulate feedback (mostly positive with some corrections)
        if i % 5 == 0:
            engine.record_feedback(response_id, FeedbackType.POSITIVE)
        elif i % 7 == 0:
            engine.record_feedback(response_id, FeedbackType.NEGATIVE, 
                                  ["Response could be more specific"])
        else:
            engine.record_feedback(response_id, FeedbackType.NEUTRAL)
    
    # Run an A/B test
    test_id = engine.run_ab_test(
        'sales_inquiry',
        "Thanks for your interest! I'll send a proposal soon.",
        "Thank you for your interest in our AI services! I've reviewed your requirements and will send a detailed proposal with pricing and timeline within 24 hours. Excited to help you succeed!"
    )
    
    # Record some A/B results
    for i in range(12):
        engine.record_ab_result(test_id, 'a', 65 + (i % 5))
        engine.record_ab_result(test_id, 'b', 80 + (i % 7))
    
    # Evolve templates
    engine.evolve_templates()
    
    # Generate report
    report = engine.get_improvement_report()
    print(json.dumps(report, indent=2))
    
    # Show quality trends
    for category in categories:
        trend = engine.get_quality_trend(category)
        print(f"\n{category}: {trend['trend']} (avg: {trend.get('average', 0):.1f})")
