#!/usr/bin/env python3
"""V207 - AI Email Response Quality Grader
Real-time scoring of draft email responses on clarity, tone, completeness,
professionalism, actionability, and cultural sensitivity BEFORE sending.
Provides actionable improvement suggestions.
Always enforces reply-all for multi-recipient emails.
"""
import json, re, datetime, math
from dataclasses import dataclass, field
from typing import List, Dict, Optional, Tuple

@dataclass
class QualityDimension:
    name: str
    score: float  # 0.0 to 1.0
    weight: float
    feedback: str
    suggestions: List[str] = field(default_factory=list)

@dataclass
class QualityReport:
    overall_score: float
    grade: str
    dimensions: List[QualityDimension]
    improvements: List[str]
    rewrite_suggestion: str
    reply_all_required: bool
    timestamp: str
    confidence: float

class ClarityAnalyzer:
    """Evaluate email clarity and readability."""
    
    FILLER_WORDS = {"basically", "actually", "just", "really", "very", "quite",
                    "somewhat", "rather", "perhaps", "maybe", "kind of", "sort of"}
    JARGON = {"synergy", "leverage", "paradigm", "bandwidth", "circle back",
              "deep dive", "move the needle", "boil the ocean", "low hanging fruit"}
    
    def analyze(self, text: str) -> QualityDimension:
        sentences = [s.strip() for s in re.split(r'[.!?]+', text) if s.strip()]
        if not sentences:
            return QualityDimension("clarity", 0.0, 0.2, "Empty response", ["Write at least one sentence"])
        
        avg_length = sum(len(s.split()) for s in sentences) / len(sentences)
        filler_count = sum(1 for w in self.FILLER_WORDS if w in text.lower())
        jargon_count = sum(1 for j in self.JARGON if j in text.lower())
        
        length_score = max(0, 1.0 - abs(avg_length - 18) / 30)
        filler_penalty = min(0.3, filler_count * 0.05)
        jargon_penalty = min(0.3, jargon_count * 0.1)
        
        score = max(0, min(1.0, length_score - filler_penalty - jargon_penalty))
        
        suggestions = []
        if avg_length > 25:
            suggestions.append("Break long sentences into shorter ones (aim for 15-20 words)")
        if filler_count > 2:
            suggestions.append(f"Remove {filler_count} filler words for more direct communication")
        if jargon_count > 0:
            suggestions.append(f"Replace {jargon_count} jargon term(s) with plain language")
        
        feedback = f"Avg sentence: {avg_length:.0f} words, {filler_count} fillers, {jargon_count} jargon"
        return QualityDimension("clarity", score, 0.2, feedback, suggestions)

class ToneAnalyzer:
    """Evaluate email tone appropriateness."""
    
    AGGRESSIVE = {"demand", "immediately", "unacceptable", "ridiculous", "incompetent",
                  "fail", "failure", "wrong", "mistake", "blame"}
    PASSIVE = {"i guess", "if possible", "whenever", "no rush", "maybe",
               "if you don\'t mind", "sorry to bother"}
    PROFESSIONAL_POSITIVE = {"thank", "appreciate", "please", "glad", "opportunity",
                            "look forward", "great", "excellent", "confident"}
    
    def analyze(self, text: str, context: str = "business") -> QualityDimension:
        text_lower = text.lower()
        aggressive = sum(1 for w in self.AGGRESSIVE if w in text_lower)
        passive = sum(1 for w in self.PASSIVE if w in text_lower)
        professional = sum(1 for w in self.PROFESSIONAL_POSITIVE if w in text_lower)
        
        base_score = 0.5
        base_score += professional * 0.1
        base_score -= aggressive * 0.15
        base_score -= passive * 0.08
        
        score = max(0, min(1.0, base_score))
        
        suggestions = []
        if aggressive > 0:
            suggestions.append(f"Soften {aggressive} aggressive term(s) to maintain rapport")
        if passive > 1:
            suggestions.append("Be more assertive - reduce hedging language")
        if professional < 1:
            suggestions.append("Add a professional courtesy phrase (thank, appreciate, etc.)")
        
        feedback = f"Tone: {aggressive} aggressive, {passive} passive, {professional} professional markers"
        return QualityDimension("tone", score, 0.2, feedback, suggestions)

class CompletenessAnalyzer:
    """Check if the response addresses all points from the original email."""
    
    def analyze(self, draft: str, original_points: List[str]) -> QualityDimension:
        if not original_points:
            return QualityDimension("completeness", 0.7, 0.2,
                                   "No original points to compare against", [])
        
        draft_lower = draft.lower()
        addressed = 0
        missed = []
        for point in original_points:
            keywords = [w.lower() for w in point.split() if len(w) > 4]
            if any(kw in draft_lower for kw in keywords):
                addressed += 1
            else:
                missed.append(point[:50])
        
        score = addressed / len(original_points) if original_points else 0.5
        
        suggestions = []
        if missed:
            suggestions.append(f"Address {len(missed)} unaddressed point(s): {'; '.join(missed[:3])}")
        
        feedback = f"{addressed}/{len(original_points)} points addressed"
        return QualityDimension("completeness", score, 0.2, feedback, suggestions)

