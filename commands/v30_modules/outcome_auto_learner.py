#!/usr/bin/env python3
"""
V30-P5: Outcome Auto-Learner
Daily cron: reads v26_run_log.jsonl → computes fp_rates.json → auto-tunes thresholds.
Replaces manual calibration with continuous automated learning.
"""

import json
from datetime import datetime, timezone, timedelta
from pathlib import Path

_WORKSPACE = Path(__file__).resolve().parent.parent.parent
DATA = _WORKSPACE / 'data'

_LOG = DATA / 'v26_run_log.jsonl'
_FP_RATES = DATA / 'fp_rates.json'
_POLICIES = DATA / 'v30_policy_learned.json'

def learn_from_outcomes(window_hours: int = 48, min_samples: int = 5) -> dict:
    """Analyze recent outcomes and update fp_rates.json.
    
    Computes per-intent false-positive rate from dry-run outcomes.
    FP = reply_all_ok=True but CC was suppressed OR should_send=False for high-confidence.
    """
    if not _LOG.exists():
        return {"status": "no_log", "fp_rates": {}}
    
    now = datetime.now(timezone.utc)
    cutoff = now - timedelta(hours=window_hours)
    
    entries = []
    try:
        with open(_LOG) as f:
            for line in f:
                line = line.strip()
                if not line:
                    continue
                try:
                    row = json.loads(line)
                    ts = row.get("ts") or row.get("ts_end", "")
                    if not ts:
                        continue
                    try:
                        row_ts = datetime.fromisoformat(ts.replace("Z", "+00:00"))
                    except (ValueError, AttributeError):
                        continue
                    if row_ts >= cutoff:
                        entries.append(row)
                except json.JSONDecodeError:
                    continue
    except Exception:
        pass
    
    if not entries:
        return {"status": "no_recent_entries", "fp_rates": {}}
    
    # Intent FP computation
    intent_stats = {}
    for entry in entries:
        intent = entry.get("intent", "default")
        conf = entry.get("confidence", entry.get("intent_confidence", 0.5))
        outcome = entry.get("outcome", entry.get("action", ""))
        reply_all = entry.get("reply_all", False)
        use_cc = entry.get("use_cc", "")
        
        intent_stats.setdefault(intent, {
            "total": 0, "high_conf_outcomes": 0, "false_positives": 0,
            "reply_all_ok": 0, "reply_all_forced_bypass": 0
        })
        
        stats = intent_stats[intent]
        stats["total"] += 1
        if conf >= 0.75:
            stats["high_conf_outcomes"] += 1
        if reply_all and not use_cc:
            stats["reply_all_forced_bypass"] += 1
    
    # Compute FP rates
    fp_rates = {}
    for intent, stats in intent_stats.items():
        total = stats["total"]
        if total < min_samples:
            fp_rates[intent] = {"rate": 0.0, "samples": total, "status": "insufficient"}
        else:
            fp_rate = stats["reply_all_forced_bypass"] / max(stats["reply_all_ok"], 1)
            fp_rates[intent] = {
                "rate": round(fp_rate, 3),
                "samples": total,
                "high_conf_count": stats["high_conf_outcomes"],
                "reply_all_forced_count": stats["reply_all_forced_bypass"],
                "status": "ok",
            }
    
    # Save
    try:
        _FP_RATES.write_text(json.dumps(fp_rates, indent=2, ensure_ascii=False))
    except Exception:
        pass
    
    return {"status": "learned", "intents_analyzed": len(intent_stats), "fp_rates": fp_rates}

def tune_thresholds_from_fp() -> dict:
    """Read fp_rates.json and suggest grammar_threshold adjustments."""
    if not _FP_RATES.exists():
        return {}
    
    try:
        fp_rates = json.loads(_FP_RATES.read_text())
    except Exception:
        return {}
    
    adjustments = {}
    for intent, stats in fp_rates.items():
        if stats.get("status") != "ok":
            continue
        rate = stats.get("rate", 0)
        samples = stats.get("samples", 0)
        
        if rate > 0.20 and samples >= 10:  # Too many FP → relax threshold
            adjustments[intent] = {"adj": -5, "reason": f"fp_rate_{rate:.0%}_high"}
        elif rate < 0.05 and samples >= 10:  # Too strict → tighten
            adjustments[intent] = {"adj": +3, "reason": f"fp_rate_{rate:.0%}_low"}
    
    try:
        _POLICIES.write_text(json.dumps(adjustments, indent=2))
    except Exception:
        pass
    
    return adjustments
