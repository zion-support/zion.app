#!/usr/bin/env python3
"""
V38-B: ACGroup + DC Schema Lock

Pre-write validation guard for ACGroup (ac_group_id + country) and DC
(dc_id + country + enabled).  Blocks any write path that is missing
required keys; emits a structured ACGroupDCSchemaLock Event so ops can triage.
"""
from __future__ import annotations
import json
from dataclasses import dataclass, field, asdict
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple, Union

# ── schema definitions ───────────────────────────────────────────────────────
REQUIRED_AC = {"ac_group_id", "country"}
REQUIRED_DC = {"dc_id", "country", "enabled"}

ALLOWED_EXTRA_AC = {
    "billing_scope", "account_tag", "priority", "max_monthly_budget",
    "allow_sub_bill", "notes"
}
ALLOWED_EXTRA_DC = {
    "dc_name", "ip_ranges", "dedicated_ip", "esp_verified",
    "billing_tag", "notes"
}

DEFAULT_AC = {"priority": 0, "max_monthly_budget": None, "allow_sub_bill": False, "notes": ""}
DEFAULT_DC = {"enabled": True, "ip_ranges": [], "esp_verified": False, "billing_tag": "", "notes": ""}

ACGROUP_DEFAULTS = {**DEFAULT_AC}
DC_DEFAULTS = {**DEFAULT_DC}


# ── Event dataclass (mutable for log records) ────────────────────────────────
@dataclass
class ACGroupDCSchemaLockEvent:
    """Structured event emitted on schema lock violation."""
    ts: str = field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    gate: str = "acgroup_dc_schema_lock"
    action: str = ""            # validated | rejected
    typ: str = ""               # acgroup | dc
    missing_keys: List[str] = field(default_factory=list)
    unexpected_keys: List[str] = field(default_factory=list)
    details: str = ""

    def to_dict(self) -> dict:
        return asdict(self)


# ── Validator ───────────────────────────────────────────────────────────────
def validate_entity(
    entity: Dict[str, Any],
    expected_type: str
) -> Tuple[bool, Union[Dict[str, Any], ACGroupDCSchemaLockEvent]]:
    """
    Validate one entity against its schema.

    Returns (ok, result).
      ok=True  → result is the validated entity dict (defaults injected).
      ok=False → result is ACGroupDCSchemaLockEvent (caller must NOT write).
    """
    if expected_type == "acgroup":
        required = REQUIRED_AC
        allowed_extra = ALLOWED_EXTRA_AC
        defaults = ACGROUP_DEFAULTS
    elif expected_type == "dc":
        required = REQUIRED_DC
        allowed_extra = ALLOWED_EXTRA_DC
        defaults = DC_DEFAULTS
    else:
        return False, ACGroupDCSchemaLockEvent(
            action="rejected", typ="unknown",
            missing_keys=[], unexpected_keys=[],
            details=f"bad type: {expected_type}")

    entity = dict(entity)

    missing = [k for k in required if k not in entity]
    if missing:
        return False, ACGroupDCSchemaLockEvent(
            action="rejected", typ=expected_type,
            missing_keys=missing, unexpected_keys=[],
            details=f"missing required keys: {missing}")

    unexpected = [k for k in entity
                  if k not in required and k not in allowed_extra and k not in defaults]
    if unexpected:
        return False, ACGroupDCSchemaLockEvent(
            action="rejected", typ=expected_type,
            missing_keys=[], unexpected_keys=unexpected,
            details=f"unexpected keys (not allowed): {unexpected}")

    id_key = "dc_id" if expected_type == "dc" else "ac_group_id"
    if entity.get(id_key) is not None and not str(entity[id_key]).strip():
        return False, ACGroupDCSchemaLockEvent(
            action="rejected", typ=expected_type,
            missing_keys=[id_key], unexpected_keys=[],
            details=f"{id_key} is empty/whitespace")

    if not str(entity.get("country", "")).strip():
        return False, ACGroupDCSchemaLockEvent(
            action="rejected", typ=expected_type,
            missing_keys=["country"], unexpected_keys=[],
            details="country is empty/whitespace")

    for k, v in defaults.items():
        if k not in entity:
            entity[k] = v

    return True, entity


def validate_acgroup(
    ac: Dict[str, Any]
) -> Tuple[bool, Union[Dict[str, Any], ACGroupDCSchemaLockEvent]]:
    ok, result = validate_entity(ac, "acgroup")
    return ok, result


def validate_dc(
    dc: Dict[str, Any]
) -> Tuple[bool, Union[Dict[str, Any], ACGroupDCSchemaLockEvent]]:
    ok, result = validate_entity(dc, "dc")
    return ok, result


# ── Log ──────────────────────────────────────────────────────────────────────
LOG_PATH = Path(__file__).resolve().parent.parent.parent / "data" / "logs" / "acgroup_dc_schema_lock.log"


def _log(event: ACGroupDCSchemaLockEvent) -> None:
    try:
        LOG_PATH.parent.mkdir(parents=True, exist_ok=True)
        LOG_PATH.open("a").write(json.dumps(event.to_dict()) + "\n")
    except Exception:
        pass


# ── Public API ──────────────────────────────────────────────────────────────
class ACGroupDCSchemaLock:
    """
    Schema lock for ACGroup and DC write paths.

    Usage
    -----
    lock = ACGroupDCSchemaLock()
    ok, entity_or_event = lock.validate_acgroup(raw_dict)
    if not ok:
        _log(entity_or_event)   # entity_or_event is an Event
        return                  # skip write

    validated_entity = entity_or_event   # safe to write
    """

    def validate_acgroup(
        self, ac: Dict[str, Any]
    ) -> Tuple[bool, Union[Dict[str, Any], ACGroupDCSchemaLockEvent]]:
        ok, result = validate_entity(ac, "acgroup")
        if not ok:
            _log(result)  # type: ignore[arg-type]
            return False, result
        _log(ACGroupDCSchemaLockEvent(action="validated", typ="acgroup", details="OK"))
        return True, result

    def validate_dc(
        self, dc: Dict[str, Any]
    ) -> Tuple[bool, Union[Dict[str, Any], ACGroupDCSchemaLockEvent]]:
        ok, result = validate_entity(dc, "dc")
        if not ok:
            _log(result)  # type: ignore[arg-type]
            return False, result
        _log(ACGroupDCSchemaLockEvent(action="validated", typ="dc", details="OK"))
        return True, result
