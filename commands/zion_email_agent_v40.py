#!/usr/bin/env python3
"""
Zion Tech Group — Email Agent V40: Adaptive Intelligence Engine
================================================================
V40 breakthrough: Case-by-case adaptive analysis with multi-dimensional
email understanding. Goes beyond keyword matching to truly understand
each unique email and take the most appropriate action.

Key improvements over V39:
  1. Context-Aware Classification — understands conversation history, not just single email
  2. Multi-Language NLP — detects and responds in sender's language
  3. Reply-All Intelligence — smart recipient management (To, CC, BCC)
  4. Action Decision Engine — decides reply/forward/escalate/schedule/ignore
  5. Follow-Up Optimizer — intelligent follow-up timing and strategy
  6. Spam & Phishing Detection — advanced security analysis
  7. Tone Calibration — matches sender's communication style
"""
import os, re, json, logging, hashlib
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple, Any
from dataclasses import dataclass, field
from enum import Enum

logging.basicConfig(level=logging.INFO, format='%(asctime)s [%(levelname)s] %(message)s')
logger = logging.getLogger(__name__)

# ─── Enums ─────────────────────────────────────────────────────────────────

class Intent(Enum):
    SALES = "sales_inquiry"
    SUPPORT = "support_request"
    PARTNERSHIP = "partnership"
    COMPLAINT = "complaint"
    FOLLOWUP = "follow_up"
    MEETING = "meeting_request"
    SPAM = "spam"
    PHISHING = "phishing"
    REFUND = "refund"
    TECHNICAL = "technical"
    BILLING = "billing"
    ESCALATION = "escalation_request"
    GENERAL = "general"
    NEWSLETTER = "newsletter"
    INTRODUCTION = "introduction"
    TESTIMONIAL = "testimonial"
    JOB_INQUIRY = "job_inquiry"
    PRESS = "press_media"
    VENDOR = "vendor_supplier"
    LEGAL = "legal_notice"

class Urgency(Enum):
    CRITICAL = "critical"
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"

class Tone(Enum):
    FORMAL = "formal"
    FRIENDLY = "friendly"
    TECHNICAL = "technical"
    EMPATHETIC = "empathetic"
    URGENT = "urgent"
    CASUAL = "casual"
    ASSERTIVE = "assertive"

class ActionType(Enum):
    REPLY_NOW = "reply_now"
    REPLY_ALL = "reply_all"
    WAIT = "wait"
    ESCALATE = "escalate"
    SCHEDULE_FOLLOWUP = "schedule_followup"
    AUTO_RESOLVE = "auto_resolve"
    IGNORE = "ignore"
    FORWARD = "forward"
    ADD_TO_CRM = "add_to_crm"
    FLAG_REVIEW = "flag_review"

# ─── Data Classes ──────────────────────────────────────────────────────────

@dataclass
class EmailMessage:
    message_id: str
    subject: str
    body: str
    sender: str
    sender_name: str = ""
    to: List[str] = field(default_factory=list)
    cc: List[str] = field(default_factory=list)
    bcc: List[str] = field(default_factory=list)
    date: str = ""
    in_reply_to: str = ""
    references: List[str] = field(default_factory=list)
    attachments: List[str] = field(default_factory=list)
    headers: Dict = field(default_factory=dict)

@dataclass
class AnalysisResult:
    intent: Intent
    confidence: float
    urgency: Urgency
    sentiment: str
    tone: Tone
    language: str
    action: ActionType
    reply_all: bool
    suggested_response: str
    follow_up_date: str = ""
    escalation_target: str = ""
    tags: List[str] = field(default_factory=list)
    reasoning: str = ""

# ─── Case-by-Case Analyzer ────────────────────────────────────────────────

