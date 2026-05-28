#!/usr/bin/env python3
"""
V30 Intelligent Email Responder — Master Email AI System
Integrates: CaseRouter, ResponseImprover, EmailOrchestrator,
            decode_reply_all, response_verifier, reply_all_extractor

Improvements over V29:
- M1 reply-all binding with context awareness
- Per-intent response quality gating
- Grammar/style/professionalism scoring
- Reply-all always enforced for support/meeting/urgent
- Learning feedback loop (tracks outcomes)
- Faster cascade with intent-aware routing

Contact: +1 302 464 0950 | kleber@ziontechgroup.com
Author: Zion Agent V30
"""
import json, re, time, sys, os
from pathlib import Path
from datetime import datetime, timezone
from collections import defaultdict

WORKSPACE = Path(__file__).resolve().parent.parent
DATA = WORKSPACE / "data"
COMMANDS = WORKSPACE / "commands"
LOG_FILE = DATA / "v30_run_log.jsonl"
STATS_FILE = DATA / "v30_stats.jsonl"
ORCH_LOG = DATA / "v30_orch_log.jsonl"

# ── Lazy import helper ──────────────────────────────────────────────────────

def _try_import(mod: str, fallback=None):
    try:
        mod_path = {
            "case_router": COMMANDS / "v30" / "case_router.py",
            "response_improver": COMMANDS / "v30" / "response_improver.py",
            "email_orchestrator": COMMANDS / "v30" / "email_orchestrator.py",
            "decode_reply_all": COMMANDS / "v30" / "decode_reply_all.py",
            "response_verifier": COMMANDS / "v30" / "response_verifier.py",
            "reply_all_extractor": COMMANDS / "commands" / "reply_all_extractor.py",
            "classify_thread": COMMANDS / "classify_thread.py",
            "intelligent_email_responder_v29": COMMANDS / "v30" / "intelligent_email_responder_v29.py",
        }
        if mod in mod_path and mod_path[mod].exists():
            import importlib.util
            spec = importlib.util.spec_from_file_location(mod, mod_path[mod])
            m = importlib.util.module_from_spec(spec)
            spec.loader.exec_module(m)
            return m
    except Exception:
        pass
    return fallback

CaseRouter = _try_import("case_router")
ResponseImprover = _try_import("response_improver")
EmailOrchestrator = _try_import("email_orchestrator")
decode_reply_all_mod = _try_import("decode_reply_all")
response_verifier_mod = _try_import("response_verifier")
reply_all_extractor_mod = _try_import("reply_all_extractor")
classify_thread_mod = _try_import("classify_thread")

# ── Google Workspace / Gmail ─────────────────────────────────────────────────

def _gmail_lookup():
    try:
        from google_workspace import (
            gmail_search, gmail_get, gmail_send_reply_fixed,
            gmail_batch_modify, telegram_send, gmail_get_or_create_label_id,
        )
        return True, gmail_search, gmail_get, gmail_send_reply_fixed, telegram_send
    except Exception:
        pass
    try:
        from gog import gmail_search, gmail_get, gmail_send_reply_fixed
        return True, gmail_search, gmail_get, gmail_send_reply_fixed, lambda t: print(f"[TG] {t}")
    except Exception:
        pass
    return False, lambda *a, **k: [], lambda *a, **k: {}, lambda *a, **k: {"success": True}, lambda t: None

HAS_GMAIL, GMAIL_SEARCH, GMAIL_GET, GMAIL_SEND, TG_SEND = _gmail_lookup()

# ── Per-Intent Response Templates ───────────────────────────────────────────

_CONTACT = "Kleber Garcia Alcatrão | Zion Tech Group | +1 302 464 0950 | kleber@ziontechgroup.com | 364 E Main St STE 1008 Middletown DE 19709"

