#!/usr/bin/env python3
"""
V33-A: IntentPolicyDB
Single source of truth for GRC intent routing — no more hardcoded _INTENT_POLICIES dicts.
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
    then: Dict[str, Any]

    def matches(self, sender: str, intent_label: str = "", urgency: str = "",
                extras: Optional[Dict] = None) -> bool:
        ex = extras or {}
        domain = sender.split("@")[-1].lower() if "@" in sender else ""

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
            actual = ex.get("non_commissionable")
            if actual is None:
                return False             # no info → can't confirm this rule
            if actual != expected:
                return False             # value mismatch → reject

        for cond in self.match.get("conditions", []):
            if cond == "is_agency" and not ex.get("is_agency"):
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

    def __init__(self, rules: Optional[List[PolicyRule]] = None, version: str = "1.0"):
        self.rules = rules or []
        self.version = version

    @classmethod
    def load(cls, path: str = "") -> "IntentPolicyDB":
        p = Path(path) if path else POLICY_PATH
        if not p.exists():
            return cls()
        try:
            raw = json.loads(p.read_text())
        except (json.JSONDecodeError, Exception):
            return cls()
        errors = cls.validate_schema(raw)
        if errors:
            return cls()
        rules = []
        for r in raw.get("rules", []):
            rules.append(PolicyRule(
                priority=r.get("priority", 99),
                match=r.get("match", {}),
                then=r.get("then", {})
            ))
        rules.sort(key=lambda x: x.priority)
        return cls(rules=rules, version=raw.get("version", "1.0"))

    def match_policy(self, sender: str, intent_label: str = "", urgency: str = "",
                     extras: Optional[Dict] = None) -> Optional[PolicyMatch]:
        for rule in self.rules:
            if rule.matches(sender, intent_label, urgency, extras):
                return PolicyMatch(rule=rule, then=rule.then, matched_on=str(rule.match))
        return None

    @staticmethod
    def validate_schema(raw: dict) -> List[str]:
        errors = []
        if not isinstance(raw, dict):
            errors.append("root must be a JSON object")
            return errors
        if "version" not in raw:
            errors.append("missing version field")
        if "rules" not in raw or not isinstance(raw.get("rules"), list):
            errors.append("missing or invalid rules array")
            return errors
        seen = set()
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
