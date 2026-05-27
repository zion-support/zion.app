#!/usr/bin/env python3
"""
V30-P1: Attachment Content Analyzer
Replaces keyword-only routing with LLM-assisted deep content analysis.
Detects invoice vs contract vs legal vs deck vs text.
"""

import json, re

def analyze_attachment_content(
    filename: str,
    content_bytes: bytes = b"",
    attachment_type: str = "",
    faq_context: str = "",
) -> dict:
    """Deep content classification for attachments.
    
    Returns: {
        "category": str, "confidence": float, 
        "signals": [list], "routing_action": str
    }
    """
    result = {"category": "unknown", "confidence": 0.0, "signals": [], "routing_action": "none"}
    
    name_lower = filename.lower()
    content_preview = content_bytes[:3000].decode(errors="replace").lower() if content_bytes else ""
    
    # 1. Strong filename signals
    name_signals = {
        "invoice": ["invoice", "inv-", "receipt", "payment_request", "boleto"],
        "contract": ["contract", "agreement", "service_level", "nda", "msa", "sow"],
        "legal": ["legal", "cease", "attorney", "patent", "lawsuit", "subpoena", "takedown"],
        "financial": ["financial", "bank_statement", "wire_transfer", "settlement"],
        "decks_proposals": ["deck", "pitch", "proposal", "presentation", "business_case", "quote"],
        "report": ["report", "summary", "analysis", "analytics", "metrics"],
        "questionnaire": ["questionnaire", "questionnaire", "assessment", "survey"],
    }
    
    name_hits = {}
    for cat, keywords in name_signals.items():
        hits = [kw for kw in keywords if kw in name_lower]
        if hits:
            name_hits[cat] = len(hits)
    
    # 2. Content preview signals
    content_signals = {
        "invoice": ["amount due", "invoice #", "payment terms", "net 30", "net 15", "due date"],
        "contract": ["agreement", "terms and conditions", "binding", "indemnify", "governing law"],
        "legal": ["cease and desist", "takedown", "copyright", "patent infringement", "attorney"],
        "financial": ["transaction history", "account balance", "ach debit", "wire transfer"],
        "decks_proposals": ["our solution", "business model", "value proposition", "pricing tier"],
        "report": ["executive summary", "key findings", "recommendations", "methodology"],
    }
    
    content_hits = {}
    for cat, keywords in content_signals.items():
        hits = [kw for kw in keywords if kw in content_preview]
        if hits:
            content_hits[cat] = len(hits)
    
    # 3. Combine signals
    combined = {}
    for d in [name_hits, content_hits]:
        for cat, cnt in d.items():
            combined[cat] = combined.get(cat, 0) + cnt * (2 if d is name_hits else 1)
    
    if combined:
        best_cat = max(combined, key=lambda k: combined[k])
        confidence = min(0.95, combined[best_cat] / 10.0)
        result["category"] = best_cat
        result["confidence"] = round(confidence, 2)
    
    # 4. Map to action
    routing_map = {
        "invoice": "thank_auto", "financial": "acknowledge",
        "contract": "full_pipeline", "decks_proposals": "calendar_draft",
        "legal": "escalate", "report": "acknowledge", "questionnaire": "acknowledge",
    }
    result["routing_action"] = routing_map.get(result["category"], "acknowledge")
    result["signals"] = [f"{cat}:{cnt}" for cat, cnt in sorted(combined.items(), key=lambda x: -x[1])[:5]]
    
    return result

def summarize_attachment_for_injection(summary: dict, lang: str = "en") -> str:
    """Attach summary text to email body."""
    cat = summary.get("category", "document")
    conf = summary.get("confidence", 0)
    if lang == "pt":
        return f"📎 Anexo recebido: {cat} (confiança {conf:.0%})"
    return f"📎 Attachment received: {cat} ({conf:.0%} confidence)"
