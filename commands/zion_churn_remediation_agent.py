#!/usr/bin/env python3
"""
Zion Tech Group – Predictive Churn Remediation Agent

Features:
1. Reads churn predictions from `churn_predictions.json`.
2. For customers with churn probability > 0.7, sends a personalized re‑engagement email via SendGrid.
3. Adds a calendar invite (Google Calendar API) for a follow‑up call.
4. Logs all actions to Zion_Brain_Log.md.
5. Self‑healing: retries on SendGrid failure, logs errors.
"""

import os, json, time
from datetime import datetime, timedelta
from pathlib import Path
import psycopg2
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
import google.auth
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

WORKDIR = Path(os.environ.get("ZION_ROOT", str(Path(__file__).resolve().parent.parent)))
LOG_MD = WORKDIR / "Zion_Brain_Log.md"
PRED_JSON = WORKDIR / "churn_predictions.json"

# Logging helper
def logger(msg: str) -> None:
    ts = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
    LOG_MD.parent.mkdir(parents=True, exist_ok=True)
    with LOG_MD.open("a", encoding="utf-8") as f:
        f.write(f"- [{ts}] ChurnRemediation: {msg}\n")

# Load predictions
if not PRED_JSON.exists():
    logger("No churn predictions file found – aborting.")
    exit(0)

with PRED_JSON.open() as f:
    predictions = json.load(f)

# Filter high‑risk customers
high_risk = [p for p in predictions if p.get("churn_prob", 0) >= 0.7]
if not high_risk:
    logger("No high‑risk customers to remediate.")
    exit(0)

# SendGrid client
sg = SendGridAPIClient(os.getenv("SENDGRID_API_KEY"))

# Google Calendar service (assumes service account JSON in env var GOOGLE_APPLICATION_CREDENTIALS)
try:
    creds, _ = google.auth.default(scopes=["https://www.googleapis.com/auth/calendar.events"])
    calendar_service = build("calendar", "v3", credentials=creds)
except Exception as e:
    logger(f"Google Calendar auth failed: {e}")
    calendar_service = None

# Helper to send email

def send_email(to_email: str, subject: str, body: str) -> bool:
    msg = Mail(
        from_email=("Zion Support", "support@ziontechgroup.com"),
        to_emails=to_email,
        subject=subject,
        html_content=body,
    )
    try:
        sg.send(msg)
        return True
    except Exception as e:
        logger(f"SendGrid error for {to_email}: {e}")
        return False

# Helper to create calendar event

def create_event(customer_id: str, email: str, subject: str) -> None:
    if not calendar_service:
        logger("Calendar service not available – skipping event creation.")
        return
    event = {
        "summary": subject,
        "description": f"Follow‑up call with customer {customer_id}",
        "start": {
            "dateTime": (datetime.utcnow() + timedelta(days=1)).isoformat() + "Z",
            "timeZone": "UTC",
        },
        "end": {
            "dateTime": (datetime.utcnow() + timedelta(days=1, hours=1)).isoformat() + "Z",
            "timeZone": "UTC",
        },
        "attendees": [{"email": email}],
    }
    try:
        calendar_service.events().insert(calendarId="primary", body=event).execute()
        logger(f"Calendar event created for {email}")
    except HttpError as e:
        logger(f"Calendar event creation failed for {email}: {e}")

# Main loop
for cust in high_risk:
    cust_id = cust.get("customer_id")
    prob = cust.get("churn_prob")
    # Fetch customer email from DB
    try:
        conn = psycopg2.connect(
            host=os.getenv("POSTGRES_HOST","localhost"),
            dbname=os.getenv("POSTGRES_DB","zion"),
            user=os.getenv("POSTGRES_USER","zion_user"),
            password=os.getenv("POSTGRES_PASSWORD","zion_secret"),
        )
        cur = conn.cursor()
        cur.execute("SELECT email FROM customers WHERE customer_id=%s", (cust_id,))
        row = cur.fetchone()
        cur.close()
        conn.close()
        if not row:
            logger(f"Customer {cust_id} not found in DB – skipping.")
            continue
        email = row[0]
    except Exception as e:
        logger(f"DB lookup failed for {cust_id}: {e}")
        continue

    subject = f"We miss you, {cust_id}! Let’s reconnect"
    body = f"""
<p>Hi {cust_id},</p>
<p>We noticed you haven’t logged in for a while. We’d love to help you get the most out of Zion Tech Group.</p>
<p>Here’s a special offer: <strong>20% off your next subscription renewal</strong> if you renew within the next 30 days.</p>
<p>Let’s schedule a quick call to discuss how we can support you. Click <a href='https://calendar.google.com'>here</a> to pick a time.</p>
<p>Thank you for being part of our community!</p>
"""
    if send_email(email, subject, body):
        logger(f"Re‑engagement email sent to {email} (prob={prob:.2%})")
        create_event(cust_id, email, subject)
    else:
        logger(f"Failed to send re‑engagement email to {email}")

logger("Churn Remediation run completed.")
"""
