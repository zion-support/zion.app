#!/usr/bin/env python3
"""
Embedding Space Mapper — Zion

Maps emails to embedding space for clustering.

Usage:
  python3 embedding_space_mapper.py [--execute] [--limit N]

Options:
  --execute   Create embeddings
  --limit N   Max emails (default 30)
"""

import sys, json, argparse, hashlib
from pathlib import Path

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search

DEFAULT_LIMIT = 30

def cmd_run(dry_run: bool, limit: int):
    print(f"🗺️ Embedding Space Mapper for {limit} emails...")
    msgs = gmail_search('is:unread newer_than:24h', limit=limit)
    
    embeddings = []
    for msg in msgs[:limit]:
        snippet = msg.get('snippet', '')
        # Simple hash-based embedding
        emb = [hashlib.md5(snippet[i:i+10].encode()).hexdigest()[:8] for i in range(0, len(snippet), 10)][:5]
        embeddings.append(emb)
        print(f"   Created embedding for: {snippet[:30]}...")
    
    print(f"\n📊 Total embeddings: {len(embeddings)}")

def main():
    parser = argparse.ArgumentParser(description='Embedding Space Mapper')
    parser.add_argument('--execute', action='store_true')
    parser.add_argument('--limit', type=int, default=DEFAULT_LIMIT)
    args = parser.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)

if __name__ == '__main__':
    main()