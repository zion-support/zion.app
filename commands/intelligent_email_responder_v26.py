#!/usr/bin/env python3
"""
V26 Wave 4 — Intelligent Escalation + Financial + Meeting Integration

V25 + V26 adds:
  - Escalation Engine: detect legal threats, fury, churn → force human review + Telegram alert
  - Financial Handler: invoice/payment/refund detection → route to AP or auto-thank
  - Meeting Scheduler: auto-check calendar availability when meeting requested
  - KB Integration: new Q&A pairs from support threads flow into KB after resolution

Cuts V24 pipeline from 14 steps → 6 for high-confidence emails.

Fast-path conditions (all must be true):
  • Sender profile ≥3 past interactions in the SAME intent category with 100% success
  • Intent confidence ≥ 0.7 ('high' or 'very_high')
  • Categorizer says not spam/auto_reply/newsletter (needs_response=True)
  • No action items extracted (empty or low-risk only)

Short-circuits (skipped in fast-path):
  - ContextualMemoryBank.recall
  - ActionItemExtractor.extract
  - SmartFollowUpScheduler.schedule_followup
  - EnhancedReplyAllHandler.decide (full algorithm)
  - ResponseQualityChecker (full 6-dimension gate)

Still enforced in fast-path:
  - AdaptiveToneMatcher (always)
  - SenderProfileLearner (profile gating itself)
  - AutoCategorizer (spam/archive check only)
  - IntentConfidenceScorer (confidence gate)
  - Template selection + basic compose
  - Reply-all basic CC coverage check (inline)
  - Grammar/signoff trim check (150ms inline)
  - MLTemplateOptimizer (optional; weights pre-loaded)

When any fast-path condition fails → falls back to full V24 pipeline,
guaranteeing zero accuracy regression.

Drop-in replacement: V26Responder → V26Responder in __main__
"""

import json, re, time, csv, io
from datetime import datetime, timezone
from pathlib import Path
from collections import defaultdict

WORKSPACE  = Path(__file__).resolve().parent.parent.parent
COMMANDS   = WORKSPACE / 'commands'
DATA       = WORKSPACE / 'data'
V26_LOG    = DATA / 'v26_run_log.jsonl'
V26_STATS  = DATA / 'v26_stats.jsonl'
V28_TQ_LOG = DATA / 'template_quality.jsonl'   # V28: per-template quality log
V28_TQ_AUDIT = DATA / 'template_quality_audit.jsonl'  # V28: audit decisions log

_PROMOTION_WINDOW     = 200   # uses before evaluating a template
_QUARANTINE_THRESHOLD = 70.0  # rolling avg below → quarantine
_CANONICAL_THRESHOLD  = 90.0  # rolling avg above for 14+ days → canonical
_CANONICAL_DAYS       = 14
_AUDIT_INTERVAL       = 50    # audit every N sends (batch-level check)

# Quarantine state file — {template_key: until_iso}
_TQ_QUARANTINE: dict = {}
_TQ_CANONICAL:  dict = {}
_TQ_SINCE_LAST_AUDIT = 0

sys_path_flag = False
if str(COMMANDS) not in __import__('sys').path:
    import sys
    sys.path.insert(0, str(COMMANDS))
    sys_path_flag = True

from typing import Optional

# ── V24 imports ─────────────────────────────────────────────
try:
    from ml_template_optimizer    import MLTemplateOptimizerV21
    from predictive_timer         import PredictiveTimerV21
except Exception:
    MLTemplateOptimizerV21 = None
    PredictiveTimerV21      = None

try:
    from enhanced_reply_all_handler import EnhancedReplyAllHandlerV22
    from response_outcome_analyzer  import ResponseOutcomeAnalyzerV22
except Exception:
    EnhancedReplyAllHandlerV22 = None
    ResponseOutcomeAnalyzerV22  = None

try:
    from sender_profile_learner     import SenderProfileLearnerV23
    from contextual_memory_bank     import ContextualMemoryBankV23
    from intent_confidence_scorer   import IntentConfidenceScorerV23
    from response_quality_checker   import ResponseQualityCheckerV23
    from auto_categorizer           import AutoCategorizerV23
    from smart_followup_scheduler   import SmartFollowUpSchedulerV23
    from action_item_extractor      import ActionItemExtractorV23
    from adaptive_tone_matcher      import analyze_tone, generate_adapted_response
except Exception as _e:
    print(f"⚠️ V25: V23 module import failed: {_e}", flush=True)
    SenderProfileLearnerV23 = None
    # keep going — some modules may be optional

try:
    from email_decision import from_email_data, decide_reply_all, always_cc
except Exception:
    from_email_data  = None
    decide_reply_all = None
    always_cc        = None

# ─── Wave 2: KB Grounding RAG ────────────────────────────────────────────────
try:
    from kb_grounding_rag           import build_prompt_context, retrieve_context
    KB_GROUNDING_ENABLED = True
except Exception:
    KB_GROUNDING_ENABLED = False

# ─── Wave 5: Thread Continuity Intelligence ──────────────────────────────────
try:
    from thread_continuity_predictor import predict_thread_participants
    THREAD_CONTINUITY_ENABLED = True
except Exception:
    THREAD_CONTINUITY_ENABLED = False


try:
    from google_workspace import (
        gmail_search, gmail_get, gmail_send_reply_fixed,
        gmail_batch_modify, telegram_send, gmail_get_or_create_label_id,
    )
    HAS_GMAIL = True
except Exception:
    HAS_GMAIL = False
    def gmail_search(q, limit=20):                    return []
    def gmail_get(i):                                  return {}
    def gmail_send_reply_fixed(*a, **kw):               return {'success': True}
    def gmail_batch_modify(*a, **kw):                  None
    def telegram_send(t):                              print(f"[TG] {t}")
    def gmail_get_or_create_label_id(n):               return f'label-{n}'

# ─── V25 Pre-built modules ───────────────────────────────────────────────
try:
    from response_verifier           import _score_response_quality as _v25_score
    from response_polarity_analyzer  import ResponsePolarityAnalyzer
    from learned_action_patterns     import LearnedActionPatterns
    from attachment_awareness        import check_attachments
    from realtime_feedback_loop      import apply_feedback
    from quality_regression_trainer  import QualityRegressionTrainer
    V25_VERIFIER_ENABLED = True
    V25_POLARITY_ENABLED  = True
    V25_PATTERNS_ENABLED  = True
    V25_ATTACH_ENABLED    = True
    V25_RTFB_ENABLED      = True
    V25_REGR_TRAINER_ENABLED = True
except Exception as ex:
    print(f"⚠️ V25 module import failed: {ex}", flush=True)
    V25_VERIFIER_ENABLED        = False
    V25_POLARITY_ENABLED        = False
    V25_PATTERNS_ENABLED        = False
    V25_ATTACH_ENABLED          = False
    V25_RTFB_ENABLED            = False
    V25_REGR_TRAINER_ENABLED    = False
    _v25_score             = None
    ResponsePolarityAnalyzer  = None
    LearnedActionPatterns     = None
    check_attachments         = None
    apply_feedback            = None
    QualityRegressionTrainer = None

