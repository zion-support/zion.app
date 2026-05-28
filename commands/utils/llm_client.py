#!/usr/bin/env python3
"""
commands/utils/llm_client.py — LLM call wrapper with Ollama fallback chain

Priority:
  1. Primary LLM_ENDPOINT (default: https://openrouter.ai/api/v1)
  2. Local Ollama (localhost:11434) — only used when primary fails

Environment vars:
  LLM_ENDPOINT       Primary LLM URL  (default: https://openrouter.ai/api/v1/chat/completions)
  LLM_MODEL          Primary model   (default: nousresearch/nous-hermes-2-mixtral-8x7b-dpo)
  LLM_TIMEOUT        Seconds before timeout (default: 15)
  OLLAMA_BASE_URL    Ollama URL        (default: http://localhost:11434)
  OLLAMA_MODEL       Fallback model    (default: llama3.2:latest)
  OLLAMA_FALLBACK    Set to "0" to disable (default: 1)
  OPENROUTER_API_KEY Optional key for OpenRouter; if absent primary auto-skipped
"""
import os, json, urllib.request, urllib.error
from typing import Any

# ── Configuration ─────────────────────────────────────────────────────────────
LLM_ENDPOINT  = os.getenv("LLM_ENDPOINT",
    "https://openrouter.ai/api/v1/chat/completions")
LLM_MODEL     = os.getenv("LLM_MODEL",
    "nousresearch/nous-hermes-2-mixtral-8x7b-dpo")
LLM_TIMEOUT   = int(os.getenv("LLM_TIMEOUT","15"))
OLLAMA_BASE   = os.getenv("OLLAMA_BASE_URL","http://localhost:11434")
OLLAMA_MODEL  = os.getenv("OLLAMA_MODEL","llama3.2:latest")
OLLAMA_FALLBACK = os.getenv("OLLAMA_FALLBACK","1") != "0"
OPENROUTER_KEY = os.getenv("OPENROUTER_API_KEY","")

# ── OpenRouter helpers ───────────────────────────────────────────────────────
_OR_HEADERS = {}
if OPENROUTER_KEY:
    _OR_HEADERS["Authorization"] = f"Bearer {OPENROUTER_KEY}"
    _OR_HEADERS["HTTP-Referer"]  = "https://ziontechgroup.com"
    _OR_HEADERS["X-Title"]       = "Zion Tech Group Email Automation"

def _is_quota_error(err: urllib.error.HTTPError) -> bool:
    """True if the error looks like a rate-limit / quota exhaustion."""
    if err.code in (429, 402, 403):
        return True
    body = (err.read() or b"").decode(errors="replace").lower()
    return any(kw in body for kw in [
        "rate limit", "quota exceeded", "insufficient credits",
        "exceeded your free quota", "billing",
    ])

def _is_unavailable(err: Exception) -> bool:
    """Network / server error — worth trying a fallback."""
    return isinstance(err, (urllib.error.URLError, ConnectionError, TimeoutError))

def llm_query(
    prompt: str,
    temperature: float = 0.3,
    max_tokens: int   = 150,
    model: str | None = None,
) -> dict:
    """
    Call LLM with robust fallback chain.

    Returns dict with at minimum:
      {"response": <str>}         on success
      {"response": "", "error": <str>}  on failure (empty response, never raises)
    """
    used_model = model or LLM_MODEL
    last_err   = None

    # ── Step 1: Primary (OpenRouter / configured LLM) ────────────────────────
    if OPENROUTER_KEY:
        payload: dict = {
            "model": used_model,
            "messages": [{"role": "user", "content": prompt}],
            "temperature": temperature,
            "max_tokens": max_tokens,
        }
        try:
            req = urllib.request.Request(
                LLM_ENDPOINT,
                data=json.dumps(payload).encode("utf-8"),
                headers={**_OR_HEADERS, "Content-Type": "application/json"},
            )
            with urllib.request.urlopen(req, timeout=LLM_TIMEOUT) as resp:
                raw = json.loads(resp.read().decode("utf-8"))
                content = (raw.get("choices",[{}])[0]
                           .get("message",{})
                           .get("content",""))
                return {"response": content.strip()}
        except urllib.error.HTTPError as e:
            last_err = f"HTTP {e.code}: {e.reason or ''}"
            if not _is_quota_error(e) and not _is_unavailable(e):
                return {"response":"","error":last_err}   # not our problem — stop
        except Exception as e:
            last_err = str(e)
    else:
        last_err = "no primary LLM key configured"

    # ── Step 2: Ollama fallback ────────────────────────────────────────────────
    if OLLAMA_FALLBACK:
        return _ollama_query(prompt, temperature, max_tokens, last_err)

    return {"response":"","error": last_err or "no LLM available"}

# ── Ollama ───────────────────────────────────────────────────────────────────

_OLLAMA_TIMEOUT = min(LLM_TIMEOUT, 12)   # cap for local

def _ollama_query(
    prompt: str,
    temperature: float,
    max_tokens: int,
    prior_error: str,
) -> dict:
    """Call local Ollama. Returns compatible dict."""
    url = f"{OLLAMA_BASE}/api/generate"
    payload = {
        "model": OLLAMA_MODEL,
        "prompt": prompt,
        "temperature": temperature,
        "max_tokens": max_tokens,
        "stream": False,
    }
    try:
        req = urllib.request.Request(
            url, data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json"},
        )
        with urllib.request.urlopen(req, timeout=_OLLAMA_TIMEOUT) as resp:
            raw = json.loads(resp.read().decode("utf-8"))
            return {"response": raw.get("response","").strip(),
                    "fallback": True}
    except urllib.error.URLError as e:
        return {"response":"",
                "error": f"Ollama unavailable ({e}); {prior_error}"}
    except Exception as e:
        return {"response":"",
                "error": f"Ollama error ({e}); {prior_error}"}

# ── Probe ─────────────────────────────────────────────────────────────────────

def is_primary_available() -> bool:
    """Quick check: is the primary LLM responding?"""
    try:
        resp = llm_query("ping", max_tokens=1)
        return bool(resp.get("response"))
    except Exception:
        return False

def is_ollama_available() -> bool:
    """Check if local Ollama is running and has at least one model."""
    try:
        with urllib.request.urlopen(
            f"{OLLAMA_BASE}/api/tags", timeout=3) as r:
            data = json.loads(r.read())
            return len(data.get("models",[])) > 0
    except Exception:
        return False

def status() -> dict:
    return {
        "primary_configured": bool(OPENROUTER_KEY),
        "primary_model": LLM_MODEL,
        "ollama_available": is_ollama_available(),
        "ollama_model": OLLAMA_MODEL,
        "ollama_fallback_enabled": OLLAMA_FALLBACK,
    }

if __name__ == "__main__":
    print(json.dumps(status(), indent=2))
