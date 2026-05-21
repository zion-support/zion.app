
#!/usr/bin/env python3
"""
V29 — Stable Intelligence Layer (incorporates V26/V27/V28)

Fixes in V29:
  - escalation_engine.py: _NEGATIVE moved before first use (no NameError)
  - V26Responder: _v25_pipeline method created (was missing → crash blocker)
  - process_batch: ms var removed from before pipeline call (dead-code, was 0.0)
  - _fast_path: snip reference fixed (snip is not local — use email["snippet"])
  - _fast_path: rtfb section cleaned (removed dir() hack, snip fix)
  - _fast_path: V29 escalation gate added before reply-all section
  - _v25_pipeline: V29 escalation gate + reply-all unification + payment_thanks
  - _full_pipeline: V29 escalation gate, reply-all unification, payment_thanks
"""

import json, re, time, csv, io
from datetime import datetime, timezone
from pathlib import Path
from collections import defaultdict

WORKSPACE  = Path(__file__).resolve().parent.parent
COMMANDS   = WORKSPACE / 'commands'
DATA       = WORKSPACE / 'data'
V26_LOG    = DATA / 'v26_run_log.jsonl'
V26_STATS  = DATA / 'v26_stats.jsonl'
V28_TQ_LOG = DATA / 'template_quality.jsonl'
V28_TQ_AUDIT = DATA / 'template_quality_audit.jsonl'

_PROMOTION_WINDOW     = 200
_QUARANTINE_THRESHOLD = 70.0
_CANONICAL_THRESHOLD  = 90.0
_CANONICAL_DAYS       = 14
_AUDIT_INTERVAL       = 50

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

try:
    from email_decision import from_email_data, decide_reply_all, always_cc
except Exception:
    from_email_data  = None
    decide_reply_all = None
    always_cc        = None

# ─── V28: SenderFeedbackOracle ──────────────────────────────
try:
    from intelligent_email_responder_v28 import FeedbackLearner, SenderFeedbackStore
    V28_FEEDBACK_ENABLED = True
except Exception:
    FeedbackLearner       = None
    SenderFeedbackStore   = None
    V28_FEEDBACK_ENABLED  = False

# ─── Wave 2: KB Grounding RAG ───────────────────────────────
try:
    from kb_grounding_rag           import build_prompt_context, retrieve_context
    KB_GROUNDING_ENABLED = True
except Exception:
    KB_GROUNDING_ENABLED = False

# ─── Wave 5: Thread Continuity Intelligence ─────────────────
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

# ─── V25 Pre-built modules ─────────────────────────────────
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

# ─── V26 Wave 4: Escalation + Financial + Meeting ───────────
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


# ─── V30: CaseRouter + ResponseImprover ─────────────────────
try:
    from case_router          import CaseRouter
    from response_improver    import ResponseImprover
    V30_ROUTER_ENABLED   = True
    V30_IMPROVER_ENABLED = True
except Exception as _ex30:
    print(f"⚠️ V30: optional modules not available: {_ex30}", flush=True)
    V30_ROUTER_ENABLED   = False
    V30_IMPROVER_ENABLED = False

# ─── M1: Thread Intent Classifier + Reply-All Binding ──────────
try:
    from classify_thread       import classify_thread, add_to_result
    from decode_reply_all      import decode_reply_all, bind
    from email_orchestrator    import orchestrate
    M1_ORCHESTRATOR_ENABLED = True
except Exception as _ex_m1:
    print(f"⚠️ M1: orchestrator import failed: {_ex_m1}", flush=True)
    M1_ORCHESTRATOR_ENABLED = False

# ─── w2-02 / w3-01 / w3-02 / w3-03 ───────────────────────────
try:
    from reply_all_outcome_poller import record_send, poll_outcome, write_profile
    from thread_participant_expander import expand_from_sent
    from grammar_regression_alert   import check as grammar_check
    from fast_path_promoter         import check as promotion_check
    from template_slot_quarantine   import quarantine_slot, tick, release_slot
    W2_ENABLED = True
    W3_ENABLED = True
except Exception as _ex_w23:
    print(f"⚠️ w2/w3: import failed: {_ex_w23}", flush=True)
    W2_ENABLED = W3_ENABLED = False
    record_send = poll_outcome = write_profile = None
    expand_from_sent = None
    grammar_check = promotion_check = None
    quarantine_slot = tick = release_slot = None


    classify_thread = add_to_result = None
    decode_reply_all = bind = None
    orchestrate = None


    CaseRouter     = None
    ResponseImprover = None