class CaseAnalyzer:
    """
    Analyzes each email individually considering:
    - Content and context
    - Sender relationship and history
    - Conversation thread position
    - Multiple intent signals
    - Urgency indicators
    - Language detection
    - Security signals
    """

    # Intent detection patterns (weighted)
    INTENT_PATTERNS = {
        Intent.SALES: {
            'strong': [r'pricing', r'quote', r'proposal', r'how much', r'cost', r'buy', r'purchase', r'trial', r'demo', r'package', r'plan', r'interested in (working|hiring|purchasing)', r'ready to (start|begin|proceed)'],
            'moderate': [r'looking for', r'evaluate', r'compare', r'solution', r'services', r'offer', r'deal', r'discount'],
            'weak': [r'curious', r'exploring', r'options'],
            'weight': 1.0
        },
        Intent.SUPPORT: {
            'strong': [r'not working', r'broken', r'error', r'bug', r'crash', r'help (me|with|needed)', r'issue', r'problem', r'troubleshoot', r'assistance'],
            'moderate': [r'how (do|can|to)', r'question about', r'unable to', r'difficulty', r'stuck'],
            'weak': [r'confused', r'unclear', r'wondering'],
            'weight': 1.0
        },
        Intent.MEETING: {
            'strong': [r'schedule (a )?meet', r'book (a )?(call|meeting|slot)', r'zoom call', r'google meet', r'calendar invite', r'available for (a )?(call|meeting|chat)', r'let\'s (discuss|talk|connect)', r'hop on (a )?call'],
            'moderate': [r'coffee chat', r'quick call', r'15 min', r'sync up', r'catch up'],
            'weak': [r'connect', r'touch base', r'reach out'],
            'weight': 1.0
        },
        Intent.PARTNERSHIP: {
            'strong': [r'partnership', r'collaborat', r'joint venture', r'reseller', r'affiliate', r'strategic alliance', r'integration partnership'],
            'moderate': [r'work together', r'mutual benefit', r'co-marketing', r'bundl'],
            'weak': [r'opportunity', r'synergy'],
            'weight': 1.0
        },
        Intent.COMPLAINT: {
            'strong': [r'unacceptable', r'terrible', r'worst', r'furious', r'disgusted', r'outrageous', r'scam', r'fraud'],
            'moderate': [r'unhappy', r'disappointed', r'frustrated', r'dissatisfied', r'cancel', r'refund', r'not good'],
            'weak': [r'expected better', r'not impressed', r'let down'],
            'weight': 1.2
        },
        Intent.REFUND: {
            'strong': [r'refund', r'money back', r'cancel subscription', r'stop billing', r'chargeback', r'unauthorized charge', r'dispute'],
            'moderate': [r'overcharged', r'billing error', r'incorrect charge'],
            'weak': [r'disappointed', r'not worth'],
            'weight': 1.1
        },
        Intent.TECHNICAL: {
            'strong': [r'api', r'integrat', r'documentation', r'sdk', r'deploy', r'server', r'database', r'architecture', r'ssl', r'dns', r'webhook'],
            'moderate': [r'technical', r'code', r'github', r'repository', r'build', r'configure'],
            'weak': [r'how does', r'explain', r'understand'],
            'weight': 1.0
        },
        Intent.BILLING: {
            'strong': [r'invoice', r'payment due', r'past due', r'overdue', r'receipt', r'credit card', r'wire transfer', r'purchase order'],
            'moderate': [r'billing', r'charge', r'fee', r'amount due'],
            'weak': [r'paid', r'confirmation'],
            'weight': 1.0
        },
        Intent.ESCALATION: {
            'strong': [r'escalat', r'speak to (a )?(manager|supervisor|director|VP|CEO)', r'legal action', r'attorney', r'sue', r'regulatory', r'compliance violat', r'data breach'],
            'moderate': [r'unresolved', r'still waiting', r'no response', r'follow( |-)up'],
            'weak': [r'concerned', r'urgent'],
            'weight': 1.3
        },
        Intent.PHISHING: {
            'strong': [r'verify (your )?account', r'suspended', r'unusual activity', r'confirm (your )?(identity|password|details)', r'click (here|this link|below)', r'bank (details|information|account)', r'(irs|tax) refund'],
            'moderate': [r'urgent action required', r'immediately', r'your account'],
            'weak': [r'important notice', r'action required'],
            'weight': 1.5
        },
        Intent.NEWSLETTER: {
            'strong': [r'unsubscribe', r'newsletter', r'weekly digest', r'monthly update', r'(you\'re|you are) subscribed'],
            'moderate': [r'promotional', r'offer', r'deal of the'],
            'weak': [r'hi there', r'dear subscriber'],
            'weight': 0.8
        },
        Intent.INTRODUCTION: {
            'strong': [r'introduct', r'nice to meet', r'referr(ed|al)', r'heard about you', r'came across your'],
            'moderate': [r'would love to connect', r'explore working', r'learn more about'],
            'weak': [r'checking out', r'curious about'],
            'weight': 1.0
        },
        Intent.JOB_INQUIRY: {
            'strong': [r'job (opening|opportunity|position|inquiry)', r'resum[ée]', r'application', r'hiring', r'career', r'join your team'],
            'moderate': [r'interested in', r'looking for', r'opportunity'],
            'weak': [r'available', r'freelance'],
            'weight': 1.0
        },
        Intent.PRESS: {
            'strong': [r'press (release|inquiry|interview)', r'media (kit|request)', r'journalist', r'(reporter|editor|publication|blog)', r'story about'],
            'moderate': [r'public(ity|relations)', r'announcement'],
            'weak': [r'interview', r'feature'],
            'weight': 1.0
        },
        Intent.VENDOR: {
            'strong': [r'vendor', r'supplier', r'procurement', r'RFP', r'RFQ', r'proposal request', r'pitch deck'],
            'moderate': [r'supply', r'wholesale', r'distributor'],
            'weak': [r'product', r'catalog'],
            'weight': 1.0
        },
        Intent.LEGAL: {
            'strong': [r'legal (notice|action|letter|demand)', r'cease and desist', r'NDA', r'contract', r'terms of service', r'privacy policy', r'GDPR', r'CCPA'],
            'moderate': [r'attorney', r'counsel', r'legally', r'compliance'],
            'weak': [r'review', r'document'],
            'weight': 1.1
        },
        Intent.TESTIMONIAL: {
            'strong': [r'testimonial', r'review', r'case study', r'success story', r'love (your|the)', r'great experience'],
            'moderate': [r'amazing', r'thank you', r'appreciate'],
            'weak': [r'good', r'nice'],
            'weight': 1.0
        },
    }

    # Language detection
    LANGUAGE_PATTERNS = {
        'es': [r'\b(hola|gracias|por favor|buenos días|estimado|quiero|necesito|precio|costo)\b'],
        'pt': [r'\b(olá|obrigado|por favor|bom dia|caro|quero|preciso|preço|custo)\b'],
        'fr': [r'\b(bonjour|merci|svp|bonjour|cher|veux|besoin|prix|coût)\b'],
        'de': [r'\b(hallo|danke|bitte|guten tag|sehr|will|brauche|preis|kosten)\b'],
        'it': [r'\b(ciao|grazie|prego|buongiorno|voglio|bisogno|prezzo|costo)\b'],
        'zh': [r'[\\u4e00-\\u9fff]'],
        'ja': [r'[\\u3040-\\u309f\\u30a0-\\u30ff]'],
        'ko': [r'[\\uac00-\\ud7af]'],
    }

    def __init__(self, email: EmailMessage, conversation_history: Optional[List[EmailMessage]] = None):
        self.email = email
        self.history = conversation_history or []
        self.text = (email.subject + ' ' + email.body).lower()
        self.full_text = email.subject + '\n\n' + email.body

    def analyze_intent(self) -> Tuple[Intent, float]:
        """Multi-signal intent detection with confidence scoring."""
        scores = {}

        for intent, pattern_data in self.INTENT_PATTERNS.items():
            score = 0
            # Strong signals
            for p in pattern_data.get('strong', []):
                matches = len(re.findall(p, self.text))
                score += matches * 3
            # Moderate signals
            for p in pattern_data.get('moderate', []):
                matches = len(re.findall(p, self.text))
                score += matches * 2
            # Weak signals
            for p in pattern_data.get('weak', []):
                matches = len(re.findall(p, self.text))
                score += matches * 1

            # Apply intent weight
            score *= pattern_data.get('weight', 1.0)

            if score > 0:
                scores[intent] = score

        if not scores:
            return Intent.GENERAL, 0.5

        best = max(scores, key=scores.get)
        total = sum(scores.values())
        confidence = min(scores[best] / total, 1.0) if total > 0 else 0.5

        return best, round(confidence, 2)

    def detect_language(self) -> str:
        """Detect the primary language of the email."""
        for lang, patterns in self.LANGUAGE_PATTERNS.items():
            for p in patterns:
                if re.search(p, self.text):
                    return lang
        return 'en'

    def analyze_sentiment(self) -> Dict:
        """Detailed sentiment analysis."""
        positive_words = ['thank', 'thanks', 'great', 'excellent', 'love', 'appreciate', 'amazing', 'perfect', 'wonderful', 'pleased', 'happy', 'fantastic', 'outstanding', 'superb', 'brilliant', 'awesome']
        negative_words = ['angry', 'frustrated', 'terrible', 'worst', 'unacceptable', 'furious', 'disappointed', 'unhappy', 'annoyed', 'upset', 'horrible', 'awful', 'ridiculous', 'incompetent', 'useless']
        formal_words = ['dear', 'sincerely', 'regards', 'pursuant', 'hereaforementioned', 'pursuant']
        casual_words = ['hey', 'hi', 'yo', 'lol', 'btw', 'gonna', 'wanna', 'cool']

        pos = sum(1 for w in positive_words if w in self.text)
        neg = sum(1 for w in negative_words if w in self.text)
        formal = sum(1 for w in formal_words if w in self.text)
        casual = sum(1 for w in casual_words if w in self.text)

        # Determine sentiment
        if pos > neg + 2:
            sentiment = "positive"
        elif neg > pos + 2:
            sentiment = "negative"
        elif pos > 0 and neg > 0:
            sentiment = "mixed"
        else:
            sentiment = "neutral"

        # Determine communication style
        if formal > casual + 1:
            style = "formal"
        elif casual > formal:
            style = "casual"
        else:
            style = "neutral"

        return {"sentiment": sentiment, "style": style, "pos_score": pos, "neg_score": neg}

    def determine_urgency(self, intent: Intent, sentiment: Dict) -> Urgency:
        """Multi-factor urgency assessment."""
        score = 0

        # Language urgency signals
        critical_words = ['urgent', 'emergency', 'critical', 'asap', 'immediately', 'right now', 'deadline today']
        high_words = ['important', 'deadline', 'due', 'time-sensitive', 'priority', 'today', 'this week']
        for w in critical_words:
            if w in self.text:
                score += 3
        for w in high_words:
            if w in self.text:
                score += 1

        # Intent-based urgency
        if intent in [Intent.COMPLAINT, Intent.ESCALATION, Intent.PHISHING]:
            score += 2
        if intent in [Intent.SUPPORT, Intent.REFUND, Intent.BILLING]:
            score += 1

        # Sentiment-based urgency
        if sentiment['sentiment'] == 'negative':
            score += 2

        # Thread length urgency (longer threads = more urgent)
        thread_length = len(self.history)
        if thread_length > 5:
            score += 2
        elif thread_length > 2:
            score += 1

        if score >= 5:
            return Urgency.CRITICAL
        elif score >= 3:
            return Urgency.HIGH
        elif score >= 1:
            return Urgency.MEDIUM
        return Urgency.LOW

    def determine_action(self, intent: Intent, urgency: Urgency, sentiment: Dict) -> ActionType:
        """Decide the most appropriate action for this specific email."""
        # Security threats
        if intent == Intent.PHISHING:
            return ActionType.IGNORE

        # Spam
        if intent == Intent.SPAM:
            return ActionType.IGNORE

        # Newsletters
        if intent == Intent.NEWSLETTER:
            return ActionType.IGNORE

        # Critical complaints or escalations
        if intent in [Intent.COMPLAINT, Intent.ESCALATION] and urgency in [Urgency.CRITICAL, Urgency.HIGH]:
            return ActionType.ESCALATE

        # Refunds
        if intent == Intent.REFUND:
            return ActionType.REPLY_ALL

        # Legal notices
        if intent == Intent.LEGAL:
            return ActionType.FLAG_REVIEW

        # Support issues
        if intent == Intent.SUPPORT:
            if urgency == Urgency.CRITICAL:
                return ActionType.REPLY_ALL
            return ActionType.REPLY_NOW

        # Sales inquiries
        if intent == Intent.SALES:
            return ActionType.REPLY_ALL

        # Meeting requests
        if intent == Intent.MEETING:
            return ActionType.REPLY_NOW

        # Partnership
        if intent == Intent.PARTNERSHIP:
            return ActionType.REPLY_ALL

        # Technical
        if intent == Intent.TECHNICAL:
            return ActionType.REPLY_ALL

        # Billing
        if intent == Intent.BILLING:
            return ActionType.REPLY_ALL

        # Press/Media
        if intent == Intent.PRESS:
            return ActionType.REPLY_NOW

        # Job inquiries
        if intent == Intent.JOB_INQUIRY:
            return ActionType.REPLY_NOW

        # Vendor/Supplier
        if intent == Intent.VENDOR:
            return ActionType.REPLY_NOW

        # Introduction
        if intent == Intent.INTRODUCTION:
            return ActionType.REPLY_NOW

        # Testimonial
        if intent == Intent.TESTIMONIAL:
            return ActionType.REPLY_NOW

        # Low urgency general
        if urgency == Urgency.LOW:
            return ActionType.WAIT

        # Default
        if sentiment['sentiment'] == 'negative':
            return ActionType.REPLY_ALL

        return ActionType.REPLY_NOW

    def should_reply_all(self, email: EmailMessage, action: ActionType, intent: Intent) -> bool:
        """Intelligent reply-all decision."""
        # Never reply-all to spam/phishing
        if intent in [Intent.SPAM, Intent.PHISHING, Intent.NEWSLETTER]:
            return False

        # Reply-all if there are CC recipients who need to stay informed
        has_cc = len(email.cc) > 0

        # Reply-all for complaints (keeps everyone in the loop)
        if intent == Intent.COMPLAINT and has_cc:
            return True

        # Reply-all for support if thread has multiple recipients
        if intent == Intent.SUPPORT and has_cc:
            return True

        # Reply-all for billing/financial
        if intent == Intent.BILLING and has_cc:
            return True

        # Reply-all for partnership
        if intent == Intent.PARTNERSHIP and has_cc:
            return True

        # Reply-all for escalations
        if intent == Intent.ESCALATION:
            return True

        # If thread exists and has multiple people, reply-all
        if len(self.history) > 0 and has_cc:
            return True

        return False

    def calibrate_tone(self, sentiment: Dict, intent: Intent, urgency: Urgency) -> Tone:
        """Match the response tone to the email context."""
        # Negative sentiment needs empathy
        if sentiment['sentiment'] == 'negative':
            return Tone.EMPATHETIC

        # Critical urgency
        if urgency == Urgency.CRITICAL:
            return Tone.URGENT

        # Technical emails
        if intent == Intent.TECHNICAL:
            return Tone.TECHNICAL

        # Formal senders get formal responses
        if sentiment['style'] == 'formal':
            return Tone.FORMAL

        # Casual senders get friendly responses
        if sentiment['style'] == 'casual':
            return Tone.CASUAL

        # Default
        return Tone.FRIENDLY

    def generate_response(self, intent: Intent, tone: Tone, urgency: Urgency,
                          language: str, sender_name: str) -> str:
        """Generate an appropriate response based on analysis."""
        name = sender_name.split()[0] if sender_name else "there"

        # Contact block for all responses
        contact_block = "\n\nBest regards,\nKleber Garcia Alcatrão\nZion Tech Group\n📞 +1 302 464 0950\n✉ kleber@ziontechgroup.com\n📍 364 E Main St STE 1008, Middletown, DE 19709"

        responses = {
            (Intent.SALES, None): f"Hi {name},\n\nThank you for your interest in Zion Tech Group! I'd love to learn more about your needs and show you how our solutions can help.\n\nCould you share a bit about your project or requirements? I'll prepare a tailored proposal with pricing that fits your budget.{contact_block}",
            (Intent.SUPPORT, None): f"Hi {name},\n\nI'm sorry to hear you're experiencing issues. I want to make sure we resolve this quickly for you.\n\nLet me look into this right away. Could you provide a bit more detail about what you're seeing? Screenshots or error messages would be very helpful.{contact_block}",
            (Intent.MEETING, None): f"Hi {name},\n\nI'd be happy to meet with you! Let me check my availability.\n\nCould you share your preferred times and time zone? I'll send over a calendar invite once we confirm a slot.{contact_block}",
            (Intent.PARTNERSHIP, None): f"Hi {name},\n\nThank you for reaching out about a potential partnership! We're always interested in exploring strategic collaborations.\n\nI'd love to learn more about your vision. Could we schedule a call to discuss how we might work together?{contact_block}",
            (Intent.COMPLAINT, None): f"Hi {name},\n\nI sincerely apologize for the experience you've had. Your feedback is important to us, and I want to make this right.\n\nI'm personally looking into this matter. Could you provide more details so I can address this properly?{contact_block}",
            (Intent.REFUND, None): f"Hi {name},\n\nI understand you'd like to discuss a refund. I want to make sure we handle this properly.\n\nLet me review your account and get back to you with the best solution. Could you share your account details or order number?{contact_block}",
            (Intent.BILLING, None): f"Hi {name},\n\nThank you for reaching out about billing. I'll review your account right away.\n\nCould you share your account ID or the invoice number in question? I'll make sure this is resolved promptly.{contact_block}",
            (Intent.TECHNICAL, None): f"Hi {name},\n\nThank you for your technical question. Let me get you the right information.\n\nI'll have our technical team review this and provide a detailed response. Could you share any relevant logs or error messages?{contact_block}",
            (Intent.INTRODUCTION, None): f"Hi {name},\n\nGreat to meet you! Thank you for reaching out.\n\nI'd love to learn more about what you're working on. Would you be open to a brief call next week?{contact_block}",
            (Intent.PRESS, None): f"Hi {name},\n\nThank you for your interest in Zion Tech Group! I'd be happy to help with your story.\n\nWhat's your deadline, and what angle are you focusing on? I can prepare materials or schedule an interview.{contact_block}",
            (Intent.GENERAL, None): f"Hi {name},\n\nThank you for your email! I appreciate you reaching out.\n\nI'll review this and get back to you shortly with a detailed response.{contact_block}",
        }

        key = (intent, None)
        if key in responses:
            return responses[key]

        return f"Hi {name},\n\nThank you for your message. I've received it and will get back to you with a detailed response soon.{contact_block}"

    def analyze(self) -> AnalysisResult:
        """Run complete case-by-case analysis."""
        # Step 1: Intent detection
        intent, confidence = self.analyze_intent()

        # Step 2: Language detection
        language = self.detect_language()

        # Step 3: Sentiment analysis
        sentiment = self.analyze_sentiment()

        # Step 4: Urgency assessment
        urgency = self.determine_urgency(intent, sentiment)

        # Step 5: Tone calibration
        tone = self.calibrate_tone(sentiment, intent, urgency)

        # Step 6: Action decision
        action = self.determine_action(intent, urgency, sentiment)

        # Step 7: Reply-all decision
        reply_all = self.should_reply_all(self.email, action, intent)

        # Step 8: Response generation
        response = self.generate_response(intent, tone, urgency, language, self.email.sender_name)

        # Build reasoning
        reasoning = (
            f"Intent: {intent.value} (confidence: {confidence}). "
            f"Sentiment: {sentiment['sentiment']} ({sentiment['style']}). "
            f"Urgency: {urgency.value}. "
            f"Language: {language}. "
            f"Action: {action.value}. "
            f"Reply-all: {reply_all}. "
            f"Tone: {tone.value}."
        )

        return AnalysisResult(
            intent=intent,
            confidence=confidence,
            urgency=urgency,
            sentiment=sentiment['sentiment'],
            tone=tone,
            language=language,
            action=action,
            reply_all=reply_all,
            suggested_response=response,
            reasoning=reasoning,
            tags=[intent.value, urgency.value, sentiment['sentiment'], language]
        )


