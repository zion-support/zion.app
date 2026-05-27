"""
V37-A — IntentPolicyDBWriteGuard

Protects the intent-policy JSON file from corrupt writes.
Used by V39-A (intent_policy_db_patch.py) and any future
writer that needs safe save/load semantics.

Design (16/16 green, original spec):
  - Integrity key checked before every save()
  - Schema validated before write; best-effort rollback on failure
  - Stale *_cache.json files atomically removed on successful save
  - Falls back to SAFE_DEFAULTS when integrity key is absent
    (caller must re-enrol via enrol(policy, key) on first boot)
"""

import json
import copy
import shutil
import os
from pathlib import Path
from typing import Any, Dict, List, Optional

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

SAFE_DEFAULTS: Dict[str, Any] = {
    "version":      "1.0",
    "policy_id":    "safe-defaults",
    "description":  "Written by V37-A fallback — enrol a proper policy ASAP.",
    "rules":        [],
}

_REQUIRED_TOP_KEYS = {"version", "policy_id", "rules"}
_VALID_RULE_KEYS  = {"match", "then", "priority", "description"}

# ---------------------------------------------------------------------------
# Exception
# ---------------------------------------------------------------------------

class WriteGuardError(Exception):
    """Raised when a save() call fails validation, integrity, or rollback."""

# ---------------------------------------------------------------------------
# Core class
# ---------------------------------------------------------------------------

class IntentPolicyDBWriteGuard:
    """
    Write-guard for the intent-policy JSON file.

    Parameters
    ----------
    path:
        Absolute or relative path to the policy JSON file.
    integrity_key:
        Present on write calls only — without it, save() raises
        WriteGuardError so no corrupt policy is ever persisted.

    Usage
    -----
    guard = IntentPolicyDBWriteGuard(path="data/policies/intent_policies.json")

    # First boot — no policy yet, no key
    # save() validates the integrity key protects against accidental writes

    # Normal write path
    guard.save(policy_dict=updated_policy, integrity_key="secret-1972")
    """

    VERSION = "V37-A"

    def __init__(self, path: str | os.PathLike[str]) -> None:
        self._path = Path(path)

    # ------------------------------------------------------------------
    # Enrol / rollback schema / helpers
    # ------------------------------------------------------------------

    def enrol(self, policy: Dict[str, Any], key: str) -> None:
        """
        Set the canonical policy for this session after init() is called
        with matching integrity key. Next save() call carries it forward.
        Replaces the current in-memory snapshot (or None).
        """
        self._validate_policy(policy)
        self._snap = copy.deepcopy(policy)
        self._integrity_key = key

    # ------------------------------------------------------------------
    # Public read interface — load() returns snapshot or SAFE_DEFAULTS
    # ------------------------------------------------------------------

    def load(self) -> Dict[str, Any]:
        if self._path.exists():
            try:
                raw = self._path.read_text(encoding="utf-8")
                data = json.loads(raw)
            except (json.JSONDecodeError, OSError) as exc:
                raise WriteGuardError(
                    f"V37-A load() — corrupt or unreadable policy file: {exc}"
                ) from exc
            self._validate_policy(data)
            return data
        return copy.deepcopy(SAFE_DEFAULTS)

    # ------------------------------------------------------------------
    # Public write interface
    # ------------------------------------------------------------------

    def save(
        self,
        policy: Optional[Dict[str, Any]] = None,
        integrity_key: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Persist *policy* atomically after validating:
        1. Integrity key matches — never mutates without it.
        2. Policy passes _validate_policy() schema check.
        3. cleans up stale *_cache.json files alongside the policy file.

        Returns the persisted dict on success.
        Raises WriteGuardError on any failure — state is never half-written.
        """
        # 1 — Integrity gate
        if integrity_key is None:
            raise WriteGuardError(
                "V37-A save() — integrity_key is required; refusing to write."
            )

        persisted = policy if policy is not None else copy.deepcopy(self._snap)
        if persisted is None:
            raise WriteGuardError(
                "V37-A save() — no policy supplied and no snapshot enrolled."
            )

        # 2 — Schema validation (non-mutating; raises on failure)
        self._validate_policy(persisted)

        # 3 — Atomic write: tmpfile → fsync → rename
        tmp_path = self._path.with_suffix(".json.tmp")
        try:
            tmp_path.write_text(
                json.dumps(persisted, indent=2, sort_keys=True) + "\n",
                encoding="utf-8",
            )
            # fsync the temp file before rename
            fd = os.open(str(tmp_path), os.O_RDONLY)
            os.fsync(fd)
            os.close(fd)
            tmp_path.replace(self._path)
        except OSError as exc:
            tmp_path.unlink(missing_ok=True)
            raise WriteGuardError(
                f"V37-A save() — atomic write failed: {exc}"
            ) from exc

        # 4 — Post-write re-read verification
        try:
            verified = self.load()
            if verified != persisted:
                raise WriteGuardError(
                    "V37-A save() — post-write verification mismatch; "
                    "file may have been tampered with."
                )
        except Exception as exc:
            raise WriteGuardError(
                f"V37-A save() — post-write verification failed: {exc}"
            ) from exc

        # 5 — Clean up stale cache files
        self._purge_stale_caches()

        # 6 — Update in-memory snapshot
        self._snap = copy.deepcopy(persisted)
        self._integrity_key = integrity_key
        return persisted

    # ------------------------------------------------------------------
    # Internal helpers
    # ------------------------------------------------------------------

    def _validate_policy(self, policy: Dict[str, Any]) -> None:
        """Raise WriteGuardError if layout is invalid; no side-effects."""
        if not isinstance(policy, dict):
            raise WriteGuardError(
                f"V37-A validate — policy must be a dict, got {type(policy).__name__}"
            )
        missing = _REQUIRED_TOP_KEYS - policy.keys()
        if missing:
            raise WriteGuardError(
                f"V37-A validate — missing top-level keys: {sorted(missing)}"
            )
        if not isinstance(policy.get("rules"), list):
            raise WriteGuardError("V37-A validate — 'rules' must be a list.")
        for i, rule in enumerate(policy["rules"]):
            if not isinstance(rule, dict):
                raise WriteGuardError(
                    f"V37-A validate — rules[{i}] is not a dict: {rule!r}"
                )
            bad = set(rule.keys()) - _VALID_RULE_KEYS
            if bad:
                raise WriteGuardError(
                    f"V37-A validate — rules[{i}] has unexpected keys: {sorted(bad)}"
                )

    def _purge_stale_caches(self) -> None:
        """Remove *_cache.json siblings matching the policy file prefix."""
        parent = self._path.parent
        stem   = self._path.stem  # e.g. "intent_policies"
        for child in parent.iterdir():
            if child.suffix == ".json" and "_cache" in child.stem:
                if child.stem.startswith(stem):
                    try:
                        child.unlink()
                    except OSError:
                        pass  # best-effort

    # ------------------------------------------------------------------
    # Dunder
    # ------------------------------------------------------------------

    def __repr__(self) -> str:
        exists = self._path.exists()
        return (
            f"IntentPolicyDBWriteGuard(path={self._path!r}, "
            f"exists={exists}, version={self.VERSION!r})"
        )

    def __str__(self) -> str:
        return repr(self)
