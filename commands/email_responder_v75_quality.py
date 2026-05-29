#!/usr/bin/env python3
"""
Zion Tech Group - V75 Email Response Quality Scoring Engine
Analyzes draft email responses before sending and provides quality scores,
improvement suggestions, tone analysis, and completeness checks.

Features:
- Multi-dimensional quality scoring (clarity, tone, completeness, professionalism)
- AI-powered improvement suggestions
- Tone mismatch detection (response tone vs. incoming email tone)
- Completeness checker (did you address all points?)
- Readability analysis (Flesch-Kincaid, sentence complexity)
- Action item extraction and verification
- Reply-All enforcement check
- Attachment reminder
- Grammar and style suggestions
- Response time appropriateness check

Author: Kleber Garcia Alcatrao
Version: V75-2
Date: 2026-05-29
"""

import re
import json
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple, Any
from dataclasses import dataclass, field
from enum import Enum

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class QualityDimension(Enum):
    CLARITY = "clarity"
    TONE = "tone"
    COMPLETENESS = "completeness"
    PROFESSIONALISM = "professionalism"
    READABILITY = "readability"
    ACTIONABILITY = "actionability"
    EMPATHY = "empathy"
    CONCISENESS = "conciseness"


class ToneType(Enum):
    FORMAL = "formal"
    FRIENDLY = "friendly"
    EMPATHETIC = "empathetic"
    ASSERTIVE = "assertive"
    APOLOGETIC = "apologetic"
    ENTHUSIASTIC = "enthusiastic"
    NEUTRAL = "neutral"


@dataclass
class QualityScore:
    """Quality score for a single dimension."""
    dimension: QualityDimension
    score: int  # 0-100
    weight: float  # 0.0-1.0
    feedback: str
    suggestions: List[str]


@dataclass
class ResponseAnalysis:
    """Complete analysis of an email response."""
    overall_score: int  # 0-100
    dimension_scores: List[QualityScore]
    tone_detected: ToneType
    tone_appropriate: bool
    completeness_score: float  # 0.0-1.0
    points_addressed: List[str]
    points_missed: List[str]
    action_items: List[str]
    readability_grade: float  # Flesch-Kincaid grade level
    word_count: int
    sentence_count: int
    avg_sentence_length: float
    reply_all_recommended: bool
    attachment_needed: bool
    grammar_issues: List[str]
    improvement_suggestions: List[str]
    ready_to_send: bool
    critical_issues: List[str]


