#!/usr/bin/env python3
"""
RLHF data types — mirrors data/policies/rlhf_schema.json.

Consumed by:
  • rlhf_pipeline.py  — score_pairs(), build_run_summary()
  • V41               — ResponseQualityGrader + ReplyAllEnforcer
  • test_harness_rlhf.py
"""
from __future__ import annotations
from dataclasses import dataclass, field, asdict
from datetime import datetime, timezone
from pathlib import Path
from typing import Any
import json


def _utcnow() -> str:
    return datetime.now(timezone.utc).isoformat()


# ─── Sub-objects ────────────────────────────────────────────────────────

@dataclass
class RewardSignals:
    intent_match_score:      float = 0.0  # 0.0-1.0  how well intent was detected
    reply_quality_score:     float = 0.0  # 0.0-1.0  grammar + clarity + tone
    reply_all_correctness:   float = 0.0  # 0.0-1.0  reply-all policy adherence
    action_item_coverage:    float = 0.0  # 0.0-1.0  did action items get addressed
    confidence_calibration:  float = 0.0  # 0.0-1.0  was confidence accurate
    combined_reward:         float = 0.0  # 0.0-1.0  weighted aggregate

    def to_dict(self) -> dict:
        return asdict(self)


@dataclass
class Context:
    sender:              str   = ""
    subject:             str   = ""
    body_snippet:        str   = ""
    thread_depth:        int   = 0
    has_action_items:    bool  = False
    recommended_reply_all: bool = False
    escalation_triggered: bool = False

    def to_dict(self) -> dict:
        return asdict(self)


@dataclass
class ResponseSlot:
    body:            str   = ""
    tone:            str   = ""
    auto_sent:       bool  = False
    intent_confidence: float = 0.0
    grammar_score:   float = 0.0
    reply_all_set:   bool  = False
    model_version:   str   = ""

    def to_dict(self) -> dict:
        return asdict(self)


# ─── Core types ─────────────────────────────────────────────────────────

@dataclass
class PreferencePair:
    """One binary comparison between two LLM responses for the same email."""
    pair_id:          str        = ""
    run_id:           str        = ""
    email_id:         str        = ""
    intent_label:     str        = ""
    intent_confidence: float     = 0.0
    context:          Context    = field(default_factory=Context)
    response_a:       ResponseSlot = field(default_factory=ResponseSlot)
    response_b:       ResponseSlot = field(default_factory=ResponseSlot)
    label:            str        = "tie"       # prefer_a | prefer_b | tie | bad_both
    labeler:          str        = "auto_bootstrap"  # human | llm_judge | auto_bootstrap
    reward_signals:   RewardSignals = field(default_factory=RewardSignals)
    metadata:         dict       = field(default_factory=dict)

    def to_dict(self) -> dict:
        return {
            "pair_id":       self.pair_id,
            "run_id":        self.run_id,
            "email_id":      self.email_id,
            "intent_label":  self.intent_label,
            "intent_confidence": self.intent_confidence,
            "context":       self.context.to_dict(),
            "response_a":    self.response_a.to_dict(),
            "response_b":    self.response_b.to_dict(),
            "label":         self.label,
            "labeler":       self.labeler,
            "reward_signals":self.reward_signals.to_dict(),
            "metadata":      self.metadata,
        }

    @classmethod
    def from_dict(cls, d: dict) -> "PreferencePair":
        ctx = d.pop("context",  {})
        rsp_a = d.pop("response_a", {})
        rsp_b = d.pop("response_b", {})
        rs    = d.pop("reward_signals", {})
        notes = d.pop("rlhf_notes", None)        # free-form notes → metadata only
        md    = d.pop("metadata", {})             # pull metadata field explicitly
        if notes:
            md.setdefault("rlhf_notes", notes)
        d["context"]        = Context(**ctx)
        d["response_a"]     = ResponseSlot(**rsp_a)
        d["response_b"]     = ResponseSlot(**rsp_b)
        d["reward_signals"] = RewardSignals(**rs)
        d["metadata"]       = md
        return cls(**d)

    @classmethod
    def from_jsonl(cls, path: str | Path) -> list["PreferencePair"]:
        pairs = []
        with open(path) as f:
            for line in f:
                line = line.strip()
                if line:
                    pairs.append(cls.from_dict(json.loads(line)))
        return pairs


