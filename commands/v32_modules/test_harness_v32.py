#!/usr/bin/env python3
"""
V32 Test Harness — 5 scenarios × 3 assertions = 15 checks
Covers: reply_quality_ab, inbox_triage, template_versioner,
        lang_detector, health_alert.
"""
import json, sys
from pathlib import Path
from datetime import datetime, timezone, timedelta

WORKSPACE = Path(__file__).resolve().parent.parent.parent
V32  = WORKSPACE / 'commands' / 'v32_modules'
V30  = WORKSPACE / 'commands' / 'v30_modules'
V31  = WORKSPACE / 'commands' / 'v31_modules'
DATA = WORKSPACE / 'data'
sys.path.insert(0, str(V32))
sys.path.insert(0, str(V30))
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
print("V32 TEST HARNESS — 5 modules · 15 assertions")
print(f"Workspace : {WORKSPACE}")
print(f"V32 modules: {len(list(V32.glob('*.py')))}")
print("=" * 60)

# 1. reply_quality_ab ────────────────────────────────────────────────
section("reply_quality_ab — A/B split + winner logic")
try:
    from reply_quality_ab import auto_assign_variant, decide_winner, log_ab_result

    v_a = auto_assign_variant("email-001", "urgent", "run-1")
    v_b = auto_assign_variant("email-002", "support", "run-1")
    check("1a_variant_ab", v_a in ("A", "B") and v_b in ("A", "B") and v_a != v_b)

    db = DATA / 'ab_split_results.jsonl'
    db.write_text("")
    for i in range(3):
        log_ab_result("run-1", f"e{i}", f"t{i}", "urgent", "A", "body A " * 50, 80 + i, True, "dc@test.com", True)
        log_ab_result("run-1", f"e{i+3}", f"t{i}", "urgent", "B", "body B " * 50, 75 + i, True, "dc@test.com", True)
    w = decide_winner("run-1", min_samples=2)
    check("1b_winner_detected", bool(w.get("winner") or w.get("candidate")))
    check("1b_has_margin", "margin" in w)
    db.unlink()
except Exception as e:
    check("1x", False, str(e)[:80])

# 2. inbox_triage ────────────────────────────────────────────────────
section("inbox_triage — priority scoring + digest")
try:
    from inbox_triage import score_email, build_digest

    db = DATA / 'triage_digest.jsonl'
    db.write_text("")
    r1 = score_email("vip@test.com", "urgent", reply_all_ok=True, age_hours=1.0)
    check("2a_vip_score_ok", r1.get("score", 0) >= 60)
    check("2a_reply_all_detected", r1["reply_all_required"] is True)

    r2 = score_email("anon@test.com", "low", reply_all_ok=False, age_hours=40.0)
    check("2b_unknown_score_ok", r2.get("score", 0) <= 50)
    db.unlink()
except Exception as e:
    check("2x", False, str(e)[:80])

# 3. template_versioner ──────────────────────────────────────────────
section("template_versioner — bump + scaffold")
try:
    from template_versioner import bump_template, scaffold_version

    tv_path = DATA / 'template_versions.jsonl'
    tv_path.write_text("")
    v1 = bump_template("welcome_email")
    check("3a_version_1", v1["version"] == 1)
    v2 = bump_template("welcome_email")
    check("3b_bump_response_ok", bool(v2.get("bumped")))
    content = scaffold_version("welcome_email", base_wording="Hello, welcome to our service.", tone="professional")
    check("3c_scaffold_has_variant", "[reframed]" in content)
    tv_path.unlink()
except Exception as e:
    check("3x", False, str(e)[:80])

# 4. lang_detector ──────────────────────────────────────────────────
section("lang_detector — pt vs en detection")
try:
    from lang_detector import detect_lang, get_meeting_template

    check("4a_pt_subject", detect_lang("Olá, preciso de ajuda") in ("pt", "PT"))
    check("4a_en_body", detect_lang("Hi, I need some assistance") == "en")
    pt_t = get_meeting_template("pt")
    check("4b_pt_template", "Sugestões" in pt_t["slot_header"])
except Exception as e:
    check("4x", False, str(e)[:80])

# 5. health_alert ───────────────────────────────────────────────────
section("health_alert — threshold check + alert format")
try:
    from health_alert import check_health, format_alert

    log_path = DATA / 'v26_run_log.jsonl'
    bak = log_path.read_bytes() if log_path.exists() else None
    log_path.write_text("")

    h = check_health(window_hours=24)
    check("5a_healthy_empty", h.get("status") in ("no_log", "no_recent_entries", "checked"))

    now = datetime.now(timezone.utc)
    lines = [json.dumps({"ts": now.isoformat(), "action": "escalated", "escalated": True}) for _ in range(8)]
    lines += [json.dumps({"ts": now.isoformat(), "action": "sent"}) for _ in range(32)]
    log_path.write_text("\n".join(lines) + "\n")
    h2 = check_health(window_hours=1)
    check("5b_escalation_alert", any("escalated" in str(a) for a in h2.get("alerts", [])))

    alert_text = format_alert({"alerts": h2["alerts"], "status": h2["status"]})
    check("5c_alert_formatted", "🚨" in alert_text or "escalation" in alert_text.lower())
    if bak:
        log_path.write_bytes(bak)
    else:
        log_path.unlink()
except Exception as e:
    check("5x", False, str(e)[:80])

# ── Summary ─────────────────────────────────────────────────────────
print()
print("=" * 60)
print(f"RESULTS  {passed} passed / {failed} failed  out of {passed+failed}")
print("=" * 60)
for line in results:
    print(line)
sys.exit(1 if failed else 0)
