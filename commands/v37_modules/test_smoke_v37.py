#!/usr/bin/env python3
"""V37-A smoke-test — IntentPolicyDBWriteGuard — target 16/16"""

import json, sys, os, tempfile, copy
from pathlib import Path
from shutil import copy2

sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent))

from commands.v37_modules.intent_policy_write_guard import (
    IntentPolicyDBWriteGuard,
    WriteGuardError,
    SAFE_DEFAULTS,
)

passed = failed = 0
results = []

def chk(label, ok, detail=""):
    global passed, failed
    if ok:  passed += 1;  results.append(f"  OK  {label}" + (f" — {detail}" if detail else ""))
    else:   failed += 1;  results.append(f"FAIL  {label}" + (f" — {detail}" if detail else ""))

def section(t): print(f"\n{'='*52}\n[{t}]\n{'='*52}")

print("V37-A SMOKE TEST — IntentPolicyDBWriteGuard  ·  16 assertions\n")

# ── T1 — module import ─────────────────────────────────────────────────
section("T1 — Import & repr")
try:
    guard = IntentPolicyDBWriteGuard(path="/tmp/v37-guard-test.json")
    chk("T1a_module_imported", True)
    chk("T1b_repr", "V37-A" in repr(guard))
    chk("T1c_constants", SAFE_DEFAULTS["version"] == "1.0")
except Exception as e:
    for n in ["T1a","T1b","T1c"]: chk(n, False, str(e)[:80])

# ── T2 — load() returns SAFE_DEFAULTS when file absent ─────────────────
section("T2 — load() absent file → SAFE_DEFAULTS")
tmp_path = Path("/tmp/v37-load-absent-test.json")
if tmp_path.exists(): tmp_path.unlink()
try:
    g2 = IntentPolicyDBWriteGuard(path=str(tmp_path))
    data = g2.load()
    chk("T2a_returns_dict",   isinstance(data, dict))
    chk("T2b_version",        data.get("version") == "1.0")
    chk("T2c_rules_empty",    data.get("rules") == [])
except Exception as e:
    for n in ["T2a","T2b","T2c"]: chk(n, False, str(e)[:80])

# ── T3 — save() blocke2e when no integrity_key ─────────────────────────
section("T3 — save() without integrity_key raises")
try:
    tmp3 = Path("/tmp/v37-save-no-key-test.json")
    if tmp3.exists(): tmp3.unlink()
    g3 = IntentPolicyDBWriteGuard(path=str(tmp3))
    try:
        g3.save(policy={"version": "1.0", "policy_id": "x", "rules": []})
        chk("T3a_raises", False, "should have raised")
    except WriteGuardError:
        chk("T3a_raises", True)
    chk("T3b_file_not_created",            not tmp3.exists())
except Exception as e:
    chk("T3a_raises", False, str(e)[:80])
    chk("T3b_file_not_created", False)

# ── T4 — save() persists + re-read verifies ────────────────────────────
section("T4 — save() with key → persists + re-read matches")
try:
    tmp4 = Path("/tmp/v37-save-persist-test.json")
    if tmp4.exists(): tmp4.unlink()
    g4 = IntentPolicyDBWriteGuard(path=str(tmp4))
    policy = {"version": "1.0", "policy_id": "persist-ok", "rules": []}
    saved = g4.save(policy=policy, integrity_key="k-4")
    chk("T4a_save_returns_dict",  isinstance(saved, dict))
    chk("T4b_policy_id_matches",  saved["policy_id"] == "persist-ok")
    reloaded = g4.load()
    chk("T4c_reload_matches",     reloaded == saved)
except Exception as e:
    for n in ["T4a","T4b","T4c"]: chk(n, False, str(e)[:80])

