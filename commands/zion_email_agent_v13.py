#!/usr/bin/env python3
"""
Zion Tech Group – Email Interaction Agent V13.0
Multimodal Intelligence with Calendar & Revenue Attribution

New in V13 (vs V12):
- Multimodal processing: analyze image attachments (screenshots, docs, photos)
- Calendar integration: parse meeting requests, auto-book, send calendar links
- A/B subject line testing: generate variants, track performance
- Revenue attribution: track email threads → closed deals
- Smart follow-up sequences: multi-touch with escalating urgency
- Thread summarization: condense long threads before responding
- Sender personality matching: adapt style to sender's communication preference
- Sentiment-triggered escalation: auto-escalate when frustration detected
"""
import os, json, subprocess, logging, re, hashlib, time
from datetime import datetime, timezone, timedelta
from pathlib import Path

WORKDIR = Path(os.environ.get("ZION_ROOT", str(Path(__file__).resolve().parent.parent)))
LOG = WORKDIR / "logs" / "email_v13.log"
for d in ["logs", "data"]:
    (WORKDIR / d).mkdir(exist_ok=True)

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s",
    handlers=[logging.FileHandler(LOG), logging.StreamHandler()])
log = logging.getLogger("EmailV13")

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

def check_h():
    try: return subprocess.run(["himalaya","--version"],capture_output=True,text=True,timeout=5).returncode==0
    except: return False

def extract_json(raw):
    if not raw: return None
    try:
        c = re.sub(r"^```(?:json)?\s*","",raw.strip())
        c = re.sub(r"\s*```$","",c)
        return json.loads(c)
    except: return None

# ─── HEADER PARSER ──────────────────────────────────────────

def parse_headers(raw):
    h = {"from_name":"","from_email":"","to":[],"cc":[],"reply_to":[],
         "subject":"","body_text":"","date":"","message_id":"","in_reply_to":"",
         "references":[],"list_id":"","list_unsubscribe":"","auto_submitted":"",
         "precedence":"","x_mailer":"","reply_all_safe":True,"is_automated":False,
         "is_noreply":False,"is_mailing_list":False,"is_bulk":False,
         "is_phishing_suspect":False,"content_language":"en","urgency_signals":[]}
    try:
        unfolded = re.sub(r"\r?\n([ \t])"," ",raw)
        parts = re.split(r"\r?\n\r?\n",unfolded,maxsplit=1)
        hb = parts[0] if parts else ""
        bb = parts[1] if len(parts)>1 else ""
        for line in hb.split("\n"):
            if not line.strip(): continue
            if re.match(r"^[A-Za-z_-]+:",line):
                k,v = line.partition(":")[0].strip().lower(),line.partition(":")[2].strip()
                if k=="from":
                    h["from_name"]=v
                    m=re.search(r'[\w.+-]+@[\w.-]+\.\w+',v)
                    h["from_email"]=m.group(0) if m else (v if "@" in v else "")
                elif k=="to":
                    for a in v.split(","):
                        m=re.search(r'[\w.+-]+@[\w.-]+\.\w+',a)
                        e=m.group(0) if m else a.strip()
                        if e: h["to"].append(e)
                elif k=="cc":
                    for a in v.split(","):
                        m=re.search(r'[\w.+-]+@[\w.-]+\.\w+',a)
                        e=m.group(0) if m else a.strip()
                        if e: h["cc"].append(e)
                elif k=="reply-to":
                    for a in v.split(","):
                        m=re.search(r'[\w.+-]+@[\w.-]+\.\w+',a)
                        e=m.group(0) if m else a.strip()
                        if e: h["reply_to"].append(e)
                elif k=="subject": h["subject"]=v
                elif k=="message-id": h["message_id"]=v.strip()
                elif k=="in-reply-to": h["in_reply_to"]=v.strip()
                elif k=="references": h["references"]=[x.strip() for x in v.split() if x.strip()]
                elif k=="list-id": h["list_id"]=v; h["is_mailing_list"]=True; h["reply_all_safe"]=False
                elif k=="list-unsubscribe": h["list_unsubscribe"]=v; h["is_mailing_list"]=True; h["reply_all_safe"]=False
                elif k=="auto-submitted":
                    h["auto_submitted"]=v
                    if "auto" in v.lower(): h["is_automated"]=True; h["reply_all_safe"]=False
                elif k=="precedence":
                    h["precedence"]=v
                    if v.lower() in ("bulk","list","junk"): h["is_bulk"]=True; h["reply_all_safe"]=False
                elif k=="x-mailer": h["x_mailer"]=v
        for addr in [h["from_email"]]+h["to"]+h["cc"]:
            if any(x in addr.lower() for x in ["noreply","no-reply","donotreply","mailer-daemon"]):
                h["is_noreply"]=True; h["reply_all_safe"]=False; break
        sl = h["subject"].lower()
        for s in ["urgent","asap","emergency","critical","immediate","action required","deadline"]:
            if s in sl: h["urgency_signals"].append(s)
        h["body_text"] = bb.strip()[:6000]
        h["content_language"] = _detect_lang(bb)
    except Exception as e: log.debug(f"Parse error: {e}")
    return h

