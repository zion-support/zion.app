#!/usr/bin/env python3
import os
import re
import glob

def resolve_merge_conflicts():
    """Resolve merge conflicts by keeping the HEAD version and removing conflict markers"""
    
    # Find all files with merge conflicts
    files_with_conflicts = []
    
    # Search for files with merge conflict markers
    for root, dirs, files in os.walk('.'):
        for file in files:
            if file.endswith(('.tsx', '.ts', '.js', '.jsx')):
                file_path = os.path.join(root, file)
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                        if '<<<<<<< HEAD' in content or '=======' in content or '>>>>>>>' in content:
                            files_with_conflicts.append(file_path)
                except Exception as e:
                    print(f"Error reading {file_path}: {e}")
    
    print(f"Found {len(files_with_conflicts)} files with merge conflicts")
    
    for file_path in files_with_conflicts:
        print(f"Resolving conflicts in: {file_path}")
        
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Remove merge conflict markers and keep HEAD version
            # Pattern to match: <<<<<<< HEAD ... ======= ... >>>>>>> branch
            pattern = r'<<<<<<< HEAD\s*\n(.*?)\n=======\s*\n.*?\n>>>>>>> [^\n]+\s*\n'
            resolved_content = re.sub(pattern, r'\1\n', content, flags=re.DOTALL)
            
            # Also handle cases where there might be multiple conflicts in one file
            # Remove any remaining conflict markers
            resolved_content = re.sub(r'<<<<<<< HEAD\s*\n', '', resolved_content)
            resolved_content = re.sub(r'=======\s*\n', '', resolved_content)
            resolved_content = re.sub(r'>>>>>>> [^\n]+\s*\n', '', resolved_content)
            
            # Clean up any extra newlines
            resolved_content = re.sub(r'\n\s*\n\s*\n', '\n\n', resolved_content)
            
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(resolved_content)
                
            print(f"✓ Resolved conflicts in {file_path}")
            
        except Exception as e:
            print(f"✗ Error resolving {file_path}: {e}")

if __name__ == "__main__":
    resolve_merge_conflicts()
    print("Merge conflict resolution completed!")