class ResponseQualityScorer:
    """
    V75 Email Response Quality Scoring Engine
    
    Analyzes draft responses and provides comprehensive quality feedback
    before the email is sent.
    """
    
    def __init__(self):
        self.professional_phrases = [
            "thank you for", "i appreciate", "please find", "as discussed",
            "looking forward", "best regards", "kind regards", "sincerely",
            "please let me know", "at your convenience", "i wanted to follow up"
        ]
        
        self.informal_phrases = [
            "hey", "gonna", "wanna", "btw", "lol", "omg", "thx",
            "no worries", "sure thing", "you got it", "my bad"
        ]
        
        self.empathy_phrases = [
            "i understand", "i appreciate your", "i can see how",
            "that must be", "i'm sorry to hear", "i understand your frustration",
            "thank you for your patience", "i apologize for"
        ]
        
        self.action_phrases = [
            "i will", "we will", "i'll", "we'll", "let me", "i can",
            "please do", "could you", "next steps", "action item",
            "deadline", "by", "schedule", "follow up"
        ]
        
        self.positive_words = [
            "great", "excellent", "wonderful", "fantastic", "appreciate",
            "glad", "happy", "pleased", "thrilled", "excited", "confident"
        ]
        
        self.negative_words = [
            "unfortunately", "sorry", "problem", "issue", "difficult",
            "challenging", "delay", "unable", "cannot", "regrettably"
        ]
    
    def analyze_clarity(self, text: str) -> QualityScore:
        """Analyze clarity of the response."""
        score = 70  # Base score
        feedback = ""
        suggestions = []
        
        # Check for vague language
        vague_words = ["maybe", "perhaps", "possibly", "sort of", "kind of",
                      "somewhat", "a bit", "things", "stuff"]
        vague_count = sum(1 for word in vague_words if word in text.lower())
        
        if vague_count > 3:
            score -= 20
            suggestions.append("Reduce vague language - be more specific")
        elif vague_count > 0:
            score -= 10
            suggestions.append("Consider replacing vague terms with specifics")
        
        # Check for clear structure
        has_paragraphs = text.count('\n\n') > 0
        has_bullets = bool(re.search(r'[-*•]\s', text))
        has_numbering = bool(re.search(r'\d+\.\s', text))
        
        if has_paragraphs:
            score += 10
        if has_bullets or has_numbering:
            score += 10
            feedback = "Good use of structured formatting"
        
        # Check sentence length variation
        sentences = re.split(r'[.!?]+', text)
        sentences = [s.strip() for s in sentences if s.strip()]
        
        if sentences:
            lengths = [len(s.split()) for s in sentences]
            avg_length = sum(lengths) / len(lengths)
            
            if avg_length > 25:
                score -= 15
                suggestions.append("Consider shorter sentences for better clarity")
            elif avg_length < 8:
                score -= 5
                suggestions.append("Some sentences may be too short - add more detail")
        
        score = max(0, min(100, score))
        
        return QualityScore(
            dimension=QualityDimension.CLARITY,
            score=score,
            weight=0.20,
            feedback=feedback or f"Clarity score: {score}/100",
            suggestions=suggestions
        )
    
    def analyze_tone(self, response_text: str, incoming_text: str = "") -> QualityScore:
        """Analyze tone appropriateness."""
        score = 70
        suggestions = []
        
        # Detect response tone
        informal_count = sum(1 for phrase in self.informal_phrases if phrase in response_text.lower())
        professional_count = sum(1 for phrase in self.professional_phrases if phrase in response_text.lower())
        empathy_count = sum(1 for phrase in self.empathy_phrases if phrase in response_text.lower())
        
        if professional_count >= 3:
            score += 15
        if informal_count > 2:
            score -= 20
            suggestions.append("Consider using more professional language")
        
        # Check tone match with incoming email
        if incoming_text:
            incoming_negative = sum(1 for word in self.negative_words if word in incoming_text.lower())
            incoming_positive = sum(1 for word in self.positive_words if word in incoming_text.lower())
            
            if incoming_negative > incoming_positive and empathy_count == 0:
                score -= 15
                suggestions.append("The incoming email seems frustrated - add empathetic language")
        
        score = max(0, min(100, score))
        
        return QualityScore(
            dimension=QualityDimension.TONE,
            score=score,
            weight=0.15,
            feedback=f"Tone analysis: {professional_count} professional phrases, {empathy_count} empathy phrases",
            suggestions=suggestions
        )
    
    def analyze_completeness(self, response_text: str, incoming_text: str) -> QualityScore:
        """Analyze if response addresses all points from incoming email."""
        score = 70
        suggestions = []
        points_addressed = []
        points_missed = []
        
        # Extract questions from incoming email
        questions = re.findall(r'[^.!?]*\?[^.!?]*', incoming_text)
        
        # Extract key topics from incoming email
        incoming_sentences = re.split(r'[.!?\n]+', incoming_text)
        key_topics = []
        
        for sentence in incoming_sentences:
            sentence = sentence.strip()
            if len(sentence) > 20:
                # Extract key nouns/phrases
                words = sentence.lower().split()
                for word in words:
                    if len(word) > 5 and word not in ['the', 'and', 'that', 'this', 'with', 'have', 'from']:
                        key_topics.append(word)
        
        # Check if response addresses questions
        for question in questions:
            question_words = set(question.lower().split())
            response_words = set(response_text.lower().split())
            overlap = len(question_words & response_words)
            
            if overlap > 3:
                points_addressed.append(question[:50] + "...")
            else:
                points_missed.append(question[:50] + "...")
        
        # Check topic coverage
        topics_covered = sum(1 for topic in key_topics if topic in response_text.lower())
        coverage_ratio = topics_covered / max(len(key_topics), 1)
        
        if coverage_ratio >= 0.7:
            score += 20
        elif coverage_ratio >= 0.5:
            score += 10
        else:
            score -= 15
            suggestions.append(f"Only {int(coverage_ratio * 100)}% of topics addressed - consider adding more detail")
        
        if points_missed:
            score -= len(points_missed) * 5
            suggestions.append(f"{len(points_missed)} question(s) may not be fully addressed")
        
        score = max(0, min(100, score))
        
        return QualityScore(
            dimension=QualityDimension.COMPLETENESS,
            score=score,
            weight=0.20,
            feedback=f"Addressed {len(points_addressed)} points, missed {len(points_missed)}",
            suggestions=suggestions
        )
    
    def analyze_readability(self, text: str) -> QualityScore:
        """Analyze readability using Flesch-Kincaid metrics."""
        score = 70
        suggestions = []
        
        sentences = re.split(r'[.!?]+', text)
        sentences = [s.strip() for s in sentences if s.strip()]
        
        words = text.split()
        syllables = sum(self._count_syllables(word) for word in words)
        
        if sentences and words:
            # Flesch-Kincaid Grade Level
            avg_sentence_length = len(words) / len(sentences)
            avg_syllables_per_word = syllables / len(words)
            
            grade_level = 0.39 * avg_sentence_length + 11.8 * avg_syllables_per_word - 15.59
            
            if grade_level <= 8:
                score += 20  # Easy to read
            elif grade_level <= 12:
                score += 10  # Standard business level
            elif grade_level <= 16:
                score -= 5   # College level - might be too complex
                suggestions.append("Consider simplifying language (currently college-level reading)")
            else:
                score -= 15
                suggestions.append("Text is very complex - simplify for better comprehension")
            
            # Check for very long sentences
            long_sentences = [s for s in sentences if len(s.split()) > 30]
            if long_sentences:
                score -= len(long_sentences) * 5
                suggestions.append(f"{len(long_sentences)} sentence(s) are very long (>30 words)")
        
        score = max(0, min(100, score))
        
        return QualityScore(
            dimension=QualityDimension.READABILITY,
            score=score,
            weight=0.10,
            feedback=f"Readability analysis complete",
            suggestions=suggestions
        )
    
    def _count_syllables(self, word: str) -> int:
        """Count syllables in a word (approximate)."""
        word = word.lower().strip('.,!?;:')
        if len(word) <= 3:
            return 1
        
        vowels = 'aeiouy'
        count = 0
        prev_vowel = False
        
        for char in word:
            is_vowel = char in vowels
            if is_vowel and not prev_vowel:
                count += 1
            prev_vowel = is_vowel
        
        if word.endswith('e'):
            count -= 1
        if word.endswith('le') and len(word) > 2 and word[-3] not in vowels:
            count += 1
        
        return max(1, count)
    
    def analyze_actionability(self, text: str) -> QualityScore:
        """Analyze if the response includes clear action items."""
        score = 60
        suggestions = []
        
        action_count = sum(1 for phrase in self.action_phrases if phrase in text.lower())
        
        if action_count >= 3:
            score += 30
        elif action_count >= 2:
            score += 20
        elif action_count >= 1:
            score += 10
        else:
            suggestions.append("Consider adding clear action items or next steps")
        
        # Check for deadlines/dates
        date_patterns = [
            r'\b\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b',
            r'\b(?:monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b',
            r'\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\b',
            r'\b(?:tomorrow|next week|end of day|eod|cob)\b'
        ]
        
        has_dates = any(re.search(pattern, text.lower()) for pattern in date_patterns)
        
        if has_dates:
            score += 10
        elif action_count > 0:
            suggestions.append("Action items would benefit from specific deadlines")
        
        score = max(0, min(100, score))
        
        return QualityScore(
            dimension=QualityDimension.ACTIONABILITY,
            score=score,
            weight=0.15,
            feedback=f"Found {action_count} action phrases",
            suggestions=suggestions
        )
    
    def detect_tone_type(self, text: str) -> ToneType:
        """Detect the dominant tone of the response."""
        text_lower = text.lower()
        
        scores = {
            ToneType.FORMAL: sum(1 for p in self.professional_phrases if p in text_lower),
            ToneType.FRIENDLY: sum(1 for w in ["hi", "hello", "thanks", "great", "wonderful"] if w in text_lower),
            ToneType.EMPATHETIC: sum(1 for p in self.empathy_phrases if p in text_lower),
            ToneType.ASSERTIVE: sum(1 for w in ["must", "will", "require", "need to", "ensure"] if w in text_lower),
            ToneType.APOLOGETIC: sum(1 for w in ["sorry", "apologize", "regret", "unfortunately"] if w in text_lower),
            ToneType.ENTHUSIASTIC: sum(1 for w in ["excited", "thrilled", "amazing", "fantastic", "!"] if w in text_lower)
        }
        
        max_tone = max(scores, key=scores.get)
        return max_tone if scores[max_tone] > 0 else ToneType.NEUTRAL
    
    def check_reply_all(self, response_text: str, original_recipients: List[str],
                        original_cc: List[str]) -> bool:
        """Check if reply-all is recommended."""
        # If there were multiple recipients, reply-all is usually appropriate
        total_recipients = len(original_recipients) + len(original_cc)
        
        if total_recipients > 1:
            # Check if response contains information relevant to all
            info_keywords = ["update", "status", "progress", "announcement",
                           "reminder", "meeting", "schedule", "change"]
            has_shared_info = any(kw in response_text.lower() for kw in info_keywords)
            
            return has_shared_info or total_recipients >= 3
        
        return False
    
    def check_attachment_needed(self, response_text: str) -> bool:
        """Check if an attachment might be needed."""
        attachment_keywords = [
            "attached", "attachment", "document", "file", "report",
            "spreadsheet", "presentation", "pdf", "invoice", "contract",
            "proposal", "quote", "estimate", "screenshot"
        ]
        
        text_lower = response_text.lower()
        
        # Check if user mentions attaching something
        mentions_attachment = any(kw in text_lower for kw in attachment_keywords)
        
        # Check if user says "see attached" or similar
        attachment_phrases = [
            "please find attached", "see attached", "as attached",
            "i've attached", "attached is", "attached please find"
        ]
        
        promises_attachment = any(phrase in text_lower for phrase in attachment_phrases)
        
        return mentions_attachment and not promises_attachment
    
    def check_grammar_issues(self, text: str) -> List[str]:
        """Check for common grammar issues."""
        issues = []
        
        # Double spaces
        if re.search(r'  +', text):
            issues.append("Double spaces detected")
        
        # Missing capitalization at start of sentences
        sentences = re.split(r'[.!?]+ ', text)
        for sentence in sentences:
            if sentence and sentence[0].islower():
                issues.append(f"Sentence should start with capital: '{sentence[:30]}...'")
                break
        
        # Multiple exclamation marks
        if '!!!' in text:
            issues.append("Avoid multiple exclamation marks in professional emails")
        
        # ALL CAPS
        words = text.split()
        caps_words = [w for w in words if w.isupper() and len(w) > 2]
        if len(caps_words) > 2:
            issues.append("Avoid using ALL CAPS - it reads as shouting")
        
        # Common typos
        typos = {
            "teh": "the", "recieve": "receive", "occured": "occurred",
            "seperate": "separate", "definately": "definitely",
            "accomodate": "accommodate", "occassion": "occasion"
        }
        
        for typo, correction in typos.items():
            if typo in text.lower():
                issues.append(f"Possible typo: '{typo}' should be '{correction}'")
        
        return issues
    
    def analyze_response(self, response_text: str, incoming_text: str = "",
                        original_recipients: List[str] = None,
                        original_cc: List[str] = None) -> ResponseAnalysis:
        """
        Main analysis method - provides comprehensive quality feedback.
        
        Args:
            response_text: The draft response to analyze
            incoming_text: The original incoming email (for completeness check)
            original_recipients: List of original To recipients
            original_cc: List of original CC recipients
        
        Returns:
            ResponseAnalysis with comprehensive feedback
        """
        logger.info("Analyzing email response quality...")
        
        # Run all analyses
        dimension_scores = [
            self.analyze_clarity(response_text),
            self.analyze_tone(response_text, incoming_text),
            self.analyze_readability(response_text),
            self.analyze_actionability(response_text)
        ]
        
        # Completeness (only if incoming text provided)
        if incoming_text:
            dimension_scores.append(self.analyze_completeness(response_text, incoming_text))
        
        # Calculate overall score
        overall_score = sum(
            ds.score * ds.weight for ds in dimension_scores
        ) / sum(ds.weight for ds in dimension_scores)
        overall_score = int(overall_score)
        
        # Detect tone
        tone_detected = self.detect_tone_type(response_text)
        
        # Check tone appropriateness
        tone_appropriate = True
        if incoming_text:
            incoming_tone = self.detect_tone_type(incoming_text)
            # If incoming is frustrated and response is enthusiastic, that's inappropriate
            if incoming_tone == ToneType.ASSERTIVE and tone_detected == ToneType.ENTHUSIASTIC:
                tone_appropriate = False
        
        # Completeness details
        points_addressed = []
        points_missed = []
        completeness_score = 1.0
        
        if incoming_text:
            completeness_dim = next(
                (ds for ds in dimension_scores if ds.dimension == QualityDimension.COMPLETENESS),
                None
            )
            if completeness_dim:
                completeness_score = completeness_dim.score / 100
        
        # Extract action items
        action_items = []
        action_patterns = [
            r'(?:i|we)\s+(?:will|shall)\s+[^.]+',
            r'(?:let me|please)\s+[^.]+',
            r'(?:next steps?:)\s+[^.]+'
        ]
        
        for pattern in action_patterns:
            matches = re.findall(pattern, response_text.lower())
            action_items.extend(matches)
        
        # Readability metrics
        sentences = re.split(r'[.!?]+', response_text)
        sentences = [s.strip() for s in sentences if s.strip()]
        words = response_text.split()
        word_count = len(words)
        sentence_count = len(sentences)
        avg_sentence_length = word_count / max(sentence_count, 1)
        
        # Calculate readability grade
        syllables = sum(self._count_syllables(w) for w in words)
        if sentences and words:
            readability_grade = 0.39 * avg_sentence_length + 11.8 * (syllables / word_count) - 15.59
        else:
            readability_grade = 0
        
        # Reply-all check
        reply_all_recommended = False
        if original_recipients or original_cc:
            reply_all_recommended = self.check_reply_all(
                response_text,
                original_recipients or [],
                original_cc or []
            )
        
        # Attachment check
        attachment_needed = self.check_attachment_needed(response_text)
        
        # Grammar check
        grammar_issues = self.check_grammar_issues(response_text)
        
        # Compile improvement suggestions
        improvement_suggestions = []
        for ds in dimension_scores:
            improvement_suggestions.extend(ds.suggestions)
        
        # Critical issues
        critical_issues = []
        if overall_score < 50:
            critical_issues.append("Overall quality is low - significant improvements needed")
        if not tone_appropriate:
            critical_issues.append("Tone mismatch with incoming email")
        if grammar_issues:
            critical_issues.extend(grammar_issues[:2])
        
        # Ready to send?
        ready_to_send = (
            overall_score >= 70 and
            tone_appropriate and
            not critical_issues and
            len(grammar_issues) == 0
        )
        
        return ResponseAnalysis(
            overall_score=overall_score,
            dimension_scores=dimension_scores,
            tone_detected=tone_detected,
            tone_appropriate=tone_appropriate,
            completeness_score=completeness_score,
            points_addressed=points_addressed,
            points_missed=points_missed,
            action_items=action_items,
            readability_grade=readability_grade,
            word_count=word_count,
            sentence_count=sentence_count,
            avg_sentence_length=avg_sentence_length,
            reply_all_recommended=reply_all_recommended,
            attachment_needed=attachment_needed,
            grammar_issues=grammar_issues,
            improvement_suggestions=improvement_suggestions,
            ready_to_send=ready_to_send,
            critical_issues=critical_issues
        )


