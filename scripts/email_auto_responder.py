#!/usr/bin/env python3
"""
Enhanced Email Auto-Responder System
======================================

Checks for unread emails via gog CLI, classifies each message
(lead, customer inquiry, partnership, spam, other), selects an appropriate
reply template, and sends a response (or drafts it in dry-run mode).

Designed to run via cron job. Conservative by default — when uncertain,
flags for human review rather than auto-replying.

Usage:
    python3 email_auto_responder.py          # dry-run (default)
    python3 email_auto_responder.py --send    # actually send replies
    python3 email_auto_responder.py --send --max-emails 5
    python3 email_auto_responder.py --verbose
"""

import argparse
import json
import logging
import os
import re
import subprocess
import sys
import textwrap
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

# ---------------------------------------------------------------------------
# Paths & Constants
# ---------------------------------------------------------------------------

GOOG = os.environ.get("GOG_CLI", "/opt/homebrew/bin/gog")
GOG_ACCOUNT = os.environ.get("GOG_ACCOUNT", "")
TOKEN_FILE = Path(
    os.environ.get(
        "GOG_TOKEN_FILE",
        os.path.expanduser("~/.openclaw/workspace/gog_tokens.json"),
    )
)
TEMPLATES_FILE = Path(
    os.environ.get(
        "TEMPLATES_FILE",
        os.path.expanduser("~/data/outreach/templates.json"),
    )
)
LOG_FILE = Path(
    os.environ.get(
        "EMAIL_RESPONDER_LOG",
        os.path.expanduser("~/data/email_responder_log.json"),
    )
)

SENDER_EMAIL = "kleber@ziontechgroup.com"
SENDER_NAME = "Kleber Garcia"
COMPANY_NAME = "Zion Tech Group"

# Classification categories
CAT_LEAD = "lead"
CAT_CUSTOMER = "customer_inquiry"
CAT_PARTNERSHIP = "partnership"
CAT_SPAM = "spam"
CAT_OTHER = "other"
CAT_REVIEW = "human_review"

# Spam / noise indicators
SPAM_KEYWORDS = [
    "unsubscribe", "promotional", "marketing@",
    "noreply@", "no-reply@", "donotreply@", "mailer-daemon@",
    "notification@", "alerts@", "newsletter",
]

SPAM_SUBJECT_PATTERNS = [
    r"^\[?(spam|promo|sale|discount|offer|coupon|deal|limited time)",
    r"(you('ve| have) won|congratulations|claim your prize)",
    r"(act now|expires? (today|soon)|last chance|final reminder)",
    r"(unsubscribe|manage preferences|email preferences)",
]

# Classification keyword maps  (category -> [keywords/phrases])
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

# Template selection map: category -> template id prefix / keyword
TEMPLATE_MAP: Dict[str, str] = {
    CAT_LEAD: "proposal-ready",
    CAT_CUSTOMER: "free-audit",
    CAT_PARTNERSHIP: "proposal-ready",
    CAT_OTHER: "free-audit",
    CAT_REVIEW: "",  # no auto-reply
    CAT_SPAM: "",    # no reply
}

# ---------------------------------------------------------------------------
# Logging setup
# ---------------------------------------------------------------------------

def setup_logging(verbose: bool = False) -> logging.Logger:
    """Configure and return the logger."""
    logger = logging.getLogger("email_responder")
    logger.setLevel(logging.DEBUG if verbose else logging.INFO)

    # Console handler
    ch = logging.StreamHandler(sys.stdout)
    ch.setLevel(logging.DEBUG if verbose else logging.INFO)
    fmt = logging.Formatter(
        "%(asctime)s [%(levelname)-7s] %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )
    ch.setFormatter(fmt)
    logger.addHandler(ch)

    return logger


# ---------------------------------------------------------------------------
# Utility helpers
# ---------------------------------------------------------------------------

def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def run_gog(args: List[str], logger: logging.Logger) -> Tuple[bool, str]:
    """
    Run a gog CLI command. Returns (success, stdout_or_error).
    Uses GOG_ACCESS_TOKEN env var or GOG_ACCOUNT for auth.
    """
    cmd = [GOOG] + args
    if GOG_ACCOUNT:
        cmd += ["--account", GOG_ACCOUNT]
    # If GOG_ACCESS_TOKEN is set, pass it to gog via --access-token
    if os.environ.get("GOG_ACCESS_TOKEN"):
        cmd += ["--access-token", os.environ["GOG_ACCESS_TOKEN"]]
    logger.debug("Running: %s", " ".join(cmd))
    try:
        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            timeout=60,
        )
        if result.returncode != 0:
            stderr = result.stderr.strip() or result.stdout.strip()
            logger.error("gog returned code %d: %s", result.returncode, stderr)
            return False, stderr
        return True, result.stdout.strip()
    except FileNotFoundError:
        logger.error("gog CLI not found at %s", GOOG)
        return False, f"gog CLI not found at {GOOG}"
    except subprocess.TimeoutExpired:
        logger.error("gog command timed out")
        return False, "gog command timed out"
    except Exception as exc:
        logger.error("Unexpected error running gog: %s", exc)
        return False, str(exc)


