#!/usr/bin/env python3
import os, sys, yaml, pathlib, re

root = pathlib.Path('.').resolve()
workflows = list(root.glob('.github/workflows/*.yml')) + list(root.glob('.github/workflows/*.yaml'))

if not workflows:
    print('No workflow files found.')
    sys.exit(0)

errors = []
for wf in workflows:
    try:
        with open(wf) as f:
            content = f.read()
        data = yaml.safe_load(content)
        
        # Check using raw content (more reliable for 'on' key)
        has_on = bool(re.search(r'^on\s*:', content, re.MULTILINE))
        
        if not isinstance(data, dict):
            errors.append(f'{wf}: top-level not a dict')
            continue
        if not has_on:
            errors.append(f'{wf.name}: missing trigger (on:)')
        if 'jobs' not in data:
            errors.append(f'{wf.name}: missing jobs section')
    except Exception as e:
        errors.append(f'{wf.name}: {e}')

if errors:
    print('Issues found:')
    for e in errors:
        print(f'  - {e}')
    sys.exit(1)
else:
    print(f'✅ All {len(workflows)} workflow files validated successfully.')
    sys.exit(0)