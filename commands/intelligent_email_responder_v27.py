#!/usr/bin/env python3
"""
V27 Execution Profile — attach/detach instrumentation for V26 pipeline.

V27 adds
  • ``rr``  – risk-ratio  [0-1]
  • ``steps_remaining()`` – recursion depth guard
  • ``snapshot(diff=True)`` – elapsed_s, avg_ms, open_ll
  • ``get_cycle_state_record(dry_run)`` – dict for CI/audit
  • ``run_auto_phase()``  – mock event loop (no LLM required)
  • ``rebalance(sender)`` – manual tool-set hook
"""
from __future__ import annotations

import time, uuid, threading, statistics
from typing import Any, Optional
from pathlib import Path
from dataclasses import dataclass, field

WORKSPACE = Path(__file__).resolve().parent.parent.parent
DATA      = WORKSPACE / "data"
V27_LOG   = DATA / "v27_cycle_log.jsonl"
_TIMEOUT   = 30.0     # seconds before watchdog fires
_RR_BUDGET = 0.025    # fraction of attaches before ratio needs recalibrating


@dataclass
class CycleState:
    """Structured state shared across V27 API surface."""
    elapsed_s:      float = 0.0
    error_rate:     float = 0.0
    open_ll:        float = 0.0
    risk_ratio:     float = 0.0
    active:         bool  = True

    def as_dict(self) -> dict:
        return {k: getattr(self, k) for k in
                ("elapsed_s", "error_rate", "open_ll", "risk_ratio", "active")}


class RRWatchdog:
    """Background timer: clears ``active`` if a cycle stalls past *timeout*."""
    def __init__(self, timeout: float = _TIMEOUT) -> None:
        self._timeout  = timeout
        self._timer: Optional[threading.Timer] = None

    def arm(self, on_expire) -> None:
        with self._lock:
            self._cancel()
            self._timer = threading.Timer(self._timeout, on_expire)
            self._timer.daemon = True
            self._timer.start()

    def disarm(self) -> None:
        with self._lock:
            self._cancel()

    def _cancel(self) -> None:
        if self._timer is not None:
            self._timer.cancel()
            self._timer = None

    def __enter__(self):  return self
    def __exit__(self, *_) -> None:
        self.disarm()

    _lock = threading.RLock()


