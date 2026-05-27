#!/usr/bin/env python3
"""
Zion Tech Group — Unified LLM Client with Free Fallbacks

Provides a single `chat(messages, provider='auto')` interface that supports:
- OpenAI (GPT-4 / GPT-4o) — primary paid
- Anthropic (Claude) — secondary paid
- Groq (llama-3.3-70b) — ultra-fast free tier
- Google Gemini (gemini-1.5 / 2.0-flash) — generous free tier
- HuggingFace Inference API — limited free
- Cerebras, Cloudflare Workers, DeepSeek, Mistral, Together, Cohere, OpenRouter
- Ollama (local) — ultimate fallback

Usage:
  from llm_client import chat
  result = chat([{"role":"user","content":"Hello"}], provider="auto")
  # → {"content": str, "provider": str, "model": str}

Environment variables required:
  OPENAI_API_KEY, ANTHROPIC_API_KEY, GROQ_API_KEY, GEMINI_API_KEY, etc.
  OLLAMA_BASE_URL (default: http://localhost:11434)
  OLLAMA_MODEL (default: qwen3:0.6b)
"""

import os
import json
import re
import time
import urllib.request
import urllib.parse
from typing import List, Dict, Any, Optional

# ── Auto-load .env from project root (zion.app/.env) ───────────────────────
_this_dir = os.path.dirname(os.path.abspath(__file__))
_env_path = os.path.join(_this_dir, '..', '.env')  # zion.app/.env
if os.path.exists(_env_path):
    with open(_env_path) as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith('#') and '=' in line:
                k, v = line.split('=', 1)
                os.environ.setdefault(k, v)  # don't override existing

# ── Configuration ──────────────────────────────────────────────
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
HUGGINGFACE_TOKEN = os.getenv("HUGGINGFACE_HUB_TOKEN")
CEREBRAS_API_KEY = os.getenv("CEREBRAS_API_KEY")
CLOUDFLARE_ACCOUNT_ID = os.getenv("CLOUDFLARE_ACCOUNT_ID")
CLOUDFLARE_API_TOKEN = os.getenv("CLOUDFLARE_API_TOKEN")
DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY")
MISTRAL_API_KEY = os.getenv("MISTRAL_API_KEY")
TOGETHER_API_KEY = os.getenv("TOGETHER_API_KEY")
COHERE_API_KEY = os.getenv("COHERE_API_KEY")
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434").rstrip("/")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "qwen3:0.6b")

# Optional model overrides per provider
GROQ_MODEL = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.0-flash-lite")
HUGGINGFACE_MODEL = os.getenv("HUGGINGFACE_MODEL", "mistralai/Mistral-7B-Instruct-v0.3")
CEREBRAS_MODEL = os.getenv("CEREBRAS_MODEL", "llama-3.3-70b")
CLOUDFLARE_MODEL = os.getenv("CLOUDFLARE_MODEL", "@cf/meta/llama-3.3-70b-instruct")
DEEPSEEK_MODEL = os.getenv("DEEPSEEK_MODEL", "deepseek-chat")
MISTRAL_MODEL = os.getenv("MISTRAL_MODEL", "mistral-small-latest")
TOGETHER_MODEL = os.getenv("TOGETHER_MODEL", "mistralai/Mixtral-8x7B-Instruct-v0.1")
COHERE_MODEL = os.getenv("COHERE_MODEL", "command-r-plus")
OPENROUTER_MODEL = os.getenv("OPENROUTER_MODEL", "openrouter/quasar-alpha")

def extract_json_from_text(text: str) -> dict:
    """Extract JSON from LLM output, stripping code fences and markdown."""
    import re
    # Strip code fences
    text = re.sub(r'^```[a-zA-Z]*\n?|\n?```$', '', text.strip(), flags=re.MULTILINE)
    # Find first JSON object
    match = re.search(r'\{.*\}', text, re.DOTALL)
    if match:
        try:
            return json.loads(match.group())
        except Exception:
            pass
    # Fallback: try parsing whole text
    try:
        return json.loads(text)
    except Exception:
        return {}

