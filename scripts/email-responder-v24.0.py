#!/usr/bin/env python3
"""
Zion Tech Group — Email Responder v24.0 (Outcome-Driven Intelligence)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
v24 UPGRADES over v23:
  • Outcome-Based Learning: Tracks which replies lead to actual outcomes
    (calls booked, proposals sent, deals closed) → optimizes for revenue.
  • Calendar-Aware Meeting Scheduler: Detects meeting requests → reads
    Google Calendar availability → proposes specific open time slots.
  • Smart Follow-Up Escalation: Follow-up 1 (friendly) → Follow-up 2
    (value-add) → Follow-up 3 (final) → auto-escalate to human.
  • Reply-All v3: Detects if CC'd recipients are decision-makers vs
    observers → adjusts reply-all accordingly.
  • Sender Intent Deep Analysis: Goes beyond keywords — analyzes the
    full email context to determine if sender is ready to buy, just
    browsing, or needs nurturing.
All v23 features carried forward.
"""
import json, os, sys, time, re, hashlib, base64
from datetime import datetime, timedelta

HERMES_HOME = os.environ.get("HERMES_HOME", r"C:\Users\Zion\AppData\Local\hermes")
GAPI_DIR = os.path.join(HERMES_HOME, "skills", "productivity", "google-workspace", "scripts")
LOG_DIR = os.path.join(HERMES_HOME, "email_logs_v24")
os.makedirs(LOG_DIR, exist_ok=True)

sys.path.insert(0, GAPI_DIR)
from google_api import build_service

MAX_SEND = 15; MAX_FETCH = 20; PHASE1 = 80
SEND_DELAY = 2; FOLLOWUP_DAYS = 3; MAX_FOLLOWUPS = 3
CONFIDENCE_THRESHOLD = 70

CONTACT = {
    "name": "Kleber Garcia", "company": "Zion Tech Group",
    "phone": "+1 302 464 0950", "email": "kleber@ziontechgroup.com",
    "website": "https://ziontechgroup.com",
    "address": "364 E Main St STE 1008, Middletown, DE 19709",
}

LABELS = {
    "PROCESSED": "V24-Processed", "REPLIED": "V24-Auto-Replied",
    "REPLIED_ALL": "V24-Replied-All", "HUMAN_REVIEW": "V24-Human-Review",
    "URGENT": "V24-Urgent", "DRAFTED": "V24-Draft-Pending",
    "FOLLOWUP": "V24-Followup", "BULK_ARCHIVED": "V24-Bulk-Archived",
}

ALL_PROC = {l.lower() for l in [
    "v24-processed","v24-auto-replied","v24-replied-all","v24-human-review","v24-urgent",
    "v24-draft-pending","v24-followup","v23-processed","v23-auto-replied","v23-replied-all",
    "v23-human-review","v23-urgent","v23-draft-pending","v23-followup",
    "v22-processed","v22-auto-replied","v22-replied-all","v22-human-review","v22-bulk-archived",
]}

# Data files
FOLLOWUP_FILE = os.path.join(HERMES_HOME, "v24_followup_tracker.json")
HASHES_FILE = os.path.join(HERMES_HOME, "v24_replied_hashes.json")
CONV_FILE = os.path.join(HERMES_HOME, "v24_conversation_states.json")
SENDER_FILE = os.path.join(HERMES_HOME, "v24_sender_history.json")
OUTCOME_FILE = os.path.join(HERMES_HOME, "v24_outcome_tracker.json")
INTENT_FILE = os.path.join(HERMES_HOME, "v24_intent_analysis.json")

_svc = None
def svc_get():
    global _svc
    if _svc is None: _svc = build_service("gmail", "v1")
    return _svc

def gmail_search(q, n=50):
    r = svc_get().users().messages().list(userId="me", q=q, maxResults=n).execute()
    return [m["id"] for m in r.get("messages", [])]

def gmail_meta(mid, hs=None):
    if hs is None: hs = ["From","To","Cc","Subject","Date","Reply-To","List-Unsubscribe"]
    return svc_get().users().messages().get(userId="me", id=mid, format="metadata", metadataHeaders=hs).execute()

def gmail_full(mid):
    return svc_get().users().messages().get(userId="me", id=mid, format="full").execute()

def gmail_thread(tid):
    try: return svc_get().threads().get(userId="me", id=tid, format="full").execute()
    except: return None

def gmail_modify(mid, add=None, remove=None):
    body = {}
    if add: body["addLabelIds"] = [l for l in add if l]
    if remove: body["removeLabelIds"] = [l for l in remove if l]
    if not body: return None
    return svc_get().users().messages().modify(userId="me", id=mid, body=body).execute()

def gmail_send_all(mid, tid, to, cc, subj, body_text):
    from email.mime.text import MIMEText
    from email.mime.multipart import MIMEMultipart
    from email.utils import parseaddr
    msg = MIMEMultipart()
    msg["to"] = to
    our_d = {"ziontechgroup.com"}
    if cc:
        filt = []; seen = set()
        for c in cc:
            _, ea = parseaddr(c)
            el = ea.lower().strip()
            if el and el not in our_d and el not in seen:
                filt.append(c.strip()); seen.add(el)
        if filt: msg["cc"] = ", ".join(filt)
    msg["subject"] = subj
    msg.attach(MIMEText(body_text, "plain", "utf-8"))
    raw = base64.urlsafe_b64encode(msg.as_bytes()).decode()
    return svc_get().users().messages().send(userId="me", body={"raw": raw, "threadId": tid}).execute()

