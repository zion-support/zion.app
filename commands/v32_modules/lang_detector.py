#!/usr/bin/env python3
"""
V32-P4: Language Detector
Detect reply language (en/pt) from subject/body, switch meeting slot
templates accordingly, tag output for analytics.
"""
import json, re
from pathlib import Path

_WORKSPACE = Path(__file__).resolve().parent.parent.parent
DATA = _WORKSPACE / 'data'

_PT_MARKERS = [
    r'\b(por favor|obrigado|obrigada|gostaria|bom dia|boa tarde|boa noite)\b',
    r'\b(caro|caro senhor|atenciosamente|abraco|abraço)\b',
    r'\b(servico|serviço|cliente|fatura|boleto|pagamento)\b',
]
_PT_ACCENTFREE = [
    r"\bola\b", r"\bpreciso\b", r"\bajuda\b",
    r"\bobrigado\b", r"\bobrigada\b",
]
_EN_MARKERS = [
    r'\b(please|thank you|kindly|good morning|sincerely|regards)\b',
    r'\b(dear|service|customer|invoice|payment|schedule)\b',
]

import unicodedata

def detect_lang(text: str, default: str = "en") -> str:
    text = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode("ascii")
    """Detect language: 'en', 'pt', or 'default'."""
    low = text.lower()
    pt_hits = sum(1 for p in _PT_MARKERS if re.search(p, low))
    en_hits = sum(1 for p in _EN_MARKERS if re.search(p, low))
    pt_hits += sum(1 for p in _PT_ACCENTFREE if re.search(p, low))
    if pt_hits > en_hits:
        return "pt"
    if en_hits > pt_hits:
        return "en"
    return default

def switch_reply_lang(current_lang: str, detected: str) -> str:
    """Switch reply language; return 'pt' if detected PT, else 'en'."""
    if detected == "pt":
        return "pt"
    return "en" if current_lang == "pt" else current_lang

def get_meeting_template(lang: str = "en") -> dict:
    """Meeting body template for the given language."""
    if lang == "pt":
        return {
            "slot_header": "📅 Sugestões de horário",
            "this_week": "Esta semana:",
            "flexible": "Ou posso me adaptar ao seu horário.",
            "sign_off": "— Kleber, Zion Tech Group",
        }
    return {
        "slot_header": "📅 Suggested slots",
        "this_week": "This week:",
        "flexible": "Or I can work around your schedule.",
        "sign_off": "— Kleber, Zion Tech Group",
    }

def render_meeting_slots(lang: str, slots: list) -> str:
    """Render meeting slot suggestions in the correct language."""
    t = get_meeting_template(lang)
    slot_lines = [f"  • {s}" for s in slots[:3]]
    return "\n".join([t["slot_header"], t["this_week"],
                      "\n".join(slot_lines), t["flexible"], t["sign_off"]])

def tag_language(email_id: str, detected: str, subject: str = "") -> dict:
    """Log language detection for analytics."""
    entry = {"ts": __import__('datetime').datetime.now(__import__('datetime').timezone.utc).isoformat(),
             "email_id": email_id, "detected_lang": detected,
             "subject_snippet": subject[:60]}
    try:
        _DB = DATA / 'lang_detection_log.jsonl'
        with open(_DB, "a") as f:
            f.write(json.dumps(entry, ensure_ascii=False) + "\n")
    except Exception:
        pass
    return {"tagged": True, "lang": detected}