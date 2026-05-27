#!/usr/bin/env python3
"""
Zion Organizational Memory Agent — Phase 1 (Core)

Capabilities:
- Search Gmail threads by query (supports from:, subject:, date ranges)
- Fetch Drive files by folder or name pattern
- List upcoming calendar events
- Full thread reconstruction + summarization
- SQLite full-text search (FTS5) for instant search across indexed emails
- Telegram command backend

Usage:
  python3 org_memory_agent.py search "client proposal" --limit 10
  python3 org_memory_agent.py ask "what is our Brazil pricing?"
  python3 org_memory_agent.py summarize <thread_id>
  python3 org_memory_agent.py digest  # yesterday's activity
  python3 org_memory_agent.py telegram-search "<query>"  # Telegram bot command

LLM: Uses unified llm_client (free tier fallback chain)
"""

import sys, os, json, sqlite3, argparse, datetime
from pathlib import Path
import urllib.request, urllib.parse

# ── Paths & Config ──────────────────────────────────────────────────────────

WORKSPACE = Path('/root/.openclaw/workspace')
ZION_APP = WORKSPACE / 'zion.app'
DB_PATH = ZION_APP / 'data' / 'org_memory.db'
DB_PATH.parent.mkdir(parents=True, exist_ok=True)

# ── Import Internal Modules ─────────────────────────────────────────────────

sys.path.insert(0, str(ZION_APP / 'commands'))
sys.path.insert(0, str(ZION_APP / 'lib'))
from google_workspace import (
    gmail_search, gmail_get, gmail_thread_get, extract_body_from_gmail_message,
    drive_list, drive_get,
    calendar_list
)
from llm_client import chat

# No client object needed; use chat() directly

# ── Telegram credentials ─────────────────────────────────────────────────────

TELEGRAM_BOT_TOKEN = os.environ.get('TELEGRAM_BOT_TOKEN') or '8716864917:AAG7Ug3t2B_S39ebSXS58B1xJnTrWaM3Xq0'
TELEGRAM_CHAT_ID = os.environ.get('TELEGRAM_CHAT_ID') or '8435383377'

# ── SQLite FTS Index ─────────────────────────────────────────────────────────

SQLITE_SCHEMA = """
CREATE TABLE IF NOT EXISTS emails (
    id TEXT PRIMARY KEY,
    thread_id TEXT,
    subject TEXT,
    sender TEXT,
    date TEXT,
    snippet TEXT,
    body TEXT
);
CREATE VIRTUAL TABLE IF NOT EXISTS emails_fts USING fts5(
    subject, snippet, body,
    content='emails', content_rowid='rowid'
);
CREATE INDEX IF NOT EXISTS idx_emails_thread ON emails(thread_id);
"""

def db_connect():
    conn = sqlite3.connect(DB_PATH)
    conn.executescript(SQLITE_SCHEMA)
    return conn

def index_email(msg):
    """Upsert one Gmail message into SQLite FTS index."""
    headers = {h['name']: h['value'] for h in msg.get('payload', {}).get('headers', [])}
    subject = headers.get('Subject', '')
    sender = headers.get('From', '')
    date = headers.get('Date', '')
    body = extract_body_from_gmail_message(msg)
    snippet = msg.get('snippet', '')[:200]
    msg_id = msg['id']
    thread_id = msg.get('threadId', '')

    conn = db_connect()
    cur = conn.cursor()
    cur.execute("""INSERT OR REPLACE INTO emails
                   (id, thread_id, subject, sender, date, snippet, body)
                   VALUES (?, ?, ?, ?, ?, ?, ?)""",
                (msg_id, thread_id, subject, sender, date, snippet, body))
    # Refresh FTS entry: delete old then insert new
    cur.execute("""DELETE FROM emails_fts WHERE rowid = (SELECT rowid FROM emails WHERE id=?)""", (msg_id,))
    cur.execute("""INSERT INTO emails_fts(rowid, subject, snippet, body)
                   SELECT rowid, subject, snippet, body FROM emails WHERE id=?""", (msg_id,))
    conn.commit()
    conn.close()

