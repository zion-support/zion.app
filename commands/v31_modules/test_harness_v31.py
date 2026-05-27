#!/usr/bin/env python3
"""
V31 Test Harness — 5 new modules, 3 assertions each = 15 checks

Covers: thread_context_bank, cron_schedule, real_llm_verify,
        billing_attachment, persona_routing.
"""
import json, sys, tempfile
from pathlib import Path
from datetime import datetime, timezone, timedelta

WORKSPACE = Path(__file__).resolve().parent.parent.parent
V31       = WORKSPACE / 'commands' / 'v31_modules'
DATA      = WORKSPACE / 'data'

sys.path.insert(0, str(V31))

passed = failed = 0
results = []

def check(name, ok, detail=""):
    global passed, failed
    if ok:
        passed += 1; results.append(f"  OK  {name}" + (f" — {detail}" if detail else ""))
    else:
        failed += 1; results.append(f"FAIL  {name}" + (f" — {detail}" if detail else ""))

def section(t): print(f"\n[{t}]")

print("=" * 60)
print("V31 TEST HARNESS — 5 modules · 15 assertions")
print(f"Workspace : {WORKSPACE}")
print(f"V31 modules: {len(list(V31.glob('*.py')))}")
print("=" * 60)

# 1. thread_context_bank ────────────────────────────────────────────────
section("thread_context_bank — per-thread memory")

try:
    from thread_context_bank import save_thread_context, load_thread_context, touch_thread

    tmp_db = DATA / 'test_thread_context.jsonl'
    tmp_db.write_text("")
    import thread_context_bank as tcb
    tcb._DB = tmp_db

    tid = "thread-001"
    save_thread_context(tid, {"intent": "urgent", "use_cc": "dc@test.com"})
    ctx = load_thread_context(tid)
    check("1a_save_load",         ctx and ctx[0]["intent"] == "urgent")
    check("1a_has_ts",            bool(ctx[0].get("ts")))

    old = load_thread_context(tid, max_age_hours=0)
    check("1b_stale_filtered",     len(old) == 0)

    touch_thread(tid, "vip@test.com")
    ctx2 = load_thread_context(tid)
    check("1c_touch_updates",      ctx2 and ctx2[-1]["participant"] == "vip@test.com")

    tmp_db.unlink()
except Exception as e:
    check("1x", False, str(e)[:80])

# 2. cron_schedule ─────────────────────────────────────────────────────
section("cron_schedule — outcome_learner job definition")

try:
    from cron_schedule import build_outcome_learner_job, validate_cron_schedule

    job = build_outcome_learner_job(
        schedule="0 2 * * *",
        workdir=str(WORKSPACE),
        skills=["outcome_auto_learner"],
    )
    check("2a_has_schedule",  bool(job.get("schedule")))
    check("2a_daily_2am",      job["schedule"] == "0 2 * * *")
    check("2a_output_local",   job.get("deliver") == "local")

    valid = validate_cron_schedule("0 2 * * *")
    check("2b_standard_valid", valid is True)

    invalid = validate_cron_schedule("0 2 * *")
    check("2b_5field_invalid", invalid is False)
except Exception as e:
    check("2x", False, str(e)[:80])

# 3. real_llm_verify ───────────────────────────────────────────────────
section("real_llm_verify — LLM quality gate")

try:
    from real_llm_verify import score_reply_quality, dimension_results, VERIFY_MIN

    good = ("Hi Alice,\n\nGot your message — I'll follow up shortly.\n\n"
            "— Kleber, Zion Tech Group")
    r = score_reply_quality(good, "general", sender_name="Alice")
    check("3a_returns_scores",  bool(r.get("dimensions")))
    check("3a_overall_present", "overall" in r)
    check("3a_pass_threshold",  r.get("passed", False) or r.get("overall", 0) >= 40)
except Exception as e:
    check("3x", False, str(e)[:80])

# 4. billing_attachment ────────────────────────────────────────────────
section("billing_attachment — invoice routing + payment link")

try:
    from billing_attachment import route_invoice_reply, inject_payment_link

    result = route_invoice_reply(
        filename="Invoice_May2026.pdf",
        invoice_id="INV-2026-089",
        amount="$1,200.00",
    )
    check("4a_action_invoice",  result["routing_action"] == "invoice_thank")
    check("4a_has_invoice_id",  result.get("invoice_id") == "INV-2026-089")
    check("4a_has_amount",      result.get("amount") == "$1,200.00")
except Exception as e:
    check("4x", False, str(e)[:80])

# 5. persona_routing ───────────────────────────────────────────────────
section("persona_routing — CC by participant role")

try:
    from persona_routing import assign_cc_by_persona, load_persona_map

    contacts = {
        "alice@dc.com":   {"persona": "executive",   "domain": "dc.com"},
        "bob@legal.com":  {"persona": "legal",       "domain": "legal.com"},
        "carol@esp.com":  {"persona": "delivery",    "domain": "esp.com"},
        "dave@agency.com":{"persona": "agency",      "domain": "agency.com"},
    }
    cc_list = assign_cc_by_persona(
        contacts=contacts,
        thread_participants=["alice@dc.com", "bob@legal.com"],
        intent_label="urgent",
    )
    check("5a_exec_in_urgent",    "alice@dc.com" in cc_list)
    check("5a_legal_in_urgent",   "bob@legal.com" in cc_list)
    check("5a_delivery_excluded", "carol@esp.com" not in cc_list)
except Exception as e:
    check("5x", False, str(e)[:80])

# ── Summary ────────────────────────────────────────────────────────────
print()
print("=" * 60)
print(f"RESULTS  {passed} passed / {failed} failed  out of {passed+failed}")
print("=" * 60)
for line in results:
    print(line)
sys.exit(1 if failed else 0)
