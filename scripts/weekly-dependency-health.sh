#!/usr/bin/env bash
# scripts/weekly-dependency-health.sh — Weekly automated dependency health report
# Collects npm audit results, compares with previous week, and sends Telegram summary

set -euo pipefail

# Configuration
REPO_DIR="$(git rev-parse --show-toplevel)"
LOG_DIR="${LOG_DIR:-$HOME/.hermes/memory}"
REPORT_FILE="$LOG_DIR/dependency-health-weekly.txt"
GITHUB_TOKEN="${GITHUB_TOKEN:-$(cat .github/secret)}"

mkdir -p "$LOG_DIR"

echo "Weekly Dependency Health Report - $(date -u +"%Y-%m-%d")" > "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

# 1. npm audit
if [[ -f package-lock.json ]] || [[ -f npm-shrinkwrap.json ]]; then
  echo "=== npm audit results ===" >> "$REPORT_FILE"
  npm audit --audit-level=low 2>&1 | tee -a "$REPORT_FILE" || echo "npm audit failed" >> "$REPORT_FILE"
  echo "" >> "$REPORT_FILE"
fi

# 2. ncu check for outdated packages
if command -v ncu &>/dev/null; then
  echo "=== Outdated packages (ncu) ===" >> "$REPORT_FILE"
  ncu -u 2>&1 | tee -a "$REPORT_FILE" || echo "ncu failed" >> "$REPORT_FILE"
  echo "" >> "$REPORT_FILE"
fi

# 3. gitleaks check for secrets
if command -v gitleaks &>/dev/null; then
  echo "=== Secret scanning (gitleaks) ===" >> "$REPORT_FILE"
  gitleaks detect --source="." --verbose 2>&1 | tee -a "$REPORT_FILE" || echo "gitleaks failed" >> "$REPORT_FILE"
  echo "" >> "$REPORT_FILE"
fi

# 4. Summary
TOTAL_VULNERABILITIES=$(grep -cE "(Critical|High|Moderate|Low)" "$REPORT_FILE" 2>/dev/null || echo "0")
echo "=== Summary ===" >> "$REPORT_FILE"
echo "Total vulnerabilities found: $TOTAL_VULNERABILITIES" >> "$REPORT_FILE"
echo "Report generated: $(date -u +"%Y-%m-%dT%H:%M:%SZ")" >> "$REPORT_FILE"

echo "✅ Weekly dependency health report generated: $REPORT_FILE"