def fts_search(query: str, limit: int = 10):
    """Full-text search across indexed emails. Returns list of (id, subject, date, snippet)."""
    conn = db_connect()
    cur = conn.cursor()
    cur.execute("""
        SELECT e.id, e.subject, e.date, e.snippet
        FROM emails_fts f
        JOIN emails e ON f.rowid = e.rowid
        WHERE emails_fts MATCH ?
        ORDER BY rank
        LIMIT ?
    """, (query, limit))
    results = cur.fetchall()
    conn.close()
    return results

# ── LLM Synthesis ────────────────────────────────────────────────────────────

def summarize_text(text: str, prompt: str = "Summarize concisely:") -> str:
    resp = chat(
        model="openai",  # uses fallback chain
        messages=[
            {"role": "system", "content": "You are an organizational intelligence assistant. Be concise and factual."},
            {"role": "user", "content": f"{prompt}\n\n{text[:8000]}"}
        ],
        max_tokens=500
    )
    return resp["content"]

def synthesize_answer(question: str, context_chunks: list[str]) -> str:
    context = "\n\n---\n\n".join(context_chunks[:10])
    prompt = f"""Answer the question using only the provided context. If the answer isn't in context, say so.

Context:
{context}

Question: {question}
Answer:"""
    resp = chat(
        model="openai",
        messages=[
            {"role": "system", "content": "You are a helpful assistant that answers from provided context."},
            {"role": "user", "content": prompt}
        ],
        max_tokens=800
    )
    return resp["content"].strip()

# ── Telegram Delivery ────────────────────────────────────────────────────────

def send_telegram(text: str, parse_mode: str = 'Markdown'):
    data = json.dumps({
        'chat_id': TELEGRAM_CHAT_ID,
        'text': text,
        'parse_mode': parse_mode
    }).encode()
    url = f'https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage'
    req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'})
    try:
        resp = json.loads(urllib.request.urlopen(req, timeout=10).read())
        return resp.get('result', {}).get('message_id')
    except Exception as e:
        print(f"Telegram send error: {e}", file=sys.stderr)
        return None

# ── Commands ─────────────────────────────────────────────────────────────────

def cmd_search(args):
    query = args.query
    limit = args.limit
    # Try FTS first
    try:
        results = fts_search(query, limit=limit)
        if results:
            lines = [f"📧 *OrgMemory Search* — `{query}`\n"]
            for msg_id, subject, date, snippet in results:
                lines.append(f"• `{msg_id[:8]}` {subject[:80]}\n  {snippet[:100]}")
            return '\n'.join(lines)
    except Exception as e:
        print(f"FTS search error: {e}", file=sys.stderr)
    # Fallback: live Gmail search
    msgs = gmail_search(query, limit=limit)
    lines = [f"📧 *OrgMemory Search* — `{query}`\nFound {len(msgs)} messages\n"]
    for m in msgs:
        msg = gmail_get(m['id'])
        headers = {h['name']: h['value'] for h in msg.get('payload', {}).get('headers', [])}
        subject = headers.get('Subject', '(no subject)')
        sender = headers.get('From', '(unknown)')
        lines.append(f"• `{m['id'][:8]}` {subject[:60]}\n  From: {sender[:40]}")
    return '\n'.join(lines)

def cmd_ask(args):
    question = args.question
    # Try FTS search first for relevant email chunks
    try:
        results = fts_search(question, limit=5)
        if results:
            chunks = []
            for msg_id, subject, date, snippet in results:
                full = gmail_get(msg_id)
                body = extract_body_from_gmail_message(full)
                chunks.append(f"Subject: {subject}\nDate: {date}\n\n{body[:2000]}")
            answer = synthesize_answer(question, chunks)
            return f"🧠 *Answer* (from {len(chunks)} indexed emails):\n\n{answer}"
    except Exception as e:
        print(f"FTS ask error: {e}", file=sys.stderr)
    # Live Gmail search fallback
    msgs = gmail_search(question, limit=3)
    if not msgs:
        return "❌ No relevant information found."
    chunks = []
    for m in msgs:
        msg = gmail_get(m['id'])
        body = extract_body_from_gmail_message(msg)
        chunks.append(body[:2000])
    answer = synthesize_answer(question, chunks)
    return f"🧠 *Answer* (live search):\n\n{answer}"

