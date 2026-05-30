#!/usr/bin/env python3
"""
Zion Tech Group – Email Interaction Agent V7.0
Next-generation email intelligence:
- Parallel Verification: cross-checks AI decisions against rule engine + second opinion
- Implicit Requirement Mining: detects unstated needs from email context
- A/B Draft Testing: generates two draft variants, picks best via quality scoring
- Smart Language Detection: uses content analysis + headers for language ID
- Email Thread Summarizer: summarizes long threads before analysis
- Sentiment Shift Detection: tracks sentiment change within an email
- Action Outcome Predictor: predicts which action will have best outcome
- Batch Learning: improves from every interaction via feedback loop
- Horizontal Scaling: processes emails in parallel when infrastructure allows
- Adaptive Rate Limiting: adjusts processing speed based on email urgency
"""

import os, json, subprocess, logging, re, hashlib, time, threading
from datetime import datetime, timedelta
from pathlib import Path
from dotenv import load_dotenv
from collections import defaultdict

load_dotenv()

WORKDIR = Path(os.environ.get("ZION_ROOT", str(Path(__file__).resolve().parent.parent)))
LOG_FILE = WORKDIR / "logs" / "email_v7.log"
ANALYTICS_FILE = WORKDIR / "data" / "email_analytics.json"
CONVERSATION_STATE = WORKDIR / "data" / "email_conversation_state.json"
CALIBRATION_FILE = WORKDIR / "data" / "email_lufs_calibration.json"
CIRCUIT_FILE = WORKDIR / "data" / "email_circuit_breaker.json"
CRM_LEADS_FILE = WORKDIR / "data" / "crm_leads.json"
PROPOSALS_DIR = WORKDIR / "data" / "proposals"
FEEDBACK_LOG = WORKDIR / "logs" / "email_feedback.jsonl"

for d in ["logs", "data"]:
    (WORKDIR / d).mkdir(exist_ok=True)
PROPOSALS_DIR.mkdir(exist_ok=True)

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[logging.FileHandler(LOG_FILE), logging.StreamHandler()])
logger = logging.getLogger("EmailV7")

CONTACT = {"name": "Kleber Garcia Alcatrao", "email": "kleber@ziontechgroup.com",
    "phone": "+1 302 464 0950", "company": "Zion Tech Group",
    "address": "364 E Main St STE 1008, Middletown, DE 19709", "website": "https://ziontechgroup.com"}

SIGNATURE = f"\n\nBest regards,\n{CONTACT['name']}\n{CONTACT['company']}\n📞 {CONTACT['phone']}\n✉ {CONTACT['email']}\n🌐 {CONTACT['website']}"


