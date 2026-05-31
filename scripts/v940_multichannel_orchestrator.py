#!/usr/bin/env python3
"""
V940: Email Multichannel Orchestrator
Intelligently routes communications across email, Slack, Teams, SMS, and WhatsApp
based on urgency, recipient preference, and content type.
Unified inbox with cross-channel context.
"""

import re
from datetime import datetime
from typing import Dict, List, Any, Optional


class MultichannelOrchestrator:
    """Orchestrate communications across multiple channels."""

    CHANNELS = {
        'email': {
            'best_for': ['formal', 'documentation', 'attachments', 'long-form'],
            'response_time': 'hours',
            'urgency_level': 'low-medium',
            'character_limit': None
        },
        'slack': {
            'best_for': ['quick questions', 'team collaboration', 'informal'],
            'response_time': 'minutes',
            'urgency_level': 'medium',
            'character_limit': 4000
        },
        'teams': {
            'best_for': ['meetings', 'enterprise collaboration', 'screen sharing'],
            'response_time': 'minutes',
            'urgency_level': 'medium',
            'character_limit': None
        },
        'sms': {
            'best_for': ['urgent', 'alerts', 'time-sensitive', 'on-call'],
            'response_time': 'immediate',
            'urgency_level': 'high',
            'character_limit': 160
        },
        'whatsapp': {
            'best_for': ['international', 'informal', 'quick updates', 'voice notes'],
            'response_time': 'minutes',
            'urgency_level': 'medium-high',
            'character_limit': 65536
        },
        'push_notification': {
            'best_for': ['alerts', 'reminders', 'status updates'],
            'response_time': 'immediate',
            'urgency_level': 'high',
            'character_limit': 200
        }
    }

    def __init__(self):
        self.recipient_preferences = {}
        self.routing_history = []
        self.channel_availability = {ch: True for ch in self.CHANNELS}

    def orchestrate(self, message_data: Dict[str, Any]) -> Dict[str, Any]:
        """Orchestrate message routing across channels."""
        subject = message_data.get('subject', '')
        body = message_data.get('body', '')
        recipients = message_data.get('recipients', [])
        attachments = message_data.get('attachments', [])
        urgency = message_data.get('urgency', None)

        text = f"{subject} {body}"

        # Auto-detect urgency if not specified
        if urgency is None:
            urgency = self._detect_urgency(text)

        # Classify content type
        content_type = self._classify_content(text, attachments)

        # Determine optimal channel for each recipient
        routing_decisions = []
        for recipient in recipients:
            decision = self._route_recipient(recipient, urgency, content_type, text, attachments)
            routing_decisions.append(decision)

        # Check for multi-channel needs (same message to multiple channels)
        channels_used = set(d['channel'] for d in routing_decisions)
        multi_channel = len(channels_used) > 1

        # Generate unified context
        unified_context = self._build_unified_context(routing_decisions)

        # Calculate efficiency score
        efficiency = self._calculate_efficiency(routing_decisions)

        # Track routing
        self.routing_history.append({
            'timestamp': datetime.now().isoformat(),
            'channels': list(channels_used),
            'recipients': len(recipients),
            'urgency': urgency
        })

        return {
            'urgency': urgency,
            'content_type': content_type,
            'routing_decisions': routing_decisions,
            'channels_used': list(channels_used),
            'multi_channel': multi_channel,
            'unified_context': unified_context,
            'efficiency_score': efficiency,
            'total_recipients': len(recipients),
            'reply_all_required': len(recipients) > 1,
            'summary': self._generate_summary(routing_decisions, urgency, content_type)
        }

    def _detect_urgency(self, text: str) -> str:
        """Auto-detect message urgency."""
        text_lower = text.lower()

        urgent_indicators = ['urgent', 'asap', 'emergency', 'immediately', 'critical', '!!!', 'right now', 'within the hour']
        high_indicators = ['important', 'priority', 'soon', 'today', 'by eod']
        medium_indicators = ['when possible', 'this week', 'please']

        urgent_count = sum(1 for kw in urgent_indicators if kw in text_lower)
        high_count = sum(1 for kw in high_indicators if kw in text_lower)

        if urgent_count >= 2 or '!!!' in text:
            return 'critical'
        elif urgent_count >= 1:
            return 'high'
        elif high_count >= 2:
            return 'medium'
        return 'low'

    def _classify_content(self, text: str, attachments: List[Dict]) -> str:
        """Classify the content type."""
        text_lower = text.lower()

        if attachments and any(a.get('size_mb', 0) > 5 for a in attachments):
            return 'heavy_attachment'
        elif any(w in text_lower for w in ['meeting', 'call', 'zoom', 'teams']):
            return 'meeting'
        elif any(w in text_lower for w in ['contract', 'agreement', 'legal', 'sign']):
            return 'formal_document'
        elif any(w in text_lower for w in ['alert', 'down', 'outage', 'incident']):
            return 'alert'
        elif len(text.split()) < 30:
            return 'quick_message'
        elif any(w in text_lower for w in ['report', 'analysis', 'summary', 'review']):
            return 'detailed_report'
        return 'general'

    def _route_recipient(self, recipient: str, urgency: str, content_type: str,
                         text: str, attachments: List[Dict]) -> Dict[str, Any]:
        """Determine optimal channel for a specific recipient."""
        # Check recipient preference
        pref = self.recipient_preferences.get(recipient, {})
        preferred_channel = pref.get('preferred_channel', None)

        # Score each channel
        scores = {}
        for channel, config in self.CHANNELS.items():
            score = self._score_channel(channel, config, urgency, content_type, text, attachments)
            scores[channel] = score

        # Apply preference boost
        if preferred_channel and preferred_channel in scores:
            scores[preferred_channel] += 20

        # Select best channel
        best_channel = max(scores, key=scores.get)
        confidence = min(95, scores[best_channel])

        # Generate adapted message for the channel
        adapted = self._adapt_message(text, best_channel, attachments)

        return {
            'recipient': recipient,
            'channel': best_channel,
            'confidence': confidence,
            'channel_scores': {ch: round(s, 1) for ch, s in sorted(scores.items(), key=lambda x: -x[1])[:3]},
            'adapted_message': adapted,
            'reason': self._routing_reason(best_channel, urgency, content_type),
            'fallback_channel': self._get_fallback(best_channel, scores)
        }

    def _score_channel(self, channel: str, config: Dict, urgency: str,
                       content_type: str, text: str, attachments: List[Dict]) -> float:
        """Score a channel for a given message."""
        score = 50.0  # Base score

        # Urgency matching
        urgency_channel_map = {
            'critical': ['sms', 'push_notification', 'whatsapp'],
            'high': ['sms', 'slack', 'whatsapp'],
            'medium': ['slack', 'teams', 'whatsapp', 'email'],
            'low': ['email', 'slack', 'teams']
        }
        if channel in urgency_channel_map.get(urgency, []):
            score += 20

        # Content type matching
        content_channel_map = {
            'heavy_attachment': ['email', 'teams'],
            'meeting': ['teams', 'slack', 'email'],
            'formal_document': ['email'],
            'alert': ['sms', 'push_notification', 'slack'],
            'quick_message': ['slack', 'sms', 'whatsapp'],
            'detailed_report': ['email', 'teams'],
            'general': ['email', 'slack', 'teams']
        }
        if channel in content_channel_map.get(content_type, []):
            score += 15

        # Channel availability
        if not self.channel_availability.get(channel, False):
            score -= 50

        # Character limit check
        if config.get('character_limit') and len(text) > config['character_limit']:
            score -= 30

        return max(0, score)

    def _adapt_message(self, text: str, channel: str, attachments: List[Dict]) -> str:
        """Adapt message for the target channel."""
        config = self.CHANNELS.get(channel, {})
        char_limit = config.get('character_limit')

        if channel == 'sms':
            # Truncate for SMS
            adapted = text[:157] + '...' if len(text) > 160 else text
            # Remove attachments reference
            adapted = re.sub(r'(?:attached|attachment|see attached)', '', adapted, flags=re.IGNORECASE)
            return adapted.strip()
        elif channel == 'slack':
            # Format for Slack
            adapted = text[:3997] + '...' if len(text) > 4000 else text
            return f"📨 {adapted}"
        elif channel == 'push_notification':
            return text[:197] + '...' if len(text) > 200 else text
        elif channel == 'whatsapp':
            return f"📩 {text}"
        else:
            return text

    def _routing_reason(self, channel: str, urgency: str, content_type: str) -> str:
        """Generate human-readable routing reason."""
        reasons = {
            'sms': f"Urgent ({urgency}) message best delivered via SMS for immediate attention",
            'slack': f"Quick collaboration message suited for Slack",
            'teams': f"Team communication best handled via Microsoft Teams",
            'email': f"Formal/detailed content ({content_type}) requires email documentation",
            'whatsapp': f"International/informal message suited for WhatsApp",
            'push_notification': f"Alert requiring immediate attention via push notification"
        }
        return reasons.get(channel, f"Optimal channel for {content_type} at {urgency} urgency")

    def _get_fallback(self, primary: str, scores: Dict) -> str:
        """Get fallback channel."""
        sorted_channels = sorted(scores.items(), key=lambda x: -x[1])
        for ch, score in sorted_channels:
            if ch != primary and score > 30:
                return ch
        return 'email'

    def _build_unified_context(self, decisions: List[Dict]) -> Dict[str, Any]:
        """Build unified inbox context."""
        channels = {}
        for d in decisions:
            ch = d['channel']
            if ch not in channels:
                channels[ch] = []
            channels[ch].append(d['recipient'])

        return {
            'channels': channels,
            'total_recipients': len(decisions),
            'cross_channel': len(channels) > 1,
            'primary_channel': max(channels, key=lambda k: len(channels[k])) if channels else 'email'
        }

    def _calculate_efficiency(self, decisions: List[Dict]) -> int:
        """Calculate routing efficiency score."""
        if not decisions:
            return 0
        avg_confidence = sum(d['confidence'] for d in decisions) / len(decisions)
        return min(100, int(avg_confidence))

    def _generate_summary(self, decisions: List[Dict], urgency: str, content_type: str) -> str:
        """Generate human-readable summary."""
        channels_used = set(d['channel'] for d in decisions)
        parts = [
            f"Routed {len(decisions)} recipients across {len(channels_used)} channel(s).",
            f"Urgency: {urgency}. Content: {content_type}.",
            f"Channels: {', '.join(channels_used)}."
        ]
        return ' '.join(parts)


