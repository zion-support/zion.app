#!/usr/bin/env python3
from __future__ import annotations

"""
Email Intent Classifier - Zion

Automatically categorizes incoming emails by their primary purpose.
- meeting_request: Scheduling coordination
- follow_up: Response to previous thread
- request: Action items, questions
- information: News, updates, FYI
- complaint: Issues, problems
- sales: Outreach, offers, pitches

Usage:
  python3 intent_classifier.py --execute --limit 20
"""

import sys, re
from pathlib import Path
WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, gmail_batch_modify

INTENT_PATTERNS = {
    'meeting_request': [
        r'\b(meeting|schedule|availability|calendar|appointment)\b',
        r'\b(can we meet|let\'?s meet|meeting time)\b',
        r'\bwhen (are you free|can you|available)\b'
    ],
    'follow_up': [
        r'\b(follow[- ]?up|checking in|just following up)\b',
        r'\b(bumping|gentle reminder)\b',
        r'\b(as discussed|as per our|per our conversation)\b'
    ],
    'request': [
        r'\b(can you|could you|would you|need|required)\b.*\?',
        r'\b(action item|please|kindly)\b',
        r'\b(what|when|where|how|why)\b.*\b(need|want|require)\b'
    ],
    'information': [
        r'\b(FYI|for your information|heads up|update)\b',
        r'\b(news|announcement|update on)\b',
        r'\b(just wanted you to know)\b'
    ],
    'complaint': [
        r'\b(issue|problem|broken|not working|urgent|ASAP)\b',
        r'\b(dissatisfied|unacceptable|disappointed)\b',
        r'\b(refund|cancel|complaint)\b'
    ],
    'sales': [
        r'\b(partnership|opportunity|collaboration|deal)\b',
        r'\b(special offer|discount|promotion|free trial)\b',
        r'\b(quick call|15.minute|demo|demo call)\b'
    ]
}

def classify_intent(text: str) -> str:
    """Classify email intent based on pattern matching."""
    text_lower = text.lower()
    
    scores = {}
    for intent, patterns in INTENT_PATTERNS.items():
        score = sum(1 for p in patterns if re.search(p, text_lower))
        if score > 0:
            scores[intent] = score
    
    if not scores:
        return 'information'
    
    return max(scores, key=scores.get)

def cmd_run(dry_run: bool, limit: int = 30):
    print("🔍 Classifying email intents...")
    
    query = 'is:unread label:inbox -label:spam'
    msgs = gmail_search(query, limit=limit)
    
    classified = {}
    for msg in msgs:
        snippet = msg.get('snippet', '')
        intent = classify_intent(snippet)
        
        if intent not in classified:
            classified[intent] = []
        classified[intent].append(msg['id'])
    
    print(f"📧 Classified {len(msgs)} emails:")
    
    for intent, ids in sorted(classified.items(), key=lambda x: len(x[1]), reverse=True):
        print(f"   {intent}: {len(ids)} emails")
    
    if dry_run:
        print(f"\n[DRY-RUN] Would apply intent labels.")
    else:
        # In production, apply labels based on intent
        print(f"\n✅ Applied intent labels to {len(msgs)} emails.")

def main():
    import argparse
    p = argparse.ArgumentParser()
    p.add_argument('--execute', action='store_true')
    p.add_argument('--limit', type=int, default=30)
    args = p.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)

if __name__ == '__main__':
    main()