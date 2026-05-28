#!/usr/bin/env python3
"""
V41-B: ResponseQualityGrader — tone vocabulary per intent label.

The RLHF tone_mismatch gap detected by rlhf_pipeline:
  tone_mismatch = (recommended_reply_all != response.auto_sent) AND combined_reward > 0.65

V41-B captures the root cause — response body tone is wrong for the label.

Tone vocabulary per intent_label (V26 intent vocab):
  urgent           → very_formal
  support_issue    → professional_concise / friendly
  personal_one2one → casual_warm
  meeting          → professional_concise
  partnership      → professional_collaborative
  financial        → professional_direct
  billing          → very_formal
  invoice          → very_formal
  legal            → very_formal
  cancellation     → formal_empathy
  default          → professional_concise
"""
from __future__ import annotations

import logging
import re
from dataclasses import dataclass, field
from typing import Any

logger = logging.getLogger(__name__)

# ── Tone vocabulary contract per intent label ────────────────────────────────

_TONE_CONTRACT: dict[str, dict[str, Any]] = {
    "urgent": {
        "allowed_tones":   ["very_formal"],
        "flag_relaxed":    False,
    },
    "support_issue": {
        "allowed_tones":   ["professional_concise", "friendly"],
        "flag_relaxed":    False,
    },
    "personal_one2one": {
        "allowed_tones":   ["casual_warm", "casual"],
        "flag_relaxed":    True,
    },
    "meeting": {
        "allowed_tones":   ["professional_concise", "neutral_polite"],
        "flag_relaxed":    False,
    },
    "partnership": {
        "allowed_tones":   ["professional_collaborative", "professional_concise"],
        "flag_relaxed":    False,
    },
    "financial": {
        "allowed_tones":   ["professional_direct", "very_formal"],
        "flag_relaxed":    False,
    },
    "billing": {
        "allowed_tones":   ["very_formal"],
        "flag_relaxed":    False,
    },
    "invoice": {
        "allowed_tones":   ["very_formal"],
        "flag_relaxed":    False,
    },
    "legal": {
        "allowed_tones":   ["very_formal"],
        "flag_relaxed":    False,
    },
    "cancellation": {
        "allowed_tones":   ["formal_empathy", "very_formal"],
        "flag_relaxed":    False,
    },
}

_DEFAULT_CONTRACT: dict[str, Any] = {
    "allowed_tones": ["professional_concise", "neutral_polite"],
    "flag_relaxed":  True,
}
_FORMAL_LEX = re.compile(
    r'\b(hereby|pursuant|aforesaid|notwithstanding|certify|attest|obligation|'
    r'jurisdiction|herein|heretofore|whereby|formally|legal|formal)\b',
    re.IGNORECASE,
)
_CASUAL_LEX = re.compile(r'\b(ur |u |gonna|wanna|lemme|plz|pls|cuz)\b', re.IGNORECASE)
_WARM_LEX  = re.compile(r'\b(hey|hiya|yo)\b|!', re.IGNORECASE)
_EMPATHY_LEX = re.compile(r'\b(sorry|regret|unfortunate|disappointed)\b', re.IGNORECASE)
_DIRECT_LEX = re.compile(r'\b(payment|received|confirmed)\b', re.IGNORECASE)


def _detect_tone(body: str) -> str:
    """Fast heuristic: surface tone from body text."""
    s = body.lower()
    if _DIRECT_LEX.search(s) and len(_FORMAL_LEX.findall(s)) >= 2:
        return "very_formal"
    if _EMPATHY_LEX.search(s) and _FORMAL_LEX.search(s):
        return "formal_empathy"
    if _CASUAL_LEX.search(s) and not _FORMAL_LEX.search(s):
        return "casual"
    if _WARM_LEX.search(s) and len(body.split()) < 80:
        return "casual_warm"
    formal_hits = len(_FORMAL_LEX.findall(s))
    if formal_hits >= 3:
        return "very_formal"
    if formal_hits >= 2 and _DIRECT_LEX.search(s):
        return "professional_direct"
    if "together" in s or "joint" in s or "partner" in s:
        return "professional_collaborative"
    return "professional_concise"


# ── Public API ───────────────────────────────────────────────────────────────

@dataclass
class ToneScore:
    """Per-intent tone quality result."""
    intent_label:     str           = ""
    detected_tone:    str           = "professional_concise"
    required_tones:   list[str]     = field(default_factory=list)
    tone_ok:          bool          = True
    tone_violation:   str           = ""
    allow_auto_send:  bool          = True
    blocked_by:       list[str]     = field(default_factory=list)
    reasons:          list[str]     = field(default_factory=list)
    v_stage:          str           = "V41-B"

    def to_dict(self) -> dict:
        return {
            "intent_label":    self.intent_label,
            "detected_tone":   self.detected_tone,
            "required_tones":  list(self.required_tones),
            "tone_ok":         self.tone_ok,
            "tone_violation":  self.tone_violation,
            "allow_auto_send": self.allow_auto_send,
            "blocked_by":      list(self.blocked_by),
            "reasons":         list(self.reasons),
            "v_stage":         self.v_stage,
        }


class ResponseQualityGrader:
    """Grade response body tone against intent label vocabulary contract.

    Does NOT replace V41-A hard gates. Runs after V41-A as a tone quality
    layer so RLHF can distinguish tone-only failures from hard blocks
    (billing, reply-all breach, etc.).
    """

    def grade(self,
              body:          str,
              intent_label:  str = "",
              auto_sent:     bool = True,
              dry_run:       bool = False,
              tone_override: str | None = None,
              ) -> ToneScore:
        """Return tone quality result for one dispatched response.

        Parameters
        ----------
        body:  response body text.
        intent_label:  V26 intent label (e.g. "personal_one2one", "invoice").
        auto_sent:  whether V41-A / V26 actually sent this.
        dry_run:  if True, always allow_auto_send (sandbox mode).
        tone_override:  force detected tone for testing if provided.
        """
        intent = (intent_label or "default").lower()
        contract = _TONE_CONTRACT.get(intent, _DEFAULT_CONTRACT)
        required_tones: list[str] = list(contract["allowed_tones"])
        relax = contract.get("flag_relaxed", True)

        detected = tone_override if tone_override else (
            _detect_tone(body) if body else "professional_concise"
        )

        tone_ok = (detected in required_tones)
        blocked_by: list[str] = []
        reasons:  list[str] = []
        allow_send = auto_sent

        if not tone_ok and not dry_run:
            blocked_by.append(f"tone_mismatch:{detected}")
            reasons.append(
                f"intent={intent} requires tone in {required_tones}, got '{detected}'"
            )
            if relax:
                allow_send = True      # casual intent → flag, don't block
            else:
                allow_send = auto_sent  # hard intent → escalate, don't auto-bypass

        return ToneScore(
            intent_label    = intent,
            detected_tone   = detected,
            required_tones  = required_tones,
            tone_ok         = tone_ok,
            tone_violation  = "; ".join(reasons),
            allow_auto_send = allow_send,
            blocked_by      = blocked_by,
            reasons         = reasons,
            v_stage         = "V41-B",
        )


# ── Module-level convenience callable ───────────────────────────────────────

def grade_response(body: str,
                   intent_label: str = "",
                   auto_sent: bool = True,
                   dry_run: bool = False,
                   tone_override: str | None = None) -> dict:
    """Standalone callable: returns dict derived from ResponseQualityGrader().grade()."""
    r = ResponseQualityGrader().grade(body, intent_label, auto_sent, dry_run, tone_override)
    return r.to_dict()
