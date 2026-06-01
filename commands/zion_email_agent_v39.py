#!/usr/bin/env python3
"""
Zion Tech Group — Email Agent V39: Multi-Agent Email Intelligence
=================================================================
V39 breakthrough: Multiple specialized AI agents collaborate to handle
each email, with a Lead Orchestrator coordinating their work.

Architecture:
  Lead Orchestrator → delegates to specialized sub-agents:
    1. Intent Agent      — deep intent & context analysis
    2. Sentiment Agent   — emotional intelligence & tone matching
    3. Response Agent    — composes the actual reply
    4. Quality Agent     — reviews and improves the response
    5. Compliance Agent  — checks legal/compliance requirements
    6. Reply-All Agent   — manages recipient handling
    7. Follow-Up Agent   — decides timing and follow-up strategy

Each agent reports back to the Lead, which makes the final decision.
"""
import os, re, json, logging
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple, Any
from dataclasses import dataclass, field
from enum import Enum

logging.basicConfig(level=logging.INFO, format='%(asctime)s [%(levelname)s] %(message)s')
logger = logging.getLogger(__name__)

class Intent(Enum):
    SALES="sales_inquiry"; SUPPORT="support_request"; PARTNERSHIP="partnership"
    COMPLAINT="complaint"; FOLLOWUP="follow_up"; MEETING="meeting_request"
    SPAM="spam"; REFUND="refund"; TECHNICAL="technical"; BILLING="billing"
    ESCALATION="escalation_request"; GENERAL="general"

class Urgency(Enum):
    CRITICAL="critical"; HIGH="high"; MEDIUM="medium"; LOW="low"

class Tone(Enum):
    FORMAL="formal"; FRIENDLY="friendly"; TECHNICAL="technical"
    EMPATHETIC="empathetic"; URGENT="urgent"

class ActionType(Enum):
    REPLY_NOW="reply_now"; REPLY_ALL="reply_all"; WAIT="wait"
    ESCALATE="escalate"; SCHEDULE_FOLLOWUP="schedule_followup"
    AUTO_RESOLVE="auto_resolve"; IGNORE="ignore"

# ─── Specialized Agents ──────────────────────────────────────────────────────

class IntentAgent:
    """Deep intent and context analysis specialist."""
    
    PATTERNS = {
        Intent.SALES: [r'pricing|cost|quote|proposal|how much|package|plan|demo|trial|interested in|looking for|want to buy|ready to start'],
        Intent.SUPPORT: [r'help|issue|problem|error|bug|broken|not working|support|assist|troubleshoot|fix|resolve'],
        Intent.PARTNERSHIP: [r'partner|collaborat|joint venture|reseller|affiliate|integration|work together|strategic|alliance'],
        Intent.COMPLAINT: [r'unhappy|disappointed|frustrat|angry|cancel|refund|terrible|worst|complaint|dissatisfied|unacceptable'],
        Intent.MEETING: [r'meet|call|zoom|schedule|calendar|available|book|reschedule|let\'s discuss|hop on a call'],
        Intent.REFUND: [r'refund|money back|cancel subscription|stop billing|chargeback|unauthorized charge'],
        Intent.TECHNICAL: [r'api|integration|documentation|sdk|code|deploy|server|ssl|dns|technical|architecture'],
        Intent.BILLING: [r'invoice|payment|charge|billing|receipt|overdue|past due|credit card'],
        Intent.ESCALATION: [r'escalat|manager|supervisor|complaint|legal|sue|attorney|regulatory'],
        Intent.SPAM: [r'viagra|crypto|lottery|prince|nigerian|click here now|free money|earn \$\d+/day'],
    }
    
    def analyze(self, email: Dict) -> Dict:
        text = (email.get('subject', '') + ' ' + email.get('body', '')).lower()
        scores = {}
        for intent, patterns in self.PATTERNS.items():
            score = sum(len(re.findall(p, text)) for p in patterns)
            if score > 0:
                scores[intent] = score
        
        if not scores:
            return {"intent": Intent.GENERAL, "confidence": 0.5, "scores": {}}
        
        best = max(scores, key=scores.get)
        total = sum(scores.values())
        confidence = scores[best] / total if total > 0 else 0
        
        return {"intent": best, "confidence": confidence, "scores": {k.value: v for k, v in scores.items()}}