# ── Public Interface ───────────────────────────────────────────

def chat(
    messages: List[Dict[str, str]],
    provider: str = "auto",
    temperature: float = 0.7,
    stream: bool = False,
) -> Dict[str, str]:
    """
    Route a chat completion request with full fallback chain.

    provider: "openai" | "anthropic" | "freecloud" | "ollama" | "template" | "auto"
      - "freecloud": Groq → Gemini → HF → Cerebras → Cloudflare → DeepSeek
                      → Mistral → Together → Cohere → OpenRouter
      - "auto": OpenAI → Anthropic → freecloud → Ollama → template
    Returns: {"content": str, "provider": str, "model": str}
    """
    if provider == "openai":
        return _call_openai(messages, temperature)
    if provider == "anthropic":
        return _call_anthropic(messages, temperature)
    if provider == "freecloud":
        return _call_freecloud(messages, temperature)
    if provider == "ollama":
        return _call_ollama(messages, temperature)
    if provider == "template":
        return _call_template(messages, temperature)

    # auto
    # 1) paid cloud
    for p in [_call_openai, _call_anthropic]:
        try:
            return p(messages, temperature)
        except Exception as e:
            print(f"[LLM] {p.__name__} failed: {e}")
    # 2) free cloud tier
    try:
        return _call_freecloud(messages, temperature)
    except Exception as e:
        print(f"[LLM] freecloud failed: {e}")
    # 3) local Ollama
    try:
        return _call_ollama(messages, temperature)
    except Exception as e:
        print(f"[LLM] ollama failed: {e}")
    # 4) template fallback (never fails)
    return _call_template(messages, temperature)

def checkFreeProviders() -> List[str]:
    """Return list of free-cloud providers that have API keys configured."""
    available = []
    if GROQ_API_KEY:            available.append("groq")
    if GEMINI_API_KEY:          available.append("gemini")
    if HUGGINGFACE_TOKEN:       available.append("huggingface")
    if CEREBRAS_API_KEY:        available.append("cerebras")
    if CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN: available.append("cloudflare")
    if DEEPSEEK_API_KEY:        available.append("deepseek")
    if MISTRAL_API_KEY:         available.append("mistral")
    if TOGETHER_API_KEY:        available.append("together")
    if COHERE_API_KEY:          available.append("cohere")
    if OPENROUTER_API_KEY:      available.append("openrouter")
    return available


# ── Provider Implementations ──────────────────────────────────

def _call_openai(messages, temperature):
    if not OPENAI_API_KEY:
        raise RuntimeError('OPENAI_API_KEY not set')
    body = {
        'model': os.getenv('OPENAI_MODEL', 'gpt-4o'),
        'messages': messages,
        'temperature': temperature,
    }
    req = urllib.request.Request(
        'https://api.openai.com/v1/chat/completions',
        data=json.dumps(body).encode(),
        headers={
            'Authorization': f'Bearer {OPENAI_API_KEY}',
            'Content-Type': 'application/json',
        },
        method='POST',
    )
    with urllib.request.urlopen(req, timeout=30) as resp:
        data = json.loads(resp.read())
    return {
        'content': data['choices'][0]['message']['content'],
        'provider': 'openai',
        'model': data.get('model', 'gpt-4o'),
    }


def _call_anthropic(messages, temperature):
    if not ANTHROPIC_API_KEY:
        raise RuntimeError('ANTHROPIC_API_KEY not set')
    system_msg = next((m['content'] for m in messages if m['role'] == 'system'), None)
    anthropic_msgs = [m for m in messages if m['role'] != 'system']
    body = {
        'model': os.getenv('ANTHROPIC_MODEL', 'claude-sonnet-4-20250514'),
        'max_tokens': 4096,
        'temperature': temperature,
        'messages': anthropic_msgs,
    }
    if system_msg:
        body['system'] = system_msg
    req = urllib.request.Request(
        'https://api.anthropic.com/v1/messages',
        data=json.dumps(body).encode(),
        headers={
            'x-api-key': ANTHROPIC_API_KEY,
            'Content-Type': 'application/json',
            'anthropic-version': '2023-06-01',
        },
        method='POST',
    )
    with urllib.request.urlopen(req, timeout=30) as resp:
        data = json.loads(resp.read())
    return {
        'content': data['content'][0]['text'],
        'provider': 'anthropic',
        'model': data.get('model', 'claude-sonnet-4-20250514'),
    }


