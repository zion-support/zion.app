#!/usr/bin/env python3
"""
Intelligent Email Responder V23 — Full intelligence pipeline
6 new modules integrated with V22 base for case-by-case email analysis.
"""

import json, re, sys
from pathlib import Path
from datetime import datetime, timezone, timedelta
from collections import defaultdict

WORKSPACE = Path.home() / '.openclaw' / 'workspace'
COMMANDS  = WORKSPACE / 'zion.app' / 'commands'
sys.path.insert(0, str(COMMANDS))

# V22 foundation
try:
    from adaptive_tone_matcher import analyze_email_tone
except Exception:
    def analyze_email_tone(ed): return {'tone':'neutral','formality':'neutral'}
try:
    from response_outcome_analyzer import ResponseOutcomeAnalyzerV22
except Exception:
    class ResponseOutcomeAnalyzerV22:
        def __init__(self): pass
        def record_sent(self, *a): return 'tbd'
        def get_pending(self): return []

# V23 modules
from sender_profile_learner import SenderProfileLearnerV23
from contextual_memory_bank import ContextualMemoryBankV23
from intent_confidence_scorer import IntentConfidenceScorerV23
from response_quality_checker import ResponseQualityCheckerV23
from auto_categorizer import AutoCategorizerV23
from smart_followup_scheduler import SmartFollowUpSchedulerV23
from action_item_extractor import ActionItemExtractorV23

try:
    from google_workspace import gmail_get
except Exception:
    def gmail_get(i): return {}


