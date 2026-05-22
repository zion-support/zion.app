#!/usr/bin/env python3
"""cc_memory.py — suggest CC addresses from reply_all_cache memory."""

import json
from pathlib import Path
from datetime import datetime, timezone

DATA = Path.home() / '.openclaw' / 'workspace' / 'zion.app' / 'data'
CACHE_FILE = DATA / 'reply_all_cache.json'
_COOLDOWN_DAYS = 14

def _load_cache():
    try:
        return json.loads(CACHE_FILE.read_text())
    except Exception:
        return {}

def suggest_cc_from_memory(sender: str, thread_id: str, members: list) -> str:
    """Return comma-separated CC addresses active in this thread before."""
    cache = _load_cache()
    cache_key = f"{sender}|{thread_id}"
    prev = cache.get(cache_key, {})
    prev_cc = prev.get("use_cc", "")
    prev_ts = prev.get("decided_at", "")
    if not prev_cc or not prev_ts:
        return ""
    # Check cooldown — skip if last CC set < 14 days ago
    try:
        dt_prev = datetime.fromisoformat(prev_ts)
        dtd = (datetime.now(timezone.utc) - dt_prev).days
        if 0 <= dtd < _COOLDOWN_DAYS:
            return ""  # cooldown active
    except Exception:
        pass
    # Filter: keep only addresses not already in members
    already = {m.strip().lower() for m in members if m}
    suggestions = [a.strip() for a in prev_cc.split(",")
                   if a.strip() and a.strip().lower() not in already]
    return ", ".join(suggestions)