class SentimentAgent:
    """Emotional intelligence and tone matching specialist."""
    
    def analyze(self, email: Dict) -> Dict:
        text = email.get('body', '').lower()
        
        # Sentiment scoring
        positive = sum(1 for w in ['thank','great','excellent','love','appreciate','amazing','perfect','wonderful','pleased'] if w in text)
        negative = sum(1 for w in ['angry','frustrated','terrible','worst','unacceptable','furious','disappointed','unhappy','annoyed'] if w in text)
        
        # Urgency detection
        urgency_score = 0
        for w in ['urgent','asap','emergency','critical','immediately','right now']:
            if w in text: urgency_score += 2
        for w in ['today','important','deadline','due','time-sensitive','priority']:
            if w in text: urgency_score += 1
        
        # Sender relationship signals
        relationship_signals = {
            'new_customer': bool(re.search(r'first time|just signed up|new customer|just started', text)),
            'long_term': bool(re.search(r'been a customer|for years|long time|loyal|since \d{4}', text)),
            'at_risk': bool(re.search(r'considering|cancel|switching|alternative|competitor', text)),
            'expansion': bool(re.search(r'expand|upgrade|additional|more users|new team|enterprise', text)),
        }
        
        # Determine sentiment label
        if positive > negative + 2: sentiment = "positive"
        elif negative > positive + 2: sentiment = "negative"
        elif positive > 0 and negative > 0: sentiment = "mixed"
        else: sentiment = "neutral"
        
        # Determine urgency
        if urgency_score >= 4: urgency = Urgency.CRITICAL
        elif urgency_score >= 2: urgency = Urgency.HIGH
        elif urgency_score >= 1: urgency = Urgency.MEDIUM
        else: urgency = Urgency.LOW
        
        # Suggest tone
        if sentiment == "negative" or urgency == Urgency.CRITICAL:
            suggested_tone = Tone.EMPATHETIC
        elif relationship_signals.get('long_term') or relationship_signals.get('expansion'):
            suggested_tone = Tone.FRIENDLY
        elif urgency == Urgency.HIGH:
            suggested_tone = Tone.URGENT
        else:
            suggested_tone = Tone.FRIENDLY
        
        return {
            "sentiment": sentiment, "urgency": urgency,
            "suggested_tone": suggested_tone,
            "relationship_signals": relationship_signals,
            "score": {"positive": positive, "negative": negative, "urgency": urgency_score}
        }


