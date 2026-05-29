#!/usr/bin/env python3
"""Email Intelligence Engine v5.0 — Main Orchestrator"""
import json, sys, os, re, imaplib, email
from email.header import decode_header
from datetime import datetime, timezone, timedelta
from pathlib import Path

HOME = Path.home() / ".hermes"
CONFIG_FILE = HOME / "email-config" / "credentials.json"
OUTPUT_DIR = HOME / "email-drafts"
REPORT_DIR = HOME / "email-reports"
for d in [OUTPUT_DIR, REPORT_DIR]:
    d.mkdir(parents=True, exist_ok=True)

# Import our modules
sys.path.insert(0, str(Path(__file__).parent))
from email_memory import ConversationMemory
from email_nlp import analyze_sentiment, classify_intent, detect_reply_all, detect_follow_up

GMAIL_HOST = "imap.gmail.com"
GMAIL_PORT = 993

def connect_gmail():
    if not CONFIG_FILE.exists():
        print("❌ No credentials. Run: python3 email-v5.py --setup"); return None
    creds = json.loads(CONFIG_FILE.read_text())
    try:
        mail = imaplib.IMAP4_SSL(GMAIL_HOST, GMAIL_PORT)
        mail.login(creds["email"], creds.get("password", ""))
        return mail
    except Exception as e:
        print(f"❌ Auth failed: {e}"); return None

def fetch_emails(mail, limit=10):
    mail.select("INBOX")
    since = (datetime.now() - timedelta(days=30)).strftime("%d-%b-%Y")
    status, msgs = mail.search(None, f'(SINCE {since})')
    if status != "OK": return []
    eids = msgs[0].split()[-limit:]
    emails = []
    for eid in reversed(eids):
        status, data = mail.fetch(eid, "(RFC822)")
        if status != "OK": continue
        msg = email.message_from_bytes(data[0][1])
        subject = ""
        if msg["Subject"]:
            for part, enc in decode_header(msg["Subject"]):
                subject += part.decode(enc or "utf-8", errors="replace") if isinstance(part, bytes) else part
        from_addr = msg.get("From", "")
        m = re.match(r'^(.*?)\s*<(.+?)>$', from_addr)
        from_name = m.group(1).strip().strip('"') if m else from_addr
        from_email = m.group(2) if m else from_addr
        body = ""
        if msg.is_multipart():
            for part in msg.walk():
                if part.get_content_type() == "text/plain":
                    body = part.get_payload(decode=True).decode(part.get_content_charset() or "utf-8", errors="replace")[:2000]; break
        else:
            body = msg.get_payload(decode=True).decode(msg.get_content_charset() or "utf-8", errors="replace")[:2000]
        date_str = msg.get("Date", "")
        try: email_date = email.utils.parsedate_to_datetime(date_str) if date_str else datetime.now()
        except: email_date = datetime.now()
        emails.append({"id": eid.decode(), "from": from_email, "from_name": from_name or from_email,
            "to": msg.get("To",""), "cc": msg.get("Cc",""), "subject": subject, "body": body,
            "date": email_date.isoformat()})
    return emails

