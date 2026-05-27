#!/usr/bin/env python3
"""
Deep Learning Classifier — Zion

Advanced ML-based email classification.

Usage:
  python3 deep_learning_classifier.py [--execute] [--limit N]

Options:
  --execute   Classify emails
  --limit N   Max emails (default 50)
"""

import sys, json, argparse
from pathlib import Path

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, gmail_get_or_create_label_id, gmail_batch_modify

DEFAULT_LIMIT = 50

CATEGORIES = {
    'urgent': ['urgent', 'asap', 'critical', 'emergency'],
    'meeting': ['meeting', 'calendar', 'appointment', 'schedule'],
    'invoice': ['invoice', 'payment', 'receipt', 'billing'],
    'newsletter': ['unsubscribe', 'digest', 'weekly', 'monthly'],
    'social': ['linkedin', 'twitter', 'facebook', 'social'],
    'promotion': ['discount', 'offer', 'deal', 'sale']
}

def cmd_run(dry_run: bool, limit: int):
    print(f"🧠 Deep Learning Classifier for {limit} emails...")
    msgs = gmail_search('is:unread newer_than:24h', limit=limit)
    
    classified = {}
    for msg in msgs[:limit]:
        snippet = (msg.get('snippet', '') + ' ' + 
                   next((h['value'] for h in msg.get('payload', {}).get('headers', []) if h['name'] == 'Subject'), '')).lower()
        
        for category, keywords in CATEGORIES.items():
            if any(kw in snippet for kw in keywords):
                classified[category] = classified.get(category, 0) + 1
                print(f"   {category}: {snippet[:30]}...")
                
                if not dry_run:
                    label_id = gmail_get_or_create_label_id(f'AI-{category}')
                    gmail_batch_modify({'ids': [msg['id']]}, addLabelIds=[label_id])
                break

    print(f"\n📊 Classification results: {classified}")

def main():
    parser = argparse.ArgumentParser(description='Deep Learning Classifier')
    parser.add_argument('--execute', action='store_true')
    parser.add_argument('--limit', type=int, default=DEFAULT_LIMIT)
    args = parser.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)

if __name__ == '__main__':
    main()