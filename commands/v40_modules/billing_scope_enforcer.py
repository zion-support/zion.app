#!/usr/bin/env python3
"""V40-A: Billing Scope Enforcer — dcRecord (26-field IRS) → 6-field mapper."""
from __future__ import annotations
import json
from dataclasses import dataclass, field, asdict
from datetime import datetime, timezone
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent.parent
DATA = REPO / "data"
POLICY_PATH = DATA / "policies" / "billing_scope.json"
LOG_PATH    = DATA / "logs"  / "billing_scope_enforcer.log"

# Only these 6 out of V26's 26-field IRS dcRecord are billing-relevant
_BILLING_WHITELIST = frozenset({
    "account_id","invoice_id","billing_scope",
    "policy_version","amount","currency",
})


@dataclass
class BillingScopeEvent:
    ts:        str = field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    gate:      str = "billing_scope"
    account:   str = ""
    scope:     str = ""
    action:    str = ""
    reason:    str = ""
    def to_dict(self) -> dict:
        return asdict(self)


def _log(ev: BillingScopeEvent) -> None:
    try:
        LOG_PATH.parent.mkdir(parents=True, exist_ok=True)
        with LOG_PATH.open("a") as f:
            f.write(json.dumps(ev.to_dict()) + "\n")
    except Exception:
        pass


def load_policy() -> dict:
    d = {"allowed_scopes": ["domestic","international"]}
    try:
        if POLICY_PATH.exists():
            raw = json.loads(POLICY_PATH.read_text())
            if isinstance(raw,dict) and "allowed_scopes" in raw:
                d["allowed_scopes"] = raw["allowed_scopes"]
    except Exception:
        pass
    return d


def extract_billing_fields(dc_record: dict) -> dict:
    """Module-level: return only the 6 billing-relevant keys from IRS dcRecord."""
    if not isinstance(dc_record, dict):
        return {}
    return {k: dc_record[k] for k in _BILLING_WHITELIST if k in dc_record}


class BillingScopeEnforcer:
    def __init__(self) -> None:
        self._policy   = load_policy()["allowed_scopes"]

    def check(self, dc_record: dict|None=None, *, scope: str="") -> dict:
        billing = extract_billing_fields(dc_record or {})
        if not billing:
            ev = BillingScopeEvent(action="pass", scope=scope, reason="no_billing_fields")
            _log(ev)
            return {"blocked": False, "billing_fields": {}}
        if scope and scope not in self._policy:
            ev = BillingScopeEvent(account=str(billing.get("account_id","")),
                                   scope=scope, action="block",
                                   reason=f"scope_not_allowed: {scope}")
            _log(ev)
            return {"blocked": True, "billing_fields": billing, "reason": ev.reason}
        ev = BillingScopeEvent(account=str(billing.get("account_id","")),
                               scope=scope or str(billing.get("billing_scope","")),
                               action="pass")
        _log(ev)
        return {"blocked": False, "billing_fields": billing}


def inject_billing_scope(dc_record: dict|None=None, *, scope: str="") -> dict:
    return _ENFORCER.check(dc_record, scope=scope)


_ENFORCER = BillingScopeEnforcer()
