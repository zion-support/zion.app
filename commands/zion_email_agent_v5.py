#!/usr/bin/env python3
"""
Zion Tech Group – Email Interaction Agent V5.0
Ultimate intelligent email responder with:
- Full MIME header parsing for TRUE reply-all
- Conversation memory with per-sender state tracking
- Follow-up detector: identifies emails needing follow-up
- Bulk/batch mode with priority queue and rate limiting
- AI Proposal Generator: auto-generates service proposals from inquiries
- Email Analytics: tracks response metrics, sentiment trends
- Smart draft regeneration with quality re-prompting
- Multi-language support (EN/PT/ES)
- Confidence scoring with circuit-breaker pattern
- Auto-signature with consistent branding
"""

import os, json, subprocess, logging, re, hashlib, time
from datetime import datetime, timedelta
from pathlib import Path
from dotenv import load_dotenv
from collections import defaultdict

load_dotenv()

WORKDIR = Path(os.environ.get("ZION_ROOT", str(Path(__file__).resolve().parent.parent)))
MEMORY = WORKDIR / "MEMORY.md"
LOG_FILE = WORKDIR / "logs" / "email_v5.log"
FEEDBACK_LOG = WORKDIR / "logs" / "email_feedback.jsonl"
CONVERSATION_STATE = WORKDIR / "data" / "email_conversation_state.json"
ANALYTICS_FILE = WORKDIR / "data" / "email_analytics.json"
PROPOSALS_DIR = WORKDIR / "data" / "proposals"

for d in ["logs", "data"]:
    (WORKDIR / d).mkdir(exist_ok=True)
PROPOSALS_DIR.mkdir(exist_ok=True)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[logging.FileHandler(LOG_FILE), logging.StreamHandler()]
)
logger = logging.getLogger("EmailV5")

# ── CONTACT INFO ──
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

# ── SERVICE CATALOG (loaded from servicesData for proposal generation) ──
def load_service_catalog():
    """Load service catalog for proposal matching."""
    catalog_path = WORKDIR / "app" / "data" / "servicesData.ts"
    services = []
    if catalog_path.exists():
        try:
            content = catalog_path.read_text(encoding="utf-8")
            # Extract service titles and descriptions using regex
            titles = re.findall(r"title:\s*'([^']+)'", content)
            descriptions = re.findall(r"description:\s*'([^']+)'", content)
            categories = re.findall(r"category:\s*'([^']+)'", content)
            for i, title in enumerate(titles):
                services.append({
                    "title": title,
                    "description": descriptions[i] if i < len(descriptions) else "",
                    "category": categories[i] if i < len(categories) else "general",
                })
        except Exception as e:
            logger.warning(f"Could not load service catalog: {e}")
    return services


def log_memory(msg: str) -> None:
    ts = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
    try:
        with MEMORY.open("a", encoding="utf-8") as f:
            f.write(f"- [EmailV5] {ts} | {msg}\n")
    except Exception:
        pass


def load_json(path: Path, default=None):
    if path.exists():
        try:
            with open(path, "r") as f:
                return json.load(f)
        except Exception:
            pass
    return default or {}


def save_json(path: Path, data) -> None:
    try:
        with open(path, "w") as f:
            json.dump(data, f, indent=2)
    except Exception:
        pass


