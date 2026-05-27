#!/usr/bin/env python3
"""
V32-P5: Health Alert
Daily cron: check v26_run_log.jsonl for yesterday's stats.
If escalated % > 15% or dry_run_blocked > 10%, send Telegram alert
with top 3 failure reasons and suggested threshold adjustments.
"""
import json, os
from datetime import datetime, timezone, timedelta
from pathlib import Path

_WORKSPACE = Path(__file__).resolve().parent.parent.parent
DATA = _WORKSPACE / 'data'
_LOG = DATA / 'v26_run_log.jsonl'

_ALERT_THRESHOLDS = {
    "escalated_pct":    0.15,
    "dry_run_blocked_pct": 0.10,
    "reply_all_suppressed_pct": 0.20,
}

def _now(): return datetime.now(timezone.utc)
def _parse_ts(ts_str: str):
    if not ts_str: return None
    try:
        return datetime.fromisoformat(ts_str.replace("Z", "+00:00"))
    except (ValueError, AttributeError):
        return None

def check_health(log_path=None, window_hours: int = 24) -> dict:
    """Read run log and return health status + alert flags."""
    log = log_path or _LOG
    if not log.exists():
        return {"status": "no_log", "alerts": []}
    cutoff = (_now() - timedelta(hours=window_hours)).isoformat()
    entries = []
    try:
        with open(log) as f:
            for line in f:
                line = line.strip()
                if not line: continue
                try:
                    row = json.loads(line)
                except json.JSONDecodeError:
                    continue
                ts = row.get("ts") or row.get("ts_end", "")
                if ts and ts >= cutoff:
                    entries.append(row)
    except Exception:
        pass
    if not entries:
        return {"status": "no_recent_entries", "alerts": []}
    total = len(entries)
    escalated = sum(1 for e in entries if e.get("escalated"))
    dry_run_blocked = sum(1 for e in entries if not e.get("sent", True) and e.get("dry_run"))
    reply_all_suppressed = sum(1 for e in entries if not e.get("reply_all_used"))
    alerts = []
    if escalated / max(total, 1) > _ALERT_THRESHOLDS["escalated_pct"]:
        alerts.append({"type": "escalated_high",
                       "pct": round(escalated/max(total,1),3),
                       "count": escalated, "total": total,
                       "action": "Review escalation gate thresholds"})
    if dry_run_blocked / max(total, 1) > _ALERT_THRESHOLDS["dry_run_blocked_pct"]:
        alerts.append({"type": "dry_run_blocked_high",
                       "pct": round(dry_run_blocked/max(total,1),3),
                       "count": dry_run_blocked, "total": total,
                       "action": "Check HAS_GMAIL / send restrictions"})
    if reply_all_suppressed / max(total,1) > _ALERT_THRESHOLDS["reply_all_suppressed_pct"]:
        alerts.append({"type": "reply_all_suppressed_high",
                       "pct": round(reply_all_suppressed/max(total,1),3),
                       "count": reply_all_suppressed, "total": total,
                       "action": "Review CC cooldown rules and reply-all extraction"})
    return {"status": "checked", "window_hours": window_hours,
            "total": total, "alerts": alerts}

def format_alert(health: dict) -> str:
    """Format health result as human-readable alert text."""
    if not health.get("alerts"):
        return "✅ Email responder healthy — no alerts in the last 24h."
    lines = ["🚨 Email responder health alert:"]
    for a in health["alerts"]:
        lines.append(f"  • {a['type']}: {a['pct']:.0%} ({a['count']}/{a['total']}) — {a['action']}")
    return "\n".join(lines)

def send_telegram_alert(alert_text: str, chat_id: str = "") -> bool:
    """Send alert to Telegram. Returns True if sent."""
    bot_token = os.getenv("TELEGRAM_BOT_TOKEN", "")
    target = chat_id or os.getenv("TELEGRAM_HOME_CHANNEL", "")
    if not bot_token or not target:
        return False
    try:
        import urllib.request
        url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
        data = json.dumps({"chat_id": target, "text": alert_text, "parse_mode": "HTML"}).encode()
        req = urllib.request.Request(url, data=data, headers={"Content-Type": "application/json"})
        with urllib.request.urlopen(req, timeout=10) as resp:
            return resp.status == 200
    except Exception:
        return False

def auto_alert_and_fix(health: dict) -> dict:
    """If alerts found, send Telegram and apply threshold adjustments."""
    if not health.get("alerts"):
        return {"status": "healthy", "sent": False}
    alert_text = format_alert(health)
    sent = send_telegram_alert(alert_text)
    # Suggest threshold adjustments
    adjustments = {}
    for a in health["alerts"]:
        key = a["type"]
        if key == "escalated_high":
            adjustments["escalation_threshold"] = "raise by 5%"
        elif key == "dry_run_blocked_high":
            adjustments["dry_run_threshold"] = "increase tolerance by 10%"
        elif key == "reply_all_suppressed_high":
            adjustments["cc_cooldown_days"] = "reduce from 14 to 7 days"
    return {"status": "alerted", "sent": sent, "adjustments": adjustments,
            "alert_text": alert_text}
