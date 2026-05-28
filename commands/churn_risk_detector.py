#!/usr/bin/env python3
"""
Churn Risk Detector — Zion

Detects customers at risk of churning based on communication signals.

Usage:
  python3 churn_risk_detector.py [--execute] [--limit N]

Options:
  --execute   Flag at-risk clients
  --limit N   Max emails (default 30)
"""

import sys, json, argparse, re
from pathlib import Path

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, gmail_get
from llm_client import chat

DEFAULT_LIMIT = 30

CHURN_SIGNALS = {
    'explicit': ['cancel', 'terminate', 'not renewing', 'ending partnership', 'moving on'],
    'distant': ['check in', 'where are you', 'haven\'t heard', 'following up'],
    'unhappy': ['issue', 'problem', 'concern', 'disappointed', 'frustrated', 'angry'],
    'negotiation': ['reduce', 'adjust', 'reconsider', 'price point', 'better rate'],
    'competitor': ['evaluating', 'considering', 'looking at', 'alternative']
}

def assess_churn_risk(subject: str, body: str) -> tuple:
    text = (subject + ' ' + body).lower()
    signals = []
    risk_score = 0
    
    for signal_type, keywords in CHURN_SIGNALS.items():
        for kw in keywords:
            if kw in text:
                signals.append(signal_type)
                risk_score += {'explicit': 10, 'unhappy': 5, 'competitor': 4, 'negotiation': 3, 'distant': 2}[signal_type]
                break
    
    risk_level = 'high' if risk_score >= 8 else 'medium' if risk_score >= 4 else 'low'
    return risk_level, signals

def cmd_run(dry_run: bool, limit: int):
    print(f"🔍 Detecting churn risk for {limit} client communications...")
    
    msgs = gmail_search('from:(client OR customer OR partner) newer_than:30d', limit=limit)
    
    risk_distribution = {'high': 0, 'medium': 0, 'low': 0}
    
    for msg in msgs[:limit]:
        subject = msg.get('snippet', '')[:50]
        risk_level, signals = assess_churn_risk(subject, '')
        risk_distribution[risk_level] += 1
        
        emoji = {'high': '🔴', 'medium': '🟠', 'low': '🟢'}[risk_level]
        print(f"   {emoji} {risk_level.upper()} {subject[:35]}... ({', '.join(signals) if signals else 'no signals'})")

    print(f"\n📊 Churn distribution: High={risk_distribution['high']}, Medium={risk_distribution['medium']}, Low={risk_distribution['low']}")

def main():
    parser = argparse.ArgumentParser(description='Churn Risk Detector')
    parser.add_argument('--execute', action='store_true')
    parser.add_argument('--limit', type=int, default=DEFAULT_LIMIT)
    args = parser.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)

if __name__ == '__main__':
    main()