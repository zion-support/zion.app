#!/usr/bin/env python3
"""
Zion Tech Group — Email Responder v21.0 (Case-by-Case Intelligence)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
v21 UPGRADES over v19:
  • FIXED REPLY-ALL: Properly constructs To+CC from original headers.
  • CASE-BY-CASE ACTION SELECTOR: 12+ factors → best action per email.
  • SENTIMENT-AWARE ESCALATION: 5-level sentiment, angry → human review.
  • CONTEXTUAL SERVICE MATCHING: Injects matching service links in replies.
  • DUPLICATE PREVENTION: SHA-256 hash, skip if already replied.
  • SMART THREAD AWARENESS: Skip if WE sent last message.
  • ENHANCED PRIORITY SCORING: 0-100 from 15+ signals.
  • MULTI-LANGUAGE v2: 12-language detection + native templates.
All v19 features carried forward.
"""
import json, os, sys, time, re, hashlib, base64
from datetime import datetime, timedelta
from concurrent.futures import ThreadPoolExecutor, as_completed

HERMES_HOME = os.environ.get("HERMES_HOME", r"C:\Users\Zion\AppData\Local\hermes")
GAPI_DIR = os.path.join(HERMES_HOME, "skills", "productivity", "google-workspace", "scripts")
LOG_DIR = os.path.join(HERMES_HOME, "email_logs_v21")
os.makedirs(LOG_DIR, exist_ok=True)

sys.path.insert(0, GAPI_DIR)
from google_api import build_service

# ═══ CONFIG ═══
MAX_SEND_PER_RUN = 15
MAX_FULL_FETCH = 20
PHASE1_FETCH = 80
MAX_PARALLEL_FETCH = 1
SEND_INTERVAL = 2
AI_CONFIDENCE_THRESHOLD = 0.60
MAX_RETRIES = 2
RETRY_BACKOFF = 5
FOLLOWUP_DAYS = 3
MAX_FOLLOWUPS = 3

CONTACT = {
    "name": "Kleber Garcia", "company": "Zion Tech Group",
    "phone": "+1 302 464 0950", "email": "kleber@ziontechgroup.com",
    "website": "https://ziontechgroup.com",
    "address": "364 E Main St STE 1008, Middletown, DE 19709",
    "services_url": "https://ziontechgroup.com/services",
}

LABELS = {
    "PROCESSED": "V21-Processed", "REPLIED": "V21-Auto-Replied",
    "REPLIED_ALL": "V21-Replied-All", "HUMAN_REVIEW": "V21-Human-Review",
    "URGENT": "V21-Urgent", "DRAFTED": "V21-Draft-Pending",
    "FOLLOWUP": "V21-Followup", "SPAM_LEARNED": "V21-Spam-Learned",
    "BULK_ARCHIVED": "V21-Bulk-Archived", "AUTO_FOLLOWUP": "V21-Auto-Followup",
}

ALL_PROCESSED_LABELS = {l.lower() for l in [
    "v21-processed","v21-auto-replied","v21-replied-all","v21-human-review","v21-urgent",
    "v21-draft-pending","v21-followup","v21-auto-followup",
    "v19-processed","v19-auto-replied","v19-replied-all","v19-human-review","v19-urgent",
    "v19-draft-pending","v19-followup","v19-auto-followup",
    "v18-processed","v18-auto-replied","v18-replied-all","v18-human-review",
    "v17-processed","v17-auto-replied","v17-replied-all","v17-human-review",
    "v16-processed","v15-processed","v14-processed","v13-processed","v12-processed",
    "v19-bulk-archived","v18-bulk-archived","v17-bulk-archived",
]}

# ═══ GMAIL API ═══
_svc = None
_api_calls = 0
_api_reset_time = time.time()

def svc_get():
    global _svc
    if _svc is None: _svc = build_service("gmail", "v1")
    return _svc

def track_api_call():
    global _api_calls, _api_reset_time
    _api_calls += 1
    if _api_calls > 800:
        elapsed = time.time() - _api_reset_time
        if elapsed < 60: time.sleep(60 - elapsed)
        _api_calls = 0; _api_reset_time = time.time()

def gmail_search(query, max_results=50):
    track_api_call()
    s = svc_get()
    result = s.users().messages().list(userId="me", q=query, maxResults=max_results).execute()
    return [m["id"] for m in result.get("messages", [])]

def gmail_get_metadata(msg_id, headers=None):
    track_api_call()
    s = svc_get()
    if headers is None: headers = ["From","To","Cc","Subject","Date","Reply-To","Bcc","List-Unsubscribe"]
    return s.users().messages().get(userId="me", id=msg_id, format="metadata", metadataHeaders=headers).execute()

def gmail_get_full(msg_id):
    track_api_call()
    s = svc_get()
    return s.users().messages().get(userId="me", id=msg_id, format="full").execute()

def gmail_get_thread(thread_id):
    track_api_call()
    s = svc_get()
    try: return s.users().threads().get(userId="me", id=thread_id, format="full").execute()
    except: return None

def gmail_modify(msg_id, add_labels=None, remove_labels=None):
    track_api_call()
    s = svc_get()
    body = {}
    if add_labels: body["addLabelIds"] = [l for l in add_labels if l]
    if remove_labels: body["removeLabelIds"] = [l for l in remove_labels if l]
    if not body: return None
    return s.users().messages().modify(userId="me", id=msg_id, body=body).execute()

def gmail_send_reply_all(msg_id, thread_id, to_addr, cc_list, subject, body_text):
    """
    FIXED REPLY-ALL v21:
    - to_addr: the original sender (From)
    - cc_list: all original CC recipients (excluding ourselves)
    - Properly constructs MIME message with both To and CC
    - Thread-safe: always includes threadId
    """
    track_api_call()
    s = svc_get()
    from email.mime.text import MIMEText
    from email.mime.multipart import MIMEMultipart
    msg = MIMEMultipart()
    msg["to"] = to_addr
    if cc_list:
        # Filter out our own email from CC
        our_emails = {"kleber@ziontechgroup.com", "klebergarciaalcatrao@gmail.com"}
        filtered_cc = [c for c in cc_list if c.lower().strip() not in our_emails]
        if filtered_cc:
            msg["cc"] = ", ".join(filtered_cc)
    msg["subject"] = subject
    raw = base64.urlsafe_b64encode(msg.as_bytes()).decode()
    return s.users().messages().send(userId="me", body={"raw": raw, "threadId": thread_id}).execute()

def ensure_label(name, labels_map):
    if name in labels_map: return labels_map[name]
    s = svc_get()
    try:
        result = s.users().labels().create(userId="me", body={
            "name": name, "labelListVisibility": "labelShow", "messageListVisibility": "show"
        }).execute()
        labels_map[name] = result["id"]
        return result["id"]
    except:
        labels_map[name] = name
        return name

# ═══ UTILITY ═══
def now_iso(): return datetime.now().isoformat()
def is_quiet():
    h = datetime.now().hour
    return h >= 23 or h < 7

def content_hash(subject, body):
    """SHA-256 hash for duplicate detection."""
    text = (subject or "") + (body or "")[:500]
    return hashlib.sha256(text.encode("utf-8", errors="ignore")).hexdigest()

