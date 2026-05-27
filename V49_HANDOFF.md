# V49 Email Responder — Agent Handoff Briefing
# ═════════════════════════════════════════════════════════════════════════════

## 1. ENVIRONMENT

| Item | Value |
|---|---|
| Workspace | ~/.openclaw/workspace/zion.app/commands/ |
| Main responder | intelligent_email_responder_v26.py  (102 KB, 2157 lines) |
| Decision adapter  | email_decision.py  (8.9 KB) |
| Quality scorer    | response_verifier.py  (_score_response_quality) |
| Run log           | data/v26_run_log.jsonl |
| Stats             | data/v26_stats.jsonl |
| Template quality  | data/template_quality.jsonl |

Python 3.11+ at /opt/homebrew/bin/python3 (macOS). Node 20 via nvm for the site build.

## 2. WHAT WAS FOUND (diagnostic run 2026-05-21)

| Symptom | Root cause |
|---|---|
| reply_all_enforced=0 in 32/38 runs | Dry-run stubs had _no to_header field — from_email_data() built Email(to=[],cc=[]) — always_cc() got empty recipient list → reply_all_ok stayed False |
| Live: same bug when Gmail dicts skip to_header | from_email_data() did [a for a in raw_str.split(",")] but silently dropped list-valued "to" keys from Gmail headers |
| V27/V29 always_cc() exists in email_decision.py but never exercised in dry-run | Stub dicts were the only test data and they lacked to_header |

## 3. V49 FIXES ALREADY APPLIED ✓

### FIX-1: email_decision.py — robust recipient parser
- New helper: _parse_recipients(raw) — handles str, list, or None
- from_email_data() now uses _parse_recipients() for both to and cc
- Applies to live Gmail dicts (list-valued "to") and stub dicts (raw-str "cc") equally

### FIX-2: Dry-run stubs — to_header added to all 5
- dr-1..dr-5 now carry "to_header": "me@example.com"
- always_cc() now gets [me@example.com] + cc recipients → non-empty use_cc → reply_all_ok=True on dr-1/dr-2
- dr-3/dr-4/dr-5 have no cc → use_cc = "" (correct: suppression of CC on cold threads)

**Dry-run 2026-05-21T205008 result:**
  reply_all: 1/3 enforced  ← first non-zero in 38 runs ✓
  5/5 stub emails exit 0  ← still green ✓

## 4. V49 FEATURES REMAINING — BUILD NOW

### FEAT-3: ResponseQualityImprover loop
**Goal:** Call _score_response_quality() on every send_dry (fast and full path), store
score back into template_quality.jsonl, auto-quarantine / promote templates.

**Scorer already exists:** response_verifier._score_response_quality(body, email_data, intent_label)
  - email_data needs: {subject, snippet, sender, recipients, cc, tone}

**Insert after every _log_template_quality() call (4 locations):**
  - L1639  → dry-run fast-path  (before add_to_result)
  - L1732  → live fast-path
  - L1980  → dry-run full-path
  - L2061  → live full-path

**Pattern (per call site):**
```python
    # V49-FEAT3: score response quality — 6-dimension verifier
    _rv_ed = {"subject": subj, "snippet": snip, "sender": sender,
              "recipients": email.get("to", ""), "cc": email.get("cc", ""),
              "tone": tone_data}
    try:
        _rv_score = _v25_score(body, _rv_ed, intent_label)
        _log({"ts": datetime.now(timezone.utc).isoformat(),
              "run_id": RUN_ID, "phase": "response_quality_score",
              "intent": intent_label, "overall": _rv_score.get("overall_score", 0),
              "should_send": _rv_score.get("should_send", False)})
    except Exception:
        pass
```

### FEAT-5: ActionRouter dispatch (case-by-case routing)
**Goal:** Expand beyond send/skip to intent-driven action outcomes.
Read _INTENT_POLICIES at top of file (L38-102) — each policy has send_on/cc_on/fwd_on
semantics. Implement a dispatch function that picks one action per email:

```python
def _dispatch_action(intent_label, urgency_val, dry_run, ...) → dict
```

**Mandatory policy source (do not duplicate):**
_POLICIES dict defines per-intent:
  grammar_threshold  reply_all_default  max_auto_depth  min_confidence

**Insert:** After CaseRouter result handling (~L1480-1496), before grammar check.
If `_rroute` not escalate/auto_ack/review → call `_dispatch_action()` → set route result.
This is the "intent-action matrix" that turns intent labels into actionable outcomes.

### FEAT-6: Escalation spike detector
**Goal:** If >=3 escalations in 5 most-recent v26_stats runs within 60min → telegram alert.

