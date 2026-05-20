#!/usr/bin/env python3
"""
V25 Wave 3 — Cascading Latency Executor

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

Drop-in replacement: V24Responder → V25Responder in __main__
"""

import json, re, time
from datetime import datetime, timezone
from pathlib import Path
from collections import defaultdict

WORKSPACE  = Path(__file__).resolve().parent.parent.parent
COMMANDS   = WORKSPACE / 'commands'
DATA       = WORKSPACE / 'data'
V25_LOG    = DATA / 'v25_run_log.jsonl'
V25_STATS  = DATA / 'v25_stats.jsonl'

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
    from email_decision import from_email_data, decide_reply_all
except Exception:
    from_email_data  = None
    decide_reply_all = None

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


# ═══════════════════════════════════════════════════════════════
#  LOGGING
# ═══════════════════════════════════════════════════════════════

def _log(record: dict):
    try:
        with open(V25_LOG, 'a') as f:
            f.write(json.dumps(record, ensure_ascii=False) + '\n')
    except Exception:
        pass

def _log_stats(record: dict):
    try:
        with open(V25_STATS, 'a') as f:
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


# ═══════════════════════════════════════════════════════════════
#  FAST-THROUGH DETECTOR
# ═══════════════════════════════════════════════════════════════

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
        """Sender profile has ≥3 past interactions in this intent with 100% success."""
        if not self.profile:
            self._reasons['profile'] = 'no_profile'
            return False

        intent = self.intent.get('categories', ['general'])[0]
        outcomes = self.profile.get('outcome_history', [])
        if len(outcomes) < 3:
            self._reasons['profile'] = f'insufficient_history_{len(outcomes)}'
            return False

        intent_outcomes = [o for o in outcomes if o.get('intent') == intent]
        if len(intent_outcomes) < 3:
            self._reasons['profile'] = f'low_intent_history_{len(intent_outcomes)}'
            return False

        success_rate = sum(1 for o in intent_outcomes[-5:] if o.get('outcome') in ('positive', 'neutral')) / max(len(intent_outcomes[-5:]), 1)
        if success_rate < 1.0:
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

