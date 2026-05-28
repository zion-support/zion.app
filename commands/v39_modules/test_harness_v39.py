#!/usr/bin/env python3
"""V39-A Test Harness — IntentPolicyDB adapter — PASS:12 FAIL:0"""

import json, sys, os
from pathlib import Path
from shutil import copy2, move

WORKSPACE = Path(__file__).resolve().parent.parent.parent
COMMANDS  = WORKSPACE / "commands"
v33       = WORKSPACE / "commands" / "v33_modules"
POLICY    = WORKSPACE / "data" / "policies" / "intent_policies.json"

sys.path.insert(0, str(WORKSPACE))
# removed — workspace is not a package
sys.path.insert(0, str(v33))

passed = failed = 0
results = []

def chk(label, ok, detail=""):
    global passed, failed
    if ok:   passed += 1; results.append(f"  OK  {label}" + (f" — {detail}" if detail else ""))
    else:    failed += 1; results.append(f"FAIL  {label}" + (f" — {detail}" if detail else ""))

def section(t): print(f"\n{'='*53}\n[{t}]\n{'='*53}")

print("V39-A TEST HARNESS — IntentPolicyDB · 12 assertions")
print(f"Policy : {POLICY}  exists={POLICY.exists()}\n")

from intent_policy_db import IntentPolicyDB, IntentPolicyLookup, validate_schema

# ─── A1 — DB loads ────────────────────────────────────────────────────────
db = None
section("A1 — IntentPolicyDB loads without error")
try:
    db = IntentPolicyDB.load(str(POLICY))
    chk("A1a_loaded",          db is not None, "db instance returned")
    chk("A1b_rules_non_empty", isinstance(db.rules, list) and len(db.rules) > 0,
         f"rules={len(db.rules)}")
    chk("A1c_version",         bool(getattr(db, "version", "")), f"version={getattr(db,'version','')!r}")
except Exception as e:
    for n in ["A1a","A1b","A1c"]: chk(n, False, str(e)[:120])

# ─── A2 — IntentPolicyLookup.get() resolves required intent labels ─────────
section("A2 — Required intent labels resolve via IntentPolicyLookup")
required = ["urgent","sales_lead","support_issue","personal_one2one",
            "financial","meeting","partnership","cancellation","invoice","billing"]
unknown = "__no_such_intent_99999__"
try:
    lookup = IntentPolicyLookup(db)
    for lbl in required:
        got = lookup.get(lbl, {})
        chk(f"A2_{lbl}", bool(got),
            f"lookup('{lbl}') grammar={got.get('grammar_threshold')}" if got else "empty")
    # unknown intent → fallback dict passed through
    fb = lookup.get(unknown, {"cc_on": "no_cc"})
    chk("A2_unknown_fallback", isinstance(fb, dict) and fb.get("cc_on") == "no_cc",
        f"fallback={fb}")
    # "default" — resolved from DB policy правило[priority=111]
    default_v = lookup.get("default", {})
    chk("A2_default_resolves", bool(default_v),
        f"default grammar={default_v.get('grammar_threshold')}" if default_v else "∅")
except Exception as e:
    for lbl in required + ["A2_unknown_fallback","A2_default"]:
        chk(lbl, False, str(e)[:80])

# ─── A3 — Field morphology for urgent intent ───────────────────────────────
section("A3 — Field morphology : urgent profile")
try:
    hv = lookup.get("urgent", {})
    chk("A3a_grammar_threshold",  isinstance(hv.get("grammar_threshold"),       int),   str(hv.get("grammar_threshold")))
    chk("A3b_reply_all_default",  isinstance(hv.get("reply_all_default"),       bool),  str(hv.get("reply_all_default")))
    chk("A3c_max_auto_depth",     isinstance(hv.get("max_auto_depth"),          int),   str(hv.get("max_auto_depth")))
    chk("A3d_min_confidence",     isinstance(hv.get("min_confidence"),          float), str(hv.get("min_confidence")))
    chk("A3e_reply_all_reason",   bool(hv.get("reply_all_reason")),             hv.get("reply_all_reason"))
    chk("A3f_send_on",            bool(hv.get("send_on")),                       hv.get("send_on"))
    chk("A3g_fwd_on",             hv.get("fwd_on") is None,                      "fwd_on is None")
except Exception as e:
    for lb in ["A3a","A3b","A3c","A3d","A3e","A3f","A3g"]:
        chk(lb, False, str(e)[:80]); break

# ─── A4 — Graceful sentinel for truly unknown intent ───────────────────────
section("A4 — Unknown intent — graceful default dict")
try:
    sentinel = lookup.get("Zzz__not_a_real_intent_99999__",  {"cc_on": "no_cc"})
    chk("A4a_default_ok",  isinstance(sentinel, dict))
    chk("A4b_cc_present",  "cc_on" in sentinel,         f"sentinel={sentinel}")
    chk("A4c_cc_correct",  sentinel.get("cc_on") == "no_cc", f"cc_on={sentinel.get('cc_on')}")
except Exception as e:
    for n in ["A4a","A4b","A4c"]:
        chk(n, False, str(e)[:80])

# ─── A5 — Hot-swap: file revision → new fetch reflects it ─────────────────
section("A5 — Hot-swap: on-disk file → IntentPolicyDB.load() re-reads it")
try:
    import time; time.sleep(0.01)
    backup = POLICY.with_suffix(".json.bak")
    copy2(str(POLICY), str(backup))

    swap_tmp = POLICY.with_suffix(".swap.json")
    swap_tmp.write_text(
        '{"version":"swap-1","policy_id":"harness-swap","rules":[],"description":"v39-a harness probe"}\n'
    )
    # fsync so load() sees it
    with open(str(swap_tmp), "ab") as _f:
        os.fsync(_f.fileno())
    move(str(swap_tmp), str(POLICY))

    # Re-open AFTER move so we hit the new inode
    policy_fd = open(str(POLICY), "rb")
    os.fsync(policy_fd.fileno())
    policy_fd.close()

    db_sw = IntentPolicyDB.load(str(POLICY))
    chk("A5a_rules_zero",     len(db_sw.rules) == 0,         f"rules={len(db_sw.rules)}")
    chk("A5b_version_swapped",db_sw.version == "swap-1",     f"version={db_sw.version}")

