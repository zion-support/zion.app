#!/usr/bin/env python3
"""
Automation Health — Zion Tech Group

Monitors cron/script health: checks last run timestamps, scans logs for errors,
verifies expected scripts executed. Sends Telegram alerts on failures.

Schedule: Every 15 minutes

Usage: python3 automation_health.py [--execute]
"""

import sys, os, re, json, datetime, argparse, glob
from pathlib import Path

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import telegram_send

DB_FILE = WORKSPACE / 'zion.app' / 'data' / 'automation_health.json'
LOGS_DIR = WORKSPACE / 'zion.app' / 'logs'
HEARTBEAT_LOG = WORKSPACE / 'email-monitor.log'

# Expected cron entries from HEARTBEAT.md (script -> expected frequency in minutes)
EXPECTED = {
    'website_monitor.py': 5,
    'slack_bridge.py': 15,
    'auto_labeler.py': 30,
    'followup_reminder.py': 30,
    'email_prioritizer.py': 30,
    'smart_reply_queue.py': 30,
    'draft_notifier.py': 30,
    'sender_reputation.py': 30,
    'email_translator.py': 30,
    'auto_router.py': 30,
    'expense_categorizer.py': 30,
    'email_responder.py': 30,
    'smart_reply_auto_suggest.py': 30,
    'voice_tasks.py': 30,
    'ci_health_dashboard.py': 60,
    'email_to_task.py': 60,
    'ticket_escalator.py': 60,
    'newsletter_cleaner.py': 120,
    'attachment_saver.py': 360,
    'expense_anomaly.py': 360,
    'crm_sync.py': 360,
    'thread_summarizer.py': 1440,
    'attachment_indexer.py': 1440,
    'thread_archiver.py': 1440,
    'integration_test.py': 1440,
    'ci_tracker.py': 1440,
    'client_onboarding.py': 1440,
    'client_brief.py': 1440,
    'contract_watchdog.py': 360,
    'contract_watchdog_ml.py': 360,
    'renewal_workflow.py': 360,
    'invoice_reminder.py': 360,
    'payment_recon.py': 360,
    'meeting_prep.py': 360,
    'expense_parser.py': 360,
    'sentiment_dashboard.py': 360,
    'expense_anomaly.py': 360,
    'daily_sync.py': 360,
    'standup_bot.py': 360,
    'weekly_kpi.py': 10080,
    'email_dashboard.py': 360,
    'unresponded_tracker.py': 360,
    'nps_survey.py': 360,
    'invoice_chaser.py': 360,
    'auto_followup.py': 360,
    'expense_approval.py': 360,
    'competitor_digest.py': 10080,
    'knowledge_base_update.py': 360,
    'thread_merger.py': 360,
    'meeting_notes.py': 1440,
    'smart_reply_learning.py': 1440,
    'api_key_audit.py': 10080,
    'predictive_churn.py': 10080,
    # Phase 9-11 new scripts
    'gmail_cleaner.py': 1440,
    'permission_auditor.py': 10080,
    'shared_drive_health.py': 1440,
    'calendly_sync.py': 15,
    'hubspot_deal_watcher.py': 30,
    'stripe_customer_alerts.py': 30,
    'slack_dm_forwarder.py': 5,
    'email_pattern_miner.py': 1440,
    'client_journey_mapper.py': 1440,
    'revenue_risk_predictor.py': 1440,
    'automation_health.py': 15,
}

def load_db():
    if DB_FILE.exists():
        return json.loads(DB_FILE.read_text())
    return {'checks': [], 'lastAlert': None}

def save_db(db):
    DB_FILE.parent.mkdir(parents=True, exist_ok=True)
    DB_FILE.write_text(json.dumps(db, indent=2))

def check_heartbeat():
    """Check when heartbeat_check.sh last ran."""
    if not HEARTBEAT_LOG.exists():
        return None, 'log missing'
    lines = HEARTBEAT_LOG.read_text().splitlines()
    # Find last "Heartbeat check completed" or similar
    for line in reversed(lines):
        if 'heartbeat' in line.lower() and ('complet' in line.lower() or 'run' in line.lower() or 'ok' in line.lower()):
            try:
                # Parse ISO timestamp
                ts_str = line.split(']')[0].strip('[')
                dt = datetime.datetime.fromisoformat(ts_str.replace('Z','+00:00')).replace(tzinfo=None)
                return dt, 'ok'
            except Exception:
                continue
    return None, 'no success marker'

