#!/usr/bin/env python3
"""
Zion Tech Group – Enhanced Email Interaction Agent
Monitors Gmail via gog CLI, analyses each unread email with GPT-4 (Cursor API),
auto-replies when appropriate (ensuring reply-all when needed), and logs everything.
Includes a feedback loop for continuous improvement.
"""

import os, json, subprocess, logging
from datetime import datetime
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

WORKDIR = Path(os.environ.get("ZION_ROOT", str(Path(__file__).resolve().parent.parent)))
MEMORY = WORKDIR / "MEMORY.md"
LOG_FILE = WORKDIR / "logs" / "email_interaction_enhanced.log"
FEEDBACK_LOG = WORKDIR / "logs" / "email_feedback.jsonl"

# Ensure logs directory exists
(WORKDIR / "logs").mkdir(exist_ok=True)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[logging.FileHandler(LOG_FILE), logging.StreamHandler()]
)
logger = logging.getLogger(__name__)

def log_memory(msg: str) -> None:
    ts = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
    try:
        with MEMORY.open("a", encoding="utf-8") as f:
            f.write(f"- [EmailInteractionEnhanced] {ts} | {msg}\\n")
    except Exception as e:
        logger.error(f"Failed to write to MEMORY.md: {e}")

def log_feedback(email_dict: dict, analysis: dict, action_taken: str) -> None:
    """Log interaction for feedback and improvement."""
    feedback_entry = {
        "timestamp": datetime.utcnow().isoformat(),
        "email_id": email_dict.get("id"),
        "from": email_dict.get("from"),
        "subject": email_dict.get("subject"),
        "body_preview": email_dict.get("body", "")[:200],  # first 200 chars
        "analysis": analysis,
        "action_taken": action_taken
    }
    try:
        with FEEDBACK_LOG.open("a", encoding="utf-8") as f:
            f.write(json.dumps(feedback_entry) + "\\n")
    except Exception as e:
        logger.error(f"Failed to write to feedback log: {e}")

