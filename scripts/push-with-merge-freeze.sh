#!/usr/bin/env bash
# Wraps `git push` inside merge-freeze orchestration when MERGE_FREEZE_ON_PUSH=1.
# Usage:
#   MERGE_FREEZE_ON_PUSH=1 ./scripts/push-with-merge-freeze.sh origin main
#   npm run push:merge-freeze -- origin main
set -euo pipefail
ROOT="$(git rev-parse --show-toplevel)"
cd "$ROOT"
if [ "${MERGE_FREEZE_ON_PUSH:-}" = "1" ]; then
  exec npm run openclaw:merge:freeze:run -- git push "$@"
fi
exec git push "$@"
