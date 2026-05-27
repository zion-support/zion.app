#!/usr/bin/env python3
"""
V31-P1: Thread Context Bank
Per-thread memory: intent, CC used, last response sent, participants.
Survives across sessions so multi-turn threads don't restart from zero.
"""
import json
from datetime import datetime, timezone, timedelta
from pathlib import Path

_WORKSPACE = Path(__file__).resolve().parent.parent.parent
DATA = _WORKSPACE / 'data'
_DB = DATA / 'thread_context.jsonl'

def _now(): return datetime.now(timezone.utc).isoformat()

def save_thread_context(thread_id: str, context: dict) -> None:
    """Append a context snapshot for a thread."""
    entry = {"ts": _now(), "thread_id": thread_id, **context}
    try:
        with open(_DB, "a") as f:
            f.write(json.dumps(entry, ensure_ascii=False) + "\n")
    except Exception:
        pass

def load_thread_context(thread_id: str, max_age_hours: int = 72) -> list:
    """Return all context entries for thread_id within max_age_hours."""
    if not _DB.exists():
        return []
    cutoff = (datetime.now(timezone.utc) - timedelta(hours=max_age_hours)).isoformat()
    results = []
    try:
        with open(_DB) as f:
            for line in f:
                line = line.strip()
                if not line: continue
                try:
                    row = json.loads(line)
                except json.JSONDecodeError:
                    continue
                if row.get("thread_id") != thread_id: continue
                ts = row.get("ts", "")
                if ts >= cutoff:
                    results.append(row)
    except Exception:
        pass
    return results

def touch_thread(thread_id: str, participant: str = "", note: str = "") -> None:
    """Record a lightweight activity ping for a thread."""
    entry = {"ts": _now(), "thread_id": thread_id,
             "participant": participant, "note": note, "type": "touch"}
    try:
        with open(_DB, "a") as f:
            f.write(json.dumps(entry) + "\n")
    except Exception:
        pass

def get_thread_summary(thread_id: str) -> dict:
    """Produce a compact summary of thread history."""
    entries = load_thread_context(thread_id, max_age_hours=168)  # 7 days
    if not entries:
        return {"exists": False}
    intents = [e.get("intent") for e in entries if e.get("intent")]
    ccs = [e.get("use_cc") for e in entries if e.get("use_cc")]
    return {
        "exists": True,
        "entry_count": len(entries),
        "first_seen": entries[0]["ts"] if entries else "",
        "last_seen": entries[-1]["ts"] if entries else "",
        "intents_seen": list(dict.fromkeys(intents)),
        "ccs_used": list(dict.fromkeys(ccs)),
    }
