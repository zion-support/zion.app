#!/usr/bin/env python3
"""
Script to automatically resolve merge conflicts
"""
import subprocess
import os
import re

def run_command(cmd):
    """Run a shell command and return the result"""
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    return result.stdout, result.stderr, result.returncode

def resolve_conflicts():
    """Resolve all merge conflicts automatically"""
    print("🔧 Resolving merge conflicts...")
    
    # Get list of conflicted files
    stdout, stderr, returncode = run_command("git diff --name-only --diff-filter=U")
    if returncode != 0:
        print(f"Error getting conflicted files: {stderr}")
        return False
    
    conflicted_files = [f.strip() for f in stdout.split('\n') if f.strip()]
    print(f"Found {len(conflicted_files)} conflicted files")
    
    for file_path in conflicted_files:
        print(f"  Resolving {file_path}")
        if not resolve_file_conflicts(file_path):
            print(f"  ❌ Failed to resolve {file_path}")
            return False
        else:
            print(f"  ✅ Resolved {file_path}")
    
    return True

def resolve_file_conflicts(file_path):
    """Resolve conflicts in a specific file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Remove conflict markers and keep HEAD version
        lines = content.split('\n')
        new_lines = []
        skip_until_end = False
        
        for line in lines:
            if '<<<<<<< HEAD' in line:
                skip_until_end = False
                continue
            elif '=======' in line:
                skip_until_end = True
                continue
            elif '>>>>>>>' in line:
                skip_until_end = False
                continue
            elif not skip_until_end:
                new_lines.append(line)
        
        # Write the resolved content
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write('\n'.join(new_lines))
        
        # Add the file to git
        run_command(f"git add {file_path}")
        return True
        
    except Exception as e:
        print(f"Error resolving {file_path}: {e}")
        return False

def main():
    """Main function"""
    print("🚀 Starting conflict resolution...")
    
    if resolve_conflicts():
        print("✅ All conflicts resolved successfully")
        
        # Commit the resolution
        stdout, stderr, returncode = run_command("git commit -m 'Auto-resolve merge conflicts'")
        if returncode == 0:
            print("✅ Changes committed successfully")
            return True
        else:
            print(f"❌ Failed to commit: {stderr}")
            return False
    else:
        print("❌ Failed to resolve conflicts")
        return False

if __name__ == "__main__":
    main()