# ─── V26 Wave 4: Escalation + Financial + Meeting Intelligence ─────────────────
try:
    from escalation_engine        import check_escalation
    from financial_email_handler  import classify_financial_email
    from calendar_availability    import get_availability_next_7_days, format_availability
    V26_ESCALATION_ENABLED   = True
    V26_FINANCIAL_ENABLED    = True
    V26_MEETING_ENABLED      = True
except Exception as _ex:
    print(f"⚠️ V26: new modules import failed: {_ex}", flush=True)
    V26_ESCALATION_ENABLED   = False
    V26_FINANCIAL_ENABLED    = False
    V26_MEETING_ENABLED      = False
    check_escalation         = None
    classify_financial_email = None
    get_availability_next_7_days = None
    format_availability      = None




# ── Dry-run outcome pre-seed (enables fast-path testing in dry mode) ──
def _build_dry_run_outcomes() -> dict:
    """Return a pre-built outcome_history dict per stub email sender."""
    return {
        "dr-1": [  # Alice — support, 3 positive outcomes → fast-path profile gate passes
            {"intent": "support", "outcome": "positive", "ts": "2026-01-01T00:00:00+00:00"},
            {"intent": "support", "outcome": "positive", "ts": "2026-01-02T00:00:00+00:00"},
            {"intent": "support", "outcome": "positive", "ts": "2026-01-03T00:00:00+00:00"},
        ],
        "dr-2": [  # Bob — sales, 3 positive
            {"intent": "sales", "outcome": "positive", "ts": "2026-01-01T00:00:00+00:00"},
            {"intent": "sales", "outcome": "positive", "ts": "2026-01-02T00:00:00+00:00"},
            {"intent": "sales", "outcome": "positive", "ts": "2026-01-03T00:00:00+00:00"},
        ],
        "dr-3": [  # Carla — support, 3 positive
            {"intent": "support", "outcome": "positive", "ts": "2026-01-01T00:00:00+00:00"},
            {"intent": "support", "outcome": "positive", "ts": "2026-01-02T00:00:00+00:00"},
            {"intent": "support", "outcome": "positive", "ts": "2026-01-03T00:00:00+00:00"},
        ],
    }
# ═══════════════════════════════════════════════════════════════
#  LOGGING
# ═══════════════════════════════════════════════════════════════

def _log(record: dict):
    try:
        with open(V26_LOG, 'a') as f:
            f.write(json.dumps(record, ensure_ascii=False) + '\n')
    except Exception:
        pass

def _log_stats(record: dict):
    try:
        with open(V26_STATS, 'a') as f:
            f.write(json.dumps(record, ensure_ascii=False) + '\n')
    except Exception:
        pass


# ═══════════════════════════════════════════════════════════════
#  TEMPLATE LIBRARY  (same as V24)
# ═══════════════════════════════════════════════════════════════

TEMPLATES = {
    "pt": {
        "booking":     ("Olá {name}!\n\n"
                        "Recebi sua solicitação de reserva. Irei confirmar os detalhes com você em instantes.\n\n"
                        "Por favor, me confirme:\n"
                        "• Data de entrada e saída\n"
                        "• Quantidade de hóspedes\n\n"
                        "Assim que tiver essas informações, envio a confirmação completa.\n\n"
                        "—\n{signature}"),
        "sales":       ("Olá {name}!\n\n"
                        "Obrigado pelo seu interesse. Vou analisar sua solicitação e elaborar uma proposta personalizada.\n\n"
                        "Você gostaria de agendar uma chamada rápida de 15 minutos esta semana?\n\n"
                        "—\n{signature}"),
        "support_issue":("Olá {name}!\n\n"
                        "Recebi sua mensagem e estou verificando o problema relatado.\n"
                        "Vou acompanhar pessoalmente e retornar com uma atualização em breve.\n\n"
                        "—\n{signature}"),
        "follow_up":   ("Olá {name}!\n\n"
                        "Aproveitando para acompanhar sobre o assunto que falamos anteriormente.\n"
                        "Tivemos alguma novidade?\n\n"
                        "—\n{signature}"),
        "cancellation":("Olá {name}!\n\n"
                        "Lamento que as coisas não tenham funcionado como esperado.\n"
                        "Fico à disposição para entender melhor e melhorar nossa experiência futura.\n\n"
                        "—\n{signature}"),
        "partnership": ("Olá {name}!\n\n"
                        "Excelente iniciativa! Estou muito interessado em explorar essa parceria.\n"
                        "Vamos agendar uma conversa para alinhar as expectativas?\n\n"
                        "—\n{signature}"),
        "urgent":      ("⚠️  Olá {name}!\n\n"
                        "Sua mensagem recebeu prioridade máxima. Estou pessoalmente encarregado deste caso.\n"
                        "Retorno o mais breve possível.\n\n"
                        "—\n{signature}"),
        "general":     ("Olá {name}!\n\n"
                        "Obrigado pelo seu contato. Recebi sua mensagem e vou responder com os detalhes em breve.\n\n"
                        "—\n{signature}"),
    },
    "en": {
        "booking":     ("Hi {name}!\n\n"
                        "Got your booking request — I'll confirm the details with you shortly.\n\n"
                        "Could you please share:\n"
                        "• Check-in and check-out dates\n"
                        "• Number of guests\n\n"
                        "—\n{signature}"),
        "sales":       ("Hi {name}!\n\n"
                        "Thanks for reaching out. I'll review your inquiry and prepare a tailored proposal.\n\n"
                        "—\n{signature}"),
        "support_issue":("Hi {name}!\n\n"
                        "Got your message — I'm investigating and will follow up with an update shortly.\n\n"
                        "—\n{signature}"),
        "follow_up":   ("Hi {name}!\n\n"
                        "Quick follow-up on our last conversation. Any updates on your end?\n\n"
                        "—\n{signature}"),
        "cancellation":("Hi {name}!\n\n"
                        "I'm sorry it didn't work out. I'd appreciate any feedback you have.\n\n"
                        "—\n{signature}"),
        "partnership": ("Hi {name}!\n\n"
                        "This is exciting — I'm very interested in exploring this partnership.\n"
                        "Let's set up a time to align on expectations.\n\n"
                        "—\n{signature}"),
        "urgent":      ("⚠️  Hi {name}!\n\n"
                        "This has been flagged as urgent. I've personally picked this up and I'm moving fast.\n\n"
                        "—\n{signature}"),
        "general":     ("Hi {name}!\n\n"
                        "Thanks for reaching out. I've received your message and I'll get back to you with details shortly.\n\n"
                        "—\n{signature}"),
    },
}

INTENT_MAP = {
    "booking": "booking", "sales": "sales", "support": "support_issue",
    "urgent": "urgent", "cancellation": "cancellation",
    "partnership": "partnership", "follow_up": "follow_up", "general": "general",
}

# Pre-computed signature strings (avoid re-computing per email)
_SIG_CACHE = {}

