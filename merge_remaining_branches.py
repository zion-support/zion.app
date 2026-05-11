#!/usr/bin/env python3
"""
Script to merge remaining cursor branches into main
"""

import subprocess
import sys
import json
from datetime import datetime

def run_command(cmd, capture_output=True, check=False, timeout=60):
    """Run a shell command and return the result"""
    try:
        print(f"→ {cmd}")
        result = subprocess.run(
            cmd,
            shell=True,
            capture_output=capture_output,
            text=True,
            check=check,
            timeout=timeout
        )
        if result.stdout and capture_output:
            print(result.stdout)
        if result.stderr and result.returncode != 0:
            print(result.stderr)
        return result
    except subprocess.TimeoutExpired:
        print(f"⚠ Command timed out after {timeout}s")
        return None
    except subprocess.CalledProcessError as e:
        print(f"⚠ Command failed with return code {e.returncode}")
        return e
    except Exception as e:
        print(f"⚠ Exception: {e}")
        return None

def get_remaining_branches():
    """Get remaining cursor branches that haven't been merged"""
    result = run_command("git branch -r | grep 'cursor/fix-errors-and-merge-to-main' | head -100")
    if not result or result.returncode != 0:
        return []
    
    branches = []
    for line in result.stdout.strip().split('\n'):
        if line.strip():
            branch = line.strip().replace('origin/', '')
            branches.append(branch)
    
    return branches

def merge_branch(branch_name):
    """Merge a single branch into main"""
    print(f"\n{'='*80}")
    print(f"🔄 Processing branch: {branch_name}")
    print(f"{'='*80}")
    
    # Fetch the branch
    print(f"📥 Fetching branch {branch_name}...")
    result = run_command(f"git fetch origin {branch_name}")
    if not result or result.returncode != 0:
        print(f"❌ Failed to fetch {branch_name}")
        return False
    
    # Attempt to merge
    print(f"🔀 Attempting to merge {branch_name} into main...")
    result = run_command(f"git merge origin/{branch_name} --no-edit -m 'Merge branch {branch_name} into main'")
    
    if result and result.returncode == 0:
        print(f"✅ Successfully merged {branch_name}")
        return True
    else:
        print(f"❌ Failed to merge {branch_name}")
        return False

def main():
    print("🚀 Starting Remaining Branch Merge Process")
    print(f"⏰ Started at: {datetime.now()}")
    print("="*80)
    
    # Ensure we're on main branch
    print("📍 Ensuring we're on main branch...")
    run_command("git checkout main")
    
    # Get remaining branches
    print("📋 Getting remaining branches...")
    branches = get_remaining_branches()
    
    if not branches:
        print("❌ No branches found to merge")
        return 1
    
    print(f"Found {len(branches)} branches to process")
    
    # Track results
    results = {
        "timestamp": datetime.now().isoformat(),
        "total_branches": len(branches),
        "successful": 0,
        "failed": 0,
        "successful_branches": [],
        "failed_branches": []
    }
    
    # Process each branch
    for i, branch in enumerate(branches, 1):
        print(f"\n[{i}/{len(branches)}] Processing {branch}...")
        
        if merge_branch(branch):
            results["successful"] += 1
            results["successful_branches"].append(branch)
        else:
            results["failed"] += 1
            results["failed_branches"].append(branch)
    
    # Save results
    with open('remaining_merge_report.json', 'w') as f:
        json.dump(results, f, indent=2)
    
    print(f"\n{'='*80}")
    print("📊 MERGE SUMMARY")
    print(f"{'='*80}")
    print(f"Total branches processed: {results['total_branches']}")
    print(f"Successfully merged: {results['successful']}")
    print(f"Failed to merge: {results['failed']}")
    print(f"Success rate: {(results['successful']/results['total_branches'])*100:.1f}%")
    
    if results["failed_branches"]:
        print(f"\n❌ Failed branches:")
        for branch in results["failed_branches"]:
            print(f"  - {branch}")
    
    print(f"\n✅ Results saved to remaining_merge_report.json")
    
    return 0

if __name__ == "__main__":
    sys.exit(main())