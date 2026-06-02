#!/usr/bin/env python3
"""Email Intelligence Engine v6.0 — Case-by-Case Smart Responder

What's new vs v5:
1. Thread detection — groups emails by conversation thread (In-Reply-To, References, subject similarity)
2. Multi-signal scoring — combines 8+ signals for action recommendation (not just intent→action map)
3. Smart categorization — urgency × importance matrix (Eisenhower) for prioritization
4. Draft quality estimation — scores drafts before sending, flags low-quality for review
5. Auto-action rules — tiered automation: auto-archive spam, auto-thank-you, auto-acknowledge support
6. Sender profiling — detects company from email domain, enriches context
7. Pattern learning — tracks which drafts get edited vs sent unchanged (feedback loop)
8. Multi-language detection — detects 10+ languages and adjusts greeting/closing
9. Meeting/scheduling parser — extracts date/time proposals from meeting requests
10. Escalation routing — routes complaints to specific action chains (refund, legal, support)
"""
import json, sys, os, re, imaplib, email, hashlib
from email.header import decode_header
from email.utils import parseaddr
from datetime import datetime, timezone, timedelta
from pathlib import Path
from typing import Dict, List, Optional, Tuple

HOME = Path.home() / ".hermes"
CONFIG_FILE = HOME / "email-config" / "credentials.json"
OUTPUT_DIR = HOME / "email-drafts"
REPORT_DIR = HOME / "email-reports"
FEEDBACK_FILE = HOME / "email-feedback" / "learning.json"
for d in [OUTPUT_DIR, REPORT_DIR, FEEDBACK_FILE.parent]:
    d.mkdir(parents=True, exist_ok=True)

sys.path.insert(0, str(Path(__file__).parent))
from email_memory import ConversationMemory
from email_nlp import analyze_sentiment, classify_intent, detect_reply_all, detect_follow_up

# ─── 1. THREAD DETECTION ───

def normalize_subject(subject: str) -> str:
    """Strip Re:/Fwd:/etc to get base subject for thread grouping."""
    s = subject or ""
    for prefix in [r'(?i)^re:\s*', r'(?i)^fwd?:\s*', r'(?i)^fw:\s*']:
        s = re.sub(prefix, '', s)
    return s.strip()

def compute_thread_id(email_data: Dict) -> str:
    """Generate a thread ID from In-Reply-To, References, or normalized subject."""
    in_reply = email_data.get("in_reply_to", "")
    refs = email_data.get("references", "")
    if in_reply:
        return hashlib.md5(in_reply.encode()).hexdigest()[:12]
    if refs:
        return hashlib.md5(refs.split()[0].encode()).hexdigest()[:12]
    subj = normalize_subject(email_data.get("subject", ""))
    return hashlib.md5(subj.encode()).hexdigest()[:12]


# ─── 2. SENDER PROFILING ───

COMPANY_DOMAINS = {
    "enterprise.com": "Enterprise Corp", "startup.io": "Startup.io",
    "bigtech.com": "BigTech Inc", "technews.com": "TechNews",
    "client.com": "Client Corp", "gmail.com": None, "yahoo.com": None,
    "outlook.com": None, "hotmail.com": None, "protonmail.com": None,
    "aol.com": None, "icloud.com": None, "msn.com": None,
}

def detect_company(from_email: str) -> Tuple[str, str]:
    """Detect company name from email domain. Returns (company, domain_type)."""
    m = re.search(r'@([\w.-]+)$', from_email.lower())
    if not m:
        return ("Unknown", "unknown")
    domain = m.group(1)
    # Check known domains
    if domain in COMPANY_DOMAINS:
        return (COMPANY_DOMAINS[domain] or "Individual", "known")
    # Classify domain type
    if domain.endswith((".gov", ".edu")):
        return (domain.split(".")[0].upper() + " (Gov/Edu)", "institutional")
    if domain.endswith((".io", ".ai", ".dev", ".tech", ".app")):
        return (domain.split(".")[0].title() + " (Tech)", "corporate")
    company_name = domain.split(".")[0].replace("-", " ").title()
    return (company_name, "corporate")


# ─── 3. MULTI-LANGUAGE DETECTION ───

LANGUAGE_MARKERS = {
    "es": [r"\b(hola|gracias|por favor|necesito|quisiera|buenos días|estimado|saludos)\b"],
    "pt": [r"\b(olá|obrigado|por favor|preciso|gostaria|bom dia|prezado|atenciosamente)\b"],
    "fr": [r"\b(bonjour|merci|s'il vous plaît|besoin|cher|madame|salutations|cordialement)\b"],
    "de": [r"\b(hallo|danke|bitte|brauche|liebe|mit freundlichen grüßen|sehr geehrte)\b"],
    "it": [r"\b(ciao|grazie|per favore|ho bisogno|saluti|gentile|distinti saluti)\b"],
    "zh": ["你好", "谢谢", "请", "您好", "感谢"],
    "ja": ["こんにちは", "ありがとう", "お願い", "様", "了解"],
    "ko": ["안녕하세요", "감사합니다", "부탁드립니다", "님"],
    "ar": ["مرحبا", "شكرا", "من فضلك", "السيد"],
    "ru": [r"\b(здравствуйте|спасибо|пожалуйста|уважаемый|с уважением)\b"],
}

