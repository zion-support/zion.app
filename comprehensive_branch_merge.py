#!/usr/bin/env python3
"""
Comprehensive script to merge all cursor branches efficiently
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
            timeout=60
        )
        return result.returncode == 0, result.stdout, result.stderr
    except subprocess.TimeoutExpired:
        return False, "", "Command timed out"
    except Exception as e:
        return False, "", str(e)

def get_cursor_branches() -> List[str]:
    """Get all cursor branches from remote"""
    success, output, error = run_command("git branch -r | grep 'cursor/fix-errors-and-merge-to-main' | head -100")
    if not success:
        print(f"Error getting branches: {error}")
        return []
    
    branches = []
    for line in output.strip().split('\n'):
        if line.strip():
            branch_name = line.strip().replace('origin/', '')
            branches.append(branch_name)
    
    return branches

def merge_branch(branch_name: str) -> bool:
    """Attempt to merge a branch into main"""
    print(f"🔄 Merging: {branch_name}")
    
    # Fetch the branch
    success, output, error = run_command(f"git fetch origin {branch_name}")
    if not success:
        print(f"❌ Failed to fetch {branch_name}: {error}")
        return False
    
    # Try to merge
    success, output, error = run_command(f"git merge origin/{branch_name} --no-ff -m 'Merge {branch_name}'")
    
    if success:
        print(f"✅ Successfully merged {branch_name}")
        return True
    else:
        # Check for conflicts
        if "CONFLICT" in error or "conflict" in error.lower():
            print(f"🔧 Resolving conflicts for {branch_name}")
            return resolve_conflicts(branch_name)
        else:
            print(f"❌ Failed to merge {branch_name}: {error}")
            return False

def resolve_conflicts(branch_name: str) -> bool:
    """Resolve conflicts automatically"""
    # Use our version (main branch) for conflicts
    success, output, error = run_command("git checkout --ours .")
    if not success:
        print(f"❌ Failed to checkout ours: {error}")
        return False
    
    # Add resolved files
    success, output, error = run_command("git add .")
    if not success:
        print(f"❌ Failed to add files: {error}")
        return False
    
    # Commit the resolution
    success, output, error = run_command(f"git commit --no-edit")
    if success:
        print(f"✅ Successfully resolved conflicts for {branch_name}")
        return True
    else:
        print(f"❌ Failed to commit resolution: {error}")
        return False

def main():
    """Main function to merge all cursor branches"""
    print("🚀 Starting comprehensive branch merge process")
    
    # Ensure we're on main branch
    success, output, error = run_command("git checkout main")
    if not success:
        print(f"❌ Failed to checkout main: {error}")
        return
    
    # Get cursor branches
    branches = get_cursor_branches()
    print(f"📋 Found {len(branches)} cursor branches to process")
    
    if not branches:
        print("❌ No cursor branches found")
        return
    
    # Process branches in batches
    successful_merges = 0
    failed_merges = 0
    batch_size = 50  # Process 50 branches at a time
    
    for i in range(0, len(branches), batch_size):
        batch = branches[i:i + batch_size]
        print(f"\n📦 Processing batch {i//batch_size + 1} ({len(batch)} branches)")
        
        for branch_name in batch:
            if merge_branch(branch_name):
                successful_merges += 1
            else:
                failed_merges += 1
            
            # Small delay to avoid overwhelming the system
            time.sleep(0.1)
        
        # Push changes after each batch
        print(f"🚀 Pushing batch {i//batch_size + 1}...")
        success, output, error = run_command("git push origin main")
        if success:
            print(f"✅ Successfully pushed batch {i//batch_size + 1}")
        else:
            print(f"❌ Failed to push batch {i//batch_size + 1}: {error}")
        
        # Longer delay between batches
        time.sleep(2)
    
    print(f"\n📊 Final Summary:")
    print(f"✅ Successful merges: {successful_merges}")
    print(f"❌ Failed merges: {failed_merges}")
    print(f"📈 Success rate: {successful_merges/(successful_merges+failed_merges)*100:.1f}%")

if __name__ == "__main__":
    main()