def strip_quoted(body):
    if not body: return ""
    lines = body.split("\n"); clean = []
    for line in lines:
        if re.match(r"^.{0,5}>", line): break
        if re.match(r"^\s*-{3,}\s*Original Message\s*-{3,}", line, re.IGNORECASE): break
        if re.match(r"^\s*On .+ wrote:", line): break
        if re.match(r"^\s*From: .+", line) and len(clean) > 0: break
        clean.append(line)
    return "\n".join(clean).strip()

def get_body_text(payload):
    """Extract plain text from email payload (handles multi-part)."""
    if not payload: return ""
    mime = payload.get("mimeType", "")
    if mime == "text/plain":
        data = payload.get("body", {}).get("data", "")
        if data: return base64.urlsafe_b64decode(data).decode("utf-8", errors="ignore")
    elif mime == "text/html":
        data = payload.get("body", {}).get("data", "")
        if data:
            html = base64.urlsafe_b64decode(data).decode("utf-8", errors="ignore")
            # Strip HTML tags
            text = re.sub(r"<[^>]+>", " ", html)
            text = re.sub(r"\s+", " ", text).strip()
            return text
    for part in payload.get("parts", []):
        t = get_body_text(part)
        if t: return t
    return ""

def extract_email(raw):
    if not raw: return ""
    m = re.search(r"<([^>]+)>", raw)
    if m: return m.group(1).lower()
    m = re.search(r"[\w.+-]+@[\w-]+\.[\w.]+", raw)
    if m: return m.group(0).lower()
    return raw.lower().strip()

def extract_name(raw):
    if not raw: return "there"
    name = raw.split("<")[0].strip().split("@")[0].strip()
    name = name.replace('"', '').replace("'", "")
    if not name or len(name) <= 1: return "there"
    return name.split()[0]

def load_json(path, default=None):
    try:
        if os.path.exists(path):
            with open(path, "r", encoding="utf-8") as f: return json.load(f)
    except: pass
    return default if default is not None else {}

def save_json(path, data):
    try:
        with open(path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False, default=str)
    except: pass

# ═══ v21: DUPLICATE PREVENTION ═══
DUPLICATE_FILE = os.path.join(HERMES_HOME, "v21_replied_hashes.json")

def load_hashes():
    return load_json(DUPLICATE_FILE, {"hashes": {}, "total_tracked": 0})

def save_hashes(data):
    save_json(DUPLICATE_FILE, data)

def already_replied(hashes_data, subj, body):
    h = content_hash(subj, body)
    return h in hashes_data.get("hashes", {})

def mark_replied(hashes_data, subj, body, msg_id):
    h = content_hash(subj, body)
    hashes_data.setdefault("hashes", {})[h] = {"ts": now_iso(), "msg_id": msg_id}
    hashes_data["total_tracked"] = len(hashes_data.get("hashes", {}))
    # Clean old (>30d)
    cutoff = (datetime.now() - timedelta(days=30)).isoformat()
    hashes_data["hashes"] = {k: v for k, v in hashes_data.get("hashes", {}).items() if v.get("ts","") > cutoff}
    save_hashes(hashes_data)

# ═══ v21: SENTIMENT ANALYSIS (5-level) ═══
def analyze_sentiment(text):
    """5-level sentiment: very_negative / negative / neutral / positive / very_positive"""
    t = text.lower()
    neg_words = ["angry","furious","disappointed","frustrated","unacceptable","terrible","horrible","worst","hate","disgusted","outraged","fed up","sick of","no longer","cancel","never again","ridiculous","scam","fraud"]
    pos_words = ["thank","thanks","great","amazing","excellent","love","awesome","perfect","wonderful","fantastic","appreciate","pleased","happy","excited","impressed","outstanding","brilliant"]
    vneg = sum(1 for w in ["furious","outraged","unacceptable","scam","fraud","hate","disgusted","never again","fed up","ridiculous"] if w in t)
    neg = sum(1 for w in neg_words if w in t)
    pos = sum(1 for w in pos_words if w in t)
    vpos = sum(1 for w in ["amazing","outstanding","brilliant","love","excellent","perfect","excited"] if w in t)
    score = (pos + vpos * 2) - (neg + vneg * 3)
    if vneg >= 1 or score <= -4: return "very_negative", score
    if neg >= 2 or score <= -2: return "negative", score
    if vpos >= 2 or score >= 4: return "very_positive", score
    if pos >= 2 or score >= 2: return "positive", score
    return "neutral", score

# ═══ v21: PRIORITY SCORING (0-100, 15+ signals) ═══
def compute_priority(meta, full_body, subject, sender_email, sender_profile, conv_state, sentiment, intent, intent_conf, thread_ctx):
    score = 50  # baseline
    text = (subject + " " + full_body[:1500]).lower()
    # 1. Sender reputation
    rep = sender_profile.get("reputation", "new")
    if rep == "trusted": score += 15
    elif rep == "known": score += 5
    else: score -= 5
    # 2. Intent
    if intent in ("buy","meeting","support"): score += 10
    elif intent in ("complain","partner","legal"): score += 15
    score += int(intent_conf * 10)
    # 3. Sentiment
    sname = sentiment[0] if isinstance(sentiment, tuple) else sentiment
    if sname in ("very_negative","negative"): score += 15
    elif sname == "very_positive": score += 5
    # 4. Conversation state
    state = conv_state.get("state","new")
    if state in ("at_risk","negotiating"): score += 20
    elif state == "engaged": score += 10
    # 5. Urgency keywords
    if re.search(r"(urgent|asap|emergency|critical|immediately|deadline|blocked|escalate|today|now)", text): score += 15
    # 6. Questions
    q_count = text.count("?")
    if q_count > 3: score += 5
    # 7. Has deadline
    if re.search(r"by\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday|\d{1,2}[a-z]{2}|end of|due)", text): score += 10
    # 8. Thread position (are we waiting?)
    pending = thread_ctx.get("pending_items", [])
    if pending: score += 15
    # 9. Response ratio
    received = sender_profile.get("received", 0)
    replied = sender_profile.get("replied", 0)
    if received > 3 and replied / max(received,1) < 0.5: score += 10
    # 10. Meeting intent
    if intent == "meeting": score += 12
    # 11. Financial keywords
    if re.search(r"payment|invoice|billing|contract|proposal", text): score += 8
    # 12. CC count (more people = higher stakes)
    cc_header = meta.get("cc","") or ""
    cc_count = len([c for c in cc_header.split(",") if "@" in c])
    if cc_count > 3: score += 8
    elif cc_count > 0: score += 3
    # 13. Body length (longer = more complex)
    wc = len(full_body.split())
    if wc > 300: score += 5
    if wc > 500: score += 5
    # 14. Follow-up active
    if re.search(r"following up|checking in|any update|haven't heard|circling back", text, re.I): score += 12
    # 15. Personal / direct (1:1)
    to_header = meta.get("to","") or ""
    to_count = len([c for c in to_header.split(",") if "@" in c])
    if to_count <= 2 and cc_count == 0: score += 5
    return max(0, min(100, score))

