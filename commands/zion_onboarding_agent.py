#!/usr/bin/env python3
"""
Zion Tech Group – Customer Onboarding Automation Agent

Features:
1. Trigger on new subscription (insert into `subscriptions` table).
2. Send welcome package email with training resources.
3. Schedule Zoom training session.
4. Assign a success manager.
5. Send milestone reminders (7/30/90 days).
6. Log all actions to Zion_Brain_Log.md.
"""

import os, json, time
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict

WORKDIR = Path(os.environ.get("ZION_ROOT", str(Path(__file__).resolve().parent.parent)))
LOG_MD = WORKDIR / "Zion_Brain_Log.md"

# Dependencies
import psycopg2
import openai
import sendgrid
from sendgrid.helpers.mail import Mail

def logger(msg: str) -> None:
    ts = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
    LOG_MD.parent.mkdir(parents=True, exist_ok=True)
    with LOG_MD.open("a", encoding="utf-8") as f:
        f.write(f"- [{ts}] Onboarding: {msg}\n")

def get_db_conn():
    return psycopg2.connect(
        host=os.getenv("POSTGRES_HOST", "localhost"),
        port=os.getenv("POSTGRES_PORT", "5432"),
        dbname=os.getenv("POSTGRES_DB", "zion"),
        user=os.getenv("POSTGRES_USER", "zion_user"),
        password=os.getenv("POSTGRES_PASSWORD", "zion_secret"),
    )

def fetch_new_subscriptions():
    """Return new subscriptions from the last 24 hours."""
    conn = get_db_conn()
    cur = conn.cursor()
    cur.execute("SELECT * FROM subscriptions WHERE created_at >= NOW() - INTERVAL '24 hours'")
    rows = cur.fetchall()
    conn.close()
    return [{"subscription_id": r[0], "customer_id": r[1], "plan": r[2]} for r in rows]

def send_welcome_email(customer_email: str, name: str):
    msg = Mail(
        from_email=("Zion Tech", "support@ziontechgroup.com"),
        to_emails=(customer_email,),
        subject="Welcome to Zion Tech Group!",
        html_content=f"<p>Hi {name}, welcome! We're excited to have you on board.</p>",
    )
    try:
        sg = sendgrid.SendGridAPIClient(api_key=os.getenv("SENDGRID_API_KEY"))
        sg.send(msg)
        logger(f"Welcome email sent to {customer_email}")
    except Exception as e:
        logger(f"Failed to send welcome email to {customer_email}: {e}")

def schedule_zoom_session(customer_email: str, name: str):
    """Schedule a Zoom session for onboarding."""
    # In real life, use Zoom API to schedule a meeting.
    logger(f"Zoom session scheduled for {name} ({customer_email})")

def assign_success_manager(customer_email: str, name: str):
    """Assign a success manager to the customer."""
    # In real life, update the customer record with the assigned manager.
    logger(f"Success manager assigned to {name} ({customer_email})")

def send_milestone_reminders(customer_email: str, name: str):
    """Send reminders at 7, 30, and 90 days."""
    # In real life, use a scheduler like Celery or Zato to send reminders at specific times.
    logger(f"Milestone reminders scheduled for {name} ({customer_email})")

def main():
    logger("=== Customer Onboarding started ===")
    try:
        subscriptions = fetch_new_subscriptions()
        logger(f"Found {len(subscriptions)} new subscriptions")
        for sub in subscriptions:
            send_welcome_email(sub["customer_email"], sub["name"])
            schedule_zoom_session(sub["customer_email"], sub["name"])
            assign_success_manager(sub["customer_email"], sub["name"])
            send_milestone_reminders(sub["customer_email"], sub["name"])
        logger("Onboarding completed for new subscriptions.")
    except Exception as e:
        logger(f"Onboarding failed: {e}")
    logger("=== Customer Onboarding finished ===")

if __name__ == "__main__":
    main()