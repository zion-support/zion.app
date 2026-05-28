#!/usr/bin/env python3
"""
Intelligent Email Responder V23 — Full intelligence pipeline
6 new modules integrated with V22 base for case-by-case email analysis.

V23a: SemanticIntentClassifierV23 added — n-gram overlap scoring against intent
archetypes.  Zero external deps; builds archetype vocab at init, scores by
token intersection + keyword density boost at import time.
"""

import json, re, sys
from pathlib import Path
from datetime import datetime, timezone
from collections import Counter

WORKSPACE = Path.home() / '.openclaw' / 'workspace'
COMMANDS  = WORKSPACE / 'zion.app' / 'commands'
sys.path.insert(0, str(COMMANDS))

# ════════════════════════════════════════════════════════
# V23a — SEMANTIC INTENT CLASSIFIER  (zero external deps)
# ════════════════════════════════════════════════════════

class SemanticIntentClassifierV23:
    """Lightweight semantic intent classifier.

    Builds archetype keyword sets for each intent label at __init__
    (i18n: PT + EN).  Scores incoming text by weighted token overlap
    plus dense-keyword bonus.  Returns joint label + confidence.

    No external ML deps — pure re + Counter.
    """

    INTENT_ARCHETYPES = {
        'booking': {
            'keywords_pt': ['reserv', 'disponibilidad', 'diária', 'quarto', 'suite',
                            'apartamento', 'hospedagem', 'check-in', 'check-out',
                            'data de entrada', 'confirmar reserva', 'vagas', 'noites'],
            'keywords_en': ['reserv', 'availab', 'booking', 'check-in', 'check-out',
                            'room', 'suite', 'apartment', 'night', 'stay', 'dates',
                            'confirm booking', 'vacanc'],
            'boost_patterns_pt': [r'para\s+\d+\s+noites', r'de\s+\w+\s+até\s+\w+'],
            'boost_patterns_en': [r'for\s+\d+\s+night', r'from\s+\w+\s+to\s+\w+'],
        },
        'sales': {
            'keywords_pt': ['proposta', 'orçamento', 'preço', 'cotação', 'plano',
                            'serviço', 'solução', 'empresar', 'contrato', 'assinatura'],
            'keywords_en': ['quote', 'pricing', 'proposal', 'service', 'solution',
                            'enterprise', 'contract', 'subscription', 'plan', 'budget'],
            'boost_patterns_pt': [r'preço\s+de', r'valor\s+de', r'para\s+a\s+empresa'],
            'boost_patterns_en': [r'price\s+for', r'cost\s+of', r'for\s+our\s+company'],
        },
        'support': {
            'keywords_pt': ['ajuda', 'suporte', 'erro', 'problema', 'não funciona',
                            'quebrou', 'defeito', 'técnico', 'configuração'],
            'keywords_en': ['help', 'support', 'error', 'issue', 'bug', 'not working',
                            'broken', 'crash', 'problem', 'how to', 'cannot', 'fix'],
            'boost_patterns_pt': [r'não está funcionando', r'preciso de ajuda'],
            'boost_patterns_en': [r'is not working', r'need help', r'cannot run'],
        },
        'urgent': {
            'keywords_pt': ['urgent', 'urgente', 'imediat', 'agora mesmo', 'emergência'],
            'keywords_en': ['urgent', 'asap', 'immediately', 'emergency', 'critical',
                            'right now', 'down', 'outage'],
            'boost_patterns_pt': [r'preciso urgente', r'responda agora'],
            'boost_patterns_en': [r'need urgent', r'respond now'],
        },
        'cancellation': {
            'keywords_pt': ['cancelar', 'cancelamento', 'reembolso', 'desmarc', 'reagendar'],
            'keywords_en': ['cancel', 'refund', 'reschedule', 'cancellation', 'reimburs'],
            'boost_patterns_pt': [r'quero cancelar', r'gostaria de reembolso'],
            'boost_patterns_en': [r'want to cancel', r'requesting a refund'],
        },
        'partnership': {
            'keywords_pt': ['parceria', 'colaboração', 'aliança', 'joint venture', 'coopera'],
            'keywords_en': ['partnership', 'partner', 'collaboration', 'alliance',
                            'joint venture', 'co-market'],
            'boost_patterns_pt': [r'proposta de parceria', r'juntos'],
            'boost_patterns_en': [r'partnership proposal', r'join forces'],
        },
    }

    def __init__(self, scoring_log_path=None):
        self.cache = {}
        self.log_path = (Path(scoring_log_path)
                         if scoring_log_path
                         else WORKSPACE / 'zion.app' / 'data' / 'semantic_intent_log.json')

        # Pre-compute archetype term sets and compiled regexes at init time.
        self._archetype_terms = {}
        self._archetype_regex = {}
        for label, arch in self.INTENT_ARCHETYPES.items():
            terms = set()
            for kw_list in [arch['keywords_pt'], arch['keywords_en']]:
                terms.update(kw.lower() for kw in kw_list)
            self._archetype_terms[label] = terms
            compiled = []
            for p in arch.get('boost_patterns_pt', []) + arch.get('boost_patterns_en', []):
                compiled.append(re.compile(p, re.I))
            self._archetype_regex[label] = compiled

    # ── helpers ────────────────────────────────────────

    @staticmethod
    def _tokenize(text):
        """Lowercase alphanum tokens; split on non-word chars."""
        return set(re.findall(r'[a-z0-9]+', text.lower()))

    @staticmethod
    def _token_overlap(tokens, archetype):
        """Jaccard-like: what fraction of the archetype vocab did we hit?"""
        if not archetype:
            return 0.0
        return len(tokens & archetype) / len(archetype)

    @staticmethod
    def _boost(text, regexes):
        """Each matching boost pattern adds +1.2 weight."""
        return sum(1.2 for rx in regexes if rx.search(text))

    # ── main entry ────────────────────────────────────

    def classify(self, text):
        """Score *text* against all archetypes; return best label + scores dict.

        Returns
        -------
        dict with keys:
          label, score, full_scores, needs_fallback,
          archetype_match_ratio, details
        """
        tokens = self._tokenize(text)
        scores = {}
        details = {}

        for label, terms in self._archetype_terms.items():
            overlap = self._token_overlap(tokens, terms)
            boost   = self._boost(text, self._archetype_regex[label])
            score   = overlap * 3.0 + boost
            scores[label] = round(score, 4)
            details[label] = {
                'overlap':       round(overlap, 3),
                'boost':         round(boost, 2),
                'matched_terms': sorted(tokens & terms),
            }

        if not scores or max(scores.values()) == 0:
            return {
                'label': 'general', 'score': 0.0, 'full_scores': scores,
                'needs_fallback': True, 'archetype_match_ratio': 0.0, 'details': details,
            }

        best_label = max(scores, key=scores.get)
        best_score = scores[best_label]
        second     = sorted(scores.values(), reverse=True)[1] if len(scores) > 1 else 0.0

        gap  = max(best_score - second, 0)
        raw  = min(1.0, best_score / 3.0)
        conf = min(0.98, raw + gap * 0.12)

        match_ratio = len(details[best_label]['matched_terms']) / max(len(self._archetype_terms[best_label]), 1)

        return {
            'label':               best_label,
            'score':               round(conf, 3),
            'full_scores':         {k: round(v, 3) for k, v in sorted(scores.items(), key=lambda x: -x[1])},
            'needs_fallback':      conf < 0.55,
            'archetype_match_ratio': round(match_ratio, 3),
            'details':             details,
        }

    def merged_intent(self, text, keyword_intent):
        """Fuse semantic classifier + existing keyword scorer.

        Priority-intent override:
          urgent, cancellation — override any semantic label when keyword-confidence ≥ 0.75,
          because those categories carry workflow urgency that must not be diluted.

        Otherwise:
          - Both agree + both ≥ 0.6  → confidence bump, method='semantic+keyword'
          - Both agree + at least one lower → average + small bump
          - Disagree                  → keep higher-scoring label, lower confidence
        Returns dict merged into the V23 intent envelope.
        """
        sem    = self.classify(text)
        kw_lbl = keyword_intent.get('categories', ['general'])[0]
        kw_conf = keyword_intent.get('confidence', 0.5)

        PRIORITY = {'urgent', 'cancellation'}
        agreement = sem['label'] == kw_lbl

        # ── Priority-intent override ─────────────────────────────────
        if kw_lbl in PRIORITY and kw_conf >= 0.75:
            return {
                'categories':         [kw_lbl],
                'confidence':         round(min(0.97, kw_conf + 0.05), 3),
                'confidence_level':   self._level(kw_conf + 0.05),
                'method':             'keyword_override',
                'agreement':          agreement,
                'semantic':           sem,
                'semantic_modifier':  sem['label'] if sem['label'] != kw_lbl else None,
                'intent_details':     keyword_intent.get('intent_details', {}),
                'suggested_action':   keyword_intent.get('suggested_action', 'draft_and_review'),
            }
        # ── Non-priority fusion ─────────────────────────────────────

        if agreement and sem['score'] >= 0.6 and kw_conf >= 0.6:
            final_conf = min(0.97, max(sem['score'], kw_conf) + 0.10)
            method = 'semantic+keyword'
        elif agreement:
            final_conf = (sem['score'] + kw_conf) / 2 + 0.05
            method = 'semantic+keyword'
        else:
            final_conf = min(sem['score'], kw_conf)
            method = 'keyword' if kw_conf >= sem['score'] else 'semantic'

        merged_label = sem['label'] if sem['score'] >= kw_conf else kw_lbl
        urgency = keyword_intent.get('intent_details', {}).get('urgency', 3)

        return {
            'categories':           [merged_label],
            'confidence':           round(final_conf, 3),
            'confidence_level':     self._level(final_conf),
            'method':               method,
            'agreement':            agreement,
            'semantic':             sem,
            'intent_details':       keyword_intent.get('intent_details', {}),
            'suggested_action':     keyword_intent.get('suggested_action', 'draft_and_review'),
        }

    @staticmethod
    def _level(conf):
        if conf >= 0.85: return 'very_high'
        if conf >= 0.70: return 'high'
        if conf >= 0.60: return 'medium'
        if conf >= 0.50: return 'low'
        return 'very_low'