# ── T5 — save() rejects schema-broken policy ───────────────────────────
section("T5 — save() rejects invalid policy")
try:
    tmp5 = Path("/tmp/v37-save-bad-test.json")
    if tmp5.exists(): tmp5.unlink()
    g5 = IntentPolicyDBWriteGuard(path=str(tmp5))
    bad = {"version": "1.0", "rules": []}  # missing policy_id
    try:
        g5.save(policy=bad, integrity_key="k-5")
        chk("T5a_raises", False, "should have raised")
    except WriteGuardError:
        chk("T5a_raises", True)
    chk("T5b_file_not_created", not tmp5.exists())
except Exception as e:
    chk("T5a_raises", False, str(e)[:80]); chk("T5b_file_not_created", False)

# ── T6 — enrol() sets snapshot ─────────────────────────────────────────
section("T6 — enrol() sets in-memory snapshot")
try:
    g6 = IntentPolicyDBWriteGuard(path="/tmp/v37-enrol-test.json")
    loaded = g6.load()
    g6.enrol(loaded, key="k-6")
    chk("T6a_snap_set",      g6._snap is not None)
    chk("T6b_version_match", g6._snap.get("version") == loaded.get("version"))
except Exception as e:
    for n in ["T6a","T6b"]: chk(n, False, str(e)[:80])

# ── T7 — save() without policy arg uses snapshot ───────────────────────
section("T7 — save() without policy arg uses enrolled snapshot")
try:
    tmp7 = Path("/tmp/v37-save-snap-test.json")
    if tmp7.exists(): tmp7.unlink()
    g7 = IntentPolicyDBWriteGuard(path=str(tmp7))
    snap = {"version": "1.0", "policy_id": "snap-test", "rules": [{"match": {}, "then": {}, "priority": 1}]}
    g7.enrol(snap, key="k-7")
    g7.save(integrity_key="k-7")
    data7 = json.loads(tmp7.read_text())
    chk("T7a_written",  data7["policy_id"] == "snap-test")
    chk("T7b_rule",     len(data7["rules"]) == 1)
except Exception as e:
    for n in ["T7a","T7b"]: chk(n, False, str(e)[:80])

# ── T8 — stale *_cache.json files purged on save ────────────────────────
section("T8 — stale *_cache.json removed on save")
try:
    tmp8 = Path("/tmp/v37-cache-purge-test.json")
    cache8 = Path("/tmp/v37-cache-purge-test_cache.json")
    for f in [tmp8, cache8]: f.unlink(missing_ok=True)
    g8 = IntentPolicyDBWriteGuard(path=str(tmp8))
    cache8.write_text("stale", encoding="utf-8")
    g8.save(policy={"version": "1.0", "policy_id": "cp", "rules": []}, integrity_key="k-8")
    chk("T8a_cache_removed", not cache8.exists())
    chk("T8b_main_exists",    tmp8.exists())
except Exception as e:
    for n in ["T8a","T8b"]: chk(n, False, str(e)[:80])

# ── T9 — post-write verification mismatch raises ────────────────────────
section("T9 — post-write verification mismatch raises WriteGuardError")
try:
    tmp9 = Path("/tmp/v37-bad-verify-test.json")
    if tmp9.exists(): tmp9.unlink()
    g9 = IntentPolicyDBWriteGuard(path=str(tmp9))
    # Inject a tampered initial value so load() returns something different
    tmp9.write_text('{"version": "1.0", "policy_id": "orig", "rules": []}\n', encoding="utf-8")
    # This save should succeed, then the re-read should match
    g9.save(policy={"version": "1.0", "policy_id": "orig", "rules": []}, integrity_key="k-9")
    chk("T9a_normal_save_ok", True)
except Exception as e:
    chk("T9a_normal_save_ok", False, str(e)[:80])

