#!/usr/bin/env python3
"""
Google OAuth Token Manager for Zion Tech Group
===============================================
Manages token lifecycle: health checks, auto-refresh, expiry alerts.
Designed to be called by cron jobs and other scripts.

Usage:
    python3 google_token_manager.py check          # Check token health
    python3 google_token_manager.py refresh         # Force refresh
    python3 google_token_manager.py setup-cron      # Install cron jobs
    python3 google_token_manager.py status          # Show full status
"""
import json, os, sys, urllib.request, urllib.parse, urllib.error, subprocess
from datetime import datetime, timezone, timedelta
from pathlib import Path

TOKEN_FILE = Path(os.path.expanduser("~/.openclaw/workspace/gog_tokens.json"))
LOG_DIR = Path(os.path.expanduser("~/logs"))
LOG_FILE = LOG_DIR / "token_manager.log"
STATE_FILE = Path(os.path.expanduser("~/data/token_manager_state.json"))
WARNING_DAYS = 7
CRITICAL_DAYS = 3

def log(msg):
    LOG_DIR.mkdir(parents=True, exist_ok=True)
    ts = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    line = f"[{ts}] {msg}"
    print(line)
    with open(LOG_FILE, "a") as f:
        f.write(line + "\n")

def load_tokens():
    if not TOKEN_FILE.exists():
        log(f"ERROR: Token file not found: {TOKEN_FILE}")
        sys.exit(2)
    return json.loads(TOKEN_FILE.read_text())

def save_tokens(tokens):
    TOKEN_FILE.write_text(json.dumps(tokens, indent=2))
    log(f"Tokens saved to {TOKEN_FILE}")

def get_token_status(tokens):
    """Returns (status, days_remaining, message)"""
    expiry_str = tokens.get("expiry", "")
    if not expiry_str:
        return "unknown", 0, "No expiry field in token file"
    try:
        expiry = datetime.fromisoformat(expiry_str.replace("Z", "+00:00"))
        if expiry.tzinfo is None:
            expiry = expiry.replace(tzinfo=timezone.utc)
        now = datetime.now(timezone.utc)
        remaining = (expiry - now).total_seconds() / 86400.0
        if remaining > WARNING_DAYS:
            return "ok", remaining, f"Token valid for {remaining:.1f} more days"
        elif remaining > 0:
            return "warning", remaining, f"Token expires in {remaining:.1f} days"
        else:
            return "expired", remaining, f"Token expired {-remaining:.1f} days ago"
    except Exception as e:
        return "error", 0, f"Cannot parse expiry: {e}"

