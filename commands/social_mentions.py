#!/usr/bin/env python3
"""
Social Mention Alerts — Zion Tech Group

Daily web search for brand mentions ("Zion Tech Group", "Zion Holdings").
Aggregates results, scores sentiment via LLM, and sends Telegram summary.

Usage:
  python3 social_mentions.py [--execute]   # Send Telegram (default dry-run)
"""

import sys, os, re, datetime, argparse
from pathlib import Path

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

# ── Configuration ────────────────────────────────────────────────────────────

SEARCH_TERMS = ['"Zion Tech Group"', '"Zion Holdings"', 'ZionTechGroup', 'Zion Holdings AI']
MAX_RESULTS = 10

def fetch_mentions():
    results = []
    try:
        for term in SEARCH_TERMS:
            resp = web_search(query=term, count=MAX_RESULTS, type='auto')
            for r in resp.get('results', []):
                results.append({'title': r.get('title',''), 'url': r.get('url',''), 'snippet': r.get('summary','')[:200]})
    except Exception as e:
        print(f"⚠️  web_search unavailable: {e}")
        return []
    return results

def sentiment_analysis(articles: list) -> str:
    if not articles:
        return "No mentions found."
    prompt = (
        "You are a PR analyst. Given these web mentions of Zion Tech Group, "
        "assess overall sentiment (positive/neutral/negative) and highlight any concerning items.\n\n"
        + '\n'.join(f"{i+1}. {a['title']} — {a['snippet']}" for i,a in enumerate(articles[:10])) +
        "\n\nProvide a 2-sentence summary and a one-word sentiment (Positive/Neutral/Negative)."
    )
    try:
        from llm_client import chat
        resp = chat([{"role": "user", "content": prompt}], provider="auto")
        return resp['content'].strip()
    except Exception as e:
        return f"(LLM sentiment analysis unavailable: {e})"

def cmd_run(dry_run: bool):
    print("🔍 Social Mentions scanning…")
    articles = fetch_mentions()
    print(f"📰 Found {len(articles)} mentions")

    summary = sentiment_analysis(articles)
    today = datetime.date.today().strftime('%b %d')
    report = f"📢 *Brand Mentions — {today}*\n\n{summary}"

    if dry_run:
        print("\n--- TELEGRAM PREVIEW ---")
        print(report)
        print("--- END ---")
        print("\n💡 Add --execute to send.")
        return

    try:
        message(action='send', target='telegram', message=report)
        print("📡 Telegram sent.")
    except Exception as e:
        print(f"❌ Telegram failed: {e}")

def main():
    parser = argparse.ArgumentParser(description='Social Mention Alerts')
    parser.add_argument('--execute', action='store_true', help='Send Telegram (default dry-run)')
    args = parser.parse_args()
    cmd_run(dry_run=not args.execute)

if __name__ == '__main__':
    main()
