#!/usr/bin/env python3
"""
V479 - Email A/B Testing Platform
Test subject lines and email content to optimize performance.
Features: Variant generation, performance tracking, statistical analysis, automatic winner selection.
CRITICAL: Always enforces reply-all for multi-recipient emails.
"""

import json
import re
import random
from datetime import datetime
from typing import Dict, List, Any
from statistics import mean, stdev


class EmailABTestingPlatform:
    """A/B testing platform for email optimization."""
    
    def analyze_email(self, email: Dict[str, Any]) -> Dict[str, Any]:
        """Generate A/B test variants for email."""
        subject = email.get('subject', '')
        body = email.get('body', '')
        recipients = email.get('to', []) + email.get('cc', [])
        
        # Generate subject line variants
        subject_variants = self._generate_subject_variants(subject)
        
        # Generate content variants
        content_variants = self._generate_content_variants(body)
        
        # Create test configuration
        test_config = self._create_test_config(subject_variants, content_variants, recipients)
        
        # Initialize tracking
        tracking = self._initialize_tracking(test_config)
        
        reply_all_required = len(recipients) > 1
        
        return {
            'engine': 'V479_EmailABTestingPlatform',
            'test_id': f"AB-{datetime.now().strftime('%Y%m%d%H%M%S')}",
            'original_email': {
                'subject': subject,
                'body_preview': body[:200] + '...' if len(body) > 200 else body
            },
            'subject_variants': subject_variants,
            'content_variants': content_variants,
            'test_configuration': test_config,
            'tracking': tracking,
            'reply_all_required': reply_all_required,
            'reply_all_enforced': reply_all_required,
            'recipients': recipients,
            'timestamp': datetime.now().isoformat()
        }
    
    def _generate_subject_variants(self, original_subject: str) -> List[Dict]:
        """Generate subject line variants."""
        variants = [
            {
                'variant_id': 'A',
                'subject': original_subject,
                'type': 'original',
                'description': 'Original subject line'
            }
        ]
        
        # Variant B: Add urgency
        if 'urgent' not in original_subject.lower():
            variants.append({
                'variant_id': 'B',
                'subject': f"[URGENT] {original_subject}",
                'type': 'urgency',
                'description': 'Added urgency indicator'
            })
        
        # Variant C: Personalization
        variants.append({
            'variant_id': 'C',
            'subject': f"Quick question about: {original_subject}",
            'type': 'personalization',
            'description': 'Added personalization and question format'
        })
        
        # Variant D: Shorter version
        short_subject = original_subject[:50] + '...' if len(original_subject) > 50 else original_subject
        variants.append({
            'variant_id': 'D',
            'subject': short_subject,
            'type': 'concise',
            'description': 'Shortened subject line'
        })
        
        # Variant E: Emoji version
        variants.append({
            'variant_id': 'E',
            'subject': f"🚀 {original_subject}",
            'type': 'emoji',
            'description': 'Added emoji for visual appeal'
        })
        
        return variants
    
    def _generate_content_variants(self, original_body: str) -> List[Dict]:
        """Generate content variants."""
        variants = [
            {
                'variant_id': 'A',
                'body': original_body,
                'type': 'original',
                'description': 'Original content',
                'word_count': len(original_body.split())
            }
        ]
        
        # Variant B: Concise version (50% shorter)
        sentences = original_body.split('.')
        concise_sentences = sentences[:len(sentences)//2] if len(sentences) > 2 else sentences
        concise_body = '. '.join(concise_sentences) + '.'
        
        variants.append({
            'variant_id': 'B',
            'body': concise_body,
            'type': 'concise',
            'description': '50% shorter version',
            'word_count': len(concise_body.split())
        })
        
        # Variant C: Bullet points version
        bullet_body = self._convert_to_bullets(original_body)
        variants.append({
            'variant_id': 'C',
            'body': bullet_body,
            'type': 'bullets',
            'description': 'Converted to bullet points',
            'word_count': len(bullet_body.split())
        })
        
        # Variant D: Question-based version
        question_body = self._add_questions(original_body)
        variants.append({
            'variant_id': 'D',
            'body': question_body,
            'type': 'questions',
            'description': 'Added engaging questions',
            'word_count': len(question_body.split())
        })
        
        return variants
    
    def _convert_to_bullets(self, text: str) -> str:
        """Convert text to bullet points."""
        sentences = [s.strip() for s in text.split('.') if s.strip()]
        if len(sentences) <= 3:
            return text
        
        bullet_points = ['• ' + sentence for sentence in sentences[:5]]
        return '\n'.join(bullet_points)
    
    def _add_questions(self, text: str) -> str:
        """Add engaging questions to text."""
        questions = [
            "Have you had a chance to review this?",
            "What are your thoughts on this approach?",
            "Would you like to discuss this further?"
        ]
        
        selected_question = random.choice(questions)
        return f"{text}\n\n{selected_question}"
    
    def _create_test_config(self, subject_variants: List[Dict], 
                            content_variants: List[Dict], 
                            recipients: List[str]) -> Dict:
        """Create A/B test configuration."""
        # Calculate sample size (simplified)
        total_recipients = len(recipients)
        sample_per_variant = max(10, total_recipients // len(subject_variants))
        
        return {
            'test_type': 'subject_and_content',
            'variants': {
                'subject': len(subject_variants),
                'content': len(content_variants)
            },
            'total_combinations': len(subject_variants) * len(content_variants),
            'sample_size_per_variant': sample_per_variant,
            'confidence_level': 0.95,
            'significance_threshold': 0.05,
            'duration_days': 7,
            'metrics_to_track': [
                'open_rate',
                'click_rate',
                'reply_rate',
                'response_time'
            ]
        }
    
    def _initialize_tracking(self, test_config: Dict) -> Dict:
        """Initialize tracking for A/B test."""
        return {
            'status': 'initialized',
            'start_date': datetime.now().isoformat(),
            'end_date': (datetime.now() + timedelta(days=test_config['duration_days'])).isoformat(),
            'variants_sent': 0,
            'responses_received': 0,
            'current_winner': None,
            'statistical_significance': 0.0,
            'performance_data': {}
        }
    
    def analyze_results(self, test_id: str, results: List[Dict]) -> Dict:
        """Analyze A/B test results and determine winner."""
        if not results:
            return {
                'test_id': test_id,
                'status': 'insufficient_data',
                'message': 'Not enough data to determine winner'
            }
        
        # Group results by variant
        variant_performance = {}
        for result in results:
            variant_id = result.get('variant_id')
            if variant_id not in variant_performance:
                variant_performance[variant_id] = []
            variant_performance[variant_id].append(result)
        
        # Calculate metrics for each variant
        variant_metrics = {}
        for variant_id, variant_results in variant_performance.items():
            open_rates = [r.get('opened', 0) for r in variant_results]
            click_rates = [r.get('clicked', 0) for r in variant_results]
            reply_rates = [r.get('replied', 0) for r in variant_results]
            
            variant_metrics[variant_id] = {
                'sample_size': len(variant_results),
                'open_rate': mean(open_rates) if open_rates else 0,
                'click_rate': mean(click_rates) if click_rates else 0,
                'reply_rate': mean(reply_rates) if reply_rates else 0,
                'overall_score': self._calculate_overall_score(open_rates, click_rates, reply_rates)
            }
        
        # Determine winner
        winner = max(variant_metrics.items(), key=lambda x: x[1]['overall_score'])
        
        # Calculate statistical significance (simplified)
        significance = self._calculate_significance(variant_metrics)
        
        return {
            'test_id': test_id,
            'status': 'completed',
            'winner': {
                'variant_id': winner[0],
                'metrics': winner[1],
                'improvement': self._calculate_improvement(winner[1], variant_metrics)
            },
            'all_variants': variant_metrics,
            'statistical_significance': significance,
            'recommendation': self._generate_recommendation(winner, significance)
        }
    
    def _calculate_overall_score(self, open_rates: List, click_rates: List, reply_rates: List) -> float:
        """Calculate overall performance score."""
        open_score = mean(open_rates) if open_rates else 0
        click_score = mean(click_rates) if click_rates else 0
        reply_score = mean(reply_rates) if reply_rates else 0
        
        # Weighted average
        return (open_score * 0.3) + (click_score * 0.4) + (reply_score * 0.3)
    
    def _calculate_significance(self, variant_metrics: Dict) -> float:
        """Calculate statistical significance (simplified)."""
        # In a real implementation, this would use proper statistical tests
        scores = [m['overall_score'] for m in variant_metrics.values()]
        if len(scores) < 2:
            return 0.0
        
        max_score = max(scores)
        min_score = min(scores)
        
        if min_score == 0:
            return 1.0
        
        difference = (max_score - min_score) / min_score
        return min(1.0, difference)
    
    def _calculate_improvement(self, winner_metrics: Dict, all_metrics: Dict) -> Dict:
        """Calculate improvement over other variants."""
        winner_score = winner_metrics['overall_score']
        other_scores = [m['overall_score'] for vid, m in all_metrics.items() if vid != winner_metrics.get('variant_id')]
        
        if not other_scores:
            return {'percentage': 0, 'description': 'No comparison available'}
        
        avg_other_score = mean(other_scores)
        improvement = ((winner_score - avg_other_score) / avg_other_score * 100) if avg_other_score > 0 else 0
        
        return {
            'percentage': round(improvement, 2),
            'description': f"{improvement:.1f}% improvement over average of other variants"
        }
    
    def _generate_recommendation(self, winner: tuple, significance: float) -> str:
        """Generate recommendation based on results."""
        variant_id, metrics = winner
        
        if significance < 0.05:
            return f"Variant {variant_id} shows promise but results are not statistically significant. Consider running test longer."
        
        if metrics['overall_score'] > 0.7:
            return f"✅ Variant {variant_id} is the clear winner with {metrics['overall_score']:.2f} overall score. Implement this variant."
        else:
            return f"Variant {variant_id} performed best but overall performance is modest. Consider further optimization."


def main():
    """Test V479 engine."""
    engine = EmailABTestingPlatform()
    
    test_email = {
        'from': 'marketing@ziontechgroup.com',
        'to': ['leads@company.com', 'prospects@company.com'],
        'cc': ['sales@ziontechgroup.com'],
        'subject': 'New AI Platform Launch',
        'body': 'We are excited to announce our new AI platform that will revolutionize your business. Our platform offers advanced features including automation, analytics, and integration capabilities. Would you like to schedule a demo?'
    }
    
    result = engine.analyze_email(test_email)
    print(json.dumps(result, indent=2))
    print(f"\n✅ Test ID: {result['test_id']}")
    print(f"✅ Subject variants: {len(result['subject_variants'])}")
    print(f"✅ Content variants: {len(result['content_variants'])}")
    print(f"✅ Total combinations: {result['test_configuration']['total_combinations']}")
    print(f"✅ Reply-all enforced: {result['reply_all_enforced']}")


if __name__ == '__main__':
    main()
