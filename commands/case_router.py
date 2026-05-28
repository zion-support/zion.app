from __future__ import annotations
from typing import Optional, Union
"""
CaseRouter — V30 Intelligence Layer

Per-email routing decision engine. Runs BEFORE the pipeline split
(fast-path vs full). Uses multi-signal fusion to pick the optimal
action for each email: escalate / fast / full / review / auto_ack.

Signal inputs (all optional — router degrades gracefully):
  - intent_label / intent_cat / intent_raw (from IntentConfidenceScorer)
  - urgency_val (0-1, numeric)
  - tone_data (formality, language, polarity score)
  - profile (SenderProfileLearner: history, outcomes, confidence)
  - fin_result (financial_email_handler classification)
  - email dict (subject, snippet, sender, cc, attachments)

Decision output:
  dict with:
    route        — "escalate" | "full_pipeline" | "fast_path" | "review" | "auto_ack"
    reason       — human-readable explanation of decision
    signals_active — list of signals that triggered this route
    confidence   — 0-1 confidence in the routing decision itself
"""

import json, re
from pathlib import Path
from datetime import datetime, timezone

WORKSPACE = Path(__file__).resolve().parent.parent.parent
DATA      = WORKSPACE / 'data'
ROUTER_LOG= DATA / 'case_router_log.jsonl'

# ── Known VIP senders (configurable via data file) ─────────────
_VIP_SENDERS: set[str] = set()

def _load_vip_senders() -> set[str]:
    """Load VIP sender emails from data/vip_senders.json if present."""
    p = DATA / 'vip_senders.json'
    if p.exists():
        try:
            data = json.loads(p.read_text())
            return {e.lower() for e in data.get("emails", [])}
        except Exception:
            pass
    # Built-in defaults
    return {
        'kleber@ziontechgroup.com',
        'kleber@zion.app',
        'klebergarciaalcatrao@gmail.com',
    }

_VIP_SENDERS = _load_vip_senders()

# ── Financial type action profiles ─────────────────────────────
_FIN_ACTIONS = {
    "payment_received": ("fast_path_ack", "payment auto-ack; invoice may need follow-up"),
    "invoice_received": ("full_pipeline",      "invoice needs proper handling + reply"),
    "fraud_alert":      ("escalate",            "financial fraud alert — human review required"),
    "refund_request":   ("full_pipeline",      "refund requires policy lookup + care"),
    "wire_transfer":    ("full_pipeline",      "large transaction requires human verification"),
    "unknown":          ("fast_path",          "financial type unclear — keep safe"),
}

# ── Bypass patterns: intent + profile paired outcome results ─────
_PRIORITY_INTENT_PAIRS = {"urgent", "billing", "legal", "outage"}
_PROMOTE_FULL_URGENT_CATS = {"booking", "sales", "invoice"}

# ── Thresholds ─────────────────────────────────────────────────
_URGENT_THRESHOLD      = 0.75   # absolute urgency (0-1 scale)
_POSITIVE_OUTCOME_HISTORY = 3   # consecutive NG outcomes needed for full-pipeline
_NEG_IMPACT_HISTORY   = 2      # consecutive negative outcomes -> review first
_GRAMMAR_QUALITY_CUT  = 55.0   # below this -> review

# ── Suspicion signal triggers ─────────────────────────────────
_SUSPICIOUS_PATTERNS = [
    re.compile(r'\b(wire transfer|swift|new (bank )?details|urgent payment|last chance|act now)\b', re.I),
    re.compile(r'\b(lawsuit|legal action|attorney|court|sue\b|sued\b)', re.I),
    re.compile(r'\b(bitcoin|crypto|usdt|usdc|wallet address)\b', re.I),
    re.compile(r'\b(password|credentials|login|bank account)\s+(change|update|reset|transfer)\b', re.I),
    re.compile(r'\b\$[\d,]{4,}\b'),  # ≥$1,000
]

