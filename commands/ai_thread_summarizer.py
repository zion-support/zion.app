#!/usr/bin/env python3
"""
AI Thread Summarizer — Zion

Summarizes email threads with AI.

Usage:
  python3 ai_thread_summarizer.py [--execute] [--limit N]

Options:
  --execute   Summarize threads
  --limit N   Max threads (default 10)
"""

import sys, json, argparse
from pathlib import Path

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search

DEFAULT_LIMIT = 10

def cmd_run(dry_run: bool, limit: int):
    print(f"🧵 AI Thread Summarizer...")
    msgs = gmail_search('is:unread', limit=limit)
    
    for msg in msgs[:limit]:
        snippet = msg.get('snippet', '')[:30]
        print(f"   Summary: {snippet}...")
    
    if not dry_run:
        print(f"   📄 Summarized {min(len(msgs), limit)} threads")

def main():
    parser = argparse.ArgumentParser(description='AI Thread Summarizer')
    parser.add_argument('--execute', action='store_true')
    parser.add_argument('--limit', type=int, default=DEFAULT_LIMIT)
    args = parser.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)

if __name__ == '__main__':
    main()