# ── Dry-run outcome pre-seed ────────────────────────────────
def _build_dry_run_outcomes() -> dict:
    return {
        # dr-1: urgent → gets intent=urgent (high), outcome_history=urgent → fast-path profiles ✓
        "dr-1": [
            {"intent": "urgent", "outcome": "positive", "ts": "2026-01-01T00:00:00+00:00"},
            {"intent": "urgent", "outcome": "positive", "ts": "2026-01-02T00:00:00+00:00"},
            {"intent": "urgent", "outcome": "positive", "ts": "2026-01-03T00:00:00+00:00"},
        ],
        # dr-2: sales intent → fast-path eligible
        "dr-2": [
            {"intent": "sales", "outcome": "positive", "ts": "2026-01-01T00:00:00+00:00"},
            {"intent": "sales", "outcome": "positive", "ts": "2026-01-02T00:00:00+00:00"},
            {"intent": "sales", "outcome": "positive", "ts": "2026-01-03T00:00:00+00:00"},
        ],
        # dr-3: payment → support intent → fast-path profiles ✓
        "dr-3": [
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
#  TEMPLATE LIBRARY
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

# Pre-computed signature strings
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

def _record_improver(body, intent_cat, lang, tone_data, g_score, sender, action_label):
    """Centralised ResponseImprover call — used before every pipeline return point."""
    try:
        if V30_IMPROVER_ENABLED and self and self.response_improver:
            self.response_improver.record_send(body, intent_cat, lang,
                tone_data.get("formality", "neutral") if isinstance(tone_data, dict) else "neutral",
                g_score, sender, action_label)
    except Exception:
        pass


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
    emails_mentioned = set(re.findall(r'[\w.+-]+@[\w.-]+', body))
    name_words = [w for w in sender.lower().replace('.', ' ').split() if len(w) > 3]
    has_sender_ref = any(w in body.lower() for w in name_words)
    return has_sender_ref

def _has_action_items(subj: str, snip: str) -> bool:
    """Heuristic: look for explicit action markers in subject/snippet."""
    text = f"{subj} {snip}".lower()
    markers = ['deadline', 'due date', 'by eod', 'by cob', 'precisa', 'preciso',
               'aguardo', 'waiting for', 'please respond', 'respond by',
               'confirm until', 'prazo', 'até amanhã', 'asap']
    return any(m in text for m in markers)

# Fallback quality check
_SIG_PAT = re.compile(r'—\s*\n.*\n.*$', re.DOTALL)
_CLOSING = {'aberto(a)', 'atenciosamente', 'sincerely', 'cheers', 'abraco', 'regards'}

def _fallback_quality_check(body: str, lang: str = 'en') -> dict:
    """Basic ~100μs quality check: grammar + sign-off presence + length."""
    text = body.strip()
    issues: list[dict] = []
    g_score, g_issues = _fast_grammar_check(body)
    issues.extend({"dimension": "grammar", "msg": i} for i in g_issues)
    has_signoff = any(body.strip().lower().endswith(c) for c in _CLOSING) or bool(_SIG_PAT.search(text))
    if not has_signoff:
        issues.append({"dimension": "signoff", "msg": "signature_or_closing_missing"})
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
            "tone_alignment": 75.0,
            "reply_all":     75.0,
            "action_complete": 80.0,
            "compliance":    85.0,
            "factual":       75.0,
        }
    }

# ═══════════════════════════════════════════════════════════════
# ── V28: Template Quality Autocorrect ─────────────────────────
# ═══════════════════════════════════════════════════════════════

def _get_template_key(intent_cat: str, lang: str, template: str) -> str:
    return f"{intent_cat}|{lang}|{template}"

def _log_template_quality(intent_cat: str, lang: str, template: str,
                          quality: float, g_score: float, sender: str = "") -> None:
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
        pass

def _audit_templates() -> None:
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
    global _TQ_SINCE_LAST_AUDIT
    _TQ_SINCE_LAST_AUDIT += 1
    if _TQ_SINCE_LAST_AUDIT >= _AUDIT_INTERVAL:
        _TQ_SINCE_LAST_AUDIT = 0
        _audit_templates()


# ═══════════════════════════════════════════════════════════════
# ── Wave 7: Fast-path KB grounding ───────────────────────────
# ═══════════════════════════════════════════════════════════════

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


# ═══════════════════════════════════════════════════════════════
#  FAST-THROUGH DETECTOR
# ═══════════════════════════════════════════════════════════════

# ── Wave 11: Post-score intent boost ────────────────────────
def _apply_intent_boost(intent_raw: dict, profile: dict) -> dict:
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

# ── w2-01: Intent bucket hash ─────────────────────────────────
_INTENT_BUCKETS: dict = {
    'urgent_bucket':    {'urgent', 'billing', 'legal', 'outage', 'critical', 'incident'},
    'high_value_bucket': {'sales', 'partnership', 'booking', 'invoice'},
    'routine_bucket':   {'support', 'follow_up', 'general'},
    'low_priority_bucket': {'cancellation', 'informational', 'newsletter'},
}

def _normalize_intent(label: str) -> str:
    """Map an intent label to its bucket key (for fast-path boosting)."""
    for bucket, labels in _INTENT_BUCKETS.items():
        if label in labels:
            return bucket
    return 'routine_bucket'

# ── w2-01: Intent bucket hash ─────────────────────────────────


_SENT_REPLY_LOG = DATA / 'sent_reply_log.jsonl'
_DEDUP_WINDOW_SEC = 1800   # 30 minutes

def _check_dedup(thread_id: str, dry_run: bool = False) -> bool:
    """Return True if this thread has a recent send and can be skipped.

    Writes to sent_reply_log on real, non-dry sends only.
    """
    if not _SENT_REPLY_LOG.exists() or not thread_id:
        return False
    now = __import__("datetime").datetime.now(timezone.utc).timestamp()
    last_sent = None
    try:
        for line in _SENT_REPLY_LOG.read_text().splitlines():
            try:
                rec = json.loads(line)
                if rec.get("thread_id") == thread_id:
                    ts = __import__("datetime").datetime.fromisoformat(
                        rec["sent_at"]).timestamp()
                    if last_sent is None or ts > last_sent:
                        last_sent = ts
            except Exception:
                continue
    except Exception:
        pass
    if last_sent and (now - last_sent) < _DEDUP_WINDOW_SEC:
        return True
    return False