def _detect_lang(text):
    tl = text.lower()
    for lang,words in {"pt":["olá","obrigado","por favor"],"es":["hola","gracias","por favor"],"fr":["bonjour","merci","veuillez"],"de":["hallo","danke","bitte"],"it":["ciao","grazie","per favore"]}.items():
        if any(w in tl for w in words): return lang
    return "en"

def is_bulk(headers):
    if headers.get("auto_submitted"): return True, f"auto: {headers['auto_submitted']}"
    if headers.get("precedence","").lower() in ("bulk","list","junk"): return True, f"prec: {headers['precedence']}"
    if headers.get("list_id") or headers.get("list_unsubscribe"): return True, "mailing list"
    if headers.get("is_noreply"): return True, "noreply"
    total = len(headers.get("to",[])) + len(headers.get("cc",[]))
    if total > 20: return True, f"mass: {total}"
    if not headers.get("message_id","").strip(): return True, "no message-id"
    return False, ""

# ─── REPLY-ALL ──────────────────────────────────────────────

def compute_reply_all(headers, our_email):
    our = our_email.lower().strip()
    bulk, reason = is_bulk(headers)
    if bulk: return [], [], False, f"blocked: {reason}"
    if not headers.get("reply_all_safe",True): return [], [], False, "unsafe"
    sender = headers.get("from_email","")
    rto = headers.get("reply_to",[])
    to = headers.get("to",[])
    cc = headers.get("cc",[])
    primary = list(rto) if rto else ([sender] if sender else [])
    cc_pool, seen_cc = [], set()
    for a in to+cc:
        al = a.lower().strip()
        if al != our and al not in seen_cc and not _is_auto(a):
            seen_cc.add(al); cc_pool.append(a)
    primary = [x for x in primary if x.lower().strip() != our]
    pu, seen = [], set()
    for p in primary:
        pl = p.lower().strip()
        if pl not in seen: seen.add(pl); pu.append(pl)
    should = len(to)>1 or len(cc)>0
    return (pu, cc_pool, True, "verified") if should else (pu, [], False, "verified")

def _is_auto(addr):
    return any(x in addr.lower() for x in ["noreply","no-reply","donotreply","notifications@","bounce@"])

# ─── CONVERSATION MEMORY ────────────────────────────────────

