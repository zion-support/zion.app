#!/usr/bin/env python3
"""V38-B Test Harness — ACGroup + DC Schema Lock — 12 assertions"""
import json, sys
from pathlib import Path

WORKSPACE = Path(__file__).resolve().parent.parent.parent
V38 = WORKSPACE / "commands" / "v38_modules"
sys.path.insert(0, str(V38))

DATA = WORKSPACE / "data"
LOG = DATA / "logs" / "acgroup_dc_schema_lock.log"

passed = failed = 0; results = []

def check(name, ok, detail=""):
    global passed, failed
    if ok:
        passed += 1; results.append(f"  OK  {name}" + (f" — {detail}" if detail else ""))
    else:
        failed += 1; results.append(f"FAIL  {name}" + (f" — {detail}" if detail else ""))

def section(t): print(f"\n[{t}]")

print("=" * 55)
print("V38-B TEST HARNESS — ACGroup + DC Schema Lock · 12 assertions")
print("=" * 55)

section("ACGroup happy-path")
try:
    from acgroup_dc_schema_lock import ACGroupDCSchemaLock, validate_entity
    lock = ACGroupDCSchemaLock()
    ok, result = lock.validate_acgroup({"ac_group_id": "ac-001", "country": "US"})
    check("1a_acgroup_ok", ok)
    check("1b_defaults_injected", ok and result.get("priority") == 0)
    check("1c_keys_kept", ok and "ac_group_id" in result and "country" in result)
except Exception as e:
    check("1x", False, str(e)[:80])

section("ACGroup missing keys")
try:
    ok2, result2 = lock.validate_acgroup({"ac_group_id": "ac-002"})
    check("2a_missing_country_rejected", not ok2)
    check("2b_event_returned", not ok2 and hasattr(result2, "missing_keys"))
    check("2c_missing_country", not ok2 and "country" in result2.missing_keys)
except Exception as e:
    check("2x", False, str(e)[:80])

section("DC happy-path")
try:
    ok3, result3 = lock.validate_dc({"dc_id": "dc-001", "country": "EU", "enabled": True})
    check("3a_dc_ok", ok3)
    check("3b_dc_defaults", ok3 and result3.get("esp_verified") == False)
    check("3c_dc_keys", ok3 and "ip_ranges" in result3)
except Exception as e:
    check("3x", False, str(e)[:80])

section("DC missing key")
try:
    ok4, result4 = lock.validate_dc({"dc_id": "dc-002", "country": "UK"})
    check("4a_missing_enabled_rejected", not ok4)
    check("4b_missing_enabled_in_event", not ok4 and "enabled" in result4.missing_keys)
except Exception as e:
    check("4x", False, str(e)[:80])

section("DC unexpected key")
try:
    ok5, result5 = lock.validate_dc({"dc_id": "dc-003", "country": "JP", "enabled": True, "evil_key": "x"})
    check("5a_unexpected_rejected", not ok5)
    check("5b_unexpected_in_event", not ok5 and "evil_key" in result5.unexpected_keys)
except Exception as e:
    check("5x", False, str(e)[:80])

section("Bad entity type")
try:
    ok6, result6 = validate_entity({}, "alien")
    check("6a_type_rejected", not ok6)
    check("6b_event_type_unknown", not ok6 and result6.typ == "unknown")
except Exception as e:
    check("6x", False, str(e)[:80])

section("validate_entity standalone")
try:
    ok7, result7 = validate_entity({"ac_group_id": "ac-010", "country": "BR", "account_tag": "tier-1"}, "acgroup")
    check("7a_entity_ok", ok7)
    check("7b_entity_dict", ok7 and isinstance(result7, dict))
    check("7c_extra_preserved", ok7 and result7.get("account_tag") == "tier-1")
except Exception as e:
    check("7x", False, str(e)[:80])

section("Log file")
try:
    ok8, _ = lock.validate_acgroup({"ac_group_id": "ac-log", "country": "CA"})
    check("8a_log_created", ok8 and LOG.exists())
    log_line = LOG.read_text().strip().splitlines()[-1]
    log_entry = json.loads(log_line)
    check("8b_log_gate", log_entry.get("gate") == "acgroup_dc_schema_lock")
    check("8c_log_action", log_entry.get("action") in ("validated", "rejected"))
except Exception as e:
    check("8x", False, str(e)[:80])

print()
print("=" * 55)
print(f"RESULTS  {passed} passed / {failed} failed  out of {passed+failed}")
print("=" * 55)
for line in results:
    print(line)
sys.exit(1 if failed else 0)
