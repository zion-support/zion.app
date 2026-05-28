#!/usr/bin/env python3
"""
Language Detector — Zion

Detects language in emails for translation routing.

Usage:
  python3 language_detector.py [--execute] [--limit N]

Options:
  --execute   Detect languages
  --limit N   Max emails (default 30)
"""

import sys, json, argparse
from pathlib import Path

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search

DEFAULT_LIMIT = 30

def detect_language(text: str) -> str:
    """Simple language detection heuristic."""
    text = text.lower()
    # Common words by language
    if any(w in text for w in ['the', 'and', 'or', 'but', 'with']):
        return 'English'
    elif any(w in text for w in ['el', 'la', 'los', 'las', 'y', 'o']):
        return 'Spanish'
    elif any(w in text for w in ['le', 'la', 'les', 'et', 'ou']):
        return 'French'
    elif any(w in text for w in ['der', 'die', 'und', 'oder']):
        return 'German'
    elif any(w in text for w in ['o', 'a', 'os', 'as', 'e']):
        return 'Portuguese'
    return 'Unknown'

def cmd_run(dry_run: bool, limit: int):
    print(f"🌐 Detecting languages in {limit} emails...")
    msgs = gmail_search('is:unread newer_than:24h', limit=limit)
    
    languages = {}
    for msg in msgs[:limit]:
        snippet = msg.get('snippet', '')
        lang = detect_language(snippet)
        languages[lang] = languages.get(lang, 0) + 1
        print(f"   {lang}: {snippet[:30]}...")
    
    print(f"\n📊 Language distribution: {languages}")

def main():
    parser = argparse.ArgumentParser(description='Language Detector')
    parser.add_argument('--execute', action='store_true')
    parser.add_argument('--limit', type=int, default=DEFAULT_LIMIT)
    args = parser.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)

if __name__ == '__main__':
    main()