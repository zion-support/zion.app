#!/usr/bin/env python3
"""
V30-P1: Intent Reasoning Auditor
Logs per-case WHY decisions: intent score breakdown, override sources,
reply-all rationale, escalation causes.
"""

import json, re

def build_case_log(
    run_id: str,
    email_id: str,
    thread_id: str,
    sender: str,
    subject: str,
    intent_raw: dict,
    intent_label: str,
    route: str,
    route_signals: list,
    reply_all_ok: bool,
    use_cc: str,
    reply_all_source: str = "",
    overrides_applied: list = None,
    escalation: dict = None,
) -> dict:
    """Build structured per-case reasoning log entry.
    
    Override sources: profile_boost, feedback_oracle, cc_memory, router_override
    Reply-all source: always_cc, carrier_reply_all_binding, decide_reply_all, 
                      cc_memory, fallback_check
    """
    entry = {
        "ts": __import__('datetime').datetime.now(__import__('datetime').timezone.utc).isoformat(),
        "run_id": run_id,
        "email_id": email_id,
        "thread_id": thread_id,
        "sender_short": sender.split("@")[0] if "@" in sender else sender[:25],
        "subject_snippet": subject[:60],
        "intent": {
            "label": intent_label,
            "confidence": intent_raw.get("confidence", 0) if intent_raw else 0,
            "categories": (intent_raw or {}).get("categories", []),
            "boost_applied": (intent_raw or {}).get("intent_boost_src", ""),
        },
        "decision": {
            "route": route,
            "signal_count": len(route_signals),
            "top_signals": route_signals[:3],
        },
        "reply_all": {
            "ok": reply_all_ok,
            "cc": use_cc or "",
            "source": reply_all_source,
        },
        "overrides": overrides_applied or [],
        "escalation": escalation or {},
    }
    return entry

def log_case(entry: dict) -> None:
    """Append case log to file."""
    log_path = DATA / 'case_reasoning.jsonl'
    try:
        import sys
        if str(DATA) not in sys.path:
            sys.path.insert(0, str(DATA.parent / 'commands'))
        with open(log_path, 'a') as f:
            f.write(json.dumps(entry, ensure_ascii=False) + '\n')
    except Exception:
        pass
