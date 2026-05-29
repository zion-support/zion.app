#!/usr/bin/env python3
"""
Zion Tech Group — Email Intelligence Engine v4.0
=================================================
Gmail Setup Guide + Live Email Processor

This script helps you configure Gmail access for the AI email responder.
It supports two methods:
  1. Gmail App Password (recommended for Termux)
  2. Gmail OAuth2 (more secure, requires browser)

Usage:
  python3 email-v4.py --setup     Run interactive setup wizard
  python3 email-v4.py --check     Check if credentials are configured
  python3 email-v4.py --inbox [N]  Process N recent emails
  python3 email-v4.py --demo      Run demo with sample emails
  python3 email-v4.py --cron      Run as cron (process + generate report)
"""

import json
import sys
import os
import re
import subprocess
import imaplib
import email
from email.header import decode_header
from datetime import datetime, timezone, timedelta
from pathlib import Path
from typing import Optional, Tuple, List

# ── Configuration ──────────────────────────────────────────────────────────
CONFIG_DIR = Path.home() / ".hermes" / "email-config"
CONFIG_DIR.mkdir(parents=True, exist_ok=True)
CONFIG_FILE = CONFIG_DIR / "credentials.json"
OUTPUT_DIR = Path.home() / "/.hermes" / "email-drafts"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
STATE_FILE = CONFIG_DIR / "processed-emails.json"

GMAIL_IMAP_HOST = "imap.gmail.com"
GMAIL_IMAP_PORT = 993

# ── Gmail IMAP Connection ──────────────────────────────────────────────────

def connect_to_gmail() -> Optional[imaplib.IMAP4_SSL]:
    """Connect to Gmail IMAP using stored credentials."""
    if not CONFIG_FILE.exists():
        print("❌ No credentials found. Run: python3 email-v4.py --setup")
        return None
    
    with open(CONFIG_FILE) as f:
        creds = json.load(f)
    
    email_addr = creds.get("email", "")
    password = creds.get("password", "")
    oauth_token = creds.get("oauth_token", "")
    
    try:
        mail = imaplib.IMAP4_SSL(GMAIL_IMAP_HOST, GMAIL_IMAP_PORT)
        if oauth_token:
            # OAuth2 authentication
            auth_string = f"user={email_addr}\x01auth=Bearer {oauth_token}\x01\x01"
            mail.authenticate('XOAUTH2', lambda x: auth_string.encode())
        else:
            # App Password authentication
            mail.login(email_addr, password)
        return mail
    except imaplib.IMAP4.error as e:
        print(f"❌ Gmail authentication failed: {e}")
        print("   Check your credentials or generate a new App Password.")
        return None
    except Exception as e:
        print(f"❌ Connection error: {e}")
        return None


def fetch_recent_emails(mail: imaplib.IMAP4_SSL, limit: int = 10) -> List[dict]:
    """Fetch recent emails from INBOX."""
    mail.select("INBOX")
    
    # Search for emails from the last 30 days
    since_date = (datetime.now() - timedelta(days=30)).strftime("%d-%b-%Y")
    status, messages = mail.search(None, f'(SINCE {since_date})')
    
    if status != "OK":
        print(f"⚠️ Search failed: {status}")
        return []
    
    email_ids = messages[0].split()
    email_ids = email_ids[-limit:]  # Get most recent
    
    emails = []
    for eid in reversed(email_ids):
        status, msg_data = mail.fetch(eid, "(RFC822)")
        if status != "OK":
            continue
        
        raw_email = msg_data[0][1]
        msg = email.message_from_bytes(raw_email)
        
        # Decode subject
        subject = ""
        if msg["Subject"]:
            decoded = decode_header(msg["Subject"])
            for part, encoding in decoded:
                if isinstance(part, bytes):
                    subject += part.decode(encoding or "utf-8", errors="replace")
                else:
                    subject += part
        
        # Decode sender
        from_addr = msg.get("From", "")
        from_name = ""
        from_email = ""
        match = re.match(r'^(.*?)\s*<(.+?)>$', from_addr)
        if match:
            from_name = match.group(1).strip().strip('"')
            from_email = match.group(2)
        else:
            from_email = from_addr
        
        # Get body
        body = ""
        if msg.is_multipart():
            for part in msg.walk():
                if part.get_content_type() == "text/plain":
                    charset = part.get_content_charset() or "utf-8"
                    body = part.get_payload(decode=True).decode(charset, errors="replace")
                    break
        else:
            charset = msg.get_content_charset() or "utf-8"
            body = msg.get_payload(decode=True).decode(charset, errors="replace")
        
        # Get date
        date_str = msg.get("Date", "")
        try:
            email_date = email.utils.parsedate_to_datetime(date_str) if date_str else datetime.now()
        except:
            email_date = datetime.now()
        
        # Get CC
        cc = msg.get("Cc", "")
        to = msg.get("To", "")
        
        emails.append({
            "id": eid.decode(),
            "from": from_email,
            "from_name": from_name or from_email,
            "to": to,
            "cc": cc,
            "subject": subject,
            "body": body[:2000],  # Limit body size
            "date": email_date.isoformat(),
            "headers": dict(msg.items()),
        })
    
    return emails


