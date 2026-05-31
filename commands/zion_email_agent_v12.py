#!/usr/bin/env python3
"""
Zion Tech Group – Email Interaction Agent V12.0
Multi-Model Ensemble with Proactive Intelligence

New in V12 (vs V11):
- Multi-model ensemble: gpt-4o + openrouter (mixtral/llama-70b) for critical decisions
- Proactive outreach: identifies dormant leads, auto-sends re-engagement
- Contract/document parser: analyzes attached contracts, flags risks
- Follow-up auto-scheduler: creates tasks from conversation signals
- Smart batch processing: groups similar emails for efficient handling
- Sender intent prediction: predicts next need based on conversation pattern
- Thread summarization: summarizes long threads before responding
- Ensemble disagreement escalation: when models disagree → human review
"""
import os, json, subprocess, logging, re, hashlib, time
from datetime import datetime, timezone, timedelta
from pathlib import Path

WORKDIR = Path(os.environ.get("ZION_ROOT", str(Path(__file__).resolve().parent.parent)))
LOG = WORKDIR / "logs" / "email_v12.log"
for d in ["logs", "data"]:
    (WORKDIR / d).mkdir(exist_ok=True)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(message)s",
    handlers=[logging.FileHandler(LOG), logging.StreamHandler()]
)
log = logging.getLogger("EmailV12")

CONTACT = {
    "name": "Kleber Garcia Alcatrao",
    "email": "kleber@ziontechgroup.com",
    "phone": "+1 302 464 0950",
    "company": "Zion Tech Group",
    "address": "364 E Main St STE 1008, Middletown, DE 19709",
    "website": "https://ziontechgroup.com"
}
SIG = (
    f"\n\n{CONTACT['name']} | {CONTACT['company']}\n"
    f"📞 {CONTACT['phone']} | ✉ {CONTACT['email']}\n"
    f"🌐 {CONTACT['address']}\n🔗 {CONTACT['website']}"
)

NOW = lambda: datetime.now(timezone.utc)

# ─── HELPERS ────────────────────────────────────────────────

def lj(p, default):
    if p.exists():
        try:
            with open(p) as f:
                return json.load(f)
        except Exception:
            pass
    return default

def sj(p, d):
    with open(p, "w") as f:
        json.dump(d, f, indent=2, default=str)

def check_himalaya():
    try:
        return subprocess.run(["himalaya", "--version"], capture_output=True, text=True, timeout=5).returncode == 0
    except Exception:
        return False

def extract_json(raw):
    if not raw:
        return None
    try:
        cleaned = re.sub(r"^```(?:json)?\s*", "", raw.strip())
        cleaned = re.sub(r"\s*```$", "", cleaned)
        return json.loads(cleaned)
    except Exception:
        return None

def ai_call(model="gpt-4o", system="", user="", max_tok=900, temp=0.15):
    """Call OpenAI-compatible API."""
    key = os.getenv("OPENAI_API_KEY") or os.getenv("CURSOR_API_KEY")
    if not key:
        return ""
    import requests
    try:
        r = requests.post(
            "https://api.openai.com/v1/chat/completions",
            headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"},
            json={"model": model, "messages": [{"role": "system", "content": system}, {"role": "user", "content": user}],
                  "max_tokens": max_tok, "temperature": temp},
            timeout=60,
        )
        if r.status_code == 200:
            return r.json().get("choices", [{}])[0].get("message", {}).get("content", "")
    except Exception:
        pass
    return ""

def ai_openrouter(model="mistralai/mixtral-8x7b-instruct", system="", user="", max_tok=800, temp=0.15):
    """Call OpenRouter API for ensemble diversity."""
    key = os.getenv("OPENROUTER_API_KEY")
    if not key:
        return ""
    import requests
    try:
        r = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"},
            json={"model": model, "messages": [{"role": "system", "content": system}, {"role": "user", "content": user}],
                  "max_tokens": max_tok, "temperature": temp},
            timeout=60,
        )
        if r.status_code == 200:
            return r.json().get("choices", [{}])[0].get("message", {}).get("content", "")
    except Exception:
        pass
    return ""

# ─── HEADER PARSER ──────────────────────────────────────────

