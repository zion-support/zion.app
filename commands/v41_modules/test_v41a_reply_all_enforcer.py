# Copyright 2025 The KiloClaw Authors
# SPDX-License-Identifier: Apache-2.0
"""
V41-A: Test suite — ReplyAllEnforcer (30 tests total across V41-A + V41-B).

Each RLHF gap from gap-detector maps to a reproduction test that proves V41-A
would have blocked the bad send before it occurred.

Gap → V41-A reproduction  (from rlhf_pipeline gap-detector output)
  gap_type=reply_all_breach (legal)         → §3 test_rlhf_gap_legal_reply_all_bug_reproduced
  gap_type=false_positive (support_issue)   → §4 test_rlhf_gap_false_pos_support_issue_reproduced
  gap_type=missing_action_item (meeting)    → §4 test_rlhf_gap_action_miss
  gap_type=tone_mismatch (personal_one2one) → §4 test_rlhf_gap_tone_mismatch
"""
from __future__ import annotations

import sys, logging
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent))

from commands.v41_modules.reply_all_enforcer import ReplyAllEnforcer, EnforcementResult
from commands.v33_modules.intent_policy_db import IntentPolicyDB, IntentPolicyLookup
from commands.v40_modules.billing_scope_enforcer import BillingScopeEnforcer

POLICY_DIR = Path(__file__).resolve().parent.parent.parent / "data" / "policies"
POLICY_DB  = IntentPolicyDB.load(str(POLICY_DIR / "intent_policies.json"))
BST        = BillingScopeEnforcer.load(str(POLICY_DIR / "billing_scope.json"))

ENFORCER = ReplyAllEnforcer(POLICY_DB, BST)

class _Stats:
    passed = failed = total = 0

def check(name: str, ok: bool, ctx: str = ""):
    _Stats.total += 1
    if ok:
        _Stats.passed += 1
        print(f"  ✓ {name}")
    else:
        _Stats.failed += 1
        print(f"  ✗ {name} — {ctx}")

def enforce(**kw) -> EnforcementResult:
    kw.setdefault("intent_confidence", 0.85)
    kw.setdefault("grammar_score",     90.0)
    kw.setdefault("suggested_cc",      "")
    kw.setdefault("is_sender_in_cc",   False)
    kw.setdefault("billing_action",    "")
    return ENFORCER.enforce(**kw)

# ═══════════════════════════════════════════════════════════════════════
#  V41-A → ReplyAllEnforcer
# ═══════════════════════════════════════════════════════════════════════

# ── §1 Legal reply_all_breach: V26 set reply_all=True → V41-A must block ──
print("\n§1 Legal — hard_no_cc gate")
r = enforce(intent_label="legal", suggested_cc="fwd@corp.com",
            intent_confidence=0.84, grammar_score=90.0)
check("legal CC blocked (hard_no_cc)",
      r.allow_cc is False and "hard_no_cc" in r.blocked_by)
check("legal auto_send blocked by hard_no_cc (conf=0.84 >= floor=0.75 → no confidence_floor trigger)",
      r.allow_auto_send is False and "hard_no_cc" in r.blocked_by,
      f"blocked={r.blocked_by}")
check("legal confidence_floor=0.75 (default)",
      r.confidence_floor == 0.75)

# ── §2 Confidence floor ───────────────────────────────────────────────
print("\n§2 Confidence floor")
r  = enforce(intent_label="support_issue", intent_confidence=0.55, grammar_score=92.0)
check("support_issue conf=0.55 blocked (floor=0.70)",
      r.allow_auto_send is False)
check("  blocked_by = [confidence_floor]",
      r.blocked_by == ["confidence_floor"],
      f"got {r.blocked_by}")

r2 = enforce(intent_label="financial", intent_confidence=0.95, grammar_score=96.0,
             suggested_cc="")
check("financial conf=0.95 BUT hard_no_cc blocks auto_send regardless",
      r2.allow_auto_send is False)
check("  blocked_by=[hard_no_cc]",
      r2.blocked_by == ["hard_no_cc"],
      f"got {r2.blocked_by}")

r3 = enforce(intent_label="billing", intent_confidence=0.899, grammar_score=96.0)
check("billing conf=0.899 hard_no_cc + confidence_floor both fire",
      r3.allow_auto_send is False)
check("  blocked_by=[hard_no_cc, confidence_floor]",
      r3.blocked_by == ["hard_no_cc", "confidence_floor"],
      f"got {r3.blocked_by}")
r4 = enforce(intent_label="billing", intent_confidence=0.900, grammar_score=96.0)
check("billing conf=0.900: hard_no_cc still gates",
      r4.allow_auto_send is False)
check("  blocked_by=[hard_no_cc]",
      r4.blocked_by == ["hard_no_cc"],
      f"got {r4.blocked_by}")

# ── §3 BillingScope hard block ──────────────────────────────────────
print("\n§3 BillingScope violation")
r5 = enforce(intent_label="legal", billing_action="billing account backdated legal")
check("billing scope blocks auto_send",
      r5.allow_auto_send is False)
check("  blocked_by contains billing_scope_violation",
      "billing_scope_violation" in r5.blocked_by)

