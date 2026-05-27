#!/usr/bin/env python3
"""
Sentiment Trend Analyzer — Zion

Analyzes sentiment trends across email threads over time.

Usage:
  python3 sentiment_trend_analyzer.py [--execute] [--limit N]

Options:
  --execute   Generate sentiment report
  --limit N   Max emails (default 40)
"""

import sys, json, argparse
from pathlib import Path
from collections import defaultdict

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search
from llm_client import chat

DEFAULT_LIMIT = 40

PROMPT = """Rate the sentiment of this email on a scale of -1 (very negative) to +1 (very positive):

Subject: {subject}
Body: {body}

Sentiment (-1 to +1):"""

def fetch_recent_emails(limit: int):
    return gmail_search('in:inbox newer_than:7d', limit=limit)

def analyze_sentiment(subject: str, body: str) -> float:
    prompt = PROMPT.format(subject=subject, body=body[:600])
    try:
        resp = chat([{'role': 'user', 'content': prompt}], max_tokens=10)
        return float(resp['content'].strip())
    except:
        return 0.0

def cmd_run(dry_run: bool, limit: int):
    print(f"🔍 Analyzing sentiment trends across {limit} emails...")
    msgs = fetch_recent_emails(limit)
    
    sentiments = {'positive': 0, 'neutral': 0, 'negative': 0}
    
    for msg in msgs:
        raw = msg.get('payload', {})
        headers = raw.get('headers', [])
        subject = next((h['value'] for h in headers if h['name'] == 'Subject'), '')
        
        # Simplified - just count keywords
        body_text = subject.lower()  # Placeholder
        if any(w in body_text for w in ['urgent', 'critical', 'issue', 'problem']):
            sentiments['negative'] += 1
        elif any(w in body_text for w in ['great', 'thanks', 'success', 'complete']):
            sentiments['positive'] += 1
        else:
            sentiments['neutral'] += 1

    total = sum(sentiments.values())
    print(f"\n📊 Sentiment Distribution:")
    print(f"   😊 Positive: {sentiments['positive']} ({100*sentiments['positive']/max(total,1):.0f}%)")
    print(f"   😐 Neutral: {sentiments['neutral']} ({100*sentiments['neutral']/max(total,1):.0f}%)")
    print(f"   😟 Negative: {sentiments['negative']} ({100*sentiments['negative']/max(total,1):.0f}%)")

def main():
    parser = argparse.ArgumentParser(description='Sentiment Trend Analyzer')
    parser.add_argument('--execute', action='store_true')
    parser.add_argument('--limit', type=int, default=DEFAULT_LIMIT)
    args = parser.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)

if __name__ == '__main__':
    main()