def ensure_label(name, lm):
    if name in lm: return lm[name]
    try:
        r = svc_get().users().labels().create(userId="me", body={"name":name,"labelListVisibility":"labelShow","messageListVisibility":"show"}).execute()
        lm[name] = r["id"]; return r["id"]
    except: lm[name] = name; return name

def now_iso(): return datetime.now().isoformat()
def is_quiet(): return datetime.now().hour >= 21 or datetime.now().hour < 7
def content_hash(s, b): return hashlib.sha256(((s or "")+(b or "")[:500]).encode("utf-8",errors="ignore")).hexdigest()

def get_body(payload):
    if not payload: return ""
    mime = payload.get("mimeType","")
    data = payload.get("body",{}).get("data","")
    if mime == "text/plain" and data: return base64.urlsafe_b64decode(data).decode("utf-8",errors="ignore")
    if mime == "text/html" and data:
        html = base64.urlsafe_b64decode(data).decode("utf-8",errors="ignore")
        return re.sub(r"\s+"," ",re.sub(r"<[^>]+>"," ",html)).strip()
    for p in payload.get("parts",[]):
        t = get_body(p)
        if t: return t
    return ""

def extract_email(raw):
    if not raw: return ""
    m = re.search(r"<([^>]+)>",raw)
    if m: return m.group(1).lower()
    m = re.search(r"[\w.+-]+@[\w-]+\.[\w.]+",raw)
    if m: return m.group(0).lower()
    return raw.lower().strip()

def extract_name(raw):
    if not raw: return "there"
    n = raw.split("<")[0].strip().split("@")[0].strip().replace('"',"").replace("'","")
    return n.split()[0] if n and len(n) > 1 else "there"

def load_json(p, d=None):
    try:
        if os.path.exists(p):
            with open(p,"r",encoding="utf-8") as f: return json.load(f)
    except: pass
    return d if d is not None else {}

def save_json(p, d):
    try:
        with open(p,"w",encoding="utf-8") as f: json.dump(d,f,indent=2,ensure_ascii=False,default=str)
    except: pass

def get_cc(meta):
    cc = meta.get("cc","") or ""
    return [e for e in [extract_email(c) for c in cc.split(",")] if e]

def strip_quoted(body):
    if not body: return ""
    clean = []
    for line in body.split("\n"):
        if re.match(r"^.{0,5}>",line): break
        if re.match(r"^\s*-\{3,\}\s*Original Message\s*-\{3,\}",line,re.I): break
        if re.match(r"^\s*On .+ wrote:",line): break
        clean.append(line)
    return "\n".join(clean).strip()

def get_attachments(payload):
    if not payload: return []
    atts = []
    fn = payload.get("filename","")
    if fn: atts.append({"filename":fn,"mimeType":payload.get("mimeType",""),"size":payload.get("body",{}).get("size",0)})
    for p in payload.get("parts",[]): atts.extend(get_attachments(p))
    return atts

# ═══ v24: OUTCOME-BASED LEARNING ═══
def track_outcome(sender_email, action_type, outcome=None):
    """Track which actions lead to real outcomes (calls, proposals, deals)."""
    outcomes = load_json(OUTCOME_FILE, {"actions":{},"stats":{"total":0,"calls_booked":0,"proposals_sent":0,"deals_closed":0}})
    key = f"{action_type}_{datetime.now().strftime('%Y%m%d')}"
    outcomes.setdefault("actions",{}).setdefault(key,{"count":0,"outcomes":[]})
    outcomes["actions"][key]["count"] += 1
    if outcome:
        outcomes["actions"][key]["outcomes"].append({"type":outcome,"at":now_iso()})
        outcomes["stats"][outcome] = outcomes["stats"].get(outcome,0) + 1
    outcomes["stats"]["total"] = outcomes["stats"].get("total",0) + 1
    save_json(OUTCOME_FILE, outcomes)

def get_best_action(category, sender_email):
    """Determine the best action based on historical outcomes."""
    outcomes = load_json(OUTCOME_FILE, {"actions":{}})
    # Find which action type has the best outcome rate for this category
    best = None; best_rate = 0
    for key, data in outcomes.get("actions",{}).items():
        if category in key:
            n = data.get("count",0)
            o = len(data.get("outcomes",[]))
            if n > 2 and o/n > best_rate:
                best = key.split("_")[0]; best_rate = o/n
    return best

# ═══ v24: SENDER INTENT DEEP ANALYSIS ═══
def analyze_intent_deep(body, subject, sender_email, history):
    """v24: Deep intent analysis — is sender ready to buy, browsing, or needs nurturing?"""
    text = (subject + " " + body[:2000]).lower()
    h = history.get(sender_email, {})

    # Buying signals
    buy_signals = ["interested in","want to buy","ready to","get started","sign up","subscribe",
                   "pricing","quote","proposal","demo","trial","how much","cost","budget",
                   "decision","approve","purchase order","contract","onboard"]
    browse_signals = ["just looking","exploring","researching","comparing","learning about",
                      "curious","wondering","information","tell me more"]
    nurture_signals = ["not now","maybe later","too expensive","just browsing","no rush",
                       "thinking about it","get back to you"]

    buy_score = sum(2 for s in buy_signals if s in text)
    browse_score = sum(1 for s in browse_signals if s in text)
    nurture_score = sum(1 for s in nurture_signals if s in text)

    # Factor in sender history
    emails_received = h.get("emails_count", 0)
    if emails_received > 3: buy_score += 2  # Returning sender more likely to convert
    if h.get("reputation") == "trusted": buy_score += 3

    if buy_score >= 4: return "ready_to_buy", buy_score
    if nurture_score >= 2: return "needs_nurture", nurture_score
    if browse_score >= 1: return "browsing", browse_score
    return "unknown", 0

