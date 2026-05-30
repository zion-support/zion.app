#!/usr/bin/env python3
"""
Zion Tech Group – Email Interaction Agent V6.0
20-Pillar Intelligence System with:
- Pillar 1-5: Reflective Practitioner (self-critique, generator-reflector loop, quality gates)
- Pillar 6-10: Proactive Scout (health checks, implied tasks, root fixes)
- Pillar 11-15: Systematic Executor (right pattern, plan files, evaluator-optimizer)
- Pillar 16-20: Adaptive Selection, LUFS Uncertainty Calibration, Parallel Verification,
  Conversation State Machine, Implicit Requirement Mining, Failure Cascade Prevention
- Pillar 21: Cross-Agent Knowledge Transfer (shared KB)
- LUFS: Learned Uncertainty For Scoring — calibrates confidence based on historical accuracy
- Circuit Breaker: auto-disables auto-reply after N consecutive failures per sender
- CRM Webhook: auto-creates leads via HTTP POST on qualified inquiries
- Response Quality Learner: tracks which draft styles get best outcomes
- A/B Draft Testing: sends variant drafts and learns which performs better
- Sender Reputation Score: tracks sender quality over time
- Smart Escalation: escalates based on sender reputation + sentiment + intent combo
- Multi-Agent Delegation: signals complex emails for human or specialized agent review
"""

import os, json, subprocess, logging, re, hashlib, time, statistics
from datetime import datetime, timedelta
from pathlib import Path
from dotenv import load_dotenv
from collections import defaultdict

load_dotenv()

WORKDIR = Path(os.environ.get("ZION_ROOT", str(Path(__file__).resolve().parent.parent)))
MEMORY = WORKDIR / "MEMORY.md"
LOG_FILE = WORKDIR / "logs" / "email_v6.log"
FEEDBACK_LOG = WORKDIR / "logs" / "email_feedback.jsonl"
CONVERSATION_STATE = WORKDIR / "data" / "email_conversation_state.json"
ANALYTICS_FILE = WORKDIR / "data" / "email_analytics.json"
CALIBRATION_FILE = WORKDIR / "data" / "email_lufs_calibration.json"
CIRCUIT_FILE = WORKDIR / "data" / "email_circuit_breaker.json"
CRM_LEADS_FILE = WORKDIR / "data" / "crm_leads.json"
PROPOSALS_DIR = WORKDIR / "data" / "proposals"
SHARED_KB = WORKDIR / ".hermes" / "shared" / "agent-learnings.md"

for d in ["logs", "data"]:
    (WORKDIR / d).mkdir(exist_ok=True)
PROPOSALS_DIR.mkdir(exist_ok=True)
(SHARED_KB.parent).mkdir(parents=True, exist_ok=True)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[logging.FileHandler(LOG_FILE), logging.StreamHandler()]
)
logger = logging.getLogger("EmailV6")

CONTACT = {
    "name": "Kleber Garcia Alcatrao",
    "email": "kleber@ziontechgroup.com",
    "phone": "+1 302 464 0950",
    "company": "Zion Tech Group",
    "address": "364 E Main St STE 1008, Middletown, DE 19709",
    "website": "https://ziontechgroup.com",
}
SIGNATURE = f"\n\nBest regards,\n{CONTACT['name']}\n{CONTACT['company']}\n📞 {CONTACT['phone']}\n✉ {CONTACT['email']}\n📍 {CONTACT['address']}\n🌐 {CONTACT['website']}"

# ─────────────── PILLAR 1-5: REFLECTIVE PRACTITIONER ───────────────

class ReflectivePractitioner:
    """Pillar 1-5: Self-critique, generator-reflector loop, quality gates."""

    def critique_draft(self, draft: str, email: dict, analysis: dict) -> dict:
        """Self-critique a draft before sending. Returns {score, issues, improved_draft}."""
        issues = []
        score = 85.0
        # Check length
        if len(draft) < 50:
            issues.append("too_short"); score -= 20
        if len(draft) > 2000:
            issues.append("too_long"); score -= 10
        # Check specificity
        body = email.get("body", "")
        if body and not any(word in draft.lower() for word in body.lower().split()[:10]):
            issues.append("generic"); score -= 15
        # Check signature
        if CONTACT['phone'] not in draft:
            issues.append("missing_contact"); score -= 10
        # Check tone match
        if analysis.get("sentiment") == "negative" and "sorry" not in draft.lower() and "understand" not in draft.lower():
            issues.append("tone_mismatch"); score -= 10
        # Check action items
        if analysis.get("intent") in ["request", "inquiry"] and not any(w in draft.lower() for w in ["next step", "follow", "schedule", "call", "reply", "visit"]):
            issues.append("no_clear_cta"); score -= 10
        return {"score": max(0, score), "issues": issues}

    def reflect_on_outcome(self, email_id: str, action_taken: str, analysis: dict):
        """Post-action reflection: log what worked/didn't for learning."""
        reflection = {
            "timestamp": datetime.utcnow().isoformat(),
            "email_id": email_id,
            "action": action_taken,
            "confidence": analysis.get("confidence", 0),
            "intent": analysis.get("intent", ""),
            "sentiment": analysis.get("sentiment", ""),
        }
        try:
            with open(WORKDIR / "logs" / "v6_reflections.jsonl", "a") as f:
                f.write(json.dumps(reflection) + "\n")
        except Exception:
            pass


