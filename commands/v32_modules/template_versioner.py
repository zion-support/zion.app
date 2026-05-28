#!/usr/bin/env python3
"""
V32-P3: Template Versioner
Auto-increment template version when response_self_verifier flags it
low-quality >3 times in 48h. Scaffold new variant wording.
"""
import json, re, hashlib
from datetime import datetime, timezone, timedelta
from pathlib import Path

_WORKSPACE = Path(__file__).resolve().parent.parent.parent
DATA = _WORKSPACE / 'data'
_TEMPLATE_DB = DATA / 'template_versions.jsonl'
_TEMPLATE_DIR = _WORKSPACE / 'commands' / 'v30_modules'

def _now(): return datetime.now(timezone.utc).isoformat()
def _hash(text): return hashlib.sha256(text.encode()).hexdigest()[:12]

def log_template_quality(template_id: str, score: float, issues: list = None) -> None:
    entry = {"ts": _now(), "template_id": template_id,
             "score": score, "issues": issues or []}
    try:
        with open(_TEMPLATE_DB, "a") as f:
            f.write(json.dumps(entry, ensure_ascii=False) + "\n")
    except Exception:
        pass

def get_template_history(template_id: str, window_hours: int = 48) -> list:
    if not _TEMPLATE_DB.exists():
        return []
    cutoff = (datetime.now(timezone.utc) - timedelta(hours=window_hours)).isoformat()
    results = []
    try:
        with open(_TEMPLATE_DB) as f:
            for line in f:
                line = line.strip()
                if not line: continue
                try:
                    row = json.loads(line)
                except json.JSONDecodeError:
                    continue
                if row.get("template_id") == template_id and row.get("ts", "") >= cutoff:
                    results.append(row)
    except Exception:
        pass
    return results

def should_bump_version(template_id: str, threshold: float = 70.0, min_flags: int = 3) -> bool:
    history = get_template_history(template_id)
    low_scores = [h for h in history if h.get("score", 100) < threshold]
    return len(low_scores) >= min_flags

def bump_template(template_id: str, new_variant: str = "") -> dict:
    """Increment template version and log the bump event."""
    # Count existing bumps FIRST, then write
    count = 1
    try:
        if _TEMPLATE_DB.exists():
            for l in _TEMPLATE_DB.read_text().splitlines():
                try:
                    row = json.loads(l)
                    if row.get("template_id") == template_id and row.get("event") == "version_bump":
                        count += 1
                except (json.JSONDecodeError, AttributeError):
                    pass
    except Exception:
        pass
    entry = {"ts": _now(), "template_id": template_id,
             "event": "version_bump", "new_variant": new_variant, "version": count}
    try:
        with open(_TEMPLATE_DB, "a") as f:
            f.write(json.dumps(entry) + "\n")
    except Exception:
        pass
    return {"bumped": True, "template_id": template_id, "variant": new_variant, "version": count}

def scaffold_version(template_id: str, base_wording: str = "", tone: str = "professional") -> str:
    """Generate a scaffolded variant wording for a bumped template."""
    if not base_wording:
        return f"[{template_id.upper()}] Please review this updated {tone} response template."
    words = base_wording.split()
    mid = len(words) // 2
    reworded = " ".join(words[:mid]) + " [reframed] " + " ".join(words[mid:])
    return reworded

def get_active_version(template_id: str) -> dict:
    """Return latest version info for template_id."""
    if not _TEMPLATE_DB.exists():
        return {"version": 1, "template_id": template_id}
    try:
        versions = []
        with open(_TEMPLATE_DB) as f:
            for line in f:
                line = line.strip()
                if not line: continue
                try:
                    row = json.loads(line)
                except json.JSONDecodeError:
                    continue
                if row.get("template_id") == template_id and row.get("event") == "version_bump":
                    versions.append(row)
        bump_count = len(versions)
        return {"version": bump_count + 1, "template_id": template_id,
                "last_bump": versions[-1]["ts"] if versions else ""}
    except Exception:
        return {"version": 1, "template_id": template_id}
