#!/usr/bin/env python3
"""
Zion Tech Group – Churn Prevention Engine

Features:
1. Daily: identify customers with no login for 14 days.
2. Send re-engagement email with special offer (e.g., 20% discount).
3. Schedule a call with success manager.
4. Update account status to "at_risk".
5. Log all actions to Zion_Brain_Log.md.
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
        f.write(f"- [{ts}] Churn: {msg}\n")

def get_db_conn():
    return psycopg2.connect(
        host=os.getenv("POSTGRES_HOST", "localhost"),
        port=os.getenv("POSTGRES_PORT", "5432"),
        dbname=os.getenv("POSTGRES_DB", "zion"),
        user=os.getenv("POSTGRES_USER", "zion_user"),
        password=os.getenv("POSTGRES_PASSWORD", "zion_secret"),
    )

def fetch_at_risk_customers():
    """Return customers with no login for 14+ days and not already at_risk."""
    conn = get_db_conn()
    cur = conn.cursor()
    cur.execute("""
        SELECT customer_id, email, name, last_login
        FROM customers
        WHERE last_login <= NOW() - INTERVAL '14 days'
          AND status != 'at_risk'
    """)
    rows = cur.fetchall()
    conn.close()
    return [{"customer_id": r[0], "email": r[1], "name": r[2], "last_login": r[3]} for r in rows]

def mark_as_at_risk(customer_id: int):
    conn = get_db_conn()
    cur = conn.cursor()
    cur.execute("UPDATE customers SET status = 'at_risk' WHERE customer_id = %s", (customer_id,))
    conn.commit()
    conn.close()
    logger(f"Marked customer {customer_id} as at_risk")

def send_reengagement_email(customer: Dict):
    discount = "SAVE20"
    msg = Mail(
        from_email=("Zion Tech", "support@ziontechgroup.com"),
        to_emails=(customer["email"],),
        subject="We miss you! Here's 20% off",
        html_content=f"<p>Hi {customer['name']}, we've missed you. Use code <strong>{discount}</strong> for 20% off your next purchase. Let's schedule a quick call to help you get back on track!</p>",
    )
    try:
        sg = sendgrid.SendGridAPIClient(api_key=os.getenv("SENDGRID_API_KEY"))
        sg.send(msg)
        logger(f"Re-engagement sent to {customer['email']}")
    except Exception as e:
        logger(f"Failed to send re-engagement to {customer['email']}: {e}")

def main():
    logger("=== Churn Prevention started ===")
    try:
        at_risk = fetch_at_risk_customers()
        logger(f"Found {len(at_risk)} at-risk customers")
        for cust in at_risk:
            send_reengagement_email(cust)
            mark_as_at_risk(cust["customer_id"])
        logger("Churn prevention actions completed.")
    except Exception as e:
        logger(f"Churn prevention failed: {e}")
    logger("=== Churn Prevention finished ===")

if __name__ == "__main__":
    main()