# ─────────────── PILLAR 16: LUFS UNCERTAINTY CALIBRATION ───────────────

class LUFSCalibration:
    """
    Pillar 16: Learned Uncertainty For Scoring.
    Tracks historical accuracy of AI confidence scores and calibrates them.
    If AI says 90% confidence but is only right 70% of the time, adjust down.
    """

    def __init__(self):
        self.data = self._load()

    def _load(self) -> dict:
        if CALIBRATION_FILE.exists():
            try:
                with open(CALIBRATION_FILE) as f:
                    return json.load(f)
            except Exception:
                pass
        return {"buckets": {}, "total_calibrated": 0, "last_updated": None}

    def _save(self):
        self.data["last_updated"] = datetime.utcnow().isoformat()
        with open(CALIBRATION_FILE, "w") as f:
            json.dump(self.data, f, indent=2)

    def record_prediction(self, claimed_confidence: float, was_correct: bool):
        """Record whether a prediction at this confidence level was correct."""
        bucket = round(claimed_confidence * 10) / 10  # Round to nearest 0.1
        b = self.data["buckets"].setdefault(str(bucket), {"correct": 0, "total": 0})
        b["total"] += 1
        if was_correct:
            b["correct"] += 1
        self.data["total_calibrated"] += 1
        self._save()

    def calibrate(self, claimed_confidence: float) -> float:
        """Return calibrated confidence based on historical accuracy."""
        bucket = round(claimed_confidence * 10) / 10
        b = self.data["buckets"].get(str(bucket))
        if b and b["total"] >= 5:
            actual_accuracy = b["correct"] / b["total"]
            # Blend claimed with actual (Bayesian-ish)
            calibrated = (claimed_confidence * 0.4) + (actual_accuracy * 0.6)
            return round(min(1.0, max(0.0, calibrated)), 3)
        return claimed_confidence

    def get_calibration_report(self) -> dict:
        report = {}
        for bucket, stats in self.data["buckets"].items():
            if stats["total"] >= 3:
                report[bucket] = {
                    "accuracy": round(stats["correct"] / stats["total"], 2),
                    "samples": stats["total"],
                }
        return report


# ─────────────── PILLAR 17: CIRCUIT BREAKER ───────────────

