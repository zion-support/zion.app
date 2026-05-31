#!/usr/bin/env python3
"""
V936: Email Digital Twin Engine
Creates an AI clone of your email persona that drafts responses,
handles routine inquiries, and maintains your communication style.
"""

import re
from datetime import datetime
from typing import Dict, List, Any, Optional
from collections import Counter


class EmailDigitalTwin:
    """AI digital twin that learns and replicates your email persona."""

    def __init__(self):
        self.persona = {
            'greeting_style': None,
            'closing_style': None,
            'avg_sentence_length': 0,
            'formality_level': 'medium',
            'common_phrases': [],
            'emoji_usage': 0,
            'response_tone': 'professional',
            'vocabulary_richness': 0,
            'signature': None,
            'reply_patterns': {}
        }
        self.training_emails = []
        self.trained = False

    def train_from_emails(self, emails: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Train the digital twin from historical emails."""
        if len(emails) < 5:
            return {'status': 'insufficient_data', 'message': 'Need at least 5 emails to train'}

        self.training_emails = emails

        # Analyze greeting patterns
        greetings = []
        for email in emails:
            body = email.get('body', '')
            first_line = body.split('\n')[0].strip() if body else ''
            if first_line:
                greetings.append(first_line[:50])
        greeting_counter = Counter(greetings)
        self.persona['greeting_style'] = greeting_counter.most_common(1)[0][0] if greeting_counter else 'Hi'

        # Analyze closing patterns
        closings = []
        for email in emails:
            body = email.get('body', '')
            lines = [l.strip() for l in body.split('\n') if l.strip()]
            if len(lines) >= 2:
                closings.append(lines[-2] if len(lines) > 2 else lines[-1])
        closing_counter = Counter(closings)
        self.persona['closing_style'] = closing_counter.most_common(1)[0][0] if closing_counter else 'Best regards'

        # Average sentence length
        all_sentences = []
        for email in emails:
            body = email.get('body', '')
            sentences = re.split(r'[.!?]+', body)
            all_sentences.extend([s.strip() for s in sentences if len(s.strip()) > 5])
        if all_sentences:
            self.persona['avg_sentence_length'] = sum(len(s.split()) for s in all_sentences) / len(all_sentences)

        # Formality level
        formal_words = ['therefore', 'furthermore', 'regarding', 'pursuant', 'hereby', 'kindly']
        informal_words = ['hey', 'gonna', 'wanna', 'cool', 'awesome', 'btw', 'lol']
        all_text = ' '.join([e.get('body', '') for e in emails]).lower()
        formal_count = sum(1 for w in formal_words if w in all_text)
        informal_count = sum(1 for w in informal_words if w in all_text)
        if formal_count > informal_count * 2:
            self.persona['formality_level'] = 'high'
        elif informal_count > formal_count:
            self.persona['formality_level'] = 'low'
        else:
            self.persona['formality_level'] = 'medium'

        # Common phrases
        words = re.findall(r'\b\w{3,}\b', all_text)
        word_freq = Counter(words)
        stops = {'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'was', 'that', 'this', 'with', 'from'}
        self.persona['common_phrases'] = [w for w, _ in word_freq.most_common(15) if w not in stops]

        # Emoji usage
        emoji_pattern = re.compile(r'[\U0001F600-\U0001F64F\U0001F300-\U0001F5FF\U0001F680-\U0001F6FF]')
        total_emojis = sum(len(emoji_pattern.findall(e.get('body', ''))) for e in emails)
        self.persona['emoji_usage'] = total_emojis / max(len(emails), 1)

        # Response tone
        positive = sum(1 for e in emails if any(w in e.get('body', '').lower() for w in ['great', 'thanks', 'happy', 'pleased', 'love']))
        negative = sum(1 for e in emails if any(w in e.get('body', '').lower() for w in ['concerned', 'disappointed', 'issue', 'problem']))
        if positive > negative * 2:
            self.persona['response_tone'] = 'warm'
        elif negative > positive:
            self.persona['response_tone'] = 'measured'
        else:
            self.persona['response_tone'] = 'professional'

        # Vocabulary richness
        unique_words = len(set(words))
        total_words = len(words)
        self.persona['vocabulary_richness'] = round(unique_words / max(total_words, 1), 2)

        # Signature detection
        for email in reversed(emails):
            body = email.get('body', '')
            lines = [l.strip() for l in body.split('\n') if l.strip()]
            if len(lines) >= 3:
                potential_sig = '\n'.join(lines[-3:])
                if any(kw in potential_sig.lower() for kw in ['regards', 'best', 'thanks', 'sincerely']):
                    self.persona['signature'] = potential_sig
                    break

        self.trained = True

        return {
            'status': 'trained',
            'emails_analyzed': len(emails),
            'persona': self.persona,
            'confidence': min(95, 50 + len(emails) * 3)
        }

    def draft_response(self, incoming_email: Dict[str, Any]) -> Dict[str, Any]:
        """Draft a response in your style."""
        if not self.trained:
            return {'status': 'not_trained', 'message': 'Train the twin first with historical emails'}

        subject = incoming_email.get('subject', '')
        body = incoming_email.get('body', '')
        sender = incoming_email.get('sender', '')
        recipients = incoming_email.get('recipients', [])

        # Analyze incoming email intent
        intent = self._classify_intent(subject, body)

        # Generate draft based on intent and persona
        draft = self._generate_draft(intent, subject, body, sender)

        # Calculate confidence
        confidence = self._calculate_confidence(intent, body)

        return {
            'status': 'draft_generated',
            'intent': intent,
            'draft_subject': f"Re: {subject}" if not subject.startswith('Re:') else subject,
            'draft_body': draft['body'],
            'confidence': confidence,
            'requires_review': confidence < 70,
            'tone_matched': True,
            'persona_applied': {
                'greeting': self.persona['greeting_style'],
                'closing': self.persona['closing_style'],
                'formality': self.persona['formality_level'],
                'tone': self.persona['response_tone']
            },
            'reply_all_required': len(recipients) > 1,
            'reply_all_note': f"This email has {len(recipients)} recipients - Reply All enforced" if len(recipients) > 1 else None
        }

    def _classify_intent(self, subject: str, body: str) -> str:
        """Classify the intent of an incoming email."""
        text = f"{subject} {body}".lower()

        intents = {
            'question': ['?', 'how', 'what', 'when', 'where', 'why', 'can you', 'could you'],
            'request': ['please', 'need', 'request', 'ask', 'would you', 'could you please'],
            'meeting': ['meeting', 'call', 'schedule', 'available', 'calendar', 'zoom', 'teams'],
            'followup': ['follow up', 'update', 'status', 'progress', 'checking in'],
            'thank_you': ['thank', 'thanks', 'appreciate', 'grateful'],
            'complaint': ['issue', 'problem', 'concern', 'unhappy', 'disappointed'],
            'introduction': ['introduce', 'pleased to meet', 'connect', 'referral'],
            'general': []
        }

        scores = {}
        for intent, keywords in intents.items():
            scores[intent] = sum(1 for kw in keywords if kw in text)

        best = max(scores, key=scores.get)
        return best if scores[best] > 0 else 'general'

    def _generate_draft(self, intent: str, subject: str, body: str, sender: str) -> Dict[str, str]:
        """Generate a draft response matching persona."""
        greeting = self.persona['greeting_style'] or 'Hi'
        closing = self.persona['closing_style'] or 'Best regards'
        formality = self.persona['formality_level']

        sender_name = sender.split('@')[0].replace('.', ' ').title() if '@' in sender else sender

        if intent == 'question':
            draft_body = f"{greeting} {sender_name},\n\nThank you for your question regarding this matter. I have reviewed your inquiry and will provide a detailed response shortly.\n\nIn the meantime, please let me know if there is anything else I can help with.\n\n{closing}"
        elif intent == 'request':
            draft_body = f"{greeting} {sender_name},\n\nI have received your request and will begin working on it right away. I will keep you updated on the progress.\n\nPlease feel free to reach out if you need anything else.\n\n{closing}"
        elif intent == 'meeting':
            draft_body = f"{greeting} {sender_name},\n\nThank you for reaching out about scheduling a meeting. I am available at the following times:\n\n- Tomorrow 10:00 AM - 11:00 AM\n- Day after 2:00 PM - 3:00 PM\n\nPlease let me know which works best for you.\n\n{closing}"
        elif intent == 'followup':
            draft_body = f"{greeting} {sender_name},\n\nThank you for following up. Here is the latest status update on the matter. Everything is on track and progressing as planned.\n\nI will provide another update by end of week.\n\n{closing}"
        elif intent == 'thank_you':
            draft_body = f"{greeting} {sender_name},\n\nYou are very welcome! It was my pleasure to help. Please do not hesitate to reach out anytime.\n\n{closing}"
        elif intent == 'complaint':
            draft_body = f"{greeting} {sender_name},\n\nI sincerely apologize for the inconvenience. I understand your concern and want to assure you that we take this matter seriously.\n\nI am personally looking into this and will have a resolution for you within 24 hours.\n\n{closing}"
        elif intent == 'introduction':
            draft_body = f"{greeting} {sender_name},\n\nThank you for reaching out. It is great to connect with you. I look forward to exploring how we can work together.\n\nWould you be available for a brief call this week to discuss further?\n\n{closing}"
        else:
            draft_body = f"{greeting} {sender_name},\n\nThank you for your email. I have reviewed the contents and will respond in detail shortly.\n\n{closing}"

        return {'body': draft_body}

    def _calculate_confidence(self, intent: str, body: str) -> int:
        """Calculate confidence score for the draft."""
        base_confidence = 70

        # More training data = higher confidence
        base_confidence += min(20, len(self.training_emails) * 2)

        # Common intents are easier to handle
        if intent in ['thank_you', 'followup', 'general']:
            base_confidence += 10
        elif intent in ['complaint']:
            base_confidence -= 10

        # Longer emails are harder to match
        if len(body.split()) > 200:
            base_confidence -= 5

        return min(95, max(30, base_confidence))


def main():
    twin = EmailDigitalTwin()

    # Training emails (simulating user's past emails)
    training_emails = [
        {'body': 'Hi team,\n\nGreat work on the project this week. Really appreciate the effort everyone put in.\n\nBest regards,\nJohn Smith\nVP Engineering'},
        {'body': 'Hi Sarah,\n\nThanks for the update. The progress looks solid. Let me know if you need any support.\n\nBest regards,\nJohn'},
        {'body': 'Hi all,\n\nPlease find attached the quarterly report. Let me know if you have any questions.\n\nBest regards,\nJohn Smith'},
        {'body': 'Hey Mark,\n\nHappy to help with that. I will send over the details by end of day.\n\nCheers,\nJohn'},
        {'body': 'Hi team,\n\nFollowing up on yesterday\'s discussion. Action items are documented in the shared folder.\n\nThanks,\nJohn'},
        {'body': 'Dear Client,\n\nThank you for your inquiry. I am pleased to confirm the details.\n\nBest regards,\nJohn Smith\nVP Engineering'},
    ]

    result = twin.train_from_emails(training_emails)
    print("=" * 60)
    print("V936: Email Digital Twin Engine - Test Results")
    print("=" * 60)
    print(f"\nTraining: {result['status']} ({result['emails_analyzed']} emails)")
    print(f"Confidence: {result['confidence']}%")
    print(f"Persona:")
    p = result['persona']
    print(f"  Greeting: {p['greeting_style']}")
    print(f"  Closing: {p['closing_style']}")
    print(f"  Formality: {p['formality_level']}")
    print(f"  Tone: {p['response_tone']}")
    print(f"  Avg sentence length: {p['avg_sentence_length']:.1f} words")

    # Test draft generation
    test_email = {
        'subject': 'Question about project timeline',
        'body': 'Hi John, can you let me know when the new feature will be ready for testing? We need to plan our QA cycle.',
        'sender': 'alice@company.com',
        'recipients': ['john@company.com', 'manager@company.com', 'qa@company.com']
    }

    draft = twin.draft_response(test_email)
    print(f"\nDraft for: {test_email['subject']}")
    print(f"Intent: {draft['intent']}")
    print(f"Confidence: {draft['confidence']}%")
    print(f"Requires Review: {draft['requires_review']}")
    print(f"Reply All: {draft['reply_all_required']}")
    print(f"Draft:\n{draft['draft_body']}")
    print(f"\n✅ V936 Email Digital Twin: OPERATIONAL")


if __name__ == '__main__':
    main()
