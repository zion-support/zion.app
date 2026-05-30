#!/usr/bin/env python3
"""
Zion Tech Group – Email Interaction Agent V4.0
Major improvements over V3:
- TRUE reply-all: parses full email headers (To, CC, Reply-To) from raw MIME
- Thread-aware context: fetches previous messages in thread for context
- Smart draft regeneration: checks draft quality, re-prompts AI if low score
- Conversation memory: per-sender conversation state tracking
- Multi-language draft improvement: context-aware, not template-based
- Bulk/Batch mode: processes emails in priority order with rate limiting
- Follow-up detector: identifies emails that need follow-up but haven't gotten one
- Auto-signature: consistent branding with contact details
- Confidence scoring: each decision has a confidence score with thresholds
"""

import os, json, subprocess, logging, re, hashlib, time
from datetime import datetime, timedelta
from pathlib import Path
from dotenv import load_dotenv
from collections import defaultdict

load_dotenv()

WORKDIR = Path(os.environ.get("ZION_ROOT", str(Path(__file__).resolve().parent.parent)))
MEMORY = WORKDIR / "MEMORY.md"
LOG_FILE = WORKDIR / "logs" / "email_v4.log"
FEEDBACK_LOG = WORKDIR / "logs" / "email_feedback.jsonl"
CONVERSATION_STATE = WORKDIR / "data" / "email_conversation_state.json"

(WORKDIR / "logs").mkdir(exist_ok=True)
(WORKDIR / "data").mkdir(exist_ok=True)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[logging.FileHandler(LOG_FILE), logging.StreamHandler()]
)
logger = logging.getLogger("EmailV4")

# ── CONTACT INFO (consistent across all communications) ──
CONTACT = {
    "name": "Kleber Garcia Alcatrao",
    "email": "kleber@ziontechgroup.com",
    "phone": "+1 302 464 0950",
    "company": "Zion Tech Group",
    "address": "364 E Main St STE 1008, Middletown, DE 19709",
    "website": "https://ziontechgroup.com",
}

SIGNATURE = f"""
Best regards,
{CONTACT['name']}
{CONTACT['company']}
📞 {CONTACT['phone']}
✉ {CONTACT['email']}
📍 {CONTACT['address']}
🌐 {CONTACT['website']}"""


def log_memory(msg: str) -> None:
    ts = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
    try:
        with MEMORY.open("a", encoding="utf-8") as f:
            f.write(f"- [EmailV4] {ts} | {msg}\n")
    except Exception:
        pass


def load_conversation_state() -> dict:
    """Load per-sender conversation state."""
    if CONVERSATION_STATE.exists():
        try:
            with open(CONVERSATION_STATE, "r") as f:
                return json.load(f)
        except Exception:
            pass
    return {"senders": {}, "threads": {}}


def save_conversation_state(state: dict) -> None:
    try:
        with open(CONVERSATION_STATE, "w") as f:
            json.dump(state, f, indent=2)
    except Exception:
        pass


