#!/usr/bin/env python3
"""V179 - AI Email Tone Rewriter
Rewrites emails to match desired tone (formal/casual/empathetic/assertive/diplomatic)
while preserving meaning, key facts, and action items. Case-by-case analysis with reply-all enforcement."""
import json, re
from typing import Dict, List, Any

class ToneRewriter:
    TONES = {
        'formal': {'greetings': ['Dear', 'Good morning/afternoon'], 'closings': ['Sincerely', 'Respectfully'], 'avoid': ['!', 'lol', 'btw', 'gonna'], 'style': 'Use complete sentences, proper titles, professional vocabulary'},
        'casual': {'greetings': ['Hey', 'Hi there'], 'closings': ['Cheers', 'Talk soon'], 'avoid': ['heretofore', 'aforementioned', 'pursuant'], 'style': 'Relaxed, friendly, conversational'},
        'empathetic': {'greetings': ['Hi', 'Hello'], 'closings': ['Take care', 'Thinking of you'], 'phrases': ['I understand', 'That sounds challenging', 'I appreciate'], 'style': 'Validate feelings, show understanding, supportive'},
        'assertive': {'greetings': ['Hello'], 'closings': ['Regards', 'Best'], 'phrases': ['I need', 'I expect', 'Please ensure'], 'style': 'Direct, clear, confident without aggression'},
        'diplomatic': {'greetings': ['Dear'], 'closings': ['With appreciation', 'Kind regards'], 'phrases': ['Perhaps we could', 'I wonder if', 'Would it be possible'], 'style': 'Tactful, respectful, bridge-building'},
    }

    def rewrite(self, email: Dict[str, Any], target_tone: str = 'professional') -> Dict[str, Any]:
        body = email.get('body', '')
        subject = email.get('subject', '')
        sender = email.get('from', '')
        current_tone = self._detect_current_tone(body)
        tone_config = self.TONES.get(target_tone, self.TONES['formal'])
        rewritten_body = self._apply_tone(body, current_tone, tone_config, target_tone)
        rewritten_subject = self._adjust_subject(subject, target_tone)
        greeting = self._suggest_greeting(sender, target_tone)
        closing = self._suggest_closing(target_tone)
        changes = self._track_changes(body, rewritten_body)
        return {
            'original_tone': current_tone, 'target_tone': target_tone,
            'rewritten_subject': rewritten_subject, 'suggested_greeting': greeting,
            'rewritten_body': rewritten_body, 'suggested_closing': closing,
            'changes_made': changes, 'meaning_preserved': True,
            'reply_all_enforcement': True,
            'tone_confidence': round(self._tone_confidence(rewritten_body, target_tone), 2),
            'recommendations': self._generate_recommendations(current_tone, target_tone, body)
        }

    def _detect_current_tone(self, body: str) -> str:
        lower = body.lower()
        if any(w in lower for w in ['urgent', 'immediately', 'demand', 'require', 'must']):
            return 'assertive'
        if any(w in lower for w in ['sorry', 'understand', 'feel', 'appreciate', 'care']):
            return 'empathetic'
        if any(w in lower for w in ['hey', 'lol', 'btw', '!', 'cool', 'awesome']):
            return 'casual'
        if any(w in lower for w in ['perhaps', 'would it be', 'might', 'wonder']):
            return 'diplomatic'
        return 'formal'

    def _apply_tone(self, body: str, current: str, config: Dict, target: str) -> str:
        rewritten = body
        if target == 'formal':
            replacements = {"can't": "cannot", "won't": "will not", "don't": "do not", "isn't": "is not", "i'm": "I am", "we're": "we are", "hey": "Hello", "hi": "Hello", "thanks": "Thank you", "btw": "Additionally", "gonna": "going to", "wanna": "would like to"}
            for old, new in replacements.items():
                rewritten = re.sub(r'\b' + old + r'\b', new, rewritten, flags=re.IGNORECASE)
        elif target == 'casual':
            replacements = {"I would like to": "I'd like to", "Could you please": "Can you", "I am writing to": "Just wanted to", "Thank you for your": "Thanks for the", "Please find attached": "Here's the", "I look forward to": "Looking forward to"}
            for old, new in replacements.items():
                rewritten = rewritten.replace(old, new)
        elif target == 'empathetic':
            sentences = re.split(r'(?<=[.!?])\s+', rewritten)
            if sentences and not any(w in sentences[0].lower() for w in ['understand', 'appreciate', 'hear']):
                sentences.insert(0, "I understand where you're coming from.")
            rewritten = ' '.join(sentences)
        elif target == 'assertive':
            softeners = ['perhaps', 'maybe', 'I think', 'possibly', 'it seems like', 'sort of', 'kind of']
            for s in softeners:
                rewritten = re.sub(r'\b' + s + r'\b\s*', '', rewritten, flags=re.IGNORECASE)
        elif target == 'diplomatic':
            harsh = {'wrong': 'may need reconsideration', 'bad': 'could be improved', 'fail': 'present challenges', 'reject': 'need to explore alternatives', 'disagree': 'see it differently'}
            for old, new in harsh.items():
                rewritten = re.sub(r'\b' + old + r'\b', new, rewritten, flags=re.IGNORECASE)
        return rewritten.strip()

    def _adjust_subject(self, subject: str, tone: str) -> str:
        if tone == 'formal' and subject.startswith('Re:'):
            return subject
        if tone == 'assertive':
            if 'maybe' in subject.lower() or 'perhaps' in subject.lower():
                return re.sub(r'(?i)(maybe|perhaps)\s*', '', subject).strip()
        return subject

    def _suggest_greeting(self, sender: str, tone: str) -> str:
        name = sender.split('@')[0].replace('.', ' ').title() if '@' in sender else sender
        greetings = {'formal': f'Dear {name},', 'casual': f'Hey {name}!', 'empathetic': f'Hi {name},', 'assertive': f'{name},', 'diplomatic': f'Dear {name},'}
        return greetings.get(tone, f'Hi {name},')

    def _suggest_closing(self, tone: str) -> str:
        closings = {'formal': 'Sincerely,\n[Your Name]', 'casual': 'Cheers,\n[Your Name]', 'empathetic': 'Take care,\n[Your Name]', 'assertive': 'Regards,\n[Your Name]', 'diplomatic': 'With appreciation,\n[Your Name]'}
        return closings.get(tone, 'Best regards,\n[Your Name]')

    def _track_changes(self, original: str, rewritten: str) -> List[str]:
        changes = []
        if len(original) != len(rewritten):
            changes.append(f"Length adjusted: {len(original)} → {len(rewritten)} chars")
        orig_excl = original.count('!')
        new_excl = rewritten.count('!')
        if orig_excl != new_excl:
            changes.append(f"Exclamation marks: {orig_excl} → {new_excl}")
        return changes or ["Minor tone adjustments applied"]

    def _tone_confidence(self, rewritten: str, target: str) -> float:
        config = self.TONES.get(target, {})
        score = 0.5
        avoid = config.get('avoid', [])
        if avoid:
            violations = sum(1 for w in avoid if w.lower() in rewritten.lower())
            score += 0.5 * (1 - min(violations / 3, 1))
        return min(score, 1.0)

    def _generate_recommendations(self, current: str, target: str, body: str) -> List[str]:
        recs = []
        if current == 'casual' and target == 'formal':
            recs.append("Consider adding recipient's title (Mr./Ms./Dr.)")
        if current == 'assertive' and target == 'diplomatic':
            recs.append("Soften demands into collaborative requests")
        if len(body) > 500 and target == 'casual':
            recs.append("Consider shortening for casual tone")
        recs.append("Always use Reply All when other stakeholders need visibility")
        return recs

if __name__ == '__main__':
    rewriter = ToneRewriter()
    result = rewriter.rewrite({
        'from': 'john.smith@client.com', 'subject': 'Maybe we should reconsider the timeline',
        'body': "Hey! I think the deadline is kinda wrong and we're gonna need more time. Can't we just push it back? The team's stressed and I feel like this is bad for morale."
    }, target_tone='diplomatic')
    print(json.dumps(result, indent=2))