# ── Reply-all auto-ack bypass list ─────────────────────────────
_ACK_CC_OK = {"employee-newsletter@", "noreply@", "newsletter@", "no-reply@"}
_PARTNER_DOMAINS = {"zendesk.com", "salesforce.com", "hubspot.com", "freshdesk.com", "intercom.io"}


# ─── CaseRouter ───────────────────────────────────────────────

class CaseRouter:
    """Router: sends each email through a priority decision tree,
    returning the recommended action with rationale.

    Usage:
        router = CaseRouter()
        result = router.route(email, intent_raw, intent_label, intent_cat,
                             urgency_val, tone_data, profile, fin_result)
    """

    def __init__(self, log_path: Union[str, Optional][Path] = None):
        self.log_path = Path(log_path) if log_path else ROUTER_LOG

    # ── Public entry ──────────────────────────────────────────

    def route(self,
              email: dict,
              intent_raw: Optional[dict] = None,
              intent_label: str = "unknown",
              intent_cat: str = "general",
              urgency_val: float = 0.0,
              tone_data: Optional[dict] = None,
              profile: Optional[dict] = None,
              fin_result: Optional[dict] = None,
              grammar_score: Optional[float] = None,) -> dict:

        signals : list[str] = []
        tone_data = tone_data or {}
        profile   = profile   or {}
        intent_raw = intent_raw or {}

        sender = email.get("sender", "")
        subj   = email.get("subject", "")
        snip   = email.get("snippet", "")
        cc     = email.get("cc", "")
        has_att = bool(email.get("has_attachments", False))

        route, reason = self._decide(
            sender, subj, snip, cc, has_att,
            intent_label, intent_cat, urgency_val,
            tone_data, profile, fin_result, grammar_score)
        confidence = self._confidence(route, tone_data, profile, fin_result)
        signals_active = signals

        result = {
            "route":      route,
            "reason":     reason,
            "signals":    signals_active,
            "confidence": round(confidence, 3),
        }

        if route == "fast_path_ack":
            reply_all_ok = self._reply_all_ok(cc, subj, snip, intent_cat)
            result["reply_all_ok"] = reply_all_ok
            if reply_all_ok:
                result["reason"] += " | reply-all: AUTO ACK"

        self._log(result, sender, subj)
        return result

    # ── Core routing tree ──────────────────────────────────────

    def _decide(self, sender, subj, snip, cc, has_att,
                intent_label, intent_cat, urgency,
                tone, profile, fin_result, grammar_score) -> tuple[str, str]:

        # ── ORDER: escalate fastest-fail first ──────────────────
        esc, reason_esc = self._check_escalation(sender, subj, snip, cc, has_att, fin_result)
        signals : list[str] = []
        if esc:
            return "escalate", reason_esc

        # ── Handle financial type (may auto-ack or force full) ──
        fast_fin = self._financial_route(fin_result)
        if fast_fin:
            return fast_fin

        # ── Check sender profile: negative outcome streak → review ──
        neg_streak = self._neg_outcome_streak(profile)
        grammar_fail = grammar_score is not None and grammar_score < _GRAMMAR_QUALITY_CUT
        if neg_streak >= _NEG_IMPACT_HISTORY and not has_att:
            return "full_pipeline", f"neg-outcome streak ({neg_streak}); safe to review before sending"

        # ── Unknown sender + suspicious patterns ────────────────
        sender_knows = profile.get("outcome_history", []) or intent_raw.get("profile_depth", 0) >= 1
        if not sender_knows and self._suspicious(subj, snip):
            return "full_pipeline", "unknown sender + suspicious keyword patterns"

        # ── Empty/incomplete thread → full pipeline ─────────────
        if self._needs_complex(subj, snip, intent_cat, intent_label):
            return "full_pipeline", f"intent={intent_cat} requires multi-step handling"

        # ── Meeting/briefing/scheduling ─────────────────────────
        if intent_cat in ("booking", "meeting"):
            return "full_pipeline", f"meeting/scheduling intent; needs calendar + confirmation"

        # ── High urgency (non-escalate) ─────────────────────────
        if urgency >= _URGENT_THRESHOLD:
            return "fast_path", f"high urgency ({urgency:.2f}); fast reliable reply"

        # ── Reply-all broadcast (newsletter, noreply) → auto ACK ──
        reply_struct = email.get("reply_all_structure", "")
        if cc and self._reply_all_ok(cc, subj, snip, intent_cat):
            return "auto_ack", "reply-all broadcast; safe auto-ack"

        # ── Grammar failure overrides ───────────────────────────
        if grammar_fail:
            return "review", f"grammar score {grammar_score:.1f} < {_GRAMMAR_QUALITY_CUT}; manual review"

        # ── If intent profile is reliable, check outcome history ─
        intent_healed = self._get_intent_outcome(profile, intent_cat, intent_label)
        pos_streak = self._pos_outcome_streak(profile, intent_cat)
        if pos_streak >= 3:
            return "fast_path", f"positive intent profile x{pos_streak} for {intent_cat}; safe to fast-path"

        # ── Default: check if we have adequate signal ───────────
        profile_depth = len(profile.get("outcome_history", []))
        if profile_depth >= 3 and intent_cat != "general":
            return "full_pipeline", f"adequate profile ({profile_depth}); full pipeline for quality"

        # ── Low signal → review ─────────────────────────────────
        if profile_depth < 3 and intent_cat == "general" and not has_att:
            return "auto_ack", "low signal, no attachments; de-emphasise"

        return "fast_path", "default fast-path (adequate signal, standard intent)"

    # ── Sub-routers ────────────────────────────────────────────

    def _check_escalation(self, sender, subj, snip, cc, has_att, fin_result) -> tuple[bool, str]:
        """Return True if this email must escalate before any other action."""
        s_lower = f"{subj} {snip}".lower()

        # Financial escalation
        if fin_result:
            ftype = fin_result.get("financial_type", "")
            if ftype == "fraud_alert":
                return True, "financial fraud alert — escalate immediately"
            if ftype in ("wire_transfer",) and fin_result.get("match_score", 0) > 0.7:
                return True, "high-confidence wire/transfer alert — human review required"

        # Legal/sue → escalate
        legal_pat = re.compile(r'\b(sue|lawsuit|legal action|attorney|court|subpoena|cease.?and.?desist)\b', re.I)
        if legal_pat.search(f"{subj} {snip}"):
            return True, "legal/sue keyword detected — must escalate"

        # VIP sender + complex intent → escalate (unless outcome history says safe)
        if sender.lower() in _VIP_SENDERS:
            vip_intent = re.compile(r'\b(urgent|billing|legal|incident|outage|critical)\b', re.I)
            if vip_intent.search(f"{subj} {snip}") and intent_cat:
                return True, "VIP sender + complex intent — escalate for human attention"

        # Suspicious patterns in subject + snippet combined
        top_pat = re.compile(r'\b(urgent|critical|immediate|emergency|act now|severe)\b', re.I)
        combined = f"{subj} {snip}".lower()
        if 'outage' in combined or 'down' in combined:
            return True, "potential service outage language — escalate"

        # Abusive/rude language → escalate
        abusive = re.compile(r'\b(idiots|stupid|incompetent|waste of time|unacceptable)\b', re.I)
        if abusive.search(f"{subj} {snip}"):
            return True, "abusive language detected — escalate"

        return False, ""

    def _financial_route(self, fin_result) -> tuple[Optional[str], str]:
        """Route based on financial classification; return (route, reason) or (None, '')."""
        if not fin_result:
            return None, ""
        ftype = fin_result.get("financial_type", "unknown")
        route, reason = _FIN_ACTIONS.get(ftype, _FIN_ACTIONS["unknown"])
        return route, f"financial type={ftype} → {reason}"

    def _needs_complex(self, subj, snip, intent_cat, intent_label) -> bool:
        """Does this email look like it needs multi-step reasoning?"""
        combined = f"{subj} {snip}".lower()

        # Multi-question indicator
        q_marks = combined.count("?")
        if q_marks >= 3:
            return True

        # Complex intent cats
        if intent_cat in ("sales", "partnership", "pr", "legal", "billing_dispute"):
            return True

        # Sales reply request
        if intent_label == "sales":
            return True

        # Invoice → billing
        inv_pat = re.compile(r'\b(invoice|invoice #|bill us|quote request|estimates?)\b', re.I)
        if inv_pat.search(combined):
            return True

        return False

    def _reply_all_ok(self, cc, subj, snip, intent_cat) -> bool:
        """Should this be a safe auto-reply-all?"""
        if not cc:
            return False

        # Low-value broadcast signals
        low_val = re.compile(
            r'\b(unsubscribe|newsletter|digest|weekly\s+roundup|community\s+news)\b',
            re.I
        )

        def is_broadcast_cc(cc_str):
            return any(
                k.lower() in cc_str.lower()
                for k in ['newsletter', 'noreply', 'no-reply', 'no_reply',
                           'announce', 'notification', 'updates@', 'support@',
                          'hello@', 'info@', 'contact@', 'default@']
            )

        # Accept safe reply-all on inbound info/inquiry only
        return False  # Conservative default — reply-all needs explicit send gate

    def _suspicious(self, subj, snip) -> bool:
        combined = f"{subj} {snip}".lower()
        pat_hits = 0
        for pat in _SUSPICIOUS_PATTERNS:
            if pat.search(combined):
                pat_hits += 1
        return pat_hits >= 1

    def _neg_outcome_streak(self, profile) -> int:
        history = profile.get("outcome_history", [])
        streak = 0
        for h in reversed(history):
            if h.get("outcome", "").lower() in ("negative", "negative_response", "spam", "bounce"):
                streak += 1
            else:
                break
        return streak

    def _pos_outcome_streak(self, profile, intent_cat) -> int:
        history = profile.get("outcome_history", [])
        streak = 0
        for h in reversed(history):
            if h.get("outcome", "").lower() == "positive" and h.get("intent", "") == intent_cat:
                streak += 1
            else:
                break
        return streak

    def _get_intent_outcome(self, profile, intent_cat, intent_label) -> dict:
        history = profile.get("outcome_history", [])
        matching = [h for h in history if h.get("intent", "") == intent_cat]
        if not matching:
            return {"positive": 0, "negative": 0, "total": 0}
        pos  = sum(1 for h in matching if h.get("outcome") == "positive")
        neg  = sum(1 for h in matching if h.get("outcome") == "negative")
        return {"positive": pos, "negative": neg, "total": len(matching)}

    def _confidence(self, route, tone, profile, fin_result) -> float:
        """Estimate routing confidence (0-1)."""
        c = 0.5
        # High-confidence routes
        if route == "escalate":
            c += 0.3
        elif route == "auto_ack":
            c += 0.25
        elif route == "fast_path":
            c += 0.15
        # Profile depth confidence
        profile_outcomes = profile.get("outcome_history", [])
        c += min(len(profile_outcomes) * 0.05, 0.2)
        # Financial type known
        if fin_result and fin_result.get("financial_type") != "unknown":
            c += 0.1
        return min(c, 1.0)

    # ── Logging ──────────────────────────────────────────────

    def _log(self, result: dict, sender: str, subj: str):
        try:
            log_entry = {
                "ts": datetime.now(timezone.utc).isoformat(),
                "sender": sender,
                "subject": (subj or "")[:120],
                **result,
            }
            with open(self.log_path, 'a') as f:
                f.write(json.dumps(log_entry, ensure_ascii=False) + '\n')
        except Exception:
            pass
