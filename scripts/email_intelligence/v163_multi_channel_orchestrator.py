#!/usr/bin/env python3
"""
V163 - AI Email Multi-Channel Response Orchestrator
Coordinates email responses with Slack, Teams, SMS, phone, and other channels
to ensure consistent cross-channel communication and unified context.
"""

import json
import re
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
from collections import defaultdict
from enum import Enum


class ChannelType(Enum):
    EMAIL = "email"
    SLACK = "slack"
    TEAMS = "teams"
    SMS = "sms"
    PHONE = "phone"
    WHATSAPP = "whatsapp"
    LINKEDIN = "linkedin"
    ZOOM_CHAT = "zoom_chat"
    DISCORD = "discord"
    WEB_CHAT = "web_chat"


class MultiChannelOrchestrator:
    """AI-powered multi-channel response orchestration engine."""

    def __init__(self):
        self.channel_registry = self._build_channel_registry()
        self.conversation_threads = defaultdict(dict)
        self.routing_rules = self._build_routing_rules()
        self.response_history = defaultdict(list)
        self.channel_preferences = defaultdict(dict)

    def _build_channel_registry(self) -> Dict[str, Dict]:
        """Build channel configuration registry."""
        return {
            'email': {
                'name': 'Email',
                'response_time_sla': '4 hours',
                'formality': 'formal',
                'max_length': 5000,
                'supports_attachments': True,
                'supports_threads': True,
                'best_for': ['detailed_communication', 'formal_requests', 'documentation']
            },
            'slack': {
                'name': 'Slack',
                'response_time_sla': '30 minutes',
                'formality': 'informal',
                'max_length': 4000,
                'supports_attachments': True,
                'supports_threads': True,
                'best_for': ['quick_questions', 'team_collaboration', 'urgent_updates']
            },
            'teams': {
                'name': 'Microsoft Teams',
                'response_time_sla': '30 minutes',
                'formality': 'semi_formal',
                'max_length': 4000,
                'supports_attachments': True,
                'supports_threads': True,
                'best_for': ['meetings', 'team_chat', 'file_sharing']
            },
            'sms': {
                'name': 'SMS',
                'response_time_sla': '15 minutes',
                'formality': 'informal',
                'max_length': 160,
                'supports_attachments': False,
                'supports_threads': False,
                'best_for': ['urgent_alerts', 'quick_confirmations', 'on_call']
            },
            'phone': {
                'name': 'Phone Call',
                'response_time_sla': 'immediate',
                'formality': 'semi_formal',
                'max_length': None,
                'supports_attachments': False,
                'supports_threads': False,
                'best_for': ['complex_discussions', 'negotiations', 'relationship_building']
            },
            'whatsapp': {
                'name': 'WhatsApp',
                'response_time_sla': '1 hour',
                'formality': 'informal',
                'max_length': 65000,
                'supports_attachments': True,
                'supports_threads': False,
                'best_for': ['international', 'quick_messaging', 'media_sharing']
            },
            'linkedin': {
                'name': 'LinkedIn',
                'response_time_sla': '24 hours',
                'formality': 'professional',
                'max_length': 3000,
                'supports_attachments': False,
                'supports_threads': False,
                'best_for': ['networking', 'recruiting', 'business_development']
            },
            'web_chat': {
                'name': 'Web Chat',
                'response_time_sla': '5 minutes',
                'formality': 'semi_formal',
                'max_length': 2000,
                'supports_attachments': False,
                'supports_threads': True,
                'best_for': ['customer_support', 'sales_inquiries', 'quick_help']
            }
        }

    def _build_routing_rules(self) -> List[Dict[str, Any]]:
        """Build intelligent routing rules."""
        return [
            {'trigger': 'urgent', 'primary': 'sms', 'secondary': 'slack', 'escalate_to': 'phone'},
            {'trigger': 'contract', 'primary': 'email', 'secondary': None, 'escalate_to': 'phone'},
            {'trigger': 'quick_question', 'primary': 'slack', 'secondary': 'teams', 'escalate_to': 'email'},
            {'trigger': 'complaint', 'primary': 'email', 'secondary': 'phone', 'escalate_to': 'email'},
            {'trigger': 'meeting_request', 'primary': 'email', 'secondary': 'teams', 'escalate_to': None},
            {'trigger': 'technical_issue', 'primary': 'slack', 'secondary': 'email', 'escalate_to': 'phone'},
            {'trigger': 'sales_inquiry', 'primary': 'email', 'secondary': 'phone', 'escalate_to': 'email'},
            {'trigger': 'networking', 'primary': 'linkedin', 'secondary': 'email', 'escalate_to': None}
        ]

    def orchestrate_response(self, email: Dict[str, Any], context: Dict[str, Any] = None) -> Dict[str, Any]:
        """Orchestrate multi-channel response for an email."""
        content = f"{email.get('subject', '')} {email.get('body', '')}"
        sender = email.get('from', '')

        # Analyze message characteristics
        analysis = self._analyze_message(email)

        # Determine optimal channels
        channel_recommendation = self._recommend_channels(analysis, sender)

        # Generate channel-specific responses
        responses = self._generate_channel_responses(email, channel_recommendation, analysis)

        # Build unified thread
        thread = self._build_unified_thread(email, responses, sender)

        # Check for cross-channel conflicts
        conflicts = self._detect_cross_channel_conflicts(sender, thread)

        # Escalation path
        escalation = self._determine_escalation_path(analysis, channel_recommendation)

        return {
            'orchestration_id': f"orch_{datetime.now().strftime('%Y%m%d%H%M%S')}",
            'timestamp': datetime.now().isoformat(),
            'message_analysis': analysis,
            'channel_recommendation': channel_recommendation,
            'generated_responses': responses,
            'unified_thread': thread,
            'cross_channel_conflicts': conflicts,
            'escalation_path': escalation,
            'context_preservation': self._preserve_context(email, thread),
            'reply_all_enforcement': True,
            'response_tracking': self._setup_response_tracking(responses)
        }

    def _analyze_message(self, email: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze message characteristics for routing."""
        content = f"{email.get('subject', '')} {email.get('body', '')}".lower()
        body = email.get('body', '')

        # Urgency detection
        urgency_indicators = ['urgent', 'asap', 'immediately', 'critical', 'emergency', 'now']
        urgency_score = sum(1 for w in urgency_indicators if w in content)

        # Complexity detection
        word_count = len(body.split())
        question_count = body.count('?')
        complexity = 'high' if word_count > 300 or question_count > 3 else 'medium' if word_count > 100 else 'low'

        # Formality detection
        formal_words = ['dear', 'sincerely', 'regards', 'respectfully', 'kindly']
        informal_words = ['hey', 'btw', 'lol', 'thanks', 'cheers']
        formal_count = sum(1 for w in formal_words if w in content)
        informal_count = sum(1 for w in informal_words if w in content)
        formality = 'formal' if formal_count > informal_count else 'informal' if informal_count > 0 else 'semi_formal'

        # Topic detection
        topics = []
        topic_keywords = {
            'contract': ['contract', 'agreement', 'terms', 'legal'],
            'technical': ['bug', 'error', 'api', 'deploy', 'server', 'code'],
            'sales': ['purchase', 'pricing', 'quote', 'deal', 'proposal'],
            'support': ['help', 'issue', 'problem', 'not working', 'broken'],
            'meeting': ['meeting', 'call', 'schedule', 'appointment', 'calendar'],
            'networking': ['connect', 'introduce', 'referral', 'partnership']
        }
        for topic, keywords in topic_keywords.items():
            if any(kw in content for kw in keywords):
                topics.append(topic)

        # Emotional tone
        sentiment = self._detect_sentiment(content)

        return {
            'urgency': 'high' if urgency_score >= 2 else 'medium' if urgency_score >= 1 else 'normal',
            'complexity': complexity,
            'formality': formality,
            'word_count': word_count,
            'question_count': question_count,
            'topics': topics,
            'sentiment': sentiment,
            'requires_immediate_response': urgency_score >= 2,
            'has_attachments': len(email.get('attachments', [])) > 0
        }

    def _detect_sentiment(self, content: str) -> str:
        """Detect emotional sentiment."""
        positive = ['great', 'excellent', 'thank', 'appreciate', 'love', 'happy', 'wonderful']
        negative = ['angry', 'frustrated', 'disappointed', 'terrible', 'unhappy', 'upset', 'worried']

        pos = sum(1 for w in positive if w in content)
        neg = sum(1 for w in negative if w in content)

        if pos > neg:
            return 'positive'
        elif neg > pos:
            return 'negative'
        return 'neutral'

    def _recommend_channels(self, analysis: Dict, sender: str) -> Dict[str, Any]:
        """Recommend optimal channels based on analysis."""
        recommendations = []

        urgency = analysis['urgency']
        topics = analysis['topics']
        complexity = analysis['complexity']
        formality = analysis['formality']

        # Urgency-based routing
        if urgency == 'high':
            recommendations.append({'channel': 'sms', 'priority': 1, 'reason': 'High urgency - immediate notification'})
            recommendations.append({'channel': 'slack', 'priority': 2, 'reason': 'Quick team coordination'})
            recommendations.append({'channel': 'email', 'priority': 3, 'reason': 'Formal documentation'})

        # Topic-based routing
        if 'contract' in topics or 'sales' in topics:
            recommendations.append({'channel': 'email', 'priority': 1, 'reason': 'Formal documentation required'})
            if 'sales' in topics:
                recommendations.append({'channel': 'phone', 'priority': 2, 'reason': 'Relationship building'})

        if 'technical' in topics:
            recommendations.append({'channel': 'slack', 'priority': 1, 'reason': 'Quick team collaboration'})
            recommendations.append({'channel': 'email', 'priority': 2, 'reason': 'Documentation'})

        if 'support' in topics:
            recommendations.append({'channel': 'web_chat', 'priority': 1, 'reason': 'Real-time support'})
            recommendations.append({'channel': 'email', 'priority': 2, 'reason': 'Ticket tracking'})

        if 'meeting' in topics:
            recommendations.append({'channel': 'email', 'priority': 1, 'reason': 'Calendar integration'})
            recommendations.append({'channel': 'teams', 'priority': 2, 'reason': 'Meeting platform'})

        if 'networking' in topics:
            recommendations.append({'channel': 'linkedin', 'priority': 1, 'reason': 'Professional networking'})
            recommendations.append({'channel': 'email', 'priority': 2, 'reason': 'Follow-up'})

        # Complexity-based
        if complexity == 'high':
            if not any(r['channel'] == 'phone' for r in recommendations):
                recommendations.append({'channel': 'phone', 'priority': len(recommendations) + 1, 'reason': 'Complex discussion'})
            if not any(r['channel'] == 'email' for r in recommendations):
                recommendations.append({'channel': 'email', 'priority': len(recommendations) + 1, 'reason': 'Detailed documentation'})

        # Default if no specific routing
        if not recommendations:
            recommendations = [
                {'channel': 'email', 'priority': 1, 'reason': 'Standard communication'},
                {'channel': 'slack', 'priority': 2, 'reason': 'Internal awareness'}
            ]

        # Sort by priority
        recommendations.sort(key=lambda x: x['priority'])

        # Determine primary and secondary
        primary = recommendations[0]['channel'] if recommendations else 'email'
        secondary = recommendations[1]['channel'] if len(recommendations) > 1 else None

        return {
            'primary_channel': primary,
            'secondary_channels': [r['channel'] for r in recommendations[1:3]],
            'all_recommendations': recommendations,
            'sender_channel_preference': self._get_sender_preference(sender),
            'estimated_response_times': {
                r['channel']: self.channel_registry.get(r['channel'], {}).get('response_time_sla', 'N/A')
                for r in recommendations
            }
        }

    def _get_sender_preference(self, sender: str) -> str:
        """Get sender's preferred channel."""
        if sender in self.channel_preferences:
            return self.channel_preferences[sender].get('preferred', 'email')
        return 'email'

    def _generate_channel_responses(self, email: Dict, recommendation: Dict,
                                    analysis: Dict) -> List[Dict[str, Any]]:
        """Generate channel-specific response versions."""
        responses = []
        body = email.get('body', '')
        subject = email.get('subject', '')

        for rec in recommendation['all_recommendations'][:3]:
            channel = rec['channel']
            config = self.channel_registry.get(channel, {})

            response = self._adapt_message_for_channel(body, subject, channel, config, analysis)
            responses.append({
                'channel': channel,
                'channel_name': config.get('name', channel),
                'priority': rec['priority'],
                'reason': rec['reason'],
                'message': response['message'],
                'format': response['format'],
                'length': len(response['message']),
                'estimated_delivery': config.get('response_time_sla', 'N/A'),
                'requires_action': self._channel_requires_action(channel, analysis)
            })

        return responses

    def _adapt_message_for_channel(self, body: str, subject: str, channel: str,
                                     config: Dict, analysis: Dict) -> Dict[str, Any]:
        """Adapt message for specific channel."""
        max_length = config.get('max_length', 5000)
        formality = config.get('formality', 'semi_formal')

        if channel == 'sms':
            # Ultra-concise
            summary = body[:100].split('.')[0] if body else subject[:100]
            message = f"URGENT: {summary}. Check email for details. Reply YES to confirm."
            return {'message': message[:160], 'format': 'plain_text'}

        elif channel == 'slack':
            # Concise with formatting
            summary = body[:200] if body else subject
            message = f"*{subject}*\n\n{summary}\n\n_See thread for full details_"
            if analysis['urgency'] == 'high':
                message = f":rotating_light: *URGENT* {message}"
            return {'message': message[:4000], 'format': 'markdown'}

        elif channel == 'teams':
            # Professional with cards
            message = f"**{subject}**\n\n{body[:500]}\n\n---\n*Sent via multi-channel orchestrator*"
            return {'message': message[:4000], 'format': 'adaptive_card'}

        elif channel == 'phone':
            # Talking points
            key_points = re.findall(r'[.!?]([^.!?]+)', body)[:5]
            message = f"Talking points for call:\n1. {subject}\n"
            for i, point in enumerate(key_points, 2):
                message += f"{i}. {point.strip()[:100]}\n"
            return {'message': message, 'format': 'talking_points'}

        elif channel == 'linkedin':
            # Professional networking tone
            message = f"Hi, I wanted to reach out regarding {subject}. {body[:300]}"
            return {'message': message[:3000], 'format': 'professional'}

        elif channel == 'whatsapp':
            # Casual but professional
            message = f"Hi! 👋 Re: {subject}\n\n{body[:500]}"
            return {'message': message, 'format': 'casual'}

        else:  # email, web_chat
            # Full message
            message = f"Subject: {subject}\n\n{body}"
            return {'message': message[:max_length], 'format': 'formal_email'}

    def _channel_requires_action(self, channel: str, analysis: Dict) -> bool:
        """Check if channel response requires specific action."""
        if analysis['urgency'] == 'high':
            return True
        if channel == 'phone':
            return True
        return False

    def _build_unified_thread(self, email: Dict, responses: List[Dict], sender: str) -> Dict[str, Any]:
        """Build unified conversation thread across channels."""
        thread_id = f"thread_{datetime.now().strftime('%Y%m%d%H%M%S')}"

        thread = {
            'thread_id': thread_id,
            'created_at': datetime.now().isoformat(),
            'origin': {'channel': 'email', 'from': sender, 'subject': email.get('subject', '')},
            'responses': [{
                'channel': r['channel'],
                'message_preview': r['message'][:100],
                'sent_at': datetime.now().isoformat(),
                'status': 'pending'
            } for r in responses],
            'context_preserved': True,
            'cross_references': [{
                'from_channel': 'email',
                'to_channel': r['channel'],
                'reference_id': thread_id
            } for r in responses]
        }

        self.conversation_threads[thread_id] = thread
        return thread

    def _detect_cross_channel_conflicts(self, sender: str, thread: Dict) -> List[Dict[str, Any]]:
        """Detect conflicts across channels."""
        conflicts = []

        # Check if sender was recently contacted on different channel
        recent = self.response_history.get(sender, [])
        if recent:
            last_channel = recent[-1].get('channel', 'email')
            current_channels = [r['channel'] for r in thread.get('responses', [])]

            if last_channel not in current_channels and len(recent) > 3:
                conflicts.append({
                    'type': 'channel_inconsistency',
                    'severity': 'warning',
                    'message': f'Sender was last contacted via {last_channel}. Consider maintaining consistency.',
                    'last_channel': last_channel,
                    'suggested_channels': current_channels
                })

        # Check for duplicate messaging
        channels_in_thread = [r['channel'] for r in thread.get('responses', [])]
        if len(channels_in_thread) != len(set(channels_in_thread)):
            conflicts.append({
                'type': 'duplicate_channel',
                'severity': 'error',
                'message': 'Same channel appears multiple times in orchestration'
            })

        return conflicts

    def _determine_escalation_path(self, analysis: Dict, recommendation: Dict) -> Dict[str, Any]:
        """Determine escalation path if no response."""
        escalation = {
            'levels': [],
            'auto_escalate': analysis['urgency'] == 'high',
            'escalation_triggers': []
        }

        primary = recommendation['primary_channel']
        secondary = recommendation.get('secondary_channels', [])

        # Level 1: Primary channel
        escalation['levels'].append({
            'level': 1,
            'channel': primary,
            'wait_time': self._get_wait_time(primary),
            'action': 'initial_response'
        })

        # Level 2: Secondary channel
        if secondary:
            escalation['levels'].append({
                'level': 2,
                'channel': secondary[0],
                'wait_time': self._get_wait_time(secondary[0]),
                'action': 'follow_up'
            })

        # Level 3: Phone escalation
        if analysis['urgency'] == 'high' or analysis.get('requires_immediate_response'):
            escalation['levels'].append({
                'level': 3,
                'channel': 'phone',
                'wait_time': '15 minutes',
                'action': 'direct_call'
            })
            escalation['escalation_triggers'].append('no_response_within_sla')

        return escalation

    def _get_wait_time(self, channel: str) -> str:
        """Get wait time before escalation."""
        times = {
            'email': '4 hours',
            'slack': '30 minutes',
            'teams': '30 minutes',
            'sms': '15 minutes',
            'phone': 'immediate',
            'whatsapp': '1 hour',
            'linkedin': '24 hours',
            'web_chat': '5 minutes'
        }
        return times.get(channel, '1 hour')

    def _preserve_context(self, email: Dict, thread: Dict) -> Dict[str, Any]:
        """Preserve context across channels."""
        return {
            'original_subject': email.get('subject', ''),
            'original_sender': email.get('from', ''),
            'thread_id': thread.get('thread_id', ''),
            'context_keys': ['sender_identity', 'conversation_history', 'topic_context', 'priority_level'],
            'preservation_method': 'thread_linking'
        }

    def _setup_response_tracking(self, responses: List[Dict]) -> Dict[str, Any]:
        """Setup response tracking across channels."""
        return {
            'tracking_enabled': True,
            'channels_tracked': [r['channel'] for r in responses],
            'metrics': ['delivery_status', 'read_receipt', 'response_time', 'sentiment'],
            'consolidation': 'unified_dashboard'
        }


def process_multi_channel(email_data: Dict[str, Any]) -> Dict[str, Any]:
    """Main entry point for multi-channel orchestration."""
    orchestrator = MultiChannelOrchestrator()
    return orchestrator.orchestrate_response(email_data)


if __name__ == '__main__':
    test_email = {
        'from': 'vip_client@enterprise.com',
        'subject': 'URGENT: System down - need immediate help',
        'body': 'Our entire system is down and we have a critical deadline today. We need immediate assistance. This is costing us thousands per hour. Please respond ASAP.',
        'date': '2024-01-15T10:00:00',
        'attachments': []
    }
    result = process_multi_channel(test_email)
    print(json.dumps(result, indent=2))