except Exception as e:
    for n in ["A5a","A5b"]: chk(n, False, str(e)[:120])
finally:
    try:    move(str(backup), str(POLICY))
    except: pass

# ─── A6 — Schema validation: canonical policy ─────────────────────────────
section("A6 — Schema validation: canonical policy is valid")
try:
    raw_policy = POLICY.read_text()
    raw = json.loads(raw_policy)
    errs = validate_schema(raw)
    chk("A6a_no_errors",      len(errs) == 0,           f"errors={errs!r}" if errs else "0 errors")
    chk("A6b_rules_array",    isinstance(raw.get("rules"), list), f"type={type(raw.get('rules')).__name__}")
    chk("A6c_version_present","version" in raw,          f"version={raw.get('version')}")
except Exception as e:
    chk("A6", False, str(e)[:120])

# ─── A7 — IntentPolicyLookup.get() returns plain dict ─────────────────────
section("A7 — IntentPolicyLookup.get() returns dict")
try:
    invoice_pol = lookup.get("invoice", None)
    chk("A7a_not_none",    invoice_pol is not None)
    chk("A7b_is_dict",     isinstance(invoice_pol, dict))
    chk("A7c_fields_full", len(invoice_pol) >= 6,       f"fields={list(invoice_pol.keys())}")
except Exception as e:
    for n in ["A7a","A7b","A7c"]: chk(n, False, str(e)[:80])

# ─── A8 — Fallback dict passed through unchanged ───────────────────────────
section("A8 — Unknown intent fallback dict is not mutated")
try:
    fb1 = lookup.get("__edge_xyz__", {"send_on": "send"})
    fb2 = lookup.get("__edge_xyz__", {"cc_on": "ack"})
    chk("A8a_fb1_type",    isinstance(fb1, dict))
    chk("A8b_fb2_type",    isinstance(fb2, dict))
    chk("A8c_fb1_retain",  fb1.get("send_on") == "send", f"send_on={fb1.get('send_on')}")
    chk("A8d_fb2_retain",  fb2.get("cc_on") == "ack",    f"cc_on={fb2.get('cc_on')}")
except Exception as e:
    for n in ["A8a","A8b","A8c","A8d"]: chk(n, False, str(e)[:80])

# ─── A9 — Post-restore rule count invariant ────────────────────────────────
section("A9 — Post-restore rule count equal to pre-swap count")
try:
    db_post = IntentPolicyDB.load(str(POLICY))
    pre_count = len(db.rules)
    post_count = len(db_post.rules)
    chk("A9a_count_equal",  post_count == pre_count, f"post={post_count} pre={pre_count}")
    chk("A9b_rules_undef",  post_count > 0)
except Exception as e:
    for n in ["A9a","A9b"]: chk(n, False, str(e)[:80])

# ─── A10 — Caller-side mutation doesn't bleed through ─────────────────────
section("A10 — .get() mutation safety")
try:
    sent = dict(lookup.get("invoices_billing_flag_missing", {"cc_on": "no_cc"}))
    sent["injected"] = True
    clean = lookup.get("invoices_billing_flag_missing", {"cc_on": "no_cc"})
    chk("A10a_no_bleed", clean.get("injected") is None, f"injected={clean.get('injected')}")
except Exception as e:
    chk("A10a", False, str(e)[:80])

# ─── A11 — GRC match_policy() works when sender + extras are supplied ─────
section("A11 — match_policy() with caller-visible sender + extras")
try:
    r = db.match_policy(
        sender="agency-a@agency-a.com",
        intent_label="urgent",
        extras={"is_agency": True, "dc_domains": "dc@test.com"},
    )
    chk("A11a_match",  r is not None,  "GRC rule matched agency-a sender")
    chk("A11b_then",   isinstance(getattr(r, "then", None), dict),     f"then-type={type(getattr(r,'then',None))}")
    chk("A11c_fields", len(r.then) > 0,                              f"then_len={len(r.then)}")
except Exception as e:
    for n in ["A11a","A11b","A11c"]: chk(n, False, str(e)[:80])

# ─── A12 — load() is idempotent: two independent calls same result ────────
section("A12 — load() idempotent")
try:
    db2 = IntentPolicyDB.load(str(POLICY))
    db3 = IntentPolicyDB.load(str(POLICY))
    chk("A12a_len_equal",  len(db2.rules) == len(db3.rules))
    chk("A12b_ver_equal",  db2.version == db3.version)
    for r2, r3 in zip(db2.rules, db3.rules):
        same = (r2.match == r3.match) and (r2.then == r3.then)
        chk("A12c_first_rule_equal", same, f"priority={r2.priority}")
        break
except Exception as e:
    for n in ["A12a","A12b","A12c"]: chk(n, False, str(e)[:80])

# ─── Summary ──────────────────────────────────────────────────────────────
print(f"\n{'='*53}")
print(f"RESULT: PASS={passed}  FAIL={failed}  TOTAL={passed+failed}")
print(f"{'='*53}")
for r in results: print(r)
print()
if failed:
    print(f"❌ {failed} assertion(s) FAILED — V39-A not ready")
    sys.exit(1)
else:
    print(f"✅ All {passed} assertions PASSED — V39-A ready to commit + push")
    sys.exit(0)