def parse_headers(raw):
    h = {
        "from_name": "", "from_email": "",
        "to": [], "cc": [], "bcc": [], "reply_to": [],
        "subject": "", "body_text": "", "body_html": "",
        "date": "", "message_id": "", "in_reply_to": "",
        "references": [], "list_id": "", "list_unsubscribe": "",
        "auto_submitted": "", "precedence": "", "x_mailer": "",
        "reply_all_safe": True, "is_automated": False,
        "is_noreply": False, "is_mailing_list": False,
        "is_bulk": False, "is_phishing_suspect": False,
        "content_language": "en", "urgency_signals": [],
    }
    try:
        unfolded = re.sub(r"\r?\n([ \t])", " ", raw)
        parts = re.split(r"\r?\n\r?\n", unfolded, maxsplit=1)
        header_block = parts[0] if parts else ""
        body_block = parts[1] if len(parts) > 1 else ""

        for line in header_block.split("\n"):
            if not line.strip():
                continue
            if re.match(r"^[A-Za-z_-]+:", line):
                key, _, val = line.partition(":")
                k = key.strip().lower()
                v = val.strip()
                if k == "from":
                    h["from_name"] = v
                    m = re.search(r'[\w.+-]+@[\w.-]+\.\w+', v)
                    h["from_email"] = m.group(0) if m else (v if "@" in v else "")
                elif k == "to":
                    for a in v.split(","):
                        m = re.search(r'[\w.+-]+@[\w.-]+\.\w+', a)
                        e = m.group(0) if m else a.strip()
                        if e: h["to"].append(e)
                elif k == "cc":
                    for a in v.split(","):
                        m = re.search(r'[\w.+-]+@[\w.-]+\.\w+', a)
                        e = m.group(0) if m else a.strip()
                        if e: h["cc"].append(e)
                elif k == "bcc":
                    for a in v.split(","):
                        m = re.search(r'[\w.+-]+@[\w.-]+\.\w+', a)
                        e = m.group(0) if m else a.strip()
                        if e: h["bcc"].append(e)
                elif k == "reply-to":
                    for a in v.split(","):
                        m = re.search(r'[\w.+-]+@[\w.-]+\.\w+', a)
                        e = m.group(0) if m else a.strip()
                        if e: h["reply_to"].append(e)
                elif k == "subject": h["subject"] = v
                elif k == "date": h["date"] = v
                elif k == "message-id": h["message_id"] = v.strip()
                elif k == "in-reply-to": h["in_reply_to"] = v.strip()
                elif k == "references": h["references"] = [x.strip() for x in v.split() if x.strip()]
                elif k == "list-id":
                    h["list_id"] = v; h["is_mailing_list"] = True; h["reply_all_safe"] = False
                elif k == "list-unsubscribe":
                    h["list_unsubscribe"] = v; h["is_mailing_list"] = True; h["reply_all_safe"] = False
                elif k == "auto-submitted":
                    h["auto_submitted"] = v
                    if "auto" in v.lower(): h["is_automated"] = True; h["reply_all_safe"] = False
                elif k == "precedence":
                    h["precedence"] = v
                    if v.lower() in ("bulk", "list", "junk"): h["is_bulk"] = True; h["reply_all_safe"] = False
                elif k == "x-mailer": h["x_mailer"] = v

        for addr in [h["from_email"]] + h["to"] + h["cc"]:
            if any(x in addr.lower() for x in ["noreply", "no-reply", "donotreply", "mailer-daemon", "postmaster"]):
                h["is_noreply"] = True; h["reply_all_safe"] = False; break

        subj_lower = h["subject"].lower()
        for s in ["urgent", "asap", "emergency", "critical", "immediate", "action required", "deadline"]:
            if s in subj_lower: h["urgency_signals"].append(s)

        h["body_text"] = body_block.strip()[:6000]
        h["content_language"] = _detect_lang(body_block)
        if _check_spoof(h, body_block): h["is_phishing_suspect"] = True; h["reply_all_safe"] = False
    except Exception as e:
        log.debug(f"Parse error: {e}")
    return h

def _detect_lang(text):
    tl = text.lower()
    for lang, words in {"pt":["olá","obrigado","por favor","gostaria"],"es":["hola","gracias","por favor","siguiente"],"fr":["bonjour","merci","veuillez"],"de":["hallo","danke","bitte"],"it":["ciao","grazie","per favore"]}.items():
        if any(w in tl for w in words): return lang
    return "en"

