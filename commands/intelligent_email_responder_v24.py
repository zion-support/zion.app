#!/usr/bin/env python3
"""
╔══════════════════════════════════════════════════════════════════════════╗
║          V24 — Unified Intelligent Email Responder                       ║
║                                                                          ║
║  One email → one intelligent decision.                                   ║
║                                                                          ║
║  Pipeline (14 steps):                                                    ║
║  ① Log & clock in         ② Basic V10 analysis                         ║
║  ③ Adaptive tone          ④ Sender profile                             ║
║  ⑤ Contextual memory      ⑥ Auto-categorizer                           ║
║  ⑦ Intent confidence      ⑧ Action-item extractor                      ║
║  ⑨ Follow-up schedule     ⑩ Reply-all decision                         ║
║  ⑪ Template match         ⑫ Compose response                           ║
║  ⑬ Quality check gate     ⑭ Send + outcome log                         ║
║                                                                          ║
║  9 intelligence modules active per run:                                 ║
║   EnhancedReplyAllHandler · ResponseOutcomeAnalyzer · MLTemplateOptimizer ║
║   SenderProfileLearner · ContextualMemoryBank · IntentConfidenceScorer   ║
║   AutoCategorizer · SmartFollowUpScheduler · ActionItemExtractor         ║
║   ResponseQualityChecker · AdaptiveToneMatcher                           ║
╚══════════════════════════════════════════════════════════════════════════╝
"""

import json, re, sys, time
from pathlib import Path
from datetime import datetime, timezone
from collections import defaultdict

WORKSPACE  = Path(__file__).resolve().parent.parent.parent
COMMANDS   = WORKSPACE / 'commands'
DATA       = WORKSPACE / 'data'
V24_LOG    = DATA / 'v24_run_log.jsonl'
V24_STATS  = DATA / 'v24_stats.jsonl'
LABEL_SEEN = set()

sys.path.insert(0, str(COMMANDS))

# ─── Gmail / Telegram ──────────────────────────────────────────
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


# ─── V21 Core ──────────────────────────────────────────────────
try:
    from ml_template_optimizer import MLTemplateOptimizerV21
    from predictive_timer        import PredictiveTimerV21
except Exception:
    MLTemplateOptimizerV21 = None
    PredictiveTimerV21      = None

# ── reply-all + outcome tracker ──────────────────────────────────────────────


# ─── V22 Augmentations ─────────────────────────────────────────
from enhanced_reply_all_handler import EnhancedReplyAllHandlerV22
from response_outcome_analyzer  import ResponseOutcomeAnalyzerV22

# ─── V23 Intelligence ──────────────────────────────────────────
from sender_profile_learner   import SenderProfileLearnerV23
from contextual_memory_bank   import ContextualMemoryBankV23
from intent_confidence_scorer import IntentConfidenceScorerV23
from response_quality_checker import ResponseQualityCheckerV23
from auto_categorizer         import AutoCategorizerV23
from smart_followup_scheduler import SmartFollowUpSchedulerV23
from action_item_extractor    import ActionItemExtractorV23

# ─── Adaptive Tone Matcher ──────────────────────────────────────
from adaptive_tone_matcher import analyze_tone, generate_adapted_response


