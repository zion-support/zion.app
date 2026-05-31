#!/usr/bin/env python3
"""
Zion Tech Group – Email Interaction Agent V26.0
Autonomous Email Operations — Self-Learning, Self-Healing, Self-Optimizing
"""
import os, json, re, hashlib, time, logging
from datetime import datetime, timezone, timedelta
from pathlib import Path

WORKDIR = Path(os.environ.get("ZION_ROOT", str(Path(__file__).resolve().parent.parent)))
LOG = WORKDIR / "logs" / "email_v26.log"
for d in ["logs", "data", "temp"]:
    (WORKDIR / d).mkdir(exist_ok=True)

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s",
    handlers=[logging.FileHandler(LOG), logging.StreamHandler()])
log = logging.getLogger("EmailV26")

CONTACT = {"name":"Kleber Garcia Alcatrao","email":"kleber@ziontechgroup.com","phone":"+1 302 464 0950","company":"Zion Tech Group","address":"364 E Main St STE 1008, Middletown, DE 19709","website":"https://ziontechgroup.com"}
SIG = f"\n\n{CONTACT['name']} | {CONTACT['company']}\n📞 {CONTACT['phone']} | ✉ {CONTACT['email']}\n🌐 {CONTACT['address']}\n🔗 {CONTACT['website']}"
NOW = lambda: datetime.now(timezone.utc)

def lj(p, d):
    if p.exists():
        try:
            with open(p) as f: return json.load(f)
        except: pass
    return d
def sj(p, d):
    with open(p, "w") as f: json.dump(d, f, indent=2, default=str)

def ai(model="gpt-4o", system="", user="", max_tok=900, temp=0.15):
    key = os.getenv("OPENAI_API_KEY") or os.getenv("CURSOR_API_KEY")
    if not key: return ""
    import requests
    try:
        r = requests.post("https://api.openai.com/v1/chat/completions",
            headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"},
            json={"model": model, "messages": [{"role":"system","content":system},{"role":"user","content":user}], "max_tokens": max_tok, "temperature": temp}, timeout=60)
        if r.status_code == 200: return r.json().get("choices",[{}])[0].get("message",{}).get("content","")
    except: pass
    return ""

def ai_fast(user="", system="", max_tok=400): return ai("gpt-4o-mini", system, user, max_tok, 0.1)
def ai_powerful(user="", system="", max_tok=1200): return ai("gpt-4o", system, user, max_tok, 0.2)
def extract_json(raw):
    if not raw: return None
    try:
        c = re.sub(r"^```(?:json)?\s*","",raw.strip())
        return json.loads(re.sub(r"\s*```$","",c))
    except: return None

def smart_ai(user="", system="", min_confidence=0.7):
    fast_resp = ai_fast(user, system)
    try:
        conf = float(re.search(r"0\.\d+|1\.0", ai_fast(f"Rate confidence (0.0-1.0) in: {fast_resp[:200]}", "Estimate confidence.")).group()) if re.search(r"0\.\d+|1\.0", ai_fast(f"Rate confidence (0.0-1.0) in: {fast_resp[:200]}", "Estimate confidence.")) else 0.5
    except: conf = 0.5
    if conf < min_confidence: return ai_powerful(user, system), conf, "escalated"
    return fast_resp, conf, "fast"

def parse_headers(raw):
    h = {"from_name":"","from_email":"","to":[],"cc":[],"reply_to":[],"subject":"","body_text":"","date":"","message_id":"","in_reply_to":"","references":[],"list_id":"","list_unsubscribe":"","auto_submitted":"","content_type":"","attachments":[]}
    if not raw: return h
    parts = raw.split("\n\n", 1) if "\n\n" in raw else [raw,""]
    header_section, body = parts[0], parts[1] if len(parts) > 1 else ""
    h["body_text"] = body.strip()
    lines = header_section.split("\n")
    ck, cv = None, ""
    for line in lines:
        if line.startswith((" ","\t")) and ck: cv += " " + line.strip(); continue
        if ck: h[ck] = cv.strip()
        if ":" in line: k, _, v = line.partition(":"); ck, cv = k.strip().lower().replace("-","_"), v.strip()
        else: ck = None
    if ck: h[ck] = cv.strip()
    if not h.get("from_email") and "from" in h:
        m = re.search(r"[\w.+-]+@[\w.-]+", h.get("from",""))
        if m: h["from_email"] = m.group()
    if "multipart" in h.get("content_type",""): h["attachments"] = re.findall(r'filename="([^"]+)"', raw)
    return h

class SelfLearningLoop:
    def __init__(self, p): self.p = p; self.db = lj(p, {"interactions":[]})
    def record(self, h, a, o):
        self.db.setdefault("interactions",[]).append({"hash":h,"action":a,"outcome":o,"at":str(NOW())})
        sj(self.p, self.db)

