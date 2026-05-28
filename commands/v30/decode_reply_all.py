#!/usr/bin/env python3
"""
decode_reply_all — M1: Intelligent Reply-All Binding Engine
Uses CC context, thread history, and intent to decide when to Reply-All.
"""
import json, re
from pathlib import Path
from typing import Dict, Any, Optional

DATA = Path(__file__).resolve().parent.parent.parent / "data"

_RE_SALES    = re.compile(r"\b(pricing|quote|demo|buy|proposal|budge|invoice|payment)\b", re.I)
_RE_SUPPORT  = re.compile(r"\b(issue|bug|error|down|outage|broken|fix|help|urgent)\b", re.I)
_RE_MEETING  = re.compile(r"\b(meeting|call|schedule|calendar|zoom|teams|available)\b", re.I)
_RE_FINANCIAL= re.compile(r"\b(invoice|payment|billing|amount|USD|total|due|wire|ACH)\b", re.I)
_RE_PARTNER  = re.compile(r"\b(partner|OEM|reseller|collaborat|affiliate|integration)\b", re.I)
_RE_INTERNAL = re.compile(r"@ziontechgroup\.com|zion\.ai|internal|cc:", re.I)
_RE_URGENT   = re.compile(r"\b(urgent|critical|asap|immediately|P0|P1|emergency)\b", re.I)

def decode_reply_all(email: Dict[str, Any], intent: str = "unknown",
                     thread_history: list = None,
                     sender_profile: Dict = None) -> Dict[str, Any]:
    """
    Decide Reply-All for a given email with full context.

    Args:
        email: {cc: [...], from: str, to: str, subject: str, body: str}
        intent: thread intent label
        thread_history: list of past messages in this thread
        sender_profile: sender's past preferences

    Returns:
        {use_reply_all: bool, cc_list: str, reasoning: str, confidence: float}
    """
    cc = email.get("cc") or []
    to_field = email.get("to", "")
    from_addr = email.get("from", "")
    subject = email.get("subject", "")
    body = email.get("body", "")[:500]
    combined = f"{subject} {body}".lower()

    reply_all = False
    cc_list = ""
    reasoning = ""
    confidence = 0.5

    # ── NEVER reply-all ─────────────────────────────────────────────────────
    if re.search(r"\b(unsubscribe|remove\s*me|newsletter|marketing|spam)\b", combined):
        return {"use_reply_all": False, "cc_list": "", "reasoning": "newsletter/unsubscribe — never reply-all", "confidence": 0.95}

    if re.search(r"@ziontechgroup\.com", from_addr) and not cc:
        # Internal email — use normal reply
        return {"use_reply_all": False, "cc_list": "", "reasoning": "internal Zion email — no CC needed", "confidence": 0.90}

    # ── Financial / Invoice — NEVER reply-all (confidential) ───────────────
    if intent in ("financial", "invoice", "billing"):
        # Check if CC already present
        if cc and len(cc) > 0:
            return {"use_reply_all": False, "cc_list": "", "reasoning": f"{intent} — CC list preserved, no reply-all", "confidence": 0.88}
        return {"use_reply_all": False, "cc_list": "", "reasoning": f"{intent} — confidential, no reply-all", "confidence": 0.90}

    # ── Intent-based defaults ────────────────────────────────────────────────
    # ⚡ RULE 1: support_issue and meeting → ALWAYS Reply-All (Kleber requirement)
    if intent == "support_issue":
        reply_all = True
        reasoning = "support issue — Reply-All ALWAYS for team visibility"
        confidence = 0.95
    elif intent == "meeting":
        reply_all = True
        reasoning = "meeting — Reply-All ALWAYS so all participants see the response"
        confidence = 0.95
    elif intent == "urgent":
        reply_all = True
        reasoning = "urgent — Reply-All ALWAYS for rapid team response"
        confidence = 0.93
    elif intent == "cancellation":
        reply_all = True
        reasoning = "cancellation — Reply-All ALWAYS to alert account management"
        confidence = 0.93
    elif intent == "partnership":
        reply_all = True
        reasoning = "partnership — Reply-All ALWAYS so stakeholders see response"
        confidence = 0.90
    elif intent == "sales_lead":
        # Established contact gets Reply-All
        reply_all = True
        reasoning = "established sales contact — Reply-All for thread continuity"
        confidence = 0.85

    # ── Override: has existing CC field with real addresses ─────────────────
    valid_cc = [a for a in cc if re.match(r"^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$", a)]
    if valid_cc and not reply_all:
        # Has CC but we defaulted to no-reply-all — re-evaluate
        if intent in ("urgent", "support_issue", "meeting"):
            reply_all = True
            reasoning += " (CC field present — upgrading to Reply-All)"
            confidence += 0.05

    # ── Override: thread has 2+ participants (from history) ─────────────────
    if thread_history and len(thread_history) >= 2 and not reply_all:
        other_participants = [m.get("from") for m in thread_history[-3:]
                              if m.get("from") != from_addr]
        if len(other_participants) >= 1:
            reply_all = True
            reasoning = f"thread with {len(other_participants)+1} participants — Reply-All for continuity"
            confidence = 0.82

    # ── Build CC string from valid addresses ─────────────────────────────────
    if valid_cc:
        cc_list = ", ".join(valid_cc[:5])
    elif reply_all and to_field:
        # Extract other recipients from to field
        to_addrs = [a.strip() for a in to_field.split(",")
                    if a.strip() and re.match(r"^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$", a.strip())]
        others = [a for a in to_addrs if a != from_addr]
        cc_list = ", ".join(others[:5]) if others else ""

    return {
        "use_reply_all": reply_all,
        "cc_list": cc_list,
        "reasoning": reasoning or "default — no strong signal",
        "confidence": round(confidence, 3),
    }


def bind(email: Dict[str, Any], routing: Dict[str, Any]) -> Dict[str, Any]:
    """Full binding: combine routing with reply-all decision."""
    intent = routing.get("intent_label", "unknown")
    thread_history = routing.get("thread_history")
    sender_profile = routing.get("sender_profile")
    result = decode_reply_all(email, intent, thread_history, sender_profile)
    return {
        **routing,
        "needs_reply_all": result["use_reply_all"],
        "cc_list": result["cc_list"],
        "reply_all_reasoning": result["reasoning"],
        "reply_all_confidence": result["confidence"],
    }


if __name__ == "__main__":
    test = {
        "from": "cto@bigcorp.io",
        "to": "kleber@ziontechgroup.com",
        "cc": ["cfo@bigcorp.io", "coo@bigcorp.io"],
        "subject": "URGENT: Production server down",
        "body": "Our main server is not responding. We need immediate assistance!",
    }
    result = decode_reply_all(test, intent="urgent")
    print(json.dumps(result, indent=2))