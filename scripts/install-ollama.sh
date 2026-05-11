#!/usr/bin/env bash
# Install Ollama and pull llama3.2:3b for local free LLM
# Run: ./scripts/install-ollama.sh  or  bash scripts/install-ollama.sh
# Note: Requires zstd (apt install zstd / dnf install zstd)

set -e

echo "Installing Ollama..."
if command -v ollama &>/dev/null; then
  echo "Ollama already installed: $(ollama --version 2>/dev/null || true)"
else
  curl -fsSL https://ollama.com/install.sh | sh
fi

echo "Starting Ollama service (if not running)..."
ollama serve &>/dev/null &
sleep 2

echo "Pulling llama3.2:3b model..."
ollama pull llama3.2:3b

echo ""
echo "Ollama ready. Test with: npm run llm:test"