# V22 foundational helper
try:
    from response_outcome_analyzer import ResponseOutcomeAnalyzerV22
except Exception:
    class ResponseOutcomeAnalyzerV22:
        def __init__(self): pass
        def record_sent(self, *a): return 'tbd'
        def get_pending(self): return []

# V23 MODULES (external files)
# ════════════════════════════════════════════════════════

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


# ════════════════════════════════════════════════════════
# V23 — CONFIDENCE SCORER + THREAD SUMMARIZER (guarded)
# ════════════════════════════════════════════════════════
try:
    from intent_confidence_scorer import IntentConfidenceScorer
    from thread_summarizer            import ThreadSummarizer
except Exception:
    class IntentConfidenceScorer:
        def score(self, _): return 0.5
    class ThreadSummarizer:
        def summarize(self, _): return ""


class IntelligentEmailResponderV23:
    """V23 email responder with full intelligence pipeline.

    Pipeline (8 steps):
      1  Sender profile learning
      2  Contextual memory (cross-thread)
      3  Auto-categorize (noise vs inbox)
      3a Semantic intent classification  ← NEW in V23a
      4  Keyword-based intent confidence
      5  Action-item extraction
      6  Follow-up scheduling
      7  Response quality check
      8  Generative response (tone + formality-aware)
    """

    def __init__(self):
        self.sender_learner   = SenderProfileLearnerV23()
        self.memory_bank      = ContextualMemoryBankV23()
        self.intent_scorer    = IntentConfidenceScorerV23()
        self.quality_checker  = ResponseQualityCheckerV23()
        self.categorizer      = AutoCategorizerV23()
        self.followup_scheduler = SmartFollowUpSchedulerV23()
        self.extractor        = ActionItemExtractorV23()
        self.semantic_intent  = SemanticIntentClassifierV23()   # V23a
        self.outcome_analyzer = ResponseOutcomeAnalyzerV22()  # outcome tracking
        # V23 — confidence + thread summarizer
        self.scorer      = IntentConfidenceScorer()
        self.summarizer  = ThreadSummarizer()

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
        """Full intelligence pipeline for one email."""
        sender    = email_data.get('sender', '')
        subject   = email_data.get('subject', '')
        snippet   = email_data.get('snippet', '')
        thread_id = email_data.get('thread_id', '')

        # V47 — direction + reply-size + CC override from email_data
        direction   = email_data.get('direction', '')
        reply_size  = len(email_data.get('snippet', ''))
        cc_raw      = email_data.get('cc', '')
        cc_override = bool(cc_raw and any(k in cc_raw.lower() for k in ['noreply', 'newsletter', 'announce']))
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

        # 4a. Semantic intent classification (V23a, zero-dep)
        combined_text = f"{subject} {snippet}"
        sem_label = self.semantic_intent.classify(combined_text)
        result['semantic_intent'] = {
            'label': sem_label['label'],
            'score': sem_label['score'],
            'archetype_match_ratio': sem_label['archetype_match_ratio'],
            'needs_fallback': sem_label['needs_fallback'],
        }

        # 4b. Keyword-based intent confidence  → merge with semantic result
        kw_intent = self.intent_scorer.score(sender, subject, snippet, thread_id)
        merged = self.semantic_intent.merged_intent(combined_text, kw_intent)
        # V23 — confidence scoring + thread summarizer
        merged['intent_confidence'] = self.scorer.score(email_data)
        merged['thread_summary']   = self.summarizer.summarize(thread_id)
        result['intent'] = merged
        if merged.get('confidence_level') in ('very_low', 'low'):
            result['action'] = 'human'
            result['reason'] = 'Low merged confidence — needs human review'
            return result

        # 5. Extract action items
        actions = self.extractor.extract(subject, snippet, sender, thread_id)
        result['actions'] = actions

        # 6. Schedule follow-up
        intent_label = merged.get('categories', ['general'])[0]
        urgency      = merged.get('intent_details', {}).get('urgency', 3)
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
        response = self._generate(sender, subject, snippet, merged)
        qc = self.quality_checker.check_response(response, merged)
        result['quality'] = qc

        if not qc.get('passed', True):
            result['action'] = 'review'
            result['reason'] = 'Quality validation failed'
            return result

        result['action'] = 'send'
        result['response'] = response
        return result

    def _generate(self, sender, subject, snippet, intent):
        """Generate context-aware response using sender profile if available."""
        profile = self.sender_learner.get_profile(sender) or {}
        formality = profile.get('formality', 'neutral')
        lang = 'pt' if re.search(r'[ãõçêé]|não|você|obrigado', snippet, re.I) else 'en'
        primary = intent.get('categories', ['general'])[0]
        urgency = intent.get('intent_details', {}).get('urgency', 3)

        templates_en = {
            'booking': "Thank you! I can help schedule this. What date/time works best?",
            'sales': "Thanks for your interest. Can you share more about your needs?",
            'support_issue': ("I understand this is urgent." if urgency >= 4
                             else "Thanks. Let me look into this and get back to you."),
            'cancellation': "I understand. What can we do better?",
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
    print("Pipeline: Profile → Memory → Categorize → Semantic→Keyword→Extract → Schedule → Quality → Respond")