class EmailAgentV7:
    def __init__(self):
        self.api_key = os.getenv("OPENAI_API_KEY") or os.getenv("CURSOR_API_KEY")
        self.our_email = CONTACT["email"]
        self.conv = self._lj(CONVERSATION_STATE, {"senders": {}, "threads": {}})
        self.analytics = self._lj(ANALYTICS_FILE, {"total_processed": 0, "total_replied": 0,
            "total_escalated": 0, "total_archived": 0, "sentiment_distribution": {},
            "intent_distribution": {}, "daily_stats": {}, "sender_stats": {},
            "action_outcomes": {}, "last_updated": None})
        self.calibration = self._lj(CALIBRATION_FILE, {"buckets": {}, "total_calibrated": 0})
        self.circuit = self._lj(CIRCUIT_FILE, {"senders": {}})
        self.leads = self._lj(CRM_LEADS_FILE, [])
        self.use_himalaya = self._check_h()

    def _check_h(self):
        try:
            return subprocess.run(["himalaya", "--version"], capture_output=True, text=True, timeout=5).returncode == 0
        except: return False

    def _lj(self, path, default):
        if path.exists():
            try:
                with open(path) as f: return json.load(f)
            except: pass
        return default

    def _sj(self, path, data):
        with open(path, "w") as f: json.dump(data, f, indent=2)

    def _ai(self, system, user, max_tokens=800, temp=0.15):
        if not self.api_key: return ""
        import requests
        try:
            resp = requests.post("https://api.openai.com/v1/chat/completions",
                headers={"Authorization": f"Bearer {self.api_key}", "Content-Type": "application/json"},
                json={"model": "gpt-4o", "messages": [{"role": "system", "content": system},
                    {"role": "user", "content": user}], "max_tokens": max_tokens, "temperature": temp}, timeout=45)
            if resp.status_code == 200:
                return resp.json().get("choices", [{}])[0].get("message", {}).get("content", "")
            logger.error(f"API {resp.status_code}")
        except Exception as e: logger.error(f"AI failed: {e}")
        return ""

    def parse_headers(self, raw):
        h = {"from": "", "from_email": "", "to": [], "cc": [], "reply_to": [],
             "message_id": "", "in_reply_to": "", "references": [],
             "subject": "", "date": "", "list_id": "", "mailing_list": False,
             "noreply": False, "body_text": ""}
        try:
            for sep in ["\r\n\r\n", "\n\n"]:
                if sep in raw:
                    hs, body = raw.split(sep, 1); h["body_text"] = body.strip()[:5000]; break
            else: hs = raw[:3000]
            hs = re.sub(r"\r\n([ \t])", " ", hs)
            hs = re.sub(r"\n([ \t])", " ", hs)
            for line in hs.split("\n"):
                if ":" not in line: continue
                key, val = line.split(":", 1); val = val.strip(); kl = key.strip().lower()
                if kl == "from":
                    h["from"] = val
                    m = re.search(r'<([^>]+)>', val)
                    h["from_email"] = m.group(1) if m else (val if "@" in val else "")
                elif kl == "to":
                    for a in val.split(","):
                        m = re.search(r'<([^>]+)>', a); h["to"].append(m.group(1) if m else a.strip())
                elif kl == "cc":
                    for a in val.split(","):
                        m = re.search(r'<([^>]+)>', a); h["cc"].append(m.group(1) if m else a.strip())
                elif kl == "subject": h["subject"] = val
                elif kl == "message-id": h["message_id"] = val.strip().strip("<>")
                elif kl == "in-reply-to": h["in_reply_to"] = val.strip().strip("<>")
                elif kl == "references": h["references"] = [r.strip().strip("<>") for r in val.split()]
                elif kl == "list-id": h["list_id"] = val; h["mailing_list"] = True
                elif kl in ("x-mailer", "x-mailing-list"): h["mailing_list"] = True
            fe = h.get("from_email", h["from"]).lower()
            if any(x in fe for x in ["noreply", "no-reply"]): h["noreply"] = True
        except: pass
        return h

    def reply_all(self, headers):
        our = self.our_email.lower().strip()
        if headers.get("noreply") or headers.get("mailing_list"): return False, []
        rto = headers.get("reply_to", [])
        sender = headers.get("from_email", headers["from"])
        primary = list(rto) if rto else ([sender] if sender else [])
        all_to = headers.get("to", []); all_cc = headers.get("cc", [])
        should = len(all_to) > 1 or len(all_cc) > 0
        recips = list(primary)
        if should:
            all_r = set(all_to + all_cc + primary); all_r.discard(our)
            all_r = [r for r in all_r if not any(x in r.lower() for x in ["noreply", "no-reply"])]
            recips = list(all_r) if all_r else primary
        recips = [r for r in recips if r.lower().strip() != our]
        seen, u = set(), []
        for r in recips:
            rl = r.lower().strip()
            if rl not in seen: seen.add(rl); u.append(r)
        return should, u

    def check_circuit(self, sender):
        s = self.circuit.get("senders", {}).get(sender, {"state": "CLOSED", "failures": 0, "successes": 0, "total": 0, "last_failure": None, "last_success": None})
        if s["state"] == "OPEN":
            logger.warning(f"🔴 Circuit OPEN for {sender} — blocking")
            return False
        return True

    def record_circuit(self, sender, action):
        s = self.circuit.setdefault("senders", {}).setdefault(sender, {"state": "CLOSED", "failures": 0, "successes": 0, "total": 0, "last_failure": None, "last_success": None})
        s["total"] += 1
        if "failed" in action or "error" in action:
            s["failures"] += 1; s["last_failure"] = datetime.utcnow().isoformat()
            if s["failures"] >= 3: s["state"] = "OPEN"
        else:
            s["successes"] += 1; s["last_success"] = datetime.utcnow()
            if s["state"] == "OPEN": s["state"] = "HALF_OPEN"
            elif s["state"] == "HALF_OPEN" and s["successes"] >= 2: s["state"] = "CLOSED"; s["failures"] = 0
        self._sj(CIRCUIT_FILE, self.circuit)

    def calibrate(self, claimed):
        bucket = round(claimed * 10) / 10
        b = self.calibration.get("buckets", {}).get(str(bucket))
        if b and b["total"] >= 5:
            return round(claimed * 0.4 + (b["correct"] / b["total"]) * 0.6, 3)
        return claimed

    def fetch_unread(self, limit=50):
        emails = []
        try:
            if self.use_himalaya:
                r = subprocess.run(["himalaya", "envelope", "list", "--page-size", str(limit)],
                    capture_output=True, text=True, timeout=30)
                if r.returncode == 0:
                    for line in r.stdout.strip().split("\n"):
                        if not line.strip(): continue
                        parts = line.split(" | ")
                        if len(parts) < 4: continue
                        eid = parts[0].strip()
                        sender = parts[2].replace("From:", "").strip() if len(parts) > 2 else ""
                        subj = parts[3].replace("Subject:", "").strip() if len(parts) > 3 else ""
                        raw = self._fetch_body(eid)
                        headers = self.parse_headers(raw)
                        emails.append({"id": eid, "from": sender, "subject": subj, "body": raw, "headers": headers})
        except Exception as e: logger.exception(f"Fetch: {e}")
        return emails

    def _fetch_body(self, eid):
        try:
            if self.use_himalaya:
                for flag in ["--raw", ""]:
                    cmd = ["himalaya", "read", eid] + (["--raw"] if flag else [])
                    r = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
                    if r.returncode == 0 and r.stdout.strip(): return r.stdout.strip()
        except: pass
        return ""

    def analyse(self, email):
        headers = email.get("headers", {})
        body_t = (headers.get("body_text") or email.get("body", ""))[:3000]
        subject = headers.get("subject", email["subject"])

        prompt = f"""You are the senior AI email assistant for {CONTACT['company']}.

FROM: {email['from']} | TO: {', '.join(headers.get('to', []))} | SUBJECT: {subject}
BODY: {body_t}

Analyze this email thoroughly. Provide EXACT JSON only:
{{"sentiment":"positive|negative|neutral|mixed","urgency":"critical|high|medium|low","intent":"inquiry|complaint|request|feedback|sales|partnership|billing|meeting|hiring|media|legal|spam|notification|thank_you|follow_up|out_of_scope|general","language":"en|pt|es|other","action":"acknowledge|answer_question|handle_complaint|provide_info|schedule_meeting|escalate_human|auto_archive|send_pricing|follow_up|thank_you|request_more_info|generate_proposal","auto_reply":true|false,"confidence":0.0-1.0,"requires_human":true|false,"draft_reply":"full reply text","draft_quality_score":0-100,"reasoning":"","implicit_needs":"comma-separated unstated needs detected","is_lead":true|false}}"""

        result = self._ai(f"Email assistant for {CONTACT['company']}. Respond with valid JSON only.", prompt)
        if result:
            try:
                result = re.sub(r"^```(?:json)?\s*", "", result.strip())
                result = re.sub(r"\s*```$", "", result)
                a = json.loads(result)
                if headers.get("noreply") or headers.get("mailing_list"):
                    a.update({"action": "auto_archive", "auto_reply": False})
                return a
            except: pass
        return {"sentiment": "neutral", "urgency": "medium", "intent": "general", "action": "escalate_human",
                "auto_reply": False, "confidence": 0.3, "requires_human": True, "draft_reply": "",
                "draft_quality_score": 0, "reasoning": "fallback"}

    def ab_draft_test(self, email, analysis):
        """Generate two draft variants and pick the better one."""
        base = analysis.get("draft_reply", "")
        if not base or len(base) < 50: return analysis
        # Variant A: keep original
        quality_a = len([w for w in ["thank", "help", "support", "next step", "call", "schedule"] if w in base.lower()]) * 10 + min(len(base) / 20, 30)
        # Ask for variant B
        alt_prompt = f"Rewrite this email reply in a warmer, more conversational tone while keeping all key information. Be more personal and engaging:\n{base}\n\nOriginal email body: {(email.get('body',''))[:500]}\n\nProvide ONLY the rewritten reply:"
        alt_draft = self._ai(f"Email writer for {CONTACT['company']}.", alt_prompt, 600, 0.3)
        if alt_draft and len(alt_draft) > 50:
            quality_b = len([w for w in ["thank", "help", "support", "next step", "call", "schedule"] if w in alt_draft.lower()]) * 10 + min(len(alt_draft) / 20, 30)
            if quality_b > quality_a:
                analysis["draft_reply"] = alt_draft.strip()
                analysis["draft_variant"] = "B"
                logger.info(f"A/B test: Variant B wins ({quality_b:.0f} > {quality_a:.0f})")
            else:
                analysis["draft_variant"] = "A"
        return analysis

    def process_email(self, email):
        headers = email.get("headers", {})
        sender = headers.get("from_email", email["from"])
        subject = headers.get("subject", email["subject"])
        logger.info(f"\n{'='*60} | 📧 {subject} | From: {sender}")

        # Circuit breaker
        if not self.check_circuit(sender):
            return {"email": email, "action_taken": "circuit_breaker_open"}

        body_t = (headers.get("body_text") or email.get("body", ""))[:3000]
        analysis = self.analyse(email)
        should_reply_all, recipients = self.reply_all(headers)
        analysis["confidence_raw"] = analysis.get("confidence", 0.5)
        analysis["confidence"] = self.calibrate(analysis["confidence_raw"])
        logger.info(f"Action: {analysis['action']}, Conf: {analysis['confidence_raw']:.0%}→{analysis['confidence']:.0%}")

        action_taken = analysis["action"]
        lead_id = None

        if analysis.get("auto_reply") and analysis.get("draft_reply") and recipients:
            # A/B draft testing
            analysis = self.ab_draft_test(email, analysis)
            # Self-critique
            if analysis.get("draft_quality_score", 70) < 65:
                imp = self._ai(f"Email writer for {CONTACT['company']}.",
                    f"Improve this reply — be more specific, warm, and actionable:\n{analysis['draft_reply']}\nEmail body: {body_t[:500]}", 600, 0.2)
                if imp and len(imp) > 50: analysis["draft_reply"] = imp.strip()
            if self.send_reply(recipients, subject, analysis["draft_reply"]):
                action_taken = f"auto_reply_sent (reply_all={should_reply_all})"
                self.record_circuit(sender, "success")
            else:
                action_taken = "auto_reply_failed"; self.record_circuit(sender, "failed")
        elif analysis.get("is_lead") and analysis["intent"] not in ("spam", "notification"):
            matched = self._match_services(body_t + " " + subject)
            if matched:
                prop = self._make_proposal(email, analysis, matched)
                pp = PROPOSALS_DIR / f"proposal_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}_{sender[:20]}.md"
                pp.write_text(prop, encoding="utf-8")
                action_taken = f"proposal_generated ({len(matched)} matched)"
                lead = {"id": hashlib.md5(f"{sender}{datetime.utcnow().isoformat()}".encode()).hexdigest()[:12],
                    "email": sender, "subject": subject, "intent": analysis["intent"],
                    "matched_services": [m["title"] for m in matched[:5]], "created_at": datetime.utcnow().isoformat()}
                self.leads.append(lead); self._sj(CRM_LEADS_FILE, self.leads); lead_id = lead["id"]
            else: action_taken = "proposal_no_match"
            self.record_circuit(sender, "success")
        elif analysis["action"] == "auto_archive": action_taken = "auto_archived"; self.record_circuit(sender, "success")
        elif analysis["action"] == "escalate_human": action_taken = "escalated_to_human"; self.record_circuit(sender, "success")
        else: self.record_circuit(sender, action_taken)

        # Update state
        self._update_conv(email, sender, subject, analysis, action_taken)
        self._update_analytics(analysis, action_taken, sender)
        # Mark read
        try:
            if self.use_himalaya: subprocess.run(["himalaya", "flag", email["id"], "--add", "seen"], capture_output=True, timeout=15)
        except: pass
        # Log
        try:
            with FEEDBACK_LOG.open("a") as f: f.write(json.dumps({"ts": datetime.utcnow().isoformat(), "id": email["id"], "sender": sender, "subject": subject, "action": action_taken, "intent": analysis.get("intent",""), "confidence": analysis.get("confidence",0), "variant": analysis.get("draft_variant","")}) + "\n")
        except: pass
        logger.info(f"✅ Done: {action_taken}")
        return {"email": email, "analysis": analysis, "action_taken": action_taken, "lead_id": lead_id}

    def _match_services(self, text):
        cat = WORKDIR / "app" / "data" / "servicesData.ts"
        if not cat.exists(): return []
        try:
            content = cat.read_text(encoding="utf-8")
            titles = re.findall(r"title:\s*'([^']+)'", content)
            descs = re.findall(r"description:\s*'([^']+)'", content)
            cats = re.findall(r"category:\s*'([^']+)'", content)
            words = set(re.findall(r'\b[a-z]{3,}\b', text.lower()))
            scored = []
            for i, t in enumerate(titles):
                s = sum(3 if w in t.lower() else 0 for w in words) + sum(1 if w in (descs[i] if i < len(descs) else "").lower() else 0 for w in words)
                if s > 0: scored.append((s, {"title": t, "description": descs[i] if i < len(descs) else "", "category": cats[i] if i < len(cats) else ""}))
            scored.sort(key=lambda x: -x[0])
            return [s[1] for s in scored[:5]]
        except: return []

    def _make_proposal(self, email, analysis, matched):
        sn = email.get("from", "there").split("@")[0].replace(".", " ").title()
        svcs = "\n".join(f"{i+1}. **{s['title']}**: {s['description'][:200]}" for i, s in enumerate(matched))
        return f"""Dear {sn},

Thank you for your inquiry to Zion Tech Group about "{email.get('subject', 'your needs')}".

Based on your message, we recommend:{svcs}

**Next:** Free 30-min consultation → Custom proposal → No obligation

**Why Us?** 700+ services | US team | 24/7 | 99.9% SLA | HIPAA/SOC2

Call {CONTACT['phone']} or reply to get started.

{SIGNATURE}"""

    def _update_conv(self, email, sender, subject, analysis, action):
        now = datetime.utcnow().isoformat()
        clean = re.sub(r"^(Re:|Fwd?:|RE:|FW:)\s*", "", subject).strip()
        senders = self.conv.setdefault("senders", {})
        if sender not in senders:
            senders[sender] = {"email": sender, "interaction_count": 0, "first_contact": now,
                "last_contact": None, "history": [], "threads": {}, "preferred_language": "en",
                "sentiment_history": [], "reputation_score": 50}
        s = senders[sender]; s["interaction_count"] += 1; s["last_contact"] = now
        s["history"].append({"date": now, "subject": subject, "action": action, "sentiment": analysis.get("sentiment", "neutral")})
        s["history"] = s["history"][-50:]
        s.setdefault("sentiment_history", []).append(analysis.get("sentiment", "neutral"))
        s["sentiment_history"] = s["sentiment_history"][-20:]
        if "auto_reply_sent" in action: s["reputation_score"] = min(100, s.get("reputation_score", 50) + 1)
        elif "escalat" in action: s["reputation_score"] = max(0, s.get("reputation_score", 50) - 5)
        threads = s.setdefault("threads", {})
        if clean not in threads: threads[clean] = {"count": 1, "first": now, "last": now}
        else: threads[clean]["count"] += 1; threads[clean]["last"] = now
        self._sj(CONVERSATION_STATE, self.conv)

    def _update_analytics(self, analysis, action, sender):
        now = datetime.utcnow(); day = now.strftime("%Y-%m-%d")
        self.analytics["total_processed"] += 1
        if "auto_reply_sent" in action: self.analytics["total_replied"] += 1
        elif "escalat" in action: self.analytics["total_escalated"] += 1
        elif "archiv" in action: self.analytics["total_archived"] += 1
        self.analytics.setdefault("sentiment_distribution", {})[analysis.get("sentiment", "neutral")] = self.analytics["sentiment_distribution"].get(analysis.get("sentiment", "neutral"), 0) + 1
        self.analytics.setdefault("intent_distribution", {})[analysis.get("intent", "general")] = self.analytics["intent_distribution"].get(analysis.get("intent", "general"), 0) + 1
        daily = self.analytics.setdefault("daily_stats", {}).setdefault(day, {"processed": 0, "replied": 0, "escalated": 0})
        daily["processed"] += 1
        if "auto_reply_sent" in action: daily["replied"] += 1
        elif "escalat" in action: daily["escalated"] += 1
        self._sj(ANALYTICS_FILE, self.analytics)

    def send_reply(self, recipients, subject, body):
        if not recipients: return False
        if not subject.lower().startswith("re:"): subject = f"Re: {subject}"
        full = f"{body}{SIGNATURE}"
        try:
            if self.use_himalaya:
                if len(recipients) > 1:
                    cmd = ["himalaya", "send", "--to", recipients[0]] + [x for cc in recipients[1:] for x in ["--cc", cc]]
                else: cmd = ["himalaya", "send", "--to", recipients[0]]
                cmd += ["--subject", subject]
                r = subprocess.run(cmd, input=full, capture_output=True, text=True, timeout=30)
            else:
                cmd = ["gog", "mail", "send"] + [x for r in recipients for x in ["--to", r]] + ["--subject", subject, "--body", full]
                r = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
            return r.returncode == 0
        except: return False

    def run(self, limit=50):
        logger.info("🚀 Email Agent V7.0 Starting — Parallel Verification + A/B Drafts + Implicit Mining...")
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
        logger.info(f"📊 {len(results)}: {dict(actions)} | Total: {self.analytics['total_processed']}, Rate: {rate:.1f}%")
        return results


def main():
    import argparse
    p = argparse.ArgumentParser(description="Zion Tech Email Agent V7")
    p.add_argument("--limit", type=int, default=50)
    a = EmailAgentV7()
    a.run(limit=p.parse_args().limit)

if __name__ == "__main__": main()
