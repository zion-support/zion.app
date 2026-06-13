#!/usr/bin/env python3
"""
Email Auto-Responder System v2 — Zion Tech Group
==================================================
Uses direct Gmail API (no gog CLI dependency).
Classifies unread emails, selects reply templates, sends responses.

Usage:
    python3 email_responder_v2.py          # dry-run (default)
    python3 email_responder_v2.py --send    # actually send replies
    python3 email_responder_v2.py --send --max-emails 5
    python3 email_responder_v2.py --verbose
    python3 email_responder_v2.py --json-output
"""
import argparse, json, logging, os, re, sys, base64, urllib.request, urllib.parse, urllib.error
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

# ── Paths & Constants ──────────────────────────────────────────────────────
HOME = os.environ.get("HOME", "")
TOKEN_FILE = Path(HOME + "/.openclaw/workspace/gog_tokens.json")
TEMPLATES_FILE = Path(HOME + "/data/outreach/templates.json")
LOG_FILE = Path(HOME + "/data/email_responder_v2_log.json")
STATE_FILE = Path(HOME + "/data/email_responder_v2_state.json")
GMAIL_API = "https://gmail.googleapis.com/gmail/v1/users/me"

SENDER_EMAIL = "kleber@ziontechgroup.com"
SENDER_NAME = "Kleber Garcia Alcatrao"
COMPANY_NAME = "Zion Tech Group"

# ── Categories ─────────────────────────────────────────────────────────────
CAT_LEAD = "lead"
CAT_CUSTOMER = "customer_inquiry"
CAT_PARTNERSHIP = "partnership"
CAT_SPAM = "spam"
CAT_OTHER = "other"
CAT_REVIEW = "human_review"

# ── Spam / noise indicators ────────────────────────────────────────────────
SPAM_SENDERS = [
    "mailer-daemon@", "postmaster@", "delivery@", "notifications@github.com",
    "alerts+noreply@", "noreply@", "no-reply@", "donotreply@", "automated@airbnb.com",
    "sellersupport@shop.tiktok.com", "no-reply@deriv.com", "newsletter@",
    "marketing@", "promotions@", "info@intercom-mail.com",
    "notification@service.tiktok.com", "system-sg@notice.alibabacloud.com",
]
SPAM_SUBJECT_PATTERNS = [
    r"^\[?(spam|promo|sale|discount|offer|coupon|deal|limited time)",
    r"(you('ve| have) won|congratulations|claim your prize)",
    r"(act now|expires? (today|soon)|last chance|final reminder)",
    r"(unsubscribe|manage preferences|email preferences)",
    r"(delivery status|undeliverable|message not delivered)",
    r"Run (failed|passed|error)",
    r"\[Zion-support/",
    r"(Lighthouse|CI\/CD|workflow|build)\b",
    r"(started following you|following you|new follower)",
]

# ── Auto-archive senders (mark read + remove from inbox) ────────────────────
AUTO_ARCHIVE_SENDERS = [
    "notifications@github.com",
]

# ── Classification rules ───────────────────────────────────────────────────
CLASSIFICATION_RULES: Dict[str, List[str]] = {
    CAT_LEAD: [
        "interested in", "learn more", "pricing", "quote", "proposal",
        "demo", "demonstration", "how much", "cost", "budget",
        "evaluate", "evaluation", "pilot", "proof of concept", "poc",
        "schedule a call", "book a meeting", "talk to someone",
        "sales", "get started", "sign up", "trial",
        "ai solution", "automation", "machine learning",
        "artificial intelligence", "chatbot", "ai tool",
    ],
    CAT_CUSTOMER: [
        "support", "help", "issue", "problem", "bug", "error",
        "broken", "not working", "troubleshoot", "fix",
        "refund", "cancel", "subscription", "account",
        "how do i", "how to", "question about",
        "feature request", "feedback", "complaint",
        "invoice", "billing", "payment", "charge",
    ],
    CAT_PARTNERSHIP: [
        "partner", "partnership", "collaborate", "collaboration",
        "reseller", "affiliate", "integration", "joint venture",
        "strategic alliance", "co-develop", "co-market",
        "white label", "white-label", "revenue share",
        "referral program", "technology partner",
    ],
}

