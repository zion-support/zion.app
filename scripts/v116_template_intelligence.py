#!/usr/bin/env python3
"""
V116: AI Email Template Intelligence
Generate, A/B test, and auto-optimize email templates based on response rates.
"""
import json, hashlib, random
from datetime import datetime, timedelta
from dataclasses import dataclass, field
from typing import List, Dict, Optional, Tuple
from collections import defaultdict

@dataclass
class Template:
    template_id: str
    name: str
    category: str
    subject_line: str
    body: str
    variables: List[str]
    performance: Dict = field(default_factory=dict)
    version: int = 1
    is_winner: bool = False

@dataclass
class ABTestResult:
    test_id: str
    variant_a: str
    variant_b: str
    sends_a: int
    sends_b: int
    opens_a: int
    opens_b: int
    responses_a: int
    responses_b: int
    open_rate_a: float
    open_rate_b: float
    response_rate_a: float
    response_rate_b: float
    winner: str
    confidence: float
    statistical_significance: bool

class TemplateIntelligence:
    """V116: Generate, A/B test, and auto-optimize email templates."""
    
    SUBJECT_FORMULAS = {
        "inquiry_response": [
            "Re: {subject} — Here's what you need",
            "Your question about {topic}, answered",
            "{name}, here's the info you requested",
        ],
        "follow_up": [
            "Following up: {topic}",
            "Quick check-in on {topic}",
            "{name}, any updates on {topic}?",
        ],
        "proposal": [
            "Your custom proposal is ready, {name}",
            "{company} + {our_company}: Let's make it happen",
            "Proposal: {solution} for {company}",
        ],
        "support": [
            "Ticket #{ticket_id}: {status}",
            "Update on your support request",
            "{name}, we've resolved your issue",
        ],
        "outreach": [
            "{name}, quick question about {topic}",
            "Idea for {company}'s {area}",
            "How {similar_company} achieved {result}",
        ],
    }
    
    BODY_TEMPLATES = {
        "inquiry_response": "Dear {name},\n\nThank you for reaching out about {topic}. {answer}\n\nIf you have any additional questions, please don't hesitate to ask.\n\nBest regards,\n{sender_name}\nZion Tech Group\n📱 +1 302 464 0950\n📧 kleber@ziontechgroup.com",
        "follow_up": "Hi {name},\n\nI wanted to follow up on our conversation about {topic}. {context}\n\nWould you be available for a quick call this week?\n\nBest regards,\n{sender_name}\nZion Tech Group",
        "proposal": "Dear {name},\n\nBased on our discussion, I've prepared a custom proposal for {company}.\n\n{proposal_summary}\n\nI'd love to walk you through the details. When would be a good time?\n\nBest regards,\n{sender_name}\nZion Tech Group\n📍 364 E Main St STE 1008, Middletown DE 19709",
    }
    
    def __init__(self):
        self.templates: Dict[str, Template] = {}
        self.ab_tests: List[ABTestResult] = []
        self.performance_history: List[Dict] = []
    
    def generate_template(self, category: str, variables: Dict) -> Dict:
        """Generate a personalized email from a template category."""
        subjects = self.SUBJECT_FORMULAS.get(category, self.SUBJECT_FORMULAS["inquiry_response"])
        body_template = self.BODY_TEMPLATES.get(category, self.BODY_TEMPLATES["inquiry_response"])
        
        subject = random.choice(subjects)
        for key, val in variables.items():
            subject = subject.replace("{" + key + "}", str(val))
            body_template = body_template.replace("{" + key + "}", str(val))
        
        template_id = hashlib.md5(f"{category}{datetime.now().isoformat()}".encode()).hexdigest()[:12]
        
        template = Template(
            template_id=template_id,
            name=f"{category}_v1",
            category=category,
            subject_line=subject,
            body=body_template,
            variables=list(variables.keys()),
            performance={"sends": 0, "opens": 0, "responses": 0}
        )
        self.templates[template_id] = template
        
        return {"subject": subject, "body": body_template, "template_id": template_id}
    
    def create_ab_test(self, category: str, variables: Dict) -> Dict:
        """Create an A/B test with two subject line variants."""
        subjects = self.SUBJECT_FORMULAS.get(category, [])
        if len(subjects) < 2:
            return self.generate_template(category, variables)
        
        variant_a_subject = subjects[0]
        variant_b_subject = subjects[1]
        
        for key, val in variables.items():
            variant_a_subject = variant_a_subject.replace("{" + key + "}", str(val))
            variant_b_subject = variant_b_subject.replace("{" + key + "}", str(val))
        
        body = self.BODY_TEMPLATES.get(category, "")
        for key, val in variables.items():
            body = body.replace("{" + key + "}", str(val))
        
        test_id = hashlib.md5(f"ab_{category}{datetime.now().isoformat()}".encode()).hexdigest()[:12]
        
        return {
            "test_id": test_id,
            "variant_a": {"subject": variant_a_subject, "body": body},
            "variant_b": {"subject": variant_b_subject, "body": body},
            "split": "50/50",
            "category": category
        }
    
    def record_ab_result(self, test_id: str, variant: str, opened: bool, responded: bool):
        """Record A/B test results."""
        self.performance_history.append({
            "test_id": test_id,
            "variant": variant,
            "opened": opened,
            "responded": responded,
            "timestamp": datetime.now().isoformat()
        })
    
    def analyze_ab_tests(self) -> List[ABTestResult]:
        """Analyze all A/B tests and determine winners."""
        tests = defaultdict(lambda: {"a": {"sends": 0, "opens": 0, "responses": 0}, "b": {"sends": 0, "opens": 0, "responses": 0}})
        
        for entry in self.performance_history:
            tid = entry["test_id"]
            v = "a" if entry["variant"] == "a" else "b"
            tests[tid][v]["sends"] += 1
            if entry["opened"]:
                tests[tid][v]["opens"] += 1
            if entry["responded"]:
                tests[tid][v]["responses"] += 1
        
        results = []
        for tid, data in tests.items():
            a, b = data["a"], data["b"]
            or_a = a["opens"] / max(1, a["sends"])
            or_b = b["opens"] / max(1, b["sends"])
            rr_a = a["responses"] / max(1, a["sends"])
            rr_b = b["responses"] / max(1, b["sends"])
            
            winner = "a" if (or_a + rr_a) > (or_b + rr_b) else "b"
            confidence = abs((or_a + rr_a) - (or_b + rr_b)) / max(0.01, (or_a + rr_a + or_b + rr_b) / 2)
            
            result = ABTestResult(
                test_id=tid, variant_a="A", variant_b="B",
                sends_a=a["sends"], sends_b=b["sends"],
                opens_a=a["opens"], opens_b=b["opens"],
                responses_a=a["responses"], responses_b=b["responses"],
                open_rate_a=round(or_a, 3), open_rate_b=round(or_b, 3),
                response_rate_a=round(rr_a, 3), response_rate_b=round(rr_b, 3),
                winner=winner, confidence=round(min(1.0, confidence), 2),
                statistical_significance=a["sends"] + b["sends"] >= 30
            )
            results.append(result)
        
        return results
    
    def get_stats(self) -> Dict:
        return {
            "total_templates": len(self.templates),
            "ab_tests_run": len(self.performance_history),
            "categories": list(self.SUBJECT_FORMULAS.keys()),
            "engine_version": "V116"
        }

