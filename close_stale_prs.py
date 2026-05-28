#!/usr/bin/env python3
"""
Close stale PRs that have branches that no longer exist
"""

import subprocess
import json
import sys

def run_command(cmd, capture_output=True):
    """Run a shell command and return the result"""
    try:
        print(f"→ {cmd}")
        result = subprocess.run(
            cmd,
            shell=True,
            capture_output=capture_output,
            text=True,
            timeout=60
        )
        if result.stdout and capture_output:
            print(result.stdout)
        if result.stderr and result.returncode != 0:
            print(result.stderr)
        return result
    except Exception as e:
        print(f"⚠ Exception: {e}")
        return None

def close_stale_prs():
    """Close PRs that have branches that no longer exist"""
    
    # List of PR numbers that failed because branches don't exist
    stale_prs = [
        32379, 31846, 31845, 31843, 31842, 31841, 31840, 31839, 31838, 31836,
        31835, 31834, 31833, 31832, 31831, 31830, 31829, 31828, 31827, 31826,
        31825, 31824, 31823, 31822, 31820, 31819, 31817, 31815, 31814, 31813
    ]
    
    print(f"🔍 Found {len(stale_prs)} stale PRs to close")
    
    closed_count = 0
    failed_count = 0
    
    for pr_number in stale_prs:
        print(f"\n🔄 Closing PR #{pr_number}...")
        
        # Try to close the PR
        result = run_command(f"gh pr close {pr_number} --comment 'Closing stale PR - branch no longer exists'")
        
        if result and result.returncode == 0:
            print(f"✅ Successfully closed PR #{pr_number}")
            closed_count += 1
        else:
            print(f"❌ Failed to close PR #{pr_number}")
            failed_count += 1
    
    print(f"\n📊 SUMMARY:")
    print(f"✅ Successfully closed: {closed_count}")
    print(f"❌ Failed to close: {failed_count}")
    
    return closed_count, failed_count

if __name__ == "__main__":
    try:
        closed, failed = close_stale_prs()
        sys.exit(0 if failed == 0 else 1)
    except KeyboardInterrupt:
        print("\n\n⚠️  Interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n\n💥 Fatal error: {e}")
        sys.exit(1)