#!/usr/bin/env python3
"""
Client Health Scorecard — Zion Tech Group

Aggregates client-level metrics:
  - Unread email volume (last 7d)
  - Contract expiration proximity
  - Overdue invoices
  - Sentiment trend (last emails)
Produces a score (0–100) and weekly summary via Telegram.

Usage:
  python3 client_health.py [--execute]   # Weekly digest (default dry-run)
"""

import sys, os, re, json, datetime, argparse, urllib.request, urllib.parse
from pathlib import Path

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))

from google_workspace import gmail_search, gmail_get, gmail_list_labels, gog_headers
from llm_client import chat

SCORE_DB = WORKSPACE / 'zion.app' / 'data' / 'client_health.json'
CONTRACT_DB = WORKSPACE / 'zion.app' / 'data' / 'contracts.db'
LOOKBACK_DAYS = 30

def fetch_client_domains() -> list:
    """Get client domains from Drive Clients/ folder."""
    params = {'q': "name='Clients' and mimeType='application/vnd.google-apps.folder' and trashed=false", 'pageSize': 5, 'fields': 'files(id,name)'}
    url = 'https://www.googleapis.com/drive/v3/files?' + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers=gog_headers())
    resp = json.loads(urllib.request.urlopen(req).read())
    folders = resp.get('files', [])
    if not folders: return []
    parent_id = folders[0]['id']
    params2 = {'q': f"'{parent_id}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false", 'pageSize': 200, 'fields': 'files(name)'}
    url2 = 'https://www.googleapis.com/drive/v3/files?' + urllib.parse.urlencode(params2)
    req2 = urllib.request.Request(url2, headers=gog_headers())
    resp2 = json.loads(urllib.request.urlopen(req2).read())
    return [f['name'].lower() for f in resp2.get('files', [])]

def email_volume_for_domain(domain: str, days: int = 7) -> int:
    since = (datetime.date.today() - datetime.timedelta(days=days)).isoformat()
    # Search for from:@domain (simple)
    query = f'from:@{domain} after:{since}'
    msgs = gmail_search(query, limit=200)
    return len(msgs)

def fetch_recent_sentiment(domain: str, days: int = 30) -> str:
    """Get a few recent emails from this domain and ask LLM for sentiment trend."""
    since = (datetime.date.today() - datetime.timedelta(days=days)).isoformat()
    msgs = gmail_search(f'from:@{domain} after:{since}', limit=10)
    if not msgs:
        return 'no-data'
    bodies = []
    for m in msgs[:5]:
        msg = gmail_get(m['id'])
        bodies.append(extract_body_from_gmail_message(msg)[:300])
    sample = '\n---\n'.join(bodies)
    prompt = (
        "Given these email excerpts from a client, rate the overall sentiment as "
        "Positive / Neutral / Negative. Return one word only."
        f"\n\nExcerpts:\n{sample}"
    )
    try:
        resp = chat([{"role": "user", "content": prompt}], provider="auto")
        return resp['content'].strip().lower()
    except Exception:
        return 'unknown'

def load_contract_status() -> dict:
    """Read contracts.db to get expiry proximity per client domain."""
    import sqlite3
    if not CONTRACT_DB.exists():
        return {}
    conn = sqlite3.connect(CONTRACT_DB)
    cur = conn.cursor()
    cur.execute("SELECT client_domain, expiry_parsed, days_until FROM contracts")
    rows = cur.fetchall()
    conn.close()
    status = {}
    for domain, expiry, days_left in rows:
        if days_left is not None and days_left <= 30:
            status[domain] = {'expiry': expiry, 'days_left': days_left}
    return status

def compute_health_score(domain: str, contract_info: dict, sentiment: str) -> int:
    """Heuristic score 0–100 (higher = healthier)."""
    score = 100

    # Deductions: high email volume (over 10 in 7d)
    vol = email_volume_for_domain(domain, days=7)
    if vol > 50:
        score -= 15
    elif vol > 20:
        score -= 8
    elif vol > 10:
        score -= 3

    # Sentiment
    if sentiment == 'negative':
        score -= 20
    elif sentiment == 'neutral':
        score -= 5

    # Contract expiring soon
    if domain in contract_info:
        dl = contract_info[domain]['days_left']
        if dl <= 7:
            score -= 25
        elif dl <= 30:
            score -= 10

    return max(0, min(100, score))

def color_score(score: int) -> str:
    if score >= 80: return '🟢'
    if score >= 60: return '🟡'
    if score >= 40: return '🟠'
    return '🔴'

def extract_body_from_gmail_message(msg):
    payload = msg.get('payload', {})
    if 'parts' in payload:
        for part in payload['parts']:
            if part.get('mimeType') == 'text/plain':
                data = part.get('body', {}).get('data', '')
                if data:
                    import base64
                    return base64.urlsafe_b64decode(data + '===').decode('utf-8', errors='replace')
    body = payload.get('body', {}).get('data', '')
    if body:
        import base64
        return base64.urlsafe_b64decode(body + '===').decode('utf-8', errors='replace')
    return ''

def cmd_run(dry_run: bool):
    print("🏥 Client Health Scorecard running…")
    domains = fetch_client_domains()
    print(f"   Clients: {len(domains)}")

    contract_info = load_contract_status()
    scores = {}
    for domain in domains:
        sentiment = fetch_recent_sentiment(domain, days=LOOKBACK_DAYS)
        score = compute_health_score(domain, contract_info, sentiment)
        scores[domain] = {'score': score, 'sentiment': sentiment}
        print(f"   {domain}: {score} {color_score(score)} (sentiment: {sentiment})")

    # Build summary report
    today = datetime.date.today().isoformat()
    lines = [f"📊 *Client Health — {today}*\n"]
    for domain, info in sorted(scores.items(), key=lambda x: x[1]['score']):
        lines.append(f"• {domain}: {info['score']} {color_score(info['score'])}")
    summary = '\n'.join(lines)

    if dry_run:
        print("\n--- TELEGRAM PREVIEW ---")
        print(summary)
        print("--- END PREVIEW ---")
        print("\n💡 Add --execute to send.")
        return

    try:
        message(action='send', target='telegram', message=summary)
        print("📡 Telegram health digest sent.")
    except Exception as e:
        print(f"❌ Telegram failed: {e}")

def main():
    parser = argparse.ArgumentParser(description='Client Health Scorecard')
    parser.add_argument('--execute', action='store_true', help='Send Telegram (default dry-run)')
    args = parser.parse_args()
    cmd_run(dry_run=not args.execute)

if __name__ == '__main__':
    main()
