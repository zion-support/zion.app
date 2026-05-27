#!/usr/bin/env python3
"""
Massive branch merge script to handle thousands of cursor branches
"""

import subprocess
import sys
import os
import time
from typing import List, Dict, Any

def run_command(cmd: str, cwd: str = None) -> tuple:
    """Run a command and return (success, output, error)"""
    try:
        result = subprocess.run(
            cmd, 
            shell=True, 
            cwd=cwd or os.getcwd(),
            capture_output=True, 
            text=True, 
            timeout=30
        )
        return result.returncode == 0, result.stdout, result.stderr
    except subprocess.TimeoutExpired:
        return False, "", "Command timed out"
    except Exception as e:
        return False, "", str(e)

def get_all_cursor_branches() -> List[str]:
    """Get all cursor branches from remote"""
    success, output, error = run_command("git branch -r | grep 'cursor/fix-errors-and-merge-to-main'")
    if not success:
        print(f"Error getting branches: {error}")
        return []
    
    branches = []
    for line in output.strip().split('\n'):
        if line.strip():
            branch_name = line.strip().replace('origin/', '')
            branches.append(branch_name)
    
    return branches

def merge_branch_fast(branch_name: str) -> bool:
    """Fast merge attempt for a branch"""
    # Try to merge without fetching first (assume already fetched)
    success, output, error = run_command(f"git merge origin/{branch_name} --no-ff -m 'Merge {branch_name}'")
    
    if success:
        return True
    else:
        # If merge fails, try to resolve conflicts quickly
        if "CONFLICT" in error or "conflict" in error.lower():
            # Use our version for conflicts
            run_command("git checkout --ours .")
            run_command("git add .")
            success, _, _ = run_command(f"git commit --no-edit")
            return success
        return False

def main():
    """Main function to merge all cursor branches efficiently"""
    print("🚀 Starting massive branch merge process")
    
    # Ensure we're on main branch
    success, output, error = run_command("git checkout main")
    if not success:
        print(f"❌ Failed to checkout main: {error}")
        return
    
    # Get all cursor branches
    branches = get_all_cursor_branches()
    print(f"📋 Found {len(branches)} cursor branches to process")
    
    if not branches:
        print("❌ No cursor branches found")
        return
    
    # Process branches in large batches
    successful_merges = 0
    failed_merges = 0
    batch_size = 200  # Process 200 branches at a time
    
    for i in range(0, len(branches), batch_size):
        batch = branches[i:i + batch_size]
        print(f"\n📦 Processing batch {i//batch_size + 1} ({len(batch)} branches)")
        
        batch_success = 0
        batch_failed = 0
        
        for branch_name in batch:
            if merge_branch_fast(branch_name):
                batch_success += 1
                successful_merges += 1
            else:
                batch_failed += 1
                failed_merges += 1
        
        print(f"✅ Batch {i//batch_size + 1} complete: {batch_success} success, {batch_failed} failed")
        
        # Push changes after each batch
        if batch_success > 0:
            print(f"🚀 Pushing batch {i//batch_size + 1}...")
            success, output, error = run_command("git push origin main")
            if success:
                print(f"✅ Successfully pushed batch {i//batch_size + 1}")
            else:
                print(f"❌ Failed to push batch {i//batch_size + 1}: {error}")
                # Try to pull and push again
                run_command("git pull origin main --no-rebase")
                run_command("git push origin main")
        
        # Small delay between batches
        time.sleep(1)
    
    print(f"\n📊 Final Summary:")
    print(f"✅ Successful merges: {successful_merges}")
    print(f"❌ Failed merges: {failed_merges}")
    print(f"📈 Success rate: {successful_merges/(successful_merges+failed_merges)*100:.1f}%")

if __name__ == "__main__":
    main()