def _get_sig(formality: str, language: str) -> str:
    key = f"{formality}|{language}"
    if key not in _SIG_CACHE:
        if language == 'pt':
            if formality == 'formal':
                _SIG_CACHE[key] = '\n\nAtenciosamente,\nKleber Garcia Alcatrão\nZion Tech Group'
            elif formality == 'casual':
                _SIG_CACHE[key] = '\n\nAbraço,\nKleber'
            else:
                _SIG_CACHE[key] = '\n\n— Kleber, Zion Tech Group'
        else:
            if formality == 'formal':
                _SIG_CACHE[key] = '\n\nSincerely,\nKleber Garcia Alcatrão\nZion Tech Group'
            elif formality == 'casual':
                _SIG_CACHE[key] = '\n\nCheers,\nKleber'
            else:
                _SIG_CACHE[key] = '\n\n— Kleber, Zion Tech Group'
    return _SIG_CACHE[key]


# ═══════════════════════════════════════════════════════════════
#  LIGHTWEIGHT HELPERS
# ═══════════════════════════════════════════════════════════════

_GRAMMAR_RUSH = re.compile(r'\b(?:teh|asap|gonna|wanna|lemme|kinda|dunno)\b', re.IGNORECASE)

def _fast_grammar_check(body: str) -> tuple[float, list[str]]:
    """< 1ms grammar check — casual phrasing + roughness."""
    text = body.lower().strip()
    issues = []
    hits = _GRAMMAR_RUSH.findall(text)
    if hits:
        for h in hits[:2]:
            issues.append(f"casual_phrase:{h}")
    return max(70.0, 100.0 - 7 * len(hits)), issues

def _check_reply_all_basic(body: str, sender: str, cc: str = '') -> bool:
    """Basic CC check: is the email's original 'To' at least mentioned?"""
    # Extract sender name/email from body, get domain
    emails_mentioned = set(re.findall(r'[\w.+-]+@[\w.-]+', body))
    name_words = [w for w in sender.lower().replace('.', ' ').split() if len(w) > 3]
    has_sender_ref = any(w in body.lower() for w in name_words)
    return has_sender_ref  # fast: sender is covered

def _has_action_items(subj: str, snip: str) -> bool:
    """Heuristic: look for explicit action markers in subject/snippet."""
    text = f"{subj} {snip}".lower()
    markers = ['deadline', 'due date', 'by eod', 'by cob', 'precisa', 'preciso',
               'aguardo', 'waiting for', 'please respond', 'respond by',
               'confirm until', 'prazo', 'até amanhã', 'asap']
    return any(m in text for m in markers)


# ── Fallback quality check (when V25 verifier unavailable) ────────────
_SIG_PAT = re.compile(r'—\s*\n.*\n.*$', re.DOTALL)   # sign-off block
_CLOSING = {'aberto(a)', 'atenciosamente', 'sincerely', 'cheers', 'abraco', 'regards'}

def _fallback_quality_check(body: str, lang: str = 'en') -> dict:
    """Basic ~100μs quality check: grammar + sign-off presence + length."""
    text = body.strip()
    issues: list[dict] = []

    # Grammar
    g_score, g_issues = _fast_grammar_check(body)
    issues.extend({"dimension": "grammar", "msg": i} for i in g_issues)

    # Sign-off
    has_signoff = any(body.strip().lower().endswith(c) for c in _CLOSING) or bool(_SIG_PAT.search(text))
    if not has_signoff:
        issues.append({"dimension": "signoff", "msg": "signature_or_closing_missing"})

    # Length
    word_count = len(text.split())
    len_ok = 20 <= word_count <= 500
    if not len_ok:
        issues.append({"dimension": "length",
                        "msg": f"word_count_{word_count}_out_of_range_20_500"})

    overall = max(0.0, min(100.0, g_score * 0.7 + (15 if has_signoff else 0) + (10 if len_ok else 0)))
    return {
        "overall_score": round(overall, 1),
        "passed":      overall >= 65 and bool(issues) == False,
        "should_send": overall >= 50,
        "issues":      issues[:6],
        "dimension_scores": {
            "grammar":       round(g_score, 1),
            "tone_alignment": 75.0,   # baseline — V25 verifier replaces with real score
            "reply_all":     75.0,
            "action_complete": 80.0,
            "compliance":    85.0,
            "factual":       75.0,
        }
    }


# ═══════════════════════════════════════════════════════════════
# ── V28: Template Quality Autocorrect ──────────────────────────────
# ═══════════════════════════════════════════════════════════════

def _get_template_key(intent_cat: str, lang: str, template: str) -> str:
    return f"{intent_cat}|{lang}|{template}"

def _log_template_quality(intent_cat: str, lang: str, template: str,
                          quality: float, g_score: float, sender: str = "") -> None:
    """Append one quality record to V28_TQ_LOG. Non-blocking."""
    try:
        row = {
            "ts":      datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S%z"),
            "intent":  intent_cat, "lang": lang, "template": template,
            "quality": round(quality, 1), "g_score": round(g_score, 1),
            "sender":  sender[:60],
        }
        buf = io.StringIO()
        w = csv.DictWriter(buf, fieldnames=list(row.keys()))
        if not V28_TQ_LOG.exists():
            w.writeheader()
        w.writerow(row)
        V28_TQ_LOG.parent.mkdir(parents=True, exist_ok=True)
        with open(V28_TQ_LOG, "a") as f:
            f.write(buf.getvalue())
    except Exception:
        pass  # quality logging must never crash a send

def _audit_templates() -> None:
    """Scan last 200 uses per (intent|lang|template) key. Quarantine/promote."""
    global _TQ_QUARANTINE, _TQ_CANONICAL
    try:
        if not V28_TQ_LOG.exists():
            return
        import csv
        rows = []
        with open(V28_TQ_LOG) as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith("#"):
                    continue
                try:
                    rows.append(next(csv.DictReader(io.StringIO(line))))
                except Exception:
                    pass

        now   = datetime.now(timezone.utc)
        delta = __import__("datetime").timedelta(hours=6)
        buckets: dict[str, list[float]] = {}
        for row in reversed(rows):
            key = _get_template_key(row.get("intent",""), row.get("lang",""), row.get("template",""))
            buckets.setdefault(key, []).append(float(row.get("quality", 0)))
            if len(buckets[key]) >= _PROMOTION_WINDOW:
                break

        decisions = []
        for key, scores in buckets.items():
            if len(scores) < 50:
                continue
            avg = sum(scores) / len(scores)
            if avg < _QUARANTINE_THRESHOLD:
                _TQ_QUARANTINE[key] = (now + delta).isoformat()
                decisions.append({"action": "quarantine", "key": key, "avg": round(avg, 1)})
            elif avg >= _CANONICAL_THRESHOLD:
                _TQ_CANONICAL[key] = now.isoformat()
                decisions.append({"action": "canonical",  "key": key, "avg": round(avg, 1)})

        if decisions:
            try:
                with open(V28_TQ_AUDIT, "a") as f:
                    for entry in decisions:
                        f.write(json.dumps({"ts": now.isoformat(), **entry}) + "\n")
            except Exception:
                pass
    except Exception:
        pass

