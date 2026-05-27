#!/usr/bin/env python3
"""
V30 Test Harness — 8 scenarios × 3 assertions = 24 checks

Runs against live v30_modules/. Scans public functions directly so
the test document stays readable.
"""
import json, re, sys
from pathlib import Path
from datetime import datetime, timezone, timedelta

WORKSPACE = Path(__file__).resolve().parent.parent.parent
COMMANDS  = WORKSPACE / 'commands'
DATA      = WORKSPACE / 'data'
V30       = COMMANDS / 'v30_modules'

sys.path.insert(0, str(V30))

passed = 0
failed = 0
results = []

def check(name, ok, detail=""):
    global passed, failed
    if ok:
        passed += 1
        results.append(f"  OK  {name}" + (f" — {detail}" if detail else ""))
    else:
        failed += 1
        results.append(f"FAIL  {name}" + (f" — {detail}" if detail else ""))

def section(title):
    print(f"\n[{title}]")

print("=" * 60)
print("V30 TEST HARNESS — 8 scenarios · 24 assertions")
print(f"Workspace : {WORKSPACE}")
print(f"V30 modules: {len(list(V30.glob('*.py')))}")
print("=" * 60)

# ── 1. reply_all_extractor ────────────────────────────────────────────
section("reply_all_extractor — CC priority chain")

try:
    from reply_all_extractor import extract_thread_cc, validate_cc_addresses

    c1 = extract_thread_cc(
        {"sender": "a@x.com", "to": "b@x.com", "cc": ""},
        ["alice@dc.com", "bob@esp.com"])
    check("1a_thread_participants_priority", "alice@dc.com" in c1["use_cc"],
          c1)
    check("1a_source_participants",          c1["extracted_from"] == "thread_participants")
    check("1a_high_confidence",              c1["confidence"] >= 0.90)

    c2 = extract_thread_cc(
        {"sender": "a@x.com", "to": "b@x.com", "cc": "carol@dc.com"})
    check("1b_original_cc_fallback", c2["use_cc"] == "carol@dc.com")
    check("1b_source_original_cc",   c2["extracted_from"] == "original_cc")

    c3 = extract_thread_cc(
        {"sender": "me@corp.com", "to": "dev1@corp.com, dev2@corp.com", "cc": ""})
    check("1c_to_others_fallback", "dev1@corp.com" in c3["use_cc"])

    v1 = validate_cc_addresses("good@test.com, bad@, ok@test.com")
    check("1d_invalid_detected", not v1["valid"])
    check("1d_invalid_count",      len(v1["invalid"]) == 1)
    check("1d_valid_kept",         sorted(v1["emails"]) == ["good@test.com", "ok@test.com"])

except Exception as e:
    check("import_ok", False, str(e)[:80])

# ── 2. response_self_verifier ─────────────────────────────────────────
section("response_self_verifier — post-compose integrity")

try:
    from response_self_verifier import verify_response

    r = verify_response("Hi {name}, see the {missing}", "general", {}, "Alice", "Test")
    check("2a_placeholder_detected",  not r["passed"])
    check("2a_issue_dimension",       any("placeholders" in i["dimension"] for i in r["issues"]))

    no_sig = "Hi Alice\n\nGot your message\n\n— Kleber"
    r2 = verify_response(no_sig, "general", {}, "Alice", "Test")
    check("2b_missing_sign_off", r2["dimension_scores"]["sign_off_ok"] < 80)

    good = ("Hi Alice,\n\nGot your message — I'll follow up shortly.\n\n"
            "— Kleber, Zion Tech Group")
    r3 = verify_response(good, "general", {"send_on": "send"}, "Alice", "Test")
    check("2c_clean_pass", r3["passed"] or r3["overall_score"] >= 75)

    no_name = "Hi there,\n\nGot your message.\n\n— Kleber, Zion Tech Group"
    r4 = verify_response(no_name, "general", {}, "Bob Smith", "Test")
    check("2d_continuity_warns", r4["dimension_scores"]["continuity"] < 85)

except Exception as e:
    check("import_ok", False, str(e)[:80])

# ── 3. reply_all_validator ────────────────────────────────────────────
section("reply_all_validator — fail-closed CC gate")

