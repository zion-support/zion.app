#!/usr/bin/env bash
# scripts/check-schema-changes.sh
# Computes hash of all JSON schema files in app/schemas
# Compares with previous hash stored in .hermes/memory/schema-hash.txt
# Sets GitHub Actions output: changed=true/false

set -euo pipefail

SCHEMA_DIR="${SCHEMA_DIR:-app/schemas}"
HASH_FILE="${HASH_FILE:-.hermes/memory/schema-hash.txt}"
OUTPUT_FILE="${GITHUB_OUTPUT:-/dev/null}"  # In GitHub Actions, set by runner

mkdir -p "$(dirname "$HASH_FILE")"

compute_hash() {
  if [[ ! -d "$SCHEMA_DIR" ]]; then
    echo "NO_SCHEMAS"
    return
  fi
  # Find all JSON files, sort, hash each, combine
  local hash
  hash=$(find "$SCHEMA_DIR" -name "*.json" -type f | sort | while read -r f; do
    md5sum "$f" | cut -d' ' -f1
  done | md5sum | cut -d' ' -f1)
  echo "$hash"
}

CURRENT_HASH=$(compute_hash)

if [[ "$CURRENT_HASH" == "NO_SCHEMAS" ]]; then
  echo "⚠️ No schema directory found at $SCHEMA_DIR"
  echo "changed=false" >> "$OUTPUT_FILE"
  exit 0
fi

PREV_HASH=""
if [[ -f "$HASH_FILE" ]]; then
  PREV_HASH=$(cat "$HASH_FILE")
fi

if [[ -n "$PREV_HASH" && "$CURRENT_HASH" == "$PREV_HASH" ]]; then
  echo "✅ Schema unchanged"
  echo "changed=false" >> "$OUTPUT_FILE"
else
  echo "📝 Schema changed (new hash: $CURRENT_HASH)"
  echo "changed=true" >> "$OUTPUT_FILE"
  # Update stored hash for next run
  echo "$CURRENT_HASH" > "$HASH_FILE"
fi
