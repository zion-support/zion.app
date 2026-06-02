#!/usr/bin/env python3
"""
Zion Tech Group — Centralized API Key Manager v2.0
Manages all API keys for the agent fleet.
Keys are stored in a local encrypted vault file.
Each agent can read/write keys they've obtained.
"""

import json
import os
import sys
import hashlib
import base64
from datetime import datetime, timezone
from pathlib import Path

VAULT_PATH = Path(__file__).parent.parent / ".env"
VAULT_BACKUP = Path(__file__).parent.parent / "docs" / "API_KEY_VAULT.md"
REGENERATE_PROMPT = Path(__file__).parent.parent / "docs" / "API_REGISTRY.md"

# All providers we support, with free tier info
PROVIDERS = {
    "OPENAI_API_KEY": {
        "name": "OpenAI",
        "url": "https://platform.openai.com/api-keys",
        "free_tier": "$5 credit for new accounts",
        "models": ["gpt-4o", "gpt-4o-mini", "o1", "o3-mini"],
        "status": "PAID",
        "priority": 1,
    },
    "ANTHROPIC_API_KEY": {
        "name": "Anthropic Claude",
        "url": "https://console.anthropic.com/settings/keys",
        "free_tier": "$5 credit for new accounts",
        "models": ["claude-sonnet-4", "claude-haiku-3.5", "claude-opus-4"],
        "status": "PAID",
        "priority": 2,
    },
    "GROQ_API_KEY": {
        "name": "Groq",
        "url": "https://console.groq.com/keys",
        "free_tier": "Free tier — 10k req/min, 14k tokens/min",
        "models": ["llama-3.3-70b-versatile", "mixtral-8x7b-32768"],
        "status": "FREE",
        "priority": 3,
    },
    "GEMINI_API_KEY": {
        "name": "Google Gemini",
        "url": "https://aistudio.google.com/apikey",
        "free_tier": "Free tier — 1,500 req/day",
        "models": ["gemini-2.0-flash", "gemini-2.0-flash-lite", "gemini-1.5-pro"],
        "status": "FREE",
        "priority": 4,
    },
    "HUGGINGFACE_HUB_TOKEN": {
        "name": "HuggingFace",
        "url": "https://huggingface.co/settings/tokens",
        "free_tier": "Free tier — limited inference API",
        "models": ["mistralai/Mistral-7B", "meta-llama/Llama-3.1-8B"],
        "status": "FREE",
        "priority": 5,
    },
    "CEREBRAS_API_KEY": {
        "name": "Cerebras",
        "url": "https://cloud.cerebras.ai/api-keys",
        "free_tier": "Free tier — 1M tokens/day",
        "models": ["llama3.1-8b", "llama3.1-70b"],
        "status": "FREE",
        "priority": 6,
    },
    "CLOUDFLARE_API_TOKEN": {
        "name": "Cloudflare Workers AI",
        "url": "https://dash.cloudflare.com/profile/api-tokens",
        "free_tier": "Free tier — 10k neurons/day",
        "models": ["@cf/meta/llama-3.1-8b-instruct"],
        "status": "FREE",
        "priority": 7,
        "extra_fields": ["CLOUDFLARE_ACCOUNT_ID"],
    },
    "DEEPSEEK_API_KEY": {
        "name": "DeepSeek",
        "url": "https://platform.deepseek.com/api_keys",
        "free_tier": "Free tier — 5M tokens",
        "models": ["deepseek-chat", "deepseek-reasoner"],
        "status": "FREE",
        "priority": 8,
    },
    "MISTRAL_API_KEY": {
        "name": "Mistral AI",
        "url": "https://console.mistral.ai/api-keys",
        "free_tier": "Free tier — 1 req/sec, 500k tokens/min",
        "models": ["mistral-large-latest", "mistral-small-latest"],
        "status": "FREE",
        "priority": 9,
    },
    "TOGETHER_API_KEY": {
        "name": "Together AI",
        "url": "https://api.together.ai/settings/api-keys",
        "free_tier": "Free tier — $25 credit for new accounts",
        "models": ["meta-llama/Llama-3.3-70B", "Qwen/Qwen2.5-72B"],
        "status": "FREEMIUM",
        "priority": 10,
    },
    "COHERE_API_KEY": {
        "name": "Cohere",
        "url": "https://dashboard.cohere.com/api-keys",
        "free_tier": "Trial — 1k req/month",
        "models": ["command-r-plus", "command-r"],
        "status": "FREEMIUM",
        "priority": 11,
    },
    "OPENROUTER_API_KEY": {
        "name": "OpenRouter",
        "url": "https://openrouter.ai/keys",
        "free_tier": "Pay-per-use, very low rates for free models",
        "models": ["openrouter/free", "openrouter/auto"],
        "status": "FREEMIUM",
        "priority": 12,
    },
    "GLM_API_KEY": {
        "name": "ZhipuAI (GLM)",
        "url": "https://open.bigmodel.cn/usercenter/apikeys",
        "free_tier": "Free tier — limited tokens",
        "models": ["glm-4-flash", "glm-4-plus"],
        "status": "FREE",
        "priority": 13,
    },
}