def main():
    orchestrator = MultichannelOrchestrator()

    # Set some recipient preferences
    orchestrator.recipient_preferences = {
        'ceo@company.com': {'preferred_channel': 'email'},
        'oncall@company.com': {'preferred_channel': 'sms'},
        'team@company.com': {'preferred_channel': 'slack'},
        'client@international.com': {'preferred_channel': 'whatsapp'}
    }

    test_messages = [
        {
            'subject': 'CRITICAL: Production outage!!!',
            'body': 'URGENT!!! Production is down!!! All customers affected!!! Need immediate response!!!',
            'recipients': ['oncall@company.com', 'ceo@company.com', 'team@company.com'],
            'attachments': []
        },
        {
            'subject': 'Weekly team update',
            'body': 'Hi team, here is the weekly status report. All projects on track. Details in the attached PDF report with full analytics and projections for Q4.',
            'recipients': ['team@company.com', 'manager@company.com', 'client@international.com'],
            'attachments': [{'name': 'report.pdf', 'size_mb': 8}]
        },
        {
            'subject': 'Meeting: Q4 Planning',
            'body': 'Please join the Q4 planning meeting tomorrow at 2pm. We will discuss roadmap and priorities.',
            'recipients': ['team@company.com', 'ceo@company.com', 'oncall@company.com'],
            'attachments': []
        }
    ]

    print("=" * 60)
    print("V940: Multichannel Orchestrator - Test Results")
    print("=" * 60)

    for msg in test_messages:
        result = orchestrator.orchestrate(msg)
        print(f"\nSubject: {msg['subject'][:50]}")
        print(f"Urgency: {result['urgency']}")
        print(f"Content Type: {result['content_type']}")
        print(f"Channels: {result['channels_used']}")
        print(f"Multi-Channel: {result['multi_channel']}")
        print(f"Efficiency: {result['efficiency_score']}%")
        print(f"Reply All: {result['reply_all_required']}")
        print("Routing:")
        for d in result['routing_decisions']:
            print(f"  {d['recipient']} -> {d['channel']} ({d['confidence']}%) | {d['reason'][:50]}")
        print(f"Summary: {result['summary']}")

    print(f"\n✅ V940 Multichannel Orchestrator: OPERATIONAL")


if __name__ == '__main__':
    main()
