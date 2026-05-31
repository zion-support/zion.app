#!/usr/bin/env python3
"""V553 - Meeting Effectiveness Analyzer
Evaluates meeting requests for ROI, suggests alternatives, and tracks outcomes.
CRITICAL: Always enforces reply-all for multi-recipient emails.
"""
import json
from datetime import datetime
from typing import Dict, List

class MeetingEffectivenessAnalyzer:
    def __init__(self):
        self.reply_all_enforced = True
    
    def analyze_meeting_request(self, email: Dict) -> Dict:
        """Analyze meeting request for effectiveness"""
        analysis = {
            "engine": "V553_Meeting_Effectiveness_Analyzer",
            "timestamp": datetime.now().isoformat(),
            "meeting_detected": self._is_meeting_request(email),
            "roi_estimate": self._estimate_meeting_roi(email),
            "alternative_suggestions": [],
            "participant_analysis": self._analyze_participants(email),
            "agenda_quality": self._evaluate_agenda(email),
            "recommendations": [],
            "reply_all_enforced": self.reply_all_enforced,
            "all_recipients": email.get("to", []) + email.get("cc", [])
        }
        
        analysis["alternative_suggestions"] = self._suggest_alternatives(email, analysis["roi_estimate"])
        analysis["recommendations"] = self._generate_recommendations(analysis)
        
        return analysis
    
    def _is_meeting_request(self, email: Dict) -> bool:
        """Detect if email is a meeting request"""
        body = email.get("body", "").lower()
        subject = email.get("subject", "").lower()
        
        meeting_keywords = ["meeting", "call", "discuss", "sync", "catch up", "schedule", "calendar"]
        return any(kw in body or kw in subject for kw in meeting_keywords)
    
    def _estimate_meeting_roi(self, email: Dict) -> Dict:
        """Estimate meeting ROI"""
        participants = len(email.get("to", [])) + len(email.get("cc", []))
        duration = self._estimate_duration(email)
        
        # Estimate cost (avg $50/hour per participant)
        hourly_rate = 50
        total_cost = participants * (duration / 60) * hourly_rate
        
        # Estimate value based on meeting type
        body = email.get("body", "").lower()
        value_multiplier = 1.0
        
        if any(w in body for w in ["decision", "approval", "sign-off"]):
            value_multiplier = 3.0  # High value decision meetings
        elif any(w in body for w in ["strategy", "planning", "roadmap"]):
            value_multiplier = 2.5  # Strategic planning
        elif any(w in body for w in ["status", "update", "check-in"]):
            value_multiplier = 1.2  # Status updates
        elif any(w in body for w in ["brainstorm", "ideation"]):
            value_multiplier = 2.0  # Creative sessions
        
        estimated_value = total_cost * value_multiplier
        roi = (estimated_value - total_cost) / total_cost if total_cost > 0 else 0
        
        return {
            "participant_count": participants,
            "estimated_duration_minutes": duration,
            "total_cost": round(total_cost, 2),
            "estimated_value": round(estimated_value, 2),
            "roi_percentage": round(roi * 100, 2),
            "effectiveness_rating": self._rate_effectiveness(roi)
        }
    
    def _estimate_duration(self, email: Dict) -> int:
        """Estimate meeting duration in minutes"""
        body = email.get("body", "").lower()
        
        if "quick" in body or "brief" in body:
            return 15
        elif "30 min" in body or "half hour" in body:
            return 30
        elif "hour" in body or "60 min" in body:
            return 60
        elif "2 hour" in body:
            return 120
        return 30  # Default
    
    def _rate_effectiveness(self, roi: float) -> str:
        """Rate meeting effectiveness based on ROI"""
        if roi > 2.0:
            return "excellent"
        elif roi > 1.0:
            return "good"
        elif roi > 0.5:
            return "moderate"
        else:
            return "low"
    
    def _analyze_participants(self, email: Dict) -> Dict:
        """Analyze meeting participants"""
        all_participants = email.get("to", []) + email.get("cc", [])
        
        analysis = {
            "total_participants": len(all_participants),
            "role_distribution": self._categorize_participants(all_participants),
            "optimal_size": self._is_optimal_size(len(all_participants)),
            "key_decision_makers": self._identify_decision_makers(all_participants)
        }
        
        return analysis
    
    def _categorize_participants(self, participants: List[str]) -> Dict:
        """Categorize participants by role"""
        categories = {"executive": 0, "manager": 0, "individual_contributor": 0, "external": 0}
        
        for p in participants:
            p_lower = p.lower()
            if any(role in p_lower for role in ["ceo", "cto", "cfo", "director", "vp"]):
                categories["executive"] += 1
            elif any(role in p_lower for role in ["manager", "lead"]):
                categories["manager"] += 1
            elif "@" in p and "zion" not in p:
                categories["external"] += 1
            else:
                categories["individual_contributor"] += 1
        
        return categories
    
    def _is_optimal_size(self, count: int) -> Dict:
        """Check if meeting size is optimal"""
        if count <= 2:
            return {"optimal": True, "recommendation": "Good size for focused discussion"}
        elif count <= 5:
            return {"optimal": True, "recommendation": "Optimal for collaborative work"}
        elif count <= 8:
            return {"optimal": False, "recommendation": "Consider breaking into smaller groups"}
        else:
            return {"optimal": False, "recommendation": "Too large - consider async alternatives"}
    
    def _identify_decision_makers(self, participants: List[str]) -> List[str]:
        """Identify key decision makers"""
        decision_makers = []
        for p in participants:
            p_lower = p.lower()
            if any(role in p_lower for role in ["ceo", "cto", "cfo", "director", "vp", "manager"]):
                decision_makers.append(p)
        return decision_makers
    
    def _evaluate_agenda(self, email: Dict) -> Dict:
        """Evaluate meeting agenda quality"""
        body = email.get("body", "")
        
        evaluation = {
            "has_agenda": False,
            "clarity": "unclear",
            "specificity": "low",
            "action_oriented": False
        }
        
        if "agenda" in body.lower() or "topics" in body.lower():
            evaluation["has_agenda"] = True
            evaluation["clarity"] = "clear"
        
        if any(w in body.lower() for w in ["discuss", "review", "decide", "plan"]):
            evaluation["specificity"] = "medium"
        
        if any(w in body.lower() for w in ["decision", "action", "outcome", "deliverable"]):
            evaluation["action_oriented"] = True
            evaluation["specificity"] = "high"
        
        return evaluation
    
    def _suggest_alternatives(self, email: Dict, roi: Dict) -> List[Dict]:
        """Suggest alternatives to meeting"""
        alternatives = []
        
        if roi["effectiveness_rating"] == "low":
            alternatives.append({
                "type": "email_thread",
                "description": "Use structured email thread for async discussion",
                "benefit": "Saves time, allows thoughtful responses"
            })
            
            alternatives.append({
                "type": "shared_document",
                "description": "Collaborate on shared document with comments",
                "benefit": "Permanent record, async collaboration"
            })
        
        if roi["participant_count"] > 5:
            alternatives.append({
                "type": "smaller_groups",
                "description": "Break into smaller focused meetings",
                "benefit": "More efficient, better engagement"
            })
        
        if not self._evaluate_agenda(email)["has_agenda"]:
            alternatives.append({
                "type": "async_status_update",
                "description": "Share status via email or dashboard",
                "benefit": "No meeting needed for information sharing"
            })
        
        return alternatives
    
    def _generate_recommendations(self, analysis: Dict) -> List[Dict]:
        """Generate meeting recommendations"""
        recommendations = []
        
        if not analysis["meeting_detected"]:
            return recommendations
        
        roi = analysis["roi_estimate"]
        
        if roi["effectiveness_rating"] == "excellent":
            recommendations.append({
                "type": "proceed",
                "message": "Meeting has high ROI - proceed as planned",
                "priority": "info"
            })
        elif roi["effectiveness_rating"] == "low":
            recommendations.append({
                "type": "reconsider",
                "message": "Meeting has low ROI - consider alternatives",
                "priority": "high"
            })
        
        if not analysis["participant_analysis"]["optimal_size"]["optimal"]:
            recommendations.append({
                "type": "optimize_size",
                "message": analysis["participant_analysis"]["optimal_size"]["recommendation"],
                "priority": "medium"
            })
        
        if not analysis["agenda_quality"]["has_agenda"]:
            recommendations.append({
                "type": "add_agenda",
                "message": "Add clear agenda and expected outcomes",
                "priority": "high"
            })
        
        return recommendations

if __name__ == "__main__":
    engine = MeetingEffectivenessAnalyzer()
    test = {
        "subject": "Quick sync on project status",
        "body": "Let's have a quick 30 min meeting to discuss the project status and next steps.",
        "to": ["team@zion.com", "manager@zion.com"],
        "cc": ["director@zion.com"]
    }
    result = engine.analyze_meeting_request(test)
    print(json.dumps(result, indent=2))