def check_token(logger: logging.Logger) -> bool:
    """
    Check whether the gog token file exists and the token is not expired.
    """
    if not TOKEN_FILE.exists():
        logger.error("Token file not found: %s", TOKEN_FILE)
        return False

    try:
        with open(TOKEN_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)
    except (json.JSONDecodeError, OSError) as exc:
        logger.error("Cannot read token file: %s", exc)
        return False

    expiry_str = data.get("expiry", "")
    if not expiry_str:
        logger.warning("No expiry field in token file — assuming expired")
        return False

    try:
        expiry_str_norm = expiry_str.replace("Z", "+00:00")
        expiry = datetime.fromisoformat(expiry_str_norm)
        if expiry.tzinfo is None:
            expiry = expiry.replace(tzinfo=timezone.utc)
        now = datetime.now(timezone.utc)
        if now >= expiry:
            logger.error(
                "Token expired on %s (current time: %s). Please renew.",
                expiry_str,
                now.isoformat(),
            )
            return False
        logger.debug("Token valid until %s", expiry_str)
        return True
    except (ValueError, TypeError) as exc:
        logger.error("Cannot parse token expiry '%s': %s", expiry_str, exc)
        return False


def load_templates(logger: logging.Logger) -> Dict[str, Any]:
    """Load reply templates from the JSON file."""
    if not TEMPLATES_FILE.exists():
        logger.error("Templates file not found: %s", TEMPLATES_FILE)
        return {}
    try:
        with open(TEMPLATES_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)
        templates = data.get("templates", [])
        logger.info("Loaded %d templates", len(templates))
        return {t["id"]: t for t in templates}
    except (json.JSONDecodeError, OSError) as exc:
        logger.error("Cannot load templates: %s", exc)
        return {}


def load_log(logger: logging.Logger) -> List[Dict[str, Any]]:
    """Load the existing action log."""
    if not LOG_FILE.exists():
        return []
    try:
        with open(LOG_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)
        if isinstance(data, list):
            return data
        # Support both list and {"entries": [...]} formats
        return data.get("entries", [])
    except (json.JSONDecodeError, OSError) as exc:
        logger.warning("Cannot load log file (starting fresh): %s", exc)
        return []


def save_log(entries: List[Dict[str, Any]], logger: logging.Logger) -> None:
    """Persist the action log."""
    LOG_FILE.parent.mkdir(parents=True, exist_ok=True)
    try:
        with open(LOG_FILE, "w", encoding="utf-8") as f:
            json.dump(entries, f, indent=2, ensure_ascii=False, default=str)
        logger.debug("Saved %d log entries to %s", len(entries), LOG_FILE)
    except OSError as exc:
        logger.error("Cannot save log: %s", exc)


# ---------------------------------------------------------------------------
# Email parsing helpers
# ---------------------------------------------------------------------------

def extract_email(raw: str) -> str:
    """Extract an email address from a raw header string."""
    if not raw:
        return ""
    m = re.search(r"<([^>]+)>", raw)
    if m:
        return m.group(1).lower()
    m = re.search(r"[\w.+-]+@[\w-]+\.[\w.]+", raw)
    if m:
        return m.group(0).lower()
    return raw.lower().strip()


def extract_name(raw: str) -> str:
    """Extract a display name from a raw From header."""
    if not raw:
        return "there"
    name = raw.split("<")[0].strip().split("@")[0].strip().replace('"', "").replace("'", "")
    parts = name.split()
    if parts and len(name) > 1:
        return parts[0]
    return "there"


