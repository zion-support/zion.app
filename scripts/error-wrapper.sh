#!/usr/bin/env bash
set -euo pipefail

: "${ZION_REPO:=C:/Users/Zion/zion-support.github.io}"
: "${ZION_LOG_DIR:=$ZION_REPO/.error-logs}"
ZION_COUNTER_FILE="$ZION_LOG_DIR/.counter"
mkdir -p "$ZION_LOG_DIR"

# Ensure counter file exists
touch "$ZION_COUNTER_FILE"

# Global failure trap: logs once per error and exits, no uncontrolled retries
_hermes_guard() {
  local ts
  ts="$(date -Iseconds)"
  local label="${1:-unknown}"
  local attempt="${2:-final}"
  echo "[$ts] guard: label=$label attempt=$attempt"
}
trap 'rc=$?; _hermes_guard "sig-exit" "final"; exit "$rc"' EXIT

main() {
  echo "error-wrapper ready"
}

main "$@"
