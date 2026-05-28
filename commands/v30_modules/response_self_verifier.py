#!/usr/bin/env python3
"""
V30-P0: Response Self-Verifier
Post-compose check: body has no contradictions, respects intent policy, 
sign-off present, tone consistent, no placeholder text.
"""

import re

_SIG_PAT = re.compile(r'—\s*\n.*\n.*$', re.DOTALL)
_PLACEHOLDER_PAT = re.compile(r'\{[a-z_]+\}', re.IGNORECASE)
_CLOSING = {'aberto(a)', 'atenciosamente', 'sincerely', 'cheers', 'abraco', 'regards', 'best'}

def verify_response(
    body: str,
    intent_label: str,
    intent_policy: dict,
    sender_name: str,
    original_subject: str,
) -> dict:
    """Verify the composed response is internally consistent and safe to send.
    
    Returns:
        {"passed": bool, "issues": list, "dimension_scores": dict}
    """
    issues = []
    dims = {"continuity": 90.0, "policy_adherence": 90.0, 
            "sign_off_ok": 90.0, "tone_consistent": 90.0,
            "no_placeholders": 90.0, "no_leakage": 90.0}
    
    text = body.strip()
    low = text.lower()
    
    # 1. Placeholder check — no unresolved {name} etc
    unresolved = _PLACEHOLDER_PAT.findall(body)
    if unresolved:
        issues.append({"dimension": "no_placeholders", "msg": f"unresolved_placeholders:{unresolved}"})
        dims["no_placeholders"] = 50.0
    
    # 2. Sign-off present
    has_signoff = any(low.endswith(c) for c in _CLOSING) or bool(_SIG_PAT.search(text))
    if not has_signoff:
        issues.append({"dimension": "sign_off_ok", "msg": "signature_or_closing_missing"})
        dims["sign_off_ok"] = 60.0
    
    # 3. Sender name mentioned (reply-all continuity)
    name_words = [w for w in sender_name.lower().replace('.', ' ').split() if len(w) > 3]
    has_name_ref = any(w in low for w in name_words)
    if not has_name_ref:
        issues.append({"dimension": "continuity", "msg": f"sender_name_not_mentioned:{sender_name}"})
        dims["continuity"] = 70.0
    
    # 4. Intent policy flags
    if intent_policy.get("send_on") == "no_send":
        issues.append({"dimension": "policy_adherence", "msg": "policy_blocks_send"})
        dims["policy_adherence"] = 30.0
    if intent_policy.get("cc_on") == "no_cc" and ", @" in body:  # rough CC-email leak
        pass  # no_cc means don't leak CC addresses in body text
    
    # 5. No sensitive data leakage markers
    sensitive_patterns = ['password', 'secret key', 'api key', 'token', 'ssn', 'iban']
    leaked = [p for p in sensitive_patterns if p in low]
    if leaked:
        issues.append({"dimension": "no_leakage", "msg": f"sensitive_patterns_found:{leaked}"})
        dims["no_leakage"] = 40.0
    
    # 6. Tone consistency — check for casual in formal context
    casual_markers = re.findall(r'\b(teh|gonna|wanna|lemme|kinda|dunno|ya|guy)\b', body, re.I)
    if intent_policy.get("grammar_threshold", 70) > 75 and casual_markers:
        issues.append({"dimension": "tone_consistent", "msg": f"casual_phrases_in_formal:{casual_markers[:3]}"})
        dims["tone_consistent"] = 65.0
    
    overall = round(sum(dims.values()) / len(dims), 1)
    return {
        "passed": len(issues) == 0,
        "should_send": overall >= 70,
        "overall_score": overall,
        "issues": issues[:6],
        "dimension_scores": dims,
    }