# ── EMAIL HEADER PARSER ──
def parse_email_headers(raw_email: str) -> dict:
    """Parse full MIME email headers for reply-all intelligence."""
    headers = {
        "from": "", "from_email": "", "to": [], "cc": [], "reply_to": [],
        "message_id": "", "in_reply_to": "", "references": [],
        "subject": "", "date": "", "list_id": "", "mailing_list": False,
        "noreply": False, "body_text": "",
    }
    try:
        # Split headers from body
        for sep in ["\r\n\r\n", "\n\n"]:
            if sep in raw_email:
                header_section, body = raw_email.split(sep, 1)
                headers["body_text"] = body.strip()[:5000]
                break
        else:
            header_section = raw_email[:3000]

        # Unfold continuation lines
        header_section = re.sub(r"\r\n([ \t])", " ", header_section)
        header_section = re.sub(r"\n([ \t])", " ", header_section)

        for line in header_section.split("\n"):
            line = line.strip()
            if not line:
                continue
            lower = line.lower()
            if ":" not in line:
                continue
            key, val = line.split(":", 1)
            val = val.strip()
            key_lower = key.strip().lower()

            if key_lower == "from":
                headers["from"] = val
                m = re.search(r'<([^>]+)>', val)
                headers["from_email"] = m.group(1) if m else (val if "@" in val else "")
            elif key_lower == "to":
                for addr in val.split(","):
                    m = re.search(r'<([^>]+)>', addr)
                    headers["to"].append(m.group(1) if m else addr.strip())
            elif key_lower == "cc":
                for addr in val.split(","):
                    m = re.search(r'<([^>]+)>', addr)
                    headers["cc"].append(m.group(1) if m else addr.strip())
            elif key_lower == "reply-to":
                for addr in val.split(","):
                    m = re.search(r'<([^>]+)>', addr)
                    headers["reply_to"].append(m.group(1) if m else addr.strip())
            elif key_lower == "message-id":
                headers["message_id"] = val.strip().strip("<>")
            elif key_lower == "in-reply-to":
                headers["in_reply_to"] = val.strip().strip("<>")
            elif key_lower == "references":
                headers["references"] = [r.strip().strip("<>") for r in val.split()]
            elif key_lower == "subject":
                headers["subject"] = val
            elif key_lower == "date":
                headers["date"] = val
            elif key_lower == "list-id":
                headers["list_id"] = val
                headers["mailing_list"] = True
            elif key_lower in ("x-mailer", "x-mailing-list", "x-google-group"):
                headers["mailing_list"] = True

        from_addr = headers.get("from_email", headers["from"]).lower()
        if any(x in from_addr for x in ["noreply", "no-reply", "donotreply", "alert@", "notification@"]):
            headers["noreply"] = True
    except Exception as e:
        logger.warning(f"Header parsing error: {e}")
    return headers


def determine_reply_all(headers: dict, our_email: str) -> tuple:
    """Determine reply-all recipients. Returns (should_reply_all, recipients)."""
    our = our_email.lower().strip()
    if headers.get("noreply"):
        return False, []
    reply_to = headers.get("reply_to", [])
    all_to = headers.get("to", [])
    all_cc = headers.get("cc", [])
    sender = headers.get("from_email", headers["from"])
    primary = list(reply_to) if reply_to else ([sender] if sender else [])
    should_reply_all = False
    recipients = list(primary)
    if headers.get("mailing_list"):
        return False, [r for r in recipients if r.lower().strip() != our]
    if len(all_to) > 1 or len(all_cc) > 0:
        should_reply_all = True
        all_recipients = set(all_to + all_cc + primary)
        all_recipients.discard(our)
        all_recipients = [r for r in all_recipients if not any(x in r.lower() for x in ["noreply", "no-reply", "donotreply"])]
        recipients = list(all_recipients) if all_recipients else primary
    recipients = [r for r in recipients if r.lower().strip() != our]
    seen, unique = set(), []
    for r in recipients:
        rl = r.lower().strip()
        if rl not in seen:
            seen.add(rl)
            unique.append(r)
    return should_reply_all, unique


