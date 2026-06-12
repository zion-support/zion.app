#!/usr/bin/env python3
"""
Google OAuth Token Health Monitor for Zion Tech Group
Checks token expiry, attempts refresh on expiry, alerts on failure.
Exit codes: 0 = OK, 1 = WARNING (expiring soon), 2 = CRITICAL (expired/revoked)
"""

import json
import sys
import os
import time
import urllib.request
import urllib.parse
import urllib.error
from datetime import datetime, timezone, timedelta
from typing import Optional

# -- Configuration --
TOKEN_FILE = os.path.expanduser("~/.openclaw/workspace/gog_tokens.json")
LOG_DIR = os.path.expanduser("~/logs")
LOG_FILE = os.path.join(LOG_DIR, "token_health.log")
ALERT_FILE = os.path.expanduser("~/data/token_alerts.json")
GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"
WARNING_DAYS = 7


def ensure_dirs():
    os.makedirs(LOG_DIR, exist_ok=True)
    os.makedirs(os.path.dirname(ALERT_FILE), exist_ok=True)


def log(message: str):
    ts = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    line = f"[{ts}] {message}"
    print(line)
    with open(LOG_FILE, "a") as f:
        f.write(line + "\n")


def load_tokens() -> dict:
    if not os.path.exists(TOKEN_FILE):
        log(f"ERROR: Token file not found: {TOKEN_FILE}")
        sys.exit(2)
    with open(TOKEN_FILE, "r") as f:
        return json.load(f)


def save_tokens(tokens: dict):
    with open(TOKEN_FILE, "w") as f:
        json.dump(tokens, f, indent=2)
    log("Token file updated successfully.")


def parse_expiry(expiry_str: str) -> datetime:
    """Parse the expiry string into a UTC datetime."""
    for fmt in ("%Y-%m-%dT%H:%M:%S", "%Y-%m-%dT%H:%M:%SZ", "%Y-%m-%dT%H:%M:%S%z"):
        try:
            dt = datetime.strptime(expiry_str, fmt)
            if dt.tzinfo is None:
                dt = dt.replace(tzinfo=timezone.utc)
            return dt.astimezone(timezone.utc)
        except ValueError:
            continue
    raise ValueError(f"Cannot parse expiry string: {expiry_str!r}")


def refresh_access_token(tokens: dict) -> Optional[dict]:
    client_id = tokens.get("client_id")
    client_secret = tokens.get("client_secret")
    refresh_token = tokens.get("refresh_token")

    if not all([client_id, client_secret, refresh_token]):
        log("ERROR: Missing client_id, client_secret, or refresh_token in token file.")
        return None

    payload = urllib.parse.urlencode({
        "client_id": client_id,
        "client_secret": client_secret,
        "refresh_token": refresh_token,
        "grant_type": "refresh_token"
    }).encode()
    req = urllib.request.Request(GOOGLE_TOKEN_URL, data=payload, method="POST")
    req.add_header("Content-Type", "application/x-www-form-urlencoded")

    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = json.loads(resp.read())
    except urllib.error.HTTPError as e:
        body = e.read().decode(errors="replace")
        log(f"HTTP {e.code} during refresh: {body}")
        return None
    except Exception as e:
        log(f"Request failed: {e}")
        return None

    if "error" in data:
        log(f"Google OAuth error: {data.get('error')} — {data.get('error_description', '')}")
        return None

    return data


def write_alert(detail: str):
    alerts = []
    if os.path.exists(ALERT_FILE):
        with open(ALERT_FILE, "r") as f:
            try:
                alerts = json.load(f)
            except Exception:
                alerts = []
    alerts.append({
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "detail": detail,
        "status": "unresolved"
    })
    with open(ALERT_FILE, "w") as f:
        json.dump(alerts, f, indent=2)
    log(f"Alert saved to {ALERT_FILE}")