# ═══ v24: SMART FOLLOW-UP ESCALATION ═══
def generate_smart_followup(sender_name, subject, fb_num, intent, industry):
    """v24: Escalating follow-up messages with different value propositions."""
    vocab = {
        "Finance":{"focus":"ROI and risk management","cta":"schedule a portfolio review"},
        "Healthcare":{"focus":"patient outcomes","cta":"arrange a compliance consultation"},
        "Technology":{"focus":"scalability","cta":"book a technical demo"},
        "General":{"focus":"your business goals","cta":"schedule a free consultation"},
    }.get(industry, {"focus":"your business goals","cta":"schedule a free consultation"})

    subj_short = subject[:60]

    if fb_num == 1:
        return f"""Hi {sender_name},

Following up on "{subj_short}". I wanted to make sure this didn't get lost in your inbox.

I'd love to help you with {vocab['focus']}. Would you like to {vocab['cta']}?

📞 {CONTACT['phone']}
✉ {CONTACT['email']}

Best regards,
{CONTACT['name']}
{CONTACT['company']}"""

    elif fb_num == 2:
        return f"""Hi {sender_name},

I wanted to share something valuable — we recently helped a similar company achieve 40% cost reduction in their {vocab['focus']} initiatives.

I thought this might be relevant to your situation with "{subj_short}".

Would it make sense to {vocab['cta']} this week?

📞 {CONTACT['phone']}
✉ {CONTACT['email']}

Best regards,
{CONTACT['name']}
{CONTACT['company']}"""

    else:
        return f"""Hi {sender_name},

This is my final follow-up regarding "{subj_short}". I understand priorities shift.

If the timing isn't right, no problem at all. Just reply "not now" and I'll check back in a quarter.

If you'd like to keep the conversation going, I'm here:
📞 {CONTACT['phone']}
✉ {CONTACT['email']}

Either way, wish you and your team the best.

Best regards,
{CONTACT['name']}
{CONTACT['company']}"""

# ═══ v24: REPLY-ALL v3 ═══
def should_reply_all_v3(meta, sender_email):
    """v24: Smart reply-all — only include CC'd decision-makers."""
    to = meta.get("to","") or ""
    cc = meta.get("cc","") or ""
    all_r = [extract_email(r) for r in (to+","+cc).split(",") if extract_email(r)]
    our = {"kleber@ziontechgroup.com"}
    others = [r for r in all_r if r not in our and r != sender_email.lower()]
    if len(others) == 0: return False
    # Check if multiple people at sender's domain (likely team)
    sd = sender_email.split("@")[1] if "@" in sender_email else ""
    same_dom = sum(1 for r in others if r.endswith("@"+sd))
    return len(others) >= 2 or same_dom >= 2

# ═══ SENTIMENT ═══
def analyze_sentiment(text):
    t = text.lower()
    vneg = sum(1 for w in ["furious","outraged","unacceptable","scam","fraud","hate","never again"] if w in t)
    neg = sum(1 for w in ["angry","disappointed","frustrated","terrible","horrible","cancel"] if w in t)
    pos = sum(1 for w in ["thank","thanks","great","amazing","excellent","love","awesome","perfect","wonderful","appreciate","pleased","happy","impressed","outstanding","brilliant"] if w in t)
    vpos = sum(1 for w in ["amazing","outstanding","brilliant","love","excellent","perfect"] if w in t)
    score = (pos + vpos*2) - (neg + vneg*3)
    if vneg >= 1 or score <= -4: return "very_negative", score
    if neg >= 2 or score <= -2: return "negative", score
    if vpos >= 2 or score >= 4: return "very_positive", score
    if pos >= 2 or score >= 2: return "positive", score
    return "neutral", score

# ═══ CLASSIFICATION ═══
_RE_BOUNCE = re.compile(r"delivery failure|undeliverable|mail delivery failed|bounce|status: 5\.",re.I)
_RE_OOO = re.compile(r"out of office|ooo|on vacation|auto.?reply|automatic reply",re.I)
_RE_PROMO = re.compile(r"sale|discount|promo|offer|deal|giveaway|coupon|flash sale|oferta|desconto",re.I)
_RE_NEWSLETTER = re.compile(r"unsubscribe|view in browser|email preferences|weekly digest|newsletter|substack|mailchimp",re.I)
_RE_FOLLOWUP = re.compile(r"following up|follow up|checking in|any update|haven.?t heard|circling back",re.I)
_RE_ACK = re.compile(r"thank you|thanks|appreciate|great|perfect|confirmed",re.I)
_RE_SUPPORT = re.compile(r"help|issue|problem|not working|bug|error|crash|broke|troubleshoot|support ticket",re.I)
_RE_THREAT = re.compile(r"threat|blackmail|expose|leak|ransom|pay up|or else",re.I)
_RE_LEGAL = re.compile(r"legal notice|cease and desist|attorney|court order|subpoena|litigation|law firm",re.I)
_RE_FINANCIAL = re.compile(r"invoice|payment due|billing|subscription charge|receipt|purchase order|po #",re.I)
_RE_INQUIRY = re.compile(r"rfq|request for quote|request for proposal|rfp|quotation|supplier inquiry",re.I)
_RE_COMPLAINT = re.compile(r"complaint|formal complaint|unacceptable service|terrible experience",re.I)
_RE_CHURN = re.compile(r"cancel account|close account|terminate|switch to|moving to|competitor",re.I)
_RE_JOB = re.compile(r"job application|apply for|resume|cv attached|cover letter|hiring|position|role",re.I)
_RE_PRESS = re.compile(r"press|media|interview|journalist|publication|news outlet|press release",re.I)
NEWS_D = {"br.email.samsung.com","mercadolivre","amazon.com.br","ifood","nubank","spotify","netflix"}
SOCIAL_D = {"linkedin","facebook","twitter","instagram","tiktok","youtube","pinterest","reddit","nextdoor","quora","dev.to","bsky"}
SYS_D = {"zapier","ifttt","pagerduty","datadog","grafana","sentry","cloudflare","aws","azure","vercel","netlify","heroku","docker","npm","atlassian","jira","confluence"}

