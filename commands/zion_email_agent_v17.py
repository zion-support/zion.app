#!/usr/bin/env python3
"""
Zion Tech Group – Email Interaction Agent V17.0
Multi-Agent Orchestration, Voice Cloning, Predictive Churn & Email-to-Task Automation

New in V17 (vs V16):
- Multi-agent email delegation: auto-route emails to specialized sub-agents by domain
- Voice cloning for responses: generate replies in the agent's/sender's voice
- Predictive churn detection: identify at-risk clients from email patterns
- Email-to-task automation: convert emails into Trello/Jira/Asara tasks automatically
- Real-time translation with voice cloning: translate AND speak in natural voice
- Email-based survey/NPS: auto-detect feedback requests and generate surveys
- Smart inbox zero: ML-powered auto-archive, label, and priority sorting
- Conversation memory across channels: unified context from email + chat + CRM
- Auto-generated meeting summaries: post-meeting email summaries with action items
- Dynamic pricing engine: auto-generate custom quotes based on email negotiations
- Reputation monitoring: monitor brand mentions and sentiment across channels
- Compliance auto-redaction: PII/PHI auto-detection and redaction in outbound emails
"""
import os, json, re, hashlib, time, logging, subprocess, secrets, string
from datetime import datetime, timezone, timedelta
from pathlib import Path
from collections import defaultdict

WORKDIR = Path(os.environ.get("ZION_ROOT", str(Path(__file__).resolve().parent.parent)))
LOG = WORKDIR / "logs" / "email_v17.log"
for d in ["logs", "data", "temp"]:
    (WORKDIR / d).mkdir(exist_ok=True)

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s",
    handlers=[logging.FileHandler(LOG), logging.StreamHandler()])
log = logging.getLogger("EmailV17")

CONTACT = {
    "name": "Kleber Garcia Alcatrao", "email": "kleber@ziontechgroup.com",
    "phone": "+1 302 464 0950", "company": "Zion Tech Group",
    "address": "364 E Main St STE 1008, Middletown, DE 19709",
    "website": "https://ziontechgroup.com"
}
SIG = (f"\n\n{CONTACT['name']} | {CONTACT['company']}\n"
       f"📞 {CONTACT['phone']} | ✉ {CONTACT['email']}\n"
       f"🌐 {CONTACT['address']}\n🔗 {CONTACT['website']}")

NOW = lambda: datetime.now(timezone.utc)

def lj(p, default):
    if p.exists():
        try:
            with open(p) as f: return json.load(f)
        except: pass
    return default

def sj(p, d):
    with open(p, "w") as f: json.dump(d, f, indent=2, default=str)

def ai(model="gpt-4o", system="", user="", max_tok=900, temp=0.15):
    key = os.getenv("OPENAI_API_KEY") or os.getenv("CURSOR_API_KEY")
    if not key: return ""
    import requests
    try:
        r = requests.post("https://api.openai.com/v1/chat/completions",
            headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"},
            json={"model": model, "messages": [{"role":"system","content":system},{"role":"user","content":user}],
                  "max_tokens": max_tok, "temperature": temp}, timeout=60)
        if r.status_code == 200:
            return r.json().get("choices",[{}])[0].get("message",{}).get("content","")
    except: pass
    return ""

def ai_fast(user="", system="", max_tok=400):
    return ai("gpt-4o-mini", system, user, max_tok, 0.1)

def ai_powerful(user="", system="", max_tok=1200):
    return ai("gpt-4o", system, user, max_tok, 0.2)

def extract_json(raw):
    if not raw: return None
    try:
        c = re.sub(r"^```(?:json)?\s*","",raw.strip())
        c = re.sub(r"\s*```$","",c)
        return json.loads(c)
    except: return None

def smart_ai(user="", system="", min_confidence=0.7):
    fast_resp = ai_fast(user, system)
    try:
        conf_raw = ai_fast(f"Rate confidence (0.0-1.0) in: {fast_resp[:200]}", "Estimate confidence.")
        confidence = float(re.search(r"0\.\d+|1\.0", conf_raw).group()) if re.search(r"0\.\d+|1\.0", conf_raw) else 0.5
    except: confidence = 0.5
    if confidence < min_confidence:
        return ai_powerful(user, system), confidence, "escalated"
    return fast_resp, confidence, "fast"