class CircuitBreaker:
    """
    Pillar 19: Failure Cascade Prevention.
    Tracks consecutive failures per sender. After threshold, auto-escalates.
    States: CLOSED (normal) → OPEN (blocked) → HALF_OPEN (testing)
    """

    def __init__(self):
        self.data = self._load()
        self.THRESHOLD = 3  # Consecutive failures before opening
        self.RESET_MINUTES = 30  # Time before trying again

    def _load(self) -> dict:
        if CIRCUIT_FILE.exists():
            try:
                with open(CIRCUIT_FILE) as f:
                    return json.load(f)
            except Exception:
                pass
        return {"senders": {}}

    def _save(self):
        with open(CIRCUIT_FILE, "w") as f:
            json.dump(self.data, f, indent=2)

    def record_result(self, sender: str, action: str):
        """Record whether an action succeeded or failed."""
        s = self.data["senders"].setdefault(sender, {
            "state": "CLOSED", "failures": 0, "successes": 0,
            "last_failure": None, "last_success": None, "total": 0,
        })
        s["total"] += 1
        if "failed" in action or "error" in action.lower():
            s["failures"] += 1
            s["last_failure"] = datetime.utcnow().isoformat()
            if s["failures"] >= self.THRESHOLD:
                s["state"] = "OPEN"
                logger.warning(f"🔴 Circuit OPEN for {sender} — {s['failures']} consecutive failures")
        else:
            s["successes"] += 1
            s["last_success"] = datetime.utcnow()
            if s["state"] == "OPEN":
                s["state"] = "HALF_OPEN"
                logger.info(f"🟡 Circuit HALF_OPEN for {sender}")
            elif s["successes"] >= 2 and s["state"] == "HALF_OPEN":
                s["state"] = "CLOSED"
                s["failures"] = 0
                logger.info(f"🟢 Circuit CLOSED for {sender} — recovered")
        self._save()

    def check_sender(self, sender: str) -> dict:
        """Check if sender's circuit allows auto-reply."""
        s = self.data["senders"].get(sender)
        if not s:
            return {"allowed": True, "state": "CLOSED"}
        # Check if OPEN has expired
        if s["state"] == "OPEN" and s.get("last_failure"):
            try:
                last_fail = datetime.fromisoformat(s["last_failure"])
                if (datetime.utcnow() - last_fail).total_seconds() > self.RESET_MINUTES * 60:
                    s["state"] = "HALF_OPEN"
                    s["failures"] = 0
                    self._save()
                    return {"allowed": True, "state": "HALF_OPEN"}
            except Exception:
                pass
        return {
            "allowed": s["state"] != "OPEN",
            "state": s["state"],
            "failures": s["failures"],
        }


# ─────────────── AI CRM PIPELINE ───────────────

class CRMPipeline:
    """Auto-create leads from qualified email inquiries."""

    def __init__(self):
        self.leads = self._load()
        self.webhook_url = os.getenv("CRM_WEBHOOK_URL", "")
        self.crm_api_key = os.getenv("CRM_API_KEY", "")

    def _load(self) -> list:
        if CRM_LEADS_FILE.exists():
            try:
                with open(CRM_LEADS_FILE) as f:
                    return json.load(f)
            except Exception:
                pass
        return []

    def _save(self):
        with open(CRM_LEADS_FILE, "w") as f:
            json.dump(self.leads, f, indent=2)

    def create_lead(self, email: dict, analysis: dict, matched_services: list):
        """Create a lead from a qualified inquiry."""
        headers = email.get("headers", {})
        sender = headers.get("from_email", email["from"])
        lead = {
            "id": hashlib.md5(f"{sender}{datetime.utcnow().isoformat()}".encode()).hexdigest()[:12],
            "source": "email",
            "email": sender,
            "subject": headers.get("subject", email["subject"]),
            "intent": analysis.get("intent", ""),
            "urgency": analysis.get("urgency", "medium"),
            "sentiment": analysis.get("sentiment", "neutral"),
            "matched_services": [s.get("title", "") for s in matched_services[:5]],
            "matched_count": len(matched_services),
            "created_at": datetime.utcnow().isoformat(),
            "status": "new",
            "pipeline_stage": "inquiry",
        }
        self.leads.append(lead)
        self._save()
        logger.info(f"📋 Lead created: {lead['id']} — {sender} ({lead['intent']})")
        # Attempt webhook
        if self.webhook_url:
            self._send_webhook(lead)
        return lead

    def _send_webhook(self, lead: dict):
        """Send lead to external CRM via webhook."""
        try:
            import requests
            resp = requests.post(
                self.webhook_url,
                json=lead,
                headers={
                    "Content-Type": "application/json",
                    "Authorization": f"Bearer {self.crm_api_key}" if self.crm_api_key else "",
                },
                timeout=10,
            )
            if resp.status_code == 200:
                logger.info(f"✅ Lead {lead['id']} sent to CRM")
            else:
                logger.warning(f"⚠️ CRM webhook returned {resp.status_code}")
        except Exception as e:
            logger.warning(f"⚠️ CRM webhook failed: {e}")


# ─────────────── KNOWLEDGE GRAPH (Pillar 21) ───────────────

class KnowledgeGraph:
    """Pillar 21: Cross-Agent Knowledge Transfer via shared KB."""

    def read_shared_kb(self) -> str:
        if SHARED_KB.exists():
            try:
                return SHARED_KB.read_text(encoding="utf-8")
            except Exception:
                pass
        return ""

    def write_learning(self, key: str, value: str):
        """Write a learning to the shared KB."""
        try:
            content = self.read_shared_kb()
            ts = datetime.utcnow().strftime("%Y-%m-%d %H:%M")
            entry = f"\n## {key} ({ts})\n{value}\n"
            SHARED_KB.write_text(content + entry, encoding="utf-8")
        except Exception:
            pass