# ── Self-Improving Feedback Loop ────────────────────────────────────────────

def load_feedback_history() -> dict:
    """Load feedback history for self-improvement."""
    if STATE_FILE.exists():
        with open(STATE_FILE) as f:
            return json.load(f)
    return {"processed": [], "feedback": [], "improvements": {}}


def save_feedback_history(history: dict):
    """Save feedback history."""
    with open(STATE_FILE, "w") as f:
        json.dump(history, f, indent=2)


def record_feedback(email_id: str, action_taken: str, was_correct: bool, notes: str = ""):
    """Record user feedback to improve future responses."""
    history = load_feedback_history()
    history["feedback"].append({
        "email_id": email_id,
        "action": action_taken,
        "correct": was_correct,
        "notes": notes,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    })
    
    # Track improvement patterns
    if not was_correct:
        intent = notes.split(":")[0] if ":" in notes else "unknown"
        if intent not in history["improvements"]:
            history["improvements"][intent] = {"count": 0, "corrections": []}
        history["improvements"][intent]["count"] += 1
        history["improvements"][intent]["corrections"].append(notes)
    
    save_feedback_history(history)
    print(f"✅ Feedback recorded for {email_id}")


# ── Enhanced Sentiment Analysis ─────────────────────────────────────────────

def analyze_sentiment_advanced(text: str) -> dict:
    """
    Advanced sentiment analysis detecting 10+ emotional states.
    Works offline — no API needed.
    """
    text_lower = text.lower()
    
    SENTIMENT_PATTERNS = {
        "frustrated": [r"frustrat", r"annoyed", r"angry", r"furious", r"outraged", r"fed up", r"tired of", r"sick of"],
        "urgent": [r"urgent", r"asap", r"immediately", r"emergency", r"critical", r"deadline", r"today", r"right now"],
        "excited": [r"excited", r"thrilled", r"love", r"amazing", r"fantastic", r"great news", r"congratulations"],
        "confused": [r"confused", r"unclear", r"don't understand", r"what do you mean", r"clarify", r"explain"],
        "sarcastic": [r"thanks a lot", r"yeah right", r"sure thing", r"oh great", r"just wonderful", r"how nice"],
        "grateful": [r"thank you", r"thanks", r"appreciate", r"grateful", r"helpful", r"wonderful service"],
        "disappointed": [r"disappointed", r"expected better", r"not satisfied", r"let down", r"underwhelmed"],
        "threatening": [r"lawsuit", r"legal action", r"sue", r"report to", r"cancel.*account", r"refund.*now"],
        "negotiating": [r"discount", r"better price", r"competitor", r"cheaper", r"deal", r"offer"],
        "inquiring": [r"interested", r"looking for", r"need", r"want to know", r"question", r"information"],
    }
    
    detected = {}
    for sentiment, patterns in SENTIMENT_PATTERNS.items():
        score = 0
        for pattern in patterns:
            matches = len(re.findall(pattern, text_lower))
            score += matches
        if score > 0:
            detected[sentiment] = score
    
    # Determine primary sentiment
    if detected:
        primary = max(detected, key=detected.get)
        confidence = min(detected[primary] / 3, 1.0)
    else:
        primary = "neutral"
        confidence = 0.5
    
    # Calculate overall tone
    positive_signals = detected.get("excited", 0) + detected.get("grateful", 0)
    negative_signals = detected.get("frustrated", 0) + detected.get("threatening", 0) + detected.get("disappointed", 0)
    
    if positive_signals > negative_signals:
        tone = "positive"
    elif negative_signals > positive_signals:
        tone = "negative"
    else:
        tone = "neutral"
    
    # Response tone recommendation
    TONE_RECOMMENDATIONS = {
        "frustrated": "Empathetic and solution-focused. Acknowledge frustration first.",
        "urgent": "Immediate and action-oriented. Short, direct response.",
        "excited": "Enthusiastic and warm. Match their energy.",
        "confused": "Patient and clear. Use simple language, numbered steps.",
        "sarcastic": "Professional and direct. Don't mirror sarcasm.",
        "grateful": "Warm and appreciative. Acknowledge their thanks.",
        "disappointed": "Empathetic with concrete improvement plan.",
        "threatening": "Calm, professional, and escalate immediately.",
        "negotiating": "Value-focused with flexible options.",
        "inquiring": "Informative and helpful with clear next steps.",
        "neutral": "Professional and friendly standard tone.",
    }
    
    return {
        "primary_sentiment": primary,
        "confidence": round(confidence, 2),
        "tone": tone,
        "all_detected": detected,
        "recommended_tone": TONE_RECOMMENDATIONS.get(primary, "Professional and friendly"),
        "should_escalate": primary in ["frustrated", "threatening"] and confidence > 0.5,
    }


