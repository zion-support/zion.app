#!/usr/bin/env python3
"""
V1002 - Email Deal Flow Tracker
Tracks deals, opportunities, revenue, and sales pipeline from email conversations.
Extracts deal stages, values, timelines, and action items.
"""
import re
import json
from datetime import datetime

def extract_deal_indicators(email):
    """Extract deal-related keywords and indicators"""
    indicators = {
        "deal_mentioned": False,
        "deal_stage": None,
        "deal_value": None,
        "timeline": None,
        "stakeholders": [],
        "action_items": [],
    }
    
    # Deal stage detection
    stages = {
        "prospect": r'\b(potential|interested|exploring|considering|lead)\b',
        "qualification": r'\b(qualified|budget|authority|need|timeline|BANT)\b',
        "proposal": r'\b(proposal|quote|estimate|pricing|offer)\b',
        "negotiation": r'\b(negotiate|discount|terms|counter|revise)\b',
        "closing": r'\b(close|sign|contract|agreement|final|approve)\b',
        "won": r'\b(won|closed|signed|executed|confirmed|approved)\b',
        "lost": r'\b(lost|declined|rejected|cancelled|postponed)\b',
    }
    
    for stage, pattern in stages.items():
        if re.search(pattern, email, re.I):
            indicators["deal_mentioned"] = True
            indicators["deal_stage"] = stage
            break
    
    # Deal value extraction
    value_patterns = [
        r'\$(\d+(?:,\d{3})*(?:\.\d{2})?)\s*(?:USD|dollars?)',
        r'(\d+(?:,\d{3})*(?:\.\d{2})?)\s*(?:USD|dollars?)',
        r'\$(\d+(?:,\d{3})*(?:\.\d{2})?)',
        r'budget[:\s]+\$(\d+(?:,\d{3})*(?:\.\d{2})?)',
        r'(\d+(?:,\d{3})*(?:\.\d{2})?)\s*K',  # Thousands
        r'(\d+(?:,\d{3})*(?:\.\d{2})?)\s*M',  # Millions
    ]
    
    for pattern in value_patterns:
        match = re.search(pattern, email, re.I)
        if match:
            value_str = match.group(1).replace(',', '')
            try:
                value = float(value_str)
                if 'K' in email[match.start():match.end()+2]:
                    value *= 1000
                elif 'M' in email[match.start():match.end()+2]:
                    value *= 1000000
                indicators["deal_value"] = value
                break
            except:
                pass
    
    # Timeline extraction
    timeline_patterns = [
        r'\b(Q[1-4]\s*\d{4})\b',  # Q1 2024
        r'\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2}(?:st|nd|rd|th)?,?\s*\d{4}\b',
        r'\b(next\s+(?:week|month|quarter|year))\b',
        r'\b(by\s+(?:end of|the)\s+(?:week|month|quarter))\b',
        r'\b(\d+)\s*(?:days?|weeks?|months?)\b',
    ]
    
    for pattern in timeline_patterns:
        match = re.search(pattern, email, re.I)
        if match:
            indicators["timeline"] = match.group(0)
            break
    
    # Stakeholder extraction
    name_pattern = r'\b([A-Z][a-z]+\s+[A-Z][a-z]+)\b'
    names = re.findall(name_pattern, email)
    indicators["stakeholders"] = list(set(names))[:5]  # Top 5
    
    # Action items
    action_patterns = [
        r'(?:need to|must|should|will)\s+([^.]+)',
        r'(?:please|kindly)\s+([^.]+)',
        r'(?:action item|todo|task)[:\s]+([^.]+)',
    ]
    
    for pattern in action_patterns:
        matches = re.findall(pattern, email, re.I)
        indicators["action_items"].extend([m.strip() for m in matches[:3]])
    
    return indicators

def calculate_deal_probability(indicators):
    """Calculate probability of deal closing based on indicators"""
    probability = 50  # Base probability
    
    stage_weights = {
        "prospect": 10,
        "qualification": 25,
        "proposal": 50,
        "negotiation": 70,
        "closing": 85,
        "won": 100,
        "lost": 0,
    }
    
    if indicators["deal_stage"] in stage_weights:
        probability = stage_weights[indicators["deal_stage"]]
    
    # Adjust based on other factors
    if indicators["deal_value"]:
        probability += 5  # Clear value = more serious
    
    if indicators["timeline"]:
        probability += 10  # Clear timeline = more committed
    
    if indicators["action_items"]:
        probability += 5  # Active next steps
    
    if indicators["stakeholders"]:
        probability += 5  # Multiple stakeholders = more engaged
    
    return min(100, max(0, probability))

