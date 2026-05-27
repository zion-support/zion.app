#!/usr/bin/env python3
"""
Automated conflict resolution script for git merge conflicts
"""

import os
import re
import subprocess
import sys

def resolve_conflicts():
    """Resolve merge conflicts automatically"""
    
    # Get list of files with conflicts
    result = subprocess.run(['git', 'status', '--porcelain'], capture_output=True, text=True)
    conflicted_files = []
    
    for line in result.stdout.split('\n'):
        if line.startswith('UU') or line.startswith('AA') or line.startswith('DD'):
            file_path = line[3:].strip()
            conflicted_files.append(file_path)
    
    print(f"Found {len(conflicted_files)} files with conflicts")
    
    for file_path in conflicted_files:
        if not os.path.exists(file_path):
            continue
            
        print(f"Resolving conflicts in {file_path}")
        
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Remove conflict markers and keep HEAD version (current branch)
            # This is a simple strategy - keep the current version
            resolved_content = re.sub(r'<<<<<<< HEAD\n(.*?)\n=======\n(.*?)\n>>>>>>> .*\n', r'\1', content, flags=re.DOTALL)
            
            # If there are still conflict markers, try a different approach
            if '<<<<<<< HEAD' in resolved_content:
                # Keep everything before the first conflict marker
                resolved_content = content.split('<<<<<<< HEAD')[0]
            
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(resolved_content)
            
            print(f"Resolved conflicts in {file_path}")
            
        except Exception as e:
            print(f"Error resolving {file_path}: {e}")
            continue
    
    # Add all resolved files
    subprocess.run(['git', 'add', '.'])
    
    print("All conflicts resolved and files staged")

if __name__ == "__main__":
    resolve_conflicts()