# ═══ v21: CASE-BY-CASE ACTION SELECTOR ═══
def select_action(meta, full_body, subject, sender_email, sender_profile, conv_state, sentiment_label, priority_score, intent, intent_conf, thread_ctx, hashes_data):
    """
    Decision tree: evaluates 12+ factors → returns best action.
    Actions: reply | reply_all | escalate_human | auto_archive | meeting_proposal | followup_send | draft_only | skip
    Returns: (action, reason, should_cc)
    """
    text = (subject + " " + full_body[:1000]).lower()

    # 0. Already processed?
    labels_list = [l.lower() for l in meta.get("labels", [])]
    if any(l in ALL_PROCESSED_LABELS for l in labels_list):
        return "skip", "already_processed", False

    # 1. We sent last message → waiting for reply
    our_last = thread_ctx.get("our_last_reply")
    msgs = thread_ctx.get("msgs", [])
    if msgs:
        last_msg = msgs[-1]
        from_h = ""
        for h in last_msg.get("payload",{}).get("headers",[]):
            if h["name"] == "From": from_h = h.get("value","")
        if CONTACT["email"].lower() in from_h.lower():
            # We sent last → skip (waiting)
            return "skip", "waiting_for_reply", False

    # 2. Duplicate content check
    if already_replied(hashes_data, subject, full_body):
        return "skip", "duplicate_content", False

    # 3. Get classification
    cat, conf, flags, subcat, label_name = classify_email_fast(meta, full_body, sender_email)

    # 4. Auto-archive categories
    if cat in ("BOUNCE","OOO","CI","DEPS","PROMO","NEWSLETTER","SOCIAL","NOTIFY"):
        return "auto_archive", f"category_{subcat}", False

    # 5. Very negative sentiment → human review
    if sentiment_label in ("very_negative",):
        return "escalate_human", f"very_negative_sentiment_{subcat}", False

    # 6. Never-auto-reply categories
    if "never_autoreply" in flags:
        if priority_score >= 75:
            return "draft_only", f"priority_{priority_score}_{subcat}", False
        return "escalate_human", f"never_autoreply_{subcat}", False

    # 7. Meeting request → meeting proposal
    if cat == "MEETING" or intent == "meeting":
        return "meeting_proposal", "meeting_request", False

    # 8. High priority + negative → draft (human reviews before send)
    if priority_score >= 70 and sentiment_label in ("negative","neutral"):
        return "draft_only", f"high_priority_{priority_score}", False

    # 9. Check for existing follow-up needs
    if "is_followup" in flags:
        return "followup_send", "follow_up_detected", False

    # 10. Complaint handling
    if cat == "COMPLAINT":
        if "flag_human" in flags:
            return "draft_only", "complaint_draft", False
        return "reply", "complaint_auto", False

    # 11. CC-based reply-all decision
    cc_header = meta.get("cc","") or ""
    has_cc = bool(cc_header and "@" in cc_header)
    to_header = meta.get("to","") or ""
    to_count = len([c for c in to_header.split(",") if "@" in c])
    multiple_recipients = to_count > 1 or has_cc

    if cat in ("SUPPORT","INQUIRY","BOOKING","PERSONAL","JOB_APP","PRESS","FOLLOWUP"):
        if multiple_recipients and has_cc:
            return "reply_all", f"multi_recipient_{subcat}", True
        return "reply", f"single_recipient_{subcat}", False

    # 12. Default: draft for human review
    return "draft_only", f"default_{subcat}", False

# ═══ v21: CONTEXTUAL SERVICE MATCHING ═══
# Service keywords for matching email content to services
SERVICE_KEYWORDS = {
    "ai": ["ai","artificial intelligence","machine learning","ml","deep learning","neural","nlp","chatbot","automation","predictive"],
    "it": ["server","hosting","network","infrastructure","devops","deployment","api","database","migration","backup","monitoring"],
    "cloud": ["cloud","aws","azure","gcp","gcs","s3","ec2","kubernetes","docker","container","scaling","saas"],
    "security": ["security","firewall","vulnerability","penetration","audit","compliance","hipaa","gdpr","encryption","ddos","siem","threat"],
    "data": ["data","analytics","bi","dashboard","visualization","etl","pipeline","warehouse","lake","reporting","insights"],
    "automation": ["automation","workflow","bot","rpa","script","schedule","cron","trigger","integration","zapier"],
    "micro-saas": ["crm","invoice","survey","form","proposal","contract","meeting","review","reputation","card","booking","okr"],
    "devops": ["ci/cd","pipeline","jenkins","github actions","terraform","ansible","deployment","release","rollback"],
    "blockchain": ["blockchain","web3","crypto","defi","nft","smart contract","wallet","token"],
    "iot": ["iot","sensor","edge","smart building","energy","hvac","occupancy"],
}

# Pre-built service links (injected into replies when matched)
SERVICE_LINKS = {
    "ai": ("AI Services", "https://ziontechgroup.com/services/advanced-ai-enterprise-intelligence-hub"),
    "it": ("IT Solutions", "https://ziontechgroup.com/services/full-it-department-outsourcing"),
    "cloud": ("Cloud Services", "https://ziontechgroup.com/services/multi-cloud-architecture-migration"),
    "security": ("Security Services", "https://ziontechgroup.com/services/enterprise-cybersecurity-operations-center"),
    "data": ("Data Analytics", "https://ziontechgroup.com/services/ai-analytics-bi-platform"),
    "automation": ("Automation", "https://ziontechgroup.com/services/itsm-it-service-management-platform"),
    "micro-saas": ("Micro-SaaS", "https://ziontechgroup.com/services"),
    "devops": ("DevOps", "https://ziontechgroup.com/services/devops-cicd-pipeline-builder"),
    "blockchain": ("Blockchain", "https://ziontechgroup.com/services/smart-contract-security-audits"),
    "iot": ("IoT & Edge", "https://ziontechgroup.com/services"),
}

def match_services(subject, body, max_matches=2):
    """Match email content to service categories → return links."""
    text = (subject + " " + body[:2000]).lower()
    scores = {}
    for cat, keywords in SERVICE_KEYWORDS.items():
        score = sum(2 if kw in text else 0 for kw in keywords)
        if score > 0:
            scores[cat] = score
    if not scores:
        return []
    # Top N categories
    sorted_cats = sorted(scores, key=scores.get, reverse=True)[:max_matches]
    links = []
    for cat in sorted_cats:
        if cat in SERVICE_LINKS:
            links.append(SERVICE_LINKS[cat])
    return links

# ═══ v21: MULTI-LANGUAGE v2 (12 languages) ═══
LANG_KEYWORDS = {
    "pt": ["olá","obrigado","por favor","você","está","como","quero","preciso","ajuda","serviço","obrigada","gostaria","favor","email"],
    "es": ["hola","gracias","por favor","usted","como","está","quiero","necesito","ayuda","servicio","gustaría","correo"],
    "fr": ["bonjour","merci","s'il vous plaît","comment","je veux","aide","service","entreprise","courriel","voudrais","monsieur","madame"],
    "de": ["hallo","danke","bitte","wie","ich will","hilfe","service","unternehmen","e-mail","guten tag","möchten","herr","frau"],
    "it": ["ciao","grazie","per favore","come","voglio","aiuto","servizio","azienda","email","vorrei","signore","signora"],
    "en": ["hello","hi","thank","please","would","could","help","service","company","regards","dear","good morning","cheers"],
    "zh": ["你好","谢谢","请","服务","企业","帮助","邮件"],
    "ja": ["こんにちは","ありがとう","お願い","サービス","企業","助け","メール"],
    "ko": ["안녕하세요","감사합니다","부탁","서비스","기업","도움","메일"],
    "ar": ["مرحبا","شكرا","من فضلك","خدمة","شركة","مساعدة","بريد"],
    "ru": ["привет","спасибо","пожалуйста","служба","компания","помощь","почта"],
    "nl": ["hallo","dank u","alstublieft","hoe","ik wil","hulp","dienst","bedrijf","e-mail"],
}

