#!/usr/bin/env python3
"""
V32-P2: Inbox Triage
Score every incoming email: urgency × sender_tier × reply_all_required.
Produce a digest of the top-5 highest-priority items.
"""
import json
from datetime import datetime, timezone
from pathlib import Path

_WORKSPACE = Path(__file__).resolve().parent.parent.parent
DATA = _WORKSPACE / 'data'
V31 = _WORKSPACE / 'commands' / 'v31_modules'
sys_path_added = False
if str(V31) not in __import__('sys').path:
    __import__('sys').path.insert(0, str(V31)); sys_path_added = True
import sender_reputation_tracker as srt
from urgency_normalizer import normalize_urgency

_DB = DATA / 'triage_digest.jsonl'
_WEIGHTS = {"sender_tier": 0.40, "urgency": 0.35, "reply_all_required": 0.15, "recency": 0.10}
_TIER_SCORE = {"vip": 90, "trusted": 70, "known": 50, "unknown": 30, "risky": 95, "spam_suspect": 80}
_URGENCY_SCORE = {"urgent": 95, "high": 70, "medium": 50, "low": 30}
_RAR_REPLY_ALL = {"urgent", "meeting", "partnership"}

def _now(): return datetime.now(timezone.utc).isoformat()

def score_email(sender: str, urgency: str, reply_all_ok: bool = False, age_hours: float = 0.0) -> dict:
    rep = srt.get_reputation(sender)
    tier = rep.get("tier", "unknown")
    norm = normalize_urgency(urgency, message_ts=(datetime.now(timezone.utc) - __import__('datetime').timedelta(hours=age_hours)).isoformat())["normalized"]
    recency = max(0.0, 1.0 - age_hours / 72.0)
    tier_s = _TIER_SCORE.get(tier, 30)
    ur_s   = _URGENCY_SCORE.get(norm, 30)
    rar_s  = 80 if reply_all_ok and norm in _RAR_REPLY_ALL else 20
    score = round(tier_s * _WEIGHTS["sender_tier"] +
                  ur_s   * _WEIGHTS["urgency"] +
                  rar_s  * _WEIGHTS["reply_all_required"] +
                  recency * 100 * _WEIGHTS["recency"], 1)
    return {"score": score, "tier": tier, "urgency_normalized": norm,
            "reply_all_required": reply_all_ok and norm in _RAR_REPLY_ALL, "recency": round(recency,2)}

def log_score(email_id: str, sender: str, subject: str, score_result: dict) -> None:
    entry = {"ts": _now(), "email_id": email_id, "sender": sender,
             "subject": subject[:80], **score_result}
    try:
        with open(_DB, "a") as f:
            f.write(json.dumps(entry, ensure_ascii=False) + "\n")
    except Exception:
        pass

def build_digest(top_n: int = 5, max_age_hours: int = 24) -> dict:
    """Return top-N priority emails from the triage window."""
    if not _DB.exists():
        return {"status": "no_data", "items": []}
    cutoff = (datetime.now(timezone.utc) - __import__('datetime').timedelta(hours=max_age_hours)).isoformat()
    entries = []
    try:
        with open(_DB) as f:
            for line in f:
                line = line.strip()
                if not line: continue
                try:
                    row = json.loads(line)
                except json.JSONDecodeError:
                    continue
                if row.get("ts", "") >= cutoff:
                    entries.append(row)
    except Exception:
        pass
    # Deduplicate by email_id (latest score wins)
    seen = {}
    for e in entries:
        eid = e.get("email_id", "")
        if eid not in seen or e.get("ts", "") > seen[eid].get("ts", ""):
            seen[eid] = e
    ranked = sorted(seen.values(), key=lambda x: -x.get("score", 0))
    return {"status": "ok", "total": len(ranked), "items": ranked[:top_n],
            "window_hours": max_age_hours}

def format_digest_text(digest: dict) -> str:
    if not digest.get("items"):
        return "Inbox: no high-priority emails in the last 24h"
    lines = [f"📬 Top {len(digest['items'])} priority emails:"]
    for i, item in enumerate(digest["items"], 1):
        s = item.get("score", 0)
        sender = item.get("sender", "unknown")
        norm = item.get("urgency_normalized", "?")
        subj = item.get("subject", "?")[:50]
        lines.append(f"{i}. [{norm.upper()}] {sender} — {subj} (score={s})")
    return "\n".join(lines)