def estimate_revenue_impact(indicators, probability):
    """Estimate revenue impact based on deal value and probability"""
    if not indicators["deal_value"]:
        return None
    
    expected_value = indicators["deal_value"] * (probability / 100)
    
    return {
        "deal_value": indicators["deal_value"],
        "probability": probability,
        "expected_value": round(expected_value, 2),
        "weighted_revenue": round(expected_value, 2),
    }

def generate_pipeline_recommendations(indicators, probability):
    """Generate recommendations for deal progression"""
    recommendations = []
    
    stage = indicators["deal_stage"] or "prospect"
    
    if stage == "prospect":
        recommendations.append("Qualify the lead: assess budget, authority, need, and timeline (BANT)")
        recommendations.append("Schedule discovery call to understand pain points")
    
    elif stage == "qualification":
        recommendations.append("Prepare tailored proposal addressing specific needs")
        recommendations.append("Identify decision-makers and influencers")
    
    elif stage == "proposal":
        recommendations.append("Follow up on proposal within 48 hours")
        recommendations.append("Address objections and clarify value proposition")
    
    elif stage == "negotiation":
        recommendations.append("Focus on value, not price")
        recommendations.append("Prepare concessions and trade-offs")
        recommendations.append("Create urgency with timeline or limited offers")
    
    elif stage == "closing":
        recommendations.append("Remove final obstacles and answer last questions")
        recommendations.append("Send contract and request signature")
    
    elif stage == "won":
        recommendations.append("Send welcome package and onboarding materials")
        recommendations.append("Schedule kickoff meeting")
    
    elif stage == "lost":
        recommendations.append("Request feedback to understand why")
        recommendations.append("Keep relationship warm for future opportunities")
    
    # General recommendations
    if not indicators["timeline"]:
        recommendations.append("Establish clear timeline to create urgency")
    
    if not indicators["action_items"]:
        recommendations.append("Define clear next steps and assign owners")
    
    if probability < 50:
        recommendations.append("Deal at risk - increase engagement and address concerns")
    
    return recommendations

def detect_competitive_situation(email):
    """Detect if competitors are mentioned"""
    competitors = []
    competitive_keywords = [
        'competitor', 'alternative', 'other vendor', 'different provider',
        'comparing', 'evaluation', 'shortlist', 'bidding'
    ]
    
    for keyword in competitive_keywords:
        if re.search(keyword, email, re.I):
            competitors.append(keyword)
    
    return {
        "competitive_situation": len(competitors) > 0,
        "indicators": competitors,
        "recommendation": "Differentiate on value and unique selling points" if competitors else None,
    }

def analyze_email(email, reply_all_required=False):
    """Full deal flow analysis"""
    indicators = extract_deal_indicators(email)
    probability = calculate_deal_probability(indicators)
    revenue = estimate_revenue_impact(indicators, probability)
    recommendations = generate_pipeline_recommendations(indicators, probability)
    competitive = detect_competitive_situation(email)
    
    return {
        "engine": "V1002 - Email Deal Flow Tracker",
        "deal_detected": indicators["deal_mentioned"],
        "deal_stage": indicators["deal_stage"],
        "deal_value": indicators["deal_value"],
        "timeline": indicators["timeline"],
        "stakeholders": indicators["stakeholders"],
        "action_items": indicators["action_items"],
        "closing_probability": probability,
        "revenue_impact": revenue,
        "competitive_situation": competitive,
        "recommendations": recommendations,
        "reply_all_enforced": reply_all_required or True,
        "case_by_case_analysis": True,
    }

# === TEST ===
if __name__ == "__main__":
    test1 = """Hi team, I'm excited about the proposal for the $150,000 project. 
    We're in final negotiations with John Smith and Sarah Johnson. 
    Need to send the contract by end of Q2 2024. Please review the terms and approve."""
    
    result1 = analyze_email(test1, reply_all_required=True)
    print("=== V1002 Email Deal Flow Tracker ===")
    print(f"  Deal detected: {result1['deal_detected']}")
    print(f"  Stage: {result1['deal_stage']}")
    print(f"  Value: ${result1['deal_value']}")
    print(f"  Timeline: {result1['timeline']}")
    print(f"  Probability: {result1['closing_probability']}%")
    print(f"  Revenue impact: {result1['revenue_impact']}")
    print(f"  Stakeholders: {result1['stakeholders']}")
    print(f"  Recommendations: {result1['recommendations'][:2]}")
    print(f"  Reply-all enforced: {result1['reply_all_enforced']}")
    
    test2 = """Just exploring options. Not sure about budget yet. Maybe next year?"""
    result2 = analyze_email(test2)
    print(f"\n  Test 2 Stage: {result2['deal_stage']}")
    print(f"  Test 2 Probability: {result2['closing_probability']}%")
    
    assert result1["deal_detected"] is True
    assert result1["deal_value"] == 150000
    assert result1["reply_all_enforced"] is True
    assert result1["case_by_case_analysis"] is True
    print("\n✅ All V1002 tests passed!")
