#!/usr/bin/env python3
import os, sys, yaml, pathlib

root = pathlib.Path('.')
workflows = list(root.glob('.github/workflows/*.yml')) + list(root.glob('.github/workflows/*.yaml'))

for wf in workflows:
    with open(wf) as f:
        content = f.read()
    try:
        data = yaml.safe_load(content)
    except Exception as e:
        print(f'  {wf.name}: YAML parse error - {e}')
        continue
    
    if 'on' not in data:
        # Add trigger at beginning
        new_on = 'on:\n  push:\n    branches: [main]\n  workflow_dispatch:\n\n'
        with open(wf, 'w') as f:
            f.write(new_on + content)
        print(f'  {wf.name}: Added trigger')
    else:
        print(f'  {wf.name}: OK')

print('\nDone.')