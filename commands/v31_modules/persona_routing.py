#!/usr/bin/env python3
"""
V31-P5: Persona Routing
Map contact addresses to roles (executive, legal, delivery, agency).
Route CC lists per intent: urgent → executive, agency;
support → delivery; financial → finance.
"""
import json
from pathlib import Path

_WORKSPACE = Path(__file__).resolve().parent.parent.parent
DATA = _WORKSPACE / 'data'
_PERSONA_DB = DATA / 'persona_map.json'

# Default persona → intent routing rules
_INTENT_PERSONA_MAP = {
    "urgent":         ["executive", "agency"],
    "support_issue":  ["delivery"],
    "sales_lead":     ["delivery"],
    "financial":      ["finance", "delivery"],
    "meeting":        ["delivery", "executive"],
    "partnership":    ["executive", "agency"],
    "cancellation":   ["delivery"],
    "personal_one2one": [],
}

def load_persona_map(path: str = "") -> dict:
    """Load persona{email: {persona, domain}} map from JSON file."""
    p = Path(path) if path else _PERSONA_DB
    if not p.exists():
        return {}
    try:
        raw = json.loads(p.read_text())
        return {k.lower(): v for k, v in raw.items()}
    except Exception:
        return {}

def save_persona_map(contacts: dict, path: str = "") -> None:
    """Save persona map. contacts = {email: {"persona": "...", "domain": "..."}}."""
    p = Path(path) if path else _PERSONA_DB
    try:
        p.write_text(json.dumps(contacts, indent=2, ensure_ascii=False))
    except Exception:
        pass

def assign_cc_by_persona(
    contacts: dict,
    thread_participants: list,
    intent_label: str = "",
    force_cc: list = None,
) -> list:
    """Build CC list from contacts using persona routing rules.
    
    Priority:
    1. force_cc (always included)
    2. thread_participants matching intent persona roles
    3. thread_participants with no persona match kept as-is (catch-all)
    """
    allowed_personas = {p.lower() for p in _INTENT_PERSONA_MAP.get(intent_label, [])}
    cc = []
    seen = set()

    def add(email):
        e = email.lower().strip()
        if e not in seen and "@" in e:
            seen.add(e); cc.append(e)

    # 1. force
    for e in (force_cc or []):
        add(e)

    # 2. persona-routed participants
    for p in thread_participants:
        p_lower = p.lower()
        info = contacts.get(p_lower, {})
        persona = info.get("persona", "").lower()
        if persona in allowed_personas:
            add(p_lower)

    # 3. unmatched participants (safe catch-all per GRC: agencies always included)
    for p in thread_participants:
        p_lower = p.lower()
        if p_lower not in seen:
            add(p_lower)

    return cc

def add_persona_entry(contacts: dict, email: str, persona: str, domain: str = "") -> dict:
    """Add/update a single persona entry, returns updated contacts."""
    email_lower = email.lower().strip()
    contacts[email_lower] = {
        "persona": persona.lower(),
        "domain": domain or email_lower.split("@")[-1] if "@" in email_lower else "",
    }
    return contacts

def get_cc_for_intent(contacts: dict, intent_label: str) -> list:
    """Return persona list for an intent (no thread_participants needed)."""
    return _INTENT_PERSONA_MAP.get(intent_label, [])
