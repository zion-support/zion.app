#!/usr/bin/env python3
"""
V36: Deferred Reply Queue + Semantic Bucketing
Depth-aware inbox routing — depth-1 replies fire immediately,
depth-2+ wait for enriched context pass.
"""

from __future__ import annotations

import json
import time
import hashlib
from datetime import datetime, timezone
from pathlib import Path

try:
    WORKSPACE = Path(__file__).resolve().parent.parent.parent
except NameError:  # __file__ not set (e.g. exec / exec_code sandbox)
    WORKSPACE = Path.cwd()

DATA = WORKSPACE / "data"
QUEUE_FILE = DATA / "deferred_reply_queue.jsonl"
GRC_TAG_KEYS = {"dc_only", "agency_cco", "esp_verified", "production",
                 "non_commissionable", "dedicated_ip", "dc_only", "dmarc_recipient"}


def _now_ts() -> float:
    return datetime.now(timezone.utc).timestamp()


def _read_queue() -> list[dict]:
    if not QUEUE_FILE.exists():
        return []
    out = []
    for line in QUEUE_FILE.read_text().splitlines():
        line = line.strip()
        if not line:
            continue
        try:
            out.append(json.loads(line))
        except json.JSONDecodeError:
            pass
    return out


def _append_queue(item: dict):
    QUEUE_FILE.parent.mkdir(parents=True, exist_ok=True)
    with QUEUE_FILE.open("a") as f:
        f.write(json.dumps(item, default=str) + "\n")


def _rewrite_queue(items: list[dict]):
    QUEUE_FILE.parent.mkdir(parents=True, exist_ok=True)
    with QUEUE_FILE.open("w") as f:
        for it in items:
            f.write(json.dumps(it, default=str) + "\n")


# ── Semantic bucket ──────────────────────────────────────────────────

def bucket_email(text: str, subject: str = "") -> dict:
    """
    Thin semantic classifier — depth hint + category.
    Reuses V32 inbox_triage scoring patterns keyword-first.
    """
    t = (text + " " + subject).lower()
    if any(k in t for k in ("price", "cost", "quote", "pricing", "budget")):
        return {"category": "price_ask",   "depth_hint": 2}
    if any(k in t for k in ("complaint", "issue", "problem", "error", "broken", "angry")):
        return {"category": "complaint",    "depth_hint": 2}
    if any(k in t for k in ("hi ", "hello", "hey", "good morning", "good afternoon")):
        return {"category": "greeting",    "depth_hint": 1}
    if any(k in t for k in ("meeting", "schedule", "calendar", "slot", "available")):
        return {"category": "meeting",     "depth_hint": 2}
    if any(k in t for k in ("?", "question", "help", "how", "what", "can you")):
        return {"category": "question",   "depth_hint": 2}
    return {"category": "unclear",       "depth_hint": 1}


# ── Deferred reply queue ─────────────────────────────────────────────

