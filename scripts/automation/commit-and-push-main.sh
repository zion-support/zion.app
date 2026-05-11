#!/usr/bin/env bash
set -euo pipefail

# Usage:
#   commit-and-push-main.sh "commit message"
# Expects staged changes already prepared.

if [[ $# -ne 1 ]]; then
  echo "Usage: $0 \"commit message\"" >&2
  exit 2
fi

commit_message="$1"

record_committed_output() {
  local val="$1"
  if [[ "${COMMIT_AND_PUSH_RECORD_OUTPUT:-}" != "true" ]]; then
    return 0
  fi
  if [[ -z "${GITHUB_OUTPUT:-}" ]]; then
    echo "::warning::COMMIT_AND_PUSH_RECORD_OUTPUT=true but GITHUB_OUTPUT is empty; skipping committed= output."
    return 0
  fi
  {
    echo "committed=${val}"
  } >>"$GITHUB_OUTPUT"
}

if git diff --staged --quiet; then
  echo "No staged changes to commit."
  record_committed_output false
  exit 0
fi

git commit -m "$commit_message"

if git push origin HEAD:main; then
  echo "Push to main succeeded."
  record_committed_output true
  exit 0
fi

echo "::warning::Initial push failed; attempting one rebase retry."
git_dir="$(git rev-parse --git-dir 2>/dev/null)" || true
if [[ -n "${git_dir:-}" && -f "${git_dir}/shallow" ]]; then
  echo "::notice::Shallow clone detected; deepening history before rebase."
  git fetch --unshallow 2>/dev/null || git fetch --deepen=256 origin main 2>/dev/null || true
fi
if ! git pull --rebase origin main; then
  echo "::warning::Rebase failed after push rejection; leaving commit local to workflow run."
  record_committed_output false
  exit 0
fi

if ! git push origin HEAD:main; then
  echo "::warning::Retry push still failed; remote likely advanced again."
  record_committed_output false
  exit 0
fi

echo "Push retry to main succeeded."
record_committed_output true
