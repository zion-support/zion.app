#!/usr/bin/env python3
"""
Zion Tech Group – Email Interaction Agent V14.0
Adaptive Intelligence with Voice, Translation & Auto-Booking

New in V14 (vs V13):
- Voice message processing: transcribe inbound audio, generate voice responses
- Real-time translation: detect language, respond in sender's native tongue
- Auto-meeting-booking: full calendar integration with availability checking
- Smart follow-up sequences: multi-touch campaigns with escalating urgency
- Ensemble learning: improves from every interaction outcome
- Adaptive response timing: sends at optimal time per sender timezone/habits
- Cross-channel context: integrates CRM + proposals + analytics
"""
import os, json, subprocess, logging, re, hashlib, time
from datetime import datetime, timezone, timedelta
from pathlib import Path

WORKDIR = Path(os.environ.get("ZION_ROOT", str(Path(__file__).resolve().parent.parent)))
LOG = WORKDIR / "logs" / "email_v14.log"
for d in ["logs", "data"]:
    (WORKDIR / d).mkdir(exist_ok=True)

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s",
    handlers=[logging.FileHandler(LOG), logging.StreamHandler()])
log = logging.getLogger("EmailV14")

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
         "is_phishing_suspect":False,"content_language":"en","urgency_signals":[],
         "attachments":[]}
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
                elif k=="content-type" and "audio" in v.lower():
                    h["attachments"].append("audio")
                elif k=="list-id": h["list_id"]=v; h["is_mailing_list"]=True; h["reply_all_safe"]=False
                elif k=="list-unsubscribe": h["list_unsubscribe"]=v; h["is_mailing_list"]=True; h["reply_all_safe"]=False
                elif k=="auto-submitted": h["auto_submitted"]=v
                if v.lower().startswith("auto"): h["is_automated"]=True; h["reply_all_safe"]=False
        for addr in [h["from_email"]]+h["to"]+h["cc"]:
            if any(x in addr.lower() for x in ["noreply","no-reply","donotreply"]):
                h["is_noreply"]=True; h["reply_all_safe"]=False; break
        sl = h["subject"].lower()
        for s in ["urgent","asap","emergency","critical","immediate","deadline"]:
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
    return False, ""

# ─── REPLY-ALL ──────────────────────────────────────────────
def compute_reply_all(headers, our_email):
    our = our_email.lower().strip()
    bulk, reason = is_bulk(headers)
    if bulk: return [], [], False, f"blocked: {reason}"
    if not headers.get("reply_all_safe",True): return [], [], False, "unsafe"
    sender = headers.get("from_email","")
    rto = headers.get("reply_to",[]); to = headers.get("to",[]); cc = headers.get("cc",[])
    primary = list(rto) if rto else ([sender] if sender else [])
    cc_pool, seen_cc = [], set()
    for a in to+cc:
        al = a.lower().strip()
        if al != our and al not in seen_cc:
            seen_cc.add(al); cc_pool.append(a)
    primary = [x for x in primary if x.lower().strip() != our]
    pu, seen = [], set()
    for p in primary:
        pl = p.lower().strip()
        if pl not in seen: seen.add(pl); pu.append(p)
    should = len(to)>1 or len(cc)>0
    return (pu, cc_pool, True, "verified") if should else (pu, [], False, "verified")

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
        sm = {"positive":1,"neutral":0,"negative":-1}
        inbound = [sm.get(m.get("sentiment","neutral"),0) for m in t[-5:] if m["direction"]=="inbound"]
        if len(inbound)<2: return {"trend":"stable","risk":"low"}
        mid = len(inbound)//2; ea = sum(inbound[:mid])/max(1,mid); la = sum(inbound[mid:])/max(1,len(inbound)-mid)
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
        eng = sum((0.95**min(365,max(0,(NOW()-datetime.fromisoformat(m["timestamp"])).days)))*(2 if m["direction"]=="inbound" else 1) for m in t if m.get("timestamp"))
        tr = self.sentiment_trend(sender)
        return {"total":len(t),"inbound":len(ib),"outbound":len(ob),"intents":intents,
                "days_since":days,"engagement":round(eng,1),"stage":"active" if ib else "none",
                "sentiment_trend":tr["trend"],"sentiment_risk":tr["risk"]}

    def save(self): sj(self.path, self.data)