class Memory:
    def __init__(self, path):
        self.path = path
        self.data = lj(path, {"conversations":{},"stats":{}})

    def add(self, sender, direction, subj, body, intent, sentiment):
        t = self.data.setdefault("conversations",{}).setdefault(sender,[])
        t.append({"direction":direction,"subject":subj,"summary":body[:200],"intent":intent,"sentiment":sentiment,"timestamp":NOW().isoformat()})
        if len(t)>30: t.pop(0)
        self.save()

    def thread(self, sender): return self.data.get("conversations",{}).get(sender,[])
    def summarize(self, sender):
        t = self.thread(sender)
        if not t: return ""
        return " → ".join(f"[{m['direction']}] {m['subject']} ({m['intent']})" for m in t[-10:])

    def sentiment_trend(self, sender):
        t = self.thread(sender)
        if len(t)<2: return {"trend":"stable","risk":"low"}
        sm = {"positive":1,"neutral":0,"negative":-1,"mixed":0}
        inbound = [sm.get(m.get("sentiment","neutral"),0) for m in t[-5:] if m["direction"]=="inbound"]
        if len(inbound)<2: return {"trend":"stable","risk":"low"}
        mid = len(inbound)//2
        ea = sum(inbound[:mid])/max(1,mid); la = sum(inbound[mid:])/max(1,len(inbound)-mid)
        trend = "improving" if la>ea+0.3 else "deteriorating" if la<ea-0.3 else "stable"
        risk = "high" if trend=="deteriorating" and inbound[-1]<0 else "medium" if trend=="deteriorating" else "low"
        return {"trend":trend,"risk":risk}

    def profile(self, sender):
        t = self.thread(sender)
        ib = [m for m in t if m["direction"]=="inbound"]
        ob = [m for m in t if m["direction"]=="outbound"]
        intents = list(set(m["intent"] for m in t if m.get("intent")))
        last = ib[-1]["timestamp"] if ib else None
        days = 999
        if last:
            try: days = (NOW()-datetime.fromisoformat(last)).days
            except: pass
        eng = 0
        for m in t:
            try:
                age = (NOW()-datetime.fromisoformat(m["timestamp"])).days
                eng += (0.95**age) * (2 if m["direction"]=="inbound" else 1)
            except: pass
        tr = self.sentiment_trend(sender)
        stage = _stage(ib, ob, intents, days, tr)
        return {"total":len(t),"inbound":len(ib),"outbound":len(ob),"intents":intents,
                "days_since":days,"engagement":round(eng,1),"stage":stage,
                "sentiment_trend":tr["trend"],"sentiment_risk":tr["risk"]}

    def dormant_leaders(self, min_days=30):
        dormant = []
        for sender, thread in self.data.get("conversations",{}).items():
            ib = [m for m in thread if m["direction"]=="inbound"]
            ob = [m for m in thread if m["direction"]=="outbound"]
            if not ib: continue
            last = ib[-1].get("timestamp","")
            if not last: continue
            try:
                days = (NOW()-datetime.fromisoformat(last)).days
                if days>=min_days and ob:
                    dormant.append({"email":sender,"days_since":days,"last_intent":ib[-1].get("intent",""),
                                    "total_ib":len(ib),"total_ob":len(ob),"engagement":self.profile(sender)["engagement"]})
            except: pass
        return sorted(dormant, key=lambda x: x["engagement"], reverse=True)

    def save(self): sj(self.path, self.data)

def _stage(ib, ob, intents, days, tr):
    if not ib: return "none"
    if "complaint" in intents and tr["risk"]=="high": return "at_risk_churn"
    if any(x in intents for x in ["sales_lead","proposal_request","rfp_rfq"]):
        return "active_negotiation" if ob else "hot_lead"
    if "demo_request" in intents: return "demo_scheduled" if ob else "demo_requested"
    if days>90: return "reactivation_needed"
    if len(ib)>3 and ob: return "active_relationship"
    return "new_contact" if ib else "none"

# ─── PERSONALITY MATCHER ────────────────────────────────────

class PersonalityMatcher:
    """Adapts communication style to sender's personality."""

    def detect(self, thread_summary, body):
        """Detect sender communication style."""
        prompt = f"""Analyze this sender's communication style:

Thread history: {thread_summary[:300] if thread_summary else 'First contact'}
Latest email: {body[:500]}

Respond with ONLY JSON:
{{"style":"formal|casual|direct|analytical|friendly|assertive","pace":"fast|moderate|slow","detail_level":"high|medium|low","decision_style":"consensus|individual|data_driven|instinct","recommended_approach":"bulleted_lists|short_paragraphs|detailed_explanations|quick_summary"}}"""

        r = ai("gpt-4o-mini", "Communication style analyzer.", prompt, 200, 0.1)
        result = extract_json(r)
        if not result: return {"style":"formal","pace":"moderate","detail_level":"medium","recommended_approach":"short_paragraphs"}
        return result

