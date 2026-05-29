#!/usr/bin/env python3
"""
V89: AI Case-by-Case Context Analysis Engine
Deep email understanding with intelligent routing and action determination.
"""

import re
import json
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple, Any
from dataclasses import dataclass, field
from enum import Enum
import hashlib


class EmailUrgency(Enum):
    CRITICAL = "critical"  # Immediate action required (< 5 min)
    HIGH = "high"          # Urgent (< 1 hour)
    MEDIUM = "medium"      # Standard (< 24 hours)
    LOW = "low"            # Can wait (< 72 hours)
    INFORMATIONAL = "informational"  # No action needed


class EmailComplexity(Enum):
    SIMPLE = "simple"      # Straightforward response
    MODERATE = "moderate"  # Requires some analysis
    COMPLEX = "complex"    # Multiple stakeholders, decisions needed
    ESCALATION = "escalation"  # Requires human intervention


class ActionType(Enum):
    AUTO_REPLY = "auto_reply"
    FORWARD = "forward"
    ESCALATE = "escalate"
    SCHEDULE = "schedule"
    IGNORE = "ignore"
    ARCHIVE = "archive"
    FLAG = "flag"
    DELEGATE = "delegate"
    MULTI_STEP = "multi_step"


@dataclass
class EmailContext:
    email_id: str
    sender: str
    recipients: List[str]
    subject: str
    body: str
    timestamp: datetime
    thread_id: Optional[str] = None
    attachments: List[str] = field(default_factory=list)
    
    # Analysis results
    urgency: EmailUrgency = EmailUrgency.MEDIUM
    complexity: EmailComplexity = EmailComplexity.SIMPLE
    category: str = "general"
    sentiment: float = 0.0  # -1.0 to 1.0
    intent: str = "unknown"
    action_type: ActionType = ActionType.AUTO_REPLY
    confidence: float = 0.0
    context_score: float = 0.0  # How well we understand context
    
    # Routing
    route_to: Optional[str] = None
    delegate_to: Optional[str] = None
    cc_additions: List[str] = field(default_factory=list)
    bcc_additions: List[str] = field(default_factory=list)
    
    # Response metadata
    response_template: Optional[str] = None
    custom_response: Optional[str] = None
    follow_up_date: Optional[datetime] = None
    
    # Thread context
    previous_emails: List[Dict] = field(default_factory=list)
    relationship_history: Dict = field(default_factory=dict)


