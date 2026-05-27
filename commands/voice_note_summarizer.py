#!/usr/bin/env python3
"""
Voice Note Summarizer — Zion

Summarizes voice notes from emails.

Usage:
  python3 voice_note_summarizer.py [--execute] [--limit N]

Options:
  --execute   Summarize voice notes
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
    print(f"🎙️ Finding voice notes in {limit} emails...")
    msgs = gmail_search('has:attachment newer_than:30d', limit=limit)
    
    for msg in msgs[:limit]:
        parts = msg.get('payload', {}).get('parts', [])
        for part in parts:
            filename = part.get('filename', '')
            if filename and filename.lower().endswith(('.mp3', '.wav', '.m4a', '.ogg')):
                print(f"   🎧 {filename[:40]} - transcribing...")
                print(f"   Summary: [Would transcribe audio content]")

def main():
    parser = argparse.ArgumentParser(description='Voice Note Summarizer')
    parser.add_argument('--execute', action='store_true')
    parser.add_argument('--limit', type=int, default=DEFAULT_LIMIT)
    args = parser.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)

if __name__ == '__main__':
    main()