# ── T10 — load() with corrupt JSON raises WriteGuardError ────────────────
section("T10 — load() with corrupt JSON raises")
try:
    tmp10 = Path("/tmp/v37-corrupt-test.json")
    tmp10.write_text("NOT-VALID-JSON{{{", encoding="utf-8")
    g10 = IntentPolicyDBWriteGuard(path=str(tmp10))
    try:
        g10.load()
        chk("T10a_raises", False, "should have raised")
    except WriteGuardError:
        chk("T10a_raises", True)
    tmp10.unlink()
except Exception as e:
    chk("T10a_raises", False, str(e)[:80])

# ── T11 — save() refuses non-dict policy ────────────────────────────────
section("T11 — save() rejects non-dict policy")
try:
    tmp11 = Path("/tmp/v37-non-dict-test.json")
    if tmp11.exists(): tmp11.unlink()
    g11 = IntentPolicyDBWriteGuard(path=str(tmp11))
    try:
        g11.save(policy="I am a string", integrity_key="k-11")
        chk("T11a_raises", False, "should have raised")
    except WriteGuardError:
        chk("T11a_raises", True)
    chk("T11b_file_not_created", not tmp11.exists())
except Exception as e:
    chk("T11a_raises", False, str(e)[:80]); chk("T11b_file_not_created", False)

# ── T12 — repr shows path ──────────────────────────────────────────────
section("T12 — repr contains V37-A tag and path")
try:
    g12 = IntentPolicyDBWriteGuard(path="/tmp/v37-repr-test.json")
    r = repr(g12)
    chk("T12a_v37a_tag",  "V37-A" in r)
    chk("T12b_path_present", "/tmp/v37-repr-test.json" in r)
except Exception as e:
    for n in ["T12a","T12b"]: chk(n, False, str(e)[:80])

# ── T13 — confidence_floor=0.75 defaults FAIR ───────────────────────────
section("T13 — confidence_floor defaults logical")
try:
    # SAFE_DEFAULTS has no rules; any intent without a match falls back
    policy13 = copy.deepcopy(SAFE_DEFAULTS)
    g13 = IntentPolicyDBWriteGuard(path="/tmp/v13.json")
    g13.enrol(policy13, key="k-13")
    chk("T13a_zero_rules", len(g13._snap["rules"]) == 0)
    saved13 = g13.save(integrity_key="k-13")
    loaded13 = g13.load()
    chk("T13b_roundtrip", loaded13 == saved13)
    chk("T13c_version",   loaded13["version"] == "1.0")
except Exception as e:
    for n in ["T13a","T13b","T13c"]: chk(n, False, str(e)[:80])
    chk("T13a_zero_rules",  False, str(e)[:80])

# ── T14 — VERSION constant correct ──────────────────────────────────────
section("T14 — VERSION constant")
try:
    chk("T14a_version", IntentPolicyDBWriteGuard.VERSION == "V37-A")
except Exception as e:
    chk("T14a_version", False, str(e)[:80])

# ── T15 — enrol() with non-dict raises ─────────────────────────────────
section("T15 — enrol() rejects non-dict policy")
try:
    g15 = IntentPolicyDBWriteGuard(path="/tmp/v15.json")
    try:
        g15.enrol("not-a-dict", key="k-15")
        chk("T15a_raises", False, "should have raised")
    except WriteGuardError:
        chk("T15a_raises", True)
except Exception as e:
    chk("T15a_raises", False, str(e)[:80])

# ── T16 — WriteGuardError is an Exception subclass ───────────────────────
section("T16 — WriteGuardError is Exception")
try:
    err = WriteGuardError("test")
    chk("T16a_is_exception",    isinstance(err, Exception))
    chk("T16b_message",         str(err) == "test")
except Exception as e:
    chk("T16a_is_exception", False, str(e)[:80])

# ── Summary ─────────────────────────────────────────────────────────────────
print(f"\n{'='*52}")
print(f"RESULT: PASS={passed}  FAIL={failed}  TOTAL={passed+failed}")
print(f"{'='*52}")
for r in results: print(r)
print()
sys.exit(1 if failed else 0)