class V89CaseAnalysisEngine:
    """
    V89: AI Case-by-Case Context Analysis Engine
    
    Features:
    1. Deep contextual understanding of each email
    2. Intelligent urgency and complexity scoring
    3. Automatic action determination
    4. Smart routing and delegation
    5. Thread-aware processing
    6. Relationship context integration
    7. Multi-factor decision making
    """
    
    def __init__(self):
        self.emails_processed: Dict[str, EmailContext] = {}
        self.sender_profiles: Dict[str, Dict] = {}
        self.category_patterns: Dict[str, List[str]] = {
            'sales_inquiry': ['price', 'quote', 'proposal', 'demo', 'interested'],
            'support_request': ['help', 'issue', 'problem', 'bug', 'error', 'not working'],
            'billing': ['invoice', 'payment', 'billing', 'charge', 'refund'],
            'partnership': ['partner', 'collaborate', 'affiliate', 'reseller'],
            'recruitment': ['job', 'career', 'position', 'apply', 'resume'],
            'spam': ['winner', 'prize', 'click here', 'urgent', 'verify account'],
            'internal': ['meeting', 'project', 'team', 'update', 'status'],
            'client_communication': ['client', 'customer', 'deliverable', 'milestone'],
        }
        
        # Urgency keywords with weights
        self.urgency_keywords = {
            'critical': ['emergency', 'critical', 'down', 'outage', 'production', 'urgent', 'asap', 'immediately'],
            'high': ['urgent', 'important', 'deadline', 'today', 'tomorrow', 'asap'],
            'medium': ['please', 'could', 'when', 'soon', 'this week'],
            'low': ['no rush', 'when you can', 'whenever', 'low priority'],
        }
    
    def analyze_email(self, email_data: Dict) -> EmailContext:
        """
        Perform deep case-by-case analysis on an email.
        """
        context = EmailContext(
            email_id=email_data.get('id', hashlib.md5(str(email_data).encode()).hexdigest()[:12]),
            sender=email_data.get('from', ''),
            recipients=email_data.get('to', []),
            subject=email_data.get('subject', ''),
            body=email_data.get('body', ''),
            timestamp=datetime.fromisoformat(email_data.get('date', datetime.now().isoformat())),
            thread_id=email_data.get('thread_id'),
            attachments=email_data.get('attachments', []),
        )
        
        # Multi-factor analysis
        context.category = self._classify_category(context)
        context.urgency = self._assess_urgency(context)
        context.complexity = self._assess_complexity(context)
        context.sentiment = self._analyze_sentiment(context)
        context.intent = self._extract_intent(context)
        context.action_type = self._determine_action(context)
        context.confidence = self._calculate_confidence(context)
        context.context_score = self._evaluate_context_understanding(context)
        
        # Smart routing
        self._determine_routing(context)
        
        # Store for learning
        self.emails_processed[context.email_id] = context
        self._update_sender_profile(context)
        
        return context
    
    def _classify_category(self, ctx: EmailContext) -> str:
        """Classify email into specific category."""
        text = (ctx.subject + ' ' + ctx.body).lower()
        
        scores = {}
        for category, patterns in self.category_patterns.items():
            score = sum(1 for p in patterns if p in text)
            if score > 0:
                scores[category] = score
        
        if scores:
            return max(scores, key=scores.get)
        return 'general'
    
    def _assess_urgency(self, ctx: EmailContext) -> EmailUrgency:
        """Assess email urgency based on multiple factors."""
        text = (ctx.subject + ' ' + ctx.body).lower()
        urgency_scores = {u: 0 for u in EmailUrgency}
        
        for level, keywords in self.urgency_keywords.items():
            for keyword in keywords:
                if keyword in text:
                    if level == 'critical':
                        urgency_scores[EmailUrgency.CRITICAL] += 3
                    elif level == 'high':
                        urgency_scores[EmailUrgency.HIGH] += 2
                    elif level == 'medium':
                        urgency_scores[EmailUrgency.MEDIUM] += 1
                    else:
                        urgency_scores[EmailUrgency.LOW] -= 1
        
        # Check sender history for urgency patterns
        if ctx.sender in self.sender_profiles:
            profile = self.sender_profiles[ctx.sender]
            if profile.get('historical_urgency', 0) > 0.7:
                urgency_scores[EmailUrgency.HIGH] += 1
        
        # Time-based urgency (emails on weekends/holidays might be more urgent)
        if ctx.timestamp.weekday() >= 5:  # Weekend
            urgency_scores[EmailUrgency.HIGH] += 0.5
        
        max_score = max(urgency_scores.values())
        if max_score <= 0:
            return EmailUrgency.INFORMATIONAL
        
        for urgency, score in urgency_scores.items():
            if score == max_score:
                return urgency
        
        return EmailUrgency.MEDIUM
    
    def _assess_complexity(self, ctx: EmailContext) -> EmailComplexity:
        """Assess email complexity."""
        text = ctx.body
        
        # Simple heuristics
        word_count = len(text.split())
        has_attachments = len(ctx.attachments) > 0
        recipient_count = len(ctx.recipients)
        has_questions = text.count('?')
        
        complexity_score = 0
        
        if word_count > 500:
            complexity_score += 2
        elif word_count > 200:
            complexity_score += 1
        
        if has_attachments:
            complexity_score += 1
        
        if recipient_count > 5:
            complexity_score += 1
        
        if has_questions > 3:
            complexity_score += 1
        
        # Check for technical terms
        technical_terms = ['api', 'integration', 'migration', 'deployment', 'infrastructure']
        if any(term in text.lower() for term in technical_terms):
            complexity_score += 1
        
        if complexity_score >= 4:
            return EmailComplexity.ESCALATION
        elif complexity_score >= 3:
            return EmailComplexity.COMPLEX
        elif complexity_score >= 2:
            return EmailComplexity.MODERATE
        else:
            return EmailComplexity.SIMPLE
    
    def _analyze_sentiment(self, ctx: EmailContext) -> float:
        """Analyze email sentiment (-1.0 to 1.0)."""
        text = (ctx.subject + ' ' + ctx.body).lower()
        
        positive_words = ['thank', 'great', 'excellent', 'amazing', 'love', 'happy', 'pleased', 'wonderful']
        negative_words = ['angry', 'frustrated', 'disappointed', 'terrible', 'awful', 'hate', 'upset', 'annoyed']
        
        pos_count = sum(1 for w in positive_words if w in text)
        neg_count = sum(1 for w in negative_words if w in text)
        
        total = pos_count + neg_count
        if total == 0:
            return 0.0
        
        return (pos_count - neg_count) / total
    
    def _extract_intent(self, ctx: EmailContext) -> str:
        """Extract the primary intent of the email."""
        text = ctx.body.lower()
        
        intents = {
            'question': ['?', 'how', 'what', 'when', 'where', 'why', 'can you'],
            'request': ['please', 'could you', 'i need', 'i want', 'request'],
            'complaint': ['issue', 'problem', 'not working', 'broken', 'failed'],
            'feedback': ['suggestion', 'feedback', 'improvement', 'idea'],
            'confirmation': ['confirm', 'verify', 'approve', 'acknowledge'],
            'information': ['fyi', 'update', 'info', 'announcement'],
            'action_required': ['action', 'deadline', 'due', 'complete by'],
        }
        
        intent_scores = {}
        for intent, patterns in intents.items():
            score = sum(1 for p in patterns if p in text)
            if score > 0:
                intent_scores[intent] = score
        
        if intent_scores:
            return max(intent_scores, key=intent_scores.get)
        
        return 'general'
    
    def _determine_action(self, ctx: EmailContext) -> ActionType:
        """Determine the appropriate action for this email."""
        # Critical urgency → escalate or immediate reply
        if ctx.urgency == EmailUrgency.CRITICAL:
            if ctx.complexity == EmailComplexity.ESCALATION:
                return ActionType.ESCALATE
            return ActionType.AUTO_REPLY
        
        # High urgency → auto-reply or forward
        if ctx.urgency == EmailUrgency.HIGH:
            if ctx.category == 'spam':
                return ActionType.IGNORE
            if ctx.complexity in [EmailComplexity.COMPLEX, EmailComplexity.ESCALATION]:
                return ActionType.FORWARD
            return ActionType.AUTO_REPLY
        
        # Spam → ignore
        if ctx.category == 'spam':
            return ActionType.IGNORE
        
        # Complex emails → multi-step or delegate
        if ctx.complexity == EmailComplexity.COMPLEX:
            return ActionType.MULTI_STEP
        
        if ctx.complexity == EmailComplexity.ESCALATION:
            return ActionType.DELEGATE
        
        # Informational → archive or flag
        if ctx.urgency == EmailUrgency.INFORMATIONAL:
            return ActionType.ARCHIVE
        
        # Default → auto-reply
        return ActionType.AUTO_REPLY
    
    def _calculate_confidence(self, ctx: EmailContext) -> float:
        """Calculate confidence in our analysis."""
        confidence = 0.5  # Base confidence
        
        # More context = higher confidence
        if ctx.thread_id:
            confidence += 0.1
        
        if ctx.sender in self.sender_profiles:
            confidence += 0.15
        
        if ctx.previous_emails:
            confidence += 0.1
        
        # Clear category = higher confidence
        if ctx.category != 'general':
            confidence += 0.1
        
        # High word count = more context
        if len(ctx.body.split()) > 100:
            confidence += 0.05
        
        return min(confidence, 0.95)
    
    def _evaluate_context_understanding(self, ctx: EmailContext) -> float:
        """Evaluate how well we understand the context."""
        score = 0.0
        
        # Thread context
        if ctx.thread_id and ctx.previous_emails:
            score += 0.3
        
        # Sender history
        if ctx.sender in self.sender_profiles:
            score += 0.2
        
        # Clear intent
        if ctx.intent != 'unknown' and ctx.intent != 'general':
            score += 0.2
        
        # Clear category
        if ctx.category != 'general':
            score += 0.15
        
        # Sentiment clarity
        if abs(ctx.sentiment) > 0.3:
            score += 0.15
        
        return min(score, 1.0)
    
    def _determine_routing(self, ctx: EmailContext):
        """Determine smart routing for the email."""
        # Sales inquiries → sales team
        if ctx.category == 'sales_inquiry':
            ctx.route_to = 'sales@ziontechgroup.com'
            ctx.cc_additions.append('kleber@ziontechgroup.com')
        
        # Support requests → support queue
        elif ctx.category == 'support_request':
            ctx.route_to = 'support@ziontechgroup.com'
            if ctx.urgency in [EmailUrgency.CRITICAL, EmailUrgency.HIGH]:
                ctx.cc_additions.append('kleber@ziontechgroup.com')
        
        # Billing → finance
        elif ctx.category == 'billing':
            ctx.route_to = 'billing@ziontechgroup.com'
        
        # Partnerships → business development
        elif ctx.category == 'partnership':
            ctx.route_to = 'partnerships@ziontechgroup.com'
            ctx.cc_additions.append('kleber@ziontechgroup.com')
        
        # Internal → appropriate team member
        elif ctx.category == 'internal':
            # Could integrate with calendar/team structure
            pass
        
        # Client communications → account manager
        elif ctx.category == 'client_communication':
            ctx.route_to = 'account@ziontechgroup.com'
            ctx.cc_additions.append('kleber@ziontechgroup.com')
    
    def _update_sender_profile(self, ctx: EmailContext):
        """Update sender profile for future reference."""
        if ctx.sender not in self.sender_profiles:
            self.sender_profiles[ctx.sender] = {
                'email_count': 0,
                'categories': {},
                'avg_sentiment': 0.0,
                'historical_urgency': 0.0,
                'first_contact': ctx.timestamp,
                'last_contact': ctx.timestamp,
            }
        
        profile = self.sender_profiles[ctx.sender]
        profile['email_count'] += 1
        profile['last_contact'] = ctx.timestamp
        
        if ctx.category not in profile['categories']:
            profile['categories'][ctx.category] = 0
        profile['categories'][ctx.category] += 1
        
        # Running average sentiment
        profile['avg_sentiment'] = (profile['avg_sentiment'] * (profile['email_count'] - 1) + ctx.sentiment) / profile['email_count']
        
        # Urgency tracking
        urgency_value = {
            EmailUrgency.CRITICAL: 1.0,
            EmailUrgency.HIGH: 0.75,
            EmailUrgency.MEDIUM: 0.5,
            EmailUrgency.LOW: 0.25,
            EmailUrgency.INFORMATIONAL: 0.0,
        }
        profile['historical_urgency'] = (profile['historical_urgency'] * (profile['email_count'] - 1) + urgency_value[ctx.urgency]) / profile['email_count']
    
    def generate_response(self, ctx: EmailContext) -> Dict:
        """Generate appropriate response based on analysis."""
        response = {
            'to': ctx.sender,
            'cc': ctx.recipients.copy(),  # REPLY ALL by default
            'subject': f"Re: {ctx.subject}",
            'timestamp': datetime.now().isoformat(),
            'action_taken': ctx.action_type.value,
            'confidence': ctx.confidence,
        }
        
        # Add CC additions
        response['cc'].extend(ctx.cc_additions)
        
        if ctx.action_type == ActionType.AUTO_REPLY:
            response['body'] = self._generate_auto_reply(ctx)
            response['response_type'] = 'auto_generated'
        
        elif ctx.action_type == ActionType.FORWARD:
            response['body'] = f"Forwarding to appropriate team member: {ctx.route_to}"
            response['response_type'] = 'forward_notice'
        
        elif ctx.action_type == ActionType.ESCALATE:
            response['body'] = "This has been escalated to our senior team for immediate attention."
            response['response_type'] = 'escalation_notice'
        
        elif ctx.action_type == ActionType.DELEGATE:
            response['body'] = f"This request has been assigned to {ctx.delegate_to} for specialized handling."
            response['response_type'] = 'delegation_notice'
        
        elif ctx.action_type == ActionType.IGNORE:
            response['body'] = None  # No response for spam
            response['response_type'] = 'filtered'
        
        elif ctx.action_type == ActionType.ARCHIVE:
            response['body'] = None
            response['response_type'] = 'archived'
        
        return response
    
    def _generate_auto_reply(self, ctx: EmailContext) -> str:
        """Generate contextual auto-reply."""
        templates = {
            'sales_inquiry': "Thank you for your interest in our services! I've received your inquiry and will provide a detailed proposal within 24 hours. Our team is excited to help you achieve your goals.",
            'support_request': "Thank you for reaching out! I've logged your support request and our technical team is reviewing it. You'll receive a detailed response within 4 business hours.",
            'billing': "Thank you for your inquiry regarding billing. Our finance team has been notified and will respond within 1 business day with detailed information.",
            'partnership': "Thank you for your partnership interest! I'm excited about potential collaboration opportunities and will schedule a call to discuss how we can work together.",
            'client_communication': "Thank you for the update! I've reviewed your message and will respond with detailed feedback and next steps within 24 hours.",
            'general': "Thank you for your email! I've received your message and will respond within 24 hours with a comprehensive answer.",
        }
        
        base = templates.get(ctx.category, templates['general'])
        
        # Add urgency acknowledgment
        if ctx.urgency in [EmailUrgency.CRITICAL, EmailUrgency.HIGH]:
            base = f"[URGENT] {base}\n\nI understand this requires immediate attention and will prioritize your request."
        
        # Add sentiment-aware tone
        if ctx.sentiment < -0.3:
            base = f"I apologize for any inconvenience. {base}"
        elif ctx.sentiment > 0.3:
            base = f"I appreciate your positive feedback! {base}"
        
        return base
    
    def get_analysis_report(self) -> Dict:
        """Get comprehensive analysis report."""
        return {
            'total_emails': len(self.emails_processed),
            'by_category': self._count_by_field('category'),
            'by_urgency': self._count_by_field('urgency'),
            'by_action': self._count_by_field('action_type'),
            'avg_confidence': sum(e.confidence for e in self.emails_processed.values()) / max(len(self.emails_processed), 1),
            'avg_context_score': sum(e.context_score for e in self.emails_processed.values()) / max(len(self.emails_processed), 1),
            'unique_senders': len(self.sender_profiles),
        }
    
    def _count_by_field(self, field: str) -> Dict:
        """Count emails by a specific field."""
        counts = {}
        for email in self.emails_processed.values():
            value = getattr(email, field)
            if hasattr(value, 'value'):
                value = value.value
            counts[value] = counts.get(value, 0) + 1
        return counts