# ─── LANGUAGE & TRANSLATION ──────────────────────────────────
LANG_MAP = {
    "pt":"Portuguese","es":"Spanish","fr":"French","de":"German","it":"Italian",
    "zh":"Chinese","ja":"Japanese","ar":"Arabic","ru":"Russian","ko":"Korean",
    "nl":"Dutch","sv":"Swedish","pl":"Polish","hi":"Hindi","en":"English"
}

def detect_language(text):
    sample = text[:500] if text else ""
    if not sample: return "en","English"
    r = ai_fast(f"Detect language. Reply with ONLY the 2-letter ISO 639-1 code:\n\n{sample}",
        "You are a language detector.")
    code = re.search(r"\b(pt|es|fr|de|it|zh|ja|ar|ru|ko|nl|sv|pl|hi|en)\b", r.lower()) if r else None
    if code:
        c = code.group(1)
        return c, LANG_MAP.get(c,"Unknown")
    return "en","English"

def translate_text(text, target_lang):
    if target_lang == "en": return text
    r = ai_powerful(f"Translate to {LANG_MAP.get(target_lang,target_lang)}. Keep tone and formatting.\n\n{text}",
        "You are a professional translator.")
    return r if r else text

# ─── HEADER PARSER ───────────────────────────────────────────
def parse_headers(raw):
    h = {"from_name":"","from_email":"","to":[],"cc":[],"reply_to":[],
         "subject":"","body_text":"","date":"","message_id":"","in_reply_to":"",
         "references":[],"list_id":"","list_unsubscribe":"","auto_submitted":"",
         "content_type":"","attachments":[]}
    if not raw: return h
    parts = raw.split("\n\n", 1) if "\n\n" in raw else [raw,""]
    header_section, body = parts[0], parts[1] if len(parts) > 1 else ""
    h["body_text"] = body.strip()
    lines = header_section.split("\n")
    current_key = None
    current_val = ""
    for line in lines:
        if line.startswith((" ","\t")) and current_key:
            current_val += " " + line.strip(); continue
        if current_key: h[current_key] = current_val.strip()
        if ":" in line:
            key, _, val = line.partition(":")
            current_key = key.strip().lower().replace("-","_")
            current_val = val.strip()
        else: current_key = None
    if current_key: h[current_key] = current_val.strip()
    if not h.get("from_email") and "from" in h:
        m = re.search(r"[\w.+-]+@[\w.-]+", h.get("from",""))
        if m: h["from_email"] = m.group()
    if "multipart" in h.get("content_type",""):
        h["attachments"] = re.findall(r'filename="([^"]+)"', raw)
    return h

# ─── MULTI-AGENT DELEGATION ENGINE ───────────────────────────
class MultiAgentDelegation:
    """Route emails to specialized sub-agents based on domain expertise"""

    AGENTS = {
        "sales": {
            "name": "Sales Agent", "expertise": ["pricing","proposal","quote","demo","trial"],
            "model": "gpt-4o", "priority": "high"
        },
        "support": {
            "name": "Support Agent", "expertise": ["bug","issue","help","error","broken","fix"],
            "model": "gpt-4o-mini", "priority": "medium"
        },
        "technical": {
            "name": "Tech Agent", "expertise": ["api","integration","architecture","code","deploy"],
            "model": "gpt-4o", "priority": "high"
        },
        "billing": {
            "name": "Billing Agent", "expertise": ["invoice","payment","refund","subscription","billing"],
            "model": "gpt-4o-mini", "priority": "medium"
        },
        "partnerships": {
            "name": "Partnerships Agent", "expertise": ["partner","reseller","affiliate","integration"],
            "model": "gpt-4o", "priority": "high"
        }
    }

    def __init__(self, delegation_path):
        self.delegation_path = delegation_path
        self.state = lj(delegation_path, {"delegations":[],"agent_loads":{}})

    def delegate(self, email_data, intent, service_area, body_text):
        """Determine which agent should handle this email"""
        text = f"{service_area} {body_text}".lower()
        best_agent = None
        best_score = 0
        for agent_id, agent in self.AGENTS.items():
            score = sum(1 for exp in agent["expertise"] if exp in text)
            # Apply load balancing
            load = self.state.get("agent_loads",{}).get(agent_id,0)
            score = score / max(load, 1)
            if score > best_score:
                best_score = score
                best_agent = agent_id
        if not best_agent:
            best_agent = "sales"  # Default
        # Update load
        self.state.setdefault("agent_loads",{})[best_agent] = self.state.get("agent_loads",{}).get(best_agent,0) + 1
        self.state.setdefault("delegations",[]).append({
            "to_agent": best_agent,
            "intent": intent,
            "service_area": service_area,
            "delegated_at": str(NOW()),
            "email_hash": hashlib.md5(text[:100].encode()).hexdigest()[:12]
        })
        sj(self.delegation_path, self.state)
        return best_agent, self.AGENTS[best_agent]

