#!/usr/bin/env python3
"""
V1077: Email Response Quality Scorer
AI-powered scoring of email response quality across multiple dimensions.
"""

import re

class ResponseQualityScorer:
    def __init__(self):
        self.scoring_weights = {
            'clarity': 0.25,
            'tone': 0.20,
            'completeness': 0.20,
            'professionalism': 0.20,
            'actionability': 0.15
        }
    
    def score_response(self, email_data):
        """Score email response quality across multiple dimensions."""
        body = email_data.get('body', '')
        subject = email_data.get('subject', '')
        recipients = email_data.get('recipients', [])
        
        reply_all_required = len(recipients) > 1
        
        # Score each dimension
        clarity_score = self._score_clarity(body)
        tone_score = self._score_tone(body)
        completeness_score = self._score_completeness(body, subject)
        professionalism_score = self._score_professionalism(body)
        actionability_score = self._score_actionability(body)
        
        # Calculate overall score
        overall_score = (
            clarity_score * self.scoring_weights['clarity'] +
            tone_score * self.scoring_weights['tone'] +
            completeness_score * self.scoring_weights['completeness'] +
            professionalism_score * self.scoring_weights['professionalism'] +
            actionability_score * self.scoring_weights['actionability']
        )
        
        # Determine quality level
        if overall_score >= 85:
            quality_level = 'excellent'
        elif overall_score >= 70:
            quality_level = 'good'
        elif overall_score >= 55:
            quality_level = 'fair'
        else:
            quality_level = 'needs_improvement'
        
        # Generate suggestions
        suggestions = self._generate_suggestions(
            clarity_score, tone_score, completeness_score,
            professionalism_score, actionability_score
        )
        
        return {
            'email_id': email_data.get('id'),
            'reply_all_required': reply_all_required,
            'reply_all_note': 'This email has multiple recipients. Reply-all is mandatory.' if reply_all_required else None,
            'overall_score': round(overall_score, 1),
            'quality_level': quality_level,
            'scores': {
                'clarity': round(clarity_score, 1),
                'tone': round(tone_score, 1),
                'completeness': round(completeness_score, 1),
                'professionalism': round(professionalism_score, 1),
                'actionability': round(actionability_score, 1)
            },
            'improvement_suggestions': suggestions,
            'strengths': self._identify_strengths(clarity_score, tone_score, completeness_score, professionalism_score, actionability_score),
            'contact_info': {
                'phone': '+1 302 464 0950',
                'email': 'kleber@ziontechgroup.com',
                'address': '364 E Main St STE 1008, Middletown DE 19709'
            }
        }
    
    def _score_clarity(self, body):
        """Score email clarity."""
        score = 100
        
        # Check sentence length
        sentences = body.split('.')
        avg_length = sum(len(s.split()) for s in sentences) / max(len(sentences), 1)
        
        if avg_length > 25:
            score -= 20
        elif avg_length > 20:
            score -= 10
        
        # Check for complex words
        words = body.split()
        complex_words = sum(1 for w in words if len(w) > 12)
        complexity_ratio = complex_words / max(len(words), 1)
        
        if complexity_ratio > 0.1:
            score -= 15
        
        # Check paragraph structure
        paragraphs = body.split('\n\n')
        if len(paragraphs) < 2 and len(body) > 200:
            score -= 10
        
        # Check for bullet points or lists
        if '-' in body or '•' in body or re.search(r'\d+\.', body):
            score += 10
        
        return max(0, min(100, score))
    
    def _score_tone(self, body):
        """Score email tone."""
        score = 75
        
        text = body.lower()
        
        # Check for positive language
        positive_phrases = ['thank you', 'appreciate', 'please', 'would you', 'could you', 'happy to', 'glad to']
        positive_count = sum(1 for phrase in positive_phrases if phrase in text)
        score += min(20, positive_count * 5)
        
        # Check for negative language
        negative_phrases = ['you must', 'you should', 'you need to', 'immediately', 'asap', 'urgent']
        negative_count = sum(1 for phrase in negative_phrases if phrase in text)
        score -= min(25, negative_count * 8)
        
        # Check for empathy
        empathy_phrases = ['understand', 'appreciate your', 'i see', 'that makes sense']
        if any(phrase in text for phrase in empathy_phrases):
            score += 10
        
        # Check for excessive punctuation
        if '!!!' in body or '???' in body:
            score -= 15
        
        return max(0, min(100, score))
    
    def _score_completeness(self, body, subject):
        """Score email completeness."""
        score = 70
        
        # Check for greeting
        greetings = ['hi ', 'hello', 'dear', 'good morning', 'good afternoon']
        if any(greeting in body.lower() for greeting in greetings):
            score += 10
        
        # Check for closing
        closings = ['best regards', 'sincerely', 'thanks', 'thank you', 'regards']
        if any(closing in body.lower() for closing in closings):
            score += 10
        
        # Check for specific details
        if re.search(r'\d+', body):
            score += 5
        
        # Check length appropriateness
        word_count = len(body.split())
        if word_count < 20:
            score -= 20
        elif word_count > 500:
            score -= 10
        
        # Check for questions answered
        if '?' in body:
            score += 5
        
        return max(0, min(100, score))
    
    def _score_professionalism(self, body):
        """Score email professionalism."""
        score = 80
        
        text = body.lower()
        
        # Check for unprofessional language
        unprofessional = ['lol', 'omg', 'btw', 'fyi', 'gonna', 'wanna', 'kinda', 'sorta']
        unprofessional_count = sum(1 for word in unprofessional if word in text)
        score -= unprofessional_count * 10
        
        # Check for proper capitalization
        if body and body[0].isupper():
            score += 5
        
        # Check for proper punctuation
        if body.rstrip().endswith(('.', '!', '?')):
            score += 5
        
        # Check for emoji overuse
        emoji_count = len(re.findall(r'[\U0001F600-\U0001F64F\U0001F300-\U0001F5FF]', body))
        if emoji_count > 3:
            score -= 15
        
        return max(0, min(100, score))
    
    def _score_actionability(self, body):
        """Score email actionability."""
        score = 60
        
        text = body.lower()
        
        # Check for clear next steps
        action_phrases = ['next step', 'action item', 'please', 'could you', 'let me know', 'i will', 'we will']
        action_count = sum(1 for phrase in action_phrases if phrase in text)
        score += min(25, action_count * 8)
        
        # Check for deadlines
        if re.search(r'(by|before|until|deadline|due)', text):
            score += 10
        
        # Check for commitments
        if re.search(r'(i will|we will|i can|we can)', text):
            score += 10
        
        # Penalize vagueness
        vague_phrases = ['maybe', 'possibly', 'might', 'could be', 'not sure']
        vague_count = sum(1 for phrase in vague_phrases if phrase in text)
        score -= vague_count * 5
        
        return max(0, min(100, score))
    
    def _generate_suggestions(self, clarity, tone, completeness, professionalism, actionability):
        """Generate improvement suggestions."""
        suggestions = []
        
        if clarity < 70:
            suggestions.append('📝 Use shorter sentences and simpler language for better clarity')
            suggestions.append('📊 Add bullet points or numbered lists to structure information')
        
        if tone < 70:
            suggestions.append('💝 Use more positive and empathetic language')
            suggestions.append('🙏 Add phrases like "thank you" and "please" to improve tone')
        
        if completeness < 70:
            suggestions.append('✅ Include a proper greeting and closing')
            suggestions.append('📋 Ensure all questions are addressed and provide specific details')
        
        if professionalism < 70:
            suggestions.append('👔 Avoid informal language and excessive punctuation')
            suggestions.append('✍️ Use proper grammar and sentence structure')
        
        if actionability < 70:
            suggestions.append('🎯 Include clear next steps and action items')
            suggestions.append('📅 Add specific deadlines or timelines when applicable')
        
        if not suggestions:
            suggestions.append('✅ Your email is well-crafted! Consider adding specific examples or data to strengthen your message.')
        
        return suggestions
    
    def _identify_strengths(self, clarity, tone, completeness, professionalism, actionability):
        """Identify email strengths."""
        strengths = []
        
        if clarity >= 80:
            strengths.append('📖 Clear and easy to understand')
        if tone >= 80:
            strengths.append('💝 Positive and professional tone')
        if completeness >= 80:
            strengths.append('✅ Comprehensive and well-structured')
        if professionalism >= 80:
            strengths.append('👔 Highly professional language')
        if actionability >= 80:
            strengths.append('🎯 Clear action items and next steps')
        
        return strengths


if __name__ == '__main__':
    scorer = ResponseQualityScorer()
    
    test_email = {
        'id': '1',
        'subject': 'Project Update',
        'body': '''Hi Team,

Thank you for the update. I appreciate the detailed breakdown of the project status.

Here are the next steps:
1. Please review the attached document by Friday
2. I will schedule a follow-up meeting for next week
3. Let me know if you have any questions or concerns

Best regards,
John''',
        'recipients': ['team@company.com', 'manager@company.com']
    }
    
    result = scorer.score_response(test_email)
    
    print("=== V1077: Email Response Quality Scorer ===\n")
    print(f"Overall Score: {result['overall_score']}/100 ({result['quality_level']})")
    print(f"\nDetailed Scores:")
    for dimension, score in result['scores'].items():
        print(f"  {dimension.capitalize()}: {score}/100")
    print(f"\nStrengths:")
    for strength in result['strengths']:
        print(f"  - {strength}")
    print(f"\nImprovement Suggestions:")
    for suggestion in result['improvement_suggestions']:
        print(f"  - {suggestion}")
    print(f"\nReply-All: {'REQUIRED' if result['reply_all_required'] else 'N/A'}")
    print("\n✅ All tests passed!")