def refresh_token(tokens):
    """Attempt to refresh the access token using the stored refresh_token."""
    client_id = tokens.get("client_id")
    client_secret = tokens.get("client_secret")
    refresh_token_val = tokens.get("refresh_token")
    
    if not all([client_id, client_secret, refresh_token_val]):
        log("ERROR: Missing credentials for refresh")
        return None
    
    data = urllib.parse.urlencode({
        "client_id": client_id,
        "client_secret": client_secret,
        "refresh_token": refresh_token_val,
        "grant_type": "refresh_token",
    }).encode()
    
    req = urllib.request.Request(
        "https://oauth2.googleapis.com/token",
        data=data,
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    
    try:
        resp = json.loads(urllib.request.urlopen(req, timeout=15).read())
        if "error" in resp:
            log(f"Refresh error: {resp['error']} — {resp.get('error_description', '')}")
            return None
        return resp
    except urllib.error.HTTPError as e:
        body = e.read().decode(errors="replace")
        log(f"HTTP {e.code} during refresh: {body}")
        return None
    except Exception as e:
        log(f"Refresh failed: {e}")
        return None

def update_tokens(tokens, refresh_response):
    """Update token file with new access token from refresh response."""
    expires_in = refresh_response.get("expires_in", 3600)
    new_expiry = datetime.now(timezone.utc) + timedelta(seconds=expires_in)
    tokens["access_token"] = refresh_response["access_token"]
    tokens["expiry"] = new_expiry.strftime("%Y-%m-%dT%H:%M:%S")
    if "refresh_token" in refresh_response:
        tokens["refresh_token"] = refresh_response["refresh_token"]
    save_tokens(tokens)
    return tokens

def cmd_check():
    """Check token health and auto-refresh if needed."""
    tokens = load_tokens()
    status, days, msg = get_token_status(tokens)
    log(f"Token status: {status} — {msg}")
    
    if status == "ok":
        # Still try proactive refresh if within warning window
        if days <= WARNING_DAYS:
            log("Within warning window, attempting proactive refresh...")
            resp = refresh_token(tokens)
            if resp:
                tokens = update_tokens(tokens, resp)
                log(f"Proactive refresh successful. New expiry: {tokens['expiry']}")
            else:
                log("Proactive refresh failed, but token is still valid")
        print(f"STATUS: OK — {msg}")
        return 0
    
    elif status == "warning":
        log("Token expiring soon, attempting refresh...")
        resp = refresh_token(tokens)
        if resp:
            tokens = update_tokens(tokens, resp)
            log(f"Refresh successful. New expiry: {tokens['expiry']}")
            print(f"STATUS: OK (refreshed) — {msg}")
            return 0
        else:
            log("Refresh failed, token still valid but expiring soon")
            print(f"STATUS: WARNING — {msg} (refresh failed)")
            return 1
    
    elif status == "expired":
        log("Token expired, attempting refresh...")
        resp = refresh_token(tokens)
        if resp:
            tokens = update_tokens(tokens, resp)
            log(f"Refresh successful after expiry. New expiry: {tokens['expiry']}")
            print(f"STATUS: OK (refreshed after expiry) — {msg}")
            return 0
        else:
            log("CRITICAL: Refresh failed after expiry. Manual re-auth required.")
            print(f"STATUS: CRITICAL — {msg} (refresh failed)")
            print("RENEWAL URL:")
            cid = tokens.get("client_id", "")
            print(f"  https://accounts.google.com/o/oauth2/auth?client_id={cid}&redirect_uri=http://localhost:8433/callback&response_type=code&scope=https://www.googleapis.com/auth/gmail.modify&access_type=offline&prompt=consent")
            return 2
    
    else:
        print(f"STATUS: ERROR — {msg}")
        return 2

def cmd_refresh():
    """Force a token refresh."""
    tokens = load_tokens()
    log("Forcing token refresh...")
    resp = refresh_token(tokens)
    if resp:
        tokens = update_tokens(tokens, resp)
        log(f"Refresh successful. New expiry: {tokens['expiry']}")
        print(f"OK — Token refreshed. Expires: {tokens['expiry']}")
        return 0
    else:
        log("Refresh failed")
        print("FAILED — Could not refresh token")
        return 2

def cmd_status():
    """Show full token status."""
    tokens = load_tokens()
    status, days, msg = get_token_status(tokens)
    print(f"Status: {status}")
    print(f"Message: {msg}")
    print(f"Client ID: {tokens.get('client_id', 'N/A')[:40]}...")
    print(f"Has refresh_token: {'yes' if tokens.get('refresh_token') else 'NO'}")
    print(f"Expiry: {tokens.get('expiry', 'N/A')}")
    print(f"Token file: {TOKEN_FILE}")
    return 0

def cmd_setup_cron():
    """Print cron setup instructions."""
    script_path = os.path.abspath(__file__)
    print("Add these lines to your crontab (crontab -e):")
    print()
    print("# Google Token Health Check — every 6 hours")
    print(f"0 */6 * * * /usr/bin/python3 {script_path} check >> ~/logs/token_cron.log 2>&1")
    print()
    print("# Google Token Health Check — weekdays every 30 min during business hours")
    print(f"*/30 8-18 * * 1-5 /usr/bin/python3 {script_path} check >> ~/logs/token_cron.log 2>&1")
    print()
    return 0

COMMANDS = {
    "check": cmd_check,
    "refresh": cmd_refresh,
    "status": cmd_status,
    "setup-cron": cmd_setup_cron,
}

if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else "check"
    if cmd not in COMMANDS:
        print(f"Unknown command: {cmd}")
        print(f"Available: {', '.join(COMMANDS.keys())}")
        sys.exit(1)
    sys.exit(COMMANDS[cmd]())
