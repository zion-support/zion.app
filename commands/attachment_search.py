#!/usr/bin/env python3
"""
Attachment Search — Zion Tech Group

Full-text search over indexed attachments (SQLite FTS5).
Shows matching files with domain, date, and Drive link.

Usage:
  python3 attachment_search.py "invoice acme"
  python3 attachment_search.py "contract" --domain client.com
  python3 attachment_search.py "report" --limit 20
"""

import sys, sqlite3, argparse
from pathlib import Path

WORKSPACE = Path('/root/.openclaw/workspace')
DB_PATH = WORKSPACE / 'zion.app' / 'data' / 'attachments.db'

def search(query: str, domain: str = None, limit: int = 10):
    if not DB_PATH.exists():
        print("❌ Index not found. Run attachment_indexer.py first.")
        sys.exit(1)

    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()

    # FTS query over filename, domain, content_text
    sql = """
    SELECT a.filename, a.domain, a.saved_date, a.drive_link, a.content_text
    FROM attachments a
    JOIN attachments_fts fts ON a.id = fts.rowid
    WHERE attachments_fts MATCH ?
    """
    params = [query]

    if domain:
        sql += " AND a.domain = ?"
        params.append(domain)

    sql += " ORDER BY a.indexed_at DESC LIMIT ?"
    params.append(limit)

    cur.execute(sql, params)
    rows = cur.fetchall()
    conn.close()

    if not rows:
        print(f"🔍 No attachments found for: '{query}'")
        return

    print(f"🔍 Top {len(rows)} results for '{query}':\n")
    for filename, domain, saved_date, link, snippet in rows:
        # Truncate content for display
        preview = (snippet or '')[:120].replace('\n', ' ')
        print(f"📄 {filename}")
        print(f"   Domain: {domain}  Saved: {saved_date}")
        print(f"   Link:   {link}")
        print(f"   Preview: {preview}…")
        print()

def main():
    parser = argparse.ArgumentParser(description='Search indexed attachments')
    parser.add_argument('query', help='Full-text search query')
    parser.add_argument('--domain', help='Filter by client domain')
    parser.add_argument('--limit', type=int, default=10, help='Max results')
    args = parser.parse_args()
    search(args.query, domain=args.domain, limit=args.limit)

if __name__ == '__main__':
    main()
