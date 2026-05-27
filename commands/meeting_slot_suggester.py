#!/usr/bin/env python3
"""
V30-P3: Meeting Slot Suggester
Calendar → propose 2-3 concrete slots in reply instead of just showing availability.
"""

import re

_SLOT_TEMPLATES = {
    "pt": [
        "📅 Sugestões de horário",
        "Esta semana: {slots}",
        "Ou posso me adaptar ao seu horário.",
        "",
        "— Kleber, Zion Tech Group",
    ],
    "en": [
        "📅 Suggested slots",
        "This week: {slots}",
        "Or I can work around your schedule.",
        "",
        "— Kleber, Zion Tech Group",
    ],
}

_DAY_NAMES_PT = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sab", "Dom"]
_DAY_NAMES_EN = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

def suggest_slots(
    raw_availability: list,
    sender_name: str = "",
    sender_domain: str = "",
    lang: str = "en",
    max_slots: int = 3,
) -> str:
    """Generate concrete 2-3 slot suggestions from availability data.
    
    raw_availability: [{"day": "Monday", "slots": ["2pm", "3pm"], "date": "2026-06-02"}, ...]
    Returns formatted bout text with slot suggestions.
    """
    if not raw_availability:
        return ""
    
    tmpl = _SLOT_TEMPLATES.get(lang, _SLOT_TEMPLATES["en"])
    day_names = _DAY_NAMES_PT if lang == "pt" else _DAY_NAMES_EN
    
    slots_text = []
    count = 0
    
    for slot_entry in raw_availability[:max_slots]:
        day = slot_entry.get("day", slot_entry.get("date", "?"))
        times = slot_entry.get("slots", [])
        if not times:
            continue
        time_str = ", ".join(times[:2])
        if lang == "pt":
            slots_text.append(f"  • {day}: {time_str}")
        else:
            slots_text.append(f"  • {day}: {time_str}")
        count += 1
    
    if count == 0:
        # Concierge fallback
        if lang == "pt":
            return ("📅 Minha agenda está um pouco cheia essa semana, "
                    "mas podemos encontrar um horário. "
                    "Me envie sua disponibilidade e eu ajusto.")
        return ("📅 My schedule is a bit tight this week, "
                "but we can find a time. "
                "Send me your availability and I'll adjust.")
    
    filled = "\n".join(slot_text for slot_text, _ in 
                       zip(slots_text, range(count)))  # just slots_text actually
    result_lines = []
    for line in tmpl:
        if "{slots}" in line:
            result_lines.append(line.replace("{slots}", "\n".join(slots_text)))
        elif line:
            result_lines.append(line)
    
    return "\n".join(result_lines)

def parse_availability_lines(raw_lines: list[str], lang: str = "en") -> list:
    """Parse plain-text availability lines from google_workspace module."""
    results = []
    for line in raw_lines[:3]:
        line = line.strip().strip("• ").strip()
        if line:
            results.append({"slots": [line]})
    return results