TEMPLATE_MAP: Dict[str, str] = {
    CAT_LEAD: "proposal-ready",
    CAT_CUSTOMER: "free-audit",
    CAT_PARTNERSHIP: "proposal-ready",
    CAT_OTHER: "free-audit",
    CAT_REVIEW: "free-audit",  # gentle auto-reply for unclear emails
    CAT_SPAM: "",
}

# ── Industry detection for smart template selection ─────────────────────────
INDUSTRY_TEMPLATE_MAP: Dict[str, str] = {
    "healthcare": "intro-ai-healthcare",
    "fintech": "intro-fintech",
    "retail": "intro-retail",
    "edtech": "intro-edtech",
    "logistics": "intro-logistics",
}

INDUSTRY_KEYWORDS: Dict[str, List[str]] = {
    "healthcare": ["health", "medical", "patient", "clinical", "hospital", "hipaa", "doctor", "healthcare"],
    "fintech": ["financial", "banking", "fintech", "payment", "fraud", "credit", "trading", "invest"],
    "retail": ["retail", "ecommerce", "e-commerce", "shop", "store", "product", "merchant"],
    "edtech": ["education", "edtech", "learning", "student", "school", "university", "course"],
    "logistics": ["logistics", "supply chain", "shipping", "warehouse", "delivery", "freight"],
}

def detect_industry(subject: str, body: str) -> str:
    """Detect industry from email content. Returns industry key or 'universal'."""
    combined = (subject + " " + body).lower()
    for industry, keywords in INDUSTRY_KEYWORDS.items():
        if any(kw in combined for kw in keywords):
            return industry
    return "universal"

def select_template(category: str, industry: str, templates: Dict) -> str:
    """Select best template based on category + detected industry."""
    # Try industry-specific first
    if industry != "universal":
        tpl_id = INDUSTRY_TEMPLATE_MAP.get(industry)
        if tpl_id and tpl_id in templates:
            return tpl_id
    # Fall back to category default
    tpl_id = TEMPLATE_MAP.get(category, "free-audit")
    if tpl_id and tpl_id in templates:
        return tpl_id
    # Last resort: any available template
    return "free-audit"

# ── Blocked senders (never auto-reply) ─────────────────────────────────────
BLOCKED_SENDERS = [
    "kleber@ziontechgroup.com",  # don't reply to ourselves
    "support@retellai.com",      # already handled manually
    "contact@stammer.ai",        # already handled manually
    "partners+noreply@datadoghq.com",  # already handled manually
    "fin@pictory.intercom-mail.com",   # already handled manually
    "joao.marcos@awazai.intercom-mail.com",  # already handled manually
    "support@cartesia.ai",       # already handled manually
    "mmcguinness@rafay.co",      # already handled manually
    "devon@raynmaker.ai",        # already handled manually
    "contact@pathors.com",       # already handled manually
    "contact@botpenguin.com",    # already handled manually
    "aline.garcia@sinaia.com.br", # already handled manually
]

# ── Logging ────────────────────────────────────────────────────────────────
def setup_logging(verbose=False):
    logger = logging.getLogger("email_responder_v2")
    logger.setLevel(logging.DEBUG if verbose else logging.INFO)
    ch = logging.StreamHandler(sys.stdout)
    ch.setLevel(logging.DEBUG if verbose else logging.INFO)
    fmt = logging.Formatter("%(asctime)s [%(levelname)-7s] %(message)s", datefmt="%Y-%m-%d %H:%M:%S")
    ch.setFormatter(fmt)
    logger.addHandler(ch)
    return logger

def now_iso():
    return datetime.now(timezone.utc).isoformat()

# ── Token management ───────────────────────────────────────────────────────
def load_tokens():
    if not TOKEN_FILE.exists():
        print("ERROR: Token file not found: " + str(TOKEN_FILE), file=sys.stderr)
        sys.exit(2)
    with open(TOKEN_FILE) as f:
        return json.load(f)

def get_access_token():
    tokens = load_tokens()
    access = tokens.get("access_token", "")
    if not access:
        print("ERROR: No access token in token file", file=sys.stderr)
        sys.exit(2)
    return access