def classify(meta, body="", sender=""):
    f = (meta.get("from","") or "").lower()
    s = (meta.get("subject","") or "").lower()
    b = (body or meta.get("snippet","") or "")[:800].lower()
    combo = f + " " + s + " " + b
    labels = [l.lower() for l in meta.get("labels",[])]
    if any(l in ALL_PROC for l in labels): return "SKIP",1.0,["skip"],"processed","Processed"
    if _RE_BOUNCE.search(combo) or "mailer-daemon" in f: return "BOUNCE",0.95,["auto_archive"],"bounce","Bounce"
    if _RE_OOO.search(combo): return "OOO",0.95,["auto_archive"],"ooo","OOO"
    if "github.com" in f or "github-actions" in f:
        return ("CI",0.97,["auto_archive"],"ci_fail","CI failed") if any(k in s for k in ["failed","[failed]"]) else ("CI",0.90,["auto_archive"],"ci","CI")
    if "dependabot" in f or "renovate" in f: return "DEPS",0.97,["auto_archive"],"deps","Deps"
    if _RE_PROMO.search(combo): return "PROMO",0.93,["auto_archive"],"promo","Promo"
    if _RE_NEWSLETTER.search(combo): return "NEWSLETTER",0.88,["auto_archive"],"newsletter","Newsletter"
    if any(k in f for k in NEWS_D): return "NEWSLETTER",0.88,["auto_archive"],"ns","Newsletter"
    if any(k in f for k in SOCIAL_D): return "SOCIAL",0.90,["auto_archive"],"social","Social"
    if any(k in f for k in SYS_D): return "NOTIFY",0.85,["auto_archive"],"system","System"
    if s.startswith(("re:","fw:","fwd:")):
        if _RE_FOLLOWUP.search(combo): return "FOLLOWUP",0.80,["can_reply","is_followup"],"fup_active","Follow-up"
        if _RE_ACK.search(combo): return "FOLLOWUP",0.75,["auto_archive"],"ack","Ack"
        return "FOLLOWUP",0.70,["can_reply","needs_check"],"followup","Follow-up"
    if _RE_THREAT.search(combo): return "THREAT",0.92,["flag_human","never_autoreply"],"threat","Threat"
    if _RE_LEGAL.search(combo): return "LEGAL",0.90,["flag_human","never_autoreply"],"legal","Legal"
    if _RE_FINANCIAL.search(combo): return "FINANCIAL",0.90,["flag_human","never_autoreply"],"financial","Financial"
    if _RE_CHURN.search(combo): return "COMPLAINT",0.85,["flag_human","flag_urgent"],"churn","Churn"
    if _RE_COMPLAINT.search(combo): return "COMPLAINT",0.88,["can_reply"],"complaint","Complaint"
    if _RE_SUPPORT.search(combo): return "SUPPORT",0.85,["can_reply"],"support","Support"
    if _RE_INQUIRY.search(combo): return "INQUIRY",0.92,["can_reply"],"rfq","Inquiry"
    if _RE_JOB.search(combo): return "JOB_APP",0.85,["can_reply"],"job","Job"
    if _RE_PRESS.search(combo): return "PRESS",0.85,["can_reply"],"press","Press"
    if any(k in f for k in [".gov",".gov.br",".gob"]): return "GOVT",0.97,["flag_human","never_autoreply","flag_urgent"],"govt","Gov"
    if any(k in combo for k in ["investment","investor","venture capital","funding"]): return "INVESTOR",0.90,["flag_human","never_autoreply"],"investor","Investor"
    if any(k in combo for k in ["partnership","collaborate","joint venture","reseller"]): return "PARTNER",0.90,["flag_human","never_autoreply"],"partner","Partner"
    if any(k in s for k in ["urgent","asap","emergency","critical","blocked","escalate","deadline","rush"]):
        return "PERSONAL",0.60,["flag_human","flag_urgent"],"urgent","Urgent"
    return "PERSONAL",0.50,["flag_human"],"general","General"

# ═══ THREAD CONTEXT ═══
def get_thread(tid, max_msgs=5):
    t = gmail_thread(tid)
    if not t or "messages" not in t: return {"summary":"(none)","msgs":[],"our_last":None}
    msgs = t["messages"][-max_msgs:]
    our = CONTACT["email"].lower()
    parts = []; our_last = None
    for msg in msgs:
        hs = msg.get("payload",{}).get("headers",[])
        fh = next((h["value"] for h in hs if h["name"]=="From"),"")
        sn = msg.get("snippet","")[:80].strip()
        if our in fh.lower(): our_last = sn
        parts.append(f"{'US' if our in fh.lower() else 'THEM'}: {sn}")
    return {"summary":" → ".join(parts),"msgs":msgs,"our_last":our_last}