# ── Follow-up Detection ────────────────────────────────────────────────────

def detect_follow_up_needed(email_data: dict) -> dict:
    """Determine if a follow-up is needed and when."""
    text = f"{email_data.get('subject', '')} {email_data.get('body', '')}".lower()
    
    # Signals that indicate follow-up needed
    FOLLOWUP_SIGNALS = {
        "waiting_response": [r"waiting for", r"looking forward to", r"let me know", r"please confirm", r"waiting on"],
        "deadline": [r"by friday", r"by monday", r"by end of", r"deadline", r"due by", r"need this by"],
        "meeting_request": [r"schedule a", r"book a call", r"set up a meeting", r"available for"],
        "proposal_sent": [r"proposal", r"estimate", r"quote", r"pricing", r"bid"],
    }
    
    needs_followup = False
    followup_type = "none"
    followup_date = None
    
    for ftype, patterns in FOLLOWUP_SIGNALS.items():
        for pattern in patterns:
            if re.search(pattern, text):
                needs_followup = True
                followup_type = ftype
                break
    
    if needs_followup:
        # Calculate follow-up date based on type
        if followup_type == "deadline":
            followup_date = (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d")
        elif followup_type == "waiting_response":
            followup_date = (datetime.now() + timedelta(days=2)).strftime("%Y-%-%m-%d")
        elif followup_type == "meeting_request":
            followup_date = (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d")
        elif followup_type == "proposal_sent":
            followup_date = (datetime.now() + timedelta(days=3)).strftime("%Y-%m-%d")
    
    return {
        "needs_followup": needs_followup,
        "followup_type": followup_type,
        "followup_date": followup_date,
        "auto_reminder": needs_followup,
    }


# ── Setup Wizard ───────────────────────────────────────────────────────────

def run_setup_wizard():
    """Interactive Gmail setup wizard."""
    print("=" * 70)
    print("  ZION TECH GROUP — Email Intelligence Engine v4.0 Setup")
    print("=" * 70)
    print()
    print("  This wizard configures Gmail access for the AI email responder.")
    print()
    print("  ⚠️  IMPORTANT: You need a Gmail App Password.")
    print("  To create one:")
    print("  1. Go to https://myaccount.google.com/security")
    print("  2. Enable 2-Step Verification if not already on")
    print("  3. Go to https://myaccount.google.com/apppasswords")
    print("  4. Select 'Mail' and your device")
    print("  5. Copy the 16-character password")
    print()
    
    email_addr = input("  Your Gmail address: ").strip()
    if not email_addr:
        print("❌ No email provided. Exiting.")
        return
    
    password = input("  Gmail App Password (16 chars, no spaces): ").strip().replace(" ", "")
    
    creds = {
        "email": email_addr,
        "password": password,
        "configured_at": datetime.now(timezone.utc).isoformat(),
        "method": "app_password",
    }
    
    with open(CONFIG_FILE, "w") as f:
        json.dump(creds, f, indent=2)
    
    print(f"\n  ✅ Credentials saved to {CONFIG_FILE}")
    print("  Testing connection...")
    
    mail = connect_to_gmail()
    if mail:
        mail.select("INBOX")
        print("  ✅ Connected to Gmail successfully!")
        
        # Count emails
        status, messages = mail.search(None, "ALL")
        if status == "OK":
            count = len(messages[0].split())
            print(f"  📬 Your inbox has {count} emails")
        
        mail.logout()
        print("\n  🎉 Setup complete! You can now run:")
        print("     python3 email-v4.py --inbox 10")
    else:
        print("  ❌ Connection failed. Check your credentials and try again.")


# ── Main Entry Point ────────────────────────────────────────────────────────

if __name__ == "__main__":
    if "--setup" in sys.argv:
        run_setup_wizard()
    elif "--check" in sys.argv:
        if CONFIG_FILE.exists():
            with open(CONFIG_FILE) as f:
                creds = json.load(f)
            print(f"✅ Configured for: {creds.get('email', 'unknown')}")
            mail = connect_to_gmail()
            if mail:
                print("✅ Connection successful!")
                mail.logout()
            else:
                print("❌ Connection failed")
        else:
            print("❌ Not configured. Run: python3 email-v4.py --setup")
    elif "--inbox" in sys.argv:
        limit = 10
        if "--inbox" in sys.argv:
            idx = sys.argv.index("--inbox")
            if idx + 1 < len(sys.argv):
                try:
                    limit = int(sys.argv[idx + 1])
                except ValueError:
                    pass
        
        mail = connect_to_gmail()
        if not mail:
            sys.exit(1)
        
        emails = fetch_recent_emails(mail, limit)
        mail.logout()
        
        print(f"\n📬 Fetched {len(emails)} emails\n")
        for i, em in enumerate(emails, 1):
            sentiment = analyze_sentiment_advanced(em["body"])
            followup = detect_follow_up_needed(em)
            print(f"  {i}. [{em['from_name']}] {em['subject'][:60]}")
            print(f"     Sentiment: {sentiment['primary_sentiment']} (tone: {sentiment['recommended_tone'][:40]})")
            if followup["needs_followup"]:
                print(f"     📅 Follow-up needed: {followup['followup_date']}")
            print()
        
        # Save for cron processing
        with open(OUTPUT_DIR / f"inbox-{datetime.now().strftime('%Y%m%d-%H%M%S')}.json", "w") as f:
            json.dump(emails, f, indent=2, default=str)
    elif "--feedback" in sys.argv:
        # Record feedback: --feedback <email_id> <action> <correct> [notes]
        if len(sys.argv) < 5:
            print("Usage: python3 email-v4.py --feedback <email_id> <action> <correct:true|false> [notes]")
            sys.exit(1)
        email_id = sys.argv[2]
        action = sys.argv[3]
        correct = sys.argv[4].lower() == "true"
        notes = " ".join(sys.argv[5:]) if len(sys.argv) > 5 else ""
        record_feedback(email_id, action, correct, notes)
    elif "--stats" in sys.argv:
        history = load_feedback_history()
        total = len(history.get("processed", []))
        feedback = len(history.get("feedback", []))
        improvements = history.get("improvements", {})
        print(f"\n📊 Email Responder Statistics")
        print(f"   Processed: {total}")
        print(f"   Feedback entries: {feedback}")
        print(f"   Improvement areas: {len(improvements)}")
        for intent, data in improvements.items():
            print(f"     - {intent}: {data['count']} corrections")
    else:
        print(__doc__)
