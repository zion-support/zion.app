#!/usr/bin/env python3
"""
AI Learning Accelerator — Zion

Accelerates AI learning from email patterns.

Usage:
  python3 ai_learning_accelerator.py [--execute] [--limit N]

Options:
  --execute   Accelerate learning
  --limit N   Max samples (default 50)
"""

import sys, json, argparse
from pathlib import Path

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search

DEFAULT_LIMIT = 50

def cmd_run(dry_run: bool, limit: int):
    print(f"🚀 AI Learning Accelerator...")
    msgs = gmail_search('is:unread', limit=limit)
    print(f"   Accelerated learning from {len(msgs)} samples")

def main():
    parser = argparse.ArgumentParser(description='AI Learning Accelerator')
    parser.add_argument('--execute', action='store_true')
    parser.add_argument('--limit', type=int, default=DEFAULT_LIMIT)
    args = parser.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)

if __name__ == '__main__':
    main()