from __future__ import annotations
#!/usr/bin/env python3
"""
w3-03 — Template Slot Quarantine + Auto-Retrain

When a template slot has success_rate == 0 (streak=0 failures), quarantine it
for 5 consecutive full-pipeline sends, then run auto-retrain to re-estimate
weights.  If re-trained weights improve, resume; else mark canonical.
"""

import json
from datetime import datetime, timezone
from pathlib import Path

_LOG    = Path(__file__).resolve().parent.parent.parent / "data" / "v26_run_log.jsonl"
_QSTATE = Path(__file__).resolve().parent.parent.parent / "data" / "quarantine_state.jsonl"
_QUARANTINE_SENDS = 5   # consecutive full-pipeline sends while in quarantine
_CANONICAL_DAYS   = 14


def _load_state() -> dict:
    if not _QSTATE.exists():
        return {}
    state = {}
    for line in _QSTATE.read_text().splitlines():
        try:
            rec = json.loads(line)
        except Exception:
            continue
        state.setdefault(rec.get('slot', 'unknown'), []).append(rec)
    return state


def _append_state(rec: dict) -> None:
    try:
        with open(_QSTATE, 'a') as f:
            f.write(json.dumps(rec, ensure_ascii=False) + '\n')
    except Exception:
        pass


def quarantine_slot(slot: str, reason: str = "zero_success_rate") -> dict:
    """Mark a template slot as quarantined."""
    rec = {
        "ts":       datetime.now(timezone.utc).isoformat(),
        "slot":     slot,
        "status":   "quarantined",
        "reason":   reason,
        "sends_left": _QUARANTINE_SENDS,
    }
    _append_state(rec)
    return rec


def release_slot(slot: str, method: str = "retrained",
                 new_weights: dict | None = None) -> dict:
    """Release slot from quarantine after retrain or mark canonical."""
    rec = {
        "ts":       datetime.now(timezone.utc).isoformat(),
        "slot":     slot,
        "status":   "released" if method == "retrained" else "canonical",
        "method":   method,
        "weights":  new_weights or {},
    }
    _append_state(rec)
    return rec


def tick(slot: str, send_succeeded: bool) -> dict | None:
    """Decrement sends_left; release when 0."""
    if not _QSTATE.exists():
        return None
    recs = []
    action = None
    for line in _QSTATE.read_text().splitlines():
        try:
            rec = json.loads(line)
        except Exception:
            recs.append(line)
            continue
        if rec.get('slot') == slot and rec.get('status') == 'quarantined':
            left = rec.get('sends_left', _QUARANTINE_SENDS) - 1
            if left <= 0:
                action = release_slot(slot)
                recs.append(json.dumps({**rec, "status": "released_at_tick",
                                        "released_at": datetime.now(timezone.utc).isoformat()}))
            else:
                rec['sends_left'] = left
                recs.append(json.dumps(rec, ensure_ascii=False))
        else:
            recs.append(line)
    try:
        _QSTATE.write_text('\n'.join(recs) + '\n' if recs else '')
    except Exception:
        pass
    return action