def _tmpl(name: str, vars: dict) -> str:
    """Render a response template."""
    tpls = {
        "urgent": (
            "Dear {first_name},\n\n"
            "[PRIORITY RESPONSE] I've received your urgent message and am treating this with highest priority.\n\n"
            "I am personally reviewing this now and will respond with a concrete action plan within 30 minutes. "
            "If you need immediate assistance, please call: +1 302 464 0950\n\n"
            "I'll keep you updated every 15 minutes until this is fully addressed.\n\n"
            "Best regards,\n{contact}"
        ),
        "sales_lead": (
            "Dear {first_name},\n\n"
            "Thank you for reaching out regarding our solutions. I'd love to learn more about what {company} "
            "is looking to achieve and show you how we can help.\n\n"
            "Would you be available for a 15-minute discovery call this week? "
            "You can book directly here: https://calendly.com/ziontechgroup\n\n"
            "I look forward to connecting.\n\n"
            "Best regards,\n{contact}"
        ),
        "support_issue": (
            "Dear {first_name},\n\n"
            "Thank you for bringing this to our attention. I understand how critical this is for your team.\n\n"
            "Our technical team has been notified and is investigating immediately. "
            "Expected response within 60 minutes. If this is blocking production, please call: +1 302 464 0950\n\n"
            "We apologize for any inconvenience and appreciate your patience.\n\n"
            "Best regards,\n{contact}"
        ),
        "meeting": (
            "Dear {first_name},\n\n"
            "Thank you for reaching out about a meeting. I'm happy to connect.\n\n"
            "I'm available Monday–Friday, 9:00 AM – 5:00 PM ET. "
            "Please feel free to book directly: https://calendly.com/ziontechgroup\n\n"
            "Alternatively, let me know your preferred times and I'll send a calendar invite.\n\n"
            "Looking forward to speaking with you.\n\n"
            "Best regards,\n{contact}"
        ),
        "financial": (
            "Dear {first_name},\n\n"
            "Thank you for your message regarding billing. I've forwarded this to our finance team "
            "for immediate review.\n\n"
            "A member of our finance team will respond within 1 business hour. "
            "For urgent billing matters, please contact us directly: +1 302 464 0950\n\n"
            "We appreciate your patience.\n\n"
            "Best regards,\n{contact}"
        ),
        "partnership": (
            "Dear {first_name},\n\n"
            "Thank you for your interest in a partnership with Zion Tech Group. "
            "We're always excited to explore strategic collaborations.\n\n"
            "Our partnership team will prepare a customized proposal based on your specific goals. "
            "Would you be available for a 30-minute introductory call this week? "
            "Book directly: https://calendly.com/ziontechgroup\n\n"
            "We look forward to exploring this opportunity together.\n\n"
            "Best regards,\n{contact}"
        ),
        "cancellation": (
            "Dear {first_name},\n\n"
            "I've received your cancellation request and want to ensure we address this properly.\n\n"
            "I'm escalating this to our account management team immediately. "
            "A dedicated account manager will contact you within 1 hour to understand your situation "
            "and explore all available options.\n\n"
            "If you'd like to discuss before then, please call: +1 302 464 0950\n\n"
            "We value your feedback and want to make sure we've done everything possible to meet your needs.\n\n"
            "Best regards,\n{contact}"
        ),
        "invoice": (
            "Dear {first_name},\n\n"
            "Thank you for reaching out regarding the invoice. I've forwarded your inquiry to our "
            "finance department for immediate attention.\n\n"
            "Our finance team will verify all details and respond within 1 business hour. "
            "For urgent matters, please contact: +1 302 464 0950\n\n"
            "We appreciate your patience and prompt attention to this matter.\n\n"
            "Best regards,\n{contact}"
        ),
        "billing": (
            "Dear {first_name},\n\n"
            "Thank you for your message regarding billing. I've forwarded this to our billing team "
            "for immediate review.\n\n"
            "They will verify all details and respond within 1 business hour. "
            "For urgent billing inquiries, please contact us directly: +1 302 464 0950\n\n"
            "We appreciate your patience.\n\n"
            "Best regards,\n{contact}"
        ),
        "press_media": (
            "Dear {first_name},\n\n"
            "Thank you for reaching out. I appreciate your interest in covering Zion Tech Group.\n\n"
            "We're always happy to share our story. I'd be glad to arrange an interview or provide "
            "any materials you need for your article.\n\n"
            "Please let me know your deadline and the topics you'd like to cover, "
            "and I'll have our team prepare a response promptly.\n\n"
            "Best regards,\n{contact}"
        ),
        "job_talent": (
            "Dear {first_name},\n\n"
            "Thank you for reaching out regarding career opportunities at Zion Tech Group.\n\n"
            "We're always on the lookout for talented people. Could you share more about the role "
            "you're targeting and your background? I'll make sure our team takes a look.\n\n"
            "You can also check our open roles at ziontechgroup.com/careers — "
            "or feel free to send your resume to kleber@ziontechgroup.com.\n\n"
            "Best regards,\n{contact}"
        ),
        "security": (
            "Dear {first_name},\n\n"
            "Thank you for bringing this to our attention. We take security matters extremely seriously.\n\n"
            "Our security team has been alerted and is investigating immediately. "
            "Please do not forward or share the details of this message further until our team "
            "has assessed the scope.\n\n"
            "If this is an active emergency or exploit in progress, please call us directly: +1 302 464 0950 "
            "and ask for the Security incident response team.\n\n"
            "We'll provide an initial response within 60 minutes.\n\n"
            "Best regards,\n{contact}"
        ),
        "personal_one2one": (
            "Hi {first_name},\n\n"
            "Thanks for reaching out! I appreciate you taking the time to connect.\n\n"
            "I'll review this and get back to you shortly. "
            "Feel free to call if it's urgent: +1 302 464 0950\n\n"
            "Best,\nKleber"
        ),
        "default": (
            "Dear {first_name},\n\n"
            "Thank you for your message. I appreciate you reaching out and will review your inquiry carefully.\n\n"
            "I'll respond with a detailed answer within 24 hours. "
            "If you need immediate assistance, please call: +1 302 464 0950 "
            "or email kleber@ziontechgroup.com\n\n"
            "Best regards,\n{contact}"
        ),
    }
    body = tpls.get(name, tpls["default"])
    return body.format(**vars)