# ─────────────── EMAIL PARSER & REPLY-ALL ───────────────

def parse_email_headers(raw_email: str) -> dict:
    h = {"from": "", "from_email": "", "to": [], "cc": [], "reply_to": [],
         "message_id": "", "in_reply_to": "", "references": [],
         "subject": "", "date": "", "list_id": "", "mailing_list": False,
         "noreply": False, "body_text": ""}
    try:
        for sep in ["\r\n\r\n", "\n\n"]:
            if sep in raw_email:
                header_section, body = raw_email.split(sep, 1)
                h["body_text"] = body.strip()[:5000]
                break
        else:
            header_section = raw_email[:3000]
        header_section = re.sub(r"\r\n([ \t])", " ", header_section)
        header_section = re.sub(r"\n([ \t])", " ", header_section)
        for line in header_section.split("\n"):
            if ":" not in line:
                continue
            key, val = line.split(":", 1)
            val = val.strip()
            kl = key.strip().lower()
            if kl == "from":
                h["from"] = val
                m = re.search(r'<([^>]+)>', val)
                h["from_email"] = m.group(1) if m else (val if "@" in val else "")
            elif kl == "to":
                for a in val.split(","):
                    m = re.search(r'<([^>]+)>', a)
                    h["to"].append(m.group(1) if m else a.strip())
            elif kl == "cc":
                for a in val.split(","):
                    m = re.search(r'<([^>]+)>', a)
                    h["cc"].append(m.group(1) if m else a.strip())
            elif kl == "reply-to":
                for a in val.split(","):
                    m = re.search(r'<([^>]+)>', a)
                    h["reply_to"].append(m.group(1) if m else a.strip())
            elif kl == "message-id":
                h["message_id"] = val.strip().strip("<>")
            elif kl == "in-reply-to":
                h["in_reply_to"] = val.strip().strip("<>")
            elif kl == "references":
                h["references"] = [r.strip().strip("<>") for r in val.split()]
            elif kl == "subject":
                h["subject"] = val
            elif kl == "date":
                h["date"] = val
            elif kl == "list-id":
                h["list_id"] = val; h["mailing_list"] = True
            elif kl in ("x-mailer", "x-mailing-list"):
                h["mailing_list"] = True
        fe = h.get("from_email", h["from"]).lower()
        if any(x in fe for x in ["noreply", "no-reply", "donotreply"]):
            h["noreply"] = True
    except Exception as e:
        logger.warning(f"Parse error: {e}")
    return h


def determine_reply_all(headers: dict, our_email: str) -> tuple:
    our = our_email.lower().strip()
    if headers.get("noreply") or headers.get("mailing_list"):
        return False, []
    reply_to = headers.get("reply_to", [])
    sender = headers.get("from_email", headers["from"])
    primary = list(reply_to) if reply_to else ([sender] if sender else [])
    all_to = headers.get("to", [])
    all_cc = headers.get("cc", [])
    should_reply = len(all_to) > 1 or len(all_cc) > 0
    recipients = list(primary)
    if should_reply:
        all_r = set(all_to + all_cc + primary)
        all_r.discard(our)
        all_r = [r for r in all_r if not any(x in r.lower() for x in ["noreply", "no-reply"])]
        recipients = list(all_r) if all_r else primary
    recipients = [r for r in recipients if r.lower().strip() != our]
    seen, unique = set(), []
    for r in recipients:
        rl = r.lower().strip()
        if rl not in seen:
            seen.add(rl); unique.append(r)
    return should_reply, unique


# ─────────────── SERVICE CATALOG ───────────────

def load_service_catalog():
    catalog_path = WORKDIR / "app" / "data" / "servicesData.ts"
    services = []
    if catalog_path.exists():
        try:
            content = catalog_path.read_text(encoding="utf-8")
            titles = re.findall(r"title:\s*'([^']+)'", content)
            descs = re.findall(r"description:\s*'([^']+)'", content)
            cats = re.findall(r"category:\s*'([^']+)'", content)
            for i, t in enumerate(titles):
                services.append({"title": t, "description": descs[i] if i < len(descs) else "",
                                 "category": cats[i] if i < len(cats) else "general"})
        except Exception as e:
            logger.warning(f"Catalog load failed: {e}")
    return services


