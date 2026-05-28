#!/usr/bin/env python3
"""
Sync API keys from Google Sheet "API KEYS" → zion.app/.env

Reads sheet columns: NAME | KEY
Maps known provider names to environment variables.
Generates strong placeholder values for any missing required keys.
Writes .env with mode 600.
"""

import sys, os, json, secrets, urllib.request, urllib.parse
from pathlib import Path

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gog_headers

# ── Provider name → env var mapping ────────────────────────────────────────
PROVIDER_MAP = {
    'OPENAI_API_KEY':         ('OpenAI',),
    'ANTHROPIC_API_KEY':      ('Anthropic',),
    'GROQ_API_KEY':           ('Groq',),
    'GEMINI_API_KEY':         ('Gemini',),
    'HUGGINGFACE_HUB_TOKEN':  ('HuggingFace',),
    'CEREBRAS_API_KEY':       ('Cerebras',),
    'CLOUDFLARE_ACCOUNT_ID':  ('Cloudflare',),
    'CLOUDFLARE_API_TOKEN':   ('Cloudflare',),
    'DEEPSEEK_API_KEY':       ('DeepSeek',),
    'MISTRAL_API_KEY':        ('Mistral',),
    'TOGETHER_API_KEY':       ('Together',),
    'COHERE_API_KEY':         ('Cohere',),
    'OPENROUTER_API_KEY':     ('Openrouter', 'OpenROuter', 'OpenRouter'),
}

def generate_placeholder(length: int = 40) -> str:
    return secrets.token_hex(length // 2)

def build_env_from_sheet() -> tuple[dict, list, dict]:
    """Fetch sheet rows and return (env_dict, missing_vars, sheet_kv)."""
    # Find the spreadsheet using Drive API with proper query
    base = 'https://www.googleapis.com/drive/v3/files'
    query = "name='API KEYS' and mimeType='application/vnd.google-apps.spreadsheet' and trashed=false"
    params = {'q': query, 'pageSize': 5, 'fields': 'files(id,name)'}
    url = base + '?' + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers=gog_headers())
    resp = json.loads(urllib.request.urlopen(req).read())
    files = resp.get('files', [])
    if not files:
        raise RuntimeError("Spreadsheet 'API KEYS' not found in Drive")
    spreadsheet_id = files[0]['id']

    # Fetch first sheet values
    url_vals = f'https://sheets.googleapis.com/v4/spreadsheets/{spreadsheet_id}/values/Sheet1!A1:Z200'
    req_vals = urllib.request.Request(url_vals, headers=gog_headers())
    resp_vals = json.loads(urllib.request.urlopen(req_vals).read())
    rows = resp_vals.get('values', [])
    if not rows:
        raise RuntimeError("API KEYS sheet is empty")

    # Parse into name→key mapping (skip header row)
    sheet_kv = {}
    for row in rows[1:]:
        if len(row) < 2:
            continue
        name = row[0].strip()
        key = row[1].strip()
        if name and key:
            sheet_kv[name] = key

    # Build env dict
    env = {}
    missing = []
    for env_var, name_variants in PROVIDER_MAP.items():
        found = None
        for variant in name_variants:
            for sheet_name, sheet_key in sheet_kv.items():
                if variant.lower() in sheet_name.lower():
                    found = sheet_key
                    break
            if found:
                break
        if found:
            env[env_var] = found
        else:
            missing.append(env_var)
            env[env_var] = generate_placeholder()

    return env, missing, sheet_kv

def main():
    print("🔁 Syncing API keys from Google Sheet → .env")
    env, missing, sheet_kv = build_env_from_sheet()

    # Write .env
    env_path = WORKSPACE / 'zion.app' / '.env'
    lines = [f"{k}={v}" for k, v in sorted(env.items())]
    content = '\n'.join(lines) + '\n'
    env_path.write_text(content)
    env_path.chmod(0o600)
    print(f"✅ Wrote {len(env)} keys to {env_path} (mode 600)")

    # Summary
    print(f"\n📊 Keys sourced from sheet: {len(sheet_kv)} entries")
    if missing:
        print(f"   Missing (placeholders generated): {', '.join(missing)}")
    else:
        print("   All required keys present!")
    print("\n💡 Next: run `python3 test_free_llms.py` to verify which providers actually connect.")

if __name__ == '__main__':
    main()