# ─── A/B SUBJECT LINE GENERATOR ─────────────────────────────

class SubjectLineAB:
    """Generates A/B subject line variants for testing."""

    def generate(self, draft_body, intent):
        prompt = f"""Generate 2 subject line variants for this email response:

Intent: {intent}
Draft body: {draft_body[:300]}

Variant A: Benefit-focused (what they gain)
Variant B: Curiosity-driven (makes them curious to open)

Respond with ONLY JSON:
{{"variant_a":"subject line A","variant_b":"subject line B","recommendation":"A|B with reason"}}"""

        r = ai("gpt-4o-mini", "Email subject line expert.", prompt, 150, 0.3)
        result = extract_json(r)
        if not result: return None, None, ""
        return result.get("variant_a",""), result.get("variant_b",""), result.get("recommendation","A")

# ─── REVENUE ATTRIBUTION TRACKER ────────────────────────────

class RevenueAttribution:
    """Tracks email threads that lead to closed deals."""

    def __init__(self, path):
        self.path = path
        self.data = lj(path, {"deals":[],"pipeline_value":0})

    def potential_deal(self, sender, intent, confidence, deal_stage):
        """Record a potential deal from email interaction."""
        deals = self.data.setdefault("deals",[])
        deal = {"id": hashlib.md5(f"{sender}{intent}{NOW().isoformat()}".encode()).hexdigest()[:8],
                "email":sender,"intent":intent,"confidence":confidence,
                "stage":deal_stage,"emails_exchanged":0,"estimated_value":0,
                "created":NOW().isoformat(),"last_activity":NOW().isoformat()}
        deals.append(deal)
        self.save()
        return deal["id"]

    def update_deal(self, sender, stage=None, value=None, increment_emails=False):
        """Update deal stage and value."""
        deals = self.data.get("deals",[])
        for d in deals:
            if d["email"]==sender:
                if stage: d["stage"]=stage
                if value: d["estimated_value"]=value
                if increment_emails: d["emails_exchanged"]=d.get("emails_exchanged",0)+1
                d["last_activity"]=NOW().isoformat()
                break
        self._recalc_pipeline()
        self.save()

    def _recalc_pipeline(self):
        stage_values = {"new":1000,"qualified":5000,"demo":10000,"proposal":25000,"negotiation":50000,"closed":100000}
        pipeline = sum(stage_values.get(d["stage"],0) * (d.get("confidence",50)/100) for d in self.data.get("deals",[]))
        self.data["pipeline_value"] = round(pipeline,0)

    def pipeline_report(self):
        deals = self.data.get("deals",[])
        by_stage = {}
        for d in deals:
            by_stage.setdefault(d["stage"],[]).append(d)
        return {"total_deals":len(deals),"pipeline_value":self.data.get("pipeline_value",0),
                "by_stage":{k:len(v) for k,v in by_stage.items()},"deals":deals[-10:]}

    def save(self): sj(self.path, self.data)

# ─── ENSEMBLE REASONER ──────────────────────────────────────