# ═══════════════════════════════════════════════════════════════
#  TEMPLATE LIBRARY
# ═══════════════════════════════════════════════════════════════
TEMPLATES = {

    "pt": {
        "booking": (
            "Olá {name}!\n\n"
            "Tudo bem? Estou ciente da sua reserva e irei confirmar os detalhes com você em instantes.\n\n"
            "Por favor, poderia me confirmar:\n"
            "• Data de entrada e saída\n"
            "• Quantidade de hóspedes\n\n"
            "Assim que tiver essas informações, envio a confirmação completa.\n\n"
            "{close}\n{signature}"
        ),
        "sales": (
            "Olá {name}!\n\n"
            "Obrigado pelo seu interesse. Vou analisar a sua solicitação e elaborar uma proposta personalizada.\n\n"
            "Você gostaria de agendar uma chamada rápida de 15 minutos esta semana para conversarmos melhor?\n\n"
            "{close}\n{signature}"
        ),
        "support_issue": (
            "Olá {name}!\n\n"
            "Recebi sua mensagem e estou verificando o problema relatado. Vou acompanhar pessoalmente e retorno com uma atualização em breve.\n\n"
            "Se houver erros ou mensagens de sistema que possam ajudar, é só compartilhar.\n\n"
            "{close}\n{signature}"
        ),
        "follow_up": (
            "Olá {name}!\n\n"
            "Aproveitando para acompanhar sobre o assunto que falamos anteriormente. Tivemos alguma novidade?\n\n"
            "Se ainda estiver interessado, posso ajudar com os próximos passos.\n\n"
            "{close}\n{signature}"
        ),
        "cancellation": (
            "Olá {name}!\n\n"
            "Lamento que as coisas não tenham funcionado como esperado. Fico à disposição para entender melhor e melhorar nossa experiência futura.\n\n"
            "{close}\n{signature}"
        ),
        "partnership": (
            "Olá {name}!\n\n"
            "Excelente iniciativa! Estou muito interessado em explorar essa parceria. Vamos agendar uma conversa para alinhar as expectativas?\n\n"
            "{close}\n{signature}"
        ),
        "urgent": (
            "⚠️  Olá {name}!\n\n"
            "Sua mensagem recebeu prioridade máxima. Estou pessoalmente encarregado deste caso e estou tratando com a máxima agilidade.\n\n"
            "Retorno o mais breve possível, mas se precisar de algo urgente enquanto isso, entre em contato diretamente.\n\n"
            "{close}\n{signature}"
        ),
        "general": (
            "Olá {name}!\n\n"
            "Obrigado pelo seu contato. Recebi sua mensagem e vou responder com os detalhes em breve.\n\n"
            "Se houver qualquer informação adicional que possa ajudar, é só avisar.\n\n"
            "{close}\n{signature}"
        ),
    },
    "en": {
        "booking": (
            "Hi {name}!\n\n"
            "I'm on it — let me confirm the booking details with you shortly.\n\n"
            "Could you please share:\n"
            "• Check-in and check-out dates\n"
            "• Number of guests\n\n"
            "I'll send the full confirmation once I have that.\n\n"
            "{close}\n{signature}"
        ),
        "sales": (
            "Hi {name}!\n\n"
            "Thanks for reaching out. I'll review your inquiry and prepare a tailored proposal.\n\n"
            "Would you be open to a quick 15-minute call this week to discuss further?\n\n"
            "{close}\n{signature}"
        ),
        "support_issue": (
            "Hi {name}!\n\n"
            "Got your message — I'm investigating the issue you reported and will follow up with you shortly with an update.\n\n"
            "If there are any error messages or screenshots that could help, feel free to share.\n\n"
            "{close}\n{signature}"
        ),
        "follow_up": (
            "Hi {name}!\n\n"
            "Quick follow-up on our last conversation. Do you have any updates on your end?\n\n"
            "I'm still here to help with whatever you need.\n\n"
            "{close}\n{signature}"
        ),
        "cancellation": (
            "Hi {name}!\n\n"
            "I'm sorry it didn't work out as you hoped. I'd appreciate any feedback you have — we're always looking to improve.\n\n"
            "{close}\n{signature}"
        ),
        "partnership": (
            "Hi {name}!\n\n"
            "This is exciting — I'm very interested in exploring this partnership. Let's set up a time to align on expectations.\n\n"
            "{close}\n{signature}"
        ),
        "urgent": (
            "⚠️  Hi {name}!\n\n"
            "This has been flagged as urgent. I've personally picked this up and I'm moving fast.\n\n"
            "I'll get back to you immediately, but if you need me right now, feel free to reach out directly.\n\n"
            "{close}\n{signature}"
        ),
        "general": (
            "Hi {name}!\n\n"
            "Thanks for reaching out. I've received your message and I'll get back to you with details shortly.\n\n"
            "If there's anything else you can share in the meantime, I'm all ears.\n\n"
            "{close}\n{signature}"
        ),
    },
}

INTENT_MAP = {
    "booking": "booking", "sales": "sales", "support": "support_issue",
    "urgent": "urgent", "cancellation": "cancellation",
    "partnership": "partnership", "follow_up": "follow_up",
    "general": "general",
}


# ═══════════════════════════════════════════════════════════════
#  LOGGING HELPERS
# ═══════════════════════════════════════════════════════════════
def log_event(record: dict):
    try:
        with open(V24_LOG, "a") as f:
            f.write(json.dumps(record, ensure_ascii=False) + "\n")
    except Exception:
        pass