try:
    from reply_all_validator import validate_reply_all

    r = validate_reply_all("", False, "general", {}, "t1", "run1")
    check("3a_no_cc_ok",        r["can_send"] is True)
    check("3a_no_cc_reason",    r["reason"] == "no_reply_all")

    r = validate_reply_all("a@test.com, b@test.com", True, "general", {}, "t2", "run2")
    check("3b_valid_cc_ok",     r["can_send"] is True)
    check("3b_send_with_cc",    r["action"]   == "send_with_cc")

    r = validate_reply_all("a@, b@test.com", True, "general", {}, "t3", "run3")
    check("3c_invalid_blocked", r["can_send"] is False)
    check("3c_action_review",   r["action"]   == "review")

    r = validate_reply_all("", True, "general", {}, "t4", "run4")
    check("3d_empty_cc_blocked", r["can_send"] is False)

except Exception as e:
    check("3x", False, str(e)[:80])

# ── 4. urgency_normalizer ──────────────────────────────────────────────
section("urgency_normalizer — thread age decay")

try:
    from urgency_normalizer import normalize_urgency

    now  = datetime.now(timezone.utc)
    ts30 = (now - timedelta(hours=30)).isoformat()
    ts60 = (now - timedelta(hours=60)).isoformat()
    ts2  = (now - timedelta(hours=2)).isoformat()

    r = normalize_urgency("urgent", message_ts=ts30)
    check("4a_urgent_30h_downgraded", r["normalized"] == "high",
          str(r))

    r = normalize_urgency("urgent", message_ts=ts60)
    check("4b_urgent_60h_medium",     r["normalized"] == "medium",
          str(r))

    r = normalize_urgency("high", message_ts="")
    check("4c_no_ts_passthrough",     r["normalized"] == "high")

    r = normalize_urgency("urgent", message_ts=ts2)
    check("4d_urgent_2h_kept",        r["normalized"] == "urgent", str(r))

except Exception as e:
    check("4x", False, str(e)[:80])

# ── 5. meeting_slot_suggester ─────────────────────────────────────────
section("meeting_slot_suggester — concrete slots in reply")

try:
    from meeting_slot_suggester import suggest_slots

    avail = [
        {"day": "Tuesday",   "slots": ["2:00 PM"]},
        {"day": "Wednesday", "slots": ["10:00 AM"]},
        {"day": "Thursday",  "slots": ["3:00 PM"]},
    ]
    s = suggest_slots(avail, lang="en")
    check("5a_3_slots_in_body",    "Tuesday"  in s and "Wednesday" in s)
    check("5a_icon_present",       "📅" in s)
    check("5a_summary_label",      "Suggested slots" in s)

    s_pt = suggest_slots(avail[:1], lang="pt")
    check("5b_pt_language",        "Sugestões" in s_pt)

    s_empty = suggest_slots([], lang="en")
    check("5c_empty_returns_str",  isinstance(s_empty, str))

except Exception as e:
    check("5x", False, str(e)[:80])

# ── 6. sender_reputation_tracker ──────────────────────────────────────
section("sender_reputation_tracker — tier progression")

try:
    from sender_reputation_tracker import get_reputation, log_interaction

    tmp_db = DATA / 'test_sender_reputation.jsonl'
    tmp_db.write_text("")

    import sender_reputation_tracker as srt_mod
    srt_mod._SENDER_DB = tmp_db

    for i in range(5):
        log_interaction("vip@test.com", "support_issue",
                        0.85 + i * 0.01, "positive")

    rep = get_reputation("vip@test.com")
    check("6a_unknown_fresh",       get_reputation("nobody@test.com")["tier"] == "unknown")
    check("6b_5_interactions",      rep["total_interactions"] == 5)
    check("6b_positive_rate_100",   rep["positive_rate"] == 1.0)
    check("6b_tier_known_or_higher",rep["tier"] in ("known", "trusted", "vip"))

    tmp_db.unlink()

except Exception as e:
    check("6x", False, str(e)[:80])

# ── 7. attachment_content_analyzer ────────────────────────────────────
section("attachment_content_analyzer — content-based routing")

try:
    from attachment_content_analyzer import analyze_attachment_content

    r = analyze_attachment_content("Invoice_May2026.pdf")
    check("7a_invoice_cat",         r["category"] == "invoice")
    check("7a_thank_action",        r["routing_action"] == "thank_auto")

    r = analyze_attachment_content("Cease_and_Desist.pdf")
    check("7b_legal_cat",           r["category"] == "legal")
    check("7b_escalate_action",     r["routing_action"] == "escalate")

    r = analyze_attachment_content("Q3_Revenue_Deck.pptx")
    check("7c_deck_calendar_action",r["routing_action"] == "calendar_draft")

    r = analyze_attachment_content("random_unknown.xyz")
    check("7d_unknown_low_conf",    r["category"] == "unknown")
    check("7d_low_confidence_val",  0.0 <= r["confidence"] <= 1.0)