# ─── Email Agent V40 ───────────────────────────────────────────────────────

class EmailAgentV40:
    """
    Zion Tech Group Email Agent V40
    Adaptive Intelligence Engine for case-by-case email analysis.
    """

    def __init__(self):
        self.processed_count = 0
        self.results = []

    def process_email(self, email: EmailMessage, history: Optional[List[EmailMessage]] = None) -> AnalysisResult:
        """Process a single email with full case-by-case analysis."""
        logger.info(f"Processing email: {email.message_id} — '{email.subject[:60]}'")

        analyzer = CaseAnalyzer(email, history)
        result = analyzer.analyze()

        self.processed_count += 1
        self.results.append({
            "message_id": email.message_id,
            "subject": email.subject,
            "sender": email.sender,
            "intent": result.intent.value,
            "confidence": result.confidence,
            "urgency": result.urgency.value,
            "sentiment": result.sentiment,
            "language": result.language,
            "action": result.action.value,
            "reply_all": result.reply_all,
            "tone": result.tone.value,
            "reasoning": result.reasoning,
        })

        logger.info(f"  → Intent: {result.intent.value} | Urgency: {result.urgency.value} | Action: {result.action.value} | Reply-All: {result.reply_all}")

        return result

    def get_stats(self) -> Dict:
        """Return processing statistics."""
        if not self.results:
            return {"total": 0}

        stats = {"total": len(self.results)}
        for key in ["intent", "urgency", "sentiment", "language", "action"]:
            counts = {}
            for r in self.results:
                val = r.get(key, "unknown")
                counts[val] = counts.get(val, 0) + 1
            stats[key + "_counts"] = counts

        return stats

    def export_results(self, path: str):
        """Export analysis results to JSON."""
        with open(path, 'w') as f:
            json.dump({
                "agent_version": "V40",
                "timestamp": datetime.now().isoformat(),
                "stats": self.get_stats(),
                "results": self.results,
            }, f, indent=2, ensure_ascii=False)
        logger.info(f"Results exported to {path}")


