#!/usr/bin/env python3
"""
Script to merge all remaining cursor branches into main efficiently
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
    """Get all cursor branches"""
    success, output, error = run_command("git branch -r | grep 'cursor/fix-errors-and-merge-to-main' | wc -l")
    if not success:
        print(f"Error getting branch count: {error}")
        return []
    
    total_branches = int(output.strip())
    print(f"📊 Total cursor branches found: {total_branches}")
    
    # Get all branches in batches
    all_branches = []
    batch_size = 1000
    offset = 0
    
    while offset < total_branches:
        success, output, error = run_command(f"git branch -r | grep 'cursor/fix-errors-and-merge-to-main' | head -{offset + batch_size} | tail -{batch_size}")
        if not success:
            print(f"Error getting branches batch: {error}")
            break
        
        batch_branches = []
        for line in output.strip().split('\n'):
            if line.strip():
                branch_name = line.strip().replace('origin/', '')
                batch_branches.append(branch_name)
        
        if not batch_branches:
            break
            
        all_branches.extend(batch_branches)
        offset += batch_size
        print(f"📋 Collected {len(all_branches)} branches so far...")
    
    return all_branches

def merge_branch_batch(branches: List[str]) -> Dict[str, Any]:
    """Merge a batch of branches efficiently"""
    print(f"🔄 Merging batch of {len(branches)} branches...")
    
    # Try to merge all branches at once using git merge
    branch_refs = [f"origin/{branch}" for branch in branches]
    merge_cmd = f"git merge {' '.join(branch_refs)} --no-ff -m 'Batch merge of {len(branches)} cursor branches'"
    
    success, output, error = run_command(merge_cmd)
    
    if success:
        if "Already up to date" in output:
            return {"success": True, "status": "already_merged", "count": len(branches)}
        else:
            return {"success": True, "status": "merged", "count": len(branches)}
    else:
        # If batch merge fails, try individual merges
        print(f"⚠️  Batch merge failed, trying individual merges...")
        return merge_individual_branches(branches)

def merge_individual_branches(branches: List[str]) -> Dict[str, Any]:
    """Merge branches individually"""
    successful = 0
    already_merged = 0
    failed = 0
    
    for branch in branches:
        success, output, error = run_command(f"git merge origin/{branch} --no-ff -m 'Merge {branch} into main'")
        
        if success:
            if "Already up to date" in output:
                already_merged += 1
            else:
                successful += 1
        else:
            failed += 1
            if failed <= 5:  # Only show first 5 failures
                print(f"❌ Failed to merge {branch}: {error[:100]}...")
    
    return {
        "success": failed == 0,
        "status": "individual_merge",
        "successful": successful,
        "already_merged": already_merged,
        "failed": failed
    }

def main():
    """Main function"""
    print("🚀 Starting comprehensive cursor branch merge process")
    
    # Ensure we're on main branch
    success, output, error = run_command("git checkout main")
    if not success:
        print(f"❌ Failed to checkout main: {error}")
        return
    
    # Get all cursor branches
    branches = get_all_cursor_branches()
    if not branches:
        print("❌ No branches found to merge")
        return
    
    print(f"📋 Processing {len(branches)} cursor branches")
    
    # Process branches in batches
    batch_size = 100
    results = {
        "total_branches": len(branches),
        "successful": 0,
        "already_merged": 0,
        "failed": 0,
        "batches_processed": 0
    }
    
    for i in range(0, len(branches), batch_size):
        batch = branches[i:i + batch_size]
        batch_num = i // batch_size + 1
        total_batches = (len(branches) + batch_size - 1) // batch_size
        
        print(f"\n📝 Processing batch {batch_num}/{total_batches} ({len(batch)} branches)")
        
        result = merge_branch_batch(batch)
        results["batches_processed"] += 1
        
        if result["success"]:
            if result["status"] == "already_merged":
                results["already_merged"] += result.get("count", len(batch))
            elif result["status"] == "merged":
                results["successful"] += result.get("count", len(batch))
            elif result["status"] == "individual_merge":
                results["successful"] += result.get("successful", 0)
                results["already_merged"] += result.get("already_merged", 0)
                results["failed"] += result.get("failed", 0)
        else:
            results["failed"] += len(batch)
        
        # Progress update
        processed = min(i + batch_size, len(branches))
        print(f"📊 Progress: {processed}/{len(branches)} branches processed")
        
        # Small delay between batches
        if i + batch_size < len(branches):
            time.sleep(1)
    
    # Print final summary
    print(f"\n📊 Final Merge Summary:")
    print(f"✅ Successfully merged: {results['successful']}")
    print(f"🔄 Already merged: {results['already_merged']}")
    print(f"❌ Failed: {results['failed']}")
    print(f"📦 Total branches: {results['total_branches']}")
    print(f"📦 Batches processed: {results['batches_processed']}")
    
    # Push changes
    print("\n🚀 Pushing changes to remote...")
    success, output, error = run_command("git push origin main")
    if success:
        print("✅ Successfully pushed all changes")
    else:
        print(f"❌ Failed to push changes: {error}")
    
    # Save results
    import json
    with open('comprehensive_branch_merge_results.json', 'w') as f:
        json.dump(results, f, indent=2)
    
    print(f"\n📄 Results saved to comprehensive_branch_merge_results.json")

if __name__ == "__main__":
    main()