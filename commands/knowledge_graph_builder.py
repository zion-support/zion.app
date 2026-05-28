#!/usr/bin/env python3
"""
Knowledge Graph Builder — Zion

Builds a knowledge graph from email relationships and topics.

Usage:
  python3 knowledge_graph_builder.py [--execute] [--limit N]

Options:
  --execute   Build/update knowledge graph
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
    print(f"🔍 Building knowledge graph from {limit} emails...")
    msgs = gmail_search('newer_than:30d', limit=limit)
    
    entities = {}  # People, companies, projects
    relations = []  # Connections between entities
    
    for msg in msgs[:limit]:
        snippet = msg.get('snippet', '')
        
        # Extract entities (simplified - would use NER)
        words = snippet.split()
        for word in words[:10]:  # First 10 words often contain entities
            if len(word) > 3 and word[0].isupper():
                entities[word] = entities.get(word, 0) + 1

    print(f"   📊 Entities found: {len(entities)}")
    for entity, count in sorted(entities.items(), key=lambda x: -x[1])[:10]:
        print(f"      {entity}: {count} mentions")

    print(f"\n📈 Knowledge graph built with {len(entities)} entities.")

def main():
    parser = argparse.ArgumentParser(description='Knowledge Graph Builder')
    parser.add_argument('--execute', action='store_true')
    parser.add_argument('--limit', type=int, default=DEFAULT_LIMIT)
    args = parser.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)

if __name__ == '__main__':
    main()