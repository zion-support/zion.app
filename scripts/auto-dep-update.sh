#!/usr/bin/env bash
# ------------------------------------------------------------
# Automated Dependency Update Bot
# ------------------------------------------------------------
# Runs weekly, bumps all packages to latest compatible versions,
# runs the test suite, and creates a PR if everything passes.
# ------------------------------------------------------------
set -euo pipefail

# Ensure we are at repository root
cd "$(dirname "$0")/.."

# Install npm-check-updates (free tool)
npm install -g npm-check-updates

# Update dependencies in package.json
echo "🔄 Updating dependencies…"
ncu -u

# Install the new versions
npm install

# Run test suite – abort if failures
if ! npm test; then
  echo "❌ Tests failed after dependency bump – aborting PR creation"
  exit 1
fi

# Configure Git author
git config user.name "OpenClaw Bot"
git config user.email "bot@openclaw.ai"