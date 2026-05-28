#!/usr/bin/env python3
"""
V44: Thread Outcome Tracker + Escalation (Closed-Loop Email Learning)
Tracks every sent email: if no reply in 48h → auto-escalate or learn.

Stores:
  data/outcome_queue.jsonl   — emails awaiting reply confirmation
  data/escalation_log.jsonl  — escalated emails with action taken
  data/closed_loop_learn.json — learned patterns from no-reply outcomes

Escalation actions:
  - re_send: resend with modified tone/ shortened body
  - human_review: flag for human attention
  - learn_silent: log as silent (sender may be busy/inactive)
  - upgrade_urgency: mark next contact as higher priority

Feeds sender_preference_memory (V43):
  - Long-time-no-reply → lower urgency expectation
  - Quick reply → sender is responsive
"""

import json
import time
import re
from pathlib import Path
from datetime import datetime, timezone, timedelta
from typing import Optional

WORKSPACE = Path(__file__).resolve().parent.parent.parent
DATA = WORKSPACE / "data"
OUTCOME_QUEUE = DATA / "outcome_queue.jsonl"
ESCALATION_LOG = DATA / "escalation_log.jsonl"
CLOSED_LOOP_LEARN = DATA / "closed_loop_learn.json"


def _ensure_dir():
    try:
        DATA.mkdir(parents=True, exist_ok=True)
        for f in [OUTCOME_QUEUE, ESCALATION_LOG]:
            if not f.exists():
                f.write_text("", encoding="utf-8")
    except Exception:
        pass


def _now_iso():
    return datetime.now(timezone.utc).isoformat()


def _parse_age_hours(sent_iso: str) -> float:
    """Return hours since sent_iso timestamp."""
    try:
        sent = datetime.fromisoformat(sent_iso.replace("Z", "+00:00"))
        delta = datetime.now(timezone.utc) - sent
        return delta.total_seconds() / 3600
    except Exception:
        return 0.0


# ── CORE API ────────────────────────────────────────────────────────────────

def track_sent_email(
    email_id: str,
    thread_id: str,
    sender: str,
    recipient: str,
    subject: str,
    body_preview: str,
    intent: str,
    reply_all_used: bool,
    sent_iso: Optional[str] = None,
) -> str:
    """
    Call this RIGHT AFTER sending an email.
    Adds the email to the outcome queue for 48h tracking.

    Returns:
        track_id (uuid-like string) stored in the queue entry
    """
    _ensure_dir()
    sent_time = sent_iso or _now_iso()
    track_id = f"ot_{email_id}_{int(time.time())}"

    entry = {
        "track_id": track_id,
        "email_id": email_id,
        "thread_id": thread_id,
        "sender": sender,
        "recipient": recipient,
        "subject": subject,
        "body_preview": body_preview[:200] if body_preview else "",
        "intent": intent,
        "reply_all_used": reply_all_used,
        "sent_at": sent_time,
        "status": "pending",          # pending | escalated | resolved | silent
        "last_checked_at": sent_time,
        "reply_received_at": None,
        "escalation_action": None,
    }

    try:
        with OUTCOME_QUEUE.open("a", encoding="utf-8") as f:
            f.write(json.dumps(entry, ensure_ascii=False) + "\n")
    except Exception as e:
        return f"ERROR: {e}"

    return track_id