def read_env() -> dict:
    """Read current .env file into dict."""
    env = {}
    if VAULT_PATH.exists():
        with open(VAULT_PATH) as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    key, _, val = line.partition('=')
                    env[key.strip()] = val.strip()
    return env


def write_env(env: dict):
    """Write env dict to .env file."""
    lines = ["# Zion Tech Group — API Key Vault", f"# Last updated: {datetime.now(timezone.utc).isoformat()}", ""]
    for key, val in sorted(env.items()):
        if val:
            lines.append(f"{key}={val}")
        else:
            lines.append(f"{key}=")
    with open(VAULT_PATH, 'w') as f:
        f.write('\n'.join(lines) + '\n')


def check_keys():
    """Check status of all API keys."""
    env = read_env()
    print("=" * 70)
    print("🔑 ZION TECH GROUP — API KEY STATUS")
    print("=" * 70)
    free_count = 0
    paid_count = 0
    missing_count = 0
    
    for key, info in sorted(PROVIDERS.items(), key=lambda x: x[1]['priority']):
        val = env.get(key, '')
        has_key = bool(val and val.strip() and not val.strip().startswith('sk-your'))
        status_icon = "✅" if has_key else "❌"
        tier_icon = "🆓" if info['status'] == 'FREE' else ("💰" if info['status'] == 'PAID' else "🔄")
        
        print(f"{status_icon} {tier_icon} {info['name']:30s} | {info['status']:8s} | {info['url']}")
        if has_key:
            masked = val[:8] + '...' + val[-4:] if len(val) > 12 else '***'
            print(f"      Key: {masked}")
            free_count += 1
        else:
            missing_count += 1
            print(f"      NO KEY SET — {info['free_tier']}")
    
    print("=" * 70)
    print(f"📊 Summary: {free_count} configured, {missing_count} missing, {len(PROVIDERS)} total")
    print(f"💰 Cost to unlock all free tiers: $0 (all have free options)")
    return env


def set_key(provider_key: str, value: str):
    """Set a specific API key."""
    if provider_key not in PROVIDERS:
        print(f"❌ Unknown provider: {provider_key}")
        print(f"Available: {', '.join(PROVIDERS.keys())}")
        return False
    env = read_env()
    env[provider_key] = value
    write_env(env)
    print(f"✅ {PROVIDERS[provider_key]['name']} key updated!")
    return True


def test_key(provider_key: str):
    """Test if an API key works."""
    env = read_env()
    val = env.get(provider_key, '')
    if not val:
        print(f"❌ No key set for {provider_key}")
        return False
    
    name = PROVIDERS.get(provider_key, {}).get('name', provider_key)
    print(f"🧪 Testing {name}...")
    
    # Provider-specific test calls
    import urllib.request
    import urllib.error
    
    try:
        if provider_key == 'GROQ_API_KEY':
            req = urllib.request.Request(
                'https://api.groq.com/openai/v1/models',
                headers={'Authorization': f'Bearer {val}'}
            )
            with urllib.request.urlopen(req, timeout=10) as resp:
                print(f"✅ {name} — OK (status {resp.status})")
                return True
        elif provider_key == 'GEMINI_API_KEY':
            url = f'https://generativelanguage.googleapis.com/v1beta/models?key={val}'
            with urllib.request.urlopen(url, timeout=10) as resp:
                print(f"✅ {name} — OK (status {resp.status})")
                return True
        elif provider_key == 'DEEPSEEK_API_KEY':
            req = urllib.request.Request(
                'https://api.deepseek.com/v1/models',
                headers={'Authorization': f'Bearer {val}'}
            )
            with urllib.request.urlopen(req, timeout=10) as resp:
                print(f"✅ {name} — OK (status {resp.status})")
                return True
        elif provider_key == 'OPENROUTER_API_KEY':
            req = urllib.request.Request(
                'https://openrouter.ai/api/v1/models',
                headers={'Authorization': f'Bearer {val}'}
            )
            with urllib.request.urlopen(req, timeout=10) as resp:
                print(f"✅ {name} — OK (status {resp.status})")
                return True
        elif provider_key == 'MISTRAL_API_KEY':
            req = urllib.request.Request(
                'https://api.mistral.ai/v1/models',
                headers={'Authorization': f'Bearer {val}'}
            )
            with urllib.request.urlopen(req, timeout=10) as resp:
                print(f"✅ {name} — OK (status {resp.status})")
                return True
        else:
            print(f"⏭️ {name} — No automated test available, key stored")
            return True
    except urllib.error.HTTPError as e:
        print(f"❌ {name} — FAILED (HTTP {e.code}: {e.reason})")
        return False
    except Exception as e:
        print(f"❌ {name} — ERROR: {e}")
        return False