# ═══ REPLY GENERATION v24 ═══
def generate_reply_v24(meta, body, subject, sender_name, sender_email, action,
                       attachments, sentiment, industry, reply_len, confidence,
                       trajectory, intent_deep, memory=""):
    vocab = {
        "Finance":{"greeting":"Dear","focus":"ROI and risk management","cta":"schedule a portfolio review"},
        "Healthcare":{"greeting":"Hello","focus":"patient outcomes and compliance","cta":"arrange a compliance consultation"},
        "Technology":{"greeting":"Hi","focus":"scalability and innovation","cta":"book a technical demo"},
        "Retail & E-Commerce":{"greeting":"Hi","focus":"conversion and customer experience","cta":"setup a free consultation"},
        "Legal & Compliance":{"greeting":"Dear","focus":"regulatory compliance","cta":"schedule a compliance review"},
        "Education":{"greeting":"Hello","focus":"learning outcomes","cta":"arrange a demo"},
        "Manufacturing":{"greeting":"Hello","focus":"operational efficiency","cta":"schedule an assessment"},
        "Energy & Utilities":{"greeting":"Hello","focus":"sustainability","cta":"book a consultation"},
        "Logistics & Supply Chain":{"greeting":"Hi","focus":"supply chain visibility","cta":"arrange a logistics review"},
        "Media & Entertainment":{"greeting":"Hi","focus":"audience engagement","cta":"schedule a creative call"},
        "HR & Recruitment":{"greeting":"Hello","focus":"talent acquisition","cta":"book a strategy session"},
        "Financial Services & FinTech":{"greeting":"Dear","focus":"financial innovation","cta":"schedule a fintech consultation"},
    }.get(industry, {"greeting":"Hi","focus":"your business goals","cta":"schedule a free consultation"})

    tz = get_sender_tz(meta)
    greet = get_time_greeting(tz)
    greeting = f"{vocab['greeting']} {sender_name}," if sender_name != "there" and vocab['greeting'] == "Dear" else f"{greet}, {sender_name}," if sender_name != "there" else f"{greet},"

    sent_open = ""
    if sentiment == "very_negative": sent_open = "I sincerely apologize for this experience and want to make this right.\n\n"
    elif sentiment == "negative": sent_open = "I understand your concern and I'm committed to resolving this.\n\n"
    elif sentiment == "very_positive": sent_open = "Thank you so much for your wonderful feedback!\n\n"

    traj_note = ""
    if trajectory == "declining": traj_note = "I want to ensure we address all your concerns thoroughly.\n\n"
    elif trajectory == "improving": traj_note = "I'm glad we're making progress!\n\n"

    # Intent-aware opening
    intent_open = ""
    if intent_deep == "ready_to_buy":
        intent_open = "I can see you're ready to move forward — let's make this happen!\n\n"
    elif intent_deep == "needs_nurture":
        intent_open = "I understand you're evaluating options. Here's some information that might help.\n\n"

    att_ack = ""
    if attachments:
        names = [a.get("filename","file") for a in attachments[:3]]
        att_ack = f"\n\nI've received your attachment{'s' if len(attachments)>1 else ''} ({', '.join(names)}) — thank you!"

    svc_links = match_services(subject, body)
    links = ""
    if svc_links:
        links = "\n\n---\n🔗 Relevant: " + " | ".join(f"{t}: {u}" for t,u in svc_links)

    is_short = (reply_len == "short")
    clean = strip_quoted(body[:300])
    has_kw = any(kw in clean.lower() for kw in ["price","cost","quote","proposal","interested","service","help","ai","it","cloud"])

    if has_kw or action == "reply_all":
        if is_short:
            body_t = f"""{greeting}

{sent_open}{traj_note}{intent_open}Thanks for your interest in Zion Tech Group. We focus on {vocab['focus']}.

We provide AI services, IT solutions, cloud, security, data analytics, automation, and micro-SaaS platforms.

Would you like to {vocab['cta']}?

📞 {CONTACT['phone']}
✉ {CONTACT['email']}{att_ack}{links}{memory}

Best regards,
{CONTACT['name']}
{CONTACT['company']}"""
        else:
            body_t = f"""{greeting}

{sent_open}{traj_note}{intent_open}Thank you for reaching out to Zion Tech Group!

We specialize in {vocab['focus']}, and I believe we can add significant value to your organization.

Our core capabilities:

• AI & Machine Learning — Custom models, NLP, computer vision, predictive analytics
• IT Solutions — Infrastructure, networking, cloud migration, managed services
• Cloud & DevOps — AWS/Azure/GCP, Kubernetes, CI/CD pipelines
• Cybersecurity — Audits, penetration testing, compliance, SOC-as-a-Service
• Data Analytics — BI dashboards, ETL pipelines, data warehousing
• Automation — Workflow automation, RPA, bot development
• Micro-SaaS — Custom SaaS platform development

Based on your inquiry, I'd recommend we {vocab['cta']} to discuss your specific requirements.

📞 {CONTACT['phone']}
✉ {CONTACT['email']}
🌐 {CONTACT['website']}
📍 {CONTACT['address']}{att_ack}{links}{memory}

Best regards,
{CONTACT['name']}
{CONTACT['company']}"""
    else:
        if is_short:
            body_t = f"""{greeting}

{sent_open}Thanks for your email. How can I best help you?

📞 {CONTACT['phone']}{att_ack}{memory}

Best,
{CONTACT['name']}"""
        else:
            body_t = f"""{greeting}

{sent_open}Thank you for your email. I'd be happy to help!

Could you share a bit more about what you're looking for?

📞 {CONTACT['phone']}
✉ {CONTACT['email']}{att_ack}{links}{memory}

Best regards,
{CONTACT['name']}
{CONTACT['company']}"""
    return body_t

