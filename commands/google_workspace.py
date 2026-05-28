#!/usr/bin/env python3
from __future__ import annotations

"""Google Workspace API helpers for Zion Org Memory system.

Shared between org_memory_agent.py and vector_index.py
FIXED for proper conversation threading
"""

import urllib.request, urllib.parse, json, datetime, sys, time, base64
from pathlib import Path

WORKSPACE = Path('/root/.openclaw/workspace')
TOKENS_FILE = WORKSPACE / 'gog_tokens.json'

def load_gog_tokens():
    with open(TOKENS_FILE) as f:
        return json.load(f)

def refresh_access_token(tokens):
    now_utc = datetime.datetime.now(datetime.timezone.utc)
    expiry_str = tokens.get('expiry', '')
    if expiry_str:
        try:
            exp = datetime.datetime.fromisoformat(expiry_str.replace('Z', '+00:00'))
            if exp.tzinfo is None: exp = exp.replace(tzinfo=datetime.timezone.utc)
            if exp > now_utc + datetime.timedelta(minutes=5):
                return tokens['access_token']
        except Exception: pass
    data = urllib.parse.urlencode({
        'client_id': tokens['client_id'],
        'client_secret': tokens['client_secret'],
        'refresh_token': tokens['refresh_token'],
        'grant_type': 'refresh_token',
    }).encode()
    req = urllib.request.Request('https://oauth2.googleapis.com/token', data=data,
        headers={'Content-Type': 'application/x-www-form-urlencoded'})
    resp = json.loads(urllib.request.urlopen(req).read())
    tokens['access_token'] = resp['access_token']
    exp_in = resp.get('expires_in', 3600)
    tokens['expiry'] = (now_utc + datetime.timedelta(seconds=exp_in)).isoformat()
    with open(TOKENS_FILE, 'w') as f:
        json.dump(tokens, f)
    return tokens['access_token']

def gog_headers():
    tokens = load_gog_tokens()
    token = refresh_access_token(tokens)
    return {'Authorization': f'Bearer {token}'}

# ── Gmail ──────────────────────────────────────────────────────────────────

def gmail_search(query, limit=20):
    q = query + ' label:INBOX'
    url = ('https://gmail.googleapis.com/gmail/v1/users/me/messages'
           f'?q={urllib.parse.quote(q)}&maxResults={limit}')
    req = urllib.request.Request(url, headers=gog_headers())
    resp = json.loads(urllib.request.urlopen(req).read())
    return resp.get('messages', [])

def gmail_get(message_id):
    url = f'https://gmail.googleapis.com/gmail/v1/users/me/messages/{message_id}?format=full'
    req = urllib.request.Request(url, headers=gog_headers())
    return json.loads(urllib.request.urlopen(req).read())

def gmail_thread_get(thread_id):
    url = f'https://gmail.googleapis.com/gmail/v1/users/me/threads/{thread_id}?format=full'
    req = urllib.request.Request(url, headers=gog_headers())
    resp = json.loads(urllib.request.urlopen(req).read())
    return resp.get('messages', [])


# ── Gmail Labels & Batch Modify ─────────────────────────────────────

def gmail_list_labels():
    """Return list of Gmail labels {id, name}."""
    url = 'https://gmail.googleapis.com/gmail/v1/users/me/labels'
    req = urllib.request.Request(url, headers=gog_headers())
    resp = json.loads(urllib.request.urlopen(req).read())
    return resp.get('labels', [])

def gmail_get_or_create_label_id(name: str) -> str:
    """Get Gmail label ID by name; create if missing. Returns ID string."""
    existing = gmail_list_labels()
    for lab in existing:
        if lab['name'] == name:
            return lab['id']
    # Create label (hierarchical names like 'Finance/Invoice' work)
    url = 'https://gmail.googleapis.com/gmail/v1/users/me/labels'
    body = json.dumps({
        'name': name,
        'labelListVisibility': 'labelShow',
        'messageListVisibility': 'show'
    }).encode()
    headers = gog_headers()
    headers['Content-Type'] = 'application/json'
    req = urllib.request.Request(url, data=body, headers=headers, method='POST')
    resp = json.loads(urllib.request.urlopen(req).read())
    return resp['id']

