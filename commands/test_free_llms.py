#!/usr/bin/env python3
"""
Test free LLM provider connectivity.

Checks each configured provider with a minimal request and reports status.
Run from zion.app/ directory:
  python3 commands/test_free_llms.py
"""

import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'lib'))

from llm_client import chat, checkFreeProviders

def quick_test(provider_name):
    try:
        messages = [{"role":"user","content":"Hi"}]
        result = chat(messages, provider=provider_name, temperature=0.5)
        print(f"  [{provider_name}] OK → {result['provider']}/{result['model']}: {result['content'][:60]}...")
        return True
    except Exception as e:
        print(f"  [{provider_name}] FAILED: {e}")
        return False

def main():
    print("=== Zion LLM Unified Client Diagnostic ===\n")
    # Show configured keys
    keys = {
        "openai": bool(os.getenv("OPENAI_API_KEY")),
        "anthropic": bool(os.getenv("ANTHROPIC_API_KEY")),
        "groq": bool(os.getenv("GROQ_API_KEY")),
        "gemini": bool(os.getenv("GEMINI_API_KEY")),
        "huggingface": bool(os.getenv("HUGGINGFACE_HUB_TOKEN")),
        "cerebras": bool(os.getenv("CEREBRAS_API_KEY")),
        "cloudflare": bool(os.getenv("CLOUDFLARE_ACCOUNT_ID") and os.getenv("CLOUDFLARE_API_TOKEN")),
        "deepseek": bool(os.getenv("DEEPSEEK_API_KEY")),
        "mistral": bool(os.getenv("MISTRAL_API_KEY")),
        "together": bool(os.getenv("TOGETHER_API_KEY")),
        "cohere": bool(os.getenv("COHERE_API_KEY")),
        "openrouter": bool(os.getenv("OPENROUTER_API_KEY")),
    }
    print("Configured keys:")
    for k,v in keys.items():
        status = "✅" if v else "❌"
        print(f"  {status} {k}")
    print()

    # Auto-detect free providers that have keys
    available = checkFreeProviders()
    print(f"Available free providers: {available or 'none (set at least one API key)'}\n")

    # Test full auto chain
    print("Testing AUTO chain (full fallback: OpenAI→Anthropic→FreeCloud→Ollama→Template):")
    try:
        result = chat([{"role":"user","content":"test"}], provider="auto")
        print(f"  ✅ AUTO → provider={result['provider']}  model={result['model']}")
        print(f"     Content: {result['content'][:80]}...\n")
    except Exception as e:
        print(f"  ❌ AUTO failed: {e}\n")
        return 1

    # Test individual providers (each in isolation)
    providers = ["openai", "anthropic", "freecloud", "ollama", "template"]
    print("Testing individual providers (skip missing keys):")
    for p in providers:
        quick_test(p)

    return 0

if __name__ == "__main__":
    sys.exit(main())