def _record_send(thread_id: str, action: str = "send") -> None:
    """Append a send record for dedup tracking."""
    try:
        rec = {
            "thread_id":  thread_id,
            "sent_at":    datetime.now(timezone.utc).isoformat(),
            "action":     action,
        }
        _SENT_REPLY_LOG.parent.mkdir(parents=True, exist_ok=True)
        with open(_SENT_REPLY_LOG, "a") as f:
            f.write(json.dumps(rec) + "\n")
    except Exception:
        pass


class CascadingLatencyDetector:
    """Decision-tree fast/slow gating with intent-bucket boost."""
    # w2-01 intent_bucket_hash: urgent/high-value labels auto-pass confidence gate

    def __init__(self, profile: dict, intent_result: dict,
                 cat_result: dict, subj: str, snip: str) -> None:
        self.profile   = profile
        self.intent    = intent_result
        self.categoria = cat_result
        self.subj      = subj
        self.snip      = snip
        self._reasons  = {}

    @property
    def can_fast_path(self) -> bool:
        return (
            self._check_profile_history() and
            self._check_intent_confidence() and
            self._check_noise_absent() and
            self._check_no_action_items()
        )

    def _check_profile_history(self) -> bool:
        if not self.profile:
            self._reasons['profile'] = 'no_profile'
            return False
        intent     = self.intent.get('categories', ['general'])[0]
        outcomes   = self.profile.get('outcome_history', [])
        if len(outcomes) < 2:
            self._reasons['profile'] = f'insufficient_history_{len(outcomes)}'
            return False
        intent_outcomes = [o for o in outcomes if o.get('intent') == intent]
        if len(intent_outcomes) < 2:
            self._reasons['profile'] = f'low_intent_history_{len(intent_outcomes)}'
            return False
        success_rate = sum(
            1 for o in intent_outcomes[-5:]
            if o.get('outcome') in ('positive', 'neutral')
        ) / max(len(intent_outcomes[-5:]), 1)
        if success_rate < 0.80:
            self._reasons['profile'] = f'success_rate_{success_rate:.0%}'
            return False
        return True

    def _check_intent_confidence(self) -> bool:
        level  = self.intent.get('confidence_level', 'low')
        label  = self.intent.get('categories', ['general'])[0]
        bucket = _normalize_intent(label)

        # Urgent bucket: auto-pass regardless of confidence level
        if bucket == 'urgent_bucket':
            self._reasons['intent_bucket'] = bucket
            return True

        if level in ('very_high', 'high'):
            return True
        self._reasons['intent'] = level
        return False

    def _check_noise_absent(self) -> bool:
        if self.categoria.get('needs_response', True) is False:
            self._reasons['categorizer'] = self.categoria.get('category', 'unknown')
            return False
        return True

    def _check_no_action_items(self) -> bool:
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



