#!/usr/bin/env python3
"""V40-A: Billing Scope Enforcer — target 12/12"""
import json, sys
from pathlib import Path

WORKSPACE = Path(__file__).resolve().parent.parent.parent
V40      = WORKSPACE / "commands" / "v40_modules"
DATA     = WORKSPACE / "data"

sys.path.insert(0, str(WORKSPACE))
sys.path.insert(0, str(V40))

passed = failed = 0
results = []

def chk(name, ok, note=""):
    global passed, failed
    if ok: passed += 1; results.append(f"  OK  {name}")
    else:  failed += 1; results.append(f"  FAIL {name}  {note}")

def sec(msg):
    results.append(f"\n-- {msg} --")

# ── V26 26-field dcRecord fixture ─────────────────────────────────────────────
IRS_26 = {
    "message_id": "msg001","thread_id":"thr1","account_id":"acct_1",
    "invoice_id":"inv_42","billing_scope":"domestic","policy_version":"v1",
    "amount":100.0,"currency":"USD",
    # 18 unrelated fields that V40-A must NOT touch
    "G4_Country":"US","G5_Currency":"USD","G6_Legal":"US",
    "G7_Tax":"VAT","G8_Sector":"retail","G9_Classifier":"LEGAL",
    "G10_Flag":"","G11_Flag":"","G12_Flag":"","G13_Flag":"","G14_Flag":"",
    "G15_Priority":"3","G16_Region":"NA","G17_Zone":"Z1","G18_Carrier":"DHL",
    "G19_InvNum":"INV-42","G20_DocDate":"2026-01-01","G21_DueDate":"2026-01-31",
    "G22_PaidDate":"","G23_WriteOff":0,"G24_NetDue":100,"G25_Dispute":"",
    "G26_Notes":"",
}

# ── 1. Import ─────────────────────────────────────────────────────────────────
sec("Import")
try:
    from commands.v40_modules.billing_scope_enforcer import (\
        extract_billing_fields, _BILLING_WHITELIST,
        BillingScopeEnforcer, inject_billing_scope, LOG_PATH,
        extract_billing_fields, POLICY_PATH,
    )
    chk("1a_import", True)
except Exception as e:
    chk("1a_import", False, str(e)[:80])

# ── 2. extract_billing_fields returns only 6 whitelisted keys ──────────────────
sec("extract_billing_fields whitelist")
try:
    bf = extract_billing_fields(IRS_26)
    chk("2a_6_keys",     len(bf) == 6,          f"got {len(bf)}")
    expected = {"account_id","invoice_id","billing_scope",
                "policy_version","amount","currency"}
    chk("2b_only_whitelist", set(bf.keys()) == expected)
    chk("2c_account_id_rx", bf["account_id"] == "acct_1")
    chk("2d_billing_scope_rx", bf["billing_scope"] == "domestic")
except Exception as e:
    chk("2x", False, str(e)[:80])

# ── 3. Whitelist keys present in IRS_26 ────────────────────────────────────────
sec("Whitelist confirmation in IRS_26")
try:
    missing = _BILLING_WHITELIST - IRS_26.keys()
    chk("3a_no_missing", len(missing) == 0, f"missing: {missing}")
except Exception as e:
    chk("3x", False, str(e)[:80])

# ── 4. Allowed scope → pass ───────────────────────────────────────────────────
sec("Allowed scope → pass")
try:
    r4 = inject_billing_scope(IRS_26, scope="domestic")
    chk("4a_pass", not r4.get("blocked"), str(r4))
    chk("4b_billing_fields", bool(r4.get("billing_fields")))
except Exception as e:
    chk("4x", False, str(e)[:80])

# ── 5. Disallowed scope → block ────────────────────────────────────────────────
sec("Disallowed scope → block")
try:
    r5 = inject_billing_scope(IRS_26, scope="retail")
    chk("5a_blocked", r5.get("blocked") is True, str(r5))
    chk("5b_reason_present", bool(r5.get("reason")))
except Exception as e:
    chk("5x", False, str(e)[:80])

# ── 6. No dcRecord → pass (no billing fields) ──────────────────────────────────
sec("No dcRecord → pass")
try:
    r6 = inject_billing_scope(None)
    chk("6a_pass", not r6.get("blocked"), str(r6))
except Exception as e:
    chk("6x", False, str(e)[:80])

# ── 7. Empty dict dcRecord → pass ─────────────────────────────────────────────
sec("Empty dcRecord → pass")
try:
    r7 = inject_billing_scope({})
    chk("7a_pass", not r7.get("blocked"), str(r7))
except Exception as e:
    chk("7x", False, str(e)[:80])

# ── 8. BillingScopeEnforcer direct ─────────────────────────────────────────────
sec("BillingScopeEnforcer direct")
try:
    en = BillingScopeEnforcer()
    r8 = en.check(IRS_26, scope="international")
    chk("8a_inst_pass", not r8.get("blocked"))
    chk("8b_account_id", r8["billing_fields"].get("account_id") == "acct_1")
except Exception as e:
    chk("8x", False, str(e)[:80])

# ── 9. Invoice + amount present ────────────────────────────────────────────────
sec("Invoice + amount present in extracted fields")
try:
    bf = extract_billing_fields(IRS_26)
    chk("9a_invoice_id", bf["invoice_id"] == "inv_42")
    chk("9b_amount",     abs(bf["amount"] - 100.0) < 1e-6)
    chk("9c_currency",   bf["currency"] == "USD")
    chk("9d_policy_ver", bf["policy_version"] == "v1")
except Exception as e:
    chk("9x", False, str(e)[:80])

# ── 10. module-level scope/tier/gating still in POLICY ────────────────────────
sec("Policy tier keys present")
try:
    pol = json.loads(POLICY_PATH.read_text())
    k10 = "tier:110k hitl + gating" in pol.get("allowed_scopes", [])
    chk("10a_tier_present", k10)
    k11 = "civil_contracts" in pol.get("allowed_scopes", [])
    chk("10b_civil_contracts", k11)
except Exception as e:
    chk("10x", False, str(e)[:80])

# ── 11. Irrelevant IRS fields (G4..G26) stripped ───────────────────────────────
sec("Irrelevant IRS fields stripped")
try:
    overfull = {**IRS_26}
    bf_overfull = extract_billing_fields(overfull)
    surprise = (set(bf_overfull.keys()) - _BILLING_WHITELIST)
    chk("11a_no_surprise_fields", len(surprise) == 0, f"surprise: {surprise}")
    # G4_Country and G5_Currency must not appear
    chk("11b_no_G4", "G4_Country" not in bf_overfull)
    chk("11c_no_G5", "G5_Currency" not in bf_overfull)
except Exception as e:
    chk("11x", False, str(e)[:80])

# ── 12. LOG_PATH ──────────────────────────────────────────────────────────────
sec("LOG_PATH matches module constant")
try:
    from commands.v40_modules.billing_scope_enforcer import LOG_PATH as mod_lp
    chk("12a_log_path_type", isinstance(mod_lp, Path))
    chk("12b_log_under_data", "billing_scope_enforcer.log" in str(mod_lp))
except Exception as e:
    chk("12x", False, str(e)[:80])

# ── Summary ─────────────────────────────────────────────────────────────────────
print()
print("="*55)
print(f"RESULTS  {passed} passed / {failed} failed  out of {passed+failed}")
print("="*55)
for r in results: print(r)
sys.exit(1 if failed else 0)
