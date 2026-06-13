#!/usr/bin/env python3
"""
Token Renewal Organization Report for Zion Tech Group
======================================================
Weekly summary of token health, refresh history, and recommendations.
"""
import json, os
from datetime import datetime, timezone, timedelta
from pathlib import Path

HOME = os.environ.get("HOME", "")
TOKEN_FILE = Path(HOME + "/.openclaw/workspace/gog_tokens.json")
STATE_FILE = Path(HOME + "/data/token_state.json")
DASHBOARD_FILE = Path(HOME + "/data/token_dashboard.json")
NOTIFY_LOG = Path(HOME + "/data/token_notify_log.json")
REPORT_FILE = Path(HOME + "/data/token_weekly_report.json")

def load_json(path):
    try:
        with open(path) as f:
            return json.load(f)
    except:
        return {}

def generate_report():
    tokens = load_json(TOKEN_FILE)
    state = load_json(STATE_FILE)
    dashboard = load_json(DASHBOARD_FILE)
    notify_log = load_json(NOTIFY_LOG)
    
    now = datetime.now(timezone.utc)
    
    # Calculate metrics
    refresh_count = state.get("refresh_count", 0)
    failure_count = state.get("failure_count", 0)
    last_refresh = state.get("last_refresh", "never")
    last_failure = state.get("last_failure_time", "never")
    
    # Count notifications this week
    week_ago = (now - timedelta(days=7)).strftime("%Y-%m-%d")
    week_notifies = {k: v for k, v in notify_log.items() if k >= week_ago}
    
    # Token expiry
    expiry_str = tokens.get("expiry", "")
    hours_left = None
    if expiry_str:
        try:
            expiry = datetime.fromisoformat(expiry_str.replace("Z", "+00:00"))
            hours_left = (expiry - now).total_seconds() / 3600
        except:
            pass
    
    report = {
        "generated_at": now.isoformat(),
        "token_status": "healthy" if hours_left and hours_left > 2 else "critical",
        "hours_remaining": round(hours_left, 1) if hours_left else None,
        "refresh_count": refresh_count,
        "failure_count": failure_count,
        "last_refresh": last_refresh,
        "last_failure": last_failure,
        "notifications_this_week": len(week_notifies),
        "scopes": tokens.get("scopes", "N/A"),
        "has_refresh_token": bool(tokens.get("refresh_token")),
        "recommendations": [],
    }
    
    # Generate recommendations
    if not tokens.get("refresh_token"):
        report["recommendations"].append("⚠️ No refresh token stored — manual re-auth will be required")
    if failure_count > 3:
        report["recommendations"].append(f"⚠️ {failure_count} failures — check OAuth client configuration")
    if hours_left and hours_left < 1:
        report["recommendations"].append("🔴 Token expires within 1 hour — auto-refresh should trigger")
    if refresh_count == 0:
        report["recommendations"].append("ℹ️ No refreshes yet — token may be newly created")
    
    # Save report
    REPORT_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(REPORT_FILE, "w") as f:
        json.dump(report, f, indent=2)
    
    # Print summary
    print("=" * 50)
    print("  Token Renewal — Weekly Report")
    print("=" * 50)
    print(f"  Status:          {report['token_status'].upper()}")
    print(f"  Hours Remaining: {report['hours_remaining']}")
    print(f"  Refresh Count:   {refresh_count}")
    print(f"  Failure Count:   {failure_count}")
    print(f"  Last Refresh:    {last_refresh}")
    print(f"  This Week Notifies: {len(week_notifies)}")
    if report["recommendations"]:
        print(f"\n  Recommendations:")
        for r in report["recommendations"]:
            print(f"    {r}")
    print("=" * 50)
    
    return report

if __name__ == "__main__":
    generate_report()