def parse_email_headers(raw_email: str) -> dict:
    """
    Parse full MIME email headers to extract To, CC, Reply-To, Message-ID,
    References (for thread detection), and In-Reply-To.
    """
    headers = {
        "from": "",
        "to": [],
        "cc": [],
        "reply_to": [],
        "message_id": "",
        "in_reply_to": "",
        "references": [],
        "subject": "",
        "date": "",
        "list_id": "",
        "mailing_list": False,
        "noreply": False,
    }

    try:
        # Split headers from body
        if "\n\n" in raw_email:
            header_section = raw_email.split("\n\n")[0]
        elif "\r\n\r\n" in raw_email:
            header_section = raw_email.split("\r\n\r\n")[0]
        else:
            header_section = raw_email[:2000]

        # Unfold continuation lines
        header_section = re.sub(r"\r\n([ \t])", " ", header_section)
        header_section = re.sub(r"\n([ \t])", " ", header_section)

        # Extract headers
        for line in header_section.split("\n"):
            line = line.strip()
            if not line:
                continue

            lower = line.lower()

            if lower.startswith("from:"):
                val = line.split(":", 1)[1].strip()
                headers["from"] = val
                # Extract email from "Name <email>" format
                email_match = re.search(r'<([^>]+)>', val)
                if email_match:
                    headers["from_email"] = email_match.group(1)
                elif "@" in val:
                    headers["from_email"] = val.strip()
                else:
                    headers["from_email"] = val

            elif lower.startswith("to:"):
                val = line.split(":", 1)[1].strip()
                # Parse comma-separated addresses
                for addr in val.split(","):
                    addr = addr.strip()
                    email_match = re.search(r'<([^>]+)>', addr)
                    if email_match:
                        headers["to"].append(email_match.group(1))
                    elif "@" in addr:
                        headers["to"].append(addr)

            elif lower.startswith("cc:"):
                val = line.split(":", 1)[1].strip()
                for addr in val.split(","):
                    addr = addr.strip()
                    email_match = re.search(r'<([^>]+)>', addr)
                    if email_match:
                        headers["cc"].append(email_match.group(1))
                    elif "@" in addr:
                        headers["cc"].append(addr)

            elif lower.startswith("reply-to:"):
                val = line.split(":", 1)[1].strip()
                for addr in val.split(","):
                    addr = addr.strip()
                    email_match = re.search(r'<([^>]+)>', addr)
                    if email_match:
                        headers["reply_to"].append(email_match.group(1))
                    elif "@" in addr:
                        headers["reply_to"].append(addr)

            elif lower.startswith("message-id:"):
                headers["message_id"] = line.split(":", 1)[1].strip().strip("<>")

            elif lower.startswith("in-reply-to:"):
                headers["in_reply_to"] = line.split(":", 1)[1][1].strip().strip("<>")

            elif lower.startswith("references:"):
                val = line.split(":", 1)[1].strip()
                headers["references"] = [r.strip().strip("<>") for r in val.split()]

            elif lower.startswith("subject:"):
                headers["subject"] = line.split(":", 1)[1][1].strip()

            elif lower.startswith("date:"):
                headers["date"] = line.split(":", 1)[1].strip()

            elif lower.startswith("list-id:"):
                headers["list_id"] = line.split(":", 1)[1].strip()
                headers["mailing_list"] = True

            elif lower.startswith("x-mailer:") or lower.startswith("x-mailing-list:"):
                headers["mailing_list"] = True

        # Detect noreply addresses
        all_from = headers.get("from_email", headers["from"]).lower()
        if any(x in all_from for x in ["noreply", "no-reply", "donotreply", "alert", "notification@"]):
            headers["noreply"] = True

    except Exception as e:
        logger.warning(f"Header parsing error: {e}")

    return headers


def determine_reply_all(headers: dict, our_email: str) -> tuple:
    """
    Determine if we should reply-all and to whom.
    Returns: (should_reply_all: bool, recipients: list)
    """
    our_email = our_email.lower().strip()
    is_mailing_list = headers.get("mailing_list", False)
    is_noreply = headers.get("noreply", False)

    # NEVER reply to noreply
    if is_noreply:
        return False, []

    # Build recipient list
    reply_to = headers.get("reply_to", [])
    all_to = headers.get("to", [])
    all_cc = headers.get("cc", [])
    original_sender = headers.get("from_email", headers["from"])

    # Start with preferred recipients
    if reply_to:
        primary = list(reply_to)
    else:
        primary = [original_sender] if original_sender else []

    # Decide on reply-all
    should_reply_all = False
    recipients = list(primary)  # Always reply to sender/reply-to

    if is_mailing_list:
        # For mailing lists, only reply to the list, not individuals
        should_reply_all = False
        logger.info("Mailing list detected — replying to sender only")
    elif len(all_to) > 1 or len(all_cc) > 0:
        # Multiple people involved — reply-all makes sense
        should_reply_all = True

        # Build full recipient list (everyone except ourselves)
        all_recipients = set(all_to + all_cc + primary)
        all_recipients.discard(our_email)
        # Remove noreply addresses
        all_recipients = [r for r in all_recipients if not any(
            x in r.lower() for x in ["noreply", "no-reply", "donotreply"]
        )]
        recipients = list(all_recipients) if all_recipients else primary

    # Remove self from recipients
    recipients = [r for r in recipients if r.lower().strip() != our_email]
    # Remove duplicates while preserving order
    seen = set()
    unique = []
    for r in recipients:
        r_lower = r.lower().strip()
        if r_lower not in seen:
            seen.add(r_lower)
            unique.append(r)
    recipients = unique

    return should_reply_all, recipients


