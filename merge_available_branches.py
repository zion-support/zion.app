#!/usr/bin/env python3
"""
Script to merge available cursor branches into main
"""

import subprocess
import sys
import os
from typing import List, Tuple

def run_command(cmd: str, cwd: str = None) -> Tuple[bool, str, str]:
    """Run a command and return (success, output, error)"""
    try:
        result = subprocess.run(
            cmd, 
            shell=True, 
            cwd=cwd or os.getcwd(),
            capture_output=True, 
            text=True, 
            timeout=300
        )
        return result.returncode == 0, result.stdout, result.stderr
    except subprocess.TimeoutExpired:
        return False, "", "Command timed out"
    except Exception as e:
        return False, "", str(e)

def get_available_branches() -> List[str]:
    """Get available cursor branches"""
    success, output, error = run_command("git branch -r | grep 'cursor/fix-errors-and-merge-to-main' | head -50")
    if not success:
        print(f"Error getting branches: {error}")
        return []
    
    branches = []
    for line in output.strip().split('\n'):
        branch = line.strip().replace('origin/', '')
        if branch and not branch.startswith('HEAD'):
            branches.append(branch)
    return branches

def merge_branch(branch_name: str) -> bool:
    """Attempt to merge a branch into main"""
    print(f"\n🔄 Attempting to merge branch: {branch_name}")
    
    # Try to merge the branch
    success, output, error = run_command(f"git merge origin/{branch_name} --no-ff -m 'Merge {branch_name} into main'")
    
    if success:
        print(f"✅ Successfully merged {branch_name}")
        return True
    else:
        print(f"❌ Failed to merge {branch_name}: {error}")
        
        # Check if there are conflicts
        if "CONFLICT" in error or "conflict" in error.lower():
            print(f"🔧 Resolving conflicts for {branch_name}")
            return resolve_conflicts_and_merge(branch_name)
        
        return False

def resolve_conflicts_and_merge(branch_name: str) -> bool:
    """Resolve conflicts and complete merge"""
    print(f"🔧 Resolving conflicts for {branch_name}")
    
    # Get list of conflicted files
    success, output, error = run_command("git status --porcelain")
    if not success:
        print(f"❌ Failed to get git status: {error}")
        return False
    
    conflicted_files = []
    for line in output.strip().split('\n'):
        if line.startswith('UU') or line.startswith('AA') or line.startswith('DD'):
            file_path = line[3:].strip()
            conflicted_files.append(file_path)
    
    print(f"📁 Found {len(conflicted_files)} conflicted files: {conflicted_files}")
    
    # Resolve conflicts automatically
    for file_path in conflicted_files:
        if not resolve_file_conflicts(file_path):
            print(f"❌ Failed to resolve conflicts in {file_path}")
            return False
    
    # Add resolved files
    success, output, error = run_command("git add .")
    if not success:
        print(f"❌ Failed to add resolved files: {error}")
        return False
    
    # Complete the merge
    success, output, error = run_command("git commit --no-edit")
    if success:
        print(f"✅ Successfully resolved conflicts and merged {branch_name}")
        return True
    else:
        print(f"❌ Failed to complete merge: {error}")
        return False

def resolve_file_conflicts(file_path: str) -> bool:
    """Resolve conflicts in a specific file"""
    print(f"🔧 Resolving conflicts in {file_path}")
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Simple conflict resolution strategy
        # Remove conflict markers and keep the HEAD version
        lines = content.split('\n')
        resolved_lines = []
        in_conflict = False
        
        for line in lines:
            if line.startswith('<<<<<<< HEAD'):
                in_conflict = True
                continue
            elif line.startswith('======='):
                continue
            elif line.startswith('>>>>>>>'):
                in_conflict = False
                continue
            elif not in_conflict:
                resolved_lines.append(line)
        
        # Write resolved content
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write('\n'.join(resolved_lines))
        
        print(f"✅ Resolved conflicts in {file_path}")
        return True
        
    except Exception as e:
        print(f"❌ Error resolving conflicts in {file_path}: {e}")
        return False

def main():
    """Main function to merge available branches"""
    print("🚀 Starting branch merge process")
    
    # Ensure we're on main branch
    success, output, error = run_command("git checkout main")
    if not success:
        print(f"❌ Failed to checkout main: {error}")
        return
    
    # Get available branches
    branches = get_available_branches()
    print(f"🌿 Found {len(branches)} available cursor branches")
    
    # Merge branches
    successful_merges = 0
    failed_merges = 0
    
    for i, branch in enumerate(branches[:30]):  # Process first 30 branches
        print(f"\n📝 Processing branch {i+1}/{min(30, len(branches))}: {branch}")
        
        if merge_branch(branch):
            successful_merges += 1
        else:
            failed_merges += 1
    
    print(f"\n📊 Merge Summary:")
    print(f"✅ Successful merges: {successful_merges}")
    print(f"❌ Failed merges: {failed_merges}")
    
    # Push changes
    print("\n🚀 Pushing changes to remote...")
    success, output, error = run_command("git push origin main")
    if success:
        print("✅ Successfully pushed all changes")
    else:
        print(f"❌ Failed to push changes: {error}")

if __name__ == "__main__":
    main()