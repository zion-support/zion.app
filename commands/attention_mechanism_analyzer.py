#!/usr/bin/env python3
"""
Attention Mechanism Analyzer — Zion

Analyzes email attention patterns.

Usage:
  python3 attention_mechanism_analyzer.py [--execute] [--limit N]

Options:
  --execute   Analyze attention
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
    print(f"👁️ Attention Mechanism Analyzer for {limit} emails...")
    msgs = gmail_search('is:unread newer_than:24h', limit=limit)
    
    attention_signals = {'subject_mentions': 0, 'question_marks': 0, 'exclamation': 0}
    
    for msg in msgs[:limit]:
        headers = msg.get('payload', {}).get('headers', [])
        subject = next((h['value'] for h in headers if h['name'] == 'Subject'), '')
        
        if '?' in subject:
            attention_signals['question_marks'] += 1
        if '!' in subject:
            attention_signals['exclamation'] += 1
        if any(word in subject.lower() for word in ['important', 'urgent', 'attention']):
            attention_signals['subject_mentions'] += 1
    
    print(f"   📊 Attention signals: {attention_signals}")

def main():
    parser = argparse.ArgumentParser(description='Attention Mechanism Analyzer')
    parser.add_argument('--execute', action='store_true')
    parser.add_argument('--limit', type=int, default=DEFAULT_LIMIT)
    args = parser.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)

if __name__ == '__main__':
    main()