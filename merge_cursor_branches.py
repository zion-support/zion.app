#!/usr/bin/env python3
"""
Script to merge all cursor branches into main
"""

import subprocess
import sys
import os
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
    """Get all cursor branches"""
    success, output, error = run_command("git branch -r | grep 'cursor/fix-errors-and-merge-to-main' | head -500")
    if not success:
        print(f"Error getting branches: {error}")
        return []
    
    branches = []
    for line in output.strip().split('\n'):
        if line.strip():
            branch_name = line.strip().replace('origin/', '')
            branches.append(branch_name)
    
    return branches

def merge_branch(branch_name: str) -> Dict[str, Any]:
    """Attempt to merge a branch"""
    print(f"🔄 Merging {branch_name}...")
    
    # Try to merge
    success, output, error = run_command(f"git merge origin/{branch_name} --no-ff -m 'Merge {branch_name} into main'")
    
    if success:
        if "Already up to date" in output:
            return {"success": True, "status": "already_merged", "output": output}
        else:
            return {"success": True, "status": "merged", "output": output}
    else:
        # Check if there are conflicts
        if "CONFLICT" in error or "conflict" in error.lower():
            print(f"⚠️  Conflicts detected in {branch_name}")
            # Try to resolve conflicts automatically
            return resolve_conflicts(branch_name)
        else:
            return {"success": False, "status": "failed", "error": error}

def resolve_conflicts(branch_name: str) -> Dict[str, Any]:
    """Resolve conflicts automatically"""
    print(f"🔧 Resolving conflicts for {branch_name}")
    
    # Get conflicted files
    success, output, error = run_command("git status --porcelain")
    if not success:
        return {"success": False, "status": "conflict_resolution_failed", "error": error}
    
    conflicted_files = []
    for line in output.strip().split('\n'):
        if line.startswith('UU') or line.startswith('AA') or line.startswith('DD'):
            file_path = line[3:].strip()
            conflicted_files.append(file_path)
    
    if not conflicted_files:
        return {"success": False, "status": "no_conflicts_found", "error": "No conflicted files found"}
    
    print(f"📁 Resolving conflicts in {len(conflicted_files)} files")
    
    # Try to resolve conflicts by taking the incoming version
    for file_path in conflicted_files:
        success, output, error = run_command(f"git checkout --theirs '{file_path}'")
        if success:
            run_command(f"git add '{file_path}'")
    
    # Try to commit the merge
    success, output, error = run_command("git commit --no-edit")
    if success:
        return {"success": True, "status": "conflicts_resolved", "output": output}
    else:
        # If commit fails, abort the merge
        run_command("git merge --abort")
        return {"success": False, "status": "commit_failed", "error": error}

def main():
    """Main function"""
    print("🚀 Starting cursor branch merge process")
    
    # Ensure we're on main branch
    success, output, error = run_command("git checkout main")
    if not success:
        print(f"❌ Failed to checkout main: {error}")
        return
    
    # Get cursor branches
    branches = get_cursor_branches()
    print(f"📋 Found {len(branches)} cursor branches to process")
    
    # Process branches
    results = {
        "successful": [],
        "failed": [],
        "already_merged": [],
        "conflicts_resolved": []
    }
    
    for i, branch in enumerate(branches):
        print(f"\n📝 Processing {i+1}/{len(branches)}: {branch}")
        
        result = merge_branch(branch)
        
        if result["success"]:
            if result["status"] == "already_merged":
                results["already_merged"].append(branch)
            elif result["status"] == "merged":
                results["successful"].append(branch)
            elif result["status"] == "conflicts_resolved":
                results["conflicts_resolved"].append(branch)
        else:
            results["failed"].append({"branch": branch, "error": result.get("error", "Unknown error")})
        
        # Progress update every 10 branches
        if (i + 1) % 10 == 0:
            print(f"📊 Progress: {i+1}/{len(branches)} processed")
    
    # Print summary
    print(f"\n📊 Merge Summary:")
    print(f"✅ Successfully merged: {len(results['successful'])}")
    print(f"🔄 Already merged: {len(results['already_merged'])}")
    print(f"🔧 Conflicts resolved: {len(results['conflicts_resolved'])}")
    print(f"❌ Failed: {len(results['failed'])}")
    
    # Push changes
    print("\n🚀 Pushing changes to remote...")
    success, output, error = run_command("git push origin main")
    if success:
        print("✅ Successfully pushed all changes")
    else:
        print(f"❌ Failed to push changes: {error}")
    
    # Save results
    import json
    with open('cursor_branch_merge_results.json', 'w') as f:
        json.dump(results, f, indent=2)
    
    print(f"\n📄 Results saved to cursor_branch_merge_results.json")

if __name__ == "__main__":
    main()