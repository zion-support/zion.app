#!/usr/bin/env python3
"""scripts/cc_memory.py — suggest CC addresses from reply_all_cache memory."""

import json
from pathlib import Path
from datetime import datetime, timezone

DATA    = Path(__file__).resolve().parent.parent / "data"
CACHE   = DATA / "reply_all_cache.json"
COOLDOWN = 14   # calendar days

def _load_cache():
    try: return json.loads(CACHE.read_text())
    except Exception: return {}

def suggest_cc_from_memory(sender: str, thread_id: str, members: list) -> str:
    """Return comma-separated CC addresses that were active in this thread."""
    cache = _load_cache()
    key   = f"{sender}|{thread_id}"
    prev  = cache.get(key, {})
    prev_cc = prev.get("use_cc", "")
    prev_ts = prev.get("decided_at", "")
    if not prev_cc or not prev_ts:
        return ""
    try:
        dt_prev = datetime.fromisoformat(prev_ts)
        dtd = (datetime.now(timezone.utc) - dt_prev).days
        if 0 <= dtd < COOLDOWN:
            return ""   # cooldown active
    except Exception:
        pass
    already = {m.strip().lower() for m in members if m}
    return ", ".join(
        a.strip() for a in prev_cc.split(",")
        if a.strip() and a.strip().lower() not in already
    )