def api_request(url, headers, method="GET", data=None, timeout=15):
    """Make a Gmail API request. Returns parsed JSON or raises."""
    req = urllib.request.Request(url, method=method)
    for k, v in headers.items():
        req.add_header(k, v)
    if data:
        req.data = json.dumps(data).encode("utf-8")
    try:
        resp = urllib.request.urlopen(req, timeout=timeout)
        return json.loads(resp.read())
    except urllib.error.HTTPError as e:
        body = e.read().decode(errors="replace")
        raise Exception("HTTP " + str(e.code) + ": " + body[:300])

# ── Gmail API helpers ──────────────────────────────────────────────────────
def fetch_unread_emails(max_emails, logger):
    """Fetch unread emails via Gmail API."""
    access = get_access_token()
    headers = {"Authorization": "Bearer " + access, "Accept": "application/json"}

    # List unread messages
    url = GMAIL_API + "/messages?q=is:unread+newer_than:1d&maxResults=" + str(max_emails)
    result = api_request(url, headers)
    msg_ids = result.get("messages", [])
    logger.info("Found %d unread message(s)", len(msg_ids))

    messages = []
    for m in msg_ids:
        mid = m["id"]
        # Get full message with body
        msg_url = GMAIL_API + "/messages/" + mid + "?format=full"
        try:
            full = api_request(msg_url, headers)
            messages.append(full)
        except Exception as e:
            logger.warning("Failed to fetch message %s: %s", mid, e)

    return messages

def extract_body(payload):
    """Extract text body from message payload."""
    if not payload:
        return ""
    # Try text/plain first
    if payload.get("mimeType") == "text/plain" and payload.get("body", {}).get("data"):
        return base64.urlsafe_b64decode(payload["body"]["data"]).decode("utf-8", errors="replace")
    # Try text/html
    if payload.get("mimeType") == "text/html" and payload.get("body", {}).get("data"):
        html = base64.urlsafe_b64decode(payload["body"]["data"]).decode("utf-8", errors="replace")
        return re.sub(r"<[^>]+>", " ", html)
    # Recurse into parts
    for part in payload.get("parts", []):
        body = extract_body(part)
        if body:
            return body
    return ""

def send_reply_gmail(to, subject, body_text, thread_id, message_id, dry_run, logger):
    """Send a reply via Gmail API."""
    access = get_access_token()
    headers = {"Authorization": "Bearer " + access, "Content-Type": "application/json"}

    # Build raw message
    msg = "To: " + to + "\r\n"
    msg += "Subject: " + subject + "\r\n"
    msg += "Content-Type: text/plain; charset=utf-8\r\n"
    if message_id:
        msg += "In-Reply-To: <" + message_id + ">\r\n"
        msg += "References: <" + message_id + ">\r\n"
    msg += "\r\n" + body_text
    raw = base64.urlsafe_b64encode(msg.encode("utf-8")).decode("utf-8")

    if dry_run:
        logger.info("[DRY-RUN] Would send to %s: %s", to, subject[:60])
        return True

    data = {"raw": raw}
    if thread_id:
        data["threadId"] = thread_id

    try:
        result = api_request(GMAIL_API + "/messages/send", headers, method="POST", data=data)
        logger.info("Reply sent to %s (id: %s)", to, result.get("id", "?"))
        return True
    except Exception as e:
        logger.error("Failed to send to %s: %s", to, e)
        return False

def mark_as_read(message_id, logger):
    """Mark a message as read."""
    access = get_access_token()
    headers = {"Authorization": "Bearer " + access, "Content-Type": "application/json"}
    try:
        api_request(GMAIL_API + "/messages/" + message_id + "/modify", headers, method="POST",
                    data={"removeLabelIds": ["UNREAD"]})
        logger.debug("Marked read: %s", message_id)
    except Exception as e:
        logger.warning("Failed to mark read %s: %s", message_id, e)

def auto_archive(message_id, logger):
    """Mark as read and archive (remove from INBOX)."""
    access = get_access_token()
    headers = {"Authorization": "Bearer " + access, "Content-Type": "application/json"}
    try:
        api_request(GMAIL_API + "/messages/" + message_id + "/modify", headers, method="POST",
                    data={"removeLabelIds": ["UNREAD", "INBOX"]})
        logger.info("Auto-archived: %s", message_id)
    except Exception as e:
        logger.warning("Failed to archive %s: %s", message_id, e)