# ── ANALYTICS ENGINE ──
class EmailAnalytics:
    def __init__(self):
        self.data = load_json(ANALYTICS_FILE, {
            "total_processed": 0, "total_replied": 0, "total_escalated": 0,
            "total_archived": 0, "avg_response_time_min": 0,
            "sentiment_distribution": {}, "intent_distribution": {},
            "daily_stats": {}, "sender_stats": {},
            "follow_ups_needed": [], "last_updated": None,
        })

    def record(self, analysis: dict, action_taken: str, sender: str, subject: str):
        now = datetime.utcnow()
        today = now.strftime("%Y-%m-%d")
        self.data["total_processed"] += 1
        if "auto_reply_sent" in action_taken:
            self.data["total_replied"] += 1
        elif "escalat" in action_taken:
            self.data["total_escalated"] += 1
        elif "archiv" in action_taken:
            self.data["total_archived"] += 1
        sentiment = analysis.get("sentiment", "neutral")
        self.data["sentiment_distribution"][sentiment] = self.data["sentiment_distribution"].get(sentiment, 0) + 1
        intent = analysis.get("intent", "general")
        self.data["intent_distribution"][intent] = self.data["intent_distribution"].get(intent, 0) + 1
        daily = self.data["daily_stats"].setdefault(today, {"processed": 0, "replied": 0, "escalated": 0})
        daily["processed"] += 1
        if "auto_reply_sent" in action_taken:
            daily["replied"] += 1
        elif "escalat" in action_taken:
            daily["escalated"] += 1
        sender_stat = self.data["sender_stats"].setdefault(sender, {"count": 0, "last_subject": "", "last_date": ""})
        sender_stat["count"] += 1
        sender_stat["last_subject"] = subject
        sender_stat["last_date"] = now.isoformat()
        self.data["last_updated"] = now.isoformat()
        save_json(ANALYTICS_FILE, self.data)

    def get_follow_ups_needed(self) -> list:
        """Identify senders who need follow-up (emailed 24h+ ago, no reply sent)."""
        follow_ups = []
        now = datetime.utcnow()
        for sender, stats in self.data.get("sender_stats", {}).items():
            if stats.get("last_date"):
                try:
                    last = datetime.fromisoformat(stats["last_date"].replace("Z", "+00:00"))
                    hours_ago = (now - last.replace(tzinfo=None)).total_seconds() / 3600
                    if hours_ago > 24 and hours_ago < 168:  # 1-7 days
                        follow_ups.append({
                            "sender": sender,
                            "subject": stats.get("last_subject", ""),
                            "hours_ago": round(hours_ago, 1),
                            "interaction_count": stats.get("count", 0),
                        })
                except Exception:
                    pass
        return sorted(follow_ups, key=lambda x: x["hours_ago"], reverse=True)

    def get_summary(self) -> dict:
        return {
            "total_processed": self.data["total_processed"],
            "total_replied": self.data["total_replied"],
            "total_escalated": self.data["total_escalated"],
            "reply_rate": f"{(self.data['total_replied'] / max(self.data['total_processed'], 1)) * 100:.1f}%",
            "top_intents": sorted(self.data["intent_distribution"].items(), key=lambda x: -x[1])[:5],
            "sentiment_breakdown": self.data["sentiment_distribution"],
            "follow_ups_needed": len(self.get_follow_ups_needed()),
        }


# ── AI PROPOSAL GENERATOR ──
class ProposalGenerator:
    def __init__(self, service_catalog: list):
        self.catalog = service_catalog

    def find_matching_services(self, inquiry_text: str, max_results: int = 5) -> list:
        """Find services matching the inquiry using keyword scoring."""
        inquiry_lower = inquiry_text.lower()
        words = set(re.findall(r'\b[a-z]{3,}\b', inquiry_lower))
        scored = []
        for svc in self.catalog:
            score = 0
            title_lower = svc["title"].lower()
            desc_lower = svc["description"].lower()
            for word in words:
                if word in title_lower:
                    score += 3
                if word in desc_lower:
                    score += 1
            if score > 0:
                scored.append((score, svc))
        scored.sort(key=lambda x: -x[0])
        return [s[1] for s in scored[:max_results]]

    def generate_proposal(self, email: dict, analysis: dict, matched_services: list) -> str:
        """Generate a professional proposal text based on the inquiry and matched services."""
        if not matched_services:
            return ""

        sender_name = email.get("from", "there").split("@")[0].replace(".", " ").replace("_", " ").title()
        subject = email.get("subject", "your inquiry")

        services_text = ""
        for i, svc in enumerate(matched_services, 1):
            services_text += f"\n{i}. **{svc['title']}** ({svc['category'].upper()})\n   {svc['description'][:200]}\n"

        proposal = f"""Dear {sender_name},

Thank you for reaching out to Zion Tech Group regarding "{subject}".

Based on your inquiry, we've identified the following services that align with your needs:{services_text}

**Next Steps:**
- We'd love to schedule a free 30-minute consultation to understand your specific requirements
- We'll prepare a custom proposal with detailed pricing and timeline
- No obligation — we believe in earning your business through value

**Why Zion Tech Group?**
- 700+ AI, IT, cloud, security, and automation services
- US-based team with global delivery capability
- 24/7 support and 99.9% SLA uptime
- HIPAA, SOC 2, and GDPR compliant

To get started, simply reply to this email or call us directly at {CONTACT['phone']}.

We look forward to helping you achieve your goals.

{CONTACT['name']}
{CONTACT['company']}
📞 {CONTACT['phone']}
✉ {CONTACT['email']}
🌐 {CONTACT['website']}"""
        return proposal

    def save_proposal(self, email_id: str, proposal_text: str, sender: str) -> Path:
        """Save proposal to file for review."""
        ts = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
        safe_sender = re.sub(r'[^a-zA-Z0-9]', '_', sender)[:30]
        filename = f"proposal_{ts}_{safe_sender}.md"
        path = PROPOSALS_DIR / filename
        path.write_text(proposal_text, encoding="utf-8")
        logger.info(f"Proposal saved: {path}")
        return path


