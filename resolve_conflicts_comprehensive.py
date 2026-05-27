#!/usr/bin/env python3
"""
Comprehensive merge conflict resolution script.
This script will resolve all merge conflicts by accepting the current version (HEAD)
and removing files that were deleted in the current branch.
"""

import subprocess
import os
import sys
import re
from pathlib import Path

def run_command(cmd, cwd=None):
    """Run a shell command and return the result."""
    try:
        result = subprocess.run(cmd, shell=True, cwd=cwd, capture_output=True, text=True)
        return result.returncode == 0, result.stdout, result.stderr
    except Exception as e:
        return False, "", str(e)

def get_conflicted_files():
    """Get list of files with merge conflicts."""
    success, stdout, stderr = run_command("git status --porcelain")
    if not success:
        print(f"Error getting git status: {stderr}")
        return []
    
    conflicted_files = []
    for line in stdout.split('\n'):
        if line.startswith('UU') or line.startswith('AA') or line.startswith('DD') or line.startswith('AU') or line.startswith('UA'):
            file_path = line[3:].strip()
            conflicted_files.append((file_path, line[:2]))
    
    return conflicted_files

def resolve_file_conflict(file_path, conflict_type):
    """Resolve conflict for a specific file."""
    print(f"  Resolving {file_path} ({conflict_type})...")
    
    if conflict_type in ['DD', 'AU']:
        # File was deleted in current branch, remove it
        success, stdout, stderr = run_command(f"git rm {file_path}")
        if success:
            print(f"    ✅ Removed deleted file {file_path}")
        else:
            print(f"    ❌ Failed to remove {file_path}: {stderr}")
    elif conflict_type in ['UU', 'AA', 'UA']:
        # File has content conflicts, accept current version
        if os.path.exists(file_path):
            # Use git checkout to accept current version
            success, stdout, stderr = run_command(f"git checkout --ours {file_path}")
            if success:
                success2, stdout2, stderr2 = run_command(f"git add {file_path}")
                if success2:
                    print(f"    ✅ Resolved content conflict for {file_path}")
                else:
                    print(f"    ❌ Failed to add {file_path}: {stderr2}")
            else:
                print(f"    ❌ Failed to checkout {file_path}: {stderr}")
        else:
            print(f"    ⚠️  File {file_path} doesn't exist, skipping")

def resolve_all_conflicts():
    """Resolve all merge conflicts."""
    print("🔍 Checking for merge conflicts...")
    
    conflicted_files = get_conflicted_files()
    
    if not conflicted_files:
        print("✅ No merge conflicts found.")
        return True
    
    print(f"📋 Found {len(conflicted_files)} files with conflicts:")
    for file_path, conflict_type in conflicted_files:
        print(f"  - {file_path} ({conflict_type})")
    
    print("\n🔧 Resolving conflicts...")
    
    for file_path, conflict_type in conflicted_files:
        resolve_file_conflict(file_path, conflict_type)
    
    # Check if all conflicts are resolved
    remaining_conflicts = get_conflicted_files()
    if remaining_conflicts:
        print(f"⚠️  Still {len(remaining_conflicts)} files with conflicts:")
        for file_path, conflict_type in remaining_conflicts:
            print(f"  - {file_path} ({conflict_type})")
        return False
    
    print("✅ All merge conflicts resolved!")
    return True

def main():
    """Main function to resolve merge conflicts."""
    print("🚀 Starting comprehensive merge conflict resolution...")
    
    # Check if we're in a merge state
    success, stdout, stderr = run_command("git status")
    if "You have unmerged paths" not in stdout and "All conflicts fixed" not in stdout:
        print("❌ Not in a merge state. Please start a merge first.")
        return False
    
    if resolve_all_conflicts():
        print("\n✅ All conflicts resolved successfully!")
        
        # Commit the merge
        success, stdout, stderr = run_command("git commit -m 'Resolve merge conflicts - accept current version'")
        if success:
            print("✅ Merge committed successfully")
            return True
        else:
            print(f"❌ Failed to commit merge: {stderr}")
            return False
    else:
        print("❌ Failed to resolve all conflicts")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)