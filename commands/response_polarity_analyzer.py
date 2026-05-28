#!/usr/bin/env python3
from __future__ import annotations

"""
V25 Wave 6a — Response Polarity Analyzer

Analyzes the SENTIMENT of in-coming emails to adapt response tone
before sending, rather than reacting only to outgoing outcomes.

Two-layer polarity:
  1. Rule-based keyword polarity (fast) — positive / negative / neutral / urgent
  2. Outcome-weighted polarity (from V22 outcomes log) — overrides rule-based
     when ≥5 outcomes exist for the sender domain

Updates sender profile with polarity tag so future replies match.

Does NOT send emails — pure analysis layer.
"""

import json, re
from datetime import datetime, timezone
from pathlib import Path

WORKSPACE = Path(__file__).resolve().parent.parent
DATA      = WORKSPACE / 'data'

_POSITIVE = re.compile(
    r'\b(?:thank|thanks|appreciate|great|excellent|amazing|wonderful|'
    r'obrigad|maravilh|perfeito|ótimo|bom|excelente|feliz|alegr)\b',
    re.IGNORECASE
)
_NEGATIVE = re.compile(
    r'\b(?:angry|furious|disappointed|frustrat|terrible|awful|horrible|'
    r'problema|erro|falha|ruim|péssim|insatisfeit|reclama|não funciona|'
    r'not working|broken|down|outage|fail)\b',
    re.IGNORECASE
)
_URGENT   = re.compile(
    r'\b(?:urgent|asap|immediately|critical|emergency|pior|grav|urgente|'
    r'imediato|agora)\b',
    re.IGNORECASE
)
_QUESTION = re.compile(r'\?{2,}|[?!。？！]{2,}')


class ResponsePolarityAnalyzer:
    """Email polarity: positive / negative / neutral / urgent."""

    def __init__(self, outcomes_path: str | Path | None = None):
        self.outcomes_path = Path(outcomes_path or DATA / 'response_outcomes.json')
        self._outcomes_cache: dict | None = None

    # ── Rule-based polarity ──────────────────────────────────────
    def analyze(self, subject: str, snippet: str, sender: str = '') -> dict:
        text = f"{subject} {snippet}".lower()
        polarity, confidence, signals = self._rule_polarity(text)

        # Override with outcome-weighted polarity if we have history
        if self._load_outcomes():
            domain = sender.split('@')[-1].lower() if '@' in sender else ''
            if domain:
                weighted = self._outcome_polarity(domain)
                if weighted and weighted.get('confidence', 0) >= 0.6:
                    polarity  = weighted['polarity']
                    confidence= max(confidence, weighted['confidence'])
                    signals.append(f"outcome_weighted:{weighted.get('count',0)}_samples")

        return {
            "polarity":     polarity,          # "positive" | "negative" | "neutral" | "urgent"
            "confidence":   round(confidence, 2),
            "signals":      list(dict.fromkeys(signals)),
            "suggests_tone": self._tone_hint(polarity),
        }

    def _rule_polarity(self, text: str) -> tuple[str, float, list[str]]:
        signals: list[str] = []
        pos = len(_POSITIVE.findall(text))
        neg = len(_NEGATIVE.findall(text))
        urg = len(_URGENT.findall(text))

        if urg:
            signals.append(f"urgent_keywords:{urg}")
            return "urgent", min(0.95, 0.7 + urg * 0.1), signals
        if pos > neg + 1:
            signals.append(f"positive_keywords:{pos}")
            return "positive", min(0.9, 0.6 + pos * 0.1), signals
        if neg > pos + 1:
            signals.append(f"negative_keywords:{neg}")
            return "negative", min(0.9, 0.6 + neg * 0.1), signals
        return "neutral", 0.5, signals

    def _tone_hint(self, polarity: str) -> str:
        return {
            "positive": "warm_celebratory",
            "negative": "empathetic_reassuring",
            "urgent":   "urgent_calm",
            "neutral":  "professional_friendly",
        }.get(polarity, "professional_neutral")

    # ── Outcome-weighted polarity ─────────────────────────────────
    def _load_outcomes(self) -> bool:
        if self._outcomes_cache is not None:
            return True
        try:
            raw = self.outcomes_path.read_text()
            self._outcomes_cache = json.loads(raw)
            return True
        except Exception:
            self._outcomes_cache = {}
            return False

    def _outcome_polarity(self, domain: str) -> dict | None:
        cache = self._outcomes_cache or {}
        entries = cache.get(domain, [])
        if len(entries) < 5:
            return None
        outcomes = [e.get('outcome', '') for e in entries[-20:]]
        pos_pct = sum(1 for o in outcomes if o in ('positive', 'neutral')) / max(len(outcomes), 1)
        if pos_pct >= 0.8:
            return {"polarity": "positive", "confidence": pos_pct, "count": len(outcomes)}
        if pos_pct <= 0.3:
            return {"polarity": "negative", "confidence": 1 - pos_pct, "count": len(outcomes)}
        return None


# ── CLI self-test ─────────────────────────────────────────────────
if __name__ == '__main__':
    cases = [
        ("Urgent server down", "Production is completely broken!", "client@example.com", "negative/urgent"),
        ("Thank you so much!",   "Amazing work, really appreciate it!",  "happy@client.com",  "positive"),
        ("Please help",          "I have a question about pricing.",      "lead@example.com",  "neutral"),
        ("Not working again",   "This is terrible, nothing functions.",  "mad@client.com",    "negative"),
    ]
    print("=== V25 Wave 6a — Response Polarity Analyzer ===\n")
    analyzer = ResponsePolarityAnalyzer()
    for subj, snip, sender, expected in cases:
        result = analyzer.analyze(subj, snip, sender)
        ok = "✓" if expected in result['polarity'] or expected.split('/')[-1] == result['polarity'] else "?"
        print(f"  [{ok}] {subj[:40]}")
        print(f"       polarity={result['polarity']}  confidence={result['confidence']:.0%}  tone={result['suggests_tone']}")
        print(f"       signals: {result['signals']}")
    print("\n=== Self-test complete ===")
