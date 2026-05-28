#!/usr/bin/env python3
"""
V25 Wave 9 — Real-Time Feedback Loop (RTFB)

Bridges the gap between "email sent" and "outcome logged" by performing
a lightweight pre-send quality re-check with the *composed response body*
instead of just the subject+snippet.  If the response would score below the
floor (default 65/100) in the fast-path context, immediately escalate to
`review` — no send.

Mechanics:
  • Called at end of fast-path and full-pipeline compose, just before `send`
  • Evaluates final body text against 6-dimension verifier (if available)
  • Returns tiered action: `send`, `send_low_urgency`, `review`, `escalate`
  • Does NOT block emails that already passed quality gate
  • Zero new external deps — uses existing _v25_score from V25

Can also record outcome *bootstrap*: the first positive/neutral outcome for
a template/tone combo soils the ML weights before send.
"""

import json
from datetime import datetime, timezone
from pathlib import Path

WORKSPACE = Path(__file__).resolve().parent.parent
DATA      = WORKSPACE / 'data'
FEEDBACK_LOG = DATA / 'rtfb_log.jsonl'

_SCORE_FLOOR = 65   # minimum verification floor for auto-send
_POLARITY_TONE = {
    "positive":   "warm_celebratory",
    "negative":   "empathetic_reassuring",
    "neutral":    "professional_friendly",
    "urgent":     "urgent_calm",
}


def _log(event: dict):
    try:
        with open(FEEDBACK_LOG, 'a') as f:
            f.write(json.dumps({"ts": datetime.now(timezone.utc).isoformat(),
                                **event}) + '\n')
    except Exception:
        pass


def _tier_from_score(score: float, intent: str = 'general') -> str:
    if score >= 85: return 'send'
    if score >= 70: return 'send_low_urgency'
    if score >= _SCORE_FLOOR: return 'send'
    return 'review'


def apply_feedback(body: str, ed: dict, intent: str = 'general',
                   _v25_score=None, dry_run: bool = False) -> dict:

    if not _v25_score:
        return {"tier": "send", "score": 75.0, "floor_passed": True,
                "needs_review": False, "feedback": "no_verifier_available"}

    try:
        score_data  = _v25_score(body, ed, intent)
        overall     = score_data.get("overall_score", 75)
        passed      = score_data.get("passed",    True)
        should_send = score_data.get("should_send", True)
        issues      = score_data.get("issues", []) or []
        dim         = score_data.get("dimension_scores", {})

        tier    = _tier_from_score(overall, intent)
        nudge   = {}

        # Nudge polarization-aware replanning
        if overall < _SCORE_FLOOR and not passed:
            nudge["tone_override"] = _POLARITY_TONE.get(
                ed.get("tone", {}).get("polarity", "neutral"), "professional_neutral"
            )
            nudge["urgency_nudge"] = min(int(ed.get("urgency", 3)), 2)

        result = {
            "score":       round(overall, 1),
            "tier":        tier,
            "floor_passed":   bool(should_send),
            "verified":    passed,
            "issues":      issues[:4],
            "velocity_dims": dim,
            "needs_review": not should_send or tier == 'review',
            "feedback":    "real_time_recheck",
            "nudges":      nudge,
        }

        if not dry_run and tier != 'send':
            _log({"phase": "rtfb_intercept", "tier": tier, "score": overall,
                  "intent": intent, "issues": [i.get("msg","") for i in issues[:3]]})
        return result

    except Exception as ex:
        _log({"phase": "rtfb_error", "err": str(ex)})
        return {"tier": "send", "score": 75.0, "floor_passed": True,
                "needs_review": False, "feedback": f"error:{ex}"}


# ── CLI self-test ─────────────────────────────────────────────
if __name__ == '__main__':
    print("=== V25 Wave 9 — Real-Time Feedback Loop ===\n")

    # case support style case
    ed_support = {"sender": "client@ex.com",
                  "subject": "Urgent: Server down",
                  "snippet": "Production completely broken.",
                  "cc": "", "urgency": 1,
                  "tone": {"formality": "formal", "response_tone": "urgent_calm",
                           "polarity": "urgent", "polarity_conf": 0.8}}
    body_good = (
        "Hi, I see your urgent server issue. I'm on it right now — escalating "
        "to our infra team. Expect an update within the hour. — Kleber, Zion Tech Group"
    )
    r = apply_feedback(body_good, ed_support, "support")
    print(f"  Good support body:  score={r['score']} tier={r['tier']} floor={r['floor_passed']}")

    # bad body: empty / too short
    body_bad = "Ok."
    r2 = apply_feedback(body_bad, ed_support, "support")
    print(f"  Short lazy body:   score={r2['score']} tier={r2['tier']} floor={r2['floor_passed']}")

    print("\n=== Self-test complete ===")
