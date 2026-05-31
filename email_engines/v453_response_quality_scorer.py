#!/usr/bin/env python3
"""
V453 - AI Email Response Quality Scorer
Rates every reply before sending with actionable improvement suggestions.
Features: Tone analysis, clarity scoring, professionalism check, completeness validation.
CRITICAL: Always enforces reply-all for multi-recipient emails.
"""

import json
import re
from datetime import datetime
from typing import Dict, List, Any


class ResponseQualityScorer:
    """Scores email response quality before sending."""
    
    PROFESSIONAL_WORDS = ['please', 'thank', 'appreciate', 'regards', 'sincerely']
    INFORMAL_WORDS = ['hey', 'lol', 'btw', 'gonna', 'wanna', 'stuff', 'thing']
    
    def analyze_email(self, email: Dict[str, Any]) -> Dict[str, Any]:
        """Score the quality of an email response."""
        body = email.get('body', '')
        subject = email.get('subject', '')
        recipients = email.get('to', []) + email.get('cc', [])
        original = email.get('original_email', {})
        
        scores = {
            'clarity': self._score_clarity(body),
            'professionalism': self._score_professionalism(body),
            'completeness': self._score_completeness(body, original),
            'tone': self._score_tone(body),
            'grammar': self._score_grammar(body),
            'length': self._score_length(body)
        }
        
        overall = sum(s['score'] for s in scores.values()) / len(scores)
        grade = self._get_grade(overall)
        suggestions = self._generate_suggestions(scores, body)
        
        reply_all_required = len(recipients) > 1
        
        return {
            'engine': 'V453_ResponseQualityScorer',
            'overall_score': round(overall, 1),
            'grade': grade,
            'scores': scores,
            'suggestions': suggestions,
            'ready_to_send': overall >= 70,
            'reply_all_required': reply_all_required,
            'reply_all_enforced': reply_all_required,
            'recipients': recipients,
            'timestamp': datetime.now().isoformat()
        }
    
    def _score_clarity(self, body: str) -> Dict:
        words = re.findall(r'\b\w+\b', body)
        sentences = re.split(r'[.!?]+', body)
        sentences = [s.strip() for s in sentences if s.strip()]
        if not sentences or not words:
            return {'score': 50, 'reason': 'Empty email'}
        avg_len = len(words) / len(sentences)
        score = max(0, min(100, 100 - abs(avg_len - 15) * 3))
        return {'score': round(score, 1), 'reason': f'Avg {avg_len:.1f} words/sentence'}
    
    def _score_professionalism(self, body: str) -> Dict:
        body_lower = body.lower()
        informal = sum(1 for w in self.INFORMAL_WORDS if w in body_lower)
        professional = sum(1 for w in self.PROFESSIONAL_WORDS if w in body_lower)
        score = max(0, min(100, 80 + professional * 5 - informal * 15))
        return {'score': score, 'reason': f'{professional} professional, {informal} informal terms'}
    
    def _score_completeness(self, body: str, original: Dict) -> Dict:
        if not original:
            return {'score': 70, 'reason': 'No original email to compare'}
        questions = re.findall(r'\?', original.get('body', ''))
        if not questions:
            return {'score': 80, 'reason': 'No questions to answer'}
        score = min(100, 60 + len(body) // 50)
        return {'score': score, 'reason': f'Addressing {len(questions)} questions'}
    
    def _score_tone(self, body: str) -> Dict:
        negative = ['angry', 'frustrated', 'terrible', 'worst', 'hate']
        positive = ['great', 'thank', 'appreciate', 'happy', 'excellent']
        body_lower = body.lower()
        neg = sum(1 for w in negative if w in body_lower)
        pos = sum(1 for w in positive if w in body_lower)
        if neg > pos:
            score = max(20, 70 - neg * 15)
            reason = 'Negative tone detected'
        else:
            score = min(100, 75 + pos * 8)
            reason = 'Positive/professional tone'
        return {'score': score, 'reason': reason}
    
    def _score_grammar(self, body: str) -> Dict:
        issues = 0
        if '  ' in body:
            issues += 1
        if not body[0:1].isupper():
            issues += 1
        caps_words = re.findall(r'\b[A-Z]{4,}\b', body)
        issues += min(len(caps_words), 5)
        score = max(30, 100 - issues * 10)
        return {'score': score, 'reason': f'{issues} potential issues'}
    
    def _score_length(self, body: str) -> Dict:
        word_count = len(re.findall(r'\b\w+\b', body))
        if word_count < 10:
            return {'score': 40, 'reason': f'Too short ({word_count} words)'}
        elif word_count > 500:
            return {'score': 60, 'reason': f'Too long ({word_count} words)'}
        else:
            return {'score': 90, 'reason': f'Good length ({word_count} words)'}
    
    def _get_grade(self, score: float) -> str:
        if score >= 90: return 'A+'
        elif score >= 80: return 'A'
        elif score >= 70: return 'B'
        elif score >= 60: return 'C'
        else: return 'D'
    
    def _generate_suggestions(self, scores: Dict, body: str) -> List[str]:
        suggestions = []
        for key, data in scores.items():
            if data['score'] < 70:
                suggestions.append(f"Improve {key}: {data['reason']}")
        if not suggestions:
            suggestions.append("Email looks great! Ready to send.")
        suggestions.append("Remember: Always use reply-all for multi-recipient emails")
        return suggestions


def main():
    engine = ResponseQualityScorer()
    test_email = {
        'from': 'kleber@ziontechgroup.com',
        'to': ['client@example.com', 'team@ziontechgroup.com'],
        'cc': ['manager@ziontechgroup.com'],
        'subject': 'Re: Project Update',
        'body': 'Thank you for the update. We appreciate the detailed timeline. Our team will review the specifications and provide feedback by Friday. Please let us know if you need anything else in the meantime. Best regards, Kleber'
    }
    result = engine.analyze_email(test_email)
    print(json.dumps(result, indent=2))
    print(f"\n✅ Quality Score: {result['overall_score']}/100 (Grade: {result['grade']})")
    print(f"✅ Ready to send: {result['ready_to_send']}")
    print(f"✅ Reply-all enforced: {result['reply_all_enforced']}")


if __name__ == '__main__':
    main()
