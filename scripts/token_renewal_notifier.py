#!/usr/bin/env python3
"""
Google OAuth Token Renewal Notifier for Zion Tech Group
======================================================
Sends proactive notifications when token is about to expire.
Supports: Telegram, email, console alert.

Usage:
    python3 token_renewal_notifier.py          # Check and notify if needed
    python3 token_renewal_notifier.py --force  # Force send status report
"""
import json, os, sys, urllib.request, urllib.parse, urllib.error
from datetime import datetime, timezone, timedelta
from pathlib import Path

HOME = os.environ.get("HOME", "")
TOKEN_FILE = Path(HOME + "/.openclaw/workspace/gog_tokens.json")
STATE_FILE = Path(HOME + "/data/token_state.json")
NOTIFY_LOG = Path(HOME + "/data/token_notify_log.json")

# Thresholds (hours before expiry to notify)
WARN_HOURS = 24      # First warning: 24h before
URGENT_HOURS = 2     # Urgent: 2h before
CRITICAL_HOURS = 15  # Critical: 15 min before (send SMS/telegram)

def load_json(path):
    try:
        with open(path) as f:
            return json.load(f)
    except:
        return {}

def save_json(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, "w") as f:
        json.dump(data, f, indent=2)

def get_token_age_hours(tokens):
    """Get hours until token expires."""
    expiry_str = tokens.get("expiry", "")
    if not expiry_str:
        return None
    try:
        expiry = datetime.fromisoformat(expiry_str.replace("Z", "+00:00"))
        if expiry.tzinfo is None:
            expiry = expiry.replace(tzinfo=timezone.utc)
        now = datetime.now(timezone.utc)
        remaining = (expiry - now).total_seconds() / 3600.0
        return remaining
    except:
        return None

def send_telegram_alert(message):
    """Send alert via Telegram bot if configured."""
    config = load_json(Path(HOME + "/.hermes/config.json"))
    bot_token = config.get("telegram", {}).get("bot_token", "")
    chat_id = config.get("telegram", {}).get("chat_id", "")
    if not bot_token or not chat_id:
        return False
    try:
        url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
        data = urllib.parse.urlencode({"chat_id": chat_id, "text": message, "parse_mode": "HTML"}).encode()
        req = urllib.request.Request(url, data=data, headers={"Content-Type": "application/x-www-form-urlencoded"})
        resp = urllib.request.urlopen(req, timeout=10)
        return json.loads(resp.read()).get("ok", False)
    except Exception as e:
        print(f"Telegram send failed: {e}")
        return False

def send_email_alert(subject, body):
    """Send alert via Gmail API."""
    tokens = load_json(TOKEN_FILE)
    access = tokens.get("access_token", "")
    if not access:
        return False
    try:
        headers = {"Authorization": f"Bearer {access}", "Content-Type": "application/json"}
        msg = f"To: kleber@ziontechgroup.com\r\nSubject: {subject}\r\nContent-Type: text/plain; charset=utf-8\r\n\r\n{body}"
        import base64
        raw = base64.urlsafe_b64encode(msg.encode("utf-8")).decode("utf-8")
        url = "https://gmail.googleapis.com/gmail/v1/users/me/messages/send"
        data = json.dumps({"raw": raw}).encode("utf-8")
        req = urllib.request.Request(url, data=data, headers=headers)
        urllib.request.urlopen(req, timeout=15)
        return True
    except Exception as e:
        print(f"Email send failed: {e}")
        return False

def check_and_notify(force=False):
    """Check token status and send notifications if needed."""
    tokens = load_json(TOKEN_FILE)
    state = load_json(STATE_FILE)
    notify_log = load_json(NOTIFY_LOG)
    
    hours_left = get_token_age_hours(tokens)
    
    if hours_left is None:
        print("ERROR: Cannot determine token expiry")
        return 2
    
    # Format status
    if hours_left > 24:
        status = "OK"
        emoji = "✅"
    elif hours_left > 2:
        status = "WARNING"
        emoji = "⚠️"
    elif hours_left > 0.25:
        status = "URGENT"
        emoji = "🔴"
    else:
        status = "CRITICAL"
        emoji = "🚨"
    
    time_str = f"{hours_left:.1f} hours" if hours_left > 1 else f"{hours_left*60:.0f} minutes"
    
    # Check if we already notified at this level today
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    last_notify = notify_log.get(today, {})
    
    message = f"{emoji} <b>Zion Tech Group — Token Alert</b>\n\nStatus: {status}\nExpires in: {time_str}\nRefresh count: {state.get('refresh_count', 0)}\n\n{'⚠️ Token will expire soon! Auto-refresh should catch it.' if status != 'OK' else 'Token is healthy.'}"
    
    should_notify = force
    
    if not force:
        # Determine notification urgency
        if hours_left <= CRITICAL_HOURS and last_notify.get("critical") != today:
            should_notify = True
            notify_log[today] = {**last_notify, "critical": today}
        elif hours_left <= URGENT_HOURS and last_notify.get("urgent") != today:
            should_notify = True
            notify_log[today] = {**last_notify, "urgent": today}
        elif hours_left <= WARN_HOURS and last_notify.get("warning") != today:
            should_notify = True
            notify_log[today] = {**last_notify, "warning": today}
    
    if should_notify:
        print(f"Sending {status} notification...")
        # Try Telegram first, then email
        sent = send_telegram_alert(message)
        if not sent:
            sent = send_email_alert(f"[Zion Tech] Token {status} — {time_str} remaining", message)
        if not sent:
            print(f"NOTIFICATION ({status}): {message}")
        save_json(NOTIFY_LOG, notify_log)
    
    # Auto-refresh if critical
    if hours_left <= CRITICAL_HOURS:
        print("Token critical — triggering auto-refresh...")
        import subprocess
        result = subprocess.run(
            ["python3", str(Path(HOME + "/scripts/token_lifecycle_manager.py")), "force-refresh"],
            capture_output=True, text=True, timeout=30
        )
        print(result.stdout)
        if result.returncode == 0:
            print("✅ Auto-refresh successful")
            return 0
        else:
            print("❌ Auto-refresh failed!")
            return 2
    
    print(f"Token status: {status} — {time_str} remaining")
    return {"OK": 0, "WARNING": 1, "URGENT": 1, "CRITICAL": 2}.get(status, 0)

if __name__ == "__main__":
    force = "--force" in sys.argv
    sys.exit(check_and_notify(force=force))