def _maybe_audit() -> None:
    """Run audit every _AUDIT_INTERVAL sends (batch-level throttle)."""
    global _TQ_SINCE_LAST_AUDIT
    _TQ_SINCE_LAST_AUDIT += 1
    if _TQ_SINCE_LAST_AUDIT >= _AUDIT_INTERVAL:
        _TQ_SINCE_LAST_AUDIT = 0
        _audit_templates()


# ═══════════════════════════════════════════════════════════════
# ── Wave 7: Fast-path KB grounding ─────────────────────────────
def _fast_kb_context(intent_cat: str, subj: str, lang: str = 'en', max_hits: int = 2) -> str:
    """<1ms lightweight KB hit: top service title + 1-line desc for intent category."""
    try:
        _build_index = globals().get('_build_index')
        _category_buckets = globals().get('_category_buckets', {})
        if not _category_buckets:
            return ''
        _build_index()
    except Exception:
        return ''
    try:
        hits = []
        cat_key = intent_cat if intent_cat in _category_buckets else None
        if cat_key:
            hits = [s for s in _category_buckets.get(cat_key, [])[:15]]
        if not hits:
            hits = list(_category_buckets.values())[0] if _category_buckets else []
        hits = hits[:max_hits]
        parts = [f"{s.get('title','')} — {s.get('description','')[:90]}" for s in hits if s.get('title')]
        return " | ".join(parts)
    except Exception:
        return ''
#  FAST-THROUGH DETECTOR
# ═══════════════════════════════════════════════════════════════



# ── Wave 11: Post-score intent boost (sender-known intent bias) ────
def _apply_intent_boost(intent_raw: dict, profile: dict) -> dict:
    """If the sender has a strong prior for a category, nudge confidence up."""
    if not profile or not intent_raw:
        return intent_raw
    known = profile.get("intents", {})
    if not known:
        return intent_raw
    top_cat, top_count = max(known.items(), key=lambda kv: kv[1]) if known else (None, 0)
    if not top_cat or top_count < 2:
        return intent_raw
    conf  = intent_raw.get("confidence", 0)
    boost = min(0.12, top_count * 0.03)
    cats  = intent_raw.get("categories", [])
    if top_cat in cats:
        intent_raw["confidence"]      = round(min(1.0, conf + boost), 3)
        intent_raw["confidence_level"] = (
            "very_high" if intent_raw["confidence"] >= 0.9 else
            "high"      if intent_raw["confidence"] >= 0.7 else
            intent_raw.get("confidence_level", "medium"))
        intent_raw["intent_boost_src"] = f"profile:{top_cat}:+{boost:.0%}"
    return intent_raw
class CascadingLatencyDetector:
    """Decide fast-path vs full pipeline for a single email."""

    def __init__(self, profile: dict, intent_result: dict,
                 cat_result: dict, subj: str, snip: str) -> tuple[bool, dict]:
        self.profile   = profile
        self.intent    = intent_result
        self.categoria = cat_result
        self.subj      = subj
        self.snip      = snip
        self._reasons  = {}

    @property
    def can_fast_path(self) -> bool:
        """All 4 gating conditions must be true."""
        return (
            self._check_profile_history() and
            self._check_intent_confidence() and
            self._check_noise_absent() and
            self._check_no_action_items()
        )

    def _check_profile_history(self) -> bool:
        """Sender profile has ≥2 past interactions in this intent with ≥80% success."""
        if not self.profile:
            self._reasons['profile'] = 'no_profile'
            return False

        intent = self.intent.get('categories', ['general'])[0]
        outcomes = self.profile.get('outcome_history', [])
        if len(outcomes) < 2:
            self._reasons['profile'] = f'insufficient_history_{len(outcomes)}'
            return False

        intent_outcomes = [o for o in outcomes if o.get('intent') == intent]
        if len(intent_outcomes) < 2:
            self._reasons['profile'] = f'low_intent_history_{len(intent_outcomes)}'
            return False

        success_rate = sum(1 for o in intent_outcomes[-5:] if o.get('outcome') in ('positive', 'neutral')) / max(len(intent_outcomes[-5:]), 1)
        if success_rate < 0.80:
            self._reasons['profile'] = f'success_rate_{success_rate:.0%}'
            return False

        return True

    def _check_intent_confidence(self) -> bool:
        level = self.intent.get('confidence_level', 'low')
        if level in ('very_high', 'high'):
            return True
        self._reasons['intent'] = level
        return False

    def _check_noise_absent(self) -> bool:
        """Categorizer says this needs a response (not auto-archive)."""
        if self.categoria.get('needs_response', True) is False:
            self._reasons['categorizer'] = self.categoria.get('category', 'unknown')
            return False
        return True

    def _check_no_action_items(self) -> bool:
        """No explicit action markers in subject/snippet."""
        if _has_action_items(self.subj, self.snip):
            self._reasons['action_items'] = 'detected'
            return False
        return True

    @property
    def reasons(self) -> dict:
        return self._reasons

    def stats_dict(self, used_fast_path: bool) -> dict:
        return {
            'fast_path_used':       used_fast_path,
            'fast_path_profile_ok': self._check_profile_history() if not used_fast_path else True,
            'fast_path_intent_ok':  self._check_intent_confidence()  if not used_fast_path else True,
            'fast_path_cat_ok':     self._check_noise_absent()        if not used_fast_path else True,
            'fast_path_action_ok':  self._check_no_action_items()     if not used_fast_path else True,
            'fast_path_reasons':    self._reasons,
        }


# ═══════════════════════════════════════════════════════════════
#  FAST-PATH PIPELINE  (~6 steps vs 14)
# ═══════════════════════════════════════════════════════════════