class V26Responder:
    def __init__(self):
        self.optimizer  = MLTemplateOptimizerV21() if MLTemplateOptimizerV21 else None
        self.timer      = PredictiveTimerV21() if PredictiveTimerV21 else None
        self.sender_learner = SenderProfileLearnerV23()  if SenderProfileLearnerV23 else None
        self.intent_scorer   = IntentConfidenceScorerV23() if IntentConfidenceScorerV23 else None
        self.categorizer     = AutoCategorizerV23()        if AutoCategorizerV23 else None
        self.quality_chk     = ResponseQualityCheckerV23() if ResponseQualityCheckerV23 else None
        self.polarity_analyzer = ResponsePolarityAnalyzer() if V25_POLARITY_ENABLED and ResponsePolarityAnalyzer else None
        self.action_patterns   = LearnedActionPatterns()     if V25_PATTERNS_ENABLED   and LearnedActionPatterns    else None
        self.attach_checker = check_attachments if V25_ATTACH_ENABLED and check_attachments else None
        self.rtfb = apply_feedback if V25_RTFB_ENABLED and apply_feedback else None
        self.qr_trainer = QualityRegressionTrainer() if V25_REGR_TRAINER_ENABLED and QualityRegressionTrainer else None
        self.ml_weights = self.optimizer.train_from_outcomes() if self.optimizer else {}
        self.feedback_oracle = FeedbackLearner() if V28_FEEDBACK_ENABLED and FeedbackLearner else None
        self.stats = defaultdict(int)
        self.stats['reply_all_enforced'] = 0
        self.stats['reply_all_missed']   = 0
        self.stats['reply_all_total']    = 0
        self._fin_result = {}
        self.stats['action_escalated'] = 0
        self.stats['action_financial']  = 0
        self.stats['action_meeting']    = 0

        # V30: CaseRouter + ResponseImprover
        self.case_router      = CaseRouter()      if V30_ROUTER_ENABLED   else None
        self.response_improver = ResponseImprover() if V30_IMPROVER_ENABLED else None

    # ═══════════════════════════════════════════════════════════════════
    #  MAIN BATCH LOOP
    # ═══════════════════════════════════════════════════════════════

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
                {"id": "dr-1", "thread_id": "dr-1", "sender": "Alice <alice@example.com>",
                 "subject": "Urgent: Server outage", "snippet": "Production is down!",
                 "cc": "dev@team.com"},
                {"id": "dr-2", "thread_id": "dr-2", "sender": "Bob <bob@partner.com>",
                 "subject": "Partnership proposal", "snippet": "Strategic partnership discussion.",
                 "cc": "colleague@partner.com"},
                {"id": "dr-3", "thread_id": "dr-3", "sender": "PayPal <paypal@paypal.com>",
                 "subject": "Payment received: $1,200", "snippet": "We received your payment of $1,200.00 — thank you!",
                 "cc": ""},
                {"id": "dr-4", "thread_id": "dr-4", "sender": "Angry Client <legal@client.com>",
                 "subject": "I will sue you", "snippet": "This is unacceptable. Contact my lawyer immediately.",
                 "cc": ""},
                {"id": "dr-5", "thread_id": "dr-5", "sender": "New User <new@example.com>",
                 "subject": "How do I reset my password?", "snippet": "I forgot my password and need to reset.",
                 "cc": ""},
            ]
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

        def _sort(e):
            s = e["subject"].lower()
            return (0 if "fwd:" in s else 1, 0 if e["id"] in self.stats else 1, 0)
        pool.sort(key=_sort)

        for email in pool[:limit]:
            self.stats["processed"] += 1
            t0   = time.monotonic()

            result = self._v25_pipeline(email, dry_run, t0)

            _log({"run_id": RUN_ID, "phase": "v25_pipeline_done",
                  "thread_id": email["thread_id"], **result})
            if getattr(self, '_fin_result', {}).get('financial_type', 'none') != 'none':
                self.stats["action_financial"] = self.stats.get("action_financial", 0) + 1
            if result.get("action") not in ("skip", "review", "archive", "escalated"):
                self.stats[f"action_{result.get('action', 'unknown')}"] += 1
            if result.get("action") != "escalated":
                if result.get("fast_path"):
                    self.stats["fast_path_count"] += 1
                    self.stats["fast_path_ms"] += result.get("elapsed_ms", 0)
                else:
                    self.stats["full_path_count"] += 1
                    self.stats["full_path_ms"] += result.get("elapsed_ms", 0)

        return self._finalise(run_start)

    # ═══════════════════════════════════════════════════════════════
    #  V29 PIPELINE — main orchestrator (was missing → crash blocker)
    # ═══════════════════════════════════════════════════════════════

    def _v25_pipeline(self, email: dict, dry_run: bool, t0: float) -> dict:
        """V29: Single-pass orchestration — escalates, categorises, profiles, routes."""
        ms_elapsed = lambda: round((time.monotonic() - t0) * 1000, 1)

        # ── Email fields ──────────────────────────────────────────
        ee      = email["id"]
        tid     = email["thread_id"]
        sender  = email["sender"]
        subj    = email["subject"]
        snip    = email["snippet"]
        thread_intent_label: str = "unknown"   # R3: initialise before any early-return uses it

        # R3: dedup skip — if this thread was already replied to within 30 min, pass
        try:
            _should_skip = not dry_run and callable(_check_dedup) and _check_dedup(tid)
        except Exception:
            _should_skip = False
        if _should_skip:
            result = add_to_result(email, {"thread_intent": thread_intent_label,
                    "action": "skip", "reason": "dedup_thread_active",
                    "elapsed_ms": ms_elapsed()})
            return result

        # ── ① Categorise (noise / auto-archive) ──────────────────
        cat_result = {"category": "inbox", "auto_archive": False,
                       "needs_response": True, "priority": "normal"}
        if self.categorizer:
            try:
                cat_result = self.categorizer.categorize(email)
            except Exception:
                pass
        if cat_result.get("auto_archive"):
            result = add_to_result(email, {"thread_intent": thread_intent_label, "action": "archive", "reason": cat_result.get("category", "noise"),
                    "elapsed_ms": ms_elapsed()})
            return result

        # ── V29: Escalation gate (before intent scoring) ──────────
        if V26_ESCALATION_ENABLED and check_escalation:
            try:
                esc = check_escalation(subj, snip, sender, dry_run=dry_run)
                if esc.get("escalated"):
                    self.stats["action_escalated"] += 1
                    if esc.get("telegram_alert") and not dry_run:
                        try:
                            telegram_send(esc["telegram_alert"])
                        except Exception:
                            pass
                    _log({"run_id": RUN_ID, "phase": "escalated",
                          "severity": esc.get("severity"), "sender": sender,
                          "signals": esc.get("signals", [])})
                    result = add_to_result(email, {"thread_intent": thread_intent_label, "action": "escalated", "severity": esc.get("severity"),
                            "signals": esc.get("signals", []),
                            "elapsed_ms": ms_elapsed()})
                    return result
            except Exception:
                pass

        # ── ② Tone ──────────────────────────────────────────────
        tone_data: dict = {"formality": "neutral", "language": "pt", "sentiment": "neutral"}
        try:
            tone_data = analyze_tone(subj, snip, sender)
        except Exception:
            pass

        # ── ③ Sender profile ───────────────────────────────────
        profile: dict = {}
        if self.sender_learner:
            try:
                profile = self.sender_learner.get_profile(sender)
            except Exception:
                pass

        # ── ④ Intent + confidence ──────────────────────────────
        intent_raw = self.intent_scorer.score(sender, subj, snip, tid) if self.intent_scorer else {
            "categories": ["general"], "confidence": 0.5, "confidence_level": "medium",
            "intent_details": {"urgency": 3}, "suggested_action": "draft_and_review"}

        if dry_run and hasattr(self, '_dry_outcomes') and ee in self._dry_outcomes:
            profile['outcome_history'] = profile.get('outcome_history', []) + self._dry_outcomes[ee]
            profile['total_messages']  = profile.get('total_messages', 0) + len(self._dry_outcomes[ee])

        intent_raw = _apply_intent_boost(intent_raw, profile)

        if intent_raw.get("confidence_level") == "low":
            result = add_to_result(email, {"thread_intent": thread_intent_label, "action": "review", "reason": "low_intent_confidence",
                    "intent": intent_raw, "tone": tone_data, "elapsed_ms": ms_elapsed()})
            return result

        intent_label = intent_raw.get("categories", ["general"])[0]
        urgency_val  = intent_raw.get("intent_details", {}).get("urgency", 3)
        intent_cat   = INTENT_MAP.get(intent_label, "general")

        # ── M1: Thread Intent Classifier + Reply-All Binding ──────
        thread_intent_label = intent_label
        if M1_ORCHESTRATOR_ENABLED and orchestrate:
            try:
                orchestrate(email, thread_intent_label=thread_intent_label)
                thread_intent_label = email.get("thread_intent_label", thread_intent_label)
            except Exception:
                pass

        # ── Wave 6a: Polarity analysis ──────────────────────────
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

        # ── V29: Financial classification ───────────────────────
        financial_result = {"financial_type": "none", "confidence": 0.0}
        if V26_FINANCIAL_ENABLED and classify_financial_email:
            try:
                financial_result = classify_financial_email(subj, snip, sender)
            except Exception:
                pass

        # ── Attachment awareness ───────────────────────────────
        attach_info = {"has_attachments": False, "attachment_summary": ""}
        if self.attach_checker:
            try:
                attach_info = check_attachments(email)
                if not isinstance(attach_info, dict):
                    attach_info = {"has_attachments": False, "attachment_summary": ""}
            except Exception:
                pass

        # ══════════════════════════════════════════════════════
        #  V29 DECISION: Fast-path or Full?
        # ══════════════════════════════════════════════════════

        detector = CascadingLatencyDetector(profile, intent_raw, cat_result, subj, snip)
        use_fast  = detector.can_fast_path

        if use_fast:
            fast_ms_start = time.monotonic()
            self._fin_result = financial_result
            result = self._fast_path(email, intent_label, intent_cat, intent_raw,
                                     urgency_val, tone_data, profile, cat_result, dry_run, t0,
                                     attach_info=attach_info)
            result["fast_path"]      = True
            result["fast_path_ms"]   = round((time.monotonic() - fast_ms_start) * 1000, 1)
            result["total_ms"]       = ms_elapsed()
            result["fast_path_total"]= result["fast_path_ms"] + result["total_ms"]
            result["detector_stats"] = detector.stats_dict(True)
            return result

        # FULL pipeline fall-through — V26 with financial + meeting
        self._fin_result = financial_result
        return self._full_pipeline(email, intent_raw, intent_label, intent_cat,
                                   urgency_val, tone_data, profile, cat_result, dry_run, t0)

    # ═══════════════════════════════════════════════════════════════
    #  FAST-PATH — 6 steps (V26 + V28 + V29 escalation gate)
    # ═══════════════════════════════════════════════════════════════

    def _fast_path(self, email, intent_label, intent_cat, intent_raw,
                   urgency_val, tone_data, profile, cat_result, dry_run, t0,
                   attach_info=None) -> dict:

        sender    = email["sender"]
        subj      = email["subject"]
        tid       = email["thread_id"]
        snip      = email["snippet"]          # ← V29 FIX: use email["snippet"]
        name      = self._get_name(sender)
        lang      = tone_data.get("language", "pt")
        use_cc    = ""
        attach_info = attach_info or {"has_attachments": False, "attachment_summary": ""}
        reply_all = False

        # ① Tone — already computed
        t_response = f"Fast-path ({intent_cat}) response for {name}."

        # ② Select template + compose
        tpl = TEMPLATES.get(lang, TEMPLATES["en"]).get(intent_cat, TEMPLATES["en"]["general"])
        sig = _get_sig(tone_data.get("formality", "neutral"), lang)
        body_raw = tpl.format(name=name, close="—", signature="")
        body = f"{body_raw}\n\n{sig}"
        if attach_info.get("has_attachments") and attach_info.get("attachment_summary"):
            lang_sfx = "." if lang == "en" else "."
            body = f"{body}\n\nI see you {attach_info['attachment_summary']}{lang_sfx}"

        # ③-kb Lightweight KB inject
        kb_inject = _fast_kb_context(intent_cat, subj, lang)
        if kb_inject:
            body = f"{body}\n\n_KB: {kb_inject}_"

        # ③-rt Real-time feedback
        rtfb_result = {"tier": "send", "feedback": "rtfb_not_available"}
        if self.rtfb:
            try:
                ed_rtfb = {"subject": subj, "snippet": snip,
                           "sender": sender, "cc": email.get("cc", ""),
                           "urgency": urgency_val, "tone": tone_data}
                rtfb_result = self.rtfb(body, ed_rtfb, intent_label,
                                         _v25_score=_v25_score, dry_run=dry_run)
                if rtfb_result.get("needs_review") or rtfb_result.get("tier") == "review":
                    result = add_to_result(email, {"action": "review", "reason": "rtfb_intercepted",
                            "feedback": rtfb_result, "tone": tone_data,
                            "elapsed_ms": round((time.monotonic() - t0) * 1000, 1)})
                    return result
            except Exception:
                pass

        # ③ Trim grammar check
        g_score, g_issues = _fast_grammar_check(body)

        # V30: CaseRouter gates after grammar check (before detector + escalation)
        if V30_ROUTER_ENABLED and self.case_router:
            router_result = self.case_router.route(
                email=email,
                intent_raw=intent_raw,
                intent_label=intent_label,
                intent_cat=intent_cat,
                urgency_val=urgency_val,
                tone_data=tone_data,
                profile=profile,
                fin_result=self._fin_result,
                grammar_score=g_score,
            )
            _rroute = router_result.get("route", "")
            if _rroute == "escalate":
                result = add_to_result(email, {"action": "escalated", "route": "case_router",
                        "severity": "high", "signals": router_result.get("signals", []),
                        "reason": router_result.get("reason", ""),
                        "elapsed_ms": round((time.monotonic() - t0) * 1000, 1)})
                return result
            if _rroute == "auto_ack":
                result = add_to_result(email, {"action": "auto_ack", "route": "case_router",
                        "reply_all": router_result.get("reply_all_ok", False),
                        "reason": router_result.get("reason", ""),
                        "elapsed_ms": round((time.monotonic() - t0) * 1000, 1)})
                return result
            if _rroute == "review":
                result = add_to_result(email, {"action": "review", "route": "case_router",
                        "reason": router_result.get("reason", ""),
                        "elapsed_ms": round((time.monotonic() - t0) * 1000, 1)})
                return result
            # full_pipeline / fast_path: continue normally


        # ── V29: Escalation gate in fast-path ───────────────────
        if V26_ESCALATION_ENABLED and check_escalation:
            try:
                esc = check_escalation(subj, snip, sender)
                if esc.get("escalated"):
                    self.stats["action_escalated"] += 1
                    if esc.get("telegram_alert") and not dry_run:
                        try:
                            telegram_send(esc["telegram_alert"])
                        except Exception:
                            pass
                    result = add_to_result(email, {"action": "escalated", "severity": esc.get("severity"),
                            "signals": esc.get("signals", []),
                            "elapsed_ms": round((time.monotonic() - t0) * 1000, 1)})
                    return result
            except Exception:
                pass

        # ④ Reply-all
        reply_all_dec = {"reply_all": False, "use_cc": ""}
        reply_all_ok  = False
        use_cc        = ""
        # R1b: merge M1 binding (email_orchestrator -> email dict -> _fast_path)
        rab = email.get("reply_all_binding") or {}
        if rab.get("reply_all"):
            reply_all_dec["reply_all"] = True
            reply_all_dec["use_cc"]    = rab.get("use_cc", "")
            reply_all_ok = True
            use_cc       = rab.get("use_cc", use_cc)
            reply_all_dec["reason"]    = rab.get("reason", "m1_binding")
        try:
            if always_cc and from_email_data:
                ed   = from_email_data(email)
                acd  = always_cc(ed)
                if not acd.get("suppressed", False):
                    use_cc       = acd.get("use_cc", "")
                    reply_all_ok = bool(use_cc)
                else:
                    if decide_reply_all:
                        rad  = decide_reply_all(ed)
                        reply_all_ok = bool(rad.get("reply_all", False))
                        use_cc       = rad.get("use_cc", "")
        except Exception:
            pass
        if not reply_all_ok:
            reply_all_ok = _check_reply_all_basic(body, sender, email.get("cc", ""))

        if self.feedback_oracle and reply_all_ok is False:
            hint = self.feedback_oracle.route(sender)
            if hint.get("feedback_tier") == "likely_yes":
                reply_all_ok = True
                self.stats["feedback_oracle_override"] = self.stats.get("feedback_oracle_override", 0) + 1





        # w3-01: grammar regression alert
        if W3_ENABLED and grammar_check:
            try:
                grammar_check(body, g_score, intent_cat)
            except Exception:
                pass

        # w3-02: fast-path promoter (can flip use_fast=True here)
        if W3_ENABLED and promotion_check:
            try:
                promotion_check(sender, intent_raw, intent_cat)
            except Exception:
                pass

        # ⑤ Quality gate — R5: financial payment_received auto-ack bypasses grammar gate
        min_qc = {
            "overall_score": round(g_score, 1),
            "passed": g_score >= 65,
            "issues": [{"dimension": "grammar", "msg": i} for i in g_issues[:3]],
        }
        _fin_payment = (self._fin_result and
                        self._fin_result.get("financial_type") == "payment_received")
        if (not min_qc["passed"]) and (not _fin_payment):
            result = add_to_result(email, {"action": "review", "reason": "fast_path_quality_failed",
                    "quality": min_qc, "tone": tone_data,
                    "elapsed_ms": round((time.monotonic() - t0) * 1000, 1)})
            return result

        # V26: Calendar availability
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

        # w3-03: template slot quarantine tick
        if W3_ENABLED:
            try:
                tick(intent_cat, lang, g_score)
            except Exception:
                pass

        # V29: Payment received acknowledgment (before send, both paths)
        if self._fin_result and self._fin_result.get("financial_type") == "payment_received":
            if lang == 'pt':
                body += "\n\nConfirmado — agradecemos o pagamento!"
            else:
                body += "\n\nConfirmed — thank you for your payment!"

        # ⑥ Send
        if dry_run:
            _log_template_quality(intent_cat, lang, tpl, min_qc["overall_score"],
                                  g_score, sender)
            result = add_to_result(email, {"action": "send_dry_fast", "intent": intent_label,
                    "reply_all": reply_all_ok, "tone": tone_data,
                    "quality": min_qc, "elapsed_ms": round((time.monotonic() - t0) * 1000, 1),
                    "thread_intent": thread_intent_label,
                    "reply_all_detail": reply_all_dec if reply_all_ok else {"reply_all": False, "reason": "dry_run"}})
            return result

        _record_improver(body, intent_cat, lang, tone_data, g_score, sender, "send_dry_fast")

        if not HAS_GMAIL:
            result = add_to_result(email, {"action": "skip", "reason": "no_gmail",
                    "elapsed_ms": round((time.monotonic() - t0) * 1000, 1)})
            return result

        cc_part = f", {use_cc}" if reply_all_ok and use_cc else ""
        all_rcp = f"{sender}{cc_part}"
        subj_rep = f"Re: {subj}" if not subj.lower().startswith("re:") else subj
        res = gmail_send_reply_fixed(tid, subj_rep, body, all_rcp)

        # R2: dedup tracking — record successful send
        _record_send(tid, "send_fast")

        # w2-02: record send outcome for 48h poll; w2-03: expand CC list
        if W2_ENABLED:
            try:
                record_send(sender, tid, intent_cat, reply_all_ok, g_score)
            except Exception:
                pass
            try:
                if expand_from_sent:
                    expand_from_sent(sender, email.get("cc", ""), intent_label)
            except Exception:
                pass

        self.stats["reply_all_total"] += 1
        if reply_all_ok:
            self.stats["reply_all_enforced"] += 1
        else:
            self.stats["reply_all_missed"] += 1
        _log_template_quality(intent_cat, lang, tpl, min_qc["overall_score"],
                              g_score, sender)
        result = add_to_result(email, {"action": "send_fast", "intent": intent_label,
                "reply_all": reply_all_ok, "tone": tone_data,
                "thread_intent": thread_intent_label,
                "quality": min_qc, "elapsed_ms": round((time.monotonic() - t0) * 1000, 1)})
        _record_improver(body, intent_cat, lang, tone_data, g_score, sender, "send_fast")
        return result

    # ═══════════════════════════════════════════════════════════════
    #  FULL PIPELINE — V26 with financial + meeting + V29 gates
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

        # ③ Context
        try:
            from contextual_memory_bank import ContextualMemoryBankV23
            ctx = ContextualMemoryBankV23()
            members = [p.strip() for p in ctx.recall(tid).get("participants", [sender])]
            ctx.store(tid, sender, subj, snip)
        except Exception:
            members = [sender]

        # ③-b Thread Continuity Intelligence
        _wave5_cc_candidates = []
        if THREAD_CONTINUITY_ENABLED:
            predict_thread_participants_fn = predict_thread_participants
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

        # ⑥ Action items
        actions = []
        try:
            from action_item_extractor import ActionItemExtractorV23
            actions = ActionItemExtractorV23().extract(subj, snip, sender, tid)
        except Exception:
            pass

        # ⑦ Follow-up
        try:
            from smart_followup_scheduler import SmartFollowUpSchedulerV23
            SmartFollowUpSchedulerV23().schedule_followup(tid, sender, intent_label, urgency_val)
        except Exception:
            pass

        # ⑧ Reply-all decision (full)
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

        # V29: Escalation gate in full pipeline
        if V26_ESCALATION_ENABLED and check_escalation:
            try:
                esc = check_escalation(subj, snip, sender)
                if esc.get("escalated"):
                    self.stats["action_escalated"] += 1
                    if esc.get("telegram_alert") and not dry_run:
                        try:
                            telegram_send(esc["telegram_alert"])
                        except Exception:
                            pass
                    _log({"run_id": RUN_ID, "phase": "escalated",
                          "severity": esc.get("severity"), "sender": sender,
                          "signals": esc.get("signals", [])})
                    result = add_to_result(email, {"action": "escalated", "severity": esc.get("severity"),
                            "signals": esc.get("signals", []),
                            "elapsed_ms": ms(), "fast_path": False})
                    return result
            except Exception:
                pass

        # Wave 5: wire missing from CC
        if _wave5_cc_candidates:
            _w5c = ", ".join(_wave5_cc_candidates)
            use_cc = (f"{use_cc}, {_w5c}" if use_cc else _w5c).strip(", ")

        # ⑨-b KB Grounding
        kb_ctx = ""
        if KB_GROUNDING_ENABLED:
            try:
                from kb_grounding_rag import build_prompt_context
                kb_ctx = build_prompt_context(subj, snip)
            except Exception:
                pass

        # Wave 6b: Learned action patterns
        _pattern_meta = None
        if self.action_patterns:
            try:
                _pattern_meta = self.action_patterns.suggest_best_response(sender, intent_label, lang)
            except Exception:
                _pattern_meta = None

        # ⑨ Template selection + ⑩ Compose
        tpl_body = TEMPLATES.get(lang, TEMPLATES["en"]).get(intent_cat, TEMPLATES["en"]["general"])
        adapted  = generate_adapted_response(name, intent_label, tone_data)

        # Wave 9: full-pipeline RTFB
        rtfb_result = None
        if self.rtfb:
            try:
                ed_rtfb = {"subject": subj, "snippet": snip,
                           "sender": sender, "cc": "",
                           "urgency": urgency_val, "tone": tone_data}
                rtfb_result = self.rtfb(body, ed_rtfb, intent_label,
                                         _v25_score=_v25_score, dry_run=dry_run)
                if rtfb_result.get("needs_review") or rtfb_result.get("tier") == "review":
                    result = add_to_result(email, {"action": "review", "reason": "rtfb_intercepted",
                            "feedback": rtfb_result, "tone": tone_data, "elapsed_ms": ms()})
                    return result
            except Exception:
                pass

        body = f"{adapted}\n\n{tpl_body.format(name=name, close='—', signature='')}"

        # ⑪ Quality gate
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
            qc = _fallback_quality_check(body, lang)

        if not qc.get("passed", True) or not qc.get("should_send", True):
            result = add_to_result(email, {"action": "review", "reason": "quality_failed",
                    "quality": qc, "tone": tone_data, "elapsed_ms": ms()})
            return result

        # ⑪-b QR trainer
        if self.qr_trainer:
            try:
                _qr = self.qr_trainer.check_all()
                if _qr.get("newly_flagged") or _qr.get("flagged"):
                    _log({"run_id": RUN_ID, "phase": "qr_trainer", **_qr})
            except Exception:
                pass

        # V26 + V29: Calendar + Payment ack in full pipeline
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

        if self._fin_result and self._fin_result.get("financial_type") == "payment_received":
            if lang == 'pt':
                body += "\n\nConfirmado — agradecemos o pagamento!"
            else:
                body += "\n\nConfirmed — thank you for your payment!"

        # ⑫ Send
        if dry_run:
            self.stats["reply_all_total"] += 1
            if reply_all_ok:
                self.stats["reply_all_enforced"] += 1
            else:
                self.stats["reply_all_missed"] += 1
            _log_template_quality(intent_cat, lang, tpl_body, qc["overall_score"],
                                  _fast_grammar_check(body)[0], sender)
            # R2: include M1 reply_all_binding in dry-run result
            rab = email.get("reply_all_binding") or {}
            result = add_to_result(email, {"action": "send_dry", "intent": intent_label,
                    "reply_all": reply_all_ok, "tone": tone_data,
                    "quality": qc, "elapsed_ms": ms(), "fast_path": False,
                    "wave5_cc": _wave5_cc_candidates, "kb_ctx": bool(kb_ctx),
                    "reply_all_detail": {
                        "reply_all": rab.get("reply_all", reply_all_ok),
                        "use_cc": rab.get("use_cc", use_cc),
                        "reason": rab.get("reason", ""),
                    }
                    })
            return result
        if not HAS_GMAIL:
            result = add_to_result(email, {"action": "skip", "reason": "no_gmail",
                    "elapsed_ms": ms(), "fast_path": False})
            return result

        cc_part = f", {use_cc}" if reply_all_ok and use_cc else ""
        all_rcp = f"{sender}{cc_part}"
        subj_rep= f"Re: {subj}" if not subj.lower().startswith("re:") else subj
        res = gmail_send_reply_fixed(tid, subj_rep, body, all_rcp)

        # R2: dedup tracking — record successful send
        _record_send(tid, "send")

        self.stats["reply_all_total"] += 1
        if reply_all_ok:
            self.stats["reply_all_enforced"] += 1
        else:
            self.stats["reply_all_missed"] += 1
        _log_template_quality(intent_cat, lang, tpl_body, qc["overall_score"],
                              _fast_grammar_check(body)[0], sender)
        result = add_to_result(email, {"action": "send", "intent": intent_label,
                "reply_all": reply_all_ok, "tone": tone_data,
                "quality": qc, "elapsed_ms": ms(), "fast_path": False,
                "wave5_cc": _wave5_cc_candidates, "kb_ctx": bool(kb_ctx)})
        return result

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
            f"⚡ V29 Intelligent Cascading Latency — run {RUN_ID}",
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
        if self.stats.get('action_escalated', 0) > 0:
            lines.append(f"🔥 Escalated  : {self.stats['action_escalated']}")
        if self.stats.get('action_financial', 0) > 0:
            lines.append(f"💰 Financial  : {self.stats['action_financial']}")
        if self.stats.get('action_meeting', 0) > 0:
            lines.append(f"📅 Meetings   : {self.stats['action_meeting']}")
        if avg_full > 0:
            lines.append(f"⚡ Latency gain vs full: ~{max(1, round(avg_full / max(avg_fast, 1))):.0f}x faster")
        lines = [l for l in lines if l]
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
        _maybe_audit()
        return summary


# ═══════════════════════════════════════════════════════════════
#  ENTRY POINT
# ═══════════════════════════════════════════════════════════════

RUN_ID = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%S")

if __name__ == "__main__":
    import argparse
    ap = argparse.ArgumentParser(description="V29 Intelligent Cascading Latency Email Responder")
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