def parse_gog_message(raw: str) -> Dict[str, Any]:
    """
    Parse a single message line from `gog gmail messages list --plain`.
    Expected TSV fields: id, threadId, subject, from, to, date, snippet, labels
    Falls back to JSON parsing if the input looks like JSON.
    """
    raw = raw.strip()
    if not raw:
        return {}

    # Try JSON first
    if raw.startswith("{"):
        try:
            return json.loads(raw)
        except json.JSONDecodeError:
            pass

    # TSV parsing
    parts = raw.split("\t")
    if len(parts) >= 6:
        return {
            "id": parts[0].strip(),
            "threadId": parts[1].strip() if len(parts) > 1 else "",
            "subject": parts[2].strip() if len(parts) > 2 else "",
            "from": parts[3].strip() if len(parts) > 3 else "",
            "to": parts[4].strip() if len(parts) > 4 else "",
            "date": parts[5].strip() if len(parts) > 5 else "",
            "snippet": parts[6].strip() if len(parts) > 6 else "",
            "labels": parts[7].strip() if len(parts) > 7 else "",
        }

    return {}


def parse_gog_json_messages(stdout: str) -> List[Dict[str, Any]]:
    """
    Parse JSON output from `gog gmail messages list --json`.
    Handles both a bare array and an envelope with a 'messages' key.
    """
    try:
        data = json.loads(stdout)
    except json.JSONDecodeError:
        return []

    if isinstance(data, list):
        return data
    if isinstance(data, dict):
        for key in ("messages", "result", "data", "items"):
            if key in data and isinstance(data[key], list):
                return data[key]
        # If the dict itself looks like a single message
        if "id" in data and "subject" in data:
            return [data]
    return []


# ---------------------------------------------------------------------------
# Classification engine
# ---------------------------------------------------------------------------

def classify_email(
    sender: str,
    subject: str,
    body: str,
    logger: logging.Logger,
) -> Tuple[str, float, str]:
    """
    Classify an email into one of the categories.
    Returns (category, confidence, reason).
    """
    combined = f"{subject} {body}".lower()
    sender_lower = sender.lower()

    # --- Spam detection (highest priority) ---
    for kw in SPAM_KEYWORDS:
        if kw in sender_lower:
            return CAT_SPAM, 0.95, f"Sender matches spam keyword: {kw}"

    for pattern in SPAM_SUBJECT_PATTERNS:
        if re.search(pattern, subject, re.IGNORECASE):
            return CAT_SPAM, 0.90, f"Subject matches spam pattern: {pattern}"

    # --- Score each category ---
    scores: Dict[str, float] = {}
    reasons: Dict[str, str] = {}

    for cat, keywords in CLASSIFICATION_RULES.items():
        hit_count = 0
        matched = []
        for kw in keywords:
            if kw in combined:
                hit_count += 1
                matched.append(kw)
        if hit_count > 0:
            # Normalize: more hits = higher confidence, cap at 0.95
            score = min(0.5 + 0.15 * hit_count, 0.95)
            scores[cat] = score
            reasons[cat] = f"Matched keywords: {', '.join(matched[:5])}"

    if not scores:
        # No clear signal — flag for human review
        return CAT_REVIEW, 0.30, "No classification keywords matched"

    # Pick the highest-scoring category
    best_cat = max(scores, key=scores.get)  # type: ignore
    best_score = scores[best_cat]

    # If the best score is still low, flag for review
    if best_score < 0.55:
        return CAT_REVIEW, best_score, f"Low confidence ({best_score:.2f}) for {best_cat}: {reasons[best_cat]}"

    return best_cat, best_score, reasons[best_cat]


# ---------------------------------------------------------------------------
# Template rendering
# ---------------------------------------------------------------------------

