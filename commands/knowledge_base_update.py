#!/usr/bin/env python3
from __future__ import annotations

"""
Knowledge Base Auto-Update — Zion Tech Group

Monitors email threads for resolved questions / technical solutions.
Extracts Q&A pairs, formats them, and appends to a local Markdown knowledge base.
Helps build a searchable internal wiki from everyday support resolution.

Usage:
  python3 knowledge_base_update.py [--execute]   # Append to KB file (default dry-run)
"""

import sys, os, re, json, datetime, argparse
from pathlib import Path

WORKSPACE = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(WORKSPACE / 'commands'))
sys.path.insert(0, str(WORKSPACE))

from google_workspace import gmail_search, gmail_get
from llm_client import chat

KB_DIR = WORKSPACE / 'kb'
KB_FILE = KB_DIR / 'knowledge_base.md'
DAILY_LIMIT = 10
LOOKBACK_DAYS = 90

def find_resolved_threads(days: int = LOOKBACK_DAYS) -> list:
    since = (datetime.date.today() - datetime.timedelta(days=days)).isoformat()
    query = f'after:{since} (label:Tech-Support OR label:Sales-Support)'
    msgs = gmail_search(query, limit=100)
    thread_ids = {}
    for m in msgs:
        tid = m.get('threadId')
        if tid and tid not in thread_ids:
            thread_ids[tid] = m
    return list(thread_ids.values())

def extract_qa_from_thread(thread_id: str) -> dict | None:
    msgs = gmail_search(f'thread:{thread_id}', limit=10)
    if len(msgs) < 2:
        return None
    question = None
    answer = None
    for m in msgs:
        headers = {h['name']: h['value'] for h in m.get('payload', {}).get('headers', [])}
        from_hdr = headers.get('From','')
        body = extract_body_from_gmail_message(m)[:2000]
        if not question and 'ziontechgroup.com' not in from_hdr.lower():
            question = {'subject': headers.get('Subject',''), 'body': body[:800]}
        elif 'ziontechgroup.com' in from_hdr.lower() and question and not answer:
            answer = {'body': body[:800]}
    if question and answer:
        return {'question': question, 'answer': answer}
    return None

def summarize_qa_llm(qa: dict) -> str:
    prompt = (
        "You are writing a knowledge base article for Zion Tech Group's internal wiki.\n"
        "Given the following Q&A, produce a concise, well-structured article in Markdown.\n"
        "Format:\n## <Title>\n\n**Question:** ...\n\n**Answer:** ...\n\n"
        f"Customer question:\n{qa['question']['body']}\n\n"
        f"Our response:\n{qa['answer']['body']}"
    )
    try:
        resp = chat([{"role":"user","content":prompt}], provider="auto")
        return resp['content'].strip()
    except Exception as e:
        return f"(Failed to generate: {e})"

def append_to_kb_local(content: str):
    timestamp = datetime.datetime.utcnow().strftime('%Y-%m-%d %H:%M')
    section = f"\n\n---\n\n## {timestamp}\n\n{content}"
    KB_FILE.parent.mkdir(parents=True, exist_ok=True)
    with KB_FILE.open('a', encoding='utf-8') as f:
        f.write(section)
    print(f"   📄 KB updated: {KB_FILE}")

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

def cmd_run(dry_run: bool, limit: int):
    print("📚 Knowledge Base Auto-Update scanning resolved threads…")
    candidates = find_resolved_threads()
    print(f"   Found {len(candidates)} candidate threads")
    extracted = 0
    for t in candidates[:limit]:
        qa = extract_qa_from_thread(t['threadId'])
        if not qa:
            continue
        article = summarize_qa_llm(qa)
        if article.startswith('(Failed'):
            continue
        subject = qa['question'].get('subject','Untitled')[:60]
        print(f"   ✅ KB article: {subject}")
        if dry_run:
            print(f"      [DRY-RUN] Would append to KB")
            extracted += 1
            continue
        append_to_kb_local(article)
        extracted += 1
    print(f"\n✅ Extracted {extracted} knowledge-base articles.")
    if dry_run:
        print("💡 Add --execute to append to local KB.")

def main():
    parser = argparse.ArgumentParser(description='Knowledge Base Auto-Update')
    parser.add_argument('--execute', action='store_true', help='Append to KB')
    parser.add_argument('--limit', type=int, default=DAILY_LIMIT)
    args = parser.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)

if __name__ == '__main__':
    main()