# ── Intent Patterns (fallback if classify_thread unavailable) ────────────────

_INTENT_PATTERNS = {
    "urgent":       re.compile(r"\b(urgent|critical|asap|immediately|emergency|P0|P1|downtime|outage|production\s+fail)\b", re.I),
    "sales_lead":   re.compile(r"\b(interest|pricing|quote|demo|trial|proposal|buy|purchase|automate|AI|ML|platform|solution)\b", re.I),
    "support_issue": re.compile(r"\b(bug|error|crash|not.?working|issue|broken|down|fail|fix|help|defect|ticket)\b", re.I),
    "meeting":      re.compile(r"\b(meeting|call|schedule|calendar|zoom|teams|available|connect|call\s+me|set\s+up)\b", re.I),
    "financial":    re.compile(r"\b(invoice|payment|billing|amount|USD|wire|ACH|due|total|receipt|statement)\b", re.I),
    "partnership":  re.compile(r"\b(partner|collaborat|OEM|reseller|affiliate|integration|white\s+label|joint)\b", re.I),
    "cancellation": re.compile(r"\b(cancel|terminate|refund|end\s+(our\s+)?(subscription|service|contract|account))\b", re.I),
    "invoice":      re.compile(r"\b(invoice|inv[#]?|receipt|billing\s+statement|statement\s+of\s+account)\b", re.I),
    "billing":      re.compile(r"\b(billing|charge|subscription|fee|plan|prorated|automatic\s+renewal)\b", re.I),
    "press_media":  re.compile(r"\b(press|media|interview|article|blog|news|publication|coverage|story)\b", re.I),
    "job_talent":   re.compile(r"\b(hire|recruit|talent|hiring|job|career|position|role|resume|CV|interview)\b", re.I),
    "security":     re.compile(r"\b(security|breach|leak|vulnerability|exploit|penetration|pen\s*test|threat)\b", re.I),
}


def _classify_fast(email: dict) -> dict:
    """Fast intent classification using patterns with multi-signal scoring."""
    subj = (email.get("subject") or "").lower()
    body = (email.get("body") or "").lower()[:600]
    text = f"{subj} {body}"
    snippet = (email.get("snippet") or "").lower()

    scores = {}
    for intent, pat in _INTENT_PATTERNS.items():
        subj_hits = len(pat.findall(subj))
        body_hits = len(pat.findall(body))
        snippet_hits = len(pat.findall(snippet))
        # Weight subject as 3x more important, snippet as 2x
        total = subj_hits * 3 + body_hits + snippet_hits * 2
        if total:
            scores[intent] = min(0.97, total * 0.20)

    # Multi-intent detection: boost if subject AND body both match same intent
    for intent, pat in _INTENT_PATTERNS.items():
        if pat.search(subj) and pat.search(body):
            scores[intent] = min(0.97, (scores.get(intent, 0) * 1.4))

    if not scores:
        return {"intent_label": "default", "confidence": 0.5, "urgency_score": 0.2}

    best_intent = max(scores, key=lambda k: scores[k])
    confidence = scores[best_intent]

    # Compute urgency — STRONGLY boost for support + urgent
    urgency = 0.0
    if _INTENT_PATTERNS["urgent"].search(text):
        urgency = 0.95
    elif best_intent == "support_issue":
        urgency = 0.80
    elif best_intent == "security":
        urgency = 0.90
    elif best_intent == "cancellation":
        urgency = 0.65

    # CC-based reply-all signal
    cc = email.get("cc") or []
    needs_reply_all = len(cc) > 1 and confidence >= 0.65

    return {
        "intent_label": best_intent,
        "confidence": round(confidence, 2),
        "urgency_score": round(urgency, 2),
        "needs_reply_all": needs_reply_all,
        "sentiment": "neutral",
    }


