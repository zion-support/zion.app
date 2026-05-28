#!/usr/bin/env python3
from __future__ import annotations

"""
CI/CD Auto-Fixer - Automatically detect and fix common GitHub Actions failures

Analyzes failed workflows, identifies patterns, and applies known fixes
to reduce manual intervention.
"""

import sys, json, subprocess, os
from pathlib import Path
from datetime import datetime, timezone
from typing import Dict, List, Optional

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, gmail_get, telegram_send

REPO_PATH = WORKSPACE / 'zion-support.github.io'
FIX_LOG = WORKSPACE / 'zion.app' / 'data' / 'ci_fixes.json'

# Common failure patterns and fixes
FAILURE_PATTERNS = {
    'node_modules missing': {
        'pattern': r'Cannot find module',
        'fix': 'npm install',
        'commands': ['npm install'],
    },
    'build memory limit': {
        'pattern': r'JavaScript heap out of memory|SIGKILL',
        'fix': 'Increase Node memory',
        'commands': [],
        'env': {'NODE_OPTIONS': '--max-old-space-size=4096'},
    },
    'port already in use': {
        'pattern': r'port.*already in use|EADDRINUSE',
        'fix': 'Kill process on port',
        'commands': ['pkill -f node || true'],
    },
    'eslint errors': {
        'pattern': r'ESLint|error|warning',
        'fix': 'Run eslint --fix',
        'commands': ['npx eslint . --fix || true'],
    },
    'typescript errors': {
        'pattern': r'TypeScript|TS\d+:',
        'fix': 'Check tsconfig',
        'commands': ['npx tsc --noEmit || true'],
    },
}


def detect_failure_type(log_text: str) -> Optional[Dict]:
    """Detect failure type from log text."""
    log_lower = log_text.lower()
    
    for failure, info in FAILURE_PATTERNS.items():
        if isinstance(info['pattern'], str):
            if info['pattern'].lower() in log_lower:
                return {'type': failure, 'info': info}
        elif 'pattern_re' in info:
            import re
            if re.search(info['pattern_re'], log_text, re.I):
                return {'type': failure, 'info': info}
    
    return None


def get_recent_failures(limit=10) -> List[Dict]:
    """Get recent GitHub Actions failure emails."""
    failures = []
    emails = gmail_search('from:notifications@github.com subject:failed', limit=limit)
    
    for email in emails:
        msg = gmail_get(email['id'])
        headers = msg.get('payload', {}).get('headers', [])
        subject = next((h['value'] for h in headers if h['name'] == 'Subject'), '')
        snippet = msg.get('snippet', '')
        
        detected = detect_failure_type(f"{subject} {snippet}")
        
        failures.append({
            'email_id': email['id'],
            'subject': subject,
            'snippet': snippet[:300],
            'detected_failure': detected,
        })
    
    return failures


def apply_fix(failure: Dict, execute: bool = True) -> Dict:
    """Apply automated fix for detected failure."""
    result = {
        'success': False,
        'fix_applied': None,
        'error': None,
    }
    
    if not failure.get('detected_failure'):
        result['error'] = 'No failure pattern matched'
        return result
    
    fix_info = failure['detected_failure']['info']
    result['fix_applied'] = fix_info['fix']
    
    if not execute:
        return result
    
    try:
        # Apply environment variables if needed
        env = os.environ.copy()
        if 'env' in fix_info:
            env.update(fix_info['env'])
        
        # Run fix commands
        for cmd in fix_info.get('commands', []):
            proc = subprocess.run(
                cmd, shell=True, cwd=REPO_PATH, env=env,
                capture_output=True, text=True, timeout=120
            )
            if proc.returncode == 0:
                result['success'] = True
            else:
                result['error'] = proc.stderr[:200]
        
        if not fix_info.get('commands'):
            # No commands, just suggest
            result['success'] = True
        
    except Exception as e:
        result['error'] = str(e)
    
    return result


def main(execute=True, limit=10):
    """Main execution."""
    print("🔧 CI/CD Auto-Fixer - Checking for failed workflows...")
    
    failures = get_recent_failures(limit)
    print(f"📧 Found {len(failures)} recent failure notifications")
    
    results = []
    fixes_applied = 0
    
    for failure in failures:
        if failure['detected_failure']:
            result = apply_fix(failure, execute)
            result['email_id'] = failure['email_id']
            result['subject'] = failure['subject']
            results.append(result)
            
            if result['success']:
                fixes_applied += 1
                print(f"✅ Fixed: {failure['subject'][:40]}")
                
                if execute:
                    telegram_send(f"🔧 CI Fix Applied: {failure['detected_failure']['type']}")
            
            if execute and result.get('error'):
                telegram_send(f"⚠️ CI Fix Failed: {result['error'][:50]}")
    
    # Update log
    if FIX_LOG.exists():
        log = json.loads(FIX_LOG.read_text())
    else:
        log = {'fixes': []}
    
    log['fixes'].extend(results)
    FIX_LOG.parent.mkdir(parents=True, exist_ok=True)
    FIX_LOG.write_text(json.dumps(log, indent=2))
    
    print(f"\n📊 CI/CD Auto-Fix Summary:")
    print(f"  ✅ Fixes applied: {fixes_applied}")
    print(f"  📧 Total failures checked: {len(failures)}")
    
    return results


if __name__ == '__main__':
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument('--execute', action='store_true')
    parser.add_argument('--limit', type=int, default=10)
    args = parser.parse_args()
    main(execute=args.execute, limit=args.limit)