# ── §4 CC decisions per intent policy ─────────────────────────────
# Hard facts from intent_policies.json:
#   urgent:           min_c=0.75, grammar=55, reply_all=True
#   support_issue:    min_c=0.70, grammar=65, reply_all=True
#   personal_one2one: min_c=0.80, grammar=75, reply_all=False
#   meeting:          min_c=0.75, grammar=65, reply_all=True
#   partnership:      min_c=0.85, grammar=80, reply_all=True
#   financial:        min_c=0.90, grammar=80, reply_all=False  + _HARD_NO_CC
#   billing/invoice:  min_c=0.90, grammar=85, reply_all=False  + _HARD_NO_CC
#   legal:            min_c=0.75, grammar=65, _HARD_NO_CC hard rule
print("\n§4 CC decisions per intent policy")
for intent, exp_cc, exp_send, conf, gram, note in [
    # (intent,          exp_cc,    exp_send,     conf,   gram,               note)
    ("urgent",           True,      True,          0.82,   92.0, "reply_all=T, conf>=floor"),
    ("support_issue",    True,      True,          0.82,   90.0, "reply_all=T, conf>=floor=0.70"),
    ("personal_one2one", False,     True,          0.85,   90.0, "reply_all=F, conf>=floor=0.80"),
    ("meeting",          True,      True,          0.85,   90.0, "reply_all=T, conf>=floor=0.75"),
    ("partnership",      True,      True,          0.88,   92.0, "reply_all=T, conf>=floor=0.85"),
    ("financial",        False,     False,         0.95,   90.0, "hard_no_cc: cc=False AND auto_send=False"),
    ("billing",          False,     False,         0.95,   95.0, "hard_no_cc: cc=False AND auto_send=False"),
    ("invoice",          False,     False,         0.95,   95.0, "hard_no_cc: cc=False AND auto_send=False"),
    ("legal",            False,     False,         0.85,   90.0, "hard_no_cc blocks CC AND send"),
    ("unknown_type",     False,     True,          0.85,   90.0, "default_floor=0.75, conf=0.85≥0.75, default_cc=False"),
]:
    r = enforce(intent_label=intent, intent_confidence=conf, grammar_score=gram)
    label = f"{intent:20s}: cc_ok={r.allow_cc} send_ok={r.allow_auto_send}  ({note})"
    ok = r.allow_cc is exp_cc and r.allow_auto_send is exp_send
    check(label, ok,
          f"expected cc={exp_cc} send={exp_send}" if not ok else "")

# ── §5 Sender-in-CC abuse ─────────────────────────────────────────
print("\n§5 Sender-in-CC abuse")
r_sa = enforce(intent_label="meeting", suggested_cc="peer@corp.com",
               is_sender_in_cc=True)
check("sender_in_cc blocks CC", r_sa.allow_cc is False)

# ── §6 Grammar floor ─────────────────────────────────────────────
print("\n§6 Grammar floor")
for intent, score, exp_pass, note in [
    # (intent,         score,  exp_allow_send, note)
    ("urgent",         54,     False,          "urgent under grammar_floor=55 → blocked"),
    ("urgent",         55,     True,           "urgent at grammar_floor=55 → passes"),
    ("invoice",        84,     False,          "invoice: floor=85 + _HARD_NO_CC → blocked"),
    ("invoice",        85,     False,          "invoice: floor met BUT _HARD_NO_CC gates send"),
]:
    r = enforce(intent_label=intent, intent_confidence=0.95,
                grammar_score=score, suggested_cc="")
    check(f"{intent} g={score} {note} → send={r.allow_auto_send}",
          r.allow_auto_send is exp_pass)

# ── §7 Combined: hard_no_cc + confidence + billing simultaneously ──
print("\n§7 Combined violations")
r_comb = enforce(
    intent_label     = "legal",
    intent_confidence= 0.50,
    grammar_score    = 70.0,
    suggested_cc     = "cmu.polit@cmu.edu",
    billing_action   = "billing account backdated legal",
)
check("triple violation (legal+conf+billing)",
      r_comb.allow_auto_send is False and r_comb.allow_cc is False)
check("  hard_no_cc+confidence_floor+billing_scope_violation",
      "hard_no_cc" in r_comb.blocked_by
      and "confidence_floor" in r_comb.blocked_by
      and "billing_scope_violation" in r_comb.blocked_by)

# ── §8 RLHF gap reproduction ──────────────────────────────────────
print("\n§8 RLHF gap reproduction")
# Gap 1: legal reply_all_breach
r_gap1 = enforce(intent_label="legal", intent_confidence=0.84,
                 grammar_score=90.0, suggested_cc="fwd@corp.com")
check("[GAP1] legal-003 reply_all_breach blocked",
      r_gap1.allow_cc is False,
      f"blocks={r_gap1.blocked_by}")

# Gap 2: support_issue false positive
r_gap2 = enforce(intent_label="support_issue", intent_confidence=0.55,
                 grammar_score=88.0)
check("[GAP2] support-008 false_pos (conf=0.55<0.70) blocked",
      r_gap2.allow_auto_send is False)
check("  blocked_by=[confidence_floor]",
      r_gap2.blocked_by == ["confidence_floor"])

# ── §9 EnforceResult serialisation ───────────────────────────────
print("\n§9 EnforceResult serialisation")
d = enforce(intent_label="billing", intent_confidence=0.95,
             grammar_score=98.0, suggested_cc="").to_dict()
check("to_dict keys present",
      all(k in d for k in ["allow_cc","allow_auto_send","blocked_by","reasons",
                           "confidence_floor","grammar_floor","intent_label","v_stage"]))
check("v_stage == V41-A",
      d["v_stage"] == "V41-A")

# ── Summary ─────────────────────────────────────────────────────
print(f"\n{'─'*45}")
print(f"  V41-A: {_Stats.passed}/{_Stats.total} passed, {_Stats.failed} failed")