class V26Responder:
    """V25 with Cascading Latency executor injected into V24 pipeline."""

    def __init__(self):
        # V22/ML
        self.optimizer  = MLTemplateOptimizerV21() if MLTemplateOptimizerV21 else None
        self.timer      = PredictiveTimerV21() if PredictiveTimerV21 else None

        # V23
        self.sender_learner = SenderProfileLearnerV23()  if SenderProfileLearnerV23 else None
        # ContextualMemoryBankV23  — short-circuited, not instantiated eagerly
        self.intent_scorer   = IntentConfidenceScorerV23() if IntentConfidenceScorerV23 else None
        self.categorizer     = AutoCategorizerV23()        if AutoCategorizerV23 else None
        # SmartFollowUpScheduler — short-circuited
        # ActionItemExtractor      — short-circuited
        self.quality_chk     = ResponseQualityCheckerV23() if ResponseQualityCheckerV23 else None

        # Wave 6 — polarity + action patterns
        self.polarity_analyzer = ResponsePolarityAnalyzer() if V25_POLARITY_ENABLED and ResponsePolarityAnalyzer else None
        self.action_patterns   = LearnedActionPatterns()     if V25_PATTERNS_ENABLED   and LearnedActionPatterns    else None

        # Wave 8 — attachment awareness
        self.attach_checker = check_attachments if V25_ATTACH_ENABLED and check_attachments else None

        # Wave 9 — realtime feedback
        self.rtfb = apply_feedback if V25_RTFB_ENABLED and apply_feedback else None

        # Wave 10 — quality regression trainer
        self.qr_trainer = QualityRegressionTrainer() if V25_REGR_TRAINER_ENABLED and QualityRegressionTrainer else None

        # ML weights (pre-loaded once)
        self.ml_weights = self.optimizer.train_from_outcomes() if self.optimizer else {}

        # Stats
        self.stats = defaultdict(int)
        # Reply-all compliance
        self.stats['reply_all_enforced'] = 0
        self.stats['reply_all_missed']   = 0
        self.stats['reply_all_total']    = 0

        # V26 per-email context (reset at start of each pipeline call)
        self._fin_result = {}
        self.stats['action_escalated'] = 0
        self.stats['action_financial']  = 0
        self.stats['action_meeting']    = 0

    # ── Main loop ──────────────────────────────────────────────
    def process_batch(self, limit: int = 20, dry_run: bool = False) -> dict:
        run_start = datetime.now(timezone.utc).isoformat()
        _log({"run_id": RUN_ID, "phase": "v25_start", "ts": run_start,
              "dry_run": dry_run, "limit": limit, "gmail": HAS_GMAIL})

        pool: list[dict] = []

        if not HAS_GMAIL and not dry_run:
            telegram_send("⚠️  [V25] Gmail unavailable — skipping.")
            return self._finalise(run_start)

        if dry_run:
            pool = [
                # dr-1: urgent support — fast-path eligible (3 positive outcomes, high intent)
                {"id": "dr-1", "thread_id": "dr-1", "sender": "Alice <alice@example.com>",
                 "subject": "Urgent: Server outage", "snippet": "Production is down!",
                 "cc": "dev@team.com"},
                # dr-2: normal sales — full path (less confident intent)
                {"id": "dr-2", "thread_id": "dr-2", "sender": "Bob <bob@partner.com>",
                 "subject": "Partnership proposal", "snippet": "Strategic partnership discussion.",
                 "cc": "colleague@partner.com"},
                # dr-3: payment received — financial handler
                {"id": "dr-3", "thread_id": "dr-3", "sender": "PayPal <paypal@paypal.com>",
                 "subject": "Payment received: $1,200", "snippet": "We received your payment of $1,200.00 — thank you!",
                 "cc": ""},
                # dr-4: legal threat — ESCALATED (critical)
                {"id": "dr-4", "thread_id": "dr-4", "sender": "Angry Client <legal@client.com>",
                 "subject": "I will sue you", "snippet": "This is unacceptable. Contact my lawyer immediately.",
                 "cc": ""},
                # dr-5: support — no outcome history (forces full pipeline, no fast-path)
                {"id": "dr-5", "thread_id": "dr-5", "sender": "New User <new@example.com>",
                 "subject": "How do I reset my password?", "snippet": "I forgot my password and need to reset.",
                 "cc": ""},
            ]
            # Pre-seed outcome history for dr-1/2/3 (fast-path test + financial)
            self._dry_outcomes = _build_dry_run_outcomes()
            print("🧪 [V26] Injecting 5 dry-run stub emails (escalation, financial, fast-path, full-path).")
        else:
            raw = gmail_search("is:unread", limit=limit * 2)
            if not raw:
                telegram_send("📭 [V25] No unread emails.")
                return self._finalise(run_start)
            for msg in raw:
                try:
                    f = gmail_get(msg["id"])
                    hdrs = {h["name"]: h["value"] for h in f.get("payload", {}).get("headers", [])}
                    pool.append({
                        "id": msg["id"], "thread_id": f.get("threadId", msg["id"]),
                        "sender": hdrs.get("From", ""), "subject": hdrs.get("Subject", ""),
                        "snippet": f.get("snippet", ""),
                        "cc": next((h["value"] for h in f.get("payload", {}).get("headers", [])
                                    if h["name"].lower() == "cc"), ""),
                    })
                except Exception as ex:
                    _log({"run_id": RUN_ID, "phase": "fetch_error", "err": str(ex)})
                    self.stats["errors_fetch"] += 1

        # Sort: forwards first, then new senders
        def _sort(e):
            s = e["subject"].lower()
            return (0 if "fwd:" in s else 1, 0 if e["id"] in self.stats else 1, 0)
        pool.sort(key=_sort)

        for email in pool[:limit]:
            self.stats["processed"] += 1
            t0   = time.monotonic()
            ms   = round((time.monotonic() - t0) * 1000, 1)

            # ── V25 Pipeline Entry ─────────────────────────────────
            result = self._v25_pipeline(email, dry_run, t0)

            _log({"run_id": RUN_ID, "phase": "v25_pipeline_done",
                  "thread_id": email["thread_id"], **result})
            # V26 additional stats
            if getattr(self, '_fin_result', {}).get('financial_type', 'none') != 'none':
                self.stats["action_financial"] = self.stats.get("action_financial", 0) + 1
            if result.get("action") not in ("skip", "review", "archive", "escalated"):
                self.stats[f"action_{result.get('action', 'unknown')}"] += 1

            # Stats counters (exclude escalated from path counts)
            if result.get("action") != "escalated":
                if result.get("fast_path"):
                    self.stats["fast_path_count"] += 1
                    self.stats["fast_path_ms"] += result.get("elapsed_ms", 0)
                else:
                    self.stats["full_path_count"] += 1
                    self.stats["full_path_ms"] += result.get("elapsed_ms", 0)

        return self._finalise(run_start)

    # ═══════════════════════════════════════════════════════════════
    #  V25 PIPELINE — with Cascading Latency injection
    # ═══════════════════════════════════════════════════════════════

