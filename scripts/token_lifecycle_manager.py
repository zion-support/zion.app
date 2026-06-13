#!/usr/bin/env python3
"""
Google OAuth Token Lifecycle Manager for Zion Tech Group
========================================================
Comprehensive token lifecycle management with persistent state tracking,
proactive refresh, exponential backoff, health verification, and
dashboard data export.

Usage:
    python3 token_lifecycle_manager.py check         # Check health, auto-refresh if needed
    python3 token_lifecycle_manager.py force-refresh  # Force a token refresh
    python3 token_lifecycle_manager.py status         # Show full status
    python3 token_lifecycle_manager.py dashboard      # Export dashboard data
"""
import json, os, sys, urllib.request, urllib.parse, urllib.error
from datetime import datetime, timezone, timedelta

# -- Configuration (all paths use os.environ.get("HOME") + concatenation) --
HOME = os.environ.get("HOME", "")
TOKEN_FILE = HOME + "/.openclaw/workspace/gog_tokens.json"
STATE_FILE = HOME + "/data/token_state.json"
DASHBOARD_FILE = HOME + "/data/token_dashboard.json"
LOG_DIR = HOME + "/logs"
LOG_FILE = LOG_DIR + "/token_lifecycle.log"
GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"
GMAIL_API_TEST_URL = "https://gmail.googleapis.com/gmail/v1/users/me/profile"

PROACTIVE_REFRESH_DAYS = 7    # Refresh proactively if within this many days
AUTO_REFRESH_BUFFER_DAYS = 1  # Auto-refresh if token expires within this window
MAX_BACKOFF_SECONDS = 3600    # Max backoff cap (1 hour)
INITIAL_BACKOFF_SECONDS = 60  # Initial backoff (1 minute)
MAX_FAILURE_HISTORY = 50      # Max failure records to keep


# -- Logging --
def log(msg):
    os.makedirs(LOG_DIR, exist_ok=True)
    ts = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    line = f"[{ts}] {msg}"
    print(line)
    with open(LOG_FILE, "a") as f:
        f.write(line + "\n")


# -- State Management --
def load_state():
    """Load persistent state from disk."""
    if os.path.exists(STATE_FILE):
        try:
            with open(STATE_FILE, "r") as f:
                return json.load(f)
        except Exception:
            pass
    return {
        "refresh_count": 0,
        "last_refresh": None,
        "last_status": "unknown",
        "failure_count": 0,
        "failure_history": [],
        "last_check": None,
        "backoff_seconds": 0,
        "last_failure_time": None,
    }


def save_state(state):
    """Persist state to disk."""
    os.makedirs(os.path.dirname(STATE_FILE), exist_ok=True)
    with open(STATE_FILE, "w") as f:
        json.dump(state, f, indent=2)


def record_failure(state, reason):
    """Record a failure with timestamp and update backoff."""
    now = datetime.now(timezone.utc).isoformat()
    state["failure_count"] = state.get("failure_count", 0) + 1
    state["last_failure_time"] = now
    state["last_status"] = "failure"

    history = state.get("failure_history", [])
    history.append({
        "timestamp": now,
        "reason": reason,
    })
    # Trim history to max size
    if len(history) > MAX_FAILURE_HISTORY:
        history = history[-MAX_FAILURE_HISTORY:]
    state["failure_history"] = history

    # Exponential backoff
    backoff = state.get("backoff_seconds", 0)
    if backoff == 0:
        backoff = INITIAL_BACKOFF_SECONDS
    else:
        backoff = min(backoff * 2, MAX_BACKOFF_SECONDS)
    state["backoff_seconds"] = backoff

    save_state(state)
    return state


def record_success(state):
    """Record a successful refresh and reset backoff."""
    now = datetime.now(timezone.utc).isoformat()
    state["refresh_count"] = state.get("refresh_count", 0) + 1
    state["last_refresh"] = now
    state["last_status"] = "ok"
    state["backoff_seconds"] = 0
    state["last_failure_time"] = None
    save_state(state)
    return state


