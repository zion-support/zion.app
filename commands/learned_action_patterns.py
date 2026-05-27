#!/usr/bin/env python3
from __future__ import annotations

"""
V25 Wave 6b — Learned Action Patterns

After every sent-email outcome (logged by V24/V25), extracts and replays
the best-performing response template for repeat-sender / repeat-intent pairs.

Mechanics:
  • Reads data/response_outcomes.json (V22/V24 log)
  • Groups by (sender_domain, intent) with outcome = positive/neutral
  • Selects the top template by success rate + recency
  • Stores synthesized "best response" in data/learned_action_patterns.json
  • V25 pipeline calls `suggest_best_response()` at template-selection time

Zero external dependencies. File-backed only.
"""

import json, re
from datetime import datetime, timezone
from pathlib import Path
from collections import defaultdict

WORKSPACE      = Path(__file__).resolve().parent.parent
DATA           = WORKSPACE / 'data'
OUTCOMES_FILE  = DATA / 'response_outcomes.json'
PATTERNS_FILE  = DATA / 'learned_action_patterns.json'
_MIN_CONFIDENCE = 0.667  # 2/3 positive confirmations = threshold for pattern trust


def _load_json(path: Path, default):
    try:
        return json.loads(path.read_text())
    except Exception:
        return default


def _save_json(path: Path, data):
    try:
        path.write_text(json.dumps(data, indent=2, ensure_ascii=False))
    except Exception:
        pass


class LearnedActionPatterns:
    """Replay best-response template for (domain, intent) combos."""

    def __init__(self):
        self.outcomes = _load_json(OUTCOMES_FILE, {})
        self.patterns: dict = _load_json(PATTERNS_FILE, {})
        self._last_refresh: datetime | None = None

    def suggest_best_response(self, sender: str, intent: str,
                               language: str = 'en') -> dict | None:
        """Return best-known template for this (domain, intent), or None."""
        domain = sender.split('@')[-1].lower() if '@' in sender else ''
        if not domain:
            return None

        pattern = self._get_pattern(domain, intent)
        if not pattern:
            return None

        conf = pattern.get('confidence', 0)
        if conf < _MIN_CONFIDENCE:
            return None

        return {
            "template_key":    pattern.get("template_key", "general"),
            "confidence":      conf,
            "sample_count":    pattern.get("sample_count", 0),
            "last_used":       pattern.get("last_used", ""),
            "body_opening":    pattern.get("body_opening", ""),
            "language":        language,
            "source":          "learned_action_patterns",
        }

    def record_outcome(self, sender: str, intent: str,
                        response_body: str, outcome: str,
                        template_key: str = 'general'):
        """Log a new outcome and refresh patterns."""
        domain = sender.split('@')[-1].lower() if '@' in sender else ''
        if not domain:
            return

        key = f"{domain}::{intent}"
        outcomes = self.outcomes.setdefault(domain, [])
        outcomes.append({
            "intent":         intent,
            "outcome":        outcome,
            "template_key":   template_key,
            "response_body":  response_body[:500],
            "ts":             datetime.now(timezone.utc).isoformat(),
        })
        self.outcomes[domain] = outcomes[-200:]   # keep last 200 per domain
        _save_json(OUTCOMES_FILE, self.outcomes)
        self._refresh(domain, intent)

    def _get_pattern(self, domain: str, intent: str) -> dict | None:
        key = f"{domain}::{intent}"
        if key in self.patterns:
            return self.patterns[key]
        self._refresh(domain, intent)
        return self.patterns.get(key)

    def _refresh(self, domain: str, intent: str):
        """Rebuild patterns for a domain from outcomes log."""
        now = datetime.now(timezone.utc)
        if self._last_refresh and (now - self._last_refresh).total_seconds() < 60:
            return  # throttle: only rebuild once per minute
        self._last_refresh = now

        outcomes = [o for o in self.outcomes.get(domain, [])
                    if o.get('intent') == intent]
        if len(outcomes) < 2:
            return

        wins = [o for o in outcomes if o.get('outcome') in ('positive', 'neutral')]
        if not wins:
            return

        success_rate = len(wins) / max(len(outcomes), 1)
        if success_rate < _MIN_CONFIDENCE:
            return

        # Pick the most recent good response as the template
        best = sorted(wins, key=lambda o: o.get('ts', ''), reverse=True)[0]
        body = best.get('response_body', '')

        # Extract opening sentence as the pattern key
        opening = self._extract_opening(body)

        key = f"{domain}::{intent}"
        self.patterns[key] = {
            "domain":         domain,
            "intent":         intent,
            "confidence":     round(success_rate, 2),
            "sample_count":   len(outcomes),
            "wins":           len(wins),
            "last_used":      best.get('ts', ''),
            "template_key":   best.get('template_key', 'general'),
            "body_opening":   opening,
            "last_outcome":   outcomes[-1].get('outcome', ''),
            "updated":        now.isoformat(),
        }
        _save_json(PATTERNS_FILE, self.patterns)

    @staticmethod
    def _extract_opening(body: str) -> str:
        """First non-empty sentence (up to 120 chars)."""
        for sent in re.split(r'[.!?!。\n]+', body):
            s = sent.strip()
            if len(s) > 10:
                return s[:120]
        return body[:120] if body else ""


# ── CLI self-test ──────────────────────────────────────────────────
if __name__ == '__main__':
    print("=== V25 Wave 6b — Learned Action Patterns ===\n")
    lap = LearnedActionPatterns()
    # Simulate building a pattern
    lap.record_outcome("alice@repeatclient.com", "support",
                        "Hi Alice! I've investigated the login issue and it's fixed now. The problem was an expired session token — please try logging in again. Let me know if it persists! — Kleber, Zion Tech Group",
                        outcome="positive", template_key="support_issue")
    lap.record_outcome("alice@repeatclient.com", "support",
                        "Hi Alice! Looking into your login problem now. Give me a few minutes and I'll update you. — Kleber",
                        outcome="positive", template_key="support_issue")
    result = lap.suggest_best_response("alice@repeatclient.com", "support", "en")
    if result:
        print(f"  [✓] Pattern found for alice@repeatclient.com / support")
        print(f"      confidence={result['confidence']:.0%}  template={result['template_key']}")
        print(f"      opening: {result['body_opening'][:80]}...")
    else:
        print("  [✗] No pattern (expected < 70% after only 2 samples)")
    print("\n=== Self-test complete ===")
