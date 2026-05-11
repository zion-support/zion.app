#!/usr/bin/env python3
"""
Zion Tech Group – Customer Feedback Collection Agent

Features:
1. Daily check: find purchases older than 7 days.
2. Send a feedback survey email (SurveyMonkey or Google Forms) via SendGrid.
3. Analyze sentiment using GPT-4 on any reply.
4. If negative, route to support ticket system.
5. Send thank you email + discount code on positive feedback.
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
        f.write(f"- [{ts}] Feedback: {msg}\n")

def get_db_conn():
    return psycopg2.connect(
        host=os.getenv("POSTGRES_HOST", "localhost"),
        port=os.getenv("POSTGRES_PORT", "5432"),
        dbname=os.getenv("POSTGRES_DB", "zion"),
        user=os.getenv("POSTGRES_USER", "zion_user"),
        password=os.getenv("POSTGRES_PASSWORD", "zion_secret"),
    )

def fetch_eligible_customers():
    """Return customers who purchased >7 days ago and haven't been sent feedback survey."""
    conn = get_db_conn()
    cur = conn.cursor()
    cur.execute("""
        SELECT customer_id, email, name, purchase_date
        FROM purchases
        WHERE purchase_date <= NOW() - INTERVAL '7 days'
          AND feedback_sent = FALSE
    """)
    rows = cur.fetchall()
    conn.close()
    return [{"customer_id": r[0], "email": r[1], "name": r[2], "purchase_date": r[3]} for r in rows]

def send_survey_email(customer: Dict):
    survey_url = "https://forms.gle/feedback"  # placeholder
    msg = Mail(
        from_email=("Zion Tech", "support@ziontechgroup.com"),
        to_emails=(customer["email"],),
        subject="We'd love your feedback!",
        html_content=f"<p>Hi {customer['name']}, please share your experience: <a href='{survey_url}'>Feedback Survey</a></p>",
    )
    try:
        sg = sendgrid.SendGridAPIClient(api_key=os.getenv("SENDGRID_API_KEY"))
        resp = sg.send(msg)
        logger(f"Survey sent to {customer['email']} – status {resp.status_code}")
        # Mark feedback_sent = TRUE in DB
        conn = get_db_conn()
        cur = conn.cursor()
        cur.execute("UPDATE purchases SET feedback_sent = TRUE WHERE customer_id = %s", (customer["customer_id"],))
        conn.commit()
        conn.close()
    except Exception as e:
        logger(f"Failed to send survey to {customer['email']}: {e}")

def analyze_reply(email_content: str) -> Dict:
    """Use GPT-4 to analyze sentiment of a reply."""
    try:
        resp = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "Analyze sentiment of the following feedback. Return JSON with 'sentiment' (positive/negative/neutral) and a brief 'summary'."},
                {"role": "user", "content": email_content}
            ],
            temperature=0.3,
            max_tokens=100
        )
        return json.loads(resp.choices[0].message.content.strip())
    except Exception as e:
        logger(f"Sentiment analysis failed: {e}")
        return {"sentiment": "neutral", "summary": "unable to analyze"}

def handle_negative_feedback(sentiment_data: Dict, customer_email: str):
    """Create a support ticket and notify the team."""
    logger(f"Negative feedback from {customer_email}: {sentiment_data.get('summary')}")
    # In real life, create ticket in support system. Here we just send an alert.
    send_alert(f"Negative feedback from {customer_email}: {sentiment_data.get('summary')}")

def send_alert(body: str):
    msg = Mail(
        from_email=("Zion Alerts", "alerts@ziontechgroup.com"),
        to_emails=("support@ziontechgroup.com",),
        subject="Negative Feedback Received",
        html_content=f"<pre>{body}</pre>",
    )
    try:
        sg = sendgrid.SendGridAPIClient(api_key=os.getenv("SENDGRID_API_KEY"))
        sg.send(msg)
    except Exception as e:
        logger(f"Failed to send alert: {e}")

def send_thank_you(customer_email: str, name: str):
    discount_code = "THANKS10"
    msg = Mail(
        from_email=("Zion Tech", "support@ziontechgroup.com"),
        to_emails=(customer_email,),
        subject="Thank you for your feedback!",
        html_content=f"<p>Hi {name}, thank you for your feedback! Here's 10% off your next purchase: <strong>{discount_code}</strong></p>",
    )
    try:
        sg = sendgrid.SendGridAPIClient(api_key=os.getenv("SENDGRID_API_KEY"))
        sg.send(msg)
        logger(f"Thank you sent to {customer_email}")
    except Exception as e:
        logger(f"Failed to send thank you to {customer_email}: {e}")

def main():
    logger("=== Customer Feedback Collection started ===")
    try:
        customers = fetch_eligible_customers()
        logger(f"Found {len(customers)} customers eligible for feedback survey")
        for cust in customers:
            send_survey_email(cust)
            time.sleep(1)  # rate limit
        # In a real setup, we'd also poll for replies, but that's out of scope for this cron.
        logger("Feedback survey distribution completed.")
    except Exception as e:
        logger(f"Feedback collection failed: {e}")
    logger("=== Customer Feedback Collection finished ===")

if __name__ == "__main__":
    main()