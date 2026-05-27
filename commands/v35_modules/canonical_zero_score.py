#!/usr/bin/env python3
"""
V35-1: Canonical-Zero Scoring Guard
Detects silent-failure mode: score == 0 AND emails_processed == 0
across consecutive runs → escalate before metric bleed erodes trust.

State file: data/canonical_zero_state.json
"""

from __future__ import annotations

import json
import os
from datetime import datetime, timezone
from pathlib import Path

WORKSPACE = Path(__file__).resolve().parent.parent.parent
DATA = WORKSPACE / "data"
STATE_FILE = DATA / "canonical_zero_state.json"
DEFAULT_THRESHOLD = 3   # alert after N consecutive zero-score runs
DEFAULT_RESET_WINDOW = 24  # hours — autorecover if gap > window

# ------------------------------------------------------------------
# State helpers
# ------------------------------------------------------------------

def _load_state() -> dict:
    if STATE_FILE.exists():
        try:
            return json.loads(STATE_FILE.read_text())
        except Exception:
            pass
    return {}

def _save_state(s: dict):
    STATE_FILE.parent.mkdir(parents=True, exist_ok=True)
    STATE_FILE.write_text(json.dumps(s, indent=2, default=str))


# ------------------------------------------------------------------
# Core
# ------------------------------------------------------------------

def canonical_zero_score(
    emails_processed: int,
    actions_taken: int,
    score: float,
    run_id: str = "",
    state: dict | None = None,
    threshold: int = DEFAULT_THRESHOLD,
    reset_window_h: int = DEFAULT_RESET_WINDOW,
) -> dict:
    """
    Evaluate whether the current run is a canonical-zero event and
    update persistence state accordingly.

    Args:
        emails_processed: how many inbox items touched this run
        actions_taken: how many actions (reply/send/forward) executed
        score: aggregate success score this run (0.0–1.0 typically)
        run_id: unique label for this run (default: timestamp)
        state: optional pre-loaded state dict (saves internal read)
        threshold: consecutive zero-score runs before escalating (default 3)
        reset_window_h: hours of silence before auto-reset (default 24)

    Returns:
        dict with keys:
          canonical_zero   bool  — True if this run is zero-score
          streak           int   — consecutive zero-score runs
          escalated        bool  — threshold crossed
          last_nonzero_iso str   — ISO timestamp of last non-zero run
          since_h          float — hours since last non-zero run
          recommended_action str — 'none'|'alert'|'escalate'|'recover'
    """
    now = datetime.now(timezone.utc)
    run_id = run_id or now.isoformat()
    if state is None:
        state = _load_state()

    is_zero = (score <= 0.0 or score == 0) and emails_processed == 0 and actions_taken == 0

    last_nz_iso = state.get("last_nonzero_iso")
    streak = state.get("zero_streak", 0)

    if is_zero:
        streak += 1
        now_iso = now.isoformat()
        since_h = _hours_since(last_nz_iso) if last_nz_iso else 999.0
        diff = _hours_between(last_nz_iso, now_iso) if last_nz_iso else 999.0

        if last_nz_iso and diff > reset_window_h:
            # Gap too large → autorecover
            action = "recover"
            escalated = False
            streak = 1   # start fresh streak
        elif streak >= threshold:
            action = "escalate"
            escalated = True
        else:
            action = "alert"
            escalated = False
    else:
        streak = 0
        last_nz_iso = now.isoformat()
        since_h = 0.0
        action = "none"
        escalated = False

    out = {
        "canonical_zero": is_zero,
        "streak": streak,
        "escalated": escalated,
        "last_nonzero_iso": last_nz_iso or "",
        "since_h": round(since_h, 2),
        "recommended_action": action,
        "run_id": run_id,
        "emails_processed": emails_processed,
        "actions_taken": actions_taken,
        "score": score,
        "threshold": threshold,
        "reset_window_h": reset_window_h,
    }

    # Persist state fields
    _save_state({
        "last_run_iso": now.isoformat(),
        "last_nonzero_iso": last_nz_iso or "",
        "zero_streak": streak,
        "last_run_id": run_id,
        "threshold": threshold,
        "reset_window_h": reset_window_h,
    })

    return out


def reset():
    """Clear state — call after manual intervention or deploy."""
    if STATE_FILE.exists():
        STATE_FILE.write_text("{}")


def _hours_since(iso_str: str) -> float:
    if not iso_str:
        return 999.0
    return _hours_between(iso_str, datetime.now(timezone.utc).isoformat())

def _hours_between(a: str, b: str) -> float:
    try:
        ta = datetime.fromisoformat(a.replace("Z", "+00:00"))
        tb = datetime.fromisoformat(b.replace("Z", "+00:00"))
        return abs((tb - ta).total_seconds()) / 3600.0
    except Exception:
        return 999.0
