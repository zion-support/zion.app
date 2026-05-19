#!/usr/bin/env python3
"""
GitHub Actions Monitor — Zion

Monitors GitHub Actions workflow status.

Usage:
  python3 github_actions_monitor.py [--execute] [--limit N]

Options:
  --execute   Check status
  --limit N   Max notifications (default 50)
"""

import sys, json, argparse
from pathlib import Path

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, gmail_batch_modify

DEFAULT_LIMIT = 50

def cmd_run(dry_run: bool, limit: int):
    print("🐙 GitHub Actions Monitor")
    
    # Check for failures
    failures = gmail_search('from:notifications@github.com is:unread', limit=limit)
    
    print(f"\n📊 GitHub Status:")
    print(f"   Unread notifications: {len(failures)}")
    
    if failures:
        # Count by type
        failure_count = 0
        success_count = 0
        for msg in failures:
            snippet = msg.get('snippet', '').lower()
            subject = ''
            for h in msg.get('payload', {}).get('headers', []):
                if h['name'] == 'Subject':
                    subject = h['value'].lower()
                    break
            
            if 'fail' in snippet or 'fail' in subject or 'error' in snippet:
                failure_count += 1
            else:
                success_count += 1
        
        print(f"   Potential failures: {failure_count}")
        print(f"   Other: {success_count}")
        
        if not dry_run and failure_count > 0:
            # Mark failures for attention
            ids = [m['id'] for m in failures if 'fail' in m.get('snippet','').lower() or 'fail' in '']
            if ids:
                print(f"⚠️ {len(ids)} failures require attention")
    else:
        print("   ✅ No pending notifications")
    
    print(f"\n📈 GitHub Actions status checked")

def main():
    parser = argparse.ArgumentParser(description='GitHub Actions Monitor')
    parser.add_argument('--execute', action='store_true')
    parser.add_argument('--limit', type=int, default=DEFAULT_LIMIT)
    args = parser.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)

if __name__ == '__main__':
    main()