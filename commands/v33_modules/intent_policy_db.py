#!/usr/bin/env python3
"""
V33-A: IntentPolicyDB — Single source of truth for GRC intent routing.
Policies live in data/policies/intent_policies.json; hot-swap by replacing the file.
"""
import json
from datetime import datetime, timezone
from pathlib import Path
from dataclasses import dataclass, field
from typing import Optional, List, Dict, Any

POLICY_PATH = Path(__file__).resolve().parent.parent.parent / "data" / "policies" / "intent_policies.json"


@dataclass
class PolicyRule:
    priority: int
    match: Dict[str, Any]
    then:   Dict[str, Any]

    def matches(self, sender: str = "", intent_label: str = "", urgency: str = "",
                extras: Optional[Dict] = None) -> bool:
        ex = extras or {}
        domain = sender.split("@")[-1].lower() if "@" in sender else ""

        # Intent-label shortcut: only match if rule explicitly declares match.intent_label
        if "intent_label" in self.match:
            return self.match.get("intent_label", "") == intent_label

        if "sender_domain_in" in self.match:
            if domain not in [d.lower() for d in self.match["sender_domain_in"]]:
                return False
        if self.match.get("dc_domain"):
            dc_domains = ex.get("dc_domains")
            if not dc_domains:
                return False
            if not isinstance(dc_domains, list):
                dc_domains = [dc_domains]
            if domain not in dc_domains:
                return False
        if "non_commissionable" in self.match:
            expected = self.match["non_commissionable"]
            actual   = ex.get("non_commissionable")
            if actual is None or actual != expected:
                return False
        for cond in self.match.get("conditions", []):
            if cond == "is_agency"    and not ex.get("is_agency"):
                return False
            if cond == "esp_verified" and not ex.get("esp_verified"):
                return False
        return True


@dataclass
class PolicyMatch:
    rule: "PolicyRule"
    then: Dict[str, Any]
    matched_on: str = ""


class IntentPolicyDB:
    """GRC-constrained intent policy engine. Load from JSON, match at runtime."""

    def __init__(self, rules=None, version="1.0"):
        self.rules   = rules or []
        self.version = version

    @classmethod
    def load(cls, path="") -> "IntentPolicyDB":
        p = Path(path) if path else POLICY_PATH
        if not p.exists():
            return cls()
        try:
            raw = json.loads(p.read_text())
        except Exception:
            return cls()
        errors = validate_schema(raw)
        if errors:
            return cls()
        parsed = []
        for r in raw.get("rules", []):
            parsed.append(PolicyRule(
                priority=r.get("priority", 99),
                match=r.get("match", {}),
                then=r.get("then", {}),
            ))
        parsed.sort(key=lambda x: x.priority)
        return cls(rules=parsed, version=raw.get("version", "1.0"))

    def match_policy(self, sender: str = "", intent_label: str = "", urgency: str = "",
                     extras=None) -> Optional[PolicyMatch]:
        for rule in self.rules:
            if rule.matches(sender, intent_label, urgency, extras):
                return PolicyMatch(rule=rule, then=dict(rule.then), matched_on=str(rule.match))
        return None

    def lookup_by_intent_only(self, intent_label: str, default=None) -> dict:
        """Label-only lookup for V26-style callers (no sender, no urgency available)."""
        if intent_label == "default":
            return default if isinstance(default, dict) else (default or {})
        for rule in self.rules:
            if rule.matches("", intent_label):
                return dict(rule.then)
        return default if isinstance(default, dict) else (default or {})

class IntentPolicyLookup:
    """Drop-in identity layer: .get(label, default) mimics V26's inline dict."""

    def __init__(self, db):
        self._db = db

    def get(self, label: str, default=None) -> dict:
        """Return then-dict for *label* from the DB, or *default* when unmatched."""
        for rule in self._db.rules:
            if rule.matches("", label):
                return dict(rule.then)
        return default if isinstance(default, dict) else (default or {})


def validate_schema(raw: dict) -> List[str]:
    """Standalone schema validator — used by IntentPolicyDB.load() classmethod."""
    errors = []
    if not isinstance(raw, dict):
        errors.append("root must be a JSON object")
        return errors
    if "version" not in raw:
        errors.append("missing version field")
    if "rules" not in raw or not isinstance(raw.get("rules"), list):
        errors.append("missing or invalid rules array")
        return errors
    seen: set = set()
    for i, rule in enumerate(raw.get("rules", [])):
        if "match" not in rule:
            errors.append(f"rule[{i}]: missing match")
        if "then" not in rule:
            errors.append(f"rule[{i}]: missing then")
        if "priority" not in rule:
            errors.append(f"rule[{i}]: missing priority")
            continue
        p = rule["priority"]
        if not isinstance(p, int) or p < 1:
            errors.append(f"rule[{i}]: priority must be positive int")
        if p in seen:
            errors.append(f"rule[{i}]: duplicate priority {p}")
        seen.add(p)
    return errors