def scan_log_errors(hours=1):
    """Scan logs for ERROR/Exception lines in last N hours."""
    if not LOGS_DIR.exists():
        return []
    errors = []
    cutoff = datetime.datetime.utcnow() - datetime.timedelta(hours=hours)
    for logfile in LOGS_DIR.glob('*.log'):
        try:
            content = logfile.read_text()
            for line in content.splitlines():
                if 'ERROR' in line or 'Exception' in line or 'Traceback' in line:
                    try:
                        ts_str = line.split(']')[0].strip('[')
                        dt = datetime.datetime.fromisoformat(ts_str.replace('Z','+00:00')).replace(tzinfo=None)
                        if dt >= cutoff:
                            errors.append(f"{logfile.name}: {line[:120]}")
                    except Exception:
                        pass
        except Exception:
            pass
    return errors

def check_script_timestamps():
    """Check if scripts ran recently based on log timestamps."""
    issues = []
    now = datetime.datetime.utcnow()
    for script, freq_min in EXPECTED.items():
        # look for log lines mentioning script
        pattern = re.compile(rf'\[({script})\]|running {script}|completed {script}', re.IGNORECASE)
        last_seen = None
        if HEARTBEAT_LOG.exists():
            for line in reversed(HEARTBEAT_LOG.read_text().splitlines()):
                if pattern.search(line):
                    try:
                        ts_str = line.split(']')[0].strip('[')
                        dt = datetime.datetime.fromisoformat(ts_str.replace('Z','+00:00'))
                        last_seen = dt
                        break
                    except Exception:
                        pass
        if last_seen is None:
            issues.append(f"{script}: never seen")
        else:
            age_min = (now - last_seen).total_seconds() / 60
            if age_min > freq_min * 1.5:  # grace period
                issues.append(f"{script}: last run {int(age_min)}min ago (expected ~{freq_min}min)")
    return issues

def cmd_run(dry_run=True):
    db = load_db()
    # 1. Heartbeat check
    hb_dt, hb_status = check_heartbeat()
    if hb_status != 'ok':
        print(f"   ❌ Heartbeat not running (status: {hb_status})")
    else:
        age = (datetime.datetime.utcnow() - hb_dt).total_seconds() / 60
        print(f"   ✅ Heartbeat last run {int(age)} min ago")

    # 2. Log errors
    errors = scan_log_errors(hours=1)
    if errors:
        print(f"   ⚠️  {len(errors)} recent errors in logs:")
        for e in errors[:5]:
            print(f"      • {e}")
    else:
        print("   ✅ No recent errors in logs")

    # 3. Script timestamps
    issues = check_script_timestamps()
    if issues:
        print(f"   ⚠️  {len(issues)} script timing issues:")
        for i in issues[:10]:
            print(f"      • {i}")
    else:
        print("   ✅ All scripts running on schedule")

    # If any problems and not dry-run → send Telegram
    problems = []
    if hb_status != 'ok': problems.append("Heartbeat not running")
    if errors: problems.append(f"{len(errors)} log errors")
    if issues: problems.append(f"{len(issues)} script timing issues")

    if problems and not dry_run:
        msg = "🤖 Automation Health Issues:\n" + "\n".join(f"• {p}" for p in problems)
        try:
            telegram_send(msg)
        except Exception as e:
            print(f"   ⚠️  Telegram send failed: {e}")
        db['lastAlert'] = datetime.datetime.utcnow().isoformat()
        save_db(db)
    elif problems:
        print("💡 Add --execute to send alert to Telegram")
    else:
        print("   ✅ All systems green")

def main():
    p = argparse.ArgumentParser()
    p.add_argument('--execute', action='store_true')
    args = p.parse_args()
    cmd_run(dry_run=not args.execute)

if __name__ == '__main__':
    main()