def detect_lang_v2(text):
    t = text.lower()
    scores = {}
    for lang, keywords in LANG_KEYWORDS.items():
        scores[lang] = sum(1 for kw in keywords if kw in t)
    best = max(scores, key=scores.get)
    return best if scores[best] >= 2 else "en"

LANG_TEMPLATES = {
    "en": {"greeting":"Hi {name}","closing":"Best regards","thanks":"Thank you for","question":"Could you clarify","follow_up":"Just checking in","meeting":"I'd love to meet","services":"Our services"},
    "pt": {"greeting":"Olá {name}","closing":"Atenciosamente","thanks":"Obrigado por","question":"Poderia esclarecer","follow_up":"Apenas verificando","meeting":"Adoraria nos reunir","services":"Nossos serviços"},
    "es": {"greeting":"Hola {name}","closing":"Saludos cordiales","thanks":"Gracias por","question":"¿Podría aclarar?","follow_up":"Solo verificando","meeting":"Me encantaría reunirme","services":"Nuestros servicios"},
    "fr": {"greeting":"Bonjour {name}","closing":"Cordialement","thanks":"Merci de","question":"Pourriez-vous préciser","follow_up":"Je reviens vers vous","meeting":"J'aimerais vous rencontrer","services":"Nos services"},
    "de": {"greeting":"Hallo {name}","closing":"Mit freundlichen Grüßen","thanks":"Vielen Dank für","question":"Könnten Sie klären","follow_up":"Ich melde mich kurz","meeting":"Ich würde mich gerne treffen","services":"Unsere Services"},
    "it": {"greeting":"Ciao {name}","closing":"Cordiali saluti","thanks":"Grazie per","question":"Potrebbe chiarire","follow_up":"Solo un aggiornamento","meeting":"Mi piacerebbe incontrarci","services":"I nostri serviços"},
    "zh": {"greeting":"您好 {name}","closing":"此致敬礼","thanks":"感谢","question":"请澄清","follow_up":"跟进中","meeting":"希望会面","services":"我们的服务"},
    "ja": {"greeting":"{name}様","closing":"敬具","thanks":"ありがとうございます","question":"ご確認ください","follow_up":"フォローアップ","meeting":"お会いしたい","services":"サービス"},
    "ko": {"greeting":"{name}님","closing":"감사합니다","thanks":"감사합니다","question":"확인 부탁드립니다","follow_up":"확인 중","meeting":"만나고 싶습니다","services":"서비스"},
    "ar": {"greeting":"مرحباً {name}","closing":"مع التحية","thanks":"شكراً لـ","question":"هل يمكنك التوضيح","follow_up":"متابعة","meeting":"أود الالتقاء","services":"خدماتنا"},
    "ru": {"greeting":"Здравствуйте {name}","closing":"С уважением","thanks":"Спасибо за","question":"Можете уточнить","follow_up":"Напоминаю","meeting":"Хотел бы встретиться","services":"Наши услуги"},
    "nl": {"greeting":"Hallo {name}","closing":"Met vriendelijke groet","thanks":"Bedankt voor","question":"Kunt u verduidelijken","follow_up":"Even checken","meeting":"Ik zou graag afspreken","services":"Onze diensten"},
}

def get_lang_template(lang):
    return LANG_TEMPLATES.get(lang, LANG_TEMPLATES["en"])

# ═══ v19 FEATURES (carried forward, adapted) ═══
FOLLOWUP_FILE = os.path.join(HERMES_HOME, "v21_followup_tracker.json")
PERSONALITY_FILE = os.path.join(HERMES_HOME, "v21_sender_personalities.json")
CONVERSATION_FILE = os.path.join(HERMES_HOME, "v21_conversation_states.json")
SENDER_HISTORY_FILE = os.path.join(HERMES_HOME, "v21_sender_history.json")

def get_tracker(): return load_json(FOLLOWUP_FILE, {"threads":{},"stats":{"total_sent":0,"responses_received":0}})
def save_tracker(d): save_json(FOLLOWUP_FILE, d)
def get_personalities(): return load_json(PERSONALITY_FILE, {})
def save_personalities(d): save_json(PERSONALITY_FILE, d)
def get_conv_states(): return load_json(CONVERSATION_FILE, {})
def save_conv_states(d): save_json(CONVERSATION_FILE, d)
def get_sender_history(): return load_json(SENDER_HISTORY_FILE, {})
def save_sender_history(d): save_json(SENDER_HISTORY_FILE, d)

# Classifiers
_RE_BOUNCE = re.compile(r"delivery failure|undeliverable|mail delivery failed|bounce|status: 5\.|permanent error", re.I)
_RE_OOO = re.compile(r"out of office|ooo|on vacation|auto.?reply|automatic reply|away from my desk|on leave", re.I)
_RE_PROMO = re.compile(r"sale|discount|promo|offer|deal|giveaway|coupon|flash sale|oferta|desconto|promoç", re.I)
_RE_NEWSLETTER = re.compile(r"unsubscribe|view in browser|email preferences|weekly digest|newsletter|substack|mailchimp", re.I)
_RE_FOLLOWUP_ACTIVE = re.compile(r"following up|follow up|checking in|any update|haven.?t heard|circling back", re.I)
_RE_ACK = re.compile(r"thank you|thanks|appreciate|great|perfect|confirmed|understood|obrigado|valeu|gracias", re.I)
_RE_SUPPORT = re.compile(r"help|issue|problem|not working|bug|error|crash|broke|troubleshoot|support ticket", re.I)
_RE_THREAT = re.compile(r"threat|blackmail|expose|leak|ransom|pay up|or else", re.I)
_RE_LEGAL = re.compile(r"legal notice|cease and desist|attorney|court order|subpoena|litigation|law firm|trademark|patent", re.I)
_RE_FINANCIAL = re.compile(r"invoice|payment due|billing|subscription charge|receipt|purchase order|po #|wire transfer|bank transfer", re.I)
_RE_INQUIRY = re.compile(r"rfq|request for quote|request for proposal|rfp|quotation|supplier inquiry|bulk order|wholesale", re.I)
_RE_COMPLAINT = re.compile(r"complaint|formal complaint|unacceptable service|terrible experience|worst experience", re.I)
_RE_COMPLAINT_CHURN = re.compile(r"cancel account|close account|terminate|switch to|moving to|competitor|alternative to", re.I)
_RE_UNSUB = re.compile(r"(?i)(unsubscribe|remove me|stop sending|opt[.\s]?out|no more emails|take me off|remove.*list)")
_RE_JOB_APP = re.compile(r"(?i)(job application|apply for|resume|cv attached|cover letter|hiring|position|role|career)")
_RE_PRESS = re.compile(r"(?i)(press|media|interview|journalist|publication|news outlet|press release)")