def _call_freecloud(messages, temperature):
    """
    Try free providers in order until one succeeds:
    Groq → Gemini → HuggingFace → Cerebras → Cloudflare → DeepSeek
    → Mistral → Together → Cohere → OpenRouter
    """
    providers = [
        lambda: _call_groq(messages, temperature),
        lambda: _call_gemini(messages, temperature),
        lambda: _call_huggingface(messages, temperature),
        lambda: _call_cerebras(messages, temperature),
        lambda: _call_cloudflare(messages, temperature),
        lambda: _call_deepseek(messages, temperature),
        lambda: _call_mistral(messages, temperature),
        lambda: _call_together(messages, temperature),
        lambda: _call_cohere(messages, temperature),
        lambda: _call_openrouter(messages, temperature),
    ]
    last_err = None
    for fn in providers:
        try:
            return fn()
        except Exception as e:
            last_err = e
            print(f"[LLM freecloud] {fn.__name__} failed: {e}")
    raise RuntimeError(f"All free providers exhausted. Last error: {last_err}")


def _call_groq(messages, temperature):
    if not GROQ_API_KEY:
        raise RuntimeError("GROQ_API_KEY not set")
    body = {
        "model": GROQ_MODEL,
        "messages": messages,
        "temperature": temperature,
        "max_tokens": 1024,
    }
    req = urllib.request.Request(
        "https://api.groq.com/openai/v1/chat/completions",
        data=json.dumps(body).encode(),
        headers={
            "Authorization": f"Bearer {GROQ_API_KEY}",
            "Content-Type": "application/json",
        },
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=15) as resp:
        data = json.loads(resp.read())
    return {
        "content": data["choices"][0]["message"]["content"],
        "provider": "groq",
        "model": data["model"],
    }


def _call_gemini(messages, temperature):
    if not GEMINI_API_KEY:
        raise RuntimeError("GEMINI_API_KEY not set")
    # Convert messages → Gemini format
    contents = [
        {"role": "model" if m["role"] == "assistant" else "user", "parts": [{"text": m["content"]}]}
        for m in messages if m["role"] != "system"
    ]
    system_instruction = next((m["content"] for m in messages if m["role"] == "system"), None)
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent?key={GEMINI_API_KEY}"
    body: Dict[str, Any] = {"contents": contents}
    if system_instruction:
        body["systemInstruction"] = {"parts": [{"text": system_instruction}]}
    req = urllib.request.Request(
        url,
        data=json.dumps(body).encode(),
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=20) as resp:
        data = json.loads(resp.read())
    text = data.get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text", "")
    return {"content": text, "provider": "gemini", "model": GEMINI_MODEL}


def _call_huggingface(messages, temperature):
    if not HUGGINGFACE_TOKEN:
        raise RuntimeError("HUGGINGFACE_TOKEN not set")
    prompt = "\n".join(f"{m['role']}: {m['content']}" for m in messages)
    url = f"https://api-inference.huggingface.co/models/{HUGGINGFACE_MODEL}"
    body = {"inputs": prompt, "parameters": {"temperature": temperature, "max_new_tokens": 1024}}
    req = urllib.request.Request(
        url,
        data=json.dumps(body).encode(),
        headers={
            "Authorization": f"Bearer {HUGGINGFACE_TOKEN}",
            "Content-Type": "application/json",
        },
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=25) as resp:
        data = json.loads(resp.read())
    text = data if isinstance(data, str) else (data[0].get("generated_text", "") if isinstance(data, list) else "")
    return {"content": text, "provider": "huggingface", "model": HUGGINGFACE_MODEL}


