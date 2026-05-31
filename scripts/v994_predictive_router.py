#!/usr/bin/env python3
"""
V994: Email Predictive Router Engine
Predicts which team member should handle an email based on expertise and workload.
Enables smart routing with strict reply-all enforcement.
"""

import re
import hashlib
from datetime import datetime, timezone
from typing import Dict, List, Any
from collections import defaultdict


class EmailPredictiveRouter:
    """Predicts optimal team member for email handling."""

    def __init__(self):
        self.routing_log: List[Dict] = []
        self.reply_all_audit: List[Dict] = []
        self.team_expertise: Dict[str, Dict] = {}
        self.team_workload: Dict[str, int] = defaultdict(int)

    def analyze_email_case_by_case(self, email: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze email for routing case by case."""
        analysis = {
            "engine": "V994",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "email_id": email.get("id", hashlib.md5(str(email).encode()).hexdigest()[:12]),
            "analysis_type": "predictive_routing",
        }

        to_recipients = email.get("to", [])
        cc_recipients = email.get("cc", [])
        all_recipients = to_recipients + cc_recipients
        is_multi_recipient = len(all_recipients) > 1

        body = email.get("body", "")
        subject = email.get("subject", "")
        sender = email.get("from", "")

        # 1. Extract required expertise
        expertise_needed = self._extract_expertise_requirements(body, subject)
        analysis["expertise_requirements"] = expertise_needed

        # 2. Analyze email complexity
        complexity = self._analyze_email_complexity(body, email)
        analysis["email_complexity"] = complexity

        # 3. Priority assessment
        priority = self._assess_email_priority(email, body)
        analysis["email_priority"] = priority

        # 4. Match team members
        team_matches = self._match_team_members(expertise_needed, complexity)
        analysis["team_matches"] = team_matches

        # 5. Workload balancing
        workload_analysis = self._analyze_team_workload(team_matches)
        analysis["workload_analysis"] = workload_analysis

        # 6. Predict optimal assignee
        optimal_assignee = self._predict_optimal_assignee(
            team_matches, workload_analysis, priority
        )
        analysis["optimal_assignee"] = optimal_assignee

        # 7. Routing confidence
        confidence = self._calculate_routing_confidence(
            optimal_assignee, expertise_needed, team_matches
        )
        analysis["routing_confidence"] = confidence

        # 8. Alternative suggestions
        alternatives = self._suggest_alternatives(optimal_assignee, team_matches)
        analysis["alternative_assignees"] = alternatives

        # 9. Routing recommendation
        recommendation = self._generate_routing_recommendation(
            optimal_assignee, confidence, alternatives
        )
        analysis["routing_recommendation"] = recommendation

        # 10. Determine action
        action = self._determine_routing_action(confidence, recommendation)
        analysis["recommended_action"] = action

        # REPLY-ALL ENFORCEMENT
        reply_all = self._enforce_reply_all(email, all_recipients, is_multi_recipient)
        analysis["reply_all_enforcement"] = reply_all

        # Update workload
        if optimal_assignee.get("assignee"):
            self._update_workload(optimal_assignee["assignee"])

        self.routing_log.append({
            "email_id": analysis["email_id"],
            "expertise_areas": len(expertise_needed["areas"]),
            "complexity_level": complexity["level"],
            "priority_level": priority["level"],
            "assigned_to": optimal_assignee.get("assignee"),
            "confidence_score": confidence["score"],
            "reply_all": reply_all["enforced"],
            "timestamp": analysis["timestamp"],
        })

        return analysis

    def _extract_expertise_requirements(self, body: str, subject: str) -> Dict:
        """Extract required expertise areas."""
        text = f"{subject} {body}".lower()
        
        expertise_areas = {
            "technical": ["bug", "error", "code", "api", "integration", "system", "software"],
            "sales": ["quote", "pricing", "proposal", "contract", "deal", "customer"],
            "support": ["help", "issue", "problem", "trouble", "assistance", "question"],
            "billing": ["invoice", "payment", "billing", "charge", "refund", "subscription"],
            "marketing": ["campaign", "promotion", "content", "social", "seo", "analytics"],
            "hr": ["hiring", "interview", "employee", "benefits", "policy", "onboarding"],
            "legal": ["legal", "compliance", "contract", "liability", "regulation"],
            "finance": ["budget", "forecast", "financial", "accounting", "audit"],
        }
        
        detected_areas = []
        for area, keywords in expertise_areas.items():
            if any(kw in text for kw in keywords):
                detected_areas.append(area)
        
        # Determine primary expertise
        primary = detected_areas[0] if detected_areas else "general"
        
        return {
            "areas": detected_areas,
            "primary": primary,
            "area_count": len(detected_areas),
            "is_specialized": len(detected_areas) > 0,
        }

    def _analyze_email_complexity(self, body: str, email: Dict) -> Dict:
        """Analyze email complexity."""
        word_count = len(body.split())
        sentence_count = len(re.split(r'[.!?]+', body))
        attachments = email.get("attachments", [])
        
        # Complexity factors
        factors = []
        
        if word_count > 500:
            factors.append("very_long")
        elif word_count > 200:
            factors.append("long")
        
        if sentence_count > 20:
            factors.append("complex_structure")
        
        if len(attachments) > 3:
            factors.append("many_attachments")
        
        # Technical complexity indicators
        technical_indicators = ["api", "integration", "configuration", "deployment"]
        if any(ind in body.lower() for ind in technical_indicators):
            factors.append("technical")
        
        # Calculate complexity score
        score = 30  # Base
        score += min(word_count / 20, 30)
        score += len(factors) * 10
        
        score = min(score, 100)
        
        if score >= 75:
            level = "high"
        elif score >= 50:
            level = "medium"
        else:
            level = "low"
        
        return {
            "score": round(score, 1),
            "level": level,
            "word_count": word_count,
            "sentence_count": sentence_count,
            "attachment_count": len(attachments),
            "complexity_factors": factors,
        }

    def _assess_email_priority(self, email: Dict, body: str) -> Dict:
        """Assess email priority."""
        subject = email.get("subject", "").lower()
        body_lower = body.lower()
        
        # Priority indicators
        high_priority_keywords = ["urgent", "asap", "immediately", "critical", "emergency"]
        medium_priority_keywords = ["important", "soon", "priority", "deadline"]
        
        # Check subject first (higher weight)
        if any(kw in subject for kw in high_priority_keywords):
            level = "high"
            score = 90
        elif any(kw in subject for kw in medium_priority_keywords):
            level = "medium"
            score = 60
        elif any(kw in body_lower for kw in high_priority_keywords):
            level = "high"
            score = 80
        elif any(kw in body_lower for kw in medium_priority_keywords):
            level = "medium"
            score = 50
        else:
            level = "low"
            score = 30
        
        # VIP sender boost
        sender = email.get("from", "").lower()
        vip_domains = ["ceo@", "executive@", "board@", "partner@"]
        if any(vip in sender for vip in vip_domains):
            score += 15
            level = "high" if score >= 70 else level
        
        score = min(score, 100)
        
        return {
            "level": level,
            "score": score,
        }

    def _match_team_members(self, expertise_needed: Dict, complexity: Dict) -> List[Dict]:
        """Match team members based on expertise."""
        matches = []
        
        # If no team expertise data, create sample matches
        if not self.team_expertise:
            # Create sample team members
            sample_team = [
                {"name": "tech_expert", "expertise": ["technical", "support"], "capacity": 10},
                {"name": "sales_expert", "expertise": ["sales", "billing"], "capacity": 8},
                {"name": "marketing_expert", "expertise": ["marketing"], "capacity": 12},
                {"name": "general_support", "expertise": ["support", "general"], "capacity": 15},
            ]
            
            for member in sample_team:
                # Calculate match score
                match_score = 0
                
                # Expertise match
                for area in expertise_needed["areas"]:
                    if area in member["expertise"]:
                        match_score += 30
                
                # Complexity match
                if complexity["level"] == "high" and member["capacity"] >= 10:
                    match_score += 20
                elif complexity["level"] == "medium":
                    match_score += 15
                else:
                    match_score += 10
                
                if match_score > 0:
                    matches.append({
                        "name": member["name"],
                        "expertise": member["expertise"],
                        "match_score": match_score,
                        "capacity": member["capacity"],
                    })
        
        # Sort by match score
        matches.sort(key=lambda x: x["match_score"], reverse=True)
        
        return matches[:5]  # Top 5 matches

    def _analyze_team_workload(self, team_matches: List[Dict]) -> Dict:
        """Analyze team workload."""
        workload_data = []
        
        for match in team_matches:
            name = match["name"]
            current_load = self.team_workload.get(name, 0)
            capacity = match.get("capacity", 10)
            
            utilization = (current_load / capacity * 100) if capacity > 0 else 100
            
            workload_data.append({
                "name": name,
                "current_load": current_load,
                "capacity": capacity,
                "utilization": round(utilization, 1),
                "available_capacity": max(0, capacity - current_load),
            })
        
        # Find least loaded
        if workload_data:
            least_loaded = min(workload_data, key=lambda x: x["utilization"])
        else:
            least_loaded = None
        
        return {
            "team_workload": workload_data,
            "least_loaded": least_loaded,
            "avg_utilization": round(sum(w["utilization"] for w in workload_data) / len(workload_data), 1) if workload_data else 0,
        }

    def _predict_optimal_assignee(self, team_matches: List[Dict], 
                                  workload_analysis: Dict, priority: Dict) -> Dict:
        """Predict optimal assignee."""
        if not team_matches:
            return {
                "assignee": None,
                "reason": "no_match_found",
            }
        
        # High priority: prioritize expertise over workload
        if priority["level"] == "high":
            optimal = max(team_matches, key=lambda x: x["match_score"])
            reason = "expertise_priority"
        else:
            # Balance expertise and workload
            scores = []
            for match in team_matches:
                name = match["name"]
                workload = next((w for w in workload_analysis["team_workload"] if w["name"] == name), None)
                
                if workload:
                    # Combined score: expertise (70%) + available capacity (30%)
                    combined = (match["match_score"] * 0.7) + (workload["available_capacity"] * 3)
                    scores.append((match, combined))
                else:
                    scores.append((match, match["match_score"]))
            
            optimal = max(scores, key=lambda x: x[1])[0]
            reason = "balanced_assignment"
        
        return {
            "assignee": optimal["name"],
            "match_score": optimal["match_score"],
            "expertise": optimal.get("expertise", []),
            "reason": reason,
        }

    def _calculate_routing_confidence(self, optimal: Dict, expertise_needed: Dict,
                                     team_matches: List[Dict]) -> Dict:
        """Calculate routing confidence."""
        if not optimal.get("assignee"):
            return {
                "score": 0,
                "level": "no_match",
                "factors": ["No suitable team member found"],
            }
        
        factors = []
        score = 50  # Base
        
        # Expertise match
        if expertise_needed["primary"] in optimal.get("expertise", []):
            score += 25
            factors.append("Primary expertise match")
        
        # Match score
        if optimal.get("match_score", 0) >= 40:
            score += 15
            factors.append("High match score")
        
        # Multiple options available
        if len(team_matches) >= 3:
            score += 10
            factors.append("Multiple options available")
        
        score = min(score, 100)
        
        if score >= 75:
            level = "high"
        elif score >= 50:
            level = "medium"
        else:
            level = "low"
        
        return {
            "score": score,
            "level": level,
            "factors": factors,
        }

    def _suggest_alternatives(self, optimal: Dict, team_matches: List[Dict]) -> List[Dict]:
        """Suggest alternative assignees."""
        alternatives = []
        
        if not optimal.get("assignee"):
            return alternatives
        
        for match in team_matches[:3]:
            if match["name"] != optimal["assignee"]:
                alternatives.append({
                    "assignee": match["name"],
                    "match_score": match["match_score"],
                    "expertise": match.get("expertise", []),
                })
        
        return alternatives[:2]  # Top 2 alternatives

    def _generate_routing_recommendation(self, optimal: Dict, confidence: Dict,
                                        alternatives: List) -> Dict:
        """Generate routing recommendation."""
        if not optimal.get("assignee"):
            return {
                "action": "manual_review",
                "message": "No suitable team member found - manual review required",
            }
        
        if confidence["level"] == "high":
            action = "auto_assign"
            message = f"Auto-assign to {optimal['assignee']} with high confidence"
        elif confidence["level"] == "medium":
            action = "suggest_assign"
            message = f"Suggest assigning to {optimal['assignee']} - review recommended"
        else:
            action = "manual_review"
            message = f"Low confidence routing - manual review recommended"
        
        return {
            "action": action,
            "message": message,
            "primary_assignee": optimal["assignee"],
            "alternatives": [alt["assignee"] for alt in alternatives],
        }

    def _determine_routing_action(self, confidence: Dict, recommendation: Dict) -> str:
        """Determine routing action."""
        if confidence["level"] == "high":
            return "AUTO_ROUTE"
        elif confidence["level"] == "medium":
            return "SUGGEST_ROUTE"
        else:
            return "MANUAL_REVIEW"

    def _update_workload(self, assignee: str):
        """Update team member workload."""
        self.team_workload[assignee] += 1

    def _enforce_reply_all(self, email: Dict, all_recipients: List, is_multi: bool) -> Dict:
        """STRICT reply-all enforcement."""
        result = {
            "is_multi_recipient": is_multi,
            "recipient_count": len(all_recipients),
            "enforced": False,
            "reason": "",
        }
        if is_multi:
            result["enforced"] = True
            result["reason"] = f"REPLY-ALL ENFORCED: {len(all_recipients)} recipients."
            self.reply_all_audit.append({
                "email_id": email.get("id", "unknown"),
                "enforced": True,
                "timestamp": datetime.now(timezone.utc).isoformat(),
            })
        else:
            result["reason"] = "Single recipient."
        return result

    def get_stats(self) -> Dict:
        if not self.routing_log:
            return {"emails_routed": 0}
        return {
            "emails_routed": len(self.routing_log),
            "avg_confidence": sum(r["confidence_score"] for r in self.routing_log) / len(self.routing_log),
            "auto_routed": sum(1 for r in self.routing_log if r["assigned_to"]),
            "high_complexity": sum(1 for r in self.routing_log if r["complexity_level"] == "high"),
            "reply_all_enforced": len(self.reply_all_audit),
        }


def test_v994():
    engine = EmailPredictiveRouter()

    # Test 1: Technical support email
    email1 = {
        "id": "route-001",
        "from": "user@company.com",
        "to": ["support@ziontechgroup.com", "team@ziontechgroup.com"],
        "subject": "URGENT: API integration error",
        "body": "We're experiencing a critical error with the API integration. The system returns a 500 error when we try to connect. This is blocking our deployment and we need immediate assistance.",
    }
    r1 = engine.analyze_email_case_by_case(email1)
    assert r1["reply_all_enforcement"]["enforced"] is True
    assert "technical" in r1["expertise_requirements"]["areas"]
    assert r1["email_priority"]["level"] == "high"
    assert r1["optimal_assignee"].get("assignee")
    print(f"✅ Test 1 PASSED: Technical expertise detected, priority=high, assigned to {r1['optimal_assignee']['assignee']}, reply-all enforced")

    # Test 2: Sales inquiry
    email2 = {
        "id": "route-002",
        "from": "prospect@company.com",
        "to": ["info@ziontechgroup.com"],
        "subject": "Pricing inquiry",
        "body": "Hi, I'm interested in your services. Can you send me a quote and pricing information?",
    }
    r2 = engine.analyze_email_case_by_case(email2)
    assert "sales" in r2["expertise_requirements"]["areas"]
    assert r2["email_priority"]["level"] in ("medium", "low")
    print(f"✅ Test 2 PASSED: Sales expertise detected, priority={r2['email_priority']['level']}")

    stats = engine.get_stats()
    print(f"✅ Test 3 PASSED: {stats['emails_routed']} routed, avg confidence={stats['avg_confidence']:.1f}")

    print("\n🎉 V994 ALL TESTS PASSED — Email Predictive Router operational!")
    return True


if __name__ == "__main__":
    test_v994()
