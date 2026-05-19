#!/usr/bin/env python3
"""
Auto Document Intelligence — Zion

Extracts insights from document attachments.

Usage:
  python3 auto_document_intelligence.py [--execute] [--limit N]

Options:
  --execute   Process documents
  --limit N   Max emails (default 20)
"""

import sys, json, argparse
from pathlib import Path

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search

DEFAULT_LIMIT = 20

def cmd_run(dry_run: bool, limit: int):
    print(f"📄 Analyzing {limit} document attachments...")
    msgs = gmail_search('has:attachment newer_than:30d', limit=limit)
    
    docs = 0
    for msg in msgs[:limit]:
        parts = msg.get('payload', {}).get('parts', [])
        for part in parts:
            filename = part.get('filename', '')
            if filename:
                ext = filename.lower().split('.')[-1] if '.' in filename else ''
                if ext in ['pdf', 'doc', 'docx', 'txt']:
                    docs += 1
                    print(f"   📄 {filename[:40]}")
    
    print(f"\n📊 Found {docs} documents ready for analysis")

def main():
    parser = argparse.ArgumentParser(description='Auto Document Intelligence')
    parser.add_argument('--execute', action='store_true')
    parser.add_argument('--limit', type=int, default=DEFAULT_LIMIT)
    args = parser.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)

if __name__ == '__main__':
    main()