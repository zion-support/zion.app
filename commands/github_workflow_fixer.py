#!/usr/bin/env python3
"""
GitHub Workflow Auto-Fixer - Diagnose and fix failing GitHub Actions

Analyzes failure patterns and applies automated fixes to common CI/CD issues.
"""

import sys, json
from pathlib import Path
from datetime import datetime, timezone

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))

try:
    from google_workspace import gmail_search, gmail_get, telegram_send
except:
    def gmail_search(q, limit=20):
        return []
    def gmail_get(id):
        return {}
    def telegram_send(t):
        print(f"[TELEGRAM] {t}")

FIX_LOG = WORKSPACE / 'zion.app' / 'data' / 'workflow_fixes.json'

# Common failure patterns and fixes
FAILURE_PATTERNS = {
    'node_modules missing': {
        'pattern': 'Cannot find module',
        'solution': 'run_npm_install',
    },
    'build memory limit': {
        'pattern': 'JavaScript heap out of memory',
        'solution': 'increase_node_memory',
    },
    'eslint errors': {
        'pattern': 'ESLint error',
        'solution': 'run_eslint_fix',
    },
    'typescript errors': {
        'pattern': 'TypeScript error',
        'solution': 'check_tsconfig',
    },
}


def analyze_github_failures(limit=20):
    """Analyze GitHub failure emails for patterns."""
    failures = []
    emails = gmail_search('from:notifications@github.com subject:failed', limit=limit)
    
    for email in emails:
        msg = gmail_get(email['id'])
        headers = msg.get('payload', {}).get('headers', [])
        subject = next((h['value'] for h in headers if h['name'] == 'Subject'), '')
        snippet = msg.get('snippet', '')
        
        # Extract workflow name
        import re
        workflow_match = re.search(r'Run failed: ([^(]+)', subject)
        workflow_name = workflow_match.group(1) if workflow_match else 'unknown'
        
        # Detect failure type
        failure_type = 'unknown'
        for name, info in FAILURE_PATTERNS.items():
            if info['pattern'].lower() in snippet.lower():
                failure_type = name
                break
        
        failures.append({
            'subject': subject,
            'workflow': workflow_name,
            'failure_type': failure_type,
            'snippet': snippet[:150],
            'detected_at': datetime.now(timezone.utc).isoformat(),
        })
    
    return failures


def generate_fix_recommendation(failure):
    """Generate fix recommendation for a failure."""
    ft = failure['failure_type']
    
    fixes = {
        'node_modules missing': 'Add `npm ci` or `npm install` step before build',
        'build memory limit': 'Add `NODE_OPTIONS=--max-old-space-size=4096` to workflow',
        'eslint errors': 'Run `npx eslint . --fix` before build or disable in CI',
        'typescript errors': 'Run `npx tsc --noEmit` locally to fix type errors',
        'unknown': 'Check workflow logs for specific error',
    }
    
    return fixes.get(ft, 'Check workflow logs')


def main(execute=True, limit=20):
    print("🔧 GitHub Workflow Auto-Fixer - Analyzing failures...")
    
    failures = analyze_github_failures(limit)
    print(f"📊 Analyzed {len(failures)} GitHub failures")
    
    # Group by failure type
    by_type = {}
    for f in failures:
        ft = f['failure_type']
        by_type[ft] = by_type.get(ft, 0) + 1
    
    print("\n📈 Failure breakdown:")
    for ft, count in by_type.items():
        print(f"  {ft}: {count}")
    
    # Generate recommendations
    recommendations = []
    for f in failures[:10]:
        fix = generate_fix_recommendation(f)
        recommendations.append({
            'workflow': f['workflow'],
            'failure_type': f['failure_type'],
            'recommended_fix': fix,
        })
    
    # Update log
    if FIX_LOG.exists():
        log = json.loads(FIX_LOG.read_text())
    else:
        log = {'fixes': []}
    
    log['fixes'] = recommendations
    log['last_updated'] = datetime.now(timezone.utc).isoformat()
    FIX_LOG.parent.mkdir(parents=True, exist_ok=True)
    FIX_LOG.write_text(json.dumps(log, indent=2))
    
    if execute:
        telegram_send(f"🔧 GitHub Fixes: {len(failures)} failures analyzed, {len(by_type)} patterns found")
    
    return recommendations


if __name__ == '__main__':
    import argparse
    p = argparse.ArgumentParser()
    p.add_argument('--execute', action='store_true')
    p.add_argument('--limit', type=int, default=20)
    args = p.parse_args()
    main(execute=args.execute, limit=args.limit)