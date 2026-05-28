#!/usr/bin/env python3
"""
V34-C Test Harness — Account Tag Isolation — 12 assertions
"""
import sys
from pathlib import Path

WORKSPACE = Path(__file__).resolve().parent.parent.parent
V34 = WORKSPACE / "commands" / "v34_modules"
sys.path.insert(0, str(V34))

from account_tag_isolation import tag_email, batch_tag, filter_by_tag

passed = failed = 0
results = []

def check(name, ok, detail=""):
    global passed, failed
    if ok:
        passed += 1
        results.append(f"  OK  {name}" + (f" — {detail}" if detail else ""))
    else:
        failed += 1
        results.append(f"FAIL  {name}" + (f" — {detail}" if detail else ""))

def section(t):
    print(f"\n[{t}]")

print("=" * 55)
print("V34-C TEST HARNESS — Account Tag Isolation · 12 assertions")
print("=" * 55)

# ── 1. tag_email basics ────────────────────────────────────────────────
section("tag_email — basic tagging")
try:
    r = tag_email("msg-001", "a@gmail.com", {"dc_only": True})
    check("1a_dc_only", r["tags"] == ["dc-only"], r["tags"])

    r2 = tag_email("msg-002", "b@gmail.com",
                   {"agency_cco": True, "esp_verified": True})
    check("1b_multi", sorted(r2["tags"]) == ["agency-cco", "esp-verified"], r2["tags"])

    r3 = tag_email("msg-003", "c@gmail.com")
    check("1c_empty", r3["tags"] == [], r3["tags"])
except Exception as e:
    check("1x", False, str(e)[:80])

# ── 2. extras / force_tags ──────────────────────────────────────────────
section("extras — force_tags")
try:
    r4 = tag_email("msg-004", "a@gmail.com", {"dc_only": True},
                   extras={"force_tags": ["production"]})
    check("2a_force_tag", sorted(r4["tags"]) == ["dc-only", "production"], r4["tags"])

    r5 = tag_email("msg-005", "b@gmail.com", {},
                   extras={"force_tags": ["x", "y"]})
    check("2b_only_force", sorted(r5["tags"]) == ["x", "y"], r5["tags"])

    r5b = tag_email("msg-005b", "b@gmail.com", {},
                    extras={"force_tags": ["x", "x"]})
    check("2c_dupe_dedup", r5b["tags"] == ["x"], r5b["tags"])
except Exception as e:
    check("2x", False, str(e)[:80])

# ── 3. batch_tag ────────────────────────────────────────────────────────
section("batch_tag — batch isolation")
try:
    emails = [
        {"email_id": "e1", "gmail_source": "a@gmail.com", "account_meta": {"dc_only": True}},
        {"email_id": "e2", "gmail_source": "b@gmail.com", "account_meta": {"agency_cco": True}},
        {"email_id": "e3", "gmail_source": "c@gmail.com", "account_meta": {}},
    ]
    tagged = batch_tag(emails)
    check("3a_length", len(tagged) == 3)
    check("3b_e1_dc_only", tagged[0]["tags"] == ["dc-only"])
    check("3c_e2_agency", tagged[1]["tags"] == ["agency-cco"])
    check("3d_e3_empty", tagged[2]["tags"] == [])
except Exception as e:
    check("3x", False, str(e)[:80])

# ── 4. filter_by_tag ───────────────────────────────────────────────────
section("filter_by_tag — per-account routing")
try:
    tagged = [
        {"email_id": "e1", "tags": ["dc-only"]},
        {"email_id": "e2", "tags": ["agency-cco"]},
        {"email_id": "e3", "tags": ["dc-only"]},
    ]
    dc_only = filter_by_tag(tagged, "dc-only")
    check("4a_dc_count", len(dc_only) == 2, str(len(dc_only)))
    check("4b_ids_match", {t["email_id"] for t in dc_only} == {"e1", "e3"})

    none = filter_by_tag(tagged, "esp-verified")
    check("4c_none", len(none) == 0)
except Exception as e:
    check("4x", False, str(e)[:80])

# ── 5. ID + gmail_source passthrough ────────────────────────────────────
section("identity passthrough")
try:
    r6 = tag_email("msg-123", "multi@ziontechgroup.com",
                   {"dc_only": True, "Production": True})
    check("5a_email_id", r6["email_id"] == "msg-123")
    check("5b_source", r6["gmail_source"] == "multi@ziontechgroup.com")
    check("5c_tags_present", len(r6["tags"]) >= 1)
except Exception as e:
    check("5x", False, str(e)[:80])

# ── 6. Combined GRC tags ────────────────────────────────────────────────
section("GRC tag combinations")
try:
    r7 = tag_email("msg-007", "g@gov.agency.gov",
                   {"dc_only": True, "agency_cco": True, "esp_verified": True})
    check("6a_grcc_combo", sorted(r7["tags"]) == ["agency-cco", "dc-only", "esp-verified"],
          r7["tags"])

    r8 = tag_email("msg-008", "c@corp.com",
                   {}, extras={"force_tags": ["imaging"]})
    check("6b_force_imaging", r8["tags"] == ["imaging"], r8["tags"])

    hp = tag_email("msg-009", "h@healthcare.hipaa.org",
                   {"dc_only": True, "agency_cco": True})
    check("6c_detail_trio", "dc-only" in hp["tags"] and "agency-cco" in hp["tags"],
          hp["tags"])
except Exception as e:
    check("6x", False, str(e)[:80])

# ── Summary ────────────────────────────────────────────────────────────
print()
print("=" * 55)
print(f"RESULTS  {passed} passed / {failed} failed  out of {passed+failed}")
print("=" * 55)
for line in results:
    print(line)
sys.exit(1 if failed else 0)
