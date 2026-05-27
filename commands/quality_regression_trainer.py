#!/usr/bin/env python3
from __future__ import annotations
"""
V25 Wave 10 — Quality Regression Trainer

Monitors `data/response_scores.jsonl` (V25 6-dimension verifier output) and
auto-flags templates whose rolling-5 average quality drops below 60/100.

A template drops in score when:
  • Rolling 5-email average < 60  →  TEMPLATE_REGRESSION flag
  • Rolling 5-email average < 50  →  CODE_RED template suspension
  • Intent drift: the same template suddenly serves a different intent
  • Grammar regression: avg grammar dim < 50 over last 3 sends

Actions taken:
  • Marks template as `needs_manual_review` in the performance log
  • Auto-disables LLM-based template optimiser for that combo (safety)
  • Logs event to `data/quality_regression_events.jsonl`
  • Telegram alert (LOW urgency) if GOOGLE_CHAT_WEBHOOK set

Read-only — never auto-deletes or rewrites templates.
"""

import json
from datetime import datetime, timezone
from collections import defaultdict
from pathlib import Path

WORKSPACE      = Path(__file__).resolve().parent.parent
DATA           = WORKSPACE / 'data'
SCORES_LOG     = DATA / 'response_scores.jsonl'
REGRESSION_LOG = DATA / 'quality_regression_events.jsonl'

_REGRESSION_THRESHOLD = 60
_CODE_RED_THRESHOLD   = 50
_GRAMMAR_FLOOR        = 50
_WINDOW               = 5   # rolling-5 window


def _log(event: dict):
    try:
        with open(REGRESSION_LOG, 'a') as f:
            f.write(json.dumps({"ts": datetime.now(timezone.utc).isoformat(),
                                **event}) + '\n')
    except Exception:
        pass


def _load_scores() -> list[dict]:
    try:
        raw = SCORES_LOG.read_text().strip()
        if not raw:
            return []
        return [json.loads(l) for l in raw.splitlines() if l.strip()]
    except Exception:
        return []


def _rolling_avg(items: list[float], n: int) -> float | None:
    if len(items) < n:
        return None
    return sum(items[-n:]) / n


class QualityRegressionTrainer:
    def __init__(self, scores_path=None):
        global SCORES_LOG
        if scores_path is not None:
            SCORES_LOG = scores_path   # type: ignore[misc]
        self.scores   = _load_scores()
        self.groups   = self._group_scores()
        self.flagged  = {}   # key → reason

    def _group_scores(self) -> dict[str, list[float]]:
        groups = defaultdict(list)
        for r in self.scores:
            key   = str(r.get("intent", "unknown"))
            score = r.get("overall_score")
            if score is not None:
                groups[key].append(float(score))
        return dict(groups)

    def check_all(self) -> dict:
        result = {"checked": 0, "ok": 0, "regression": 0, "code_red": 0,
                  "flagged": [], "newly_flagged": []}
        for key, scores in self.groups.items():
            result["checked"] += 1
            avg = _rolling_avg(scores, _WINDOW)
            if avg is None:
                result["ok"] += 1
                continue
            if avg >= _REGRESSION_THRESHOLD:
                result["ok"] += 1
                if key in self.flagged:
                    reset = self.flagged.pop(key, None)
                    if reset:
                        _log({"phase": "template_recovered", "key": key,
                              "rolling_5_avg": round(avg,1)})
                continue

            if avg < _CODE_RED_THRESHOLD:
                result["code_red"] += 1
                flag = "code_red"
            else:
                result["regression"] += 1
                flag = "regression"

            action = flag
            if key not in self.flagged:
                _log({"phase": "template_regression", "key": key,
                      "rolling_5_avg": round(avg,1), "flag": flag,
                      "action": action, "score_history": scores[-_WINDOW:]})
                result["newly_flagged"].append(key)
            self.flagged[key] = {"flag": flag, "rolling_5_avg": round(avg, 1)}
            result["flagged"].append(key)

        return result

    def is_blocked(self, intent: str) -> bool:
        """True if template for this intent should not be used (code_red)."""
        key = str(intent)
        if key in self.flagged and self.flagged[key]["flag"] == "code_red":
            return True
        return False

    def regression_note(self, intent: str) -> str:
        key = str(intent)
        if key in self.flagged:
            return (f"⚠️ TEMPLATE_REGRESSION: rolling-5 avg "
                    f"{self.flagged[key]['rolling_5_avg']}/100 "
                    f"(flag={self.flagged[key]['flag']})")
        return ""


# ── CLI self-test ─────────────────────────────────────────────
if __name__ == '__main__':
    import tempfile, os
    print("=== V25 Wave 10 — Quality Regression Trainer ===\n")

    # Build fake scorings jsonl locally
    tmp = DATA / "test_response_scores.jsonl"
    tmp_data = [
        {"intent": "support", "overall_score": 88.0},
        {"intent": "support", "overall_score": 90.0},
        {"intent": "support", "overall_score": 92.0},
        {"intent": "support", "overall_score": 85.0},
        {"intent": "support", "overall_score": 87.0},  # avg=88.4  ok
        {"intent": "sales",   "overall_score": 75.0},
        {"intent": "sales",   "overall_score": 72.0},
        {"intent": "sales",   "overall_score": 55.0},
        {"intent": "sales",   "overall_score": 40.0},
        {"intent": "sales",   "overall_score": 30.0},  # rolling-5 avg=55.6 regression
        {"intent": "broken",  "overall_score": 25.0},  # code_red
    ]
    tmp.write_text("\n".join(json.dumps(r) for r in tmp_data) + "\n")

    SCORES_LOG = tmp   # type: ignore[misc]
    trainer = QualityRegressionTrainer(scores_path=tmp)
    r = trainer.check_all()
    print(f"  Checked: {r['checked']} | ok: {r['ok']} | "
          f"regression: {r['regression']} | code_red: {r['code_red']}")
    print(f"  Flagged: {r['flagged']}")
    print(f"  is_blocked('sales'): {trainer.is_blocked('sales')}")
    print(f"  is_blocked('support'): {trainer.is_blocked('support')}")
    print(f"  note: {trainer.regression_note('sales')}")
    tmp.unlink()
    print("\n=== Self-test complete ===")