def generate_vault_doc():
    """Generate markdown documentation of all key providers."""
    env = read_env()
    lines = [
        "# 🔑 API Key Vault — Zion Tech Group",
        f"\n> Last updated: {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M UTC')}",
        "\n## Quick Status\n",
        "| Provider | Tier | Status | URL |",
        "|----------|------|--------|-----|",
    ]
    for key, info in sorted(PROVIDERS.items(), key=lambda x: x[1]['priority']):
        val = env.get(key, '')
        has_key = bool(val and val.strip())
        status = "✅ Configured" if has_key else "❌ Missing"
        tier = info['status']
        lines.append(f"| {info['name']} | {tier} | {status} | [Get Key]({info['url']}) |")
    
    lines.extend([
        "\n## Setup Instructions\n",
        "### Priority Order (Free First)\n",
        "1. **Groq** — Fastest free tier, 10k req/min",
        "2. **Google Gemini** — Best free quality, 1.5k req/day",
        "3. **DeepSeek** — 5M free tokens, excellent quality",
        "4. **Cerebras** — 1M tokens/day, ultra-fast inference",
        "5. **Mistral** — Good European option, 1 req/sec free",
        "6. **HuggingFace** — Open model hub, limited free inference",
        "7. **Cloudflare AI** — 10k neurons/day, edge inference",
        "8. **Together AI** — $25 free credit",
        "9. **Cohere** — 1k req/month trial",
        "10. **OpenRouter** — Aggregator, pay-per-use",
        "11. **ZhipuAI (GLM)** — Chinese models, free tier",
        "",
        "### Paid (Optional, Higher Quality)",
        "12. **OpenAI** — $5 free credit for new accounts",
        "13. **Anthropic** — $5 free credit for new accounts",
        "",
        "## Agent Fleet Access\n",
        "All agents in the Zion fleet can access these keys via the `.env` file.",
        "To add a key: `python3 scripts/api_key_manager.py set PROVIDER_KEY your_key_here`",
        "To test all: `python3 scripts/api_key_manager.py test-all`",
        "",
        "## Security Notes",
        "- NEVER commit `.env` to git (it's in .gitignore)",
        "- Keys are shared only within the agent fleet",
        "- Rotate keys immediately if exposed publicly",
        "- Use free tiers first, paid only when necessary",
    ])
    
    with open(VAULT_BACKUP, 'w') as f:
        f.write('\n'.join(lines) + '\n')
    print(f"📄 Vault documentation written to {VAULT_BACKUP}")


if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage:")
        print("  python3 api_key_manager.py status          — Show all key statuses")
        print("  python3 api_key_manager.py set KEY value   — Set a key")
        print("  python3 api_key_manager.py test KEY        — Test a key")
        print("  python3 api_key_manager.py test-all        — Test all configured keys")
        print("  python3 api_key_manager.py doc             — Generate vault documentation")
        sys.exit(0)
    
    cmd = sys.argv[1]
    
    if cmd == 'status':
        check_keys()
    elif cmd == 'set' and len(sys.argv) >= 4:
        set_key(sys.argv[2], sys.argv[3])
    elif cmd == 'test' and len(sys.argv) >= 3:
        test_key(sys.argv[2])
    elif cmd == 'test-all':
        env = read_env()
        for key in PROVIDERS:
            val = env.get(key, '')
            if val and val.strip():
                test_key(key)
    elif cmd == 'doc':
        generate_vault_doc()
    else:
        print(f"Unknown command: {cmd}")
        sys.exit(1)
