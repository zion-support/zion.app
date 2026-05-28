#!/usr/bin/env python3
"""
V41-RLHF: RLHF Pipeline — collect · score · reward · gap detection.

Reads V26 run artifacts, scores responses against reward signals,
generates preference pairs, and produces a run summary for V41 —
V41-A ReplyAllEnforcer + V41-B ResponseQualityGrader.

CLI:
    rlhf_pipeline score-pairs   data/rlhf/preference_pairs_v26_sample.jsonl
    rlhf_pipeline score-run     runs/v26_date/run_summary.json
    rlhf_pipeline build-summary data/rlhf/records/
    rlhf_pipeline gap-detector  data/rlhf/records/  > v41_gap_suggestions.txt
"""
from __future__ import annotations
import argparse
import json
import logging
import os
import re
import sys
import uuid
from collections import defaultdict
from dataclasses import dataclass, field
from datetime import datetime, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from commands.v41_modules.rlhf_types import (
    PreferencePair, RLHFRunRecord, RLHFRunSummary, RLHFRunQuality,
    RewardSignals, ResponseSlot, Context,
)

logger = logging.getLogger("rlhf_pipeline")

POLICY_DB_PATH = (
    Path(__file__).resolve().parent.parent.parent
    / "data" / "policies" / "intent_policies.json"
)
POLICY_JSON_PATH = (
    Path(__file__).resolve().parent.parent.parent
    / "data" / "policies" / "billing_scope.json"
)
OUTPUT_DIR = (
    Path(__file__).resolve().parent.parent.parent
    / "data" / "rlhf"
)

# ─── Reward weights ───────────────────────────────────────────────────────

REWARD_WEIGHTS = {
    "intent_match_score":     0.30,
    "reply_quality_score":    0.25,
    "reply_all_correctness":  0.20,
    "action_item_coverage":   0.15,
    "confidence_calibration": 0.10,
}

# ─── Heuristic scorers ─────────────────────────────────────────────────────

_GRAMMAR_HITS = re.compile(
    r'\b(?:teh|wanna|gonna|lemme|kinda|dunno|ur|u|plz|pls|cuz|wanna)\b',
    re.IGNORECASE,
)

def score_grammar(body: str) -> float:
    """Return 0-100 grammar score based on casual-phrase hits."""
    hits = _GRAMMAR_HITS.findall(body)
    return max(40.0, 100.0 - 10 * min(len(hits), 6))


def score_confidence_calibration(intent_confidence: float,
                                 threshold_used: float) -> float:
    """Reward model that auto-sent just-right; penalise over/under-bold."""
    if intent_confidence >= threshold_used + 0.15:
        return 0.40  # over-confident auto-send at lower threshold
    if intent_confidence < threshold_used - 0.10:
        return 0.20  # under-confident but auto-sent — false positive risk
    return 1.0   # confidence-knowledge-edge is well-calibrated


def has_action_items(subj: str, snippet: str) -> tuple[bool, float]:
    """Detect explicit action markers. Returns (has_items, action_item_confidence)."""
    text = f"{subj} {snippet}".lower()
    strong = ["deadline","by eod","by cob","asap","needs to","must","confirm by",
              "confirm until","prazo","preciso","aguardo","respond by"]
    weak   = ["please","let me know","when","share","send","forward","call","meet"]
    s_hits = sum(1 for m in strong if m in text)
    w_hits = sum(1 for m in weak   if m in text)
    total  = s_hits * 1.5 + w_hits * 0.5
    return (total > 0.5, min(1.0, total / 3.0))


def acts_on_action_items(body: str) -> float:
    """Check if the reply body actually answers scheduling/action questions."""
    text = body.lower()
    confirm_markers = [
        "confirmed", "works for us", "we can", "scheduled", "calendar",
        "tuesday", "wednesday", "monday", "thursday", "friday",
        "next week","this week", "available", "time slot",
    ]
    return min(1.0, sum(0.2 for m in confirm_markers if m in text))


def check_reply_all_policy(intent_label: str, thread_size: int,
                           policy_cc: bool) -> float:
    """Reply-all correctness score: 1.0 when policy matches, 0.0 when violated."""
    # Legal / urgent / financial: reply-all should always be OFF
    no_cc_intents = {"urgent", "financial", "legal", "invoice", "billing"}
    large_thread  = thread_size >= 5

    if intent_label in no_cc_intents:
        return 0.0 if policy_cc else 1.0
    if policy_cc and large_thread:
        return 0.0  # cc in large thread — potential exposure
    return 1.0 if policy_cc else 0.5  # cc optional at small thread


def combined_reward(rs: RewardSignals) -> float:
    w = REWARD_WEIGHTS
    return (
        w["intent_match_score"]     * rs.intent_match_score +
        w["reply_quality_score"]    * rs.reply_quality_score +
        w["reply_all_correctness"]  * rs.reply_all_correctness +
        w["action_item_coverage"]   * rs.action_item_coverage +
        w["confidence_calibration"] * rs.confidence_calibration
    )