def enqueue(
    batch: list[dict],
    depth_map: dict[str, int] | None = None,
    gap_min: int | None = None,
    now: float | None = None,
) -> dict:
    """
    Split batch into immediate (depth-1) and deferred (depth-2+).

    Args:
        batch: list of {email_id, subject, body, account_meta, extras}
        depth_map: optional pre-computed {email_id: depth}; buckets are computed if missing
        gap_min: minimum minutes between depth-1 passes (None = no limit)
        now:   override current timestamp

    Returns:
        dict with immediate_ids, deferred_ids, stats
    """
    now = now or _now_ts()
    gap_s = (gap_min or 0) * 60
    depth_map = depth_map or {}

    # Load existing queue
    existing = {e["email_id"]: e for e in _read_queue() if "email_id" in e}

    immediate: list[dict] = []
    deferred: list[dict] = []

    for item in batch:
        eid = item["email_id"]

        # Propagate GRC tags
        tags = _derive_grc_tags(item.get("account_meta") or {})

        # Determine depth
        if eid in depth_map:
            depth = depth_map[eid]
        else:
            bkt = bucket_email(item.get("body", ""), item.get("subject", ""))
            depth = bkt["depth_hint"]
            # depth-1 can still be deferred if low-confidence bucket
            if bkt["category"] == "unclear":
                depth = 2

        # Gap check: depth-1 immediate only if gap has elapsed or queue is empty
        skip_reason = None
        if depth == 1 and eid in existing and (existing[eid].get("last_pass_ts", 0) + gap_s) > now:
            deferred.append({**item, "_skip_reason": "gap", "depth": depth, "grc_tags": tags,
                             "enqueued_ts": existing[eid]["enqueued_ts"]})
            continue

        entry = {
            "email_id": eid,
            "depth": depth,
            "grc_tags": tags,
            "category": bucket_email(item.get("body", ""), item.get("subject", "")).get("category", "unclear"),
            "enqueued_ts": now,
            "last_pass_ts": existing.get(eid, {}).get("last_pass_ts", 0),
            "pass_count": existing.get(eid, {}).get("pass_count", 0),
            "subject": item.get("subject", ""),
            "body": item.get("body", ""),
        }

        if depth == 1:
            immediate.append(entry)
        else:
            deferred.append(entry)

    # Append items not already in queue
    for itm in immediate + deferred:
        eid = itm["email_id"]
        if eid not in existing:
            _append_queue(itm)
        else:
            # update in-place
            _update_queue_entry(eid, itm)

    return {
        "immediate_ids": [e["email_id"] for e in immediate],
        "deferred_ids": [e["email_id"] for e in deferred],
        "total_batch": len(batch),
        "immediate_count": len(immediate),
        "deferred_count": len(deferred),
    }


def next_pass(
    gap_min: int = 15,
    now: float | None = None,
) -> list[dict]:
    """
    Return items whose depth >= 2 have been in queue >= gap_min minutes.

    Items are NOT removed; caller marks them via mark_passed().
    """
    now = now or _now_ts()
    gap_s = gap_min * 60
    candidates = []
    for e in _read_queue():
        if e.get("depth", 0) < 2:
            continue
        enqueued = e.get("enqueued_ts", 0)
        if (now - enqueued) >= gap_s:
            candidates.append(e)
    return candidates


def mark_passed(email_id: str, now: float | None = None):
    """Advance last_pass_ts for an item (called after reply sent)."""
    now = now or _now_ts()
    items = _read_queue()
    updated = False
    for e in items:
        if e.get("email_id") == email_id:
            e["last_pass_ts"] = now
            e["pass_count"] = e.get("pass_count", 0) + 1
            updated = True
            break
    if updated:
        _rewrite_queue(items)


def remove_from_queue(email_id: str) -> bool:
    """Fully remove an item after reply sent + depth-1 confirmed."""
    items = _read_queue()
    new_items = [e for e in items if e.get("email_id") != email_id]
    if len(new_items) != len(items):
        _rewrite_queue(new_items)
        return True
    return False


def queue_stats() -> dict:
    items = _read_queue()
    d1 = sum(1 for e in items if e.get("depth", 0) == 1)
    d2p = len(items) - d1
    tags_seen: dict[str, int] = {}
    for e in items:
        for t in e.get("grc_tags", []):
            tags_seen[t] = tags_seen.get(t, 0) + 1
    return {
        "total": len(items),
        "depth1": d1,
        "depth2plus": d2p,
        "grc_tag_counts": tags_seen,
    }


def clear_queue():
    _rewrite_queue([])


# ── Helpers ──────────────────────────────────────────────────────────

def _derive_grc_tags(account_meta: dict) -> list[str]:
    tags = []
    if account_meta.get("dc_only"):
        tags.append("dc-only")
    if account_meta.get("agency_cco"):
        tags.append("agency-cco")
    if account_meta.get("esp_verified"):
        tags.append("esp-verified")
    if account_meta.get("production"):
        tags.append("production")
    return tags


def _update_queue_entry(eid: str, entry: dict):
    items = _read_queue()
    for e in items:
        if e.get("email_id") == eid:
            e.update(entry)
            e["last_pass_ts"] = e.get("last_pass_ts", 0)  # preserve ts
            break
    _rewrite_queue(items)