class EmailInteractionAgentEnhanced:
    def __init__(self):
        self.cursor_key = os.getenv("CURSOR_API_KEY")  # or OPENAI_API_KEY if you prefer
        if not self.cursor_key:
            logger.warning("CURSOR_API_KEY not set – GPT-4 calls will fail")
        self.gog_cmd = ["gog", "mail"]
        # Load sender history/CRM data for personalization
        self.sender_history = self.load_sender_history()

    def load_sender_history(self):
        """Load sender history/CRM data for personalization."""
        crm_path = WORKDIR / "data" / "crm" / "sender_history.json"
        try:
            if crm_path.exists():
                with open(crm_path, "r") as f:
                    data = json.load(f)
                    return data.get("senders", {})
            else:
                logger.warning(f"CRM file not found at {crm_path}")
                return {}
        except Exception as e:
            logger.error(f"Failed to load sender history: {e}")
            return {}

    # -----------------------------------------------------------------
    def fetch_unread(self):
        """Return a list of dicts for each unread Gmail message."""
        try:
            result = subprocess.run(
                self.gog_cmd + ["list", "--query", "is:unread"],
                capture_output=True, text=True, timeout=30
            )
            if result.returncode != 0:
                logger.error(f"gog list error: {result.stderr.strip()}")
                log_memory(f"gog list error: {result.stderr.strip()}")
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
                body = self.fetch_body(email_id)
                emails.append({"id": email_id, "from": sender, "subject": subject, "body": body})
            logger.info(f"Fetched {len(emails)} unread emails")
            log_memory(f"Fetched {len(emails)} unread emails")
            return emails
        except Exception as e:
            logger.exception("Exception in fetch_unread")
            log_memory(f"fetch_unread exception: {e}")
            return []

    # -----------------------------------------------------------------
    def fetch_body(self, email_id: str) -> str:
        """Retrieve the raw body of an email via `gog mail get`."""
        try:
            result = subprocess.run(
                self.gog_cmd + ["get", email_id, "--format", "raw"],
                capture_output=True, text=True, timeout=30
            )
            if result.returncode != 0:
                logger.warning(f"Failed to get body for {email_id}: {result.stderr.strip()}")
                return ""
            return result.stdout.strip()
        except Exception as e:
            logger.exception(f"fetch_body exception for {email_id}")
            return ""

    # -----------------------------------------------------------------
    def analyse_with_cursor(self, email: dict) -> dict:
        """
        Send the email to Cursor (GPT-4) and expect a JSON response with analysis.
        The JSON schema:
        {
            "sentiment": "positive|negative|neutral",
            "urgency": "high|medium|low",
            "intent": "inquiry|complaint|request|feedback|other",
            "suggested_action": "acknowledge|answer_question|handle_complaint|provide_info|etc",
            "auto_reply": "yes|no",
            "reply_all": "yes|no",
            "draft_reply": "..."
        }
        """
        if not self.cursor_key:
            logger.error("CURSOR_API_KEY missing – cannot analyse email")
            return {"sentiment": "neutral", "urgency": "low", "intent": "other", "suggested_action": "human_review", "auto_reply": "no", "reply_all": "no", "draft_reply": "Missing AI key"}

        # Get sender information for personalization
        sender_email = email.get("from", "").lower()
        sender_info = self.sender_history.get(sender_email, {})

        # Build sender context for the prompt
        sender_context = ""
        if sender_info:
            sender_context = f"""
Sender Information:
- Name: {sender_info.get('name', 'Unknown')}
- Role: {sender_info.get('role', 'Unknown')}
- Company: {sender_info.get('company', 'Unknown')}
- Interaction Count: {sender_info.get('interaction_count', 0)}
- Last Interaction: {sender_info.get('last_interaction', 'Unknown')}
- Preferred Tone: {sender_info.get('preferred_tone', 'professional')}
- Common Topics: {', '.join(sender_info.get('common_topics', []))}
- Relationship Status: {sender_info.get('relationship_status', 'unknown')}
            """
        else:
            sender_context = """
Sender Information: Unknown sender (no prior interaction history)
            """

        prompt = f"""You are Kleber Garcia at Zion Tech Group. Analyse this email and decide on the appropriate action.

From: {email['from']}
Subject: {email['subject']}
Body: {email['body']}

{sender_context}

Consider:
1. Sentiment: Is the tone positive, negative, or neutral?
2. Urgency: Is there a sense of urgency (high, medium, low)?
3. Intent: What is the sender trying to achieve? (inquiry, complaint, request, feedback, other)
4. Suggested action: What should we do? (acknowledge, answer_question, handle_complaint, provide_info, etc.)
5. Should we auto-reply? (yes/no)
6. If auto-replying, should we reply-all? (yes/no) - consider if the email was sent to a mailing list or if others need to be informed.
7. Provide a draft reply if auto_reply is yes.
8. Personalize the response based on sender history and relationship.

Respond with EXACT JSON (no markdown) using the following keys:
{{"sentiment":"positive|negative|neutral","urgency":"high|medium|low","intent":"inquiry|complaint|request|feedback|other","suggested_action":"string","auto_reply":"yes|no","reply_all":"yes|no","draft_reply":"string"}}
"""

        try:
            import requests
            resp = requests.post(
                "https://api.cursor.com/v1/completions",
                headers={"Authorization": f"Bearer {self.cursor_key}", "Content-Type": "application/json"},
                json={"model": "gpt-4", "prompt": prompt, "max_tokens": 600, "temperature": 0.2},
                timeout=30
            )
            if resp.status_code != 200:
                logger.error(f"Cursor API error {resp.status_code}: {resp.text}")
                log_memory(f"Cursor API error {resp.status_code}: {resp.text}")
                return {"sentiment": "neutral", "urgency": "low", "intent": "other", "suggested_action": "human_review", "auto_reply": "no", "reply_all": "no", "draft_reply": "API error"}
            data = resp.json()
            content = data.get("choices", [{}])[0].get("message", {}).get("content", "")
            # Strip possible markdown fences
            if content.startswith("```json"):
                content = content.split("```json")[1].split("```")[0].strip()
            elif content.startswith("```"):
                content = content.split("```")[1].split("```")[0].strip()
            return json.loads(content)
        except Exception as e:
            logger.exception("Exception during Cursor analysis")
            log_memory(f"Cursor analysis exception: {e}")
            return {"sentiment": "neutral", "urgency": "low", "intent": "other", "suggested_action": "human_review", "auto_reply": "no", "reply_all": "no", "draft_reply": "Exception"}
    def get_recipients(self, email_dict: dict, reply_all: str) -> list:
        """
        Get the list of recipients for the reply.
        If reply_all is "yes", we need to fetch the original email's To and CC headers.
        For simplicity, we'll assume we can get this from the original email data.
        For now, we'll just return the sender if we cannot get the full header.
        TODO: Implement fetching of To and CC headers from the original email
        """
        # For now, we'll just return the sender as a fallback
        # In a production system, we would parse the email headers properly.
        # Given the complexity with the gog CLI, we'll start with just the sender
        # and then improve this in a future version.
        if reply_all == "yes":
            logger.info("Reply-all requested, but falling back to sender-only for now (TODO: implement full header parsing)")
            # TODO: Implement fetching of To and CC headers from the original email
            # We would need to fetch the full email with headers to get To and CC
            # For now, we'll just use the sender
            return [email_dict.get("from")]
        else:
            return [email_dict.get("from")]

    # -----------------------------------------------------------------
    def send_reply(self, to_addrs: list, subject: str, body: str) -> bool:
        """
        Send a reply via `gog mail send`.
        If multiple addresses, we can send to each or use a single command with multiple --to?
        The gog CLI might support multiple --to flags. We'll check.
        For simplicity, we'll send one email per recipient (not ideal but works).
        Better: send one email with multiple To addresses.
        Let's assume gog supports multiple --to: we can do `gog mail send --to a@b.com --to c@d.com ...`
        We'll build the command accordingly.
        """
        if not to_addrs:
            logger.warning("No recipients to send reply to")
            return False

        try:
            # Build the command: gog mail send --to addr1 --to addr2 ... --subject "Re: ..." --body ...
            cmd = self.gog_cmd + ["send"]
            for addr in to_addrs:
                cmd.extend(["--to", addr])
            cmd.extend(["--subject", f"Re: {subject}", "--body", body])
            result = subprocess.run(
                cmd,
                capture_output=True, text=True, timeout=30
            )
            if result.returncode != 0:
                logger.error(f"gog send error: {result.stderr.strip()}")
                log_memory(f"gog send error: {result.stderr.strip()}")
                return False
            logger.info(f"Auto-reply sent to {', '.join(to_addrs)}")
            log_memory(f"Auto-reply sent to {', '.join(to_addrs)}")
            return True
        except Exception as e:
            logger.exception("Exception while sending reply")
            log_memory(f"send_reply exception: {e}")
            return False

    # -----------------------------------------------------------------
    def mark_as_read(self, email_id: str):
        """Mark the email as read so we don't process it again."""
        try:
            subprocess.run(self.gog_cmd + ["modify", email_id, "--add-label", "read"],
                           capture_output=True, text=True, timeout=15)
        except Exception:
            pass

    # -----------------------------------------------------------------
    # -----------------------------------------------------------------
    def should_escalate_to_human(self, email: dict, analysis: dict) -> bool:
        """
        Determine if an email should be escalated to human review despite auto_reply being yes.
        This could be due to low confidence in analysis, high-value sender, or other risk factors.
        """
        # Check for low confidence in analysis (if we had a confidence score)
        # For now, we'll use heuristics based on sender history and email content
        sender_email = email.get("from", "").lower()
        sender_info = self.sender_history.get(sender_email, {})

        # Escalate for high-value senders (e.g., key stakeholders, partners) if the email is complex
        if sender_info.get("relationship_status") in ["key_stakeholder", "partner"]:
            # Check if the email suggests complexity or high risk
            subject = email.get("subject", "").lower()
            body = email.get("body", "").lower()
            risk_keywords = ["lawsuit", "compliance", "regulatory", "breach", "urgent", "escalate", "legal"]
            if any(keyword in subject or keyword in body for keyword in risk_keywords):
                return True

        # Escalate if the analysis suggests low confidence (we don't have a confidence score yet)
        # We can use the ambiguity of the intent or sentiment as a proxy
        # For example, if intent is 'other' or sentiment is neutral with conflicting signals
        # For now, we'll skip this and rely on the keyword check above.

        # Escalate for new senders with high urgency and negative sentiment (potential complaints)
        if sender_info.get("interaction_count", 0) == 0:
            if analysis.get("urgency") == "high" and analysis.get("sentiment") == "negative":
                return True

        # Default: do not escalate
        return False

    # -----------------------------------------------------------------
    def run(self):
        log_memory("=== Email Interaction Agent Enhanced Started ===")
        emails = self.fetch_unread()
        for email in emails:
            analysis = self.analyse_with_cursor(email)
            logger.info(f"Analysis: {analysis}")
            log_memory(f"Analysis for email {email['id']}: {json.dumps(analysis)}")

            if analysis.get("auto_reply") == "yes":
                reply_body = analysis.get("draft_reply", "")
                if reply_body:
                    # Determine recipients
                    to_addrs = self.get_recipients(email, analysis.get("reply_all", "no"))
                    if self.send_reply(to_addrs, email["subject"], reply_body):
                        action_taken = f"auto_reply_sent (reply_all={analysis.get('reply_all')})"
                    else:
                        action_taken = "auto_reply_failed"
                else:
                    logger.warning("Auto-reply flagged but no draft provided")
                    log_memory("Auto-reply flagged but no draft provided")
                    action_taken = "auto_reply_no_draft"
            else:
                logger.info(f"Email from {email['from']} flagged for human review (priority={analysis.get('urgency')}, suggested_action={analysis.get('suggested_action')})")
                log_memory(f"Human review needed: {email['from']} (urgency={analysis.get('urgency')}, suggested_action={analysis.get('suggested_action')})")
                action_taken = "human_review"

            # Confidence-gated escalation: check if we need human review despite auto_reply being yes
            # This could be based on low confidence in analysis, high-value sender, or other risk factors
            if self.should_escalate_to_human(email, analysis):
                logger.info(f"Escalating email {email['id']} to human review despite auto_reply=yes due to risk factors")
                log_memory(f"Escalated email {email['id']} to human review: risk factors detected")
                action_taken = "human_review_escalated"
                # Still log that we considered auto-reply but chose human review
                # We don't send the auto-reply in this case

            self.mark_as_read(email["id"])
            log_feedback(email, analysis, action_taken)

        log_memory("=== Email Interaction Agent Enhanced Completed ===")

if __name__ == "__main__":
    agent = EmailInteractionAgentEnhanced()
    agent.run()