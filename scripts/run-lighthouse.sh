#!/usr/bin/env bash
# ------------------------------------------------------------
# Lighthouse Performance Monitoring Script (free)
# ------------------------------------------------------------
#   - Runs Lighthouse on the production URL
#   - Stores JSON report in .hermes/memory/lighthouse-report.json
#   - Compares with previous baseline (if any) via Node helper
#   - Exits 1 on >10% drop to block merges
# ------------------------------------------------------------
set -euo pipefail

# Configurable URL (production site)
URL="https://ziontechgroup.com"
OUT_DIR=".hermes/memory"
REPORT="${OUT_DIR}/lighthouse-report.json"
BASELINE="${OUT_DIR}/lighthouse-baseline.json"

mkdir -p "${OUT_DIR}"

# Run Lighthouse (no Chrome install needed – uses Chromium bundled with LHCI)
# Use a low-profile config to keep run fast
npx lighthouse "${URL}" \
  --quiet \
  --output=json \
  --output-path="${REPORT}" \
  --chrome-flags='--headless --no-sandbox' || {
  echo "⚠️ Lighthouse failed"
  exit 1
}

# If baseline exists, evaluate performance change
if [[ -f "${BASELINE}" ]]; then
  node automation/lighthouse-eval.js "${BASELINE}" "${REPORT}" || {
    echo "⚠️ Performance regression detected – failing job"
    exit 1
  }
else
  echo "No baseline found – saving current report as baseline"
  cp "${REPORT}" "${BASELINE}"
fi

# Success
echo "✅ Lighthouse run completed successfully"
