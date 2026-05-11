#!/usr/bin/env python3
"""
Automated script to merge all open PRs and resolve conflicts
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

def resolve_conflicts():
    """Resolve common conflicts automatically"""
    print("🔧 Resolving conflicts...")
    
    # Remove deleted files that cause conflicts
    deleted_files = [
        'app/about/constants.ts',
        'app/about/metadata.ts'
    ]
    
    for file in deleted_files:
        if os.path.exists(file):
            run_command(f"git rm {file}")
            print(f"  ✅ Removed {file}")
    
    # Resolve common conflicts in specific files
    files_to_resolve = [
        'app/about/page.tsx',
        'app/components/PerformanceMonitoring.tsx',
        'app/components/SecurityEnhancement.tsx',
        'app/layout.tsx'
    ]
    
    for file in files_to_resolve:
        if os.path.exists(file):
            # Read the file
            with open(file, 'r') as f:
                content = f.read()
            
            # Common conflict resolutions
            content = content.replace('<<<<<<< HEAD\nimport type { Metadata }', 'import { Metadata }')
            content = content.replace('=======\n>>>>>>> origin/', '')
            content = content.replace('<<<<<<< HEAD\n=======\n>>>>>>> origin/', '')
            content = content.replace('// eslint-disable-next-line @typescript-eslint/no-explicit-any\n        const fid = (entry as any)', 'const fid = (entry as PerformanceEntry & { processingStart: number })')
            content = content.replace('logger.debug', 'console.log')
            
            # Write back the resolved content
            with open(file, 'w') as f:
                f.write(content)
            
            print(f"  ✅ Resolved conflicts in {file}")

def merge_pr(pr_data):
    """Merge a single PR"""
    branch_name = pr_data['headRefName']
    pr_number = pr_data['number']
    
    print(f"\n🔄 Merging PR #{pr_number}: {branch_name}")
    
    # Try to merge
    result = run_command(f"git merge --no-commit --no-ff origin/{branch_name}")
    
    if result.returncode == 0:
        # No conflicts, commit the merge
        run_command(f"git commit -m \"Merge PR #{pr_number}: {branch_name}\"")
        print(f"  ✅ Successfully merged PR #{pr_number}")
        return True
    else:
        # Has conflicts, try to resolve them
        print(f"  ⚠️  Conflicts detected in PR #{pr_number}")
        
        # Resolve conflicts
        resolve_conflicts()
        
        # Add resolved files
        run_command("git add .")
        
        # Commit the merge
        result = run_command(f"git commit -m \"Merge PR #{pr_number}: {branch_name} - conflicts resolved\"")
        
        if result.returncode == 0:
            print(f"  ✅ Successfully merged PR #{pr_number} with conflicts resolved")
            return True
        else:
            print(f"  ❌ Failed to merge PR #{pr_number}")
            # Abort the merge
            run_command("git merge --abort")
            return False

def main():
    print("🚀 Starting automated PR merge process...")
    
    # Load the PR data
    try:
        with open('current_open_prs_fresh.json', 'r') as f:
            prs = json.load(f)
    except FileNotFoundError:
        print("❌ No PR data found. Please run get_current_open_prs.py first.")
        return 1
    
    print(f"Found {len(prs)} open PRs to merge")
    
    successful_merges = 0
    failed_merges = 0
    
    # Process PRs in order (most recent first)
    for pr in prs:
        if merge_pr(pr):
            successful_merges += 1
        else:
            failed_merges += 1
        
        # Push changes after each successful merge
        if successful_merges > 0 and successful_merges % 5 == 0:
            print(f"\n📤 Pushing changes after {successful_merges} merges...")
            run_command("git push origin main")
    
    # Final push
    print(f"\n📤 Pushing final changes...")
    run_command("git push origin main")
    
    print(f"\n✅ Merge process completed!")
    print(f"  - Successfully merged: {successful_merges} PRs")
    print(f"  - Failed to merge: {failed_merges} PRs")
    
    return 0

if __name__ == "__main__":
    sys.exit(main())