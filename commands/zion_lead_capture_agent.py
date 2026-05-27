#!/usr/bin/env python3
"""
Zion Tech Group – Lead Capture Agent

Features:
1. Webhook listener for form submissions
2. Validate and sanitize user input
3. Store leads in PostgreSQL database
4. Send confirmation emails via SendGrid
"""

import os
import json
from datetime import datetime
from dotenv import load_dotenv
from psycopg2 import connect
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

# Load environment variables
load_dotenv()

# Database connection
conn = psycopg2.connect(
    host=os.getenv("POSTGRES_HOST", "localhost"),
    database=os.getenv("POSTGRES_DB", "zion"),
    user=os.getenv("POSTGRES_USER", "zion_user"),
    password=os.getenv("POSTGRES_PASSWORD", "zion_secret"),
    port=os.getenv("POSTGRES_PORT", 5432)
)

# Lead capture function
@app.route("/api/lead", methods=["POST"])
async def capture_lead(request):
    """Capture lead data and store in PostgreSQL."""
    data = await request.json()
    lead = {
        "name": data.get("name"),
        "email": data.get("email"),
        "phone": data.get("phone", ""),
        "created_at": datetime.utcnow().isoformat()
    }
    
    # Validate required fields
    if not lead.get("email"):
        return jsonify(success=False, message="Email is required"), 400
    
    # Store lead in database
    with conn.cursor() as cur:
        cur.execute(
            "INSERT INTO leads (name, email, created_at) VALUES (%s, %s, %s) RETURNING lead_id",
            (lead.get("name"), lead.get("email"), datetime.utcnow())
        )
        lead_id = cur.fetchone()[0]
    
    # Send confirmation email
    await send_confirmation_email(lead_id, lead.get("email"))
    
    return jsonify(success=True, lead_id=lead_id), 201

# Function to send confirmation email
async def send_confirmation_email(lead_id: str, email: str) -> None:
    """Send confirmation email to new lead."""
    try:
        sg = sendgrid.SendGridAPIClient(api_key=os.getenv("SENDGRID_API_KEY"))
        from_email = Email("support@ziontechgroup.com")
        to_email = Email(email)
        subject = "Welcome to Zion Tech Group!"
        body = "<p>Thank you for signing up for Zion Tech Group. Your account has been created successfully.</p>"
        msg = Mail(from_email=from_email, to_emails=to_email, subject=subject, html_content=body)
        sg.send(msg)
    except Exception as e:
        logger.error(f"Failed to send confirmation email: {e}")

# Start the FastAPI app
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000