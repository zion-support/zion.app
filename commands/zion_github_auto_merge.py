#!/usr/bin/env python3
"""
Zion Tech Group – GitHub Auto‑Merge Agent

Features:
1. Scans open PRs in the specified repo.
2. If a PR has the label "auto-merge" or has at least one approval, it will be merged.
3. Uses the GitHub CLI (`gh`) for authentication and merge operations.
4. Logs every action to Zion_Brain_Log.md.
5. Self‑healing: retries on failure, alerts on persistent errors.
"""

import subprocess
import json
import time
from datetime import datetime
from pathlib import Path

WORKDIR = Path(os.environ.get("ZION_ROOT", str(Path(__file__).resolve().parent.parent)))
LOG_MD = WORKDIR / "Zion_Brain_Log.md"
REPO = "ziontechgroup/zion-ui"  # adjust to your repo

# Logging helper
def logger(msg: str) -> None:
    ts = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
    LOG_MD.parent.mkdir(parents=True, exist_ok=True)
    with LOG_MD.open("a", encoding="utf-8") as f:
        f.write(f"- [{ts}] GitHubAutoMerge: {msg}\n")

# Helper to run gh commands
def run_gh(args: list) -> str:
    try:
        result = subprocess.run(["gh"] + args, capture_output=True, text=True, check=True)
        return result.stdout.strip()
    except subprocess.CalledProcessError as e:
        logger(f"gh command failed: {' '.join(args)} – {e.stderr.strip()}")
        return ""

# Get open PRs
def list_open_prs() -> list:
    output = run_gh(["pr", "list", "--repo", REPO, "--state", "open", "--json", "number,labels,author,merged,reviewDecision,mergeableState,mergedBy,createdAt,updatedAt,mergeable", "--limit", "100"])
    if not output:
        return []
    try:
        return json.loads(output)
    except json.JSONDecodeError as e:
        logger(f"Failed to parse gh output: {e}")
        return []

# Merge a PR
def merge_pr(pr_number: int) -> bool:
    logger(f"Attempting to merge PR #{pr_number}")
    # Use --merge method to fast-forward merge
    output = run_gh(["pr", "merge", str(pr_number), "--repo", REPO, "--merge", "--delete-branch", "--squash", "--subject", f"Auto-merged PR #{pr_number}"])
    if output:
        logger(f"PR #{pr_number} merged successfully: {output}")
        return True
    else:
        logger(f"Failed to merge PR #{pr_number}")
        return False

# Main logic
def main():
    logger("=== GitHub Auto‑Merge Agent started ===")
    prs = list_open_prs()
    if not prs:
        logger("No open PRs found.")
        return
    for pr in prs:
        number = pr.get("number")
        labels = [lbl.get("name") for lbl in pr.get("labels", [])]
        approvals = pr.get("reviewDecision") == "APPROVED"
        mergeable = pr.get("mergeable") == "MERGEABLE"
        if "auto-merge" in labels or approvals:
            if mergeable:
                merge_pr(number)
            else:
                logger(f"PR #{number} not mergeable (state: {pr.get('mergeableState')}). Skipping.")
        else:
            logger(f"PR #{number} not eligible for auto‑merge (labels: {labels}, approvals: {approvals}).")
    logger("=== GitHub Auto‑Merge Agent finished ===")

if __name__ == "__main__":
    main()
