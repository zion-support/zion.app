#!/usr/bin/env python3
"""
V30-P3: Sender Reputation Tracker
Tracks sender behavior patterns over time. Escalates if pattern changes:
VIP→spam, known→new_domain, high_confidence→low, etc.
"""

import json
from datetime import datetime, timezone
from pathlib import Path

_WORKSPACE = Path(__file__).resolve().parent.parent.parent
DATA = _WORKSPACE / 'data'

_SENDER_DB = DATA / 'sender_reputation.jsonl'

def get_reputation(sender: str) -> dict:
    """Get current reputation profile for a sender."""
    try:
        lines = _SENDER_DB.read_text().splitlines() if _SENDER_DB.exists() else []
    except Exception:
        lines = []
    
    records = [json.loads(l) for l in lines if l.strip() and not l.startswith("#")]
    matches = [r for r in records if r.get("sender_short") == sender.split("@")[0].lower()]
    
    if not matches:
        return {"tier": "unknown", "total_interactions": 0, "positive_rate": 0.50}
    
    total = len(matches)
    positives = sum(1 for r in matches if r.get("outcome") == "positive")
    negative = sum(1 for r in matches if r.get("outcome") == "negative")
    
    avg_conf = sum(r.get("confidence", 0.5) for r in matches) / max(total, 1)
    
    if total >= 10 and positives / max(total, 1) >= 0.85:
        tier = "vip"
    elif total >= 5 and positives / max(total, 1) >= 0.70:
        tier = "trusted"
    elif negative >= 3 and total >= 4:
        tier = "risky"
    elif any("spam" in r.get("intent", "") for r in matches[-5:]):
        tier = "spam_suspect"
    else:
        tier = "known"
    
    return {
        "tier": tier,
        "total_interactions": total,
        "positive_rate": round(positives / max(total, 1), 2),
        "avg_confidence": round(avg_conf, 2),
        "negative_pct": round(negative / max(total, 1), 2),
        "last_seen": matches[-1]["ts"] if matches else "",
    }

def log_interaction(sender: str, intent_label: str, confidence: float,
                    outcome: str = "pending", action_taken: str = "auto_reply") -> None:
    entry = {
        "ts": datetime.now(timezone.utc).isoformat(),
        "sender_short": sender.split("@")[0].lower(),
        "sender_domain": sender.split("@")[1] if "@" in sender else "",
        "intent": intent_label,
        "confidence": confidence,
        "outcome": outcome,
        "action": action_taken,
    }
    try:
        with open(_SENDER_DB, "a") as f:
            f.write(json.dumps(entry) + "\n")
    except Exception:
        pass

def check_reputation_signal(sender: str, intent_label: str, confidence: float) -> dict:
    """Return override signals based on sender reputation."""
    rep = get_reputation(sender)
    signals = []
    
    if rep["tier"] == "vip" and confidence < 0.7:
        signals.append("vip_boost:confidence_lifted")
    if rep["tier"] == "risky" and intent_label not in ("urgent", "escalation"):
        signals.append("risky_sender:consider_escalation")
    if rep["tier"] == "spam_suspect":
        signals.append("spam_suspect:reduce_auto_depth")
    if rep["avg_confidence"] < 0.4 and rep["total_interactions"] >= 3:
        signals.append("low_confidence_history:escalate")
    
    return {"tier": rep["tier"], "signals": signals, "profile": rep}
