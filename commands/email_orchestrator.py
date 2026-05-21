from __future__ import annotations
#!/usr/bin/env python3
"""
email_orchestrator.py — M1 Orchestrator Stub

Wires: classify_thread + decode_reply_all -> _v25_pipeline

This module:
  1. Calls classify_thread() to get thread intent
  2. Calls decode_reply_all() to get reply-all binding
  3. Calls V26Responder._v25_pipeline() to get the response
  4. Merges all three outputs into a single enriched result dict
  5. Logs to thread_classify_log.jsonl + reply_all_bindings.jsonl

Usage:
    from email_orchestrator import orchestrate
    result = orchestrate(email_dict)
"""

from datetime import datetime, timezone
from pathlib import Path

_DECODE = Path(__file__).resolve().parent / "decode_reply_all.py"
_CT     = Path(__file__).resolve().parent / "classify_thread.py"


def _load(fn: str):
    """Import a sibling module by name."""
    from importlib.util import spec_from_file_location, module_from_spec
    p = Path(__file__).resolve().parent / f"{fn}.py"
    spec = spec_from_file_location(fn, p)
    mod  = module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


def orchestrate(email: dict, *, dry_run: bool = True) -> dict:
    """Full M1 orchestration: thread-intent + reply-all binding -> pipeline response."""
    from intelligent_email_responder_v26 import V26Responder   # noqa: E402

    # ── Step 1: Thread Intent ──────────────────────────────────
    try:
        ct_mod  = _load("classify_thread")
        ct_call = ct_mod.classify_thread(email)
    except Exception as ex:
        ct_call = {"thread_intent": "unknown", "confidence": 0.0,
                   "reason": f"thread_classify_error: {ex}"}

    # ── Step 2: Reply-all binding ──────────────────────────────
    try:
        ra_mod = _load("decode_reply_all")
    except Exception:
        ra_mod = None

    # ── Step 3: Pipeline response ──────────────────────────────
    responder = V26Responder()
    t0 = __import__("time").monotonic()
    result = responder._v25_pipeline(email, dry_run=dry_run, t0=t0)

    # ── Merge: thread intent ───────────────────────────────────
    result["thread_intent"]     = ct_call.get("thread_intent", "unknown")
    result["thread_label"]      = ct_call.get("label", "Unknown")
    result["thread_confidence"] = ct_call.get("confidence", 0.0)
    result["thread_reason"]     = ct_call.get("reason", "")
    result["reply_all_hint"]    = ct_call.get("reply_all", False)

    # ── Merge: reply-all binding ───────────────────────────────
    if ra_mod:
        try:
            result = ra_mod.bind(result, email)
            # R1a: write binding back into email so _v25_pipeline can access it
            email["reply_all_binding"]    = result.get("reply_all_binding", {})
            email["reply_all_enforced"]   = result.get("reply_all_enforced", False)
            email["reply_all_reason"]     = result.get("reply_all_reason", "")
        except Exception as ex:
            result["reply_all_binding_error"] = str(ex)

    # ── Thread-intent routing shortcut ─────────────────────────
    ti = result["thread_intent"]
    if ti == "urgent" and result.get("action") == "auto_ack":
        result["action"]  = "fast_path"
        result["reason"] += " | urgent override"
    elif ti in ("system_cicd", "internal_cc") and result.get("action") == "auto_ack":
        result["action"]  = "fast_path"
        result["reason"] += f" | {ti} override"

    result["orchestrator_ts"] = datetime.now(timezone.utc).isoformat()
    return result