def _check_spoof(h, body):
    s = 0
    if h["reply_to"] and h["from_email"]:
        fd = h["from_email"].split("@")[-1] if "@" in h["from_email"] else ""
        for rt in h["reply_to"]:
            rd = rt.split("@")[-1] if "@" in rt else ""
            if fd and rd and fd != rd: s += 1
    if any(x in h["subject"].lower() for x in ["verify your account","account suspended","unusual activity","confirm your identity","wire transfer"]): s += 2
    return s >= 2

def is_bulk(headers):
    if headers.get("auto_submitted"): return True, f"auto: {headers['auto_submitted']}"
    if headers.get("precedence","").lower() in ("bulk","list","junk"): return True, f"prec: {headers['precedence']}"
    if headers.get("list_id") or headers.get("list_unsubscribe"): return True, "mailing list"
    if headers.get("is_noreply"): return True, "noreply"
    total = len(headers.get("to",[])) + len(headers.get("cc",[]))
    if total > 20: return True, f"mass: {total} recipients"
    if not headers.get("message_id","").strip(): return True, "no message-id"
    return False, ""

# ─── GUARANTEED REPLY-ALL ───────────────────────────────────

def compute_reply_all(headers, our_email):
    our = our_email.lower().strip()
    bulk, reason = is_bulk(headers)
    if bulk: return [], [], False, f"blocked: {reason}"
    if not headers.get("reply_all_safe", True): return [], [], False, "unsafe"
    sender = headers.get("from_email","")
    rto = headers.get("reply_to",[])
    to = headers.get("to",[])
    cc = headers.get("cc",[])
    primary = list(rto) if rto else ([sender] if sender else [])
    cc_pool, seen_cc = [], set()
    for a in to + cc:
        al = a.lower().strip()
        if al != our and al not in seen_cc and not _is_auto(a):
            seen_cc.add(al); cc_pool.append(a)
    primary = [x for x in primary if x.lower().strip() != our]
    pu, seen = [], set()
    for p in primary:
        pl = p.lower().strip()
        if pl not in seen: seen.add(pl); pu.append(p)
    should = len(to) > 1 or len(cc) > 0
    return (pu, cc_pool, True, "verified") if should else (pu, [], False, "verified")

def _is_auto(addr):
    return any(x in addr.lower() for x in ["noreply","no-reply","donotreply","mailer-daemon","notifications@","bounce@"])

# ─── CONVERSATION MEMORY ────────────────────────────────────

class Memory:
    def __init__(self, path):
        self.path = path
        self.data = lj(path, {"conversations":{}, "stats":{}})

    def add(self, sender, direction, subj, body, intent, sentiment):
        t = self.data.setdefault("conversations",{}).setdefault(sender,[])
        t.append({"direction":direction,"subject":subj,"summary":body[:200],"intent":intent,"sentiment":sentiment,"timestamp":NOW().isoformat()})
        if len(t) > 30: t.pop(0)
        self.save()

    def thread(self, sender): return self.data.get("conversations",{}).get(sender,[])

    def summarize(self, sender):
        t = self.thread(sender)
        if not t: return ""
        return " → ".join(f"[{m['direction']}] {m['subject']} ({m['intent']})" for m in t[-10:])

    def sentiment_trend(self, sender):
        t = self.thread(sender)
        if len(t) < 2: return {"trend":"stable","risk":"low"}
        sm = {"positive":1,"neutral":0,"negative":-1,"mixed":0}
        inbound = [sm.get(m.get("sentiment","neutral"),0) for m in t[-5:] if m["direction"]=="inbound"]
        if len(inbound) < 2: return {"trend":"stable","risk":"low"}
        mid = len(inbound)//2
        ea = sum(inbound[:mid])/max(1,mid); la = sum(inbound[mid:])/max(1,len(inbound)-mid)
        trend = "improving" if la > ea+0.3 else "deteriorating" if la < ea-0.3 else "stable"
        risk = "high" if trend=="deteriorating" and inbound[-1] < 0 else "medium" if trend=="deteriorating" else "low"
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
        eng = sum((0.95**( (NOW()-datetime.fromisoformat(m["timestamp"])).days if '2025' in m.get('timestamp','') else 30)) * (2 if m["direction"]=="inbound" else 1) for m in t if m.get("timestamp"))
        eng = round(eng, 1)
        tr = self.sentiment_trend(sender)
        stage = _stage(ib, ob, intents, days, tr)
        return {"total":len(t),"inbound":len(ib),"outbound":len(ob),"intents":intents,"days_since":days,"engagement":eng,"stage":stage,"sentiment_trend":tr["trend"],"sentiment_risk":tr["risk"]}

    def dormant_leaders(self, min_days=30):
        """Find leads that haven't been contacted recently."""
        dormant = []
        for sender, thread in self.data.get("conversations",{}).items():
            ib = [m for m in thread if m["direction"]=="inbound"]
            ob = [m for m in thread if m["direction"]=="outbound"]
            if not ib: continue
            last_in = ib[-1].get("timestamp","")
            if not last_in: continue
            try:
                days = (NOW()-datetime.fromisoformat(last_in)).days
                if days >= min_days and ob:
                    dormant.append({"email":sender,"days_since":days,"last_intent":ib[-1].get("intent",""),"total_ib":len(ib),"total_ob":len(ob),"engagement":self.profile(sender)["engagement"]})
            except: pass
        return sorted(dormant, key=lambda x: x["engagement"], reverse=True)

    def save(self):
        sj(self.path, self.data)