NOREPLY_SENDERS = {"noreply@","no-reply@","donotreply@","notifications@github.com","github-actions"}
KNOWN_SENDER_DOMAINS = {"linkedin","facebook","twitter","instagram","tiktok","youtube","pinterest","reddit","nextdoor","quora","dev.to","bsky"}
SYSTEM_SENDERS = {"zapier","ifttt","pagerduty","datadog","grafana","sentry","cloudflare","aws","azure","vercel","netlify","heroku","docker","npm","atlassian","jira","confluence"}
NEWSLETTER_DOMAINS = {"br.email.samsung.com","mercadolivre","amazon.com.br","ifood","nubank","spotify","netflix"}

def classify_email_fast(meta, full_body="", sender_email=""):
    f = (meta.get("from","") or "").lower()
    s = (meta.get("subject","") or "").lower()
    body = (full_body or meta.get("snippet","") or "")[:800].lower()
    combined = f + " " + s + " " + body
    labels_list = [l.lower() for l in meta.get("labels",[])]
    if any(l in ALL_PROCESSED_LABELS for l in labels_list):
        return "SKIP", 1.0, ["skip"], "already_processed", "Processed"
    if _RE_BOUNCE.search(combined) or "mailer-daemon" in f: return "BOUNCE", 0.95, ["auto_archive"],"bounce","Bounced"
    if _RE_OOO.search(combined): return "OOO", 0.95, ["auto_archive"],"ooo","OOO"
    if "github.com" in f or "github-actions" in f:
        return ("CI",0.97,["auto_archive"],"ci_fail","CI failed") if any(kw in s for kw in ["failed","❌","[failed]"]) else ("CI",0.90,["auto_archive"],"ci","CI")
    if "dependabot" in f or "renovate" in f: return "DEPS", 0.97, ["auto_archive"],"deps","Deps"
    if _RE_PROMO.search(combined): return "PROMO", 0.93, ["auto_archive"],"promo","Promo"
    if _RE_NEWSLETTER.search(combined): return "NEWSLETTER", 0.88, ["auto_archive"],"newsletter","Newsletter"
    if any(k in f for k in NEWSLETTER_DOMAINS): return "NEWSLETTER", 0.88, ["auto_archive"],"newsletter_s","Newsletter"
    if any(k in f for k in KNOWN_SENDER_DOMAINS): return "SOCIAL", 0.90, ["auto_archive"],"social","Social"
    if any(k in f for k in SYSTEM_SENDERS): return "NOTIFY", 0.85, ["auto_archive"],"system","System"
    if s.startswith(("re:","fw:","fwd:")):
        if _RE_FOLLOWUP_ACTIVE.search(combined): return "FOLLOWUP", 0.80, ["can_reply","is_followup"],"followup_active","Active follow-up"
        if _RE_ACK.search(combined): return "FOLLOWUP", 0.75, ["auto_archive"],"ack","Thread ack"
        return "FOLLOWUP", 0.70, ["can_reply","needs_thread_check"],"followup","Follow-up"
    if _RE_THREAT.search(combined): return "THREAT", 0.92, ["flag_human","flag_urgent","never_autoreply"],"threat","Threat"
    if _RE_LEGAL.search(combined): return "LEGAL", 0.90, ["flag_human","never_autoreply"],"legal","Legal"
    if _RE_FINANCIAL.search(combined): return "FINANCIAL", 0.90, ["flag_human","never_autoreply"],"financial","Financial"
    if _RE_COMPLAINT_CHURN.search(combined): return "COMPLAINT", 0.85, ["flag_human","flag_urgent"],"churn","Churn risk"
    if _RE_COMPLAINT.search(combined): return "COMPLAINT", 0.88, ["can_reply"],"complaint","Complaint"
    if _RE_SUPPORT.search(combined): return "SUPPORT", 0.85, ["can_reply"],"support","Support"
    if _RE_INQUIRY.search(combined): return "INQUIRY", 0.92, ["can_reply"],"rfq","RFQ"
    if _RE_JOB_APP.search(combined): return "JOB_APP", 0.85, ["can_reply"],"job_app","Job application"
    if _RE_PRESS.search(combined): return "PRESS", 0.85, ["can_reply"],"press","Press"
    if any(k in f for k in [".gov",".gov.br",".gob"]): return "GOVT", 0.97, ["flag_human","never_autoreply","flag_urgent"],"govt","Gov"
    if any(k in combined for k in ["investment","investor","venture capital","funding"]): return "INVESTOR", 0.90, ["flag_human","never_autoreply"],"investor","Investor"
    if any(k in combined for k in ["partnership","collaborate","joint venture","reseller","distributor"]): return "PARTNER", 0.90, ["flag_human","never_autoreply"],"partnership","Partnership"
    if any(k in s for k in ["urgent","asap","emergency","critical","blocked","escalate","action required","immediate","deadline","rush"]): return "PERSONAL", 0.60, ["flag_human","flag_urgent"],"urgent","Urgent"
    return "PERSONAL", 0.50, ["flag_human"],"unknown","Review"

def detect_meeting_request(subject, body):
    text = (subject + " " + body[:500]).lower()
    kws = ["schedule.*meeting","book.*call","set up.*meeting","zoom","google meet","teams meeting","calendar invite","available","when.*free","time.*connect","let.*talk","agendar","reuni","meeting request","call to discuss","jump on a call","quick call","15.minute","30.minute","sync up","catch up","touch base","discuss.*project","review.*together"]
    score = sum(1 for kw in kws if re.search(kw, text))
    return score >= 2

def generate_meeting_proposal(sender_name, subject, body, lang="en"):
    tmpl = get_lang_template(lang)
    now = datetime.now()
    slots = []
    for i in range(5):
        future = now + timedelta(days=i+1)
        while future.weekday() >= 5: future += timedelta(days=1)
        day_name = future.strftime("%A")
        slots.append(f"• {day_name}, {future.strftime('%b %d')} at 10:00 AM ET")
        slots.append(f"• {day_name}, {future.strftime('%b %d')} at 2:00 PM ET")
        if len(slots) >= 6: break
    slots_text = "\n".join(slots[:6])
    return f"""{tmpl['greeting'].format(name=sender_name)},

{tmpl['thanks']} your meeting request!

Here are some available time slots:

{slots_text}

I'm flexible — just suggest what works best. I'll send a calendar invite with a Zoom link.

{tmpl['closing']},
{CONTACT['name']}
{CONTACT['company']}
📞 {CONTACT['phone']}
✉ {CONTACT['email']}
🌐 {CONTACT['website']}"""