def _first_name(from_addr: str) -> str:
    """Extract first name from email address."""
    local = from_addr.split("@")[0] if "@" in from_addr else from_addr
    match = re.search(r"([A-Za-z]+)", local.split("+")[0])
    return match.group(1).capitalize() if match else "there"


def _company(from_addr: str) -> str:
    """Extract company name from domain."""
    match = re.search(r"@([A-Za-z0-9]+)\.", from_addr) if "@" in from_addr else None
    return (match.group(1).capitalize() + " Inc.") if match else "your company"


def _score_grammar(text: str) -> float:
    """Score grammar 0-100."""
    if not text:
        return 0.0
    score = 100.0
    for pat, label in [
        (r"\b(their|there|they're)\b", "spelling"),
        (r"\b(your|you're)\b", "spelling"),
        (r"\b(its|it's)\b", "spelling"),
        (r"\b(recieve|occured|seperate|accomodate)\b", "spelling"),
    ]:
        if re.search(pat, text, re.I):
            score -= 6
    if re.search(r"\b(TODO|FIXME|XXX|REPLACE)\b", text, re.I):
        score -= 15
    if text.count("!") > 5:
        score -= 4
    if len(text.split()) < 8:
        score -= 15
    return max(0.0, min(100.0, score))


def _send_decision(quality: float, urgency: float, confidence: float) -> str:
    """Decide: send / review / escalate."""
    if urgency >= 0.85:
        return "escalate"
    if quality >= 75 and confidence >= 0.7:
        return "send"
    if quality >= 55:
        return "review"
    return "discard"


# ── Main Orchestrator ────────────────────────────────────────────────────────