def gmail_create_draft(thread_id: str, subject: str, body: str, to_addr: str) -> str:
    """Create a Gmail draft reply in the given thread.

    Returns: draft ID (str)
    """
    raw_lines = [
        f"Subject: Re: {subject}",
        f"To: {to_addr}",
        "",
        body,
    ]
    raw = "\r\n".join(raw_lines)
    encoded = base64.urlsafe_b64encode(raw.encode()).decode()

    url = 'https://gmail.googleapis.com/gmail/v1/users/me/drafts'
    payload = json.dumps({'message': {'threadId': thread_id, 'raw': encoded}}).encode()
    headers = gog_headers()
    headers['Content-Type'] = 'application/json'
    req = urllib.request.Request(url, data=payload, headers=headers, method='POST')
    resp = json.loads(urllib.request.urlopen(req).read())
    return resp.get('id', 'unknown')

def gmail_create_draft_new(subject: str, body: str, to_addr: str) -> str:
    """Create a Gmail draft for a new thread (no threadId).

    Returns: draft ID (str)
    """
    raw_lines = [
        f"Subject: {subject}",
        f"To: {to_addr}",
        "",
        body,
    ]
    raw = "\r\n".join(raw_lines)
    encoded = base64.urlsafe_b64encode(raw.encode()).decode()

    url = 'https://gmail.googleapis.com/gmail/v1/users/me/drafts'
    payload = json.dumps({'message': {'raw': encoded}}).encode()
    headers = gog_headers()
    headers['Content-Type'] = 'application/json'
    req = urllib.request.Request(url, data=payload, headers=headers, method='POST')
    resp = json.loads(urllib.request.urlopen(req).read())
    return resp.get('id', 'unknown')

def extract_body_from_gmail_message(msg):
    def part_text(part):
        if part.get('mimeType') == 'text/plain' and 'data' in part.get('body', {}):
            return base64.urlsafe_b64decode(part['body']['data'] + '===').decode('utf-8', errors='replace')
        if 'parts' in part:
            return '\n'.join(part_text(p) for p in part['parts'])
        return ''
    return part_text(msg.get('payload', {}))

def gmail_batch_modify(payload: dict, addLabelIds=None, removeLabelIds=None):
    """Apply label changes to multiple messages. Blocks up to 60s."""
    if addLabelIds is None: addLabelIds = []
    if removeLabelIds is None: removeLabelIds = []
    url = 'https://gmail.googleapis.com/gmail/v1/users/me/messages/batchModify'
    body = json.dumps({'ids': payload['ids'], 'addLabelIds': addLabelIds, 'removeLabelIds': removeLabelIds}).encode()
    headers = gog_headers()
    headers['Content-Type'] = 'application/json'
    req = urllib.request.Request(url, data=body, headers=headers, method='POST')
    try:
        with urllib.request.urlopen(req, timeout=60) as _:
            return True
    except Exception as e:
        print(f'Batch modify error: {e}', file=sys.stderr)
        return False


# ── Gmail FIXED Reply ───────────────────────────────────────────────────────

def gmail_send_reply_fixed(thread_id_or_msg_id: str, original_subject: str, body: str, original_sender: str) -> dict:
    """Send a proper reply that stays in the same conversation thread.
    
    Uses threadId for proper Gmail conversation threading.
    
    Args:
      thread_id_or_msg_id: Either thread ID or message ID (we use threads for threading)
      original_subject: The original email's subject (we'll add "Re:" if needed)
      body: The reply body text
      original_sender: The sender's email address
    Returns:
      dict with result status
    """
    # Get the original message (could be thread or message)
    url = f'https://gmail.googleapis.com/gmail/v1/users/me/messages/{thread_id_or_msg_id}'
    req = urllib.request.Request(url, headers=gog_headers())
    msg = json.loads(urllib.request.urlopen(req).read())
    
    # Get thread ID for proper threading
    thread_id = msg.get('threadId', thread_id_or_msg_id)
    
    # Extract headers from original message
    headers_raw = msg.get('payload', {}).get('headers', [])
    
    # Find the recipient (To header) - which should be us
    to_header = next((h['value'] for h in headers_raw if h['name'] == 'To'), '')
    
    # Find Message-ID for References/In-Reply-To
    message_id = next((h['value'] for h in headers_raw if h['name'] == 'Message-ID'), '')
    
    # Build proper subject (preserve Re: if already present, otherwise add it)
    subject = original_subject
    if not subject.startswith('Re:'):
        subject = f"Re: {subject}"
    
    # Build the reply email with thread headers
    raw_email_lines = [
        f"To: {original_sender}",  # Reply to original sender
        f"Subject: {subject}",
    ]
    
    # Add threading headers if we have them
    if message_id:
        raw_email_lines.append(f"In-Reply-To: {message_id}")
        raw_email_lines.append(f"References: {message_id}")
    
    raw_email_lines.append("")
    raw_email_lines.append(body)
    
    raw_email = "\r\n".join(raw_email_lines)
    
    # Encode for Gmail API
    raw_bytes = raw_email.encode('utf-8')
    raw_b64 = base64.urlsafe_b64encode(raw_bytes).decode('utf-8')
    
    # Send via Gmail API - CRITICAL: use threadId for conversation threading
    send_url = 'https://gmail.googleapis.com/gmail/v1/users/me/messages/send'
    data = json.dumps({
        'raw': raw_b64,
        'threadId': thread_id  # THIS is what makes it stay in conversation!
    }).encode()
    send_req = urllib.request.Request(send_url, data=data, headers={**gog_headers(), 'Content-Type': 'application/json'})
    
    try:
        result = json.loads(urllib.request.urlopen(send_req).read())
        return {'success': True, 'message_id': result.get('id'), 'thread_id': thread_id}
    except Exception as e:
        return {'success': False, 'error': str(e)}