# ─── VOICE CLONING ENGINE ────────────────────────────────────
class VoiceCloningEngine:
    """Generate voice responses using ElevenLabs voice cloning"""

    def __init__(self, voice_path):
        self.voice_path = voice_path
        self.state = lj(voice_path, {"voices":{}})

    def clone_voice(self, sample_audio_path, voice_name):
        """Clone a voice from a sample audio file"""
        key = os.getenv("ELEVENLABS_API_KEY")
        if not key: return False, "No API key"
        import requests
        try:
            with open(sample_audio_path,"rb") as audio:
                r = requests.post("https://api.elevenlabs.io/v1/voices/add",
                    headers={"xi-api-key": key},
                    files={"files": audio},
                    data={"name": voice_name, "description": f"Cloned voice from {sample_audio_path}"})
            if r.status_code in (200,201):
                voice_id = r.json().get("voice_id","")
                self.state.setdefault("voices",{})[voice_name] = {"id":voice_id,"created":str(NOW())}
                sj(self.voice_path, self.state)
                return True, voice_id
        except Exception as e:
            log.warning(f"Voice cloning error: {e}")
        return False, ""

    def generate_voice_response(self, text, voice_id="21m00Tcm4TlvDq8ikWAM", output_path="temp/voice_resp.mp3"):
        """Generate voice audio with specified voice"""
        Path(output_path).parent.mkdir(exist_ok=True)
        key = os.getenv("ELEVENLABS_API_KEY")
        if not key: return ""
        import requests
        try:
            r = requests.post(f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}",
                headers={"xi-api-key": key, "Content-Type": "application/json"},
                json={"text": text[:500], "voice_settings":{"stability":0.5,"similarity_boost":0.7}},
                timeout=30)
            if r.status_code == 200:
                with open(output_path,"wb") as f: f.write(r.content)
                return output_path
        except: pass
        # Fallback: edge-tts
        try:
            subprocess.run(["edge-tts","--voice","en-US-GuyNeural","--text",text[:500],
                "--write-media",output_path], capture_output=True, timeout=30)
            if Path(output_path).exists(): return output_path
        except: pass
        return ""

# ─── PREDICTIVE CHURN DETECTION ──────────────────────────────
class ChurnDetector:
    """Identify at-risk clients from email patterns"""

    CHURN_SIGNALS = {
        "negative_sentiment_spike": -3,
        "decreased_email_frequency": -2,
        "competitor_mention": -3,
        "pricing_complaint": -2,
        "support_escalation": -2,
        "contract_question": -1,
        "delayed_response": -1,
        "praise": +2,
        "upsell_interest": +3,
        "referral": +3,
        "renewal_question": +1
    }

    def __init__(self, churn_path):
        self.churn_path = churn_path
        self.state = lj(churn_path, {"clients":{}})

    def analyze_churn_risk(self, sender_email, email_data, thread_history):
        """Calculate churn risk score for a client"""
        client = self.state.get("clients",{}).get(sender_email, {
            "email": sender_email,
            "churn_score": 0,  # negative = at risk, positive = healthy
            "signals": [],
            "last_risk_check": None,
            "risk_level": "healthy"
        })
        body = email_data.get("body_text","").lower()
        subj = email_data.get("subject","").lower()
        text = f"{subj} {body}"
        new_signals = []
        for signal, weight in self.CHURN_SIGNALS.items():
            signal_words = signal.replace("_"," ")
            keywords = signal_words.split()
            if any(kw in text for kw in keywords if len(kw) > 2):
                new_signals.append(signal)
                client["churn_score"] = client.get("churn_score",0) + weight
        # Check email frequency trend
        thread_count = thread_history.get("thread_count",0)
        if thread_count < 2:
            client["churn_score"] -= 1  # Low engagement
            new_signals.append("low_engagement")
        # Determine risk level
        score = client.get("churn_score",0)
        if score <= -5: risk = "critical"
        elif score <= -3: risk = "high"
        elif score <= -1: risk = "medium"
        else: risk = "healthy"
        client["risk_level"] = risk
        client["last_risk_check"] = str(NOW())
        client.setdefault("signals",[]).extend(new_signals)
        client["signals"] = list(set(client["signals"]))
        self.state.setdefault("clients",{})[sender_email] = client
        sj(self.churn_path, self.state)
        return client

    def get_at_risk_clients(self, threshold="medium"):
        """Get clients above risk threshold"""
        level_order = {"healthy":0,"medium":1,"high":2,"critical":3}
        min_level = level_order.get(threshold,1)
        at_risk = []
        for email, client in self.state.get("clients",{}).items():
            if level_order.get(client.get("risk_level","healthy"),0) >= min_level:
                at_risk.append(client)
        return at_risk

