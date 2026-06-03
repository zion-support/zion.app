#!/usr/bin/env bash
set -euo pipefail

REPO="${ZION_REPO:-C:/Users/Zion/zion-support.github.io}"
PUSH_HELPER="${REPO}/scripts/push-file-to-main.cjs"
LOG_DIR="${REPO}/.error-logs"
mkdir -p "${LOG_DIR}"

if [ ! -d "${REPO}/.git" ]; then
  echo "Repository not found: ${REPO}" >&2
  exit 2
fi

ts="$(date -Iseconds)"
logfile="${LOG_DIR}/git-wrapper-${ts//:/-}.log"
{
  echo "[${ts}] git-wrapper start cwd=${REPO}"
  cd "${REPO}"
  git status --short
} | tee -a "${logfile}"

push_git() {
  cd "${REPO}"
  git config --global credential.helper 'store --file ~/.git-credentials' >/dev/null 2>&1 || true
  timeout 240 git push "${1:-origin}" "${2:-main}"
}

push_github_api() {
  cd "${REPO}"
  node "${PUSH_HELPER}"
}

echo "git-wrapper ready main=${REPO}"