# ── Email parsing ──────────────────────────────────────────────────────────
def extract_email(raw):
    if not raw:
        return ""
    m = re.search(r"<([^>]+)>", raw)
    if m:
        return m.group(1).lower()
    m = re.search(r"[\w.+-]+@[\w-]+\.[\w.]+", raw)
    if m:
        return m.group(0).lower()
    return raw.lower().strip()

def extract_name(raw):
    if not raw:
        return "there"
    name = raw.split("<")[0].strip().split("@")[0].strip().replace('"', "").replace("'", "")
    parts = name.split()
    if parts and len(name) > 1:
        return parts[0]
    return "there"

def parse_message(msg):
    """Parse a Gmail API message into a flat dict."""
    headers = msg.get("payload", {}).get("headers", [])
    header_map = {h.get("name", "").lower(): h.get("value", "") for h in headers}
    return {
        "id": msg.get("id", ""),
        "threadId": msg.get("threadId", ""),
        "subject": header_map.get("subject", ""),
        "from": header_map.get("from", ""),
        "to": header_map.get("to", ""),
        "date": header_map.get("date", ""),
        "body": extract_body(msg.get("payload", {})),
        "snippet": msg.get("snippet", ""),
        "labels": msg.get("labelIds", []),
    }

# ── Classification engine ──────────────────────────────────────────────────
def classify_email(sender, subject, body, logger):
    combined = (subject + " " + body).lower()
    sender_lower = sender.lower()

    # Spam detection
    for kw in SPAM_SENDERS:
        if kw in sender_lower:
            return CAT_SPAM, 0.95, "Sender matches spam keyword: " + kw
    for pattern in SPAM_SUBJECT_PATTERNS:
        if re.search(pattern, subject, re.IGNORECASE):
            return CAT_SPAM, 0.90, "Subject matches spam pattern"

    # Score each category
    scores = {}
    reasons = {}
    for cat, keywords in CLASSIFICATION_RULES.items():
        matched = [kw for kw in keywords if kw in combined]
        if matched:
            scores[cat] = min(0.5 + 0.15 * len(matched), 0.95)
            reasons[cat] = "Matched: " + ", ".join(matched[:5])

    if not scores:
        return CAT_REVIEW, 0.30, "No classification keywords matched"

    best_cat = max(scores, key=lambda k: scores[k])
    best_score = scores[best_cat]
    if best_score < 0.55:
        return CAT_REVIEW, best_score, "Low confidence for " + best_cat + ": " + reasons[best_cat]
    return best_cat, best_score, reasons[best_cat]

# ── Template rendering ─────────────────────────────────────────────────────
def load_templates(logger):
    if not TEMPLATES_FILE.exists():
        logger.error("Templates file not found: %s", TEMPLATES_FILE)
        return {}
    try:
        with open(TEMPLATES_FILE) as f:
            data = json.load(f)
        templates = data.get("templates", [])
        logger.info("Loaded %d templates", len(templates))
        return {t["id"]: t for t in templates}
    except Exception as e:
        logger.error("Cannot load templates: %s", e)
        return {}