def generate_draft(email_data, memory: ConversationMemory):
    """Generate contextual draft using memory + NLP + relationship awareness."""
    sender = email_data["from"]
    ctx = memory.get_sender_context(sender)
    tier = memory.get_relationship_tier(sender)
    intent_data = classify_intent(email_data["body"], email_data["subject"])
    sentiment_data = analyze_sentiment(email_data["body"])
    reply_all_result = detect_reply_all(email_data)
    followup = detect_follow_up(email_data["body"])
    
    intent = intent_data["intent"]
    name = email_data.get("from_name", "there").split()[0]
    subj = email_data.get("subject", "Your Inquiry")
    
    # Greeting based on relationship
    if ctx["known"] and ctx["score"] > 0.5:
        greeting = f"Hi {name},"
    elif ctx["known"]:
        greeting = f"Hello {name},"
    else:
        greeting = f"Hi {name},"
    
    # Tone adjustment based on sentiment
    tone_note = sentiment_data["tone_recommendation"]
    if sentiment_data["should_escalate"]:
        tone_note = "⚠️ ESCALATE — " + tone_note
    
    # Build draft based on intent
    drafts = {
        "sales_inquiry": f"{greeting}\n\nThank you for your interest. Based on your inquiry, I'd love to learn more about your specific needs.\n\nWhat we offer:\n• Custom AI/IT solutions tailored to your requirements\n• Flexible pricing from $9/mo to enterprise deployments\n• Free consultation and architecture review\n• 24/7 support with 99.9% SLA\n\nWould you be available for a 15-minute call this week?\n\nBest regards,\nKleber Garcia Alcatrão\nCEO, Zion Tech Group\n📧 kleber@ziontechgroup.com\n📞 +1 302 464 0950",
        "support_request": f"{greeting}\n\nThank you for reaching out. I've prioritized your issue and flagged it for immediate review.\n\nNext steps:\n1. Our technical team is reviewing this now\n2. Initial assessment within 4 hours\n3. Dedicated engineer assigned if needed\n\nFor urgent issues, call +1 302 464 0950 directly.\n\nBest regards,\nKleber Garcia Alcatrão",
        "partnership": f"{greeting}\n\nThank you for your interest in partnering with Zion Tech Group. We're always looking for strategic partners.\n\nOur programs include: Reseller partnerships, White-label solutions, Technology integration, Co-marketing.\n\nLet's schedule a call to explore mutual value. What's your availability?\n\nBest regards,\nKleber Garcia Alcatrão",
        "complaint": f"{greeting}\n\nI'm sorry to hear about your experience. At Zion Tech Group, we take every concern seriously.\n\nI've personally flagged this for immediate review:\n1. Investigating the issue\n2. Dedicated resolution specialist assigned\n3. Follow-up within 24 hours with action plan\n\nCall me directly at +1 302 464 0950.\n\nBest regards,\nKleber Garcia Alcatrão",
    }
    
    body = drafts.get(intent, f"{greeting}\n\nThank you for reaching out to Zion Tech Group.\n\nI've received your message about \"{subj}\" and will review it carefully. How can we best help you?\n\nExplore 1168+ services at https://zion-support.github.io\n\nBest regards,\nKleber Garcia Alcatrão\n📧 kleber@ziontechgroup.com\n📞 +1 302 464 0950")
    
    priority_signals = sum(1 for k,v in intent_data.get("scores", {}).items() if v > 0)
    if "urgent" in email_data["body"].lower() or "critical" in email_data["body"].lower():
        priority = "urgent"
    elif intent in ("sales_inquiry", "partnership"):
        priority = "high"
    elif intent in ("support_request", "complaint"):
        priority = "high"
    else:
        priority = "medium"
    
    action_map = {
        "sales_inquiry": "Reply with Proposal", "support_request": "Reply with Support",
        "partnership": "Reply with Partnership Info", "complaint": "Escalate + Reply",
        "meeting_request": "Reply with Calendar", "job_inquiry": "Reply with HR",
        "media_press": "Reply with Media Kit", "information_request": "Reply with Capabilities",
        "thank_you": "Reply Warmly", "spam": "Archive",
    }
    
    return {
        "subject": f"Re: {subj}",
        "body": body,
        "intent": intent, "intent_confidence": intent_data["confidence"],
        "sentiment": sentiment_data["primary"], "tone": tone_note,
        "priority": priority,
        "relationship_tier": tier, "sender_known": ctx["known"],
        "reply_all": reply_all_result["reply_all"],
        "action": action_map.get(intent, "Review Manually"),
        "needs_followup": followup["needed"], "followup_days": followup["days"],
    }

def run_demo():
    """Run demo with sample emails."""
    memory = ConversationMemory()
    
    demo_emails = [
        {"from": "john.smith@enterprise.com", "from_name": "John Smith",
         "subject": "RFP: AI Document Processing — Enterprise Deployment",
         "body": "Hi Kleber, We're evaluating AI document processing solutions. Our budget is approved for $50K-$100K annually. Can you provide a proposal by Friday? Our CTO Jane Doe is copied on this email. Best, John Smith VP of Technology, Enterprise Corp"},
        {"from": "sarah.jones@startup.io", "from_name": "Sarah Jones",
         "subject": "Urgent: Production API Down — Need Immediate Help",
         "body": "Kleber, Our production API is down and we're losing $10K/hour. We think it's a database connection issue. This is critical — we need help ASAP. Sarah CTO, Startup.io"},
        {"from": "angry.customer@client.com", "from_name": "Robert Williams",
         "subject": "Complaint: Service Not as Described — Want Refund",
         "body": "Kleber, I'm extremely disappointed with the service we received. The AI model accuracy is nowhere near what was promised. We've wasted 3 months and $25K. I want a full refund or I'm taking legal action. This is unacceptable. Robert Williams CEO, Client Corp"},
        {"from": "reporter@technews.com", "from_name": "Emily Chen",
         "subject": "Interview Request: AI Industry Trends Article",
         "body": "Hi Kleber, I'm a reporter at TechNews working on an article about AI industry trends. Would you be available for a 30-minute interview? The article publishes next Friday. Best, Emily Chen Senior Reporter, TechNews"},
        {"from": "mike.partner@bigtech.com", "from_name": "Mike Johnson",
         "subject": "Partnership Opportunity — White-Label AI Services",
         "body": "Hi Kleber, I lead partnerships at BigTech. We're looking for AI service providers to white-label for our enterprise clients. Are you available for a call next week? Best, Mike Johnson Head of Partnerships, BigTech Inc."},
    ]
    
    print("=" * 70)
    print("  ZION TECH GROUP — Email Intelligence Engine v5.0 Demo")
    print("=" * 70)
    
    results = []
    for i, em in enumerate(demo_emails, 1):
        # Record in memory first (simulating prior interactions)
        memory.record_email(em["from"], em["from_name"], em["subject"],
                           "general", "medium", "neutral", "processed")
        
        draft = generate_draft(em, memory)
        results.append({"email": em, "draft": draft})
        
        tier = draft["relationship_tier"]
        tier_icon = {"vip":"⭐","trusted":"🔵","familiar":"🟢","acquaintance":"🟡","new":"⚪"}[tier]
        
        print(f"\n{'─'*70}")
        print(f"  EMAIL {i}/{len(demo_emails)}")
        print(f"{'─'*70}")
        print(f"  From:     {em['from_name']} <{em['from']}>")
        print(f"  Subject:  {em['subject'][:60]}")
        memory_ctx = memory.get_sender_context(em["from"])
        print(f"  Memory:   {tier_icon} {tier} ({'known' if memory_ctx['known'] else 'new'})")
        print(f"  Intent:   {draft['intent']} ({draft['intent_confidence']*100:.0f}% confidence)")
        print(f"  Sentiment: {draft['sentiment']} — {draft['tone'][:40]}")
        print(f"  Priority: {draft['priority'].upper()}")
        print(f"  Action:   {draft['action']}")
        if draft['reply_all']:
            print(f"  📨 Reply-All: DETECTED")
        if draft['needs_followup']:
            print(f"  📅 Follow-up in {draft['followup_days']} day(s)")
        print(f"\n  Draft Preview:")
        for line in draft['body'][:4]:
            print(f"    {line[:65]}")
    
    # Show memory stats
    stats = memory.get_stats()
    print(f"\n{'='*70}")
    print(f"  SESSION MEMORY STATS")
    print(f"{'='*70}")
    print(f"  Conversations tracked: {stats['conversations']}")
    print(f"  Emails processed: {stats['emails']}")
    for name, count, score in stats['top']:
        print(f"  • {name[:30]:30} {count} emails (score: {score})")
    
    memory.close()
    return results

