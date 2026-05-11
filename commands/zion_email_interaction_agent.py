#!/usr/bin/env python3
"""
Zion Tech Group – Email Interaction Agent
Monitors Gmail via gog CLI, analyses each unread email with GPT‑4 (Cursor API),
auto‑replies when appropriate, and logs everything to MEMORY.md.
"""

import os, json, subprocess, logging
from datetime import datetime
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

WORKDIR = Path(os.environ.get("ZION_ROOT", str(Path(__file__).resolve().parent.parent)))
MEMORY = WORKDIR / "MEMORY.md"
LOG_FILE = WORKDIR / "logs" / "email_interaction.log"

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
            f.write(f"- [EmailInteraction] {ts} | {msg}\n")
    except Exception as e:
        logger.error(f"Failed to write to MEMORY.md: {e}")

class EmailInteractionAgent:
    def __init__(self):
        self.cursor_key = os.getenv("CURSOR_API_KEY")  # or OPENAI_API_KEY if you prefer
        if not self.cursor_key:
            logger.warning("CURSOR_API_KEY not set – GPT‑4 calls will fail")
        self.gog_cmd = ["gog", "mail"]

    # -----------------------------------------------------------------
    def fetch_unread(self):
        """Return a list of dicts for each unread Gmail message.
        Expected output from `gog mail list --query is:unread`:
        ID | From: sender@example.com | Subject: …
        """
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
        """Retrieve the raw body of an email via `gog mail get`.
        If the command fails we return an empty string – the analysis will still work.
        """
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
        """Send the email to Cursor (GPT‑4) and expect a JSON response.
        The JSON schema:
        {
            "category": "inquiry|complaint|request|spam|other",
            "priority": "high|medium|low",
            "auto_reply": "yes|no",
            "draft_reply": "..."
        }
        """
        if not self.cursor_key:
            logger.error("CURSOR_API_KEY missing – cannot analyse email")
            return {"category": "error", "priority": "high", "auto_reply": "no", "draft_reply": "Missing AI key"}
        prompt = f"""You are Kleber Garcia at Zion Tech Group. Analyse this email and decide whether an automatic reply is appropriate.
From: {email['from']}
Subject: {email['subject']}
Body: {email['body']}

Respond with EXACT JSON (no markdown) using the following keys:
{{"category":"inquiry|complaint|request|spam|other","priority":"high|medium|low","auto_reply":"yes|no","draft_reply":"..."}}
"""
        try:
            import requests
            resp = requests.post(
                "https://api.cursor.com/v1/completions",
                headers={"Authorization": f"Bearer {self.cursor_key}", "Content-Type": "application/json"},
                json={"model": "gpt-4", "prompt": prompt, "max_tokens": 300, "temperature": 0.2},
                timeout=30
            )
            if resp.status_code != 200:
                logger.error(f"Cursor API error {resp.status_code}: {resp.text}")
                log_memory(f"Cursor API error {resp.status_code}: {resp.text}")
                return {"category": "error", "priority": "high", "auto_reply": "no", "draft_reply": "API error"}
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
            return {"category": "error", "priority": "high", "auto_reply": "no", "draft_reply": "Exception"}

    # -----------------------------------------------------------------
    def send_reply(self, to_addr: str, subject: str, body: str) -> bool:
        """Send a reply via `gog mail send`.
        The subject is automatically prefixed with "Re:".
        """
        try:
            result = subprocess.run(
                self.gog_cmd + ["send", "--to", to_addr, "--subject", f"Re: {subject}", "--body", body],
                capture_output=True, text=True, timeout=30
            )
            if result.returncode != 0:
                logger.error(f"gog send error: {result.stderr.strip()}")
                log_memory(f"gog send error: {result.stderr.strip()}")
                return False
            logger.info(f"Auto‑reply sent to {to_addr}")
            log_memory(f"Auto‑reply sent to {to_addr}")
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
    def run(self):
        log_memory("=== Email Interaction Agent Started ===")
        emails = self.fetch_unread()
        for email in emails:
            analysis = self.analyse_with_cursor(email)
            if analysis.get("auto_reply") == "yes":
                reply_body = analysis.get("draft_reply", "")
                if reply_body:
                    self.send_reply(email["from"], email["subject"], reply_body)
                else:
                    logger.warning("Auto‑reply flagged but no draft provided")
                    log_memory("Auto‑reply flagged but no draft provided")
            else:
                logger.info(f"Email from {email['from']} flagged for human review (priority={analysis.get('priority')})")
                log_memory(f"Human review needed: {email['from']} (priority={analysis.get('priority')})")
            self.mark_as_read(email["id"])
        log_memory("=== Email Interaction Agent Completed ===")

if __name__ == "__main__":
    agent = EmailInteractionAgent()
    agent.run()