RUN_ID = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%S")


# ═══════════════════════════════════════════════════════════════
#  HELPER: extract clean sender name from email header
# ═══════════════════════════════════════════════════════════════
def get_name(sender: str) -> str:
    m = re.match(r'"([^"]+)"\s*<', sender)
    if m: return m.group(1).strip()
    m = re.match(r'([^<]+)<', sender)
    if m: return m.group(1).strip()
    return sender.split('@')[0] if '@' in sender else sender[:30]


def detect_language(text: str) -> str:
    pt_hits = re.findall(r'[ãõçêéíóúàâô]|\bnão\b|\bvocê\b|\bobrigad|\bsenhor\b'
                         r'|\bprezad|\bsolicita\b|\bretorno\b|\bdisponibilidad\b', text, re.I)
    return "pt" if len(pt_hits) >= 2 else "en"


# ═══════════════════════════════════════════════════════════════
#  MAIN PIPELINE
# ═══════════════════════════════════════════════════════════════
class V24Responder:
    """Full intelligence pipeline — one instance, one thread per email."""

    def __init__(self):
        # V22 / ML
        self.optimizer   = MLTemplateOptimizerV21()
        self.timer       = PredictiveTimerV21()
        self.reply_all  = EnhancedReplyAllHandlerV22()
        self.outcome    = ResponseOutcomeAnalyzerV22()

        # V23
        self.sender_learner = SenderProfileLearnerV23()
        self.memory_bank   = ContextualMemoryBankV23()
        self.intent_scorer = IntentConfidenceScorerV23()
        self.categorizer   = AutoCategorizerV23()
        self.followup_sched= SmartFollowUpSchedulerV23()
        self.action_extr   = ActionItemExtractorV23()
        self.quality_chk   = ResponseQualityCheckerV23()

        # Pre-trained ML weights
        self.ml_weights = self.optimizer.train_from_outcomes()

        # Runtime stats
        self.stats = defaultdict(int)

    # ── Main loop ──────────────────────────────────────────────
    def process_batch(self, limit: int = 20, dry_run: bool = False) -> dict:
        run_start = datetime.now(timezone.utc).isoformat()
        log_event({"run_id": RUN_ID, "phase": "start", "ts": run_start,
                   "dry_run": dry_run, "limit": limit,
                   "gmail": HAS_GMAIL})

        raw: list[dict] = []

        if not HAS_GMAIL and not dry_run:
            telegram_send("⚠️  [V24] Gmail unavailable — skipping this run.")
            return self._finalise(run_start)

        # ── Dry-run stub injection ───────────────────────────────
        if dry_run:
            pool = [
                {"id": "dr-1", "thread_id": "dr-1", "sender": "Alice <alice@example.com>",
                 "subject": "Urgent: Server outage", "snippet": "Production is down, need help!",
                 "cc": ""},
                {"id": "dr-2", "thread_id": "dr-2", "sender": "Bob <bob@partner.com>",
                 "subject": "Partnership proposal", "snippet": "Let's explore a strategic partnership.",
                 "cc": ""},
                {"id": "dr-3", "thread_id": "dr-3", "sender": "Carla <carla@client.com>",
                 "subject": "Support: Cannot login", "snippet": "Getting error 500 on login page.",
                 "cc": ""},
            ]
            print("🧪 [V24] Injecting 3 dry-run stub emails → pool (Gmail bypassed)")
        else:
            # Fetch from Gmail
            raw = gmail_search("is:unread", limit=limit * 2)
            if not raw:
                telegram_send("📭 [V24] No unread emails.")
                return self._finalise(run_start)

            # Build enriched email records
            for msg in raw:
                try:
                    f = gmail_get(msg["id"])
                    hdrs = {h["name"]: h["value"] for h in f.get("payload", {}).get("headers", [])}
                    pool.append({
                        "id":        msg["id"],
                        "thread_id": f.get("threadId", msg["id"]),
                        "sender":    hdrs.get("From", ""),
                        "subject":   hdrs.get("Subject", ""),
                        "snippet":   f.get("snippet", ""),
                        "cc":        next((h["value"] for h in f.get("payload", {}).get("headers", [])
                                           if h["name"].lower() == "cc"), ""),
                    })
                except Exception as ex:
                    log_event({"run_id": RUN_ID, "phase": "fetch_error",
                               "msg_id": msg.get("id"), "err": str(ex)})
                    self.stats["errors_fetch"] += 1

        # Sort: forward first, then critical → high → medium → low
        def sort_key(e):
            subj = e["subject"].lower()
            return (0 if "fwd:" in subj else 1,
                    0 if e["id"] in self.stats else 1, 0)
        pool.sort(key=sort_key)

        # ── Per-email pipeline ──────────────────────────────────
        for email in pool[:limit]:
            self.stats["processed"] += 1
            result = self._pipeline(email, dry_run)
            log_event({"run_id": RUN_ID, "phase": "pipeline_done",
                       "thread_id": email["thread_id"], **result})
            if result.get("action") not in ("skip",):
                self.stats[f"action_{result.get('action', 'unknown')}"] += 1

        return self._finalise(run_start)

    def _pipeline(self, email: dict, dry_run: bool) -> dict:
        t0   = time.monotonic()
        ee   = email["id"]
        tid  = email["thread_id"]
        subj = email["subject"]
        snip = email["snippet"]
        sender = email["sender"]
        name   = get_name(sender)
        lang   = detect_language(f"{subj} {snip}")
        ms     = round((time.monotonic() - t0) * 1000, 1)

        # ── ① Tone ────────────────────────────────────────────
        tone_data = analyze_email_tone({'subject': subj, 'body': '', 'snippet': snip})

        # ── ② Sender profile ──────────────────────────────────
        profile = self.sender_learner.learn_from_email(sender, subj, snip, email)

        # Trust profile language over keyword heuristic
        profile_lang = profile.get("language", "")
        if profile_lang in ("pt", "en"):
            lang = profile_lang

        # Trust profile formality over default neutral
        if profile.get("formality", "neutral") != "neutral":
            tone_data["formality"] = profile["formality"]

        # ── ③ Context ─────────────────────────────────────────
        profile = self.memory_bank.get_sender_context(sender)
        members = [sender] + profile.get('related_contacts', [])
        self.memory_bank.store_memory(tid, sender, subj, snip)

        # ── ④ Auto-categorize ─────────────────────────────────
        cat = self.categorizer.categorize(email)
        if cat.get("auto_archive"):
            if not dry_run:
                lab = gmail_get_or_create_label_id("Auto-Archive/V24")
                gmail_batch_modify({"ids": [eid for eid in
                    gmail_search(f"thread:{tid}", 1) if True]},
                    removeLabelIds=["UNREAD"], addLabelIds=[lab])
            return {"action": "archive", "category": cat["category"],
                    "elapsed_ms": ms}

        # ── ⑤ Intent + confidence ─────────────────────────────
        intent_raw = self.intent_scorer.score(sender, subj, snip, tid)
        if intent_raw.get("confidence_level") == "low":
            return {"action": "review", "reason": "low_intent_confidence",
                    "intent": intent_raw, "tone": tone_data, "elapsed_ms": ms}

        intent_label = intent_raw.get("categories", ["general"])[0]
        urgency_val  = intent_raw.get("intent_details", {}).get("urgency", 3)
        intent_cat   = INTENT_MAP.get(intent_label, "general")

        # ── ⑥ Action items ────────────────────────────────────
        actions = self.action_extr.extract(subj, snip, sender, tid)

        # ── ⑦ Follow-up ───────────────────────────────────────
        self.followup_sched.schedule_followup(tid, sender, intent_label, urgency_val)

        # ── ⑧ Reply-all decision ──────────────────────────────
        reply_all_dec = self.reply_all.decide(email, thread_participants=members)
        reply_all_ok  = reply_all_dec.get("reply_all", False)
        use_cc        = reply_all_dec.get("use_cc", "")

        # ── ⑾ Email-decision layer (heuristic + LLM) ─────────────
        try:
            from email_decision import from_email_data, decide_reply_all
            ed = from_email_data(email)
            ra_decision = decide_reply_all(ed)
            merged = reply_all_ok or ra_decision.get("reply_all", False)
            if ra_decision.get("use_cc"):
                use_cc = ra_decision["use_cc"]
            reply_all_ok = merged
            print(f"  🔗 2-layer: eh={reply_all_dec.get('reply_all')} em={ra_decision.get('reply_all')} → {reply_all_ok}")
        except Exception as _ex:
            log_event({"run_id": RUN_ID, "phase": "reply_all_decision_err", "err": str(_ex)})

        # ── ⑨ Template selection ──────────────────────────────
        tpl_body = TEMPLATES.get(lang, TEMPLATES["en"]).get(
            intent_cat, TEMPLATES["en"]["general"])

        # ── ⑩ Compose response ────────────────────────────────
        adapted = generate_adapted_response(name, intent_label, tone_data)
        body = f"{adapted}\n\n{tpl_body.format(name=name, close='—', signature='')}"

        # ── ⑪ Quality gate ────────────────────────────────────
        qc = self.quality_chk.check_response(body, {"intent": intent_label},
                                              sender_profile=profile)
        if not qc.get("passed", True):
            return {"action": "review", "reason": "quality_failed",
                    "quality": qc, "tone": tone_data, "elapsed_ms": ms}

        # ── ⑫ Send ────────────────────────────────────────────
        if dry_run:
            self.stats["would_send"] += 1
            return {"action": "send_dry", "intent": intent_label,
                    "reply_all": reply_all_ok, "tone": tone_data,
                    "quality": qc, "elapsed_ms": ms}

        if not HAS_GMAIL:
            return {"action": "skip", "reason": "no_gmail", "elapsed_ms": ms}

        cc_part = f", {use_cc}" if reply_all_ok and use_cc else ""
        all_rcp = f"{sender}{cc_part}"
        subj_rep = f"Re: {subj}" if not subj.lower().startswith("re:") else subj
        res = gmail_send_reply_fixed(tid, subj_rep, body, all_rcp)

        if res.get("success"):
            self.stats["sent"] += 1
            self.outcome.record_sent(tid, ee, f"tpl/{lang}/{intent_cat}",
                                     intent_label, tone_data["response_tone"],
                                     all_rcp, body)
            lab_done = gmail_get_or_create_label_id("V24-Replied")
            gmail_batch_modify({"ids": [tid]},
                               removeLabelIds=["UNREAD"],
                               addLabelIds=[lab_done])
        else:
            self.stats["send_failed"] += 1

        return {"action": "send", "intent": intent_label,
                "reply_all": reply_all_ok, "tone": tone_data,
                "quality": qc, "elapsed_ms": ms}

    # ── Finalise & report ──────────────────────────────────────
    def _finalise(self, run_start: str) -> dict:
        elapsed = round((datetime.now(timezone.utc) -
                         datetime.fromisoformat(run_start)).total_seconds(), 1)
        pending = self.outcome.get_pending() if HAS_GMAIL else []
        summary = {
            "run_id":     RUN_ID,
            "ts_start":   run_start,
            "ts_end":     datetime.now(timezone.utc).isoformat(),
            "elapsed_s":  elapsed,
            **dict(self.stats),
            "pending_outcomes": len(pending),
        }
        try:
            with open(V24_STATS, "a") as f:
                f.write(json.dumps(summary) + "\n")
        except Exception:
            pass

        lines = [
            f"🧠 V24 Email Responder — run {RUN_ID}",
            f"⏱  {elapsed}s",
            f"📨 Processed : {self.stats['processed']}",
            f"📤 Sent      : {self.stats['sent']}",
            f"📋 Would-send: {self.stats.get('would_send', 0)}",
            f"📦 Auto-arch : {self.stats['action_archive']}",
            f"👁  Review    : {self.stats['action_review']}",
            f"⏳ Pending    : {len(pending)}",
            f"❌ Errors    : {self.stats['errors_fetch']}",
        ]
        report = "\n".join(lines)
        print(report)
        if HAS_GMAIL:
            telegram_send(report)
        return summary


# ═══════════════════════════════════════════════════════════════
#  CLI ENTRY POINT
# ═══════════════════════════════════════════════════════════════
if __name__ == "__main__":
    import argparse
    ap = argparse.ArgumentParser(description="V24 Intelligent Email Responder")
    ap.add_argument("--execute",  "-e", action="store_true",
                    help="Actually send emails (default: dry-run)")
    ap.add_argument("--limit",    "-n", type=int, default=20,
                    help="Max emails per run (default: 20)")
    ap.add_argument("--dry-run",  "-d", action="store_true",
                    help="Explicitly force dry-run mode")
    args = ap.parse_args()

    dry = not args.execute or args.dry_run
    if dry:
        print("🧪 DRY-RUN — no emails will be sent.")

    V24Responder().process_batch(limit=args.limit, dry_run=dry)