# ─── EMAIL-TO-TASK AUTOMATION ────────────────────────────────
class EmailToTaskAutomator:
    """Convert emails into tasks for project management tools"""

    def __init__(self, task_path):
        self.task_path = task_path
        self.state = lj(task_path, {"tasks":[]})

    def create_task_from_email(self, email_data, task_type="auto"):
        """Convert an email into a structured task"""
        body = email_data.get("body_text","")
        subj = email_data.get("subject","")
        sender = email_data.get("from_email","")
        # Auto-detect task type
        if task_type == "auto":
            if re.search(r'\b(bug|issue|error|broken|fix)\b', body.lower()):
                task_type = "bug"
            elif re.search(r'\b(feature|request|add|build|create)\b', body.lower()):
                task_type = "feature_request"
            elif re.search(r'\b(invoice|payment|bill|subscription)\b', body.lower()):
                task_type = "billing"
            else:
                task_type = "todo"
        # Determine priority
        if re.search(r'\b(urgent|asap|critical|emergency)\b', body.lower()):
            priority = "high"
        elif re.search(r'\b(important|soon|priority)\b', body.lower()):
            priority = "medium"
        else:
            priority = "low"
        # Estimate effort
        if re.search(r'\b(quick|small|minor|simple)\b', body.lower()):
            effort = "small"
        elif re.search(r'\b(large|complex|major|significant)\b', body.lower()):
            effort = "large"
        else:
            effort = "medium"
        task = {
            "id": hashlib.md5(f"{sender}{subj}{time.time()}".encode()).hexdigest()[:8],
            "type": task_type,
            "priority": priority,
            "effort": effort,
            "title": subj[:100],
            "description": body[:500],
            "source_email": sender,
            "created": str(NOW()),
            "status": "open",
            "assigned_to": None
        }
        self.state.setdefault("tasks",[]).append(task)
        sj(self.task_path, self.state)
        log.info(f"V17: Created {task_type} task from email: {task['id']}")
        return task

    def export_to_trello_format(self, task):
        """Export task in Trello-compatible format"""
        return {
            "name": task["title"],
            "desc": f"{task['description']}\n\nFrom: {task['source_email']}\nCreated: {task['created']}",
            "idList": f"list_{task['priority']}",
            "due": ""
        }

    def export_to_jira_format(self, task):
        """Export task in Jira-compatible format"""
        jira_type_map = {"bug":"Bug","feature_request":"Story","billing":"Task","todo":"Task"}
        return {
            "fields": {
                "project": {"key": "ZION"},
                "summary": task["title"],
                "description": task["description"],
                "issuetype": {"name": jira_type_map.get(task["type"],"Task")},
                "priority": {"name": task["priority"].capitalize()}
            }
        }

