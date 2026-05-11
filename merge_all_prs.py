#!/usr/bin/env python3
"""
Script to automatically merge all available PR branches into main
"""
import subprocess
import sys
import os

def run_command(cmd, cwd=None):
    """Run a command and return the result"""
    try:
        result = subprocess.run(cmd, shell=True, cwd=cwd, capture_output=True, text=True)
        return result.returncode == 0, result.stdout, result.stderr
    except Exception as e:
        return False, "", str(e)

def get_available_branches():
    """Get all available cursor branches"""
    success, stdout, stderr = run_command("git branch -r | grep 'cursor/fix-errors-and-merge-to-main' | head -20")
    if not success:
        print(f"Error getting branches: {stderr}")
        return []
    
    branches = []
    for line in stdout.strip().split('\n'):
        if line.strip():
            branch = line.strip().replace('origin/', '')
            branches.append(branch)
    
    return branches

def merge_branch(branch_name):
    """Try to merge a branch into main"""
    print(f"\n=== Attempting to merge {branch_name} ===")
    
    # Create temporary branch
    temp_branch = f"temp-merge-{branch_name.replace('/', '-')}"
    success, stdout, stderr = run_command(f"git checkout -b {temp_branch} origin/{branch_name}")
    if not success:
        print(f"Failed to checkout branch {branch_name}: {stderr}")
        return False
    
    # Switch back to main
    success, stdout, stderr = run_command("git checkout main")
    if not success:
        print(f"Failed to switch to main: {stderr}")
        return False
    
    # Try to merge
    success, stdout, stderr = run_command(f"git merge {temp_branch}")
    if not success:
        print(f"Merge conflict in {branch_name}: {stderr}")
        # Clean up temp branch
        run_command(f"git branch -D {temp_branch}")
        return False
    
    print(f"Successfully merged {branch_name}")
    
    # Clean up temp branch
    run_command(f"git branch -D {temp_branch}")
    return True

def main():
    """Main function"""
    print("Starting automatic PR merge process...")
    
    # Get available branches
    branches = get_available_branches()
    print(f"Found {len(branches)} branches to process")
    
    merged_count = 0
    failed_count = 0
    
    for branch in branches:
        if merge_branch(branch):
            merged_count += 1
            # Push after each successful merge
            success, stdout, stderr = run_command("git push origin main")
            if not success:
                print(f"Failed to push changes: {stderr}")
                # Pull latest changes and try again
                run_command("git pull origin main")
                run_command("git push origin main")
        else:
            failed_count += 1
    
    print(f"\n=== Merge Summary ===")
    print(f"Successfully merged: {merged_count}")
    print(f"Failed to merge: {failed_count}")
    print(f"Total processed: {len(branches)}")

if __name__ == "__main__":
    main()