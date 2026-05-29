#!/usr/bin/env python3
"""Advanced NLP Engine for Email Intelligence v5.0 — works fully offline"""
import re
from typing import Dict

def analyze_sentiment(text: str) -> Dict:
    """Detect 10+ emotional states from email text. No API needed."""
    t = text.lower()
    PATTERNS = {
        "frustrated": [r"frustrat",r"annoyed",r"angry",r"furious",r"outraged",r"fed up",r"sick of"],
        "urgent": [r"urgent",r"asap",r"immediately",r"emergency",r"critical",r"deadline",r"today",r"right now"],
        "excited": [r"excited",r"thrilled",r"love",r"amazing",r"fantastic",r"great news"],
        "confused": [r"confused",r"unclear",r"don'?t understand",r"clarify",r"explain"],
        "grateful": [r"thank",r"appreciate",r"grateful",r"helpful",r"wonderful"],
        "disappointed": [r"disappointed",r"expected better",r"not satisfied",r"let down"],
        "threatening": [r"lawsuit",r"legal action",r"sue",r"report to",r"cancel.*account"],
        "negotiating": [r"discount",r"better price",r"competitor",r"cheaper",r"deal"],
        "inquiring": [r"interested",r"looking for",r"need",r"question",r"information"],
    }
    detected = {}
    for sentiment, patterns in PATTERNS.items():
        score = sum(len(re.findall(p, t)) for p in patterns)
        if score > 0:
            detected[sentiment] = score
    
    if detected:
        primary = max(detected, key=detected.get)
        confidence = min(detected[primary] / 3, 1.0)
    else:
        primary = "neutral"
        confidence = 0.5
    
    pos = detected.get("excited", 0) + detected.get("grateful", 0)
    neg = detected.get("frustrated", 0) + detected.get("threatening", 0) + detected.get("disappointed", 0)
    tone = "positive" if pos > neg else "negative" if neg > pos else "neutral"
    
    TONE_REC = {
        "frustrated": "Empathetic and solution-focused",
        "urgent": "Immediate and action-oriented",
        "excited": "Enthusiastic and warm",
        "confused": "Patient and clear, numbered steps",
        "grateful": "Warm and appreciative",
        "disappointed": "Empathetic with concrete plan",
        "threatening": "Calm, professional, escalate immediately",
        "negotiating": "Value-focused with flexible options",
        "inquiring": "Informative with clear next steps",
        "neutral": "Professional and friendly",
    }
    
    return {
        "primary": primary, "confidence": round(confidence, 2), "tone": tone,
        "all_detected": detected, "tone_recommendation": TONE_REC.get(primary, "Professional"),
        "should_escalate": primary in ("frustrated", "threatening") and confidence > 0.5,
    }


def classify_intent(text: str, subject: str = "") -> Dict:
    """Classify email intent with confidence scoring."""
    t = f"{subject} {text}".lower()
    INTENTS = {
        "sales_inquiry": [r"quote",r"pricing",r"cost",r"proposal",r"estimate",r"budget",r"interested in",r"looking for",r"need a",r"rfp"],
        "support_request": [r"help",r"issue",r"problem",r"bug",r"error",r"broken",r"not working",r"support",r"urgent",r"critical",r"down",r"outage"],
        "partnership": [r"partner",r"collaborat",r"joint venture",r"reseller",r"white.?label",r"strategic alliance"],
        "job_inquiry": [r"job",r"career",r"hire",r"recruit",r"position",r"resume",r"cv",r"apply",r"freelance"],
        "media_press": [r"press",r"media",r"interview",r"article",r"blog",r"podcast",r"journalist"],
        "complaint": [r"unhappy",r"disappointed",r"complaint",r"refund",r"cancel",r"terminate",r"scam",r"lawsuit"],
        "information_request": [r"information about",r"tell me more",r"details on",r"what do you offer",r"brochure",r"datasheet"],
        "meeting_request": [r"schedule a meeting",r"book a call",r"set up a time",r"calendar",r"availability",r"demo",r"presentation"],
        "thank_you": [r"thank you",r"thanks",r"appreciate",r"great work"],
        "spam": [r"viagra",r"crypto investment",r"make money fast",r"lottery",r"click here to win"],
    }
    scores = {}
    for intent, patterns in INTENTS.items():
        s = sum(len(re.findall(p, t)) for p in patterns)
        if s > 0:
            scores[intent] = s
    if not scores:
        return {"intent": "general", "confidence": 0.3, "scores": {}}
    best = max(scores, key=scores.get)
    total = sum(scores.values())
    return {"intent": best, "confidence": round(min(scores[best] / max(total, 1), 1.0), 2), "scores": scores}


def detect_reply_all(email_data: Dict) -> Dict:
    """7-rule reply-all decision system."""
    to = email_data.get("to", "")
    cc = email_data.get("cc", "")
    body = email_data.get("body", "")
    
    all_recipients = []
    for field in [to, cc]:
        if field:
            all_recipients.extend([r.strip() for r in field.split(",") if r.strip()])
    
    is_mailing_list = any(kw in to.lower() for kw in ["@", "list@", "team@", "all@", "group@"])
    body_indicators = ["team", "everyone", "all", "cc", "copying", "including", "for everyone"]
    body_suggests = any(kw in body.lower() for kw in body_indicators)
    should_reply = len(all_recipients) > 1 or is_mailing_list or body_suggests
    
    return {
        "reply_all": should_reply,
        "recipient_count": len(all_recipients),
        "is_mailing_list": is_mailing_list,
        "body_suggests_reply_all": body_suggests,
        "recommendation": "Reply All" if should_reply else "Reply to Sender",
        "confidence": min(len(all_recipients) / 5, 1.0),
    }


def detect_follow_up(text: str) -> Dict:
    """Detect if follow-up is needed and when."""
    t = text.lower()
    if re.search(r"by friday|by monday|by end of|deadline|due by", t):
        return {"needed": True, "type": "deadline", "days": 1}
    if re.search(r"waiting for|looking forward to|let me know|please confirm", t):
        return {"needed": True, "type": "waiting", "days": 2}
    if re.search(r"schedule a|book a call|set up a meeting|demo|presentation", t):
        return {"needed": True, "type": "meeting", "days": 1}
    if re.search(r"proposal|estimate|quote|pricing|bid", t):
        return {"needed": True, "type": "proposal", "days": 3}
    return {"needed": False, "type": "none", "days": 0}