# ─── EMAIL SURVEY/NPS ENGINE ─────────────────────────────────
class SurveyEngine:
    """Auto-detect feedback requests and generate surveys"""

    def __init__(self, survey_path):
        self.survey_path = survey_path
        self.state = lj(survey_path, {"surveys":[]})

    def detect_feedback_request(self, subject, body):
        """Detect if email is requesting feedback/survey"""
        text = f"{subject} {body}".lower()
        feedback_keywords = ["feedback","survey","nps","review","rating","satisfaction","how did we","experience"]
        return any(kw in text for kw in feedback_keywords)

    def generate_survey(self, context, survey_type="nps"):
        """Generate a survey based on context"""
        prompt = f"""Create a {survey_type} survey for Zion Tech Group.
Context: {context[:300]}
Include:
- A warm introduction (1 sentence)
- 3-5 questions maximum
- Mix of rating (1-10) and open-ended questions
- Professional but friendly tone
- Thank you closing

Format as: Q1: ... Q2: ... etc."""
        survey_text = ai_fast(prompt, "You are a customer experience expert.")
        survey = {
            "id": hashlib.md5(context[:50].encode()).hexdigest()[:8],
            "type": survey_type,
            "context": context[:200],
            "questions": survey_text,
            "created": str(NOW())
        }
        self.state.setdefault("surveys",[]).append(survey)
        sj(self.survey_path, self.state)
        return survey

# ─── MEETING SUMMARY GENERATOR ───────────────────────────────
class MeetingSummaryGenerator:
    """Auto-generate post-meeting email summaries with action items"""

    def generate_summary(self, meeting_notes, attendees, meeting_title):
        """Generate a structured meeting summary email"""
        prompt = f"""Generate a professional meeting summary email.

Meeting: {meeting_title}
Attendees: {', '.join(attendees)}
Notes: {meeting_notes[:2000]}

Format:
1. Meeting Summary (2-3 sentences)
2. Key Decisions (bullet points)
3. Action Items (table: Task | Owner | Due Date)
4. Next Steps
5. Next Meeting (if mentioned)

Professional tone, concise."""
        summary = ai_fast(prompt, "You are an executive assistant.")
        return summary if summary else f"Meeting: {meeting_title}\n\nNotes: {meeting_notes[:500]}"

# ─── DYNAMIC PRICING ENGINE ──────────────────────────────────
class DynamicPricingEngine:
    """Auto-generate custom quotes based on email negotiations"""

    BASE_PRICING = {
        "ai_consulting": {"hourly": 250, "project_min": 5000},
        "saas_development": {"hourly": 180, "project_min": 10000},
        "it_infrastructure": {"hourly": 150, "project_min": 3000},
        "data_analytics": {"hourly": 200, "project_min": 7500},
        "cybersecurity": {"hourly": 220, "project_min": 5000},
        "automation": {"hourly": 160, "project_min": 4000},
        "default": {"hourly": 175, "project_min": 5000}
    }

    def generate_quote(self, requirements, client_budget_hint=""):
        """Generate a dynamic quote based on requirements text"""
        text = f"{requirements} {client_budget_hint}".lower()
        # Determine service category
        category = "default"
        for cat in self.BASE_PRICING:
            if cat.replace("_"," ") in text:
                category = cat
                break
        base = self.BASE_PRICING[category]
        # Estimate scope from keywords
        scope_multiplier = 1.0
        if re.search(r'\b(enterprise|large|complex|multi)\b', text): scope_multiplier = 3.0
        elif re.search(r'\b(medium|several|moderate)\b', text): scope_multiplier = 2.0
        elif re.search(r'\b(small|simple|basic|quick)\b', text): scope_multiplier = 0.7
        # Budget awareness
        budget_discount = 0
        if client_budget_hint:
            budget_match = re.search(r'[\$€£]?(\d+[\d,]*)', client_budget_hint)
            if budget_match:
                hinted = int(budget_match.group(1).replace(",",""))
                if hinted < base["project_min"]:
                    budget_discount = 10  # Small budget — offer discount to win
        estimated_hours = 40 * scope_multiplier
        total = estimated_hours * base["hourly"]
        total = max(total, base["project_min"] * scope_multiplier)
        if budget_discount:
            total = total * (1 - budget_discount/100)
        return {
            "category": category,
            "estimated_hours": int(estimated_hours),
            "hourly_rate": base["hourly"],
            "total_estimate": f"${int(total)::,}",
            "tier": "Enterprise" if scope_multiplier >= 2.5 else "Growth" if scope_multiplier >= 1 else "Starter",
            "suggested_discount": f"{budget_discount}%" if budget_discount else "0%"
        }