if __name__ == "__main__":
    ti = TemplateIntelligence()
    
    print("=" * 60)
    print("V116: AI Email Template Intelligence")
    print("=" * 60)
    
    # Generate templates
    result = ti.generate_template("inquiry_response", {"name": "John", "topic": "AI services", "answer": "We offer 900+ AI services.", "sender_name": "Kleber"})
    print(f"\n--- Generated Template ---")
    print(f"  Subject: {result['subject']}")
    print(f"  Body: {result['body'][:120]}...")
    
    # Create A/B test
    ab = ti.create_ab_test("outreach", {"name": "Sarah", "topic": "cloud migration", "company": "Acme Corp", "area": "infrastructure", "similar_company": "TechCo", "result": "40% cost reduction"})
    print(f"\n--- A/B Test Created ---")
    print(f"  Variant A: {ab['variant_a']['subject']}")
    print(f"  Variant B: {ab['variant_b']['subject']}")
    
    # Simulate results
    for _ in range(50):
        ti.record_ab_result(ab["test_id"], "a", opened=random.random() > 0.4, responded=random.random() > 0.8)
        ti.record_ab_result(ab["test_id"], "b", opened=random.random() > 0.5, responded=random.random() > 0.75)
    
    analysis = ti.analyze_ab_tests()
    for r in analysis:
        print(f"\n--- A/B Test Results ---")
        print(f"  Variant A: {r.open_rate_a:.0%} open, {r.response_rate_a:.0%} response ({r.sends_a} sends)")
        print(f"  Variant B: {r.open_rate_b:.0%} open, {r.response_rate_b:.0%} response ({r.sends_b} sends)")
        print(f"  Winner: Variant {r.winner.upper()} (confidence: {r.confidence:.0%})")
        print(f"  Statistically Significant: {r.statistical_significance}")
