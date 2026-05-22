#!/usr/bin/env bash
# V51+V52+V53 manual push — run when network is stable
set -e

cd /Users/klebergarciaalcatrao/.openclaw/workspace/zion.app

echo "=== CODE-ONLY PUSH ==="
git push origin HEAD:refs/heads/main -- \
  scripts/ commands/ data/cc_memory.py \
  data/calibration_adj.jsonl data/escalation_categories.jsonl \
  data/ideas3_patch_hint.txt V49_HANDOFF.md V50_HANDOFF.md

echo "=== LARGE DATA BRANCH (optional) ==="
git push origin HEAD:refs/heads/v52-data

echo "=== VERIFY ==="
git log --oneline origin/main -1
git log --oneline HEAD -1
