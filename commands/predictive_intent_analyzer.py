#!/usr/bin/env python3
"""
Predictive Intent Analyzer — Zion

Analyzes email intent to predict required actions.

Usage:
  python3 predictive_intent_analyzer.py [--execute] [--limit N]

Options:
  --execute   Analyze intents
  --limit N   Max emails (default 30)
"""

import sys, json, argparse
from pathlib import Path

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search

DEFAULT_LIMIT = 30

INTENT_PATTERNS = {
    'question': ['?', 'how', 'what', 'when', 'where', 'why', 'can you'],
    'request': ['please', 'could you', 'would you', 'need', 'want'],
    'confirmation': ['confirm', 'approved', 'yes', 'okay', 'got it'],
    'information': ['info', 'details', 'tell me', 'let me know'],
    'complaint': ['issue', 'problem', 'not working', 'broken', 'frustrated']
}

def analyze_intent(text: str) -> tuple:
    text = text.lower()
    scores = {}
    for intent, keywords in INTENT_PATTERNS.items():
        scores[intent] = sum(1 for kw in keywords if kw in text)
    best = max(scores, key=scores.get)
    return best, scores[best]

def cmd_run(dry_run: bool, limit: int):
    print(f"🔮 Analyzing intent for {limit} emails...")
    msgs = gmail_search('is:unread newer_than:24h', limit=limit)
    
    intents = {}
    for msg in msgs[:limit]:
        snippet = msg.get('snippet', '').lower()
        intent, score = analyze_intent(snippet)
        intents[intent] = intents.get(intent, 0) + 1
        print(f"   {intent}: {snippet[:35]}...")
    
    print(f"\n📊 Intent distribution: {intents}")

def main():
    parser = argparse.ArgumentParser(description='Predictive Intent Analyzer')
    parser.add_argument('--execute', action='store_true')
    parser.add_argument('--limit', type=int, default=DEFAULT_LIMIT)
    args = parser.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)

if __name__ == '__main__':
    main()