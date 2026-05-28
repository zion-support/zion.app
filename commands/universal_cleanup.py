#!/usr/bin/env python3
"""
Universal Email Cleanup — Zion

Handles email cleanup with fallback mechanisms.

Usage:
  python3 universal_cleanup.py [--execute] [--type TYPE]
"""

import sys, json, argparse, subprocess
from pathlib import Path

WORKSPACE = Path('/root/.openclaw/workspace')

def cmd_run(dry_run: bool, clean_type: str):
    print(f"🧹 Universal Cleanup: {clean_type}")
    
    # Try using the CLI directly
    cmd = f"cd {WORKSPACE}/zion.app/commands && python3 gworkspace_emergency_cleaner.py --execute --type {clean_type}"
    
    try:
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=30)
        print(result.stdout)
        if result.stderr:
            print(f"⚠️ {result.stderr}")
    except Exception as e:
        print(f"❌ Cleanup failed: {e}")

def main():
    parser = argparse.ArgumentParser(description='Universal Email Cleanup')
    parser.add_argument('--execute', action='store_true')
    parser.add_argument('--type', default='all')
    args = parser.parse_args()
    cmd_run(dry_run=not args.execute, clean_type=args.type)

if __name__ == '__main__':
    main()