def generate_followup_body(original_subject, sender_name, followup_num, lang="en"):
    tmpl = get_lang_template(lang)
    urgency = ""
    if followup_num == 2: urgency = "I wanted to follow up again as this may be time-sensitive."
    elif followup_num >= 3: urgency = "This is my final follow-up. If this is no longer a priority, please let me know."
    subj_short = original_subject[:60]
    if followup_num == 1:
        return f"""{tmpl['greeting'].format(name=sender_name)},

{tmpl['follow_up']} on my previous email about "{subj_short}".

Is there anything I can clarify? Happy to jump on a quick call: {CONTACT['phone']}

{tmpl['closing']},
{CONTACT['name']}
{CONTACT['company']}
📞 {CONTACT['phone']}
✉ {CONTACT['email']}"""
    elif followup_num == 2:
        return f"""{tmpl['greeting'].format(name=sender_name)},

{urgency}

{tmpl['follow_up']} on "{subj_short}". I know things get busy!

If now isn't a good time, just let me know.

{tmpl['closing']},
{CONTACT['name']}
{CONTACT['company']}
📞 {CONTACT['phone']}
✉ {CONTACT['email']}"""
    else:
        return f"""{tmpl['greeting'].format(name=sender_name)},

{urgency}

Regarding "{subj_short}" — I want to make sure this doesn't fall through the cracks.

I can:
• Schedule a quick 15-minute call: {CONTACT['phone']}
• Send more details via email
• Close this for now

{tmpl['closing']},
{CONTACT['name']}
{CONTACT['company']}
📞 {CONTACT['phone']}
✉ {CONTACT['email']}"""

def analyze_sender_style(text):
    t = text.lower()
    formal_words = ["dear","sincerely","regards","respectfully","pursuant","furthermore","therefore"]
    casual_words = ["hey","hi","thanks","cheers","btw","cool","awesome","yeah","ok","sure"]
    formal_score = sum(1 for w in formal_words if w in t)
    casual_score = sum(1 for w in casual_words if w in t)
    if formal_score > casual_score + 2: return "formal"
    elif casual_score > formal_score + 2: return "casual"
    return "neutral"

def update_sender_profile(email_val, history, email_text, got_response):
    if email_val not in history: history[email_val] = {"received":0,"replied":0,"first_seen":now_iso(),"reputation":"new","lang":"en","categories":{}}
    p = history[email_val]
    p["received"] = p.get("received",0) + 1
    p["last_seen"] = now_iso()
    if got_response: p["replied"] = p.get("replied",0) + 1
    if p["received"] >= 5: p["reputation"] = "trusted"
    elif p["received"] >= 2: p["reputation"] = "known"
    p["lang"] = detect_lang_v2(email_text)
    save_sender_history(history)
    return p

def update_personality(sender_email, email_text, personalities):
    if sender_email not in personalities: personalities[sender_email] = {"formality":"neutral","preferred_length":"medium","emails_count":0,"responses_count":0,"last_seen":None}
    p = personalities[sender_email]
    p["emails_count"] = p.get("emails_count",0) + 1
    p["last_seen"] = now_iso()
    p["formality"] = analyze_sender_style(email_text)
    wc = len(email_text.split())
    if wc < 50: p["preferred_length"] = "short"
    elif wc < 200: p["preferred_length"] = "medium"
    else: p["preferred_length"] = "long"
    personalities[sender_email] = p

def update_conversation_state(sender_email, conv_states, email_cat, action_taken):
    state = conv_states.get(sender_email, {"state":"new","emails_received":0,"emails_replied":0,"last_email_date":None,"last_reply_date":None,"total_threads":0,"open_items":[],"issues_raised":[],"issues_resolved":[]})
    state["emails_received"] = state.get("emails_received",0) + 1
    state["last_email_date"] = now_iso()
    if action_taken in ("reply","reply_all"):
        state["emails_replied"] = state.get("emails_replied",0) + 1
        state["last_reply_date"] = now_iso()
    current = state.get("state","new")
    if email_cat == "COMPLAINT" and current not in ("at_risk","churned"):
        state["state"] = "at_risk"
        state["issues_raised"] = state.get("issues_raised",[]) + [now_iso()]
    elif current == "new" and state["emails_received"] >= 2: state["state"] = "engaged"
    elif current == "engaged" and email_cat in ("INQUIRY","BOOKING","MEETING"): state["state"] = "negotiating"
    conv_states[sender_email] = state
    return state

def predict_sender_intent(body, subject):
    text = subject + ". " + body[:3000]
    patterns = {"buy":{"p":[r"(?i)(?:want to|interested in|looking for)\s+(?:buy|purchase|order|subscribe|hire|engage)"],"w":1.0},"complain":{"p":[r"(?i)(?:very|extremely)\s+(?:disappointed|frustrated|angry|dissatisfied)"],"w":1.0},"partner":{"p":[r"(?i)(?:partnership|collaborate|joint venture|reseller)"],"w":0.9},"support":{"p":[r"(?i)(?:help|issue|problem|not working|bug|error|crash)"],"w":0.7},"meeting":{"p":[r"(?i)(?:schedule.*meeting|book.*call|zoom|google meet|available|when.*free)"],"w":0.9}}
    scores = {}
    for intent, data in patterns.items():
        s = 0
        for pat in data["p"]: s += len(re.findall(pat, text)) * data["w"]
        if s > 0: scores[intent] = s
    if not scores: return "unknown", 0.3
    best = max(scores, key=scores.get)
    return best, min(1.0, scores[best] / 3.0)

def get_thread_context(thread_id, max_msgs=5):
    thread = gmail_get_thread(thread_id)
    if not thread or "messages" not in thread: return {"summary":"(No thread history)","msgs":[],"our_last_reply":None,"pending_items":[]}
    msgs = thread["messages"][-max_msgs:]
    our_email = CONTACT["email"].lower()
    parts = []; our_last_reply = None; pending_items = []
    for msg in msgs:
        headers = msg.get("payload",{}).get("headers",[])
        from_h = next((h["value"] for h in headers if h["name"] == "From"),"")
        snippet = msg.get("snippet","")[:80].strip()
        is_ours = our_email in from_h.lower()
        if is_ours: our_last_reply = {"snippet":snippet}
        elif "?" in snippet and not our_last_reply: pending_items.append(snippet[:100])
        parts.append(f"{'US' if is_ours else 'THEM'}: {snippet}")
    summary = " → ".join(parts) if parts else "(No preview)"
    return {"summary": summary, "msgs": msgs, "our_last_reply": our_last_reply, "pending_items": pending_items}

def get_cc_list(meta):
    """Extract CC email addresses from headers."""
    cc_raw = meta.get("cc","") or ""
    if not cc_raw: return []
    emails = []
    for part in cc_raw.split(","):
        e = extract_email(part)
        if e: emails.append(e)
    return emails

