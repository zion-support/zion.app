#!/usr/bin/env python3
"""V41-B: Autopilot Blocks — target 12/12"""
import sys
from pathlib import Path

WORKSPACE = Path(__file__).resolve().parent.parent.parent
V41      = WORKSPACE / "commands" / "v41_modules"
DATA     = WORKSPACE / "data"

sys.path.insert(0, str(WORKSPACE))
sys.path.insert(0, str(V41))

passed = failed = 0
results = []

def chk(name, ok, note=""):
    global passed, failed
    if ok: passed += 1; results.append(f"  OK  {name}")
    else:  failed += 1; results.append(f"  FAIL {name}  {note}")

def sec(msg):
    results.append(f"\n-- {msg} --")

sec("Import")
try:
    from commands.v41_modules.reply_all_enforcer import (
        AutopilotBlocks, AutopilotBlockEvent,
        inject_autopilot_blocks, LOG_PATH, tier_depth, load_cfg,
    )
    chk("1a_import", True)
except Exception as e:
    chk("1a_import", False, str(e)[:80])

sec("Depth 0 -> pass")
try:
    r2 = AutopilotBlocks().check("thr","",reply_all_depth=0)
    chk("2a_pass", not r2.get("blocked"), str(r2))
    chk("2b_depth_0", r2["reply_all_depth"] == 0)
except Exception as e:
    chk("2x", False, str(e)[:80])

sec("Depth 4 (=default max) -> pass")
try:
    r3 = AutopilotBlocks().check("thr","",reply_all_depth=4)
    chk("3a_pass", not r3.get("blocked"), str(r3))
except Exception as e:
    chk("3x", False, str(e)[:80])

sec("Depth 5 > default max=4 -> blocked")
try:
    r4 = AutopilotBlocks().check("thr","",reply_all_depth=5)
    chk("4a_blocked", r4.get("blocked") is True, str(r4))
    chk("4b_max_4", r4.get("max_allowed") == 4)
except Exception as e:
    chk("4x", False, str(e)[:80])

sec("Tier tier:110k hitl + gating depth 4 -> blocked")
try:
    r5 = AutopilotBlocks().check("thr","tier:110k hitl + gating",reply_all_depth=4)
    chk("5a_blocked", r5.get("blocked") is True, str(r5))
    chk("5b_max_3",   r5.get("max_allowed") == 3)
except Exception as e:
    chk("5x", False, str(e)[:80])

sec("Tier lock max=0 any depth -> blocked")
try:
    r6 = AutopilotBlocks().check("thr","lock",reply_all_depth=1)
    chk("6a_blocked", r6.get("blocked") is True, str(r6))
    chk("6b_max_0",   r6.get("max_allowed") == 0)
except Exception as e:
    chk("6x", False, str(e)[:80])

sec("inject_autopilot_blocks drop-in")
try:
    r7 = inject_autopilot_blocks("thr7","domestic",3)
    chk("7a_module_dropin", "blocked" in r7, str(r7))
except Exception as e:
    chk("7x", False, str(e)[:80])

sec("AutopilotBlockEvent shape")
try:
    ev8 = AutopilotBlockEvent(thread_id="ev8",tier="domestic",
                              reply_depth=2,max_depth=2,action="pass")
    d8  = ev8.to_dict()
    chk("8a_ts", "ts" in d8)
    chk("8b_gate", d8.get("gate")=="autopilot_block")
    chk("8c_depth",   d8["reply_depth"]==2)
    chk("8d_max_depth",d8["max_depth"]==2)
except Exception as e:
    chk("8x", False, str(e)[:80])

sec("Log file")
try:
    from commands.v41_modules.reply_all_enforcer import LOG_PATH as _LP
    from commands.v41_modules.reply_all_enforcer import AutopilotBlocks as _AS
    _AS().check("thr-log","domestic",reply_all_depth=5)
    chk("9a_log_exists", _LP.exists() and _LP.stat().st_size > 0, str(_LP))
except Exception as e:
    chk("9x", False, str(e)[:80])

sec("Unknown tier -> defaults boundary")
try:
    r10 = AutopilotBlocks().check("thr","unknown_tier",reply_all_depth=4)
    chk("10a_pass", not r10.get("blocked"), str(r10))
    r10b = AutopilotBlocks().check("thr","unknown_tier",reply_all_depth=5)
    chk("10b_blocked", r10b.get("blocked") is True, str(r10b))
except Exception as e:
    chk("10x", False, str(e)[:80])

sec("Bad cfg file -> no crash")
try:
    bad = DATA / "config" / "bad_apb_cfg.yaml"
    bad.write_text("!!bad yaml\n{")
    from commands.v41_modules.reply_all_enforcer import AutopilotBlocks as _AB
    _AB(bad).check("thr","",reply_all_depth=0)
    chk("11a_no_crash", True)
    bad.unlink(missing_ok=True)
except Exception as e:
    chk("11x", False, str(e)[:80])
    try: (DATA / "config" / "bad_apb_cfg.yaml").unlink(missing_ok=True)
    except: pass

sec("LOG_PATH type")
try:
    from commands.v41_modules.reply_all_enforcer import LOG_PATH as _LP41
    chk("12a_path_type", isinstance(_LP41, Path))
    chk("12b_log_in_data", "logs" in str(_LP41))
except Exception as e:
    chk("12x", False, str(e)[:80])

print()
print("="*55)
print(f"RESULTS  {passed} passed / {failed} failed  out of {passed+failed}")
print("="*55)
for r in results: print(r)
sys.exit(1 if failed else 0)