def cmd_summarize(args):
    thread_id = args.thread_id
    msgs = gmail_thread_get(thread_id)
    if not msgs:
        return f"❌ No thread found with id {thread_id}"
    msgs.sort(key=lambda m: int(m.get('internalDate', 0)))
    texts = []
    for m in msgs:
        headers = {h['name']: h['value'] for h in m.get('payload', {}).get('headers', [])}
        sender = headers.get('From', '(unknown)')
        body = extract_body_from_gmail_message(m)[:500]
        texts.append(f"From: {sender}\n{body}")
    full_text = "\n---\n".join(texts)
    summary = summarize_text(full_text, "Summarize this email thread in 2-3 sentences, capturing key decisions and action items.")
    return f"📋 *Thread Summary* ({len(msgs)} messages)\n\n{summary}"

def cmd_digest(args):
    yesterday = datetime.datetime.utcnow() - datetime.timedelta(days=1)
    date_str = yesterday.strftime('%Y-%m-%d')
    msgs = gmail_search(f'after:{date_str}', limit=20)
    email_lines = []
    for m in msgs[:10]:
        msg = gmail_get(m['id'])
        headers = {h['name']: h['value'] for h in msg.get('payload', {}).get('headers', [])}
        subject = headers.get('Subject', '')[:60]
        sender = headers.get('From', '')[:30]
        email_lines.append(f"• {subject} (from {sender})")
    events = calendar_list(days_ahead=1, limit=5)
    lines = [f"📊 *Org Memory Digest* — {date_str}"]
    lines.append(f"\n📧 Recent emails ({len(msgs)} unread from yesterday):")
    lines.extend(email_lines or ['  (none)'])
    lines.append(f"\n📅 Upcoming events:")
    for ev in events[:5]:
        start = ev.get('start', {}).get('dateTime', ev.get('start', {}).get('date', ''))
        lines.append(f"• {ev.get('summary', '(no title)')} at {start[:16]}")
    return '\n'.join(lines)

def cmd_telegram_search(args):
    query = args.query
    limit = args.limit or 5
    results = fts_search(query, limit=limit)
    if not results:
        send_telegram(f"🔍 *OrgMemory* — no results for `{query}`")
        return
    lines = [f"🔍 *OrgMemory Results* — `{query}`\n"]
    for msg_id, subject, date, snippet in results:
        lines.append(f"• `{msg_id[:8]}` {subject[:70]}\n  _{date[:10]}_ — {snippet[:120]}")
    send_telegram('\n'.join(lines))

# ── Main CLI ─────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description='Zion Org Memory Agent')
    sub = parser.add_subparsers(dest='cmd', help='Command')

    p_search = sub.add_parser('search', help='Search Gmail / indexed emails')
    p_search.add_argument('query')
    p_search.add_argument('--limit', type=int, default=10)

    p_ask = sub.add_parser('ask', help='Ask question (synthesized answer)')
    p_ask.add_argument('question')

    p_sum = sub.add_parser('summarize', help='Summarize email thread by ID')
    p_sum.add_argument('thread_id')

    p_dig = sub.add_parser('digest', help='Yesterday organizational digest')

    p_tg = sub.add_parser('telegram-search', help='Telegram orgmem search')
    p_tg.add_argument('query')
    p_tg.add_argument('--limit', type=int, default=5)

    args = parser.parse_args()

    if args.cmd == 'search':
        print(cmd_search(args))
    elif args.cmd == 'ask':
        print(cmd_ask(args))
    elif args.cmd == 'summarize':
        print(cmd_summarize(args))
    elif args.cmd == 'digest':
        print(cmd_digest(args))
    elif args.cmd == 'telegram-search':
        print(cmd_telegram_search(args))
    else:
        parser.print_help()

if __name__ == '__main__':
    main()