if __name__ == "__main__":
    engine = V89CaseAnalysisEngine()
    
    # Test emails
    test_emails = [
        {
            'id': 'test1',
            'from': 'client@example.com',
            'to': ['kleber@ziontechgroup.com'],
            'subject': 'Urgent: Production system down',
            'body': 'Our production system is down and customers cannot access their data. This is critical and needs immediate attention. Please help ASAP!',
            'date': datetime.now().isoformat(),
        },
        {
            'id': 'test2',
            'from': 'prospect@company.com',
            'to': ['info@ziontechgroup.com'],
            'subject': 'Interested in AI services',
            'body': 'Hi, I saw your AI services on your website and I am interested in learning more about your machine learning solutions. Could you send me a proposal and pricing?',
            'date': datetime.now().isoformat(),
        },
        {
            'id': 'test3',
            'from': 'spam@spammy.com',
            'to': ['kleber@ziontechgroup.com'],
            'subject': 'You won $1,000,000!',
            'body': 'Congratulations! You are the lucky winner of our grand prize. Click here to claim your money now!',
            'date': datetime.now().isoformat(),
        },
    ]
    
    for email in test_emails:
        ctx = engine.analyze_email(email)
        response = engine.generate_response(ctx)
        print(f"\n{'='*60}")
        print(f"Email: {ctx.subject}")
        print(f"Category: {ctx.category}")
        print(f"Urgency: {ctx.urgency.value}")
        print(f"Complexity: {ctx.complexity.value}")
        print(f"Action: {ctx.action_type.value}")
        print(f"Confidence: {ctx.confidence:.2f}")
        print(f"Route to: {ctx.route_to}")
        print(f"CC: {ctx.cc_additions}")
    
    print(f"\n{'='*60}")
    print("Analysis Report:")
    print(json.dumps(engine.get_analysis_report(), indent=2))