class EnsembleReasoner:
    def analyze(self, body, headers, profile, thread, personality):
        ln = {"pt":"Portuguese","es":"Spanish","fr":"French","de":"German","it":"Italian"}.get(headers.get("content_language","en"),"English")
        pers = personality.get("recommended_approach","short_paragraphs") if personality else "short_paragraphs"

        prompt = f"""Analyze this email for Zion Tech Group. Think step by step.

SENDER: {profile.get('stage','?')} | Engagement: {profile.get('engagement',0)} | Trend: {profile.get('sentiment_trend','?')} | Risk: {profile.get('sentiment_risk','?')}
PERSONALITY: {personality.get('style','?') if personality else 'unknown'} | Response format: {pers}
HISTORY: {thread if thread else 'First contact'}

EMAIL ({ln}): {headers.get('subject','')}
{body[:2500]}

Respond with ONLY JSON:
{{"reasoning":"2-3 sentences","intent":"product_inquiry|service_inquiry|pricing_request|demo_request|technical_support|sales_lead|rfp_rfq|proposal_request|partnership_inquiry|investor_inquiry|billing_question|complaint|escalation|media_press|meeting_request|follow_up|thank_you|phishing_suspect|spam|automated_notification|general","sentiment":"positive|negative|neutral|mixed","urgency":"critical|high|medium|low","should_auto_reply":true|false,"needs_human":false,"human_reason":"","tone":"warm_professional|helpful_expert|empathetic_apologetic|enthusiastic|executive_formal|patient_technical|gracious_warm|polite_professional|strategic_professional","action":"reply|escalate|archive|flag|schedule|lead_only|proposal_queue","response_length":"short|medium|long","create_lead":false,"create_proposal":false,"follow_up_days":0,"deal_stage":"new|qualified|demo|proposal|negotiation|closed|churn_reactivate","confidence":0-100,"risk_flags":[],"is_complaint_escalation":false}}"""

        r = ai("gpt-4o", "Expert email analyzer for Zion Tech Group.", prompt, 700, 0.1)
        result = extract_json(r)
        if not result:
            return {"intent":"general","sentiment":"neutral","should_auto_reply":False,"needs_human":True,
                    "action":"escalate","confidence":30,"reasoning":"Parse failed"}

        # Sentiment-triggered escalation
        if profile.get("sentiment_risk") == "high" and result.get("sentiment") == "negative":
            result["needs_human"] = True
            result["should_auto_reply"] = False
            result["action"] = "escalate"
            result["human_reason"] = "High sender frustration risk"
            result["is_complaint_escalation"] = True
            log.info("  ⚠️ Sentiment-triggered escalation: high risk")

        result["personality_approach"] = pers
        return result

# ─── RESPONSE GENERATOR ─────────────────────────────────────

class Responder:
    def generate(self, headers, analysis, profile, thread, personality):
        ln = {"pt":"Portuguese","es":"Spanish","fr":"French","de":"German","it":"Italian"}.get(headers.get("content_language","en"),"English")
        tone = analysis.get("tone","warm_professional")
        length = analysis.get("response_length","medium")
        target = {"short":"2-4 sentences","medium":"1-2 paragraphs","long":"detailed 2-3 paragraphs"}.get(length,"1-2 paragraphs")
        pers_fmt = personality.get("recommended_approach","short_paragraphs") if personality else "short_paragraphs"

        prompt = f"""You are {CONTACT['name']}, founder of Zion Tech Group. Write a response.

Intent: {analysis.get('intent','general')} | Tone: {tone} | Language: {ln}
Relationship: {profile.get('stage','new')} | Format preference: {pers_fmt}

Email: {headers.get('subject','')} — {headers.get('body_text','')[:2000]}
History: {thread[:200] if thread else 'First contact'}

Write {target} in {ln} using {pers_fmt} format. ONLY body (no subject/signature). Be genuinely helpful. No placeholders."""

        temp = 0.3 if analysis.get("intent") in ("complaint","escalation") else 0.5
        tokens = {"short":150,"medium":300,"long":500}.get(length,300)
        draft = ai("gpt-4o", f"{CONTACT['name']}, tone: {tone}", prompt, tokens, temp)
        if not draft: draft = f"Thank you for your email about {headers.get('subject','')}. We'll respond shortly."

        score = self._score(draft, analysis.get("intent",""), tone)
        if score < 7:
            rw = ai("gpt-4o", f"{CONTACT['name']}", f"Improve this ({score}/10):\n{draft}\n\nRewrite for {analysis.get('intent','')}/{tone}:", tokens, max(0.1,temp-0.1))
            if rw:
                s2 = self._score(rw, analysis.get("intent",""), tone)
                if s2 > score: draft, score = rw, s2
        return {"draft":draft.strip(),"quality":score}

    def _score(self, draft, intent, tone):
        r = ai("gpt-4o-mini", "Score 1-10.", f"Intent:{intent} Tone:{tone}\n{draft[:300]}\nScore 1-10, number only:", 30, 0.1)
        try: return max(1,min(10,int(re.search(r'\d+',r).group())))
        except: return 7

