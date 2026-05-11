#!/usr/bin/env python3
import os, sys, yaml, pathlib

root = pathlib.Path('.')
workflows = list(root.glob('.github/workflows/*.yml')) + list(root.glob('.github/workflows/*.yaml'))

for wf in workflows:
    with open(wf) as f:
        content = f.read()
    
    data = yaml.safe_load(content)
    
    # Ensure 'on' block exists with required triggers
    if 'on' not in data:
        data['on'] = {
            'push': {
                'branches': ['main']
            },
            'workflow_dispatch': {}
        }
    else:
        # Add missing triggers if not present
        if 'push' not in data['on']:
            data['on']['push'] = {
                'branches': ['main']
            }
        if 'workflow_dispatch' not in data['on']:
            data['on']['workflow_dispatch'] = {}
    
    # Write back the fixed YAML
    with open(wf, 'w') as f:
        yaml.dump(data, f, sort_keys=False)
    print(f'  {wf.name}: Added missing triggers')

print('\nDone.')