LOCALIZED_GREETINGS = {
    "en": {"formal": "Dear", "informal": "Hi", "closing": "Best regards,", "thanks": "Thank you for"},
    "es": {"formal": "Estimado/a", "informal": "Hola", "closing": "Saludos cordiales,", "thanks": "Gracias por"},
    "pt": {"formal": "Prezado/a", "informal": "Olá", "closing": "Atenciosamente,", "thanks": "Obrigado por"},
    "fr": {"formal": "Cher/Chère", "informal": "Bonjour", "closing": "Cordialement,", "thanks": "Merci de"},
    "de": {"formal": "Sehr geehrte/r", "informal": "Hallo", "closing": "Mit freundlichen Grüßen,", "thanks": "Vielen Dank für"},
    "it": {"formal": "Gentile", "informal": "Ciao", "closing": "Cordiali saluti,", "thanks": "Grazie per"},
    "zh": {"formal": "尊敬的", "informal": "你好", "closing": "此致敬礼,", "thanks": "感谢您"},
    "ja": {"formal": "様", "informal": "こんにちは", "closing": "敬具,", "thanks": "ありがとうございます"},
    "ko": {"formal": "님", "informal": "안녕하세요", "closing": "감사합니다,", "thanks": "감사합니다"},
    "ar": {"formal": "السيد/ة", "informal": "مرحبا", "closing": "مع التحية,", "thanks": "شكرا ل"},
    "ru": {"formal": "Уважаемый/ая", "informal": "Здравствуйте", "closing": "С уважением,", "thanks": "Спасибо за"},
}

def detect_language(text: str) -> str:
    """Detect email language. Returns language code."""
    t = text.lower()
    scores = {}
    for lang, markers in LANGUAGE_MARKERS.items():
        score = 0
        for m in markers:
            try:
                score += len(re.findall(m, t, re.IGNORECASE))
            except re.error:
                count = t.count(m)
                score += count
        if score > 0:
            scores[lang] = score
    if not scores:
        return "en"
    return max(scores, key=scores.get)


# ─── 4. MEETING/SCHEDULING PARSER ───

def parse_meeting_request(text: str) -> Dict:
    """Extract meeting proposals from email text."""
    t = text.lower()
    result = {"has_meeting_request": False, "proposed_times": [], "duration_minutes": 30, "meeting_type": "call"}

    if not re.search(r"(schedule|book|set up|call|meeting|demo|zoom|teams|google meet)", t):
        return result

    result["has_meeting_request"] = True

    # Detect duration
    dur_match = re.search(r'(\d+)\s*(min|minute|hr|hour)', t)
    if dur_match:
        val, unit = int(dur_match.group(1)), dur_match.group(2)
        result["duration_minutes"] = val * 60 if unit.startswith("h") else val

    # Detect meeting type
    if "zoom" in t: result["meeting_type"] = "Zoom call"
    elif "teams" in t: result["meeting_type"] = "Teams call"
    elif "google meet" in t: result["meeting_type"] = "Google Meet"
    elif "demo" in t: result["meeting_type"] = "Product demo"
    elif "call" in t: result["meeting_type"] = "Phone call"
    elif "in person" in t or "in-person" in t: result["meeting_type"] = "In-person meeting"

    # Extract day/time proposals
    day_match = re.findall(r'(monday|tuesday|wednesday|thursday|friday|saturday|sunday|tomorrow|next week|this week)', t)
    time_match = re.findall(r'(\d{1,2}(?::\d{2})?\s*(?:am|pm|a\.m\.|p\.m\.)?)', t)
    tz_match = re.findall(r'(est|pst|cst|mst|gmt|utc)', t)

    result["proposed_days"] = list(set(day_match))
    result["proposed_times"] = list(set(time_match))
    result["timezone"] = tz_match[0].upper() if tz_match else "EST"
    result["urgency"] = "high" if "this week" in t or "tomorrow" in t else "normal"

    return result


# ─── 5. ESCALATION ROUTING ───

class EscalationRouter:
    """Routes complaints and critical issues through proper action chains."""

    @staticmethod
    def route(email_data: Dict, sentiment: Dict, intent: Dict) -> Dict:
        urgency = "normal"
        action_chain = []
        flag_color = "yellow"

        # Determine urgency from signals
        body = email_data.get("body", "").lower()
        subj = email_data.get("subject", "").lower()

        has_threat = "legal" in body or "lawsuit" in body or "sue" in body
        has_refund = "refund" in body or "money back" in body or "chargeback" in body
        has_urgent = "urgent" in subj or "critical" in subj or "asap" in subj
        has_ceo = "ceo" in body or "executive" in body or "escalate" in body
        sentiment_primary = sentiment.get("primary", "neutral")
        sent_conf = sentiment.get("confidence", 0)

        if has_threat:
            urgency = "critical"
            flag_color = "red"
            action_chain = [
                "1. ⚡ IMMEDIATE: Acknowledge receipt within 1 hour",
                "2. 📋 Forward to legal review queue",
                "3. 📞 Schedule CEO briefing call",
                "4. 📝 Prepare written response with legal oversight",
                "5. ⏰ Follow-up in 24h with resolution timeline"
            ]
        elif has_refund or (sentiment_primary == "threatening" and sent_conf > 0.3):
            urgency = "high"
            flag_color = "orange"
            action_chain = [
                "1. Escalate to account management",
                "2. Review service delivery history",
                "3. Prepare goodwill gesture options",
                "4. Personal response from Kleber within 4 hours",
                "5. Follow-up with resolution offer"
            ]
        elif sentiment_primary in ("frustrated", "disappointed") and sent_conf > 0.5:
            urgency = "high"
            flag_color = "orange"
            action_chain = [
                "1. Acknowledge the issue sincerely",
                "2. Assign dedicated support engineer",
                "3. Provide timeline for resolution",
                "4. Follow-up within 24h"
            ]
        elif has_urgent or has_ceo:
            urgency = "high"
            flag_color = "orange"
            action_chain = [
                "1. Immediate acknowledgment",
                "2. Route to appropriate department head",
                "3. Response within 2 hours"
            ]
        elif sentiment_primary == "urgent":
            urgency = "medium"
            flag_color = "yellow"
            action_chain = [
                "1. Prioritize processing",
                "2. Standard response within 8 hours"
            ]
        else:
            flag_color = "green"
            action_chain = ["Standard processing"]

        return {
            "urgency": urgency,
            "flag_color": flag_color,
            "action_chain": action_chain,
            "keywords_detected": {
                "threat": has_threat, "refund": has_refund,
                "urgent": has_urgent, "ceo": has_ceo
            }
        }


