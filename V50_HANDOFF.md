# V50 Email Responder — Handoff Briefing
# ═════════════════════════════════════════════════════════════════════════════

## 1. ENVIRONMENT

| Item | Value |
|---|---|
| Workspace | ~/.openclaw/workspace/zion.app/commands/ |
| Main responder | intelligent_email_responder_v26.py (96 KB, 2185 lines) |
| Decision adapter | email_decision.py (8.9 KB) |
| Run log | data/v26_run_log.jsonl |
| Stats | data/v26_stats.jsonl |
| Template quality | data/template_quality.jsonl |

Python 3.11+ at /opt/homebrew/bin/python3 (macOS). Node 20 via nvm for the site build.

## 2. V49 BASELINE (f8353ccad891 — HEAD)

- FIX-1: _parse_recipients in email_decision.py ✅
- FIX-2: dry-run stubs gain to_header ✅
- FEAT-3: 6-dimension response_quality_score ×4 exit paths ✅
- FEAT-5: ActionRouter _dispatch_action stub (intent→action matrix) ✅
- FEAT-6: _check_escalation_spike + SPIKE ALERT ✅
- BUGFIX: UnboundLocalError in _finalise walrus ✅

Dry-run 5/5 → exit 0 after V49. See V49_HANDOFF.md for original spec.

## 3. V50 GAPS IDENTIFIED (priority order)

### FEAT-1 (PRIORITY #1) — Meeting dispatch enable · EFFORT: LOW · IMPACT: HIGH

**Problem:** `_INTENT_POLICIES["meeting"]` is fully defined (grammar_threshold 65,
reply_all_default True, min_confidence 0.75) but `_rroute == "meeting"` has zero
CaseRouter branches in _fast_path. Meetings always fall through to `"review"`.
The raw toggle `V26_MEETING_ENABLED` is False at L231, disabling both availability
inject and meeting routing simultaneously.

**Fix:** Three surgical edits
1. L231 → change `V26_MEETING_ENABLED = False` to `= True`
2. L1422 — after `if _rroute == "review":` block → insert `elif _rroute == "meeting":` branch
3. Meeting branch calls `add_to_result` with `"action": "meeting_action"` or the
   existing meeting handler path (see V49 skill for exact pattern)

**Implied source of new _rroute = "meeting":** CaseRouter does not return "meeting"
today. Two sub-options:
- (A) Add meeting detection in CaseRouter → returns "meeting" when ICS category == "booking"
  and cluster weight >= 0.65
- (B) Bypass CaseRouter for meeting: check intent_label == "booking" and
  outcome_history positive → set _rroute = "meeting" in _fast_path before L1407

**Recommended: A** — keeps CaseRouter as the single source of truth.

### FEAT-2 (PRIORITY #2) — Forced send stub (forcesend.txt) · EFFORT: LOW · IMPACT: MEDIUM-HIGH

**Problem:** `_maybe_call_ask_ai_bridge` reads `forcesend.txt` by absolute path.
Mac: `/tmp/forcesend.txt` (dry-run only).
Sandbox: `/root/.openclaw/workspace/zion.app/data/forcesend.txt` (never created).
No code exists to create the file or read it via the DATA path.

**Fix:**
1. Create `data/forcesend.txt` on Mac with desired stub content
2. In `_maybe_call_ask_ai_bridge`: replace hardcoded `/tmp/forcesend.txt` with
   `forcesend.txt = "/tmp/forcesend.txt" if dry_run else f"{DATA}/forcesend.txt"`
   then read and parse the file before the bridge call

### FEAT-3 (PRIORITY #3) — Calendar overlay in fast-path · EFFORT: LOW · IMPACT: MEDIUM

**Problem:** `get_availability_next_7_days` + `format_availability` are imported at
L223–225 and gated by V26_MEETING_ENABLED at L1543/L1908, but never injected into
the response body. The attachment handler at L1299 sets `attachment_action =
"calendar_draft"` for deck/proposal/partnership attachments — this is the best
injection point for the calendar overlay.

**Fix:** Inside the `attachment_action == "calendar_draft"` branch (~L1308 after the
try/except), call:
```python
cal_block = ""
try:
    raw = get_availability_next_7_days(sender)
    cal_block = format_availability(raw)
except Exception:
    pass
# append cal_block to body before add_to_result
```
This lets the outbound reply include a "My availability this week" section.

## 4. KEY LINE NUMBERS

| Zone | Line(s) | Purpose |
|---|---|---|
| V26_MEETING_ENABLED toggle | 231 | False → True |
| get_availability_next_7_days import | 223–225 | Already imported |
| CaseRouter _rroute block | 1407–1425 | Add meeting branch here |
| attachment_action = "calendar_draft" | 1299 | Calendar overlay inject point |
| _maybe_call_ask_ai_bridge | TBC | forcesend.txt path logic |

## 5. FILE PATHS

```
~/ is /Users/klebergarciaalcatrao/

~/.openclaw/workspace/zion.app/commands/intelligent_email_responder_v26.py
~/.openclaw/workspace/zion.app/commands/email_decision.py
~/.openclaw/workspace/zion.app/data/forcesend.txt          ← CREATE
```

## 6. WORKFLOW ORDER

### FEAT-1 (Meeting dispatch)
1. Show L220–240 + L1405–1430 to confirm toggle location and CaseRouter shape
2. Inspect CaseRouter.route() return dict to confirm "route" key shape
3. Patch L231 → `= True`
4. Insert meeting branch after L1423 (before the final fallthrough)
5. py_compile → dry-run --limit 5 → commit → push --force-with-lease
6. Verify: L1409 `_rroute == "meeting"` fires on a booking stub

### FEAT-2 (Forcesend stub)
1. Create `data/forcesend.txt` on Mac
2. Patch `_maybe_call_ask_ai_bridge` path logic
3. py_compile → dry-run → commit → push

### FEAT-3 (Calendar overlay)
1. Patch calendar_draft branch at ~L1308
2. py_compile → dry-run → commit → push

### All pushes
```bash
cd ~/.openclaw/workspace/zion.app
git add commands/ data/
git status          # verify no secrets/logs staged
git commit -m "V50: meeting dispatch + forcesend stub + calendar overlay"
git push origin main
```
If CI fails on rebase: `git push --force-with-lease origin main`

## 7. VALIDATION

After each commit:
```bash
/opt/homebrew/bin/python3 commands/intelligent_email_responder_v26.py --dry-run --limit 5
# Must exit 0
```

FEAT-1 specifically: add a booking stub (intend="booking", subject="Schedule a call")
to dry-run pool and verify `_rroute == "meeting"` fires in run log.

---
END OF BRIEFING