# ─── Score a single email ─────────────────────────────────────────────────

def score_email(record: RLHFRunRecord, email_record: dict) -> PreferencePair:
    """Score a single email and return a default/neutral PreferencePair skeleton."""
    intent_cat = email_record.get("intent_label", "")
    auto_sent = email_record.get("sent", False)
    msg = email_record.get("msg", {}) or {}
    body    = msg.get("body", "")
    subject = msg.get("subject", "")
    conf    = float(email_record.get("confidence", 0.0))

    g_score = score_grammar(body[:400])
    has_ai, act_confidence = has_action_items(subject, body[:300])
    replies  = email_record.get("reply_all_set", False)
    thread_sz = email_record.get("thread_depth", 1)
    cali     = score_confidence_calibration(conf, 0.65)

    reply_all_correct = check_reply_all_policy(intent_cat, thread_sz, replies)

    ctxt = Context(
        sender          = msg.get("from","") or email_record.get("sender",""),
        subject         = subject,
        body_snippet    = body[:500],
        thread_depth    = thread_sz,
        has_action_items= has_ai,
        recommended_reply_all = (
            "personal_one2one" in intent_cat
            or "meeting" in intent_cat
            or "spam" in intent_cat
        ),
        escalation_triggered = email_record.get("escalated", False),
    )
    rs = RewardSignals(
        intent_match_score    = float(email_record.get("intent_exact_match", 1.0 if intent_cat else 0.0)),
        reply_quality_score   = g_score / 100.0,
        reply_all_correctness = reply_all_correct,
        action_item_coverage  = act_confidence,
        confidence_calibration= cali,
    )
    rs.combined_reward = combined_reward(rs)

    return PreferencePair(
        pair_id          = str(uuid.uuid4())[:8],
        run_id           = record.record_id,
        email_id         = email_record.get("email_id", email_record.get("mid","")),
        intent_label     = intent_cat,
        intent_confidence= conf,
        context          = ctxt,
        reward_signals   = rs,
        label            = "tie",
        labeler          = "auto_bootstrap",
        metadata         = {
            "v_stage":  record.v_stage,
            "captured_at": _utcnow(),
            "trace_id": email_record.get("trace_id", ""),
            "run_artifacts_path": record.run_artifacts_path,
        },
    )


# ─── Gap detection ────────────────────────────────────────────────────────

GAP_TEMPLATES = [
    {
        "gap_type": "false_positive",
        "detect":    lambda r: r.reward_signals.combined_reward < 0.55
                             and r.response_a.auto_sent,
        "description_probe":  "auto_sent with combined_reward < 0.55",
        "suggested_fix":      "V41-A add intent_confidence floor gate before auto_send",
        "severity": "high",
    },
    {
        "gap_type": "false_negative",
        "detect":    lambda r: r.reward_signals.combined_reward > 0.80
                             and not r.response_a.auto_sent
                             and not r.metadata.get("escalation_triggered"),
        "description_probe":  "high reward but email was not auto-sent or escalated",
        "suggested_fix":      "Investigate why V26 restrained the send",
        "severity": "medium",
    },
    {
        "gap_type": "reply_all_breach",
        "detect":    lambda r: r.reward_signals.reply_all_correctness == 0.0,
        "description_probe":  "reply_all policy violated for this intent",
        "suggested_fix":      "V41-A add reply_all enforcement rule for intent category",
        "severity": "high",
    },
    {
        "gap_type": "tone_mismatch",
        "detect":    lambda r: (r.context.recommended_reply_all != r.response_a.auto_sent)
                              and r.reward_signals.combined_reward > 0.65,
        "description_probe":  "response tone doesn't match recommended formality level",
        "suggested_fix":      "V41-B add tone-alignment constraint per intent label",
        "severity": "low",
    },
    {
        "gap_type": "missing_action_item",
        "detect":    lambda r: (r.context.has_action_items
                               and r.reward_signals.action_item_coverage < 0.40),
        "description_probe":  "email has action markers but response doesn't address them",
        "suggested_fix":      "Add action-item extractor to V26 pre-send gate",
        "severity": "medium",
    },
]


def detect_gaps(pairs: list[PreferencePair]) -> list[dict]:
    gaps = []
    for p in pairs:
        for tmpl in GAP_TEMPLATES:
            if tmpl["detect"](p):
                gaps.append({
                    "gap_type":      tmpl["gap_type"],
                    "pair_id":       p.pair_id,
                    "email_id":      p.email_id,
                    "intent_label":  p.intent_label,
                    "description":   tmpl["description_probe"],
                    "suggested_fix": tmpl["suggested_fix"],
                    "severity":      tmpl["severity"],
                    "combined_reward": round(p.reward_signals.combined_reward, 3),
                })
    return gaps


# ─── Quality summary from gap list ────────────────────────────────────────