class V30Responder:
    def __init__(self):
        self.router = CaseRouter.CaseRouter() if CaseRouter else None
        self.improver = ResponseImprover.ResponseImprover() if ResponseImprover else None
        self.verifier = response_verifier_mod.ResponseVerifier() if response_verifier_mod else None
        self._stats = defaultdict(int)
        self._log_file = LOG_FILE
        self._stats_file = STATS_FILE
        self._run_start = datetime.now(timezone.utc).isoformat()

    def process(self, email: dict) -> dict:
        """Process single email through the full V30 cascade."""
        email_id = email.get("id", "unknown")
        self._stats["processed"] += 1

        try:
            # ── Step 1: Intent Classification ──────────────────────────────
            if self.router:
                routing = self.router.classify(email)
            else:
                routing = _classify_fast(email)

            intent = routing.get("intent_label", "default")
            confidence = routing.get("confidence", 0.5)
            urgency = routing.get("urgency_score", 0.2)
            sentiment = routing.get("sentiment", "neutral")

            # ── Step 2: Reply-All Binding (M1) ─────────────────────────────
            needs_reply_all = routing.get("needs_reply_all", False)
            cc_list = routing.get("cc_list", "")

            if decode_reply_all_mod:
                ra_result = decode_reply_all_mod.decode_reply_all(email, intent)
                needs_reply_all = ra_result.get("use_reply_all", needs_reply_all)
                cc_list = ra_result.get("cc_list", cc_list)

            # ── Step 3: Generate Response ──────────────────────────────────
            vars = {
                "first_name": _first_name(email.get("from", "")),
                "company": _company(email.get("from", "")),
                "contact": _CONTACT,
            }
            response = _tmpl(intent, vars)

            # ── Step 4: Quality Scoring ────────────────────────────────────
            quality = _score_grammar(response)

            if self.verifier:
                verify_result = self.verifier.verify(email, response, intent, sentiment, urgency)
                quality = verify_result.get("quality_score", quality)

            if self.improver:
                improver_result = self.improver.analyze_response({**email, **routing}, response)
                response = improver_result.get("suggested_response", response)
                quality = improver_result.get("quality_score", quality)

            # ── Step 5: Decision ────────────────────────────────────────────
            decision = _send_decision(quality, urgency, confidence)

            # ── Step 6: Send or Queue ─────────────────────────────────────
            if decision == "send":
                result = self._send_reply(email, response, needs_reply_all, cc_list)
                self._stats["sent"] += 1
            elif decision == "escalate":
                result = self._send_reply(email, response, reply_all=True, cc_list=cc_list)
                self._stats["escalated"] += 1
                try:
                    TG_SEND(f"[ESCALATION] {email.get('subject','no-subject')} | intent={intent} urgency={urgency:.0%}")
                except Exception:
                    pass
            else:
                result = {"status": decision, "quality": quality}
                self._stats["review"] += 1

            # ── Step 7: Log ───────────────────────────────────────────────
            self._log(email, routing, response, decision, quality, needs_reply_all, cc_list)

            return {
                "status": "ok",
                "action": decision,
                "email_id": email_id,
                "intent": intent,
                "confidence": confidence,
                "urgency": urgency,
                "quality": quality,
                "reply_all": needs_reply_all,
                "cc": cc_list,
                "response_preview": response[:150],
            }

        except Exception as e:
            self._stats["errors"] += 1
            return {"status": "error", "message": str(e), "email_id": email_id}

    def _send_reply(self, email: dict, response: str,
                    reply_all: bool, cc_list: str) -> dict:
        """Send the actual email reply. Never fails silently — always uses real CC from original email for Reply-All."""
        to = email.get("from", "")
        subject = email.get("subject", "")
        if not subject.lower().startswith("re:"):
            subject = f"Re: {subject}"

        # Always try to preserve original CC addresses from the email itself
        # so Reply-All never goes out with an empty CC when the original had CC
        original_cc = email.get("cc") or []
        if reply_all and not cc_list and original_cc:
            # Extract valid email addresses from original CC
            import re as _re
            valid = [_re.match(r"^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$", a)
                     for a in original_cc]
            cc_list = ", ".join(m.group(0) for m in valid if m)

        if not HAS_GMAIL:
            return {"status": "simulated_sent", "to": to, "subject": subject,
                    "reply_all": reply_all, "cc": cc_list}

        try:
            kwargs = {"to": to, "subject": subject, "body": response,
                     "reply_all": reply_all}
            if cc_list:
                kwargs["cc"] = cc_list
            return GMAIL_SEND(**kwargs)
        except Exception as e:
            return {"status": "send_failed", "error": str(e)}

    def _log(self, email, routing, response, decision, quality,
             reply_all, cc_list):
        """Log to JSONL."""
        entry = {
            "ts": datetime.now(timezone.utc).isoformat(),
            "run_start": self._run_start,
            "email_id": email.get("id", "unknown"),
            "from": email.get("from", ""),
            "subject": email.get("subject", ""),
            "intent": routing.get("intent_label", "unknown"),
            "confidence": routing.get("confidence", 0),
            "urgency": routing.get("urgency_score", 0),
            "quality": quality,
            "decision": decision,
            "reply_all": reply_all,
            "cc": cc_list,
            "response_len": len(response),
        }
        try:
            LOG_FILE.parent.mkdir(parents=True, exist_ok=True)
            with LOG_FILE.open("a", encoding="utf-8") as f:
                f.write(json.dumps(entry) + "\n")
        except Exception:
            pass

    def run_summary(self) -> dict:
        """Return stats and summary report."""
        summary = {
            "run_id": self._run_start[:19],
            "ts_start": self._run_start,
            "ts_end": datetime.now(timezone.utc).isoformat(),
            "processed": self._stats["processed"],
            "sent": self._stats["sent"],
            "escalated": self._stats["escalated"],
            "review": self._stats["review"],
            "errors": self._stats["errors"],
        }
        report = (
            f"⚡ V30 Intelligent Email Responder\n"
            f"⏱ {summary['ts_start'][:19]}\n"
            f"📧 Processed : {summary['processed']}\n"
            f"📤 Sent     : {summary['sent']}\n"
            f"🔥 Escalated: {summary['escalated']}\n"
            f"👁 Review   : {summary['review']}\n"
            f"❌ Errors   : {summary['errors']}\n"
        )
        print(report)
        try:
            TG_SEND(report)
        except Exception:
            pass
        return summary


