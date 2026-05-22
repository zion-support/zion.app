#!/usr/bin/env python3
"""
V30: Urgency Normalizer
Thread age decay: urgent >48h → downgrade to high/medium.
Prevents "urgent" emails from staying highest-urgency forever.
"""

import re
from datetime import datetime, timezone

_THREAD_AGE_HOURS = 48
_URGENT_EXPIRE_HOURS = 24

def normalize_urgency(
    urgency_raw: str,
    thread_ts: str = "",
    message_ts: str = "",
    intent_label: str = "",
) -> dict:
    """Normalize urgency based on thread age and intent.
    
    Rules:
    - No timestamp → return raw urgency (unknown age)
    - urgent + age < 24h → keep urgent
    - urgent + age 24-48h → downgrade to high (with note)
    - urgent + age > 48h → downgrade to medium (with note)
    - high + age > 72h → downgrade to medium
    """
    if not urgency_raw or not message_ts:
        return {"normalized": urgency_raw, "reasons": []}
    
    now = datetime.now(timezone.utc)
    try:
        msg_ts = datetime.fromisoformat(message_ts.replace("Z", "+00:00"))
    except (ValueError, AttributeError):
        return {"normalized": urgency_raw, "reasons": []}
    
    age_hours = (now - msg_ts).total_seconds() / 3600
    reasons = [f"age={age_hours:.1f}h"]
    
    n = urgency_raw
    if urgency_raw == "high":
        if age_hours > 72:
            n = "medium"
            reasons.append("high_degraded_to_medium_72h")
    elif urgency_raw == "urgent":
        if age_hours > _URGENT_EXPIRE_HOURS:
            if age_hours > _THREAD_AGE_HOURS:
                n = "medium"
                reasons.append("urgent_expired>48h")
            else:
                n = "high"
                reasons.append("urgent_expired_24-48h")
    
    return {"normalized": n, "reasons": reasons, "age_hours": round(age_hours, 1)}

def apply_urgency_decay(
    urgency_val: str,
    thread_history: list[dict],
    now_ts: str = "",
) -> dict:
    """Multi-message thread decay: longest gap since last urgent item."""
    if not thread_history:
        return {"urgency": urgency_val, "reasons": []}
    
    try:
        n = datetime.fromisoformat(now_ts.replace("Z", "+00:00")) if now_ts else datetime.now(timezone.utc)
    except (ValueError, AttributeError):
        n = datetime.now(timezone.utc)
    
    max_gap = 0
    last_urgent = 0.0
    
    for msg in thread_history:
        ts_str = msg.get("timestamp") or msg.get("ts", "")
        if not ts_str:
            continue
        try:
            ts = datetime.fromisoformat(ts_str.replace("Z", "+00:00"))
            gap = abs((n - ts).total_seconds() / 3600)
            max_gap = max(max_gap, gap)
            if msg.get("urgency", "") == "urgent":
                last_urgent = gap
        except (ValueError, AttributeError):
            continue
    
    n_urg = urgency_val
    reasons = [f"max_gap={max_gap:.1f}h"]
    
    if last_urgent > _THREAD_AGE_HOURS:
        n_urg = "medium"
        reasons.append("thread_urgent_decayed_>48h")
    elif last_urgent > _URGENT_EXPIRE_HOURS:
        n_urg = "high"
        reasons.append("thread_urgent_decayed_24-48h")
    
    return {"urgency": n_urg, "reasons": reasons}