# ── Calendar ────────────────────────────────────────────────────────────────

def calendar_list_events(time_min=None, time_max=None, max_results=10, single_events=True, order_by='startTime'):
    """List calendar events within a time range."""
    params = []
    if time_min:
        params.append(f'timeMin={urllib.parse.quote(time_min)}')
    if time_max:
        params.append(f'timeMax={urllib.parse.quote(time_max)}')
    params.append(f'maxResults={max_results}')
    params.append(f'singleEvents={str(single_events).lower()}')
    params.append(f'orderBy={order_by}')
    query_string = '&'.join(params)
    url = f'https://www.googleapis.com/calendar/v3/calendars/primary/events?{query_string}'
    req = urllib.request.Request(url, headers=gog_headers())
    try:
        resp = json.loads(urllib.request.urlopen(req).read())
        return resp.get('items', [])
    except Exception as e:
        print(f"[Calendar Error] {e}", file=sys.stderr)
        return []

def calendar_create_event(event_body):
    """Create a new calendar event."""
    url = 'https://www.googleapis.com/calendar/v3/calendars/primary/events'
    data = json.dumps(event_body).encode()
    headers = gog_headers()
    headers['Content-Type'] = 'application/json'
    req = urllib.request.Request(url, data=data, headers=headers, method='POST')
    try:
        resp = json.loads(urllib.request.urlopen(req).read())
        return resp.get('id')
    except Exception as e:
        print(f"[Calendar Error] {e}", file=sys.stderr)
        return None

def calendar_get_freebusy(time_min, time_max, calendar_ids=None):
    """Check free/busy status for calendars."""
    if calendar_ids is None:
        calendar_ids = ['primary']
    body = {
        'timeMin': time_min,
        'timeMax': time_max,
        'items': [{'id': cal_id} for cal_id in calendar_ids],
    }
    data = json.dumps(body).encode()
    url = 'https://www.googleapis.com/calendar/v3/freeBusy'
    req = urllib.request.Request(url, data=data, headers=gog_headers(), method='POST')
    try:
        resp = json.loads(urllib.request.urlopen(req).read())
        return resp.get('calendars', {})
    except Exception as e:
        print(f"[Calendar Error] {e}", file=sys.stderr)
        return {}


# ── Drive ───────────────────────────────────────────────────────────────────

def drive_list(query=None, folder_id=None, limit=20):
    q_parts = ["trashed=false"]
    if query:
        q_parts.append(f"name contains '{query}'")
    if folder_id:
        q_parts.append(f"'{folder_id}' in parents")
    url = ('https://www.googleapis.com/drive/v3/files'
           f'?q={" and ".join(q_parts)}&pageSize={limit}&fields=files(id,name,modifiedTime,mimeType)')
    req = urllib.request.Request(url, headers=gog_headers())
    resp = json.loads(urllib.request.urlopen(req).read())
    return resp.get('files', [])

def drive_get(file_id):
    url = f'https://www.googleapis.com/drive/v3/files/{file_id}?alt=media'
    req = urllib.request.Request(url, headers=gog_headers())
    try:
        return urllib.request.urlopen(req).read().decode('utf-8', errors='replace')
    except Exception as e:
        return f"[ERROR: {e}]"

def drive_create_folder(name: str, parent_id: str = None) -> str:
    """Create a Drive folder; return its ID."""
    url = 'https://www.googleapis.com/drive/v3/files'
    body = json.dumps({
        'name': name,
        'mimeType': 'application/vnd.google-apps.folder',
        **({} if parent_id is None else {'parents': [parent_id]})
    }).encode()
    headers = gog_headers()
    headers['Content-Type'] = 'application/json'
    req = urllib.request.Request(url, data=body, headers=headers, method='POST')
    resp = json.loads(urllib.request.urlopen(req).read())
    return resp['id']

