#!/usr/bin/env python3
"""
V28 — SenderFeedbackOracle

• Persistent per-sender reply-all learning (JSONL store)
• No LLM calls — pure statistics
• Reads V26/27 sender metadata when available

Store layout (data/sender_feedback.jsonl):
  {"ts": "2026-05-20T12:00:00+00:00", "sender": "alice@example.com",
   "event": "reply_all_override", "override_to": "explicit",
   "thread_id": "..."}

Surfaced preference (in-memory cache + on-disk persistence):
  sender → {"reply_all_bias": float 0-1, "n_overrides": int, "last_seen": iso}
    reply_all_bias = fraction of overrides that were "yes" (1.0 = always reply-all, 0.0 = never)
"""
from __future__ import annotations

import json, time, threading
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Optional

WORKSPACE = Path(__file__).resolve().parent.parent.parent
DATA      = WORKSPACE / "data"
STORE     = DATA / "sender_feedback.jsonl"
CACHE_TTL = 300          # seconds before cache is considered stale

# ── Data classes ─────────────────────────────────────────────────────────────

class SenderPref:
    """Aggregated per-sender preference derived from override events."""
    __slots__ = ("sender", "yes", "no", "total", "last_seen", "first_seen")

    def __init__(self, sender: str) -> None:
        self.sender   = sender
        self.yes      = 0
        self.no       = 0
        self.total    = 0
        self.last_seen: Optional[str] = None
        self.first_seen: Optional[str] = None

    @property
    def bias(self) -> float:
        """1.0 = always chose to reply-all, 0.0 = never, 0.5 = neutral."""
        if self.total == 0:
            return 0.5
        return self.yes / self.total

    def to_dict(self) -> dict:
        return {
            "sender":      self.sender,
            "reply_all_bias": round(self.bias, 4),
            "n_yes":       self.yes,
            "n_no":        self.no,
            "n_overrides": self.total,
            "last_seen":   self.last_seen,
            "first_seen":  self.first_seen,
        }


# ── Thread-safe store ────────────────────────────────────────────────────────

class SenderFeedbackStore:
    """
    Append-only JSONL store with in-memory cache + disk persistence.

    Usage
    -----
    >>> store = SenderFeedbackStore()
    >>> store.record("alice@example.com", "reply_all_override", override_to="yes", thread_id="t1")
    >>> pref = store.get_pref("alice@example.com")
    >>> pref.bias   # 1.0
    """

    _cache:      dict[str, SenderPref] = {}
    _cache_ts:   float                 = 0.0
    _lock:       threading.RLock       = threading.RLock()

    def __init__(self, store_path: Optional[Path | str] = None) -> None:
        self._path = Path(store_path) if store_path else STORE
        self._path.parent.mkdir(parents=True, exist_ok=True)
        self._prime_cache()

    # ── cache management ─────────────────────────────────────────────────────

    def _prime_cache(self) -> None:
        """Load all events from disk into _cache on first access."""
        with self._lock:
            if self._cache and (time.monotonic() - self._cache_ts) < CACHE_TTL:
                return  # fresh cache — skip
            self._cache.clear()
            if not self._path.exists():
                self._cache_ts = time.monotonic()
                return
            with open(self._path) as f:
                for line in f:
                    line = line.strip()
                    if not line:
                        continue
                    try:
                        ev = json.loads(line)
                    except json.JSONDecodeError:
                        continue
                    self._apply_event(ev)
            self._cache_ts = time.monotonic()

    def _apply_event(self, ev: dict) -> None:
        sender = ev.get("sender", "")
        if not sender:
            return
        pref = self._cache.setdefault(sender, SenderPref(sender))
        event = ev.get("event", "")
        ts    = ev.get("ts")
        if ts:
            if pref.first_seen is None:
                pref.first_seen = ts
            pref.last_seen = ts
        if event == "reply_all_override":
            to_val = str(ev.get("override_to", "")).lower()
            if to_val in ("yes", "true", "1"):
                pref.yes += 1
                pref.total += 1
            elif to_val in ("no", "false", "0"):
                pref.no += 1
                pref.total += 1
            else:
                pref.total += 1   # count but don't bias

    # ── write ────────────────────────────────────────────────────────────────

    def record(self, sender: str, event: str, **kwargs: Any) -> None:
        """Append one event to the store and update cache."""
        ts = datetime.now(timezone.utc).isoformat()
        record: dict = {"ts": ts, "sender": sender, "event": event}
        record.update(kwargs)
        line = json.dumps(record, ensure_ascii=False) + "\n"
        with self._lock:
            self._apply_event(record)          # update in-memory
            self._cache_ts = time.monotonic()  # reset TTL
            with open(self._path, "a") as f:
                f.write(line)

    # ── read ─────────────────────────────────────────────────────────────────

    def get_pref(self, sender: str) -> SenderPref:
        """Return the SenderPref for *sender*; unknown → neutral Pref."""
        with self._lock:
            self._prime_cache()
            return self._cache.get(sender, SenderPref(sender))

    def top_senders(self, n: int = 20, min_overrides: int = 3) -> list[dict]:
        """Most active senders with their bias scores."""
        with self._lock:
            self._prime_cache()
            ranked = sorted(
                (p for p in self._cache.values() if p.total >= min_overrides),
                key=lambda p: abs(p.bias - 0.5),
                reverse=True
            )
            return [p.to_dict() for p in ranked[:n]]

    def unload(self) -> None:
        with self._lock:
            self._cache.clear()
            self._cache_ts = 0.0

    def dump_summary(self) -> dict:
        with self._lock:
            self._prime_cache()
            total_events = sum(p.total for p in self._cache.values())
            biased = sum(1 for p in self._cache.values() if abs(p.bias - 0.5) >= 0.2)
            return {
                "senders_tracked":  len(self._cache),
                "total_events":     total_events,
                "biased_senders":   biased,
                "store_path":       str(self._path),
            }


# ── Feedback learner ─────────────────────────────────────────────────────────

class FeedbackLearner:
    """
    Consumes SenderFeedbackStore and produces a routing hint dict for use
    inside the V26 pipeline (no LLM required).

    Three verdict tiers:
      "likely_yes"  — bias ≥ 0.7, ≥3 overrides
      "likely_no"   — bias ≤ 0.3, ≥3 overrides
      "neutral"     — else
    """

    def __init__(self, store: Optional[SenderFeedbackStore] = None) -> None:
        self.store = store or SenderFeedbackStore()

    def route(self, sender: str) -> dict:
        """Return routing hint for *sender* in V26 pipeline."""
        pref     = self.store.get_pref(sender)
        bias     = pref.bias
        n        = pref.total
        tier     = "neutral"
        enforce  = "default"

        if n >= 3:
            if bias >= 0.7:
                tier = "likely_yes"
                enforce = "always_cc"     # safe default: include in CC
            elif bias <= 0.3:
                tier = "likely_no"
                enforce = "confirm"       # surface for human before CC

        return {
            "sender":          sender,
            "feedback_tier":   tier,
            "reply_all_bias":  bias,
            "n_overrides":     n,
            "enforce":         enforce,       # "always_cc" | "confirm" | "default"
            "last_seen":       pref.last_seen,
        }