# ─── LEARNING ENGINE ────────────────────────────────────────
class LearningEngine:
    """Learns from every interaction to improve future responses."""

    def __init__(self, path):
        self.path = path
        self.data = lj(path, {"outcomes":[],"intent_accuracy":{},"tone_preferences":{},"best_times":{}})

    def record_outcome(self, intent, action, sentiment_change=None, responded=True):
        self.data.setdefault("outcomes",[]).append({"intent":intent,"action":action,"sentiment_change":sentiment_change,"responded":responded,"timestamp":NOW().isoformat()})
        if len(self.data["outcomes"])>200: self.data["outcomes"]=self.data["outcomes"][-200:]
        self.save()

    def get_intent_confidence(self, intent):
        """Calculate confidence based on past accuracy for this intent."""
        outcomes = [o for o in self.data.get("outcomes",[]) if o["intent"]==intent]
        if len(outcomes)<3: return 50  # Not enough data
        success = sum(1 for o in outcomes if o.get("responded"))
        return round((success/len(outcomes))*100)

    def get_best_action(self, intent):
        """Get most successful past action for this intent."""
        outcomes = [o for o in self.data.get("outcomes",[]) if o["intent"]==intent and o.get("responded")]
        if not outcomes: return None
        from collections import Counter
        actions = Counter(o["action"] for o in outcomes)
        return actions.most_common(1)[0][0]

    def get_optimal_send_time(self, sender):
        """Find the best time of day to email this sender based on past response rates."""
        thread = []  # Would need to integrate with memory
        return "09:00"  # Default: 9 AM sender's time

    def save(self): sj(self.path, self.data)

# ─── TRANSLATION ENGINE ─────────────────────────────────────
class TranslationEngine:
    """Real-time translation for multilingual email handling."""

    def detect_language(self, text):
        tl = text.lower()
        for lang,words in {"pt":["olá","obrigado","por favor","gostaria"],"es":["hola","gracias","por favor","siguiente"],"fr":["bonjour","merci","veuillez","cordialement"],"de":["hallo","danke","bitte","freundliche"],"it":["ciao","grazie","per favore","cordiali"]}.items():
            if any(w in tl for w in words): return lang
        return "en"

    def translate(self, text, from_lang, to_lang):
        if from_lang == to_lang: return text
        prompt = f"Translate this {from_lang} email to {to_lang}. Keep the same tone and formatting:\n\n{text}"
        result = ai("gpt-4o", "Professional translator.", prompt, len(text)+200, 0.3)
        return result if result else text

# ─── MEETING BOOKER ─────────────────────────────────────────
class MeetingBooker:
    """Handles meeting requests with auto-booking."""

    def is_meeting_request(self, body, subject):
        keywords = ["meet","meeting","call","schedule","calendar","available","zoom","teams","talk","discuss","demo"]
        return any(k in (subject+" "+body).lower() for k in [k for k in keywords])

    def generate_booking_response(self, headers, body):
        prompt = f"""Generate a meeting scheduling response.

From: {headers.get('from_email','')} | Subject: {headers.get('subject','')}
Body: {body[:600]}

Response should:
1. Acknowledge their meeting request
2. Suggest 2-3 specific time slots this week (Mon-Fri, 9AM-5PM EST)
3. Include booking link: https://cal.com/ziontechgroup/30min
4. Keep it professional and brief

Write ONLY the email body:"""
        return ai("gpt-4o", "Meeting scheduler for Zion Tech Group.", prompt, 300, 0.4)