def render_template(template, email_meta, logger):
    sender_raw = email_meta.get("from", "")
    sender_name = extract_name(sender_raw)
    sender_email_addr = extract_email(sender_raw)

    company = COMPANY_NAME
    if sender_email_addr and "@" in sender_email_addr:
        domain = sender_email_addr.split("@")[1]
        generic = {"gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "aol.com", "icloud.com", "protonmail.com", "mail.com", "yandex.com", "zoho.com"}
        if domain not in generic:
            company = domain.split(".")[0].replace("-", " ").title()

    industry = "technology"
    subject_body = (email_meta.get("subject", "") + " " + email_meta.get("body", "")).lower()
    industry_keywords = {
        "healthcare": ["health", "medical", "patient", "clinical", "hospital", "hipaa", "doctor"],
        "fintech": ["financial", "banking", "fintech", "payment", "fraud", "credit", "trading"],
        "retail": ["retail", "ecommerce", "e-commerce", "shop", "store", "product"],
        "education": ["education", "edtech", "learning", "student", "school", "university"],
        "logistics": ["logistics", "supply chain", "shipping", "warehouse", "delivery"],
    }
    for ind, kws in industry_keywords.items():
        if any(kw in subject_body for kw in kws):
            industry = ind
            break

    variables = {"contact": sender_name, "company": company, "industry": industry, "service": "AI solutions", "sender_email": sender_email_addr}
    subject_tpl = template.get("subject", "Re: Your inquiry")
    body_tpl = template.get("body", "")
    subject = subject_tpl
    body = body_tpl
    for var, val in variables.items():
        subject = subject.replace("{{" + var + "}}", val)
        body = body.replace("{{" + var + "}}", val)
    return subject, body

# ── State & log management ─────────────────────────────────────────────────
def load_log(logger):
    if not LOG_FILE.exists():
        return []
    try:
        with open(LOG_FILE) as f:
            data = json.load(f)
        return data if isinstance(data, list) else data.get("entries", [])
    except Exception:
        return []

def save_log(entries, logger):
    LOG_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(LOG_FILE, "w") as f:
        json.dump(entries, f, indent=2, ensure_ascii=False, default=str)

def load_state():
    if not STATE_FILE.exists():
        return {"total_processed": 0, "total_replied": 0, "total_errors": 0, "last_run": None}
    try:
        with open(STATE_FILE) as f:
            return json.load(f)
    except Exception:
        return {"total_processed": 0, "total_replied": 0, "total_errors": 0, "last_run": None}

def save_state(state):
    STATE_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(STATE_FILE, "w") as f:
        json.dump(state, f, indent=2)

# ── Main processing ───────────────────────────────────────────────────────
def process_emails(send_mode, max_emails, logger):
    run_timestamp = now_iso()
    logger.info("=" * 60)
    logger.info("Email Auto-Responder v2 started at %s", run_timestamp)
    logger.info("Mode: %s", "SEND" if send_mode else "DRY-RUN")
    logger.info("=" * 60)

    templates = load_templates(logger)
    if not templates:
        logger.error("No templates loaded — aborting")
        return {"status": "error", "error": "No templates loaded", "timestamp": run_timestamp}

    messages = fetch_unread_emails(max_emails, logger)
    if not messages:
        logger.info("No unread emails found.")
        return {"status": "ok", "processed": 0, "replied": 0, "skipped": 0, "errors": 0, "timestamp": run_timestamp}

    log_entries = load_log(logger)
    processed_ids = {e.get("message_id") for e in log_entries if e.get("action") in ("replied", "dry_run_reply", "spam", "blocked")}

    results = []
    replied = 0
    skipped = 0
    errors = 0

    for msg in messages:
        parsed = parse_message(msg)
        msg_id = parsed["id"]
        if not msg_id:
            continue

        sender = parsed["from"]
        subject = parsed["subject"]
        body_text = parsed["body"] or parsed["snippet"]
        thread_id = parsed["threadId"]
        sender_email_addr = extract_email(sender)

        logger.info("-" * 40)
        logger.info("Message ID: %s", msg_id)
        logger.info("From: %s", sender)
        logger.info("Subject: %s", subject)

        # Skip if already processed
        if msg_id in processed_ids:
            logger.info("Already processed — skipping")
            skipped += 1
            results.append({"message_id": msg_id, "action": "skipped", "reason": "already_processed"})
            continue

        # Skip blocked senders
        if sender_email_addr in BLOCKED_SENDERS:
            logger.info("Blocked sender — skipping: %s", sender_email_addr)
            skipped += 1
            mark_as_read(msg_id, logger)
            results.append({"message_id": msg_id, "action": "blocked", "reason": "blocked_sender"})
            continue

        # Classify
        category, confidence, reason = classify_email(sender, subject, body_text, logger)
        logger.info("Classification: %s (confidence: %.2f) — %s", category, confidence, reason)

        if category == CAT_SPAM:
            # Auto-archive known noise senders, just mark read for others
            if any(s in sender_email_addr for s in AUTO_ARCHIVE_SENDERS):
                logger.info("→ Auto-archiving noise sender: %s", sender_email_addr)
                auto_archive(msg_id, logger)
                action = "archived"
            else:
                logger.info("→ Spam — marking read, no reply")
                action = "spam"
                mark_as_read(msg_id, logger)
        elif category == CAT_REVIEW:
            # Send gentle auto-review reply using smart template
            industry = detect_industry(subject, body_text)
            template_id = select_template(CAT_REVIEW, industry, templates)
            template = templates.get(template_id)
            if template and sender_email_addr:
                reply_subject, reply_body = render_template(template, {"from": sender, "subject": subject, "body": body_text}, logger)
                success = send_reply_gmail(sender_email_addr, reply_subject, reply_body, thread_id, msg_id, not send_mode, logger)
                if success:
                    action = "replied" if send_mode else "dry_run_reply"
                    replied += 1
                    mark_as_read(msg_id, logger)
                    logger.info("→ Auto-replied to unclear email (template: %s)", template_id)
                else:
                    action = "human_review"
                    logger.info("→ Failed to send auto-reply, flagging for review")
            else:
                logger.info("→ Flagged for human review (no template or sender)")
                action = "human_review"
        else:
            # Smart template selection based on category + industry
            industry = detect_industry(subject, body_text)
            template_id = select_template(category, industry, templates)
            template = templates.get(template_id)
            if not template:
                logger.warning("Template '%s' not found — flagging for review", template_id)
                action = "human_review"
            else:
                reply_subject, reply_body = render_template(template, {"from": sender, "subject": subject, "body": body_text}, logger)
                if not sender_email_addr:
                    logger.warning("Cannot extract sender email — flagging for review")
                    action = "human_review"
                else:
                    success = send_reply_gmail(sender_email_addr, reply_subject, reply_body, thread_id, msg_id, not send_mode, logger)
                    if success:
                        action = "replied" if send_mode else "dry_run_reply"
                        replied += 1
                        mark_as_read(msg_id, logger)
                    else:
                        action = "error"
                        errors += 1

        entry = {
            "timestamp": run_timestamp,
            "message_id": msg_id,
            "thread_id": thread_id,
            "sender": sender,
            "sender_email": sender_email_addr,
            "subject": subject,
            "category": category,
            "confidence": round(confidence, 2),
            "classification_reason": reason,
            "action": action,
            "mode": "send" if send_mode else "dry_run",
        }
        log_entries.append(entry)
        results.append(entry)

    save_log(log_entries, logger)

    # Update state
    state = load_state()
    state["total_processed"] = state.get("total_processed", 0) + len(results)
    state["total_replied"] = state.get("total_replied", 0) + replied
    state["total_errors"] = state.get("total_errors", 0) + errors
    state["last_run"] = run_timestamp
    save_state(state)

    summary = {
        "status": "ok",
        "timestamp": run_timestamp,
        "mode": "send" if send_mode else "dry_run",
        "total_fetched": len(messages),
        "processed": len(results),
        "replied": replied,
        "skipped": skipped,
        "errors": errors,
        "results": results,
        "lifetime_stats": state,
    }

    logger.info("=" * 60)
    logger.info("Run complete: %d fetched, %d replied, %d skipped, %d errors", len(messages), replied, skipped, errors)
    logger.info("=" * 60)
    return summary

# ── CLI ────────────────────────────────────────────────────────────────────
def main():
    parser = argparse.ArgumentParser(description="Email Auto-Responder v2 — Direct Gmail API")
    parser.add_argument("--send", action="store_true", default=False, help="Actually send replies")
    parser.add_argument("--max-emails", type=int, default=20, help="Max unread emails (default: 20)")
    parser.add_argument("--verbose", action="store_true", default=False, help="Verbose logging")
    parser.add_argument("--json-output", action="store_true", default=False, help="JSON summary output")
    args = parser.parse_args()

    logger = setup_logging(verbose=args.verbose)
    summary = process_emails(send_mode=args.send, max_emails=args.max_emails, logger=logger)

    if args.json_output:
        print(json.dumps(summary, indent=2, default=str))

    sys.exit(1 if summary.get("status") == "error" else 0)

if __name__ == "__main__":
    main()