@dataclass
class RLHFRunQuality:
    high_confidence_auto_sent:       int = 0
    low_confidence_auto_sent:        int = 0   # potential false positive
    high_confidence_escalated:       int = 0   # correct refusal — potential correct positive
    low_confidence_escalated:        int = 0
    reply_all_correct:                int = 0
    reply_all_violation_count:        int = 0
    action_item_missed_count:         int = 0
    tone_mismatch_count:              int = 0
    human_overrides:                  int = 0


@dataclass
class RLHFRunRecord:
    """One complete V26/V4x run snapshot with RLHF-relevant signals."""
    record_id:                str             = ""
    run_id:                   str             = ""
    v_stage:                  str             = ""
    started_at:               str             = ""
    completed_at:             str             = ""
    mode:                     str             = "dry_run"
    emails_processed:         int             = 0
    auto_sent_count:          int             = 0
    escalated_count:          int             = 0
    reply_all_count:          int             = 0
    avg_intent_confidence:    float           = 0.0
    avg_grammar_score:        float           = 0.0
    avg_combined_reward:      float           = 0.0
    flagged_count:            int             = 0
    preference_pairs:         int             = 0
    reward_model_version:     str             = "rlhf-v1.0"
    run_artifacts_path:       str             = ""
    quality:                  RLHFRunQuality  = field(default_factory=RLHFRunQuality)
    rlhf_gaps_detected:       list[dict]      = field(default_factory=list)
    metadata:                 dict            = field(default_factory=dict)

    def to_dict(self) -> dict:
        q = self.quality
        return {
            "record_id":             self.record_id,
            "run_id":                self.run_id,
            "v_stage":               self.v_stage,
            "started_at":            self.started_at,
            "completed_at":          self.completed_at,
            "mode":                  self.mode,
            "emails_processed":      self.emails_processed,
            "auto_sent_count":       self.auto_sent_count,
            "escalated_count":       self.escalated_count,
            "reply_all_count":       self.reply_all_count,
            "avg_intent_confidence": self.avg_intent_confidence,
            "avg_grammar_score":     self.avg_grammar_score,
            "avg_combined_reward":   self.avg_combined_reward,
            "flagged_count":         self.flagged_count,
            "preference_pairs":      self.preference_pairs,
            "reward_model_version":  self.reward_model_version,
            "run_artifacts_path":    self.run_artifacts_path,
            "quality": asdict(q),
            "rlhf_gaps_detected":    self.rlhf_gaps_detected,
            "metadata":              self.metadata,
        }

    @classmethod
    def from_dict(cls, d: dict) -> "RLHFRunRecord":
        q = d.pop("quality", {})
        if isinstance(q, dict):
            q = RLHFRunQuality(**q)
        return cls(quality=q, **d)


@dataclass
class RLHFRunSummary:
    """Aggregated summary across N runs — feeds V41, V45."""
    summary_id:           str             = ""
    v_stage:              str             = ""
    run_ids:              list[str]       = field(default_factory=list)
    total_emails:         int             = 0
    total_pairs:          int             = 0
    positive_outcomes:    int             = 0
    negative_outcomes:    int             = 0
    reply_all_violations: int             = 0
    avg_combined_reward:  float           = 0.0
    reward_trend:         str             = "stable"
    proposed_policy_update: dict | None   = None
    proposed_v41_actions: list[str]      = field(default_factory=list)
    generated_at:         str             = ""

    def to_dict(self) -> dict:
        return asdict(self)