def render_template(
    template: Dict[str, Any],
    email_meta: Dict[str, Any],
    logger: logging.Logger,
) -> Tuple[str, str]:
    """
    Render a reply template with variables filled from the email context.
    Returns (subject, body).
    """
    sender_raw = email_meta.get("from", "")
    sender_name = extract_name(sender_raw)
    sender_email_addr = extract_email(sender_raw)

    # Try to extract company from email domain
    company = COMPANY_NAME
    if sender_email_addr and "@" in sender_email_addr:
        domain = sender_email_addr.split("@")[1]
        # Skip generic email providers
        generic_domains = {
            "gmail.com", "yahoo.com", "hotmail.com", "outlook.com",
            "aol.com", "icloud.com", "protonmail.com", "mail.com",
            "yandex.com", "zoho.com",
        }
        if domain not in generic_domains:
            company = domain.split(".")[0].replace("-", " ").title()

    # Detect industry from subject/body
    industry = "technology"
    subject_body = f"{email_meta.get('subject', '')} {email_meta.get('body', '')}".lower()
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

    variables = {
        "contact": sender_name,
        "company": company,
        "industry": industry,
        "service": "AI solutions",
        "sender_email": sender_email_addr,
    }

    subject_tpl = template.get("subject", "Re: Your inquiry")
    body_tpl = template.get("body", "")

    subject = subject_tpl
    body = body_tpl
    for var, val in variables.items():
        placeholder = f"{{{{{var}}}}}"
        subject = subject.replace(placeholder, val)
        body = body.replace(placeholder, val)

    return subject, body


# ---------------------------------------------------------------------------
# Core processing
# ---------------------------------------------------------------------------

def fetch_unread_emails(
    max_emails: int,
    logger: logging.Logger,
) -> List[Dict[str, Any]]:
    """Fetch unread emails via gog CLI."""
    success, output = run_gog(
        [
            "gmail", "messages", "list", "is:unread",
            "--json",
            "--include-body",
            "--max", str(max_emails),
        ],
        logger,
    )
    if not success:
        logger.error("Failed to fetch emails: %s", output)
        return []

    messages = parse_gog_json_messages(output)
    logger.info("Fetched %d unread message(s)", len(messages))
    return messages


def send_reply(
    to: str,
    subject: str,
    body: str,
    reply_to_message_id: str,
    thread_id: str,
    dry_run: bool,
    logger: logging.Logger,
) -> bool:
    """Send a reply via gog CLI."""
    args = [
        "gmail", "send",
        "--to", to,
        "--subject", subject,
        "--body", body,
        "--reply-to-message-id", reply_to_message_id,
    ]
    if thread_id:
        args += ["--thread-id", thread_id]

    if dry_run:
        logger.info("[DRY-RUN] Would send reply to %s (subject: %s)", to, subject[:60])
        logger.debug("[DRY-RUN] Body preview: %s", body[:200])
        return True

    success, output = run_gog(args, logger)
    if success:
        logger.info("Reply sent to %s", to)
    else:
        logger.error("Failed to send reply to %s: %s", to, output)
    return success


