#!/usr/bin/env python3
"""
Smart Reply Draft Assistant — Zion

Generates contextual reply drafts for Gmail threads using:
- OrgMemory (past similar emails)
- LLM client (free tier fallback chain)
- Gmail API (draft creation)

Usage:
  python3 email_draft_assist.py thread <THREAD_ID>
  python3 email_draft_assist.py message <MESSAGE_ID>
  python3 email_draft_assist.py recent <N>   — Draft replies to N recent unread emails
"""

import sys, os, json, re
from pathlib import Path

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_get, gmail_thread_get, gmail_create_draft, gmail_list_labels
from org_memory_agent import fts_search as search_emails, MEMORY_DB_PATH
from llm_client import chat

def get_thread_context(thread_id: str) -> dict:
    """Fetch full thread + last message details."""
    messages = gmail_thread_get(thread_id)
    if not messages:
        raise ValueError("Empty thread")
    last_msg = messages[-1]
    headers = {h['name']: h['value'] for h in last_msg.get('payload', {}).get('headers', [])}
    subject = headers.get('Subject', '(no subject)')
    from_hdr = headers.get('From', '')
    snippet = last_msg.get('snippet', '')[:300]
    # Get full body (plain text preferred)
    body = ''
    parts = last_msg.get('payload', {}).get('parts', [])
    if parts:
        for part in parts:
            if part.get('mimeType') == 'text/plain':
                body_data = part.get('body', {}).get('data', '')
                if body_data:
                    import base64
                    body = base64.urlsafe_b64decode(body_data).decode('utf-8', errors='ignore')
                    break
    else:
        # No parts — check payload directly
        body_data = last_msg.get('payload', {}).get('body', {}).get('data', '')
        if body_data:
            import base64
            body = base64.urlsafe_b64decode(body_data).decode('utf-8', errors='ignore')

    return {
        'thread_id': thread_id,
        'subject': subject,
        'from': from_hdr,
        'snippet': snippet,
        'body': body[:2000],  # truncate for LLM
        'message_count': len(messages),
    }

def find_related_context(subject: str, snippet: str, limit: int = 3) -> str:
    """Search OrgMemory for related past emails; return formatted context string."""
    query = f'subject:"{subject}"'
    if snippet:
        words = re.findall(r'[A-Za-z]{4,}', snippet)
        if words:
            query += ' ' + ' '.join(words[:5])
    try:
        results = search_emails(query=query, limit=limit)  # returns list of tuples (id, subject, date, snippet)
        if not results:
            return ""
        ctx_lines = ["[Related past emails:]"]
        for row in results[:limit]:
            # row = (id, subject, date, snippet)
            _, subj, date, snip = row
            ctx_lines.append(f"- {subj} ({date}) — {snip[:120]}")
        return "\n".join(ctx_lines)
    except Exception as e:
        print(f"   [OrgMemory search error: {e}]", file=sys.stderr)
        return ""

def generate_draft_reply(context: dict, related_context: str) -> str:
    """Use LLM to compose a professional reply draft."""
    from_addr = context['from']
    # Extract sender name if available
    sender_name = from_addr
    m = re.match(r'^"?([^"<]+)"?\s+<', from_addr)
    if m:
        sender_name = m.group(1).strip()

    prompt = (
        "You are Kleber Garcia Alcatrão, CEO of Zion Tech Group.\n"
        "Write a professional, concise email reply to the thread below.\n\n"
        f"Thread Subject: {context['subject']}\n"
        f"From: {from_addr}\n"
        f"Latest message:\n{context['body'] or context['snippet']}\n\n"
        f"{related_context or ''}\n\n"
        "Instructions:\n"
        "- Acknowledge the sender's message\n"
        "- If it's a question/request, respond helpfully; if it's a proposal, express interest and ask for details\n"
        "- Keep it brief (3-4 sentences)\n"
        "- Use professional tone, sign as 'Kleber Garcia Alcatrão\\nZion Tech Group'\n"
        "- Do NOT make promises you can't keep; suggest next steps when appropriate\n"
        "- Reply in the same language as the original (English or Portuguese)\n"
        "Return ONLY the email body (no extra commentary)."
    )
    result = chat([{"role": "user", "content": prompt}], provider="auto", temperature=0.7)
    content = result['content'].strip()
    # Remove any LLM preamble like "Here is the reply:" if present
    content = re.sub(r'^(Here\'s .*?[:\n])', '', content, flags=re.I).strip()
    return content

