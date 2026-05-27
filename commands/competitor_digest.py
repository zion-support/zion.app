#!/usr/bin/env python3
"""
Competitor Intelligence Digest — Zion Tech Group

Weekly automated web search for competitor news, pricing changes, and feature updates.
Aggregates top results, summarizes with LLM, delivers via Telegram + markdown report.

Schedule: Weekly on Sunday 08:00 UTC

Usage:
  python3 competitor_digest.py [--execute]   # Default dry-run
"""

import sys, os, re, json, datetime, argparse, urllib.request
from pathlib import Path

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from llm_client import chat
from google_workspace import telegram_send

DIGEST_DB = WORKSPACE / 'zion.app' / 'data' / 'competitor_digest.json'
REPORTS_DIR = WORKSPACE / 'zion.app' / 'reports' / 'competitor'
SEARCH_QUERIES = [
    "Zion Tech Group competitor",
    "Zion App pricing",
    "AI workspace automation alternatives",
    "OpenClaw vs KiloCode",
    "Zion Holdings competitor analysis"
]

def load_digest_db() -> dict:
    if DIGEST_DB.exists():
        return json.loads(DIGEST_DB.read_text())
    return {'lastRun': None, 'history': []}

def save_digest_db(db: dict):
    DIGEST_DB.parent.mkdir(parents=True, exist_ok=True)
    DIGEST_DB.write_text(json.dumps(db, indent=2))

def web_search(query: str, limit: int = 5) -> list:
    """DuckDuckGo HTML scrape — no API key needed."""
    try:
        encoded = urllib.parse.quote(query)
        url = f"https://html.duckduckgo.com/html/?q={encoded}"
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        resp = urllib.request.urlopen(req, timeout=8)  # shorter timeout to avoid hanging
        html = resp.read().decode('utf-8', errors='replace')
        results = []
        for m in re.finditer(r'<a[^>]+class="[^"]*result__a[^"]*"[^>]+href="([^"]+)"[^>]*>([^<]+)</a>', html):
            results.append({'title': m.group(2), 'url': m.group(1)})
            if len(results) >= limit:
                break
        return results
    except Exception as e:
        print(f"   ⚠️ Search failed '{query}': {e}")
        return []

def summarize_findings(results_by_query: dict) -> str:
    all_items = []
    for query, results in results_by_query.items():
        for r in results:
            all_items.append(f"Query: {query}\nTitle: {r['title']}\nURL: {r['url']}\n")
    joined = "\n---\n".join(all_items[:20])
    prompt = (
        "You are a business intelligence analyst for Zion Tech Group.\n"
        "Summarize competitor search results into a weekly digest.\n\n"
        "**Competitor Digest — {Date}**\n\n"
        "## 🥊 Competitor News (Top 3)\n"
        "- Bullet list of significant competitor moves (features, pricing, partnerships)\n\n"
        "## 💡 Market Insights\n"
        "- Trends observed\n\n"
        "## ⚠️ Threats & Opportunities\n"
        "- Risks + opportunities for Zion Tech Group\n\n"
        "## 📊 Sources\n"
        "- URLs\n\n"
        f"Data:\n{joined}\n\n"
        "Keep it concise (max 300 words). Use **bold** for key points."
    )
    try:
        resp = chat([{"role": "user", "content": prompt}], provider="auto", temperature=0.4)
        return resp['content']
    except Exception as e:
        return f"Competitor digest generation failed: {e}"

def cmd_run(dry_run: bool):
    print("🥊 Competitor Digest gathering intelligence…")
    results_by_query = {}
    total = 0
    for query in SEARCH_QUERIES:
        print(f"   Searching: '{query}'")
        results = web_search(query, limit=5)
        results_by_query[query] = results
        total += len(results)
        print(f"      → {len(results)} results")
    print(f"   Total results: {total}")
    if total == 0:
        print("   ⚠️  No results found — skipping")
        return
    digest = summarize_findings(results_by_query)
    report_date = datetime.date.today().isoformat()
    report_filename = REPORTS_DIR / f"competitor_{report_date}.md"
    if dry_run:
        print(f"\n   [DRY-RUN] Digest (would save to {report_filename}):")
        print("   " + digest.replace("\n", "\n   "))
        print("\n💡 Add --execute to send Telegram & save report.")
        return
    REPORTS_DIR.mkdir(parents=True, exist_ok=True)
    report_filename.write_text(digest)
    print(f"   ✅ Report saved: {report_filename}")
    try:
        from google_workspace import telegram_send
        telegram_send(f"🥊 Competitor Digest — {report_date}\n\n{digest[:1500]}\n\nFull: file://{report_filename}")
    except Exception as e:
        print(f"   ⚠️  Telegram failed: {e}")
    db = load_digest_db()
    db['history'].append({'date': report_date, 'report': str(report_filename), 'queries': SEARCH_QUERIES, 'resultsCount': total})
    db['lastRun'] = datetime.datetime.utcnow().isoformat()
    save_digest_db(db)
    print(f"\n✅ Competitor digest completed.")

def main():
    parser = argparse.ArgumentParser(description='Competitor Digest')
    parser.add_argument('--execute', action='store_true', help='Send alert & save (default dry-run)')
    args = parser.parse_args()
    cmd_run(dry_run=not args.execute)

if __name__ == '__main__':
    main()