def is_in_backoff(state):
    """Check if we're in a backoff period after failures."""
    backoff = state.get("backoff_seconds", 0)
    if backoff == 0:
        return False
    last_fail = state.get("last_failure_time")
    if not last_fail:
        return False
    try:
        fail_time = datetime.fromisoformat(last_fail.replace("Z", "+00:00"))
        now = datetime.now(timezone.utc)
        elapsed = (now - fail_time).total_seconds()
        return elapsed < backoff
    except Exception:
        return False


# -- Token File Operations --
def load_tokens():
    """Load the token file."""
    if not os.path.exists(TOKEN_FILE):
        log(f"ERROR: Token file not found: {TOKEN_FILE}")
        sys.exit(2)
    with open(TOKEN_FILE, "r") as f:
        return json.load(f)


def save_tokens(tokens):
    """Save the token file."""
    with open(TOKEN_FILE, "w") as f:
        json.dump(tokens, f, indent=2)
    log(f"Tokens saved to {TOKEN_FILE}")


# -- Token Status --
def get_token_info(tokens):
    """Parse token expiry and return (status, days_remaining, expiry_dt, message)."""
    expiry_str = tokens.get("expiry", "")
    if not expiry_str:
        return "unknown", 0.0, None, "No expiry field in token file"
    try:
        expiry = datetime.fromisoformat(expiry_str.replace("Z", "+00:00"))
        if expiry.tzinfo is None:
            expiry = expiry.replace(tzinfo=timezone.utc)
        now = datetime.now(timezone.utc)
        remaining_secs = (expiry - now).total_seconds()
        remaining_days = remaining_secs / 86400.0
        # Format human-readable remaining time
        if remaining_secs > 86400:
            time_str = f"{remaining_days:.1f} more days"
        elif remaining_secs > 3600:
            time_str = f"{remaining_secs/3600:.1f} more hours"
        elif remaining_secs > 0:
            time_str = f"{remaining_secs/60:.0f} more minutes"
        else:
            time_str = f"expired {-remaining_days:.1f} days ago"
        if remaining_days > PROACTIVE_REFRESH_DAYS:
            return "ok", remaining_days, expiry, f"Token valid for {time_str}"
        elif remaining_days > AUTO_REFRESH_BUFFER_DAYS:
            return "warning", remaining_days, expiry, f"Token expires in {time_str} (proactive refresh recommended)"
        elif remaining_secs > 0:
            return "critical", remaining_days, expiry, f"Token expires in {time_str} (auto-refresh triggered)"
        else:
            return "expired", remaining_days, expiry, f"Token {time_str}"
    except Exception as e:
        return "error", 0.0, None, f"Cannot parse expiry: {e}"


