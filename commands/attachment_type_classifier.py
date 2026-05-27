#!/usr/bin/env python3
"""
Attachment Type Classifier — Zion

Classifies email attachments by type.

Usage:
  python3 attachment_type_classifier.py [--execute] [--limit N]

Options:
  --execute   Classify attachments
  --limit N   Max emails (default 30)
"""

import sys, json, argparse
from pathlib import Path

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search

DEFAULT_LIMIT = 30

TYPES = {
    'image': ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
    'document': ['.pdf', '.doc', '.docx', '.txt'],
    'spreadsheet': ['.xls', '.xlsx', '.csv'],
    'presentation': ['.ppt', '.pptx'],
    'archive': ['.zip', '.rar', '.tar', '.gz'],
    'code': ['.py', '.js', '.html', '.css', '.json']
}

def cmd_run(dry_run: bool, limit: int):
    print(f"📎 Classifying attachments in {limit} emails...")
    msgs = gmail_search('has:attachment newer_than:30d', limit=limit)
    
    type_counts = {}
    for msg in msgs[:limit]:
        parts = msg.get('payload', {}).get('parts', [])
        for part in parts:
            filename = part.get('filename', '')
            if filename:
                ext = '.' + filename.split('.')[-1].lower() if '.' in filename else ''
                for type_name, extensions in TYPES.items():
                    if ext in extensions:
                        type_counts[type_name] = type_counts.get(type_name, 0) + 1
                        break
    
    print(f"\n📊 Attachment types:")
    for t, c in type_counts.items():
        print(f"   {t}: {c}")

def main():
    parser = argparse.ArgumentParser(description='Attachment Type Classifier')
    parser.add_argument('--execute', action='store_true')
    parser.add_argument('--limit', type=int, default=DEFAULT_LIMIT)
    args = parser.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)

if __name__ == '__main__':
    main()