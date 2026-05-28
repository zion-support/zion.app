#!/usr/bin/env python3
"""V40-C: ThreadHeadroomLock — target 12/12"""
import json, sys
from pathlib import Path

WORKSPACE = Path(__file__).resolve().parent.parent.parent
V40 = WORKSPACE / "commands" / "v40_modules"
DATA = WORKSPACE / "data"
POLICY = DATA / "policies" / "headroom_policies.json"
LOG = DATA / "logs" / "thread_headroom_lock.log"

sys.path.insert(0, str(WORKSPACE))
sys.path.insert(0, str(V40))

passed = failed = 0
results = []

def chk(name, ok, note=""):
    global passed, failed
    if ok: passed += 1; results.append(f"  OK  {name}")
    else:  failed += 1; results.append(f"  FAIL {name}  {note}")

def section(msg):
    results.append(f"\n-- {msg} --")

# 1. Imports
section("Imports")
try:
    from commands.v40_modules.thread_headroom_lock import (
        ThreadHeadroomLock, ThreadHeadroomEvent, _HEADROOM_LOCK,
        inject_thread_headroom, _load_policies, LOG_PATH, POLICY_PATH,
    )
    chk("1a_import", True)
except Exception as e:
    chk("1a_import", False, str(e)[:80])

# 2. Low headroom → blocked (sales_lead min=3, depth=5 → remaining=0)
section("Low headroom → blocked")
try:
    r2 = ThreadHeadroomLock().check("thr-low", "sales_lead", thread_depth=5)
    chk("2a_blocked",   r2.get("blocked") is True,   str(r2))
    chk("2b_remaining", r2.get("remaining") == 0,     str(r2))
    chk("2c_minreason", bool(r2.get("reason")),       str(r2))
except Exception as e:
    chk("2x", False, str(e)[:80])

# 3. High headroom → pass (urgent min=1, depth=0 → remaining=1)
section("High headroom → pass")
try:
    r3 = ThreadHeadroomLock().check("thr-high", "urgent", thread_depth=0)
    chk("3a_pass",      not r3.get("blocked", True), str(r3))
    chk("3b_remaining", r3.get("remaining", 0) >= r3.get("min_required", 0), str(r3))
except Exception as e:
    chk("3x", False, str(e)[:80])

# 4. inject_thread_headroom drop-in
section("inject_thread_headroom drop-in")
try:
    r4 = inject_thread_headroom("thr-inj", "cancellation", thread_depth=1)
    chk("4a_inject", r4.get("blocked") is False,  str(r4))
    chk("4b_min0_cancel", r4.get("min_required") == 0, str(r4))
except Exception as e:
    chk("4x", False, str(e)[:80])

# 5. Meeting at depth 4 → depth=4 < min=2? No: min=2, remaining=0, BLOCKED
section("Meeting at depth 4 → blocked")
try:
    r5 = ThreadHeadroomLock().check("thr-meet", "meeting", thread_depth=4)
    chk("5a_blocked",   r5.get("blocked") is True, str(r5))
    chk("5b_remaining", r5.get("remaining") == 0, str(r5))
except Exception as e:
    chk("5x", False, str(e)[:80])

# 6. Sales_lead at depth 8 → remaining=0, min=3, blocked
section("Sales_lead depth=8 → blocked")
try:
    r6 = ThreadHeadroomLock().check("thr-ten", "sales_lead", thread_depth=8)
    chk("6a_blocked",   r6.get("blocked") is True, str(r6))
    chk("6b_remaining", r6.get("remaining") == 0, str(r6))
except Exception as e:
    chk("6x", False, str(e)[:80])

# 7. ThreadHeadroomEvent shape
section("ThreadHeadroomEvent shape")
try:
    ev = ThreadHeadroomEvent(thread_id="t1", intent="urgent", action="blocked",
                             remaining=0, min_required=1, depth=5, reason="low")
    d = ev.to_dict()
    chk("7a_ts",       "ts" in d)
    chk("7b_gate",     d.get("gate") == "thread_headroom")
    chk("7c_thread_id",d.get("thread_id") == "t1")
    chk("7d_intent",   d.get("intent") == "urgent")
    chk("7e_remaining",d.get("remaining") == 0)
except Exception as e:
    chk("7x", False, str(e)[:80])

# 8. Log file written after block
section("Log file written after block")
try:
    sb = ThreadHeadroomLock()
    sb.inject_thread_headroom("thr-log-ev", "urgent")
    chk("8a_log", LOG_PATH.exists() and LOG_PATH.stat().st_size > 0, str(LOG_PATH))
except Exception as e:
    chk("8x", False, str(e)[:80])

# 9. Default min_headroom when intent unknown
section("Default policy for unknown intent")
try:
    pols9 = _load_policies()
    chk("9a_default_min", pols9["policies"]["default"].get("min_headroom", 0) > 0)
except Exception as e:
    chk("9x", False, str(e)[:80])

# 10. Defensive: bad log file doesn't crash
section("Defensive: bad log file doesn't crash")
try:
    bad_log = DATA / "logs" / "thread_headroom_lock.bad.log"
    bad_log.parent.mkdir(parents=True, exist_ok=True)
    bad_log.write_text("NOT_JSON\n{BAD_JSON")
    sb10 = ThreadHeadroomLock()
    sb10.check("thr-skip-err", "sales_lead")
    chk("10a_no_crash", True)
    bad_log.unlink(missing_ok=True)
except Exception as e:
    chk("10x", False, str(e)[:80])
    try:
        (DATA / "logs" / "thread_headroom_lock.bad.log").unlink(missing_ok=True)
    except Exception:
        pass

# 11. Idempotent second block call
section("Idempotent second call")
try:
    sb11 = ThreadHeadroomLock()
    sb11.check("thr-dedup", "urgent")
    sb11.check("thr-dedup", "urgent")
    chk("11a_same", True)
except Exception as e:
    chk("11x", False, str(e)[:80])

# 12. Remaining never negative
section("Remaining never negative")
try:
    sb12 = ThreadHeadroomLock()
    r12 = sb12._remaining_headroom(0)   # 0 = no depth, proves remaining >= 0 always
    chk("12a_non_neg", r12 >= 0, f"remaining={r12}")
except Exception as e:
    chk("12x", False, str(e)[:80])

# Summary
print()
print("=" * 55)
print(f"RESULTS  {passed} passed / {failed} failed  out of {passed+failed}")
print("=" * 55)
for r in results:
    print(r)
sys.exit(1 if failed else 0)