def process_emails(
    send_mode: bool,
    max_emails: int,
    logger: logging.Logger,
) -> Dict[str, Any]:
    """
    Main processing pipeline.
    Returns a summary dict suitable for JSON output.
    """
    run_timestamp = now_iso()
    logger.info("=" * 60)
    logger.info("Email Auto-Responder started at %s", run_timestamp)
    logger.info("Mode: %s", "SEND" if send_mode else "DRY-RUN")
    logger.info("=" * 60)

    # Load templates
    templates = load_templates(logger)
    if not templates:
        logger.error("No templates loaded — aborting")
        return {
            "status": "error",
            "error": "No templates loaded",
            "timestamp": run_timestamp,
        }

    # Fetch unread emails
    messages = fetch_unread_emails(max_emails, logger)
    if not messages:
        logger.info("No unread emails found.")
        return {
            "status": "ok",
            "processed": 0,
            "replied": 0,
            "skipped": 0,
            "errors": 0,
            "timestamp": run_timestamp,
        }

    # Load existing log
    log_entries = load_log(logger)

    # Track already-processed message IDs to avoid duplicates
    processed_ids = {e.get("message_id") for e in log_entries if e.get("action") == "replied"}

    results = []
    replied = 0
    skipped = 0
    errors = 0

    for msg in messages:
        msg_id = msg.get("id", "")
        if not msg_id:
            continue

        # Extract fields from the message
        headers = msg.get("payload", {}).get("headers", []) if "payload" in msg else []
        header_map = {}
        for h in headers:
            header_map[h.get("name", "").lower()] = h.get("value", "")

        subject = header_map.get("subject", msg.get("subject", ""))
        sender = header_map.get("from", msg.get("from", ""))
        body_text = msg.get("body", msg.get("snippet", ""))
        thread_id = msg.get("threadId", msg.get("thread_id", ""))

        logger.info("-" * 40)
        logger.info("Message ID: %s", msg_id)
        logger.info("From: %s", sender)
        logger.info("Subject: %s", subject)

        # Skip if already processed
        if msg_id in processed_ids:
            logger.info("Already processed — skipping")
            skipped += 1
            results.append({
                "message_id": msg_id,
                "action": "skipped",
                "reason": "already_processed",
            })
            continue

        # Classify
        category, confidence, reason = classify_email(sender, subject, body_text, logger)
        logger.info("Classification: %s (confidence: %.2f) — %s", category, confidence, reason)

        # Determine action
        if category == CAT_SPAM:
            logger.info("→ Marked as spam — no reply")
            action = "spam"
            template_id = None
        elif category == CAT_REVIEW:
            logger.info("→ Flagged for human review")
            action = "human_review"
            template_id = None
        else:
            template_id = TEMPLATE_MAP.get(category, "free-audit")
            template = templates.get(template_id)
            if not template:
                logger.warning(
                    "Template '%s' not found — flagging for review", template_id
                )
                action = "human_review"
                template_id = None
            else:
                reply_subject, reply_body = render_template(
                    template,
                    {"from": sender, "subject": subject, "body": body_text},
                    logger,
                )
                sender_email_addr = extract_email(sender)

                if not sender_email_addr:
                    logger.warning("Cannot extract sender email — flagging for review")
                    action = "human_review"
                else:
                    success = send_reply(
                        to=sender_email_addr,
                        subject=reply_subject,
                        body=reply_body,
                        reply_to_message_id=msg_id,
                        thread_id=thread_id,
                        dry_run=not send_mode,
                        logger=logger,
                    )
                    if success:
                        action = "replied" if send_mode else "dry_run_reply"
                        replied += 1
                    else:
                        action = "error"
                        errors += 1

        # Log entry
        entry = {
            "timestamp": now_iso(),
            "message_id": msg_id,
            "thread_id": thread_id,
            "sender": sender,
            "subject": subject,
            "category": category,
            "confidence": round(confidence, 2),
            "classification_reason": reason,
            "action": action,
            "template_id": template_id,
            "mode": "send" if send_mode else "dry_run",
        }
        log_entries.append(entry)
        results.append(entry)

    # Save log
    save_log(log_entries, logger)

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
    }

    logger.info("=" * 60)
    logger.info("Run complete: %d fetched, %d replied, %d skipped, %d errors",
                len(messages), replied, skipped, errors)
    logger.info("=" * 60)

    return summary


# ---------------------------------------------------------------------------
# CLI entry point
# ---------------------------------------------------------------------------

def main() -> None:
    parser = argparse.ArgumentParser(
        description="Enhanced Email Auto-Responder System",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=textwrap.dedent("""\
            Examples:
              %(prog)s                          # dry-run (default)
              %(prog)s --send                   # actually send replies
              %(prog)s --send --max-emails 5    # send, max 5 emails
              %(prog)s --verbose                # verbose dry-run
              %(prog)s --json-output            # output JSON summary
        """),
    )
    parser.add_argument(
        "--send",
        action="store_true",
        default=False,
        help="Actually send replies. Default is dry-run mode.",
    )
    parser.add_argument(
        "--max-emails",
        type=int,
        default=20,
        help="Maximum number of unread emails to process (default: 20)",
    )
    parser.add_argument(
        "--verbose",
        action="store_true",
        default=False,
        help="Enable verbose/debug logging.",
    )
    parser.add_argument(
        "--json-output",
        action="store_true",
        default=False,
        help="Output a JSON summary to stdout.",
    )
    parser.add_argument(
        "--skip-token-check",
        action="store_true",
        default=False,
        help="Skip the gog token validity check.",
    )

    args = parser.parse_args()
    logger = setup_logging(verbose=args.verbose)

    # Token check
    if not args.skip_token_check:
        if not check_token(logger):
            logger.error(
                "Token check failed. Use --skip-token-check to bypass, "
                "or renew your gog token."
            )
            summary = {
                "status": "error",
                "error": "token_expired",
                "timestamp": now_iso(),
            }
            if args.json_output:
                print(json.dumps(summary, indent=2, default=str))
            sys.exit(1)

    # Process
    summary = process_emails(
        send_mode=args.send,
        max_emails=args.max_emails,
        logger=logger,
    )

    if args.json_output:
        print(json.dumps(summary, indent=2, default=str))

    # Exit code
    if summary.get("status") == "error":
        sys.exit(1)
    sys.exit(0)


if __name__ == "__main__":
    main()
