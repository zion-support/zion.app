#!/usr/bin/env bash

# Make sure the script fails if any command fails
set -e

# Normalize proxy environment variables to avoid npm warnings
# Some restricted shells do not fully support the '[' alias used in Bash
# conditionals. Use 'test' directly for maximum portability and keep 'then'
# on its own line to satisfy shells that reject the single-line form.
if test -n "$npm_config_http_proxy"
then
  export npm_config_proxy="$npm_config_http_proxy"
  unset npm_config_http_proxy
fi

# Package manager
PM=${1:-npm}

echo "Setting up the project with package manager: $PM"

# Check if the package manager exists
# Use POSIX compatible redirection to ensure portability
if ! command -v "$PM" >/dev/null 2>&1; then
  echo "Error: $PM is not installed. Please install it first."
  exit 1
fi

# Clean up offline files
echo "Removing offline development files..."
rm -f offline.html offline-dev.js OFFLINE-DEV-README.md tsconfig.offline.json
rm -f src/types/offline-shims.d.ts

# Install dependencies
echo "Installing dependencies..."
if test "$PM" = "npm" && test -f package-lock.json
then
  npm ci --prefer-offline --no-audit --fund=false
else
  "$PM" install
fi

# Ensure automation runtime directories exist for local and CI runs
mkdir -p automation/logs automation/reports automation/data

# Validate automation scripts so agents are ready immediately
echo "Running automation preflight..."
"$PM" run automation:preflight

# Generate Prisma client after dependencies are installed
if command -v npx >/dev/null 2>&1; then
  echo "Generating Prisma client..."
  npx prisma generate
  # Automatically install Playwright browsers if the dependency exists
  if grep -q "@playwright/test" package.json >/dev/null 2>&1; then
    echo "Installing Playwright browsers..."
    npx playwright install || echo "Warning: Failed to install Playwright browsers"
  fi
else
  echo "Warning: npx not found. Skipping Prisma client generation."
fi

# Create example environment files and check configuration
echo "Configuring environment files..."
node scripts/setup-environment.cjs

echo "Validating environment configuration..."
# Changed from ts-node to tsx for better ESM compatibility
npx tsx scripts/check-env.ts || true

# Development message
echo ""
echo "✅ Setup complete!"
echo ""
echo "👉 To start development server, run:"
echo "   $PM run dev"
echo ""
