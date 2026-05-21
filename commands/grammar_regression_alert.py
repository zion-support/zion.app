from __future__ import annotations
#!/usr/bin/env python3
"""
w3-01 — Grammar Regression Alert

Track per-template grammar score over last N sends.
Flag templates with 3 consecutive sends scoring < 55.
Write alert to template_alert.jsonl, quarantine the slot.
"""

import json
from datetime import datetime, timezone
from pathlib import Path

_LOG    = Path(__file__).resolve().parent.parent.parent / "data" / "v26_run_log.jsonl"
_ALERT  = Path(__file__).resolve().parent.parent.parent / "data" / "template_alert.jsonl"
_WINDOW  = 50   # look at last 50 sends
_REG_THRESHOLD = 55.0
_STREAK_REQUIRED = 3


def check(record_fn=None) -> list[dict]:
    """Return list of template alert dicts (empty = no alerts)."""
    if not _LOG.exists():
        return []
    try:
        lines = _LOG.read_text().splitlines()[-_WINDOW:]
    except Exception:
        return []

    # Aggregate per template
    template_scores: dict = {}
    for line in lines:
        try:
            rec = json.loads(line)
        except Exception:
            continue
        intent = rec.get('intent', '')
        lang   = rec.get('language', 'en')
        g_score= rec.get('grammar_score', rec.get('grammar', 0))
        if not intent:
            continue
        key = f"{intent}|{lang}"
        template_scores.setdefault(key, []).append(float(g_score))

    alerts = []
    for key, scores in template_scores.items():
        tail = scores[-_STREAK_REQUIRED:]
        if len(tail) < _STREAK_REQUIRED:
            continue
        if all(s < _REG_THRESHOLD for s in tail):
            rec = {
                "ts":       datetime.now(timezone.utc).isoformat(),
                "template": key,
                "streak":   len(tail),
                "tail_scores": tail,
                "mean":     round(sum(tail) / len(tail), 1),
                "threshold": _REG_THRESHOLD,
                "status":   "quarantine",
            }
            alerts.append(rec)
            try:
                with open(_ALERT, 'a') as f:
                    f.write(json.dumps(rec, ensure_ascii=False) + '\n')
            except Exception:
                pass
    return alerts
