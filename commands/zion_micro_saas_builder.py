#!/usr/bin/env python3
"""
Zion Tech Group – Micro-SaaS Builder Agent

Features:
1. Auto-generates service pages from templates
2. Integrates with SendGrid for email campaigns
3. Uses OpenAI for content optimization
4. Deploys to Vercel with zero downtime
"""

import os
import json
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Dependencies
import openai
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from fastapi import FastAPI
from pydantic import BaseModel

# Initialize OpenAI client
openai.api_key = os.getenv("OPENAI_API_KEY")

# FastAPI app
app = FastAPI()

# Database connection (example)
conn = psycopg2.connect(
    host=os.getenv("POSTGRES_HOST", "localhost"),
    database=os.getenv("POSTGRES_DB", "zion"),
    user=os.getenv("POSTGRES_USER", "zion_user"),
    password=os.getenv("POSTGRES_PASSWORD", "zion_secret"),
    port=os.getenv("POSTGRES_PORT", 5432)
)

# Lead Capture Agent
@app.post("/api/leads")
async def capture_lead(lead: LeadRequest):
    """Capture lead data and store in PostgreSQL."""
    try:
        # Validate and process lead
        lead = Lead(**lead.dict())
        # Store in database
        conn = get_db_conn()
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO leads (name, email, created_at) VALUES (%s, %s, %s) RETURNING lead_id",
            (lead.name, lead.email, datetime.utcnow())
        )
        conn.commit()
        cur.close()