**Insert:** Inside _log_stats() / before _finalise returns.
Read v26_stats.jsonl, count action_escalated in last N runs, compare timestamps.
If spike → telegram_send("[SPIKE] N escalations in M minutes — review orchestrator")

**Helper stub:**
```python
def _check_escalation_spike() -> None:
    try:
        spike_log = DATA / 'v26_stats.jsonl'
        if not spike_log.exists() or spike_log.stat().st_size < 100: return
        rows = [json.loads(l) for l in spike_log.read_text().splitlines()[-15:]
                if l.strip()]
        escalated = [r for r in rows if r.get("action_escalated", 0) > 0]
        if len(escalated) >= 3:
            ts_first = datetime.fromisoformat(escalated[0]["ts_end"])
            ts_last  = datetime.fromisoformat(escalated[-1]["ts_end"])
            if abs((ts_last - ts_first).total_seconds()) <= 3600:
                telegram_send(f"[SPIKE] {len(escalated)} escalations in "
                               f"<=60 min — first={escalated[0]['run_id']}")
    except Exception: pass
```

## 5. KEY LINE NUMBERS

| Zone | Start | End | Purpose |
|---|---|---|---|
| _fast_path top | 1358 | 1740 | Fast path — quality gate / reply-all / send_dry_fast |
| _full_pipeline top | 1745 | 2070 | Full path — context / KB / RTFB / send_dry |
| Dry-run stubs | 1030 | 1046 | ← FIX-2 applied |
| Template quality log | 528 | 542 | Helper definition |
| Quarantine / audit | 593 | 630 | V28 autocorrect |
| Policy overrides | 38 | 102 | _INTENT_POLICIES ← FEAT-5 reads here |
| _finalise | 2083 | 2135 | ← FEAT-6 insert before return |
| reply_all stats | 2091 | 2103 | V49 report line |

## 6. FILE PATHS

~/ is /Users/klebergarciaalcatrao/

```
~/.openclaw/workspace/zion.app/commands/intelligent_email_responder_v26.py
~/.openclaw/workspace/zion.app/commands/email_decision.py
~/.openclaw/workspace/zion.app/commands/response_verifier.py
~/.openclaw/workspace/zion.app/data/v26_stats.jsonl
~/.openclaw/workspace/zion.app/data/template_quality.jsonl
~/.openclaw/workspace/zion.app/data/v26_run_log.jsonl
```

## 7. WORKFLOW ORDER

### 7a. FEAT-3 (ResponseQualityImprover) — simplest, highest value
1. Insert scoring block at the 4 insert points listed in §4.
2. Dry-run 5/5 → exit 0
3. Check data/template_quality.jsonl: 5 new rows (one per stub email)
4. Commit → push

### 7b. FEAT-5 (ActionRouter dispatch) — next simplest
1. Write `_dispatch_action()` helper function (use `case_router.route()` result + _INTENT_POLICIES)
2. Insert call in _fast_path at ~L1480 (right after CaseRouter block, before grammar check)
3. Insert call in _full_pipeline analogously
4. Dry-run → verify action field is enriched (review/escalated actions still present, others gain dispatch annotation)
5. Commit → push

### 7c. FEAT-6 (Escalation spike detector) — smallest new function
1. Add _check_escalation_spike() to helpers section before _finalise
2. Call it inside _finalise before return
3. Dry-run → no spike expected in 5-stub run
4. Commit → push

### 7d. All pushes
```
cd ~/.openclaw/workspace/zion.app
git add commands/
git status          # verify no secrets/logs staged
git commit -m "V49: email-adapter robustness + quality scoring loop + action router + spike detector"
git push origin main
```
If CI fails on rebase: `git push --force-with-lease origin main`

## 8. VALIDATION

After each commit:
```bash
/opt/homebrew/bin/python3 commands/intelligent_email_responder_v26.py --dry-run --limit 5
# Must exit 0
# Must print "reply_all: X/Y enforced" with Y > 0
```

Live run (only when safe — Gmail connected):
```bash
/opt/homebrew/bin/python3 commands/intelligent_email_responder_v26.py --limit 10
# Check data/v26_stats.jsonl for reply_all_enforced and action_escalated
```

## 9. GIT RESCUE PROTOCOL

- If `git pull --rebase` conflicts: `git stash && git stash drop`
- Attempt normal push → if non-ff rejected → `git push --force-with-lease origin main`
- If CI fails: inspect via GitHub Actions web UI, don't chase via terminal

---

END OF BRIEFING
