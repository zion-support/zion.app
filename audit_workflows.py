#!/usr/bin/env python3
import os, sys, yaml, pathlib, re

root = pathlib.Path('.')
workflows = list(root.glob('.github/workflows/*.yml')) + list(root.glob('.github/workflows/*.yaml'))

def load_yaml(p):
    try:
        with open(p) as f:
            return yaml.safe_load(f)
    except Exception as e:
        return None

def check_workflow(name, data):
    issues = []
    if not data:
        issues.append("Failed to load YAML")
        return issues
    if 'on' not in data:
        issues.append("Missing 'on' trigger")
    if 'jobs' not in data:
        issues.append("Missing 'jobs'")
    else:
        for job_name, job in data['jobs'].items():
            if not isinstance(job, dict):
                issues.append(f"Job {job_name} is not a dict")
                continue
            if 'steps' not in job:
                issues.append(f"Job {job_name} missing steps")
            else:
                steps = job['steps']
                if not isinstance(steps, list):
                    issues.append(f"Job {job_name} steps not a list")
                else:
                    has_checkout = any(isinstance(s, dict) and s.get('uses', '').startswith('actions/checkout') for s in steps)
                    if not has_checkout:
                        issues.append(f"Job {job_name} missing actions/checkout")
                    has_setup_node = any(isinstance(s, dict) and s.get('uses', '').startswith('actions/setup-node') for s in steps)
                    if not has_setup_node:
                        # maybe not needed if no node steps
                        pass
            if 'concurrency' not in job:
                issues.append(f"Job {job_name} missing concurrency")
            if 'timeout-minutes' not in job:
                issues.append(f"Job {job_name} missing timeout-minutes")
            # permissions at workflow level
    # workflow level permissions
    if 'permissions' not in data:
        issues.append("Missing permissions")
    return issues

for wf in workflows:
    data = load_yaml(wf)
    issues = check_workflow(wf.name, data)
    if issues:
        print(f"{wf.name}:")
        for i in issues:
            print(f"  - {i}")
    else:
        print(f"{wf.name}: OK")