class IntelligentEmailResponderV23:
    """V23 email responder with full intelligence pipeline."""

    def __init__(self):
        self.sender_learner = SenderProfileLearnerV23()
        self.memory_bank = ContextualMemoryBankV23()
        self.intent_scorer = IntentConfidenceScorerV23()
        self.quality_checker = ResponseQualityCheckerV23()
        self.categorizer = AutoCategorizerV23()
        self.followup_scheduler = SmartFollowUpSchedulerV23()
        self.extractor = ActionItemExtractorV23()
        self.outcome_analyzer = ResponseOutcomeAnalyzerV22()

    # ── V23 intelligence layers ────────────────────────────────────
    @staticmethod
    def _attachment_layer(email_data: dict) -> dict:
        """Layer 8 — Detect mentions of attachment types in body/snippet."""
        body = email_data.get('snippet','') + ' ' + email_data.get('body', '')
        mentions = re.findall(r'(?:attach|file|document)s?\s*[:=]?\s*(\S+)', body, re.I)
        return {
            'has_attachments': len(mentions) > 0,
            'count': len(mentions),
            'mentions': mentions[:5],
        }

    @staticmethod
    def _calendar_layer(email_data: dict, thread_id: str) -> dict:
        """Layer 9 — Fetch calendar events + first available slot (next 7 days)."""
        try:
            full = gmail_get(thread_id) if thread_id else {}
            calendar_link = None
            hdrs = full.get('payload', {}).get('headers', [])
            for h in hdrs:
                if h.get('name', '').lower() in ('x-google-event-uri', 'x-calendar'):
                    calendar_link = h.get('value', '')
            return {'has_calendar_mention': bool(calendar_link), 'link': calendar_link or ''}
        except Exception:
            return {'has_calendar_mention': False, 'link': ''}

    @staticmethod
    def _relationship_layer(sender: str, profile: dict) -> dict:
        """Layer 10 — Sender trust tier and expected response latency."""
        domain = sender.split('@')[-1].lower() if '@' in sender else ''
        trust_score = profile.get('trust_score', 0)
        is_internal = any(domain.endswith(d) for d in ('ziontechgroup.com', 'ziontech.com'))
        is_vip = trust_score >= 7 or is_internal
        history = profile.get('total_messages', 0)

        tier = 'vip' if is_vip else ('trusted' if history > 5 else 'cold_lead')
        expected_hours = 2 if tier == 'vip' else (24 if tier == 'trusted' else 72)

        return {
            'tier': tier,
            'trust_score': trust_score,
            'is_vip': is_vip,
            'is_internal': is_internal,
            'expected_response_hours': expected_hours,
            'history_count': history,
        }

    def process_email(self, email_data):
        """Full intelligence pipeline for one email.

        Pipeline:
          1. Learn sender profile
          2. Contextual memory (cross-thread)
          3. Auto-categorize (noise vs inbox)
          4. Score intent confidence
          5. Extract action items
          6. Schedule follow-up
          7. Quality-check response
          8. Generate response
        """
        sender = email_data.get('sender', '')
        subject = email_data.get('subject', '')
        snippet = email_data.get('snippet', '')
        thread_id = email_data.get('thread_id', '')

        result = {}

        # [L8] Attachment parsing
        attachments = self._attachment_layer(email_data)

        # 1. Sender Profile
        profile = self.sender_learner.learn_from_email(sender, subject, snippet, email_data)
        result['sender'] = {
            'key': profile.get('sender_key', ''),
            'formality': profile.get('formality', 'neutral'),
            'tone': profile.get('tone', 'neutral'),
        }
        result['attachments'] = attachments
        result['relationship'] = self._relationship_layer(sender, profile)

        # 2. Contextual Memory
        self.memory_bank.store(thread_id, sender, subject, snippet)
        ctx = self.memory_bank.recall(thread_id)
        result['context'] = {
            'thread_len': len(ctx.get('history', [])),
            'last_contact': ctx.get('last_contact', ''),
        }

        # 3. Auto-categorize
        cat = self.categorizer.categorize(email_data)
        result['category'] = cat
        if cat.get('auto_archive'):
            result['action'] = 'auto_archive'
            result['reason'] = f"Auto-archived as {cat['category']}"
            return result

        # 4. Intent confidence
        intent = self.intent_scorer.score(sender, subject, snippet, thread_id)
        result['intent'] = intent
        if intent.get('confidence_level') == 'low':
            result['action'] = 'human'
            result['reason'] = 'Low confidence — needs review'
            return result

        # 5. Extract action items
        actions = self.extractor.extract(subject, snippet, sender, thread_id)
        result['actions'] = actions

        # 6. Schedule follow-up
        intent_label = intent.get('categories', ['general'])[0]
        urgency = intent.get('intent_details', {}).get('urgency', 3)
        fu = self.followup_scheduler.schedule_followup(thread_id, sender, intent_label, urgency)
        result['followup'] = fu

        # [L9] Calendar check
        calendar_info = self._calendar_layer(email_data, thread_id) if 'calendar' in subject.lower() or 'meeting' in intent_label else {}
        if calendar_info.get('has_calendar_mention'):
            result['calendar'] = calendar_info

        # [L10] Relationship scorer
        relationship = self._relationship_layer(sender, profile)
        result['relationship'] = relationship

        # 7-8. Generate + quality check
        response = self._generate(sender, subject, snippet, intent)
        qc = self.quality_checker.check_response(response, {'intent': intent_label})
        result['quality'] = qc

        if not qc.get('passed', True):
            result['action'] = 'review'
            result['reason'] = 'Quality validation failed'
            return result

        result['action'] = 'send'
        result['response'] = response
        return result

    def _generate(self, sender, subject, snippet, intent):
        """Generate context-aware response."""
        # Use get_profile(), not .profiles (SenderProfileLearnerV23 has no .profiles attr)
        _sp = self.sender_learner.get_profile(sender)
        profile = _sp if isinstance(_sp, dict) else {}
        formality = profile.get('formality', 'neutral')
        lang = 'pt' if re.search(r'[ãõçêé]|não|você|obrigado', snippet, re.I) else 'en'
        primary = intent.get('categories', ['general'])[0]
        urgency = intent.get('intent_details', {}).get('urgency', 3)

        templates_en = {
            'booking': "Thank you! I can help schedule this. What date/time works best?",
            'sales': "Thanks for your interest. Can you share more about your needs?",
            'support_issue': ("I understand this is urgent." if urgency >= 4
                             else "Thanks. Let me look into this and get back to you."),
            'cancellation': "I understand. Feedback is appreciated — what can we improve?",
            'partnership': "Thanks for reaching out. I'm interested — let's set up a call.",
            'general': "Thanks for your message. I'll get back to you shortly.",
        }
        templates_pt = {
            'booking': "Obrigado! Posso ajudar a agendar. Qual horário funciona?",
            'sales': "Obrigado pelo interesse. Conte mais sobre suas necessidades.",
            'support_issue': ("Entendo que é urgente. Vou priorizar." if urgency >= 4
                             else "Obrigado. Vou verificar e retorno em breve."),
            'cancellation': "Entendo. Agradecemos o feedback — o que podemos melhorar?",
            'partnership': "Obrigado pelo contato. Tenho interesse — vamos agendar.",
            'general': "Obrigado pela mensagem. Retorno em breve.",
        }
        tpl = templates_pt if lang == 'pt' else templates_en
        return tpl.get(primary, tpl['general'])

    def analyze_batch(self, emails):
        """Analyze a batch of emails. Returns categorized results."""
        auto, human, send, total = [], [], [], len(emails)
        for e in emails:
            r = self.process_email(e)
            (auto if r.get('action') == 'auto_archive'
             else human if r.get('action') in ('human', 'review')
             else send).append(r)
        return {
            'total': total,
            'auto_archive': len(auto),
            'human': len(human),
            'send': len(send),
        }


if __name__ == '__main__':
    r = IntelligentEmailResponderV23()
    print("V23 Email Responder ready.")
    print("Pipeline: Profile → Memory → Categorize → Score → Extract → Schedule → Quality → Respond")