def drive_move_file(file_id: str, new_parent_id: str):
    """Move a Drive file to a new parent folder (removes from all other parents)."""
    curr = json.loads(urllib.request.urlopen(
        urllib.request.Request(f'https://www.googleapis.com/drive/v3/files/{file_id}', headers=gog_headers())
    ).read()).get('parents', [])
    url = f'https://www.googleapis.com/drive/v3/files/{file_id}'
    add_url = url + f'?addParents={new_parent_id}&removeParents={",".join(curr) if curr else ""}'
    req = urllib.request.Request(add_url, headers=gog_headers(), method='PATCH')
    try:
        urllib.request.urlopen(req, timeout=15)
    except Exception as e:
        print(f'Drive move error: {e}', file=sys.stderr)

def drive_find_folder_by_name(name: str, parent: str = None) -> str | None:
    """Find a folder by name optionally under a specific parent. Returns ID or None."""
    q = f"name='{name}' and mimeType='application/vnd.google-apps.folder' and trashed=false"
    if parent:
        q += f" and '{parent}' in parents"
    url = 'https://www.googleapis.com/drive/v3/files?' + urllib.parse.urlencode({'q': q, 'pageSize': 5, 'fields': 'files(id,name)'})
    req = urllib.request.Request(url, headers=gog_headers())
    resp = json.loads(urllib.request.urlopen(req).read())
    files = resp.get('files', [])
    return files[0]['id'] if files else None

def drive_get_parents(file_id: str):
    """Return list of parent folder IDs for a file."""
    url = f'https://www.googleapis.com/drive/v3/files/{file_id}?fields=parents'
    req = urllib.request.Request(url, headers=gog_headers())
    resp = json.loads(urllib.request.urlopen(req).read())
    return resp.get('parents', [])

# ── Calendar ────────────────────────────────────────────────────────────────

def calendar_list(days_ahead=7, limit=10):
    now = datetime.datetime.utcnow().isoformat() + 'Z'
    url = (f'https://www.googleapis.com/calendar/v3/calendars/primary/events'
           f'?timeMin={now}&maxResults={limit}&singleEvents=true&orderBy=startTime')
    req = urllib.request.Request(url, headers=gog_headers())
    resp = json.loads(urllib.request.urlopen(req).read())
    return resp.get('items', [])

def calendar_list_events(timeMin: str, timeMax: str = None, maxResults: int = 10):
    """Fetch calendar events within a UTC time window.

    Args:
      timeMin: ISO timestamp (inclusive)
      timeMax: optional ISO timestamp (exclusive)
      maxResults: limit
    """
    params = [
        f'timeMin={urllib.parse.quote(timeMin)}',
        'singleEvents=true',
        'orderBy=startTime',
        f'maxResults={maxResults}',
    ]
    if timeMax:
        params.append(f'timeMax={urllib.parse.quote(timeMax)}')
    url = 'https://www.googleapis.com/calendar/v3/calendars/primary/events?' + '&'.join(params)
    req = urllib.request.Request(url, headers=gog_headers())
    resp = json.loads(urllib.request.urlopen(req).read())
    return resp.get('items', [])

def calendar_create_event(event_dict: dict) -> str:
    """Create a calendar event. Returns event ID.

    Args:
      event_dict: Calendar API event resource (summary, start, end, description, etc.)
    """
    url = 'https://www.googleapis.com/calendar/v3/calendars/primary/events'
    data = json.dumps(event_dict).encode()
    headers = gog_headers()
    headers['Content-Type'] = 'application/json'
    req = urllib.request.Request(url, data=data, headers=headers, method='POST')
    resp = json.loads(urllib.request.urlopen(req).read())
    return resp.get('id')

def telegram_send(text: str):
    """Send Telegram message via Bot API (TELEGRAM_BOT_TOKEN) or OpenClaw native "message" tool."""
    import os
    token = os.getenv('TELEGRAM_BOT_TOKEN')
    chat_id = os.getenv('TELEGRAM_CHAT_ID', '8435383377')
    if not token:
        try:
            message(action='send', target='telegram', message=text)
            return
        except NameError:
            print(f'[TELEGRAM] Skipped (no token): {text[:100]}')
            return
    url = f'https://api.telegram.org/bot{token}/sendMessage'
    payload = json.dumps({'chat_id': chat_id, 'text': text}).encode()
    req = urllib.request.Request(url, data=payload, headers={'Content-Type': 'application/json'})
    try:
        with urllib.request.urlopen(req, timeout=10) as r:
            if r.status != 200:
                print(f'[TELEGRAM] HTTP {r.status}: {text[:100]}')
    except Exception as e:
        print(f'[TELEGRAM] Failed: {e}')