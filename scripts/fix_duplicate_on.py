#!/usr/bin/env python3
import os, sys, re, yaml
from pathlib import Path

root = Path('.')
workflows = list(root.glob('.github/workflows/*.yml')) + list(root.glob('.github/workflows/*.yaml'))

for wf in workflows:
    with open(wf) as f:
        content = f.read()
    
    # Find the first 'on:' and everything after it until next top-level key
    lines = content.split('\n')
    first_on = -1
    next_key = -1
    
    for i, line in enumerate(lines):
        if line.strip() == 'on:':
            first_on = i
            continue
        if first_on >= 0 and line.strip() and not line.startswith(' '):
            next_key = i
            break
    
    if first_on >= 0 and next_key >= 0:
        # Keep content from first_on to next_key
        fixed_content = '\n'.join(lines[:first_on] + lines[next_key:])
        
        # Validate the fixed content
        try:
            yaml.safe_load(fixed_content)
            with open(wf, 'w') as f:
                f.write(fixed_content)
            print(f'  {wf.name}: Fixed duplicate on sections')
        except Exception as e:
            print(f'  {wf.name}: Error fixing - {e}')

print('\nDone.')