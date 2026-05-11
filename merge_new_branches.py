#!/usr/bin/env python3
"""
Merge branches that have new changes not already in main
"""

import json
import subprocess
import sys
from datetime import datetime
import time

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
            print(f"Error: {result.stderr}")
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

def get_branches_with_changes():
    """Get branches that have commits not in main"""
    print("🔍 Finding branches with new changes...")
    
    # Get all cursor branches
    result = run_command("git branch -r | grep 'cursor/fix-errors-and-merge-to-main' | head -100")
    if not result or result.returncode != 0:
        return []
    
    branches = []
    for line in result.stdout.strip().split('\n'):
        if line.strip():
            branch_name = line.strip().replace('origin/', '')
            
            # Check if branch has commits not in main
            result = run_command(f"git log main..origin/{branch_name} --oneline")
            if result and result.returncode == 0 and result.stdout.strip():
                branches.append(branch_name)
                print(f"  ✅ {branch_name} has {len(result.stdout.strip().split('\\n'))} new commits")
            else:
                print(f"  ⏭️  {branch_name} already up to date")
    
    return branches

def merge_branch(branch_name):
    """Attempt to merge a branch into main"""
    print(f"\n{'='*60}")
    print(f"🔄 Processing branch: {branch_name}")
    print(f"{'='*60}")
    
    # Fetch the branch
    print(f"📥 Fetching branch {branch_name}...")
    result = run_command(f"git fetch origin {branch_name}")
    if not result or result.returncode != 0:
        print(f"❌ Failed to fetch branch {branch_name}")
        return False
    
    # Try to merge
    print(f"🔀 Attempting to merge {branch_name} into main...")
    merge_msg = f"Merge branch {branch_name}"
    result = run_command(f"git merge origin/{branch_name} --no-edit -m '{merge_msg}'")
    
    if result and result.returncode == 0:
        print(f"✅ Successfully merged {branch_name}")
        return True
    else:
        print(f"❌ Failed to merge {branch_name}")
        # Try to abort the merge
        run_command("git merge --abort")
        return False

def main():
    """Main execution function"""
    print(f"🚀 Starting Smart Branch Merge Process at {datetime.now()}")
    print(f"{'='*80}\n")
    
    # Ensure we're on main branch
    print("📍 Ensuring we're on main branch...")
    result = run_command("git checkout main")
    if not result or result.returncode != 0:
        print("❌ Failed to checkout main branch")
        return 1
    
    # Pull latest changes
    print("📥 Pulling latest changes from main...")
    result = run_command("git pull origin main")
    if not result or result.returncode != 0:
        print("⚠️  Warning: Failed to pull latest changes, continuing anyway...")
    
    # Get branches with changes
    branches = get_branches_with_changes()
    if not branches:
        print("❌ No branches with new changes found")
        return 0
    
    print(f"\nFound {len(branches)} branch(es) with new changes to merge\n")
    
    # Track results
    successful_merges = []
    failed_merges = []
    
    # Process each branch
    for i, branch in enumerate(branches, 1):
        print(f"\n[{i}/{len(branches)}] Processing {branch}...")
        
        success = merge_branch(branch)
        
        if success:
            successful_merges.append(branch)
        else:
            failed_merges.append(branch)
        
        # Small delay to avoid overwhelming git
        if i < len(branches):
            time.sleep(1)
    
    # Final summary
    print(f"\n{'='*80}")
    print("📊 MERGE SUMMARY")
    print(f"{'='*80}")
    print(f"Total branches with changes: {len(branches)}")
    print(f"✅ Successfully merged: {len(successful_merges)}")
    print(f"❌ Failed to merge: {len(failed_merges)}")
    
    if successful_merges:
        print(f"\n✅ Successfully merged branches:")
        for branch in successful_merges:
            print(f"  • {branch}")
    
    if failed_merges:
        print(f"\n❌ Failed branches:")
        for branch in failed_merges:
            print(f"  • {branch}")
    
    # Push changes
    if successful_merges:
        print(f"\n📤 Pushing merged changes to origin/main...")
        push_result = run_command("git push origin main")
        if push_result and push_result.returncode == 0:
            print("✅ Successfully pushed all changes to main!")
        else:
            print("❌ Failed to push changes. You may need to push manually.")
            print("Run: git push origin main")
    
    print(f"\n🏁 Merge process completed at {datetime.now()}")
    
    # Write summary report
    report = {
        'timestamp': datetime.now().isoformat(),
        'total_branches_with_changes': len(branches),
        'successful': len(successful_merges),
        'failed': len(failed_merges),
        'successful_branches': successful_merges,
        'failed_branches': failed_merges
    }
    
    with open('smart_merge_report.json', 'w') as f:
        json.dump(report, f, indent=2)
    
    print("\n📝 Detailed report saved to: smart_merge_report.json")
    
    return 0 if not failed_merges else 1

if __name__ == "__main__":
    try:
        sys.exit(main())
    except KeyboardInterrupt:
        print("\n\n⚠️  Interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n\n💥 Fatal error: {e}")
        sys.exit(1)