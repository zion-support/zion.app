#!/usr/bin/env python3
"""
Email Translation Detector — Zion

Detects emails needing translation.

Usage:
  python3 auto_translation_detector.py [--execute] [--limit N]

Options:
  --execute   Detect translations needed
  --limit N   Max emails (default 30)
"""

import sys, json, argparse
from pathlib import Path

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, gmail_get_or_create_label_id, gmail_batch_modify

DEFAULT_LIMIT = 30

NON_ENGLISH = [
    'ñ', 'á', 'é', 'í', 'ó', 'ú', 'ü', 'ç', 'ß',
    'ä', 'ö', 'ñ', 'è', 'à', 'ù', 'â', 'ê', 'î', 'ô', 'û'
]

def cmd_run(dry_run: bool, limit: int):
    print(f"🌐 Detecting translation needs in {limit} emails...")
    msgs = gmail_search('is:unread newer_than:24h', limit=limit)
    
    needs_translation = 0
    for msg in msgs[:limit]:
        headers = msg.get('payload', {}).get('headers', [])
        subject = next((h['value'] for h in headers if h['name'] == 'Subject'), '')
        
        if any(char in subject.lower() for char in NON_ENGLISH):
            needs_translation += 1
            print(f"   Needs translation: {subject[:30]}...")
            
            if not dry_run:
                label_id = gmail_get_or_create_label_id('Translation-Needed')
                gmail_batch_modify({'ids': [msg['id']]}, addLabelIds=[label_id])
    
    print(f"\n📊 {needs_translation} emails need translation")

def main():
    parser = argparse.ArgumentParser(description='Auto Translation Detector')
    parser.add_argument('--execute', action='store_true')
    parser.add_argument('--limit', type=int, default=DEFAULT_LIMIT)
    args = parser.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)

if __name__ == '__main__':
    main()