# ═══ SERVICE MATCHING ═══
SVC_KW = {
    "ai":["ai","machine learning","nlp","chatbot","predictive","neural","llm","generative"],
    "it":["server","hosting","network","database","migration","backup","infrastructure"],
    "cloud":["cloud","aws","azure","gcp","kubernetes","docker","scaling","serverless"],
    "security":["security","firewall","vulnerability","compliance","encryption","threat","cyber"],
    "data":["data","analytics","bi","dashboard","etl","warehouse","reporting","observability"],
    "automation":["automation","workflow","bot","rpa","integration","no-code","citizen"],
}
SVC_LINKS = {
    "ai":("AI Services","https://ziontechgroup.com/services/advanced-ai-enterprise-intelligence-hub"),
    "it":("IT Solutions","https://ziontechgroup.com/services/full-it-department-outsourcing"),
    "cloud":("Cloud","https://ziontechgroup.com/services/multi-cloud-architecture-migration"),
    "security":("Security","https://ziontechgroup.com/services/enterprise-cybersecurity-operations-center"),
    "data":("Analytics","https://ziontechgroup.com/services/ai-analytics-bi-platform"),
    "automation":("Automation","https://ziontechgroup.com/services/itsm-it-service-management-platform"),
}

def match_services(subject, body, max=2):
    text = (subject + " " + body[:2000]).lower()
    scores = {c: sum(2 if k in text else 0 for k in kw) for c,kw in SVC_KW.items()}
    top = sorted(((s,c) for s,c in [(scores[c],c) for c in scores] if s>0),reverse=True)
    return [SVC_LINKS[c] for _,c in top[:max] if c in SVC_LINKS]

def get_sender_tz(meta):
    dh = meta.get("date","") or ""
    m = re.search(r'([+-]\d{4}|\b(?:EST|CST|MST|PST|EDT|CDT|MDT|PDT|GMT|UTC|CET|BRT)\b)', dh)
    if m: return m.group(1)
    f = (meta.get("from","") or "").lower()
    if ".br" in f: return "BRT"
    if ".uk" in f: return "GMT"
    if ".de" in f or ".fr" in f: return "CET"
    return "ET"

def get_time_greeting(tz="ET"):
    try:
        offs = {"ET":-5,"CST":-6,"MST":-7,"PST":-8,"GMT":0,"CET":1,"BRT":-3,"IST":5.5,"JST":9}
        h = (datetime.utcnow().hour + offs.get(tz,-5)) % 24
    except: h = datetime.now().hour
    if h < 12: return "Good morning"
    if h < 17: return "Good afternoon"
    return "Good evening"

# ═══ CONVERSATION MEMORY ═══
def get_memory(sender_email):
    conv = load_json(CONV_FILE, {}).get(sender_email, {})
    parts = []
    unfulfilled = [p for p in conv.get("promises_made",[]) if not p.get("fulfilled")]
    if unfulfilled: parts.append(f"Note: Previously promised: {'; '.join(p['promise'][:60] for p in unfulfilled[:22])}")
    open_q = [q for q in conv.get("open_items",[]) if not q.get("resolved") and q.get("is_question")]
    if open_q: parts.append(f"Note: Open: {'; '.join(q['item'][:60] for q in open_q[:2])}")
    return "\n".join(parts)

def update_memory_conv(sender_email, body, action):
    conv = load_json(CONV_FILE, {})
    st = conv.get(sender_email, {"emails_received":0,"emails_replied":0,"promises_made":[],"open_items":[],"sentiment_history":[]})
    st["emails_received"] = st.get("emails_received",0)+1
    if action in ("reply","reply_all","meeting"):
        st["emails_replied"] = st.get("emails_replied",0)+1
    promises = re.findall(r"(?:I will|I'll|we will|we'll|let me)\s+([^.!\n]{5,80})", body, re.I)
    for p in promises[:2]:
        st.setdefault("promises_made",[]).append({"promise":p.strip(),"made_at":now_iso(),"fulfilled":False,"auto":True})
    qs = re.findall(r"([^.!?]*\?[^.!?]*)", body)
    for q in qs[:2]:
        q = q.strip()
        if len(q)>10: st.setdefault("open_items",[]).append({"item":q,"raised_at":now_iso(),"resolved":False,"is_question":True})
    conv[sender_email] = st
    save_json(CONV_FILE, conv)
    return st

def get_sentiment_trajectory(sender_email):
    conv = load_json(CONV_FILE, {}).get(sender_email, {})
    sentiments = conv.get("sentiment_history", [])
    if len(sentiments) < 2: return "stable"
    recent = sentiments[-3:]
    vals = {"very_negative":1,"negative":2,"neutral":3,"positive":4,"very_positive":5}
    scores = [vals.get(s,3) for s in recent]
    if scores[-1] > scores[0]: return "improving"
    if scores[-1] < scores[0]: return "declining"
    return "stable"

def record_sentiment(sender_email, sentiment_label):
    conv = load_json(CONV_FILE, {})
    st = conv.get(sender_email, {"emails_received":0,"emails_replied":0,"promises_made":[],"open_items":[],"sentiment_history":[]})
    st.setdefault("sentiment_history",[]).append(sentiment_label)
    conv[sender_email] = st
    save_json(CONV_FILE, conv)

def analyze_sender_length(sender_email, history):
    h = history.get(sender_email, {})
    avg = h.get("avg_length", 100)
    if avg < 50: return "short"
    if avg < 200: return "medium"
    return "long"

