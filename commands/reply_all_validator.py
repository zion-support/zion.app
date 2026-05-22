#!/usr/bin/env python3
"""
V30-P0: Reply-All Address Validator
Fail-closed: if reply_all_ok=True but use_cc invalid → escalate to review.
Logs all decisions for per-case audit trail.
"""

import json, re
from datetime import datetime, timezone

def validate_reply_all(
    use_cc: str,
    reply_all_ok: bool,
    intent_label: str,
    intent_policy: dict,
    thread_id: str,
    run_id: str,
) -> dict:
    """Central validation gate for reply-all decisions.
    
    Args:
        use_cc: CC string (comma-separated emails)
        reply_all_ok: Whether we plan to CC
        intent_label: Intent category
        intent_policy: Policy overrides
        thread_id: Thread identifier for logging
        run_id: Current batch run ID
    
    Returns:
        {"can_send": bool, "action": str, "reason": str, "validation": dict}
    """
    addr_re = re.compile(r'^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
    
    if not reply_all_ok:
        return {"can_send": True, "action": "no_cc", "reason": "no_reply_all", "validation": {}}
    
    if not use_cc or not use_cc.strip():
        return {"can_send": False, "action": "review",
                "reason": "reply_all_ok_without_valid_cc",
                "validation": {"valid_emails": 0, "invalid_emails": 0}}
    
    emails = [e.strip() for e in use_cc.split(",") if e.strip()]
    valid = [e for e in emails if addr_re.match(e)]
    invalid = [e for e in emails if not addr_re.match(e)]
    
    validation = {
        "valid_emails": len(valid),
        "invalid_emails": len(invalid),
        "invalid_list": invalid[:5],
        "original_cc": use_cc,
    }
    
    if invalid:
        return {
            "can_send": False,
            "action": "review",
            "reason": f"invalid_cc_addresses:{len(invalid)}",
            "validation": validation,
        }
    
    return {
        "can_send": True,
        "action": "send_with_cc",
        "reason": intent_policy.get("reply_all_reason", ""),
        "validation": validation,
    }

def log_reply_all_decision(decision: dict, thread_id: str, run_id: str) -> None:
    """Append reply-all decision to audit log."""
    row = {
        "ts": datetime.now(timezone.utc).isoformat(),
        "run_id": run_id,
        "thread_id": thread_id,
        **decision,
    }
    log_path = DATA / 'reply_all_validation.jsonl'
    try:
        with open(log_path, 'a') as f:
            f.write(json.dumps(row) + '\n')
    except Exception:
        pass