def quality_from_gaps(gaps: list[dict]) -> RLHFRunQuality:
    q = RLHFRunQuality()
    for g in gaps:
        gt = g["gap_type"]
        if gt == "false_positive":
            q.low_confidence_auto_sent += 1
        elif gt == "false_negative":
            q.high_confidence_escalated += 1
        elif gt == "reply_all_breach":
            q.reply_all_violation_count += 1
        elif gt == "tone_mismatch":
            q.tone_mismatch_count += 1
        elif gt == "missing_action_item":
            q.action_item_missed_count += 1
    return q


# ─── CLI entry points ─────────────────────────────────────────────────────

def cmd_score_pairs(path: str, policy_path: str = "") -> list[dict]:
    pairs = PreferencePair.from_jsonl(path)
    results = []
    for p in pairs:
        rs = p.reward_signals
        if not rs.combined_reward:
            rs.combined_reward = combined_reward(rs)
        results.append({
            "pair_id":        p.pair_id,
            "intent_label":   p.intent_label,
            "label":          p.label,
            "labeler":        p.labeler,
            "combined_reward": round(rs.combined_reward, 4),
            "intent_match":   round(rs.intent_match_score, 4),
            "reply_quality":  round(rs.reply_quality_score, 4),
            "reply_all_corr": round(rs.reply_all_correctness, 4),
            "action_coverage": round(rs.action_item_coverage, 4),
        })
    return results


def cmd_build_summary(pairs_path: str, policy_path: str = "") -> RLHFRunSummary:
    pairs = PreferencePair.from_jsonl(pairs_path)
    run_ids = {p.run_id for p in pairs}
    gaps    = detect_gaps(pairs)
    quality = quality_from_gaps(gaps)
    n       = len(pairs)

    rewards = [p.reward_signals.combined_reward for p in pairs if p.reward_signals.combined_reward]
    avg     = sum(rewards)/max(len(rewards),1)
    pos   = sum(1 for p in pairs if p.label == "prefer_a" and p.response_a.auto_sent) \
           + sum(1 for p in pairs if p.label == "prefer_b" and p.response_b.auto_sent)
    neg   = quality.low_confidence_auto_sent + quality.reply_all_violation_count
    trend = (
        "improving" if avg > 0.78 else
        "declining" if avg < 0.42 else "stable"
    )

    v_actions = []
    if quality.reply_all_violation_count > 0:
        v_actions.append("V41-A: add reply_all_breach guard for affected intents")
    if quality.tone_mismatch_count > 0:
        v_actions.append("V41-B: add tone-alignment constraint per intent label")
    if quality.action_item_missed_count > 0:
        v_actions.append("V6x: add action-item extractor to pre-send gate")
    policy_update = {"action": "review", "trigger": "rlhf"} if neg > 0 else None

    return RLHFRunSummary(
        summary_id           = str(uuid.uuid4())[:8],
        v_stage              = pairs[0].metadata.get("v_stage","")  if pairs else "",
        run_ids              = sorted(run_ids),
        total_emails         = n,
        total_pairs          = n,
        positive_outcomes    = pos,
        negative_outcomes    = neg,
        reply_all_violations = quality.reply_all_violation_count,
        avg_combined_reward  = round(avg, 4),
        reward_trend         = trend,
        proposed_policy_update = policy_update,
        proposed_v41_actions  = v_actions,
        generated_at         = _utcnow(),
    )


# ─── Main ─────────────────────────────────────────────────────────────────

def main():
    ap = argparse.ArgumentParser("V41-RLHF: RLHF Pipeline for email responder")
    sub = ap.add_subparsers(dest="command")

    sp = sub.add_parser("score-pairs", help="Score each pair in a JSONL file")
    sp.add_argument("file", help="Path to pairs JSONL")
    sp.add_argument("--out", default="", help="Output path")

    sp2 = sub.add_parser("build-summary",
                         help="Aggregate pairs → RLHFRunSummary")
    sp2.add_argument("file", help="Path to pairs JSONL")
    sp2.add_argument("--out", default="", help="Output path")

    sp3 = sub.add_parser("gap-detector",
                         help="Detect RLHF gaps in pairs JSONL")
    sp3.add_argument("file", help="Path to pairs JSONL")

    args = ap.parse_args()

    if args.command == "score-pairs":
        results = cmd_score_pairs(args.file)
        for r in results:
            print(json.dumps(r))
    elif args.command == "build-summary":
        summary = cmd_build_summary(args.file)
        print(json.dumps(summary.to_dict(), indent=2, sort_keys=True))
    elif args.command == "gap-detector":
        pairs  = PreferencePair.from_jsonl(args.file)
        gaps   = detect_gaps(pairs)
        for g in gaps:
            print(json.dumps(g))
    else:
        ap.print_help()


def _utcnow() -> str:
    from datetime import datetime, timezone
    return datetime.now(timezone.utc).isoformat()

if __name__ == "__main__":
    main()
