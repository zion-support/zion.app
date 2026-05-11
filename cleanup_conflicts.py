#!/usr/bin/env python3
"""
Clean up remaining conflict markers from merged files
"""

import os
import re

def clean_file(filepath):
    """Clean conflict markers from a single file"""
    try:
        with open(filepath, 'r') as f:
            content = f.read()
        
        # Remove conflict markers
        content = re.sub(r'<<<<<<< HEAD.*?\n', '', content, flags=re.DOTALL)
        content = re.sub(r'=======.*?\n', '', content, flags=re.DOTALL)
        content = re.sub(r'>>>>>>> origin/.*?\n', '', content, flags=re.DOTALL)
        
        # Remove any remaining conflict markers
        content = re.sub(r'>>>>>>> origin/.*?\n', '', content)
        content = re.sub(r'cursor/fix-errors-and-merge-to-main-[a-f0-9]+\n', '', content)
        
        # Clean up multiple newlines
        content = re.sub(r'\n\n\n+', '\n\n', content)
        
        with open(filepath, 'w') as f:
            f.write(content)
        
        print(f"Cleaned {filepath}")
        return True
    except Exception as e:
        print(f"Error cleaning {filepath}: {e}")
        return False

def main():
    """Clean all files with conflict markers"""
    files_to_clean = [
        'app/about/page.tsx',
        'app/components/PerformanceMonitor.tsx',
        'app/components/PerformanceMonitoring.tsx',
        'app/components/PerformanceOptimizer.tsx',
        'app/components/SecurityEnhancement.tsx',
        'app/hooks/usePerformanceMetrics.ts',
        'app/layout.tsx',
        'app/types/performance.d.ts',
        'app/utils/monitoring.ts'
    ]
    
    cleaned = 0
    for file in files_to_clean:
        if os.path.exists(file):
            if clean_file(file):
                cleaned += 1
    
    print(f"Cleaned {cleaned} files")

if __name__ == "__main__":
    main()