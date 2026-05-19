#!/usr/bin/env python3
"""
Deal Stage Tracker — Zion

Tracks sales deals through stages based on email signals.

Usage:
  python3 deal_stage_tracker.py [--execute] [--limit N]

Options:
  --execute   Update deal tracking
  --limit N   Max emails (default 30)
"""

import sys, json, argparse, re
from pathlib import Path

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, gmail_get, gmail_get_or_create_label_id, gmail_batch_modify

DEFAULT_LIMIT = 30

SALES_STAGES = {
    'prospecting': ['interested', 'learn more', 'information', 'pricing'],
    'qualification': ['demo', 'discuss', 'questions', 'requirements'],
    'proposal': ['proposal', 'quote', 'estimate', 'terms'],
    'negotiation': ['negotiate', 'adjust', 'modify', 'counter'],
    'closed_won': ['agree', 'accepted', 'proceed', 'sign', 'approved'],
    'closed_lost': ['no thanks', 'not interested', 'pass', 'budget']
}

def detect_deal_stage(subject: str, body: str) -> str:
    text = (subject + ' ' + body).lower()
    
    for stage, keywords in SALES_STAGES.items():
        if any(kw in text for kw in keywords):
            return stage
    return 'prospecting'  # Default

def cmd_run(dry_run: bool, limit: int):
    print(f"🔍 Tracking deal stages for {limit} emails...")
    
    # Look for sales-related emails
    queries = ['subject:(deal OR proposal OR quote OR pricing)', 'subject:(client OR customer OR prospect)']
    all_msgs = []
    for q in queries:
        msgs = gmail_search(q + ' newer_than:30d', limit=limit//2)
        all_msgs.extend(msgs)
    
    stages = {}
    for msg in all_msgs[:limit]:
        raw = gmail_get(msg['id'])
        headers = raw.get('payload', {}).get('headers', [])
        subject = next((h['value'] for h in headers if h['name'] == 'Subject'), '')
        
        body_data = raw.get('payload', {}).get('body', {}).get('data', '')
        if not body_data:
            parts = raw.get('payload', {}).get('parts', [])
            for part in parts:
                if part.get('mimeType') == 'text/plain':
                    body_data = part.get('body', {}).get('data', '')
                    break
        
        import base64
        body = base64.urlsafe_b64decode(body_data).decode('utf-8', errors='ignore')
        
        stage = detect_deal_stage(subject, body)
        stages[stage] = stages.get(stage, 0) + 1
        
        stage_emoji = {
            'prospecting': '🔍', 'qualification': '🎯', 'proposal': '💼',
            'negotiation': '🤝', 'closed_won': '✅', 'closed_lost': '❌'
        }.get(stage, '📧')
        
        print(f"   {stage_emoji} {stage}: {subject[:35]}...")
        
        if not dry_run:
            label_id = gmail_get_or_create_label_id(f'Deal-{stage}')
            gmail_batch_modify({'ids': [msg['id']]}, addLabelIds=[label_id])

    print(f"\n📊 Deal stage distribution: {stages}")

def main():
    parser = argparse.ArgumentParser(description='Deal Stage Tracker')
    parser.add_argument('--execute', action='store_true')
    parser.add_argument('--limit', type=int, default=DEFAULT_LIMIT)
    args = parser.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)

if __name__ == '__main__':
    main()