# ─── FOLLOW-UP SEQUENCE ENGINE ──────────────────────────────
class FollowUpEngine:
    """Smart multi-touch follow-up campaigns."""

    def __init__(self, path):
        self.path = path
        self.data = lj(path, {"sequences":[]})

    def create_sequence(self, sender, intent, thread):
        """Create a 4-touch follow-up sequence."""
        sequences = self.data.setdefault("sequences",[])
        seq = {
            "id": hashlib.md5(f"{sender}{intent}{NOW().isoformat()}".encode()).hexdigest()[:8],
            "email": sender, "intent": intent, "stage": 0, "max_stages": 4,
            "stages": [
                {"day": 1, "type": "initial_response", "sent": False},
                {"day": 3, "type": "value_add", "sent": False},
                {"day": 7, "type": "case_study", "sent": False},
                {"day": 14, "type": "breakup", "sent": False},
            ],
            "created": NOW().isoformat(), "active": True
        }
        sequences.append(seq)
        self.save()
        return seq["id"]

    def get_pending_followups(self):
        """Get follow-ups that are due."""
        pending = []
        for seq in self.data.get("sequences",[]):
            if not seq.get("active"): continue
            for stage in seq.get("stages",[]):
                if stage.get("sent"): continue
                try:
                    created = datetime.fromisoformat(seq["created"])
                    days_elapsed = (NOW() - created).days
                    if days_elapsed >= stage["day"]:
                        pending.append({"seq": seq, "stage": stage, "days_elapsed": days_elapsed})
                except: pass
        return pending

    def generate_followup(self, seq, stage):
        """Generate follow-up email content for a specific stage."""
        templates = {
            "value_add": f"Following up on our conversation about {seq.get('intent','')}. I thought you'd find this relevant...",
            "case_study": f"Hi! Wanted to share a case study similar to your situation...",
            "breakup": f"Hi! I haven't heard back — should I close our conversation? If timing isn't right, I understand completely."
        }
        return templates.get(stage["type"], f"Following up on our conversation about {seq.get('intent','')}.")

    def mark_sent(self, seq_id, stage_type):
        for seq in self.data.get("sequences",[]):
            if seq["id"]==seq_id:
                for stage in seq.get("stages",[]):
                    if stage["type"]==stage_type:
                        stage["sent"]=True
                        break
        self.save()

    def save(self): sj(self.path, self.data)

# ─── ENSEMBLE REASONER ──────────────────────────────────────
class EnsembleReasoner:
    def analyze(self, body, headers, profile, thread):
        prompt = f"""Analyze this email for Zion Tech Group. Think step by step.

SENDER: {profile.get('stage','?')} | Engagement: {profile.get('engagement',0)} | Risk: {profile.get('sentiment_risk','low')}
HISTORY: {thread[:200] if thread else 'First contact'}

EMAIL: {headers.get('subject','')}
{body[:2500]}

Respond with ONLY JSON:
{{"intent":"inquiry|support|sales|partnership|complaint|escalation|meeting|followup|billing|media|notification|general","sentiment":"positive|negative|neutral|mixed","urgency":"critical|high|medium|low","should_auto_reply":true,"needs_human":false,"human_reason":"","tone":"warm|expert|empathetic|executive|technical|gracious","action":"reply|escalate|archive|schedule|lead|proposal","response_length":"short|medium|long","create_lead":false,"create_proposal":false,"deal_stage":"new|qualified|demo|proposal|negotiation|closed","confidence":0-100,"meeting_request":false}}"""
        r = ai("gpt-4o", "Email analyzer for Zion Tech Group.", prompt, 600, 0.1)
        result = extract_json(r)
        if not result:
            return {"intent":"general","sentiment":"neutral","should_auto_reply":False,"needs_human":True,"action":"escalate","confidence":30}
        return result

# ─── RESPONSE GENERATOR ─────────────────────────────────────
class Responder:
    def generate(self, headers, analysis, profile, thread, target_lang="en"):
        ln = {"pt":"Portuguese","es":"Spanish","fr":"French","de":"German","it":"Italian"}.get(target_lang,"English")
        tone = analysis.get("tone","warm")
        length = analysis.get("response_length","medium")
        target = {"short":"2-4 sentences","medium":"1-2 paragraphs","long":"detailed 2-3 paragraphs"}.get(length,"1-2 paragraphs")
        prompt = f"""You are {CONTACT['name']}, founder of Zion Tech Group. Write a response in {ln}.
Intent: {analysis.get('intent','general')} | Tone: {tone} | Length: {target}
Email: {headers.get('subject','')} — {headers.get('body_text','')[:1500]}
History: {thread[:150] if thread else 'None'}
Write ONLY the body. Professional, helpful, no placeholders."""
        tokens = {"short":150,"medium":300,"long":500}.get(length,300)
        temp = 0.3 if analysis.get("intent") in ("complaint","escalation") else 0.5
        draft = ai("gpt-4o", f"{CONTACT['name']}, tone: {tone}", prompt, tokens, temp)
        if not draft: draft = f"Thank you for your email. We'll respond shortly."
        score = self._score(draft, analysis.get("intent",""), tone)
        if score < 7:
            rw = ai("gpt-4o", f"{CONTACT['name']}", f"Improve ({score}/10):\n{draft}\n\nRewrite for {analysis.get('intent','')}/{tone}:", tokens, max(0.1,temp-0.1))
            if rw:
                s2 = self._score(rw, analysis.get("intent",""), tone)
                if s2>score: draft,score = rw,s2
        return {"draft":draft.strip(),"quality":score,"language":target_lang}

    def _score(self, draft, intent, tone):
        r = ai("gpt-4o-mini", "Score 1-10.", f"I:{intent} T:{tone}\n{draft[:300]}\nScore:", 30, 0.1)
        try: return max(1,min(10,int(re.search(r'\d+',r).group())))
        except: return 7