def main():
    ensure_dirs()
    log("=== Token health check started ===")

    tokens = load_tokens()

    expiry_str = tokens.get("expiry")
    if not expiry_str:
        log("CRITICAL: No expiry field in token file.")
        write_alert("No expiry field in gog_tokens.json — token file may be malformed.")
        sys.exit(2)

    try:
        expiry_dt = parse_expiry(expiry_str)
    except ValueError as e:
        log(f"CRITICAL: {e}")
        write_alert(str(e))
        sys.exit(2)

    now = datetime.now(timezone.utc)
    remaining = expiry_dt - now
    remaining_days = remaining.total_seconds() / 86400.0

    access_token = tokens.get("access_token", "")
    refresh_token = tokens.get("refresh_token", "")
    log(f"Current access_token prefix: {access_token[:12]}...")
    log(f"Refresh token present: {'yes' if refresh_token else 'NO'}")
    log(f"Token expiry: {expiry_dt.isoformat()}")
    log(f"Time remaining: {remaining_days:.2f} days ({remaining})")

    # -- Token is still valid and not expiring soon --
    if remaining_days > WARNING_DAYS:
        log("STATUS: OK — token is valid and not expiring soon.")
        sys.exit(0)

    # -- Token is expiring within WARNING_DAYS but not yet expired --
    if remaining_days > 0:
        log(f"WARNING: Token expires in {remaining_days:.2f} days (within {WARNING_DAYS}-day threshold).")
        log("Attempting proactive refresh...")
        new_data = refresh_access_token(tokens)
        if new_data:
            expires_in = new_data.get("expires_in", 3600)
            new_expiry = datetime.now(timezone.utc) + timedelta(seconds=expires_in)
            tokens["access_token"] = new_data["access_token"]
            tokens["expiry"] = new_expiry.strftime("%Y-%m-%dT%H:%M:%S")
            if "refresh_token" in new_data:
                tokens["refresh_token"] = new_data["refresh_token"]
            save_tokens(tokens)
            log(f"STATUS: OK — token refreshed proactively. New expiry: {tokens['expiry']}")
            sys.exit(0)
        else:
            log("WARNING: Proactive refresh failed. Token is still valid but will expire soon.")
            write_alert(f"Proactive refresh failed. Token expires {expiry_dt.isoformat()}.")
            sys.exit(1)

    # -- Token is expired --
    log("CRITICAL: Token has EXPIRED.")
    log("Attempting refresh with stored refresh_token...")

    new_data = refresh_access_token(tokens)

    if new_data:
        expires_in = new_data.get("expires_in", 3600)
        new_expiry = datetime.now(timezone.utc) + timedelta(seconds=expires_in)
        tokens["access_token"] = new_data["access_token"]
        tokens["expiry"] = new_expiry.strftime("%Y-%m-%dT%H:%M:%S")
        if "refresh_token" in new_data:
            tokens["refresh_token"] = new_data["refresh_token"]
        save_tokens(tokens)
        log(f"STATUS: OK — token refreshed after expiry. New expiry: {tokens['expiry']}")
        sys.exit(0)

    # -- Refresh failed — token likely revoked --
    log("CRITICAL: Refresh FAILED. The refresh token may have been revoked or expired.")
    log("")
    log("=" * 60)
    log("MANUAL RE-AUTHENTICATION REQUIRED")
    log("=" * 60)
    log("")
    log("Option 1 — Run the manual auth script:")
    log("  python3 ~/scripts/google_oauth_manual_auth.py")
    log("")
    log("Option 2 — Follow the steps in:")
    log("  ~/scripts/OAUTH_RENEWAL_GUIDE.md")
    log("")
    log("Option 3 — Open this URL in your browser and follow the prompts:")
    log("  https://accounts.google.com/o/oauth2/v2/auth?client_id="
        f"{tokens.get('client_id', 'MISSING')}"
        "&redirect_uri=http://localhost:8434/callback"
        "&response_type=code"
        "&scope=https://www.googleapis.com/auth/gmail.readonly"
        "&access_type=offline"
        "&prompt=consent")
    log("=" * 60)

    write_alert(
        f"Token expired {expiry_dt.isoformat()} and refresh FAILED. "
        "Manual re-authentication required. "
        "Run: python3 ~/scripts/google_oauth_manual_auth.py"
    )

    sys.exit(2)


if __name__ == "__main__":
    main()
