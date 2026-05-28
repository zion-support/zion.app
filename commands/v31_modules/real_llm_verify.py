#!/usr/bin/env python3
"""
V31-P3: Real LLM Verify
Calls Hermes LLM (or Ollama fallback) to score reply quality on 6 dimensions.
Cache scores by reply text hash to avoid re-scoring identical replies.
"""
import hashlib, json, re, os
from pathlib import Path

_WORKSPACE = Path(__file__).resolve().parent.parent.parent
DATA = _WORKSPACE / 'data'
_CACHE = DATA / 'verify_cache.jsonl'

VERIFY_MIN = 75        # minimum overall score to auto-send
DIMENSIONS = [
    "continuity", "policy_adherence", "sign_off_ok",
    "tone_consistent", "no_placeholders", "no_leakage",
]

def _hash(text: str) -> str:
    return hashlib.sha256(text.encode()).hexdigest()[:16]

def _load_cache() -> dict:
    if not _CACHE.exists():
        return {}
    try:
        return {json.loads(l)["h"]: json.loads(l) for l in _CACHE.read_text().splitlines() if l.strip()}
    except Exception:
        return {}

def _save_cache(entry: dict) -> None:
    try:
        with open(_CACHE, "a") as f:
            f.write(json.dumps(entry) + "\n")
    except Exception:
        pass

def _call_llm(prompt: str) -> str:
    """Call Hermes LLM via env-configured provider; fallback to ollama."""
    import subprocess
    model = os.getenv("VERIFY_MODEL", os.getenv("HERMES_MODEL", "stepfun/step-3.5-flash"))
    # Try Hermes provider first
    try:
        from hermes_tools import llm_call
        return llm_call(prompt=prompt, model=model, max_tokens=300)
    except Exception:
        pass
    # Fallback: ollama
    try:
        r = subprocess.run(
            ["ollama", "run", model.split("/")[-1], prompt],
            capture_output=True, text=True, timeout=30,
        )
        return r.stdout.strip()
    except Exception:
        return ""

_DIM_PROMPT = """Score this reply on 6 dimensions (0-100 each).
Reply body:
\"\"\"{body}\"\"\"
Sender name: {sender}
Intent: {intent}

Return JSON only:
{{"dimensions": {{"continuity": N, "policy_adherence": N, "sign_off_ok": N, "tone_consistent": N, "no_placeholders": N, "no_leakage": N}}, "overall": N, "notes": "..."}}"""

def score_reply_quality(body: str, intent_label: str, sender_name: str = "") -> dict:
    """Score reply quality via LLM, cached by content hash."""
    h = _hash(body)
    cache = _load_cache()
    if h in cache:
        cached = cache[h]
        return {**cached, "cached": True}

    prompt = _DIM_PROMPT.format(body=body[:2000], intent=intent_label, sender=sender_name)
    raw = _call_llm(prompt)

    # Parse LLM output — extract JSON block
    m = re.search(r'\{[\s\S]*\}', raw)
    if m:
        try:
            scores = json.loads(m.group())
        except json.JSONDecodeError:
            scores = {}
    else:
        scores = {}

    dims = scores.get("dimensions", {})
    for d in DIMENSIONS:
        if d not in dims:
            dims[d] = 60.0

    overall = round(sum(dims.values()) / len(dims), 1)
    overall = scores.get("overall", overall)

    result = {
        "dimensions": dims,
        "overall": overall,
        "passed": overall >= VERIFY_MIN,
        "notes": scores.get("notes", ""),
        "h": h,
        "cached": False,
    }
    _save_cache(result)
    return result

def dimension_results(scores: dict) -> dict:
    """Extract just the dimension scores from a score_reply_quality result."""
    return scores.get("dimensions", {})

def batch_score(bodies: list, intent_label: str, sender_name: str = "") -> list:
    """Score multiple replies, using cache for previously-seen text."""
    return [score_reply_quality(b, intent_label, sender_name) for b in bodies]
