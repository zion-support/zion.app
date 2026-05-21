from __future__ import annotations
#!/usr/bin/env python3
"""
w3-02 — Fast-Path Promotion Deltas

Watch per-intent fast-path success rates.  When an intent hits 3 consecutive
positive outcomes, promote it to early fast-track (skip confidence gate).
"""

import json
from datetime import datetime, timezone
from pathlib import Path

_LOG   = Path(__file__).resolve().parent.parent.parent / "data" / "v26_run_log.jsonl"
_STATE = Path(__file__).resolve().parent.parent.parent / "data" / "promotion_state.jsonl"
_PROMOTION_STREAK = 3


def _load_state() -> dict:
    if not _STATE.exists():
        return {}
    state = {}
    for line in _STATE.read_text().splitlines():
        try:
            state.update(json.loads(line))
        except Exception:
            pass
    return state


def _save_state(state: dict) -> None:
    try:
        with open(_STATE, 'a') as f:
            f.write(json.dumps(state, ensure_ascii=False) + '\n')
    except Exception:
        pass


def check(record_fn=None) -> dict:
    """Return {intent: 'promoted'|'pending'|'demoted'} mapping."""
    if not _LOG.exists():
        return {}
    try:
        lines = _LOG.read_text().splitlines()[-200:]
    except Exception:
        return {}
    state = _load_state()
    per_intent: dict = {}
    for line in lines:
        try:
            rec = json.loads(line)
        except Exception:
            continue
        intent = rec.get('intent', '')
        outcome= rec.get('outcome', '')
        if not intent:
            continue
        per_intent.setdefault(intent, []).append(outcome)

    result = {}
    for intent, outcomes in per_intent.items():
        tail = outcomes[-_PROMOTION_STREAK:]
        if len(tail) < _PROMOTION_STREAK:
            continue
        prev = state.get(intent, {})
        streak_ok = all(o in ('positive', 'neutral') for o in tail)
        if streak_ok:
            result[intent] = 'promoted'
            state[intent] = {**prev, 'promoted': True, 'streak': len(tail)}
        elif intent in state and state[intent].get('promoted'):
            # demote on failure streak
            fail_streak = sum(1 for o in tail if o not in ('positive', 'neutral'))
            if fail_streak >= 2:
                result[intent] = 'demoted'
                state[intent]['promoted'] = False
            else:
                result[intent] = 'promoted'
        else:
            result[intent] = 'pending'
    _save_state(state)
    return result