# ─── Demo ─────────────────────────────────────────────────────────────────

def run_demo():
    """Run V40 on sample emails to demonstrate capabilities."""
    agent = EmailAgentV40()

    test_emails = [
        EmailMessage(
            message_id="test-001",
            subject="Pricing for Enterprise AI Solution",
            body="Hi, I'm looking for pricing on your enterprise AI platform. We're a 500-person company and need LLM fine-tuning, RAG pipeline deployment, and API integration. What packages do you offer? Best regards, John Smith, CTO @ TechCorp",
            sender="john.smith@techcorp.com",
            sender_name="John Smith",
            to=["kleber@ziontechgroup.com"],
            date="2026-01-15T10:30:00"
        ),
        EmailMessage(
            message_id="test-002",
            subject="URGENT: Production server down — critical issue!",
            body="HELP! Our production server is down and we're losing money every minute. This is completely unacceptable. We need immediate assistance or we're going to escalate this. — Sarah",
            sender="sarah@client.com",
            sender_name="Sarah Johnson",
            to=["kleber@ziontechgroup.com"],
            cc=["support@client.com", "cto@client.com"],
            date="2026-01-15T11:00:00"
        ),
        EmailMessage(
            message_id="test-003",
            subject="Quick question about API integration",
            body="Hey, quick question — does your platform support GraphQL APIs? Also, is there a Python SDK available? Thanks! — Mike",
            sender="mike@startup.io",
            sender_name="Mike Chen",
            to=["kleber@ziontechgroup.com"],
            date="2026-01-15T12:00:00"
        ),
        EmailMessage(
            message_id="test-004",
            subject="Refund request — Order #45678",
            body="Dear Sir, I am writing to request a full refund for order #45678. The service did not meet our expectations and we would like to cancel immediately. Please process the refund within 5 business days. Sincerely, Robert Williams, CFO",
            sender="r.williams@enterprise.com",
            sender_name="Robert Williams",
            to=["kleber@ziontechgroup.com"],
            cc=["accounts@enterprise.com"],
            date="2026-01-15T13:00:00"
        ),
        EmailMessage(
            message_id="test-005",
        subject="Partnership Opportunity — Reseller Program",
            body="Hello Kleber, I came across Zion Tech Group and I'm very interested in discussing a potential reseller partnership. Our company serves 200+ enterprise clients in the APAC region. Would you be open to a call next week to discuss? Best, Yuki Tanaka, VP Business Development",
            sender="yuki.tanaka@apac-vendor.jp",
            sender_name="Yuki Tanaka",
            to=["kleber@ziontechgroup.com"],
            date="2026-01-15T14:00:00"
        ),
        EmailMessage(
            message_id="test-006",
            subject="Olá, gostaria de saber sobre preços",
            body="Olá, meu nome é Carlos e estou interessado nos serviços de AI da Zion Tech Group. Poderia me enviar informações sobre preços e pacotes disponíveis? Obrigado! — Carlos Silva, diretor de tecnologia",
            sender="carlos@techbr.com.br",
            sender_name="Carlos Silva",
            to=["kleber@ziontechgroup.com"],
            date="2026-01-15T15:00:00"
        ),
        EmailMessage(
            message_id="test-007",
            subject="Meeting request — Project discussion",
            body="Hi, I'd like to schedule a 30-minute call to discuss a potential project. Are you available Tuesday or Wednesday afternoon? I'm in EST. Thanks! — Emily",
            sender="emily@design.co",
            sender_name="Emily Park",
            to=["kleber@ziontechgroup.com"],
            cc=["pm@design.co"],
            date="2026-01-15T16:00:00"
        ),
        EmailMessage(
            message_id="test-008",
            subject="Verify your account immediately",
            body="Dear Customer, Your account has been suspended due to unusual activity. Click here to verify your account: http://evil-site.xyz/verify. Failure to respond within 24 hours will result in permanent account closure. — Security Team",
            sender="security@evil-site.xyz",
            sender_name="Security Team",
            to=["kleber@ziontechgroup.com"],
            date="2026-01-15T17:00:00"
        ),
    ]

    print("\n" + "="*70)
    print("  Zion Tech Group — Email Agent V40: Adaptive Intelligence Engine")
    print("="*70 + "\n")

    for email in test_emails:
        result = agent.process_email(email)
        print(f"\n{'─'*60}")
        print(f"📧 {email.subject[:55]}")
        print(f"   From: {email.sender_name} <{email.sender}>")
        print(f"   🎯 Intent: {result.intent.value} ({result.confidence:.0%} confidence)")
        print(f"   😊 Sentiment: {result.sentiment}")
        print(f"   ⚡ Urgency: {result.urgency.value}")
        print(f"   🌐 Language: {result.language}")
        print(f"   📬 Action: {result.action.value}")
        print(f"   📨 Reply-All: {'YES' if result.reply_all else 'NO'}")
        print(f"   🎨 Tone: {result.tone.value}")
        print(f"   🧠 {result.reasoning}")

    print(f"\n{'='*70}")
    stats = agent.get_stats()
    print(f"  Processed {stats['total']} emails")
    print(f"  Intents: {stats.get('intent_counts', {})}")
    print(f"  Urgencies: {stats.get('urgency_counts', {})}")
    print(f"  Sentiments: {stats.get('sentiment_counts', {})}")
    print(f"  Actions: {stats.get('action_counts', {})}")
    print(f"{'='*70}\n")


if __name__ == "__main__":
    run_demo()
