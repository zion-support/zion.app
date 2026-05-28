#!/usr/bin/env python3
"""
Get current open PRs from GitHub API
"""

import json
import subprocess
import sys
import os

def run_command(cmd, capture_output=True):
    """Run a shell command and return the result"""
    try:
        result = subprocess.run(
            cmd,
            shell=True,
            capture_output=capture_output,
            text=True,
            check=False
        )
        return result
    except Exception as e:
        print(f"Error running command: {e}")
        return None

def get_github_token():
    """Get GitHub token from environment or git config"""
    # Try environment variable first
    token = os.getenv('GITHUB_TOKEN')
    if token:
        return token
    
    # Try git config
    result = run_command("git config --get github.token")
    if result and result.returncode == 0:
        return result.stdout.strip()
    
    return None

def get_open_prs():
    """Get open PRs using GitHub CLI or API"""
    # Try using GitHub CLI first
    result = run_command("gh pr list --state open --json number,title,headRefName,headRepositoryOwner")
    if result and result.returncode == 0:
        try:
            prs = json.loads(result.stdout)
            return prs
        except json.JSONDecodeError:
            pass
    
    # Fallback: get from available branches
    print("GitHub CLI not available, getting branches from git...")
    result = run_command("git branch -r | grep 'cursor/fix-errors-and-merge-to-main' | head -20")
    if result and result.returncode == 0:
        branches = []
        for line in result.stdout.strip().split('\n'):
            if line.strip():
                branch_name = line.strip().replace('origin/', '')
                # Create a mock PR entry
                branches.append({
                    'number': f"BRANCH_{branch_name}",
                    'title': 'Fix errors and merge to main',
                    'headRefName': branch_name,
                    'headRepositoryOwner': {'login': 'Zion-Holdings'}
                })
        return branches
    
    return []

def main():
    print("🔍 Getting current open PRs...")
    
    prs = get_open_prs()
    
    if not prs:
        print("❌ No open PRs found")
        return 1
    
    print(f"Found {len(prs)} open PR(s)")
    
    # Save to file
    with open('current_open_prs_fresh.json', 'w') as f:
        json.dump(prs, f, indent=2)
    
    print("✅ Saved to current_open_prs_fresh.json")
    
    # Show first few
    print("\nFirst 5 PRs:")
    for i, pr in enumerate(prs[:5]):
        print(f"  {i+1}. PR #{pr['number']}: {pr['title']} ({pr['headRefName']})")
    
    if len(prs) > 5:
        print(f"  ... and {len(prs) - 5} more")
    
    return 0

if __name__ == "__main__":
    sys.exit(main())