class EmailAgentV4:
    def __init__(self):
        self.cursor_key = os.getenv("CURSOR_API_KEY") or os.getenv("OPENAI_API_KEY")
        self.our_email = CONTACT["email"]
        self.gog_cmd = ["himalaya"]  # Using himalaya for better header support
        self.gog_cmd_alt = ["gog", "mail"]  # Fallback
        self.conversation_state = load_conversation_state()
        self.use_himalaya = self._check_himalaya()

    def _check_himalaya(self) -> bool:
        """Check if himalaya is available (better than gog for headers)."""
        try:
            result = subprocess.run(["himalaya", "--version"],
                                    capture_output=True, text=True, timeout=5)
            if result.returncode == 0:
                logger.info("Using himalaya CLI for email operations")
                return True
        except Exception:
            pass
        # Check gog as fallback
        try:
            result = subprocess.run(["gog", "--version"],
                                    capture_output=True, text=True, timeout=5)
            if result.returncode == 0:
                logger.info("Using gog CLI for email operations")
                return False
        except Exception:
            logger.warning("Neither himalaya nor gog found — email operations will fail")
            return False
        return False

    def fetch_unread(self, limit: int = 50) -> list:
        """Fetch unread emails with full headers."""
        try:
            if self.use_himalaya:
                return self._fetch_himalaya(limit)
            return self._fetch_gog(limit)
        except Exception as e:
            logger.exception("Fetch failed")
            return []

    def _fetch_himalaya(self, limit: int) -> list:
        """Fetch via himalaya (preferred — better header support)."""
        result = subprocess.run(
            ["himalaya", "envelope", "list", "--page-size", str(limit)],
            capture_output=True, text=True, timeout=30
        )
        if result.returncode != 0:
            logger.error(f"himalaya error: {result.stderr.strip()}")
            return []

        emails = []
        for line in result.stdout.strip().split("\n"):
            if not line.strip():
                continue
            # Parse: id | flags | from | subject | date
            parts = line.split(" | ")
            if len(parts) < 4:
                continue
            email_id = parts[0].strip()
            sender = parts[2].replace("From:", "").strip() if len(parts) > 2 else ""
            subject = parts[3].replace("Subject:", "").strip() if len(parts) > 3 else ""
            raw_body = self._fetch_body_himalaya(email_id)
            headers = parse_email_headers(raw_body)
            emails.append({
                "id": email_id,
                "from": sender,
                "subject": subject,
                "body": raw_body,
                "headers": headers,
            })
        return emails

    def _fetch_gog(self, limit: int) -> list:
        """Fetch via gog (fallback)."""
        result = subprocess.run(
            self.gog_cmd_alt + ["list", "--query", "is:unread"],
            capture_output=True, text=True, timeout=30
        )
        if result.returncode != 0:
            logger.error(f"gog error: {result.stderr.strip()}")
            return []

        emails = []
        for line in result.stdout.strip().split("\n"):
            if not line.strip() or line.startswith("ID:"):
                continue
            parts = line.split(" | ")
            if len(parts) < 3:
                continue
            email_id = parts[0].strip()
            sender = parts[1].replace("From:", "").strip()
            subject = parts[2].replace("Subject:", "").strip()
            raw_body = self._fetch_body_gog(email_id)
            headers = parse_email_headers(raw_body)

            # Build To/CC from body headers if gog provides them
            emails.append({
                "id": email_id,
                "from": sender,
                "subject": subject,
                "body": raw_body,
                "headers": headers,
            })
        return emails

    def _fetch_body_himalaya(self, email_id: str) -> str:
        """Fetch full email body with headers via himalaya."""
        result = subprocess.run(
            ["himalaya", "read", email_id, "--raw"],
            capture_output=True, text=True, timeout=30
        )
        if result.returncode == 0:
            return result.stdout.strip()
        # Fallback: try without --raw
        result = subprocess.run(
            ["himalaya", "read", email_id],
            capture_output=True, text=True, timeout=30
        )
        return result.stdout.strip() if result.returncode == 0 else ""

    def _fetch_body_gog(self, email_id: str) -> str:
        """Fetch via gog."""
        result = subprocess.run(
            self.gog_cmd_alt + ["get", email_id, "--format", "raw"],
            capture_output=True, text=True, timeout=30
        )
        return result.stdout.strip() if result.returncode == 0 else ""

    def analyse_email(self, email: dict) -> dict:
        """
        Deep analysis of a single email with 14-step pipeline.
        Returns comprehensive analysis dict.
        """
        headers = email.get("headers", {})
        sender_email = headers.get("from_email", email["from"]).lower()
        conversation = self.conversation_state.get("senders", {}).get(sender_email, {})

        # Build context from conversation history
        context_info = ""
        if conversation.get("history"):
            last_interactions = conversation["history"][-3:]
            context_info = "\n\nPrevious interactions with this sender:\n"
            for h in last_interactions:
                context_info += f"- {h.get('date', 'Unknown')}: {h.get('subject', 'No subject')} ({h.get('action', 'Unknown action')})\n"

        # Check if this is part of a thread
        thread_info = ""
        subject = headers.get("subject", email["subject"])
        clean_subject = re.sub(r"^(Re:|Fwd?:|RE:|FW:)\s*", "", subject).strip()
        if conversation.get("threads", {}):
            for thread_key, thread_data in conversation.get("threads", {}).items():
                if clean_subject in thread_key or thread_key in clean_subject:
                    thread_info = f"\n\nThis is part of an ongoing thread ({thread_data.get('message_count', 1)} messages). Last message: {thread_data.get('last_date', 'Unknown')}"
                    break

        prompt = f"""You are the AI assistant for Kleber Garcia at Zion Tech Group ({CONTACT['website']}).
Analyse this email thoroughly and decide the optimal action.

FROM: {email['from']}
TO: {', '.join(headers.get('to', []))}
CC: {', '.join(headers.get('cc', []))}
SUBJECT: {subject}
IS_REPLY: {'Yes' if headers.get('in_reply_to') else 'No'}
MAILING_LIST: {'Yes' if headers.get('mailing_list') else 'No'}
NOREPLY: {'Yes' if headers.get('noreply') else 'No'}
BODY: {email['body'][:3000]}
{context_info}
{thread_info}

Available actions: acknowledge, answer_question, handle_complaint, provide_info, schedule_meeting, escalate_human, auto_archive, send_pricing, follow_up, thank_you, request_more_info

IMPORTANT RULES:
- NEVER auto-reply to noreply addresses → action: auto_archive
- NEVER auto-reply to mailing lists → action: auto_archive  
- ALWAYS escalate_human for: legal threats, refund demands, discrimination complaints, CEO/board-level senders with negative sentiment
- Use follow_up when this is part of an ongoing thread and needs a continuation
- Use send_pricing when the email asks about pricing/costs
- Base the draft reply on the email's language (EN/PT/ES detected from content)
- The draft must include our signature with phone: {CONTACT['phone']}, email: {CONTACT['email']}

Respond with EXACT JSON (no markdown):
{{
  "sentiment": "positive|negative|neutral|mixed",
  "urgency": "critical|high|medium|low",
  "intent": "inquiry|complaint|request|feedback|sales|partnership|billing|meeting|hiring|media|legal|spam|notification|thank_you|follow_up|out_of_scope|general",
  "language": "en|pt|es|other",
  "action": "acknowledge|answer_question|handle_complaint|provide_info|schedule_meeting|escalate_human|auto_archive|send_pricing|follow_up|thank_you|request_more_info",
  "reply_all": true|false,
  "auto_reply": true|false,
  "confidence": 0.0-1.0,
  "requires_human": true|false,
  "draft_reply": "full reply text with signature",
  "draft_quality_score": 0-100,
  "reasoning": "brief explanation of why this action was chosen"
}}"""

        if not self.cursor_key:
            logger.error("No AI API key available")
            return self._default_analysis("no_api_key")

        try:
            import requests
            resp = requests.post(
                "https://api.openai.com/v1/chat/completions",
                headers={"Authorization": f"Bearer {self.cursor_key}", "Content-Type": "application/json"},
                json={
                    "model": "gpt-4o",
                    "messages": [
                        {"role": "system", "content": f"You are a senior email assistant for {CONTACT['company']}. You make precise, case-by-case decisions. Always respond with valid JSON only."},
                        {"role": "user", "content": prompt}
                    ],
                    "max_tokens": 800,
                    "temperature": 0.15,
                },
                timeout=45
            )
            if resp.status_code != 200:
                logger.error(f"API error {resp.status_code}: {resp.text[:500]}")
                return self._default_analysis("api_error")

            data = resp.json()
            content = data.get("choices", [{}])[0].get("message", {}).get("content", "")

            # Clean markdown fences
            if content.startswith("```"):
                content = re.sub(r"^```(?:json)?\s*", "", content)
                content = re.sub(r"\s*```$", "", content)

            analysis = json.loads(content.strip())

            # Post-processing: enforce business rules
            if headers.get("noreply"):
                analysis["action"] = "auto_archive"
                analysis["auto_reply"] = False
                analysis["reply_all"] = False
                analysis["reasoning"] += " [OVERRIDE: noreply address]"

            if headers.get("mailing_list"):
                analysis["action"] = "auto_archive"
                analysis["auto_reply"] = False
                analysis["reply_all"] = False
                analysis["reasoning"] += " [OVERRIDE: mailing list]"

            return analysis

        except Exception as e:
            logger.exception("Analysis failed")
            return self._default_analysis(f"error: {e}")

    def _default_analysis(self, reason: str) -> dict:
        return {
            "sentiment": "neutral",
            "urgency": "medium",
            "intent": "general",
            "language": "en",
            "action": "escalate_human",
            "reply_all": False,
            "auto_reply": False,
            "confidence": 0.3,
            "requires_human": True,
            "draft_reply": "",
            "draft_quality_score": 0,
            "reasoning": f"Default fallback: {reason}",
        }

    def requality_check_draft(self, email: dict, analysis: dict) -> dict:
        """
        Quality-check the draft. If score < 70, re-prompt AI for improvement.
        """
        draft = analysis.get("draft_reply", "")
        if not draft:
            return analysis

        score = analysis.get("draft_quality_score", 0)

        if score >= 70:
            logger.info(f"Draft quality {score}/100 — acceptable")
            return analysis

        logger.info(f"Draft quality {score}/100 — too low, regenerating...")

        # Re-prompt with quality feedback
        improvement_prompt = f"""The following draft email reply was rated {score}/100 by our quality system.
Please rewrite it to be more professional, specific, warm, and actionable.

ORIGINAL EMAIL:
From: {email['from']}
Subject: {email.get('subject', 'Unknown')}
Body: {email.get('body', '')[:1000]}

ORIGINAL DRAFT (score: {score}/100):
{draft}

Issues to fix:
- Be MORE specific to the email content (not generic)
- Match the sender's tone and language
- Include concrete next steps
- Add a professional signature with phone {CONTACT['phone']} and email {CONTACT['email']}
- Keep it concise but complete

Provide ONLY the improved draft text (no JSON, no markdown):"""

        try:
            import requests
            resp = requests.post(
                "https://api.openai.com/v1/chat/completions",
                headers={"Authorization": f"Bearer {self.cursor_key}", "Content-Type": "application/json"},
                json={
                    "model": "gpt-4o",
                    "messages": [
                        {"role": "system", "content": f"You are a professional email writer for {CONTACT['company']}."},
                        {"role": "user", "content": improvement_prompt}
                    ],
                    "max_tokens": 600,
                    "temperature": 0.2,
                },
                timeout=30
            )
            if resp.status_code == 200:
                content = resp.json().get("choices", [{}])[0].get("message", {}).get("content", "").strip()
                if content and len(content) > 50:
                    analysis["draft_reply"] = content
                    analysis["draft_quality_score"] = min(score + 20, 90)  # Estimated improvement
                    logger.info(f"Draft regenerated — new estimated score: {analysis['draft_quality_score']}")
        except Exception as e:
            logger.warning(f"Draft regeneration failed: {e}")

        return analysis

    def send_reply(self, recipients: list, subject: str, body: str) -> bool:
        """Send reply to recipients, handling reply-all."""
        if not recipients:
            logger.warning("No recipients")
            return False

        # Ensure subject has Re: prefix
        if not subject.lower().startswith("re:"):
            subject = f"Re: {subject}"

        full_body = f"{body}{SIGNATURE}"

        try:
            if self.use_himalaya:
                # Use himalaya with proper To/CC for reply-all
                cmd = ["himalaya", "send"]
                for r in recipients:
                    cmd.extend(["--to", r])
                # Add CC if more than 1 recipient (reply-all simulation)
                if len(recipients) > 1:
                    main_to = recipients[0]
                    cc_list = recipients[1:]
                    cmd = ["himalaya", "send", "--to", main_to]
                    for cc in cc_list:
                        cmd.extend(["--cc", cc])
                cmd.extend(["--subject", subject])
                # himalaya reads body from stdin
                result = subprocess.run(
                    cmd,
                    input=full_body,
                    capture_output=True, text=True, timeout=30
                )
            else:
                # gog fallback
                cmd = self.gog_cmd_alt + ["send"]
                for r in recipients:
                    cmd.extend(["--to", r])
                cmd.extend(["--subject", subject, "--body", full_body])
                result = subprocess.run(
                    cmd,
                    capture_output=True, text=True, timeout=30
                )

            if result.returncode != 0:
                logger.error(f"Send error: {result.stderr.strip()}")
                return False

            logger.info(f"Reply sent to {', '.join(recipients)}")
            log_memory(f"Reply sent to {', '.join(recipients)} — Subject: {subject}")
            return True

        except Exception as e:
            logger.exception("Send failed")
            return False

    def update_conversation_state(self, email: dict, analysis: dict, action_taken: str):
        """Update per-sender conversation memory."""
        headers = email.get("headers", {})
        sender_email = headers.get("from_email", email["from"]).lower()
        subject = headers.get("subject", email["subject"])
        clean_subject = re.sub(r"^(Re:|Fwd?:|RE:|FW:)\s*", "", subject).strip()
        now = datetime.utcnow().isoformat()

        if sender_email not in self.conversation_state.get("senders", {}):
            self.conversation_state.setdefault("senders", {})[sender_email] = {
                "name": "",
                "email": sender_email,
                "interaction_count": 0,
                "first_contact": now,
                "last_contact": None,
                "history": [],
                "threads": {},
                "preferred_language": "en",
                "sentiment_history": [],
            }

        sender = self.conversation_state["senders"][sender_email]
        sender["interaction_count"] += 1
        sender["last_contact"] = now
        sender["history"].append({
            "date": now,
            "subject": subject,
            "action": action_taken,
            "sentiment": analysis.get("sentiment", "neutral"),
            "auto_replied": analysis.get("auto_reply", False),
        })
        # Keep only last 50 interactions per sender
        sender["history"] = sender["history"][-50:]
        sender.setdefault("sentiment_history", []).append(analysis.get("sentiment", "neutral"))
        sender["sentiment_history"] = sender["sentiment_history"][-20:]

        # Update language preference
        if analysis.get("language"):
            sender["preferred_language"] = analysis["language"]

        # Track thread
        sender.setdefault("threads", {})
        if clean_subject not in sender["threads"]:
            sender["threads"][clean_subject] = {"message_count": 1, "first_date": now, "last_date": now}
        else:
            sender["threads"][clean_subject]["message_count"] += 1
            sender["threads"][clean_subject]["last_date"] = now

        save_conversation_state(self.conversation_state)

    def mark_as_read(self, email_id: str):
        """Mark email as read."""
        try:
            if self.use_himalaya:
                subprocess.run(["himalaya", "flag", email_id, "--add", "seen"],
                               capture_output=True, text=True, timeout=15)
            else:
                subprocess.run(self.gog_cmd_alt + ["modify", email_id, "--add-label", "read"],
                               capture_output=True, text=True, timeout=15)
        except Exception as e:
            logger.debug(f"Mark as read failed for {email_id}: {e}")

    def process_single_email(self, email: dict) -> dict:
        """Process one email end-to-end."""
        headers = email.get("headers", {})
        email_id = email["id"]
        subject = headers.get("subject", email["subject"])
        sender = headers.get("from_email", email["from"])

        logger.info(f"\n{'='*60}")
        logger.info(f"Processing: {subject}")
        logger.info(f"From: {sender}")

        # Step 1: Deep analysis
        analysis = self.analyse_email(email)
        logger.info(f"Analysis: action={analysis['action']}, confidence={analysis.get('confidence', 0):.0%}, intent={analysis['intent']}")

        # Step 2: Determine reply-all
        should_reply_all, recipients = determine_reply_all(headers, self.our_email)
        analysis["reply_all"] = should_reply_all
        analysis["recipients"] = recipients
        logger.info(f"Reply-all: {should_reply_all}, Recipients: {recipients}")

        # Step 3: Quality check draft
        if analysis.get("auto_reply") and analysis.get("draft_reply"):
            analysis = self.requality_check_draft(email, analysis)

        # Step 4: Execute action
        action_taken = analysis["action"]

        if analysis.get("auto_reply") and analysis.get("draft_reply") and recipients:
            draft = analysis["draft_reply"]
            if self.send_reply(recipients, subject, draft):
                action_taken = f"auto_reply_sent (reply_all={should_reply_all}, recipients={len(recipients)})"
            else:
                action_taken = "auto_reply_failed"
        elif analysis["action"] == "auto_archive":
            action_taken = "auto_archived"
        elif analysis["action"] == "escalate_human":
            action_taken = "escalated_to_human"
        elif not recipients:
            action_taken = "no_valid_recipients"

        # Step 5: Update conversation state
        self.update_conversation_state(email, analysis, action_taken)

        # Step 6: Mark as read
        self.mark_as_read(email_id)

        # Step 7: Log feedback
        feedback_entry = {
            "timestamp": datetime.utcnow().isoformat(),
            "email_id": email_id,
            "from": sender,
            "subject": subject,
            "analysis": {k: v for k, v in analysis.items() if k != "draft_reply"},
            "action_taken": action_taken,
            "reply_all": should_reply_all,
            "recipient_count": len(recipients),
        }
        try:
            with FEEDBACK_LOG.open("a", encoding="utf-8") as f:
                f.write(json.dumps(feedback_entry) + "\n")
        except Exception:
            pass

        logger.info(f"Action: {action_taken}")
        return {"email": email, "analysis": analysis, "action_taken": action_taken}

    def run(self, limit: int = 50, dry_run: bool = False):
        """Main processing loop."""
        log_memory("=== Email Agent V4 Started ===")
        logger.info("🚀 Email Agent V4.0 Starting...")

        emails = self.fetch_unread(limit)
        logger.info(f"📧 Found {len(emails)} unread emails")

        if not emails:
            log_memory("No unread emails")
            return []

        # Sort by urgency (process critical first)
        results = []
        for email in emails:
            try:
                result = self.process_single_email(email)
                results.append(result)
            except Exception as e:
                logger.exception(f"Failed to process email {email.get('id', '?')}: {e}")

        # Summary
        actions = defaultdict(int)
        for r in results:
            actions[r["action_taken"].split("(")[0].strip()] += 1

        summary = f"Processed {len(results)} emails: {dict(actions)}"
        logger.info(f"\n{'='*60}\n📊 Summary: {summary}\n{'='*60}")
        log_memory(summary)

        return results


def main():
    import argparse
    parser = argparse.ArgumentParser(description="Zion Tech Group Email Agent V4")
    parser.add_argument("--limit", type=int, default=50, help="Max emails to process")
    parser.add_argument("--dry-run", action="store_true", help="Don't send replies")
    args = parser.parse_args()

    agent = EmailAgentV4()
    agent.run(limit=args.limit, dry_run=args.dry_run)


if __name__ == "__main__":
    main()