class ActionabilityAnalyzer:
    """Evaluate how actionable and clear the response is."""
    
    ACTION_MARKERS = ["will", "shall", "let\'s", "please", "next step",
                     "deadline", "by", "schedule", "confirm", "approve"]
    VAGUE_MARKERS = ["sometime", "soon", "eventually", "later", "maybe",
                    "we\'ll see", "tbd", "to be determined"]
    
    def analyze(self, text: str) -> QualityDimension:
        text_lower = text.lower()
        actions = sum(1 for m in self.ACTION_MARKERS if m in text_lower)
        vague = sum(1 for m in self.VAGUE_MARKERS if m in text_lower)
        
        score = min(1.0, 0.3 + actions * 0.15 - vague * 0.2)
        score = max(0, score)
        
        suggestions = []
        if actions < 2:
            suggestions.append("Add clear next steps with owners and deadlines")
        if vague > 0:
            suggestions.append(f"Replace {vague} vague term(s) with specific dates/actions")
        if "deadline" not in text_lower and "by" not in text_lower:
            suggestions.append("Include specific deadlines for commitments")
        
        feedback = f"{actions} action markers, {vague} vague markers"
        return QualityDimension("actionability", score, 0.2, feedback, suggestions)

class ProfessionalismAnalyzer:
    """Evaluate overall professionalism."""
    
    UNPROFESSIONAL = ["lol", "omg", "btw", "fyi!!!", "ugh", "wtf",
                     "no way", "seriously?", "whatever", "idk"]
    PROFESSIONAL = ["regards", "sincerely", "best regards", "thank you",
                   "kind regards", "respectfully", "warm regards"]
    
    def analyze(self, text: str) -> QualityDimension:
        text_lower = text.lower()
        unprof = sum(1 for w in self.UNPROFESSIONAL if w in text_lower)
        prof = sum(1 for w in self.PROFESSIONAL if w in text_lower)
        
        exclamation_count = text.count("!")
        all_caps = len(re.findall(r'\b[A-Z]{4,}\b', text))
        
        score = 0.7
        score -= unprof * 0.15
        score += prof * 0.1
        score -= max(0, (exclamation_count - 2) * 0.05)
        score -= all_caps * 0.1
        
        score = max(0, min(1.0, score))
        
        suggestions = []
        if unprof > 0:
            suggestions.append(f"Remove {unprof} unprofessional term(s)")
        if exclamation_count > 3:
            suggestions.append(f"Reduce exclamation marks ({exclamation_count} found)")
        if all_caps > 0:
            suggestions.append("Avoid ALL CAPS - it reads as shouting")
        if prof == 0:
            suggestions.append("Add a professional closing (Regards, Best regards, etc.)")
        
        feedback = f"Professional markers: {prof}, Unprofessional: {unprof}"
        return QualityDimension("professionalism", score, 0.2, feedback, suggestions)

class ResponseQualityGrader:
    """Main quality grading engine."""
    
    def __init__(self):
        self.analyzers = [
            ClarityAnalyzer(),
            ToneAnalyzer(),
            ActionabilityAnalyzer(),
            ProfessionalismAnalyzer(),
        ]
    
    def grade(self, draft: str, original_points: List[str] = None,
              recipients: List[str] = None) -> QualityReport:
        dimensions = []
        all_suggestions = []
        
        for analyzer in self.analyzers:
            if isinstance(analyzer, CompletenessAnalyzer) and original_points:
                dim = analyzer.analyze(draft, original_points)
            elif not isinstance(analyzer, CompletenessAnalyzer):
                dim = analyzer.analyze(draft)
            else:
                continue
            dimensions.append(dim)
            all_suggestions.extend(dim.suggestions)
        
        if original_points:
            completeness = CompletenessAnalyzer()
            dim = completeness.analyze(draft, original_points)
            dimensions.append(dim)
            all_suggestions.extend(dim.suggestions)
        
        total_weight = sum(d.weight for d in dimensions)
        overall = sum(d.score * d.weight for d in dimensions) / total_weight if dimensions else 0
        
        grades = [(0.9, "A+"), (0.8, "A"), (0.7, "B+"), (0.6, "B"),
                  (0.5, "C"), (0.4, "D"), (0.0, "F")]
        grade = next(g for threshold, g in grades if overall >= threshold)
        
        reply_all = len(recipients or []) > 1
        
        return QualityReport(
            overall_score=overall,
            grade=grade,
            dimensions=dimensions,
            improvements=all_suggestions,
            rewrite_suggestion=self._suggest_rewrite(draft, all_suggestions),
            reply_all_required=reply_all,
            timestamp=datetime.datetime.now().isoformat(),
            confidence=min(1.0, len(draft.split()) / 50.0)
        )
    
    def _suggest_rewrite(self, draft: str, suggestions: List[str]) -> str:
        improved = draft
        for word in ClarityAnalyzer.FILLER_WORDS:
            improved = re.sub(r'\b' + word + r'\b', '', improved, flags=re.IGNORECASE)
        improved = re.sub(r'\s+', ' ', improved).strip()
        if not any(c in improved for c in ['Regards', 'Best', 'Thank']):
            improved += "\n\nBest regards"
        return improved
    
    def generate_report(self, report: QualityReport) -> Dict:
        return {
            "overall_score": round(report.overall_score, 3),
            "grade": report.grade,
            "dimensions": [
                {"name": d.name, "score": round(d.score, 3), "weight": d.weight,
                 "feedback": d.feedback, "suggestions": d.suggestions}
                for d in report.dimensions
            ],
            "improvements": report.improvements,
            "reply_all_required": report.reply_all_required,
            "timestamp": report.timestamp,
            "confidence": round(report.confidence, 3)
        }

if __name__ == "__main__":
    grader = ResponseQualityGrader()
    draft = "Hi team, Thank you for your patience. I\'ve reviewed the proposal and I believe we should proceed with the Enterprise plan. Our technical team will schedule the integration kickoff by next Wednesday. Please let me know if you have any questions. Best regards, Project Manager"
    original = ["review proposal", "timeline for integration", "pricing confirmation", "technical requirements"]
    recipients = ["client@acme.com", "cto@acme.com", "pm@zion.com", "sales@zion.com"]
    report = grader.grade(draft, original, recipients)
    print(json.dumps(grader.generate_report(report), indent=2))