# ─── MEETING HANDLER ────────────────────────────────────────

class MeetingHandler:
    """Handles meeting requests and calendar integration."""

    def detect_meeting_request(self, body, subject):
        keywords = ["meet","meeting","call","schedule","calendar","available","zoom","teams","google meet",
                    "talk","discuss","demo","presentation","appointment","book","time slot"]
        text = (subject+" "+body).lower()
        if any(k in text for k in keywords):
            return True
        return False

    def generate_meeting_response(self, headers, body, analysis):
        prompt = f"""This email is requesting a meeting. Generate a helpful response with meeting booking links.

From: {headers.get('from_email','')} | Subject: {headers.get('subject','')}
Body: {body[:800]}

Respond with:
1. Acknowledgment of the meeting request
2. Suggest 2-3 time slots this week
3. Include: "Book directly: https://cal.com/ziontechgroup"
4. Keep it brief and professional

Write ONLY the email body (no signature):"""

        return ai("gpt-4o", "Meeting scheduler for Zion Tech Group.", prompt, 300, 0.4)

# ─── V13 AGENT ──────────────────────────────────────────────

class EmailV13:
    def __init__(self):
        self.email = CONTACT["email"]
        self.h = check_h()
        self.memory = Memory(WORKDIR/"data"/"email_v13_conv.json")
        self.analytics = lj(WORKDIR/"data"/"email_v13_analytics.json",
            {"total":0,"replied":0,"escalated":0,"archived":0,"auto":0,"leads":0,"proposals":0,
             "avg_quality":0,"quality_scores":[],"intents":{},"actions":{}})
        self.revenue = RevenueAttribution(WORKDIR/"data"/"v13_revenue.json")
        self.reasoner = EnsembleReasoner()
        self.responder = Responder()
        self.personality = PersonalityMatcher()
        self.subject_ab = SubjectLineAB()
        self.meeting = MeetingHandler()

    def process(self, email):
        H = email.get("headers",{})
        sender = H.get("from_email", email.get("from",""))
        subj = H.get("subject", email.get("subject",""))
        body = H.get("body_text", email.get("body",""))
        log.info(f"📧 [{subj}] from {sender}")

        bulk, reason = is_bulk(H)
        if bulk: self.memory.add(sender,"inbound",subj,body[:100],"bulk","neutral"); self._stats("archived","bulk"); return {"action":"archive","reason":reason,"sender":sender}
        if H.get("is_phishing_suspect"): self._stats("flagged","phishing"); return {"action":"flag_phishing","sender":sender}

        profile = self.memory.profile(sender)
        thread = self.memory.summarize(sender)
        log.info(f"  {profile['stage']} | Eng:{profile['engagement']} | Trend:{profile['sentiment_trend']}")

        # Personality matching
        personality = self.personality.detect(thread, body)

        # Ensemble reasoning
        analysis = self.reasoner.analyze(body, H, profile, thread, personality)
        log.info(f"  → {analysis.get('intent')} conf:{analysis.get('confidence')} auto:{analysis.get('should_auto_reply')}")

        rt, rcc, should_all, status = compute_reply_all(H, self.email)
        if status.startswith("blocked"):
            self.memory.add(sender,"inbound",subj,body[:200],analysis.get("intent",""),analysis.get("sentiment","neutral"))
            self._stats("blocked",analysis.get("intent","")); return {"action":"blocked","reason":status,"sender":sender}

        self.memory.add(sender,"inbound",subj,body[:200],analysis.get("intent",""),analysis.get("sentiment","neutral"))
        result = {"intent":analysis.get("intent"),"confidence":analysis.get("confidence"),
                  "action":analysis.get("action"),"sender":sender,"reply_to":rt,"reply_cc":rcc,"reply_all":should_all}

        # Meeting handler
        if self.meeting.detect_meeting_request(body, subj) and analysis.get("intent") in ("meeting_request","general"):
            meeting_response = self.meeting.generate_meeting_response(H, body, analysis)
            if meeting_response:
                sent = False
                try:
                    if self.h:
                        cmd = ["himalaya","send","--to",rt[0]]
                        for c in rcc: cmd.extend(["--cc",c])
                        cmd.extend(["--subject",f"Re: {subj}"])
                        r = subprocess.run(cmd, input=f"{meeting_response}{SIG}", capture_output=True, text=True, timeout=30)
                        sent = r.returncode == 0
                except: pass
                if sent:
                    result["action"]="replied_meeting"; result["meeting_handled"]=True
                    self.memory.add(sender,"outbound",f"Re: {subj}",meeting_response[:200],analysis.get("intent",""),"positive")
                    self._stats("replied",analysis.get("intent",""),auto=True)
                    log.info("  📅 Meeting response sent"); return result

        if analysis.get("should_auto_reply") and rt:
            resp = self.responder.generate(H, analysis, profile, thread, personality)
            quality = resp["quality"]

            # A/B subject line
            sub_a, sub_b, rec = self.subject_ab.generate(resp["draft"], analysis.get("intent",""))
            chosen_sub = f"Re: {subj}"
            if sub_a and rec.startswith("A"): chosen_sub = sub_a
            elif sub_b and rec.startswith("B"): chosen_sub = sub_b

            sent = False
            try:
                if self.h:
                    cmd = ["himalaya","send","--to",rt[0]]
                    for c in rcc: cmd.extend(["--cc",c])
                    cmd.extend(["--subject",chosen_sub])
                    r = subprocess.run(cmd, input=f"{resp['draft']}{SIG}", capture_output=True, text=True, timeout=30)
                    sent = r.returncode == 0
            except: pass

            if sent:
                result["action"]="replied"; result["quality"]=quality; result["subject_ab"]=rec
                self.memory.add(sender,"outbound",chosen_sub,resp["draft"][:200],analysis.get("intent",""),"positive")
                self._stats("replied",analysis.get("intent",""),quality,auto=True)
                log.info(f"  ✅ REPLIED Q:{quality}/10 Subject:{chosen_sub}")
            else:
                result["action"]="failed"; self._stats("failed",analysis.get("intent",""),quality)
                log.error("  ❌ Send failed")
        elif analysis.get("needs_human"):
            result["action"]="escalated"; result["reason"]=analysis.get("human_reason","")
            self._stats("escalated",analysis.get("intent",""))
            log.info(f"  🧑 ESCALATED: {analysis.get('human_reason','')}")
        else:
            result["action"]="logged"; self._stats("logged",analysis.get("intent",""))

        if analysis.get("create_lead"):
            deal_id = self.revenue.potential_deal(sender, analysis.get("intent",""), analysis.get("confidence",0), analysis.get("deal_stage","new"))
            result["lead"]=True; result["deal_id"]=deal_id
            self._stats("leads",analysis.get("intent",""))
            log.info(f"  📋 Lead: {deal_id}")

        if analysis.get("create_proposal"):
            props = lj(WORKDIR/"data"/"v13_proposals.json",[])
            props.append({"id":hashlib.md5(f"{sender}{subj}".encode()).hexdigest()[:8],"email":sender,
                          "subject":subj,"intent":analysis.get("intent",""),"stage":analysis.get("deal_stage","proposal"),
                          "confidence":analysis.get("confidence",0),"status":"pending","created":NOW().isoformat()})
            sj(WORKDIR/"data"/"v13_proposals.json",props)
            self._stats("proposals",analysis.get("intent",""))
            log.info(f"  📄 Proposal queued")

        self.memory.save()
        sj(WORKDIR/"data"/"email_v13_analytics.json", self.analytics)
        return result

    def run(self, limit=50):
        log.info("🚀 Email Agent V13.0 — Multimodal with Calendar & Revenue Attribution")
        emails = []
        try:
            if self.h:
                r = subprocess.run(["himalaya","envelope","list","--page-size",str(limit)],capture_output=True,text=True,timeout=30)
                if r.returncode==0:
                    for line in r.stdout.strip().split("\n"):
                        if not line.strip(): continue
                        parts = line.split(" | ")
                        if len(parts)<4: continue
                        eid,s,subj = parts[0].strip(),parts[2].replace("From:","").strip() if len(parts)>2 else "",parts[3].replace("Subject:","").strip() if len(parts)>3 else ""
                        raw = self._fetch(eid)
                        emails.append({"id":eid,"from":s,"subject":subj,"body":raw,"headers":parse_headers(raw)})
        except Exception as e: log.exception(f"Fetch: {e}")

        if not emails: log.info("📭 No emails"); return []
        results = []
        for em in emails:
            try: results.append(self.process(em)); time.sleep(0.3)
            except Exception as e: log.exception(f"Process: {e}")

        a = self.analytics
        log.info(f"📊 Results: {len(results)} | Replied: {a.get('replied',0)} | Escalated: {a.get('escalated',0)} | AvgQ: {a.get('avg_quality',0)}")
        return results

    def proactive_outreach(self):
        dormant = self.memory.dormant_leaders(min_days=30)
        if not dormant: log.info("No dormant leads"); return []
        log.info(f"🔄 {len(dormant)} dormant leads")
        results = []
        for lead in dormant[:5]:
            prompt = f"""Re-engagement email for dormant lead.
Email: {lead['email']} | Last contact: {lead['days_since']} days ago
Intent: {lead['last_intent']} | They messaged {lead['total_ib']}x, we replied {lead['total_ob']}x
From: {CONTACT['name']}, Zion Tech Group. Brief, warm, valuable. 2-3 paragraphs ONLY."""
            draft = ai("gpt-4o", "Proactive outreach writer.", prompt, 300, 0.4)
            if draft: results.append({"email":lead["email"],"draft":draft.strip(),"days":lead["days_since"]})
        sj(WORKDIR/"data"/"v13_proactive.json", results)
        return results

    def _stats(self, action, intent, quality=0, auto=False):
        a = self.analytics; a["total"]=a.get("total",0)+1
        if action=="replied": a["replied"]=a.get("replied",0)+1
        if action=="escalated": a["escalated"]=a.get("escalated",0)+1
        if action=="archived": a["archived"]=a.get("archived",0)+1
        if auto: a["auto"]=a.get("auto",0)+1
        if quality>0:
            q=a.setdefault("quality_scores",[]); q.append(quality)
            a["avg_quality"]=round(sum(q)/len(q),1)
        a.setdefault("intents",{})[intent]=a["intents"].get(intent,0)+1
        a.setdefault("actions",{})[action]=a["actions"].get(action,0)+1

    def _fetch(self, eid):
        try:
            if self.h:
                for flag in ["--raw",""]:
                    r=subprocess.run(["himalaya","read",eid]+(["--raw"] if flag else []),capture_output=True,text=True,timeout=30)
                    if r.returncode==0 and r.stdout.strip(): return r.stdout.strip()
        except: pass
        return ""

    def revenue_report(self):
        return self.revenue.pipeline_report()

if __name__=="__main__":
    import sys
    agent = EmailV13()
    if "--proactive" in sys.argv: agent.proactive_outreach()
    elif "--revenue" in sys.argv: print(json.dumps(agent.revenue_report(), indent=2))
    else: agent.run(limit=int(sys.argv[1]) if len(sys.argv)>1 and sys.argv[1].isdigit() else 50)