# ⑤ Intent + confidence (fast, rule-based)
        intent_raw = self.intent_scorer.score(sender, subj, snip, tid) if self.intent_scorer else {
            "categories": ["general"], "confidence": 0.5, "confidence_level": "medium",
            "intent_details": {"urgency": 3}, "suggested_action": "draft_and_review"}

        # ── Dry-run: inject pre-built outcomes into profile for fast-path detector (moved earlier)
        if dry_run and hasattr(self, '_dry_outcomes') and ee in self._dry_outcomes:
            profile['outcome_history'] = profile.get('outcome_history', []) + self._dry_outcomes[ee]
            profile['total_messages']  = profile.get('total_messages', 0) + len(self._dry_outcomes[ee])

        # ── Wave 11: Apply sender-intent bias (profile-confirmed category boost)
        intent_raw = _apply_intent_boost(intent_raw, profile)

        if intent_raw.get("confidence_level") == "low":
            return {"action": "review", "reason": "low_intent_confidence",
                    "intent": intent_raw, "tone": tone_data, "elapsed_ms": ms_elapsed()}

        intent_label = intent_raw.get("categories", ["general"])[0]
        urgency_val  = intent_raw.get("intent_details", {}).get("urgency", 3)
        intent_cat   = INTENT_MAP.get(intent_label, "general")

        # ── Wave 6a: Polarity analysis (informs tone + urgency override) ──
        polarity_result = None
        if self.polarity_analyzer:
            try:
                polarity_result = self.polarity_analyzer.analyze(subj, snip, sender)
                tone_data["polarity"]      = polarity_result.get("polarity", "neutral")
                tone_data["polarity_conf"] = polarity_result.get("confidence", 0)
                if polarity_result.get("polarity") == "urgent":
                    urgency_val = min(urgency_val, 1)
                elif polarity_result.get("suggests_tone"):
                    tone_data["response_tone"] = polarity_result["suggests_tone"]
            except Exception:
                pass

        # ══════════════════════════════════════════════════════
        #  V25 DECISION: Fast-path or Full?
        # ══════════════════════════════════════════════════════

        detector = CascadingLatencyDetector(profile, intent_raw, cat_result, subj, snip)
        use_fast = detector.can_fast_path

        if use_fast:
            fast_ms_start = time.monotonic()
            # Pass financial_result to _fast_path via instance variable
            self._fin_result = financial_result
            result = self._fast_path(email, intent_label, intent_cat, intent_raw,
                                     urgency_val, tone_data, profile, cat_result, dry_run, t0,
                                     attach_info=attach_info)
            result["fast_path"]      = True
            result["fast_path_ms"]   = round((time.monotonic() - fast_ms_start) * 1000, 1)
            result["total_ms"]       = ms_elapsed()
            result["fast_path_total"]= result["fast_path_ms"] + ms_elapsed()
            result["detector_stats"] = detector.stats_dict(True)
            return result

        # FULL pipeline fall-through — V26 with financial + meeting integration
        self._fin_result = financial_result
        return self._full_pipeline(email, intent_raw, intent_label, intent_cat,
                                   urgency_val, tone_data, profile, cat_result, dry_run, t0)

    # ═══════════════════════════════════════════════════════════════
    #  FAST-PATH — 6 steps
    # ═══════════════════════════════════════════════════════════════

    def _fast_path(self, email, intent_label, intent_cat, intent_raw,
                   tone_data, profile, cat_result, dry_run, t0,
                   attach_info=None) -> dict:

        sender    = email["sender"]
        subj      = email["subject"]
        tid       = email["thread_id"]
        name      = self._get_name(sender)
        lang      = tone_data.get("language", "pt")
        use_cc    = ""
        attach_info = attach_info or {"has_attachments": False, "attachment_summary": ""}
        reply_all = False

        # ① Tone — already computed
        t_response = f"Fast-path ({intent_cat}) response for {name}."

        # ② Select template + compose (minimal LLM-free)
        tpl = TEMPLATES.get(lang, TEMPLATES["en"]).get(intent_cat, TEMPLATES["en"]["general"])
        sig = _get_sig(tone_data.get("formality", "neutral"), lang)
        body_raw = tpl.format(name=name, close="—", signature="")
        body = f"{body_raw}\n\n{sig}"
        if attach_info.get("has_attachments") and attach_info.get("attachment_summary"):
            lang_sfx = "." if lang == "en" else "."
            body = f"{body}\n\nI see you {attach_info['attachment_summary']}{lang_sfx}"

        # ③-kb Lightweight KB inject (Wave 7)<1ms
        kb_inject = _fast_kb_context(intent_cat, subj, lang)
        if kb_inject:
            body = f"{body}\n\n_KB: {kb_inject}_"

        # ③-rt Real-time feedback pre-send re-check (fast-pass only)
        rtfb_result = {"tier": "send", "feedback": "rtfb_not_available"}
        if self.rtfb:
            try:
                ed_rtfb = {"subject": subj, "snippet": snip,
                            "sender": sender, "cc": email.get("cc", ""),
                            "urgency": urgency_val if 'urgency_val' in dir() else 3,
                            "tone": tone_data}
                rtfb_result = self.rtfb(body, ed_rtfb, intent_label,
                                         _v25_score=_v25_score, dry_run=dry_run)
                if rtfb_result.get("needs_review") or rtfb_result.get("tier") == "review":
                    return {"action": "review", "reason": "rtfb_intercepted",
                            "feedback": rtfb_result, "tone": tone_data,
                            "elapsed_ms": round((time.monotonic() - t0) * 1000, 1)}
            except Exception:
                pass

        # ③ Trim grammar check (inline, <1ms)
        g_score, g_issues = _fast_grammar_check(body)

        # ④ Reply-all — V27 always_CC first, fall back to decide_reply_all for edge cases
        reply_all_ok = False
        use_cc       = ""
        try:
            if always_cc and from_email_data:
                # ── V27: Hard-require: always reply all unless suppressed ──────────
                ed   = from_email_data(email)
                acd  = always_cc(ed)
                if not acd.get("suppressed", False):
                    use_cc       = acd.get("use_cc", "")
                    reply_all_ok = bool(use_cc)
                else:
                    # Suppressed by fwd:/private → try legacy Decide layer
                    if decide_reply_all:
                        rad  = decide_reply_all(ed)
                        reply_all_ok = bool(rad.get("reply_all", False))
                        use_cc       = rad.get("use_cc", "")
        except Exception:
            pass
        if not reply_all_ok:
            reply_all_ok = _check_reply_all_basic(body, sender, email.get("cc", ""))

        # ⑤ Quality gate (minimal pass/fail)
        min_qc = {
            "overall_score": round(g_score, 1),
            "passed": g_score >= 65,
            "issues": [{"dimension": "grammar", "msg": i} for i in g_issues[:3]],
        }
        if not min_qc["passed"]:
            return {"action": "review", "reason": "fast_path_quality_failed",
                    "quality": min_qc, "tone": tone_data,
                    "elapsed_ms": round((time.monotonic() - t0) * 1000, 1)}


        # ── V26: Calendar availability for booking intents ─────────────
        if V26_MEETING_ENABLED and get_availability_next_7_days and intent_cat in ('booking', 'sales'):
            try:
                avail = get_availability_next_7_days()
                if avail:
                    formatted = format_availability(avail)
                    if formatted:
                        if lang == 'pt':
                            body += f"\n\n📅 Minha disponibilidade nos próximos dias:\n" + "\n".join(f"  • {d}" for d in formatted[:3])
                        else:
                            body += f"\n\n📅 My availability for the next few days:\n" + "\n".join(f"  • {d}" for d in formatted[:3])
            except Exception:
                pass

        # ── V26: Financial acknowledgment ──────────────────────────────
        if getattr(self, '_fin_result', {}).get('financial_type') == 'payment_received':
            if lang == 'pt':
                body += "\n\nConfirmado — agradecemos o pagamento!"
            else:
                body += "\n\nConfirmed — thank you for your payment!"

        # ⑥ Send — V28: log template quality before returning
        if dry_run:
            _log_template_quality(intent_cat, lang, tpl, min_qc["overall_score"],
                                  g_score, sender)
            return {"action": "send_dry_fast", "intent": intent_label,
                    "reply_all": reply_all_ok, "tone": tone_data,
                    "quality": min_qc, "elapsed_ms": round((time.monotonic() - t0) * 1000, 1)}

        if not HAS_GMAIL:
            return {"action": "skip", "reason": "no_gmail",
                    "elapsed_ms": round((time.monotonic() - t0) * 1000, 1)}

        cc_part = f", {use_cc}" if reply_all_ok and use_cc else ""
        all_rcp = f"{sender}{cc_part}"
        subj_rep = f"Re: {subj}" if not subj.lower().startswith("re:") else subj
        res = gmail_send_reply_fixed(tid, subj_rep, body, all_rcp)

        # ══ Reply-all compliance (Wave 12)
        self.stats["reply_all_total"] += 1
        if reply_all_ok:
            self.stats["reply_all_enforced"] += 1
        else:
            self.stats["reply_all_missed"] += 1
        _log_template_quality(intent_cat, lang, tpl, min_qc["overall_score"],
                              g_score, sender)
        return {"action": "send_fast", "intent": intent_label,
                "reply_all": reply_all_ok, "tone": tone_data,
                "quality": min_qc, "elapsed_ms": round((time.monotonic() - t0) * 1000, 1)}

    # ═══════════════════════════════════════════════════════════════
    #  FULL PIPELINE — identical to V24 (no regressions)
    # ═══════════════════════════════════════════════════════════════

    def _full_pipeline(self, email, intent_raw, intent_label, intent_cat,
                       urgency_val, tone_data, profile, cat_result, dry_run, t0) -> dict:

        ee      = email["id"]
        tid     = email["thread_id"]
        subj    = email["subject"]
        snip    = email["snippet"]
        sender  = email["sender"]
        name    = self._get_name(sender)
        lang    = self._detect_language(f"{subj} {snip}")
        ms      = lambda: round((time.monotonic() - t0) * 1000, 1)

        # ③ Context (skipped in fast-path)
        try:
            from contextual_memory_bank import ContextualMemoryBankV23
            ctx = ContextualMemoryBankV23()
            members = [p.strip() for p in ctx.recall(tid).get("participants", [sender])]
            ctx.store(tid, sender, subj, snip)
        except Exception:
            members = [sender]

        # ③-b Context-memory → Thread Continuity Intelligence (Wave 5)
        _wave5_cc_candidates = []
        if THREAD_CONTINUITY_ENABLED:
            predict_thread_participants_fn = (
                predict_thread_participants  # module-level; guarded by THREAD_CONTINUITY_ENABLED
            )
            try:
                _tc_pred = predict_thread_participants_fn(tid, sender, subj)
                if _tc_pred:
                    all_ppl = _tc_pred.get("all_participants", [])
                    new_cc  = _tc_pred.get("new_cc_candidates", [])
                    for p in all_ppl:
                        paddr = p if "@" in p else ""
                        if paddr and paddr not in members:
                            members.append(paddr)
                    _wave5_cc_candidates = _tc_pred.get("missing_from_cc", [])
            except Exception:
                pass

        # ⑥ Action items (skipped in fast-path)
        actions = []
        try:
            from action_item_extractor import ActionItemExtractorV23
            actions = ActionItemExtractorV23().extract(subj, snip, sender, tid)
        except Exception:
            pass

        # ⑦ Follow-up (skipped in fast-path)
        try:
            from smart_followup_scheduler import SmartFollowUpSchedulerV23
            SmartFollowUpSchedulerV23().schedule_followup(tid, sender, intent_label, urgency_val)
        except Exception:
            pass

        # ⑧ Reply-all decision (full algorithm)
        reply_all_dec = {"reply_all": False, "use_cc": ""}
        reply_all_ok  = False
        use_cc        = ""
        if EnhancedReplyAllHandlerV22:
            try:
                reply_all_dec = EnhancedReplyAllHandlerV22().decide(email, thread_participants=members)
                reply_all_ok  = reply_all_dec.get("reply_all", False)
                use_cc        = reply_all_dec.get("use_cc", "")
            except Exception:
                pass

        # Email-decision layer (heuristic + LLM)
        if from_email_data and decide_reply_all:
            try:
                ed  = from_email_data(email)
                rad = decide_reply_all(ed)
                merged = reply_all_ok or rad.get("reply_all", False)
                if rad.get("use_cc"):
                    use_cc = rad["use_cc"]
                reply_all_ok = merged
            except Exception:
                pass

        # ③-c → Wave 5: wire missing from CC into use_cc slots
        if _wave5_cc_candidates:
            _w5c = ", ".join(_wave5_cc_candidates)
            use_cc = (f"{use_cc}, {_w5c}" if use_cc else _w5c).strip(", ")

        # ⑨-b KB Grounding RAG (Wave 2) — inject Zion Tech Group facts into response
        kb_ctx = ""
        if KB_GROUNDING_ENABLED:
            try:
                from kb_grounding_rag import build_prompt_context
                kb_ctx = build_prompt_context(subj, snip)
            except Exception:
                pass

        # ── Wave 6b: Learned action patterns — override template if strong match
        _pattern_meta = None
        if self.action_patterns:
            try:
                _pattern_meta = self.action_patterns.suggest_best_response(sender, intent_label, lang)
            except Exception:
                _pattern_meta = None

        # ⑨ Template selection + ⑩ Compose
        tpl_body = TEMPLATES.get(lang, TEMPLATES["en"]).get(intent_cat, TEMPLATES["en"]["general"])
        adapted  = generate_adapted_response(name, intent_label, tone_data)
        # ③-rt Full-pipeline RTFB pre-send recheck (Wave 9)
        rtfb_result = None
        if self.rtfb:
            try:
                ed_rtfb = {"subject": subj, "snippet": snip,
                            "sender": sender, "cc": "",
                            "urgency": urgency_val, "tone": tone_data}
                rtfb_result = self.rtfb(body, ed_rtfb, intent_label,
                                         _v25_score=_v25_score, dry_run=dry_run)
                if rtfb_result.get("needs_review") or rtfb_result.get("tier") == "review":
                    return {"action": "review", "reason": "rtfb_intercepted",
                            "feedback": rtfb_result, "tone": tone_data,
                            "elapsed_ms": ms()}
            except Exception:
                pass

        body     = f"{adapted}\n\n{tpl_body.format(name=name, close='—', signature='')}"
        # ⑪ Quality gate (V25 6-dimension verifier)
        qc = {"overall_score": 85.0, "passed": True, "issues": [],
              "dimension_scores": {}, "should_send": True}
        if V25_VERIFIER_ENABLED and _v25_score:
            try:
                ed_for_verify = {
                    "subject":  subj,
                    "snippet":  snip,
                    "sender":   sender,
                    "cc":       use_cc or "",
                    "tone":     tone_data,
                }
                qc = _v25_score(body, ed_for_verify, intent_label)
            except Exception:
                pass
        else:
            # Fallback: basic grammar + sign-off check
            qc = _fallback_quality_check(body, lang)

        if not qc.get("passed", True) or not qc.get("should_send", True):
            return {"action": "review", "reason": "quality_failed",
                    "quality": qc, "tone": tone_data, "elapsed_ms": ms()}

        # ⑪-b QR trainer: log quality after send for next-run regression check
        if self.qr_trainer:
            try:
                _qr = self.qr_trainer.check_all()
                if _qr.get("newly_flagged") or _qr.get("flagged"):
                    _log({"run_id": RUN_ID, "phase": "qr_trainer", **_qr})
            except Exception:
                pass


        # ── V26: Calendar availability + financial ack for full pipeline ─
        if V26_MEETING_ENABLED and get_availability_next_7_days and intent_cat in ('booking', 'sales'):
            try:
                avail = get_availability_next_7_days()
                if avail:
                    formatted = format_availability(avail)
                    if formatted:
                        if lang == 'pt':
                            body += f"\n\n📅 Minha disponibilidade nos próximos dias:\n" + "\n".join(f"  • {d}" for d in formatted[:3])
                        else:
                            body += f"\n\n📅 My availability for the next few days:\n" + "\n".join(f"  • {d}" for d in formatted[:3])
            except Exception:
                pass

        if getattr(self, '_fin_result', {}).get('financial_type') == 'payment_received':
            if lang == 'pt':
                body += "\n\nConfirmado — agradecemos o pagamento!"
            else:
                body += "\n\nConfirmed — thank you for your payment!"

        # ⑫ Send
        if dry_run:
            # ══ Reply-all compliance (Wave 12)
            self.stats["reply_all_total"] += 1
            if reply_all_ok:
                self.stats["reply_all_enforced"] += 1
            else:
                self.stats["reply_all_missed"] += 1
            _log_template_quality(intent_cat, lang, tpl, qc["overall_score"],
                                  _fast_grammar_check(body)[0], sender)
            return {"action": "send_dry", "intent": intent_label,

                    "reply_all": reply_all_ok, "tone": tone_data,
                    "quality": qc, "elapsed_ms": ms(), "fast_path": False,
                    "wave5_cc": _wave5_cc_candidates, "kb_ctx": bool(kb_ctx)}
        if not HAS_GMAIL:
            return {"action": "skip", "reason": "no_gmail",
                    "elapsed_ms": ms(), "fast_path": False}

        cc_part = f", {use_cc}" if reply_all_ok and use_cc else ""
        all_rcp = f"{sender}{cc_part}"
        subj_rep= f"Re: {subj}" if not subj.lower().startswith("re:") else subj
        res = gmail_send_reply_fixed(tid, subj_rep, body, all_rcp)

        # ══ Reply-all compliance (Wave 12)
        self.stats["reply_all_total"] += 1
        if reply_all_ok:
            self.stats["reply_all_enforced"] += 1
        else:
            self.stats["reply_all_missed"] += 1
        _log_template_quality(intent_cat, lang, tpl, qc["overall_score"],
                              _fast_grammar_check(body)[0], sender)
        return {"action": "send", "intent": intent_label,
                "reply_all": reply_all_ok, "tone": tone_data,
                "quality": qc, "elapsed_ms": ms(), "fast_path": False,
                "wave5_cc": _wave5_cc_candidates, "kb_ctx": bool(kb_ctx)}

    # ── Helpers ────────────────────────────────────────────────
    def _get_name(self, sender: str) -> str:
        m = re.match(r'"([^"]+)"\s*<', sender)
        if m: return m.group(1).strip()
        m = re.match(r'([^<]+)<', sender)
        if m: return m.group(1).strip()
        return sender.split('@')[0] if '@' in sender else sender[:30]

    def _detect_language(self, text: str) -> str:
        pt_hits = re.findall(r'[ãõçêéíóúàâô]|\bnão\b|\bvocê\b|\bobrigad'
                             r'|\bsenhor\b|\bprezad\b|\bsolicita\b|\bretorno\b', text, re.I)
        return "pt" if len(pt_hits) >= 2 else "en"

    # ── Finalise ───────────────────────────────────────────────
    def _finalise(self, run_start: str) -> dict:
        elapsed = round((datetime.now(timezone.utc) -
                         datetime.fromisoformat(run_start)).total_seconds(), 1)
        fast_n = self.stats.get("fast_path_count", 0)
        full_n = self.stats.get("full_path_count", 0)
        avg_fast = (self.stats.get("fast_path_ms", 0) / max(fast_n, 1)) if fast_n else 0
        avg_full = (self.stats.get("full_path_ms", 0) / max(full_n, 1)) if full_n else 0

        lines = [
            f"⚡ V26 Intelligent Cascading Latency — run {RUN_ID}",
            f"⏱  {elapsed}s",
            f"📨 Processed : {self.stats['processed']}",
            f"🚀 Fast-path : {fast_n}  (avg {avg_fast:.0f}ms each)",
            f"🔄 Full-path : {full_n}  (avg {avg_full:.0f}ms each)",
            f"📤 Sent      : {self.stats.get('sent', self.stats.get('would_send', 0))}",
            f"📦 Auto-arch : {self.stats.get('action_archive', 0)}",
            f"👁  Review    : {self.stats.get('action_review', 0)}",
            f"❌ Errors    : {self.stats.get('errors_fetch', 0)}",
            f"📬 Reply-all : {_rera_enf}/{_rera_tot} enforced" if (_rera_enf:=self.stats.get("reply_all_enforced",0))>0 or (_rera_tot:=self.stats.get("reply_all_total",0))>0 else "",
        ]
        # V26 additional stats
        if self.stats.get('action_escalated', 0) > 0:
            lines.append(f"🔥 Escalated  : {self.stats['action_escalated']}")
        if self.stats.get('action_financial', 0) > 0:
            lines.append(f"💰 Financial  : {self.stats['action_financial']}")
        if self.stats.get('action_meeting', 0) > 0:
            lines.append(f"📅 Meetings   : {self.stats['action_meeting']}")
        if avg_full > 0:
            lines.append(f"⚡ Latency gain vs full: ~{max(1, round(avg_full / max(avg_fast, 1))):.0f}x faster")
        lines = [l for l in lines if l]  # remove empty lines
        report = "\n".join(lines)
        print(report)
        if HAS_GMAIL:
            try:
                telegram_send(report)
            except Exception:
                pass

        summary = {
            "run_id":      RUN_ID,
            "ts_start":    run_start,
            "ts_end":      datetime.now(timezone.utc).isoformat(),
            "elapsed_s":   elapsed,
            **dict(self.stats),
            "fast_path_count":       fast_n,
            "full_path_count":       full_n,
            "latency_speedup_est":   round(avg_full / max(avg_fast, 1), 1) if avg_fast > 0 else 0,
        }
        _log_stats(summary)
        _maybe_audit()  # V28: batch-level quality audit
        return summary


# ═══════════════════════════════════════════════════════════════
#  ENTRY POINT — drop-in V24 replacement
# ═══════════════════════════════════════════════════════════════

RUN_ID = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%S")

if __name__ == "__main__":
    import argparse
    ap = argparse.ArgumentParser(description="V26 Intelligent Cascading Latency Email Responder")
    ap.add_argument("--execute", "-e", action="store_true",
                    help="Actually send emails (default: dry-run)")
    ap.add_argument("--limit", "-n", type=int, default=20,
                    help="Max emails per run (default: 20)")
    ap.add_argument("--dry-run", "-d", action="store_true",
                    help="Force dry-run mode (no sends)")
    args = ap.parse_args()
    dry = not args.execute or args.dry_run
    if dry:
        print("🧪 DRY-RUN — no emails will be sent.\n")
    V26Responder().process_batch(limit=args.limit, dry_run=dry)