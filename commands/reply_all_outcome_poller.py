from __future__ import annotations
#!/usr/bin/env python3
"""
w2-02 — Reply-All Outcome → Sender Profile (48h poll + write)

After every send, record whether reply-all was *actually* used and what the
48-hour follow-up outcome was.  Feed back into SenderProfileLearnerV23 so
future emails from the same sender get the correct reply-all default.

Workflow:
  1. record_send()      — called immediately after every send (fast or full)
  2. poll_outcome()     — cron job every 48h; checks thread for response
  3. write_profile()     — updates SenderProfileLearner outcome_history
"""

import json, re
from datetime import datetime, timezone, timedelta
from pathlib import Path

_LOG    = Path(__file__).resolve().parent.parent.parent / "data" / "reply_all_outcome.jsonl"
_POLL   = Path(__file__).resolve().parent.parent.parent / "data" / "reply_all_pending.jsonl"
_RETENTION = timedelta(days=90)


def record_send(sender: str, thread_id: str, message_id: str,
                reply_all_used: bool, reply_all_detail: dict | None = None,
                *, receiver: str = "cto@ziontechgroup.com") -> None:
    """Stamp a pending record after every send.  Must be called at send time."""
    rec = {
        "ts":          datetime.now(timezone.utc).isoformat(),
        "sender":      sender,
        "thread_id":   thread_id,
        "message_id":  message_id,
        "reply_all_used": reply_all_used,
        "reply_all_detail": reply_all_detail or {},
        "receiver":    receiver,
        "polled":      False,
        "outcome":     None,          # filled by poll_outcome
    }
    try:
        with open(_POLL, 'a') as f:
            f.write(json.dumps(rec, ensure_ascii=False) + '\n')
    except Exception:
        pass


def poll_outcome(gmail_search_fn, gmail_get_fn) -> list[dict]:
    """Cron runner: scan pending records for threads that received a response.

    Returns list of updated records.
    """
    if not _POLL.exists():
        return []
    now    = datetime.now(timezone.utc)
    cutoff = now - _RETENTION
    updated = []
    try:
        lines = _POLL.read_text().splitlines()
    except Exception:
        return []
    keep  = []
    for line in lines:
        try:
            rec = json.loads(line)
        except Exception:
            continue
        # Skip already-polled or expired
        if rec.get('polled') or datetime.fromisoformat(rec['ts']) < cutoff:
            keep.append(line)
            continue
        tid  = rec['thread_id']
        sender = rec['sender']
        # Search for downstream replies in this thread
        hits = []
        if gmail_search_fn:
            try:
                hits = gmail_search_fn(f'from:{sender} thread_id:{tid}', limit=5)
            except Exception:
                pass
        responded = bool(hits)
        rec['polled'] = True
        rec['outcome'] = 'replied_by_sender' if responded else 'no_reply_48h'
        rec['polled_at'] = now.isoformat()
        keep.append(json.dumps(rec, ensure_ascii=False))
        updated.append(rec)
    # Rewrite
    try:
        _POLL.write_text('\n'.join(keep) + '\n' if keep else '')
    except Exception:
        pass
    return updated


def write_profile(rec: dict, learner_fn) -> dict:
    """Write reply-all outcome into SenderProfileLearner outcome_history."""
    if not learner_fn:
        return {"ok": False, "reason": "no_learner"}
    sender = rec['sender']
    self_cc = rec.get('reply_all_used', False)
    outcome = rec.get('outcome', 'unknown')
    # Map outcome → profile outcome slot
    profile_outcome = {
        'replied_by_sender': 'positive' if self_cc else 'neutral',
        'no_reply_48h':      'neutral',
    }.get(outcome, 'neutral')
    try:
        learner_fn(sender, {
            'reply_all_outcome':   outcome,
            'reply_all_used':      self_cc,
            'reply_all_thread_id': rec['thread_id'],
            'profile_outcome':     profile_outcome,
        })
    except Exception as ex:
        return {"ok": False, "reason": str(ex)}
    return {"ok": True, "sender": sender, "outcome": outcome,
            "profile_outcome": profile_outcome}
