#!/usr/bin/env python3
"""V40-C: Thread Headroom Lock"""
from __future__ import annotations
import json
from dataclasses import dataclass, field, asdict
from datetime import datetime, timezone
from pathlib import Path

REPO   = Path(__file__).resolve().parent.parent.parent
DATA   = REPO / "data"
POLICY_PATH = DATA / "policies" / "headroom_policies.json"
LOG_PATH    = DATA / "logs"  / "thread_headroom_lock.log"


@dataclass
class ThreadHeadroomEvent:
    ts:      str = field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    gate:    str = "thread_headroom"
    thread_id: str = ""
    intent:  str = ""
    action:  str = ""
    remaining: int = 0
    min_required: int = 0
    depth:   int = 0
    reason:  str = ""

    def to_dict(self) -> dict:
        return asdict(self)


def _write_log(ev: ThreadHeadroomEvent) -> None:
    try:
        LOG_PATH.parent.mkdir(parents=True, exist_ok=True)
        with LOG_PATH.open("a") as f:
            f.write(json.dumps(ev.to_dict()) + "\n")
    except Exception:
        pass


def _load_policies() -> dict:
    d: dict = {
        "version": "1.0",
        "policies": {
            "default":       {"min_headroom": 2},
            "urgent":        {"min_headroom": 1},
            "sales_lead":    {"min_headroom": 3},
            "support_issue": {"min_headroom": 2},
            "meeting":       {"min_headroom": 2},
            "cancellation":  {"min_headroom": 0},
        },
    }
    try:
        if POLICY_PATH.exists():
            raw = json.loads(POLICY_PATH.read_text())
            if isinstance(raw, dict) and "policies" in raw:
                d["policies"].update(raw["policies"])
    except Exception:
        pass
    return d


# Test helper — not for production use
def _test_set_remaining(lock_obj, thread_id: str, value: int) -> None:
    """Force remaining headroom for testing."""
    lock_obj._remaining_headroom = lambda tid, _v=value: _v


class ThreadHeadroomLock:
    def __init__(self) -> None:
        self._policies: dict = _load_policies()["policies"]

    def _hf(self, intent: str) -> int:
        pol = self._policies.get(intent, self._policies.get("default", {}))
        if not isinstance(pol, dict):
            pol = {}
        return int(pol.get("min_headroom", 2))

    def _remaining_headroom(self, current_depth: int) -> int:
        return max(0, self._hf("default") - current_depth)

    def check(self, thread_id: str, intent: str,
              thread_depth: int = 0) -> dict:
        min_req   = self._hf(intent)
        remaining = max(0, min_req - thread_depth)
        blocked   = remaining < min_req
        ev = ThreadHeadroomEvent(
            thread_id=thread_id, intent=intent,
            action="blocked" if blocked else "pass",
            remaining=remaining, min_required=min_req, depth=thread_depth,
            reason="" if not blocked else
                  f"headroom_exhausted: remaining={remaining} < min_required={min_req}",
        )
        _write_log(ev)
        out: dict = {"blocked": blocked, "remaining": remaining,
                     "min_required": min_req, "intent": intent,
                     "thread_id": thread_id, "depth": thread_depth}
        if blocked:
            out["reason"] = ev.reason
        return out

    def inject_thread_headroom(self, tid: str, intent: str,
                               thread_depth: int = 0) -> dict:
        return self.check(tid, intent, thread_depth)


# Harness expects these at MODULE level
def inject_thread_headroom(tid: str, intent: str,
                           thread_depth: int = 0) -> dict:
    return _HEADROOM_LOCK.check(tid, intent, thread_depth)


_HEADROOM_LOCK = ThreadHeadroomLock()