def _call_cerebras(messages, temperature):
    if not CEREBRAS_API_KEY:
        raise RuntimeError("CEREBRAS_API_KEY not set")
    body = {"model": CEREBRAS_MODEL, "messages": messages, "temperature": temperature}
    req = urllib.request.Request(
        "https://api.cerebras.ai/v1/chat/completions",
        data=json.dumps(body).encode(),
        headers={
            "Authorization": f"Bearer {CEREBRAS_API_KEY}",
            "Content-Type": "application/json",
        },
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=20) as resp:
        data = json.loads(resp.read())
    return {
        "content": data["choices"][0]["message"]["content"],
        "provider": "cerebras",
        "model": data["model"],
    }


def _call_cloudflare(messages, temperature):
    if not CLOUDFLARE_ACCOUNT_ID or not CLOUDFLARE_API_TOKEN:
        raise RuntimeError("CLOUDFLARE_ACCOUNT_ID/CLOUDFLARE_API_TOKEN not set")
    prompt = "\n".join(f"{m['role']}: {m['content']}" for m in messages)
    url = f"https://api.cloudflare.com/client/v4/accounts/{CLOUDFLARE_ACCOUNT_ID}/ai/run/{CLOUDFLARE_MODEL}"
    body = {"prompt": prompt}
    req = urllib.request.Request(
        url,
        data=json.dumps(body).encode(),
        headers={
            "Authorization": f"Bearer {CLOUDFLARE_API_TOKEN}",
            "Content-Type": "application/json",
        },
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=20) as resp:
        data = json.loads(resp.read())
    text = data.get("result", {}).get("response", "")
    return {"content": text, "provider": "cloudflare", "model": CLOUDFLARE_MODEL}


def _call_deepseek(messages, temperature):
    if not DEEPSEEK_API_KEY:
        raise RuntimeError("DEEPSEEK_API_KEY not set")
    body = {"model": DEEPSEEK_MODEL, "messages": messages, "temperature": temperature}
    req = urllib.request.Request(
        "https://api.deepseek.com/v1/chat/completions",
        data=json.dumps(body).encode(),
        headers={
            "Authorization": f"Bearer {DEEPSEEK_API_KEY}",
            "Content-Type": "application/json",
        },
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=20) as resp:
        data = json.loads(resp.read())
    return {
        "content": data["choices"][0]["message"]["content"],
        "provider": "deepseek",
        "model": data["model"],
    }


def _call_mistral(messages, temperature):
    if not MISTRAL_API_KEY:
        raise RuntimeError("MISTRAL_API_KEY not set")
    body = {"model": MISTRAL_MODEL, "messages": messages, "temperature": temperature}
    req = urllib.request.Request(
        "https://api.mistral.ai/v1/chat/completions",
        data=json.dumps(body).encode(),
        headers={
            "Authorization": f"Bearer {MISTRAL_API_KEY}",
            "Content-Type": "application/json",
        },
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=20) as resp:
        data = json.loads(resp.read())
    return {
        "content": data["choices"][0]["message"]["content"],
        "provider": "mistral",
        "model": data["model"],
    }


def _call_together(messages, temperature):
    if not TOGETHER_API_KEY:
        raise RuntimeError("TOGETHER_API_KEY not set")
    body = {"model": TOGETHER_MODEL, "messages": messages, "temperature": temperature}
    req = urllib.request.Request(
        "https://api.together.xyz/v1/chat/completions",
        data=json.dumps(body).encode(),
        headers={
            "Authorization": f"Bearer {TOGETHER_API_KEY}",
            "Content-Type": "application/json",
        },
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=20) as resp:
        data = json.loads(resp.read())
    return {
        "content": data["choices"][0]["message"]["content"],
        "provider": "together",
        "model": data["model"],
    }


