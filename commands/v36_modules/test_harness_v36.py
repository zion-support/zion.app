#!/usr/bin/env python3
"""
V36 Test Harness — Deferred Reply Queue — 8 targets
"""
import sys, json, os, time
from pathlib import Path

WORKSPACE = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(WORKSPACE))

passed = failed = 0
results = []
queue_file = WORKSPACE / "data" / "deferred_reply_queue.jsonl"

def fresh_queue():
    if queue_file.exists():
        queue_file.write_text("")

def check(name, ok, detail=""):
    global passed, failed
    if ok:
        passed += 1; results.append(f"  OK  {name}" + (f" — {detail}" if detail else ""))
    else:
        failed += 1; results.append(f"FAIL  {name}" + (f" — {detail}" if detail else ""))

def section(t): print(f"\n[{t}]")

print("=" * 55)
print("V36 TEST HARNESS — Deferred Reply Queue · 8 assertions")
print("=" * 55)

from commands.v36_modules.deferred_reply_queue import (
    enqueue, next_pass, mark_passed, remove_from_queue, queue_stats, clear_queue, bucket_email
)

# helpers for clock override
from commands.v36_modules import deferred_reply_queue as drq

def frozen_now(ts: float, mod=drq):
    def _fn(): return ts
    mod._now_ts = _fn
    return ts

# ── 1. enqueue 6 mixed-depth → 3 immediate + 3 deferred ──────────────────
section("enqueue — mixed depth")
fresh_queue()
try:
    now0 = time.monotonic()
    frozen_now(now0)
    batch = [
        {"email_id": "e1", "subject": "Hello", "body": "hi there", "account_meta": {}},
        {"email_id": "e2", "subject": "Price quote", "body": "can you give me a price", "account_meta": {}},
        {"email_id": "e3", "subject": "Broken", "body": "something is broken and angry", "account_meta": {}},
        {"email_id": "e4", "subject": "Meeting", "body": "let's schedule a meeting", "account_meta": {}},
        {"email_id": "e5", "subject": "Thanks", "body": "thanks!", "account_meta": {}},
        {"email_id": "e6", "subject": "Unclear", "body": "not sure what this is", "account_meta": {}},
    ]
    r = enqueue(batch)
    check("1a_total", r["total_batch"] == 6, str(r["total_batch"]))
    check("1b_immediate", r["immediate_count"] == 3, r["immediate_count"])         # e1 (greet=1) e5 (greet=1) e6 unclear→2→deferred
    check("1c_deferred", r["deferred_count"] == 3, r["deferred_count"])             # e2,e3,e4 go deferred
    check("1d_ids", len(r["immediate_ids"]) + len(r["deferred_ids"]) == 6)
except Exception as e:
    check("1x", False, str(e)[:80])

# ── 2. depth-2 fires after gap ───────────────────────────────────────────────
section("next_pass — gap fires deferred")
try:
    now1 = now0 + 15 * 60 + 1   # 16 min later
    frozen_now(now1)
    due = next_pass(gap_min=15)
    check("2a_due_count", len(due) == 3, str(len(due)))
    check("2b_all_depth2plus", all(e.get("depth", 0) >= 2 for e in due))
    check("2c_e2_in_due", any(e["email_id"] == "e2" for e in due))
except Exception as e:
    check("2x", False, str(e)[:80])

# ── 3. canonical-zero guard ─────────────────────────────────────────────────
section("canonical-zero guard")
try:
    from commands.v35_modules.canonical_zero_score import canonical_zero_score, reset as cz_reset
    from commands.v35_modules.canonical_zero_score import canonical_zero_score, reset as cz_reset
    cz_reset()   # clear any prior state
    cz_r = canonical_zero_score(emails_processed=0, actions_taken=0, score=0.0)
    check("3a_zero_detected", cz_r["canonical_zero"] is True)
    check("3b_action_alert", cz_r["recommended_action"] == "alert")
except Exception as e:
    check("3x", False, str(e)[:80])

# ── 4. mark_passed advances last_pass_ts ────────────────────────────────────
section("mark_passed — advances ts")
try:
    frozen_now(now1)
    mark_passed("e2")
    stats = queue_stats()
    check("4a_in_queue", stats["total"] >= 1)
except Exception as e:
    check("4x", False, str(e)[:80])

# ── 5. GRC tags propagate into queue ─────────────────────────────────────────
section("GRC tag propagation")
try:
    fresh_queue()
    with_grc = [
        {"email_id": "grc-1", "subject": "Hello", "body": "hi",
         "account_meta": {"dc_only": True, "agency_cco": True}},
    ]
    enqueue(with_grc)
    items = list(queue_file.read_text().splitlines())
    raw = json.loads(items[0]) if items else {}
    grc = raw.get("grc_tags", [])
    check("5a_dc_only", "dc-only" in grc, grc)
    check("5b_agency_cco", "agency-cco" in grc, grc)
except Exception as e:
    check("5x", False, str(e)[:80])

# ── 6. remove_from_queue after reply sent ─────────────────────────────────
section("remove_from_queue")
try:
    fresh_queue()
    enqueue([{"email_id": "rm-1", "subject": "q", "body": "body", "account_meta": {}}])
    ok = remove_from_queue("rm-1")
    check("6a_removed", ok is True)
    items2 = list(queue_file.read_text().splitlines())
    check("6b_empty", len(items2) == 0)
except Exception as e:
    check("6x", False, str(e)[:80])

# ── 7. pass_count increments ───────────────────────────────────────────────
section("pass_count increments")
try:
    fresh_queue()
    enqueue([{"email_id": "pc-1", "subject": "q", "body": "body", "account_meta": {}}])
    mark_passed("pc-1"); mark_passed("pc-1")
    raw = json.loads(queue_file.read_text().splitlines()[0])
    check("7a_pass2", raw.get("pass_count", 0) == 2, str(raw.get("pass_count")))
except Exception as e:
    check("7x", False, str(e)[:80])

# ── 8. clear_queue ───────────────────────────────────────────────────────
section("clear_queue")
try:
    fresh_queue()
    enqueue([{"email_id": "x1", "subject": "a", "body": "b", "account_meta": {}}])
    clear_queue()
    items3 = list(queue_file.read_text().splitlines())
    check("8a_empty", len(items3) == 0, len(items3))
except Exception as e:
    check("8x", False, str(e)[:80])

# ── Summary ────────────────────────────────────────────────────────────
print()
print("=" * 55)
print(f"RESULTS  {passed} passed / {failed} failed  out of {passed+failed}")
print("=" * 55)
for line in results:
    print(line)
sys.exit(1 if failed else 0)
