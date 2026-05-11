#!/usr/bin/env bash
set -euo pipefail

# Optional local secrets for OpenClaw + providers (never commit this file).
# Create: ~/.openclaw/openclaw.env with e.g. OPENROUTER_API_KEY=...  (chmod 600)
OPENCLAW_ENV_FILE="${HOME}/.openclaw/openclaw.env"
if [[ -f "$OPENCLAW_ENV_FILE" ]]; then
  set -a
  # shellcheck disable=SC1090
  source "$OPENCLAW_ENV_FILE"
  set +a
fi

if [[ -z "${NVM_DIR:-}" ]]; then
  export NVM_DIR="$HOME/.nvm"
fi

if [[ ! -s "$NVM_DIR/nvm.sh" ]]; then
  echo "nvm is required at $NVM_DIR/nvm.sh"
  exit 1
fi

source "$NVM_DIR/nvm.sh"

if ! nvm use 22 >/dev/null; then
  echo "Node 22 is required for OpenClaw. Installing..."
  nvm install 22 >/dev/null
  nvm use 22 >/dev/null
fi

if ! command -v openclaw >/dev/null 2>&1; then
  echo "OpenClaw is not installed globally. Run: npm install -g openclaw@latest"
  exit 1
fi

CONFIG_PATH="$HOME/.openclaw/openclaw.json"

mkdir -p "$HOME/.openclaw"
if [[ ! -f "$CONFIG_PATH" ]]; then
  cat > "$CONFIG_PATH" <<'EOF'
{
  "browser": {
    "enabled": true,
    "defaultProfile": "openclaw",
    "headless": false,
    "noSandbox": false,
    "attachOnly": false,
    "profiles": {
      "openclaw": { "color": "#FF4500" }
    }
  }
}
EOF
fi

if ! node -e 'const fs=require("fs");const p=process.argv[1];JSON.parse(fs.readFileSync(p,"utf8"));' "$CONFIG_PATH" >/dev/null 2>&1; then
  echo "Invalid OpenClaw config JSON at $CONFIG_PATH"
  exit 1
fi

if [[ -z "${OPENCLAW_GATEWAY_TOKEN:-}" && -f "$CONFIG_PATH" ]]; then
  token_from_config="$(node -e 'const fs=require("fs");const p=process.argv[1];try{const c=JSON.parse(fs.readFileSync(p,"utf8"));process.stdout.write(c?.gateway?.auth?.token||"")}catch{process.stdout.write("")}' "$CONFIG_PATH")"
  if [[ -n "$token_from_config" ]]; then
    export OPENCLAW_GATEWAY_TOKEN="$token_from_config"
  fi
fi

openclaw gateway start --dev >/dev/null 2>&1 || true

for _ in 1 2 3 4 5; do
  if openclaw gateway probe >/dev/null 2>&1; then
    break
  fi
  sleep 1
done

if [[ "${1:-}" == "--status" ]]; then
  openclaw gateway probe || true
  openclaw status || true
  exit 0
fi

openclaw gateway probe || true
openclaw browser --browser-profile openclaw status || true
openclaw browser --browser-profile openclaw start || echo "OpenClaw browser start skipped (insufficient scope or local policy)."

nvm use 20 >/dev/null
npm run app:improvement-cycle