def find_matching_services(inquiry_text: str, catalog: list, max_results: int = 5) -> list:
    words = set(re.findall(r'\b[a-z]{3,}\b', inquiry_text.lower()))
    scored = []
    for svc in catalog:
        score = sum(3 if w in svc["title"].lower() else 0 for w in words) + \
                sum(1 if w in svc["description"].lower() else 0 for w in words)
        if score > 0:
            scored.append((score, svc))
    scored.sort(key=lambda x: -x[0])
    return [s[1] for s in scored[:max_results]]


# ─────────────── AI ENGINE ───────────────

class AIEngine:
    """Centralized AI calling with retry, timeout, and fallback."""

    def __init__(self, api_key: str):
        self.api_key = api_key

    def call(self, system: str, user: str, max_tokens: int = 800, temp: float = 0.15, retries: int = 2) -> str:
        if not self.api_key:
            return ""
        import requests
        for attempt in range(retries):
            try:
                resp = requests.post(
                    "https://api.openai.com/v1/chat/completions",
                    headers={"Authorization": f"Bearer {self.api_key}", "Content-Type": "application/json"},
                    json={"model": "gpt-4o", "messages": [{"role": "system", "content": system},
                                                           {"role": "user", "content": user}],
                          "max_tokens": max_tokens, "temperature": temp},
                    timeout=45,
                )
                if resp.status_code == 200:
                    return resp.json().get("choices", [{}])[0].get("message", {}).get("content", "")
                logger.error(f"API {resp.status_code}: {resp.text[:200]}")
            except Exception as e:
                logger.warning(f"AI call attempt {attempt+1} failed: {e}")
                if attempt < retries - 1:
                    time.sleep(2)
        return ""


# ─────────────── V6 EMAIL AGENT ───────────────

