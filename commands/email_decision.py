#!/usr/bin/env python3
"""
commands/email_decision.py — V24 reusable decision layer
Three-path reply-all decision: fast heuristics → LLM confidence → conservative fallback.
Module callable from any email pipeline (origin/main V24 imports this pattern).

Usage:
  from email_decision import from_email_data, decide_reply_all
  decision = decide_reply_all(from_email_data(email_dict))
"""

import re, json, sys, os
from pathlib import Path
from typing import NamedTuple, List, Tuple, Optional

# Lazy-import llm_client to avoid circular deps
def _llm_query(prompt: str, temperature: float = 0.3, max_tokens: int = 150) -> dict:
    try:
        from utils.llm_client import llm_query
        return llm_query(prompt, temperature=temperature, max_tokens=max_tokens)
    except Exception:
        return {"response": "", "error": "llm_client unavailable"}

# ── Email NamedTuple ──────────────────────────────────────────────────────
class Email(NamedTuple):
    sender: str
    to: List[str]
    cc: List[str]
    subject: str
    thread: List[str]
    sentiment: float = 0.0

# ── Heuristic keyword sets ────────────────────────────────────────────────
_GROUP_SUBJECT_KW = [
    "re:", "fwd:", "group", "team", "project", "sales", "support",
    "everyone", "all", "update:", "sync:", "meeting", "announcement",
    "all-hands", "townhall", "town hall", "standup", "broadcast",
]
_PRIVATE_REPLY_KW = [
    "just you", "only you", "private", "dm me", "between us",
    "confidential", "personal reply", "not for distribution",
]

# ── Step 1: Heuristic checklist ───────────────────────────────────────────
def _violates_heuristic(email: Email) -> str:
    """Return a non-empty reason string if heuristics clearly indicate reply-only."""
    text = f"{email.subject} {' '.join(email.thread)}".lower()

    if any(kw in text for kw in _PRIVATE_REPLY_KW):
        return "private_hint"

    # Forwarded emails — do not reply-all
    if email.subject.lower().startswith("fwd:"):
        return "forwarded"

    return ""

def _heuristic_reply_all(email: Email) -> Tuple[bool, str]:
    """
    Returns (reply_all: bool, reason: str).

    Scoring:
      +3  ≥ 2 To recipients
      +2  ≥ 1 CC recipient
      +2  thread depth > 1
      +1  group-subject keyword
      -1  1:1 (only 1 To, no CC)
      -4  private-hint override
    """
    reasons = []
    score  = 0

    to_cnt, cc_cnt = len(email.to), len(email.cc)
    depth = len(email.thread)

    if to_cnt >= 2:
        score += 3
        reasons.append(f"to_count={to_cnt}")
    if cc_cnt >= 1:
        score += 2
        reasons.append(f"cc_count={cc_cnt}")
    if depth > 1:
        score += 2
        reasons.append(f"thread_depth={depth}")
    if any(k in email.subject.lower() for k in _GROUP_SUBJECT_KW):
        score += 1
        reasons.append("group_subject_keyword")

    if to_cnt == 1 and cc_cnt == 0:
        score -= 1
        reasons.append("1:1")

    violation = _violates_heuristic(email)
    if violation:
        score -= 4
        reasons.append(violation)

    return score >= 0, f"score={score} ({', '.join(reasons)})"

# ── Step 2: LLM-augmented confidence ─────────────────────────────────────
def _llm_confidence(email: Email) -> float:
    """0.0–1.0; call LLM only when heuristics are ambiguous."""
    prompt = (
        "Is this email part of a group conversation where reply-all is appropriate?\n"
        "Answer YES or NO followed by a decimal confidence 0-1 (e.g. YES 0.87 or NO 0.32).\n\n"
        f"Subject: {email.subject}\n"
        f"To: {', '.join(email.to)}\n"
        f"CC: {', '.join(email.cc)}\n"
        f"Thread ({len(email.thread)} msgs):\n"
        + "\n".join(email.thread[-3:])
        + f"\nSentiment: {email.sentiment:.2f}"
    )
    result = _llm_query(prompt, temperature=0.2, max_tokens=40)
    txt = result.get("response", "").strip().upper()
    if "YES" in txt:
        m = re.search(r'0?\.\d+', txt)
        return float(m.group()) if m else 0.75
    return 0.0