# -- Token Refresh --
def do_refresh(tokens):
    """Perform the OAuth refresh request. Returns refresh response dict or None."""
    client_id = tokens.get("client_id")
    client_secret = tokens.get("client_secret")
    refresh_token_val = tokens.get("refresh_token")

    if not all([client_id, client_secret, refresh_token_val]):
        log("ERROR: Missing credentials for refresh (client_id, client_secret, or refresh_token)")
        return None

    data = urllib.parse.urlencode({
        "client_id": client_id,
        "client_secret": client_secret,
        "refresh_token": refresh_token_val,
        "grant_type": "refresh_token",
    }).encode()

    req = urllib.request.Request(
        GOOGLE_TOKEN_URL,
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


def apply_refresh(tokens, refresh_response):
    """Update token file with new access token from refresh response."""
    expires_in = refresh_response.get("expires_in", 3600)
    new_expiry = datetime.now(timezone.utc) + timedelta(seconds=expires_in)
    tokens["access_token"] = refresh_response["access_token"]
    tokens["expiry"] = new_expiry.strftime("%Y-%m-%dT%H:%M:%S")
    if "refresh_token" in refresh_response:
        tokens["refresh_token"] = refresh_response["refresh_token"]
    save_tokens(tokens)
    return tokens


# -- Gmail API Health Check --
def verify_gmail_api(tokens):
    """
    Verify the access token actually works by calling the Gmail API.
    Returns (success: bool, message: str).
    """
    access_token = tokens.get("access_token", "")
    if not access_token:
        return False, "No access token available"

    req = urllib.request.Request(
        GMAIL_API_TEST_URL,
        headers={"Authorization": f"Bearer {access_token}"},
    )
    try:
        resp = urllib.request.urlopen(req, timeout=10)
        data = json.loads(resp.read())
        email = data.get("emailAddress", "unknown")
        return True, f"Gmail API OK — authenticated as {email}"
    except urllib.error.HTTPError as e:
        body = e.read().decode(errors="replace")
        if e.code == 401:
            return False, f"Gmail API returned 401 Unauthorized — token is invalid or revoked"
        return False, f"Gmail API returned HTTP {e.code}: {body[:200]}"
    except Exception as e:
        return False, f"Gmail API check failed: {e}"


# -- Dashboard Export --
def export_dashboard(state, token_status, days_remaining, expiry_dt, gmail_ok, gmail_msg):
    """Export dashboard data to JSON file."""
    now = datetime.now(timezone.utc)

    # Determine if attention is needed
    needs_attention = (
        token_status in ("expired", "error", "critical") or
        not gmail_ok or
        state.get("failure_count", 0) > 3 or
        (days_remaining is not None and days_remaining <= PROACTIVE_REFRESH_DAYS and days_remaining > 0)
    )

    dashboard = {
        "generated_at": now.isoformat(),
        "status": token_status,
        "expiry": expiry_dt.isoformat() if expiry_dt else None,
        "remaining_days": round(days_remaining, 2) if days_remaining is not None else None,
        "refresh_count": state.get("refresh_count", 0),
        "last_refresh": state.get("last_refresh"),
        "failure_count": state.get("failure_count", 0),
        "last_failure_time": state.get("last_failure_time"),
        "last_status": state.get("last_status", "unknown"),
        "gmail_api_ok": gmail_ok,
        "gmail_api_message": gmail_msg,
        "needs_attention": needs_attention,
        "backoff_seconds": state.get("backoff_seconds", 0),
        "proactive_refresh_days": PROACTIVE_REFRESH_DAYS,
        "auto_refresh_buffer_days": AUTO_REFRESH_BUFFER_DAYS,
    }

    os.makedirs(os.path.dirname(DASHBOARD_FILE), exist_ok=True)
    with open(DASHBOARD_FILE, "w") as f:
        json.dump(dashboard, f, indent=2)

    return dashboard


# -- Commands --
def cmd_check():
    """
    Check token health, verify Gmail API, auto-refresh if needed.
    Returns exit code: 0=OK, 1=WARNING, 2=CRITICAL.
    """
    state = load_state()
    state["last_check"] = datetime.now(timezone.utc).isoformat()

    # Check backoff
    if is_in_backoff(state):
        remaining_backoff = state.get("backoff_seconds", 0)
        last_fail = state.get("last_failure_time", "unknown")
        log(f"In backoff period ({remaining_backoff}s since last failure at {last_fail}). Skipping refresh attempt.")
        # Still do a status check
        tokens = load_tokens()
        token_status, days, expiry_dt, msg = get_token_info(tokens)
        gmail_ok, gmail_msg = verify_gmail_api(tokens)
        log(f"Token status: {token_status} — {msg}")
        log(f"Gmail API: {gmail_msg}")
        dashboard = export_dashboard(state, token_status, days, expiry_dt, gmail_ok, gmail_msg)
        print(f"STATUS: {token_status.upper()} — {msg}")
        print(f"Gmail API: {gmail_msg}")
        print(f"Backoff active: {remaining_backoff}s remaining")
        save_state(state)
        if token_status in ("expired", "error"):
            return 2
        if not gmail_ok:
            return 2
        return 1 if token_status == "warning" else 0

    tokens = load_tokens()
    token_status, days, expiry_dt, msg = get_token_info(tokens)
    log(f"Token status: {token_status} — {msg}")

    # Verify Gmail API works
    gmail_ok, gmail_msg = verify_gmail_api(tokens)
    log(f"Gmail API check: {gmail_msg}")

    # Determine if refresh is needed
    needs_refresh = token_status in ("expired", "critical", "warning")

    # Also refresh if Gmail API fails (token might be revoked even if not expired)
    if not gmail_ok and token_status == "ok":
        log("Gmail API check failed despite token appearing valid. Token may be revoked.")
        needs_refresh = True
        token_status = "api_failure"

    if needs_refresh:
        log(f"Attempting token refresh (status: {token_status})...")
        resp = do_refresh(tokens)
        if resp:
            tokens = apply_refresh(tokens, resp)
            state = record_success(state)
            new_status, new_days, new_expiry, new_msg = get_token_info(tokens)
            log(f"Refresh successful. New expiry: {tokens.get('expiry')}")
            log(f"New status: {new_status} — {new_msg}")

            # Re-verify Gmail API after refresh
            gmail_ok, gmail_msg = verify_gmail_api(tokens)
            log(f"Post-refresh Gmail API: {gmail_msg}")

            dashboard = export_dashboard(state, new_status, new_days, new_expiry, gmail_ok, gmail_msg)
            print(f"STATUS: OK (refreshed) — {new_msg}")
            print(f"Gmail API: {gmail_msg}")
            print(f"Total refreshes: {state['refresh_count']}")
            return 0
        else:
            state = record_failure(state, f"Refresh failed during check (token status: {token_status})")
            log(f"Refresh failed. Backoff: {state['backoff_seconds']}s")
            dashboard = export_dashboard(state, token_status, days, expiry_dt, gmail_ok, gmail_msg)
            print(f"STATUS: {token_status.upper()} — {msg}")
            print(f"Refresh FAILED. Backoff: {state['backoff_seconds']}s")
            if not gmail_ok:
                print(f"Gmail API: {gmail_msg}")
            if token_status == "expired":
                print("MANUAL RE-AUTHENTICATION REQUIRED")
                cid = tokens.get("client_id", "")
                print(f"  https://accounts.google.com/o/oauth2/auth?client_id={cid}&redirect_uri=http://localhost:8433/callback&response_type=code&scope=https://www.googleapis.com/auth/gmail.modify&access_type=offline&prompt=consent")
            return 2 if token_status in ("expired", "error", "api_failure") else 1
    else:
        # Token is fine, just update state and dashboard
        state["last_status"] = "ok"
        save_state(state)
        dashboard = export_dashboard(state, token_status, days, expiry_dt, gmail_ok, gmail_msg)
        print(f"STATUS: OK — {msg}")
        print(f"Gmail API: {gmail_msg}")
        print(f"Total refreshes: {state.get('refresh_count', 0)}")
        return 0


def cmd_force_refresh():
    """Force a token refresh regardless of expiry."""
    state = load_state()
    state["last_check"] = datetime.now(timezone.utc).isoformat()

    tokens = load_tokens()
    log("Force refresh requested")

    old_status, old_days, old_expiry, old_msg = get_token_info(tokens)
    log(f"Pre-refresh status: {old_status} — {old_msg}")

    resp = do_refresh(tokens)
    if resp:
        tokens = apply_refresh(tokens, resp)
        state = record_success(state)
        new_status, new_days, new_expiry, new_msg = get_token_info(tokens)
        gmail_ok, gmail_msg = verify_gmail_api(tokens)
        dashboard = export_dashboard(state, new_status, new_days, new_expiry, gmail_ok, gmail_msg)
        log(f"Force refresh successful. New expiry: {tokens.get('expiry')}")
        print(f"OK — Token force-refreshed.")
        print(f"  Previous: {old_msg}")
        print(f"  New: {new_msg}")
        print(f"  Expiry: {tokens.get('expiry')}")
        print(f"  Gmail API: {gmail_msg}")
        print(f"  Total refreshes: {state['refresh_count']}")
        return 0
    else:
        state = record_failure(state, "Force refresh failed")
        log("Force refresh FAILED")
        gmail_ok, gmail_msg = verify_gmail_api(tokens)
        dashboard = export_dashboard(state, old_status, old_days, old_expiry, gmail_ok, gmail_msg)
        print(f"FAILED — Could not refresh token")
        print(f"  Status: {old_status} — {old_msg}")
        print(f"  Gmail API: {gmail_msg}")
        print(f"  Consecutive backoff: {state['backoff_seconds']}s")
        return 2


def cmd_status():
    """Show comprehensive token and system status."""
    state = load_state()
    tokens = load_tokens()

    token_status, days, expiry_dt, msg = get_token_info(tokens)
    gmail_ok, gmail_msg = verify_gmail_api(tokens)

    # Update dashboard
    dashboard = export_dashboard(state, token_status, days, expiry_dt, gmail_ok, gmail_msg)

    cid = tokens.get("client_id", "N/A")
    has_refresh = bool(tokens.get("refresh_token"))
    scopes = tokens.get("scopes", "N/A")

    print("=" * 60)
    print("  Google OAuth Token Lifecycle Manager — Status")
    print("=" * 60)
    print()
    print(f"  Token Status:      {token_status}")
    print(f"  Details:           {msg}")
    print(f"  Expiry:            {tokens.get('expiry', 'N/A')}")
    print(f"  Remaining Days:    {days:.2f}" if days is not None else "  Remaining Days:    N/A")
    print(f"  Gmail API:         {'OK' if gmail_ok else 'FAIL'} — {gmail_msg}")
    print()
    print(f"  Client ID:         {cid[:40]}...")
    print(f"  Has Refresh Token: {'yes' if has_refresh else 'NO'}")
    print(f"  Scopes:            {scopes}")
    print()
    print(f"  Refresh Count:     {state.get('refresh_count', 0)}")
    print(f"  Last Refresh:      {state.get('last_refresh', 'never')}")
    print(f"  Failure Count:     {state.get('failure_count', 0)}")
    print(f"  Last Failure:      {state.get('last_failure_time', 'never')}")
    print(f"  Backoff Seconds:   {state.get('backoff_seconds', 0)}")
    print(f"  In Backoff:        {'yes' if is_in_backoff(state) else 'no'}")
    print(f"  Last Check:        {state.get('last_check', 'never')}")
    print()
    print(f"  Token File:        {TOKEN_FILE}")
    print(f"  State File:        {STATE_FILE}")
    print(f"  Dashboard File:    {DASHBOARD_FILE}")
    print(f"  Needs Attention:   {'YES' if dashboard.get('needs_attention') else 'no'}")
    print("=" * 60)

    return 0


def cmd_dashboard():
    """Export dashboard data and print summary."""
    state = load_state()
    tokens = load_tokens()

    token_status, days, expiry_dt, msg = get_token_info(tokens)
    gmail_ok, gmail_msg = verify_gmail_api(tokens)

    dashboard = export_dashboard(state, token_status, days, expiry_dt, gmail_ok, gmail_msg)

    print(json.dumps(dashboard, indent=2))
    log(f"Dashboard exported to {DASHBOARD_FILE}")
    return 0


# -- Main --
COMMANDS = {
    "check": cmd_check,
    "force-refresh": cmd_force_refresh,
    "status": cmd_status,
    "dashboard": cmd_dashboard,
}

if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else "check"
    if cmd not in COMMANDS:
        print(f"Unknown command: {cmd}")
        print(f"Available: {', '.join(COMMANDS.keys())}")
        sys.exit(1)
    sys.exit(COMMANDS[cmd]())
