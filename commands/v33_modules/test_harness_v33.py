#!/usr/bin/env python3
"""
V33 Test Harness — IntentPolicyDB — 12 assertions
"""
import json, sys
from pathlib import Path

WORKSPACE = Path(__file__).resolve().parent.parent.parent
V33 = WORKSPACE / "commands" / "v33_modules"
DATA = WORKSPACE / "data"
POLICY = DATA / "policies" / "intent_policies.json"
sys.path.insert(0, str(V33))

passed = failed = 0; results = []

def check(name, ok, detail=""):
    global passed, failed
    if ok:
        passed += 1; results.append(f"  OK  {name}" + (f" — {detail}" if detail else ""))
    else:
        failed += 1; results.append(f"FAIL  {name}" + (f" — {detail}" if detail else ""))

def section(t): print(f"\n[{t}]")

print("=" * 55)
print("V33 TEST HARNESS — IntentPolicyDB · 12 assertions")
print(f"Policy file: {POLICY}")
print("=" * 55)

# ── 1. Load + validate ────────────────────────────────────────────────
section("IntentPolicyDB — load + validate")
try:
    from intent_policy_db import IntentPolicyDB

    db = IntentPolicyDB.load(str(POLICY))
    check("1a_loaded", len(db.rules) == 5, f"rules={len(db.rules)}")
    check("1b_version", db.version == "1.0", f"version={db.version}")
except Exception as e:
    check("1x", False, str(e)[:80])

# ── 2. Schema validation ───────────────────────────────────────────────
section("Schema validator")
try:
    bad = {"rules": [{"match": {}, "then": {}, "priority": 1},
                     {"match": {}, "then": {}, "priority": 1}]}
    errs = IntentPolicyDB.validate_schema(bad)
    check("2a_dup_priority", any("duplicate priority" in e for e in errs))

    good = json.loads(POLICY.read_text())
    errs2 = IntentPolicyDB.validate_schema(good)
    check("2b_valid_policy", len(errs2) == 0)
except Exception as e:
    check("2x", False, str(e)[:80])

# ── 3. Priority-1 agency rule ──────────────────────────────────────────
section("Priority-1 agency rule")
try:
    m = db.match_policy("user@agency-a.com", "support", "high",
                        extras={"is_agency": True})
    check("3a_fires", m is not None)
    check("3b_route_agency", m and m.then.get("route_to") == "agency")
    check("3c_cc_includes_dc", "dc@test.com" in (m.then.get("use_cc", []) if m else []))
except Exception as e:
    check("3x", False, str(e)[:80])

# ── 4. Non-commissionable filter ───────────────────────────────────────
section("Non-commissionable filter")
try:
    m_false = db.match_policy("ext@any.com", "sales_lead", "medium",
                              extras={"non_commissionable": False})
    check("4a_nc_false", m_false and m_false.then.get("route_to") == "subjectivity")

    m_true = db.match_policy("ext@any.com", "sales_lead", "medium",
                             extras={"non_commissionable": True})
    check("4b_nc_true", m_true and m_true.then.get("route_to") == "default")

    m_none = db.match_policy("ext@any.com", "sales_lead", "medium")
    check("4c_nc_none_no_match", m_none is None or m_none.then.get("route_to") != "subjectivity")
except Exception as e:
    check("4x", False, str(e)[:80])

# ── 5. DC domain rule (priority-3) ────────────────────────────────────
section("DC domain rule")
try:
    m_dc = db.match_policy("user@dc-dedicated-ip.com", "urgent", "urgent",
                           extras={"dc_domains": ["dc-dedicated-ip.com"]})
    check("5a_dc_route", m_dc and m_dc.then.get("route_to") == "dc")
    check("5b_dc_cc", "dc@test.com" in (m_dc.then.get("use_cc", []) if m_dc else []))
    check("5c_dc_priority", m_dc and m_dc.rule.priority == 4)

    m_no_dc = db.match_policy("user@external.com", "normal", "low",
                              extras={"dc_domains": ["dc-dedicated-ip.com"]})
    check("5d_non_dc_rejected", m_no_dc is None)
except Exception as e:
    check("5x", False, str(e)[:80])

# ── Summary ────────────────────────────────────────────────────────────
print()
print("=" * 55)
print(f"RESULTS  {passed} passed / {failed} failed  out of {passed+failed}")
print("=" * 55)
for line in results:
    print(line)
sys.exit(1 if failed else 0)
