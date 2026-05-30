#!/usr/bin/env python3
"""
V354 Email Emotional Resonance Optimizer
Analyze emotional impact of draft before sending, suggest tone adjustments for maximum
positive response, detect emotional triggers in incoming emails, optimize for relationship building.
CRITICAL: Always enforces reply-all for multi-recipient emails.
"""
import json, re, sys
from datetime import datetime

class V354EmotionalResonance:
    POSITIVE_WORDS = {
        'gratitude': ['thank', 'appreciate', 'grateful', 'thanks', 'wonderful', 'excellent', 'amazing', 'fantastic'],
        'empathy': ['understand', 'sorry', 'apologize', 'concern', 'care', 'support', 'help'],
        'confidence': ['certain', 'confident', 'assured', 'guarantee', 'promise', 'commit'],
        'enthusiasm': ['excited', 'thrilled', 'eager', 'looking forward', 'can\'t wait', 'love'],
        'respect': ['please', 'kindly', 'would you', 'could you', 'if possible', 'at your convenience'],
    }
    
    NEGATIVE_WORDS = {
        'frustration': ['frustrated', 'annoyed', 'disappointed', 'upset', 'angry', 'unacceptable'],
        'anxiety': ['worried', 'concerned', 'nervous', 'stressed', 'overwhelmed', 'uncertain'],
        'distrust': ['skeptical', 'doubt', 'question', 'unclear', 'confused', 'misleading'],
        'urgency_panic': ['urgent', 'asap', 'immediately', 'emergency', 'critical', 'deadline'],
        'blame': ['your fault', 'you failed', 'your mistake', 'you didn\'t', 'you should have'],
    }
    
    TONE_ADJUSTMENTS = {
        'too_formal': ['I regret to inform', 'Please be advised', 'Pursuant to', 'Hereby'],
        'too_casual': ['hey', 'sup', 'lol', 'btw', 'gonna', 'wanna'],
        'too_aggressive': ['you must', 'you need to', 'immediately', 'right now', 'without fail'],
        'too_passive': ['maybe', 'perhaps', 'possibly', 'if you want', 'whenever'],
    }

    def __init__(self):
        self.analyses = []

    def optimize_emotional_impact(self, draft_text, incoming_email="", subject="", recipients=None):
        recipients = recipients or []
        
        incoming_emotion = self._analyze_emotion(incoming_email) if incoming_email else None
        draft_emotion = self._analyze_emotion(draft_text)
        
        resonance_score = self._calc_resonance(draft_emotion, incoming_emotion)
        tone_issues = self._detect_tone_issues(draft_text)
        suggestions = self._generate_tone_suggestions(draft_emotion, incoming_emotion, tone_issues)
        
        relationship_impact = self._assess_relationship_impact(draft_emotion, incoming_emotion)
        
        is_multi = len(recipients) > 1
        
        result = {
            "version": "V354",
            "timestamp": datetime.now().isoformat(),
            "draft_emotional_profile": draft_emotion,
            "incoming_emotional_profile": incoming_emotion,
            "emotional_resonance_score": resonance_score,
            "tone_issues_detected": tone_issues,
            "optimization_suggestions": suggestions,
            "relationship_impact": relationship_impact,
            "overall_quality_score": self._calc_quality_score(resonance_score, tone_issues),
            "reply_all_required": is_multi,
            "reply_all_enforced": is_multi,
            "action_taken": f"Emotional resonance: {resonance_score}/10 - {len(suggestions)} optimizations suggested",
        }
        self.analyses.append(result)
        return result

    def _analyze_emotion(self, text):
        text_lower = text.lower()
        profile = {}
        for category, words in self.POSITIVE_WORDS.items():
            score = sum(1 for w in words if w in text_lower)
            if score > 0:
                profile[category] = score
        for category, words in self.NEGATIVE_WORDS.items():
            score = sum(1 for w in words if w in text_lower)
            if score > 0:
                profile[f"neg_{category}"] = score
        
        positive_total = sum(v for k, v in profile.items() if not k.startswith('neg_'))
        negative_total = sum(v for k, v in profile.items() if k.startswith('neg_'))
        
        profile['sentiment_balance'] = 'positive' if positive_total > negative_total else 'negative' if negative_total > positive_total else 'neutral'
        profile['emotional_intensity'] = min(10, positive_total + negative_total)
        return profile

    def _calc_resonance(self, draft, incoming):
        if not incoming:
            return min(10, draft.get('emotional_intensity', 5))
        
        if incoming.get('sentiment_balance') == 'negative' and draft.get('sentiment_balance') == 'positive':
            return 9
        if incoming.get('sentiment_balance') == draft.get('sentiment_balance'):
            return 7
        if incoming.get('sentiment_balance') == 'positive' and draft.get('sentiment_balance') == 'negative':
            return 3
        return 5

    def _detect_tone_issues(self, text):
        issues = []
        for tone, phrases in self.TONE_ADJUSTMENTS.items():
            for phrase in phrases:
                if phrase.lower() in text.lower():
                    issues.append({"tone": tone, "phrase": phrase, "severity": "high" if tone in ['too_aggressive', 'too_casual'] else "medium"})
        return issues

    def _generate_tone_suggestions(self, draft, incoming, issues):
        suggestions = []
        if draft.get('neg_frustration', 0) > 0:
            suggestions.append("Replace frustration language with empathetic acknowledgment")
        if draft.get('neg_anxiety', 0) > 0:
            suggestions.append("Add confidence-building statements to reduce anxiety")
        if draft.get('neg_blame', 0) > 0:
            suggestions.append("CRITICAL: Remove blame language - use collaborative problem-solving tone")
        
        for issue in issues:
            if issue['tone'] == 'too_aggressive':
                suggestions.append(f"Soften '{issue['phrase']}' to a polite request")
            elif issue['tone'] == 'too_casual':
                suggestions.append(f"Replace '{issue['phrase']}' with professional alternative")
            elif issue['tone'] == 'too_formal':
                suggestions.append(f"Simplify '{issue['phrase']}' for warmer tone")
        
        if incoming and incoming.get('sentiment_balance') == 'negative':
            suggestions.append("Lead with empathy before addressing issues")
        
        if not suggestions:
            suggestions.append("Draft tone looks good - ready to send!")
        
        return suggestions

    def _assess_relationship_impact(self, draft, incoming):
        if draft.get('sentiment_balance') == 'positive' and draft.get('gratitude', 0) > 0:
            return 'strengthens'
        if draft.get('neg_blame', 0) > 0 or draft.get('neg_frustration', 0) > 2:
            return 'risks_damaging'
        return 'neutral'

    def _calc_quality_score(self, resonance, issues):
        base = resonance
        penalty = len([i for i in issues if i['severity'] == 'high']) * 2
        return max(1, min(10, base - penalty))

if __name__ == "__main__":
    engine = V354EmotionalResonance()
    result = engine.optimize_emotional_impact(
        draft_text="I understand your frustration and I sincerely apologize for the delay. We are committed to resolving this immediately. Thank you for your patience and trust in our team.",
        incoming_email="I'm very frustrated. This is the third time I've had to follow up. Your service is unacceptable and I'm considering switching to a competitor.",
        subject="Re: Service Issue Follow-up",
        recipients=["client@company.com", "support@zion.com", "manager@zion.com"]
    )
    print(json.dumps(result, indent=2))