class ResponseAgent:
    """Composes the actual email response."""
    
    SIGNATURE = "\n---\nZion Tech Group | AI & IT Solutions\n kleber@ziontechgroup.com | +1 302 464 0950\n 364 E Main St STE 1008, Middletown DE 19709\n https://ziontechgroup.com"
    
    def compose(self, email: Dict, intent: Intent, tone: Tone, sentiment: str, thread_resolved: bool) -> str:
        sender = email.get('from', '')
        name = self._extract_name(sender)
        subject = email.get('subject', '')
        
        parts = []
        
        # Greeting
        if tone == Tone.FORMAL:
            parts.append(f"Dear {name},")
        elif tone == Tone.EMPATHETIC:
            parts.append(f"Hi {name},")
        else:
            parts.append(f"Hi {name}!")
        parts.append("")
        
        # Opening based on sentiment
        if sentiment == "negative":
            parts.append("Thank you for reaching out, and I sincerely apologize for any frustration this has caused.")
        elif sentiment == "positive":
            parts.append("Thank you for your kind words! It's great to hear from you.")
        else:
            parts.append("Thank you for reaching out to Zion Tech Group.")
        parts.append("")
        
        # Body based on intent
        body = self._intent_body(intent, tone)
        parts.append(body)
        parts.append("")
        
        # CTA
        cta = self._intent_cta(intent)
        if cta:
            parts.append(cta)
            parts.append("")
        
        # Closing
        if tone == Tone.FORMAL:
            parts.append("Best regards,")
        elif tone == Tone.EMPATHETIC:
            parts.append("Warm regards,")
        else:
            parts.append("Cheers,")
        parts.append("Zion Tech Group Team")
        parts.append(self.SIGNATURE)
        
        return "\n".join(parts)
    
    def _extract_name(self, email: str) -> str:
        if '@' in email:
            local = email.split('@')[0]
            name = re.sub(r'[._]', ' ', local).title()
            if len(name) > 2 and not name.isdigit():
                return name
        return "there"
    
    def _intent_body(self, intent: Intent, tone: Tone) -> str:
        bodies = {
            Intent.SALES: "We'd love to learn more about your needs and show you how our AI and IT solutions can help. I'd recommend starting with a free 15-minute consultation where we can discuss your specific requirements and provide a custom proposal with transparent pricing.",
            Intent.SUPPORT: "Our technical team has been notified and is actively investigating. You can track the status at https://ziontechgroup.com/support. We'll provide an update within 2 hours.",
            Intent.COMPLAINT: "I take this very seriously and want to make this right. I've already escalated this to our customer success team, and you'll receive a personal follow-up within 2 hours. In the meantime, please don't hesitate to call me directly at +1 302 464 0950.",
            Intent.PARTNERSHIP: "We're always excited about partnership opportunities! Our program includes revenue sharing, co-marketing, technical integration support, and dedicated partner management.",
            Intent.MEETING: "I'd be happy to meet! Here are some available slots:\n• Tue 2:00-3:00 PM EST\n• Wed 10:00-11:00 AM EST\n• Thu 3:00-4:00 PM EST\n\nOr book directly at https://ziontechgroup.com/consultation",
            Intent.REFUND: "We've received your refund request and are processing it immediately. Refunds typically complete within 3-5 business days. You'll receive a confirmation email once it's done.",
            Intent.TECHNICAL: "Our engineering team has been notified. For immediate help: https://ziontechgroup.com/docs | API Reference: https://ziontechgroup.com/api-docs. A senior engineer will respond within 4 hours.",
            Intent.BILLING: "I've forwarded your billing inquiry to our finance team. You can also view all invoices and manage your account at https://ziontechgroup.com/client-portal.",
        }
        return bodies.get(intent, "I've received your message and will respond in detail shortly. For urgent matters, please call +1 302 464 0950.")
    
    def _intent_cta(self, intent: Intent) -> str:
        ctas = {
            Intent.SALES: "→ Schedule free consultation: https://ziontechgroup.com/consultation",
            Intent.MEETING: "→ Book directly: https://ziontechgroup.com/consultation",
            Intent.PARTNERSHIP: "→ Learn about partnerships: https://ziontechgroup.com/partners",
            Intent.SUPPORT: "→ Track status: https://ziontechgroup.com/support",
            Intent.TECHNICAL: "→ Docs: https://ziontechgroup.com/docs | API: https://ziontechgroup.com/api-docs",
        }
        return ctas.get(intent, "")


class QualityAgent:
    """Reviews and improves response quality."""
    
    CHECKS = [
        ("min_length", lambda r: len(r) >= 100, "Response too short"),
        ("max_length", lambda r: len(r) <= 3000, "Response too long"),
        ("no_placeholders", lambda r: '{' not in r and '}' not in r, "Contains unresolved template variables"),
        ("has_greeting", lambda r: bool(re.search(r'(Dear|Hi|Hello)', r)), "Missing greeting"),
        ("has_closing", lambda r: bool(re.search(r'(regards|Cheers|Warm)', r, re.I)), "Missing closing"),
        ("has_signature", lambda r: 'Zion Tech Group' in r, "Missing signature"),
        ("no_spam_triggers", lambda r: not any(w in r.lower() for w in ['click here now','act now','free money']), "Contains spam-like language"),
    ]
    
    def review(self, response: str, email: Dict) -> Dict:
        issues = []
        passed = []
        
        for name, check, msg in self.CHECKS:
            if check(response):
                passed.append(name)
            else:
                issues.append(msg)
        
        # Complaint-specific checks
        if 'apolog' in email.get('body', '').lower() or 'angry' in email.get('body', '').lower():
            if 'apolog' not in response.lower() and 'sorry' not in response.lower():
                issues.append("Complaint email — response should include apology")
        
        # Urgency checks
        if 'urgent' in email.get('body', '').lower():
            if 'immediately' not in response.lower() and 'right away' not in response.lower() and '2 hours' not in response.lower():
                issues.append("Urgent email — response should acknowledge urgency")
        
        score = len(passed) / len(self.CHECKS)
        
        return {
            "score": score,
            "passed": passed,
            "issues": issues,
            "approved": len(issues) == 0,
        }


