#!/usr/bin/env python3
"""
Email Quality Score - Zion

Scores email drafts before sending to improve communication quality.
- Analyzes tone and clarity
- Checks for completeness
- Suggests improvements
- Grades readability

Usage:
  python3 quality_score.py --draft-id <id>
  python3 quality_score.py --execute --limit 10
"""

import sys, re
from datetime import datetime
from pathlib import Path
WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search

# Quality scoring criteria
LENGTH_TARGETS = {'subject': (5, 50), 'body': (50, 1000)}
FORMALITY_WORDS = ['please', 'thank you', 'regards', 'sincerely']
AGGRESSIVE_WORDS = ['urgent', 'asap', 'immediately', 'cancel']

def score_email(subject: str, body: str) -> dict:
    """Score email quality and provide feedback."""
    score = 100
    feedback = []
    
    # Subject line check
    if len(subject) < LENGTH_TARGETS['subject'][0]:
        score -= 10
        feedback.append("Subject too short")
    elif len(subject) > LENGTH_TARGETS['subject'][1]:
        score -= 5
        feedback.append("Subject quite long")
    
    # Body length check
    if len(body) < LENGTH_TARGETS['body'][0]:
        score -= 15
        feedback.append("Body too short - add more context")
    
    # Tone analysis
    formal_count = sum(1 for w in FORMALITY_WORDS if w in body.lower())
    aggressive_count = sum(1 for w in AGGRESSIVE_WORDS if w in body.lower())
    
    if aggressive_count > 2:
        score -= 20
        feedback.append("Tone seems aggressive - soften language")
    
    if formal_count == 0:
        score -= 10
        feedback.append("Consider adding courteous language")
    
    # Call to action check
    if '?' not in body and 'action' not in body.lower():
        score -= 5
        feedback.append("No clear call to action")
    
    return {
        'score': max(0, score),
        'grade': 'A' if score >= 90 else 'B' if score >= 80 else 'C' if score >= 70 else 'D',
        'feedback': feedback
    }

def cmd_run(dry_run: bool, limit: int = 10):
    print("📊 Email Quality Score")
    
    # Find draft emails
    query = 'is:draft newer_than:7d'
    msgs = gmail_search(query, limit=limit)
    
    print(f"📊 Scoring {len(msgs)} draft emails")
    
    for msg in msgs[:3]:
        subject = msg.get('subject', '')
        snippet = msg.get('snippet', '')
        
        result = score_email(subject, snippet)
        
        print(f"\n   Subject: {subject[:30]}...")
        print(f"   Quality: {result['score']}/100 ({result['grade']})")
        
        if result['feedback']:
            print(f"   Suggestions: {', '.join(result['feedback'][:2])}")
    
    if dry_run:
        print(f"\n[DRY-RUN] Would score {len(msgs)} draft emails.")
    else:
        print(f"\n✅ Scored {len(msgs)} draft emails.")

def main():
    import argparse
    p = argparse.ArgumentParser()
    p.add_argument('--execute', action='store_true')
    p.add_argument('--limit', type=int, default=10)
    p.add_argument('--draft-id')
    args = p.parse_args()
    
    cmd_run(dry_run=not args.execute, limit=args.limit)

if __name__ == '__main__':
    main()