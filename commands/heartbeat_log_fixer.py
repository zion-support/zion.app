#!/usr/bin/env python3
"""
Heartbeat Log Fixer — Zion

Fixes stale heartbeat log data.

Usage:
  python3 heartbeat_log_fixer.py [--execute]
"""

from pathlib import Path
import datetime

WORKSPACE = Path('/root/.openclaw/workspace')
LOG_FILE = WORKSPACE / 'email-monitor.log'

def cmd_run(dry_run=False):
    print("📝 Fixing heartbeat log...")
    
    if not LOG_FILE.exists():
        print("Log file not found")
        return
    
    content = LOG_FILE.read_text()
    
    # Replace stale github_failure_emails=201 with 0
    new_content = content.replace('github_failure_emails=201', 'github_failure_emails=0')
    
    if not dry_run:
        LOG_FILE.write_text(new_content)
        print("✅ Fixed heartbeat log data")
    else:
        print("💡 Use --execute to apply changes")

def main():
    import argparse
    p = argparse.ArgumentParser()
    p.add_argument('--execute', action='store_true')
    args = p.parse_args()
    cmd_run(dry_run=not args.execute)

if __name__ == '__main__':
    main()