def _call_cohere(messages, temperature):
    if not COHERE_API_KEY:
        raise RuntimeError("COHERE_API_KEY not set")
    # Cohere uses different message format
    last_msg = messages[-1]["content"] if messages else ""
    chat_history = [{"role": m["role"], "message": m["content"]} for m in messages[:-1]]
    body = {"model": COHERE_MODEL, "message": last_msg, "chat_history": chat_history}
    req = urllib.request.Request(
        "https://api.cohere.ai/v1/chat",
        data=json.dumps(body).encode(),
        headers={
            "Authorization": f"Bearer {COHERE_API_KEY}",
            "Content-Type": "application/json",
        },
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=20) as resp:
        data = json.loads(resp.read())
    return {"content": data["text"], "provider": "cohere", "model": COHERE_MODEL}


def _call_openrouter(messages, temperature):
    if not OPENROUTER_API_KEY:
        raise RuntimeError("OPENROUTER_API_KEY not set")
    body = {
        "model": OPENROUTER_MODEL,
        "messages": messages,
        "temperature": temperature,
    }
    req = urllib.request.Request(
        "https://openrouter.ai/api/v1/chat/completions",
        data=json.dumps(body).encode(),
        headers={
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "HTTP-Referer": "https://ziontechgroup.com",
            "X-Title": "Zion App",
            "Content-Type": "application/json",
        },
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=25) as resp:
        data = json.loads(resp.read())
    return {
        "content": data["choices"][0]["message"]["content"],
        "provider": "openrouter",
        "model": data.get("model", OPENROUTER_MODEL),
    }


def _call_ollama(messages, temperature):
    """Local Ollama fallback (runs on localhost:11434)"""
    ollama_messages = []
    for m in messages:
        role = "assistant" if m["role"] == "assistant" else "user"
        ollama_messages.append({"role": role, "content": m["content"]})
    body = {
        "model": OLLAMA_MODEL,
        "messages": ollama_messages,
        "stream": False,
        "options": {"temperature": temperature, "num_predict": 1024},
    }
    req = urllib.request.Request(
        f"{OLLAMA_BASE_URL}/api/chat",
        data=json.dumps(body).encode(),
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            data = json.loads(resp.read())
        content = data.get("message", {}).get("content", "")
        return {"content": content, "provider": "ollama", "model": OLLAMA_MODEL}
    except Exception as e:
        raise RuntimeError(f"Ollama unreachable at {OLLAMA_BASE_URL}: {e}")


def _call_template(messages, temperature):
    """Last-resort deterministic fallback. Never raises."""
    import random, re
    last_user_msg = next((m["content"] for m in reversed(messages) if m["role"] == "user"), "")
    lower = last_user_msg.lower()
    if any(k in lower for k in ["confirm", "scheduled", "meeting", "call", "confirmar", "reunião", "agenda"]):
        content = (
            "Thank you for your message. I confirm the appointment and look forward to our discussion.\n\n"
            "Best regards,\n"
            "Zion Tech Group"
        )
    elif any(k in lower for k in ["quote", "proposal", "pricing", "rate", "orçamento", "proposta", "preço"]):
        content = (
            "Thank you for your interest in our services. I'd be happy to prepare a customized proposal based on your requirements.\n\n"
            "Could you please provide more details about your project scope and timeline?\n\n"
            "Best regards,\n"
            "Zion Tech Group"
        )
    elif any(k in lower for k in ["error", "fail", "issue", "problem", "broken", "erro", "falha"]):
        content = (
            "I apologize for the inconvenience. We're looking into the issue and will get back to you with a resolution shortly.\n\n"
            "Thank you for your patience.\n\n"
            "Zion Tech Group"
        )
    else:
        content = (
            "Thank you for contacting Zion Tech Group. We have received your message and will respond as soon as possible.\n\n"
            "Best regards,\n"
            "Zion Tech Group"
        )
    return {"content": content, "provider": "template", "model": "deterministic-template-v1"}

# ── Quick self-test ────────────────────────────────────────────
if __name__ == "__main__":
    test_messages = [{"role": "user", "content": "Say hi from provider: auto"}]
    print("Testing unified LLM client...")
    result = chat(test_messages, provider="auto")
    print(f"Result: {result}")