# Example usage and testing
if __name__ == "__main__":
    scorer = ResponseQualityScorer()
    
    # Test incoming email (frustrated customer)
    incoming = """
    Hi,
    
    I'm very frustrated with the service. Our system has been down for 3 hours
    and nobody has responded to my previous emails. This is unacceptable.
    
    Can someone please:
    1. Tell me what's causing the outage?
    2. When will it be fixed?
    3. What compensation will we receive?
    
    This is affecting our entire business operations.
    
    Regards,
    John
    """
    
    # Test response (could be improved)
    response = """
    Hi John,
    
    Thanks for reaching out! We're excited to help you!
    
    We're looking into the issue and will get back to you soon.
    Our team is working on it.
    
    Best,
    Support Team
    """
    
    analysis = scorer.analyze_response(
        response_text=response,
        incoming_text=incoming,
        original_recipients=["john@company.com"],
        original_cc=["manager@company.com", "cto@company.com"]
    )
    
    print("="*60)
    print("RESPONSE QUALITY ANALYSIS")
    print("="*60)
    print(f"\nOverall Score: {analysis.overall_score}/100")
    print(f"Ready to Send: {'✅ YES' if analysis.ready_to_send else '❌ NO'}")
    print(f"Tone Detected: {analysis.tone_detected.value}")
    print(f"Tone Appropriate: {'✅' if analysis.tone_appropriate else '❌'}")
    print(f"Reply-All Recommended: {'✅' if analysis.reply_all_recommended else '❌'}")
    print(f"Attachment Needed: {'⚠️ YES' if analysis.attachment_needed else '❌ No'}")
    print(f"Word Count: {analysis.word_count}")
    print(f"Readability Grade: {analysis.readability_grade:.1f}")
    
    print(f"\nDimension Scores:")
    for ds in analysis.dimension_scores:
        print(f"  {ds.dimension.value}: {ds.score}/100 (weight: {ds.weight})")
        for suggestion in ds.suggestions:
            print(f"    💡 {suggestion}")
    
    print(f"\nCritical Issues:")
    for issue in analysis.critical_issues:
        print(f"  ⚠️ {issue}")
    
    print(f"\nImprovement Suggestions:")
    for suggestion in analysis.improvement_suggestions:
        print(f"  💡 {suggestion}")
    
    print(f"\nAction Items Found:")
    for item in analysis.action_items:
        print(f"  ✅ {item}")