class ComplianceAgent:
    """Checks legal and compliance requirements."""
    
    def check(self, email: Dict, response: str) -> Dict:
        issues = []
        warnings = []
        body = email.get('body', '').lower()
        
        # Legal threats
        if any(w in body for w in ['sue','lawsuit','attorney','legal action','regulatory']):
            issues.append("⚠️ LEGAL THREAT DETECTED — do not send automated response, escalate to legal team")
        
        # Data privacy
        if any(w in body for w in ['gdpr','data deletion','right to be forgotten','data privacy']):
            warnings.append("GDPR/data privacy request — verify data handling procedures")
        
        # Financial commitments
        if re.search(r'\$[\d,]+', response) and 'guarantee' in response.lower():
            warnings.append("Financial commitment in response — needs approval")
        
        # Confidentiality
        if any(w in body for w in ['confidential','nda','non-disclosure','proprietary']):
            warnings.append("Confidential information — ensure NDA compliance")
        
        return {
            "approved": len(issues) == 0,
            "issues": issues,
            "warnings": warnings,
        }


class ReplyAllAgent:
    """Manages recipient handling and reply-all decisions."""
    
    def determine(self, email: Dict, thread: List[Dict] = None) -> Dict:
        to_list = email.get('to', [])
        cc_list = email.get('cc', [])
        sender = email.get('from', '')
        
        all_recipients = list(set(to_list + cc_list))
        agent_emails = ['kleber@ziontechgroup.com', 'noreply@ziontechgroup.com', 'automated@ziontechgroup.com']
        all_recipients = [r.strip() for r in all_recipients if r.strip().lower() not in agent_emails]
        
        # Validate addresses
        valid, invalid = [], []
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        for addr in all_recipients:
            (valid if re.match(pattern, addr) else invalid).append(addr)
        
        # Decision logic
        recipient_count = len(valid)
        
        if recipient_count == 0:
            reply_all = False
            decision = "No valid recipients besides sender"
        elif recipient_count == 1:
            # Single recipient — check if they sent it to us and CC'd others
            if sender in valid:
                reply_all = False
                decision = "Single recipient (sender), reply directly"
            else:
                reply_all = len(to_list) > 1 or len(cc_list) > 1
                decision = f"Single valid recipient from {len(to_list)} To + {len(cc_list)} CC"
        else:
            # Multiple recipients — reply all by default
            reply_all = True
            decision = f"Multiple recipients ({recipient_count}) — reply all"
        
        # Thread-aware: if we've been replying all, continue
        if thread:
            our_msgs = [m for m in thread if m.get('from','').lower().startswith('kleber@ziontechgroup.com')]
            if our_msgs:
                last_our = our_msgs[-1]
                if last_our.get('cc'):
                    reply_all = True
                    decision += " (continuing reply-all from thread)"
        
        return {
            "reply_all": reply_all,
            "recipients": valid,
            "invalid": invalid,
            "decision": decision,
            "to": [sender] if not reply_all else valid,
            "cc": valid[1:] if reply_all else [],
        }