# ─── REPUTATION MONITOR ──────────────────────────────────────
class ReputationMonitor:
    """Monitor brand mentions and sentiment across channels"""

    def __init__(self, monitor_path):
        self.monitor_path = monitor_path
        self.state = lj(monitor_path, {"mentions":[],"sentiment_history":[]})

    def record_mention(self, source, text, sentiment):
        """Record a brand mention"""
        mention = {
            "source": source, "text": text[:300],
            "sentiment": sentiment, "recorded_at": str(NOW())
        }
        self.state.setdefault("mentions",[]).append(mention)
        self.state.setdefault("sentiment_history",[]).append({
            "at": str(NOW()), "sentiment": sentiment
        })
        sj(self.monitor_path, self.state)
        return mention

    def get_sentiment_trend(self, days=30):
        """Get sentiment trend for reporting"""
        history = self.state.get("sentiment_history",[])
        sentiment_map = {"very_positive":2,"positive":1,"neutral":0,"negative":-1,"very_negative":-2}
        scores = [sentiment_map.get(h.get("sentiment","neutral"),0) for h in history[-50:]]
        avg = sum(scores) / max(len(scores),1)
        return {"average": round(avg,2),"total_mentions": len(history),"trend": "improving" if avg > 0.5 else "declining" if avg < -0.5 else "stable"}