def run_setup():
    """Interactive Gmail setup wizard."""
    print("=" * 70)
    print("  Email v5.0 — Gmail Setup Wizard")
    print("=" * 70)
    print("\n  You need a Gmail App Password.")
    print("  1. Go to https://myaccount.google.com/security")
    print("  2. Enable 2-Step Verification")
    print("  3. Go to https://myaccount.google.com/apppasswords")
    print("  4. Select 'Mail' → generate → copy password\n")
    
    email_addr = input("  Your Gmail address: ").strip()
    if not email_addr:
        print("❌ No email provided."); return
    
    password = input("  Gmail App Password: ").strip().replace(" ", "")
    creds = {"email": email_addr, "password": password, "configured_at": datetime.now(timezone.utc).isoformat()}
    CONFIG_FILE.parent.mkdir(parents=True, exist_ok=True)
    CONFIG_FILE.write_text(json.dumps(creds, indent=2))
    print(f"\n  ✅ Saved to {CONFIG_FILE}")
    
    print("  Testing connection...")
    mail = connect_gmail()
    if mail:
        mail.select("INBOX")
        s, m = mail.search(None, "ALL")
        count = len(m[0].split()) if s == "OK" else 0
        print(f"  ✅ Connected! Inbox: {count} emails")
        mail.logout()
    else:
        print("  ❌ Connection failed. Check credentials.")

if __name__ == "__main__":
    if "--setup" in sys.argv:
        run_setup()
    elif "--demo" in sys.argv or len(sys.argv) == 1:
        run_demo()
    elif "--inbox" in sys.argv:
        limit = int(sys.argv[sys.argv.index("--inbox")+1]) if sys.argv.index("--inbox")+1 < len(sys.argv) else 10
        mail = connect_gmail()
        if not mail: sys.exit(1)
        emails = fetch_emails(mail, limit)
        mail.close()
        memory = ConversationMemory()
        print(f"\n📬 Processing {len(emails)} emails with v5 intelligence...\n")
        for em in emails:
            memory.record_email(em["from"], em["from_name"], em["subject"], "general", "medium", "neutral", "processed")
            draft = generate_draft(em, memory)
            print(f"  [{draft['priority'].upper()}] {em['from_name'][:25]:25} | {em['subject'][:40]}")
            print(f"    Intent: {draft['intent']} | Sentiment: {draft['sentiment']} | Action: {draft['action']}")
        memory.close()
    elif "--stats" in sys.argv:
        memory = ConversationMemory()
        stats = memory.get_stats()
        print(f"\n📊 Email Memory Stats")
        print(f"  Conversations: {stats['conversations']}")
        print(f"  Emails: {stats['emails']}")
        for name, count, score in stats['top']:
            print(f"  • {name[:30]:30} {count} emails (score: {score})")
        memory.close()
    else:
        print(__doc__)