class SmartDelegationMatrix:
    RULES = {"inquiry":{"to":"kleber@ziontechgroup.com","priority":"medium"},"proposal_request":{"to":"kleber@ziontechgroup.com","priority":"high"},"complaint":{"to":"support@ziontechgroup.com","priority":"high"},"partnership":{"to":"kleber@ziontechgroup.com","priority":"high"}}
    def get(self, intent): return self.RULES.get(intent,{"to":"kleber@ziontechgroup.com","priority":"medium"})

class PredictiveInboxManager:
    def predict(self, d):
        t = f"{d.get('subject','')} {d.get('body_text','')}".lower()
        triggers = ["?","please","need","request","urgent","asap","deadline","meeting","call"]
        s = sum(1 for x in triggers if x in t)
        return {"response_needed": s >= 2, "urgency": "high" if s >= 4 else "medium" if s >= 2 else "low", "score": s}

class AutonomousABTester:
    def __init__(self, p): self.p = p; self.s = lj(p, {"tests":[],"winners":[]})
    def create(self, nm, variants):
        tid = hashlib.md5(f"{nm}{time.time()}".encode()).hexdigest()[:8]
        self.s.setdefault("tests",[]).append({"id":tid,"name":nm,"variants":variants,"created":str(NOW()),"status":"running","results":{v["id"]:{"sent":0,"opened":0,"replied":0} for v in variants}})
        sj(self.p, self.s)
        return tid

def analyze_email(raw_email):
    result = {"version":"V26","timestamp":str(NOW()),"parsed":{},"intent":"","sentiment":"neutral","priority":"medium","subject":"","body":"","confidence":0,"model_tier":"fast","reply_to":[],"cc":[],"reply_all_safe":True,"needs_human_review":False,"human_review_reasons":[],"prediction":None,"delegation":None,"ab_test_id":None}
    parsed = parse_headers(raw_email)
    result["parsed"] = parsed
    sender = parsed.get("from_email","unknown@unknown")
    body_text = parsed.get("body_text","")
    ai_r = ai_fast(f"Subject: {parsed.get('subject','')}\n\n{body_text[:2000]}", "Analyze email. JSON: {intent,sentiment,urgency,summary,key_topics}")
    ai_d = extract_json(ai_r) or {}
    result["intent"] = ai_d.get("intent","inquiry")
    result["sentiment"] = ai_d.get("sentiment","neutral")
    result["priority"] = ai_d.get("urgency","medium")
    learner = SelfLearningLoop(WORKDIR / "data" / "v26_learning.json")
    predictor = PredictiveInboxManager()
    delegator = SmartDelegationMatrix()
    ab = AutonomousABTester(WORKDIR / "data" / "v26_ab_tests.json")
    result["prediction"] = predictor.predict(parsed)
    result["delegation"] = delegator.get(result["intent"])
    if result["priority"] in ("high","critical"):
        result["ab_test_id"] = ab.create(f"subj_{parsed.get('subject','')[:30]}",[{"id":"a","text":f"Re: {parsed.get('subject','')}"},{"id":"b","text":f"Following up: {parsed.get('subject','')}"}])
    h = hashlib.md5(f"{sender}{parsed.get('subject','')}{time.time()}".encode()).hexdigest()[:12]
    learner.record(h, result["intent"], "processed")
    ai_sys = f"Zion V26: Intent={result['intent']}, Priority={result['priority']}, Delegation={result['delegation']['to']}, Prediction={result['prediction']['urgency']}, AB={result['ab_test_id']}"
    rb, conf, mt = smart_ai(f"Subject: {parsed.get('subject','')}\n\n{body_text[:2000]}", ai_sys)
    result["confidence"] = conf
    result["model_tier"] = mt
    if conf < 0.5: result["needs_human_review"] = True; result["human_review_reasons"].append(f"Low confidence: {conf:.2f}")
    result["subject"] = f"Re: {parsed.get('subject','')}"
    result["body"] = rb + SIG
    result["reply_to"] = [sender]
    log.info(f"V26: {sender} | {result['intent']} | {result['priority']} | {conf:.2f}")
    return result

if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1 and sys.argv[1] == "--test":
        r = analyze_email("""From: test@example.com\nTo: kleber@ziontechgroup.com\nSubject: Need help with AI integration\n\nWe need AI consulting for our platform. Budget $50K. Can you help?""")
        print(f"Intent: {r['intent']} | Priority: {r['priority']} | Conf: {r['confidence']:.2f}")
        print(f"Prediction: {r['prediction']} | Delegation: {r['delegation']}")