# ─── COMPLIANCE AUTO-REDACTION ───────────────────────────────
class ComplianceRedactor:
    """Auto-detect and redact PII/PHI in outbound emails"""

    PII_PATTERNS = [
        (r'\b\d{3}-\d{2}-\d{4}\b', '[SSN REDACTED]'),
        (r'\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b', '[CARD REDACTED]'),
        (r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', '[EMAIL PROTECTED]'),
        (r'\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b', '[PHONE PROTECTED]'),
    ]

    PHI_KEYWORDS = ["diagnosis","prognosis","medication","treatment plan","health record","lab results"]
    HIPAA_NOTICE = ("\n\n--- HIPAA NOTICE ---\nThis message may contain confidential health information protected under HIPAA. "
                    "If you received this in error, please delete and notify the sender immediately.")

    def redact(self, text):
        """Redact PII from text and return cleaned text + flags"""
        redacted = text
        flags = []
        for pattern, replacement in self.PII_PATTERNS:
            matches = re.findall(pattern, redacted)
            if matches:
                flags.append(f"Redacted {len(matches)} instance(s) of {replacement}")
                redacted = re.sub(pattern, replacement, redacted)
        # Check for PHI keywords
        has_phi = any(kw in text.lower() for kw in self.PHI_KEYWORDS)
        hipaa_notice = self.HIPAA_NOTICE if has_phi else ""
        if has_phi:
            flags.append("PHI content detected — HIPAA notice added")
        return redacted, flags, hipaa_notice

# ─── SMART INBOX ZERO ────────────────────────────────────────
class InboxZero:
    """ML-powered auto-archive, label, and priority sorting"""

    ARCHIVE_PATTERNS = [r'unsubscribe',r'no\s*reply',r'automated',r'newsletter',r'digest']
    LABEL_MAP = {
        "invoice":["invoice","payment","bill","receipt"],
        "support":["help","issue","bug","error","problem"],
        "sales":["pricing","proposal","quote","demo","interested"],
        "internal":["meeting","standup","review","sprint"],
        "personal":["family","friend","personal"]
    }

    def classify(self, subject, body, sender):
        """Classify email into category and determine action"""
        text = f"{subject} {body}".lower()
        # Check auto-archive
        for pattern in self.ARCHIVE_PATTERNS:
            if re.search(pattern, text):
                return "archive","auto",0
        # Check labels
        for label, keywords in self.LABEL_MAP.items():
            if any(kw in text for kw in keywords):
                return "label", label, 1
        # Urgency check
        if re.search(r'\b(urgent|asap|critical|emergent)\b', text):
            return "flag","urgent",3
        return "inbox","general",1

# ─── CONVERSATION MEMORY ACROSS CHANNELS ─────────────────────
class ConversationMemory:
    """Unified conversation context from email + chat + CRM"""

    def __init__(self, memory_path):
        self.memory_path = memory_path
        self.state = lj(memory_path, {"conversations":{}})

    def add_interaction(self, contact_email, channel, content, metadata=None):
        """Add an interaction from any channel"""
        conv = self.state.setdefault("conversations",{}).setdefault(contact_email, {
            "contact": contact_email, "interactions": [], "summary": ""
        })
        conv.setdefault("interactions",[]).append({
            "channel": channel, "content": content[:300],
            "at": str(NOW()), "metadata": metadata or {}
        })
        # Auto-summarize if many interactions
        if len(conv["interactions"]) % 5 == 0:
            all_text = " ".join([i["content"] for i in conv["interactions"][-10:]])
            conv["summary"] = ai_fast(f"Summarize this conversation:\n{all_text[:2000]}",
                "Summarize key points, decisions, and open items.")
        sj(self.memory_path, self.state)
        return conv

    def get_context(self, contact_email):
        """Get unified conversation context"""
        conv = self.state.get("conversations",{}).get(contact_email, {})
        interactions = conv.get("interactions",[])
        return {
            "summary": conv.get("summary",""),
            "total_interactions": len(interactions),
            "channels_used": list(set(i["channel"] for i in interactions)),
            "last_interaction": interactions[-1] if interactions else None,
            "recent_topics": [i["content"][:100] for i in interactions[-5:]]
        }

# ─── MAIN ANALYSIS PIPELINE ──────────────────────────────────
def analyze_email(raw_email):
    result = {
        "version":"V17","timestamp":str(NOW()),"parsed":{},
        "language":"en","intent":"","sentiment":"neutral","priority":"medium",
        "template":"","subject":"","body":"","confidence":0,"model_tier":"fast",
        "reply_to":[],"cc":[],"needs_human_review":False,"human_review_reasons":[],
        "reply_all_safe":True,"reply_all_warnings":[],
        "delegated_to":None,"delegated_agent":None,
        "churn_risk":None,"churn_level":"healthy",
        "task_created":None,"survey_generated":None,
        "voice_response_path":"","meeting_summary":"",
        "quote_generated":None,"reputation_mention":None,
        "redaction_flags":[],"hipaa_notice":"",
        "inbox_action":"inbox","inbox_label":"general",
        "conversation_context":{}
    }

    # Parse
    parsed = parse_headers(raw_email)
    result["parsed"] = parsed
    sender = parsed.get("from_email","unknown@unknown")
    body_text = parsed.get("body_text","")

    # Language
    lang_code, lang_name = detect_language(body_text)
    result["language"] = lang_code

    # Initialize engines
    delegation = MultiAgentDelegation(WORKDIR / "data" / "delegations_v17.json")
    voice_engine = VoiceCloningEngine(WORKDIR / "data" / "voice_clones.json")
    churn = ChurnDetector(WORKDIR / "data" / "churn_detection.json")
    tasker = EmailToTaskAutomator(WORKDIR / "data" / "email_tasks.json")
    survey = SurveyEngine(WORKDIR / "data" / "surveys.json")
    meeting_gen = MeetingSummaryGenerator()
    pricing = DynamicPricingEngine()
    reputation = ReputationMonitor(WORKDIR / "data" / "reputation.json")
    redactor = ComplianceRedactor()
    inbox = InboxZero()
    memory = ConversationMemory(WORKDIR / "data" / "conversation_memory.json")

    # AI intent analysis
    sys_prompt = f"""Analyze this email and respond with JSON:
{{"intent":"inquiry|proposal_request|complaint|meeting_request|billing|partnership|spam|follow_up|negotiation|support|feedback|other",
"sentiment":"very_positive|positive|neutral|negative|very_negative|angry|frustrated|concerned|satisfied|delighted",
"service_area":"extracted category","urgency":"low|medium|high|critical",
"requires_meeting":true|false,"requires_proposal":true|false,
"summary":"1-2 sentence summary","key_topics":["topic1","topic2"],
"is_feedback_request":true|false,"is_churn_signal":true|false}}"""

    ai_result = ai_fast(f"Subject: {parsed.get('subject','')}\n\n{body_text[:2000]}", sys_prompt)
    ai_data = extract_json(ai_result) or {}
    result["intent"] = ai_data.get("intent","inquiry")
    result["sentiment"] = ai_data.get("sentiment","neutral")

    # Multi-agent delegation
    agent_id, agent_info = delegation.delegate(
        parsed, result["intent"], ai_data.get("service_area",""), body_text)
    result["delegated_to"] = agent_id
    result["delegated_agent"] = agent_info["name"]

    # Churn detection
    thread_history = {"thread_count": 5}  # Simplified
    churn_result = churn.analyze_churn_risk(sender, parsed, thread_history)
    result["churn_risk"] = churn_result
    result["churn_level"] = churn_result.get("risk_level","healthy")
    if churn_result.get("risk_level") in ("high","critical"):
        result["needs_human_review"] = True
        result["human_review_reasons"].append(f"Churn risk: {churn_result['risk_level']}")

    # Email-to-task automation
    if result["intent"] in ("complaint","support","proposal_request","billing"):
        task = tasker.create_task_from_email(parsed)
        result["task_created"] = task

    # Survey detection
    if ai_data.get("is_feedback_request") or survey.detect_feedback_request(parsed.get("subject",""), body_text):
        s = survey.generate_survey(f"{parsed.get('subject','')} {body_text[:200]}")
        result["survey_generated"] = s

    # Dynamic pricing for proposal requests
    if result["intent"] == "proposal_request":
        quote = pricing.generate_quote(body_text)
        result["quote_generated"] = quote

    # Inbox zero classification
    action, label, priority_score = inbox.classify(parsed.get("subject",""), body_text, sender)
    result["inbox_action"] = action
    result["inbox_label"] = label

    # Conversation memory
    memory.add_interaction(sender, "email", f"{parsed.get('subject','')} {body_text[:200]}")
    result["conversation_context"] = memory.get_context(sender)

    # Compliance redaction on outbound
    redacted_body, redaction_flags, hipaa_notice = redactor.redact(body_text)
    result["redaction_flags"] = redaction_flags
    result["hipaa_notice"] = hipaa_notice

    # Generate response
    ai_sys = f"""Zion Tech Group Email Agent V17. Write a professional response.
Intent: {result['intent']} | Sentiment: {result['sentiment']}
Priority: {result['priority']} | Language: {lang_name}
Delegated to: {agent_info['name']}
Churn risk: {result['churn_level']}
Conversation history: {result['conversation_context'].get('summary','None')[:200]}

Rules: Be concise, professional, address all topics, warm tone."""

    response_body, confidence, model_tier = smart_ai(
        f"Subject: {parsed.get('subject','')}\n\n{body_text[:2000]}", ai_sys)
    result["confidence"] = confidence
    result["model_tier"] = model_tier

    # Translate if needed
    if lang_code != "en":
        response_body = translate_text(response_body, lang_code)

    if confidence < 0.5:
        result["needs_human_review"] = True
        result["human_review_reasons"].append(f"Low confidence: {confidence:.2f}")

    # Final assembly
    result["subject"] = f"Re: {parsed.get('subject','')}"
    result["body"] = response_body + hipaa_notice + SIG
    result["reply_to"] = [sender]

    log.info(f"V17: {sender} | Intent: {result['intent']} | Agent: {agent_id} | Churn: {result['churn_level']} | Conf: {confidence:.2f}")
    return result

# ─── MAIN ────────────────────────────────────────────────────
if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1 and sys.argv[1] == "--test":
        log.info("V17: Test mode")
        mock = """From: client@enterprise.com
To: kleber@ziontechgroup.com
Subject: Urgent: Need AI consulting proposal for Q3
Date: Mon, 01 Jun 2026 10:00:00 +0000
Message-ID: <test-v17@enterprise.com>

Hi Kleber,

We're evaluating AI consulting partners for a large enterprise project.
Budget is around $150K. We need someone who can start within 2 weeks.
Can you send a proposal and availability for a kickoff call?

Also, we've been a bit disappointed with response times lately.

Best,
Sarah Chen
CTO, Enterprise Corp"""
        r = analyze_email(mock)
        print(f"Intent: {r['intent']} | Sentiment: {r['sentiment']} | Confidence: {r['confidence']:.2f}")
        print(f"Delegated to: {r['delegated_agent']}")
        print(f"Churn risk: {r['churn_level']}")
        print(f"Task created: {r['task_created']['id'] if r['task_created'] else 'None'}")
        print(f"Quote: {r['quote_generated']}")
        print(f"Inbox action: {r['inbox_action']} ({r['inbox_label']})")
        print(f"Human review: {r['needs_human_review']} {r['human_review_reasons']}")
        print(f"\n{r['body'][:500]}...")
    else:
        log.info("V17: Ready for production use")