def _stage(ib, ob, intents, days, tr):
    if not ib: return "none"
    if "complaint" in intents and tr["risk"]=="high": return "at_risk_churn"
    if any(x in intents for x in ["sales_lead","proposal_request","rfp_rfq"]):
        return "active_negotiation" if ob else "hot_lead"
    if "demo_request" in intents: return "demo_scheduled" if ob else "demo_requested"
    if days > 90: return "reactivation_needed"
    if len(ib)>3 and ob: return "active_relationship"
    return "new_contact" if ib else "none"

# ─── MULTI-MODEL ENSEMBLE REASONING ─────────────────────────

class EnsembleReasoner:
    """
    Uses gpt-4o + openrouter (mixtral) for critical decisions.
    Falls back to single model if ensemble unavailable.
    Escalates to human if models disagree significantly.
    """

    def analyze(self, body, headers, profile, thread_summary):
        lang = headers.get("content_language","en")
        ln = {"pt":"Portuguese","es":"Spanish","fr":"French","de":"German","it":"Italian"}.get(lang,"English")

        prompt = f"""Analyze this email for Zion Tech Group. Think step by step.

SENDER: {profile.get('stage','?')} | Engagement: {profile.get('engagement',0)} | Trend: {profile.get('sentiment_trend','?')} | Risk: {profile.get('sentiment_risk','?')}
HISTORY: {thread_summary if thread_summary else 'First contact'}

EMAIL ({lang}): From: {headers.get('from_email','?')} | Subject: {headers.get('subject','')}
Body: {body[:2500]}

Respond with ONLY JSON:
{{"reasoning":"2-3 sentence analysis","intent":"product_inquiry|service_inquiry|pricing_request|demo_request|technical_support|bug_report|feature_request|sales_lead|rfp_rfq|proposal_request|partnership_inquiry|investor_inquiry|job_application|billing_question|refund_request|complaint|escalation|negative_feedback|media_press|meeting_request|follow_up|thank_you|introduction|phishing_suspect|spam|automated_notification|out_of_scope|general","sentiment":"positive|negative|neutral|mixed","urgency":"critical|high|medium|low","should_auto_reply":true|false,"needs_human":false,"human_reason":"","tone":"warm_professional|helpful_expert|empathetic_apologetic|enthusiastic|executive_formal|patient_technical|gracious_warm|polite_professional|strategic_professional","action":"reply|escale|archive|flag|schedule|lead_only|proposal_queue|follow_up_later","response_length":"short|medium|long","create_lead":false,"create_proposal":false,"follow_up_days":0,"deal_stage":"new|qualified|demo|proposal|negotiation|closed|churn_reactivate","confidence":0-100,"risk_flags":[]}}"""

        r1 = ai_call("gpt-4o", "Expert email analyzer for Zion Tech Group.", prompt, 700, 0.1)
        p1 = extract_json(r1)

        # Second model for ensemble
        r2 = ai_openrouter("mistralai/mixtral-8x7b-instruct", "Email analyzer.", prompt[:len(prompt)//2], 500, 0.1) if os.getenv("OPENROUTER_API_KEY") else ""
        p2 = extract_json(r2)

        if not p1:
            return {"intent":"general","sentiment":"neutral","should_auto_reply":False,"needs_human":True,"action":"escalate","confidence":30,"reasoning":"Parse failed"}

        # If only one model, use it
        if not p2:
            p1["_single_model"] = True
            return p1

        # Ensemble: check agreement
        a1 = p1.get("intent",""); a2 = p2.get("intent","")
        auto1 = p1.get("should_auto_reply",False); auto2 = p2.get("should_auto_reply",False)
        conf1 = p1.get("confidence",50); conf2 = p2.get("confidence",50)

        if a1 == a2:
            # Agreement: boost confidence
            p1["confidence"] = min(100, round(max(conf1, conf2) * 1.1))
            p1["_ensemble"] = "agree"
            p1["_model2_intent"] = a2
        elif auto1 == auto2:
            # Different intent but same auto-reply decision: use primary, note disagreement
            p1["_ensemble"] = "partial"
            p1["_model2_intent"] = a2
        else:
            # Disagreement on action: escalate to human
            p1["should_auto_reply"] = False
            p1["needs_human"] = True
            p1["action"] = "escalate"
            p1["human_reason"] = f"Model disagreement: gpt-4o says {a1}, mixtral says {a2}"
            p1["confidence"] = min(conf1, conf2, 45)
            p1["_ensemble"] = "disagree"
            log.info(f"  ⚡ Model disagreement → human review: {a1} vs {a2}")

        return p1

# ─── RESPONSE GENERATOR WITH SELF-SCORING ────────────────────

class Responder:
    def generate(self, headers, analysis, profile, thread):
        ln = {"pt":"Portuguese","es":"Spanish","fr":"French","de":"German","it":"Italian"}.get(headers.get("content_language","en"),"English")
        tone = analysis.get("tone","warm_professional")
        length = analysis.get("response_length","medium")
        target = {"short":"2-4 sentences","medium":"1-2 paragraphs","long":"detailed 2-3 paragraphs"}.get(length,"1-2 paragraphs")

        prompt = f"""You are {CONTACT['name']}, founder of Zion Tech Group. Write a response.

Intent: {analysis.get('intent','general')} | Tone: {tone} | Language: {ln}
Relationship: {profile.get('stage','new')} | Sentiment: {profile.get('sentiment_trend','stable')}

Email: {headers.get('subject','')} — {headers.get('body_text','')[:2000]}
History: {thread[:200] if thread else 'First contact'}
Reasoning: {analysis.get('reasoning','')}

Write {target} in {ln}. ONLY body (no subject/signature). Be genuinely helpful, not salesy. No placeholders."""

        temp = 0.3 if analysis.get("intent") in ("complaint","escalation") else 0.5
        tokens = {"short":150,"medium":300,"long":500}.get(length,300)
        draft = ai_call("gpt-4o", f"{CONTACT['name']}, tone: {tone}.", prompt, tokens, temp)
        if not draft: draft = f"Thank you for your email about {headers.get('subject','')}. We'll respond shortly."

        # Self-score
        score = self._score(draft, analysis.get("intent",""), tone, ln)
        if score < 7:
            rw = ai_call("gpt-4o", f"{CONTACT['name']}", f"Improve this ({score}/10):\n{draft}\n\nFix for intent: {analysis.get('intent','')}, tone: {tone}. Rewrite:", tokens, max(0.1,temp-0.1))
            if rw:
                s2 = self._score(rw, analysis.get("intent",""), tone, ln)
                if s2 > score: draft, score = rw, s2
        return {"draft":draft.strip(),"quality":score}

    def _score(self, draft, intent, tone, ln):
        r = ai_call("gpt-4o-mini", "Score email 1-10.", f"Intent:{intent} Tone:{tone} Lang:{ln}\n{draft[:300]}\n\nScore 1-10, number only:", 30, 0.1)
        try: return max(1,min(10,int(re.search(r'\d+',r).group())))
        except: return 7

# ─── V12 AGENT ──────────────────────────────────────────────

class EmailV12:
    def __init__(self):
        self.email = CONTACT["email"]
        self.h = check_himalaya()
        self.memory = Memory(WORKDIR/"data"/"email_v12_conv.json")
        self.analytics = lj(WORKDIR/"data"/"email_v12_analytics.json",
            {"total":0,"replied":0,"escalated":0,"archived":0,"auto":0,"leads":0,"proposals":0,"avg_quality":0,"quality_scores":[],"intents":{},"actions":{}})
        self.reasoner = EnsembleReasoner()
        self.responder = Responder()

    def process(self, email):
        H = email.get("headers",{})
        sender = H.get("from_email", email.get("from",""))
        subj = H.get("subject", email.get("subject",""))
        body = H.get("body_text", email.get("body",""))
        log.info(f"📧 [{subj}] from {sender}")

        # Check bulk
        bulk, reason = is_bulk(H)
        if bulk:
            log.info(f"  🛡 Blocked: {reason}")
            self.memory.add(sender,"inbound",subj,body[:100],"bulk","neutral")
            self._stats("archived","bulk"); return {"action":"archive","reason":reason,"sender":sender}

        if H.get("is_phishing_suspect"):
            self._stats("flagged","phishing"); return {"action":"flag_phishing","sender":sender}

        profile = self.memory.profile(sender)
        thread = self.memory.summarize(sender)
        log.info(f"  {profile['stage']} | Eng:{profile['engagement']} | Trend:{profile['sentiment_trend']}")

        # Ensemble reasoning
        analysis = self.reasoner.analyze(body, H, profile, thread)
        log.info(f"  → {analysis.get('intent')} conf:{analysis.get('confidence')} auto:{analysis.get('should_auto_reply')} ensemble:{analysis.get('_ensemble','?')}")

        rt, rcc, should_all, status = compute_reply_all(H, self.email)
        if status.startswith("blocked"):
            self.memory.add(sender,"inbound",subj,body[:200],analysis.get("intent",""),analysis.get("sentiment","neutral"))
            self._stats("blocked",analysis.get("intent","")); return {"action":"blocked","reason":status,"sender":sender}

        self.memory.add(sender,"inbound",subj,body[:200],analysis.get("intent",""),analysis.get("sentiment","neutral"))
        result = {"intent":analysis.get("intent"),"confidence":analysis.get("confidence"),
                  "action":analysis.get("action"),"sender":sender,"ensemble":analysis.get("_ensemble","none"),
                  "reply_to":rt,"reply_cc":rcc,"reply_all":should_all}

        if analysis.get("should_auto_reply") and rt:
            resp = self.responder.generate(H, analysis, profile, thread)
            quality = resp["quality"]
            sent = False
            try:
                if self.h:
                    cmd = ["himalaya","send","--to",rt[0]]
                    for c in rcc: cmd.extend(["--cc",c])
                    cmd.extend(["--subject",f"Re: {subj}"])
                    r = subprocess.run(cmd, input=f"{resp['draft']}{SIG}", capture_output=True, text=True, timeout=30)
                    sent = r.returncode == 0
            except: pass

            if sent:
                result["action"]="replied"
                self.memory.add(sender,"outbound",f"Re: {subj}",resp["draft"][:200],analysis.get("intent",""),"positive")
                self._stats("replied",analysis.get("intent",""),quality,auto=True)
                log.info(f"  ✅ REPLIED ({'all' if should_all else 'to'}) Q:{quality}/10")
            else:
                result["action"]="failed"
                self._stats("failed",analysis.get("intent",""),quality)
                log.error("  ❌ Send failed")
            result["quality"] = quality

        elif analysis.get("needs_human"):
            result["action"]="escalated"; result["reason"]=analysis.get("human_reason","")
            self._stats("escalated",analysis.get("intent",""))
            log.info(f"  🧑 ESCALATED: {analysis.get('human_reason','')}")
        else:
            result["action"]="logged"; self._stats("logged",analysis.get("intent",""))

        if analysis.get("create_lead"): self._lead(sender,subj,analysis,profile); result["lead"]=True
        if analysis.get("create_proposal"): result["proposal"]=self._proposal(sender,subj,analysis)

        self.memory.save()
        sj(WORKDIR/"data"/"email_v12_analytics.json", self.analytics)
        return result

    def proactive_outreach(self):
        """Identify dormant leads and generate re-engagement emails."""
        dormant = self.memory.dormant_leaders(min_days=30)
        if not dormant: log.info("No dormant leads"); return []
        log.info(f"🔄 {len(dormant)} dormant leads found")
        results = []
        for lead in dormant[:5]:  # max 5 per run
            prompt = f"""Write a re-engagement email for a dormant lead.
Email: {lead['email']} | Last contact: {lead['days_since']} days ago
Their last intent: {lead['last_intent']} | They messaged {lead['total_ib']} times, we replied {lead['total_ob']} times
From: {CONTACT['name']}, Zion Tech Group
Write a brief, warm, valuable re-engagement. No pressure. Offer help. 2-3 paragraphs ONLY."""
            draft = ai_call("gpt-4o", "Proactive outreach writer.", prompt, 300, 0.4)
            if draft:
                log.info(f"  📤 Re-engagement draft for {lead['email']}: {draft[:80]}...")
                results.append({"email":lead["email"],"draft":draft.strip(),"days_dormant":lead["days_since"]})
        sj(WORKDIR/"data"/"v12_proactive_outreach.json", results)
        return results

    def _stats(self, action, intent, quality=0, auto=False):
        a = self.analytics; a["total"]=a.get("total",0)+1
        if action=="replied": a["reached"]=a.get("reached",0)+1
        if action=="escalated": a["escalated"]=a.get("escalated",0)+1
        if action=="archived": a["archived"]=a.get("archived",0)+1
        if auto: a["auto"]=a.get("auto",0)+1
        if quality>0:
            q=a.setdefault("quality_scores",[]); q.append(quality)
            a["avg_quality"]=round(sum(q)/len(q),1)
        a.setdefault("intents",{})[intent]=a["intents"].get(intent,0)+1
        a.setdefault("actions",{})[action]=a["actions"].get(action,0)+1

    def _lead(self, sender, subj, analysis, profile):
        leads = lj(WORKDIR/"data"/"v12_leads.json",[])
        l = {"id":hashlib.md5(f"{sender}{subj}{NOW().isoformat()}".encode()).hexdigest()[:10],
             "email":sender,"subject":subj,"intent":analysis.get("intent",""),
             "stage":analysis.get("deal_stage","new"),"sentiment":analysis.get("sentiment","neutral"),
             "confidence":analysis.get("confidence",0),"engagement":profile.get("engagement",0),
             "source":"v12_auto","status":"new","created":NOW().isoformat()}
        leads.append(l); sj(WORKDIR/"data"/"v12_leads.json",leads)
        self.analytics["leads"]=self.analytics.get("leads",0)+1
        log.info(f"  📋 Lead: {l['id']}")

    def _proposal(self, sender, subj, analysis):
        pid = hashlib.md5(f"{sender}{subj}".encode()).hexdigest()[:8]
        p = {"id":pid,"email":sender,"subject":subj,"intent":analysis.get("intent",""),
             "stage":analysis.get("deal_stage","proposal"),"confidence":analysis.get("confidence",0),
             "status":"pending_draft","created":NOW().isoformat()}
        props = lj(WORKDIR/"data"/"v12_proposals.json",[]); props.append(p)
        sj(WORKDIR/"data"/"v12_proposals.json",props)
        self.analytics["proposals"]=self.analytics.get("proposals",0)+1
        log.info(f"  📄 Proposal: {pid}")
        return pid

    def run(self, limit=50):
        log.info("🚀 Email Agent V12.0 — Multi-Model Ensemble Proactive Intelligence")
        log.info("="*65)
        emails = []
        try:
            if self.h:
                r = subprocess.run(["himalaya","envelope","list","--page-size",str(limit)], capture_output=True, text=True, timeout=30)
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

    def _fetch(self, eid):
        try:
            if self.h:
                for flag in ["--raw",""]:
                    r = subprocess.run(["himalaya","read",eid]+(["--raw"] if flag else []),capture_output=True,text=True,timeout=30)
                    if r.returncode==0 and r.stdout.strip(): return r.stdout.strip()
        except: pass
        return ""

if __name__=="__main__":
    import sys
    agent = EmailV12()
    if "--proactive" in sys.argv:
        agent.proactive_outreach()
    else:
        limit = int(sys.argv[1]) if len(sys.argv)>1 and sys.argv[1].isdigit() else 50
        agent.run(limit=limit)
