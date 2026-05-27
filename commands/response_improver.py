from __future__ import annotations
"""
ResponseImprover — V30 Post-Send Intelligence

Runs AFTER every send in both fast-path and full-pipeline.
Function: Score response quality, update template health tracking,
store reply-outcome metadata for future sender-profile learning.

Quality scoring dimensions (each 0-100):
  - Relevance: does the response address the email content?
  - Formality: matches the sender's expected register
  - Completeness: covers the intent + any follow-up required
  - Grammar: baseline score from _fast_grammar_check

Template health dimensions:
  - template_impression_counter: hits per (lang, intent_cat) tuple
  - good_rollout_streak: consecutive sends that passed grammar >=65
  - last_grammar_score: most recent score for this slot
  - needs_retrain_flag: set True when grammar score drops below 55
"""

import json, time
from pathlib import Path
from datetime import datetime, timezone

WORKSPACE  = Path(__file__).resolve().parent.parent.parent
DATA       = WORKSPACE / 'data'
TQ_HEALTH  = DATA / 'template_health.jsonl'
TQ_SCORES  = DATA / 'response_quality_scores.jsonl'


class ResponseImprover:
    """Post-send analyzer — called from both pipeline paths after send."""

    def __init__(self):
        self._cache: dict = {}
        self._load_health()

    # ── Load/save health ────────────────────────────────────

    def _load_health(self):
        """Append-only log health file for tracked templates."""
        if TQ_HEALTH.exists():
            try:
                for line in TQ_HEALTH.read_text().splitlines():
                    r = json.loads(line)
                    slot = (r.get("lang","en"), r.get("intent_cat","general"), r.get("formality","neutral"))
                    self._cache[slot] = r
            except Exception:
                pass

    def record_send(self, response_body: str, intent_cat: str, lang: str,
                    formality: str, grammar_score: float,
                    sender: str, action: str = "send") -> dict:
        """Record a send event. Returns slot health summary."""
        slot = (lang, intent_cat, formality)
        old = self._cache.get(slot)
        good = grammar_score >= 65.0
        streak = (old.get("good_rollout_streak", 0) if old else 0)
        if good:
            streak += 1
        else:
            streak = 0

        entry = {
            "ts": datetime.now(timezone.utc).isoformat(),
            "lang": lang,
            "intent_cat": intent_cat,
            "formality": formality,
            "grammar_score": round(grammar_score, 1),
            "response_len": len(response_body),
            "sender_domain": sender.split("@", 1)[-1] if "@" in sender else "unknown",
            "action": action,
            "needs_retrain": grammar_score < 55.0,
            "good_rollout_streak": streak,
            "impressions": (old.get("impressions", 0) if old else 0) + 1,
        }
        self._cache[slot] = entry

        try:
            with open(TQ_HEALTH, 'a') as f:
                f.write(json.dumps(entry, ensure_ascii=False) + '\n')
        except Exception:
            pass

        return entry

    def slot_health(self, intent_cat: str, lang: str = "en", formality: str = "neutral") -> dict:
        slot = (lang, intent_cat, formality)
        return self._cache.get(slot, {
            "impressions": 0,
            "good_rollout_streak": 0,
            "grammar_score": 0.0,
            "needs_retrain": False,
        })

    def unhealthy_slots(self, min_impressions: int = 3) -> list[dict]:
        """Return a list of (lang, intent_cat, formality) slots that need attention."""
        results = []
        for (lang, intent_cat, formality), health in self._cache.items():
            if (health.get("impressions", 0) >= min_impressions
                    and health.get("needs_retrain", False)):
                results.append({
                    "lang": lang, "intent_cat": intent_cat,
                    "formality": formality,
                    "grammar_score": health.get("grammar_score", 0),
                    "impressions": health.get("impressions", 0),
                })
        return results

    # ── Quality scoring ─────────────────────────────────────

    @staticmethod
    def score_response(response_body: str, intent_label: str,
                       tone_data: Optional[dict] = None) -> dict:
        """Score a drafted response across quality dimensions (0-100 each)."""
        tone_data = tone_data or {}
        formality = tone_data.get("formality", "neutral")

        body_lower    = response_body.lower()
        has_greeting  = any(g in body_lower for g in ["hi", "hello", "dear", "good morning", "good afternoon"])
        has_close     = any(c in body_lower for c in ["—", "-", "regards", "best", "sincerely", "thanks", "thank you"])
        intent_words  = (intent_label or "general").lower()
        intent_in_body = intent_words in body_lower

        scores: dict[str, float] = {}

        # ① Relevance
        scores["relevance"] = min(
            (20 if has_greeting else 0)
          + (20 if has_close   else 0)
          + (30 if intent_in_body else 0)
          + 30, 100)

        # ② Formality
        word_count = len(response_body.split())
        if formality == "formal":
            scores["formality"] = 85 if word_count >= 80 else 65
        elif formality == "casual":
            scores["formality"] = 75 if word_count <= 60 else 60
        else:
            scores["formality"] = 90 if word_count > 80 else (60 if word_count > 30 else 40)

        # ③ Completeness
        has_action = any(w in body_lower for w in ["see", "let me", "we", "thanks", "thank you"])
        scores["completeness"] = min(
            (30 if has_greeting else 0)
          + (30 if has_close   else 0)
          + (30 if has_action   else 0)
          + 10, 100)

        # ④ Depth
        scores["depth"] = min(len(response_body.strip()) / 4.0, 100.0)

        overall = sum(scores.values()) / max(len(scores), 1)
        return {
            "overall_score": round(overall, 1),
            "dimension_scores": {k: round(v, 1) for k, v in scores.items()},
        }
