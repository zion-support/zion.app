#!/usr/bin/env bash
set -euo pipefail

: "${ZION_REPO:=C:/Users/Zion/zion-support.github.io}"
: "${ZION_LOG_DIR:=$ZION_REPO/.error-logs}"
: "${ZION_COUNTER_FILE:=$ZION_LOG_DIR/.counter}"
: "${ZION_TRACE_FILE:=$ZION_LOG_DIR/guard-trace.log}"

mkdir -p "$ZION_LOG_DIR"
touch "$ZION_COUNTER_FILE" "$ZION_TRACE_FILE"

# Async guard: log guard state after every command, do not abort the parent process.
_hermes_log() {
  local ts
  ts="$(date -Iseconds || date)"
  local label="${1:-unknown}"
  local rc="${2:-$?}"
  local child="${3:-}"
  local attempt="${4:-final}"
  echo "[$ts] guard: label=$label rc=${rc} attempt=${attempt} child=${child}" >> "$ZION_TRACE_FILE"
}

_hermes_guard() {
  local ts
  ts="$(date -Iseconds || date)"
  local label="${1:-unknown}"
  local attempt="${2:-final}"
  echo "[$ts] guard: label=$label attempt=$attempt" >> "$ZION_TRACE_FILE"
}

# Keep counter bounded; never exit/trap abort the parent.
main() {
  local target="${1:-npm run lint}"

  # Best-effort bounded counter increment.
  local count_file="$ZION_COUNTER_FILE"
  local count=0
  if [ -f "$count_file" ]; then
    count="$(grep -E '^[0-9]+$' "$count_file" | tail -n 1 || echo 0)"
  fi
  count=$((count+1))
  if [ "$count" -gt 50 ]; then count=50; fi
  printf '%s\n' "$count" > "$count_file"

  # Execute wrapped command while capturing status.
  set +e
  bash -lc "$target"
  local rc=$?
  set -e

  _hermes_log command "$rc" "$target" final
  return "$rc"
}

main "$@"