# ── V27: Always-CC hard-require ────────────────────────────────────────────────
_SUPPRESS_CC_KW = [
    "just you", "only you", "private", "dm me", "between us",
    "confidential", "personal reply", "not for distribution",
]

def always_cc(email: Email) -> dict:
    """
    Hard-require reply-all on every outgoing reply.

    Logic:
      1. If subject starts with 'fwd:' → suppressed (don't unsilently reply-all to
         a forwarded chain).
      2. If private-hint keyword found in subject + thread → suppressed.
      3. Build CC list from all unique To+CC recipients. If list is non-empty,
         unconditionally reply-all to everyone.

    Returns:
        {use_cc: str, reason: str, suppressed: bool}
    """
    subj   = email.subject.lower()
    text   = f"{email.subject} {' '.join(email.thread)}".lower()

    # Suppression: forwarded emails
    if subj.startswith("fwd:"):
        return {"use_cc": "", "reason": "suppressed_forwarded", "suppressed": True}

    # Suppression: private/confidential keywords
    if any(kw in text for kw in _SUPPRESS_CC_KW):
        return {"use_cc": "", "reason": "suppressed_private", "suppressed": True}

    # Build CC list — every unique, valid recipient in To + CC
    all_rcpts: list = []
    seen: set = set()
    for addr in email.to + email.cc:
        a = addr.strip().lower()
        if a and "@" in a and a not in seen:
            seen.add(a)
            all_rcpts.append(addr.strip())

    if not all_rcpts:
        return {"use_cc": "", "reason": "no_recipients", "suppressed": False}

    n = len(all_rcpts)
    return {
        "use_cc":   ", ".join(all_rcpts),
        "reason":   f"always_cc_{n}_participants",
        "suppressed": False,
    }

# ── Public API ─────────────────────────────────────────────────────────────
def decide_reply_all(email: Email) -> dict:
    """
    Three-path decision:
      1. Fast heuristic (always evaluated, free).
      2. LLM confidence when heuristic is in the ambiguous zone.
      3. Fallback: reply-only unless LLM confidence ≥ 0.6.
    Returns:
      {reply_all, confidence, method, reason}
    """
    heuristic_ok, reason = _heuristic_reply_all(email)

    if heuristic_ok:
        return {
            "reply_all": True,
            "confidence": 0.85,
            "method": "heuristic",
            "reason": reason,
        }

    # Ambiguous zone — call LLM
    llm_conf = _llm_confidence(email)
    decision = llm_conf >= 0.6

    return {
        "reply_all": decision,
        "confidence": round(llm_conf, 3),
        "method":  "llm" if llm_conf > 0 else "fallback",
        "reason":  f"llm={llm_conf:.2f} → {reason}",
    }

# ── Adapter ────────────────────────────────────────────────────────────────

def _parse_recipients(raw) -> list:
    """Parse a recipient field that may be str, list, or None into a clean list."""
    if raw is None:
        return []
    if isinstance(raw, list):
        return [str(a).strip() for a in raw if str(a).strip()]
    return [a.strip() for a in str(raw).split(",") if a.strip()]

def from_email_data(ed: dict) -> "Email":
    return Email(
        sender   = ed.get("sender", ""),
        to       = _parse_recipients(ed.get("to", ed.get("to_header", ""))),
        cc       = _parse_recipients(ed.get("cc", ed.get("cc_recipients", ""))),
        subject  = ed.get("subject", ""),
        thread   = [m.get("snippet", "")
                    for m in ed.get("thread_messages", [{"snippet": ed.get("snippet", "")}])
                    if m.get("snippet")][-5:],
        sentiment= ed.get("analysis", {}).get("sentiment", 0.0),
    )

if __name__ == "__main__":
    cases = [
        dict(sender="alice@test.com",  to=["bob@test.com","carol@test.com"], cc=["dave@test.com"], subject="Team sync",   thread=["msg1","msg2"], sentiment=0.2),
        dict(sender="eve@test.com",    to=["me@test.com"],                   cc=[],                           subject="Re: Question",  thread=["msg1"], sentiment=0.5),
        dict(sender="frank@test.com",  to=["me@test.com"],                   cc=[],                           subject="Just between us", thread=[],    sentiment=0.0),
    ]
    for c in cases:
        em = from_email_data(c)
        d  = decide_reply_all(em)
        print(f"  [{'✅RA' if d['reply_all'] else '⬜R1'}] conf={d['confidence']:.2f} method={d['method']:10s} | {d['reason']}")
