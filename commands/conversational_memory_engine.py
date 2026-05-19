#!/usr/bin/env python3
"""
Conversational Memory Engine — Zion

Builds context from conversation history.

Usage:
  python3 conversational_memory_engine.py [--execute] [--limit N]

Options:
  --execute   Build memory
  --limit N   Max emails (default 30)
"""

import sys, json, argparse
from pathlib import Path

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search

DEFAULT_LIMIT = 30

def cmd_run(dry_run: bool, limit: int):
    print(f"🧠 Building conversational memory from {limit} emails...")
    msgs = gmail_search('is:unread newer_than:7d', limit=limit)
    
    threads = {}
    for msg in msgs[:limit]:
        thread_id = msg.get('threadId', 'unknown')
        if thread_id not in threads:
            threads[thread_id] = []
        threads[thread_id].append(msg.get('snippet', '')[:40])
    
    print(f"   🧵 Identified {len(threads)} conversation threads")
    
    for tid, messages in list(threads.items())[:5]:
        print(f"   Thread {tid[:8]}: {len(messages)} messages")

def main():
    parser = argparse.ArgumentParser(description='Conversational Memory Engine')
    parser.add_argument('--execute', action='store_true')
    parser.add_argument('--limit', type=int, default=DEFAULT_LIMIT)
    args = parser.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)

if __name__ == '__main__':
    main()