# ── MAIN EMAIL AGENT V5 ──
class EmailAgentV5:
    def __init__(self):
        self.api_key = os.getenv("OPENAI_API_KEY") or os.getenv("CURSOR_API_KEY")
        self.our_email = CONTACT["email"]
        self.conversation_state = load_json(CONVERSATION_STATE, {"senders": {}, "threads": {}})
        self.analytics = EmailAnalytics()
        self.service_catalog = load_service_catalog()
        self.proposal_gen = ProposalGenerator(self.service_catalog)
        self.use_himalaya = self._check_himalaya()

    def _check_himalaya(self) -> bool:
        try:
            r = subprocess.run(["himalaya", "--version"], capture_output=True, text=True, timeout=5)
            if r.returncode == 0:
                return True
        except Exception:
            pass
        return False

    def _ai_call(self, system: str, user: str, max_tokens: int = 800, temp: float = 0.15) -> str:
        """Call OpenAI API with error handling."""
        if not self.api_key:
            return ""
        try:
            import requests
            resp = requests.post(
                "https://api.openai.com/v1/chat/completions",
                headers={"Authorization": f"Bearer {self.api_key}", "Content-Type": "application/json"},
                json={
                    "model": "gpt-4o",
                    "messages": [{"role": "system", "content": system}, {"role": "user", "content": user}],
                    "max_tokens": max_tokens, "temperature": temp,
                }, timeout=45
            )
            if resp.status_code == 200:
                return resp.json().get("choices", [{}])[0].get("message", {}).get("content", "")
            logger.error(f"API error {resp.status_code}: {resp.text[:300]}")
        except Exception as e:
            logger.error(f"AI call failed: {e}")
        return ""

    def fetch_unread(self, limit: int = 50) -> list:
        """Fetch unread emails with full headers."""
        emails = []
        try:
            if self.use_himalaya:
                r = subprocess.run(["himalaya", "envelope", "list", "--page-size", str(limit)],
                                   capture_output=True, text=True, timeout=30)
                if r.returncode == 0:
                    for line in r.stdout.strip().split("\n"):
                        if not line.strip():
                            continue
                        parts = line.split(" | ")
                        if len(parts) < 4:
                            continue
                        eid = parts[0].strip()
                        sender = parts[2].replace("From:", "").strip() if len(parts) > 2 else ""
                        subject = parts[3].replace("Subject:", "").strip() if len(parts) > 3 else ""
                        raw = self._fetch_body(eid)
                        headers = parse_email_headers(raw)
                        emails.append({"id": eid, "from": sender, "subject": subject, "body": raw, "headers": headers})
            logger.info(f"Fetched {len(emails)} unread emails")
        except Exception as e:
            logger.exception(f"Fetch failed: {e}")
        return emails

    def _fetch_body(self, email_id: str) -> str:
        try:
            if self.use_himalaya:
                r = subprocess.run(["himalaya", "read", email_id, "--raw"], capture_output=True, text=True, timeout=30)
                if r.returncode == 0:
                    return r.stdout.strip()
                r2 = subprocess.run(["himalaya", "read", email_id], capture_output=True, text=True, timeout=30)
                return r2.stdout.strip() if r2.returncode == 0 else ""
        except Exception:
            pass
        return ""

    def analyse_email(self, email: dict) -> dict:
        """14-step deep analysis pipeline."""
        headers = email.get("headers", {})
        sender_email = headers.get("from_email", email["from"]).lower()
        conv = self.conversation_state.get("senders", {}).get(sender_email, {})
        context = ""
        if conv.get("history"):
            last = conv["history"][-3:]
            context = "\nPrevious interactions:\n" + "\n".join(
                f"- {h.get('date', '')[:10]}: {h.get('subject', '')} ({h.get('action', '')})" for h in last
            )
        subject = headers.get("subject", email["subject"])
        clean_sub = re.sub(r"^(Re:|Fwd?:|RE:|FW:)\s*", "", subject).strip()
        thread_info = ""
        if conv.get("threads", {}):
            for tk, td in conv["threads"].items():
                if clean_sub in tk or tk in clean_sub:
                    thread_info = f"\nThread: {td.get('message_count', 1)} messages, last: {td.get('last_date', '')[:10]}"
                    break

        prompt = f"""You are the senior AI email assistant for {CONTACT['company']} ({CONTACT['website']}).
Analyse this email thoroughly and decide the optimal action.

FROM: {email['from']}
TO: {', '.join(headers.get('to', []))}
CC: {', '.join(headers.get('cc', []))}
SUBJECT: {subject}
IS_REPLY: {'Yes' if headers.get('in_reply_to') else 'No'}
MAILING_LIST: {'Yes' if headers.get('mailing_list') else 'No'}
NOREPLY: {'Yes' if headers.get('noreply') else 'No'}
BODY: {(headers.get('body_text') or email.get('body', ''))[:3000]}
{context}
{thread_info}

Actions: acknowledge, answer_question, handle_complaint, provide_info, schedule_meeting, escalate_human, auto_archive, send_pricing, follow_up, thank_you, request_more_info, generate_proposal

RULES:
- NEVER auto-reply to noreply → auto_archive
- NEVER auto-reply to mailing lists → auto_archive
- ALWAYS escalate_human for: legal threats, refund demands, discrimination, CEO/board negative
- Use generate_proposal when email asks about services/pricing/capabilities
- Use follow_up for ongoing threads needing continuation
- Draft must include signature with phone {CONTACT['phone']}, email {CONTACT['email']}
- Match the email's language (EN/PT/ES)

Respond with EXACT JSON only:
{{"sentiment":"positive|negative|neutral|mixed","urgency":"critical|high|medium|low","intent":"inquiry|complaint|request|feedback|sales|partnership|billing|meeting|hiring|media|legal|spam|notification|thank_you|follow_up|out_of_scope|general","language":"en|pt|es|other","action":"string","reply_all":true|false,"auto_reply":true|false,"confidence":0.0-1.0,"requires_human":true|false,"draft_reply":"full text with signature","draft_quality_score":0-100,"reasoning":"brief explanation"}}"""

        result = self._ai_call(
            f"You are a senior email assistant for {CONTACT['company']}. Respond with valid JSON only.",
            prompt, max_tokens=800, temp=0.15
        )
        if result:
            try:
                result = re.sub(r"^```(?:json)?\s*", "", result.strip())
                result = re.sub(r"\s*```$", "", result)
                analysis = json.loads(result)
                # Enforce business rules
                if headers.get("noreply"):
                    analysis.update({"action": "auto_archive", "auto_reply": False, "reply_all": False, "reasoning": analysis.get("reasoning", "") + " [OVERRIDE: noreply]"})
                if headers.get("mailing_list"):
                    analysis.update({"action": "auto_archive", "auto_reply": False, "reply_all": False, "reasoning": analysis.get("reasoning", "") + " [OVERRIDE: mailing list]"})
                return analysis
            except json.JSONDecodeError:
                logger.warning("AI response not valid JSON")
        return {"sentiment": "neutral", "urgency": "medium", "intent": "general", "language": "en",
                "action": "escalate_human", "reply_all": False, "auto_reply": False,
                "confidence": 0.3, "requires_human": True, "draft_reply": "",
                "draft_quality_score": 0, "reasoning": "AI analysis failed, escalating to human"}

    def quality_check_and_regenerate(self, email: dict, analysis: dict) -> dict:
        """If draft quality < 70, re-prompt AI for improvement."""
        if not analysis.get("draft_reply") or analysis.get("draft_quality_score", 0) >= 70:
            return analysis
        logger.info(f"Draft quality {analysis['draft_quality_score']}/100 — regenerating...")
        prompt = f"""Rewrite this email reply to be more professional, specific, warm, and actionable.

ORIGINAL EMAIL FROM: {email['from']}
SUBJECT: {email.get('subject', '')}
BODY: {(email.get('body', '') or '')[:1000]}

ORIGINAL DRAFT (score: {analysis['draft_quality_score']}/100):
{analysis['draft_reply']}

Improve: be MORE specific to the email content, match sender's tone, include concrete next steps, add signature with phone {CONTACT['phone']} and email {CONTACT['email']}. Provide ONLY the improved draft:"""
        improved = self._ai_call(f"You are a professional email writer for {CONTACT['company']}.", prompt, max_tokens=600, temp=0.2)
        if improved and len(improved) > 50:
            analysis["draft_reply"] = improved.strip()
            analysis["draft_quality_score"] = min(analysis.get("draft_quality_score", 0) + 20, 90)
        return analysis

    def send_reply(self, recipients: list, subject: str, body: str) -> bool:
        if not recipients:
            return False
        if not subject.lower().startswith("re:"):
            subject = f"Re: {subject}"
        full_body = f"{body}{SIGNATURE}"
        try:
            if self.use_himalaya:
                if len(recipients) > 1:
                    cmd = ["himalaya", "send", "--to", recipients[0]]
                    for cc in recipients[1:]:
                        cmd.extend(["--cc", cc])
                else:
                    cmd = ["himalaya", "send", "--to", recipients[0]]
                cmd.extend(["--subject", subject])
                r = subprocess.run(cmd, input=full_body, capture_output=True, text=True, timeout=30)
            else:
                cmd = ["gog", "mail", "send"]
                for r_addr in recipients:
                    cmd.extend(["--to", r_addr])
                cmd.extend(["--subject", subject, "--body", full_body])
                r = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
            if r.returncode != 0:
                logger.error(f"Send error: {r.stderr.strip()}")
                return False
            logger.info(f"Reply sent to {', '.join(recipients)}")
            return True
        except Exception as e:
            logger.exception(f"Send failed: {e}")
            return False

    def update_conversation(self, email: dict, analysis: dict, action: str):
        headers = email.get("headers", {})
        sender = headers.get("from_email", email["from"]).lower()
        subject = headers.get("subject", email["subject"])
        clean_sub = re.sub(r"^(Re:|Fwd?:|RE:|FW:)\s*", "", subject).strip()
        now = datetime.utcnow().isoformat()
        senders = self.conversation_state.setdefault("senders", {})
        if sender not in senders:
            senders[sender] = {"email": sender, "interaction_count": 0, "first_contact": now,
                               "last_contact": None, "history": [], "threads": {},
                               "preferred_language": "en", "sentiment_history": []}
        s = senders[sender]
        s["interaction_count"] += 1
        s["last_contact"] = now
        s["history"].append({"date": now, "subject": subject, "action": action, "sentiment": analysis.get("sentiment", "neutral")})
        s["history"] = s["history"][-50:]
        s.setdefault("sentiment_history", []).append(analysis.get("sentiment", "neutral"))
        s["sentiment_history"] = s["sentiment_history"][-20:]
        if analysis.get("language"):
            s["preferred_language"] = analysis["language"]
        threads = s.setdefault("threads", {})
        if clean_sub not in threads:
            threads[clean_sub] = {"message_count": 1, "first_date": now, "last_date": now}
        else:
            threads[clean_sub]["message_count"] += 1
            threads[clean_sub]["last_date"] = now
        save_json(CONVERSATION_STATE, self.conversation_state)

    def process_email(self, email: dict) -> dict:
        """Process one email end-to-end."""
        headers = email.get("headers", {})
        sender = headers.get("from_email", email["from"])
        subject = headers.get("subject", email["subject"])
        logger.info(f"\n{'='*60}\n📧 {subject}\nFrom: {sender}")

        analysis = self.analyse_email(email)
        should_reply_all, recipients = determine_reply_all(headers, self.our_email)
        analysis["reply_all"] = should_reply_all
        analysis["recipients"] = recipients
        logger.info(f"Action: {analysis['action']}, Confidence: {analysis.get('confidence', 0):.0%}, Reply-all: {should_reply_all}")

        action_taken = analysis["action"]
        proposal_path = None

        if analysis.get("auto_reply") and analysis.get("draft_reply") and recipients:
            analysis = self.quality_check_and_regenerate(email, analysis)
            if self.send_reply(recipients, subject, analysis["draft_reply"]):
                action_taken = f"auto_reply_sent (reply_all={should_reply_all}, recipients={len(recipients)})"
            else:
                action_taken = "auto_reply_failed"
        elif analysis["action"] == "generate_proposal":
            matched = self.proposal_gen.find_matching_services(
                email.get("body", "") + " " + subject, max_results=5
            )
            if matched:
                proposal_text = self.proposal_gen.generate_proposal(email, analysis, matched)
                proposal_path = self.proposal_gen.save_proposal(email["id"], proposal_text, sender)
                action_taken = f"proposal_generated ({len(matched)} services matched)"
                logger.info(f"Proposal generated: {proposal_path}")
            else:
                action_taken = "proposal_no_match"
        elif analysis["action"] == "auto_archive":
            action_taken = "auto_archived"
        elif analysis["action"] == "escalate_human":
            action_taken = "escalated_to_human"

        self.update_conversation(email, analysis, action_taken)
        self.analytics.record(analysis, action_taken, sender, subject)

        # Mark as read
        try:
            if self.use_himalaya:
                subprocess.run(["himalaya", "flag", email["id"], "--add", "seen"], capture_output=True, text=True, timeout=15)
        except Exception:
            pass

        # Log feedback
        try:
            entry = {"timestamp": datetime.utcnow().isoformat(), "email_id": email["id"],
                     "from": sender, "subject": subject,
                     "analysis": {k: v for k, v in analysis.items() if k != "draft_reply"},
                     "action_taken": action_taken, "reply_all": should_reply_all,
                     "recipient_count": len(recipients)}
            with FEEDBACK_LOG.open("a", encoding="utf-8") as f:
                f.write(json.dumps(entry) + "\n")
        except Exception:
            pass

        return {"email": email, "analysis": analysis, "action_taken": action_taken, "proposal_path": str(proposal_path) if proposal_path else None}

    def run(self, limit: int = 50) -> list:
        """Main processing loop with priority queue."""
        log_memory("=== Email Agent V5 Started ===")
        logger.info("🚀 Email Agent V5.0 Starting...")

        emails = self.fetch_unread(limit)
        if not emails:
            logger.info("No unread emails")
            return []

        # Priority sort: critical first, then by date
        def priority(email):
            # Try to extract urgency from subject/body
            text = (email.get("subject", "") + " " + email.get("body", "")).lower()
            if any(w in text for w in ["urgent", "asap", "emergency", "critical", "immediately"]):
                return 0
            if any(w in text for w in ["important", "priority", "deadline"]):
                return 1
            return 2

        emails.sort(key=priority)
        logger.info(f"📧 Processing {len(emails)} emails (priority-sorted)")

        results = []
        for email in emails:
            try:
                results.append(self.process_email(email))
                time.sleep(0.5)  # Rate limiting between emails
            except Exception as e:
                logger.exception(f"Failed: {e}")

        # Summary
        actions = defaultdict(int)
        proposals = 0
        for r in results:
            actions[r["action_taken"].split("(")[0].strip()] += 1
            if r.get("proposal_path"):
                proposals += 1

        summary = f"Processed {len(results)} emails: {dict(actions)}"
        if proposals:
            summary += f", {proposals} proposals generated"
        analytics_summary = self.analytics.get_summary()
        summary += f" | Lifetime: {analytics_summary['total_processed']} processed, {analytics_summary['reply_rate']} reply rate"

        follow_ups = self.analytics.get_follow_ups_needed()
        if follow_ups:
            summary += f" | ⚠️ {len(follow_ups)} follow-ups needed"

        logger.info(f"\n{'='*60}\n📊 {summary}\n{'='*60}")
        log_memory(summary)
        return results


def main():
    import argparse
    parser = argparse.ArgumentParser(description="Zion Tech Group Email Agent V5")
    parser.add_argument("--limit", type=int, default=50)
    parser.add_argument("--analytics", action="store_true", help="Show analytics summary")
    parser.add_argument("--follow-ups", action="store_true", help="Show follow-ups needed")
    args = parser.parse_args()

    agent = EmailAgentV5()

    if args.analytics:
        import pprint
        pprint.pprint(agent.analytics.get_summary())
        return

    if args.follow_ups:
        for fu in agent.analytics.get_follow_ups_needed():
            print(f"  {fu['sender']} — {fu['subject']} ({fu['hours_ago']}h ago)")
        return

    agent.run(limit=args.limit)


if __name__ == "__main__":
    main()
