#!/usr/bin/env python3
"""
V938: Email Emotional Intelligence Coach
Real-time coaching that detects emotional triggers in incoming emails
and suggests response strategies to prevent reactive responses.
"""

import re
from datetime import datetime
from typing import Dict, List, Any, Optional


class EmotionalIntelligenceCoach:
    """Coach users on emotional intelligence in email communications."""

    def __init__(self):
        self.emotion_lexicon = {
            'anger': ['furious', 'outraged', 'unacceptable', 'ridiculous', 'absurd', 'disgusted', 'enraged'],
            'frustration': ['frustrated', 'annoyed', 'irritated', 'fed up', 'done with', 'tired of'],
            'anxiety': ['worried', 'anxious', 'concerned', 'stressed', 'overwhelmed', 'nervous', 'panicking'],
            'sadness': ['disappointed', 'sad', 'upset', 'hurt', 'devastated', 'heartbroken'],
            'joy': ['excited', 'thrilled', 'amazing', 'fantastic', 'wonderful', 'delighted', 'ecstatic'],
            'gratitude': ['thankful', 'grateful', 'appreciate', 'blessed', 'indebted']
        }
        self.trigger_patterns = [
            r'always\s+(?:never|fail|wrong)',
            r'never\s+(?:listen|understand|care)',
            r'you\s+(?:always|never)\s+',
            r'this is\s+(?:unacceptable|ridiculous|absurd)',
            r'i\s+(?:demand|insist|expect)',
            r'!!!',
            r'all caps|ALL CAPS'
        ]
        self.coaching_history = []

    def analyze_and_coach(self, email_data: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze incoming email and provide emotional intelligence coaching."""
        subject = email_data.get('subject', '')
        body = email_data.get('body', '')
        sender = email_data.get('sender', '')
        recipients = email_data.get('recipients', [])
        user_emotional_state = email_data.get('user_state', 'neutral')

        text = f"{subject} {body}"

        # Analyze sender's emotional state
        sender_emotions = self._detect_emotions(text)

        # Detect trigger patterns
        triggers = self._detect_triggers(text)

        # Assess escalation risk
        escalation_risk = self._assess_escalation_risk(sender_emotions, triggers)

        # Generate coaching advice
        coaching = self._generate_coaching(sender_emotions, triggers, escalation_risk, user_emotional_state)

        # Suggest response strategies
        strategies = self._suggest_strategies(sender_emotions, escalation_risk, text)

        # Draft emotionally intelligent response
        draft = self._draft_empathetic_response(sender_emotions, subject, body, sender, recipients)

        # Track coaching
        self.coaching_history.append({
            'timestamp': datetime.now().isoformat(),
            'sender': sender,
            'emotions': sender_emotions,
            'triggers': len(triggers),
            'escalation_risk': escalation_risk
        })

        return {
            'sender_emotions': sender_emotions,
            'primary_emotion': sender_emotions[0]['emotion'] if sender_emotions else 'neutral',
            'emotional_intensity': max([e['intensity'] for e in sender_emotions], default=0),
            'triggers_detected': triggers,
            'escalation_risk': escalation_risk,
            'coaching': coaching,
            'response_strategies': strategies,
            'suggested_draft': draft,
            'reply_all_required': len(recipients) > 1,
            'cool_down_recommended': escalation_risk >= 70
        }

    def _detect_emotions(self, text: str) -> List[Dict[str, Any]]:
        """Detect emotions in text."""
        text_lower = text.lower()
        detected = []

        for emotion, words in self.emotion_lexicon.items():
            matches = [w for w in words if w in text_lower]
            if matches:
                intensity = min(100, len(matches) * 25 + 20)
                # Boost for emphasis
                if '!!!' in text or text.isupper():
                    intensity = min(100, intensity + 20)
                detected.append({
                    'emotion': emotion,
                    'intensity': intensity,
                    'indicators': matches[:3]
                })

        # Sort by intensity
        detected.sort(key=lambda x: x['intensity'], reverse=True)
        return detected[:3]

    def _detect_triggers(self, text: str) -> List[str]:
        """Detect emotional trigger patterns."""
        triggers = []
        for pattern in self.trigger_patterns:
            if re.search(pattern, text, re.IGNORECASE):
                match = re.search(pattern, text, re.IGNORECASE)
                triggers.append(match.group(0))
        return triggers[:5]

    def _assess_escalation_risk(self, emotions: List[Dict], triggers: List[str]) -> int:
        """Assess risk of escalation (0-100)."""
        risk = 0

        # Emotion intensity contribution
        for emotion in emotions:
            if emotion['emotion'] in ['anger', 'frustration']:
                risk += emotion['intensity'] * 0.4
            elif emotion['emotion'] == 'anxiety':
                risk += emotion['intensity'] * 0.2
            elif emotion['emotion'] == 'sadness':
                risk += emotion['intensity'] * 0.15

        # Trigger contribution
        risk += len(triggers) * 15

        return min(100, int(risk))

    def _generate_coaching(self, emotions: List[Dict], triggers: List[str],
                           risk: int, user_state: str) -> List[str]:
        """Generate emotional intelligence coaching tips."""
        coaching = []

        if risk >= 70:
            coaching.append("🛑 HIGH RISK: Take a 10-minute break before responding")
            coaching.append("🧘 Practice deep breathing: 4 counts in, 4 hold, 4 out")

        if any(e['emotion'] == 'anger' for e in emotions):
            coaching.append("😤 Sender appears angry. Acknowledge their feelings first before addressing the issue")
            coaching.append("💡 Use 'I understand your frustration' as an opening")

        if any(e['emotion'] == 'frustration' for e in emotions):
            coaching.append("😩 Sender is frustrated. Show empathy and provide concrete solutions")
            coaching.append("💡 Avoid defensive language. Focus on resolution")

        if any(e['emotion'] == 'anxiety' for e in emotions):
            coaching.append("😰 Sender is anxious. Provide reassurance and clear timelines")
            coaching.append("💡 Be specific about next steps and deadlines")

        if any(e['emotion'] == 'sadness' for e in emotions):
            coaching.append("😢 Sender is upset/disappointed. Express genuine concern")
            coaching.append("💡 Acknowledge the impact and offer support")

        if triggers:
            coaching.append(f"⚠️ {len(triggers)} emotional trigger(s) detected. Respond with care")

        if risk < 30:
            coaching.append("✅ Low emotional intensity. Standard professional response is appropriate")

        if not coaching:
            coaching.append("📧 Neutral tone detected. Proceed with your normal communication style")

        return coaching

    def _suggest_strategies(self, emotions: List[Dict], risk: int, text: str) -> List[Dict[str, str]]:
        """Suggest response strategies."""
        strategies = []

        if risk >= 70:
            strategies.append({
                'strategy': 'Delay and Reflect',
                'description': 'Wait 10-30 minutes before responding. Draft, review, then send.',
                'priority': 'high'
            })
            strategies.append({
                'strategy': 'Phone Call Instead',
                'description': 'Complex emotional situations are better resolved via voice.',
                'priority': 'high'
            })

        if any(e['emotion'] == 'anger' for e in emotions):
            strategies.append({
                'strategy': 'Acknowledge-Validate-Solve',
                'description': 'First acknowledge feelings, validate their experience, then offer solution.',
                'priority': 'high'
            })

        if any(e['emotion'] == 'frustration' for e in emotions):
            strategies.append({
                'strategy': 'Solution-Focused Response',
                'description': 'Skip lengthy explanations. Focus directly on what you will do to fix it.',
                'priority': 'medium'
            })

        if risk < 30:
            strategies.append({
                'strategy': 'Standard Professional',
                'description': 'Respond normally with your usual professional tone.',
                'priority': 'low'
            })

        return strategies

    def _draft_empathetic_response(self, emotions: List[Dict], subject: str,
                                    body: str, sender: str, recipients: List[str]) -> str:
        """Draft an emotionally intelligent response."""
        sender_name = sender.split('@')[0].replace('.', ' ').title() if '@' in sender else sender
        primary = emotions[0]['emotion'] if emotions else 'neutral'

        if primary == 'anger':
            draft = f"Hi {sender_name},\n\nI completely understand your frustration and I take your concerns very seriously. You are right to expect better, and I want to personally assure you that I am addressing this immediately.\n\nHere is what I am doing right now to resolve this:\n1. Investigating the root cause\n2. Implementing an immediate fix\n3. Putting measures in place to prevent recurrence\n\nI will follow up within 2 hours with a detailed update.\n\nBest regards"
        elif primary == 'frustration':
            draft = f"Hi {sender_name},\n\nI hear you, and I understand this has been frustrating. Let me take ownership of this and get it resolved for you.\n\nI am working on a solution right now and will have an update for you shortly. Thank you for your patience.\n\nBest regards"
        elif primary == 'anxiety':
            draft = f"Hi {sender_name},\n\nThank you for sharing your concerns. I want to reassure you that we have this under control.\n\nHere is the current status and what to expect:\n- [Current status]\n- [Next steps with timeline]\n- [How we will keep you updated]\n\nPlease do not hesitate to reach out if anything else comes up.\n\nBest regards"
        elif primary == 'sadness':
            draft = f"Hi {sender_name},\n\nI am truly sorry to hear about this situation. I understand how disappointing this must be.\n\nI want to make this right. Here is what I can do to help:\n[List specific actions]\n\nPlease let me know if there is anything else I can do.\n\nWith sincere regards"
        elif primary in ['joy', 'gratitude']:
            draft = f"Hi {sender_name},\n\nThank you so much for the kind words! It is wonderful to hear such positive feedback.\n\nWe are thrilled that everything is going well. Please continue to reach out anytime.\n\nWarm regards"
        else:
            draft = f"Hi {sender_name},\n\nThank you for your email. I have reviewed the contents and will respond accordingly.\n\nPlease let me know if you need anything else.\n\nBest regards"

        if len(recipients) > 1:
            draft += f"\n\n[Reply All: {len(recipients)} recipients included]"

        return draft


def main():
    coach = EmotionalIntelligenceCoach()

    test_emails = [
        {
            'subject': 'URGENT: This is completely unacceptable!!!',
            'body': 'I am absolutely FURIOUS. You always fail to deliver on time. This is the third time this has happened and I am DONE with your excuses. I demand an immediate explanation!!!',
            'sender': 'angry.client@company.com',
            'recipients': ['support@company.com', 'manager@company.com', 'ceo@company.com']
        },
        {
            'subject': 'Quick update',
            'body': 'Hi team, just wanted to share that we hit our quarterly targets! Amazing work everyone!',
            'sender': 'manager@company.com',
            'recipients': ['team@company.com']
        }
    ]

    print("=" * 60)
    print("V938: Emotional Intelligence Coach - Test Results")
    print("=" * 60)

    for email in test_emails:
        result = coach.analyze_and_coach(email)
        print(f"\nSubject: {email['subject'][:50]}")
        print(f"Primary Emotion: {result['primary_emotion']} (intensity: {result['emotional_intensity']})")
        print(f"Escalation Risk: {result['escalation_risk']}/100")
        print(f"Triggers: {len(result['triggers_detected'])}")
        print(f"Cool Down: {result['cool_down_recommended']}")
        print(f"Reply All: {result['reply_all_required']}")
        print("Coaching:")
        for tip in result['coaching'][:3]:
            print(f"  {tip}")
        print("Strategies:")
        for s in result['response_strategies'][:2]:
            print(f"  {s['strategy']}: {s['description'][:60]}")

    print(f"\n✅ V938 Emotional Intelligence Coach: OPERATIONAL")


if __name__ == '__main__':
    main()
