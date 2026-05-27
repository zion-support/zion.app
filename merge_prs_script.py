#!/usr/bin/env python3
import subprocess
import sys
import time

def run_command(cmd):
    """Run a command and return the result"""
    try:
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
        return result.returncode == 0, result.stdout, result.stderr
    except Exception as e:
        return False, "", str(e)

def merge_pr(pr_number):
    """Try to merge a PR"""
    print(f"Attempting to merge PR #{pr_number}...")
    
    # First try direct merge
    success, stdout, stderr = run_command(f"gh pr merge {pr_number} --merge --delete-branch")
    if success:
        print(f"✅ PR #{pr_number} merged successfully!")
        return True
    
    # If direct merge fails, try with auto flag
    print(f"Direct merge failed for PR #{pr_number}, trying with --auto flag...")
    success, stdout, stderr = run_command(f"gh pr merge {pr_number} --merge --delete-branch --auto")
    if success:
        print(f"✅ PR #{pr_number} merged successfully with --auto flag!")
        return True
    
    # If auto merge fails, try to resolve conflicts
    print(f"Auto merge failed for PR #{pr_number}, attempting to resolve conflicts...")
    
    # Checkout the PR
    success, stdout, stderr = run_command(f"gh pr checkout {pr_number}")
    if not success:
        print(f"❌ Failed to checkout PR #{pr_number}: {stderr}")
        return False
    
    # Fetch and merge main
    success, stdout, stderr = run_command("git fetch origin main && git merge origin/main")
    if not success:
        print(f"❌ Failed to merge main into PR #{pr_number}: {stderr}")
        # Try to abort and continue
        run_command("git merge --abort")
        run_command("git checkout main")
        return False
    
    # If there are conflicts, resolve them by keeping our changes
    success, stdout, stderr = run_command("git status --porcelain | grep '^UU\\|^AA\\|^DD'")
    if success and stdout.strip():
        print(f"Resolving conflicts in PR #{pr_number}...")
        # Get list of conflicted files
        success, stdout, stderr = run_command("git status --porcelain | grep '^UU\\|^AA\\|^DD' | cut -c4-")
        if success and stdout.strip():
            conflicted_files = stdout.strip().split('\n')
            # Resolve by keeping our changes
            for file in conflicted_files:
                run_command(f"git checkout --ours {file}")
        
        # Remove deleted files
        run_command("git status --porcelain | grep '^DU\\|^DD' | cut -c4- | xargs -r git rm")
        
        # Add all changes
        run_command("git add .")
        
        # Commit
        success, stdout, stderr = run_command(f"git commit -m 'Resolve merge conflicts in PR {pr_number}'")
        if not success:
            print(f"❌ Failed to commit resolved conflicts for PR #{pr_number}: {stderr}")
            run_command("git checkout main")
            return False
    
    # Push changes
    success, stdout, stderr = run_command("git push origin HEAD")
    if not success:
        print(f"❌ Failed to push changes for PR #{pr_number}: {stderr}")
        run_command("git checkout main")
        return False
    
    # Try to merge again
    success, stdout, stderr = run_command(f"gh pr merge {pr_number} --merge --delete-branch")
    if success:
        print(f"✅ PR #{pr_number} merged successfully after conflict resolution!")
        run_command("git checkout main")
        return True
    
    print(f"❌ Failed to merge PR #{pr_number} after conflict resolution")
    run_command("git checkout main")
    return False

def main():
    # Get list of open PRs
    success, stdout, stderr = run_command("gh pr list --state open --json number --jq '.[].number'")
    if not success:
        print(f"❌ Failed to get list of open PRs: {stderr}")
        return
    
    pr_numbers = [int(line.strip()) for line in stdout.strip().split('\n') if line.strip()]
    print(f"Found {len(pr_numbers)} open PRs: {pr_numbers}")
    
    merged_count = 0
    failed_count = 0
    
    for pr_number in pr_numbers:
        if merge_pr(pr_number):
            merged_count += 1
        else:
            failed_count += 1
        
        # Small delay between PRs
        time.sleep(2)
    
    print(f"\n📊 Summary:")
    print(f"✅ Successfully merged: {merged_count}")
    print(f"❌ Failed to merge: {failed_count}")
    print(f"📝 Total processed: {len(pr_numbers)}")

if __name__ == "__main__":
    main()