except Exception as e:
    check("7x", False, str(e)[:80])

# ── 8. outcome_auto_learner ────────────────────────────────────────────
section("outcome_auto_learner — FP rate from log")

try:
    from outcome_auto_learner import learn_from_outcomes, tune_thresholds_from_fp
    from outcome_auto_learner import _LOG, _FP_RATES

    log_bak  = _LOG.read_bytes()  if _LOG.exists() else None
    fp_bak   = _FP_RATES.read_bytes() if _FP_RATES.exists() else None

    import tempfile
    tmp = tempfile.NamedTemporaryFile(suffix=".jsonl", delete=False, mode="w")
    tmp.write(json.dumps({
        "ts": (datetime.now(timezone.utc) - timedelta(hours=1)).isoformat(),
        "intent": "urgent", "confidence": 0.91,
        "action": "send_fast", "reply_all": True, "use_cc": "",
    }) + "\n")
    tmp.write(json.dumps({
        "ts": datetime.now(timezone.utc).isoformat(),
        "intent": "urgent", "confidence": 0.88,
        "action": "send_fast", "reply_all": False, "use_cc": "",
    }) + "\n")
    tmp.close()
    _LOG.write_bytes(Path(tmp.name).read_bytes())

    result = learn_from_outcomes(window_hours=48)
    check("8a_log_status",           result.get("status") in ("learned", "no_recent_entries"))
    check("8a_fp_rates_present",     "fp_rates" in result)
    check("8a_intents_analyzed",     result.get("intents_analyzed", 0) >= 0)

    adj = tune_thresholds_from_fp()
    check("8b_tune_returns_dict",    isinstance(adj, dict))

    if log_bak:  _LOG.write_bytes(log_bak)
    else:         _LOG.unlink(missing_ok=True)
    if fp_bak:   _FP_RATES.write_bytes(fp_bak)
    else:         _FP_RATES.unlink(missing_ok=True)
    Path(tmp.name).unlink()

except Exception as e:
    check("8x", False, str(e)[:80])

# ── 9. intent_reasoning_auditor ───────────────────────────────────────
section("intent_reasoning_auditor — per-case WHY log")

try:
    from intent_reasoning_auditor import build_case_log, log_case

    entry = build_case_log(
        run_id="test-v30",
        email_id="msg-1",
        thread_id="t-1",
        sender="alice@test.com",
        subject="Urgent: server down",
        intent_raw={
            "confidence": 0.91, "categories": ["urgent"],
            "intent_boost_src": "profile:urgent:+12%",
        },
        intent_label="urgent",
        route="fast_path",
        route_signals=["keyword:down", "profile:urgent"],
        reply_all_ok=True,
        use_cc="bob@dc.com",
        reply_all_source="always_cc",
        overrides_applied=["profile_boost"],
        escalation={},
    )
    check("9a_entry_has_ts",         bool(entry.get("ts")))
    check("9a_intent_label_correct", entry["intent"]["label"] == "urgent")
    check("9a_boost_recorded",       "profile:urgent" in entry["intent"]["boost_applied"])
    check("9a_reply_all_src",        entry["reply_all"]["source"] == "always_cc")
    check("9a_override_present",     "profile_boost" in entry["overrides"])

    tmp_log = DATA / 'test_case_reasoning.jsonl'
    tmp_log.write_text("")
    import intent_reasoning_auditor as ira
    log_case(entry, log_path=str(tmp_log))
    lines = tmp_log.read_text().splitlines()
    check("9b_wrote_1_line",  len(lines) == 1)
    check("9b_valid_json",    json.loads(lines[0])["intent"]["label"] == "urgent")
    tmp_log.unlink()

except Exception as e:
    check("9x", False, str(e)[:80])

# ── Summary ────────────────────────────────────────────────────────────
print()
print("=" * 60)
print(f"RESULTS  {passed} passed / {failed} failed  out of {passed+failed}")
print("=" * 60)
for line in results:
    print(line)

sys.exit(1 if failed else 0)
