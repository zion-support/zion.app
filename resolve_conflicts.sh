#!/usr/bin/env bash

set -euo pipefail

usage() {
  echo "Usage: $0 [ours|theirs] [scope]"
  echo "  strategy: merge side to keep when resolving (default: theirs)"
  echo "  scope:    path scope for marker scan fallback (default: app)"
  echo
  echo "Examples:"
  echo "  $0 theirs app"
  echo "  $0 ours ."
}

STRATEGY="${1:-theirs}"
SCOPE="${2:-app}"
DRY_RUN="${DRY_RUN:-false}"

if [[ "${STRATEGY}" != "ours" && "${STRATEGY}" != "theirs" ]]; then
  usage
  exit 1
fi

resolve_marker_blocks() {
  local file="$1"
  local strategy="$2"
  local temp_file
  temp_file="$(mktemp)"

  awk -v strategy="${strategy}" '
    /^<<<<<<< / { in_conflict = 1; next }
    /^=======/  { in_conflict = 2; next }
    /^>>>>>>> / { in_conflict = 0; next }
    in_conflict == 0 { print; next }
    (strategy == "ours"   && in_conflict == 1) { print; next }
    (strategy == "theirs" && in_conflict == 2) { print; next }
  ' "${file}" > "${temp_file}"

  mv "${temp_file}" "${file}"
}

echo "Resolving conflicts with strategy='${STRATEGY}', scope='${SCOPE}', dry_run='${DRY_RUN}'"

declare -a raw_files=()
declare -a conflicted_files=()
declare -A seen=()

# Active unmerged files during an in-progress merge/rebase/cherry-pick.
while IFS= read -r file; do
  [[ -n "${file}" ]] && raw_files+=("${file}")
done < <(git diff --name-only --diff-filter=U)

# Fallback: tracked files that still contain conflict markers.
if [[ ${#raw_files[@]} -eq 0 ]]; then
  while IFS= read -r tracked_file; do
    if rg -q "^<<<<<<< |^=======|^>>>>>>> " "${tracked_file}"; then
      raw_files+=("${tracked_file}")
    fi
  done < <(git ls-files "${SCOPE}")
fi

# De-duplicate file list.
for file in "${raw_files[@]}"; do
  if [[ -z "${seen[$file]+x}" ]]; then
    seen["$file"]=1
    conflicted_files+=("${file}")
  fi
done

if [[ ${#conflicted_files[@]} -eq 0 ]]; then
  echo "No conflicts found."
  exit 0
fi

resolved_count=0
for file in "${conflicted_files[@]}"; do
  if [[ ! -f "${file}" ]]; then
    echo "Skipping missing file: ${file}"
    continue
  fi

  echo "Resolving ${file}..."
  if [[ "${DRY_RUN}" == "true" ]]; then
    continue
  fi

  if [[ -n "$(git ls-files -u -- "${file}")" ]]; then
    # Index-level conflict exists: resolve using git's merge stages.
    git checkout "--${STRATEGY}" -- "${file}"
  else
    # Marker-only conflict remnants: strip markers and keep selected side.
    resolve_marker_blocks "${file}" "${STRATEGY}"
  fi

  git add "${file}"
  resolved_count=$((resolved_count + 1))
done

echo "Resolved ${resolved_count} file(s)."