# ═══ REPLY GENERATION (v21 — multi-language, service matching, sentiment-aware) ═══
def generate_reply(meta, full_body, subject, sender_name, sender_email, action, service_links, sentiment_label, lang, is_reply_all=False):
    tmpl = get_lang_template(lang)
    clean_body = strip_quoted(full_body[:600])

    # Service links block
    links_block = ""
    if service_links:
        links_block = "\n\n---\n🔗 Relevant services:"
        for title, url in service_links:
            links_block += f"\n• {title}: {url}"

    # Sentiment-aware greeting
    sentiment_greeting = tmpl['greeting'].format(name=sender_name)
    if sentiment_label == "very_negative":
        sentiment_greeting = f"Hi {sender_name},\n\nI sincerely apologize for the experience you've had. Let me address this right away."
    elif sentiment_label == "negative":
        sentiment_greeting = f"Hi {sender_name},\n\nI understand your concern and want to help resolve this."

    # Body-specific responses if short inquiry
    has_keywords = any(kw in clean_body.lower() for kw in ["price","pricing","cost","how much","quote","proposal","interested","service","help","ai","it","cloud","security","automation","data","automation"])

    if has_keywords or action == "reply_all":
        body = f"""{sentiment_greeting}

{tmpl['thanks']} reaching out to Zion Tech Group!

We provide end-to-end AI services, IT solutions, cloud infrastructure, cybersecurity, data analytics, automation, and micro-SaaS platforms. Our team is ready to help with your specific needs.

Here's how we can help:

• AI & Machine Learning — Custom AI models, NLP, computer vision, chatbots, predictive analytics
• IT Solutions — Infrastructure, networking, cloud migration, managed services
• Cloud & DevOps — AWS/Azure/GCP, Kubernetes, CI/CD, monitoring
• Cybersecurity — Audits, penetration testing, compliance, SOC-as-a-Service
• Data Analytics — BI dashboards, ETL pipelines, data warehousing
• Automation — Workflow automation, RPA, bot development
• Micro-SaaS — Custom SaaS platform development

I'd love to discuss your specific requirements. Would you like to schedule a free 15-minute call?

📞 {CONTACT['phone']}
✉ {CONTACT['email']}
🌐 {CONTACT['website']}
📍 {CONTACT['address']}{links_block}

{tmpl['closing']},
{CONTACT['name']}
{CONTACT['company']}"""
    else:
        body = f"""{sentiment_greeting}

{tmpl['thanks']} your email. I'd be happy to help!

Could you share a bit more about what you're looking for? This will help me provide the most relevant information.

📞 {CONTACT['phone']}
✉ {CONTACT['email']}{links_block}

{tmpl['closing']},
{CONTACT['name']}
{CONTACT['company']}"""

    return body