def create_gmail_draft(thread_id: str, subject: str, body: str, to_addr: str) -> str:
    """Create a Gmail draft reply in the given thread. Returns draft ID."""
    # Gmail draft create endpoint
    import urllib.request, json, base64
    # Encode body as RFC 2822 raw message
    raw_lines = [
        f"Subject: Re: {subject}",
        f"To: {to_addr}",
        "",
        body,
    ]
    raw = "\r\n".join(raw_lines)
    encoded = base64.urlsafe_b64encode(raw.encode()).decode().rstrip('=')

    url = 'https://gmail.googleapis.com/gmail/v1/users/me/drafts'
    payload = json.dumps({'message': {'threadId': thread_id, 'raw': encoded}}).encode()
    from google_workspace import gog_headers
    req = urllib.request.Request(url, data=payload, headers=gog_headers(), method='POST')
    resp = json.loads(urllib.request.urlopen(req).read())
    return resp.get('id', 'unknown')

def cmd_reply_to_thread(thread_id: str):
    """End-to-end: fetch thread → search memory → generate draft → create draft."""
    print(f"📥 Fetching thread {thread_id}...")
    ctx = get_thread_context(thread_id)

    print(f"   Subject: {ctx['subject']}")
    print(f"   From: {ctx['from']}")
    print(f"   Messages in thread: {ctx['message_count']}")

    print("🔍 Searching OrgMemory for related context...")
    related = find_related_context(ctx['subject'], ctx['snippet'])
    if related:
        print("   Found related emails:")
        for line in related.split('\n')[1:]:
            print(f"   {line}")
    else:
        print("   No related past emails found.")

    print("🧠 Generating draft reply via LLM...")
    draft_body = generate_draft_reply(ctx, related)
    print("   Draft preview:")
    for line in draft_body.split('\n')[:4]:
        print(f"     {line}")
    if len(draft_body.split('\n')) > 4:
        print("     ...")

    print(f"💾 Creating Gmail draft for thread {thread_id}...")
    draft_id = create_gmail_draft(thread_id, ctx['subject'], draft_body, ctx['from'])
    print(f"✅ Draft created (ID: {draft_id})")
    print(f"   Check Gmail → Drafts folder to review & send.")

def cmd_recent_unread(limit: int = 5):
    """Draft replies to the N most recent unread emails."""
    print(f"📥 Fetching {limit} most recent unread emails...")
    from google_workspace import gmail_search
    msgs = gmail_search('label:INBOX is:unread', limit=limit)
    if not msgs:
        print("   No unread emails.")
        return
    for m in msgs:
        thread_id = m.get('threadId')
        if thread_id:
            print(f"\n→ Processing thread {thread_id} (msg {m['id']})")
            try:
                cmd_reply_to_thread(thread_id)
            except Exception as e:
                print(f"   ❌ Error: {e}")
        else:
            print(f"   Skipping message {m['id']} (no thread)")

def main():
    import argparse
    p = argparse.ArgumentParser(description='Smart Reply Draft Assistant')
    sub = p.add_subparsers(dest='cmd')

    thread_p = sub.add_parser('thread', help='Generate draft for specific thread ID')
    thread_p.add_argument('thread_id')

    msg_p = sub.add_parser('message', help='Generate draft for a single message ID (finds thread)')
    msg_p.add_argument('message_id')

    recent_p = sub.add_parser('recent', help='Draft replies to N recent unread emails')
    recent_p.add_argument('--limit', type=int, default=3)

    args = p.parse_args()

    if args.cmd == 'thread':
        cmd_reply_to_thread(args.thread_id)
    elif args.cmd == 'message':
        msg = gmail_get(args.message_id)
        thread_id = msg.get('threadId')
        if not thread_id:
            print("Error: message has no thread")
            sys.exit(1)
        cmd_reply_to_thread(thread_id)
    elif args.cmd == 'recent':
        cmd_recent_unread(limit=args.limit)
    else:
        p.print_help()

if __name__ == '__main__':
    main()
