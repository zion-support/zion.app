from __future__ import annotations
#!/usr/bin/env python3
"""
w2-03 — Thread-Participant Expansion

When we send a reply, extract CC'd addresses from our own outgoing thread
and surface them as new sender-participants in future thread analysis.

Feeds into SenderProfileLearner + ThreadContinuityPredictor.
"""

import re
from datetime import datetime, timezone
from pathlib import Path

_LOG = Path(__file__).resolve().parent.parent.parent / "data" / "participant_expand.jsonl"


def extract_participants(email: dict, include_cc: bool = True) -> list[str]:
    """Return a deduplicated list of email addresses in this thread."""
    fields = []
    for key in ('from', 'to', 'cc', 'bcc', 'sender', 'recipient', 'reply_to'):
        val = email.get(key)
        if val:
            fields.append(val)
    text = " ".join(fields)
    return sorted(set(re.findall(r'[\w.+-]+@[\w.-]+', text)))


def expand_from_sent(sent_email: dict, gmail_search_fn, learner_fn,
                     *, max_new: int = 5) -> dict:
    """After sending: find new CC'd addresses and register them."""
    participants = extract_participants(sent_email)
    new_addrs = []
    if learner_fn:
        try:
            known = set(learner_fn.known_senders() if hasattr(learner_fn, 'known_senders') else [])
        except Exception:
            known = set()
        new_addrs = [p for p in participants if p not in known and p]
        for addr in new_addrs[:max_new]:
            try:
                learner_fn(addr, {'thread_seen': True, 'source': 'reply_all_cc_expansion'})
            except Exception:
                pass
    return {
        "ts":     datetime.now(timezone.utc).isoformat(),
        "thread_id": sent_email.get("thread_id", ""),
        "participants": participants,
        "new_addresses": new_addrs[:max_new],
    }
