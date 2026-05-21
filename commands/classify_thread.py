from __future__ import annotations
#!/usr/bin/env python3
"""
Thread Intent Classifier - M1

Classify inbound threads by business intent before any pipeline decision.
Never skips reply-all binding. Always called for every inbound email.

Threading intent -> colour the _v25_pipeline to shortcut classification.

Label  -> RFC 1700 label space (tone neutral, no opt-in to send)
"""

import re, json
from pathlib import Path

_LOG = Path(__file__).resolve().parent.parent.parent / "data" / "thread_classify_log.jsonl"

THREAD_INTENTS: dict = {
    "sales_lead":       "Sales / Lead",
    "support_issue":    "Support / Issue",
    "partner_alliance": "Partner / Alliance",
    "urgent":           "Urgent",
    "spam_newsletter":  "Spam / Newsletter",
    "system_cicd":      "System / CI-CD",
    "internal_cc":      "Internal / Cc-only",
    "personal_one2one": "Personal / 1-to-1",
    "unknown":          "Unknown",
}

_RE_SALES    = re.compile(r"\b(pricing|quote|demo|purchase|contract|SLA|proposal|budge[ct])\b", re.I)
_RE_SUPPORT  = re.compile(r"\b(bug|issue|error|broken|down|outage|not.?working|crash|fail|incident|ticket)\b", re.I)
_RE_PARTNER  = re.compile(r"\b(partner[\s\-]|alliance|AP[Ii]|OEM)\b", re.I)
_RE_URGENT   = re.compile(r"\b(urgent|critical|asap|immediately|emergency|P0|P1|severe|blocked)\b", re.I)
_RE_SPAM     = re.compile(r"\b(unsubscribe|newsletter|digest|weekly\s+roundup|marketing|promo)\b", re.I)
_RE_SYSTEM   = re.compile(r"\b(CI[- ]?CD|Jenkins|GitHub.?Actions|deploy|pipeline|build.?fail)\b", re.I)
_RE_INTERNAL = re.compile(r"@zion\S*\.com|cc:|\binternal@|\b(cc):\s*internal", re.I)
_RE_PAYMENT  = re.compile(r"\b(payment|invoice|paid|billing|wire|ACH|receipt)\b", re.I)
_RE_CALENDAR = re.compile(r"\b(schedule|calendar|meeting|call|zoom|teams|availab(?:le|ility)?)\b", re.I)


def _score(hits: int, label: str) -> float:
    base = min(1.0, hits * 0.28)
    if label in ("sales_lead", "urgent", "partner_alliance"):
        base = min(1.0, base + 0.15)
    return round(base, 3)


def classify_thread(msg: dict) -> dict:
    """Classify an inbound email into a thread-intent slot. Never raises."""
    subj = msg.get("subject", "")
    snip = msg.get("snippet", "")
    body = msg.get("body", "")
    text = f"{subj} {snip} {body}".lower()

    if re.search(r"\b(unsubscribe|remove.?me)\b", text):
        return dict(thread_intent="spam_newsletter", confidence=0.92,
                    label=THREAD_INTENTS["spam_newsletter"], reply_all=False,
                    reason="explicit unsubscribe -> auto-archive", routing="archive")

    if _RE_SPAM.search(text):
        return dict(thread_intent="spam_newsletter", confidence=_score(2,"spam_newsletter"),
                    label=THREAD_INTENTS["spam_newsletter"], reply_all=False,
                    reason="newsletter/marketing keywords", routing="archive")

    if _RE_URGENT.search(text) or _RE_SUPPORT.search(text):
        return dict(thread_intent="urgent", confidence=_score(2,"urgent"),
                    label=THREAD_INTENTS["urgent"], reply_all=True, priority="high",
                    routing="fast_path", reason="urgent/support keywords")

    if _RE_PAYMENT.search(text):
        return dict(thread_intent="urgent", confidence=0.90,
                    label=THREAD_INTENTS["urgent"], reply_all=True, priority="high",
                    routing="fast_path", reason="payment/billing keywords")

    if _RE_SALES.search(text):
        return dict(thread_intent="sales_lead", confidence=_score(3,"sales_lead"),
                    label=THREAD_INTENTS["sales_lead"], reply_all=True,
                    reply_focus="BD / Sales rep", routing="full_pipeline",
                    reason="pricing/quote/demo keywords")

    if _RE_PARTNER.search(text):
        return dict(thread_intent="partner_alliance", confidence=_score(2,"partner_alliance"),
                    label=THREAD_INTENTS["partner_alliance"], reply_all=True,
                    reply_focus="Partnerships lead", routing="full_pipeline",
                    reason="partner/alliance/API keywords")

    if _RE_SYSTEM.search(text):
        return dict(thread_intent="system_cicd", confidence=_score(2,"system_cicd"),
                    label=THREAD_INTENTS["system_cicd"], reply_all=True,
                    reply_focus="DevOps", routing="fast_path",
                    reason="CI-CD/deploy/build keywords")

    if _RE_INTERNAL.search(text):
        return dict(thread_intent="internal_cc", confidence=0.82,
                    label=THREAD_INTENTS["internal_cc"], reply_all=True,
                    reply_focus="Internal team", routing="fast_path",
                    reason="internal domain / cc-only")

    if _RE_CALENDAR.search(text):
        return dict(thread_intent="support_issue", confidence=0.72,
                    label=THREAD_INTENTS["support_issue"], reply_all=True,
                    reply_focus="Calendar", routing="full_pipeline",
                    reason="scheduling keywords")

    if "," not in subj.split("\n")[0] or "@" in subj.split("\n")[0]:
        return dict(thread_intent="personal_one2one", confidence=0.78,
                    label=THREAD_INTENTS["personal_one2one"], reply_all=False,
                    reason="direct 1-to-1 thread", routing="fast_path")

    return dict(thread_intent="unknown", confidence=0.45,
                label=THREAD_INTENTS["unknown"], reply_all=False,
                reason="no dominant keyword matched", routing="full_pipeline",
                fallback_to_full_pipeline=True)


def add_to_result(email: dict, result: dict) -> dict:
    """Stamp thread_intent into pipeline result; returns result (mutated)."""
    try:
        ct = classify_thread(email)
        result["thread_intent"]    = ct["thread_intent"]
        result["thread_label"]     = ct["label"]
        result["thread_confidence"] = ct["confidence"]
        result["thread_reason"]    = ct["reason"]
        result["reply_all_hint"]   = ct.get("reply_all", False)

        if ct.get("routing") == "archive":
            if result.get("action") not in ("escalated",):
                result["action"] = "archive"
                result["reason"]  = ct["reason"]
        elif ct.get("routing") == "fast_path" and result.get("action") == "auto_ack":
            result["action"] = "fast_path"
            result["reason"]  = f"{result.get('reason','')} | thread={ct['thread_intent']} override"
    except Exception as ex:
        result["thread_intent_error"] = str(ex)
    return result