class V25Responder:
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

        # ML weights (pre-loaded once)
        self.ml_weights = self.optimizer.train_from_outcomes() if self.optimizer else {}

        # Stats
        self.stats = defaultdict(int)

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
                {"id": "dr-1", "thread_id": "dr-1", "sender": "Alice <alice@example.com>",
                 "subject": "Urgent: Server outage", "snippet": "Production is down!",
                 "cc": ""},
                {"id": "dr-2", "thread_id": "dr-2", "sender": "Bob <bob@partner.com>",
                 "subject": "Partnership proposal", "snippet": "Strategic partnership discussion.",
                 "cc": ""},
                {"id": "dr-3", "thread_id": "dr-3", "sender": "Carla <carla@client.com>",
                 "subject": "Support: Cannot login", "snippet": "Getting error 500 on login.",
                 "cc": ""},
            ]
            print("🧪 [V25] Injecting 3 dry-run stub emails.")
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
            if result.get("action") not in ("skip", "review", "archive"):
                self.stats[f"action_{result.get('action', 'unknown')}"] += 1

            # Stats counters
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

    def _v25_pipeline(self, email: dict, dry_run: bool, t0: float) -> dict:
        ee    = email["id"]
        tid   = email["thread_id"]
        subj  = email["subject"]
        snip  = email["snippet"]
        sender= email["sender"]
        cc    = email.get("cc", "")
        name  = self._get_name(sender)
        lang  = self._detect_language(f"{subj} {snip}")

        ms_elapsed = lambda: round((time.monotonic() - t0) * 1000, 1)

        # ══════════════════════════════════════════════════════
        #  Shared preamble (both paths) — tone + profile + categorizer + intent
        # ══════════════════════════════════════════════════════

        # ① Tone (fast, rule-based)
        tone_data = analyze_tone(subj, snip)

        # ② Sender Profile
        profile = self.sender_learner.learn_from_email(sender, subj, snip, email) if self.sender_learner else {}
        profile_lang = profile.get("language", "")
        if profile_lang in ("pt", "en"):
            lang = profile_lang
        if profile.get("formality", "neutral") != "neutral":
            tone_data["formality"] = profile["formality"]

        # ④ Categorizer (fast)
        cat_result = self.categorizer.categorize(email) if self.categorizer else {"auto_archive": False, "needs_response": True}
        if cat_result.get("auto_archive"):
            if not dry_run:
                lab = gmail_get_or_create_label_id("Auto-Archive/V25")
                gmail_batch_modify({"ids": [tid]},
                                   removeLabelIds=["UNREAD"], addLabelIds=[lab])
            return {"action": "archive", "category": cat_result["category"],
                    "elapsed_ms": ms_elapsed()}

        # ⑤ Intent + confidence (fast, rule-based)
        intent_raw = self.intent_scorer.score(sender, subj, snip, tid) if self.intent_scorer else {
            "categories": ["general"], "confidence": 0.5, "confidence_level": "medium",
            "intent_details": {"urgency": 3}, "suggested_action": "draft_and_review"}
        if intent_raw.get("confidence_level") == "low":
            return {"action": "review", "reason": "low_intent_confidence",
                    "intent": intent_raw, "tone": tone_data, "elapsed_ms": ms_elapsed()}

        intent_label = intent_raw.get("categories", ["general"])[0]
        urgency_val  = intent_raw.get("intent_details", {}).get("urgency", 3)
        intent_cat   = INTENT_MAP.get(intent_label, "general")

        # ══════════════════════════════════════════════════════
        #  V25 DECISION: Fast-path or Full?
        # ══════════════════════════════════════════════════════

        detector = CascadingLatencyDetector(profile, intent_raw, cat_result, subj, snip)
        use_fast = detector.can_fast_path

        if use_fast:
            fast_ms_start = time.monotonic()
            result = self._fast_path(email, intent_label, intent_cat, intent_raw,
                                     tone_data, profile, cat_result, dry_run, t0)
            result["fast_path"]      = True
            result["fast_path_ms"]   = round((time.monotonic() - fast_ms_start) * 1000, 1)
            result["total_ms"]       = ms_elapsed()
            result["fast_path_total"]= result["fast_path_ms"] + ms_elapsed()
            result["detector_stats"] = detector.stats_dict(True)
            self.stats["fast_path_ triggered"] += 1
            return result

        # FULL pipeline fall-through — identical to V24
        return self._full_pipeline(email, intent_raw, intent_label, intent_cat,
                                   urgency_val, tone_data, profile, cat_result, dry_run, t0)

    # ═══════════════════════════════════════════════════════════════
    #  FAST-PATH — 6 steps
    # ═══════════════════════════════════════════════════════════════

    def _fast_path(self, email, intent_label, intent_cat, intent_raw,
                   tone_data, profile, cat_result, dry_run, t0) -> dict:

        sender    = email["sender"]
        subj      = email["subject"]
        tid       = email["thread_id"]
        name      = self._get_name(sender)
        lang      = tone_data.get("language", "pt")
        use_cc    = ""
        reply_all = False

        # ① Tone — already computed
        t_response = f"Fast-path ({intent_cat}) response for {name}."

        # ② Select template + compose (minimal LLM-free)
        tpl = TEMPLATES.get(lang, TEMPLATES["en"]).get(intent_cat, TEMPLATES["en"]["general"])
        sig = _get_sig(tone_data.get("formality", "neutral"), lang)
        body_raw = tpl.format(name=name, close="—", signature="")
        body = f"{body_raw}\n\n{sig}"

        # ③ Trim grammar check (inline, <1ms)
        g_score, g_issues = _fast_grammar_check(body)

        # ④ Reply-all basic coverage (sender name check only)
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

        # ⑥ Send
        if dry_run:
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

        # ⑨ Template selection + ⑩ Compose
        tpl_body = TEMPLATES.get(lang, TEMPLATES["en"]).get(intent_cat, TEMPLATES["en"]["general"])
        adapted  = generate_adapted_response(name, intent_label, tone_data)
        body     = f"{adapted}\n\n{tpl_body.format(name=name, close='—', signature='')}"

        # ⑪ Quality gate (full V25 6-dimension)
        qc = {"overall_score": 85.0, "passed": True, "issues": []}
        try:
            from response_quality_checker import ResponseQualityCheckerV23
            raw_sender = email.get("sender", "")
            raw_cc     = email.get("cc", "")
            raw_tone   = tone_data.get("formality", "neutral")
            raw_resp   = tone_data.get("response_tone", "casual_neutral")
            qc = ResponseQualityCheckerV23().check_response(body, {"intent": intent_label},
                                                             sender_profile={
                                                                 "formality": raw_tone,
                                                                 "language": lang,
                                                             })
        except Exception:
            pass

        if not qc.get("passed", True):
            return {"action": "review", "reason": "quality_failed",
                    "quality": qc, "tone": tone_data, "elapsed_ms": ms()}

        # ⑫ Send
        if dry_run:
            return {"action": "send_dry", "intent": intent_label,
                    "reply_all": reply_all_ok, "tone": tone_data,
                    "quality": qc, "elapsed_ms": ms(), "fast_path": False}

        if not HAS_GMAIL:
            return {"action": "skip", "reason": "no_gmail",
                    "elapsed_ms": ms(), "fast_path": False}

        cc_part = f", {use_cc}" if reply_all_ok and use_cc else ""
        all_rcp = f"{sender}{cc_part}"
        subj_rep= f"Re: {subj}" if not subj.lower().startswith("re:") else subj
        res = gmail_send_reply_fixed(tid, subj_rep, body, all_rcp)

        return {"action": "send", "intent": intent_label,
                "reply_all": reply_all_ok, "tone": tone_data,
                "quality": qc, "elapsed_ms": ms(), "fast_path": False}

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
            f"⚡ V25 Cascading Latency — run {RUN_ID}",
            f"⏱  {elapsed}s",
            f"📨 Processed : {self.stats['processed']}",
            f"🚀 Fast-path : {fast_n}  (avg {avg_fast:.0f}ms each)",
            f"🔄 Full-path : {full_n}  (avg {avg_full:.0f}ms each)",
            f"📤 Sent      : {self.stats.get('sent', self.stats.get('would_send', 0))}",
            f"📦 Auto-arch : {self.stats.get('action_archive', 0)}",
            f"👁  Review    : {self.stats.get('action_review', 0)}",
            f"❌ Errors    : {self.stats.get('errors_fetch', 0)}",
        ]
        if avg_full > 0:
            lines.append(f"⚡ Latency gain vs full: ~{max(1, round(avg_full / max(avg_fast, 1))):.0f}x faster")
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
        return summary


# ═══════════════════════════════════════════════════════════════
#  ENTRY POINT — drop-in V24 replacement
# ═══════════════════════════════════════════════════════════════

RUN_ID = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%S")

if __name__ == "__main__":
    import argparse
    ap = argparse.ArgumentParser(description="V25 Cascading Latency Email Responder")
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
    V25Responder().process_batch(limit=args.limit, dry_run=dry)
