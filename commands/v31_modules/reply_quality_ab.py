#!/usr/bin/env python3
"""
V32-P1: Reply Quality A/B Split
Run two reply variants on same email, send the winner, log outcome.
After 50 samples, outcome_auto_learner can auto-pick the better pipeline.

Variants:
  A — fast_path (low-latency, LLM-light)
  B — full_pipeline (deep analysis, grammar checks, attachment parse)

Winner = reply_all_gap+overall_score composite over 10-mail sliding window.
"""
import json, hashlib
from datetime import datetime, timezone
from pathlib import Path

_WORKSPACE = Path(__file__).resolve().parent.parent.parent
DATA = _WORKSPACE / 'data'
V31 = _WORKSPACE / 'commands' / 'v31_modules'

sys_path_added = False
if str(V31) not in __import__('sys').path:
    __import__('sys').path.insert(0, str(V31))
    sys_path_added = True

import outcome_auto_learner as oal
from real_llm_verify import score_reply_quality

_RESULTS_DB = DATA / 'ab_split_results.jsonl'
_WINDOW = 10   # emails per rolling window
_MIN_WIN_MARGIN = 0.05   # A must beat B by ≥5% overall to be declared winner

def _now(): return datetime.now(timezone.utc).isoformat()
def _hash(text): return hashlib.sha256(text.encode()).hexdigest()[:8]

def log_ab_result(
    run_id: str,
    email_id: str,
    thread_id: str,
    intent_label: str,
    variant: str,           # "A" or "B"
    body: str,
    overall_score: float,
    reply_all_used: bool,
    use_cc: str,
    sent: bool,
) -> None:
    entry = {
        "ts": _now(), "run_id": run_id, "email_id": email_id, "thread_id": thread_id,
        "intent": intent_label, "variant": variant, "body_hash": _hash(body),
        "overall_score": overall_score, "reply_all_used": reply_all_used,
        "use_cc": use_cc, "sent": sent,
    }
    try:
        with open(_RESULTS_DB, "a") as f:
            f.write(json.dumps(entry, ensure_ascii=False) + "\n")
    except Exception:
        pass

def _load_recent(n: int = 50) -> list:
    if not _RESULTS_DB.exists():
        return []
    try:
        lines = _RESULTS_DB.read_text().splitlines()
        return [json.loads(l) for l in lines[-n:] if l.strip()]
    except Exception:
        return []

def score_variant(entries: list, variant: str) -> float:
    """Average overall_score for variant over entries."""
    scores = [e["overall_score"] for e in entries if e.get("variant") == variant and e.get("sent")]
    return round(sum(scores) / max(len(scores), 1), 3)

def decide_winner(run_id: str, min_samples: int = _WINDOW) -> dict:
    """Compare A vs B over the last N results. Returns winner + stats."""
    recent = _load_recent(n=min_samples * 2)
    variant_a = [e for e in recent if e.get("variant") == "A"]
    variant_b = [e for e in recent if e.get("variant") == "B"]
    if len(variant_a) < min_samples or len(variant_b) < min_samples:
        return {"winner": None, "reason": f"insufficient: A={len(variant_a)}, B={len(variant_b)}", "sample_a": len(variant_a), "sample_b": len(variant_b)}
    a_score = score_variant(variant_a, "A")
    b_score = score_variant(variant_b, "B")
    margin = a_score - b_score
    if margin > _MIN_WIN_MARGIN:
        return {"winner": "A", "a_score": a_score, "b_score": b_score, "margin": round(margin, 3),
                "reason": "A wins", "sample_a": len(variant_a), "sample_b": len(variant_b)}
    if margin < -_MIN_WIN_MARGIN:
        return {"winner": "B", "a_score": a_score, "b_score": b_score, "margin": round(margin, 3),
                "reason": "B wins", "sample_a": len(variant_a), "sample_b": len(variant_b)}
    return {"winner": None, "a_score": a_score, "b_score": b_score, "margin": round(margin, 3),
            "reason": "tie", "sample_a": len(variant_a), "sample_b": len(variant_b)}

def auto_assign_variant(email_id: str, intent_label: str, run_id: str) -> str:
    """Alternate A/B per email_id hash for consistent assignment."""
    h = _hash(str(email_id))
    return "A" if int(h, 16) % 2 == 0 else "B"

def build_ab_summary(run_id: str = "") -> dict:
    """Summary stats for last 50 entries."""
    recent = _load_recent(50)
    if not recent:
        return {"status": "no_data"}
    by_variant = {"A": [], "B": []}
    for e in recent:
        v = e.get("variant", "")
        if v in by_variant:
            by_variant[v].append(e["overall_score"])
    stats = {}
    for v, scores in by_variant.items():
        n = len(scores)
        stats[v] = {"count": n, "avg": round(sum(scores)/max(n,1),2),
                    "min": round(min(scores),2) if scores else 0, "max": round(max(scores),2) if scores else 0}
    return {"status": "ok", "by_variant": stats, "total": len(recent)}