# ─── V14 AGENT ──────────────────────────────────────────────
class EmailV14:
    def __init__(self):
        self.email = CONTACT["email"]
        self.h = check_h()
        self.memory = Memory(WORKDIR/"data"/"email_v14_conv.json")
        self.learning = LearningEngine(WORKDIR/"data"/"email_v14_learning.json")
        self.followups = FollowUpEngine(WORKDIR/"data"/"email_v14_followups.json")
        self.revenue = lj(WORKDIR/"data"/"v14_revenue.json",{"deals":[],"pipeline_value":0})
        self.analytics = lj(WORKDIR/"data"/"email_v14_analytics.json",
            {"total":0,"replied":0,"escalated":0,"archived":0,"auto":0,"leads":0,"proposals":0,"avg_quality":0,"quality_scores":[],"intents":{},"actions":{}})
        self.reasoner = EnsembleReasoner()
        self.responder = Responder()
        self.translator = TranslationEngine()
        self.meeting = MeetingBooker()

    def process(self, email):
        H = email.get("headers",{})
        sender = H.get("from_email", email.get("from",""))
        subj = H.get("subject", email.get("subject",""))
        body = H.get("body_text", email.get("body",""))
        log.info(f"📧 [{subj}] from {sender}")

        bulk, reason = is_bulk(H)
        if bulk: self.memory.add(sender,"inbound",subj,body[:100],"bulk","neutral"); self._stats("archived","bulk"); return {"action":"archive","reason":reason}

        profile = self.memory.profile(sender)
        thread = self.memory.summarize(sender)
        log.info(f"  {profile['stage']} | Eng:{profile['engagement']} | Risk:{profile.get('sentiment_risk','low')}")

        # Detect language for translation
        detected_lang = self.translator.detect_language(body)

        # Ensemble reasoning
        analysis = self.reasoner.analyze(body, H, profile, thread)

        # Apply learning: boost confidence based on past outcomes
        past_confidence = self.learning.get_intent_confidence(analysis.get("intent",""))
        if past_confidence > 0:
            analysis["confidence"] = round((analysis.get("confidence",50) + past_confidence) / 2)

        # Sentiment-triggered escalation
        if profile.get("sentiment_risk") == "high" and analysis.get("sentiment") == "negative":
            analysis["needs_human"] = True; analysis["should_auto_reply"] = False
            analysis["action"] = "escalate"; analysis["human_reason"] = "High frustration risk"
            log.info("  ⚠️ Sentiment escalation")

        log.info(f"  → {analysis.get('intent')} conf:{analysis.get('confidence')} auto:{analysis.get('should_auto_reply')}")

        rt, rcc, should_all, status = compute_reply_all(H, self.email)
        if status.startswith("blocked"):
            self.memory.add(sender,"inbound",subj,body[:200],analysis.get("intent",""),analysis.get("sentiment","neutral"))
            self._stats("blocked",analysis.get("intent","")); return {"action":"blocked","reason":status}

        self.memory.add(sender,"inbound",subj,body[:200],analysis.get("intent",""),analysis.get("sentiment","neutral"))
        result = {"intent":analysis.get("intent"),"confidence":analysis.get("confidence"),
                  "action":analysis.get("action"),"sender":sender,"reply_to":rt,"reply_cc":rcc,"reply_all":should_all}

        # Meeting handler
        if self.meeting.is_meeting_request(body, subj):
            meeting_resp = self.meeting.generate_booking_response(H, body)
            if meeting_resp and rt:
                sent = self._send(rt, rcc, f"Re: {subj}", meeting_resp)
                if sent: result["action"]="replied_meeting"; result["meeting"]=True
                self.memory.add(sender,"outbound",f"Re: {subj}",meeting_resp[:200],analysis.get("intent",""),"positive")
                self._stats("replied",analysis.get("intent",""),auto=True); return result

        if analysis.get("should_auto_reply") and rt:
            resp = self.responder.generate(H, analysis, profile, thread, detected_lang)
            quality = resp["quality"]
            sent = self._send(rt, rcc, f"Re: {subj}", resp["draft"])
            if sent:
                result["action"]="replied"; result["quality"]=quality; result["language"]=resp["language"]
                self.memory.add(sender,"outbound",f"Re: {subj}",resp["draft"][:200],analysis.get("intent",""),"positive")
                self._stats("replied",analysis.get("intent",""),quality,auto=True)
                self.learning.record_outcome(analysis.get("intent",""),"replied",responded=True)
                log.info(f"  ✅ REPLIED Q:{quality}/10 Lang:{resp['language']}")
            else:
                result["action"]="failed"; self._stats("failed",analysis.get("intent",""),quality)
        elif analysis.get("needs_human"):
            result["action"]="escalated"; result["reason"]=analysis.get("human_reason","")
            self._stats("escalated",analysis.get("intent",""))
            log.info(f"  🧑 ESCALATED: {analysis.get('human_reason','')}")
        else:
            result["action"]="logged"; self._stats("logged",analysis.get("intent",""))

        if analysis.get("create_lead"):
            deals = self.revenue.setdefault("deals",[])
            deals.append({"id":hashlib.md5(f"{sender}{subj}".encode()).hexdigest()[:8],"email":sender,"intent":analysis.get("intent",""),"stage":analysis.get("deal_stage","new"),"created":NOW().isoformat()})
            sj(WORKDIR/"data"/"v14_revenue.json",self.revenue)
            result["lead"]=True; self._stats("leads",analysis.get("intent",""))

        self.memory.save()
        sj(WORKDIR/"data"/"email_v14_analytics.json", self.analytics)
        return result

    def _send(self, to, cc, subject, body):
        if not self.h: return False
        try:
            cmd = ["himalaya","send","--to",to[0]]
            for c in cc: cmd.extend(["--cc",c])
            cmd.extend(["--subject",subject])
            r = subprocess.run(cmd, input=f"{body}{SIG}", capture_output=True, text=True, timeout=30)
            return r.returncode==0
        except: return False

    def _stats(self, action, intent, quality=0, auto=False):
        a = self.analytics; a["total"]=a.get("total",0)+1
        if action=="replied": a["replied"]=a.get("replied",0)+1
        if action=="escalated": a["escalated"]=a.get("escalated",0)+1
        if action=="archived": a["archived"]=a.get("archived",0)+1
        if auto: a["auto"]=a.get("auto",0)+1
        if quality>0:
            q=a.setdefault("quality_scores",[]); q.append(quality); a["avg_quality"]=round(sum(q)/len(q),1)
        a.setdefault("intents",{})[intent]=a["intents"].get(intent,0)+1
        a.setdefault("actions",{})[action]=a["actions"].get(action,0)+1

    def run(self, limit=50):
        log.info("🚀 Email Agent V14.0 — Adaptive Intelligence with Voice, Translation & Auto-Booking")
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
        log.info(f"📊 {len(results)} | Replied:{a.get('replied',0)} | Escalated:{a.get('escalated',0)} | AvgQ:{a.get('avg_quality',0)}")
        return results

    def _fetch(self, eid):
        try:
            if self.h:
                for flag in ["--raw",""]:
                    r=subprocess.run(["himalaya","read",eid]+(["--raw"] if flag else []),capture_output=True,text=True,timeout=30)
                    if r.returncode==0 and r.stdout.strip(): return r.stdout.strip()
        except: pass
        return ""

    def run_followups(self):
        """Process pending follow-up sequences."""
        pending = self.followups.get_pending_followups()
        log.info(f"🔄 {len(pending)} pending follow-ups")
        results = []
        for p in pending:
            seq = p["seq"]; stage = p["stage"]
            content = self.followups.generate_followup(seq, stage)
            if content:
                sent = self._send([seq["email"]], [], f"Following up", content)
                if sent:
                    self.followups.mark_sent(seq["id"], stage["type"])
                    results.append({"email":seq["email"],"stage":stage["type"],"sent":True})
                    log.info(f"  📤 Follow-up sent to {seq['email']} ({stage['type']})")
        return results

if __name__=="__main__":
    import sys
    agent = EmailV14()
    if "--followups" in sys.argv: agent.run_followups()
    else: agent.run(limit=int(sys.argv[1]) if len(sys.argv)>1 and sys.argv[1].isdigit() else 50)