def mark_reply_received(email_id: str, reply_body: str = "", reply_iso: Optional[str] = None) -> dict:
    """
    Call this when a reply is received from the sender.
    Marks the tracked email as resolved and logs the outcome.

    Returns: the updated entry
    """
    _ensure_dir()
    reply_time = reply_iso or _now_iso()
    resolved_entry = None
    remaining = []

    try:
        with OUTCOME_QUEUE.open("r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line:
                    continue
                entry = json.loads(line)
                if entry.get("email_id") == email_id and entry.get("status") == "pending":
                    entry["status"] = "resolved"
                    entry["reply_received_at"] = reply_time
                    resolved_entry = entry
                else:
                    remaining.append(entry)
    except Exception as e:
        return {"error": str(e)}

    if resolved_entry:
        # Write back without resolved entry (it's done)
        try:
            with OUTCOME_QUEUE.open("w", encoding="utf-8") as f:
                for entry in remaining:
                    f.write(json.dumps(entry, ensure_ascii=False) + "\n")
        except Exception:
            pass

        # Learn from this outcome (update sender preferences)
        _learn_from_outcome(resolved_entry, reply_body, reply_received=True)

    return resolved_entry or {"status": "not_found"}


def check_and_escalate(stale_threshold_hours: float = 48.0) -> list:
    """
    Main escalation function. Call this via daily cron.
    Scans outcome_queue for emails older than stale_threshold_hours with no reply.
    For each stale entry: decides escalation action, logs it, updates sender memory.

    Returns:
        list of escalation dicts with action taken
    """
    _ensure_dir()
    escalations = []
    stale_entries = []
    remaining = []

    try:
        with OUTCOME_QUEUE.open("r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line:
                    continue
                entry = json.loads(line)
                if entry.get("status") == "pending":
                    age_h = _parse_age_hours(entry.get("sent_at", ""))
                    if age_h >= stale_threshold_hours:
                        stale_entries.append((entry, age_h))
                    else:
                        remaining.append(entry)
                else:
                    remaining.append(entry)
    except Exception as e:
        return [{"error": str(e)}]

    for entry, age_h in stale_entries:
        action = _decide_escalation(entry, age_h)
        entry["status"] = "escalated"
        entry["escalation_action"] = action["action"]
        entry["escalation_reason"] = action["reason"]
        entry["escalated_at"] = _now_iso()

        # Log to escalation log
        _log_escalation(entry, action)

        # Learn from silence
        _learn_from_outcome(entry, "", reply_received=False, escalation=action)

        escalations.append({
            "track_id": entry["track_id"],
            "email_id": entry["email_id"],
            "sender": entry["sender"],
            "age_hours": round(age_h, 1),
            "action": action["action"],
            "reason": action["reason"],
        })

    # Rewrite queue without stale entries
    try:
        with OUTCOME_QUEUE.open("w", encoding="utf-8") as f:
            for entry in remaining:
                f.write(json.dumps(entry, ensure_ascii=False) + "\n")
    except Exception:
        pass

    return escalations


# ── ESCALATION DECISION ENGINE ──────────────────────────────────────────────

def _decide_escalation(entry: dict, age_h: float) -> dict:
    """
    Decide what to do with a stale email.
    Returns {action, reason, modified_body?}
    """
    intent = entry.get("intent", "unknown")
    sender = entry.get("sender", "")
    reply_all_used = entry.get("reply_all_used", False)
    subject = entry.get("subject", "")

    # Very urgent intents — escalate immediately at 24h
    urgent_intents = {"support_request", "complaint", "billing_inquiry"}
    if intent in urgent_intents and age_h >= 24:
        return {
            "action": "human_review",
            "reason": f"High-priority {intent} — no reply in {age_h:.0f}h",
        }

    # Follow-up or meeting request — re-send with shorter body
    if intent in {"follow_up", "meeting_request", "sales_inquiry"}:
        if age_h >= 48:
            return {
                "action": "re_send",
                "reason": f"No reply in {age_h:.0f}h — re-sending with follow-up tone",
                "modified_subject": _build_followup_subject(subject),
            }

    # Newsletter or auto-reply — mark as silent, don't re-engage
    if intent in {"newsletter", "auto_reply"}:
        return {
            "action": "learn_silent",
            "reason": f"{intent} — sender inactive or not expecting reply",
        }

    # Default: human review for complex intents
    if intent in {"partnership", "vendor_inquiry", "press_media", "job_application"}:
        return {
            "action": "human_review",
            "reason": f"Strategic {intent} — no reply in {age_h:.0f}h, human needed",
        }

    # Unknown intent — gentle re-send
    return {
        "action": "re_send",
        "reason": f"No reply in {age_h:.0f}h — gentle follow-up",
    }


def _build_followup_subject(subject: str) -> str:
    """Add FWD or follow-up prefix if not already present."""
    prefixes = [r"^Re:", r"^RE:", r"^Fwd:", r"^FW:", r"^Follow[- ]?up:"]
    for p in prefixes:
        if re.search(p, subject, re.IGNORECASE):
            return subject
    return f"Following up: {subject}"


# ── LOGGING ─────────────────────────────────────────────────────────────────

def _log_escalation(entry: dict, action: dict) -> None:
    try:
        ESCALATION_LOG.parent.mkdir(parents=True, exist_ok=True)
        log_entry = {
            **entry,
            "escalation_decision": action,
            "logged_at": _now_iso(),
        }
        with ESCALATION_LOG.open("a", encoding="utf-8") as f:
            f.write(json.dumps(log_entry, ensure_ascii=False) + "\n")
    except Exception:
        pass


# ── LEARNING (Closed-Loop into V43 sender memory) ──────────────────────────

def _learn_from_outcome(entry: dict, reply_body: str,
                        reply_received: bool,
                        escalation: Optional[dict] = None) -> None:
    """
    Feed outcome back into sender_preference_memory (V43).
    - reply_received=True → sender is responsive, update tone/preferred_timing
    - reply_received=False + escalation → sender is slow/unresponsive
    """
    try:
        from commands.v43_modules.sender_preference_memory import (
            learn_from_outcome as spm_learn,
        )
        sender = entry.get("sender", "")
        if not sender or "@" not in sender:
            return

        spm_learn(
            sender_email=sender,
            sent_body=entry.get("body_preview", ""),
            received_body=reply_body,
            reply_all_used=entry.get("reply_all_used", False),
            conversation深=0,  # simplified
        )
    except ImportError:
        # V43 not available — skip
        pass
    except Exception:
        pass


# ── STATS / REPORTING ────────────────────────────────────────────────────────

def get_stats() -> dict:
    """Return current queue stats for monitoring."""
    _ensure_dir()
    stats = {
        "pending": 0,
        "escalated": 0,
        "resolved": 0,
        "avg_response_time_h": None,
        "resolution_times_h": [],
        "escalation_count": 0,
    }

    try:
        with OUTCOME_QUEUE.open("r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line:
                    continue
                entry = json.loads(line)
                status = entry.get("status", "unknown")
                if status == "pending":
                    stats["pending"] += 1
                elif status == "escalated":
                    stats["escalated"] += 1
                elif status == "resolved":
                    stats["resolved"] += 1
                    if entry.get("reply_received_at") and entry.get("sent_at"):
                        sent = datetime.fromisoformat(entry["sent_at"].replace("Z", "+00:00"))
                        received = datetime.fromisoformat(entry["reply_received_at"].replace("Z", "+00:00"))
                        h = (received - sent).total_seconds() / 3600
                        stats["resolution_times_h"].append(h)
    except Exception:
        pass

    if stats["resolution_times_h"]:
        stats["avg_response_time_h"] = round(
            sum(stats["resolution_times_h"]) / len(stats["resolution_times_h"]), 1
        )

    try:
        stats["escalation_count"] = sum(1 for _ in ESCALATION_LOG.open("r") if _.strip())
    except Exception:
        pass

    return stats


# ── CRON ENTRY POINT ────────────────────────────────────────────────────────
# Run daily: python -m commands.v44_modules.thread_outcome_tracker

if __name__ == "__main__":
    import sys
    print(f"[V44 Thread Outcome Tracker] Run at {_now_iso()}")
    stats = get_stats()
    print(f"  Queue: {stats['pending']} pending, {stats['resolved']} resolved, {stats['escalated']} escalated")
    print(f"  Avg response time: {stats['avg_response_time_h']}h")
    escalations = check_and_escalate(stale_threshold_hours=48.0)
    if escalations:
        print(f"  Escalated {len(escalations)} emails:")
        for e in escalations:
            print(f"    [{e['action']}] {e['sender']} — {e['reason']}")
    else:
        print("  No escalations needed.")
    sys.exit(0)