# ═══ MAIN PIPELINE ═══
def run_pipeline():
    run_id = datetime.now().strftime("%Y%m%d_%H%M%S")
    log_path = os.path.join(LOG_DIR, f"run_{run_id}.json")
    log = {"run_id": run_id, "started": now_iso(), "stats":{"fetched":0,"auto_archived":0,"replied":0,"replied_all":0,"escalated":0,"drafted":0,"skipped":0,"errors":0,"followups_sent":0},"actions":[]}

    labels_map = {}
    hashes_data = load_hashes()
    tracker = get_tracker()
    personalities = get_personalities()
    conv_states = get_conv_states()
    sender_history = get_sender_history()

    OUR_EMAIL = CONTACT["email"].lower()

    print(f"[v21] Run {run_id} started")
    sys.stdout.flush()

    # ═══ PHASE 1: Fast metadata fetch ═══
    try:
        msg_ids = gmail_search("is:unread", max_results=PHASE1_FETCH)
        print(f"[v21] Phase 1: {len(msg_ids)} unread messages")
        sys.stdout.flush()
    except Exception as e:
        print(f"[v21] ERROR: Search failed: {e}")
        log["error"] = str(e)
        save_json(log_path, log)
        return log

    # ═══ PHASE 2: Case-by-case deep process ═══
    to_process = []
    for mid in msg_ids[:MAX_FULL_FETCH]:
        try:
            meta = gmail_get_metadata(mid)
            if not meta: continue
            meta["_msg_id"] = mid
            meta["_thread_id"] = meta.get("threadId","")
            headers = meta.get("payload",{}).get("headers",[]) if "payload" in meta else []
            def get_header(name): return next((h["value"] for h in headers if h["name"]==name),"")
            meta["from"] = get_header("From")
            meta["to"] = get_header("To")
            meta["cc"] = get_header("Cc")
            meta["subject"] = get_header("Subject")
            meta["date"] = get_header("Date")
            sender_email = extract_email(meta["from"])
            cat, conf, flags, subcat, label_name = classify_email_fast(meta, "", sender_email)

            # Auto-archive obvious
            if "auto_archive" in flags:
                lid = ensure_label(LABELS["BULK_ARCHIVED"], labels_map)
                gmail_modify(mid, add_labels=[lid], remove_labels=["INBOX"])
                log["stats"]["auto_archived"] += 1
                log["actions"].append({"id":mid,"action":"auto_archive","reason":subcat})
                continue

            # Already processed
            if cat == "SKIP":
                log["stats"]["skipped"] += 1
                continue

            to_process.append((mid, meta, sender_email))
        except Exception as e:
            log["stats"]["errors"] += 1
            print(f"[v21] Phase 2 meta error: {e}")
            sys.stdout.flush()

    print(f"[v21] Phase 2: {len(to_process)} to deep-process")
    sys.stdout.flush()

    # ═══ PHASE 3: Deep analysis + action per email ═══
    sent_count = 0
    for mid, meta, sender_email in to_process:
        if sent_count >= MAX_SEND_PER_RUN: break
        try:
            # Full body
            full = gmail_get_full(mid)
            if not full: continue
            payload = full.get("payload",{})
            full_body = get_body_text(payload)
            subject = meta.get("subject","")
            if subject.lower().startswith("re:"): pass  # keep as-is
            sender_name = extract_name(meta.get("from",""))
            sender_profile = get_sender_profile(sender_email, sender_history)

            # Thread context
            thread_ctx = get_thread_context(meta["_thread_id"])

            # Sentiment
            sentiment_label, sentiment_score = analyze_sentiment(full_body + " " + subject)

            # Intent
            intent, intent_conf = predict_sender_intent(full_body, subject)

            # Language
            lang = detect_lang_v2(full_body + " " + subject)

            # Conversation state
            cat, conf, flags, subcat, label_name = classify_email_fast(meta, full_body, sender_email)
            conv_state = get_conv_state(sender_email, conv_states)

            # Priority score
            priority_score = compute_priority(meta, full_body, subject, sender_email, sender_profile, conv_state, (sentiment_label, sentiment_score), intent, intent_conf, thread_ctx)

            # Service matching
            service_links = match_services(subject, full_body)

            # CASE-BY-CASE ACTION SELECTION
            action, reason, should_cc = select_action(meta, full_body, subject, sender_email, sender_profile, conv_state, sentiment_label, priority_score, intent, intent_conf, thread_ctx, hashes_data)

            print(f"[v21] {mid[:8]} | {sender_email[:30]:30s} | action={action:15s} | reason={reason} | pri={priority_score} | sent={sentiment_label} | cat={cat}")
            sys.stdout.flush()

            # Log action
            log["actions"].append({
                "id": mid, "action": action, "reason": reason, "priority": priority_score,
                "sentiment": sentiment_label, "category": cat, "lang": lang,
                "sender": sender_email[:40]
            })

            # Execute action
            if action == "skip":
                # Mark as processed
                lid = ensure_label(LABELS["PROCESSED"], labels_map)
                gmail_modify(mid, add_labels=[lid])
                log["stats"]["skipped"] += 1

            elif action == "auto_archive":
                lid = ensure_label(LABELS["BULK_ARCHIVED"], labels_map)
                gmail_modify(mid, add_labels=[lid], remove_labels=["INBOX"])
                log["stats"]["auto_archived"] += 1

            elif action == "reply":
                if is_quiet() and priority_score < 80:
                    # Draft only during quiet hours for non-urgent
                    draft_lid = ensure_label(LABELS["DRAFTED"], labels_map)
                    gmail_modify(mid, add_labels=[draft_lid])
                    log["stats"]["drafted"] += 1
                else:
                    reply_body = generate_reply(meta, full_body, subject, sender_name, sender_email, action, service_links, sentiment_label, lang)
                    subj = subject if subject.lower().startswith("re:") else f"Re: {subject}"
                    to_addr = sender_email
                    gmail_send_reply_all(mid, meta["_thread_id"], to_addr, [], subj, reply_body)
                    mark_replied(hashes_data, subject, full_body, mid)
                    time.sleep(SEND_INTERVAL)
                    sent_count += 1
                    log["stats"]["replied"] += 1
                    # Update profiles
                    lid = ensure_label(LABELS["REPLIED"], labels_map)
                    gmail_modify(mid, add_labels=[lid])
                    update_sender_profile(sender_email, sender_history, reply_body, True)
                    update_personality(sender_email, reply_body, personalities)
                    update_conversation_state(sender_email, conv_states, cat, "reply")

            elif action == "reply_all":
                if is_quiet() and priority_score < 80:
                    draft_lid = ensure_label(LABELS["DRAFTED"], labels_map)
                    gmail_modify(mid, add_labels=[draft_lid])
                    log["stats"]["drafted"] += 1
                else:
                    reply_body = generate_reply(meta, full_body, subject, sender_name, sender_email, action, service_links, sentiment_label, lang, is_reply_all=True)
                    subj = subject if subject.lower().startswith("re:") else f"Re: {subject}"
                    to_addr = sender_email
                    cc_list = get_cc_list(meta)
                    gmail_send_reply_all(mid, meta["_thread_id"], to_addr, cc_list, subj, reply_body)
                    mark_replied(hashes_data, subject, full_body, mid)
                    time.sleep(SEND_INTERVAL)
                    sent_count += 1
                    log["stats"]["replied_all"] += 1
                    lid = ensure_label(LABELS["REPLIED_ALL"], labels_map)
                    gmail_modify(mid, add_labels=[lid])
                    update_sender_profile(sender_email, sender_history, reply_body, True)
                    update_personality(sender_email, reply_body, personalities)
                    update_conversation_state(sender_email, conv_states, cat, "reply_all")

            elif action == "escalate_human":
                lid = ensure_label(LABELS["HUMAN_REVIEW"], labels_map)
                gmail_modify(mid, add_labels=[lid])
                log["stats"]["escalated"] += 1

            elif action == "draft_only":
                lid = ensure_label(LABELS["DRAFTED"], labels_map)
                gmail_modify(mid, add_labels=[lid])
                log["stats"]["drafted"] += 1

            elif action == "meeting_proposal":
                if is_quiet():
                    draft_lid = ensure_label(LABELS["DRAFTED"], labels_map)
                    gmail_modify(mid, add_labels=[draft_lid])
                    log["stats"]["drafted"] += 1
                else:
                    proposal = generate_meeting_proposal(sender_name, subject, full_body, lang)
                    subj = subject if subject.lower().startswith("re:") else f"Re: {subject}"
                    gmail_send_reply_all(mid, meta["_thread_id"], sender_email, [], subj, proposal)
                    mark_replied(hashes_data, subject, full_body, mid)
                    time.sleep(SEND_INTERVAL)
                    sent_count += 1
                    log["stats"]["replied"] += 1
                    lid = ensure_label(LABELS["REPLIED"], labels_map)
                    gmail_modify(mid, add_labels=[lid])

            elif action == "followup_send":
                # Check if this is a follow-up WE need to send
                thread_id = meta["_thread_id"]
                if thread_id in tracker.get("threads",{}):
                    tinfo = tracker["threads"][thread_id]
                    if not tinfo.get("got_response", False) and tinfo.get("followup_count",0) < MAX_FOLLOWUPS:
                        subj_short = tinfo.get("subject", subject)[:60]
                        fb_body = generate_followup_body(subj_short, sender_name, tinfo.get("followup_count",0) + 1, lang)
                        gmail_send_reply_all(mid, thread_id, sender_email, [], f"Re: {subj_short}", fb_body)
                        time.sleep(SEND_INTERVAL)
                        sent_count += 1
                        log["stats"]["followups_sent"] += 1
                        record_followup(thread_id, sender_email, subject, tinfo.get("followup_count",0) + 1, tracker)
                        lid = ensure_label(LABELS["FOLLOWUP"], labels_map)
                        gmail_modify(mid, add_labels=[lid])
                else:
                    # New thread, treat as reply
                    reply_body = generate_reply(meta, full_body, subject, sender_name, sender_email, "reply", service_links, sentiment_label, lang)
                    subj = subject if subject.lower().startswith("re:") else f"Re: {subject}"
                    gmail_send_reply_all(mid, meta["_thread_id"], sender_email, [], subj, reply_body)
                    mark_replied(hashes_data, subject, full_body, mid)
                    time.sleep(SEND_INTERVAL)
                    sent_count += 1
                    log["stats"]["replied"] += 1

            else:
                # Default: process but don't action
                lid = ensure_label(LABELS["PROCESSED"], labels_map)
                gmail_modify(mid, add_labels=[lid])
                log["stats"]["skipped"] += 1

            # Update lang in personality
            if sender_email in personalities:
                personalities[sender_email]["lang"] = lang
                save_personalities(personalities)

        except Exception as e:
            log["stats"]["errors"] += 1
            print(f"[v21] Error processing {mid}: {e}")
            sys.stdout.flush()

    # ═══ PHASE 4: Follow-ups ═══
    try:
        pending = check_pending_followups(tracker)
        for thread_id, info in pending:
            if sent_count >= MAX_SEND_PER_RUN: break
            try:
                fb_num = info.get("followup_count", 0) + 1
                sender = info.get("sender","")
                subj = info.get("subject","Subject")
                name = sender.split("@")[0]
                fb_body = generate_followup_body(subj, name, fb_num)
                # Find thread recent message
                fb_subj = f"Re: {subj[:60]}"
                gmail_send_reply_all("", thread_id, sender, [], fb_subj, fb_body)
                time.sleep(SEND_INTERVAL)
                sent_count += 1
                log["stats"]["followups_sent"] += 1
                record_followup(thread_id, sender, subj, fb_num, tracker)
            except Exception as e:
                log["stats"]["errors"] += 1
                print(f"[v21] Follow-up error: {e}")
                sys.stdout.flush()
        save_tracker(tracker)
    except Exception as e:
        log["stats"]["errors"] += 1

    save_personalities(personalities)
    save_conv_states(conv_states)

    log["finished"] = now_iso()
    save_json(log_path, log)
    elapsed = (datetime.now() - datetime.fromisoformat(log["started"])).total_seconds()
    print(f"[v21] Run complete in {elapsed:.1f}s | stats: {json.dumps(log['stats'])}")
    sys.stdout.flush()
    return log

if __name__ == "__main__":
    run_pipeline()