class FollowUpAgent:
    """Decides follow-up timing and strategy."""
    
    def decide(self, email: Dict, intent: Intent, urgency: Urgency, sentiment: str) -> Dict:
        # Don't follow up on resolved or ignored
        if intent in [Intent.SPAM]:
            return {"needed": False, "reason": "No follow-up needed"}
        
        # Determine timing based on urgency and intent
        timing = {
            (Intent.COMPLAINT, Urgency.CRITICAL): 2,      # 2 hours
            (Intent.COMPLAINT, Urgency.HIGH): 6,          # 6 hours
            (Intent.SALES, Urgency.HIGH): 24,              # 1 day
            (Intent.SALES, Urgency.MEDIUM): 72,            # 3 days
            (Intent.SALES, Urgency.LOW): 168,              # 7 days
            (Intent.PARTNERSHIP, Urgency.HIGH): 48,        # 2 days
            (Intent.PARTNERSHIP, Urgency.MEDIUM): 168,     # 7 days
            (Intent.MEETING, Urgency.HIGH): 24,            # 1 day
        }
        
        hours = timing.get((intent, urgency), 48)  # Default 48 hours
        
        # Adjust for sentiment
        if sentiment == "negative":
            hours = max(hours // 2, 2)  # Faster follow-up for negative
        elif sentiment == "positive":
            hours = min(hours * 2, 336)  # Slower for positive (max 2 weeks)
        
        followup_time = datetime.now() + timedelta(hours=hours)
        
        return {
            "needed": True,
            "hours": hours,
            "scheduled_at": followup_time.isoformat(),
            "reason": f"Follow-up in {hours}h due to {intent.value} + {urgency.value} urgency + {sentiment} sentiment",
            "template": self._followup_template(intent, hours),
        }
    
    def _followup_template(self, intent, hours):
        if intent == Intent.SALES:
            return f"Following up on our conversation. Would you like to schedule a brief call to discuss your needs?"
        if intent == Intent.MEETING:
            return f"Just checking if any of the proposed meeting times work for you."
        if intent == Intent.SUPPORT:
            return f"Checking in on the support issue. Have you been able to resolve it?"
        return f"Following up on my previous message. Please let me know if you need anything."


# ─── Lead Orchestrator ──────────────────────────────────────────────────────

class ZionEmailAgentV39:
    """
    Multi-Agent Email Intelligence System.
    7 specialized agents collaborate to handle each email.
    """
    
    def __init__(self):
        self.intent_agent = IntentAgent()
        self.sentiment_agent = SentimentAgent()
        self.response_agent = ResponseAgent()
        self.quality_agent = QualityAgent()
        self.compliance_agent = ComplianceAgent()
        self.reply_all_agent = ReplyAllAgent()
        self.followup_agent = FollowUpAgent()
        self.processed = 0
        self.agent_log = []
    
    def process_email(self, email: Dict, thread: List[Dict] = None) -> Dict:
        """Full multi-agent processing pipeline."""
        self.processed += 1
        self.agent_log = []
        
        logger.info(f"\n{'='*60}")
        logger.info(f"📧 Email #{self.processed}: {email.get('id','unknown')}")
        logger.info(f"{'='*60}")
        
        # Agent 1: Intent Analysis
        intent_result = self.intent_agent.analyze(email)
        intent = intent_result["intent"]
        self.agent_log.append(f"🎯 IntentAgent: {intent.value} (conf: {intent_result['confidence']:.0%})")
        logger.info(f"  🎯 Intent: {intent.value} (confidence: {intent_result['confidence']:.0%})")
        
        # Agent 2: Sentiment Analysis
        sentiment_result = self.sentiment_agent.analyze(email)
        sentiment = sentiment_result["sentiment"]
        urgency = sentiment_result["urgency"]
        tone = sentiment_result["suggested_tone"]
        self.agent_log.append(f"😊 SentimentAgent: {sentiment} | {urgency.value} | tone: {tone.value}")
        logger.info(f"  😊 Sentiment: {sentiment} | Urgency: {urgency.value} | Tone: {tone.value}")
        
        for sig, val in sentiment_result.get("relationship_signals", {}).items():
            if val:
                logger.info(f"  📡 Signal: {sig}")
        
        # Agent 3: Reply-All Decision
        reply_result = self.reply_all_agent.determine(email, thread)
        reply_all = reply_result["reply_all"]
        self.agent_log.append(f"📤 ReplyAllAgent: reply_all={reply_all} ({reply_result['decision']})")
        logger.info(f"  📤 Reply-All: {reply_all} → {reply_result['recipients']}")
        
        # Agent 6: Follow-Up Decision
        followup_result = self.followup_agent.decide(email, intent, urgency, sentiment)
        logger.info(f"  📅 Follow-Up: {followup_result['reason']}")
        
        # Agent 4: Compose Response
        thread_resolved = False  # Would check thread history
        response = self.response_agent.compose(email, intent, tone, sentiment, thread_resolved)
        self.agent_log.append(f"✍️ ResponseAgent: {len(response)} chars composed")
        logger.info(f"  ✍️ Response composed ({len(response)} chars)")
        
        # Agent 5: Quality Review
        quality_result = self.quality_agent.review(response, email)
        self.agent_log.append(f"🔍 QualityAgent: score={quality_result['score']:.0%} | issues={len(quality_result['issues'])}")
        logger.info(f"  🔍 Quality: {quality_result['score']:.0%} ({len(quality_result['passed'])}/{len(quality_result['passed'])+len(quality_result['issues'])} checks passed)")
        if quality_result["issues"]:
            for issue in quality_result["issues"]:
                logger.warning(f"  ⚠️ Quality issue: {issue}")
        
        # Agent 6: Compliance Check
        compliance_result = self.compliance_agent.check(email, response)
        self.agent_log.append(f"⚖️ ComplianceAgent: approved={compliance_result['approved']}")
        if compliance_result["issues"]:
            for issue in compliance_result["issues"]:
                logger.error(f"  🚨 COMPLIANCE: {issue}")
        if compliance_result["warnings"]:
            for warn in compliance_result["warnings"]:
                logger.warning(f"  ⚠️ Compliance warning: {warn}")
        
        # Final Decision: Should we send?
        should_send = (
            compliance_result["approved"] and
            quality_result["score"] >= 0.7 and
            intent != Intent.SPAM
        )
        
        if not should_send and compliance_result["issues"]:
            final_action = ActionType.ESCALATE
        elif not should_send:
            final_action = ActionType.WAIT
        elif reply_all:
            final_action = ActionType.REPLY_ALL
        else:
            final_action = ActionType.REPLY_NOW
        
        self.agent_log.append(f"🎯 FINAL: {final_action.value}")
        logger.info(f"  🎯 FINAL DECISION: {final_action.value}")
        
        return {
            "email_id": email.get("id", ""),
            "agents": self.agent_log,
            "intent": intent.value,
            "urgency": urgency.value,
            "sentiment": sentiment,
            "tone": tone.value,
            "action": final_action.value,
            "reply_all": reply_all,
            "recipients": reply_result["recipients"],
            "response": response if should_send else "[WITHHELD — needs review]",
            "quality_score": quality_result["score"],
            "compliance_approved": compliance_result["approved"],
            "followup": {"needed": followup_result.get("needed", False), "hours": followup_result.get("hours")},
            "timestamp": datetime.now().isoformat(),
        }
    
    def process_batch(self, emails: List[Dict]) -> List[Dict]:
        return [self.process_email(e) for e in emails]


def run_demo():
    agent = ZionEmailAgentV39()
    
    emails = [
        {"id":"V39-001","from":"sarah@startup.com","to":["kleber@ziontechgroup.com"],
         "cc":["team@startup.com"],"subject":"Pricing for AI chatbot?",
         "body":"Hi, what's your pricing for an AI chatbot solution? We need something for our e-commerce site."},
        {"id":"V39-002","from":"vip@enterprise.com","to":["kleber@ziontechgroup.com"],  
         "subject":"URGENT: Production down",
         "body":"This is CRITICAL. Our production system has been down for 6 hours. We're losing $50K/hour. I need to speak to a manager IMMEDIATELY."},
        {"id":"V39-003","from":"partner@tech.co","to":["kleber@ziontechgroup.com"],
         "cc":["biz@tech.co","legal@tech.co"],"subject":"Partnership proposal",
         "body":"Hi, we'd like to explore a strategic partnership. We have 50 enterprise clients who could benefit from your AI platform. Can we set up a call?"},
        {"id":"V39-004","from":"angry@client.com","to":["kleber@ziontechgroup.com"],
         "subject":"This is unacceptable",
         "body":"I've been a customer for 3 years and this is the worst experience ever. Your support team hasn't responded in 5 days. I'm considering switching to a competitor."},
        {"id":"V39-005","from":"legal@firm.com","to":["kleber@ziontechgroup.com"],
         "subject":"GDPR Data Deletion Request",
         "body":"Under GDPR Article 17, we request immediate deletion of all personal data associated with our account. Please confirm within 72 hours."},
    ]
    
    results = agent.process_batch(emails)
    
    print(f"\n\n{'='*60}")
    print(f"V39 MULTI-AGENT DEMO: {len(results)} emails processed")
    print(f"{'=''='*60}")
    for r in results:
        status = "🚨" if r['action'] == 'escalate' else "✅" if r['action'].startswith('reply') else "⏸"
        print(f"  {status} {r['email_id']}: {r['intent']} | {r['action']} | QA: {r['quality_score']:.0%} | Reply-All: {r['reply_all']}")


if __name__ == "__main__":
    run_demo()