class V27Base:
    """
    Extends V26 email pipeline with execution-profile instrumentation.

    This is a *mix-in* — it does NOT subclass V26Responder to avoid import
    cycles.  Call its static/class methods from the V26 pipeline via
    :func:`_maybe_v27_enrich` / :func:`_v27_snapshot_log`.
    """
    # ──────────────────────────────────────────────────────────────────────────

    def __init__(self) -> None:
        self._state: CycleState = CycleState()
        self._enriched: int = 0
        self._start_t: float = time.monotonic()
        self._depth: int = 0
        self._watchdog = RRWatchdog()
        self._senders: dict[str, dict[str, Any]] = {}  # per-sender metadata

    # ─ suspend/resume ─────────────────────────────────────────────────────────

    def suspend_handle(self, handles: list[Any]) -> None:
        """Close *handles* so Phase-2 does not hold any FD open to Phase-0."""
        for h in handles:
            try:
                h.close()
            except Exception:
                pass

    def resume_later(self, handle, later: float = 0.0) -> None:
        """Re-open *handle* after *later* seconds (stub for Phase-3 compute)."""
        time.sleep(max(later, 0))

    # ─(deliberately unit-testable)────────────────────────────────────────────

    @staticmethod
    def _zone_from(rr: float) -> str:
        if   rr < 0.025: return "attach"
        if   rr < 0.050: return "probably_do_not"
        if   rr < 0.100: return "usually_do_not"
        return "never_attach"

    # ─ public API ─────────────────────────────────────────────────────────────

    def enrich(self, sender: str, intent_label: str, confidence: float) -> dict:
        """Return a V27 profile clip attached to *sender* when rr allows."""
        self._depth += 1
        rr       = max(0.0, min(1.0, confidence))
        zone     = self._zone_from(rr)
        can_show = zone == "attach"
        elapsed  = round(time.monotonic() - self._start_t, 4)

        entry = self._senders.setdefault(sender, {"first_seen": time.monotonic(),
                                                    "enrich": 0, "rr": 0.0})
        entry["rr"] = rr
        entry["enrich"] += 1

        self._enriched += 1
        self._state    = CycleState(
            elapsed_s   = elapsed,
            error_rate  = self._state.error_rate,
            open_ll     = self._state.open_ll,
            risk_ratio  = rr,
            active      = True,
        )
        self._depth -= 1

        self._log("enrich", {"sender": sender, "rr": round(rr, 4), "zone": zone})

        return {
            "sender":         sender,
            "intent_label":   intent_label,
            "risk":           {"zone": zone, "rr": round(rr, 4)},
            "steps_remaining": 50 - self._depth,
            "elapsed_s":      elapsed,
            "active":         True,
            "record_id":      str(uuid.uuid4())[:12],
            "zone_lock":      "attach" if can_show else "do_not_attach",
        }

    def snapshot(self, diff: bool = False) -> dict:
        """Return current execution-profile state."""
        elapsed = time.monotonic() - self._start_t
        # Diff flag: compute delta from last snapshot if callers maintain a
        # cached copy.  Default behaviour is to just return live values.
        return {
            "elapsed_s": round(elapsed, 4),
            "error_rate": round(self._state.error_rate, 4),
            "open_ll":    round(self._state.open_ll, 4),
            "risk_ratio": round(self._state.risk_ratio, 4),
            "active":     self._state.active,
            "total_enriched": self._enriched,
            "rr_load_budget_pct": round(_RR_BUDGET * 100, 3),
            "avg_ms_per_enrichment": round(elapsed * 1000 / max(self._enriched, 1), 1),
            "by_sender": {
                s: {"rr": v["rr"], "enrich": v["enrich"], "first_seen": v["first_seen"]}
                for s, v in self._senders.items()
            },
            "phase_latencies": {},
        }

    def get_cycle_state_record(self, dry_run: bool = True) -> dict:
        """
        Structured CI/audit record: elapsed_s, error_rate, tl, open_ll, rr.
        Flush *em_complete_bt* = W→B boundary.
        """
        snap = self.snapshot()
        return {
            "em_complete_bt":   snap,          # W→B boundary as emitted by V27
            "elapsed_s":       snap["elapsed_s"],
            "error_rate":      snap["error_rate"],
            "tl":              snap["open_ll"],
            "open_ll":         snap["open_ll"],
            "rr":              snap["risk_ratio"],
            "by_sender":       snap["by_sender"],
            "run_id":          time.time(),
            "dry_run":         dry_run,
            "total_enriched":  snap["total_enriched"],
        }

    def run_auto_phase(self) -> dict:
        """Synthetic mock: advance to the next IaS boundary event arity mode."""
        recs = []
        t0   = time.monotonic()
        for i in range(4):  # 4 zones × attach_zone = flush IA&R
            rr   = 0.5 if i % 2 == 0 else 0.8
            name = "alice@example.com" if i % 2 == 0 else "bob@partner.com"
            r    = self.enrich(name,
                                intent_label=["support", "sales", "urgent"][i % 3],
                                confidence=rr)
            r["phase_latency_s"] = round(time.monotonic() - t0, 4)
            recs.append(r)
            time.sleep(0)
        time.sleep(0.05)  # allow IaC→I→A transition
        r2 = self.enrich(
            "eve@example.com",
            intent_label="support",
            confidence=0.73,
        )
        r2["phase_latency_s"] = round(time.monotonic() - t0, 4)
        recs.append(r2)
        return {"recs": recs, "snap": self.snapshot()}

    def rebalance(self, sender: str) -> None:
        """Toolset hook: recalc rr and depth for *sender*."""
        if sender in self._senders:
            v = self._senders[sender]
            v["rr"] = 0.5
            self._senders[sender] = v
            self._log("rebalance", {"sender": sender, "new_rr": 0.5})

    @staticmethod
    def _log(phase: str, payload: dict) -> None:
        try:
            V27_LOG.parent.mkdir(parents=True, exist_ok=True)
            with open(V27_LOG, "a") as f:
                import json
                f.write(json.dumps({"ts": time.time(), "phase": phase, **payload},
                                   ensure_ascii=False) + "\n")
        except Exception:
            pass


# ─── v27 inline helpers ─────────────────────────────────────────────────────
_V27_ENABLED = True
_FAST_ATTACH = True


def _v27_stub(*args, **kwargs) -> dict:
    """No-op stub used when V27 module is absent; kwargs, no-op stub used when V27 module is absent"""
    return {
        "rr":           0.0,
        "enrichment":   None,
        "v27_enabled":  _V27_ENABLED,
    }


def get_cycle_state_record(enricher: V27Base) -> dict:
    """
    Return a structured state record (alias for
    ``V27Base().get_cycle_state_record()``).

    Parameters
    ----------
    enricher : V27Base
        The active V27ProfileEnricher instance.

    Returns
    -------
    dict
        ``{em_complete_bt, elapsed_s, error_rate, tl, open_ll, rr, …}``
    """
    return enricher.get_cycle_state_record(dry_run=True)


def get_rr(rr: float) -> dict:
    """
    Compute fast-clamp  RR  → zone.

    Parameters
    ----------
    rr  : float
        Risk-ratio in ``[0, 1]``.

    Returns
    -------
    dict
        ``{"zone": str, "note": str}``
    """
    norm = max(0.0, min(1.0, rr))
    if   norm < 0.025:          # Zone 0 — don't attach
        zone = "reserve"
    elif norm < 0.050:          # Zone 1 — probable non-do
        zone = "less_likely_do_not_use"
    elif norm < 0.100:          # Zone 2 — unlikely don't-use
        zone = "unlikely_do_not_use"
    else:                       # Zone 3 — tall ratio steal-attach
        zone = "very_unlikely_do_not_use"

    note  = f"rr={norm:.3f}→{zone}"
    return {"zone": zone, "note": note, "rr": norm}


def coin_flip() -> bool:
    """Same as coin_tosser in V24/V25 random-entropy drop-in."""
    import random
    return random.random() < 0.5