# ─── 6. SMART SCORING ENGINE (Multi-signal) ───

class SmartScorer:
    """Combines 8+ signals into a single action recommendation."""

    @staticmethod
    def calculate(email_data: Dict, memory: ConversationMemory) -> Dict:
        sender = email_data["from"]
        ctx = memory.get_sender_context(sender)
        tier = memory.get_relationship_tier(sender)

        # Signal 1: Relationship weight (0-25)
        tier_score = {"vip": 25, "trusted": 20, "familiar": 15, "acquaintance": 10, "new": 5}
        s_relationship = tier_score.get(tier, 5)

        # Signal 2: Intent value (0-25)
        intent = classify_intent(email_data["body"], email_data["subject"])
        intent_value = {
            "sales_inquiry": 22, "partnership": 20, "meeting_request": 18,
            "complaint": 15, "support_request": 15, "media_press": 12,
            "information_request": 10, "job_inquiry": 8, "thank_you": 5, "spam": 0, "general": 3
        }
        s_intent = intent_value.get(intent["intent"], 3)

        # Signal 3: Sentiment urgency (0-15)
        sent = analyze_sentiment(email_data["body"])
        sent_score = 0
        if sent["should_escalate"]: sent_score = 15
        elif sent["primary"] in ("urgent", "frustrated"): sent_score = 12
        elif sent["primary"] in ("disappointed", "negotiating"): sent_score = 10
        elif sent["primary"] in ("excited", "grateful"): sent_score = 5
        s_sentiment = sent_score

        # Signal 4: Reply-time context (0-10)
        s_replytime = 5  # default
        try:
            email_date = email_data.get("date", "")
            if email_date:
                parsed = datetime.fromisoformat(email_date.replace("Z", "+00:00"))
                age_hours = (datetime.now(timezone.utc) - parsed).total_seconds() / 3600
                if age_hours < 2: s_replytime = 10
                elif age_hours < 8: s_replytime = 8
                elif age_hours < 24: s_replytime = 6
                elif age_hours < 72: s_replytime = 3
                else: s_replytime = 1
        except: pass

        # Signal 5: Body length/detail (0-5)
        body_len = len(email_data.get("body", ""))
        s_detail = min(5, body_len // 200)

        # Signal 6: Question count (0-5)
        q_count = email_data.get("body", "").count("?")
        s_questions = min(5, q_count)

        # Signal 7: Has CC/BCC (indicates formal/business) (0-5)
        cc = email_data.get("cc", "")
        s_formal = 5 if cc else 0

        # Signal 8: Follow-up needed (0-5)
        fu = detect_follow_up(email_data["body"])
        s_followup = 5 if fu["needed"] else 0

        total = s_relationship + s_intent + s_sentiment + s_replytime + s_detail + s_questions + s_formal + s_followup
        max_possible = 100

        # Determine action category
        if total >= 80: category = "IMMEDIATE_ACTION"
        elif total >= 60: category = "RESPOND_TODAY"
        elif total >= 40: category = "RESPOND_THIS_WEEK"
        elif total >= 20: category = "QUEUE_FOR_REVIEW"
        else: category = "ARCHIVE_OR_DELEGATE"

        return {
            "total_score": total,
            "max_possible": max_possible,
            "percentage": round(total / max_possible * 100),
            "category": category,
            "signals": {
                "relationship": s_relationship,
                "intent_value": s_intent,
                "sentiment_urgency": s_sentiment,
                "reply_timeliness": s_replytime,
                "detail_level": s_detail,
                "questions_asked": s_questions,
                "formality": s_formal,
                "followup_needed": s_followup,
            }
        }


# ─── 7. AUTO-ACTION RULES ENGINE ───

class AutoActionEngine:
    """Determines which actions can be automated vs need human review."""

    @staticmethod
    def determine_action(email_data: Dict, draft: Dict, scoring: Dict,
                          memory: ConversationMemory, lang: str) -> Dict:
        intent = draft["intent"]
        category = scoring["category"]
        sender = email_data["from"]
        tier = memory.get_relationship_tier(sender)

        # Tier 1: Fully automated (safe actions)
        if intent == "spam":
            return {
                "auto_action": "archive",
                "action_label": "🗑️ Auto-Archive",
                "confidence": 0.95,
                "requires_approval": False,
                "explanation": "Spam detection with high confidence"
            }

        if intent == "thank_you" and tier in ("trusted", "vip"):
            return {
                "auto_action": "acknowledge",
                "action_label": "✅ Auto-Acknowledge",
                "confidence": 0.85,
                "requires_approval": False,
                "explanation": "Thank-you from trusted sender — safe to auto-acknowledge"
            }

        # Tier 2: Semi-automated (draft ready, needs one-click send)
        if category in ("QUEUE_FOR_REVIEW", "ARCHIVE_OR_DELEGATE"):
            return {
                "auto_action": "draft_only",
                "action_label": "📝 Draft → Review Queue",
                "confidence": 0.7,
                "requires_approval": True,
                "explanation": "Low priority — draft prepared for review"
            }

        # Tier 3: High priority — always human review
        if category == "IMMEDIATE_ACTION" or tier == "new" and intent in ("sales_inquiry", "complaint"):
            return {
                "auto_action": "draft_urgent",
                "action_label": "🚨 Draft → URGENT Review",
                "confidence": 0.6,
                "requires_approval": True,
                "explanation": "High-stakes email — human review required before sending"
            }

        # Tier 4: Contextual auto-actions
        if scoring["total_score"] >= 50 and tier in ("trusted", "familiar"):
            return {
                "auto_action": "draft_with_approval",
                "action_label": "📨 Draft → Quick Approval",
                "confidence": 0.75,
                "requires_approval": True,
                "explanation": f"Known {tier} sender with significant inquiry"
            }

        # Default: draft for review
        return {
            "auto_action": "draft_review",
            "action_label": "📝 Draft → Standard Review",
            "confidence": 0.65,
            "requires_approval": True,
            "explanation": "Standard draft — review before sending"
        }


# ─── 8. DRAFT QUALITY ESTIMATION ───

class DraftQualityScorer:
    """Scores draft quality 0-100 to flag low-quality drafts."""

    @staticmethod
    def score(draft_body: str, email_data: Dict) -> Dict:
        score = 50  # base
        issues = []

        # Positive signals
        if len(draft_body) > 100:
            score += 10
        else:
            issues.append("Draft is very short")

        if len(draft_body) > 300:
            score += 5

        # Check for personalization
        sender_name = email_data.get("from_name", "").split()[0]
        if sender_name and sender_name in draft_body:
            score += 10
        else:
            issues.append("Missing sender name personalization")

        # Check for subject reference
        subj = email_data.get("subject", "")
        if subj and any(word in draft_body.lower() for word in subj.lower().split()[:3]):
            score += 5

        # Check for contact info
        if "kleber@ziontechgroup.com" in draft_body or "+1 302" in draft_body:
            score += 10
        else:
            issues.append("Missing contact information")

        # Check for action items
        if any(line.strip().startswith(("1.", "2.", "•")) for line in draft_body.split("\n")):
            score += 5

        # Check for link to website
        if "zion-support.github.io" in draft_body:
            score += 5

        # Negative signals
        if draft_body.count("\n\n\n") > 3:
            score -= 10
            issues.append("Excessive whitespace")

        # Check for generic phrases that suggest lazy drafting
        generic_patterns = [
            r"as an AI", r"I'm an AI", r"as a language model",
            r"I don't have personal", r"I cannot"
        ]
        for p in generic_patterns:
            if re.search(p, draft_body, re.IGNORECASE):
                score -= 15
                issues.append(f"Contains AI-disclosure language: '{p}'")

        score = max(0, min(100, score))

        quality = "excellent" if score >= 80 else "good" if score >= 60 else "adequate" if score >= 40 else "needs_improvement"

        return {
            "quality_score": score,
            "quality_label": quality,
            "issues": issues,
            "needs_revision": score < 50
        }


# ─── 9. IMPROVED DRAFT GENERATOR (v6) ───

def generate_draft_v6(email_data: Dict, memory: ConversationMemory,
                       scoring: Dict) -> Dict:
    """Generate smarter, more contextual drafts than v5."""
    sender = email_data["from"]
    ctx = memory.get_sender_context(sender)
    tier = memory.get_relationship_tier(sender)
    intent = classify_intent(email_data["body"], email_data["subject"])
    sentiment = analyze_sentiment(email_data["body"])
    reply_all = detect_reply_all(email_data)
    followup = detect_follow_up(email_data["body"])
    meeting = parse_meeting_request(email_data["body"])
    company, domain_type = detect_company(sender)

    intent_key = intent["intent"]
    name = email_data.get("from_name", "there").split()[0]
    subj = email_data.get("subject", "Your Inquiry")
    lang = detect_language(email_data["body"])

    # Localized greeting
    greetings = LOCALIZED_GREETINGS.get(lang, LOCALIZED_GREETINGS["en"])
    if ctx["known"] and ctx["score"] > 0.5:
        greeting = f"{greetings['informal']} {name},"
    else:
        greeting = f"{greetings['formal']} {name},"

    # Company context reference
    company_ref = f" at {company}" if company and company != "Individual" else ""

    # Build drafts based on intent (much richer than v5)
    drafts = {
        "sales_inquiry": (
            f"{greeting}\n\n"
            f"{greetings['thanks']} your interest in Zion Tech Group's solutions{company_ref}. "
            f"I've reviewed your requirements and I'm excited about the opportunity to help.\n\n"
            f"Based on your inquiry about '{subj}', here's how we can help:\n"
            f"• Custom AI/IT solutions tailored to your specific requirements\n"
            f"• Flexible pricing from $9/mo starter to enterprise-scale deployments\n"
            f"• Free architecture consultation and ROI analysis\n"
            f"• Dedicated support team with 99.9% SLA uptime\n"
            f"• 1,168+ proven micro-SaaS, AI, IT, Cloud & Security services\n\n"
            f"I'd love to schedule a brief call to discuss your specific needs. "
            f"What's your availability this week?\n\n"
            f"{greetings['closing']}\nKleber Garcia Alcatrao\nCEO, Zion Tech Group\n"
            f"📧 kleber@ziontechgroup.com\n📞 +1 302 464 0950\n🌐 https://zion-support.github.io"
        ),
        "support_request": (
            f"{greeting}\n\n"
            f"I've received your support request and flagged it for immediate attention.\n\n"
            f"🚀 Our response process:\n"
            f"1. Technical review — within 2 hours\n"
            f"2. Diagnosis and action plan — within 4 hours\n"
            f"3. Dedicated engineer assigned for complex issues\n"
            f"4. Resolution update every 24 hours\n\n"
            f"For critical production issues, call me directly at +1 302 464 0950.\n\n"
            f"{greetings['closing']}\nKleber Garcia Alcatrao"
        ),
        "complaint": (
            f"{greeting}\n\n"
            f"I'm truly sorry to hear about your experience. Your satisfaction is our top priority, "
            f"and I take this matter personally.\n\n"
            f"Here's what I'm doing right now:\n"
            f"1. 🚨 Personally reviewing your case\n"
            f"2. 👤 Assigning a dedicated resolution specialist\n"
            f"3. 📋 Investigating the root cause\n"
            f"4. 📞 Will follow up with a resolution plan within 24 hours\n\n"
            f"Please feel free to call me directly at +1 302 464 0950.\n\n"
            f"Sincerely,\nKleber Garcia Alcatrao"
        ),
        "partnership": (
            f"{greeting}\n\n"
            f"{greetings['thanks']} considering Zion Tech Group as a partner. "
            f"We've built successful partnerships with companies of all sizes and I believe "
            f"there's genuine mutual value for both our organizations.\n\n"
            f"Our partnership programs:\n"
            f"• 🤝 Reseller & affiliate partnerships\n"
            f"• 🏷️ White-label AI/IT services\n"
            f"• 🔗 Technology integration partnerships\n"
            f"• 📢 Co-marketing collaborations\n"
            f"• 🎓 Training & certification programs\n\n"
            f"I'd love to explore this with you. When works best for a 30-minute call?\n\n"
            f"{greetings['closing']}\nKleber Garcia Alcatrao"
        ),
        "meeting_request": (
            f"{greeting}\n\n"
            f"{greetings['thanks']} the meeting request. I'd be happy to connect.\n\n"
            f"Here's my availability for the coming week:\n"
            f"• Monday – Wednesday: 10 AM – 5 PM EST\n"
            f"• Thursday – Friday: 9 AM – 4 PM EST\n"
            f"(Call +1 302 464 0950 for earlier/later slots)\n\n"
            f"Which day and time works best for you? I'll send a calendar invite.\n\n"
            f"{greetings['closing']}\nKleber Garcia Alcatrao"
        ),
        "media_press": (
            f"{greeting}\n\n"
            f"{greetings['thanks']} reaching out. I'd be happy to contribute to your article.\n\n"
            f"Here's what I can share:\n"
            f"• Zion Tech Group company overview and vision\n"
            f"• AI industry trends and our perspective\n"
            f"• Case studies from our 1,168+ service deployments\n"
            f"• Expert commentary on AI/IT/cloud trends\n\n"
            f"For scheduling, please reply with your preferred date/time, or book directly at "
            f"https://zion-support.github.io\n\n"
            f"{greetings['closing']}\nKleber Garcia Alcatrao"
        ),
        "information_request": (
            f"{greeting}\n\n"
            f"{greetings['thanks']} your interest in Zion Tech Group.\n\n"
            f"We offer 1,168+ services across 10 categories:\n"
            f"🧠 AI Services | 🖥️ IT Services | ☁️ Cloud Services\n"
            f"🔐 Security Services | 📊 Data Analytics | 🤖 Automation\n"
            f"🚀 Micro-SaaS | ⚙️ DevOps | ⛓️ Blockchain | 📡 IoT\n\n"
            f"Pricing starts from $9/mo. Enterprise deployments from $99/mo.\n"
            f"Free consultations available.\n\n"
            f"Explore everything at https://zion-support.github.io\n\n"
            f"{greetings['closing']}\nKleber Garcia Alcatrao"
        ),
        "job_inquiry": (
            f"{greeting}\n\n"
            f"{greetings['thanks']} your interest in joining Zion Tech Group.\n\n"
            f"We're always looking for talented individuals. Please send your resume to "
            f"kleber@ziontechgroup.com with the subject 'Job Application - [Position]'.\n\n"
            f"Currently we're interested in:\n"
            f"• Full-stack developers (React, Python, Next.js)\n"
            f"• AI/ML engineers\n"
            f"• DevOps/SRE specialists\n"
            f"• Technical writers\n\n"
            f"{greetings['closing']}\nKleber Garcia Alcatrao"
        ),
        "thank_you": (
            f"{greeting}\n\n"
            f"You're very welcome! It's been a pleasure working with you.\n\n"
            f"If there's anything else we can help with, don't hesitate to reach out.\n\n"
            f"{greetings['closing']}\nKleber Garcia Alcatrao"
        ),
        "spam": None,  # No draft for spam
    }

    body = drafts.get(intent_key)
    if body is None:
        body = (
            f"{greeting}\n\n"
            f"{greetings['thanks']} reaching out to Zion Tech Group.\n\n"
            f"I've received your message about '{subj}' and will review it carefully. "
            f"How can we best help you?\n\n"
            f"Explore 1,168+ services at https://zion-support.github.io\n\n"
            f"{greetings['closing']}\nKleber Garcia Alcatrao\n"
            f"📧 kleber@ziontechgroup.com\n📞 +1 302 464 0950"
        )

    # Score the draft quality
    quality = DraftQualityScorer.score(body, email_data)

    # Determine auto-action
    auto = AutoActionEngine.determine_action(
        email_data,
        {"intent": intent_key},
        scoring,
        memory,
        lang
    )

    # Build escalation info
    escalation = EscalationRouter.route(email_data, sentiment, intent)

    # Meeting info
    meeting_info = meeting if meeting["has_meeting_request"] else None

    return {
        "subject": f"Re: {subj}",
        "body": body,
        "intent": intent_key,
        "intent_confidence": intent["confidence"],
        "sentiment": sentiment["primary"],
        "sentiment_tone": sentiment["tone_recommendation"],
        "language": lang,
        "company": company,
        "relationship_tier": tier,
        "sender_known": ctx["known"],
        "reply_all": reply_all["reply_all"],
        "reply_all_confidence": reply_all["confidence"],
        "needs_followup": followup["needed"],
        "followup_days": followup["days"],
        "followup_type": followup["type"],
        "scoring": scoring,
        "auto_action": auto,
        "escalation": escalation,
        "meeting_info": meeting_info,
        "draft_quality": quality,
        "thread_id": compute_thread_id(email_data),
    }


# ─── 10. FEEDBACK LOOP ───

def record_feedback(email_subject: str, sender: str, field: str,
                    old_value: str, new_value: str):
    """Record human feedback to improve future drafts."""
    feedback = []
    if FEEDBACK_FILE.exists():
        try:
            feedback = json.loads(FEEDBACK_FILE.read_text())
        except: pass
    feedback.append({
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "sender": sender,
        "subject": email_subject,
        "field": field,
        "old_value": old_value,
        "new_value": new_value,
    })
    FEEDBACK_FILE.write_text(json.dumps(feedback, indent=2))


def get_feedback_stats() -> Dict:
    """Get feedback statistics for improvement tracking."""
    if not FEEDBACK_FILE.exists():
        return {"total": 0, "fields": {}, "recent": []}
    try:
        feedback = json.loads(FEEDBACK_FILE.read_text())
    except:
        return {"total": 0, "fields": {}, "recent": []}

    fields = {}
    for f in feedback:
        field = f.get("field", "unknown")
        fields[field] = fields.get(field, 0) + 1

    return {
        "total": len(feedback),
        "fields": fields,
        "recent": feedback[-5:]
    }


# ─── 11. GMAIL CONNECTION (enhanced) ───

GMAIL_HOST = "imap.gmail.com"
GMAIL_PORT = 993

def connect_gmail():
    if not CONFIG_FILE.exists():
        print("❌ No credentials. Run: python3 email-v6.py --setup"); return None
    creds = json.loads(CONFIG_FILE.read_text())
    try:
        mail = imaplib.IMAP4_SSL(GMAIL_HOST, GMAIL_PORT)
        mail.login(creds["email"], creds.get("password", ""))
        return mail
    except Exception as e:
        print(f"❌ Auth failed: {e}"); return None

def fetch_emails(mail, limit=10):
    mail.select("INBOX")
    since = (datetime.now() - timedelta(days=30)).strftime("%d-%b-%Y")
    status, msgs = mail.search(None, f'(SINCE {since})')
    if status != "OK": return []
    eids = msgs[0].split()[-limit:]
    emails = []
    for eid in reversed(eids):
        status, data = mail.fetch(eid, "(RFC822)")
        if status != "OK": continue
        msg = email.message_from_bytes(data[0][1])
        subject = ""
        if msg["Subject"]:
            for part, enc in decode_header(msg["Subject"]):
                subject += part.decode(enc or "utf-8", errors="replace") if isinstance(part, bytes) else part
        from_addr = msg.get("From", "")
        m = re.match(r'^(.*?)\s*<(.+?)>$', from_addr)
        from_name = m.group(1).strip().strip('"') if m else from_addr
        from_email = m.group(2) if m else from_addr
        body = ""
        if msg.is_multipart():
            for part in msg.walk():
                if part.get_content_type() == "text/plain":
                    body = part.get_payload(decode=True).decode(part.get_content_charset() or "utf-8", errors="replace")[:3000]; break
        else:
            body = msg.get_payload(decode=True).decode(msg.get_content_charset() or "utf-8", errors="replace")[:3000]
        date_str = msg.get("Date", "")
        try: email_date = email.utils.parsedate_to_datetime(date_str) if date_str else datetime.now()
        except: email_date = datetime.now()
        emails.append({
            "id": eid.decode(), "from": from_email, "from_name": from_name or from_email,
            "to": msg.get("To",""), "cc": msg.get("Cc",""), "subject": subject, "body": body,
            "date": email_date.isoformat(),
            "in_reply_to": msg.get("In-Reply-To", ""),
            "references": msg.get("References", ""),
        })
    return emails


# ─── 12. DEMO MODE ───

def run_demo():
    """Run comprehensive demo with diverse test emails."""
    memory = ConversationMemory()

    demo_emails = [
        {
            "from": "john.smith@enterprise.com", "from_name": "John Smith",
            "subject": "RFP: AI Document Processing — Enterprise Deployment",
            "body": "Hi Kleber, We're evaluating AI document processing solutions. Our budget is approved for $50K-$100K annually. Can you provide a proposal by Friday? Our CTO Jane Doe is copied on this email. Best, John Smith VP of Technology, Enterprise Corp",
            "to": "kleber@ziontechgroup.com", "cc": "jane.doe@enterprise.com",
            "date": datetime.now(timezone.utc).isoformat(),
            "in_reply_to": "", "references": "",
        },
        {
            "from": "sarah.jones@startup.io", "from_name": "Sarah Jones",
            "subject": "Urgent: Production API Down — Need Immediate Help",
            "body": "Kleber, Our production API is down and we're losing $10K/hour. We think it's a database connection issue. This is critical — we need help ASAP. Sarah CTO, Startup.io",
            "to": "kleber@ziontechgroup.com", "cc": "",
            "date": datetime.now(timezone.utc).isoformat(),
            "in_reply_to": "", "references": "",
        },
        {
            "from": "angry.customer@client.com", "from_name": "Robert Williams",
            "subject": "Complaint: Service Not as Described — Want Refund",
            "body": "Kleber, I'm extremely disappointed with the service we received. The AI model accuracy is nowhere near what was promised. We've wasted 3 months and $25K. I want a full refund or I'm taking legal action. This is unacceptable. Robert Williams CEO, Client Corp",
            "to": "kleber@ziontechgroup.com", "cc": "legal@client.com",
            "date": datetime.now(timezone.utc).isoformat(),
            "in_reply_to": "", "references": "",
        },
        {
            "from": "reporter@technews.com", "from_name": "Emily Chen",
            "subject": "Interview Request: AI Industry Trends Article",
            "body": "Hi Kleber, I'm a reporter at TechNews working on an article about AI industry trends. Would you be available for a 30-minute interview? The article publishes next Friday. Best, Emily Chen Senior Reporter, TechNews",
            "to": "kleber@ziontechgroup.com", "cc": "",
            "date": datetime.now(timezone.utc).isoformat(),
            "in_reply_to": "", "references": "",
        },
        {
            "from": "mike.partner@bigtech.com", "from_name": "Mike Johnson",
            "subject": "Partnership Opportunity — White-Label AI Services",
            "body": "Hi Kleber, I lead partnerships at BigTech. We're looking for AI service providers to white-label for our enterprise clients. Are you available for a call next week? Best, Mike Johnson Head of Partnerships, BigTech Inc.",
            "to": "kleber@ziontechgroup.com", "cc": "team@bigtech.com",
            "date": datetime.now(timezone.utc).isoformat(),
            "in_reply_to": "", "references": "",
        },
        {
            "from": "maria.garcia@startup.es", "from_name": "María García",
            "subject": "Hola — Necesito información sobre sus servicios de IA",
            "body": "Hola Kleber, Estoy interesada en sus servicios de inteligencia artificial para nuestra empresa. ¿Podría enviarme información sobre precios y capacidades? Gracias por su tiempo. Saludos cordiales, María García CEO, Startup España",
            "to": "kleber@ziontechgroup.com", "cc": "",
            "date": datetime.now(timezone.utc).isoformat(),
            "in_reply_to": "", "references": "",
        },
        {
            "from": "crypto.scam@spam.com", "from_name": "Crypto Winner",
            "subject": "CONGRATULATIONS! You Won $1,000,000 in Crypto!",
            "body": "Click here to win big! Make money fast with crypto investment! Limited time offer! Act now! Free lottery entry! Send your bank details to claim your prize!",
            "to": "kleber@ziontechgroup.com", "cc": "",
            "date": datetime.now(timezone.utc).isoformat(),
            "in_reply_to": "", "references": "",
        },
    ]

    print("=" * 75)
    print("  ZION TECH GROUP — Email Intelligence Engine v6.0")
    print("  Case-by-Case Smart Responder with Multi-Signal Scoring")
    print("=" * 75)

    results = []
    for i, em in enumerate(demo_emails, 1):
        # Record in memory
        memory.record_email(em["from"], em["from_name"], em["subject"],
                           "general", "medium", "neutral", "processed")

        # Score with multi-signal engine
        scoring = SmartScorer.calculate(em, memory)

        # Generate smart draft
        draft = generate_draft_v6(em, memory, scoring)
        results.append({"email": em, "draft": draft})

        # Display
        tier = draft["relationship_tier"]
        tier_icon = {"vip":"⭐","trusted":"🔵","familiar":"🟢","acquaintance":"🟡","new":"⚪"}[tier]
        quality_icon = "✅" if draft["draft_quality"]["quality_score"] >= 60 else "⚠️"
        action_icon = "🤖" if not draft["auto_action"]["requires_approval"] else "👤"

        print(f"\n{'─'*75}")
        print(f"  EMAIL {i}/{len(demo_emails)}  |  Score: {draft['scoring']['total_score']}/100 ({draft['scoring']['category']})")
        print(f"{'─'*75}")
        print(f"  From:      {em['from_name']} <{em['from']}>")
        print(f"  Company:   {draft['company']}")
        print(f"  Subject:   {em['subject'][:55]}")
        print(f"  Language:  {draft['language'].upper()}")
        print(f"  Memory:    {tier_icon} {tier} ({'known' if draft['sender_known'] else 'new'})")
        print(f"  Intent:    {draft['intent']} ({draft['intent_confidence']*100:.0f}% confidence)")
        print(f"  Sentiment: {draft['sentiment']} — {draft['sentiment_tone'][:40]}")
        print(f"  Reply-All: {'YES' if draft['reply_all'] else 'NO'} ({draft['reply_all_confidence']*100:.0f}% confidence)")
        print(f"  Quality:   {quality_icon} {draft['draft_quality']['quality_score']}/100 ({draft['draft_quality']['quality_label']})")
        print(f"  Action:    {action_icon} {draft['auto_action']['action_label']}")
        print(f"  Auto:      {draft['auto_action']['explanation']}")

        if draft['escalation']['urgency'] != 'normal':
            print(f"  🚨 Escalation: {draft['escalation']['urgency'].upper()} — {draft['escalation']['flag_color']} flag")
            for step in draft['escalation']['action_chain'][:3]:
                print(f"     {step}")

        if draft.get('meeting_info'):
            mi = draft['meeting_info']
            print(f"  📅 Meeting: {mi['meeting_type']} | {mi['duration_minutes']}min | Days: {', '.join(mi.get('proposed_days', ['TBD']))}")

        if draft['needs_followup']:
            print(f"  ⏰ Follow-up: {draft['followup_type']} in {draft['followup_days']} day(s)")

        print(f"\n  Draft Preview (first 3 lines):")
        for line in draft['body'].split('\n')[:3]:
            print(f"    {line[:65]}")

    # Summary
    stats = memory.get_stats()
    print(f"\n{'='*75}")
    print(f"  SESSION SUMMARY")
    print(f"{'='*75}")
    print(f"  Emails processed: {len(results)}")
    print(f"  Conversations tracked: {stats['conversations']}")

    categories = {}
    for r in results:
        cat = r['draft']['scoring']['category']
        categories[cat] = categories.get(cat, 0) + 1
    print(f"  Priority distribution:")
    for cat, count in sorted(categories.items()):
        print(f"    {cat}: {count}")

    auto_count = sum(1 for r in results if not r['draft']['auto_action']['requires_approval'])
    print(f"  Auto-actions: {auto_count} | Human review: {len(results) - auto_count}")

    avg_quality = sum(r['draft']['draft_quality']['quality_score'] for r in results) / len(results)
    print(f"  Avg draft quality: {avg_quality:.0f}/100")

    reply_all_count = sum(1 for r in results if r['draft']['reply_all'])
    print(f"  Reply-all detected: {reply_all_count}")

    memory.close()
    return results


# ─── 13. SETUP WIZARD ───

def run_setup():
    print("=" * 75)
    print("  Email v6.0 — Gmail Setup Wizard")
    print("=" * 75)
    print("\n  You need a Gmail App Password.")
    print("  1. Go to https://myaccount.google.com/security")
    print("  2. Enable 2-Step Verification")
    print("  3. Go to https://myaccount.google.com/apppasswords")
    print("  4. Select 'Mail' → generate → copy password\n")

    email_addr = input("  Your Gmail address: ").strip()
    if not email_addr:
        print("❌ No email provided."); return

    password = input("  Gmail App Password: ").strip().replace(" ", "")
    creds = {"email": email_addr, "password": password, "configured_at": datetime.now(timezone.utc).isoformat()}
    CONFIG_FILE.parent.mkdir(parents=True, exist_ok=True)
    CONFIG_FILE.write_text(json.dumps(creds, indent=2))
    print(f"\n  ✅ Saved to {CONFIG_FILE}")

    print("  Testing connection...")
    mail = connect_gmail()
    if mail:
        mail.select("INBOX")
        s, m = mail.search(None, "ALL")
        count = len(m[0].split()) if s == "OK" else 0
        print(f"  ✅ Connected! Inbox: {count} emails")
        mail.logout()
    else:
        print("  ❌ Connection failed. Check credentials.")


# ─── 14. LIVE INBOX MODE ───

def run_inbox(limit=10):
    mail = connect_gmail()
    if not mail: sys.exit(1)
    emails = fetch_emails(mail, limit)
    mail.close()
    memory = ConversationMemory()

    print(f"\n📬 Processing {len(emails)} emails with v6 intelligence...\n")

    for em in emails:
        memory.record_email(em["from"], em["from_name"], em["subject"],
                           "general", "medium", "neutral", "processed")
        scoring = SmartScorer.calculate(em, memory)
        draft = generate_draft_v6(em, memory, scoring)

        print(f"  [{draft['scoring']['category']}] {em['from_name'][:25]:25} | {em['subject'][:40]}")
        print(f"    Score: {draft['scoring']['total_score']}/100 | Intent: {draft['intent']} | Quality: {draft['draft_quality']['quality_score']}/100")
        print(f"    Action: {draft['auto_action']['action_label']}")
        if draft['reply_all']:
            print(f"    📨 Reply-All: YES")

    memory.close()


# ─── MAIN ───

if __name__ == "__main__":
    if "--setup" in sys.argv:
        run_setup()
    elif "--demo" in sys.argv or len(sys.argv) == 1:
        run_demo()
    elif "--inbox" in sys.argv:
        idx = sys.argv.index("--inbox")
        limit = int(sys.argv[idx + 1]) if idx + 1 < len(sys.argv) else 10
        run_inbox(limit)
    elif "--stats" in sys.argv:
        memory = ConversationMemory()
        stats = memory.get_stats()
        print(f"\n📊 Email Memory Stats")
        print(f"  Conversations: {stats['conversations']}")
        print(f"  Emails: {stats['emails']}")
        for name, count, score in stats['top']:
            print(f"  • {name[:30]:30} {count} emails (score: {score})")
        memory.close()
    elif "--feedback-stats" in sys.argv:
        fb = get_feedback_stats()
        print(f"\n📈 Feedback Learning Stats")
        print(f"  Total feedback entries: {fb['total']}")
        for field, count in fb['fields'].items():
            print(f"  • {field}: {count} corrections")
        memory.close()
    else:
        print(__doc__)
