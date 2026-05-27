#!/usr/bin/env python3
"""
Zion Email Outreach Agent

Purpose:
- Reads lead data from PostgreSQL (`leads` table).
- Generates personalized email content using OpenAI GPT‑4.
- Sends each email via Google Workspace (gog CLI).
- Logs every action to Zion_Brain_Log.md.
- Supports batch sending and deduplication to avoid spamming.

Key Features:
1. **Lead Retrieval**: Pulls leads with status `unreached` and `score > 0.7`.
2. **Email Generation**: Uses a GPT‑4 prompt that includes company name, industry, contact name, title, and website.
3. **Sending**: Calls `gog mail send` (Google Workspace Gmail API) with `--to`, `--subject`, `--body`.
4. **Rate‑Limit Handling**: Sleeps 5 seconds between emails.
5. **Logging**: Each lead, generated email, and sending outcome is logged with timestamps.
6. **Error Handling**: Skips leads that already have an `outreach_id` in `outreach_log` table.

Configuration (via .env):
- `POSTGRES_HOST`, `POSTGRES_PORT`, `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`
- `SENDGRID_API_KEY` (optional, for fallback; not used if Gmail works)
- `GOG_TOKEN` (Google Workspace OAuth token) – placed in .env for CLI authentication.
- `EMAIL_SENTIMENT` (e.g., "friendly", "professional") – influences tone.

Run:
  python3 commands/zion_email_outreach_agent.py --limit 200

Dependencies:
- `python-dotenv`
- `psycopg2`
- `openai`
- `gog` (Google Workspace CLI)
"""
import os, json, logging, datetime, argparse, time, subprocess
from pathlib import Path
from typing import List, Dict, Any

import psycopg2
import openai
from dotenv import load_dotenv

WORKDIR = Path(os.environ.get("ZION_ROOT", str(Path(__file__).resolve().parent.parent)))
LOG_MD = WORKDIR / 'Zion_Brain_Log.md'
LOG_MD.parent.mkdir(parents=True, exist_ok=True)

# Load environment variables (including GOG_TOKEN, POSTGRES_*, OPENAI_API_KEY)
load_dotenv(WORKDIR / '.env')

def log(msg: str) -> None:
    ts = datetime.datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')
    with LOG_MD.open('a', encoding='utf-8') as f:
        f.write(f'- [{ts}] EmailOutreach: {msg}\n')

# Database connection helper
def db_conn():
    return psycopg2.connect(
        host=os.getenv('POSTGRES_HOST', 'localhost'),
        port=int(os.getenv('POSTGRES_PORT', '5432')),
        dbname=os.getenv('POSTGRES_DB', 'zion'),
        user=os.getenv('POSTGRES_USER', 'zion_user'),
        password=os.getenv('POSTGRES_PASSWORD', 'zion_secret')
    )

# OpenAI client
openai.api_key = os.getenv('OPENAI_API_KEY')

# Helper to run gog CLI
def send_email_via_gog(to_email: str, subject: str, body: str) -> bool:
    try:
        # gog expects a JSON payload via stdin; we'll use the CLI helper
        # Example: echo "{\"to\":\"${to}\",\"subject\":\"${subject}\",\"body\":\"${body}\"}" | gog mail send --stdin
        payload = {
            "to": to_email,
            "subject": subject,
            "body": body
        }
        result = subprocess.run([
            'gog', 'mail', 'send', '--stdin'],
            input=json.dumps(payload),
            check=True,
            text=True,
            capture_output=True,
            timeout=30
        )
        if result.returncode == 0:
            log(f'Sent email to {to_email} (subject: {subject})')
            return True
        else:
            log(f'Failed to send email to {to_email}: {result.stderr}')
            return False
    except Exception as e:
        log(f'Error sending email via gog: {e}')
        return False

# Prompt template for GPT‑4 email generation
def generate_email_content(lead: Dict[str, Any]) -> str:
    prompt = f"""You are a senior outbound marketer for Zion Tech Group. Write a concise, professional outreach email to {lead['first_name']} {lead['last_name']} at {lead['company_name']}.

Lead details:
- Industry: {lead.get('industry', '')}
- Company size: {lead.get('company_size', '')}
- Website: {lead.get('website', '')}
- Our value proposition: Zion provides AI‑powered automation tools for SaaS companies, reducing operational overhead by up to 40%.

Tone: {os.getenv('EMAIL_SENTIMENT', 'professional')}
Subject line: Please suggest a compelling subject.
Body: Keep it under 200 words, include a brief intro, mention the value proposition, propose a 15‑minute call, and include a polite CTA.
"""
    try:
        resp = openai.ChatCompletion.create(
            model='gpt-4',
            messages=[{'role': 'user', 'content': prompt}],
            temperature=0.5,
            max_tokens=300
        )
        return resp.choices[0].message.content.strip()
    except Exception as e:
        log(f'GPT‑4 email generation failed for {lead.get('email', 'no email')}: {e}')
        return """Dear Sir/Madam,\n\nI hope this message finds you well. I am reaching out because Zion Tech Group offers AI‑driven automation solutions that could help your company streamline operations.\n\nI would be happy to schedule a brief 15‑minute call to discuss how we can add value.\n\nBest regards,\nKleber"""

# Main workflow
def main(limit: int = 50) -> None:
    log('=== Email Outreach Agent started ===')
    # 1. Pull unreached high‑value leads
    conn = db_conn()
    cur = conn.cursor()
    cur.execute(
        """
        SELECT l.email, l.first_name, l.last_name, l.company_name, l.industry, l.company_size, l.website, l.score, l.raw_data
        FROM leads l
        LEFT JOIN outreach_log ol ON l.email = ol.recipient_email
        WHERE l.status = 'unreached' AND l.score >= 0.7 AND ol.outreach_id IS NULL;
        """
    )
    leads = cur.fetchall()
    cur.close()
    conn.close()
    log(f'Found {len(leads)} eligible leads')

    if not leads:
        log('No eligible leads to outreach – exiting')
        return

    # 2. Batch processing with rate‑limit
    batch_size = min(limit, len(leads))
    processed = 0
    for idx, lead in enumerate(leads[:batch_size]):
        # Skip leads already processed in this run
        email, first_name, last_name, company_name, industry, company_size, website, score, raw_data = lead

        if not email:
            log(f'Skipping lead with missing email – index {idx}')
            continue

        # Generate email
        email_body = generate_email_content({
            'email': email,
            'first_name': first_name,
            'last_name': last_name,
            'company_name': company_name,
            'industry': industry,
            'company_size': company_size,
            'website': website,
            'score': score
        })

        # Send via gog
        send_email_via_gog(email, os.getenv('EMAIL_SUBJECT', 'Introducing AI‑driven Automation for {company_name}'), email_body)

        # Track outreach
        conn = db_conn()
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO outreach_log (recipient_email, outreach_id, sent_at) VALUES (%s, %s, NOW()) RETURNING outreach_id;",
            (email, os.getenv('OUTREACH_TOKEN', None))
        )
        result = cur.fetchone()
        cur.close()
        conn.close()
        if result:
            processed += 1
            log(f'Processed lead {idx+1}/{batch_size}: {first_name} {last_name} ({email})')

        # Rate‑limit
        if idx < batch_size - 1:
            time.sleep(5)  # 5‑second pause between sends

    log(f'Email Outreach Agent finished – processed {processed} leads')
    log('=== Email Outreach Agent completed ===')

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Outreach leads via Google Workspace')
    parser.add_argument('--limit', type=int, default=50, help='Maximum number of leads to process')
    args = parser.parse_args()
    main(args.limit)"}