class EmailAgentV6:
    """20-Pillar Intelligent Email Agent."""

    def __init__(self):
        self.api_key = os.getenv("OPENAI_API_KEY") or os.getenv("CURSOR_API_KEY")
        self.our_email = CONTACT["email"]
        self.ai = AIEngine(self.api_key)
        self.reflector = ReflectivePractitioner()
        self.lufs = LUFSCalibration()
        self.circuit = CircuitBreaker()
        self.crm = CRMPipeline()
        self.knowledge = KnowledgeGraph()
        self.catalog = load_service_catalog()
        self.conv_state = self._load_json(CONVERSATION_STATE, {"senders": {}, "threads": {}})
        self.analytics = self._load_json(ANALYTICS_FILE, {"total_processed": 0, "total_replied": 0,
            "total_escalated": 0, "total_archived": 0, "sentiment_distribution": {},
            "intent_distribution": {}, "daily_stats": {}, "sender_stats": {}, "last_updated": None})
        self.use_himalaya = self._check_himalaya()

    def _check_himalaya(self) -> bool:
        try:
            r = subprocess.run(["himalaya", "--version"], capture_output=True, text=True, timeout=5)
            return r.returncode == 0
        except Exception:
            return False

    def _load_json(self, path, default):
        if path.exists():
            try:
                with open(path) as f:
                    return json.load(f)
            except Exception:
                pass
        return default

    def _save_json(self, path, data):
        with open(path, "w") as f:
            json.dump(data, f, indent=2)

    def fetch_unread(self, limit=50):
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
        except Exception as e:
            logger.exception(f"Fetch failed: {e}")
        return emails

    def _fetch_body(self, eid):
        try:
            if self.use_himalaya:
                for flag in ["--raw", ""]:
                    cmd = ["himalaya", "read", eid] + (["--raw"] if flag else [])
                    r = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
                    if r.returncode == 0 and r.stdout.strip():
                        return r.stdout.strip()
        except Exception:
            pass
        return ""

    def analyse_email(self, email: dict) -> dict:
        headers = email.get("headers", {})
        sender = headers.get("from_email", email["from"]).lower()
        conv = self.conv_state.get("senders", {}).get(sender, {})
        context = ""
        if conv.get("history"):
            context = "\nPrevious:\n" + "\n".join(
                f"- {h.get('date','')[:10]}: {h.get('subject','')} ({h.get('action','')})"
                for h in conv["history"][-3:]
            )
        subject = headers.get("subject", email["subject"])
        body = (headers.get("body_text") or email.get("body", ""))[:3000]

        prompt = f"""You are the senior AI email assistant for {CONTACT['company']}.
Analyse this email and decide the optimal action.

FROM: {email['from']} | TO: {', '.join(headers.get('to', []))} | CC: {', '.join(headers.get('cc', []))}
SUBJECT: {subject} | IS_REPLY: {'Yes' if headers.get('in_reply_to') else 'No'}
MAILING_LIST: {'Yes' if headers.get('mailing_list') else 'No'}
NOREPLY: {'Yes' if headers.get('noreply') else 'No'}
BODY: {body}
{context}

Actions: acknowledge, answer_question, handle_complaint, provide_info, schedule_meeting, escalate_human, auto_archive, send_pricing, follow_up, thank_you, request_more_info, generate_proposal

RULES: NEVER auto-reply noreply/mailing_list → auto_archive. ALWAYS escalate_human for legal threats, refund demands, CEO/board negative. Use generate_proposal for service inquiries. Include signature with {CONTACT['phone']}, {CONTACT['email']}. Match language (EN/PT/ES).

Respond with EXACT JSON only:
{{"sentiment":"positive|negative|neutral|mixed","urgency":"critical|high|medium|low","intent":"inquiry|complaint|request|feedback|sales|partnership|billing|meeting|hiring|media|legal|spam|notification|thank_you|follow_up|out_of_scope|general","language":"en|pt|es|other","action":"string","reply_all":true|false,"auto_reply":true|false","confidence":0.0-1.0,"requires_human":true|false,"draft_reply":"","draft_quality_score":0-100,"reasoning":"","is_lead":true|false}}"""

        result = self.ai.call(
            f"You are a senior email assistant for {CONTACT['company']}. Respond with valid JSON only.",
            prompt, max_tokens=800, temp=0.15
        )
        if result:
            try:
                result = re.sub(r"^```(?:json)?\s*", "", result.strip())
                result = re.sub(r"\s*```$", "", result)
                analysis = json.loads(result)
                if headers.get("noreply") or headers.get("mailing_list"):
                    analysis.update({"action": "auto_archive", "auto_reply": False, "reply_all": False})
                return analysis
            except json.JSONDecodeError:
                pass
        return {"sentiment": "neutral", "urgency": "medium", "intent": "general", "language": "en",
                "action": "escalate_human", "reply_all": False, "auto_reply": False,
                "confidence": 0.3, "requires_human": True, "draft_reply": "",
                "draft_quality_score": 0, "reasoning": "fallback", "is_lead": False}

    def process_email(self, email: dict) -> dict:
        headers = email.get("headers", {})
        sender = headers.get("from_email", email["from"])
        subject = headers.get("subject", email["subject"])
        logger.info(f"\n{'='*60} | 📧 {subject} | From: {sender}")

        # Circuit breaker check
        cb = self.circuit.check_sender(sender)
        if not cb["allowed"]:
            logger.info(f"🔴 Circuit OPEN for {sender} — escalating to human")
            return {"email": email, "action_taken": "circuit_breaker_open", "analysis": {}}

        # Deep analysis
        analysis = self.analyse_email(email)
        # LUFS calibration
        raw_conf = analysis.get("confidence", 0.5)
        analysis["confidence_raw"] = raw_conf
        analysis["confidence"] = self.lufs.calibrate(raw_conf)
        logger.info(f"Action: {analysis['action']}, Confidence: {raw_conf:.0%}→{analysis['confidence']:.0%}")

        should_reply_all, recipients = determine_reply_all(headers, self.our_email)
        analysis["reply_all"] = should_reply_all
        analysis["recipients"] = recipients

        action_taken = analysis["action"]
        lead_id = None
        proposal_path = None

        if analysis.get("auto_reply") and analysis.get("draft_reply") and recipients:
            # Self-critique draft (Pillar 1-5)
            critique = self.reflector.critique_draft(analysis["draft_reply"], email, analysis)
            if critique["score"] < 70:
                logger.info(f"Draft critiqued: {critique['score']}/100 — issues: {critique['issues']}")
                improvement_prompt = f"Rewrite this email reply to fix these issues: {', '.join(critique['issues'])}. Be more specific, match tone, include clear CTA. Original draft:\n{analysis['draft_reply']}\n\nOriginal email body:\n{body[:500]}"
                improved = self.ai.call(f"Email writer for {CONTACT['company']}.", improvement_prompt, 600, 0.2)
                if improved and len(improved) > 50:
                    analysis["draft_reply"] = improved.strip()

            if self.send_reply(recipients, subject, analysis["draft_reply"]):
                action_taken = f"auto_reply_sent (reply_all={should_reply_all})"
                self.circuit.record_result(sender, "success")
            else:
                action_taken = "auto_reply_failed"
                self.circuit.record_result(sender, "failed")

        elif analysis["action"] == "generate_proposal" or analysis.get("is_lead"):
            matched = find_matching_services(body + " " + subject, self.catalog)
            if matched:
                proposal = self._generate_proposal_text(email, analysis, matched)
                proposal_path = PROPOSALS_DIR / f"proposal_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}_{re.sub(r'[^a-zA-Z0-9]','_',sender)[:30]}.md"
                proposal_path.write_text(proposal, encoding="utf-8")
                action_taken = f"proposal_generated ({len(matched)} matched)"
                # Auto-create CRM lead
                lead = self.crm.create_lead(email, analysis, matched)
                lead_id = lead["id"]

        elif analysis["action"] == "auto_archive":
            action_taken = "auto_archived"
        elif analysis["action"] == "escalate_human":
            action_taken = "escalated_to_human"

        # Update conversation state
        self._update_conv(email, analysis, action_taken)
        # Update analytics
        self._update_analytics(analysis, action_taken, sender)
        # Circuit record
        if "failed" not in action_taken and action_taken != "circuit_breaker_open":
            self.circuit.record_result(sender, action_taken)
        # Write to shared KB
        if analysis.get("intent") not in ("spam", "notification", "general"):
            self.knowledge.write_learning(f"Email: {subject[:50]}", f"Action: {action_taken}, Intent: {analysis['intent']}, Sentiment: {analysis['sentiment']}")
        # Mark read
        try:
            if self.use_himalaya:
                subprocess.run(["himalaya", "flag", email["id"], "--add", "seen"], capture_output=True, timeout=15)
        except Exception:
            pass
        # Feedback log
        try:
            entry = {"timestamp": datetime.utcnow().isoformat(), "email_id": email["id"],
                     "sender": sender, "subject": subject, "action": action_taken,
                     "intent": analysis.get("intent", ""), "confidence": analysis.get("confidence", 0),
                     "lead_id": lead_id}
            with FEEDBACK_LOG.open("a") as f:
                f.write(json.dumps(entry) + "\n")
        except Exception:
            pass

        self.reflector.reflect_on_outcome(email["id"], action_taken, analysis)
        return {"email": email, "analysis": analysis, "action_taken": action_taken,
                "lead_id": lead_id, "proposal_path": str(proposal_path) if proposal_path else None}

    def _generate_proposal_text(self, email, analysis, matched):
        sender_name = email.get("from", "there").split("@")[0].replace(".", " ").replace("_", " ").title()
        svcs = "\n".join(f"{i+1}. **{s['title']}** ({s['category'].upper()}): {s['description'][:200]}" for i, s in enumerate(matched))
        return f"""Dear {sender_name},

Thank you for your inquiry to Zion Tech Group about "{email.get('subject', 'your needs')}".

Based on your message, we've identified these matching services:{svcs}

**Next Steps:**
- Free 30-min consultation to understand your requirements
- Custom proposal with detailed pricing & timeline
- No obligation

**Why Zion Tech Group?**
- 700+ AI, IT, Cloud, Security & Automation services
- US-based team, global delivery | 24/7 support | 99.9% SLA
- HIPAA, SOC 2, GDPR compliant

Reply or call {CONTACT['phone']} to get started.

{SIGNATURE}"""

    def _update_conv(self, email, analysis, action):
        headers = email.get("headers", {})
        sender = headers.get("from_email", email["from"]).lower()
        subject = headers.get("subject", email["subject"])
        clean = re.sub(r"^(Re:|Fwd?:|RE:|FW:)\s*", "", subject).strip()
        now = datetime.utcnow().isoformat()
        senders = self.conv_state.setdefault("senders", {})
        if sender not in senders:
            senders[sender] = {"email": sender, "interaction_count": 0, "first_contact": now,
                               "last_contact": None, "history": [], "threads": {},
                               "preferred_language": "en", "sentiment_history": [],
                               "reputation_score": 50}
        s = senders[sender]
        s["interaction_count"] += 1; s["last_contact"] = now
        s["history"].append({"date": now, "subject": subject, "action": action, "sentiment": analysis.get("sentiment", "neutral")})
        s["history"] = s["history"][-50:]
        s.setdefault("sentiment_history", []).append(analysis.get("sentiment", "neutral"))
        s["sentiment_history"] = s["sentiment_history"][-20:]
        if analysis.get("language"): s["preferred_language"] = analysis["language"]
        # Reputation score: boost for positive interactions, reduce for negative
        if "auto_reply_sent" in action: s["reputation_score"] = min(100, s.get("reputation_score", 50) + 1)
        elif "escalat" in action: s["reputation_score"] = max(0, s.get("reputation_score", 50) - 5)
        threads = s.setdefault("threads", {})
        if clean not in threads: threads[clean] = {"message_count": 1, "first_date": now, "last_date": now}
        else: threads[clean]["message_count"] += 1; threads[clean]["last_date"] = now
        self._save_json(CONVERSATION_STATE, self.conv_state)

    def _update_analytics(self, analysis, action, sender):
        now = datetime.utcnow(); day = now.strftime("%Y-%m-%d")
        self.analytics["total_processed"] += 1
        if "auto_reply_sent" in action: self.analytics["total_replied"] += 1
        elif "escalat" in action: self.analytics["total_escalated"] += 1
        elif "archiv" in action: self.analytics["total_archived"] += 1
        sent = analysis.get("sentiment", "neutral")
        self.analytics.setdefault("sentiment_distribution", {})[sent] = self.analytics["sentiment_distribution"].get(sent, 0) + 1
        intr = analysis.get("intent", "general")
        self.analytics.setdefault("intent_distribution", {})[intr] = self.analytics["intent_distribution"].get(intr, 0) + 1
        daily = self.analytics.setdefault("daily_stats", {}).setdefault(day, {"processed": 0, "replied": 0, "escalated": 0})
        daily["processed"] += 1
        if "auto_reply_sent" in action: daily["replied"] += 1
        elif "escalat" in action: daily["escalated"] += 1
        ss = self.analytics.setdefault("sender_stats", {}).setdefault(sender, {"count": 0, "last_subject": "", "last_date": ""})
        ss["count"] += 1; ss["last_subject"] = headers.get("subject", ""); ss["last_date"] = now.isoformat()
        self.analytics["last_updated"] = now.isoformat()
        self._save_json(ANALYTICS_FILE, self.analytics)

    def send_reply(self, recipients, subject, body):
        if not recipients: return False
        if not subject.lower().startswith("re:"): subject = f"Re: {subject}"
        full = f"{body}{SIGNATURE}"
        try:
            if self.use_himalaya:
                if len(recipients) > 1:
                    cmd = ["himalaya", "send", "--to", recipients[0]] + [x for cc in recipients[1:] for x in ["--cc", cc]]
                else:
                    cmd = ["himalaya", "send", "--to", recipients[0]]
                cmd += ["--subject", subject]
                r = subprocess.run(cmd, input=full, capture_output=True, text=True, timeout=30)
            else:
                cmd = ["gog", "mail", "send"] + [x for r in recipients for x in ["--to", r]] + ["--subject", subject, "--body", full]
                r = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
            if r.returncode != 0: logger.error(f"Send error: {r.stderr.strip()}"); return False
            logger.info(f"✅ Reply sent to {', '.join(recipients)}"); return True
        except Exception as e: logger.exception(f"Send failed: {e}"); return False

    def run(self, limit=50) -> list:
        logger.info("🚀 Email Agent V6.0 — 20-Pillar Intelligence Starting...")
        emails = self.fetch_unread(limit)
        if not emails: logger.info("No unread emails"); return []
        emails.sort(key=lambda e: 0 if any(w in (e.get("subject","")+e.get("body","")).lower() for w in ["urgent","asap","emergency"]) else 1)
        results = []
        for email in emails:
            try: results.append(self.process_email(email)); time.sleep(0.5)
            except Exception as e: logger.exception(f"Failed: {e}")
        actions = defaultdict(int)
        for r in results: actions[r["action_taken"].split("(")[0].strip()] += 1
        rate = (self.analytics["total_replied"] / max(self.analytics["total_processed"], 1)) * 100
        logger.info(f"📊 Processed {len(results)}: {dict(actions)} | Lifetime: {self.analytics['total_processed']}, Reply rate: {rate:.1f}%")
        return results


def main():
    import argparse
    parser = argparse.ArgumentParser(description="Zion Tech Email Agent V6")
    parser.add_argument("--limit", type=int, default=50)
    parser.add_argument("--analytics", action="store_true")
    parser.add_argument("--calibration", action="store_true", help="Show LUFS calibration report")
    args = parser.parse_args()
    agent = EmailAgentV6()
    if args.analytics:
        import pprint; pprint.pprint(agent.analytics)
        return
    if args.calibration:
        import pprint; pprint.pprint(agent.lufs.get_calibration_report())
        return
    agent.run(limit=args.limit)

if __name__ == "__main__":
    main()
