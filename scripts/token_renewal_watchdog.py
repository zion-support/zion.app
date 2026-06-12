#!/usr/bin/env python3
"""
Google OAuth Token Renewal Watchdog — Zion Tech Group
=====================================================
Standalone watchdog that can be called by any agent or cron job.
Ensures tokens are always valid. Auto-refreshes proactively.

Usage:
    python3 token_renewal_watchdog.py          # Check and refresh if needed
    python3 token_renewal_watchdog.py --force   # Force refresh
    python3 token_renewal_watchdog.py --status  # Show status only

Exit codes:
    0 = OK (token valid, refreshed if needed)
    1 = Warning (token valid but close to expiry)
    2 = Critical (token expired or refresh failed)
"""
import json, os, sys, urllib.request, urllib.parse, urllib.error
from datetime import datetime, timezone, timedelta

HOME = os.environ.get("HOME", "")
TOKEN_FILE = HOME + "/.openclaw/workspace/gog_tokens.json"
STATE_FILE = HOME + "/data/token_state.json"
LOG_DIR = HOME + "/logs"
LOG_FILE = LOG_DIR + "/token_watchdog.log"
GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"
GMAIL_TEST_URL = "https://gmail.googleapis.com/gmail/v1/users/me/profile"

def log(msg):
    os.makedirs(LOG_DIR, exist_ok=True)
    ts = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    line = f"[{ts}] {msg}"
    with open(LOG_FILE, "a") as f:
        f.write(line + "\n")

def load_tokens():
    if not os.path.exists(TOKEN_FILE):
        log("ERROR: Token file not found")
        sys.exit(2)
    with open(TOKEN_FILE) as f:
        return json.load(f)

def save_tokens(tokens):
    with open(TOKEN_FILE, "w") as f:
        json.dump(tokens, f, indent=2)

def load_state():
    if os.path.exists(STATE_FILE):
        try:
            with open(STATE_FILE) as f:
                return json.load(f)
        except Exception:
            pass
    return {"refresh_count": 0, "last_refresh": None, "failure_count": 0, "last_status": "unknown"}

def save_state(state):
    os.makedirs(os.path.dirname(STATE_FILE), exist_ok=True)
    with open(STATE_FILE, "w") as f:
        json.dump(state, f, indent=2)

def get_token_status(tokens):
    expiry_str = tokens.get("expiry", "")
    if not expiry_str:
        return "unknown", 0, None, "No expiry field"
    try:
        expiry = datetime.fromisoformat(expiry_str.replace("Z", "+00:00"))
        if expiry.tzinfo is None:
            expiry = expiry.replace(tzinfo=timezone.utc)
        now = datetime.now(timezone.utc)
        remaining_hours = (expiry - now).total_seconds() / 3600.0
        if remaining_hours > 24:
            return "ok", remaining_hours, expiry, f"Valid for {remaining_hours:.1f}h"
        elif remaining_hours > 1:
            return "warning", remaining_hours, expiry, f"Expires in {remaining_hours:.1f}h"
        elif remaining_hours > 0:
            return "critical", remaining_hours, expiry, f"Expires in {remaining_hours:.1f}h"
        else:
            return "expired", remaining_hours, expiry, f"Expired {-remaining_hours:.1f}h ago"
    except Exception as e:
        return "error", 0, None, f"Parse error: {e}"

def verify_gmail(tokens):
    access = tokens.get("access_token", "")
    if not access:
        return False, "No access token"
    req = urllib.request.Request(GMAIL_TEST_URL, headers={"Authorization": f"Bearer {access}"})
    try:
        resp = urllib.request.urlopen(req, timeout=10)
        data = json.loads(resp.read())
        return True, f"OK — {data.get('emailAddress', 'unknown')}"
    except urllib.error.HTTPError as e:
        return False, f"HTTP {e.code}"
    except Exception as e:
        return False, str(e)

def do_refresh(tokens):
    client_id = tokens.get("client_id")
    client_secret = tokens.get("client_secret")
    refresh_tok = tokens.get("refresh_token")
    if not all([client_id, client_secret, refresh_tok]):
        return None
    data = urllib.parse.urlencode({
        "client_id": client_id, "client_secret": client_secret,
        "refresh_token": refresh_tok, "grant_type": "refresh_token",
    }).encode()
    req = urllib.request.Request(GOOGLE_TOKEN_URL, data=data,
        headers={"Content-Type": "application/x-www-form-urlencoded"})
    try:
        resp = json.loads(urllib.request.urlopen(req, timeout=15).read())
        if "error" in resp:
            log(f"Refresh error: {resp['error']}")
            return None
        expires_in = resp.get("expires_in", 3600)
        new_expiry = datetime.now(timezone.utc) + timedelta(seconds=expires_in)
        tokens["access_token"] = resp["access_token"]
        tokens["expiry"] = new_expiry.strftime("%Y-%m-%dT%H:%M:%S")
        if "refresh_token" in resp:
            tokens["refresh_token"] = resp["refresh_token"]
        save_tokens(tokens)
        return resp
    except Exception as e:
        log(f"Refresh failed: {e}")
        return None

def main():
    force = "--force" in sys.argv
    status_only = "--status" in sys.argv

    tokens = load_tokens()
    state = load_state()

    if status_only:
        status, hours, expiry, msg = get_token_status(tokens)
        gmail_ok, gmail_msg = verify_gmail(tokens)
        print(f"Status: {status} — {msg}")
        print(f"Gmail: {gmail_msg}")
        print(f"Refreshes: {state.get('refresh_count', 0)}")
        sys.exit(0 if status == "ok" else 1 if status == "warning" else 2)

    status, hours, expiry, msg = get_token_status(tokens)
    gmail_ok, gmail_msg = verify_gmail(tokens)

    if not force and status == "ok" and gmail_ok:
        log(f"OK — {msg}, Gmail: {gmail_msg}")
        print(f"OK — {msg}")
        sys.exit(0)

    if force:
        log(f"Forced refresh requested (current: {msg})")
    else:
        log(f"Refresh needed: {msg}, Gmail: {gmail_msg}")

    resp = do_refresh(tokens)
    if resp:
        state["refresh_count"] = state.get("refresh_count", 0) + 1
        state["last_refresh"] = datetime.now(timezone.utc).isoformat()
        state["last_status"] = "ok"
        state["failure_count"] = 0
        save_state(state)
        new_status, new_hours, _, new_msg = get_token_status(tokens)
        gmail_ok, gmail_msg = verify_gmail(tokens)
        log(f"Refresh OK — {new_msg}, Gmail: {gmail_msg}")
        print(f"REFRESHED — {new_msg}")
        sys.exit(0)
    else:
        state["failure_count"] = state.get("failure_count", 0) + 1
        state["last_status"] = "failure"
        save_state(state)
        log(f"Refresh FAILED (attempt {state['failure_count']})")
        print(f"FAILED — {msg}")
        if status == "expired":
            print("MANUAL RE-AUTH REQUIRED")
        sys.exit(2)

if __name__ == "__main__":
    main()