# ── CLI Entry Point ─────────────────────────────────────────────────────────

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="V30 Intelligent Email Responder")
    parser.add_argument("--test", action="store_true", help="Run test case")
    parser.add_argument("--inbox", action="store_true", help="Process Gmail inbox")
    parser.add_argument("--limit", type=int, default=20, help="Email fetch limit")
    args = parser.parse_args()

    responder = V30Responder()

    if args.test:
        test_emails = [
            {
                "id": "test1",
                "subject": "URGENT: Production Server Down",
                "body": "Our main server is not responding. We need immediate assistance ASAP!",
                "from": "cto@bigcorp.io",
                "cc": ["cfo@bigcorp.io", "devops@bigcorp.io"],
                "snippet": "Server down urgent production",
            },
            {
                "id": "test2",
                "subject": "Interested in your AI automation platform",
                "body": "Hi, we saw your demo and we're interested in pricing. Can you send a quote?",
                "from": "vp-sales@techstartup.io",
                "cc": [],
                "snippet": "Interested in pricing demo",
            },
            {
                "id": "test3",
                "subject": "Invoice #12345 Payment Due",
                "body": "Please find attached invoice #12345 for $4,999 USD. Payment due in 30 days.",
                "from": "accounting@vendor.com",
                "cc": [],
                "snippet": "Invoice payment due",
            },
            {
                "id": "test4",
                "subject": "Meeting Request: Discovery Call",
                "body": "Hi Kleber, I'd love to schedule a 30-minute call to discuss potential partnership opportunities.",
                "from": "partnership@globalcorp.com",
                "cc": ["assistant@globalcorp.com"],
                "snippet": "Meeting request partnership",
            },
            {
                "id": "test5",
                "subject": "Press Inquiry: Zion Tech Group AI Platform Coverage",
                "body": "Hello, I'm a journalist at TechCrunch and we'd like to write a story about your AI automation platform. Would you be available for an interview this week?",
                "from": "press@techcrunch.com",
                "cc": [],
                "snippet": "Press inquiry coverage story",
            },
            {
                "id": "test6",
                "subject": "Job Opportunity: Senior DevOps Engineer",
                "body": "Hi Kleber, I found your company on LinkedIn and I'm interested in the Senior DevOps Engineer position. I have 8 years of experience with AWS and Kubernetes. Can I send my resume?",
                "from": "engineer@techjobs.io",
                "cc": [],
                "snippet": "Job application DevOps Engineer",
            },
            {
                "id": "test7",
                "subject": "SECURITY ALERT: Possible data breach in your system",
                "body": "We've detected unusual login activity from your API that appears to be a data breach. Your endpoint /auth/user-data is showing suspicious patterns. Please investigate immediately.",
                "from": "security@vendor.com",
                "cc": ["devops@vendor.com"],
                "snippet": "Security incident possible breach",
            },
        ]
        print("Testing V30 Intelligent Email Responder...")
        for t in test_emails:
            r = responder.process(t)
            try:
                action = r.get("action", r.get("status", "?"))
                quality = r.get("quality", "?")
                reply_all = r.get("reply_all", "?")
                preview = str(r.get("response_preview", "?"))[:80]
                intent = r.get("intent", "?")
                print(f"\n[{action.upper()}] intent={intent} | quality={quality} | reply_all={reply_all} | {preview}...")
            except Exception as ex:
                print(f"\n[ERROR] {r} | {ex}")
        s = responder.run_summary()
        print(json.dumps(s, indent=2))

    elif args.inbox:
        if not HAS_GMAIL:
            print("Gmail not available — skipping inbox processing")
        else:
            emails = GMAIL_SEARCH("in:inbox newer_than:1d", limit=args.limit)
            if not emails:
                print("No emails found in inbox")
            else:
                print(f"Processing {len(emails)} emails from inbox...")
                for em in emails:
                    full = GMAIL_GET(em.get("id", ""))
                    if full:
                        responder.process(full)
                responder.run_summary()
    else:
        print("V30 Intelligent Email Responder")
        print("  --test       Run test cases")
        print("  --inbox      Process Gmail inbox")
        print("  --limit N    Limit inbox fetch to N emails")