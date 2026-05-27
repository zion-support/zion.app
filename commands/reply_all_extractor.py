#!/usr/bin/env python3
"""
V30-P0: Reply-All CC Extractor
Extract real email addresses from thread participants and Gmail headers.
Replaces black-box from_email_data()/always_cc() with transparent participant map.
"""

import json, re

def extract_thread_cc(email: dict, thread_participants: list = None) -> dict:
    """Extract CC list from thread participants and headers.
    
    Priority:
    1. thread_participants (from Gmail History API or message headers)
    2. email['cc'] field (original CC)
    3. email['to'] field minus sender (others in original thread)
    4. contacts lookup (person lookup from sender domain)
    
    Returns:
        {"use_cc": str, "extracted_from": str, "confidence": float}
    """
    result = {"use_cc": "", "extracted_from": "", "confidence": 0.0}
    
    # ── 1. Thread participants from memory bank or Gmail ──────────────────
    if thread_participants:
        emails = []
        for p in thread_participants:
            if re.match(r'^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$', str(p)):
                emails.append(str(p).strip())
        if emails:
            result["use_cc"] = ", ".join(emails[:5])
            result["extracted_from"] = "thread_participants"
            result["confidence"] = 0.95
            return result
    
    # ── 2. Original CC field ───────────────────────────────────────────────
    cc_field = email.get("cc", "").strip()
    if cc_field:
        valid_cc = [e.strip() for e in cc_field.split(",") 
                    if re.match(r'^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$', e.strip())]
        if valid_cc:
            result["use_cc"] = ", ".join(valid_cc[:5])
            result["extracted_from"] = "original_cc"
            result["confidence"] = 0.90
            return result
    
    # ── 3. To field minus self ────────────────────────────────────────────
    to_emails = email.get("to", "").split(",")
    sender = email.get("sender", "").strip()
    sender_name = sender.split("<")[-1].rstrip(">") if "<" in sender else sender
    others = []
    for addr in to_emails:
        addr = addr.strip()
        if addr and addr != sender_name:
            if re.match(r'^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$', addr):
                others.append(addr)
    if others:
        result["use_cc"] = ", ".join(others[:3])
        result["extracted_from"] = "to_others"
        result["confidence"] = 0.70
        return result
    
    return result

def validate_cc_addresses(cc_str: str) -> dict:
    """Validate all CC addresses are real emails. Fail-closed."""
    if not cc_str.strip():
        return {"valid": True, "emails": [], "invalid": []}
    
    addr_re = re.compile(r'^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
    emails = [e.strip() for e in cc_str.split(",") if e.strip()]
    valid = [e for e in emails if addr_re.match(e)]
    invalid = [e for e in emails if not addr_re.match(e)]
    
    return {
        "valid": len(invalid) == 0,
        "emails": valid,
        "invalid": invalid,
        "confidence": len(valid) / max(len(emails), 1),
    }