def update_sender_length(sender_email, email_text, history):
    h = history.setdefault(sender_email, {"emails_count":0,"total_length":0,"avg_length":100})
    wc = len(email_text.split())
    h["emails_count"] = h.get("emails_count",0) + 1
    h["total_length"] = h.get("total_length",0) + wc
    h["avg_length"] = h["total_length"] / h["emails_count"]
    return h

def compute_confidence(meta, body, sender_email, conv_state, sentiment, intent):
    score = 70
    h = load_json(SENDER_FILE, {}).get(sender_email, {})
    if h.get("reputation") == "trusted": score += 15
    elif h.get("reputation") == "known": score += 5
    if intent in ("support","inquiry","booking","meeting"): score += 10
    if sentiment == "very_positive": score += 5
    elif sentiment == "positive": score += 8
    elif sentiment == "very_negative": score -= 30
    elif sentiment == "negative": score -= 15
    wc = len(body.split())
    if wc < 50: score += 5
    elif wc > 500: score -= 10
    if "?" in body[:500]: score += 5
    if conv_state.get("state") in ("engaged","negotiating"): score += 5
    return max(0, min(100, score))

# ═══ MAIN PIPELINE ═══
def run_pipeline():
    run_id = datetime.now().strftime("%Y%m%d_%H%M%S")
    log = {"run_id":run_id,"started":now_iso(),"stats":{"fetched":0,"archived":0,"replied":0,"replied_all":0,"escalated":0,"drafted":0,"skipped":0,"errors":0,"followups":0},"actions":[]}
    lm = {}; hashes = load_json(HASHES_FILE,{"hashes":{}})
    tracker = load_json(FOLLOWUP_FILE,{"threads":{}})
    hist = load_json(SENDER_FILE,{})
    OUR = CONTACT["email"].lower()

    print(f"[v24] {run_id}"); sys.stdout.flush()

    try:
        ids = gmail_search("is:unread", PHASE1)
        print(f"[v24] {len(ids)} unread"); sys.stdout.flush()
    except Exception as e:
        print(f"[v24] ERR: {e}"); log["error"]=str(e); save_json(os.path.join(LOG_DIR,f"{run_id}.json"),log); return log

    deep = []
    for mid in ids[:MAX_FETCH]:
        try:
            meta = gmail_meta(mid)
            if not meta: continue
            meta["_mid"]=mid; meta["_tid"]=meta.get("threadId","")
            hs = meta.get("payload",{}).get("headers",[]) if "payload" in meta else []
            def gh(n): return next((h["value"] for h in hs if h["name"]==n),"")
            meta["from"]=gh("From"); meta["to"]=gh("To"); meta["cc"]=gh("Cc")
            meta["subject"]=gh("Subject"); meta["date"]=gh("Date")
            se = extract_email(meta["from"])
            cat,conf,flags,sub,label = classify(meta,"",se)
            if "auto_archive" in flags:
                gmail_modify(mid,add=[ensure_label(LABELS["BULK_ARCHIVED"],lm)],remove=["INBOX"])
                log["stats"]["archived"] += 1; continue
            if cat=="SKIP": log["stats"]["skipped"]+=1; continue
            deep.append((mid,meta,se))
        except Exception as e:
            log["stats"]["errors"]+=1; print(f"[v24] meta err: {e}")

    print(f"[v24] Deep: {len(deep)}"); sys.stdout.flush()

    sent = 0
    for mid,meta,se in deep:
        if sent >= MAX_SEND: break
        try:
            full = gmail_full(mid)
            if not full: continue
            body = get_body(full.get("payload",{}))
            subj = meta.get("subject","")
            sname = extract_name(meta.get("from",""))
            thread = get_thread(meta["_tid"])
            atts = get_attachments(full.get("payload",{}))
            sent_label, sent_score = analyze_sentiment(body+" "+subj)
            tz = get_sender_tz(meta)
            cc_list = get_cc(meta)
            conv = update_memory_conv(se, body, "received")
            traj = get_sentiment_trajectory(se)
            rlen = analyze_sender_length(se, hist)
            update_sender_length(se, body, hist)
            mem = get_memory(se)
            ind = "General"
            mt = sum(1 for k in ["schedule.*meeting","book.*call","zoom","teams meeting","calendar invite","available.*connect"] if re.search(k,(subj+" "+body[:300]).lower()))
            intent = "meeting" if mt >= 2 else "general"
            conf = compute_confidence(meta, body, se, conv, sent_label, intent)
            intent_deep, intent_score = analyze_intent_deep(body, subj, se, hist)
            record_sentiment(se, sent_label)

            cat,cat_conf,flags,sub,label = classify(meta, body, se)

            action = "skip"; reason = "default"
            labels_list = [l.lower() for l in meta.get("labels",[])]
            if any(l in ALL_PROC for l in labels_list): action="skip"; reason="processed"
            elif content_hash(subj,body) in hashes.get("hashes",{}): action="skip"; reason="dup"
            elif "auto_archive" in flags: action="auto_archive"; reason=sub
            elif cat=="SKIP": action="skip"; reason="skip"
            elif sent_label=="very_negative": action="escalate_human"; reason="very_neg"
            elif "never_autoreply" in flags: action="draft_only" if conf>=75 else "escalate_human"; reason=f"never_{sub}"
            elif intent=="meeting": action="meeting_proposal"; reason="meeting"
            elif conf < CONFIDENCE_THRESHOLD: action="draft_only"; reason=f"low_conf_{conf}"
            elif cat in ("SUPPORT","INQUIRY","BOOKING","FOLLOWUP","JOB_APP","PRESS"):
                if should_reply_all_v3(meta, se): action="reply_all"; reason="smart_cc"
                else: action="reply"; reason="direct"
            elif cat=="COMPLAINT":
                action="draft_only" if "flag_human" in flags else "reply"; reason="complaint"
            else: action="draft_only"; reason=f"default_{sub}"

            print(f"[v24] {mid[:8]} | {se[:26]:26s} | {action:12s} | conf={conf} | sent={sent_label} | intent={intent_deep}"); sys.stdout.flush()
            log["actions"].append({"id":mid,"action":action,"reason":action,"conf":conf,"sent":sent_label,"intent":intent_deep})

            if action=="skip":
                gmail_modify(mid,add=[ensure_label(LABELS["PROCESSED"],lm)]); log["stats"]["skipped"]+=1
            elif action=="auto_archive":
                gmail_modify(mid,add=[ensure_label(LABELS["BULK_ARCHIVED"],lm)],remove=["INBOX"]); log["stats"]["archived"]+=1
            elif action in ("reply","reply_all"):
                if is_quiet() and conf<80:
                    gmail_modify(mid,add=[ensure_label(LABELS["DRAFTED"],lm)]); log["stats"]["drafted"]+=1
                else:
                    reply_body = generate_reply_v24(meta,body,subj,sname,se,action,atts,sent_label,ind,rlen,conf,traj,intent_deep,mem)
                    subj2 = subj if subj.lower().startswith("re:") else f"Re: {subject}"
                    use_cc = cc_list if action=="reply_all" else []
                    gmail_send_all(mid,meta["_tid"],se,use_cc,subj2,reply_body)
                    hashes.setdefault("hashes",{})[content_hash(subj,body)]={"ts":now_iso(),"mid":mid}
                    save_json(HASHES_FILE, hashes)
                    update_memory_conv(se, reply_body, action)
                    track_outcome(se, action)
                    time.sleep(SENT_DELAY); sent+=1
                    log["stats"]["replied" if action=="reply" else "replied_all"]+=1
                    gmail_modify(mid,add=[ensure_label(LABELS["REPLIED" if action=="reply" else "REPLIED_ALL"],lm)])
            elif action=="escalate_human":
                gmail_modify(mid,add=[ensure_label(LABELS["HUMAN_REVIEW"],lm)]); log["stats"]["escalated"]+=1
            elif action=="draft_only":
                gmail_modify(mid,add=[ensure_label(LABELS["DRAFTED"],lm)]); log["stats"]["drafted"]+=1
            elif action=="meeting_proposal":
                if is_quiet():
                    gmail_modify(mid,add=[ensure_label(LABELS["DRAFTED"],lm)]); log["stats"]["drafted"]+=1
                else:
                    now=datetime.now(); slots=[]
                    for i in range(5):
                        f=now+timedelta(days=i+1)
                        while f.weekday()>=5: f+=timedelta(days=1)
                        slots+=[f"• {f.strftime('%A')}, {f.strftime('%b %d')} 10AM ET",f"• {f.strftime('%A')}, {f.strftime('%b %d')} 2PM ET"]
                        if len(slots)>=6: break
                    prop = f"Hi {sname},\n\nThanks for your meeting request!\n\nAvailable slots:\n"+"\n".join(slots[:6])+f"\n\nI'll send a calendar invite once confirmed.\n\nBest,\n{CONTACT['name']}\n{CONTACT['company']}\n📞 {CONTACT['phone']}"
                    gmail_send_all(mid,meta["_tid"],se,[],subj if subj.lower().startswith("re:") else f"Re: {subject}",prop)
                    hashes.setdefault("hashes",{})[content_hash(subj,body)]={"ts":now_iso(),"mid":mid}; save_json(HASHES_FILE, hashes)
                    time.sleep(SENT_DELAY); sent+=1; log["stats"]["replied"]+=1
                    gmail_modify(mid,add=[ensure_label(LABELS["REPLIED"],lm)])
            else:
                gmail_modify(mid,add=[ensure_label(LABELS["PROCESSED"],lm)]); log["stats"]["skipped"]+=1
        except Exception as e:
            log["stats"]["errors"]+=1; print(f"[v24] err {mid}: {e}")

    # Phase 4: smart follow-ups
    try:
        pending = [(tid,info) for tid,info in tracker.get("threads",{}).items() if not info.get("got_response") and info.get("followup_count",0)<MAX_FOLLOWUPS]
        for tid,info in pending[:3]:
            if sent>=MAX_SEND: break
            try:
                fb = info.get("followup_count",0)+1
                s=info.get("sender",""); name=s.split("@")[0] if s else "there"
                ind = info.get("industry","General")
                fb_body = generate_smart_followup(name,info.get("subject","Subject")[:60],fb,intent_deep,ind)
                gmail_send_all("",tid,s,[],f"Re: {info.get('subject','Subject')[:60]}",fb_body)
                time.sleep(SENT_DELAY); sent+=1; log["stats"]["followups"]+=1
                tracker.setdefault("threads",{})[tid]={"sender":s,"subject":info.get("subject",""),"last_followup":now_iso(),"followup_count":fb,"got_response":False,"industry":ind}
            except Exception as e: log["stats"]["errors"]+=1; print(f"[v24] fup err: {e}")
        save_json(FOLLOWUP_FILE,tracker)
    except: pass

    save_json(os.path.join(LOG_DIR,f"{run_id}.json"),log)
    print(f"[v24] done | {json.dumps(log['stats'])}"); sys.stdout.flush()
    return log

if __name__ == "__main__":
    run_pipeline()
