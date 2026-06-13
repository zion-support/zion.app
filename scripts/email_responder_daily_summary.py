#!/usr/bin/env python3
"""
Email Responder Daily Summary — Zion Tech Group
================================================
Generates a daily summary of email responder activity.
Designed to be called by cron job.

Usage:
    python3 email_responder_daily_summary.py
"""
import json, os, sys, requests, urllib.request
from datetime import datetime, timezone, timedelta

HOME = os.environ.get("HOME", "")
TOKEN_FILE = os.path.join(HOME, ".openclaw/workspace/gog_tokens.json")
LOG_FILE = os.path.join(HOME, "data/email_responder_v2_log.json")
STATE_FILE = os.path.join(HOME, "data/email_responder_v2_state.json")

def load_json(path):
    try:
        with open(path) as f:
            return json.load(f)
    except:
        return None

def get_token():
    with open(TOKEN_FILE) as f:
        return json.load(f).get("access_token", "")

def verify_gmail():
    access = get_token()
    req = urllib.request.Request(
        "https://gmail.googleapis.com/gmail/v1/users/me/profile",
        headers={"Authorization": "Bearer " + access},
    )
    try:
        resp = urllib.request.urlopen(req, timeout=10)
        data = json.loads(resp.read())
        return True, data.get("emailAddress", "unknown")
    except Exception as e:
        return False, str(e)

def main():
    now = datetime.now(timezone.utc)
    today = now.strftime("%Y-%m-%d")
    
    # Load state and log
    state = load_json(STATE_FILE) or {}
    log = load_json(LOG_FILE) or []
    
    # Filter today's entries
    today_entries = [e for e in log if e.get("timestamp", "").startswith(today)]
    
    # Count by action
    actions = {}
    for e in today_entries:
        a = e.get("action", "unknown")
        actions[a] = actions.get(a, 0) + 1
    
    # Count by category
    categories = {}
    for e in today_entries:
        c = e.get("category", "unknown")
        categories[c] = categories.get(c, 0) + 1
    
    # Gmail API status
    gmail_ok, gmail_msg = verify_gmail()
    
    # Build summary
    lines = [
        f"📧 Email Responder Daily Summary — {today}",
        f"",
        f"📊 Today's Activity:",
        f"  Processed: {len(today_entries)}",
        f"  Replied: {actions.get('replied', 0) + actions.get('dry_run_reply', 0)}",
        f"  Spam filtered: {actions.get('spam', 0)}",
        f"  Human review: {actions.get('human_review', 0)}",
        f"  Errors: {actions.get('error', 0)}",
        f"",
        f"📈 Lifetime Stats:",
        f"  Total processed: {state.get('total_processed', 0)}",
        f"  Total replied: {state.get('total_replied', 0)}",
        f"  Total errors: {state.get('total_errors', 0)}",
        f"  Last run: {state.get('last_run', 'never')[:19]}",
        f"",
        f"🔧 System:",
        f"  Gmail API: {'✅ OK' if gmail_ok else '❌ ' + gmail_msg}",
        f"  Token: {'✅ Valid' if gmail_ok else '❌ Check needed'}",
    ]
    
    # Add category breakdown if any
    if categories:
        lines.append(f"")
        lines.append(f"📋 Categories:")
        for cat, count in sorted(categories.items(), key=lambda x: -x[1]):
            lines.append(f"  {cat}: {count}")
    
    # Add recent replies
    replies = [e for e in today_entries if e.get("action") in ("replied", "dry_run_reply")]
    if replies:
        lines.append(f"")
        lines.append(f"💬 Replies sent today:")
        for e in replies[:5]:
            lines.append(f"  → {e.get('sender_email', '?')[:40]}")
            lines.append(f"    {e.get('subject', '?')[:60]}")
    
    summary = "\n".join(lines)
    print(summary)
    return summary

if __name__ == "__main__":
    main()
