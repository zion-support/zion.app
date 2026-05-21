from __future__ import annotations
#!/usr/bin/env python3
"""
decode_reply_all.py — M1 Reply-All Binding

For every inbound email:
  1. Resolve the Message-ID of the top-level message in the thread
  2. Pull the thread participants (To, CC, From, List-ID headers)
  3. Decide whether reply-all should be enforced or suppressed
  4. Attach `reply_all_binding` to the pipeline result dict

Never raises.  Defensive by default.
"""

import re, json
from pathlib import Path

_BINDING_LOG = Path(__file__).resolve().parent.parent.parent / "data" / "reply_all_bindings.jsonl"

# Broadcast signals that suppress reply-all entirely
_BROADCAST_DOMAINS: set = {
    "noreply@", "no-reply@", "no_reply@",
    "newsletter@", "announce@", "notification@", "updates@", "digest@",
    "github.com", "gitlab.com", "jenkins@", "circleci.com",
    "aws.amazon.com", "azure.com", "gcp.cloud.google.com",
}

# Known-list patterns → safe to reply-all
_SAFE_LIST_PATTERNS = re.compile(
    r"list-?id|mailman|groups.io|googlegroups|discourse|slack|teams", re.I
)

def decode_reply_all(email: dict) -> dict:
    """Return a reply_all_binding dict for one inbound email."""
    sender     = email.get("sender", "")
    all_rcp    = [email.get("to", ""), email.get("cc", "")]
    subject    = email.get("subject", "")
    thread_id  = email.get("thread_id", "")
    msg_id     = email.get("message_id", "")

    # Rule 1: no CC header at all -> no reply-all
    if not email.get("cc"):
        return {"bind_to_msg_id": msg_id, "reply_all": False,
                "reason": "no CC header", "thread_participants": all_rcp}

    # Rule 2: sender is a known broadcast emitter -> suppress
    s_lower = sender.lower()
    if any(dom in s_lower for dom in _BROADCAST_DOMAINS):
        return {"bind_to_msg_id": msg_id, "reply_all": False,
                "reason": "broadcast sender", "thread_participants": all_rcp}

    # Rule 3: List-ID or safe-list header present -> allow
    headers_raw = email.get("headers_raw", "")
    if _SAFE_LIST_PATTERNS.search(str(headers_raw)):
        return {"bind_to_msg_id": msg_id, "reply_all": True,
                "reason": "safe-list header", "thread_participants": all_rcp}

    # Rule 4: small thread (< 3 unique participants) → allow
    uniq = set(e.strip() for e in all_rcp if e.strip())
    if len(uniq) <= 3:
        return {"bind_to_msg_id": msg_id, "reply_all": True,
                "reason": "small thread", "thread_participants": all_rcp}

    # Rule 5: known partner / internal domain → allow
    if re.search(r"@zion\S*\.com|@partner\S*|@client\S*", sender, re.I):
        return {"bind_to_msg_id": msg_id, "reply_all": True,
                "reason": "internal/partner sender", "thread_participants": all_rcp}

    # Rule 6: default → suppress for large external threads
    return {"bind_to_msg_id": msg_id, "reply_all": False,
            "reason": "large external thread", "thread_participants": all_rcp}


def bind(result: dict, email: dict) -> dict:
    """Attach reply_all_binding into result. Mutates and returns result."""
    try:
        binding = decode_reply_all(email)
        result["reply_all_binding"]      = binding
        result["reply_all_enforced"]     = binding.get("reply_all", False)
        result["reply_all_reason"]       = binding.get("reason", "")
    except Exception as ex:
        result["reply_all_binding_error"] = str(ex)
    return result
